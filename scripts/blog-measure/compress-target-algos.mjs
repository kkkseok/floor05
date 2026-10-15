/**
 * 목표 용량 알고리즘 비교: A(이전, 품질만 탐색) vs B(품질 하한 + 해상도 단계). 1920px 화면 기준 PSNR.
 * 사용: node scripts/blog-measure/compress-target-algos.mjs <출력.json> <이름=사진.jpg>...
 */
import fs from "node:fs"; import path from "node:path"; import { createRequire } from "node:module";
const { chromium } = createRequire(path.join(process.cwd(), "package.json"))("@playwright/test");
const [, , out, ...inputs] = process.argv;
const b = await chromium.launch(); const page = await b.newPage(); await page.setContent("<html></html>");
const all = {};
for (const arg of inputs) {
  const [name, file] = arg.split("=");
  const url = `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
  all[name] = await page.evaluate(async (url) => {
    const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
    const toBlob = (c, q) => new Promise((ok) => c.toBlob(ok, "image/jpeg", q));
    const draw = (img, w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.fillStyle = "#fff"; x.fillRect(0,0,w,h); x.drawImage(img, 0, 0, w, h); return c; };
    const px = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    const psnr = (a, bb) => { let s = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i+k] - bb[i+k]; s += d*d; } return Number((10*Math.log10(65025/(s/(a.length/4*3)))).toFixed(2)); };
    const img = await load(url); const W = img.width, H = img.height;
    const DW = 1920, DH = Math.round(H * DW / W);
    const refDisp = px(draw(img, DW, DH));
    const evalDisp = async (blob) => psnr(refDisp, px(draw(await load(URL.createObjectURL(blob)), DW, DH)));
    const out = {};
    for (const kb of [1000, 500, 200, 100]) {
      const T = kb * 1024; const row = {};
      // A: 현재 알고리즘
      { const base = draw(img, W, H); let low = .01, high = 1, best = null, n = 0;
        while (n < 10 && high - low > .01) { const mid = (low+high)/2; const bl = await toBlob(base, mid); if (bl.size <= T) { best = { q: mid, bl, w: W }; low = mid; } else high = mid; n++; }
        if (!best) { let s = 1, bl = await toBlob(base, .5), w = W; for (let i = 0; i < 8 && bl.size > T; i++) { s *= .8; w = Math.round(W*s); bl = await toBlob(draw(img, w, Math.round(H*s)), .5); } best = { q: .5, bl, w }; }
        row.A = { q: Number(best.q.toFixed(3)), w: best.w, bytes: best.bl.size, psnr1920: await evalDisp(best.bl) }; }
      // B: 품질 하한 0.6 — 해상도를 단계적으로 낮추며 각 단계에서 [0.6, 0.92] 이진 탐색
      for (const floor of [0.6, 0.7]) {
        let picked = null;
        for (const s of [1, .9, .8, .7, .6, .5, .45, .4, .35, .3, .25, .2, .15, .1]) {
          const w = Math.round(W*s), h = Math.round(H*s); const c = draw(img, w, h);
          const atFloor = await toBlob(c, floor); if (atFloor.size > T) continue;
          let low = floor, high = .92, best = { q: floor, bl: atFloor };
          for (let n = 0; n < 7 && high - low > .01; n++) { const mid = (low+high)/2; const bl = await toBlob(c, mid); if (bl.size <= T) { best = { q: mid, bl }; low = mid; } else high = mid; }
          picked = { q: Number(best.q.toFixed(3)), w, bytes: best.bl.size, psnr1920: await evalDisp(best.bl) }; break;
        }
        row["B" + floor] = picked;
      }
      out[kb] = row;
    }
    return { W, H, out };
  }, url);
  console.log(name, JSON.stringify(all[name]));
}
fs.writeFileSync(out, JSON.stringify(all, null, 2)); await b.close();
