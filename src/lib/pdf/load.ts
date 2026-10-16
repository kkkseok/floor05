/**
 * PDF 열기 (pdf-lib) — 암호로 보호된 PDF는 거부한다.
 * 예전에는 ignoreEncryption으로 무조건 열어서, 암호(권한 암호 포함) PDF가 에러 없이 빈 페이지로 나왔다.
 */

import { PDFDocument } from "pdf-lib";

export class ProtectedPdfError extends Error {
  constructor() {
    super("protected-pdf");
    this.name = "ProtectedPdfError";
  }
}

export async function loadPdf(buffer: ArrayBuffer): Promise<PDFDocument> {
  // 암호화 표시만 보고 판정하려고 먼저 ignoreEncryption으로 연다(복호화는 하지 않음)
  const doc = await PDFDocument.load(buffer, { ignoreEncryption: true });
  if (doc.isEncrypted) throw new ProtectedPdfError();
  return doc;
}

/** 사용자에게 보여줄 안내 (보호된 PDF / 그 밖의 실패) */
export function pdfErrorMessage(err: unknown, fileName?: string): string {
  const who = fileName ? `'${fileName}'은(는) ` : "";
  if (err instanceof ProtectedPdfError) {
    return `${who}암호로 보호된 PDF라 페이지를 꺼낼 수 없어요. PDF 뷰어에서 연 뒤 '인쇄 → PDF로 저장'으로 보호 없는 사본을 만들어 다시 올려 주세요.`;
  }
  return `${who}PDF로 읽을 수 없어요. 파일이 손상됐거나 PDF가 아닐 수 있습니다. 원본 프로그램에서 PDF로 다시 저장해 올려 주세요.`;
}
