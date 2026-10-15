import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/calc`;

export const metadata: Metadata = {
  title: "급여·퇴직 계산기 - 연봉 실수령액·퇴직금·주휴수당",
  description:
    "2026년 4대보험 요율과 최저임금을 반영한 연봉 실수령액, 퇴직금, 주휴수당 계산기. 일하는 사람이 월급명세서를 볼 때 필요한 세 가지 숫자를 모았습니다.",
  keywords: [
    "급여 계산기",
    "연봉 실수령액 계산기",
    "퇴직금 계산기",
    "주휴수당 계산기",
  ],
  openGraph: {
    title: "급여·퇴직 계산기 - 연봉 실수령액·퇴직금·주휴수당",
    description:
      "입사·이직, 퇴사, 아르바이트 급여 확인처럼 일과 관련된 돈 계산을 상황별로 모았습니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "급여·퇴직 계산기 - 연봉 실수령액·퇴직금·주휴수당",
    description:
      "월급에서 떼는 돈, 퇴사할 때 받는 돈, 시급에 붙는 수당을 2026년 기준으로 확인합니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function CalcToolsPage() {
  const tools = getToolsByCategory("calc");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs([
    "salary-net-pay-guide",
    "severance-pay-guide",
    "weekly-holiday-pay-guide",
  ]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "급여·퇴직 계산기",
      url: PAGE_URL,
      description:
        "연봉 실수령액, 퇴직금, 주휴수당 계산기를 상황별로 찾아볼 수 있는 페이지입니다.",
      mainEntity: {
        "@type": "ItemList",
        itemListElement: tools.map((tool, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: tool.name,
          url: `${SITE_URL}${tool.href}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "홈", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "급여·퇴직 계산기", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "이직 제안서를 받았을 때",
      body: "연봉 숫자만 보고 결정하기 어렵다면 월 실수령액을 먼저 확인하세요. 협상 기준을 잡는 데 도움이 됩니다.",
      href: getToolHref(["연봉", "실수령"], "/tools/calc/salary"),
      label: "연봉 실수령액 계산기",
    },
    {
      title: "퇴사 일정을 정리할 때",
      body: "근속 기간과 평균임금을 넣어 예상 퇴직금을 살펴보면 마지막 급여와 함께 필요한 현금 흐름을 가늠할 수 있습니다.",
      href: getToolHref(["퇴직금"], "/tools/calc/severance"),
      label: "퇴직금 계산기",
    },
    {
      title: "아르바이트 급여가 맞는지 볼 때",
      body: "근무 시간과 시급을 기준으로 주휴수당 포함 여부를 확인하면 급여명세서를 볼 때 덜 헷갈립니다.",
      href: getToolHref(["주휴"], "/tools/calc/wage"),
      label: "주휴수당 계산기",
    },
  ];

  return (
    <>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Header />
      <main className="bg-brand-white">
        <section className="bg-brand-black py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
            <p className="mb-3 font-mono text-sm text-brand-accent">CALCULATORS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              급여·퇴직 계산기
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              월급명세서, 퇴직금 정산, 아르바이트 수당. 일하면서 한 번쯤 직접 맞춰보게 되는 숫자들입니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              세 계산기는 모두 근로자 입장에서 출발합니다. 연봉 실수령액은 국민연금·건강보험·
              고용보험·소득세를 뗀 월급을, 퇴직금은 근로자퇴직급여 보장법의 평균임금 공식을,
              주휴수당은 2026년 최저임금 10,320원과 주 15시간 기준을 적용합니다.
            </p>
            <p>
              계산에 넣은 연봉이나 시급 같은 숫자는 화면에 결과를 그리는 데만
              쓰이고, 탭을 닫는 순간 함께 사라집니다. 민감한 금액일수록 마음 편히
              넣어보세요.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard
                key={tool.href}
                name={tool.name}
                href={tool.href}
                description={tool.description}
              />
            ))}
          </div>
        </section>

        <section className="bg-brand-paper py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <p className="font-mono text-sm text-brand-accent">USE CASES</p>
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 상황에 어떤 계산기?</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.href} className="border border-brand-light/30 bg-brand-white p-5">
                  <h3 className="text-lg font-semibold text-brand-black">{item.title}</h3>
                  <p className="mt-2 leading-7 text-brand-mid">{item.body}</p>
                  <Link
                    href={item.href}
                    className="mt-4 inline-flex font-mono text-sm text-brand-accent transition-colors hover:text-brand-accent-light"
                  >
                    {item.label} 보기
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <AdSlot slot="cta-below" />
        </div>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mb-8">
            <p className="font-mono text-sm text-brand-accent">GUIDES</p>
            <h2 className="mt-2 text-3xl font-bold text-brand-black">관련 가이드</h2>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="border border-brand-light/30 bg-brand-paper p-5 transition-colors hover:border-brand-accent"
              >
                <h3 className="text-lg font-semibold text-brand-black">{post.title}</h3>
                <p className="mt-2 leading-7 text-brand-mid">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
