import Link from "next/link";
import BlogAd from "./BlogAd";
import SourceDisclosure from "./SourceDisclosure";
import { buildBlogPostingSchema, getPost, getRelatedPosts } from "@/lib/common/blog";
import { getBlogReview } from "@/lib/common/content-sources";

/**
 * 블로그 글 하단 공통 요소.
 * - BlogPosting JSON-LD (datePublished/dateModified 포함) 주입
 * - "관련 글" 블록으로 블로그↔블로그 내부링크 형성 (토픽 클러스터)
 *
 * 각 글 page.tsx에서 본문(.prose) 직후, <article> 내부에 한 줄로 삽입:
 *   <BlogExtras slug="..." />
 */
export default function BlogExtras({ slug }: { slug: string }) {
  const schema = buildBlogPostingSchema(slug);
  const post = getPost(slug);
  const related = getRelatedPosts(slug);
  const review = getBlogReview(slug);

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      {post && (
        <aside className="mt-14 border-y border-brand-light/20 py-6" aria-label="글 작성 정보">
          <p className="text-sm leading-6 text-brand-mid">
            작성·검토: {" "}
            <Link href="/about" rel="author" className="font-medium text-brand-accent hover:underline">
              floor05 운영자
            </Link>
            <span className="mx-2 text-brand-light" aria-hidden="true">·</span>
            발행 <time dateTime={post.datePublished}>{post.datePublished}</time>
            {post.dateModified !== post.datePublished && (
              <>
                <span className="mx-2 text-brand-light" aria-hidden="true">·</span>
                수정 <time dateTime={post.dateModified}>{post.dateModified}</time>
              </>
            )}
          </p>
          <p className="mt-2 text-sm leading-6 text-brand-light">
            직접 사용할 수 있는 계산 예시와 공개 자료를 바탕으로 작성하며, 오류 제보는 문의 페이지에서 받습니다.
          </p>
        </aside>
      )}

      {review && (
        <div className="mt-8">
          <SourceDisclosure review={review} />
        </div>
      )}

      {/* 본문 종료 직후 인콘텐츠 광고 (마무리 CTA 다음, 관련 글 위).
          장문 글이라 콘텐츠-광고 비율이 넉넉해 정책상 안전한 위치다. */}
      <BlogAd className="mt-16" />

      {related.length > 0 && (
        <aside className="mt-16 pt-8 border-t border-brand-light/20">
          <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-6">
            관련 글
          </h2>
          <ul className="space-y-5">
            {related.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="group block">
                  <span className="block font-medium text-brand-black group-hover:text-brand-accent transition-colors">
                    {post.title}
                  </span>
                  <span className="mt-1 block text-sm text-brand-mid">
                    {post.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>
      )}
    </>
  );
}
