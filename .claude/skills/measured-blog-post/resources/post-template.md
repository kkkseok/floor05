# 글 골격

기준 구현: `src/app/blog/image-rotate-quality/page.tsx`(신규), `src/app/blog/image-compression-guide/page.tsx`(리라이트). 아래는 빠지면 안 되는 요소이고, 섹션 수·제목·문체는 주제에 맞게 바꾼다.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("<slug>"),               // canonical·OG는 blog.ts 항목에서
  title: "<핵심 키워드> - <실측 한 마디>",          // 브랜드명 넣지 않음
};

// FAQ는 배열 하나로 두고 스키마와 본문을 같이 만든다(내용 불일치 방지)
const faqs = [{ question: "...", answer: "...실측 숫자 포함..." }, /* 4개 */];
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.question,
    acceptedAnswer: { "@type": "Answer", text: f.answer } })) };

// 측정일·환경·원자료 경로를 주석으로
// 2026-MM-DD 측정 (Chromium 151, 원자료: docs/blog-data/<주제>-<날짜>.json)
const rows = [/* 표 데이터 — 숫자는 원자료에서 */];
```

## 클래스 기준 (prose 금지)

| 요소 | 클래스 |
|---|---|
| article | `max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16` |
| h1 | `text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight` |
| 도입 첫 문단 | `text-brand-mid text-lg leading-relaxed mb-6` |
| h2 | `text-2xl font-bold text-brand-black mt-12 mb-4` |
| p | `text-brand-mid leading-relaxed mb-4` (섹션 마지막은 `mb-6`) |
| ul/ol | `list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed` |
| 표 래퍼 | `overflow-x-auto mb-4` → `table w-full text-sm border-collapse` |
| th / td | `py-2 pr-4 text-brand-black` / `py-2 pr-4` (+ `whitespace-nowrap` 필요 시) |
| 표 주석 | `text-sm text-brand-light mb-8` |
| 본문 링크 | `text-brand-accent hover:underline` |

## 체크리스트

- [ ] 헤더 날짜는 `<time dateTime="측정일">측정일 측정</time>` (발행·수정일은 BlogExtras가 표시)
- [ ] "어떻게 측정했나": 소스와 라이선스, 브라우저·버전, 방식이 floor05 도구와 같은 경로인지, 비교 기준
- [ ] 결과 표 + 단위 주석(KB=1,000B, dB=PSNR 기준)
- [ ] 발견 섹션마다 숫자 하나와 해석 하나. 원자료로 다시 계산해 확인했다
- [ ] 직접 만든 시각 자료 1개 이상, 모바일에서 읽힘
- [ ] BlogInlineCTA 1개(본문 중간) + 마무리 검정 CTA 1개
- [ ] 측정하다 고친 도구가 있으면 그 경위 섹션
- [ ] 정리 표에 "근거 (이번 측정)" 열
- [ ] FAQ 4개, 마지막 문항(프라이버시)은 다른 글과 다른 문장
- [ ] `<BlogExtras slug>`는 본문 div 바깥, article 안
- [ ] blog.ts 항목 갱신, 신규면 도구 페이지 relatedPostSlugs 연결
- [ ] 본문 1,400자 이상(측정 글은 보통 2,500~4,000자, 분량을 맞추려고 늘리지 않음)
