import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import GridTool from "@/components/image/GridTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/grid`;

export const metadata: Metadata = {
  title: "인스타 9분할 - 사진 3×3 그리드 나누기",
  description:
    "한 장의 사진을 3×3 등으로 나눠 ZIP으로 받습니다. 인스타그램 그리드 피드 만들기. 업로드 순서 번호까지 붙여드리니 올리기만 하면 됩니다.",
  keywords: [
    "인스타 9분할",
    "인스타그램 그리드",
    "사진 분할",
    "이미지 분할",
    "9분할 사진",
    "인스타 피드 그리드",
    "사진 3x3 나누기",
  ],
  openGraph: {
    title: "인스타 9분할 - 사진 3×3 그리드 나누기",
    description: "한 장을 3×3으로 나눠 ZIP으로. 인스타 그리드 피드 만들기.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "인스타 9분할 - 사진 3×3 그리드 나누기",
    description: "한 장을 3×3으로 나눠 ZIP으로 다운로드.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "인스타그램 프로필을 큰 사진 하나처럼 꾸미려면, 한 장을 여러 칸으로 나눠 순서대로 올려야 합니다. 이 도구는 사진을 3×3 등으로 잘라 ZIP으로 한 번에 받게 해줍니다.",
  sections: [
    {
      heading: "인스타 9분할 만드는 법",
      paragraphs: [
        "사진을 올리고 '3×3 (인스타 9분할)'을 고르면, 정사각형으로 중앙을 잘라 9칸으로 나눕니다. 분할된 이미지는 왼쪽 위부터 번호 순서로 ZIP에 담깁니다. 인스타그램에는 마지막 번호부터 거꾸로 올려야 프로필에서 한 장처럼 이어지는데, 이유는 아래에 따로 적었습니다.",
        "가로 3분할, 세로 3분할, 2×2도 지원합니다. 파노라마 사진을 가로로 나눠 올리거나, 긴 이미지를 세로로 쪼갤 때도 쓸 수 있습니다.",
      ],
    },
    {
      heading: "올리는 순서가 전부입니다",
      paragraphs: [
        "9분할에서 가장 많이 하는 실수가 업로드 순서입니다. 인스타그램 프로필 그리드는 최신 게시물이 왼쪽 위로 오기 때문에, 완성 그림 기준 '오른쪽 아래 조각(9번)'을 가장 먼저 올리고 '왼쪽 위 조각(1번)'을 마지막에 올려야 합니다. 즉 ZIP 안의 번호를 9→8→7→…→1 역순으로 올리면 됩니다.",
        "중간에 다른 게시물이 끼어들면 그리드가 한 칸씩 밀려 그림이 어긋납니다. 9장을 올리는 동안에는 다른 게시물을 올리지 말고, 이후에도 새 게시물은 3장 단위로 올려야 줄이 유지됩니다. 이게 번거롭다면 처음부터 가로 3분할(한 줄짜리)로 만드는 것도 방법입니다.",
      ],
    },
    {
      heading: "어떤 사진이 9분할에 어울리나",
      paragraphs: [
        "9칸으로 나뉘어도 한눈에 읽히려면 피사체가 크고 배경이 단순한 사진이 좋습니다. 인물 단체 사진처럼 작은 얼굴이 많은 사진은 칸 경계에 얼굴이 걸려 어색해지기 쉽습니다. 분할 전에 미리보기에서 경계선이 피사체의 어디를 지나는지 확인하세요.",
      ],
      bullets: [
        "로고·타이포그래피 중심의 브랜드 공지 이미지",
        "풍경·건축처럼 면이 큰 사진",
        "신제품·메뉴판 등 한 판으로 보여주고 싶은 홍보물",
        "파노라마 사진은 가로 3분할로 밀어서 올리기",
      ],
    },
  ],
};

const faqs = [
  {
    question: "인스타 9분할은 어떻게 올리나요?",
    answer:
      "ZIP 안의 번호는 완성 그림의 왼쪽 위부터 붙어 있습니다. 인스타그램 프로필은 최신 게시물이 왼쪽 위에 오므로 9번부터 1번까지 거꾸로 올리면 한 장처럼 이어집니다.",
  },
  {
    question: "정사각형으로 잘리나요?",
    answer:
      "3×3과 2×2는 정사각형으로 중앙을 잘라 각 칸이 정사각형이 되게 합니다. 가로·세로 3분할은 원본 비율을 유지합니다.",
  },
  {
    question: "몇 번 조각부터 올려야 하나요?",
    answer:
      "인스타그램은 최신 게시물이 왼쪽 위로 오므로, 마지막 번호(3×3이면 9번)부터 역순으로 올려야 프로필에서 그림이 맞춰집니다. 1번을 가장 마지막에 올리면 완성입니다.",
  },
  {
    question: "분할하면 화질이 떨어지나요?",
    answer:
      "원본에서 각 칸을 그대로 오려내는 방식이라 화질 손실이 없습니다. 다만 원본이 작으면 칸 하나가 인스타그램 권장 크기(1080px)보다 작아질 수 있으니, 3×3 분할에는 가로 3240px 이상의 사진을 권합니다.",
  },
  {
    question: "9분할한 사진이 서버에 올라가나요?",
    answer:
      "아니요. 자르기와 ZIP 묶기까지 전부 브라우저 안에서 끝납니다. 인스타그램에 올리기 전의 사진이 floor05 서버를 거치는 일은 없습니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "인스타 9분할",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "한 장의 사진을 3×3 등으로 나눠 ZIP으로 받는 무료 도구. 인스타 올리기 전 사진이 기기를 벗어나지 않습니다.",
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
  message: "그리드에 올릴 사진, 마저 다듬어보세요.",
  tools: [
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "인스타 권장 크기로 맞추기",
    },
    {
      name: "이미지 크롭",
      href: "/tools/image/crop",
      description: "분할 전에 구도 정리",
    },
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "업로드 빠르게, 용량 줄이기",
    },
  ],
};

export default function GridPage() {
  return (
    <ToolLayout
      title="인스타 9분할"
      description="한 장을 3×3으로 나눠 ZIP으로. 인스타 그리드 피드 만들기."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/grid"
      relatedPostSlugs={["instagram-image-size", "image-crop-guide"]}
      schemas={schemas}
    >
      <GridTool />
    </ToolLayout>
  );
}
