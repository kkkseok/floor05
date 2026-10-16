import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // floor05 브랜드 컬러
        brand: {
          black: "#0A0A0A",
          dark: "#1A1A1A",
          mid: "#4A4A4A",
          light: "#B0B0B0", // 어두운 배경 위 보조 글자용 (밝은 배경에서는 대비 2.1로 부족 → subtle)
          subtle: "#6E6E6E", // 밝은 배경 위 보조 글자 (#FAFAFA 대비 4.9)
          paper: "#F2F0ED",
          white: "#FAFAFA",
          // 2026-10 대비 보정: #C45C2C는 흰 글자 4.27·밝은 배경 4.09로 WCAG AA(4.5) 미달
          accent: "#B8562A",
          "accent-light": "#C45C2C",
          "accent-muted": "rgba(184, 86, 42, 0.12)",
        },
      },
      fontFamily: {
        // Primary: 모노스페이스
        mono: [
          "var(--font-mono)",
          "IBM Plex Mono",
          "SF Mono",
          "Fira Code",
          "JetBrains Mono",
          "Courier New",
          "monospace",
        ],
        // Secondary: 한글
        sans: [
          "var(--font-sans)",
          "Pretendard",
          "Apple SD Gothic Neo",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      // 반응형 breakpoint 유지
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
      },
      // 커스텀 애니메이션
      animation: {
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
