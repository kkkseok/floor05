/**
 * 큰 비율 축소를 절반씩 나눠 하는 Canvas 헬퍼 (100% 클라이언트)
 *
 * drawImage 한 번으로 1024px → 16px처럼 크게 줄이면 원본 픽셀 대부분을 건너뛰어
 * 계단·무늬 깨짐이 생긴다. imageSmoothingQuality="high"는 Chromium만 반영하고
 * Firefox·WebKit은 무시했다(실측: 1024→16px PSNR 16dB대, 세 브라우저 공통).
 * 절반씩 줄이면 매 단계가 2:1 평균이 되어 세 브라우저 모두에서 깨끗해진다
 * (실측: 16px 기준 Chromium 50.7dB, Firefox 44.3dB, WebKit 32.6dB —
 *  docs/blog-data/favicon-2026-10-15.json).
 */

export type DrawableSource = CanvasImageSource & { width: number; height: number };

/**
 * source의 (sx, sy, sw, sh) 영역을 targetW×targetH 캔버스로 줄여 돌려준다.
 * 2배를 넘는 축소는 절반 단계를 거친다. 확대·소폭 축소는 한 번에 그린다.
 */
export function downscaleToCanvas(
  source: DrawableSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  targetW: number,
  targetH: number,
): HTMLCanvasElement {
  let src: CanvasImageSource = source;
  let srcX = sx;
  let srcY = sy;
  let w = sw;
  let h = sh;

  while (w / 2 >= targetW * 2 && h / 2 >= targetH * 2) {
    const nw = Math.round(w / 2);
    const nh = Math.round(h / 2);
    const step = document.createElement("canvas");
    step.width = nw;
    step.height = nh;
    const sctx = step.getContext("2d");
    if (!sctx) break;
    sctx.imageSmoothingEnabled = true;
    sctx.imageSmoothingQuality = "high";
    sctx.drawImage(src, srcX, srcY, w, h, 0, 0, nw, nh);
    src = step;
    srcX = 0;
    srcY = 0;
    w = nw;
    h = nh;
  }

  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, srcX, srcY, w, h, 0, 0, targetW, targetH);
  return out;
}
