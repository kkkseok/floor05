"use client";

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileDropzone from "@/components/common/FileDropzone";
import { canvasToBlob, fileToArrayBuffer, getFileNameWithoutExtension, getFileExtension, mimeToExtension, outputTypeFor, uniqueFileName } from "@/lib/common/fileUtils";
import { scanExif } from "@/lib/image/exifScan";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

interface Item {
  id: string;
  file: File;
  hasExif: boolean;
  hasGps: boolean;
}

let idSeq = 0;

export default function ExifRemoveTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (files: File[]) => {
    setError(null);
    for (const file of files) {
      const id = `f-${idSeq++}`;
      setItems((prev) => [...prev, { id, file, hasExif: false, hasGps: false }]);
      try {
        const buf = await fileToArrayBuffer(file);
        const { hasExif, hasGps } = scanExif(new Uint8Array(buf));
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, hasExif, hasGps } : it)));
      } catch {
        /* 스캔 실패는 무시(제거는 가능) */
      }
    }
  }, []);

  function remove(id: string) {
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  async function strip(file: File): Promise<{ blob: Blob; ext: string }> {
    const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
    const canvas = document.createElement("canvas");
    canvas.width = bmp.width;
    canvas.height = bmp.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("처리 실패");
    ctx.drawImage(bmp, 0, 0);
    bmp.close?.();
    // 입력 형식 유지(WebKit은 .webp의 File.type을 비워 두므로 확장자도 봄). WebP도 JPG와 같은 95%로 저장
    const type = outputTypeFor(file);
    const blob = await canvasToBlob(canvas, type, type === "image/png" ? undefined : 0.95);
    return { blob, ext: mimeToExtension(blob.type) };
  }

  async function process() {
    if (items.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (items.length === 1) {
        const { blob, ext } = await strip(items[0].file);
        saveAs(blob, `${getFileNameWithoutExtension(items[0].file.name)}_noexif.${ext}`);
        trackDownload("exif-remove", "single");
      } else {
        const zip = new JSZip();
        const usedNames = new Set<string>();
        for (const it of items) {
          const { blob, ext } = await strip(it.file);
          zip.file(uniqueFileName(`${getFileNameWithoutExtension(it.file.name)}_noexif.${ext}`, usedNames), blob);
        }
        const out = await zip.generateAsync({ type: "blob" });
        saveAs(out, "exif_removed.zip");
        trackDownload("exif-remove", "zip");
      }
      trackToolUse("exif-remove", { count: items.length });
    } catch {
      setError("이미지를 처리하지 못했습니다. JPG·PNG·WebP 파일인지 확인해 주세요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone onFilesSelected={addFiles} accept="image/jpeg,image/png,image/webp" multiple maxFiles={10} />

      {items.length > 0 && (
        <>
          <div className="space-y-2">
            {items.map((it) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-brand-light bg-brand-white p-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-brand-black">{it.file.name}</p>
                  <p className="text-xs">
                    {it.hasGps ? (
                      <span className="text-brand-accent">⚠ 위치정보(GPS) 포함</span>
                    ) : it.hasExif ? (
                      <span className="text-brand-mid">촬영정보(EXIF) 포함</span>
                    ) : (
                      <span className="text-brand-light">.{getFileExtension(it.file.name)} · 메타데이터 확인됨</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => remove(it.id)}
                  aria-label="삭제"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-brand-paper text-brand-mid transition-colors hover:text-brand-black"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={process}
            disabled={busy}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "처리 중…" : items.length === 1 ? "EXIF 제거하고 다운로드" : `${items.length}장 EXIF 제거 (ZIP)`}
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        사진을 다시 인코딩해 촬영 위치(GPS), 기기·렌즈 정보, 촬영 시각 같은 메타데이터를 모두
        제거합니다. SNS·중고거래에 올리기 전에 위치 노출을 막을 수 있습니다. 지우는 작업은 이 탭 안에서 끝나서, 지우려던 위치 정보가 도리어 어딘가로 전송될 일은 없습니다.
      </p>
    </div>
  );
}
