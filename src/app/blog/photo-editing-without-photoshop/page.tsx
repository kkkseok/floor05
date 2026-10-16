import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("photo-editing-without-photoshop"),
  title: "포토샵 없이 사진 편집하기 - 무료 브라우저 도구 총정리",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "포토샵 없이 사진 편집이 가능한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "압축, 크기 조절, 포맷 변환, 자르기, 합치기 같은 대부분의 기본 편집은 설치 없이 브라우저에서 무료로 할 수 있습니다. 전문적인 합성·리터칭이 아니라면 포토샵이 필요 없는 경우가 많습니다.",
      },
    },
    {
      "@type": "Question",
      name: "무료 온라인 사진 편집은 안전한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "도구에 따라 다릅니다. 파일을 서버에 업로드하는 도구도 있지만, 브라우저에서 직접 처리하는 도구를 쓰면 사진이 기기를 떠나지 않아 더 안전합니다.",
      },
    },
    {
      "@type": "Question",
      name: "설치나 회원가입이 필요한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "브라우저 기반 도구는 설치가 필요 없습니다. floor05의 이미지 도구는 회원가입 없이 무제한 무료로 사용할 수 있습니다.",
      },
    },
  ],
};

export default function PhotoEditingWithoutPhotoshopPage() {
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
            <span className="text-brand-mid">포토샵 없이 사진 편집</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              포토샵 없이 사진 편집하기
            </h1>
            <p className="text-lg text-brand-mid">
              설치도 결제도 없이, 브라우저에서 끝내는 기본 편집 총정리
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-11">2026-06-11</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              사진 한 장 줄이려고 포토샵을 켜는 건 과합니다. 용량 줄이기, 크기
              조절, 포맷 변환, 자르기, 합치기 — 우리가 일상에서 하는 사진 편집의
              대부분은 설치 없이 브라우저에서 무료로 끝낼 수 있습니다. 작업별로
              어떤 도구를 쓰면 되는지 정리했습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 핵심부터 말하면
              </p>
              <p className="text-brand-mid text-sm mb-0">
                아래 도구들은 모두 <strong>설치·회원가입 없이</strong>,{" "}
                <strong>파일을 서버로 보내지 않고</strong> 브라우저에서 바로
                처리합니다. 필요한 작업을 골라 바로 쓰세요.
              </p>
            </div>

            {/* 작업별 도구 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 용량이 너무 클 때 — 압축
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이메일 첨부, 업로드 제한에 걸릴 때. 품질을 조금만 낮춰도 용량은
              절반 이하로 줄어듭니다. 목표 용량(예: 200KB)을 정하면 자동으로
              맞춰주기도 합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              {" · 자세히는 "}
              <Link href="/blog/image-compression-guide" className="text-brand-accent hover:underline">
                용량 줄이기 총정리
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 크기가 안 맞을 때 — 리사이즈
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              인스타, 유튜브 썸네일, 블로그처럼 플랫폼마다 권장 크기가 다릅니다.
              픽셀이나 비율, SNS 프리셋으로 한 번에 맞출 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                이미지 리사이즈
              </Link>
              {" · "}
              <Link href="/blog/sns-image-size" className="text-brand-accent hover:underline">
                SNS별 크기 총정리
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 확장자를 바꿔야 할 때 — 포맷 변환
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              PNG를 JPG로, 또는 웹용 WebP로. 투명 배경 처리도 함께 됩니다.
              아이폰 HEIC 사진은 전용 변환을 쓰면 편합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                포맷 변환
              </Link>
              {" · "}
              <Link href="/tools/image/heic-to-jpg" className="text-brand-accent hover:underline">
                HEIC → JPG
              </Link>
              {" · "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 필요한 부분만 — 크롭
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              불필요한 여백을 잘라내거나 1:1, 16:9 같은 비율로 맞출 때.
              회전·반전도 함께 됩니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                이미지 크롭
              </Link>
              {" · "}
              <Link href="/blog/image-crop-guide" className="text-brand-accent hover:underline">
                사진 자르기 가이드
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 여러 장을 하나로 — 합치기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              대화 캡처를 길게 잇거나, 사진을 나란히 비교할 때. 세로·가로로
              한 장에 합칠 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/tools/image/merge" className="text-brand-accent hover:underline">
                이미지 합치기
              </Link>
              {" · "}
              <Link href="/blog/image-merge-guide" className="text-brand-accent hover:underline">
                사진 합치기 가이드
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 왜 브라우저 도구일까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              브라우저에서 처리하는 도구는 설치가 없고, 무엇보다 사진이 기기를
              떠나지 않습니다. 가족 사진이나 신분증처럼 민감한 이미지라면 더욱
              중요한 차이입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              →{" "}
              <Link href="/blog/browser-image-tools-privacy" className="text-brand-accent hover:underline">
                서버에 안 올리는 안전한 이미지 도구
              </Link>
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">하려는 작업별로 어떤 도구를 쓰면 되나요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">작업 이름을 먼저 정하면 필요한 도구도 자연스럽게 좁혀집니다. 사진을 예쁘게 보정하는 일과 제출 규격에 맞추는 일은 목적이 다르므로, 한 화면에서 모든 기능을 찾기보다 필요한 조작만 골라 쓰는 편이 실수가 적습니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">작업</th>
                    <th className="py-2 pr-4 text-brand-black">도구</th>
                    <th className="py-2 pr-4 text-brand-black">언제 쓰는지</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">자르기</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/crop" className="text-brand-accent hover:underline">이미지 자르기</Link></td>
                    <td className="py-2 pr-4">불필요한 여백을 빼거나 정해진 비율로 맞출 때 씁니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">크기 조절</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/resize" className="text-brand-accent hover:underline">이미지 크기 조절</Link></td>
                    <td className="py-2 pr-4">가로세로 픽셀 조건이나 표시 크기를 맞출 때 유용합니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">용량 압축</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/compress" className="text-brand-accent hover:underline">이미지 압축</Link></td>
                    <td className="py-2 pr-4">업로드 제한에 걸리거나 전송 용량을 줄이고 싶을 때 씁니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">포맷 변환</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/convert" className="text-brand-accent hover:underline">이미지 포맷 변환</Link></td>
                    <td className="py-2 pr-4">HEIC, PNG, WebP 등을 JPG처럼 필요한 형식으로 바꿀 때 씁니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">여러 장 합치기</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/merge" className="text-brand-accent hover:underline">이미지 합치기</Link></td>
                    <td className="py-2 pr-4">비교 이미지, 전후 사진, 안내용 한 장 이미지를 만들 때 편합니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">워터마크</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/watermark" className="text-brand-accent hover:underline">워터마크 넣기</Link></td>
                    <td className="py-2 pr-4">사진 출처를 표시하거나 무단 사용을 줄이고 싶을 때 씁니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">모자이크</td>
                    <td className="py-2 pr-4"><Link href="/tools/image/mosaic" className="text-brand-accent hover:underline">이미지 모자이크</Link></td>
                    <td className="py-2 pr-4">얼굴, 차량 번호, 주소처럼 공개하면 곤란한 부분을 가릴 때 필요합니다</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">그래도 포토샵이 필요한 경우는 언제인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">전문 편집의 중심은 여전히 전용 도구가 맡는 편이 좋습니다. 여러 레이어를 겹쳐 합성하고 마스크를 세밀하게 다루는 작업, 피부나 제품 사진을 자연스럽게 리터칭하는 작업, 색을 기준값에 맞춰 보정하는 작업은 브라우저 유틸리티보다 전문 프로그램이 안정적입니다. 인쇄소에 넘길 CMYK 작업이나 색상 프로파일 관리가 중요한 제작물도 마찬가지입니다.</p>
            <p className="text-brand-mid leading-relaxed mb-4">반대로 제출 파일 만들기, 블로그용 이미지 정리, 메신저로 보낼 사진 가볍게 줄이기처럼 결과 기준이 명확한 일은 간단한 도구만으로 충분한 경우가 많습니다. 중요한 것은 도구의 이름보다 작업의 난이도와 결과물의 쓰임을 먼저 보는 것입니다.</p>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">워터마크와 모자이크까지 필요한 이유는 무엇인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">사진을 공개하거나 공유할 때는 보기 좋게 만드는 것만큼 노출 범위를 정리하는 일도 중요합니다. 워터마크는 직접 촬영한 상품 사진, 포트폴리오 이미지, 중고 거래 사진에 출처 표시를 남길 때 도움이 됩니다. 완전한 도용 방지를 보장하지는 않지만, 출처를 지우고 다시 쓰는 행동을 줄이는 장치로 활용할 수 있습니다.</p>
            <p className="text-brand-mid leading-relaxed mb-4">모자이크는 개인정보 보호 쪽에 더 가깝습니다. 택배 송장, 신분증 일부, 차량 번호, 아이 얼굴, 회사 내부 화면처럼 공개 범위를 제한해야 하는 요소가 있으면 업로드 전에 가리는 습관이 좋습니다. 한 번 게시된 이미지는 복사되어 남을 수 있으므로, 공개 후 삭제보다 공개 전 정리가 더 현실적인 대응입니다.</p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 포토샵 없이 사진 편집이 가능한가요?
                </h3>
                <p className="text-brand-mid">
                  압축, 크기 조절, 포맷 변환, 자르기, 합치기 같은 기본 편집은
                  설치 없이 브라우저에서 무료로 됩니다. 전문 합성·리터칭이
                  아니라면 포토샵이 필요 없는 경우가 많습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 무료 온라인 사진 편집은 안전한가요?
                </h3>
                <p className="text-brand-mid">
                  도구에 따라 다릅니다. 파일을 서버에 올리는 도구도 있지만,
                  브라우저에서 직접 처리하는 도구를 쓰면 사진이 기기를 떠나지
                  않아 더 안전합니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 설치나 회원가입이 필요한가요?
                </h3>
                <p className="text-brand-mid">
                  브라우저 기반 도구는 설치가 필요 없습니다. floor05의 도구는
                  회원가입 없이 무제한 무료입니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 시작하기
              </h3>
              <p className="text-brand-light mb-6">
                필요한 작업을 골라 바로 쓰세요. 모두 무료입니다.
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
                  href="/tools/image/merge"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 합치기
                </Link>
              </div>
            </div>

            <BlogExtras slug="photo-editing-without-photoshop" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
