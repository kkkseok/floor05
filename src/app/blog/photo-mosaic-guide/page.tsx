import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("photo-mosaic-guide"),
  title: "사진 모자이크 강도 - 글자 높이의 몇 배부터 뭉개지나 실측",
};

const faqs = [
  {
    question: "모자이크 강도는 얼마로 해야 글자가 가려지나요?",
    answer:
      "글자 높이를 기준으로 정하세요. 한 자리만 다른 숫자열 10장을 가려 보니, 강도가 숫자 높이의 4분의 1이면 10장이 전부 서로 달랐고 모자이크 강도가 1.25배 이상(16px 숫자에 강도 20, 24px에 30, 32px에 40)이면 평균 1.6~2.4가지로 줄었습니다. 사람이 읽을 수 있는지를 잰 값은 아니며, 최대 강도에서도 한 가지로 완전히 합쳐지지는 않았습니다.",
  },
  {
    question: "모자이크와 블러 중 어느 쪽이 덜 남기나요?",
    answer:
      "이번 측정에서는 모자이크였습니다. 숫자 높이 4종과 강도 7종을 조합한 28가지 모두에서 블러 쪽 가짓수가 모자이크와 같거나 더 많았습니다. 16px 숫자에 강도 20을 걸면 모자이크는 평균 2.4가지, 블러는 4.7가지로 갈렸습니다.",
  },
  {
    question: "큰 사진에서는 왜 같은 강도가 약해 보이나요?",
    answer:
      "글자가 크게 찍힌 만큼 글자 하나에 칸이 여러 줄 걸치기 때문입니다. 숫자 높이가 가로의 2%인 그림에 강도 12를 걸었더니 가로 800px에서는 숫자 하나에 칸이 1.3줄, 2000px 이상에서는 3.5줄 걸쳤습니다. 사진이 바뀌면 강도를 다시 정해야 합니다.",
  },
  {
    question: "가리기 전 사진이 전송되는 단계가 있나요?",
    answer:
      "없습니다. floor05 사진 모자이크는 고른 사진을 그 탭의 캔버스에 그린 다음 드래그한 사각형만 줄였다 되돌려 덮고, 저장할 때 그 캔버스를 파일로 바꿔 기기에 내려 줍니다. 이번에 도구에서 내려받아 대조한 PNG 8개도 이 순서로 만들어졌고, 스크립트가 같은 순서로 계산한 결과와 다른 픽셀이 0개였습니다.",
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

// 2026-11-22 측정 (Chromium 151, 원자료: docs/blog-data/mosaic-2026-11-22.json)
// variants[].cases[].distinctAvg — 한 자리만 다른 10장 중 서로 다른 결과 수, "모자이크 / 블러"
const variantRows = [
  { s: "4", h16: "10 / 10", h24: "10 / 10", h32: "10 / 10", h48: "10 / 10" },
  { s: "8", h16: "8.8 / 9.7", h24: "9.9 / 10", h32: "10 / 10", h48: "10 / 10" },
  { s: "12", h16: "5.8 / 9.1", h24: "7.7 / 9.6", h32: "8.9 / 9.7", h48: "10 / 10" },
  { s: "16", h16: "4.6 / 6.7", h24: "6.9 / 8.6", h32: "7.8 / 8.4", h48: "9.8 / 10" },
  { s: "20", h16: "2.4 / 4.7", h24: "4.4 / 5.7", h32: "5.3 / 6.4", h48: "7.8 / 8.3" },
  { s: "30", h16: "1.7 / 2.0", h24: "1.9 / 3.1", h32: "3.0 / 4.3", h48: "5.0 / 6.4" },
  { s: "40", h16: "1.6 / 1.8", h24: "1.7 / 1.8", h32: "1.9 / 2.8", h48: "2.9 / 3.9" },
];

// sizes[].cases[] (mosaic) — savedCellW × savedCellH, cellsPerDigitH
const sizeRows = [
  { w: "800px", digit: "16px", cell: "11.8 × 12.3px", c12: "1.3줄", c40: "0.43줄" },
  { w: "1200px", digit: "24px", cell: "11.8 × 11.2px", c12: "2.1줄", c40: "0.43줄" },
  { w: "2000px", digit: "40px", cell: "12.1 × 11.4px", c12: "3.5줄", c40: "0.88줄" },
  { w: "3000px", digit: "60px", cell: "17.9 × 17.1px", c12: "3.5줄", c40: "0.88줄" },
  { w: "4000px", digit: "80px", cell: "24.1 × 23.0px", c12: "3.5줄", c40: "0.87줄" },
];

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
            <span className="text-brand-mid">사진 모자이크 강도 정하기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 모자이크 강도 정하기
            </h1>
            <p className="text-lg text-brand-mid">
              글자 높이와 강도를 바꿔 가며, 가린 뒤에 남는 것을 잰 결과
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-22">2026-11-22 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              모자이크 강도를 12로 둘지 40까지 올릴지는 보통 눈대중으로 정합니다. 그런데 같은 강도
              12가 어떤 사진에서는 글자를 지우고, 어떤 사진에서는 글자 모양을 그대로 남깁니다. 기준이
              될 숫자를 찾으려고, 스크립트로 그린 숫자열에 floor05 사진 모자이크를 강도별로 걸어 가린
              뒤에 무엇이 남는지 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              결과부터 적습니다. 강도가 숫자 높이의 4분의 1 이하일 때는 한 자리만 다른 숫자열 10장이
              가린 뒤에도 전부 서로 달랐습니다. 모자이크 강도가 숫자 높이의 1.25배 이상이 되자 평균
              2.5가지 아래로 줄었습니다. 최대 강도 40에서도 어느 위치에서나 한 가지로 합쳐진 조합은 없었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">시험 그림</strong>: 흰 바탕에 맑은 고딕 굵은 글씨로
                그린 &ldquo;0123456789 가나다라마&rdquo;. 숫자 높이는 12px부터 64px까지 여섯 가지입니다.
                실제 송장이나 번호판, 사람 사진은 쓰지 않았습니다.
              </li>
              <li>
                <strong className="text-brand-black">가리는 방법</strong>: Chromium 151에서{" "}
                <Link href="/tools/image/mosaic" className="text-brand-accent hover:underline">
                  사진 모자이크
                </Link>
                와 같은 순서로 캔버스에 그렸습니다. 같은 그림을 실제 도구에 올려 내려받은 PNG 8개(가로
                1600px·4000px, 두 방식, 강도 12·40)와 픽셀 단위로 비교해 다른 픽셀이 0개인 것을
                확인했습니다.
              </li>
              <li>
                <strong className="text-brand-black">한 자리 바꾸기</strong>: 0123456789의 다섯째 자리만
                0부터 9까지 바꾼 그림 10장을 같은 영역, 같은 강도로 가렸습니다. 결과 픽셀이 완전히 같은
                것끼리 묶어 몇 가지가 나오는지 셌고, 영역을 잡는 위치를 조금씩 옮긴 9번의 평균을
                냈습니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-8">
              10가지면 가린 뒤에도 숫자마다 다른 흔적이 남았다는 뜻입니다. 1가지면 그 자리에 무슨
              숫자가 있었는지 결과만으로는 가려낼 수 없습니다. 사람이 읽을 수 있는지를 잰 값은
              아닙니다. 눈으로 보는 판단은 아래 확대 그림에 맡깁니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: 가린 뒤에도 구별되는 가짓수
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">강도</th>
                    <th className="py-2 pr-4 text-brand-black">숫자 16px</th>
                    <th className="py-2 pr-4 text-brand-black">24px</th>
                    <th className="py-2 pr-4 text-brand-black">32px</th>
                    <th className="py-2 pr-4 text-brand-black">48px</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {variantRows.map((row) => (
                    <tr key={row.s} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.s}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.h16}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.h24}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.h32}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.h48}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              칸마다 모자이크 / 블러 순서. 10장 중 서로 다른 결과의 수이고, 위치 9곳의 평균입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 강도가 숫자 높이의 4분의 1이면 하나도 줄지 않는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              16px 숫자에 강도 4, 32px에 강도 8, 48px에 강도 12. 세 경우 모두 위치 9곳 전부에서 10장이
              서로 달랐습니다. 숫자 하나에 칸이 세로로 네 줄 걸치는 구간입니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/photo-mosaic-guide/ladder-mosaic.png"
                alt="숫자 높이 24px인 글자 한 줄에 모자이크 강도 4, 8, 12, 20, 40을 걸어 2배 확대한 비교. 강도 4는 글자 모양이 남고 강도 40은 큰 칸 몇 개만 남는다"
                width={780}
                height={982}
                loading="lazy"
                className="block w-full border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                숫자 높이 24px 한 줄을 2배 확대. 위부터 가리기 전, 모자이크 강도 4·8·12·20·40
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              그림의 강도 8 줄은 눈으로 읽기 어렵습니다. 그런데 같은 조건(숫자 24px, 강도 8)에서 10장은
              평균 9.9가지로 갈렸고, 가장 적게 갈린 위치에서도 9가지였습니다. 읽기 어려워 보이는 것과
              흔적이 남지 않은 것은 따로 확인해야 합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 강도가 숫자 높이를 넘어야 줄어든다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              가짓수가 눈에 띄게 줄어든 것은 강도가 숫자 높이와 비슷해진 뒤입니다. 16px 숫자에 강도
              16이면 평균 4.6가지, 강도 20(1.25배)이면 2.4가지였습니다. 24px에 강도 30, 32px에 강도
              40도 1.25배인데 둘 다 1.9가지였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              강도는 40이 끝이라, 편집 화면에서 숫자가 32px보다 크면 이 비율을 맞출 수 없습니다. 48px
              숫자는 강도 40에서도 평균 2.9가지였고, 10장이 전부 같은 결과가 된 위치는 9곳 중
              3곳이었습니다. 가장 유리한 조합인 16px 숫자에 강도 40에서도 9곳 중 1곳에서는 최대
              6가지로 갈렸습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 칸 하나의 색은 가운데 한 픽셀이 정한다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              끝까지 한 가지로 합쳐지지 않는 이유는 칸이 만들어지는 방식에 있었습니다. 흰 영역에서
              픽셀을 하나씩 검게 바꿔 가며 결과가 달라지는지 봤더니, 강도 40 모자이크는 칸 하나를
              이루는 1,600픽셀 가운데 한가운데 1픽셀만 결과에 반영됐습니다. 블러는 가운데 4픽셀이
              4분의 1씩 섞였습니다. 강도 4와 12에서도 같았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              그래서 칸의 색은 그 한 점이 획 위에 있는지 바탕 위에 있는지에 달려 있습니다. 위 그림의
              강도 20 줄이 거의 비어 보이는 것도, 표본이 바뀐 숫자의 획에 닿은 위치에서 결과가 갈리는
              것도 같은 이유입니다. 24px 숫자 줄은 강도 30에서 영역 전체가 한 가지 색이 됐다가, 강도
              40에서는 다시 세 가지 색이 됐습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              원본과의 차이를 재는 PSNR도 강도 순서를 따르지 않았습니다. 같은 줄에서 강도 12가 7.7dB,
              30이 8.8dB, 40이 4.5dB였습니다. 모자이크가 얼마나 가렸는지를 PSNR로 판단하기는
              어렵습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 블러는 같은 강도에서 더 많이 남았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 방식은 영역을 같은 칸 수로 줄였다가 되돌립니다. 그런데 표의 28개 조합 모두에서 블러의
              가짓수가 모자이크와 같거나 더 많았습니다. 16px 숫자에 강도 20이면 모자이크 2.4가지, 블러
              4.7가지입니다. 블러는 칸마다 4픽셀을 읽고, 되돌릴 때 칸 사이를 이어 붙이며 중간색을
              만듭니다. 24px 줄에 강도 12를 걸면 영역 안의 색이 모자이크는 15가지, 블러는
              239가지였습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/photo-mosaic-guide/ladder-blur.png"
                alt="숫자 높이 24px인 글자 한 줄에 블러 강도 4, 8, 12, 20, 40을 걸어 2배 확대한 비교. 같은 강도의 모자이크보다 중간색이 많이 남는다"
                width={780}
                height={982}
                loading="lazy"
                className="block w-full border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                같은 줄에 블러를 건 것. 위부터 가리기 전, 블러 강도 4·8·12·20·40
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              가짓수가 많다고 블러 쪽이 눈에 더 잘 읽힌다는 뜻은 아닙니다. 가린 결과에 원래 그림의
              흔적이 더 많이 실린다는 뜻입니다. 이번 측정만 놓고 보면 글자와 숫자를 가릴 때 블러를 고를
              이유는 없었습니다.
            </p>

            <BlogInlineCTA href="/tools/image/mosaic" label="사진 모자이크 →">
              강도를 올려 가며 칸이 글자보다 커지는 지점을 직접 확인해 보세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 같은 강도 12도 사진 크기에 따라 다르게 걸린다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 그림을 가로 800px부터 4000px까지 다섯 크기로 그려 같은 강도를 걸었습니다. 숫자
              높이는 어느 크기에서나 가로의 2%입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">사진 가로</th>
                    <th className="py-2 pr-4 text-brand-black">숫자 높이</th>
                    <th className="py-2 pr-4 text-brand-black">강도 12의 칸</th>
                    <th className="py-2 pr-4 text-brand-black">걸친 칸 (강도 12)</th>
                    <th className="py-2 pr-4 text-brand-black">걸친 칸 (강도 40)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {sizeRows.map((row) => (
                    <tr key={row.w} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.w}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.digit}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.cell}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.c12}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.c40}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              오른쪽 두 열은 숫자 하나에 칸이 세로로 몇 줄 걸치는지(숫자 높이 ÷ 저장본의 칸 세로
              길이)입니다. 칸 크기가 강도와 딱 맞지 않는 것은 영역을 정수 칸으로 나누기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              가로 2000px까지는 칸이 12px 안팎으로 고정이라, 사진이 작을수록 같은 강도가 세게
              걸립니다. 800px 그림에서는 숫자 하나에 칸이 1.3줄, 2000px에서는 3.5줄입니다. 2000px를
              넘으면 칸도 사진을 따라 커져(4000px에서 24.1px) 3.5줄이 그대로 유지됩니다. 화면
              캡처에서 충분했던 강도를 카메라 사진에 그대로 쓰면 약하게 걸립니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/photo-mosaic-guide/size-compare.png"
                alt="같은 글자 줄에 모자이크 강도 12를 건 결과를 가로 800px, 2000px, 4000px 사진에서 잘라 같은 폭으로 맞춘 비교. 800px 쪽 칸이 훨씬 크다"
                width={760}
                height={475}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                같은 글자 줄, 같은 강도 12. 저장본에서 가린 영역을 잘라 같은 폭으로 맞췄습니다
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              큰 사진에서 하나 더 확인한 것이 있습니다. 편집 화면은 긴 변 2000px로 줄인 그림이고
              저장본은 원본 해상도에 다시 그린 것이라, 칸이 읽는 한 점이 서로 다릅니다. 가로 3000px
              그림에 강도 12를 걸었을 때 424칸 중 18칸, 4000px에서는 9칸의 색이 화면과 저장본에서
              달랐습니다. 큰 사진은 내려받은 파일을 열어 한 번 더 보는 편이 좋습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 기준</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">상황</th>
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">글자·숫자 가리기</td>
                    <td className="py-2 pr-4">강도를 글자 높이의 1.25배 이상으로</td>
                    <td className="py-2 pr-4">
                      0.8~1배에서는 평균 2.9~4.6가지, 1.25배 이상에서는 1.6~2.4가지
                    </td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">글자가 32px보다 클 때</td>
                    <td className="py-2 pr-4">사진을 먼저 줄인 뒤 가리기</td>
                    <td className="py-2 pr-4">48px 숫자는 강도 40에서도 2.9가지</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">모자이크와 블러</td>
                    <td className="py-2 pr-4">글자에는 모자이크</td>
                    <td className="py-2 pr-4">28개 조합 모두 블러가 같거나 더 많이 남음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">사진이 바뀔 때</td>
                    <td className="py-2 pr-4">강도를 다시 정하기</td>
                    <td className="py-2 pr-4">강도 12가 800px에서 1.3줄, 2000px 이상에서 3.5줄</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">2000px 넘는 사진</td>
                    <td className="py-2 pr-4">저장본을 열어 확인</td>
                    <td className="py-2 pr-4">424칸 중 9~18칸이 화면과 다른 색</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이번에 재지 않은 것</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              사람이 실제로 읽어 내는지는 재지 않았습니다. 얼굴, 카메라로 찍은 사진 속 글자(기울기와
              조명, JPG 압축이 섞인 것), JPG로 저장한 뒤의 변화, 다른 글꼴과 브라우저도 범위
              밖입니다. 가린 그림에서 원래 내용을 추정하는 소프트웨어나 AI도 시험하지 않았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              그래서 &ldquo;이 강도면 안전하다&rdquo;는 숫자는 드리지 못합니다. 이번 결과로 말할 수
              있는 것은 약한 강도에서 흔적이 얼마나 남는지까지입니다. 보여 줄 필요가 없는 정보라면{" "}
              <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                이미지 크롭
              </Link>
              으로 그 부분을 잘라내는 방법도 있습니다. 잘라낸 부분은 파일에 픽셀이 남지 않습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">내 사진에서 확인하기</h3>
              <p className="text-brand-light mb-6">
                강도를 올리며 칸이 글자보다 커지는지 보세요.
                <br />
                글자가 크게 찍힌 사진은 줄인 뒤 가리면 같은 강도가 더 세게 걸립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/mosaic"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  사진 모자이크
                </Link>
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 리사이즈
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="photo-mosaic-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
