/**
 * 블로그용 계산 사례: floor05 퇴직금 계산기 함수(src/lib/calc/severance.ts의 calcSeverance)를
 * 그대로 불러 사례별 입력과 출력을 json으로 남긴다. 글의 모든 금액·일수는 이 출력에서 나온다.
 * - severance.ts와 rates.ts를 저장소의 typescript로 메모리에서 CommonJS로 바꿔 실행한다(코드 수정 없음).
 * - 차이·비율 같은 파생값도 여기서 계산해 derived에 넣는다(손계산 금지).
 * 사용(저장소 루트에서): node scripts/blog-measure/severance-cases.mjs docs/blog-data/severance-<날짜>.json
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const ts = require("typescript");
const [, , out] = process.argv;
if (!out) throw new Error("출력 json 경로를 넣어 주세요");

const calcDir = path.resolve("src/lib/calc");
const cache = {};
function load(name) {
  if (cache[name]) return cache[name].exports;
  const src = fs.readFileSync(path.join(calcDir, `${name}.ts`), "utf8");
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  cache[name] = mod;
  new Function("module", "exports", "require", js)(mod, mod.exports, (p) => {
    if (p.startsWith("./")) return load(p.slice(2));
    throw new Error(`예상하지 못한 import: ${p}`);
  });
  return mod.exports;
}
const { calcSeverance } = load("severance");
const { SEVERANCE } = load("rates");

const MAN = 10_000;
/** 계산기 화면과 같은 단위(만원)로 입력을 받아 입력·출력을 함께 돌려준다 */
function run(label, { joinDate, leaveDate, wage, bonus = 0, leave = 0, ordinary = 0 }) {
  const input = {
    joinDate,
    leaveDate,
    monthlyWage: wage * MAN,
    annualBonus: bonus * MAN,
    annualLeaveAllowance: leave * MAN,
    monthlyOrdinaryWage: ordinary * MAN,
  };
  const output = calcSeverance(input);
  return { label, input, output: { ...output, serviceYearsFixed2: output.serviceYears.toFixed(2) } };
}
const pct = (a, b) => Number(((a / b - 1) * 100).toFixed(1));

// ── A. 퇴직일(매월 1일)별 직전 3개월 일수 — 월급 300만 원, 재직 정확히 365일 ──────────
const periodByMonth = [];
for (let m = 1; m <= 12; m++) {
  const mm = String(m).padStart(2, "0");
  periodByMonth.push(run(`2027-${mm}-01 퇴직`, { joinDate: `2026-${mm}-01`, leaveDate: `2027-${mm}-01`, wage: 300 }));
}
const groups = {};
for (const c of periodByMonth) {
  const k = c.output.periodDays;
  groups[k] ??= { periodDays: k, leaveMonths: [], serviceDays: c.output.serviceDays, avgDailyWage: c.output.avgDailyWage, severancePay: c.output.severancePay };
  if (groups[k].avgDailyWage !== c.output.avgDailyWage || groups[k].severancePay !== c.output.severancePay || groups[k].serviceDays !== c.output.serviceDays)
    throw new Error("같은 일수인데 결과가 다름");
  groups[k].leaveMonths.push(Number(c.input.leaveDate.slice(5, 7)));
}
const periodGroups = Object.values(groups).sort((a, b) => a.periodDays - b.periodDays);
const pMin = periodGroups[0];
const pMax = periodGroups[periodGroups.length - 1];

// ── B. 재직일수 — 퇴직일 2027-01-01 고정, 월급 300만 원 ─────────────────────────────
const serviceCases = [
  ["2026-01-02", "1년에서 하루 모자람"],
  ["2026-01-01", "1년"],
  ["2025-12-31", "1년 + 하루"],
  ["2025-07-01", "1년 6개월"],
  ["2024-01-01", "3년"],
  ["2022-01-01", "5년"],
  ["2017-01-01", "10년"],
].map(([joinDate, label]) => run(label, { joinDate, leaveDate: "2027-01-01", wage: 300 }));
const byLabel = (arr, l) => arr.find((c) => c.label === l);

// ── C. 상여·연차수당 — 2024-01-01 입사, 2027-01-01 퇴직 ─────────────────────────────
const base = { joinDate: "2024-01-01", leaveDate: "2027-01-01" };
const bonusCases = [
  run("월급 300만", { ...base, wage: 300 }),
  run("월급 300만 + 연간 상여 600만", { ...base, wage: 300, bonus: 600 }),
  run("월급 300만 + 연차수당 60만", { ...base, wage: 300, leave: 60 }),
  run("월급 300만 + 연간 상여 600만 + 연차수당 60만", { ...base, wage: 300, bonus: 600, leave: 60 }),
  run("월급 350만 (상여 없음)", { ...base, wage: 350 }),
];

// ── D. 통상임금 칸 — 같은 기간, 직전 3개월 월급이 줄어든 경우 포함 ────────────────────
const ordinaryCases = [
  run("월급 300만, 통상임금 비움", { ...base, wage: 300 }),
  run("월급 300만, 통상임금 250만", { ...base, wage: 300, ordinary: 250 }),
  run("월급 300만, 통상임금 300만", { ...base, wage: 300, ordinary: 300 }),
  run("직전 3개월 월급 200만, 통상임금 비움", { ...base, wage: 200 }),
  run("직전 3개월 월급 200만, 통상임금 300만", { ...base, wage: 200, ordinary: 300 }),
];
// 통상임금 칸(만원 단위)에 얼마부터 넣으면 통상임금 기준으로 바뀌는지 1만 원씩 올려 가며 찾는다
function flipPoint(wage, extra = {}) {
  for (let o = 1; o <= 2000; o++) {
    const c = run(`경계 탐색 ${o}만`, { ...base, ...extra, wage, ordinary: o });
    if (c.output.ordinaryApplied) return { wageManwon: wage, ...extra, firstOrdinaryManwonApplied: o, periodDays: c.output.periodDays, avgDailyWage: c.output.avgDailyWage, ordinaryDailyWage: c.output.ordinaryDailyWage };
  }
  return null;
}

// ── 점검용: 계산기 동작 확인(글에 쓰지 않는 것 포함) ─────────────────────────────────
const probes = [
  run("윤년 안 365일: 2024-01-01 입사, 2024-12-31 퇴직(달력상 1년은 2025-01-01)", { joinDate: "2024-01-01", leaveDate: "2024-12-31", wage: 300 }),
  run("윤년 2/29 포함: 2024-01-01 입사, 2025-01-01 퇴직", { joinDate: "2024-01-01", leaveDate: "2025-01-01", wage: 300 }),
  run("도구 기본 예시: 2022-01-01 입사, 2025-01-01 퇴직, 300만", { joinDate: "2022-01-01", leaveDate: "2025-01-01", wage: 300 }),
  ...["2027-05-28", "2027-05-29", "2027-05-30", "2027-05-31"].map((d) => run(`말일 근처 퇴직일 ${d}`, { joinDate: "2024-01-01", leaveDate: d, wage: 300 })),
];

const one = byLabel(serviceCases, "1년");
const short = byLabel(serviceCases, "1년에서 하루 모자람");
const plus = byLabel(serviceCases, "1년 + 하루");
const three = byLabel(serviceCases, "3년");
const [b0, bBonus, bLeave, bBoth, b350] = bonusCases;
const [o0, o250, o300, oLow, oLowOrd] = ordinaryCases;

const derived = {
  period: {
    minDays: pMin.periodDays,
    maxDays: pMax.periodDays,
    severanceDiffWon: pMin.severancePay - pMax.severancePay,
    severanceDiffPct: pct(pMin.severancePay, pMax.severancePay),
    avgDailyDiffWon: pMin.avgDailyWage - pMax.avgDailyWage,
    // 월급 300만 원과 1년치 퇴직금의 차이
    vsMonthlyWage: periodGroups.map((g) => ({ periodDays: g.periodDays, severanceMinusMonthlyWage: g.severancePay - 300 * MAN })),
  },
  service: {
    oneDayShortDiffWon: one.output.severancePay - short.output.severancePay,
    oneDayMoreDiffWon: plus.output.severancePay - one.output.severancePay,
    threeYearsVsThreeTimesOneYear: three.output.severancePay - one.output.severancePay * 3,
    threeTimesOneYear: one.output.severancePay * 3,
    threeYearsMinusNineMillion: three.output.severancePay - 900 * MAN,
  },
  bonus: {
    bonusDiffWon: bBonus.output.severancePay - b0.output.severancePay,
    bonusDiffPct: pct(bBonus.output.severancePay, b0.output.severancePay),
    leaveDiffWon: bLeave.output.severancePay - b0.output.severancePay,
    bothDiffWon: bBoth.output.severancePay - b0.output.severancePay,
    bothDiffPct: pct(bBoth.output.severancePay, b0.output.severancePay),
    bonus600EqualsWage350: bBonus.output.severancePay === b350.output.severancePay && bBonus.output.totalWage === b350.output.totalWage,
  },
  ordinary: {
    same300DiffWon: o300.output.severancePay - o0.output.severancePay,
    same300DiffPct: pct(o300.output.severancePay, o0.output.severancePay),
    ordinary250Unchanged: o250.output.severancePay === o0.output.severancePay && !o250.output.ordinaryApplied,
    lowWageDiffWon: oLowOrd.output.severancePay - oLow.output.severancePay,
    lowWageVsNormalDiffWon: oLow.output.severancePay - o0.output.severancePay,
    flipPointWage300: flipPoint(300),
    flipPointWage300WithBonus600: flipPoint(300, { bonus: 600 }),
  },
};

const data = {
  computedAt: new Date().toISOString(),
  calculator: "src/lib/calc/severance.ts calcSeverance (상수: src/lib/calc/rates.ts SEVERANCE)",
  constants: SEVERANCE,
  note: "입력 금액은 계산기 화면과 같이 만원 단위로 넣고 원으로 바꿔 함수에 전달. 퇴직일은 계산기 정의대로 마지막 근무일의 다음 날. 모든 금액은 세전.",
  result: { periodByMonth, periodGroups, serviceCases, bonusCases, ordinaryCases, probes, derived },
};
fs.writeFileSync(out, JSON.stringify(data, null, 2) + "\n");

const row = (c) => [c.label, c.output.serviceDays, c.output.serviceYearsFixed2, c.output.periodDays, c.output.totalWage, c.output.avgDailyWage, c.output.ordinaryDailyWage, c.output.ordinaryApplied, c.output.severancePay, c.output.eligible].join(" | ");
console.log("periodGroups", JSON.stringify(periodGroups));
for (const [k, arr] of Object.entries({ serviceCases, bonusCases, ordinaryCases, probes })) {
  console.log(`\n${k}: label | 재직일 | 연 | 기간일 | 임금총액 | 1일평균 | 1일통상 | 통상적용 | 퇴직금 | 대상`);
  for (const c of arr) console.log(row(c));
}
console.log("\nderived", JSON.stringify(derived, null, 1));
