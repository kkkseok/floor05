import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-to-pdf-guide"),
  title: "사진을 PDF로 만들고 합치는 법 - 서버 전송 없이",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "여러 장의 사진을 한 PDF로 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 사진을 여러 장 올리고 순서를 맞춘 뒤 변환하면 각 사진이 한 페이지씩 들어간 PDF 한 개가 만들어집니다.",
      },
    },
    {
      "@type": "Question",
      name: "사진이 서버에 올라가나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "아니요. 변환·병합·분할 모두 브라우저 안에서 이루어지며 파일이 서버로 전송되거나 저장되지 않습니다.",
      },
    },
    {
      "@type": "Question",
      name: "PDF에서 원하는 페이지만 뽑을 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "PDF 분할 도구의 '페이지 추출'에서 1-3, 5처럼 입력하면 해당 페이지만 담은 새 PDF가 만들어집니다.",
      },
    },
    {
      "@type": "Question",
      name: "만들어진 PDF 용량이 너무 커요. 어떻게 줄이나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "사진 해상도가 그대로 PDF에 들어가기 때문입니다. 변환 전에 이미지 압축 도구로 사진 용량을 줄인 뒤 PDF로 만들면, 제출 사이트의 업로드 용량 제한도 맞추기 쉽습니다.",
      },
    },
  ],
};

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
            <span className="text-brand-mid">사진을 PDF로 만들고 합치는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진을 PDF로 만들고 합치는 법
            </h1>
            <p className="text-lg text-brand-mid">서버에 올리지 않고 브라우저에서</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-29">2026-06-29</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              서류를 제출할 때 &lsquo;PDF로 보내달라&rsquo;는 요청을 자주 받습니다. 휴대폰으로 찍은
              사진 여러 장을 한 PDF로 묶거나, 따로 받은 PDF들을 하나로 합쳐야 할 때가 많죠. 스캐너나
              유료 프로그램 없이, 브라우저에서 하는 방법을 정리했습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 변환하고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                사진 여러 장을 올려 순서를 맞추면 한 PDF로 묶어줍니다. 파일은 서버로 전송되지
                않습니다.
              </p>
              <Link
                href="/tools/pdf/image-to-pdf"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 PDF 변환 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              사진 여러 장을 한 PDF로
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/pdf/image-to-pdf" className="text-brand-accent hover:underline">
                  이미지 PDF 변환
                </Link>
                에 사진을 드래그하거나 클릭해 올립니다.
              </li>
              <li>위·아래 화살표로 순서를 맞춥니다.</li>
              <li>용지(이미지 맞춤·A4)와 여백을 고릅니다.</li>
              <li>&lsquo;PDF로 변환&rsquo;을 누르면 한 파일로 저장됩니다.</li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-4">
              세로로 찍힌 사진은 회전 정보를 반영해 바로 세워 넣습니다. 용지와 여백 설정이 결과물을
              꽤 좌우하는데, 기준은 간단합니다. 화면으로만 볼 문서라면 &lsquo;이미지 맞춤&rsquo;이
              사진 비율 그대로 담겨 깔끔하고, 인쇄하거나 공식 서류로 낼 문서라면 &lsquo;A4&rsquo;를
              선택하는 게 안전합니다. 여백 없이 꽉 채우면 프린터에 따라 가장자리가 잘릴 수 있으니,
              인쇄용은 여백을 &lsquo;좁게&rsquo; 이상으로 주는 게 좋습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              제출 상황별 팁
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>관공서·정부 사이트 제출</strong> — A4 세로에 여백을 주고 만드세요. 업로드
                용량 제한(수 MB)이 있는 곳이 많아, 사진이 크면{" "}
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  이미지 압축
                </Link>
                으로 먼저 줄인 뒤 변환하는 게 빠릅니다.
              </li>
              <li>
                <strong>입사지원·포트폴리오</strong> — 올린 순서가 그대로 페이지 순서가 됩니다.
                파일명 앞에 01, 02처럼 번호를 붙여 두면 순서 맞추기가 쉽습니다. 작품 사진은
                &lsquo;이미지 맞춤&rsquo;으로 비율을 살리는 편이 보기 좋습니다.
              </li>
              <li>
                <strong>계약서·증빙 서류</strong> — 변환 후 PDF를 열어 글자가 읽히는지 확대해서 한 번
                확인하세요. 원본 사진이 흔들렸다면 PDF에서도 흐릿합니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              휴대폰 스캔 앱과 비교하면, 브라우저 도구는 설치가 필요 없고 무료 스캔 앱에 흔한
              워터마크나 페이지 수 제한이 없습니다. 이미 찍어 둔 사진을 PDF로 묶는 용도라면 앱을
              새로 깔 이유가 없습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">여러 PDF를 하나로 합치기</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              견적서와 계약서, 따로 스캔한 서류처럼 흩어진 PDF는{" "}
              <Link href="/tools/pdf/merge" className="text-brand-accent hover:underline">
                PDF 합치기
              </Link>
              로 하나로 모읍니다. 파일을 올리면 페이지 수가 표시되고, 순서를 맞춘 뒤 합치면 위에서
              아래 순서로 이어집니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">필요한 페이지만 분할</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              반대로 일부 페이지만 필요하면{" "}
              <Link href="/tools/pdf/split" className="text-brand-accent hover:underline">
                PDF 분할
              </Link>
              을 씁니다. &lsquo;1-3, 5&rsquo;처럼 입력해 원하는 페이지만 뽑거나, 모든 페이지를 낱장으로
              나눠 ZIP으로 받을 수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              민감한 서류일수록 서버 전송이 문제다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              PDF로 만드는 서류는 신분증, 통장 사본, 계약서처럼 남에게 보이고 싶지 않은 게 대부분입니다.
              대부분의 온라인 PDF 사이트는 파일을 자기 서버에 업로드해 처리하지만, 이 도구들은 변환·병합·분할을
              모두 브라우저 안에서 끝냅니다. 파일이 외부로 나가지 않으니 민감한 서류도 안심하고 다룰 수
              있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 여러 사진을 한 PDF로 만들 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네. 사진을 올리고 순서를 맞춘 뒤 변환하면 각 사진이 한 페이지씩 들어갑니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 파일이 서버에 올라가나요?
                </h3>
                <p className="text-brand-mid">
                  아니요. 변환·병합·분할 모두 브라우저 안에서 이루어지며 서버로 전송되지 않습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 아이폰 HEIC 사진도 되나요?
                </h3>
                <p className="text-brand-mid">
                  JPG·PNG·WebP를 지원합니다. HEIC는 포맷 변환 도구로 JPG로 바꾼 뒤 사용하세요.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 만들어진 PDF 용량이 너무 커요.
                </h3>
                <p className="text-brand-mid">
                  사진 해상도가 그대로 들어가서 그렇습니다. 변환 전에 이미지 압축으로 사진 용량을
                  줄이면 제출 사이트의 용량 제한도 맞추기 쉽습니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">PDF, 브라우저에서 바로</h3>
              <p className="text-brand-light mb-6">
                만들고, 합치고, 나누고. 파일은 서버로 전송되지 않습니다.
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

            <BlogExtras slug="image-to-pdf-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
