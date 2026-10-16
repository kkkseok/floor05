import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("salary-net-pay-guide"),
  title: "2026 연봉 실수령액 표 - 2,400만~1.5억 10개 구간 계산 결과",
};

const faqs = [
  {
    question: "연봉 5,000만 원이면 한 달에 얼마 받나요?",
    answer:
      "2026년 요율, 부양가족 1명(본인), 비과세 식대 월 20만 원 기준으로 월 3,571,547원입니다. 세전 월급 4,166,667원에서 4대보험 385,440원과 소득세·지방소득세 209,680원이 빠집니다. 회사에 신고한 가족 수나 원천징수 비율이 다르면 급여명세서와 차이가 납니다.",
  },
  {
    question: "연봉이 두 배가 되면 실수령액도 두 배가 되나요?",
    answer:
      "아닙니다. 연봉 3,000만 원은 월 2,244,440원, 6,000만 원은 월 4,195,410원으로 1.87배였습니다. 공제율이 10.2%에서 16.1%로 올라가기 때문입니다. 1억 5,000만 원에서는 공제율이 27.8%였습니다.",
  },
  {
    question: "부양가족이 많으면 얼마나 더 받나요?",
    answer:
      "연봉 5,000만 원 기준으로 본인만일 때 월 3,571,547원, 본인 포함 4명에 8~20세 자녀 2명이면 월 3,734,567원으로 163,020원 많았습니다. 4대보험은 같고 소득세만 줄어든 차이입니다.",
  },
  {
    question: "연봉을 넣으면 어딘가에 기록되나요?",
    answer:
      "기록되지 않습니다. 요율표와 계산식이 페이지와 함께 내려와 이 브라우저에서 바로 셈하므로, 입력한 연봉은 화면 밖으로 나가지 않고 탭을 닫으면 함께 사라집니다.",
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

// 2026-10-16 계산 (floor05 연봉 실수령액 계산기 코드, 원자료: docs/blog-data/salary-2026-10-16.json)
// 부양가족 1명(본인), 자녀 0명, 월 비과세 20만 원
const bands = [
  { annual: "2,400만", gross: 2000000, net: 1808470, rate: 9.6 },
  { annual: "3,000만", gross: 2500000, net: 2244440, rate: 10.2 },
  { annual: "3,600만", gross: 3000000, net: 2665440, rate: 11.2 },
  { annual: "4,000만", gross: 3333333, net: 2935783, rate: 11.9 },
  { annual: "5,000만", gross: 4166667, net: 3571547, rate: 14.3 },
  { annual: "6,000만", gross: 5000000, net: 4195410, rate: 16.1 },
  { annual: "7,000만", gross: 5833333, net: 4821283, rate: 17.3 },
  { annual: "8,000만", gross: 6666667, net: 5367047, rate: 19.5 },
  { annual: "1억", gross: 8333333, net: 6530913, rate: 21.6 },
  { annual: "1억 5,000만", gross: 12500000, net: 9022570, rate: 27.8 },
];

const breakdown = [
  { item: "국민연금 (4.75%)", won: 188410 },
  { item: "건강보험 (3.595%)", won: 142600 },
  { item: "장기요양 (건강보험료의 13.14%)", won: 18730 },
  { item: "고용보험 (0.9%)", won: 35700 },
  { item: "근로소득세 (간이세액표)", won: 190620 },
  { item: "지방소득세 (소득세의 10%)", won: 19060 },
];

const won = (n: number) => n.toLocaleString("ko-KR");

export default function SalaryNetPayGuidePage() {
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
            <span className="text-brand-mid">연봉 실수령액</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              2026 연봉 실수령액 표
            </h1>
            <p className="text-lg text-brand-mid">2,400만 원부터 1억 5,000만 원까지 10개 구간을 계산했습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-16">2026-10-16 계산</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              연봉 협상에서 말하는 숫자는 세전이고, 통장에 들어오는 돈은 4대보험과 세금을 뗀 뒤의 금액입니다. 그 차이가
              연봉에 따라 어떻게 달라지는지 보려고, floor05 연봉 실수령액 계산기로 10개 구간을 같은 조건에서 계산해
              표로 만들었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              숫자를 나란히 놓으니 몇 가지가 분명해졌습니다. 연봉이 두 배가 돼도 실수령액은 두 배가 안 되고, 국민연금은
              어느 구간부터 더 늘지 않습니다. 그리고 계산하다가 floor05 계산기가 소득세를 실제보다 크게 잡고 있던 것을 찾아 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 계산했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                floor05{" "}
                <Link href="/tools/calc/salary" className="text-brand-accent hover:underline">
                  연봉 실수령액 계산기
                </Link>
                의 계산 코드를 그대로 실행했습니다. 요율은 2026년 기준이며, 이 글 아래의 &lsquo;계산 기준·출처&rsquo;에 공단·국세청
                원문을 연결해 두었습니다.
              </li>
              <li>조건: 부양가족 1명(본인), 8~20세 자녀 0명, 월 비과세 20만 원(식대)</li>
              <li>
                근로소득세는 소득세법 시행령 별표2 근로소득 간이세액표(2026년 2월 27일 개정) 원표에서 찾은 값입니다. 회사에 신고한
                공제대상가족 수, 비과세 항목, 원천징수 비율(80·100·120%)이 다르면 급여명세서와 달라집니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">계산 결과: 연봉별 월 실수령액</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">연봉</th>
                    <th className="py-2 pr-4 text-brand-black">세전 월급</th>
                    <th className="py-2 pr-4 text-brand-black">월 실수령액</th>
                    <th className="py-2 pr-4 text-brand-black">공제율</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {bands.map((b) => (
                    <tr key={b.annual} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{b.annual}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{won(b.gross)}원</td>
                      <td className="py-2 pr-4 whitespace-nowrap font-medium text-brand-black">{won(b.net)}원</td>
                      <td className="py-2 pr-4">{b.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              공제율 = (4대보험 + 소득세 + 지방소득세) ÷ 세전 월급. 원 단위 이하는 계산기의 절사 규칙을 따릅니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 연봉 두 배, 실수령액은 1.87배
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              연봉 3,000만 원의 월 실수령액은 2,244,440원, 6,000만 원은 4,195,410원이었습니다. 연봉은 두 배인데 실수령액은
              1.87배입니다. 공제율이 10.2%에서 16.1%로 올라서입니다. 4대보험은 소득에 비례해 같은 비율로 늘지만,
              근로소득세는 소득이 높을수록 높은 세율이 적용되는 누진 구조이기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              같은 이유로 연봉 인상분도 전부 손에 들어오지 않습니다. 5,000만 원에서 6,000만 원으로 오르면 세전 월급은
              833,333원 늘지만 실수령액은 623,863원 늘었습니다. 인상분의 75%입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 연봉 5,000만 원의 공제 내역
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">월 공제액</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {breakdown.map((r) => (
                    <tr key={r.item} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4">{r.item}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{won(r.won)}원</td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">합계</td>
                    <td className="py-2 pr-4 font-medium text-brand-black">595,120원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              가장 큰 항목은 소득세(190,620원)와 국민연금(188,410원)입니다. 4대보험은 비과세 20만 원을 뺀 3,966,667원에 요율을
              곱하고, 장기요양보험은 월급이 아니라 건강보험료에 13.14%를 곱한다는 점이 다릅니다. 산재보험은 사업주가 전액
              부담해 월급에서 빠지지 않습니다.
            </p>

            <BlogInlineCTA href="/tools/calc/salary" label="실수령액 계산 →">
              내 연봉, 부양가족, 비과세를 넣으면 항목별 공제까지 바로 나옵니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 국민연금은 월 313,020원에서 멈춘다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              국민연금은 소득에 4.75%를 곱하되, 기준이 되는 월 소득에 상한(2026년 7월~2027년 6월 659만 원)이 있습니다. 그래서
              연봉 1억 원과 1억 5,000만 원의 국민연금은 둘 다 월 313,020원으로 같았습니다. 이 조건(비과세 20만 원)에서는
              연봉이 약 8,150만 원을 넘으면 국민연금이 더 늘지 않습니다. 고소득 구간에서 공제율이 오르는 것은 대부분 소득세
              때문이라는 뜻이기도 합니다. 1억 5,000만 원에서는 소득세와 지방소득세가 월 2,553,430원으로 공제액의 73%였습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 비과세 20만 원과 부양가족은 얼마나 차이 날까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              연봉 5,000만 원에서 비과세(식대) 20만 원이 있을 때와 없을 때를 비교하니 월 3,571,547원과 3,522,737원으로
              48,810원 차이였습니다. 비과세 금액만큼 4대보험과 소득세를 매기는 기준이 줄어서입니다. 1년이면 약 59만 원입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">연봉 5,000만 원</th>
                    <th className="py-2 pr-4 text-brand-black">근로소득세</th>
                    <th className="py-2 pr-4 text-brand-black">월 실수령액</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">본인만 (1명)</td>
                    <td className="py-2 pr-4">190,620원</td>
                    <td className="py-2 pr-4">3,571,547원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">본인 + 배우자 (2명)</td>
                    <td className="py-2 pr-4">162,640원</td>
                    <td className="py-2 pr-4">3,602,327원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">3명, 8~20세 자녀 1명</td>
                    <td className="py-2 pr-4">83,870원</td>
                    <td className="py-2 pr-4">3,688,977원</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">4명, 8~20세 자녀 2명</td>
                    <td className="py-2 pr-4">42,420원</td>
                    <td className="py-2 pr-4">3,734,567원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              부양가족이 늘면 소득세만 줄고 4대보험은 그대로입니다. 본인만일 때와 4명·자녀 2명일 때의 차이는 월 163,020원이었습니다. 소득세가 190,620원에서 42,420원으로 줄었습니다.
              매달 떼는 소득세는 간이세액표에 따른 예납이라, 실제 세금은 다음 해 연말정산에서 공제 항목을 모두 반영해 다시
              정산됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 계산하다 고친 것: 소득세를 크게 잡던 계산기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이 표를 처음 만들 때 floor05 계산기는 간이세액표를 연말정산 계산식으로 흉내 내고 있었습니다. 표를 국세청이
              안내한 예시와 맞춰 보니 크게 어긋났습니다. 월급여 350만 원, 공제대상가족 4명의 간이세액표 세액은 49,340원인데
              계산기는 109,180원을 냈습니다. 간이세액표에는 근로자가 보통 받는 보험료·의료비 같은 공제가 미리 반영돼 있는데,
              계산식에는 그 부분이 빠져 있었기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래서 법령(소득세법 시행령 별표2)에 실린 간이세액표 646개 구간을 그대로 넣어 찾아 쓰도록 바꿨습니다. 연봉
              5,000만 원·본인만 기준 소득세는 225,530원에서 190,620원으로, 4명·자녀 2명 기준은 140,120원에서 42,420원으로
              바뀌었습니다. 2026년 3월부터 늘어난 자녀 차감액(1명 20,830원, 2명 45,830원)도 이때 반영했습니다. 이 글의 숫자는
              모두 고친 뒤의 계산입니다.
            </p>

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
                    <td className="py-2 pr-4 font-medium text-brand-black">연봉 협상·이직 제안</td>
                    <td className="py-2 pr-4">인상액이 아니라 실수령 증가분으로</td>
                    <td className="py-2 pr-4">5,000→6,000만 원 인상분의 75%만 실수령</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">급여명세서와 비교</td>
                    <td className="py-2 pr-4">비과세 항목부터 맞추기</td>
                    <td className="py-2 pr-4">비과세 20만 원 유무로 월 48,810원 차이</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">소득세가 계산과 다를 때</td>
                    <td className="py-2 pr-4">회사에 신고한 가족 수·원천징수 비율 확인</td>
                    <td className="py-2 pr-4">가족 4명·자녀 2명이면 소득세가 본인만일 때의 22%</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              퇴사를 앞두고 있다면 마지막 급여와 함께{" "}
              <Link href="/blog/severance-pay-guide" className="text-brand-accent hover:underline">
                퇴직금 계산법
              </Link>
              도 확인해 두세요.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">내 조건으로 다시 계산하기</h3>
              <p className="text-brand-light mb-6">
                연봉, 부양가족, 자녀, 비과세를 바꿔 가며 항목별 공제를 확인하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/calc/salary"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  연봉 실수령액 계산기
                </Link>
                <Link
                  href="/tools/calc/severance"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  퇴직금 계산기
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="salary-net-pay-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
