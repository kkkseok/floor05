/**
 * 블로그 실측용(webp-guide): WebP가 실제로 이득인 경우와 손해인 경우를 잰다.
 * floor05 포맷 변환 도구의 워커 경로(createImageBitmap → OffscreenCanvas → convertToBlob)를 그대로 쓴다.
 *
 * 재는 것
 *  A. sweeps   : 무손실 기준 이미지 5장(사진 2, 화면 캡처 2, 그래픽 1)을 JPG·WebP 품질 1~100%로 저장한 용량·PSNR.
 *                PSNR 기준 = 저장 직전 캔버스 픽셀(RGB). matched = 같은 PSNR 이상을 내는 가장 작은 상대 형식.
 *  B. reconvert: 이미 JPG로 저장된 파일을 WebP 품질 1~100%로 변환한 용량. PSNR 기준 = (1) 입력 JPG, (2) JPG 이전의 무손실 기준.
 *  C. originals: 카메라 원본 JPG를 원본 크기 그대로 WebP/JPG로 변환. PSNR 기준 = 디코딩한 원본 픽셀.
 *  D. limits   : 세로 16383 / 16384 / 20000px 캔버스의 WebP·JPG·PNG 저장 결과(형식, 용량, 다시 열었을 때 픽셀 크기, 오류).
 *  E. engines  : Chromium·WebKit·Firefox에서 품질 100% WebP가 무손실인지, 16384px에서 무엇이 나오는지(canvas.toBlob).
 *
 * 사용: (저장소 루트에서, 빌드된 사이트를 띄운 뒤)
 *   node scripts/blog-measure/webp-when.mjs <출력폴더> <거북이.jpg> <꽃.jpg> <그래픽.png> [사이트 주소=http://127.0.0.1:3131]
 * 결과: <출력폴더>/result.json, 기준 이미지 PNG 5장, 재변환 입력 JPG (원자료는 docs/blog-data/에 보관)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit, firefox } from "@playwright/test";

const [, , outDir, tortoisePath, flowerPath, graphicPath, base = "http://127.0.0.1:3131"] = process.argv;
if (!outDir || !tortoisePath || !flowerPath || !graphicPath) throw new Error("인자를 확인해 주세요(머리 주석 참고)");
fs.mkdirSync(outDir, { recursive: true });
const only = (process.env.PARTS || "A,B,C,D,E").split(",");

const b = await chromium.launch({ args: ["--disable-lcd-text"] });

// 화면 캡처 원본: floor05 포맷 변환 페이지 (데스크톱 1920×1080, 휴대폰 360×780 @3x = 1080×2340)
const deskPath = path.join(outDir, "capture-desk.png");
const mobilePath = path.join(outDir, "capture-mobile.png");
if (!fs.existsSync(deskPath) || !fs.existsSync(mobilePath)) {
  const dp = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await dp.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
  await dp.screenshot({ path: deskPath, type: "png" });
  await dp.close();
  const mp = await b.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 3 });
  await mp.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
  await mp.screenshot({ path: mobilePath, type: "png" });
  await mp.close();
}

// 브라우저 안에서 쓰는 공용 함수(문자열로 주입)
const HELPERS = `
  window.H = {
    // 도구 워커(src/workers/imageWorker.ts)의 변환 경로와 같은 순서
    async toolConvert(file, type, q) {
      const bmp = await createImageBitmap(file, { imageOrientation: "from-image" });
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      const x = c.getContext("2d");
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
      if (type === "image/jpeg") { x.fillStyle = "#FFFFFF"; x.fillRect(0, 0, c.width, c.height); }
      x.drawImage(bmp, 0, 0, bmp.width, bmp.height, 0, 0, c.width, c.height);
      bmp.close();
      return c.convertToBlob({ type, quality: q });
    },
    async pixelsOf(blob) {
      const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(bmp, 0, 0); bmp.close();
      return x.getImageData(0, 0, c.width, c.height).data;
    },
    psnr(a, b) {
      if (a.length !== b.length) throw new Error("크기 불일치");
      let s = 0;
      for (let i = 0; i < a.length; i += 4) { const d0 = a[i] - b[i], d1 = a[i+1] - b[i+1], d2 = a[i+2] - b[i+2]; s += d0*d0 + d1*d1 + d2*d2; }
      const mse = s / (a.length / 4 * 3);
      return mse === 0 ? null : Number((10 * Math.log10(65025 / mse)).toFixed(2)); // null = 픽셀 완전 일치
    },
    async save(blob) { const u = new Uint8Array(await blob.arrayBuffer()); let s = ""; for (let i = 0; i < u.length; i += 32768) s += String.fromCharCode.apply(null, u.subarray(i, i + 32768)); return btoa(s); },
  };
`;

const page = await b.newPage();
page.setDefaultTimeout(0);
await page.setContent(`<html><body><input type="file" id="f" multiple></body></html>`);
await page.addScriptTag({ content: HELPERS });
await page.setInputFiles("#f", [tortoisePath, flowerPath, graphicPath, deskPath, mobilePath]);

const out = { browser: b.version(), measuredAt: new Date().toISOString() };
const resultPath = path.join(outDir, "result.json");
if (fs.existsSync(resultPath)) Object.assign(out, JSON.parse(fs.readFileSync(resultPath, "utf8")), { browser: b.version() });
const flush = () => fs.writeFileSync(resultPath, JSON.stringify(out, null, 1));

// 기준 이미지 준비: 사진은 가로 1920px로 줄여 무손실 PNG로(브라우저 인코더 글과 같은 방식), 나머지는 그대로
const refs = await page.evaluate(async () => {
  const files = [...document.getElementById("f").files];
  const names = ["photoTortoise", "photoFlower", "graphic", "captureDesk", "captureMobile"];
  window.REF = {};
  const info = {};
  for (let i = 0; i < files.length; i++) {
    const bmp = await createImageBitmap(files[i], { imageOrientation: "from-image" });
    const photo = i < 2;
    const w = photo ? 1920 : bmp.width, h = photo ? Math.round(bmp.height * 1920 / bmp.width) : bmp.height;
    const c = new OffscreenCanvas(w, h);
    const x = c.getContext("2d", { willReadFrequently: true });
    x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
    x.drawImage(bmp, 0, 0, w, h);
    const png = await c.convertToBlob({ type: "image/png" });
    window.REF[names[i]] = { canvas: c, px: x.getImageData(0, 0, w, h).data, png };
    info[names[i]] = { width: w, height: h, sourceBytes: files[i].size, sourceWidth: bmp.width, sourceHeight: bmp.height, pngBytes: png.size, pngB64: await H.save(png) };
    bmp.close();
  }
  return info;
});
for (const [name, r] of Object.entries(refs)) {
  fs.writeFileSync(path.join(outDir, `ref-${name}.png`), Buffer.from(r.pngB64, "base64"));
  delete r.pngB64;
}
out.refs = refs;
console.log("refs", JSON.stringify(refs));

// A. 품질 1~100% 전수 저장
if (only.includes("A")) {
  out.sweeps = {};
  for (const name of Object.keys(refs)) {
    const r = await page.evaluate(async (name) => {
      const { canvas, px, png } = window.REF[name];
      const res = { jpg: [], webp: [] };
      for (const [key, type] of [["jpg", "image/jpeg"], ["webp", "image/webp"]]) {
        for (let q = 1; q <= 100; q++) {
          const blob = await canvas.convertToBlob({ type, quality: q / 100 });
          res[key].push([q, blob.size, H.psnr(px, await H.pixelsOf(blob))]);
        }
      }
      // 캔버스에서 바로 저장한 것과 PNG 파일을 도구 경로로 변환한 것이 같은 바이트인지 확인
      const viaFile = await H.toolConvert(png, "image/webp", 0.9);
      res.toolPathWebp90Bytes = viaFile.size;
      const viaFileJ = await H.toolConvert(png, "image/jpeg", 0.9);
      res.toolPathJpg90Bytes = viaFileJ.size;
      return res;
    }, name);
    out.sweeps[name] = r;
    console.log("A", name, "webp90", r.webp[89], "jpg90", r.jpg[89], "webp100", r.webp[99], "tool", r.toolPathWebp90Bytes, r.toolPathJpg90Bytes);
    flush();
  }
}

// B. 이미 JPG인 파일을 WebP로 다시 변환
if (only.includes("B")) {
  out.reconvert = {};
  for (const [name, jq] of [["photoTortoise", 60], ["photoTortoise", 80], ["photoTortoise", 90], ["photoFlower", 80], ["captureDesk", 80]]) {
    const r = await page.evaluate(async ({ name, jq }) => {
      const { canvas, px } = window.REF[name];
      const jpg = await canvas.convertToBlob({ type: "image/jpeg", quality: jq / 100 });
      const jpx = await H.pixelsOf(jpg);
      const res = { inputJpgQuality: jq, inputBytes: jpg.size, inputPsnrVsRef: H.psnr(px, jpx), webp: [], jpgB64: await H.save(jpg) };
      for (let q = 1; q <= 100; q++) {
        const blob = await H.toolConvert(jpg, "image/webp", q / 100);
        const p = await H.pixelsOf(blob);
        res.webp.push([q, blob.size, H.psnr(jpx, p), H.psnr(px, p)]); // [품질, 바이트, 입력 JPG 대비 PSNR, 무손실 기준 대비 PSNR]
      }
      return res;
    }, { name, jq });
    fs.writeFileSync(path.join(outDir, `input-${name}-jpg${jq}.jpg`), Buffer.from(r.jpgB64, "base64"));
    delete r.jpgB64;
    out.reconvert[`${name}-jpg${jq}`] = r;
    console.log("B", name, jq, r.inputBytes, "webp90", r.webp[89], "webp75", r.webp[74]);
    flush();
  }
}

// C. 카메라 원본을 원본 크기 그대로 변환 (도구 기본 품질 90%와 주변 값)
if (only.includes("C")) {
  out.originals = {};
  for (const [idx, name] of [[0, "tortoise"], [1, "flower"]]) {
    const r = await page.evaluate(async (idx) => {
      const file = document.getElementById("f").files[idx];
      const px = await H.pixelsOf(file);
      const res = { inputBytes: file.size, rows: [] };
      for (const [type, q] of [["image/webp", 0.9], ["image/webp", 0.8], ["image/webp", 0.75], ["image/webp", 1], ["image/jpeg", 0.9], ["image/jpeg", 0.8]]) {
        const t0 = performance.now();
        const blob = await H.toolConvert(file, type, q);
        const ms = Math.round(performance.now() - t0);
        let psnr = "error";
        try { psnr = H.psnr(px, await H.pixelsOf(blob)); } catch (e) { psnr = "error: " + e.message; }
        res.rows.push({ type, quality: Math.round(q * 100), gotType: blob.type, bytes: blob.size, ms, psnr });
      }
      return res;
    }, idx);
    out.originals[name] = { ...r, width: refs[idx === 0 ? "photoTortoise" : "photoFlower"].sourceWidth, height: refs[idx === 0 ? "photoTortoise" : "photoFlower"].sourceHeight };
    console.log("C", name, JSON.stringify(r));
    flush();
  }
}

// D·E. 긴 이미지 한계와 품질 100% — 세 브라우저에서 canvas.toBlob(도구의 메인 스레드 경로)으로 확인
const limitTest = async (pg, deskB64, mobileB64) => pg.evaluate(async ({ deskB64, mobileB64 }) => {
  const load = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error("load")); i.src = s; });
  const toBlob = (c, type, q) => new Promise((ok) => c.toBlob(ok, type, q));
  const px = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const psnr = (a, b) => { let s = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i+k] - b[i+k]; s += d*d; } const m = s / (a.length / 4 * 3); return m === 0 ? null : Number((10 * Math.log10(65025 / m)).toFixed(2)); };
  const res = { q100: [], tall: [] };
  // 품질 100%가 무손실인가 (데스크톱 캡처)
  const desk = await load("data:image/png;base64," + deskB64);
  const c = document.createElement("canvas"); c.width = desk.width; c.height = desk.height;
  c.getContext("2d").drawImage(desk, 0, 0);
  const ref = px(c);
  for (const q of [0.99, 1]) {
    const blob = await toBlob(c, "image/webp", q);
    const back = await load(URL.createObjectURL(blob));
    const d = document.createElement("canvas"); d.width = c.width; d.height = c.height; d.getContext("2d").drawImage(back, 0, 0);
    const p = psnr(ref, px(d));
    const head = new Uint8Array(await blob.slice(0, 16).arrayBuffer());
    res.q100.push({ quality: Math.round(q * 100), gotType: blob.type, bytes: blob.size, psnr: p, lossless: p === null, chunk: String.fromCharCode(...head.slice(12, 16)) });
  }
  // 세로로 긴 이미지: 휴대폰 캡처(1080×2340)를 이어 붙여 높이를 맞춘다
  const mob = await load("data:image/png;base64," + mobileB64);
  for (const h of [16383, 16384, 20000]) {
    const t = document.createElement("canvas"); t.width = mob.width; t.height = h;
    const x = t.getContext("2d");
    for (let y = 0; y < h; y += mob.height) x.drawImage(mob, 0, y);
    for (const [type, q] of [["image/webp", 0.9], ["image/jpeg", 0.9], ["image/png", undefined]]) {
      let row = { width: t.width, height: h, asked: type };
      try {
        const blob = await toBlob(t, type, q);
        row = blob ? { ...row, gotType: blob.type, bytes: blob.size } : { ...row, gotType: null, bytes: null, note: "toBlob이 null을 돌려줌" };
        if (blob) { try { const back = await load(URL.createObjectURL(blob)); row.decodedWidth = back.naturalWidth; row.decodedHeight = back.naturalHeight; } catch { row.decodeError = true; } }
        if (typeof OffscreenCanvas !== "undefined" && type === "image/webp") {
          try {
            const o = new OffscreenCanvas(t.width, h); o.getContext("2d").drawImage(t, 0, 0);
            const ob = await o.convertToBlob({ type, quality: q });
            row.offscreen = { gotType: ob.type, bytes: ob.size };
            try { const bm = await createImageBitmap(ob); row.offscreen.decodedWidth = bm.width; row.offscreen.decodedHeight = bm.height; bm.close(); } catch { row.offscreen.decodeError = true; }
          } catch (e) { row.offscreen = { error: String(e && e.message || e) }; }
        }
      } catch (e) { row.error = String(e && e.message || e); }
      res.tall.push(row);
    }
  }
  return res;
}, { deskB64, mobileB64 });

if (only.includes("D") || only.includes("E")) {
  const deskB64 = fs.readFileSync(deskPath).toString("base64"), mobileB64 = fs.readFileSync(mobilePath).toString("base64");
  out.engines = {};
  for (const [name, engine] of [["Chromium", chromium], ["WebKit", webkit], ["Firefox", firefox]]) {
    const eb = name === "Chromium" ? b : await engine.launch();
    const pg = await eb.newPage(); pg.setDefaultTimeout(0);
    await pg.setContent("<html><body></body></html>");
    try { out.engines[name] = { version: eb.version(), ...(await limitTest(pg, deskB64, mobileB64)) }; }
    catch (e) { out.engines[name] = { version: eb.version(), error: String(e.message || e) }; }
    console.log("E", name, JSON.stringify(out.engines[name]));
    if (eb !== b) await eb.close();
    flush();
  }
}

// 파생값: 본문에 쓰는 비교는 전부 여기서 원자료(sweeps·reconvert)로 다시 계산한다
if (out.sweeps) {
  // base 형식·품질의 PSNR 이상을 내는 other 형식 중 가장 낮은 품질(=가장 작은 파일). 품질 100% WebP(무손실)는 제외
  const match = (s, baseFmt, baseQ, otherFmt) => {
    const base = s[baseFmt][baseQ - 1];
    const hit = s[otherFmt].find(([q, , p]) => p !== null && p >= base[2] && !(otherFmt === "webp" && q === 100));
    return hit
      ? { base: `${baseFmt} ${baseQ}%`, baseBytes: base[1], basePsnr: base[2], other: `${otherFmt} ${hit[0]}%`, otherBytes: hit[1], otherPsnr: hit[2], otherVsBasePct: Number(((hit[1] / base[1] - 1) * 100).toFixed(1)) }
      : { base: `${baseFmt} ${baseQ}%`, baseBytes: base[1], basePsnr: base[2], other: null, note: `${otherFmt}는 어떤 품질로도 이 PSNR에 닿지 못함` };
  };
  out.matched = {};
  for (const [name, s] of Object.entries(out.sweeps)) {
    out.matched[name] = {
      jpg90: match(s, "jpg", 90, "webp"), jpg80: match(s, "jpg", 80, "webp"), jpg60: match(s, "jpg", 60, "webp"),
      webp90: match(s, "webp", 90, "jpg"), webp80: match(s, "webp", 80, "jpg"),
      sameNumber90: { jpgBytes: s.jpg[89][1], webpBytes: s.webp[89][1], webpVsJpgPct: Number(((s.webp[89][1] / s.jpg[89][1] - 1) * 100).toFixed(1)), jpgPsnr: s.jpg[89][2], webpPsnr: s.webp[89][2] },
      lossless: { pngBytes: out.refs[name].pngBytes, webp100Bytes: s.webp[99][1], webp100Lossless: s.webp[99][2] === null, webp99Bytes: s.webp[98][1], webp100VsPng: Number((s.webp[99][1] / out.refs[name].pngBytes).toFixed(2)), webp100VsWebp99: Number((s.webp[99][1] / s.webp[98][1]).toFixed(2)) },
    };
  }
}
if (out.reconvert) {
  out.reconvertSummary = {};
  for (const [name, r] of Object.entries(out.reconvert)) {
    const lossy = r.webp.filter(([q]) => q < 100);
    const lastSmaller = [...lossy].reverse().find(([, bytes]) => bytes < r.inputBytes); // 입력보다 작게 나오는 가장 높은 품질
    const at = (q) => { const [, bytes, vsInput, vsRef] = r.webp[q - 1]; return { bytes, vsInputPct: Number(((bytes / r.inputBytes - 1) * 100).toFixed(1)), psnrVsInput: vsInput, psnrVsRef: vsRef }; };
    out.reconvertSummary[name] = { inputBytes: r.inputBytes, inputPsnrVsRef: r.inputPsnrVsRef, webp90: at(90), webp80: at(80), webp75: at(75), webp100: at(100), highestQualitySmallerThanInput: lastSmaller ? { quality: lastSmaller[0], ...at(lastSmaller[0]) } : null };
  }
}

flush();
await b.close();
