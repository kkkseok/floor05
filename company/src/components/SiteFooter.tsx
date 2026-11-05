import Link from "next/link";
import Wordmark from "./Wordmark";
import { BUSINESS, UTILITY_URL } from "@/lib/site";

export default function SiteFooter() {
  return (
    <footer className="border-t border-[#222] bg-ink pb-24 text-sm leading-7 text-on-dark-subtle sm:pb-0">
      <div className="mx-auto flex max-w-6xl flex-wrap justify-between gap-6 px-6 py-10">
        <div>
          <p className="mb-2 text-lg text-paper">
            <Wordmark />
          </p>
          <p>
            {BUSINESS.name} | 대표 {BUSINESS.owner} | 사업자등록번호 {BUSINESS.regNo}
          </p>
          <p>{BUSINESS.address}</p>
          <p>업무 자동화 · 데이터 대시보드 · 홈페이지 제작</p>
        </div>
        <div className="flex flex-col gap-1">
          <Link href="/privacy" className="text-on-dark hover:text-paper">
            개인정보처리방침
          </Link>
          <Link href="/terms" className="text-on-dark hover:text-paper">
            이용약관
          </Link>
          <a href={UTILITY_URL} className="text-on-dark hover:text-paper">
            다용도실
          </a>
          <p className="mt-2">© 2026 floor05. 존재하지 않는 층에서 만듭니다.</p>
        </div>
      </div>
    </footer>
  );
}
