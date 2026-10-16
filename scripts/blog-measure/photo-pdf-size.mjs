/**
 * 블로그 실측용: floor05 이미지→PDF와 같은 파이프라인(Canvas JPEG 재인코딩 + pdf-lib embedJpg)으로
 * 사진 장수·해상도·품질별 PDF 용량을 잰다.
 * 그리기 경로는 도구와 같게: createImageBitmap(from-image) → 흰 배경 → src/lib/image/downscale.ts의
 * drawImageDownscaled(esbuild로 묶어 주입). 결과가 실제 도구 다운로드와 바이트 단위로 같아야 한다.
 * 사용: npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>
 *       node scripts/blog-measure/photo-pdf-size.mjs <출력.json> <helper.js> <사진.jpg>...
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";
import { PDFDocument } from "pdf-lib";

const [, , out, helperPath, ...files] = process.argv;
const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
await page.addScriptTag({ content: fs.readFileSync(helperPath, "utf8") });

// 브라우저에서 리사이즈·JPEG 인코딩 (long = 긴 변 픽셀, null이면 원본)
async function encode(file, long, quality) {
  const url = `data:image/jpeg;base64,${fs.readFileSync(file).toString("base64")}`;
  const r = await page.evaluate(async ({ url, long, quality }) => {
    const bitmap = await createImageBitmap(await (await fetch(url)).blob(), { imageOrientation: "from-image" });
    const s = long ? Math.min(1, long / Math.max(bitmap.width, bitmap.height)) : 1;
    const w = Math.max(1, Math.round(bitmap.width * s)), h = Math.max(1, Math.round(bitmap.height * s));
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const x = c.getContext("2d"); x.fillStyle = "#ffffff"; x.fillRect(0, 0, w, h);
    DS.drawImageDownscaled(x, bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0, w, h);
    const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", quality));
    const buf = new Uint8Array(await blob.arrayBuffer());
    let bin = ""; for (let i = 0; i < buf.length; i += 0x8000) bin += String.fromCharCode(...buf.subarray(i, i + 0x8000));
    return { b64: btoa(bin), w, h };
  }, { url, long, quality });
  return { bytes: Buffer.from(r.b64, "base64"), w: r.w, h: r.h };
}

async function buildPdf(items, pageSize) {
  const pdf = await PDFDocument.create();
  for (const it of items) {
    const img = await pdf.embedJpg(it.bytes);
    const [pw, ph] = pageSize === "a4" ? (it.w > it.h ? [841.89, 595.28] : [595.28, 841.89]) : [it.w, it.h];
    const p = pdf.addPage([pw, ph]);
    const s = pageSize === "a4" ? Math.min(pw / it.w, ph / it.h) : 1;
    p.drawImage(img, { x: (pw - it.w * s) / 2, y: (ph - it.h * s) / 2, width: it.w * s, height: it.h * s });
  }
  return (await pdf.save()).length;
}

const scenarios = [
  { label: "원본 해상도 · 92% (현재 도구)", long: null, q: 0.92 },
  { label: "긴 변 4032px · 92% (1200만 화소 폰 수준)", long: 4032, q: 0.92 },
  { label: "긴 변 3508px · 85% (A4 300dpi)", long: 3508, q: 0.85 },
  { label: "긴 변 2339px · 85% (A4 200dpi)", long: 2339, q: 0.85 },
  { label: "긴 변 1754px · 85% (A4 150dpi)", long: 1754, q: 0.85 },
];
const result = [];
for (const sc of scenarios) {
  const enc = [];
  for (const f of files) enc.push(await encode(f, sc.long, sc.q));
  const jpegSum = enc.reduce((s, e) => s + e.bytes.length, 0);
  // 10장 = 사진 목록을 반복해 10페이지 구성
  const ten = Array.from({ length: 10 }, (_, i) => enc[i % enc.length]);
  const row = {
    ...sc,
    dims: enc.map((e) => `${e.w}x${e.h}`),
    jpegBytesPerPhoto: enc.map((e) => e.bytes.length),
    pdf1_fit: await buildPdf([enc[0]], "fit"),
    pdf1_a4: await buildPdf([enc[0]], "a4"),
    pdfAll_fit: await buildPdf(enc, "fit"),
    jpegSum,
    pdf10_a4: await buildPdf(ten, "a4"),
  };
  result.push(row);
  console.log(JSON.stringify(row));
}
fs.writeFileSync(out, JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), files: files.map((f) => f.split(/[\/]/).pop()), result }, null, 2));
await b.close();
