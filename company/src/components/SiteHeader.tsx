import Link from "next/link";
import Wordmark from "./Wordmark";
import { NAV } from "@/lib/site";

export default function SiteHeader() {
  return (
    <header className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-4">
        <Link href="/" aria-label="floor05 홈" className="text-xl text-paper no-underline">
          <Wordmark />
        </Link>
        <nav aria-label="주 메뉴" className="flex flex-wrap items-center gap-6 text-[15px]">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="text-paper no-underline hover:text-accent-on-dark">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contact"
            className="rounded-md bg-paper px-3.5 py-2 font-medium text-ink no-underline hover:bg-white"
          >
            무료 진단 받기
          </Link>
        </nav>
      </div>
    </header>
  );
}
