/**
 * 주휴수당·주급·월 환산 계산 (100% 클라이언트, 순수 함수)
 * - 주휴수당 = (1주 소정근로시간 ÷ 40) × 8 × 시급 (주휴시간 최대 8시간)
 * - 1주 소정근로 15시간 이상이어야 발생
 * - 월 환산 시간 = (1주 소정근로 + 주휴) × 365 ÷ 7 ÷ 12 를 반올림 (주 40시간 → 209시간, 고용노동부 고시와 같은 방식)
 */

export interface WageInput {
  /** 시급(원) */
  hourlyWage: number;
  /** 1주 소정근로시간 */
  weeklyHours: number;
}

export interface WageResult {
  /** 주휴수당 발생 여부 (주 15시간 이상) */
  eligible: boolean;
  /** 주휴시간 (최대 8시간) */
  weeklyHolidayHours: number;
  /** 주휴수당 (1주) */
  weeklyHolidayPay: number;
  /** 소정근로 주급 (주휴 제외) */
  weeklyBasePay: number;
  /** 주휴 포함 주급 */
  weeklyTotalPay: number;
  /** 월 환산 시간 (주휴 포함) */
  monthlyHours: number;
  /** 주휴 포함 월 환산 급여 */
  monthlyPay: number;
}

export function calcWage(input: WageInput): WageResult | null {
  const hourlyWage = Math.max(0, input.hourlyWage);
  const weeklyHours = Math.max(0, input.weeklyHours);
  if (hourlyWage <= 0 || weeklyHours <= 0) return null;

  const eligible = weeklyHours >= 15;
  // 주휴시간 = min(주 소정근로, 40) ÷ 40 × 8 (40시간 이상은 8시간 고정)
  const weeklyHolidayHours = eligible ? (Math.min(weeklyHours, 40) / 40) * 8 : 0;

  const weeklyHolidayPay = Math.round(weeklyHolidayHours * hourlyWage);
  const weeklyBasePay = Math.round(weeklyHours * hourlyWage);
  const weeklyTotalPay = weeklyBasePay + weeklyHolidayPay;
  // 월 환산: 한 달 평균 주 수(365 ÷ 7 ÷ 12 ≈ 4.345)를 곱한 시간을 반올림 → 주 40시간이면 208.6 → 209시간.
  // 예전에는 반올림 없이 4.345를 곱해 209시간 기준(고시 월 환산액)과 수천 원 어긋났다.
  const monthlyHours = Math.round(((weeklyHours + weeklyHolidayHours) * 365) / 7 / 12);
  const monthlyPay = Math.round(monthlyHours * hourlyWage);

  return {
    eligible,
    weeklyHolidayHours: Math.round(weeklyHolidayHours * 100) / 100,
    weeklyHolidayPay,
    weeklyBasePay,
    weeklyTotalPay,
    monthlyHours,
    monthlyPay,
  };
}
