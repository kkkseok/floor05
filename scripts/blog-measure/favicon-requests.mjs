/**
 * 블로그 실측용: floor05 파비콘 ZIP을 그대로 올린 로컬 사이트에서 브라우저가 어떤 아이콘 파일을
 * 실제로 요청하는지 기록한다. 페이지 두 가지: head-snippet.html을 넣은 페이지 / 아이콘 태그 없는 페이지.
 * 사용: node scripts/blog-measure/favicon-requests.mjs <ZIP을 푼 폴더> <출력.json>
 * Chromium은 전체 브라우저(channel: "chromium")를 써야 한다(headless 셸은 파비콘을 받지 않음).
 * WebKit은 headless에서 파비콘을 받지 않아 창을 띄워(headed) 측정한다.
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , siteDir, out] = process.argv;
const snippet = fs.readFileSync(path.join(siteDir, "head-snippet.html"), "utf8");
const pages = {
  "/with-snippet.html": `<!doctype html><html><head><meta charset="utf-8"><title>t</title>\n${snippet}\n</head><body>snippet</body></html>`,
  "/no-tags.html": `<!doctype html><html><head><meta charset="utf-8"><title>t</title></head><body>no tags</body></html>`,
};
const types = { ".png": "image/png", ".ico": "image/x-icon", ".webmanifest": "application/manifest+json" };
let log = [];
const srv = http.createServer((req, res) => {
  const url = req.url.split("?")[0];
  if (pages[url]) { res.writeHead(200, { "content-type": "text/html" }); return res.end(pages[url]); }
  log.push(url);
  const f = path.join(siteDir, url);
  if (fs.existsSync(f)) { res.writeHead(200, { "content-type": types[path.extname(f)] ?? "application/octet-stream" }); return res.end(fs.readFileSync(f)); }
  res.writeHead(404); res.end();
}).listen(3999);

const result = {};
for (const [name, engine, opts] of [
  ["Chromium", chromium, { channel: "chromium" }],
  ["Firefox", firefox, {}],
  ["WebKit", webkit, { headless: false }],
]) {
  const b = await engine.launch(opts);
  result[name] = { version: b.version() };
  for (const pg of Object.keys(pages)) {
    log = [];
    const ctx = await b.newContext(); const p = await ctx.newPage();
    await p.goto(`http://127.0.0.1:3999${pg}`); await p.waitForTimeout(3000);
    await ctx.close();
    result[name][pg] = [...new Set(log)];
  }
  console.log(name, JSON.stringify(result[name]));
  await b.close();
}
srv.close();
const sizes = Object.fromEntries(fs.readdirSync(siteDir).map((f) => [f, fs.statSync(path.join(siteDir, f)).size]));
fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), sizes, result }, null, 2));
