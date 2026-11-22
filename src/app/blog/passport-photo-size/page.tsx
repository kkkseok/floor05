import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("passport-photo-size"),
  title: "여권사진 크기와 파일 규격 - 외교부 안내 확인, 413×531 용량 실측",
};

const faqs = [
  {
    question: "온라인 여권 재발급에 올릴 사진은 몇 픽셀, 몇 KB로 맞추나요?",
    answer:
      "외교부 여권안내(2026-11-23 확인)에는 가로 413, 세로 531픽셀 권장, 가로 395~431·세로 507~550픽셀 안에서만 업로드 가능, 500KB 이하, JPG/JPEG로 적혀 있습니다. 카메라 원본을 413×531 JPG로 저장해 보니 10~70KB였습니다. 규격은 바뀔 수 있으니 신청 전에 공식 페이지를 확인하세요.",
  },
  {
    question: "500KB가 넘는 사진은 압축만 하면 되나요?",
    answer:
      "용량만 맞추면 픽셀 범위를 벗어납니다. 15.78MB 원본을 자르지 않고 목표 용량 500KB로 압축하니 2485×1940픽셀이 됐고, 이는 업로드 가능 범위(가로 395~431픽셀) 밖입니다. 같은 사진을 35:45 비율로 잘라 413×531픽셀로 저장하면 70KB입니다.",
  },
  {
    question: "예전에 쓰던 작은 증명사진 파일을 키워서 써도 되나요?",
    answer:
      "외교부 안내는 다른 용도의 사진을 재사용해 해상도가 낮아졌거나 흐릿해진 경우를 제출 불가로 적고 있습니다. 207×266픽셀 파일을 413×531로 키운 결과는 PSNR 26.79dB로, 원본에서 바로 줄인 36.99dB보다 10dB 낮았습니다. 촬영한 지 6개월이 지난 사진도 쓸 수 없습니다.",
  },
  {
    question: "여권사진 파일이 정부24에 올리기 전에 다른 서버를 거치나요?",
    answer:
      "floor05에서 자르고 줄이는 일은 열어 둔 브라우저 탭 안에서 끝납니다. 이 글의 측정도 같은 크롭 코드를 빈 페이지에 넣어 돌린 것입니다. 얼굴이 담긴 파일이 기기 밖으로 처음 나가는 때는 정부24에서 직접 업로드할 때입니다.",
  },
];

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: { "@type": "Answer", text: faq.answer },
  })),
};

// 2026-11-23 공식 페이지 확인 (원자료: docs/blog-data/passport-specs-2026-11-23.json)
const CHECKED = "2026-11-23";
const SOURCES = {
  spec: {
    label: "외교부 여권안내 · 여권사진 규격 안내",
    url: "https://www.passport.go.kr/home/kor/contents.do?menuPos=32",
  },
  online: {
    label: "외교부 여권안내 · 온라인용 사진파일 안내",
    url: "https://www.passport.go.kr/home/kor/contents.do?menuPos=12",
  },
  gov24: {
    label: "정부24 · 여권 재발급 온라인 신청",
    url: "https://www.gov.kr/portal/service/serviceInfo/126200000030",
  },
  verify: {
    label: "온라인 여권 사진 검증",
    url: "https://www.passport.go.kr/home/kor/onlinePhotoVerify/index.do?menuPos=33",
  },
  resize: {
    label: "온라인 여권 사진 크기 조정",
    url: "https://www.passport.go.kr/home/kor/photoVerify/index.do?menuPos=34",
  },
};

const specs = [
  {
    item: "사진 크기(인화)",
    value: "가로 3.5cm × 세로 4.5cm",
    source: SOURCES.spec,
  },
  {
    item: "머리 길이",
    value: "정수리(머리카락 제외)부터 턱까지 3.2~3.6cm",
    source: SOURCES.spec,
  },
  {
    item: "배경",
    value: "균일한 흰색, 테두리 없음. 편집 프로그램으로 배경을 지우거나 합성한 사진은 제출 불가",
    source: SOURCES.spec,
  },
  {
    item: "촬영 시기",
    value: "여권발급 신청일 전 6개월 이내",
    source: SOURCES.spec,
  },
  {
    item: "인화 품질",
    value: "인화지(유광 또는 무광), 해상도 300DPI 권장. 일반 종이에 인쇄한 사진은 불가",
    source: SOURCES.spec,
  },
  {
    item: "보정",
    value: "편집 프로그램·필터로 임의 보정한 사진(AI 편집·가공·합성 포함)은 허용 불가",
    source: SOURCES.spec,
  },
  {
    item: "온라인용 파일 픽셀",
    value: "413×531px 권장. 가로 395~431px, 세로 507~550px 안에서만 업로드 가능",
    source: SOURCES.online,
  },
  {
    item: "온라인용 파일 용량·형식",
    value: "500KB 이하, JPG/JPEG, 해상도 300dpi 권장",
    source: SOURCES.online,
  },
  {
    item: "정부24 접수 제한",
    value: "사진품질·안면비교 실패가 24시간 안에 10회를 넘으면 접수 제한",
    source: SOURCES.gov24,
  },
];

// 2026-11-23 측정 (Playwright Chromium, 크롭 도구 코드 그대로, 원자료: docs/blog-data/passport-size-2026-11-23.json)
const results = [
  {
    name: "거북이 사진",
    source: "5522×4312 · 15.78MB",
    kept: "60.7%",
    jpg: "70KB (14.1%)",
    jpg100: "267KB (53.4%)",
    png: "470KB (94.1%)",
  },
  {
    name: "꽃 사진",
    source: "8192×5464 · 9.18MB",
    kept: "51.9%",
    jpg: "30KB (5.9%)",
    jpg100: "183KB (36.7%)",
    png: "360KB (71.9%)",
  },
  {
    name: "흰 배경 도형",
    source: "3024×4032 · 1.02MB",
    kept: "96.4%",
    jpg: "10KB (2.1%)",
    jpg100: "84KB (16.9%)",
    png: "254KB (50.7%)",
  },
];

// 거북이 사진 413×531, 500KB(500,000B) 대비 %
const bars = [
  { label: "JPG 92%", value: "70KB", pct: 14.1 },
  { label: "JPG 100%", value: "267KB", pct: 53.4 },
  { label: "PNG", value: "470KB", pct: 94.1 },
];

const summary = [
  {
    situation: "온라인 재발급용 파일",
    action: "35:45 비율로 잘라 413×531px JPG로 저장",
    basis: "결과 10~70KB, 500KB 한도의 2.1~14.1%",
  },
  {
    situation: "500KB가 넘는 원본",
    action: "압축보다 자르기를 먼저",
    basis: "목표 용량 500KB만 적용하면 2485×1940px, 업로드 범위 밖",
  },
  {
    situation: "PNG로 저장된 사진",
    action: "JPG로 바꾼 뒤 자르기",
    basis: "같은 413×531이 PNG 470KB, JPG 70KB",
  },
  {
    situation: "규격보다 작은 사진",
    action: "키우지 말고 큰 원본에서 다시 만들기",
    basis: "207×266에서 키우면 26.79dB, 바로 줄이면 36.99dB",
  },
  {
    situation: "JPG 품질",
    action: "용량 때문에 낮출 필요 없음",
    basis: "품질 100%로 저장해도 267KB",
  },
];

function OfficialLink({ source }: { source: { label: string; url: string } }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-brand-accent hover:underline"
    >
      {source.label}
    </a>
  );
}

export default function PassportPhotoSizePage() {
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
            <span className="text-brand-mid">여권사진 크기와 파일 규격</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              여권사진 크기와 파일 규격
            </h1>
            <p className="text-lg text-brand-mid">
              외교부 안내에서 직접 읽은 수치와, 그 크기로 만든 파일을 잰 결과
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-23">2026-11-23 확인·측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              여권사진은 가로 3.5cm, 세로 4.5cm입니다. 온라인 재발급에 올리는 파일은 413×531픽셀
              권장, 500KB 이하, JPG입니다. 모두 외교부 여권안내 페이지에서 2026년 11월 23일에 직접
              읽은 수치입니다. 이 글의 이전 판에는 출처 없이 적은 숫자가 섞여 있었고, 이번에 공식
              페이지에서 확인하지 못한 것은 지웠습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              그리고 그 크기로 파일을 만들어 용량을 쟀습니다. 카메라 원본을 413×531 JPG로 저장하면
              10~70KB로, 한도 500KB의 2.1~14.1%였습니다. 용량 한도까지는 여유가 많았고, 신경 쓸 곳은
              픽셀 범위와 파일 형식이었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              외교부 안내에서 확인한 규격
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              아래 수치는 {CHECKED}에 각 페이지 본문에서 읽은 것입니다. 출처 칸의 링크가 그
              페이지입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">항목</th>
                    <th className="py-2 pr-4 text-brand-black">공식 페이지의 수치</th>
                    <th className="py-2 pr-4 text-brand-black">출처 (확인일)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {specs.map((row) => (
                    <tr key={row.item} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.item}
                      </td>
                      <td className="py-2 pr-4 min-w-[14rem]">{row.value}</td>
                      <td className="py-2 pr-4 min-w-[11rem]">
                        <OfficialLink source={row.source} />
                        <br />
                        <span className="text-xs text-brand-subtle">{CHECKED}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-6">
              픽셀 범위는 <OfficialLink source={SOURCES.gov24} /> 안내에도 같은 수치로 적혀
              있습니다({CHECKED} 확인).
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              <strong className="text-brand-black">
                규격은 바뀔 수 있으니 신청 전에 공식 페이지를 확인하세요.
              </strong>{" "}
              규격 안내 페이지에는 &lsquo;2022. 10. 개정&rsquo;이라고 적혀 있습니다. 공식 페이지끼리
              다른 곳도 하나 있었습니다. 온라인용 사진파일 안내는 형식을 JPG/JPEG로만 적는데,{" "}
              <OfficialLink source={SOURCES.verify} /> 페이지에는 &lsquo;JPG/JPEG 또는 PNG
              가능&rsquo;이라고 적혀 있습니다. 두 곳 모두 받는 JPG로 만드는 편이 안전합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확인하지 못해 뺀 것도 적어 둡니다. 방문 신청 때 내는 사진 매수, 눈 위치나 얼굴 너비
              같은 세부 수치는 확인한 페이지 본문에서 찾지 못했습니다. 500KB를 500,000바이트로
              세는지 512,000바이트로 세는지도 적혀 있지 않습니다. 이전 판에 있던 취업 사이트·시험
              원서·운전면허 사진 수치는 여권 글의 범위가 아니어서 뺐습니다. 다른 증명사진은{" "}
              <Link href="/blog/id-photo-size-guide" className="text-brand-accent hover:underline">
                증명사진 크기 글
              </Link>
              에서 다룹니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              사람 얼굴 사진은 쓰지 않았습니다. 초상권 문제가 없는 인물 사진을 구할 수 없어서입니다.
              대신 아래 세 장으로 크기와 용량만 쟀습니다. 머리 길이나 배경색이 규격에 맞는지는 이
              측정으로 알 수 없습니다.
            </p>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">거북이 사진</strong>: NASA 공공 도메인,
                5522×4312, 15.78MB. 잔무늬가 많아 용량이 크게 나오는 쪽입니다
              </li>
              <li>
                <strong className="text-brand-black">꽃 사진</strong>: NASA 공공 도메인, 8192×5464,
                9.18MB. 배경이 흐립니다
              </li>
              <li>
                <strong className="text-brand-black">흰 배경 도형</strong>: 스크립트로 그린
                3024×4032 그림, 1.02MB. 옅은 회색 배경에 타원과 어깨 모양을 놓고 잡음을 넣었습니다.
                배경이 밝고 단순한 사진이 얼마나 작아지는지 보려는 것입니다
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-8">
              floor05{" "}
              <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                이미지 크롭
              </Link>
              의 &lsquo;여권 3.5×4.5&rsquo; 프리셋과 같은 코드를 Chromium에서 돌렸습니다. 35:45
              비율로 가운데를 가장 크게 자르고, 413×531로 줄여, JPG 품질 92%로 저장합니다. 거북이
              사진은 실제 도구에서 내려받은 파일과 바이트 수가 같은 것을 확인했습니다. 용량은 1KB =
              1,000바이트로 적었고, 한도 대비 비율은 500,000바이트로 계산했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: 413×531로 저장했을 때
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">소스</th>
                    <th className="py-2 pr-4 text-brand-black">남는 면적</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 92%</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 100%</th>
                    <th className="py-2 pr-4 text-brand-black">PNG</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {results.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <span className="font-medium text-brand-black">{row.name}</span>
                        <br />
                        <span className="text-xs text-brand-subtle">{row.source}</span>
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.kept}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg100}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              괄호는 500KB 대비 비율. 남는 면적은 35:45로 가운데를 잘랐을 때 원본 대비 비율입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 용량 한도 500KB에는 걸리지 않았다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              세 장 가운데 가장 큰 거북이 사진이 70KB였습니다. 한도의 14.1%입니다. 품질을 100%로
              올려 저장해도 267KB로 절반을 조금 넘는 정도입니다. 업로드가 허용되는 가장 큰 크기인
              431×550으로 저장한 것도 75KB였습니다.
            </p>
            <div className="my-6 space-y-3" role="img" aria-label="거북이 사진을 413×531로 저장한 용량. JPG 92% 70KB, JPG 100% 267KB, PNG 470KB. 한도는 500KB">
              {bars.map((bar) => (
                <div key={bar.label}>
                  <div className="flex justify-between text-sm text-brand-mid mb-1">
                    <span>{bar.label}</span>
                    <span>
                      {bar.value} · {bar.pct}%
                    </span>
                  </div>
                  <div className="h-3 bg-brand-paper rounded-sm">
                    <div className="h-3 bg-brand-accent rounded-sm" style={{ width: `${bar.pct}%` }} />
                  </div>
                </div>
              ))}
              <p className="text-sm text-brand-subtle">
                거북이 사진 413×531. 막대 끝까지가 한도 500KB입니다.
              </p>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래서 용량을 줄이려고 품질을 낮출 이유가 없습니다. 품질을 60%로 내리면 30KB까지
              줄지만 PSNR이 36.99dB에서 31.76dB로 떨어집니다. PSNR은 저장 전 픽셀과 얼마나 가까운지
              나타내는 수치로, 높을수록 가깝습니다. 한도까지 400KB 넘게 남는데 화질을 내줄 필요는
              없습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 용량만 맞추면 픽셀 범위를 벗어난다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              반대 순서로도 해 봤습니다. 거북이 원본을 자르지 않고{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              의 목표 용량 500KB에 넣으니 2485×1940픽셀, 506KB 파일이 나왔습니다. 꽃 사진은
              7373×4918픽셀이었습니다. 둘 다 가로 395~431픽셀이라는 업로드 범위와 거리가 멉니다.
              압축 도구는 용량을 맞추는 도구라서 픽셀을 규격 크기로 만들어 주지 않습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              506KB라는 숫자도 눈여겨볼 만합니다. 도구는 1KB를 1,024바이트로 계산해 512,000바이트
              아래로 맞추는데, 1,000바이트 기준으로 읽으면 500KB를 넘습니다. 공식 페이지에는 어느
              기준인지 적혀 있지 않습니다. 어느 쪽이든 413×531로 먼저 자르면 한참 아래라 따질 일이
              없어집니다. 압축 품질과 용량의 관계는{" "}
              <Link href="/blog/image-compression-guide" className="text-brand-accent hover:underline">
                이미지 용량 줄이기 실측
              </Link>
              에 있습니다.
            </p>

            <BlogInlineCTA href="/tools/image/crop" label="이미지 크롭 →">
              &lsquo;여권 3.5×4.5&rsquo; 프리셋을 고르면 35:45 비율로 잘라 413×531픽셀로 저장합니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. PNG로 저장하면 한도에 바짝 붙는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              같은 413×531 캔버스를 PNG로 저장하면 거북이 사진이 470KB였습니다. 한도의 94.1%이고
              JPG 92%의 6.7배입니다. 온라인용 사진파일 안내가 적은 형식도 JPG/JPEG입니다. floor05
              크롭은 PNG 파일을 넣으면 PNG로 저장합니다. 화면 캡처나 메신저로 받은 PNG 사진이라면{" "}
              <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                이미지 변환
              </Link>
              으로 JPG로 바꾼 뒤 자르세요.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 작은 사진을 키우면 픽셀 수만 맞는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              <OfficialLink source={SOURCES.online} />는 &lsquo;다른 용도의 사진을 재사용하여
              해상도가 낮아졌거나 흐릿해진 경우&rsquo;를 제출 불가로 적고 있습니다({CHECKED} 확인).
              얼마나 흐려지는지 쟀습니다. 거북이 사진을 207×266으로 저장한 파일을 413×531로 키우니
              PSNR이 26.79dB였습니다. 원본에서 바로 413×531로 줄인 것은 36.99dB입니다. 310×398에서
              키운 것도 30.22dB에 그쳤습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/passport-photo-size/upscale-compare.jpg"
                alt="같은 영역을 2배 확대해 나란히 놓은 그림. 1번은 원본에서 바로 413×531로 줄인 것으로 건물의 글자가 읽히고, 2번은 207×266에서 키운 것으로 글자와 표지판이 뭉개졌다"
                width={976}
                height={480}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                413×531 결과의 가운데를 2배로 확대한 것. 1 = 원본에서 바로 줄임(36.99dB), 2 =
                207×266에서 키움(26.79dB). 사진: NASA(공공 도메인)
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 크롭의 &lsquo;증명사진 3×4&rsquo; 프리셋(354×472픽셀)으로 만든 파일도 그대로는
              올릴 수 없습니다. 가로 354픽셀이 하한 395픽셀보다 작습니다. 큰 원본이 남아 있다면
              거기서 다시 자르는 편이 낫습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 300dpi와 머리 길이는 파일에서 어떻게 보이나
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              413×531픽셀을 3.5×4.5cm로 인화하면 계산상 299.7dpi입니다. 공식 안내의 300dpi 권장과
              맞는 크기입니다. 다만 floor05가 저장한 JPG를 열어 보니 dpi 값은 기록돼 있지
              않았습니다(JFIF 밀도 단위 0, 측정한 Chromium 기준). 업로드 시스템이 이 값을 보는지는 확인하지
              못했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              머리 길이 3.2~3.6cm는 세로 4.5cm의 71.1~80.0%입니다. 세로 531픽셀로 환산하면 정수리부터
              턱까지 약 378~425픽셀입니다. 이것은 공식 수치를 직접 계산한 값이고 공식 페이지에 적힌
              숫자는 아닙니다. 세로 4:3 휴대폰 사진(3024×4032)은 35:45로 자르면 면적의 96.4%가 남아
              위아래로 합쳐 144픽셀만 잘립니다. 가장 크게 자르면 얼굴이 차지하는 비율은 찍힌 그대로에
              가깝고, 자르는 영역을 좁힐수록 머리가 크게 들어갑니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 크롭은 얼굴을 인식하지 않습니다. 머리 길이가 범위에 드는지는 외교부의{" "}
              <OfficialLink source={SOURCES.resize} />(붉은 점선 안에 얼굴을 맞추는 방식, PC 전용)과{" "}
              <OfficialLink source={SOURCES.verify} />
              으로 확인할 수 있습니다. 검증 페이지에는 결과가 참고용이며 실제 심사와 다를 수 있다고
              적혀 있습니다. 보정 금지 규정도 있습니다. 배경을 지우거나 얼굴 비율을 바꾸는 편집은
              제출 불가이고, 이 글에서 한 일은 비율을 유지한 채 자르고 줄이는 것까지입니다. 심사
              결과는 접수 기관이 판단합니다. 자르는 영역을 고르는 요령은{" "}
              <Link href="/blog/image-crop-guide" className="text-brand-accent hover:underline">
                사진 자르기 실측
              </Link>
              에 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정리</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">상황</th>
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {summary.map((row) => (
                    <tr key={row.situation} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.situation}
                      </td>
                      <td className="py-2 pr-4 min-w-[11rem]">{row.action}</td>
                      <td className="py-2 pr-4 min-w-[12rem]">{row.basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className={i < faqs.length - 1 ? "border-b border-brand-light/20 pb-6" : "pb-6"}
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-2">Q. {faq.question}</h3>
                  <p className="text-brand-mid leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">413×531로 잘라 보기</h3>
              <p className="text-brand-light mb-6">
                여권 프리셋을 고르고 남길 영역을 정하면 됩니다.
                <br />
                머리 길이는 외교부 검증 페이지에서 확인하세요.
              </p>
              <Link
                href="/tools/image/crop"
                className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
              >
                이미지 크롭
              </Link>
            </div>
          </div>
          <BlogExtras slug="passport-photo-size" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
