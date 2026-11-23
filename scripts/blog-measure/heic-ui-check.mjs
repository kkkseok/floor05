/**
 * 블로그 실측용(heic-to-jpg-guide): 실제 도구 화면(/tools/image/heic-to-jpg)에서
 *  1) 한 장을 변환해 내려받은 JPG가 heic-convert.mjs 결과와 바이트 단위로 같은지(sha256)
 *  2) 1·5·10장을 한꺼번에 올렸을 때 "변환" 클릭부터 완료 문구까지 걸린 시간(회당 새 페이지, 3회)
 *  3) 10장 일괄 변환 중 브라우저 프로세스(자손 전체) 메모리 최대치(proc-mem-sampler.ps1, 시간 측정과 따로 1회 이상)
 * 를 확인한다. 도구는 여러 장을 Promise.all로 넘기고, HEIC는 8277750부터 convert.ts 안의 큐로 한 장씩 처리한다
 * (e4f6af7까지는 동시에 처리). 회마다 새 컨텍스트라 시간에는 libheif-js 청크 내려받기·WASM 준비 시간이 들어간다.
 * 결과는 행마다 <출력.json>에 바로 다시 쓴다(중간에 끊겨도 그때까지의 값이 남도록).
 *
 * 사용: npm run build → npx next start -p <포트> 를 띄운 뒤
 *   node scripts/blog-measure/heic-ui-check.mjs <소스폴더> <결과폴더> <출력.json> [포트=3123] [브라우저=chromium|firefox|webkit] [모드=full|mem] [메모리회수=1]
 *   mem 모드는 10장 메모리 측정만 한다(다운로드 대조 없음, 예전 코드 빌드와 비교할 때).
 * <결과폴더>에는 heic-convert.mjs 결과(<브라우저>-<이름>-jq90.jpg)가 있어야 한다.
 * 10장은 가진 HEIC 8개에 2개를 이름만 바꿔 복사해 채운다(<결과폴더>/batch/).
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawn } from "node:child_process";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , srcDir, outDir, outJson, port = "3123", engineName = "chromium", mode = "full", memRunsArg = "1"] = process.argv;
const memRuns = Number(memRunsArg);
const engine = { chromium, firefox, webkit }[engineName];
const label = { chromium: "Chromium", firefox: "Firefox", webkit: "WebKit" }[engineName];
if (!engine) throw new Error("브라우저는 chromium|firefox|webkit");
const URL_ = `http://127.0.0.1:${port}/tools/image/heic-to-jpg`;
const sha = (buf) => crypto.createHash("sha256").update(buf).digest("hex");

const batchDir = path.join(outDir, "batch");
fs.mkdirSync(batchDir, { recursive: true });
const base = fs.readdirSync(srcDir).filter((f) => f.endsWith(".heic")).sort();
const ten = base.map((f) => path.join(srcDir, f));
for (const f of ["tortoise-q70.heic", "flower-q70.heic", "tortoise-q90.heic"]) {
  if (ten.length >= 10) break;
  const copy = path.join(batchDir, f.replace(".heic", "-copy.heic"));
  fs.copyFileSync(path.join(srcDir, f), copy);
  ten.push(copy);
}
// 5장은 품질 70 두 장을 앞에 두고 섞는다
const five = ["tortoise-q70.heic", "flower-q70.heic", "tortoise-q50.heic", "flower-q90.heic", "tortoise-q90.heic"].map((f) => path.join(srcDir, f));

// 프로세스 메모리를 재려고 launchServer 로 띄워 루트 PID 를 얻는다
const server = await engine.launchServer();
const rootPid = server.process().pid;
const b = await engine.connect(server.wsEndpoint());
const result = { engine: label, browser: b.version(), url: URL_, mode, rootPid, tenFiles: ten.map((f) => path.basename(f)), single: null, batch: [], memory: [] };
const save = () => fs.writeFileSync(outJson, JSON.stringify({ measuredAt: new Date().toISOString(), ...result }, null, 2));
const sampler = path.join(path.dirname(new URL(import.meta.url).pathname).replace(/^\/([A-Za-z]:)/, "$1"), "proc-mem-sampler.ps1");

async function run(files, download, mem = false) {
  const ctx = await b.newContext({ acceptDownloads: true, viewport: { width: 1280, height: 900 } });
  const p = await ctx.newPage();
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e.message).slice(0, 200)));
  await p.goto(URL_, { waitUntil: "networkidle" });
  const chooser = p.waitForEvent("filechooser");
  await p.getByText("파일을 드래그하거나").first().click();
  await (await chooser).setFiles(files);
  const btn = p.getByRole("button", { name: new RegExp(`${files.length}개 이미지 JPG로 변환`) });
  await btn.waitFor({ timeout: 60_000 });
  let samp = null, memOut = null, stopFile = null;
  if (mem) {
    memOut = path.join(outDir, `mem-${label}-${Date.now()}.json`);
    stopFile = memOut + ".stop";
    samp = spawn("pwsh", ["-NoProfile", "-File", sampler, "-RootPid", String(rootPid), "-Out", memOut, "-StopFile", stopFile, "-IntervalMs", "500"], { stdio: "ignore" });
    await new Promise((r) => setTimeout(r, 3000)); // 클릭 전 기준값 몇 개
  }
  const t0 = Date.now();
  await btn.click();
  const row = { files: files.length, inputBytes: files.reduce((s, f) => s + fs.statSync(f).size, 0) };
  try {
    // 완료 문구는 성공한 장수만 센다. 실패가 섞이면 처리 중 표시가 사라지는 시점으로 판단한다
    await p.waitForFunction((n) => {
      const t = document.body.innerText;
      const m = t.match(/(\d+)개 이미지 변환 완료/);
      const fails = (t.match(/변환하지 못했습니다|읽지 못했습니다/g) || []).length;
      return (m ? Number(m[1]) : 0) + fails >= n;
    }, files.length, { timeout: 600_000, polling: 100 });
    row.ms = Date.now() - t0;
    const text = await p.evaluate(() => document.body.innerText);
    row.done = Number((text.match(/(\d+)개 이미지 변환 완료/) || [0, 0])[1]);
  } catch (e) {
    row.error = String(e.message).slice(0, 200);
  }
  row.pageErrors = errors;
  if (mem) {
    await new Promise((r) => setTimeout(r, 1500));
    fs.writeFileSync(stopFile, "");
    await new Promise((r) => samp.on("exit", r));
    const m = JSON.parse(fs.readFileSync(memOut, "utf8").trimStart());
    row.memory = { method: m.method, maxWorkingSetMB: m.maxWorkingSetMB, maxPrivateMB: m.maxPrivateMB, maxProcs: m.maxProcs, minSystemFreeMB: m.minSystemFreeMB,
      beforeClick: m.series[0], samples: m.samples, file: path.basename(memOut) };
  }
  if (download && row.done) {
    const dl = p.waitForEvent("download", { timeout: 120_000 });
    await p.getByRole("button", { name: /다운로드/ }).first().click();
    const d = await dl;
    const save = path.join(outDir, `ui-${label}-${files.length}-` + d.suggestedFilename());
    await d.saveAs(save);
    row.download = { name: d.suggestedFilename(), bytes: fs.statSync(save).size, sha256: sha(fs.readFileSync(save)) };
  }
  await ctx.close();
  return row;
}

// 1) 한 장: 내려받은 파일 ↔ 측정 스크립트 결과
for (const stem of mode === "full" ? ["tortoise-q70", "flower-q70"] : []) {
  const row = await run([path.join(srcDir, `${stem}.heic`)], true);
  const measured = path.join(outDir, `${label}-${stem}-jq90.jpg`);
  row.measuredSha256 = sha(fs.readFileSync(measured));
  row.measuredBytes = fs.statSync(measured).size;
  row.identical = row.download?.sha256 === row.measuredSha256;
  (result.single ||= {})[stem] = row;
  console.log("single", stem, JSON.stringify(row));
  save();
}
// 2) 장수별 시간
for (const [label, files] of mode === "full" ? [["1", [path.join(srcDir, "tortoise-q70.heic")]], ["5", five], ["10", ten]] : []) {
  for (let i = 0; i < 3; i++) {
    const row = await run(files, i === 0 && files.length > 1);
    result.batch.push(row);
    console.log("batch", label, JSON.stringify(row));
    save();
  }
}
// 3) 10장 메모리(시간 측정과 따로: 샘플러가 CPU를 조금 쓰므로)
for (let i = 0; i < memRuns; i++) {
  const row = await run(ten, false, true);
  result.memory.push(row);
  console.log("memory", JSON.stringify(row));
  save();
}
await b.close();
await server.close();
save();
