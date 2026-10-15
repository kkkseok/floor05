/**
 * 색상 변환 (100% 클라이언트, 순수 함수)
 * - HEX ↔ RGB ↔ HSL ↔ CMYK 상호 변환
 * - 입력 파서는 #RGB·#RRGGBB·rgb()·hsl() 형식을 허용
 */

export interface RGB {
  r: number; // 0~255
  g: number;
  b: number;
}

export interface HSL {
  h: number; // 0~360
  s: number; // 0~100
  l: number; // 0~100
}

export interface CMYK {
  c: number; // 0~100
  m: number;
  y: number;
  k: number;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

export function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => clamp(Math.round(n), 0, 255).toString(16).padStart(2, "0");
  return `#${h(r)}${h(g)}${h(b)}`.toUpperCase();
}

export function rgbToHsl({ r, g, b }: RGB): HSL {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === rf) h = ((gf - bf) / d) % 6;
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  const sf = s / 100, lf = l / 100;
  const c = (1 - Math.abs(2 * lf - 1)) * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = lf - c / 2;
  let rf = 0, gf = 0, bf = 0;
  const hh = ((h % 360) + 360) % 360;
  if (hh < 60) [rf, gf, bf] = [c, x, 0];
  else if (hh < 120) [rf, gf, bf] = [x, c, 0];
  else if (hh < 180) [rf, gf, bf] = [0, c, x];
  else if (hh < 240) [rf, gf, bf] = [0, x, c];
  else if (hh < 300) [rf, gf, bf] = [x, 0, c];
  else [rf, gf, bf] = [c, 0, x];
  return {
    r: Math.round((rf + m) * 255),
    g: Math.round((gf + m) * 255),
    b: Math.round((bf + m) * 255),
  };
}

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const k = 1 - Math.max(rf, gf, bf);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rf - k) / (1 - k)) * 100),
    m: Math.round(((1 - gf - k) / (1 - k)) * 100),
    y: Math.round(((1 - bf - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

/** 다양한 형식의 색 문자열을 RGB로 파싱. 실패 시 null */
export function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // #RGB / #RRGGBB
  const hex = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s);
  if (hex) {
    let h = hex[1];
    if (h.length === 3) h = h.split("").map((c) => c + c).join("");
    return {
      r: parseInt(h.slice(0, 2), 16),
      g: parseInt(h.slice(2, 4), 16),
      b: parseInt(h.slice(4, 6), 16),
    };
  }

  // rgb(r,g,b) / rgba(r,g,b,a)
  const rgb = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/.exec(s);
  if (rgb) {
    const r = clamp(+rgb[1], 0, 255), g = clamp(+rgb[2], 0, 255), b = clamp(+rgb[3], 0, 255);
    return { r, g, b };
  }

  // hsl(h,s%,l%)
  const hsl = /^hsla?\(\s*(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/.exec(s);
  if (hsl) {
    return hslToRgb({ h: +hsl[1], s: clamp(+hsl[2], 0, 100), l: clamp(+hsl[3], 0, 100) });
  }

  return null;
}

export function rgbString({ r, g, b }: RGB): string {
  return `rgb(${r}, ${g}, ${b})`;
}

export function hslString(hsl: HSL): string {
  return `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;
}

export function cmykString(c: CMYK): string {
  return `cmyk(${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%)`;
}
