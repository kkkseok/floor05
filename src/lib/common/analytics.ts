import { track } from "@vercel/analytics";

/**
 * 도구 사용 트래킹 (Vercel Analytics 커스텀 이벤트)
 *
 * 사용자 파일·입력값은 보내지 않고, 이벤트 이름과 아래 속성만 /_vercel/insights 로 전송해
 * Vercel에서 집계한다(개인정보처리방침 '도구 사용 기록' 항목과 맞출 것). 대시보드:
 *   Vercel 프로젝트 → Analytics → Events
 *
 * 이벤트:
 * - `tool_use`  : 도구를 실제로 한 번 사용(이미지 처리 완료 / 계산기·카운터 입력)
 * - `download`  : 결과물을 다운로드
 *
 * 속성 값은 문자열·숫자·불리언만 허용된다(중첩 객체 ✗).
 */
type EventProps = Record<string, string | number | boolean>;

/** 도구를 실제로 사용했을 때 (도구당 의미 있는 사용 1회) */
export function trackToolUse(tool: string, props?: EventProps): void {
  track("tool_use", { tool, ...props });
}

/** 결과물을 다운로드했을 때 */
export function trackDownload(
  tool: string,
  type: "single" | "zip",
  props?: EventProps,
): void {
  track("download", { tool, type, ...props });
}
