import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import CompressTool from "@/components/image/CompressTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/compress`;

export const metadata: Metadata = {
  title: "이미지 압축 - 서버 전송 없이 브라우저에서 바로",
  description:
    "파일이 내 기기를 떠나지 않습니다. 로그인도 설치도 없이, 목표 용량 설정과 일괄 압축, Before/After 비교까지 무료로.",
  keywords: ["이미지 압축", "사진 용량 줄이기", "JPG 압축", "PNG 압축", "무료 이미지 압축"],
  openGraph: {
    title: "이미지 압축 - 서버 전송 없이 브라우저에서 바로",
    description: "파일이 내 기기를 떠나지 않습니다. 가입 없이, 쓰는 횟수 제한 없이 무료.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 압축 - 서버 전송 없이 브라우저에서 바로",
    description: "압축은 브라우저 몫, 사진은 내 기기에. 목표 용량 설정과 일괄 압축까지 무료.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "파일이 서버로 전송되나요?",
    answer:
      "아니요. 압축 연산은 전부 지금 쓰고 있는 브라우저가 합니다. 원본을 올리고 결과를 내려받는 왕복이 없어 처리가 빠르고, 사진은 처음부터 끝까지 내 기기에만 있습니다.",
  },
  {
    question: "한 번에 몇 장까지 압축할 수 있나요?",
    answer:
      "데스크톱에서는 최대 10장, 모바일에서는 최대 5장까지 동시에 압축할 수 있습니다. 파일당 최대 50MB까지 지원합니다.",
  },
  {
    question: "목표 용량 설정은 어떻게 작동하나요?",
    answer:
      "목표 용량을 넣으면 그 용량 아래에서 가능한 가장 높은 품질을 찾아 압축합니다. 품질을 60% 아래로 내려야만 맞는 큰 사진은 대신 해상도를 줄입니다. 5522px 사진을 200KB로 맞출 때 품질만 낮추면 1.8%까지 떨어져 눈에 띄게 깨졌기 때문입니다. 해상도를 줄였다면 결과 화면에 바뀐 크기를 표시하니, 픽셀 규격이 정해진 제출처라면 그 숫자를 확인하세요.",
  },
  {
    question: "어떤 이미지 형식을 지원하나요?",
    answer:
      "JPG, PNG, WebP 이미지를 압축할 수 있습니다. '결과 형식'을 자동으로 두면 PNG는 투명을 유지한 채 압축하고, 나머지는 더 작은 JPG로 저장합니다. 원하면 전부 JPG 또는 전부 PNG로 지정할 수도 있습니다.",
  },
  {
    question: "압축 전후 차이를 미리 확인할 수 있나요?",
    answer:
      "네, Before/After 슬라이더로 원본과 압축 결과를 나란히 비교할 수 있습니다. 품질 슬라이더를 움직이면 예상 용량이 실시간으로 표시되므로, 화질과 용량이 만족스러운 지점을 찾은 뒤 다운로드하세요.",
  },
  {
    question: "PNG를 압축하면 투명 배경은 어떻게 되나요?",
    answer:
      "'결과 형식'을 자동 또는 PNG로 두면 투명 배경을 그대로 유지한 채 압축합니다. JPG로 저장하면 투명한 부분은 흰색으로 채워집니다.",
  },
];

const guide = {
  intro:
    "사진 한 장이 5MB, 10MB를 넘기는 건 요즘 휴대폰에선 흔한 일입니다. 문제는 그 용량 그대로는 이메일 첨부도, 지원서 업로드도, 메신저 전송도 자꾸 막힌다는 거죠. 이미지 압축은 눈에 보이는 화질은 최대한 지키면서 파일 크기만 덜어내는 작업입니다. 이 도구가 어떻게 동작하고, 언제 어떤 설정을 쓰면 좋은지 정리했습니다.",
  sections: [
    {
      heading: "압축은 어떻게 용량을 줄이나요",
      paragraphs: [
        "JPG 압축은 사람 눈이 잘 구분하지 못하는 미세한 색·밝기 차이를 덜어내는 방식으로 동작합니다. 품질 80% 정도면 원본과 나란히 놓고 봐도 차이를 느끼기 어려운데, 용량은 절반 이하로 줄어드는 경우가 많습니다. 품질을 낮출수록 파일은 작아지지만 경계가 뭉개지거나 하늘 같은 단색 면에 얼룩(노이즈)이 생기기 시작합니다.",
        "PNG는 원리가 다릅니다. 색 수를 줄여 데이터를 압축하기 때문에 사진보다는 단색·도형·로고에서 효과가 큽니다. 이 도구는 결과 형식을 '자동'으로 두면 투명이 필요한 PNG는 PNG로, 사진은 더 작은 JPG로 알아서 저장합니다.",
      ],
    },
    {
      heading: "목표 용량을 알고 있다면",
      paragraphs: [
        "증명사진 200KB 이하, 온라인 지원서 1MB 이하처럼 제출처가 정한 상한이 있을 때는 품질을 손으로 맞추기보다 '목표 용량'을 입력하세요. 그 용량 아래로 떨어지는 가장 좋은 품질을 자동으로 찾아줍니다. 품질이 60% 밑으로 내려가야 하는 경우에는 사진을 깨뜨리는 대신 해상도를 줄여 맞춥니다.",
      ],
      bullets: [
        "메신저·카카오톡 전송: 1MB 안팎이면 화질·속도가 둘 다 무난합니다.",
        "이메일 첨부: 받는 사람을 배려해 장당 2MB 이하를 권합니다.",
        "온라인 지원서·민원 서류: 안내된 상한보다 살짝 작게 잡으면 안전합니다.",
      ],
    },
    {
      heading: "한국 증명사진, 용량 상한부터 제각각입니다",
      paragraphs: [
        "증명사진을 '몇 KB로 줄이면 되나요'라고 물으면 한 숫자로 답하기 어렵습니다. 제출처가 정한 상한이 공무원 원서접수의 100KB 미만부터 사람인 이력서의 10MB까지, 100배 넘게 벌어지기 때문입니다. 목표 용량을 입력하기 전에 접수처가 요구하는 상한부터 확인하는 편이 빠릅니다.",
        "아래는 자주 쓰이는 한국 관공서·시험·취업 증명사진의 용량 상한을 낮은 쪽부터 정리한 표입니다. 상한보다 살짝 작게 맞추면 업로드가 반려되지 않습니다. 수치는 각 기관 안내 기준이며 접수 시점에 따라 바뀔 수 있으니, 제출 직전에는 해당 기관 공지를 확인하세요.",
      ],
      table: {
        headers: ["용도", "용량 상한", "형식", "출처(기관)"],
        rows: [
          ["공무원 원서접수", "100KB 미만", "JPG", "사이버국가고시(gosi.kr)"],
          ["운전면허 신청", "250KB", "JPG", "도로교통공단(koroad)"],
          ["토익 응시원서", "500KB", "JPG", "YBM(toeic.co.kr)"],
          ["여권 신청", "500KB 이하", "JPG", "외교부(passport.go.kr)"],
          ["잡코리아 이력서", "1MB", "JPG·PNG", "잡코리아(jobkorea)"],
          ["사람인 이력서", "10MB", "JPG·PNG", "사람인(saramin)"],
        ],
        caption: "각 기관 원서접수·발급 안내 기준. 용량 상한은 접수 시점에 따라 달라질 수 있습니다.",
      },
    },
    {
      heading: "용량만 줄이는 압축은 보정과 다릅니다",
      paragraphs: [
        "여권이나 면허 온라인 신청 규정은 필터·합성·AI 편집으로 만든 사진을 걸러내지만, 파일 용량을 낮추는 압축은 여기에 해당하지 않습니다. 압축은 사람 눈에 잘 안 보이는 데이터를 덜어내 KB·MB를 줄일 뿐, 얼굴 형태나 피부, 배경을 새로 그리거나 바꾸지 않기 때문입니다.",
        "그래서 100KB 미만 같은 용량 상한을 맞추려 압축하는 것은 보정·가공을 금지하는 규정과 어긋나지 않는 편입니다. 물론 압축을 과하게 걸어 화질이 뭉개지면 규격 미달로 반려될 수 있으니 알아볼 수 있을 정도로만 줄이고, 세부 기준은 접수처 안내로 확인하세요.",
      ],
    },
    {
      heading: "이럴 땐 압축 대신 다른 도구",
      paragraphs: [
        "사진의 가로·세로 픽셀 자체가 너무 크다면 압축보다 리사이즈가 빠릅니다. 4000×3000을 2000×1500으로 줄이면 그것만으로 용량이 약 1/4이 됩니다. 반대로 화질은 그대로 두되 PNG를 JPG로 바꿔 용량만 줄이고 싶다면 포맷 변환이 맞습니다. 압축·리사이즈·변환은 서로 보완 관계라, 상황에 맞게 골라 쓰면 됩니다.",
        "어떤 경우든 파일은 브라우저 안에서만 처리되고 서버로 올라가지 않습니다. 민감한 신분증·계약서 사진도 마음 놓고 줄일 수 있습니다.",
      ],
    },
  ],
};

const workflowCTA = {
  message: "압축 끝났나요? 이런 작업도 할 수 있어요.",
  tools: [
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "크기도 조절해보세요",
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

// Schema.org Markup
const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 압축 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    description: "브라우저에서 바로 이미지를 압축하는 무료 도구. 목표 용량 설정, 일괄 압축, Before/After 비교 지원.",
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

export default function CompressPage() {
  return (
    <ToolLayout
      title="이미지 압축"
      description="서버 전송 없이 브라우저에서 바로. 목표 용량 설정, 일괄 압축까지."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/compress"
      relatedPostSlugs={["image-compression-guide", "passport-photo-size", "image-quality-vs-size"]}
      schemas={schemas}
    >
      <CompressTool />
    </ToolLayout>
  );
}
