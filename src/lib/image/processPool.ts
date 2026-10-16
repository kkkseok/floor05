// 이미지 처리 워커 매니저 + 스마트 래퍼.
// - 지원 환경: OffscreenCanvas 워커에서 병렬/비블로킹 처리
// - 미지원/오류: 기존 메인 스레드 함수로 자동 폴백 (현재 동작 보장)

import { compressImage, CompressionOptions, CompressionResult } from "./compress";
import { resizeImage, ResizeOptions, ResizeResult } from "./resize";
import {
  convertImage,
  ConvertOptions,
  ConvertResult,
  isHeicFile,
  isSvgFile,
  assertEncodedFormat,
} from "./convert";

interface RenderResult {
  blob: Blob;
  width: number;
  height: number;
  naturalWidth: number;
  naturalHeight: number;
}

let worker: Worker | null = null;
let broken = false;
let nextId = 1;
const pending = new Map<
  number,
  { resolve: (r: RenderResult) => void; reject: (e: Error) => void }
>();

function getWorker(): Worker | null {
  if (broken) return null;
  if (worker) return worker;

  if (
    typeof window === "undefined" ||
    typeof Worker === "undefined" ||
    typeof OffscreenCanvas === "undefined" ||
    typeof createImageBitmap === "undefined"
  ) {
    broken = true;
    return null;
  }

  try {
    worker = new Worker(new URL("../../workers/imageWorker.ts", import.meta.url), {
      type: "module",
    });

    worker.onmessage = (e: MessageEvent) => {
      const d = e.data as {
        id: number;
        ok: boolean;
        error?: string;
      } & RenderResult;
      const p = pending.get(d.id);
      if (!p) return;
      pending.delete(d.id);
      if (d.ok) {
        p.resolve({
          blob: d.blob,
          width: d.width,
          height: d.height,
          naturalWidth: d.naturalWidth,
          naturalHeight: d.naturalHeight,
        });
      } else {
        p.reject(new Error(d.error || "worker error"));
      }
    };

    worker.onerror = () => {
      // 워커 자체 오류 → 이후 호출은 모두 폴백
      broken = true;
      pending.forEach((p) => p.reject(new Error("worker crashed")));
      pending.clear();
      worker = null;
    };

    return worker;
  } catch {
    broken = true;
    return null;
  }
}

interface RenderOp {
  file: Blob;
  outputFormat: string;
  quality?: number;
  background?: string;
  resize?:
    | { mode: "fit"; width: number; height: number; maintainAspectRatio: boolean; cover?: boolean; noEnlarge?: boolean }
    | { mode: "max"; maxWidth?: number; maxHeight?: number };
}

function render(op: RenderOp): Promise<RenderResult> {
  const w = getWorker();
  if (!w) return Promise.reject(new Error("worker unavailable"));
  return new Promise<RenderResult>((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    w.postMessage({ id, op });
  });
}

/**
 * 압축 (품질 모드). 워커 우선, 실패 시 메인 스레드 폴백.
 */
export async function compressImageSmart(
  file: File,
  options: CompressionOptions
): Promise<CompressionResult> {
  const outputFormat = options.outputFormat || "image/jpeg";
  try {
    const r = await render({
      file,
      outputFormat,
      quality: options.quality,
      background: outputFormat === "image/jpeg" ? "#FFFFFF" : undefined,
      resize:
        options.maxWidth || options.maxHeight
          ? { mode: "max", maxWidth: options.maxWidth, maxHeight: options.maxHeight }
          : undefined,
    });
    return {
      blob: r.blob,
      width: r.width,
      height: r.height,
      originalSize: file.size,
      compressedSize: r.blob.size,
      dataUrl: URL.createObjectURL(r.blob),
    };
  } catch {
    return compressImage(file, options);
  }
}

/**
 * 리사이즈. 워커 우선, 실패 시 메인 스레드 폴백.
 */
export async function resizeImageSmart(
  file: File,
  options: ResizeOptions
): Promise<ResizeResult> {
  const outputFormat = options.outputFormat || "image/jpeg";
  try {
    const r = await render({
      file,
      outputFormat,
      quality: options.quality ?? 0.92,
      background: outputFormat === "image/jpeg" ? "#FFFFFF" : undefined,
      resize: {
        mode: "fit",
        width: options.width,
        height: options.height,
        maintainAspectRatio: options.maintainAspectRatio ?? true,
        cover: options.cover,
        noEnlarge: options.noEnlarge,
      },
    });
    return {
      blob: r.blob,
      width: r.width,
      height: r.height,
      originalWidth: r.naturalWidth,
      originalHeight: r.naturalHeight,
      dataUrl: URL.createObjectURL(r.blob),
    };
  } catch {
    return resizeImage(file, options);
  }
}

/**
 * 포맷 변환. HEIC는 heic2any(메인스레드), SVG는 출력 크기를 적용한 래스터화가 필요해
 * 메인 스레드에서 처리한다. 그 외 래스터 입력은 워커 우선, 실패 시 메인 스레드 폴백.
 */
export async function convertImageSmart(
  file: File,
  options: ConvertOptions
): Promise<ConvertResult> {
  if (isHeicFile(file) || isSvgFile(file)) {
    return convertImage(file, options);
  }

  const { outputFormat } = options;
  try {
    const r = await render({
      file,
      outputFormat,
      quality: options.quality ?? 0.92,
      background:
        outputFormat === "image/jpeg"
          ? options.backgroundColor || "#FFFFFF"
          : undefined,
    });
    // 미지원 포맷이 PNG로 조용히 폴백됐으면 메인스레드 폴백으로 넘긴다(거기서도 동일 검증).
    assertEncodedFormat(r.blob, outputFormat);
    return {
      blob: r.blob,
      width: r.width,
      height: r.height,
      originalFormat: file.type,
      outputFormat,
      dataUrl: URL.createObjectURL(r.blob),
    };
  } catch {
    return convertImage(file, options);
  }
}
