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
  // ── 신규 (2026-11-13) ───────────────────────────────────────────
  {
    slug: "favicon-browser-requests",
    title: "파비콘, 브라우저는 무엇을 받아 갈까 — 요청 기록 실측",
    description:
      "파비콘 세트를 올린 테스트 사이트에서 브라우저 요청을 기록했습니다. Chromium은 favicon.ico 하나, Firefox는 애플 터치 아이콘까지 받았고, 16px 축소 화질 문제도 고쳤습니다.",
    keywords: [
      "파비콘 만들기",
      "favicon.ico 크기",
      "파비콘 사이즈",
      "apple-touch-icon",
      "파비콘 깨짐",
      "favicon 브라우저",
    ],
    datePublished: "2026-11-13",
    dateModified: "2026-11-13",
    readTime: "6분",
    related: ["transparent-background", "png-vs-jpg", "browser-image-encoders"],
  },
  // ── 신규 (2026-11-06) ───────────────────────────────────────────
  {
    slug: "browser-image-encoders",
    title: "같은 품질 92%, 브라우저마다 다를까 — 3개 엔진 실측",
    description:
      "같은 사진을 Chromium·WebKit·Firefox로 JPG·WebP·PNG 저장해 비교했습니다. JPG는 크롬과 사파리 엔진이 바이트까지 같았고, 무손실 PNG가 오히려 1.3~1.5배 달랐습니다.",
    keywords: [
      "브라우저 이미지 저장 차이",
      "크롬 파이어폭스 jpg 용량",
      "canvas toBlob 품질",
      "jpg 4:2:0 4:4:4",
      "png 용량 브라우저",
      "webp 인코딩 속도",
    ],
    datePublished: "2026-11-06",
    dateModified: "2026-11-06",
    readTime: "6분",
    related: ["png-vs-jpg", "image-compression-guide", "webp-guide"],
  },
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
    title: "사진 모자이크 강도, 글자 높이의 몇 배여야 할까",
    description:
      "스크립트로 그린 숫자열에 모자이크와 블러를 강도 4~40으로 걸고, 한 자리만 다른 10장이 가린 뒤에도 구별되는지 쟀습니다. 강도가 숫자 높이의 4분의 1이면 10장이 전부 달랐고, 모자이크 강도가 1.25배 이상이어야 평균 2.5가지 아래로 줄었습니다.",
    keywords: [
      "사진 모자이크",
      "모자이크 강도",
      "모자이크 처리",
      "모자이크 블러 차이",
      "번호판 가리기",
      "개인정보 가리기",
      "사진 가리기",
    ],
    datePublished: "2026-06-29",
    dateModified: "2026-12-18",
    related: ["browser-image-tools-privacy", "prevent-photo-theft", "image-watermark-guide"],
    readTime: "7분",
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
    related: ["browser-image-tools-privacy", "image-merge-guide"],
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
    title: "사진 도용 막는 법 — 올리는 크기별 실측",
    description:
      "2,381만 화소 사진을 긴 변 1280px로 줄여 올리면 원본 픽셀의 5.4%만 나가고, 다시 원본 크기로 키워도 PSNR 28.0dB였습니다. 올리는 크기별 손실과, 줄일 때 사라지는 촬영자·저작권 정보를 쟀습니다.",
    keywords: [
      "사진 도용 방지",
      "사진 도용",
      "이미지 도용 방지",
      "사진 무단 사용",
      "블로그 사진 도용",
      "사진 해상도 줄이기",
      "사진 저작권 정보",
    ],
    datePublished: "2026-06-20",
    dateModified: "2026-12-04",
    readTime: "6분",
    related: ["image-watermark-guide", "browser-image-tools-privacy"],
  },
  {
    slug: "image-watermark-guide",
    title: "사진 워터마크 — 모서리 vs 전체 반복 실측",
    description:
      "모서리 워터마크는 75% 크기로 잘라도 58.7%가 사라졌고, 전체 반복은 어떻게 잘라도 남았지만 사진의 7%를 덮었습니다. 441곳을 잘라 보고 투명도별로 잰 결과입니다.",
    keywords: [
      "워터마크 넣기",
      "사진 워터마크",
      "워터마크 투명도",
      "워터마크 위치",
      "사진 도용 방지",
      "전체 반복 워터마크",
      "저작권 표시",
    ],
    datePublished: "2026-06-20",
    dateModified: "2026-11-24",
    readTime: "6분",
    related: ["prevent-photo-theft", "image-merge-guide", "browser-image-tools-privacy"],
  },

  // ── 신규 (2026-06-12) ───────────────────────────────────────────
  {
    slug: "salary-net-pay-guide",
    title: "2026 연봉 실수령액 표 — 10개 구간 계산",
    description:
      "연봉 2,400만~1억 5,000만 원을 2026년 요율과 간이세액표 원표로 계산했습니다. 연봉이 두 배가 되면 실수령액은 1.87배, 국민연금은 연봉 약 8,150만 원부터 더 늘지 않았습니다.",
    keywords: [
      "연봉 실수령액",
      "연봉 실수령액 표",
      "2026 연봉 실수령액",
      "월급 실수령액",
      "4대보험 공제",
      "세후 연봉",
      "연봉 5000 실수령액",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-11-27",
    readTime: "6분",
    related: ["severance-pay-guide", "character-count-guide"],
  },
  {
    slug: "severance-pay-guide",
    title: "퇴직금 계산 방법 — 월급 300만 원 사례 표",
    description:
      "월급 300만 원을 퇴직금 계산기 코드로 직접 돌렸습니다. 1년치 퇴직금은 퇴직하는 달에 따라 2,934,783원~3,033,708원으로 98,925원 차이가 났고, 연간 상여 600만 원을 넣으면 3년치가 1,468,732원 늘었습니다.",
    keywords: [
      "퇴직금 계산",
      "퇴직금 계산 방법",
      "평균임금",
      "퇴직금 계산기",
      "1년 퇴직금",
      "퇴직금 상여금",
      "퇴직금 통상임금",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-12-01",
    readTime: "6분",
    related: ["salary-net-pay-guide", "character-count-guide"],
  },
  {
    slug: "character-count-guide",
    title: "글자수가 사이트마다 다르게 나오는 이유 — 11가지 입력 실측",
    description:
      "이모지·분리된 한글·줄바꿈·특수 공백 등 11가지 입력을 방식별로 세어 봤습니다. 입력란 글자 제한은 세 브라우저 모두 UTF-16으로 세서 이모지를 중간에서 잘랐습니다.",
    keywords: [
      "글자수 세기",
      "자소서 글자수",
      "공백 제외 글자수",
      "이모지 글자수",
      "바이트 계산",
      "원고지 매수",
      "글자수 계산기",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-11-17",
    readTime: "7분",
    related: ["id-photo-size-guide", "passport-photo-size"],
  },
  {
    slug: "id-photo-size-guide",
    title: "증명사진 크기와 픽셀 환산",
    description:
      "주민등록증·운전면허·수능·국가공무원 원서 사진 규격을 발급 기관 페이지에서 확인했습니다. 3.5×4.5cm를 픽셀로 바꾼 값과, 413×531픽셀로 만든 파일의 용량을 잰 결과입니다.",
    keywords: [
      "증명사진 크기",
      "증명사진 픽셀",
      "증명사진 규격",
      "3.5 4.5 픽셀",
      "413 531 픽셀",
      "운전면허 사진 규격",
      "증명사진 300dpi",
    ],
    datePublished: "2026-06-12",
    dateModified: "2026-12-22",
    readTime: "7분",
    related: ["passport-photo-size", "image-crop-guide", "character-count-guide"],
  },

  // ── 신규 (2026-06-11) ───────────────────────────────────────────
  {
    slug: "image-merge-guide",
    title: "캡처·사진 합치기 — 몇 장·몇 MB 실측",
    description:
      "휴대폰 캡처는 크롬에서 28장(65,520px)까지 이어졌고, 5장을 합치면 PNG가 JPG보다 15% 클 뿐이었습니다. 폭이 다른 이미지를 합칠 때 생기는 일까지 실측했습니다.",
    keywords: [
      "사진 합치기",
      "이미지 합치기",
      "캡처 합치기",
      "카톡 캡처 합치기",
      "사진 세로로 합치기",
      "캡처 이어붙이기 png jpg",
      "사진 이어붙이기",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-11-10",
    readTime: "6분",
    related: ["image-crop-guide", "image-compression-guide", "youtube-thumbnail-size"],
  },
  {
    slug: "youtube-thumbnail-size",
    title: "유튜브 썸네일 크기 — 공식 권장 3840×2160과 용량 한도",
    description:
      "유튜브 도움말에서 확인한 썸네일 권장 크기 3840×2160, 최소 너비, 모바일 2MB·데스크톱 50MB 한도와 Shorts 썸네일, 채널 배너 규격을 정리했습니다.",
    keywords: [
      "유튜브 썸네일 크기",
      "썸네일 크기",
      "유튜브 썸네일 만들기",
      "3840x2160",
      "유튜브 썸네일 규격",
      "썸네일 사이즈",
    ],
    datePublished: "2026-06-11",
    dateModified: "2026-11-22",
    readTime: "6분",
    related: ["sns-image-size", "image-crop-guide"],
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
    related: ["image-compression-guide", "heic-to-jpg-guide"],
  },

  // ── 기존 (2026-03) ──────────────────────────────────────────────
  {
    slug: "transparent-background",
    title: "투명 배경 이미지 — 도구별 투명도 실측",
    description:
      "반투명 그림자가 있는 투명 로고를 10가지 작업에 넣어 봤습니다. 형식만 맞으면 투명도는 그대로였고, JPG만 투명을 버렸습니다. 측정하며 투명을 지우던 도구 다섯 곳을 고쳤습니다.",
    keywords: [
      "이미지 배경 투명",
      "PNG 투명 배경",
      "투명 PNG 용량 줄이기",
      "투명 배경 유지",
      "알파 채널",
      "로고 배경 투명",
      "webp 투명",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-11-20",
    readTime: "6분",
    related: ["png-vs-jpg", "favicon-browser-requests", "image-compression-guide"],
  },
  {
    slug: "sns-image-size",
    title: "SNS 이미지 크기 — 공식 문서로 확인한 규격과 실측",
    description:
      "인스타그램·유튜브·페이스북·X의 공식 도움말에서 직접 확인한 이미지 규격만 모으고, 카메라 원본 두 장을 그 크기로 맞춰 용량과 잘리는 면적을 쟀습니다. 유튜브 권장 3840×2160 썸네일은 사진에 따라 모바일 한도 2MB를 넘었습니다.",
    keywords: [
      "SNS 이미지 크기",
      "인스타그램 사진 크기",
      "인스타그램 사진 비율",
      "유튜브 썸네일 크기",
      "유튜브 채널 배너 크기",
      "페이스북 커버 사진 크기",
      "X 헤더 이미지 크기",
      "소셜미디어 이미지 규격",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-12-08",
    readTime: "7분",
    related: ["youtube-thumbnail-size", "image-crop-guide"],
  },
  {
    slug: "image-crop-guide",
    title: "사진 자르기 — 비율별 남는 픽셀·용량 실측",
    description:
      "카메라 원본 사진을 여섯 비율로 잘라 남는 픽셀과 용량을 쟀습니다. 9:16은 44%만 남았고, 원형 프로필 PNG는 같은 크기 JPG의 5.9배였습니다.",
    keywords: [
      "사진 자르기",
      "이미지 크롭",
      "사진 크롭 비율",
      "정사각형 사진 자르기",
      "원형 프로필 사진",
      "16:9 자르기",
      "9:16 자르기",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-11-03",
    readTime: "6분",
    related: ["id-photo-size-guide", "sns-image-size", "image-merge-guide"],
  },
  {
    slug: "passport-photo-size",
    title: "여권사진 크기와 파일 규격 — 공식 확인·실측",
    description:
      "외교부 여권안내에서 확인한 여권사진 규격(3.5×4.5cm, 온라인용 413×531px·500KB 이하·JPG)과, 그 크기로 저장한 파일이 10~70KB였던 실측 결과를 정리했습니다.",
    keywords: [
      "여권사진 크기",
      "여권사진 규격",
      "여권사진 픽셀",
      "여권사진 용량",
      "여권사진 413 531",
      "온라인 여권 재발급 사진",
      "여권사진 500kb",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-12-15",
    readTime: "6분",
    related: ["id-photo-size-guide", "image-compression-guide"],
  },
  {
    slug: "webp-guide",
    title: "WebP 변환, 언제 이득일까 — 화질을 맞춰 잰 용량",
    description:
      "이미지 5장을 JPG와 같은 화질로 맞춰 WebP 용량을 쟀습니다. 사진은 약 30%, 화면 캡처는 55~63% 작았지만, 이미 압축된 JPG는 12% 커졌고 품질 100%는 PNG보다 컸습니다.",
    keywords: [
      "WebP 변환",
      "WebP 용량",
      "JPG WebP 변환",
      "WebP JPG 비교",
      "WebP 품질 설정",
      "WebP 용량 커짐",
      "WebP 무손실",
      "PNG WebP 변환",
    ],
    datePublished: "2026-03-10",
    dateModified: "2026-12-11",
    readTime: "7분",
    related: ["avif-guide", "png-vs-jpg", "transparent-background"],
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
    title: "사진 압축 품질, 몇 %가 적당할까 — 100%부터 20%까지 실측",
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
    related: ["passport-photo-size", "png-vs-jpg"],
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
