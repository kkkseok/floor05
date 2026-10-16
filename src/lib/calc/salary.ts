/**
 * 연봉 → 월 실수령액 계산 (100% 클라이언트, 순수 함수)
 * - 4대보험(국민연금·건강·장기요양·고용) + 근로소득세(간이세액표 원표 조회) + 지방소득세 공제
 * - 요율은 ./rates, 간이세액표는 ./incomeTaxTable(법령 별표2에서 생성)
 *
 * 예전에는 간이세액표를 연말정산 산식으로 근사했는데, 간이세액표에 들어 있는 특별소득공제 등이 빠져
 * 소득세가 크게 나왔다(월 350만 원·가족 4명: 표 49,340원 vs 근사 109,180원). 2026-10-16 원표 조회로 교체.
 */

import { INSURANCE, LOCAL_TAX_RATE } from "./rates";
import { TAX_TABLE, TAX_AT_10M, OVER_10M_BRACKETS, CHILD_DEDUCTION } from "./incomeTaxTable";

export interface SalaryInput {
  /** 연봉(세전, 원). 비과세 포함 총액 */
  annualSalary: number;
  /** 월 비과세액(원). 식대 등. 기본 200,000 (2024~ 식대 비과세 한도 월 20만) */
  monthlyNonTax: number;
  /** 공제대상 가족 수(본인 포함). 기본 1 */
  dependents: number;
  /** 8세 이상 20세 이하 자녀 수. 기본 0 */
  children: number;
}

export interface Deductions {
  pension: number; // 국민연금
  health: number; // 건강보험
  longTermCare: number; // 장기요양보험
  employment: number; // 고용보험
  incomeTax: number; // 근로소득세
  localTax: number; // 지방소득세
}

export interface SalaryResult {
  /** 월 세전 급여 (연봉/12) */
  monthlyGross: number;
  /** 월 공제 항목별 금액 */
  deductions: Deductions;
  /** 월 공제 합계 */
  totalDeduction: number;
  /** 월 실수령액 */
  monthlyNet: number;
  /** 연 실수령액 (월 실수령 × 12, 참고용) */
  annualNet: number;
}

/**
 * 원 단위 절사 (10원 미만 버림) — 보험료·세금은 통상 원/십원 단위로 절사.
 * 부동소수점 오차 보정: 35,700이 35,699.99999…로 계산돼 35,690으로
 * 한 단계 낮게 절사되는 것을 막기 위해 미세 epsilon을 더한 뒤 버림한다.
 */
function floor10(n: number): number {
  return Math.floor((n + 0.001) / 10) * 10;
}

/** 국민연금 (월). 기준소득월액 상·하한 적용 */
export function calcPension(taxableMonthly: number): number {
  const base = Math.min(
    INSURANCE.pension.maxBase,
    Math.max(taxableMonthly < INSURANCE.pension.minBase ? 0 : INSURANCE.pension.minBase, taxableMonthly),
  );
  // 과세소득이 하한 미만이면 0으로 본다(실무상 최저 기준소득월액 적용되나 단순화)
  if (taxableMonthly < INSURANCE.pension.minBase) {
    return floor10(taxableMonthly * INSURANCE.pension.rate);
  }
  return floor10(base * INSURANCE.pension.rate);
}

/** 건강보험 (월) */
export function calcHealth(taxableMonthly: number): number {
  return floor10(taxableMonthly * INSURANCE.health.rate);
}

/** 장기요양보험 (월) — 건강보험료 기준 */
export function calcLongTermCare(health: number): number {
  return floor10(health * INSURANCE.longTermCare.rateOfHealth);
}

/** 고용보험 (월) */
export function calcEmployment(taxableMonthly: number): number {
  return floor10(taxableMonthly * INSURANCE.employment.rate);
}

/** 가족 수별 세액 배열에서 조회. 11명 초과는 별표2 비고 4: 11명 세액 − (10명 − 11명) × 초과 인원 */
function taxForFamily(taxes: readonly number[], family: number): number {
  if (family <= 11) return taxes[family - 1];
  return Math.max(0, taxes[10] - (taxes[9] - taxes[10]) * (family - 11));
}

/**
 * 월 근로소득세 — 소득세법 시행령 [별표 2] 근로소득 간이세액표 원표 조회.
 * 월급여는 비과세를 뺀 금액, 공제대상가족은 본인 포함(최소 1명).
 * 10,000천원 초과는 별표의 산식, 8~20세 자녀는 별표 비고 3의 차감액을 뺀다(음수면 0).
 */
export function calcIncomeTax(taxableMonthly: number, dependents: number, children: number): number {
  const family = Math.max(1, Math.floor(dependents) || 1);
  let tax: number;
  if (taxableMonthly < TAX_TABLE[0][0]) {
    tax = 0;
  } else if (taxableMonthly < 10_000_000) {
    // 하한이 월급여 이하인 마지막 행 (이진 탐색)
    let lo = 0;
    let hi = TAX_TABLE.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (TAX_TABLE[mid][0] <= taxableMonthly) lo = mid;
      else hi = mid - 1;
    }
    tax = taxForFamily(TAX_TABLE[lo].slice(1), family);
  } else {
    const at10m = taxForFamily(TAX_AT_10M, family);
    const bracket = [...OVER_10M_BRACKETS].reverse().find((x) => taxableMonthly > x.over);
    tax = bracket
      ? at10m + bracket.base + (taxableMonthly - bracket.from) * bracket.factor * bracket.rate + bracket.add
      : at10m;
  }

  const kids = Math.max(0, Math.floor(children) || 0);
  const childDeduction =
    kids === 0
      ? 0
      : kids === 1
        ? CHILD_DEDUCTION.one
        : CHILD_DEDUCTION.two + Math.max(0, kids - 2) * CHILD_DEDUCTION.perExtra;
  return floor10(Math.max(0, tax - childDeduction));
}

/** 지방소득세 (월) = 소득세 × 10% */
export function calcLocalTax(incomeTax: number): number {
  return floor10(incomeTax * LOCAL_TAX_RATE);
}

/**
 * 연봉 실수령액 메인 계산.
 */
export function calcSalary(input: SalaryInput): SalaryResult {
  const annualSalary = Math.max(0, input.annualSalary);
  const monthlyGross = annualSalary / 12;
  const monthlyNonTax = Math.max(0, Math.min(input.monthlyNonTax, monthlyGross));
  // 4대보험·소득세 산정 기준이 되는 과세 월급여 (비과세 제외)
  const taxableMonthly = Math.max(0, monthlyGross - monthlyNonTax);

  const pension = calcPension(taxableMonthly);
  const health = calcHealth(taxableMonthly);
  const longTermCare = calcLongTermCare(health);
  const employment = calcEmployment(taxableMonthly);

  const incomeTax = calcIncomeTax(taxableMonthly, input.dependents, input.children);
  const localTax = calcLocalTax(incomeTax);

  const deductions: Deductions = {
    pension,
    health,
    longTermCare,
    employment,
    incomeTax,
    localTax,
  };
  const totalDeduction =
    pension + health + longTermCare + employment + incomeTax + localTax;
  const monthlyNet = monthlyGross - totalDeduction;

  return {
    monthlyGross: Math.round(monthlyGross),
    deductions,
    totalDeduction: Math.round(totalDeduction),
    monthlyNet: Math.round(monthlyNet),
    annualNet: Math.round(monthlyNet * 12),
  };
}
