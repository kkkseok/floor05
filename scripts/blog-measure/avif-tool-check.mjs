/**
 * 블로그 실측용(avif-guide): 실제 포맷 변환 도구 화면에 AVIF 파일을 올려
 *  (1) AVIF 출력 버튼이 켜져 있는지(미지원 표시·안내 문구), (2) 파일이 받아들여지는지,
 *  (3) 내려받은 JPG·PNG가 avif-measure.mjs 수치와 바이트 단위로 같은지
 * 를 Chromium(Playwright)·Chrome·Edge(이 PC 설치본)·Firefox·WebKit에서 확인한다.
 * 사용: (저장소 루트에서, 빌드된 사이트를 띄운 뒤)
 *   node scripts/blog-measure/avif-tool-check.mjs <출력.json> <작업폴더> <사이트 주소> <파일@형식>...
 *   형식은 JPG·PNG·WebP. 품질은 도구 기본값(90%) 그대로 둔다.
 *   Chrome에서는 출력 포맷 영역을 <작업폴더>/panel-chrome.png로 캡처한다(글의 그림).
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit, firefox } from "@playwright/test";

const [, , outJson, workDir, base, ...specs] = process.argv;
const engines = [
  ["Chromium", chromium, { args: ["--disable-lcd-text"] }],
  ["Chrome", chromium, { channel: "chrome", args: ["--disable-lcd-text"] }],
  ["Edge", chromium, { channel: "msedge" }],
  ["Firefox", firefox, {}],
  ["WebKit", webkit, {}],
];
const result = { measuredAt: new Date().toISOString(), engines: {} };
for (const [name, engine, opt] of engines) {
  const b = await engine.launch(opt);
  const rows = [];
  for (const spec of specs) {
    const [file, format] = spec.split("@");
    const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 720, height: 1200 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    page.setDefaultTimeout(60_000);
    const row = { file: path.basename(file), inputBytes: fs.statSync(file).size, format };
    try {
      await page.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
      await page.waitForTimeout(800); // hydration 대기(WebKit)
      const chooser = page.waitForEvent("filechooser");
      await page.getByText("파일을 드래그하거나").first().click();
      await (await chooser).setFiles([file]);
      const listed = page.getByText("이미지 목록 (1개)");
      await listed.waitFor({ state: "visible", timeout: 15_000 }).catch(() => {});
      row.accepted = await listed.isVisible();
      if (!row.accepted) { row.screenText = (await page.locator("main").innerText()).split("\n").filter((l) => /지원하지|제외|열 수 없/.test(l)).slice(0, 4); rows.push(row); await ctx.close(); continue; }
      // 썸네일(원본 미리보기)이 실제로 그려졌는지
      row.thumbnailDecoded = await page.locator(`img[alt="${path.basename(file)}"]`).first().evaluate((el) => el.complete && el.naturalWidth > 0).catch(() => false);
      const avifBtn = page.getByRole("button", { name: /^AVIF/ });
      row.avifButton = { disabled: await avifBtn.isDisabled(), text: (await avifBtn.innerText()).replace(/\s+/g, " ") };
      const notice = page.getByText(/출력을 지원하지 않습니다/);
      row.avifNotice = (await notice.count()) ? (await notice.first().innerText()).replace(/\s+/g, " ") : null;
      if (name === "Chrome" && rows.length === 0) {
        await page.getByText("출력 포맷", { exact: true }).locator("xpath=..").screenshot({ path: path.join(workDir, "panel-chrome.png") });
      }
      await page.getByRole("button", { name: format, exact: true }).click();
      row.quality = Number(await page.locator('input[type="range"]').inputValue().catch(() => NaN));
      await page.getByRole("button", { name: new RegExp(`1개 이미지 ${format}로 변환`) }).click();
      const dl = page.getByRole("button", { name: "다운로드" });
      const failed = page.getByText("실패", { exact: true });
      await Promise.race([dl.waitFor({ state: "visible" }), failed.first().waitFor({ state: "visible" })]).catch(() => {});
      if (await dl.isVisible()) {
        const dp = page.waitForEvent("download");
        await dl.click();
        const d = await dp;
        const saved = path.join(workDir, `tool-${name}-${rows.length}-${d.suggestedFilename()}`);
        await d.saveAs(saved);
        const buf = fs.readFileSync(saved);
        row.downloadName = d.suggestedFilename();
        row.bytes = buf.length;
        row.magic = buf[0] === 0x89 ? "PNG" : buf[0] === 0xff ? "JPEG" : buf.toString("latin1", 0, 4) === "RIFF" ? "RIFF/WEBP" : buf.toString("latin1", 4, 12);
        row.resultMeta = (await page.locator("main").innerText()).split("\n").filter((l) => /^\d[\d.,]*\s?(B|KB|MB)$/.test(l.trim())).slice(0, 4); // 화면에 표시된 전·후 용량
      } else {
        row.failed = true;
        row.screenText = (await page.locator("main").innerText()).split("\n").filter((l) => /못했|지원하지|실패|다시/.test(l)).slice(0, 6);
      }
    } catch (e) { row.error = String(e && e.message || e).slice(0, 300); }
    rows.push(row);
    console.log(name, JSON.stringify(row));
    await ctx.close();
  }
  result.engines[name] = { version: b.version(), rows };
  await b.close();
}
fs.writeFileSync(outJson, JSON.stringify(result, null, 1));
