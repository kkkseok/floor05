import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("id-photo-size-guide"),
  title: "증명사진 크기와 만드는 법 - 3×4·여권·원형 프로필까지",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "증명사진 규격은 어떻게 되나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일반 증명사진은 3×4cm, 여권사진은 3.5×4.5cm, 미국 비자는 2×2인치(5.1×5.1cm)입니다. 300DPI로 만들면 각각 약 354×472px, 413×531px, 600×600px입니다.",
      },
    },
    {
      "@type": "Question",
      name: "증명사진을 원형(프로필)으로 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "네. 크롭 도구의 '원형으로 자르기'를 켜면 선택 영역을 원형으로 잘라 투명 배경 PNG로 저장합니다. 사원증이나 동그란 프로필 자리에 넣을 때, 1:1로 맞춘 다음 원형 옵션을 켜면 테두리가 깔끔하게 떨어집니다.",
      },
    },
    {
      "@type": "Question",
      name: "사진관 없이 집에서 증명사진을 만들 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "정면·균일한 배경으로 찍은 사진이라면 규격에 맞게 잘라 만들 수 있습니다. 다만 여권·비자 등 공식 제출용은 배경색·표정 등 별도 규정이 있으니 기관 안내를 확인하세요.",
      },
    },
  ],
};

export default function IdPhotoSizeGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8 text-sm text-brand-subtle">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">증명사진 크기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              증명사진 크기와 만드는 법
            </h1>
            <p className="text-lg text-brand-mid">
              3×4, 여권 3.5×4.5, 원형 프로필까지 — 규격에 맞춰 자르기
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-12">2026-06-12</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              지원서·여권·각종 신청에 증명사진이 필요한데 규격이 제각각이라 헷갈리기 쉽습니다.
              대표 규격과, 사진관 없이 브라우저에서 규격에 맞춰 만드는 방법을 정리했습니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 만들고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                크롭 도구의 증명사진 프리셋으로 규격 비율과 권장 크기를 한 번에 맞출 수 있습니다. 얼굴 사진은 업로드 없이 브라우저에서 잘립니다.
              </p>
              <Link
                href="/tools/image/crop"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                크롭 도구로 증명사진 만들기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 대표 증명사진 규격
            </h2>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>일반 증명사진</strong>: 3×4cm — 300DPI 기준 약 354×472px
              </li>
              <li>
                <strong>여권사진</strong>: 3.5×4.5cm — 약 413×531px
              </li>
              <li>
                <strong>미국 비자</strong>: 2×2인치(5.1×5.1cm) — 600×600px
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              화면·웹 제출용은 위 픽셀 크기면 충분합니다. 인화용은 300DPI 기준 픽셀로 맞추면
              실측 크기로 출력됩니다. 아래 그림은 여권 규격 3.5×4.5cm를 측정선으로 나타낸 것입니다.
            </p>

            <figure className="my-8">
              <svg viewBox="0 0 320 210" role="img" width="100%" className="block max-w-xl mx-auto" style={{ height: "auto" }}>
                <title>여권사진 3.5×4.5cm 치수</title>
                <desc>여권사진 규격 3.5cm 너비와 4.5cm 높이를 측정선으로 표시하고 300dpi 기준 413×531px 값을 함께 나타낸 치수 그림입니다.</desc>
                <rect x="108" y="44" width="93" height="120" rx="4" fill="#F2F0ED" stroke="#0A0A0A" strokeWidth="1.5" />
                <circle cx="154.5" cy="88" r="22" fill="#B0B0B0" />
                <rect x="122" y="132" width="65" height="32" rx="16" fill="#B0B0B0" />
                <line x1="108" y1="44" x2="108" y2="26" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="201" y1="44" x2="201" y2="26" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="108" y1="28" x2="201" y2="28" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="108" y1="24" x2="108" y2="32" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="201" y1="24" x2="201" y2="32" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="154.5" y="20" textAnchor="middle" fontSize="13" fill="#0A0A0A">3.5cm</text>
                <line x1="201" y1="44" x2="220" y2="44" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="201" y1="164" x2="220" y2="164" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="218" y1="44" x2="218" y2="164" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="214" y1="44" x2="222" y2="44" stroke="#0A0A0A" strokeWidth="1.5" />
                <line x1="214" y1="164" x2="222" y2="164" stroke="#0A0A0A" strokeWidth="1.5" />
                <text x="226" y="108" textAnchor="start" fontSize="13" fill="#0A0A0A">4.5cm</text>
                <text x="154.5" y="186" textAnchor="middle" fontSize="12" fill="#4A4A4A">413 × 531px (300dpi)</text>
              </svg>
              <figcaption className="mt-3 text-sm text-brand-mid text-center">여권사진 3.5×4.5cm는 300dpi 기준 413×531px로, 세로가 조금 더 긴 비율입니다.</figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              관공서·시험·취업별 증명사진 규격 한눈에 보기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              증명사진은 쓰이는 곳에 따라 요구 픽셀, 파일 용량 상한, 배경색이 다르게 정해져 있습니다.
              관공서와 시험 접수는 흰 배경에 픽셀·용량이 모두 정해져 있고, 취업 사이트는 크기 규정 없이
              파일 용량 상한만 두는 경우가 많습니다. 자주 찾는 용도를 한 표로 모았으니 준비하려는 서류의
              행을 먼저 찾아보세요. 아래 값은 각 기관 공식 안내 기준이며 접수 시점에 따라 바뀔 수 있습니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">픽셀 규격</th>
                    <th className="py-2 pr-4 text-brand-black">용량 상한</th>
                    <th className="py-2 pr-4 text-brand-black">배경</th>
                    <th className="py-2 pr-4 text-brand-black">형식</th>
                    <th className="py-2 pr-4 text-brand-black">출처(기관)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">여권 신청</td>
                    <td className="py-2 pr-4">413×531px</td>
                    <td className="py-2 pr-4">500KB 이하</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">외교부(passport.go.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">공무원 원서접수</td>
                    <td className="py-2 pr-4">137×177px</td>
                    <td className="py-2 pr-4">100KB 미만</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">사이버국가고시(gosi.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">토익 응시원서</td>
                    <td className="py-2 pr-4">115×150px</td>
                    <td className="py-2 pr-4">500KB</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">YBM(toeic.co.kr)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">운전면허 신청</td>
                    <td className="py-2 pr-4">350×450px</td>
                    <td className="py-2 pr-4">250KB</td>
                    <td className="py-2 pr-4">흰색</td>
                    <td className="py-2 pr-4">JPG</td>
                    <td className="py-2 pr-4">도로교통공단(koroad)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">잡코리아 이력서</td>
                    <td className="py-2 pr-4">자유</td>
                    <td className="py-2 pr-4">1MB</td>
                    <td className="py-2 pr-4">지정 없음</td>
                    <td className="py-2 pr-4">JPG·PNG</td>
                    <td className="py-2 pr-4">잡코리아(jobkorea)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">사람인 이력서</td>
                    <td className="py-2 pr-4">자유</td>
                    <td className="py-2 pr-4">10MB</td>
                    <td className="py-2 pr-4">지정 없음</td>
                    <td className="py-2 pr-4">JPG·PNG</td>
                    <td className="py-2 pr-4">사람인(saramin)</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-light text-sm mb-6">
              ※ 규격과 용량 상한은 기관 사정에 따라 갱신될 수 있으니 최종 제출 전 해당 기관 공지를 확인하세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              AI로 보정한 사진은 왜 반려되나요
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              여권·운전면허처럼 공식 제출용 증명사진은 편집 프로그램이나 필터, AI로 얼굴을 합성·창작한 결과물을
              받지 않도록 안내하는 곳이 많습니다. 본인 확인이 목적이라 실제 얼굴과 달라지면 곤란하기 때문입니다.
              그래서 피부를 매끈하게 펴거나 눈을 키우는 이른바 &lsquo;뽀샵&rsquo; 사진은 접수 단계에서 걸러질 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              반면 여기서 소개한 방식은 정면으로 찍은 원본을 규격 비율로 자르고 크기·용량만 맞추는 것이라, 얼굴 자체를
              바꾸는 가공과는 성격이 다릅니다. 카메라로 담은 모습을 그대로 두고 테두리와 파일 크기만 손보는 셈이지요.
              다만 배경색이나 표정처럼 기관마다 다른 조건이 있으니, 보정 금지 규정을 포함한 최종 기준은 제출 전
              접수처 안내에서 확인하시기 바랍니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 비율이 안 맞으면 잘리거나 늘어납니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              증명사진은 가로세로 비율이 정해져 있어, 비율을 무시하고 크기만 바꾸면 얼굴이
              찌그러집니다. <strong>규격 비율로 먼저 자르고</strong> 권장 픽셀 크기로 맞추는 순서가
              안전합니다. 크롭 도구의 증명사진 프리셋은 비율과 출력 크기를 함께 설정해줍니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 브라우저에서 만드는 법
            </h2>
            <ol className="list-decimal list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                  크롭
                </Link>
                에 정면 사진을 올립니다.
              </li>
              <li>증명사진 / 여권 / 미국 비자 프리셋 중 규격을 선택합니다.</li>
              <li>얼굴이 규격 안에 들어오도록 영역을 맞춥니다.</li>
              <li>
                저장 후 용량 제한이 있으면{" "}
                <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                  압축
                </Link>
                으로 200KB·500KB 등에 맞춥니다.
              </li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-4">
              제출 용량 제한을 맞추는 자세한 방법은{" "}
              <Link href="/blog/passport-photo-size" className="text-brand-accent hover:underline">
                증명사진 용량 줄이기
              </Link>
              에서 다룹니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 원형 프로필 사진으로
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              SNS·메신저 프로필처럼 원형이 필요하면 크롭의 <strong>&lsquo;원형으로 자르기&rsquo;</strong>를
              켜세요. 선택 영역을 원형으로 잘라 투명 배경 PNG로 저장합니다. 1:1 비율과 함께 쓰면
              완전한 원이 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">cm 규격을 픽셀로 바꾸면 얼마인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">300dpi로 맞춘다면 대표 규격은 아래처럼 계산할 수 있습니다. 다만 실제 접수에서는 얼굴 위치, 배경색, 머리 길이, 파일 용량 같은 세부 조건이 함께 붙는 경우가 많으므로 최종 제출 전에는 접수처 안내를 기준으로 확인해야 합니다.</p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">용도</th>
                    <th className="py-2 pr-4 text-brand-black">cm 규격</th>
                    <th className="py-2 pr-4 text-brand-black">300dpi 기준 픽셀</th>
                    <th className="py-2 pr-4 text-brand-black">확인할 점</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4">일반 증명사진</td>
                    <td className="py-2 pr-4">3×4cm</td>
                    <td className="py-2 pr-4">354×472px</td>
                    <td className="py-2 pr-4">이력서나 제출처별 안내가 다를 수 있습니다</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">여권·비자용</td>
                    <td className="py-2 pr-4">3.5×4.5cm</td>
                    <td className="py-2 pr-4">413×531px</td>
                    <td className="py-2 pr-4">국가와 기관별 얼굴 크기 조건을 따로 확인합니다</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">cm를 픽셀로 바꾸는 계산법은 무엇인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">공식은 픽셀 = cm × 300 ÷ 2.54입니다. 여기서 2.54는 1인치가 2.54cm라는 뜻이고, 300은 인화용 사진에서 자주 쓰는 해상도 기준입니다. 예를 들어 3cm 너비는 3 × 300 ÷ 2.54 = 약 354px이고, 4cm 높이는 4 × 300 ÷ 2.54 = 약 472px입니다. 그래서 3×4cm 증명사진은 300dpi 기준으로 354×472px에 가깝습니다.</p>
            <p className="text-brand-mid leading-relaxed mb-4">온라인 접수 화면에서 픽셀만 요구한다면 cm보다 해당 픽셀 조건을 우선으로 보면 됩니다. 반대로 인화소에 맡기거나 사진관 출력용 파일을 만들 때는 cm 규격과 해상도를 함께 맞추는 편이 결과를 예측하기 쉽습니다.</p>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">온라인 접수용과 인화용은 무엇이 다른가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">온라인 접수용은 화면에서 검증되는 조건이 중심이고, 인화용은 종이에 출력했을 때의 실제 크기가 중심입니다. 온라인에서는 가로세로 픽셀, 파일 용량, JPG 같은 형식 제한이 먼저 걸리는 경우가 많습니다. 인화에서는 3×4cm 또는 3.5×4.5cm처럼 물리적인 크기와 300dpi 같은 해상도 기준이 더 중요합니다.</p>
            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">접수가 반려되는 흔한 실수는 무엇인가요?</h2>
            <p className="text-brand-mid leading-relaxed mb-4">가장 흔한 문제는 규격을 숫자로만 맞추다가 얼굴 비율이나 화질을 망치는 것입니다. 비율이 다른 사진을 억지로 늘리면 얼굴이 길어지거나 넓어져 부자연스럽고, 작은 사진을 크게 키우면 윤곽이 흐려질 수 있습니다. 또한 용량 제한을 넘겨 업로드가 막히거나, 배경과 얼굴 위치 조건을 놓쳐 반려되는 경우도 있습니다.</p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>비율이 맞지 않으면 늘리기보다 크롭으로 맞춥니다.</li>
              <li>원본이 너무 작다면 무리하게 확대하지 말고 다시 촬영하는 편이 낫습니다.</li>
              <li>접수 사이트의 용량 제한이 있으면 제출 전 <Link href="/tools/image/compress" className="text-brand-accent hover:underline">이미지 압축</Link>으로 확인합니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 증명사진 규격은 어떻게 되나요?
                </h3>
                <p className="text-brand-mid">
                  일반 증명사진 3×4cm, 여권 3.5×4.5cm, 미국 비자 2×2인치입니다. 300DPI로 만들면
                  각각 약 354×472, 413×531, 600×600px입니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 원형(프로필)으로 만들 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  네. &lsquo;원형으로 자르기&rsquo;를 켜면 원형으로 잘라 투명 PNG로 저장합니다. 1:1과
                  함께 쓰면 완전한 원이 됩니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 집에서 만들어도 되나요?
                </h3>
                <p className="text-brand-mid">
                  정면·균일한 배경 사진이라면 규격에 맞게 잘라 쓸 수 있습니다. 다만 공식 제출용은
                  배경색·표정 규정이 있으니 기관 안내를 확인하세요.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                지금 바로 증명사진 만들기
              </h3>
              <p className="text-brand-light mb-6">
                규격 프리셋과 원형 크롭까지. 가입 없이 무료로, 증명사진은 기기 안에서만 만들어집니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 크롭
                </Link>
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  용량 줄이기
                </Link>
              </div>
            </div>

            <BlogExtras slug="id-photo-size-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
