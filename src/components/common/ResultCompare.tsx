"use client";

import { useState, useEffect } from "react";

interface ResultCompareProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  /** 활성 면에 표시할 부가 정보 (용량/치수 등) */
  beforeMeta?: string;
  afterMeta?: string;
  /** 결과가 투명 배경(PNG/WebP)일 때 체커보드로 투명 영역 표시 */
  transparent?: boolean;
  /** 기본 표시 면 (default: "after") */
  defaultView?: "before" | "after";
  className?: string;
}

/**
 * 원본/결과 비교 뷰
 * - 겹쳐 보는 슬라이더 대신 [원본 | 결과] 탭 토글로 같은 자리에서 즉시 스왑
 *   (압축·변환·리사이즈처럼 시각 차이가 거의 없는 결과에 더 적합하고 모바일에서 조작이 쉽다)
 * - 이미지 클릭 시 전체 화면 확대(라이트박스)로 화질 확인
 * - transparent: 투명 PNG/WebP의 투명 영역을 체커보드로 시각화
 */
// 투명 영역 표시용 체커보드 배경
const CHECKERBOARD: React.CSSProperties = {
  backgroundImage:
    "linear-gradient(45deg, #e5e3df 25%, transparent 25%), linear-gradient(-45deg, #e5e3df 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #e5e3df 75%), linear-gradient(-45deg, transparent 75%, #e5e3df 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
};

export default function ResultCompare({
  beforeSrc,
  afterSrc,
  beforeLabel = "원본",
  afterLabel = "결과",
  beforeMeta,
  afterMeta,
  transparent = false,
  defaultView = "after",
  className = "",
}: ResultCompareProps) {
  const [view, setView] = useState<"before" | "after">(defaultView);
  const [zoomed, setZoomed] = useState(false);

  const isAfter = view === "after";
  const currentSrc = isAfter ? afterSrc : beforeSrc;
  const currentLabel = isAfter ? afterLabel : beforeLabel;
  const currentMeta = isAfter ? afterMeta : beforeMeta;

  // 라이트박스: ESC 닫기 + 배경 스크롤 잠금
  useEffect(() => {
    if (!zoomed) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setZoomed(false);
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [zoomed]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* 탭 토글 + 활성 면 메타 */}
      <div className="flex items-center justify-between gap-3">
        <div
          className="inline-flex rounded-lg bg-brand-paper p-1"
          role="tablist"
          aria-label="원본과 결과 비교"
        >
          {(["before", "after"] as const).map((side) => {
            const active = view === side;
            const label = side === "before" ? beforeLabel : afterLabel;
            return (
              <button
                key={side}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setView(side)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-brand-accent ${
                  active
                    ? "bg-brand-white text-brand-black shadow-sm"
                    : "text-brand-mid hover:text-brand-black"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {currentMeta && (
          <span
            className={`font-mono text-sm ${
              isAfter ? "text-brand-accent" : "text-brand-mid"
            }`}
          >
            {currentMeta}
          </span>
        )}
      </div>

      {/* 이미지 영역 (클릭 시 확대) */}
      <button
        type="button"
        onClick={() => setZoomed(true)}
        aria-label={`${currentLabel} 크게 보기`}
        className="group relative w-full rounded-lg overflow-hidden bg-brand-paper flex justify-center cursor-zoom-in focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2"
        style={transparent ? CHECKERBOARD : undefined}
      >
        <img
          src={currentSrc}
          alt={currentLabel}
          className="max-h-[480px] max-w-full w-auto object-contain"
          draggable={false}
        />
        {/* 현재 면 라벨 */}
        <span className="absolute bottom-3 left-3 px-2 py-1 rounded bg-brand-black/70 text-xs text-brand-paper font-mono pointer-events-none">
          {currentLabel}
        </span>
        {/* 확대 힌트 */}
        <span className="absolute top-3 right-3 w-8 h-8 rounded-full bg-brand-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <svg
            className="w-4 h-4 text-brand-paper"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 8v6M8 11h6m4 0a8 8 0 11-16 0 8 8 0 0116 0z"
            />
          </svg>
        </span>
      </button>

      {/* 라이트박스 */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-brand-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${currentLabel} 확대 보기`}
        >
          <img
            src={currentSrc}
            alt={currentLabel}
            className="max-w-full max-h-full object-contain"
            style={transparent ? CHECKERBOARD : undefined}
            draggable={false}
          />
          <button
            type="button"
            aria-label="닫기"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-brand-white/10 hover:bg-brand-white/20 flex items-center justify-center text-brand-paper"
            onClick={() => setZoomed(false)}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
