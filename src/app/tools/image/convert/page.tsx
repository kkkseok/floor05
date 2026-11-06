import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ConvertTool from "@/components/image/ConvertTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/convert`;

export const metadata: Metadata = {
  title: "이미지 포맷 변환 - PNG·JPG·WebP·AVIF 다 되는 변환기",
  description:
    "PNG, JPG, WebP, AVIF로 자유롭게 변환. BMP·GIF·SVG·HEIC 입력까지 한 곳에서. 변환 엔진이 서버가 아니라 브라우저에 있어, 업로드를 기다릴 일도 파일이 밖으로 나갈 일도 없습니다.",
  keywords: [
    "이미지 변환",
    "PNG JPG 변환",
    "WebP 변환",
    "AVIF 변환",
    "HEIC JPG 변환",
    "BMP 변환",
    "GIF 변환",
    "SVG PNG 변환",
    "포맷 변환",
  ],
  openGraph: {
    title: "이미지 포맷 변환 - PNG·JPG·WebP·AVIF 다 되는 변환기",
    description: "PNG, JPG, WebP, AVIF 변환. BMP·GIF·SVG·HEIC 입력까지. 브라우저에서 바로.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 포맷 변환 - PNG·JPG·WebP·AVIF 다 되는 변환기",
    description: "8가지 형식을 받아 PNG·JPG·WebP·AVIF로. 변환은 브라우저가 그 자리에서 합니다.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "아이폰에서 찍은 HEIC 사진도 변환할 수 있나요?",
    answer:
      "네, HEIC/HEIF 파일을 JPG, PNG, WebP로 변환할 수 있습니다. 업로드라는 단계 자체가 없어서, 아이폰에서 막 옮긴 사진 여러 장도 기다림 없이 기기 안에서 바로 바뀝니다.",
  },
  {
    question: "PNG의 투명 배경은 어떻게 처리되나요?",
    answer:
      "PNG를 JPG로 변환할 때 투명한 부분은 선택한 배경색(흰색, 검정, 회색)으로 채워집니다. PNG로 변환할 경우 투명도가 유지됩니다.",
  },
  {
    question: "WebP란 무엇인가요?",
    answer:
      "구글이 웹용으로 내놓은 포맷으로, 같은 장면을 JPG보다 4분의 1가량 가벼운 파일에 담습니다. 요즘 브라우저는 대부분 무리 없이 열고, 이 도구에서 JPG·PNG로 다시 꺼낼 수도 있습니다.",
  },
  {
    question: "변환 후 이미지 품질이 떨어지나요?",
    answer:
      "출력 포맷과 품질에 따라 갈립니다. JPG·WebP는 품질 슬라이더를 90% 근처에 두면 화면상 차이를 느끼기 어렵고, PNG는 애초에 무손실이라 변환만으로는 화질이 깎이지 않습니다. 같은 파일을 여러 번 다시 저장할 계획이면 무손실 쪽이 안전합니다.",
  },
  {
    question: "여러 장을 한 번에 변환하고 ZIP으로 받을 수 있나요?",
    answer:
      "네, 여러 이미지를 한꺼번에 올린 뒤 출력 포맷을 정하면 일괄 변환됩니다. HEIC, PNG, JPG가 섞여 있어도 되고, 변환이 끝나면 ZIP 파일로 한 번에 다운로드할 수 있습니다.",
  },
  {
    question: "어떤 브라우저에서 WebP로 변환되나요?",
    answer:
      "최신 크롬, 엣지, 파이어폭스, 사파리에서 WebP 변환을 지원합니다. WebP를 지원하지 않는 브라우저에서는 WebP 옵션이 자동으로 비활성화되고 안내가 표시되니, JPG나 PNG를 이용하세요.",
  },
  {
    question: "AVIF는 무엇이고, 어떨 때 쓰나요?",
    answer:
      "AVIF는 WebP보다도 더 작은 용량에 좋은 화질을 담는 차세대 이미지 포맷입니다. 웹사이트 로딩 속도를 더 줄이고 싶을 때 유리합니다. AVIF 출력(인코딩)은 크롬·엣지 등 일부 브라우저에서만 지원되어, 지원하지 않는 브라우저에서는 AVIF 버튼이 자동으로 비활성화됩니다. 반대로 'AVIF를 JPG·PNG로 여는' 변환은 대부분의 최신 브라우저에서 됩니다.",
  },
  {
    question: "BMP, GIF, SVG, AVIF 파일도 올릴 수 있나요?",
    answer:
      "네. JPG, PNG, WebP, HEIC에 더해 BMP, GIF, SVG, AVIF를 입력으로 받아 JPG·PNG·WebP(·AVIF)로 변환할 수 있습니다. 웹에서 받은 AVIF·WebP가 안 열릴 때, 오래된 BMP를 가볍게 줄일 때, GIF의 한 장면을 이미지로 뽑을 때(움직이는 GIF는 첫 프레임만 변환됩니다) 쓰면 됩니다.",
  },
  {
    question: "SVG를 PNG·JPG로 바꾸면 크기는 어떻게 되나요?",
    answer:
      "SVG는 벡터라 정해진 크기가 없어서, 변환 옵션에서 '출력 가로(px)'를 입력하면 그 크기로 또렷하게 변환됩니다. 세로는 비율에 맞춰 자동 계산됩니다. 아이콘이나 로고를 원하는 해상도의 PNG로 내보낼 때 유용합니다. 단, 외부 폰트를 참조하는 SVG는 폰트가 빠진 채 그려질 수 있습니다.",
  },
];

const guide = {
  intro:
    "PNG, JPG, WebP, AVIF는 각자 잘하는 일이 다릅니다. 어떤 포맷을 골라야 할지, 변환할 때 무엇이 달라지는지 짚어 두었습니다. BMP·GIF·SVG·HEIC 같은 형식도 올려서 바꿀 수 있습니다. 변환 엔진이 지금 쓰는 브라우저 안에 들어 있어서, 파일을 어디로 보내지 않고 그 자리에서 결과를 받습니다.",
  sections: [
    {
      heading: "PNG·JPG·WebP, 언제 무엇을 쓰나",
      paragraphs: [
        "세 포맷은 용도가 다릅니다. PNG는 무손실 압축이라 화질 저하가 없고 투명 배경을 지원합니다. 로고, 아이콘, 스크린샷, 글자가 또렷해야 하는 이미지에 어울리지만 용량은 큰 편입니다.",
        "JPG는 사진처럼 색이 많고 복잡한 이미지를 작은 용량으로 담는 데 강합니다. 다만 손실 압축이라 저장할 때마다 화질이 조금씩 깎입니다. WebP는 구글이 만든 포맷으로, 같은 화질을 JPG보다 25~35% 작은 용량에 담습니다. 투명도와 손실/무손실 압축을 모두 지원해 웹 게시용으로 가장 효율적입니다.",
      ],
    },
    {
      heading: "JPG로 바꾸면 투명 배경은 어떻게 되나",
      paragraphs: [
        "JPG는 투명도를 저장하지 못합니다. 그래서 투명 배경이 있는 PNG를 JPG로 변환하면 비어 있던 부분이 단색으로 채워집니다. 이 도구에서는 채울 색을 직접 정할 수 있습니다.",
        "기본값은 흰색이고, 검정과 밝은 회색을 바로 고르거나 색상 선택기로 원하는 색을 지정할 수 있습니다. 배경이 비치는 디자인이라면 흰색, 어두운 화면에 올릴 이미지라면 검정처럼, 쓸 곳에 맞춰 고르면 됩니다. 투명도를 그대로 유지하고 싶다면 PNG나 WebP로 변환하세요.",
      ],
      bullets: [
        "PNG → JPG: 투명 영역이 지정한 배경색으로 채워집니다",
        "PNG → PNG / WebP: 투명도가 그대로 유지됩니다",
        "품질 슬라이더는 JPG·WebP에만 적용되고, PNG는 무손실이라 품질 저하가 없습니다",
      ],
    },
    {
      heading: "용량과 호환성, 그리고 일괄 변환",
      paragraphs: [
        "용량만 보면 보통 WebP가 가장 작고, JPG가 그다음, PNG가 가장 큽니다. 다만 WebP는 비교적 최신 포맷이라 아주 오래된 환경에서는 열리지 않을 수 있습니다. 메일 첨부나 외부 공유처럼 호환성이 중요하면 JPG가 무난하고, 웹사이트에 올린다면 WebP가 로딩 속도에 유리합니다.",
        "아이폰 사진의 HEIC도 JPG·PNG·WebP로 바꿀 수 있고, 형식이 섞여 있어도 한 번에 올려 같은 포맷으로 일괄 변환한 뒤 ZIP으로 받을 수 있습니다. 품질을 90% 안팎으로 두면 용량은 줄이면서 눈에 띄는 화질 저하 없이 변환됩니다.",
      ],
    },
    {
      heading: "AVIF, 그리고 다양한 형식 입력",
      paragraphs: [
        "AVIF는 WebP보다도 한 단계 더 효율적인 차세대 포맷입니다. 같은 화질을 더 작은 용량에 담아 웹사이트 로딩 속도를 한 번 더 줄이고 싶을 때 좋습니다. 다만 AVIF로 '내보내는' 인코딩은 아직 크롬·엣지 같은 일부 브라우저에서만 되기 때문에, 지원하지 않는 브라우저에서는 AVIF 버튼이 자동으로 비활성화됩니다. 반대로 웹에서 받은 AVIF나 WebP가 안 열릴 때, 그 파일을 올려 JPG·PNG로 바꾸는 건 대부분의 최신 브라우저에서 됩니다.",
        "입력으로는 JPG·PNG·WebP·HEIC에 더해 BMP, GIF, SVG, AVIF도 받습니다. 오래되고 용량 큰 BMP를 가볍게 줄이거나, 움직이는 GIF에서 한 장면을 이미지로 뽑거나(움짤은 첫 프레임만 변환됩니다), 벡터 SVG 아이콘을 원하는 해상도의 PNG로 내보낼 수 있습니다. SVG는 정해진 크기가 없어 변환 옵션에서 '출력 가로(px)'를 정하면 그 크기로 또렷하게 래스터화됩니다.",
      ],
      bullets: [
        "AVIF 출력: 크롬·엣지 등 지원 브라우저에서만 (그 외에는 버튼 비활성화)",
        "AVIF·WebP 입력 → JPG·PNG 출력: 최신 브라우저에서 대부분 가능 (안 열리는 파일 열기)",
        "GIF 입력: 움직이는 GIF는 첫 프레임만 변환",
        "SVG 입력: 출력 가로(px)를 지정해 원하는 해상도로 변환 (세로 자동)",
      ],
    },
  ],
};

const workflowCTA = {
  message: "포맷 변환 끝났나요? 이런 작업도 할 수 있어요.",
  tools: [
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "용량도 줄여보세요",
    },
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "크기도 조절해보세요",
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
    name: "이미지 포맷 변환 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "PNG·JPG·WebP·AVIF 상호 변환 무료 도구. BMP·GIF·SVG·HEIC 입력 지원, 변환 엔진은 브라우저 안에 있습니다.",
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

export default function ConvertPage() {
  return (
    <ToolLayout
      title="이미지 포맷 변환"
      description="PNG, JPG, WebP, HEIC 자유자재로. 아이폰 사진도 브라우저에서 바로."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/convert"
      relatedPostSlugs={["png-vs-jpg", "browser-image-encoders", "webp-guide"]}
      schemas={schemas}
    >
      <ConvertTool />
    </ToolLayout>
  );
}
