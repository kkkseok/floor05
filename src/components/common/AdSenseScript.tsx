"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { ADSENSE_ID } from "@/lib/common/constants";
import { isAdsenseExcludedPath } from "@/lib/common/adsense";

/**
 * Google AdSense 및 Google Privacy & messaging 런타임.
 * 개인정보처리방침과 이용약관은 CMP의 개인정보처리방침 URL로 사용되므로
 * Google 지침에 따라 동의가 필요한 광고 태그를 로드하지 않는다.
 */
export default function AdSenseScript() {
  const pathname = usePathname();

  if (isAdsenseExcludedPath(pathname)) {
    return null;
  }

  return (
    <Script
      id="google-adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_ID}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
