"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/common/tools";

function Logo() {
  return (
    <Link href="/" className="block">
      <Image
        src="/images/logo-wordmark-dark-bg.png"
        alt="floor05"
        width={120}
        height={40}
        className="h-8 w-auto"
        priority
      />
    </Link>
  );
}

export default function Header() {
  const [isToolsOpen, setIsToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const toolsButtonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname() ?? "";

  // 외부 클릭 감지로 드롭다운 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsOpen(false);
      }
    }

    if (isToolsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isToolsOpen]);

  // ESC 키로 드롭다운 닫기
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsToolsOpen(false);
        toolsButtonRef.current?.focus();
      }
    }

    if (isToolsOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isToolsOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-brand-light/20 bg-brand-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">
          {/* 왼쪽: 로고 */}
          <Logo />

          {/* 오른쪽: 네비게이션 */}
          <nav className="flex items-center gap-4" aria-label="주요 메뉴">
            {/* 도구 드롭다운 */}
            <div className="relative" ref={dropdownRef}>
              <button
                ref={toolsButtonRef}
                onClick={() => setIsToolsOpen(!isToolsOpen)}
                className="-mr-2 flex min-h-11 items-center gap-1 px-2 font-mono text-xs uppercase tracking-wider text-brand-mid transition-colors hover:text-brand-black focus-visible:text-brand-black"
                aria-expanded={isToolsOpen}
                aria-haspopup="true"
                aria-controls="tool-directory-menu"
                aria-label={`도구 메뉴 ${isToolsOpen ? "닫기" : "열기"}`}
              >
                도구
                <svg
                  className={`h-3 w-3 transition-transform ${isToolsOpen ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* 드롭다운 메뉴 */}
              {isToolsOpen && (
                <div
                  id="tool-directory-menu"
                  className="tool-directory-scroll fixed inset-x-4 top-14 z-50 ml-auto mt-2 max-h-[min(70dvh,32rem)] max-w-[44rem] overflow-y-auto lg:absolute lg:inset-x-auto lg:right-0 lg:top-auto lg:w-[44rem] overscroll-contain rounded-lg border border-brand-light/20 bg-brand-white shadow-lg"
                >
                  <div className="sticky top-0 z-10 flex items-center justify-between border-b border-brand-light/20 bg-brand-white px-4 py-3 sm:px-5">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-brand-mid">
                      Tool directory
                    </p>
                    <p className="text-xs text-brand-subtle">
                      {TOOL_CATEGORIES.length}개의 Room
                    </p>
                  </div>

                  <div className="columns-2 gap-x-6 p-4 sm:columns-3 sm:p-5">
                    {TOOL_CATEGORIES.map((category) => {
                      const tools = getToolsByCategory(category.id);

                      return (
                        <section key={category.id} className="mb-6 break-inside-avoid">
                          <h3 className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-brand-accent">
                            {category.room} · {category.label}
                          </h3>
                          <ul className="sm:space-y-1">
                            {tools.map((tool) => {
                              const isCurrent = pathname === tool.href;

                              return (
                                <li key={tool.href}>
                                  <Link
                                    href={tool.href}
                                    onClick={() => setIsToolsOpen(false)}
                                    aria-current={isCurrent ? "page" : undefined}
                                    className={`-mx-2 block rounded-sm px-2 py-3 text-sm leading-5 transition-colors hover:bg-brand-paper hover:text-brand-black focus-visible:bg-brand-paper focus-visible:text-brand-black sm:py-1.5 sm:text-xs ${
                                      isCurrent
                                        ? "font-semibold text-brand-accent"
                                        : "text-brand-mid"
                                    }`}
                                  >
                                    {tool.name}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </section>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 블로그 링크 */}
            <Link
              href="/blog"
              aria-current={pathname.startsWith("/blog") ? "page" : undefined}
              className={`-mr-2 flex min-h-11 items-center px-2 font-mono text-xs uppercase tracking-wider transition-colors hover:text-brand-black ${
                pathname.startsWith("/blog") ? "text-brand-black" : "text-brand-mid"
              }`}
            >
              블로그
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
