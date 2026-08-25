import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { ADSENSE_ID, SITE_URL } from "@/lib/common/constants";
import AdSenseScript from "@/components/common/AdSenseScript";
import "./globals.css";

// Organization 구조화 데이터 (브랜드 신뢰 신호 + AI 검색 인용 보조)
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "floor05",
  alternateName: "플로어공오",
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description:
    "서버 전송 없이 브라우저에서 처리하는 무료 온라인 도구 모음. 이미지·PDF·계산기·변환 도구를 회원가입 없이 무제한 무료로.",
};

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-mono",
});

const pretendard = localFont({
  src: "../fonts/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "floor05 - 무료 온라인 도구 모음",
  description:
    "서버 전송 없이 브라우저에서 바로. 이미지 압축·변환·크롭, PDF 합치기, 글자수 세기, 연봉·퇴직금 계산까지 회원가입 없이 무제한 무료.",
  keywords: [
    "이미지 압축",
    "이미지 리사이즈",
    "이미지 변환",
    "HEIC 변환",
    "이미지 크롭",
    "사진 용량 줄이기",
    "PDF 합치기",
    "글자수 세기",
    "연봉 실수령액 계산기",
    "무료 온라인 도구",
  ],
  authors: [{ name: "floor05" }],
  creator: "floor05",
  publisher: "floor05",
  icons: {
    icon: [
      { url: "/favicon-accent.ico", sizes: "any" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: "floor05",
    title: "floor05 - 무료 온라인 도구 모음",
    description:
      "서버 전송 없이 브라우저에서 바로. 이미지 압축·변환·크롭, PDF 합치기, 글자수 세기, 연봉·퇴직금 계산까지 회원가입 없이 무제한 무료.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "floor05 - 무료 온라인 도구 모음",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "floor05 - 무료 온라인 도구 모음",
    description:
      "서버 전송 없이 브라우저에서 바로. 이미지·PDF·계산기 도구를 회원가입 없이 무제한 무료로.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "YmJ_D1dCRNV5n1DXivuYlBZt-TQuW-XPmwWXeSgKJnU",
    other: {
      "naver-site-verification": "b0f2a1ff16235b099f211fb89126d1b52aff29f0",
    },
  },
  // canonical은 여기(루트)에 두지 않는다. Next.js 메타데이터는 하위 페이지로
  // 상속되므로, 루트에 canonical을 설정하면 자체 canonical이 없는 모든 페이지가
  // "정식 URL = 홈"으로 선언되어 구글 색인에서 통째로 제외된다.
  // canonical은 각 페이지에서 개별 설정한다.
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${pretendard.variable} ${ibmPlexMono.variable}`}>
      <head>
        <meta name="google-adsense-account" content={ADSENSE_ID} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className="font-sans antialiased">
        <AdSenseScript />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
