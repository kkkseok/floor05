import type { Metadata } from "next";
import Link from "next/link";
import SectionHead from "@/components/SectionHead";
import ScreenPlaceholder from "@/components/ScreenPlaceholder";
import { TOOL_GROUPS } from "@/lib/content";
import { UTILITY_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "서비스 — floor05가 직접 운영하는 것들",
  description: "플로어공오가 만들고 운영하는 서비스입니다. 설치 없이 브라우저에서 쓰는 도구 모음 다용도실을 소개합니다.",
  alternates: { canonical: "/services" },
  openGraph: { url: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <section className="bg-paper">
        <div className="mx-auto max-w-6xl px-6 pt-20 pb-16">
          <SectionHead
            as="h1"
            label="SERVICES — 호실 안내"
            title="floor05가 직접 운영하는 것들"
            lead="의뢰받아 만드는 일과 별개로, 우리가 직접 만들고 매일 고치는 서비스가 있습니다. 지금은 한 곳입니다."
          />
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16">
          <article className="flex flex-wrap overflow-hidden rounded-xl border border-line bg-white">
            <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-4 p-10">
              <p className="font-mono text-[13px] text-subtle">ROOM · utility.floor05.com</p>
              <h2 className="text-3xl font-bold">다용도실</h2>
              <p className="font-mono text-sm text-subtle">Utility Room by floor05</p>
              <p className="text-[17px] leading-relaxed text-mid">설치도 가입도 없이, 브라우저에서 끝나는 파일·계산 도구.</p>
              <dl className="flex flex-wrap gap-6 text-sm">
                {[
                  ["운영 시작", "2026년 3월"],
                  ["도구", "20개"],
                  ["처리 방식", "파일을 서버로 보내지 않음"],
                ].map(([k, v]) => (
                  <div key={k} className="flex flex-col gap-1">
                    <dt className="text-subtle">{k}</dt>
                    <dd className="text-[17px] font-bold">{v}</dd>
                  </div>
                ))}
              </dl>
              <a
                href={UTILITY_URL}
                className="mt-1.5 self-start rounded-md bg-accent px-6 py-3.5 text-[15px] font-medium text-white no-underline hover:bg-accent-dark"
              >
                다용도실 열기 →
              </a>
            </div>
            <ScreenPlaceholder label="[다용도실 화면 캡처]" className="min-h-80 min-w-0 flex-[1_1_400px]" />
          </article>

          <div className="flex flex-col gap-5">
            <h2 className="text-2xl font-bold">다용도실에 있는 것</h2>
            <div className="flex flex-wrap gap-4">
              {TOOL_GROUPS.map((group) => (
                <div key={group.name} className="flex min-w-0 flex-[1_1_260px] flex-col gap-2.5 rounded-lg border border-line bg-white p-6">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-lg font-bold">{group.name}</h3>
                    <span className="font-mono text-[13px] text-accent">{group.count}</span>
                  </div>
                  <p className="text-sm text-subtle">{group.hint}</p>
                  <p className="text-[15px] leading-relaxed text-mid">{group.items}</p>
                </div>
              ))}
            </div>
            <p>
              도구를 쓰다 생긴 질문은 직접 재 보고 글로 남깁니다.{" "}
              <a href={`${UTILITY_URL}/blog`} className="text-accent hover:text-accent-dark">
                다용도실 블로그 →
              </a>
            </p>
          </div>
        </div>
      </section>

      <section className="bg-paper">
        <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-18">
          <h2 className="text-2xl font-bold">왜 브라우저에서만 처리하나요</h2>
          <p className="text-[17px] leading-loose text-mid">
            사진 한 장 줄이자고 낯선 서버에 파일을 올리는 건 좀 이상하다고 생각했습니다. 요즘 브라우저는 그 정도 일은 혼자 할 수
            있습니다. 그래서 서버를 두지 않았고, 덕분에 운영비도 거의 들지 않습니다.
          </p>
          <p>
            이런 도구를 회사 안에서 쓰고 싶다면{" "}
            <Link href="/work" className="text-accent hover:text-accent-dark">
              외주 보기 →
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
