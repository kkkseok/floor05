"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { TOOLS } from "@/lib/common/tools";
import { WEB3FORMS_KEY, CONTACT_EMAIL } from "@/lib/common/constants";

// 문의 유형 — URL ?type= 값과 매핑
const FEEDBACK_TYPES = [
  {
    value: "problem",
    label: "불편·오류 신고",
    hint: "버그, 오류, 예상과 다른 동작",
  },
  {
    value: "feature",
    label: "기능 건의",
    hint: "추가되었으면 하는 기능·개선 아이디어",
  },
  {
    value: "general",
    label: "일반 문의",
    hint: "이용 관련 질문, 협업 제안 등",
  },
] as const;

type FeedbackTypeValue = (typeof FEEDBACK_TYPES)[number]["value"];

function normalizeType(raw: string | null): FeedbackTypeValue {
  const match = FEEDBACK_TYPES.find((t) => t.value === raw);
  return match ? match.value : "problem";
}

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const searchParams = useSearchParams();
  const prefillType = normalizeType(searchParams.get("type"));
  const prefillTool = searchParams.get("tool") ?? "";
  // prefill된 도구가 실제 목록에 있을 때만 선택값으로 사용
  const validPrefillTool = TOOLS.some((t) => t.href === prefillTool)
    ? prefillTool
    : "";

  const [type, setType] = useState<FeedbackTypeValue>(prefillType);
  const [toolHref, setToolHref] = useState(validPrefillTool);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // 키 미설정 시 폼 대신 이메일 안내로 폴백
  if (!WEB3FORMS_KEY) {
    return (
      <div className="bg-brand-paper rounded-lg p-6">
        <p className="text-brand-mid mb-4">
          문의사항은 아래 이메일로 보내주세요. 도구 이름과 함께 적어주시면 더
          빠르게 확인할 수 있습니다.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center gap-2 text-lg font-medium text-brand-accent hover:underline"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    );
  }

  const selectedType = FEEDBACK_TYPES.find((t) => t.value === type)!;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const trimmed = message.trim();
    if (trimmed.length < 5) {
      setStatus("error");
      setErrorMsg("내용을 조금 더 자세히 적어주세요. (5자 이상)");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    const tool = TOOLS.find((t) => t.href === toolHref);
    const typeLabel = FEEDBACK_TYPES.find((t) => t.value === type)!.label;
    const toolLabel = tool ? tool.name : "해당 없음 / 사이트 전체";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: `[floor05 문의] ${typeLabel} · ${toolLabel}`,
          from_name: "floor05 문의 폼",
          // 답장 주소(선택)
          ...(email.trim() ? { replyto: email.trim() } : {}),
          문의유형: typeLabel,
          관련도구: toolLabel,
          답변받을_이메일: email.trim() || "(미입력)",
          내용: trimmed,
          botcheck: "",
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setStatus("success");
        setMessage("");
      } else {
        setStatus("error");
        setErrorMsg(
          "전송에 실패했습니다. 잠시 후 다시 시도하거나 이메일로 보내주세요.",
        );
      }
    } catch {
      setStatus("error");
      setErrorMsg(
        "네트워크 오류로 전송하지 못했습니다. 잠시 후 다시 시도하거나 이메일로 보내주세요.",
      );
    }
  }

  if (status === "success") {
    return (
      <div className="bg-brand-paper rounded-lg p-8 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-accent/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6 text-brand-accent"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-brand-black mb-2">
          접수되었습니다
        </h3>
        <p className="text-brand-mid mb-6">
          소중한 의견 감사합니다. 답변이 필요한 내용이면 영업일 기준 1~3일 내에
          연락드리겠습니다.
        </p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-sm font-medium text-brand-accent hover:underline"
        >
          다른 내용 더 남기기
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 문의 유형 */}
      <div>
        <label className="block text-sm font-semibold text-brand-black mb-2">
          문의 유형
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {FEEDBACK_TYPES.map((t) => {
            const active = t.value === type;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setType(t.value)}
                className={`rounded-lg border px-4 py-3 text-left transition-colors ${
                  active
                    ? "border-brand-accent bg-brand-accent/5"
                    : "border-brand-light/40 bg-brand-white hover:border-brand-accent/40"
                }`}
                aria-pressed={active}
              >
                <span
                  className={`block text-sm font-medium ${
                    active ? "text-brand-accent" : "text-brand-black"
                  }`}
                >
                  {t.label}
                </span>
                <span className="mt-0.5 block text-xs text-brand-subtle">
                  {t.hint}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 관련 도구 */}
      <div>
        <label
          htmlFor="contact-tool"
          className="block text-sm font-semibold text-brand-black mb-2"
        >
          관련 도구
        </label>
        <select
          id="contact-tool"
          value={toolHref}
          onChange={(e) => setToolHref(e.target.value)}
          className="w-full rounded-lg border border-brand-light/40 bg-brand-white px-4 py-2.5 text-brand-black focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        >
          <option value="">해당 없음 / 사이트 전체</option>
          {TOOLS.map((tool) => (
            <option key={tool.href} value={tool.href}>
              {tool.name}
            </option>
          ))}
        </select>
      </div>

      {/* 내용 */}
      <div>
        <label
          htmlFor="contact-message"
          className="block text-sm font-semibold text-brand-black mb-2"
        >
          내용
        </label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={6}
          required
          placeholder={
            type === "problem"
              ? "어떤 상황에서 어떤 문제가 생겼는지 적어주세요. 사용한 기기·브라우저를 함께 적어주시면 더 빠르게 확인할 수 있습니다."
              : type === "feature"
                ? "어떤 기능이 있으면 좋을지, 왜 필요한지 적어주세요."
                : "문의하실 내용을 적어주세요."
          }
          className="w-full rounded-lg border border-brand-light/40 bg-brand-white px-4 py-3 text-brand-black placeholder:text-brand-subtle focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent resize-y"
        />
        <p className="mt-1.5 text-xs text-brand-subtle">
          {selectedType.hint}
        </p>
      </div>

      {/* 답변받을 이메일 (선택) */}
      <div>
        <label
          htmlFor="contact-email"
          className="block text-sm font-semibold text-brand-black mb-2"
        >
          답변받을 이메일{" "}
          <span className="font-normal text-brand-subtle">(선택)</span>
        </label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="답변이 필요하면 입력해주세요"
          className="w-full rounded-lg border border-brand-light/40 bg-brand-white px-4 py-2.5 text-brand-black placeholder:text-brand-subtle focus:border-brand-accent focus:outline-none focus:ring-1 focus:ring-brand-accent"
        />
      </div>

      {/* honeypot (스팸 방지) — 사용자에게 숨김 */}
      <input
        type="checkbox"
        name="botcheck"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />

      {status === "error" && (
        <p className="text-sm text-brand-accent">{errorMsg}</p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center rounded-md bg-brand-accent px-6 py-3 font-medium text-brand-white transition-colors hover:bg-brand-accent-light disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "보내는 중…" : "보내기"}
        </button>
        <span className="text-xs text-brand-subtle">
          입력 내용은 저장되지 않고 문의 전달에만 사용됩니다.
        </span>
      </div>
    </form>
  );
}
