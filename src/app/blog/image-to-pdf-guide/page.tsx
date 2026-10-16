import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-to-pdf-guide"),
  title: "사진을 PDF로 만들기 - 10장이면 몇 MB? 화질별로 재봤습니다",
};

const faqs = [
  {
    question: "사진 10장을 PDF로 만들면 용량이 얼마나 되나요?",
    answer:
      "해상도에 따라 크게 다릅니다. 카메라 원본 사진 10장을 원본 해상도·품질 92%로 넣으니 48.0MB였고, 긴 변 3508px(A4 300dpi)로 줄이면 9.77MB, 1754px(A4 150dpi)로 줄이면 2.78MB였습니다.",
  },
  {
    question: "A4로 만들면 '이미지 맞춤'보다 용량이 작아지나요?",
    answer:
      "아닙니다. 같은 사진 한 장을 두 방식으로 만든 PDF의 차이는 33바이트였습니다. 용지 크기는 사진을 얼마나 크게 보여줄지 정할 뿐이고, PDF에 들어가는 사진 데이터는 그대로입니다.",
  },
  {
    question: "제출 사이트 용량 한도에 맞추려면 어떻게 하나요?",
    answer:
      "floor05 이미지 PDF 변환의 화질 옵션에서 '제출용'이나 '인쇄용'을 고르세요. PDF 용량은 안에 든 사진 용량의 합과 거의 같아서, 사진 해상도를 줄이는 것이 가장 직접적인 방법입니다.",
  },
  {
    question: "아이폰 HEIC 사진도 PDF로 만들 수 있나요?",
    answer:
      "이미지 PDF 변환은 JPG·PNG·WebP를 받습니다. HEIC 사진은 HEIC → JPG 변환으로 먼저 바꾼 뒤 올리면 됩니다.",
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

// 2026-10-15 측정 (원자료: docs/blog-data/photo-pdf-size-2026-10-15.json)
const tenPageRows = [
  { label: "원본 해상도 · 92%", note: "기존 기본값", mb: 47.97 },
  { label: "긴 변 4032px · 92%", note: "1200만 화소 폰 사진 수준", mb: 19.76 },
  { label: "긴 변 3508px · 85%", note: "인쇄용 (A4 300dpi)", mb: 9.77 },
  { label: "긴 변 2339px · 85%", note: "A4 200dpi", mb: 4.62 },
  { label: "긴 변 1754px · 85%", note: "제출용 (A4 150dpi)", mb: 2.78 },
];
const MAX_MB = 47.97;

export default function ImageToPdfGuidePage() {
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
            <span className="text-brand-mid">사진을 PDF로 만들기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진을 PDF로 만들기
            </h1>
            <p className="text-lg text-brand-mid">10장이면 몇 MB? 화질별로 재봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              서류를 &lsquo;PDF 한 개로, 10MB 이하로&rsquo; 내라는 요청은 흔합니다. 그런데 사진을 PDF로
              묶어 보기 전에는 몇 MB가 나올지 알기 어렵습니다. 그래서 카메라 원본 사진으로 장수와 화질을
              바꿔 가며 PDF를 만들어 용량을 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              재보니 floor05 이미지 PDF 변환은 사진 해상도를 줄일 방법이 없어서, 카메라 사진 10장이면
              48MB짜리 PDF가 나왔습니다. 측정 결과를 바탕으로 <strong>화질 옵션(원본·인쇄용·제출용)</strong>을
              추가했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                사진: NASA가 공공 도메인으로 공개한 카메라 원본 두 장. 거북이 사진(5522×4312, 15.78MB)과
                꽃 사진(8192×5464, 9.18MB)
              </li>
              <li>
                방식: floor05 이미지 PDF 변환과 같은 과정. 브라우저(Chromium 151)에서 사진을 JPG로 다시
                저장한 뒤 pdf-lib로 한 장씩 페이지에 넣었습니다.
              </li>
              <li>10장 PDF는 두 사진을 번갈아 다섯 번씩 넣어 만들었습니다. 용량은 1MB = 1,000,000바이트 기준입니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과: 사진 10장 PDF</h2>
            <figure className="my-8">
              <div role="img" aria-label="화질 설정별 사진 10장 PDF 용량: 원본 해상도 47.97MB, 긴 변 4032px 19.76MB, 3508px 9.77MB, 2339px 4.62MB, 1754px 2.78MB" className="space-y-4">
                {tenPageRows.map((row, i) => (
                  <div key={row.label}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
                      <span className="font-medium text-brand-black">{row.label}</span>
                      <span className="text-brand-light">{row.note}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="h-5 flex-1 rounded bg-brand-paper">
                        <div
                          className={`h-5 rounded ${i === 0 ? "bg-brand-light" : "bg-brand-accent"}`}
                          style={{ width: `${Math.max(2, (row.mb / MAX_MB) * 100)}%` }}
                        />
                      </div>
                      <span className="w-20 shrink-0 text-right font-mono text-sm text-brand-black">
                        {row.mb.toFixed(2)}MB
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                같은 사진 10장, 해상도와 JPG 품질만 바꿔 만든 PDF 용량
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              원본 해상도 그대로면 47.97MB, 긴 변을 1754px로 줄이면 2.78MB였습니다. 17배 차이입니다.
              인쇄용 기준인 3508px는 9.77MB로, 10MB 한도를 아슬아슬하게 넘지 않았습니다. 사진이 더 많다면 인쇄용으로도 한도를 넘습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. PDF 용량 = 안에 든 사진 용량의 합
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진을 원본 해상도·품질 92%로 저장하면 6,512,958바이트와 3,080,998바이트였고, 둘을 넣은
              PDF는 9,595,259바이트였습니다. 사진 합계보다 1,303바이트 컸을 뿐입니다. PDF가 사진을 따로
              압축하지 않고, 저장된 JPG를 페이지마다 그대로 담기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그러니 &ldquo;PDF로 만들면 용량이 줄겠지&rdquo;는 맞지 않습니다. PDF 용량을 줄이려면 들어가는
              사진을 줄여야 합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. A4로 만들어도 용량은 그대로
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              용지를 &lsquo;이미지 맞춤&rsquo;과 &lsquo;A4&rsquo;로 바꿔 같은 사진 한 장을 넣어 봤습니다.
              6,513,912바이트와 6,513,945바이트로 차이는 33바이트였습니다. A4를 고르면 사진이 A4
              종이 크기로 줄어 <em>보이지만</em>, 안에 든 사진 데이터는 원본 해상도 그대로입니다. 그래서
              용지 설정은 인쇄했을 때의 모양을 위해 고르고, 용량은 아래의 화질 옵션으로 조절해야 합니다.
            </p>

            <BlogInlineCTA href="/tools/pdf/image-to-pdf" label="이미지 PDF 변환 →">
              화질 옵션에서 &lsquo;제출용&rsquo;을 고르면 사진 10장이 3MB 안팎이 됩니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 화질 옵션은 이렇게 정했습니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              A4 용지의 긴 변은 297mm입니다. 이걸 300dpi로 인쇄하려면 3508px, 150dpi면 1754px가 필요합니다.
              사진을 이보다 크게 넣어도 A4 한 장에 인쇄하면 더 선명해지지 않습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">옵션</th>
                    <th className="py-2 pr-4 text-brand-black">처리</th>
                    <th className="py-2 pr-4 text-brand-black">10장 실측</th>
                    <th className="py-2 pr-4 text-brand-black">이럴 때</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">원본</td>
                    <td className="py-2 pr-4">해상도 유지 · 92%</td>
                    <td className="py-2 pr-4">47.97MB</td>
                    <td className="py-2 pr-4">사진 자체를 보관·전달</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">인쇄용</td>
                    <td className="py-2 pr-4">긴 변 3508px · 85%</td>
                    <td className="py-2 pr-4">9.77MB</td>
                    <td className="py-2 pr-4">A4로 출력할 문서</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">제출용</td>
                    <td className="py-2 pr-4">긴 변 1754px · 85%</td>
                    <td className="py-2 pr-4">2.78MB</td>
                    <td className="py-2 pr-4">화면으로 확인하는 제출 서류</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              원래 작은 사진(긴 변이 기준보다 짧은 사진)은 키우지 않고 그대로 넣습니다. 제출용으로 만든
              뒤에는 PDF를 열어 가장 작은 글씨를 확대해 읽히는지 한 번 확인하세요. 영수증처럼 글씨가
              작은 사진이라면 인쇄용이 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">사진 여러 장을 한 PDF로</h2>
            <ol className="list-decimal pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <Link href="/tools/pdf/image-to-pdf" className="text-brand-accent hover:underline">
                  이미지 PDF 변환
                </Link>
                에 사진을 올립니다. JPG·PNG·WebP를 받고, 한 번에 30장까지 넣을 수 있습니다.
              </li>
              <li>위·아래 화살표로 순서를 맞춥니다. 올린 순서가 페이지 순서가 됩니다.</li>
              <li>용지(이미지 맞춤·A4·Letter), 화질, 여백을 고릅니다.</li>
              <li>&lsquo;PDF로 변환&rsquo;을 누르면 한 파일로 저장됩니다.</li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-6">
              휴대폰을 세로로 들고 찍은 사진은 회전 정보를 읽어 바로 세워 넣습니다. 인쇄할 문서라면
              여백을 &lsquo;좁게&rsquo; 이상으로 두세요. 여백 없이 꽉 채우면 프린터에 따라 가장자리가
              잘릴 수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이미 만든 PDF를 합치거나 나눌 때</h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              흩어진 PDF는{" "}
              <Link href="/tools/pdf/merge" className="text-brand-accent hover:underline">
                PDF 합치기
              </Link>
              로 하나로 모으고, 일부 페이지만 필요하면{" "}
              <Link href="/tools/pdf/split" className="text-brand-accent hover:underline">
                PDF 분할
              </Link>
              에서 &lsquo;1-3, 5&rsquo;처럼 입력해 뽑습니다. 신분증 사본이나 통장 사본처럼 남에게 보이기
              싫은 서류가 많으니, 세 도구 모두 파일을 업로드하지 않고 지금 연 브라우저 탭에서 페이지를
              다시 엮습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">용량 한도에 맞춰 PDF 만들기</h3>
              <p className="text-brand-light mb-6">
                원본·인쇄용·제출용 중에 고르면 사진 해상도를 알아서 맞춥니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/pdf/image-to-pdf"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 PDF 변환
                </Link>
                <Link
                  href="/tools/pdf/merge"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  PDF 합치기
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="image-to-pdf-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
