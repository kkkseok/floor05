import Link from "next/link";
import { REPLY_DAYS } from "@/lib/site";

export default function DiagnosisCta() {
  return (
    <section className="bg-ink text-paper">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-10 px-6 py-20">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-4">
          <p className="font-mono text-[13px] tracking-wider text-on-dark-subtle">무료 서면 진단</p>
          <h2 className="text-3xl leading-snug font-bold">
            매주 같은 일을 같은 방식으로
            <br />
            반복하고 계신가요?
          </h2>
          <p className="leading-relaxed text-on-dark">
            지금 하는 방식을 적어 보내 주세요. 줄일 수 있는지, 어떻게 줄일지 영업일 {REPLY_DAYS}일 안에 글로 정리해
            드립니다. 비용은 들지 않습니다.
          </p>
        </div>
        <ol className="flex min-w-0 flex-[1_1_360px] flex-col gap-2.5 text-[15px]">
          {["지금 하는 일을 폼에 적어 보냅니다", `${REPLY_DAYS}일 안에 진단 답장을 받습니다`, "원하시면 그때 견적을 요청합니다"].map(
            (step, i) => (
              <li key={step} className="flex gap-3">
                <span className="font-mono text-accent-on-dark">0{i + 1}</span>
                {step}
              </li>
            ),
          )}
          <li className="mt-2">
            <Link
              href="/contact"
              className="inline-block rounded-md bg-accent px-6 py-3.5 font-medium text-white no-underline hover:bg-accent-dark"
            >
              무료 서면 진단 받기
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
