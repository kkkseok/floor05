import Link from "next/link";

export default function NotFound() {
  return (
    <section className="mx-auto flex max-w-3xl flex-col items-start gap-5 px-6 py-28">
      <p className="font-mono text-[13px] font-semibold text-accent">404</p>
      <h1 className="text-3xl leading-snug font-bold">
        이 층에는 아무것도 없습니다.
        <br />
        원래 없는 층이긴 합니다.
      </h1>
      <Link href="/" className="rounded-md bg-ink px-5 py-3 text-white no-underline hover:bg-mid">
        로비로 돌아가기
      </Link>
    </section>
  );
}
