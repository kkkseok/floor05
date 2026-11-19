"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import { toFriendlyImageError } from "@/lib/image/errorMessage";
import FailureSummary from "./FailureSummary";
import ResultCompare from "@/components/common/ResultCompare";
import DownloadButton from "@/components/common/DownloadButton";
import {
  formatFileSize,
  createNewFileName,
  getMaxBatchSize,
  fileToDataUrl,
  validateImageFiles,
  revokeObjectUrl,
} from "@/lib/common/fileUtils";
import {
  getFormatName,
  getExtension,
  isHeicFile,
  isSvgFile,
  isWebPSupported,
  isAvifSupported,
  CONVERT_INPUT_ACCEPT,
  OutputFormat,
  ConvertResult,
} from "@/lib/image/convert";
import { convertImageSmart } from "@/lib/image/processPool";
import { useBeforeUnload, useMaxBatchSize } from "@/lib/common/hooks";
import { trackToolUse } from "@/lib/common/analytics";

const ACCEPT_CONVERT = CONVERT_INPUT_ACCEPT;

interface ProcessedImage {
  id: string;
  file: File;
  originalDataUrl: string;
  originalFormat: string;
  result: ConvertResult | null;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

const BACKGROUND_COLORS = [
  { value: "#FFFFFF", label: "흰색", class: "bg-white border" },
  { value: "#000000", label: "검정", class: "bg-black" },
  { value: "#F5F5F5", label: "밝은 회색", class: "bg-gray-100" },
];

interface ConvertToolProps {
  // 트래킹 식별자. HEIC 전용 랜딩은 "heic", 변환쌍 랜딩은 "webp-to-jpg" 등으로 구분 (기본 "convert")
  toolId?: string;
  // 진입 시 기본 선택 출력 포맷 (변환쌍 랜딩 페이지용, 기본 JPG)
  defaultFormat?: OutputFormat;
}

export default function ConvertTool({
  toolId = "convert",
  defaultFormat = "image/jpeg",
}: ConvertToolProps = {}) {
  // 상태
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(defaultFormat);
  const [quality, setQuality] = useState(90);
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF");
  const [svgWidth, setSvgWidth] = useState(1024);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);
  const [webpSupported, setWebpSupported] = useState(true);
  const [avifSupported, setAvifSupported] = useState(true);

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

  // WebP / AVIF 출력 지원 확인 (미지원 브라우저는 해당 버튼 비활성화)
  useEffect(() => {
    setWebpSupported(isWebPSupported());
    setAvifSupported(isAvifSupported());
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

  // HEIC 파일 포함 여부
  const hasHeicFiles = useMemo(
    () => images.some((img) => isHeicFile(img.file)),
    [images]
  );

  // SVG 파일 포함 여부 (출력 크기 입력 노출용)
  const hasSvgFiles = useMemo(
    () => images.some((img) => isSvgFile(img.file)),
    [images]
  );

  // 파일 추가
  const handleFilesAdd = useCallback(async (files: File[]) => {
    const maxBatch = getMaxBatchSize();
    const notices: string[] = [];

    // 형식/크기 검증 (FileDropzone를 거치지 않는 "+" 입력도 여기서 막힌다)
    const { valid, oversize, unsupported } = validateImageFiles(files, ACCEPT_CONVERT);
    if (unsupported > 0) notices.push(`${unsupported}개 파일은 지원하지 않는 형식이라 제외했어요.`);
    if (oversize > 0) notices.push(`${oversize}개 파일은 50MB를 넘어 제외했어요.`);

    // 파일별로 읽기 (한 장이 실패해도 나머지는 살린다. HEIC는 미리보기 없이 통과)
    const loaded = await Promise.all(
      valid.map(async (file): Promise<ProcessedImage | null> => {
        try {
          let dataUrl: string;
          let originalFormat = file.type;
          if (isHeicFile(file)) {
            originalFormat = "image/heic";
            dataUrl = ""; // HEIC는 미리보기 불가
          } else {
            dataUrl = await fileToDataUrl(file);
          }
          return {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            originalDataUrl: dataUrl,
            originalFormat,
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

  // 변환 실행
  const handleConvert = useCallback(async () => {
    if (images.length === 0 || isProcessing) return;

    setIsProcessing(true);
    setProcessingIndex(0);

    setImages((prev) =>
      prev.map((img) => ({ ...img, status: "processing" as const }))
    );

    // 병렬 처리 (워커 풀이 파이프라인 처리, 미지원 시 메인 스레드 폴백)
    let completed = 0;
    let succeeded = 0;
    await Promise.all(
      images.map(async (img) => {
        try {
          const result = await convertImageSmart(img.file, {
            outputFormat,
            quality: quality / 100,
            backgroundColor,
            svgWidth: Math.min(8192, Math.max(16, svgWidth || 1024)),
          });

          // 이전 결과 URL 해제 (재변환 시 누수 방지)
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
                    error: toFriendlyImageError(error, "변환하지 못했습니다. 사진을 다시 올려 시도해 주세요."),
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

    if (succeeded > 0) {
      trackToolUse(toolId, { count: succeeded, to: getExtension(outputFormat) });
    }
    setIsProcessing(false);
  }, [images, outputFormat, quality, backgroundColor, svgWidth, isProcessing, toolId]);

  // 다운로드용 파일 목록
  const downloadFiles = useMemo(() => {
    return completedImages
      .filter((img) => img.result)
      .map((img) => ({
        name: createNewFileName(
          img.file.name,
          "",
          getExtension(img.result!.outputFormat)
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
          accept={ACCEPT_CONVERT}
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
                  {img.originalDataUrl ? (
                    <img
                      src={img.result?.dataUrl || img.originalDataUrl}
                      alt={img.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    // HEIC 플레이스홀더
                    <div className="w-full h-full bg-brand-paper flex items-center justify-center">
                      <div className="text-center">
                        <span className="font-mono text-xs text-brand-accent">
                          HEIC
                        </span>
                        <p className="text-xs text-brand-mid mt-1 truncate px-2">
                          {img.file.name}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* 상태 오버레이 */}
                  {img.status === "processing" && (
                    <div className="absolute inset-0 bg-brand-black/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}

                  {img.status === "done" && (
                    <div className="absolute bottom-0 left-0 right-0 bg-brand-black/70 px-2 py-1">
                      <p className="text-xs text-brand-accent font-mono">
                        {getFormatName(img.originalFormat)} →{" "}
                        {getFormatName(img.result?.outputFormat || "")}
                      </p>
                    </div>
                  )}

                  {img.status === "error" && (
                    <div className="absolute inset-0 bg-white/85 flex items-center justify-center">
                      <div className="text-center px-2">
                        <span className="text-red-700 text-xl font-bold block" aria-hidden="true">!</span>
                        <span className="text-red-700 text-xs font-medium block mt-1">실패</span>
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
                    className="absolute top-0.5 right-0.5 w-8 h-8 bg-brand-black/70 rounded-full flex items-center justify-center text-brand-paper hover:bg-red-500 transition-colors"
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
                    accept={ACCEPT_CONVERT}
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

            <FailureSummary items={images} fallback="변환하지 못했습니다. 사진을 다시 올려 시도해 주세요." />
          </div>

          {/* HEIC 안내 */}
          {hasHeicFiles && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-lg p-4">
              <p className="text-sm text-brand-black">
                <span className="font-medium">HEIC 파일 감지됨.</span>{" "}
                아이폰 사진을 JPG, PNG, WebP, AVIF로 변환할 수 있습니다.
              </p>
            </div>
          )}

          {/* 변환 옵션 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-6">
            {/* 출력 포맷 선택 */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-brand-black">
                출력 포맷
              </label>
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {[
                  { format: "image/jpeg" as OutputFormat, label: "JPG" },
                  { format: "image/png" as OutputFormat, label: "PNG" },
                  { format: "image/webp" as OutputFormat, label: "WebP" },
                  { format: "image/avif" as OutputFormat, label: "AVIF" },
                ].map(({ format, label }) => {
                  const isDisabled =
                    (format === "image/webp" && !webpSupported) ||
                    (format === "image/avif" && !avifSupported);
                  return (
                    <button
                      key={format}
                      onClick={() => !isDisabled && setOutputFormat(format)}
                      disabled={isDisabled}
                      className={`
                        py-3 px-2 sm:px-4 rounded-lg font-medium transition-all
                        ${
                          isDisabled
                            ? "bg-brand-light/50 text-brand-mid cursor-not-allowed"
                            : outputFormat === format
                            ? "bg-brand-accent text-white"
                            : "bg-brand-white text-brand-mid hover:text-brand-black border border-brand-light"
                        }
                      `}
                    >
                      {label}
                      {isDisabled && (
                        <span className="block text-xs mt-1">미지원</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {(!webpSupported || !avifSupported) && (
                <p className="text-xs text-brand-mid">
                  이 브라우저에서는{" "}
                  {[!webpSupported && "WebP", !avifSupported && "AVIF"]
                    .filter(Boolean)
                    .join(", ")}{" "}
                  출력을 지원하지 않습니다. JPG 또는 PNG를 이용해주세요.
                </p>
              )}
            </div>

            {/* SVG 출력 크기 (SVG 입력이 있을 때만) */}
            {hasSvgFiles && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">
                  SVG 출력 크기
                </label>
                <p className="text-xs text-brand-mid">
                  SVG는 벡터라 원하는 크기로 변환됩니다. 가로 기준 픽셀을 입력하면 세로는 비율에 맞춰 자동 계산됩니다.
                </p>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={16}
                    max={8192}
                    value={svgWidth}
                    onChange={(e) => setSvgWidth(Number(e.target.value))}
                    aria-label="SVG 출력 가로 픽셀"
                    className="w-32 px-3 py-2 rounded-lg border border-brand-light bg-brand-white text-brand-black focus:outline-none focus:ring-2 focus:ring-brand-accent"
                  />
                  <span className="text-sm text-brand-mid">px (가로)</span>
                </div>
              </div>
            )}

            {/* 품질 설정 (JPG, WebP) */}
            {outputFormat !== "image/png" && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">
                    품질
                  </label>
                  <span className="font-mono text-sm text-brand-accent">
                    {quality}%
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  aria-label={`이미지 변환 품질 ${quality}%`}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-xs text-brand-mid">
                  <span>최소 용량</span>
                  <span>최고 품질</span>
                </div>
              </div>
            )}

            {/* 배경색 선택 (PNG→JPG 시) */}
            {outputFormat === "image/jpeg" && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-brand-black">
                  투명 배경 대체 색상
                </label>
                <p className="text-xs text-brand-mid">
                  PNG 이미지의 투명한 부분을 채울 색상입니다.
                </p>
                <div className="flex items-center gap-3 flex-wrap">
                  {BACKGROUND_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setBackgroundColor(color.value)}
                      className={`
                        w-10 h-10 rounded-lg ${color.class} transition-all
                        ${
                          backgroundColor === color.value
                            ? "ring-2 ring-brand-accent ring-offset-2"
                            : ""
                        }
                      `}
                      title={color.label}
                    />
                  ))}
                  {/* 직접 색 선택 */}
                  <label
                    className="relative w-10 h-10 rounded-lg overflow-hidden border border-brand-light cursor-pointer shrink-0"
                    title="직접 선택"
                  >
                    <input
                      type="color"
                      value={backgroundColor}
                      onChange={(e) => setBackgroundColor(e.target.value)}
                      aria-label="배경색 직접 선택"
                      className="absolute -inset-1 w-[calc(100%+8px)] h-[calc(100%+8px)] cursor-pointer"
                    />
                  </label>
                  <span className="font-mono text-xs text-brand-mid">
                    {backgroundColor.toUpperCase()}
                  </span>
                </div>
              </div>
            )}

            {/* 변환 버튼 */}
            <button
              onClick={handleConvert}
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
                  변환 중... ({processingIndex}/{images.length})
                </span>
              ) : completedImages.length > 0 ? (
                "설정 변경 후 다시 변환"
              ) : (
                `${images.length}개 이미지 ${getFormatName(outputFormat)}로 변환`
              )}
            </button>
          </div>

          {/* 결과 비교 / 미리보기 */}
          {selectedImage &&
            selectedImage.status === "done" &&
            selectedImage.result &&
            (selectedImage.originalDataUrl ? (
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                  변환 결과
                </h3>

                <ResultCompare
                  beforeSrc={selectedImage.originalDataUrl}
                  afterSrc={selectedImage.result.dataUrl}
                  beforeLabel={getFormatName(selectedImage.originalFormat)}
                  afterLabel={getFormatName(selectedImage.result.outputFormat)}
                  beforeMeta={formatFileSize(selectedImage.file.size)}
                  afterMeta={formatFileSize(selectedImage.result.blob.size)}
                  transparent={selectedImage.result.outputFormat !== "image/jpeg"}
                />
              </div>
            ) : (
              // HEIC 등 원본 미리보기가 없는 경우: 변환 결과만 표시
              <div className="space-y-4">
                <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                  변환 결과
                </h3>
                <div className="rounded-lg overflow-hidden bg-brand-paper flex justify-center">
                  <img
                    src={selectedImage.result.dataUrl}
                    alt={selectedImage.file.name}
                    className="max-h-[480px] max-w-full w-auto object-contain"
                  />
                </div>
                <p className="text-sm text-brand-mid text-center">
                  {getFormatName(selectedImage.originalFormat)} →{" "}
                  {getFormatName(selectedImage.result.outputFormat)} ·{" "}
                  {formatFileSize(selectedImage.result.blob.size)}
                </p>
              </div>
            ))}

          {/* 다운로드 */}
          {completedImages.length > 0 && (
            <div className="bg-brand-black rounded-xl p-6">
              <div className="text-center mb-6">
                <p className="text-brand-paper text-lg">
                  {completedImages.length}개 이미지 변환 완료
                </p>
              </div>

              <div className="flex justify-center">
                {downloadFiles.length === 1 ? (
                  <DownloadButton
                    tool={toolId}
                    fileName={downloadFiles[0].name}
                    fileBlob={downloadFiles[0].blob}
                    variant="primary"
                    size="lg"
                    label="다운로드"
                  />
                ) : (
                  <DownloadButton
                    tool={toolId}
                    files={downloadFiles}
                    zipFileName="floor05-converted-images.zip"
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
