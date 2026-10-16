import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ContactForm from "@/components/common/ContactForm";

export const metadata: Metadata = {
  title: "문의 - 도구 오류 신고와 기능 제안",
  description:
    "floor05 도구에 대한 불편·오류 신고, 기능 건의, 일반 문의를 폼으로 바로 남겨주세요. 영업일 기준 1~3일 내에 확인합니다.",
  openGraph: {
    url: "/contact",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "문의 - 도구 오류 신고와 기능 제안",
    description:
      "floor05 도구에 대한 불편·오류 신고, 기능 건의, 일반 문의를 폼으로 바로 남겨주세요.",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 페이지 타이틀 */}
          <header className="mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4">
              문의
            </h1>
            <p className="text-lg text-brand-mid">
              불편한 점, 안 되는 기능, 있었으면 하는 기능 — 무엇이든 아래에 바로
              남겨주세요.
            </p>
          </header>

          <div className="space-y-12">
            {/* 문의 폼 */}
            <section>
              <Suspense
                fallback={
                  <div className="bg-brand-paper rounded-lg p-6 text-brand-mid">
                    폼을 불러오는 중…
                  </div>
                }
              >
                <ContactForm />
              </Suspense>
            </section>

            {/* 응답 안내 */}
            <section>
              <h2 className="text-2xl font-bold text-brand-black mb-4">
                응답 안내
              </h2>
              <div className="bg-brand-paper rounded-lg p-6 space-y-3 text-brand-mid">
                <p>
                  <strong className="text-brand-black">응답 시간:</strong>{" "}
                  답변이 필요한 문의는 영업일 기준 1~3일 내에 답변드립니다.
                </p>
                <p>
                  <strong className="text-brand-black">운영 시간:</strong>{" "}
                  평일 오전 10시 ~ 오후 6시 (주말/공휴일 제외)
                </p>
                <p className="text-sm text-brand-light">
                  ※ 작은 팀이 운영하는 서비스라 답변이 다소 늦어질 수 있습니다. 양해
                  부탁드립니다.
                </p>
              </div>
            </section>

            {/* FAQ 안내 */}
            <section className="border-t border-brand-light/20 pt-12">
              <h2 className="text-2xl font-bold text-brand-black mb-4">
                자주 묻는 질문
              </h2>
              <p className="text-brand-mid mb-6">
                문의 전에 아래 내용을 확인해주세요.
              </p>

              <div className="space-y-6">
                <div className="border-b border-brand-light/20 pb-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-2">
                    Q. 파일이 서버로 업로드되나요?
                  </h3>
                  <p className="text-brand-mid">
                    아니요.{" "}
                    <strong>
                      모든 처리가 브라우저에서 이루어지며, 파일이 서버로 전송되지
                      않습니다.
                    </strong>{" "}
                    개인정보가 담긴 이미지도 안심하고 사용하세요.
                  </p>
                </div>

                <div className="border-b border-brand-light/20 pb-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-2">
                    Q. 정말 무료인가요?
                  </h3>
                  <p className="text-brand-mid">
                    네, 모든 기능이 완전 무료입니다. 회원가입이나 결제가 필요
                    없습니다. 서비스 운영은 광고 수익으로 유지됩니다.
                  </p>
                </div>

                <div className="pb-6">
                  <h3 className="text-lg font-semibold text-brand-black mb-2">
                    Q. 처리할 수 있는 파일 크기에 제한이 있나요?
                  </h3>
                  <p className="text-brand-mid">
                    파일당 최대 50MB까지 처리할 수 있습니다. 일괄 처리는
                    데스크톱에서 최대 10장, 모바일에서 최대 5장입니다.
                  </p>
                </div>
              </div>
            </section>

            {/* 도구 바로가기 */}
            <div className="bg-brand-black rounded-lg p-8 text-center mt-12">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                도구 사용하러 가기
              </h3>
              <p className="text-brand-light mb-6">
                설치 없이, 회원가입 없이, 브라우저에서 바로.
              </p>
              <Link
                href="/"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                도구 둘러보기
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
