/**
 * 이미지 대표 색 추출 (100% 클라이언트, 순수 함수)
 * - RGBA 픽셀 배열을 4비트씩 양자화해 버킷별로 모으고, 빈도 상위 N개의 평균색 반환
 * - 컴포넌트가 작은 캔버스로 다운스케일한 ImageData를 넘겨준다
 */

import type { RGB } from "@/lib/image/color-convert";

interface Bucket {
  count: number;
  r: number;
  g: number;
  b: number;
}

/**
 * @param data RGBA 픽셀 (Uint8ClampedArray)
 * @param count 추출할 대표 색 개수
 */
export function extractPalette(data: Uint8ClampedArray, count: number): RGB[] {
  const buckets = new Map<number, Bucket>();

  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3];
    if (a < 16) continue; // 거의 투명한 픽셀 제외
    const r = data[i], g = data[i + 1], b = data[i + 2];
    // 채널당 4비트(16단계)로 양자화한 키
    const key = ((r >> 4) << 8) | ((g >> 4) << 4) | (b >> 4);
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.count++;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
    } else {
      buckets.set(key, { count: 1, r, g, b });
    }
  }

  return [...buckets.values()]
    .sort((a, b) => b.count - a.count)
    .slice(0, count)
    .map((bk) => ({
      r: Math.round(bk.r / bk.count),
      g: Math.round(bk.g / bk.count),
      b: Math.round(bk.b / bk.count),
    }));
}
