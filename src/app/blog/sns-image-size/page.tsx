import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("sns-image-size"),
  title: "SNS 이미지 크기 - 공식 문서로 확인한 규격과 맞춤 결과 실측",
};

const faqs = [
  {
    question: "인스타그램에 올릴 사진은 몇 픽셀로 맞추면 되나요?",
    answer:
      "인스타그램 고객 센터(2026-11-19 확인)에 따르면 너비 1080픽셀, 비율 1.91:1에서 3:4 사이면 원래 해상도가 유지됩니다. 더 큰 사진은 너비 1080픽셀로 줄어듭니다. 15.78MB 카메라 원본을 너비 1080픽셀로 미리 줄이니 268KB가 됐습니다.",
  },
  {
    question: "유튜브 썸네일은 1280×720으로 만들면 안 되나요?",
    answer:
      "YouTube 고객센터(2026-11-19 확인)의 권장 해상도는 3840×2160픽셀이고 최소 너비는 640픽셀이라, 1280×720도 최소 조건은 넘습니다. 다만 권장 해상도로 만든 JPG는 사진에 따라 2.16MB가 나와 모바일 한도 2MB를 넘었습니다. 1280×720은 같은 사진이 249KB였습니다.",
  },
  {
    question: "작은 사진을 규격 크기로 키워서 올려도 되나요?",
    answer:
      "크기는 맞지만 화질은 돌아오지 않습니다. 540×540 사진을 1080×1080으로 키운 결과는 PSNR 28.42dB로, 원본에서 바로 1080×1080으로 줄여 저장한 38.45dB보다 10dB 낮았습니다. 가능하면 큰 원본에서 줄이세요.",
  },
  {
    question: "크기를 맞추는 동안 사진이 SNS보다 먼저 다른 곳에 올라가나요?",
    answer:
      "아니요. 리사이즈와 크롭은 사진을 연 브라우저 탭의 Canvas에서 끝납니다. 이 글의 측정도 같은 코드를 빈 페이지에서 돌린 것입니다. 사진이 기기를 처음 떠나는 때는 직접 SNS 앱에서 올리기 버튼을 누르는 순간입니다.",
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

// 2026-11-19 공식 페이지 확인 (원자료: docs/blog-data/sns-specs-2026-11-19.json)
const SOURCES = {
  instagram: {
    label: "Instagram 고객 센터",
    url: "https://help.instagram.com/1631821640426723",
  },
  ytThumb: {
    label: "YouTube 고객센터",
    url: "https://support.google.com/youtube/answer/72431?hl=ko",
  },
  ytBrand: {
    label: "YouTube 고객센터",
    url: "https://support.google.com/youtube/answer/10456525?hl=ko",
  },
  fbPage: {
    label: "Facebook 고객 센터",
    url: "https://www.facebook.com/help/125379114252045",
  },
  fbLink: {
    label: "Meta 개발자 문서",
    url: "https://developers.facebook.com/docs/sharing/webmasters/images/",
  },
  xProfile: {
    label: "X 고객센터",
    url: "https://help.x.com/ko/managing-your-account/how-to-customize-your-profile",
  },
  xPhoto: {
    label: "X 고객센터",
    url: "https://help.x.com/ko/using-x/posting-gifs-and-pictures",
  },
};

const specs = [
  {
    platform: "인스타그램",
    item: "피드 사진",
    value:
      "너비 320~1080px, 비율 1.91:1~3:4(너비 1080px일 때 높이 566~1440px). 더 큰 사진은 너비 1080px로 줄어듦",
    source: SOURCES.instagram,
  },
  {
    platform: "유튜브",
    item: "동영상 썸네일",
    value: "권장 3840×2160px(16:9), 최소 너비 640px, JPG·PNG, 모바일 2MB·데스크톱 50MB까지",
    source: SOURCES.ytThumb,
  },
  {
    platform: "유튜브",
    item: "Shorts 썸네일",
    value: "권장 2160×3840px(9:16), 최소 높이 640px",
    source: SOURCES.ytThumb,
  },
  {
    platform: "유튜브",
    item: "채널 배너",
    value:
      "권장 2560×1440px, 업로드 최소 2048×1152px(16:9), 글자·로고가 안 잘리는 영역 1235×338px, 6MB 이하",
    source: SOURCES.ytBrand,
  },
  {
    platform: "유튜브",
    item: "프로필 사진",
    value: "98×98px로 표시, 15MB 이하, JPG·GIF·BMP·PNG",
    source: SOURCES.ytBrand,
  },
  {
    platform: "페이스북",
    item: "페이지 프로필 사진",
    value: "최적 320×320px. 컴퓨터 176×176px, 스마트폰 196×196px로 표시되고 원형으로 잘림",
    source: SOURCES.fbPage,
  },
  {
    platform: "페이스북",
    item: "페이지 커버 사진",
    value: "851×315px·100KB 미만의 sRGB JPG가 가장 빨리 뜸. 최소 400×150px",
    source: SOURCES.fbPage,
  },
  {
    platform: "페이스북",
    item: "링크 공유 이미지",
    value: "1200×630px 이상 권장, 비율 1.91:1, 8MB 이하, 최소 200×200px",
    source: SOURCES.fbLink,
  },
  {
    platform: "X",
    item: "헤더·프로필 사진",
    value: "헤더 1500×500px, 프로필 400×400px 권장. JPG·GIF·PNG",
    source: SOURCES.xProfile,
  },
  {
    platform: "X",
    item: "게시물 사진",
    value: "5MB까지. GIF·JPEG·PNG",
    source: SOURCES.xPhoto,
  },
];

// 2026-11-19 측정 (Playwright Chromium 151, JPG 92%, 원자료: docs/blog-data/sns-size-2026-11-19.json)
// kept = 가운데 자르기 후 남는 면적, 값은 거북이 / 꽃 순서
const results = [
  { name: "인스타그램 3:4", size: "1080×1440", kept: "58.6% / 50.0%", bytes: "420KB / 133KB" },
  { name: "인스타그램 4:5", size: "1080×1350", kept: "62.5% / 53.4%", bytes: "400KB / 122KB" },
  { name: "인스타그램 1:1", size: "1080×1080", kept: "78.1% / 66.7%", bytes: "331KB / 93KB" },
  { name: "인스타그램 1.91:1", size: "1080×566", kept: "67.1% / 78.6%", bytes: "171KB / 52KB" },
  { name: "유튜브 썸네일(권장)", size: "3840×2160", kept: "72.0% / 84.3%", bytes: "2.16MB / 464KB" },
  { name: "유튜브 썸네일", size: "1280×720", kept: "72.0% / 84.3%", bytes: "249KB / 69KB" },
  { name: "유튜브 채널 배너", size: "2560×1440", kept: "72.0% / 84.3%", bytes: "951KB / 216KB" },
  { name: "페이스북 링크 이미지", size: "1200×630", kept: "67.2% / 78.7%", bytes: "212KB / 61KB" },
  { name: "페이스북 페이지 커버", size: "851×315", kept: "47.4% / 55.5%", bytes: "79KB / 31KB" },
  { name: "X 헤더", size: "1500×500", kept: "42.7% / 50.0%", bytes: "199KB / 69KB" },
];

const summary = [
  {
    situation: "인스타그램 피드",
    action: "너비 1080px, 비율 1.91:1~3:4 안에서 고르기",
    basis: "15.78MB 원본이 너비 1080px에서 268KB",
  },
  {
    situation: "유튜브 썸네일",
    action: "휴대폰으로 올릴 거면 용량부터 확인",
    basis: "3840×2160 JPG 2.16MB(모바일 한도 2MB 초과), 1280×720은 249KB",
  },
  {
    situation: "X 헤더·페이스북 커버",
    action: "가운데 자르기에 맡기지 말고 남길 부분을 직접 고르기",
    basis: "5522×4312 사진에서 남는 면적 42.7%, 47.4%",
  },
  {
    situation: "X 게시물 사진",
    action: "카메라 원본은 줄여서 올리기",
    basis: "원본 15.78MB·9.18MB, 너비 4096px로 줄이면 3.45MB·621KB",
  },
  {
    situation: "PNG로 저장된 사진",
    action: "JPG로 바꾼 뒤 맞추기",
    basis: "2560×1440 PNG 7.89MB(배너 한도 6MB 초과), JPG는 951KB",
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

export default function SNSImageSizePage() {
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
            <span className="text-brand-mid">SNS 이미지 크기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              SNS 이미지 크기
            </h1>
            <p className="text-lg text-brand-mid">
              공식 문서에서 확인한 규격만 남기고, 그 크기로 맞춘 결과를 쟀습니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-19">2026-11-19 확인·측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              SNS 이미지 규격표는 어디에나 있지만 숫자가 어디서 왔는지 적힌 표는 드뭅니다. 이 글의
              이전 판도 그랬습니다. 그래서 인스타그램, 유튜브, 페이스북, X의 공식 도움말을 직접 열어
              거기 적힌 수치만 남겼습니다. 공식 페이지에서 찾지 못한 수치는 지웠습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              그리고 카메라 원본 두 장을 확인된 크기로 맞춰 봤습니다. 유튜브가 권장하는 3840×2160
              썸네일은 사진에 따라 2.16MB가 나와 모바일 업로드 한도 2MB를 넘었고, X 헤더처럼 가로로
              긴 규격은 그 사진 면적의 절반 이상을 잘라냈습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              공식 페이지에서 확인한 규격
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              아래 수치는 모두 2026년 11월 19일에 각 운영사의 도움말·개발자 문서에서 읽은 것입니다.
              출처 칸의 링크가 그 페이지입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">플랫폼</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">항목</th>
                    <th className="py-2 pr-4 text-brand-black">공식 문서의 수치</th>
                    <th className="py-2 pr-4 text-brand-black whitespace-nowrap">출처 (확인일)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {specs.map((row) => (
                    <tr key={`${row.platform}-${row.item}`} className="border-b border-brand-light/20 align-top">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.platform}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.item}</td>
                      <td className="py-2 pr-4 min-w-[14rem]">{row.value}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">
                        <OfficialLink source={row.source} />
                        <br />
                        <span className="text-xs text-brand-subtle">2026-11-19</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-6">
              페이스북 수치는 페이지 기준입니다. 확인한 도움말 문서가 페이지를 대상으로 쓰여 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              <strong className="text-brand-black">
                규격은 바뀔 수 있으니 올리기 전에 공식 페이지를 확인하세요.
              </strong>{" "}
              실제로 바뀝니다. 이 글의 이전 판은 유튜브 썸네일을 1280×720, 2MB 이하로 적었는데, 지금{" "}
              <OfficialLink source={SOURCES.ytThumb} />
              에는 권장 해상도 3840×2160, 데스크톱 한도 50MB로 적혀 있습니다(2026-11-19 확인).
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확인하지 못해 뺀 것도 적어 둡니다. 인스타그램 스토리·릴스와 프로필 사진, 유튜브 프로필
              사진의 권장 업로드 크기, 페이스북 스토리, X 게시물 사진의 권장 픽셀은 공식 페이지에서
              수치를 찾지 못했습니다. 네이버 블로그와 카카오톡도 픽셀 규격을 적은 공식 문서를 찾지
              못해 이번 판에서 뺐습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">거북이 사진</strong>: NASA 공공 도메인, 5522×4312,
                원본 15.78MB. 가로가 조금 긴 4:3에 가까운 사진이고 자갈과 등껍질 잔무늬가 많습니다
              </li>
              <li>
                <strong className="text-brand-black">꽃 사진</strong>: NASA 공공 도메인, 8192×5464,
                원본 9.18MB. 3:2 비율이고 배경이 흐립니다
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진을 floor05{" "}
              <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                이미지 리사이즈
              </Link>
              의 SNS 프리셋과 같은 방식으로 맞췄습니다. 규격 비율대로 가운데를 자르고, 그 영역을 규격
              크기로 줄여, JPG 품질 92%로 저장합니다. 브라우저는 Chromium 151입니다. 프리셋에 있는
              다섯 가지 크기는 실제 도구에서 내려받은 파일과 바이트 수가 같은 것을 확인했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              용량은 1KB = 1,000바이트, 1MB = 1,000,000바이트로 적었습니다. 플랫폼이 올린 사진을 다시
              압축하는 정도는 밖에서 잴 수 없어 다루지 않습니다. 1080×1350과 1080×1080은 공식 문서에
              적힌 크기는 아닙니다. 인스타그램이 허용하는 비율 범위 안에서 고른 크기입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              측정 결과: 규격 크기로 맞췄을 때
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">맞춘 규격</th>
                    <th className="py-2 pr-4 text-brand-black">크기(px)</th>
                    <th className="py-2 pr-4 text-brand-black">남는 면적</th>
                    <th className="py-2 pr-4 text-brand-black">JPG 용량</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {results.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">
                        {row.name}
                      </td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.size}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.kept}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.bytes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              값은 거북이 / 꽃 순서. 남는 면적은 가운데를 잘랐을 때 원본 대비 비율입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 유튜브 권장 해상도 썸네일은 2MB를 넘을 수 있다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              3840×2160으로 맞춘 거북이 사진은 2.16MB였습니다. 공식 문서의 모바일 한도 2MB를 넘습니다.
              같은 크기의 꽃 사진은 464KB로, 4.6배 차이가 났습니다. 잔무늬가 많은 사진일수록 권장
              해상도에서 한도에 걸리기 쉽습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              데스크톱 한도는 50MB라 컴퓨터에서 올리면 문제가 없습니다. 휴대폰으로 올릴 거라면{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              으로 용량을 내리거나 크기를 줄이면 됩니다. 1280×720으로 맞춘 결과는 249KB와 69KB였고,
              이 크기도 최소 너비 640px는 넘습니다. 썸네일을 만드는 순서는{" "}
              <Link href="/blog/youtube-thumbnail-size" className="text-brand-accent hover:underline">
                유튜브 썸네일 글
              </Link>
              에서 따로 다룹니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 인스타그램은 1080px보다 큰 사진을 줄인다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              <OfficialLink source={SOURCES.instagram} />
              에는 고해상도 사진을 공유하면 너비 1080픽셀로 축소된다고 적혀 있습니다(2026-11-19 확인).
              15.78MB 원본을 그대로 올려도 결국 1080픽셀이 된다는 뜻입니다. 미리 너비 1080픽셀로
              줄이니 거북이 사진은 268KB, 원본 용량의 1.7%였습니다. 꽃 사진은 58KB였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              두 사진 모두 비율이 1.91:1~3:4 범위 안이라 자르지 않고 줄이기만 해도 됩니다. 세로로 길게
              올리려고 3:4로 자르면 거북이 사진은 면적의 58.6%, 꽃 사진은 50.0%만 남습니다. 가로 사진을
              세로로 만들면 그만큼을 버리게 됩니다.
            </p>

            <BlogInlineCTA href="/tools/image/resize" label="이미지 리사이즈 →">
              인스타그램 세 가지와 유튜브 두 가지 크기는 프리셋으로 들어 있습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 가로로 긴 헤더와 커버가 가장 많이 잘린다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              X 헤더(1500×500, 3:1)로 맞추면 거북이 사진은 42.7%만 남았습니다. 페이스북 페이지
              커버(851×315)는 47.4%입니다. 아래 그림에서 3번이 3:1로 자른 결과인데, 거북이 몸통 아래쪽이
              통째로 사라졌습니다. 1번(3:4)은 반대로 왼쪽 머리가 잘렸습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/sns-image-size/crop-tiles.jpg"
                alt="같은 거북이 사진을 3:4, 16:9, 3:1 비율로 가운데 잘라 나란히 놓은 그림. 3:4는 머리가, 3:1은 몸통 아래가 잘렸다"
                width={960}
                height={515}
                loading="lazy"
                className="block w-full border border-brand-light/30"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                같은 사진을 가운데 기준으로 자른 결과. 1 = 3:4(58.6% 남음), 2 = 16:9(72.0%), 3 =
                3:1(42.7%). 사진: NASA(공공 도메인)
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              가운데 자르기가 맞지 않는 사진은{" "}
              <Link href="/tools/image/crop" className="text-brand-accent hover:underline">
                이미지 크롭
              </Link>
              에서 남길 부분을 직접 고르고 &lsquo;정확한 크기로 출력&rsquo;에 규격 크기를 넣으면
              됩니다. 페이스북이 커버 사진에 권하는 100KB 미만은 두 사진 모두 자연스럽게 맞았습니다.
              851×315 JPG가 79KB와 31KB였습니다. 비율별로 얼마나 잘리는지는{" "}
              <Link href="/blog/image-crop-guide" className="text-brand-accent hover:underline">
                사진 자르기 실측
              </Link>
              에 더 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. X에는 카메라 원본이 그대로 올라가지 않는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              <OfficialLink source={SOURCES.xPhoto} />의 사진 한도는 5MB입니다(2026-11-19 확인). 두
              원본은 15.78MB와 9.18MB라 둘 다 넘습니다. 비율은 그대로 두고 너비만 4096픽셀로 줄이니
              3.45MB와 621KB가 됐습니다. X가 권장하는 게시물 사진 픽셀은 공식 페이지에서 찾지 못했기
              때문에, 여기서는 한도 안에 들어오는지만 봤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 작은 사진을 키우면 크기만 맞는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              규격보다 작은 사진을 키우면 어떻게 되는지도 쟀습니다. 거북이 사진을 540×540으로 줄여
              저장한 파일을 1080×1080으로 다시 키웠더니 PSNR이 28.42dB였습니다. 원본에서 바로
              1080×1080으로 줄여 저장한 것은 38.45dB입니다. 10dB 차이입니다. 320×320에서 키운 것은
              24.99dB까지 내려갔습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              PSNR은 원본에서 바로 줄인 1080×1080 이미지와 픽셀 값을 비교한 수치로, 높을수록 가깝습니다.
              키운 사진은 픽셀 수만 늘어날 뿐 없던 디테일이 생기지 않습니다. 리사이즈의
              &lsquo;원본보다 크게 키우지 않기&rsquo;를 켜 두면 작은 사진이 억지로 늘어나는 것을 막을
              수 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. PNG로 맞추면 용량 한도에 걸린다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 리사이즈는 PNG를 넣으면 PNG로 저장합니다. 같은 사진을 PNG로 저장해 보니 유튜브
              배너 크기(2560×1440)가 7.89MB와 5.79MB였습니다. 거북이 사진은 공식 한도 6MB를 넘습니다.
              JPG로는 951KB였습니다. 1280×720 썸네일도 PNG로는 1.92MB와 1.46MB로 모바일 한도 2MB에
              바짝 붙습니다. 사진이라면{" "}
              <Link href="/tools/image/convert" className="text-brand-accent hover:underline">
                이미지 변환
              </Link>
              으로 JPG로 바꾼 뒤 맞추는 편이 안전합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">정리</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">올릴 곳</th>
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">규격 크기로 맞춰 보기</h3>
              <p className="text-brand-light mb-6">
                프리셋을 고르면 가운데를 잘라 그 크기로 만듭니다.
                <br />
                남길 부분을 직접 고르려면 크롭을 쓰세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 리사이즈
                </Link>
                <Link
                  href="/tools/image/crop"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 크롭
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="sns-image-size" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
