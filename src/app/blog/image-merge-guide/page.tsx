import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-merge-guide"),
  title: "캡처·사진 합치기 - 몇 장까지, 몇 MB, PNG냐 JPG냐 실측",
};

const faqs = [
  {
    question: "휴대폰 캡처를 몇 장까지 한 장으로 이어 붙일 수 있나요?",
    answer:
      "1080×2340 캡처를 세로로 쌓아 보니 Chromium(크롬·엣지)과 Firefox는 28장, 높이 65,520px까지 저장됐습니다. JPG 형식은 한 변이 65,535px를 넘을 수 없습니다. floor05는 한 번에 10장(모바일 5장)까지 받으므로 일반 캡처라면 한계에 닿지 않습니다.",
  },
  {
    question: "캡처를 합칠 때 PNG와 JPG 중 무엇이 좋나요?",
    answer:
      "글자가 많은 캡처는 PNG를 권합니다. 캡처 5장을 합친 결과가 PNG 1.32MB, JPG 1.14MB로 15% 차이였고, PNG는 글자를 원본 그대로 남깁니다. floor05는 PNG만 올리면 처음부터 PNG로 저장하도록 바뀌었습니다.",
  },
  {
    question: "크기가 다른 사진과 캡처를 합치면 어떻게 되나요?",
    answer:
      "'너비 맞추기'를 고르면 좁은 쪽이 넓은 쪽 폭에 맞춰 확대됩니다. 1920px 사진과 1080px 캡처를 합치니 캡처가 1.78배 커지면서 결과 높이가 5,659px, 용량은 1.25MB가 됐습니다. '원본 크기 유지'는 3,839px·1.08MB였습니다.",
  },
  {
    question: "합치는 동안 캡처가 어딘가로 올라가나요?",
    answer:
      "올라가지 않습니다. 대화 캡처처럼 남에게 보이기 싫은 이미지가 많아서, 이어 붙이는 일은 이 페이지가 연 캔버스 위에서만 하고 결과도 다운로드할 때 내 기기에만 저장됩니다.",
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

// 2026-10-15 측정 (원자료: docs/blog-data/image-merge-2026-10-15.json)
const capacityRows = [
  { engine: "Chromium 151", png: "28장 (65,520px)", jpg: "28장 (65,520px)" },
  { engine: "Firefox 153", png: "28장 (65,520px)", jpg: "27장 (63,180px)" },
  { engine: "WebKit 26.5", png: "60장 이상 (측정 상한)", jpg: "27장 (63,180px)" },
];

export default function ImageMergeGuidePage() {
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
            <span className="text-brand-mid">캡처·사진 합치기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              캡처·사진 합치기
            </h1>
            <p className="text-lg text-brand-mid">몇 장까지, 몇 MB, PNG냐 JPG냐</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              나눠 찍은 대화 캡처를 한 장으로 이어 붙이거나, 비교할 사진을 나란히 붙이는 일은 자주 생깁니다.
              그런데 몇 장까지 붙일 수 있는지, PNG와 JPG 중 무엇으로 저장해야 하는지, 크기가 다른 이미지를
              섞으면 어떻게 되는지는 잘 안 알려져 있습니다. 휴대폰 크기 캡처와 카메라 사진으로 직접 재봤습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              측정 결과에 따라 floor05 이미지 합치기의 기본 저장 형식과 크기 초과 안내도 바꿨습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>
                캡처: floor05 블로그 글을 휴대폰 화면 크기(360×780, 3배율)로 찍은 1080×2340 PNG.
                글자와 흰 배경이 대부분인 전형적인 캡처입니다.
              </li>
              <li>사진: NASA 공공 도메인 거북이 사진을 1920×1499로 줄인 PNG</li>
              <li>
                방식: floor05{" "}
                <Link href="/tools/image/merge" className="text-brand-accent hover:underline">
                  이미지 합치기
                </Link>
                와 같은 과정(캔버스에 이어 그린 뒤 저장, JPG는 품질 92%). Chromium 151, WebKit 26.5, Firefox
                153에서 같은 실험을 반복했습니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 캡처는 28장, 65,520px까지 붙었다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 캡처를 세로로 한 장씩 더 쌓으면서 저장이 실패하는 지점을 찾았습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">브라우저 엔진</th>
                    <th className="py-2 pr-4 text-brand-black">PNG로 저장</th>
                    <th className="py-2 pr-4 text-brand-black">JPG로 저장</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {capacityRows.map((row) => (
                    <tr key={row.engine} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.engine}</td>
                      <td className="py-2 pr-4">{row.png}</td>
                      <td className="py-2 pr-4">{row.jpg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-4">
              1080×2340 캡처를 세로로 쌓아 저장에 성공한 최대 장수. WebKit은 Windows용 사파리 엔진 빌드라 실제
              아이폰·Mac 사파리와 다를 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              크롬·엣지 엔진은 28장(65,520px)까지 됐고 29장(67,860px)에서 실패했습니다. JPG 형식은 한 변을
              65,535px까지만 기록할 수 있어서, 어느 브라우저든 JPG로는 그 이상이 불가능합니다. floor05는 한 번에
              10장(모바일 5장)까지 받기 때문에 보통 캡처는 이 한계에 닿지 않지만, 아주 길게 스크롤해 찍은 캡처를
              여러 장 붙이면 닿을 수 있습니다. 이제는 합친 결과가 65,535px를 넘으면 처리를 시작하기 전에 나눠
              합치라고 알려 줍니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 캡처는 PNG로 합쳐도 15%밖에 안 크다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              캡처 5장(1080×11700)을 합쳐 저장하니 Chromium에서 PNG 1.32MB, JPG 1.14MB였습니다. PNG가 15%
              클 뿐입니다. WebKit에서는 PNG가 0.91MB로 오히려 JPG(1.14MB)보다 작았습니다. 흰 배경과 같은 색
              글자가 반복되는 캡처는 PNG가 원래 잘 압축하기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그런데 floor05 이미지 합치기는 지금까지 기본 저장 형식이 JPG였습니다. 그래서 대화 캡처를 합치면
              글자 주변이 손실 압축되고 있었습니다. 이제는 올린 이미지가 모두 PNG면 처음부터 PNG로 저장하고,
              JPG 사진이 하나라도 섞이면 JPG로 저장합니다. 물론 저장 형식은 언제든 직접 바꿀 수 있습니다.
            </p>

            <BlogInlineCTA href="/tools/image/merge" label="이미지 합치기 →">
              캡처만 올리면 PNG로, 사진이 섞이면 JPG로 알아서 맞춥니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 폭이 다르면 좁은 쪽이 확대된다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              1920px 사진 아래 1080px 캡처를 세로로 붙여 봤습니다. &lsquo;너비 맞추기&rsquo;는 넓은 쪽 폭에 맞추기
              때문에 캡처가 1.78배로 확대됐고, 결과는 1920×5659, JPG 1.25MB였습니다. &lsquo;원본 크기 유지&rsquo;는
              캡처를 그대로 두고 양옆을 배경색으로 채워 1920×3839, 1.08MB였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확대된 캡처는 픽셀이 늘어난 만큼 용량을 차지하지만, 원래 없던 디테일이 생기지는 않습니다. 폭이 비슷한
              캡처끼리라면 &lsquo;너비 맞추기&rsquo;가 깔끔하고, 사진과 캡처처럼 폭 차이가 크면 &lsquo;원본 크기
              유지&rsquo;가 가볍습니다. 넓은 사진을 먼저{" "}
              <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                크기 조절
              </Link>
              로 캡처 폭(1080px)에 맞춰 줄인 뒤 합치는 방법도 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">합치는 순서</h2>
            <ol className="list-decimal pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>이미지를 2장 이상 올립니다. 목록 순서가 합쳐지는 순서이고, 위·아래 버튼으로 바꿀 수 있습니다.</li>
              <li>대화 캡처나 긴 글은 &lsquo;세로로 합치기&rsquo;, 나란히 비교할 사진은 &lsquo;가로로 합치기&rsquo;를 고릅니다.</li>
              <li>크기 처리(&lsquo;너비/높이 맞추기&rsquo; 또는 &lsquo;원본 크기 유지&rsquo;), 이미지 간격, 배경색을 정합니다.</li>
              <li>저장 형식을 확인하고 합친 뒤 내려받습니다.</li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-6">
              캡처를 이음새 없이 잇고 싶다면 간격은 0으로 두세요. 사진을 나란히 비교할 때는 간격을 조금 주면 경계가
              또렷해집니다. 합친 결과가 업로드 제한보다 크면{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              의 목표 용량으로 맞추면 됩니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">나눠 찍은 걸 한 장으로</h3>
              <p className="text-brand-light mb-6">
                세로·가로, 폭 맞춤, 간격, 배경색까지 정하고 한 번에 이어 붙이세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/merge"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 합치기
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
          <BlogExtras slug="image-merge-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
