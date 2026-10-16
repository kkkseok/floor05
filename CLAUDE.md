# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

floor05(플로어공오)는 "존재하지 않는 0.5층" 컨셉의 니치 유틸리티 툴 플랫폼이다.
- **100% 브라우저 처리**: 파일이 서버로 전송되지 않음 (운영비 $0)
- **첫 서비스**: 이미지 도구 모음 (압축, 리사이즈, 포맷 변환, 크롭)
- **진입 경로**: 구글 검색 → 개별 도구 직접 진입

## 빌드/실행 명령어

```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 (localhost:3000)
npm run build        # 프로덕션 빌드 (sitemap 자동 생성)
npm run lint         # ESLint 실행
npx tsc --noEmit     # 타입 체크
npm test             # 단위 테스트 (Vitest — 계산 로직 golden value)
npm run test:e2e     # E2E (Playwright — build 후 실행, 상세는 docs/qa/README.md)
npm run test:e2e:prod # 프로덕션 smoke (floor05.com, 비파괴)
```

QA 체계(실행 방법·fixture·새 도구 추가 시 테스트 규칙)는 `docs/qa/README.md` 참조.

## 기술 스택

- **프레임워크**: Next.js 16 (App Router)
- **언어**: TypeScript 5.x
- **스타일링**: Tailwind CSS 3.x
- **이미지 처리**: Canvas API (브라우저 네이티브)
- **HEIC 변환**: heic2any (변환 페이지에서만 동적 로드)
- **ZIP 다운로드**: JSZip + FileSaver.js
- **배포**: Vercel

## 아키텍처

### 서비스별 폴더 분리

새 서비스 추가 시 기존 코드 수정 없이 폴더만 추가:

```
src/
├── app/tools/[service]/       # 페이지 라우트
├── components/[service]/      # 서비스 전용 컴포넌트
└── lib/[service]/            # 서비스 전용 로직
```

### ToolLayout 패턴

모든 도구 페이지는 `ToolLayout`으로 감싼다. 공통 영역(헤더, 푸터, 광고, 가이드)은 일관되게, 도구 본체만 자유 설계.

```tsx
<ToolLayout title="이미지 압축" description="서버 전송 없이 브라우저에서 바로">
  <CompressTool />
</ToolLayout>
```

### 도구 페이지 스크롤 흐름

헤더 → 타이틀 → **도구 본체** → 광고1 → 가이드(FAQ) → 워크플로우 CTA → 광고2 → 다른 도구 → 광고3(선택) → 푸터

## 브랜드 컬러 (Tailwind 토큰)

| 용도 | Tailwind 클래스 | HEX |
|------|-----------------|-----|
| 배경/주요 텍스트 | `text-black`, `bg-black` | #0A0A0A |
| 카드 배경 | `bg-paper` | #F2F0ED |
| 페이지 배경 | `bg-white` | #FAFAFA |
| **강조/CTA** | `text-accent`, `bg-accent` | #B8562A (2026-10 대비 보정, 이전 #C45C2C) |
| 호버 상태 | `hover:bg-accent-light` | #C45C2C |
| 밝은 배경 위 보조 글자 | `text-brand-subtle` | #6E6E6E (`text-brand-light`는 어두운 배경 전용) |

**컬러 비율**: Paper 50% / Black 35% / Gray 10% / Accent 5%

## 절대 하지 말 것

1. **메인 페이지에 광고 배치** — 브랜드 첫인상 보호
2. **도구 본체 내부(드롭존~다운로드)에 광고** — UX 최우선
3. **title에 "floor05" 브랜드명 포함** — SEO 키워드 공간 확보
4. **미출시 서비스 "준비 중" 표시** — 출시된 것만 노출
5. **common/ 폴더에 특정 서비스 전용 로직** — 공통 영역 오염 방지
6. **heic2any 전역 번들 포함** — 변환 페이지에서만 동적 로드
7. **기술 용어 에러 메시지** — 친절한 한국어로 + 해결 방법 포함
8. **서버로 파일 전송** — 100% 브라우저 처리 원칙
9. **과장된 마케팅 문구** — 담백한 브랜드 보이스 유지
10. **루트 layout.tsx에 사이트 전역 canonical 설정** — 하위 페이지가 전부 홈의 중복으로 색인 제외됨 (애드센스 반려 원인)
11. **정보·정책 페이지(about/contact/privacy/terms)에 `robots: { index:false }`** — 심사자가 확인하는 페이지, 색인 허용 필수
12. **"브라우저 처리/무료" 문구를 페이지 간 복붙** — 같은 문장 반복 = 저가치 중복 판정. 도구마다 새로 쓴다
13. **새 도구 페이지를 tools.ts에 등록 안 함** — 링크 없는 고아/도어웨이 페이지가 됨
14. **블로그/콘텐츠 본문을 `prose`(Tailwind Typography)에 의존** — 이 프로젝트엔 typography 플러그인이 없어 `prose`/`prose-*` 클래스가 무효(빌드 CSS에 `.prose` 규칙 0개). 맨 태그(`<h2>`·`<p>`·`<table>` 등)로 쓰면 무스타일로 깨진다. 요소마다 유틸리티 클래스 직접 지정(기준: `src/app/blog/image-compression-guide/page.tsx`). 빌드·tsc·lint는 무스타일도 통과하므로 반드시 렌더 화면으로 확인

## 반드시 지킬 것

- **광고 최대 3개/페이지** (페이지 길이에 따라 2개로 축소 가능)
- **SEO title 패턴**: `[핵심 키워드] - [차별화 한 마디]`
- **가이드 섹션은 FAQ 형태** (GEO/AI 검색 최적화)
- **Schema Markup 적용**: SoftwareApplication, FAQPage (HowTo는 2023.9 리치결과 폐지 — 신규 적용 금지)
- **파일 제한**: 50MB/파일, 일괄 10장(데스크톱)/5장(모바일)
- **common/ 수정 시 하위 호환 유지**

### 새 페이지 추가 시 (애드센스 thin-content 재발 방지 — 상세는 my-design-rules 스킬)

- **canonical은 페이지마다 자기 것을 직접 설정** (`alternates.canonical`). 도구는 `${SITE_URL}/tools/...`, 블로그는 `buildBlogMetadata`/상대경로
- **새 도구는 즉시 `src/lib/common/tools.ts`의 `TOOLS`에 등록** → 내비게이션 링크 확보
- **도구 페이지 최소 분량**: guide 섹션 2개↑(권장 3개), faqs 4개↑, workflowCTA로 내부 링크
- **프라이버시/무료 문구는 도구별 고유 문장** — FAQ 답변·guide 꼬리말·description·og/twitter·schema 각각 다르게
- **블로그 본문 1,400자↑**, 수정 시 `blog.ts`의 `dateModified` 갱신
- **블로그 본문 스타일은 유틸리티 클래스 직접 지정** (`prose` 무효 — 위 절대금지 14번). 기준 파일 `image-compression-guide`의 클래스 패턴 복사: h2=`text-2xl font-bold text-brand-black mt-12 mb-4`, p=`text-brand-mid leading-relaxed mb-4`, 표 th=`py-2 pr-4 text-brand-black`
- **도메인 통일**: SITE_URL = robots Host = sitemap = `https://www.floor05.com`(www). 완료 후 `npm run build`(sitemap 재생성) → `tsc` → `lint`

## 브랜드 보이스

- **담백함**: 불필요한 수식어 없이 핵심만
- **위트**: 과하지 않은 유머. 슬쩍 웃기는 정도

DO: "간단한 도구입니다. 잘 됩니다. 써보세요."
DON'T: "혁신적인 AI 기반 솔루션으로 당신의 생산성을 극대화하세요!"

## 환경변수

```env
# .env.local
NEXT_PUBLIC_ADSENSE_CLIENT_ID=    # Google AdSense 클라이언트 ID
NEXT_PUBLIC_ADFIT_UNIT_ID=        # Kakao Adfit 유닛 ID
```

## 참고 문서

| 문서 | 경로 | 내용 |
|------|------|------|
| 전체 기획서 | `SPEC.md` | 도구별 상세 스펙, 경쟁사 분석, 일정 |
| 디자인 규칙 | `.claude/skills/my-design-rules/SKILL.md` | 페이지 구조, 광고 규칙, 코드 구조 |

## 에이전트 운영 원칙 (감독관 모드)

너는 직접 실무를 모두 처리하는 실행자가 아니라, 기획·지시·검증을 담당하는 감독관이다.

파일 CRUD, 웹 검색, 코드 수정, 정리, 요약, 보고 등 실제 작업은 가능한 한 Codex에 위임한다.

복잡한 작업은 subagent를 병렬로 생성해 역할을 나누고, Codex의 gpt-5.5 모델을 우선 사용한다.
각 subagent는 독립적으로 조사·수정·검증을 수행하고, 결과를 요약해 보고한다.

너는 각 subagent의 결과를 검토한 뒤, 품질이 부족하거나 누락된 부분이 있으면 재지시한다.
최종 답변은 여러 결과를 종합해 정확성, 실행 가능성, 안정성을 검증한 뒤 제공한다.
