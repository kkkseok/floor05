import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";

export const metadata: Metadata = {
  title: "이미지 배경 투명하게 만들기 - PNG 투명 배경 가이드",
  description:
    "이미지의 배경을 투명하게 만드는 방법. PNG 포맷의 투명도(알파 채널)를 활용해 배경 없는 이미지를 만들어보세요.",
  keywords: [
    "이미지 배경 투명",
    "PNG 투명 배경",
    "배경 없는 이미지",
    "투명 PNG",
    "알파 채널",
    "로고 배경 투명",
    "사진 배경 제거",
  ],
  alternates: { canonical: "/blog/transparent-background" },
  openGraph: {
    title: "이미지 배경 투명하게 만들기 - PNG 투명 배경 가이드",
    description: "PNG 투명 배경의 원리와 활용법",
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "JPG를 PNG로 변환하면 배경이 투명해지나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아니요, 단순히 포맷만 바꾸면 투명해지지 않습니다. 배경을 투명하게 만들려면 배경 제거 작업이 먼저 필요합니다. PNG는 투명도를 '저장'할 수 있는 포맷일 뿐입니다.",
      },
    },
    {
      "@type": "Question",
      name: "투명 배경 이미지는 어디에 사용하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "로고, 아이콘, 제품 사진, 스티커, 워터마크 등에 사용됩니다. 배경이 투명하면 어떤 배경 위에 올려도 자연스럽게 합성됩니다.",
      },
    },
    {
      "@type": "Question",
      name: "투명 PNG를 JPG로 변환하면 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "JPG는 투명도를 지원하지 않으므로, 투명 영역이 흰색(또는 검은색) 배경으로 채워집니다. 투명도를 유지하려면 PNG나 WebP 형식을 사용하세요.",
      },
    },
  ],
};

export default function TransparentBackgroundPage() {
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
            <span className="text-brand-mid">이미지 배경 투명하게</span>
          </nav>

          {/* 제목 */}
          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              이미지 배경 투명하게 만들기
            </h1>
            <p className="text-lg text-brand-mid">
              PNG 투명 배경의 원리와 활용법
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
              로고나 제품 컷을 어떤 배경에 올려도 겉돌지 않게 하려면 배경이 투명해야
              합니다. 그 투명함이 파일 안에서 어떻게 저장되고, 포맷을 바꿀 때 왜
              사라지기도 하는지 정리했습니다. 배경을 &lsquo;지우는&rsquo; 방법이 아니라 &lsquo;투명도를 다루는&rsquo; 관점의 글입니다.
            </p>

            {/* 안내 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                ⚠️ 참고: floor05는 배경 제거 기능을 제공하지 않습니다
              </p>
              <p className="text-brand-mid text-sm mb-4">
                floor05 포맷 변환 도구는 <strong>이미 투명한 PNG</strong>를 다른 포맷으로
                변환할 때 투명도를 유지/처리하는 기능을 제공합니다.
                배경 제거는 포토샵, remove.bg 등 전문 도구를 이용하세요.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 →
              </Link>
            </div>

            {/* 투명 배경이란 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 투명 배경이란?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이미지에서 &quot;투명&quot;이란 픽셀이 없는 것처럼 보이는 상태입니다.
              실제로는 &quot;알파 채널(Alpha Channel)&quot;이라는 투명도 정보가 저장되어 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              알파 채널은 각 픽셀의 불투명도를 0%(완전 투명)~100%(완전 불투명)로 기록합니다.
              이 정보가 있어야 다른 배경 위에 이미지를 올렸을 때 배경이 비쳐 보입니다.
            </p>

            {/* 포맷별 투명도 지원 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 포맷별 투명도 지원
            </h2>

            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">포맷</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">투명도</th>
                    <th className="text-left py-3 px-4 text-brand-black font-semibold">설명</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20 bg-brand-accent/5">
                    <td className="py-3 px-4 font-medium">PNG</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">투명 배경의 표준 포맷, 무손실 압축</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">WebP</td>
                    <td className="py-3 px-4 text-green-600 font-medium">지원</td>
                    <td className="py-3 px-4">PNG보다 용량 작음, 웹에 최적</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-3 px-4 font-medium">GIF</td>
                    <td className="py-3 px-4 text-yellow-600 font-medium">부분 지원</td>
                    <td className="py-3 px-4">1색만 투명 가능 (반투명 불가)</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium">JPG</td>
                    <td className="py-3 px-4 text-red-500 font-medium">미지원</td>
                    <td className="py-3 px-4">투명 영역이 흰색으로 채워짐</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 투명 배경 활용 예시 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 투명 배경 활용 예시
            </h2>

            <ul className="list-disc list-inside text-brand-mid space-y-3 mb-6">
              <li>
                <strong>로고</strong> — 명함, 웹사이트, 영상 등 다양한 배경에 올려도 자연스러움
              </li>
              <li>
                <strong>제품 사진</strong> — 쇼핑몰 상세페이지에서 배경 색상 자유롭게 변경 가능
              </li>
              <li>
                <strong>스티커/이모티콘</strong> — 메신저나 SNS에서 배경 없이 표시
              </li>
              <li>
                <strong>아이콘</strong> — 앱, 웹사이트 UI에 배경 없이 배치
              </li>
              <li>
                <strong>워터마크</strong> — 사진 위에 반투명하게 겹쳐서 저작권 표시
              </li>
            </ul>

            {/* 투명 PNG 만드는 방법 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 투명 PNG 만드는 방법
            </h2>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 1: 배경 제거 도구 사용
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              remove.bg, Canva, 포토샵 등에서 배경 제거 기능을 사용한 뒤
              PNG로 저장하면 투명 배경 이미지가 됩니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 2: 처음부터 투명 캔버스에서 작업
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              포토샵이나 일러스트레이터에서 새 파일 생성 시
              배경을 &quot;투명&quot;으로 설정하고 작업하면 됩니다.
              저장할 때 PNG 형식을 선택하세요.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">
              방법 3: 기존 투명 PNG 활용
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              이미 투명 배경으로 제작된 PNG 파일이 있다면,
              floor05 포맷 변환 도구에서 WebP로 변환해 용량을 줄일 수 있습니다.
              투명도는 그대로 유지됩니다.
            </p>

            {/* 주의사항 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 투명 이미지 다룰 때 주의사항
            </h2>

            <div className="space-y-4 text-brand-mid">
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">1.</span>
                <p className="text-brand-mid leading-relaxed mb-4">
                  <strong>JPG로 변환하면 투명 영역이 채워집니다</strong> —
                  floor05에서는 흰색으로 채워지며, 다른 도구에서는 검은색이 될 수도 있습니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">2.</span>
                <p className="text-brand-mid leading-relaxed mb-4">
                  <strong>투명 PNG는 용량이 큽니다</strong> —
                  웹에서 사용할 때는 WebP로 변환하면 투명도를 유지하면서 용량을 줄일 수 있습니다.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-brand-accent font-bold shrink-0">3.</span>
                <p className="text-brand-mid leading-relaxed mb-4">
                  <strong>SNS 업로드 시 확인하세요</strong> —
                  일부 플랫폼은 투명 PNG를 업로드하면 배경을 자동으로 채웁니다.
                </p>
              </div>
            </div>

            {/* floor05에서 할 수 있는 것 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. floor05에서 할 수 있는 작업
            </h2>

            <div className="bg-brand-paper rounded-lg p-6 mb-8">
              <ul className="space-y-3 text-brand-mid">
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>투명 PNG → WebP 변환 (투명도 유지, 용량 절감)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>투명 PNG → JPG 변환 (투명 영역을 흰색으로 채움)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>투명 PNG 리사이즈 (투명도 유지)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>투명 PNG 크롭 (투명도 유지)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-500 font-bold">✗</span>
                  <span>배경 제거 (포토샵, remove.bg 등 전문 도구 필요)</span>
                </li>
              </ul>
            </div>

            {/* FAQ 섹션 */}
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>

            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 투명 배경인지 어떻게 확인하나요?
                </h3>
                <p className="text-brand-mid">
                  Windows에서는 파일 미리보기에서 체크무늬 패턴이 보이면 투명입니다.
                  또는 파일 속성에서 PNG/WebP 형식인지 확인하세요.
                  JPG라면 투명 영역이 없습니다.
                </p>
              </div>

              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 카카오톡에 투명 배경 이미지를 보내면 어떻게 되나요?
                </h3>
                <p className="text-brand-mid">
                  카카오톡에서는 투명 PNG도 정상적으로 전송됩니다.
                  받는 사람도 투명 배경 그대로 볼 수 있습니다.
                </p>
              </div>

              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 투명 배경 이미지를 인쇄할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  인쇄 시 투명 영역은 종이 색(보통 흰색)이 됩니다.
                  스티커 인쇄처럼 실제로 투명하게 인쇄하려면
                  전문 인쇄 업체에 문의하세요.
                </p>
              </div>
            </div>

            {/* 마무리 CTA */}
            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                투명 PNG를 WebP로 변환하기
              </h3>
              <p className="text-brand-light mb-6">
                투명도 유지하면서 용량 절감.
                <br />
                투명 PNG와 로고 이미지는 기기 안에서 WebP로 바뀝니다.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 포맷 변환 도구 사용하기
              </Link>
            </div>
          </div>
          <BlogExtras slug="transparent-background" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
