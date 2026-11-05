"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { sendInquiry, type InquiryState } from "@/app/contact/actions";
import { INQUIRY_TYPES, type InquiryType } from "@/lib/content";
import { REPLY_DAYS } from "@/lib/site";

const BODY_HINTS: Record<InquiryType, string> = {
  work: "지금 어떻게 일하고 계신지 적어 주시면 진단이 빨라집니다. 예: 매주 월요일 엑셀 3개를 합쳐 보고서를 만듭니다.",
  utility: "어떤 파일로, 어떤 순서로 했을 때 문제가 생겼는지 적어 주세요.",
  partner: "제안하실 내용을 간단히 적어 주세요.",
  etc: "편하게 적어 주세요.",
};

const UTILITY_TOOLS = ["이미지 압축", "이미지 리사이즈", "이미지 변환", "HEIC → JPG", "PDF 합치기", "PDF 나누기", "이미지 → PDF", "글자수 세기", "연봉 실수령액", "퇴직금", "주휴수당", "그 밖의 도구"];

const inputClass = "rounded-md border border-[#c9c4bd] bg-white px-3.5 py-3 text-base focus:border-ink focus:outline-none";

type Props = { initialType: InquiryType; initialBody: string };

export default function ContactForm({ initialType, initialBody }: Props) {
  const [type, setType] = useState<InquiryType>(initialType);
  const [state, action, pending] = useActionState<InquiryState, FormData>(sendInquiry, { status: "idle" });
  const errors = state.status === "error" ? state.fieldErrors ?? {} : {};

  if (state.status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 py-10" role="status">
        <h2 className="text-3xl font-bold">잘 받았습니다.</h2>
        <p className="text-[17px] text-mid">영업일 기준 {REPLY_DAYS}일 안에 적어 주신 이메일로 답장드립니다.</p>
        <Link href="/" className="text-accent hover:text-accent-dark">
          홈으로 →
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-6" noValidate>
      <input type="hidden" name="type" value={type} />
      {/* 봇 차단용 숨은 칸 */}
      <div aria-hidden="true" className="absolute -left-[9999px]">
        <label>
          웹사이트
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-medium">
          어떤 문의인가요? <span className="text-accent">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {INQUIRY_TYPES.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={t.id === type}
              onClick={() => setType(t.id)}
              className={`min-h-11 cursor-pointer rounded-full border px-4.5 py-2.5 text-[15px] ${
                t.id === type ? "border-ink bg-ink text-white" : "border-[#c9c4bd] bg-white text-ink hover:border-ink"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-5 *:flex-[1_1_280px]">
        <Field id="name" label="이름" required error={errors.name}>
          <input id="name" name="name" type="text" autoComplete="name" className={inputClass} aria-invalid={!!errors.name} />
        </Field>
        <Field id="company" label="회사 또는 팀 이름" optional>
          <input id="company" name="company" type="text" autoComplete="organization" className={inputClass} />
        </Field>
      </div>

      <Field id="email" label="답장 받을 이메일" required error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="여기로 답장드립니다"
          className={inputClass}
          aria-invalid={!!errors.email}
        />
      </Field>

      {type === "work" && (
        <div className="flex flex-wrap gap-5 rounded-lg bg-paper p-5 *:flex-[1_1_280px]">
          <Field id="budget" label="생각하신 예산" optional>
            {/* 예산 구간은 사용자 확정 전 — 정하지 않음만 둔다 */}
            <select id="budget" name="budget" className={inputClass} defaultValue="정하지 않음">
              <option>정하지 않음</option>
            </select>
          </Field>
          <Field id="when" label="원하시는 시점" optional>
            <input id="when" name="when" type="text" placeholder="예: 3월 오픈" className={inputClass} />
          </Field>
        </div>
      )}

      {type === "utility" && (
        <div className="flex flex-wrap gap-5 rounded-lg bg-paper p-5 *:flex-[1_1_280px]">
          <Field id="tool" label="어느 도구인가요?">
            <select id="tool" name="tool" className={inputClass}>
              {UTILITY_TOOLS.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </Field>
          <fieldset className="flex min-w-0 flex-col gap-2">
            <legend className="mb-2 text-[15px] font-medium">구분</legend>
            <div className="flex gap-5 pt-2 text-[15px]">
              {["오류", "제안"].map((k) => (
                <label key={k} className="flex items-center gap-1.5">
                  <input type="radio" name="kind" value={k} /> {k}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}

      <Field id="body" label="내용" required error={errors.body}>
        <textarea
          id="body"
          name="body"
          rows={7}
          defaultValue={initialBody}
          placeholder={BODY_HINTS[type]}
          className={`${inputClass} resize-y leading-relaxed`}
          aria-invalid={!!errors.body}
        />
      </Field>

      <div className="flex flex-col gap-1.5">
        <label className="flex items-start gap-2.5 text-[15px] leading-relaxed">
          <input type="checkbox" name="consent" className="mt-1.5 size-4.5" aria-invalid={!!errors.consent} />
          <span>
            개인정보 수집·이용에 동의합니다 <span className="text-accent">*</span>{" "}
            <Link href="/privacy" className="text-accent hover:text-accent-dark">
              자세히
            </Link>
            <br />
            <span className="text-sm text-subtle">이름, 이메일, 문의 내용을 답장 목적으로만 받습니다.</span>
          </span>
        </label>
        {errors.consent && <p className="text-sm text-[#b42318]">{errors.consent}</p>}
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-md border border-[#f1c5bf] bg-[#fdf3f2] px-4 py-3 text-[15px] text-[#b42318]">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="min-h-12 cursor-pointer self-start rounded-md bg-accent px-8 py-4 font-medium text-white hover:bg-accent-dark disabled:cursor-wait disabled:opacity-70"
      >
        {pending ? "보내는 중…" : "보내기"}
      </button>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <label htmlFor={id} className="text-[15px] font-medium">
        {label} {required && <span className="text-accent">*</span>}
        {optional && <span className="font-normal text-subtle">(선택)</span>}
      </label>
      {children}
      {error && <p className="text-sm text-[#b42318]">{error}</p>}
    </div>
  );
}
