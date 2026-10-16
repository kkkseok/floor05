/**
 * 이미지 합치기 로직
 * 여러 이미지를 세로/가로로 한 장의 캔버스에 결합한다. (메인 스레드, Canvas API)
 */

import { loadImage, fileToDataUrl, canvasToBlob } from "../common/fileUtils";

/** 합친 결과 한 변의 최대 픽셀 (JPEG 규격 한계 65,535) */
export const MAX_MERGED_SIDE = 65535;

export type MergeDirection = "vertical" | "horizontal";
/** match: 공통 축 크기를 최대값으로 통일(비율 유지) / keep: 원본 크기 유지 + 배경 레터박스 */
export type MergeSizeStrategy = "match" | "keep";
/** keep 전략에서 교차축 정렬 */
export type MergeAlign = "start" | "center" | "end";

export interface MergeOptions {
  direction?: MergeDirection;
  gap?: number;
  background?: string;
  sizeStrategy?: MergeSizeStrategy;
  align?: MergeAlign;
  outputFormat?: "image/jpeg" | "image/png" | "image/webp";
  quality?: number;
}

export interface MergeResult {
  blob: Blob;
  width: number;
  height: number;
  dataUrl: string;
  count: number;
}

interface Placement {
  x: number;
  y: number;
  w: number;
  h: number;
}

/**
 * 여러 이미지를 한 장으로 합친다.
 * - vertical: 위→아래로 쌓음 (교차축 = 너비)
 * - horizontal: 좌→우로 이어붙임 (교차축 = 높이)
 */
export async function mergeImages(
  files: File[],
  options: MergeOptions = {}
): Promise<MergeResult> {
  const {
    direction = "vertical",
    gap = 0,
    background = "#FFFFFF",
    sizeStrategy = "match",
    align = "center",
    outputFormat = "image/jpeg",
    quality = 0.92,
  } = options;

  if (files.length < 2) {
    throw new Error("합칠 이미지를 2장 이상 선택해주세요.");
  }

  // 모든 이미지 로드
  const dataUrls = await Promise.all(files.map((f) => fileToDataUrl(f)));
  const imgs = await Promise.all(dataUrls.map((u) => loadImage(u)));

  const safeGap = Math.max(0, Math.round(gap));
  const isVertical = direction === "vertical";

  // 교차축 정렬 오프셋 (start/center/end)
  const crossOffset = (track: number, size: number): number => {
    if (align === "start") return 0;
    if (align === "end") return track - size;
    return Math.round((track - size) / 2);
  };

  let placements: Placement[];
  let canvasW: number;
  let canvasH: number;

  if (isVertical) {
    // 너비가 교차축 — 가장 넓은 이미지에 맞춤
    const trackW = Math.max(...imgs.map((i) => i.width));
    let y = 0;
    placements = imgs.map((img) => {
      let w = img.width;
      let h = img.height;
      if (sizeStrategy === "match") {
        // 비율 유지하며 너비를 trackW로 스케일
        h = Math.round(img.height * (trackW / img.width));
        w = trackW;
      }
      const p: Placement = { x: crossOffset(trackW, w), y, w, h };
      y += h + safeGap;
      return p;
    });
    canvasW = trackW;
    canvasH = y - safeGap; // 마지막 간격 제거
  } else {
    // 높이가 교차축 — 가장 높은 이미지에 맞춤
    const trackH = Math.max(...imgs.map((i) => i.height));
    let x = 0;
    placements = imgs.map((img) => {
      let w = img.width;
      let h = img.height;
      if (sizeStrategy === "match") {
        w = Math.round(img.width * (trackH / img.height));
        h = trackH;
      }
      const p: Placement = { x, y: crossOffset(trackH, h), w, h };
      x += w + safeGap;
      return p;
    });
    canvasH = trackH;
    canvasW = x - safeGap;
  }

  canvasW = Math.max(1, Math.round(canvasW));
  canvasH = Math.max(1, Math.round(canvasH));

  // JPG는 한 변이 65,535px를 넘을 수 없고, 브라우저 캔버스도 대개 이 근처가 한계다
  // (실측: Chromium·Firefox 65,520px까지 성공, docs/blog-data/image-merge-2026-10-15.json).
  // 큰 캔버스를 만들다 멈추기 전에 미리 안내한다.
  const longest = Math.max(canvasW, canvasH);
  if (longest > MAX_MERGED_SIDE) {
    throw new Error(
      `합친 결과의 ${canvasH >= canvasW ? "높이" : "너비"}가 ${longest.toLocaleString()}px로, 한 장에 담을 수 있는 ${MAX_MERGED_SIDE.toLocaleString()}px를 넘습니다. 두 번에 나눠 합치거나 크기 조절로 이미지를 먼저 줄여 주세요.`
    );
  }

  const canvas = document.createElement("canvas");
  canvas.width = canvasW;
  canvas.height = canvasH;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  // JPG는 투명을 지원하지 않고, 간격/레터박스가 있으면 빈 영역을 채워야 한다.
  // (PNG/WebP + match + gap 0이면 투명 유지)
  const needsBackground =
    outputFormat === "image/jpeg" || safeGap > 0 || sizeStrategy === "keep";
  if (needsBackground) {
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  imgs.forEach((img, i) => {
    const p = placements[i];
    ctx.drawImage(img, p.x, p.y, p.w, p.h);
  });

  const blob = await canvasToBlob(
    canvas,
    outputFormat,
    quality,
    "이미지가 너무 크거나 많아 합칠 수 없습니다. 장수를 줄이거나 크기를 먼저 줄여보세요."
  );
  const dataUrl = canvas.toDataURL(outputFormat, quality);

  return { blob, width: canvasW, height: canvasH, dataUrl, count: files.length };
}
