import Link from "next/link";

// 모바일 전용 하단 고정 문의 버튼
export default function StickyCta() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-10 border-t border-[#222] bg-ink px-4 py-3 sm:hidden">
      <Link
        href="/contact"
        className="block rounded-md bg-accent py-3.5 text-center font-medium text-white no-underline hover:bg-accent-dark"
      >
        무료 서면 진단 받기
      </Link>
    </div>
  );
}
