import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { getAllPosts } from "@/lib/common/blog";

export const metadata: Metadata = {
  title: "블로그 - 이미지 편집 가이드",
  description:
    "이미지 압축, 리사이즈, 포맷 변환 등 이미지 편집에 관한 실용적인 가이드를 제공합니다.",
  alternates: { canonical: "/blog" },
  openGraph: {
    url: "/blog",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    title: "블로그 - 이미지 편집 가이드",
    description:
      "이미지 압축, 리사이즈, 포맷 변환 등 이미지 편집에 관한 실용적인 가이드를 제공합니다.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <Header />

      <main className="flex-1">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* 페이지 타이틀 */}
          <div className="mb-12">
            <h1 className="text-3xl font-bold text-brand-black mb-4">블로그</h1>
            <p className="text-brand-mid">
              이미지 편집에 관한 실용적인 가이드
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
