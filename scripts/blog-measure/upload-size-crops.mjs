/**
 * 블로그 실측용(prevent-photo-theft): 줄여 올린 사진을 다시 원본 크기로 키웠을 때 같은 영역이 어떻게 보이는지
 * 2×2 비교 이미지를 만든다. 첫 칸은 원본, 나머지는 upload-size-restore.mjs가 만든 줄인 JPG를
 * 브라우저 drawImage(imageSmoothingQuality="high")로 원본 크기까지 키운 뒤 같은 영역을 자른 것.
 * 각 칸은 원본 픽셀 영역을 확대 없이 보간 끄고(ZOOM배) 그린다.
 * 사용: node scripts/blog-measure/upload-size-crops.mjs <출력.png> <원본.jpg> <x,y,size> <라벨=줄인.jpg>... [--zoom=2]
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const args = process.argv.slice(2);
const zoomArg = args.find((a) => a.startsWith("--zoom="));
const ZOOM = zoomArg ? Number(zoomArg.slice(7)) : 2;
const [out, origFile, box, ...specs] = args.filter((a) => !a.startsWith("--"));
const [bx, by, size] = box.split(",").map(Number);
const b64 = (f) => fs.readFileSync(f).toString("base64");
const tiles = [{ label: "원본", b64: b64(origFile) }].concat(
  specs.map((s) => {
    const i = s.indexOf("=");
    return { label: s.slice(0, i), b64: b64(s.slice(i + 1)) };
  }),
);

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setContent("<html></html>");
const dataUrl = await page.evaluate(
  async ({ tiles, bx, by, size, ZOOM }) => {
    const bitmapOf = (s) =>
      createImageBitmap(new Blob([Uint8Array.from(atob(s), (c) => c.charCodeAt(0))], { type: "image/jpeg" }));
    const first = await bitmapOf(tiles[0].b64);
    const W = first.width;
    const H = first.height;
    const T = size * ZOOM;
    const PAD = 50;
    const GAP = 10;
    const cols = 2;
    const rowsN = Math.ceil(tiles.length / cols);
    const o = document.createElement("canvas");
    o.width = cols * T + (cols - 1) * GAP;
    o.height = rowsN * (T + PAD) + (rowsN - 1) * GAP;
    const x = o.getContext("2d");
    x.fillStyle = "#FAFAFA";
    x.fillRect(0, 0, o.width, o.height);
    for (let i = 0; i < tiles.length; i++) {
      const bmp = i === 0 ? first : await bitmapOf(tiles[i].b64);
      // 가져간 사람이 하듯 원본 크기로 키운 다음 같은 자리를 자른다
      const full = new OffscreenCanvas(W, H);
      const fx = full.getContext("2d");
      fx.imageSmoothingEnabled = true;
      fx.imageSmoothingQuality = "high";
      fx.drawImage(bmp, 0, 0, W, H);
      const ox = (i % cols) * (T + GAP);
      const oy = Math.floor(i / cols) * (T + PAD + GAP);
      x.fillStyle = "#0A0A0A";
      x.font = "600 30px 'Malgun Gothic', sans-serif";
      x.fillText(tiles[i].label, ox + 2, oy + 35);
      x.imageSmoothingEnabled = false;
      x.drawImage(full, bx, by, size, size, ox, oy + PAD, T, T);
    }
    return o.toDataURL("image/png");
  },
  { tiles, bx, by, size, ZOOM },
);
fs.writeFileSync(out, Buffer.from(dataUrl.split(",")[1], "base64"));
console.log(out, await page.evaluate((u) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(`${i.width}x${i.height}`); i.src = u; }), dataUrl));
await browser.close();
