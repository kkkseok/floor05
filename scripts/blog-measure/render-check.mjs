/**
 * 블로그 글 렌더링 확인: 빌드된 사이트(next start)에서 글을 데스크톱·모바일로 전체 캡처하고
 * 가로 스크롤 여부(scrollWidth)를 출력한다. prose 무효 함정(CLAUDE.md 절대금지 14) 확인용.
 * 사용: npx next start -p 3123 & → node scripts/blog-measure/render-check.mjs <slug> <출력폴더>
 * 결과: <출력폴더>/blog-desk.png, blog-mobile.png, 콘솔에 "desk scrollWidth 1280 / mobile scrollWidth 390"
 */
import { chromium } from "@playwright/test";

const [, , slug, outDir = "."] = process.argv;
if (!slug) throw new Error("slug를 넣어 주세요: node scripts/blog-measure/render-check.mjs <slug> <출력폴더>");
const b = await chromium.launch();
for (const [w, name] of [[1280, "desk"], [390, "mobile"]]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  const res = await p.goto(`http://127.0.0.1:3123/blog/${slug}`, { waitUntil: "networkidle" });
  if (!res || res.status() !== 200) throw new Error(`/blog/${slug} 응답 ${res?.status()}`);
  const sw = await p.evaluate(() => document.documentElement.scrollWidth);
  console.log(name, "scrollWidth", sw, sw > w ? "← 가로 스크롤 발생" : "");
  await p.screenshot({ path: `${outDir}/blog-${name}.png`, fullPage: true });
}
await b.close();
