/**
 * 탐색 경로(breadcrumb) — 화면 표시와 BreadcrumbList 구조화 데이터가 같은 목록을 쓴다.
 */
import { SITE_URL } from "./constants";
import { getToolByHref, getToolCategory } from "./tools";

export interface Crumb {
  name: string;
  /** 사이트 내부 경로 ("/"로 시작). 홈은 "/" */
  href: string;
}

const HOME: Crumb = { name: "홈", href: "/" };

/** 도구 페이지 경로: 홈 › (카테고리 허브) › 도구. 허브가 없는 카테고리는 허브 단계를 건너뛴다. */
export function getToolCrumbs(toolHref?: string | null): Crumb[] {
  const tool = getToolByHref(toolHref);
  if (!tool) return [];

  const category = getToolCategory(tool.category);
  const crumbs: Crumb[] = [HOME];
  if (category?.hubHref) crumbs.push({ name: category.name, href: category.hubHref });
  crumbs.push({ name: tool.name, href: tool.href });
  return crumbs;
}

/** 블로그 글 경로: 홈 › 블로그 › 글 */
export function getBlogCrumbs(slug: string, title: string): Crumb[] {
  return [HOME, { name: "블로그", href: "/blog" }, { name: title, href: `/blog/${slug}` }];
}

/** BreadcrumbList JSON-LD. 항목이 2개 미만이면 만들지 않는다. */
export function buildBreadcrumbSchema(crumbs: Crumb[]): Record<string, unknown> | null {
  if (crumbs.length < 2) return null;
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.href === "/" ? SITE_URL : `${SITE_URL}${crumb.href}`,
    })),
  };
}
