/**
 * 블로그 실측용: 원본 카메라 JPG의 같은 영역을 품질별로 잘라 2배 확대 비교 이미지를 만든다.
 * 사용: node scripts/blog-measure/compress-crops.mjs <출력.png> <라벨=사진.jpg@x,y,w,h>...
 *   x,y,w,h는 원본 픽셀 기준 잘라낼 영역
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, ...specs] = process.argv;
const rows = specs.map((s) => {
  const [label, rest] = s.split("=");
  const [file, box] = rest.split("@");
  const [x, y, w, h] = box.split(",").map(Number);
  return { label, url: `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`, x, y, w, h };
});
const QUALITIES = [0.9, 0.5, 0.2];
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
const dataUrl = await p.evaluate(async ({ rows, QUALITIES }) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
  const Z = 2, PAD = 30, GAP = 10, LEFT = 0;
  const tileW = rows[0].w * Z, tileH = rows[0].h * Z;
  const o = document.createElement("canvas");
  o.width = LEFT + QUALITIES.length * tileW + (QUALITIES.length - 1) * GAP;
  o.height = rows.length * (tileH + PAD + GAP);
  const x = o.getContext("2d");
  x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height);
  x.imageSmoothingEnabled = false;
  for (let r = 0; r < rows.length; r++) {
    const row = rows[r];
    const img = await load(row.url);
    const c = document.createElement("canvas"); c.width = img.width; c.height = img.height;
    const cx = c.getContext("2d"); cx.drawImage(img, 0, 0);
    for (let i = 0; i < QUALITIES.length; i++) {
      const q = QUALITIES[i];
      const enc = await load(c.toDataURL("image/jpeg", q));
      const ox = LEFT + i * (tileW + GAP), oy = r * (tileH + PAD + GAP);
      x.fillStyle = "#0A0A0A"; x.font = "600 16px sans-serif";
      x.fillText(`${row.label} · 품질 ${Math.round(q * 100)}%`, ox + 2, oy + 21);
      x.drawImage(enc, row.x, row.y, row.w, row.h, ox, oy + PAD, tileW, tileH);
    }
  }
  return o.toDataURL("image/png");
}, { rows, QUALITIES });
fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
await b.close();
