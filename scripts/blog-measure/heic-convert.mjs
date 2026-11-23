/**
 * 블로그 실측용(heic-to-jpg-guide): 직접 만든 HEIC(heic-make-source.py)를 floor05 HEIC→JPG 도구와
 * 같은 코드로 변환해 용량·시간·결과 크기·메타데이터를 잰다.
 *
 * 같은 경로인 이유: src/lib/image/convert.ts 의 convertImage 를 esbuild로 그대로 묶어 페이지에 넣는다
 * (libheif-js 1.23.5 → ImageData → PNG → <img> → Canvas drawImage → toBlob(형식, 품질)). 도구 화면 기본 품질은 90%.
 * 디코딩만 따로 재려고 같은 파일의 decodeHeic·getLibheif 를 내보내게 한 사본을 묶는다(동작은 그대로, export 만 추가).
 * 실제 도구 화면에서 내려받은 파일과 바이트가 같은지는 heic-ui-check.mjs 로 따로 확인한다.
 * 2026-11-23 첫 측정(heic2any 0.0.4 경로)은 이 파일의 이전 버전(git 기록)과 docs/blog-data/heic-2026-11-23.json 에 있다.
 *
 * 사용(저장소 루트에서): node scripts/blog-measure/heic-convert.mjs <소스폴더> <결과폴더> <출력.json> [필터]
 *   <소스폴더>: heic-make-source.py 가 만든 폴더(*.heic, ref-*.png)
 *   [필터]를 네 번째 인자로 주면 이름이 맞는 HEIC만 잰다(정규식). 주면 비교군은 건너뛴다.
 *   <결과폴더>: 변환된 JPG와 도구 디코더(decodeHeic)가 만든 PNG를 저장(PSNR은 heic-psnr.py 가 계산)
 * 시간은 performance.now() 로 잰 ms. libheif 준비(WASM 컴파일) 시간은 브라우저마다 맨 처음 한 번 initMs 로 따로 적고,
 * 그 뒤의 반복(repsMs)은 준비가 끝난 상태의 값이다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , srcDir, outDir, outJson, only] = process.argv;
if (!srcDir || !outDir || !outJson) throw new Error("사용: node heic-convert.mjs <소스폴더> <결과폴더> <출력.json> [필터]");
fs.mkdirSync(outDir, { recursive: true });
const root = process.cwd().replace(/\\/g, "/");

// 도구 코드 묶기: convert.ts 사본에 export 한 줄만 붙이고 상대 경로 import 를 절대 경로로 바꾼다
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "heic-measure-"));
const copy = path.join(tmp, "convert-copy.ts");
const helper = path.join(tmp, "helper.js");
const src = fs.readFileSync(`${root}/src/lib/image/convert.ts`, "utf8")
  .replace(`from "../common/fileUtils"`, `from "${root}/src/lib/common/fileUtils"`)
  .replaceAll(`"libheif-js/libheif-wasm/libheif-bundle.mjs"`, `"${root}/node_modules/libheif-js/libheif-wasm/libheif-bundle.mjs"`);
if (!src.includes(`${root}/node_modules/libheif-js`)) throw new Error("convert.ts 에서 libheif-js import 를 찾지 못했다");
fs.writeFileSync(copy, src + "\nexport { decodeHeic, getLibheif };\n");
execFileSync("npx", ["--yes", "esbuild", copy, "--bundle", "--format=iife", "--global-name=CV", `--outfile=${helper}`, "--log-level=error"], { stdio: "inherit", shell: true });
const helperJs = fs.readFileSync(helper, "utf8");

/** JPEG 세그먼트 표식 목록(SOS 전까지). EXIF는 APP1(0xE1), ICC는 APP2(0xE2) */
function jpegSegments(buf) {
  const out = [];
  for (let i = 2; i < buf.length - 4; ) {
    if (buf[i] !== 0xff) break;
    const m = buf[i + 1], L = buf.readUInt16BE(i + 2);
    out.push({ marker: "FF" + m.toString(16).toUpperCase().padStart(2, "0"), bytes: L + 2 });
    if (m === 0xda) break;
    i += 2 + L;
  }
  return out;
}
function jpegSize(buf) {
  for (let i = 2; i < buf.length - 10; ) {
    const m = buf[i + 1], L = buf.readUInt16BE(i + 2);
    if (m === 0xc0 || m === 0xc2) return [buf.readUInt16BE(i + 7), buf.readUInt16BE(i + 5)];
    i += 2 + L;
  }
  return null;
}

const heics = fs.readdirSync(srcDir).filter((f) => f.endsWith(".heic") && (!only || new RegExp(only).test(f))).sort();
const refs = fs.readdirSync(srcDir).filter((f) => /^ref-(tortoise|flower)\.png$/.test(f)).sort();
const HTML = `<!doctype html><html><body><input type="file" id="f"></body></html>`;

async function open(engine) {
  const b = await engine.launch();
  const p = await b.newPage();
  await p.route("https://heic.test/**", (r) => r.fulfill({ contentType: "text/html", body: HTML }));
  await p.goto("https://heic.test/");
  await p.addScriptTag({ content: helperJs });
  // libheif 준비 시간(WASM 컴파일·초기화). 페이지마다 한 번
  const initMs = await p.evaluate(async () => { const t0 = performance.now(); await CV.getLibheif(); return Math.round(performance.now() - t0); });
  return { b, p, initMs };
}

/** 페이지 안에서 실행: 선택된 파일을 convertImage로 변환 */
async function runInPage({ qualities, png, reps, breakdownReps, wantPng }) {
  const file = document.getElementById("f").files[0];
  const b64 = async (blob) => {
    const u8 = new Uint8Array(await blob.arrayBuffer());
    let s = ""; const N = 0x8000;
    for (let i = 0; i < u8.length; i += N) s += String.fromCharCode.apply(null, u8.subarray(i, i + N));
    return btoa(s);
  };
  const hex = async (buf) => Array.from(new Uint8Array(await crypto.subtle.digest("SHA-256", buf))).map((v) => v.toString(16).padStart(2, "0")).join("");
  const out = { name: file.name, type: file.type, bytes: file.size, outputs: [], repsMs: [] };
  try {
    for (const q of qualities) {
      const t0 = performance.now();
      const r = await CV.convertImage(file, { outputFormat: "image/jpeg", quality: q });
      const ms = Math.round(performance.now() - t0);
      out.outputs.push({ quality: q, bytes: r.blob.size, ms, width: r.width, height: r.height, b64: await b64(r.blob) });
      URL.revokeObjectURL(r.dataUrl);
    }
    if (png) {
      // PNG 출력은 크기와 해시만(전송량을 줄이려고 파일은 넘기지 않는다)
      const t0 = performance.now();
      const r = await CV.convertImage(file, { outputFormat: "image/png" });
      out.png = { bytes: r.blob.size, ms: Math.round(performance.now() - t0), width: r.width, height: r.height, sha256: await hex(await r.blob.arrayBuffer()) };
      URL.revokeObjectURL(r.dataUrl);
    }
    for (let i = 0; i < reps; i++) {
      const t0 = performance.now();
      const r = await CV.convertImage(file, { outputFormat: "image/jpeg", quality: 0.9 });
      out.repsMs.push(Math.round(performance.now() - t0));
      URL.revokeObjectURL(r.dataUrl);
    }
    if (file.name.endsWith(".heic")) {
      // 도구 디코더(decodeHeic)만: 시간과 PNG
      const t0 = performance.now();
      const decPng = await CV.decodeHeic(file);
      const decodeHeicMs = Math.round(performance.now() - t0);
      // 단계별 시간: decodeHeic 와 같은 순서로 parse(decoder.decode, 컨테이너 읽기) → display(HEVC 디코딩+RGB 변환) → PNG 저장을 나눠 잰다
      const lib = await CV.getLibheif();
      const stages = [];
      let pixelSha256 = null, size = null;
      for (let i = 0; i < breakdownReps; i++) {
        const s = {};
        let t = performance.now();
        const data = new Uint8Array(await file.arrayBuffer());
        const dec = new lib.HeifDecoder();
        const images = dec.decode(data);
        s.parseMs = Math.round(performance.now() - t);
        const img = images[0];
        const w = img.get_width(), h = img.get_height();
        const c = document.createElement("canvas"); c.width = w; c.height = h;
        const x = c.getContext("2d");
        const id = x.createImageData(w, h);
        t = performance.now();
        await new Promise((res) => img.display(id, res));
        s.displayMs = Math.round(performance.now() - t);
        t = performance.now();
        x.putImageData(id, 0, 0);
        await new Promise((res) => c.toBlob(res, "image/png"));
        s.pngMs = Math.round(performance.now() - t);
        if (i === 0) { pixelSha256 = await hex(id.data); size = [w, h]; }
        for (const im of images) im.free();
        if (dec.decoder) { lib.heif_context_free(dec.decoder); dec.decoder = null; }
        stages.push(s);
      }
      out.decode = { decodeHeicMs, pngBytes: decPng.size, width: size[0], height: size[1], pixelSha256, stages };
      if (wantPng) out.decode.b64 = await b64(decPng);
    }
  } catch (e) {
    out.error = String(e && e.message ? e.message : e);
  }
  return out;
}

const result = { browsers: {}, direct: {} };
for (const [name, engine] of [["Chromium", chromium], ["Firefox", firefox], ["WebKit", webkit]]) {
  const full = name === "Chromium";
  let ctx = await open(engine);
  const initMs = [ctx.initMs];
  const rows = [];
  for (const f of heics) {
    await ctx.p.setInputFiles("#f", path.join(srcDir, f));
    let r;
    try {
      r = await ctx.p.evaluate(runInPage, {
        qualities: full ? [0.9, 0.7, 0.8, 1] : [0.9],
        png: true,
        reps: f.includes("-q70.") ? 5 : 3, // 시간은 파일당 3회 이상(품질 70은 5회)
        breakdownReps: 3,
        wantPng: full,
      });
    } catch (e) {
      r = { name: f, error: "page: " + String(e.message || e).slice(0, 300) };
      await ctx.b.close().catch(() => {});
      ctx = await open(engine);
      initMs.push(ctx.initMs);
    }
    for (const o of r.outputs || []) {
      const buf = Buffer.from(o.b64, "base64"); delete o.b64;
      fs.writeFileSync(path.join(outDir, `${name}-${f.replace(".heic", "")}-jq${Math.round(o.quality * 100)}.jpg`), buf);
      o.segments = jpegSegments(buf); o.jpegSize = jpegSize(buf);
    }
    if (r.decode?.b64) { fs.writeFileSync(path.join(outDir, `decoded-${f.replace(".heic", "")}.png`), Buffer.from(r.decode.b64, "base64")); delete r.decode.b64; }
    rows.push(r);
    console.log(name, f, r.error || "", JSON.stringify(r.outputs?.map((o) => [o.quality, o.bytes, o.ms])), "png", JSON.stringify(r.png), "reps", JSON.stringify(r.repsMs), "decode", JSON.stringify(r.decode));
  }
  result.browsers[name] = { version: ctx.b.version(), initMs, rows };

  if (full && !only) {
    // HEIC를 거치지 않은 비교군: 기준 PNG를 같은 convertImage로 바로 JPG 저장(품질 사다리)
    for (const f of refs) {
      await ctx.p.setInputFiles("#f", path.join(srcDir, f));
      const r = await ctx.p.evaluate(runInPage, { qualities: [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1], png: false, reps: 0, breakdownReps: 0, wantPng: false });
      for (const o of r.outputs || []) {
        const buf = Buffer.from(o.b64, "base64"); delete o.b64;
        fs.writeFileSync(path.join(outDir, `direct-${f.replace(".png", "")}-jq${Math.round(o.quality * 100)}.jpg`), buf);
      }
      result.direct[f] = r;
      console.log("direct", f, r.error || "", JSON.stringify(r.outputs?.map((o) => [o.quality, o.bytes])));
    }
  }
  await ctx.b.close();
}
fs.rmSync(tmp, { recursive: true, force: true });
const libheifVersion = JSON.parse(fs.readFileSync("node_modules/libheif-js/package.json", "utf8")).version;
fs.writeFileSync(outJson, JSON.stringify({ measuredAt: new Date().toISOString(), playwright: "@playwright/test 기본 브라우저(headless)", decoder: `libheif-js ${libheifVersion}`, ...result }, null, 2));
