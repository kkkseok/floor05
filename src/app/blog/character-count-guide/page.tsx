import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("character-count-guide"),
  title: "자소서 글자수 세는 법 - 공백 포함/제외·바이트·원고지 완벽 정리",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "자소서 글자수는 공백 포함인가요, 제외인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "국내 자소서는 보통 '공백 포함' 기준이 가장 많습니다. 다만 기업·기관마다 다르므로 공고에 명시된 기준을 확인하세요. 공백 포함과 제외를 함께 보여주는 도구로 양쪽 모두 확인하는 것이 안전합니다.",
      },
    },
    {
      "@type": "Question",
      name: "1,000바이트는 몇 글자인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한글만이면 2바이트 기준 약 500자, 3바이트(UTF-8) 기준 약 333자입니다. 공백·영문·숫자는 1바이트라, 섞이면 더 많은 글자가 들어갑니다. 입력폼이 어느 기준인지 모르면 두 값을 모두 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "원고지 10매는 몇 자인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "200자 원고지면 10매는 2,000자, 400자 원고지면 4,000자입니다. 원고지는 공백도 한 칸을 차지하므로 공백 포함 글자수로 계산합니다.",
      },
    },
  ],
};

export default function CharacterCountGuidePage() {
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
            <span className="text-brand-mid">자소서 글자수 세는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              자소서 글자수 세는 법
            </h1>
            <p className="text-lg text-brand-mid">
              공백 포함/제외, 바이트, 원고지 매수 — 헷갈리는 기준 한 번에 정리
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-12">2026-06-12</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              &ldquo;500자 이내&rdquo;, &ldquo;1,000바이트 이하&rdquo;, &ldquo;원고지 5매&rdquo;.
              자소서·리포트·과제마다 글자수 기준이 제각각이라 헷갈리기 쉽습니다.
              기준별로 한 번에 정리해드립니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 세어보고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                붙여넣으면 공백 포함/제외, 바이트(2·3), 원고지 매수, 목표 글자수까지 실시간으로 보여줍니다. 내용은 서버로 전송되지 않습니다.
              </p>
              <Link
                href="/tools/text/counter"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                글자수 세기 도구 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 공백 포함 vs 공백 제외
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              가장 자주 헷갈리는 부분입니다. 국내 자소서는 <strong>공백 포함</strong> 기준이
              가장 흔하지만, 일부는 공백 제외로 셉니다. 공고에 명시된 기준을 먼저 확인하고,
              명시가 없으면 공백 포함으로 맞추되 제외 값도 함께 확인하는 것이 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 바이트(byte) 제한 — 2바이트와 3바이트
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              입력폼이 &ldquo;1,000바이트&rdquo;처럼 바이트로 제한하는 경우가 있습니다. 한글을 세는
              방식이 두 가지라 결과가 달라집니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>2바이트 기준</strong>(많은 기업 입력폼): 한글 2바이트, 영문·숫자·공백 1바이트.
                1,000바이트면 한글만 약 500자.
              </li>
              <li>
                <strong>3바이트 기준</strong>(UTF-8, 일부 기관·웹): 한글 3바이트. 1,000바이트면 한글만 약 333자.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              공백·영문이 섞이면 글자 수는 더 늘어납니다. 어느 기준인지 모를 땐 두 값을 모두
              확인하세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 원고지 매수
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              과제·공모전은 원고지 매수로 분량을 정하기도 합니다. 원고지는 공백도 한 칸이라
              <strong> 공백 포함</strong> 글자수로 계산합니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>200자 원고지(20×10): 10매 = 2,000자</li>
              <li>400자 원고지(20×20): 10매 = 4,000자</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 네이버 기준 vs 한글(HWP) 기준
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              줄바꿈을 어떻게 세느냐에 따라 글자수가 달라집니다. <strong>네이버 기준</strong>은
              줄바꿈을 공백 1개로 세고, <strong>한글(HWP) 기준</strong>은 줄바꿈을 글자수에서
              제외합니다. 제출처가 어느 쪽인지에 맞춰 세는 것이 정확합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 도구로 한 번에 확인하기
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/text/counter" className="text-brand-accent hover:underline">
                  글자수 세기
                </Link>
                에 글을 붙여넣습니다.
              </li>
              <li>줄바꿈 기준(네이버/한글)을 제출처에 맞게 선택합니다.</li>
              <li>공백 포함/제외, 바이트(2·3), 원고지 매수를 한눈에 확인합니다.</li>
              <li>목표 글자수를 입력하면 잔여·초과가 실시간으로 표시됩니다.</li>
            </ol>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 자소서 글자수는 공백 포함인가요, 제외인가요?
                </h3>
                <p className="text-brand-mid">
                  국내 자소서는 공백 포함이 가장 흔합니다. 다만 공고 기준을 먼저 확인하고,
                  공백 포함·제외를 함께 보여주는 도구로 양쪽 다 확인하면 안전합니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 1,000바이트는 몇 글자인가요?
                </h3>
                <p className="text-brand-mid">
                  한글만이면 2바이트 기준 약 500자, 3바이트 기준 약 333자입니다. 공백·영문은
                  1바이트라 섞이면 더 들어갑니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 원고지 10매는 몇 자인가요?
                </h3>
                <p className="text-brand-mid">
                  200자 원고지는 2,000자, 400자 원고지는 4,000자입니다. 공백도 한 칸이라 공백
                  포함으로 계산합니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 글자수 세기
              </h3>
              <p className="text-brand-light mb-6">
                공백·바이트·원고지·목표 글자수까지 한 번에. 로그인 절차 없이 바로 세어 볼 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/text/counter"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  글자수 세기
                </Link>
                <Link
                  href="/blog/id-photo-size-guide"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  증명사진 크기 가이드
                </Link>
              </div>
            </div>

            <BlogExtras slug="character-count-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
