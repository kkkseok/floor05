import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { CONTACT_EMAIL } from "@/lib/common/constants";

export const metadata: Metadata = {
  title: "이용약관",
  description:
    "floor05의 이미지·PDF·계산·변환 도구와 콘텐츠 이용 조건, 결과의 한계, 광고 및 문의 기준을 안내합니다.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-3xl font-bold text-brand-black mb-2">이용약관</h1>
          <p className="text-sm text-brand-light mb-12">시행·최종 수정일: 2026년 10월 15일</p>

          <div className="prose prose-lg max-w-none space-y-10 text-brand-mid">
            <section>
              <p className="leading-relaxed">
                이 약관은 floor05가 제공하는 웹사이트, 도구와 콘텐츠의 이용 조건을 정합니다. 서비스를
                이용하면 이 약관과 개인정보처리방침을 확인하고 동의한 것으로 봅니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">1. 제공 서비스</h2>
              <p className="leading-relaxed mb-4">
                floor05는 회원가입 없이 이용할 수 있는 다음 범주의 무료 도구와 설명 콘텐츠를
                제공합니다.
              </p>
              <ul className="list-disc pl-5 space-y-2 marker:text-brand-accent">
                <li>이미지 압축·변환·크롭·편집 및 PDF 처리</li>
                <li>급여·퇴직금·주휴수당 계산</li>
                <li>글자수 세기 등 텍스트 도구</li>
                <li>도구 사용법과 계산 기준을 설명하는 가이드</li>
              </ul>
              <p className="leading-relaxed mt-4">
                도구 파일과 입력값은 원칙적으로 브라우저에서 처리합니다. 다만 문의 폼으로 직접 보낸
                내용과 외부 분석·광고 서비스에서 처리되는 정보는 {" "}
                <Link href="/privacy" className="font-medium text-brand-accent hover:underline">개인정보처리방침</Link>
                을 따릅니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">2. 이용 조건과 금지 행위</h2>
              <ul className="list-disc pl-5 space-y-2 marker:text-brand-accent">
                <li>도구의 정상적인 개인·업무 목적 사용은 무료입니다.</li>
                <li>타인의 권리를 침해하거나 불법 콘텐츠를 처리·배포해서는 안 됩니다.</li>
                <li>자동화된 과도한 요청, 보안 우회, 서비스 장애 유발 행위를 해서는 안 됩니다.</li>
                <li>사이트의 코드·디자인·콘텐츠를 권한 없이 복제해 별도 서비스로 재배포해서는 안 됩니다.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">3. 이용자 파일과 결과물</h2>
              <p className="leading-relaxed">
                이용자가 선택한 파일과 그 처리 결과에 대한 권리는 원래 권리자에게 있습니다. 이용자는
                해당 파일을 처리할 권한이 있는지 확인해야 하며, floor05는 파일 자체에 대한 권리를
                주장하지 않습니다. 중요한 파일은 처리 전에 원본을 별도로 보관하세요.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">4. 계산 정보의 한계</h2>
              <ul className="list-disc pl-5 space-y-3 marker:text-brand-accent">
                <li>
                  급여·퇴직금·수당 계산 결과는 입력값과 공개된 기준에 따른 예상치입니다. 회사 규정,
                  계약 조건, 과세 유형, 반올림 방식과 최신 법령에 따라 실제 금액이 달라질 수 있습니다.
                </li>
                <li>
                  신고·계약·정산처럼 중요한 결정에는 해당 기관의 최신 자료나 자격을 갖춘 전문가의
                  확인을 우선해야 합니다.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">5. 서비스와 콘텐츠의 변경</h2>
              <p className="leading-relaxed">
                floor05는 정확성과 안정성을 높이기 위해 기능, 계산 기준, 콘텐츠와 제공 범위를 변경할
                수 있습니다. 유지보수, 보안 문제 또는 외부 서비스 장애로 일부 기능이 일시 중단될 수
                있으며, 중요한 변경은 가능한 범위에서 사이트에 안내합니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">6. 책임의 범위</h2>
              <p className="leading-relaxed">
                서비스는 현재 상태로 제공됩니다. floor05는 합리적인 범위에서 오류를 고치고 기준을
                갱신하지만, 모든 환경에서의 중단 없는 동작이나 특정 목적에 맞는 결과를 보장하지는
                않습니다. 관련 법령이 허용하는 범위에서, 이용자가 결과를 검증하지 않고 사용해 발생한
                간접 손해에 대한 책임은 제한될 수 있습니다. 이 조항은 법령상 배제할 수 없는 책임을
                제한하지 않습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">7. 광고와 외부 링크</h2>
              <p className="leading-relaxed">
                운영 비용을 충당하기 위해 Google AdSense 등의 광고를 표시할 수 있습니다. 광고와 외부
                링크의 상품·서비스는 해당 제공자가 책임지며, floor05가 그 내용을 보증하거나 계약의
                당사자가 되는 것은 아닙니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-brand-black mb-4">8. 준거법·문의·변경</h2>
              <p className="leading-relaxed">
                이 약관은 대한민국 법률에 따라 해석하며, 분쟁의 관할은 관련 법령이 정하는 절차를
                따릅니다. 문의는 {" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-brand-accent hover:underline">
                  {CONTACT_EMAIL}
                </a>
                로 보내주세요. 약관이 바뀌면 시행일과 함께 이 페이지에 게시합니다.
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
