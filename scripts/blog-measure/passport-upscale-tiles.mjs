/**
 * 블로그 그림(passport-photo-size): 원본에서 바로 413×531로 줄인 결과(1)와,
 * 207×266으로 저장한 작은 JPG를 413×531로 키운 결과(2)의 같은 영역(가운데 240×240)을
 * 2배 확대(픽셀 그대로, 스무딩 끔)해 나란히 놓는다. 두 결과 모두 도구 코드(cropImage, JPG 92%)로 만든다.
 * 사용: (bundle.js는 passport-size.mjs 머리 주석과 같은 방법으로 만든다)
 *   node scripts/blog-measure/passport-upscale-tiles.mjs <출력.jpg> <bundle.js> <사진.jpg>
 * 결과: 976×480 JPG
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, bundlePath, photo] = process.argv;
if (!out || !bundlePath || !photo) {
  throw new Error("사용: node scripts/blog-measure/passport-upscale-tiles.mjs <출력.jpg> <bundle.js> <사진.jpg>");
}
const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
await page.addScriptTag({ content: fs.readFileSync(bundlePath, "utf8") });
const b64 = await page.evaluate(async (src) => {
  /* global FL */
  const bin = atob(src);
  const bytes = new Uint8Array(bin.length);
  for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
  const file = new File([bytes], "photo.jpg", { type: "image/jpeg" });
  const load = (s) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.src = s; });
  const probe = await load(URL.createObjectURL(file));
  const area = FL.calculateMaxCropArea(probe.width, probe.height, 35 / 45);
  const direct = await FL.cropImage(file, { area, outputFormat: "image/jpeg", targetWidth: 413, targetHeight: 531 });
  const small = await FL.cropImage(file, { area, outputFormat: "image/jpeg", targetWidth: 207, targetHeight: 266 });
  const up = await FL.cropImage(new File([small.blob], "small.jpg", { type: "image/jpeg" }), {
    area: { x: 0, y: 0, width: 207, height: 266 },
    outputFormat: "image/jpeg",
    targetWidth: 413,
    targetHeight: 531,
  });
  const TILE = 240, ZOOM = 2, GAP = 16;
  const c = document.createElement("canvas");
  c.width = TILE * ZOOM * 2 + GAP;
  c.height = TILE * ZOOM;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#FAFAFA";
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.imageSmoothingEnabled = false;
  const sx = Math.round((413 - TILE) / 2), sy = Math.round((531 - TILE) / 2);
  for (const [i, r] of [direct, up].entries()) {
    const im = await load(URL.createObjectURL(r.blob));
    const dx = i * (TILE * ZOOM + GAP);
    ctx.drawImage(im, sx, sy, TILE, TILE, dx, 0, TILE * ZOOM, TILE * ZOOM);
    ctx.fillStyle = "#0A0A0A";
    ctx.fillRect(dx, 0, 44, 44);
    ctx.fillStyle = "#FAFAFA";
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(String(i + 1), dx + 22, 23);
  }
  return c.toDataURL("image/jpeg", 0.9).split(",")[1];
}, fs.readFileSync(photo).toString("base64"));
fs.writeFileSync(out, Buffer.from(b64, "base64"));
console.log("saved", out, fs.statSync(out).size, "bytes");
await b.close();
