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
    "이미지 한 장을 올리면 파비콘에 필요한 파일 8개를 만들어 ZIP 하나로 내려줍니다. 각 파일이 어디에 쓰이는지, 어떤 원본을 올려야 작은 크기에서도 알아볼 수 있는지, 올린 뒤 브라우저가 실제로 무엇을 받아 가는지를 정리했습니다.",
  sections: [
    {
      heading: "ZIP에 들어 있는 파일 8개",
      paragraphs: [
        "원본의 가운데를 정사각형으로 잘라 16·32·48·180·192·512px 여섯 크기로 줄이고, 그중 16·32·48px 세 장을 favicon.ico 한 파일에 함께 담습니다.",
      ],
      bullets: [
        "favicon.ico: 16·32·48px를 담은 파일. 브라우저 탭과 즐겨찾기용",
        "favicon-16x16.png, favicon-32x32.png: PNG 아이콘을 따로 지정할 때 쓰는 파일",
        "apple-touch-icon.png: 180px. 아이폰 홈 화면용",
        "android-chrome-192x192.png, android-chrome-512x512.png: 매니페스트가 가리키는 아이콘",
        "site.webmanifest: 위 두 아이콘의 경로만 적은 파일. 앱 이름이나 테마 색은 들어 있지 않으니 필요하면 직접 추가합니다",
        "head-snippet.html: <head>에 붙여넣을 태그 5줄",
      ],
    },
    {
      heading: "어떤 원본을 올려야 하나",
      paragraphs: [
        "자르는 위치는 고를 수 없고 항상 가운데입니다. 가로로 긴 로고를 올리면 양옆이 잘리므로, 미리 정사각형으로 다듬어 올리는 편이 안전합니다. 원본이 512px보다 작으면 큰 아이콘은 늘려서 만들기 때문에 흐려집니다. JPG·PNG·WebP 한 장을 받고, 투명 PNG를 올리면 결과물에도 투명 배경이 유지됩니다.",
        "16px에서는 가는 선과 잔무늬가 살아남지 못합니다. 이 도구는 큰 이미지를 한 번에 줄이지 않고 절반씩 나눠 줄입니다. 1024px 테스트 로고를 16px로 줄여 기준 이미지와 비교했을 때, 한 번에 줄인 쪽은 PSNR 16.3dB로 없던 줄무늬가 생겼고 절반씩 줄인 쪽은 Chromium에서 50.7dB였습니다(높을수록 기준에 가깝습니다). 그래도 가로세로 16칸짜리 격자에 담을 수 있는 모양에는 한계가 있으니, 글자 한두 자나 단순한 심볼이 낫습니다.",
      ],
    },
    {
      heading: "브라우저가 실제로 받아 가는 파일",
      paragraphs: [
        "이 도구로 만든 파일을 테스트 서버에 올리고 요청을 기록해 봤습니다. Chromium 151은 태그 5줄을 넣은 페이지에서도 favicon.ico 하나만 받았습니다. Firefox 153은 favicon-16x16.png와 apple-touch-icon.png를 받았습니다. 아이콘 태그가 하나도 없는 페이지에서는 둘 다 사이트 맨 위 경로의 /favicon.ico를 요청했습니다.",
        "그래서 <head>를 고치기 어려운 환경이라면 favicon.ico를 루트에 올려 두는 것만으로 탭 아이콘은 해결됩니다. 측정 로고 기준으로 favicon.ico는 7.8KB, apple-touch-icon.png는 63.7KB였습니다. 데스크톱 Firefox도 이 180px 파일을 받아 가니, 사진보다는 단순한 로고로 만들어 가볍게 두는 편이 좋습니다.",
      ],
    },
    {
      heading: "적용할 때 틀리기 쉬운 곳",
      paragraphs: [
        "태그와 매니페스트의 경로는 모두 /favicon.ico처럼 사이트 맨 위를 기준으로 적혀 있습니다. 압축을 풀어 루트 폴더에 그대로 올리면 수정할 것이 없습니다. 하위 폴더에 올렸다면 태그 5줄과 site.webmanifest 안의 경로를 그 위치에 맞게 고쳐야 합니다. 경로가 어긋나면 브라우저는 없는 파일을 요청하고 아이콘은 뜨지 않습니다.",
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
    question: "원본 이미지는 얼마나 커야 하나요?",
    answer:
      "한 변이 512px 이상인 정사각형을 권합니다. 가장 큰 결과물이 512px이라, 원본이 그보다 작으면 늘려서 만들어 흐려집니다. 크기별로 줄이고 ICO로 묶는 일은 페이지 안의 스크립트가 하므로 공개 전 로고도 그대로 넣어 볼 수 있습니다.",
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
