import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사 소개 — 플로어공오(floor05)",
  description: "업무 자동화와 대시보드, 홈페이지를 만드는 플로어공오입니다. 0.5층이라는 이름의 뜻, 일하는 기준, 사업자 정보를 소개합니다.",
  alternates: { canonical: "/about" },
  openGraph: { url: "/about" },
};

const VALUES = [
  { title: "나만의 속도", en: "MY OWN TEMPO", body: "남의 속도에 맞추지 않는다. 느리지도 빠르지도 않은, 나에게 맞는 리듬으로 만든다." },
  {
    title: "존재하지 않는 층",
    en: "THE FLOOR THAT DOESN'T EXIST",
    body: "주류와 주류 사이. 보이지 않지만 분명히 존재하는 공간. 비주류라는 건 없다는 게 아니라, 다른 곳에 있다는 것.",
  },
  { title: "과하지 않은 센스", en: "UNDERSTATED SENSE", body: "소리 지르지 않는다. 화려하지 않지만 한번 보면 기억에 남는다." },
];

const RULES = [
  { title: "말한 대로 되는지 기계로 확인합니다", body: "완료는 느낌이 아니라 테스트 결과로 판단합니다." },
  { title: "모르면 모른다고 합니다", body: "확인하지 못한 숫자는 쓰지 않고, 틀린 것을 발견하면 고친 날짜와 함께 바로잡습니다." },
  { title: "필요 없는 건 만들지 않습니다", body: "기존 도구로 충분한 일이면 그렇게 말씀드립니다." },
];

// 실제 날짜만. 12월 전환 항목은 전환 후 추가
const HISTORY = [
  { when: "2026.03", what: "플로어공오 개업. 이미지 압축 도구 공개 — 다용도실의 시작" },
  { when: "2026.03 ~ 06", what: "관리형 독서실 홈페이지 리뉴얼" },
  { when: "2026.05 ~ 06", what: "관리형 독서실 학부모 학습 리포트" },
  { when: "2026.05 ~", what: "제조유통회사 업무 자동화·효율화" },
  { when: "2026.10", what: "다용도실 정비 — 도구를 20개로 줄이고 실측 기반 가이드 연재" },
];

const FLOOR_STACK = [
  { label: "2F", text: "주류 — 대중이 사는 곳", tone: "bg-[#1e1e1e] text-on-dark-subtle" },
  { label: "0.5F", text: "floor05 — 우리가 만드는 곳", tone: "bg-accent text-white font-semibold py-5" },
  { label: "1F", text: "주류 — 대중이 사는 곳", tone: "bg-[#1e1e1e] text-on-dark-subtle" },
  { label: "B1", text: "언더그라운드 — 보이지 않는 곳", tone: "bg-[#161616] text-[#8c8c8c]" },
];

export default function AboutPage() {
  return (
    <>
      <section className="border-t border-[#222] bg-ink text-paper">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-14 px-6 py-24">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            <p className="font-mono text-[13px] tracking-wider text-on-dark-subtle">ABOUT — 0.5층 이야기</p>
            <h1 className="text-3xl leading-normal font-bold sm:text-[38px]">
              건물에는 1층과 2층 사이에
              <br />
              <span className="text-accent-on-dark">존재하지 않는 층</span>이 있다.
            </h1>
            <p className="text-[17px] leading-loose text-on-dark">
              엘리베이터 버튼에도 없고, 안내 표지판에도 없다. 하지만 누군가는 그 층이 있다는 걸 안다. 계단 중간에 멈춰 서면, 위에서도
              아래에서도 들리지 않는 조용한 공간이 있다. 거기서 우리는 만든다.
            </p>
          </div>
          <ol
            aria-label="층 다이어그램"
            className="flex min-w-0 flex-[1_1_380px] flex-col gap-1 font-mono text-[13px]"
          >
            {FLOOR_STACK.map((f) => (
              <li key={f.label} className={`flex gap-4 rounded-md px-5 py-4 ${f.tone}`}>
                <span className="w-11 font-semibold">{f.label}</span>
                <span>{f.text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-9 px-6 py-24">
          <p className="font-mono text-[13px] font-semibold text-accent">01 — 철학</p>
          <div className="flex flex-wrap gap-8">
            {VALUES.map((v) => (
              <div key={v.title} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2">
                <h2 className="text-2xl font-bold">{v.title}</h2>
                <p className="font-mono text-xs tracking-wide text-subtle">{v.en}</p>
                <p className="mt-2 leading-relaxed text-mid">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-5 px-6 py-22">
          <SectionHead label="02 — 0.5층에서 하는 일" title="우리가 말하는 0.5층은 일에도 있습니다." />
          <p className="text-[17px] leading-loose text-mid">
            큰 시스템을 들이기엔 작고, 손으로 버티기엔 커진 일. 어느 업체의 메뉴에도 딱 맞지 않는 그 사이의 일입니다. 플로어공오는 그
            일을 업무 자동화, 데이터 대시보드, 관리자 화면이 있는 홈페이지로 풀어냅니다.
          </p>
          <Link href="/work" className="text-accent hover:text-accent-dark">
            외주 보기 →
          </Link>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-wrap gap-14 px-6 py-24">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            <p className="font-mono text-[13px] font-semibold text-accent">03 — 일하는 기준</p>
            {RULES.map((r) => (
              <div key={r.title} className="flex flex-col gap-2 border-t-2 border-ink pt-4">
                <h3 className="text-lg font-bold">{r.title}</h3>
                <p className="text-[15px] leading-relaxed text-mid">{r.body}</p>
              </div>
            ))}
          </div>
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
            <p className="font-mono text-[13px] font-semibold text-accent">04 — 걸어온 길</p>
            <ol className="flex flex-col">
              {HISTORY.map((h) => (
                <li key={h.what} className="flex gap-5 border-b border-line py-3.5 text-[15px] leading-relaxed">
                  <span className="w-30 flex-none pt-0.5 font-mono text-[13px] text-subtle">{h.when}</span>
                  <span className="min-w-0">{h.what}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap gap-14 px-6 py-22">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-5">
            <p className="font-mono text-[13px] font-semibold text-accent">05 — 사업자 정보</p>
            <dl className="flex flex-col text-[15px]">
              {[
                ["상호", `${BUSINESS.name} (${BUSINESS.brand})`],
                ["대표", BUSINESS.owner],
                ["사업자등록번호", BUSINESS.regNo],
                ["주소", BUSINESS.address],
                ["업종", BUSINESS.category],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-5 border-b border-line py-3">
                  <dt className="w-30 flex-none text-subtle">{k}</dt>
                  <dd className="min-w-0">{v}</dd>
                </div>
              ))}
              <div className="flex gap-5 border-b border-line py-3">
                <dt className="w-30 flex-none text-subtle">문의</dt>
                <dd>
                  <Link href="/contact" className="text-accent hover:text-accent-dark">
                    문의 폼으로 받습니다 →
                  </Link>
                </dd>
              </div>
            </dl>
          </div>
          <figure className="m-0 flex min-w-0 flex-[1_1_460px] flex-col gap-5 rounded-xl bg-ink p-10 text-paper">
            <p className="font-mono text-xs tracking-wider text-on-dark-subtle">FOUNDER&apos;S NOTE</p>
            <blockquote className="leading-loose text-on-dark italic">
              &ldquo;모든 건물에는 0.5층이 있다. 다만 대부분의 사람들은 그 층의 존재를 모른 채 지나친다. 나는 거기서 멈춰서, 문을
              열고, 무언가를 만들기로 했다. 빠르게 성장하는 것보다 오래 만드는 것. 많은 사람이 쓰는 것보다 쓰는 사람이 좋아하는 것.
              floor05는 그런 것들을 만드는 곳이다.&rdquo;
            </blockquote>
            <figcaption className="text-right font-mono text-[13px] text-on-dark-subtle">
              — {BUSINESS.owner}, floor05 대표
            </figcaption>
          </figure>
        </div>
      </section>
    </>
  );
}
