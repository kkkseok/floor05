import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT_EMAIL } from "@/lib/common/constants";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { TOOLS, TOOL_CATEGORIES, getToolsByCategory } from "@/lib/common/tools";

export const metadata: Metadata = {
  title: "소개 - 존재하지 않는 0.5층, 브라우저에서 끝나는 도구들",
  description:
    "floor05는 브라우저에서 바로 동작하는 무료 온라인 도구를 제공합니다. 이 사이트는 파일과 입력값을 서버로 보내지 않고 브라우저에서 처리합니다.",
  openGraph: {
    url: "/about",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "소개 - 존재하지 않는 0.5층, 브라우저에서 끝나는 도구들",
    description:
      "floor05는 브라우저에서 바로 동작하는 무료 온라인 도구를 제공합니다.",
  },
  alternates: {
    canonical: "/about",
  },
};

const trustItems = [
  {
    title: "생활 계산기 기준",
    description:
      "연봉 실수령액, 퇴직금, 주휴수당 계산기는 국세청 근로소득 간이세액표, 고용노동부 최저임금과 근로기준, 국민연금·건강보험 등 4대보험 공식 요율처럼 공개된 기준을 바탕으로 만듭니다. 요율이 바뀌는 항목은 매년 기준 연도를 함께 갱신합니다.",
  },
  {
    title: "참고용 결과",
    description:
      "floor05의 계산 결과는 법적 효력이 있는 산정서나 전문 상담을 대체하지 않습니다. 제출, 신고, 계약처럼 중요한 결정에는 해당 기관의 최신 기준을 다시 확인해주세요.",
  },
];

const teamFacts = [
  { label: "운영", value: "floor05 팀 (플로어공오)" },
  { label: "시작", value: "2026년 3월, 이미지 압축 도구 공개" },
  { label: "다루는 일", value: "브라우저 안에서 끝나는 이미지·PDF 처리, 근로 소득 계산" },
  { label: "연락", value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
];

const workSteps = [
  {
    title: "도구는 직접 써보고 자동 테스트로 묶습니다",
    description:
      "압축·변환·자르기·PDF 합치기처럼 결과 파일이 나오는 도구는 실제 샘플 파일을 넣어 출력 형식, 치수, 용량을 확인하는 자동 테스트로 검증합니다. 파일이 외부로 전송되지 않는지도 같은 테스트에서 검사합니다.",
  },
  {
    title: "계산기는 원문과 대조합니다",
    description:
      "연봉 실수령액·퇴직금·주휴수당은 국민연금공단, 국민건강보험공단, 국세청, 고용노동부, 국가법령정보센터의 원문 기준을 옮겨 쓰고, 각 도구 아래에 출처 링크와 검토일을 남깁니다. 요율이 바뀌면 기준 연도와 함께 고칩니다.",
  },
  {
    title: "가이드는 도구를 쓰다 생긴 질문에서 시작합니다",
    description:
      "블로그 글은 도구를 만들고 확인하는 과정에서 나온 질문을 정리한 것입니다. 수치는 직접 측정했거나 출처를 밝힐 수 있는 것만 적고, 틀린 내용이 확인되면 수정일을 남기고 고칩니다.",
  },
];

const operationItems = [
  "메인 페이지에는 광고를 두지 않고, 개별 도구 페이지도 콘텐츠 길이에 따라 1~2개만 배치합니다.",
  "파일과 입력값은 수집 대상이 아닙니다. 도구가 일할 공간은 사용자의 브라우저입니다.",
  "아직 준비 중인 도구를 먼저 걸어두지 않습니다. 열면 쓸 수 있는 것만 노출합니다.",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-brand-white text-brand-black">
      <Header />
      <main>
        <section className="border-b border-brand-black/10 bg-brand-paper">
          <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
            <p className="text-sm font-medium text-brand-accent">THE FLOOR THAT DOESN&apos;T EXIST</p>
            <h1 className="mt-4 text-4xl font-semibold tracking-normal text-brand-black sm:text-5xl">
              소개
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-brand-mid">
              존재하지 않는 0.5층에서 만듭니다. 애매하게 필요하지만 막상 찾으면 번거로운 도구들을
              한곳에 모아두는 작은 플랫폼입니다.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-sm text-brand-mid">
              <span className="rounded-full border border-brand-black/10 bg-brand-white px-4 py-2">
                {TOOL_CATEGORIES.length}개 카테고리
              </span>
              <span className="rounded-full border border-brand-black/10 bg-brand-white px-4 py-2">
                {TOOLS.length}개 도구
              </span>
              <span className="rounded-full border border-brand-black/10 bg-brand-white px-4 py-2">
                브라우저 안에서 처리
              </span>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold text-brand-black">floor05란?</h2>
            </div>
            <div className="space-y-5 text-base leading-8 text-brand-mid">
              <p>
                floor05(플로어공오)는 1층과 2층 사이, 있는 듯 없는 0.5층이라는 컨셉에서
                출발했습니다. 대단한 층은 아니지만, 잠깐 들러 필요한 일을 끝내기에는 꽤 괜찮은
                층입니다.
              </p>
              <p>
                사진과 PDF처럼 손에 쥔 파일을 다듬는 일, 그리고 월급명세서를 보다가 생기는 계산을 다룹니다.
                설치할 프로그램을 찾거나 계정을 만들기 전에, 브라우저에서 바로 끝낼 수 있는 도구를
                만드는 것이 목표입니다.
              </p>
              <p>
                간단한 도구입니다. 잘 됩니다. 필요할 때 조용히 열어 쓰면 됩니다.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-brand-paper">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl font-semibold text-brand-black">브라우저 처리 원칙</h2>
              </div>
              <div className="space-y-5 text-base leading-8 text-brand-mid">
                <p>
                  도구 페이지를 여는 순간 필요한 처리 코드가 함께 내려갑니다. 이후 압축, 변환, 계산 같은
                  작업은 사용자의 기기 안에서 실행되며, 결과도 그 자리에서 만들어집니다.
                </p>
                <p>
                  floor05 서버는 페이지를 보여주는 일을 맡고, 사용자가 고른 파일이나 입력한 값을 받아
                  보관하는 흐름은 만들지 않습니다. 민감한 자료일수록 밖으로 덜 나가는 편이 낫습니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-brand-black">제공 도구</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-brand-mid">
                현재 {TOOL_CATEGORIES.length}개 카테고리에서 {TOOLS.length}개 도구를 제공합니다.
                새 도구가 출시되면 이 목록도 함께 바뀝니다.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex w-fit items-center rounded-md bg-brand-black px-4 py-2 text-sm font-medium text-brand-white transition-colors hover:bg-brand-accent"
            >
              전체 도구 보기
            </Link>
          </div>

          <div className="space-y-8">
            {TOOL_CATEGORIES.map((category) => {
              const categoryTools = getToolsByCategory(category.id);

              return (
                <section
                  key={category.id}
                  className="border-t border-brand-black/10 pt-6"
                  aria-labelledby={`category-${category.id}`}
                >
                  <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <h3 id={`category-${category.id}`} className="text-lg font-semibold text-brand-black">
                      {category.label}
                    </h3>
                    <span className="text-sm text-brand-light">{categoryTools.length}개 도구</span>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {categoryTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="group rounded-md border border-brand-black/10 bg-brand-white p-4 transition-colors hover:border-brand-accent"
                      >
                        <span className="block text-sm font-semibold text-brand-black group-hover:text-brand-accent">
                          {tool.name}
                        </span>
                        <span className="mt-1 block text-sm leading-6 text-brand-mid">
                          {tool.shortDescription}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section id="team" className="mx-auto max-w-5xl scroll-mt-20 px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold text-brand-black">만드는 사람들</h2>
              <p className="mt-3 text-base leading-7 text-brand-mid">
                floor05는 floor05 팀이 기획하고 만들고 고칩니다. 블로그와 도구 설명의
                &lsquo;작성·검토&rsquo;도 이 팀입니다.
              </p>
            </div>
            <div className="space-y-8">
              <dl className="grid gap-px overflow-hidden rounded-md border border-brand-black/10 bg-brand-black/10 sm:grid-cols-2">
                {teamFacts.map((fact) => (
                  <div key={fact.label} className="bg-brand-white p-4">
                    <dt className="font-mono text-xs uppercase tracking-wider text-brand-light">{fact.label}</dt>
                    <dd className="mt-1 text-sm font-medium text-brand-black">
                      {fact.href ? (
                        <a href={fact.href} className="text-brand-accent hover:underline">
                          {fact.value}
                        </a>
                      ) : (
                        fact.value
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="text-base leading-8 text-brand-mid">
                파일을 다루는 무료 도구는 대부분 파일을 서버에 올려야 동작합니다. 신분증 사진이나
                계약서 PDF처럼 밖으로 내보내기 꺼려지는 파일도 같은 길을 거쳐야 한다는 점이 floor05의
                출발점이었습니다. 그래서 처리 코드를 브라우저로 보내고, 파일은 사용자 기기에 그대로
                두는 방식으로 만듭니다.
              </p>
              <div className="space-y-5">
                {workSteps.map((step) => (
                  <article key={step.title} className="border-l-2 border-brand-accent pl-4">
                    <h3 className="text-base font-semibold text-brand-black">{step.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-brand-mid">{step.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-brand-paper">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-2xl font-semibold text-brand-black">신뢰 기준</h2>
              </div>
              <div className="grid gap-4">
                {trustItems.map((item) => (
                  <article key={item.title} className="rounded-md border border-brand-black/10 bg-brand-white p-5">
                    <h3 className="text-base font-semibold text-brand-black">{item.title}</h3>
                    <p className="mt-2 text-sm leading-7 text-brand-mid">{item.description}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <h2 className="text-2xl font-semibold text-brand-black">운영 원칙</h2>
            </div>
            <ul className="space-y-3 text-base leading-8 text-brand-mid">
              {operationItems.map((item) => (
                <li key={item} className="border-l-2 border-brand-accent pl-4">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="border-y border-brand-black/10 bg-brand-black text-brand-white">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2 className="text-2xl font-semibold">문의</h2>
                <p className="mt-3 max-w-2xl text-base leading-8 text-brand-light">
                  쓰다가 어색한 부분, 틀린 기준, 있으면 좋을 기능이 보이면 알려주세요. 메일은 {CONTACT_EMAIL}
                  로 받습니다. 0.5층은 엘리베이터가 없어서, 문의가 계단입니다.
                </p>
              </div>
              <Link
                href="/contact"
                className="inline-flex w-fit items-center rounded-md bg-brand-white px-5 py-3 text-sm font-medium text-brand-black transition-colors hover:bg-brand-accent-light"
              >
                문의 페이지
              </Link>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6">
          <h2 className="text-2xl font-semibold text-brand-black">지금 필요한 도구부터 열어보세요</h2>
          <p className="mt-3 text-base leading-7 text-brand-mid">
            설치 없이 가볍게. 결과가 나오면 닫아도 됩니다.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center rounded-md bg-brand-black px-5 py-3 text-sm font-medium text-brand-white transition-colors hover:bg-brand-accent"
          >
            도구 둘러보기
          </Link>
        </section>
      </main>
      <Footer />
    </div>
  );
}
