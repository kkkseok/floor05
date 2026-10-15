/**
 * 블로그 실측용: 같은 PNG(무손실) 원본을 Chromium·WebKit·Firefox의 Canvas로 JPG/WebP/PNG 저장해
 * 용량·PSNR·인코딩 시간·실제 결과 형식·JPG 색 서브샘플링을 비교한다.
 * 사용: node scripts/blog-measure/browser-encoders.mjs <출력.json> <원본.png> [사진.jpg로 원본 PNG 생성]
 */
import fs from "node:fs";
import { chromium, webkit, firefox } from "@playwright/test";

const [, , out, pngPath, photoForPng] = process.argv;

// 원본 PNG가 없으면 사진을 1920px로 줄여 무손실 PNG로 만든다(모든 브라우저가 같은 픽셀을 받도록)
if (photoForPng && !fs.existsSync(pngPath)) {
  const b = await chromium.launch(); const p = await b.newPage(); await p.setContent("<html></html>");
  const data = await p.evaluate(async (url) => {
    const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = url; });
    const c = document.createElement("canvas"); c.width = 1920; c.height = Math.round(img.height * 1920 / img.width);
    const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, c.width, c.height);
    return c.toDataURL("image/png");
  }, `data:image/jpeg;base64,${fs.readFileSync(photoForPng).toString("base64")}`);
  fs.writeFileSync(pngPath, Buffer.from(data.split(",")[1], "base64")); await b.close();
}

/** JPEG SOF의 성분별 샘플링 계수 → "4:2:0" 등 */
function subsampling(buf) {
  for (let i = 2; i < buf.length - 10; ) {
    if (buf[i] !== 0xff) return null;
    const m = buf[i + 1], L = buf.readUInt16BE(i + 2);
    if (m === 0xc0 || m === 0xc2) {
      const n = buf[i + 9]; const f = [];
      for (let k = 0; k < n; k++) { const s = buf[i + 11 + k * 3]; f.push([s >> 4, s & 15]); }
      const [h, v] = f[0];
      return h === 2 && v === 2 ? "4:2:0" : h === 2 && v === 1 ? "4:2:2" : h === 1 && v === 1 ? "4:4:4" : `${h}x${v}`;
    }
    i += 2 + L;
  }
  return null;
}

const url = `data:image/png;base64,${fs.readFileSync(pngPath).toString("base64")}`;
const cases = [["jpeg", 0.92], ["jpeg", 0.8], ["jpeg", 0.6], ["webp", 0.8], ["png", undefined]];
const result = {};
for (const [name, engine] of [["Chromium", chromium], ["WebKit", webkit], ["Firefox", firefox]]) {
  const b = await engine.launch(); const p = await b.newPage(); await p.setContent("<html></html>");
  const rows = await p.evaluate(async ({ url, cases }) => {
    const load = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });
    const img = await load(url);
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    const ref = c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    const out = [];
    for (const [fmt, q] of cases) {
      const t0 = performance.now();
      const blob = await new Promise((ok) => c.toBlob(ok, `image/${fmt}`, q));
      const ms = Math.round(performance.now() - t0);
      const back = await load(URL.createObjectURL(blob));
      const d = document.createElement("canvas"); d.width = c.width; d.height = c.height; d.getContext("2d").drawImage(back, 0, 0);
      const px = d.getContext("2d").getImageData(0, 0, c.width, c.height).data;
      let s = 0; for (let i = 0; i < px.length; i += 4) for (let k = 0; k < 3; k++) { const e = px[i+k] - ref[i+k]; s += e*e; }
      const mse = s / (px.length / 4 * 3);
      const buf = new Uint8Array(await blob.arrayBuffer());
      let bin = ""; for (let i = 0; i < Math.min(buf.length, 4096); i++) bin += String.fromCharCode(buf[i]);
      out.push({ asked: `${fmt}${q ? " " + Math.round(q * 100) + "%" : ""}`, gotType: blob.type, bytes: blob.size, ms, psnr: mse === 0 ? null : Number((10 * Math.log10(65025 / mse)).toFixed(2)), head: btoa(bin) });
    }
    return out;
  }, { url, cases });
  for (const r of rows) { if (r.gotType === "image/jpeg") r.subsampling = subsampling(Buffer.from(r.head, "base64")); delete r.head; }
  result[name] = { version: b.version(), rows };
  console.log(name, b.version(), JSON.stringify(rows));
  await b.close();
}
fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), source: pngPath.split(/[\/]/).pop(), result }, null, 2));
