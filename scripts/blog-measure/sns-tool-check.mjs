/**
 * 블로그 실측 검증(sns-image-size): 빌드된 사이트의 실제 이미지 리사이즈 도구에 사진을 넣고
 * SNS 프리셋별 다운로드 파일의 바이트 수를 출력한다. sns-size.mjs의 측정값(같은 크기의 jpgBytes)과
 * 바이트 단위로 같은지 대조하는 용도다.
 * 사용: npx next start -p <포트> & → node scripts/blog-measure/sns-tool-check.mjs <포트> <사진.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , port, photo] = process.argv;
if (!port || !photo) throw new Error("사용: node scripts/blog-measure/sns-tool-check.mjs <포트> <사진.jpg>");
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await page.goto(`http://127.0.0.1:${port}/tools/image/resize`, { waitUntil: "networkidle" });
// FileDropzone은 input을 동적으로 만든다 → filechooser 이벤트로 넣는다
const chooser = page.waitForEvent("filechooser");
await page.getByText("파일을 드래그하거나").first().click();
await (await chooser).setFiles([photo]);
await page.getByRole("button", { name: "SNS 프리셋" }).click();
const out = {};
for (const name of ["정방형", "세로형", "가로형", "썸네일", "채널 아트"]) {
  await page.getByRole("button", { name: new RegExp(`^${name}`) }).click();
  await page.getByRole("button", { name: /이미지 리사이즈$|다시 리사이즈$/ }).click();
  await page.getByText("이미지 리사이즈 완료").waitFor({ timeout: 120000 });
  await page.waitForTimeout(1500);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "다운로드" }).click(),
  ]);
  const p = await download.path();
  out[name] = { file: download.suggestedFilename(), bytes: fs.statSync(p).size };
}
console.log(JSON.stringify({ browser: b.version(), out }, null, 1));
await b.close();
