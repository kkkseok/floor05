# AdSense 재신청 체크리스트

기준일: 2026-08-25  
대상: `https://www.floor05.com`

코드로 해결할 수 있는 광고 밀도, 정책 문구, 공식 출처, 작성 책임자, CMP 재설정 진입점은 반영했다. 아래 항목은 AdSense·Search Console 계정 권한이 있어야 완료할 수 있다.

## 1. 배포 직후 확인

- [ ] 변경사항을 프로덕션에 배포한다.
- [ ] `npm run audit:adsense`, `npm run lint`, `npm test`, `npm run build`가 모두 통과한다.
- [ ] 시크릿 창에서 `/`, `/tools/calc/salary`, `/tools/health/bmi`, `/blog/salary-net-pay-guide`, `/privacy`, `/terms`, `/contact`를 확인한다.
- [ ] `https://www.floor05.com/ads.txt`가 `google.com, pub-3069814419179785, DIRECT, f08c47fec0942fa0`을 반환한다.
- [ ] 페이지 소스의 `<head>`에서 `google-adsense-account` 메타와 `ca-pub-3069814419179785` 스크립트를 확인한다.

## 2. Google 인증 CMP 게시 — 필수

- [ ] AdSense → Privacy & messaging → European regulations에서 floor05용 메시지를 만든다.
- [ ] 사이트로 `www.floor05.com`을 선택하고 개인정보처리방침 URL을 `https://www.floor05.com/privacy`로 지정한다.
- [ ] 동의, 거부, 옵션 관리가 사용자가 이해할 수 있게 제공되는지 미리보기로 확인한다.
- [ ] 메시지를 **게시(Publish)** 한다. 코드의 푸터 버튼만으로는 CMP가 활성화되지 않는다.
- [ ] AdSense의 CMP 관련 경고, 낮은 동의 커버리지 또는 인증되지 않은 CMP 알림이 없는지 확인한다.
- [ ] CMP가 적용되는 지역 테스트에서 첫 방문 메시지가 뜨고, 푸터의 `개인정보·쿠키 설정` 버튼이 선택 변경 창을 다시 여는지 확인한다.

참고: [Google CMP 만들기](https://support.google.com/adsense/answer/10960768), [CMP 요구사항](https://support.google.com/adsense/answer/13554116), [동의 철회 API](https://support.google.com/adsense/answer/10959060)

## 3. Auto ads와 광고 밀도

- [ ] 인페이지 자동광고가 수동 슬롯과 중복되지 않도록 끄거나 사이트 미리보기에서 위치를 제거한다.
- [ ] Page exclusions에 `/`, `/about`, `/contact`, `/privacy`, `/terms`를 등록한다.
- [ ] 모바일 앵커·전면 광고가 콘텐츠나 파일 선택·계산 버튼을 가리지 않는지 확인한다.
- [ ] 도구 상세은 수동 광고 1~2개, 카테고리 허브와 블로그는 1개, 홈·정책·문의 페이지는 0개라는 운영 기준을 유지한다.

## 4. Search Console 재색인

- [ ] sitemap `https://www.floor05.com/sitemap.xml`을 다시 제출하고 읽기 성공 여부를 확인한다.
- [ ] URL 검사 표본: 홈, 8개 카테고리, 금융·건강 도구 10개, 관련 블로그 8개, 정책 페이지 3개.
- [ ] 각 URL의 Google 선택 canonical이 자기 `https://www.floor05.com/...` URL인지 확인한다.
- [ ] `중복`, `크롤링됨—현재 색인되지 않음`, `발견됨—현재 색인되지 않음`을 구분해 기록한다.
- [ ] 이번에 수정된 핵심 URL만 색인 생성을 요청하고, 마지막 크롤링이 배포 이후로 바뀌었는지 확인한다.

## 5. 재신청

- [ ] AdSense Sites의 정확한 거절 문구와 Policy center 화면을 캡처한다.
- [ ] 코드 문제, CMP, Auto ads, 정책 페이지, 핵심 URL 재크롤링을 위 거절 문구와 대조한다.
- [ ] 수정된 페이지가 공개적으로 접근 가능하고 Google이 다시 크롤링한 것을 확인한 뒤 Request review를 누른다.
- [ ] 심사 중에는 대량 페이지 생성, 도메인 변경, canonical 변경, 광고 밀도 재증가를 하지 않는다.

## 기록 템플릿

| 항목 | 확인일 | 결과/스크린샷 |
|---|---|---|
| AdSense 거절 문구 |  |  |
| Google CMP 게시 |  |  |
| Auto ads 제외 |  |  |
| sitemap 읽기 |  |  |
| 핵심 URL 재크롤링 |  |  |
| 재신청 |  |  |
