import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import MosaicTool from "@/components/image/MosaicTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/mosaic`;

export const metadata: Metadata = {
  title: "사진 모자이크 - 얼굴·개인정보 가리기",
  description:
    "사진에서 얼굴, 차량 번호판, 주소 같은 개인정보를 드래그로 가립니다. 모자이크·블러 선택, 강도 조절. 가려야 할 만큼 민감한 사진이니, 원본은 브라우저 밖으로 내보내지 않습니다. 무료로 쓰세요.",
  keywords: [
    "사진 모자이크",
    "얼굴 모자이크",
    "모자이크 처리",
    "사진 가리기",
    "개인정보 가리기",
    "이미지 블러",
    "번호판 가리기",
  ],
  openGraph: {
    title: "사진 모자이크 - 얼굴·개인정보 가리기",
    description: "드래그로 얼굴·번호판·주소를 모자이크·블러 처리. 원본은 기기 밖으로 나가지 않습니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사진 모자이크 - 얼굴·개인정보 가리기",
    description: "가리기 전 원본이 기기 밖으로 나가지 않는 모자이크 도구.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "사진에서 가릴 부분을 드래그하면 그 사각형을 모자이크나 블러로 덮습니다. 여러 곳을 차례로 드래그할 수 있습니다. 얼마나 알아보기 어려워지는지는 '강도' 숫자와 가리는 대상의 크기가 함께 정하므로, 숫자가 뜻하는 바를 알고 쓰는 편이 좋습니다.",
  sections: [
    {
      heading: "강도 숫자는 칸 한 변의 크기입니다",
      paragraphs: [
        "강도는 4부터 40까지 고를 수 있고 처음 값은 12입니다. 이 숫자는 모자이크 칸 한 변의 픽셀 수입니다. 편집 화면은 사진의 긴 변을 최대 2000px로 맞춰 보여주고, 강도는 그 화면을 기준으로 적용됩니다. 저장할 때는 원본 해상도에 맞춰 칸을 같은 비율로 키워 다시 적용하므로 화면에서 본 굵기 그대로 저장됩니다.",
        "가려지는 정도는 대상 위에 칸이 몇 개 올라가느냐에 달려 있습니다. 폭 120px로 찍힌 얼굴에 강도 12를 주면 가로로 칸이 10개뿐이라 알아보기 어렵습니다. 폭 800px로 크게 찍힌 얼굴에 같은 강도를 주면 칸이 60개 넘게 올라가 윤곽이 그대로 보입니다. 대상이 클수록 강도를 올려야 합니다.",
      ],
    },
    {
      heading: "글자를 가릴 때는 블러보다 모자이크가 낫습니다",
      paragraphs: [
        "두 방식 모두 선택한 영역을 강도만큼 작게 줄였다가 원래 크기로 되돌립니다. 모자이크는 되돌릴 때 칸을 각진 채로 키우고, 블러는 칸 사이를 부드럽게 이어 붙입니다. 줄이는 정도는 같아도 되돌리는 방식이 달라 남는 흔적이 다릅니다. 숫자열을 강도별로 가려 비교해 보니 블러는 모든 조합에서 모자이크와 같거나 더 많은 흔적을 남겼습니다. 블러가 사진에 더 자연스럽게 어울리지만, 글자를 가리는 용도라면 모자이크를 쓰세요.",
        "번호판이나 주소 같은 글자를 가릴 때는 칸이 글자 한 자만큼은 커야 합니다. 칸이 획보다 조금 큰 정도면 글자의 윤곽이 남아 짐작할 수 있습니다. 작은 글씨는 영역을 넉넉히 잡고 강도를 끝까지 올리세요.",
      ],
    },
    {
      heading: "한계와 돌아가는 방법",
      bullets: [
        "가리는 모양은 사각형뿐입니다. 얼굴을 자동으로 찾아 주지 않으니 직접 드래그합니다.",
        "한 곳만 취소하는 기능은 없습니다. '초기화'를 누르면 적용한 영역이 모두 사라집니다.",
        "가로나 세로가 4px보다 작은 드래그는 무시됩니다.",
        "강도 40으로도 큰 얼굴의 윤곽이 남으면 이미지 리사이즈로 긴 변을 2000px보다 충분히 작게 줄인 뒤 가리세요. 사진이 작아지면 같은 강도의 칸이 대상에 비해 커집니다.",
      ],
    },
    {
      heading: "저장되는 파일",
      paragraphs: [
        "결과는 원본과 같은 해상도로 저장되고 파일 이름 뒤에 '_모자이크'가 붙습니다. 형식은 올린 파일을 따릅니다. PNG는 PNG로, WebP는 WebP로, 그 밖에는 JPG로 저장하며 JPG와 WebP는 품질 92%로 다시 인코딩합니다. 사진 전체를 새로 저장하는 방식이라 원본 파일에 들어 있던 촬영 위치 같은 메타데이터는 결과 파일에 따라오지 않습니다.",
        "저장된 파일의 가린 영역에는 원래 픽셀이 들어 있지 않습니다. 원본 파일은 바뀌지 않으니, 나중에 다시 손볼 일이 있으면 원본을 따로 보관해 두세요.",
      ],
    },
  ],
};

const faqs = [
  {
    question: "얼굴이나 번호판을 어떻게 가리나요?",
    answer:
      "가릴 부분을 마우스나 손가락으로 드래그하면 그 영역이 모자이크 또는 블러로 가려집니다. 여러 곳을 차례로 드래그할 수 있습니다.",
  },
  {
    question: "가린 부분을 복원할 수 있나요?",
    answer:
      "복원되지 않습니다. 가린 영역은 원래 픽셀이 새 값으로 덮여 사라지므로 되살릴 수 없습니다. 그만큼 안전하니, 수정에 대비해 가리기 전 원본만 따로 보관해 두세요.",
  },
  {
    question: "모자이크와 블러 중 뭐가 더 안전한가요?",
    answer:
      "안전도는 방식보다 강도에서 갈립니다. 강도를 높게 주면 모자이크든 블러든 알아보기 어렵고, 약하게 두면 어느 쪽이든 형태가 비칩니다. 확실히 가려야 할 곳은 강도를 넉넉히 올리세요.",
  },
  {
    question: "강도를 최대로 올려도 얼굴 윤곽이 보여요.",
    answer:
      "얼굴이 사진에서 크게 찍힌 경우입니다. 강도는 칸 한 변의 크기라서 최대 40이어도 큰 얼굴 위에는 칸이 여러 개 올라갑니다. 이미지 리사이즈로 긴 변이 2000px보다 충분히 작아지게 줄인 뒤 다시 가리면, 같은 강도에서도 얼굴 위에 올라가는 칸 수가 줄어듭니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "사진 모자이크",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "사진에서 얼굴·개인정보를 드래그로 모자이크·블러 처리하는 무료 도구. 원본은 기기 밖으로 나가지 않습니다.",
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

export default function MosaicPage() {
  return (
    <ToolLayout
      title="사진 모자이크"
      description="가릴 부분을 드래그하면 모자이크·블러로. 얼굴·번호판·개인정보를 안전하게."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/image/mosaic"
      relatedPostSlugs={["photo-mosaic-guide", "browser-image-tools-privacy"]}
      schemas={schemas}
    >
      <MosaicTool />
    </ToolLayout>
  );
}
