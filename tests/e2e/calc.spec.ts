/**
 * 계산기 6종 E2E — 화면에 표시되는 결과값을 독립 산출 golden value와 대조
 * (unit 테스트와 같은 수치를 사용하되, 여기서는 실제 UI 렌더 값을 검증)
 */
import { test, expect } from "@playwright/test";
import { installGuards, assertClean, fillStable } from "./helpers";

test.describe("연봉 실수령액", () => {
  test("연봉 5,000만 → 월 실수령 3,571,577원 + 공제 내역 (간이세액표 원표)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/salary");
    await fillStable(page.getByLabel("연봉(만원)"), "5000");

    const main = page.locator("main");
    await expect(main.getByText("3,571,577")).toBeVisible();
    await expect(main.getByText("188,380")).toBeVisible(); // 국민연금 (기준소득월액 천원 미만 버림)
    await expect(main.getByText("142,600")).toBeVisible(); // 건강보험
    await expect(main.getByText("18,730")).toBeVisible(); // 장기요양
    await expect(main.getByText("35,700")).toBeVisible(); // 고용보험 (floor10 FP 수정 검증)
    await expect(main.getByText("190,620")).toBeVisible(); // 근로소득세 (별표2 3,960~3,980천원·1명)
    await expect(main.getByText("19,060")).toBeVisible(); // 지방소득세
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

  test("월 통상임금이 평균임금보다 크면 통상임금으로 계산 (근로기준법 §2②)", async ({ page }) => {
    await page.goto("/tools/calc/severance");
    await fillStable(page.getByLabel("입사일"), "2023-01-01");
    await fillStable(page.getByLabel("퇴직일"), "2026-01-01");
    await fillStable(page.getByLabel("월 평균 급여(만원)"), "150");
    await fillStable(page.getByLabel("월 통상임금(만원)"), "300");
    const main = page.locator("main");
    await expect(main.getByText("10,344,367")).toBeVisible();
    await expect(main.getByText(/통상임금으로 계산했습니다/)).toBeVisible();
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
  test("2026 최저시급 · 주 40시간 → 주휴수당 82,560원 · 월 2,156,880원(209시간)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/calc/wage");
    const main = page.locator("main");
    await expect(main.getByText("82,560").first()).toBeVisible();
    await expect(main.getByText("412,800").first()).toBeVisible();
    await expect(main.getByText("495,360").first()).toBeVisible();
    await expect(main.getByText("2,156,880").first()).toBeVisible();
    assertClean(guards);
  });

  test("주 40시간 초과 → 연장근로 가산 미반영 안내", async ({ page }) => {
    await page.goto("/tools/calc/wage");
    await fillStable(page.getByLabel("1주 소정근로시간"), "45");
    await expect(page.getByText(/주 40시간을 넘는 5시간은 연장근로입니다/)).toBeVisible();
  });

  test("2027-01-01부터는 기본 시급이 2027 최저시급 10,700원", async ({ page }) => {
    await page.clock.install({ time: new Date("2027-01-02T09:00:00+09:00") });
    await page.goto("/tools/calc/wage");
    await expect(page.getByLabel("시급(원)")).toHaveValue("10700");
    await expect(page.locator("main").getByText("2,236,300").first()).toBeVisible();
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

