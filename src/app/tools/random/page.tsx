import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/random`;

export const metadata: Metadata = {
  title: "랜덤 뽑기 도구 - 사다리타기·룰렛 공정하게",
  description:
    "사다리타기와 룰렛으로 순서를 정하고, 추첨하고, 팀을 나누는 일을 한곳에서 시작합니다.",
  keywords: [
    "랜덤 뽑기",
    "사다리타기",
    "룰렛 돌리기",
    "랜덤 추첨",
    "순서 정하기",
    "팀 나누기",
    "돌림판",
  ],
  openGraph: {
    title: "랜덤 뽑기 도구 - 사다리타기·룰렛 공정하게",
    description:
      "당번이나 발표 순서를 정하거나, 경품 당첨자를 뽑거나, 팀을 가를 때 필요한 도구로 이동하세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "랜덤 뽑기 도구 - 사다리타기·룰렛 공정하게",
    description:
      "이름만 넣으면 사다리와 룰렛이 결과를 뽑아 줍니다. 결과는 그 자리에서 만들어지고 미리 정해두지 않습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function RandomToolsPage() {
  const tools = getToolsByCategory("random");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["random-picker-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "랜덤 뽑기 도구",
      url: PAGE_URL,
      description:
        "사다리타기와 룰렛으로 순서를 정하고, 당첨자를 뽑고, 팀을 나누는 도구를 상황별로 찾아볼 수 있는 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "랜덤 뽑기", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "발표나 당번 순서를 정할 때",
      body: "누가 먼저 할지 서로 미루게 된다면 이름을 줄 세우고 사다리를 태워 순서를 한 번에 정하면 뒷말이 남지 않습니다.",
      href: getToolHref(["사다리"], "/tools/random/ladder"),
      label: "사다리타기",
    },
    {
      title: "경품 당첨자를 뽑을 때",
      body: "참여자 이름을 돌림판에 올리고 한 번 돌리면 당첨자가 정해집니다. 항목마다 확률을 다르게 두고 싶을 때도 가중치로 조절할 수 있습니다.",
      href: getToolHref(["룰렛"], "/tools/random/roulette"),
      label: "룰렛 돌리기",
    },
    {
      title: "인원을 팀으로 가를 때",
      body: "조를 짜야 하는데 편이 갈릴까 걱정된다면 사다리 아래에 조 이름을 배치해 각자 어느 팀에 들어가는지 무작위로 배정할 수 있습니다.",
      href: getToolHref(["사다리"], "/tools/random/ladder"),
      label: "사다리타기",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">RANDOM PICKER</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              랜덤 뽑기 도구
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              순서 정하기, 추첨, 팀 나누기를 사다리타기와 룰렛으로 고를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              랜덤 뽑기 도구 2종은 여럿이 모여 무언가를 정할 때 쓰기 좋습니다.
              발표나 당번 순서를 걸러내는 사다리타기, 항목을 돌려 하나를 뽑는
              룰렛으로 회의, 모임, 이벤트에서 자주 겪는 &lsquo;누가 먼저?&rsquo;를 대신
              정해 줍니다.
            </p>
            <p>
              결과는 미리 만들어 두는 게 아니라 브라우저가 돌리는 순간 즉석에서
              정해집니다. 뽑기 값이 브라우저의 암호학용 난수에서 나오는 덕분에,
              순서를 미리 짜둘 수 없다는 점을 참여한 사람 모두가 화면으로 확인할 수
              있습니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 상황에 어떤 뽑기 도구?</h2>
            </div>
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {useCases.map((item) => (
                <div key={item.title} className="border border-brand-light/30 bg-brand-white p-5">
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
