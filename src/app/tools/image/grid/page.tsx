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
    "사진 한 장을 여러 칸으로 잘라 칸마다 따로 저장하고, 그 파일들을 ZIP 하나로 내려받는 도구입니다. 나누는 방식은 3×3, 2×2, 가로 3분할, 세로 3분할 네 가지입니다. 인스타그램 프로필 격자에 큰 그림 하나를 걸 때 주로 쓰고, 파노라마를 세 장으로 나눠 넘겨 보는 게시물을 만들 때도 씁니다.",
  sections: [
    {
      heading: "네 가지 분할 방식과 잘리는 범위",
      paragraphs: [
        "3×3과 2×2는 먼저 사진 가운데를 정사각형으로 잘라낸 다음 칸을 나눕니다. 정사각형의 한 변은 사진의 짧은 변과 같습니다. 가로로 긴 사진이면 좌우 끝이, 세로로 긴 사진이면 위아래 끝이 같은 폭으로 빠집니다. 잘라낼 위치를 옮기는 기능은 없으니, 피사체가 한쪽에 치우친 사진은 이미지 크롭에서 원하는 정사각형으로 먼저 잘라 온 뒤 나누는 편이 안전합니다.",
        "가로 3분할과 세로 3분할은 아무것도 잘라내지 않고 사진 전체를 3등분합니다. 그래서 조각의 비율은 원본에 따라 달라집니다. 화면에는 나눌 선이 그어진 미리보기가 뜨므로, 선이 얼굴이나 글자 위를 지나가는지 내려받기 전에 볼 수 있습니다.",
      ],
    },
    {
      heading: "조각 크기와 저장 형식",
      paragraphs: [
        "조각은 원본 픽셀을 그대로 오려 낸 것이라 확대도 축소도 하지 않습니다. 3000×4000 사진을 3×3으로 나누면 가운데 3000×3000이 쓰이고 조각 하나는 1000×1000이 됩니다. 조각이 작을 것 같으면 나누기 전에 더 큰 원본을 구하는 것이 맞습니다. 나눈 뒤에 키우면 흐려질 뿐입니다.",
        "저장 형식은 올린 파일을 따라갑니다. PNG는 PNG로, WebP는 WebP로, 그 밖의 사진은 JPG로 저장합니다. JPG와 WebP는 품질 92%로 다시 인코딩하고 PNG는 손실 없이 저장합니다.",
      ],
      bullets: [
        "파일 이름: 원본이름_01부터 차례로 붙습니다 (3×3이면 _09까지)",
        "번호 순서: 왼쪽 위에서 오른쪽으로, 한 줄이 끝나면 아랫줄로 넘어갑니다",
        "한 번에 한 장만 올릴 수 있고 JPG·PNG·WebP를 받습니다",
      ],
    },
    {
      heading: "올리는 순서가 전부입니다",
      paragraphs: [
        "9분할에서 가장 많이 하는 실수가 업로드 순서입니다. 인스타그램 프로필 격자는 최신 게시물이 왼쪽 위로 오기 때문에, 완성 그림 기준 오른쪽 아래 조각(9번)을 가장 먼저 올리고 왼쪽 위 조각(1번)을 마지막에 올려야 합니다. ZIP 안의 번호를 9번부터 1번까지 거꾸로 올리면 됩니다.",
        "중간에 다른 게시물이 끼어들면 격자가 한 칸씩 밀려 그림이 어긋납니다. 9장을 올리는 동안에는 다른 게시물을 올리지 말고, 이후에도 새 게시물은 3장 단위로 올려야 줄이 유지됩니다. 프로필 격자가 썸네일을 어떤 비율로 잘라 보여 주는지는 앱이 정하는 것이라, 9장을 다 올리기 전에 한두 장으로 먼저 이어지는 모양을 확인해 두세요.",
      ],
    },
    {
      heading: "어떤 사진이 9분할에 어울리나",
      paragraphs: [
        "9칸으로 나뉘어도 한눈에 읽히려면 피사체가 크고 배경이 단순한 사진이 좋습니다. 단체 사진처럼 작은 얼굴이 많으면 칸 경계에 얼굴이 걸리기 쉽습니다. 로고나 큰 글자가 중심인 공지 이미지, 풍경이나 건축처럼 면이 큰 사진이 잘 맞고, 옆으로 긴 파노라마는 9분할보다 가로 3분할이 어울립니다.",
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
      "칸을 오려내도 해상도는 줄지 않지만, JPG 사진은 조각마다 품질 92%로 다시 저장해 아주 약간의 압축 손실이 생깁니다(PNG는 무손실). 다만 3×3으로 나누면 칸 하나의 한 변이 원본의 3분의 1이 됩니다. 원본이 작으면 조각이 흐려 보일 수 있으니 되도록 큰 사진으로 시작하세요.",
  },
  {
    question: "투명 배경 PNG 로고도 나눌 수 있나요?",
    answer:
      "네. PNG를 올리면 조각도 PNG로 저장해 투명한 부분이 그대로 남습니다. 형식을 따로 고르는 옵션은 없어서 WebP는 WebP, 그 밖의 사진은 JPG 조각이 됩니다. 다른 형식이 필요하면 나눈 뒤 포맷 변환 도구로 바꾸세요.",
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
      relatedPostSlugs={["sns-image-size", "image-crop-guide"]}
      schemas={schemas}
    >
      <GridTool />
    </ToolLayout>
  );
}
