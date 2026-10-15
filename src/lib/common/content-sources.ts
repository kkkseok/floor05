export interface ContentSource {
  title: string;
  publisher: string;
  url: string;
}

export interface ContentReview {
  reviewedAt: string;
  disclaimer: string;
  sources: ContentSource[];
}

const REVIEWED_AT = "2026-08-25";

const FINANCE_DISCLAIMER =
  "계산 결과는 입력값과 공개 기준을 적용한 예상치입니다. 신고·계약·급여 정산처럼 중요한 결정에는 해당 기관의 최신 자료와 실제 명세서를 함께 확인하세요.";


const SOURCES = {
  pension2026: {
    title: "2026년 사업장가입자 국민연금 보험료율",
    publisher: "국민연금공단",
    url: "https://ma.nps.or.kr/pnsinfo/ntpsklg/getOHAF0016M0.do?menuId=MN24001108",
  },
  healthInsurance2026: {
    title: "2026년도 건강보험·장기요양보험 보험료율",
    publisher: "국민건강보험공단",
    url: "https://edi.nhis.or.kr/portal/images/popup/20251204_pop01longdesc.html",
  },
  earnedIncomeTax: {
    title: "근로소득 간이세액표 안내",
    publisher: "국세청",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7862&mi=6583",
  },
  minimumWage2026: {
    title: "2026년 적용 최저임금 시간급 10,320원",
    publisher: "고용노동부",
    url: "https://www.moel.go.kr/news/enews/report/enewsView.do?news_seq=18144",
  },
  retirementBenefitAct: {
    title: "근로자퇴직급여 보장법",
    publisher: "국가법령정보센터",
    url: "https://www.law.go.kr/lsInfoP.do?lsId=009883",
  },
} satisfies Record<string, ContentSource>;

function finance(sources: ContentSource[]): ContentReview {
  return { reviewedAt: REVIEWED_AT, disclaimer: FINANCE_DISCLAIMER, sources };
}


const TOOL_REVIEWS: Record<string, ContentReview> = {
  "/tools/calc/salary": finance([
    SOURCES.pension2026,
    SOURCES.healthInsurance2026,
    SOURCES.earnedIncomeTax,
  ]),
  "/tools/calc/wage": finance([SOURCES.minimumWage2026]),
  "/tools/calc/severance": finance([SOURCES.retirementBenefitAct]),
};

const BLOG_REVIEWS: Record<string, ContentReview> = {
  "salary-net-pay-guide": TOOL_REVIEWS["/tools/calc/salary"],
  "weekly-holiday-pay-guide": TOOL_REVIEWS["/tools/calc/wage"],
  "severance-pay-guide": TOOL_REVIEWS["/tools/calc/severance"],
};

export function getToolReview(href?: string): ContentReview | undefined {
  return href ? TOOL_REVIEWS[href] : undefined;
}

export function getBlogReview(slug: string): ContentReview | undefined {
  return BLOG_REVIEWS[slug];
}
