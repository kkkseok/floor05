/**
 * 블로그 실측용: floor05 워터마크(src/lib/image/watermark.ts의 drawWatermark, esbuild 번들 주입)를
 * 1920px 사진에 적용해 ① 여러 크기·위치로 잘랐을 때 워터마크가 완전히 사라지는 비율
 * ② 투명도별 사진 변화(PSNR, 바뀐 픽셀 비율)를 잰다. 텍스트 '© floor05', 글자 크기·여백 기본값.
 * 사용: npx esbuild src/lib/image/watermark.ts --bundle --format=iife --global-name=WM --outfile=<wm.js>
 *       node scripts/blog-measure/watermark-crop.mjs <wm.js> <사진.jpg> <출력.json>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , wmJs, photo, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
await p.addScriptTag({ content: fs.readFileSync(wmJs, "utf8") });
const result = await p.evaluate(async (url) => {
  const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = url; });
  const W = 1920, H = Math.round(img.height * W / img.width);
  const base = document.createElement("canvas"); base.width = W; base.height = H;
  const bx = base.getContext("2d"); bx.imageSmoothingQuality = "high"; bx.drawImage(img, 0, 0, W, H);
  const ref = bx.getImageData(0, 0, W, H).data;
  const variants = {
    "모서리(오른쪽 아래)": { tile: false, position: "bottom-right", rotation: 0 },
    "전체 반복": { tile: true, rotation: 0 },
    "전체 반복 + 30° 회전": { tile: true, rotation: 30 },
  };
  const out = { size: [W, H], crop: {}, cover: {} };
  for (const [name, v] of Object.entries(variants)) {
    // 워터마크만 그린 마스크(불투명 100%로 그려 위치만 본다)
    const m = document.createElement("canvas"); m.width = W; m.height = H;
    WM.drawWatermark(m.getContext("2d"), W, H, { mode: "text", text: "© floor05", opacity: 100, ...v });
    const a = m.getContext("2d").getImageData(0, 0, W, H).data;
    const mask = new Uint8Array(W * H); let total = 0;
    for (let i = 0; i < W * H; i++) { if (a[i * 4 + 3] > 0) { mask[i] = 1; total++; } }
    // 적분 영상으로 임의 사각형 안 워터마크 픽셀 수를 빠르게 센다
    const S = new Uint32Array((W + 1) * (H + 1));
    for (let y = 0; y < H; y++) { let row = 0; for (let x = 0; x < W; x++) { row += mask[y * W + x]; S[(y + 1) * (W + 1) + x + 1] = S[y * (W + 1) + x + 1] + row; } }
    const sum = (x0, y0, x1, y1) => S[y1 * (W + 1) + x1] - S[y0 * (W + 1) + x1] - S[y1 * (W + 1) + x0] + S[y0 * (W + 1) + x0];
    const res = {};
    for (const keep of [0.9, 0.75, 0.6, 0.5]) {
      const cw = Math.round(W * keep), ch = Math.round(H * keep);
      let n = 0, gone = 0;
      for (let fy = 0; fy <= 1.0001; fy += 0.05) for (let fx = 0; fx <= 1.0001; fx += 0.05) {
        const x0 = Math.round((W - cw) * fx), y0 = Math.round((H - ch) * fy);
        n++; if (sum(x0, y0, x0 + cw, y0 + ch) === 0) gone++;
      }
      res[`${Math.round(keep * 100)}%`] = { crops: n, watermarkGone: gone, gonePct: Number((gone / n * 100).toFixed(1)) };
    }
    out.crop[name] = { maskPixelsPct: Number((total / (W * H) * 100).toFixed(2)), ...res };
    // 투명도별 사진 변화
    const cov = {};
    for (const op of [20, 30, 50, 80]) {
      const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d");
      x.drawImage(base, 0, 0); WM.drawWatermark(x, W, H, { mode: "text", text: "© floor05", opacity: op, ...v });
      const d = x.getImageData(0, 0, W, H).data; let s = 0, changed = 0;
      for (let i = 0; i < d.length; i += 4) { let e = 0; for (let k = 0; k < 3; k++) { const t = d[i + k] - ref[i + k]; s += t * t; e = Math.max(e, Math.abs(t)); } if (e > 2) changed++; }
      cov[`${op}%`] = { psnr: Number((10 * Math.log10(65025 / (s / (W * H * 3)))).toFixed(2)), changedPct: Number((changed / (W * H) * 100).toFixed(2)) };
    }
    out.cover[name] = cov;
  }
  return out;
}, `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`);
fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), browser: b.version(), result }, null, 2));
console.log(JSON.stringify(result, null, 1));
await b.close();
