import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import ExifRemoveTool from "@/components/image/ExifRemoveTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/exif-remove`;

export const metadata: Metadata = {
  title: "EXIF 삭제 - 사진 위치정보·메타데이터 제거",
  description:
    "사진에 담긴 촬영 위치(GPS), 기기 정보, 촬영 시각 같은 EXIF 메타데이터를 제거합니다. SNS·중고거래에 올리기 전 위치 노출 차단. 지우려던 정보가 다른 서버에 남지 않도록, 판독부터 제거까지 브라우저 안에서 무료로 끝냅니다.",
  keywords: [
    "exif 삭제",
    "사진 위치정보 삭제",
    "메타데이터 제거",
    "GPS 정보 삭제",
    "사진 위치 제거",
    "exif 제거",
    "사진 정보 삭제",
  ],
  openGraph: {
    title: "EXIF 삭제 - 사진 위치정보·메타데이터 제거",
    description: "촬영 위치(GPS)·기기 정보·촬영 시각을 제거. 판독부터 삭제까지 브라우저 안에서.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EXIF 삭제 - 사진 위치정보·메타데이터 제거",
    description: "사진의 위치정보·메타데이터를 브라우저에서 바로 제거.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "사진 파일에는 화면에 보이지 않는 기록이 함께 들어 있습니다. 이 도구는 사진을 픽셀만 남기고 새로 저장해 그 기록을 통째로 떼어냅니다. 무엇이 지워지고 무엇이 남는지를 카메라 원본 JPG 두 장으로 확인한 결과와 함께 적었습니다.",
  sections: [
    {
      heading: "지워지는 범위: EXIF, XMP, IPTC 전부",
      paragraphs: [
        "기록은 한 곳에만 있지 않습니다. 확인에 쓴 사진에는 EXIF 말고도 XMP와 IPTC 영역이 따로 있었고, 카메라 본체 일련번호는 EXIF와 XMP 두 곳에 똑같이 적혀 있었습니다. 두 장 모두 GPS 좌표는 없었지만 XMP의 도시·장소 칸에는 촬영지 이름이 글자로 남아 있었습니다.",
        "이 도구는 항목을 골라 지우지 않고 사진 전체를 다시 저장하므로 세 영역이 한꺼번에 사라집니다. 같은 두 장을 처리한 결과 파일의 머리 부분에는 기본 머리말 18바이트와 표준 색 프로필(sRGB) 474바이트만 남았습니다. 위치만 지우고 촬영 시각은 남기는 식의 선택 삭제는 되지 않습니다.",
      ],
      bullets: [
        "촬영 위치(GPS 좌표)와 장소 이름",
        "촬영 날짜·시각, 노출 설정",
        "기기·렌즈 모델과 일련번호",
        "촬영자 이름, 설명문, 보정 프로그램과 보정 이력",
      ],
    },
    {
      heading: "목록에 뜨는 표시 읽는 법",
      paragraphs: [
        "사진을 올리면 지우기 전에 파일을 읽어 상태를 표시합니다.",
        "이 사전 확인은 JPG의 EXIF 영역만 봅니다. 앞의 사례처럼 장소가 XMP에 글자로 적힌 사진은 경고 없이 지나가므로, '없음'으로 나와도 남에게 보낼 사진이라면 지워 두는 편이 안전합니다.",
      ],
      bullets: [
        "'위치정보(GPS) 포함': EXIF의 GPS 영역에 위도나 경도가 실제로 적혀 있을 때만 뜹니다.",
        "'촬영정보(EXIF) 포함': 좌표는 없고 EXIF는 있는 사진입니다.",
        "'촬영정보(EXIF) 없음': JPG를 읽었는데 EXIF가 없는 사진입니다.",
        "PNG와 WebP는 미리 확인하지 않습니다. 표시와 상관없이 제거는 똑같이 됩니다.",
      ],
    },
    {
      heading: "화질과 용량은 이렇게 바뀝니다",
      paragraphs: [
        "JPG와 WebP는 품질 95%로, PNG는 무손실로 다시 저장합니다. 해상도는 바꾸지 않습니다. 새로 저장하는 방식이라 용량은 달라집니다. 확인에 쓴 15.78MB 사진은 8.76MB로, 9.18MB 사진은 5.55MB로 줄었고 처리에는 장당 0.9초 안팎이 걸렸습니다. 반대로 원래 낮은 품질로 저장돼 있던 JPG는 95%로 다시 저장되면서 용량이 늘 수 있습니다.",
        "세로로 찍은 사진은 회전 정보를 픽셀에 반영한 뒤 저장하므로, 기록을 지워도 옆으로 눕지 않습니다. 원본에 들어 있던 색 프로필은 결과 파일에 유지되지 않습니다.",
      ],
    },
    {
      heading: "지운 뒤에도 남는 것",
      paragraphs: [
        "한 번에 10장까지 올릴 수 있고, 한 장이면 바로 저장되며 여러 장이면 ZIP 하나로 받습니다.",
      ],
      bullets: [
        "사진에 찍힌 내용: 간판, 창밖 풍경, 우편물의 주소는 파일의 기록과 상관없이 화면에 그대로 보입니다. 이런 부분은 사진 모자이크로 가립니다.",
        "파일 이름: 결과 파일은 원본 이름 뒤에 '_noexif'만 붙습니다. 이름에 촬영 날짜나 시각이 들어 있으면 그대로 남습니다.",
        "원본 파일: 정보가 빠진 사본을 새로 만들 뿐이고 원본은 그대로입니다. 보낼 때 원본을 고르지 않도록 확인하세요.",
      ],
    },
  ],
};

const faqs = [
  {
    question: "EXIF를 지우면 사진 화질이 떨어지나요?",
    answer:
      "거의 그대로입니다. JPG는 품질 95%로 다시 저장해 차이를 눈으로 알아채기 어렵고, PNG는 무손실이라 화질이 유지됩니다.",
  },
  {
    question: "위치정보(GPS)만 골라 지울 수 있나요?",
    answer:
      "이 도구는 위치정보를 포함한 모든 메타데이터(기기·시각 등)를 함께 제거합니다. 원본에 위치정보가 있었으면 목록에 '위치정보(GPS) 포함'으로 표시해 알려줍니다.",
  },
  {
    question: "SNS에 올리면 자동으로 지워지지 않나요?",
    answer:
      "플랫폼마다 처리 방식이 달라 장담할 수 없습니다. 자동으로 떼 주는 곳도 있지만, 카톡 원본 전송이나 메일 첨부처럼 파일을 그대로 넘기는 경로에서는 위치정보가 딸려갑니다. 여기서 먼저 지워 두면 어디로 보내든 신경 쓸 일이 없습니다.",
  },
  {
    question: "삭제 후에도 남는 정보가 있나요?",
    answer:
      "파일의 기록 영역에는 기본 머리말과 표준 색 프로필(sRGB)만 남습니다. 카메라 원본 두 장으로 확인했을 때 EXIF·XMP·IPTC가 모두 비워졌습니다. 사진에 찍힌 간판이나 주소, 날짜가 들어간 파일 이름은 이 도구가 건드리지 않으니 따로 확인하세요. 읽고 다시 저장하는 과정은 사진을 고른 탭 안에서 이루어집니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "EXIF 삭제",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "사진의 EXIF(위치·기기·시각) 메타데이터를 제거하는 무료 도구. 판독과 제거 모두 브라우저 안에서 이루어집니다.",
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

export default function ExifRemovePage() {
  return (
    <ToolLayout
      title="EXIF 삭제"
      description="사진의 위치정보·촬영정보를 제거. 올리기 전 GPS 노출을 막습니다."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/image/exif-remove"
      relatedPostSlugs={["exif-removal-guide", "browser-image-tools-privacy"]}
      schemas={schemas}
    >
      <ExifRemoveTool />
    </ToolLayout>
  );
}
