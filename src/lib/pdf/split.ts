/**
 * PDF 분할 (100% 클라이언트, pdf-lib)
 * - 페이지 추출: "1-3,5" 같은 범위 → 해당 페이지만 담은 PDF 1개
 * - 낱장 분할: 모든 페이지를 1장씩 → PDF N개
 */

import { PDFDocument } from "pdf-lib";
import { loadPdf } from "./load";

/**
 * "1-3, 5, 8-10" → 0-based 인덱스 배열(입력 순서·중복 유지).
 * 잘못된 입력이나 범위를 벗어난 페이지가 있으면 null.
 */
export function parsePageRanges(input: string, pageCount: number): number[] | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const indices: number[] = [];
  for (const part of trimmed.split(",").map((p) => p.trim()).filter(Boolean)) {
    const range = /^(\d+)\s*-\s*(\d+)$/.exec(part);
    const single = /^(\d+)$/.exec(part);

    if (range) {
      const start = Number(range[1]);
      const end = Number(range[2]);
      if (start < 1 || end < 1 || start > pageCount || end > pageCount) return null;
      const step = start <= end ? 1 : -1;
      for (let p = start; step > 0 ? p <= end : p >= end; p += step) {
        indices.push(p - 1);
      }
    } else if (single) {
      const p = Number(single[1]);
      if (p < 1 || p > pageCount) return null;
      indices.push(p - 1);
    } else {
      return null;
    }
  }

  return indices.length > 0 ? indices : null;
}

/** 지정 페이지만 담은 PDF 1개 */
export async function extractPages(
  buffer: ArrayBuffer,
  indices: number[],
): Promise<Uint8Array> {
  const src = await loadPdf(buffer);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save();
}

export interface SplitFile {
  name: string;
  bytes: Uint8Array;
}

/** 모든 페이지를 1장짜리 PDF로 분할 */
export async function splitAllPages(
  buffer: ArrayBuffer,
  baseName: string,
): Promise<SplitFile[]> {
  const src = await loadPdf(buffer);
  const count = src.getPageCount();
  const pad = String(count).length;

  const files: SplitFile[] = [];
  for (let i = 0; i < count; i++) {
    const out = await PDFDocument.create();
    const [page] = await out.copyPages(src, [i]);
    out.addPage(page);
    const bytes = await out.save();
    files.push({ name: `${baseName}_${String(i + 1).padStart(pad, "0")}.pdf`, bytes });
  }
  return files;
}
