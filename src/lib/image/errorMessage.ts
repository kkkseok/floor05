/**
 * 이미지 처리 중 잡힌 오류를 사용자에게 보여줄 문장으로 바꾼다.
 * - 내부 구현 용어(Canvas 컨텍스트 등)나 브라우저·워커가 던진 영어 메시지는 그대로 노출하지 않는다.
 * - lib에서 이미 "원인 + 해결 방법"으로 써 둔 한국어 안내(HEIC 읽기 실패, 합치기 크기 초과 등)는 그대로 통과시킨다.
 */

const TOO_LARGE = "사진이 너무 커서 처리하지 못했습니다. 크기를 줄이거나 한 장씩 다시 시도해 주세요.";
const UNREADABLE = "사진을 열지 못했습니다. 파일이 손상되지 않았는지 확인한 뒤 다시 올려 주세요.";

// 내부 메시지 → 안내 문구. 위에서부터 먼저 맞는 규칙을 쓴다.
const KNOWN: Array<[RegExp, string | null]> = [
  // 캔버스를 만들지 못했거나 toBlob이 null을 돌려준 경우: 대개 메모리 부족·초대형 이미지
  [/Canvas 컨텍스트|이미지를 처리할 수 없습니다/, TOO_LARGE],
  [/이미지를 로드할 수 없습니다|파일을 읽을 수 없습니다/, UNREADABLE],
  // 사용자가 손쓸 수 없는 내부 상태 → 도구별 기본 문구로
  [/알 수 없는 프리셋/, null],
];

const HANGUL = /[가-힣]/;

export function toFriendlyImageError(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) return fallback;

  for (const [pattern, message] of KNOWN) {
    if (pattern.test(error.message)) return message ?? fallback;
  }

  // 한글이 없으면 브라우저·워커가 던진 기술 메시지로 보고 감춘다.
  return HANGUL.test(error.message) ? error.message : fallback;
}
