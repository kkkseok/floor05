import Link from "next/link";
import { buildBreadcrumbSchema, type Crumb } from "@/lib/common/breadcrumbs";

interface BreadcrumbsProps {
  crumbs: Crumb[];
  /** dark: 어두운 타이틀 영역 위 */
  tone?: "dark" | "light";
  className?: string;
}

/**
 * 탐색 경로 표시 + BreadcrumbList 구조화 데이터.
 * 마지막 항목(현재 페이지)은 링크 없이 표시한다.
 */
export default function Breadcrumbs({ crumbs, tone = "light", className = "" }: BreadcrumbsProps) {
  const schema = buildBreadcrumbSchema(crumbs);
  if (!schema) return null;

  const text = tone === "dark" ? "text-brand-light/70" : "text-brand-subtle";
  const link =
    tone === "dark"
      ? "underline-offset-4 hover:text-brand-paper hover:underline"
      : "underline-offset-4 hover:text-brand-black hover:underline";

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <nav aria-label="현재 위치" className={className}>
        <ol className={`flex flex-wrap items-center justify-center gap-x-2 text-sm ${text}`}>
          {crumbs.map((crumb, index) => {
            const isLast = index === crumbs.length - 1;
            return (
              <li key={crumb.href} className="flex items-center gap-x-2">
                {index > 0 && <span aria-hidden="true">›</span>}
                {isLast ? (
                  <span aria-current="page">{crumb.name}</span>
                ) : (
                  <Link href={crumb.href} className={`inline-flex min-h-11 items-center sm:min-h-0 ${link}`}>
                    {crumb.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
