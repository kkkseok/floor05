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
    "PDF 전체가 아니라 일부 페이지만 필요할 때가 있습니다. 계약서에서 서명 페이지만, 자료집에서 특정 장만 떼어 보내는 경우입니다. 이 도구는 PDF 한 개를 받아 원하는 페이지만 새 PDF로 뽑거나, 모든 페이지를 한 장짜리 파일로 나눕니다.",
  sections: [
    {
      heading: "페이지 추출과 낱장 분할",
      paragraphs: [
        "'페이지 추출'은 입력한 페이지만 모아 PDF 한 개를 만들고, 파일 이름은 원본 이름 뒤에 _추출이 붙습니다. '낱장 전부 분할'은 모든 페이지를 한 장짜리 PDF로 나눠 ZIP 한 개로 묶습니다. ZIP 안의 파일에는 원본이름_01, _02처럼 페이지 번호가 붙고 자릿수는 전체 페이지 수에 맞춰집니다. 100페이지 문서라면 _001부터 _100까지입니다. 어느 방식이든 원본 파일은 그대로 두고 새 파일을 만듭니다.",
      ],
      bullets: [
        "정해진 페이지만 보낼 때: 페이지 추출",
        "페이지마다 다른 사람에게 주거나 따로 보관할 때: 낱장 전부 분할",
      ],
    },
    {
      heading: "페이지 범위 쓰는 법",
      paragraphs: [
        "쉼표로 구간을 나누고 하이픈으로 범위를 적습니다. '1-3, 5, 8-10'이면 1·2·3·5·8·9·10페이지가 적은 순서대로 담깁니다. '5, 3, 1'로 적으면 새 PDF도 그 차례가 되고, '5-3'처럼 큰 수를 앞에 두면 5·4·3 역순으로 들어갑니다. 같은 번호를 두 번 적으면 그 페이지가 두 번 들어갑니다. 쉼표와 하이픈 주변의 띄어쓰기는 있어도 없어도 결과가 같습니다.",
        "문서에 없는 페이지 번호가 하나라도 섞이면 일부만 뽑지 않고 입력을 다시 확인하라고 안내합니다. 숫자, 쉼표, 하이픈 외의 글자가 들어가도 마찬가지입니다. 여기서 번호는 첫 장을 1로 세는 순서입니다. 표지나 목차가 앞에 있는 문서는 하단에 인쇄된 쪽번호와 어긋나므로, PDF 뷰어가 표시하는 페이지 번호를 보고 적는 것이 안전합니다.",
      ],
    },
    {
      heading: "나눈 파일이 원본보다 커질 때",
      paragraphs: [
        "페이지를 옮길 때 그 페이지가 쓰는 글꼴과 이미지도 함께 따라갑니다. 글꼴을 내장한 문서를 낱장으로 나누면 파일마다 같은 글꼴이 다시 들어가 ZIP 전체가 원본보다 몇 배 커질 수 있습니다. 필요한 페이지가 정해져 있다면 페이지 추출로 한 파일에 모으는 쪽이 가볍습니다. 글꼴이 한 번만 들어가기 때문입니다.",
      ],
    },
    {
      heading: "암호가 걸린 PDF는 나눌 수 없습니다",
      paragraphs: [
        "보호된 PDF는 파일을 고르는 단계에서 걸러지고, 왜 안 되는지와 해결 방법이 화면에 나옵니다. 문서를 볼 때 암호를 요구하지 않더라도 편집 제한이 걸려 있으면 같은 안내를 받습니다. 뷰어에서 인쇄를 누르고 출력 대상을 'PDF로 저장'으로 바꿔 새 파일을 만든 뒤 그 파일을 올리세요. 분할은 한 번에 PDF 한 개만 받습니다.",
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
    question: "낱장으로 나눈 파일 이름은 어떻게 붙나요?",
    answer:
      "원본 파일 이름 뒤에 페이지 번호가 붙습니다. 보고서.pdf가 12페이지라면 보고서_01.pdf부터 보고서_12.pdf까지 만들어져 보고서_분할.zip에 담깁니다. 번호 자릿수를 전체 페이지 수에 맞추므로 폴더에서 이름순으로 정렬해도 페이지 순서가 유지됩니다. ZIP을 묶는 일까지 이 탭 안에서 끝나므로 원본은 기기를 떠나지 않습니다.",
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
