import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("browser-image-encoders"),
  title: "같은 '품질 92%'인데 브라우저마다 다를까 - 크롬·사파리 엔진·파이어폭스 실측",
};

const faqs = [
  {
    question: "같은 사이트에서 같은 설정으로 저장해도 브라우저마다 용량이 다른가요?",
    answer:
      "브라우저 안에서 이미지를 저장하는 도구라면 그렇습니다. 같은 1920×1499 사진을 JPG 92%로 저장하니 Chromium·WebKit은 808KB, Firefox는 977KB였습니다. Firefox가 92%에서는 색 정보를 줄이지 않고 저장하기 때문입니다.",
  },
  {
    question: "어느 브라우저가 화질이 가장 좋은가요?",
    answer:
      "JPG 80%와 60%에서는 세 브라우저의 PSNR이 소수점 둘째 자리까지 같았습니다. 92%에서만 Firefox가 1.4dB 높았는데, 그만큼 용량도 21% 컸습니다. 화질 차이라기보다 같은 숫자를 다르게 해석한 차이에 가깝습니다.",
  },
  {
    question: "PNG는 무손실인데 왜 브라우저마다 용량이 다른가요?",
    answer:
      "PNG는 픽셀 값은 그대로 두고 압축을 얼마나 열심히 하느냐만 다릅니다. 같은 사진 PNG가 Chromium 6.39MB, WebKit 4.97MB, Firefox 5.31MB였고, 다시 열어 본 픽셀은 셋 다 원본과 완전히 같았습니다. Chromium이 압축을 덜 하는 대신 빨리 끝냅니다.",
  },
  {
    question: "이 측정을 하면서 사진이 어딘가로 보내졌나요?",
    answer:
      "아닙니다. 세 브라우저 모두 각자의 Canvas 인코더로 같은 기기 안에서 저장하고 다시 열어 비교했습니다. floor05 도구도 같은 인코더를 쓰기 때문에, 도구를 쓸 때 결과가 만들어지는 곳도 바로 그 브라우저입니다.",
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

// 2026-10-15 측정 (원자료: docs/blog-data/browser-encoders-2026-10-15.json)
const photoRows = [
  { fmt: "JPG 92%", chromium: "808KB · 38.92dB", webkit: "808KB · 38.92dB", firefox: "977KB · 40.31dB" },
  { fmt: "JPG 80%", chromium: "473KB · 35.68dB", webkit: "473KB · 35.68dB", firefox: "476KB · 35.68dB" },
  { fmt: "JPG 60%", chromium: "310KB · 33.47dB", webkit: "310KB · 33.47dB", firefox: "314KB · 33.47dB" },
  { fmt: "WebP 80%", chromium: "357KB · 36.33dB", webkit: "357KB · 36.33dB", firefox: "356KB · 36.32dB" },
  { fmt: "PNG", chromium: "6,391KB", webkit: "4,973KB", firefox: "5,309KB" },
];
const shotRows = [
  { fmt: "JPG 92%", chromium: "133KB · 49.26dB", webkit: "133KB · 49.26dB", firefox: "174KB · 49.29dB" },
  { fmt: "JPG 80%", chromium: "99KB · 43.50dB", webkit: "99KB · 43.50dB", firefox: "114KB · 43.50dB" },
  { fmt: "JPG 60%", chromium: "77KB · 39.53dB", webkit: "77KB · 39.53dB", firefox: "91KB · 39.53dB" },
  { fmt: "WebP 80%", chromium: "52KB · 47.11dB", webkit: "52KB · 47.11dB", firefox: "51KB · 47.44dB" },
  { fmt: "PNG", chromium: "176KB", webkit: "118KB", firefox: "122KB" },
];

function ResultTable({ rows }: { rows: typeof photoRows }) {
  return (
    <div className="overflow-x-auto mb-4">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="border-b border-brand-light/40 text-left">
            <th className="py-2 pr-4 text-brand-black">형식</th>
            <th className="py-2 pr-4 text-brand-black">Chromium 151</th>
            <th className="py-2 pr-4 text-brand-black">WebKit 26.5</th>
            <th className="py-2 pr-4 text-brand-black">Firefox 153</th>
          </tr>
        </thead>
        <tbody className="text-brand-mid">
          {rows.map((row) => (
            <tr key={row.fmt} className="border-b border-brand-light/20">
              <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.fmt}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{row.chromium}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{row.webkit}</td>
              <td className="py-2 pr-4 whitespace-nowrap">{row.firefox}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function BrowserImageEncodersPage() {
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
            <span className="text-brand-mid">브라우저별 이미지 저장 비교</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              같은 &lsquo;품질 92%&rsquo;인데 브라우저마다 다를까
            </h1>
            <p className="text-lg text-brand-mid">크롬·사파리 엔진·파이어폭스로 같은 사진을 저장해 봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              floor05의 이미지 도구는 사진을 서버로 보내지 않고, 사용자가 쓰는 브라우저가 직접 저장합니다.
              그러면 같은 사진을 같은 설정으로 저장해도 크롬에서 쓸 때와 파이어폭스에서 쓸 때 결과가 다를 수
              있습니다. 실제로 얼마나 다른지 세 브라우저 엔진으로 재봤습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              짧게 말하면 JPG는 크롬과 사파리 엔진이 바이트 수까지 같았고, 파이어폭스는 92%에서만 따로
              놀았습니다. 그리고 무손실이라는 PNG가 오히려 브라우저마다 가장 크게 달랐습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                브라우저: Playwright로 띄운 Chromium 151(크롬·엣지 엔진), WebKit 26.5(사파리 엔진), Firefox 153.
                모두 같은 Windows PC에서 실행했습니다.
              </li>
              <li>
                원본: ① NASA 공공 도메인 거북이 사진을 1920×1499로 줄인 PNG ② floor05 이미지 압축 페이지를
                1920×1080으로 캡처한 PNG. 무손실 PNG를 원본으로 써서 세 브라우저가 똑같은 픽셀을 받게
                했습니다.
              </li>
              <li>
                각 브라우저의 Canvas <code className="font-mono text-sm">toBlob</code>으로 JPG(92·80·60%),
                WebP(80%), PNG를 저장하고, 다시 열어 원본과 PSNR을 비교했습니다. floor05 도구가 쓰는 것과
                같은 저장 경로입니다.
              </li>
            </ul>
            <p className="text-sm text-brand-light mb-8">
              WebKit은 Playwright가 Windows용으로 빌드한 사파리 엔진이라, Mac·아이폰의 실제 사파리와 세부
              결과가 다를 수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과</h2>
            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-3">사진 (1920×1499)</h3>
            <ResultTable rows={photoRows} />
            <h3 className="text-lg font-semibold text-brand-black mt-8 mb-3">화면 캡처 (1920×1080)</h3>
            <ResultTable rows={shotRows} />
            <p className="text-sm text-brand-light mb-8">
              KB는 1,000바이트 기준. dB는 원본 대비 PSNR이며, PNG는 세 브라우저 모두 원본과 픽셀이 완전히
              같았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 크롬과 사파리 엔진의 JPG는 바이트까지 같았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              JPG 세 단계 모두 Chromium과 WebKit의 결과가 같은 바이트 수, 같은 PSNR이었습니다. 두 엔진이
              같은 JPG 라이브러리를 같은 설정으로 쓰고 있는 것으로 보입니다. WebP도 마찬가지였습니다. 크롬, 엣지,
              (이번 측정의) 사파리 엔진 중 무엇으로 floor05를 열어도 JPG·WebP 결과는 같다고 보면 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 파이어폭스는 92%에서 색을 덜 줄였다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              차이는 파이어폭스의 92%에서 나왔습니다. 사진은 977KB로 Chromium(808KB)보다 21% 컸고, PSNR은
              40.31dB로 1.39dB 높았습니다. 파일 머리를 열어 보니 이유가 보였습니다. Chromium·WebKit은 모든
              품질에서 색 정보를 2×2 픽셀씩 묶어 저장하는데(4:2:0), 파이어폭스는 92%에서는 묶지 않고 픽셀마다
              색을 저장했습니다(4:4:4). 80% 이하에서는 파이어폭스도 4:2:0으로 바뀌었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              80%와 60%에서는 세 브라우저의 PSNR이 소수점 둘째 자리까지 같았습니다. 다만 파이어폭스 파일이
              사진에서 0.5~1.4%, 화면 캡처에서 15~18% 더 컸습니다. 화질은 같은데 용량이 다르니, 같은 화질을
              더 작은 파일에 담는 정리 단계에서 차이가 난 것으로 보입니다.
            </p>

            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              어떤 브라우저든 목표 용량을 넣으면 그 브라우저의 인코더로 용량을 맞춥니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 무손실 PNG가 오히려 가장 크게 달랐다
            </h2>
            <div className="my-8 space-y-4" role="img" aria-label="같은 사진 PNG 용량: Chromium 6,391KB, Firefox 5,309KB, WebKit 4,973KB">
              {[
                { name: "Chromium 151", kb: 6391 },
                { name: "Firefox 153", kb: 5309 },
                { name: "WebKit 26.5", kb: 4973 },
              ].map((row) => (
                <div key={row.name}>
                  <div className="text-sm font-medium text-brand-black">{row.name}</div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-5 flex-1 rounded bg-brand-paper">
                      <div className="h-5 rounded bg-brand-accent" style={{ width: `${(row.kb / 6391) * 100}%` }} />
                    </div>
                    <span className="w-20 shrink-0 text-right font-mono text-sm text-brand-black">
                      {row.kb.toLocaleString()}KB
                    </span>
                  </div>
                </div>
              ))}
              <p className="text-center text-sm text-brand-mid">같은 사진(1920×1499)을 PNG로 저장한 용량</p>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              PNG는 세 브라우저 모두 다시 열었을 때 원본과 픽셀이 하나도 다르지 않았습니다. 그런데 용량은
              Chromium 6.39MB, Firefox 5.31MB, WebKit 4.97MB로 Chromium이 WebKit보다 29% 컸습니다. 화면
              캡처에서도 Chromium 176KB, WebKit 118KB로 1.5배였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              PNG는 같은 픽셀을 얼마나 꼼꼼하게 압축할지 고를 수 있는 형식입니다. Chromium은 저장 시간을 줄이는
              쪽을 택해 사진 PNG를 121ms에 저장했고, WebKit은 544ms를 쓰고 더 작게 만들었습니다. 그래서
              floor05{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              은 PNG를 브라우저 기본 저장에 맡기지 않고 별도 PNG 압축기(UPNG.js)로 다시 압축합니다.
              품질 100%면 무손실로, 그 아래면 색 수를 줄여 용량을 낮춥니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. WebP는 어디서나 비슷했고, 가장 느렸다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              WebP 80%는 세 브라우저에서 용량이 1% 안쪽으로 같았고, 사진에서는 JPG 80%보다 25% 작았습니다.
              대신 저장 시간이 길었습니다. Chromium 기준 사진 한 장을 JPG 80%로 저장하는 데 14ms, WebP 80%는
              222ms였습니다. 사진 한두 장이면 느껴지지 않지만, 수십 장을 한 번에 변환할 때는 차이가 납니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">그래서 어떻게 쓰면 되나</h2>
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
                    <td className="py-2 pr-4 font-medium text-brand-black">용량 상한이 빠듯한 제출</td>
                    <td className="py-2 pr-4">품질 숫자 대신 목표 용량 입력</td>
                    <td className="py-2 pr-4">같은 92%도 브라우저에 따라 808KB와 977KB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">파이어폭스에서 92% 저장</td>
                    <td className="py-2 pr-4">용량이 크면 90% 아래로</td>
                    <td className="py-2 pr-4">92%만 4:4:4로 저장해 21% 커짐</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">PNG 용량이 너무 큼</td>
                    <td className="py-2 pr-4">이미지 압축의 PNG 출력 사용</td>
                    <td className="py-2 pr-4">브라우저 기본 PNG는 엔진에 따라 1.5배 차이</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">여러 장을 WebP로 변환</td>
                    <td className="py-2 pr-4">조금 기다리기</td>
                    <td className="py-2 pr-4">WebP 저장이 JPG보다 약 16배 오래 걸림</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              포맷 자체의 차이가 궁금하다면{" "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측
              </Link>
              을, 품질 숫자에 따른 변화는{" "}
              <Link href="/blog/image-compression-guide" className="text-brand-accent hover:underline">
                이미지 용량 줄이기 실측
              </Link>
              을 함께 보세요.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">쓰는 브라우저가 곧 작업실</h3>
              <p className="text-brand-light mb-6">
                변환과 압축은 지금 이 브라우저의 인코더가 합니다. 숫자 대신 목표 용량으로 맞추면 차이가 사라집니다.
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
          <BlogExtras slug="browser-image-encoders" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
