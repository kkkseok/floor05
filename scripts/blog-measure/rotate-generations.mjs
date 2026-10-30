/**
 * 블로그 실측용: floor05 이미지 회전과 같은 방식(Canvas 90° 회전 → JPEG 92% 저장)을 반복해
 * 회전 횟수별 용량·PSNR을 잰다. 비교군: 회전 없이 재저장만 반복 / 16의 배수로 자른 사진의 회전 반복.
 * PSNR 기준은 원본을 손실 없이(픽셀 재배치만) 같은 각도로 돌린 이미지다.
 * 사용: node scripts/blog-measure/rotate-generations.mjs <출력.json> <사진.jpg> [crop.png]
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, photo, cropOut] = process.argv;
const url = `data:image/jpeg;base64,${fs.readFileSync(photo).toString("base64")}`;
const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
const result = await page.evaluate(async ({ url, wantCrop }) => {
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
  const toBlob = (c) => new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.92));
  const rotate = (src, deg) => {
    const swap = deg % 180 !== 0;
    const c = document.createElement("canvas");
    c.width = swap ? src.height : src.width; c.height = swap ? src.width : src.height;
    const x = c.getContext("2d");
    x.translate(c.width / 2, c.height / 2); x.rotate((deg * Math.PI) / 180); x.drawImage(src, -src.width / 2, -src.height / 2);
    return c;
  };
  const crop = (src, w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; c.getContext("2d").drawImage(src, 0, 0); return c; };
  const px = (c) => c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
  const psnr = (a, bb) => { let s = 0; for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i+k] - bb[i+k]; s += d*d; } return Number((10*Math.log10(65025/(s/(a.length/4*3)))).toFixed(2)); };
  const toCanvas = async (blob) => { const im = await load(URL.createObjectURL(blob)); return crop(im, im.width, im.height); };

  const orig = await load(url);
  const base = crop(orig, orig.width, orig.height);
  const base16 = crop(orig, Math.floor(orig.width / 16) * 16, Math.floor(orig.height / 16) * 16);
  const marks = [1, 2, 4, 8, 12, 20];
  const runs = {};
  const crops = {};
  for (const [name, start, deg] of [["resave", base, 0], ["rotate90", base, 90], ["rotate90_mult16", base16, 90]]) {
    // 기준 이미지(각도별): 원본을 손실 없이 회전
    const refs = [0, 90, 180, 270].map((d) => px(rotate(start, d)));
    let cur = start; const rows = [];
    for (let n = 1; n <= 20; n++) {
      const blob = await toBlob(rotate(cur, deg));
      cur = await toCanvas(blob);
      if (marks.includes(n)) rows.push({ n, bytes: blob.size, w: cur.width, h: cur.height, psnr: psnr(refs[(n * deg / 90) % 4], px(cur)) });
      if (wantCrop && n === 20 && name !== "rotate90_mult16") crops[name] = cur;
    }
    runs[name] = { width: start.width, height: start.height, rows };
  }
  let cropPng = null;
  if (wantCrop) {
    // 20번 후 같은 영역(원본 기준 거북이 눈)을 원본·재저장·회전 결과에서 잘라 2배 확대
    const sx = 1150, sy = 2880, sw = 180, sh = 120, Z = 2, PAD = 30, GAP = 10;
    const tiles = [["원본", base], ["재저장 20번", crops.resave], ["90° 회전 20번", crops.rotate90]];
    const o = document.createElement("canvas"); o.width = tiles.length * sw * Z + (tiles.length - 1) * GAP; o.height = sh * Z + PAD;
    const x = o.getContext("2d"); x.fillStyle = "#FAFAFA"; x.fillRect(0, 0, o.width, o.height); x.imageSmoothingEnabled = false;
    tiles.forEach(([label, c], i) => {
      const ox = i * (sw * Z + GAP);
      x.fillStyle = "#0A0A0A"; x.font = "600 16px sans-serif"; x.fillText(label, ox + 2, 21);
      x.drawImage(c, sx, sy, sw, sh, ox, PAD, sw * Z, sh * Z); // 20번 = 0°로 돌아온 상태
    });
    cropPng = o.toDataURL("image/png");
  }
  return { runs, cropPng };
}, { url, wantCrop: Boolean(cropOut) });
if (cropOut) fs.writeFileSync(cropOut, Buffer.from(result.cropPng.split(",")[1], "base64"));
fs.writeFileSync(out, JSON.stringify({ browser: b.version(), measuredAt: new Date().toISOString(), quality: 0.92, runs: result.runs }, null, 2));
for (const [k, v] of Object.entries(result.runs)) console.log(k, v.width + "x" + v.height, JSON.stringify(v.rows));
await b.close();
