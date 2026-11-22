# floor05 회사 사이트 (company/)

www.floor05.com 에 올라갈 회사 공식 사이트. 같은 저장소 루트의 도구 사이트(다용도실)와 별개 Next.js 앱이다.
루트 `tsconfig.json`은 이 폴더를 제외한다 — 루트 build·tsc·lint에 영향을 주지 않는다.

```bash
cd company
npm install
npm run dev        # localhost:3000
npm run build
npm run lint
npx tsc --noEmit
```

- 문의 폼: 서버 액션(`src/app/contact/actions.ts`) → Resend로 알림 메일. 환경변수는 `.env.example` 참고. 없으면 폼이 "받을 수 없는 상태" 오류를 보여 준다
- DB 저장은 아직 없다(DB 선택 보류). admin은 이후 단계
- 기획 문서: Google Drive `10_projects/floor05-company/`
- 공개 전 `[확인필요]` 문자열이 남아 있으면 안 된다: `grep -rn "확인필요" src`
