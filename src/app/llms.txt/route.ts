import { POSTS } from "@/lib/common/blog";
import { SITE_URL } from "@/lib/common/constants";
import { getToolsByCategory, TOOL_CATEGORIES } from "@/lib/common/tools";

export const dynamic = "force-static";

export function GET() {
  const lines = [
    "# floor05 (플로어공오)",
    "",
    "> 이미지·PDF 처리와 급여 계산을 중심으로 한 무료 웹 도구와 실용 가이드 블로그. 모든 처리는 브라우저 안에서 끝나고 파일과 입력은 서버로 전송되지 않습니다.",
    "",
  ];

  for (const category of TOOL_CATEGORIES) {
    lines.push(`## ${category.label}`, "");

    for (const tool of getToolsByCategory(category.id)) {
      lines.push(`- [${tool.name}](${SITE_URL}${tool.href}): ${tool.description}`);
    }

    lines.push("");
  }

  lines.push("## 블로그", "");

  for (const post of POSTS) {
    lines.push(`- [${post.title}](${SITE_URL}/blog/${post.slug}): ${post.description}`);
  }

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
