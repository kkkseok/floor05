import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "아이폰 HEIC 사진 JPG 변환 방법 - 가장 쉬운 무료 변환",
  description:
    "아이폰에서 찍은 HEIC 사진을 JPG로 변환하는 가장 쉬운 방법을 소개합니다. 무료 온라인 도구로 1초 만에 변환하세요.",
  keywords: [
    "HEIC JPG 변환",
    "아이폰 사진 변환",
    "HEIC 변환",
    "HEIC to JPG",
    "아이폰 HEIC",
    "HEIC 파일 열기",
    "아이폰 사진 JPG",
  ],
  alternates: { canonical: "/blog/heic-to-jpg-guide" },
  openGraph: {
    url: "/blog/heic-to-jpg-guide",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "아이폰 HEIC 사진 JPG 변환 방법",
    description:
      "아이폰에서 찍은 HEIC 사진을 JPG로 변환하는 가장 쉬운 방법을 소개합니다.",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "HEIC 파일이란 무엇인가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HEIC(High Efficiency Image Container)는 애플이 iOS 11부터 도입한 이미지 포맷입니다. JPG보다 약 50% 작은 용량으로 같은 화질을 제공하지만, 윈도우나 일부 앱에서 지원되지 않는 경우가 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "이미 압축된 HEIC를 다시 JPG로 바꾸면 화질이 많이 상하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "HEIC와 JPG 모두 눈에 덜 띄는 정보를 덜어내는 손실 압축이라, 품질을 90%대로 두고 한 번 변환하는 정도로는 두 번째 압축의 흔적이 거의 드러나지 않습니다. 다만 같은 사진을 반복해 저장하면 손실이 조금씩 쌓이므로 원본 HEIC는 남겨 두는 편이 좋습니다.",
      },
    },
    {
      "@type": "Question",
      name: "아이폰에서 처음부터 JPG로 저장할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네, 설정 > 카메라 > 포맷에서 '높은 호환성'을 선택하면 처음부터 JPG로 저장됩니다. 단, 저장 용량이 약 2배로 늘어납니다.",
      },
    },
  ],
};

export default function HeicToJpgGuidePage() {
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
            <span className="text-brand-mid">HEIC JPG 변환</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              아이폰 HEIC 사진 JPG 변환 방법
            </h1>
            <p className="text-lg text-brand-mid">
              가장 쉬운 무료 변환 방법을 알려드립니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-03-07">2026-03-07</time>
              <span>·</span>
              <span>3분 읽기</span>
            </div>
          </header>

          {/* 본문 */}
          <div className="prose prose-lg max-w-none">
            {/* 도입 */}
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              아이폰으로 찍은 사진을 컴퓨터로 옮겼는데 열리지 않나요?
              아마 HEIC 포맷 때문일 겁니다. 이 글에서는 HEIC 파일을 JPG로
              변환하는 가장 쉬운 방법을 알려드립니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 바로 변환하고 싶다면?
              </p>
              <p className="text-brand-mid text-sm mb-4">
                파일이 서버로 전송되지 않는 무료 HEIC 변환 도구를 사용해보세요.
              </p>
              <Link
                href="/tools/image/heic-to-jpg"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                HEIC → JPG 변환 도구 사용하기 →
              </Link>
            </div>

            {/* 섹션 1 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              HEIC 파일이란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              HEIC(High Efficiency Image Container)는 애플이 iOS 11(2017년)부터
              도입한 이미지 포맷입니다. JPG보다 약 50% 작은 용량으로 같은 화질을
              제공합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              문제는 윈도우, 안드로이드, 일부 웹사이트에서 HEIC를 지원하지 않는다는
              것입니다. 그래서 다른 기기나 서비스에서 사용하려면 JPG로 변환해야 합니다.
              아래 그림처럼 변환 한 번이면 대부분의 호환성 문제가 풀립니다.
            </p>

            <figure className="my-8">
              <svg viewBox="0 0 410 170" role="img" width="100%" className="block max-w-xl mx-auto" style={{ height: "auto" }}>
                <title>HEIC에서 JPG로 변환하는 흐름</title>
                <desc>아이폰 HEIC를 변환하면 JPG가 되며, HEIC는 아이폰에서만 잘 열리고 JPG는 어디서나 열리는 호환성 차이를 함께 표시합니다.</desc>
                <rect x="16" y="44" width="110" height="54" rx="6" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="71" y="66" textAnchor="middle" fontSize="13" fill="#0A0A0A">아이폰</text>
                <text x="71" y="84" textAnchor="middle" fontSize="13" fill="#0A0A0A">HEIC</text>
                <line x1="128" y1="71" x2="154" y2="71" stroke="#0A0A0A" strokeWidth="1.5" />
                <polygon points="154,66.5 160,71 154,75.5" fill="#0A0A0A" />
                <rect x="160" y="44" width="90" height="54" rx="6" fill="#C45C2C" />
                <text x="205" y="76" textAnchor="middle" fontSize="14" fill="#FFFFFF">변환</text>
                <line x1="252" y1="71" x2="278" y2="71" stroke="#0A0A0A" strokeWidth="1.5" />
                <polygon points="278,66.5 284,71 278,75.5" fill="#0A0A0A" />
                <rect x="284" y="44" width="110" height="54" rx="6" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="339" y="76" textAnchor="middle" fontSize="15" fill="#0A0A0A">JPG</text>
                <text x="71" y="124" textAnchor="middle" fontSize="12" fill="#4A4A4A">아이폰 <tspan fill="#C45C2C">✓</tspan></text>
                <text x="71" y="142" textAnchor="middle" fontSize="12" fill="#4A4A4A">윈도우·구형 <tspan fill="#B0B0B0">✗</tspan></text>
                <text x="339" y="124" textAnchor="middle" fontSize="12" fill="#4A4A4A">어디서나 <tspan fill="#C45C2C">✓</tspan></text>
              </svg>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">아이폰 HEIC를 변환하면, 윈도우와 구형 기기까지 어디서나 열리는 JPG가 됩니다.</figcaption>
            </figure>

            {/* 섹션 2 */}
            <BlogInlineCTA href="/tools/image/heic-to-jpg" label="HEIC → JPG 변환 →">
              아이폰 사진을 지금 JPG로 바꿔야 한다면.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              HEIC를 JPG로 변환하는 방법
            </h2>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 1: 온라인 변환 도구 (가장 쉬움)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              가장 빠르고 쉬운 방법입니다. 프로그램 설치 없이 웹브라우저에서
              바로 변환할 수 있습니다.
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>HEIC 변환 도구 페이지 접속</li>
              <li>HEIC 파일 드래그 앤 드롭 (또는 클릭해서 선택)</li>
              <li>자동 변환 후 JPG 다운로드</li>
            </ol>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 2: 아이폰 설정 변경 (예방)
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              처음부터 JPG로 저장하도록 설정을 변경할 수 있습니다:
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>설정 앱 열기</li>
              <li>카메라 선택</li>
              <li>포맷 선택</li>
              <li>&quot;높은 호환성&quot; 선택</li>
            </ol>
            <p className="text-brand-light text-sm mb-6">
              ※ 단, 저장 용량이 약 2배로 늘어납니다.
            </p>

            <h3 className="text-xl font-semibold text-brand-black mt-8 mb-3">
              방법 3: 맥에서 내보내기
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              맥 사용자라면 미리보기 앱에서 간단히 변환할 수 있습니다:
            </p>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>HEIC 파일을 미리보기로 열기</li>
              <li>파일 → 내보내기 선택</li>
              <li>포맷을 JPEG로 변경</li>
              <li>저장</li>
            </ol>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">HEIC와 JPG는 실제로 무엇이 다른가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">핵심은 저장 효율과 호환성의 균형입니다. HEIC는 같은 장면을 비교적 작은 용량으로 저장하는 데 유리하지만, JPG는 오래된 프로그램과 웹 서비스까지 폭넓게 열리는 장점이 있습니다. 아이폰 안에서만 관리할 사진이라면 HEIC가 편할 수 있고, 누군가에게 제출하거나 여러 기기에서 열어야 한다면 JPG가 덜 번거로운 선택이 됩니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">HEIC</th>
                    <th className="py-2 pr-4 text-brand-black">JPG</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">같은 사진 기준 용량</td>
                    <td className="py-2 pr-4">대체로 더 작게 저장되는 편입니다</td>
                    <td className="py-2 pr-4">비슷한 품질에서는 더 커질 수 있습니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">화질 효율</td>
                    <td className="py-2 pr-4">새 압축 방식이라 효율이 좋은 편입니다</td>
                    <td className="py-2 pr-4">널리 쓰이지만 오래된 압축 방식입니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">호환성</td>
                    <td className="py-2 pr-4">환경에 따라 열리지 않을 수 있습니다</td>
                    <td className="py-2 pr-4">대부분의 웹사이트와 앱에서 바로 받습니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">지원 환경</td>
                    <td className="py-2 pr-4">최신 iOS, macOS, 일부 Windows 환경에서 편합니다</td>
                    <td className="py-2 pr-4">PC, 모바일, 프린터, 게시판 전반에서 안정적입니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">편집 프로그램 지원</td>
                    <td className="py-2 pr-4">프로그램 버전에 따라 플러그인이나 확장 기능이 필요할 수 있습니다</td>
                    <td className="py-2 pr-4">기본 사진 편집기부터 전문 편집기까지 폭넓게 지원합니다</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">윈도우 PC에서 HEIC가 안 열리는 이유는 무엇인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">대부분은 확장 기능 지원 여부 때문입니다. Windows 기본 사진 앱은 버전과 설정에 따라 HEIC를 바로 보여 주기도 하지만, 어떤 환경에서는 별도 이미지 확장 기능 설치가 필요할 수 있습니다. 개인 PC라면 필요한 구성 요소를 설치해 해결할 수 있지만, 회사 PC나 학교 공용 PC처럼 설치 권한이 제한된 곳에서는 변환이 더 빠른 해법이 됩니다.</p>
            <p className="text-brand-mid leading-relaxed mb-4">특히 보안 정책이 강한 PC에서는 스토어 접근이 막혀 있거나 확장 기능 설치가 승인 절차를 거쳐야 할 수 있습니다. 이럴 때는 원본 HEIC를 보관해 두고 제출용 사본만 <Link href="/tools/image/convert" className="text-brand-accent hover:underline">이미지 포맷 변환</Link>으로 JPG로 바꾸면 상대방 환경에 덜 의존하게 됩니다.</p>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어디에 낼 때 JPG로 바꾸는 게 안전한가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">제출처가 파일 형식을 엄격히 안내하지 않았더라도 JPG가 무난한 경우가 많습니다. 관공서 민원 서류, 학교 과제나 증빙 자료, 채용 지원서, 자격시험 접수, 오래된 게시판 업로드처럼 시스템이 다양한 사용자 파일을 받아야 하는 곳에서는 호환성이 우선입니다. 인쇄소에 사진을 보낼 때도 JPG는 확인과 출력 과정에서 예측하기 쉽습니다.</p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>업로드 버튼 옆에 JPG, JPEG, PNG만 표시되어 있으면 HEIC는 피합니다.</li>
              <li>담당자가 파일을 열어 확인해야 하는 서류라면 범용 형식이 전달 사고를 줄입니다.</li>
              <li>오래 보관할 증빙 자료는 원본 HEIC와 제출용 JPG를 따로 두면 다시 변환할 때 편합니다.</li>
            </ul>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 이미 압축된 HEIC를 또 JPG로 압축하면 화질이 많이 상하지 않나요?
                </h3>
                <p className="text-brand-mid">
                  걱정만큼 상하지는 않습니다. HEIC와 JPG 모두 눈에 덜 띄는 정보를
                  덜어내는 방식이라, 90%대 품질로 옮기면 두 번째 압축의 흔적은
                  대개 알아보기 어렵습니다. 다만 같은 사진을 몇 번이고 다시
                  저장하면 조금씩 뭉개지므로, 원본 HEIC는 지우지 말고 남겨 두는
                  편이 안전합니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 안드로이드 폰이나 회사 PC에서도 이 방법이 통하나요?
                </h3>
                <p className="text-brand-mid">
                  네. 변환은 브라우저가 맡는 일이라, 아이폰에서 받은 HEIC를
                  안드로이드나 PC 브라우저에 올려도 똑같이 JPG로 나옵니다. 오히려
                  HEIC가 안 열려 애먹는 쪽이 안드로이드·구형 PC인 만큼, 파일을 받는
                  기기에서 곧바로 바꿔 쓰기 좋습니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 온라인 변환 시 개인정보가 유출되나요?
                </h3>
                <p className="text-brand-mid">
                  많은 온라인 변환 사이트는 파일을 서버에 올려 처리합니다. 이
                  도구는 변환을 브라우저 안에서 끝내기 때문에, 사진이 기기 밖으로
                  나가는 단계 자체가 없습니다.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 HEIC 변환하기
              </h3>
              <p className="text-brand-light mb-6">
                HEIC를 골라 놓기만 하면 JPG로 바로 바뀝니다.
                <br />
                원본 사진은 기기 밖으로 나가지 않습니다.
              </p>
              <Link
                href="/tools/image/heic-to-jpg"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                HEIC → JPG 변환 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="heic-to-jpg-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
