/**
 * 블로그 글 레지스트리 (중앙 관리)
 * - 새 글 추가 시 이 파일의 POSTS 배열에만 추가하면 인덱스/메타데이터/스키마/관련글이 일괄 반영
 * - 블로그 인덱스, 각 글의 metadata(canonical), BlogPosting 스키마, 관련글 블록,
 *   도구 페이지의 "관련 가이드"(도구→블로그 링크)가 모두 이 레지스트리를 참조
 */
import type { Metadata } from "next";
import { SITE_URL } from "./constants";

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  keywords: string[];
  /** 최초 발행일 (YYYY-MM-DD) */
  datePublished: string;
  /** 최종 수정일 (YYYY-MM-DD) */
  dateModified: string;
  /** 예상 읽기 시간 (예: "5분") */
  readTime: string;
  /** 관련 글 slug 목록 (블로그↔블로그 내부링크) */
  related: string[];
}

/**
 * 글 목록 — 표시 순서는 최신글 우선.
 * datePublished/dateModified는 검색엔진 신선도 신호(BlogPosting)로 사용된다.
 */
export const POSTS: BlogPost[] = [
  // ── 신규 (2026-10-30) ───────────────────────────────────────────
  {
    slug: "image-rotate-quality",
    title: "사진 회전하면 화질이 떨어질까 — 20번 실측",
    description:
      "카메라 원본 사진을 90°씩 20번 돌려 저장하며 화질을 쟀습니다. 한 번은 재저장과 같았지만, 반복하면 손실이 12배 빨리 쌓였고 원인은 16픽셀 칸이었습니다.",
    keywords: [
      "사진 회전 화질",
      "이미지 회전 화질 저하",
      "jpg 회전 손실",
      "사진 돌리기",
      "이미지 90도 회전",
      "jpg 재저장 화질",
    ],
    datePublished: "2026-10-30",
    dateModified: "2026-10-30",
    readTime: "6분",
    related: ["image-compression-guide", "png-vs-jpg", "image-crop-guide"],
  },
  // ── 신규 (2026-06-29) ───────────────────────────────────────────
  {
    slug: "exif-removal-guide",
    title: "사진 위치정보(EXIF) 삭제 — 카메라 원본 실측",
    description:
      "카메라 원본 사진 두 장을 뜯어보니 GPS가 없어도 장소 글자, 촬영자 이름, 카메라 일련번호가 남아 있었습니다. 무엇이 어디에 남는지와 지운 뒤 결과를 정리했습니다.",
    keywords: [
      "exif 삭제",
      "사진 위치정보 삭제",
      "사진 메타데이터",
      "메타데이터 제거",
      "카메라 일련번호 exif",
      "exif 제거",
      "사진 개인정보",
    ],
    datePublished: "2026-06-29",
    dateModified: "2026-10-27",
    related: ["browser-image-tools-privacy", "photo-mosaic-guide", "prevent-photo-theft"],
    readTime: "7분",
  },
  {
    slug: "photo-mosaic-guide",
    title: "사진 모자이크로 개인정보 가리는 법",
    description:
      "중고거래·SNS에 올릴 사진에서 얼굴·차량 번호판·주소를 안전하게 가리는 법. 모자이크와 블러의 차이, 복원 위험까지 서버에 올리지 않고 처리하는 방법을 정리했습니다.",
    keywords: [
      "사진 모자이크",
      "얼굴 모자이크",
      "개인정보 가리기",
      "번호판 가리기",
      "사진 블러",
      "모자이크 처리",
      "사진 가리기",
    ],
    datePublished: "2026-06-29",
    dateModified: "2026-07-23",
    related: ["browser-image-tools-privacy", "prevent-photo-theft", "image-watermark-guide"],
    readTime: "5분",
  },
  {
    slug: "image-to-pdf-guide",
    title: "사진을 PDF로 만들기 — 화질별 용량 실측",
    description:
      "카메라 사진 10장을 PDF로 묶으니 원본 그대로는 48MB, 긴 변 1754px로 줄이면 2.8MB였습니다. PDF 용량이 정해지는 원리와 화질 옵션 고르는 법.",
    keywords: [
      "사진 pdf 만들기",
      "jpg pdf 변환",
      "이미지 pdf 변환",
      "pdf 용량 줄이기",
      "사진 pdf 용량",
      "여러 사진 pdf",
      "서류 pdf 만들기",
    ],
    datePublished: "2026-06-29",
    dateModified: "2026-10-23",
    readTime: "6분",
    related: ["browser-image-tools-privacy", "image-merge-guide", "photo-editing-without-photoshop"],
  },
  {
    slug: "weekly-holiday-pay-guide",
    title: "주휴수당 계산법과 조건",
    description:
      "주휴수당을 받는 조건(주 15시간·개근), 계산 공식, 2026년 최저시급 기준 월급, 그리고 알바가 놓치기 쉬운 점까지 한 번에 정리했습니다.",
    keywords: [
      "주휴수당 계산법",
      "주휴수당 조건",
      "주휴수당",
      "알바 주휴수당",
      "주 15시간 주휴수당",
      "최저시급 월급",
      "2026 최저임금",
    ],
    datePublished: "2026-06-29",
    dateModified: "2026-07-23",
    readTime: "7분",
    related: ["salary-net-pay-guide", "severance-pay-guide"],
  },
  // ── 신규 (2026-06-23) ───────────────────────────────────────────
  {
    slug: "avif-guide",
    title: "AVIF란? WebP·JPG와 비교 + 변환 방법",
    description:
      "차세대 이미지 포맷 AVIF의 장단점, WebP·JPG와의 차이, 브라우저 지원 현황과 변환 방법까지. 웹에서 받은 AVIF가 안 열릴 때 여는 법도 정리했습니다.",
    keywords: [
      "AVIF",
      "AVIF 변환",
      "AVIF란",
      "AVIF JPG 변환",
      "AVIF WebP 차이",
      "AVIF 안열림",
      "차세대 이미지 포맷",
    ],
    datePublished: "2026-06-23",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["webp-guide", "png-vs-jpg", "image-compression-guide"],
  },

  // ── 신규 (2026-06-20) ───────────────────────────────────────────
  {
    slug: "prevent-photo-theft",
    title: "사진 도용 막는 법",
    description:
      "블로그·중고거래·SNS에 올린 사진이 무단 도용되는 걸 줄이는 현실적인 방법 — 워터마크, 업로드 크기 조절, 출처 표기까지 한 번에 정리했습니다.",
    keywords: [
      "사진 도용 방지",
      "사진 도용",
      "이미지 도용 방지",
      "사진 무단 사용",
      "블로그 사진 도용",
      "사진 저작권 보호",
      "사진 워터마크",
    ],
    datePublished: "2026-06-20",
    dateModified: "2026-06-20",
    readTime: "5분",
    related: ["image-watermark-guide", "browser-image-tools-privacy", "photo-editing-without-photoshop"],
  },
  {
    slug: "image-watermark-guide",
    title: "사진에 워터마크 넣는 법",
    description:
      "텍스트·로고 워터마크를 사진에 넣는 방법. 위치·투명도·전체 반복으로 도용을 막고, 여러 장에 일괄로 넣는 법까지 정리했습니다.",
    keywords: [
      "워터마크 넣기",
      "사진 워터마크",
      "이미지 워터마크",
      "워터마크 만들기",
      "사진 로고 넣기",
      "사진 도용 방지",
      "저작권 표시",
    ],
    datePublished: "2026-06-20",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["prevent-photo-theft", "image-merge-guide", "browser-image-tools-privacy"],
  },

  // ── 신규 (2026-06-12) ───────────────────────────────────────────
  {
    slug: "salary-net-pay-guide",
    title: "2026년 연봉 실수령액 계산하는 법",
    description:
      "4대보험과 소득세를 떼면 통장에 실제로 얼마가 들어올까요? 2026년 요율 기준 연봉별 실수령액과 공제 항목을 정리했습니다.",
    keywords: [
      "연봉 실수령액",
      "실수령액 계산",
      "연봉 실수령액 표",
      "4대보험 공제",
      "월급 실수령액",
      "세후 연봉",
      "2026 연봉 실수령액",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["severance-pay-guide", "character-count-guide"],
  },
  {
    slug: "severance-pay-guide",
    title: "퇴직금 계산하는 법",
    description:
      "평균임금으로 퇴직금을 계산하는 공식과, 상여금·연차수당까지 반영하는 방법, 1년 미만·세금 처리까지 한 번에 정리했습니다.",
    keywords: [
      "퇴직금 계산",
      "퇴직금 계산 방법",
      "평균임금",
      "퇴직금 계산기",
      "1년 퇴직금",
      "퇴직금 세금",
      "퇴직금 산정",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["salary-net-pay-guide", "character-count-guide"],
  },
  {
    slug: "character-count-guide",
    title: "자소서 글자수 세는 법",
    description:
      "공백 포함/제외, 바이트(2·3바이트), 원고지 매수까지 — 자소서·리포트 글자수를 정확히 맞추는 방법을 정리했습니다.",
    keywords: [
      "글자수 세기",
      "자소서 글자수",
      "글자수 공백 포함",
      "공백 제외 글자수",
      "바이트 계산",
      "원고지 매수",
      "글자수 계산기",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["id-photo-size-guide", "passport-photo-size"],
  },
  {
    slug: "id-photo-size-guide",
    title: "증명사진 크기와 만드는 법",
    description:
      "증명사진 3×4, 여권 3.5×4.5, 원형 프로필까지 — 규격에 맞춰 자르고 크기를 맞추는 방법을 알려드립니다.",
    keywords: [
      "증명사진 크기",
      "증명사진 만들기",
      "증명사진 규격",
      "여권사진 크기",
      "원형 프로필 사진",
      "증명사진 자르기",
      "증명사진 300dpi",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["passport-photo-size", "image-crop-guide", "character-count-guide"],
  },

  // ── 신규 (2026-06-11) ───────────────────────────────────────────
  {
    slug: "image-merge-guide",
    title: "사진 여러 장 한 장으로 합치기",
    description:
      "여러 사진을 세로·가로로 이어붙이는 방법. 카카오톡 캡처 합치기부터 상품 비교 이미지까지 한 번에.",
    keywords: [
      "사진 합치기",
      "이미지 합치기",
      "캡처 합치기",
      "사진 여러장 한장으로",
      "사진 세로로 합치기",
      "카톡 캡처 합치기",
      "사진 이어붙이기",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["image-crop-guide", "image-compression-guide", "youtube-thumbnail-size"],
  },
  {
    slug: "youtube-thumbnail-size",
    title: "유튜브 썸네일 크기와 만드는 법",
    description:
      "유튜브 썸네일 권장 크기 1280×720과 비율, 용량 제한, 무료로 만드는 방법을 정리했습니다.",
    keywords: [
      "유튜브 썸네일 크기",
      "썸네일 크기",
      "유튜브 썸네일 만들기",
      "1280x720",
      "유튜브 썸네일 규격",
      "썸네일 사이즈",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["sns-image-size", "instagram-image-size", "image-crop-guide"],
  },
  {
    slug: "photo-editing-without-photoshop",
    title: "포토샵 없이 사진 편집하기",
    description:
      "설치도 결제도 없이, 브라우저에서 사진을 압축·리사이즈·변환·합치는 방법을 한 번에 정리했습니다.",
    keywords: [
      "포토샵 없이 사진 편집",
      "무료 사진 편집",
      "온라인 사진 편집",
      "무료 이미지 편집 사이트",
      "사진 편집 프로그램 무료",
      "브라우저 사진 편집",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-07-22",
    readTime: "7분",
    related: ["image-compression-guide", "image-merge-guide", "image-watermark-guide", "browser-image-tools-privacy"],
  },
  {
    slug: "browser-image-tools-privacy",
    title: "서버에 안 올리는 안전한 이미지 도구",
    description:
      "사진을 서버에 업로드하지 않고 브라우저에서 처리하는 원리와, 개인정보 보호 관점에서의 이점을 설명합니다.",
    keywords: [
      "안전한 이미지 압축",
      "이미지 압축 개인정보",
      "사진 업로드 안전",
      "브라우저 이미지 편집",
      "온라인 이미지 도구 안전",
      "서버 전송 없는 이미지 변환",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["image-compression-guide", "heic-to-jpg-guide", "photo-editing-without-photoshop"],
  },

  // ── 기존 (2026-03) ──────────────────────────────────────────────
  {
    slug: "image-quality-vs-size",
    title: "사진 화질 높이기 vs 용량 줄이기",
    description: "화질과 용량의 차이점, 상황별 올바른 선택 방법을 알려드립니다.",
    keywords: [
      "사진 화질 높이기",
      "이미지 용량 줄이기",
      "화질 vs 용량",
      "사진 해상도",
      "이미지 압축",
      "화질 손실",
      "무손실 압축",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-06-11",
    readTime: "6분",
    related: ["image-compression-guide", "png-vs-jpg", "webp-guide"],
  },
  {
    slug: "transparent-background",
    title: "이미지 배경 투명하게 만들기",
    description: "PNG 투명 배경의 원리와 포맷별 특성, 활용 방법을 알려드립니다.",
    keywords: [
      "이미지 배경 투명",
      "PNG 투명 배경",
      "배경 없는 이미지",
      "투명 PNG",
      "알파 채널",
      "로고 배경 투명",
      "사진 배경 제거",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["png-vs-jpg", "webp-guide", "image-quality-vs-size"],
  },
  {
    slug: "sns-image-size",
    title: "SNS별 이미지 크기 총정리",
    description:
      "인스타, 유튜브, 페이스북, 트위터 등 플랫폼별 최적 이미지 규격.",
    keywords: [
      "SNS 이미지 크기",
      "인스타그램 사진 크기",
      "유튜브 썸네일 크기",
      "페이스북 이미지 크기",
      "트위터 이미지 크기",
      "네이버 블로그 이미지",
      "카카오톡 프로필 크기",
      "소셜미디어 이미지 규격",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-07-23",
    readTime: "6분",
    related: ["instagram-image-size", "youtube-thumbnail-size", "image-crop-guide"],
  },
  {
    slug: "image-crop-guide",
    title: "사진 자르기 완벽 가이드",
    description: "비율별 크롭 방법과 무료 온라인 도구 사용법을 알려드립니다.",
    keywords: [
      "사진 자르기",
      "이미지 크롭",
      "사진 크롭",
      "정사각형 사진",
      "1:1 자르기",
      "16:9 자르기",
      "4:3 자르기",
      "온라인 사진 자르기",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-06-11",
    readTime: "5분",
    related: ["id-photo-size-guide", "sns-image-size", "image-merge-guide"],
  },
  {
    slug: "passport-photo-size",
    title: "증명사진 용량 줄이기",
    description:
      "취업사이트, 원서접수용 200KB, 500KB 용량 제한 맞추는 방법.",
    keywords: [
      "증명사진 용량 줄이기",
      "증명사진 kb 줄이기",
      "증명사진 200kb",
      "증명사진 500kb",
      "취업 증명사진 용량",
      "원서 사진 용량",
      "사진 용량 줄이기",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-07-23",
    readTime: "4분",
    related: ["id-photo-size-guide", "image-compression-guide", "image-quality-vs-size"],
  },
  {
    slug: "webp-guide",
    title: "WebP 포맷 완벽 가이드",
    description:
      "차세대 이미지 포맷 WebP의 장단점과 JPG/PNG에서 변환하는 방법.",
    keywords: [
      "WebP",
      "웹피",
      "WebP 변환",
      "WebP 장점",
      "WebP 단점",
      "이미지 포맷",
      "WebP 지원 브라우저",
      "JPG to WebP",
      "PNG to WebP",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-07-23",
    readTime: "5분",
    related: ["avif-guide", "png-vs-jpg", "transparent-background"],
  },
  {
    slug: "instagram-image-size",
    title: "인스타그램 사진 크기 총정리",
    description:
      "인스타그램 피드, 스토리, 릴스, 프로필 사진의 최적 크기와 무료 리사이즈 방법.",
    keywords: [
      "인스타그램 사진 크기",
      "인스타 이미지 규격",
      "인스타 피드 크기",
      "인스타 스토리 크기",
      "인스타 사진 비율",
      "인스타그램 이미지 사이즈",
      "인스타 정사각형",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-07-23",
    readTime: "4분",
    related: ["sns-image-size", "youtube-thumbnail-size", "image-crop-guide"],
  },
  {
    slug: "png-vs-jpg",
    title: "PNG vs JPG 차이점 — 직접 재본 용량·화질",
    description:
      "사진·스크린샷·그래픽 세 장을 PNG·JPG·WebP로 저장해 용량과 PSNR을 측정했습니다. 사진은 8.8배, 스크린샷은 1.4배 차이였습니다.",
    keywords: [
      "PNG JPG 차이",
      "PNG vs JPG",
      "PNG JPG 용량 비교",
      "스크린샷 PNG JPG",
      "JPG 화질 저하",
      "이미지 포맷 비교",
      "WebP 용량",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-10-15",
    readTime: "7분",
    related: ["webp-guide", "avif-guide", "transparent-background"],
  },
  {
    slug: "image-compression-guide",
    title: "이미지 용량 줄이기 — 품질별 실측",
    description:
      "카메라 원본 사진 두 장을 품질 11단계로 압축해 용량과 화질을 쟀습니다. 100% 재저장은 원본보다 커졌고, 80~90%가 가장 효율적이었습니다.",
    keywords: [
      "이미지 용량 줄이기",
      "사진 용량 줄이기",
      "이미지 압축",
      "JPG 품질 설정",
      "사진 압축 화질",
      "이미지 목표 용량",
      "JPG 압축률",
    ],
    datePublished: "2026-03-07",
    dateModified: "2026-10-20",
    readTime: "8분",
    related: ["image-quality-vs-size", "passport-photo-size", "png-vs-jpg"],
  },
  {
    slug: "heic-to-jpg-guide",
    title: "아이폰 HEIC 사진 JPG 변환 방법",
    description:
      "아이폰에서 찍은 HEIC 사진을 JPG로 변환하는 가장 쉬운 방법을 소개합니다.",
    keywords: [
      "HEIC JPG 변환",
      "아이폰 사진 변환",
      "HEIC 변환",
      "HEIC to JPG",
      "아이폰 HEIC",
      "HEIC 파일 열기",
      "아이폰 사진 JPG",
    ],
    datePublished: "2026-03-07",
    dateModified: "2026-07-23",
    readTime: "3분",
    related: ["png-vs-jpg", "image-compression-guide", "browser-image-tools-privacy"],
  },
];

/** slug → post 빠른 조회 맵 */
const POST_MAP: Record<string, BlogPost> = Object.fromEntries(
  POSTS.map((p) => [p.slug, p]),
);

/** 전체 글 (표시 순서대로 = 최신글 우선) */
export function getAllPosts(): BlogPost[] {
  return POSTS;
}

/** slug로 단일 글 조회 */
export function getPost(slug: string): BlogPost | undefined {
  return POST_MAP[slug];
}

/** 블로그 글의 정식 URL */
export function getPostUrl(slug: string): string {
  return `${SITE_URL}/blog/${slug}`;
}

/** 여러 slug를 받아 존재하는 글만 입력 순서대로 반환 (도구→블로그 링크 해석용) */
export function getPostsBySlugs(slugs: string[]): BlogPost[] {
  return slugs.map((s) => POST_MAP[s]).filter((p): p is BlogPost => Boolean(p));
}

/** 특정 글의 관련 글 목록 (블로그↔블로그 내부링크) */
export function getRelatedPosts(slug: string): BlogPost[] {
  const post = POST_MAP[slug];
  if (!post) return [];
  return getPostsBySlugs(post.related);
}

/**
 * 블로그 글의 Next.js Metadata 생성 (per-post canonical 포함).
 * 각 글 page.tsx에서: `export const metadata = buildBlogMetadata("slug")`
 */
export function buildBlogMetadata(slug: string): Metadata {
  const post = POST_MAP[slug];
  if (!post) return {};
  const url = getPostUrl(slug);
  return {
    title: post.title,
    description: post.description,
    keywords: post.keywords,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.datePublished,
      modifiedTime: post.dateModified,
      // 페이지의 openGraph가 루트 설정을 통째로 덮어쓰므로 공유 이미지를 다시 지정한다
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: ["/og-image.png"],
    },
  };
}

/** 블로그 글의 BlogPosting JSON-LD 스키마 생성 (datePublished/dateModified 포함) */
export function buildBlogPostingSchema(slug: string): Record<string, unknown> | null {
  const post = POST_MAP[slug];
  if (!post) return null;
  const url = getPostUrl(slug);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    image: [`${SITE_URL}/og-image.png`],
    description: post.description,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    inLanguage: "ko-KR",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: { "@type": "Organization", name: "floor05 팀", url: `${SITE_URL}/about#team` },
    publisher: {
      "@type": "Organization",
      name: "floor05",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/og-image.png`,
      },
    },
  };
}
