import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-watermark-guide"),
  title: "사진에 워터마크 넣는 법 - 텍스트·로고·도용 방지까지",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "사진에 워터마크를 어떻게 넣나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "사진을 올리고 텍스트를 입력하거나 로고 이미지를 추가한 뒤, 위치와 투명도를 정하고 적용하면 됩니다. 합성은 이 브라우저가 직접 처리하며, 원본과 로고는 기기 밖으로 나가지 않습니다.",
      },
    },
    {
      "@type": "Question",
      name: "사진 도용을 막는 워터마크는 어떻게 만드나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "'전체 반복'을 켜면 워터마크가 사진 전체에 깔려 일부를 잘라내도 지우기 어렵습니다. 투명도를 30~50%로 낮추고 살짝 회전시키면 보기에 방해되지 않으면서 보호 효과가 큽니다.",
      },
    },
    {
      "@type": "Question",
      name: "상품 사진 수십 장에 같은 워터마크를 붙이려면?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "여러 장을 한 번에 올리면 지정한 워터마크가 모든 사진에 똑같이 얹힙니다. 결과는 ZIP으로 묶여 내려오고, 크기 값이 % 기준이라 해상도가 제각각이어도 워터마크 비율은 그대로 유지됩니다.",
      },
    },
  ],
};

export default function ImageWatermarkGuidePage() {
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
            <span className="text-brand-mid">워터마크 넣기</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진에 워터마크 넣는 법
            </h1>
            <p className="text-lg text-brand-mid">
              텍스트로, 로고로, 도용 방지 반복까지 — 설치 없이 브라우저에서
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-20">2026-06-20</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              블로그·중고거래·포트폴리오에 사진을 올릴 때, 누가 가져다 써도
              출처가 남도록 워터마크를 넣고 싶을 때가 있습니다. 비싼 편집
              프로그램 없이도 됩니다. 이 글은 텍스트와 로고 워터마크를 넣는
              방법과, 도용을 막는 설정을 정리합니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 넣고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                설치도 로그인도 없이, 브라우저에서 바로 워터마크를 얹는 무료 도구입니다.
              </p>
              <Link
                href="/tools/image/watermark"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                워터마크 도구 사용하기 →
              </Link>
            </div>

            {/* 섹션 1 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 텍스트 vs 로고, 무엇을 넣을까
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>텍스트 워터마크</strong>: 이름·아이디·© 표기를 빠르게. 글자
                크기·색·굵기만 정하면 됩니다. 가장 간단합니다.
              </li>
              <li>
                <strong>로고 워터마크</strong>: 브랜드·채널 로고를 올려 합성. 배경이
                투명한 PNG를 쓰면 사진 위에 자연스럽게 얹힙니다.
              </li>
            </ul>

            {/* 섹션 2 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 위치와 투명도, 이렇게 정하세요
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              워터마크는 &ldquo;보이되 거슬리지 않게&rdquo;가 핵심입니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>위치</strong>: 모서리(주로 오른쪽 아래)는 사진을 가장 덜
                가립니다. 9개 위치 중에서 고르세요.
              </li>
              <li>
                <strong>투명도</strong>: 30~50%가 무난합니다. 너무 진하면 사진을
                해치고, 너무 옅으면 잘려도 표시가 안 남습니다.
              </li>
              <li>
                <strong>여백</strong>: 가장자리에서 살짝 띄우면 잘림 없이 안정적으로
                보입니다.
              </li>
            </ul>

            {/* 인라인 CTA */}
            <BlogInlineCTA href="/tools/image/watermark" label="워터마크 넣기 →">
              감이 왔다면, 미리보기를 보며 바로 맞춰봐도 됩니다.
            </BlogInlineCTA>

            {/* 섹션 3 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 도용을 막는 워터마크 (전체 반복)
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              모서리에 한 번만 넣은 워터마크는 잘라내면 끝입니다. 도용이 걱정된다면
              <strong> 전체 반복</strong>을 켜세요.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>워터마크가 사진 전체에 바둑판처럼 깔려, 일부를 잘라도 남습니다.</li>
              <li>투명도를 20~40%로 낮추면 사진 감상은 살리고 보호는 유지됩니다.</li>
              <li>약 30° 회전시키면 자연스러우면서 제거가 더 까다로워집니다.</li>
            </ul>

            {/* 섹션 4 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 여러 장에 한 번에 넣기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              상품 사진 수십 장, 포트폴리오 묶음처럼 여러 장에 같은 워터마크가
              필요할 때가 많습니다. 한 장씩 작업할 필요 없습니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>여러 장을 한 번에 올리면 같은 설정이 모두에 적용됩니다.</li>
              <li>
                크기 옵션이 사진 크기에 비례한 %라, 크기가 제각각이어도 워터마크
                비율이 일정합니다.
              </li>
              <li>완료되면 ZIP으로 한 번에 내려받습니다.</li>
            </ul>

            {/* 섹션 5 - 사용 방법 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 브라우저에서 넣는 법 (4단계)
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>워터마크를 넣을 사진을 올립니다. (여러 장 가능)</li>
              <li>텍스트를 입력하거나 로고 이미지를 추가합니다.</li>
              <li>미리보기를 보며 위치·투명도·회전·반복을 맞춥니다.</li>
              <li>적용을 누르고 결과를 다운로드합니다.</li>
            </ol>

            {/* 섹션 6 - 팁 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 알아두면 좋은 점
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>포맷</strong>: 투명 로고나 또렷한 글자는 PNG, 용량이 중요하면
                JPG로 저장하세요.
              </li>
              <li>
                넣은 뒤 용량이 크면{" "}
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  이미지 압축
                </Link>
                으로 줄이고, 업로드 규격이 있으면{" "}
                <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                  리사이즈
                </Link>
                로 맞추면 됩니다.
              </li>
              <li>
                합성부터 저장까지 브라우저 안에서 끝나, 사진과 로고를 어디에도 올리지
                않습니다.
              </li>
            </ul>

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진에 워터마크를 어떻게 넣나요?
                </h3>
                <p className="text-brand-mid">
                  사진을 올리고 텍스트를 입력하거나 로고 이미지를 추가한 뒤, 위치와
                  투명도를 정하고 적용하면 됩니다. 합성은 이 브라우저가 직접 처리하며,
                  원본과 로고는 기기 밖으로 나가지 않습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진 도용을 막는 워터마크는 어떻게 만드나요?
                </h3>
                <p className="text-brand-mid">
                  &lsquo;전체 반복&rsquo;을 켜면 워터마크가 사진 전체에 깔려 일부를
                  잘라내도 지우기 어렵습니다. 투명도를 낮추고 살짝 회전시키면
                  보기에 방해되지 않으면서 보호 효과가 큽니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 상품 사진 수십 장에 같은 워터마크를 붙이려면?
                </h3>
                <p className="text-brand-mid">
                  여러 장을 한 번에 올리면 지정한 워터마크가 모든 사진에 똑같이
                  얹힙니다. 결과는 ZIP으로 묶여 내려오고, 크기 값이 % 기준이라
                  해상도가 제각각이어도 워터마크 비율은 그대로 유지됩니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 워터마크 넣기
              </h3>
              <p className="text-brand-light mb-6">
                워터마크 넣기도 무료, 가입은 빼고요.
                <br />
                로고를 올려도 원본은 브라우저 안에서만 합성됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/watermark"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  워터마크 넣기
                </Link>
                <Link
                  href="/tools/image/merge"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  사진 합치기
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 압축
                </Link>
              </div>
            </div>

            <BlogExtras slug="image-watermark-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
