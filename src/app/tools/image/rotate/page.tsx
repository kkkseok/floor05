import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import RotateTool from "@/components/image/RotateTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/image/rotate`;

export const metadata: Metadata = {
  title: "사진 회전·반전 - 세로로 찍힌 사진 바로잡기",
  description:
    "사진을 90도씩 회전하거나 좌우·상하로 뒤집습니다. 세로로 찍혀 돌아간 사진 바로 세우기, 셀카 좌우 복원까지. 방향만 바꾸고 해상도는 그대로 저장합니다.",
  keywords: [
    "사진 회전",
    "이미지 회전",
    "사진 좌우반전",
    "사진 돌리기",
    "이미지 뒤집기",
    "사진 방향 바꾸기",
    "세로 사진 회전",
  ],
  openGraph: {
    title: "사진 회전·반전 - 세로로 찍힌 사진 바로잡기",
    description: "90도 회전·좌우/상하 반전. 사진을 올리지 않고 브라우저에서 바로.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "사진 회전·반전 - 세로로 찍힌 사진 바로잡기",
    description: "90도 회전·좌우/상하 반전을 브라우저에서 바로.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "휴대폰으로 찍은 사진이 옆으로 누워 있거나, 거울처럼 좌우가 바뀌어야 할 때가 있습니다. 이 도구는 사진을 90도씩 회전하거나 좌우·상하로 뒤집어 바로잡습니다. 별도 프로그램 없이 브라우저에서 처리합니다.",
  sections: [
    {
      heading: "회전과 반전, 무엇이 다른가",
      paragraphs: [
        "회전은 사진을 시계 방향·반시계 방향으로 90도씩 돌리는 것이고, 반전은 거울처럼 좌우 또는 상하를 뒤집는 것입니다. 세로로 찍혀 돌아간 사진은 회전으로, 셀카처럼 좌우가 반대인 사진은 좌우 반전으로 바로잡습니다.",
        "헷갈리기 쉬운 조합이 '상하 반전'과 '180도 회전'입니다. 둘 다 사진이 뒤집혀 보이지만 결과가 다릅니다. 180도 회전은 사진을 통째로 돌린 것이라 글자가 거꾸로 보이고, 상하 반전은 수면에 비친 것처럼 위아래만 뒤집힌 거울상이 됩니다. 문서 사진이 거꾸로 스캔됐다면 필요한 건 반전이 아니라 180도 회전(90도 버튼 두 번)입니다.",
      ],
    },
    {
      heading: "내 화면에선 멀쩡한데 올리면 돌아가는 이유",
      paragraphs: [
        "휴대폰은 사진을 찍을 때 픽셀을 실제로 돌려 저장하는 대신, 파일 안에 '이 사진은 세로로 찍었음'이라는 방향 태그(EXIF Orientation)만 기록하는 경우가 많습니다. 갤러리 앱은 이 태그를 읽어 바로 세워 보여주지만, 태그를 무시하는 웹사이트나 오래된 프로그램에 올리면 사진이 옆으로 누워 버립니다. 분명 내 폰에서는 멀쩡했는데 게시판에서만 돌아가 있는 이유가 이것입니다.",
        "이 도구는 사진을 불러올 때 방향 태그를 반영해 한 번 바로 세운 뒤, 저장할 때는 태그가 아니라 픽셀 자체를 돌려 기록합니다. 그래서 결과 파일은 어떤 프로그램에서 열어도 같은 방향으로 보입니다.",
      ],
    },
    {
      heading: "이럴 때 쓰면 됩니다",
      paragraphs: [
        "90도 단위 회전과 반전은 잘리는 부분 없이 해상도도 그대로입니다. 다만 JPG는 저장할 때 품질 92%로 다시 압축하므로, 같은 파일을 돌려 저장하기를 여러 번 반복하기보다 원본에서 한 번에 원하는 방향으로 맞추는 편이 좋습니다.",
      ],
      bullets: [
        "중고거래·쇼핑몰 상품 사진이 옆으로 누워서 올라갈 때",
        "복합기·스캔 앱으로 읽은 문서가 거꾸로 저장됐을 때",
        "전면 카메라 셀카의 좌우가 실제와 반대로 찍혔을 때",
        "블로그·게시판에 올린 사진만 유독 돌아가 보일 때",
      ],
    },
  ],
};

const faqs = [
  {
    question: "세로로 찍힌 사진을 어떻게 세우나요?",
    answer: "'왼쪽 90°' 또는 '오른쪽 90°' 버튼으로 사진을 바로 세운 뒤 다운로드하면 됩니다.",
  },
  {
    question: "좌우 반전은 언제 쓰나요?",
    answer:
      "셀카처럼 좌우가 거울처럼 뒤집힌 사진이나, 방향을 바꿔야 하는 이미지에 씁니다. '좌우 반전' 버튼을 누르면 됩니다.",
  },
  {
    question: "회전하면 화질이 나빠지나요?",
    answer:
      "해상도는 그대로지만, JPG·WebP 사진은 저장할 때 품질 92%로 다시 압축합니다. 한 번은 눈으로 구분하기 어려운 정도인데, 돌려서 저장한 파일을 또 돌려 저장하기를 반복하면 손실이 쌓입니다. PNG는 무손실로 저장돼 몇 번을 돌려도 같습니다.",
  },
  {
    question: "폰에서는 똑바로 보이는데 PC로 옮기면 누워 있어요. 왜 그런가요?",
    answer:
      "사진 파일에 방향 태그(EXIF)만 기록돼 있고 픽셀은 돌아간 채 저장된 경우입니다. 태그를 무시하는 프로그램에서는 누워 보입니다. 이 도구로 회전해 저장하면 픽셀 자체가 바로 세워져 어디서 열어도 똑바로 보입니다.",
  },
  {
    question: "돌린 사진이 서버로 전송되나요?",
    answer:
      "아니요. 회전·반전은 픽셀 위치만 바꾸는 가벼운 연산이라 여러분의 브라우저 안에서 바로 끝납니다. 사진이 floor05 서버로 올라갈 일 자체가 없습니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "사진 회전·반전",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "사진을 90도 회전하거나 좌우·상하로 반전하는 무료 도구. 회전 연산은 이 브라우저가 맡습니다.",
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

const workflowCTA = {
  message: "방향은 바로잡았고, 다음 작업이 남았다면.",
  tools: [
    {
      name: "이미지 크롭",
      href: "/tools/image/crop",
      description: "필요 없는 부분 잘라내기",
    },
    {
      name: "이미지 리사이즈",
      href: "/tools/image/resize",
      description: "업로드 규격에 맞게 크기 조절",
    },
    {
      name: "이미지 압축",
      href: "/tools/image/compress",
      description: "용량 줄여서 가볍게",
    },
  ],
};

export default function RotatePage() {
  return (
    <ToolLayout
      title="사진 회전·반전"
      description="세로로 찍힌 사진을 바로. 90도 회전·좌우/상하 반전, 업로드 없이 기기에서."
      guide={guide}
      faqs={faqs}
      workflowCTA={workflowCTA}
      currentToolHref="/tools/image/rotate"
      relatedPostSlugs={["image-rotate-quality", "photo-editing-without-photoshop", "image-crop-guide"]}
      schemas={schemas}
    >
      <RotateTool />
    </ToolLayout>
  );
}
