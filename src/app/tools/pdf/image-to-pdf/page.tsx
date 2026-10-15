import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ImageToPdfTool from "@/components/pdf/ImageToPdfTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/pdf/image-to-pdf`;

export const metadata: Metadata = {
  title: "이미지 PDF 변환 - 여러 사진을 한 PDF로",
  description:
    "JPG·PNG 여러 장을 한 PDF로 묶습니다. 순서 조정, A4·여백 옵션까지. 휴대폰으로 찍은 계약서·신분증 사진도 기기 안에서만 PDF가 됩니다. 물론 무료.",
  keywords: [
    "이미지 pdf 변환",
    "jpg pdf 변환",
    "사진 pdf 만들기",
    "이미지 합쳐 pdf",
    "png pdf 변환",
    "여러 사진 pdf",
    "사진 pdf 변환",
  ],
  openGraph: {
    title: "이미지 PDF 변환 - 여러 사진을 한 PDF로",
    description: "JPG·PNG 여러 장을 순서대로 한 PDF로. A4·여백 옵션, 서류 사진은 기기 안에서만.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "이미지 PDF 변환 - 여러 사진을 한 PDF로",
    description: "찍어 둔 서류 사진, 브라우저에서 바로 한 PDF로.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "과제, 서류, 계약서 사진을 한 파일로 제출해야 할 때 PDF가 가장 무난합니다. 이 도구는 여러 장의 사진을 올려 순서를 정하고, 한 개의 PDF로 묶어줍니다. PDF 조립까지 브라우저가 직접 하니, 서류 사진을 어딘가에 올려 두고 기다릴 필요가 없습니다.",
  sections: [
    {
      heading: "여러 사진을 한 PDF로 묶는 법",
      paragraphs: [
        "사진을 드래그하거나 클릭해 올린 뒤, 위·아래 화살표로 순서를 맞추고 'PDF로 변환'을 누르면 됩니다. 각 사진이 순서대로 한 페이지씩 들어갑니다. 스캔 앱 없이 휴대폰으로 찍은 서류 사진을 그대로 PDF로 만들 때 편합니다.",
      ],
      bullets: [
        "용지 '이미지 맞춤': 사진 비율 그대로 페이지가 만들어집니다.",
        "용지 'A4'·'Letter': 규격 용지에 사진을 비율 유지하며 배치합니다.",
        "여백: 인쇄를 염두에 둔다면 '좁게'나 '넓게'로 가장자리 여백을 줍니다.",
      ],
    },
    {
      heading: "왜 서버에 안 올리는 게 중요한가",
      paragraphs: [
        "신분증, 통장 사본, 계약서처럼 남에게 보이기 싫은 서류를 PDF로 만들 일이 많습니다. 여러 온라인 변환 사이트는 이런 파일을 자기 서버로 올려 처리하지만, 이 도구는 조립을 전부 이 브라우저 안에서 끝냅니다. 사진이 기기 밖으로 나가지 않으니 민감한 서류를 다룰 때 부담이 덜합니다.",
        "JPG·PNG·WebP를 지원하고, 세로로 찍힌 사진은 회전 정보를 읽어 똑바로 세워 넣습니다. 완성된 PDF는 곧바로 기기에 저장됩니다.",
      ],
    },
  ],
};

const faqs = [
  {
    question: "PDF로 만들 때 용지와 여백은 어떻게 고르나요?",
    answer:
      "쓰임에 맞춰 고르면 됩니다. 화면으로만 볼 자료는 '이미지 맞춤'이 사진 비율을 그대로 살려 깔끔하고, 프린트하거나 기관에 낼 서류는 'A4'에 여백을 조금 줘서 가장자리 잘림을 막는 편이 안전합니다.",
  },
  {
    question: "사진을 올린 순서가 그대로 페이지가 되나요?",
    answer:
      "그렇습니다. 목록에서 위·아래 화살표로 배열한 차례대로, 위에서 아래로 한 장씩 페이지가 만들어집니다.",
  },
  {
    question: "세로로 찍은 사진이나 HEIC도 넣을 수 있나요?",
    answer:
      "세로 사진은 회전 정보를 읽어 똑바로 세워 담습니다. 지원 형식은 JPG·PNG·WebP이고, 아이폰 HEIC는 포맷 변환 도구로 JPG로 바꾼 뒤 올리면 됩니다.",
  },
  {
    question: "서류 사진이 서버에 올라가나요?",
    answer:
      "올라가지 않습니다. PDF 조립은 이 기기의 브라우저가 직접 맡습니다. 신분증이나 통장 사본을 낯선 서버에 맡기지 않고 제출용 PDF를 만들 수 있다는 게 이 도구의 요점입니다.",
  },
  {
    question: "만든 PDF 용량이 제출 한도를 넘습니다.",
    answer:
      "PDF 용량은 안에 든 사진 용량의 합과 거의 같습니다. 카메라 사진 10장을 원본 그대로 넣으면 48MB였지만, 화질을 '제출용'(긴 변 1754px)으로 고르면 2.9MB, '인쇄용'(긴 변 3508px)은 10.1MB였습니다. 한도에 맞춰 화질 옵션을 고른 뒤 다시 변환하세요.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "이미지 PDF 변환",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "JPG·PNG 여러 장을 한 PDF로 묶는 무료 도구. PDF 조립은 브라우저가 직접 합니다.",
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

export default function ImageToPdfPage() {
  return (
    <ToolLayout
      title="이미지 PDF 변환"
      description="여러 사진을 한 PDF로. 순서·용지·여백까지 브라우저에서 바로."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/pdf/image-to-pdf"
      relatedPostSlugs={["image-to-pdf-guide"]}
      schemas={schemas}
    >
      <ImageToPdfTool />
    </ToolLayout>
  );
}
