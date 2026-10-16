import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("salary-net-pay-guide"),
  title: "2026년 연봉 실수령액 계산하는 법 - 4대보험·세금 떼고 얼마?",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "연봉 4,000만원의 실수령액은 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "부양가족 1명(본인), 월 비과세 20만원 기준 2026년 요율로 월 약 290만원입니다. 4대보험과 소득세·지방소득세로 월 약 43만원이 공제됩니다. 부양가족이 많으면 실수령액은 늘어납니다.",
      },
    },
    {
      "@type": "Question",
      name: "실수령액은 왜 매달 조금씩 다른가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "건강보험료는 연말정산(정산보험료)으로 추가 부과되거나 환급될 수 있고, 상여금이 있는 달은 소득세가 더 떼입니다. 또 매년 1월 4대보험 요율이 조정되면 공제액이 바뀝니다.",
      },
    },
    {
      "@type": "Question",
      name: "실수령액을 늘리는 방법이 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "식대(월 20만원), 자가운전보조금(월 20만원) 같은 비과세 항목을 활용하면 과세 기준이 줄어 공제가 작아집니다. 부양가족 등록과 8~20세 자녀 공제도 소득세를 줄여 실수령액을 늘립니다.",
      },
    },
  ],
};

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
            <span className="text-brand-mid">2026년 연봉 실수령액 계산하는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              2026년 연봉 실수령액 계산하는 법
            </h1>
            <p className="text-lg text-brand-mid">
              4대보험·소득세를 떼면 통장에 실제로 얼마가 들어올까
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-12">2026-06-12</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              연봉 협상에서 말하는 금액과 매달 통장에 찍히는 금액은 다릅니다. 연봉은 세전이고,
              실제로 받는 돈은 4대보험과 세금을 뗀 <strong>실수령액</strong>이기 때문입니다.
              공제 항목을 하나씩 따라가 보면 내 월급이 왜 그 금액인지 이해할 수 있습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 계산하고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                연봉만 넣으면 2026년 요율로 4대보험·소득세를 떼고 월 실수령액을 바로 보여줍니다.
                부양가족·비과세까지 반영하며, 넣은 연봉은 서버를 거치지 않고 화면 안에서 계산됩니다.
              </p>
              <Link
                href="/tools/calc/salary"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                연봉 실수령액 계산기 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              실수령액 = 연봉 − 4대보험 − 소득세
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              월 세전 급여(연봉 ÷ 12)에서 다음 항목이 빠지면 실수령액이 됩니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>국민연금, 건강보험, 장기요양보험, 고용보험 (4대보험 중 근로자 부담분)</li>
              <li>근로소득세, 지방소득세 (소득세의 10%)</li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              산재보험은 사업주가 전액 부담하므로 월급에서 빠지지 않습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2026년 4대보험 요율 (근로자 부담분)
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">요율</th>
                    <th className="py-2 text-brand-black">기준</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">국민연금</td>
                    <td className="py-2 pr-4 font-mono">4.75%</td>
                    <td className="py-2">2026년 9.0%→9.5% 인상</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">건강보험</td>
                    <td className="py-2 pr-4 font-mono">3.595%</td>
                    <td className="py-2">2026년 7.09%→7.19% 인상</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">장기요양보험</td>
                    <td className="py-2 pr-4 font-mono">건강보험료의 13.14%</td>
                    <td className="py-2">건강보험료에 곱함</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">고용보험</td>
                    <td className="py-2 pr-4 font-mono">0.9%</td>
                    <td className="py-2">실업급여분, 2026년 동결</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              2026년부터 국민연금과 건강보험 요율이 올라, 같은 연봉이라도 2025년보다 실수령액이
              조금 줄어듭니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              소득세는 부양가족 수에 따라 달라진다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              매달 떼는 근로소득세는 국세청 <strong>근로소득 간이세액표</strong>를 따릅니다. 같은
              월급이라도 공제대상 부양가족이 많을수록 세금이 줄어듭니다. 본인 외 부양가족이 1명
              늘면 과세표준에서 150만원이 더 빠지고, 8~20세 자녀가 있으면 추가 공제를 받습니다.
              떼인 세금은 다음 해 연말정산에서 정산됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              연봉별 실수령액 (2026년 기준)
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              부양가족 1명(본인), 월 비과세 20만원(식대) 기준 예상치입니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">연봉</th>
                    <th className="py-2 pr-4 text-brand-black">월 실수령액</th>
                    <th className="py-2 text-brand-black">월 공제액</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid font-mono">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">3,000만원</td>
                    <td className="py-2 pr-4">약 224만원</td>
                    <td className="py-2">약 25만원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">3,600만원</td>
                    <td className="py-2 pr-4">약 264만원</td>
                    <td className="py-2">약 36만원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">4,000만원</td>
                    <td className="py-2 pr-4">약 290만원</td>
                    <td className="py-2">약 43만원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">5,000만원</td>
                    <td className="py-2 pr-4">약 353만원</td>
                    <td className="py-2">약 63만원</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">6,000만원</td>
                    <td className="py-2 pr-4">약 416만원</td>
                    <td className="py-2">약 84만원</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">1억원</td>
                    <td className="py-2 pr-4">약 650만원</td>
                    <td className="py-2">약 183만원</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              실제 금액은 비과세 항목, 부양가족 수, 회사의 신고 방식에 따라 월 1~2만원 정도
              차이가 날 수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              도구로 내 연봉 계산하기
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/calc/salary" className="text-brand-accent hover:underline">
                  연봉 실수령액 계산기
                </Link>
                에 연봉을 입력합니다.
              </li>
              <li>부양가족 수(본인 포함)와 8~20세 자녀 수를 넣습니다.</li>
              <li>식대 등 월 비과세액을 입력합니다(기본 20만원).</li>
              <li>월 실수령액과 항목별 공제 내역을 한눈에 확인합니다.</li>
            </ol>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 연봉 4,000만원의 실수령액은 얼마인가요?
                </h3>
                <p className="text-brand-mid">
                  부양가족 1명, 비과세 20만원 기준 월 약 290만원입니다. 4대보험과 소득세로 월 약
                  43만원이 공제됩니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 실수령액이 매달 조금씩 다른 이유는?
                </h3>
                <p className="text-brand-mid">
                  상여금이 있는 달은 소득세가 더 떼이고, 건강보험은 연말정산으로 추가 부과·환급될
                  수 있습니다. 매년 1월 요율이 바뀌면 공제액도 달라집니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 실수령액을 늘리는 방법이 있나요?
                </h3>
                <p className="text-brand-mid">
                  식대·자가운전보조금 같은 비과세 항목을 활용하면 과세 기준이 줄어듭니다. 부양가족
                  등록과 자녀 공제도 소득세를 줄여 실수령액을 늘립니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 실수령액 계산
              </h3>
              <p className="text-brand-light mb-6">
                연봉만 넣으면 월 실수령액과 공제 내역을 바로. 가입 없이 브라우저에서 끝납니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/calc/salary"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  연봉 실수령액 계산기
                </Link>
                <Link
                  href="/blog/severance-pay-guide"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  퇴직금 계산하는 법
                </Link>
              </div>
            </div>

            <BlogExtras slug="salary-net-pay-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
