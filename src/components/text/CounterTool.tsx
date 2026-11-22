"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  analyzeText,
  manuscriptSheets,
  CountMode,
} from "@/lib/text/count";
import { trackToolUse } from "@/lib/common/analytics";

const STORAGE_KEY = "floor05_text_counter";
const GOAL_PRESETS = [500, 1000, 1500];

export default function CounterTool() {
  const [text, setText] = useState("");
  const [mode, setMode] = useState<CountMode>("naver");
  const [manuscriptPer, setManuscriptPer] = useState<200 | 400>(200);
  const [goal, setGoal] = useState(1000);
  const [copied, setCopied] = useState(false);
  const [restored, setRestored] = useState(false);

  // 마지막 입력 복원 (회원가입 없이 재방문 시 유지)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setText(saved);
    } catch {
      /* localStorage 비활성 환경 무시 */
    }
    setRestored(true);
  }, []);

  // 자동 저장 (디바운스)
  useEffect(() => {
    if (!restored) return;
    const timer = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, text);
      } catch {
        /* 저장 실패 무시 */
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [text, restored]);

  // 의미 있는 분량을 입력하면 = 실제 사용 (세션당 1회만 집계)
  const usedRef = useRef(false);
  useEffect(() => {
    if (usedRef.current) return;
    if (text.trim().length >= 10) {
      usedRef.current = true;
      trackToolUse("counter");
    }
  }, [text]);

  const stats = useMemo(() => analyzeText(text, mode), [text, mode]);
  const manuscript = useMemo(
    () => manuscriptSheets(stats.chars, manuscriptPer),
    [stats.chars, manuscriptPer]
  );

  const remaining = goal - stats.chars;
  const goalPercent = goal > 0 ? Math.min(100, Math.round((stats.chars / goal) * 100)) : 0;

  const handleCopy = useCallback(async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* 클립보드 미지원 무시 */
    }
  }, [text]);

  const handleClear = useCallback(() => setText(""), []);

  const secondary = [
    { label: "공백 제외", value: stats.charsNoSpace },
    { label: "단어", value: stats.words },
    { label: "줄", value: stats.lines },
    { label: "문장", value: stats.sentences },
    { label: "문단", value: stats.paragraphs },
  ];

  return (
    <div className="space-y-6">
      {/* 입력 */}
      <div className="space-y-3">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 글을 붙여넣거나 입력하세요. 글자수가 실시간으로 계산됩니다."
          aria-label="글자수를 셀 텍스트 입력"
          className="w-full min-h-64 p-4 rounded-xl border border-brand-light bg-brand-white text-brand-black leading-relaxed resize-y focus:outline-none focus:border-brand-accent"
        />

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 줄바꿈 기준 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-brand-mid">줄바꿈 기준</span>
            {([
              ["naver", "네이버"],
              ["hwp", "한글(HWP)"],
            ] as const).map(([value, label]) => (
              <button
                key={value}
                onClick={() => setMode(value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  mode === value
                    ? "bg-brand-accent text-white"
                    : "bg-brand-paper text-brand-mid hover:text-brand-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              disabled={!text}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-paper text-brand-mid hover:text-brand-black disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {copied ? "복사됨 ✓" : "전체 복사"}
            </button>
            <button
              onClick={handleClear}
              disabled={!text}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-brand-paper text-brand-mid hover:text-brand-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              지우기
            </button>
          </div>
        </div>
        <p className="text-xs text-brand-mid">
          줄바꿈 기준: 네이버는 줄바꿈을 공백 1개로, 한글(HWP)은 글자수에서 제외합니다.
        </p>
      </div>

      {/* 핵심 글자수 */}
      <div className="bg-brand-black rounded-xl p-6 text-center">
        <p className="text-sm text-brand-light mb-1">글자수 (공백 포함)</p>
        <p className="font-mono text-5xl max-sm:text-4xl font-bold text-brand-paper">
          {stats.chars.toLocaleString()}
        </p>
      </div>

      {/* 보조 통계 */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {secondary.map((s) => (
          <div key={s.label} className="bg-brand-paper rounded-lg p-4 text-center">
            <p className="text-xs text-brand-mid mb-1">{s.label}</p>
            <p className="font-mono text-xl text-brand-black">
              {s.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 바이트 */}
      <div className="bg-brand-paper rounded-xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
          바이트
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-brand-black mb-1">2바이트 기준</p>
            <p className="text-xs text-brand-mid mb-2">한글 2바이트 · 영문/숫자 1바이트 (대부분의 기업·기관)</p>
            <p className="font-mono text-brand-black">
              {stats.bytes2.toLocaleString()} B
              <span className="text-brand-mid text-sm ml-2">
                공백 제외 {stats.bytes2NoSpace.toLocaleString()} B
              </span>
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-brand-black mb-1">UTF-8 (3바이트)</p>
            <p className="text-xs text-brand-mid mb-2">한글 3바이트 (일부 기관·웹 표준)</p>
            <p className="font-mono text-brand-black">
              {stats.bytes3.toLocaleString()} B
              <span className="text-brand-mid text-sm ml-2">
                공백 제외 {stats.bytes3NoSpace.toLocaleString()} B
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* 원고지 */}
      <div className="bg-brand-paper rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
            원고지
          </h3>
          <div className="flex items-center gap-2">
            {([200, 400] as const).map((per) => (
              <button
                key={per}
                onClick={() => setManuscriptPer(per)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  manuscriptPer === per
                    ? "bg-brand-accent text-white"
                    : "bg-brand-white text-brand-mid hover:text-brand-black border border-brand-light"
                }`}
              >
                {per}자
              </button>
            ))}
          </div>
        </div>
        <p className="font-mono text-2xl text-brand-black">
          {manuscript.sheets.toLocaleString()}매
          {manuscript.remainingCells > 0 && (
            <span className="text-brand-mid text-base ml-2">
              (마지막 장 {manuscript.remainingCells}칸 남음)
            </span>
          )}
        </p>
        <p className="text-xs text-brand-mid">공백 포함 글자수 기준</p>
      </div>

      {/* 자소서 목표 */}
      <div className="bg-brand-paper rounded-xl p-6 space-y-4">
        <h3 className="font-mono text-xs text-brand-accent uppercase tracking-wider">
          자소서 목표 글자수
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          {GOAL_PRESETS.map((g) => (
            <button
              key={g}
              onClick={() => setGoal(g)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                goal === g
                  ? "bg-brand-accent text-white"
                  : "bg-brand-white text-brand-mid hover:text-brand-black border border-brand-light"
              }`}
            >
              {g.toLocaleString()}자
            </button>
          ))}
          <input
            type="number"
            min={1}
            value={goal}
            onChange={(e) => setGoal(Math.max(1, Number(e.target.value) || 0))}
            aria-label="목표 글자수 직접 입력"
            className="w-28 px-3 py-2 rounded-lg border border-brand-light text-sm font-mono focus:outline-none focus:border-brand-accent"
          />
        </div>

        <div className="space-y-2">
          <div className="h-3 rounded-full bg-brand-light/40 overflow-hidden">
            <div
              className="h-full bg-brand-accent transition-all"
              style={{ width: `${goalPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-brand-mid">
              {stats.chars.toLocaleString()} / {goal.toLocaleString()}자 (공백 포함)
            </span>
            <span
              className={remaining >= 0 ? "text-brand-mid" : "text-brand-accent font-medium"}
            >
              {remaining >= 0
                ? `${remaining.toLocaleString()}자 남음`
                : `${Math.abs(remaining).toLocaleString()}자 초과`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
