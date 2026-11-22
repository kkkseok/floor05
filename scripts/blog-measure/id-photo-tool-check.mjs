/**
 * 블로그 실측 검증(id-photo-size-guide): 빌드된 사이트의 실제 이미지 크롭 도구에 사진을 넣고
 * 증명사진 프리셋(여권 3.5×4.5, 증명사진 3×4)과 직접 입력한 137×177 출력의 다운로드 바이트 수를
 * 출력한다. id-photo-size.mjs의 jpgByQuality["0.92"]와 바이트 단위로 같은지 대조하는 용도다.
 * 사용: npx next start -p <포트> & → node scripts/blog-measure/id-photo-tool-check.mjs <포트> <사진.jpg>
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , port, photo] = process.argv;
if (!port || !photo) throw new Error("사용: node scripts/blog-measure/id-photo-tool-check.mjs <포트> <사진.jpg>");
const b = await chromium.launch();
const page = await b.newPage({ viewport: { width: 1280, height: 1000 } });
await page.goto(`http://127.0.0.1:${port}/tools/image/crop`, { waitUntil: "networkidle" });
// FileDropzone은 input을 동적으로 만든다 → filechooser 이벤트로 넣는다
const chooser = page.waitForEvent("filechooser");
await page.getByText("파일을 드래그하거나").first().click();
await (await chooser).setFiles([photo]);

const out = {};
const run = async (key) => {
  await page.getByRole("button", { name: "이미지 크롭", exact: true }).click();
  await page.getByText(/크롭 완료/).waitFor({ timeout: 120000 });
  await page.waitForTimeout(1000);
  const [download] = await Promise.all([
    page.waitForEvent("download"),
    page.getByRole("button", { name: "다운로드" }).click(),
  ]);
  out[key] = { file: download.suggestedFilename(), bytes: fs.statSync(await download.path()).size };
};

await page.getByRole("button", { name: "여권 3.5×4.5" }).click();
await run("413x531");
await page.getByRole("button", { name: "증명사진 3×4" }).click();
await run("354x472");
// 137×177은 프리셋이 없어 '정확한 크기로 출력' 칸에 직접 넣는다(프리셋 선택으로 칸이 이미 열려 있음)
await page.getByLabel("출력 너비(px)").fill("137");
await page.getByLabel("출력 높이(px)").fill("177");
await run("137x177");

console.log(JSON.stringify({ browser: b.version(), out }, null, 1));
await b.close();
