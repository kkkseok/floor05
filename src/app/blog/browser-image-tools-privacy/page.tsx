import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("browser-image-tools-privacy"),
  title: "브라우저 처리 이미지 도구, 정말 안 올라가나 - 요청 254건 실측",
};

// 2026-11-22 측정 (Chromium 151.0.7922.34, Playwright)
// 원자료: docs/blog-data/network-2026-11-22.json — 아래 주석의 키는 이 파일의 derived.* 경로
// 스크립트: scripts/blog-measure/network-audit.mjs, network-audit-merge.mjs

const faqs = [
  {
    question: "브라우저에서 처리한다는 도구는 파일을 서버로 보내지 않나요?",
    answer:
      "이번에 확인한 범위에서는 보내지 않았습니다. 운영 중인 floor05에서 압축·변환·EXIF 삭제·사진 PDF 변환·연봉 계산기를 쓰는 동안 브라우저가 보낸 요청은 254건이었고 전부 GET이었으며 본문이 실린 요청은 0건이었습니다. 넣은 파일은 합계 14.5MB였습니다. Chromium 151에서 2026년 11월 22일에 도구 5개를 잰 결과이고, 다른 서비스는 재지 않았습니다.",
  },
  {
    question: "그러면 밖으로 나가는 정보가 하나도 없나요?",
    answer:
      "있습니다. 같은 측정에서 광고 관련 요청이 67건 나갔고, 그중 도구 페이지마다 2~3건은 주소에 보고 있는 페이지 주소를 담고 있었습니다. 방문 통계는 일반 방문자 조건으로 재현했을 때 도구 하나당 2~3건, 한 건에 140~226바이트였고 도구 이름과 처리 장수 같은 사용 이벤트가 들어 있었습니다. 파일 이름이나 내용은 들어 있지 않았습니다.",
  },
  {
    question: "페이지를 연 뒤 인터넷을 끊어도 처리가 되나요?",
    answer:
      "측정한 도구 5개는 모두 됐습니다. 압축과 변환은 처리용 스크립트 파일 하나를 받지 못했지만 다른 경로로 작업을 끝냈고, 압축 결과는 연결된 상태보다 25바이트 작았습니다(1,463,995바이트와 1,464,020바이트). 나머지 결과는 바이트 단위로 같았습니다.",
  },
  {
    question: "이 측정에 쓴 사진은 어디에 남아 있나요?",
    answer:
      "측정용 사진은 스크립트가 캔버스로 그린 2.72MB JPG와 3.18MB PNG 두 장이고, 측정한 컴퓨터의 임시 폴더에만 있습니다. 요청 기록 254건 어디에도 이 파일의 조각이나 이름이 없었습니다. 측정에 쓴 자동화 브라우저에서는 통계 전송도 생략되어, 사진을 몇 장 처리했다는 사용 이벤트조차 나가지 않았습니다.",
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

// derived.prodRun2.table — 운영 사이트(www.floor05.com), 열기 → 사용 → 떠나기 전체
const prodRows = [
  { tool: "이미지 압축", input: "JPG 2.72MB", total: 51, own: 37, ads: 13, stat: 1, use: 2, body: 0 },
  { tool: "포맷 변환 (PNG → JPG)", input: "PNG 3.18MB", total: 51, own: 37, ads: 13, stat: 1, use: 2, body: 0 },
  { tool: "EXIF 삭제", input: "JPG 2.72MB", total: 51, own: 36, ads: 14, stat: 1, use: 0, body: 0 },
  { tool: "사진 PDF 변환", input: "2장 5.90MB", total: 52, own: 37, ads: 14, stat: 1, use: 0, body: 0 },
  { tool: "연봉 계산기", input: "숫자 4321", total: 49, own: 35, ads: 13, stat: 1, use: 0, body: 0 },
];

// derived.control (runs.local.control.ways) — 일부러 올리는 페이지를 같은 감시 코드로 본 결과
const controlRows = [
  { way: "fetch에 파일 그대로", sent: "2,719,309", size: "잡음", content: "못 봄" },
  { way: "fetch에 FormData", sent: "2,719,501", size: "잡음", content: "못 봄" },
  { way: "fetch PUT", sent: "2,719,309", size: "잡음", content: "못 봄" },
  { way: "XMLHttpRequest", sent: "2,719,309", size: "잡음", content: "못 봄" },
  { way: "fetch에 ArrayBuffer", sent: "2,719,309", size: "잡음", content: "봄" },
  { way: "base64로 바꿔 JSON에", sent: "40,008", size: "잡음", content: "봄" },
  { way: "sendBeacon", sent: "60,000", size: "잡음", content: "못 봄" },
  { way: "워커 안에서 fetch", sent: "2,719,309", size: "잡음", content: "못 봄" },
];

// derived.visitorAnalytics.perTool[].events — 로컬 빌드에 운영 통계 스크립트를 연결해 재현
const eventRows = [
  { tool: "이미지 압축", posts: 3, bytes: 563, props: "tool_use: 도구 이름, 장수 1, 모드 quality / download: 도구 이름, single" },
  { tool: "포맷 변환", posts: 3, bytes: 549, props: "tool_use: 도구 이름, 장수 1, 바꾼 형식 jpg / download: 도구 이름, single" },
  { tool: "EXIF 삭제", posts: 3, bytes: 570, props: "tool_use: 도구 이름, 장수 1 / download: 도구 이름, single" },
  { tool: "사진 PDF 변환", posts: 3, bytes: 587, props: "tool_use: 도구 이름, 장수 2, 화질 original / download: 도구 이름, single" },
  { tool: "연봉 계산기", posts: 2, bytes: 319, props: "tool_use: 도구 이름" },
];

// derived.local.offline — 로컬 빌드, 페이지를 연 뒤 context.setOffline(true)
const offlineRows = [
  { tool: "이미지 압축", done: "완료", failed: 1, result: "25바이트 다름 (1,464,020 → 1,463,995)" },
  { tool: "포맷 변환", done: "완료", failed: 1, result: "같음 (329,377바이트)" },
  { tool: "EXIF 삭제", done: "완료", failed: 0, result: "같음 (3,184,044바이트)" },
  { tool: "사진 PDF 변환", done: "완료", failed: 0, result: "같음 (3,093,676바이트)" },
  { tool: "연봉 계산기", done: "완료", failed: 0, result: "같음 (3,143,943원)" },
];

const th = "py-2 pr-4 text-brand-black";
const td = "py-2 pr-4";
const tdNum = "py-2 pr-4 whitespace-nowrap font-mono";

export default function BrowserImageToolsPrivacyPage() {
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
            <span className="text-brand-mid">브라우저 처리 네트워크 실측</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              브라우저에서 처리한다는 도구, 정말 안 올라가나
            </h1>
            <p className="text-lg text-brand-mid">
              도구 5개를 쓰는 동안 브라우저가 보낸 요청 254건을 전부 기록했습니다
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-11-22">2026-11-22 측정</time>
              <span>·</span>
              <span>8분 읽기</span>
            </div>
          </header>

          <div>
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              floor05는 도구마다 &ldquo;파일을 서버로 보내지 않는다&rdquo;고 적어 둡니다. 적어 두는 것과
              확인하는 것은 다른 일이라, 운영 중인 사이트에서 도구 5개를 실제로 쓰면서 브라우저가
              내보낸 요청을 하나도 빼지 않고 기록했습니다. 요청은 254건이었고 전부 GET이었습니다.
              넣은 파일은 합계 14.5MB였는데 본문이 실린 요청은 0건이었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그렇다고 아무것도 나가지 않은 것은 아닙니다. 254건 중 67건은 광고 쪽으로 간 요청이고,
              방문 통계도 따로 전송됩니다. 무엇이 얼마나 나가는지도 같은 방법으로 재서 아래에 적었습니다.
              측정한 대상은 floor05뿐이고, 다른 서비스가 파일을 어떻게 다루는지는 이 글에서 다루지 않습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 어떻게 쟀나
            </h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">브라우저</strong>: Chromium 151(Playwright로 조작).
                사람이 누르는 것과 같은 순서로 파일을 고르고, 처리 버튼을 누르고, 결과를 내려받았습니다.
              </li>
              <li>
                <strong className="text-brand-black">파일</strong>: 스크립트가 캔버스로 그린 JPG
                한 장(3000×2000, 2,719,309바이트)과 PNG 한 장(1600×1200, 3,179,786바이트). 남의 사진은
                쓰지 않았습니다.
              </li>
              <li>
                <strong className="text-brand-black">도구</strong>: 이미지 압축, 포맷 변환, EXIF 삭제,
                사진 PDF 변환, 연봉 계산기. floor05 도구 20개 중 5개입니다.
              </li>
              <li>
                <strong className="text-brand-black">기록한 것</strong>: 요청마다 대상 호스트, 메서드,
                본문 크기, 응답 코드. 페이지를 여는 단계, 도구를 쓰는 단계, 페이지를 떠나는 단계로 나눠
                적었습니다. 웹소켓 연결도 셌고 0건이었습니다.
              </li>
              <li>
                <strong className="text-brand-black">장소</strong>: 운영 사이트(측정 당시 주소 www.floor05.com)와,
                같은 코드를 내 컴퓨터에서 빌드한 로컬 사이트. 어느 쪽 숫자인지는 표마다 적었습니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              본문 크기는 브라우저가 보고한 전송 데이터 길이와 요청 헤더의 content-length 중 큰 값으로
              잡았습니다. 이 기준이 믿을 만한지는 다음 절에서 먼저 확인했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 감시가 업로드를 놓치지 않는지부터 확인했다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              요청 기록에 업로드가 없다는 결과는, 그 기록 방법이 업로드를 잡아낼 수 있을 때만 의미가
              있습니다. 그래서 일부러 파일을 올리는 시험 페이지를 만들어 8가지 방법으로 같은 JPG를
              보내게 하고, 같은 감시 코드로 지켜봤습니다. 받는 쪽 서버가 센 바이트와 감시가 잡은 본문
              크기를 비교했습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>올린 방법</th>
                    <th className={th}>서버가 받은 바이트</th>
                    <th className={th}>크기로</th>
                    <th className={th}>내용으로</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {controlRows.map((r) => (
                    <tr key={r.way} className="border-b border-brand-light/20">
                      <td className={td}>{r.way}</td>
                      <td className={tdNum}>{r.sent}</td>
                      <td className={td}>{r.size}</td>
                      <td className={td}>{r.content}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              &ldquo;크기로&rdquo;는 감시가 잡은 본문 크기가 서버가 받은 바이트와 같았는지, &ldquo;내용으로&rdquo;는
              본문 안에서 파일 조각을 찾아냈는지입니다. base64와 sendBeacon은 파일 앞부분만 보내게 했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              크기는 8가지 모두 서버가 받은 값과 바이트 단위로 같았습니다. 반면 본문 내용을 들여다보는
              방법은 2가지에서만 통했습니다. 파일 객체를 그대로 본문에 넣으면 Chromium이 본문 내용을
              감시 쪽에 넘겨주지 않기 때문입니다. 그래서 이 글의 판정 기준은 본문 크기입니다. 파일이
              2.72MB인데 본문 크기의 합이 0이면, 어떤 방법으로도 그 파일이 통째로 나가지는 않았다는
              뜻입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 운영 사이트 결과: 254건, 본문 0바이트
            </h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>도구</th>
                    <th className={th}>넣은 것</th>
                    <th className={th}>요청</th>
                    <th className={th}>자사</th>
                    <th className={th}>광고</th>
                    <th className={th}>통계</th>
                    <th className={th}>사용 중</th>
                    <th className={th}>본문 있음</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {prodRows.map((r) => (
                    <tr key={r.tool} className="border-b border-brand-light/20">
                      <td className={`${td} whitespace-nowrap`}>{r.tool}</td>
                      <td className={`${td} whitespace-nowrap`}>{r.input}</td>
                      <td className={tdNum}>{r.total}</td>
                      <td className={tdNum}>{r.own}</td>
                      <td className={tdNum}>{r.ads}</td>
                      <td className={tdNum}>{r.stat}</td>
                      <td className={tdNum}>{r.use}</td>
                      <td className={tdNum}>{r.body}</td>
                    </tr>
                  ))}
                  <tr className="font-medium text-brand-black">
                    <td className={td}>합계</td>
                    <td className={`${td} whitespace-nowrap`}>14.5MB</td>
                    <td className={tdNum}>254</td>
                    <td className={tdNum}>182</td>
                    <td className={tdNum}>67</td>
                    <td className={tdNum}>5</td>
                    <td className={tdNum}>4</td>
                    <td className={tdNum}>0</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              운영 사이트, Chromium 151, 2026-11-22. 1MB=1,000,000바이트. &ldquo;자사&rdquo;는 측정 당시 주소인 www.floor05.com의
              페이지·스크립트·글꼴 파일, &ldquo;통계&rdquo;는 통계 스크립트 파일을 받는 요청, &ldquo;사용 중&rdquo;은
              파일을 고른 뒤부터 내려받기까지 새로 생긴 요청 수입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              254건은 전부 GET이었고 POST나 PUT은 없었습니다. 본문 크기의 합은 0바이트입니다. 요청 주소에도
              파일 이름이나 파일 조각이 들어 있지 않았고, 계산기에 넣은 숫자 4321도 요청 주소나 본문에서
              찾지 못했습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              같은 측정을 그날 한 번 더 했을 때는 255건이었고, 그중 1건이 POST였습니다. 사진 PDF 변환
              페이지를 여는 단계에서 광고 스크립트가 pagead2.googlesyndication.com으로 보낸 186바이트짜리
              요청입니다. 파일을 고르기 전이었고 본문에 파일 조각은 없었습니다. 광고 요청 수는 이렇게
              잴 때마다 조금씩 달라집니다.
            </p>

            <figure className="my-8">
              <div className="rounded-lg bg-brand-paper p-5">
                <p className="text-sm font-medium text-brand-black mb-3">
                  이미지 압축 한 번: 넣은 파일과 그동안 나간 요청 본문
                </p>
                <div className="space-y-3 text-sm text-brand-mid">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>넣은 JPG</span>
                      <span className="font-mono">2,719,309바이트</span>
                    </div>
                    <div className="h-4 w-full rounded-sm bg-brand-black" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>요청 본문 합계 (운영 사이트 측정)</span>
                      <span className="font-mono">0바이트</span>
                    </div>
                    <div className="h-4 w-full rounded-sm border border-brand-light/40" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span>요청 본문 합계 (통계 전송 재현, 6절)</span>
                      <span className="font-mono">417바이트</span>
                    </div>
                    <div className="h-4 w-full rounded-sm border border-brand-light/40">
                      <div className="h-full bg-brand-accent" style={{ width: "2px" }} />
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="text-sm text-brand-subtle mt-2">
                막대 길이는 바이트에 비례합니다. 417바이트는 2,719,309바이트의 6,521분의 1이라 비율대로
                그리면 보이지 않아 2픽셀로 표시했습니다.
              </figcaption>
            </figure>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 사용 중에 생긴 요청 4건의 정체
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              파일을 고른 뒤에 새로 생긴 요청은 압축에서 2건, 변환에서 2건이었습니다. 둘 다
              측정 당시 주소인 www.floor05.com의 /_next/static/ 아래 스크립트 파일을 받는 GET입니다. 압축과 변환은 화면이
              멈추지 않도록 이미지 처리를 별도 작업 스레드(워커)에 맡기는데, 그 워커의 코드를 처음 처리할
              때 받아 오는 것입니다. 받는 요청이라 본문은 없습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              EXIF 삭제, PDF 변환, 계산기는 사용 중에 생긴 요청이 0건이었습니다. 페이지를 떠날 때 생긴
              요청도 5개 도구 모두 0건이었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. 인터넷을 끊고 다시 해 봤다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              서버가 처리에 관여한다면 연결을 끊었을 때 작업이 실패해야 합니다. 로컬 빌드에서 페이지를
              다 연 뒤 브라우저를 오프라인으로 바꾸고 같은 작업을 반복했습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>도구</th>
                    <th className={th}>오프라인 처리</th>
                    <th className={th}>실패한 요청</th>
                    <th className={th}>연결 상태 결과와 비교</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {offlineRows.map((r) => (
                    <tr key={r.tool} className="border-b border-brand-light/20">
                      <td className={`${td} whitespace-nowrap`}>{r.tool}</td>
                      <td className={td}>{r.done}</td>
                      <td className={tdNum}>{r.failed}</td>
                      <td className={td}>{r.result}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              로컬 빌드(운영과 같은 코드), Chromium 151. 운영 사이트에서는 오프라인 측정을 하지 않았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              5개 모두 끝까지 됐습니다. 압축과 변환에서는 4절의 워커 파일을 받으려는 요청이 1건씩
              실패했는데, 워커를 못 쓰면 같은 처리를 페이지의 메인 스레드에서 하도록 되어 있어 작업은
              끝났습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              이때 압축 결과가 25바이트 달랐습니다. 워커로 처리한 파일은 1,464,020바이트, 메인 스레드로
              처리한 파일은 1,463,995바이트입니다. 처리 경로가 둘이라 생긴 차이이고, 25바이트가 어디서
              갈리는지는 이번에 뜯어보지 않았습니다. 변환 결과는 두 경로가 바이트 단위로 같았습니다.
            </p>

            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              개발자 도구를 열어 둔 채로 써 보세요. 아래 7절의 순서대로 보면 같은 기록이 나옵니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              6. 실제로 밖으로 나가는 것
            </h2>
            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-2">
              광고 요청: 페이지마다 12~14건
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              도구 페이지 하나를 열면 광고 쪽으로 13~14건의 요청이 나갔고, 홈과 문의 페이지는 12건이었습니다.
              대상은 Google의 호스트 5곳입니다(pagead2.googlesyndication.com, googleads.g.doubleclick.net,
              ep1·ep2.adtrafficquality.google, www.google.com). 이 가운데 도구 페이지마다 2~3건은 주소에 지금
              보고 있는 페이지의 주소를 담고 있었습니다. 방문이 끝난 뒤 브라우저에는 doubleclick.net 쿠키가
              1개 남았고, floor05 도메인의 쿠키와 로컬 저장소 항목은 0개였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              개인정보처리방침 페이지는 광고 요청이 0건이었습니다. 광고 요청의 주소가 담은 값 하나하나가
              무엇을 뜻하는지는 Google 쪽 사양이라 이 측정으로는 알 수 없습니다. 기록한 것은 요청 수,
              대상, 크기입니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-2">
              방문 통계: 도구 이름과 장수가 집계된다
            </h3>
            <p className="text-brand-mid leading-relaxed mb-4">
              위 표의 운영 측정에서 통계 전송은 0건이었습니다. floor05가 쓰는 Vercel Web Analytics 스크립트가
              자동화된 브라우저를 알아보고 전송을 생략하기 때문입니다. 일반 방문자의 브라우저가 무엇을
              보내는지 보려고, 운영 사이트의 통계 스크립트를 그대로 받아 로컬 빌드에 연결하고 자동화 표시를
              끈 브라우저로 다시 쟀습니다. 전송은 로컬에서 받았고 운영 통계에는 들어가지 않았습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>도구</th>
                    <th className={th}>POST</th>
                    <th className={th}>본문 합계</th>
                    <th className={th}>이벤트와 속성</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {eventRows.map((r) => (
                    <tr key={r.tool} className="border-b border-brand-light/20">
                      <td className={`${td} whitespace-nowrap`}>{r.tool}</td>
                      <td className={tdNum}>{r.posts}</td>
                      <td className={tdNum}>{r.bytes}B</td>
                      <td className={td}>{r.props}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-subtle mb-8">
              로컬 빌드에 운영 통계 스크립트를 연결한 재현. POST에는 페이지를 열 때의 방문 기록 1건이
              포함됩니다. 14건 합계 2,588바이트, 한 건은 140~226바이트.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              전송 본문에 들어 있던 항목은 페이지 주소, 페이지 경로, 유입 경로, 통계 도구의 이름과 버전,
              그리고 이벤트 이름과 속성입니다. 도구를 한 번 쓰면 tool_use 이벤트가, 결과를 내려받으면
              download 이벤트가 나갑니다. 속성에는 도구 이름, 처리한 장수, 고른 모드나 형식이 들어갑니다.
              압축 한 번에 나간 본문은 방문 기록을 빼고 417바이트였습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              파일 이름, 파일 크기, 파일 내용, 계산기에 넣은 금액은 14건 어디에도 없었습니다. 측정할
              때는 이 사용 이벤트가{" "}
              <Link href="/privacy" className="text-brand-accent hover:underline">
                개인정보처리방침
              </Link>
              에 따로 적혀 있지 않았습니다. 이 측정을 하고 나서 방침의 처리하는 정보에 &lsquo;도구
              사용 기록&rsquo; 항목을 넣었습니다(2026-11-23 수정).
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              브라우저 밖에서 일어나는 일은 이 방법으로 잴 수 없습니다. 요청을 받은 서버는 IP 주소와
              브라우저 종류를 요청 자체에서 읽을 수 있고, 방침에 적힌 대략적인 지역이나 기기 유형은 그렇게
              만들어지는 값입니다. 이 부분은 측정이 아니라 Vercel의 설명에 기대고 있습니다.
            </p>

            <h3 className="text-lg font-semibold text-brand-black mt-6 mb-2">
              문의 폼: 제출할 때만
            </h3>
            <p className="text-brand-mid leading-relaxed mb-6">
              문의 페이지를 열기만 했을 때 폼 전송 서비스(Web3Forms)로 가는 요청은 0건이었습니다. 제출은
              하지 않았으니 제출 시의 전송은 측정값이 없습니다. 코드상으로는 보내기 버튼을 누르면 적은
              내용이 api.web3forms.com으로 전송되도록 되어 있습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              7. 다른 사이트에서 같은 확인을 하는 법
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              위 측정은 브라우저 개발자 도구로 사람이 직접 할 수 있는 일을 스크립트로 옮긴 것입니다. 크롬
              기준으로 순서는 이렇습니다.
            </p>
            <ol className="list-decimal pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>도구 페이지에서 F12를 눌러 개발자 도구를 열고 네트워크(Network) 탭으로 갑니다.</li>
              <li>
                페이지가 다 열릴 때까지 기다린 뒤 기록 지우기 버튼을 누릅니다. 이제부터 생기는 요청이
                &ldquo;사용 중&rdquo; 요청입니다.
              </li>
              <li>파일을 고르고 처리 버튼을 누르고 결과를 내려받습니다.</li>
              <li>
                목록의 메서드(Method) 열에서 POST나 PUT을 찾습니다. 열이 없으면 표 머리글을 오른쪽 클릭해
                켭니다.
              </li>
              <li>
                POST가 있으면 눌러서 요청 헤더의 content-length를 봅니다. 이 값이 고른 파일 크기와 비슷하면
                파일이 전송된 것입니다. 수백 바이트라면 통계나 광고 신호일 가능성이 큽니다.
              </li>
              <li>
                끝으로 네트워크 탭의 속도 제한 메뉴에서 오프라인을 고르고 같은 작업을 다시 해 봅니다.
              </li>
            </ol>
            <p className="text-brand-mid leading-relaxed mb-6">
              읽을 때 주의할 점이 둘 있습니다. 첫째, 2절에서 본 것처럼 본문 내용은 개발자 도구에도 안
              보일 수 있으니 내용보다 크기를 봅니다. 둘째, 오프라인에서 실패한다고 곧바로 서버 처리라고
              단정할 수는 없습니다. floor05의 압축처럼 처리용 코드를 그때 받아 오는 구조일 수도 있습니다.
              반대로 오프라인에서 끝까지 된다면 그 작업에 서버가 필요하지 않았다는 것은 분명합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              8. 확인한 범위와 확인하지 못한 것
            </h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-6 leading-relaxed">
              <li>도구 20개 중 5개만 쟀습니다. HEIC 변환처럼 별도 라이브러리를 받아 오는 도구는 재지 않았습니다.</li>
              <li>브라우저는 Chromium 151 하나입니다. 사파리와 파이어폭스는 재지 않았습니다.</li>
              <li>
                2026년 11월 22일의 배포 상태입니다. 코드가 바뀌면 결과도 바뀔 수 있습니다. 그래서 파일
                전송이 없다는 항목은 저장소의 자동 테스트에도 들어 있습니다.
              </li>
              <li>자동화된 브라우저라 광고가 사람에게 보일 때와 요청 수가 다를 수 있습니다.</li>
              <li>문의 폼 제출, 서버 쪽에서 남는 접속 기록은 측정하지 않았습니다.</li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              정리
            </h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className={th}>질문</th>
                    <th className={th}>답</th>
                    <th className={th}>근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className={td}>넣은 파일이 전송됐나</td>
                    <td className={td}>전송되지 않음</td>
                    <td className={td}>운영 254건 전부 GET, 본문 합계 0바이트 (넣은 파일 14.5MB)</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className={td}>감시 방법을 믿을 수 있나</td>
                    <td className={td}>크기 기준으로는</td>
                    <td className={td}>업로드 8가지 모두 서버 수신 바이트와 일치, 내용 대조는 2가지만</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className={td}>연결 없이 되나</td>
                    <td className={td}>5개 모두 됨</td>
                    <td className={td}>로컬 빌드 오프라인, 압축만 결과 25바이트 차이</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className={td}>광고로 나가는 것</td>
                    <td className={td}>페이지당 12~14건</td>
                    <td className={td}>Google 호스트 5곳, 2~3건은 페이지 주소 포함, 쿠키 1개</td>
                  </tr>
                  <tr>
                    <td className={td}>통계로 나가는 것</td>
                    <td className={td}>도구당 2~3건</td>
                    <td className={td}>재현 측정 14건 2,588바이트, 도구 이름·장수·모드 포함, 파일 정보 없음</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">
              자주 묻는 질문
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, i) => (
                <div
                  key={faq.question}
                  className={i < faqs.length - 1 ? "border-b border-brand-light/20 pb-6" : "pb-6"}
                >
                  <h3 className="text-lg font-semibold text-brand-black mb-2">
                    Q. {faq.question}
                  </h3>
                  <p className="text-brand-mid leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                믿지 말고 열어 보세요
              </h3>
              <p className="text-brand-light mb-6">
                네트워크 탭을 켜고 써 보면 이 글의 표를 직접 다시 만들 수 있습니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 압축
                </Link>
                <Link
                  href="/tools/image/exif-remove"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  EXIF 삭제
                </Link>
                <Link
                  href="/tools/pdf/image-to-pdf"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  사진 PDF 변환
                </Link>
              </div>
            </div>
          </div>

          <BlogExtras slug="browser-image-tools-privacy" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
