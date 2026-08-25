"use client";

import { useEffect, useRef, useState } from "react";
import KakaoAdfit from "./KakaoAdfit";
import {
  ADSENSE_ID,
  ADSENSE_SLOT_ID,
  ADFIT_UNIT_ID,
} from "@/lib/common/constants";

declare global {
  interface Window {
    adsbygoogle: Record<string, unknown>[];
  }
}

interface AdSlotProps {
  slot: "tool-below" | "cta-below" | "footer-above" | "blog-inline";
  className?: string;
}

// 슬롯별 설정 (Adfit 대체 노출 시 사용할 크기 + CLS 방지용 예약 높이 포함)
// reserveClass: AdSense 로드 전 공간을 미리 확보해 레이아웃 점프(CLS)를 막는다.
// height(고정)가 아닌 min-height를 써서 실제 광고가 더 커도 잘리지 않게 한다.
const SLOT_CONFIG: Record<
  string,
  {
    height: string;
    format: string;
    adfitWidth: number;
    adfitHeight: number;
    reserveClass: string;
  }
> = {
  "tool-below": { height: "h-24", format: "horizontal", adfitWidth: 320, adfitHeight: 100, reserveClass: "min-h-[90px]" },
  "cta-below": { height: "h-24", format: "horizontal", adfitWidth: 320, adfitHeight: 100, reserveClass: "min-h-[90px]" },
  "footer-above": { height: "h-20", format: "horizontal", adfitWidth: 320, adfitHeight: 50, reserveClass: "min-h-[90px]" },
  "blog-inline": { height: "h-32", format: "rectangle", adfitWidth: 300, adfitHeight: 250, reserveClass: "min-h-[250px]" },
};

export default function AdSlot({ slot, className = "" }: AdSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const [adPushed, setAdPushed] = useState(false);
  const isDev = process.env.NODE_ENV === "development";

  const config = SLOT_CONFIG[slot] || SLOT_CONFIG["tool-below"];

  useEffect(() => {
    // AdSense 광고 로드. 스크립트는 루트 layout <head>에서 로드되며,
    // adsbygoogle 큐는 스크립트 로드 전 push도 버퍼링하므로(공식 스니펫과
    // 동일 패턴) 준비 상태를 기다릴 필요가 없다.
    // 지역별 동의 신호와 광고 개인화 여부는 Google 인증 CMP와 AdSense가
    // 처리한다. 슬롯은 공식 스니펫과 같은 방식으로 요청만 큐에 넣는다.
    if (!isDev && ADSENSE_SLOT_ID && adRef.current && !adPushed) {
      try {
        window.adsbygoogle = window.adsbygoogle || [];
        window.adsbygoogle.push({});
        setAdPushed(true);
      } catch {
        // 광고 로드 실패 시 무시
      }
    }
  }, [isDev, adPushed]);

  // 개발 환경: 플레이스홀더 표시
  if (isDev) {
    return (
      <div
        className={`
          ${config.height}
          bg-brand-paper
          border border-dashed border-brand-light
          rounded-lg
          flex items-center justify-center
          ${className}
        `}
      >
        <div className="text-center">
          <p className="font-mono text-xs text-brand-light uppercase tracking-wider">
            AD SLOT
          </p>
          <p className="font-mono text-[10px] text-brand-light/60 mt-1">
            {slot}
          </p>
        </div>
      </div>
    );
  }

  // AdSense (슬롯 ID가 설정된 경우 우선)
  if (ADSENSE_SLOT_ID) {
    return (
      <div ref={adRef} role="complementary" aria-label="광고" className={`${config.reserveClass} ${className}`}>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={ADSENSE_ID}
          data-ad-slot={ADSENSE_SLOT_ID}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div>
    );
  }

  // AdSense 슬롯이 없으면 Adfit으로 대체 (설정된 경우)
  if (ADFIT_UNIT_ID) {
    return (
      <KakaoAdfit
        unit={ADFIT_UNIT_ID}
        width={config.adfitWidth}
        height={config.adfitHeight}
        className={`flex justify-center ${className}`}
      />
    );
  }

  // 설정된 광고 ID가 없으면 렌더링하지 않음 (잘못된 광고 요청 방지)
  return null;
}
