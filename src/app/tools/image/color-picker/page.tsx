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
    "사진을 올리면 대표 색 6가지를 팔레트로 보여주고, 사진을 클릭하면 그 지점의 색을 HEX와 RGB로 알려줍니다. 두 기능은 색을 구하는 방식이 달라서 같은 사진에서도 서로 다른 값이 나옵니다. 어느 쪽 값을 써야 하는지는 그 차이를 알면 정하기 쉽습니다.",
  sections: [
    {
      heading: "클릭한 색은 원본의 픽셀 하나입니다",
      paragraphs: [
        "사진을 클릭하면 원본 이미지에서 그 위치의 픽셀 하나를 읽습니다. 주변과 섞지 않은 값이라, 같은 하늘을 눌러도 누른 자리마다 코드가 조금씩 다릅니다. 사진에서는 한 가지 색으로 보이는 면도 픽셀마다 값이 다르고, JPG라면 압축하면서 생긴 얼룩이 더해집니다. 단색 면이라면 경계에서 떨어진 한가운데를 누르는 편이 의도한 색에 가깝습니다.",
        "화면의 미리보기는 가로 520px 이하로 줄여 보여줍니다. 원본이 그보다 훨씬 크면 화면의 한 점이 원본의 여러 픽셀에 해당해서, 가는 선이나 작은 글자의 색을 정확히 집기 어렵습니다. 확대 기능은 없습니다. 그럴 때는 이미지 크롭으로 필요한 부분만 잘라 올리면 원하는 픽셀을 누르기 쉬워집니다.",
      ],
    },
    {
      heading: "팔레트는 넓은 면적 순으로 6가지를 고릅니다",
      paragraphs: [
        "팔레트는 사진을 가로·세로 80px 이내로 줄인 다음 비슷한 색끼리 묶어, 픽셀 수가 많은 묶음부터 6개를 고릅니다. 묶는 기준은 빨강·초록·파랑 값을 각각 16단계로 나눈 칸이고, 화면에 표시되는 색은 그 묶음에 속한 픽셀의 평균입니다. 거의 투명한 픽셀은 계산에서 뺍니다.",
        "그래서 팔레트에는 넓게 깔린 색이 올라옵니다. 눈에 잘 띄는 색이라도 면적이 작으면 빠집니다. 흰 배경 위의 작은 빨간 로고라면 빨강이 6위 안에 들지 못할 수 있고, 하늘처럼 밝기가 서서히 변하는 면은 비슷한 파랑 여러 개가 자리를 차지합니다. 포인트 색은 직접 클릭해서 뽑으세요. 팔레트의 코드는 평균값이라 사진 속 어느 픽셀과도 정확히 같지 않을 수 있습니다.",
      ],
    },
    {
      heading: "값이 예상과 다를 때 확인할 것",
      bullets: [
        "투명 배경: 클릭한 색에는 투명도가 반영되지 않습니다. 완전히 투명한 곳을 누르면 #000000이 나오니 검정으로 오해하지 마세요.",
        "조명: 제품 사진의 색은 촬영 조명과 카메라 보정을 거친 값입니다. 정확한 브랜드 색이 필요하면 공식 가이드의 코드를 쓰고, 사진에서 뽑은 값은 참고용으로 둡니다.",
        "압축: 여러 번 다시 저장된 JPG는 색 경계가 번져 있을 수 있습니다. 가능하면 원본에 가까운 파일에서 뽑습니다.",
      ],
    },
    {
      heading: "복사되는 형식",
      paragraphs: [
        "클릭한 색은 #B8562A 같은 대문자 6자리 HEX와 rgb(184, 86, 42) 형식의 RGB 두 가지로 표시되고, 각각 복사 버튼이 있습니다. 팔레트 칸은 누르면 HEX가 복사됩니다. HSL이나 CMYK 값은 제공하지 않습니다. 사진은 JPG·PNG·WebP 한 장씩 올릴 수 있고, 다른 사진으로 바꾸면 팔레트도 새로 계산합니다.",
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
    question: "눈에 띄는 포인트 색이 팔레트에 안 나와요.",
    answer:
      "팔레트는 면적이 넓은 색부터 6가지를 고르기 때문입니다. 작은 로고나 버튼처럼 차지하는 면적이 좁은 색은 순위에서 밀립니다. 그 색은 사진에서 직접 클릭해 뽑으면 됩니다. 픽셀 값은 화면에 띄운 이미지에서 바로 읽으므로 공개 전 시안에서도 같은 방법을 쓸 수 있습니다.",
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
