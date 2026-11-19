/**
 * 블로그 실측용(prevent-photo-theft): 올리는 크기를 줄이면 가져간 사람이 되돌릴 수 있는 것이 얼마나 줄어드는지 잰다.
 *
 * 1) 원본 JPG를 floor05 리사이즈와 같은 경로로 줄인다:
 *    createImageBitmap(file, { imageOrientation: "from-image" }) → 흰 배경 → drawImageDownscaled(src/lib/image/downscale.ts)
 *    → OffscreenCanvas.convertToBlob("image/jpeg", 0.92)  (src/workers/imageWorker.ts와 같은 순서)
 * 2) 줄인 JPG를 다시 원본 크기로 키운다(브라우저 drawImage, imageSmoothingQuality="high").
 * 3) PSNR 기준 = 같은 브라우저가 디코딩한 원본 픽셀(RGB 3채널, 전체 픽셀). 즉 "원본에서 얼마나 멀어졌나".
 *    long=0 행은 크기는 그대로 두고 JPG 0.92로 다시 저장만 한 대조군이다.
 *
 * 사용:
 *   npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>
 *   node scripts/blog-measure/upload-size-restore.mjs <helper.js> <출력폴더> <이름=사진.jpg[@x,y,w,h]>... [--long=2560,1920,1280,800]
 *   @x,y,w,h(원본 픽셀)를 붙이면 그 영역만 따로 잰 PSNR(regionPsnrBrowserHigh)도 남긴다. 배경이 흐린 사진의 피사체용.
 * 결과: <출력폴더>/<이름>-<긴변>.jpg (줄인 파일), <출력폴더>/restore.json
 * Pillow 확대(Lanczos·Bicubic)와 메타데이터 세그먼트는 upload-size-restore.py가 이어서 잰다.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const longArg = args.find((a) => a.startsWith("--long="));
const LONGS = (longArg ? longArg.slice(7) : "2560,1920,1280,800").split(",").map(Number);
const [helperPath, outDir, ...specs] = args.filter((a) => !a.startsWith("--"));
if (!helperPath || !outDir || specs.length === 0) {
  throw new Error("사용: node scripts/blog-measure/upload-size-restore.mjs <helper.js> <출력폴더> <이름=사진.jpg>...");
}
fs.mkdirSync(outDir, { recursive: true });
const helper = fs.readFileSync(helperPath, "utf8");

const browser = await chromium.launch();
const result = { browser: browser.version(), jpegQuality: 0.92, photos: {} };

for (const spec of specs) {
  const i = spec.indexOf("=");
  const name = spec.slice(0, i);
  const [file, box] = spec.slice(i + 1).split("@");
  const region = box ? box.split(",").map(Number) : null;
  const bytes = fs.readFileSync(file);
  const page = await browser.newPage();
  await page.setContent("<html></html>");
  await page.addScriptTag({ content: helper });
  const res = await page.evaluate(
    async ({ b64, LONGS, region }) => {
      const bin = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
      const blob = new Blob([bin], { type: "image/jpeg" });
      const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
      const W = bmp.width;
      const H = bmp.height;

      const pixelsOf = (source, w, h) => {
        const c = new OffscreenCanvas(w, h);
        const x = c.getContext("2d", { willReadFrequently: true });
        x.imageSmoothingEnabled = true;
        x.imageSmoothingQuality = "high";
        x.drawImage(source, 0, 0, w, h);
        return x.getImageData(0, 0, w, h).data;
      };
      // box = [x, y, w, h] (없으면 전체)
      const psnr = (a, b, box) => {
        const [x0, y0, bw, bh] = box || [0, 0, W, H];
        let se = 0;
        for (let y = y0; y < y0 + bh; y++) {
          for (let p = (y * W + x0) * 4, end = p + bw * 4; p < end; p += 4) {
            const dr = a[p] - b[p];
            const dg = a[p + 1] - b[p + 1];
            const db = a[p + 2] - b[p + 2];
            se += dr * dr + dg * dg + db * db;
          }
        }
        const mse = se / (bw * bh * 3);
        return mse === 0 ? Infinity : 10 * Math.log10((255 * 255) / mse);
      };
      const toB64 = async (bl) => {
        const u = new Uint8Array(await bl.arrayBuffer());
        let s = "";
        for (let k = 0; k < u.length; k += 0x8000) s += String.fromCharCode.apply(null, u.subarray(k, k + 0x8000));
        return btoa(s);
      };

      const orig = pixelsOf(bmp, W, H);
      const rows = [];
      // long=0: 크기는 그대로, 재저장만(대조군)
      for (const long of [0, ...LONGS]) {
        let tw = W;
        let th = H;
        if (long > 0) {
          if (W >= H) {
            tw = long;
            th = Math.round(long / (W / H));
          } else {
            th = long;
            tw = Math.round(long * (W / H));
          }
        }
        const c = new OffscreenCanvas(tw, th);
        const x = c.getContext("2d");
        x.imageSmoothingEnabled = true;
        x.imageSmoothingQuality = "high";
        x.fillStyle = "#FFFFFF";
        x.fillRect(0, 0, tw, th);
        DS.drawImageDownscaled(x, bmp, 0, 0, W, H, 0, 0, tw, th);
        const out = await c.convertToBlob({ type: "image/jpeg", quality: 0.92 });
        const back = await createImageBitmap(out);
        const restored = pixelsOf(back, W, H);
        back.close();
        rows.push({
          long,
          width: tw,
          height: th,
          bytes: out.size,
          restoredPsnrBrowserHigh: Math.round(psnr(orig, restored) * 100) / 100,
          ...(region ? { regionPsnrBrowserHigh: Math.round(psnr(orig, restored, region) * 100) / 100 } : {}),
          b64: await toB64(out),
        });
      }
      return { width: W, height: H, rows };
    },
    { b64: bytes.toString("base64"), LONGS, region },
  );
  await page.close();
  for (const row of res.rows) {
    fs.writeFileSync(path.join(outDir, `${name}-${row.long}.jpg`), Buffer.from(row.b64, "base64"));
    delete row.b64;
  }
  result.photos[name] = { sourceBytes: bytes.length, width: res.width, height: res.height, ...(region ? { region } : {}), rows: res.rows };
  console.log(name, JSON.stringify(res.rows));
}
await browser.close();
fs.writeFileSync(path.join(outDir, "restore.json"), JSON.stringify(result, null, 1));
