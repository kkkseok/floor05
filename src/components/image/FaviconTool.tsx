"use client";

import { useState, useRef, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileDropzone from "@/components/common/FileDropzone";
import { canvasToBlob } from "@/lib/common/fileUtils";
import { downscaleToCanvas } from "@/lib/image/downscale";
import { buildIco } from "@/lib/image/ico";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

const HTML_SNIPPET = `<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">`;

const MANIFEST = JSON.stringify(
  {
    icons: [
      { src: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
      { src: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
    ],
  },
  null,
  2,
);

export default function FaviconTool() {
  const [loaded, setLoaded] = useState(false);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);
  const bitmapRef = useRef<ImageBitmap | null>(null);

  // 중앙 정사각 크롭 영역
  function squareCrop(bmp: ImageBitmap) {
    const side = Math.min(bmp.width, bmp.height);
    return { sx: (bmp.width - side) / 2, sy: (bmp.height - side) / 2, side };
  }

  const drawPreview = useCallback(() => {
    const canvas = previewRef.current;
    const bmp = bitmapRef.current;
    if (!canvas || !bmp) return;
    const { sx, sy, side } = squareCrop(bmp);
    canvas.width = 96;
    canvas.height = 96;
    const ctx = canvas.getContext("2d");
    ctx?.clearRect(0, 0, 96, 96);
    ctx?.drawImage(downscaleToCanvas(bmp, sx, sy, side, side, 96, 96), 0, 0);
  }, []);

  const onSelect = useCallback(
    async (files: File[]) => {
      const f = files[0];
      if (!f) return;
      setError(null);
      try {
        const bmp = await createImageBitmap(f, { imageOrientation: "from-image" });
        bitmapRef.current = bmp;
        setLoaded(true);
        requestAnimationFrame(drawPreview);
      } catch {
        setError("이미지를 불러오지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
      }
    },
    [drawPreview],
  );

  async function renderPng(size: number): Promise<Uint8Array> {
    const bmp = bitmapRef.current!;
    const { sx, sy, side } = squareCrop(bmp);
    // 1024px → 16px처럼 크게 줄일 때 한 번에 그리면 계단이 생기므로 절반씩 줄인다
    const canvas = downscaleToCanvas(bmp, sx, sy, side, side, size, size);
    const blob = await canvasToBlob(canvas, "image/png");
    return new Uint8Array(await blob.arrayBuffer());
  }

  async function generate() {
    if (!bitmapRef.current || busy) return;
    setBusy(true);
    setError(null);
    try {
      const [p16, p32, p48, p180, p192, p512] = await Promise.all([
        renderPng(16),
        renderPng(32),
        renderPng(48),
        renderPng(180),
        renderPng(192),
        renderPng(512),
      ]);
      const ico = buildIco([
        { size: 16, bytes: p16 },
        { size: 32, bytes: p32 },
        { size: 48, bytes: p48 },
      ]);

      const zip = new JSZip();
      zip.file("favicon.ico", ico);
      zip.file("favicon-16x16.png", p16);
      zip.file("favicon-32x32.png", p32);
      zip.file("apple-touch-icon.png", p180);
      zip.file("android-chrome-192x192.png", p192);
      zip.file("android-chrome-512x512.png", p512);
      zip.file("site.webmanifest", MANIFEST);
      zip.file("head-snippet.html", HTML_SNIPPET);

      const out = await zip.generateAsync({ type: "blob" });
      saveAs(out, "favicon.zip");
      trackToolUse("favicon");
      trackDownload("favicon", "zip");
    } catch {
      setError("파비콘을 만들지 못했습니다. 다시 시도해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  async function copySnippet() {
    try {
      await navigator.clipboard.writeText(HTML_SNIPPET);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 무시 */
    }
  }

  return (
    <div className="space-y-6">
      {!loaded ? (
        <FileDropzone onFilesSelected={onSelect} accept="image/jpeg,image/png,image/webp" multiple={false} maxFiles={1} />
      ) : (
        <>
          {/* 미리보기 */}
          <div className="flex items-center gap-6 rounded-xl bg-brand-paper p-4">
            <canvas ref={previewRef} className="h-16 w-16 rounded-lg border border-brand-light" />
            <div className="text-sm text-brand-mid">
              <p className="text-brand-black font-medium">정사각형으로 중앙을 잘라 생성합니다.</p>
              <p className="mt-1 text-xs">favicon.ico(16·32·48) + PNG 5종 + manifest를 ZIP으로.</p>
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={generate}
            disabled={busy}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "만드는 중…" : "파비콘 생성 (ZIP 다운로드)"}
          </button>

          {/* HTML 스니펫 */}
          <div className="rounded-xl bg-brand-black p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs text-brand-accent uppercase tracking-wider">&lt;head&gt; 에 붙여넣기</span>
              <button onClick={copySnippet} className="rounded-md bg-brand-accent px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-brand-accent-light">
                {copied ? "복사됨" : "복사"}
              </button>
            </div>
            <pre className="overflow-x-auto whitespace-pre text-[11px] leading-relaxed text-brand-paper">{HTML_SNIPPET}</pre>
          </div>

          <button
            onClick={() => { setLoaded(false); bitmapRef.current = null; }}
            className="w-full rounded-xl bg-brand-paper py-3 text-sm font-medium text-brand-mid transition-colors hover:text-brand-black"
          >
            다른 이미지 선택
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        favicon.ico에 16·32·48px를 함께 담고, 모바일·PWA용 아이콘과 site.webmanifest까지 ZIP으로
        만듭니다. 압축을 풀어 사이트 루트에 올리고 위 코드를 &lt;head&gt;에 넣으면 됩니다. 모든
        처리는 브라우저에서 이루어지며, 파일이 서버로 전송되지 않습니다.
      </p>
    </div>
  );
}
