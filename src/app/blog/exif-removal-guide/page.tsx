import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("exif-removal-guide"),
  title: "사진 위치정보(EXIF) 삭제 - 카메라 원본 두 장을 뜯어봤습니다",
};

const faqs = [
  {
    question: "GPS를 끄고 찍으면 위치가 전혀 안 남나요?",
    answer:
      "꼭 그렇지는 않습니다. 이번에 뜯어본 두 사진은 GPS 좌표가 없었지만, XMP 영역의 도시·장소 칸에 'KSC'(케네디우주센터)가 적혀 있었습니다. 보정 프로그램이나 사진 관리 앱에서 넣은 위치 글자는 GPS와 별개로 남습니다.",
  },
  {
    question: "EXIF를 지우면 화질이 떨어지나요?",
    answer:
      "floor05 EXIF 삭제는 사진을 JPG 품질 95%로 다시 저장해 메타데이터를 떼어냅니다. 원본 해상도 그대로 PSNR이 42.4dB(거북이)와 48.2dB(꽃)로, 나란히 놓고 봐도 차이를 찾기 어려운 수준이었습니다. 용량은 15.78MB → 8.76MB, 9.18MB → 5.55MB로 줄었습니다.",
  },
  {
    question: "카메라 일련번호가 남으면 무엇이 문제인가요?",
    answer:
      "같은 일련번호가 적힌 사진은 같은 카메라에서 나왔다는 뜻입니다. 익명으로 올린 사진과 실명 계정에 올린 사진의 번호가 같다면 두 사진을 한 사람과 연결할 단서가 됩니다. 이번 사진들은 EXIF와 XMP 두 곳에 같은 번호를 기록하고 있었습니다.",
  },
  {
    question: "지우는 동안 사진이 외부로 나가나요?",
    answer:
      "나가지 않습니다. 메타데이터를 읽는 것도, 다시 저장하는 것도 사진을 고른 그 브라우저 탭이 합니다. 손에 남는 건 정보가 빠진 사본 한 장이고, 원본 파일은 건드리지 않습니다.",
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

// 2026-10-15 측정 (원자료: docs/blog-data/exif-2026-10-15.json)
const foundRows = [
  { item: "촬영자 이름", where: "EXIF Artist · XMP", value: "NASA/Ben Smegelsky" },
  { item: "카메라 본체 일련번호", where: "EXIF · XMP 두 곳", value: "12자리 숫자" },
  { item: "렌즈 모델·일련번호", where: "EXIF", value: "EF16-35mm f/2.8L III USM · 10자리" },
  { item: "촬영 시각", where: "EXIF", value: "2021-01-21 12:31:37, 1/100초, 시간대 −05:00" },
  { item: "보정 프로그램", where: "EXIF Software", value: "Lightroom Classic 10.1.1 (Windows)" },
  { item: "보정 이력", where: "XMP History", value: "6건" },
  { item: "장소 글자", where: "XMP City·Location", value: "KSC" },
  { item: "사진 설명문", where: "EXIF·IPTC", value: "영어 한 문단" },
];

const segmentRows = [
  { name: "EXIF (APP1)", tortoise: "17,646B", flower: "39,662B", after: "없음" },
  { name: "XMP (APP1)", tortoise: "11,363B", flower: "5,413B", after: "없음" },
  { name: "IPTC (APP13)", tortoise: "16,870B", flower: "872B", after: "없음" },
  { name: "APP2 (색 프로필 등)", tortoise: "3,162B", flower: "512B", after: "sRGB 프로필 474B" },
  { name: "JFIF (APP0)", tortoise: "없음", flower: "없음", after: "18B" },
];

export default function ExifRemovalGuidePage() {
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
            <span className="text-brand-mid">사진 위치정보(EXIF) 삭제</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 위치정보(EXIF) 삭제
            </h1>
            <p className="text-lg text-brand-mid">카메라 원본 두 장을 뜯어봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>7분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              &ldquo;사진에는 위치정보가 들어 있으니 지우고 올리세요&rdquo;라는 말은 익숙합니다. 그런데
              실제 사진 한 장에 무엇이 얼마나 들어 있는지 열어 본 적은 드뭅니다. 그래서 NASA가 공공
              도메인으로 공개한 카메라 원본 두 장을 바이트 단위로 뜯어봤습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              두 사진에는 GPS 좌표가 없었습니다. 그런데도 장소, 촬영자, 카메라 일련번호가 남아
              있었습니다. 그리고 이 과정에서 floor05 EXIF 삭제의 &lsquo;위치정보 포함&rsquo; 표시가
              틀리게 뜨는 문제를 발견해 고쳤습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 확인했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-8 leading-relaxed">
              <li>
                거북이 사진: Canon EOS 5D Mark IV로 찍고 Lightroom에서 보정한 JPG, 15.78MB
              </li>
              <li>꽃 사진: Canon EOS R5로 찍은 JPG, 9.18MB</li>
              <li>
                JPG 파일의 머리 부분(APP 세그먼트)을 순서대로 읽어 영역별 크기를 재고, EXIF 태그는
                Pillow 12.1로, XMP는 본문 텍스트로 확인했습니다.
              </li>
              <li>
                그다음 두 파일을 floor05{" "}
                <Link href="/tools/image/exif-remove" className="text-brand-accent hover:underline">
                  EXIF 삭제
                </Link>
                에 넣고, 내려받은 결과를 같은 방법으로 다시 읽었습니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              거북이 사진 한 장에서 나온 것
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              EXIF 태그만 46개였습니다. 그중 사람이나 장소를 짐작하게 하는 항목만 추렸습니다.
            </p>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">항목</th>
                    <th className="py-2 pr-4 text-brand-black">기록된 곳</th>
                    <th className="py-2 pr-4 text-brand-black">값</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {foundRows.map((row) => (
                    <tr key={row.item} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.item}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.where}</td>
                      <td className="py-2 pr-4">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-6">
              꽃 사진도 비슷했습니다. EXIF 태그 55개에 촬영자 이름, 본체·렌즈 일련번호, 1/100초 단위
              촬영 시각이 있었고, 캐논이 자체 형식으로 기록하는 MakerNote도 들어 있어 EXIF 영역만
              39.7KB였습니다. 카메라 소유자 이름 칸(CameraOwnerName)은 비어 있었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. GPS가 없어도 장소는 남는다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진 모두 GPS 좌표는 없었습니다. 꽃 사진에는 GPS 영역 자체는 있었지만 안에 버전 번호만
              있고 위도·경도가 비어 있었습니다. 그런데 XMP 영역의 도시(City)와 장소(Location) 칸에는
              둘 다 &lsquo;KSC&rsquo;, 케네디우주센터의 약칭이 적혀 있었습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              GPS 좌표는 휴대폰이 자동으로 넣지만, 장소 글자는 사진 관리 프로그램이나 보정 단계에서
              사람이 넣습니다. 그래서 &ldquo;카메라 위치 기록을 껐으니 괜찮다&rdquo;는 절반만 맞습니다.
              보정을 거친 사진이라면 EXIF뿐 아니라 XMP·IPTC까지 비워야 장소가 남지 않습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 일련번호는 두 군데에 적혀 있었다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              카메라 본체 일련번호는 EXIF의 BodySerialNumber에 한 번, XMP의 aux:SerialNumber에 또 한
              번 적혀 있었습니다. 같은 정보가 영역을 바꿔 두 번 들어 있는 셈입니다. EXIF 영역만 지우는
              방식이라면 XMP 쪽 번호는 그대로 남습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              일련번호 자체로 이름이 나오지는 않습니다. 하지만 같은 번호가 찍힌 사진은 같은 카메라에서
              나왔다는 뜻이라, 서로 다른 곳에 올린 사진을 한 사람과 이어 붙이는 단서가 됩니다.
            </p>

            <BlogInlineCTA href="/tools/image/exif-remove" label="EXIF 삭제 →">
              EXIF·XMP·IPTC를 한 번에 비웁니다. 여러 장이면 ZIP으로 받습니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. floor05로 지운 뒤 남은 것
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 파일을 EXIF 삭제에 넣고 결과 파일의 머리 부분을 다시 읽었습니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">영역</th>
                    <th className="py-2 pr-4 text-brand-black">거북이 원본</th>
                    <th className="py-2 pr-4 text-brand-black">꽃 원본</th>
                    <th className="py-2 pr-4 text-brand-black">삭제 후 (둘 다)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {segmentRows.map((row) => (
                    <tr key={row.name} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black whitespace-nowrap">{row.name}</td>
                      <td className="py-2 pr-4">{row.tortoise}</td>
                      <td className="py-2 pr-4">{row.flower}</td>
                      <td className="py-2 pr-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-4">
              EXIF·XMP·IPTC가 모두 사라지고, 기본 머리말(JFIF 18바이트)과 브라우저가 붙이는 표준 색
              프로필(sRGB 474바이트)만 남았습니다. 이름, 일련번호, 촬영 시각, &lsquo;KSC&rsquo;도 함께
              없어졌습니다. 두 사진은 원래 EXIF 색공간이 sRGB여서 색이 바뀌지도 않았습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05는 메타데이터 칸을 하나씩 지우지 않고, 사진을 브라우저에서 픽셀만 남기고 JPG 품질
              95%로 다시 저장합니다. 그래서 용량도 바뀝니다. 거북이 사진은 15.78MB에서 8.76MB로, 꽃
              사진은 9.18MB에서 5.55MB로 줄었고, 원본 해상도 그대로 PSNR은 42.4dB와 48.2dB였습니다.
              처리 시간은 장당 0.9초 남짓이었습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. &lsquo;위치정보 포함&rsquo; 표시를 고쳤습니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진을 넣었을 때 floor05는 둘 다 &lsquo;⚠ 위치정보(GPS) 포함&rsquo;이라고 표시했습니다.
              위에서 본 것처럼 실제로는 둘 다 좌표가 없었으니 틀린 경고입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              원인은 감지 방식이었습니다. 파일 앞부분에서 GPS 영역을 뜻하는 두 바이트(0x88, 0x25)를
              찾기만 했기 때문에, 다른 정보 안에 같은 바이트가 우연히 있어도 걸렸습니다. 지금은 EXIF의
              실제 구조를 따라가 GPS 영역을 찾고, 그 안에 위도나 경도가 기록돼 있을 때만 경고를 띄웁니다.
              경고 여부와 상관없이, 지우기 버튼을 누르면 모든 메타데이터가 비워지는 것은 이전과 같습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">언제 지우는 게 좋을까</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                중고거래·부동산 직거래 사진: 집 안에서 찍은 사진에 좌표가 남으면 거래 전에 집 위치부터
                알려주는 셈입니다.
              </li>
              <li>
                메신저 &lsquo;원본 전송&rsquo;, 이메일 첨부, 클라우드 공유 링크: 파일을 그대로 넘기는
                방식이라 메타데이터도 그대로 따라갑니다.
              </li>
              <li>
                익명으로 올리는 사진: 위치가 없어도 카메라 일련번호와 촬영 시각이 다른 사진과 이어질 수
                있습니다.
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-6">
              찍을 때부터 좌표를 남기지 않으려면 카메라 앱의 위치 기록을 끄면 됩니다. 아이폰은 위치
              서비스의 카메라 권한, 갤럭시는 카메라 설정의 위치 태그 항목입니다. 기종과 OS 버전에 따라
              메뉴 이름은 다를 수 있습니다. 다만 앞에서 본 것처럼 이 설정은 GPS 좌표만 막고, 보정 단계에서
              들어간 정보까지 막지는 않습니다.
            </p>

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
              <h3 className="text-xl font-bold text-brand-paper mb-3">올리기 전에 비우기</h3>
              <p className="text-brand-light mb-6">
                위치·이름·일련번호·촬영 시각을 픽셀만 남기고 떼어냅니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/exif-remove"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  EXIF 삭제
                </Link>
                <Link
                  href="/tools/image/mosaic"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  사진 모자이크
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="exif-removal-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
