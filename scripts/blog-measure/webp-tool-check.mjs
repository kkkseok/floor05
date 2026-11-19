/**
 * 블로그 실측용(webp-guide): 실제 포맷 변환 도구 화면에서 내려받은 파일이 webp-when.mjs 수치와
 * 바이트 단위로 같은지 확인하고, 세로 16384px 이미지를 WebP로 바꿀 때 화면에 무엇이 나오는지 기록한다.
 * 사용: (저장소 루트에서, 빌드된 사이트를 띄운 뒤)
 *   node scripts/blog-measure/webp-tool-check.mjs <출력.json> <작업폴더> <사이트 주소> <파일@형식@품질>...
 *   형식은 WebP 또는 JPG, 품질은 1~100. 파일 이름이 tall:<높이>면 작업폴더의 capture-mobile.png를 이어 붙여 만든다.
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , outJson, workDir, base, ...specs] = process.argv;
const b = await chromium.launch({ args: ["--disable-lcd-text"] });
const rows = [];
for (const spec of specs) {
  let [file, format, quality] = spec.split("@");
  const page = await b.newPage({ acceptDownloads: true });
  page.setDefaultTimeout(120_000);
  if (file.startsWith("tall:")) {
    const h = Number(file.slice(5));
    const target = path.join(workDir, `tall-1080x${h}.png`);
    if (!fs.existsSync(target)) {
      await page.setContent("<html></html>");
      const b64 = await page.evaluate(async ({ src, h }) => {
        const img = await new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = src; });
        const c = document.createElement("canvas"); c.width = img.width; c.height = h;
        const x = c.getContext("2d"); for (let y = 0; y < h; y += img.height) x.drawImage(img, 0, y);
        return c.toDataURL("image/png").split(",")[1];
      }, { src: `data:image/png;base64,${fs.readFileSync(path.join(workDir, "capture-mobile.png")).toString("base64")}`, h });
      fs.writeFileSync(target, Buffer.from(b64, "base64"));
    }
    file = target;
  }
  await page.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
  const chooser = page.waitForEvent("filechooser");
  await page.getByText("파일을 드래그하거나").first().click();
  await (await chooser).setFiles([file]);
  await page.getByRole("button", { name: format, exact: true }).click();
  // 품질 슬라이더(React 제어 입력)를 값으로 직접 맞춘다
  await page.locator('input[type="range"]').evaluate((el, v) => {
    Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, "value").set.call(el, String(v));
    el.dispatchEvent(new Event("input", { bubbles: true }));
    el.dispatchEvent(new Event("change", { bubbles: true }));
  }, Number(quality));
  const shown = await page.locator('input[type="range"]').inputValue();
  await page.getByRole("button", { name: new RegExp(`1개 이미지 ${format}로 변환`) }).click();
  const row = { file: path.basename(file), inputBytes: fs.statSync(file).size, format, quality: Number(shown) };
  const dl = page.getByRole("button", { name: "다운로드" });
  const failed = page.getByText("실패", { exact: true });
  await Promise.race([dl.waitFor({ state: "visible" }), failed.first().waitFor({ state: "visible" })]).catch(() => {});
  if (await dl.isVisible()) {
    const dp = page.waitForEvent("download");
    await dl.click();
    const d = await dp;
    const saved = path.join(workDir, `tool-${rows.length}-${d.suggestedFilename()}`);
    await d.saveAs(saved);
    const buf = fs.readFileSync(saved);
    row.downloadName = d.suggestedFilename();
    row.bytes = buf.length;
    row.magic = buf.toString("latin1", 0, 4) === "RIFF" ? `RIFF/${buf.toString("latin1", 8, 16)}` : buf[0] === 0xff ? "JPEG" : buf.toString("latin1", 1, 4);
  } else {
    row.failed = true;
    row.screenText = (await page.locator("main").innerText()).split("\n").filter((l) => /못했|지원하지|실패|다시/.test(l)).slice(0, 6);
    await page.screenshot({ path: path.join(workDir, `tool-fail-${rows.length}.png`) });
  }
  rows.push(row);
  console.log(JSON.stringify(row));
  await page.close();
}
fs.writeFileSync(outJson, JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), rows }, null, 1));
await b.close();
