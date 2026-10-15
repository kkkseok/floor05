/**
 * 계산기 6종 E2E — 화면에 표시되는 결과값을 독립 산출 golden value와 대조
 * (unit 테스트와 같은 수치를 사용하되, 여기서는 실제 UI 렌더 값을 검증)
 */
import { test, expect } from "@playwright/test";
import { installGuards, assertClean, fillStable } from "./helpers";

test.describe("연봉 실수령액", () => {
  test("연봉 5,000만 → 월 실수령 3,533,147원 + 공제 내역", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/salary");
    await fillStable(page.getByLabel("연봉(만원)"), "5000");

    const main = page.locator("main");
    await expect(main.getByText("3,533,147")).toBeVisible();
    await expect(main.getByText("188,410")).toBeVisible(); // 국민연금
    await expect(main.getByText("142,600")).toBeVisible(); // 건강보험
    await expect(main.getByText("18,730")).toBeVisible(); // 장기요양
    await expect(main.getByText("35,700")).toBeVisible(); // 고용보험 (floor10 FP 수정 검증)
    await expect(main.getByText("225,530")).toBeVisible(); // 근로소득세
    await expect(main.getByText("22,550")).toBeVisible(); // 지방소득세
    assertClean(guards);
  });

  test("연봉 3억 → 국민연금 상한(313,020원) 적용", async ({ page }) => {
    await page.goto("/tools/calc/salary");
    await fillStable(page.getByLabel("연봉(만원)"), "30000");
    await fillStable(page.getByLabel("월 비과세액(만원)"), "0");
    await expect(page.locator("main").getByText("313,020")).toBeVisible();
  });

  test("연봉 0 → 실수령 0원 (빈 입력 안전)", async ({ page }) => {
    await page.goto("/tools/calc/salary");
    await fillStable(page.getByLabel("연봉(만원)"), "0");
    await expect(page.locator("main").getByText("월 예상 실수령액")).toBeVisible();
    const net = page.locator("main .font-mono.text-5xl").first();
    await expect(net).toHaveText(/^0/);
  });
});

test.describe("퇴직금", () => {
  test("3년 재직 · 월 300만 → 8,812,388원", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/severance");
    await fillStable(page.getByLabel("입사일"), "2023-01-01");
    await fillStable(page.getByLabel("퇴직일"), "2026-01-01");
    const main = page.locator("main");
    await expect(main.getByText("8,812,388")).toBeVisible();
    await expect(main.getByText("1,096").first()).toBeVisible(); // 재직일수
    assertClean(guards);
  });

  test("1년 미만 → 대상 아님 경고", async ({ page }) => {
    await page.goto("/tools/calc/severance");
    await fillStable(page.getByLabel("입사일"), "2025-09-01");
    await fillStable(page.getByLabel("퇴직일"), "2026-01-01");
    await expect(page.getByText(/법정 퇴직금 지급 대상이 아닙니다/)).toBeVisible();
  });

  test("퇴직일 < 입사일 → 안내 문구 (계산 불가)", async ({ page }) => {
    await page.goto("/tools/calc/severance");
    await fillStable(page.getByLabel("입사일"), "2026-01-01");
    await fillStable(page.getByLabel("퇴직일"), "2025-01-01");
    await expect(page.getByText(/올바르게 입력하면 퇴직금이 계산됩니다/)).toBeVisible();
  });

  test("상여 1,200만 → 3개월분 300만 가산 표시", async ({ page }) => {
    await page.goto("/tools/calc/severance");
    await fillStable(page.getByLabel("연간 상여금(만원)"), "1200");
    await expect(page.getByText("상여금 가산 (×3/12)")).toBeVisible();
    await expect(page.locator("main").getByText("3,000,000원")).toBeVisible();
  });
});

test.describe("주휴수당", () => {
  test("2026 최저시급 · 주 40시간 → 주휴수당 82,560원 · 월 2,152,339원", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/wage");
    const main = page.locator("main");
    await expect(main.getByText("82,560").first()).toBeVisible();
    await expect(main.getByText("412,800").first()).toBeVisible();
    await expect(main.getByText("495,360").first()).toBeVisible();
    await expect(main.getByText("2,152,339").first()).toBeVisible();
    assertClean(guards);
  });

  test("주 14시간 → 주휴수당 미발생", async ({ page }) => {
    await page.goto("/tools/calc/wage");
    await fillStable(page.getByLabel("1주 소정근로시간"), "14");
    await expect(page.getByText("주휴수당 발생 대상이 아닙니다")).toBeVisible();
  });

  test("시급 0 → 결과 미표시 (크래시 없음)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/wage");
    await fillStable(page.getByLabel("시급(원)"), "0");
    await expect(page.getByText("주휴수당 (1주)")).toBeHidden();
    assertClean(guards);
  });
});

