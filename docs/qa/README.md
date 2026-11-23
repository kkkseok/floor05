# floor05 QA 가이드

전체 사용자 기능을 실제 사용 관점에서 검증하는 QA 체계. 2026-08-13 최초 구축.

## 테스트 구성

| 레이어 | 도구 | 대상 | 실행 |
|--------|------|------|------|
| Unit | Vitest | `src/lib/**` 순수 계산 로직 (95개) | `npm test` |
| E2E (로컬) | Playwright | 40개 도구 전체 UI·다운로드·결과물 | `npm run test:e2e` |
| E2E (프로덕션) | Playwright | floor05.com 비파괴 smoke | `npm run test:e2e:prod` |

## 실행 방법

```bash
# 0. 최초 1회: 브라우저·fixture 준비
npx playwright install chromium webkit
npm run fixtures                 # tests/fixtures/generated/ 에 이미지·PDF 생성

# 1. 단위 테스트 (계산 정확성)
npm test

# 2. 로컬 E2E — 프로덕션 빌드 기준
npm run build
npx next start -p 3010           # 별도 터미널 (또는 playwright가 자동 기동)
npm run test:e2e                                     # 3개 프로젝트 전부
npx playwright test --project=chromium               # 데스크톱만
npx playwright test --project=mobile-chromium        # 모바일 뷰포트 (Pixel 7)
npx playwright test --project=webkit --workers=2     # WebKit은 워커 2 권장(아래 참고)

# 3. 프로덕션 smoke (읽기 전용 + 브라우저 로컬 처리 1건)
npm run test:e2e:prod
```

## 테스트 범위·원칙

- **계산기**: 화면 표시값을 **독립 산출 golden value**와 대조 (제품 함수 재사용 금지).
  요율 출처: 국민연금공단·건보공단·고용노동부·국세청 고시 (2026 기준, `src/lib/calc/rates.ts` 주석 참조)
- **이미지/PDF**: 다운로드 파일을 바이트 레벨 검사 — 매직바이트(형식)·치수(IHDR/SOF/VP8 직접 파싱)·
  PDF 페이지 수·페이지 크기(pdf-lib)·ZIP 내부 구성(jszip)·EXIF 존재 여부(바이트 스캔)
- **파일 비전송(P0 제품 계약)**: 처리 전 과정의 네트워크를 기록해
  외부 호스트로 body가 실린 요청 0건 · 동일 출처 대용량 POST 0건 검증 (`privacy.spec.ts`)
- **Edge case**: 빈 값·0·음수·경계값·역순 날짜·깨진 파일·형식 불일치·범위 밖 입력
- **콘솔/네트워크 가드**: 모든 주요 테스트에서 1st-party 콘솔 오류·pageerror·4xx/5xx = 실패
  (서드파티 광고·분석·로컬 `/_vercel/` 404는 필터)

## Fixture (`tests/fixtures/generate.mjs`)

제품 코드를 쓰지 않고 독립 생성. `npm run fixtures`로 재생성 (git 미추적).

| 파일 | 용도 |
|------|------|
| photo-1200x900.jpg 외 JPG 4종 | 기본·소형·가로·세로 비율 |
| opaque-800x600.png / transparent-400x300.png / tiny-4x4.png | PNG·투명·최소 크기 |
| photo-800x600.webp | WebP 입력 |
| exif-gps.jpg | APP1(Exif)+GPS IFD를 바이트 삽입한 실제 EXIF JPEG |
| sample.heic | 실물 HEIC (Nokia HEIF 샘플, 1440×960) |
| broken.jpg / truncated.jpg / not-image.txt / broken.pdf | 깨진 파일·형식 불일치 |
| a4-1p.pdf / letter-3p.pdf / mixed-2p.pdf | 페이지 수·용지 크기 상이 PDF |

## 새 기능(도구) 추가 시

1. `src/lib/**` 계산 로직이 있으면 → `tests/unit/`에 **독립 검산값**으로 unit 테스트 추가
2. `tests/e2e/`의 해당 카테고리 spec에 E2E 추가:
   - 페이지 접근 → `nav.spec.ts`의 라우트 목록에 경로 추가 (canonical 검증 포함)
   - 정상 플로우 + edge case ≥2개 + (파일 도구면) 다운로드 결과물 검사
   - 파일 도구면 `privacy.spec.ts` 패턴으로 비전송 검증 고려
3. `installGuards`/`assertClean`으로 콘솔·네트워크 가드 적용
4. 회귀: `npm test && npm run lint && npx tsc --noEmit && npm run build && npm run test:e2e`

## 알려진 주의사항

- **WebKit flaky**: hydration 완료 전 입력 시 값이 되돌아가는 경합 → 입력에는
  `fillStable()` 헬퍼 사용, WebKit은 `--workers=2` 권장. retries=1로 잔여 흡수.
- **HEIC 변환 E2E**: libheif-js 디코딩으로 모든 프로젝트(Chromium·모바일·WebKit)에서 실행. `tests/fixtures/static/range-full-256x128.heic`(전체 범위, `scripts/qa/make-heic-range-fixtures.py`로 생성, 커밋됨)로 어두운 면이 0으로 뭉개지지 않는지 검사.
- **WebP 출력**: 브라우저 인코딩 지원을 감지해 버튼이 비활성화되는 설계 —
  테스트는 실제 버튼 상태에 따라 분기.
- **프로덕션 smoke의 자동광고**: AdSense auto ads가 주입하는 `<ins>`는 `data-ad-slot`이
  없어 코드 배치 슬롯과 구분해 계수한다.
- 날짜 도구는 `page.clock.setFixedTime`으로 '오늘'을 2026-08-13에 고정해 결정적으로 검증.
  미래에 테스트 기준일을 바꿀 때는 golden value(만 나이·D-Day 등)도 같이 갱신할 것.

## 문서

- `BASELINE.md` — 기능 현황·알려진 제한·미해결 항목
- `runs/YYYY-MM-DD.md` — 실행 기록 (Feature Matrix·발견·수정·검증)
