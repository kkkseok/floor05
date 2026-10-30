import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("image-rotate-quality"),
  title: "사진 회전하면 화질이 떨어질까 - 90° 회전 20번 실측",
};

const faqs = [
  {
    question: "사진을 한 번 회전해서 저장하면 화질이 떨어지나요?",
    answer:
      "JPG라면 다시 저장하는 만큼만 떨어집니다. 90° 한 번 회전 후 품질 92%로 저장한 결과는 PSNR 40.59dB로, 회전 없이 다시 저장만 한 결과(40.57dB)와 사실상 같았습니다. 회전 자체가 화질을 깎는 게 아니라 JPG로 다시 저장하는 과정이 깎습니다.",
  },
  {
    question: "여러 번 돌려서 저장하면 어떻게 되나요?",
    answer:
      "손실이 빠르게 쌓입니다. 90° 회전과 저장을 20번 반복하니 PSNR이 40.59dB에서 34.59dB로 6dB 떨어졌습니다. 같은 횟수로 회전 없이 재저장만 했을 때는 0.5dB였습니다. 용량도 6.54MB에서 7.03MB로 오히려 늘었습니다.",
  },
  {
    question: "PNG 사진도 회전하면 화질이 떨어지나요?",
    answer:
      "아닙니다. 90° 단위 회전은 픽셀 자리만 바꾸는 작업이고, PNG는 무손실 형식이라 다시 저장해도 값이 바뀌지 않습니다. floor05 이미지 회전은 PNG는 PNG로, WebP는 WebP로 저장해 투명 배경도 그대로 둡니다.",
  },
  {
    question: "회전하는 동안 사진이 어디로 전송되나요?",
    answer:
      "전송되지 않습니다. 사진을 돌려 그리는 캔버스도, 결과를 저장하는 인코더도 지금 열어 둔 브라우저 탭 안에 있습니다. 결과 파일은 다운로드를 눌렀을 때 내 기기에만 만들어집니다.",
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

// 2026-10-15 측정 (Chromium 151, JPG 92%, 원자료: docs/blog-data/image-rotate-2026-10-15.json)
const rows = [
  { n: "1번", resave: "40.57dB", rotate: "40.59dB", rotate16: "40.59dB" },
  { n: "2번", resave: "40.51dB", rotate: "38.89dB", rotate16: "39.99dB" },
  { n: "4번", resave: "40.42dB", rotate: "37.86dB", rotate16: "39.89dB" },
  { n: "8번", resave: "40.28dB", rotate: "36.31dB", rotate16: "39.73dB" },
  { n: "12번", resave: "40.18dB", rotate: "35.53dB", rotate16: "39.61dB" },
  { n: "20번", resave: "40.06dB", rotate: "34.59dB", rotate16: "39.47dB" },
];

export default function ImageRotateQualityPage() {
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
            <span className="text-brand-mid">사진 회전과 화질</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 회전하면 화질이 떨어질까
            </h1>
            <p className="text-lg text-brand-mid">90° 회전 20번을 직접 재봤습니다</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>6분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              옆으로 누운 사진을 세우는 일은 흔합니다. 이 앱에서 한 번 돌리고, 다른 앱에서 또 돌리고,
              보내기 전에 다시 돌리기도 합니다. 그때마다 JPG가 다시 저장된다면 화질은 얼마나 깎일까요?
              카메라 원본 사진을 90°씩 20번 돌려 저장하면서 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              결과는 &ldquo;한 번은 괜찮고, 반복은 생각보다 위험하다&rdquo;였습니다. 그리고 손실이
              커지는 이유가 사진의 가로세로 크기와 관련 있다는 것도 확인했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                사진: NASA가 공공 도메인으로 공개한 거북이 사진(Canon EOS 5D Mark IV, 5522×4312, 15.78MB)
              </li>
              <li>
                회전 방식: floor05{" "}
                <Link href="/tools/image/rotate" className="text-brand-accent hover:underline">
                  이미지 회전
                </Link>
                과 같은 과정. 브라우저(Chromium 151) 캔버스에 90° 돌려 그린 뒤 JPG 품질 92%로 저장하고, 그
                파일을 다시 열어 또 돌렸습니다.
              </li>
              <li>
                비교 세 가지: ① 회전 없이 다시 저장만 반복 ② 90° 회전 + 저장 반복 ③ 사진을 5520×4304(16의
                배수)로 살짝 잘라낸 뒤 90° 회전 + 저장 반복
              </li>
              <li>
                화질은 PSNR로 비교했습니다. 기준은 원본 픽셀을 손실 없이 같은 각도로 옮긴 이미지라, 숫자가
                내려간 만큼이 순수하게 저장 과정에서 잃은 정보입니다.
              </li>
            </ul>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">반복</th>
                    <th className="py-2 pr-4 text-brand-black">① 재저장만</th>
                    <th className="py-2 pr-4 text-brand-black">② 90° 회전</th>
                    <th className="py-2 pr-4 text-brand-black">③ 16의 배수 + 회전</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {rows.map((row) => (
                    <tr key={row.n} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.n}</td>
                      <td className="py-2 pr-4">{row.resave}</td>
                      <td className="py-2 pr-4">{row.rotate}</td>
                      <td className="py-2 pr-4">{row.rotate16}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              원본 대비 PSNR. 높을수록 원본에 가깝습니다. 20번 회전하면 1,800°, 다섯 바퀴를 돌아 처음
              방향으로 돌아옵니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 한 번 돌리는 것은 다시 저장하는 것과 같다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              첫 줄을 보면 회전 한 번(40.59dB)과 재저장 한 번(40.57dB)이 사실상 같습니다. 90° 회전은 픽셀의
              자리를 바꿀 뿐 값을 섞지 않기 때문에, 화질을 깎는 것은 회전이 아니라 JPG로 다시 저장하는
              과정입니다. 사진 한 장을 세워서 한 번 저장하는 일이라면 걱정하지 않아도 됩니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 돌리고 저장하기를 반복하면 손실이 12배 빨리 쌓인다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              차이는 반복에서 생겼습니다. 재저장만 20번 하면 PSNR이 0.51dB 내려갔는데, 90° 회전과 저장을 20번
              반복하면 6.00dB 내려갔습니다. 같은 횟수인데 손실이 12배입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              용량도 이상하게 움직였습니다. 재저장만 할 때는 6.51MB 근처에서 거의 그대로였는데, 회전을
              반복한 쪽은 6.54MB에서 7.03MB로 7.6% 늘었습니다. 저장할 때마다 생긴 잡티가 쌓이면서 JPG가
              압축하기 어려운 정보가 늘어난 것입니다. 화질은 나빠지는데 파일은 커지는, 가장 손해 보는
              방향입니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/image-rotate-quality/rotate-20x.png"
                alt="거북이 눈 주변을 원본, 재저장 20번, 90도 회전 20번으로 나란히 2배 확대한 비교. 회전 20번 쪽에 잡티와 색 번짐이 보인다"
                width={1100}
                height={270}
                loading="lazy"
                className="block w-full border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                원본 픽셀 180×120 영역 2배 확대. 왼쪽부터 원본, 재저장 20번, 90° 회전 20번
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              확대해 보면 재저장 20번은 원본과 거의 같지만, 회전 20번은 어두운 부분에 자글자글한 잡티가 끼고
              밝은 점 주변의 색이 탁해졌습니다.
            </p>

            <BlogInlineCTA href="/tools/image/rotate" label="이미지 회전 →">
              왼쪽·오른쪽·반전을 조합해 최종 방향을 정한 뒤, 저장은 한 번만 합니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 원인은 16픽셀 칸이었다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              JPG는 사진을 8×8 픽셀 칸으로 나눠 저장하고, 색 정보는 보통 2×2 픽셀씩 묶어 저장하기 때문에
              실제로는 16×16 칸 단위로 움직입니다. 이 사진은 5522×4312라 가로세로 모두 16으로 나누어떨어지지
              않습니다. 그래서 90° 돌릴 때마다 칸의 경계가 이전과 다른 자리에 생기고, 매번 새로운 경계에서
              손실이 더해집니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              확인하려고 사진을 5520×4304로, 오른쪽과 아래를 몇 픽셀씩만 잘라 16의 배수로 맞춘 뒤 같은 실험을
              했습니다. 20번 회전해도 PSNR은 1.12dB만 내려갔습니다. 6.00dB에서 1.12dB로, 손실의 대부분이
              사라졌습니다. 용량도 6.51MB 근처에서 거의 변하지 않았습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 측정하다 고친 것: 투명 이미지가 검게 칠해지던 문제
            </h2>
            <p className="text-brand-mid leading-relaxed mb-6">
              floor05 이미지 회전은 PNG가 아닌 파일을 모두 JPG로 저장하고 있었습니다. 투명 배경이 있는 WebP를
              돌리면 투명했던 자리가 검은색으로 칠해진 JPG가 나왔습니다. 지금은 원래 형식을 따라 PNG는 PNG로,
              WebP는 WebP로 저장해 투명 배경이 그대로 남습니다. WebP로 저장하지 못하는 브라우저에서는 PNG로
              저장합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 회전 습관</h2>
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">이유 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">최종 방향을 정하고 한 번만 저장</td>
                    <td className="py-2 pr-4">회전 1번은 재저장 1번과 같은 40.6dB</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">고칠 때는 원본에서 다시 시작</td>
                    <td className="py-2 pr-4">회전 저장을 반복하면 20번에 6dB 손실, 용량은 7.6% 증가</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">앱을 옮겨 다니며 돌리지 않기</td>
                    <td className="py-2 pr-4">두 번째 회전 저장에서 이미 38.9dB, 한 번보다 1.7dB 낮음</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">자주 손볼 사진은 PNG로 보관</td>
                    <td className="py-2 pr-4">90° 회전은 픽셀 자리만 바꾸고, PNG는 다시 저장해도 값이 그대로</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              휴대폰 사진은 픽셀을 돌리는 대신 &lsquo;이 방향으로 보여라&rsquo;는 회전 정보만 EXIF에 적어 두는
              경우가 많습니다. floor05는 사진을 열 때 이 정보를 읽어 바로 세운 상태에서 시작하므로, 이미 똑바로
              보이는 사진을 한 번 더 돌릴 필요는 없습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">방향은 여러 번, 저장은 한 번</h3>
              <p className="text-brand-light mb-6">
                90° 회전과 좌우·상하 반전을 조합하고 마지막에 한 번만 내려받으세요.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/rotate"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 회전
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
          <BlogExtras slug="image-rotate-quality" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
