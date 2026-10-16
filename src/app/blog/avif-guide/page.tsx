import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "AVIF란? WebP·JPG와 비교 + 변환 방법",
  description:
    "차세대 이미지 포맷 AVIF의 장단점, WebP·JPG와의 차이, 브라우저 지원 현황과 변환 방법까지. 웹에서 받은 AVIF가 안 열릴 때 여는 법도 정리했습니다.",
  keywords: [
    "AVIF",
    "AVIF 변환",
    "AVIF란",
    "AVIF JPG 변환",
    "AVIF WebP 차이",
    "AVIF 안열림",
    "차세대 이미지 포맷",
  ],
  alternates: { canonical: "/blog/avif-guide" },
  openGraph: {
    url: "/blog/avif-guide",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "AVIF란? WebP·JPG와 비교 + 변환 방법",
    description: "AVIF의 장단점과 WebP·JPG 비교, 변환 방법까지 한 번에.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "AVIF란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "AVIF(AV1 Image File Format)는 AV1 영상 코덱을 기반으로 만든 차세대 이미지 포맷입니다. 같은 화질을 JPG는 물론 WebP보다도 더 작은 용량에 담을 수 있어, 웹사이트 로딩 속도를 줄이는 데 유리합니다.",
      },
    },
    {
      "@type": "Question",
      name: "AVIF가 안 열려요. 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "웹에서 받은 AVIF가 일부 프로그램에서 열리지 않으면 JPG나 PNG로 변환하면 됩니다. AVIF를 여는(디코딩) 기능은 최신 크롬·엣지·파이어폭스·사파리에서 지원하므로, 브라우저 기반 변환 도구로 바로 바꿀 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "AVIF와 WebP 중 무엇을 써야 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "용량을 한 단계 더 줄이고 싶고 최신 브라우저 위주라면 AVIF가 유리합니다. 다만 호환성·지원 범위는 WebP가 아직 더 넓습니다. 폭넓은 호환이 중요하면 WebP, 최대 효율이 중요하면 AVIF를 고르면 됩니다.",
      },
    },
  ],
};

export default function AvifGuidePage() {
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
          <nav className="mb-8 text-sm text-brand-light">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">AVIF 가이드</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              AVIF란? WebP·JPG와 비교 + 변환 방법
            </h1>
            <p className="text-lg text-brand-mid">
              WebP 다음으로 주목받는 차세대 이미지 포맷
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-06-23">2026-06-23</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              요즘 웹에서 이미지를 저장하면 .webp에 이어 .avif 확장자로 받아지는 일이
              늘고 있습니다. 보기엔 멀쩡한데 일부 프로그램에서 안 열려 당황하기 쉽죠.
              AVIF가 무엇인지, WebP·JPG와 어떻게 다른지, 그리고 안 열릴 때 어떻게
              바꾸면 되는지 담백하게 정리했습니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 AVIF가 지금 안 열리나요?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                AVIF를 JPG·PNG로, 또는 이미지를 AVIF로 무료 변환하세요. 변환은 열어 둔 브라우저 안에서 끝나고, 원본 이미지는 기기를 떠나지 않습니다.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 →
              </Link>
            </div>

            {/* AVIF란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. AVIF란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              AVIF(AV1 Image File Format)는 AV1이라는 영상 코덱을 정지 이미지에
              적용해 만든 포맷입니다. 넷플릭스·유튜브 등이 쓰는 최신 영상 압축 기술을
              사진 한 장에 적용했다고 보면 됩니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              핵심은 압축 효율입니다. 같은 화질을 JPG는 물론 WebP보다도 더 작은
              용량에 담을 수 있습니다. 투명 배경과 넓은 색 표현(HDR)도 지원해, 웹용
              이미지로는 현재 가장 효율적인 선택지 중 하나입니다.
            </p>

            {/* 포맷 비교 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. AVIF vs WebP vs JPG
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">항목</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">JPG</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">WebP</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">AVIF</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">용량 효율</td>
                    <td className="py-3 px-4">보통</td>
                    <td className="py-3 px-4">좋음</td>
                    <td className="py-3 px-4 text-brand-accent font-medium">가장 좋음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">투명 배경</td>
                    <td className="py-3 px-4 text-red-500">✗</td>
                    <td className="py-3 px-4 text-green-600">✓</td>
                    <td className="py-3 px-4 text-green-600">✓</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">호환성</td>
                    <td className="py-3 px-4 text-brand-accent font-medium">가장 넓음</td>
                    <td className="py-3 px-4">넓음</td>
                    <td className="py-3 px-4">최신 환경 위주</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">주 용도</td>
                    <td className="py-3 px-4">범용·첨부·인쇄</td>
                    <td className="py-3 px-4">웹 게시</td>
                    <td className="py-3 px-4">웹 최적화 극대화</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              한 줄로 요약하면, 용량은 <strong>AVIF &lt; WebP &lt; JPG</strong> 순으로
              작고, 호환성은 그 반대입니다. 어디서나 열려야 하면 JPG, 웹에서 효율을
              극대화하려면 AVIF, 그 중간이 WebP입니다.
            </p>

            <BlogInlineCTA href="/tools/image/convert" label="포맷 변환하기 →">
              JPG·WebP·AVIF를 서로 바꿔보며 용량을 비교해보세요.
            </BlogInlineCTA>

            {/* 브라우저 지원 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 브라우저 지원 — &apos;여는 것&apos;과 &apos;만드는 것&apos;은 다르다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              AVIF에서 한 가지 헷갈리기 쉬운 점이 있습니다. 이미지를 <strong>여는
              것(디코딩)</strong>과 이미지를 AVIF로 <strong>만드는 것(인코딩)</strong>의
              지원 범위가 다르다는 점입니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-4">
              <li>
                <strong>여는 것(디코딩):</strong> 크롬 85+, 파이어폭스 93+, 사파리 16.4+,
                엣지 121+ 등 최신 브라우저 대부분에서 지원. 즉 받은 AVIF를 보거나
                JPG·PNG로 바꾸는 건 대체로 잘 됩니다.
              </li>
              <li>
                <strong>만드는 것(인코딩):</strong> 브라우저에서 AVIF로 직접 내보내는
                건 크롬·엣지(124+) 등 일부에서만 됩니다. 파이어폭스·사파리에서는
                아직 AVIF로 저장이 안 됩니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래서 floor05 변환 도구는 AVIF 출력을 지원하지 않는 브라우저에서는
              AVIF 버튼을 자동으로 비활성화합니다. 그런 환경에서는 JPG·PNG·WebP로
              변환하면 됩니다.
            </p>

            {/* 언제 쓰나 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. AVIF는 언제 쓰면 좋을까?
            </h2>
            <div className="space-y-4 text-brand-mid mb-6">
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">✓</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>웹사이트·블로그 이미지</strong> — 용량을 한 단계 더 줄여 로딩 속도 개선</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">✓</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>방문자가 최신 브라우저 위주</strong> — 호환성 부담이 적은 경우</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>메일 첨부·문서·인쇄·업로드</strong> — 받는 쪽 환경을 모를 땐 JPG가 안전</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-red-500 font-bold shrink-0">✗</span>
                <p className="text-brand-mid leading-relaxed mb-4"><strong>오래된 프로그램·기기에서 열어야 할 때</strong> — JPG·PNG로 변환</p>
              </div>
            </div>

            {/* 변환 방법 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. AVIF 변환하는 법
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              AVIF가 안 열려서 JPG·PNG로 바꾸거나, 반대로 이미지를 AVIF로 만들고
              싶다면 브라우저에서 바로 처리할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>포맷 변환 도구에 이미지를 드래그앤드롭합니다(AVIF 입력도 가능).</li>
              <li>출력 포맷을 고릅니다 — 안 열리는 AVIF라면 JPG·PNG, 용량을 줄이려면 WebP·AVIF.</li>
              <li>변환 버튼을 누르면 브라우저에서 바로 변환되고, 여러 장은 ZIP으로 받습니다.</li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-6">
              모든 변환은 100% 브라우저에서 이루어지므로 파일이 서버로 전송되지
              않습니다. 회원가입도 필요 없습니다.
            </p>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. AVIF로 바꾸면 화질이 떨어지나요?
                </h3>
                <p className="text-brand-mid">
                  AVIF는 같은 화질에서 용량이 더 작은 포맷입니다. 품질을 적당히 두면
                  눈에 띄는 저하 없이 용량만 줄어듭니다. 다만 이미 손실 압축된 원본을
                  변환해도 원본보다 좋아지지는 않습니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 카카오톡·인스타그램에 AVIF를 올릴 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  서비스에 따라 AVIF 업로드를 아직 지원하지 않는 경우가 있습니다. 이럴
                  땐 JPG나 PNG로 변환해서 올리면 됩니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. AVIF와 WebP를 둘 다 만들어 비교할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네. 같은 이미지를 WebP와 AVIF로 각각 변환해 용량을 비교해보면, 보통
                  AVIF가 조금 더 작습니다. 단 AVIF 출력은 지원 브라우저(크롬·엣지 등)에서만
                  가능합니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                AVIF 변환하기
              </h3>
              <p className="text-brand-light mb-6">
                AVIF를 JPG·PNG로, 이미지를 AVIF로. 브라우저에서 바로, 서버 전송 없이.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="avif-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
