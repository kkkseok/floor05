/**
 * 출시된 도구 목록 (중앙 관리)
 * - 새 도구 추가 시 이 파일만 수정
 * - Header, Footer, ToolLayout, 메인 페이지에서 공통 사용
 */

export type ToolCategory = "image" | "text" | "calc" | "pdf";

export interface Tool {
  name: string;
  href: string;
  description: string;
  /** 도구 콘텐츠 최종 수정일 YYYY-MM-DD — sitemap lastmod에 사용, 없으면 sitemap에서 생략 */
  lastModified?: string;
  shortDescription?: string; // Header 드롭다운용 짧은 설명
  category: ToolCategory;
}

export const TOOLS: Tool[] = [
  {
    name: "이미지 압축",
    href: "/tools/image/compress",
    description: "서버 전송 없이 브라우저에서 바로. 목표 용량 설정, 일괄 압축까지.",
    shortDescription: "용량 줄이기",
    category: "image",
  },
  {
    name: "이미지 리사이즈",
    href: "/tools/image/resize",
    description: "px, %, SNS 프리셋으로 크기 조절. 인스타, 유튜브, 네이버 블로그까지.",
    shortDescription: "크기 조절",
    category: "image",
  },
  {
    name: "포맷 변환",
    href: "/tools/image/convert",
    description: "PNG, JPG, WebP, AVIF 자유롭게 변환. BMP·GIF·SVG·HEIC 입력까지, 투명 배경 처리도.",
    shortDescription: "PNG, JPG, WebP, AVIF",
    category: "image",
  },
  {
    name: "HEIC → JPG",
    href: "/tools/image/heic-to-jpg",
    description: "아이폰 사진을 JPG로 변환. 회원가입 없이 무제한 무료.",
    shortDescription: "아이폰 사진",
    category: "image",
  },
  {
    name: "이미지 크롭",
    href: "/tools/image/crop",
    description: "원하는 영역만 자르기. 1:1, 4:3, 16:9 비율 프리셋.",
    shortDescription: "자르기",
    category: "image",
  },
  {
    name: "이미지 합치기",
    href: "/tools/image/merge",
    description: "여러 사진을 세로·가로로 한 장에. 캡처 이어붙이기까지.",
    shortDescription: "여러 장 합치기",
    category: "image",
  },
  {
    name: "워터마크 넣기",
    href: "/tools/image/watermark",
    description: "텍스트·로고를 사진 위에. 위치·투명도·반복까지, 여러 장 일괄.",
    shortDescription: "워터마크 삽입",
    category: "image",
  },
  {
    name: "이미지 회전·반전",
    href: "/tools/image/rotate",
    description: "세로로 찍힌 사진을 바로. 90도 회전·좌우/상하 반전, 서버 전송 없이.",
    shortDescription: "회전·반전",
    category: "image",
  },
  {
    name: "사진 모자이크",
    href: "/tools/image/mosaic",
    description: "얼굴·차번호·개인정보를 드래그로 가리기. 모자이크·블러, 파일은 서버로 안 갑니다.",
    shortDescription: "모자이크·블러",
    category: "image",
  },
  {
    name: "인스타 9분할",
    href: "/tools/image/grid",
    description: "한 장을 3×3으로 나눠 ZIP으로. 인스타 그리드 피드 만들기.",
    shortDescription: "9분할",
    category: "image",
  },
  {
    name: "이미지 색상 추출",
    href: "/tools/image/color-picker",
    description: "사진을 클릭해 색을 추출. 대표 색 팔레트와 HEX 코드까지.",
    shortDescription: "색상 추출",
    category: "image",
  },
  {
    name: "EXIF 삭제",
    href: "/tools/image/exif-remove",
    description: "사진의 위치·촬영정보(EXIF)를 제거. 올리기 전에 GPS·기기 정보를 지웁니다.",
    shortDescription: "위치정보 삭제",
    category: "image",
  },
  {
    name: "파비콘 만들기",
    href: "/tools/image/favicon",
    description: "이미지로 favicon.ico와 각 사이즈 아이콘·매니페스트를 한 번에. ZIP으로.",
    shortDescription: "favicon 생성",
    category: "image",
  },
  {
    name: "글자수 세기",
    href: "/tools/text/counter",
    description: "공백·바이트·원고지·자소서 글자수를 한 번에. 붙여넣으면 바로 계산.",
    shortDescription: "글자수·바이트",
    category: "text",
  },
  {
    name: "연봉 실수령액",
    href: "/tools/calc/salary",
    description: "2026년 4대보험·세금을 떼고 매달 통장에 찍히는 금액. 부양가족까지 반영.",
    shortDescription: "월 실수령액",
    category: "calc",
  },
  {
    name: "퇴직금 계산기",
    href: "/tools/calc/severance",
    description: "입사일·퇴사일과 월급으로 퇴직금을 바로. 평균임금·상여·연차수당 반영.",
    shortDescription: "퇴직금",
    category: "calc",
  },
  {
    name: "주휴수당 계산기",
    href: "/tools/calc/wage",
    description: "시급과 주 근로시간으로 주휴수당·주급·월급 환산까지. 2026년 최저시급 기준.",
    shortDescription: "주휴수당",
    category: "calc",
  },
  {
    name: "이미지 PDF 변환",
    href: "/tools/pdf/image-to-pdf",
    description: "여러 사진을 한 PDF로. 순서 조정, 용지(A4)·여백 옵션까지. 서버 전송 없이.",
    shortDescription: "사진→PDF",
    category: "pdf",
  },
  {
    name: "PDF 합치기",
    href: "/tools/pdf/merge",
    description: "여러 PDF를 하나로 병합. 순서를 바꿔가며. 파일이 서버로 전송되지 않습니다.",
    shortDescription: "PDF 병합",
    category: "pdf",
  },
  {
    name: "PDF 분할",
    href: "/tools/pdf/split",
    description: "원하는 페이지만 추출하거나, 모든 페이지를 낱장으로. ZIP 일괄 다운로드.",
    shortDescription: "PDF 나누기",
    category: "pdf",
  },
];

/**
 * 카테고리(Room) 메타 — 메인 페이지 섹션 구성에 사용. 배열 순서대로 노출.
 */
export const TOOL_CATEGORIES: {
  id: ToolCategory;
  room: string;
  label: string;
  tagline: string;
}[] = [
  {
    id: "image",
    room: "Room 01",
    label: "Image Tools",
    tagline: "파일이 서버로 전송되지 않습니다. 무제한 무료.",
  },
  {
    id: "text",
    room: "Room 02",
    label: "Text Tools",
    tagline: "붙여넣으면 바로. 입력 내용은 저장·전송되지 않습니다.",
  },
  {
    id: "calc",
    room: "Room 03",
    label: "Calculator",
    tagline: "복잡한 세금·요율은 우리가. 숫자만 넣으면 바로 계산됩니다.",
  },
  {
    id: "pdf",
    room: "Room 04",
    label: "PDF Tools",
    tagline: "서버에 올리지 않고 브라우저에서 바로. 파일이 전송되지 않습니다.",
  },
];

/**
 * 카테고리별 도구 목록
 */
export function getToolsByCategory(category: ToolCategory): Tool[] {
  return TOOLS.filter((tool) => tool.category === category);
}

/**
 * 특정 도구를 제외한 목록 반환
 */
export function getOtherTools(currentHref?: string): Tool[] {
  if (!currentHref) return TOOLS;
  return TOOLS.filter((tool) => tool.href !== currentHref);
}

/**
 * href로 도구 조회 (문의 폼 prefill 등에 사용)
 */
export function getToolByHref(href?: string | null): Tool | undefined {
  if (!href) return undefined;
  return TOOLS.find((tool) => tool.href === href);
}
