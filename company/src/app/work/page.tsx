import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import DiagnosisCta from "@/components/DiagnosisCta";
import { CASES, OWN_PROJECTS, SERVICES, STEPS, WORK_FAQS } from "@/lib/content";
import { REPLY_DAYS } from "@/lib/site";

export const metadata: Metadata = {
  title: "외주 — 업무 자동화, 데이터 대시보드, 홈페이지 제작 | floor05",
  description:
    "반복 업무를 줄이는 대시보드와 자동화, 관리자 화면이 있는 홈페이지를 만듭니다. 관리형 독서실, 제조유통회사 작업 사례를 소개합니다.",
  alternates: { canonical: "/work" },
  openGraph: { url: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <section className="border-t border-[#222] bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 pt-20 pb-24">
          <p className="font-mono text-[13px] tracking-wider text-on-dark-subtle">WORKROOM — 외주</p>
          <h1 className="text-4xl leading-snug font-bold sm:text-[46px]">
            업무 자동화, 데이터 대시보드,
            <br />
            홈페이지를 만듭니다.
          </h1>
          <p className="max-w-3xl text-lg leading-relaxed text-on-dark">
            매일 반복하는 일, 엑셀로 버티는 관리, 고치기 겁나는 홈페이지. 큰 시스템을 들이기엔 작고 손으로 하기엔 커진 그 일을,
            딱 필요한 만큼의 화면과 자동화로 바꿉니다.
          </p>
          <div className="flex flex-wrap items-center gap-3.5">
            <Link
              href="/contact"
              className="rounded-md bg-accent px-6 py-3.5 font-medium text-white no-underline hover:bg-accent-dark"
            >
              무료 서면 진단 받기
            </Link>
            <span className="text-sm text-on-dark-subtle">지금 하는 일을 보내 주시면 영업일 {REPLY_DAYS}일 안에 글로 답장드립니다.</span>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <SectionHead label="01 — 할 수 있는 일" title="이런 걸 만듭니다" />
          <div className="flex flex-wrap gap-5">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="flex min-w-0 flex-[1_1_500px] flex-col gap-3.5 rounded-xl border border-line bg-white p-8">
                <span className="font-mono text-[13px] font-semibold text-accent">0{i + 1}</span>
                <h3 className="text-[23px] font-bold">{s.title}</h3>
                <p className="leading-relaxed text-mid">{s.body}</p>
                <p className="rounded-md bg-paper px-3.5 py-2.5 text-sm">이런 경우에 — {s.when}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <SectionHead
            label="02 — 만든 것"
            title="사례"
            lead="고객 정보 보호를 위해 업종으로만 표기하고, 화면은 데모 데이터로 보여 드립니다."
          />
          {CASES.map((c) => (
            <article key={c.title} className="flex flex-wrap overflow-hidden rounded-xl bg-white">
              <ScreenPlaceholder label="[화면 캡처 — 데모 데이터]" className="min-h-64 min-w-0 flex-[1_1_380px]" />
              <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-3.5 p-8">
                <p className="text-sm text-subtle">
                  {c.client} · {c.period}
                </p>
                <h3 className="text-[23px] font-bold">{c.title}</h3>
                <dl className="flex flex-col gap-2.5 text-[15px] leading-relaxed">
                  <CaseRow term="상황">{c.situation}</CaseRow>
                  <CaseRow term="만든 것">{c.built}</CaseRow>
                  {c.result && (
                    <CaseRow term="달라진 점">
                      <span className="text-accent">{c.result}</span>
                    </CaseRow>
                  )}
                </dl>
              </div>
            </article>
          ))}
          <div className="flex flex-wrap gap-4">
            {OWN_PROJECTS.map((p) => (
              <div key={p.title} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2 rounded-xl bg-white p-6">
                <p className="text-[13px] text-subtle">{p.kind}</p>
                <h3 className="text-lg font-bold">{p.title}</h3>
                <p className="text-[15px] leading-relaxed text-mid">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <SectionHead label="03 — 진행 방식" title="문의부터 인도까지" />
          <ol className="flex flex-wrap gap-3">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex min-w-0 flex-[1_1_150px] flex-col gap-2 border-t-[3px] border-ink px-1 pt-4">
                <span className="font-mono text-[13px] font-semibold text-accent">0{i + 1}</span>
                <strong className="text-[17px]">{step.title}</strong>
                <span className="text-sm leading-relaxed text-mid">{step.body}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-3xl flex-col gap-7 px-6 py-24">
          <SectionHead label="04 — 자주 묻는 질문" title="자주 묻는 질문" />
          <div className="flex flex-col">
            {WORK_FAQS.map((faq) => (
              <details key={faq.q} className="border-b border-line py-5">
                <summary className="cursor-pointer text-lg font-medium">{faq.q}</summary>
                <p className="mt-3.5 leading-relaxed text-mid">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <DiagnosisCta />
    </>
  );
}

function CaseRow({ term, children }: { term: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-3">
      <dt className="w-20 flex-none font-medium text-subtle">{term}</dt>
      <dd className="min-w-0">{children}</dd>
    </div>
  );
}
