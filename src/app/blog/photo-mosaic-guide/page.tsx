import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("photo-mosaic-guide"),
  title: "사진 모자이크로 개인정보 가리는 법 - 복원 위험까지",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "가린 모자이크를 복원할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "이 도구로 가린 영역은 원본 픽셀이 사라져 복원할 수 없습니다. 다만 약한 모자이크는 형태가 비칠 수 있으니 강도를 충분히 높이세요.",
      },
    },
    {
      "@type": "Question",
      name: "모자이크와 블러 중 뭐가 안전한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "둘 다 강도를 충분히 높이면 알아보기 어렵습니다. 핵심은 강도이며, 너무 약하면 형태가 드러날 수 있습니다. 글자·숫자는 모자이크, 얼굴·배경은 블러가 어울립니다.",
      },
    },
    {
      "@type": "Question",
      name: "스티커나 이모지로 가려도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "픽셀을 완전히 덮으면 괜찮지만, 편집 앱에 따라 스티커가 별도 레이어로 남아 나중에 되돌릴 수 있는 경우가 있습니다. 최종 저장본에서 원본 픽셀이 남지 않는 방식인지 확인하세요.",
      },
    },
  ],
};

export default function PhotoMosaicGuidePage() {
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
            <span className="text-brand-mid">사진 모자이크로 개인정보 가리는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 모자이크로 개인정보 가리는 법
            </h1>
            <p className="text-lg text-brand-mid">중고거래·SNS 올리기 전에</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-29">2026-06-29</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              중고거래 사진에 비친 얼굴, 택배 상자에 적힌 주소, 주차된 차의 번호판. 무심코 올린
              사진 한 장에 생각보다 많은 개인정보가 담깁니다. 올리기 전에 이런 부분을 가리는 습관이
              필요한데, 그 방법과 주의할 점을 정리했습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 가리고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                가릴 부분을 드래그하면 모자이크나 블러로 덮어 줍니다. 원본은 이 브라우저 안에서만 열리고 처리됩니다.
              </p>
              <Link
                href="/tools/image/mosaic"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                사진 모자이크 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">무엇을 가려야 하나</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              올리기 전에 아래 목록대로 사진을 한 바퀴 훑어보세요. 글자와 숫자를 먼저 찾는 게
              요령입니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>사람 얼굴</strong> — 본인·가족은 물론, 동의 없이 찍힌 행인도
              </li>
              <li>
                <strong>차량 번호판</strong> — 번호만으로 집·직장 주변이 특정될 수 있음
              </li>
              <li>
                <strong>택배 송장</strong> — 이름·전화번호·주소가 한 장에 모인 최악의 조합
              </li>
              <li>
                <strong>명찰·사원증·교복</strong> — 이름과 소속이 그대로 드러남
              </li>
              <li>
                <strong>집이 드러나는 요소</strong> — 아파트 동·호수 표지, 창밖 풍경, 특징적인 간판
              </li>
              <li>
                <strong>화면·서류</strong> — 모니터에 띄운 개인정보, 신분증·카드, 계약서
              </li>
              <li>
                <strong>티켓의 바코드·QR</strong> — 사진만으로 도용될 수 있음
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              마지막으로 확대해서 구석까지 확인하세요. 거울이나 유리, 안경알에 비친 반사는 의외의
              복병입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              모자이크와 블러의 차이
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              모자이크는 네모난 격자로 뭉개고, 블러는 부드럽게 흐립니다. 보기에는 블러가 자연스럽지만,
              중요한 건 <strong>강도</strong>입니다. 약하게 처리하면 두 방식 모두 원래 형태가 비쳐
              글자나 얼굴이 읽힐 수 있습니다. 신분증 번호나 얼굴처럼 확실히 가려야 한다면 강도를
              충분히 높이세요.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              고르는 기준은 간단합니다. 번호판·송장처럼 <strong>글자와 숫자</strong>를 가릴 땐 격자로
              확실히 뭉개지는 모자이크가 낫고, 얼굴이나 배경처럼 사진의 분위기를 살리고 싶은 부분은
              블러가 자연스럽습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              강도는 어느 정도가 적당할까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              기준은 하나입니다. <strong>처리한 뒤 화면을 축소해서 봐도 내용을 알아볼 수 없어야
              합니다.</strong> 사람 눈은 흐릿한 이미지를 작게 볼 때 오히려 잘 읽어내기 때문에, 원본
              크기에서 안 보인다고 안심하긴 이릅니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>글자·숫자 — 획의 구분이 완전히 사라질 만큼</li>
              <li>얼굴 — 눈·코·입의 위치를 가늠할 수 없을 만큼</li>
              <li>영역 — 대상에 딱 맞추지 말고 주변까지 여유 있게</li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              애매하면 한 단계 더 강하게 하세요. 모자이크는 과해서 문제가 된 적이 없습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              &lsquo;복원&rsquo; 위험을 피하려면
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              약한 블러나 모자이크는 소프트웨어로 어느 정도 되돌릴 수 있다는 점이 알려져 있습니다.
              floor05의{" "}
              <Link href="/tools/image/mosaic" className="text-brand-accent hover:underline">
                사진 모자이크
              </Link>
              는 가린 영역의 원본 픽셀을 실제로 덮어쓰기 때문에, 그 부분의 정보가 파일에서 사라집니다.
              다만 너무 약하게 처리하면 시각적으로 형태가 남을 수 있으니 강도를 넉넉히 주는 게
              안전합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              펜이나 스티커로 덮는 방법도 흔한데, 편집 앱에 따라 스티커가 별도 레이어로 남아 나중에
              되돌릴 수 있는 경우가 있습니다. 원본 위에 얹기만 한 건지, 픽셀 자체를 덮어쓴 건지가
              관건입니다. 최종적으로 내보낸 이미지에서 원본 픽셀이 남아 있지 않아야 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              서버에 올리지 않는 게 핵심
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              가리려는 정보가 민감할수록, 그 사진을 외부 서버에 업로드하는 것 자체가 위험합니다.
              이미 한 번 올라간 파일은 어디에 남는지 알기 어렵기 때문입니다. 이 도구는 처리를 전부
              브라우저 안에서 끝내므로, 가리기 전 사진이 업로드되는 순간 자체가 없습니다. 저장되는 것은 이미 처리를 마친 결과 이미지뿐입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 가린 모자이크를 복원할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  이 도구로 가린 영역은 원본 픽셀이 사라져 복원할 수 없습니다. 단, 강도를 충분히
                  높여야 형태가 비치지 않습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 모자이크와 블러 중 뭐가 안전한가요?
                </h3>
                <p className="text-brand-mid">
                  둘 다 강도가 충분하면 안전합니다. 글자·숫자는 모자이크, 얼굴·배경은 블러가
                  어울립니다. 약하면 어느 쪽이든 형태가 비칠 수 있습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 스티커나 이모지로 가려도 되나요?
                </h3>
                <p className="text-brand-mid">
                  픽셀을 완전히 덮으면 괜찮지만, 앱에 따라 스티커가 레이어로 남아 되돌릴 수 있는
                  경우가 있습니다. 최종 저장본에서 원본이 남지 않는지 확인하세요.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 여러 곳을 한 번에 가릴 수 있나요?
                </h3>
                <p className="text-brand-mid">네. 가릴 부분을 차례로 드래그하면 여러 곳을 가릴 수 있습니다.</p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진이 서버에 올라가나요?
                </h3>
                <p className="text-brand-mid">
                  아니요. 모자이크 처리는 브라우저의 캔버스 위에서 이루어지고, 저장 버튼을
                  누르면 완성본이 곧장 내 기기로 내려옵니다. 가리기 전 원본이 밖으로 나갈 일은 없습니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">올리기 전에 가리기</h3>
              <p className="text-brand-light mb-6">
                얼굴·번호판·주소를 드래그로 가리기. 가입 절차 없이 그냥 씁니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/mosaic"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  사진 모자이크
                </Link>
                <Link
                  href="/tools/image/watermark"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  워터마크 넣기
                </Link>
              </div>
            </div>

            <BlogExtras slug="photo-mosaic-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
