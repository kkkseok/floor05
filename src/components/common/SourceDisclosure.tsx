import type { ContentReview } from "@/lib/common/content-sources";

export default function SourceDisclosure({ review }: { review: ContentReview }) {
  return (
    <aside
      className="rounded-lg border border-brand-light/30 bg-brand-paper p-5 sm:p-6"
      aria-labelledby="source-disclosure-title"
    >
      <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h2 id="source-disclosure-title" className="text-lg font-semibold text-brand-black">
          계산 기준·출처
        </h2>
        <p className="text-xs text-brand-light">
          최종 검토 <time dateTime={review.reviewedAt}>{review.reviewedAt}</time>
        </p>
      </div>
      <p className="mt-3 text-sm leading-6 text-brand-mid">{review.disclaimer}</p>
      <ul className="mt-4 space-y-2 text-sm">
        {review.sources.map((source) => (
          <li key={source.url}>
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-brand-accent hover:underline"
            >
              {source.title}
            </a>{" "}
            <span className="text-brand-light">— {source.publisher}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
