/**
 * PDF 병합 (100% 클라이언트, pdf-lib)
 * - 여러 PDF의 모든 페이지를 순서대로 한 문서로 복사
 */

import { PDFDocument } from "pdf-lib";
import { loadPdf } from "./load";

export async function mergePdfs(buffers: ArrayBuffer[]): Promise<Uint8Array> {
  const out = await PDFDocument.create();

  for (const buf of buffers) {
    const src = await loadPdf(buf);
    const pages = await out.copyPages(src, src.getPageIndices());
    pages.forEach((p) => out.addPage(p));
  }

  return out.save();
}

/** PDF의 페이지 수를 읽는다 (업로드 직후 미리보기용) */
export async function getPageCount(buffer: ArrayBuffer): Promise<number> {
  const doc = await loadPdf(buffer);
  return doc.getPageCount();
}
