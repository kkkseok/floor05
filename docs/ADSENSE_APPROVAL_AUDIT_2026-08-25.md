# floor05 Google AdSense 승인 감사 보고서

조사일: 2026-08-25  
대상: `https://www.floor05.com` 및 `main` 브랜치 `9c1af18`

## 구현 현황 (2026-08-25)

저장소에서 처리 가능한 권장사항은 구현했다.

- 자체 동의 배너를 제거하고 Google 인증 CMP의 동의 철회 API를 푸터·개인정보처리방침에 연결
- 문의 폼, Web3Forms, Vercel Analytics, Google AdSense의 실제 데이터 흐름에 맞춰 개인정보처리방침 개정
- 서비스 전체 범위와 금융·건강 결과의 한계를 반영해 이용약관 개정, 연락처를 실제 Gmail로 통일
- 금융·건강 도구 10개와 관련 블로그 8개에 공식 출처·검토일·면책 블록 추가
- 모든 블로그에 `floor05 운영자` 작성 정보와 About 링크 추가
- 도구 상세 수동 광고를 길이에 따라 1~2개, 카테고리 허브를 1개로 축소
- `npm run audit:adsense` 자동 점검과 [계정 작업 체크리스트](./ADSENSE_REAPPLICATION_CHECKLIST.md) 추가

Google CMP 메시지 게시, Auto ads page exclusion, Search Console 재색인, AdSense 재신청은 계정 권한이 필요한 작업이므로 체크리스트에 남겼다.

## 결론

floor05는 “페이지 수가 부족해서” 승인되지 않는 상태로 보이지 않습니다. 현재 40개 도구, 34개 블로그, 88개 sitemap URL이 있고, 배포·canonical·AdSense 소유권 코드·`ads.txt`·HTTPS·주요 기능도 정상입니다.

반복 미승인의 사이트 측 원인으로 가장 먼저 고칠 것은 다음 세 가지입니다.

1. **쿠키 동의 전에 광고 요청이 나갈 수 있고 자체 배너가 Google 인증 CMP가 아닙니다.**
2. **개인정보처리방침이 실제 문의 폼의 이메일·메시지 수집과 Web3Forms 전송을 부정합니다.**
3. **금융·건강 콘텐츠에 클릭 가능한 공식 출처와 눈에 보이는 작성·검수 책임자가 없습니다.**

반려 문구가 “저가치 콘텐츠”였다면 3번과 페이지별 광고 밀도, 과거 canonical 문제 뒤의 재색인 상태가 특히 유력합니다. 반려 문구가 “정책 위반”이었다면 1번과 2번을 최우선으로 봐야 합니다.

## 현재 정상인 부분

다음 항목은 직접 확인했으므로 우선순위를 낮춰도 됩니다.

- HTTP와 non-www는 최종적으로 `https://www.floor05.com/`에 도달합니다.
- 홈, 소개, 문의, 개인정보, 약관, `ads.txt`, `robots.txt`, sitemap이 모두 200입니다.
- sitemap 88개 URL 모두 HEAD 요청에서 200이었습니다.
- 초기 HTML `<head>`에 `google-adsense-account` 메타와 올바른 publisher ID의 AdSense 스크립트가 있습니다.
- `ads.txt` publisher ID와 코드의 ID가 일치합니다.
- 정책·도구 페이지에 `noindex`가 없고 canonical은 자기 `www` URL을 가리킵니다.
- 의존성 동기화 후 Next.js 프로덕션 빌드 92개 정적 라우트가 성공했습니다.
- 프로덕션 smoke에서 주요 페이지, SEO 인프라, canonical, 리디렉션, 404, 광고 슬롯 수, 계산기, 브라우저 로컬 이미지 압축이 모두 통과했습니다.

Google이 안내하는 미승인의 주요 범주는 코드 누락, 접근 불가, 고유 콘텐츠·UX 부족, 정책 위반입니다. 앞의 두 범주는 현재 배포본에서 가능성이 낮습니다. [Google AdSense의 미승인 점검 기준](https://support.google.com/adsense/answer/12176698)

## 발견된 문제

### P0 — 동의 전에 광고 요청이 발생할 수 있음

감사 당시 존재하던 `CookieConsent.tsx`는 컴포넌트가 마운트된 뒤 `requestNonPersonalizedAds` 값을 설정했습니다. 그러나 [AdSlot.tsx](../src/components/common/AdSlot.tsx)는 별도 effect에서 즉시 `adsbygoogle.push({})`를 실행하고, 루트 [layout.tsx](../src/app/layout.tsx)에서는 AdSense 스크립트를 처음부터 로드했습니다. effect 실행 순서와 외부 스크립트 타이밍에 따라 NPA 신호보다 광고 요청이 먼저 갈 수 있었습니다.

Google의 공식 구현 예시는 사용자가 선택하기 전에 `pauseAdRequests=1`로 요청을 멈추고, 비개인화 광고를 선택했다면 NPA 신호를 모든 `push()`보다 먼저 설정하라고 안내합니다. 비개인화 광고도 지역에 따라 쿠키 동의가 필요할 수 있다고 명시합니다. [Google의 광고 개인화 코드 예시](https://support.google.com/adsense/answer/9042142)

또한 EEA·영국·스위스 트래픽에 광고를 제공하려면 Google 인증 TCF CMP가 필요합니다. 현재 자체 배너는 인증 CMP가 아닙니다. [Google의 게시자 CMP 요건](https://support.google.com/adsense/answer/13554116)

권장 해결책:

1. AdSense의 `Privacy & messaging`에서 Google European regulations message를 활성화합니다.
2. Google CMP를 광고 동의의 단일 소스로 사용하고 현재 자체 AdSense 배너와 중복되지 않게 정리합니다.
3. 자체 흐름을 유지해야 한다면 초기 HTML에서 광고 요청을 먼저 pause하고, 동의 신호를 설정한 뒤에만 resume합니다. 다만 인증 CMP 요건은 별도로 충족해야 하므로 Google CMP가 더 안전합니다.
4. 승인 전 AdSense 계정에서 CMP 상태와 “CMP not certified / No CMP / Low coverage” 경고가 없는지 확인합니다.

### P0 — 개인정보처리방침이 실제 데이터 흐름과 모순됨

배포된 문의 페이지는 이메일 입력이 있는 폼을 렌더링합니다. [ContactForm.tsx](../src/components/common/ContactForm.tsx)는 선택 입력한 이메일, 문의 내용, 도구·문의 유형을 `api.web3forms.com`으로 전송합니다.

하지만 [privacy/page.tsx](../src/app/privacy/page.tsx)는 다음과 같이 적혀 있습니다.

- “개인정보를 수집하지 않습니다.”
- “이메일, 이름, 연락처 등을 요구하지 않습니다.”
- “수집하는 개인정보가 없으므로, 제3자에게 제공하는 개인정보도 없습니다.”

이는 실제 동작과 정면으로 충돌합니다. Google은 모든 게시자가 사이트의 광고 쿠키 사용을 명확히 고지하고 적용 법률을 준수해야 한다고 요구합니다. 개인정보처리방침에는 Google 등 제3자 사업자의 쿠키 사용, 이전 방문 기반 광고, 광고 설정을 통한 옵트아웃도 포함해야 합니다. [AdSense 필수 개인정보 고지](https://support.google.com/adsense/answer/1348695), [AdSense의 쿠키 사용 안내](https://support.google.com/adsense/answer/7549925)

권장 해결책:

- 문의 폼에서 수집하는 항목, 필수·선택 여부, 목적, 전송 받는 서비스(Web3Forms), 보관·삭제 기준, 이용자 문의·삭제 요청 방법을 실제 운영과 일치하게 적습니다.
- Google AdSense와 Vercel Analytics의 실제 데이터 흐름과 옵트아웃 링크를 정확히 갱신합니다.
- 개인정보처리방침과 약관의 최종 수정일을 실제 배포일로 갱신합니다.
- `privacy@floor05.com`, `support@floor05.com`, 앱의 Gmail 중 실제로 받는 하나로 통일합니다. 현재 `floor05.com`에는 MX 레코드가 확인되지 않아 도메인 메일의 수신 가능성을 보장하기 어렵습니다. 도메인 메일을 쓸 경우 MX와 실제 받은편지함을 먼저 구성합니다.
- 약관의 서비스 설명이 이미지 도구 4개에 머물러 있으므로 현재 40개 도구 범위로 갱신합니다.

이 작업은 법률 자문을 대신하지 않습니다. 다만 현재처럼 사실관계가 서로 모순되는 상태는 법적 완성도와 별개로 반드시 고쳐야 합니다.

### P1 — 금융·건강 콘텐츠의 신뢰 근거가 사용자에게 보이지 않음

금융·건강·관련 블로그 표본 19개 중 18개에서 눈에 보이는 작성자 단서를 찾지 못했습니다. 또한 `src/app/tools/calc`, `src/app/tools/health`, `src/app/blog`의 페이지 코드에는 공식 기관으로 이동하는 외부 `https` 링크가 하나도 없습니다. 기관명과 법령명을 표에 적어두기는 했지만 사용자가 원문을 검증할 수 없습니다.

Google은 사람 중심 콘텐츠에서 작성자, 작성 배경, 근거와 전문성을 확인할 수 있게 하라고 권장합니다. 재정·건강처럼 삶에 영향을 주는 YMYL 주제는 신뢰 신호를 더 중요하게 다룹니다. 반대로 Google은 선호하는 단어 수가 없다고 명시합니다. [Google의 사람 중심 콘텐츠 지침](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)

표본 검증에서 사이트 수치 자체는 대체로 맞았습니다.

- 국민연금 9.5%, 근로자 4.75%, 2026년 7월 상한 659만원은 [국민연금공단 안내](https://www.nps.or.kr/pnsinfo/ntpsklg/getOHAF0097M0.do)와 일치합니다.
- 건강보험 7.19%와 장기요양 환산 비율은 [국민건강보험공단 EDI 안내](https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html)와 일치합니다.
- 2026년 최저임금 10,320원은 [고용노동부 확정 고시](https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144)와 일치합니다.

따라서 필요한 것은 일반 문장을 더 늘리는 작업이 아니라 **검증 가능성을 화면에 드러내는 작업**입니다.

권장 해결책:

- 금융·건강 도구와 관련 글에 공통 `SourceBlock`을 두고 기관명, 문서명, 기준일, 원문 링크를 표시합니다.
- 블로그에 실제 작성 주체와 About 링크가 있는 byline을 표시합니다. 전문 검수를 받지 않았다면 받았다고 표현하지 않습니다.
- 각 계산기에 “기준일 / 계산식 버전 / 다음 검토 예정 / 실제 결과와 다를 수 있는 항목”을 표시합니다.
- 법률·세율·플랫폼 규격처럼 변하는 숫자는 본문 안에서 바로 1차 출처로 연결합니다.
- 건강 페이지에는 참고용·비진단 안내를 유지하고, 근거 모델의 한계와 의료 상담이 필요한 상황을 명확히 구분합니다.

### P1 — 모든 도구에 기본 3개 광고 슬롯

[ToolLayout.tsx](../src/components/common/ToolLayout.tsx)는 기본적으로 `tool-below`, `cta-below`, `footer-above` 세 슬롯을 렌더링하고 `showThirdAd`의 기본값도 `true`입니다. 가장 짧은 도구 페이지도 같은 구조를 받습니다.

Google은 저가치 화면에 광고를 허용하지 않으며, 광고·유료 홍보물이 publisher-content보다 많아서는 안 된다고 명시합니다. 여러 광고 단위를 쓸 수 있지만 “less can be more”라고도 안내합니다. [저가치 화면 정책](https://support.google.com/publisherpolicies/answer/11112688), [콘텐츠보다 많은 광고 정책](https://support.google.com/publisherpolicies/answer/11169917)

현재 도구가 실제로 동작하고 설명도 있어 곧바로 위반이라고 단정할 수는 없습니다. 다만 승인 심사에는 불필요한 위험입니다.

권장 해결책:

- 지속 가능한 최종 규칙으로 짧은 도구 1개, 긴 도구 2개를 기본으로 합니다. 3개는 충분한 본문과 실제 체류가 검증된 페이지에만 예외적으로 둡니다.
- 승인 연결용 `<head>` 스크립트는 유지하되, 수동 광고 단위는 한 개부터 시작합니다.
- AdSense Auto ads가 켜져 있다면 홈·소개·문의·개인정보·약관을 page exclusion으로 제외하고 수동 슬롯과 중복되지 않는지 확인합니다.
- “승인 직전만 광고를 숨겼다가 바로 복원”하는 방식이 아니라, 승인 뒤에도 유지할 광고 밀도를 설계합니다.

### P1 — 도구 페이지 재색인 상태를 확인해야 함

Git 기록상 큰 canonical 정비는 2026-07-02, 콘텐츠 보강은 2026-07-23, AdSense 스크립트 `<head>` 이동은 2026-08-04에 이루어졌습니다. 현재 배포본은 정상이나 과거의 잘못된 canonical 신호가 Google 색인에 남았을 수 있습니다.

외부 검색 표본에서는 여러 블로그 URL이 발견됐지만 검사한 네 개의 도구 상세 URL은 발견되지 않았습니다. 이 결과는 Google Search Console을 대신할 수 없으므로 색인 실패로 단정하지는 않습니다. 다만 재신청 전 확인해야 할 신호입니다.

권장 해결책:

1. Search Console `페이지 색인 생성`에서 `/tools/` URL의 색인 수와 제외 사유를 봅니다.
2. URL 검사로 홈, 카테고리 허브 3개, 핵심 도구 10개, 핵심 블로그 5개를 확인합니다.
3. “Google이 선택한 canonical”이 자기 `www` URL인지, 마지막 크롤링이 2026-08-04 이후인지 확인합니다.
4. 수정된 핵심 URL만 색인 요청하고 sitemap을 다시 제출합니다.
5. 고아 페이지, “중복 — Google이 다른 표준 페이지를 선택함”, “크롤링됨 — 현재 색인되지 않음”을 각각 분리해 대응합니다.

## 재신청 실행 순서

### 1단계 — 재신청 전 필수 수정

- Google 인증 CMP 적용 및 광고 요청 순서 수정
- 개인정보처리방침·약관·문의 연락처 일치
- Auto ads·수동 슬롯 중복 확인, 짧은 페이지 광고 축소

### 2단계 — 신뢰 보강

- 금융·건강 도구 전체에 원문 출처 링크와 기준일 추가
- 관련 블로그에 byline, 수정일, 출처 블록 추가
- 우선순위 10개 도구에 자체 테스트 결과, 예시 입력·출력, 알고리즘·한계 설명 추가

브라우저 안에서 처리한다는 장점은 유지하되 이것만을 독자성으로 삼지 않는 편이 좋습니다. 한국어 경쟁 도구들도 같은 가치를 내세웁니다. 자체 테스트와 공신력 있는 한국 기준, 구현별 차이를 결합해야 “왜 이 페이지여야 하는가”가 생깁니다.

### 3단계 — 배포 후 검증

- `npm run build`
- `npm test`
- `npm run fixtures`
- `npm run test:e2e`
- `npm run test:e2e:prod`
- live `ads.txt`, robots, sitemap, canonical, 개인정보 문구 재확인
- Search Console에서 핵심 URL의 수정 후 재크롤링 확인

### 4단계 — AdSense 재신청

- Sites의 정확한 반려 문구와 Policy center를 캡처해 수정 항목과 대조합니다.
- CMP 경고가 없고 핵심 URL이 수정 후 다시 크롤링된 뒤 `Request review`를 누릅니다.
- Google은 심사가 보통 며칠, 경우에 따라 2~4주 걸릴 수 있다고 안내합니다. 고정된 “며칠 기다리기”보다 수정 사항이 실제로 크롤링됐는지를 기준으로 재신청하는 편이 낫습니다. [AdSense 재검토 안내](https://support.google.com/adsense/answer/12176698)

## 하지 않아도 되는 일

- 글 수를 더 늘리기 위해 범용 블로그를 대량 추가할 필요는 없습니다.
- 모든 도구에 같은 “무료·브라우저 처리·회원가입 없음” 문단을 길게 붙이지 마세요.
- 단어 수 목표를 맞추기 위한 문장 증량은 권장하지 않습니다.
- 이미 정상인 `ads.txt`, HTTPS, www canonical을 다시 갈아엎지 마세요.
- Search Console 확인 없이 모든 URL을 반복 색인 요청하지 마세요.

## 계정 화면에서 추가로 확인할 항목

다음은 저장소나 공개 사이트만으로 판단할 수 없습니다.

- AdSense Sites에 표시된 정확한 거절 문구
- Policy center의 페이지·정책 코드
- 중복 AdSense 계정 여부
- 연령·본인 확인·결제 주소 상태
- Google CMP 선택 상태
- Auto ads와 page exclusion 설정
- Search Console의 실제 Google 선택 canonical과 색인 제외 사유

정확한 반려 문구 또는 스크린샷이 있으면 위 진단을 해당 사유에 맞춰 한 단계 더 좁힐 수 있습니다.
