// 실제 화면 캡처(데모 데이터)를 넣기 전까지의 자리
export default function ScreenPlaceholder({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`flex items-center justify-center bg-placeholder font-mono text-[13px] text-subtle ${className}`}
    >
      {label}
    </div>
  );
}
