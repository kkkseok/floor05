/**
 * 블로그 실측(id-photo-size-guide): 공식 페이지에서 확인한 증명사진 규격으로
 * (1) cm→픽셀 환산을 계산하고 (2) floor05 이미지 크롭과 같은 경로(src/lib/image/crop.ts —
 * Image 로드 → 정수 좌표로 자른 캔버스 → drawImageDownscaled → toBlob)로 규격 크기 파일을 만들어
 * 남는 면적과 용량을 잰다. 얼굴 크기·배경 같은 사진 내용 조건은 재지 않는다(인물 사진을 쓰지 않음).
 * 규격 수치의 출처: docs/blog-data/id-photo-specs-<확인일>.json
 * 사용: npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>
 *       node scripts/blog-measure/id-photo-size.mjs <출력.json> <helper.js> <이름=사진.jpg> [<이름=사진.jpg> ...]
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, helperPath, ...photoArgs] = process.argv;
if (!out || !helperPath || photoArgs.length === 0) {
  throw new Error("사용: node scripts/blog-measure/id-photo-size.mjs <출력.json> <helper.js> <이름=사진.jpg> ...");
}

// ── 계산 (측정 아님) ─────────────────────────────────────────
const CM_PER_INCH = 2.54;
const r2 = (n) => Number(n.toFixed(2));
const cmToPx = (cm, dpi) => (cm * dpi) / CM_PER_INCH;
const pxToCm = (px, dpi) => (px * CM_PER_INCH) / dpi;
const impliedDpi = (px, cm) => (px * CM_PER_INCH) / cm;

const PRINT_SIZES = [
  { id: "3.5x4.5", wCm: 3.5, hCm: 4.5 },
  { id: "3x4", wCm: 3, hCm: 4 },
];
const DPIS = [100, 150, 200, 300, 600];
const cmToPxTable = PRINT_SIZES.map((s) => ({
  id: s.id,
  wCm: s.wCm,
  hCm: s.hCm,
  ratio: Number((s.wCm / s.hCm).toFixed(4)),
  byDpi: DPIS.map((dpi) => ({
    dpi,
    exactW: r2(cmToPx(s.wCm, dpi)),
    exactH: r2(cmToPx(s.hCm, dpi)),
    w: Math.round(cmToPx(s.wCm, dpi)),
    h: Math.round(cmToPx(s.hCm, dpi)),
  })),
}));

// 공식 페이지에 적힌 픽셀 크기가 3.5×4.5cm에서 몇 dpi에 해당하는지
const officialPixelSizes = [
  { id: "413x531", w: 413, h: 531 },
  { id: "137x177", w: 137, h: 177 },
  { id: "min-395x507", w: 395, h: 507 },
  { id: "max-431x550", w: 431, h: 550 },
].map((p) => ({
  ...p,
  ratio: Number((p.w / p.h).toFixed(4)),
  impliedDpiW: r2(impliedDpi(p.w, 3.5)),
  impliedDpiH: r2(impliedDpi(p.h, 4.5)),
  // 3.5:4.5로 자른 영역을 이 픽셀 크기에 맞출 때 가로가 세로에 비해 달라지는 정도(%)
  stretchVs35x45Pct: r2((p.w / p.h / (3.5 / 4.5) - 1) * 100),
  megapixels: Number(((p.w * p.h) / 1e6).toFixed(3)),
  printCmAt300: { w: r2(pxToCm(p.w, 300)), h: r2(pxToCm(p.h, 300)) },
}));

// 머리 길이 3.2~3.6cm(운전면허·수능 공식 안내)가 세로 4.5cm 사진에서 차지하는 비율과 531px 파일에서의 픽셀
const headLength = {
  cm: [3.2, 3.6],
  pctOfHeight: [Number(((3.2 / 4.5) * 100).toFixed(1)), Number(((3.6 / 4.5) * 100).toFixed(1))],
  pxAtHeight531: [Math.round((3.2 / 4.5) * 531), Math.round((3.6 / 4.5) * 531)],
};

// 원본 비율별로 규격 비율로 자를 때 남는 최대 면적(calculateMaxCropArea와 같은 식)
const keptPct = (srcRatio, targetRatio) =>
  Number(((srcRatio > targetRatio ? targetRatio / srcRatio : srcRatio / targetRatio) * 100).toFixed(1));
const SOURCE_RATIOS = [
  { id: "3:4 세로", r: 3 / 4 },
  { id: "9:16 세로", r: 9 / 16 },
  { id: "2:3 세로", r: 2 / 3 },
  { id: "1:1", r: 1 },
  { id: "4:3 가로", r: 4 / 3 },
  { id: "3:2 가로", r: 3 / 2 },
  { id: "16:9 가로", r: 16 / 9 },
];
const keptByAspect = SOURCE_RATIOS.map((s) => ({
  source: s.id,
  to35x45: keptPct(s.r, 3.5 / 4.5),
  to3x4: keptPct(s.r, 3 / 4),
}));

// ── 측정 ────────────────────────────────────────────────────
const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
await page.addScriptTag({ content: fs.readFileSync(helperPath, "utf8") });

const photos = {};
for (const arg of photoArgs) {
  const eq = arg.indexOf("=");
  const name = arg.slice(0, eq);
  const file = arg.slice(eq + 1);
  const fileBytes = fs.statSync(file).size;
  const url = `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
  const measured = await page.evaluate(async (url) => {
    const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
    const toBlob = (c, type, q) => new Promise((ok) => c.toBlob(ok, type, q));
    const img = await load(url);
    const W = img.width, H = img.height;
    const maxArea = (ratio) => {
      let w, h;
      if (W / H > ratio) { h = H; w = h * ratio; } else { w = W; h = w / ratio; }
      return { x: (W - w) / 2, y: (H - h) / 2, w, h };
    };
    // crop.ts와 같은 순서: 원본 크기로 자른 캔버스 → (JPG면 흰 배경) → 출력 크기로 단계 축소
    const cut = (a, outW, outH, jpg) => {
      const x = Math.max(0, Math.round(a.x)), y = Math.max(0, Math.round(a.y));
      const w = Math.max(1, Math.min(Math.round(a.w), W - x)), h = Math.max(1, Math.min(Math.round(a.h), H - y));
      const cropC = document.createElement("canvas"); cropC.width = w; cropC.height = h;
      const cc = cropC.getContext("2d"); cc.imageSmoothingEnabled = true; cc.imageSmoothingQuality = "high";
      cc.drawImage(img, x, y, w, h, 0, 0, w, h);
      const c = document.createElement("canvas"); c.width = outW; c.height = outH;
      const ctx = c.getContext("2d"); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
      if (jpg) { ctx.fillStyle = "#FFFFFF"; ctx.fillRect(0, 0, outW, outH); }
      DS.drawImageDownscaled(ctx, cropC, 0, 0, w, h, 0, 0, outW, outH);
      return { c, cropW: w, cropH: h };
    };
    const sizes = [];
    for (const [id, outW, outH] of [["413x531", 413, 531], ["137x177", 137, 177], ["354x472", 354, 472]]) {
      // 도구는 고정 출력 크기의 비율(outW/outH)로 크롭 영역을 잡는다
      const area = maxArea(outW / outH);
      const j = cut(area, outW, outH, true);
      const jpgByQuality = {};
      for (const q of [1, 0.92, 0.8, 0.6, 0.4]) jpgByQuality[q] = (await toBlob(j.c, "image/jpeg", q)).size;
      const p = cut(area, outW, outH, false);
      const pngBytes = (await toBlob(p.c, "image/png")).size;
      sizes.push({
        id, width: outW, height: outH, cropW: j.cropW, cropH: j.cropH,
        keptPct: Number(((j.cropW * j.cropH) / (W * H) * 100).toFixed(1)),
        scaleDown: Number((j.cropW / outW).toFixed(2)),
        jpgByQuality, pngBytes,
      });
    }
    return { width: W, height: H, sizes };
  }, url);
  photos[name] = { fileBytes, ...measured };
}

const result = {
  measuredAt: new Date().toISOString(),
  browser: `Playwright Chromium ${b.version()}`,
  script: "scripts/blog-measure/id-photo-size.mjs (도구 대조: id-photo-tool-check.mjs)",
  method:
    "Image 로드 → 규격 비율로 가운데 최대 영역을 정수 좌표로 자른 캔버스 → drawImageDownscaled(src/lib/image/downscale.ts esbuild 번들) → canvas.toBlob. src/lib/image/crop.ts의 cropImage와 같은 순서. 크롭 도구의 JPG 품질은 0.92 고정이고, 다른 품질 값은 같은 캔버스를 품질만 바꿔 저장한 것이다.",
  units: "bytes. 글에서는 1KB=1,000B, 1MB=1,000,000B로 환산",
  specs: "규격 수치의 출처는 docs/blog-data/id-photo-specs-*.json",
  notMeasured:
    "얼굴 길이(3.2~3.6cm)·배경색·표정 같은 사진 내용 조건, 접수 시스템의 실제 업로드 판정, Firefox·Safari 결과. 측정에 인물 사진을 쓰지 않았다.",
  calc: {
    note: "계산값(측정 아님). 1인치 = 2.54cm. px = cm × dpi ÷ 2.54, w·h는 반올림",
    cmToPx: cmToPxTable,
    officialPixelSizes,
    headLength,
    keptByAspect: {
      note: "원본 비율별로 규격 비율의 가운데 최대 영역을 잡을 때 남는 면적(%)",
      rows: keptByAspect,
    },
  },
  photos,
};
fs.writeFileSync(out, JSON.stringify(result, null, 2) + "\n");
console.log(JSON.stringify(result, null, 1));
await b.close();
