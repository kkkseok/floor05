/**
 * 블로그 실측용(prevent-photo-theft): upload-size-restore.mjs가 만든 줄인 JPG가 실제 floor05 리사이즈 도구의
 * 다운로드와 바이트 단위로 같은지 확인한다(측정 경로 = 도구 경로 검증).
 * 사용: npm run build && npx next start -p 3133 &
 *       node scripts/blog-measure/upload-size-tool-check.mjs <사진.jpg> <결과폴더> <이름> <긴변,긴변...> [포트=3133]
 * 결과: 콘솔에 긴 변별 toolBytes / scriptBytes / identical, <결과폴더>/tool-check-<이름>.json. 다르면 exit 1
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , photo, outDir, name, longs, port = "3133"] = process.argv;
const browser = await chromium.launch();
const out = { browser: browser.version(), rows: [] };
for (const long of longs.split(",").map(Number)) {
  const page = await browser.newPage({ acceptDownloads: true });
  await page.goto(`http://127.0.0.1:${port}/tools/image/resize`, { waitUntil: "networkidle" });
  const chooser = page.waitForEvent("filechooser");
  await page.getByText("파일을 드래그하거나").first().click();
  await (await chooser).setFiles(photo);
  await page.locator("#resize-width").waitFor({ timeout: 60_000 });
  await page.locator("#resize-width").fill(String(long));
  await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
  const btn = page.getByRole("button", { name: "다운로드" });
  await btn.waitFor({ timeout: 120_000 });
  const [dl] = await Promise.all([page.waitForEvent("download"), btn.click()]);
  const saved = path.join(outDir, `tool-${name}-${long}.jpg`);
  await dl.saveAs(saved);
  const a = fs.readFileSync(saved);
  const b = fs.readFileSync(path.join(outDir, `${name}-${long}.jpg`));
  const row = { long, toolBytes: a.length, scriptBytes: b.length, identical: a.equals(b), downloadName: dl.suggestedFilename() };
  out.rows.push(row);
  console.log(JSON.stringify(row));
  await page.close();
}
await browser.close();
fs.writeFileSync(path.join(outDir, `tool-check-${name}.json`), JSON.stringify(out, null, 1));
if (out.rows.some((r) => !r.identical)) process.exit(1);
