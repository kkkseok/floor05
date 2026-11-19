import { getAllPosts, getPostUrl } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** YYYY-MM-DD(한국 날짜) → RFC 822. 발행 시각은 예약 발행 시각인 09:00 KST로 둔다. */
function toRfc822(date: string) {
  return new Date(`${date}T09:00:00+09:00`).toUTCString();
}

/**
 * 블로그 RSS 2.0 피드 — 글 목록은 블로그 레지스트리(POSTS)에서 가져온다.
 * 네이버 서치어드바이저 등 RSS 제출용.
 */
export function GET() {
  const posts = getAllPosts();
  const latest = posts.reduce((max, post) => (post.dateModified > max ? post.dateModified : max), "");

  const items = posts
    .map((post) => {
      const url = getPostUrl(post.slug);
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${toRfc822(post.datePublished)}</pubDate>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    "    <title>floor05 블로그</title>",
    `    <link>${SITE_URL}/blog</link>`,
    "    <description>이미지·PDF 도구를 만들며 직접 재 본 결과와 급여 계산 기준을 정리한 가이드</description>",
    "    <language>ko</language>",
    ...(latest ? [`    <lastBuildDate>${toRfc822(latest)}</lastBuildDate>`] : []),
    `    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />`,
    items,
    "  </channel>",
    "</rss>",
    "",
  ].join("\n");

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
