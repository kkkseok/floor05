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
    "여러 PDF를 올려 순서를 정하면 모든 페이지를 차례로 이은 PDF 한 개를 만듭니다. 견적서와 계약서, 나눠 스캔한 서류, 따로 받은 증빙을 한 파일로 제출해야 할 때 씁니다. 결과는 merged.pdf라는 이름으로 기기에 저장됩니다.",
  sections: [
    {
      heading: "PDF를 순서대로 합치기",
      paragraphs: [
        "파일을 올리면 목록에 이름과 페이지 수가 뜹니다. 위·아래 화살표로 순서를 맞추고 합치기를 누르면 목록 맨 위 파일의 첫 페이지부터 맨 아래 파일의 마지막 페이지까지 이어집니다. 파일은 2개 이상이어야 하고, 여러 번에 나눠 올려도 합계 20개까지 담을 수 있습니다. 그보다 많으면 20개씩 합친 결과물을 다시 합치면 됩니다.",
        "합치는 단위는 파일입니다. 한 파일에서 일부 페이지만 넣거나 두 파일의 페이지를 한 장씩 섞는 기능은 없습니다. 그런 작업은 PDF 분할에서 필요한 페이지를 먼저 꺼낸 뒤 여기에 순서대로 올리는 식으로 합니다.",
      ],
    },
    {
      heading: "합쳐도 바뀌지 않는 것",
      paragraphs: [
        "병합은 각 페이지를 원래 모습대로 새 문서에 옮겨 담습니다. 페이지 크기와 방향을 통일하지 않으므로, 세로 문서와 가로로 누운 스캔본을 합치면 결과에도 두 가지가 섞여 있습니다. 옆으로 눕거나 거꾸로 된 페이지도 그대로 들어가니 방향이 틀어진 문서는 합치기 전에 바로잡아 두는 게 좋습니다.",
        "용량도 줄지 않습니다. 페이지 안의 이미지를 다시 압축하지 않기 때문에 결과 파일은 대략 원본들을 더한 크기가 됩니다. 사진이 많아 무거운 문서라면 사진 단계에서 용량을 줄여 PDF로 만든 다음 합치는 순서가 맞습니다.",
        "문서 사이에 구분 페이지나 새 쪽번호가 붙지도 않습니다. 묶음마다 경계가 필요하면 간지로 쓸 한 장짜리 PDF를 만들어 목록의 해당 자리에 끼워 넣으세요.",
      ],
    },
    {
      heading: "암호가 걸렸거나 읽히지 않는 파일",
      paragraphs: [
        "암호로 보호된 PDF는 목록에 '암호로 보호됨'으로 표시되고, 그 파일이 목록에 있는 동안에는 합치기 버튼이 눌리지 않습니다. PDF 뷰어에서 연 뒤 인쇄 메뉴의 'PDF로 저장'으로 보호 없는 사본을 만들어 다시 올리면 됩니다. 손상됐거나 PDF가 아닌 파일은 '읽을 수 없음'으로 표시되며, 해당 파일만 목록에서 빼면 나머지는 바로 합칠 수 있습니다.",
      ],
    },
    {
      heading: "이럴 때 PDF를 합칩니다",
      paragraphs: [
        "양면 문서의 앞면과 뒷면을 따로 스캔했다면, 페이지마다 낱장 파일로 저장된 경우에 번갈아 배열해 원래 순서로 이을 수 있습니다. 손에 사진밖에 없다면 이미지 PDF 변환으로 먼저 PDF를 만든 뒤 다른 문서 사이 원하는 자리에 끼워 넣습니다.",
      ],
      bullets: [
        "견적서·계약서·증빙: 제출 순서대로 한 파일로",
        "앞뒤 표지: 표지, 본문, 뒤표지 순으로 배열",
        "사진 자료: 이미지 PDF 변환을 거친 뒤 병합",
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
    question: "열 때 암호를 묻지 않는 PDF인데 '암호로 보호됨'이라고 나옵니다.",
    answer:
      "편집이나 복사를 제한하는 권한 암호가 걸린 파일입니다. 내용은 열려도 파일 자체는 암호화돼 있어 페이지를 옮겨 담을 수 없습니다. PDF 뷰어의 인쇄 메뉴에서 'PDF로 저장'을 골라 사본을 만들어 올리면 합쳐집니다. 사본을 만드는 일도 뷰어가 내 기기에서 하므로 계약서를 다른 곳에 맡길 필요가 없습니다.",
  },
  {
    question: "암호가 걸린 PDF도 합칠 수 있나요?",
    answer:
      "암호가 걸린 PDF는 먼저 암호를 푼 뒤 올려야 합칠 수 있습니다. 암호가 걸린 파일은 목록에 '암호로 보호됨'으로, 손상돼 열리지 않는 파일은 '읽을 수 없음'으로 표시됩니다.",
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
