import type { Metadata } from "next";
import Link from "next/link";

import AdSlot from "@/components/common/AdSlot";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import ToolCard from "@/components/common/ToolCard";
import { getPostsBySlugs } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory } from "@/lib/common/tools";

const PAGE_URL = `${SITE_URL}/tools/image`;

export const metadata: Metadata = {
  title: "이미지 도구 모음 - 압축부터 워터마크까지 열다섯 가지",
  description:
    "압축, 변환, 리사이즈, 워터마크, 모자이크 등 자주 쓰는 이미지 작업을 한곳에서 고를 수 있는 허브입니다.",
  keywords: [
    "이미지 도구",
    "이미지 압축",
    "이미지 변환",
    "이미지 리사이즈",
    "워터마크",
    "모자이크",
    "EXIF 삭제",
  ],
  openGraph: {
    title: "이미지 도구 모음 - 압축부터 워터마크까지 열다섯 가지",
    description:
      "사진 정리, SNS 업로드, 문서 첨부 전에 필요한 이미지 작업을 목적별로 빠르게 찾아보세요.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 도구 모음 - 압축부터 워터마크까지 열다섯 가지",
    description:
      "이미지 용량 줄이기부터 개인정보 정리까지, 필요한 도구로 바로 이동할 수 있습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

export default function ImageToolsPage() {
  const tools = getToolsByCategory("image");
  const getToolHref = (patterns: string[], fallback: string) =>
    tools.find((tool) => patterns.some((pattern) => tool.name.includes(pattern)))?.href ?? fallback;
  const posts = getPostsBySlugs([
    "image-compression-guide",
    "png-vs-jpg",
    "heic-to-jpg-guide",
    "sns-image-size",
    "browser-image-tools-privacy",
    "photo-editing-without-photoshop",
  ]);

  const schemas = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "이미지 도구 모음",
      url: PAGE_URL,
      description:
        "압축, 변환, 편집, 개인정보 정리까지 이미지 작업에 필요한 도구를 카테고리별로 모은 페이지입니다.",
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
        { "@type": "ListItem", position: 2, name: "이미지 도구", item: PAGE_URL },
      ],
    },
  ];

  const useCases = [
    {
      title: "첨부 용량 제한에 걸렸을 때",
      body: "메일, 게시판, 지원서 업로드에서 파일 크기가 먼저 막히면 품질을 크게 해치지 않는 선에서 용량부터 줄이는 편이 빠릅니다.",
      href: getToolHref(["압축"], "/tools/image/compress"),
      label: "이미지 압축",
    },
    {
      title: "아이폰 사진이 다른 곳에서 열리지 않을 때",
      body: "HEIC 사진을 받았는데 업무 시스템이나 쇼핑몰 관리자에서 받지 않는다면 JPG로 바꾸면 호환 문제가 줄어듭니다.",
      href: getToolHref(["HEIC"], "/tools/image/heic-to-jpg"),
      label: "HEIC를 JPG로 변환",
    },
    {
      title: "SNS 권장 크기에 맞춰야 할 때",
      body: "프로필, 피드, 썸네일처럼 정해진 비율이 있는 이미지는 업로드 전에 가로세로 크기를 맞춰두면 잘림을 줄일 수 있습니다.",
      href: getToolHref(["리사이즈", "크기"], "/tools/image/resize"),
      label: "이미지 리사이즈",
    },
    {
      title: "중고거래 사진 속 정보를 가리고 싶을 때",
      body: "송장, 차량 번호, 얼굴처럼 공개하기 애매한 부분은 올리기 전에 흐리게 처리하고 촬영 정보도 함께 정리하는 것이 좋습니다.",
      href: getToolHref(["모자이크"], "/tools/image/mosaic"),
      label: "모자이크",
    },
    {
      title: "사진의 위치 정보가 신경 쓰일 때",
      body: "촬영 기기와 위치 기록이 남아 있을 수 있으니 공유 전에는 메타데이터를 확인하고 필요하면 제거하세요.",
      href: getToolHref(["EXIF"], "/tools/image/exif-remove"),
      label: "EXIF 삭제",
    },
    {
      title: "인스타그램 그리드로 나누고 싶을 때",
      body: "한 장의 이미지를 3x3 조각으로 나누면 프로필 첫 화면에서 이어지는 구성을 만들 수 있습니다.",
      href: getToolHref(["9분할", "그리드"], "/tools/image/grid"),
      label: "인스타 9분할",
    },
    {
      title: "사진 재사용이 걱정될 때",
      body: "작업물 샘플이나 판매용 사진에는 이름, 로고, 계정명을 얹어 출처를 남겨두면 관리가 쉬워집니다.",
      href: getToolHref(["워터마크"], "/tools/image/watermark"),
      label: "워터마크",
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
            <p className="mb-3 font-mono text-sm text-brand-accent">IMAGE TOOLS</p>
            <h1 className="text-4xl font-bold tracking-tight text-brand-paper sm:text-5xl">
              이미지 도구 모음
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-brand-light">
              압축, 변환, 편집, 개인정보 정리까지 이미지 작업을 목적별로 고를 수 있습니다.
            </p>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-4 text-base leading-8 text-brand-mid">
            <p>
              이미지 도구 15종을 한 페이지에 모았습니다. 용량 줄이기, JPG와 PNG 변환,
              HEIC 변환, 크기 조정, 자르기, 회전, 워터마크, 모자이크, EXIF 정리처럼
              업로드 전후에 자주 필요한 작업을 바로 찾을 수 있습니다.
            </p>
            <p>
              여기 있는 도구들은 사진을 어딘가로 올려 보내는 대신, 지금 열려 있는
              브라우저 탭 안에서 작업을 끝냅니다. 가족 사진이나 업무용 시안처럼
              밖으로 나가면 곤란한 파일도 그대로 다룰 수 있는 이유입니다.
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
              <h2 className="mt-2 text-3xl font-bold text-brand-black">어떤 상황에 어떤 도구?</h2>
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
