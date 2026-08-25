"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAdsenseExcludedPath } from "@/lib/common/adsense";

declare global {
  interface Window {
    googlefc?: {
      callbackQueue?: Array<Record<string, () => void>>;
      showRevocationMessage?: () => void;
    };
  }
}

/**
 * Google Privacy & messaging 동의 재설정 진입점.
 * 인증 CMP가 준비된 뒤 revocation message를 열어 사용자가 언제든 선택을
 * 변경할 수 있게 한다. CMP 메시지 게시 여부는 AdSense 계정에서 관리한다.
 */
export default function CookieSettings({
  className = "",
}: {
  className?: string;
}) {
  const pathname = usePathname();

  const openConsentSettings = () => {
    const googlefc = (window.googlefc = window.googlefc || {});

    if (googlefc.showRevocationMessage) {
      googlefc.showRevocationMessage();
      return;
    }

    googlefc.callbackQueue = googlefc.callbackQueue || [];
    googlefc.callbackQueue.push({
      CONSENT_API_READY: () => window.googlefc?.showRevocationMessage?.(),
    });
  };

  useEffect(() => {
    if (isAdsenseExcludedPath(pathname)) return;

    const url = new URL(window.location.href);
    if (url.searchParams.get("privacy-settings") !== "open") return;

    url.searchParams.delete("privacy-settings");
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
    openConsentSettings();
  }, [pathname]);

  const handleClick = () => {
    // 정책 페이지는 광고/CMP 태그를 싣지 않는다. 직접 진입해 CMP API가 없는
    // 경우 광고 태그가 허용된 홈으로 완전히 이동한 뒤 설정 창을 연다.
    if (isAdsenseExcludedPath(pathname) && !window.googlefc?.showRevocationMessage) {
      window.location.assign("/?privacy-settings=open");
      return;
    }

    openConsentSettings();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={className}
      aria-label="개인정보 및 쿠키 동의 설정 열기"
    >
      개인정보·쿠키 설정
    </button>
  );
}
