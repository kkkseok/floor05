/**
 * 블로그 실측용 투명 로고(600×400 PNG): 완전 투명 배경 + 가장자리가 부드러운 원 + 50% 반투명 그림자 + 글자.
 * 사용: node scripts/blog-measure/alpha-test-logo.mjs <출력.png>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out] = process.argv;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
const data = await p.evaluate(() => {
  const c = document.createElement("canvas"); c.width = 600; c.height = 400;
  const x = c.getContext("2d");
  x.fillStyle = "rgba(0,0,0,0.5)"; x.beginPath(); x.ellipse(310, 330, 170, 34, 0, 0, Math.PI * 2); x.fill(); // 반투명 그림자
  x.fillStyle = "#C45C2C"; x.beginPath(); x.arc(300, 180, 140, 0, Math.PI * 2); x.fill(); // 가장자리 안티앨리어싱
  x.fillStyle = "#FAFAFA"; x.font = "900 150px sans-serif"; x.textAlign = "center"; x.textBaseline = "middle";
  x.fillText("05", 300, 190);
  return c.toDataURL("image/png");
});
fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
await b.close();
