import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ColorPickerTool from "@/components/image/ColorPickerTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/color-picker`;

export const metadata: Metadata = {
  title: "이미지 색상 추출 - 사진에서 HEX 코드 뽑기",
  description:
    "사진을 클릭해 그 지점의 색을 추출하고, 이미지의 대표 색 팔레트와 HEX 코드를 뽑습니다. 포토샵 스포이드가 필요했던 일을 브라우저에서 클릭 한 번으로.",
  keywords: [
    "이미지 색상 추출",
    "사진 색상 코드",
    "스포이드",
    "hex 추출",
    "이미지 컬러 추출",
    "사진 색 추출",
    "컬러 팔레트 추출",
  ],
  openGraph: {
    title: "이미지 색상 추출 - 사진에서 HEX 코드 뽑기",
    description: "클릭한 지점의 색과 대표 팔레트를 HEX로. 사진은 올리지 않고 화면에서 바로 읽습니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 색상 추출 - 사진에서 HEX 코드 뽑기",
    description: "사진을 클릭해 색을 추출하고 대표 팔레트를 뽑기.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "마음에 드는 색이 담긴 사진에서 그 색의 코드를 알고 싶을 때가 있습니다. 이 도구는 사진을 클릭하면 그 지점의 색을 HEX·RGB로 알려주고, 이미지 전체의 대표 색 팔레트도 함께 뽑아줍니다.",
  sections: [
    {
      heading: "색 추출과 팔레트",
      paragraphs: [
        "사진을 올리면 자동으로 대표 색 6가지를 팔레트로 보여줍니다. 이미지에서 가장 많이 쓰인 색들이라, 디자인의 색 조합을 참고하기 좋습니다. 팔레트의 색을 누르면 HEX 코드가 복사됩니다.",
        "특정 지점의 색이 궁금하면 사진의 그 부분을 클릭하세요. 클릭한 픽셀의 정확한 색이 HEX와 RGB로 표시되고, 복사 버튼으로 바로 가져올 수 있습니다.",
      ],
    },
    {
      heading: "클릭한 색이 눈으로 본 색과 다르게 나올 때",
      paragraphs: [
        "사진 속 색은 생각보다 균일하지 않습니다. 파란 하늘도 픽셀 단위로 보면 수십 가지 파랑이 섞여 있고, JPG 압축 노이즈까지 더해져 바로 옆 픽셀끼리도 값이 다릅니다. 클릭할 때마다 코드가 조금씩 다르게 나온다면 그 때문입니다. 단색 영역이라면 가장자리보다 한가운데를 클릭하는 편이 의도한 색에 가깝습니다.",
        "조명도 변수입니다. 같은 제품 사진이라도 촬영 조명에 따라 실제 브랜드 컬러보다 노랗거나 파랗게 기록됩니다. 사진에서 뽑은 색은 '그 사진 안에서의 색'이라는 점을 감안하고, 정확한 브랜드 컬러가 필요하면 공식 가이드라인의 코드와 비교해 보정하는 것이 안전합니다.",
      ],
    },
    {
      heading: "뽑은 색, 이렇게 써먹습니다",
      paragraphs: [
        "추출한 HEX 코드는 CSS·피그마·파워포인트 어디든 붙여넣어 쓸 수 있습니다. 대표 팔레트는 색 조합의 출발점으로 쓰기 좋습니다. 좋아하는 영화 포스터나 브랜드 화보에서 팔레트를 뽑아 보면, 잘 만든 색 조합이 어떤 비율로 구성되는지도 보입니다.",
      ],
      bullets: [
        "블로그·발표자료의 포인트 컬러를 사진 분위기에 맞추기",
        "쇼핑몰 상세페이지 배경색을 제품 사진에서 뽑기",
        "웹 디자인에서 참고 이미지의 색 조합 분석하기",
        "뽑은 색의 글자 가독성은 색상 대비 검사 도구로 확인하기",
      ],
    },
  ],
};

const faqs = [
  {
    question: "사진에서 특정 색의 코드를 어떻게 아나요?",
    answer:
      "사진의 원하는 지점을 클릭하면 그 픽셀의 색이 HEX와 RGB로 표시됩니다. 복사 버튼으로 바로 가져올 수 있습니다.",
  },
  {
    question: "대표 색 팔레트는 어떻게 만들어지나요?",
    answer:
      "이미지에서 가장 많이 쓰인 색을 빈도순으로 묶어 6가지를 보여줍니다. 디자인 색 조합 참고에 좋습니다.",
  },
  {
    question: "추출한 색을 다른 형식으로 바꿀 수 있나요?",
    answer:
      "클릭한 색은 HEX와 RGB로 함께 표시되니 필요한 형식을 골라 복사하면 됩니다. HSL·CMYK가 필요하면 피그마나 포토샵 색상 선택창에 HEX를 붙여넣으세요. 나머지 값은 그쪽에서 자동으로 환산해 줍니다.",
  },
  {
    question: "클릭할 때마다 색 코드가 조금씩 다르게 나와요.",
    answer:
      "사진은 압축 노이즈 때문에 바로 옆 픽셀끼리도 색값이 미세하게 다릅니다. 단색처럼 보이는 영역이라도 한가운데를 클릭하는 것이 의도한 색에 가장 가깝습니다.",
  },
  {
    question: "색을 뽑을 사진도 어딘가로 전송되나요?",
    answer:
      "아니요. 색 추출은 브라우저가 이미지의 픽셀 값을 읽는 것만으로 끝나는 작업이라, 사진을 어딘가로 보낼 이유가 없습니다. 유출이 걱정되는 시안·화보에서도 마음 놓고 색을 뽑으세요.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 색상 추출",
    applicationCategory: "DesignApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "사진을 클릭해 색을 추출하고 대표 색 팔레트와 HEX 코드를 뽑는 무료 도구. 픽셀 값은 브라우저 안에서만 읽습니다.",
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

const workflowCTA = {
  message: "색을 뽑았다면, 다음은 이런 작업입니다.",
  tools: [
    {
      name: "워터마크 넣기",
      href: "/tools/image/watermark",
      description: "뽑은 브랜드 색으로 로고·문구 얹기",
    },
    {
      name: "파비콘 만들기",
      href: "/tools/image/favicon",
      description: "같은 색감으로 사이트 아이콘까지",
    },
    {
      name: "이미지 합치기",
      href: "/tools/image/merge",
      description: "팔레트와 원본을 한 장에 나란히",
    },
  ],
};

export default function ColorPickerPage() {
  return (
    <ToolLayout
      title="이미지 색상 추출"
      description="사진을 클릭해 색을. 대표 색 팔레트와 HEX 코드까지, 클릭 한 번 복사."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/color-picker"
      schemas={schemas}
    >
      <ColorPickerTool />
    </ToolLayout>
  );
}
