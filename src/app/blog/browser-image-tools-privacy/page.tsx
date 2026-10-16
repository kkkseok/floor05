import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("browser-image-tools-privacy"),
  title: "서버에 안 올리는 안전한 이미지 도구 - 브라우저 처리의 원리",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "온라인 이미지 도구에 사진을 올리면 어디로 가나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "대부분의 온라인 도구는 사진을 서버로 업로드한 뒤 처리해 돌려줍니다. 이 경우 사진이 외부 서버에 일시적으로라도 저장될 수 있습니다. 반면 브라우저에서 직접 처리하는 도구는 사진이 내 기기를 떠나지 않습니다.",
      },
    },
    {
      "@type": "Question",
      name: "브라우저에서 처리하면 정말 안전한가요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "사진이 네트워크로 전송되지 않고 기기 안에서만 처리되므로, 업로드 방식보다 개인정보 노출 위험이 낮습니다. 신분증, 가족 사진처럼 민감한 이미지일수록 차이가 큽니다.",
      },
    },
    {
      "@type": "Question",
      name: "브라우저 도구는 인터넷 없이도 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "페이지를 한 번 연 뒤에는 처리 자체가 기기에서 이루어지므로, 파일 처리 단계에서 사진이 외부로 나가지 않습니다. 처리 속도도 파일을 올렸다 받는 과정이 없어 빠른 편입니다.",
      },
    },
  ],
};

export default function BrowserImageToolsPrivacyPage() {
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
            <span className="text-brand-mid">안전한 이미지 도구</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              서버에 안 올리는 안전한 이미지 도구
            </h1>
            <p className="text-lg text-brand-mid">
              브라우저에서 처리한다는 건 무슨 뜻일까 — 개인정보 관점에서
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-11">2026-06-11</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              증명사진 용량을 줄이려고, 신분증 사본을 변환하려고 무심코 온라인
              도구에 사진을 올린 적 있을 겁니다. 그 사진은 어디로 갈까요? 도구의
              처리 방식에 따라 답이 달라집니다.
            </p>

            {/* CTA 박스 */}
            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">
                💡 민감한 사진일수록, 서버를 안 거치는 게 안전합니다
              </p>
              <p className="text-brand-mid text-sm mb-4">
                floor05 이미지 도구는 전부 브라우저에서 처리됩니다. 고른 사진은
                업로드되지 않고, 계정을 만들 필요도 없습니다.
              </p>
              <Link
                href="/tools/image/compress"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 압축 도구 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 대부분의 온라인 도구는 &lsquo;업로드&rsquo;한다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              일반적인 온라인 이미지 도구는 이렇게 작동합니다. 내가 고른 파일을
              <strong> 서버로 전송 → 서버에서 처리 → 결과를 다시 내려받기</strong>.
              편리하지만, 그 과정에서 사진이 외부 서버에 일시적으로라도 머무릅니다.
              서버가 언제 파일을 지우는지, 로그에 무엇이 남는지는 이용자가 알기
              어렵습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. &lsquo;브라우저 처리&rsquo;는 다르다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              브라우저(클라이언트) 처리 방식은 사진을 서버로 보내지 않습니다.
              압축·리사이즈 같은 연산을 <strong>내 기기 안의 브라우저가 직접</strong>{" "}
              수행합니다. 사진은 네트워크를 타지 않고, 작업이 끝나면 결과만 내
              기기에 저장됩니다.
            </p>
            <div className="bg-brand-paper rounded-lg p-6 my-8 border border-brand-light/20">
              <p className="text-brand-mid text-sm mb-0">
                floor05의 모든 이미지 도구가 이 방식입니다.{" "}
                <strong className="text-brand-black">
                  사진은 이 페이지를 벗어나지 않습니다.
                </strong>{" "}
                가입 절차도 없습니다.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 왜 더 안전할까
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>전송이 없음</strong>: 사진이 기기를 떠나지 않으니 가로채기나
                서버 보관 자체가 발생하지 않습니다.
              </li>
              <li>
                <strong>민감한 이미지에 유리</strong>: 신분증, 계약서, 가족 사진처럼
                남기고 싶지 않은 이미지일수록 차이가 큽니다.
              </li>
              <li>
                <strong>빠름</strong>: 올렸다 받는 왕복이 없어 처리도 대체로
                빠릅니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 브라우저에서 되는 작업들
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              생각보다 많습니다. 아래 작업은 모두 서버 없이 브라우저에서
              처리됩니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  이미지 압축
                </Link>{" "}
                — 용량 줄이기, 목표 용량 맞추기
              </li>
              <li>
                <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                  리사이즈
                </Link>{" "}
                — 크기·비율 조절, SNS 프리셋
              </li>
              <li>
                <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                  포맷 변환
                </Link>
                {" 및 "}
                <Link href="/tools/image/heic-to-jpg" className="text-brand-accent hover:underline">
                  HEIC → JPG
                </Link>
              </li>
              <li>
                <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                  크롭
                </Link>
                {" · "}
                <Link href="/tools/image/merge" className="text-brand-accent hover:underline">
                  합치기
                </Link>
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">서버 업로드 방식과 브라우저 처리 방식은 어디가 다를까요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">차이는 사진 파일이 내 기기를 벗어나는지에 있습니다. 같은 이미지 변환처럼 보여도 서버형 도구는 파일을 전송한 뒤 결과를 다시 받는 구조이고, 브라우저형 도구는 화면을 띄운 뒤 사용자의 기기 자원으로 처리를 끝내는 구조에 가깝습니다. 그래서 개인정보가 담긴 신분증 사진, 가족 사진, 업무 캡처처럼 외부 전송 자체가 부담스러운 파일은 처리 방식부터 확인하는 편이 좋습니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">서버 업로드 방식</th>
                    <th className="py-2 pr-4 text-brand-black">브라우저 처리 방식</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">파일 이동 경로</td>
                    <td className="py-2 pr-4">내 기기에서 서비스 서버로 전송된 뒤 결과를 내려받습니다</td>
                    <td className="py-2 pr-4">선택한 파일을 현재 브라우저 화면에서 읽고 결과를 만듭니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">인터넷 연결</td>
                    <td className="py-2 pr-4">업로드와 다운로드 과정에 연결이 계속 필요합니다</td>
                    <td className="py-2 pr-4">도구 화면을 연 뒤에는 작업 종류에 따라 연결 의존도가 낮습니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">대기 시간</td>
                    <td className="py-2 pr-4">파일 크기와 회선 상태, 서버 대기열의 영향을 받습니다</td>
                    <td className="py-2 pr-4">대체로 기기 성능과 이미지 크기에 좌우됩니다</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">유출 가능 지점</td>
                    <td className="py-2 pr-4">전송 구간, 저장 공간, 처리 서버, 운영 로그가 확인 대상입니다</td>
                    <td className="py-2 pr-4">기기와 브라우저 권한, 내려받은 결과 파일 관리가 핵심입니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">삭제 보장 확인 방법</td>
                    <td className="py-2 pr-4">보관 기간, 자동 삭제 시점, 수동 삭제 기능을 약관에서 봐야 합니다</td>
                    <td className="py-2 pr-4">업로드 요청이 없는지 확인하고 작업 뒤 탭과 파일을 정리합니다</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정말 안 올라가는지 직접 확인할 수 있을까요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">확인은 가능하며 가장 단순한 방법은 브라우저 개발자 도구의 네트워크 기록을 보는 것입니다. 전문 지식이 없어도 파일을 고른 순간 큰 전송 요청이 생기는지 살펴보면 동작 방식을 어느 정도 구분할 수 있습니다.</p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>도구 페이지를 열기 전에 F12를 누르고 Network 또는 네트워크 탭을 선택합니다.</li>
              <li>기록을 비우는 버튼을 누른 뒤 Preserve log 옵션은 필요에 따라 켜 둡니다.</li>
              <li>이미지를 선택하고 압축, 변환, 크롭 같은 작업을 실제로 실행합니다.</li>
              <li>목록에서 POST, PUT처럼 파일을 보내는 요청이 새로 생겼는지 확인합니다.</li>
              <li>요청 크기가 사진 용량과 비슷하게 크거나 form data, blob 같은 전송 흔적이 있으면 서버 처리 가능성을 의심합니다.</li>
              <li>폰트, 스크립트, 통계처럼 작은 요청은 페이지 표시용일 수 있으므로 파일 업로드 요청과 구분해서 봅니다.</li>
            </ul>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">서버 방식이 오히려 맞는 경우도 있을까요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">있습니다. 수백 장을 한 번에 처리하거나, 고해상도 원본을 오래 걸리지 않게 변환하거나, AI 보정과 배경 제거처럼 무거운 연산이 필요한 기능은 서버형 도구가 더 자연스러울 수 있습니다. 이때는 서버 사용 자체를 문제로 보기보다 어떤 파일을 맡길지, 보관 기간과 삭제 정책이 명확한지, 처리 뒤 원본을 지울 수 있는지 확인하는 접근이 현실적입니다.</p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 온라인 도구에 사진을 올리면 어디로 가나요?
                </h3>
                <p className="text-brand-mid">
                  대부분은 서버로 업로드해 처리합니다. 이 경우 사진이 외부 서버에
                  일시적으로라도 저장될 수 있습니다. 브라우저에서 처리하는 도구는
                  사진이 기기를 떠나지 않습니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 브라우저에서 처리하면 정말 안전한가요?
                </h3>
                <p className="text-brand-mid">
                  사진이 네트워크로 전송되지 않고 기기 안에서만 처리되므로 업로드
                  방식보다 노출 위험이 낮습니다. 민감한 이미지일수록 차이가 큽니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 처리 속도는 어떤가요?
                </h3>
                <p className="text-brand-mid">
                  파일을 올렸다 받는 왕복이 없어 대체로 빠릅니다. 처리 단계에서
                  사진이 외부로 나가지 않습니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                안전하게, 무료로 사진 다루기
              </h3>
              <p className="text-brand-light mb-6">
                고른 사진은 서버 대신 브라우저에서 처리됩니다. 가입도, 사용 제한도 없습니다.
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
                <Link
                  href="/tools/image/heic-to-jpg"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  HEIC → JPG
                </Link>
              </div>
            </div>

            <BlogExtras slug="browser-image-tools-privacy" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
