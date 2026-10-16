"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { calcSalary } from "@/lib/calc/salary";
import { trackToolUse } from "@/lib/common/analytics";

const won = (n: number) => n.toLocaleString("ko-KR");

/** 만원 단위 입력을 위한 프리셋 */
const SALARY_PRESETS = [3000, 3600, 4000, 5000, 6000];

export default function SalaryTool() {
  // 연봉은 만원 단위로 입력받는다 (한국에서 가장 익숙한 단위)
  const [salaryManwon, setSalaryManwon] = useState(3600);
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [nonTaxManwon, setNonTaxManwon] = useState(20); // 월 비과세(식대 등), 만원

  const result = useMemo(
    () =>
      calcSalary({
        annualSalary: salaryManwon * 10_000,
        monthlyNonTax: nonTaxManwon * 10_000,
        dependents,
        children,
      }),
    [salaryManwon, nonTaxManwon, dependents, children],
  );

  // 기본값에서 입력을 바꾼 순간 = 실제 사용 (세션당 1회만 집계)
  const usedRef = useRef(false);
  useEffect(() => {
    if (usedRef.current) return;
    if (salaryManwon !== 3600 || dependents !== 1 || children !== 0 || nonTaxManwon !== 20) {
      usedRef.current = true;
      trackToolUse("salary");
    }
  }, [salaryManwon, dependents, children, nonTaxManwon]);

  const d = result.deductions;
  const breakdown = [
    { label: "국민연금", value: d.pension, hint: "4.75%" },
    { label: "건강보험", value: d.health, hint: "3.595%" },
    { label: "장기요양", value: d.longTermCare, hint: "건강보험료의 12.95%→13.14%" },
    { label: "고용보험", value: d.employment, hint: "0.9%" },
    { label: "근로소득세", value: d.incomeTax, hint: "간이세액표" },
    { label: "지방소득세", value: d.localTax, hint: "소득세의 10%" },
  ];

  return (
    <div className="space-y-6">
      {/* 연봉 입력 */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-brand-black">
          연봉 (세전)
        </label>
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="number"
              min={0}
              step={100}
              value={salaryManwon}
              onChange={(e) => setSalaryManwon(Math.max(0, Number(e.target.value) || 0))}
              aria-label="연봉(만원)"
              className="w-full px-4 py-3 pr-16 rounded-xl border border-brand-light bg-brand-white text-brand-black text-2xl font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-mid text-sm">
              만원
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {SALARY_PRESETS.map((p) => (
            <button
              key={p}
              onClick={() => setSalaryManwon(p)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                salaryManwon === p
                  ? "bg-brand-accent text-white"
                  : "bg-brand-paper text-brand-mid hover:text-brand-black"
              }`}
            >
              {won(p)}만
            </button>
          ))}
        </div>
      </div>

      {/* 옵션 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs text-brand-mid">부양가족 수 (본인 포함)</label>
          <input
            type="number"
            min={1}
            value={dependents}
            onChange={(e) => setDependents(Math.max(1, Number(e.target.value) || 1))}
            aria-label="부양가족 수"
            className="w-full px-3 py-2 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-brand-mid">8~20세 자녀 수</label>
          <input
            type="number"
            min={0}
            value={children}
            onChange={(e) => setChildren(Math.max(0, Number(e.target.value) || 0))}
            aria-label="8~20세 자녀 수"
            className="w-full px-3 py-2 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
          />
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs text-brand-mid">월 비과세액 (식대 등)</label>
          <div className="relative">
            <input
              type="number"
              min={0}
              value={nonTaxManwon}
              onChange={(e) => setNonTaxManwon(Math.max(0, Number(e.target.value) || 0))}
              aria-label="월 비과세액(만원)"
              className="w-full px-3 py-2 pr-12 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-mid text-xs">
              만원
            </span>
          </div>
        </div>
      </div>

      {/* 핵심 결과: 월 실수령액 */}
      <div className="bg-brand-black rounded-xl p-6 text-center">
        <p className="text-sm text-brand-light mb-1">월 예상 실수령액</p>
        <p className="font-mono text-5xl font-bold text-brand-paper">
          {won(result.monthlyNet)}
          <span className="text-2xl text-brand-light ml-1">원</span>
        </p>
        <div className="mt-4 flex justify-center gap-6 text-sm">
          <span className="text-brand-light">
            연 실수령 <span className="text-brand-paper font-mono">{won(result.annualNet)}</span>원
          </span>
          <span className="text-brand-light">
            월 공제 <span className="text-brand-accent font-mono">{won(result.totalDeduction)}</span>원
          </span>
        </div>
      </div>

      {/* 공제 내역 */}
      <div className="bg-brand-paper rounded-xl p-6 space-y-4">
        <div className="flex items-baseline justify-between">
          <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
            월 공제 내역
          </h3>
          <span className="text-xs text-brand-mid">
            세전 월급 {won(result.monthlyGross)}원
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {breakdown.map((item) => (
            <div key={item.label} className="bg-brand-white rounded-lg p-3">
              <p className="text-xs text-brand-mid mb-0.5">{item.label}</p>
              <p className="font-mono text-brand-black">{won(item.value)}<span className="text-xs text-brand-mid ml-0.5">원</span></p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between pt-2 border-t border-brand-light/40">
          <span className="text-sm font-medium text-brand-black">공제 합계</span>
          <span className="font-mono text-brand-black">{won(result.totalDeduction)}원</span>
        </div>
      </div>

      {/* 안내 */}
      <p className="text-xs text-brand-mid leading-relaxed">
        2026년 4대보험 요율과 근로소득 간이세액표(소득세법 시행령 별표2)로 계산한 <strong>예상치</strong>입니다.
        회사에 신고한 공제대상가족 수, 비과세 항목, 원천징수 비율 선택에 따라 실제 급여명세서와 다를 수
        있습니다. 연봉과 가족 수는 이 화면 안에서만 계산에 쓰이고 어디로도 보내지 않습니다.
      </p>
    </div>
  );
}
