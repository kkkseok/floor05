import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-watermark-guide"),
  title: "사진 워터마크 넣기 - 모서리 vs 전체 반복, 잘라 보고 재본 결과",
};

const faqs = [
  {
    question: "모서리에 넣은 워터마크는 잘라내면 사라지나요?",
    answer:
      "꽤 쉽게 사라집니다. 오른쪽 아래 워터마크를 넣은 사진을 원본의 75% 크기로 441곳에서 잘라 보니 58.7%에서 워터마크가 완전히 빠졌고, 50% 크기로 자르면 88.2%에서 빠졌습니다. 90% 크기로 자를 때만 모두 남았습니다.",
  },
  {
    question: "전체 반복 워터마크는 사진을 얼마나 가리나요?",
    answer:
      "투명도 30%에서 사진 픽셀의 6.9%가 바뀌었고, 원본 대비 PSNR이 30.3dB였습니다. 모서리 워터마크(투명도 30%)는 0.5%만 바꾸고 41.9dB였습니다. 대신 전체 반복은 어떤 크기로 잘라도 워터마크가 남았습니다.",
  },
  {
    question: "워터마크를 넣었더니 파일이 너무 커졌어요.",
    answer:
      "저장 형식 때문입니다. 15.8MB 카메라 JPG를 PNG로 저장하니 47.2MB가 됐고, JPG로 저장하니 6.5MB였습니다. floor05 워터마크는 지금 기본값 '자동'이 JPG 사진을 JPG로 저장합니다.",
  },
  {
    question: "로고와 사진이 다른 곳에 저장되나요?",
    answer:
      "저장되지 않습니다. 사진 위에 글자나 로고를 겹쳐 그리는 일은 이 브라우저의 캔버스가 하고, 여러 장을 묶는 ZIP도 이 탭 안에서 만들어집니다. 내려받기 전까지 결과는 메모리에만 있습니다.",
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

// 2026-10-16 측정 (원자료: docs/blog-data/watermark-crop-2026-10-16.json, watermark-2026-10-16.json)
const cropRows = [
  { keep: "90%", corner: "0%", tile: "0%" },
  { keep: "75%", corner: "58.7%", tile: "0%" },
  { keep: "60%", corner: "83.0%", tile: "0%" },
  { keep: "50%", corner: "88.2%", tile: "0%" },
];

const coverRows = [
  { op: "20%", corner: "45.8dB · 0.5%", tile: "34.1dB · 6.2%" },
  { op: "30%", corner: "41.9dB · 0.5%", tile: "30.3dB · 6.9%" },
  { op: "50%", corner: "37.0dB · 0.6%", tile: "25.5dB · 7.5%" },
  { op: "80%", corner: "32.4dB · 0.6%", tile: "20.9dB · 8.3%" },
];

export default function ImageWatermarkGuidePage() {
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
            <span className="text-brand-mid">사진 워터마크</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              모서리 워터마크 vs 전체 반복
            </h1>
            <p className="text-lg text-brand-mid">441곳을 잘라 보고 얼마나 남는지 셌습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-16">2026-10-16 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              워터마크는 늘 같은 고민 사이에 있습니다. 작게 넣으면 잘려 나가고, 크게 넣으면 사진을 가립니다. 그 사이
              어디쯤에 서야 하는지 감으로 정하는 대신, 같은 사진에 모서리 워터마크와 전체 반복 워터마크를 넣고 잘라 보고,
              얼마나 가리는지 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              재다가 floor05 워터마크의 기본 저장 형식 때문에 카메라 사진이 세 배로 불어나는 문제도 찾아 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>사진: NASA 공공 도메인 거북이 사진을 1920×1499로 줄여 사용</li>
              <li>
                워터마크: floor05{" "}
                <Link href="/tools/image/watermark" className="text-brand-accent hover:underline">
                  워터마크 넣기
                </Link>
                의 그리기 코드를 그대로 써서 글자 &lsquo;© floor05&rsquo;를 넣었습니다. 글자 크기(짧은 변의 6%)와 여백은
                기본값입니다.
              </li>
              <li>
                잘라내기: 원본의 90·75·60·50% 크기 창을 가로세로 5% 간격으로 441곳에 놓고, 창 안에 워터마크 픽셀이 하나도
                없으면 &lsquo;사라짐&rsquo;으로 셌습니다.
              </li>
              <li>가림 정도: 투명도별로 합성한 사진을 원본과 비교한 PSNR과 바뀐 픽셀 비율</li>
            </ul>

            <figure className="my-8">
              <img
                src="/images/blog/image-watermark-guide/corner-vs-tile.jpg"
                alt="왼쪽은 오른쪽 아래 모서리 워터마크에 75% 크기 크롭 영역을 점선으로 표시한 사진, 오른쪽은 전체 반복 워터마크 사진"
                width={1320}
                height={558}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                점선 안만 잘라 쓰면 모서리 워터마크는 남지 않습니다
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 모서리 워터마크는 4분의 3만 잘라도 절반 넘게 사라진다
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">잘라낸 크기</th>
                    <th className="py-2 pr-4 text-brand-black">모서리: 사라진 비율</th>
                    <th className="py-2 pr-4 text-brand-black">전체 반복: 사라진 비율</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {cropRows.map((row) => (
                    <tr key={row.keep} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">원본의 {row.keep}</td>
                      <td className="py-2 pr-4">{row.corner}</td>
                      <td className="py-2 pr-4">{row.tile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              모서리 워터마크는 사진 면적의 0.8%만 차지합니다. 그래서 가장자리를 조금만 덜어내도 쉽게 빠집니다. 원본의 75%
              크기로 자르는 441가지 경우 중 58.7%에서 워터마크가 한 픽셀도 남지 않았습니다. 사진의 주인공만 남기는 흔한
              자르기라면 거의 확실히 사라진다고 보는 게 맞습니다. 반대로 전체 반복은 50%로 잘라도 모든 경우에 남았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 대신 전체 반복은 사진의 7%를 덮는다
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">투명도</th>
                    <th className="py-2 pr-4 text-brand-black">모서리 (PSNR · 바뀐 픽셀)</th>
                    <th className="py-2 pr-4 text-brand-black">전체 반복 (PSNR · 바뀐 픽셀)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {coverRows.map((row) => (
                    <tr key={row.op} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.op}</td>
                      <td className="py-2 pr-4">{row.corner}</td>
                      <td className="py-2 pr-4">{row.tile}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              전체 반복은 투명도 30%에서도 PSNR 30.3dB였습니다. 같은 1920px 사진을 JPG 품질 60%로 저장했을 때(33.5dB,{" "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측
              </Link>
              )보다도 원본에서 멀어지는 셈입니다. 투명도를 20%로 낮추면 34.1dB까지 올라가지만, 그만큼 글자가 옅어집니다. 모서리
              워터마크는 투명도를 80%까지 올려도 바뀐 픽셀이 0.6%에 그쳤습니다. 사진을 감상용으로 보여주는 게 중요하다면
              모서리, 퍼 가는 것을 막는 게 중요하다면 전체 반복입니다.
            </p>

            <BlogInlineCTA href="/tools/image/watermark" label="워터마크 넣기 →">
              위치 9곳과 전체 반복을 고르고, 미리보기로 투명도를 맞춥니다. 여러 장은 ZIP으로 받습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 측정하다 고친 것: 워터마크를 넣으면 세 배로 커지던 파일
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 워터마크는 저장 형식의 기본값이 PNG였습니다. 15.8MB짜리 카메라 JPG에 기본 설정으로 워터마크를
              넣으니 47.2MB PNG가 나왔습니다. 같은 사진을 JPG로 저장하면 6.5MB였습니다. 사진을 PNG로 저장하면 크게
              불어난다는 것은{" "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측
              </Link>
              에서도 확인했는데, 정작 도구 기본값이 그 반대였던 셈입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              지금은 기본값이 &lsquo;자동&rsquo;입니다. JPG 사진은 JPG로, WebP는 WebP로, PNG는 투명 배경을 지키도록 PNG로
              저장합니다. 여러 장을 한꺼번에 넣어도 사진마다 원래 형식을 따릅니다. 원하면 PNG나 JPG로 직접 고를 수
              있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">글자와 로고, 크기는 비율로</h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 워터마크의 글자 크기는 사진 짧은 변의 %로, 로고 크기는 사진 너비의 %로 정합니다. 기본값은 각각
              6%와 20%입니다. 그래서 크기가 제각각인 사진 여러 장에 같은 설정을 적용해도 워터마크가 차지하는 비율이
              같습니다. 로고는 배경이 투명한 PNG를 쓰면 사진 위에 깔끔하게 얹힙니다. 투명 배경이 도구를 거치며 어떻게
              되는지는{" "}
              <Link href="/blog/transparent-background" className="text-brand-accent hover:underline">
                투명 배경 실측
              </Link>
              에 정리했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 선택 기준</h2>
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
                    <td className="py-2 pr-4 font-medium text-brand-black">포트폴리오·작품 감상</td>
                    <td className="py-2 pr-4">모서리, 투명도 50% 안팎</td>
                    <td className="py-2 pr-4">바뀐 픽셀 0.6%, 대신 75% 자르기에 58.7% 사라짐</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">중고거래·상품 사진 퍼가기 방지</td>
                    <td className="py-2 pr-4">전체 반복, 투명도 20~30%</td>
                    <td className="py-2 pr-4">50%로 잘라도 0% 사라짐, PSNR 30~34dB</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">카메라 사진에 넣을 때</td>
                    <td className="py-2 pr-4">저장 형식 &lsquo;자동&rsquo; 또는 JPG</td>
                    <td className="py-2 pr-4">PNG로 저장하면 15.8MB → 47.2MB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              워터마크는 도용을 어렵게 만들 뿐 막지는 못합니다. 원본 해상도를 그대로 올리지 않는 것, 출처를 남기는 것 같은
              다른 방법은{" "}
              <Link href="/blog/prevent-photo-theft" className="text-brand-accent hover:underline">
                사진 도용 막는 법
              </Link>
              에 모았습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">보여줄지, 지킬지 고르기</h3>
              <p className="text-brand-light mb-6">
                모서리 한 곳에 넣거나 사진 전체에 반복해서, 미리보기를 보며 정하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/watermark"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  워터마크 넣기
                </Link>
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 크롭
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="image-watermark-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
