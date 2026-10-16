/**
 * 이미지 리사이즈 로직
 * Canvas drawImage() 사용
 */

import { loadImage, fileToDataUrl, canvasToBlob } from "../common/fileUtils";
import { computeResizeDimensions, computeCoverCrop } from "./resizeDims";
import { drawImageDownscaled } from "./downscale";

export interface ResizeOptions {
  width: number;
  height: number;
  maintainAspectRatio?: boolean;
  /** width×height를 정확히 채우도록 가운데를 잘라 맞춘다(프리셋용). maintainAspectRatio보다 우선 */
  cover?: boolean;
  /** cover일 때 원본보다 크게 만들지 않는다 */
  noEnlarge?: boolean;
  outputFormat?: "image/jpeg" | "image/png" | "image/webp";
  quality?: number;
}

export interface ResizeResult {
  blob: Blob;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  dataUrl: string;
}

export interface SnsPreset {
  id: string;
  name: string;
  platform: string;
  width: number;
  height: number;
  description: string;
}

/**
 * SNS 프리셋 목록
 */
export const SNS_PRESETS: SnsPreset[] = [
  // Instagram
  {
    id: "instagram-square",
    name: "정방형",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    description: "피드 정방형",
  },
  {
    id: "instagram-portrait",
    name: "세로형",
    platform: "Instagram",
    width: 1080,
    height: 1350,
    description: "피드 세로형",
  },
  {
    id: "instagram-landscape",
    name: "가로형",
    platform: "Instagram",
    width: 1080,
    height: 566,
    description: "피드 가로형",
  },
  // YouTube
  {
    id: "youtube-thumbnail",
    name: "썸네일",
    platform: "YouTube",
    width: 1280,
    height: 720,
    description: "영상 썸네일",
  },
  {
    id: "youtube-channel-art",
    name: "채널 아트",
    platform: "YouTube",
    width: 2560,
    height: 1440,
    description: "채널 배너",
  },
  // 네이버
  {
    id: "naver-blog",
    name: "블로그",
    platform: "네이버",
    width: 860,
    height: 0, // 높이 자동
    description: "최적 너비",
  },
  // 카카오
  {
    id: "kakao-profile",
    name: "프로필",
    platform: "KakaoTalk",
    width: 640,
    height: 640,
    description: "프로필 사진",
  },
  // 당근
  {
    id: "daangn-product",
    name: "상품",
    platform: "당근마켓",
    width: 960,
    height: 960,
    description: "상품 이미지",
  },
];

/**
 * 이미지 리사이즈 (단일 파일)
 */
export async function resizeImage(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  const {
    width,
    height,
    maintainAspectRatio = true,
    outputFormat = "image/jpeg",
    quality = 0.92,
  } = options;

  // 파일을 Data URL로 변환
  const dataUrl = await fileToDataUrl(file);

  // 이미지 로드
  const img = await loadImage(dataUrl);

  // 새 크기 계산 (워커와 공유하는 순수 함수)
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;
  const crop = options.cover && width > 0 && height > 0
    ? computeCoverCrop(naturalW, naturalH, width, height, options.noEnlarge)
    : null;
  const { width: newWidth, height: newHeight } = crop ?? computeResizeDimensions(
    img.width,
    img.height,
    { width, height, maintainAspectRatio }
  );

  // Canvas에 그리기
  const canvas = document.createElement("canvas");
  canvas.width = newWidth;
  canvas.height = newHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  // 고품질 리사이즈 설정
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // PNG 투명 배경 처리 (JPG 변환 시 흰색 배경)
  if (outputFormat === "image/jpeg") {
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, newWidth, newHeight);
  }

  // 크게 줄일 때는 절반씩 나눠 그린다(Firefox·WebKit은 high 품질을 무시해 한 번에 줄이면 깨짐)
  if (crop) {
    drawImageDownscaled(ctx, img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, newWidth, newHeight);
  } else {
    drawImageDownscaled(ctx, img, 0, 0, naturalW, naturalH, 0, 0, newWidth, newHeight);
  }

  // Blob 생성 (단일 인코딩 — toDataURL 중복 제거, 호출측에서 objectURL 해제)
  const blob = await canvasToBlob(
    canvas,
    outputFormat,
    quality,
    "이미지 리사이즈에 실패했습니다."
  );

  return {
    blob,
    width: newWidth,
    height: newHeight,
    originalWidth: img.width,
    originalHeight: img.height,
    dataUrl: URL.createObjectURL(blob),
  };
}

/**
 * 프리셋으로 리사이즈
 */
export async function resizeWithPreset(
  file: File,
  presetId: string,
  options?: Partial<Omit<ResizeOptions, "width" | "height">>
): Promise<ResizeResult> {
  const preset = SNS_PRESETS.find((p) => p.id === presetId);

  if (!preset) {
    throw new Error("알 수 없는 프리셋입니다.");
  }

  return resizeImage(file, {
    width: preset.width,
    height: preset.height,
    maintainAspectRatio: preset.height === 0,
    ...options,
  });
}

/**
 * 퍼센트로 리사이즈
 */
export async function resizeByPercentage(
  file: File,
  percentage: number,
  options?: Partial<Omit<ResizeOptions, "width" | "height">>
): Promise<ResizeResult> {
  // 파일을 Data URL로 변환
  const dataUrl = await fileToDataUrl(file);

  // 이미지 로드
  const img = await loadImage(dataUrl);

  const newWidth = Math.round(img.width * (percentage / 100));
  const newHeight = Math.round(img.height * (percentage / 100));

  return resizeImage(file, {
    width: newWidth,
    height: newHeight,
    maintainAspectRatio: false,
    ...options,
  });
}

/**
 * 플랫폼별 프리셋 그룹화
 */
export function getPresetsByPlatform(): Record<string, SnsPreset[]> {
  return SNS_PRESETS.reduce((acc, preset) => {
    if (!acc[preset.platform]) {
      acc[preset.platform] = [];
    }
    acc[preset.platform].push(preset);
    return acc;
  }, {} as Record<string, SnsPreset[]>);
}
