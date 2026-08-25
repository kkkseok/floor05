# floor05 AdSense 승인 감사 — 조사 원본

- 조사일: 2026-08-25 (Asia/Seoul)
- 대상: `https://www.floor05.com` 및 `main` 브랜치 `9c1af18`
- 독자: floor05 운영자·개발자
- 목적: 반복되는 AdSense 미승인의 사이트 측 원인을 식별하고 재신청 조건을 정의
- 가정: 현재 배포본이 심사 대상이다. AdSense 계정 내부의 정확한 반려 문구, 정책 센터, CMP·자동 광고 설정에는 접근하지 못했다.

## 직접 답변

현재 사이트는 접속, 소유권 확인 코드, `ads.txt`, `robots.txt`, sitemap, canonical, HTTPS, 주요 기능 면에서는 승인 준비가 되어 있다. 따라서 연결 실패나 크롤러 차단이 반복 반려의 주원인일 가능성은 낮다.

사이트에서 확인된 핵심 결함은 다음 네 가지다.

1. 자체 쿠키 배너가 광고 요청을 먼저 멈추지 않으며 Google 인증 CMP가 아니다.
2. 개인정보처리방침이 실제 문의 폼의 이메일·메시지 수집과 Web3Forms 전송을 부정한다.
3. 금융·건강 콘텐츠가 기관명을 텍스트로 적지만 클릭 가능한 1차 출처와 눈에 보이는 작성·검수 주체가 없다.
4. 짧은 도구 페이지도 기본 3개 광고 단위를 렌더링하며, 외부 검색 표본에서 블로그는 발견됐지만 검사한 도구 URL은 발견되지 않았다.

콘텐츠 수 자체는 문제가 아니다. 40개 도구와 34개 블로그가 있고, 도구 상세 페이지에는 정적 검사 기준 한글 콘텐츠가 약 874~2,409자 있다. Google은 선호하는 단어 수가 없다고 명시한다. 추가할 것은 범용 문단이 아니라 출처, 작성 책임, 실제 테스트 결과와 독자적 설명이다.

## 로컬·배포 증거

| 주장 | 증거 | 신뢰도 | 반증/한계 |
|---|---|---:|---|
| 사이트 연결 문제 가능성 낮음 | HTTP·apex가 `https://www.floor05.com/`으로 최종 도달, 홈·정책 페이지 200, SSL 정상 | 높음 | Googlebot/AdSense 계정 로그에는 접근 불가 |
| 소유권 코드 정상 | 초기 HTML `<head>`에 publisher meta와 `adsbygoogle.js`, `/ads.txt`의 pub ID 일치 | 높음 | 계정에서 같은 사이트·계정을 선택했는지는 미확인 |
| 크롤링 기반 정상 | robots 전체 허용, sitemap 88 URL, 전 URL HEAD 200, noindex 없음 | 높음 | Google이 실제로 색인했는지는 Search Console 확인 필요 |
| canonical 정상 | 홈·about·contact·privacy·terms와 도구 페이지가 자기 `www` URL을 canonical로 선언 | 높음 | 2026-07-02 이전 상태의 Google 선택 canonical 잔존 가능 |
| 동의 구현 결함 | `CookieConsent.tsx`는 mount 뒤 NPA만 설정하고 `pauseAdRequests`가 없음. `AdSlot.tsx`는 mount 즉시 `push({})` | 높음 | AdSense 계정의 지역 메시지/CMP가 별도로 켜져 있을 가능성 |
| 개인정보 고지 모순 | live `/contact`는 폼과 이메일 입력을 렌더링. `ContactForm.tsx`는 Web3Forms로 이메일·메시지 전송. `/privacy`는 개인정보·이메일을 수집하지 않는다고 명시 | 높음 | Web3Forms 보관 정책·계약 상태는 미확인 |
| 정책 연락처 신뢰 문제 | privacy@·support@를 고지하지만 DNS MX 레코드가 없고 앱 상수는 Gmail 주소 | 중상 | MX 없이 A 레코드로 메일을 받는 특수 구성은 이론상 가능하나 Vercel 호스트에서는 실용성이 낮음 |
| YMYL 신뢰 신호 부족 | 조사한 금융·건강·관련 블로그 19개 중 18개에 작성자 토큰이 없고, calc/health/blog `page.tsx` 전체에 외부 `https` 링크가 0개 | 높음 | 기관명과 법령명은 텍스트 표에 다수 존재하며 계산값 표본은 공식 자료와 일치 |
| 광고 밀도 위험 | `ToolLayout.tsx` 기본이 수동 슬롯 3개이고 `showThirdAd=true` | 높음 | 기능 자체도 publisher-content이므로 정책 위반이라고 단정할 수는 없음 |
| 콘텐츠 대량 중복은 낮음 | 40개 도구 페이지에서 12자 이상 동일 문자열이 3개 이상 페이지에 반복된 경우 7종뿐 | 중상 | 의미상 유사 문장·템플릿 구조까지 측정한 것은 아님 |
| 실제 기능·빌드 정상 | 의존성 동기화 후 Next 빌드 92 static routes 성공, 프로덕션 smoke 8개 항목 모두 통과 | 높음 | 모든 40개 도구의 완전한 기능 검증은 아님 |

## 공식 기준과 판정

- Google은 미승인 원인을 코드 누락, 접근 불가, 고유 콘텐츠·UX 부족, 정책 위반으로 구분한다. 현재 앞의 두 항목은 직접 검사에서 통과했다.
- Google은 unique, original, relevant content와 명확한 내비게이션을 요구한다. floor05 내비게이션은 양호하지만, 브라우저 로컬 처리라는 문구만으로는 한국 도구 시장에서 독자성이 충분하지 않다.
- Google Publisher Policies는 low-value content 화면과 publisher-content보다 광고가 많은 화면을 허용하지 않는다. 3개 슬롯을 모든 도구에 동일 적용하는 방식은 페이지 길이별 제어로 바꿔야 한다.
- Google의 개인화/비개인화 예시는 사용자 선택 전에 `pauseAdRequests=1`을 설정하고, NPA 플래그가 모든 `push()`보다 먼저 와야 한다고 명시한다. 현재 구현은 두 조건을 모두 보장하지 않는다.
- EEA·영국·스위스 광고에는 Google 인증 TCF CMP가 요구된다. 자체 배너 대신 AdSense Privacy & messaging의 Google CMP가 가장 단순한 해결책이다.
- Google은 개인정보처리방침에 Google 등 제3자 사업자의 쿠키 사용, 이전 방문 기반 광고, 광고 설정을 통한 옵트아웃 등을 고지하도록 요구한다. 현재 방침은 일부만 충족하며 Web3Forms를 누락한다.
- Google Search의 people-first 지침은 금융·건강 같은 YMYL에서 신뢰를 더 중시하며 정확한 작성자 정보, 배경, 근거를 권장한다. 단어 수 목표는 부정한다.

## 표본 사실 검증

사이트의 2026년 금융 기준이 전반적으로 틀렸다는 증거는 발견되지 않았다.

- 국민연금 9.5%, 근로자 4.75%, 2026년 7월 상한 659만원: 국민연금공단 자료와 일치.
- 건강보험 7.19%, 장기요양보험료율 환산 13.14%: 국민건강보험 EDI 안내와 일치.
- 2026년 최저임금 10,320원: 고용노동부 확정 고시와 일치.

문제는 정확한 수치를 페이지가 주장하면서도 사용자가 원문을 즉시 검증할 링크가 없다는 점이다.

## 원인 우선순위

### 확정 결함

1. CMP·광고 요청 순서
2. 개인정보처리방침과 문의 폼의 모순
3. 수신 불확실한 정책 연락처

### 반려 문구가 “low value content”일 때 가능성 높은 약점

1. 저자·검수·1차 출처가 없는 금융·건강 콘텐츠
2. 페이지별 독자성보다 공통 가치 제안에 의존
3. 짧은 페이지에도 동일한 3개 광고 슬롯
4. 과거 canonical 문제 뒤 도구 페이지 재색인이 아직 충분하지 않을 가능성

### 계정에서만 확인 가능한 원인

- 중복 AdSense 계정
- 연령·본인 확인·결제 주소
- Sites 상태와 실제 반려 문구
- Policy center 이슈
- Google CMP와 Auto ads 설정

## 출처 원장

| 주장 | 출처 | 발행자 | 갱신/접근 | URL |
|---|---|---|---|---|
| 미승인 원인 분류, 심사 2~4주 | What to do when your site is not ready to show ads | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/12176698 |
| 고유 콘텐츠·내비게이션 | Make sure that your site's pages are ready for AdSense | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/7299563 |
| low-value 화면 금지 | Google-served ads on screens without publisher-content | Google Publisher Policies | 2026-08-25 접근 | https://support.google.com/publisherpolicies/answer/11112688 |
| 광고가 콘텐츠보다 많으면 안 됨 | More ads or paid promotional material than publisher-content | Google Publisher Policies | 2026-08-25 접근 | https://support.google.com/publisherpolicies/answer/11169917 |
| 개인정보처리방침 필수 고지 | Required content | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/1348695 |
| 쿠키 고지 | How AdSense uses cookies | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/7549925 |
| 인증 CMP 요건 | Google consent management requirements for publishers | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/13554116 |
| pauseAdRequests와 NPA 순서 | Ad code examples for ads personalization settings | Google AdSense Help | 2026-08-25 접근 | https://support.google.com/adsense/answer/9042142 |
| 사람 중심 콘텐츠·YMYL·저자·단어 수 | Creating helpful, reliable, people-first content | Google Search Central | 2025-12-10 갱신, 2026-08-25 접근 | https://developers.google.com/search/docs/fundamentals/creating-helpful-content |
| doorway·scaled content | Spam Policies for Google Web Search | Google Search Central | 2026년 갱신, 2026-08-25 접근 | https://developers.google.com/search/docs/essentials/spam-policies |
| 국민연금 2026 기준 | 국민연금 사업장가입자 안내 | 국민연금공단 | 2026-08-25 접근 | https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0097M0.do |
| 건강보험 2026 기준 | 2026년도 보험료율 인상 안내 | 국민건강보험공단 EDI | 2026-08-25 접근 | https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html |
| 최저임금 2026 기준 | 2026년 적용 최저임금 시간급 10,320원 | 고용노동부 | 2025-08-05, 2026-08-25 접근 | https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144 |

## 조사 한계와 중단 기준

AdSense 계정 화면과 Search Console 속성에는 접근하지 못했다. 외부 검색 표본은 Google Search Console의 색인 보고서를 대체하지 않는다. 다만 모든 주요 보고서 섹션에 공식 1차 근거가 있고, 연결·콘텐츠·정책·동의·신뢰의 핵심 주장을 코드와 배포본으로 재검증했으며 추가 범용 검색이 우선순위를 바꿀 가능성이 낮아 조사를 종료했다.
