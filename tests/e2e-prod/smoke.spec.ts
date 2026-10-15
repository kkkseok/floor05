/**
 * 프로덕션 smoke (비파괴 · 읽기 전용 + 브라우저 로컬 처리 1건)
 * - 부하 테스트·대량 요청·광고 클릭 금지
 * - 배포 전 코드와 다를 수 있으므로 미배포 수정에 의존하는 정밀 수치는 검증하지 않는다
 */
import { test, expect } from "@playwright/test";
import path from "path";
import fs from "fs";

const FIXTURES = path.join(__dirname, "..", "fixtures", "generated");

/** 파일 전송 감시 */
async function prep(page: import("@playwright/test").Page) {
  const uploads: string[] = [];
  page.on("request", (req) => {
    const size = req.postData()?.length ?? 0;
    if (size > 32_000) uploads.push(`${req.method()} ${req.url()} (${size}B)`);
  });
  return uploads;
}

test.describe("프로덕션 기본 접근", () => {
  test("주요 페이지 200 + h1", async ({ page }) => {
    test.setTimeout(120_000);
    await prep(page);
    for (const route of [
      "/",
      "/tools/image/compress",
      "/tools/calc/salary",
      "/tools/pdf/merge",
      "/tools/image/heic-to-jpg",
      "/blog",
      "/about",
      "/privacy",
    ]) {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      await expect(page.locator("h1").first(), route).toBeVisible();
    }
  });

  test("SEO 인프라: robots·sitemap·llms.txt", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toContain("floor05.com");

    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    const xml = await sitemap.text();
    expect(xml).toContain("https://www.floor05.com/tools/image/compress");
    expect(xml).toContain("https://www.floor05.com/blog");

    const llms = await request.get("/llms.txt");
    expect(llms.status()).toBe(200);
  });

  test("canonical: 도구 페이지가 자기 www URL을 가리킴", async ({ page }) => {
    await prep(page);
    await page.goto("/tools/calc/wage");
    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe("https://www.floor05.com/tools/calc/wage");
  });

  test("리다이렉트: non-www → www(308 영구) · /tools/image/heic → heic-to-jpg", async ({ request }) => {
    // apex → www 는 Vercel 도메인 레벨(redirectStatusCode=308)에서 처리 — 영구 리다이렉트여야 SEO 신호가 통합된다
    const naked = await request.get("https://floor05.com/tools/calc/wage", { maxRedirects: 0 });
    expect([301, 308]).toContain(naked.status());
    expect(naked.headers()["location"]).toContain("https://www.floor05.com/tools/calc/wage");

    const heic = await request.get("https://www.floor05.com/tools/image/heic", { maxRedirects: 0 });
    expect([301, 308]).toContain(heic.status());
    expect(heic.headers()["location"]).toContain("/tools/image/heic-to-jpg");
  });

  test("존재하지 않는 경로 404", async ({ request }) => {
    const res = await request.get("/tools/definitely-not-here");
    expect(res.status()).toBe(404);
  });

  test("광고 규칙: 메인 0개 · 도구 페이지 최대 2개 (코드가 배치한 슬롯 기준)", async ({ page }) => {
    // AdSense 자동광고(auto ads)가 런타임에 주입하는 ins는 data-ad-slot이 없다.
    // 코드(AdSlot)가 배치한 슬롯만 세어 프로젝트 규칙을 검증한다.
    // ⚠ 자동광고가 메인에 주입되는 것은 AdSense 대시보드에서 제외 설정 필요 (BASELINE 참조)
    await prep(page);
    await page.goto("/");
    expect(await page.locator("ins.adsbygoogle[data-ad-slot]").count()).toBe(0);
    await page.goto("/tools/image/compress");
    expect(await page.locator("ins.adsbygoogle[data-ad-slot]").count()).toBeLessThanOrEqual(2);
  });
});

test.describe("프로덕션 기능 smoke", () => {
  test("주휴수당 계산기: 2026 최저시급·주 40시간 → 82,560원 (실계산 검증)", async ({ page }) => {
    await prep(page);
    await page.goto("/tools/calc/wage");
    const main = page.locator("main");
    await expect(main.getByText("82,560").first()).toBeVisible();
    await expect(main.getByText("2,152,339").first()).toBeVisible();
  });

  test("범위 정리: 변환쌍·금융 계산기는 301, 건강 도구는 404", async ({ request }) => {
    for (const [from, to] of [
      ["/tools/image/jpg-to-png", "/tools/image/convert"],
      ["/tools/calc/vat", "/tools/calc"],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308], from).toContain(res.status());
      expect(res.headers()["location"], from).toContain(to);
    }
    expect((await request.get("/tools/health/bmi")).status()).toBe(404);
  });

  test("이미지 압축 1건: 다운로드 성공 + 파일 외부 전송 없음 (브라우저 로컬 처리)", async ({ page }, testInfo) => {
    test.setTimeout(90_000);
    const uploads = await prep(page);
    await page.goto("/tools/image/compress");

    const chooser = page.waitForEvent("filechooser");
    await page.getByText("파일을 드래그하거나").first().click();
    await (await chooser).setFiles(path.join(FIXTURES, "photo-1200x900.jpg"));

    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    const downloadPromise = page.waitForEvent("download", { timeout: 45_000 });
    await page.getByRole("button", { name: "다운로드" }).click();
    const download = await downloadPromise;
    const out = path.join(testInfo.outputPath(), download.suggestedFilename());
    fs.mkdirSync(path.dirname(out), { recursive: true });
    await download.saveAs(out);

    const bytes = fs.readFileSync(out);
    expect(bytes[0]).toBe(0xff); // JPEG SOI
    expect(bytes[1]).toBe(0xd8);
    expect(uploads, "파일 데이터가 서버로 전송되면 안 됨 (P0)").toEqual([]);
  });
});
