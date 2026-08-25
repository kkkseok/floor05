import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/date`;

export const metadata: Metadata = {
  title: "날짜 계산기 모음 - 만나이·D-Day·음력 한곳에",
  description:
    "만 나이, D-Day, 음력 양력 변환기를 한곳에 모았습니다. 생일과 기념일, 남은 날짜 계산을 목적에 맞게 골라 쓰세요.",
  keywords: [
    "날짜 계산기",
    "만 나이 계산기",
    "D-Day 계산기",
    "디데이 계산기",
    "음력 양력 변환",
    "기념일 계산",
    "전역일 계산기",
  ],
  openGraph: {
    title: "날짜 계산기 모음 - 만나이·D-Day·음력 한곳에",
    description:
      "생일, 전역일, 기념일, 음력 변환까지 날짜와 관련된 계산을 상황별로 빠르게 찾아보세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "날짜 계산기 모음 - 만나이·D-Day·음력 한곳에",
    description:
      "헷갈리는 만 나이부터 D-Day, 음력 변환까지 필요한 날짜 계산 도구로 바로 이동할 수 있습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function DateToolsPage() {
  const tools = getToolsByCategory("date");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["mannai-age-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "날짜 계산기 모음",
      url: PAGE_URL,
      description:
        "만 나이, D-Day, 음력 양력 변환 도구를 상황별로 찾아볼 수 있는 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "날짜 계산기", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "달력 나이와 만 나이가 헷갈릴 때",
      body: "서류나 병원 접수에서 만 나이를 물어보면 생년월일만 넣어 만 나이와 연 나이, 띠를 한 번에 확인할 수 있습니다.",
      href: getToolHref(["만 나이", "나이"], "/tools/date/age"),
      label: "만 나이 계산기",
    },
    {
      title: "전역일이나 기념일을 세고 싶을 때",
      body: "입대일, 100일, 결혼기념일처럼 기준이 되는 날을 넣으면 남은 날짜와 지나온 날짜를 함께 세어 줍니다.",
      href: getToolHref(["D-Day", "디데이"], "/tools/date/dday"),
      label: "D-Day 계산기",
    },
    {
      title: "음력 생일을 양력으로 옮길 때",
      body: "매년 날짜가 달라지는 음력 생일이나 제삿날을 올해 양력으로 바꾸고, 반대로 양력을 음력으로도 확인할 수 있습니다. 윤달과 간지까지 반영합니다.",
      href: getToolHref(["음력"], "/tools/date/lunar"),
      label: "음력 양력 변환",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">DATE TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              날짜 계산기 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              만 나이, D-Day, 음력까지 날짜와 관련된 셈을 목적에 맞게 고릅니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              날짜 계산기 3종을 한 페이지에 모았습니다. 생년월일로 만 나이와 띠를
              확인하고, 목표일까지 남은 D-Day를 세고, 음력과 양력을 서로 바꾸는
              일까지 헷갈리기 쉬운 날짜 계산을 바로 처리할 수 있습니다.
            </p>
            <p>
              생년월일이나 기념일처럼 넣는 날짜는 결과를 계산하는 데만 쓰이고 따로
              기록되지 않습니다. 탭을 닫으면 입력한 날짜도 그대로 사라집니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">언제 어떤 날짜 도구가 필요할까?</h2>
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
