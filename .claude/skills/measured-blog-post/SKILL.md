---
name: measured-blog-post
description: "floor05 블로그 글을 실측 기반으로 새로 쓰거나 리라이트하고 화·금 예약 발행 브랜치에 올릴 때 사용. '블로그 글 써줘', '리라이트', '다음 글 예약', '실측 글', '발행 큐 채워줘' 요청 시 반드시 따른다."
---

# 실측 블로그 글 작성·예약 (floor05)

AdSense '가치가 별로 없는 콘텐츠' 반려(2026-10-15)에 대응해 정한 절차다. 글의 가치는 **직접 측정한 숫자와 직접 만든 시각 자료**에서 나온다. 일반론, 출처 없는 수치, 같은 주제 중복은 반려 사유를 다시 만든다.

근거와 결정 기록: Drive `20_areas/floor05-homepage/261015_adsense-approval-research.md`, 운영 방법: `docs/PUBLISHING.md`.

## 절대 규칙

1. **측정 소스는 저작권이 깨끗한 것만 쓴다.** NASA 공공 도메인 사진(아래 목록), floor05 자기 화면 캡처, 스크립트로 생성한 이미지. 타인 사진·샘플(예: Nokia HEIF 샘플)은 쓰지 않는다. 소스가 없는 주제(아이폰 HEIC 등)는 고르지 않는다.
2. **본문 숫자는 전부 `docs/blog-data/*.json` 원자료에서 나와야 한다.** 비율·배수·차이는 원자료로 다시 계산해 확인한다. 측정하지 않은 내용은 "이번엔 측정하지 않았다"고 쓰거나 뺀다.
3. **같은 주제의 페이지를 두 개 만들지 않는다.** 신규 후보가 기존 글과 겹치면 기존 글 리라이트로 바꾼다(`src/lib/common/blog.ts`의 slug 목록 확인).
4. **공식 규격(SNS 크기, 제출 규격 등)은 공식 페이지를 직접 확인한 것만 쓴다.** 확인할 수 없으면 그 주제는 보류한다(인스타그램 규격 글을 보류한 이유).
5. **측정 중 도구 결함을 찾으면 글보다 먼저 main에 고친다.** 발행 주기와 무관하다. 수정 → 단위/E2E 테스트 추가 → `main` 커밋·push → 글에는 "측정하다 고친 것" 섹션으로 경위를 쓴다.
6. **하루 1편, 화·금만 발행한다.** `dateModified`는 실제로 본문을 바꾼 글만, 발행일 값으로 갱신한다.
7. CLAUDE.md 규칙을 그대로 따른다: `prose` 금지(유틸리티 클래스 직접 지정), 프라이버시 문장은 글마다 새로 쓴다(FAQ 마지막 문항 포함), 과장 금지, 담백한 톤.

## 절차

### 1. 주제 고르기
- 리라이트 후보: 기존 글 중 실측 근거가 없는 것. 신규 후보: 아직 관련 글이 없는 도구(`src/lib/common/tools.ts` 대비 `relatedPostSlugs`).
- 측정 가능한지 먼저 판단한다. 브라우저에서 floor05와 같은 경로(Canvas `toBlob`, pdf-lib 등)로 재현할 수 있어야 한다.

### 2. 도구 코드 읽기
해당 도구의 `src/components/<service>/*Tool.tsx`와 `src/lib/<service>/*.ts`에서 **저장 형식·품질·크기 처리**를 확인한다. 지금까지 결함 대부분이 여기서 나왔다(목표 용량 품질 1.8%, PDF 해상도 고정, EXIF 오탐, 회전·크롭이 투명 PNG를 JPG로, 합치기 기본 JPG).

### 3. 측정
- 기존 스크립트를 먼저 재사용한다. 목록은 [resources/scripts.md](resources/scripts.md).
- 새 스크립트는 `scripts/blog-measure/<이름>.mjs`에 만들고 머리 주석에 목적·사용법·기준(무엇과 비교한 PSNR인지)을 쓴다. `import { chromium } from "@playwright/test"`는 저장소 루트에서 실행하면 그대로 된다.
- 화질 지표는 PSNR(dB). 기준 이미지를 무엇으로 했는지 글에 밝힌다. 용량은 1KB=1,000B, 1MB=1,000,000B로 쓴다(목표 용량 계산 코드는 1,024 기준이니 혼동 주의).
- 원자료는 `docs/blog-data/<주제>-<측정일>.json`에 소스·환경·메모를 붙여 저장한다.
- **측정 스크립트는 도구와 똑같은 그리기 경로를 쓴다.** 입력은 `createImageBitmap`(또는 도구가 쓰는 것), 축소는 `src/lib/image/downscale.ts`를 esbuild로 묶어 주입(`npx esbuild src/lib/image/downscale.ts --bundle --format=iife --global-name=DS --outfile=<helper.js>`). 축소가 들어간 수치는 실제 도구 다운로드와 바이트 단위로 같은지 확인한다(경로 차이로 PDF·크롭 글 수치를 정정한 적 있음).

### 4. 시각 자료
직접 만든 것만 쓴다: 원본 픽셀 확대 비교(`image-rendering: pixelated`), 영역 겹침 그림, HTML 막대(div 너비)·표. 모바일에서 글자가 작아지는 SVG 그래프는 피한다. 파일은 `public/images/blog/<slug>/`에 두고 `<img>` 태그에 width/height/alt/loading="lazy"를 단다.

### 5. 예약 브랜치 만들기
- 다음 발행일 = 마지막 예약 브랜치 다음 화·금. 확인: `git fetch --prune && git branch -r --list 'origin/scheduled/*'`
- **직전 예약 브랜치 위에 쌓는다**: `git checkout -b scheduled/YYYY-MM-DD-<slug> scheduled/<직전 브랜치>` 후 `git merge --no-edit main`.
- 도구 수정은 이 브랜치가 아니라 main에서 한다(`git stash -u` → `git checkout main` → 수정·커밋·push → 다시 브랜치로 와서 `git merge main`).

### 6. 글 쓰기
골격은 [resources/post-template.md](resources/post-template.md). 핵심 순서: 결론을 먼저 쓴 도입 → 어떻게 측정했나 → 결과 표 → 발견 섹션(숫자 하나 + 해석) → BlogInlineCTA → 측정하다 고친 것(있으면) → 정리 표("근거 (이번 측정)" 열) → FAQ 4개(답에 실측 숫자) → 마무리 CTA → `<BlogExtras slug>`. 섹션 수와 문체는 글마다 다르게 쓴다. 모든 글을 같은 틀로 찍지 않는다.

### 7. 등록
- 리라이트: `src/lib/common/blog.ts` 해당 항목의 title·description·keywords·`dateModified`(=발행일)·readTime 갱신.
- 신규: `POSTS` 맨 위에 `// ── 신규 (발행일)` 주석과 함께 추가(`datePublished`=`dateModified`=발행일), 관련 도구 페이지 `relatedPostSlugs`에 slug 추가.

### 8. 검증 (기계 판정)
```bash
rm -rf .next/types          # 다른 브랜치 빌드의 낡은 타입 캐시 제거
npx tsc --noEmit && npm run lint && npm run build
npx next start -p 3123 &    # 백그라운드
node scripts/blog-measure/render-check.mjs <slug> <스크래치패드>   # desk 1280 / mobile 390이어야 함
```
캡처를 직접 열어 표·이미지·스타일이 렌더됐는지 본다(빌드는 무스타일도 통과한다). 끝나면 3123 포트 프로세스를 종료한다.

### 9. 커밋·push·병합 시뮬레이션
- 브랜치에 커밋(`content: ...`, 측정 핵심 숫자와 원자료 경로를 본문에) → `git push -u origin scheduled/...`
- 모든 예약 브랜치를 순서대로 임시 브랜치에 병합해 충돌·빌드를 확인한다:
```bash
git checkout -b sim-publish main
for b in $(git ls-remote --heads origin 'scheduled/*' | awk '{print $2}' | sed 's#refs/heads/##' | sort); do git merge -q --no-ff --no-edit $b || echo "CONFLICT $b"; done
rm -rf .next/types && npx tsc --noEmit && npm run build
git checkout main && git branch -D sim-publish
```

### 10. 기록
프로젝트 메모리 `scope-focus-adsense.md`의 예약 목록과 Drive 리서치 문서의 발행 큐 표를 갱신한다.

## 함정 (실제로 겪은 것)
- `python -I`는 `PYTHONIOENCODING`을 무시한다 → 한글 출력은 `python -I -X utf8`.
- Git Bash가 `이름=경로` 형태 인자의 `/c/...`를 변환하지 않는다 → 그런 인자는 `C:/Users/...` 형식으로.
- WebKit은 `.webp` 파일의 `File.type`을 비워 둔다 → 형식 판단은 확장자도 함께.
- WebKit(Playwright)은 Windows용 사파리 엔진 빌드다 → 실제 사파리와 다를 수 있다고 글에 밝힌다.
- 체크아웃한 브랜치마다 `.next/types`가 남아 tsc가 없는 페이지를 찾는다 → `rm -rf .next/types`.
- E2E WebKit 입력은 `fillStable` 헬퍼를 쓴다(hydration 경합).
- Playwright 기본 Chromium(headless 셸)은 파비콘을 받지 않고, 화질 수치도 전체 Chromium(`channel: "chromium"`)과 다르다 → 같은 빌드끼리만 비교한다.
- 축소 화질 E2E는 `writeStripesPng`/`pngGreenStats`(tests/e2e/helpers.ts) 사용. 줄무늬 편차는 마지막 단계가 정확히 2배인 비율(8·16배 등)에서만 판정에 쓸 수 있다. 수정 전 코드에서 실패하는지 반드시 확인한다.
