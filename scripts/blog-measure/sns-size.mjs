/**
 * 블로그 실측용(sns-image-size): 공식 문서에서 확인한 SNS 규격 크기(docs/blog-data/sns-specs-*.json)로
 * floor05 이미지 리사이즈와 같은 경로로 사진을 맞췄을 때의 결과를 잰다.
 * 경로: 워커 안에서 createImageBitmap(imageOrientation: from-image) → computeCoverCrop과 같은 식으로
 *       가운데 자르기 → drawImageDownscaled(src/lib/image/downscale.ts 번들) → OffscreenCanvas.convertToBlob
 *       (JPG 품질 0.92 = 리사이즈 도구 고정값). src/workers/imageWorker.ts와 같은 순서다.
 * 재는 것:
 *  - presets: 규격 크기별 결과 용량(JPG 92%, 일부는 PNG도), 가운데 자르기로 남는 면적(%), 축소 배율
 *  - widths : 비율을 유지하고 너비만 줄였을 때 용량(JPG 92%)
 *  - upscale: 작은 JPG를 1080×1080으로 키운 결과의 PSNR.
 *             기준 = 원본에서 곧바로 1080×1080으로 줄인 캔버스 픽셀(저장 전). RGB 3채널.
 * 사용: npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>
 *       node scripts/blog-measure/sns-size.mjs <출력.json> <helper.js> 이름=<사진.jpg> [이름=<사진.jpg> ...]
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, helperPath, ...photoArgs] = process.argv;
if (!out || !helperPath || photoArgs.length === 0) {
  throw new Error("사용: node scripts/blog-measure/sns-size.mjs <출력.json> <helper.js> 이름=<사진.jpg> ...");
}

// [id, 너비, 높이, PNG도 잴지] — 수치의 출처는 docs/blog-data/sns-specs-*.json
const TARGETS = [
  ["instagram-3x4", 1080, 1440, false],
  ["instagram-4x5", 1080, 1350, true],
  ["instagram-1x1", 1080, 1080, false],
  ["instagram-1.91x1", 1080, 566, false],
  ["youtube-thumbnail-3840", 3840, 2160, true],
  ["youtube-thumbnail-1280", 1280, 720, true],
  ["youtube-banner-2560", 2560, 1440, true],
  ["youtube-banner-2048", 2048, 1152, false],
  ["facebook-page-cover", 851, 315, false],
  ["facebook-page-profile", 320, 320, false],
  ["facebook-link-image", 1200, 630, false],
  ["x-header", 1500, 500, false],
  ["x-profile", 400, 400, false],
];
const WIDTHS = [4096, 3840, 2560, 1920, 1080];
const UPSCALE_FROM = [540, 320, 270];

const workerBody = `
const TARGETS = ${JSON.stringify(TARGETS)};
const WIDTHS = ${JSON.stringify(WIDTHS)};
const UPSCALE_FROM = ${JSON.stringify(UPSCALE_FROM)};
// src/lib/image/resizeDims.ts computeCoverCrop과 같은 식(noEnlarge=false)
function coverCrop(W, H, width, height) {
  const target = width / height;
  let sw = W, sh = H;
  if (W / H > target) sw = H * target; else sh = W / target;
  return { sx: (W - sw) / 2, sy: (H - sh) / 2, sw, sh };
}
function render(bitmap, c, w, h, type) {
  const canvas = new OffscreenCanvas(w, h);
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  if (type === "image/jpeg") { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, w, h); }
  DS.drawImageDownscaled(ctx, bitmap, c.sx, c.sy, c.sw, c.sh, 0, 0, w, h);
  return canvas;
}
const save = (canvas, type) => canvas.convertToBlob({ type, quality: 0.92 });
const pixels = (canvas) => canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data;
function psnr(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i + k] - b[i + k]; s += d * d; }
  return Number((10 * Math.log10(65025 / (s / (a.length / 4 * 3)))).toFixed(2));
}
async function decodeToCanvas(blob) {
  const bm = await createImageBitmap(blob, { imageOrientation: "from-image" });
  const c = new OffscreenCanvas(bm.width, bm.height);
  c.getContext("2d").drawImage(bm, 0, 0);
  bm.close();
  return c;
}
self.onmessage = async (e) => {
  try {
    const file = e.data.file;
    const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
    const W = bitmap.width, H = bitmap.height;
    const presets = [];
    for (const [id, w, h, withPng] of TARGETS) {
      const c = coverCrop(W, H, w, h);
      const canvas = render(bitmap, c, w, h, "image/jpeg");
      const row = {
        id, width: w, height: h,
        keptPct: Number((c.sw * c.sh / (W * H) * 100).toFixed(1)),
        scaleDown: Number((c.sw / w).toFixed(2)),
        jpgBytes: (await save(canvas, "image/jpeg")).size,
      };
      if (withPng) row.pngBytes = (await save(render(bitmap, c, w, h, "image/png"), "image/png")).size;
      presets.push(row);
    }
    const widths = [];
    for (const w of WIDTHS) {
      const h = Math.round(w / (W / H)); // computeResizeDimensions: 너비만 지정
      const canvas = render(bitmap, { sx: 0, sy: 0, sw: W, sh: H }, w, h, "image/jpeg");
      widths.push({ width: w, height: h, jpgBytes: (await save(canvas, "image/jpeg")).size });
    }
    let upscale = null;
    if (e.data.upscale) {
      const sq = coverCrop(W, H, 1080, 1080);
      const refCanvas = render(bitmap, sq, 1080, 1080, "image/jpeg");
      const ref = pixels(refCanvas);
      const refBlob = await save(refCanvas, "image/jpeg");
      upscale = {
        target: "1080x1080",
        directJpg: { bytes: refBlob.size, psnr: psnr(ref, pixels(await decodeToCanvas(refBlob))) },
        from: [],
      };
      for (const s of UPSCALE_FROM) {
        const smallBlob = await save(render(bitmap, sq, s, s, "image/jpeg"), "image/jpeg");
        const small = await createImageBitmap(smallBlob, { imageOrientation: "from-image" });
        const up = render(small, coverCrop(s, s, 1080, 1080), 1080, 1080, "image/jpeg");
        const upBlob = await save(up, "image/jpeg");
        upscale.from.push({
          size: s, smallBytes: smallBlob.size, factor: Number((1080 / s).toFixed(2)),
          upscaledBytes: upBlob.size, psnr: psnr(ref, pixels(await decodeToCanvas(upBlob))),
        });
        small.close();
      }
    }
    bitmap.close();
    self.postMessage({ ok: true, result: { width: W, height: H, fileBytes: file.size, presets, widths, upscale } });
  } catch (err) {
    self.postMessage({ ok: false, error: String(err) });
  }
};
`;

const b = await chromium.launch();
const page = await b.newPage();
await page.goto("about:blank");
const workerCode = fs.readFileSync(helperPath, "utf8") + "\n" + workerBody;
const photos = {};
for (const [index, arg] of photoArgs.entries()) {
  const i = arg.indexOf("=");
  const name = arg.slice(0, i);
  const b64 = fs.readFileSync(arg.slice(i + 1)).toString("base64");
  const r = await page.evaluate(
    async ({ workerCode, b64, upscale }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
      const file = new Blob([bytes], { type: "image/jpeg" });
      const worker = new Worker(URL.createObjectURL(new Blob([workerCode], { type: "text/javascript" })));
      const res = await new Promise((ok, fail) => {
        worker.onmessage = (e) => ok(e.data);
        worker.onerror = (e) => fail(new Error(e.message));
        worker.postMessage({ file, upscale });
      });
      worker.terminate();
      return res;
    },
    { workerCode, b64, upscale: index === 0 },
  );
  if (!r.ok) throw new Error(`${name}: ${r.error}`);
  photos[name] = r.result;
  console.log(name, JSON.stringify(r.result, null, 1));
}
fs.writeFileSync(
  out,
  JSON.stringify({ browser: `Playwright Chromium ${b.version()}`, measuredAt: new Date().toISOString(), photos }, null, 2),
);
await b.close();
