import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "증명사진 용량 줄이기 - 200KB, 500KB 맞추는 방법",
  description:
    "취업사이트, 원서접수에 필요한 증명사진 용량 제한 맞추는 방법. 화질 손실 없이 200KB, 500KB로 줄이는 무료 도구.",
  keywords: [
    "증명사진 용량 줄이기",
    "증명사진 kb 줄이기",
    "증명사진 200kb",
    "증명사진 500kb",
    "취업 증명사진 용량",
    "원서 사진 용량",
    "사진 용량 줄이기",
  ],
  alternates: { canonical: "/blog/passport-photo-size" },
  openGraph: {
    title: "증명사진 용량 줄이기 - 200KB, 500KB 맞추는 방법",
    description: "취업사이트, 원서접수용 증명사진 용량을 화질 손실 없이 줄이는 방법",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "증명사진 용량을 200KB로 줄이려면 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "floor05 이미지 압축 도구에서 목표 용량을 200KB로 설정하고 변환하면 됩니다. 자동으로 최적의 품질을 찾아 화질 손실을 최소화합니다.",
      },
    },
    {
      "@type": "Question",
      name: "증명사진 크기 규격은 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일반 증명사진은 3×4cm(354×472px), 여권사진은 3.5×4.5cm(413×531px), 비자/영주권은 5×5cm(600×600px)입니다. 취업사이트마다 다를 수 있으니 공고를 확인하세요.",
      },
    },
    {
      "@type": "Question",
      name: "용량을 줄이면 화질이 많이 떨어지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "증명사진처럼 작은 이미지는 200~500KB로 줄여도 화질 차이가 거의 느껴지지 않습니다. 스마트폰으로 촬영한 원본이 수 MB라면 충분히 줄일 수 있습니다.",
      },
    },
  ],
};

export default function PassportPhotoSizePage() {
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
            <span className="text-brand-mid">증명사진 용량 줄이기</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              증명사진 용량 줄이기
            </h1>
            <p className="text-lg text-brand-mid">
              200KB, 500KB 용량 제한 맞추는 가장 쉬운 방법
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-03-10">2026-03-10</time>
              <span>·</span>
              <span>4분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              취업사이트에 원서를 넣으려는데 &quot;사진 용량이 500KB를 초과합니다&quot;라는
              메시지가 떴나요? 사진관에서 받은 증명사진은 보통 2~5MB라
              그대로는 올릴 수 없습니다. 화질을 최대한 지키면서 용량만 줄이는 방법을 알려드립니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 지금 바로 줄이고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                목표 용량을 입력하면 자동으로 맞춰드립니다. 브라우저에서 바로 처리.
              </p>
              <Link
                href="/tools/image/compress"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 압축 도구 →
              </Link>
            </div>

            {/* 용량 제한 안내 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 사이트별 증명사진 용량 제한
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              각 사이트마다 요구하는 용량 제한이 다릅니다. 대표적인 예시:
            </p>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">사이트</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">용량 제한</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">크기 제한</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">잡코리아·사람인</td>
                    <td className="py-3 px-4 font-mono">잡코리아 1MB·사람인 10MB</td>
                    <td className="py-3 px-4">크기 규정 없음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">공무원 원서접수</td>
                    <td className="py-3 px-4 font-mono">100KB 미만</td>
                    <td className="py-3 px-4">3.5×4.5cm (137×177px)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">대학 원서접수</td>
                    <td className="py-3 px-4 font-mono">300~500KB</td>
                    <td className="py-3 px-4">3×4cm</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">여권 신청</td>
                    <td className="py-3 px-4 font-mono">500KB 이하</td>
                    <td className="py-3 px-4">3.5×4.5cm</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-brand-light text-sm mb-6">
              ※ 정확한 규격은 각 사이트 공고를 확인하세요.
            </p>

            {/* 줄이는 방법 */}
            <BlogInlineCTA href="/tools/image/compress" label="용량 줄이기 →">
              제한 용량을 확인했다면, 증명사진을 바로 줄여보세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 증명사진 용량 줄이는 방법
            </h2>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 1: 목표 용량 설정 (추천)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 압축 도구에서 <strong>목표 용량</strong>을 직접 입력하면
              해당 용량에 맞게 자동으로 압축됩니다. 예를 들어 &quot;200KB&quot;를 입력하면
              200KB 이하로 정확하게 맞춰집니다.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>이미지 압축 도구에서 증명사진 업로드</li>
              <li>&quot;목표 용량&quot; 옵션 활성화</li>
              <li>원하는 용량(예: 200KB) 입력</li>
              <li>압축 버튼 클릭 → 다운로드</li>
            </ol>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 2: 품질 조절
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              품질 슬라이더로 80% → 70% → 60% 순으로 낮춰가며
              원하는 용량이 나올 때까지 조절합니다.
              증명사진은 70% 정도에서도 충분히 깨끗합니다.
            </p>

            {/* 화질 손상 최소화 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 화질을 지키며 줄이는 팁
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>원본 해상도가 너무 크다면?</strong> — 먼저 크기(px)를 줄이세요.
                3×4cm 증명사진은 354×472px면 충분합니다.
              </li>
              <li>
                <strong>JPG로 저장</strong> — PNG보다 용량이 훨씬 작습니다.
                증명사진은 투명 배경이 필요 없으니 JPG가 적합합니다.
              </li>
              <li>
                <strong>불필요한 여백 제거</strong> — 크롭 도구로 얼굴 중심으로
                잘라내면 같은 화질에서도 용량이 줄어듭니다.
              </li>
            </ul>

            {/* 증명사진 크기 규격 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 증명사진 크기 규격 정리
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">용도</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">실물 크기</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">픽셀 (300dpi)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">일반 증명사진</td>
                    <td className="py-3 px-4">3 × 4 cm</td>
                    <td className="py-3 px-4 font-mono">354 × 472 px</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">여권사진</td>
                    <td className="py-3 px-4">3.5 × 4.5 cm</td>
                    <td className="py-3 px-4 font-mono">413 × 531 px</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4">비자/영주권</td>
                    <td className="py-3 px-4">5 × 5 cm</td>
                    <td className="py-3 px-4 font-mono">600 × 600 px</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">운전면허</td>
                    <td className="py-3 px-4">3.5 × 4.5 cm</td>
                    <td className="py-3 px-4 font-mono">350 × 450 px (250KB 이하)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 여권 중심 규격 비교 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 여권사진과 관공서·시험 사진, 규격이 이렇게 다릅니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              여권사진은 다른 증명사진보다 규격이 까다로운 축에 듭니다. 외교부 기준으로 413×531px에
              흰색 배경, JPG 형식을 요구하고, 얼굴 크기와 눈 위치 같은 세부 조건까지 붙습니다. 같은 흰색
              배경이라도 공무원 원서접수나 토익 응시원서는 요구 픽셀이 여권보다 작아서, 여권용으로 만든
              사진을 그대로 다른 접수처에 올리면 크기가 맞지 않을 수 있습니다. 아래 표에 여권과 대표
              관공서·시험·취업 사진의 픽셀·배경·형식을 나란히 정리했습니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">픽셀 규격</th>
                    <th className="py-2 pr-4 text-brand-black">배경</th>
                    <th className="py-2 pr-4 text-brand-black">형식</th>
                    <th className="py-2 pr-4 text-brand-black">출처(기관)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">여권 신청</td>
                    <td className="py-2 pr-4">413×531px</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">외교부(passport.go.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">공무원 원서접수</td>
                    <td className="py-2 pr-4">137×177px</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">사이버국가고시(gosi.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">토익 응시원서</td>
                    <td className="py-2 pr-4">115×150px</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">YBM(toeic.co.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">잡코리아 이력서</td>
                    <td className="py-2 pr-4">자유</td>
                    <td className="py-2 pr-4">지정 없음</td>
                    <td className="py-2 pr-4">JPG·PNG</td>
                    <td className="py-2 pr-4">잡코리아(jobkorea)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">사람인 이력서</td>
                    <td className="py-2 pr-4">자유</td>
                    <td className="py-2 pr-4">지정 없음</td>
                    <td className="py-2 pr-4">JPG·PNG</td>
                    <td className="py-2 pr-4">사람인(saramin)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-light text-sm mb-6">
              ※ 픽셀·배경 규정은 각 기관 안내 기준이며, 여권은 얼굴 크기 등 추가 조건이 있으니 외교부 여권안내를 확인하세요.
            </p>

            {/* 편집 금지 규정과 용량 조정 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 편집 금지 규정, 용량 조정은 괜찮을까요
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              온라인으로 여권이나 운전면허를 신청할 때는 사진을 필터·합성·AI 편집으로 손댄 경우 반려한다는 규정이
              함께 붙습니다. 얼굴을 실제와 다르게 만들면 신원 확인이 어려워지기 때문입니다. 그렇다면 용량을 줄이는 일도
              편집에 해당하지 않을까 걱정될 수 있는데, 압축은 파일 크기를 낮추는 작업일 뿐 이목구비나 피부, 배경을 바꾸는
              가공이 아닙니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              여기서 안내한 목표 용량 맞추기나 크롭으로 여백을 덜어내는 방법은 사진에 담긴 얼굴을 그대로 두고
              크기·용량만 조정하는 것이라, 보정·합성을 금지하는 조항과 충돌하지 않는 편입니다. 다만 지나치게 압축해
              화질이 상하면 규격 미달로 반려될 수 있고 세부 기준은 접수처마다 다르니, 제출 전에는 해당 기관 공고를 한 번
              더 확인하세요.
            </p>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 스마트폰으로 찍은 셀카도 사용할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네, 배경이 단색이고 얼굴이 정면이라면 가능합니다.
                  크롭 도구로 3:4 비율로 자른 뒤 용량을 줄이면 됩니다.
                  단, 공식 서류용은 사진관에서 찍는 것이 안전합니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 여러 장을 한 번에 줄일 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네, floor05 압축 도구는 여러 장을 동시에 처리할 수 있습니다.
                  같은 설정으로 일괄 압축 후 ZIP으로 다운로드하세요.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 파일이 서버로 업로드되나요?
                </h3>
                <p className="text-brand-mid">
                  아니요. floor05는 브라우저에서 직접 처리하므로
                  <strong> 증명사진이 서버로 전송되지 않습니다.</strong>
                  개인정보가 담긴 사진도 안심하고 사용하세요.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                증명사진 용량 줄이기
              </h3>
              <p className="text-brand-light mb-6">
                목표 용량만 입력하면 자동으로 맞춰드립니다.
                <br />
                여권 사진 용량 조정은 지금 브라우저 안에서 끝나요.
              </p>
              <Link
                href="/tools/image/compress"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 압축 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="passport-photo-size" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
