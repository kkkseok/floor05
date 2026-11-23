/**
 * 이미지 포맷 변환 로직
 * Canvas toBlob(mimeType) 사용
 * HEIC 변환: libheif-js(libheif WASM) 동적 로드
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
 * - HEIC/HEIF: libheif-js로 메인스레드 디코드(동적 로드)
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
 * 디코딩(입력)은 넓게 지원되지만 canvas 인코딩은 브라우저마다 다르고, 미지원이면 조용히 PNG로 폴백한다.
 * 2026-11-22 실측(docs/blog-data/avif-2026-11-22.json): Chromium 151·Chrome 158·Edge 158·Firefox 153·
 * WebKit 26.5 모두 PNG로 폴백했다(저장 0/5). WebP와 동일하게 toDataURL로 감지한다.
 */
export function isAvifSupported(): boolean {
  if (typeof document === "undefined") return false;

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL("image/avif").indexOf("data:image/avif") === 0;
}

// libheif-js 모듈 캐싱 (HEIC 변환 페이지에서만 동적 로드. 번들 약 2MB, wasm 포함)
type Libheif = import("libheif-js/libheif-wasm/libheif-bundle.mjs").LibheifModule;
let libheifPromise: Promise<Libheif> | null = null;

function getLibheif(): Promise<Libheif> {
  if (!libheifPromise) {
    libheifPromise = import("libheif-js/libheif-wasm/libheif-bundle.mjs")
      .then((m) => m.default())
      .catch((err) => {
        libheifPromise = null; // 네트워크 오류 등은 다음 시도에서 다시 받는다
        throw err;
      });
  }
  return libheifPromise;
}

const HEIC_READ_ERROR =
  "HEIC 사진을 읽지 못했습니다. 파일이 손상됐거나 지원하지 않는 형식일 수 있어요. 사진 앱에서 JPG로 내보내거나, 아이폰 설정 → 카메라 → 포맷 → '높은 호환성'으로 찍은 사진을 써 주세요.";

/** HEIF 계열 컨테이너인지(4~8바이트가 'ftyp') 본다. 이름만 .heic인 JPG·PNG를 걸러낸다. */
async function isHeifContainer(file: File): Promise<boolean> {
  const head = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  return head.length >= 8 && String.fromCharCode(head[4], head[5], head[6], head[7]) === "ftyp";
}

/**
 * HEIC를 브라우저가 그릴 수 있는 무손실 PNG로 디코딩 (libheif-js 동적 로드).
 *
 * 예전에 쓰던 heic2any(0.0.4)는 모든 파일을 제한 범위 식(1.164*(Y-16))으로 풀어, 전체 범위(full range)
 * HEIC는 그늘이 검게 뭉개지고 사진 전체가 진해졌다(2026-11-23 실측: 화질 지표 43.9dB → 28.5dB).
 * libheif는 파일의 색 범위·행렬 표시를 따라 RGB로 바꾸고, 회전(irot) 같은 변환도 적용한다.
 *
 * 이름만 .heic인 JPG 등은 원본을 그대로 돌려줘 브라우저가 직접 읽게 한다.
 */
async function decodeHeic(file: File): Promise<Blob> {
  if (!(await isHeifContainer(file))) return file;

  const libheif = await getLibheif();
  const decoder = new libheif.HeifDecoder();
  const images = decoder.decode(new Uint8Array(await file.arrayBuffer()));
  try {
    const image = images[0];
    if (!image) throw new Error(HEIC_READ_ERROR);
    const width = image.get_width();
    const height = image.get_height();

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
    const imageData = ctx.createImageData(width, height);
    const decoded = await new Promise<boolean>((resolve) => image.display(imageData, (r) => resolve(Boolean(r))));
    if (!decoded) throw new Error(HEIC_READ_ERROR);
    ctx.putImageData(imageData, 0, 0);
    return await canvasToBlob(canvas, "image/png");
  } finally {
    for (const img of images) img.free();
    if (decoder.decoder) {
      libheif.heif_context_free(decoder.decoder);
      decoder.decoder = null;
    }
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
