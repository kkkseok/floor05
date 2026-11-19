import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getAllPosts, getPostUrl } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";

export const metadata: Metadata = {
  title: "블로그 - 이미지·PDF 실측 기록과 급여 계산 가이드",
  description:
    "사진 압축 품질, 포맷별 용량, 회전·합치기 화질을 직접 재 본 기록과 연봉 실수령액·퇴직금·주휴수당 계산 기준을 정리한 글 모음입니다.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/rss.xml" },
  },
  openGraph: {
    url: "/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "블로그 - 이미지·PDF 실측 기록과 급여 계산 가이드",
    description:
      "도구를 만들며 직접 측정한 이미지·PDF 수치와 급여 계산 기준을 글로 남깁니다.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  // 글 목록 구조화 데이터 — 목록은 블로그 레지스트리에서 그대로 가져온다
  const blogSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "floor05 블로그",
    url: `${SITE_URL}/blog`,
    inLanguage: "ko-KR",
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: getPostUrl(post.slug),
      datePublished: post.datePublished,
      dateModified: post.dateModified,
    })),
  };

  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogSchema) }}
      />
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 페이지 타이틀 */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-brand-black mb-4">블로그</h1>
            <p className="text-brand-mid">
              이미지·PDF를 직접 재 본 기록과 급여 계산 가이드
            </p>
          </div>

          {/* 블로그 목록 */}
          <div className="space-y-8">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="border-b border-brand-light/20 pb-8 last:border-0"
              >
                <Link href={`/blog/${post.slug}`} className="group block">
                  <h2 className="text-xl font-semibold text-brand-black group-hover:text-brand-accent transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-brand-mid mb-3">{post.description}</p>
                  <div className="flex items-center gap-4 text-sm text-brand-subtle">
                    <time dateTime={post.datePublished}>{post.datePublished}</time>
                    <span>·</span>
                    <span>{post.readTime} 읽기</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
