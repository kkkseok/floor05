import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("prevent-photo-theft"),
  title: "사진 도용 막는 법 - 워터마크부터 업로드 크기까지",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "사진 도용을 완전히 막을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "화면에 보이는 이상 캡처를 100% 막을 수는 없습니다. 다만 워터마크, 낮은 업로드 해상도, 출처 표기로 도용의 '비용'을 높이면 무단 사용이 크게 줄고, 도용되더라도 출처를 증명하기 쉬워집니다.",
      },
    },
    {
      "@type": "Question",
      name: "가장 효과적인 사진 도용 방지 방법은 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "눈에 보이는 워터마크가 가장 현실적입니다. 특히 사진 전체에 반복되는 워터마크는 일부를 잘라내도 남아 제거가 어렵습니다. 투명도를 낮추고 살짝 회전시키면 감상은 살리면서 보호 효과를 얻습니다.",
      },
    },
    {
      "@type": "Question",
      name: "우클릭 방지 같은 건 효과가 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "거의 없습니다. 우클릭 방지 스크립트는 캡처·개발자도구·주소로 이미지 열기로 쉽게 우회됩니다. 이미지 자체에 새겨지는 워터마크처럼 '파일에 남는' 방법이 훨씬 효과적입니다.",
      },
    },
  ],
};

export default function PreventPhotoTheftPage() {
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
            <span className="text-brand-mid">사진 도용 막기</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 도용 막는 법
            </h1>
            <p className="text-lg text-brand-mid">
              완벽히 막을 순 없지만, 도용의 비용을 높이는 현실적인 방법들
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
              블로그에 올린 사진이 출처 없이 퍼지고, 중고거래 사진이 다른
              판매글에 쓰이고, SNS 게시물이 무단으로 도용됩니다. 화면에 보이는
              이미지를 100% 막는 방법은 없습니다. 하지만 도용을 <strong>귀찮고
              티 나게</strong> 만들면 대부분은 포기하고, 도용되더라도 출처를
              증명하기 쉬워집니다. 이 글은 그 현실적인 방법들을 정리합니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 보호하고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                파일이 서버로 전송되지 않는 무료 워터마크 도구로 사진에 표시를
                남겨보세요.
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
              1. 도용은 어디서 일어날까
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>블로그·웹</strong>: 이미지 주소 복사, 우클릭 저장으로 그대로
                재업로드
              </li>
              <li>
                <strong>중고거래</strong>: 남의 상품 사진을 가져다 쓰는 허위 매물
              </li>
              <li>
                <strong>SNS</strong>: 캡처 후 출처 없이 재게시
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              공통점은 &ldquo;원본 그대로&rdquo; 가져간다는 점입니다. 그래서 원본에
              표시를 남기거나, 원본을 덜 쓸모 있게 만드는 게 핵심입니다.
            </p>

            {/* 섹션 2 - 워터마크 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 가장 효과적: 보이는 워터마크
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              눈에 보이는 워터마크는 도용을 가장 직접적으로 줄입니다. 가져가도
              내 이름·아이디가 따라붙으니까요.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>전체 반복</strong>: 모서리에 한 번만 넣으면 잘라내면 끝입니다.
                사진 전체에 반복해 깔면 일부를 잘라도 남습니다.
              </li>
              <li>
                <strong>낮은 투명도 + 약간의 회전</strong>: 20~40% 투명도에 살짝
                기울이면 감상은 살리고 제거는 까다로워집니다.
              </li>
              <li>
                <strong>지우기 어려운 위치</strong>: 피사체 위를 가로지르게 두면
                단순 크롭으로 못 지웁니다.
              </li>
            </ul>

            {/* 인라인 CTA */}
            <BlogInlineCTA href="/tools/image/watermark" label="워터마크 넣기 →">
              텍스트나 로고로, 전체 반복까지 바로 적용해볼 수 있습니다.
            </BlogInlineCTA>

            {/* 섹션 3 - 해상도 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 원본 해상도를 그대로 올리지 않기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              인쇄·재판매에 쓰려면 고해상도 원본이 필요합니다. 웹에 보여줄
              목적이라면 표시에 충분한 크기로 줄여 올리는 것만으로도 도용의 활용
              가치를 낮춥니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                업로드 전{" "}
                <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                  리사이즈
                </Link>
                로 화면 표시에 맞는 폭(예: 가로 1080~1600px)으로 줄이세요.
              </li>
              <li>
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  압축
                </Link>
                까지 하면 용량도 줄고, 인쇄용으로 재사용하기 더 어려워집니다.
              </li>
            </ul>

            {/* 섹션 4 - 출처 표기 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 출처·저작권을 함께 남기기
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                사진 옆 본문이나 캡션에 촬영자·출처를 명시하면, 도용 시 원작자
                증명이 쉬워집니다.
              </li>
              <li>
                워터마크 텍스트에 아이디·도메인을 넣으면 이미지만 떠돌아도 출처가
                따라갑니다.
              </li>
            </ul>

            {/* 섹션 5 - 한계 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 효과 없는 방법 (솔직하게)
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>우클릭 방지 스크립트</strong>: 캡처·개발자도구·주소로 열기로
                쉽게 우회됩니다.
              </li>
              <li>
                <strong>캡처 자체 차단</strong>: 화면에 보이는 이상 완전 차단은
                불가능합니다. &ldquo;막기&rdquo;보다 &ldquo;티 나게 만들기&rdquo;가
                현실적입니다.
              </li>
            </ul>

            {/* 섹션 6 - 도용 당하면 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 이미 도용당했다면
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>원본 파일(촬영 원본, 업로드 기록)로 먼저 작성했음을 확보하세요.</li>
              <li>플랫폼의 신고·저작권 침해 신고 기능으로 삭제를 요청할 수 있습니다.</li>
              <li>워터마크가 있으면 출처 증명이 한결 수월합니다.</li>
            </ul>

            {/* FAQ */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진 도용을 완전히 막을 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  화면에 보이는 이상 캡처를 100% 막을 순 없습니다. 다만 워터마크,
                  낮은 업로드 해상도, 출처 표기로 도용의 비용을 높이면 무단 사용이
                  크게 줄고, 도용되더라도 출처를 증명하기 쉬워집니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 가장 효과적인 방법은 무엇인가요?
                </h3>
                <p className="text-brand-mid">
                  눈에 보이는 워터마크, 특히 사진 전체에 반복되는 워터마크가 가장
                  현실적입니다. 투명도를 낮추고 살짝 회전시키면 감상은 살리면서
                  보호 효과를 얻습니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 우클릭 방지 같은 건 효과가 있나요?
                </h3>
                <p className="text-brand-mid">
                  거의 없습니다. 캡처·개발자도구로 쉽게 우회됩니다. 이미지 자체에
                  새겨지는 워터마크처럼 파일에 남는 방법이 훨씬 효과적입니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                사진에 표시부터 남기기
              </h3>
              <p className="text-brand-light mb-6">
                회원가입 없이 무료로 표시를 남기세요.
                <br />
                지키려는 사진을 남의 서버에 맡기지 않아도 됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/watermark"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  워터마크 넣기
                </Link>
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 리사이즈
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 압축
                </Link>
              </div>
            </div>

            <BlogExtras slug="prevent-photo-theft" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
