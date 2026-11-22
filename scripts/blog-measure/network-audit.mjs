/**
 * 블로그 실측용(browser-image-tools-privacy): floor05 도구를 실제로 쓰는 동안 브라우저가 내보낸
 * 모든 네트워크 요청을 기록하고, 고른 파일의 바이트가 요청 본문·주소에 실렸는지 확인한다.
 *
 * 하는 일
 *  1) 대조 실험(control): 일부러 파일을 올리는 로컬 페이지(fetch·FormData·XHR·sendBeacon·워커 fetch)를
 *     같은 감시 코드로 지켜봐서, 이 감시 방법이 업로드를 놓치지 않는지 먼저 확인한다.
 *  2) 도구 5개(압축·변환·EXIF 삭제·사진→PDF·연봉 계산기)를 열기 → 사용 → 떠나기 3단계로 나눠 요청을 기록한다.
 *  3) --offline 을 주면 페이지를 연 뒤 네트워크를 끊고(context.setOffline) 같은 작업이 되는지 본다.
 *  4) 읽기 전용 페이지(/, /contact, /privacy)를 열기만 하고 요청을 기록한다. 문의 폼은 제출하지 않는다.
 *
 * 사용 (저장소 루트에서)
 *   npx next start -p 3143 &
 *   node scripts/blog-measure/network-audit.mjs --base http://localhost:3143 --label local --work <작업폴더> --out <결과.json> --block-third-party --offline
 *   node scripts/blog-measure/network-audit.mjs --base https://www.floor05.com --label prod --work <작업폴더> --out <결과.json>
 *   # 방문 통계 재현: 운영 사이트의 통계 스크립트(/_vercel/insights/script.js)를 받아 로컬 빌드에 연결한다.
 *   curl -s --compressed -o <va-script.js> https://www.floor05.com/_vercel/insights/script.js
 *   node scripts/blog-measure/network-audit.mjs --base http://localhost:3143 --label local-analytics --work <작업폴더> --out <결과.json> --block-third-party --emulate-analytics <va-script.js>
 *
 * 기준
 *  - 본문 크기(bodyBytes) = max(Playwright postDataBuffer 길이, content-length 요청 헤더). 대조 실험에서
 *    로컬 서버가 실제로 받은 바이트와 같은지 비교한다.
 *  - 파일 흔적 = 파일에서 뽑은 30바이트 조각 16개(원본 바이트·base64), 파일 이름, JPEG COM 세그먼트에 심은
 *    표식 문자열이 요청 본문이나 주소에 있는지.
 *  - --block-third-party: 광고·분석 호스트 요청은 기록만 하고 중단한다(로컬에서 운영 광고 ID로 요청을 보내지 않으려고).
 *  - --emulate-analytics: Vercel 통계 스크립트는 navigator.webdriver 가 참이거나 UA에 Headless 가 있으면 아무것도
 *    보내지 않는다. 일반 방문자의 브라우저가 보내는 내용을 보려고 자동화 표시를 끄고(AutomationControlled),
 *    스크립트는 받아 둔 파일로, 전송(/_vercel/insights/view·event)은 가짜 200 응답으로 받는다. 운영 통계에는 아무것도 가지 않는다.
 *  - 테스트 파일은 전부 이 스크립트가 캔버스로 만든다(저작권 문제 없음).
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const opt = (name, def) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : def;
};
const flag = (name) => args.includes(`--${name}`);
const BASE = opt("base");
const LABEL = opt("label", "run");
const WORK = opt("work");
const OUT = opt("out");
if (!BASE || !WORK || !OUT) throw new Error("--base, --work, --out 이 필요합니다");
const BLOCK = flag("block-third-party");
const DO_OFFLINE = flag("offline");
const SETTLE = Number(opt("settle", "4000"));
const VA_SCRIPT = opt("emulate-analytics", null);
fs.mkdirSync(WORK, { recursive: true });

const MARKER = "F05AUDIT-MARKER-9c41e7d2b6a80f35";
const SALARY = "4321";
const baseHost = new URL(BASE).host;

// ---------- 호스트 분류 ----------
const AD_HOSTS = [
  "googlesyndication.com", "doubleclick.net", "googletagservices.com", "googleadservices.com",
  "adtrafficquality.google", "google.com", "gstatic.com", "googleapis.com", "fundingchoicesmessages.google.com",
  "kakao.com", "daumcdn.net",
];
function classify(u) {
  if (u.protocol === "data:" || u.protocol === "blob:") return "local-url";
  if (u.host === baseHost) return u.pathname.startsWith("/_vercel/") ? "analytics" : "first-party";
  if (u.host.endsWith("vercel-scripts.com") || u.host.endsWith("vercel-insights.com")) return "analytics";
  if (u.host.endsWith("web3forms.com")) return "contact-form";
  if (AD_HOSTS.some((h) => u.host === h || u.host.endsWith(`.${h}`))) return "ads";
  return "other";
}

// ---------- 파일 흔적 검사 ----------
function needlesFor(buf) {
  const out = [];
  const n = 16;
  for (let i = 0; i < n; i++) {
    let off = Math.floor(((buf.length - 60) * i) / (n - 1));
    off -= off % 3; // base64 정렬
    const slice = buf.subarray(off, off + 30);
    out.push({ raw: slice, b64: slice.toString("base64"), b64url: slice.toString("base64url") });
  }
  return out;
}
function traceIn(body, url, files) {
  const hits = [];
  let decodedUrl = url;
  try { decodedUrl = decodeURIComponent(url); } catch { /* 그대로 */ }
  const bodyText = body ? body.toString("latin1") : "";
  for (const f of files) {
    for (const nd of f.needles) {
      if (body && body.includes(nd.raw)) { hits.push(`${f.name}: 원본 바이트 조각(본문)`); break; }
      if (bodyText.includes(nd.b64) || bodyText.includes(nd.b64url)) { hits.push(`${f.name}: base64 조각(본문)`); break; }
      if (decodedUrl.includes(nd.b64) || decodedUrl.includes(nd.b64url)) { hits.push(`${f.name}: base64 조각(주소)`); break; }
    }
    const stem = f.name.replace(/\.[a-z]+$/, "");
    if (decodedUrl.includes(stem)) hits.push(`${f.name}: 파일 이름(주소)`);
    if (bodyText.includes(stem)) hits.push(`${f.name}: 파일 이름(본문)`);
  }
  if (bodyText.includes(MARKER) || decodedUrl.includes(MARKER)) hits.push("COM 표식 문자열");
  return hits;
}

// ---------- 감시 ----------
function watch(context, getPhase, files, { block }) {
  const records = [];
  const byReq = new Map();
  const pending = [];
  let websockets = 0;
  context.on("page", (p) => p.on("websocket", () => { websockets++; }));
  context.on("request", (req) => {
    const url = req.url();
    let u;
    try { u = new URL(url); } catch { return; }
    const cls = classify(u);
    if (cls === "local-url") return; // blob:, data: 는 네트워크로 나가지 않는다
    const buf = req.postDataBuffer();
    const rec = {
      phase: getPhase(),
      method: req.method(),
      host: u.host,
      path: u.pathname.length > 90 ? `${u.pathname.slice(0, 90)}…` : u.pathname,
      queryBytes: u.search.length,
      class: cls,
      type: req.resourceType(),
      fromWorker: !!req.serviceWorker?.() || false,
      postDataBytes: buf ? buf.length : 0,
      contentLength: null,
      bodyBytes: 0,
      status: null,
      failure: null,
      fileTrace: traceIn(buf, url, files()),
    };
    // 방문 통계 본문은 내용을 남긴다(무엇이 나가는지 글에 적기 위해). 그 밖의 본문은 크기만.
    if (cls === "ads") {
      rec.queryKeys = [...new Set([...u.searchParams.keys()])].sort();
      rec.pageUrlInQuery = [...u.searchParams.values()].some((v) => v.includes(baseHost));
    }
    if (cls === "analytics" && buf) rec.body = buf.toString("utf8").slice(0, 2000);
    if (cls === "first-party" && buf) rec.bodyHead = buf.toString("utf8").slice(0, 200);
    if (rec.type === "document" && cls === "first-party") rec.salaryInUrl = u.search.includes(SALARY);
    if (buf && buf.toString("latin1").includes(SALARY)) rec.salaryInBody = true;
    if (cls !== "first-party" && u.search.includes(SALARY)) rec.salaryInQuery = true;
    records.push(rec);
    byReq.set(req, rec);
    pending.push(
      req.allHeaders().then((h) => {
        const cl = h["content-length"];
        rec.contentLength = cl === undefined ? null : Number(cl);
      }).catch(() => {}).then(() => {
        rec.bodyBytes = Math.max(rec.postDataBytes, rec.contentLength ?? 0);
      }),
    );
    req.response().then((r) => { if (r) rec.status = r.status(); }).catch(() => {});
  });
  context.on("requestfailed", (req) => {
    const r = byReq.get(req);
    if (r) r.failure = req.failure()?.errorText ?? "failed";
  });
  if (block) {
    context.route(
      (url) => ["ads", "other"].includes(classify(url)) || url.host.endsWith("vercel-scripts.com"),
      (route) => route.abort(),
    );
  }
  if (VA_SCRIPT) {
    const body = fs.readFileSync(VA_SCRIPT, "utf8");
    context.route("**/_vercel/insights/script.js", (route) => route.fulfill({ status: 200, contentType: "application/javascript", body }));
    context.route(/\/_vercel\/insights\/(view|event|session)$/, (route) => route.fulfill({ status: 200, contentType: "text/plain", body: "OK" }));
  }
  return { records, flush: () => Promise.all(pending), websockets: () => websockets };
}

function summarize(records) {
  const by = (keyFn) => {
    const m = {};
    for (const r of records) { const k = keyFn(r); m[k] = (m[k] ?? 0) + 1; }
    return m;
  };
  const withBody = records.filter((r) => r.bodyBytes > 0);
  return {
    requests: records.length,
    byClass: by((r) => r.class),
    byMethod: by((r) => r.method),
    byHost: by((r) => r.host),
    requestsWithBody: withBody.length,
    bodyBytesTotal: withBody.reduce((s, r) => s + r.bodyBytes, 0),
    bodyBytesMax: withBody.reduce((s, r) => Math.max(s, r.bodyBytes), 0),
    bodyBytesByClass: withBody.reduce((m, r) => { m[r.class] = (m[r.class] ?? 0) + r.bodyBytes; return m; }, {}),
    fileTraceHits: records.filter((r) => r.fileTrace.length > 0).length,
    salaryHits: records.filter((r) => r.salaryInBody || r.salaryInQuery).length,
    failed: records.filter((r) => r.failure).length,
  };
}

// ---------- 테스트 파일 (캔버스 생성) ----------
async function makeFiles(browser) {
  const page = await browser.newPage();
  await page.goto("about:blank");
  const make = (w, h, mime, q, seed) => page.evaluate(async ([W, H, M, Q, S]) => {
    const c = document.createElement("canvas");
    c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, `hsl(${(S * 53) % 360},65%,60%)`);
    g.addColorStop(1, `hsl(${(S * 53 + 140) % 360},55%,30%)`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    let x = S * 2654435761 % 4294967296;
    const rnd = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x / 4294967296; };
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = `hsla(${Math.floor(rnd() * 360)},70%,${30 + Math.floor(rnd() * 50)}%,0.5)`;
      ctx.beginPath(); ctx.arc(rnd() * W, rnd() * H, 8 + rnd() * 90, 0, Math.PI * 2); ctx.fill();
    }
    // 사진처럼 압축이 잘 안 되게 잔 노이즈를 얹는다
    const img = ctx.getImageData(0, 0, W, H); const d = img.data;
    const amp = M === "image/png" ? 6 : 40;
    for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * amp; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
    ctx.putImageData(img, 0, 0);
    const blob = await new Promise((r) => c.toBlob(r, M, Q));
    const ab = new Uint8Array(await blob.arrayBuffer());
    let s = ""; for (let i = 0; i < ab.length; i += 32768) s += String.fromCharCode(...ab.subarray(i, i + 32768));
    return btoa(s);
  }, [w, h, mime, q, seed]);

  const jpg = Buffer.from(await make(3000, 2000, "image/jpeg", 0.92, 3), "base64");
  // SOI 바로 뒤에 COM 세그먼트로 표식 문자열을 심는다
  const com = Buffer.from(MARKER, "latin1");
  const seg = Buffer.concat([Buffer.from([0xff, 0xfe, (com.length + 2) >> 8, (com.length + 2) & 0xff]), com]);
  const jpgMarked = Buffer.concat([jpg.subarray(0, 2), seg, jpg.subarray(2)]);
  const png = Buffer.from(await make(1600, 1200, "image/png", undefined, 7), "base64");
  await page.close();
  const files = {};
  for (const [name, buf] of [["f05audit-photo.jpg", jpgMarked], ["f05audit-graphic.png", png]]) {
    const p = path.join(WORK, name);
    fs.writeFileSync(p, buf);
    files[name] = { name, path: p, bytes: buf.length, needles: needlesFor(buf) };
  }
  return files;
}

// ---------- 1) 대조 실험 ----------
async function control(browser, files) {
  const received = {};
  const srv = http.createServer((req, res) => {
    const url = req.url.split("?")[0];
    if (url === "/") {
      res.writeHead(200, { "content-type": "text/html" });
      return res.end(`<!doctype html><meta charset="utf-8"><title>control</title><input type="file" id="f">`);
    }
    if (url === "/w.js") {
      res.writeHead(200, { "content-type": "text/javascript" });
      return res.end(`onmessage=async(e)=>{await fetch('/up/worker-fetch',{method:'POST',body:e.data});postMessage(1)}`);
    }
    let n = 0;
    req.on("data", (c) => { n += c.length; });
    req.on("end", () => { received[url] = n; res.writeHead(204); res.end(); });
  });
  await new Promise((r) => srv.listen(3997, "127.0.0.1", r));
  const file = files["f05audit-photo.jpg"];
  const context = await browser.newContext();
  const w = watch(context, () => "control", () => [file], { block: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3997/");
  await page.setInputFiles("#f", file.path);
  await page.evaluate(async () => {
    const f = document.getElementById("f").files[0];
    await fetch("/up/fetch-file", { method: "POST", body: f });
    const fd = new FormData(); fd.append("file", f);
    await fetch("/up/fetch-formdata", { method: "POST", body: fd });
    await fetch("/up/fetch-put", { method: "PUT", body: f });
    await new Promise((r) => { const x = new XMLHttpRequest(); x.open("POST", "/up/xhr"); x.onloadend = r; x.send(f); });
    const ab = await f.arrayBuffer();
    await fetch("/up/fetch-arraybuffer", { method: "POST", body: ab });
    const b = new Uint8Array(ab.slice(0, 30000)); let s = ""; for (const c of b) s += String.fromCharCode(c);
    await fetch("/up/fetch-base64-json", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ d: btoa(s) }) });
    navigator.sendBeacon("/up/beacon", f.slice(0, 60000));
    await new Promise((r) => { const wk = new Worker("/w.js"); wk.onmessage = r; wk.postMessage(f); });
    await new Promise((r) => setTimeout(r, 1500));
  });
  await w.flush();
  await context.close();
  srv.close();
  const rows = w.records.filter((r) => r.path.startsWith("/up/")).map((r) => ({
    way: r.path.replace("/up/", ""),
    method: r.method,
    serverReceivedBytes: received[r.path] ?? null,
    postDataBytes: r.postDataBytes,
    contentLength: r.contentLength,
    bodyBytes: r.bodyBytes,
    fileTrace: r.fileTrace,
  }));
  return { fileBytes: file.bytes, ways: rows, seenByWatcher: rows.length, expectedWays: 8 };
}

// ---------- 2) 도구 ----------
async function drop(page, paths) {
  const chooser = page.waitForEvent("filechooser");
  await page.getByText("파일을 드래그하거나").first().click();
  await (await chooser).setFiles(paths);
}
async function download(page, click, name) {
  const dl = page.waitForEvent("download", { timeout: 60000 });
  await click();
  const d = await dl;
  const p = path.join(WORK, `out-${LABEL}-${name}-${d.suggestedFilename()}`);
  await d.saveAs(p);
  return { file: d.suggestedFilename(), bytes: fs.statSync(p).size };
}

const TOOLS = [
  {
    id: "compress", route: "/tools/image/compress", inputs: ["f05audit-photo.jpg"],
    use: async (page, f) => {
      await drop(page, [f["f05audit-photo.jpg"].path]);
      await page.getByRole("button", { name: "1개 이미지 압축하기" }).click();
      await page.getByRole("button", { name: "다운로드" }).waitFor({ timeout: 60000 });
      return download(page, () => page.getByRole("button", { name: "다운로드" }).click(), "compress");
    },
  },
  {
    id: "convert", route: "/tools/image/convert", inputs: ["f05audit-graphic.png"],
    use: async (page, f) => {
      await drop(page, [f["f05audit-graphic.png"].path]);
      await page.getByRole("button", { name: "JPG", exact: true }).click();
      await page.getByRole("button", { name: /1개 이미지 JPG로 변환/ }).click();
      await page.getByRole("button", { name: "다운로드" }).waitFor({ timeout: 60000 });
      return download(page, () => page.getByRole("button", { name: "다운로드" }).click(), "convert");
    },
  },
  {
    id: "exif-remove", route: "/tools/image/exif-remove", inputs: ["f05audit-photo.jpg"],
    use: async (page, f) => {
      await drop(page, [f["f05audit-photo.jpg"].path]);
      return download(page, () => page.getByRole("button", { name: "EXIF 제거하고 다운로드" }).click(), "exif");
    },
  },
  {
    id: "image-to-pdf", route: "/tools/pdf/image-to-pdf", inputs: ["f05audit-photo.jpg", "f05audit-graphic.png"],
    use: async (page, f) => {
      await drop(page, [f["f05audit-photo.jpg"].path, f["f05audit-graphic.png"].path]);
      return download(page, () => page.getByRole("button", { name: /PDF로 변환 \(2장\)/ }).click(), "pdf");
    },
  },
  {
    id: "salary", route: "/tools/calc/salary", inputs: [],
    use: async (page) => {
      const input = page.getByLabel("연봉(만원)");
      for (let i = 0; i < 6; i++) {
        await input.fill(SALARY);
        await page.waitForTimeout(300);
        if ((await input.inputValue()) === SALARY) break;
      }
      await page.locator("main").getByText("월 예상 실수령액").first().waitFor();
      const net = await page.locator("main .font-mono.text-5xl").first().innerText();
      return { shown: net.trim() };
    },
  },
];

async function runTool(browser, tool, files, { offline }) {
  const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 }, locale: "ko-KR" });
  let phase = "load";
  const used = tool.inputs.map((n) => files[n]);
  const w = watch(context, () => phase, () => used, { block: BLOCK });
  const page = await context.newPage();
  const result = { tool: tool.id, route: tool.route, offline, inputBytes: used.reduce((s, f) => s + f.bytes, 0), inputs: used.map((f) => ({ name: f.name, bytes: f.bytes })) };
  await page.goto(BASE + tool.route, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(SETTLE);
  phase = "use";
  if (offline) await context.setOffline(true);
  const t0 = Date.now();
  try {
    result.output = await tool.use(page, files);
    result.ok = true;
  } catch (e) {
    result.ok = false;
    result.error = String(e.message).split("\n")[0];
  }
  result.useMs = Date.now() - t0;
  await page.waitForTimeout(SETTLE);
  result.cookies = (await context.cookies()).map((c) => ({ domain: c.domain, name: c.name }));
  result.localStorageKeys = await page.evaluate(() => Object.keys(localStorage)).catch(() => null);
  phase = "leave";
  await page.goto("about:blank").catch(() => {});
  await page.waitForTimeout(1500);
  await w.flush();
  await context.close();
  const phases = {};
  for (const ph of ["load", "use", "leave"]) phases[ph] = summarize(w.records.filter((r) => r.phase === ph));
  result.phases = phases;
  result.all = summarize(w.records);
  result.websockets = w.websockets();
  result.requests = w.records;
  return result;
}

async function runPage(browser, route) {
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: "ko-KR" });
  const w = watch(context, () => "load", () => [], { block: BLOCK });
  const page = await context.newPage();
  const res = await page.goto(BASE + route, { waitUntil: "load" });
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(SETTLE);
  await w.flush();
  const cookies = (await context.cookies()).map((c) => ({ domain: c.domain, name: c.name }));
  await context.close();
  return { route, cookies, status: res?.status() ?? null, summary: summarize(w.records), websockets: w.websockets(), requests: w.records };
}

// ---------- 실행 ----------
let browser;
let channel = "chromium";
const launchArgs = VA_SCRIPT ? ["--disable-blink-features=AutomationControlled"] : [];
try { browser = await chromium.launch({ channel: "chromium", args: launchArgs }); } catch { channel = "headless-shell"; browser = await chromium.launch({ args: launchArgs }); }
const probe = await browser.newPage();
const identity = await probe.evaluate(() => ({ userAgent: navigator.userAgent, webdriver: navigator.webdriver }));
await probe.close();
const files = await makeFiles(browser);
const out = {
  label: LABEL,
  base: BASE,
  measuredAt: new Date().toISOString(),
  browser: { name: "Chromium", version: browser.version(), channel, headless: true, ...identity },
  analyticsEmulated: !!VA_SCRIPT,
  thirdPartyBlockedByHarness: BLOCK,
  settleMs: SETTLE,
  files: Object.values(files).map((f) => ({ name: f.name, bytes: f.bytes })),
  note: "bodyBytes = max(postDataBuffer 길이, content-length 요청 헤더). 파일 흔적 = 30바이트 조각 16개(원본·base64), 파일 이름, COM 표식.",
};
out.control = await control(browser, files);
console.log("control", JSON.stringify(out.control.ways.map((x) => [x.way, x.serverReceivedBytes, x.bodyBytes, x.fileTrace.length])));
out.tools = [];
for (const tool of TOOLS) {
  const r = await runTool(browser, tool, files, { offline: false });
  out.tools.push(r);
  console.log(LABEL, tool.id, "ok", r.ok, r.error ?? "", JSON.stringify({ load: r.phases.load.requests, use: r.phases.use.requests, leave: r.phases.leave.requests, useBody: r.phases.use.bodyBytesTotal, trace: r.all.fileTraceHits }));
}
if (DO_OFFLINE) {
  out.offline = [];
  for (const tool of TOOLS) {
    const r = await runTool(browser, tool, files, { offline: true });
    out.offline.push(r);
    console.log(LABEL, "offline", tool.id, "ok", r.ok, r.error ?? "", JSON.stringify({ use: r.phases.use.requests, failed: r.phases.use.failed }));
  }
}
out.pages = [];
for (const route of ["/", "/contact", "/privacy"]) {
  const r = await runPage(browser, route);
  out.pages.push(r);
  console.log(LABEL, "page", route, r.status, JSON.stringify(r.summary.byClass));
}
await browser.close();
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
console.log("saved", OUT);
