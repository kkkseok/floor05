import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/health`;

export const metadata: Metadata = {
  title: "건강 계산기 모음 - BMI·기초대사량·배란일",
  description:
    "BMI, 기초대사량, 배란일, 임신 주수 계산기를 한곳에 모았습니다. 모두 공식으로 계산한 참고용 추정치이며 진단을 대신하지 않습니다.",
  keywords: [
    "건강 계산기",
    "BMI 계산기",
    "기초대사량 계산기",
    "BMR 계산기",
    "배란일 계산기",
    "임신 주수 계산기",
    "비만도 계산",
  ],
  openGraph: {
    title: "건강 계산기 모음 - BMI·기초대사량·배란일",
    description:
      "체형 확인, 다이어트 칼로리, 생리 주기 관리에 참고할 계산기를 목적별로 모았습니다. 결과는 참고용입니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "건강 계산기 모음 - BMI·기초대사량·배란일",
    description:
      "BMI와 기초대사량부터 배란일, 임신 주수까지 필요한 건강 계산기로 바로 이동하세요. 진단이 아닌 참고용입니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function HealthToolsPage() {
  const tools = getToolsByCategory("health");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["bmi-obesity-guide", "ovulation-calculation-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "건강 계산기 모음",
      url: PAGE_URL,
      description:
        "BMI, 기초대사량, 배란일, 임신 주수를 참고용으로 확인할 수 있는 계산기를 모은 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "건강 계산기", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "내 체형이 어느 구간인지 볼 때",
      body: "키와 몸무게로 BMI를 계산하면 대한비만학회 기준에서 어느 구간에 드는지 대략적인 위치를 참고할 수 있습니다. 진단이 아니라 방향을 잡는 용도로 보세요.",
      href: getToolHref(["BMI"], "/tools/health/bmi"),
      label: "BMI 계산기",
    },
    {
      title: "감량 계획의 칼로리를 잡을 때",
      body: "기초대사량과 활동량으로 하루 소비 칼로리를 추정하면, 유지·감량·증량 목표에 맞춰 대략적인 섭취 기준을 세우는 데 참고가 됩니다.",
      href: getToolHref(["기초대사량", "BMR"], "/tools/health/bmr"),
      label: "기초대사량 계산기",
    },
    {
      title: "배란일과 가임기를 챙길 때",
      body: "마지막 생리일과 평균 주기를 넣으면 배란 예정일과 가임기, 다음 생리일을 추정합니다. 주기가 불규칙하면 오차가 커질 수 있으니 참고 정도로 보세요.",
      href: getToolHref(["배란일"], "/tools/health/ovulation"),
      label: "배란일 계산기",
    },
    {
      title: "임신 주수와 출산예정일이 궁금할 때",
      body: "마지막 생리일을 기준으로 현재 임신 주수와 출산예정일, 삼분기 진행률을 추정합니다. 정확한 주수는 초음파 검사로 확인하는 것이 좋습니다.",
      href: getToolHref(["임신"], "/tools/health/pregnancy"),
      label: "임신 주수 계산기",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">HEALTH TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              건강 계산기 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              BMI, 기초대사량, 배란일, 임신 주수를 참고용으로 확인할 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              건강 계산기 4종을 한 페이지에 모았습니다. 키와 몸무게로 BMI와 비만도를
              보고, 기초대사량과 하루 권장 칼로리를 가늠하고, 생리 주기로 배란일과
              임신 주수를 추정하는 일을 한곳에서 할 수 있습니다.
            </p>
            <p>
              여기서 나오는 숫자는 일반적인 공식으로 계산한 참고용 추정치이며, 의학적
              진단이나 처방을 대신하지 않습니다. 몸 상태가 걱정된다면 전문의와
              상담하시고, 입력한 키·몸무게·생리일 같은 정보는 저장되지 않습니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">상황별로 어떤 건강 계산기?</h2>
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
