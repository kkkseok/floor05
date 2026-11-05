"use client";

import Link from "next/link";
import { useState } from "react";
import { TASKS } from "@/lib/content";

export default function SelfCheck() {
  const [picked, setPicked] = useState<Set<string>>(new Set());

  const toggle = (id: string) =>
    setPicked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  // 고른 항목을 문의 폼 내용으로 넘긴다
  const contactHref = `/contact?type=work&tasks=${[...picked].join(",")}`;

  return (
    <div className="flex flex-col gap-7">
      <div className="flex flex-wrap gap-3">
        {TASKS.map((task) => {
          const on = picked.has(task.id);
          return (
            <button
              key={task.id}
              type="button"
              aria-pressed={on}
              onClick={() => toggle(task.id)}
              className={`flex min-h-11 min-w-0 flex-[1_1_340px] cursor-pointer items-start gap-3 rounded-lg border p-5 text-left transition-colors ${
                on ? "border-ink bg-ink text-white" : "border-line bg-white text-ink hover:border-subtle"
              }`}
            >
              <span aria-hidden="true" className="w-6 flex-none text-lg">
                {on ? "✓" : "○"}
              </span>
              <span className="flex flex-col gap-1.5">
                <span className="text-base leading-normal">{task.now}</span>
                <span className={`text-sm ${on ? "text-[#f2d3c2]" : "text-accent"}`}>→ {task.after}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div aria-live="polite">
        {picked.size > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-5 rounded-xl bg-ink p-7 text-paper">
            <div className="flex flex-col gap-1.5">
              <strong className="text-xl">{picked.size}개에 해당하시네요.</strong>
              <span className="text-[15px] text-on-dark">
                고른 일을 그대로 보내 주시면, 줄일 수 있는지 글로 답장드립니다. 비용은 들지 않습니다.
              </span>
            </div>
            <Link
              href={contactHref}
              className="rounded-md bg-accent px-6 py-3.5 font-medium text-white no-underline hover:bg-accent-dark"
            >
              무료 서면 진단 받기
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
