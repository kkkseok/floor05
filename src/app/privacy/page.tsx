import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import CookieSettings from "@/components/common/CookieSettings";
import { CONTACT_EMAIL } from "@/lib/common/constants";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "floor05의 브라우저 처리 원칙, 문의 폼, 방문 통계와 광고 서비스에서 처리되는 정보 및 이용자 선택권을 안내합니다.",
  alternates: { canonical: "/privacy" },
};

const externalLinkClass = "font-medium text-brand-accent hover:underline";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-brand-black mb-2">개인정보처리방침</h1>
          <p className="text-sm text-brand-light mb-12">시행·최종 수정일: 2026년 8월 25일</p>

          <div className="prose prose-lg max-w-none space-y-10 text-brand-mid">
            <section>
              <p className="leading-relaxed">
                floor05는 회원가입 없이 이용하는 개인 운영 서비스입니다. 도구에 넣은 파일과 계산
                입력값은 원칙적으로 사용자의 브라우저에서 처리하지만, 문의 폼·방문 통계·광고를
                이용할 때는 아래와 같이 제한된 정보가 외부 서비스에서 처리될 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">1. 처리하는 정보와 목적</h2>
              <ul className="list-disc pl-5 space-y-3 marker:text-brand-accent">
                <li>
                  <strong className="text-brand-black">도구 입력:</strong> 이미지·PDF 파일과 계산기
                  입력값은 기능 실행을 위해 브라우저 메모리에서 처리되며 floor05 서버로 업로드하거나
                  계정에 연결해 보관하지 않습니다.
                </li>
                <li>
                  <strong className="text-brand-black">문의:</strong> 문의 유형, 관련 도구, 문의 내용,
                  선택 입력한 회신 이메일을 문의 확인과 답변을 위해 처리합니다.
                </li>
                <li>
                  <strong className="text-brand-black">방문 통계:</strong> 페이지 URL, 유입 경로,
                  대략적인 지역, 브라우저·운영체제·기기 유형 등의 집계 정보를 서비스 개선과 오류
                  파악에 사용합니다.
                </li>
                <li>
                  <strong className="text-brand-black">광고:</strong> Google은 광고 제공, 빈도 제한,
                  측정, 부정 사용 방지와 이용자가 동의한 경우 개인화를 위해 쿠키·기기 정보·IP 주소
                  등의 정보를 처리할 수 있습니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">2. 이용하는 외부 서비스</h2>
              <div className="space-y-5">
                <div>
                  <h3 className="font-semibold text-brand-black">Web3Forms</h3>
                  <p className="mt-1 leading-relaxed">
                    문의 폼 내용을 운영자의 이메일로 전달합니다. Web3Forms는 제출 내용을 별도
                    데이터베이스에 저장하지 않는다고 안내하며, 보안·운영 로그는 미국 동부 서버에서
                    처리되고 주기적으로 최대 약 2개월 내 삭제될 수 있습니다. 자세한 내용은 {" "}
                    <a href="https://docs.web3forms.com/getting-started/faq" target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                      Web3Forms FAQ
                    </a>
                    를 확인하세요.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black">Vercel Web Analytics</h3>
                  <p className="mt-1 leading-relaxed">
                    쿠키를 사용하지 않는 집계형 방문 통계를 제공합니다. Vercel은 방문자 식별용
                    해시와 세션 정보를 24시간 이내 폐기한다고 안내합니다. 자세한 내용은 {" "}
                    <a href="https://vercel.com/docs/analytics/privacy-policy" target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                      Vercel Analytics 개인정보 안내
                    </a>
                    를 확인하세요.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-brand-black">Google AdSense</h3>
                  <p className="mt-1 leading-relaxed">
                    광고 게재와 측정을 위해 Google 및 광고 파트너가 정보를 처리할 수 있습니다. 처리
                    방식과 광고 기술에 관한 설명은 {" "}
                    <a href="https://policies.google.com/technologies/partner-sites" target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                      Google 파트너 사이트 정보 처리 안내
                    </a>
                    와 {" "}
                    <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                      Google 광고 정책
                    </a>
                    에서 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">3. 보관과 삭제</h2>
              <p className="leading-relaxed">
                도구 파일과 계산 입력값은 floor05 서버에 저장하지 않습니다. 문의 내용은 답변과 후속
                확인에 필요한 기간 동안 운영자의 이메일함에 보관한 뒤 삭제할 수 있으며, 삭제 요청을
                받으면 법령상 보관 의무가 없는 범위에서 처리합니다. 외부 서비스의 로그와 쿠키 보관
                기간은 각 사업자의 정책과 이용자 설정에 따릅니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">4. 쿠키와 광고 동의 선택</h2>
              <p className="leading-relaxed">
                유럽경제지역(EEA)·영국·스위스 등 동의가 필요한 지역에서는 Google 인증 동의 관리
                플랫폼(CMP)을 통해 광고 목적과 파트너를 안내하고 선택을 받습니다. 선택은 아래 버튼
                또는 사이트 푸터에서 다시 열어 변경할 수 있습니다. Google 계정의 광고 개인화는 {" "}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer" className={externalLinkClass}>
                  광고 설정
                </a>
                에서도 관리할 수 있습니다.
              </p>
              <CookieSettings className="mt-4 inline-flex rounded-md border border-brand-accent px-4 py-2 text-sm font-medium text-brand-accent transition-colors hover:bg-brand-accent hover:text-white" />
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">5. 이용자의 권리</h2>
              <p className="leading-relaxed">
                문의로 보낸 정보의 열람·정정·삭제를 요청하거나 광고 동의를 변경할 수 있습니다.
                브라우저 설정에서 쿠키를 삭제하거나 차단할 수도 있습니다. 요청 시 본인 확인에 필요한
                최소한의 정보를 확인할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">6. 아동의 개인정보</h2>
              <p className="leading-relaxed">
                floor05는 아동을 대상으로 회원 정보를 수집하지 않습니다. 보호자가 아동이 문의 폼을
                통해 개인정보를 보냈다고 판단하면 삭제를 요청할 수 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">7. 문의처와 방침 변경</h2>
              <p className="leading-relaxed">
                개인정보 관련 요청은 {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className={externalLinkClass}>{CONTACT_EMAIL}</a>
                로 보내주세요. 방침이 바뀌면 시행일과 함께 이 페이지에 게시하며, 중요한 변경은
                필요한 경우 사이트에서 별도로 알립니다.
              </p>
            </section>
          </div>

          <div className="mt-16 pt-8 border-t border-brand-light/20">
            <Link href="/" className="text-brand-accent hover:underline text-sm">← 홈으로 돌아가기</Link>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
