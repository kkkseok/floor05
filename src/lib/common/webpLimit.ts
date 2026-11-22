/**
 * WebP로 저장할 수 있는 한 변의 최대 픽셀.
 * 이보다 긴 캔버스를 WebP로 인코딩하면 Chromium은 오류 없이 16,383px에서 잘라 저장하고
 * (1080×20000 → 1080×16383), Firefox·WebKit은 null을 돌려준다(2026-11-22 실측,
 * docs/blog-data/webp-when-2026-11-22.json). 조용히 잘린 파일이 나가지 않도록 인코딩 전에 막는다.
 */
export const WEBP_MAX_SIDE = 16383;

/** WebP 출력인데 한 변이 한계를 넘으면 해결 방법을 담은 안내로 중단한다. 다른 형식은 통과. */
export function assertWebpEncodable(type: string, width: number, height: number): void {
  if (type !== "image/webp") return;
  const longest = Math.max(width, height);
  if (longest <= WEBP_MAX_SIDE) return;
  throw new Error(
    `WebP는 한 변이 ${WEBP_MAX_SIDE.toLocaleString("ko-KR")}px까지만 저장됩니다. 이 이미지는 ${height >= width ? "높이" : "너비"}가 ${longest.toLocaleString("ko-KR")}px라 그대로 저장하면 잘립니다. JPG나 PNG로 저장하거나 크기 조절로 먼저 줄여 주세요.`
  );
}
