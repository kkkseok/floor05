"use client";

import { useState, useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import FileDropzone from "@/components/common/FileDropzone";
import { fileToArrayBuffer, getFileNameWithoutExtension } from "@/lib/common/fileUtils";
import { getPageCount } from "@/lib/pdf/merge";
import { parsePageRanges, extractPages, splitAllPages } from "@/lib/pdf/split";
import { pdfErrorMessage } from "@/lib/pdf/load";
import { trackToolUse, trackDownload } from "@/lib/common/analytics";

type Mode = "extract" | "all";

export default function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number | null>(null);
  const [mode, setMode] = useState<Mode>("extract");
  const [rangeInput, setRangeInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSelect = useCallback(async (files: File[]) => {
    const f = files[0];
    if (!f) return;
    setFile(f);
    setPageCount(null);
    setError(null);
    setRangeInput("");
    try {
      const buf = await fileToArrayBuffer(f);
      setPageCount(await getPageCount(buf));
    } catch (err) {
      setError(pdfErrorMessage(err, f.name));
      setFile(null);
    }
  }, []);

  async function run() {
    if (!file || busy) return;
    setBusy(true);
    setError(null);
    try {
      const buf = await fileToArrayBuffer(file);
      const base = getFileNameWithoutExtension(file.name);

      if (mode === "extract") {
        const indices = parsePageRanges(rangeInput, pageCount ?? 0);
        if (!indices) {
          setError(`페이지 범위를 다시 확인해 주세요. 1부터 ${pageCount}까지, 예: 1-3, 5`);
          setBusy(false);
          return;
        }
        const bytes = await extractPages(buf, indices);
        saveAs(new Blob([new Uint8Array(bytes)], { type: "application/pdf" }), `${base}_추출.pdf`);
        trackDownload("pdf-split", "single");
      } else {
        const files = await splitAllPages(buf, base);
        const zip = new JSZip();
        files.forEach((f) => zip.file(f.name, f.bytes));
        const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" });
        saveAs(blob, `${base}_분할.zip`);
        trackDownload("pdf-split", "zip");
      }
      trackToolUse("pdf-split", { mode });
    } catch (err) {
      setError(pdfErrorMessage(err, file.name));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* 파일 읽기 실패(깨진 PDF 등)는 file이 null로 돌아가므로 에러를 분기 밖에서 표시한다 */}
      {!file && error && <p className="text-sm text-red-600">{error}</p>}
      {!file ? (
        <FileDropzone onFilesSelected={onSelect} accept="application/pdf,.pdf" multiple={false} maxFiles={1} />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-lg border border-brand-light bg-brand-white p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-brand-paper text-xs font-mono text-brand-accent">PDF</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm text-brand-black">{file.name}</p>
              <p className="text-xs text-brand-mid">
                {pageCount === null ? "읽는 중…" : `총 ${pageCount}페이지`}
              </p>
            </div>
            <button
              onClick={() => { setFile(null); setPageCount(null); setError(null); }}
              aria-label="파일 변경"
              className="shrink-0 rounded-md bg-brand-paper px-3 py-1.5 text-xs text-brand-mid transition-colors hover:text-brand-black"
            >
              변경
            </button>
          </div>

          {/* 모드 */}
          <div className="flex gap-2">
            <Tab active={mode === "extract"} onClick={() => setMode("extract")}>페이지 추출</Tab>
            <Tab active={mode === "all"} onClick={() => setMode("all")}>낱장 전부 분할</Tab>
          </div>

          {mode === "extract" ? (
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-brand-black" htmlFor="range">
                추출할 페이지
              </label>
              <input
                id="range"
                type="text"
                value={rangeInput}
                onChange={(e) => setRangeInput(e.target.value)}
                placeholder="예: 1-3, 5, 8-10"
                className="w-full rounded-xl border border-brand-light bg-brand-white px-4 py-3 font-mono text-brand-black focus:border-brand-accent focus:outline-none"
              />
              <p className="text-xs text-brand-mid">
                쉼표로 여러 범위를. 입력 순서대로 새 PDF 한 개로 묶입니다.
              </p>
            </div>
          ) : (
            <p className="rounded-lg bg-brand-paper p-4 text-sm text-brand-mid">
              모든 페이지를 1장짜리 PDF로 나눠 ZIP 한 개로 내려받습니다.
              {pageCount ? ` (${pageCount}개 파일)` : ""} 글꼴을 내장한 문서는 낱장마다 같은 글꼴이 다시 들어가서,
              ZIP이 원본보다 몇 배 커질 수 있어요. 필요한 페이지만 있다면 &lsquo;페이지 추출&rsquo;이 훨씬 가볍습니다.
            </p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={run}
            disabled={busy || pageCount === null || (mode === "extract" && rangeInput.trim() === "")}
            className="w-full rounded-xl bg-brand-accent py-4 text-lg font-medium text-white transition-colors hover:bg-brand-accent-light disabled:opacity-50"
          >
            {busy ? "처리 중…" : mode === "extract" ? "선택 페이지 추출" : "낱장으로 분할 (ZIP)"}
          </button>
        </>
      )}

      <p className="text-xs text-brand-mid leading-relaxed">
        페이지를 떼어 내는 작업도 이 탭 안에서만 일어나므로, 원본 PDF는 밖으로 나가지 않습니다.
      </p>
    </div>
  );
}

function Tab({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium transition-all ${
        active ? "bg-brand-accent text-white" : "bg-brand-paper text-brand-mid hover:text-brand-black"
      }`}
    >
      {children}
    </button>
  );
}
