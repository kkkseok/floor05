import type { Metadata } from "next";
import { Suspense } from "react";
import SectionHead from "@/components/SectionHead";
import ContactForm from "@/components/contact/ContactForm";
import { INQUIRY_TYPES, TASKS, type InquiryType } from "@/lib/content";
import { REPLY_DAYS } from "@/lib/site";

export const metadata: Metadata = {
  title: "문의 — floor05",
  description: `외주 의뢰와 무료 서면 진단, 다용도실 이용, 제휴 문의를 한 곳에서 받습니다. 영업일 기준 ${REPLY_DAYS}일 안에 답장드립니다.`,
  alternates: { canonical: "/contact" },
  openGraph: { url: "/contact" },
};

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-3xl px-6 pt-18 pb-12">
          <SectionHead
            as="h1"
            label="CONTACT — 문의"
            title="무엇이든 여기로 보내 주세요"
            lead={`영업일 기준 ${REPLY_DAYS}일 안에 적어 주신 이메일로 답장드립니다. 외주를 고민 중이시라면, 지금 하는 일을 적어 주세요. 줄일 수 있는지 글로 진단해 드립니다(무료).`}
          />
        </div>
      </section>
      <section>
        <div className="relative mx-auto max-w-3xl px-6 pt-12 pb-24">
          <Suspense fallback={<ContactForm initialType="work" initialBody="" />}>
            <PrefilledForm searchParams={searchParams} />
          </Suspense>
        </div>
      </section>
    </>
  );
}

// 홈 '내 업무 체크'에서 고른 항목·유형을 쿼리로 받아 미리 채운다. 쿼리는 요청 때만 알 수 있어 Suspense 안에서 읽는다
async function PrefilledForm({ searchParams }: { searchParams: PageProps<"/contact">["searchParams"] }) {
  const params = await searchParams;
  const typeParam = typeof params.type === "string" ? params.type : "";
  const initialType: InquiryType = INQUIRY_TYPES.some((t) => t.id === typeParam) ? (typeParam as InquiryType) : "work";

  const taskIds = typeof params.tasks === "string" ? params.tasks.split(",") : [];
  const picked = TASKS.filter((t) => taskIds.includes(t.id));
  const initialBody = picked.length
    ? `체크한 업무:\n${picked.map((t) => `- ${t.now}`).join("\n")}\n\n지금 하는 방식:\n`
    : "";

  return <ContactForm initialType={initialType} initialBody={initialBody} />;
}
