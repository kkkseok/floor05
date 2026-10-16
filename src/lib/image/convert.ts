/**
 * 이미지 포맷 변환 로직
 * Canvas toBlob(mimeType) 사용
 * HEIC 변환: heic2any 라이브러리 (동적 로드)
 */

import { loadImage, fileToDataUrl, canvasToBlob } from "../common/fileUtils";

export type OutputFormat = "image/jpeg" | "image/png" | "image/webp" | "image/avif";

export interface ConvertOptions {
  outputFormat: OutputFormat;
  quality?: number; // 0.01 ~ 1.0 (JPG, WebP, AVIF만 적용)
  backgroundColor?: string; // 출력이 JPG일 때 투명 배경 대체 색상
  svgWidth?: number; // SVG 입력 래스터화 시 출력 가로 px (세로는 비율 자동)
}

/**
 * 변환기가 받는 입력 포맷(드롭존 accept + 검증 단일 진실 공급원).
 * 디코드는 브라우저 네이티브 범위가 넓어 입력은 출력보다 폭넓게 받는다.
 * - JPG/PNG/WebP/AVIF/BMP/GIF/SVG: createImageBitmap·<img> 네이티브 디코드(SVG는 래스터화)
 * - HEIC/HEIF: heic2any로 메인스레드 디코드(동적 로드)
 * MIME이 비어 오는 경우(HEIC 등)를 위해 확장자 토큰도 함께 둔다.
 */
export const CONVERT_INPUT_ACCEPT =
  "image/jpeg,image/png,image/webp,image/avif,image/bmp,image/x-ms-bmp,image/gif,image/svg+xml,image/heic,image/heif,.avif,.bmp,.gif,.svg,.heic,.heif";

export interface ConvertResult {
  blob: Blob;
  width: number;
  height: number;
  originalFormat: string;
  outputFormat: OutputFormat;
  dataUrl: string;
}

/**
 * 파일 MIME 타입에서 포맷 이름 추출
 */
export function getFormatName(mimeType: string): string {
  const formatMap: Record<string, string> = {
    "image/jpeg": "JPG",
    "image/jpg": "JPG",
    "image/png": "PNG",
    "image/webp": "WebP",
    "image/avif": "AVIF",
    "image/bmp": "BMP",
    "image/x-ms-bmp": "BMP",
    "image/gif": "GIF",
    "image/svg+xml": "SVG",
    "image/heic": "HEIC",
    "image/heif": "HEIF",
  };
  return formatMap[mimeType.toLowerCase()] || "Unknown";
}

/**
 * 출력 포맷 확장자
 */
export function getExtension(format: OutputFormat): string {
  const extMap: Record<OutputFormat, string> = {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  };
  return extMap[format];
}

/**
 * SVG 파일인지 확인 (벡터라 출력 크기를 별도로 받아 래스터화한다)
 */
export function isSvgFile(file: File): boolean {
  return (
    file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg")
  );
}

/**
 * 브라우저가 요청한 포맷을 인코딩하지 못하면 canvas.toBlob은 조용히 PNG로 폴백한다.
 * WebP·AVIF 출력 시 결과 MIME이 다르면(=미지원) 잘못된 확장자의 파일이 나가므로
 * 친절한 한국어 에러로 막는다. (JPG는 사실상 전 브라우저 지원, PNG는 폴백 대상이라 제외)
 */
export function assertEncodedFormat(blob: Blob, outputFormat: OutputFormat): void {
  if (
    (outputFormat === "image/webp" || outputFormat === "image/avif") &&
    blob.type !== outputFormat
  ) {
    const name = getFormatName(outputFormat);
    throw new Error(
      `이 브라우저에서는 ${name} 출력을 지원하지 않습니다. JPG나 PNG로 변환해 주세요.`
    );
  }
}

/**
 * HEIC 파일인지 확인
 */
export function isHeicFile(file: File): boolean {
  const type = file.type.toLowerCase();
  const name = file.name.toLowerCase();
  return (
    type === "image/heic" ||
    type === "image/heif" ||
    name.endsWith(".heic") ||
    name.endsWith(".heif")
  );
}

/**
 * WebP 지원 여부 확인
 */
export function isWebPSupported(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
}

/**
 * AVIF 인코딩(출력) 지원 여부 확인.
 * 디코딩(입력)은 더 넓게 지원되지만, canvas 인코딩은 Chromium 124+(Chrome/Edge)만 가능하고
 * Firefox·Safari는 조용히 PNG로 폴백한다. WebP와 동일하게 toDataURL로 감지한다.
 */
export function isAvifSupported(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
}

// heic2any 모듈 캐싱
let cachedHeic2any: ((options: { blob: Blob; toType: string; quality: number }) => Promise<Blob | Blob[]>) | null = null;

async function getHeic2any() {
  if (!cachedHeic2any) {
    cachedHeic2any = (await import("heic2any")).default;
  }
  return cachedHeic2any;
}

/**
 * HEIC를 브라우저가 그릴 수 있는 이미지로 디코딩 (heic2any 동적 로드).
 * 중간 결과는 무손실 PNG로 받는다. 예전에는 JPEG 92%로 받은 뒤 사용자가 고른 품질로 한 번 더 저장해
 * 품질 100%·PNG 출력도 92% 위로 올라가지 못했다.
 * heic2any는 실패 시 Error가 아니라 { code, message } 객체를 던진다. 이름만 .heic인 JPG 등은
 * "already browser readable"로 실패하므로 원본을 그대로 쓴다.
 */
async function decodeHeic(file: File): Promise<Blob> {
  const heic2any = await getHeic2any();
  try {
    const result = await heic2any({ blob: file, toType: "image/png", quality: 1 }); // PNG는 quality를 쓰지 않음(타입상 필수)
    return Array.isArray(result) ? result[0] : result;
  } catch (err) {
    const message = typeof err === "object" && err && "message" in err ? String(err.message) : String(err);
    if (/already browser readable/i.test(message)) return file;
    throw new Error(
      "HEIC 사진을 읽지 못했습니다. 파일이 손상됐거나 지원하지 않는 형식일 수 있어요. 사진 앱에서 JPG로 내보내거나, 아이폰 설정 → 카메라 → 포맷 → '높은 호환성'으로 찍은 사진을 써 주세요."
    );
  }
}

/**
 * 이미지 포맷 변환 (단일 파일)
 */
export async function convertImage(
  file: File,
  options: ConvertOptions
): Promise<ConvertResult> {
  const {
    outputFormat,
    quality = 0.92,
    backgroundColor = "#FFFFFF",
    svgWidth,
  } = options;

  let dataUrl: string;
  let originalFormat = file.type;

  // HEIC 파일 처리
  if (isHeicFile(file)) {
    originalFormat = "image/heic";
    const decoded = await decodeHeic(file);
    dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("HEIC 파일을 읽을 수 없습니다."));
      reader.readAsDataURL(decoded);
    });
  } else {
    dataUrl = await fileToDataUrl(file);
  }

  // 이미지 로드
  const img = await loadImage(dataUrl);

  // 출력 캔버스 크기 결정.
  // 래스터 입력은 원본 크기 그대로, SVG는 벡터라 본질 크기가 없을 수 있어
  // 출력 가로(px)를 받아 비율을 유지하며 임의 해상도로 래스터화한다.
  let outWidth = img.width;
  let outHeight = img.height;
  if (isSvgFile(file)) {
    const targetWidth = svgWidth && svgWidth > 0 ? svgWidth : 1024;
    const ratio = img.width > 0 && img.height > 0 ? img.width / img.height : 1;
    outWidth = Math.max(1, Math.round(targetWidth));
    outHeight = Math.max(1, Math.round(targetWidth / ratio));
  }

  // Canvas에 그리기
  const canvas = document.createElement("canvas");
  canvas.width = outWidth;
  canvas.height = outHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  }

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 투명 배경 처리 (JPG는 알파를 지원하지 않으므로 출력이 JPG면 항상 배경을 채운다.
  // PNG뿐 아니라 투명 WebP·AVIF 등도 검은 배경이 되지 않도록 함)
  if (outputFormat === "image/jpeg") {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, outWidth, outHeight);
  }

  ctx.drawImage(img, 0, 0, outWidth, outHeight);

  // Blob 생성
  const blob = await canvasToBlob(
    canvas,
    outputFormat,
    quality,
    "이미지 변환에 실패했습니다."
  );
  // 미지원 포맷이 PNG로 조용히 폴백됐는지 검증 (확장자 불일치 방지)
  assertEncodedFormat(blob, outputFormat);

  // Blob에서 URL 생성 (toDataURL 중복 호출 방지)
  const convertedDataUrl = URL.createObjectURL(blob);

  return {
    blob,
    width: outWidth,
    height: outHeight,
    originalFormat,
    outputFormat,
    dataUrl: convertedDataUrl,
  };
}

/**
 * 변환 가능 포맷 목록 (브라우저 지원 확인)
 */
export function getAvailableFormats(): OutputFormat[] {
  const formats: OutputFormat[] = ["image/jpeg", "image/png"];

  if (isWebPSupported()) {
    formats.push("image/webp");
  }

  if (isAvifSupported()) {
    formats.push("image/avif");
  }

  return formats;
}
