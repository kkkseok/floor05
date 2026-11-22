import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("severance-pay-guide"),
  title: "퇴직금 계산 방법 - 같은 월급 300만 원, 퇴직일 따라 98,925원 차이",
};

const faqs = [
  {
    question: "월급 300만 원이면 1년 퇴직금은 300만 원인가요?",
    answer:
      "퇴직 직전 3개월이 90일일 때만 정확히 3,000,000원입니다. 계산기로 2027년 매월 1일 퇴직을 넣어 보니 89일이면 3,033,708원, 91일이면 2,967,033원, 92일이면 2,934,783원이었습니다. 3개월 임금총액 900만 원을 나누는 일수가 달라서 생기는 차이입니다.",
  },
  {
    question: "1년에서 하루가 모자라면 계산기에는 어떻게 나오나요?",
    answer:
      "재직 364일을 넣으면 2,926,742원이 표시되지만, 지급 대상이 아니라는 안내가 함께 뜹니다. 같은 식을 재직일수에 비례해 계산한 참고값입니다. 365일을 넣으면 안내가 사라지고 2,934,783원이 나옵니다. 계산기는 재직일수 365일을 기준으로 이 안내를 띄웁니다.",
  },
  {
    question: "상여금을 넣으면 퇴직금이 얼마나 늘어나나요?",
    answer:
      "월급 300만 원, 재직 1,096일 사례에서 연간 상여 600만 원을 넣으니 퇴직금이 8,812,388원에서 10,281,120원으로 1,468,732원 늘었습니다. 계산기가 연간 총액의 3/12인 150만 원을 3개월 임금총액에 더하기 때문입니다. 월급을 350만 원으로 넣은 결과와 같은 금액입니다.",
  },
  {
    question: "입사일과 월급을 넣으면 기록이 남나요?",
    answer:
      "남지 않습니다. 계산기 코드에는 날짜와 금액을 저장하거나 밖으로 보내는 부분이 없고, 사용 횟수를 셀 때도 도구 이름만 집계합니다. 이 글의 표도 같은 계산 함수를 따로 실행해 만든 것이라, 기본 예시(2022년 1월 1일 입사, 2025년 1월 1일 퇴직, 월 300만 원)를 넣으면 표의 3년 사례와 같은 8,812,388원이 화면에 나옵니다.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// 2026-11-19 계산 (src/lib/calc/severance.ts calcSeverance를 scripts/blog-measure/severance-cases.mjs로 실행,
// 원자료: docs/blog-data/severance-2026-11-19.json). 모든 금액은 세전.

// result.periodGroups — 월급 300만 원, 재직 365일, 2027년 매월 1일 퇴직
const periodRows = [
  { days: 89, months: "5월", daily: 101124, pay: 3033708 },
  { days: 90, months: "3·4월", daily: 100000, pay: 3000000 },
  { days: 91, months: "7·12월", daily: 98901, pay: 2967033 },
  { days: 92, months: "1·2·6·8·9·10·11월", daily: 97826, pay: 2934783 },
];

// result.serviceCases — 퇴직일 2027-01-01, 월급 300만 원 (직전 3개월 92일)
const serviceRows = [
  { join: "2026-01-02", days: 364, years: "1.00", pay: 2926742, eligible: false },
  { join: "2026-01-01", days: 365, years: "1.00", pay: 2934783, eligible: true },
  { join: "2025-12-31", days: 366, years: "1.00", pay: 2942823, eligible: true },
  { join: "2025-07-01", days: 549, years: "1.50", pay: 4414235, eligible: true },
  { join: "2024-01-01", days: 1096, years: "3.00", pay: 8812388, eligible: true },
  { join: "2022-01-01", days: 1826, years: "5.00", pay: 14681954, eligible: true },
  { join: "2017-01-01", days: 3652, years: "10.01", pay: 29363907, eligible: true },
];

// result.bonusCases — 2024-01-01 입사, 2027-01-01 퇴직 (재직 1,096일, 직전 3개월 92일)
const bonusRows = [
  { label: "월급 300만 원", total: 9000000, daily: 97826, pay: 8812388 },
  { label: "+ 연차수당 60만 원", total: 9150000, daily: 99457, pay: 8959261 },
  { label: "+ 연간 상여 600만 원", total: 10500000, daily: 114130, pay: 10281120 },
  { label: "+ 상여 600만 원, 연차수당 60만 원", total: 10650000, daily: 115761, pay: 10427993 },
  { label: "월급 350만 원 (상여 없음)", total: 10500000, daily: 114130, pay: 10281120 },
];

// result.ordinaryCases — 같은 기간. used = 계산에 쓰인 1일 금액
const ordinaryRows = [
  { label: "300만 원", ordinary: "비움", avg: 97826, ord: null, used: "평균임금", pay: 8812388 },
  { label: "300만 원", ordinary: "250만 원", avg: 97826, ord: 95694, used: "평균임금", pay: 8812388 },
  { label: "300만 원", ordinary: "300만 원", avg: 97826, ord: 114833, used: "통상임금", pay: 10344367 },
  { label: "200만 원", ordinary: "비움", avg: 65217, ord: null, used: "평균임금", pay: 5874926 },
  { label: "200만 원", ordinary: "300만 원", avg: 65217, ord: 114833, used: "통상임금", pay: 10344367 },
];

const won = (n: number) => n.toLocaleString("ko-KR");

const th = "py-2 pr-4 text-brand-black whitespace-nowrap";
const td = "py-2 pr-4 whitespace-nowrap";

export default function SeverancePayGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8 text-sm text-brand-subtle">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">퇴직금 계산 방법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              퇴직금 계산 방법
            </h1>
            <p className="text-lg text-brand-mid">
              월급 300만 원을 계산기 코드로 돌려 본 사례 표
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-19">2026-11-19 계산</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              월급 300만 원으로 1년을 일하면 퇴직금은 300만 원일 것 같지만, floor05 퇴직금 계산기에 넣어 보면
              2,934,783원에서 3,033,708원 사이로 나옵니다. 언제 퇴직하느냐에 따라 98,925원이 움직입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              왜 그 금액이 나오는지 보려고 계산기와 같은 함수를 직접 실행해 퇴직일, 재직일수, 상여·연차수당,
              통상임금 칸을 하나씩 바꿔 봤습니다. 아래 숫자는 전부 그 실행 결과이고 세전 금액입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 계산했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                floor05{" "}
                <Link href="/tools/calc/severance" className="text-brand-accent hover:underline">
                  퇴직금 계산기
                </Link>
                가 쓰는 계산 함수를 스크립트로 불러 입력과 출력을 그대로 기록했습니다. 손으로 다시 셈한 값은 없습니다.
              </li>
              <li>
                기준 입력은 퇴직 전 3개월 월 평균 급여 300만 원입니다. 퇴직일은 계산기 정의대로 마지막 근무일의 다음
                날로 넣었습니다.
              </li>
              <li>
                법 조문은 근로자퇴직급여 보장법 두 곳만 인용합니다. 제8조 제1항은 계속근로기간 1년에 대하여 30일분
                이상의 평균임금을 퇴직금으로 지급하도록 정하고, 제4조 제1항은 계속근로기간이 1년 미만인 근로자와 4주간을
                평균하여 1주간의 소정근로시간이 15시간 미만인 근로자를 제외합니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">계산기가 쓰는 식은 두 줄입니다.</p>
            <div className="bg-brand-paper rounded-lg p-5 mb-6">
              <p className="font-mono text-sm text-brand-black leading-relaxed">
                1일 평균임금 = 직전 3개월 임금총액 ÷ 그 3개월의 일수
              </p>
              <p className="font-mono text-sm text-brand-black leading-relaxed">
                퇴직금 = 1일 평균임금 × 30 × (재직일수 ÷ 365)
              </p>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 퇴직하는 달에 따라 1년치가 98,925원 달라진다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              재직 365일, 월급 300만 원을 그대로 두고 퇴직일만 2027년 1월 1일부터 12월 1일까지 매월 1일로 바꿨습니다.
              3개월 임금총액은 늘 900만 원인데, 나누는 일수가 89일에서 92일까지 달라집니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>직전 3개월</th>
                    <th className={th}>퇴직일 (2027년, 매월 1일)</th>
                    <th className={th}>1일 평균임금</th>
                    <th className={th}>1년치 퇴직금</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {periodRows.map((r) => (
                    <tr key={r.days} className="border-b border-brand-light/20">
                      <td className={`${td} font-medium text-brand-black`}>{r.days}일</td>
                      <td className="py-2 pr-4">{r.months}</td>
                      <td className={td}>{won(r.daily)}원</td>
                      <td className={`${td} font-medium text-brand-black`}>{won(r.pay)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-6">
              입사일은 퇴직일의 1년 전 같은 날(재직 365일). 1일 평균임금은 계산기 화면처럼 원 단위로 반올림한 값입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              5월 1일 퇴직은 2·3·4월이 산정 기간이라 89일이고, 1일 평균임금이 101,124원으로 가장 높습니다. 92일인 달은
              97,826원으로 3,298원 낮습니다. 30일분으로 환산하면 3,033,708원과 2,934,783원, 3.4% 차이입니다. 퇴직금이
              월급과 똑같이 3,000,000원이 되는 것은 90일인 3·4월 퇴직뿐이었고, 열두 달 중 일곱 달은 92일이라 월급보다
              65,217원 적었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 재직일수는 하루 단위로 반영된다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이번에는 퇴직일을 2027년 1월 1일(직전 3개월 92일)로 고정하고 입사일만 바꿨습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>입사일</th>
                    <th className={th}>재직일수</th>
                    <th className={th}>화면 표시</th>
                    <th className={th}>계산 결과</th>
                    <th className={th}>1년 미만 안내</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {serviceRows.map((r) => (
                    <tr key={r.join} className="border-b border-brand-light/20">
                      <td className={td}>{r.join}</td>
                      <td className={td}>{won(r.days)}일</td>
                      <td className={td}>{r.years}년</td>
                      <td className={`${td} font-medium text-brand-black`}>{won(r.pay)}원</td>
                      <td className={td}>{r.eligible ? "없음" : "표시됨 (참고값)"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              재직일수가 하루 늘면 결과는 8,040원 늘었습니다(365일 2,934,783원, 366일 2,942,823원). 364일을 넣어도
              2,926,742원이 계산되지만, 계산기는 퇴직일이 입사일의 1년 뒤 날짜보다 이르면 법정 퇴직금 지급 대상이 아니라는 안내를 함께 띄웁니다.
              그 금액은 같은 식을 비례 적용한 참고값입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              달력으로 꼭 3년인 2024년 1월 1일 입사는 재직 1,096일입니다. 2024년이 윤년이라 365일의 세 배보다 하루
              많습니다. 결과는 8,812,388원으로, 월급 세 달치인 900만 원보다 187,612원 적습니다. 1번에서 본 대로 직전
              3개월이 92일이기 때문입니다. 10년 사례는 3,652일이라 화면에 10.01년으로 표시됩니다.
            </p>

            <BlogInlineCTA href="/tools/calc/severance" label="퇴직금 계산 →">
              내 입사일과 퇴직일을 넣으면 재직일수와 직전 3개월 일수가 함께 표시됩니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 연간 상여 600만 원은 월급 50만 원 인상과 같은 결과
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              계산기는 상여금과 연차수당을 연간 총액으로 받아 그 3/12를 3개월 임금총액에 더합니다. 2024년 1월 1일
              입사, 2027년 1월 1일 퇴직(재직 1,096일)으로 넣은 결과입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>입력</th>
                    <th className={th}>3개월 임금총액</th>
                    <th className={th}>1일 평균임금</th>
                    <th className={th}>퇴직금</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {bonusRows.map((r) => (
                    <tr key={r.label} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 text-brand-black">{r.label}</td>
                      <td className={td}>{won(r.total)}원</td>
                      <td className={td}>{won(r.daily)}원</td>
                      <td className={`${td} font-medium text-brand-black`}>{won(r.pay)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              연간 상여 600만 원은 150만 원이 되어 임금총액에 들어가고, 퇴직금은 1,468,732원(16.7%) 늘었습니다. 월급을
              350만 원으로 넣은 마지막 행과 금액이 같습니다. 연차수당 60만 원은 15만 원으로 반영되어 146,873원을
              더했고, 둘을 함께 넣으면 1,615,605원(18.3%) 늘어 10,427,993원이 됩니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              계산기는 입력한 금액을 그대로 더할 뿐입니다. 내가 받은 상여금과 수당이 평균임금에 들어가는 항목인지는 계산기가
              가려 주지 않고, 이 글에서도 다루지 않습니다. 애매하면 급여명세서를 들고 고용노동부나 회사 담당 부서에
              확인하세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 통상임금 칸을 채우면 생기는 일
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              계산기에는 선택 입력으로 &lsquo;월 통상임금&rsquo; 칸이 있습니다. 값을 넣으면 월 209시간으로 나누고 8시간을
              곱해 1일 통상임금을 만든 뒤, 1일 평균임금과 비교해 큰 쪽으로 퇴직금을 계산합니다. 주 40시간 근무를 전제로
              한 환산입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>3개월 월급</th>
                    <th className={th}>통상임금 칸</th>
                    <th className={th}>1일 평균임금</th>
                    <th className={th}>1일 통상임금</th>
                    <th className={th}>적용</th>
                    <th className={th}>퇴직금</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {ordinaryRows.map((r) => (
                    <tr key={`${r.label}-${r.ordinary}`} className="border-b border-brand-light/20">
                      <td className={td}>{r.label}</td>
                      <td className={td}>{r.ordinary}</td>
                      <td className={td}>{won(r.avg)}원</td>
                      <td className={td}>{r.ord === null ? "-" : `${won(r.ord)}원`}</td>
                      <td className={td}>{r.used}</td>
                      <td className={`${td} font-medium text-brand-black`}>{won(r.pay)}원</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              직전 3개월 월급이 200만 원으로 줄어든 경우를 보면, 평균임금만으로는 5,874,926원이지만 통상임금 300만 원을
              넣으면 10,344,367원으로 4,469,441원 올라갑니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              눈여겨볼 것은 셋째 행입니다. 월급과 같은 300만 원을 통상임금 칸에 넣기만 해도 결과가 8,812,388원에서
              10,344,367원으로 1,531,979원(17.4%) 늘었습니다. 평균임금은 92일로 나누고 통상임금은 209시간으로 나눠
              8시간을 곱하다 보니 1일 금액이 114,833원 대 97,826원으로 벌어져서입니다. 이 사례에서는 통상임금 칸이
              256만 원 이상이면 통상임금 쪽이 적용됐습니다. 무엇이 통상임금에 들어가는지, 내 근로시간이 이 환산과
              맞는지는 계산기가 판단하지 않습니다. 이 칸 때문에 금액이 크게 달라졌다면 그 숫자를 믿기 전에 고용노동부에
              확인하는 편이 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">계산기가 하지 않는 것</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>
                결과는 입력값에 식을 적용한 예상치입니다. 법 조문이 &lsquo;30일분 이상&rsquo;이라고 정한 만큼 회사 규정이나
                단체협약에 따라 실제 지급액은 달라질 수 있습니다.
              </li>
              <li>
                주 15시간 미만 여부는 묻지 않습니다. 1년 미만 안내는 일수가 아니라 달력으로 판정합니다. 퇴직일이 입사일의 1년 뒤 날짜보다 이르면 뜹니다.
              </li>
              <li>
                3개월 월급이 서로 달라도 평균 한 값만 받습니다. 달마다 다른 금액을 따로 넣을 수는 없습니다.
              </li>
              <li>
                세금은 계산하지 않습니다. 표의 금액은 모두 세전이고, 퇴직소득세와 실제 수령액은 이 글에서 다루지
                않습니다. 회사 정산 내역이나 국세청 안내로 확인하세요.
              </li>
              <li>지급 기한, 중간정산, 퇴직연금 제도도 이 글의 범위 밖입니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">계산해 보며 정리한 것</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">이럴 때</th>
                    <th className="py-2 pr-4 text-brand-black">이렇게 보세요</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 계산)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">결과가 월급 × 연수와 다를 때</td>
                    <td className="py-2 pr-4">직전 3개월 일수부터 확인</td>
                    <td className="py-2 pr-4">89일 3,033,708원, 92일 2,934,783원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">퇴직일을 며칠 조정할 때</td>
                    <td className="py-2 pr-4">재직일수는 하루 단위로 반영</td>
                    <td className="py-2 pr-4">하루에 8,040원 (월급 300만 원, 92일)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">상여금이 있을 때</td>
                    <td className="py-2 pr-4">연간 총액을 넣기 (3/12만 반영)</td>
                    <td className="py-2 pr-4">상여 600만 원으로 1,468,732원 증가</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">통상임금 칸을 채웠을 때</td>
                    <td className="py-2 pr-4">어느 쪽이 적용됐는지 결과 아래 문구 확인</td>
                    <td className="py-2 pr-4">같은 300만 원을 넣어도 17.4% 증가</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              이직을 앞두고 있다면 새 연봉이 한 달에 얼마로 들어오는지{" "}
              <Link href="/blog/salary-net-pay-guide" className="text-brand-accent hover:underline">
                연봉 실수령액 표
              </Link>
              에서 함께 확인할 수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className={i < faqs.length - 1 ? "border-b border-brand-light/20 pb-6" : "pb-6"}
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-2">Q. {faq.question}</h3>
                  <p className="text-brand-mid leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">내 날짜와 급여로 다시 계산하기</h3>
              <p className="text-brand-light mb-6">
                입사일, 퇴직일, 급여를 바꿔 가며 직전 3개월 일수와 1일 평균임금을 확인하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/calc/severance"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  퇴직금 계산기
                </Link>
                <Link
                  href="/tools/calc/salary"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  연봉 실수령액 계산기
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="severance-pay-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
