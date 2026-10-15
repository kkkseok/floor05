/**
 * 단위변환·색상·글자수·랜덤 도구 E2E
 */
import { test, expect } from "@playwright/test";
import { installGuards, assertClean, fillStable } from "./helpers";

test.describe("글자수 세기", () => {
  test("한/영 혼합 텍스트 통계 (독립 검산값)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/text/counter");
    await fillStable(page.getByLabel("글자수를 셀 텍스트 입력"), "안녕하세요 hello");
    const main = page.locator("main");
    await expect(main.locator(".text-5xl")).toHaveText("11"); // 5+1+5
    await expect(main.getByText("16 B")).toBeVisible(); // 2바이트 기준 10+1+5
    await expect(main.getByText("21 B")).toBeVisible(); // UTF-8 15+1+5
    assertClean(guards);
  });

  test("줄바꿈 기준: 네이버(공백 치환) vs HWP(제거)", async ({ page }) => {
    await page.goto("/tools/text/counter");
    await fillStable(page.getByLabel("글자수를 셀 텍스트 입력"), "a\nb");
    const big = page.locator("main .text-5xl");
    await expect(big).toHaveText("3");
    await page.getByRole("button", { name: "한글(HWP)" }).click();
    await expect(big).toHaveText("2");
  });

  test("지우기 + 입력 유지(localStorage 복원)", async ({ page }) => {
    await page.goto("/tools/text/counter");
    const ta = page.getByLabel("글자수를 셀 텍스트 입력");
    await ta.fill("복원 테스트 텍스트");
    await page.waitForTimeout(600); // 자동저장 디바운스
    await page.reload();
    await expect(ta).toHaveValue("복원 테스트 텍스트");
    await page.getByRole("button", { name: "지우기" }).click();
    await expect(ta).toHaveValue("");
  });

  test("원고지: 1,001자 → 6매 (200자지)", async ({ page }) => {
    await page.goto("/tools/text/counter");
    await fillStable(page.getByLabel("글자수를 셀 텍스트 입력"), "가".repeat(1001));
    await expect(page.locator("main").getByText("6매")).toBeVisible();
    await expect(page.locator("main").getByText(/199칸 남음/)).toBeVisible();
  });
});

