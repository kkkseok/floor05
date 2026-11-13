/**
 * 블로그 실측용 테스트 로고(1024×1024 PNG, 투명 배경)를 만든다.
 * 굵은 글자 "05" + 얇은 동심원 + 가는 사선 — 작게 줄일 때 계단·무늬 깨짐이 드러나는 요소를 일부러 넣었다.
 * 사용: node scripts/blog-measure/favicon-test-logo.mjs <출력.png>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
const data = await p.evaluate(() => {
  const S = 1024, c = document.createElement("canvas"); c.width = S; c.height = S;
  const x = c.getContext("2d");
  x.fillStyle = "#0A0A0A"; x.beginPath(); x.roundRect(64, 64, S - 128, S - 128, 160); x.fill();
  x.strokeStyle = "#E8734A"; x.lineWidth = 6;
  for (let r = 120; r <= 400; r += 28) { x.beginPath(); x.arc(S / 2, S / 2, r, 0, Math.PI * 2); x.stroke(); }
  x.save(); x.beginPath(); x.roundRect(64, 64, S - 128, S - 128, 160); x.clip();
  x.strokeStyle = "rgba(242,240,237,0.35)"; x.lineWidth = 4;
  for (let k = -S; k < S * 2; k += 22) { x.beginPath(); x.moveTo(k, 0); x.lineTo(k - S, S); x.stroke(); }
  x.restore();
  x.fillStyle = "#C45C2C"; x.font = "900 520px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText("05", S / 2, S / 2 + 30);
  return c.toDataURL("image/png");
});
fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
await b.close();
