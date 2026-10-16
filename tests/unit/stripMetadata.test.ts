/**
 * 메타데이터 무손실 제거 — 영상 데이터는 그대로, EXIF·GPS·텍스트만 빠지는지 바이트로 확인
 */
import { describe, it, expect } from "vitest";
import {
  stripJpegMetadata,
  stripPngMetadata,
  stripWebpMetadata,
  readTiffOrientation,
} from "@/lib/image/stripMetadata";

const enc = (s: string) => [...s].map((c) => c.charCodeAt(0));
const has = (b: Uint8Array, s: string) => Buffer.from(b).includes(Buffer.from(s, "latin1"));
const seg = (marker: number, body: number[]) => [0xff, marker, (body.length + 2) >> 8, (body.length + 2) & 0xff, ...body];

// 회전값 6 + GPS 표식 문자열을 담은 빅엔디언 EXIF
const exifBody = [
  ...enc("Exif\0\0"),
  ...enc("MM"), 0x00, 0x2a, 0x00, 0x00, 0x00, 0x08,
  0x00, 0x01,
  0x01, 0x12, 0x00, 0x03, 0x00, 0x00, 0x00, 0x01, 0x00, 0x06, 0x00, 0x00,
  0x00, 0x00, 0x00, 0x00,
  ...enc("GPS-SECRET-37.5665N"),
];
const scan = [0xff, 0xda, 0x00, 0x08, 1, 2, 3, 4, 5, 6, 0x11, 0x22, 0x33, 0xff, 0xd9];

describe("stripJpegMetadata", () => {
  const jpeg = Uint8Array.from([
    0xff, 0xd8,
    ...seg(0xe0, enc("JFIF\0\x01\x01\0\0\x01\0\x01\0\0")),
    ...seg(0xe1, exifBody),
    ...seg(0xe1, enc("http://ns.adobe.com/xap/1.0/\0<x:xmpmeta>XMP-SECRET</x:xmpmeta>")),
    ...seg(0xe2, enc("ICC_PROFILE\0\x01\x01PROFILE")),
    ...seg(0xed, enc("Photoshop 3.0\0IPTC-SECRET")),
    ...seg(0xfe, enc("COMMENT-SECRET")),
    ...seg(0xdb, [0, ...new Array(64).fill(1)]),
    ...scan,
  ]);

  it("EXIF·XMP·IPTC·COM은 지우고 JFIF·ICC·양자화표·영상 데이터는 그대로", () => {
    const out = stripJpegMetadata(jpeg)!;
    expect(out).not.toBeNull();
    for (const s of ["GPS-SECRET", "XMP-SECRET", "IPTC-SECRET", "COMMENT-SECRET"]) expect(has(out, s)).toBe(false);
    expect(has(out, "JFIF")).toBe(true);
    expect(has(out, "ICC_PROFILE")).toBe(true);
    expect(Buffer.from(out.subarray(out.length - scan.length))).toEqual(Buffer.from(scan));
  });

  it("회전값(6)은 최소 EXIF로 다시 넣어 사진이 눕지 않는다", () => {
    const out = stripJpegMetadata(jpeg)!;
    const at = Buffer.from(out).indexOf(Buffer.from("Exif\0\0", "latin1"));
    expect(at).toBeGreaterThan(0);
    expect(readTiffOrientation(out.subarray(at + 6))).toBe(6);
  });

  it("JPEG가 아니면 null", () => {
    expect(stripJpegMetadata(Uint8Array.from([0x89, 0x50, 0x4e, 0x47]))).toBeNull();
  });
});

describe("stripPngMetadata", () => {
  const chunk = (type: string, data: number[]) => [
    (data.length >>> 24) & 0xff, (data.length >>> 16) & 0xff, (data.length >>> 8) & 0xff, data.length & 0xff,
    ...enc(type), ...data, 0, 0, 0, 0,
  ];
  const png = Uint8Array.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    ...chunk("IHDR", new Array(13).fill(1)),
    ...chunk("tEXt", enc("Author\0TEXT-SECRET")),
    ...chunk("eXIf", enc("MM\0*GPS-SECRET")),
    ...chunk("IDAT", [9, 8, 7, 6]),
    ...chunk("IEND", []),
  ]);
  it("tEXt·eXIf는 지우고 IHDR·IDAT·IEND는 유지", () => {
    const out = stripPngMetadata(png)!;
    expect(has(out, "TEXT-SECRET")).toBe(false);
    expect(has(out, "GPS-SECRET")).toBe(false);
    for (const t of ["IHDR", "IDAT", "IEND"]) expect(has(out, t)).toBe(true);
  });
});

describe("stripWebpMetadata", () => {
  const le32 = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff];
  const chunk = (id: string, data: number[]) => [...enc(id), ...le32(data.length), ...data, ...(data.length & 1 ? [0] : [])];
  const body = [
    ...enc("WEBP"),
    ...chunk("VP8X", [0x0c, 0, 0, 0, 9, 0, 0, 9, 0, 0]),
    ...chunk("VP8 ", [1, 2, 3, 4, 5, 6]),
    ...chunk("EXIF", enc("MM\0*GPS-SECRET")),
    ...chunk("XMP ", enc("XMP-SECRET")),
  ];
  const webp = Uint8Array.from([...enc("RIFF"), ...le32(body.length), ...body]);
  it("EXIF·XMP 청크와 VP8X 표시를 지우고 RIFF 크기를 맞춘다", () => {
    const out = stripWebpMetadata(webp)!;
    expect(has(out, "GPS-SECRET")).toBe(false);
    expect(has(out, "XMP-SECRET")).toBe(false);
    expect(has(out, "VP8 ")).toBe(true);
    const riff = out[4] | (out[5] << 8) | (out[6] << 16) | (out[7] << 24);
    expect(riff).toBe(out.length - 8);
    const vp8x = Buffer.from(out).indexOf(Buffer.from("VP8X"));
    expect(out[vp8x + 8] & 0x0c).toBe(0);
  });
});
