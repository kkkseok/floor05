import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ResizeTool from "@/components/image/ResizeTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/resize`;

export const metadata: Metadata = {
  title: "이미지 리사이즈 - SNS 프리셋으로 한 번에",
  description:
    "인스타그램, 유튜브, 네이버 블로그, 카카오톡, 당근마켓 최적 사이즈로 바로 변환. 업로드 과정이 없어 프리셋을 고르면 그 자리에서 결과가 나옵니다.",
  keywords: ["이미지 리사이즈", "사진 크기 조절", "인스타그램 사진 크기", "유튜브 썸네일", "네이버 블로그 이미지"],
  openGraph: {
    title: "이미지 리사이즈 - SNS 프리셋으로 한 번에",
    description: "인스타그램, 유튜브, 네이버 블로그 최적 사이즈로 바로 변환.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 리사이즈 - SNS 프리셋으로 한 번에",
    description: "SNS마다 다른 권장 크기, 프리셋 하나 고르면 끝.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "SNS 프리셋은 어떤 게 있나요?",
    answer:
      "인스타그램(정방형, 세로형, 가로형), 유튜브(썸네일, 채널아트), 네이버 블로그, 카카오톡 프로필, 당근마켓 상품 이미지 등 다양한 프리셋을 지원합니다.",
  },
  {
    question: "비율을 유지하면서 크기를 바꿀 수 있나요?",
    answer:
      "네, '직접 입력' 모드에서 잠금 버튼을 클릭하면 가로세로 비율이 유지됩니다. 너비나 높이 중 하나만 입력해도 자동으로 계산됩니다.",
  },
  {
    question: "확대도 가능한가요?",
    answer:
      "네, '비율(%)' 모드에서 100% 이상으로 설정하면 이미지를 확대할 수 있습니다. 단, 원본보다 크게 확대하면 화질이 저하될 수 있습니다.",
  },
  {
    question: "여러 이미지를 같은 크기로 한 번에 변경할 수 있나요?",
    answer:
      "네. 여러 장을 올리고 크기를 정해 한 번에 줄일 수 있습니다. 비율 잠금을 켜면 사진마다 비율을 지키며 그 너비·높이 안에 맞추므로 세로 사진과 가로 사진의 결과 크기는 서로 다릅니다. 모두 똑같은 크기가 필요하면 SNS 프리셋을 쓰세요. 가운데를 기준으로 잘라 정확히 그 크기로 맞춥니다.",
  },
  {
    question: "리사이즈하면 화질이 떨어지나요?",
    answer:
      "크기를 줄일 때는 고품질 보간을 적용해 선명도를 최대한 유지합니다. 반대로 원본보다 크게 확대하면 픽셀이 늘어나 흐려질 수 있으므로, 큰 출력이 필요하다면 처음부터 해상도가 높은 원본을 사용하세요.",
  },
  {
    question: "리사이즈한 이미지는 어떤 형식으로 저장되나요?",
    answer:
      "원본 형식을 따릅니다. PNG는 PNG로(투명 배경 유지), WebP는 WebP로, 그 밖의 사진은 JPG로 저장됩니다. 다른 형식이 필요하면 '포맷 변환' 도구를 함께 쓰세요.",
  },
];

const guide = {
  intro:
    "사진은 멀쩡한데 올리는 곳마다 요구하는 크기가 다른 게 문제입니다. 인스타그램은 정방형, 유튜브 썸네일은 가로형, 네이버 블로그는 너비만 맞추면 되죠. 이 도구는 픽셀 직접 입력, 퍼센트 조절, SNS 프리셋 세 가지 방식으로 이미지 크기를 한 번에 맞춰줍니다.",
  sections: [
    {
      heading: "리사이즈와 압축은 다릅니다",
      paragraphs: [
        "리사이즈는 이미지의 가로·세로 픽셀 수(해상도)를 바꾸는 작업이고, 압축은 화질을 약간 희생해 파일 용량(KB·MB)을 줄이는 작업입니다. 4000×3000 사진을 1080×810으로 줄이면 픽셀 수가 줄어드는 만큼 용량도 함께 가벼워지지만, 목적이 다릅니다.",
        "업로드 규격에 맞춰 '크기'를 맞추고 싶다면 리사이즈, 크기는 그대로 두고 '용량'만 줄이고 싶다면 압축을 쓰세요. 둘 다 필요하면 여기서 리사이즈한 뒤 압축 도구로 넘어가면 됩니다.",
      ],
    },
    {
      heading: "용도별 권장 픽셀",
      paragraphs: [
        "SNS 프리셋을 고르면 아래 권장 규격이 자동으로 적용됩니다. 직접 입력 모드를 쓸 때 참고하셔도 좋습니다.",
      ],
      bullets: [
        "인스타그램 피드: 정방형 1080×1080, 세로형 1080×1350, 가로형 1080×566",
        "유튜브 썸네일 1280×720, 채널 아트 2560×1440",
        "네이버 블로그: 너비 860px (높이는 비율대로 자동 계산)",
        "카카오톡 프로필 640×640, 당근마켓 상품 이미지 960×960",
      ],
    },
    {
      heading: "증명사진 픽셀 규격도 용도마다 다릅니다",
      paragraphs: [
        "SNS 이미지처럼 증명사진도 제출처마다 요구 픽셀이 제각각입니다. 토익은 115×150px로 작고 여권은 413×531px로 그보다 큰 식이라, 한 크기로 만들어 두면 어딘가에서는 규격이 어긋납니다. 리사이즈로 목표 픽셀에 맞춰 두면 접수 화면의 크기 검사를 통과하기 쉽습니다.",
        "아래 표는 자주 찾는 한국 증명사진의 픽셀 규격을 작은 쪽부터 정리한 것입니다. 취업 사이트처럼 크기를 따로 두지 않는 곳은 '자유'로 적었습니다. 값은 각 기관 안내 기준이고 변경될 수 있으니, 제출 직전에는 해당 기관 공지를 확인하는 편이 안전합니다.",
      ],
      table: {
        headers: ["용도", "픽셀 규격", "형식", "출처(기관)"],
        rows: [
          ["토익 응시원서", "115×150px", "JPG", "YBM(toeic.co.kr)"],
          ["공무원 원서접수", "137×177px", "JPG", "사이버국가고시(gosi.kr)"],
          ["운전면허 신청", "350×450px", "JPG", "도로교통공단(koroad)"],
          ["여권 신청", "413×531px", "JPG", "외교부(passport.go.kr)"],
          ["잡코리아 이력서", "자유", "JPG·PNG", "잡코리아(jobkorea)"],
          ["사람인 이력서", "자유", "JPG·PNG", "사람인(saramin)"],
        ],
        caption: "각 기관 원서·발급 안내의 권장 픽셀 기준. 접수처 사정에 따라 달라질 수 있습니다.",
      },
    },
    {
      heading: "규격에 맞추려 크기를 바꿔도 되나요",
      paragraphs: [
        "관공서 제출 사진은 포토샵이나 AI로 얼굴을 매끈하게 다듬거나 다른 이미지를 덧입히는 것을 금지하지만, 규격 픽셀에 맞추려고 크기를 조절하는 것까지 막지는 않습니다. 리사이즈는 사진 전체를 정해진 가로·세로 픽셀로 다시 그릴 뿐, 이목구비를 바꾸거나 없던 배경을 지어내지 않기 때문입니다.",
        "가령 137×177px나 350×450px 같은 접수 규격에 맞추는 일은 크기 조정이지 얼굴 가공이 아니라서, 보정 금지 안내와는 성격이 다릅니다. 그래도 각 기관이 세부 조건을 따로 두는 경우가 있으니, 규정에 맞는지는 접수 사이트 공지로 최종 확인해 주세요.",
      ],
    },
    {
      heading: "비율과 화질, 이것만 주의하세요",
      paragraphs: [
        "직접 입력 모드의 잠금 버튼을 켜면 가로세로 비율이 유지돼 사진이 찌그러지지 않습니다. 너비만 입력해도 높이가 자동으로 따라옵니다. 정방형 프리셋처럼 원본과 비율이 다른 규격에 맞출 때는 일부 영역이 잘릴 수 있으니, 인물이 가장자리에 치우친 사진은 미리 크롭으로 구도를 잡아두는 편이 안전합니다.",
        "퍼센트 모드에서는 100%를 넘겨 원본보다 크게 키울 수 있는데, 없던 픽셀을 만들어내는 확대는 사진을 흐릿하게 만듭니다. 큰 출력이 필요하면 처음부터 해상도 높은 원본을 쓰고, 의도치 않은 확대가 걱정되면 '원본보다 크게 키우지 않기'에 체크하세요. 참고로 크기 계산과 다시 그리기는 전부 브라우저 몫이라, 몇 장을 연달아 돌려도 사진이 기기 밖으로 나가지 않습니다.",
      ],
    },
  ],
};

const workflowCTA = {
  message: "크기 조절 끝났나요? 이런 작업도 할 수 있어요.",
  tools: [
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "용량도 줄여보세요",
    },
    {
      name: "포맷 변환",
      href: "/tools/image/convert",
      description: "PNG, WebP로 변환",
    },
    {
      name: "이미지 크롭",
      href: "/tools/image/crop",
      description: "원하는 부분만 자르기",
    },
  ],
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 리사이즈 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "SNS 프리셋으로 이미지 크기를 맞추는 무료 도구. 업로드 없이 그 자리에서 리사이즈됩니다.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  },
];

export default function ResizePage() {
  return (
    <ToolLayout
      title="이미지 리사이즈"
      description="SNS 프리셋으로 한 번에. 인스타, 유튜브, 네이버 블로그 최적 사이즈."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/resize"
      relatedPostSlugs={["instagram-image-size", "sns-image-size", "youtube-thumbnail-size"]}
      schemas={schemas}
    >
      <ResizeTool />
    </ToolLayout>
  );
}
