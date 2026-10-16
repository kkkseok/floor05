"use client";

import { useCallback, useState } from "react";
import { trackDownload } from "@/lib/common/analytics";
import { uniqueFileName } from "@/lib/common/fileUtils";

interface DownloadButtonProps {
  // 트래킹용 도구 식별자 (예: "compress"). 지정 시 다운로드 이벤트 집계
  tool?: string;

  // 단일 파일 다운로드
  fileName?: string;
  fileUrl?: string;
  fileBlob?: Blob;

  // 다중 파일 다운로드 (ZIP)
  files?: Array<{
    name: string;
    blob: Blob;
  }>;
  zipFileName?: string;

  // 스타일
  variant?: "primary" | "secondary";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  className?: string;

  // 라벨
  label?: string;

  // 에러 콜백
  onError?: (error: string) => void;
}

/**
 * 다운로드 버튼 컴포넌트
 * - 단일 파일 다운로드
 * - 다중 파일 ZIP 다운로드 (JSZip 필요)
 */
export default function DownloadButton({
  tool,
  fileName,
  fileUrl,
  fileBlob,
  files,
  zipFileName = "floor05-images.zip",
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  label,
  onError,
}: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 에러 처리
  const handleError = useCallback((message: string) => {
    setError(message);
    onError?.(message);
    // 3초 후 에러 메시지 숨김
    setTimeout(() => setError(null), 3000);
  }, [onError]);

  // 단일 파일 다운로드
  const downloadSingleFile = useCallback(async () => {
    if (!fileName) return;

    try {
      let url: string;

      if (fileUrl) {
        url = fileUrl;
      } else if (fileBlob) {
        url = URL.createObjectURL(fileBlob);
      } else {
        return;
      }

      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      if (tool) trackDownload(tool, "single");

      // Blob URL 해제
      if (fileBlob) {
        URL.revokeObjectURL(url);
      }
    } catch {
      handleError("다운로드에 실패했습니다. 다시 시도해주세요.");
    }
  }, [tool, fileName, fileUrl, fileBlob, handleError]);

  // ZIP 다운로드 (다중 파일)
  const downloadZip = useCallback(async () => {
    if (!files || files.length === 0) return;

    setIsDownloading(true);
    setError(null);

    try {
      // JSZip 동적 로드
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();

      // 파일 추가 (동일 이름 충돌 시 " (n)" 접미사로 구분 — 덮어쓰기/손실 방지)
      const usedNames = new Set<string>();
      for (const file of files) {
        zip.file(uniqueFileName(file.name, usedNames), file.blob);
      }

      // ZIP 생성
      const zipBlob = await zip.generateAsync({ type: "blob" });

      // 다운로드
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = zipFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      if (tool) trackDownload(tool, "zip", { count: files.length });
    } catch {
      handleError("ZIP 파일 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsDownloading(false);
    }
  }, [tool, files, zipFileName, handleError]);

  // 다운로드 핸들러
  const handleClick = useCallback(() => {
    if (disabled || isDownloading) return;

    if (files && files.length > 1) {
      downloadZip();
    } else {
      downloadSingleFile();
    }
  }, [disabled, isDownloading, files, downloadZip, downloadSingleFile]);

  // 버튼 라벨
  const buttonLabel = label || (
    files && files.length > 1
      ? `ZIP 다운로드 (${files.length}개)`
      : "다운로드"
  );

  // 사이즈 스타일
  const sizeStyles = {
    sm: "px-4 py-2.5 text-sm min-h-[44px]",
    md: "px-6 py-3 text-base min-h-[44px]",
    lg: "px-8 py-4 text-lg min-h-[48px]",
  };

  // 변형 스타일
  const variantStyles = {
    primary: `
      bg-brand-accent text-white
      hover:bg-brand-accent-light
      disabled:bg-brand-light disabled:text-brand-mid
    `,
    secondary: `
      bg-brand-paper text-brand-black border border-brand-light/50
      hover:bg-brand-white hover:border-brand-accent/50
      disabled:bg-brand-paper disabled:text-brand-light
    `,
  };

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={disabled || isDownloading}
        aria-busy={isDownloading || undefined}
        className={`
          inline-flex items-center justify-center gap-2
          font-medium rounded-lg
          transition-all duration-200
          disabled:cursor-not-allowed
          ${sizeStyles[size]}
          ${variantStyles[variant]}
          ${className}
        `}
      >
        {/* 아이콘 */}
        {isDownloading ? (
          <svg
            className="w-5 h-5 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        )}

        {/* 라벨 */}
        <span>{isDownloading ? "준비 중..." : buttonLabel}</span>
      </button>

      {/* 에러 메시지 */}
      {error && (
        <p className="text-sm text-red-500 animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}
