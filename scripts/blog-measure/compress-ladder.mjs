/**
 * 블로그 실측용: 원본 카메라 JPG를 floor05 이미지 압축과 같은 방식(Canvas toBlob, 해상도 유지)으로
 * 품질 단계별·목표 용량별로 압축해 용량·PSNR을 잰다. 목표 용량 탐색은 src/lib/image/compress.ts의
 * compressToTargetSize와 같은 이진 탐색(KB=1024, 최대 10회, 실패 시 품질 0.5로 0.8배씩 축소)을 쓴다.
 * 사용: node scripts/blog-measure/compress-ladder.mjs <출력폴더> <이름=사진.jpg>...
 * 결과: <출력폴더>/result.json, crops-<이름>.png (100% 크기 부분 확대 비교)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , outDir, ...inputs] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const photos = inputs.map((arg) => {
  const [name, file] = arg.split("=");
  return { name, url: `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`, bytes: fs.statSync(file).size };
});

const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html><body></body></html>");

const result = {};
for (const photo of photos) {
  const r = await page.evaluate(async ({ url }) => {
    const load = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });
    const toBlob = (c, q) => new Promise((ok) => c.toBlob(ok, "image/jpeg", q));
    const draw = (img, w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.fillStyle = "#fff"; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, w, h); return c; };
    const px = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    const psnr = (a, bb) => { let s = 0; for (let i = 0; i < a.length; i += 4) { const d0 = a[i] - bb[i], d1 = a[i+1] - bb[i+1], d2 = a[i+2] - bb[i+2]; s += d0*d0 + d1*d1 + d2*d2; } const mse = s / (a.length / 4 * 3); return mse === 0 ? null : Number((10 * Math.log10(65025 / mse)).toFixed(2)); };
    const img = await load(url);
    const W = img.width, H = img.height;
    const base = draw(img, W, H);
    const ref = px(base);
    const measure = async (blob) => { const back = draw(await load(URL.createObjectURL(blob)), W, H); return psnr(ref, px(back)); };

    const ladder = [];
    for (const q of [1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2]) {
      const t0 = performance.now();
      const blob = await toBlob(base, q);
      const ms = Math.round(performance.now() - t0);
      ladder.push({ quality: q, bytes: blob.size, ms, psnr: await measure(blob) });
    }

    // compressToTargetSize 재현
    const targets = [];
    for (const kb of [1000, 500, 200, 100]) {
      const targetBytes = kb * 1024;
      let low = 0.01, high = 1.0, best = null, attempts = 0;
      while (attempts < 10 && high - low > 0.01) {
        const mid = (low + high) / 2;
        const blob = await toBlob(base, mid);
        if (blob.size <= targetBytes) { best = { quality: Number(mid.toFixed(3)), blob }; low = mid; } else { high = mid; }
        attempts++;
      }
      if (best) {
        targets.push({ targetKB: kb, quality: best.quality, bytes: best.blob.size, width: W, height: H, attempts, psnr: await measure(best.blob) });
      } else {
        let scale = 1, blob = await toBlob(base, 0.5), w = W, h = H;
        for (let i = 0; i < 8 && blob.size > targetBytes; i++) { scale *= 0.8; w = Math.round(W * scale); h = Math.round(H * scale); blob = await toBlob(draw(img, w, h), 0.5); }
        targets.push({ targetKB: kb, quality: 0.5, bytes: blob.size, width: w, height: h, attempts, resized: true });
      }
    }
    return { width: W, height: H, ladder, targets };
  }, { url: photo.url });
  result[photo.name] = { sourceBytes: photo.bytes, ...r };
  console.log(photo.name, JSON.stringify(r));
}

fs.writeFileSync(path.join(outDir, "result.json"), JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), result }, null, 2));
await b.close();
