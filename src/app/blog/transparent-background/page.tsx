import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("transparent-background"),
  title: "투명 배경 이미지 - 도구를 거쳐도 투명이 남을까, 10가지 실측",
};

const faqs = [
  {
    question: "투명 PNG를 JPG로 바꾸면 어떻게 되나요?",
    answer:
      "투명한 부분이 모두 단색으로 채워집니다. 측정한 로고는 투명 67.5%·반투명 7.1%였는데 JPG로 바꾸니 100% 불투명이 됐고, 반투명 그림자는 흰 바탕 위의 회색 덩어리가 됐습니다. floor05 포맷 변환은 채울 색을 고를 수 있습니다.",
  },
  {
    question: "투명도를 유지하면서 용량을 줄이려면?",
    answer:
      "WebP로 바꾸거나 PNG 압축을 쓰세요. 23.0KB 투명 로고가 WebP로 9.1KB, floor05 이미지 압축(PNG 유지)으로 6.8KB가 됐고, 두 경우 모두 투명·반투명 픽셀 비율이 원본과 같았습니다.",
  },
  {
    question: "JPG를 PNG로 바꾸면 배경이 투명해지나요?",
    answer:
      "아닙니다. PNG는 투명을 담을 수 있는 형식일 뿐이라, 형식만 바꾸면 원래 배경이 그대로 남습니다. 배경을 지우는 작업은 floor05에 없고, 배경 제거 기능이 있는 편집 프로그램이 필요합니다.",
  },
  {
    question: "투명 로고를 다루는 동안 파일이 업로드되나요?",
    answer:
      "되지 않습니다. 투명도를 읽고 다시 저장하는 일은 로고를 고른 이 브라우저 탭 안의 캔버스가 처리합니다. 결과 파일은 다운로드 버튼을 누를 때 내 기기에만 생깁니다.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// 2026-10-16 측정 (원자료: docs/blog-data/alpha-2026-10-16.json). 원본: PNG 23.0KB, 투명 67.5%·반투명 7.1%
const rows = [
  { tool: "포맷 변환 → WebP", fmt: "WebP", alpha: "유지", kb: "9.1KB" },
  { tool: "이미지 압축 (품질)", fmt: "PNG", alpha: "유지", kb: "6.8KB" },
  { tool: "이미지 압축 (목표 20KB)", fmt: "PNG", alpha: "유지", kb: "12.1KB" },
  { tool: "리사이즈 (절반)", fmt: "PNG", alpha: "유지", kb: "10.3KB" },
  { tool: "크롭", fmt: "PNG", alpha: "유지", kb: "23.0KB" },
  { tool: "회전 90°", fmt: "PNG", alpha: "유지", kb: "22.7KB" },
  { tool: "합치기 (2장 세로)", fmt: "PNG", alpha: "유지", kb: "45.8KB" },
  { tool: "모자이크", fmt: "PNG", alpha: "유지", kb: "23.0KB" },
  { tool: "워터마크", fmt: "PNG", alpha: "유지", kb: "27.2KB" },
  { tool: "포맷 변환 → JPG", fmt: "JPG", alpha: "사라짐 (흰색으로 채움)", kb: "14.2KB" },
];

const fixedRows = [
  { tool: "리사이즈", before: "입력과 무관하게 JPG(흰 배경)", after: "PNG→PNG, WebP→WebP" },
  { tool: "크롭", before: "원형이 아니면 JPG(흰 배경)", after: "입력 형식 유지" },
  { tool: "회전", before: "PNG가 아니면 JPG — 투명 WebP가 검은 배경", after: "입력 형식 유지" },
  { tool: "모자이크·9분할", before: "PNG가 아니면 JPG — 투명 WebP가 검은 배경", after: "입력 형식 유지" },
  { tool: "압축 (목표 용량)", before: "무조건 JPG — 20KB 목표에 14.8KB JPG", after: "PNG로 먼저 맞추고, 안 되면 JPG + 안내" },
];

export default function TransparentBackgroundPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8 text-sm text-brand-light">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">투명 배경 이미지</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              도구를 거쳐도 투명 배경이 남을까
            </h1>
            <p className="text-lg text-brand-mid">투명 로고 하나를 10가지 작업에 넣어 봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-16">2026-10-16 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              배경을 지운 로고를 줄이고, 자르고, 압축하다 보면 어느새 흰 바탕이나 검은 바탕이 붙어 나올 때가 있습니다.
              어느 단계에서 투명이 사라지는지 알아보려고, 반투명 그림자가 있는 투명 로고를 floor05 도구 10가지에
              실제로 넣고 결과 파일의 픽셀을 셌습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              솔직하게 먼저 적습니다. 이 글의 예전 버전은 &lsquo;리사이즈·크롭도 투명도를 유지한다&rsquo;고 했지만,
              재보니 사실이 아니었습니다. 이번 측정에서 투명을 지우던 도구 다섯 군데를 찾아 고쳤고, 아래 결과는 고친
              뒤의 값입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>
                로고: 측정용으로 직접 그린 600×400 PNG(23.0KB). 완전 투명 67.5%, 반투명 7.1%(그림자와 원의 가장자리),
                불투명 25.4%로 이루어져 있습니다.
              </li>
              <li>
                방식: floor05 도구 화면을 실제로 조작해(Chromium 151) 결과를 내려받고, 형식과 알파 채널, 투명·반투명
                픽셀 비율을 Pillow로 셌습니다.
              </li>
              <li>AVIF 변환은 이 브라우저가 AVIF 저장을 지원하지 않아 빠졌습니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">작업</th>
                    <th className="py-2 pr-4 text-brand-black">결과 형식</th>
                    <th className="py-2 pr-4 text-brand-black">투명도</th>
                    <th className="py-2 pr-4 text-brand-black">용량</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {rows.map((row) => (
                    <tr key={row.tool} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.tool}</td>
                      <td className="py-2 pr-4">{row.fmt}</td>
                      <td className="py-2 pr-4">{row.alpha}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.kb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              &lsquo;유지&rsquo;는 결과에 알파 채널이 있고 투명·반투명 픽셀 비율이 원본과 같은 경우입니다. 리사이즈는 크기가
              바뀌어 투명 비율이 0.3%p, 반투명 비율이 0.5%p 안쪽으로 달라졌고, 워터마크는 글자를 얹은 만큼 달라졌습니다. KB는 1,000바이트 기준.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 형식만 맞으면 투명도는 픽셀 그대로 남는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              크롭·회전·합치기·모자이크는 결과의 투명 67.52%, 반투명 7.10%가 원본과 소수점 둘째 자리까지 같았습니다.
              투명을 담을 수 있는 형식(PNG·WebP)으로 저장하기만 하면, 픽셀을 옮기거나 자르는 작업은 투명도를 건드리지
              않습니다. 문제는 늘 저장 형식에서 생겼습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. JPG는 투명을 버린다, 반투명은 회색이 된다
            </h2>
            <figure className="my-8">
              <img
                src="/images/blog/transparent-background/format-compare.png"
                alt="체크무늬 위에 놓은 원본 PNG, JPG 변환, WebP 변환 결과. JPG만 배경이 흰색으로 채워지고 그림자가 회색 덩어리가 됐다"
                width={956}
                height={256}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                체크무늬가 보이는 곳이 투명한 부분입니다
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              JPG로 바꾸니 픽셀 100%가 불투명이 됐습니다. 완전히 투명했던 곳은 흰색이 되고, 50% 투명했던 그림자는 흰
              바탕과 섞인 회색 덩어리로 굳었습니다. 이렇게 굳은 그림자는 어두운 배경에 올리면 회색 판처럼 보입니다.
              JPG가 꼭 필요하다면 floor05 포맷 변환에서 채울 색을 올릴 배경색과 같게 고르세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 투명을 지키면서 가장 가벼운 건 PNG 압축과 WebP
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              23.0KB 로고가 WebP로 9.1KB(60% 감소), floor05 이미지 압축의 PNG 유지로 6.8KB(71% 감소)가 됐습니다. 둘 다
              투명·반투명 비율이 그대로였습니다. 이 로고처럼 색 수가 적은 그래픽에서는 색 수를 줄이는 PNG 압축이 WebP보다도
              작았습니다. 사진처럼 색이 많은 투명 이미지는 이번에 재지 않았으니 두 가지를 모두 시도해 작은 쪽을 고르세요.
            </p>

            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              PNG는 투명 배경을 유지한 채 압축합니다. 목표 용량을 넣어도 먼저 PNG로 맞춰 봅니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 측정하다 고친 것: 투명을 지우던 다섯 곳
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">도구</th>
                    <th className="py-2 pr-4 text-brand-black">고치기 전</th>
                    <th className="py-2 pr-4 text-brand-black">지금</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {fixedRows.map((row) => (
                    <tr key={row.tool} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.tool}</td>
                      <td className="py-2 pr-4">{row.before}</td>
                      <td className="py-2 pr-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              원인은 모두 같았습니다. &lsquo;PNG가 아니면 JPG&rsquo;처럼 저장 형식을 대충 정하고 있었고, 투명을 담을 수 있는
              WebP도 JPG로 바뀌었습니다. JPG로 저장할 때 바탕을 칠하지 않은 도구에서는 투명한 곳이 검은색이 됐습니다.
              지금은 모든 도구가 같은 규칙(PNG는 PNG, WebP는 WebP, 그 외는 JPG)을 따르고, 테스트로 이 규칙을 매번 확인합니다.
              목표 용량 압축은 투명 PNG를 끝내 목표까지 줄일 수 없을 때만 JPG로 바꾸고, 그때는 화면에 그렇다고 알립니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">투명 배경의 기본</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              투명도는 픽셀마다 붙는 알파 값으로 저장됩니다. 0이면 완전 투명, 255면 완전 불투명이고, 그 사이가 그림자나
              부드러운 가장자리 같은 반투명입니다. PNG와 WebP는 이 값을 픽셀마다 담고, GIF는 &lsquo;완전 투명인 색 하나&rsquo;만
              지정할 수 있어 반투명 그림자를 표현하지 못합니다. JPG는 알파 값을 담지 못합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              PDF로 묶을 때는 floor05 이미지 PDF 변환이 투명한 곳을 흰색으로 채워 넣습니다. 인쇄물에서는 종이 색이 되므로
              대부분 문제가 없지만, 투명 로고를 그대로 보관할 용도라면 PDF가 아닌 PNG로 남겨 두세요. 사이트 아이콘으로 쓸
              때는{" "}
              <Link href="/blog/favicon-browser-requests" className="text-brand-accent hover:underline">
                파비콘 실측
              </Link>
              도 참고하세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className={i < faqs.length - 1 ? "border-b border-brand-light/20 pb-6" : "pb-6"}
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-2">Q. {faq.question}</h3>
                  <p className="text-brand-mid leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">투명 배경 그대로 가볍게</h3>
              <p className="text-brand-light mb-6">
                PNG 압축이나 WebP 변환으로 투명도는 남기고 용량만 줄입니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 압축
                </Link>
                <Link
                  href="/tools/image/convert"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  포맷 변환
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="transparent-background" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
