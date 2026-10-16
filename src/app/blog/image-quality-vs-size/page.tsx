import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "사진 화질 높이기 vs 용량 줄이기 - 차이점과 올바른 선택",
  description:
    "사진 화질을 높이는 것과 용량을 줄이는 것의 차이점. 상황별로 어떤 것을 선택해야 하는지 알려드립니다.",
  keywords: [
    "사진 화질 높이기",
    "이미지 용량 줄이기",
    "화질 vs 용량",
    "사진 해상도",
    "이미지 압축",
    "화질 손실",
    "무손실 압축",
  ],
  alternates: { canonical: "/blog/image-quality-vs-size" },
  openGraph: {
    url: "/blog/image-quality-vs-size",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "사진 화질 높이기 vs 용량 줄이기 - 차이점과 올바른 선택",
    description: "화질과 용량, 둘 중 무엇을 선택해야 할까요?",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "용량을 줄이면 화질이 떨어지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "압축 방식에 따라 다릅니다. 손실 압축(JPG 품질 낮추기)은 화질이 떨어지고, 무손실 압축(PNG 최적화)은 화질 변화 없이 용량만 줄입니다. 적절한 품질 설정(70-85%)으로는 육안으로 차이를 느끼기 어렵습니다.",
      },
    },
    {
      "@type": "Question",
      name: "저화질 사진의 화질을 높일 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "한 번 손실된 화질은 완전히 복구할 수 없습니다. AI 업스케일링 도구를 사용하면 어느 정도 개선할 수 있지만, 원본 수준으로 복원되지는 않습니다. 처음부터 고화질로 촬영/저장하는 것이 중요합니다.",
      },
    },
    {
      "@type": "Question",
      name: "리사이즈와 압축의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "리사이즈는 이미지의 픽셀 수(가로×세로)를 변경하는 것이고, 압축은 같은 픽셀 수에서 파일 용량만 줄이는 것입니다. 둘 다 용량 감소에 효과적이지만 방식이 다릅니다.",
      },
    },
  ],
};

export default function ImageQualityVsSizePage() {
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
            <span className="text-brand-mid">화질 vs 용량</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 화질 높이기 vs 용량 줄이기
            </h1>
            <p className="text-lg text-brand-mid">
              차이점과 상황별 올바른 선택
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-03-10">2026-03-10</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              &quot;사진 화질을 높이고 싶어요&quot;와 &quot;사진 용량을 줄이고 싶어요&quot;는
              자주 혼동되는 요청입니다. 이 두 가지는 정반대의 개념이며,
              각각 다른 도구와 방법이 필요합니다. 차이점을 명확히 알아봅시다.
            </p>

            {/* 핵심 차이 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 핵심 차이점
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div className="bg-brand-paper rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-black mb-3">
                  화질 높이기
                </h3>
                <ul className="text-brand-mid text-sm space-y-2">
                  <li>• 픽셀 수(해상도) 증가</li>
                  <li>• 파일 용량 증가</li>
                  <li>• 손실된 정보 복구 시도</li>
                  <li>• AI 업스케일링 필요</li>
                </ul>
              </div>
              <div className="bg-brand-paper rounded-lg p-6">
                <h3 className="text-lg font-semibold text-brand-black mb-3">
                  용량 줄이기
                </h3>
                <ul className="text-brand-mid text-sm space-y-2">
                  <li>• 픽셀 수 유지 또는 감소</li>
                  <li>• 파일 용량 감소</li>
                  <li>• 불필요한 데이터 제거</li>
                  <li>• 압축/리사이즈 필요</li>
                </ul>
              </div>
            </div>

            <p className="text-brand-mid leading-relaxed mb-6">
              쉽게 말해, <strong>화질을 높이면 용량이 커지고</strong>,
              <strong>용량을 줄이면 화질이 (조금) 떨어질 수 있습니다</strong>.
              이 둘은 트레이드오프 관계입니다.
            </p>

            {/* 화질이란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 화질(품질)이란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이미지 화질은 여러 요소로 결정됩니다:
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>해상도(Resolution)</strong> — 가로×세로 픽셀 수.
                3000×2000px은 600×400px보다 더 많은 정보를 담고 있습니다.
              </li>
              <li>
                <strong>압축 품질(Quality)</strong> — JPG 저장 시 품질 설정.
                100%는 최고 화질, 50%는 눈에 띄는 열화가 있습니다.
              </li>
              <li>
                <strong>노이즈</strong> — 어두운 환경에서 촬영 시 생기는 입자감.
              </li>
              <li>
                <strong>선명도(Sharpness)</strong> — 피사체 경계가 얼마나 또렷한지.
              </li>
            </ul>

            {/* 용량이란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 용량(파일 크기)이란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              파일 용량은 저장 공간을 차지하는 데이터 양입니다.
              용량에 영향을 주는 요소:
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>해상도</strong> — 픽셀이 많을수록 용량이 큽니다.
              </li>
              <li>
                <strong>압축률</strong> — 압축을 많이 할수록 용량이 작아집니다.
              </li>
              <li>
                <strong>포맷</strong> — PNG &gt; JPG &gt; WebP 순으로 같은 이미지라도 용량이 다릅니다.
              </li>
              <li>
                <strong>이미지 복잡도</strong> — 단순한 그래픽은 복잡한 사진보다 압축이 잘 됩니다.
              </li>
            </ul>

            {/* 상황별 가이드 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 상황별 어떤 것을 선택할까?
            </h2>

            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">상황</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">선택</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">도구</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">이메일 첨부 시 용량 초과</td>
                    <td className="py-3 px-4 font-medium text-brand-accent">용량 줄이기</td>
                    <td className="py-3 px-4">압축, 리사이즈</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">취업사이트 사진 업로드</td>
                    <td className="py-3 px-4 font-medium text-brand-accent">용량 줄이기</td>
                    <td className="py-3 px-4">압축</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">웹사이트 로딩 속도 개선</td>
                    <td className="py-3 px-4 font-medium text-brand-accent">용량 줄이기</td>
                    <td className="py-3 px-4">압축, WebP 변환</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">오래된 저해상도 사진 확대</td>
                    <td className="py-3 px-4 font-medium text-brand-black">화질 높이기</td>
                    <td className="py-3 px-4">AI 업스케일링</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">인스타 업로드용 크기 조절</td>
                    <td className="py-3 px-4 font-medium text-brand-accent">리사이즈</td>
                    <td className="py-3 px-4">리사이즈</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">인쇄용 고해상도 필요</td>
                    <td className="py-3 px-4 font-medium text-brand-black">화질 유지/높이기</td>
                    <td className="py-3 px-4">원본 사용, AI 업스케일링</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 용량 줄이기 방법 */}
            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              용량을 줄이는 쪽이라면, 여기서 바로 처리할 수 있습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 용량 줄이는 방법 (floor05에서 가능)
            </h2>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 1: 압축 (품질 조절)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              이미지 압축 도구에서 품질을 80%로 낮추면 용량이 절반 이상 줄어들지만,
              육안으로는 차이를 느끼기 어렵습니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 2: 리사이즈 (해상도 축소)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              4000×3000px 사진을 2000×1500px로 줄이면 픽셀 수가 1/4이 되어
              용량도 크게 줄어듭니다. 웹/SNS용으로는 충분합니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 3: 포맷 변환
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              PNG → JPG 또는 JPG → WebP로 변환하면 같은 화질에서 용량이 줄어듭니다.
            </p>

            {/* 화질 높이기 방법 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 화질 높이는 방법
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              <strong>중요:</strong> 한 번 손실된 화질은 완벽히 복구할 수 없습니다.
              다만 AI 업스케일링으로 어느 정도 개선할 수 있습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-6">
              <p className="font-medium text-brand-black mb-3">
                AI 업스케일링 도구 (외부 서비스)
              </p>
              <ul className="text-brand-mid text-sm space-y-2">
                <li>• <strong>waifu2x</strong> — 애니메이션/일러스트에 특화</li>
                <li>• <strong>Topaz Gigapixel AI</strong> — 유료, 고품질 업스케일링</li>
                <li>• <strong>Let&apos;s Enhance</strong> — 웹 기반 AI 업스케일러</li>
              </ul>
              <p className="text-brand-light text-xs mt-4">
                ※ floor05는 현재 업스케일링 기능을 제공하지 않습니다.
              </p>
            </div>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 압축해도 화질이 안 떨어지게 할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  무손실 압축(PNG 최적화)을 사용하면 화질 손실 없이 용량만 줄일 수 있습니다.
                  다만 줄어드는 폭이 작습니다. 손실 압축(JPG)은 70~85% 품질에서
                  육안으로 구분하기 어려운 수준입니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 원본을 보관해야 하나요?
                </h3>
                <p className="text-brand-mid">
                  네, 중요한 사진은 원본을 반드시 보관하세요.
                  압축하거나 리사이즈한 파일에서는 원본 화질을 복구할 수 없습니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 스마트폰 사진은 왜 용량이 클까요?
                </h3>
                <p className="text-brand-mid">
                  최신 스마트폰은 4000만 화소 이상의 고해상도 카메라를 탑재하고 있습니다.
                  한 장에 10MB가 넘는 것도 흔합니다. SNS나 웹용으로는 리사이즈/압축이 필요합니다.
                </p>
              </div>
            </div>

            {/* CTA 박스들 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12">
              <div className="bg-brand-black rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-brand-paper mb-2">
                  이미지 용량 줄이기
                </h3>
                <p className="text-brand-light text-sm mb-4">
                  품질 슬라이더로 쉽게 압축
                </p>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
                >
                  압축 도구 →
                </Link>
              </div>
              <div className="bg-brand-black rounded-lg p-6 text-center">
                <h3 className="text-lg font-bold text-brand-paper mb-2">
                  이미지 크기 조절
                </h3>
                <p className="text-brand-light text-sm mb-4">
                  SNS 프리셋으로 원클릭 리사이즈
                </p>
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
                >
                  리사이즈 도구 →
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="image-quality-vs-size" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
