/**
 * 블로그 실측 검증(passport-photo-size): 빌드된 사이트의 실제 이미지 크롭 도구에 사진을 넣고
 * '여권 3.5×4.5' 프리셋으로 내려받은 파일의 이름·바이트 수·픽셀 크기를 출력한다.
 * passport-size.mjs의 preset.jpgBytes와 바이트 단위로 같은지 대조하는 용도다.
 * 사용: npx next start -p <포트> & → node scripts/blog-measure/passport-tool-check.mjs <포트> <사진.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , port, photo] = process.argv;
if (!port || !photo) throw new Error("사용: node scripts/blog-measure/passport-tool-check.mjs <포트> <사진.jpg>");
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await page.goto(`http://127.0.0.1:${port}/tools/image/crop`, { waitUntil: "networkidle" });
// FileDropzone은 input을 동적으로 만든다 → filechooser 이벤트로 넣는다
const chooser = page.waitForEvent("filechooser");
await page.getByText("파일을 드래그하거나").first().click();
await (await chooser).setFiles([photo]);
await page.getByRole("button", { name: "여권 3.5×4.5" }).click();
await page.getByRole("button", { name: /이미지 크롭$/ }).click();
const done = page.getByText(/크롭 완료/);
await done.waitFor({ timeout: 120000 });
const doneText = (await done.textContent())?.trim();
const [download] = await Promise.all([
  page.waitForEvent("download"),
  page.getByRole("button", { name: "다운로드" }).click(),
]);
const p = await download.path();
console.log(
  JSON.stringify({ browser: `Playwright Chromium ${b.version()}`, file: download.suggestedFilename(), bytes: fs.statSync(p).size, doneText }, null, 1),
);
await b.close();
