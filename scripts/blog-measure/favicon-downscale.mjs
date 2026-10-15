/**
 * 블로그 실측용: 큰 로고를 파비콘 크기(16·32·48·180)로 줄이는 세 가지 방식을 브라우저별로 저장한다.
 *  M1 floor05 기존 방식 — drawImage 한 번, imageSmoothingQuality 기본값
 *  M2 drawImage 한 번, imageSmoothingQuality="high"
 *  M3 절반씩 단계 축소("high") 후 마지막 한 번
 * 화질 비교(Pillow 면적 평균 축소 기준 PSNR)는 favicon-psnr.py가 한다.
 * 사용: node scripts/blog-measure/favicon-downscale.mjs <로고.png> <출력폴더>
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , logo, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const url = `data:image/png;base64,${fs.readFileSync(logo).toString("base64")}`;
for (const [name, engine, opts] of [["chromium", chromium, { channel: "chromium" }], ["firefox", firefox, {}], ["webkit", webkit, {}]]) {
  const b = await engine.launch(opts); const p = await b.newPage(); await p.setContent("<html></html>");
  const files = await p.evaluate(async (url) => {
    const bmp = await createImageBitmap(await (await fetch(url)).blob());
    const out = {};
    const toPng = (c) => c.toDataURL("image/png");
    const one = (size, quality) => {
      const c = document.createElement("canvas"); c.width = size; c.height = size; const x = c.getContext("2d");
      if (quality) x.imageSmoothingQuality = quality;
      x.drawImage(bmp, 0, 0, bmp.width, bmp.height, 0, 0, size, size); return c;
    };
    const steps = (size) => {
      let src = bmp, w = bmp.width;
      while (w / 2 >= size * 2) {
        w = Math.round(w / 2);
        const c = document.createElement("canvas"); c.width = w; c.height = w; const x = c.getContext("2d");
        x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, w, w); src = c;
      }
      const c = document.createElement("canvas"); c.width = size; c.height = size; const x = c.getContext("2d");
      x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, size, size); return c;
    };
    for (const size of [16, 32, 48, 180]) {
      out[`M1-${size}`] = toPng(one(size, null));
      out[`M2-${size}`] = toPng(one(size, "high"));
      out[`M3-${size}`] = toPng(steps(size));
    }
    return out;
  }, url);
  for (const [k, v] of Object.entries(files)) fs.writeFileSync(path.join(outDir, `${name}-${k}.png`), Buffer.from(v.split(",")[1], "base64"));
  console.log(name, b.version(), Object.keys(files).length, "files");
  await b.close();
}
