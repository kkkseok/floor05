/**
 * PDF 도구 3종 E2E — 결과 PDF의 페이지 수·페이지 크기·ZIP 구성 검증
 */
import { test, expect } from "@playwright/test";
import {
  installGuards,
  assertClean,
  uploadToDropzone,
  saveDownload,
  detectKind,
  pdfPageCount,
  pdfPageSizes,
  zipEntries,
  zipExtract,
  fx,
} from "./helpers";

test.describe("이미지 PDF 변환", () => {
  test("2장 fit 모드 → 2페이지 · 페이지 크기 = 이미지 크기", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/image-to-pdf");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg"), fx("opaque-800x600.png")]);
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: /PDF로 변환 \(2장\)/ }).click(),
      45_000,
    );
    expect(detectKind(file)).toBe("pdf");
    expect(await pdfPageCount(file)).toBe(2);
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 1200, h: 900 });
    expect(sizes[1]).toEqual({ w: 800, h: 600 });
    assertClean(guards);
  });

  test("화질 '제출용' → 긴 변 1754px로 축소 (fit 페이지 크기로 확인)", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/image-to-pdf");
    await uploadToDropzone(page, [fx("wide-3000x500.jpg"), fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "제출용", exact: true }).click();
    // FAQ에도 "긴 변 1754px"가 있으므로 안내 문구에만 있는 "(A4 150dpi)"까지 맞춘다
    await expect(page.getByText(/긴 변 1754px\(A4 150dpi\)/)).toBeVisible();
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: /PDF로 변환 \(2장\)/ }).click(),
      60_000,
    );
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 1754, h: 292 }); // 3000×500 → 1754×292
    expect(sizes[1]).toEqual({ w: 1200, h: 900 }); // 이미 작으면 확대하지 않음
  });

  test("A4 자동 방향 → 가로 이미지는 가로 A4", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/image-to-pdf");
    await uploadToDropzone(page, [fx("wide-3000x500.jpg"), fx("tall-500x3000.jpg")]);
    await page.getByRole("button", { name: "A4", exact: true }).click();
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: /PDF로 변환 \(2장\)/ }).click(),
      60_000,
    );
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 841.89, h: 595.28 }); // 가로 A4
    expect(sizes[1]).toEqual({ w: 595.28, h: 841.89 }); // 세로 A4
  });

  test("순서 변경(↑) 반영", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/image-to-pdf");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg"), fx("opaque-800x600.png")]);
    await page.getByRole("button", { name: "위로" }).nth(1).click(); // 2번째를 위로
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: /PDF로 변환/ }).click(),
      45_000,
    );
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 800, h: 600 }); // 순서 바뀜
  });
});

test.describe("PDF 합치기", () => {
  test("A4 1p + Letter 3p → 4페이지 · 각 페이지 크기 보존", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/merge");
    await uploadToDropzone(page, [fx("a4-1p.pdf"), fx("letter-3p.pdf")]);
    await expect(page.getByText("1페이지")).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("3페이지")).toBeVisible();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "2개 PDF 합치기" }).click(),
    );
    expect(detectKind(file)).toBe("pdf");
    expect(await pdfPageCount(file)).toBe(4);
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 595.28, h: 841.89 }); // A4
    expect(sizes[1]).toEqual({ w: 612, h: 792 }); // Letter
    assertClean(guards);
  });

  test("순서 변경 후 병합 → Letter 먼저", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/merge");
    await uploadToDropzone(page, [fx("a4-1p.pdf"), fx("letter-3p.pdf")]);
    await expect(page.getByText("3페이지")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "위로" }).nth(1).click();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "2개 PDF 합치기" }).click(),
    );
    const sizes = await pdfPageSizes(file);
    expect(sizes[0]).toEqual({ w: 612, h: 792 }); // Letter 먼저
  });

  test("1개만 업로드 → 병합 비활성", async ({ page }) => {
    await page.goto("/tools/pdf/merge");
    await uploadToDropzone(page, [fx("a4-1p.pdf")]);
    await expect(page.getByRole("button", { name: "PDF를 2개 이상 올려주세요" })).toBeDisabled();
  });

  test("깨진 PDF 포함 → 에러 안내 · 크래시 없음", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/merge");
    await uploadToDropzone(page, [fx("a4-1p.pdf"), fx("broken.pdf")]);
    await expect(page.getByText("읽을 수 없음", { exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/PDF로 읽을 수 없어요/)).toBeVisible();
    await expect(page.getByRole("button", { name: "2개 PDF 합치기" })).toBeDisabled();
    assertClean(guards);
  });

  test("암호로 보호된 PDF → '암호로 보호됨' 표시 · 병합 비활성 (빈 페이지 출력 금지)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/merge");
    await uploadToDropzone(page, [fx("a4-1p.pdf"), fx("encrypted-3p.pdf")]);
    await expect(page.getByText("암호로 보호됨", { exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/암호로 보호된 PDF라 페이지를 꺼낼 수 없어요/)).toBeVisible();
    await expect(page.getByRole("button", { name: "2개 PDF 합치기" })).toBeDisabled();
    assertClean(guards);
  });
});

test.describe("PDF 분할", () => {
  test("암호로 보호된 PDF → 해결 방법 안내 (빈 페이지 출력 금지)", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("encrypted-3p.pdf")]);
    await expect(page.getByText(/암호로 보호된 PDF라 페이지를 꺼낼 수 없어요/)).toBeVisible({ timeout: 15_000 });
    assertClean(guards);
  });

  test("페이지 추출 '2' (혼합 크기 PDF) → A5 가로 1페이지", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("mixed-2p.pdf")]);
    await expect(page.getByText("총 2페이지")).toBeVisible({ timeout: 15_000 });
    await page.locator("#range").fill("2");
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "선택 페이지 추출" }).click(),
    );
    expect(detectKind(file)).toBe("pdf");
    expect(await pdfPageCount(file)).toBe(1);
    expect((await pdfPageSizes(file))[0]).toEqual({ w: 595.28, h: 419.53 }); // A5 가로
    assertClean(guards);
  });

  test("범위 '1-3,2' → 순서·중복 유지 4페이지", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("letter-3p.pdf")]);
    await expect(page.getByText("총 3페이지")).toBeVisible({ timeout: 15_000 });
    await page.locator("#range").fill("1-3,2");
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "선택 페이지 추출" }).click(),
    );
    expect(await pdfPageCount(file)).toBe(4);
  });

  test("범위 밖 '5' → 에러 안내", async ({ page }) => {
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("letter-3p.pdf")]);
    await expect(page.getByText("총 3페이지")).toBeVisible({ timeout: 15_000 });
    await page.locator("#range").fill("5");
    await page.getByRole("button", { name: "선택 페이지 추출" }).click();
    await expect(page.getByText(/페이지 범위를 다시 확인해 주세요/)).toBeVisible();
  });

  test("낱장 전부 분할 → ZIP에 3개 PDF · 각 1페이지", async ({ page }, testInfo) => {
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("letter-3p.pdf")]);
    await expect(page.getByText("총 3페이지")).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "낱장 전부 분할" }).click();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "낱장으로 분할 (ZIP)" }).click(),
    );
    expect(detectKind(file)).toBe("zip");
    const entries = await zipEntries(file);
    expect(entries).toEqual(["letter-3p_1.pdf", "letter-3p_2.pdf", "letter-3p_3.pdf"]);
    const one = await zipExtract(file, entries[0], testInfo.outputPath("split-1.pdf"));
    expect(await pdfPageCount(one)).toBe(1);
  });

  test("깨진 PDF → 읽기 실패 안내", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/pdf/split");
    await uploadToDropzone(page, [fx("broken.pdf")]);
    await expect(page.getByText(/PDF로 읽을 수 없어요/)).toBeVisible({ timeout: 15_000 });
    assertClean(guards);
  });
});
