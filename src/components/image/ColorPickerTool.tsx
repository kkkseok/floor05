"use client";

import { useState, useRef, useCallback } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import { rgbToHex, rgbString, type RGB } from "@/lib/image/color-convert";
import { extractPalette } from "@/lib/image/palette";
import { trackToolUse } from "@/lib/common/analytics";

export default function ColorPickerTool() {
  const [loaded, setLoaded] = useState(false);
  const [palette, setPalette] = useState<RGB[]>([]);
  const [picked, setPicked] = useState<RGB | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);
  const usedRef = useRef(false);

  const onSelect = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setError(null);
    try {
      const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
      const canvas = canvasRef.current;
      if (!canvas) return;
      bitmapRef.current?.close();
      bitmapRef.current = bmp;
      const maxW = 520;
      const scale = Math.min(1, maxW / bmp.width);
      canvas.width = Math.round(bmp.width * scale);
      canvas.height = Math.round(bmp.height * scale);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(bmp, 0, 0, canvas.width, canvas.height);

      // 팔레트: 작은 캔버스로 다운스케일 후 추출
      const small = document.createElement("canvas");
      const ps = Math.min(80 / bmp.width, 80 / bmp.height, 1);
      small.width = Math.max(1, Math.round(bmp.width * ps));
      small.height = Math.max(1, Math.round(bmp.height * ps));
      const sctx = small.getContext("2d", { willReadFrequently: true });
      if (sctx) {
        sctx.drawImage(bmp, 0, 0, small.width, small.height);
        const data = sctx.getImageData(0, 0, small.width, small.height).data;
        setPalette(extractPalette(data, 6));
      }
      setPicked(null);
      setLoaded(true);
    } catch {
      setError("이미지를 불러오지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
    }
  }, []);

  // 화면의 미리보기(최대 520px로 줄인 것)가 아니라 원본 이미지에서 그 지점의 픽셀 하나를 읽는다.
  // 미리보기에서 읽으면 주변 픽셀과 섞인 평균색이 나왔다(1px 흑백 줄무늬 → #7F7F7F).
  function pickAt(e: React.PointerEvent) {
    const canvas = canvasRef.current;
    const bmp = bitmapRef.current;
    if (!canvas || !bmp) return;
    const rect = canvas.getBoundingClientRect();
    const clamp = (v: number, max: number) => Math.min(max - 1, Math.max(0, Math.floor(v)));
    const x = clamp(((e.clientX - rect.left) / rect.width) * bmp.width, bmp.width);
    const y = clamp(((e.clientY - rect.top) / rect.height) * bmp.height, bmp.height);
    const one = document.createElement("canvas");
    one.width = 1;
    one.height = 1;
    const octx = one.getContext("2d", { willReadFrequently: true });
    if (!octx) return;
    octx.imageSmoothingEnabled = false;
    octx.drawImage(bmp, x, y, 1, 1, 0, 0, 1, 1);
    const d = octx.getImageData(0, 0, 1, 1).data;
    setPicked({ r: d[0], g: d[1], b: d[2] });
    if (!usedRef.current) {
      usedRef.current = true;
      trackToolUse("image-color-picker");
    }
  }

  async function copy(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 1200);
    } catch {
      /* 무시 */
    }
  }

  return (
    <div className="space-y-6">
      <canvas
        ref={canvasRef}
        onPointerDown={pickAt}
        className={`mx-auto block max-h-[60vh] w-auto max-w-full rounded-xl ${loaded ? "cursor-crosshair" : "hidden"}`}
      />

      {!loaded && (
        <FileDropzone onFilesSelected={onSelect} accept="image/jpeg,image/png,image/webp" multiple={false} maxFiles={1} />
      )}

      {loaded && (
        <>
          <p className="text-center text-sm text-brand-mid">이미지를 클릭하면 그 지점의 색을 추출합니다.</p>

          {picked && (
            <div className="flex items-center gap-4 rounded-xl border border-brand-light bg-brand-white p-4">
              <span className="h-16 w-16 shrink-0 rounded-lg border border-brand-light" style={{ backgroundColor: rgbToHex(picked) }} />
              <div className="flex-1 space-y-1.5">
                <ColorRow label="HEX" value={rgbToHex(picked)} active={copied === "p-hex"} onCopy={() => copy(rgbToHex(picked), "p-hex")} />
                <ColorRow label="RGB" value={rgbString(picked)} active={copied === "p-rgb"} onCopy={() => copy(rgbString(picked), "p-rgb")} />
              </div>
            </div>
          )}

          {palette.length > 0 && (
            <div>
              <h3 className="mb-2 font-mono text-xs text-brand-accent uppercase tracking-wider">대표 색 팔레트</h3>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {palette.map((c, i) => {
                  const hex = rgbToHex(c);
                  return (
                    <button
                      key={i}
                      onClick={() => copy(hex, `pal-${i}`)}
                      className="group overflow-hidden rounded-lg border border-brand-light text-left"
                    >
                      <span className="block h-14 w-full" style={{ backgroundColor: hex }} />
                      <span className="block bg-brand-white px-2 py-1 text-center font-mono text-[11px] text-brand-black">
                        {copied === `pal-${i}` ? "복사됨" : hex}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            onClick={() => { setLoaded(false); setPicked(null); setPalette([]); }}
            className="w-full rounded-xl bg-brand-paper py-3 text-sm font-medium text-brand-mid transition-colors hover:text-brand-black"
          >
            다른 이미지 선택
          </button>
        </>
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <p className="text-xs text-brand-mid leading-relaxed">
        클릭한 지점의 색과 이미지의 대표 색 팔레트를 추출합니다. 색을 누르면 HEX 코드가 복사됩니다.
        색은 이 화면에 띄운 이미지에서 바로 읽어 오므로, 사진이 어디로 올라가지 않습니다.
      </p>
    </div>
  );
}

function ColorRow({ label, value, active, onCopy }: { label: string; value: string; active: boolean; onCopy: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 font-mono text-xs text-brand-mid">{label}</span>
      <span className="flex-1 font-mono text-brand-black">{value}</span>
      <button onClick={onCopy} className="rounded-md bg-brand-paper px-2.5 py-1 text-xs text-brand-mid transition-colors hover:text-brand-black">
        {active ? "복사됨" : "복사"}
      </button>
    </div>
  );
}
