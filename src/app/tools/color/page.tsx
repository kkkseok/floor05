import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/color`;

export const metadata: Metadata = {
  title: "색상 도구 모음 - 코드 변환·대비·그라디언트",
  description:
    "HEX와 RGB를 오가는 코드 변환, 글자 가독성을 위한 명도 대비 확인, 복사해 바로 쓰는 그라디언트까지 한곳에 모았습니다.",
  keywords: [
    "색상 도구",
    "색상 코드 변환",
    "HEX RGB 변환",
    "색상 대비 검사",
    "WCAG 대비",
    "CSS 그라데이션",
    "그라디언트 생성",
  ],
  openGraph: {
    title: "색상 도구 모음 - 코드 변환·대비·그라디언트",
    description:
      "디자인 시안 색을 정리하거나, 접근성 기준을 맞추거나, CSS 배경을 만들 때 필요한 도구로 이동하세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "색상 도구 모음 - 코드 변환·대비·그라디언트",
    description:
      "색을 고르면 코드가 나오고, 두 색의 대비가 기준을 통과하는지 확인하고, 그라디언트 코드를 바로 복사할 수 있습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function ColorToolsPage() {
  const tools = getToolsByCategory("color");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["color-code-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "색상 도구 모음",
      url: PAGE_URL,
      description:
        "HEX·RGB 코드를 변환하고, 색 대비를 WCAG 기준으로 점검하고, CSS 그라디언트를 만드는 도구를 목적별로 찾아볼 수 있는 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "색상 도구", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "디자인 값을 개발용 코드로 옮길 때",
      body: "시안에서 정한 색을 HEX나 RGB, HSL 어느 표기로든 바꿔야 한다면 색을 고른 뒤 필요한 형식으로 복사해 그대로 붙여 넣으면 됩니다.",
      href: getToolHref(["코드 변환"], "/tools/color/converter"),
      label: "색상 코드 변환",
    },
    {
      title: "글자가 잘 읽히는지 확인해야 할 때",
      body: "배경 위 텍스트가 흐릿하게 보인다면 두 색의 명도 대비가 웹접근성 기준을 통과하는지 먼저 확인하는 편이 안전합니다.",
      href: getToolHref(["대비"], "/tools/color/contrast"),
      label: "색상 대비 검사",
    },
    {
      title: "배경에 그라디언트를 넣고 싶을 때",
      body: "여러 색을 부드럽게 잇는 배경이 필요하면 방향과 색 정지점을 조절해 미리 보고, 완성된 CSS 코드를 복사해 쓰면 됩니다.",
      href: getToolHref(["그라데이션"], "/tools/color/gradient"),
      label: "CSS 그라데이션",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">COLOR TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              색상 도구 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              색상 코드 변환, 명도 대비 확인, 그라디언트 코드 생성을 목적별로 고를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              색상 도구 3종은 화면 작업에서 색을 다루는 단계를 나눠 담았습니다.
              HEX·RGB·HSL 사이를 오가는 값 변환, 배경과 글자의 명도 대비 점검, 여러
              색을 자연스럽게 잇는 그라디언트 코드까지 시안을 코드로 옮길 때 필요한
              손질을 모았습니다.
            </p>
            <p>
              색을 고르고 값을 확인하는 계산은 전부 화면 안에서 처리되고, 고른 색이나
              코드가 밖으로 기록되지 않습니다. 공개 전 시안 색이라도 부담 없이
              이것저것 넣어볼 수 있습니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 상황에 어떤 색상 도구?</h2>
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
