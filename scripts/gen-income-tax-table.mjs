/**
 * 근로소득 간이세액표 원표(JSON) → src/lib/calc/incomeTaxTable.ts 생성.
 * 원자료: docs/data/kr-simplified-tax-table-2026.json
 *   (소득세법 시행령 [별표 2] <개정 2026. 2. 27.> PDF를 파싱, 646행 전수 이중 추출 대조)
 * 세액표가 개정되면 JSON을 바꾸고 이 스크립트를 다시 실행한다: node scripts/gen-income-tax-table.mjs
 */
import fs from "node:fs";

const src = JSON.parse(fs.readFileSync("docs/data/kr-simplified-tax-table-2026.json", "utf8"));
const rows = src.rows;
for (let i = 1; i < rows.length; i++) {
  if (rows[i].min !== rows[i - 1].max) throw new Error(`구간 끊김: ${rows[i - 1].max} → ${rows[i].min}`);
}
if (rows.at(-1).max !== 10_000_000) throw new Error("마지막 구간이 10,000천원에서 끝나지 않음");
const b = src.over10000k.brackets.map((x) => ({ over: x.over, base: x.base, add: x.add, from: x.from, factor: x.factor, rate: x.rate }));
const out = `// 이 파일은 scripts/gen-income-tax-table.mjs가 생성한다. 손으로 고치지 말 것.
// 출처: ${src.source.title} <개정 ${src.amendedAt.split("-").map(Number).join(". ")}.> (${src.appliesFrom} 시행)
//       ${src.source.fileUrl}

/** [월급여 하한(이상), 가족 1명 세액, …, 가족 11명 세액]. 상한(미만)은 다음 행의 하한, 마지막 행은 10,000,000원 */
export const TAX_TABLE: readonly (readonly number[])[] = [
${rows.map((r) => `  [${[r.min, ...r.tax].join(", ")}],`).join("\n")}
];

/** 월급여 10,000천원인 경우의 세액 (가족 1~11명) */
export const TAX_AT_10M: readonly number[] = [${src.exactly10000k.tax.join(", ")}];

/** 10,000천원 초과: TAX_AT_10M + base + (월급여 − from) × factor × rate + add */
export const OVER_10M_BRACKETS = ${JSON.stringify(b, null, 2).replace(/"(\w+)":/g, "$1:")} as const;

/** 8세 이상 20세 이하 자녀 차감액: 1명, 2명, 3명부터 1명당 추가 */
export const CHILD_DEDUCTION = { one: ${src.childDeduction.one}, two: ${src.childDeduction.two}, perExtra: ${src.childDeduction.perExtraOver2} } as const;
`;
fs.writeFileSync("src/lib/calc/incomeTaxTable.ts", out);
console.log(`rows=${rows.length}`);
