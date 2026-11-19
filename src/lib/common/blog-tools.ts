/**
 * 블로그 글 → 도구 내부 링크.
 * 본문에서 도구를 하나만 언급하는 글에, 같은 작업 흐름에서 이어 쓰는 도구를 함께 보여준다.
 * 여기에 없는 글은 블록을 표시하지 않는다. 삭제된 글·도구는 자동으로 무시된다.
 */
import { getToolByHref, type Tool } from "./tools";

const BLOG_TOOLS: Record<string, string[]> = {
  "avif-guide": ["/tools/image/convert", "/tools/image/compress"],
  "webp-guide": ["/tools/image/convert", "/tools/image/compress"],
  "transparent-background": ["/tools/image/convert", "/tools/image/favicon", "/tools/image/watermark"],
  "passport-photo-size": ["/tools/image/compress", "/tools/image/resize", "/tools/image/crop"],
  "sns-image-size": ["/tools/image/resize", "/tools/image/crop", "/tools/image/grid"],
  "salary-net-pay-guide": ["/tools/calc/salary", "/tools/calc/severance", "/tools/calc/wage"],
  "severance-pay-guide": ["/tools/calc/severance", "/tools/calc/salary", "/tools/calc/wage"],
  "weekly-holiday-pay-guide": ["/tools/calc/wage", "/tools/calc/salary", "/tools/calc/severance"],
};

export function getBlogTools(slug: string): Tool[] {
  return (BLOG_TOOLS[slug] ?? [])
    .map((href) => getToolByHref(href))
    .filter((tool): tool is Tool => Boolean(tool));
}
