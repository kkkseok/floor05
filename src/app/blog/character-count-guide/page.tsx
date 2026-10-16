import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("character-count-guide"),
  title: "글자수 세기 - 같은 글이 사이트마다 다르게 세지는 이유, 11가지 입력 실측",
};

const faqs = [
  {
    question: "이모지는 몇 글자로 세나요?",
    answer:
      "세는 방식마다 다릅니다. 👍 하나는 눈에 보이는 글자로 1자, 코드 포인트로 1자, 입력란 글자 제한(UTF-16)으로 2자였습니다. 가족 이모지 👨‍👩‍👧는 보이는 글자 1자, 코드 포인트 5자, UTF-16 8자였습니다. 제출처 입력란에서 직접 확인하는 것이 가장 정확합니다.",
  },
  {
    question: "입력란에 글자 제한이 있으면 이모지를 넣어도 되나요?",
    answer:
      "조심해야 합니다. 5자 제한 입력란에 👍를 6개 넣으니 세 브라우저 모두 2개만 들어갔고, 가족 이모지는 중간에서 잘려 깨진 채로 남았습니다. 브라우저의 글자 제한은 이모지 하나를 2자 이상으로 셉니다.",
  },
  {
    question: "1,000바이트는 몇 글자인가요?",
    answer:
      "한글만이면 한글을 2바이트로 세는 방식에서 500자, UTF-8(한글 3바이트)에서 333자입니다. 공백·영문·숫자는 두 방식 모두 1바이트라 섞일수록 더 들어갑니다. 예를 들어 '안녕하세요 반갑습니다'는 2바이트 방식 21바이트, UTF-8 31바이트였습니다.",
  },
  {
    question: "붙여넣은 글자가 서버에 남나요?",
    answer:
      "남지 않습니다. 숫자는 붙여넣은 이 페이지의 스크립트가 바로 세고, 다음 방문 때 이어 쓰라고 남겨 두는 사본도 이 브라우저의 저장소에만 있습니다. 지우기를 누르면 그것도 사라집니다.",
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

// 2026-10-16 측정 (원자료: docs/blog-data/char-count-2026-10-16.json)
const rows = [
  { input: "안녕하세요 반갑습니다", seen: 11, utf16: 11, cp: 11, utf8: 31 },
  { input: "좋아요👍", seen: 4, utf16: 5, cp: 4, utf8: 13 },
  { input: "가족👨‍👩‍👧", seen: 3, utf16: 10, cp: 7, utf8: 24 },
  { input: "한국🇰🇷", seen: 3, utf16: 6, cp: 4, utf8: 14 },
  { input: "한글 (자모 분리, NFD)", seen: 2, utf16: 6, cp: 6, utf8: 18 },
  { input: "첫 줄 + 줄바꿈(CRLF) + 둘째 줄", seen: 8, utf16: 9, cp: 9, utf8: 19 },
];

const spaceRows = [
  { input: "웹␣복사 (U+00A0, 웹에서 복사한 공백)", before: 4, after: 3 },
  { input: "전각␣공백 (U+3000, 전각 공백)", before: 5, after: 4 },
  { input: "보이지·않음 (U+200B, 폭 없는 공백)", before: 6, after: 5 },
  { input: "한글 (자모 분리, NFD) — 공백 포함 글자수", before: 6, after: 2 },
];

export default function CharacterCountGuidePage() {
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
            <span className="text-brand-mid">글자수 세기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              같은 글이 사이트마다 다르게 세지는 이유
            </h1>
            <p className="text-lg text-brand-mid">글자수를 헷갈리게 하는 입력 11가지를 직접 세어 봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-16">2026-10-16 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              메모장에서는 498자였는데 지원서 입력란에서는 500자를 넘었다고 나오는 일이 있습니다. 누가
              틀린 걸까요? 대개 둘 다 맞습니다. &lsquo;글자 하나&rsquo;를 세는 방식이 여러 가지라서입니다.
              차이가 생기는 입력 11가지를 골라 방식별로 직접 세어 봤습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              세어 보다가 floor05 글자수 세기가 일부 공백을 &lsquo;공백 제외&rsquo;에서 빼지 못하고, 자모가
              분리된 한글을 세 배로 세는 것도 발견해 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>
                <strong className="text-brand-black">보이는 글자</strong>: 브라우저의 글자 분리 기능(Intl.Segmenter)이
                화면에서 한 글자로 묶는 단위
              </li>
              <li>
                <strong className="text-brand-black">UTF-16</strong>: 자바스크립트 문자열 길이. 웹 입력란의 글자 제한(maxlength)이
                이 방식으로 셉니다(아래에서 확인)
              </li>
              <li>
                <strong className="text-brand-black">코드 포인트</strong>: 유니코드 문자 단위. floor05{" "}
                <Link href="/tools/text/counter" className="text-brand-accent hover:underline">
                  글자수 세기
                </Link>
                가 세는 방식
              </li>
              <li>
                <strong className="text-brand-black">UTF-8 바이트</strong>: 한글 한 자가 3바이트인 방식
              </li>
              <li>
                입력란 글자 제한은 Chromium 151, Firefox 153, WebKit 26.5에서 5자 제한 입력란에 같은 글을 넣어
                남는 글자를 확인했습니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과: 같은 입력, 다른 숫자</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">입력</th>
                    <th className="py-2 pr-4 text-brand-black">보이는 글자</th>
                    <th className="py-2 pr-4 text-brand-black">UTF-16</th>
                    <th className="py-2 pr-4 text-brand-black">코드 포인트</th>
                    <th className="py-2 pr-4 text-brand-black">UTF-8 바이트</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {rows.map((row) => (
                    <tr key={row.input} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.input}</td>
                      <td className="py-2 pr-4">{row.seen}</td>
                      <td className="py-2 pr-4">{row.utf16}</td>
                      <td className="py-2 pr-4">{row.cp}</td>
                      <td className="py-2 pr-4">{row.utf8}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              평범한 한글·영문 문장은 네 방식이 같은 수를 냅니다. 차이는 이모지, 자모 분리 한글, 줄바꿈에서 생깁니다.
              전체 11가지 결과는 원자료에 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 이모지 하나가 1자도, 2자도, 5자도 된다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              👍 하나는 보이는 글자로 1자지만 UTF-16으로는 2자입니다. 가족 이모지 👨‍👩‍👧는 사람 셋을 보이지 않는 연결
              문자로 붙인 것이라, 보이는 글자로 1자, 코드 포인트로 5자, UTF-16으로 8자가 됩니다. 국기 🇰🇷도 글자 두 개를
              붙여 만든 것이라 코드 포인트로 2자입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래서 이모지가 섞인 글은 도구마다 숫자가 다릅니다. floor05는 코드 포인트로 세므로 &lsquo;가족👨‍👩‍👧&rsquo;을
              7자로 보여줍니다. 제출처가 어느 방식인지는 공개되지 않는 경우가 많으니, 글자 제한이 빠듯하다면 이모지를
              빼는 편이 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 입력란 글자 제한은 세 브라우저 모두 UTF-16으로 셌다
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">5자 제한 입력란에 넣은 것</th>
                    <th className="py-2 pr-4 text-brand-black">들어간 것 (3개 브라우저 동일)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">한글 6자 &lsquo;가나다라마바&rsquo;</td>
                    <td className="py-2 pr-4">5자</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">👍 6개</td>
                    <td className="py-2 pr-4">👍 2개 (UTF-16 4자)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">가족 이모지 2개</td>
                    <td className="py-2 pr-4">1개도 온전히 못 들어가고 중간에서 잘림</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">자모 분리 한글 &lsquo;한글한글&rsquo;</td>
                    <td className="py-2 pr-4">자모 5개만 들어가 두 번째 글자가 깨짐</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              웹 입력란의 maxlength는 UTF-16 단위로 셉니다. 한글은 한 자가 1단위라 문제가 없지만, 이모지는 2단위 이상이라
              훨씬 빨리 막힙니다. 더 곤란한 건 잘리는 위치를 가리지 않는다는 점입니다. 가족 이모지는 5단위에서 잘려 아이가
              빠진 채로 남았습니다.
            </p>

            <BlogInlineCTA href="/tools/text/counter" label="글자수 세기 →">
              공백 포함·제외, 2바이트·UTF-8, 원고지 매수를 한 번에 봅니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 줄바꿈 하나에 1자가 갈린다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              &lsquo;첫 줄&rsquo;과 &lsquo;둘째 줄&rsquo; 사이의 줄바꿈이 LF(\n)면 문자열 길이는 8, 윈도우 방식인 CRLF(\r\n)면
              9였습니다. 줄바꿈 문자 자체를 몇 자로 볼지, 아예 세지 않을지도 도구마다 다릅니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05는 두 가지 중에 고르게 합니다. 줄바꿈을 공백 한 칸으로 세는 방식(화면의 &lsquo;네이버 기준&rsquo;)에서는 8자,
              줄바꿈을 세지 않는 방식(&lsquo;한글 기준&rsquo;)에서는 7자이고, LF든 CRLF든 결과가 같습니다. 문단이 많은 글은
              이 차이가 문단 수만큼 쌓이니, 제출처가 어느 쪽인지 모르면 두 값을 모두 보고 큰 쪽이 제한 안에 들어오게 줄여 두세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 측정하다 고친 것: 보이지 않는 공백과 분리된 한글
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05의 &lsquo;공백 제외&rsquo;는 띄어쓰기와 탭만 지우고 있었습니다. 웹에서 복사한 글에 섞이는 줄바꿈 없는
              공백(U+00A0), 한글 문서의 전각 공백(U+3000), 보이지 않는 폭 없는 공백(U+200B)은 글자로 세었습니다. 또 맥에서
              파일 이름 등을 복사하면 한글이 자모 단위로 분리돼 들어오는데, 이걸 그대로 세어 &lsquo;한글&rsquo; 두 자를
              6자로 보여줬습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">입력 (floor05 공백 제외 글자수)</th>
                    <th className="py-2 pr-4 text-brand-black">고치기 전</th>
                    <th className="py-2 pr-4 text-brand-black">고친 뒤</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {spaceRows.map((row) => (
                    <tr key={row.input} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4">{row.input}</td>
                      <td className="py-2 pr-4">{row.before}</td>
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              지금은 공백 제외에서 공백류 문자를 모두 지우고, 세기 전에 분리된 한글을 하나로 합칩니다. 합치는 것은
              유니코드 표준 정규화(NFC)라 글의 내용은 바뀌지 않습니다. 단, 제출처 입력란은 분리된 한글을 그대로 받으면
              위 표처럼 훨씬 길게 셀 수 있으니, 맥에서 복사한 글은 메모장 같은 곳에 한 번 붙여넣었다가 옮기는 편이
              안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">바이트 제한과 원고지</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              입력란이 &lsquo;1,000바이트&rsquo;처럼 바이트로 제한한다면 한글을 몇 바이트로 보는지가 관건입니다. 한글을
              2바이트로 보면 한글만 500자, UTF-8처럼 3바이트로 보면 333자까지 들어갑니다. 공백·영문·숫자는 두 방식
              모두 1바이트입니다. &lsquo;안녕하세요 반갑습니다&rsquo;는 2바이트 방식 21바이트, UTF-8 31바이트였습니다.
              floor05는 두 값을 함께 보여줍니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              원고지는 공백도 한 칸이므로 공백 포함 글자수로 셉니다. 200자 원고지(20×10) 10매는 2,000자, 400자
              원고지(20×20) 10매는 4,000자입니다. 1,001자는 200자 원고지로 6매째에 1자가 들어가므로 6매입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 확인 순서</h2>
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
                    <td className="py-2 pr-4 font-medium text-brand-black">빠듯하면 이모지·특수기호를 뺀다</td>
                    <td className="py-2 pr-4">👍 하나가 방식에 따라 1~2자, 가족 이모지는 1~8자</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">제출 직전 입력란에 직접 붙여넣어 본다</td>
                    <td className="py-2 pr-4">입력란 제한은 UTF-16으로 세고 이모지를 중간에서 자름</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">줄바꿈 두 방식 중 큰 값 기준으로 줄인다</td>
                    <td className="py-2 pr-4">같은 글이 줄바꿈 처리에 따라 문단마다 1자씩 차이</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">맥에서 복사한 글은 한 번 거쳐 붙인다</td>
                    <td className="py-2 pr-4">분리된 한글은 입력란에서 3배로 셀 수 있음</td>
                  </tr>
                </tbody>
              </table>
            </div>

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
              <h3 className="text-xl font-bold text-brand-paper mb-3">붙여넣으면 바로 셉니다</h3>
              <p className="text-brand-light mb-6">
                공백 포함·제외, 2바이트·UTF-8, 원고지 매수, 목표까지 남은 글자를 한 화면에서.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/text/counter"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  글자수 세기
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="character-count-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
