"use server";

import { INQUIRY_TYPES, type InquiryType } from "@/lib/content";

export type InquiryState =
  | { status: "idle" }
  | { status: "sent" }
  | { status: "error"; message: string; fieldErrors?: Partial<Record<"name" | "email" | "body" | "consent", string>> };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function field(form: FormData, key: string) {
  const v = form.get(key);
  return typeof v === "string" ? v.trim() : "";
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export async function sendInquiry(_prev: InquiryState, form: FormData): Promise<InquiryState> {
  // 봇이 채우는 숨은 칸. 채워져 있으면 보낸 척하고 버린다
  if (field(form, "website")) return { status: "sent" };

  const type = field(form, "type") as InquiryType;
  const name = field(form, "name");
  const company = field(form, "company");
  const email = field(form, "email");
  const body = field(form, "body");
  const consent = form.get("consent") === "on";

  const fieldErrors: NonNullable<Extract<InquiryState, { status: "error" }>["fieldErrors"]> = {};
  if (!name) fieldErrors.name = "이름을 적어 주세요.";
  if (!EMAIL_RE.test(email)) fieldErrors.email = "이메일 주소를 다시 확인해 주세요. @ 뒤까지 적어야 답장을 보낼 수 있어요.";
  if (!body) fieldErrors.body = "어떤 일인지 한두 줄이라도 적어 주세요.";
  if (!consent) fieldErrors.consent = "답장을 보내려면 개인정보 수집·이용 동의가 필요해요.";
  if (Object.keys(fieldErrors).length > 0) {
    return { status: "error", message: "빠진 칸이 있어요. 표시된 곳을 확인해 주세요.", fieldErrors };
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.INQUIRY_TO_EMAIL;
  const from = process.env.INQUIRY_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    // 설정 누락은 조용히 넘기지 않는다 — 서버 로그와 화면 양쪽에 드러낸다
    console.error("[inquiry] 메일 설정 누락:", { RESEND_API_KEY: !!apiKey, INQUIRY_TO_EMAIL: !!to, INQUIRY_FROM_EMAIL: !!from });
    return {
      status: "error",
      message: "지금은 문의를 받을 수 없는 상태입니다. 준비가 끝나는 대로 열겠습니다. 잠시 뒤에 다시 시도해 주세요.",
    };
  }

  const typeLabel = INQUIRY_TYPES.find((t) => t.id === type)?.label ?? "기타";
  const extras = [
    ["예산", field(form, "budget")],
    ["희망 시점", field(form, "when")],
    ["도구", field(form, "tool")],
    ["구분", field(form, "kind")],
  ].filter(([, v]) => v);

  const rows = [
    ["유형", typeLabel],
    ["이름", name],
    ["회사", company || "-"],
    ["이메일", email],
    ...extras,
  ];
  const html = `<table>${rows
    .map(([k, v]) => `<tr><th align="left" style="padding:4px 12px 4px 0">${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("")}</table><hr><p style="white-space:pre-wrap">${escapeHtml(body)}</p>`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `[floor05 문의] ${typeLabel} — ${name}${company ? ` (${company})` : ""}`,
      html,
    }),
  });

  if (!res.ok) {
    console.error("[inquiry] Resend 발송 실패:", res.status, await res.text());
    return {
      status: "error",
      message: "보내지 못했습니다. 잠시 뒤 다시 눌러 주세요. 계속 안 되면 내용을 복사해 두셨다가 조금 뒤에 다시 시도해 주세요.",
    };
  }

  return { status: "sent" };
}
