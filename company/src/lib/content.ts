import { UTILITY_URL } from "./site";

export const TASKS = [
  { id: "report", now: "매일 엑셀 여러 개를 합쳐 보고서를 만든다", after: "파일을 올리면 자동으로 집계되는 대시보드" },
  { id: "price", now: "여러 사이트의 가격·재고를 손으로 확인한다", after: "정해진 시간에 알아서 모아 오는 자동 수집" },
  { id: "match", now: "상품 정보·이미지를 하나씩 눈으로 대조한다", after: "자동으로 대조하고 다른 것만 골라 주는 배치" },
  { id: "share", now: "고객마다 개별 기록을 따로 정리해 보낸다", after: "각자 자기 기록만 보는 개인별 리포트 페이지" },
  { id: "site", now: "홈페이지 공지·상담 신청을 매번 업체에 부탁한다", after: "직접 고치는 관리자 화면이 있는 홈페이지" },
  { id: "tool", now: "직원들이 쓰는 작은 계산·변환 작업이 제각각이다", after: "설치 없이 링크 하나로 쓰는 사내 도구" },
] as const;

export const FLOORS = [
  {
    label: "2F",
    name: "큰 시스템 · 대형 개발사",
    how: "정해진 패키지와 절차에 맞춰 회사 전체를 바꿉니다.",
    fit: "조직 전체의 기간 시스템을 새로 들일 때",
    highlight: false,
  },
  {
    label: "0.5F",
    name: "floor05",
    how: "지금 일하는 방식을 먼저 듣고, 필요한 부분만 만들어 붙입니다.",
    fit: "한두 가지 반복 업무가 팀의 시간을 잡아먹을 때",
    highlight: true,
  },
  {
    label: "1F",
    name: "수작업 · 임시방편",
    how: "사람이 파일을 열고, 옮기고, 확인하는 일을 반복합니다.",
    fit: "일이 아직 적고 자주 바뀔 때",
    highlight: false,
  },
] as const;

export const SERVICES = [
  {
    title: "업무 자동화·데이터 수집",
    body: "사람이 매번 복사하고 붙이던 일을 정해진 시간에 알아서 돌게 만듭니다.",
    when: "같은 작업을 매일, 매주 반복할 때",
  },
  {
    title: "데이터 대시보드·관리자 화면",
    body: "흩어진 엑셀과 기록을 매일 보는 화면 하나로 모읍니다. 보는 사람마다 볼 수 있는 범위를 나눕니다.",
    when: "보고서 만드는 데 하루가 걸릴 때",
  },
  {
    title: "홈페이지·웹서비스",
    body: "회원, 공지, 상담 신청, 관리자 화면까지 갖춘 홈페이지를 만듭니다. 운영자가 개발자 없이 내용을 바꿀 수 있게 합니다.",
    when: "홈페이지를 고칠 때마다 업체에 연락해야 할 때",
  },
  {
    title: "브라우저 도구",
    body: "설치 없이 링크 하나로 쓰는 사내 도구를 만듭니다. 서버가 필요 없는 구조로 만들면 운영비가 거의 들지 않습니다.",
    when: "직원들이 쓰는 작은 도구가 필요할 때",
  },
] as const;

// result는 사용자 확인 후 기입(2026-11-02 결정: 추후). 비어 있으면 화면에서 줄을 숨긴다
export const CASES = [
  {
    client: "관리형 독서실",
    period: "2026.05 ~ 06",
    title: "학부모 학습 리포트",
    summary: "입·퇴실 기록을 올리면 학부모가 자녀의 공부 시간과 출결을 달력으로 확인합니다.",
    situation: "입·퇴실 기록은 있는데, 학부모에게 자녀의 공부 시간과 출결을 보여 줄 방법이 없었습니다.",
    built: "원장이 월별 엑셀을 올리면 자동 집계해, 학부모가 자기 자녀 기록만 달력으로 보는 리포트. 퇴실 체크를 잊은 기록은 자동 보정.",
    result: "",
  },
  {
    client: "제조유통회사",
    period: "2026.05 ~ 진행 중",
    title: "업무 자동화·효율화",
    summary: "상품·정산·이미지 대조 업무를 화면 하나와 자동 배치로 옮겼습니다.",
    situation: "상품, 정산, 이미지 대조처럼 사람이 하나씩 확인하던 업무가 많았습니다.",
    built: "상품·정산·그룹 상품 관리 화면, 상품 이미지 자동 대조 배치, 월별 매출 대시보드.",
    result: "",
  },
  {
    client: "관리형 독서실",
    period: "2026.03 ~ 06",
    title: "홈페이지 리뉴얼",
    summary: "공지, 상담 신청, 재원생 공간, 관리자 화면까지 갖춘 홈페이지입니다.",
    situation: "소개 위주의 홈페이지라 공지, 상담 신청, 재원생 안내를 따로 챙겨야 했습니다.",
    built: "공개 홈페이지, 상담 신청, 재원생 전용 공간(공지·질문방·도시락 신청), 운영자용 관리자 화면.",
    result: "",
  },
] as const;

export const OWN_PROJECTS = [
  { kind: "자체 프로젝트", title: "최저가 모니터링", desc: "쿠팡, 네이버, 다나와의 가격을 정해진 시간에 자동으로 모아 대시보드로 보여 줍니다." },
  { kind: "자체 프로젝트", title: "콘텐츠 자동 발행", desc: "상품·공공 데이터를 글로 만들어 블로그와 SNS 여러 곳에 정해진 시간에 발행합니다." },
  { kind: "자체 서비스", title: "다용도실", desc: "브라우저에서 끝나는 파일·계산 도구 20개. 직접 운영합니다." },
] as const;

export const STEPS = [
  { title: "문의", body: "하고 싶은 일을 편하게 적어 주세요." },
  { title: "상담", body: "지금 어떻게 일하시는지부터 듣습니다." },
  { title: "견적", body: "범위·일정·비용을 문서로 드립니다." },
  { title: "계약·착수", body: "계약하고 선금을 받은 뒤 시작합니다." },
  { title: "제작", body: "중간중간 써 볼 수 있는 화면을 보여 드립니다." },
  { title: "검수·인도", body: "약속한 기능이 되는지 함께 확인합니다." },
  { title: "유지보수", body: "계약 기간 동안 생기는 문제를 고칩니다." },
] as const;

export const WORK_FAQS = [
  { q: "비용은 얼마인가요?", a: "하려는 일의 범위를 들어야 말씀드릴 수 있습니다. 먼저 무료 서면 진단을 받아 보시고, 원하실 때 견적을 요청하세요." },
  { q: "기간은 얼마나 걸리나요?", a: "작은 대시보드는 몇 주, 회원과 관리자 기능이 있는 홈페이지는 몇 달 걸렸습니다. 범위를 듣고 일정표로 드립니다." },
  { q: "기획이 안 되어 있어도 되나요?", a: "됩니다. 지금 하고 계신 방식을 들려주시면 무엇을 만들지 같이 정합니다." },
  { q: "다 만든 뒤에 고칠 수 있나요?", a: "유지보수 기간 안에는 저희가 고칩니다. 그 뒤에도 고칠 수 있게 코드와 사용 설명을 넘겨 드립니다." },
  { q: "서버 비용이 계속 드나요?", a: "만드는 방식에 따라 다릅니다. 서버가 필요 없는 구조가 가능하면 그쪽을 먼저 제안합니다." },
] as const;

export const WAYS = [
  { title: "인도 전에 기능마다 자동 점검을 돌립니다", body: "만든 기능은 자동 테스트로 묶어 둡니다. 고칠 때마다 전에 되던 것이 여전히 되는지 기계가 먼저 확인합니다." },
  { title: "근거를 남깁니다", body: "세율, 요율, 법 기준처럼 틀리면 곤란한 값은 원문 출처와 확인한 날짜를 함께 적습니다." },
  { title: "필요한 만큼만 만듭니다", body: "꼭 필요한 기능부터 열고, 써 보면서 다듬습니다. 만들 필요가 없는 일이면 그렇다고 말씀드립니다." },
] as const;

export const FEATURED_TOOLS = [
  { label: "이미지 압축", href: `${UTILITY_URL}/tools/image/compress` },
  { label: "PDF 합치기", href: `${UTILITY_URL}/tools/pdf/merge` },
  { label: "HEIC → JPG 변환", href: `${UTILITY_URL}/tools/image/heic-to-jpg` },
  { label: "연봉 실수령액", href: `${UTILITY_URL}/tools/calc/salary` },
] as const;

export const TOOL_GROUPS = [
  { name: "이미지", count: 13, hint: "사진 한 장부터 여러 장 일괄까지", items: "압축 · 리사이즈 · 변환 · HEIC→JPG · 크롭 · 회전 · 합치기 · 워터마크 · 모자이크 · 9분할 · 색상 추출 · EXIF 삭제 · 파비콘" },
  { name: "PDF", count: 3, hint: "제출 서류 정리용", items: "합치기 · 나누기 · 이미지→PDF" },
  { name: "텍스트", count: 1, hint: "글자 제한 확인", items: "글자수 세기" },
  { name: "근로 계산", count: 3, hint: "공식 기준표와 대조한 계산", items: "연봉 실수령액 · 퇴직금 · 주휴수당" },
] as const;

export const INQUIRY_TYPES = [
  { id: "work", label: "무료 진단 · 외주 의뢰" },
  { id: "utility", label: "다용도실" },
  { id: "partner", label: "제휴·광고" },
  { id: "etc", label: "기타" },
] as const;

export type InquiryType = (typeof INQUIRY_TYPES)[number]["id"];
