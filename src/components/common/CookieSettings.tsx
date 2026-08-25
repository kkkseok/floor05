"use client";

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
  const handleClick = () => {
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
