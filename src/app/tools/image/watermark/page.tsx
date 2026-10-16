import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import WatermarkTool from "@/components/image/WatermarkTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/watermark`;

export const metadata: Metadata = {
  title: "사진 워터마크 넣기 - 텍스트·로고를 브라우저에서 바로",
  description:
    "사진에 텍스트나 로고 워터마크를 넣으세요. 위치·투명도·반복까지 조절, 여러 장 일괄도 무료. 도용을 막으려는 원본 사진을 남의 서버에 맡기지 않습니다.",
  keywords: [
    "워터마크 넣기",
    "사진 워터마크",
    "이미지 워터마크",
    "워터마크 만들기",
    "사진 로고 넣기",
    "워터마크 삽입",
    "이미지 저작권 표시",
  ],
  openGraph: {
    title: "사진 워터마크 넣기 - 텍스트·로고를 브라우저에서 바로",
    description: "사진에 텍스트·로고 워터마크를. 원본은 내 기기에만 남습니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사진 워터마크 넣기 - 텍스트·로고를 브라우저에서 바로",
    description: "워터마크 합성은 브라우저에서, 원본 사진은 내 기기에만.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "원본 사진과 로고가 서버로 올라가나요?",
    answer:
      "아니요. 도용이 걱정돼 워터마크를 넣으려는 사진을 남의 서버에 먼저 올린다면 그게 더 이상하겠죠. 사진도 로고도 브라우저 안에서만 합성되고, 어디로도 전송되지 않습니다.",
  },
  {
    question: "텍스트와 로고 둘 다 넣을 수 있나요?",
    answer:
      "텍스트 워터마크와 로고(이미지) 워터마크를 선택할 수 있습니다. 텍스트는 글자·색·굵기를, 로고는 투명 PNG를 올려 크기를 조절합니다. 한 번에 한 종류씩 적용되며, 두 번 적용하면 둘 다 넣을 수 있습니다.",
  },
  {
    question: "여러 장에 같은 워터마크를 한 번에 넣을 수 있나요?",
    answer:
      "됩니다. 사진을 한꺼번에 올리면 같은 설정이 전부에 적용되고, 끝나면 ZIP 하나로 묶여 내려옵니다. 데스크톱은 최대 10장, 모바일은 최대 5장까지 처리합니다.",
  },
  {
    question: "사진 도용을 막으려면 어떻게 하나요?",
    answer:
      "'전체 반복(도용 방지)'을 켜면 워터마크가 사진 전면에 타일처럼 깔려, 한쪽을 잘라내도 나머지가 남습니다. 투명도 30~50%에 약간의 회전을 더하면 사진 감상은 살리면서 지우기는 까다로워집니다.",
  },
  {
    question: "워터마크가 사진 크기에 따라 달라지나요?",
    answer:
      "글자·로고·여백 크기는 모두 사진 크기에 비례한 %로 적용됩니다. 그래서 작은 사진이든 큰 사진이든 일괄 적용해도 워터마크 비율이 일정하게 유지됩니다.",
  },
  {
    question: "투명한 로고는 어떤 포맷이 좋나요?",
    answer:
      "로고는 배경이 투명한 PNG를 권장합니다. 저장 포맷의 기본값 '자동'은 JPG 사진은 JPG로, WebP는 WebP로, PNG는 투명을 지키도록 PNG로 저장합니다. 카메라 JPG 사진을 PNG로 저장하면 용량이 크게 늘어(15.8MB → 47.2MB 실측) 업로드 한도에 걸릴 수 있습니다.",
  },
];

const guide = {
  intro:
    "사진 워터마크는 내가 찍은 이미지에 출처나 소유를 표시해 무단 도용을 막는 가장 손쉬운 방법입니다. 이 도구는 텍스트나 로고를 사진 위에 올리고 위치·투명도·반복까지 조절해 합성합니다. 합성은 기기 안 브라우저에서 끝나므로, 워터마크가 찍히기 전의 원본이 밖으로 돌아다닐 일은 없습니다.",
  sections: [
    {
      heading: "왜 워터마크를 넣을까 — 도용 방지와 출처 표시",
      paragraphs: [
        "블로그·SNS·쇼핑몰에 올린 사진은 누구나 저장해 가져갈 수 있습니다. 워터마크는 이미지에 \"이건 내 것\"이라는 흔적을 남겨, 누군가 퍼가더라도 출처가 따라붙게 만듭니다. 완벽한 복제 방지는 아니지만, 도용을 번거롭게 만들고 원작자를 드러내는 효과가 분명합니다.",
        "상호나 닉네임, 저작권 기호(©), 인스타그램 아이디처럼 짧고 알아보기 쉬운 표시를 쓰는 것이 좋습니다. 사진을 본 사람이 출처를 바로 찾아올 수 있다면 워터마크가 홍보 역할까지 겸합니다.",
      ],
    },
    {
      heading: "텍스트 vs 로고, 어떤 걸 넣을까",
      paragraphs: [
        "이 도구는 텍스트 워터마크와 로고(이미지) 워터마크 두 가지를 지원합니다. 상황에 맞게 고르면 됩니다.",
      ],
      bullets: [
        "텍스트: 닉네임·상호·저작권 문구를 빠르게 넣을 때. 글자 크기, 색, 굵게 여부를 조절할 수 있어 별도 준비 없이 바로 적용됩니다.",
        "로고: 이미 만들어 둔 브랜드 마크가 있을 때. 배경이 투명한 PNG를 올리면 깔끔하게 얹히고, 로고 크기는 사진 너비 대비 %로 조절합니다.",
        "둘 다 넣고 싶다면 한 종류를 적용해 내려받은 뒤, 그 결과물을 다시 올려 다른 종류를 한 번 더 적용하면 됩니다.",
      ],
    },
    {
      heading: "투명도·위치·반복 설정 요령",
      paragraphs: [
        "워터마크는 눈에는 띄되 사진 자체를 가리지 않아야 합니다. 투명도는 30~50% 정도가 무난합니다. 너무 진하면 사진이 답답하고, 너무 옅으면 잘라내거나 덮어쓰기 쉬워 보호 효과가 약해집니다. 위치는 보통 오른쪽 아래 모서리에 두지만, 9개 위치 중 사진 구도에 맞춰 고르면 됩니다. 가장자리 여백과 회전 각도까지 미리보기를 보며 다듬을 수 있습니다.",
        "도용 방지가 가장 중요하다면 '전체 반복(타일)'을 켜세요. 워터마크가 사진 전면에 일정 간격으로 반복돼, 일부를 잘라내거나 한 곳을 지워도 나머지가 남기 때문에 제거가 훨씬 까다로워집니다. 투명도를 낮추고 살짝 회전시켜 반복하면 감상은 방해하지 않으면서 보호 강도는 높일 수 있습니다. 글자·로고·여백 크기는 모두 사진 크기에 비례한 %라, 작은 사진과 큰 사진을 함께 처리해도 비율이 일정하게 유지됩니다.",
        "사진 여러 장에 같은 워터마크를 입혀야 한다면 한꺼번에 올려 일괄 적용하고 ZIP으로 내려받을 수 있습니다(데스크톱 10장, 모바일 5장). 저장 포맷은 기본값 '자동'이 사진마다 원래 형식을 따르니, 섞여 있어도 그대로 두면 됩니다.",
      ],
    },
  ],
};

const workflowCTA = {
  message: "워터마크 다 넣었나요? 이런 작업도 할 수 있어요.",
  tools: [
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "용량 줄이기",
    },
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "크기 조절하기",
    },
    {
      name: "사진 합치기",
      href: "/tools/image/merge",
      description: "여러 장 한 장으로",
    },
  ],
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 워터마크 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description:
      "사진에 텍스트·로고 워터마크를 넣는 무료 도구. 일괄 처리 지원, 원본은 기기에만 남습니다.",
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

export default function WatermarkPage() {
  return (
    <ToolLayout
      title="사진 워터마크 넣기"
      description="텍스트·로고를 사진 위에. 위치·투명도·반복까지 브라우저에서 바로."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/watermark"
      relatedPostSlugs={["image-watermark-guide", "browser-image-tools-privacy"]}
      schemas={schemas}
    >
      <WatermarkTool />
    </ToolLayout>
  );
}
