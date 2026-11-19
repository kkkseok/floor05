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
    "사진을 올려 위·아래 화살표로 순서를 맞추면, 한 장이 한 페이지가 되는 PDF 하나로 묶습니다. 결과물의 용량과 모양은 화질·용지·여백 세 옵션이 정하는데, 각각이 바꾸는 것이 서로 다릅니다.",
  sections: [
    {
      heading: "용량을 바꾸는 옵션은 화질 하나입니다",
      paragraphs: [
        "PDF 용량은 안에 든 사진 용량의 합과 거의 같습니다. 사진 두 장을 넣은 PDF는 두 사진의 합계보다 1,303바이트 컸을 뿐입니다. 용지를 '이미지 맞춤'에서 A4로 바꿔도 같은 사진 한 장 기준으로 33바이트 차이였습니다. 제출 한도를 넘는다면 화질 옵션을 바꿔야 합니다. 아래 수치는 카메라 원본 사진 10장으로 잰 값입니다.",
        "기준보다 작은 사진은 키우지 않고 그대로 넣습니다. 제출용으로 만든 뒤에는 PDF를 열어 가장 작은 글씨가 읽히는지 확인하고, 읽기 어려우면 인쇄용으로 다시 만드세요.",
      ],
      bullets: [
        "원본: 해상도 유지, JPG 품질 92%. 10장에 48.0MB",
        "인쇄용: 긴 변 3508px(A4 300dpi), 품질 85%. 10장에 9.8MB",
        "제출용: 긴 변 1754px(A4 150dpi), 품질 85%. 10장에 2.8MB",
      ],
    },
    {
      heading: "용지와 방향은 페이지 모양을 정합니다",
      paragraphs: [
        "'이미지 맞춤'은 사진 크기 그대로 페이지를 만듭니다. 사진마다 크기가 다르면 페이지 크기도 제각각이 되므로 화면으로만 볼 자료에 맞습니다.",
        "A4와 Letter는 모든 페이지를 같은 규격으로 만들고, 사진을 비율 그대로 여백 안쪽 가운데에 채워 넣습니다. 방향을 '자동'으로 두면 가로가 더 긴 사진만 가로 페이지가 됩니다. 전부 세로여야 하는 서류라면 '세로'로 고정하세요. 이때 가로 사진은 페이지 폭에 맞춰 작게 들어가고 위아래가 빕니다.",
      ],
    },
    {
      heading: "여백은 인쇄할 때만 신경 쓰면 됩니다",
      paragraphs: [
        "여백은 없음, 좁게(20pt, 약 7mm), 넓게(48pt, 약 17mm) 세 가지입니다. 인쇄할 문서라면 '좁게' 이상을 권합니다. 여백 없이 꽉 채우면 프린터에 따라 가장자리가 잘릴 수 있습니다. '이미지 맞춤'에서 여백을 주면 사진 둘레에 그만큼 테두리가 붙은 페이지가 됩니다.",
      ],
    },
    {
      heading: "넣기 전에 알아둘 점",
      bullets: [
        "PDF 한 개에 30장까지 들어갑니다. 더 많으면 나눠 만든 뒤 PDF 합치기로 이어 붙입니다.",
        "JPG·PNG·WebP를 받고, 어떤 형식이든 PDF 안에는 JPG로 다시 저장해 넣습니다. 투명 배경은 흰색으로 채웁니다.",
        "세로로 찍은 사진은 회전 정보를 읽어 바로 세웁니다. 그래도 누워 보이는 사진은 이미지 회전·반전으로 먼저 돌려 두세요.",
        "PDF 안의 글자는 사진 그대로입니다. 검색하거나 복사할 수 있는 글자로 바뀌지 않습니다.",
        "파일은 images.pdf라는 이름으로 저장됩니다. 제출 전에 이름을 바꾸세요.",
        "사진을 다시 저장해 페이지에 넣는 작업은 열어 둔 탭에서 처리하므로, 신분증이나 통장 사본도 기기 안에서 PDF가 됩니다.",
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
    question: "사진이 30장을 넘으면 어떻게 하나요?",
    answer:
      "PDF 한 개에는 30장까지 들어가고, 넘는 사진은 목록에서 빠지며 안내가 뜹니다. 30장 이하로 나눠 PDF를 여러 개 만든 뒤 PDF 합치기로 이어 붙이면 됩니다. 장수가 많을수록 용량도 커지니 화질은 '제출용'부터 시도해 보세요.",
  },
  {
    question: "만든 PDF 용량이 제출 한도를 넘습니다.",
    answer:
      "PDF 용량은 안에 든 사진 용량의 합과 거의 같습니다. 카메라 사진 10장을 원본 그대로 넣으면 48MB였지만, 화질을 '제출용'(긴 변 1754px)으로 고르면 2.8MB, '인쇄용'(긴 변 3508px)은 9.8MB였습니다. 한도에 맞춰 화질 옵션을 고른 뒤 다시 변환하세요.",
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
