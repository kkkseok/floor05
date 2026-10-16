/**
 * 이미지 크롭 로직
 * Canvas + 마우스/터치 이벤트
 */

import { loadImage, fileToDataUrl, canvasToBlob } from "../common/fileUtils";
import { drawImageDownscaled } from "./downscale";

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface CropOptions {
  area: CropArea;
  rotation?: number; // 0, 90, 180, 270
  flipHorizontal?: boolean;
  flipVertical?: boolean;
  outputFormat?: "image/jpeg" | "image/png" | "image/webp";
  quality?: number;
  targetWidth?: number; // 고정 크기 출력 (px). 설정 시 크롭 결과를 이 크기로 리샘플
  targetHeight?: number;
  circle?: boolean; // 원형(타원) 마스크 — 코너 투명, PNG로 출력
}

export interface IdPhotoPreset {
  id: string;
  name: string;
  ratio: number;
  width: number; // 권장 출력 px (300 DPI 기준)
  height: number;
  description: string;
}

/**
 * 증명/여권 사진 프리셋 (한국 규격, 300 DPI 기준 px)
 */
export const ID_PHOTO_PRESETS: IdPhotoPreset[] = [
  { id: "id-3x4", name: "증명사진 3×4", ratio: 30 / 40, width: 354, height: 472, description: "3×4cm" },
  { id: "passport", name: "여권 3.5×4.5", ratio: 35 / 45, width: 413, height: 531, description: "3.5×4.5cm" },
  { id: "visa-2x2", name: "미국 비자 2×2", ratio: 1, width: 600, height: 600, description: "2×2 inch" },
];

export interface CropResult {
  blob: Blob;
  width: number;
  height: number;
  dataUrl: string;
}

export interface AspectRatioPreset {
  id: string;
  name: string;
  ratio: number | null; // null = 자유
  description: string;
}

/**
 * 비율 프리셋
 */
export const ASPECT_RATIO_PRESETS: AspectRatioPreset[] = [
  { id: "free", name: "자유", ratio: null, description: "자유롭게 선택" },
  { id: "1:1", name: "1:1", ratio: 1, description: "정방형" },
  { id: "4:3", name: "4:3", ratio: 4 / 3, description: "일반 사진" },
  { id: "3:4", name: "3:4", ratio: 3 / 4, description: "세로 사진" },
  { id: "16:9", name: "16:9", ratio: 16 / 9, description: "와이드스크린" },
  { id: "9:16", name: "9:16", ratio: 9 / 16, description: "스마트폰 세로" },
];

/**
 * 이미지 크롭
 */
export async function cropImage(
  file: File,
  options: CropOptions
): Promise<CropResult> {
  const {
    area,
    rotation = 0,
    flipHorizontal = false,
    flipVertical = false,
    outputFormat = "image/jpeg",
    quality = 0.92,
    targetWidth,
    targetHeight,
    circle = false,
  } = options;

  // 파일을 Data URL로 변환
  const dataUrl = await fileToDataUrl(file);

  // 이미지 로드
  const img = await loadImage(dataUrl);

  // 회전/반전 적용
  const transformedCanvas = applyTransformations(
    img,
    rotation,
    flipHorizontal,
    flipVertical
  );

  // 크롭 좌표를 정수로 정규화하고 캔버스 경계로 클램프
  // (비정수 area → 1px 빈 줄/흐림 + 비정수 치수 표시 방지)
  const cropX = Math.max(0, Math.round(area.x));
  const cropY = Math.max(0, Math.round(area.y));
  const cropW = Math.max(1, Math.min(Math.round(area.width), transformedCanvas.width - cropX));
  const cropH = Math.max(1, Math.min(Math.round(area.height), transformedCanvas.height - cropY));

  // 원형 크롭은 투명 코너가 필요하므로 PNG로 출력
  const effectiveFormat = circle ? "image/png" : outputFormat;

  // 1) 원본 픽셀을 잘라낸 캔버스 (배경 없음)
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = cropW;
  cropCanvas.height = cropH;
  const cctx = cropCanvas.getContext("2d");
  if (!cctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }
  cctx.imageSmoothingEnabled = true;
  cctx.imageSmoothingQuality = "high";
  cctx.drawImage(transformedCanvas, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);

  // 2) 최종 출력 크기 (고정 크기 출력 지원)
  const outW = targetWidth && targetWidth > 0 ? Math.round(targetWidth) : cropW;
  const outH = targetHeight && targetHeight > 0 ? Math.round(targetHeight) : cropH;

  const outCanvas = document.createElement("canvas");
  outCanvas.width = outW;
  outCanvas.height = outH;
  const octx = outCanvas.getContext("2d");
  if (!octx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }
  octx.imageSmoothingEnabled = true;
  octx.imageSmoothingQuality = "high";

  // 배경: 원형이 아니고 JPG일 때만 흰색 채움 (JPG는 투명 미지원)
  if (effectiveFormat === "image/jpeg") {
    octx.fillStyle = "#FFFFFF";
    octx.fillRect(0, 0, outW, outH);
  }

  // 증명사진 크기처럼 크게 줄일 때 절반씩 나눠 그린다(Firefox·WebKit은 high 품질을 무시)
  drawImageDownscaled(octx, cropCanvas, 0, 0, cropW, cropH, 0, 0, outW, outH);

  // 3) 원형(타원) 마스크 — 코너를 투명하게
  if (circle) {
    octx.globalCompositeOperation = "destination-in";
    octx.beginPath();
    octx.ellipse(outW / 2, outH / 2, outW / 2, outH / 2, 0, 0, Math.PI * 2);
    octx.fill();
    octx.globalCompositeOperation = "source-over";
  }

  const blob = await canvasToBlob(
    outCanvas,
    effectiveFormat,
    quality,
    "이미지 크롭에 실패했습니다."
  );
  const croppedDataUrl = outCanvas.toDataURL(effectiveFormat, quality);

  return {
    blob,
    width: outW,
    height: outH,
    dataUrl: croppedDataUrl,
  };
}

/**
 * 회전/반전 적용
 */
function applyTransformations(
  img: HTMLImageElement,
  rotation: number,
  flipHorizontal: boolean,
  flipVertical: boolean
): HTMLCanvasElement {
  const canvas = document.createElement("canvas");

  // 회전에 따른 캔버스 크기 조정
  const isRotated90or270 = rotation === 90 || rotation === 270;
  canvas.width = isRotated90or270 ? img.height : img.width;
  canvas.height = isRotated90or270 ? img.width : img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  // 중심으로 이동
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // 회전
  ctx.rotate((rotation * Math.PI) / 180);

  // 반전
  ctx.scale(flipHorizontal ? -1 : 1, flipVertical ? -1 : 1);

  // 이미지 그리기 (중심 기준)
  ctx.drawImage(img, -img.width / 2, -img.height / 2);

  return canvas;
}

/**
 * 회전된 이미지의 크기 계산
 */
export function getRotatedDimensions(
  width: number,
  height: number,
  rotation: number
): { width: number; height: number } {
  const isRotated90or270 = rotation === 90 || rotation === 270;
  return {
    width: isRotated90or270 ? height : width,
    height: isRotated90or270 ? width : height,
  };
}

/**
 * 비율에 맞는 최대 크롭 영역 계산
 */
export function calculateMaxCropArea(
  imageWidth: number,
  imageHeight: number,
  aspectRatio: number | null
): CropArea {
  if (aspectRatio === null) {
    return { x: 0, y: 0, width: imageWidth, height: imageHeight };
  }

  const imageRatio = imageWidth / imageHeight;

  let cropWidth: number;
  let cropHeight: number;

  if (imageRatio > aspectRatio) {
    // 이미지가 더 넓음
    cropHeight = imageHeight;
    cropWidth = cropHeight * aspectRatio;
  } else {
    // 이미지가 더 높음
    cropWidth = imageWidth;
    cropHeight = cropWidth / aspectRatio;
  }

  return {
    x: (imageWidth - cropWidth) / 2,
    y: (imageHeight - cropHeight) / 2,
    width: cropWidth,
    height: cropHeight,
  };
}

/**
 * 회전된 이미지의 미리보기 Data URL 생성
 */
export async function getTransformedPreview(
  dataUrl: string,
  rotation: number,
  flipHorizontal: boolean,
  flipVertical: boolean
): Promise<string> {
  const img = await loadImage(dataUrl);
  const canvas = applyTransformations(img, rotation, flipHorizontal, flipVertical);
  // PNG로 직렬화 — 투명 이미지가 편집 미리보기에서 검은색으로 막히지 않도록
  // (JPEG는 알파 미지원이라 투명 영역이 검게 합성됨)
  return canvas.toDataURL("image/png");
}
