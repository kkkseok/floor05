/**
 * src/lib/image/downscale.ts를 esbuild로 묶어 각 브라우저에 넣고, 워커(OffscreenCanvas)에서 동작하는지와
 * drawImageDownscaled 결과를 PNG로 저장한다. 메인 스레드와 워커(OffscreenCanvas) 양쪽에서 확인한다.
 * 사용: npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>
 *       node scripts/blog-measure/downscale-helper-check.mjs <helper.js> <출력폴더> <이름=이미지:폭,폭>...
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , helperPath, outDir, ...specs] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const helper = fs.readFileSync(helperPath, "utf8");
const jobs = specs.map((s) => {
  const [name, rest] = s.split("="); const i = rest.lastIndexOf(":"); const file = rest.slice(0, i);
  return { name, url: `data:${file.endsWith(".png") ? "image/png" : "image/jpeg"};base64,${fs.readFileSync(file).toString("base64")}`, widths: rest.slice(i + 1).split(",").map(Number) };
});
const summary = {};
for (const [ename, engine] of [["chromium", chromium], ["firefox", firefox], ["webkit", webkit]]) {
  const b = await engine.launch(); const p = await b.newPage(); await p.setContent("<html></html>");
  await p.addScriptTag({ content: helper });
  const honoredMain = "n/a";
  const honoredWorker = await p.evaluate(async (src) => {
    const blob = new Blob([src + ";onmessage=()=>{const c=new OffscreenCanvas(8,8);DS.drawImageDownscaled(c.getContext(\"2d\"),new OffscreenCanvas(64,64),0,0,64,64,0,0,8,8);postMessage(\"worker-ok\")};"], { type: "text/javascript" });
    const w = new Worker(URL.createObjectURL(blob));
    return await new Promise((ok) => { w.onmessage = (e) => ok(e.data); w.onerror = () => ok("worker-error"); w.postMessage(0); });
  }, helper);
  summary[ename] = { version: b.version(), honoredMain, honoredWorker };
  for (const job of jobs) {
    const files = await p.evaluate(async ({ url, widths }) => {
      const bmp = await createImageBitmap(await (await fetch(url)).blob());
      const out = {};
      for (const tw of widths) {
        const th = Math.round(bmp.height * tw / bmp.width);
        const c = document.createElement("canvas"); c.width = tw; c.height = th;
        DS.drawImageDownscaled(c.getContext("2d"), bmp, 0, 0, bmp.width, bmp.height, 0, 0, tw, th);
        out[`helper-${tw}`] = c.toDataURL("image/png");
      }
      return out;
    }, job);
    for (const [k, v] of Object.entries(files)) fs.writeFileSync(path.join(outDir, `${ename}-${job.name}-${k}.png`), Buffer.from(v.split(",")[1], "base64"));
  }
  console.log(ename, JSON.stringify(summary[ename]));
  await b.close();
}
fs.writeFileSync(path.join(outDir, "summary.json"), JSON.stringify(summary, null, 2));
