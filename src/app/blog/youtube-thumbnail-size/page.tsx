import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("youtube-thumbnail-size"),
  title: "유튜브 썸네일 크기 - 공식 권장 3840×2160과 용량 한도",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "유튜브 썸네일 권장 크기는 얼마인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "유튜브 도움말의 권장 크기는 3840×2160픽셀(16:9)이고 최소 너비는 640픽셀입니다. 형식은 JPG와 PNG, 용량 한도는 모바일 2MB, 데스크톱 50MB입니다(2026-11-22 확인). 1280×720도 16:9이고 최소 너비를 넘으므로 올릴 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "썸네일이 자꾸 잘려요. 왜 그런가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "유튜브는 동영상 썸네일을 16:9 비율로 올리라고 권장합니다. 다른 비율의 이미지는 먼저 16:9로 잘라서 올리면, 어디가 잘릴지를 직접 정할 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "썸네일 용량이 2MB를 넘으면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "2MB는 모바일에서 올릴 때의 한도이고 데스크톱은 50MB입니다. 모바일에서 올려야 한다면 크기를 줄이거나 JPG로 저장하고 품질을 낮추면 됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "쇼츠 썸네일도 따로 올릴 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "올릴 수 있습니다. 유튜브 도움말에 따르면 Shorts 썸네일 이미지는 현재 컴퓨터의 YouTube 스튜디오에서만 추가할 수 있고, 권장 크기는 2160×3840픽셀(9:16), 최소 높이는 640픽셀입니다(2026-11-22 확인).",
      },
    },
    {
      "@type": "Question",
      name: "커스텀 썸네일 업로드 버튼이 안 보여요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "유튜브 도움말은 맞춤 썸네일을 계정 인증 후에 올릴 수 있다고 안내합니다. 유튜브 스튜디오에서 계정 인증 상태를 먼저 확인해 보세요.",
      },
    },
  ],
};

export default function YoutubeThumbnailSizePage() {
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
            <span className="text-brand-mid">유튜브 썸네일 크기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              유튜브 썸네일 크기와 만드는 법
            </h1>
            <p className="text-lg text-brand-mid">
              공식 권장 크기와 용량 한도, 무료로 크기 맞추는 방법
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-11">2026-06-11</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              썸네일 규격은 유튜브가 가끔 바꿉니다. 이 글의 수치는 2026년 11월 22일에 유튜브 도움말에서
              직접 확인한 것이고, 예전에 널리 쓰이던 1280×720 권장은 지금 도움말에 없습니다. 올리기 전에
              공식 페이지를 한 번 확인하세요.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                바로 크기를 맞추고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                리사이즈 도구의 유튜브 썸네일 프리셋은 1280×720이고, 3840×2160은 직접 입력으로 맞춥니다.
                썸네일 이미지는 업로드 없이 브라우저에서 처리됩니다.
              </p>
              <Link
                href="/tools/image/resize"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 리사이즈 도구 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 유튜브 썸네일 권장 규격
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>권장 크기</strong>: 3840×2160 픽셀
              </li>
              <li>
                <strong>비율</strong>: 16:9
              </li>
              <li>
                <strong>최소 너비</strong>: 640픽셀
              </li>
              <li>
                <strong>용량</strong>: 모바일 2MB, 데스크톱 50MB
              </li>
              <li>
                <strong>형식</strong>: JPG, PNG
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              출처는{" "}
              <a href="https://support.google.com/youtube/answer/72431?hl=ko" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                YouTube 고객센터의 맞춤 썸네일 안내
              </a>
              이고 2026년 11월 22일에 확인했습니다. 1280×720은 권장 크기는 아니지만 16:9이고 최소 너비 640픽셀을
              넘으므로 올릴 수 있습니다. 모바일 한도 2MB 안에 넣기 쉬운 크기이기도 합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 왜 16:9가 중요할까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              유튜브는 동영상 썸네일을 16:9 비율로 올리라고 권장합니다. 3840×2160과 1280×720은 둘 다 정확히
              16:9입니다. 다른 비율의 사진을 쓴다면 올리기 전에 16:9로 직접 잘라 두는 편이 낫습니다. 어디가
              잘릴지를 내가 정할 수 있기 때문입니다. 도움말에 따르면 세로 동영상은 16:9 맞춤 썸네일을 올려도 홈,
              탐색, 구독 페이지에서는 자동 생성된 4:5 썸네일로 대체됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 썸네일만 있는 게 아니다 — 배치별 규격
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              유튜브에는 썸네일 말고도 크기를 맞춰야 할 이미지가 몇 가지 더
              있습니다. 유튜브 도움말에서 확인한 것만 표에 모았습니다(2026-11-22 확인).
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">도움말의 크기</th>
                    <th className="py-2 text-brand-black">비고</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">동영상 썸네일</td>
                    <td className="py-2 pr-4 font-mono">3840×2160</td>
                    <td className="py-2">16:9, 최소 너비 640px, 모바일 2MB·데스크톱 50MB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">Shorts 썸네일</td>
                    <td className="py-2 pr-4 font-mono">2160×3840</td>
                    <td className="py-2">9:16, 최소 높이 640px, 데스크톱 50MB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">채널 배너</td>
                    <td className="py-2 pr-4 font-mono">2560×1440</td>
                    <td className="py-2">최소 2048×1152, 안전 영역 1235×338, 6MB 이하</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">프로필 사진</td>
                    <td className="py-2 pr-4 font-mono">98×98로 표시</td>
                    <td className="py-2">JPG·GIF·BMP·PNG, 15MB 이하</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              Shorts 썸네일 이미지는 현재 컴퓨터의 YouTube 스튜디오에서만 추가할 수 있습니다. 채널 배너는
              기기에 따라 보이는 범위가 달라서, 도움말은 텍스트와 로고가 잘리지 않는 최소 안전 영역을
              1235×338픽셀로 안내합니다. 로고와 문구는 그 안에 두세요. 배너와 프로필 사진 수치의 출처는{" "}
              <a href="https://support.google.com/youtube/answer/10456525?hl=ko" target="_blank" rel="noopener noreferrer" className="text-brand-accent hover:underline">
                YouTube 고객센터의 채널 브랜딩 안내
              </a>
              입니다. 커뮤니티 게시물 이미지는 도움말에서 권장 크기를 찾지 못해 표에서 뺐습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 무료로 썸네일 크기 맞추기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              포토샵 없이 브라우저에서 세 단계면 끝납니다.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                  크롭
                </Link>
                에서 16:9 프리셋으로 썸네일 영역을 잡습니다.
              </li>
              <li>
                <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                  리사이즈
                </Link>
                에서 크기를 맞춥니다. 프리셋은 1280×720이고, 3840×2160은 직접 입력합니다.
              </li>
              <li>
                모바일에서 올릴 건데 용량이 2MB를 넘으면{" "}
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  압축
                </Link>
                으로 줄입니다.
              </li>
            </ol>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 2MB 제한에 걸렸다면
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              2MB는 모바일에서 올릴 때의 한도이고, 데스크톱 한도는 50MB입니다. 권장 크기 3840×2160으로 만든
              썸네일이나 PNG로 저장한 썸네일은 2MB를 넘기 쉽습니다. 컴퓨터에서 올리거나, 모바일에서 올려야
              한다면 순서대로 시도해 보세요.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>크기부터 확인</strong> — 3840×2160이라면 1280×720으로
                줄이는 것만으로 용량이 크게 떨어집니다.
              </li>
              <li>
                <strong>형식 바꾸기</strong> — 사진 위주 썸네일은 PNG보다
                JPG가 훨씬 가볍습니다. 같은 그림도 몇 배씩 차이가 납니다.
              </li>
              <li>
                <strong>품질 조절</strong> — JPG 품질을 80~85% 정도로 낮추면
                눈으로는 구분하기 어려운 수준에서 용량이 크게 줍니다.
              </li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-4">
              참고로 유튜브 도움말은 맞춤 썸네일을 계정 인증 후에 올릴 수 있다고 안내합니다. 크기를 다
              맞췄는데 업로드 버튼 자체가 없다면 계정 인증 상태를 먼저 확인하세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 클릭을 부르는 썸네일 팁
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                텍스트는 굵고 크게, 3~5단어 이내로. 모바일 목록에서 썸네일은
                엄지손톱만 하게 보입니다. 그 크기에서 안 읽히면 없는 글자입니다.
              </li>
              <li>
                오른쪽 아래 모서리는 비워두세요. 재생 시간 표시가 그 자리를
                덮습니다.
              </li>
              <li>
                중요한 요소는 가장자리를 피해 가운데로. 화면에 따라 살짝
                잘려도 살아남습니다.
              </li>
              <li>
                배경과 글자의 명암 대비를 확실히. 작아도 읽혀야 합니다.
              </li>
              <li>
                제목과 같은 문구를 썸네일에 반복하지 마세요. 썸네일 옆에는
                항상 제목이 함께 보이므로, 그 공간은 다른 정보에 쓰는 게
                이득입니다.
              </li>
              <li>
                시리즈물은 색·글꼴·레이아웃을 통일하세요. 목록에서 한눈에
                &lsquo;그 채널&rsquo;로 보입니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 유튜브 썸네일 권장 크기는 얼마인가요?
                </h3>
                <p className="text-brand-mid">
                  유튜브 도움말의 권장 크기는 3840×2160픽셀(16:9)이고 최소 너비는 640픽셀입니다. 형식은
                  JPG와 PNG, 용량 한도는 모바일 2MB, 데스크톱 50MB입니다(2026-11-22 확인). 1280×720도
                  올릴 수 있습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 썸네일이 자꾸 잘려요.
                </h3>
                <p className="text-brand-mid">
                  유튜브는 16:9 비율로 올리라고 권장합니다. 다른 비율의 이미지는 먼저 16:9로 잘라서 올리면
                  어디가 잘릴지를 직접 정할 수 있습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 용량이 2MB를 넘으면요?
                </h3>
                <p className="text-brand-mid">
                  2MB는 모바일 한도이고 데스크톱은 50MB입니다. 모바일에서 올려야 한다면 크기를 줄이거나
                  JPG로 저장하고 품질을 낮추면 됩니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 쇼츠 썸네일도 따로 올릴 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  올릴 수 있습니다. 현재는 컴퓨터의 YouTube 스튜디오에서만 추가할 수 있고, 권장 크기는
                  2160×3840픽셀(9:16), 최소 높이는 640픽셀입니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 커스텀 썸네일 업로드 버튼이 안 보여요.
                </h3>
                <p className="text-brand-mid">
                  유튜브 도움말은 맞춤 썸네일을 계정 인증 후에 올릴 수 있다고 안내합니다. 유튜브 스튜디오에서
                  계정 인증 상태를 확인해 보세요.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 썸네일 크기 맞추기
              </h3>
              <p className="text-brand-light mb-6">
                썸네일 크기 맞춤은 가입 없이 무료입니다.
                <br />
                썸네일은 서버를 거치지 않고 이 브라우저 안에서 다듬습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 리사이즈
                </Link>
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 크롭
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 압축
                </Link>
              </div>
            </div>

            <BlogExtras slug="youtube-thumbnail-size" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
