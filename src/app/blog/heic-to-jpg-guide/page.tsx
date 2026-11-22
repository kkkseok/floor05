import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("heic-to-jpg-guide"),
  title: "HEIC JPG 변환 - 용량·밝기·시간을 직접 잰 결과",
};

const faqs = [
  {
    question: "HEIC를 JPG로 바꾸면 용량이 늘어나나요?",
    answer:
      "HEIC가 얼마나 강하게 압축돼 있었는지에 따라 달랐습니다. 직접 인코딩한 1,200만 화소 HEIC 여섯 개를 품질 90% JPG로 바꾸니 결과는 HEIC의 0.15배에서 2.54배 사이였습니다. 품질 50으로 만든 HEIC는 JPG가 1.79~2.54배로 커졌고, 품질 70·90으로 만든 HEIC는 JPG가 오히려 작았습니다.",
  },
  {
    question: "JPG 품질을 100%로 올리면 원본 HEIC와 같아지나요?",
    answer:
      "가까워지지만 값이 비쌉니다. 품질 100%에서 JPG 재저장으로 생긴 차이는 51.1~52.6dB로 작았는데, 파일은 2.50~12.63MB로 HEIC의 1.5~13.5배가 됐습니다. 기본값 90%에서는 38.3~48.7dB였습니다. 다만 이번 측정 파일에서는 재저장 손실보다 HEIC를 푸는 단계에서 생긴 밝기 변화가 훨씬 컸습니다.",
  },
  {
    question: "HEIC 한 장을 변환하는 데 얼마나 걸리나요?",
    answer:
      "측정한 PC 기준으로 1,200만 화소 한 장에 Chromium 8.7~15.5초, Firefox 2.9~4.5초, WebKit 13.1~21.0초였습니다(가장 작은 파일 하나는 제외한 범위). 실제 도구 화면에서 10장을 한꺼번에 올리면 105.9~108.8초가 걸려, 여러 장을 같이 올려도 장당 시간은 줄지 않았습니다.",
  },
  {
    question: "변환한 JPG에 촬영 정보가 남나요? 사진은 어디로 가나요?",
    answer:
      "측정에 쓴 HEIC에는 EXIF가 17,642바이트와 39,658바이트 들어 있었는데, 변환된 JPG에는 EXIF 구역이 하나도 없었습니다. 변환은 페이지와 함께 내려받은 코드가 브라우저 안에서 합니다. 이번 측정도 같은 코드를 사진을 받을 서버가 없는 빈 페이지에 넣어 돌렸고, 그중 두 파일을 실제 도구에서 내려받은 것과 맞대 보니 바이트 단위로 같았습니다.",
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

// 2026-11-23 측정 (Chromium 151 · Firefox 153 · WebKit 26.5, 원자료: docs/blog-data/heic-2026-11-23.json)
// derived.sizes / derived.levels
const sizeRows = [
  { file: "거북이 · 품질 50", heic: "1.71MB", jpg: "3.05MB", ratio: "1.79배", loss: "40.4dB" },
  { file: "거북이 · 품질 70", heic: "4.74MB", jpg: "3.27MB", ratio: "0.69배", loss: "38.6dB" },
  { file: "거북이 · 품질 90", heic: "8.39MB", jpg: "3.28MB", ratio: "0.39배", loss: "38.3dB" },
  { file: "꽃 · 품질 50", heic: "185KB", jpg: "468KB", ratio: "2.54배", loss: "48.7dB" },
  { file: "꽃 · 품질 70", heic: "2.72MB", jpg: "767KB", ratio: "0.28배", loss: "44.7dB" },
  { file: "꽃 · 품질 90", heic: "5.14MB", jpg: "760KB", ratio: "0.15배", loss: "44.5dB" },
];

// derived.levels (heic2anyVsRef / libheifVsRef / clipped)
const levelRows = [
  { file: "거북이 · 전체 범위", tool: "28.5dB", lib: "43.9dB", clip: "검정 0.013% → 1.933%" },
  { file: "거북이 · 제한 범위(대조군)", tool: "42.8dB", lib: "43.3dB", clip: "검정 0.013% → 0.013%" },
  { file: "꽃 · 전체 범위", tool: "29.8dB", lib: "48.0dB", clip: "흰색 1.414% → 5.014%" },
];

// derived.timeMsPerFile (withoutFlowerQ50 / perFile.flower-q50)
const timeRows = [
  { browser: "Chromium 151", range: "8.7~15.5초", median: "11.4초", small: "4.8~6.9초" },
  { browser: "Firefox 153", range: "2.9~4.5초", median: "3.4초", small: "1.4~1.6초" },
  { browser: "WebKit 26.5", range: "13.1~21.0초", median: "15.0초", small: "2.8~5.0초" },
];

// derived.uiBatchMs
const batchRows = [
  { n: "1장", range: "11.8~12.2초", per: "12.0초" },
  { n: "5장", range: "56.2~60.0초", per: "11.8초" },
  { n: "10장", range: "105.9~108.8초", per: "10.7초" },
];

const figures = [
  { src: "levels-ref.jpg", label: "기준 이미지", alt: "HEIC로 만들기 전 기준 이미지의 거북이 등껍질 아래 그늘 부분" },
  { src: "levels-full.jpg", label: "변환 결과 (전체 범위 HEIC)", alt: "전체 범위 HEIC를 변환한 JPG의 같은 부분. 그늘이 더 어둡게 뭉쳐 있다" },
  { src: "levels-limited.jpg", label: "변환 결과 (제한 범위 HEIC)", alt: "제한 범위 HEIC를 변환한 JPG의 같은 부분. 기준 이미지와 밝기가 같다" },
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
            <p className="text-lg text-brand-mid">용량, 밝기, 걸리는 시간을 직접 잰 결과</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-23">2026-11-23 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              HEIC 파일 여덟 개를 직접 만들어 floor05 HEIC→JPG 변환과 같은 코드로 바꿔 봤습니다. 품질
              90%로 저장한 JPG는 HEIC의 0.15배에서 2.54배 사이였고, 1,200만 화소 한 장을 바꾸는 데
              브라우저에 따라 3초에서 15초 안팎이 걸렸습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              예상하지 못한 결과도 하나 있었습니다. 변환된 JPG의 밝기가 원래 사진과 달랐습니다.
              원인은 HEIC를 푸는 라이브러리에 있었고, 어떤 파일에서 생기는지까지 확인했습니다. 아래에
              숫자와 함께 적습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">측정 파일은 아이폰이 찍은 HEIC가 아닙니다.</strong>{" "}
                NASA 공공 도메인 사진 두 장(거북이 KSC-20210121-PH-JBS01_0079, 꽃
                KSC-20230613-PH-FMX01-0075)을 가운데 4:3으로 잘라 4032×3024(약 1,200만 화소)로 줄인 뒤,
                x265 4.3(libheif 1.23.6)으로 직접 HEIC로 인코딩했습니다. 품질 50·70·90, 4:2:0, 8비트입니다.
                그래서 아래 숫자를 아이폰 카메라의 동작으로 읽으면 안 됩니다.
              </li>
              <li>
                <strong className="text-brand-black">기준 이미지</strong>는 HEIC로 만들기 전의 무손실
                PNG입니다. 화질 지표 PSNR(dB)은 모두 이 이미지나, 따로 밝힌 중간 결과와 비교한 값입니다.
              </li>
              <li>
                <strong className="text-brand-black">변환 경로</strong>는 도구와 같습니다. 도구의 변환
                함수를 그대로 묶어 실행했습니다. heic2any 0.0.4가 HEIC를 풀고, Canvas가 JPG로 저장합니다.
                도구 화면의 기본 품질은 90%입니다.
              </li>
              <li>
                <strong className="text-brand-black">대조</strong>: 두 파일은 실제 도구 화면에 올려
                내려받은 JPG와 측정 결과가 바이트 단위로 같은지 확인했고, 같았습니다.
              </li>
              <li>
                브라우저는 Playwright의 Chromium 151, Firefox 153, WebKit 26.5입니다. WebKit은 Windows용
                빌드라 실제 사파리와 다를 수 있습니다.
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
                      <td className="py-2 pr-4 whitespace-nowrap">{row.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              Chromium 기준. 1MB=1,000,000B. &lsquo;재저장 차이&rsquo;는 heic2any가 푼 이미지와 그것을 JPG
              90%로 저장한 결과 사이의 PSNR로, 숫자가 클수록 차이가 작습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. JPG가 커질지 작아질지는 HEIC 쪽에 달렸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 50으로 만든 HEIC는 JPG로 바꾸자 1.79배(거북이), 2.54배(꽃)로 커졌습니다. 반대로 품질
              70·90으로 만든 HEIC는 JPG가 0.15~0.69배로 더 작았습니다. JPG 90%의 용량은 사진 내용에 따라
              거의 정해지는데(거북이 3.05~3.28MB, 꽃 468~767KB), HEIC 쪽은 인코딩 설정에 따라 185KB부터
              8.39MB까지 움직였기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질을 100%로 올리면 재저장 차이는 51.1~52.6dB까지 줄지만, 파일이 2.50~12.63MB가 됩니다.
              HEIC의 1.5~13.5배입니다. 보관용이라면 JPG 100%로 바꾸는 것보다 HEIC 원본을 그대로 두는 편이
              낫습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              &ldquo;HEIC는 JPG의 절반 용량&rdquo;이라는 말도 확인해 봤습니다. 기준 이미지를 HEIC를 거치지
              않고 같은 Canvas로 JPG 저장한 뒤, PSNR이 가장 가까운 것끼리 맞댔습니다. 거북이는 HEIC 품질
              50(1.71MB, 38.0dB)과 JPG 85%(2.28MB, 37.8dB), 꽃은 HEIC 품질 50(185KB, 45.0dB)과 JPG
              80%(284KB, 44.8dB)이 짝이 됐습니다. HEIC가 JPG의 0.75배, 0.65배였습니다. 이 인코더와 이 두
              장에서는 절반까지는 아니었습니다. 품질 70·90 파일은 PSNR이 비슷한 JPG가 없어 비교하지
              않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 변환 결과의 밝기가 달라졌다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              거북이 품질 70 파일을 heic2any가 푼 이미지는 기준 이미지와 28.5dB밖에 맞지 않았습니다. 같은
              파일을 최신 libheif로 풀면 43.9dB입니다. HEIC 압축 탓이 아니라 푸는 과정에서 생긴 차이라는
              뜻입니다. 픽셀 값을 맞대 보니 밝기가 약 1.15배로 늘고 16~17만큼 내려가 있었습니다. 어두운
              곳은 더 어둡게, 밝은 곳은 더 밝게 밀려난 것입니다.
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
              거북이 품질 70 파일의 같은 영역(1200×900)을 줄인 것. 이 영역의 평균 밝기는 기준 58.0,
              가운데 50.5, 오른쪽 57.8이고, 가운데 그림에서는 영역의 8.8%가 새로 완전한 검정이 됐습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              원인은 heic2any 안에 든 변환식입니다. HEIC는 밝기를 0~255 전체로 담을 수도 있고(전체 범위),
              영상처럼 16~235로 담을 수도 있는데(제한 범위), heic2any는 파일에 적힌 표시와 상관없이 제한
              범위라고 보고 풉니다. 측정 파일은 전체 범위로 인코딩돼 있었습니다. 확인하려고 거북이 사진을
              제한 범위로 다시 인코딩해 넣어 보니 42.8dB로, libheif 결과(43.3dB)와 0.5dB 안으로
              맞았습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">HEIC (품질 70)</th>
                    <th className="py-2 pr-4 text-brand-black">heic2any로 풀기</th>
                    <th className="py-2 pr-4 text-brand-black">libheif로 풀기</th>
                    <th className="py-2 pr-4 text-brand-black">잘린 픽셀 (기준 → 결과)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {levelRows.map((row) => (
                    <tr key={row.file} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.file}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.tool}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.lib}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.clip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              dB는 기준 이미지 대비 PSNR. 잘린 픽셀은 세 채널이 모두 0(검정)이거나 모두 255(흰색)인 픽셀의
              비율입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              이 차이는 JPG 품질을 올려도 사라지지 않습니다. 전체 범위 파일은 품질 90% JPG가 기준 대비
              28.3dB, 제한 범위 파일은 38.4dB였습니다. 아이폰이 저장한 HEIC가 어느 쪽인지, 같은 현상이
              나는지는 이번에 재지 못했습니다. 저작권이 깨끗한 아이폰 원본을 구하지 못했기 때문입니다.
              측정일 기준으로 도구는 이 상태 그대로입니다. 변환한 사진이 원본보다 진하고 어둡게
              보인다면 이 문제일 수 있습니다.
            </p>

            <BlogInlineCTA href="/tools/image/heic-to-jpg" label="HEIC → JPG 변환 →">
              갖고 있는 HEIC로 용량과 밝기를 직접 비교해 볼 수 있습니다.
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
              파일마다 3~5회 반복한 값의 최소~최대. 이 PC, 이 조건에서의 범위이고 기기가 다르면 달라집니다.
              측정 중 다른 작업이 함께 돌았을 가능성을 완전히 배제하지는 못했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 4032×3024인데도 185KB짜리 파일은 훨씬 빨리 끝났습니다. 풀어야 할 데이터가 적기
              때문입니다. Chromium에서 heic2any 디코딩만 따로 재면 4.6~14.2초로, 변환 전체(4.8~15.5초)와
              거의 같았습니다. JPG로 저장하는 시간은 그에 비하면 작습니다. Firefox가 세 브라우저 중 가장
              빨랐습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">한꺼번에 올린 장수</th>
                    <th className="py-2 pr-4 text-brand-black">변환 클릭 → 완료</th>
                    <th className="py-2 pr-4 text-brand-black">장당 (중앙값 기준)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {batchRows.map((row) => (
                    <tr key={row.n} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.n}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.range}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.per}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              실제 도구 화면(Chromium)에서 3회씩 잰 값입니다. 10장을 한꺼번에 올려도 장당 10.7초로 한 장씩
              할 때와 큰 차이가 없었습니다. 10장이면 2분 가까이 기다려야 한다는 뜻입니다. 세 번 모두 10장이
              실패 없이 끝났습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 촬영 정보는 사라지고, 방향은 유지됐다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              측정용 HEIC에는 NASA 원본의 EXIF를 그대로 넣었습니다(거북이 17,642바이트, 꽃
              39,658바이트). 변환된 JPG에는 어느 품질에서도 EXIF 구역이 없었습니다. Canvas는 픽셀만 다시
              저장하기 때문입니다. 촬영 시각이나 기기 정보가 필요한 사진이라면 HEIC 원본을 지우지 말아야
              합니다. 반대로 위치 정보를 떼고 보내려는 목적이라면 따로 할 일이 줄어듭니다. EXIF에 무엇이
              들어 있는지는{" "}
              <Link href="/blog/exif-removal-guide" className="text-brand-accent hover:underline">
                EXIF 실측 글
              </Link>
              에 정리했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              세로 사진도 확인했습니다. 픽셀은 가로(4032×3024)로 저장하고 &lsquo;돌려서 보여 주라&rsquo;는
              회전 정보를 넣은 HEIC를 변환하니, JPG는 3024×4032로 바로 선 채 나왔습니다. 바로 세운 기준
              이미지와의 PSNR도 회전 없는 파일과 같은 28.5dB였습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 브라우저 세 종류 모두 변환됐다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              Chromium, Firefox, WebKit 모두 여덟 파일을 전부 변환했습니다. heic2any가 푼 픽셀은 세
              브라우저에서 완전히 같았습니다(픽셀 해시 일치). 밝기 문제도 똑같이 나타납니다. JPG 파일은
              Chromium과 WebKit이 바이트까지 같았고, Firefox는 같은 90%에서 1.11~1.72배 컸습니다. JPG
              인코더가 다르기 때문인데, 이 차이는{" "}
              <Link href="/blog/browser-image-encoders" className="text-brand-accent hover:underline">
                브라우저별 인코더 실측
              </Link>
              에서 따로 다뤘습니다. 사파리가 HEIC를 직접 여는지는 이번에 재지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              아이폰에서 처음부터 JPG로 찍는 설정
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              이 부분은 측정이 아니라 Apple 지원 문서를 확인한 내용입니다. 문서에 따르면 iOS 11 이후
              지원 기기는 사진을 HEIF로 저장할 수 있고, 설정 → 카메라 → 포맷에서 &lsquo;높은
              호환성&rsquo;을 고르면 새로 찍는 사진이 JPEG로 저장됩니다. &lsquo;고효율성&rsquo;을 고르면
              다시 HEIF로 돌아갑니다. 공유할 때 받는 기기가 지원하지 않으면 JPEG로 자동 변환되어 공유될
              수 있다는 설명도 있습니다. 문서는 HEIF가 JPEG보다 압축률이 높다고만 적고, 얼마나 작은지
              숫자는 제시하지 않습니다. 출처:{" "}
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
                    <td className="py-2 pr-4">재저장 차이 38.3~48.7dB, 용량은 HEIC의 0.15~2.54배</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">보관</td>
                    <td className="py-2 pr-4">HEIC 원본을 남기기</td>
                    <td className="py-2 pr-4">JPG 100%는 HEIC의 1.5~13.5배, EXIF는 변환 때 사라짐</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">색이 중요한 사진</td>
                    <td className="py-2 pr-4">변환 후 원본과 나란히 확인</td>
                    <td className="py-2 pr-4">전체 범위 HEIC에서 28.5dB, 검정 픽셀 0.013% → 1.933%</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">여러 장</td>
                    <td className="py-2 pr-4">기다릴 시간을 장수만큼 잡기</td>
                    <td className="py-2 pr-4">10장 105.9~108.8초, 장당 시간은 줄지 않음</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이번에 재지 않은 것</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>아이폰이 실제로 저장한 HEIC. 용량 비율과 밝기 문제 모두 직접 인코딩한 파일에서만 확인했습니다.</li>
              <li>10비트·HDR 사진, 라이브 포토, 4,800만 화소 같은 더 큰 사진.</li>
              <li>휴대폰 브라우저에서의 변환 시간, 그리고 실제 사파리.</li>
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
