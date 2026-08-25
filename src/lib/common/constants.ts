// 사이트 정식 도메인 (canonical/OG/구조화데이터 단일 진실 공급원)
// 모든 페이지·sitemap·robots가 www 호스트로 통일되어야 색인 신호가 분산되지 않는다.
const PRIMARY_DOMAIN = "https://www.floor05.com";
// env로 덮어쓸 수 있으나, *.vercel.app 미리보기/기본 도메인 값은 무시한다.
// (프로덕션 canonical/OG가 vercel.app으로 새어 구글이 vercel.app을 정식 URL로
//  인식하는 사고 방지 — 정식 커스텀 도메인을 항상 강제)
const ENV_SITE_URL = process.env.NEXT_PUBLIC_SITE_URL;
export const SITE_URL =
  ENV_SITE_URL && !ENV_SITE_URL.includes("vercel.app")
    ? ENV_SITE_URL
    : PRIMARY_DOMAIN;

// 광고 — AdSense 클라이언트 ID (env 우선, 미설정 시 폴백)
export const ADSENSE_ID =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-3069814419179785";

// AdSense 광고 단위(슬롯) 숫자 ID.
// floor05_horizon_ad (반응형 디스플레이) 단위 ID를 기본값으로 사용하며,
// 필요 시 NEXT_PUBLIC_ADSENSE_SLOT_ID 환경변수로 덮어쓸 수 있다.
// 반응형 단위는 여러 위치(도구 아래·CTA 아래·푸터 위)에 재사용 가능.
// 빈 문자열이면 AdSense를 렌더링하지 않는다(잘못된 광고 요청 방지).
export const ADSENSE_SLOT_ID =
  process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID || "3227968565";

// Kakao Adfit 광고 단위 ID (예: "DAN-xxxxxxxx").
// 설정 시 AdSense 슬롯이 없을 때 대체 노출. 미설정이면 Adfit을 렌더링하지 않는다.
export const ADFIT_UNIT_ID = process.env.NEXT_PUBLIC_ADFIT_UNIT_ID || "";

// 문의 폼 — Web3Forms access key.
// https://web3forms.com 에서 수신할 구글 메일로 발급받아 입력하면,
// 폼 제출 내용이 그 메일로 바로 전송된다(서버 불필요, 운영비 $0 유지).
// 미설정이면 폼 대신 이메일 안내로 폴백한다(잘못된 제출 방지).
export const WEB3FORMS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || "";

// 문의 수신/안내용 이메일 (폼 폴백 및 직접 연락처 노출)
export const CONTACT_EMAIL = "assagaori00@gmail.com";
