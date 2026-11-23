import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("heic-to-jpg-guide"),
  title: "HEIC JPG 변환 - 밝기 문제를 고치고 다시 잰 용량·시간",
};

const faqs = [
  {
    question: "HEIC를 JPG로 바꾸면 용량이 늘어나나요?",
    answer:
      "HEIC가 얼마나 강하게 압축돼 있었는지에 따라 달랐습니다. 직접 인코딩한 1,200만 화소 HEIC 여섯 개를 품질 90% JPG로 바꾸니 결과는 HEIC의 0.12배에서 2.37배 사이였습니다. 품질 50으로 만든 HEIC는 JPG가 1.65~2.37배로 커졌고, 품질 70·90으로 만든 HEIC는 JPG가 0.12~0.63배로 작았습니다.",
  },
  {
    question: "JPG 품질을 100%로 올리면 원본 HEIC와 같아지나요?",
    answer:
      "거의 같아지지만 파일이 커집니다. 품질 100%에서 JPG로 다시 저장하며 생긴 차이는 55.9~61.7dB로 눈으로 구분하기 어려운 수준이었는데, 파일은 2.06~11.08MB로 HEIC의 1.32~11.15배가 됐습니다. 기본값 90%에서는 39.1~50.8dB였습니다. 무손실 PNG로 받으면 HEIC의 2.6~23.4배였습니다.",
  },
  {
    question: "HEIC 한 장을 변환하는 데 얼마나 걸리나요?",
    answer:
      "측정한 PC 기준으로 1,200만 화소 한 장에 Chromium 2.6~4.2초, Firefox 4.9~7.8초, WebKit 3.5~5.4초였습니다(가장 작은 파일 하나는 제외한 범위). 실제 도구 화면에서 10장을 한꺼번에 올리면 Chromium 32.1~32.8초, WebKit 39.4~44.5초, Firefox 55.4~57.6초가 걸렸습니다.",
  },
  {
    question: "변환한 JPG에 촬영 정보가 남나요? 사진은 어디로 가나요?",
    answer:
      "측정용 HEIC에 넣은 EXIF(17,642바이트, 39,658바이트)는 세 브라우저의 어느 결과에도 남지 않았습니다. HEIC를 푸는 libheif-js도 변환을 시작할 때 브라우저가 받아 와 그 안에서 실행하는 코드라, 사진 파일 자체는 업로드 단계가 없습니다. 이번에 두 파일을 세 브라우저의 실제 도구 화면에서 내려받아 측정 결과와 sha256을 맞대 보니 여섯 번 모두 같았습니다.",
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

// 2026-11-23 재측정 (libheif-js 1.23.5, Chromium 151 · Firefox 153 · WebKit 26.5)
// 원자료: 용량·화질 docs/blog-data/heic-2026-11-23-libheif.json, 시간·메모리 docs/blog-data/heic-2026-11-23-libheif2.json
// (libheif2 에서 픽셀·JPG 바이트가 libheif 측정과 같음을 확인: derived.allSameAsPrevious. 고치기 전 값은 heic-2026-11-23.json)
// derived.sizes / derived.quality
const sizeRows = [
  { file: "거북이 · 품질 50", heic: "1.71MB", jpg: "2.82MB", ratio: "1.65배", png: "18.47MB", loss: "41.2dB" },
  { file: "거북이 · 품질 70", heic: "4.74MB", jpg: "3.00MB", ratio: "0.63배", png: "20.09MB", loss: "39.4dB" },
  { file: "거북이 · 품질 90", heic: "8.39MB", jpg: "3.00MB", ratio: "0.36배", png: "21.72MB", loss: "39.1dB" },
  { file: "꽃 · 품질 50", heic: "185KB", jpg: "438KB", ratio: "2.37배", png: "4.31MB", loss: "50.8dB" },
  { file: "꽃 · 품질 70", heic: "2.72MB", jpg: "636KB", ratio: "0.23배", png: "14.39MB", loss: "45.8dB" },
  { file: "꽃 · 품질 90", heic: "5.14MB", jpg: "628KB", ratio: "0.12배", png: "14.90MB", loss: "45.5dB" },
];

// heic-2026-11-23-libheif.json derived.beforeAfter (before = heic2any 0.0.4) + 시간은 libheif2.json derived.timeMsPerFile / ui
const fixRows = [
  { item: "거북이 품질 70 · 기준 대비 화질", ref: "-", before: "28.5dB", after: "43.8dB" },
  { item: "거북이 · 그늘 영역 평균 밝기", ref: "58.0", before: "50.5", after: "58.0" },
  { item: "거북이 · 완전한 검정 픽셀", ref: "0.013%", before: "1.933%", after: "0.008%" },
  { item: "꽃 품질 70 · 기준 대비 화질", ref: "-", before: "29.8dB", after: "48.0dB" },
  { item: "꽃 · 완전한 흰색 픽셀", ref: "1.414%", before: "5.014%", after: "1.418%" },
  { item: "꽃 · 사진 전체 평균 밝기", ref: "166.6", before: "174.3", after: "166.6" },
  { item: "제한 범위 대조군 · 기준 대비 화질", ref: "-", before: "42.8dB", after: "43.2dB" },
  { item: "한 장 변환 · Chromium", ref: "-", before: "8.7~15.5초", after: "2.6~4.2초" },
  { item: "한 장 변환 · Firefox", ref: "-", before: "2.9~4.5초", after: "4.9~7.8초" },
  { item: "한 장 변환 · WebKit", ref: "-", before: "13.1~21.0초", after: "3.5~5.4초" },
  { item: "도구 화면 10장 · Chromium", ref: "-", before: "105.9~108.8초", after: "32.1~32.8초" },
];

// libheif2.json derived.timeMsPerFile (withoutFlowerQ50 / perFile.flower-q50)
const timeRows = [
  { browser: "Chromium 151", range: "2.6~4.2초", median: "3.2초", small: "0.3초" },
  { browser: "Firefox 153", range: "4.9~7.8초", median: "6.1초", small: "1.5초" },
  { browser: "WebKit 26.5", range: "3.5~5.4초", median: "4.7초", small: "0.4초" },
];

// libheif2.json derived.ui.<브라우저>.batchMs (각 3회)
const batchRows = [
  { n: "1장", chromium: "3.9~4.0초 (4.0초)", webkit: "6.0~6.4초 (6.3초)", firefox: "6.4초 (6.4초)" },
  { n: "5장", chromium: "16.4~17.4초 (3.3초)", webkit: "23.7~25.9초 (4.9초)", firefox: "30.2~33.3초 (6.7초)" },
  { n: "10장", chromium: "32.1~32.8초 (3.2초)", webkit: "39.4~44.5초 (4.4초)", firefox: "55.4~57.6초 (5.7초)" },
];

const figures = [
  { src: "levels-ref.jpg", label: "기준 이미지", alt: "HEIC로 만들기 전 기준 이미지의 거북이 등껍질 아래 그늘 부분" },
  { src: "levels-before.jpg", label: "고치기 전 (heic2any)", alt: "고치기 전 도구로 변환한 JPG의 같은 부분. 그늘이 검게 뭉쳐 있다" },
  { src: "levels-after.jpg", label: "고친 뒤 (libheif-js)", alt: "고친 뒤 도구로 변환한 JPG의 같은 부분. 기준 이미지와 밝기가 같다" },
];

export default function HeicToJpgGuidePage() {
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
            <span className="text-brand-mid">HEIC JPG 변환</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              HEIC를 JPG로 바꾸면 달라지는 것
            </h1>
            <p className="text-lg text-brand-mid">용량과 걸리는 시간, 그리고 재다가 고친 밝기 문제</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-23">2026-11-23 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              HEIC 파일 여덟 개를 직접 만들어 floor05 HEIC→JPG 변환과 같은 코드로 바꿔 봤습니다. 품질
              90%로 저장한 JPG는 HEIC의 0.12배에서 2.37배 사이였고, 1MB가 넘는 1,200만 화소 HEIC 한 장을
              바꾸는 데 브라우저에 따라 2.6초에서 7.8초가 걸렸습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              처음 쟀을 때는 변환된 JPG의 그늘이 원본보다 검게 뭉쳐 있었습니다. HEIC를 푸는 라이브러리 탓이라
              도구의 디코더를 바꾸고 전부 다시 쟀습니다. 고치기 전과 뒤는 2절 표에 나란히 적었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">측정 파일은 아이폰이 찍은 HEIC가 아닙니다.</strong>{" "}
                NASA 공공 도메인 사진 두 장(거북이 KSC-20210121-PH-JBS01_0079, 꽃
                KSC-20230613-PH-FMX01-0075)을 가운데 4:3으로 잘라 4032×3024(약 1,200만 화소)로 줄인 뒤,
                x265 4.3(libheif 1.23.6)으로 직접 인코딩했습니다. 품질 50·70·90, 4:2:0, 8비트입니다.
              </li>
              <li>
                <strong className="text-brand-black">기준 이미지</strong>는 HEIC로 만들기 전의 무손실
                PNG입니다. 화질 지표 PSNR(dB)은 따로 밝히지 않으면 이 이미지와 비교한 값입니다.
              </li>
              <li>
                <strong className="text-brand-black">변환 경로</strong>는 도구의 변환 함수를 그대로 묶어
                실행했습니다. libheif-js 1.23.5(libheif의 WebAssembly판)가 HEIC를 캔버스에 풀고, Canvas가
                JPG로 저장합니다. 기본 품질은 90%입니다.
              </li>
              <li>
                <strong className="text-brand-black">대조</strong>: 두 파일을 세 브라우저의 실제 도구 화면에
                올려 내려받은 JPG가 측정 결과와 바이트 단위로 같은지 sha256으로 확인했고, 같았습니다.
              </li>
              <li>
                브라우저는 Playwright의 Chromium 151, Firefox 153, WebKit 26.5입니다(WebKit은 Windows용
                빌드라 실제 사파리와 다를 수 있음). PC는 Core i5-1340P, 메모리 16GB이고, 빌드 같은 작업과
                겹치지 않게 쟀지만 상주 프로그램 때문에 CPU 사용률이 6~46%를 오갔습니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: HEIC 용량과 JPG 용량
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">HEIC 파일</th>
                    <th className="py-2 pr-4 text-brand-black">HEIC</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 90%</th>
                    <th className="py-2 pr-4 text-brand-black">JPG ÷ HEIC</th>
                    <th className="py-2 pr-4 text-brand-black">PNG</th>
                    <th className="py-2 pr-4 text-brand-black">재저장 차이</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {sizeRows.map((row) => (
                    <tr key={row.file} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.file}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.heic}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.ratio}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              Chromium 기준. 1MB=1,000,000B. &lsquo;재저장 차이&rsquo;는 libheif-js가 푼 이미지와 그것을 JPG
              90%로 저장한 결과 사이의 PSNR로, 숫자가 클수록 차이가 작습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. JPG가 커질지 작아질지는 HEIC 쪽에 달렸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 50으로 만든 HEIC는 JPG로 바꾸자 1.65배(거북이), 2.37배(꽃)로 커졌고, 품질 70·90 HEIC는
              JPG가 0.12~0.63배로 작았습니다. JPG 90%의 용량은 사진 내용으로 거의 정해지는데(거북이
              2.82~3.00MB, 꽃 438~636KB), HEIC는 설정에 따라 185KB부터 8.39MB까지 움직였기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 100%면 재저장 차이는 55.9~61.7dB로 줄지만 파일이 HEIC의 1.32~11.15배가 됩니다. 무손실
              PNG는 4.31~21.72MB였습니다. 보관용이라면 HEIC 원본을 그대로 두는 편이 낫습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              &ldquo;HEIC는 JPG의 절반 용량&rdquo;이라는 말도 확인했습니다. 기준 이미지를 바로 JPG로 저장해
              PSNR이 가장 가까운 것끼리 맞대니, 거북이는 HEIC 품질 50(1.71MB, 38.0dB)과 JPG 85%(2.28MB,
              37.8dB), 꽃은 HEIC 품질 50(185KB, 45.0dB)과 JPG 80%(284KB, 44.8dB)이 짝이 됐습니다. HEIC가
              JPG의 0.75배, 0.65배로, 절반까지는 아니었습니다. 품질 70·90은 PSNR이 비슷한 JPG가 없어
              비교에서 뺐습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 측정하다 고친 것: 그늘이 검게 뭉치던 문제
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              첫 측정에서 거북이 품질 70 파일을 도구가 푼 이미지는 기준과 28.5dB밖에 맞지 않았습니다. 같은
              파일을 pillow-heif(libheif)로 풀면 43.9dB이니, 압축이 아니라 푸는 과정의 문제였습니다. 당시
              도구가 쓰던 heic2any 0.0.4는 파일의 색 범위 표시와 상관없이 밝기가 16~235(제한 범위)에 담겼다고
              보고 풉니다. 측정 파일은 0~255 전체 범위였고, 밝기가 약 1.15배로 늘어난 뒤 16~17만큼
              내려갔습니다. 어두운 곳은 더 어둡게, 밝은 곳은 더 밝게 밀린 것입니다.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
              {figures.map((f) => (
                <figure key={f.src}>
                  <img
                    src={`/images/blog/heic-to-jpg-guide/${f.src}`}
                    alt={f.alt}
                    width={600}
                    height={450}
                    loading="lazy"
                    className="w-full h-auto rounded"
                  />
                  <figcaption className="mt-2 text-sm text-brand-mid">{f.label}</figcaption>
                </figure>
              ))}
            </div>
            <p className="text-sm text-brand-light mb-6">
              거북이 품질 70 파일을 도구로 JPG 90% 변환한 결과의 같은 영역(1200×900)을 줄인 것. 고치기 전
              결과에서는 이 영역의 8.8%가 새로 완전한 검정이 됐고, 고친 뒤에는 0.05%였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              디코더를 색 범위 표시를 따르는 libheif-js 1.23.5로 바꾸고 같은 여덟 파일로 다시 쟀습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">기준</th>
                    <th className="py-2 pr-4 text-brand-black">고치기 전</th>
                    <th className="py-2 pr-4 text-brand-black">고친 뒤</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {fixRows.map((row) => (
                    <tr key={row.item} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4">{row.item}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.ref}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.before}</td>
                      <td className="py-2 pr-4 whitespace-nowrap font-medium text-brand-black">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              고치기 전은 heic2any 0.0.4, 고친 뒤는 libheif-js 1.23.5(아래 속도 수정까지 반영). 같은 날 같은
              파일과 같은 PC로 쟀습니다.
              화질은 기준 이미지 대비 PSNR, 밝기는 0~255 평균, 검정·흰색은 세 채널이 모두 0 또는 255인 픽셀의
              비율. 변환 시간은 품질 50 꽃을 뺀 다섯 파일의 최소~최대입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              고친 뒤 결과는 pillow-heif로 푼 것과 거의 같았습니다. 여섯 파일에서 둘 사이 PSNR은
              50.9~104.8dB, 평균 밝기 차이는 0.01 이하였습니다. 거북이 사진 전체 평균 밝기는 고치기 전에도
              121.6에서 123.1로 1.5 정도만 달랐습니다. 그늘에서는 58.0이 50.5로 떨어져 있었으니, 평균만 봤다면
              놓쳤을 문제입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              디코더를 바꾼 뒤 다시 재다 두 가지를 더 고쳤습니다. 푼 결과를 PNG로 한 번 저장했다 읽던 단계가
              WebKit 중앙값 6.0초, Chromium 1.1초여서 없앴고, 여러 장을 동시에 풀다 Firefox 측정이 메모리 부족으로
              끊겨 한 장씩 풀게 했습니다. 픽셀과 JPG 바이트는 그대로이고, WebKit 한 장은 9.4~13.2초에서
              3.5~5.4초가 됐습니다. Firefox만 heic2any 때보다 느립니다.
            </p>

            <BlogInlineCTA href="/tools/image/heic-to-jpg" label="HEIC → JPG 변환 →">
              갖고 있는 HEIC를 넣고 원본과 그늘 쪽 밝기를 나란히 비교해 볼 수 있습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 한 장에 몇 초, 대부분은 HEIC를 푸는 시간
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">브라우저</th>
                    <th className="py-2 pr-4 text-brand-black">한 장 (다섯 파일)</th>
                    <th className="py-2 pr-4 text-brand-black">중앙값</th>
                    <th className="py-2 pr-4 text-brand-black">꽃 품질 50 (185KB)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {timeRows.map((row) => (
                    <tr key={row.browser} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.browser}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.range}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.median}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.small}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              파일마다 3~5회 반복한 값의 최소~최대. 디코더 준비가 끝난 뒤의 값이고, 이 PC와 이 조건에서의
              범위라 기기가 다르면 달라집니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              단계를 나눠 재 보니 시간 대부분은 HEIC를 풀어 RGB로 바꾸는 단계였습니다. 중앙값이 Chromium
              2.6초, Firefox 5.6초, WebKit 3.5초였고, 캔버스에 옮기는 단계는 0.1초도 걸리지 않았습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">한꺼번에 올린 장수</th>
                    <th className="py-2 pr-4 text-brand-black">Chromium (장당)</th>
                    <th className="py-2 pr-4 text-brand-black">WebKit (장당)</th>
                    <th className="py-2 pr-4 text-brand-black">Firefox (장당)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {batchRows.map((row) => (
                    <tr key={row.n} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.n}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.chromium}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.webkit}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.firefox}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              실제 도구 화면에서 &lsquo;변환&rsquo;을 누른 때부터 완료 문구가 뜰 때까지. 회마다 새 창이라 디코더를
              내려받는 시간이 들어 있습니다. 장당 시간은 중앙값을 장수로 나눈 값.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              한 장씩 차례로 푸니 10장은 한 장 시간의 약 7~9배였고, 세 브라우저 모두 실패 없이 끝났습니다.
              10장을 변환하는 동안 브라우저 프로세스 전체의 메모리(작업 관리자 기준 작업 집합) 최대치는 Chromium 657~723MB,
              WebKit 941MB, Firefox 1,243~1,271MB였습니다. WebKit은 두 번째 회차 도중 측정 PC의 메모리가 모자라
              측정이 끊겨 한 번만 남았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 촬영 정보는 사라지고, 방향은 유지됐다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              측정용 HEIC에는 NASA 원본의 EXIF를 그대로 넣었습니다(거북이 17,642바이트, 꽃
              39,658바이트). 변환된 JPG에는 세 브라우저, 어느 품질에서도 EXIF 구역이 없었습니다. Canvas가
              픽셀만 다시 저장하기 때문입니다. 촬영 시각이 필요하면 HEIC 원본을 남겨 두세요. EXIF에 무엇이
              들어 있는지는{" "}
              <Link href="/blog/exif-removal-guide" className="text-brand-accent hover:underline">
                EXIF 실측 글
              </Link>
              에 정리했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              픽셀은 가로(4032×3024)로 두고 회전 정보만 넣은 HEIC는 세 브라우저 모두 3024×4032로 바로 선 채
              나왔고, 바로 세운 기준과의 PSNR도 회전 없는 파일과 같은 43.8dB였습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 푼 픽셀은 세 브라우저가 같고, JPG는 Firefox만 컸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              세 브라우저 모두 여덟 파일을 전부 변환했고, libheif-js가 푼 픽셀은 세 브라우저에서 같았습니다(픽셀
              해시 일치). JPG는 Chromium과 WebKit이 바이트까지 같았고 Firefox는 같은 90%에서 1.11~1.73배
              컸습니다. JPG 인코더 차이로, 자세한 내용은{" "}
              <Link href="/blog/browser-image-encoders" className="text-brand-accent hover:underline">
                브라우저별 인코더 실측
              </Link>
              에 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              아이폰에서 처음부터 JPG로 찍는 설정
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              측정이 아니라 Apple 지원 문서를 확인한 내용입니다. iOS 11 이후 지원 기기에서 설정 → 카메라 →
              포맷의 &lsquo;높은 호환성&rsquo;을 고르면 새로 찍는 사진이 JPEG로 저장되고, &lsquo;고효율성&rsquo;을
              고르면 HEIF로 돌아갑니다. 문서는 HEIF가 JPEG보다 압축률이 높다고만 적고 수치는 없습니다. 출처:{" "}
              <a
                href="https://support.apple.com/ko-kr/116944"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                Apple 지원 &lsquo;Apple 기기에서 HEIF 또는 HEVC 미디어 사용하기&rsquo;
              </a>{" "}
              (2026-11-23 확인).
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리하면</h2>
            <div className="overflow-x-auto mb-6">
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
                    <td className="py-2 pr-4 font-medium text-brand-black">제출·공유용 사본</td>
                    <td className="py-2 pr-4">품질 90% 그대로</td>
                    <td className="py-2 pr-4">재저장 차이 39.1~50.8dB, 용량은 HEIC의 0.12~2.37배</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">보관</td>
                    <td className="py-2 pr-4">HEIC 원본을 남기기</td>
                    <td className="py-2 pr-4">JPG 100%는 HEIC의 1.32~11.15배, EXIF는 변환 때 사라짐</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">예전에 변환한 사진이 진해 보일 때</td>
                    <td className="py-2 pr-4">HEIC 원본으로 다시 변환</td>
                    <td className="py-2 pr-4">그늘 평균 밝기 50.5 → 58.0(기준 58.0)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">여러 장</td>
                    <td className="py-2 pr-4">장당 3~6초로 잡기</td>
                    <td className="py-2 pr-4">10장 Chromium 32.1~32.8초, WebKit 39.4~44.5초, Firefox 55.4~57.6초</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이번에 재지 않은 것</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>아이폰이 실제로 저장한 HEIC. 용량 비율과 밝기 모두 직접 인코딩한 파일에서만 확인했습니다.</li>
              <li>10비트·HDR 사진, 라이브 포토, 4,800만 화소 같은 더 큰 사진.</li>
              <li>동시에 풀던 예전 코드와의 메모리 비교, 휴대폰 브라우저와 실제 사파리.</li>
            </ul>

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
              <h3 className="text-xl font-bold text-brand-paper mb-3">내 HEIC로 재 보기</h3>
              <p className="text-brand-light mb-6">
                품질을 바꿔 가며 결과 용량을 확인할 수 있습니다.
                <br />
                JPG가 크게 나오면 압축으로 한 번 더 줄이면 됩니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/heic-to-jpg"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  HEIC → JPG 변환
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 압축
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="heic-to-jpg-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
