/**
 * 블로그용 그림(sns-image-size): 같은 사진을 3:4, 16:9, 3:1로 가운데 잘라 맞춘 결과를 한 장에 나란히 놓는다.
 * 자르기·축소는 리사이즈 도구와 같은 식(computeCoverCrop + drawImageDownscaled 번들)을 쓴다.
 * 글자가 모바일에서 작아지지 않게 그림에는 번호만 넣고 설명은 본문 figcaption에 쓴다.
 * 사용: node scripts/blog-measure/sns-crop-tiles.mjs <helper.js> <사진.jpg> <출력.jpg>
 * 결과: 960×515 JPG (1 = 3:4, 2 = 16:9, 3 = 3:1)
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , helperPath, photo, out] = process.argv;
const url = `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`;
const b = await chromium.launch();
const p = await b.newPage();
await p.setContent("<html></html>");
await p.addScriptTag({ content: fs.readFileSync(helperPath, "utf8") });
const data = await p.evaluate(async (url) => {
  const bitmap = await createImageBitmap(await (await fetch(url)).blob(), { imageOrientation: "from-image" });
  const W = bitmap.width, H = bitmap.height;
  const c = document.createElement("canvas");
  c.width = 960;
  c.height = 515;
  const x = c.getContext("2d");
  x.fillStyle = "#FFFFFF";
  x.fillRect(0, 0, c.width, c.height);
  // [번호, dx, dy, dw, dh]
  const tiles = [
    ["1", 0, 0, 386, 515],
    ["2", 398, 0, 562, 316],
    ["3", 398, 328, 562, 187],
  ];
  for (const [label, dx, dy, dw, dh] of tiles) {
    const target = dw / dh;
    let sw = W, sh = H;
    if (W / H > target) sw = H * target; else sh = W / target;
    DS.drawImageDownscaled(x, bitmap, (W - sw) / 2, (H - sh) / 2, sw, sh, dx, dy, dw, dh);
    x.fillStyle = "rgba(10,10,10,0.78)";
    x.fillRect(dx + 12, dy + 12, 56, 56);
    x.fillStyle = "#FFFFFF";
    x.font = "700 38px sans-serif";
    x.textAlign = "center";
    x.textBaseline = "middle";
    x.fillText(label, dx + 40, dy + 42);
  }
  return c.toDataURL("image/jpeg", 0.85);
}, url);
fs.writeFileSync(out, Buffer.from(data.split(",")[1], "base64"));
await b.close();
