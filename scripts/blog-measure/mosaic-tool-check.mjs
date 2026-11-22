/**
 * 블로그 실측 검증용(photo-mosaic-guide): mosaic-legibility.mjs 가 옮겨 쓴 그리기 경로가 실제 도구와 같은지 확인한다.
 * 빌드된 사이트의 /tools/image/mosaic 에 시험용 PNG를 올리고, 강도·방식을 고른 뒤 드래그해 내려받은 PNG를
 * 같은 영역으로 스크립트가 계산한 결과와 픽셀 단위로 비교한다(PNG라 손실 없음. 다른 픽셀 0개여야 통과).
 * 영역은 도구의 onPointerUp과 같은 식(캔버스 getBoundingClientRect 기준 환산 후 반올림)으로 구한다.
 *
 * 사용: npx next start -p <포트> & → node scripts/blog-measure/mosaic-tool-check.mjs <http://127.0.0.1:포트> <출력.json> <임시폴더>
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , base, out, tmp] = process.argv;
if (!base || !out || !tmp) throw new Error("사용: node scripts/blog-measure/mosaic-tool-check.mjs <base URL> <출력.json> <임시폴더>");
fs.mkdirSync(tmp, { recursive: true });

const b = await chromium.launch({ args: ["--disable-lcd-text"] });
const ctx = await b.newContext({ viewport: { width: 1280, height: 900 }, acceptDownloads: true });
const lab = await ctx.newPage();
await lab.setContent("<html><body></body></html>");

// 시험용 그림: 흰 바탕에 숫자·한글 한 줄 (숫자 글꼴 크기는 가로의 2.75%)
async function makePng(width) {
  const url = await lab.evaluate((W) => {
    const c = document.createElement("canvas");
    c.width = W; c.height = Math.round(W * 0.12);
    const x = c.getContext("2d");
    x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, c.width, c.height);
    x.fillStyle = "#111111"; x.font = `700 ${Math.round(W * 0.0275)}px "Malgun Gothic"`;
    x.fillText("0123456789 가나다라마", Math.round(W * 0.03), Math.round(c.height * 0.6));
    return c.toDataURL("image/png");
  }, width);
  const file = path.join(tmp, `check-${width}.png`);
  fs.writeFileSync(file, Buffer.from(url.split(",")[1], "base64"));
  return file;
}

async function expectedVsDownload(srcFile, dlFile, region) {
  const toUrl = (f) => `data:image/png;base64,${fs.readFileSync(f).toString("base64")}`;
  return lab.evaluate(async ({ src, dl, region }) => {
    const MAX_DIM = 2000;
    // MosaicTool.tsx applyRegion 그대로
    function applyRegion(target, r, scale) {
      const ctx = target.getContext("2d");
      const x = Math.round(r.x * scale);
      const y = Math.round(r.y * scale);
      const w = Math.max(1, Math.min(target.width - x, Math.round(r.w * scale)));
      const h = Math.max(1, Math.min(target.height - y, Math.round(r.h * scale)));
      const bs = Math.max(2, r.block * scale);
      const tw = Math.max(1, Math.round(w / bs));
      const th = Math.max(1, Math.round(h / bs));
      const tmp = document.createElement("canvas");
      tmp.width = tw; tmp.height = th;
      const tctx = tmp.getContext("2d");
      tctx.imageSmoothingEnabled = r.mode === "blur";
      tctx.drawImage(target, x, y, w, h, 0, 0, tw, th);
      ctx.imageSmoothingEnabled = r.mode === "blur";
      ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
      ctx.imageSmoothingEnabled = true;
    }
    const bitmap = async (u) => createImageBitmap(await (await fetch(u)).blob(), { imageOrientation: "from-image" });
    const bmp = await bitmap(src);
    const edit = document.createElement("canvas");
    const s = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    edit.width = Math.round(bmp.width * s); edit.height = Math.round(bmp.height * s);
    edit.getContext("2d").drawImage(bmp, 0, 0, edit.width, edit.height);
    applyRegion(edit, region, 1);
    let full = edit;
    if (!(bmp.width === edit.width && bmp.height === edit.height)) {
      full = document.createElement("canvas");
      full.width = bmp.width; full.height = bmp.height;
      full.getContext("2d").drawImage(bmp, 0, 0);
      applyRegion(full, region, bmp.width / edit.width);
    }
    const got = await bitmap(dl);
    const g = document.createElement("canvas");
    g.width = got.width; g.height = got.height;
    g.getContext("2d").drawImage(got, 0, 0);
    if (g.width !== full.width || g.height !== full.height) return { sameSize: false, download: `${g.width}x${g.height}`, expected: `${full.width}x${full.height}` };
    const a = full.getContext("2d").getImageData(0, 0, full.width, full.height).data;
    const d = g.getContext("2d").getImageData(0, 0, g.width, g.height).data;
    let differ = 0;
    for (let i = 0; i < a.length; i += 4) if (a[i] !== d[i] || a[i + 1] !== d[i + 1] || a[i + 2] !== d[i + 2] || a[i + 3] !== d[i + 3]) differ++;
    return { sameSize: true, size: `${g.width}x${g.height}`, pixels: a.length / 4, differingPixels: differ };
  }, { src: toUrl(srcFile), dl: toUrl(dlFile), region });
}

const rows = [];
for (const width of [1600, 4000]) {
  const src = await makePng(width);
  for (const mode of ["mosaic", "blur"]) for (const strength of [12, 40]) {
    const page = await ctx.newPage();
    await page.goto(`${base}/tools/image/mosaic`, { waitUntil: "networkidle" });
    const chooser = page.waitForEvent("filechooser");
    await page.getByText("파일을 드래그하거나").first().click();
    await (await chooser).setFiles([src]);
    const canvas = page.locator("main canvas").first();
    await canvas.waitFor({ state: "visible", timeout: 15000 });
    if (mode === "blur") await page.getByRole("button", { name: "블러", exact: true }).click();
    await page.getByLabel("모자이크 강도").fill(String(strength));
    await canvas.scrollIntoViewIfNeeded();
    const geo = await canvas.evaluate((c) => { const r = c.getBoundingClientRect(); return { left: r.left, top: r.top, width: r.width, height: r.height, cw: c.width, ch: c.height }; });
    const x0 = Math.round(geo.left + geo.width * 0.02), y0 = Math.round(geo.top + geo.height * 0.15);
    const x1 = Math.round(geo.left + geo.width * 0.55), y1 = Math.round(geo.top + geo.height * 0.9);
    await page.mouse.move(x0, y0);
    await page.mouse.down();
    await page.mouse.move(x1, y1, { steps: 6 });
    await page.mouse.up();
    await page.getByText(/1곳 적용됨/).waitFor({ timeout: 5000 });
    // 도구의 toCanvas → onPointerUp 과 같은 계산
    const sx = geo.cw / geo.width, sy = geo.ch / geo.height;
    const p0 = { x: (x0 - geo.left) * sx, y: (y0 - geo.top) * sy }, p1 = { x: (x1 - geo.left) * sx, y: (y1 - geo.top) * sy };
    const rx = Math.max(0, Math.min(p0.x, p1.x)), ry = Math.max(0, Math.min(p0.y, p1.y));
    const region = {
      x: Math.round(rx), y: Math.round(ry),
      w: Math.round(Math.min(geo.cw - rx, Math.abs(p1.x - p0.x))), h: Math.round(Math.min(geo.ch - ry, Math.abs(p1.y - p0.y))),
      mode, block: Math.max(2, strength),
    };
    const dl = page.waitForEvent("download");
    await page.getByRole("button", { name: /다운로드/ }).first().click();
    const file = path.join(tmp, `dl-${width}-${mode}-${strength}.png`);
    await (await dl).saveAs(file);
    const cmp = await expectedVsDownload(src, file, region);
    rows.push({ width, mode, strength, editCanvas: `${geo.cw}x${geo.ch}`, region, ...cmp });
    console.log(width, mode, strength, JSON.stringify(region), JSON.stringify(cmp));
    await page.close();
  }
}
fs.writeFileSync(out, JSON.stringify({ browser: `Chromium ${b.version()}`, checkedAt: new Date().toISOString(), rows }, null, 2));
await b.close();
const bad = rows.filter((r) => !r.sameSize || r.differingPixels !== 0);
if (bad.length) { console.error(`불일치 ${bad.length}건`); process.exit(1); }
console.log("도구 다운로드와 스크립트 결과가 모든 경우에서 같음");
