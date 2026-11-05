import type { Metadata } from "next";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관 — floor05",
  description: "플로어공오 회사 사이트를 이용할 때의 기본 조건입니다. 외주 계약 조건은 개별 계약서로 정합니다.",
  alternates: { canonical: "/terms" },
  openGraph: { url: "/terms" },
};

const SECTIONS = [
  { title: "1. 적용 범위", body: `이 약관은 ${BUSINESS.name}가 운영하는 회사 사이트(www.floor05.com)의 이용에 적용됩니다. 다용도실은 다용도실의 약관을 따릅니다.` },
  { title: "2. 사이트의 내용", body: "사이트의 글과 사례 설명은 회사를 소개하기 위한 것입니다. 사례 화면은 고객 정보를 지키기 위해 데모 데이터로 다시 만든 것입니다." },
  { title: "3. 문의와 진단", body: "문의 폼으로 보내 주신 내용에 영업일 기준 3일 안에 답장합니다. 무료 서면 진단은 계약이나 비용 청구로 이어지지 않습니다." },
  { title: "4. 외주 계약", body: "외주 작업의 범위, 일정, 비용, 소유권, 유지보수 조건은 이 약관이 아니라 개별 계약서로 정합니다." },
  { title: "5. 저작권", body: "사이트의 글, 디자인, 로고의 저작권은 플로어공오에 있습니다. 출처를 밝힌 짧은 인용은 괜찮습니다." },
  { title: "6. 시행일", body: "이 약관은 [확인필요 — 공개일]부터 적용합니다." },
];

export default function TermsPage() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-20">
      <h1 className="text-3xl font-bold">이용약관</h1>
      {SECTIONS.map((s) => (
        <section key={s.title} className="flex flex-col gap-2.5">
          <h2 className="text-xl font-bold">{s.title}</h2>
          <p className="leading-relaxed text-mid">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
