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

const HEALTH_DISCLAIMER =
  "일반적인 공식에 따른 참고용 추정치이며 의학적 진단·치료·피임 판단을 대신하지 않습니다. 증상이나 개인별 위험이 있다면 의료진과 상담하세요.";

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
  vatAct: {
    title: "부가가치세법 제30조(세율)",
    publisher: "국가법령정보센터",
    url: "https://www.law.go.kr/LSW/lsLinkCommonInfo.do?lsJoLnkSeq=1031738829",
  },
  interestTax: {
    title: "이자소득 원천징수 세율 안내",
    publisher: "국세청",
    url: "https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?cntntsId=7703&mi=2297",
  },
  financialProducts: {
    title: "금융상품 한눈에",
    publisher: "금융감독원",
    url: "https://finlife.fss.or.kr/finlife/main/main.do",
  },
  obesityGuideline: {
    title: "비만 진료지침 2022 요약본",
    publisher: "대한비만학회",
    url: "https://general.kosso.or.kr/html/user/core/view/reaction/main/kosso/inc/data/guideline2022_vol8.pdf",
  },
  mifflin: {
    title: "Mifflin–St Jeor 휴식대사량 추정식 원문",
    publisher: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov/2305711/",
  },
  fertileWindow: {
    title: "Fertility Awareness-Based Methods of Family Planning",
    publisher: "American College of Obstetricians and Gynecologists",
    url: "https://www.acog.org/womens-health/faqs/fertility-awareness-based-methods-of-family-planning",
  },
  dueDate: {
    title: "Methods for Estimating the Due Date",
    publisher: "American College of Obstetricians and Gynecologists",
    url: "https://www.acog.org/clinical/clinical-guidance/committee-opinion/articles/2017/05/methods-for-estimating-the-due-date",
  },
} satisfies Record<string, ContentSource>;

function finance(sources: ContentSource[]): ContentReview {
  return { reviewedAt: REVIEWED_AT, disclaimer: FINANCE_DISCLAIMER, sources };
}

function health(sources: ContentSource[]): ContentReview {
  return { reviewedAt: REVIEWED_AT, disclaimer: HEALTH_DISCLAIMER, sources };
}

const TOOL_REVIEWS: Record<string, ContentReview> = {
  "/tools/calc/salary": finance([
    SOURCES.pension2026,
    SOURCES.healthInsurance2026,
    SOURCES.earnedIncomeTax,
  ]),
  "/tools/calc/wage": finance([SOURCES.minimumWage2026]),
  "/tools/calc/severance": finance([SOURCES.retirementBenefitAct]),
  "/tools/calc/vat": finance([SOURCES.vatAct]),
  "/tools/calc/savings": finance([SOURCES.interestTax, SOURCES.financialProducts]),
  "/tools/calc/loan": finance([SOURCES.financialProducts]),
  "/tools/health/bmi": health([SOURCES.obesityGuideline]),
  "/tools/health/bmr": health([SOURCES.mifflin]),
  "/tools/health/ovulation": health([SOURCES.fertileWindow]),
  "/tools/health/pregnancy": health([SOURCES.dueDate]),
};

const BLOG_REVIEWS: Record<string, ContentReview> = {
  "salary-net-pay-guide": TOOL_REVIEWS["/tools/calc/salary"],
  "weekly-holiday-pay-guide": TOOL_REVIEWS["/tools/calc/wage"],
  "severance-pay-guide": TOOL_REVIEWS["/tools/calc/severance"],
  "vat-calculation-guide": TOOL_REVIEWS["/tools/calc/vat"],
  "savings-interest-guide": TOOL_REVIEWS["/tools/calc/savings"],
  "loan-interest-guide": TOOL_REVIEWS["/tools/calc/loan"],
  "bmi-obesity-guide": TOOL_REVIEWS["/tools/health/bmi"],
  "ovulation-calculation-guide": TOOL_REVIEWS["/tools/health/ovulation"],
};

export function getToolReview(href?: string): ContentReview | undefined {
  return href ? TOOL_REVIEWS[href] : undefined;
}

export function getBlogReview(slug: string): ContentReview | undefined {
  return BLOG_REVIEWS[slug];
}
