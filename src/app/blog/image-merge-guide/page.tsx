import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-merge-guide"),
  title: "사진 여러 장 한 장으로 합치기 - 세로·가로·캡처 이어붙이기",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "사진 여러 장을 한 장으로 어떻게 합치나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "합칠 사진을 모두 올린 뒤 세로 또는 가로 방향을 고르고 합치기를 누르면 한 장으로 이어붙습니다. 이 과정은 브라우저가 직접 처리해, 사진을 서버로 올리지 않고 끝냅니다.",
      },
    },
    {
      "@type": "Question",
      name: "카카오톡 대화 캡처를 길게 이어붙일 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 캡처들을 순서대로 올리고 '세로로 합치기'와 '너비 맞추기'를 선택하면 하나의 긴 이미지로 이어집니다. 캡처는 보통 폭이 같아 깔끔하게 붙습니다.",
      },
    },
    {
      "@type": "Question",
      name: "크기가 다른 사진도 합쳐지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "'너비(높이) 맞추기'를 선택하면 비율을 유지한 채 같은 폭으로 맞춰 이어붙이고, '원본 크기 유지'를 선택하면 크기를 그대로 두고 빈 공간을 배경색으로 채웁니다.",
      },
    },
  ],
};

export default function ImageMergeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
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
            <span className="text-brand-mid">사진 합치기</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 여러 장 한 장으로 합치기
            </h1>
            <p className="text-lg text-brand-mid">
              세로로, 가로로, 캡처 이어붙이기까지 — 설치 없이 브라우저에서
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-11">2026-06-11</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              카카오톡 대화를 한 장으로 캡처해 공유하고 싶을 때, 상품 사진을
              나란히 비교하고 싶을 때, 비포·애프터를 한 컷에 담고 싶을 때.
              사진 여러 장을 한 장으로 합치는 일은 생각보다 자주 필요합니다.
              이 글은 가장 간단한 방법을 정리합니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 합치고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                여러 장을 세로·가로로 이어 붙이는 무료 도구, 사진은 브라우저 안에만 둡니다.
              </p>
              <Link
                href="/tools/image/merge"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 합치기 도구 사용하기 →
              </Link>
            </div>

            {/* 섹션 1 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 사진 합치기, 언제 쓸까
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>대화 캡처 이어붙이기</strong>: 여러 번 나눠 캡처한 카톡·메신저
                대화를 하나의 긴 이미지로
              </li>
              <li>
                <strong>상품·후기 비교</strong>: 여러 장을 나란히 붙여 한눈에 비교
              </li>
              <li>
                <strong>비포 / 애프터</strong>: 변화 과정을 한 컷에
              </li>
              <li>
                <strong>긴 글·메뉴판 캡처</strong>: 스크롤하며 찍은 화면을 한 장으로
              </li>
            </ul>

            {/* 섹션 2 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 세로로? 가로로?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              방향은 용도로 정하면 쉽습니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>세로로 합치기</strong>: 대화 캡처, 긴 글처럼 위에서 아래로
                이어지는 내용. 모바일에서 보기 좋습니다.
              </li>
              <li>
                <strong>가로로 합치기</strong>: 사진을 나란히 비교하거나 파노라마처럼
                옆으로 늘어놓을 때.
              </li>
            </ul>

            {/* 섹션 3 */}
            <BlogInlineCTA href="/tools/image/merge" label="사진 합치기 →">
              방향까지 정했다면, 바로 합쳐봐도 됩니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 크기가 다른 사진을 합칠 때
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              사진마다 크기가 다르면 들쭉날쭉해 보이기 쉽습니다. 두 가지 방식 중
              하나를 고르세요.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>너비(높이) 맞추기</strong>: 비율을 유지한 채 모든 사진을 같은
                폭으로 맞춰 깔끔하게 이어붙입니다. 캡처 합치기에 가장 잘 맞습니다.
              </li>
              <li>
                <strong>원본 크기 유지</strong>: 크기를 그대로 두고 빈 공간을 배경색으로
                채웁니다. 사진별 크기를 보존하고 싶을 때.
              </li>
            </ul>

            {/* 섹션 4 - 사용 방법 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 브라우저에서 합치는 법 (4단계)
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>합칠 이미지 2장 이상을 올립니다.</li>
              <li>목록에서 위/아래 버튼으로 합칠 순서를 정합니다.</li>
              <li>세로/가로 방향과 크기 맞춤, 간격·배경색을 설정합니다.</li>
              <li>합치기를 누르고 결과를 다운로드합니다.</li>
            </ol>

            {/* 섹션 5 - 팁 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 깔끔하게 합치는 팁
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>간격</strong>: 사진 사이에 약간의 간격을 주면 경계가 또렷해집니다.
                캡처를 자연스럽게 잇고 싶다면 간격은 0이 좋습니다.
              </li>
              <li>
                <strong>배경색</strong>: 흰색이 무난하지만, 캡처 배경이 어두우면 같은
                톤으로 맞추면 이질감이 줄어듭니다.
              </li>
              <li>
                <strong>포맷</strong>: 사진은 JPG, 글자·로고처럼 또렷함이 중요하면 PNG가
                좋습니다.
              </li>
              <li>
                합친 뒤 용량이 크면{" "}
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  이미지 압축
                </Link>
                으로 줄이세요.
              </li>
            </ul>

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진 여러 장을 한 장으로 어떻게 합치나요?
                </h3>
                <p className="text-brand-mid">
                  합칠 사진을 모두 올린 뒤 세로 또는 가로 방향을 고르고 합치기를
                  누르면 한 장으로 이어붙습니다. 이 과정은 브라우저가 직접 처리해,
                  사진을 서버로 올리지 않고 끝냅니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 카카오톡 대화 캡처를 길게 이어붙일 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네. 캡처들을 순서대로 올리고 &lsquo;세로로 합치기&rsquo;와
                  &lsquo;너비 맞추기&rsquo;를 선택하면 하나의 긴 이미지로 이어집니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 크기가 다른 사진도 합쳐지나요?
                </h3>
                <p className="text-brand-mid">
                  &lsquo;너비(높이) 맞추기&rsquo;로 같은 폭에 맞추거나, &lsquo;원본
                  크기 유지&rsquo;로 크기를 보존하고 빈 공간을 배경색으로 채울 수
                  있습니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 사진 합치기
              </h3>
              <p className="text-brand-light mb-6">
                이어붙이기는 가입 없이 무료예요.
                <br />
                합칠 사진과 캡처는 내 브라우저에서만 이어집니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/merge"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 합치기
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 압축
                </Link>
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 크롭
                </Link>
              </div>
            </div>

            <BlogExtras slug="image-merge-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
