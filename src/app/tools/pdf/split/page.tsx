import type { Metadata } from "next";
import ToolLayout from "@/components/common/ToolLayout";
import PdfSplitTool from "@/components/pdf/PdfSplitTool";
import { SITE_URL } from "@/lib/common/constants";

const PAGE_URL = `${SITE_URL}/tools/pdf/split`;

export const metadata: Metadata = {
  title: "PDF 분할 - 페이지 추출·낱장 나누기",
  description:
    "PDF에서 원하는 페이지만 추출하거나, 모든 페이지를 낱장으로 나눠 ZIP으로 받습니다. 계약서에서 한 페이지를 꺼내는 동안에도 문서는 기기 밖으로 나가지 않습니다. 가입도 결제도 없습니다.",
  keywords: [
    "pdf 분할",
    "pdf 나누기",
    "pdf 페이지 분리",
    "pdf 페이지 추출",
    "pdf 자르기",
    "pdf 페이지 나누기",
    "pdf split",
  ],
  openGraph: {
    title: "PDF 분할 - 페이지 추출·낱장 나누기",
    description: "원하는 페이지만 추출하거나 모든 페이지를 낱장으로. 문서는 기기 안에서만 나뉩니다.",
    url: PAGE_URL,
    type: "website",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PDF 분할 - 페이지 추출·낱장 나누기",
    description: "100페이지 PDF도 브라우저에서 바로 낱장으로.",
  },
  alternates: { canonical: PAGE_URL },
};

const guide = {
  intro:
    "PDF 전체가 아니라 일부 페이지만 필요할 때가 있습니다. 계약서에서 서명 페이지만, 자료집에서 특정 장만 떼어내고 싶을 때죠. 이 도구는 원하는 페이지만 뽑아 새 PDF로 만들거나, 모든 페이지를 낱장으로 나눠줍니다.",
  sections: [
    {
      heading: "페이지 추출과 낱장 분할",
      paragraphs: [
        "두 가지 방식이 있습니다. '페이지 추출'은 1-3, 5처럼 원하는 페이지를 입력하면 그 페이지들만 모아 새 PDF 한 개를 만듭니다. '낱장 전부 분할'은 모든 페이지를 1장짜리 PDF로 나눈 뒤 ZIP 한 개로 묶어 받습니다.",
      ],
      bullets: [
        "페이지 추출: '1-3, 5, 8-10' 처럼 쉼표로 여러 범위를 지정",
        "입력한 순서대로 새 PDF에 담깁니다",
        "낱장 분할: 100페이지 PDF면 100개 파일이 ZIP으로",
      ],
    },
    {
      heading: "서버에 올리지 않는 PDF 분할",
      paragraphs: [
        "서명 페이지 한 장이 필요하다고 계약서 전체를 외부 서버에 올리는 건 배보다 배꼽이 큰 일입니다. 이 도구는 문서를 브라우저 안에서 읽고 나누기 때문에 파일이 밖으로 나가지 않고, 업로드 대기가 없어 페이지가 많아도 금방 나뉩니다.",
        "암호가 걸린 PDF는 암호를 먼저 풀어야 합니다. 결과물은 기기에 바로 저장됩니다.",
      ],
    },
    {
      heading: "언제 추출하고, 언제 낱장으로 나누나",
      paragraphs: [
        "두 모드는 목적이 다릅니다. 계약서에서 서명 페이지만, 자료집에서 특정 장(章)만 떼어 보낼 때는 '페이지 추출'이 맞습니다. 원하는 페이지만 한 파일에 모여 전달하고 보관하기 편합니다. 반대로 페이지를 각각 다른 사람에게 나눠 주거나 낱개로 저장해 두려면 '낱장 전부 분할'로 한 장씩 쪼개 ZIP으로 받는 편이 낫습니다.",
        "추출 순서와 페이지 번호에는 주의가 필요합니다. '5, 3, 1'처럼 거꾸로 적으면 새 PDF도 5·3·1 순서로 담기고, 원본 순서를 지키려면 오름차순으로 적으면 됩니다. 여기서 페이지 번호는 표지를 1로 세는 실제 순서라, 문서 하단에 인쇄된 쪽번호와 어긋날 수 있으니 미리보기로 한 번 확인하는 게 안전합니다.",
      ],
      bullets: [
        "특정 페이지만 필요 → 페이지 추출 (예: '2-4, 9')",
        "페이지별로 따로 보관·전달 → 낱장 전부 분할(ZIP)",
        "'5, 3, 1'로 적으면 그 차례대로 담김 — 역순 추출도 가능",
        "페이지 번호는 표지를 1로 세는 실제 순서 기준",
      ],
    },
  ],
};

const faqs = [
  {
    question: "원하는 페이지만 뽑을 수 있나요?",
    answer:
      "네. '페이지 추출' 모드에서 1-3, 5처럼 입력하면 해당 페이지만 담은 새 PDF 한 개가 만들어집니다.",
  },
  {
    question: "모든 페이지를 낱장으로 나눌 수 있나요?",
    answer:
      "'낱장 전부 분할' 모드를 쓰면 모든 페이지가 1장짜리 PDF로 나뉘어 ZIP 한 개로 묶여 다운로드됩니다.",
  },
  {
    question: "페이지 범위는 어떻게 입력하나요?",
    answer:
      "쉼표로 여러 범위를 지정합니다. 예를 들어 '1-3, 5, 8-10'은 1·2·3·5·8·9·10페이지를 입력한 순서대로 추출합니다.",
  },
  {
    question: "페이지 순서를 바꿔서 추출할 수 있나요?",
    answer:
      "네. '5, 3, 1'처럼 원하는 차례로 적으면 새 PDF에도 그 순서 그대로 담깁니다. 원본 순서를 지키려면 오름차순으로 입력하세요.",
  },
  {
    question: "추출·분할한 파일 용량이 큰데 줄일 수 있나요?",
    answer:
      "페이지를 떼어낼 때 그 페이지가 쓰는 글꼴·이미지도 함께 옮겨 담습니다. 그래서 글꼴을 내장한 한글 문서는 한 장짜리 파일도 글꼴만큼 무겁고, 낱장 분할 ZIP은 같은 글꼴이 페이지 수만큼 반복돼 원본보다 커질 수 있습니다. 필요한 페이지만 '페이지 추출'로 한 파일에 담으면 글꼴이 한 번만 들어가 가장 가볍습니다.",
  },
  {
    question: "분할하는 PDF가 서버에 올라가나요?",
    answer:
      "아니요. 페이지를 떼어내는 작업은 브라우저가 문서를 직접 읽어 그 자리에서 처리합니다. 계약서 전체를 서버에 올려 두고 한 페이지만 돌려받는 방식이 아닙니다.",
  },
];

const schemas = [
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PDF 분할",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
    description:
      "PDF에서 원하는 페이지만 추출하거나 모든 페이지를 낱장으로 나누는 무료 도구. 문서는 브라우저 밖으로 나가지 않습니다.",
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

export default function PdfSplitPage() {
  return (
    <ToolLayout
      title="PDF 분할"
      description="원하는 페이지만 추출하거나, 모든 페이지를 낱장으로. 문서는 기기 안에서만."
      guide={guide}
      faqs={faqs}
      currentToolHref="/tools/pdf/split"
      relatedPostSlugs={["image-to-pdf-guide"]}
      schemas={schemas}
    >
      <>
        <PdfSplitTool />

        <section className="mt-6 rounded-lg border border-brand-light/50 bg-brand-paper p-4 shadow-sm">
          <div className="mb-3">
            <h2 className="text-lg font-semibold text-brand-dark">페이지 추출 입력 예시</h2>
            <p className="mt-1 text-sm text-brand-mid">
              쉼표로 여러 구간을, 하이픈으로 범위를 지정합니다. 적은 순서 그대로 새 PDF에 담깁니다.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <caption className="sr-only">페이지 추출 입력값과 그 결과를 정리한 표</caption>
              <thead>
                <tr className="border-y border-brand-light/50 bg-brand-light/10 text-left text-brand-dark">
                  <th scope="col" className="px-3 py-2 font-semibold">입력</th>
                  <th scope="col" className="px-3 py-2 font-semibold">추출되는 페이지</th>
                  <th scope="col" className="px-3 py-2 font-semibold">활용 예</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-light/30">
                <tr>
                  <td className="px-3 py-2">3</td>
                  <td className="px-3 py-2">3페이지 한 장</td>
                  <td className="px-3 py-2 text-brand-mid">서명 페이지만</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">1-5</td>
                  <td className="px-3 py-2">1·2·3·4·5페이지</td>
                  <td className="px-3 py-2 text-brand-mid">앞부분 한 묶음</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">1-3, 7, 10-12</td>
                  <td className="px-3 py-2">1·2·3·7·10·11·12페이지</td>
                  <td className="px-3 py-2 text-brand-mid">흩어진 구간 한 번에</td>
                </tr>
                <tr>
                  <td className="px-3 py-2">5, 3, 1</td>
                  <td className="px-3 py-2">5·3·1페이지(적은 순서대로)</td>
                  <td className="px-3 py-2 text-brand-mid">역순으로 추출</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </>
    </ToolLayout>
  );
}
