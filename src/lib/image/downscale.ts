/**
 * 큰 비율 축소를 깨끗하게 하는 Canvas 헬퍼 (100% 클라이언트, 메인 스레드·워커 공용)
 *
 * drawImage 한 번으로 크게 줄이면 원본 픽셀 대부분을 건너뛰어 계단·무늬 깨짐이 생긴다.
 * imageSmoothingQuality="high"는 Chromium만 제대로 반영하고 Firefox·WebKit은 그대로였다.
 * 절반씩 줄이다가 마지막 한 번이 2~4배 축소가 되도록 남기는 방식이 세 브라우저 모두에서
 * 가장 안정적이었다(실측, docs/blog-data/downscale-2026-10-15.json):
 * - 사진 5522→640: Firefox 28.1→35.7dB, WebKit 27.6→31.0dB, Chromium 37.2→36.3dB(소폭 손해)
 * - 로고 1024→16: Firefox 16.3→44.3dB, WebKit 15.9→32.6dB, Chromium 44.3→50.7dB
 * - 3배 이하 축소는 단계가 생기지 않아 결과가 이전과 같다.
 * "high가 반영되는지"를 캔버스로 시험해 고르는 방식도 시도했지만, WebKit은 결과가 달라지면서도
 * 여전히 깨져 판별할 수 없었다. 그래서 모든 브라우저에 같은 규칙을 쓴다.
 */

type AnyCanvas = HTMLCanvasElement | OffscreenCanvas;
type AnyContext = CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D;
export type DrawableSource = CanvasImageSource & { width: number; height: number };

function createCanvas(width: number, height: number): AnyCanvas {
  if (typeof document !== "undefined") {
    const c = document.createElement("canvas");
    c.width = width;
    c.height = height;
    return c;
  }
  return new OffscreenCanvas(width, height);
}

/**
 * ctx의 (dx, dy, dw, dh)에 source의 (sx, sy, sw, sh) 영역을 그린다.
 * 4배 이상 축소면 절반씩 줄여 마지막 drawImage가 2~4배 축소가 되게 한다. 확대·소폭 축소는 한 번에 그린다.
 * 호출측이 미리 칠한 배경(JPG 흰 배경 등)은 그대로 두고 그 위에 그린다.
 */
export function drawImageDownscaled(
  ctx: AnyContext,
  source: DrawableSource,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
): void {
  let src: CanvasImageSource = source;
  let srcX = sx;
  let srcY = sy;
  let w = sw;
  let h = sh;

  while (w / 2 >= dw * 2 && h / 2 >= dh * 2) {
    const nw = Math.round(w / 2);
    const nh = Math.round(h / 2);
    const step = createCanvas(nw, nh);
    const sctx = step.getContext("2d") as AnyContext | null;
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

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(src, srcX, srcY, w, h, dx, dy, dw, dh);
}

/**
 * source의 (sx, sy, sw, sh) 영역을 targetW×targetH 새 캔버스로 줄여 돌려준다(투명 배경).
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
  const out = document.createElement("canvas");
  out.width = targetW;
  out.height = targetH;
  const ctx = out.getContext("2d");
  if (!ctx) throw new Error("Canvas 컨텍스트를 생성할 수 없습니다.");
  drawImageDownscaled(ctx, source, sx, sy, sw, sh, 0, 0, targetW, targetH);
  return out;
}
