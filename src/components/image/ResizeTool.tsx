"use client";

import { useState, useCallback, useMemo, useEffect, useRef } from "react";
import FileDropzone from "@/components/common/FileDropzone";
import ResultCompare from "@/components/common/ResultCompare";
import DownloadButton from "@/components/common/DownloadButton";
import {
  formatFileSize,
  createNewFileName,
  getMaxBatchSize,
  fileToDataUrl,
  loadImage,
  validateImageFiles,
  revokeObjectUrl,
  mimeToExtension,
  outputTypeFor,
} from "@/lib/common/fileUtils";
import {
  SNS_PRESETS,
  getPresetsByPlatform,
  ResizeResult,
} from "@/lib/image/resize";
import { resizeImageSmart } from "@/lib/image/processPool";
import { useBeforeUnload, useMaxBatchSize } from "@/lib/common/hooks";
import { trackToolUse } from "@/lib/common/analytics";

const ACCEPT_IMAGE = "image/jpeg,image/png,image/webp";


interface ProcessedImage {
  id: string;
  file: File;
  originalDataUrl: string;
  originalWidth: number;
  originalHeight: number;
  result: ResizeResult | null;
  status: "pending" | "processing" | "done" | "error";
  error?: string;
}

type ResizeMode = "custom" | "percentage" | "preset";

export default function ResizeTool() {
  // 상태
  const [images, setImages] = useState<ProcessedImage[]>([]);
  const [mode, setMode] = useState<ResizeMode>("custom");
  const [customWidth, setCustomWidth] = useState(800);
  const [customHeight, setCustomHeight] = useState(600);
  const [lockAspectRatio, setLockAspectRatio] = useState(true);
  const [doNotEnlarge, setDoNotEnlarge] = useState(false);
  const [percentage, setPercentage] = useState(50);
  const [selectedPresetId, setSelectedPresetId] = useState("instagram-square");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingIndex, setProcessingIndex] = useState(0);
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  // 원본 비율 저장
  const [originalAspectRatio, setOriginalAspectRatio] = useState(4 / 3);

  // 최신 images 스냅샷 (일괄 장수 계산 / 객체 URL 정리용)
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

  // 플랫폼별 프리셋
  const presetsByPlatform = useMemo(() => getPresetsByPlatform(), []);

  // 선택된 프리셋
  const selectedPreset = useMemo(
    () => SNS_PRESETS.find((p) => p.id === selectedPresetId),
    [selectedPresetId]
  );

  // 비율 잠금 시 크기 조절
  useEffect(() => {
    if (lockAspectRatio && selectedImage) {
      setOriginalAspectRatio(
        selectedImage.originalWidth / selectedImage.originalHeight
      );
    }
  }, [lockAspectRatio, selectedImage]);

  const handleWidthChange = useCallback(
    (newWidth: number) => {
      setCustomWidth(newWidth);
      if (lockAspectRatio) {
        setCustomHeight(Math.round(newWidth / originalAspectRatio));
      }
    },
    [lockAspectRatio, originalAspectRatio]
  );

  const handleHeightChange = useCallback(
    (newHeight: number) => {
      setCustomHeight(newHeight);
      if (lockAspectRatio) {
        setCustomWidth(Math.round(newHeight * originalAspectRatio));
      }
    },
    [lockAspectRatio, originalAspectRatio]
  );

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
          const img = await loadImage(dataUrl);
          return {
            id: `${file.name}-${Date.now()}-${Math.random()}`,
            file,
            originalDataUrl: dataUrl,
            originalWidth: img.width,
            originalHeight: img.height,
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

    // 첫 번째 이미지 선택 및 크기 설정
    if (accepted.length > 0) {
      setImages((prev) => [...prev, ...accepted]);
      setSelectedImageId(accepted[0].id);
      setCustomWidth(accepted[0].originalWidth);
      setCustomHeight(accepted[0].originalHeight);
      setOriginalAspectRatio(
        accepted[0].originalWidth / accepted[0].originalHeight
      );
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

  // 리사이즈 실행
  const handleResize = useCallback(async () => {
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
          let reqWidth: number;
          let reqHeight: number;
          let maintain: boolean;
          let cover = false;

          if (mode === "percentage") {
            reqWidth = Math.round(img.originalWidth * (percentage / 100));
            reqHeight = Math.round(img.originalHeight * (percentage / 100));
            maintain = false;
          } else if (mode === "preset" && selectedPreset) {
            reqWidth = selectedPreset.width;
            reqHeight = selectedPreset.height || 0;
            maintain = selectedPreset.height === 0;
            // 가로·세로가 정해진 프리셋은 가운데를 잘라 채운다(늘리면 찌그러짐)
            cover = selectedPreset.height > 0;
          } else {
            reqWidth = customWidth;
            reqHeight = customHeight;
            maintain = lockAspectRatio;
          }

          // 확대 안 함: 요청 크기를 원본 이하로 제한 (업스케일 방지)
          if (doNotEnlarge && !cover) {
            reqWidth = Math.min(reqWidth, img.originalWidth);
            if (reqHeight > 0) reqHeight = Math.min(reqHeight, img.originalHeight);
          }

          const result: ResizeResult = await resizeImageSmart(img.file, {
            width: reqWidth,
            height: reqHeight,
            maintainAspectRatio: maintain,
            cover,
            noEnlarge: doNotEnlarge,
            outputFormat: outputTypeFor(img.file),
          });

          // 이전 결과 URL 해제 (재리사이즈 시 누수 방지)
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
                        : "리사이즈에 실패했습니다.",
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

    if (succeeded > 0) trackToolUse("resize", { count: succeeded, mode });
    setIsProcessing(false);
  }, [
    images,
    mode,
    percentage,
    selectedPreset,
    customWidth,
    customHeight,
    lockAspectRatio,
    doNotEnlarge,
    isProcessing,
  ]);

  // 다운로드용 파일 목록
  const downloadFiles = useMemo(() => {
    return completedImages
      .filter((img) => img.result)
      .map((img) => ({
        name: createNewFileName(img.file.name, "_resized", mimeToExtension(img.result!.blob.type)),
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
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedImageId(img.id);
                    }
                  }}
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
                      <p className="text-xs text-brand-paper font-mono truncate">
                        {img.result.width}×{img.result.height}
                      </p>
                    </div>
                  )}

                  {img.status === "error" && (
                    <div className="absolute inset-0 bg-red-500/20 flex items-center justify-center" title={img.error || "리사이즈 실패"}>
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

          {/* 원본 크기 표시 */}
          {selectedImage && (
            <div className="bg-brand-paper rounded-lg p-4 text-center">
              <p className="text-sm text-brand-mid">
                원본 크기:{" "}
                <span className="font-mono text-brand-black">
                  {selectedImage.originalWidth} × {selectedImage.originalHeight}
                </span>
                <span className="text-brand-light ml-2">
                  ({formatFileSize(selectedImage.file.size)})
                </span>
              </p>
            </div>
          )}

          {/* 리사이즈 옵션 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-6">
            {/* 모드 선택 */}
            <div className="flex gap-2">
              <button
                onClick={() => setMode("custom")}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm
                  ${
                    mode === "custom"
                      ? "bg-brand-accent text-white"
                      : "bg-brand-white text-brand-mid hover:text-brand-black"
                  }
                `}
              >
                직접 입력
              </button>
              <button
                onClick={() => setMode("percentage")}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm
                  ${
                    mode === "percentage"
                      ? "bg-brand-accent text-white"
                      : "bg-brand-white text-brand-mid hover:text-brand-black"
                  }
                `}
              >
                비율 (%)
              </button>
              <button
                onClick={() => setMode("preset")}
                className={`
                  flex-1 py-3 px-4 rounded-lg font-medium transition-all text-sm
                  ${
                    mode === "preset"
                      ? "bg-brand-accent text-white"
                      : "bg-brand-white text-brand-mid hover:text-brand-black"
                  }
                `}
              >
                SNS 프리셋
              </button>
            </div>

            {/* 직접 입력 */}
            {mode === "custom" && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <label htmlFor="resize-width" className="text-sm text-brand-mid mb-1 block">
                      너비 (px)
                    </label>
                    <input
                      id="resize-width"
                      type="number"
                      value={customWidth}
                      onChange={(e) =>
                        handleWidthChange(Math.max(1, Number(e.target.value)))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-brand-light font-mono focus:outline-none focus:border-brand-accent"
                    />
                  </div>

                  {/* 비율 잠금 버튼 */}
                  <button
                    onClick={() => setLockAspectRatio(!lockAspectRatio)}
                    className={`
                      mt-6 p-3 rounded-lg transition-all
                      ${
                        lockAspectRatio
                          ? "bg-brand-accent text-white"
                          : "bg-brand-white text-brand-mid border border-brand-light"
                      }
                    `}
                    aria-label={lockAspectRatio ? "비율 잠금 해제" : "비율 잠금"}
                    aria-pressed={lockAspectRatio}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      {lockAspectRatio ? (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                        />
                      ) : (
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      )}
                    </svg>
                  </button>

                  <div className="flex-1">
                    <label htmlFor="resize-height" className="text-sm text-brand-mid mb-1 block">
                      높이 (px)
                    </label>
                    <input
                      id="resize-height"
                      type="number"
                      value={customHeight}
                      onChange={(e) =>
                        handleHeightChange(Math.max(1, Number(e.target.value)))
                      }
                      className="w-full px-4 py-3 rounded-lg border border-brand-light font-mono focus:outline-none focus:border-brand-accent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 비율 조절 */}
            {mode === "percentage" && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-brand-black">
                    크기 비율
                  </label>
                  <span className="font-mono text-sm text-brand-accent">
                    {percentage}%
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  value={percentage}
                  onChange={(e) => setPercentage(Number(e.target.value))}
                  className="w-full h-2 bg-brand-light rounded-lg appearance-none cursor-pointer accent-brand-accent"
                />
                <div className="flex justify-between text-xs text-brand-mid">
                  <span>10%</span>
                  <span>100%</span>
                  <span>200%</span>
                </div>

                {selectedImage && (
                  <p className="text-sm text-brand-mid text-center">
                    결과 크기:{" "}
                    <span className="font-mono text-brand-black">
                      {Math.round(selectedImage.originalWidth * (percentage / 100))} ×{" "}
                      {Math.round(selectedImage.originalHeight * (percentage / 100))}
                    </span>
                  </p>
                )}
              </div>
            )}

            {/* SNS 프리셋 */}
            {mode === "preset" && (
              <div className="space-y-4">
                {Object.entries(presetsByPlatform).map(([platform, presets]) => (
                  <div key={platform}>
                    <p className="text-xs font-mono text-brand-mid uppercase tracking-wider mb-2">
                      {platform}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {presets.map((preset) => (
                        <button
                          key={preset.id}
                          onClick={() => setSelectedPresetId(preset.id)}
                          className={`
                            px-4 py-2 rounded-lg text-sm transition-all
                            ${
                              selectedPresetId === preset.id
                                ? "bg-brand-accent text-white"
                                : "bg-brand-white text-brand-mid hover:text-brand-black border border-brand-light"
                            }
                          `}
                        >
                          {preset.name}
                          <span className="text-xs opacity-70 ml-1">
                            {preset.height > 0
                              ? `${preset.width}×${preset.height}`
                              : `${preset.width}px`}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {selectedPreset && (
                  <p className="text-sm text-brand-mid text-center mt-4">
                    {selectedPreset.description}:{" "}
                    <span className="font-mono text-brand-black">
                      {selectedPreset.height > 0
                        ? `${selectedPreset.width} × ${selectedPreset.height}`
                        : `너비 ${selectedPreset.width}px (높이 자동)`}
                    </span>
                    {selectedPreset.height > 0 && " · 비율이 다른 사진은 가운데를 기준으로 잘라 맞춥니다"}
                  </p>
                )}
              </div>
            )}

            {/* 확대 안 함 */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={doNotEnlarge}
                onChange={(e) => setDoNotEnlarge(e.target.checked)}
                className="w-4 h-4 accent-brand-accent"
              />
              <span className="text-sm text-brand-black">
                원본보다 크게 키우지 않기{" "}
                <span className="text-brand-mid">(확대 안 함)</span>
              </span>
            </label>

            {/* 리사이즈 버튼 */}
            <button
              onClick={handleResize}
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
                  리사이즈 중... ({processingIndex}/{images.length})
                </span>
              ) : completedImages.length > 0 ? (
                "설정 변경 후 다시 리사이즈"
              ) : (
                `${images.length}개 이미지 리사이즈`
              )}
            </button>
          </div>

          {/* 결과 비교 */}
          {selectedImage && selectedImage.status === "done" && selectedImage.result && (
            <div className="space-y-4">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                결과 비교
              </h3>

              <ResultCompare
                beforeSrc={selectedImage.originalDataUrl}
                afterSrc={selectedImage.result.dataUrl}
                beforeMeta={`${selectedImage.originalWidth}×${selectedImage.originalHeight}`}
                afterMeta={`${selectedImage.result.width}×${selectedImage.result.height}`}
              />

              {/* 치수 변화 — 리사이즈는 화면상 차이가 안 드러나므로 수치로 강조 */}
              <div className="bg-brand-paper rounded-xl p-5 flex items-center justify-center gap-4 font-mono text-base">
                <span className="text-brand-mid">
                  {selectedImage.originalWidth}×{selectedImage.originalHeight}
                </span>
                <svg
                  className="w-5 h-5 text-brand-light shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
                <span className="text-brand-accent">
                  {selectedImage.result.width}×{selectedImage.result.height}
                </span>
              </div>
            </div>
          )}

          {/* 다운로드 */}
          {completedImages.length > 0 && (
            <div className="bg-brand-black rounded-xl p-6">
              <div className="text-center mb-6">
                <p className="text-brand-paper text-lg">
                  {completedImages.length}개 이미지 리사이즈 완료
                </p>
              </div>

              <div className="flex justify-center">
                {downloadFiles.length === 1 ? (
                  <DownloadButton
                    tool="resize"
                    fileName={downloadFiles[0].name}
                    fileBlob={downloadFiles[0].blob}
                    variant="primary"
                    size="lg"
                    label="다운로드"
                  />
                ) : (
                  <DownloadButton
                    tool="resize"
                    files={downloadFiles}
                    zipFileName="floor05-resized-images.zip"
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
