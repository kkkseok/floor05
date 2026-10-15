/**
 * 블로그·수정 근거용: 사진과 로고를 여러 비율로 줄일 때 "한 번에 축소(high)" vs "절반씩 단계 축소"를
 * Chromium·Firefox·WebKit에서 PNG로 저장한다. PSNR은 favicon-psnr.py와 같은 방식(downscale-psnr.py)으로 잰다.
 * 사용: node scripts/blog-measure/downscale-ratios.mjs <출력폴더> <이름=이미지:목표폭,목표폭...>...
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , outDir, ...specs] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const jobs = specs.map((s) => {
  const [name, rest] = s.split("=");
  const i = rest.lastIndexOf(":");
  const file = rest.slice(0, i);
  const mime = file.endsWith(".png") ? "image/png" : "image/jpeg";
  return { name, url: `data:${mime};base64,${fs.readFileSync(file).toString("base64")}`, widths: rest.slice(i + 1).split(",").map(Number) };
});
for (const [ename, engine, opts] of [["chromium", chromium, {}], ["firefox", firefox, {}], ["webkit", webkit, {}]]) {
  const b = await engine.launch(opts); const p = await b.newPage(); await p.setContent("<html></html>");
  for (const job of jobs) {
    const files = await p.evaluate(async ({ url, widths }) => {
      const bmp = await createImageBitmap(await (await fetch(url)).blob());
      const out = {};
      for (const tw of widths) {
        const th = Math.round(bmp.height * tw / bmp.width);
        const one = document.createElement("canvas"); one.width = tw; one.height = th;
        const o = one.getContext("2d"); o.imageSmoothingEnabled = true; o.imageSmoothingQuality = "high"; o.drawImage(bmp, 0, 0, tw, th);
        let src = bmp, w = bmp.width, h = bmp.height;
        while (w / 2 >= tw * 2 && h / 2 >= th * 2) {
          const nw = Math.round(w / 2), nh = Math.round(h / 2);
          const c = document.createElement("canvas"); c.width = nw; c.height = nh;
          const x = c.getContext("2d"); x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high"; x.drawImage(src, 0, 0, w, h, 0, 0, nw, nh);
          src = c; w = nw; h = nh;
        }
        const st = document.createElement("canvas"); st.width = tw; st.height = th;
        const s = st.getContext("2d"); s.imageSmoothingEnabled = true; s.imageSmoothingQuality = "high"; s.drawImage(src, 0, 0, w, h, 0, 0, tw, th);
        out[`single-${tw}`] = one.toDataURL("image/png");
        out[`steps-${tw}`] = st.toDataURL("image/png");
      }
      return out;
    }, job);
    for (const [k, v] of Object.entries(files)) fs.writeFileSync(path.join(outDir, `${ename}-${job.name}-${k}.png`), Buffer.from(v.split(",")[1], "base64"));
  }
  console.log(ename, b.version());
  await b.close();
}
