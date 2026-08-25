import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/pdf`;

export const metadata: Metadata = {
  title: "PDF 도구 모음 - 이미지→PDF·병합·분할",
  description:
    "사진을 PDF로 묶고, 여러 문서를 하나로 합치고, 필요한 페이지만 떼어내는 작업을 한 페이지에서 시작합니다.",
  keywords: [
    "PDF 도구",
    "이미지 PDF 변환",
    "PDF 합치기",
    "PDF 병합",
    "PDF 분할",
    "사진 PDF",
    "PDF 페이지 추출",
  ],
  openGraph: {
    title: "PDF 도구 모음 - 이미지→PDF·병합·분할",
    description:
      "제출용 서류 만들기, 흩어진 PDF 정리, 특정 페이지만 골라내기까지 목적에 맞는 도구로 이동하세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 도구 모음 - 이미지→PDF·병합·분할",
    description:
      "여러 장 사진을 한 문서로 묶거나, 합친 PDF를 다시 낱장으로 나누는 일을 브라우저 안에서 끝냅니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function PdfToolsPage() {
  const tools = getToolsByCategory("pdf");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs(["image-to-pdf-guide"]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "PDF 도구 모음",
      url: PAGE_URL,
      description:
        "이미지를 PDF로 변환하고, 문서를 병합하거나 페이지 단위로 분할하는 도구를 상황별로 찾아볼 수 있는 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "PDF 도구", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "사진 여러 장을 서류로 제출해야 할 때",
      body: "영수증이나 계약서를 찍어 두었다면 낱장 이미지를 한 PDF로 묶어야 접수처에서 받기 편합니다. 순서와 여백만 맞추면 그대로 제출용이 됩니다.",
      href: getToolHref(["이미지 PDF", "PDF 변환"], "/tools/pdf/image-to-pdf"),
      label: "이미지 PDF 변환",
    },
    {
      title: "따로 받은 PDF를 하나로 모을 때",
      body: "부서마다 보낸 보고서나 회차별 자료가 흩어져 있다면 원하는 순서대로 이어 붙여 한 파일로 관리하는 편이 나중에 찾기 쉽습니다.",
      href: getToolHref(["합치기", "병합"], "/tools/pdf/merge"),
      label: "PDF 합치기",
    },
    {
      title: "긴 문서에서 몇 쪽만 필요할 때",
      body: "전체를 다 보낼 필요 없이 해당 페이지만 골라내거나, 반대로 모든 장을 낱장으로 쪼개 각각 다뤄야 할 때 페이지 단위로 정리합니다.",
      href: getToolHref(["분할"], "/tools/pdf/split"),
      label: "PDF 분할",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">PDF TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              PDF 도구 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              사진을 문서로 묶고, 여러 PDF를 합치고, 페이지를 나누는 일을 목적별로 고를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              PDF 도구 3종은 서류를 만들고 정리하는 흐름을 다룹니다. 스캔한 사진을
              한 문서로 묶기, 따로 받은 PDF 여러 개를 순서대로 잇기, 긴 파일에서
              필요한 쪽만 떼어내기까지 제출 직전에 자주 하는 손질을 모았습니다.
            </p>
            <p>
              여기서 다루는 문서는 어느 서버에도 올라가지 않고, 기기 안에서 페이지가
              재구성됩니다. 계약서나 신분 서류처럼 남에게 넘기기 조심스러운 파일도
              그대로 열어 작업할 수 있는 이유입니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 상황에 어떤 PDF 도구?</h2>
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
