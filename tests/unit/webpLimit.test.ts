/**
 * WebP 저장 한계 검사 단위 테스트.
 * 한계값 16,383px은 2026-11-22 실측(docs/blog-data/webp-when-2026-11-22.json):
 * Chromium은 1080×16384 이상을 오류 없이 1080×16383으로 잘라 저장했다.
 */
import { describe, it, expect } from "vitest";
import { assertWebpEncodable, WEBP_MAX_SIDE } from "@/lib/common/webpLimit";

describe("WebP 저장 한계 (assertWebpEncodable)", () => {
  it("한 변이 16,383px 이하면 통과", () => {
    expect(WEBP_MAX_SIDE).toBe(16383);
    expect(() => assertWebpEncodable("image/webp", 1080, 16383)).not.toThrow();
    expect(() => assertWebpEncodable("image/webp", 16383, 16383)).not.toThrow();
  });

  it("높이가 한계를 넘으면 해결 방법이 담긴 안내로 중단", () => {
    expect(() => assertWebpEncodable("image/webp", 1080, 16384)).toThrow(/16,383px/);
    expect(() => assertWebpEncodable("image/webp", 1080, 20000)).toThrow(/높이가 20,000px/);
    expect(() => assertWebpEncodable("image/webp", 1080, 20000)).toThrow(/JPG나 PNG/);
  });

  it("너비가 넘는 경우는 너비로 안내", () => {
    expect(() => assertWebpEncodable("image/webp", 20000, 1080)).toThrow(/너비가 20,000px/);
  });

  it("JPG·PNG는 크기와 무관하게 통과 (각자의 한계는 다른 곳에서 다룸)", () => {
    expect(() => assertWebpEncodable("image/jpeg", 1080, 20000)).not.toThrow();
    expect(() => assertWebpEncodable("image/png", 1080, 20000)).not.toThrow();
  });
});
