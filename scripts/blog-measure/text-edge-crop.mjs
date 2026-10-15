/**
 * 블로그 실측용: 스크린샷 본문 한 줄을 4배 확대해 PNG·JPG 80%·JPG 40%를 비교한 이미지를 만든다.
 * 사용: node scripts/blog-measure/text-edge-crop.mjs <screenshot-src.png> <출력.png>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";
const [,, src, out] = process.argv;
const b = await chromium.launch({ args: ["--disable-lcd-text"] }); const p = await b.newPage();
await p.setContent("<html><body></body></html>");
const dataUrl = await p.evaluate(async (url) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
  const img = await load(url);
  const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
  c.getContext("2d").drawImage(img, 0, 0);
  const jpg80 = await load(c.toDataURL("image/jpeg", 0.8));
  const jpg40 = await load(c.toDataURL("image/jpeg", 0.4));
  const sx = 606, sy = 838, sw = 150, sh = 26, z = 4, pad = 34, gap = 14;
  const rowH = sh * z + pad + gap;
  const o = document.createElement("canvas"); o.width = sw * z; o.height = rowH * 3 - gap;
  const x = o.getContext("2d"); x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height);
  x.imageSmoothingEnabled = false;
  const row = (im, i, label) => { const y = rowH * i; x.fillStyle = "#0A0A0A"; x.font = "600 18px sans-serif"; x.fillText(label, 4, y + 24); x.drawImage(im, sx, sy, sw, sh, 0, y + pad, sw * z, sh * z); };
  row(img, 0, "PNG — 원본 그대로");
  row(jpg80, 1, "JPG 품질 80%");
  row(jpg40, 2, "JPG 품질 40%");
  return o.toDataURL("image/png");
}, "data:image/png;base64," + fs.readFileSync(src).toString("base64"));
fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
await b.close();
