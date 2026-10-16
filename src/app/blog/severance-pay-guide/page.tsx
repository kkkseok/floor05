import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("severance-pay-guide"),
  title: "퇴직금 계산하는 법 - 평균임금·상여·연차수당까지 한 번에",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "퇴직금 계산 공식은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "법정 퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)입니다. 1일 평균임금은 퇴직 직전 3개월 임금총액을 그 기간의 날짜 수로 나눈 값입니다. 1년 일하면 약 한 달치 월급이 퇴직금이 됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "1년 미만 일해도 퇴직금을 받나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "법정 퇴직금은 계속 근로기간이 1년 이상일 때 발생합니다. 1년 미만이면 법적으로는 지급 대상이 아닙니다.",
      },
    },
    {
      "@type": "Question",
      name: "퇴직금에서 세금을 떼나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "퇴직소득세와 지방소득세가 부과됩니다. 다만 근속연수가 길수록 공제가 커져 세 부담이 줄어드는 구조라, 오래 근무했을수록 실수령액 비율이 높아집니다.",
      },
    },
  ],
};

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
            <span className="text-brand-mid">퇴직금 계산하는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              퇴직금 계산하는 법
            </h1>
            <p className="text-lg text-brand-mid">
              평균임금으로 퇴직금을 구하는 공식과, 상여금·연차수당 반영까지
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-12">2026-06-12</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              퇴직금은 막연히 &ldquo;1년에 한 달치&rdquo;라고 알고 있지만, 정확히는 평균임금을
              기준으로 계산합니다. 공식과 평균임금 구하는 법만 알면 내 퇴직금을 직접 확인할 수
              있습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 계산하고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                입사일·퇴사일과 월급만 넣으면 평균임금 방식으로 퇴직금을 바로 보여줍니다.
                상여금·연차수당까지 반영하며, 넣은 월급과 날짜는 계산이 끝나면 브라우저에 남지 않습니다.
              </p>
              <Link
                href="/tools/calc/severance"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                퇴직금 계산기 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              퇴직금 계산 공식
            </h2>
            <div className="bg-brand-paper rounded-lg p-6 mb-6 text-center">
              <p className="font-mono text-brand-black text-lg leading-relaxed">
                퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)
              </p>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              1년(365일) 근무하면 &lsquo;1일 평균임금 × 30일&rsquo;, 즉 약 한 달치 평균임금이
              퇴직금이 됩니다. 더 오래 근무하면 재직일수에 비례해 늘어납니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              핵심은 &lsquo;1일 평균임금&rsquo;
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              평균임금은 <strong>퇴직 직전 3개월</strong> 동안 받은 임금총액을 그 기간의 날짜
              수로 나눈 값입니다.
            </p>
            <div className="bg-brand-paper rounded-lg p-6 mb-6 text-center">
              <p className="font-mono text-brand-black leading-relaxed">
                1일 평균임금 = 직전 3개월 임금총액 ÷ 그 기간의 일수(89~92일)
              </p>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              예를 들어 월급 300만원을 받고 직전 3개월이 92일이라면, 임금총액 900만원 ÷ 92일 ≈
              9만 7,800원이 1일 평균임금입니다. 여기에 30일을 곱하면 1년치 퇴직금이 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              상여금과 연차수당도 포함된다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              연간 상여금과 미사용 연차수당도 평균임금에 들어갑니다. 다만 3개월분만 반영하므로
              &lsquo;연간 총액 × 3/12&rsquo;를 임금총액에 더합니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>연간 상여금 400만원 → 3개월분 100만원이 임금총액에 가산</li>
              <li>연차수당 60만원 → 3개월분 15만원이 임금총액에 가산</li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              상여금·연차수당이 있으면 평균임금이 올라가 퇴직금도 늘어납니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              알아두면 좋은 점
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>1년 미만</strong>은 법정 퇴직금 대상이 아닙니다. 계속 근로 1년 이상부터
                발생합니다.
              </li>
              <li>
                <strong>통상임금</strong>이 평균임금보다 많으면 통상임금으로 계산합니다. 더 유리한
                쪽이 기준입니다.
              </li>
              <li>
                <strong>퇴직소득세</strong>가 부과되지만, 근속연수가 길수록 공제가 커져 세 부담은
                줄어듭니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              도구로 내 퇴직금 계산하기
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/calc/severance" className="text-brand-accent hover:underline">
                  퇴직금 계산기
                </Link>
                에 입사일과 퇴직일(마지막 근무일의 다음 날)을 입력합니다.
              </li>
              <li>퇴직 전 3개월 월 평균 급여를 넣습니다.</li>
              <li>상여금·연차수당이 있으면 연간 총액을 입력합니다.</li>
              <li>세전 퇴직금과 1일 평균임금, 재직일수를 한눈에 확인합니다.</li>
            </ol>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 퇴직금 계산 공식은 무엇인가요?
                </h3>
                <p className="text-brand-mid">
                  1일 평균임금 × 30일 × (재직일수 ÷ 365)입니다. 1년이면 약 한 달치 평균임금이
                  퇴직금이 됩니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 1년 미만 일해도 퇴직금을 받나요?
                </h3>
                <p className="text-brand-mid">
                  법정 퇴직금은 계속 근로 1년 이상부터 발생합니다. 1년 미만이면 법적으로는 지급
                  대상이 아닙니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 퇴직금에서 세금을 떼나요?
                </h3>
                <p className="text-brand-mid">
                  퇴직소득세와 지방소득세가 부과됩니다. 근속연수가 길수록 공제가 커져 세 부담은
                  줄어듭니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 퇴직금 계산
              </h3>
              <p className="text-brand-light mb-6">
                입사일·월급만 넣으면 평균임금 방식으로 바로. 로그인도 결제도 없습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/calc/severance"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  퇴직금 계산기
                </Link>
                <Link
                  href="/blog/salary-net-pay-guide"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  연봉 실수령액 계산하는 법
                </Link>
              </div>
            </div>

            <BlogExtras slug="severance-pay-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
