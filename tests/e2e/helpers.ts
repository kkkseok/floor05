/**
 * E2E 공용 헬퍼
 * - 콘솔/네트워크 가드, 드롭존 업로드, 다운로드 저장, 결과 파일 검사기
 * - 파일 검사기는 제품 코드를 쓰지 않고 매직바이트/헤더를 직접 파싱한다
 */
import { Page, TestInfo, expect } from "@playwright/test";
import path from "path";
import fs from "fs";
import UPNG from "upng-js";

export const FIXTURES = path.join(__dirname, "..", "fixtures", "generated");
export const fx = (name: string) => path.join(FIXTURES, name);

/** 서드파티(광고·분석) 호스트 — 요청 차단·콘솔 오류 필터 대상 */
const THIRD_PARTY = [
  "googlesyndication.com",
  "googletagservices.com",
  "doubleclick.net",
  "google.com/pagead",
  "adtrafficquality.google",
  "googleadservices",
  "gstatic.com",
  "kakao",
  "daumcdn.net",
  "va.vercel-scripts.com",
];

const isThirdParty = (url: string) => THIRD_PARTY.some((h) => url.includes(h));

export interface RequestRecord {
  url: string;
  method: string;
  postDataSize: number;
  resourceType: string;
}

export interface Guards {
  /** 필터를 통과한(=실패로 간주할) 콘솔 오류·페이지 예외 */
  errors: string[];
  /** 관찰된 모든 요청 (차단된 서드파티 포함) */
  requests: RequestRecord[];
  /** 4xx/5xx로 끝난 1st-party 응답 */
  badResponses: string[];
}

/**
 * 페이지 가드 설치:
 * - 서드파티 광고/분석 요청은 abort (오프라인 안정성 + 속도). 요청 자체는 기록에 남는다.
 * - 콘솔 error/pageerror 수집 (서드파티 소스는 필터)
 * - 1st-party 4xx/5xx 수집 (/_vercel 로컬 404는 허용)
 */
export async function installGuards(page: Page): Promise<Guards> {
  const guards: Guards = { errors: [], requests: [], badResponses: [] };

  // 요청 기록은 리스너로만 (인터셉션 없음 — WebKit에서 same-origin RSC 프리페치가
  // 인터셉션을 거치면 access control 오류로 깨지는 문제 회피)
  page.on("request", (req) => {
    guards.requests.push({
      url: req.url(),
      method: req.method(),
      postDataSize: req.postData()?.length ?? 0,
      resourceType: req.resourceType(),
    });
  });

  // 서드파티(광고·분석)만 선별 차단 — 오프라인 안정성 + 속도
  await page.route((url) => isThirdParty(url.href), (route) => route.abort());

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    const loc = msg.location()?.url ?? "";
    if (isThirdParty(text) || isThirdParty(loc)) return;
    // Vercel Analytics 스크립트는 Vercel 인프라에서만 서빙됨 — 로컬 next start 404는 환경 노이즈
    if (text.includes("/_vercel/") || loc.includes("/_vercel/")) return;
    // 서드파티 차단으로 인한 리소스 로드 실패 노이즈 제외
    if (/Failed to load resource|net::ERR_FAILED|ERR_BLOCKED/i.test(text) && (isThirdParty(loc) || loc === "")) return;
    guards.errors.push(`[console] ${text} @ ${loc}`);
  });

  page.on("pageerror", (err) => {
    // WebKit: 빠른 연속 내비게이션 시 중단된 Next.js RSC 프리페치(?_rsc=)가
    // "access control checks" 오류로 보고되는 테스트 환경 노이즈 — 제외
    if (err.message.includes("_rsc=")) return;
    guards.errors.push(`[pageerror] ${err.message}`);
  });

  page.on("response", (res) => {
    const url = res.url();
    if (!url.includes("localhost")) return;
    if (url.includes("/_vercel/")) return; // 로컬에서 analytics 엔드포인트 404 허용
    if (res.status() >= 400) guards.badResponses.push(`${res.status()} ${url}`);
  });

  return guards;
}

/** 가드 최종 검증 — 각 테스트 마지막에 호출 */
export function assertClean(guards: Guards) {
  expect(guards.errors, "콘솔 오류/페이지 예외 없어야 함").toEqual([]);
  expect(guards.badResponses, "1st-party 4xx/5xx 없어야 함").toEqual([]);
}

/**
 * 파일 데이터가 외부로 전송되지 않았는지 검증 (제품 핵심 계약).
 * - localhost 밖으로 나가는 요청에 body가 실리면 실패
 * - localhost로도 대용량(>32KB) POST가 있으면 실패 (파일 업로드 신호)
 */
export function assertNoFileUpload(guards: Guards) {
  const uploads = guards.requests.filter((r) => {
    const external = !r.url.includes("localhost");
    if (external && r.postDataSize > 0) return true;
    if (!external && r.postDataSize > 32_000) return true;
    return false;
  });
  expect(uploads, "파일 데이터 외부 전송 없어야 함 (P0)").toEqual([]);
}

/**
 * hydration 경합에 안전한 fill.
 * WebKit에서 페이지 진입 직후 fill하면 React hydration이 끝난 뒤 상태값(기본값)으로
 * 되돌아갈 수 있다 — 값이 유지될 때까지 재시도한다.
 */
export async function fillStable(
  locator: ReturnType<Page["locator"]>,
  value: string,
  tries = 6,
) {
  // 네트워크가 잠잠해질 때까지 = 청크 로드·hydration이 대체로 끝난 시점까지 대기
  await locator.page().waitForLoadState("networkidle").catch(() => {});
  for (let i = 0; i < tries; i++) {
    await locator.fill(value);
    await locator.page().waitForTimeout(250);
    if ((await locator.inputValue()) === value) return;
  }
  expect(await locator.inputValue(), "fill 값이 유지되어야 함").toBe(value);
}

/** FileDropzone(동적 input) 업로드 — filechooser 이벤트 사용 */
export async function uploadToDropzone(page: Page, files: string[], dropzoneText = "파일을 드래그하거나") {
  const chooser = page.waitForEvent("filechooser");
  await page.getByText(dropzoneText).first().click();
  await (await chooser).setFiles(files);
}

/** 다운로드 트리거 후 파일 저장, 저장 경로 반환 */
export async function saveDownload(
  page: Page,
  testInfo: TestInfo,
  trigger: () => Promise<void>,
  timeout = 30_000,
): Promise<string> {
  const downloadPromise = page.waitForEvent("download", { timeout });
  await trigger();
  const download = await downloadPromise;
  const out = path.join(testInfo.outputPath(), download.suggestedFilename());
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await download.saveAs(out);
  return out;
}

// ---------- 파일 검사기 (독립 구현) ----------

export type FileKind = "jpeg" | "png" | "webp" | "gif" | "pdf" | "zip" | "ico" | "avif" | "unknown";

export function detectKind(file: string): FileKind {
  const b = fs.readFileSync(file);
  if (b.length >= 3 && b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "jpeg";
  if (b.length >= 8 && b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "png";
  if (b.length >= 12 && b.toString("ascii", 0, 4) === "RIFF" && b.toString("ascii", 8, 12) === "WEBP") return "webp";
  if (b.length >= 4 && b.toString("ascii", 0, 4) === "%PDF") return "pdf";
  if (b.length >= 2 && b[0] === 0x50 && b[1] === 0x4b) return "zip";
  if (b.length >= 6 && b[0] === 0 && b[1] === 0 && b[2] === 1 && b[3] === 0) return "ico";
  if (b.length >= 12 && b.toString("ascii", 4, 12).startsWith("ftyp")) {
    const brand = b.toString("ascii", 8, 12);
    if (brand.startsWith("avi")) return "avif";
  }
  return "unknown";
}

/** PNG IHDR / JPEG SOFn / WebP VP8·VP8L·VP8X 치수 파싱 */
export function imageDims(file: string): { width: number; height: number } {
  const b = fs.readFileSync(file);
  const kind = detectKind(file);

  if (kind === "png") {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }

  if (kind === "jpeg") {
    let i = 2;
    while (i < b.length - 9) {
      if (b[i] !== 0xff) { i++; continue; }
      const marker = b[i + 1];
      // SOF0~SOF15 (except DHT/JPG/DAC c4, c8, cc)
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: b.readUInt16BE(i + 5), width: b.readUInt16BE(i + 7) };
      }
      const len = b.readUInt16BE(i + 2);
      i += 2 + len;
    }
    throw new Error("JPEG SOF not found");
  }

  if (kind === "webp") {
    const fourcc = b.toString("ascii", 12, 16);
    if (fourcc === "VP8 ") {
      return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    }
    if (fourcc === "VP8L") {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (fourcc === "VP8X") {
      const w = (b[24] | (b[25] << 8) | (b[26] << 16)) + 1;
      const h = (b[27] | (b[28] << 8) | (b[29] << 16)) + 1;
      return { width: w, height: h };
    }
  }

  throw new Error(`치수 파싱 미지원 형식: ${kind}`);
}

/** JPEG에 EXIF(APP1) 세그먼트가 있는지 (독립 스캔) */
export function jpegHasExif(file: string): boolean {
  const b = fs.readFileSync(file);
  return b.includes(Buffer.from("Exif\0\0", "ascii"));
}

/** PDF 페이지 수 (pdf-lib 사용 — 프로젝트 의존성, 제품 코드 아님) */
export async function pdfPageCount(file: string): Promise<number> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(fs.readFileSync(file));
  return doc.getPageCount();
}

/** PDF 각 페이지 크기 */
export async function pdfPageSizes(file: string): Promise<Array<{ w: number; h: number }>> {
  const { PDFDocument } = await import("pdf-lib");
  const doc = await PDFDocument.load(fs.readFileSync(file));
  return doc.getPages().map((p) => {
    const { width, height } = p.getSize();
    return { w: Math.round(width * 100) / 100, h: Math.round(height * 100) / 100 };
  });
}

/** ZIP 내부 파일 목록 (jszip — 프로젝트 의존성) */
export async function zipEntries(file: string): Promise<string[]> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  return Object.keys(zip.files).sort();
}

/** ZIP에서 특정 파일 추출 */
export async function zipExtract(file: string, entry: string, to: string): Promise<string> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(fs.readFileSync(file));
  const f = zip.file(entry);
  if (!f) throw new Error(`ZIP에 ${entry} 없음`);
  fs.writeFileSync(to, await f.async("nodebuffer"));
  return to;
}

/** 가로 스크롤(모바일 레이아웃 깨짐) 검사 */
export async function assertNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow, "가로 스크롤 없어야 함").toBeLessThanOrEqual(1);
}

/**
 * 축소 화질 판별용 줄무늬 PNG: 검정 2px + 흰색 1px 세로 줄(3px 주기).
 * 제대로 줄이면 어디서나 1/3 밝기 회색(≈85), 픽셀을 건너뛰며 줄이면 칸마다 밝기가 달라진다.
 * (2px 주기는 한 번에 줄여도 샘플이 흑백 정중앙에 떨어져 우연히 회색이 되므로 쓰지 않는다)
 */
export function writeStripesPng(file: string, size = 1024): string {
  const rgba = new Uint8Array(size * size * 4);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const v = x % 3 === 2 ? 255 : 0;
      const i = (y * size + x) * 4;
      rgba[i] = rgba[i + 1] = rgba[i + 2] = v;
      rgba[i + 3] = 255;
    }
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, Buffer.from(UPNG.encode([rgba.buffer], size, size, 0)));
  return file;
}

/** PNG의 초록 채널 평균과 최대-최소 폭 (줄무늬 축소 결과 판정용) */
export function pngGreenStats(file: string): { mean: number; spread: number } {
  const raw = fs.readFileSync(file);
  // Buffer.buffer는 공유 풀이라 오프셋이 있다 — 이 파일 구간만 잘라 넘긴다
  const img = UPNG.decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length) as ArrayBuffer);
  const px = new Uint8Array(UPNG.toRGBA8(img)[0]);
  let sum = 0;
  let min = 255;
  let max = 0;
  for (let i = 1; i < px.length; i += 4) {
    sum += px[i];
    if (px[i] < min) min = px[i];
    if (px[i] > max) max = px[i];
  }
  return { mean: sum / (px.length / 4), spread: max - min };
}

/** PNG를 RGBA 픽셀로 읽는다 */
export function pngPixels(file: string): { width: number; height: number; data: Uint8Array } {
  const raw = fs.readFileSync(file);
  const img = UPNG.decode(raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.length) as ArrayBuffer);
  return { width: img.width, height: img.height, data: new Uint8Array(UPNG.toRGBA8(img)[0]) };
}

/** y행의 x0~x1 구간에서 초록 채널 값이 바뀌는 횟수 (줄무늬는 많고, 모자이크 블록은 적다) */
export function rowTransitions(p: { width: number; data: Uint8Array }, y: number, x0: number, x1: number): number {
  let n = 0;
  for (let x = x0 + 1; x < x1; x++) {
    if (p.data[(y * p.width + x) * 4 + 1] !== p.data[(y * p.width + x - 1) * 4 + 1]) n++;
  }
  return n;
}

