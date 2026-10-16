import { describe, it, expect } from "vitest";
import { computeCoverCrop } from "@/lib/image/resizeDims";

describe("computeCoverCrop (프리셋 가운데 잘라 채우기)", () => {
  it("4:3 사진 → 정방형: 가운데 900×900을 잘라 1080×1080", () => {
    expect(computeCoverCrop(1200, 900, 1080, 1080)).toEqual({ sx: 150, sy: 0, sw: 900, sh: 900, width: 1080, height: 1080 });
  });
  it("가로 사진 → 세로 4:5: 높이 전체, 가운데 폭만", () => {
    const c = computeCoverCrop(1200, 900, 1080, 1350);
    expect(c.sh).toBe(900);
    expect(c.sw).toBeCloseTo(720);
    expect(c.sx).toBeCloseTo(240);
    expect([c.width, c.height]).toEqual([1080, 1350]);
  });
  it("확대 안 함: 잘라낸 영역(900)이 목표(1080)보다 작으면 900×900으로", () => {
    const c = computeCoverCrop(1200, 900, 1080, 1080, true);
    expect([c.width, c.height]).toEqual([900, 900]);
  });
});
