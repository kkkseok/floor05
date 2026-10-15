/**
 * 블로그 실측용: floor05 이미지 합치기(src/lib/image/merge.ts)와 같은 방식으로
 * ① 휴대폰 화면 캡처(1080×2340)를 세로로 몇 장까지 이어 붙일 수 있는지(브라우저별 캔버스 한계)
 * ② 5장 세로 합치기 PNG/JPG 용량 ③ 폭이 다른 사진+캡처를 '폭 맞춤'으로 합칠 때 확대 영향을 잰다.
 * 사용: node scripts/blog-measure/merge-limits.mjs <출력.json> <캡처.png> <사진1920.png>
 */
import fs from "node:fs";
import { chromium, webkit, firefox } from "@playwright/test";

const [, , out, shotPath, photoPath] = process.argv;
const shotUrl = `data:image/png;base64,${fs.readFileSync(shotPath).toString("base64")}`;
const photoUrl = `data:image/png;base64,${fs.readFileSync(photoPath).toString("base64")}`;
const result = {};
for (const [name, engine] of [["Chromium", chromium], ["WebKit", webkit], ["Firefox", firefox]]) {
  const b = await engine.launch(); const p = await b.newPage(); await p.setContent("<html></html>");
  result[name] = await p.evaluate(async ({ shotUrl, photoUrl }) => {
    const load = (s) => new Promise((ok, no) => { const i = new Image(); i.onload = () => ok(i); i.onerror = no; i.src = s; });
    const toBlob = (c, t, q) => new Promise((ok) => { try { c.toBlob((bl) => ok(bl), t, q); } catch { ok(null); } });
    const shot = await load(shotUrl), photo = await load(photoUrl);
    const stack = async (n, type) => {
      const c = document.createElement("canvas");
      try {
        c.width = shot.width; c.height = shot.height * n;
        const x = c.getContext("2d");
        if (!x) return null;
        x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
        for (let i = 0; i < n; i++) x.drawImage(shot, 0, i * shot.height);
        return await toBlob(c, type, 0.92);
      } catch {
        return null; // 캔버스 한계 초과(Firefox는 예외를 던진다)
      } finally {
        c.width = 0; c.height = 0; // 메모리 반환
      }
    };
    const capacity = {};
    for (const type of ["image/png", "image/jpeg"]) {
      let last = 0;
      for (let n = 1; n <= 60; n++) { const bl = await stack(n, type); if (!bl || bl.size === 0) break; last = n; }
      capacity[type] = { maxCount: last, maxHeight: last * shot.height };
    }
    const five = {};
    for (const type of ["image/png", "image/jpeg"]) { const bl = await stack(5, type); five[type] = bl ? bl.size : null; }
    // 폭이 다른 두 장: 사진(1920) + 캡처(1080). match = 넓은 폭(1920)에 맞춰 캡처 확대, keep = 원래 크기
    const mixed = {};
    for (const strategy of ["match", "keep"]) {
      const W = Math.max(photo.width, shot.width);
      const sh = strategy === "match" ? Math.round(shot.height * (W / shot.width)) : shot.height;
      const sw = strategy === "match" ? W : shot.width;
      const c = document.createElement("canvas"); c.width = W; c.height = photo.height + sh;
      const x = c.getContext("2d"); x.imageSmoothingQuality = "high"; x.fillStyle = "#fff"; x.fillRect(0, 0, c.width, c.height);
      x.drawImage(photo, 0, 0); x.drawImage(shot, Math.round((W - sw) / 2), photo.height, sw, sh);
      const bl = await toBlob(c, "image/jpeg", 0.92);
      mixed[strategy] = { width: c.width, height: c.height, bytes: bl.size, shotScale: Number((sw / shot.width).toFixed(3)) };
    }
    return { shot: `${shot.width}x${shot.height}`, capacity, five, mixed };
  }, { shotUrl, photoUrl });
  result[name].version = b.version();
  console.log(name, JSON.stringify(result[name]));
  await b.close();
}
fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), result }, null, 2));
