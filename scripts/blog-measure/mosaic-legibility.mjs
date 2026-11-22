/**
 * 블로그 실측용(photo-mosaic-guide): floor05 사진 모자이크와 같은 그리기 경로로 강도별 모자이크·블러를 걸고
 * "가린 뒤에 무엇이 남는가"를 잰다. 입력은 전부 이 스크립트가 그린 시험용 글자(숫자 0~9, 한글 가나다라마)다.
 *
 * 도구와 같은 경로: PNG → createImageBitmap(imageOrientation: "from-image") → 긴 변 2000px 편집 캔버스 →
 *   applyRegion(영역을 round(w / 칸)로 줄였다가 되돌림. 모자이크는 imageSmoothingEnabled=false, 블러는 true) →
 *   원본이 2000px보다 크면 원본 해상도 캔버스에 scale을 곱해 다시 적용.
 *   applyRegion·MAX_DIM은 src/components/image/MosaicTool.tsx 를 그대로 옮겼다(측정용으로 계산한 칸 수만 반환하게 함).
 *   실제 도구 다운로드와 픽셀이 같은지는 mosaic-tool-check.mjs 로 확인한다.
 *
 * 재는 것
 *   ladder    : 숫자 높이 6종 × 강도 7종 × 2방식. 실제 칸 크기, 숫자 높이에 걸치는 칸 수, 영역 PSNR(가리기 전 대비), 고유 색 수
 *   variants  : 10자리 숫자열에서 한 자리만 0~9로 바꾼 10장을 같은 영역·강도로 가렸을 때 서로 다른 결과가 몇 가지인가(영역 위치 9가지)
 *   influence : 칸 하나를 이루는 원본 픽셀 중 결과에 영향을 주는 픽셀 수(한 픽셀만 검게 바꿔 결과가 달라지는지)
 *   sizes     : 같은 그림을 가로 800~4000px로 그려 같은 강도를 걸었을 때 저장본의 칸 크기, 편집 화면과 저장본의 칸 색 차이
 * PSNR 기준: 가리기 전 같은 영역의 픽셀(RGB). 낮을수록 원래 그림과 다르다.
 *
 * 사용: node scripts/blog-measure/mosaic-legibility.mjs <출력.json> <그림 출력 폴더>
 */
import fs from "node:fs";
import path from "node:path";
import { chromium } from "@playwright/test";

const [, , out, figDir] = process.argv;
if (!out || !figDir) throw new Error("사용: node scripts/blog-measure/mosaic-legibility.mjs <출력.json> <그림 출력 폴더>");

const b = await chromium.launch({ args: ["--disable-lcd-text"] });
const page = await b.newPage();
await page.setContent("<html><body></body></html>");
const result = await page.evaluate(async () => {
  const MAX_DIM = 2000;
  const FONT = '"Malgun Gothic"';
  const BG = "#FFFFFF";
  const INK = "#111111";
  const TEXT = "0123456789 가나다라마";
  const STRENGTHS = [4, 8, 12, 16, 20, 30, 40];
  const MODES = ["mosaic", "blur"];
  const r2 = (v) => Number(v.toFixed(2));

  // ── MosaicTool.tsx applyRegion 그대로 (반환값만 추가)
  function applyRegion(target, r, scale) {
    const ctx = target.getContext("2d");
    const x = Math.round(r.x * scale);
    const y = Math.round(r.y * scale);
    const w = Math.max(1, Math.min(target.width - x, Math.round(r.w * scale)));
    const h = Math.max(1, Math.min(target.height - y, Math.round(r.h * scale)));
    const bs = Math.max(2, r.block * scale);
    const tw = Math.max(1, Math.round(w / bs));
    const th = Math.max(1, Math.round(h / bs));
    const tmp = document.createElement("canvas");
    tmp.width = tw;
    tmp.height = th;
    const tctx = tmp.getContext("2d");
    tctx.imageSmoothingEnabled = r.mode === "blur";
    tctx.drawImage(target, x, y, w, h, 0, 0, tw, th);
    ctx.imageSmoothingEnabled = r.mode === "blur";
    ctx.drawImage(tmp, 0, 0, tw, th, x, y, w, h);
    ctx.imageSmoothingEnabled = true;
    return { x, y, w, h, bs, tw, th };
  }

  // ── 도구의 불러오기 → 편집 캔버스 → 저장용 캔버스 경로
  async function loadBitmap(canvas) {
    const blob = await new Promise((ok) => canvas.toBlob(ok, "image/png"));
    return createImageBitmap(blob, { imageOrientation: "from-image" });
  }
  function toolRun(bmp, regions) {
    const edit = document.createElement("canvas");
    const s = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    edit.width = Math.round(bmp.width * s);
    edit.height = Math.round(bmp.height * s);
    edit.getContext("2d", { willReadFrequently: true }).drawImage(bmp, 0, 0, edit.width, edit.height);
    const editGeo = regions.map((r) => applyRegion(edit, r, 1));
    if (bmp.width === edit.width && bmp.height === edit.height) return { edit, full: edit, editGeo, fullGeo: editGeo, scale: 1 };
    const full = document.createElement("canvas");
    full.width = bmp.width;
    full.height = bmp.height;
    full.getContext("2d", { willReadFrequently: true }).drawImage(bmp, 0, 0);
    const scale = bmp.width / edit.width;
    const fullGeo = regions.map((r) => applyRegion(full, r, scale));
    return { edit, full, editGeo, fullGeo, scale };
  }

  // ── 그리기·측정 도우미
  const newCanvas = (w, h) => {
    const c = document.createElement("canvas");
    c.width = w;
    c.height = h;
    const x = c.getContext("2d", { willReadFrequently: true });
    x.fillStyle = BG;
    x.fillRect(0, 0, w, h);
    return c;
  };
  const fontStr = (px) => `700 ${px}px ${FONT}`;
  const px = (c, x, y, w, h) => c.getContext("2d", { willReadFrequently: true }).getImageData(x, y, w, h).data;
  function inkBox(c, x0, y0, x1, y1) {
    const d = px(c, x0, y0, x1 - x0, y1 - y0);
    const W = x1 - x0;
    let l = Infinity, t = Infinity, r = -1, bt = -1;
    for (let i = 0; i < d.length; i += 4) {
      if (d[i] + d[i + 1] + d[i + 2] < 600) {
        const p = i / 4, xx = p % W, yy = (p - xx) / W;
        if (xx < l) l = xx; if (xx > r) r = xx; if (yy < t) t = yy; if (yy > bt) bt = yy;
      }
    }
    return { left: x0 + l, top: y0 + t, right: x0 + r + 1, bottom: y0 + bt + 1 };
  }
  function inkHeight(text, fontPx) {
    const c = newCanvas(Math.ceil(fontPx * text.length * 1.2) + 20, fontPx * 3);
    const x = c.getContext("2d");
    x.fillStyle = INK; x.font = fontStr(fontPx); x.textBaseline = "alphabetic";
    x.fillText(text, 10, fontPx * 2);
    const bx = inkBox(c, 0, 0, c.width, c.height);
    return bx.bottom - bx.top;
  }
  function fontPxForDigitHeight(target) {
    for (let p = target; p < target * 3; p++) if (inkHeight("0123456789", p) >= target) return p;
    throw new Error("글꼴 크기를 찾지 못함 " + target);
  }
  function psnr(a, bb) {
    let s = 0;
    for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i + k] - bb[i + k]; s += d * d; }
    const mse = s / ((a.length / 4) * 3);
    return mse === 0 ? null : r2(10 * Math.log10(65025 / mse));
  }
  function uniqueColors(d) {
    const s = new Set();
    for (let i = 0; i < d.length; i += 4) s.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
    return s.size;
  }
  /** 글자 한 줄을 그린 시험지. digitH = 숫자 높이(px), 여백은 숫자 높이의 절반 */
  function makeLine(width, height, digitH, text = TEXT) {
    const c = newCanvas(width, height);
    const fontPx = fontPxForDigitHeight(digitH);
    const x = c.getContext("2d");
    x.fillStyle = INK; x.font = fontStr(fontPx); x.textBaseline = "alphabetic";
    const tx = Math.round(digitH * 1.5);
    const ty = Math.round(height / 2 + digitH / 2);
    x.fillText(text, tx, ty);
    const ink = inkBox(c, 0, 0, width, height);
    const digits = inkBox(c, 0, 0, tx + Math.ceil(x.measureText("0123456789").width), height);
    const pad = Math.round(digitH * 0.5);
    const region = { x: ink.left - pad, y: ink.top - pad, w: ink.right - ink.left + pad * 2, h: ink.bottom - ink.top + pad * 2 };
    return { canvas: c, fontPx, digitH: digits.bottom - digits.top, lineInkH: ink.bottom - ink.top, region };
  }

  if (!document.fonts.check(fontStr(32))) throw new Error("맑은 고딕이 없어 측정 글꼴이 달라집니다");

  // ── 1. ladder
  const ladder = [];
  const figSrc = {};
  for (const target of [12, 16, 24, 32, 48, 64]) {
    const line = makeLine(1600, target * 4, target);
    const bmp = await loadBitmap(line.canvas);
    const reg = line.region;
    const before = px(line.canvas, reg.x, reg.y, reg.w, reg.h);
    const row = { digitH: line.digitH, lineInkH: line.lineInkH, fontPx: line.fontPx, image: `${bmp.width}x${bmp.height}`, region: reg, uniqueBefore: uniqueColors(before), cases: [] };
    if (target === 24) figSrc.original = line.canvas;
    for (const mode of MODES) for (const block of STRENGTHS) {
      const run = toolRun(bmp, [{ ...reg, mode, block }]);
      const g = run.fullGeo[0];
      const after = px(run.full, g.x, g.y, g.w, g.h);
      row.cases.push({
        mode, strength: block, cols: g.tw, rows: g.th,
        cellW: r2(g.w / g.tw), cellH: r2(g.h / g.th),
        cellsPerDigitH: r2(line.digitH / (g.h / g.th)),
        psnr: psnr(before, after), uniqueAfter: uniqueColors(after),
      });
      if (target === 24) figSrc[`${mode}-${block}`] = run.full;
    }
    if (target === 24) figSrc.region = reg;
    ladder.push(row);
  }

  // ── 2. variants: 한 자리만 다른 숫자열 10장이 가린 뒤에도 서로 다른가
  const variants = [];
  const BASE = "0123456789";
  const SLOT = 4;
  for (const target of [16, 24, 32, 48]) {
    const fontPx = fontPxForDigitHeight(target);
    const m = document.createElement("canvas").getContext("2d");
    m.font = fontStr(fontPx);
    const adv = Math.ceil(Math.max(...BASE.split("").map((ch) => m.measureText(ch).width)));
    const margin = 60;
    const W = adv * BASE.length + margin * 2, H = target * 3 + margin * 2;
    const draw = (digit) => {
      const c = newCanvas(W, H);
      const x = c.getContext("2d");
      x.fillStyle = INK; x.font = fontStr(fontPx); x.textBaseline = "alphabetic"; x.textAlign = "center";
      BASE.split("").forEach((ch, i) => x.fillText(i === SLOT ? String(digit) : ch, margin + adv * i + adv / 2, margin + target * 2));
      return c;
    };
    const ref = draw(8);
    const ink = inkBox(ref, 0, 0, W, H);
    const digitH = ink.bottom - ink.top;
    const pad = Math.round(digitH * 0.5);
    const w = adv * BASE.length + pad * 2, h = digitH + pad * 2;
    const row = { digitH, fontPx, slotAdvance: adv, regionSize: { w, h }, changedSlot: SLOT + 1, cases: [] };
    for (const mode of MODES) for (const block of STRENGTHS) {
      const counts = [];
      for (const fx of [0, 1, 2]) for (const fy of [0, 1, 2]) {
        const reg = { x: margin - pad - Math.round((block * fx) / 3), y: ink.top - pad - Math.round((block * fy) / 3), w, h, mode, block };
        const keys = new Set();
        let geo = null;
        for (let d = 0; d < 10; d++) {
          const c = draw(d);
          geo = applyRegion(c, reg, 1);
          keys.add(px(c, geo.x, geo.y, geo.w, geo.h).join(","));
        }
        counts.push({ distinct: keys.size, cols: geo.tw, rows: geo.th });
      }
      const ds = counts.map((c) => c.distinct);
      row.cases.push({
        mode, strength: block, cols: counts[0].cols, rows: counts[0].rows,
        cellsPerDigitH: r2(digitH / (h / counts[0].rows)),
        distinctMin: Math.min(...ds), distinctMax: Math.max(...ds),
        distinctAvg: r2(ds.reduce((a, v) => a + v, 0) / ds.length),
        positionsAllSame: ds.filter((v) => v === 1).length, positions: ds.length,
      });
    }
    variants.push(row);
  }

  // ── 3. influence: 2×2칸 영역에서 원본 픽셀 하나만 검게 바꿨을 때 결과가 달라지는 픽셀 수
  const influence = [];
  for (const mode of MODES) for (const block of [4, 12, 40]) {
    const size = block * 2, off = 10;
    const c = newCanvas(size + off * 2, size + off * 2);
    const x = c.getContext("2d", { willReadFrequently: true });
    const hits = [];
    for (let yy = 0; yy < size; yy++) for (let xx = 0; xx < size; xx++) {
      x.fillStyle = BG; x.fillRect(0, 0, c.width, c.height);
      x.fillStyle = "#000000"; x.fillRect(off + xx, off + yy, 1, 1);
      applyRegion(c, { x: off, y: off, w: size, h: size, mode, block }, 1);
      const d = px(c, off, off, size, size);
      let min = 255;
      for (let i = 0; i < d.length; i += 4) if (d[i] < min) min = d[i];
      if (min < 255) hits.push({ x: xx, y: yy, darkest: min });
    }
    influence.push({
      mode, strength: block, cells: 4, sourcePixels: size * size, pixelsPerCell: block * block,
      influencing: hits.length, influencingPerCell: r2(hits.length / 4),
      sharePercent: r2((hits.length / (size * size)) * 100),
      firstCell: hits.filter((p) => p.x < block && p.y < block),
    });
  }

  // ── 4. sizes: 같은 그림을 다른 해상도로. 숫자 높이는 가로의 2%
  const sizes = [];
  const sizeFig = {};
  for (const W of [800, 1200, 2000, 3000, 4000]) {
    const digitTarget = Math.round(W * 0.02);
    const line = makeLine(W, Math.round(W * 0.12), digitTarget);
    const bmp = await loadBitmap(line.canvas);
    const s = Math.min(1, MAX_DIM / Math.max(bmp.width, bmp.height));
    // 사용자는 편집 화면에서 드래그한다 → 편집 캔버스 좌표로 옮겨 정수로(도구의 onPointerUp과 같은 반올림)
    const reg = { x: Math.round(line.region.x * s), y: Math.round(line.region.y * s), w: Math.round(line.region.w * s), h: Math.round(line.region.h * s) };
    const row = { width: W, height: line.canvas.height, editWidth: Math.round(W * s), digitH: line.digitH, cases: [] };
    for (const mode of MODES) for (const block of [12, 20, 40]) {
      const run = toolRun(bmp, [{ ...reg, mode, block }]);
      const g = run.fullGeo[0], e = run.editGeo[0];
      const before = px(line.canvas, g.x, g.y, g.w, g.h);
      const after = px(run.full, g.x, g.y, g.w, g.h);
      // 편집 화면(미리보기)과 저장본의 같은 칸 가운데 색 비교
      let differ = 0, total = 0;
      if (run.full !== run.edit) {
        for (let cy = 0; cy < e.th; cy++) for (let cx = 0; cx < e.tw; cx++) {
          const ex = e.x + ((cx + 0.5) * e.w) / e.tw, ey = e.y + ((cy + 0.5) * e.h) / e.th;
          const p1 = px(run.edit, Math.floor(ex), Math.floor(ey), 1, 1);
          const p2 = px(run.full, Math.floor(ex * run.scale), Math.floor(ey * run.scale), 1, 1);
          total++;
          if (Math.max(Math.abs(p1[0] - p2[0]), Math.abs(p1[1] - p2[1]), Math.abs(p1[2] - p2[2])) > 32) differ++;
        }
      }
      row.cases.push({
        mode, strength: block, scale: r2(run.scale),
        editCols: e.tw, editRows: e.th, savedCols: g.tw, savedRows: g.th,
        savedCellW: r2(g.w / g.tw), savedCellH: r2(g.h / g.th),
        cellsPerDigitH: r2(line.digitH / (g.h / g.th)),
        psnr: psnr(before, after), uniqueAfter: uniqueColors(after),
        previewCells: total, previewCellsDiffer: differ,
      });
      if (mode === "mosaic" && block === 12) sizeFig[W] = { canvas: run.full, geo: g };
    }
    sizes.push(row);
  }

  // ── 그림
  const LABEL = `600 24px ${FONT}`;
  function ladderFigure(mode, name) {
    const reg = figSrc.region, Z = 2, LH = 40, GAP = 14;
    const items = [["가리기 전", figSrc.original], ...[4, 8, 12, 20, 40].map((s) => [`${name} 강도 ${s}`, figSrc[`${mode}-${s}`]])];
    const o = newCanvas(reg.w * Z, items.length * (LH + reg.h * Z + GAP) - GAP);
    const x = o.getContext("2d");
    x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height);
    x.imageSmoothingEnabled = false;
    items.forEach(([label, c], i) => {
      const oy = i * (LH + reg.h * Z + GAP);
      x.fillStyle = "#0A0A0A"; x.font = LABEL; x.textBaseline = "alphabetic"; x.fillText(label, 2, oy + 28);
      x.drawImage(c, reg.x, reg.y, reg.w, reg.h, 0, oy + LH, reg.w * Z, reg.h * Z);
    });
    return { url: o.toDataURL("image/png"), width: o.width, height: o.height };
  }
  function sizeFigure() {
    const OUT_W = 760, LH = 40, GAP = 14;
    const items = [800, 2000, 4000].map((W) => [`가로 ${W}px 사진, 강도 12`, sizeFig[W]]);
    const hs = items.map(([, f]) => Math.round((f.geo.h * OUT_W) / f.geo.w));
    const o = newCanvas(OUT_W, hs.reduce((a, v) => a + v + LH + GAP, 0) - GAP);
    const x = o.getContext("2d");
    x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height);
    let oy = 0;
    items.forEach(([label, f], i) => {
      x.fillStyle = "#0A0A0A"; x.font = LABEL; x.textBaseline = "alphabetic"; x.fillText(label, 2, oy + 28);
      x.imageSmoothingEnabled = f.geo.w > OUT_W; // 키울 때는 픽셀 그대로, 줄일 때만 보간
      x.drawImage(f.canvas, f.geo.x, f.geo.y, f.geo.w, f.geo.h, 0, oy + LH, OUT_W, hs[i]);
      oy += LH + hs[i] + GAP;
    });
    return { url: o.toDataURL("image/png"), width: o.width, height: o.height };
  }

  return {
    data: { ladder, variants, influence, sizes },
    figures: { "ladder-mosaic": ladderFigure("mosaic", "모자이크"), "ladder-blur": ladderFigure("blur", "블러"), "size-compare": sizeFigure() },
  };
});

fs.mkdirSync(figDir, { recursive: true });
const figures = {};
for (const [name, f] of Object.entries(result.figures)) {
  fs.writeFileSync(path.join(figDir, `${name}.png`), Buffer.from(f.url.split(",")[1], "base64"));
  figures[name] = { file: `${name}.png`, width: f.width, height: f.height };
  console.log("figure", name, f.width, f.height);
}
fs.writeFileSync(out, JSON.stringify({ browser: `Chromium ${b.version()}`, measuredAt: new Date().toISOString(), figures, ...result.data }, null, 2));
for (const row of result.data.ladder) {
  console.log(`digitH ${row.digitH} (font ${row.fontPx}px, region ${row.region.w}x${row.region.h}, unique ${row.uniqueBefore})`);
  for (const c of row.cases) console.log("  ", c.mode, c.strength, `${c.cols}x${c.rows}`, "cellH", c.cellH, "cells/digit", c.cellsPerDigitH, "psnr", c.psnr, "uniq", c.uniqueAfter);
}
for (const row of result.data.variants) {
  console.log(`variants digitH ${row.digitH} region ${row.regionSize.w}x${row.regionSize.h}`);
  for (const c of row.cases) console.log("  ", c.mode, c.strength, `${c.cols}x${c.rows}`, "cells/digit", c.cellsPerDigitH, "distinct", c.distinctMin, c.distinctAvg, c.distinctMax, "allSame", c.positionsAllSame + "/" + c.positions);
}
for (const r of result.data.influence) console.log("influence", r.mode, r.strength, r.influencing, "/", r.sourcePixels, "perCell", r.influencingPerCell, JSON.stringify(r.firstCell));
for (const row of result.data.sizes) {
  console.log(`size ${row.width}x${row.height} edit ${row.editWidth} digitH ${row.digitH}`);
  for (const c of row.cases) console.log("  ", c.mode, c.strength, "saved cell", c.savedCellW, c.savedCellH, "cells/digit", c.cellsPerDigitH, "psnr", c.psnr, "preview differ", c.previewCellsDiffer + "/" + c.previewCells, `edit ${c.editCols}x${c.editRows} saved ${c.savedCols}x${c.savedRows}`);
}
await b.close();
