/**
 * 파일 유틸리티 함수
 */

/**
 * 바이트를 사람이 읽기 쉬운 형식으로 변환
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${units[i]}`;
}

/**
 * 압축률 계산 (%)
 */
export function calculateCompressionRate(
  originalSize: number,
  compressedSize: number
): number {
  if (originalSize === 0) return 0;
  return Math.round(((originalSize - compressedSize) / originalSize) * 100);
}

/**
 * 파일 확장자 추출
 */
export function getFileExtension(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop()?.toLowerCase() || "" : "";
}

/**
 * 파일명에서 확장자 제거
 */
export function getFileNameWithoutExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  return lastDotIndex > 0 ? filename.substring(0, lastDotIndex) : filename;
}

/**
 * 새 파일명 생성 (접미사 추가)
 */
export function createNewFileName(
  originalName: string,
  suffix: string,
  newExtension?: string
): string {
  const nameWithoutExt = getFileNameWithoutExtension(originalName);
  const ext = newExtension || getFileExtension(originalName);
  return `${nameWithoutExt}${suffix}.${ext}`;
}

/**
 * 이미지 MIME 타입 → 파일 확장자 (다운로드 파일명이 실제 내용과 일치하도록)
 */
export function mimeToExtension(mimeType: string): string {
  switch (mimeType.toLowerCase()) {
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/avif":
      return "avif";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

/**
 * 파일 크기 제한 (MB)
 */
export const MAX_FILE_SIZE_MB = 50;

/**
 * 파일 크기 제한 확인 (기본 50MB)
 */
export function isFileSizeValid(file: File, maxSizeMB: number = MAX_FILE_SIZE_MB): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return file.size <= maxSizeBytes;
}

/**
 * 확장자 → MIME 추론표.
 * 일부 환경(구형 Windows·일부 WebKit)은 흔한 이미지조차 file.type을 빈 문자열로 주므로,
 * MIME이 비어 있으면 확장자로 유형을 추론해 accept 판정에 사용한다.
 */
const EXT_TO_MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  avif: "image/avif",
  svg: "image/svg+xml",
  heic: "image/heic",
  heif: "image/heif",
  pdf: "application/pdf",
};

/**
 * accept 문자열(예: "image/jpeg,image/png,.heic")에 파일이 부합하는지 검사.
 * - 정확한 MIME(image/png), 와일드카드(image/*), 확장자(.heic) 토큰을 모두 지원
 * - MIME이 빈 문자열이면(HEIC·일부 환경의 WebP 등) 확장자로 추론해 판정
 */
export function fileMatchesAccept(file: File, accept: string): boolean {
  const inferredType =
    file.type || EXT_TO_MIME[getFileExtension(file.name)] || "";

  if (!accept || accept.trim() === "image/*") {
    return inferredType.startsWith("image/");
  }

  const type = inferredType.toLowerCase();
  const name = file.name.toLowerCase();
  const tokens = accept
    .split(",")
    .map((t) => t.trim().toLowerCase())
    .filter(Boolean);

  return tokens.some((token) => {
    if (token.startsWith(".")) return name.endsWith(token); // 확장자
    if (token.endsWith("/*")) return type.startsWith(token.slice(0, -1)); // 와일드카드
    return type !== "" && type === token; // 정확한 MIME
  });
}

export interface FileValidationResult {
  valid: File[];
  oversize: number; // 크기 초과로 제외된 개수
  unsupported: number; // 형식 불일치로 제외된 개수
}

/**
 * 업로드 파일 일괄 검증 (형식 + 크기).
 * FileDropzone와 각 도구의 "+" 추가 입력 양쪽에서 공통 사용한다.
 */
export function validateImageFiles(
  files: File[],
  accept: string,
  maxSizeMB: number = MAX_FILE_SIZE_MB
): FileValidationResult {
  const valid: File[] = [];
  let oversize = 0;
  let unsupported = 0;

  for (const file of files) {
    if (!fileMatchesAccept(file, accept)) {
      unsupported++;
      continue;
    }
    if (!isFileSizeValid(file, maxSizeMB)) {
      oversize++;
      continue;
    }
    valid.push(file);
  }

  return { valid, oversize, unsupported };
}

/**
 * 디바이스 타입 감지
 */
export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 최대 동시 처리 파일 수
 */
export function getMaxBatchSize(): number {
  return isMobileDevice() ? 5 : 10;
}

/**
 * File을 Data URL로 변환
 */
export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsDataURL(file);
  });
}

/**
 * File을 ArrayBuffer로 변환
 */
export function fileToArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("파일을 읽을 수 없습니다."));
    reader.readAsArrayBuffer(file);
  });
}

/**
 * blob: 객체 URL이면 해제한다. base64 data URL이나 빈 값은 무시(안전한 no-op).
 */
export function revokeObjectUrl(url?: string | null): void {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url);
  }
}

/**
 * Data URL에서 Blob 생성
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(",");
  const mime = parts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

/**
 * 이미지 로드 (HTMLImageElement)
 */
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("이미지를 로드할 수 없습니다."));
    img.src = src;
  });
}

/**
 * canvas.toBlob을 Promise로 래핑. 콜백이 null(메모리 부족·초대형 캔버스 등)이면 reject.
 * 4개 이미지 도구가 공유하는 단일 인코딩 경로.
 */
export function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
  errorMessage = "이미지를 처리할 수 없습니다."
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error(errorMessage));
      },
      type,
      quality
    );
  });
}

export type OutputImageType = "image/jpeg" | "image/png" | "image/webp";

/**
 * 결과 이미지 형식은 입력을 따른다: PNG→PNG, WebP→WebP, 그 외→JPG.
 * 투명을 담을 수 있는 PNG·WebP를 JPG로 바꾸면 투명 영역이 검게(또는 흰색으로) 칠해진다.
 * WebKit은 .webp 파일의 File.type을 비워 두므로 확장자도 함께 본다.
 * WebP 인코딩을 못 하는 브라우저는 PNG를 돌려주므로, 확장자는 결과 blob.type으로 정할 것.
 */
export function outputTypeFor(file: File): OutputImageType {
  const ext = getFileExtension(file.name);
  if (file.type === "image/png" || ext === "png") return "image/png";
  if (file.type === "image/webp" || ext === "webp") return "image/webp";
  return "image/jpeg";
}
