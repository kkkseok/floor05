/**
 * 블로그 실측용: 투명 로고를 floor05 도구 화면에 실제로 넣고(로컬 next start :3123) 결과 파일을 받는다.
 * 분석(투명·반투명 픽셀 비율, 알파 채널 유무)은 alpha-survival.py가 한다.
 * 사용: node scripts/blog-measure/alpha-survival.mjs <로고.png> <출력폴더>
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , logo, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
const BASE = "http://127.0.0.1:3123";
const b = await chromium.launch();

async function run(name, url, steps, files = [logo]) {
  const p = await b.newPage();
  try {
    await p.goto(BASE + url);
    const ch = p.waitForEvent("filechooser");
    await p.getByText("파일을 드래그하거나").first().click();
    await (await ch).setFiles(files);
    await p.waitForTimeout(800);
    const dl = p.waitForEvent("download", { timeout: 60000 });
    dl.catch(() => {}); // 단계에서 실패하면 다운로드 대기는 버린다
    await steps(p);
    const d = await dl;
    const out = path.join(outDir, `${name}__${d.suggestedFilename()}`);
    await d.saveAs(out);
    console.log(name, path.basename(out), fs.statSync(out).size);
  } catch (e) {
    console.log(name, "ERROR", String(e).split("\n")[0]);
  } finally {
    await p.close();
  }
}
const click = (p, role, name, exact = false) => p.getByRole(role, { name, exact }).first().click();

await run("01-convert-webp", "/tools/image/convert", async (p) => { await click(p, "button", "WebP", true); await click(p, "button", /1개 이미지 WebP로 변환/); await click(p, "button", "다운로드"); });
await run("02-convert-avif", "/tools/image/convert", async (p) => {
  if (await p.getByRole("button", { name: "AVIF", exact: true }).isDisabled()) throw new Error("AVIF 출력 미지원 브라우저(버튼 비활성)");
  await click(p, "button", "AVIF", true); await click(p, "button", /1개 이미지 AVIF로 변환/); await click(p, "button", "다운로드"); });
await run("03-convert-jpg", "/tools/image/convert", async (p) => { await click(p, "button", "JPG", true); await click(p, "button", /1개 이미지 JPG로 변환/); await click(p, "button", "다운로드"); });
await run("04-compress-quality", "/tools/image/compress", async (p) => { await click(p, "button", "1개 이미지 압축하기"); await click(p, "button", "다운로드"); });
await run("05-compress-target", "/tools/image/compress", async (p) => { await click(p, "button", "목표 용량"); await p.getByPlaceholder("직접 입력").fill("20"); await click(p, "button", "1개 이미지 압축하기"); await click(p, "button", "다운로드"); });
await run("06-resize", "/tools/image/resize", async (p) => { await p.locator("#resize-width").fill("300"); await click(p, "button", "1개 이미지 리사이즈"); await click(p, "button", "다운로드"); });
await run("07-crop", "/tools/image/crop", async (p) => { await click(p, "button", "이미지 크롭", true); await p.getByText(/크롭 완료/).waitFor(); await click(p, "button", "다운로드"); });
await run("08-rotate", "/tools/image/rotate", async (p) => { await click(p, "button", /오른쪽 90°/); await click(p, "button", "다운로드"); });
await run("09-merge", "/tools/image/merge", async (p) => { await click(p, "button", "2개 이미지 합치기"); await click(p, "button", "다운로드"); }, [logo, logo]);
await run("10-watermark", "/tools/image/watermark", async (p) => {
  await p.getByPlaceholder("예: © 내 이름, @아이디").fill("© floor05");
  await click(p, "button", "워터마크 적용", true);
  await click(p, "button", "다운로드");
});
await run("11-mosaic", "/tools/image/mosaic", async (p) => {
  // 로고 오른쪽 위 빈(투명) 영역만 칠해, 칠하지 않은 곳의 투명도가 남는지 본다
  const c = p.locator("main canvas").first(); await c.waitFor();
  const bx = (await c.boundingBox());
  await p.mouse.move(bx.x + bx.width * 0.8, bx.y + bx.height * 0.05); await p.mouse.down();
  await p.mouse.move(bx.x + bx.width * 0.95, bx.y + bx.height * 0.3, { steps: 6 }); await p.mouse.up();
  await click(p, "button", /다운로드/);
});
await b.close();
