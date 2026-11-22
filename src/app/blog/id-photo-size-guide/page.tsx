import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("id-photo-size-guide"),
  title: "증명사진 크기 - 공식 페이지로 확인한 규격과 픽셀 환산",
};

const faqs = [
  {
    question: "3.5×4.5cm 증명사진은 몇 픽셀인가요?",
    answer:
      "해상도에 따라 다릅니다. 300dpi로 계산하면 413×531픽셀(계산값 413.39×531.50)이고, 100dpi면 138×177픽셀입니다. 한국도로교통공단과 한국교육과정평가원 안내(2026-11-23 확인)는 온라인 접수 파일로 413×531픽셀을 권장하고 가로 395~431픽셀, 세로 507~550픽셀만 올릴 수 있다고 적고 있습니다.",
  },
  {
    question: "3×4cm로 만든 파일을 운전면허나 수능 온라인 접수에 써도 되나요?",
    answer:
      "두 안내에 적힌 범위에 들지 않습니다. 3×4cm를 300dpi로 만들면 354×472픽셀인데, 운전면허와 수능 온라인 사진은 가로 395~431픽셀, 세로 507~550픽셀만 올릴 수 있다고 안내합니다(2026-11-23 확인). 비율도 0.75와 0.7778로 달라서 3.5:4.5 비율로 다시 잘라야 합니다.",
  },
  {
    question: "500KB 제한을 맞추려면 사진을 압축해야 하나요?",
    answer:
      "픽셀 크기를 먼저 맞추면 대개 필요 없었습니다. 15.78MB 카메라 원본을 413×531픽셀 JPG(품질 92%)로 만드니 70KB였고, 품질을 100%로 올려도 267KB였습니다. 다만 같은 크기를 PNG로 저장하면 470KB까지 올라갔습니다.",
  },
  {
    question: "얼굴 사진을 규격대로 자를 때 사진이 어딘가에 저장되나요?",
    answer:
      "floor05 크롭 도구에는 사진을 서버로 보내는 단계가 없습니다. 자르기와 크기 맞춤은 사진을 연 브라우저 탭의 Canvas에서 끝납니다. 증명사진이 기기 밖으로 나가는 때는 접수 사이트에 직접 올리는 순간입니다.",
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

// 2026-11-23 공식 페이지 확인 (원자료: docs/blog-data/id-photo-specs-2026-11-23.json)
const CHECKED = "2026-11-23";
const SOURCES = {
  mois: {
    label: "행정안전부 주민등록증 안내",
    url: "https://www.mois.go.kr/frt/sub/a06/b06/IDCard_5/screen.do",
  },
  koroad: {
    label: "한국도로교통공단 안전운전 통합민원",
    url: "https://www.safedriving.or.kr/etGuide/selectEtGuide04.do",
  },
  koroadNotice: {
    label: "한국도로교통공단 공지",
    url: "https://www.koroad.or.kr/main/board/9/306204/board_view.do?cp=5&listType=list&bdOpenYn=Y&bdNoticeYn=N",
  },
  gosi: {
    label: "국가공무원 채용시스템",
    url: "https://gongmuwon.gosi.kr/oprut/AppApAplfSbmsnAplfRcptGd.do",
  },
  csat: {
    label: "한국교육과정평가원 수능 안내",
    url: "https://www.suneung.re.kr/sub/info.do?m=0102&s=suneung",
  },
  passport: {
    label: "외교부 여권안내",
    url: "https://www.passport.go.kr/home/kor/contents.do?menuPos=32",
  },
  toeicSw: {
    label: "YBM 어학시험 FAQ",
    url: "https://www.toeic.co.kr/customer/csFaq.php?currentPage=10",
  },
};

const specs = [
  {
    type: "주민등록증",
    item: "제출 사진",
    value: "가로 3.5cm×세로 4.5cm, 6개월 이내 촬영",
    source: SOURCES.mois,
  },
  {
    type: "운전면허증",
    item: "인화 사진",
    value: "3.5cm×4.5cm, 머리 길이 3.2~3.6cm, 흰색 배경, 6개월 이내 촬영",
    source: SOURCES.koroad,
  },
  {
    type: "운전면허증",
    item: "온라인 신청 파일",
    value:
      "500KB 이하 JPG, 413×531px 권장(가로 395~431px, 세로 507~550px만 업로드 가능), 300dpi 권장",
    source: SOURCES.koroad,
  },
  {
    type: "국가공무원 시험",
    item: "응시원서 사진 파일",
    value: "3.5cm×4.5cm(137×177px) 기준, 350KB 미만, JPG·PNG",
    source: SOURCES.gosi,
  },
  {
    type: "수능",
    item: "온라인 사전입력 파일",
    value:
      "500KB 이하 JPG/JPEG, 413×531px 권장(가로 395~431px, 세로 507~550px만 업로드 가능), 300dpi 권장",
    source: SOURCES.csat,
  },
  {
    type: "수능",
    item: "현장 접수 사진",
    value: "가로 3.5cm×세로 4.5cm 2매, 머리 길이 3.2~3.6cm, 6개월 이내 촬영",
    source: SOURCES.csat,
  },
  {
    type: "TOEIC Speaking·Writing",
    item: "인터넷 접수 파일",
    value: "3×4cm, JPG, 6MB 이하",
    source: SOURCES.toeicSw,
  },
];

// 계산값 (원자료: docs/blog-data/id-photo-size-2026-11-23.json → calc.cmToPx)
const cmToPx = [
  { dpi: "100dpi", a: "138×177", b: "118×157" },
  { dpi: "150dpi", a: "207×266", b: "177×236" },
  { dpi: "200dpi", a: "276×354", b: "236×315" },
  { dpi: "300dpi", a: "413×531", b: "354×472" },
  { dpi: "600dpi", a: "827×1063", b: "709×945" },
];

// 2026-11-23 측정 (Playwright Chromium 151, 원자료: docs/blog-data/id-photo-size-2026-11-23.json)
// 값은 거북이 / 꽃 순서. kept = 규격 비율로 가운데를 자를 때 남는 면적
const results = [
  {
    size: "413×531",
    use: "운전면허·수능 온라인",
    kept: "60.7% / 51.9%",
    jpg: "70KB / 30KB",
    png: "470KB / 360KB",
    limit: "500KB 이하",
  },
  {
    size: "137×177",
    use: "국가공무원 응시원서",
    kept: "60.4% / 51.6%",
    jpg: "10KB / 6KB",
    png: "57KB / 43KB",
    limit: "350KB 미만",
  },
  {
    size: "354×472",
    use: "3×4cm를 300dpi로",
    kept: "58.6% / 50.0%",
    jpg: "54KB / 25KB",
    png: "360KB / 280KB",
    limit: "6MB 이하(TOEIC SW)",
  },
];

// 거북이 사진 413×531 저장 용량을 500KB 한도에 대한 비율로 (원자료 photos.tortoise.sizes[0])
const bars = [
  { label: "JPG 품질 60%", value: "30KB", pct: 6.0 },
  { label: "JPG 품질 80%", value: "44KB", pct: 8.8 },
  { label: "JPG 품질 92% (크롭 도구 저장값)", value: "70KB", pct: 14.1 },
  { label: "JPG 품질 100%", value: "267KB", pct: 53.4 },
  { label: "PNG", value: "470KB", pct: 94.1 },
];

const summary = [
  {
    situation: "주민등록증·운전면허·수능·국가공무원 시험",
    action: "3.5×4.5cm 한 가지로 준비",
    basis: "확인한 공식 페이지 네 곳이 모두 3.5cm×4.5cm",
  },
  {
    situation: "운전면허·수능 온라인 접수",
    action: "413×531px JPG로 저장",
    basis: "JPG 92%에서 70KB·30KB, 한도 500KB의 14.1%·5.9%",
  },
  {
    situation: "국가공무원 응시원서",
    action: "137×177px로 저장",
    basis: "JPG 92%에서 10KB·6KB, PNG도 57KB·43KB(한도 350KB 미만)",
  },
  {
    situation: "PNG로 저장된 사진·캡처",
    action: "JPG로 바꿔서 자르기",
    basis: "413×531 PNG 470KB, 한도 500KB의 94.1%",
  },
  {
    situation: "가로로 찍은 사진",
    action: "세로로 다시 찍거나 남길 부분을 직접 고르기",
    basis: "3.5:4.5로 자르면 60.7%·51.9%만 남음",
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
              증명사진 크기와 픽셀 환산
            </h1>
            <p className="text-lg text-brand-mid">
              발급 기관 페이지에서 확인한 규격만 남기고, 그 크기로 만든 파일을 쟀습니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-23">2026-11-23 확인·측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              증명사진 규격표는 많지만 숫자의 출처가 적힌 표는 드뭅니다. 이 글의 이전 판도 기관 이름만 붙여
              운전면허 350×450픽셀·250KB, 공무원 원서 100KB 미만이라고 적었습니다. 발급 기관 페이지를
              직접 열어 보니 둘 다 지금 안내와 달랐습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              확인한 결과는 생각보다 단순합니다. 주민등록증, 운전면허증, 수능 원서, 국가공무원 응시원서가
              모두 가로 3.5cm×세로 4.5cm를 씁니다. 온라인으로 낼 때는 운전면허와 수능이 413×531픽셀·500KB
              이하, 국가공무원 시험이 137×177픽셀·350KB 미만입니다. 그리고 이 크기로 만든 JPG는 한도의
              14.1%를 넘지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              공식 페이지에서 확인한 규격
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              아래 수치는 모두 2026년 11월 23일에 각 기관 페이지에서 읽은 것입니다. 출처 칸의 링크가 그
              페이지입니다. 수능은 2027학년도 안내 기준입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">종류</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">항목</th>
                    <th className="py-2 pr-4 text-brand-black">공식 페이지의 수치</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">출처 (확인일)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {specs.map((row) => (
                    <tr key={`${row.type}-${row.item}`} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.type}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.item}</td>
                      <td className="py-2 pr-4 min-w-[14rem]">{row.value}</td>
                      <td className="py-2 pr-4 min-w-[9rem]">
                        <OfficialLink source={row.source} />
                        <br />
                        <span className="text-xs text-brand-subtle">{CHECKED}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              TOEIC Speaking·Writing 수치는 FAQ 목록 10번째 쪽의 [TOEIC SW] 문항에서 읽었습니다. 목록이
              바뀌면 쪽 번호가 달라질 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              <strong className="text-brand-black">
                규격은 바뀔 수 있으니 접수 전에 공식 페이지를 확인하세요.
              </strong>{" "}
              실제로 바뀝니다. <OfficialLink source={SOURCES.koroadNotice} />
              (2026-02-24 게시, {CHECKED} 확인)는 2026년 3월 1일부터 운전면허증에 여권용 사진 규격을
              엄격히 적용하고, 규격이 아닌 사진은 현장에서 반려한다고 알립니다. 이 표의 숫자를 맞췄다고
              접수가 되는 것도 아닙니다. 머리 길이, 배경, 표정 같은 조건은 기관이 따로 판정합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              여권사진도 가로 3.5cm×세로 4.5cm입니다(<OfficialLink source={SOURCES.passport} />, {CHECKED}{" "}
              확인). 행정안전부 페이지는 여권 사진 규격으로 찍으면 주민등록증과 여권에 모두 쓸 수 있다고
              적고 있습니다. 여권사진의 세부 조건은{" "}
              <Link href="/blog/passport-photo-size" className="text-brand-accent hover:underline">
                여권사진 글
              </Link>
              에서 따로 다룹니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확인하지 못해 뺀 것도 적어 둡니다. 미국 비자 사진(2×2인치)은 미 국무부 페이지가 자동 접속을
              막아 읽지 못했습니다. TOEIC 정기시험의 픽셀 규격, 잡코리아·사람인 이력서 사진 용량은 공개된
              안내에서 찾지 못했습니다. 주민등록증을 정부24로 신청할 때 내는 사진 파일의 픽셀·용량도
              공개 페이지에는 없었습니다. 흔히 반명함판이라 부르는 3×4cm는 관용적으로 쓰이는 크기이며,
              그 이름으로 크기를 정한 공식 규격 문서는 찾지 못했습니다. 3×4cm를 요구하는 공식 안내는 위
              표의 TOEIC Speaking·Writing 하나만 확인했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">cm를 픽셀로 바꾸면</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              식은 픽셀 = cm × dpi ÷ 2.54입니다. 1인치가 2.54cm이고, dpi는 1인치에 찍는 점의 수입니다.
              같은 3.5×4.5cm라도 dpi에 따라 픽셀 수가 달라집니다. 아래는 계산값이고, 소수점은 반올림했습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">해상도</th>
                    <th className="py-2 pr-4 text-brand-black">3.5×4.5cm</th>
                    <th className="py-2 pr-4 text-brand-black">3×4cm</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {cmToPx.map((row) => (
                    <tr key={row.dpi} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.dpi}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.a}px</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.b}px</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              3.5×4.5cm의 300dpi 계산값은 413.39×531.50, 100dpi는 137.80×177.17입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              이 표를 공식 수치와 나란히 놓으면 숫자의 유래가 보입니다. 운전면허와 수능의 413×531픽셀은
              3.5×4.5cm를 300dpi로 바꾼 값입니다. 업로드가 허용되는 가로 395~431픽셀, 세로
              507~550픽셀은 dpi로 환산하면 약 286~313dpi입니다. 300dpi에서 조금 벗어난 파일까지만 받는
              셈입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              그래서 같은 3.5×4.5cm 사진이라도 200dpi로 스캔한 276×354픽셀이나 600dpi로 스캔한
              827×1063픽셀 파일은 이 범위 밖입니다. 3×4cm를 300dpi로 만든 354×472픽셀도 가로가 395픽셀에
              못 미칩니다. 종이 크기가 아니라 픽셀 수를 맞춰야 합니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              국가공무원 응시원서의 137×177픽셀은 약 100dpi에 해당합니다. 계산값 137.80을 반올림하면
              138인데 안내에는 137로 적혀 있어, 비율이 3.5:4.5보다 가로로 0.48% 좁습니다. 눈으로 구분할
              차이는 아니지만, 137×177을 직접 입력해 자르면 이 비율 그대로 맞출 수 있습니다. 머리 길이
              3.2~3.6cm는 세로 4.5cm의 71.1~80.0%이고, 531픽셀 파일에서는 378~425픽셀입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              규격 크기로 만든 파일이 용량 한도에 얼마나 가까운지 쟀습니다. 인물 사진은 쓰지 않았습니다.
              크기와 용량만 재는 측정이라 NASA 공공 도메인 사진 두 장을 썼습니다.
            </p>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">거북이 사진</strong>: 5522×4312, 원본 15.78MB.
                자갈과 등껍질 잔무늬가 많습니다
              </li>
              <li>
                <strong className="text-brand-black">꽃 사진</strong>: 8192×5464, 원본 9.18MB. 배경이
                흐립니다
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진을 floor05{" "}
              <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                이미지 크롭
              </Link>
              과 같은 방식으로 처리했습니다. 규격 비율로 가운데 최대 영역을 자르고, 그 영역을 규격
              픽셀로 줄여 저장합니다. 크롭 도구의 JPG 품질은 92%로 고정이고, 다른 품질 값은 같은 결과를
              품질만 바꿔 저장한 것입니다. 브라우저는 Chromium 151입니다. 거북이 사진의 세 가지 크기는
              실제 도구에서 내려받은 파일과 바이트 수가 같은 것을 확인했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              용량은 1KB = 1,000바이트, 1MB = 1,000,000바이트로 적었습니다. 얼굴 크기나 배경색처럼 사진
              내용에 대한 조건, 접수 시스템이 실제로 파일을 받는지는 측정하지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: 규격 픽셀로 만든 파일
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">크기(px)</th>
                    <th className="py-2 pr-4 text-brand-black">쓰이는 곳</th>
                    <th className="py-2 pr-4 text-brand-black">남는 면적</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 92%</th>
                    <th className="py-2 pr-4 text-brand-black">PNG</th>
                    <th className="py-2 pr-4 text-brand-black">공식 한도</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {results.map((row) => (
                    <tr key={row.size} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.size}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.use}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.kept}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.jpg}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.png}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.limit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              값은 거북이 / 꽃 순서. 남는 면적은 규격 비율로 가운데를 잘랐을 때 원본 대비 비율입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 픽셀을 맞추면 용량은 따라온다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              413×531픽셀 JPG는 거북이 사진이 70KB, 꽃 사진이 30KB였습니다. 한도 500KB의 14.1%와
              5.9%입니다. 품질을 100%로 올려도 267KB와 183KB로 한도 안입니다. 원본 15.78MB는 한도의 약
              32배지만, 용량을 줄이려고 품질을 깎을 필요는 없었습니다. 픽셀 수가 줄면서 용량이 같이
              내려갑니다.
            </p>
            <div className="my-8 border border-brand-light/30 rounded-lg p-4 sm:p-6">
              <p className="text-sm font-medium text-brand-black mb-4">
                413×531픽셀 저장 용량 (거북이 사진, 막대 전체 = 한도 500KB)
              </p>
              <div className="space-y-3">
                {bars.map((bar) => (
                  <div key={bar.label}>
                    <div className="flex justify-between text-sm text-brand-mid mb-1">
                      <span>{bar.label}</span>
                      <span className="font-mono whitespace-nowrap pl-3">{bar.value}</span>
                    </div>
                    <div className="h-3 bg-brand-paper rounded">
                      <div
                        className="h-3 bg-brand-accent rounded"
                        style={{ width: `${bar.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              137×177픽셀은 더 작습니다. JPG로 10KB와 6KB, 한도 350KB의 3.0%와 1.8%입니다. 137×177은
              픽셀이 24,249개뿐이라 확대해 보면 흐립니다. 이 크기는 기관이 정한 것이니, 원본은 따로
              보관해 두는 편이 좋습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. PNG로 저장하면 한도에 바짝 붙는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 크롭은 PNG를 넣으면 PNG로 저장합니다. 같은 413×531픽셀을 PNG로 저장하니 거북이
              사진이 470KB, 한도의 94.1%였습니다. 꽃 사진은 360KB입니다. 운전면허와 수능 안내는 형식도
              JPG로 정해 두었으니, 캡처나 PNG로 받은 사진은{" "}
              <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                이미지 변환
              </Link>
              으로 JPG로 바꾼 뒤 자르면 됩니다. 국가공무원 응시원서는 PNG도 받고, 137×177픽셀 PNG는
              57KB와 43KB였습니다.
            </p>

            <BlogInlineCTA href="/tools/image/crop" label="이미지 크롭 →">
              &lsquo;여권 3.5×4.5&rsquo; 프리셋이 413×531픽셀로 저장합니다. 137×177은 &lsquo;정확한
              크기로 출력&rsquo;에 직접 넣으면 됩니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 가로 사진은 절반 가까이 잘린다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              3.5:4.5는 세로가 긴 비율입니다. 가로로 찍은 거북이 사진은 이 비율로 자르면 면적의 60.7%,
              꽃 사진은 51.9%만 남았습니다. 계산으로는 휴대폰에서 흔한 3:4 세로 사진이 96.4%, 9:16 세로
              사진이 72.3% 남고, 4:3 가로 사진은 58.3%입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              세로로 찍으면 버리는 부분이 가장 적습니다. 다만 남는 면적은 사진 전체 기준일 뿐, 머리
              길이가 규격에 맞는지는 다른 문제입니다. 가운데 자르기가 맞지 않으면 크롭 화면에서 영역을
              직접 옮기면 됩니다. 비율별로 얼마나 잘리는지는{" "}
              <Link href="/blog/image-crop-guide" className="text-brand-accent hover:underline">
                사진 자르기 실측
              </Link>
              에 더 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">이전 판에서 고친 것</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              이전 판은 운전면허 온라인 사진을 350×450픽셀·250KB로 적었습니다. 지금{" "}
              <OfficialLink source={SOURCES.koroad} />의 안내는 413×531픽셀 권장, 500KB 이하입니다(
              {CHECKED} 확인). 공무원 원서 사진도 100KB 미만이라고 적었지만{" "}
              <OfficialLink source={SOURCES.gosi} />에는 350KB 미만으로 적혀 있습니다({CHECKED} 확인).
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              미국 비자, TOEIC 정기시험, 취업 사이트 수치는 출처를 확인하지 못해 지웠습니다. 원형 프로필
              자르기는 증명사진 규격과 관계가 없어{" "}
              <Link href="/blog/image-crop-guide" className="text-brand-accent hover:underline">
                사진 자르기 글
              </Link>
              로 넘겼습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정리</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">상황</th>
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 확인·측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {summary.map((row) => (
                    <tr key={row.situation} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 font-medium text-brand-black min-w-[9rem]">
                        {row.situation}
                      </td>
                      <td className="py-2 pr-4 min-w-[10rem]">{row.action}</td>
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">규격 픽셀로 잘라 보기</h3>
              <p className="text-brand-light mb-6">
                프리셋을 고르면 3.5:4.5 비율로 잡고 413×531픽셀로 저장합니다.
                <br />
                접수 전에 기관 페이지의 규격을 한 번 더 확인하세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 크롭
                </Link>
                <Link
                  href="/tools/image/convert"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  JPG로 변환
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="id-photo-size-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
