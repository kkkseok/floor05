import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "사진 자르기 완벽 가이드 - 비율별 크롭 방법",
  description:
    "사진 자르기, 크롭하는 방법을 알려드립니다. 1:1 정사각형, 4:3, 16:9 등 비율별 가이드와 무료 온라인 도구.",
  keywords: [
    "사진 자르기",
    "이미지 크롭",
    "사진 크롭",
    "정사각형 사진",
    "1:1 자르기",
    "16:9 자르기",
    "4:3 자르기",
    "온라인 사진 자르기",
  ],
  alternates: { canonical: "/blog/image-crop-guide" },
  openGraph: {
    title: "사진 자르기 완벽 가이드 - 비율별 크롭 방법",
    description: "사진 자르기, 크롭하는 방법. 비율별 가이드와 무료 도구",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "사진을 정사각형으로 자르려면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "이미지 크롭 도구에서 1:1 비율 프리셋을 선택하고, 원하는 영역을 드래그해서 선택한 뒤 자르기 버튼을 클릭하면 됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "16:9 비율은 어디에 쓰나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "16:9는 유튜브 썸네일, TV 화면, 프레젠테이션 슬라이드에 주로 사용됩니다. 대부분의 와이드스크린 디스플레이에 최적화된 비율입니다.",
      },
    },
    {
      "@type": "Question",
      name: "자르기와 리사이즈의 차이는 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "자르기(크롭)는 사진의 일부 영역만 잘라내는 것이고, 리사이즈는 전체 사진의 크기(픽셀)를 조절하는 것입니다. 자르면 잘린 부분은 사라지고, 리사이즈는 전체가 유지됩니다.",
      },
    },
  ],
};

export default function ImageCropGuidePage() {
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
            <span className="text-brand-mid">사진 자르기 가이드</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 자르기 완벽 가이드
            </h1>
            <p className="text-lg text-brand-mid">
              비율별 크롭 방법과 무료 온라인 도구
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
              사진의 불필요한 부분을 잘라내고 싶거나, SNS에 올리기 좋은 비율로
              만들고 싶을 때 크롭 기능을 사용합니다. 포토샵 없이도 브라우저에서
              쉽게 자를 수 있는 방법을 알려드립니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 지금 바로 자르고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                비율 프리셋으로 원클릭 크롭. 회전, 반전도 가능합니다.
              </p>
              <Link
                href="/tools/image/crop"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 크롭 도구 →
              </Link>
            </div>

            {/* 자르기란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 사진 자르기(크롭)란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              크롭(Crop)은 사진에서 원하는 영역만 잘라내는 작업입니다.
              배경의 불필요한 부분을 제거하거나, 특정 비율에 맞게 조정할 때 사용합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              리사이즈와 달리 크롭은 잘린 부분이 완전히 제거되므로,
              원본 보존이 필요하다면 복사본을 만들어두세요.
            </p>

            {/* 자르기 vs 리사이즈 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-brand-black mb-4">
                자르기 vs 리사이즈 차이점
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-brand-black mb-2">자르기 (Crop)</p>
                  <ul className="text-brand-mid space-y-1">
                    <li>• 일부 영역만 남김</li>
                    <li>• 잘린 부분 삭제됨</li>
                    <li>• 비율 변경 가능</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium text-brand-black mb-2">리사이즈 (Resize)</p>
                  <ul className="text-brand-mid space-y-1">
                    <li>• 전체 이미지 유지</li>
                    <li>• 픽셀 수만 변경</li>
                    <li>• 원본 비율 유지 가능</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 비율별 가이드 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 비율별 용도 가이드
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">비율</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">용도</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">예시 크기</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20 bg-brand-accent/5">
                    <td className="py-3 px-4 font-medium">1:1</td>
                    <td className="py-3 px-4">인스타 피드, 프로필 사진, 앨범 커버</td>
                    <td className="py-3 px-4 font-mono">1080×1080</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">4:3</td>
                    <td className="py-3 px-4">일반 사진, 블로그 썸네일</td>
                    <td className="py-3 px-4 font-mono">1200×900</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">3:4</td>
                    <td className="py-3 px-4">인스타 세로형, 증명사진</td>
                    <td className="py-3 px-4 font-mono">1080×1350</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">16:9</td>
                    <td className="py-3 px-4">유튜브 썸네일, TV, 프레젠테이션</td>
                    <td className="py-3 px-4 font-mono">1920×1080</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">9:16</td>
                    <td className="py-3 px-4">인스타 스토리, 릴스, TikTok</td>
                    <td className="py-3 px-4 font-mono">1080×1920</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">자유 비율</td>
                    <td className="py-3 px-4">원하는 영역만 자유롭게</td>
                    <td className="py-3 px-4 font-mono">—</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-brand-mid leading-relaxed mb-4">
              아래 그림에서 세 비율의 실제 가로세로 모양을 눈으로 확인할 수 있습니다.
            </p>

            <figure className="my-8">
              <svg viewBox="0 0 420 145" role="img" width="100%" className="block max-w-xl mx-auto" style={{ height: "auto" }}>
                <title>1:1, 4:3, 16:9 비율 비교</title>
                <desc>같은 높이를 기준으로 1:1 정사각형, 4:3, 16:9 직사각형의 가로 폭을 실제 비율대로 그려 비교한 그림입니다.</desc>
                <rect x="10" y="25" width="90" height="90" rx="4" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="55" y="75" textAnchor="middle" fontSize="15" fill="#0A0A0A">1:1</text>
                <rect x="115" y="25" width="120" height="90" rx="4" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="175" y="75" textAnchor="middle" fontSize="15" fill="#0A0A0A">4:3</text>
                <rect x="250" y="25" width="160" height="90" rx="4" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="330" y="75" textAnchor="middle" fontSize="15" fill="#0A0A0A">16:9</text>
              </svg>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">같은 높이 기준으로 1:1은 정사각형, 16:9로 갈수록 가로가 길어집니다.</figcaption>
            </figure>

            {/* 사용 방법 */}
            <BlogInlineCTA href="/tools/image/crop" label="사진 자르기 →">
              비율 감 잡으셨나요? 바로 잘라봐도 됩니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. floor05에서 사진 자르는 방법
            </h2>

            <ol className="list-decimal list-inside text-brand-mid space-y-4 mb-6">
              <li>
                <strong>이미지 업로드</strong> — 자르고 싶은 사진을 드래그하거나 클릭해서 선택
              </li>
              <li>
                <strong>비율 선택</strong> — 상단 프리셋에서 원하는 비율 클릭 (자유 비율도 가능)
              </li>
              <li>
                <strong>영역 조절</strong> — 크롭 박스를 드래그해서 자를 위치와 크기 조정
              </li>
              <li>
                <strong>회전/반전 (선택)</strong> — 필요시 90° 회전이나 좌우/상하 반전 적용
              </li>
              <li>
                <strong>자르기 및 다운로드</strong> — &quot;자르기&quot; 버튼 클릭 후 결과물 다운로드
              </li>
            </ol>

            {/* 팁 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 자르기 실수 없이 하는 팁
            </h2>

            <ul className="list-disc list-inside text-brand-mid space-y-3 mb-6">
              <li>
                <strong>중요한 요소는 중앙에</strong> — 얼굴, 제품, 텍스트 등 핵심 피사체를
                크롭 영역 중앙에 배치하세요.
              </li>
              <li>
                <strong>여백 남기기</strong> — 피사체 주변에 약간의 여백을 남겨야 숨 쉴 공간이 생깁니다.
              </li>
              <li>
                <strong>미리보기 확인</strong> — 자르기 전에 미리보기로 결과를 확인하세요.
                floor05는 실시간 미리보기를 제공합니다.
              </li>
              <li>
                <strong>원본 보존</strong> — 중요한 사진은 원본을 따로 보관하고 복사본을 편집하세요.
              </li>
            </ul>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 자른 후에 크기도 조절할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네, 자르기 후 리사이즈 도구로 넘어가면 됩니다.
                  floor05는 워크플로우 연결을 지원해서, 자르기 → 리사이즈 → 압축을
                  순서대로 진행할 수 있습니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 여러 장을 같은 비율로 자를 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  현재는 한 장씩 처리해야 합니다. 같은 프리셋을 선택하면
                  동일한 비율로 자를 수 있습니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 모바일에서도 사용할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네, floor05 크롭 도구는 모바일 브라우저에서도 잘 동작합니다.
                  터치로 크롭 영역을 조절할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                사진 자르기
              </h3>
              <p className="text-brand-light mb-6">
                비율 프리셋으로 원클릭 크롭. 회전과 반전도 지원.
                <br />
                자르는 동안에도 사진은 서버로 가지 않습니다.
              </p>
              <Link
                href="/tools/image/crop"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 크롭 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="image-crop-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
