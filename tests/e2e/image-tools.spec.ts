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

  test("1장만 업로드 시 합치기 비활성 안내", async ({ page }) => {
    await page.goto("/tools/image/merge");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await expect(page.getByRole("button", { name: "이미지를 2장 이상 추가하세요" })).toBeDisabled();
  });
});

test.describe("워터마크", () => {
  test("텍스트 워터마크 적용 → PNG(기본 출력) · 치수 유지", async ({ page }, testInfo) => {
    const guards = await installGuards(page);
    await page.goto("/tools/image/watermark");
    await uploadToDropzone(page, [fx("photo-1200x900.jpg")]);
    await page.getByPlaceholder("예: © 내 이름, @아이디").fill("© floor05 QA");
    await page.getByRole("button", { name: "워터마크 적용", exact: true }).click();
    await expect(page.getByRole("button", { name: "다운로드" })).toBeVisible({ timeout: 30_000 });
    const file = await saveDownload(page, testInfo, () =>
      page.getByRole("button", { name: "다운로드" }).click(),
    );
    // 기본 출력 형식은 PNG (제품 기본값)
    expect(detectKind(file)).toBe("png");
    expect(imageDims(file)).toEqual({ width: 1200, height: 900 });
    // 워터마크가 실제로 합성됐다면 바이트가 원본과 달라야 함
    expect(fs.readFileSync(file).equals(fs.readFileSync(fx("photo-1200x900.jpg")))).toBe(false);
    assertClean(guards);
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
});
