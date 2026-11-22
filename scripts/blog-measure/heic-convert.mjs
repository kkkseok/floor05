/**
 * 블로그 실측용(heic-to-jpg-guide): 직접 만든 HEIC(heic-make-source.py)를 floor05 HEIC→JPG 도구와
 * 같은 코드로 변환해 용량·시간·결과 크기·메타데이터를 잰다.
 *
 * 같은 경로인 이유: src/lib/image/convert.ts 의 convertImage 를 esbuild로 그대로 묶어 페이지에 넣는다
 * (heic2any → PNG → <img> → Canvas drawImage → toBlob("image/jpeg", 품질)). 도구 화면 기본 품질은 90%.
 * 실제 도구 화면에서 내려받은 파일과 바이트가 같은지는 heic-ui-check.mjs 로 따로 확인한다.
 *
 * 사용(저장소 루트에서): node scripts/blog-measure/heic-convert.mjs <소스폴더> <결과폴더> <출력.json> [필터]
 *   <소스폴더>: heic-make-source.py 가 만든 폴더(*.heic, ref-*.png)
 *   [필터]를 네 번째 인자로 주면 이름이 맞는 HEIC만 잰다(예: limited).
 *   <결과폴더>: 변환된 JPG와 heic2any가 푼 PNG를 저장(PSNR은 heic-psnr.py 가 계산)
 * 시간은 performance.now() 로 convertImage 호출 전후를 잰 값(ms)이다. 첫 호출은 heic2any 준비 시간이 섞이므로 따로 적는다.
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { execFileSync } from "node:child_process";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , srcDir, outDir, outJson, only] = process.argv; // only: 파일 이름 필터(정규식). 주면 그 파일만 재고 비교군은 건너뛴다
if (!srcDir || !outDir || !outJson) throw new Error("사용: node heic-convert.mjs <소스폴더> <결과폴더> <출력.json>");
fs.mkdirSync(outDir, { recursive: true });
const root = process.cwd().replace(/\\/g, "/");

// 도구 코드 묶기
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "heic-measure-"));
const entry = path.join(tmp, "entry.ts");
const helper = path.join(tmp, "helper.js");
fs.writeFileSync(entry, `export { convertImage } from "${root}/src/lib/image/convert";\nexport { default as heic2any } from "${root}/node_modules/heic2any/dist/heic2any.js";\n`);
execFileSync("npx", ["--yes", "esbuild", entry, "--bundle", "--format=iife", "--global-name=CV", `--outfile=${helper}`, "--log-level=warning"], { stdio: "inherit", shell: true });
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
  return { b, p };
}

/** 페이지 안에서 실행: 선택된 파일을 convertImage로 변환 */
async function runInPage({ qualities, reps, wantPng }) {
  const file = document.getElementById("f").files[0];
  const b64 = async (blob) => {
    const u8 = new Uint8Array(await blob.arrayBuffer());
    let s = ""; const N = 0x8000;
    for (let i = 0; i < u8.length; i += N) s += String.fromCharCode.apply(null, u8.subarray(i, i + N));
    return btoa(s);
  };
  const out = { name: file.name, type: file.type, bytes: file.size, outputs: [], repsMs: [] };
  try {
    for (const q of qualities) {
      const t0 = performance.now();
      const r = await CV.convertImage(file, { outputFormat: "image/jpeg", quality: q });
      const ms = Math.round(performance.now() - t0);
      out.outputs.push({ quality: q, bytes: r.blob.size, ms, width: r.width, height: r.height, b64: await b64(r.blob) });
      URL.revokeObjectURL(r.dataUrl);
    }
    for (let i = 0; i < reps; i++) {
      const t0 = performance.now();
      const r = await CV.convertImage(file, { outputFormat: "image/jpeg", quality: 0.9 });
      out.repsMs.push(Math.round(performance.now() - t0));
      URL.revokeObjectURL(r.dataUrl);
    }
    if (file.name.endsWith(".heic")) {
      // heic2any 디코딩만 따로: 시간, PNG 크기, 픽셀 해시(브라우저끼리 같은 픽셀이 나오는지)
      const t0 = performance.now();
      const res = await CV.heic2any({ blob: file, toType: "image/png", quality: 1 });
      const png = Array.isArray(res) ? res[0] : res;
      const decodeMs = Math.round(performance.now() - t0);
      const bmp = await createImageBitmap(png);
      const c = document.createElement("canvas"); c.width = bmp.width; c.height = bmp.height;
      const x = c.getContext("2d"); x.drawImage(bmp, 0, 0);
      const px = x.getImageData(0, 0, c.width, c.height).data;
      const h = new Uint8Array(await crypto.subtle.digest("SHA-256", px));
      out.decode = { ms: decodeMs, pngBytes: png.size, width: bmp.width, height: bmp.height,
        pixelSha256: Array.from(h).map((v) => v.toString(16).padStart(2, "0")).join("") };
      if (wantPng) out.decode.b64 = await b64(png);
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
  const rows = [];
  for (const f of heics) {
    await ctx.p.setInputFiles("#f", path.join(srcDir, f));
    let r;
    try {
      r = await ctx.p.evaluate(runInPage, {
        qualities: full ? [0.9, 0.7, 0.8, 1] : [0.9],
        reps: f.includes("-q70.") ? 5 : 3, // 시간은 파일당 3회 이상(품질 70은 5회)
        wantPng: full,
      });
    } catch (e) {
      r = { name: f, error: "page: " + String(e.message || e).slice(0, 300) };
      await ctx.b.close().catch(() => {});
      ctx = await open(engine);
    }
    for (const o of r.outputs || []) {
      const buf = Buffer.from(o.b64, "base64"); delete o.b64;
      fs.writeFileSync(path.join(outDir, `${name}-${f.replace(".heic", "")}-jq${Math.round(o.quality * 100)}.jpg`), buf);
      o.segments = jpegSegments(buf); o.jpegSize = jpegSize(buf);
    }
    if (r.decode?.b64) { fs.writeFileSync(path.join(outDir, `decoded-${f.replace(".heic", "")}.png`), Buffer.from(r.decode.b64, "base64")); delete r.decode.b64; }
    rows.push(r);
    console.log(name, f, r.error || "", JSON.stringify(r.outputs?.map((o) => [o.quality, o.bytes, o.ms])), "reps", JSON.stringify(r.repsMs), "decode", JSON.stringify(r.decode));
  }
  result.browsers[name] = { version: ctx.b.version(), rows };

  if (full && !only) {
    // HEIC를 거치지 않은 비교군: 기준 PNG를 같은 convertImage로 바로 JPG 저장(품질 사다리)
    for (const f of refs) {
      await ctx.p.setInputFiles("#f", path.join(srcDir, f));
      const r = await ctx.p.evaluate(runInPage, { qualities: [0.5, 0.6, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1], reps: 0, wantPng: false });
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
fs.writeFileSync(outJson, JSON.stringify({ measuredAt: new Date().toISOString(), playwright: "@playwright/test 기본 브라우저(headless)", heic2any: JSON.parse(fs.readFileSync("node_modules/heic2any/package.json", "utf8")).version, ...result }, null, 2));
