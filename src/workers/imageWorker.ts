// OffscreenCanvas 기반 이미지 처리 워커.
// 메인 스레드 블로킹 없이 디코딩/리사이즈/인코딩을 수행한다.
// 미지원 브라우저나 오류 시에는 호출측(processPool)이 메인 스레드 함수로 폴백한다.

import { computeResizeDimensions, computeCoverCrop } from "../lib/image/resizeDims";
import { drawImageDownscaled } from "../lib/image/downscale";

type ResizeInstruction =
  | { mode: "fit"; width: number; height: number; maintainAspectRatio: boolean; cover?: boolean; noEnlarge?: boolean }
  | { mode: "max"; maxWidth?: number; maxHeight?: number };

interface RenderOp {
  file: Blob;
  outputFormat: string;
  quality?: number;
  background?: string;
  resize?: ResizeInstruction;
}

interface RenderMessage {
  id: number;
  op: RenderOp;
}

const ctx = self as unknown as Worker;

ctx.onmessage = async (e: MessageEvent<RenderMessage>) => {
  const { id, op } = e.data;

  try {
    const bitmap = await createImageBitmap(op.file, {
      imageOrientation: "from-image", // EXIF 회전 반영 (메인 스레드 <img> 동작과 일치)
    });
    const naturalWidth = bitmap.width;
    const naturalHeight = bitmap.height;

    let w = naturalWidth;
    let h = naturalHeight;
    let src = { sx: 0, sy: 0, sw: naturalWidth, sh: naturalHeight };

    if (op.resize?.mode === "fit" && op.resize.cover && op.resize.width > 0 && op.resize.height > 0) {
      const c = computeCoverCrop(naturalWidth, naturalHeight, op.resize.width, op.resize.height, op.resize.noEnlarge);
      src = c;
      w = c.width;
      h = c.height;
    } else if (op.resize?.mode === "fit") {
      const d = computeResizeDimensions(naturalWidth, naturalHeight, {
        width: op.resize.width,
        height: op.resize.height,
        maintainAspectRatio: op.resize.maintainAspectRatio,
      });
      w = d.width;
      h = d.height;
    } else if (op.resize?.mode === "max") {
      const { maxWidth, maxHeight } = op.resize;
      if (maxWidth && w > maxWidth) {
        h = Math.round((h * maxWidth) / w);
        w = maxWidth;
      }
      if (maxHeight && h > maxHeight) {
        w = Math.round((w * maxHeight) / h);
        h = maxHeight;
      }
    }

    w = Math.max(1, Math.round(w));
    h = Math.max(1, Math.round(h));

    const canvas = new OffscreenCanvas(w, h);
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    if (op.background) {
      context.fillStyle = op.background;
      context.fillRect(0, 0, w, h);
    }

    // 크게 줄일 때는 절반씩 나눠 그린다(Firefox는 high 품질을 무시해 한 번에 줄이면 깨짐)
    drawImageDownscaled(context, bitmap, src.sx, src.sy, src.sw, src.sh, 0, 0, w, h);
    bitmap.close();

    const blob = await canvas.convertToBlob({
      type: op.outputFormat,
      quality: op.quality,
    });

    ctx.postMessage({
      id,
      ok: true,
      blob,
      width: w,
      height: h,
      naturalWidth,
      naturalHeight,
    });
  } catch (err) {
    ctx.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

export {};
