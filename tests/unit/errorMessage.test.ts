import { describe, expect, it } from "vitest";
import { toFriendlyImageError } from "@/lib/image/errorMessage";

const FALLBACK = "압축하지 못했습니다. 사진을 다시 올려 시도해 주세요.";

describe("toFriendlyImageError", () => {
  it("내부 구현 용어는 해결 방법이 있는 안내로 바꾼다", () => {
    const canvas = toFriendlyImageError(new Error("Canvas 컨텍스트를 생성할 수 없습니다."), FALLBACK);
    expect(canvas).not.toMatch(/Canvas|컨텍스트/);
    expect(canvas).toContain("크기를 줄이거나");

    const load = toFriendlyImageError(new Error("이미지를 로드할 수 없습니다."), FALLBACK);
    expect(load).not.toContain("로드");
    expect(load).toContain("손상");
  });

  it("브라우저·워커가 던진 영어 메시지는 도구별 기본 문구로 감춘다", () => {
    expect(toFriendlyImageError(new Error("worker crashed"), FALLBACK)).toBe(FALLBACK);
    expect(toFriendlyImageError(new Error("The source image could not be decoded."), FALLBACK)).toBe(FALLBACK);
    expect(toFriendlyImageError(new Error("알 수 없는 프리셋입니다."), FALLBACK)).toBe(FALLBACK);
  });

  it("이미 원인과 해결 방법을 담은 한국어 안내는 그대로 둔다", () => {
    const heic = "이 브라우저에서는 WebP 출력을 지원하지 않습니다. JPG나 PNG로 변환해 주세요.";
    expect(toFriendlyImageError(new Error(heic), FALLBACK)).toBe(heic);
  });

  it("Error가 아니거나 메시지가 비면 기본 문구", () => {
    expect(toFriendlyImageError("boom", FALLBACK)).toBe(FALLBACK);
    expect(toFriendlyImageError(undefined, FALLBACK)).toBe(FALLBACK);
    expect(toFriendlyImageError(new Error(""), FALLBACK)).toBe(FALLBACK);
  });
});
