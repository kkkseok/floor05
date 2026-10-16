"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import FileDropzone from "@/components/common/FileDropzone";
import { canvasToBlob, getFileNameWithoutExtension, outputTypeFor, type OutputImageType } from "@/lib/common/fileUtils";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

type OutputType = OutputImageType;
const EXTENSIONS: Record<string, string> = { "image/jpeg": "jpg", "image/png": "png", "image/webp": "webp" };

export default function RotateTool() {
  const [bitmap, setBitmap] = useState<ImageBitmap | null>(null);
  const [name, setName] = useState("image");
  // 출력 형식은 입력을 따른다. 투명을 담을 수 있는 PNG·WebP를 JPG로 바꾸면 투명 영역이 검게 칠해진다.
  const [outputType, setOutputType] = useState<OutputType>("image/jpeg");
  const [rotation, setRotation] = useState(0); // 0/90/180/270
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const usedRef = useRef(false);

  const onSelect = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
      setBitmap(bmp);
      setName(getFileNameWithoutExtension(f.name));
      setOutputType(outputTypeFor(f));
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
    } catch {
      setError("이미지를 불러오지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
    }
  }, []);

  // 화면에 보이는 그림을 돌린다. 한쪽만 반전된 상태에서는 '반전 → 회전'이 '반대 방향 회전 → 반전'과 같다.
  function rotateBy(deg: 90 | -90) {
    const dir = flipH !== flipV ? -1 : 1;
    setRotation((r) => (r + dir * deg + 360) % 360);
  }

  const render = useCallback(
    (canvas: HTMLCanvasElement) => {
      if (!bitmap) return;
      const swap = rotation === 90 || rotation === 270;
      canvas.width = swap ? bitmap.height : bitmap.width;
      canvas.height = swap ? bitmap.width : bitmap.height;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.save();
      // 반전은 회전한 결과(화면)를 기준으로 한다. scale을 rotate 뒤에 두면 원본 기준으로 뒤집혀서
      // 90° 회전 후 '좌우 반전'이 상하로 뒤집혔다.
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
      ctx.restore();
    },
    [bitmap, rotation, flipH, flipV],
  );

  useEffect(() => {
    if (canvasRef.current) render(canvasRef.current);
  }, [render]);

  async function download() {
    const canvas = canvasRef.current;
    if (!canvas || !bitmap) return;
    if (!usedRef.current) {
      usedRef.current = true;
      trackToolUse("rotate");
    }
    const blob = await canvasToBlob(
      canvas,
      outputType,
      outputType === "image/png" ? undefined : 0.92,
    );
    // WebP 인코딩을 지원하지 않는 브라우저는 PNG를 돌려주므로 실제 결과 형식으로 확장자를 정한다.
    saveAs(blob, `${name}_회전.${EXTENSIONS[blob.type] ?? "png"}`);
    trackDownload("rotate", "single");
  }

  return (
    <div className="space-y-6">
      {!bitmap ? (
        <FileDropzone onFilesSelected={onSelect} accept="image/jpeg,image/png,image/webp" multiple={false} maxFiles={1} />
      ) : (
        <>
          <div className="rounded-xl bg-brand-paper p-3">
            <canvas ref={canvasRef} className="mx-auto max-h-[60vh] w-auto max-w-full rounded" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <Btn onClick={() => rotateBy(-90)}>↺ 왼쪽 90°</Btn>
            <Btn onClick={() => rotateBy(90)}>↻ 오른쪽 90°</Btn>
            <Btn active={flipH} onClick={() => setFlipH((v) => !v)}>좌우 반전</Btn>
            <Btn active={flipV} onClick={() => setFlipV((v) => !v)}>상하 반전</Btn>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => { setRotation(0); setFlipH(false); setFlipV(false); }}
              className="rounded-xl bg-brand-paper px-4 py-3 text-sm font-medium text-brand-mid transition-colors hover:text-brand-black"
            >
              초기화
            </button>
            <button
              onClick={download}
              className="flex-1 rounded-xl bg-brand-accent py-3 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light"
            >
              다운로드
            </button>
          </div>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-brand-mid leading-relaxed">
        세로로 찍힌 사진의 방향을 바로잡거나 좌우·상하로 뒤집습니다. 모든 처리는 브라우저에서
        이루어지며, 파일이 서버로 전송되지 않습니다.
      </p>
    </div>
  );
}

function Btn({ active, onClick, children }: { active?: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl py-3 text-sm font-medium transition-all ${
        active ? "bg-brand-accent text-white" : "bg-brand-paper text-brand-black hover:bg-brand-light/40"
      }`}
    >
      {children}
    </button>
  );
}
