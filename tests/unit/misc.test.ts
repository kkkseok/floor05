/**
 * 색상·텍스트·PDF 범위 파싱·파일 유틸 단위 테스트
 * expected는 표준 환산계수·WCAG 공식·수기 검산으로 별도 산출한 값
 */
import { describe, it, expect } from "vitest";
import { parseColor, rgbToHex, rgbToHsl, hslToRgb, rgbToCmyk } from "@/lib/image/color-convert";
import { analyzeText, manuscriptSheets } from "@/lib/text/count";
import { parsePageRanges } from "@/lib/pdf/split";
import { computeResizeDimensions } from "@/lib/image/resizeDims";
import { buildIco } from "@/lib/image/ico";
import { scanExif } from "@/lib/image/exifScan";
import {
  formatFileSize,
  createNewFileName,
  fileMatchesAccept,
  mimeToExtension,
  calculateCompressionRate,
} from "@/lib/common/fileUtils";

// ---------- 색상 ----------
describe("색상 변환 (image/color-convert)", () => {
  it("HEX 파싱: #RGB·#RRGGBB·대소문자", () => {
    expect(parseColor("#FF8000")).toEqual({ r: 255, g: 128, b: 0 });
    expect(parseColor("ff8000")).toEqual({ r: 255, g: 128, b: 0 });
    expect(parseColor("#f80")).toEqual({ r: 255, g: 136, b: 0 });
    expect(parseColor("rgb(255, 128, 0)")).toEqual({ r: 255, g: 128, b: 0 });
    expect(parseColor("rgba(255, 128, 0, 0.5)")).toEqual({ r: 255, g: 128, b: 0 });
    expect(parseColor("hsl(30, 100%, 50%)")).toEqual({ r: 255, g: 128, b: 0 }); // h30 → 정확히 (255,127.5→128,0)
    expect(parseColor("")).toBeNull();
    expect(parseColor("#xyz")).toBeNull();
    expect(parseColor("rgb(300,0,0)")).toEqual({ r: 255, g: 0, b: 0 }); // 클램프
  });

  it("RGB→HEX/HSL/CMYK — 표준 공식 검산", () => {
    expect(rgbToHex({ r: 255, g: 128, b: 0 })).toBe("#FF8000");
    expect(rgbToHsl({ r: 255, g: 0, b: 0 })).toEqual({ h: 0, s: 100, l: 50 });
    expect(rgbToHsl({ r: 0, g: 255, b: 0 })).toEqual({ h: 120, s: 100, l: 50 });
    expect(rgbToHsl({ r: 255, g: 255, b: 255 })).toEqual({ h: 0, s: 0, l: 100 });
    expect(rgbToCmyk({ r: 0, g: 0, b: 0 })).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    expect(rgbToCmyk({ r: 255, g: 0, b: 0 })).toEqual({ c: 0, m: 100, y: 100, k: 0 });
    expect(rgbToCmyk({ r: 255, g: 128, b: 0 })).toEqual({ c: 0, m: 50, y: 100, k: 0 });
  });

  it("HSL→RGB→HSL 왕복", () => {
    const rgb = hslToRgb({ h: 210, s: 64, l: 40 });
    const back = rgbToHsl(rgb);
    expect(back.h).toBeGreaterThanOrEqual(209);
    expect(back.h).toBeLessThanOrEqual(211);
  });
});

// ---------- 텍스트 ----------
describe("글자수 세기 (analyzeText)", () => {
  it("한글 5자: chars 5 · 2바이트기준 10 · UTF-8 15", () => {
    const r = analyzeText("안녕하세요");
    expect(r.chars).toBe(5);
    expect(r.charsNoSpace).toBe(5);
    expect(r.bytes2).toBe(10);
    expect(r.bytes3).toBe(15);
  });

  it("줄바꿈: NAVER=공백 치환, HWP=제거", () => {
    expect(analyzeText("a\nb", "naver").chars).toBe(3);
    expect(analyzeText("a\nb", "hwp").chars).toBe(2);
    expect(analyzeText("a\nb", "naver").charsNoSpace).toBe(2);
  });

  it("단어·줄·문장·문단", () => {
    const r = analyzeText("hello world.\n\nnew paragraph!");
    expect(r.words).toBe(4);
    expect(r.lines).toBe(3);
    expect(r.sentences).toBe(2);
    expect(r.paragraphs).toBe(2);
  });

  it("빈 문자열은 전부 0", () => {
    const r = analyzeText("");
    expect(r.chars).toBe(0);
    expect(r.words).toBe(0);
    expect(r.paragraphs).toBe(0);
  });

  it("원고지: 1000자/200자지 = 5장 · 1001자 = 6장(남은 199칸)", () => {
    expect(manuscriptSheets(1000, 200)).toEqual({ sheets: 5, remainingCells: 0 });
    expect(manuscriptSheets(1001, 200)).toEqual({ sheets: 6, remainingCells: 199 });
    expect(manuscriptSheets(0, 200)).toEqual({ sheets: 0, remainingCells: 0 });
  });
});

// ---------- PDF 범위 파싱 ----------
describe("PDF 페이지 범위 파싱 (parsePageRanges)", () => {
  it("기본: '1-3,5' → [0,1,2,4]", () => {
    expect(parsePageRanges("1-3,5", 10)).toEqual([0, 1, 2, 4]);
  });

  it("역순 범위 '3-1' → [2,1,0]", () => {
    expect(parsePageRanges("3-1", 10)).toEqual([2, 1, 0]);
  });

  it("공백 허용 · 중복 유지", () => {
    expect(parsePageRanges(" 2 , 2 ", 5)).toEqual([1, 1]);
    expect(parsePageRanges("1 - 2", 5)).toEqual([0, 1]);
  });

  it("범위 밖·0·음수·문자는 null", () => {
    expect(parsePageRanges("0", 5)).toBeNull();
    expect(parsePageRanges("6", 5)).toBeNull();
    expect(parsePageRanges("1-6", 5)).toBeNull();
    expect(parsePageRanges("a", 5)).toBeNull();
    expect(parsePageRanges("", 5)).toBeNull();
    expect(parsePageRanges("1,,2", 5)).toEqual([0, 1]); // 빈 토큰 무시
  });
});

// ---------- 리사이즈 치수 ----------
describe("리사이즈 치수 (computeResizeDimensions)", () => {
  it("너비만 지정 → 비율 유지", () => {
    expect(computeResizeDimensions(4000, 3000, { width: 1000, height: 0 })).toEqual({ width: 1000, height: 750 });
  });
  it("높이만 지정 → 비율 유지", () => {
    expect(computeResizeDimensions(4000, 3000, { width: 0, height: 600 })).toEqual({ width: 800, height: 600 });
  });
  it("둘 다 지정 → fit (긴 쪽 기준)", () => {
    expect(computeResizeDimensions(4000, 3000, { width: 500, height: 500 })).toEqual({ width: 500, height: 375 });
    expect(computeResizeDimensions(3000, 4000, { width: 500, height: 500 })).toEqual({ width: 375, height: 500 });
  });
  it("비율 무시 → 정확한 값", () => {
    expect(
      computeResizeDimensions(4000, 3000, { width: 100, height: 900, maintainAspectRatio: false }),
    ).toEqual({ width: 100, height: 900 });
  });
});

// ---------- ICO ----------
describe("ICO 인코더 (buildIco)", () => {
  it("ICONDIR 헤더·엔트리·오프셋이 스펙과 일치", () => {
    const png1 = new Uint8Array([1, 2, 3, 4]);
    const png2 = new Uint8Array([5, 6, 7, 8, 9]);
    const ico = buildIco([
      { size: 16, bytes: png1 },
      { size: 256, bytes: png2 },
    ]);
    const dv = new DataView(ico.buffer);
    expect(dv.getUint16(0, true)).toBe(0); // reserved
    expect(dv.getUint16(2, true)).toBe(1); // type icon
    expect(dv.getUint16(4, true)).toBe(2); // count
    expect(ico[6]).toBe(16); // entry1 width
    expect(ico[22]).toBe(0); // entry2: 256 → 0
    expect(dv.getUint32(14, true)).toBe(4); // entry1 imageSize
    expect(dv.getUint32(18, true)).toBe(38); // entry1 offset = 6+32
    expect(dv.getUint32(30, true)).toBe(5); // entry2 imageSize
    expect(dv.getUint32(34, true)).toBe(42); // entry2 offset
    expect(Array.from(ico.slice(38, 42))).toEqual([1, 2, 3, 4]);
    expect(Array.from(ico.slice(42))).toEqual([5, 6, 7, 8, 9]);
  });
});

// ---------- EXIF 스캔 ----------
describe("EXIF 스캔 (scanExif)", () => {
  it("Exif 헤더 + GPS 태그 감지", () => {
    // 합성 JPEG: SOI + APP1("Exif\0\0" + GPS 태그 0x8825 리틀엔디안)
    const bytes = new Uint8Array([
      0xff, 0xd8, 0xff, 0xe1, 0x00, 0x10,
      0x45, 0x78, 0x69, 0x66, 0x00, 0x00, // Exif\0\0
      0x49, 0x49, 0x2a, 0x00, 0x25, 0x88, // II*. + 0x8825(LE)
    ]);
    expect(scanExif(bytes)).toEqual({ hasExif: true, hasGps: true });
  });

  it("EXIF 없는 JPEG / JPEG 아닌 파일", () => {
    expect(scanExif(new Uint8Array([0xff, 0xd8, 0xff, 0xdb, 0, 0, 0, 0]))).toEqual({ hasExif: false, hasGps: false });
    expect(scanExif(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toEqual({ hasExif: false, hasGps: false });
  });
});

// ---------- 파일 유틸 ----------
describe("파일 유틸 (fileUtils)", () => {
  it("formatFileSize", () => {
    expect(formatFileSize(0)).toBe("0 B");
    expect(formatFileSize(1024)).toBe("1 KB");
    expect(formatFileSize(1536)).toBe("1.5 KB");
    expect(formatFileSize(1048576)).toBe("1 MB");
  });

  it("createNewFileName·mimeToExtension", () => {
    expect(createNewFileName("photo.jpeg", "_compressed", "jpg")).toBe("photo_compressed.jpg");
    expect(createNewFileName("no-ext", "_x", "png")).toBe("no-ext_x.png");
    expect(mimeToExtension("image/png")).toBe("png");
    expect(mimeToExtension("image/webp")).toBe("webp");
    expect(mimeToExtension("image/jpeg")).toBe("jpg");
    expect(mimeToExtension("unknown")).toBe("jpg");
  });

  it("calculateCompressionRate", () => {
    expect(calculateCompressionRate(1000, 250)).toBe(75);
    expect(calculateCompressionRate(0, 100)).toBe(0);
  });

  it("fileMatchesAccept: MIME·확장자·와일드카드·빈 MIME 폴백", () => {
    const jpg = new File([""], "a.jpg", { type: "image/jpeg" });
    const heicNoMime = new File([""], "IMG_0001.HEIC", { type: "" });
    const txt = new File([""], "a.txt", { type: "text/plain" });
    expect(fileMatchesAccept(jpg, "image/jpeg,image/png")).toBe(true);
    expect(fileMatchesAccept(jpg, "image/*")).toBe(true);
    expect(fileMatchesAccept(heicNoMime, "image/heic,.heic")).toBe(true);
    expect(fileMatchesAccept(txt, "image/jpeg,image/png")).toBe(false);
    expect(fileMatchesAccept(txt, "image/*")).toBe(false);
  });
});
