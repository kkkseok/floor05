import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "사진 자르기 - 비율마다 얼마나 남고 몇 KB가 되나 실측",
  description:
    "카메라 원본 사진을 1:1, 4:3, 16:9, 9:16으로 잘라 남는 픽셀과 용량을 쟀습니다. 9:16은 44%만 남았고, 원형 프로필 PNG는 같은 크기 JPG의 5.7배였습니다.",
  keywords: [
    "사진 자르기",
    "이미지 크롭",
    "사진 크롭 비율",
    "정사각형 사진 자르기",
    "원형 프로필 사진",
    "16:9 자르기",
    "9:16 자르기",
  ],
  alternates: { canonical: "/blog/image-crop-guide" },
  openGraph: {
    title: "사진 자르기 - 비율마다 얼마나 남고 몇 KB가 되나 실측",
    description: "가운데 기준 9:16 크롭은 사진의 43.9%만 남기고 거북이 머리를 잘라냈습니다.",
  },
};

const faqs = [
  {
    question: "사진을 자르면 화질이 떨어지나요?",
    answer:
      "JPG라면 다시 저장하는 만큼만 떨어집니다. 비율 여섯 가지로 잘라 품질 92%로 저장한 결과는 모두 PSNR 40.6~40.8dB로, 자르지 않고 다시 저장한 것(40.57dB)과 같은 수준이었습니다. PNG는 PNG로 저장해 손실이 없습니다.",
  },
  {
    question: "원형으로 자른 프로필 사진 용량이 왜 이렇게 큰가요?",
    answer:
      "원형 크롭은 모서리를 투명하게 남겨야 해서 PNG로 저장하는데, PNG는 사진에 약합니다. 1080×1080 원형 PNG가 2.10MB로, 같은 크기 정사각 JPG(0.37MB)의 5.7배였습니다. 서비스가 원형으로 표시해 준다면 정사각 JPG를 올리는 편이 가볍습니다.",
  },
  {
    question: "증명사진 크기로 자르면 용량은 얼마나 되나요?",
    answer:
      "카메라 원본 사진을 잘라 고정 크기로 저장해 보니 3.5×4.5cm(413×531px)는 66KB, 3×4cm(354×472px)는 54KB, 2×2인치(600×600px)는 121KB였습니다. 같은 크기라도 사진 내용에 따라 용량은 달라집니다.",
  },
  {
    question: "자르는 동안 사진이 다른 곳에 저장되나요?",
    answer:
      "저장되지 않습니다. 영역을 정하는 화면도, 잘라낸 결과를 만드는 캔버스도 이 페이지 안에서만 움직이고, 결과 파일은 다운로드 버튼을 눌러야 비로소 내 기기에 생깁니다.",
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

// 2026-10-15 측정 (원본 5522×4312, JPG 92%, 원자료: docs/blog-data/image-crop-2026-10-15.json)
const ratioRows = [
  { name: "자유 (그대로)", size: "5522×4312", kept: "100%", mb: "6.51MB" },
  { name: "4:3", size: "5522×4142", kept: "96.1%", mb: "6.23MB" },
  { name: "1:1", size: "4312×4312", kept: "78.1%", mb: "5.01MB" },
  { name: "16:9", size: "5522×3106", kept: "72.0%", mb: "4.60MB" },
  { name: "3:4", size: "3234×4312", kept: "58.6%", mb: "3.67MB" },
  { name: "9:16", size: "2426×4312", kept: "43.9%", mb: "2.70MB" },
];

export default function ImageCropGuidePage() {
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
            <span className="text-brand-mid">사진 자르기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 자르기
            </h1>
            <p className="text-lg text-brand-mid">비율마다 얼마나 남고, 몇 KB가 되나</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              비율 버튼 하나 누르면 끝나는 게 사진 자르기지만, 결과를 열어 보면 생각보다 많이
              잘려 나가 있거나, 원형으로 자른 프로필 사진이 업로드 제한에 걸리기도 합니다. 그래서 카메라
              원본 사진 한 장을 여섯 가지 비율과 몇 가지 출력 크기로 잘라 보며 무엇이 남고 얼마나
              커지는지 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              측정하다가 floor05 이미지 크롭이 투명 PNG를 자를 때 배경을 흰색으로 채워 JPG로 저장하던
              문제도 찾아 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>사진: NASA 공공 도메인 거북이 사진, 5522×4312(가로세로 약 1.28:1), 원본 15.78MB</li>
              <li>
                방식: floor05{" "}
                <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                  이미지 크롭
                </Link>
                과 같은 과정. 비율을 고르면 처음 잡히는 최대 영역(가운데 정렬)을 그대로 잘라 JPG 품질
                92%로 저장했고, 원형은 PNG로 저장했습니다(Chromium 151).
              </li>
              <li>화질은 손실 없이 잘라낸 같은 영역과 비교한 PSNR입니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 비율에 따라 사진의 44%만 남기도 한다
            </h2>
            <figure className="my-8">
              <img
                src="/images/blog/image-crop-guide/ratio-overlay.jpg"
                alt="거북이 사진 위에 1:1, 16:9, 9:16 크롭 영역을 겹쳐 그린 그림. 9:16 영역은 거북이 머리를 잘라낸다"
                width={960}
                height={750}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                비율을 고르면 처음 잡히는 영역(가운데 정렬). 흰색 1:1, 주황 16:9, 하늘색 9:16
              </figcaption>
            </figure>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">비율</th>
                    <th className="py-2 pr-4 text-brand-black">결과 크기</th>
                    <th className="py-2 pr-4 text-brand-black">남은 픽셀</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 용량</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {ratioRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.name}</td>
                      <td className="py-2 pr-4">{row.size}</td>
                      <td className="py-2 pr-4">{row.kept}</td>
                      <td className="py-2 pr-4">{row.mb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              가로로 긴 사진을 세로 비율로 자를수록 많이 버립니다. 9:16(스마트폰 세로 화면)은 원래 사진의
              43.9%만 남았고, 그림처럼 가운데 기준 영역이 거북이 머리를 잘라냈습니다. 16:9는 72.0%가
              남았지만 거북이 발이 잘렸습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그러니 비율을 고른 뒤 바로 자르기보다, 영역을 드래그해 주인공이 들어오게 옮기는 단계를
              빼먹지 않는 게 중요합니다. 반대로 세로 비율로 쓸 사진이라면 처음부터 휴대폰을 세워 찍는 편이
              버리는 픽셀이 적습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 자르기 자체는 화질을 깎지 않는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              여섯 비율 모두 PSNR이 40.6~40.8dB였습니다. 자르지 않고 그대로 다시 저장한 경우(40.57dB)와
              같은 수준입니다. 잘라내는 일은 픽셀을 골라 담는 것뿐이고, 화질에 영향을 주는 건 JPG로 다시
              저장하는 과정입니다. 용량은 남은 픽셀 수에 거의 비례해 줄었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              한 가지 주의할 점은 &lsquo;자유&rsquo; 비율에서 영역을 건드리지 않고 저장하면 사진 전체가 다시
              저장된다는 것입니다. 이 사진은 15.78MB가 6.51MB로 바뀌었습니다. 원본을 보관하려는 목적이라면
              자르지 않을 사진은 크롭 도구를 거치지 않는 편이 낫습니다.
            </p>

            <BlogInlineCTA href="/tools/image/crop" label="이미지 크롭 →">
              비율을 고른 뒤 영역을 끌어 주인공을 가운데로 옮기세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 원형 프로필 사진은 JPG의 5.7배
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              원형 크롭은 모서리를 투명하게 남겨야 하므로 투명을 지원하는 PNG로 저장합니다. 같은 1:1 영역을
              1080×1080으로 만들었을 때 원형 PNG는 2.10MB, 정사각 JPG는 0.37MB였습니다. 600×600에서도
              0.65MB 대 0.12MB로 5.4배였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              PNG는 같은 색이 넓게 이어지는 그래픽에는 강하지만, 사진처럼 픽셀마다 색이 다른 이미지에는
              약합니다. 올릴 서비스가 프로필 사진을 알아서 원형으로 표시해 준다면, 정사각 JPG를 올리는 쪽이
              용량 제한에 걸리지 않습니다. 원형 PNG는 투명
              배경 그대로 문서나 슬라이드에 얹어 쓸 때 고르면 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 증명사진 크기로 저장하면 몇 KB?
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 크롭에는 증명사진 크기 버튼이 있습니다. 누르면 비율을 맞추고, 잘라낸 영역을 300dpi
              기준 픽셀로 다시 그립니다. 같은 거북이 사진을 각 크기로 저장한 용량입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">버튼</th>
                    <th className="py-2 pr-4 text-brand-black">출력 크기</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 용량</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">증명사진 3×4</td>
                    <td className="py-2 pr-4">354×472px</td>
                    <td className="py-2 pr-4">54KB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">여권 3.5×4.5</td>
                    <td className="py-2 pr-4">413×531px</td>
                    <td className="py-2 pr-4">66KB</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">미국 비자 2×2</td>
                    <td className="py-2 pr-4">600×600px</td>
                    <td className="py-2 pr-4">121KB</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-4">KB는 1,000바이트 기준. 같은 크기라도 사진 내용에 따라 용량은 달라집니다.</p>
            <p className="text-brand-mid leading-relaxed mb-6">
              얼굴 크기, 배경색처럼 제출처마다 다른 조건은 크롭만으로 해결되지 않습니다. 규격별 조건은{" "}
              <Link href="/blog/passport-photo-size" className="text-brand-accent hover:underline">
                여권 사진 규격
              </Link>
              과{" "}
              <Link href="/blog/id-photo-size-guide" className="text-brand-accent hover:underline">
                증명사진 규격
              </Link>
              에 정리했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 측정하다 고친 것: 투명 PNG가 흰 배경 JPG로 바뀌던 문제
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 이미지 크롭은 원형이 아닐 때 입력과 상관없이 JPG로 저장하고 있었습니다. 배경이 투명한
              로고 PNG를 자르면 투명했던 자리가 흰색으로 채워졌고, 글자가 많은 화면 캡처도 손실 압축됐습니다.
              지금은 원래 형식을 따라 PNG는 PNG로, WebP는 WebP로, JPG는 JPG로 저장합니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">비율은 버튼으로, 위치는 손으로</h3>
              <p className="text-brand-light mb-6">
                비율·원형·증명사진 크기를 고르고, 주인공이 잘리지 않게 영역을 옮긴 뒤 저장하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 크롭
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
          <BlogExtras slug="image-crop-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
