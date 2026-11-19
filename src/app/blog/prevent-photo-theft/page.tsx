import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("prevent-photo-theft"),
  title: "사진 도용 막는 법 - 올리는 크기별로 재본 결과",
};

const faqs = [
  {
    question: "사진을 작게 올리면 도용을 막을 수 있나요?",
    answer:
      "막지는 못합니다. 올린 파일은 누구나 그대로 가져갈 수 있습니다. 달라지는 것은 가져간 파일의 쓸모입니다. 2,381만 화소 사진을 긴 변 1280px로 줄여 올리니 원본 픽셀의 5.4%만 나갔고, 그 파일을 다시 원본 크기로 키워 원본과 비교하니 PSNR이 28.0dB였습니다.",
  },
  {
    question: "몇 px로 줄여 올리는 게 좋은가요?",
    answer:
      "잰 값으로 고르면 됩니다. 긴 변 1920px는 803KB에 다시 키웠을 때 31.0dB, 1280px는 364KB에 28.0dB, 800px는 153KB에 25.5dB였습니다. 300ppi로 인쇄한다고 계산하면 가로가 각각 16.3cm, 10.8cm, 6.8cm입니다.",
  },
  {
    question: "크기를 줄여도 사진 속 촬영자·저작권 정보는 남나요?",
    answer:
      "남지 않았습니다. 원본에는 촬영자 이름과 저작권 문구가 든 EXIF·XMP·IPTC가 45.9KB 있었는데, 줄여서 저장한 파일 8개 모두 색 정보 등 492바이트만 남았습니다. 출처는 파일 속이 아니라 화면에 보이는 곳에 적어야 합니다.",
  },
  {
    question: "줄이는 동안 원본이 다른 곳으로 나가지는 않나요?",
    answer:
      "나가지 않습니다. floor05 리사이즈는 사진을 이 브라우저의 캔버스에 그려 줄이고, 결과 파일도 같은 탭에서 만들어 바로 내려받게 합니다. 2,381만 화소 원본은 기기에 그대로 있고, 밖으로 나가는 것은 내가 직접 올리는 줄인 파일뿐입니다.",
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

// 2026-11-19 측정 (Chromium 151, 원자료: docs/blog-data/upload-size-2026-11-19.json → photos.tortoise.rows)
// pct = 줄인 픽셀 수 ÷ 원본 픽셀 수, print = 가로 px ÷ 300 × 2.54
const sizeRows = [
  { long: "원본", dims: "5522×4312", size: "15.78MB", pct: 100, print: "46.8cm" },
  { long: "2560px", dims: "2560×1999", size: "1.36MB", pct: 21.5, print: "21.7cm" },
  { long: "1920px", dims: "1920×1499", size: "803KB", pct: 12.1, print: "16.3cm" },
  { long: "1280px", dims: "1280×1000", size: "364KB", pct: 5.4, print: "10.8cm" },
  { long: "800px", dims: "800×625", size: "153KB", pct: 2.1, print: "6.8cm" },
];

// restoredPsnrBrowserHigh (거북이 / 꽃), regionPsnrBrowserHigh (꽃 부분)
const restoreRows = [
  { long: "크기 그대로 재저장", tortoise: "40.6dB", flower: "47.1dB", flowerSubject: "46.7dB" },
  { long: "2560px", tortoise: "32.9dB", flower: "43.8dB", flowerSubject: "41.3dB" },
  { long: "1920px", tortoise: "31.0dB", flower: "42.8dB", flowerSubject: "39.5dB" },
  { long: "1280px", tortoise: "28.0dB", flower: "41.1dB", flowerSubject: "36.9dB" },
  { long: "800px", tortoise: "25.5dB", flower: "38.5dB", flowerSubject: "33.6dB" },
];

export default function PreventPhotoTheftPage() {
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
            <span className="text-brand-mid">사진 도용 막기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 도용 막는 법
            </h1>
            <p className="text-lg text-brand-mid">작게 올린 사진은 가져가도 얼마나 못 쓰는지 쟀습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-19">2026-11-19 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              화면에 보이는 사진을 못 가져가게 할 방법은 없습니다. 할 수 있는 일은 가져가도 쓸모가 적은 파일을 올리는
              것입니다. 2,381만 화소 사진을 긴 변 1280px로 줄여 올리면 원본 픽셀의 5.4%만 밖으로 나갑니다. 그 파일을
              다시 원본 크기로 키워 봐도 원본과의 거리는 PSNR 28.0dB에서 좁혀지지 않았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              재다 보니 반갑지 않은 것도 하나 나왔습니다. 사진을 줄이는 순간 파일 안에 적혀 있던 촬영자 이름과
              저작권 문구도 함께 사라집니다. 사진 위에 표시를 남기는 방법은{" "}
              <Link href="/blog/image-watermark-guide" className="text-brand-accent hover:underline">
                워터마크 글
              </Link>
              에서 따로 다루고, 여기서는 올리는 크기와 파일 속 정보만 봅니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>
                <strong className="text-brand-black">사진</strong>: NASA 공공 도메인 두 장. 자갈 바닥 위 거북이
                (5522×4312, 15.78MB)와 배경이 흐린 꽃(8192×5464, 9.18MB)
              </li>
              <li>
                <strong className="text-brand-black">줄이기</strong>: floor05{" "}
                <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                  이미지 리사이즈
                </Link>
                와 같은 코드로 긴 변을 2560·1920·1280·800px로 줄여 JPG 품질 92%(도구 고정값)로 저장했습니다. 도구에서 직접 내려받은
                파일 8개와 바이트 단위로 같은지도 확인했습니다.
              </li>
              <li>
                <strong className="text-brand-black">되돌리기</strong>: 가져간 사람이 할 법한 대로, 줄인 파일을
                원본 크기까지 다시 키웠습니다(Chromium 151 캔버스, 고품질 보간).
              </li>
              <li>
                <strong className="text-brand-black">PSNR 기준</strong>: 다시 키운 사진을 원본 픽셀과 비교했습니다.
                숫자가 낮을수록 원본에서 멀다는 뜻입니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 긴 변 1280px로 올리면 원본 픽셀의 5.4%만 나간다
            </h2>
            <div className="my-6 space-y-3">
              {sizeRows.map((row, i) => (
                <div key={row.long}>
                  <div className="text-sm font-medium text-brand-black">
                    {row.long} <span className="font-normal text-brand-subtle">{row.dims}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="h-5 flex-1 rounded bg-brand-paper">
                      <div
                        className={`h-5 rounded ${i === 0 ? "bg-brand-light" : "bg-brand-accent"}`}
                        style={{ width: `${row.pct}%` }}
                      />
                    </div>
                    <span className="w-16 shrink-0 text-right font-mono text-sm text-brand-black">{row.pct}%</span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-brand-subtle mb-6">막대는 원본 대비 픽셀 수(거북이 사진)</p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">올린 크기</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">파일 용량</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">픽셀 수</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">300ppi 인쇄 가로</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {sizeRows.map((row) => (
                    <tr key={row.long} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.long}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.size}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.pct}%</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.print}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              1KB=1,000B. 인쇄 가로는 가로 픽셀 수를 300으로 나눠 cm로 바꾼 계산값입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              길이를 4분의 1로 줄이면 픽셀은 16분의 1이 됩니다. 긴 변 1280px는 원본 길이의 4.3분의 1이라, 남는
              픽셀이 5.4%입니다. 300ppi로 찍는다고 계산하면 가로 10.8cm가 나옵니다. 원본은 같은 기준으로 46.8cm입니다.
              파일도 15.78MB에서 364KB로 줄어 올리기 가볍습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">2. 다시 키워도 돌아오지 않는다</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              작은 파일을 가져가서 크게 키우면 되지 않을까요. 키워 봤습니다. 거북이 사진은 긴 변 1920px로 올린
              것이 31.0dB, 1280px가 28.0dB, 800px가 25.5dB였습니다. 크기를 그대로 두고 다시 저장만 했을 때는
              40.6dB였으니, 떨어진 만큼이 줄이면서 버려진 세부입니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/prevent-photo-theft/restore-crops.png"
                alt="거북이 눈 주변을 원본, 긴 변 1920px, 1280px, 800px로 올린 뒤 다시 원본 크기로 키운 것끼리 비교한 그림. 작게 올린 것일수록 비늘 무늬가 뭉개진다"
                width={810}
                height={910}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                원본 픽셀 200×200 영역을 2배로 확대. 줄여 올린 세 장은 원본 크기로 다시 키운 뒤 같은 자리를 잘랐습니다
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 사진을 원본 크기 그대로 JPG 품질 20%로 저장했을 때가 32.4dB였습니다(
              <Link href="/blog/image-compression-guide" className="text-brand-accent hover:underline">
                이미지 용량 줄이기 실측
              </Link>
              ). 1920px로 올린 사진을 다시 키운 것은 그보다도 원본에서 멉니다. 눈 주변 비늘은 1920px에서 이미
              윤곽만 남고, 800px에서는 눈이 어디인지만 알 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확대 방식을 바꿔 Pillow의 Lanczos 필터로 키우면 거북이 사진은 0.6~1.0dB 높게 나왔지만 순서는 같았습니다. 없는
              세부를 그려 넣는 AI 확대 도구는 이번에 재지 않았습니다.
            </p>

            <BlogInlineCTA href="/tools/image/resize" label="이미지 리사이즈 →">
              너비만 넣으면 비율은 따라옵니다. 여러 장을 한 번에 줄여 ZIP으로 받을 수 있습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 배경이 흐린 사진은 줄여도 덜 잃는다
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">올린 크기</th>
                    <th className="py-2 pr-4 text-brand-black">거북이</th>
                    <th className="py-2 pr-4 text-brand-black">꽃 (전체)</th>
                    <th className="py-2 pr-4 text-brand-black">꽃 (꽃 부분만)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {restoreRows.map((row) => (
                    <tr key={row.long} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.long}</td>
                      <td className="py-2 pr-4">{row.tortoise}</td>
                      <td className="py-2 pr-4">{row.flower}</td>
                      <td className="py-2 pr-4">{row.flowerSubject}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              다시 원본 크기로 키운 뒤 원본과 비교한 PSNR. &lsquo;꽃 부분만&rsquo;은 꽃이 있는 3480×3080 영역만 잰
              값입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              꽃 사진은 800px까지 줄였다가 키워도 38.5dB였습니다. 거북이 사진을 2560px로 올렸을 때(32.9dB)보다도
              높습니다. 화면 대부분이 흐린 초록 배경이라 줄여도 잃을 것이 적기 때문입니다. 초점이 맞은 꽃
              부분만 재면 33.6dB로 내려가지만, 그래도 거북이의 25.5dB보다 한참 높습니다. 배경을 날려 찍은 사진은
              크기를 줄이는 것만으로는 덜 지켜진다는 뜻입니다. 이런 사진이라면 워터마크를 같이 쓰는 쪽이 맞습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 줄이면 파일 속 이름표도 사라진다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              거북이 원본의 EXIF에는 촬영자 &lsquo;NASA/Ben Smegelsky&rsquo;와 저작권 안내 문구가 적혀 있습니다.
              EXIF·XMP·IPTC를 합치면 45.9KB입니다. 줄여서 저장한 파일을 열어 보니 네 가지 크기 모두 이 정보가
              하나도 없었습니다. 남은 것은 JFIF 머리말 18바이트와 색 프로파일 474바이트, 합쳐 492바이트뿐입니다. 꽃
              사진도 같았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              브라우저가 사진을 캔버스에 그렸다가 새 파일로 저장하면 픽셀만 옮겨지기 때문입니다. 위치나 기기 정보가
              빠지는 것은 좋은 일이지만(
              <Link href="/blog/exif-removal-guide" className="text-brand-accent hover:underline">
                EXIF 실측
              </Link>
              ), 내 이름도 같이 빠집니다. 그러니 출처를 파일 속 정보에 맡길 수는 없습니다. 내가 올리기 전에 한 번
              줄이는 것만으로 지워지는 정보라면, 가져간 사람이 같은 식으로 다시 저장할 때도 지워집니다. 이름은 캡션이나 본문처럼
              눈에 보이는 곳에 적고, 촬영 정보가 그대로 든 원본은 올리지 말고 보관해 두세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이 글에서 다루지 않은 것</h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              SNS나 중고거래 앱이 올린 사진을 다시 압축하는 정도, 내 사진이 어디에 쓰였는지 찾는 방법, 도용된 뒤의
              신고와 법적 절차는 직접 잴 수 없어 쓰지 않았습니다. 측정은 Chromium 한 가지 브라우저, 사진 두 장으로
              했습니다. 사진이 다르면 숫자도 달라집니다. 3번에서 본 것처럼 꽤 많이 달라집니다.
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
                    <td className="py-2 pr-4 font-medium text-brand-black">블로그·SNS에 보여주기만 할 때</td>
                    <td className="py-2 pr-4">긴 변 1280px 안팎</td>
                    <td className="py-2 pr-4">픽셀 5.4%, 다시 키워도 28.0dB, 364KB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">크게 보여줘야 하는 작품</td>
                    <td className="py-2 pr-4">긴 변 1920px</td>
                    <td className="py-2 pr-4">픽셀 12.1%, 다시 키우면 31.0dB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">배경이 흐린 사진</td>
                    <td className="py-2 pr-4">줄이기에 워터마크를 더한다</td>
                    <td className="py-2 pr-4">800px로 줄여도 38.5dB</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">출처 남기기</td>
                    <td className="py-2 pr-4">파일 속이 아니라 보이는 곳에</td>
                    <td className="py-2 pr-4">45.9KB 정보가 492바이트로</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              줄여 올리는 것은 가져간 파일의 쓸모를 줄일 뿐, 가져가는 것 자체를 막지는 않습니다. 사진 위에 표시를
              남기는 쪽은{" "}
              <Link href="/blog/image-watermark-guide" className="text-brand-accent hover:underline">
                모서리 워터마크와 전체 반복을 잘라 본 실측
              </Link>
              에 있습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">원본은 두고, 줄인 것만 올리기</h3>
              <p className="text-brand-light mb-6">긴 변을 정해 줄이고, 필요하면 표시를 얹으세요.</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 리사이즈
                </Link>
                <Link
                  href="/tools/image/watermark"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  워터마크 넣기
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="prevent-photo-theft" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
