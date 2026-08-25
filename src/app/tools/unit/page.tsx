import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/unit`;

export const metadata: Metadata = {
  title: "단위 변환기 모음 - 평·길이·온도 바로 환산",
  description:
    "평수, 길이, 온도 변환기를 한곳에 모았습니다. 평과 제곱미터, cm와 인치, 섭씨와 화씨를 어느 칸에 넣어도 바로 환산합니다.",
  keywords: [
    "단위 변환기",
    "평수 변환",
    "제곱미터 평 변환",
    "길이 변환",
    "cm 인치 변환",
    "온도 변환",
    "섭씨 화씨 변환",
  ],
  openGraph: {
    title: "단위 변환기 모음 - 평·길이·온도 바로 환산",
    description:
      "부동산 면적, 해외 사이즈, 요리 온도처럼 단위가 다른 값을 목적에 맞게 바로 바꿔보세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "단위 변환기 모음 - 평·길이·온도 바로 환산",
    description:
      "평과 ㎡, cm와 인치, 섭씨와 화씨까지 필요한 단위 변환기로 바로 이동할 수 있습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function UnitToolsPage() {
  const tools = getToolsByCategory("unit");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["pyeong-conversion-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "단위 변환기 모음",
      url: PAGE_URL,
      description:
        "평수, 길이, 온도 변환기를 상황별로 찾아볼 수 있는 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "단위 변환기", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "부동산 면적을 평으로 볼 때",
      body: "매물 정보에 84㎡처럼 제곱미터로 적혀 있으면 평으로 바꿔 대략적인 넓이를 가늠할 수 있습니다. 반대로 평을 ㎡로도 환산합니다.",
      href: getToolHref(["평수", "평"], "/tools/unit/pyeong"),
      label: "평수 변환",
    },
    {
      title: "해외 사이즈를 맞출 때",
      body: "인치로 표기된 옷, 모니터, 가구 치수를 cm로 바꾸거나 반대로 cm를 인치로 옮겨 국내 기준과 비교할 수 있습니다.",
      href: getToolHref(["길이"], "/tools/unit/length"),
      label: "길이 변환",
    },
    {
      title: "해외 요리법의 온도를 볼 때",
      body: "화씨로 적힌 오븐 온도를 섭씨로 바꾸면 국내 오븐에 맞춰 조리하기 편합니다. 섭씨, 화씨, 켈빈을 양방향으로 환산합니다.",
      href: getToolHref(["온도"], "/tools/unit/temperature"),
      label: "온도 변환",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">UNIT TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              단위 변환기 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              평과 제곱미터, 길이, 온도처럼 단위가 다른 값을 서로 바로 환산합니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              단위 변환기 3종을 한 페이지에 모았습니다. 평과 제곱미터를 오가고, cm와
              인치를 맞추고, 섭씨와 화씨를 바꾸는 일처럼 단위가 달라 헷갈리는 값을
              어느 칸에 넣어도 나머지가 바로 채워집니다.
            </p>
            <p>
              숫자를 입력하면 서버를 거치지 않고 화면에서 바로 계산되므로 기다릴
              필요가 없습니다. 설치나 로그인 없이 브라우저에서 곧바로 쓸 수 있습니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 변환이 필요할 때?</h2>
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
