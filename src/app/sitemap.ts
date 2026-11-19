import type { MetadataRoute } from "next";

import { POSTS } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/lib/common/tools";

// 정보·정책 페이지의 내용 최종 수정일. 본문을 고치면 함께 갱신한다.
// (privacy·terms는 페이지에 적힌 시행·최종 수정일과 같아야 한다)
const INFO_PAGES: Record<string, string> = {
  "/about": "2026-11-19",
  "/contact": "2026-10-16",
  "/privacy": "2026-11-19",
  "/terms": "2026-10-15",
};

function latestToolDate(category: ToolCategory) {
  return TOOLS.filter((tool) => tool.category === category).reduce<string | undefined>(
    (latest, tool) =>
      tool.lastModified && (!latest || tool.lastModified > latest) ? tool.lastModified : latest,
    undefined,
  );
}

function latestModifiedDate() {
  return POSTS.reduce<string | undefined>((latest, post) => {
    if (!latest || post.dateModified > latest) {
      return post.dateModified;
    }

    return latest;
  }, undefined);
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    ...TOOL_CATEGORIES.filter((category) => category.hubHref).map((category) => ({
      url: `${SITE_URL}${category.hubHref}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      // 허브는 소속 도구 중 가장 최근 수정일을 따른다
      lastModified: latestToolDate(category.id),
    })),
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...Object.entries(INFO_PAGES).map(([path, lastModified]) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      lastModified,
    })),
    {
      url: `${SITE_URL}/blog`,
      changeFrequency: "weekly",
      priority: 0.7,
      lastModified: latestModifiedDate(),
    },
  ];

  const tools: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${SITE_URL}${tool.href}`,
    changeFrequency: "weekly",
    priority: 0.9,
    ...(tool.lastModified ? { lastModified: tool.lastModified } : {}),
  }));

  const posts: MetadataRoute.Sitemap = POSTS.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.8,
    lastModified: post.dateModified,
  }));

  return [...pages, ...tools, ...posts];
}
