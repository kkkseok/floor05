import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import MergeTool from "@/components/image/MergeTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/merge`;

export const metadata: Metadata = {
  title: "사진 합치기 - 여러 장을 세로·가로로 이어붙이기",
  description:
    "여러 사진을 세로·가로로 한 장에 이어붙입니다. 카카오톡 캡처 합치기, 크기 다른 사진 정렬까지 무료로. 대화 캡처처럼 사적인 이미지도 기기 밖으로 나가지 않습니다.",
  keywords: [
    "사진 합치기",
    "이미지 합치기",
    "캡처 합치기",
    "사진 여러장 한장으로",
    "사진 세로로 합치기",
    "카톡 캡처 합치기",
  ],
  openGraph: {
    title: "사진 합치기 - 여러 장을 세로·가로로 이어붙이기",
    description: "여러 사진을 세로·가로로 한 장에. 캡처 이어붙이기도 기기 안에서 끝납니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사진 합치기 - 여러 장을 세로·가로로 이어붙이기",
    description: "카톡 캡처를 길게 이어붙여도 대화 내용은 기기 안에만 있습니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "합치기를 눌렀더니 결과가 너무 길다는 안내가 뜹니다. 왜 그런가요?",
    answer:
      "합친 이미지의 긴 변이 65,535px를 넘으면 저장할 수 없어서 시작하기 전에 멈춥니다. JPG 형식이 한 변에 담을 수 있는 최대값이 그 숫자입니다. 두 묶음으로 나눠 합치거나 이미지 리사이즈로 폭을 먼저 줄이면 됩니다. '너비 맞추기'에서는 좁은 이미지가 가장 넓은 이미지에 맞춰 커지면서 길이도 함께 늘어나니, 유난히 넓은 한 장이 섞여 있지 않은지도 확인하세요.",
  },
  {
    question: "한 번에 몇 장까지 합칠 수 있나요?",
    answer:
      "데스크톱에서는 최대 10장, 모바일에서는 최대 5장까지 합칠 수 있습니다. 파일당 최대 50MB까지 지원합니다.",
  },
  {
    question: "세로와 가로 둘 다 되나요?",
    answer:
      "네. '세로로 합치기'는 위에서 아래로 길게 이어붙이고, '가로로 합치기'는 좌우로 나란히 붙입니다. 캡처를 길게 이어붙일 때는 세로를 사용하세요.",
  },
  {
    question: "크기가 다른 사진도 깔끔하게 합쳐지나요?",
    answer:
      "'너비(높이) 맞추기'를 켜면 모든 사진을 같은 폭으로 정렬해 비율을 지킨 채 잇습니다. 반대로 '원본 크기 유지'는 각 사진을 손대지 않고, 폭이 짧은 쪽 옆의 빈자리를 배경색으로 메웁니다.",
  },
  {
    question: "긴 카톡 대화를 스크롤 캡처처럼 한 장으로 만들 수 있나요?",
    answer:
      "네. 나눠 찍은 캡처를 순서대로 추가하고 '세로로 합치기'에 '너비 맞추기'를 함께 켜면, 끊긴 데 없이 세로로 쭉 이어진 한 장이 됩니다. 순서가 틀렸으면 목록의 위/아래 버튼으로 바꾸면 됩니다.",
  },
  {
    question: "합치는 순서는 어떻게 바꾸나요?",
    answer:
      "이미지 목록에서 각 항목의 위/아래 화살표 버튼으로 순서를 바꿀 수 있습니다. 목록에 보이는 순서 그대로 합쳐집니다.",
  },
];

const guide = {
  intro:
    "여러 장의 이미지를 세로나 가로로 이어 한 장으로 저장합니다. 2장부터 합칠 수 있고, 목록에 놓인 순서가 곧 이어지는 순서입니다. 나눠 찍은 대화 캡처를 한 장으로 잇거나 전후 사진을 나란히 놓을 때 씁니다.",
  sections: [
    {
      heading: "세로와 가로, 언제 무엇을 쓰나",
      paragraphs: [
        "세로로 합치기는 위에서 아래로 쌓습니다. 대화 캡처나 긴 웹페이지처럼 내려 읽는 내용에 맞습니다. 가로로 합치기는 왼쪽에서 오른쪽으로 붙이므로 전후 비교나 두세 컷을 한 줄로 보여 줄 때 씁니다.",
        "순서를 잘못 넣었어도 다시 올릴 필요는 없습니다. 목록의 위·아래 버튼으로 자리를 바꾸면 됩니다. 순서나 옵션을 바꾸면 앞서 만든 결과는 지워지므로 합치기를 한 번 더 눌러야 합니다.",
      ],
    },
    {
      heading: "크기가 다른 이미지를 섞을 때",
      paragraphs: [
        "'너비 맞추기'(가로 방향에서는 '높이 맞추기')는 가장 넓은 이미지에 나머지를 맞춥니다. 넓은 쪽을 줄이는 것이 아니라 좁은 쪽을 키운다는 점을 알아 둬야 합니다. 1920px 사진 아래 1080px 캡처를 붙여 보니 캡처가 1.78배로 커져 결과가 1920×5659, 1.25MB였습니다. 같은 두 장을 '원본 크기 유지'로 합치면 1920×3839, 1.08MB였습니다.",
        "'원본 크기 유지'는 이미지를 건드리지 않고 가운데에 놓은 뒤 남는 자리를 배경색으로 채웁니다. 폭이 비슷한 캡처끼리는 맞추기가 깔끔하고, 사진과 캡처처럼 폭 차이가 크면 유지 쪽이 가볍습니다. 키워진 이미지는 픽셀 수만 늘 뿐 더 선명해지지 않습니다.",
      ],
      bullets: [
        "이미지 간격: 0~100px. 캡처를 이음새 없이 이으려면 0으로 둡니다",
        "배경색: 간격과 빈자리에 칠해지는 색입니다",
        "투명 배경은 PNG로 저장하면서 크기를 맞추고 간격을 0으로 둘 때만 남습니다",
      ],
    },
    {
      heading: "PNG와 JPG, 저장 형식 고르기",
      paragraphs: [
        "올린 이미지가 전부 PNG면 저장 형식이 PNG로, 다른 형식이 한 장이라도 섞이면 JPG로 미리 맞춰집니다. 직접 고른 뒤에는 고른 형식이 유지됩니다. 휴대폰 캡처 5장을 합쳐 보니 크롬에서 PNG 1.32MB, JPG 1.14MB로 PNG가 15% 컸습니다. 그 정도 차이라면 글자 주변이 뭉개지지 않는 PNG가 낫습니다. 카메라 사진이 섞인 합본은 PNG로 저장하면 용량이 크게 늘 수 있어 JPG가 무난합니다. JPG 품질은 92%가 기본이고 슬라이더로 바꿀 수 있습니다.",
      ],
    },
    {
      heading: "얼마나 길게 이을 수 있나",
      paragraphs: [
        "한 번에 올릴 수 있는 장수는 데스크톱 10장, 모바일 5장이고 파일 하나는 50MB까지입니다. 장수보다 먼저 걸릴 수 있는 것이 결과의 길이입니다. 합친 이미지의 긴 변이 65,535px를 넘으면 합치기를 시작하지 않고 안내를 띄웁니다. 1080×2340 캡처를 세로로 쌓는 실험에서는 크롬에서 28장, 65,520px까지 저장됐습니다. 보통 캡처 10장은 여기에 닿지 않지만, 길게 스크롤해 찍은 캡처를 여러 장 이으면 닿을 수 있습니다. 그때는 두 묶음으로 나눠 합치면 됩니다.",
      ],
    },
  ],
};

const workflowCTA = {
  message: "합치기 끝났나요? 이런 작업도 할 수 있어요.",
  tools: [
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "용량도 줄여보세요",
    },
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "크기 조절하기",
    },
    {
      name: "이미지 크롭",
      href: "/tools/image/crop",
      description: "원하는 부분만 자르기",
    },
  ],
};

// Schema.org Markup
const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 합치기 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description:
      "여러 사진을 세로·가로로 한 장에 이어붙이는 무료 도구. 캡처 합치기도 기기 안에서 끝납니다.",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  },
];

export default function MergePage() {
  return (
    <ToolLayout
      title="사진 합치기"
      description="여러 사진을 세로·가로로 한 장에. 캡처 이어붙이기까지."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/merge"
      relatedPostSlugs={["image-merge-guide", "youtube-thumbnail-size"]}
      schemas={schemas}
    >
      <MergeTool />
    </ToolLayout>
  );
}
