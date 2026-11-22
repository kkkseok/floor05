import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("avif-guide"),
  title: "AVIF 변환 실측 - 브라우저 5종에서 저장은 0곳, 열기는 4곳",
};

const faqs = [
  {
    question: "받은 AVIF 파일이 안 열리면 어떻게 하나요?",
    answer:
      "브라우저에서 열어 JPG나 PNG로 다시 저장하면 됩니다. 직접 만든 AVIF 6종을 Chromium 151, Chrome 158, Edge 158, Firefox 153에 올리니 네 곳 모두 6종을 전부 열었습니다. 다만 용량은 늘어납니다. JPG 품질 90%로 되돌린 5장은 원래 AVIF의 1.53~4.67배가 됐습니다.",
  },
  {
    question: "브라우저에서 사진을 AVIF로 저장할 수 있나요?",
    answer:
      "이번에 확인한 5종에서는 안 됐습니다. Chromium 151, Chrome 158, Edge 158, Firefox 153, WebKit 26.5에 캔버스 AVIF 저장을 요청하니 다섯 곳 모두 PNG 파일을 돌려줬습니다. 그래서 floor05 포맷 변환 도구의 AVIF 버튼도 이 5종에서는 '미지원'으로 꺼져 있었습니다.",
  },
  {
    question: "AVIF를 JPG로 바꾸면 화질이 떨어지나요?",
    answer:
      "조금 떨어집니다. JPG 품질 90%로 바꾼 5장은 압축 전 원본과 비교한 PSNR이 AVIF일 때보다 1.67~2.60dB 낮아졌습니다. PNG로 바꾸면 AVIF를 연 화면과 픽셀이 완전히 같았지만 용량이 AVIF의 6.46~20.95배였습니다.",
  },
  {
    question: "AVIF를 변환할 때 파일이 서버로 올라가나요?",
    answer:
      "올라가지 않습니다. AVIF를 푸는 일은 지금 쓰는 브라우저에 들어 있는 디코더가 하고, 풀린 픽셀을 같은 탭에서 JPG나 PNG로 다시 저장합니다. 측정에 쓴 417KB 거북이 AVIF도 이 방식으로 639KB JPG가 됐고, 도구 화면에서 내려받은 파일과 측정 스크립트의 결과가 바이트 단위로 같았습니다.",
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

// 2026-11-22 측정 (원자료: docs/blog-data/avif-2026-11-22.json)
// engines.<이름>.encode / decode — 캔버스 AVIF 저장 요청 결과, AVIF 6종 열기 결과
const engineRows = [
  { name: "Chromium 151", build: "Playwright 번들", save: "PNG", open: "6종 모두 열림", ok: true },
  { name: "Chrome 158", build: "이 PC 설치본", save: "PNG", open: "6종 모두 열림", ok: true },
  { name: "Edge 158", build: "이 PC 설치본", save: "PNG", open: "6종 모두 열림", ok: true },
  { name: "Firefox 153", build: "Playwright 번들", save: "PNG", open: "6종 모두 열림", ok: true },
  { name: "WebKit 26.5", build: "Playwright 번들 · Windows 빌드", save: "PNG", open: "6종 모두 실패", ok: false },
];

// backSummary — JPG 90%와 같은 화질의 AVIF를 도구 경로(Chromium 151)로 되돌린 용량
const backRows = [
  { name: "사진 · 거북이", avif: "417KB", jpg: "639KB (1.53배)", png: "3.72MB (8.92배)", webp: "512KB (1.23배)", loss: "-1.90dB" },
  { name: "사진 · 꽃", avif: "47.9KB", jpg: "115KB (2.41배)", png: "1.00MB (20.95배)", webp: "59.7KB (1.25배)", loss: "-1.67dB" },
  { name: "화면 캡처 · 데스크톱", avif: "43.3KB", jpg: "117KB (2.71배)", png: "280KB (6.46배)", webp: "63.2KB (1.46배)", loss: "-2.60dB" },
  { name: "화면 캡처 · 휴대폰", avif: "61.4KB", jpg: "197KB (3.21배)", png: "464KB (7.55배)", webp: "89.9KB (1.46배)", loss: "-2.52dB" },
  { name: "그래픽", avif: "3.6KB", jpg: "16.9KB (4.67배)", png: "46.6KB (12.90배)", webp: "7.1KB (1.97배)", loss: "-2.46dB" },
];

// backSummary.captureDesk — 데스크톱 캡처 AVIF 한 장을 되돌린 용량(KB)
const deskBars = [
  { label: "받은 AVIF", kb: 43.3 },
  { label: "WebP 90%로 변환", kb: 63.2 },
  { label: "JPG 90%로 변환", kb: 117.3 },
  { label: "PNG로 변환", kb: 280.0 },
];

// matched.<이미지>.jpg90 / webp90 — 그 PSNR 이상을 내는 가장 낮은 AVIF 품질 (Pillow 12.1.1 · libavif 1.3.0 · aom 3.12.1)
const matchedRows = [
  { name: "사진 · 거북이", jpg: "723KB · 38.20dB", avif: "74 · 417KB · 38.30dB", vsJpg: "-42.2%", vsWebp: "-11.9%" },
  { name: "사진 · 꽃", jpg: "128KB · 45.20dB", avif: "85 · 47.9KB · 45.23dB", vsJpg: "-62.5%", vsWebp: "-40.9%" },
  { name: "화면 캡처 · 데스크톱", jpg: "118KB · 48.09dB", avif: "60 · 43.3KB · 48.14dB", vsJpg: "-63.4%", vsWebp: "-16.0%" },
  { name: "화면 캡처 · 휴대폰", jpg: "199KB · 46.75dB", avif: "63 · 61.4KB · 46.98dB", vsJpg: "-69.2%", vsWebp: "-15.6%" },
  { name: "그래픽", jpg: "17.2KB · 49.49dB", avif: "60 · 3.6KB · 49.55dB", vsJpg: "-79.0%", vsWebp: "-41.5%" },
];

export default function AvifGuidePage() {
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
            <span className="text-brand-mid">AVIF, 브라우저에서 되는 것과 안 되는 것</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              AVIF, 브라우저에서 되는 것과 안 되는 것
            </h1>
            <p className="text-lg text-brand-mid">
              저장은 5종 모두 실패, 열기는 4종 성공. 되돌리면 얼마나 커지는지도 쟀습니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-22">2026-11-22 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              브라우저 5종에 사진을 AVIF로 저장해 달라고 요청했더니 다섯 곳 모두 PNG를 내놨습니다. 반대로 이미
              만들어진 AVIF를 여는 일은 네 곳에서 문제없이 됐습니다. 지금 브라우저에서 AVIF로 할 수 있는 일은
              &lsquo;받은 AVIF를 다른 형식으로 바꾸기&rsquo;까지였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              그래서 바꾸는 쪽을 자세히 쟀습니다. AVIF를 JPG 품질 90%로 되돌리면 용량이 1.53~4.67배, PNG로 되돌리면
              6.46~20.95배가 됐습니다. AVIF가 그만큼 작게 담겨 있었다는 뜻이기도 해서, 같은 화질에서 JPG·WebP보다
              얼마나 작은지도 함께 적었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">브라우저 5종</strong>: Playwright에 들어 있는 Chromium 151,
                Firefox 153, WebKit 26.5와 이 PC에 설치된 Chrome 158, Edge 158. WebKit은 Windows용 빌드라 실제
                사파리와 다를 수 있습니다.
              </li>
              <li>
                <strong className="text-brand-black">기준 이미지 5장</strong>: NASA 공공 도메인 사진 2장(거북이
                1920×1499, 꽃 1920×1281), floor05 포맷 변환 페이지 화면 캡처 2장(1920×1080, 1080×2340), floor05
                공유 이미지 1장(1200×630). 모두 무손실 PNG 상태가 기준입니다.
              </li>
              <li>
                <strong className="text-brand-black">AVIF 파일</strong>: 브라우저가 만들지 못해서 Python Pillow
                12.1.1(libavif 1.3.0, aom 3.12.1)로 직접 인코딩했습니다. 품질 1~100, 색 정보 4:2:0, 8비트, 속도
                6. 열기 확인용으로 4:4:4, 10비트(ffmpeg), 투명 배경, 2프레임 애니메이션도 만들었습니다.
              </li>
              <li>
                <strong className="text-brand-black">되돌리기</strong>: Chromium 151에서 floor05{" "}
                <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                  포맷 변환 도구
                </Link>
                와 같은 캔버스 저장 경로로 JPG 1~100%, PNG, WebP 90%.
              </li>
              <li>
                <strong className="text-brand-black">화질</strong>: 압축 전 기준 픽셀과 비교한 PSNR(dB).
                높을수록 원본에 가깝습니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              변환 도구 화면에 같은 AVIF를 올려 내려받은 JPG·PNG·WebP도 측정 스크립트의 결과와 바이트 단위로
              같았습니다(Chromium 151).
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. AVIF 저장을 요청하면 다섯 곳 모두 PNG가 나왔다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              웹 페이지가 이미지를 파일로 저장할 때는 캔버스에 형식을 지정해 요청합니다. 형식에
              &lsquo;image/avif&rsquo;를 넣어 보니 다섯 브라우저 모두 오류 없이 파일을 돌려줬는데, 열어 보면
              PNG였습니다. 일반 캔버스와 백그라운드용 캔버스(OffscreenCanvas) 둘 다 같았습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">브라우저</th>
                    <th className="text-left py-2 pr-4 text-brand-black">AVIF 저장 요청 결과</th>
                    <th className="text-left py-2 pr-4 text-brand-black">AVIF 6종 열기</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {engineRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <span className="font-medium text-brand-black">{row.name}</span>
                        <span className="block text-xs text-brand-subtle">{row.build}</span>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.save}</td>
                      <td className={`py-2 pr-4 whitespace-nowrap ${row.ok ? "" : "font-medium text-brand-accent"}`}>
                        {row.open}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              저장 결과는 돌려받은 파일의 형식 표시와 파일 머리 바이트를 함께 확인한 것. WebKit에는
              OffscreenCanvas가 없어 일반 캔버스만 확인.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              브라우저가 틀리게 동작한 것은 아닙니다. MDN 문서에 따르면 브라우저가 반드시 지원해야 하는 저장
              형식은 PNG뿐이고, 지원하지 않는 형식을 요청받으면 PNG로 저장합니다(
              <a
                href="https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-accent hover:underline"
              >
                MDN HTMLCanvasElement.toBlob
              </a>
              , 2026-11-22 확인). 문제는 그 파일에 .avif 확장자를 붙여 내보내면 이름만 AVIF인 PNG가 된다는
              점입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 변환 도구는 이 경우를 두 번 막습니다. 페이지를 열 때 1픽셀짜리 캔버스로 AVIF 저장을 시험해
              보고, 안 되면 AVIF 버튼을 꺼 둡니다. 변환한 뒤에도 결과물의 형식이 요청한 것과 다르면 내보내지
              않습니다. 측정한 5종에서는 모두 아래처럼 보였습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/avif-guide/format-buttons-chrome.png"
                alt="Chrome 158에서 본 floor05 포맷 변환 도구의 출력 포맷 영역. JPG, PNG, WebP 버튼은 켜져 있고 AVIF 버튼은 회색으로 '미지원'이라고 표시돼 있다"
                width={1248}
                height={264}
                loading="lazy"
                className="block w-full border border-brand-light/30 rounded"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                Chrome 158에서 AVIF 파일을 올린 뒤의 출력 포맷 영역
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 받은 AVIF는 네 곳에서 6종 모두 열렸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              여는 쪽은 사정이 달랐습니다. Chromium, Chrome, Edge, Firefox는 4:2:0, 4:4:4, 품질 100, 10비트, 투명
              배경, 애니메이션 여섯 가지를 모두 원래 크기로 열었습니다. 몇 가지 눈에 띈 점입니다.
            </p>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">투명 배경</strong>: PNG로 바꾸면 투명한 모서리가 그대로
                투명했고, JPG로 바꾸면 그 자리가 흰색으로 채워졌습니다.
              </li>
              <li>
                <strong className="text-brand-black">애니메이션</strong>: 네 곳 모두 첫 프레임만 그렸습니다.
                움직이는 AVIF를 변환하면 첫 장면 한 장이 나옵니다.
              </li>
              <li>
                <strong className="text-brand-black">브라우저 간 차이</strong>: 4:2:0으로 저장된 거북이 AVIF는
                Chromium 계열 세 곳이 서로 같은 픽셀을 냈고(36.22dB), Firefox는 조금 달랐습니다(36.04dB). 4:4:4
                파일은 네 곳의 결과가 같았습니다(48.17dB).
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 AVIF를 도구에서 JPG 90%로 내려받은 용량도 브라우저에 따라 달랐습니다. 417KB 거북이 AVIF가
              Chromium·Chrome·Edge에서는 639KB, Firefox에서는 737KB였습니다. JPG를 만드는 인코더가 브라우저마다
              다르기 때문이고, 그 차이는{" "}
              <Link href="/blog/browser-image-encoders" className="text-brand-accent hover:underline">
                브라우저 인코더 비교 글
              </Link>
              에서 따로 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              Playwright의 WebKit 26.5는 여섯 파일을 하나도 열지 못했습니다. 이 브라우저로 도구에 AVIF를 올리면
              목록에는 올라가지만 변환 단계에서 &ldquo;사진을 열지 못했습니다&rdquo;라는 안내가 나옵니다. 이
              WebKit은 Windows용 빌드라서, 맥이나 아이폰의 실제 사파리가 AVIF를 여는지는 이번 측정으로 말할 수
              없습니다.
            </p>

            <BlogInlineCTA href="/tools/image/convert" label="포맷 변환 →">
              안 열리는 AVIF가 있다면 올려서 JPG나 PNG로 바꿔 보세요. 결과 옆에 원본 용량이 같이 나옵니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. JPG·PNG로 되돌리면 파일이 커진다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              입력은 &lsquo;JPG 90%와 같은 화질의 AVIF&rsquo; 5장입니다(만든 방법은 4번). 이 파일을 변환 도구의
              기본 품질 90%로 되돌렸습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">이미지</th>
                    <th className="text-left py-2 pr-4 text-brand-black">AVIF</th>
                    <th className="text-left py-2 pr-4 text-brand-black">→ JPG 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">→ PNG</th>
                    <th className="text-left py-2 pr-4 text-brand-black">→ WebP 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG의 화질 변화</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {backRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.name}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.avif}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.webp}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.loss}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              Chromium 151 기준. 1KB = 1,000바이트, 1MB = 1,000,000바이트. 괄호는 AVIF 대비 배수. 화질 변화는
              압축 전 기준 대비 PSNR이 AVIF일 때보다 얼마나 내려갔는지.
            </p>

            <div
              className="my-8 space-y-4"
              role="img"
              aria-label="데스크톱 캡처 AVIF 43.3KB를 되돌린 용량: WebP 90% 63.2KB, JPG 90% 117.3KB, PNG 280.0KB"
            >
              {deskBars.map((row) => (
                <div key={row.label}>
                  <div className="text-sm font-medium text-brand-black">{row.label}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-5 flex-1 rounded bg-brand-paper">
                      <div className="h-5 rounded bg-brand-accent" style={{ width: `${(row.kb / 280) * 100}%` }} />
                    </div>
                    <span className="w-20 shrink-0 text-right font-mono text-sm text-brand-black">
                      {row.kb.toFixed(1)}KB
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-brand-mid">
                데스크톱 캡처(1920×1080) AVIF 한 장을 다른 형식으로 되돌린 용량
              </p>
            </div>

            <p className="text-brand-mid leading-relaxed mb-4">
              JPG 90%는 1.53~4.67배였습니다. 사진보다 캡처와 그래픽에서 더 많이 커졌습니다. 화질은 다섯 장 모두
              1.67~2.60dB 내려갔습니다. AVIF에서 한 번, JPG에서 한 번, 손실 압축을 두 번 거쳤기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              화질을 지키려고 JPG 품질을 100%로 올리면 PSNR 하락은 0.01~0.27dB로 줄지만 용량이 AVIF의
              4.19~9.61배가 됩니다. 반대로 용량을 AVIF 수준에 맞추려고 품질을 내리면 화질이 크게 무너집니다.
              데스크톱 캡처는 JPG 품질을 17%까지 내려야 AVIF(43.3KB)보다 커지지 않았고, 그때 PSNR은 48.14dB에서
              33.47dB가 됐습니다. 그래픽은 품질 1%로도 AVIF보다 컸습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              PNG는 AVIF를 연 화면과 픽셀이 완전히 같았습니다. 더 잃는 것은 없지만 6.46~20.95배로 가장
              큽니다. 셋 중에서는 WebP 90%가 1.23~1.97배로 가장 덜 커졌습니다. 받는 쪽이 WebP를 열 수 있다면
              WebP, 어디서나 열려야 하면 JPG, 이후에 편집을 더 할 파일이면 PNG가 맞습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 같은 화질에서 AVIF는 얼마나 작았나
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이 절의 AVIF는 floor05 도구가 아니라 Pillow(libavif·aom)로 만든 파일입니다. 기준 5장을 Chromium
              151에서 JPG 90%로 저장하고, 그 PSNR 이상이 나오는 가장 낮은 AVIF 품질을 찾아 용량을 비교했습니다.
              WebP 90%를 기준으로도 같은 방법으로 맞췄습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">이미지</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">같은 화질의 AVIF</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG 90% 대비</th>
                    <th className="text-left py-2 pr-4 text-brand-black">WebP 90% 대비</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {matchedRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.name}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.avif}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.vsJpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.vsWebp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              AVIF 칸의 첫 숫자는 그 화질에 필요했던 Pillow 품질 값. 마지막 열은 WebP 90%의 PSNR에 맞춘 다른
              AVIF 파일과 WebP 90%를 비교한 값.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              JPG 90%와 견주면 AVIF는 42.2~79.0% 작았습니다. WebP 90%와 견주면 차이가 이미지에 따라 갈렸습니다.
              배경이 흐린 꽃 사진과 단색 그래픽은 40.9%, 41.5% 작았지만, 잔무늬가 많은 거북이 사진과 화면 캡처
              두 장은 11.9~16.0%에 그쳤습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              이 숫자는 이미지 5장, 이 인코더와 이 설정에서 나온 값입니다. 인코더나 속도 설정을 바꾸면 달라질
              수 있고, 모든 이미지에서 AVIF가 가장 작다는 뜻으로 읽으면 안 됩니다. WebP와 JPG를 같은 이미지,
              같은 방법으로 견준 결과는{" "}
              <Link href="/blog/webp-guide" className="text-brand-accent hover:underline">
                WebP 실측 글
              </Link>
              에 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정리: AVIF 파일을 만났을 때</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">상황</th>
                    <th className="text-left py-2 pr-4 text-brand-black">권장</th>
                    <th className="text-left py-2 pr-4 text-brand-black">근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">AVIF를 어디서나 열리게</td>
                    <td className="py-2 pr-4">JPG 90%</td>
                    <td className="py-2 pr-4">용량 1.53~4.67배, 화질 -1.67~-2.60dB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">용량을 덜 늘리고 싶을 때</td>
                    <td className="py-2 pr-4">WebP 90%</td>
                    <td className="py-2 pr-4">1.23~1.97배</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">투명 배경 AVIF, 더 편집할 파일</td>
                    <td className="py-2 pr-4">PNG</td>
                    <td className="py-2 pr-4">픽셀 동일, 투명 유지, 6.46~20.95배</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">움직이는 AVIF</td>
                    <td className="py-2 pr-4">첫 장면만 필요할 때만 변환</td>
                    <td className="py-2 pr-4">4종 모두 첫 프레임만 그림</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">사진을 AVIF로 저장</td>
                    <td className="py-2 pr-4">브라우저 밖의 인코더</td>
                    <td className="py-2 pr-4">5종 모두 PNG로 저장됨</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이번에 재지 않은 것</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>
                맥·아이폰의 실제 사파리, 휴대폰 브라우저, 그리고 사진 앱이나 메신저가 AVIF를 여는지는 확인하지
                않았습니다.
              </li>
              <li>
                PSNR은 픽셀 값의 차이를 재는 지표라 눈으로 느끼는 화질과 꼭 같지는 않습니다. 눈으로 본 비교는
                하지 않았습니다.
              </li>
              <li>
                무손실 AVIF는 다루지 않았습니다. Pillow 품질 100(4:4:4)으로 만든 파일은 열어 보니 59.88dB로,
                픽셀이 기준과 완전히 같지는 않았습니다.
              </li>
              <li>인코딩에 걸리는 시간은 브라우저와 Python의 실행 환경이 달라 비교하지 않았습니다.</li>
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">AVIF를 JPG·PNG·WebP로</h3>
              <p className="text-brand-light mb-6">
                올리면 지금 브라우저가 열 수 있는 파일인지 바로 드러납니다. 열리면 원하는 형식으로 받으면 됩니다.
              </p>
              <Link
                href="/tools/image/convert"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                포맷 변환 도구
              </Link>
            </div>
          </div>
          <BlogExtras slug="avif-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
