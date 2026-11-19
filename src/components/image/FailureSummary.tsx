interface FailureSummaryProps {
  items: Array<{ status: string; error?: string }>;
  fallback: string;
}

/**
 * 일괄 처리 실패 요약.
 * 썸네일 위에는 "실패" 표시만 두고, 원인과 해결 방법은 여기서 읽을 수 있는 크기로 안내한다.
 */
export default function FailureSummary({ items, fallback }: FailureSummaryProps) {
  const failed = items.filter((item) => item.status === "error");
  if (failed.length === 0) return null;

  // 같은 원인은 한 번만 보여준다
  const messages = Array.from(new Set(failed.map((item) => item.error || fallback)));

  return (
    <div role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
      <p className="font-medium">
        {items.length}개 중 {failed.length}개를 처리하지 못했습니다.
      </p>
      <ul className="mt-1 space-y-1">
        {messages.map((message) => (
          <li key={message}>{message}</li>
        ))}
      </ul>
    </div>
  );
}
