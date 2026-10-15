import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import BlogInlineCTA from "@/components/common/BlogInlineCTA";

export const metadata: Metadata = {
  title: "이미지 용량 줄이기 - 품질 100%부터 20%까지 직접 재본 결과",
  description:
    "카메라 원본 사진 두 장을 품질 11단계로 압축해 용량과 화질을 측정했습니다. 품질 100% 재저장은 원본보다 커졌고, 같은 80%라도 사진에 따라 3.6배 차이가 났습니다.",
  keywords: [
    "이미지 용량 줄이기",
    "사진 용량 줄이기",
    "이미지 압축",
    "JPG 품질 설정",
    "사진 압축 화질",
    "이미지 목표 용량",
    "JPG 압축률",
  ],
  alternates: { canonical: "/blog/image-compression-guide" },
  openGraph: {
    title: "이미지 용량 줄이기 - 품질 100%부터 20%까지 직접 재본 결과",
    description:
      "품질 90%에서 80%로 내리면 용량은 37~60% 줄고 화질 지표는 2dB 남짓 내려갔습니다.",
  },
};

const faqs = [
  {
    question: "JPG 품질은 몇 %로 저장하는 게 적당한가요?",
    answer:
      "이번 측정에서는 80~90%가 가장 효율적인 구간이었습니다. 거북이 사진은 90%에서 80%로 내릴 때 5.80MB가 3.65MB로 37% 줄었고, PSNR은 39.8dB에서 37.7dB로 2.1dB만 내려갔습니다. 70% 아래로는 용량이 덜 줄어드는 반면 화질 손실은 계속 쌓입니다.",
  },
  {
    question: "품질 100%로 저장하면 원본 화질이 그대로인가요?",
    answer:
      "아닙니다. JPG는 100%에서도 손실 압축이라 원본과 완전히 같지 않고, 용량은 오히려 커졌습니다. 15.8MB 카메라 원본은 19.7MB로, 9.2MB 원본은 18.9MB로 늘었습니다. 원본을 보관하려면 다시 저장하지 말고 파일을 그대로 두세요.",
  },
  {
    question: "목표 용량을 아주 작게 잡으면 어떻게 되나요?",
    answer:
      "floor05 이미지 압축은 품질을 60% 아래로 내리지 않고, 그래도 크면 해상도를 줄여 맞춥니다. 5522×4312 사진을 200KB로 맞추면 1381×1078·품질 67%가 됩니다. 품질만 낮추던 이전 방식은 같은 조건에서 품질이 1.8%까지 떨어졌습니다.",
  },
  {
    question: "압축하는 동안 사진이 어디로 가나요?",
    answer:
      "아무 데도 가지 않습니다. 이 글의 측정과 같은 Canvas 인코더가 사진을 연 브라우저 탭 안에서 다시 저장할 뿐이라, 압축 결과도 내려받기를 누르기 전까지 기기 메모리에만 있습니다.",
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

// 2026-10-15 측정 (Chromium 151, 해상도 유지, 원자료: docs/blog-data/image-compression-2026-10-15.json)
const ladder = [
  { q: "100%", tortoise: "19.74MB · 56.9dB", flower: "18.91MB · 57.3dB" },
  { q: "95%", tortoise: "8.76MB · 42.4dB", flower: "5.55MB · 48.2dB" },
  { q: "90%", tortoise: "5.80MB · 39.8dB", flower: "2.53MB · 46.7dB" },
  { q: "85%", tortoise: "4.43MB · 38.5dB", flower: "1.49MB · 45.9dB" },
  { q: "80%", tortoise: "3.65MB · 37.7dB", flower: "1.01MB · 45.3dB" },
  { q: "70%", tortoise: "2.77MB · 36.6dB", flower: "0.64MB · 44.4dB" },
  { q: "60%", tortoise: "2.21MB · 35.8dB", flower: "0.51MB · 43.7dB" },
  { q: "50%", tortoise: "1.85MB · 35.2dB", flower: "0.46MB · 43.1dB" },
  { q: "40%", tortoise: "1.53MB · 34.5dB", flower: "0.42MB · 42.4dB" },
  { q: "30%", tortoise: "1.20MB · 33.7dB", flower: "0.38MB · 40.8dB" },
  { q: "20%", tortoise: "0.89MB · 32.4dB", flower: "0.34MB · 38.3dB" },
];

// 1920px 화면 기준 PSNR (원자료: docs/blog-data/compress-target-2026-10-15.json)
const targetRows = [
  { target: "1MB", before: "품질 24% · 37.3dB", after: "3313px · 품질 70% · 37.8dB" },
  { target: "500KB", before: "품질 8.7% · 31.5dB", after: "2485px · 품질 66% · 35.3dB" },
  { target: "200KB", before: "품질 1.8% · 25.0dB", after: "1381px · 품질 67% · 30.9dB" },
];

export default function ImageCompressionGuidePage() {
  return (
    <div className="min-h-screen flex flex-col bg-brand-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header />

      <main className="flex-1">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="mb-8 text-sm text-brand-light">
            <Link href="/blog" className="hover:text-brand-mid">
              블로그
            </Link>
            <span className="mx-2">›</span>
            <span className="text-brand-mid">이미지 용량 줄이기</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              이미지 용량 줄이기
            </h1>
            <p className="text-lg text-brand-mid">
              품질 100%부터 20%까지 직접 재본 결과
            </p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-light">
              <time dateTime="2026-10-15">2026-10-15 측정</time>
              <span>·</span>
              <span>8분 읽기</span>
            </div>
          </header>

          <div className="max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-6">
              &ldquo;품질 70~85%면 화질 차이가 거의 없다&rdquo;는 조언은 어디서나 볼 수 있습니다.
              그런데 그 구간에서 용량이 정확히 얼마나 줄고, 화질은 얼마나 손해를 보는지는 사진마다
              다릅니다. 그래서 카메라 원본 사진 두 장을 품질 11단계로 다시 저장해 직접 쟀습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              재다 보니 floor05 이미지 압축의 &lsquo;목표 용량&rsquo; 기능이 사진을 필요 이상으로
              망가뜨린다는 것도 알게 됐고, 그 자리에서 고쳤습니다. 그 과정도 함께 적습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">어떻게 측정했나</h2>
            <ul className="list-disc pl-5 text-brand-mid space-y-2 mb-4 leading-relaxed">
              <li>
                <strong className="text-brand-black">거북이 사진</strong>: NASA 공공 도메인, Canon EOS 5D
                Mark IV, 5522×4312, 원본 15.78MB. 자갈 바닥과 등껍질처럼 잔무늬가 화면 전체에 깔린 사진
              </li>
              <li>
                <strong className="text-brand-black">꽃 사진</strong>: NASA 공공 도메인, 8192×5464, 원본
                9.18MB. 가운데 꽃만 선명하고 배경은 부드럽게 흐려진 사진
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              두 사진을 해상도 그대로 두고 품질만 바꿔 Chromium 151의 Canvas 인코더로 저장했습니다.
              floor05{" "}
              <Link href="/tools/image/compress" className="text-brand-accent hover:underline">
                이미지 압축
              </Link>
              이 품질 슬라이더로 저장할 때 쓰는 경로와 같습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-8">
              화질은 PSNR로 비교했습니다. 저장한 파일을 다시 열어 원본 픽셀과 값 차이를 잰 수치로,
              높을수록 원본에 가깝습니다. 용량은 1MB = 1,000,000바이트 기준입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정 결과: 품질 11단계</h2>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">품질</th>
                    <th className="py-2 pr-4 text-brand-black">거북이 (원본 15.78MB)</th>
                    <th className="py-2 pr-4 text-brand-black">꽃 (원본 9.18MB)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {ladder.map((row) => (
                    <tr key={row.q} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.q}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.tortoise}</td>
                      <td className="py-2 pr-4 whitespace-nowrap">{row.flower}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-8">
              해상도는 원본 그대로. dB는 원본 대비 PSNR입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              1. 품질 100%로 다시 저장하면 원본보다 커진다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              첫 줄부터 예상과 달랐습니다. 거북이 사진은 15.78MB가 19.74MB로, 꽃 사진은 9.18MB가
              18.91MB로 늘었습니다. 꽃 사진은 두 배가 넘습니다. 카메라나 보정 프로그램이 처음 저장할
              때 이미 적당한 품질로 압축해 둔 파일을, 100%로 다시 저장하면서 오히려 더 많은 데이터를
              쓴 것입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그렇다고 화질이 그대로인 것도 아닙니다. PSNR이 57dB 안팎이라 눈으로는 구분하기 어렵지만
              원본과 완전히 같지는 않습니다. JPG에는 &lsquo;무손실 100%&rsquo;가 없습니다. 원본을
              보관하고 싶다면 아무것도 하지 않고 파일을 그대로 두는 것이 정답입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              2. 가장 효율적인 구간은 90%에서 80% 사이
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질을 90%에서 80%로 내리면 거북이 사진은 5.80MB에서 3.65MB로 37%, 꽃 사진은 2.53MB에서
              1.01MB로 60% 줄었습니다. 그동안 PSNR은 각각 2.1dB, 1.4dB 내려갔습니다. 용량이 크게 줄어드는
              데 비해 화질 손해는 작은 구간입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              반대로 70% 아래부터는 효율이 떨어집니다. 꽃 사진은 70%에서 20%까지 내려도 0.64MB가
              0.34MB가 될 뿐이었고, 그 사이 PSNR은 6dB 넘게 떨어졌습니다. 이미 작은 파일을 더 줄이려고
              품질을 계속 낮추면 사진만 상합니다. 이럴 때는{" "}
              <Link href="/tools/image/resize" className="text-brand-accent hover:underline">
                이미지 크기 조절
              </Link>
              로 가로세로 픽셀을 줄이는 편이 효과적입니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              3. 같은 80%라도 용량은 3.6배 차이
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              품질 80%에서 거북이 사진은 3.65MB, 꽃 사진은 1.01MB였습니다. 꽃 사진이 픽셀 수는 1.9배
              많은데도 용량은 3분의 1도 안 됩니다. 흐린 배경처럼 색이 부드럽게 이어지는 면은 JPG가 적은
              데이터로 표현할 수 있고, 자갈처럼 잔무늬가 빽빽한 면은 그럴 수 없기 때문입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              그래서 &ldquo;품질 80%로 저장하면 몇 MB가 되나요?&rdquo;에는 한 숫자로 답할 수 없습니다.
              제출처에 용량 상한이 있다면 품질 숫자를 짐작하기보다 목표 용량을 직접 입력하는 쪽이
              확실합니다.
            </p>

            <BlogInlineCTA href="/tools/image/compress" label="이미지 압축 →">
              내 사진은 몇 %에서 몇 MB가 될까요? 슬라이더를 움직이면 바로 보입니다.
            </BlogInlineCTA>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              4. 품질 20%에서는 8×8 블록이 보인다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              숫자 대신 눈으로도 확인했습니다. 두 사진의 같은 영역을 원본 크기로 잘라 2배로 확대했습니다.
            </p>
            <figure className="my-8">
              <img
                src="/images/blog/image-compression-guide/quality-crops.png"
                alt="거북이 눈 주변과 꽃 사진 흐린 배경을 품질 90%, 50%, 20%로 저장해 2배 확대한 비교. 20%에서 사각형 블록이 보인다"
                width={1100}
                height={560}
                loading="lazy"
                className="block w-full border border-brand-light/30 [image-rendering:pixelated]"
              />
              <figcaption className="mt-3 text-sm text-brand-mid text-center">
                원본 픽셀 180×120 영역을 2배 확대. 왼쪽부터 품질 90%, 50%, 20%
              </figcaption>
            </figure>
            <p className="text-brand-mid leading-relaxed mb-6">
              90%와 50%는 확대해도 차이를 찾기 어렵습니다. 20%가 되면 거북이 눈 주변 무늬가 사각형
              조각으로 나뉘고, 꽃 사진의 매끈한 초록 배경에도 계단 같은 블록이 생깁니다. JPG가 이미지를
              8×8 픽셀 단위로 나눠 압축하기 때문에 생기는 모양입니다. 흐린 배경은 용량 면에서는
              유리했지만, 품질을 많이 낮추면 오히려 블록이 먼저 드러나는 곳이기도 했습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              5. &lsquo;목표 용량&rsquo; 기능을 이렇게 고쳤습니다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              floor05 이미지 압축의 목표 용량 모드는 원래 해상도를 그대로 두고 품질만 낮춰 용량을
              맞췄습니다. 거북이 사진을 200KB로 맞추니 품질이 1.8%까지 내려갔습니다. 용량은 맞았지만
              위 비교 이미지의 20%보다도 훨씬 망가진 사진입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              그래서 방식을 바꿨습니다. 품질은 60% 아래로 내리지 않고, 그래도 목표보다 크면 해상도를
              단계적으로 줄인 뒤 그 크기에서 가장 높은 품질을 찾습니다. 화면에서 보는 크기(가로
              1920px)로 맞춰 두 방식을 비교한 결과입니다.
            </p>
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">목표 (거북이)</th>
                    <th className="py-2 pr-4 text-brand-black">이전: 품질만 낮춤</th>
                    <th className="py-2 pr-4 text-brand-black">지금: 품질 하한 60%</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  {targetRows.map((row) => (
                    <tr key={row.target} className="border-b border-brand-light/20">
                      <td className="py-2 pr-4 font-medium text-brand-black">{row.target}</td>
                      <td className="py-2 pr-4">{row.before}</td>
                      <td className="py-2 pr-4">{row.after}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-brand-light mb-4">
              PSNR은 두 결과를 모두 가로 1920px로 맞춰 원본과 비교한 값입니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-6">
              200KB 목표에서 차이가 5.9dB로 가장 컸습니다. 꽃 사진에서도 목표 4가지 모두 새 방식이 같거나
              더 나았습니다. 해상도를 줄인 경우에는 결과 화면에 바뀐 크기를 알려 주니, 픽셀 규격이 정해진
              증명사진처럼 크기가 중요한 제출이라면 그 숫자를 확인하세요. 원래 작은 증명사진 파일은 대개
              품질만으로 맞춰져 해상도가 바뀌지 않습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">측정으로 정리한 압축 순서</h2>
            <div className="overflow-x-auto mb-6">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-brand-light/40 text-left">
                    <th className="py-2 pr-4 text-brand-black">상황</th>
                    <th className="py-2 pr-4 text-brand-black">이렇게</th>
                    <th className="py-2 pr-4 text-brand-black">근거 (이번 측정)</th>
                  </tr>
                </thead>
                <tbody className="text-brand-mid">
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">원본 보관</td>
                    <td className="py-2 pr-4">다시 저장하지 않기</td>
                    <td className="py-2 pr-4">100% 재저장이 원본보다 1.3~2.1배 컸음</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">메일·메신저 공유</td>
                    <td className="py-2 pr-4">품질 80~85%</td>
                    <td className="py-2 pr-4">90% 대비 37~60% 감소, PSNR 손실 2dB 남짓</td>
                  </tr>
                  <tr className="border-b border-brand-light/20">
                    <td className="py-2 pr-4 font-medium text-brand-black">용량 상한이 있는 제출</td>
                    <td className="py-2 pr-4">목표 용량 입력</td>
                    <td className="py-2 pr-4">같은 품질도 사진에 따라 용량이 3.6배 차이</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 font-medium text-brand-black">70%로도 크다면</td>
                    <td className="py-2 pr-4">해상도부터 줄이기</td>
                    <td className="py-2 pr-4">70%→20%는 용량 절반, 화질 손실은 6dB 이상</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-brand-mid leading-relaxed mb-8">
              사진이 PNG로 저장돼 있다면 압축보다 포맷부터 바꾸는 게 먼저입니다. 같은 사진이 PNG로는
              JPG의 8.8배였습니다. 자세한 측정은{" "}
              <Link href="/blog/png-vs-jpg" className="text-brand-accent hover:underline">
                PNG vs JPG 실측
              </Link>
              에 정리했습니다.
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
              <h3 className="text-xl font-bold text-brand-paper mb-3">
                내 사진으로 확인하기
              </h3>
              <p className="text-brand-light mb-6">
                품질을 바꿔 가며 용량과 화질을 나란히 비교할 수 있습니다.
                <br />
                목표 용량을 넣으면 품질과 해상도를 알아서 맞춥니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/tools/image/compress"
                  className="inline-block bg-brand-accent text-brand-white px-6 py-3 rounded-md font-medium hover:bg-brand-accent-light transition-colors"
                >
                  이미지 압축
                </Link>
                <Link
                  href="/tools/image/resize"
                  className="inline-block bg-brand-dark text-brand-paper px-6 py-3 rounded-md font-medium hover:bg-brand-mid transition-colors"
                >
                  이미지 리사이즈
                </Link>
              </div>
            </div>
          </div>
          <BlogExtras slug="image-compression-guide" />
        </article>
      </main>

      <Footer />
    </div>
  );
}
