import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "PNG vs JPG 차이점 - 같은 이미지 세 장으로 직접 재봤습니다",
  description:
    "사진·스크린샷·그래픽을 PNG, JPG, WebP로 저장해 용량과 화질(PSNR)을 직접 측정했습니다. 'PNG가 5~10배 크다'는 말은 사진에서만 맞았습니다.",
  keywords: [
    "PNG JPG 차이",
    "PNG vs JPG",
    "PNG JPG 용량 비교",
    "스크린샷 PNG JPG",
    "JPG 화질 저하",
    "이미지 포맷 비교",
    "WebP 용량",
  ],
  alternates: { canonical: "/blog/png-vs-jpg" },
  openGraph: {
    url: "/blog/png-vs-jpg",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "PNG vs JPG 차이점 - 같은 이미지 세 장으로 직접 재봤습니다",
    description:
      "사진은 8.8배, 스크린샷은 1.4배. 포맷별 용량 차이는 이미지 종류에 따라 크게 달랐습니다.",
  },
};

const faqs = [
  {
    question: "PNG와 JPG의 가장 큰 차이점은 무엇인가요?",
    answer:
      "PNG는 무손실 압축이라 저장 전후 픽셀이 완전히 같고 투명 배경을 지원합니다. JPG는 손실 압축이라 용량이 작은 대신 원본과 미세하게 달라지고, 투명 영역은 단색으로 채워집니다.",
  },
  {
    question: "사진을 PNG로 저장하면 얼마나 커지나요?",
    answer:
      "1920×1499 사진으로 재보니 PNG 6.39MB, JPG 품질 90%가 0.73MB로 약 8.8배 차이였습니다. 품질 80%(0.47MB)와 비교하면 13.5배입니다. 사진은 JPG나 WebP로 저장하는 편이 맞습니다.",
  },
  {
    question: "스크린샷은 JPG로 바꾸면 용량이 많이 줄어드나요?",
    answer:
      "생각보다 덜 줄어듭니다. 1920×1080 웹페이지 캡처는 PNG 176KB, JPG 품질 90%가 125KB로 1.4배 차이에 그쳤습니다. 글자가 많은 캡처는 PNG로 두고, 꼭 줄여야 한다면 WebP를 쓰는 편이 효과적입니다.",
  },
  {
    question: "JPG를 여러 번 다시 저장하면 화질이 계속 떨어지나요?",
    answer:
      "같은 품질(90%)과 같은 크기로 20번 다시 저장했을 때 사진의 PSNR은 38.14dB에서 36.65dB로 1.5dB 내려갔습니다. 손실은 첫 저장에서 가장 크고, 이후로는 조금씩 쌓입니다. 원본은 따로 보관하고 편집할 때마다 원본에서 시작하는 것이 안전합니다.",
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

// 2026-10-15 측정값 (Chrome 151 Canvas 인코더, 원자료: docs/blog-data/png-vs-jpg-2026-10-15.json)
const sizeRows = [
  {
    label: "사진 (1920×1499)",
    png: "6,391KB",
    jpg90: "727KB · 38.1dB",
    jpg80: "473KB · 35.7dB",
    webp80: "357KB · 36.3dB",
  },
  {
    label: "스크린샷 (1920×1080)",
    png: "176KB",
    jpg90: "125KB · 47.8dB",
    jpg80: "99KB · 43.5dB",
    webp80: "52KB · 47.1dB",
  },
  {
    label: "그래픽 (1200×630)",
    png: "28.6KB",
    jpg90: "17.2KB · 49.5dB",
    jpg80: "14.3KB · 47.1dB",
    webp80: "5.9KB · 49.0dB",
  },
];

const generationRows = [
  { count: "1번", photo: "38.14dB", screenshot: "47.80dB" },
  { count: "5번", photo: "37.59dB", screenshot: "47.73dB" },
  { count: "10번", photo: "37.17dB", screenshot: "47.73dB" },
  { count: "20번", photo: "36.65dB", screenshot: "47.73dB" },
];

export default function PngVsJpgPage() {
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
            <span className="text-brand-mid">PNG vs JPG</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              PNG vs JPG 차이점
            </h1>
            <p className="text-lg text-brand-mid">
              같은 이미지 세 장으로 직접 재봤습니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              &ldquo;사진은 JPG, 로고는 PNG&rdquo;라는 요약은 대체로 맞습니다. 그런데 &ldquo;PNG가
              JPG보다 5~10배 크다&rdquo;는 흔한 설명이 스크린샷에도 통하는지는 재보기 전까지
              몰랐습니다. 그래서 사진, 웹페이지 캡처, 단색 그래픽 세 장을 같은 방식으로 PNG·JPG·WebP로
              저장해 용량과 화질을 측정했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              결론부터 말하면, 용량 차이는 이미지 종류에 따라 <strong>1.4배에서 13.5배까지</strong>{" "}
              벌어졌습니다. 포맷을 고르는 기준도 &ldquo;무엇을 찍었나&rdquo;에서 출발하는 게 맞았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              어떻게 측정했나
            </h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">사진</strong>: NASA가 공공 도메인으로 공개한
                케네디우주센터 거북이 사진(Canon EOS 5D Mark IV, 원본 5522×4312)을 1920×1499로 줄여 사용
              </li>
              <li>
                <strong className="text-brand-black">스크린샷</strong>: floor05 이미지 압축 페이지를
                1920×1080으로 캡처 (흰 배경에 한글 본문이 많은 전형적인 웹 캡처)
              </li>
              <li>
                <strong className="text-brand-black">그래픽</strong>: floor05 공유 이미지(1200×630, 단색 면과
                글자로 된 이미지)
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              인코딩은 Chrome 151의 Canvas <code className="font-mono text-sm">toBlob</code>으로 했습니다.
              floor05{" "}
              <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                포맷 변환 도구
              </Link>
              가 브라우저에서 쓰는 것과 같은 경로라, 도구로 바꿨을 때 나오는 결과와 같은 조건입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              화질은 PSNR(최대 신호 대 잡음비)로 비교했습니다. 저장한 파일을 다시 열어 원본과 픽셀
              값을 하나하나 비교한 수치로, 높을수록 원본에 가깝습니다. PNG는 다시 열어도 모든 픽셀이
              원본과 같아서 값이 무한대로 나옵니다. 흔히 40dB를 넘으면 나란히 놓고 봐도 차이를 찾기
              어려운 수준으로 봅니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: 용량과 화질
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-2 pr-4 text-brand-black">이미지</th>
                    <th className="text-left py-2 pr-4 text-brand-black">PNG</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG 80%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">WebP 80%</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {sizeRows.map((row) => (
                    <tr key={row.label} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.label}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg90}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg80}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.webp80}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              KB는 1,000바이트 기준. dB는 PSNR이며 PNG는 무손실이라 표시하지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. &lsquo;PNG가 훨씬 크다&rsquo;는 사진에서만 맞았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              사진은 예상대로였습니다. PNG가 6.39MB, JPG 품질 90%가 0.73MB로{" "}
              <strong>8.8배</strong> 차이가 났고, 품질 80%와 비교하면 13.5배였습니다. 사진은 픽셀마다
              색이 조금씩 달라서 PNG의 무손실 압축이 거의 힘을 쓰지 못합니다. 메일 첨부 한도나 업로드
              제한에 걸리는 건 대부분 이런 경우입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              스크린샷은 달랐습니다. PNG 176KB, JPG 90% 125KB로 <strong>1.4배</strong> 차이에
              그쳤습니다. 흰 배경과 같은 색 글자가 넓게 반복되는 화면은 PNG가 원래 잘 압축합니다.
              JPG로 바꿔서 아끼는 용량이 50KB 남짓이라면, 글자를 원본 그대로 보존하는 PNG를 두는 편이
              낫습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래픽도 비슷했습니다. PNG 28.6KB, JPG 90% 17.2KB로 1.7배 차이였고, 둘 다 이미 충분히
              작은 크기였습니다.
            </p>

            <BlogInlineCTA href="/tools/image/convert" label="포맷 변환 →">
              갖고 있는 파일로 직접 비교해 보세요. 변환은 브라우저 안에서만 일어납니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 글자 이미지의 JPG 손상은 품질을 꽤 낮춰야 보인다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              &ldquo;스크린샷을 JPG로 저장하면 글자가 뭉개진다&rdquo;는 말도 확인해 봤습니다. 같은
              캡처의 본문 한 줄을 4배로 확대해 PNG, JPG 80%, JPG 40%를 나란히 놓았습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/png-vs-jpg/text-edge-compare.png"
                alt="같은 한글 문장을 4배 확대한 비교. PNG와 JPG 80%는 거의 같고, JPG 40%는 글자 주변에 얼룩이 보인다"
                width={600}
                height={442}
                loading="lazy"
                className="block w-full max-w-xl mx-auto border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                floor05 이미지 압축 페이지 캡처의 본문 한 줄, 4배 확대
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 80%는 4배로 확대해도 PNG와 구분하기 어려웠습니다. PSNR도 43.5dB로 40dB를 넘었습니다.
              차이가 눈에 띈 건 40%까지 내렸을 때였습니다. 글자 획 주변에 회색 얼룩이 번지고, 흰
              배경이 군데군데 탁해집니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그러니 정확한 표현은 &ldquo;JPG는 글자를 뭉갠다&rdquo;가 아니라 &ldquo;품질을 많이
              낮춘 JPG는 글자 주변부터 티가 난다&rdquo;입니다. 문서 캡처를 아주 작게 줄여야 할 때
              품질 슬라이더를 끝까지 내리지 않는 이유입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 다시 저장할 때의 손실은 생각보다 작았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              JPG는 저장할 때마다 화질이 떨어진다고들 합니다. 같은 품질(90%)과 같은 크기로 20번
              연속해서 다시 저장하고, 매번 첫 원본과 비교했습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-2 pr-4 text-brand-black">저장 횟수</th>
                    <th className="text-left py-2 pr-4 text-brand-black">사진 PSNR</th>
                    <th className="text-left py-2 pr-4 text-brand-black">스크린샷 PSNR</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {generationRows.map((row) => (
                    <tr key={row.count} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.count}</td>
                      <td className="py-2 pr-4">{row.photo}</td>
                      <td className="py-2 pr-4">{row.screenshot}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              사진은 20번 동안 1.5dB 내려갔고, 스크린샷은 다섯 번째 이후로 거의 변하지 않았습니다.
              손실의 대부분은 <strong>처음 JPG로 만들 때</strong> 생기고, 같은 조건으로 다시 저장하면
              조금씩 쌓이는 정도였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              이번 측정은 품질과 크기를 바꾸지 않은 경우만 다뤘습니다. 실제 편집에서는 자르고, 줄이고,
              다른 품질로 저장하는 일이 섞이니, 원본은 따로 두고 작업할 때마다 원본에서 시작하는 습관이
              여전히 가장 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 투명 배경은 여전히 PNG의 몫
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              용량과 별개로, JPG에는 투명이라는 개념이 없습니다. 투명한 영역은 저장하는 순간 단색으로
              채워집니다. 배경 없는 로고나 스티커처럼 다른 이미지 위에 올릴 파일은 PNG(또는 투명을
              지원하는 WebP)로 둬야 합니다.
            </p>
            <figure className="my-8">
              <svg viewBox="0 0 400 210" role="img" width="100%" className="block max-w-xl mx-auto" style={{ height: "auto" }}>
                <title>PNG와 JPG의 투명 배경 차이</title>
                <desc>PNG는 체커보드로 표현한 투명 배경 위에 도형을 유지하고, JPG는 같은 도형을 흰 배경으로 채우는 것을 나란히 보여 줍니다.</desc>
                <defs>
                  <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
                    <rect width="20" height="20" fill="#FFFFFF" />
                    <rect width="10" height="10" fill="#B0B0B0" />
                    <rect x="10" y="10" width="10" height="10" fill="#B0B0B0" />
                  </pattern>
                </defs>
                <text x="105" y="22" textAnchor="middle" fontSize="15" fill="#0A0A0A">PNG</text>
                <text x="295" y="22" textAnchor="middle" fontSize="15" fill="#0A0A0A">JPG</text>
                <rect x="20" y="30" width="170" height="140" rx="6" fill="url(#checker)" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="105" cy="100" r="42" fill="#C45C2C" />
                <rect x="210" y="30" width="170" height="140" rx="6" fill="#FFFFFF" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="295" cy="100" r="42" fill="#C45C2C" />
                <text x="105" y="192" textAnchor="middle" fontSize="13" fill="#4A4A4A">투명 배경 유지</text>
                <text x="295" y="192" textAnchor="middle" fontSize="13" fill="#4A4A4A">단색으로 채움</text>
              </svg>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">같은 도형이라도 PNG는 배경을 투명하게 두고, JPG는 단색으로 메웁니다.</figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 변환 도구로 투명 PNG를 JPG로 바꾸면 기본으로 흰색이 채워지고, 다른 색을 직접
              고를 수도 있습니다. 어두운 배경의 슬라이드에 넣을 거라면 그 배경색을 미리 지정해 두면
              테두리에 흰 띠가 생기지 않습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 웹에 올릴 거라면 WebP가 세 경우 모두 가장 작았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              비교용으로 넣은 WebP는 세 이미지 모두에서 가장 작았습니다. 사진은 WebP 80%가 357KB로
              JPG 80%(473KB)보다 25% 작으면서 PSNR은 조금 더 높았습니다. 스크린샷은 WebP 80%가 52KB로
              PNG의 3분의 1 아래였고, 그래픽은 5.9KB로 PNG의 5분의 1 수준이었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              다만 받는 쪽이 WebP를 열 수 있는지가 먼저입니다. 블로그나 웹사이트에 올리는 용도라면
              WebP가 유리하고, 관공서 제출이나 오래된 프로그램으로 열어야 하는 파일이라면 JPG·PNG가
              무난합니다. 자세한 비교는{" "}
              <Link href="/blog/webp-guide" className="text-brand-accent hover:underline">
                WebP 가이드
              </Link>
              에 정리했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정을 바탕으로 정한 선택 기준
            </h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/30">
                    <th className="text-left py-2 pr-4 text-brand-black">이런 이미지라면</th>
                    <th className="text-left py-2 pr-4 text-brand-black">추천</th>
                    <th className="text-left py-2 pr-4 text-brand-black">이유 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">사진·풍경·인물</td>
                    <td className="py-2 pr-4">JPG 80~90%</td>
                    <td className="py-2 pr-4">PNG 대비 8.8~13.5배 작고 PSNR 35dB 이상</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">문서·웹페이지 캡처</td>
                    <td className="py-2 pr-4">PNG</td>
                    <td className="py-2 pr-4">JPG로 바꿔도 1.4배 차이뿐, 글자는 원본 그대로</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">로고·아이콘·투명 배경</td>
                    <td className="py-2 pr-4">PNG</td>
                    <td className="py-2 pr-4">JPG는 투명 영역을 단색으로 채움</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">블로그·웹사이트 업로드</td>
                    <td className="py-2 pr-4">WebP</td>
                    <td className="py-2 pr-4">세 이미지 모두에서 가장 작음</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              사진이 PNG로 저장돼 있어 용량이 부담된다면 JPG로 바꾸는 것만으로 크게 줄어듭니다. 이미
              JPG인데 더 줄여야 한다면{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              에서 목표 용량을 정해 품질을 맞추는 편이 빠릅니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                내 파일로 직접 비교해 보기
              </h3>
              <p className="text-brand-light mb-6">
                PNG·JPG·WebP·AVIF 사이를 오가며 결과 용량을 바로 확인할 수 있습니다.
                <br />
                변환은 이 브라우저 안에서 끝납니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/convert"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  포맷 변환 도구
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
          <BlogExtras slug="png-vs-jpg" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
