export default function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-mono font-medium ${className}`}>
      floor<span className="relative -top-[0.45em] text-[0.65em] font-semibold text-accent-on-dark">05</span>
    </span>
  );
}
