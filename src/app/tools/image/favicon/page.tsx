import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import FaviconTool from "@/components/image/FaviconTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/favicon`;

export const metadata: Metadata = {
  title: "파비콘 만들기 - 이미지로 favicon.ico 생성",
  description:
    "이미지 한 장으로 favicon.ico와 16·32·48px 아이콘, 모바일·PWA용 PNG, site.webmanifest를 한 번에 만들어 ZIP으로 받습니다. 붙여넣을 HTML 코드까지. 공개 전인 로고도 업로드 없이 브라우저에서 바로 만들 수 있고, 무료입니다.",
  keywords: [
    "파비콘 만들기",
    "favicon 생성",
    "ico 변환",
    "favicon.ico 만들기",
    "파비콘 생성기",
    "favicon generator",
    "사이트 아이콘 만들기",
  ],
  openGraph: {
    title: "파비콘 만들기 - 이미지로 favicon.ico 생성",
    description: "favicon.ico + 각 사이즈 아이콘 + manifest를 ZIP으로. HTML 코드까지.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "파비콘 만들기 - 이미지로 favicon.ico 생성",
    description: "이미지로 favicon.ico와 각 사이즈 아이콘을 한 번에.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "브라우저 탭과 즐겨찾기에 뜨는 작은 아이콘이 파비콘입니다. 제대로 넣으려면 favicon.ico 하나로 끝나지 않고, 모바일 홈 화면용, PWA 매니페스트용 등 여러 크기가 필요합니다. 이 도구는 이미지 한 장으로 그 묶음을 한 번에 만듭니다.",
  sections: [
    {
      heading: "왜 여러 크기가 필요한가",
      paragraphs: [
        "favicon.ico에는 16·32·48px를 함께 담아 브라우저가 상황에 맞는 크기를 고르게 합니다. 여기에 아이폰 홈 화면용 apple-touch-icon(180px), 안드로이드·PWA용 192·512px PNG, 그리고 이들을 묶는 site.webmanifest가 더해집니다.",
      ],
      bullets: [
        "favicon.ico — 16·32·48px 포함 (브라우저 탭·즐겨찾기)",
        "apple-touch-icon.png(180) — 아이폰 홈 화면",
        "android-chrome 192·512px — 안드로이드·PWA",
        "site.webmanifest — 아이콘 묶음 정의",
      ],
    },
    {
      heading: "만들고 적용하기",
      paragraphs: [
        "정사각형에 가까운 이미지(로고 등)를 올리면 중앙을 정사각형으로 잘라 각 크기를 만듭니다. '파비콘 생성'을 누르면 위 파일들이 ZIP으로 다운로드됩니다. 압축을 풀어 사이트 루트 폴더에 그대로 올리세요.",
        "마지막으로 함께 제공되는 HTML 코드를 페이지의 <head>에 붙여넣으면 끝입니다. 티스토리·워드프레스 등에서도 같은 파일과 코드를 쓰면 됩니다. 아이콘 리사이즈와 ICO 인코딩은 전부 브라우저가 처리하니, 아직 공개하지 않은 로고를 어딘가에 올릴 걱정도 없습니다.",
      ],
    },
  ],
};

const faqs = [
  {
    question: "어떤 이미지를 올리면 되나요?",
    answer:
      "정사각형에 가까운 로고나 아이콘 이미지가 가장 좋습니다. 직사각형이면 중앙을 정사각형으로 잘라 사용합니다. 배경을 투명하게 하려면 투명 PNG를 올리세요.",
  },
  {
    question: "favicon.ico만 있으면 안 되나요?",
    answer:
      "favicon.ico만으로도 브라우저 탭에는 표시되지만, 아이폰 홈 화면이나 PWA에서는 별도 PNG와 manifest가 필요합니다. 이 도구는 그 묶음을 한 번에 만들어 줍니다.",
  },
  {
    question: "어디에 올리고 어떻게 적용하나요?",
    answer:
      "ZIP을 풀어 나온 파일을 사이트 루트 폴더에 올리고, 함께 제공되는 HTML 코드를 페이지의 <head>에 붙여넣으면 됩니다.",
  },
  {
    question: "로고 이미지가 서버에 올라가나요?",
    answer:
      "아니요. 크기별 리사이즈부터 ICO·manifest 생성까지 전부 브라우저 안에서 처리합니다. 출시 전 서비스의 로고처럼 아직 공개하면 안 되는 이미지도 안심하고 쓸 수 있습니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "파비콘 만들기",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "이미지로 favicon.ico와 각 사이즈 아이콘·site.webmanifest를 만들어 ZIP으로 받는 무료 도구. 아이콘 생성은 브라우저 안에서 끝납니다.",
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

export default function FaviconPage() {
  return (
    <ToolLayout
      title="파비콘 만들기"
      description="이미지로 favicon.ico와 각 사이즈 아이콘·매니페스트를 한 번에. ZIP으로."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/image/favicon"
      relatedPostSlugs={["favicon-browser-requests", "transparent-background"]}
      schemas={schemas}
    >
      <FaviconTool />
    </ToolLayout>
  );
}
