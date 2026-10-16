"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { saveAs } from "file-saver";
import FileDropzone from "@/components/common/FileDropzone";
import {
  canvasToBlob,
  getFileNameWithoutExtension,
  mimeToExtension,
  outputTypeFor,
  type OutputImageType,
} from "@/lib/common/fileUtils";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

const MAX_DIM = 2000;

interface Region {
  x: number;
  y: number;
  w: number;
  h: number;
  mode: Mode;
  block: number;
}
type Mode = "mosaic" | "blur";

interface Sel {
  x: number;
  y: number;
  w: number;
  h: number;
}

export default function MosaicTool() {
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("image");
  // 출력 형식은 입력을 따른다(투명 WebP를 JPG로 바꾸면 투명 영역이 검게 칠해졌다)
  const [outputType, setOutputType] = useState<OutputImageType>("image/jpeg");
  const [mode, setMode] = useState<Mode>("mosaic");
  const [strength, setStrength] = useState(12);
  const [sel, setSel] = useState<Sel | null>(null);
  const [applied, setApplied] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const usedRef = useRef(false);
  // 적용한 영역 기록(편집 캔버스 좌표). 다운로드 때 원본 해상도 캔버스에 같은 순서로 다시 적용한다.
  const regionsRef = useRef<Region[]>([]);

  const drawBase = useCallback(() => {
    const canvas = canvasRef.current;
    const bmp = bitmapRef.current;
    if (!canvas || !bmp) return;
    const scale = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    const ctx = canvas.getContext("2d");
    ctx?.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  }, []);

  // 캔버스는 loaded가 true가 된 뒤에야 만들어진다. requestAnimationFrame으로 그리면
  // 캔버스가 생기기 전에 실행돼 300×150 빈 캔버스가 남는 경합이 있었다(E2E 12회 중 4회).
  useEffect(() => {
    if (loaded) drawBase();
  }, [loaded, drawBase]);

  const onSelect = useCallback(
    async (files: File[]) => {
      const f = files[0];
      if (!f) return;
      setError(null);
      try {
        const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
        bitmapRef.current = bmp;
        setName(getFileNameWithoutExtension(f.name));
        setOutputType(outputTypeFor(f));
        setApplied(0);
        regionsRef.current = [];
        setLoaded(true);
      } catch {
        setError("이미지를 불러오지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
      }
    },
    [drawBase],
  );

  // 화면 좌표 → 캔버스 픽셀 좌표
  function toCanvas(clientX: number, clientY: number) {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const sx = canvas.width / rect.width;
    const sy = canvas.height / rect.height;
    return { x: (clientX - rect.left) * sx, y: (clientY - rect.top) * sy, rect };
  }

  function onPointerDown(e: React.PointerEvent) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    const p = toCanvas(e.clientX, e.clientY);
    dragStart.current = { x: p.x, y: p.y };
    setSel({ x: e.clientX - p.rect.left, y: e.clientY - p.rect.top, w: 0, h: 0 });
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragStart.current) return;
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const x0 = (dragStart.current.x * rect.width) / canvas.width;
    const y0 = (dragStart.current.y * rect.height) / canvas.height;
    const x1 = e.clientX - rect.left;
    const y1 = e.clientY - rect.top;
    setSel({ x: Math.min(x0, x1), y: Math.min(y0, y1), w: Math.abs(x1 - x0), h: Math.abs(y1 - y0) });
  }

  function onPointerUp(e: React.PointerEvent) {
    const start = dragStart.current;
    dragStart.current = null;
    setSel(null);
    if (!start) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const p = toCanvas(e.clientX, e.clientY);
    const x = Math.max(0, Math.min(start.x, p.x));
    const y = Math.max(0, Math.min(start.y, p.y));
    const w = Math.min(canvas.width - x, Math.abs(p.x - start.x));
    const h = Math.min(canvas.height - y, Math.abs(p.y - start.y));
    if (w < 4 || h < 4) return; // 너무 작은 영역 무시
    const region: Region = {
      x: Math.round(x),
      y: Math.round(y),
      w: Math.round(w),
      h: Math.round(h),
      mode,
      block: Math.max(2, strength),
    };
    applyRegion(canvas, region, 1);
    regionsRef.current.push(region);
    setApplied((n) => n + 1);
    if (!usedRef.current) {
      usedRef.current = true;
      trackToolUse("mosaic");
    }
  }

  /** target 캔버스에 region을 적용한다. scale = target 픽셀 / 편집 캔버스 픽셀 */
  function applyRegion(target: HTMLCanvasElement, r: Region, scale: number) {
    const ctx = target.getContext("2d");
    if (!ctx) return;
    const x = Math.round(r.x * scale);
    const y = Math.round(r.y * scale);
    const w = Math.max(1, Math.min(target.width - x, Math.round(r.w * scale)));
    const h = Math.max(1, Math.min(target.height - y, Math.round(r.h * scale)));
    // 칸 크기도 같은 비율로 키워, 원본 해상도에서도 화면에서 본 것과 같은 굵기의 모자이크가 되게 한다
    const bs = Math.max(2, r.block * scale);
    const tw = Math.max(1, Math.round(w / bs));
    const th = Math.max(1, Math.round(h / bs));
    const tmp = document.createElement("canvas");
    tmp.width = tw;
    tmp.height = th;
    const tctx = tmp.getContext("2d");
    if (!tctx) return;
    // 영역을 작게 축소
    tctx.imageSmoothingEnabled = r.mode === "blur";
    tctx.drawImage(target, x, y, w, h, 0, 0, tw, th);
    // 다시 확대해 덮어쓰기 (모자이크=계단식, 블러=부드럽게)
    ctx.imageSmoothingEnabled = r.mode === "blur";
    ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
    ctx.imageSmoothingEnabled = true;
  }

  /**
   * 저장용 캔버스. 편집 캔버스는 성능 때문에 긴 변 2000px로 줄여 보여주므로, 원본이 더 크면
   * 원본 해상도 캔버스를 새로 만들어 기록한 영역을 다시 적용한다(예전에는 2000px로 줄어 저장됐다).
   */
  function renderFullResolution(): HTMLCanvasElement | null {
    const canvas = canvasRef.current;
    const bmp = bitmapRef.current;
    if (!canvas || !bmp) return canvas;
    if (bmp.width === canvas.width && bmp.height === canvas.height) return canvas;
    const full = document.createElement("canvas");
    full.width = bmp.width;
    full.height = bmp.height;
    const ctx = full.getContext("2d");
    if (!ctx) return canvas;
    ctx.drawImage(bmp, 0, 0);
    const scale = bmp.width / canvas.width;
    for (const r of regionsRef.current) applyRegion(full, r, scale);
    return full;
  }

  async function download() {
    const canvas = renderFullResolution();
    if (!canvas) return;
    const blob = await canvasToBlob(canvas, outputType, outputType === "image/png" ? undefined : 0.92);
    saveAs(blob, `${name}_모자이크.${mimeToExtension(blob.type)}`);
    trackDownload("mosaic", "single");
  }

  return (
    <div className="space-y-6">
      {!loaded ? (
        <FileDropzone onFilesSelected={onSelect} accept="image/jpeg,image/png,image/webp" multiple={false} maxFiles={1} />
      ) : (
        <>
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex gap-2">
              <Seg active={mode === "mosaic"} onClick={() => setMode("mosaic")}>모자이크</Seg>
              <Seg active={mode === "blur"} onClick={() => setMode("blur")}>블러</Seg>
            </div>
            <div className="flex flex-1 items-center gap-3">
              <span className="text-sm font-medium text-brand-black">강도</span>
              <input
                type="range"
                min={4}
                max={40}
                value={strength}
                onChange={(e) => setStrength(Number(e.target.value))}
                className="flex-1 accent-brand-accent"
              />
              <span className="w-8 text-right font-mono text-sm text-brand-mid">{strength}</span>
            </div>
          </div>

          <div className="relative rounded-xl bg-brand-paper p-3">
            <canvas
              ref={canvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              className="mx-auto block max-h-[60vh] w-auto max-w-full cursor-crosshair touch-none rounded"
            />
            {sel && sel.w > 0 && (
              <div
                className="pointer-events-none absolute border-2 border-brand-accent bg-brand-accent/20"
                style={{ left: sel.x + 12, top: sel.y + 12, width: sel.w, height: sel.h }}
              />
            )}
          </div>

          <p className="text-center text-sm text-brand-mid">
            가릴 부분을 드래그하세요. {applied > 0 && `(${applied}곳 적용됨)`}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => { drawBase(); setApplied(0); regionsRef.current = []; }}
              className="rounded-xl bg-brand-paper px-4 py-3 text-sm font-medium text-brand-mid transition-colors hover:text-brand-black"
            >
              초기화
            </button>
            <button
              onClick={download}
              disabled={applied === 0}
              className="flex-1 rounded-xl bg-brand-accent py-3 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
            >
              다운로드
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-brand-mid leading-relaxed">
        얼굴·차량 번호판·주소 같은 개인정보를 가릴 때 쓰세요. 가린 부분은 원본 정보가 사라져 복원할
        수 없습니다. 모든 처리는 브라우저에서 이루어지며, 파일이 서버로 전송되지 않습니다.
      </p>
    </div>
  );
}

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
        active ? "bg-brand-accent text-white" : "bg-brand-paper text-brand-mid hover:text-brand-black"
      }`}
    >
      {children}
    </button>
  );
}
