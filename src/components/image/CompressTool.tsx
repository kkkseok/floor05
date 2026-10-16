"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import ResultCompare from "@/components/common/ResultCompare";
import DownloadButton from "@/components/common/DownloadButton";
import {
  formatFileSize,
  calculateCompressionRate,
  createNewFileName,
  getMaxBatchSize,
  fileToDataUrl,
  validateImageFiles,
  revokeObjectUrl,
  mimeToExtension,
} from "@/lib/common/fileUtils";
import {
  compressToTargetSize,
  quickCompress,
  CompressionResult,
} from "@/lib/image/compress";
import { compressImageSmart } from "@/lib/image/processPool";
import { compressPng, compressPngToTarget } from "@/lib/image/pngCompress";
import { stripMetadata } from "@/lib/image/stripMetadata";
import { useBeforeUnload, useMaxBatchSize } from "@/lib/common/hooks";
import { trackToolUse } from "@/lib/common/analytics";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp";

interface ProcessedImage {
  id: string;
  file: File;
  originalDataUrl: string;
  result: CompressionResult | null;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

type CompressionMode = "quality" | "target";
type OutputMode = "auto" | "jpg" | "png";

function isPngFile(file: File): boolean {
  return file.type === "image/png" || file.name.toLowerCase().endsWith(".png");
}

// 이 파일을 PNG로 저장할지 결정 (auto: PNG 입력만 PNG 유지, 나머지는 JPG)
function wantsPng(file: File, outputMode: OutputMode): boolean {
  if (outputMode === "png") return true;
  if (outputMode === "jpg") return false;
  return isPngFile(file);
}

/**
 * 목표 용량 모드: PNG는 먼저 투명도를 유지한 채(PNG) 맞춰 보고, 안 되면 JPG로 대체하면서 그 사실을 표시한다.
 */
async function compressToTarget(file: File, targetSizeKB: number): Promise<CompressionResult> {
  if (isPngFile(file)) {
    const png = await compressPngToTarget(file, targetSizeKB);
    if (png) return png;
    const jpg = await compressToTargetSize(file, targetSizeKB, { outputFormat: "image/jpeg" });
    return { ...jpg, alphaDropped: true };
  }
  return compressToTargetSize(file, targetSizeKB, { outputFormat: "image/jpeg" });
}

function mimeFromBytes(b: Uint8Array, fallback: string): string {
  if (b[0] === 0xff && b[1] === 0xd8) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50) return "image/png";
  if (b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return "image/webp";
  return fallback;
}

/**
 * 압축 결과가 원본 그대로이거나 원본보다 크면, 원본에서 메타데이터만 지운 파일로 바꾼다.
 * 예전에는 원본을 그대로 내줘서 '위치·촬영 정보도 제거'라는 안내와 달리 GPS가 남았다.
 */
async function finalize(file: File, result: CompressionResult): Promise<CompressionResult> {
  if (result.blob !== file && result.compressedSize < file.size) return result;
  const stripped = stripMetadata(new Uint8Array(await file.arrayBuffer()));
  if (!stripped) return result;
  revokeObjectUrl(result.dataUrl);
  const blob = new Blob([new Uint8Array(stripped)], { type: mimeFromBytes(stripped, file.type) });
  const size = result.resizedFrom ?? { width: result.width, height: result.height };
  return {
    blob,
    width: size.width,
    height: size.height,
    originalSize: file.size,
    compressedSize: blob.size,
    dataUrl: URL.createObjectURL(blob),
    keptOriginal: true,
  };
}

/** 줄었으면 -N%, 커졌으면 +N% */
function rateLabel(originalSize: number, compressedSize: number): string {
  const rate = calculateCompressionRate(originalSize, compressedSize);
  return rate >= 0 ? `-${rate}%` : `+${-rate}%`;
}

export default function CompressTool() {
  // 상태
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [mode, setMode] = useState<CompressionMode>("quality");
  const [outputMode, setOutputMode] = useState<OutputMode>("auto");
  const [quality, setQuality] = useState(80);
  const [targetSizeKB, setTargetSizeKB] = useState(200);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);
  const [estimatedSize, setEstimatedSize] = useState<number | null>(null);

  // 최신 images 스냅샷 (객체 URL 정리/언마운트용)
  const imagesRef = useRef<ProcessedImage[]>([]);
  useEffect(() => {
    imagesRef.current = images;
  }, [images]);
  useEffect(() => {
    return () => {
      imagesRef.current.forEach((img) => revokeObjectUrl(img.result?.dataUrl));
    };
  }, []);

  // 처리 중 페이지 이탈 경고
  useBeforeUnload(isProcessing);

  // 일괄 최대 장수 (하이드레이션 안전)
  const maxBatchSize = useMaxBatchSize();

  // 선택된 이미지
  const selectedImage = useMemo(
    () => images.find((img) => img.id === selectedImageId),
    [images, selectedImageId]
  );

  // 완료된 이미지들
  const completedImages = useMemo(
    () => images.filter((img) => img.status === "done" && img.result),
    [images]
  );

  // 압축 완료 시 결과 영역으로 한 번만 자동 스크롤 (긴 페이지에서 결과 인지 보조)
  const resultSectionRef = useRef<HTMLDivElement>(null);
  const hadResultsRef = useRef(false);
  useEffect(() => {
    if (!hadResultsRef.current && completedImages.length > 0) {
      resultSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    hadResultsRef.current = completedImages.length > 0;
  }, [completedImages.length]);

  // 전체 압축 통계
  const totalStats = useMemo(() => {
    const completed = completedImages;
    if (completed.length === 0) return null;

    const totalOriginal = completed.reduce(
      (sum, img) => sum + (img.result?.originalSize || 0),
      0
    );
    const totalCompressed = completed.reduce(
      (sum, img) => sum + (img.result?.compressedSize || 0),
      0
    );

    return {
      count: completed.length,
      originalSize: totalOriginal,
      compressedSize: totalCompressed,
      savedSize: totalOriginal - totalCompressed,
      rate: calculateCompressionRate(totalOriginal, totalCompressed),
    };
  }, [completedImages]);

  // 품질 슬라이더 실시간 예상 용량 (선택 이미지 기준, 디바운스)
  useEffect(() => {
    if (mode !== "quality" || !selectedImage || wantsPng(selectedImage.file, outputMode)) {
      setEstimatedSize(null);
      return;
    }
    let cancelled = false;
    const file = selectedImage.file;
    const timer = setTimeout(() => {
      quickCompress(file, quality / 100)
        .then(({ size }) => {
          if (!cancelled && size > 0) setEstimatedSize(size);
        })
        .catch(() => {
          if (!cancelled) setEstimatedSize(null);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [mode, quality, selectedImage, outputMode]);

  // 파일 추가
  const handleFilesAdd = useCallback(async (files: File[]) => {
    const maxBatch = getMaxBatchSize();
    const notices: string[] = [];

    // 형식/크기 검증 (FileDropzone를 거치지 않는 "+" 입력도 여기서 막힌다)
    const { valid, oversize, unsupported } = validateImageFiles(files, ACCEPT_IMAGE);
    if (unsupported > 0) notices.push(`${unsupported}개 파일은 지원하지 않는 형식이라 제외했어요.`);
    if (oversize > 0) notices.push(`${oversize}개 파일은 50MB를 넘어 제외했어요.`);

    // 파일별로 읽기 (한 장이 실패해도 나머지는 살린다)
    const loaded = await Promise.all(
      valid.map(async (file): Promise<ProcessedImage | null> => {
        try {
          const dataUrl = await fileToDataUrl(file);
          return {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            originalDataUrl: dataUrl,
            result: null,
            status: "pending",
          };
        } catch {
          return null;
        }
      })
    );
    const newImages = loaded.filter((img): img is ProcessedImage => img !== null);
    const failed = valid.length - newImages.length;
    if (failed > 0) notices.push(`${failed}개 파일을 열 수 없어 제외했어요.`);

    // 일괄 장수 제한 (현재 목록 + 신규)
    const room = Math.max(0, maxBatch - imagesRef.current.length);
    const accepted = newImages.slice(0, room);
    const overflow = newImages.length - accepted.length;
    if (overflow > 0) {
      notices.push(`최대 ${maxBatch}개까지 처리할 수 있어 ${overflow}개를 제외했어요.`);
    }

    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted]);
      setSelectedImageId(accepted[0].id);
    }

    if (notices.length > 0) {
      setBatchNotice(notices.join(" "));
      setTimeout(() => setBatchNotice(null), 4000);
    }
  }, []);

  // 이미지 제거
  const handleRemoveImage = useCallback(
    (id: string) => {
      revokeObjectUrl(
        imagesRef.current.find((img) => img.id === id)?.result?.dataUrl
      );
      setImages((prev) => prev.filter((img) => img.id !== id));
      if (selectedImageId === id) {
        setSelectedImageId(null);
      }
    },
    [selectedImageId]
  );

  // 모든 이미지 제거
  const handleClearAll = useCallback(() => {
    imagesRef.current.forEach((img) => revokeObjectUrl(img.result?.dataUrl));
    setImages([]);
    setSelectedImageId(null);
  }, []);

  // 압축 실행
  const handleCompress = useCallback(async () => {
    if (images.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProcessingIndex(0);

    // 모든 이미지 처리 상태로 변경
    setImages((prev) =>
      prev.map((img) => ({ ...img, status: "processing" as const }))
    );

    // 병렬 처리 (워커 풀이 파이프라인 처리, 미지원 시 메인 스레드 폴백)
    let completed = 0;
    let succeeded = 0;
    await Promise.all(
      images.map(async (img) => {
        try {
          const raw =
            mode === "target"
              ? await compressToTarget(img.file, targetSizeKB)
              : wantsPng(img.file, outputMode)
              ? await compressPng(img.file, quality)
              : await compressImageSmart(img.file, {
                  quality: quality / 100,
                  outputFormat: "image/jpeg",
                });
          const result = await finalize(img.file, raw);

          // 이전 결과 URL 해제 (재압축 시 누수 방지)
          revokeObjectUrl(img.result?.dataUrl);
          succeeded++;
          setImages((prev) =>
            prev.map((item) =>
              item.id === img.id
                ? { ...item, result, status: "done" as const }
                : item
            )
          );
        } catch (error) {
          setImages((prev) =>
            prev.map((item) =>
              item.id === img.id
                ? {
                    ...item,
                    status: "error" as const,
                    error:
                      error instanceof Error
                        ? error.message
                        : "압축에 실패했습니다.",
                  }
                : item
            )
          );
        } finally {
          completed++;
          setProcessingIndex(completed);
        }
      })
    );

    if (succeeded > 0) trackToolUse("compress", { count: succeeded, mode });
    setIsProcessing(false);
  }, [images, mode, quality, targetSizeKB, outputMode, isProcessing]);

  // 다운로드용 파일 목록
  const downloadFiles = useMemo(() => {
    return completedImages
      .filter((img) => img.result)
      .map((img) => ({
        name: createNewFileName(
          img.file.name,
          "_compressed",
          mimeToExtension(img.result!.blob.type)
        ),
        blob: img.result!.blob,
      }));
  }, [completedImages]);

  return (
    <div className="space-y-8">
      {/* 파일 업로드 영역 */}
      {images.length === 0 ? (
        <FileDropzone
          onFilesSelected={handleFilesAdd}
          accept={ACCEPT_IMAGE}
          multiple
          maxFiles={maxBatchSize}
          maxSize={50 * 1024 * 1024}
        />
      ) : (
        <>
          {/* 배치 초과 알림 */}
          {batchNotice && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-3">
              <p className="text-sm text-brand-black">{batchNotice}</p>
            </div>
          )}

          {/* 이미지 목록 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                이미지 목록 ({images.length}개)
              </h3>
              <button
                onClick={handleClearAll}
                className="text-sm text-brand-mid hover:text-brand-accent transition-colors"
              >
                전체 삭제
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
              {images.map((img) => (
                <div
                  key={img.id}
                  role="button"
                  tabIndex={0}
                  aria-label={`${img.file.name} 선택`}
                  aria-pressed={selectedImageId === img.id}
                  onClick={() => setSelectedImageId(img.id)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedImageId(img.id); } }}
                  className={`
                    relative aspect-square rounded-lg overflow-hidden cursor-pointer
                    border-2 transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2
                    ${
                      selectedImageId === img.id
                        ? "border-brand-accent"
                        : "border-transparent hover:border-brand-light"
                    }
                  `}
                >
                  <img
                    src={img.result?.dataUrl || img.originalDataUrl}
                    alt={img.file.name}
                    className="w-full h-full object-cover"
                  />

                  {/* 상태 오버레이 */}
                  {img.status === "processing" && (
                    <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {img.status === "done" && img.result && (
                    <div className="absolute bottom-0 left-0 right-0 bg-brand-black/70 px-2 py-1">
                      <p className="text-xs text-brand-accent font-mono">
                        {img.result.keptOriginal ? "원본 화질" : rateLabel(img.result.originalSize, img.result.compressedSize)}
                      </p>
                    </div>
                  )}

                  {img.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center" title={img.error || "압축 실패"}>
                      <div className="text-center px-2">
                        <span className="text-red-500 text-xl block">!</span>
                        <span className="text-red-600 text-[10px] leading-tight block mt-1">{img.error || "실패"}</span>
                      </div>
                    </div>
                  )}

                  {/* 삭제 버튼 */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveImage(img.id);
                    }}
                    aria-label={`${img.file.name} 삭제`}
                    className="absolute top-1 right-1 w-6 h-6 bg-brand-black/70 rounded-full flex items-center justify-center text-brand-paper hover:bg-red-500 transition-colors"
                  >
                    <svg
                      className="w-3 h-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* 추가 버튼 (처리 중에는 숨김 — 진행 중 배치 누락 방지) */}
              {!isProcessing && images.length < maxBatchSize && (
                <label className="aspect-square rounded-lg border-2 border-dashed border-brand-light hover:border-brand-accent cursor-pointer flex items-center justify-center transition-colors">
                  <input
                    type="file"
                    accept={ACCEPT_IMAGE}
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      handleFilesAdd(files);
                      e.target.value = "";
                    }}
                  />
                  <svg
                    className="w-8 h-8 text-brand-light"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                </label>
              )}
            </div>
          </div>

          {/* 압축 옵션 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-6">
            {/* 모드 선택 */}
            <div className="flex gap-4">
              <button
                onClick={() => setMode("quality")}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all
                  ${
                    mode === "quality"
                      ? "bg-brand-accent text-white"
                      : "bg-brand-white text-brand-mid hover:text-brand-black"
                  }
                `}
              >
                품질 조절
              </button>
              <button
                onClick={() => setMode("target")}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all
                  ${
                    mode === "target"
                      ? "bg-brand-accent text-white"
                      : "bg-brand-white text-brand-mid hover:text-brand-black"
                  }
                `}
              >
                목표 용량
              </button>
            </div>

            {/* 결과 형식 (품질 모드 전용) */}
            {mode === "quality" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">
                  결과 형식
                </label>
                <div className="flex gap-2">
                  {([
                    ["auto", "자동"],
                    ["jpg", "JPG"],
                    ["png", "PNG"],
                  ] as const).map(([value, label]) => (
                    <button
                      key={value}
                      onClick={() => setOutputMode(value)}
                      className={`
                        flex-1 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${
                          outputMode === value
                            ? "bg-brand-accent text-white"
                            : "bg-brand-white text-brand-mid hover:text-brand-black"
                        }
                      `}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-brand-mid">
                  {outputMode === "auto" &&
                    "PNG는 투명을 유지한 채 압축하고, 나머지는 JPG로 더 작게 만듭니다."}
                  {outputMode === "jpg" &&
                    "모두 JPG로 저장합니다. 투명 배경은 흰색으로 채워집니다."}
                  {outputMode === "png" &&
                    "모두 PNG로 저장해 투명 배경을 유지합니다. 품질을 낮추면 색상 수를 줄여 더 작게 만듭니다."}
                </p>
              </div>
            )}

            {/* 품질 슬라이더 */}
            {mode === "quality" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">
                    압축 품질
                  </label>
                  <span className="font-mono text-sm text-brand-accent">
                    {quality}%
                    {estimatedSize !== null && (
                      <span className="text-brand-mid ml-2">
                        ~{formatFileSize(estimatedSize)}
                      </span>
                    )}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  aria-label={`이미지 압축 품질 ${quality}%`}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-xs text-brand-mid">
                  <span>최소 용량</span>
                  <span>최고 품질</span>
                </div>
              </div>
            )}

            {/* 목표 용량 입력 */}
            {mode === "target" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">
                  목표 용량 (KB)
                </label>
                <div className="flex gap-2">
                  {[100, 200, 500, 1000].map((size) => (
                    <button
                      key={size}
                      onClick={() => setTargetSizeKB(size)}
                      className={`
                        px-4 py-2 rounded-lg text-sm font-mono transition-all
                        ${
                          targetSizeKB === size
                            ? "bg-brand-accent text-white"
                            : "bg-brand-white text-brand-mid hover:text-brand-black"
                        }
                      `}
                    >
                      {size < 1000 ? `${size}KB` : `${size / 1000}MB`}
                    </button>
                  ))}
                  <input
                    type="number"
                    value={targetSizeKB}
                    onChange={(e) =>
                      setTargetSizeKB(Math.max(1, Number(e.target.value)))
                    }
                    className="flex-1 px-3 py-2 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
                    placeholder="직접 입력"
                  />
                </div>
                <p className="text-xs text-brand-mid">
                  품질을 자동으로 맞춰 목표 용량 이하로 압축합니다. 품질을 60% 아래로 내려야 하면
                  대신 해상도를 줄입니다. PNG는 먼저 투명 배경을 유지한 채 색 수를 줄여 맞춰 봅니다.
                </p>
              </div>
            )}

            {/* 압축 버튼 */}
            <button
              onClick={handleCompress}
              disabled={isProcessing || images.length === 0}
              className={`
                w-full py-4 rounded-lg font-medium text-lg transition-all
                ${
                  isProcessing || images.length === 0
                    ? "bg-brand-light text-brand-mid cursor-not-allowed"
                    : "bg-brand-accent text-white hover:bg-brand-accent-light"
                }
              `}
            >
              {isProcessing ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  압축 중... ({processingIndex}/{images.length})
                </span>
              ) : completedImages.length > 0 ? (
                "설정 변경 후 다시 압축"
              ) : (
                `${images.length}개 이미지 압축하기`
              )}
            </button>

            <p className="text-xs text-brand-mid text-center">
              🔒 업로드 없이 브라우저에서 처리되며, 사진의 위치(GPS)·촬영 정보(EXIF)도 함께 제거됩니다.
            </p>
          </div>

          {/* 결과 비교 */}
          {selectedImage && selectedImage.status === "done" && selectedImage.result && (
            <div ref={resultSectionRef} className="space-y-4 scroll-mt-4">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                결과 비교
              </h3>

              <ResultCompare
                beforeSrc={selectedImage.originalDataUrl}
                afterSrc={selectedImage.result.dataUrl}
                afterLabel="압축 결과"
                beforeMeta={formatFileSize(selectedImage.result.originalSize)}
                afterMeta={formatFileSize(selectedImage.result.compressedSize)}
                transparent={selectedImage.result.blob.type === "image/png"}
              />

              {/* 용량 절감 막대 — 압축의 핵심 성과를 한눈에 */}
              <div className="bg-brand-paper rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-mid">원본</span>
                    <span className="font-mono text-brand-black">
                      {formatFileSize(selectedImage.result.originalSize)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-brand-light/40 overflow-hidden">
                    <div className="h-full w-full bg-brand-light" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-brand-mid">압축 후</span>
                    <span className="font-mono text-brand-accent">
                      {formatFileSize(selectedImage.result.compressedSize)} ·{" "}
                      {rateLabel(selectedImage.result.originalSize, selectedImage.result.compressedSize)}
                    </span>
                  </div>
                  <div className="h-3 rounded-full bg-brand-light/40 overflow-hidden">
                    <div
                      className="h-full bg-brand-accent transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.max(
                            2,
                            Math.round(
                              (selectedImage.result.compressedSize /
                                selectedImage.result.originalSize) *
                                100
                            )
                          )
                        )}%`,
                      }}
                    />
                  </div>
                </div>
                {selectedImage.result.keptOriginal && (
                  <p className="text-sm text-brand-mid leading-relaxed">
                    {mode === "target"
                      ? "이미 목표 용량보다 작은 사진이라 다시 압축하지 않았습니다."
                      : "이미 충분히 압축된 사진이라 다시 압축하면 오히려 커집니다."}{" "}
                    화질은 원본 그대로 두고, 사진에 들어 있던 위치(GPS)·촬영 정보만 지워 저장했습니다.
                  </p>
                )}
                {selectedImage.result.alphaDropped && (
                  <p className="text-sm text-brand-mid leading-relaxed">
                    투명 배경을 유지한 PNG로는 목표 용량까지 줄일 수 없어, 투명한 부분을 흰색으로 채운 JPG로 저장했습니다.
                    투명 배경이 꼭 필요하다면 목표 용량을 조금 늘려 보세요.
                  </p>
                )}
                {selectedImage.result.resizedFrom && (
                  <p className="text-sm text-brand-mid leading-relaxed">
                    품질을 60% 아래로 낮추는 대신 해상도를{" "}
                    <span className="font-mono text-brand-black">
                      {selectedImage.result.resizedFrom.width}×{selectedImage.result.resizedFrom.height}
                    </span>
                    에서{" "}
                    <span className="font-mono text-brand-black">
                      {selectedImage.result.width}×{selectedImage.result.height}
                    </span>
                    로 줄여 목표 용량에 맞췄습니다.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* 전체 통계 & 다운로드 */}
          {totalStats && totalStats.count > 0 && (
            <div className="bg-brand-black rounded-xl p-6 space-y-6">
              {/* 합계 통계는 여러 장 일괄 처리일 때만 (단일 장은 위 절감 막대와 중복) */}
              {totalStats.count > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-sm text-brand-light mb-1">처리 완료</p>
                    <p className="font-mono text-2xl text-brand-paper">
                      {totalStats.count}개
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-light mb-1">원본 총 용량</p>
                    <p className="font-mono text-2xl text-brand-paper">
                      {formatFileSize(totalStats.originalSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-light mb-1">압축 후</p>
                    <p className="font-mono text-2xl text-brand-accent">
                      {formatFileSize(totalStats.compressedSize)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-brand-light mb-1">절약</p>
                    <p className="font-mono text-2xl text-brand-accent">
                      {formatFileSize(Math.max(0, totalStats.savedSize))} ({rateLabel(totalStats.originalSize, totalStats.compressedSize)})
                    </p>
                  </div>
                </div>
              )}

              {/* 다운로드 버튼 */}
              <div className="flex justify-center">
                {downloadFiles.length === 1 ? (
                  <DownloadButton
                    tool="compress"
                    fileName={downloadFiles[0].name}
                    fileBlob={downloadFiles[0].blob}
                    variant="primary"
                    size="lg"
                    label="다운로드"
                  />
                ) : (
                  <DownloadButton
                    tool="compress"
                    files={downloadFiles}
                    zipFileName="floor05-compressed-images.zip"
                    variant="primary"
                    size="lg"
                  />
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
