import Link from "next/link";
import Header from "./Header";
import Footer from "./Footer";
import AdSlot from "./AdSlot";
import ToolCard from "./ToolCard";
import ErrorBoundary from "./ErrorBoundary";
import SourceDisclosure from "./SourceDisclosure";
import { getOtherTools, getToolByHref } from "@/lib/common/tools";
import { getPostsBySlugs } from "@/lib/common/blog";
import { getToolReview } from "@/lib/common/content-sources";

interface FAQ {
  question: string;
  answer: string;
}

// 도구 본문 해설(아티클) — 서버 렌더링되는 고유 콘텐츠
// 조견표·출처표 등 구조화 데이터(선택). 있으면 실제 <table>로 렌더된다.
export interface GuideTable {
  headers: string[];
  rows: string[][];
  caption?: string;
}

export interface GuideSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  table?: GuideTable;
}

export interface ToolGuide {
  intro?: string;
  sections: GuideSection[];
}

interface WorkflowCTA {
  message: string;
  tools: Array<{
    name: string;
    href: string;
    description: string;
  }>;
}

// Schema.org 타입
interface SchemaMarkup {
  "@context": string;
  "@type": string;
  [key: string]: unknown;
}

interface ToolLayoutProps {
  // 타이틀 영역
  title: string;
  description: string;

  // 도구 본체 (children)
  children: React.ReactNode;

  // 본문 해설 아티클 (도구 본체 아래, 서버 렌더링 고유 콘텐츠)
  guide?: ToolGuide;

  // 사용 가이드 (FAQ 형태)
  faqs?: FAQ[];

  // 워크플로우 CTA
  workflowCTA?: WorkflowCTA;

  // 현재 도구의 href (다른 도구 섹션에서 제외)
  currentToolHref?: string;

  // 관련 블로그 글 slug 목록 (도구→블로그 내부링크). blog 레지스트리에서 제목 해석
  relatedPostSlugs?: string[];

  // Schema.org Markup (JSON-LD)
  schemas?: SchemaMarkup[];
}

export default function ToolLayout({
  title,
  description,
  children,
  guide,
  faqs = [],
  workflowCTA,
  currentToolHref,
  relatedPostSlugs = [],
  schemas = [],
}: ToolLayoutProps) {
  // 현재 도구를 제외한 다른 도구들
  const otherTools = getOtherTools(currentToolHref);

  // 현재 도구 (피드백 링크 prefill용)
  const currentTool = getToolByHref(currentToolHref);

  // 관련 블로그 글 (도구→블로그 내부링크)
  const relatedPosts = getPostsBySlugs(relatedPostSlugs);

  // 공신력 있는 기준이 특히 중요한 금융·건강 도구의 검토 정보.
  const review = getToolReview(currentToolHref);

  // 짧은 페이지는 1개, 충분한 해설·FAQ가 있는 페이지만 2개로 제한한다.
  const showSecondAd = Boolean(
    guide && guide.sections.length >= 3 && faqs.length >= 3,
  );

  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      {/* Schema.org JSON-LD */}
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* 1. 헤더 */}
      <Header />

      <main className="flex-1">
        {/* 2. 타이틀 영역 */}
        <section className="bg-brand-black py-12 sm:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-paper mb-3">
              {title}
            </h1>
            <p className="text-brand-light text-lg">
              {description}
            </p>
          </div>
        </section>

        {/* 3. 도구 본체 */}
        <section className="py-8 sm:py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </div>
        </section>

        {/* 3-1. 본문 해설 아티클 (고유 콘텐츠) */}
        {guide && (
          <section className="pt-4 pb-8">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              {guide.intro && (
                <p className="text-brand-mid text-lg leading-relaxed mb-10">
                  {guide.intro}
                </p>
              )}
              {guide.sections.map((section, index) => (
                <div key={index} className={index === 0 ? "" : "mt-10"}>
                  <h2 className="text-2xl font-bold text-brand-black mb-4">
                    {section.heading}
                  </h2>
                  {section.paragraphs?.map((paragraph, pIndex) => (
                    <p
                      key={pIndex}
                      className="text-brand-mid leading-relaxed mb-4"
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 marker:text-brand-accent">
                      {section.bullets.map((bullet, bIndex) => (
                        <li key={bIndex} className="leading-relaxed">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.table && (
                    <figure className="my-6">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="border-b border-brand-light/40 text-left">
                              {section.table.headers.map((header, hIndex) => (
                                <th
                                  key={hIndex}
                                  className="py-2 pr-4 text-brand-black font-semibold whitespace-nowrap"
                                >
                                  {header}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="text-brand-mid">
                            {section.table.rows.map((row, rIndex) => (
                              <tr
                                key={rIndex}
                                className="border-b border-brand-light/20"
                              >
                                {row.map((cell, cIndex) => (
                                  <td key={cIndex} className="py-2 pr-4">
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {section.table.caption && (
                        <figcaption className="mt-2 text-xs text-brand-light">
                          {section.table.caption}
                        </figcaption>
                      )}
                    </figure>
                  )}
                </div>
              ))}
            </article>
          </section>
        )}

        {review && (
          <section className="pb-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <SourceDisclosure review={review} />
            </div>
          </section>
        )}

        {/* 4. 광고 슬롯 1 */}
        <section className="py-6">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AdSlot slot="tool-below" />
          </div>
        </section>

        {/* 5. 사용 가이드 (FAQ 형태) */}
        {faqs.length > 0 && (
          <section className="py-12 bg-brand-paper">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-8">
                자주 묻는 질문
              </h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-brand-light/30 pb-6 last:border-b-0">
                    <h3 className="text-lg font-semibold text-brand-black mb-2">
                      {faq.question}
                    </h3>
                    <p className="text-brand-mid leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 5-1. 피드백 진입점 (가이드 아래 작은 링크) */}
        <section className="pt-2 pb-4">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-brand-mid">
              {currentTool ? `${currentTool.name} 도구가 ` : "도구가 "}
              불편하셨거나 이런 기능이 있으면 좋겠다 싶으신가요?{" "}
              <Link
                href={
                  currentToolHref
                    ? `/contact?tool=${encodeURIComponent(currentToolHref)}&type=problem`
                    : "/contact"
                }
                className="font-medium text-brand-accent hover:underline"
              >
                피드백 남기기
              </Link>
            </p>
          </div>
        </section>

        {/* 6. 워크플로우 CTA */}
        {workflowCTA && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-brand-black rounded-xl p-8 text-center">
                <p className="text-brand-paper text-xl mb-6">
                  {workflowCTA.message}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {workflowCTA.tools.map((tool) => (
                    <ToolCard
                      key={tool.href}
                      name={tool.name}
                      href={tool.href}
                      description={tool.description}
                      variant="dark"
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* 6-1. 관련 가이드 (도구→블로그 내부링크) */}
        {relatedPosts.length > 0 && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-6 text-center">
                관련 가이드
              </h2>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedPosts.map((post) => (
                  <li key={post.slug}>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group block h-full rounded-lg border border-brand-light/30 bg-brand-white p-5 hover:border-brand-accent/50 transition-colors"
                    >
                      <span className="block font-medium text-brand-black group-hover:text-brand-accent transition-colors">
                        {post.title}
                      </span>
                      <span className="mt-1 block text-sm text-brand-mid line-clamp-2">
                        {post.description}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 7. 광고 슬롯 2 — 충분한 고유 해설이 있는 긴 페이지에만 표시 */}
        {showSecondAd && (
          <section className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <AdSlot slot="cta-below" />
            </div>
          </section>
        )}

        {/* 8. floor05 다른 도구 */}
        <section className="py-12 bg-brand-paper">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-mono text-xs text-brand-accent uppercase tracking-widest mb-8 text-center">
              floor05 다른 도구
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {otherTools.map((tool) => (
                <ToolCard
                  key={tool.href}
                  name={tool.name}
                  href={tool.href}
                  description={tool.description}
                />
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* 10. 푸터 */}
      <Footer />
    </div>
  );
}
