/**
 * 블로그 실측용(passport-photo-size): 외교부 여권안내에서 확인한 온라인 신청용 사진 파일 규격
 * (docs/blog-data/passport-specs-*.json — 413×531px 권장, 395~431 × 507~550px, 500KB 이하, JPG)으로
 * floor05 도구가 만든 파일의 크기·용량을 잰다. 얼굴 비율·배경 판정은 재지 않는다(사람 사진을 쓰지 않음).
 *
 * 경로: 도구 코드를 그대로 묶어 페이지에 주입해 호출한다(재구현하지 않음).
 *   - cropImage / calculateMaxCropArea  = src/lib/image/crop.ts (이미지 크롭의 '여권 3.5×4.5' 프리셋과 같은 호출)
 *   - compressToTargetSize              = src/lib/image/compress.ts (이미지 압축의 목표 용량 모드)
 * 재는 것:
 *   - preset   : 35:45 최대 영역을 413×531 JPG 92%(크롭 도구 기본값)로 저장한 용량, 남는 면적, 축소 배율, JFIF 밀도 표기
 *   - quality  : 같은 413×531을 품질 100·92·80·60·40%로 저장한 용량과 PSNR
 *                (기준 = 같은 캔버스를 PNG로 저장한 무손실 픽셀, RGB 3채널)
 *   - png      : 같은 캔버스의 PNG 용량(PNG를 넣으면 크롭 도구가 PNG로 저장하므로)
 *   - rangeMax : 업로드 허용 범위의 가장 큰 크기 431×550 JPG 92% 용량
 *   - upscale  : 작은 JPG(310×398, 207×266, 138×177)를 413×531로 키운 결과의 PSNR(기준은 위와 같음)
 *   - target500: 원본을 자르지 않고 압축 도구 목표 용량 500KB에 넣었을 때의 결과 크기·용량
 * 소스: NASA 공공 도메인 사진(인자로 전달) + 스크립트가 그리는 '흰 배경 도형' 3024×4032(얼굴이 아닌 도형).
 *
 * 사용: (저장소 루트에서)
 *   npx esbuild <entry.ts> --bundle --format=iife --global-name=FL --outfile=<bundle.js>
 *     entry.ts 내용: export { cropImage, calculateMaxCropArea } from "<repo>/src/lib/image/crop";
 *                    export { compressToTargetSize } from "<repo>/src/lib/image/compress";
 *   node scripts/blog-measure/passport-size.mjs <출력.json> <bundle.js> 이름=<사진.jpg> [이름=<사진.jpg> ...]
 */
import fs from "node:fs";
import { chromium } from "@playwright/test";

const [, , out, bundlePath, ...photoArgs] = process.argv;
if (!out || !bundlePath || photoArgs.length === 0) {
  throw new Error("사용: node scripts/blog-measure/passport-size.mjs <출력.json> <bundle.js> 이름=<사진.jpg> ...");
}

const b = await chromium.launch();
const page = await b.newPage();
await page.setContent("<html></html>");
await page.addScriptTag({ content: fs.readFileSync(bundlePath, "utf8") });

// 페이지 안에서 한 장을 처리한다. file은 window.__file에 미리 넣어 둔다.
const measure = () =>
  page.evaluate(async () => {
    /* global FL */
    const file = window.__file;
    const load = (src) =>
      new Promise((ok, fail) => {
        const i = new Image();
        i.onload = () => ok(i);
        i.onerror = () => fail(new Error("load"));
        i.src = src;
      });
    const pixels = async (blob) => {
      const url = URL.createObjectURL(blob);
      const im = await load(url);
      const c = document.createElement("canvas");
      c.width = im.width;
      c.height = im.height;
      c.getContext("2d").drawImage(im, 0, 0);
      URL.revokeObjectURL(url);
      return c.getContext("2d").getImageData(0, 0, c.width, c.height).data;
    };
    const psnr = (a, bb) => {
      let s = 0;
      for (let i = 0; i < a.length; i += 4) for (let k = 0; k < 3; k++) { const d = a[i + k] - bb[i + k]; s += d * d; }
      return Number((10 * Math.log10(65025 / (s / ((a.length / 4) * 3)))).toFixed(2));
    };
    // JFIF APP0의 밀도 표기(units 0=비율만, 1=dpi, 2=dpcm)
    const jfifDensity = async (blob) => {
      const v = new DataView(await blob.slice(0, 32).arrayBuffer());
      if (v.getUint16(0) !== 0xffd8 || v.getUint16(2) !== 0xffe0) return null;
      const id = String.fromCharCode(v.getUint8(6), v.getUint8(7), v.getUint8(8), v.getUint8(9));
      if (id !== "JFIF") return null;
      return { units: v.getUint8(13), x: v.getUint16(14), y: v.getUint16(16) };
    };

    const probe = await load(URL.createObjectURL(file));
    const W = probe.width, H = probe.height;
    const RATIO = 35 / 45; // 크롭 도구 ID_PHOTO_PRESETS의 passport.ratio
    const area = FL.calculateMaxCropArea(W, H, RATIO);
    const crop = (opts) => FL.cropImage(file, { area, targetWidth: 413, targetHeight: 531, ...opts });

    // 기준(무손실): 같은 캔버스를 PNG로
    const png = await crop({ outputFormat: "image/png" });
    const ref = await pixels(png.blob);

    const jpg92 = await crop({ outputFormat: "image/jpeg" }); // quality 기본값 0.92
    const preset = {
      width: jpg92.width,
      height: jpg92.height,
      cropAreaPx: [Math.round(area.width), Math.round(area.height)],
      keptPct: Number(((area.width * area.height) / (W * H) * 100).toFixed(1)),
      scaleDown: Number((area.width / 413).toFixed(2)),
      jpgBytes: jpg92.blob.size,
      psnr: psnr(ref, await pixels(jpg92.blob)),
      jfifDensity: await jfifDensity(jpg92.blob),
    };

    const quality = [];
    for (const q of [1, 0.92, 0.8, 0.6, 0.4]) {
      const r = await crop({ outputFormat: "image/jpeg", quality: q });
      quality.push({ quality: q, bytes: r.blob.size, psnr: psnr(ref, await pixels(r.blob)) });
    }

    // 허용 범위에서 가장 큰 크기(비율은 '정확한 크기로 출력'에 직접 넣었을 때처럼 출력 크기를 따름)
    const areaMax = FL.calculateMaxCropArea(W, H, 431 / 550);
    const rangeMaxJpg = await FL.cropImage(file, { area: areaMax, outputFormat: "image/jpeg", targetWidth: 431, targetHeight: 550 });
    const rangeMax = { width: 431, height: 550, jpgBytes: rangeMaxJpg.blob.size };

    // 작은 사진을 413×531로 키우기
    const upscale = [];
    for (const [sw, sh] of [[310, 398], [207, 266], [138, 177]]) {
      const small = await crop({ outputFormat: "image/jpeg", targetWidth: sw, targetHeight: sh });
      const smallFile = new File([small.blob], "small.jpg", { type: "image/jpeg" });
      const up = await FL.cropImage(smallFile, {
        area: { x: 0, y: 0, width: sw, height: sh },
        outputFormat: "image/jpeg",
        targetWidth: 413,
        targetHeight: 531,
      });
      upscale.push({
        from: [sw, sh],
        factor: Number((413 / sw).toFixed(2)),
        smallBytes: small.blob.size,
        upscaledBytes: up.blob.size,
        psnr: psnr(ref, await pixels(up.blob)),
      });
    }

    // 자르지 않은 원본을 압축 도구 목표 용량 500KB에 넣으면
    const t = await FL.compressToTargetSize(file, 500, { outputFormat: "image/jpeg" });
    const target500 = { width: t.width, height: t.height, bytes: t.compressedSize };

    return { width: W, height: H, fileBytes: file.size, preset, pngBytes: png.blob.size, quality, rangeMax, upscale, target500 };
  });

const photos = {};
for (const arg of photoArgs) {
  const i = arg.indexOf("=");
  const name = arg.slice(0, i);
  const b64 = fs.readFileSync(arg.slice(i + 1)).toString("base64");
  await page.evaluate(
    ({ b64, name }) => {
      const bin = atob(b64);
      const bytes = new Uint8Array(bin.length);
      for (let k = 0; k < bin.length; k++) bytes[k] = bin.charCodeAt(k);
      window.__file = new File([bytes], `${name}.jpg`, { type: "image/jpeg" });
    },
    { b64, name },
  );
  photos[name] = await measure();
  console.log(name, JSON.stringify(photos[name], null, 1));
}

// 흰 배경 도형: 3024×4032(12MP 세로), 옅은 회색 배경 + 타원 + 어깨 모양 + 채널별 ±4 잡음(시드 고정)
await page.evaluate(async () => {
  const W = 3024, H = 4032;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, 0, H);
  g.addColorStop(0, "#F6F6F6");
  g.addColorStop(1, "#ECECEC");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#2F3A4A";
  ctx.beginPath();
  ctx.ellipse(W / 2, H, 1450, 1150, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#C9A183";
  ctx.beginPath();
  ctx.ellipse(W / 2, 1750, 640, 830, 0, 0, Math.PI * 2);
  ctx.fill();
  const img = ctx.getImageData(0, 0, W, H);
  const d = img.data;
  let s = 20261123; // mulberry32
  const rnd = () => {
    s |= 0; s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) {
    d[i + k] = Math.max(0, Math.min(255, d[i + k] + Math.round(rnd() * 8 - 4)));
  }
  ctx.putImageData(img, 0, 0);
  const blob = await new Promise((ok) => c.toBlob(ok, "image/jpeg", 0.92));
  window.__file = new File([blob], "shapes.jpg", { type: "image/jpeg" });
});
photos.shapes = await measure();
console.log("shapes", JSON.stringify(photos.shapes, null, 1));

fs.writeFileSync(
  out,
  JSON.stringify({ browser: `Playwright Chromium ${b.version()}`, measuredAt: new Date().toISOString(), photos }, null, 2),
);
await b.close();
