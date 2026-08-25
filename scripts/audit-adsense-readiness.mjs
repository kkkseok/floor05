import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");
const failures = [];

function check(label, condition, detail) {
  if (condition) {
    console.log(`PASS  ${label}`);
    return;
  }
  failures.push(detail || label);
  console.error(`FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
}

const publisherId = "pub-3069814419179785";
const adsTxt = read("public/ads.txt");
const layout = read("src/app/layout.tsx");
const adsenseScript = read("src/components/common/AdSenseScript.tsx");
const adsenseRoutes = read("src/lib/common/adsense.ts");
const toolLayout = read("src/components/common/ToolLayout.tsx");
const privacy = read("src/app/privacy/page.tsx");
const terms = read("src/app/terms/page.tsx");
const footer = read("src/components/common/Footer.tsx");
const sources = read("src/lib/common/content-sources.ts");
const sitemap = read("src/app/sitemap.ts");
const home = read("src/app/page.tsx");

check(
  "ads.txt publisher ID",
  adsTxt.includes(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0`),
  "public/ads.txt의 게시자 ID 또는 DIRECT 레코드를 확인하세요.",
);
check(
  "AdSense ownership meta and route-aware script",
  layout.includes("google-adsense-account") &&
    layout.includes("AdSenseScript") &&
    adsenseScript.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"),
  "AdSense 소유권 메타 또는 경로별 광고 스크립트가 누락되었습니다.",
);
check(
  "Policy pages exclude consent-required ad tags",
  !layout.includes("pagead2.googlesyndication.com/pagead/js/adsbygoogle.js") &&
    adsenseScript.includes("isAdsenseExcludedPath") &&
    adsenseRoutes.includes('"/privacy"') &&
    adsenseRoutes.includes('"/terms"'),
  "privacy·terms에서 AdSense 광고 태그를 제외하세요.",
);
check(
  "No legacy custom consent flow",
  !layout.includes("CookieConsent") && !toolLayout.includes("requestNonPersonalizedAds"),
  "자체 동의 흐름이 다시 연결되지 않았는지 확인하세요.",
);
check(
  "Google CMP revocation entry",
  footer.includes("CookieSettings") && read("src/components/common/CookieSettings.tsx").includes("showRevocationMessage"),
  "푸터에서 Google CMP 선택을 다시 열 수 있어야 합니다.",
);
check(
  "Policy pages match live contact flow",
  privacy.includes("Web3Forms") && privacy.includes("CONTACT_EMAIL") && terms.includes("CONTACT_EMAIL"),
  "문의 처리와 실제 연락처가 정책 페이지에 반영되지 않았습니다.",
);
check(
  "Policy pages in sitemap",
  ["/about", "/contact", "/privacy", "/terms"].every((route) => sitemap.includes(route)),
  "신뢰·정책 페이지가 sitemap에서 누락되었습니다.",
);
check(
  "Home has no manual ad slot",
  !home.includes("AdSlot"),
  "홈에는 수동 광고 슬롯을 두지 않습니다.",
);

const toolAdCalls = [...toolLayout.matchAll(/<AdSlot\s/g)].length;
check(
  "Tool detail pages capped at two manual slots",
  toolAdCalls <= 2 && !toolLayout.includes('slot="footer-above"'),
  `ToolLayout의 수동 슬롯 호출 수: ${toolAdCalls}`,
);

for (const category of ["image", "calc", "date", "health", "unit", "pdf", "color", "random"]) {
  const page = read(`src/app/tools/${category}/page.tsx`);
  const count = [...page.matchAll(/<AdSlot\s/g)].length;
  check(`${category} hub has at most one manual slot`, count <= 1, `현재 ${count}개`);
}

for (const route of [
  "/tools/calc/salary",
  "/tools/calc/wage",
  "/tools/calc/severance",
  "/tools/calc/vat",
  "/tools/calc/savings",
  "/tools/calc/loan",
  "/tools/health/bmi",
  "/tools/health/bmr",
  "/tools/health/ovulation",
  "/tools/health/pregnancy",
]) {
  check(`Source review: ${route}`, sources.includes(`"${route}"`), "출처 레지스트리 누락");
}

console.log("");
if (failures.length > 0) {
  console.error(`AdSense readiness audit failed: ${failures.length} item(s)`);
  process.exit(1);
}

console.log("AdSense readiness audit passed.");
console.log("Account-side CMP publishing, Auto ads exclusions, Search Console indexing, and the AdSense rejection reason still require manual verification.");
