/**
 * PNG 압축 (UPNG.js — 순수 JS · MIT · 동적 로드)
 *
 * Canvas의 toBlob('image/png')은 PNG를 최적화하지 못해 "PNG 압축"이 사실상 무효였다.
 * UPNG로 (1) 무손실 재압축, (2) 팔레트 양자화(손실, 색상 수 ↓)를 지원해
 * 투명도를 유지하면서 실제로 용량을 줄인다. 파일은 서버로 전송되지 않는다($0·무전송 유지).
 */
import { loadImage, fileToDataUrl } from "../common/fileUtils";
import type { CompressionResult } from "./compress";

/**
 * 품질(1~100)을 UPNG 색상 수(cnum)로 변환.
 * - 100 = 무손실(cnum 0)
 * - 그 미만 = 팔레트 양자화(색상 수가 줄수록 용량↓, 약간의 색 손실). 8~256색으로 매핑.
 */
export function qualityToColors(quality: number): number {
  if (quality >= 100) return 0; // 무손실
  return Math.min(256, Math.max(8, Math.round((quality / 100) * 256)));
}

/**
 * PNG로 압축 (투명 유지). 결과가 원본보다 커지면 원본을 그대로 반환한다.
 */
export async function compressPng(
  file: File,
  quality: number
): Promise<CompressionResult> {
  const dataUrl = await fileToDataUrl(file);
  const img = await loadImage(dataUrl);

  const width = img.naturalWidth || img.width;
  const height = img.naturalHeight || img.height;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }
  ctx.drawImage(img, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);

  // UPNG는 동적 로드 (초기 번들 영향 0 — heic2any 패턴과 동일)
  const { default: UPNG } = await import("upng-js");

  // 무손실(cnum 0)을 항상 후보로 둔다.
  // 그라데이션/사진형 PNG는 팔레트 양자화가 오히려 더 커질 수 있어,
  // 팔레트(손실) 후보와 비교해 더 작은 쪽을 고른다. (로고·스크린샷은 팔레트가 크게 이김)
  let best = UPNG.encode([data.buffer], width, height, 0);
  const colors = qualityToColors(quality);
  if (colors > 0) {
    const palette = UPNG.encode([data.buffer], width, height, colors);
    if (palette.byteLength < best.byteLength) best = palette;
  }

  // 그래도 원본보다 크면 원본을 그대로 유지 (압축했더니 커지는 상황 방지)
  if (best.byteLength >= file.size) {
    return {
      blob: file,
      width,
      height,
      originalSize: file.size,
      compressedSize: file.size,
      dataUrl,
    };
  }

  const blob = new Blob([best], { type: "image/png" });
  return {
    blob,
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
    dataUrl: URL.createObjectURL(blob),
  };
}

/**
 * 투명도를 유지한 채(PNG) 목표 용량을 맞춰 본다. 무손실 → 색 수를 줄인 팔레트 순으로 시도해
 * 처음으로 목표 이하가 되는 결과를 돌려주고, 끝까지 안 되면 null(호출측이 JPG로 대체).
 * 예전에는 목표 용량 모드가 무조건 JPG라 투명 로고가 흰 배경이 됐다
 * (실측: docs/blog-data/alpha-2026-10-16.json, 23KB 투명 PNG → 20KB 목표 → JPG 14.8KB).
 */
export async function compressPngToTarget(
  file: File,
  targetSizeKB: number,
): Promise<CompressionResult | null> {
  const targetBytes = targetSizeKB * 1024;
  for (const quality of [100, 60, 30, 3]) {
    const result = await compressPng(file, quality);
    if (result.compressedSize <= targetBytes) return result;
    URL.revokeObjectURL(result.dataUrl);
  }
  return null;
}
