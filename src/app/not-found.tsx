import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없습니다",
  description: "주소가 바뀌었거나 정리된 페이지입니다. 지금 쓸 수 있는 도구와 글로 안내합니다.",
};

const destinations = [
  { href: "/tools/image", label: "이미지 도구", note: "압축·변환·자르기·합치기" },
  { href: "/tools/pdf", label: "PDF 도구", note: "합치기·나누기·사진을 PDF로" },
  { href: "/tools/calc", label: "근로 계산기", note: "연봉·퇴직금·주휴수당" },
  { href: "/blog", label: "블로그", note: "직접 재 본 기록" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />

      <main className="flex-1">
        <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <p className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-4">404</p>
          <h1 className="text-3xl font-bold text-brand-black mb-4">이 층에는 그 페이지가 없습니다</h1>
          <p className="text-brand-mid leading-relaxed mb-10">
            주소가 바뀌었거나, 사이트를 정리하면서 내린 페이지입니다. 일부 도구는 2026년 10월에
            정리했습니다. 아래에서 지금 쓸 수 있는 곳으로 이동해 주세요.
          </p>

          <ul className="grid gap-4 sm:grid-cols-2">
            {destinations.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block rounded-lg bg-brand-paper px-5 py-4 transition-colors hover:bg-brand-light/20"
                >
                  <span className="block font-semibold text-brand-black">{item.label}</span>
                  <span className="mt-1 block text-sm text-brand-mid">{item.note}</span>
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-10 text-sm text-brand-mid">
            <Link href="/" className="font-medium text-brand-accent hover:underline">
              홈으로 가기
            </Link>
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
