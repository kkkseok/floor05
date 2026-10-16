"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { saveAs } from "file-saver";
import FileDropzone from "@/components/common/FileDropzone";
import { canvasToBlob } from "@/lib/common/fileUtils";
import { drawImageDownscaled } from "@/lib/image/downscale";
import {
  imagesToPdf,
  type PageSize,
  type Orientation,
  type PdfImageItem,
} from "@/lib/pdf/imageToPdf";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

interface Item {
  id: string;
  file: File;
  url: string;
}

const MARGINS: { key: string; label: string; pt: number }[] = [
  { key: "none", label: "없음", pt: 0 },
  { key: "narrow", label: "좁게", pt: 20 },
  { key: "wide", label: "넓게", pt: 48 },
];

// 화질 프리셋. long = 긴 변 최대 픽셀(null이면 원본 유지).
// A4(210×297mm)의 긴 변 297mm를 300dpi로 뽑으면 3508px, 150dpi면 1754px.
// 실측(docs/blog-data/photo-pdf-size-2026-10-15.json): 카메라 사진 10장 기준
// 원본·92% 48.0MB → 인쇄용 9.8MB → 제출용 2.8MB (실제 도구, A4, 2026-10-15 재측정).
const QUALITY_PRESETS: { key: string; label: string; long: number | null; quality: number; hint: string }[] = [
  { key: "original", label: "원본", long: null, quality: 0.92, hint: "사진 해상도를 그대로 둡니다. 카메라 사진이면 장당 수 MB가 될 수 있어요." },
  { key: "print", label: "인쇄용", long: 3508, quality: 0.85, hint: "긴 변 3508px(A4 300dpi). A4로 인쇄해도 거칠어 보이지 않는 크기입니다." },
  { key: "submit", label: "제출용", long: 1754, quality: 0.85, hint: "긴 변 1754px(A4 150dpi). 화면으로 보는 제출 서류라면 충분하고 가장 가볍습니다." },
];

let idSeq = 0;

export default function ImageToPdfTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [pageSize, setPageSize] = useState<PageSize>("fit");
  const [orientation, setOrientation] = useState<Orientation>("auto");
  const [marginKey, setMarginKey] = useState("none");
  const [qualityKey, setQualityKey] = useState("original");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 최신 목록을 ref에 보관해 언마운트 시 남은 object URL을 모두 해제
  const itemsRef = useRef<Item[]>([]);
  itemsRef.current = items;
  useEffect(() => {
    return () => {
      itemsRef.current.forEach((it) => URL.revokeObjectURL(it.url));
    };
  }, []);

  const addFiles = useCallback((files: File[]) => {
    setError(null);
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({ id: `img-${idSeq++}`, file, url: URL.createObjectURL(file) })),
    ]);
  }, []);

  function move(index: number, dir: -1 | 1) {
    setItems((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function remove(id: string) {
    setItems((prev) => {
      const found = prev.find((it) => it.id === id);
      if (found) URL.revokeObjectURL(found.url);
      return prev.filter((it) => it.id !== id);
    });
  }

  async function fileToJpegItem(
    file: File,
    preset: (typeof QUALITY_PRESETS)[number],
  ): Promise<PdfImageItem> {
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const scale = preset.long ? Math.min(1, preset.long / Math.max(bitmap.width, bitmap.height)) : 1;
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("이미지를 처리할 수 없습니다.");
    // 투명 PNG는 흰 배경으로 채워 PDF에서 검게 보이지 않게
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // 인쇄용·제출용으로 크게 줄일 때 절반씩 나눠 그린다(Firefox·WebKit은 high 품질을 무시)
    drawImageDownscaled(ctx, bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, canvas.width, canvas.height);
    bitmap.close?.();
    const blob = await canvasToBlob(canvas, "image/jpeg", preset.quality);
    const buf = await blob.arrayBuffer();
    return { bytes: new Uint8Array(buf), width: canvas.width, height: canvas.height };
  }

  async function generate() {
    if (items.length === 0 || busy) return;
    setBusy(true);
    setError(null);
    try {
      const preset = QUALITY_PRESETS.find((q) => q.key === qualityKey) ?? QUALITY_PRESETS[0];
      const pdfImages: PdfImageItem[] = [];
      for (const it of items) {
        pdfImages.push(await fileToJpegItem(it.file, preset));
      }
      const margin = MARGINS.find((m) => m.key === marginKey)?.pt ?? 0;
      const bytes = await imagesToPdf(pdfImages, { pageSize, orientation, margin });
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "images.pdf");
      trackToolUse("image-to-pdf", { count: items.length, quality: preset.key });
      trackDownload("image-to-pdf", "single");
    } catch {
      setError("PDF를 만들지 못했습니다. 일부 이미지가 손상되었거나 형식이 지원되지 않을 수 있어요.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={addFiles}
        accept="image/jpeg,image/png,image/webp"
        multiple
        maxFiles={30}
      />

      {items.length > 0 && (
        <>
          {/* 이미지 목록 + 순서 */}
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-brand-light bg-brand-white p-2">
                <span className="w-6 text-center font-mono text-sm text-brand-mid">{i + 1}</span>
                <img src={it.url} alt="" className="h-12 w-12 rounded object-cover" />
                <span className="min-w-0 flex-1 truncate text-sm text-brand-black">{it.file.name}</span>
                <div className="flex shrink-0 gap-1">
                  <IconBtn label="위로" onClick={() => move(i, -1)} disabled={i === 0}>↑</IconBtn>
                  <IconBtn label="아래로" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</IconBtn>
                  <IconBtn label="삭제" onClick={() => remove(it.id)}>✕</IconBtn>
                </div>
              </div>
            ))}
          </div>

          {/* 옵션 */}
          <div className="space-y-4 rounded-xl bg-brand-paper p-4 sm:p-6">
            <OptionRow label="용지">
              <Seg active={pageSize === "fit"} onClick={() => setPageSize("fit")}>이미지 맞춤</Seg>
              <Seg active={pageSize === "a4"} onClick={() => setPageSize("a4")}>A4</Seg>
              <Seg active={pageSize === "letter"} onClick={() => setPageSize("letter")}>Letter</Seg>
            </OptionRow>
            {pageSize !== "fit" && (
              <OptionRow label="방향">
                <Seg active={orientation === "auto"} onClick={() => setOrientation("auto")}>자동</Seg>
                <Seg active={orientation === "portrait"} onClick={() => setOrientation("portrait")}>세로</Seg>
                <Seg active={orientation === "landscape"} onClick={() => setOrientation("landscape")}>가로</Seg>
              </OptionRow>
            )}
            <OptionRow label="화질">
              {QUALITY_PRESETS.map((q) => (
                <Seg key={q.key} active={qualityKey === q.key} onClick={() => setQualityKey(q.key)}>
                  {q.label}
                </Seg>
              ))}
            </OptionRow>
            <p className="text-xs leading-relaxed text-brand-mid">
              {QUALITY_PRESETS.find((q) => q.key === qualityKey)?.hint}
            </p>
            <OptionRow label="여백">
              {MARGINS.map((m) => (
                <Seg key={m.key} active={marginKey === m.key} onClick={() => setMarginKey(m.key)}>
                  {m.label}
                </Seg>
              ))}
            </OptionRow>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={generate}
            disabled={busy}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "PDF 만드는 중…" : `PDF로 변환 (${items.length}장)`}
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        이미지는 순서대로 한 장씩 PDF 페이지가 됩니다. PDF는 이 탭에서 바로 만들어져, 증빙·서류 사진이 외부로 전송되지 않습니다.
      </p>
    </div>
  );
}

function OptionRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-12 shrink-0 text-sm font-medium text-brand-black">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
        active ? "bg-brand-accent text-white" : "bg-brand-white text-brand-mid hover:text-brand-black"
      }`}
    >
      {children}
    </button>
  );
}

function IconBtn({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-paper text-brand-mid transition-colors hover:text-brand-black disabled:opacity-30"
    >
      {children}
    </button>
  );
}
