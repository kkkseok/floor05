import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("webp-guide"),
  title: "WebP 변환 용량 비교 - 화질을 맞춰 5장으로 실측",
};

const faqs = [
  {
    question: "JPG를 WebP로 바꾸면 용량이 얼마나 줄어드나요?",
    answer:
      "화질(PSNR)을 JPG 품질 90%와 같게 맞췄을 때 사진 두 장은 30.2%, 29.3% 작았고, 화면 캡처와 그래픽 세 장은 55.1~64.0% 작았습니다. 사진보다 글자와 단색이 많은 이미지에서 차이가 컸습니다.",
  },
  {
    question: "WebP로 바꿨는데 파일이 더 커졌습니다. 왜 그런가요?",
    answer:
      "이미 낮은 품질로 압축된 JPG를 높은 품질의 WebP로 다시 저장했기 때문입니다. JPG 품질 80%로 저장된 470KB 사진을 WebP 90%로 바꾸니 527KB로 12.0% 커졌습니다. 이 사진은 WebP 품질을 87% 이하로 내려야 원래 파일보다 작아졌습니다.",
  },
  {
    question: "WebP 품질을 100%로 하면 가장 좋은 건가요?",
    answer:
      "100%는 무손실 방식으로 바뀌어 용량이 크게 늡니다. 1920×1080 화면 캡처는 품질 99%에서 87KB였는데 100%에서 395KB가 됐고, 이는 같은 캡처의 PNG(173KB)보다 2.28배 큰 값입니다. 픽셀을 그대로 지켜야 하는 경우가 아니라면 90% 안팎이면 충분합니다.",
  },
  {
    question: "WebP로 바꾸는 동안 사진이 어디로 전송되나요?",
    answer:
      "전송되지 않습니다. 포맷 변환 도구는 고른 파일을 이 탭의 캔버스에 그린 뒤 WebP로 다시 저장할 뿐이고, 올리는 단계가 없습니다. 이번 측정에 쓴 15.78MB 카메라 원본도 같은 방식으로 탭 안에서 5.35MB WebP가 됐습니다.",
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

// 2026-11-22 측정 (Chromium 151, 원자료: docs/blog-data/webp-when-2026-11-22.json)
// matched.<이미지>.jpg90 — JPG 90%의 PSNR 이상을 내는 가장 낮은 WebP 품질
const matchedRows = [
  { name: "사진 · 거북이", size: "1920×1499", jpg: "723KB · 38.20dB", webp: "87% · 504KB · 38.34dB", diff: "-30.2%", pct: 69.8 },
  { name: "사진 · 꽃", size: "1920×1281", jpg: "128KB · 45.20dB", webp: "93% · 90KB · 45.56dB", diff: "-29.3%", pct: 70.7 },
  { name: "화면 캡처 · 데스크톱", size: "1920×1080", jpg: "118KB · 48.09dB", webp: "83% · 53KB · 48.39dB", diff: "-55.1%", pct: 44.9 },
  { name: "화면 캡처 · 휴대폰", size: "1080×2340", jpg: "199KB · 46.75dB", webp: "84% · 73KB · 46.80dB", diff: "-63.4%", pct: 36.6 },
  { name: "그래픽", size: "1200×630", jpg: "17.2KB · 49.49dB", webp: "83% · 6.2KB · 49.60dB", diff: "-64.0%", pct: 36.0 },
];

// reconvertSummary — 이미 JPG로 저장된 파일을 WebP로 다시 변환
const reconvertRows = [
  { input: "거북이 사진 · JPG 60%", before: "308KB", after: "456KB", diff: "+47.7%", limit: "79% 이하", worse: true },
  { input: "거북이 사진 · JPG 80%", before: "470KB", after: "527KB", diff: "+12.0%", limit: "87% 이하", worse: true },
  { input: "거북이 사진 · JPG 90%", before: "723KB", after: "582KB", diff: "-19.5%", limit: "93% 이하", worse: false },
  { input: "꽃 사진 · JPG 80%", before: "78KB", after: "60KB", diff: "-23.2%", limit: "93% 이하", worse: false },
  { input: "데스크톱 캡처 · JPG 80%", before: "95KB", after: "74KB", diff: "-21.7%", limit: "96% 이하", worse: false },
];

// matched.<이미지>.lossless — PNG, WebP 99%, WebP 100%(무손실)
const losslessRows = [
  { name: "데스크톱 캡처", png: "173KB", w99: "87KB", w100: "395KB", ratio: "2.28배" },
  { name: "휴대폰 캡처", png: "246KB", w99: "121KB", w100: "457KB", ratio: "1.86배" },
  { name: "그래픽", png: "28.6KB", w99: "9.8KB", w100: "48.1KB", ratio: "1.68배" },
  { name: "거북이 사진", png: "6.38MB", w99: "1.26MB", w100: "3.47MB", ratio: "0.54배" },
  { name: "꽃 사진", png: "3.81MB", w99: "196KB", w100: "2.19MB", ratio: "0.57배" },
];

// 데스크톱 캡처 한 장의 저장 방식별 용량(KB). sweeps.captureDesk, refs.captureDesk, engines.Firefox.q100
const deskBars = [
  { label: "WebP 90%", kb: 63 },
  { label: "WebP 99%", kb: 87 },
  { label: "PNG", kb: 173 },
  { label: "WebP 100% (무손실)", kb: 395 },
];

export default function WebPGuidePage() {
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
            <span className="text-brand-mid">WebP 변환, 언제 이득일까</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              WebP 변환, 언제 이득일까
            </h1>
            <p className="text-lg text-brand-mid">화질을 맞춰 놓고 잰 용량, 그리고 손해 보는 세 가지 경우</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-22">2026-11-22 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              WebP가 JPG보다 작다는 말은 흔하지만, 품질 숫자만 같게 두고 비교하면 화질이 서로 달라 공정하지
              않습니다. 그래서 이미지 5장을 JPG와 같은 화질이 되도록 맞춘 뒤 용량을 쟀습니다. 사진은 약 30%,
              화면 캡처와 그래픽은 55~64% 작았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              손해를 보는 경우도 셋 나왔습니다. 이미 압축된 JPG를 기본 품질로 바꾸면 12% 커졌고, 품질 100%는
              PNG보다 큰 파일을 만들었고, 세로로 아주 긴 이미지는 아래쪽이 잘렸습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">사진 2장</strong>: NASA 공공 도메인 사진. 잔무늬가 화면
                전체에 깔린 거북이(원본 5522×4312, 15.78MB)와 배경이 흐린 꽃(원본 8192×5464, 9.18MB). 가로
                1920px로 줄인 무손실 이미지를 기준으로 삼았습니다.
              </li>
              <li>
                <strong className="text-brand-black">화면 캡처 2장</strong>: floor05 포맷 변환 페이지를
                데스크톱(1920×1080)과 휴대폰(1080×2340) 크기로 찍은 것
              </li>
              <li>
                <strong className="text-brand-black">그래픽 1장</strong>: floor05 공유 이미지(1200×630), 단색
                바탕에 글자
              </li>
              <li>
                <strong className="text-brand-black">저장 방식</strong>: Chromium 151에서 floor05{" "}
                <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                  포맷 변환 도구
                </Link>
                와 같은 캔버스 저장 경로. JPG와 WebP를 품질 1%부터 100%까지 1% 간격으로 전부 저장했습니다.
              </li>
              <li>
                <strong className="text-brand-black">화질</strong>: 저장 전 픽셀과 비교한 PSNR(dB). 높을수록
                원본에 가깝습니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              측정값이 실제 도구와 같은지도 확인했습니다. 변환 도구 화면에서 내려받은 파일 10개가 측정
              스크립트의 결과와 바이트 단위로 같았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 같은 화질이면 사진은 30%, 캡처는 절반 넘게 작았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              기준은 변환 도구의 기본값인 JPG 품질 90%입니다. 그 PSNR 이상이 나오는 가장 낮은 WebP 품질을 찾아
              두 파일의 용량을 비교했습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">이미지</th>
                    <th className="text-left py-2 pr-4 text-brand-black">JPG 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">같은 화질의 WebP</th>
                    <th className="text-left py-2 pr-4 text-brand-black">용량 차이</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {matchedRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.name}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.webp}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.diff}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              1KB = 1,000바이트. dB는 저장 전 픽셀 대비 PSNR. WebP 칸의 %는 그 화질에 필요했던 품질 값.
            </p>

            <div
              className="my-8 space-y-4"
              role="img"
              aria-label="JPG 90% 용량을 100으로 봤을 때 같은 화질 WebP의 용량: 거북이 사진 69.8, 꽃 사진 70.7, 데스크톱 캡처 44.9, 휴대폰 캡처 36.6, 그래픽 36.0"
            >
              {matchedRows.map((row) => (
                <div key={row.name}>
                  <div className="text-sm font-medium text-brand-black">
                    {row.name} <span className="font-normal text-brand-mid">{row.size}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-4 flex-1 rounded bg-brand-paper">
                      <div className="h-4 rounded bg-brand-light" style={{ width: "100%" }} />
                    </div>
                    <span className="w-24 shrink-0 text-right font-mono text-xs text-brand-mid">JPG 100</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-4 flex-1 rounded bg-brand-paper">
                      <div className="h-4 rounded bg-brand-accent" style={{ width: `${row.pct}%` }} />
                    </div>
                    <span className="w-24 shrink-0 text-right font-mono text-xs text-brand-black">
                      WebP {row.pct.toFixed(1)}
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-brand-mid">
                JPG 90% 용량을 100으로 봤을 때, 같은 화질 WebP의 용량
              </p>
            </div>

            <p className="text-brand-mid leading-relaxed mb-4">
              사진 두 장은 30.2%, 29.3%로 비슷하게 줄었습니다. 화면 캡처와 그래픽은 55.1~64.0%로 차이가 두 배쯤
              컸습니다. 글자 가장자리와 넓은 단색 면은 JPG가 특히 약한 부분이라, 같은 화질을 내려면 JPG 쪽이
              용량을 훨씬 많이 써야 했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              기준을 JPG 80%로 바꿔 다시 맞춰도 순서는 같았습니다. 사진은 31.4%와 38.1%, 나머지 세 장은
              56.9~64.5% 작았습니다. 품질 숫자를 같게 두고 비교한 값은{" "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측 글
              </Link>
              에 따로 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 품질 90%는 JPG와 WebP에서 같은 화질이 아니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              위 표에서 JPG 90%와 같은 화질을 내는 데 필요한 WebP 품질은 이미지에 따라 83%에서 93%까지
              달랐습니다. 캡처와 그래픽은 83~84%면 됐고, 꽃 사진은 93%가 필요했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              꽃 사진을 품질 숫자만 맞춰 90%끼리 비교하면 WebP가 66KB, JPG가 128KB로 48.1% 작아 보입니다. 그런데
              이때 WebP의 PSNR은 44.89dB로 JPG(45.20dB)보다 낮습니다. 화질까지 맞추면 차이는 29.3%로 줄어듭니다.
              &ldquo;WebP로 바꿨더니 절반이 됐다&rdquo;는 결과에는 화질이 조금 내려간 몫이 섞여 있을 수 있습니다.
            </p>

            <BlogInlineCTA href="/tools/image/convert" label="포맷 변환 →">
              가지고 있는 파일을 WebP로 바꿔 보고, 원본과 결과 용량을 나란히 확인해 보세요.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 손해 ① 이미 압축된 JPG는 오히려 커질 수 있다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              실제로 WebP로 바꾸는 파일은 대부분 이미 JPG입니다. 그래서 기준 이미지를 JPG로 한 번 저장한 뒤,
              그 파일을 변환 도구의 기본 품질 90%로 WebP로 바꿔 봤습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">입력 파일</th>
                    <th className="text-left py-2 pr-4 text-brand-black">입력</th>
                    <th className="text-left py-2 pr-4 text-brand-black">WebP 90%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">변화</th>
                    <th className="text-left py-2 pr-4 text-brand-black">작아지는 WebP 품질</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {reconvertRows.map((row) => (
                    <tr key={row.input} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.input}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.before}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.after}</td>
                      <td
                        className={`py-2 pr-4 whitespace-nowrap ${row.worse ? "font-medium text-brand-accent" : ""}`}
                      >
                        {row.diff}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              모두 가로 1920px(캡처는 1920×1080). 마지막 열은 결과가 입력 파일보다 작게 나온 가장 높은 품질.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              잔무늬가 많은 거북이 사진은 JPG 80%로 저장된 470KB 파일이 527KB로 12.0% 커졌고, JPG 60%였던
              308KB 파일은 456KB로 47.7% 커졌습니다. 높은 품질의 WebP가 JPG의 압축 자국까지 그대로 담으려다
              생긴 일로 보입니다. 같은 JPG 80%라도 꽃 사진과 캡처는 23.2%, 21.7% 줄었으니, 무늬가 복잡한 사진일수록
              조심할 일입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질을 내려 용량을 줄이면 화질은 한 번 더 내려갑니다. JPG 80% 거북이 사진을 WebP 80%로 바꾸니
              용량은 339KB로 줄었지만 PSNR도 35.76dB에서 34.16dB로 내려갔습니다. 압축 전 이미지에서 곧바로 만든 WebP
              80%는 352KB에 36.32dB였습니다. 용량은 비슷한데 화질이 2.16dB 다릅니다. WebP는 JPG를 거치지 않은
              원본에서 만드는 편이 낫습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              카메라에서 막 나온 파일은 사정이 다릅니다. 15.78MB 거북이 원본은 크기를 그대로 두고 WebP 90%로
              바꾸니 5.35MB(66.1% 감소), 9.18MB 꽃 원본은 0.90MB(90.1% 감소)가 됐습니다. 두 원본 모두 처음부터 크게
              저장된 파일이라 줄일 여지가 많았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 손해 ② 품질 100%는 PNG보다 큰 파일을 만들었다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 슬라이더를 끝까지 올리면 저장 방식이 바뀝니다. 99%까지는 손실 압축이고, 100%는 다시 열었을
              때 픽셀이 하나도 다르지 않은 무손실이었습니다. 용량은 그 한 칸에서 2.7~11.1배로 뛰었습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40">
                    <th className="text-left py-2 pr-4 text-brand-black">이미지</th>
                    <th className="text-left py-2 pr-4 text-brand-black">PNG</th>
                    <th className="text-left py-2 pr-4 text-brand-black">WebP 99%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">WebP 100%</th>
                    <th className="text-left py-2 pr-4 text-brand-black">PNG 대비</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {losslessRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.name}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.w99}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.w100}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              Chromium 151 기준. PNG와 WebP 100%는 둘 다 무손실. 1MB = 1,000,000바이트.
            </p>

            <div
              className="my-8 space-y-4"
              role="img"
              aria-label="데스크톱 캡처 한 장의 용량: WebP 90% 63KB, WebP 99% 87KB, PNG 173KB, WebP 100% 무손실 395KB"
            >
              {deskBars.map((row) => (
                <div key={row.label}>
                  <div className="text-sm font-medium text-brand-black">{row.label}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-5 flex-1 rounded bg-brand-paper">
                      <div className="h-5 rounded bg-brand-accent" style={{ width: `${(row.kb / 395) * 100}%` }} />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-sm text-brand-black">{row.kb}KB</span>
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-brand-mid">
                데스크톱 캡처(1920×1080) 한 장을 저장 방식만 바꿔 저장한 용량
              </p>
            </div>

            <p className="text-brand-mid leading-relaxed mb-4">
              캡처와 그래픽에서는 무손실 WebP가 같은 무손실인 PNG보다 1.68~2.28배 컸습니다. 캡처를 픽셀 그대로
              보관하려면 PNG로 두는 편이 작았습니다. 사진은 반대로 PNG의 0.54~0.57배였지만, 그래도 WebP 99%의
              2.7~11.1배입니다. 15.78MB 카메라 원본은 품질 100%에서 25.85MB가 되어 원본보다 커졌습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              이 결과는 브라우저에 따라 달랐습니다. 같은 데스크톱 캡처를 Firefox 153에서 품질 100%로 저장하니
              40KB였고, Chromium과 WebKit은 395KB로 9.9배였습니다. 세 엔진 모두 결과는 무손실이었습니다. 크롬처럼
              Chromium을 쓰는 브라우저에서 변환한다면 품질 100%는 피하는 것이 안전합니다. 엔진별 차이를 더 넓게 잰 결과는{" "}
              <Link href="/blog/browser-image-encoders" className="text-brand-accent hover:underline">
                브라우저 인코더 비교 글
              </Link>
              에 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 손해 ③ 세로 16,384px부터는 아래쪽이 잘렸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              측정하다 찾은 문제입니다. 휴대폰 캡처를 세로로 이어 붙여 긴 이미지를 만들고 WebP로 저장했습니다.
              세로 16,383px까지는 그대로 저장됐습니다. 16,384px와 20,000px 이미지는 오류 없이 저장됐는데, 다시
              열어 보니 둘 다 1080×16383이었습니다. 20,000px 이미지는 아래 3,617px가 사라진 것입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 변환 도구 화면에서 같은 파일로 다시 해 봐도 결과는 같았고, 이번 측정 시점의 도구는 잘렸다는
              안내를 하지 않았습니다. 같은 이미지를 JPG와 PNG로 저장하면 1080×20000 그대로였습니다. WebKit과
              Firefox는 16,384px부터 WebP 저장 자체가 되지 않았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              긴 대화나 웹페이지 전체를 이어 붙인 캡처는 이 길이를 넘기 쉽습니다. 그런 이미지는 JPG나 PNG로
              저장하거나, 나눠서 WebP로 바꾸세요. 가로 방향 한계는 이번에 재지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정리: WebP로 바꿀까 말까</h2>
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
                    <td className="py-2 pr-4 font-medium text-brand-black">카메라 원본을 웹에 올릴 때</td>
                    <td className="py-2 pr-4">WebP 90%</td>
                    <td className="py-2 pr-4">15.78MB → 5.35MB, 9.18MB → 0.90MB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">화면 캡처·그래픽을 가볍게</td>
                    <td className="py-2 pr-4">WebP 83~90%</td>
                    <td className="py-2 pr-4">같은 화질에서 JPG보다 55.1~64.0% 작음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">이미 작게 압축된 JPG 사진</td>
                    <td className="py-2 pr-4">그대로 두거나 품질을 낮춰서</td>
                    <td className="py-2 pr-4">JPG 80% 470KB → WebP 90% 527KB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">캡처를 픽셀 그대로 보관</td>
                    <td className="py-2 pr-4">PNG</td>
                    <td className="py-2 pr-4">무손실 WebP 395KB, PNG 173KB</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">세로 16,384px 이상 긴 이미지</td>
                    <td className="py-2 pr-4">JPG 또는 PNG</td>
                    <td className="py-2 pr-4">WebP는 16,383px에서 잘림</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이번에 재지 않은 것</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>
                PSNR은 픽셀 값의 차이를 재는 지표라 눈으로 느끼는 화질과 꼭 같지는 않습니다. 눈으로 본 비교는 하지
                않았습니다.
              </li>
              <li>
                투명 배경이 있는 이미지는{" "}
                <Link href="/blog/transparent-background" className="text-brand-accent hover:underline">
                  투명 배경 실측 글
                </Link>
                에서 다뤘습니다.
              </li>
              <li>움직이는 WebP, 받는 쪽 프로그램이 WebP를 여는지는 측정하지 않았습니다.</li>
              <li>WebKit은 Playwright의 Windows용 빌드라 실제 사파리와 다를 수 있습니다.</li>
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">바꾸기 전과 후를 숫자로 확인하기</h3>
              <p className="text-brand-light mb-6">
                변환 결과 옆에 원본 용량이 함께 표시됩니다. 커졌다면 품질을 내려 다시 변환하면 됩니다.
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
          <BlogExtras slug="webp-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
