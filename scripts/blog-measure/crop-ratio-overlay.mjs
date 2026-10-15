/**
 * 블로그용 그림: 사진 위에 비율별 최대 크롭 영역(가운데 정렬)을 겹쳐 그린다.
 * 사용: node scripts/blog-measure/crop-ratio-overlay.mjs <사진.jpg> <출력.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , photo, out] = process.argv;
const url = `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
const data = await p.evaluate(async (url) => {
  const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = url; });
  const W = 960, H = Math.round(img.height * W / img.width);
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const x = c.getContext("2d"); x.drawImage(img, 0, 0, W, H);
  x.fillStyle = "rgba(0,0,0,0.25)"; x.fillRect(0, 0, W, H);
  const area = (r) => { let w, h; if (W / H > r) { h = H; w = h * r; } else { w = W; h = w / r; } return { x: (W - w) / 2, y: (H - h) / 2, w, h }; };
  const items = [["1:1", 1, "#FFFFFF", 78.1], ["16:9", 16 / 9, "#E8734A", 72.0], ["9:16", 9 / 16, "#7FD1FF", 43.9]];
  x.lineWidth = 4; x.font = "700 22px sans-serif";
  items.forEach(([label, r, color, pct], i) => {
    const a = area(r);
    x.strokeStyle = color; x.setLineDash(i === 0 ? [] : [14, 8]);
    x.strokeRect(a.x + 2, a.y + 2, a.w - 4, a.h - 4);
    x.fillStyle = color;
    const ty = i === 1 ? a.y + 34 : i === 2 ? a.y + a.h - 16 : a.y + 34;
    const tx = i === 0 ? a.x + 14 : i === 1 ? a.x + a.w - 190 : a.x + 14;
    x.fillText(`${label} · ${pct}% 남음`, tx, ty);
  });
  return c.toDataURL("image/jpeg", 0.85);
}, url);
fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
await b.close();
