/**
 * 블로그 실측용(avif-guide): 브라우저가 AVIF를 저장할 수 있는지, 받은 AVIF를 열어 JPG·PNG로 되돌리면 어떻게 되는지 잰다.
 * 기준 이미지 5장과 PSNR 맞춤 방식은 webp-guide(webp-when.mjs)와 같다. 변환은 floor05 포맷 변환 도구의
 * 워커 경로(createImageBitmap → OffscreenCanvas → convertToBlob)를 그대로 쓴다.
 *
 * PARTS (쉼표로 여러 개, 순서대로 실행)
 *  refs    : 무손실 기준 PNG 5장(사진 2장은 가로 1920px로 축소, 그래픽, floor05 화면 캡처 2장)을 만든다.
 *  sweep   : 기준 5장을 JPG·WebP 품질 1~100%로 저장한 용량·PSNR(+90% 저장 시간), avif-encode.py가 만든 AVIF 품질 1~100의
 *            용량·PSNR(Chromium에서 디코딩). PSNR 기준 = 무손실 기준 픽셀(RGB).
 *            matched = 기준 형식·품질의 PSNR 이상을 내는 AVIF 중 가장 낮은 품질(=가장 작은 파일).
 *  back    : JPG 90%와 같은 화질의 AVIF(matched.jpg90)를 도구 경로로 JPG 1~100%·PNG·WebP 90%로 되돌린 용량과
 *            PSNR(입력 AVIF를 디코딩한 픽셀 기준, 무손실 기준 픽셀 기준).
 *  engines : Chromium(Playwright)·Chrome·Edge(이 PC 설치본)·Firefox·WebKit에서
 *            (1) canvas.toBlob / toDataURL / OffscreenCanvas.convertToBlob("image/avif")가 실제로 무엇을 내놓는지
 *            (2) AVIF 6종(4:2:0, 4:4:4, 품질 100, 10비트, 투명, 애니메이션)을 열 수 있는지와 디코딩 픽셀
 *
 * 사용: (저장소 루트에서, 빌드된 사이트를 띄운 뒤)
 *   PARTS=refs node scripts/blog-measure/avif-measure.mjs <작업폴더> <거북이.jpg> <꽃.jpg> <그래픽.png> [사이트 주소=http://127.0.0.1:3146]
 *   python -I -X utf8 scripts/blog-measure/avif-encode.py <작업폴더>
 *   PARTS=sweep,back,engines node scripts/blog-measure/avif-measure.mjs <작업폴더> ...
 * 결과: <작업폴더>/result.json (원자료는 docs/blog-data/에 보관)
 */
import fs from "node:fs";
import path from "node:path";
import { chromium, webkit, firefox } from "@playwright/test";

const [, , workDir, tortoisePath, flowerPath, graphicPath, base = "http://127.0.0.1:3146"] = process.argv;
if (!workDir || !tortoisePath || !flowerPath || !graphicPath) throw new Error("인자를 확인해 주세요(머리 주석 참고)");
fs.mkdirSync(workDir, { recursive: true });
const only = (process.env.PARTS || "refs").split(",");
const NAMES = ["photoTortoise", "photoFlower", "graphic", "captureDesk", "captureMobile"];
const refPath = (n) => path.join(workDir, `ref-${n}.png`);
const b64 = (p) => fs.readFileSync(p).toString("base64");

const resultPath = path.join(workDir, "result.json");
const out = fs.existsSync(resultPath) ? JSON.parse(fs.readFileSync(resultPath, "utf8")) : {};
const flush = () => fs.writeFileSync(resultPath, JSON.stringify(out, null, 1));

const HELPERS = `
  window.H = {
    blobOf(b64, type) { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new Blob([u], { type }); },
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
    async canvasOf(blob) {
      const bmp = await createImageBitmap(blob, { imageOrientation: "from-image" });
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(bmp, 0, 0); bmp.close();
      return c;
    },
    async pixelsOf(blob) { const c = await H.canvasOf(blob); return c.getContext("2d").getImageData(0, 0, c.width, c.height).data; },
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

const b = await chromium.launch({ args: ["--disable-lcd-text"] });
out.browser = b.version();

// ── refs ────────────────────────────────────────────────────────────────
if (only.includes("refs")) {
  const deskPath = path.join(workDir, "capture-desk.png");
  const mobilePath = path.join(workDir, "capture-mobile.png");
  const dp = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await dp.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
  await dp.screenshot({ path: deskPath, type: "png" });
  await dp.close();
  const mp = await b.newPage({ viewport: { width: 360, height: 780 }, deviceScaleFactor: 3 });
  await mp.goto(`${base}/tools/image/convert`, { waitUntil: "networkidle" });
  await mp.screenshot({ path: mobilePath, type: "png" });
  await mp.close();

  const page = await b.newPage();
  page.setDefaultTimeout(0);
  await page.setContent(`<html><body><input type="file" id="f" multiple></body></html>`);
  await page.addScriptTag({ content: HELPERS });
  await page.setInputFiles("#f", [tortoisePath, flowerPath, graphicPath, deskPath, mobilePath]);
  // 사진은 가로 1920px로 줄여 무손실 PNG로(webp-guide와 같은 방식), 나머지는 그대로
  const refs = await page.evaluate(async (names) => {
    const files = [...document.getElementById("f").files];
    const info = {};
    for (let i = 0; i < files.length; i++) {
      const bmp = await createImageBitmap(files[i], { imageOrientation: "from-image" });
      const photo = i < 2;
      const w = photo ? 1920 : bmp.width, h = photo ? Math.round(bmp.height * 1920 / bmp.width) : bmp.height;
      const c = new OffscreenCanvas(w, h);
      const x = c.getContext("2d");
      x.imageSmoothingEnabled = true; x.imageSmoothingQuality = "high";
      x.drawImage(bmp, 0, 0, w, h);
      const png = await c.convertToBlob({ type: "image/png" });
      info[names[i]] = { width: w, height: h, sourceBytes: files[i].size, sourceWidth: bmp.width, sourceHeight: bmp.height, pngBytes: png.size, pngB64: await H.save(png) };
      bmp.close();
    }
    return info;
  }, NAMES);
  for (const [name, r] of Object.entries(refs)) { fs.writeFileSync(refPath(name), Buffer.from(r.pngB64, "base64")); delete r.pngB64; }
  out.refs = refs;
  console.log("refs", JSON.stringify(refs));
  flush();
  await page.close();
}

// 기준 PNG를 페이지에 올려 두는 공용 준비
async function pageWithRefs() {
  const page = await b.newPage();
  page.setDefaultTimeout(0);
  await page.setContent(`<html><body><input type="file" id="f" multiple></body></html>`);
  await page.addScriptTag({ content: HELPERS });
  await page.setInputFiles("#f", NAMES.map(refPath));
  await page.evaluate(async (names) => {
    const files = [...document.getElementById("f").files];
    window.REF = {};
    for (let i = 0; i < files.length; i++) { const canvas = await H.canvasOf(files[i]); window.REF[names[i]] = { canvas, px: canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data, png: files[i] }; }
  }, NAMES);
  return page;
}

// ── sweep ───────────────────────────────────────────────────────────────
if (only.includes("sweep")) {
  const enc = JSON.parse(fs.readFileSync(path.join(workDir, "encode.json"), "utf8"));
  out.avifEncoder = enc.encoder;
  out.avifEncodeTiming = enc.timing;
  const page = await pageWithRefs();
  out.sweeps = {};
  for (const name of NAMES) {
    const r = await page.evaluate(async (name) => {
      const { canvas, px, png } = window.REF[name];
      const res = { jpg: [], webp: [], avif: [] };
      for (const [key, type] of [["jpg", "image/jpeg"], ["webp", "image/webp"]]) {
        for (let q = 1; q <= 100; q++) {
          const blob = await canvas.convertToBlob({ type, quality: q / 100 });
          res[key].push([q, blob.size, H.psnr(px, await H.pixelsOf(blob))]);
        }
        const ms = [];
        for (let i = 0; i < 5; i++) { const t0 = performance.now(); await canvas.convertToBlob({ type, quality: 0.9 }); ms.push(Math.round(performance.now() - t0)); }
        res[key + "90EncodeMs"] = ms;
      }
      // 캔버스에서 바로 저장한 것과 PNG 파일을 도구 경로로 변환한 것이 같은 바이트인지 확인
      res.toolPathJpg90Bytes = (await H.toolConvert(png, "image/jpeg", 0.9)).size;
      res.toolPathWebp90Bytes = (await H.toolConvert(png, "image/webp", 0.9)).size;
      return res;
    }, name);
    for (const [q, bytes] of enc.sweep[name]) {
      const file = path.join(workDir, "avif", `${name}-q${q}.avif`);
      if (fs.statSync(file).size !== bytes) throw new Error(`바이트 불일치 ${file}`);
      const psnr = await page.evaluate(async ({ name, data }) => H.psnr(window.REF[name].px, await H.pixelsOf(H.blobOf(data, "image/avif"))), { name, data: b64(file) });
      r.avif.push([q, bytes, psnr]);
    }
    out.sweeps[name] = r;
    console.log("sweep", name, "jpg90", r.jpg[89], "webp90", r.webp[89], "avif60", r.avif[59], "avif90", r.avif[89]);
    flush();
  }
  await page.close();
}

// 파생값: 본문에 쓰는 비교는 전부 여기서 원자료(sweeps)로 다시 계산한다
if (out.sweeps) {
  const match = (s, baseFmt, baseQ) => {
    const baseRow = s[baseFmt][baseQ - 1];
    const hit = s.avif.find(([, , p]) => p === null || p >= baseRow[2]);
    return hit
      ? { base: `${baseFmt} ${baseQ}%`, baseBytes: baseRow[1], basePsnr: baseRow[2], avifQuality: hit[0], avifBytes: hit[1], avifPsnr: hit[2], avifVsBasePct: Number(((hit[1] / baseRow[1] - 1) * 100).toFixed(1)) }
      : { base: `${baseFmt} ${baseQ}%`, baseBytes: baseRow[1], basePsnr: baseRow[2], avifQuality: null, note: "AVIF는 어떤 품질로도 이 PSNR에 닿지 못함" };
  };
  const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];
  out.matched = {};
  for (const [name, s] of Object.entries(out.sweeps)) {
    out.matched[name] = {
      jpg90: match(s, "jpg", 90), jpg80: match(s, "jpg", 80), webp90: match(s, "webp", 90), webp80: match(s, "webp", 80),
      encodeMs: { jpg90Median: median(s.jpg90EncodeMs), webp90Median: median(s.webp90EncodeMs), avifQ60Median: out.avifEncodeTiming[name].medianMs },
    };
  }
}

// ── back ────────────────────────────────────────────────────────────────
if (only.includes("back")) {
  const page = await pageWithRefs();
  out.back = {};
  for (const name of NAMES) {
    const m = out.matched[name].jpg90;
    const file = path.join(workDir, "avif", `${name}-q${m.avifQuality}.avif`);
    const r = await page.evaluate(async ({ name, data }) => {
      const ref = window.REF[name].px;
      const avif = H.blobOf(data, "image/avif");
      const apx = await H.pixelsOf(avif);
      const res = { inputBytes: avif.size, inputPsnrVsRef: H.psnr(ref, apx), jpg: [] };
      for (let q = 1; q <= 100; q++) {
        const blob = await H.toolConvert(avif, "image/jpeg", q / 100);
        const p = await H.pixelsOf(blob);
        res.jpg.push([q, blob.size, H.psnr(apx, p), H.psnr(ref, p)]); // [품질, 바이트, 입력 AVIF 대비 PSNR, 무손실 기준 대비 PSNR]
      }
      const png = await H.toolConvert(avif, "image/png");
      res.png = { gotType: png.type, bytes: png.size, psnrVsInput: H.psnr(apx, await H.pixelsOf(png)) };
      const webp = await H.toolConvert(avif, "image/webp", 0.9);
      const wp = await H.pixelsOf(webp);
      res.webp90 = { gotType: webp.type, bytes: webp.size, psnrVsInput: H.psnr(apx, wp), psnrVsRef: H.psnr(ref, wp) };
      const again = await H.toolConvert(avif, "image/avif", 0.9);
      res.avifAsked = { gotType: again.type, bytes: again.size }; // AVIF로 다시 저장을 요청하면 무엇이 나오나
      return res;
    }, { name, data: b64(file) });
    out.back[name] = { inputFile: path.basename(file), inputAvifQuality: m.avifQuality, ...r };
    console.log("back", name, r.inputBytes, "jpg90", r.jpg[89], "png", JSON.stringify(r.png), "webp90", JSON.stringify(r.webp90));
    flush();
  }
  await page.close();
}
if (out.back) {
  out.backSummary = {};
  for (const [name, r] of Object.entries(out.back)) {
    const at = (q) => { const [, bytes, vsInput, vsRef] = r.jpg[q - 1]; return { bytes, timesInput: Number((bytes / r.inputBytes).toFixed(2)), psnrVsInput: vsInput, psnrVsRef: vsRef, psnrLossVsRef: Number((r.inputPsnrVsRef - vsRef).toFixed(2)) }; };
    const fits = [...r.jpg].reverse().find(([, bytes]) => bytes <= r.inputBytes); // 입력 AVIF보다 커지지 않는 가장 높은 JPG 품질
    out.backSummary[name] = {
      inputBytes: r.inputBytes, inputPsnrVsRef: r.inputPsnrVsRef,
      jpg90: at(90), jpg80: at(80), jpg100: at(100),
      png: { bytes: r.png.bytes, timesInput: Number((r.png.bytes / r.inputBytes).toFixed(2)), identicalToDecodedAvif: r.png.psnrVsInput === null },
      webp90: { bytes: r.webp90.bytes, timesInput: Number((r.webp90.bytes / r.inputBytes).toFixed(2)), psnrVsRef: r.webp90.psnrVsRef },
      highestJpgQualityNotLargerThanInput: fits ? { quality: fits[0], ...at(fits[0]) } : null,
    };
  }
}

// ── engines ─────────────────────────────────────────────────────────────
const engineTest = (pg, payload) => pg.evaluate(async ({ variants, refs }) => {
  const blobOf = (b64, type) => { const s = atob(b64); const u = new Uint8Array(s.length); for (let i = 0; i < s.length; i++) u[i] = s.charCodeAt(i); return new Blob([u], { type }); };
  const load = (blob) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => no(new Error("img.onerror")); i.src = URL.createObjectURL(blob); });
  const toBlob = (c, type, q) => new Promise((ok) => c.toBlob(ok, type, q));
  const draw = (img, bg) => { const c = document.createElement("canvas"); c.width = img.naturalWidth || img.width; c.height = img.naturalHeight || img.height; const x = c.getContext("2d", { willReadFrequently: true }); if (bg) { x.fillStyle = bg; x.fillRect(0, 0, c.width, c.height); } x.drawImage(img, 0, 0); return c; };
  const px = (c) => c.getContext("2d", { willReadFrequently: true }).getImageData(0, 0, c.width, c.height).data;
  const psnr = (a, b) => { if (a.length !== b.length) return "크기 불일치"; let s = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i+k] - b[i+k]; s += d*d; } const m = s / (a.length / 4 * 3); return m === 0 ? null : Number((10 * Math.log10(65025 / m)).toFixed(2)); };
  const magic = async (blob) => { const h = new Uint8Array(await blob.slice(0, 12).arrayBuffer()); return h[0] === 0x89 ? "PNG" : h[0] === 0xff ? "JPEG" : String.fromCharCode(...h.slice(4, 12)); };
  const res = { userAgent: navigator.userAgent, encode: {}, decode: {} };

  // (1) AVIF 저장 요청 — 도구의 isAvifSupported()와 같은 toDataURL 판정 포함
  const c = document.createElement("canvas"); c.width = 256; c.height = 256;
  const x = c.getContext("2d"); x.fillStyle = "#B8562A"; x.fillRect(0, 0, 256, 256); x.fillStyle = "#0A0A0A"; x.fillRect(64, 64, 128, 128);
  const tb = await toBlob(c, "image/avif", 0.9);
  res.encode.toBlob = tb ? { gotType: tb.type, bytes: tb.size, magic: await magic(tb) } : { gotType: null };
  const one = document.createElement("canvas"); one.width = 1; one.height = 1;
  res.encode.toDataURLPrefix = one.toDataURL("image/avif").slice(0, 15);
  res.encode.toolIsAvifSupported = one.toDataURL("image/avif").indexOf("data:image/avif") === 0;
  if (typeof OffscreenCanvas === "undefined") res.encode.offscreen = "OffscreenCanvas 없음";
  else { try { const o = new OffscreenCanvas(256, 256); o.getContext("2d").drawImage(c, 0, 0); const ob = await o.convertToBlob({ type: "image/avif", quality: 0.9 }); res.encode.offscreen = { gotType: ob.type, bytes: ob.size, magic: await magic(ob) }; } catch (e) { res.encode.offscreen = { error: String(e && e.message || e) }; } }
  res.encode.avifSaved = !!tb && tb.type === "image/avif";

  // (2) AVIF 열기
  const refPx = {};
  for (const [name, b64] of Object.entries(refs)) refPx[name] = px(draw(await load(blobOf(b64, "image/png"))));
  for (const [key, v] of Object.entries(variants)) {
    const blob = blobOf(v.b64, "image/avif");
    const row = { bytes: blob.size };
    try {
      const img = await load(blob);
      const cv = draw(img);
      const p = px(cv);
      row.img = { ok: true, width: cv.width, height: cv.height };
      let sum = 0; for (let i = 0; i < p.length; i += 4) sum += p[i] + p[i+1] + p[i+2];
      row.rgbSum = sum; // 엔진끼리 디코딩 픽셀이 같은지 보는 합계
      if (v.ref) row.psnrVsRef = psnr(refPx[v.ref], p);
      if (key === "alpha") { row.cornerAlpha = p[3]; row.centerRgba = [...p.slice((256 * cv.width + 256) * 4, (256 * cv.width + 256) * 4 + 4)]; const j = px(draw(img, "#FFFFFF")); row.cornerOnWhiteJpgPath = [j[0], j[1], j[2], j[3]]; const png = await toBlob(cv, "image/png"); const back = px(draw(await load(png))); row.pngKeepsAlpha = back[3] === 0; }
      if (key === "animated") { const i = (120 * cv.width + 160) * 4; row.centerRgb = [p[i], p[i+1], p[i+2]]; }
      // 도구의 메인 스레드 경로(흰 배경 → drawImage → toBlob)로 JPG 90%
      const jpg = await toBlob(draw(img, "#FFFFFF"), "image/jpeg", 0.9);
      row.jpg90 = { gotType: jpg.type, bytes: jpg.size };
    } catch (e) { row.img = { ok: false, error: String(e && e.message || e) }; }
    if (typeof createImageBitmap === "undefined") row.bitmap = "createImageBitmap 없음";
    else { try { const bm = await createImageBitmap(blob); row.bitmap = { ok: true, width: bm.width, height: bm.height }; bm.close(); } catch (e) { row.bitmap = { ok: false, error: String(e && e.message || e) }; } }
    res.decode[key] = row;
  }
  return res;
}, payload);

if (only.includes("engines")) {
  const enc = JSON.parse(fs.readFileSync(path.join(workDir, "encode.json"), "utf8"));
  out.variants = enc.variants;
  const refOf = { yuv420: "photoTortoise", yuv444: "captureDesk", quality100: "captureDesk", tenBit: "photoTortoise" };
  const variants = Object.fromEntries(Object.entries(enc.variants).map(([k, v]) => [k, { b64: b64(path.join(workDir, "avif", v.file)), ref: refOf[k] || null }]));
  const refs = { photoTortoise: b64(refPath("photoTortoise")), captureDesk: b64(refPath("captureDesk")) };
  out.engines = {};
  const list = [
    ["Chromium", chromium, {}, "Playwright 번들(headless shell)"],
    ["Chrome", chromium, { channel: "chrome" }, "이 PC에 설치된 Chrome"],
    ["Edge", chromium, { channel: "msedge" }, "이 PC에 설치된 Edge"],
    ["Firefox", firefox, {}, "Playwright 번들"],
    ["WebKit", webkit, {}, "Playwright 번들(Windows용 사파리 엔진 빌드, 실제 사파리와 다를 수 있음)"],
  ];
  for (const [name, engine, opt, note] of list) {
    try {
      const eb = await engine.launch(opt);
      const pg = await eb.newPage(); pg.setDefaultTimeout(0);
      await pg.setContent("<html><body></body></html>");
      try { out.engines[name] = { version: eb.version(), build: note, ...(await engineTest(pg, { variants, refs })) }; }
      catch (e) { out.engines[name] = { version: eb.version(), build: note, error: String(e.message || e) }; }
      await eb.close();
    } catch (e) { out.engines[name] = { build: note, launchError: String(e.message || e).slice(0, 300) }; }
    console.log("engine", name, JSON.stringify(out.engines[name]));
    flush();
  }
}

flush();
await b.close();
