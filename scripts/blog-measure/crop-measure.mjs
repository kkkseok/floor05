/**
 * 블로그 실측용: floor05 이미지 크롭과 같은 방식(src/lib/image/crop.ts — 정수 좌표, high 스무딩,
 * JPG 92% / 원형은 PNG)으로 비율별 최대 영역 크롭, 원형 크롭, 고정 크기 출력을 만들어
 * 크기·용량·PSNR(손실 없이 자른 영역 대비)을 잰다.
 * 사용: node scripts/blog-measure/crop-measure.mjs <출력.json> <사진.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, photo] = process.argv;
const url = `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`;
const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
const result = await page.evaluate(async (url) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
  const toBlob = (c, type, q) => new Promise((ok) => c.toBlob(ok, type, q));
  const px = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const psnr = (a, bb) => { let s = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i+k] - bb[i+k]; s += d*d; } return Number((10*Math.log10(65025/(s/(a.length/4*3)))).toFixed(2)); };
  const img = await load(url);
  const W = img.width, H = img.height;
  const maxArea = (ratio) => {
    if (ratio === null) return { x: 0, y: 0, w: W, h: H };
    let w, h;
    if (W / H > ratio) { h = H; w = h * ratio; } else { w = W; h = w / ratio; }
    return { x: (W - w) / 2, y: (H - h) / 2, w, h };
  };
  const cut = (a, outW, outH, circle) => {
    const x = Math.max(0, Math.round(a.x)), y = Math.max(0, Math.round(a.y));
    const w = Math.max(1, Math.min(Math.round(a.w), W - x)), h = Math.max(1, Math.min(Math.round(a.h), H - y));
    const c = document.createElement("canvas"); c.width = outW ?? w; c.height = outH ?? h;
    const ctx = c.getContext("2d"); ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
    if (!circle) { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, x, y, w, h, 0, 0, c.width, c.height);
    if (circle) { ctx.globalCompositeOperation = "destination-in"; ctx.beginPath(); ctx.ellipse(c.width/2, c.height/2, c.width/2, c.height/2, 0, 0, Math.PI*2); ctx.fill(); }
    return c;
  };
  const back = async (blob, w, h) => { const im = await load(URL.createObjectURL(blob)); const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(im, 0, 0); return c; };

  const ratios = [];
  for (const [name, r] of [["자유(원본 그대로)", null], ["1:1", 1], ["4:3", 4/3], ["3:4", 3/4], ["16:9", 16/9], ["9:16", 9/16]]) {
    const c = cut(maxArea(r));
    const blob = await toBlob(c, "image/jpeg", 0.92);
    ratios.push({ name, w: c.width, h: c.height, keptPct: Number((c.width * c.height / (W * H) * 100).toFixed(1)), bytes: blob.size, psnr: psnr(px(c), px(await back(blob, c.width, c.height))) });
  }
  const sq = maxArea(1);
  const fixed = [];
  for (const [name, a, w, h] of [
    ["1:1 → 1080×1080 (JPG)", sq, 1080, 1080],
    ["1:1 → 600×600 (JPG)", sq, 600, 600],
    ["3.5:4.5 → 413×531 (JPG)", maxArea(35/45), 413, 531],
    ["3:4 → 354×472 (JPG)", maxArea(3/4), 354, 472],
  ]) {
    const blob = await toBlob(cut(a, w, h), "image/jpeg", 0.92);
    fixed.push({ name, w, h, bytes: blob.size });
  }
  const circle = [];
  for (const size of [1080, 600]) {
    const png = await toBlob(cut(sq, size, size, true), "image/png");
    const jpg = await toBlob(cut(sq, size, size, false), "image/jpeg", 0.92);
    circle.push({ size, circlePng: png.size, squareJpg: jpg.size });
  }
  return { W, H, ratios, fixed, circle };
}, url);
fs.writeFileSync(out, JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), result }, null, 2));
console.log(JSON.stringify(result, null, 1));
await b.close();
