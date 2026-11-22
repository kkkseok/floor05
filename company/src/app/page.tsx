import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import SelfCheck from "@/components/home/SelfCheck";
import DiagnosisCta from "@/components/DiagnosisCta";
import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { CASES, FEATURED_TOOLS, FLOORS, WAYS } from "@/lib/content";
import { REPLY_DAYS, UTILITY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "업무 자동화·대시보드·홈페이지 제작 — floor05",
  description:
    "손이 많이 가는 반복 업무를 자동화와 대시보드로 바꿉니다. 관리자 화면이 있는 홈페이지, 사내 브라우저 도구까지 만드는 플로어공오입니다.",
  alternates: { canonical: "/" },
  openGraph: { url: "/" },
};

export default function HomePage() {
  return (
    <>
      <section className="border-t border-[#222] bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-6 pt-20 pb-24">
          <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-6">
            <p className="font-mono text-[13px] tracking-wider text-on-dark-subtle">FLOOR05 · 존재하지 않는 층에서 만듭니다</p>
            <h1 className="text-4xl leading-tight font-bold tracking-tight sm:text-[54px]">
              매일 하는 일을,
              <br />
              더 적은 손으로.
            </h1>
            <p className="text-lg leading-relaxed text-on-dark">
              반복 업무 자동화, 데이터 대시보드, 관리자 화면이 있는 홈페이지를 만듭니다.
              <br className="hidden sm:block" /> 큰 시스템을 들이기엔 작고, 손으로 하기엔 커진 일이 저희 전문입니다.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/contact"
                className="rounded-md bg-accent px-6 py-3.5 font-medium text-white no-underline hover:bg-accent-dark"
              >
                무료 서면 진단 받기
              </Link>
              <a
                href="#check"
                className="rounded-md border border-subtle px-6 py-3.5 text-paper no-underline hover:border-paper"
              >
                내 업무 체크해 보기
              </a>
            </div>
            <p className="text-sm text-on-dark-subtle">
              지금 하는 일을 적어 보내 주시면, 줄일 수 있는지 영업일 {REPLY_DAYS}일 안에 글로 답장드립니다. 만들 필요가 없는
              일이면 그렇게 말씀드립니다.
            </p>
          </div>
          <BeforeAfter />
        </div>
      </section>

      <section id="check" className="scroll-mt-4 bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-7 px-6 py-20">
          <SectionHead label="01 — 내 업무 체크" title="이 중에 하고 계신 일이 있나요?" lead="해당하는 것을 눌러 보세요." />
          <SelfCheck />
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <SectionHead
            label="02 — 0.5층의 일"
            title="1층과 2층 사이에 있는 일"
            lead="큰 시스템을 들이기엔 작고, 손으로 버티기엔 커진 일. 어느 업체 메뉴에도 없는 그 중간 층의 일을 합니다."
          />
          <div className="flex flex-col gap-1.5">
            {FLOORS.map((floor) => (
              <div
                key={floor.label}
                className={`flex flex-wrap items-start gap-5 rounded-lg ${
                  floor.highlight ? "bg-accent p-6 text-white" : "bg-[#2a2a2a] px-6 py-5 text-[#e6e2dc]"
                }`}
              >
                <div className="flex flex-[0_0_200px] flex-col gap-1">
                  <span className="font-mono text-[15px] font-semibold">{floor.label}</span>
                  <strong className="text-lg">{floor.name}</strong>
                </div>
                <dl className="contents">
                  <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1">
                    <dt className="font-mono text-xs opacity-80">일하는 방식</dt>
                    <dd className="text-[15px] leading-relaxed">{floor.how}</dd>
                  </div>
                  <div className="flex min-w-0 flex-[1_1_260px] flex-col gap-1">
                    <dt className="font-mono text-xs opacity-80">잘 맞는 경우</dt>
                    <dd className="text-[15px] leading-relaxed">{floor.fit}</dd>
                  </div>
                </dl>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <SectionHead label="03 — 만든 것" title="최근에 만든 것" />
            <Link href="/work" className="text-accent hover:text-accent-dark">
              사례 전체 보기 →
            </Link>
          </div>
          <div className="flex flex-wrap gap-5">
            {CASES.map((c) => (
              <article key={c.title} className="flex min-w-0 flex-[1_1_320px] flex-col overflow-hidden rounded-lg bg-white">
                <ScreenPlaceholder label="[화면 캡처 — 데모 데이터]" className="h-44" />
                <div className="flex flex-col gap-2.5 p-6">
                  <p className="text-[13px] text-subtle">
                    {c.client} · {c.period}
                  </p>
                  <h3 className="text-lg font-bold">{c.title}</h3>
                  <p className="text-[15px] leading-relaxed text-mid">{c.summary}</p>
                  {c.result && <p className="border-t border-[#eeeae4] pt-2.5 text-[15px] font-medium text-accent">{c.result}</p>}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-12 px-6 py-24">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
            <SectionHead
              label="04 — 지금 써 보세요"
              title={
                <>
                  저희가 만든 도구 20개,
                  <br />
                  지금 바로 써 볼 수 있습니다.
                </>
              }
            />
            <p className="text-[17px] leading-relaxed text-mid">
              <strong className="text-ink">다용도실</strong>은 floor05가 직접 만들고 매일 고치는 서비스입니다. 사진 압축부터 연봉
              실수령액 계산까지, 가입 없이 열어서 써 보시면 저희가 어떻게 만드는지 바로 보입니다.
            </p>
            <p className="rounded-lg bg-paper px-4 py-3.5 text-[15px] leading-relaxed text-mid">
              다용도실은 서버 없이 브라우저에서만 돌아가서 운영비가 거의 들지 않습니다. 의뢰하신 일도 이런 구조가 가능하면 먼저
              제안합니다. 만든 뒤 매달 나가는 돈까지 같이 봅니다.
            </p>
            <a
              href={UTILITY_URL}
              className="self-start rounded-md border border-ink px-5 py-3 text-[15px] text-ink no-underline hover:bg-ink hover:text-white"
            >
              다용도실 열어 보기 →
            </a>
          </div>
          <div className="flex min-w-0 flex-[1_1_420px] flex-wrap gap-2.5">
            {FEATURED_TOOLS.map((tool) => (
              <a
                key={tool.label}
                href={tool.href}
                className="flex min-w-0 flex-[1_1_180px] justify-between rounded-lg border border-line bg-white p-5 text-[15px] font-medium text-ink no-underline hover:border-ink"
              >
                {tool.label}
                <span aria-hidden="true" className="text-accent">
                  ↗
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <SectionHead label="05 — 일하는 방식" title="이렇게 일합니다" />
          <div className="flex flex-wrap gap-8">
            {WAYS.map((way) => (
              <div key={way.title} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2.5 border-t-2 border-ink pt-5">
                <h3 className="text-lg font-bold">{way.title}</h3>
                <p className="text-[15px] leading-relaxed text-mid">{way.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <DiagnosisCta />
    </>
  );
}

// 첫 화면 전후 비교 그림. 데모 데이터 대시보드 캡처가 준비되면 이미지로 바꾼다
function BeforeAfter() {
  return (
    <div
      role="img"
      aria-label="전후 비교: 여러 엑셀 파일과 수작업이 대시보드 한 화면으로 바뀌는 그림"
      className="flex min-w-0 flex-[1_1_440px] items-stretch gap-2"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2 rounded-lg border border-dashed border-mid bg-[#1e1e1e] p-4">
        <span className="font-mono text-xs text-on-dark-subtle">BEFORE</span>
        {["w-full", "w-4/5", "w-11/12", "w-3/5"].map((w) => (
          <div key={w} className={`h-6 rounded bg-[#2e2e2e] ${w}`} />
        ))}
        <span className="mt-1 text-[13px] text-on-dark-subtle">파일 여러 개 · 복사 · 붙여넣기</span>
      </div>
      <div aria-hidden="true" className="flex items-center text-xl text-accent-on-dark">
        →
      </div>
      <div className="flex min-w-0 flex-[1.3] flex-col gap-2.5 rounded-lg bg-paper p-4 text-ink">
        <span className="font-mono text-xs text-subtle">AFTER</span>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-11 flex-1 rounded bg-white" />
          ))}
        </div>
        <div className="flex h-20 items-end gap-1.5 rounded bg-white p-2.5">
          {["h-2/5", "h-[70%]", "h-[55%]"].map((h) => (
            <div key={h} className={`flex-1 bg-line ${h}`} />
          ))}
          <div className="h-[90%] flex-1 bg-accent" />
        </div>
        <span className="text-[13px] text-mid">화면 하나 · 자동 집계</span>
      </div>
    </div>
  );
}
