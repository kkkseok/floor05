import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "WebP 포맷 완벽 가이드 - 장점, 단점, 변환 방법",
  description:
    "WebP 포맷의 장점과 단점, 지원 브라우저, JPG/PNG에서 WebP로 변환하는 방법을 상세히 알려드립니다.",
  keywords: [
    "WebP",
    "웹피",
    "WebP 변환",
    "WebP 장점",
    "WebP 단점",
    "이미지 포맷",
    "WebP 지원 브라우저",
    "JPG to WebP",
    "PNG to WebP",
  ],
  alternates: { canonical: "/blog/webp-guide" },
  openGraph: {
    url: "/blog/webp-guide",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "WebP 포맷 완벽 가이드 - 장점, 단점, 변환 방법",
    description: "WebP 포맷의 모든 것: 장점, 단점, 변환 방법까지",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "WebP 포맷이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP는 구글이 개발한 이미지 포맷으로, JPG보다 25-35% 더 작은 용량으로 같은 화질을 유지합니다. 투명 배경(알파 채널)과 애니메이션도 지원합니다.",
      },
    },
    {
      "@type": "Question",
      name: "WebP를 지원하지 않는 브라우저가 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2024년 현재 모든 주요 브라우저(Chrome, Firefox, Safari, Edge)가 WebP를 지원합니다. IE11만 지원하지 않지만, IE는 2022년에 지원이 종료되었습니다.",
      },
    },
    {
      "@type": "Question",
      name: "WebP로 변환하면 화질이 떨어지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "WebP는 같은 화질에서 JPG보다 용량이 작습니다. 즉, 같은 용량이라면 오히려 화질이 더 좋습니다. 무손실(lossless) 압축도 지원하므로 화질 손실 없이 변환할 수도 있습니다.",
      },
    },
  ],
};

export default function WebPGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      {/* Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 브레드크럼 */}
          <nav className="mb-8 text-sm text-brand-subtle">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">WebP 포맷 가이드</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              WebP 포맷 완벽 가이드
            </h1>
            <p className="text-lg text-brand-mid">
              차세대 이미지 포맷 WebP의 모든 것
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-03-10">2026-03-10</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              웹사이트 속도를 개선하고 싶다면 WebP 포맷을 고려해보세요.
              구글이 개발한 이 포맷은 JPG, PNG를 대체할 차세대 이미지 표준으로
              자리잡고 있습니다. WebP의 장단점과 실제 활용법을 알아봅니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 지금 바로 WebP로 변환하고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                가지고 있는 JPG·PNG를 WebP로 바꿔 페이지를 가볍게 만들어 보세요. 변환은 이 브라우저 안에서 끝나 원본이 밖으로 나가지 않습니다.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 →
              </Link>
            </div>

            {/* WebP란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. WebP란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              WebP(웹피)는 2010년 구글이 발표한 이미지 파일 형식입니다.
              &quot;웹을 위한 이미지&quot;라는 의미로, 웹에서 사용하기에 최적화되어 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              기존 JPG, PNG 포맷의 장점을 모두 갖추면서도 파일 크기는 훨씬 작습니다.
              하나의 포맷으로 손실/무손실 압축, 투명 배경, 애니메이션까지 모두 지원합니다.
            </p>

            {/* 장점 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. WebP의 장점
            </h2>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              압도적인 용량 절감
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              구글 공식 발표에 따르면 WebP는 동일 화질 기준으로:
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>JPG 대비 <strong>25~35%</strong> 더 작은 용량</li>
              <li>PNG 대비 <strong>26%</strong> 더 작은 용량 (무손실 압축)</li>
              <li>GIF 애니메이션 대비 <strong>최대 64%</strong> 더 작은 용량</li>
            </ul>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              투명 배경 + 애니메이션
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              PNG처럼 투명 배경(알파 채널)을 지원하면서도 용량이 작습니다.
              GIF처럼 애니메이션도 가능한데, 용량은 절반 이하입니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              손실 + 무손실 모두 지원
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              JPG처럼 손실 압축으로 용량을 대폭 줄일 수도 있고,
              PNG처럼 무손실 압축으로 원본 화질을 그대로 유지할 수도 있습니다.
            </p>

            {/* 단점 */}
            <BlogInlineCTA href="/tools/image/convert" label="WebP로 변환 →">
              장점이 끌렸다면, JPG·PNG를 WebP로 바로 바꿔보세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. WebP의 단점
            </h2>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              일부 프로그램 미지원
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              포토샵은 기본으로 WebP를 지원하지만, 오래된 버전이나
              일부 이미지 뷰어에서는 열리지 않을 수 있습니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              SNS 업로드 시 변환 필요
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              인스타그램, 카카오톡 등 일부 서비스는 WebP 업로드를 지원하지 않습니다.
              이 경우 JPG나 PNG로 변환해서 올려야 합니다.
            </p>

            {/* 브라우저 지원 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 브라우저 지원 현황
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              2024년 기준 <strong>전 세계 브라우저의 97% 이상</strong>이 WebP를 지원합니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">브라우저</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">지원 여부</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">지원 시작</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">Chrome</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">2014년 (v32)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">Firefox</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">2019년 (v65)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">Safari</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">2020년 (macOS Big Sur)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">Edge</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">2018년 (v18)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">IE 11</td>
                    <td className="py-3 px-4 text-red-500 font-medium">미지원</td>
                    <td className="py-3 px-4 text-brand-light">지원 종료 (2022)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 언제 사용하면 좋은가 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. WebP는 언제 사용하면 좋을까?
            </h2>
            <div className="space-y-4 text-brand-mid">
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">✓</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>웹사이트/블로그 이미지</strong> — 용량이 작아 로딩 속도 향상</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">✓</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>이메일 첨부 파일</strong> — 용량 제한에 여유가 생김</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">✓</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>투명 배경이 필요한 아이콘/로고</strong> — PNG보다 가벼움</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>인스타그램, 카카오톡 업로드</strong> — JPG/PNG로 변환 필요</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>인쇄물</strong> — 인쇄업체에서 지원하지 않을 수 있음</p>
              </div>
            </div>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. WebP 파일을 JPG로 다시 변환할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네, floor05 포맷 변환 도구에서 WebP를 JPG나 PNG로 변환할 수 있습니다.
                  단, 손실 압축된 WebP를 변환해도 원본 화질로 복구되지는 않습니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. WebP가 SEO에 도움이 되나요?
                </h3>
                <p className="text-brand-mid">
                  네, 구글은 페이지 로딩 속도를 검색 순위 요소로 사용합니다.
                  WebP로 이미지 용량을 줄이면 로딩 속도가 빨라져 SEO에 긍정적입니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 어떤 품질 설정이 적당한가요?
                </h3>
                <p className="text-brand-mid">
                  일반적으로 75~85% 품질이 적당합니다.
                  웹에서 보기에 충분한 화질을 유지하면서 용량을 크게 줄일 수 있습니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                JPG/PNG → WebP 변환하기
              </h3>
              <p className="text-brand-light mb-6">
                이미지를 고르는 순간 브라우저가 WebP로 바꿔 냅니다. 원본은 이 페이지를 벗어나지 않으니 여러 장 돌려봐도 부담이 없습니다.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="webp-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
