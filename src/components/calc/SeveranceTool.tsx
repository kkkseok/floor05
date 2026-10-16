"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calcSeverance } from "@/lib/calc/severance";
import { trackToolUse } from "@/lib/common/analytics";

const won = (n: number) => n.toLocaleString("ko-KR");

export default function SeveranceTool() {
  // hydration 안전을 위해 고정 예시 기본값 사용
  const [joinDate, setJoinDate] = useState("2022-01-01");
  const [leaveDate, setLeaveDate] = useState("2025-01-01");
  const [wageManwon, setWageManwon] = useState(300); // 월 평균급여(만원)
  const [bonusManwon, setBonusManwon] = useState(0); // 연간 상여금(만원)
  const [leaveAllowManwon, setLeaveAllowManwon] = useState(0); // 연차수당(만원)
  const [ordinaryManwon, setOrdinaryManwon] = useState(0); // 월 통상임금(만원, 선택)

  const result = useMemo(
    () =>
      calcSeverance({
        joinDate,
        leaveDate,
        monthlyWage: wageManwon * 10_000,
        annualBonus: bonusManwon * 10_000,
        annualLeaveAllowance: leaveAllowManwon * 10_000,
        monthlyOrdinaryWage: ordinaryManwon * 10_000,
      }),
    [joinDate, leaveDate, wageManwon, bonusManwon, leaveAllowManwon, ordinaryManwon],
  );

  // 기본 예시값에서 입력을 바꾼 순간 = 실제 사용 (세션당 1회만 집계)
  const usedRef = useRef(false);
  useEffect(() => {
    if (usedRef.current) return;
    if (
      joinDate !== "2022-01-01" ||
      leaveDate !== "2025-01-01" ||
      wageManwon !== 300 ||
      bonusManwon !== 0 ||
      leaveAllowManwon !== 0 ||
      ordinaryManwon !== 0
    ) {
      usedRef.current = true;
      trackToolUse("severance");
    }
  }, [joinDate, leaveDate, wageManwon, bonusManwon, leaveAllowManwon, ordinaryManwon]);

  return (
    <div className="space-y-6">
      {/* 재직 기간 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-brand-black">입사일</label>
          <input
            type="date"
            value={joinDate}
            onChange={(e) => setJoinDate(e.target.value)}
            aria-label="입사일"
            className="w-full px-3 py-2.5 rounded-lg border border-brand-light text-brand-black font-mono focus:outline-none focus:border-brand-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-brand-black">퇴직일</label>
          <input
            type="date"
            value={leaveDate}
            onChange={(e) => setLeaveDate(e.target.value)}
            aria-label="퇴직일"
            className="w-full px-3 py-2.5 rounded-lg border border-brand-light text-brand-black font-mono focus:outline-none focus:border-brand-accent"
          />
          <p className="text-xs text-brand-mid">마지막 근무일의 다음 날을 입력하세요.</p>
        </div>
      </div>

      {/* 급여 */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-brand-black">
          퇴직 전 3개월 월 평균 급여 (세전)
        </label>
        <div className="relative">
          <input
            type="number"
            min={0}
            step={10}
            value={wageManwon}
            onChange={(e) => setWageManwon(Math.max(0, Number(e.target.value) || 0))}
            aria-label="월 평균 급여(만원)"
            className="w-full px-4 py-3 pr-16 rounded-xl border border-brand-light bg-brand-white text-brand-black text-2xl font-mono focus:outline-none focus:border-brand-accent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-mid text-sm">
            만원
          </span>
        </div>
        <p className="text-xs text-brand-mid">
          기본급에 정기수당을 포함한 세전 월급입니다. 3개월이 다르면 평균을 입력하세요.
        </p>
      </div>

      {/* 선택: 상여금·연차수당 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs text-brand-mid">연간 상여금 (선택)</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={bonusManwon}
              onChange={(e) => setBonusManwon(Math.max(0, Number(e.target.value) || 0))}
              aria-label="연간 상여금(만원)"
              className="w-full px-3 py-2 pr-12 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid text-xs">
              만원
            </span>
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-brand-mid">연차수당 (선택)</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={leaveAllowManwon}
              onChange={(e) => setLeaveAllowManwon(Math.max(0, Number(e.target.value) || 0))}
              aria-label="연차수당(만원)"
              className="w-full px-3 py-2 pr-12 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid text-xs">
              만원
            </span>
          </div>
        </div>
      </div>
      <p className="text-xs text-brand-mid -mt-2">
        상여금·연차수당은 연간 총액을 입력하면 3개월분(×3/12)이 평균임금에 반영됩니다.
      </p>

      <div className="space-y-1.5">
        <label className="block text-xs text-brand-mid" htmlFor="ordinary-wage">월 통상임금 (선택)</label>
        <div className="relative">
          <input
            id="ordinary-wage"
            type="number"
            min={0}
            value={ordinaryManwon}
            onChange={(e) => setOrdinaryManwon(Math.max(0, Number(e.target.value) || 0))}
            aria-label="월 통상임금(만원)"
            className="w-full px-3 py-2 pr-12 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
          />
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid text-xs">만원</span>
        </div>
        <p className="text-xs text-brand-mid">
          기본급과 매달 고정으로 받는 수당의 합입니다. 휴업·결근으로 최근 3개월 급여가 줄었다면 넣어 보세요.
          평균임금이 통상임금보다 낮으면 통상임금으로 계산합니다(주 40시간 기준, 월 209시간·하루 8시간).
        </p>
      </div>

      {/* 결과 */}
      {!result.valid ? (
        <div className="bg-brand-paper rounded-xl p-6 text-center text-brand-mid">
          입사일과 퇴직일을 올바르게 입력하면 퇴직금이 계산됩니다.
        </div>
      ) : (
        <>
          {/* 핵심: 퇴직금 */}
          <div className="bg-brand-black rounded-xl p-6 text-center">
            <p className="text-sm text-brand-light mb-1">예상 퇴직금 (세전)</p>
            <p className="font-mono text-5xl font-bold text-brand-paper">
              {won(result.severancePay)}
              <span className="text-2xl text-brand-light ml-1">원</span>
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm">
              <span className="text-brand-light">
                재직 <span className="text-brand-paper font-mono">{won(result.serviceDays)}</span>일
                ({result.serviceYears.toFixed(2)}년)
              </span>
              <span className="text-brand-light">
                1일 평균임금 <span className="text-brand-paper font-mono">{won(result.avgDailyWage)}</span>원
              </span>
            </div>
          </div>

          {/* 1년 미만 경고 */}
          {!result.eligible && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-4 text-sm text-brand-black">
              재직기간이 1년(365일) 미만이라 법정 퇴직금 지급 대상이 아닙니다. 위 금액은 같은 산식을
              재직일수만큼 비례해 계산한 참고값이며, 법으로 받을 수 있는 금액은 아닙니다.
            </div>
          )}

          {/* 평균임금 구성 */}
          <div className="bg-brand-paper rounded-xl p-6 space-y-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
                평균임금 산정
              </h3>
              <span className="text-xs text-brand-mid">
                직전 3개월 {won(result.periodDays)}일 기준
              </span>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-brand-mid">3개월 급여</span>
                <span className="font-mono text-brand-black">{won(result.threeMonthWage)}원</span>
              </div>
              {result.bonusPortion > 0 && (
                <div className="flex justify-between">
                  <span className="text-brand-mid">상여금 가산 (×3/12)</span>
                  <span className="font-mono text-brand-black">{won(result.bonusPortion)}원</span>
                </div>
              )}
              {result.leavePortion > 0 && (
                <div className="flex justify-between">
                  <span className="text-brand-mid">연차수당 가산 (×3/12)</span>
                  <span className="font-mono text-brand-black">{won(result.leavePortion)}원</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-brand-light/40">
                <span className="font-medium text-brand-black">임금총액</span>
                <span className="font-mono text-brand-black">{won(result.totalWage)}원</span>
              </div>
            </div>
            {result.ordinaryApplied ? (
              <p className="text-xs text-brand-mid pt-1">
                1일 평균임금({won(result.avgDailyWage)}원)이 1일 통상임금({won(result.ordinaryDailyWage)}원)보다
                적어 통상임금으로 계산했습니다. 퇴직금 = {won(result.ordinaryDailyWage)}원 × 30일 × (재직{" "}
                {won(result.serviceDays)}일 ÷ 365)
              </p>
            ) : (
              <p className="text-xs text-brand-mid pt-1">
                퇴직금 = 1일 평균임금({won(result.avgDailyWage)}원) × 30일 ×
                (재직 {won(result.serviceDays)}일 ÷ 365)
              </p>
            )}
          </div>
        </>
      )}

      {/* 안내 */}
      <p className="text-xs text-brand-mid leading-relaxed">
        근로기준법 평균임금 방식으로 계산한 <strong>세전 추정치</strong>입니다. 실제 수령액은
        퇴직소득세·지방소득세가 차감되며 근속연수에 따라 달라집니다. 입력한 값은 서버로 전송되지
        않습니다.
      </p>
    </div>
  );
}
