import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("favicon-browser-requests"),
  title: "파비콘 파일, 브라우저는 실제로 무엇을 받아 갈까 - 요청 기록 실측",
};

const faqs = [
  {
    question: "favicon.ico 하나만 있어도 되나요?",
    answer:
      "탭 아이콘만 놓고 보면 그렇습니다. 아이콘 태그가 없는 페이지에서도 Chromium과 Firefox는 사이트 맨 위의 /favicon.ico를 찾아 받았습니다. 다만 홈 화면에 추가할 때 쓰는 애플 터치 아이콘이나 안드로이드용 아이콘은 이번에 측정하지 못했으니, 그 용도라면 PNG 세트도 함께 두세요.",
  },
  {
    question: "파비콘 PNG를 여러 개 넣으면 사이트가 느려지나요?",
    answer:
      "브라우저가 전부 받지는 않았습니다. Chromium은 스니펫이 있어도 7.8KB짜리 favicon.ico 하나만 받았습니다. Firefox는 16px PNG(0.7KB)와 180px 애플 터치 아이콘(63.7KB)을 받았으니, 애플 터치 아이콘 용량은 작게 유지하는 편이 좋습니다.",
  },
  {
    question: "큰 로고를 16px로 줄이면 왜 깨지나요?",
    answer:
      "한 번에 크게 줄이면 원본 픽셀 대부분을 건너뛰기 때문입니다. 1024px 로고를 16px로 한 번에 줄이니 세 브라우저 모두 PSNR 16dB대로, 없던 줄무늬가 생겼습니다. 절반씩 나눠 줄이면 Chromium 50.7dB, Firefox 44.3dB로 깨끗해졌고, floor05 파비콘 만들기는 지금 이 방식을 씁니다.",
  },
  {
    question: "로고 파일이 외부 서버로 보내지나요?",
    answer:
      "보내지지 않습니다. 로고를 여섯 가지 크기로 다시 그리고 favicon.ico로 묶어 ZIP을 만드는 일까지 모두 이 탭 안의 캔버스와 스크립트가 처리합니다. 서버가 하는 일은 도구 페이지를 보여주는 것뿐입니다.",
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

// 2026-10-15 측정 (원자료: docs/blog-data/favicon-2026-10-15.json)
const requestRows = [
  { engine: "Chromium 151", snippet: "favicon.ico", none: "favicon.ico" },
  { engine: "Firefox 153", snippet: "favicon-16x16.png, apple-touch-icon.png", none: "favicon.ico" },
  { engine: "WebKit 26.5 (Windows 빌드)", snippet: "site.webmanifest만", none: "없음" },
];
const sizeRows = [
  { file: "favicon.ico (16·32·48 묶음)", kb: "7.8KB" },
  { file: "favicon-16x16.png", kb: "0.7KB" },
  { file: "favicon-32x32.png", kb: "2.1KB" },
  { file: "apple-touch-icon.png (180px)", kb: "63.7KB" },
  { file: "android-chrome-192x192.png", kb: "55.1KB" },
  { file: "android-chrome-512x512.png", kb: "158.9KB" },
];
const psnrRows = [
  { engine: "Chromium 151", before: "16.3 / 17.1dB", after: "50.7 / 51.1dB" },
  { engine: "Firefox 153", before: "16.3 / 16.1dB", after: "44.3 / 45.3dB" },
  { engine: "WebKit 26.5", before: "16.3 / 16.1dB", after: "32.6 / 33.3dB" },
];

export default function FaviconBrowserRequestsPage() {
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
            <span className="text-brand-mid">파비콘 요청 실측</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              파비콘 파일, 브라우저는 실제로 무엇을 받아 갈까
            </h1>
            <p className="text-lg text-brand-mid">여섯 개를 만들어 올리고 요청을 기록했습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              파비콘 생성기는 보통 favicon.ico, 16·32px PNG, 애플 터치 아이콘, 안드로이드용 192·512px PNG,
              매니페스트까지 한 묶음을 줍니다. floor05 파비콘 만들기도 그렇습니다. 그런데 브라우저가 이걸 다
              받아 가는지는 직접 확인해 본 적이 없었습니다. 그래서 파일을 그대로 올린 테스트 사이트를 만들고,
              브라우저별로 어떤 파일을 요청하는지 기록했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              확인하는 김에 아이콘 화질도 쟀습니다. 그러다 floor05가 큰 로고를 16px로 줄일 때 없던 줄무늬를
              만들고 있다는 것을 발견했고, 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                로고: 측정용으로 직접 그린 1024×1024 PNG. 굵은 글자 &lsquo;05&rsquo;에 얇은 동심원과 가는 사선을
                넣어, 작게 줄일 때 깨짐이 드러나게 했습니다.
              </li>
              <li>
                파일: 이 로고를 floor05{" "}
                <Link href="/tools/image/favicon" className="text-brand-accent hover:underline">
                  파비콘 만들기
                </Link>
                에 넣어 받은 ZIP을 풀어 로컬 서버 맨 위 경로에 그대로 올렸습니다.
              </li>
              <li>
                페이지 두 가지: ZIP에 들어 있는 head-snippet.html의 태그 5줄을 넣은 페이지, 아이콘 태그가 하나도
                없는 페이지. 각각 새 창으로 열고 3초 동안 서버에 들어온 요청을 기록했습니다.
              </li>
              <li>
                브라우저: Chromium 151, Firefox 153, WebKit 26.5(Windows용 사파리 엔진 빌드). 같은 측정을 두 번 해
                결과가 같은지 확인했습니다.
              </li>
            </ul>
            <p className="text-sm text-brand-light mb-8">
              Chromium은 Playwright 기본 headless 셸이 파비콘을 받지 않아 전체 브라우저로 측정했습니다. 아이폰·안드로이드
              홈 화면 추가와 실제 사파리는 이번에 측정하지 못했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과: 받아 간 파일</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">브라우저</th>
                    <th className="py-2 pr-4 text-brand-black">태그 5줄을 넣은 페이지</th>
                    <th className="py-2 pr-4 text-brand-black">태그 없는 페이지</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {requestRows.map((row) => (
                    <tr key={row.engine} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.engine}</td>
                      <td className="py-2 pr-4">{row.snippet}</td>
                      <td className="py-2 pr-4">{row.none}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">두 번 측정해 결과가 같았습니다.</p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 크롬 엔진은 favicon.ico 하나만 받았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              Chromium은 태그가 있든 없든 favicon.ico(7.8KB) 하나만 받았습니다. 스니펫 첫 줄이 favicon.ico에
              sizes=&quot;any&quot;를 붙여 두었고, 그 안에 16·32·48px가 함께 들어 있으니 PNG를 따로 받을 이유가
              없었던 것으로 보입니다. 크롬·엣지 사용자에게는 favicon.ico 한 파일이 전부인 셈입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 파이어폭스는 180px 애플 터치 아이콘까지 받았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              Firefox는 태그가 있는 페이지에서 16px PNG와 함께 apple-touch-icon.png를 받았습니다. 이름은 아이폰용이지만
              데스크톱 Firefox가 실제로 내려받았고, 이 파일이 63.7KB로 세트에서 512px 아이콘 다음으로 큽니다. 둘을 합치면 페이지 하나
              열 때 아이콘에 64.4KB를 쓴 셈입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">파일 (측정 로고 기준)</th>
                    <th className="py-2 pr-4 text-brand-black">크기</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {sizeRows.map((row) => (
                    <tr key={row.file} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4">{row.file}</td>
                      <td className="py-2 pr-4">{row.kb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              측정 로고는 일부러 잔무늬를 많이 넣어서 PNG 용량이 큰 편입니다. PNG는 같은 색 면이 넓을수록 작아지므로
              단순한 로고라면 이보다 가벼워집니다(
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측
              </Link>
              의 그래픽 이미지 참고). 그래도 애플 터치 아이콘이 데스크톱에서도 쓰인다는 것은, 이 파일을 큰 사진으로 두지 말고
              단순한 로고로 만들 이유가 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 태그가 없어도 /favicon.ico는 찾는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              아이콘 태그가 하나도 없는 페이지에서도 Chromium과 Firefox는 둘 다 사이트 맨 위의 /favicon.ico를
              요청했습니다. head를 고치기 어려운 상황이라면 favicon.ico를 루트에 두는 것만으로 탭 아이콘은
              해결됩니다. 반대로 태그를 넣었다면 그 경로에 실제 파일이 있는지 꼭 확인하세요. 없는 파일을 가리키면
              브라우저가 받으려다 404를 만납니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              WebKit(Windows 빌드)은 매니페스트만 받고 아이콘은 받지 않았습니다. 이 빌드는 탭 아이콘을 표시하지 않는
              것으로 보여, 실제 사파리의 동작으로 해석하지 않았습니다.
            </p>

            <BlogInlineCTA href="/tools/image/favicon" label="파비콘 만들기 →">
              로고 한 장으로 favicon.ico와 PNG 세트, 매니페스트, 태그 5줄까지 ZIP으로 받습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 측정하다 고친 것: 16px로 줄이면 생기던 줄무늬
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 파비콘 만들기는 1024px 로고를 16px로 한 번에 줄이고 있었습니다. 한 번에 64분의 1로 줄이면
              원본 픽셀 대부분을 건너뛰어, 얇은 선이 끊기거나 없던 무늬가 생깁니다. Pillow의 면적 평균 축소를
              기준으로 비교했습니다(왼쪽 16px / 오른쪽 32px).
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">브라우저</th>
                    <th className="py-2 pr-4 text-brand-black">이전: 한 번에 축소</th>
                    <th className="py-2 pr-4 text-brand-black">지금: 절반씩 축소</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {psnrRows.map((row) => (
                    <tr key={row.engine} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.engine}</td>
                      <td className="py-2 pr-4">{row.before}</td>
                      <td className="py-2 pr-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <figure className="my-8">
              <img
                src="/images/blog/favicon-browser-requests/downscale-compare.png"
                alt="16px와 32px 파비콘을 이전 방식, 지금 방식, 면적 평균 기준으로 나란히 확대한 그림. 이전 방식에는 없던 줄무늬가 생겼다"
                width={656}
                height={474}
                loading="lazy"
                className="block w-full max-w-xl mx-auto border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                Chromium 결과를 확대. 이전 방식은 사선과 동심원이 엉뚱한 무늬로 바뀌었습니다.
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              브라우저에 &lsquo;고품질로 줄여라&rsquo;고 지정하는 설정(imageSmoothingQuality)도 시험했지만 Chromium에서만
              효과가 있었고 Firefox와 WebKit은 그대로였습니다. 그래서 브라우저에 맡기지 않고 절반씩 여러 번 줄이도록
              바꿨습니다. 매 단계가 픽셀 둘을 하나로 평균하는 일이 되어 세 브라우저 모두에서 깨끗해졌습니다. 같은 사이트,
              같은 로고라도 쓰는 브라우저에 따라 결과 숫자가 다른 이유이기도 합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 파비콘 준비</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">favicon.ico는 반드시 루트에</td>
                    <td className="py-2 pr-4">태그가 없어도 Chromium·Firefox가 /favicon.ico를 요청</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">ico 안에 16·32·48px를 함께</td>
                    <td className="py-2 pr-4">Chromium은 ico 하나만 받고 PNG는 받지 않음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">애플 터치 아이콘은 가볍게</td>
                    <td className="py-2 pr-4">데스크톱 Firefox도 받아 감(측정 로고 63.7KB)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">작은 크기는 단순한 로고로</td>
                    <td className="py-2 pr-4">잔무늬는 16px에서 사라지거나 엉뚱한 무늬가 됨</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              로고 배경을 투명하게 두고 싶다면{" "}
              <Link href="/blog/transparent-background" className="text-brand-accent hover:underline">
                투명 배경 이미지
              </Link>
              를 먼저 확인하세요. 파비콘 만들기는 투명 PNG를 그대로 받아 투명을 유지합니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">로고 한 장으로 파비콘 세트</h3>
              <p className="text-brand-light mb-6">
                작은 크기까지 깨지지 않게 줄여 favicon.ico와 PNG 세트, 태그 5줄을 한 번에 만듭니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/favicon"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  파비콘 만들기
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
          <BlogExtras slug="favicon-browser-requests" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
