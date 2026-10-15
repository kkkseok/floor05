/**
 * 블로그 실측용: 사진·스크린샷·그래픽을 PNG/JPG/WebP로 저장해 용량과 PSNR을 잰다.
 * floor05 포맷 변환 도구와 같은 Chromium Canvas toBlob 경로를 쓴다.
 * 사용: node scripts/blog-measure/image-formats.mjs <사진.jpg> <그래픽.png> <출력폴더>
 * 결과: <출력폴더>/result.json, screenshot-src.png (원자료는 docs/blog-data/에 보관)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";
const [,, photoPath, ogPath, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const b = await chromium.launch({ args: ["--disable-lcd-text"] });
// 1) 스크린샷 원본: floor05 이미지 압축 페이지 1920x1080
const sp = await b.newPage({ viewport: { width: 1920, height: 1080 } });
await sp.goto("https://www.floor05.com/tools/image/compress", { waitUntil: "networkidle" });
const shot = await sp.screenshot({ type: "png" });
fs.writeFileSync(path.join(outDir, "screenshot-src.png"), shot);
const page = await b.newPage();
await page.setContent("<html><body></body></html>");
const toUrl = (buf, mime) => `data:${mime};base64,${buf.toString("base64")}`;
const sources = {
  photo: { url: toUrl(fs.readFileSync(photoPath), "image/jpeg"), width: 1920 },
  screenshot: { url: toUrl(shot, "image/png"), width: 1920 },
  graphic: { url: toUrl(fs.readFileSync(ogPath), "image/png"), width: null },
};
const result = await page.evaluate(async (sources) => {
  const load = (src) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = src; });
  const blob = (c, type, q) => new Promise((ok) => c.toBlob(ok, type, q));
  const pixels = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const psnr = (a, b) => { let s = 0, n = 0; for (let i = 0; i < a.length; i += 4) { for (let k = 0; k < 3; k++) { const d = a[i+k] - b[i+k]; s += d*d; n++; } } const mse = s / n; return mse === 0 ? Infinity : 10 * Math.log10(255*255/mse); };
  const canvasFrom = async (src) => { const img = await load(src); const c = document.createElement("canvas"); c.width = img.width; c.height = img.height; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0,0,c.width,c.height); x.drawImage(img, 0, 0); return c; };
  const out = {};
  for (const [name, s] of Object.entries(sources)) {
    const img = await load(s.url);
    const w = s.width ?? img.width, h = Math.round(img.height * w / img.width);
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d"); ctx.fillStyle = "#fff"; ctx.fillRect(0,0,w,h); ctx.drawImage(img, 0, 0, w, h);
    const ref = pixels(c);
    const r = { width: w, height: h, formats: {} };
    for (const [label, type, q] of [["png", "image/png"], ["jpg90", "image/jpeg", 0.9], ["jpg80", "image/jpeg", 0.8], ["jpg60", "image/jpeg", 0.6], ["webp90", "image/webp", 0.9], ["webp80", "image/webp", 0.8]]) {
      const bl = await blob(c, type, q);
      const back = await canvasFrom(URL.createObjectURL(bl));
      r.formats[label] = { bytes: bl.size, psnr: Number(psnr(ref, pixels(back)).toFixed(2)) };
    }
    // 세대 손실: JPG 90%로 반복 재저장
    if (name !== "graphic") {
      r.generations = {};
      let cur = c;
      for (let g = 1; g <= 20; g++) {
        const bl = await blob(cur, "image/jpeg", 0.9);
        cur = await canvasFrom(URL.createObjectURL(bl));
        if ([1, 5, 10, 20].includes(g)) r.generations[g] = { bytes: bl.size, psnr: Number(psnr(ref, pixels(cur)).toFixed(2)) };
      }
    }
    out[name] = r;
  }
  return out;
}, sources);
fs.writeFileSync(path.join(outDir, "result.json"), JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), result }, null, 2));
console.log(JSON.stringify({ browser: b.version(), result }, null, 1));
await b.close();
