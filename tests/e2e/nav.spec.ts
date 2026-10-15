/**
 * 페이지 접근성·내부 링크·기본 동작 스모크
 * - 전 라우트 200 + h1 + canonical + 콘솔 오류 없음
 * - 404, 리다이렉트, 모바일 가로 스크롤
 */
import { test, expect } from "@playwright/test";
import { installGuards, assertClean, assertNoHorizontalScroll } from "./helpers";

const TOOL_ROUTES = [
  "/tools/image/compress", "/tools/image/resize", "/tools/image/convert",
  "/tools/image/heic-to-jpg",
  "/tools/image/crop", "/tools/image/merge", "/tools/image/watermark",
  "/tools/image/rotate", "/tools/image/mosaic", "/tools/image/grid",
  "/tools/image/color-picker", "/tools/image/exif-remove", "/tools/image/favicon",
  "/tools/text/counter",
  "/tools/calc/salary", "/tools/calc/severance", "/tools/calc/wage",
  "/tools/pdf/image-to-pdf", "/tools/pdf/merge", "/tools/pdf/split",
];

const HUB_ROUTES = [
  "/tools/image", "/tools/calc", "/tools/pdf",
];

const STATIC_ROUTES = ["/", "/about", "/contact", "/privacy", "/terms", "/blog"];

const BLOG_SAMPLE = [
  "/blog/image-compression-guide",
  "/blog/salary-net-pay-guide",
  "/blog/severance-pay-guide",
  "/blog/heic-to-jpg-guide",
  "/blog/exif-removal-guide",
];

test.describe("라우트 접근", () => {
  test("도구 20개 전부 200 + h1 + canonical", async ({ page }) => {
    test.setTimeout(180_000);
    const guards = await installGuards(page);
    for (const route of TOOL_ROUTES) {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      await expect(page.locator("h1"), route).toBeVisible();
      const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
      expect(canonical, `${route} canonical`).toBe(`https://www.floor05.com${route}`);
    }
    assertClean(guards);
  });

  test("허브 8개 + 정적 페이지 200", async ({ page }) => {
    test.setTimeout(120_000);
    const guards = await installGuards(page);
    for (const route of [...HUB_ROUTES, ...STATIC_ROUTES]) {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      await expect(page.locator("h1").first(), route).toBeVisible();
    }
    assertClean(guards);
  });

  test("블로그 샘플 5편 렌더 + 본문 스타일 적용(무스타일 prose 회귀 방지)", async ({ page }) => {
    test.setTimeout(120_000);
    const guards = await installGuards(page);
    for (const route of BLOG_SAMPLE) {
      const res = await page.goto(route);
      expect(res?.status(), route).toBe(200);
      // h2가 기본 브라우저 스타일(무스타일)로 방치되지 않았는지: 최소한 마진 클래스 적용 여부
      const h2 = page.locator("article h2, main h2").first();
      await expect(h2, route).toBeVisible();
      const cls = (await h2.getAttribute("class")) || "";
      expect(cls.length, `${route} h2에 유틸리티 클래스 없음(무스타일 의심)`).toBeGreaterThan(0);
    }
    assertClean(guards);
  });

  test("존재하지 않는 경로는 404", async ({ page }) => {
    const res = await page.goto("/tools/definitely-not-here");
    expect(res?.status()).toBe(404);
  });

  test("범위 정리: 변환쌍·금융 계산기는 301, 대체 없는 도구는 404", async ({ request }) => {
    for (const [from, to] of [
      ["/tools/image/jpg-to-png", "/tools/image/convert"],
      ["/tools/image/webp-to-jpg", "/tools/image/convert"],
      ["/tools/calc/loan", "/tools/calc"],
      ["/tools/calc/savings", "/tools/calc"],
      ["/tools/calc/vat", "/tools/calc"],
    ]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308], from).toContain(res.status());
      expect(res.headers()["location"], from).toContain(to);
    }
    for (const gone of ["/tools/health/bmi", "/tools/random/ladder", "/blog/bmi-obesity-guide"]) {
      expect((await request.get(gone)).status(), gone).toBe(404);
    }
  });

  test("리다이렉트: /tools/image/heic → /tools/image/heic-to-jpg", async ({ page }) => {
    await page.goto("/tools/image/heic");
    await expect(page).toHaveURL(/\/tools\/image\/heic-to-jpg$/);
  });

  test("메인 페이지: 도구 링크 노출 + 광고 없음(브랜드 보호 규칙)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/");
    // 등록된 도구가 메인에 노출
    await expect(page.getByRole("link", { name: /이미지 압축/ }).first()).toBeVisible();
    // 메인 페이지에는 광고 슬롯 금지
    expect(await page.locator("ins.adsbygoogle").count()).toBe(0);
    assertClean(guards);
  });

  test("헤더 내비게이션 링크가 모두 유효한 라우트", async ({ page }) => {
    await page.goto("/");
    const hrefs = await page.locator("header a[href^='/']").evaluateAll((els) =>
      els.map((e) => e.getAttribute("href")!),
    );
    const valid = new Set([...TOOL_ROUTES, ...HUB_ROUTES, ...STATIC_ROUTES, "/blog"]);
    for (const href of hrefs) {
      const clean = href.split("?")[0].split("#")[0];
      expect(valid.has(clean) || clean === "/", `헤더 링크 ${href}`).toBe(true);
    }
  });

  test("모바일: 대표 페이지 가로 스크롤 없음", async ({ page }, testInfo) => {
    test.skip(!testInfo.project.name.includes("mobile"), "모바일 프로젝트 전용");
    for (const route of ["/", "/tools/image/compress", "/tools/calc/salary", "/tools/pdf/merge", "/blog/image-compression-guide"]) {
      await page.goto(route);
      await assertNoHorizontalScroll(page);
    }
  });

  test("Google CMP: 푸터에서 개인정보·쿠키 설정을 다시 연다", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/privacy");
    // 외부 AdSense 스크립트가 없는 로컬 테스트에서 CMP API 준비 상태를 모의한다.
    await page.evaluate(() => {
      window.googlefc = {
        callbackQueue: [],
        showRevocationMessage: () => {
          document.documentElement.dataset.cmpOpened = "true";
        },
      };
    });
    await page.getByRole("button", { name: "개인정보 및 쿠키 동의 설정 열기" }).first().click();
    await expect(page.locator("html")).toHaveAttribute("data-cmp-opened", "true");
    assertClean(guards);
  });

  test("AdSense: 정책 페이지에서는 광고 태그를 제외한다", async ({ page }) => {
    const guards = await installGuards(page);
    const adScript = 'script[src*="pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]';

    for (const route of ["/privacy", "/terms"]) {
      await page.goto(route);
      await expect(page.locator(adScript), `${route} 광고 태그`).toHaveCount(0);
      await expect(page.locator('meta[name="google-adsense-account"]')).toHaveCount(1);
    }

    await page.goto("/tools/calc/salary");
    await expect(page.locator(adScript), "일반 도구 페이지 광고 태그").toHaveCount(1);
    assertClean(guards);
  });

  test("급여 계산 신뢰 정보: 공식 출처와 검토일 표시", async ({ page }) => {
    await page.goto("/tools/calc/salary");
    await expect(page.getByRole("heading", { name: "계산 기준·출처" })).toBeVisible();
    await expect(page.getByRole("link", { name: /국민연금/ })).toHaveAttribute("href", /nps\.or\.kr/);

    await page.goto("/blog/salary-net-pay-guide");
    await expect(page.getByText("작성·검토:")).toBeVisible();
    await expect(page.getByRole("link", { name: "floor05 팀" })).toHaveAttribute("href", "/about#team");
  });
});
