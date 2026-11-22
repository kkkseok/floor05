/**
 * network-audit.mjs 결과 4개(로컬+오프라인, 로컬 통계 재현, 운영 1차, 운영 2차)를 원자료 파일 하나로 합치고,
 * 글(browser-image-tools-privacy)에 쓰는 숫자를 derived 에 다시 계산해 넣는다.
 * 사용: node scripts/blog-measure/network-audit-merge.mjs <local.json> <local-analytics.json> <prod-run1.json> <prod-run2.json> <출력.json>
 * 용량을 줄이려고 "열기 단계의 자사 GET"(정적 파일) 개별 기록은 빼고 요약 수치만 남긴다. 그 밖의 요청은 전부 남긴다.
 */
import fs from "node:fs";

const [, , fLocal, fAnalytics, fProd1, fProd2, fOut] = process.argv;
const read = (f) => JSON.parse(fs.readFileSync(f, "utf8"));
const local = read(fLocal), analytics = read(fAnalytics), prod1 = read(fProd1), prod2 = read(fProd2);

const slim = (run) => {
  const keep = (r) => !(r.class === "first-party" && r.method === "GET" && r.phase === "load");
  for (const t of [...(run.tools ?? []), ...(run.offline ?? [])]) t.requests = t.requests.filter(keep);
  for (const p of run.pages ?? []) p.requests = p.requests.filter(keep);
  return run;
};
const sum = (a) => a.reduce((s, x) => s + x, 0);
const tool = (run, id, list = "tools") => run[list].find((t) => t.tool === id);
const ids = ["compress", "convert", "exif-remove", "image-to-pdf", "salary"];

const controlOk = (run) => run.control.ways.length === 8 && run.control.ways.every((w) => w.serverReceivedBytes === w.bodyBytes && w.bodyBytes > 0);
const prodTable = (run) => ids.map((id) => {
  const t = tool(run, id);
  return {
    tool: id, ok: t.ok, inputBytes: t.inputBytes, outputBytes: t.output?.bytes ?? null,
    requests: t.all.requests, firstParty: t.all.byClass["first-party"] ?? 0, ads: t.all.byClass.ads ?? 0, analytics: t.all.byClass.analytics ?? 0,
    other: t.all.byClass.other ?? 0, post: t.all.byMethod.POST ?? 0, requestsWithBody: t.all.requestsWithBody, bodyBytesTotal: t.all.bodyBytesTotal,
    useRequests: t.phases.use.requests, useBodyBytes: t.phases.use.bodyBytesTotal, leaveRequests: t.phases.leave.requests,
    fileTraceHits: t.all.fileTraceHits, websockets: t.websockets,
  };
});

const derived = {
  files: local.files,
  controlPassed: { local: controlOk(local), localAnalytics: controlOk(analytics), prodRun1: controlOk(prod1), prodRun2: controlOk(prod2) },
  control: {
    ways: local.control.ways.length,
    sizeDetected: local.control.ways.filter((w) => w.serverReceivedBytes === w.bodyBytes && w.bodyBytes > 0).length,
    contentDetected: local.control.ways.filter((w) => w.fileTrace.length > 0).length,
    contentDetectedWays: local.control.ways.filter((w) => w.fileTrace.length > 0).map((w) => w.way),
  },
  prodRun2: {
    table: prodTable(prod2),
    totalRequests: sum(prodTable(prod2).map((r) => r.requests)),
    totalPost: sum(prodTable(prod2).map((r) => r.post)),
    totalBodyBytes: sum(prodTable(prod2).map((r) => r.bodyBytesTotal)),
    totalInputBytes: sum(prodTable(prod2).map((r) => r.inputBytes)),
    totalUseRequests: sum(prodTable(prod2).map((r) => r.useRequests)),
    adHosts: [...new Set(prod2.tools.flatMap((t) => t.requests.filter((r) => r.class === "ads").map((r) => r.host)))].sort(),
    adRequestsWithPageUrl: prod2.tools.map((t) => ({ tool: t.tool, count: t.requests.filter((r) => r.pageUrlInQuery).length })),
    cookies: prod2.tools.map((t) => ({ tool: t.tool, cookies: t.cookies, localStorageKeys: t.localStorageKeys })),
    pages: prod2.pages.map((p) => ({ route: p.route, ...p.summary.byClass, requests: p.summary.requests, contactFormRequests: p.summary.byClass["contact-form"] ?? 0, post: p.summary.byMethod.POST ?? 0, cookies: p.cookies })),
    analyticsPosts: sum(prod2.tools.map((t) => t.requests.filter((r) => r.class === "analytics" && r.method === "POST").length)),
  },
  prodRun1: {
    table: prodTable(prod1),
    totalRequests: sum(prodTable(prod1).map((r) => r.requests)),
    posts: prod1.tools.flatMap((t) => t.requests.filter((r) => r.method !== "GET").map((r) => ({ tool: t.tool, phase: r.phase, host: r.host, path: r.path, bodyBytes: r.bodyBytes, fileTrace: r.fileTrace.length }))),
  },
  local: {
    table: prodTable(local),
    offline: ids.map((id) => {
      const on = tool(local, id), off = tool(local, id, "offline");
      return {
        tool: id, ok: off.ok, onlineOutputBytes: on.output?.bytes ?? null, offlineOutputBytes: off.output?.bytes ?? null,
        outputDiffBytes: on.output?.bytes != null ? on.output.bytes - off.output.bytes : null, sameShown: on.output?.shown ? on.output.shown === off.output.shown : null,
        useRequestsOnline: on.phases.use.requests, useRequestsOffline: off.phases.use.requests, failedOffline: off.phases.use.failed,
        failedPaths: off.requests.filter((r) => r.phase === "use" && r.failure).map((r) => `${r.path} ${r.failure}`),
      };
    }),
  },
  visitorAnalytics: {
    note: "로컬 빌드 + 운영 통계 스크립트(0.1.3) + 일반 UA·webdriver=false. 전송은 로컬 중계 서버가 받았고 운영 통계로는 가지 않았다.",
    perTool: ids.map((id) => {
      const t = tool(analytics, id);
      const posts = t.requests.filter((r) => r.method === "POST");
      return {
        tool: id, inputBytes: t.inputBytes, posts: posts.length, postBodyBytes: sum(posts.map((r) => r.bodyBytes)),
        useBodyBytes: t.phases.use.bodyBytesTotal, maxBodyBytes: Math.max(...posts.map((r) => r.bodyBytes)),
        ratioInputToUseBody: t.inputBytes ? Math.round(t.inputBytes / t.phases.use.bodyBytesTotal) : null,
        fileTraceHits: t.all.fileTraceHits, salaryHits: t.all.salaryHits,
        events: posts.map((r) => { const b = JSON.parse(r.body); return { path: r.path, bytes: r.bodyBytes, keys: Object.keys(b), en: b.en ?? null, ed: b.ed ?? null }; }),
        cookies: t.cookies, localStorageKeys: t.localStorageKeys,
      };
    }),
    stubReceived: { count: analytics.analyticsReceivedByLocalStub.length, bytes: sum(analytics.analyticsReceivedByLocalStub.map((x) => x.receivedBytes)) },
  },
};
const va = derived.visitorAnalytics;
va.totalPosts = sum(va.perTool.map((t) => t.posts));
va.totalPostBodyBytes = sum(va.perTool.map((t) => t.postBodyBytes));
va.minBodyBytes = Math.min(...va.perTool.flatMap((t) => t.events.map((e) => e.bytes)));
va.maxBodyBytes = Math.max(...va.perTool.flatMap((t) => t.events.map((e) => e.bytes)));
va.bodyKeys = [...new Set(va.perTool.flatMap((t) => t.events.flatMap((e) => e.keys)))];

const out = {
  topic: "browser-image-tools-privacy 네트워크 실측",
  measuredDate: "2026-11-22 (UTC 기준, 각 run.measuredAt 참조)",
  environment: `Chromium ${local.browser.version} (Playwright, headless, channel ${local.browser.channel}), Windows 11`,
  localBuildCommit: "7aa2330 (origin/main)",
  scripts: ["scripts/blog-measure/network-audit.mjs", "scripts/blog-measure/network-audit-merge.mjs"],
  notes: [
    "테스트 파일은 스크립트가 캔버스로 만든 JPG(3000x2000)·PNG(1600x1200). JPG에는 COM 세그먼트 표식을 심었다.",
    "bodyBytes = max(postDataBuffer 길이, content-length 요청 헤더). 대조 실험에서 로컬 서버 수신 바이트와 비교.",
    "local: 광고·분석 호스트를 DNS 규칙으로 막고 측정(요청 시도는 기록). prod: 막지 않음. 자동화 브라우저라 Vercel 통계 스크립트가 전송을 생략함(navigator.webdriver).",
    "localAnalytics: 운영 사이트의 /_vercel/insights/script.js 를 받아 로컬 중계 서버로 연결, 일반 UA·webdriver=false 로 재현.",
    "prodRun1 은 쿠키·광고 쿼리 키 기록 기능을 넣기 전 스크립트로 잰 것. prodRun2 가 글의 기준.",
    "문의 폼은 제출하지 않았다(/contact 열기만).",
  ],
  derived,
  runs: { local: slim(local), localAnalytics: slim(analytics), prodRun1: slim(prod1), prodRun2: slim(prod2) },
};
fs.writeFileSync(fOut, JSON.stringify(out, null, 1));
console.log(JSON.stringify(derived, null, 1));
