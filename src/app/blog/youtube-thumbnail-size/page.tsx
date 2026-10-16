import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("youtube-thumbnail-size"),
  title: "유튜브 썸네일 크기 - 1280×720 규격과 무료로 만드는 법",
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
        text: "1280×720 픽셀(가로 세로 16:9 비율)이 권장 규격입니다. 가로 너비는 최소 640픽셀 이상이어야 하며, 파일 용량은 2MB 이하, JPG·PNG·WebP 형식을 지원합니다.",
      },
    },
    {
      "@type": "Question",
      name: "썸네일이 자꾸 잘려요. 왜 그런가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "16:9가 아닌 비율로 만들면 유튜브가 자동으로 잘라내거나 위아래에 검은 여백을 넣습니다. 1280×720 또는 16:9 비율로 맞추면 잘리지 않습니다.",
      },
    },
    {
      "@type": "Question",
      name: "썸네일 용량이 2MB를 넘으면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "이미지 압축으로 용량을 줄이면 됩니다. 1280×720 정도 크기라면 품질을 약간만 낮춰도 2MB 이하로 충분히 들어갑니다.",
      },
    },
    {
      "@type": "Question",
      name: "쇼츠 썸네일도 따로 올릴 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "쇼츠는 별도 이미지를 올리는 대신 업로드할 때 영상의 한 장면을 골라 썸네일로 쓰는 방식이 기본입니다. 세로 9:16(1080×1920) 화면 기준으로 첫 장면을 구성해 두는 게 요령입니다.",
      },
    },
    {
      "@type": "Question",
      name: "커스텀 썸네일 업로드 버튼이 안 보여요.",
      acceptedAnswer: {
        "@type": "Answer",
        text: "커스텀 썸네일은 전화번호 인증(중급 기능 사용 설정)을 마친 계정에서만 올릴 수 있습니다. 유튜브 스튜디오의 채널 설정에서 기능 사용 자격을 확인해 보세요.",
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
              1280×720 규격, 잘리지 않는 비율, 무료로 만드는 방법
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-11">2026-06-11</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              썸네일은 클릭률을 좌우하는 가장 중요한 요소입니다. 그런데 크기가
              안 맞아 잘리거나 흐릿하게 올라가면 공들인 디자인이 무색해집니다.
              규격부터 정확히 맞춰봅시다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 크기를 맞추고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                리사이즈 도구에서 1280×720으로 한 번에 맞출 수 있습니다.
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
                <strong>크기</strong>: 1280×720 픽셀 (권장)
              </li>
              <li>
                <strong>비율</strong>: 16:9
              </li>
              <li>
                <strong>최소 너비</strong>: 가로 640픽셀 이상
              </li>
              <li>
                <strong>용량</strong>: 2MB 이하
              </li>
              <li>
                <strong>형식</strong>: JPG, PNG, WebP
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 왜 16:9가 중요할까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              유튜브 플레이어와 추천 영역은 모두 16:9를 기준으로 표시됩니다.
              다른 비율로 만들면 자동으로 잘리거나 위아래에 검은 여백이 생겨
              지저분해 보입니다. 1280×720은 16:9를 정확히 만족하는 가장 무난한
              크기입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 썸네일만 있는 게 아니다 — 배치별 규격
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              유튜브에는 썸네일 말고도 크기를 맞춰야 할 이미지가 몇 가지 더
              있습니다. 자주 찾게 되는 규격을 한 표에 모았습니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">권장 크기</th>
                    <th className="py-2 text-brand-black">비고</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">동영상 썸네일</td>
                    <td className="py-2 pr-4 font-mono">1280×720</td>
                    <td className="py-2">16:9, 2MB 이하</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">쇼츠 화면</td>
                    <td className="py-2 pr-4 font-mono">1080×1920</td>
                    <td className="py-2">세로 9:16</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">커뮤니티 게시물</td>
                    <td className="py-2 pr-4 font-mono">1080×1080</td>
                    <td className="py-2">정사각형이 무난</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">채널 배너</td>
                    <td className="py-2 pr-4 font-mono">2560×1440</td>
                    <td className="py-2">안전 영역 1546×423</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">프로필 사진</td>
                    <td className="py-2 pr-4 font-mono">800×800</td>
                    <td className="py-2">원형으로 잘려 표시</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              쇼츠는 별도 이미지를 올리는 대신 업로드할 때 영상의 한 장면을
              썸네일로 고르는 방식이 기본입니다. 첫 1~2초 화면을
              &lsquo;썸네일이다&rsquo; 생각하고 구성해 두면 편합니다. 채널
              배너는 TV·PC·모바일에서 잘리는 범위가 제각각이라, 로고와 문구는
              반드시 중앙의 안전 영역(1546×423) 안에 넣어야 어느 기기에서든
              보입니다.
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
                에서 1280×720으로 크기를 맞춥니다.
              </li>
              <li>
                용량이 2MB를 넘으면{" "}
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
              고해상도 캡처나 PNG로 저장한 썸네일은 2MB를 훌쩍 넘기기 쉽습니다.
              업로드가 거부됐다면 순서대로 시도해 보세요.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>크기부터 확인</strong> — 4K 캡처라면 1280×720으로
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
              참고로 커스텀 썸네일 업로드는 전화번호 인증(중급 기능 사용
              설정)을 마친 계정에서만 가능합니다. 크기를 다 맞췄는데 업로드
              버튼 자체가 없다면 계정 설정을 먼저 확인하세요.
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
                  1280×720 픽셀(16:9)이 권장 규격입니다. 가로 너비는 최소
                  640픽셀 이상, 용량은 2MB 이하여야 합니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 썸네일이 자꾸 잘려요.
                </h3>
                <p className="text-brand-mid">
                  16:9가 아닌 비율이면 유튜브가 자동으로 잘라냅니다. 1280×720
                  또는 16:9 비율로 맞추면 잘리지 않습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 용량이 2MB를 넘으면요?
                </h3>
                <p className="text-brand-mid">
                  압축으로 줄이면 됩니다. 1280×720 크기라면 품질을 약간만 낮춰도
                  2MB 이하로 충분히 들어갑니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 쇼츠 썸네일도 따로 올릴 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  쇼츠는 별도 이미지 대신 업로드할 때 영상의 한 장면을 골라
                  쓰는 방식이 기본입니다. 세로 9:16 화면 기준으로 첫 장면을
                  구성해 두세요.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 커스텀 썸네일 업로드 버튼이 안 보여요.
                </h3>
                <p className="text-brand-mid">
                  전화번호 인증(중급 기능 사용 설정)을 마친 계정에서만 올릴 수
                  있습니다. 유튜브 스튜디오의 채널 설정을 확인해 보세요.
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
                썸네일은 서버를 거치지 않고 권장 규격으로 다듬습니다.
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
