/**
 * 이미지 압축 로직
 * Canvas API + toBlob() quality parameter 사용
 */

import { loadImage, fileToDataUrl, canvasToBlob } from "../common/fileUtils";
import { drawImageDownscaled } from "./downscale";

export interface CompressionOptions {
  quality: number; // 0.01 ~ 1.0
  maxWidth?: number;
  maxHeight?: number;
  outputFormat?: "image/jpeg" | "image/png" | "image/webp";
}

export interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  compressedSize: number;
  dataUrl: string;
  /** 목표 용량을 맞추려고 해상도를 줄였을 때의 원본 치수 */
  resizedFrom?: { width: number; height: number };
}

/**
 * 이미지 압축 (단일 파일)
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const {
    quality,
    maxWidth,
    maxHeight,
    outputFormat = "image/jpeg",
  } = options;

  // 파일을 Data URL로 변환
  const dataUrl = await fileToDataUrl(file);

  // 이미지 로드
  const img = await loadImage(dataUrl);

  // 크기 계산
  let { width, height } = img;

  if (maxWidth && width > maxWidth) {
    height = Math.round((height * maxWidth) / width);
    width = maxWidth;
  }

  if (maxHeight && height > maxHeight) {
    width = Math.round((width * maxHeight) / height);
    height = maxHeight;
  }

  // Canvas에 그리기
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  // PNG 투명 배경 처리 (JPG 변환 시 흰색 배경)
  if (outputFormat === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, width, height);
  }

  // 해상도를 크게 줄일 때는 절반씩 나눠 그린다(Firefox·WebKit은 high 품질을 무시해 한 번에 줄이면 깨짐)
  drawImageDownscaled(ctx, img, 0, 0, img.naturalWidth || img.width, img.naturalHeight || img.height, 0, 0, width, height);

  // Blob 생성
  const blob = await canvasToBlob(
    canvas,
    outputFormat,
    quality,
    "이미지 압축에 실패했습니다."
  );

  // Blob에서 Data URL 생성 (toDataURL 중복 호출 방지)
  const compressedDataUrl = URL.createObjectURL(blob);

  return {
    blob,
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
    dataUrl: compressedDataUrl,
  };
}

/** 목표 용량 모드에서 허용하는 최저 품질. 이보다 낮춰야 하면 해상도를 줄인다. */
export const TARGET_QUALITY_FLOOR = 0.6;
const TARGET_QUALITY_CEIL = 0.92;
const TARGET_SCALES = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1];

/**
 * 목표 용량으로 압축.
 * 품질만 끝까지 낮추면 용량은 맞아도 사진이 깨진다(실측: 5522px 사진 200KB 목표 → 품질 1.8%).
 * 그래서 품질은 TARGET_QUALITY_FLOOR 아래로 내리지 않고, 그래도 크면 해상도를 단계적으로 줄인다.
 * 각 해상도에서는 [FLOOR, CEIL] 구간을 이진 탐색해 목표 이하 중 가장 높은 품질을 고른다.
 * 근거: docs/blog-data/compress-target-2026-10-15.json (1920px 화면 기준 PSNR 비교)
 */
export async function compressToTargetSize(
  file: File,
  targetSizeKB: number,
  options: Omit<CompressionOptions, "quality"> = {}
): Promise<CompressionResult> {
  const targetBytes = targetSizeKB * 1024;
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  // 이미 목표보다 작으면 그대로 반환
  if (file.size <= targetBytes) {
    return {
      blob: file,
      width: img.width,
      height: img.height,
      originalSize: file.size,
      compressedSize: file.size,
      dataUrl,
    };
  }

  const baseWidth = Math.min(img.width, options.maxWidth ?? img.width);
  const baseHeight = Math.min(img.height, options.maxHeight ?? img.height);
  let last: CompressionResult | null = null;

  for (const scale of TARGET_SCALES) {
    const sized = {
      ...options,
      maxWidth: Math.max(1, Math.round(baseWidth * scale)),
      maxHeight: Math.max(1, Math.round(baseHeight * scale)),
    };
    const atFloor = await compressImage(file, { ...sized, quality: TARGET_QUALITY_FLOOR });
    if (atFloor.compressedSize > targetBytes) {
      if (last) URL.revokeObjectURL(last.dataUrl);
      last = atFloor;
      continue;
    }

    let best = atFloor;
    let low = TARGET_QUALITY_FLOOR;
    let high = TARGET_QUALITY_CEIL;
    for (let i = 0; i < 7 && high - low > 0.01; i++) {
      const mid = (low + high) / 2;
      const result = await compressImage(file, { ...sized, quality: mid });
      if (result.compressedSize <= targetBytes) {
        URL.revokeObjectURL(best.dataUrl);
        best = result;
        low = mid;
      } else {
        URL.revokeObjectURL(result.dataUrl);
        high = mid;
      }
    }
    if (last) URL.revokeObjectURL(last.dataUrl);
    return withResizeInfo(best, img);
  }

  // 가장 작은 해상도에서도 목표를 넘으면 그 결과를 돌려준다(호출측이 용량을 표시).
  return withResizeInfo(last!, img);
}

function withResizeInfo(result: CompressionResult, img: HTMLImageElement): CompressionResult {
  if (result.width === img.width && result.height === img.height) return result;
  return { ...result, resizedFrom: { width: img.width, height: img.height } };
}

/**
 * 미리보기용 빠른 압축
 */
export async function quickCompress(
  file: File,
  quality: number
): Promise<{ dataUrl: string; size: number }> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  const canvas = document.createElement("canvas");
  canvas.width = img.width;
  canvas.height = img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  // JPG로 변환 (용량 계산)
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(0, 0, img.width, img.height);
  ctx.drawImage(img, 0, 0);

  const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

  // Base64 크기 계산 (대략적)
  const base64Length = compressedDataUrl.length - "data:image/jpeg;base64,".length;
  const estimatedSize = Math.round((base64Length * 3) / 4);

  return {
    dataUrl: compressedDataUrl,
    size: estimatedSize,
  };
}

/**
 * 이미지 MIME 타입에서 출력 포맷 결정
 */
export function getOutputFormat(
  mimeType: string
): "image/jpeg" | "image/png" | "image/webp" {
  switch (mimeType.toLowerCase()) {
    case "image/png":
      return "image/png";
    case "image/webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

