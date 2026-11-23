import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ConvertTool from "@/components/image/ConvertTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/heic-to-jpg`;

export const metadata: Metadata = {
  title: "아이폰 사진 변환 - HEIC를 JPG로 브라우저에서 바로",
  description:
    "아이폰에서 찍은 HEIC 사진을 JPG로 변환하세요. 사진첩에서 막 옮긴 사진을 업로드 없이 브라우저가 그 자리에서 바꿔줍니다. 몇 번을 써도 가입 없이 무료.",
  keywords: ["HEIC JPG 변환", "아이폰 사진 변환", "HEIC 변환", "아이폰 HEIC", "iOS 사진 변환"],
  openGraph: {
    title: "아이폰 사진 변환 - HEIC를 JPG로 브라우저에서 바로",
    description: "아이폰 HEIC 사진을 JPG로. 사진은 기기에 둔 채 포맷만 바꿉니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "아이폰 사진 변환 - HEIC를 JPG로",
    description: "안 열리던 아이폰 사진, 브라우저에서 바로 JPG로.",
  },
  alternates: {
    canonical: PAGE_URL,
  },
};

const faqs = [
  {
    question: "HEIC가 뭔가요?",
    answer:
      "HEIC(High Efficiency Image Container)는 아이폰에서 사용하는 이미지 포맷입니다. 애플은 JPEG보다 압축률이 높아 같은 화질에서 저장 공간을 덜 쓴다고 설명합니다. 다만 윈도우나 일부 프로그램에서 열리지 않는 경우가 있습니다.",
  },
  {
    question: "아이폰 사진이 안 열려요. 왜 그런가요?",
    answer:
      "iOS 11 이후의 아이폰(iPhone 7 이후 모델)은 카메라 포맷이 '고효율성'이면 사진을 HEIF(HEIC) 형식으로 저장합니다. 이 포맷은 모든 프로그램에서 지원되지 않아서 JPG로 변환하면 어디서든 열 수 있습니다.",
  },
  {
    question: "변환된 사진의 화질이 떨어지나요?",
    answer:
      "기본값 90%면 대부분 그대로 써도 됩니다. 파일을 더 줄여야 하면 품질 슬라이더를 조금 내리면 됩니다. 반대로 100% 가까이 올리면 용량은 늘지만 원본에 최대한 붙습니다.",
  },
  {
    question: "아이폰 앨범에서 여러 장을 골라 한꺼번에 바꿀 수 있나요?",
    answer:
      "네. 데스크톱은 사진 10장, 모바일은 5장까지 한 번에 받습니다. 아이폰에서 막 옮겨 온 사진 뭉치를 통째로 올려 JPG로 바꾸고, 결과는 ZIP 하나로 정리해 받으면 됩니다.",
  },
  {
    question: "변환한 JPG는 어디서나 열 수 있나요?",
    answer:
      "네, JPG는 윈도우, 안드로이드, 문서·이미지 프로그램 등 거의 모든 환경에서 열립니다. HEIC가 열리지 않던 PC나 오래된 프로그램에서도 문제없이 사용할 수 있습니다.",
  },
  {
    question: "맥이나 PC에 프로그램 설치 없이 변환되나요?",
    answer:
      "네, 웹 브라우저만 있으면 됩니다. 별도 앱이나 확장 프로그램을 설치할 필요가 없고, 변환 코드가 페이지와 함께 내려와 기기에서 실행되므로 사진을 어디에 올리지 않고도 바꿀 수 있습니다.",
  },
];

const guide = {
  intro:
    "아이폰에서 찍은 사진을 컴퓨터로 옮겼더니 .heic 확장자라 안 열린 경험, 한 번쯤 있을 겁니다. 이 도구는 그 HEIC 파일을 어디서나 열리는 JPG로 바꿔줍니다. 변환기가 서버가 아니라 이 페이지 안에 실려 있어서, 사진첩에서 꺼낸 사진이 어딘가로 올라가는 일 없이 그 자리에서 JPG가 됩니다.",
  sections: [
    {
      heading: "HEIC가 뭐고, 아이폰은 왜 이걸 쓸까",
      paragraphs: [
        "HEIC(High Efficiency Image Container)는 iOS 11부터 아이폰 카메라가 '고효율성' 설정에서 쓰는 사진 형식입니다. 애플은 JPEG보다 압축률이 높아 같은 화질에서 저장 공간을 덜 쓴다고 설명합니다. 얼마나 줄어드는지는 사진과 설정에 따라 달라서 한 숫자로 말하기 어렵습니다.",
        "문제는 용량 효율이 좋은 대신 호환성이 떨어진다는 점입니다. 애플 생태계 밖에서는 HEIC를 바로 읽지 못하는 환경이 아직 많아서, 아이폰에서는 멀쩡하던 사진이 다른 기기로 옮기는 순간 열리지 않는 일이 생깁니다.",
      ],
    },
    {
      heading: "HEIC가 안 열리는 흔한 상황",
      paragraphs: [
        "HEIC 자체가 나쁜 포맷은 아닙니다. 다만 받는 쪽이 지원하지 않으면 그저 열 수 없는 파일일 뿐입니다. 아래 같은 경우가 대표적입니다.",
      ],
      bullets: [
        "구형 윈도우 PC의 사진 뷰어나 일부 편집 프로그램에서 미리보기조차 뜨지 않는 경우",
        "안드로이드 폰으로 사진을 전송했더니 갤러리에서 깨져 보이거나 인식되지 않는 경우",
        "관공서·쇼핑몰·채용 사이트 등에서 사진을 업로드할 때 'JPG·PNG만 가능'이라며 거부당하는 경우",
        "오래된 문서 편집기나 이미지 도구에 끌어다 놓아도 반응이 없는 경우",
      ],
    },
    {
      heading: "JPG로 바꾸면 좋은 이유와 아이폰 설정 팁",
      paragraphs: [
        "HEIC는 영상 코덱 HEVC를 정지 사진에 끌어다 쓴 포맷이라, 애플 기기끼리는 잘 통해도 그 울타리 밖으로 나가면 이야기가 달라집니다. JPG는 반대로 낡았다 싶을 만큼 오래됐지만, 그래서 오히려 안 열리는 곳을 찾기가 더 어렵습니다. HEIC를 JPG로 한 번 바꿔 두면 '이 사진 왜 안 열려' 하는 순간을 대체로 건너뛸 수 있습니다. 이 도구는 품질은 90%로 잡아 두었습니다. 더 가볍게 하고 싶으면 슬라이더를 내리고, 사진이 여러 장이면 한꺼번에 올려 묶음으로 받으면 됩니다.",
        "매번 변환하는 게 번거롭다면 아이폰에서 처음부터 JPG로 찍게 설정해 두는 방법도 있습니다. 설정 > 카메라 > 포맷에서 '고효율성' 대신 '높은 호환성'을 선택하면 그때부터 촬영 사진이 JPG로 저장됩니다. 다만 용량이 다시 늘어나니, 평소엔 HEIC로 두고 필요할 때만 이 도구로 변환하는 쪽이 저장 공간 면에서는 실속 있습니다.",
      ],
    },
  ],
};

const workflowCTA = {
  message: "아이폰 사진을 JPG로 바꿨다면, 보내기 전에 한 번 더.",
  tools: [
    {
      name: "EXIF 삭제",
      href: "/tools/image/exif-remove",
      description: "촬영 위치가 남았는지 확인",
    },
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "메일 첨부 용량에 맞추기",
    },
    {
      name: "이미지 PDF 변환",
      href: "/tools/pdf/image-to-pdf",
      description: "여러 장을 서류 한 부로",
    },
  ],
};

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "HEIC→JPG 변환 도구",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "아이폰 HEIC 사진을 JPG로 바꾸는 무료 도구. 사진은 기기에 둔 채 변환합니다.",
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

export default function HeicToJpgPage() {
  return (
    <ToolLayout
      title="HEIC → JPG 변환"
      description="아이폰 사진을 JPG로 브라우저에서 바로. 사진은 내 기기에 둔 채로."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/heic-to-jpg"
      relatedPostSlugs={["heic-to-jpg-guide", "browser-image-tools-privacy"]}
      schemas={schemas}
    >
      <ConvertTool toolId="heic" />
    </ToolLayout>
  );
}
