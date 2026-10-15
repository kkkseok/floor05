"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import DownloadButton from "@/components/common/DownloadButton";
import {
  formatFileSize,
  getMaxBatchSize,
  fileToDataUrl,
  loadImage,
  validateImageFiles,
  mimeToExtension,
  getFileExtension,
} from "@/lib/common/fileUtils";
import {
  mergeImages,
  MergeResult,
  MergeDirection,
  MergeSizeStrategy,
} from "@/lib/image/merge";
import { useBeforeUnload, useMaxBatchSize } from "@/lib/common/hooks";
import { trackToolUse } from "@/lib/common/analytics";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp";
type OutputFormat = "image/jpeg" | "image/png";

interface SourceImage {
  id: string;
  file: File;
  dataUrl: string;
  width: number;
  height: number;
}

export default function MergeTool() {
  const [images, setImages] = useState<SourceImage[]>([]);
  const [direction, setDirection] = useState<MergeDirection>("vertical");
  const [sizeStrategy, setSizeStrategy] = useState<MergeSizeStrategy>("match");
  const [gap, setGap] = useState(0);
  const [background, setBackground] = useState("#FFFFFF");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("image/jpeg");
  // 사용자가 형식을 직접 고르기 전까지는 입력에 맞춰 기본값을 정한다.
  // 전부 PNG(화면 캡처 등)면 PNG: 실측상 캡처 5장 PNG가 JPG보다 15% 클 뿐인데 글자는 무손실로 남는다.
  const formatTouchedRef = useRef(false);
  const [quality, setQuality] = useState(92);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<MergeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  useBeforeUnload(isProcessing);
  const maxBatchSize = useMaxBatchSize();

  // 결과가 생기면 한 번 결과 영역으로 스크롤
  const resultRef = useRef<HTMLDivElement>(null);
  const hadResultRef = useRef(false);
  useEffect(() => {
    if (!hadResultRef.current && result) {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hadResultRef.current = Boolean(result);
  }, [result]);

  const imagesRef = useRef<SourceImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // 파일 추가 (형식/크기 검증 + 치수 측정 + 장수 제한)
  const handleFilesAdd = useCallback(async (files: File[]) => {
    const maxBatch = getMaxBatchSize();
    const notices: string[] = [];

    const { valid, oversize, unsupported } = validateImageFiles(files, ACCEPT_IMAGE);
    if (unsupported > 0) notices.push(`${unsupported}개 파일은 지원하지 않는 형식이라 제외했어요.`);
    if (oversize > 0) notices.push(`${oversize}개 파일은 50MB를 넘어 제외했어요.`);

    const loaded = await Promise.all(
      valid.map(async (file): Promise<SourceImage | null> => {
        try {
          const dataUrl = await fileToDataUrl(file);
          const img = await loadImage(dataUrl);
          return {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            dataUrl,
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
        } catch {
          return null;
        }
      })
    );
    const newImages = loaded.filter((img): img is SourceImage => img !== null);
    const failed = valid.length - newImages.length;
    if (failed > 0) notices.push(`${failed}개 파일을 열 수 없어 제외했어요.`);

    const room = Math.max(0, maxBatch - imagesRef.current.length);
    const accepted = newImages.slice(0, room);
    const overflow = newImages.length - accepted.length;
    if (overflow > 0) {
      notices.push(`최대 ${maxBatch}개까지 합칠 수 있어 ${overflow}개를 제외했어요.`);
    }

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted]);
      setResult(null); // 목록이 바뀌면 이전 결과는 무효
      if (!formatTouchedRef.current) {
        const all = [...imagesRef.current, ...accepted];
        const allPng = all.every(
          (img) => img.file.type === "image/png" || getFileExtension(img.file.name) === "png",
        );
        setOutputFormat(allPng ? "image/png" : "image/jpeg");
      }
    }

    if (notices.length > 0) {
      setBatchNotice(notices.join(" "));
      setTimeout(() => setBatchNotice(null), 4000);
    }
  }, []);

  const handleRemove = useCallback((id: string) => {
    setImages((prev) => prev.filter((img) => img.id !== id));
    setResult(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setImages([]);
    setResult(null);
    setError(null);
  }, []);

  // 순서 이동 (합치는 순서 = 목록 순서)
  const handleMove = useCallback((index: number, dir: -1 | 1) => {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setResult(null);
  }, []);

  const handleMerge = useCallback(async () => {
    if (images.length < 2 || isProcessing) return;
    setIsProcessing(true);
    setError(null);
    try {
      const res = await mergeImages(
        images.map((i) => i.file),
        {
          direction,
          gap,
          background,
          sizeStrategy,
          outputFormat,
          quality: quality / 100,
        }
      );
      setResult(res);
      trackToolUse("merge", { count: images.length, direction });
    } catch (e) {
      setResult(null);
      setError(e instanceof Error ? e.message : "이미지 합치기에 실패했습니다.");
    } finally {
      setIsProcessing(false);
    }
  }, [images, direction, gap, background, sizeStrategy, outputFormat, quality, isProcessing]);

  const downloadName = result
    ? `floor05-merged.${mimeToExtension(result.blob.type)}`
    : "floor05-merged.jpg";

  return (
    <div className="space-y-8">
      {images.length === 0 ? (
        <>
          <FileDropzone
            onFilesSelected={handleFilesAdd}
            accept={ACCEPT_IMAGE}
            multiple
            maxFiles={maxBatchSize}
            maxSize={50 * 1024 * 1024}
          />
          <p className="text-center text-sm text-brand-mid">
            합칠 이미지를 2장 이상 선택하세요. 세로 또는 가로로 한 장에 이어붙입니다.
          </p>
        </>
      ) : (
        <>
          {batchNotice && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-3">
              <p className="text-sm text-brand-black">{batchNotice}</p>
            </div>
          )}

          {/* 이미지 목록 (순서 = 합치는 순서) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                합칠 순서 ({images.length}개)
              </h3>
              <button
                onClick={handleClearAll}
                className="text-sm text-brand-mid hover:text-brand-accent transition-colors"
              >
                전체 삭제
              </button>
            </div>

            <ul className="space-y-2">
              {images.map((img, index) => (
                <li
                  key={img.id}
                  className="flex items-center gap-3 bg-brand-paper rounded-lg p-2.5"
                >
                  <span className="font-mono text-xs text-brand-mid w-5 text-center shrink-0">
                    {index + 1}
                  </span>
                  <img
                    src={img.dataUrl}
                    alt={img.file.name}
                    className="w-12 h-12 object-cover rounded shrink-0 bg-brand-white"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-brand-black truncate">{img.file.name}</p>
                    <p className="font-mono text-xs text-brand-mid">
                      {img.width}×{img.height}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => handleMove(index, -1)}
                      disabled={index === 0}
                      aria-label="위로 이동"
                      className="w-8 h-8 rounded-md flex items-center justify-center text-brand-mid hover:text-brand-accent hover:bg-brand-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleMove(index, 1)}
                      disabled={index === images.length - 1}
                      aria-label="아래로 이동"
                      className="w-8 h-8 rounded-md flex items-center justify-center text-brand-mid hover:text-brand-accent hover:bg-brand-white disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleRemove(img.id)}
                      aria-label={`${img.file.name} 삭제`}
                      className="w-8 h-8 rounded-md flex items-center justify-center text-brand-mid hover:text-red-500 hover:bg-brand-white transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {/* 추가 입력 */}
            {!isProcessing && images.length < maxBatchSize && (
              <label className="block w-full rounded-lg border-2 border-dashed border-brand-light hover:border-brand-accent cursor-pointer py-3 text-center text-sm text-brand-mid hover:text-brand-accent transition-colors">
                <input
                  type="file"
                  accept={ACCEPT_IMAGE}
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleFilesAdd(Array.from(e.target.files || []));
                    e.target.value = "";
                  }}
                />
                + 이미지 추가
              </label>
            )}
          </div>

          {/* 합치기 옵션 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-6">
            {/* 방향 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-brand-black">방향</label>
              <div className="flex gap-3">
                {([
                  { v: "vertical", label: "세로로 합치기" },
                  { v: "horizontal", label: "가로로 합치기" },
                ] as const).map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => { setDirection(opt.v); setResult(null); }}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      direction === opt.v
                        ? "bg-brand-accent text-white"
                        : "bg-brand-white text-brand-mid hover:text-brand-black"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 크기 맞춤 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-brand-black">크기 맞춤</label>
              <div className="flex gap-3">
                {([
                  { v: "match", label: direction === "vertical" ? "너비 맞추기" : "높이 맞추기" },
                  { v: "keep", label: "원본 크기 유지" },
                ] as const).map((opt) => (
                  <button
                    key={opt.v}
                    onClick={() => { setSizeStrategy(opt.v); setResult(null); }}
                    className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                      sizeStrategy === opt.v
                        ? "bg-brand-accent text-white"
                        : "bg-brand-white text-brand-mid hover:text-brand-black"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-brand-mid">
                {sizeStrategy === "match"
                  ? "모든 이미지를 같은 폭으로 맞춰 깔끔하게 이어붙입니다. (캡처 합치기에 적합)"
                  : "원본 크기를 유지하고 빈 공간은 배경색으로 채웁니다."}
              </p>
            </div>

            {/* 간격 */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-brand-black">이미지 간격</label>
                <span className="font-mono text-sm text-brand-accent">{gap}px</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={gap}
                onChange={(e) => { setGap(Number(e.target.value)); setResult(null); }}
                aria-label={`이미지 간격 ${gap}px`}
                className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
              />
            </div>

            {/* 배경색 + 포맷 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">배경색 (간격·여백)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => { setBackground(e.target.value); setResult(null); }}
                    aria-label="배경색 선택"
                    className="w-12 h-10 rounded cursor-pointer border border-brand-light bg-brand-white"
                  />
                  <span className="font-mono text-sm text-brand-mid">{background.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">저장 포맷</label>
                <div className="flex gap-2">
                  {([
                    { v: "image/jpeg", label: "JPG" },
                    { v: "image/png", label: "PNG" },
                  ] as const).map((opt) => (
                    <button
                      key={opt.v}
                      onClick={() => { formatTouchedRef.current = true; setOutputFormat(opt.v); setResult(null); }}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-mono transition-all ${
                        outputFormat === opt.v
                          ? "bg-brand-accent text-white"
                          : "bg-brand-white text-brand-mid hover:text-brand-black"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 품질 (JPG 전용) */}
            {outputFormat === "image/jpeg" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">JPG 품질</label>
                  <span className="font-mono text-sm text-brand-accent">{quality}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => { setQuality(Number(e.target.value)); setResult(null); }}
                  aria-label={`JPG 품질 ${quality}%`}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
              </div>
            )}

            {/* 합치기 버튼 */}
            <button
              onClick={handleMerge}
              disabled={isProcessing || images.length < 2}
              className={`w-full py-4 rounded-lg font-medium text-lg transition-all ${
                isProcessing || images.length < 2
                  ? "bg-brand-light text-brand-mid cursor-not-allowed"
                  : "bg-brand-accent text-white hover:bg-brand-accent-light"
              }`}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  합치는 중...
                </span>
              ) : images.length < 2 ? (
                "이미지를 2장 이상 추가하세요"
              ) : result ? (
                "설정 변경 후 다시 합치기"
              ) : (
                `${images.length}개 이미지 합치기`
              )}
            </button>

            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
          </div>

          {/* 결과 */}
          {result && (
            <div ref={resultRef} className="space-y-4 scroll-mt-4">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                합친 결과
              </h3>

              <div className="bg-brand-paper rounded-xl p-4 flex justify-center">
                <img
                  src={result.dataUrl}
                  alt="합친 이미지 미리보기"
                  className="max-w-full max-h-[480px] object-contain rounded"
                />
              </div>

              <div className="bg-brand-black rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-sm text-brand-light mb-1">합친 장수</p>
                    <p className="font-mono text-2xl text-brand-paper">{result.count}개</p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-light mb-1">크기</p>
                    <p className="font-mono text-2xl text-brand-paper">
                      {result.width}×{result.height}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-light mb-1">용량</p>
                    <p className="font-mono text-2xl text-brand-accent">
                      {formatFileSize(result.blob.size)}
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <DownloadButton
                    tool="merge"
                    fileName={downloadName}
                    fileBlob={result.blob}
                    variant="primary"
                    size="lg"
                    label="다운로드"
                  />
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
