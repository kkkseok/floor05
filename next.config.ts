import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          // MIME 타입 스니핑을 막아 잘못된 콘텐츠 해석을 방지합니다.
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 외부 이동 시 필요한 출처 정보만 보내 개인정보 노출을 줄입니다.
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 같은 출처에서만 프레임 삽입을 허용해 클릭재킹 위험을 낮춥니다.
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // HTTPS 접속을 유지하도록 브라우저에 장기 정책을 전달합니다.
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
        ],
      },
    ];
  },

  // non-www → www 301 통일. canonical/sitemap/robots가 모두 www 기준이므로
  // 색인 신호가 두 호스트로 분산되지 않도록 코드 레벨에서도 강제한다.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "floor05.com" }],
        destination: "https://www.floor05.com/:path*",
        permanent: true,
      },
      // 존재한 적 없는 축약 URL로 외부 유입이 발생해 404가 나는 케이스.
      // 실제 라우트인 heic-to-jpg로 301 통일해 색인 신호를 모은다.
      {
        source: "/tools/image/heic",
        destination: "/tools/image/heic-to-jpg",
        permanent: true,
      },
      // 2026-10 사이트 범위 정리: 범용 변환기와 같은 컴포넌트를 쓰던 변환쌍 랜딩과,
      // 근로 계산기 허브로 옮겨갈 수 있는 금융 계산기만 301로 보낸다.
      // 대체 페이지가 없는 건강·단위·날짜·색상·랜덤 도구는 404로 둔다
      // (무관한 페이지로 보내면 soft 404로 처리되기 때문).
      ...["/tools/image/jpg-to-png", "/tools/image/webp-to-jpg"].map((source) => ({
        source,
        destination: "/tools/image/convert",
        permanent: true,
      })),
      ...["/tools/calc/loan", "/tools/calc/savings", "/tools/calc/vat"].map((source) => ({
        source,
        destination: "/tools/calc",
        permanent: true,
      })),
    ];
  },
};

export default nextConfig;
