/**
 * 화질을 건드리지 않고(다시 인코딩하지 않고) 파일 바이트에서 메타데이터만 지운다.
 * - JPEG: APP1(EXIF·XMP), APP13(IPTC), COM 등 제거. 색 정보(APP0 JFIF, APP2 ICC, APP14 Adobe)는 유지.
 *   EXIF를 지우면 회전 정보도 사라져 세로 사진이 눕기 때문에, 회전값만 담은 최소 EXIF를 다시 넣는다.
 * - PNG: eXIf, tEXt, zTXt, iTXt, tIME 청크 제거
 * - WebP: EXIF, XMP 청크 제거 + VP8X 플래그 정리
 * 압축 결과가 원본보다 커서 원본을 내줄 때도 위치(GPS)·촬영 정보가 남지 않게 하려고 쓴다.
 */

const JPEG_KEEP_APP = new Set([0xe0, 0xe2, 0xee]); // JFIF, ICC_PROFILE, Adobe

function u16be(b: Uint8Array, o: number): number {
  return (b[o] << 8) | b[o + 1];
}

/** EXIF(APP1 본문, "Exif\0\0" 다음의 TIFF)에서 Orientation(0x0112) 값을 읽는다. 없으면 1 */
export function readTiffOrientation(tiff: Uint8Array): number {
  if (tiff.length < 8) return 1;
  const le = tiff[0] === 0x49 && tiff[1] === 0x49;
  const r16 = (o: number) => (le ? tiff[o] | (tiff[o + 1] << 8) : (tiff[o] << 8) | tiff[o + 1]);
  const r32 = (o: number) =>
    le
      ? (tiff[o] | (tiff[o + 1] << 8) | (tiff[o + 2] << 16) | (tiff[o + 3] << 24)) >>> 0
      : ((tiff[o] << 24) | (tiff[o + 1] << 16) | (tiff[o + 2] << 8) | tiff[o + 3]) >>> 0;
  const ifd = r32(4);
  if (ifd + 2 > tiff.length) return 1;
  const count = r16(ifd);
  for (let i = 0; i < count; i++) {
    const e = ifd + 2 + i * 12;
    if (e + 12 > tiff.length) break;
    if (r16(e) === 0x0112) {
      const v = r16(e + 8);
      return v >= 1 && v <= 8 ? v : 1;
    }
  }
  return 1;
}

/** 회전값 하나만 담은 APP1(EXIF) 세그먼트 */
function orientationApp1(orientation: number): Uint8Array {
  const body = [
    0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // "Exif\0\0"
    0x4d, 0x4d, 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08, // TIFF 빅엔디언, IFD0 오프셋 8
    0x00, 0x01, // 항목 1개
    0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, orientation, 0x00, 0x00, // Orientation SHORT
    0x00, 0x00, 0x00, 0x00, // 다음 IFD 없음
  ];
  const len = body.length + 2;
  return Uint8Array.from([0xff, 0xe1, len >> 8, len & 0xff, ...body]);
}

export function stripJpegMetadata(b: Uint8Array): Uint8Array | null {
  if (b.length < 4 || b[0] !== 0xff || b[1] !== 0xd8) return null;
  const kept: Uint8Array[] = [b.subarray(0, 2)];
  let orientation = 1;
  let o = 2;
  while (o + 4 <= b.length) {
    if (b[o] !== 0xff) return null;
    const marker = b[o + 1];
    if (marker === 0xff) {
      o++; // 채움 바이트
      continue;
    }
    if (marker === 0xda) {
      kept.push(b.subarray(o)); // SOS부터 끝까지는 영상 데이터
      break;
    }
    const len = u16be(b, o + 2);
    if (len < 2 || o + 2 + len > b.length) return null;
    const seg = b.subarray(o, o + 2 + len);
    const isApp = marker >= 0xe0 && marker <= 0xef;
    if (marker === 0xe1 && len >= 8 && String.fromCharCode(...seg.subarray(4, 8)) === "Exif") {
      orientation = readTiffOrientation(seg.subarray(10));
    }
    const drop = marker === 0xfe || (isApp && !JPEG_KEEP_APP.has(marker));
    if (!drop) kept.push(seg);
    o += 2 + len;
  }
  if (orientation !== 1) {
    // APP0(JFIF) 뒤, 없으면 SOI 바로 뒤에 넣는다
    const at = kept.length > 1 && kept[1][1] === 0xe0 ? 2 : 1;
    kept.splice(at, 0, orientationApp1(orientation));
  }
  return concat(kept);
}

const PNG_DROP = new Set(["eXIf", "tEXt", "zTXt", "iTXt", "tIME"]);
const PNG_SIG = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];

export function stripPngMetadata(b: Uint8Array): Uint8Array | null {
  if (b.length < 8 || PNG_SIG.some((v, i) => b[i] !== v)) return null;
  const kept: Uint8Array[] = [b.subarray(0, 8)];
  let o = 8;
  while (o + 12 <= b.length) {
    const len = ((b[o] << 24) | (b[o + 1] << 16) | (b[o + 2] << 8) | b[o + 3]) >>> 0;
    const type = String.fromCharCode(b[o + 4], b[o + 5], b[o + 6], b[o + 7]);
    const end = o + 12 + len;
    if (end > b.length) return null;
    if (!PNG_DROP.has(type)) kept.push(b.subarray(o, end));
    o = end;
    if (type === "IEND") break;
  }
  return concat(kept);
}

export function stripWebpMetadata(b: Uint8Array): Uint8Array | null {
  const tag = (o: number) => String.fromCharCode(b[o], b[o + 1], b[o + 2], b[o + 3]);
  if (b.length < 12 || tag(0) !== "RIFF" || tag(8) !== "WEBP") return null;
  const kept: Uint8Array[] = [];
  let o = 12;
  while (o + 8 <= b.length) {
    const id = tag(o);
    const size = (b[o + 4] | (b[o + 5] << 8) | (b[o + 6] << 16) | (b[o + 7] << 24)) >>> 0;
    const end = o + 8 + size + (size & 1);
    if (o + 8 + size > b.length) return null;
    if (id === "VP8X") {
      const chunk = b.slice(o, Math.min(end, b.length));
      chunk[8] &= ~(0x08 | 0x04); // EXIF·XMP 있음 표시 지우기
      kept.push(chunk);
    } else if (id !== "EXIF" && id !== "XMP ") {
      kept.push(b.subarray(o, Math.min(end, b.length)));
    }
    o = end;
  }
  const body = concat(kept);
  const out = new Uint8Array(12 + body.length);
  out.set(b.subarray(0, 12));
  const riffSize = 4 + body.length;
  out[4] = riffSize & 0xff;
  out[5] = (riffSize >> 8) & 0xff;
  out[6] = (riffSize >> 16) & 0xff;
  out[7] = (riffSize >>> 24) & 0xff;
  out.set(body, 12);
  return out;
}

/** 형식을 바이트로 판별해 메타데이터를 지운다. 지원하지 않거나 구조가 깨졌으면 null */
export function stripMetadata(b: Uint8Array): Uint8Array | null {
  return stripJpegMetadata(b) ?? stripPngMetadata(b) ?? stripWebpMetadata(b);
}

function concat(parts: Uint8Array[]): Uint8Array {
  const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0));
  let o = 0;
  for (const p of parts) {
    out.set(p, o);
    o += p.length;
  }
  return out;
}
