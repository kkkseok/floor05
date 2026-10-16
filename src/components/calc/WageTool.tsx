"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calcWage } from "@/lib/calc/wage";
import { MINIMUM_WAGE, MINIMUM_WAGE_2027 } from "@/lib/calc/rates";
import { trackToolUse } from "@/lib/common/analytics";

const won = (n: number) => n.toLocaleString("ko-KR");
const DEFAULT_WAGE = MINIMUM_WAGE.hourly;
const DEFAULT_HOURS = 40;
const HOUR_PRESETS = [15, 20, 30, 40];

export default function WageTool() {
  const [hourlyWage, setHourlyWage] = useState<number>(DEFAULT_WAGE);
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_HOURS);

  const result = useMemo(() => calcWage({ hourlyWage, weeklyHours }), [hourlyWage, weeklyHours]);

  // 2027-01-01부터는 기본값을 2027 최저시급으로(정적 페이지라 화면에 뜬 뒤 날짜를 보고 바꾼다)
  useEffect(() => {
    if (new Date() >= new Date(`${MINIMUM_WAGE_2027.effectiveFrom}T00:00:00+09:00`)) {
      setHourlyWage((w) => (w === DEFAULT_WAGE ? MINIMUM_WAGE_2027.hourly : w));
    }
  }, []);

  const usedRef = useRef(false);
  useEffect(() => {
    if (usedRef.current) return;
    if (
      (hourlyWage !== DEFAULT_WAGE && hourlyWage !== MINIMUM_WAGE_2027.hourly) ||
      weeklyHours !== DEFAULT_HOURS
    ) {
      usedRef.current = true;
      trackToolUse("wage");
    }
  }, [hourlyWage, weeklyHours]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-brand-black">시급</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              step={10}
              value={hourlyWage}
              onChange={(e) => setHourlyWage(Math.max(0, Number(e.target.value) || 0))}
              aria-label="시급(원)"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-light bg-brand-white text-brand-black text-2xl font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-mid text-sm">원</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { year: 2026, hourly: MINIMUM_WAGE.hourly },
              { year: 2027, hourly: MINIMUM_WAGE_2027.hourly },
            ].map((m) => (
              <button
                key={m.year}
                onClick={() => setHourlyWage(m.hourly)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  hourlyWage === m.hourly
                    ? "bg-brand-accent text-white"
                    : "bg-brand-paper text-brand-mid hover:text-brand-black"
                }`}
              >
                {m.year} 최저시급 {won(m.hourly)}원
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-brand-black">1주 소정근로시간</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={52}
              step={1}
              value={weeklyHours}
              onChange={(e) => setWeeklyHours(Math.max(0, Number(e.target.value) || 0))}
              aria-label="1주 소정근로시간"
              className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-light bg-brand-white text-brand-black text-2xl font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-mid text-sm">시간</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {HOUR_PRESETS.map((h) => (
              <button
                key={h}
                onClick={() => setWeeklyHours(h)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                  weeklyHours === h
                    ? "bg-brand-accent text-white"
                    : "bg-brand-paper text-brand-mid hover:text-brand-black"
                }`}
              >
                {h}시간
              </button>
            ))}
          </div>
        </div>
      </div>

      {result && (
        <>
          {result.eligible ? (
            <div className="bg-brand-black rounded-xl p-6 text-center">
              <p className="text-sm text-brand-light mb-1">주휴수당 (1주)</p>
              <p className="font-mono text-4xl sm:text-5xl font-bold text-brand-paper">
                {won(result.weeklyHolidayPay)}
                <span className="text-xl text-brand-light ml-1">원</span>
              </p>
              <p className="mt-2 text-brand-light text-sm">
                주휴시간 {result.weeklyHolidayHours}시간 × 시급
              </p>
            </div>
          ) : (
            <div className="bg-brand-paper rounded-xl p-6 text-center">
              <p className="text-brand-black font-medium">주휴수당 발생 대상이 아닙니다</p>
              <p className="mt-1 text-sm text-brand-mid">
                1주 소정근로시간이 15시간 이상이어야 주휴수당이 발생합니다.
              </p>
            </div>
          )}

          {weeklyHours > 40 && (
            <div className="bg-brand-accent/10 border border-brand-accent/30 rounded-xl p-4 text-sm text-brand-black">
              주 40시간을 넘는 {weeklyHours - 40}시간은 연장근로입니다. 5인 이상 사업장은 연장근로에 50%를 더
              받아야 하지만, 이 계산은 가산 없이 시급 그대로 곱했습니다. 법정 근로시간은 연장근로를 합쳐 주 52시간까지입니다.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Cell label="소정근로 주급" value={result.weeklyBasePay} />
            <Cell label="주휴 포함 주급" value={result.weeklyTotalPay} accent />
            <Cell label={`월 환산 (주휴 포함 ${result.monthlyHours}시간)`} value={result.monthlyPay} />
          </div>

          <p className="text-xs text-brand-mid leading-relaxed">
            주휴수당 = (1주 소정근로시간 ÷ 40) × 8 × 시급이며, 주휴시간은 최대 8시간입니다. 1주
            소정근로 <strong>15시간 이상</strong>이고 그 주에 개근해야 발생합니다. 월 환산 시간은
            (소정근로 + 주휴) × 365 ÷ 7 ÷ 12를 반올림해, 주 40시간이면 고시와 같은 209시간입니다. 시급과 근무시간은 이 화면에서만 계산에 쓰이고 따로 저장되지 않습니다.
          </p>
        </>
      )}
    </div>
  );
}

function Cell({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className={`rounded-xl p-4 text-center ${accent ? "bg-brand-black" : "bg-brand-paper"}`}>
      <p className={`text-xs mb-1 ${accent ? "text-brand-light" : "text-brand-mid"}`}>{label}</p>
      <p className={`font-mono text-lg font-bold ${accent ? "text-brand-paper" : "text-brand-black"}`}>
        {won(value)}
        <span className={`text-xs font-normal ml-0.5 ${accent ? "text-brand-light" : "text-brand-mid"}`}>원</span>
      </p>
    </div>
  );
}
