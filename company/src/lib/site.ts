export const SITE_URL = "https://www.floor05.com";

// 다용도실 주소. 12월 전환 전까지는 도구가 www에 있다 → 전환 때 https://utility.floor05.com 으로 바꾼다
export const UTILITY_URL = "https://www.floor05.com";

export const NAV = [
  { href: "/about", label: "회사 소개" },
  { href: "/services", label: "서비스" },
  { href: "/work", label: "외주" },
] as const;

export const BUSINESS = {
  name: "플로어공오",
  brand: "floor05",
  owner: "송규석",
  regNo: "530-27-02224",
  address: "서울특별시 강남구 논현로38길 30, 3층 a106호",
  category: "정보통신업 (컴퓨터 프로그래밍 서비스업, 소프트웨어 개발 및 공급업)",
} as const;

export const REPLY_DAYS = 3;
