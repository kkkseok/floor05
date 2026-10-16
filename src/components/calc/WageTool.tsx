"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calcWage } from "@/lib/calc/wage";
import { MINIMUM_WAGE } from "@/lib/calc/rates";
import { trackToolUse } from "@/lib/common/analytics";

const won = (n: number) => n.toLocaleString("ko-KR");
const DEFAULT_WAGE = MINIMUM_WAGE.hourly;
const DEFAULT_HOURS = 40;
const HOUR_PRESETS = [15, 20, 30, 40];

export default function WageTool() {
  const [hourlyWage, setHourlyWage] = useState<number>(DEFAULT_WAGE);
  const [weeklyHours, setWeeklyHours] = useState(DEFAULT_HOURS);

  const result = useMemo(() => calcWage({ hourlyWage, weeklyHours }), [hourlyWage, weeklyHours]);

  const usedRef = useRef(false);
  useEffect(() => {
    if (usedRef.current) return;
    if (hourlyWage !== DEFAULT_WAGE || weeklyHours !== DEFAULT_HOURS) {
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
          <button
            onClick={() => setHourlyWage(MINIMUM_WAGE.hourly)}
            className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
              hourlyWage === MINIMUM_WAGE.hourly
                ? "bg-brand-accent text-white"
                : "bg-brand-paper text-brand-mid hover:text-brand-black"
            }`}
          >
            2026 최저시급 {won(MINIMUM_WAGE.hourly)}원
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-brand-black">1주 소정근로시간</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              max={68}
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

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Cell label="소정근로 주급" value={result.weeklyBasePay} />
            <Cell label="주휴 포함 주급" value={result.weeklyTotalPay} accent />
            <Cell label="월 환산 (주휴 포함)" value={result.monthlyPay} />
          </div>

          <p className="text-xs text-brand-mid leading-relaxed">
            주휴수당 = (1주 소정근로시간 ÷ 40) × 8 × 시급이며, 주휴시간은 최대 8시간입니다. 1주
            소정근로 <strong>15시간 이상</strong>이고 그 주에 개근해야 발생합니다. 월 환산은 한 달
            평균 4.345주 기준이라 회사 규정(예: 209시간)과 수천 원 차이가 날 수 있습니다. 시급과 근무시간은 이 화면에서만 계산에 쓰이고 따로 저장되지 않습니다.
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
