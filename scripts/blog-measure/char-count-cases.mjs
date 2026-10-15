/**
 * 블로그 실측용: 까다로운 입력을 여러 방식으로 세어 비교한다.
 * - JS length(UTF-16), 코드 포인트, 눈에 보이는 글자(Intl.Segmenter), UTF-8 바이트,
 *   floor05 글자수 세기(src/lib/text/count.ts를 esbuild로 묶어 주입: 공백 포함/제외, naver·hwp 모드)
 * - 브라우저별 <textarea maxlength>가 이모지·분해 한글을 몇 글자로 세는지(insertText로 입력)
 * 사용: npx esbuild src/lib/text/count.ts --bundle --format=iife --global-name=TC --outfile=<count.js>
 *       node scripts/blog-measure/char-count-cases.mjs <count.js> <출력.json>
 */
import fs from "node:fs";
import { chromium, firefox, webkit } from "@playwright/test";

const [, , countJs, out] = process.argv;
const CASES = [
  ["한글 문장", "안녕하세요 반갑습니다"],
  ["영문+숫자", "Hello 2026"],
  ["이모지 1개", "좋아요👍"],
  ["가족 이모지(ZWJ)", "가족👨‍👩‍👧"],
  ["국기", "한국🇰🇷"],
  ["분해된 한글(NFD)", "한글".normalize("NFD")],
  ["줄바꿈 LF", "첫 줄\n둘째 줄"],
  ["줄바꿈 CRLF", "첫 줄\r\n둘째 줄"],
  ["줄바꿈 없는 공백(U+00A0)", "웹\u00A0복사"],
  ["전각 공백(U+3000)", "전각\u3000공백"],
  ["폭 없는 공백(U+200B)", "보이지\u200B않음"],
];
const result = { cases: [], maxlength: {} };
const b0 = await chromium.launch(); const p0 = await b0.newPage(); await p0.setContent("<html></html>");
await p0.addScriptTag({ content: fs.readFileSync(countJs, "utf8") });
result.cases = await p0.evaluate((cases) => cases.map(([name, s]) => {
  const seg = new Intl.Segmenter("ko", { granularity: "grapheme" });
  const n = TC.analyzeText(s, "naver"), h = TC.analyzeText(s, "hwp");
  return {
    name, codepoints: [...s].map((c) => "U+" + c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")).join(" "),
    jsLength: s.length, codePoints: [...s].length, graphemes: [...seg.segment(s)].length,
    utf8Bytes: new TextEncoder().encode(s).length,
    floor05: { naverChars: n.chars, naverNoSpace: n.charsNoSpace, hwpChars: h.chars, hwpNoSpace: h.charsNoSpace, bytes2: n.bytes2, bytes3: n.bytes3 },
  };
}), CASES);
await b0.close();
for (const [name, engine] of [["Chromium", chromium], ["Firefox", firefox], ["WebKit", webkit]]) {
  const b = await engine.launch(); const p = await b.newPage();
  await p.setContent('<textarea id="t" maxlength="5"></textarea>');
  const r = {};
  for (const [label, text] of [["👍 6개", "👍👍👍👍👍👍"], ["가족 이모지 2개", "👨‍👩‍👧👨‍👩‍👧"], ["NFD 한글 4자", "한글한글".normalize("NFD")], ["한글 6자", "가나다라마바"]]) {
    await p.fill("#t", "");
    await p.focus("#t");
    await p.keyboard.insertText(text);
    const v = await p.inputValue("#t");
    r[label] = { kept: v, jsLength: v.length, graphemes: await p.evaluate((x) => [...new Intl.Segmenter("ko", { granularity: "grapheme" }).segment(x)].length, v) };
  }
  result.maxlength[name] = { version: b.version(), ...r };
  await b.close();
}
fs.writeFileSync(out, JSON.stringify({ measuredAt: new Date().toISOString(), result }, null, 2));
console.log(JSON.stringify(result, null, 1));
