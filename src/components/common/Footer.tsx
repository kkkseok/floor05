import Link from "next/link";
import Image from "next/image";
import { TOOL_CATEGORIES, getToolsByCategory } from "@/lib/common/tools";
import CookieSettings from "./CookieSettings";

function FooterLogo() {
  return (
    <Link href="/" className="block">
      <Image
        src="/images/logo-wordmark.png"
        alt="floor05"
        width={120}
        height={40}
        className="h-8 w-auto"
      />
    </Link>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-black text-brand-paper">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          {/* 로고 & 태그라인 */}
          <div className="lg:col-span-3">
            <FooterLogo />
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-brand-light">
              존재하지 않는 0.5층에서 만듭니다.
              <br />
              나만의 속도, 나만의 층.
            </p>
            <p className="mt-4 font-mono text-xs tracking-wider text-brand-light/70">
              THE FLOOR THAT DOESN&apos;T EXIST
            </p>
          </div>

          {/* 도구 디렉터리: 항목이 늘어나도 푸터 높이는 유지 */}
          <nav className="lg:col-span-7" aria-label="도구 디렉터리">
            <div className="mb-4 flex items-end justify-between gap-4">
              <h2 className="font-mono text-xs uppercase tracking-widest text-brand-light">
                도구
              </h2>
              <span
                className="font-mono text-[10px] tracking-wider text-brand-light/70"
                aria-hidden="true"
              >
                ROOM DIRECTORY
              </span>
            </div>

            <div className="tool-directory-scroll max-h-64 overflow-y-auto overscroll-contain pr-3">
              <div className="columns-2 gap-x-6 sm:columns-3">
                {TOOL_CATEGORIES.map((category) => {
                  const tools = getToolsByCategory(category.id);

                  return (
                    <section key={category.id} className="mb-6 break-inside-avoid">
                      <h3 className="mb-2 font-mono text-[10px] font-medium uppercase tracking-wider text-brand-accent-light">
                        {category.room} · {category.label}
                      </h3>
                      <ul className="space-y-1.5">
                        {tools.map((tool) => (
                          <li key={tool.href}>
                            <Link
                              href={tool.href}
                              className="block py-0.5 text-xs leading-5 text-brand-light transition-colors hover:text-brand-paper focus-visible:text-brand-paper"
                            >
                              {tool.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </section>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* 정보 링크 */}
          <nav className="lg:col-span-2" aria-label="사이트 정보">
            <h3 className="mb-4 font-mono text-xs uppercase tracking-widest text-brand-light">
              정보
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 lg:block lg:space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-brand-light transition-colors hover:text-brand-paper"
                >
                  소개
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-brand-light transition-colors hover:text-brand-paper"
                >
                  문의
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm text-brand-light transition-colors hover:text-brand-paper"
                >
                  블로그
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-sm text-brand-light transition-colors hover:text-brand-paper"
                >
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-sm text-brand-light transition-colors hover:text-brand-paper"
                >
                  이용약관
                </Link>
              </li>
              <li>
                <CookieSettings className="text-sm text-brand-light transition-colors hover:text-brand-paper" />
              </li>
            </ul>
          </nav>
        </div>

        {/* 하단 저작권 */}
        <div className="mt-10 border-t border-brand-dark pt-6">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="font-mono text-xs text-brand-light/70">
              &copy; {currentYear} floor05 플로어공오
            </p>
            <p className="font-mono text-xs text-brand-light/70">
              파일이 서버로 전송되지 않습니다.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
