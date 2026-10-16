/**
 * 퇴직금 계산 (100% 클라이언트, 순수 함수)
 * - 법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
 * - 1일 평균임금 = 퇴직 전 3개월 임금총액 ÷ 그 기간의 일수
 * - 임금총액 = 3개월 급여 + 연간상여금×(3/12) + 연차수당×(3/12)
 *   (근로기준법 시행령 제2조 평균임금 산정 방식)
 *
 * ⚠️ 세전 퇴직금이다. 실제 수령액은 퇴직소득세·지방소득세가 차감되며,
 *    근속연수·금액에 따라 세액이 달라져 본 계산에는 포함하지 않는다.
 */

import { SEVERANCE } from "./rates";

export interface SeveranceInput {
  /** 입사일 (YYYY-MM-DD) */
  joinDate: string;
  /** 퇴직일 = 마지막 근무일의 다음 날 (YYYY-MM-DD) */
  leaveDate: string;
  /** 퇴직 전 3개월 월 평균 급여(세전, 원) */
  monthlyWage: number;
  /** 연간 상여금 총액 (원, 없으면 0) */
  annualBonus: number;
  /** 연차수당 (원, 없으면 0) */
  annualLeaveAllowance: number;
  /** 월 통상임금 (원, 선택). 평균임금이 통상임금보다 적으면 통상임금으로 계산(근로기준법 제2조 제2항) */
  monthlyOrdinaryWage?: number;
}

export interface SeveranceResult {
  /** 재직일수 */
  serviceDays: number;
  /** 재직 연수(소수, 참고용) */
  serviceYears: number;
  /** 평균임금 산정 기간 일수 (퇴직 직전 3개월) */
  periodDays: number;
  /** 3개월 임금 */
  threeMonthWage: number;
  /** 상여 가산분 (연간상여 × 3/12) */
  bonusPortion: number;
  /** 연차수당 가산분 (연차수당 × 3/12) */
  leavePortion: number;
  /** 임금총액 */
  totalWage: number;
  /** 1일 평균임금 (3개월 임금총액 기준) */
  avgDailyWage: number;
  /** 1일 통상임금 (월 통상임금 ÷ 209시간 × 8시간, 입력 없으면 0) */
  ordinaryDailyWage: number;
  /** 평균임금 대신 통상임금으로 계산했는지 */
  ordinaryApplied: boolean;
  /** 세전 퇴직금 */
  severancePay: number;
  /** 1년(365일) 이상 재직 — 법정 퇴직금 대상 여부 */
  eligible: boolean;
  /** 입력이 유효한지 (날짜 파싱 가능·퇴직일>입사일) */
  valid: boolean;
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** "YYYY-MM-DD"를 로컬 자정 Date로 파싱. 실패 시 null */
function parseDate(s: string): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s.trim());
  if (!m) return null;
  const [, y, mo, d] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d));
  // 윤년·말일 오버플로 검증 (예: 2월 30일 → 무효)
  if (
    date.getFullYear() !== Number(y) ||
    date.getMonth() !== Number(mo) - 1 ||
    date.getDate() !== Number(d)
  ) {
    return null;
  }
  return date;
}

/** 두 날짜 사이 일수 (b − a) */
function diffDays(a: Date, b: Date): number {
  return Math.round((b.getTime() - a.getTime()) / DAY_MS);
}

/** 기준일에서 n개월 전 (말일 오버플로는 해당 월 말일로 보정) */
function monthsBefore(date: Date, months: number): Date {
  const d = new Date(date.getFullYear(), date.getMonth() - months, date.getDate());
  // setMonth 오버플로(예: 5/31 − 3개월 = 2/31→3/3) 보정: 일자가 바뀌면 그 달 말일로
  if (d.getDate() !== date.getDate()) {
    d.setDate(0);
  }
  return d;
}

const EMPTY: SeveranceResult = {
  serviceDays: 0,
  serviceYears: 0,
  periodDays: 0,
  threeMonthWage: 0,
  bonusPortion: 0,
  leavePortion: 0,
  totalWage: 0,
  avgDailyWage: 0,
  ordinaryDailyWage: 0,
  ordinaryApplied: false,
  severancePay: 0,
  eligible: false,
  valid: false,
};

export function calcSeverance(input: SeveranceInput): SeveranceResult {
  const join = parseDate(input.joinDate);
  const leave = parseDate(input.leaveDate);
  if (!join || !leave) return { ...EMPTY };

  const serviceDays = diffDays(join, leave);
  if (serviceDays <= 0) return { ...EMPTY };

  const periodStart = monthsBefore(leave, 3);
  const periodDays = diffDays(periodStart, leave) || 1; // 0 나눗셈 방지

  const monthlyWage = Math.max(0, input.monthlyWage);
  const annualBonus = Math.max(0, input.annualBonus);
  const annualLeaveAllowance = Math.max(0, input.annualLeaveAllowance);

  const threeMonthWage = monthlyWage * 3;
  const bonusPortion = (annualBonus * 3) / 12;
  const leavePortion = (annualLeaveAllowance * 3) / 12;
  const totalWage = threeMonthWage + bonusPortion + leavePortion;

  const avgDailyWage = totalWage / periodDays;
  // 1일 통상임금 = 통상시급(월 통상임금 ÷ 월 소정근로시간 209) × 1일 소정근로시간 8 (주 40시간 기준)
  const ordinaryDailyWage =
    (Math.max(0, input.monthlyOrdinaryWage ?? 0) / SEVERANCE.monthlyHours) * SEVERANCE.dailyHours;
  const ordinaryApplied = ordinaryDailyWage > avgDailyWage;
  const appliedDaily = ordinaryApplied ? ordinaryDailyWage : avgDailyWage;
  const severancePay =
    appliedDaily * SEVERANCE.daysPerYear * (serviceDays / SEVERANCE.yearDays);

  return {
    serviceDays,
    serviceYears: serviceDays / SEVERANCE.yearDays,
    periodDays,
    threeMonthWage: Math.round(threeMonthWage),
    bonusPortion: Math.round(bonusPortion),
    leavePortion: Math.round(leavePortion),
    totalWage: Math.round(totalWage),
    avgDailyWage: Math.round(avgDailyWage),
    ordinaryDailyWage: Math.round(ordinaryDailyWage),
    ordinaryApplied,
    severancePay: Math.round(severancePay),
    eligible: serviceDays >= SEVERANCE.minDays,
    valid: true,
  };
}
