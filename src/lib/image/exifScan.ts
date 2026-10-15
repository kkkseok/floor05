/**
 * EXIF/GPS 존재 여부 감지 (100% 클라이언트, 순수 함수)
 * - JPEG 마커를 따라가 EXIF(APP1) 세그먼트를 찾고, TIFF 구조(IFD0 → GPS IFD)를 실제로 읽는다.
 * - "위치정보 있음"은 GPS IFD 안에 위도·경도 태그가 있을 때만 참이다.
 *   이전의 바이트 패턴 탐색(0x8825)은 GPS가 없는 카메라 사진에서도 우연히 맞아
 *   잘못된 경고를 띄웠다(실측: NASA 공개 사진, docs/blog-data/exif-2026-10-15.json).
 * - 메타데이터 제거 전 "원본에 위치·촬영정보가 있었는지" 안내용
 */

export interface ExifScanResult {
  /** EXIF(APP1) 세그먼트 존재 */
  hasExif: boolean;
  /** GPS IFD에 위도 또는 경도 좌표가 기록돼 있음 */
  hasGps: boolean;
}

const NONE: ExifScanResult = { hasExif: false, hasGps: false };
const TAG_GPS_IFD = 0x8825;
const TAG_GPS_LATITUDE = 0x0002;
const TAG_GPS_LONGITUDE = 0x0004;

export function scanExif(bytes: Uint8Array): ExifScanResult {
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return NONE;

  const tiff = findExifTiff(bytes);
  if (!tiff) return NONE;
  return { hasExif: true, hasGps: tiffHasGpsCoordinates(tiff) };
}

/** APPn 세그먼트를 순서대로 읽어 "Exif\0\0"로 시작하는 APP1의 TIFF 영역을 돌려준다. */
function findExifTiff(bytes: Uint8Array): Uint8Array | null {
  let i = 2;
  while (i + 4 <= bytes.length && bytes[i] === 0xff) {
    const marker = bytes[i + 1];
    // 이미지 데이터 시작(SOS) 또는 끝(EOI)이면 메타데이터 구간이 끝난 것
    if (marker === 0xda || marker === 0xd9) return null;
    const length = (bytes[i + 2] << 8) | bytes[i + 3];
    if (length < 2) return null;
    const start = i + 4;
    const end = Math.min(bytes.length, i + 2 + length);
    if (
      marker === 0xe1 &&
      end - start >= 6 &&
      bytes[start] === 0x45 && // E
      bytes[start + 1] === 0x78 && // x
      bytes[start + 2] === 0x69 && // i
      bytes[start + 3] === 0x66 && // f
      bytes[start + 4] === 0x00 &&
      bytes[start + 5] === 0x00
    ) {
      return bytes.subarray(start + 6, end);
    }
    i = i + 2 + length;
  }
  return null;
}

function tiffHasGpsCoordinates(tiff: Uint8Array): boolean {
  if (tiff.length < 8) return false;
  const little = tiff[0] === 0x49 && tiff[1] === 0x49; // "II"
  const big = tiff[0] === 0x4d && tiff[1] === 0x4d; // "MM"
  if (!little && !big) return false;

  const u16 = (o: number) =>
    o + 2 > tiff.length ? -1 : little ? tiff[o] | (tiff[o + 1] << 8) : (tiff[o] << 8) | tiff[o + 1];
  const u32 = (o: number) =>
    o + 4 > tiff.length
      ? -1
      : little
        ? (tiff[o] | (tiff[o + 1] << 8) | (tiff[o + 2] << 16) | (tiff[o + 3] << 24)) >>> 0
        : ((tiff[o] << 24) | (tiff[o + 1] << 16) | (tiff[o + 2] << 8) | tiff[o + 3]) >>> 0;

  /** IFD의 태그 목록. 범위를 벗어나면 빈 배열 */
  const readIfd = (offset: number): { tag: number; value: number }[] => {
    const count = u16(offset);
    if (count < 0 || offset + 2 + count * 12 > tiff.length) return [];
    const entries = [];
    for (let k = 0; k < count; k++) {
      const e = offset + 2 + k * 12;
      entries.push({ tag: u16(e), value: u32(e + 8) });
    }
    return entries;
  };

  const gpsEntry = readIfd(u32(4)).find((e) => e.tag === TAG_GPS_IFD);
  if (!gpsEntry || gpsEntry.value <= 0) return false;
  return readIfd(gpsEntry.value).some(
    (e) => e.tag === TAG_GPS_LATITUDE || e.tag === TAG_GPS_LONGITUDE,
  );
}
