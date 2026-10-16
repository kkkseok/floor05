/**
 * 이미지 도구 15종 E2E — 다운로드 결과 파일을 바이트 레벨로 검증
 * (형식 매직바이트 · 치수 · EXIF 유무 · ZIP 내부 구성)
 */
import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";
import {
  installGuards,
  assertClean,
  uploadToDropzone,
  saveDownload,
  detectKind,
  imageDims,
  jpegHasExif,
  zipEntries,
  zipExtract,
  fx,
  writeStripesPng,
  pngGreenStats,
  pngPixels,
  rowTransitions,
  writeTransparentWebp,
  writeQuadrantPng,
  isRedAt,
} from "./helpers";

test.describe("이미지 압축", () => {
  test("JPG 압축(품질 60%) → JPEG 출력 · 치수 유지 · 용량 감소", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.locator('input[type="range"]').fill("60");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });

    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
    expect(fs.statSync(file).size).toBeLessThan(fs.statSync(fx("photo-1200x900.jpg")).size);
    expect(path.basename(file)).toBe("photo-1200x900_compressed.jpg");
    assertClean(guards);
  });

  test("투명 PNG 자동 모드 → PNG 유지 (투명 보존 경로)", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: /1개 이미지 압축하기/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 400, height: 300 });
  });

  test("투명 WebP는 '자동'에서 WebP(미지원 시 PNG)로 — JPG로 바꿔 투명을 흰색으로 칠하지 않음", async ({ page }, testInfo) => {
    const webp = await writeTransparentWebp(page, testInfo.outputPath("alpha.webp"));
    test.skip(!webp, "이 브라우저는 WebP를 만들 수 없음");
    for (const target of [false, true]) {
      await page.goto("/tools/image/compress");
      await uploadToDropzone(page, [webp!]);
      if (target) {
        await page.getByRole("button", { name: "목표 용량" }).click();
        await page.getByPlaceholder("직접 입력").fill("500");
      }
      await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
      await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
      const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
      expect(["webp", "png"], target ? "목표 용량" : "품질").toContain(detectKind(file));
    }
  });

  test("목표 용량 30KB → 결과 ≤ 30KB", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "목표 용량" }).click();
    await page.getByPlaceholder("직접 입력").fill("30");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(fs.statSync(file).size).toBeLessThanOrEqual(30 * 1024);
  });

  test("이미 목표보다 작은 GPS 사진 → 다시 압축하지 않되 GPS·EXIF는 지워서 저장", async ({ page }, testInfo) => {
    expect(jpegHasExif(fx("exif-gps.jpg"))).toBe(true);
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("exif-gps.jpg")]);
    await page.getByRole("button", { name: "목표 용량" }).click();
    await page.getByPlaceholder("직접 입력").fill("500");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/이미 목표 용량보다 작은 사진이라/)).toBeVisible();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(jpegHasExif(file), "원본을 그대로 내주면 GPS가 남는다").toBe(false);
    expect(fs.statSync(file).size).toBeLessThan(fs.statSync(fx("exif-gps.jpg")).size);
  });

  test("다시 압축하면 커지는 사진 → 원본 화질 유지 + GPS·EXIF 제거, '+%'로 커졌다고 표시하지 않음", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("exif-gps.jpg")]);
    await page.getByLabel(/이미지 압축 품질/).fill("100");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/다시 압축하면 오히려 커집니다/)).toBeVisible();
    await expect(page.getByText(/--\d+%/)).toHaveCount(0);
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(jpegHasExif(file)).toBe(false);
    expect(fs.statSync(file).size).toBeLessThan(fs.statSync(fx("exif-gps.jpg")).size);
  });

  test("목표 용량이 품질 하한(60%)으로 안 맞으면 해상도를 줄이고 안내", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "목표 용량" }).click();
    await page.getByPlaceholder("직접 입력").fill("8");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/해상도를\s*1200×900\s*에서/)).toBeVisible();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(fs.statSync(file).size).toBeLessThanOrEqual(8 * 1024);
    const { width, height } = imageDims(file);
    expect(width).toBeLessThan(1200);
    expect(width / height).toBeCloseTo(1200 / 900, 1);
  });

  test("목표 용량: 투명 PNG는 PNG(투명 유지)로 맞추고, 불가능하면 JPG로 바꾸며 안내", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]); // 약 53KB
    await page.getByRole("button", { name: "목표 용량" }).click();
    await page.getByPlaceholder("직접 입력").fill("40");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    const png = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    expect(detectKind(png)).toBe("png");
    expect(fs.statSync(png).size).toBeLessThanOrEqual(40 * 1024);
    await expect(page.getByText(/흰색으로 채운 JPG로 저장/)).toHaveCount(0);

    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: "목표 용량" }).click();
    await page.getByPlaceholder("직접 입력").fill("2");
    await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 45_000 });
    await expect(page.getByText(/흰색으로 채운 JPG로 저장/)).toBeVisible();
    const jpg = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    expect(detectKind(jpg)).toBe("jpeg");
  });

  test("2장 일괄 압축 → ZIP에 2개 파일", async ({ page }, testInfo) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg"), fx("photo-small-100x75.jpg")]);
    await page.getByRole("button", { name: "2개 이미지 압축하기" }).click();
    await expect(page.getByRole("button", { name: /ZIP 다운로드 \(2개\)/ })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: /ZIP 다운로드/ }).click(),
    );
    expect(detectKind(file)).toBe("zip");
    const entries = await zipEntries(file);
    expect(entries).toHaveLength(2);
    expect(entries.every((e) => e.endsWith(".jpg"))).toBe(true);
  });

  test("깨진 파일 → 친절한 에러 · 크래시 없음", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("broken.jpg")]);
    await page.getByRole("button", { name: /이미지 압축하기/ }).click();
    // 개별 이미지 에러 오버레이 (기술 용어 없는 한국어)
    await expect(page.locator("main").getByText(/이미지를 로드할 수 없습니다|압축에 실패/).first()).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("button", { name: "다운로드" })).toBeHidden();
    assertClean(guards); // pageerror 없어야 함
  });

  test("텍스트 파일 업로드 거부", async ({ page }) => {
    await page.goto("/tools/image/compress");
    await uploadToDropzone(page, [fx("not-image.txt")]);
    await expect(page.getByText("지원하지 않는 파일 형식입니다", { exact: false })).toBeVisible();
  });
});

test.describe("포맷 변환", () => {
  test("투명 PNG → JPG(흰 배경) 변환", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/convert");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: "JPG", exact: true }).click();
    await page.getByRole("button", { name: /1개 이미지 JPG로 변환/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 400, height: 300 });
    expect(path.extname(file)).toBe(".jpg");
    assertClean(guards);
  });

  test("JPG → WebP 변환 (미지원 브라우저는 버튼 비활성)", async ({ page }, testInfo) => {
    await page.goto("/tools/image/convert");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);

    // 제품은 브라우저의 WebP 인코딩 지원을 감지해 버튼을 비활성화한다.
    // 지원 여부는 브라우저 빌드에 따라 다르므로 실제 상태에 맞춰 검증한다.
    const webpBtn = page.getByRole("button", { name: /^WebP/ });
    if (await webpBtn.isDisabled()) {
      await expect(page.getByText(/WebP.*출력을 지원하지 않습니다/)).toBeVisible();
      return;
    }

    await page.getByRole("button", { name: "WebP", exact: true }).click();
    await page.getByRole("button", { name: /1개 이미지 WebP로 변환/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("webp");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
  });

  test("WebP → PNG 변환", async ({ page }, testInfo) => {
    await page.goto("/tools/image/convert");
    await uploadToDropzone(page, [fx("photo-800x600.webp")]);
    await page.getByRole("button", { name: "PNG", exact: true }).click();
    await page.getByRole("button", { name: /1개 이미지 PNG로 변환/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 800, height: 600 });
  });

  test("이름만 .HEIC인 JPG → 실패 없이 JPG로 변환", async ({ page }, testInfo) => {
    const src = testInfo.outputPath("IMG_0001.HEIC");
    fs.mkdirSync(path.dirname(src), { recursive: true });
    fs.copyFileSync(fx("photo-1200x900.jpg"), src);
    await page.goto("/tools/image/heic-to-jpg");
    await uploadToDropzone(page, [src]);
    await page.getByRole("button", { name: /1개 이미지 JPG로 변환/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 60_000 });
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
  });

  test("HEIC → JPG 변환 (실물 HEIC 파일)", async ({ page, browserName }, testInfo) => {
    test.skip(browserName !== "chromium", "heic2any 디코딩은 대표로 Chromium에서 검증");
    test.skip(!fs.existsSync(fx("sample.heic")), "실물 HEIC 선택 fixture가 있는 환경에서 검증");
    test.setTimeout(120_000);
    const guards = await installGuards(page);
    await page.goto("/tools/image/heic-to-jpg");
    await uploadToDropzone(page, [fx("sample.heic")]);
    await expect(page.getByText("HEIC 파일 감지됨.")).toBeVisible();
    await page.getByRole("button", { name: /1개 이미지 JPG로 변환/ }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 90_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1440, height: 960 });
    assertClean(guards);
  });
});

test.describe("리사이즈", () => {
  test("직접 입력 600px(비율 잠금) → 600×450", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/resize");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.locator("#resize-width").fill("600");
    await expect(page.locator("#resize-height")).toHaveValue("450"); // 비율 자동
    await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(imageDims(file)).toEqual({ width: 600, height: 450 });
    assertClean(guards);
  });

  test("비율 50% → 600×450", async ({ page }, testInfo) => {
    await page.goto("/tools/image/resize");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "비율 (%)" }).click();
    await page.locator('input[type="range"]').fill("50");
    await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(imageDims(file)).toEqual({ width: 600, height: 450 });
  });

  test("SNS 정방형 프리셋은 가로 사진을 늘리지 않고 가운데를 잘라 1080×1080으로", async ({ page }, testInfo) => {
    // 400×200, 왼쪽 100px 세로 띠만 빨강 → 가운데 200×200을 자르면 빨강이 없어야 한다(늘리면 왼쪽 1/4이 빨강)
    const src = writeQuadrantPng(testInfo.outputPath("strip.png"), 400, 200, 100, 200);
    await page.goto("/tools/image/resize");
    await uploadToDropzone(page, [src]);
    await page.getByRole("button", { name: "SNS 프리셋" }).click();
    await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    const p = pngPixels(file);
    expect([p.width, p.height]).toEqual([1080, 1080]);
    expect(isRedAt(p, 50, 540)).toBe(false);
    expect(isRedAt(p, 1030, 540)).toBe(false);
  });

  test("투명 PNG를 줄이면 PNG로 저장 (JPG 흰 배경으로 바꾸지 않음)", async ({ page }, testInfo) => {
    await page.goto("/tools/image/resize");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.locator("#resize-width").fill("200");
    await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(path.extname(file)).toBe(".png");
    expect(imageDims(file)).toEqual({ width: 200, height: 150 });
  });

  test("3px 줄무늬 1024px → 64px 축소가 균일한 회색 (큰 비율 축소 깨짐 없음)", async ({ page }, testInfo) => {
    const stripes = writeStripesPng(testInfo.outputPath("stripes-1024.png"));
    await page.goto("/tools/image/resize");
    await uploadToDropzone(page, [stripes]);
    await page.locator("#resize-width").fill("64");
    await expect(page.locator("#resize-height")).toHaveValue("64");
    await page.getByRole("button", { name: "1개 이미지 리사이즈" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 64, height: 64 });
    const { mean, spread } = pngGreenStats(file);
    expect(mean).toBeGreaterThan(65);
    expect(mean).toBeLessThan(105);
    // 실측 편차: Chromium 16 / WebKit 46(캔버스 필터가 정확한 평균이 아님) / 수정 전 WebKit 143
    expect(spread, "64px 결과에 줄무늬가 남으면 안 됨").toBeLessThan(60);
  });
});

test.describe("이미지 합치기", () => {
  test("세로 합치기(폭 통일) → 폭 1200 · 높이 = 900+스케일된 두번째", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/merge");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg"), fx("opaque-800x600.png")]);
    await page.getByRole("button", { name: "2개 이미지 합치기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    // match 전략: trackW=1200, 두번째는 800→1200 스케일 시 높이 600×1.5=900 → 총 1800
    expect(imageDims(file)).toEqual({ width: 1200, height: 1800 });
    assertClean(guards);
  });

  test("PNG끼리 합치면 기본 출력이 PNG, JPG가 섞이면 JPG", async ({ page }, testInfo) => {
    await page.goto("/tools/image/merge");
    await uploadToDropzone(page, [fx("opaque-800x600.png"), fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: "2개 이미지 합치기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const png = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(png)).toBe("png");

    await page.goto("/tools/image/merge");
    await uploadToDropzone(page, [fx("opaque-800x600.png"), fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "2개 이미지 합치기" }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const jpg = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(jpg)).toBe("jpeg");
  });

  test("1장만 업로드 시 합치기 비활성 안내", async ({ page }) => {
    await page.goto("/tools/image/merge");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await expect(page.getByRole("button", { name: "이미지를 2장 이상 추가하세요" })).toBeDisabled();
  });
});

test.describe("워터마크", () => {
  test("텍스트 워터마크 적용 → JPG 사진은 JPG(기본 '자동') · 치수 유지", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/watermark");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByPlaceholder("예: © 내 이름, @아이디").fill("© floor05 QA");
    await page.getByRole("button", { name: "워터마크 적용", exact: true }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    // 기본 '자동': JPG 사진은 JPG (예전 기본 PNG는 15.8MB JPG를 47.2MB PNG로 만들었다)
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
    // 워터마크가 실제로 합성됐다면 바이트가 원본과 달라야 함
    expect(fs.readFileSync(file).equals(fs.readFileSync(fx("photo-1200x900.jpg")))).toBe(false);
    assertClean(guards);
  });

  test("기본 '자동'에서 투명 PNG는 PNG로 저장(투명 유지)", async ({ page }, testInfo) => {
    await page.goto("/tools/image/watermark");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByPlaceholder("예: © 내 이름, @아이디").fill("© floor05");
    await page.getByRole("button", { name: "워터마크 적용", exact: true }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    expect(detectKind(file)).toBe("png");
  });

  test("기본 '자동'에서 WebP는 WebP로 (PNG로 바꿔 몇 배 키우지 않음) · 기본 문구는 비어 있음", async ({ page }, testInfo) => {
    const webp = await writeTransparentWebp(page, testInfo.outputPath("alpha.webp"));
    test.skip(!webp, "이 브라우저는 WebP를 만들 수 없음");
    await page.goto("/tools/image/watermark");
    await uploadToDropzone(page, [webp!]);
    const input = page.getByPlaceholder("예: © 내 이름, @아이디");
    await expect(input).toHaveValue("");
    await input.fill("© test");
    await page.getByRole("button", { name: "워터마크 적용", exact: true }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    expect(detectKind(file)).toBe("webp");
  });
});

test.describe("회전·반전", () => {
  test("오른쪽 90° → 900×1200 (치수 교환)", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: /오른쪽 90°/ }).click();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 900, height: 1200 });
    assertClean(guards);
  });

  test("오른쪽 90° 뒤 좌우 반전은 화면 기준 좌우로 뒤집는다", async ({ page }, testInfo) => {
    const src = writeQuadrantPng(testInfo.outputPath("quad.png"));
    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [src]);
    await page.getByRole("button", { name: /오른쪽 90°/ }).click(); // 빨강: 오른쪽 위
    await page.getByRole("button", { name: "좌우 반전" }).click(); // 빨강: 왼쪽 위
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    const p = pngPixels(file);
    expect([p.width, p.height]).toEqual([100, 200]);
    expect(isRedAt(p, 10, 10)).toBe(true);
    expect(isRedAt(p, 90, 10)).toBe(false);
    expect(isRedAt(p, 90, 190)).toBe(false);
  });

  test("좌우 반전 뒤 오른쪽 90°는 반전된 그림을 그대로 돌린다", async ({ page }, testInfo) => {
    const src = writeQuadrantPng(testInfo.outputPath("quad.png"));
    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [src]);
    await page.getByRole("button", { name: "좌우 반전" }).click(); // 빨강: 오른쪽 위
    await page.getByRole("button", { name: /오른쪽 90°/ }).click(); // 빨강: 오른쪽 아래
    const file = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "다운로드" }).click());
    const p = pngPixels(file);
    expect([p.width, p.height]).toEqual([100, 200]);
    expect(isRedAt(p, 90, 190)).toBe(true);
    expect(isRedAt(p, 10, 10)).toBe(false);
    expect(isRedAt(p, 90, 10)).toBe(false);
  });

  test("좌우 반전 → 치수 유지 · 초기화 동작", async ({ page }, testInfo) => {
    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "좌우 반전" }).click();
    await page.getByRole("button", { name: "초기화" }).click();
    await page.getByRole("button", { name: /왼쪽 90°/ }).click();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(imageDims(file)).toEqual({ width: 900, height: 1200 });
  });

  test("투명 PNG는 PNG로, WebP는 WebP(미지원 시 PNG)로 저장 — JPG로 바꿔 투명을 검게 칠하지 않음", async ({ page }, testInfo) => {
    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: /오른쪽 90°/ }).click();
    const png = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(png)).toBe("png");
    expect(path.extname(png)).toBe(".png");
    expect(imageDims(png)).toEqual({ width: 300, height: 400 });

    await page.goto("/tools/image/rotate");
    await uploadToDropzone(page, [fx("photo-800x600.webp")]);
    const webp = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    const kind = detectKind(webp);
    expect(["webp", "png"]).toContain(kind);
    expect(path.extname(webp)).toBe(`.${kind}`);
  });
});

test.describe("인스타 9분할", () => {
  test("3×3 분할 → ZIP 9개 · 각 400×300", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/grid");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: /9칸으로 분할 \(ZIP\)/ }).click(),
      45_000,
    );
    expect(detectKind(file)).toBe("zip");
    const entries = await zipEntries(file);
    expect(entries).toHaveLength(9);
    // 인스타 9분할은 중앙 정사각(900×900) 크롭 후 3×3 → 각 300×300
    const first = await zipExtract(file, entries[0], testInfo.outputPath("grid-cell.bin"));
    expect(imageDims(first)).toEqual({ width: 300, height: 300 });
    assertClean(guards);
  });
});

test.describe("EXIF 삭제", () => {
  test("이름이 같은 사진 2장 → ZIP에 2개 모두 (덮어써서 1장만 남지 않음)", async ({ page }, testInfo) => {
    const a = testInfo.outputPath("a/image.jpg");
    const b = testInfo.outputPath("b/image.jpg");
    fs.mkdirSync(path.dirname(a), { recursive: true });
    fs.mkdirSync(path.dirname(b), { recursive: true });
    fs.copyFileSync(fx("exif-gps.jpg"), a);
    fs.copyFileSync(fx("photo-1200x900.jpg"), b);
    await page.goto("/tools/image/exif-remove");
    await uploadToDropzone(page, [a, b]);
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: /EXIF 제거/ }).click(),
    );
    expect(detectKind(file)).toBe("zip");
    expect((await zipEntries(file)).sort()).toEqual(["image_noexif (1).jpg", "image_noexif.jpg"]);
  });

  test("GPS 포함 JPEG → 감지 표시 → 출력에서 EXIF 완전 제거 · 치수 유지", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    // 입력 fixture에 실제 EXIF(GPS)가 있는지 사전 확인
    expect(jpegHasExif(fx("exif-gps.jpg"))).toBe(true);

    await page.goto("/tools/image/exif-remove");
    await uploadToDropzone(page, [fx("exif-gps.jpg")]);
    await expect(page.getByText("⚠ 위치정보(GPS) 포함")).toBeVisible();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "EXIF 제거하고 다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
    expect(jpegHasExif(file), "출력물에 EXIF가 남아있으면 안 됨").toBe(false);
    expect(path.basename(file)).toBe("exif-gps_noexif.jpg");
    assertClean(guards);
  });

  test("EXIF 없는 PNG → 표시 없음 + 정상 처리", async ({ page }, testInfo) => {
    await page.goto("/tools/image/exif-remove");
    await uploadToDropzone(page, [fx("opaque-800x600.png")]);
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "EXIF 제거하고 다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 800, height: 600 });
  });
});

test.describe("파비콘 만들기", () => {
  test("ZIP 구성(ico+png 5종+manifest+snippet) · ICO 유효성", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/favicon");
    await uploadToDropzone(page, [fx("opaque-800x600.png")]);
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: "파비콘 생성 (ZIP 다운로드)" }).click(),
      45_000,
    );
    expect(detectKind(file)).toBe("zip");
    const entries = await zipEntries(file);
    expect(entries).toEqual([
      "android-chrome-192x192.png",
      "android-chrome-512x512.png",
      "apple-touch-icon.png",
      "favicon-16x16.png",
      "favicon-32x32.png",
      "favicon.ico",
      "head-snippet.html",
      "site.webmanifest",
    ]);
    const ico = await zipExtract(file, "favicon.ico", testInfo.outputPath("favicon.ico"));
    expect(detectKind(ico)).toBe("ico");
    const p512 = await zipExtract(file, "android-chrome-512x512.png", testInfo.outputPath("512.png"));
    expect(imageDims(p512)).toEqual({ width: 512, height: 512 });
    assertClean(guards);
  });

  test("3px 주기 줄무늬 1024px → 16px는 균일한 회색 (한 번에 줄인 계단·줄무늬 없음)", async ({ page }, testInfo) => {
    const stripes = writeStripesPng(testInfo.outputPath("stripes-1024.png"));

    await page.goto("/tools/image/favicon");
    await uploadToDropzone(page, [stripes]);
    const file = await saveDownload(
      page,
      testInfo,
      () => page.getByRole("button", { name: "파비콘 생성 (ZIP 다운로드)" }).click(),
      45_000,
    );
    const p16 = await zipExtract(file, "favicon-16x16.png", testInfo.outputPath("16.png"));
    const { mean, spread } = pngGreenStats(p16);
    expect(spread, "16px 결과에 흑백 줄무늬가 남으면 안 됨").toBeLessThan(40);
  });
});

test.describe("색상 추출", () => {
  test("이미지 클릭 → HEX·RGB 값 표시 + 팔레트", async ({ page }) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/color-picker");
    await uploadToDropzone(page, [fx("opaque-800x600.png")]);
    const canvas = page.locator("main canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    await canvas.click({ position: { x: 50, y: 50 } });
    await expect(page.locator("main").getByText(/^#[0-9A-F]{6}$/).first()).toBeVisible();
    await expect(page.locator("main").getByText(/^rgb\(\d+, \d+, \d+\)$/).first()).toBeVisible();
    assertClean(guards);
  });
});

test.describe("모자이크", () => {
  test("드래그로 영역 적용 → 다운로드 (바이트 변경 확인)", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/mosaic");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    const canvas = page.locator("main canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    // 캔버스 위 드래그
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 8 });
    await page.mouse.up();
    await expect(page.getByText(/1곳 적용됨/)).toBeVisible();

    const dlBtn = page.getByRole("button", { name: /다운로드/ }).first();
    const file = await saveDownload(page, testInfo, () => dlBtn.click());
    expect(detectKind(file)).toBe("jpeg");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
    expect(fs.readFileSync(file).equals(fs.readFileSync(fx("photo-1200x900.jpg")))).toBe(false);
    assertClean(guards);
  });

  test("편집 화면보다 큰 원본(2400px)은 원본 해상도로 저장하고, 칠한 곳만 모자이크", async ({ page }, testInfo) => {
    // 편집 캔버스는 긴 변 2000px로 줄여 보여준다. 예전에는 저장도 2000px로 줄어 나갔다.
    const stripes = writeStripesPng(testInfo.outputPath("stripes-2400.png"), 2400);
    await page.goto("/tools/image/mosaic");
    await uploadToDropzone(page, [stripes]);
    const canvas = page.locator("main canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.6, { steps: 8 });
    await page.mouse.up();
    await expect(page.getByText(/1곳 적용됨/)).toBeVisible();
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: /다운로드/ }).first().click(),
    );
    expect(detectKind(file)).toBe("png");
    const px = pngPixels(file);
    expect({ width: px.width, height: px.height }).toEqual({ width: 2400, height: 2400 });
    const y = Math.round(2400 * 0.4);
    const inside = rowTransitions(px, y, Math.round(2400 * 0.3), Math.round(2400 * 0.5)); // 칠한 영역 안
    const outside = rowTransitions(px, y, Math.round(2400 * 0.75), Math.round(2400 * 0.95)); // 칠하지 않은 곳
    expect(outside, "칠하지 않은 곳은 원래 줄무늬(3px마다 2번 바뀜)").toBeGreaterThan(250);
    expect(inside, "칠한 곳은 모자이크 블록이라 거의 바뀌지 않음").toBeLessThan(60);
  });
});

test.describe("크롭", () => {
  test("기본 크롭 영역 다운로드 → 원본 이하 치수의 유효 이미지", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/crop");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByRole("button", { name: "이미지 크롭", exact: true }).click();
    await expect(page.getByText(/크롭 완료/)).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    const kind = detectKind(file);
    expect(["jpeg", "png"]).toContain(kind);
    const dims = imageDims(file);
    expect(dims.width).toBeGreaterThan(0);
    expect(dims.width).toBeLessThanOrEqual(1200);
    expect(dims.height).toBeLessThanOrEqual(900);
    assertClean(guards);
  });

  test("증명사진 크기(2×2, 600px)로 큰 이미지를 줄여도 줄무늬가 남지 않음", async ({ page }, testInfo) => {
    // 4800px → 600px(8배): 4800→2400→1200→600으로 마지막 단계가 정확히 2배가 되는 비율.
    // 줄무늬 편차는 마지막 단계가 2배일 때만 판정에 쓸 수 있다(6.8배 같은 비율은 이상적인
    // 면적 평균 결과도 칸마다 밝기가 달라진다). 8배 실측 편차: Chromium 32 / Firefox 64 / WebKit 98,
    // 수정 전(한 번에 축소) WebKit은 143.
    const stripes = writeStripesPng(testInfo.outputPath("stripes-4800.png"), 4800);
    await page.goto("/tools/image/crop");
    await uploadToDropzone(page, [stripes]);
    await page.getByRole("button", { name: "미국 비자 2×2" }).click();
    await page.getByRole("button", { name: "이미지 크롭", exact: true }).click();
    await expect(page.getByText(/크롭 완료/)).toBeVisible({ timeout: 60_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 600, height: 600 });
    const { mean, spread } = pngGreenStats(file);
    expect(mean).toBeGreaterThan(65);
    expect(mean).toBeLessThan(105);
    expect(spread, "600px 결과에 줄무늬가 남으면 안 됨").toBeLessThan(110);
  });

  test("투명 PNG를 자르면 PNG로 저장 (JPG 흰 배경으로 바꾸지 않음)", async ({ page }, testInfo) => {
    await page.goto("/tools/image/crop");
    await uploadToDropzone(page, [fx("transparent-400x300.png")]);
    await page.getByRole("button", { name: "이미지 크롭", exact: true }).click();
    await expect(page.getByText(/크롭 완료/)).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    expect(detectKind(file)).toBe("png");
    expect(path.extname(file)).toBe(".png");
  });
});

test.describe("투명 WebP 형식 유지", () => {
  // 예전에는 모자이크·9분할이 PNG가 아니면 전부 JPG로 저장해 투명 영역이 검게 칠해졌다.
  // WebP 인코딩을 못 하는 브라우저는 PNG로 대체하므로 webp·png 둘 다 허용하고 jpeg만 금지한다.
  test("모자이크·9분할·EXIF 삭제가 투명 WebP를 JPG로 바꾸지 않음", async ({ page }, testInfo) => {
    const webp = await writeTransparentWebp(page, testInfo.outputPath("alpha.webp"));
    test.skip(!webp, "이 브라우저는 WebP를 만들 수 없음");

    await page.goto("/tools/image/mosaic");
    await uploadToDropzone(page, [webp!]);
    const canvas = page.locator("main canvas").first();
    await expect(canvas).toBeVisible({ timeout: 15_000 });
    const box = (await canvas.boundingBox())!;
    await page.mouse.move(box.x + box.width * 0.1, box.y + box.height * 0.1);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.4, box.y + box.height * 0.6, { steps: 6 });
    await page.mouse.up();
    const mosaic = await saveDownload(page, testInfo, () => page.getByRole("button", { name: /다운로드/ }).first().click());
    expect(["webp", "png"]).toContain(detectKind(mosaic));

    await page.goto("/tools/image/grid");
    await uploadToDropzone(page, [webp!]);
    const grid = await saveDownload(page, testInfo, () => page.getByRole("button", { name: /9칸으로 분할 \(ZIP\)/ }).click());
    const names = await zipEntries(grid);
    expect(names.length).toBeGreaterThan(0);
    expect(names.every((n) => /\.(webp|png)$/.test(n)), names.join(",")).toBe(true);

    await page.goto("/tools/image/exif-remove");
    await uploadToDropzone(page, [webp!]);
    const exif = await saveDownload(page, testInfo, () => page.getByRole("button", { name: "EXIF 제거하고 다운로드" }).click());
    expect(["webp", "png"]).toContain(detectKind(exif));
  });
});

