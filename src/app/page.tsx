import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ToolCard from "@/components/common/ToolCard";
import { TOOL_CATEGORIES, getToolsByCategory, type ToolCategory } from "@/lib/common/tools";
import { SITE_URL } from "@/lib/common/constants";

// 카테고리 허브 페이지 링크 (허브가 있는 카테고리만 "전체 보기" 노출)
const CATEGORY_HUBS: Partial<Record<ToolCategory, { href: string; label: string }>> = {
  image: { href: "/tools/image", label: "이미지 도구 전체 보기" },
  calc: { href: "/tools/calc", label: "금융 계산기 전체 보기" },
  pdf: { href: "/tools/pdf", label: "PDF 도구 전체 보기" },
};

export const metadata: Metadata = {
  alternates: {
    canonical: SITE_URL,
  },
};

// 홈 화면 소개 + FAQ (서버 렌더링되는 고유 콘텐츠)
const homeFaqs = [
  {
    question: "floor05는 무료인가요?",
    answer:
      "네, 모든 도구가 무료입니다. 회원가입도 로그인도 필요 없습니다. 이미지 장수나 파일 용량에 따른 유료 전환도 없습니다. 운영은 페이지 한쪽의 광고로 충당합니다.",
  },
  {
    question: "올린 파일은 서버에 저장되나요?",
    answer:
      "아니요. 이미지 압축·변환·크롭 같은 처리는 100% 여러분의 브라우저 안에서 이루어집니다. 파일이 floor05 서버로 전송되거나 저장되지 않습니다. 신분증, 계약서, 가족 사진처럼 민감한 파일도 안심하고 다룰 수 있습니다.",
  },
  {
    question: "설치해야 하나요? 모바일에서도 되나요?",
    answer:
      "설치할 것은 없습니다. 크롬, 사파리, 엣지 등 최신 브라우저만 있으면 PC와 스마트폰 모두에서 바로 동작합니다. 앱 설치나 확장 프로그램이 필요 없습니다.",
  },
  {
    question: "어떤 도구가 있나요?",
    answer:
      "압축·리사이즈·포맷 변환·크롭·워터마크·EXIF 삭제 같은 이미지 도구가 중심이고, 이미지 PDF 변환과 PDF 합치기·분할, 글자수 세기, 연봉 실수령액·퇴직금·주휴수당 계산기가 있습니다. 여러 가지를 얕게 늘리기보다 파일을 다루는 도구를 깊게 다듬는 쪽을 택했습니다.",
  },
];

const homeSchemas = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "floor05",
    url: SITE_URL,
    description:
      "파일을 서버로 보내지 않고 브라우저에서 바로 처리하는 무료 온라인 도구 모음. 이미지 압축·변환·크롭부터 글자수 세기, 연봉·퇴직금 계산까지.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

// Hero 섹션의 모션 그래픽 (CSS 애니메이션)
function HeroAnimation() {
  return (
    <div className="relative w-full h-64 sm:h-80 overflow-hidden" aria-hidden="true">
      {/* 배경 그라데이션 */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-black via-brand-dark to-brand-black" />

      {/* 층 라인들 (0.5층 컨셉) */}
      <div className="absolute inset-0 flex flex-col justify-center items-center">
        {/* 2층 라인 */}
        <div className="w-3/4 max-w-md h-px bg-brand-mid/20 mb-8 animate-pulse" />

        {/* 0.5층 (강조) */}
        <div className="relative flex items-center gap-3 my-4">
          <div className="w-20 h-px bg-brand-accent/40" />
          <span className="font-mono text-sm text-brand-accent tracking-widest animate-pulse">
            0.5F
          </span>
          <div className="w-20 h-px bg-brand-accent/40" />
        </div>

        {/* 1층 라인 */}
        <div className="w-3/4 max-w-md h-px bg-brand-mid/20 mt-8 animate-pulse [animation-delay:0.5s]" />

        {/* 부유하는 05 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="font-mono text-8xl sm:text-9xl font-bold text-brand-accent/10 select-none animate-float">
            05
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      {homeSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Header />

      <main className="flex-1">
        {/* Hero 섹션 */}
        <section className="bg-brand-black">
          {/* 모션 그래픽 */}
          <HeroAnimation />

          {/* 브랜드 카피 */}
          <div className="text-center pb-16 px-4">
            {/* h1: 홈의 대표 제목 (시맨틱/SEO — 페이지당 h1 1개) */}
            <h1 className="flex items-end justify-center gap-1 mb-6">
              <span className="font-mono text-4xl sm:text-5xl font-medium text-brand-paper">
                floor
              </span>
              <span className="font-mono text-2xl sm:text-3xl font-bold text-brand-accent relative -top-3">
                05
              </span>
            </h1>
            <p className="text-brand-light text-lg sm:text-xl max-w-md mx-auto leading-relaxed">
              존재하지 않는 0.5층에서 만듭니다.
            </p>
            <p className="font-mono text-xs text-brand-mid mt-4 tracking-widest uppercase">
              The floor that doesn&apos;t exist
            </p>
          </div>
        </section>

        {/* 도구 목록 섹션 (Room별) */}
        <section className="py-16 sm:py-20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            {TOOL_CATEGORIES.map((cat) => {
              const tools = getToolsByCategory(cat.id);
              const hub = CATEGORY_HUBS[cat.id];
              if (tools.length === 0) return null;
              return (
                <div key={cat.id}>
                  <div className="text-center mb-12">
                    <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-4">
                      {cat.room} — {cat.label}
                    </h2>
                    <p className="text-brand-mid text-lg">{cat.tagline}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {tools.map((tool) => (
                      <ToolCard
                        key={tool.href}
                        name={tool.name}
                        href={tool.href}
                        description={tool.description}
                      />
                    ))}
                  </div>
                  {hub ? (
                    <div className="mt-8 text-center">
                      <Link
                        href={hub.href}
                        className="inline-flex items-center gap-1 font-mono text-sm text-brand-accent transition-colors hover:text-brand-accent-light"
                      >
                        {hub.label} →
                      </Link>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        {/* 서비스 소개 (고유 콘텐츠) */}
        <section className="py-16 sm:py-20 border-t border-brand-light/20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-brand-black mb-6">
              파일을 서버에 올리지 않는 도구 모음
            </h2>
            <div className="space-y-5 text-brand-mid leading-relaxed">
              <p>
                대부분의 온라인 변환·압축 사이트는 여러분의 파일을 자기 서버로
                업로드한 뒤 처리합니다. 빠르고 편하지만, 신분증이나 계약서처럼
                남에게 보이고 싶지 않은 파일까지 누군가의 서버를 거쳐 간다는
                뜻이기도 합니다. floor05는 그 방식을 쓰지 않습니다.
              </p>
              <p>
                이미지 압축, 리사이즈, 포맷 변환, 크롭, 합치기, 워터마크처럼
                파일을 다루는 모든 작업은 여러분의{" "}
                <strong className="text-brand-black">브라우저 안에서</strong>{" "}
                끝납니다. 사진은 floor05 서버로 한 번도 전송되지 않고, 당연히
                저장되지도 않습니다. 인터넷이 잠깐 끊겨도 작업이 이어지는 이유가
                여기 있습니다.
              </p>
              <p>
                회원가입이나 로그인은 필요 없습니다. 하루에 몇 장을 처리하든,
                파일이 몇 MB든 제한을 두지 않았습니다. 필요한 도구를 검색해서
                바로 들어와, 할 일을 끝내고, 나가면 됩니다. 운영비는 페이지
                한쪽의 광고로 충당하기 때문에 도구 자체는 계속 무료입니다.
              </p>
              <p>
                이미지뿐 아니라 글자수 세기, 연봉 실수령액·퇴직금 계산처럼 자주
                찾게 되는 작은 도구들도 같은 원칙으로 만들고 있습니다. 화려하지
                않아도 정확하게, 한 가지 일을 제대로 하는 도구를 지향합니다.
              </p>
            </div>
          </div>
        </section>

        {/* 브랜드 철학 섹션 */}
        <section className="py-16 sm:py-20 bg-brand-paper">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <blockquote className="relative">
              {/* 인용 부호 */}
              <span className="absolute -top-8 left-0 text-6xl text-brand-accent/20 font-serif">
                &ldquo;
              </span>

              <p className="text-xl sm:text-2xl text-brand-black leading-relaxed font-light">
                건물에는 1층과 2층 사이에
                <span className="text-brand-accent font-medium"> 존재하지 않는 층</span>이 있다.
                <br className="hidden sm:block" />
                엘리베이터 버튼에도 없고, 안내 표지판에도 없다.
                <br className="hidden sm:block" />
                하지만 누군가는 그 층이 있다는 걸 안다.
              </p>

              <footer className="mt-8">
                <p className="font-mono text-sm text-brand-mid">
                  나만의 속도, 나만의 층.
                </p>
              </footer>
            </blockquote>
          </div>
        </section>

        {/* 핵심 가치 섹션 */}
        <section className="py-16 sm:py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "파일 미전송",
                  description: "모든 처리는 브라우저에서. 파일이 서버로 전송되지 않습니다.",
                },
                {
                  title: "무제한 무료",
                  description: "회원가입 없이, 이미지 수나 용량 제한 없이 사용하세요.",
                },
                {
                  title: "한국어 네이티브",
                  description: "번역이 아닌, 한국인이 만든 한국어 도구입니다.",
                },
              ].map((value) => (
                <div key={value.title} className="text-center">
                  <h3 className="font-mono text-sm text-brand-accent uppercase tracking-wider mb-3">
                    {value.title}
                  </h3>
                  <p className="text-brand-mid text-sm leading-relaxed">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 자주 묻는 질문 */}
        <section className="py-16 sm:py-20 bg-brand-paper">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-8 text-center">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              {homeFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-brand-light/30 pb-6 last:border-b-0"
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-brand-mid leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
