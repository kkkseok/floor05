import type { MetadataRoute } from "next";

import { POSTS } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { TOOLS } from "@/lib/common/tools";

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
    { url: `${SITE_URL}/tools/image`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/tools/calc`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/tools/pdf`, changeFrequency: "weekly", priority: 0.8 },
    {
      url: SITE_URL,
      changeFrequency: "daily",
      priority: 1.0,
    },
    ...["/about", "/contact", "/privacy", "/terms"].map((path) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
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
