import type { Metadata } from "next";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침 — floor05",
  description: "플로어공오가 문의 폼으로 받는 개인정보의 항목, 목적, 보유 기간과 처리 방법을 안내합니다.",
  alternates: { canonical: "/privacy" },
  openGraph: { url: "/privacy" },
};

// 공개 전 확정 필요: 보유 기간, 보호책임자 연락처(법령 확인 후). [확인필요] 문자열이 남아 있으면 공개하지 않는다
const SECTIONS = [
  {
    title: "1. 받는 항목",
    body: "문의 폼으로 이름, 회신 받을 이메일, 문의 내용을 받습니다. 회사 이름, 예산, 희망 시점, 도구 이름처럼 선택 칸에 적어 주신 내용도 함께 받습니다.",
  },
  { title: "2. 쓰는 목적", body: "문의에 답장하고, 외주 상담과 견적을 진행하는 데에만 씁니다. 광고나 홍보 메일을 보내는 데 쓰지 않습니다." },
  { title: "3. 보유 기간", body: "답장과 상담이 끝난 뒤 [확인필요 — 보유 기간]이 지나면 지웁니다. 계약으로 이어진 경우에는 관련 법령이 정한 기간 동안 보관합니다." },
  {
    title: "4. 처리를 맡기는 곳",
    body: "문의 내용을 운영자 메일함으로 보내기 위해 이메일 발송 서비스 Resend(미국)를 씁니다. 발송에 필요한 범위에서만 전달되며, 국외 이전에 관한 세부 항목은 [확인필요]입니다.",
  },
  { title: "5. 제3자 제공", body: "법령에 따른 요청이 있는 경우를 빼고는 다른 곳에 제공하지 않습니다." },
  { title: "6. 열람·정정·삭제", body: "보내 주신 정보를 확인하거나 지워 달라고 요청하실 수 있습니다. 문의 폼으로 요청해 주시면 지체 없이 처리합니다." },
  {
    title: "7. 개인정보 보호책임자",
    body: `${BUSINESS.owner} (대표) · 연락처 [확인필요]`,
  },
  { title: "8. 시행일", body: "이 방침은 [확인필요 — 공개일]부터 적용합니다." },
];

export default function PrivacyPage() {
  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-8 px-6 py-20">
      <h1 className="text-3xl font-bold">개인정보처리방침</h1>
      <p className="leading-relaxed text-mid">
        {BUSINESS.name}({BUSINESS.brand})는 문의에 답하는 데 필요한 정보만 받고, 쓰고 나면 지웁니다.
      </p>
      {SECTIONS.map((s) => (
        <section key={s.title} className="flex flex-col gap-2.5">
          <h2 className="text-xl font-bold">{s.title}</h2>
          <p className="leading-relaxed text-mid">{s.body}</p>
        </section>
      ))}
    </article>
  );
}
