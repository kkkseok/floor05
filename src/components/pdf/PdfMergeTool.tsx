"use client";

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import FileDropzone from "@/components/common/FileDropzone";
import { fileToArrayBuffer } from "@/lib/common/fileUtils";
import { mergePdfs, getPageCount } from "@/lib/pdf/merge";
import { ProtectedPdfError, pdfErrorMessage } from "@/lib/pdf/load";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

interface Item {
  id: string;
  file: File;
  pages: number | null; // null = 읽는 중, -1 = 읽기 실패
  problem?: "protected" | "unreadable";
}

let idSeq = 0;

export default function PdfMergeTool() {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addFiles = useCallback(async (files: File[]) => {
    setError(null);
    const added: Item[] = files.map((file) => ({ id: `pdf-${idSeq++}`, file, pages: null }));
    setItems((prev) => [...prev, ...added]);
    // 페이지 수 비동기 로드
    for (const item of added) {
      try {
        const buf = await fileToArrayBuffer(item.file);
        const pages = await getPageCount(buf);
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, pages } : it)));
      } catch (err) {
        const problem = err instanceof ProtectedPdfError ? "protected" : "unreadable";
        setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, pages: -1, problem } : it)));
      }
    }
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
    setItems((prev) => prev.filter((it) => it.id !== id));
  }

  const badItem = items.find((it) => it.pages === -1);

  async function merge() {
    if (items.length < 2 || busy || badItem) return;
    setBusy(true);
    setError(null);
    try {
      const buffers = await Promise.all(items.map((it) => fileToArrayBuffer(it.file)));
      const bytes = await mergePdfs(buffers);
      saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), "merged.pdf");
      trackToolUse("pdf-merge", { count: items.length });
      trackDownload("pdf-merge", "single");
    } catch (err) {
      setError(pdfErrorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      <FileDropzone onFilesSelected={addFiles} accept="application/pdf,.pdf" multiple maxFiles={20} />

      {items.length > 0 && (
        <>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={it.id} className="flex items-center gap-3 rounded-lg border border-brand-light bg-brand-white p-3">
                <span className="w-6 text-center font-mono text-sm text-brand-mid">{i + 1}</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-brand-paper text-xs font-mono text-brand-accent">PDF</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-brand-black">{it.file.name}</p>
                  <p className="text-xs text-brand-mid">
                    {it.pages === null ? "읽는 중…" : it.problem === "protected" ? "암호로 보호됨" : it.pages === -1 ? "읽을 수 없음" : `${it.pages}페이지`}
                  </p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <IconBtn label="위로" onClick={() => move(i, -1)} disabled={i === 0}>↑</IconBtn>
                  <IconBtn label="아래로" onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</IconBtn>
                  <IconBtn label="삭제" onClick={() => remove(it.id)}>✕</IconBtn>
                </div>
              </div>
            ))}
          </div>

          {badItem && (
            <p className="text-sm text-red-600">
              {pdfErrorMessage(
                badItem.problem === "protected" ? new ProtectedPdfError() : null,
                badItem.file.name,
              )}{" "}
              이 파일을 빼면 나머지는 바로 합칠 수 있어요.
            </p>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={merge}
            disabled={busy || items.length < 2 || !!badItem}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "합치는 중…" : items.length < 2 ? "PDF를 2개 이상 올려주세요" : `${items.length}개 PDF 합치기`}
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        위에서 아래 순서대로 페이지가 이어집니다. 모든 처리는 브라우저 안에서 이루어지며, 파일이
        서버로 전송되지 않습니다.
      </p>
    </div>
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
