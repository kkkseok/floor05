import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import PdfMergeTool from "@/components/pdf/PdfMergeTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/pdf/merge`;

export const metadata: Metadata = {
  title: "PDF 합치기 - 여러 PDF를 하나로 병합",
  description:
    "여러 개의 PDF 파일을 하나로 합칩니다. 순서를 바꿔가며 병합. 견적서·증빙처럼 밖에 내놓기 어려운 문서도 기기 안에서만 이어집니다. 가입 없이 무료.",
  keywords: [
    "pdf 합치기",
    "pdf 병합",
    "pdf 하나로",
    "pdf 합치기 무료",
    "여러 pdf 합치기",
    "pdf 파일 합치기",
    "pdf merge",
  ],
  openGraph: {
    title: "PDF 합치기 - 여러 PDF를 하나로 병합",
    description: "여러 PDF를 순서대로 하나로. 병합은 기기 안에서 끝납니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 합치기 - 여러 PDF를 하나로 병합",
    description: "흩어진 PDF 최대 20개, 브라우저에서 한 파일로.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "흩어진 PDF를 하나로 모아야 할 때가 있습니다. 견적서와 계약서, 여러 장으로 스캔된 서류, 각각 받은 증빙 자료를 한 파일로 제출할 때죠. 이 도구는 여러 PDF를 올려 순서를 정하고 한 파일로 병합합니다. 문서를 어디에 올리는 대신, 이 페이지가 기기 안에서 페이지들을 이어 붙입니다.",
  sections: [
    {
      heading: "PDF를 순서대로 합치기",
      paragraphs: [
        "합칠 PDF들을 올리면 각 파일의 페이지 수가 표시됩니다. 위·아래 화살표로 순서를 맞춘 뒤 '합치기'를 누르면, 위에서 아래 순서로 모든 페이지가 이어진 하나의 PDF가 만들어집니다.",
        "여러 번에 걸쳐 스캔한 서류나, 사람마다 따로 받은 PDF를 하나로 묶어 제출할 때 유용합니다. 한 번에 최대 20개까지 합칠 수 있고, 그보다 많으면 20개씩 합친 결과를 다시 합치면 됩니다.",
      ],
    },
    {
      heading: "서버에 올리지 않는 PDF 병합",
      paragraphs: [
        "PDF에는 계약 내용, 개인정보, 회사 기밀이 담기기 쉽습니다. 이 도구는 병합을 전부 브라우저 안에서 처리하므로, 파일이 외부 서버로 전송되지 않습니다. 인터넷이 잠깐 끊겨도 작업이 이어지는 이유가 여기 있습니다.",
        "암호가 걸린 PDF는 암호를 먼저 풀어야 합칠 수 있습니다. 합쳐진 PDF는 기기에 바로 저장됩니다.",
      ],
    },
    {
      heading: "이럴 때 PDF를 합칩니다",
      paragraphs: [
        "합치기가 필요한 상황은 대체로 정해져 있습니다. 견적서·계약서·증빙을 한 파일로 묶어 제출할 때, 여러 번에 걸쳐 스캔한 서류를 이어 붙일 때, 앞뒤 표지를 본문에 씌울 때죠. 손에 사진밖에 없다면 먼저 이미지 PDF 변환으로 사진을 PDF로 만든 뒤 다른 PDF와 합치면 한 파일로 정리됩니다.",
        "스캐너로 양면 문서를 뜰 때 앞면과 뒷면을 따로 스캔했다면, 두 묶음을 올려 순서만 번갈아 맞추면 원래 순서로 이어집니다. 다만 옆으로 눕거나 거꾸로 된 PDF는 합쳐도 그 방향 그대로 들어갑니다. 병합은 페이지 순서만 손대고 회전은 건드리지 않으니, 방향이 틀어진 문서는 합치기 전에 바로잡아 두는 게 좋습니다.",
      ],
      bullets: [
        "견적서·계약서·증빙 → 제출용 한 파일로",
        "여러 번 스캔한 서류 → 순서 맞춰 이어 붙이기",
        "사진뿐이라면 → 이미지 PDF 변환 후 병합",
        "누운·거꾸로 된 페이지는 방향 그대로 — 합치기 전에 정리",
      ],
    },
  ],
};

const faqs = [
  {
    question: "PDF를 몇 개까지 합칠 수 있나요?",
    answer: "한 번에 최대 20개까지 올려 하나로 합칠 수 있습니다. 위에서 아래 순서대로 병합됩니다.",
  },
  {
    question: "합치는 순서를 바꿀 수 있나요?",
    answer: "네. 목록의 위·아래 화살표로 순서를 조정한 뒤 합치면 그 순서대로 페이지가 이어집니다.",
  },
  {
    question: "양면을 앞·뒤 따로 스캔했는데 한 파일로 합칠 수 있나요?",
    answer:
      "페이지마다 따로 저장된 PDF라면 목록에서 앞·뒤를 번갈아 배열해 원래 차례로 이을 수 있습니다. 앞면 전체가 한 파일, 뒷면 전체가 한 파일이라면 합치기는 파일 단위라 페이지를 섞지 못합니다. 이때는 먼저 'PDF 분할'로 낱장으로 나눈 뒤 번갈아 올리면 됩니다.",
  },
  {
    question: "페이지가 옆으로 누워서 합쳐집니다.",
    answer:
      "병합은 페이지 순서만 정리하고 회전은 바꾸지 않아, 원본이 누워 있으면 결과도 그대로 눕습니다. 방향이 틀어진 PDF는 합치기 전에 바로 세워 두세요.",
  },
  {
    question: "합친 PDF 용량이 큰데 줄일 수 있나요?",
    answer:
      "병합은 각 파일의 페이지를 그대로 이어 붙여서, 용량은 대략 원본들을 더한 크기가 됩니다. 사진이 많아 무겁다면 합칠 파일 수를 줄이거나, 사진 위주 문서는 이미지 단계에서 미리 용량을 줄여 PDF로 만드는 편이 낫습니다.",
  },
  {
    question: "합치는 PDF가 서버에 올라가나요?",
    answer:
      "아니요. 계약서와 증빙을 한 파일로 묶는 일은 남의 서버가 아니라 이 브라우저가 합니다. 병합 중에도, 끝난 뒤에도 문서는 기기 안에만 있습니다.",
  },
  {
    question: "암호가 걸린 PDF도 합칠 수 있나요?",
    answer:
      "암호가 걸린 PDF는 먼저 암호를 푼 뒤 올려야 합칠 수 있습니다. 읽을 수 없는 파일은 목록에 '읽을 수 없음'으로 표시됩니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PDF 합치기",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description: "여러 PDF를 순서대로 하나로 병합하는 무료 도구. 병합은 기기 안에서 이루어집니다.",
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

export default function PdfMergePage() {
  return (
    <ToolLayout
      title="PDF 합치기"
      description="여러 PDF를 순서대로 하나로. 서버에 올리지 않고 브라우저에서."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/pdf/merge"
      relatedPostSlugs={["image-to-pdf-guide"]}
      schemas={schemas}
    >
      <>
        <PdfMergeTool />

        <section className="mt-6 rounded-lg border border-brand-light/50 bg-brand-paper p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-brand-dark">병합 순서 예시</h2>
            <p className="mt-1 text-sm text-brand-mid">
              올린 파일은 위에서 아래로 이어집니다. 상황별로 이렇게 배열하면 헷갈리지 않습니다.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <caption className="sr-only">상황별로 어떤 파일을 어떤 순서로 합칠지 정리한 표</caption>
              <thead>
                <tr className="border-y border-brand-light/50 bg-brand-light/10 text-left text-brand-dark">
                  <th scope="col" className="px-3 py-2 font-semibold">상황</th>
                  <th scope="col" className="px-3 py-2 font-semibold">올리는 파일</th>
                  <th scope="col" className="px-3 py-2 font-semibold">배열 순서</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light/30">
                <tr>
                  <td className="px-3 py-2">계약서 세트</td>
                  <td className="px-3 py-2">본문 + 별첨</td>
                  <td className="px-3 py-2 text-brand-mid">본문 → 별첨</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">앞뒤 표지 씌우기</td>
                  <td className="px-3 py-2">표지 + 본문</td>
                  <td className="px-3 py-2 text-brand-mid">표지 → 본문 → 뒤표지</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">양면 스캔</td>
                  <td className="px-3 py-2">앞면 묶음 + 뒷면 묶음</td>
                  <td className="px-3 py-2 text-brand-mid">번갈아 배열</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">사진과 문서 섞기</td>
                  <td className="px-3 py-2">이미지 PDF + 기존 PDF</td>
                  <td className="px-3 py-2 text-brand-mid">원하는 자리에 끼워 넣기</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </>
    </ToolLayout>
  );
}
