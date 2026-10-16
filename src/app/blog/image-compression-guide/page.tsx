import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 방법 총정리 - 화질 손실 없이 사진 크기 줄이는 법",
  description:
    "사진 용량이 너무 클 때 화질 손실 없이 이미지 크기를 줄이는 모든 방법을 알려드립니다. 온라인 무료 도구부터 설정 팁까지.",
  keywords: [
    "이미지 용량 줄이기",
    "사진 용량 줄이기",
    "이미지 압축",
    "사진 압축",
    "이미지 크기 줄이기",
    "화질 손실 없이 압축",
    "JPG 압축",
    "PNG 압축",
  ],
  alternates: { canonical: "/blog/image-compression-guide" },
  openGraph: {
    title: "이미지 용량 줄이기 방법 총정리",
    description:
      "화질 손실 없이 사진 크기를 줄이는 모든 방법을 알려드립니다.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "이미지 용량을 줄이면 화질이 떨어지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "적절한 압축률(70-85%)을 사용하면 육안으로 구분하기 어려운 수준의 화질 저하만 발생합니다. 무손실 압축 옵션을 사용하면 화질 저하 없이 용량만 줄일 수도 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "어떤 이미지 포맷이 용량이 가장 작나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일반적으로 WebP가 가장 효율적입니다. 같은 화질 기준으로 JPG보다 25-35% 작은 용량을 제공합니다. 사진은 JPG, 투명 배경이 필요하면 PNG, 웹용이면 WebP를 추천합니다.",
      },
    },
    {
      "@type": "Question",
      name: "온라인에서 이미지 압축하면 개인정보가 유출되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "대부분의 온라인 압축 도구는 서버에 파일을 업로드합니다. 개인정보가 걱정된다면 기기에서 직접 처리하는 도구(예: floor05)를 고르세요. 사진이 네트워크로 오가지 않아 유출 위험이 줄어듭니다.",
      },
    },
  ],
};

export default function ImageCompressionGuidePage() {
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
            <span className="text-brand-mid">이미지 용량 줄이기</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              이미지 용량 줄이기 방법 총정리
            </h1>
            <p className="text-lg text-brand-mid">
              화질 손실 없이 사진 크기를 줄이는 모든 방법
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-03-07">2026-03-07</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              이메일 첨부 용량 초과, 카카오톡 전송 실패, 웹사이트 업로드 거부...
              사진 용량 때문에 곤란했던 적 있으신가요? 이 글에서는 이미지 용량을
              줄이는 모든 방법을 정리해드립니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 압축하고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                사진을 서버에 올리지 않고 용량만 줄여 주는 무료 압축 도구를 써 보세요.
              </p>
              <Link
                href="/tools/image/compress"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 압축 도구 사용하기 →
              </Link>
            </div>

            {/* 섹션 1 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 이미지 용량이 큰 이유
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이미지 용량은 크게 세 가지 요소에 의해 결정됩니다:
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>해상도</strong>: 픽셀 수가 많을수록 용량이 커집니다
              </li>
              <li>
                <strong>색상 깊이</strong>: 색상 정보가 많을수록 용량이 커집니다
              </li>
              <li>
                <strong>포맷</strong>: PNG는 JPG보다 2-3배 큰 경우가 많습니다
              </li>
            </ul>

            {/* 섹션 2 */}
            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              원리는 이쯤이면 충분하죠. 지금 바로 용량을 줄여보세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 용량 줄이는 방법 3가지
            </h2>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 1: 압축하기 (가장 쉬움)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              이미지 압축은 가장 간단한 방법입니다. 품질을 70-85%로 설정하면
              육안으로 구분하기 어려운 수준의 화질 저하만 발생하면서 용량은
              절반 이하로 줄어듭니다. 아래 그림처럼 원본과 압축 후 용량을 나란히
              두면 차이가 한눈에 들어옵니다.
            </p>

            <figure className="my-8">
              <svg viewBox="0 0 400 200" role="img" width="100%" className="block max-w-xl mx-auto" style={{ height: "auto" }}>
                <title>이미지 압축 전후 용량 비교</title>
                <desc>원본 4.2MB 이미지를 압축하면 약 1.4MB로 줄어드는 것을 가로 막대로 비교한 그림입니다.</desc>
                <rect x="92" y="44" width="228" height="34" rx="4" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="16" y="66" fontSize="14" fill="#0A0A0A">원본</text>
                <text x="326" y="66" fontSize="14" fill="#0A0A0A">4.2MB</text>
                <rect x="92" y="112" width="76" height="34" rx="4" fill="#C45C2C" />
                <text x="16" y="134" fontSize="14" fill="#0A0A0A">압축 후</text>
                <text x="176" y="134" fontSize="14" fill="#0A0A0A">1.4MB</text>
              </svg>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">품질을 조절하면 원본 4.2MB 사진이 1.4MB 안팎까지, 절반 이하로 줄어듭니다.</figcaption>
            </figure>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 2: 리사이즈하기
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              4000x3000 픽셀 사진을 2000x1500으로 줄이면 용량이 1/4로 줄어듭니다.
              용도에 맞는 해상도로 조정하세요:
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>카카오톡/메신저: 1280px이면 충분</li>
              <li>인스타그램: 1080px 권장</li>
              <li>웹사이트: 1920px 이하 권장</li>
            </ul>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 3: 포맷 변환하기
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              PNG를 JPG로 변환하면 용량이 크게 줄어듭니다. 투명 배경이 필요 없다면
              JPG를 사용하세요. 웹용이라면 WebP가 가장 효율적입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">손실 압축과 무손실 압축은 어떻게 다른가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">두 방식의 차이는 줄이는 정보가 되돌릴 수 있는지에 있습니다. 손실 압축은 사람이 덜 민감하게 느끼는 정보를 일부 줄여 용량을 크게 낮추고, 무손실 압축은 원본 데이터를 유지한 채 저장 구조를 더 효율적으로 만듭니다. 사진을 웹에 올릴 때는 손실 압축이 흔하고, 로고나 캡처처럼 선명한 선이 중요한 이미지는 무손실 방식이 어울릴 때가 있습니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">손실 압축</th>
                    <th className="py-2 pr-4 text-brand-black">무손실 압축</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">원리</td>
                    <td className="py-2 pr-4">눈에 덜 띄는 세부 정보를 줄여 저장합니다</td>
                    <td className="py-2 pr-4">정보를 버리지 않고 더 효율적인 구조로 저장합니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">용량 감소 폭</td>
                    <td className="py-2 pr-4">대체로 크게 줄어듭니다</td>
                    <td className="py-2 pr-4">원본 상태에 따라 줄어드는 폭이 작을 수 있습니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">화질 변화</td>
                    <td className="py-2 pr-4">강하게 적용하면 뭉개짐이나 얼룩이 보일 수 있습니다</td>
                    <td className="py-2 pr-4">눈에 보이는 화질 변화가 거의 없습니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">원본 복원</td>
                    <td className="py-2 pr-4">한번 줄인 세부 정보는 완전히 되돌리기 어렵습니다</td>
                    <td className="py-2 pr-4">압축 방식에 따라 원본과 같은 데이터를 유지할 수 있습니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">어울리는 상황</td>
                    <td className="py-2 pr-4">사진 첨부, 블로그 이미지, 웹 게시용 파일</td>
                    <td className="py-2 pr-4">캡처, 아이콘, 투명 배경 이미지, 문서 보관용 파일</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">용도별 목표 용량은 어느 정도가 적당한가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">정확한 제한은 서비스마다 다르지만, 처음 압축할 때 참고할 만한 범위는 있습니다. 이메일은 받는 사람의 환경을 고려해 너무 큰 원본 여러 장을 그대로 보내지 않는 편이 좋고, 게시판이나 블로그는 로딩 속도를 위해 화면 크기에 맞춘 용량이 유리합니다. 원서나 지원서 접수는 사이트에서 제시하는 상한이 최우선입니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">일반적인 목표</th>
                    <th className="py-2 pr-4 text-brand-black">확인할 점</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">이메일 첨부</td>
                    <td className="py-2 pr-4">한 장당 수백 KB에서 1MB 안팎이면 전달이 편합니다</td>
                    <td className="py-2 pr-4">여러 장이면 전체 첨부 용량 제한을 봅니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">게시판·블로그 업로드</td>
                    <td className="py-2 pr-4">화면 표시용은 1MB 이하를 먼저 목표로 잡을 수 있습니다</td>
                    <td className="py-2 pr-4">서비스별 자동 리사이즈 여부가 다릅니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">원서·지원서 접수</td>
                    <td className="py-2 pr-4">공고의 파일 상한 아래로 맞춥니다</td>
                    <td className="py-2 pr-4">사진 규격과 파일 형식 조건을 함께 확인합니다</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">압축해도 용량이 안 줄어드는 이유는 무엇인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">이미 충분히 압축된 JPG는 다시 눌러도 줄어드는 폭이 작을 수 있습니다. 특히 메신저나 SNS에서 받은 사진은 업로드 과정에서 한 번 최적화된 파일일 가능성이 높습니다. 이 경우 품질 값을 더 낮추면 숫자는 줄어도 얼굴과 글자가 눈에 띄게 무너질 수 있으므로 <Link href="/tools/image/resize" className="text-brand-accent hover:underline">이미지 크기 조절</Link>로 실제 가로세로를 줄이는 편이 더 효과적일 때가 많습니다.</p>
            <p className="text-brand-mid leading-relaxed mb-4">사진을 PNG로 저장했을 때 용량이 커지는 일도 흔합니다. PNG는 선명한 그래픽과 투명 배경에는 강하지만, 색 변화가 많은 사진에는 비효율적일 수 있습니다. 사진 파일은 JPG나 WebP 계열이 대체로 작고, 캡처나 로고는 PNG가 더 나은 경우가 있어 이미지 성격에 맞춰 고르는 것이 중요합니다.</p>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 이미지 용량을 줄이면 화질이 떨어지나요?
                </h3>
                <p className="text-brand-mid">
                  적절한 압축률(70-85%)을 사용하면 육안으로 구분하기 어려운
                  수준의 화질 저하만 발생합니다. 무손실 압축 옵션을 사용하면
                  화질 저하 없이 용량만 줄일 수도 있습니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 어떤 이미지 포맷이 용량이 가장 작나요?
                </h3>
                <p className="text-brand-mid">
                  일반적으로 WebP가 가장 효율적입니다. 같은 화질 기준으로
                  JPG보다 25-35% 작은 용량을 제공합니다. 사진은 JPG, 투명 배경이
                  필요하면 PNG, 웹용이면 WebP를 추천합니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 온라인에서 이미지 압축하면 개인정보가 유출되나요?
                </h3>
                <p className="text-brand-mid">
                  대부분의 온라인 압축 도구는 서버에 파일을 업로드합니다.
                  개인정보가 걱정된다면 기기에서 직접 처리하는 도구를
                  고르세요. floor05는 사진이 네트워크로 오가지 않습니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 이미지 용량 줄이기
              </h3>
              <p className="text-brand-light mb-6">
                품질을 조절하면서 용량과 화질을 눈으로 비교해 보세요.
                <br />
                압축은 지금 쓰는 브라우저 안에서 끝납니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 압축
                </Link>
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 리사이즈
                </Link>
                <Link
                  href="/tools/image/convert"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  포맷 변환
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="image-compression-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
