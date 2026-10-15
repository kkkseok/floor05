/**
 * 블로그용 그림: 모서리 워터마크(50%)에 75% 크롭 예시를 겹친 것과 전체 반복(30%)을 나란히 그린다.
 * 사용: node scripts/blog-measure/watermark-figure.mjs <wm.js> <사진.jpg> <출력.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , wmJs, photo, out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
await p.addScriptTag({ content: fs.readFileSync(wmJs, "utf8") });
const data = await p.evaluate(async (url) => {
  const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = url; });
  const W = 1920, H = Math.round(img.height * W / img.width);
  const make = (opts) => { const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(img, 0, 0, W, H); WM.drawWatermark(x, W, H, { mode: "text", text: "© floor05", ...opts }); return c; };
  const a = make({ opacity: 50, position: "bottom-right" });
  const t = make({ opacity: 30, tile: true });
  const TW = 640, TH = Math.round(H * TW / W), PAD = 12, GAP = 16, LABEL = 34;
  const o = document.createElement("canvas"); o.width = PAD * 2 + TW * 2 + GAP; o.height = PAD * 2 + LABEL + TH;
  const x = o.getContext("2d"); x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height);
  x.fillStyle = "#0A0A0A"; x.font = "600 18px sans-serif";
  x.fillText("모서리 · 투명도 50%", PAD, PAD + 22); x.fillText("전체 반복 · 투명도 30%", PAD + TW + GAP, PAD + 22);
  x.imageSmoothingQuality = "high";
  x.drawImage(a, PAD, PAD + LABEL, TW, TH); x.drawImage(t, PAD + TW + GAP, PAD + LABEL, TW, TH);
  // 75% 크롭 예시(왼쪽 위 기준) — 이 안에는 모서리 워터마크가 없다
  x.strokeStyle = "#E8734A"; x.lineWidth = 4; x.setLineDash([12, 8]);
  x.strokeRect(PAD + 2, PAD + LABEL + 2, TW * 0.75, TH * 0.75);
  x.setLineDash([]); x.font = "700 17px sans-serif";
  const msg = "점선 안(75%)만 잘라 쓰면 워터마크 없음";
  const mw = x.measureText(msg).width;
  x.fillStyle = "rgba(10,10,10,0.75)"; x.fillRect(PAD + 12, PAD + LABEL + 14, mw + 16, 30);
  x.fillStyle = "#FFFFFF"; x.fillText(msg, PAD + 20, PAD + LABEL + 35);
  return o.toDataURL("image/jpeg", 0.85);
}, `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`);
fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
await b.close();
