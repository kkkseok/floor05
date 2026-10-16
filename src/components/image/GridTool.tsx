"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileDropzone from "@/components/common/FileDropzone";
import {
  canvasToBlob,
  getFileNameWithoutExtension,
  mimeToExtension,
  outputTypeFor,
  type OutputImageType,
} from "@/lib/common/fileUtils";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

const PRESETS: { key: string; label: string; rows: number; cols: number; square: boolean }[] = [
  { key: "3x3", label: "3×3 (인스타 9분할)", rows: 3, cols: 3, square: true },
  { key: "1x3", label: "가로 3분할", rows: 1, cols: 3, square: false },
  { key: "3x1", label: "세로 3분할", rows: 3, cols: 1, square: false },
  { key: "2x2", label: "2×2", rows: 2, cols: 2, square: true },
];

export default function GridTool() {
  const [loaded, setLoaded] = useState(false);
  const [name, setName] = useState("image");
  // 출력 형식은 입력을 따른다(투명 WebP를 JPG로 바꾸면 투명 영역이 검게 칠해졌다)
  const [outputType, setOutputType] = useState<OutputImageType>("image/jpeg");
  const [presetKey, setPresetKey] = useState("3x3");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  const preset = PRESETS.find((p) => p.key === presetKey)!;

  // 정사각 중앙 크롭이면 source 영역 계산
  const sourceRegion = useCallback(
    (bmp: ImageBitmap) => {
      if (!preset.square) return { sx: 0, sy: 0, sw: bmp.width, sh: bmp.height };
      const side = Math.min(bmp.width, bmp.height);
      return { sx: (bmp.width - side) / 2, sy: (bmp.height - side) / 2, sw: side, sh: side };
    },
    [preset.square],
  );

  const drawPreview = useCallback(() => {
    const canvas = canvasRef.current;
    const bmp = bitmapRef.current;
    if (!canvas || !bmp) return;
    const { sx, sy, sw, sh } = sourceRegion(bmp);
    const maxW = 520;
    const scale = Math.min(1, maxW / sw);
    canvas.width = Math.round(sw * scale);
    canvas.height = Math.round(sh * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(bmp, sx, sy, sw, sh, 0, 0, canvas.width, canvas.height);
    // 그리드 선
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2;
    for (let c = 1; c < preset.cols; c++) {
      const x = (canvas.width / preset.cols) * c;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    for (let r = 1; r < preset.rows; r++) {
      const y = (canvas.height / preset.rows) * r;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, [preset, sourceRegion]);

  useEffect(() => {
    if (loaded) drawPreview();
  }, [loaded, drawPreview]);

  const onSelect = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
      bitmapRef.current = bmp;
      setName(getFileNameWithoutExtension(f.name));
      setOutputType(outputTypeFor(f));
      setLoaded(true);
    } catch {
      setError("이미지를 불러오지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
    }
  }, []);

  async function generate() {
    const bmp = bitmapRef.current;
    if (!bmp || busy) return;
    setBusy(true);
    setError(null);
    try {
      const { sx, sy, sw, sh } = sourceRegion(bmp);
      const cellW = sw / preset.cols;
      const cellH = sh / preset.rows;
      const quality = outputType === "image/png" ? undefined : 0.92;
      const zip = new JSZip();
      let n = 0;
      for (let r = 0; r < preset.rows; r++) {
        for (let c = 0; c < preset.cols; c++) {
          n++;
          const cell = document.createElement("canvas");
          cell.width = Math.round(cellW);
          cell.height = Math.round(cellH);
          const ctx = cell.getContext("2d");
          if (!ctx) continue;
          ctx.drawImage(bmp, sx + c * cellW, sy + r * cellH, cellW, cellH, 0, 0, cell.width, cell.height);
          const blob = await canvasToBlob(cell, outputType, quality);
          zip.file(`${name}_${String(n).padStart(2, "0")}.${mimeToExtension(blob.type)}`, blob);
        }
      }
      const out = await zip.generateAsync({ type: "blob" });
      saveAs(out, `${name}_분할.zip`);
      trackToolUse("image-grid", { preset: presetKey });
      trackDownload("image-grid", "zip");
    } catch {
      setError("이미지를 분할하지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {!loaded ? (
        <FileDropzone onFilesSelected={onSelect} accept="image/jpeg,image/png,image/webp" multiple={false} maxFiles={1} />
      ) : (
        <>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPresetKey(p.key)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                  presetKey === p.key ? "bg-brand-accent text-white" : "bg-brand-paper text-brand-mid hover:text-brand-black"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="rounded-xl bg-brand-paper p-3">
            <canvas ref={canvasRef} className="mx-auto block max-h-[60vh] w-auto max-w-full rounded" />
          </div>

          {preset.square && (
            <p className="text-center text-xs text-brand-mid">정사각형으로 중앙을 잘라 {preset.rows * preset.cols}칸으로 나눕니다.</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={generate}
            disabled={busy}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "분할 중…" : `${preset.rows * preset.cols}칸으로 분할 (ZIP)`}
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        나뉜 이미지는 왼쪽 위부터 번호 순서로 ZIP에 담깁니다. 인스타그램에는 마지막 번호부터 거꾸로(9→1)
        올려야 프로필에서 한 장처럼 이어집니다. 조각은 이 탭에서 잘라 바로 ZIP으로 묶으니 원본 사진은 내 기기를 떠나지 않습니다.
      </p>
    </div>
  );
}
