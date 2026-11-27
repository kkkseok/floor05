/**
 * 블로그용 계산표: floor05 연봉 실수령액 계산기(src/lib/calc/salary.ts, esbuild로 묶음)로
 * 연봉 구간·비과세·부양가족별 월 실수령액과 공제 내역을 계산한다.
 * 사용: npx esbuild src/lib/calc/salary.ts --bundle --platform=node --format=cjs --outfile=<salary.cjs>
 *       node scripts/blog-measure/salary-table.cjs <salary.cjs> <출력.json>
 */
const fs = require("fs");
const [, , lib, out] = process.argv;
const { calcSalary } = require(lib);
const row = (annual, nonTax, dependents, children) => {
  const r = calcSalary({ annualSalary: annual, monthlyNonTax: nonTax, dependents, children });
  return { annual, nonTax, dependents, children, monthlyGross: r.monthlyGross, monthlyNet: r.monthlyNet, totalDeduction: r.totalDeduction,
    deductionRate: Number((r.totalDeduction / r.monthlyGross * 100).toFixed(1)), ...r.deductions };
};
const bands2 = [2400, 3000, 3600, 4000, 5000, 6000, 7000, 8000, 10000, 15000].map((m) => row(m * 10_000, 200_000, 1, 0));
const nonTax = [0, 200_000].map((n) => row(50_000_000, n, 1, 0));
const family = [[1, 0], [2, 0], [3, 1], [4, 2]].map(([d, c]) => row(50_000_000, 200_000, d, c));
const result = { bands: bands2, nonTax, family };
fs.writeFileSync(out, JSON.stringify({ computedAt: new Date().toISOString(), calculator: "src/lib/calc/salary.ts (2026 요율)", result }, null, 2));
for (const r of bands2) console.log(r.annual / 10000, r.monthlyGross, r.monthlyNet, r.deductionRate + "%", r.pension, r.health, r.longTermCare, r.employment, r.incomeTax, r.localTax);
console.log("nonTax", nonTax.map((r) => [r.nonTax, r.monthlyNet, r.incomeTax]));
console.log("family", family.map((r) => [r.dependents, r.children, r.monthlyNet, r.incomeTax, r.localTax]));
