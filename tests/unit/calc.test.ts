/**
 * 계산기 로직 단위 테스트
 * expected 값은 제품 코드가 아니라 법정 산식·공식 요율(2026)로 별도 산출한 golden value다.
 * - 4대보험 요율: 국민연금 4.75%(상한 659만/하한 41만, 2026.7~), 건강 3.595%,
 *   장기요양 13.14%(건보료 대비), 고용 0.9% [출처: 보건복지부·국민건강보험공단·NPS 고시]
 * - 소득세: 소득세법 시행령 [별표 2] 근로소득 간이세액표 <개정 2026. 2. 27.> 원표 조회값
 *   (law.go.kr 별표2 PDF, 국세청 안내 페이지 예시 3,500~3,520천원 행과 대조)
 * - 최저임금 2026: 10,320원 [고용노동부 고시]
 */
import { describe, it, expect } from "vitest";
import { calcSalary, calcIncomeTax } from "@/lib/calc/salary";
import { calcSeverance } from "@/lib/calc/severance";
import { calcWage } from "@/lib/calc/wage";

describe("연봉 실수령액 (calcSalary)", () => {
  it("연봉 5,000만 · 비과세 월 20만 · 본인 1인 · 자녀 0 — 법정 산식 수기 검산", () => {
    // 수기 검산 (2026 요율):
    // 월 세전 = 4,166,667 / 과세 월급여 = 3,966,666.67
    // 국민연금 = floor10(3,966,666.67 × 0.0475) = 188,410
    // 건강 = floor10(× 0.03595) = 142,600 / 장기요양 = floor10(142,600 × 0.1314) = 18,730
    // 고용 = floor10(× 0.009) = 35,700
    // 소득세 = 간이세액표 3,960~3,980천원 · 가족 1명 = 190,620 / 지방소득세 = 19,060
    // 공제 합계 = 188,410 + 142,600 + 18,730 + 35,700 + 190,620 + 19,060 = 595,120
    const r = calcSalary({
      annualSalary: 50_000_000,
      monthlyNonTax: 200_000,
      dependents: 1,
      children: 0,
    });
    expect(r.monthlyGross).toBe(4_166_667);
    expect(r.deductions.pension).toBe(188_410);
    expect(r.deductions.health).toBe(142_600);
    expect(r.deductions.longTermCare).toBe(18_730);
    expect(r.deductions.employment).toBe(35_700);
    expect(r.deductions.incomeTax).toBe(190_620);
    expect(r.deductions.localTax).toBe(19_060);
    expect(r.totalDeduction).toBe(595_120);
    expect(r.monthlyNet).toBe(3_571_547); // 4,166,666.67 − 595,120 (반올림)
  });

  it("고소득: 국민연금 기준소득월액 상한(659만) 적용", () => {
    // 연봉 3억, 비과세 0 → 과세 월 2,500만 > 상한 659만
    // 국민연금 = floor10(6,590,000 × 0.0475) = 313,020 (최대 부담분)
    const r = calcSalary({
      annualSalary: 300_000_000,
      monthlyNonTax: 0,
      dependents: 1,
      children: 0,
    });
    expect(r.deductions.pension).toBe(313_020);
    // 건강보험은 상한이 훨씬 높아 그대로 비례: floor10(25,000,000 × 0.03595) = 898,750
    expect(r.deductions.health).toBe(898_750);
  });

  it("저소득: 소득세 0 하한 (음수 금지)", () => {
    const r = calcSalary({
      annualSalary: 12_000_000,
      monthlyNonTax: 200_000,
      dependents: 4,
      children: 2,
    });
    expect(r.deductions.incomeTax).toBe(0);
    expect(r.deductions.localTax).toBe(0);
    expect(r.monthlyNet).toBeGreaterThan(0);
    expect(r.monthlyNet).toBeLessThan(1_000_000);
  });

  it("연봉 0 → 전부 0", () => {
    const r = calcSalary({ annualSalary: 0, monthlyNonTax: 200_000, dependents: 1, children: 0 });
    expect(r.monthlyGross).toBe(0);
    expect(r.totalDeduction).toBe(0);
    expect(r.monthlyNet).toBe(0);
  });

  it("비과세가 월급보다 커도 과세소득이 음수가 되지 않는다", () => {
    const r = calcSalary({ annualSalary: 1_200_000, monthlyNonTax: 999_999, dependents: 1, children: 0 });
    expect(r.totalDeduction).toBeGreaterThanOrEqual(0);
    expect(r.monthlyNet).toBeGreaterThanOrEqual(0);
    expect(r.monthlyNet).toBeLessThanOrEqual(100_000);
  });
});

describe("근로소득 간이세액표 (calcIncomeTax)", () => {
  it("국세청 안내 예시: 월급여 3,500천원 행, 가족 1~6명", () => {
    // 국세청 근로소득 간이세액표 안내 페이지의 3,500~3,520천원 행
    const expected = [127_220, 102_220, 62_460, 49_340, 37_630, 32_380];
    expected.forEach((tax, i) => expect(calcIncomeTax(3_500_000, i + 1, 0)).toBe(tax));
  });

  it("8~20세 자녀 차감 (2026.2.27 개정: 1명 20,830 / 2명 45,830 / 3명부터 +33,330)", () => {
    expect(calcIncomeTax(3_500_000, 4, 1)).toBe(49_340 - 20_830);
    expect(calcIncomeTax(3_500_000, 4, 2)).toBe(49_340 - 45_830);
    expect(calcIncomeTax(3_500_000, 5, 3)).toBe(Math.max(0, 37_630 - 45_830 - 33_330));
  });

  it("표의 첫 행(770천원) 미만은 0원", () => {
    expect(calcIncomeTax(700_000, 1, 0)).toBe(0);
  });

  it("10,000천원 정확값과 초과 산식", () => {
    expect(calcIncomeTax(10_000_000, 1, 0)).toBe(1_507_400);
    // 1,507,400 + (2,300,000 × 98% × 35%) + 25,000
    expect(calcIncomeTax(12_300_000, 1, 0)).toBe(2_321_300);
    // 1,507,400 + 1,397,000 + (6,000,000 × 98% × 38%) = 5,138,800
    expect(calcIncomeTax(20_000_000, 1, 0)).toBe(5_138_800);
  });

  it("가족 11명 초과: 11명 세액 − (10명 − 11명) × 초과 인원", () => {
    // 3,500천원 행의 10·11명 값은 원표에서 조회되므로 단조 감소만 확인
    const t11 = calcIncomeTax(5_000_000, 11, 0);
    const t10 = calcIncomeTax(5_000_000, 10, 0);
    expect(calcIncomeTax(5_000_000, 12, 0)).toBe(Math.max(0, t11 - (t10 - t11)));
  });
});

describe("퇴직금 (calcSeverance)", () => {
  it("3년 재직 · 월 300만 — 법정 산식 수기 검산", () => {
    // 재직 1,096일(2024 윤년 포함), 산정기간 2025-10-01~2026-01-01 = 92일
    // 평균임금 = 9,000,000 / 92 = 97,826.09 → 반올림 97,826
    // 퇴직금 = 97,826.09 × 30 × (1096/365) = 8,812,388
    const r = calcSeverance({
      joinDate: "2023-01-01",
      leaveDate: "2026-01-01",
      monthlyWage: 3_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.valid).toBe(true);
    expect(r.eligible).toBe(true);
    expect(r.serviceDays).toBe(1096);
    expect(r.periodDays).toBe(92);
    expect(r.avgDailyWage).toBe(97_826);
    expect(r.severancePay).toBe(8_812_388);
  });

  it("상여·연차수당 3/12 가산 (근로기준법 시행령 §2)", () => {
    // 연간상여 1,200만 → 300만 가산 / 연차수당 120만 → 30만 가산
    const r = calcSeverance({
      joinDate: "2025-01-01",
      leaveDate: "2026-01-01",
      monthlyWage: 3_000_000,
      annualBonus: 12_000_000,
      annualLeaveAllowance: 1_200_000,
    });
    expect(r.bonusPortion).toBe(3_000_000);
    expect(r.leavePortion).toBe(300_000);
    expect(r.totalWage).toBe(12_300_000);
  });

  it("1년 미만은 eligible=false", () => {
    const r = calcSeverance({
      joinDate: "2025-06-01",
      leaveDate: "2026-01-01",
      monthlyWage: 3_000_000,
      annualBonus: 0,
      annualLeaveAllowance: 0,
    });
    expect(r.valid).toBe(true);
    expect(r.eligible).toBe(false);
  });

  it("잘못된 날짜(2월 30일)·역순 날짜는 invalid", () => {
    expect(
      calcSeverance({ joinDate: "2025-02-30", leaveDate: "2026-01-01", monthlyWage: 1, annualBonus: 0, annualLeaveAllowance: 0 }).valid,
    ).toBe(false);
    expect(
      calcSeverance({ joinDate: "2026-01-01", leaveDate: "2025-01-01", monthlyWage: 1, annualBonus: 0, annualLeaveAllowance: 0 }).valid,
    ).toBe(false);
  });
});

describe("주휴수당 (calcWage)", () => {
  it("2026 최저시급 10,320원 · 주 40시간 — 주휴 8시간 = 82,560원", () => {
    const r = calcWage({ hourlyWage: 10_320, weeklyHours: 40 })!;
    expect(r.eligible).toBe(true);
    expect(r.weeklyHolidayHours).toBe(8);
    expect(r.weeklyHolidayPay).toBe(82_560);
    expect(r.weeklyBasePay).toBe(412_800);
    expect(r.weeklyTotalPay).toBe(495_360);
    // 월 환산 = 48h × 4.345주 × 10,320 = 2,152,339.2 → 2,152,339
    expect(r.monthlyPay).toBe(2_152_339);
  });

  it("주 20시간 — 주휴 = 20/40×8 = 4시간", () => {
    const r = calcWage({ hourlyWage: 10_320, weeklyHours: 20 })!;
    expect(r.weeklyHolidayHours).toBe(4);
    expect(r.weeklyHolidayPay).toBe(41_280);
  });

  it("주 15시간 미만은 주휴수당 없음", () => {
    const r = calcWage({ hourlyWage: 10_320, weeklyHours: 14.5 })!;
    expect(r.eligible).toBe(false);
    expect(r.weeklyHolidayPay).toBe(0);
  });

  it("주 52시간이라도 주휴시간은 8시간 상한", () => {
    const r = calcWage({ hourlyWage: 10_320, weeklyHours: 52 })!;
    expect(r.weeklyHolidayHours).toBe(8);
  });

  it("0 입력은 null", () => {
    expect(calcWage({ hourlyWage: 0, weeklyHours: 40 })).toBeNull();
    expect(calcWage({ hourlyWage: 10_320, weeklyHours: 0 })).toBeNull();
  });
});
