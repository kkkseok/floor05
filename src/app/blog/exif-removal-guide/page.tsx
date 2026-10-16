import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import BlogExtras from "@/components/common/BlogExtras";
import { buildBlogMetadata } from "@/lib/common/blog";

export const metadata: Metadata = {
  ...buildBlogMetadata("exif-removal-guide"),
  title: "사진 위치정보(EXIF) 삭제하는 법 - 올리기 전에",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "사진에 위치정보가 정말 들어 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "위치 서비스를 켠 상태로 찍은 사진에는 EXIF에 GPS 좌표가 저장됩니다. 지도에 찍으면 어디서 찍었는지 그대로 드러나, 집·직장 위치가 노출될 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "SNS에 올리면 자동으로 지워지지 않나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "일부 플랫폼은 업로드 시 EXIF를 제거하지만 모두 그런 건 아니며, 원본 파일을 직접 주고받을 땐 그대로 남습니다. 미리 지워 두는 게 안전합니다.",
      },
    },
    {
      "@type": "Question",
      name: "위치정보가 아예 안 남게 할 수 있나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "카메라 앱의 위치 기록을 끄면 됩니다. 아이폰은 설정의 위치 서비스에서 카메라 권한을 '안 함'으로, 갤럭시는 카메라 설정에서 위치 태그를 끄면 됩니다. 기종과 OS 버전에 따라 메뉴 이름은 조금 다를 수 있습니다.",
      },
    },
    {
      "@type": "Question",
      name: "이미 올린 사진은 어떻게 하나요?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "서비스에 따라 원본 파일이 그대로 보관됐을 수 있습니다. 걱정되는 사진은 내린 뒤 EXIF를 지운 버전으로 다시 올리는 게 마음 편합니다.",
      },
    },
  ],
};

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
            <span className="text-brand-mid">사진 위치정보(EXIF) 삭제하는 법</span>
          </nav>

          <header className="mb-12">
            <h1 className="text-3xl sm:text-4xl font-bold text-brand-black mb-4 leading-tight">
              사진 위치정보(EXIF) 삭제하는 법
            </h1>
            <p className="text-lg text-brand-mid">올리기 전에 지우는 작은 습관</p>
            <div className="mt-4 flex items-center gap-4 text-sm text-brand-subtle">
              <time dateTime="2026-06-29">2026-06-29</time>
              <span>·</span>
              <span>5분 읽기</span>
            </div>
          </header>

          <div className="prose prose-lg max-w-none">
            <p className="text-brand-mid text-lg leading-relaxed mb-8">
              스마트폰으로 찍은 사진에는 눈에 보이지 않는 정보가 함께 저장됩니다. 그중 가장 민감한
              건 찍은 위치를 담은 GPS 좌표입니다. 무심코 올린 사진 한 장으로 집 위치가 드러날 수
              있다는 걸 알면, 올리기 전에 지우는 습관이 생깁니다.
            </p>

            <div className="bg-brand-paper rounded-lg p-6 mb-10 border border-brand-light/20">
              <p className="font-medium text-brand-black mb-3">💡 바로 지우고 싶다면?</p>
              <p className="text-brand-mid text-sm mb-4">
                사진을 넣으면 위치·기기·시각 정보를 떼어내 되돌려 줍니다. 지우는 과정은 이
                브라우저 안에서만 돌아갑니다.
              </p>
              <Link
                href="/tools/image/exif-remove"
                className="inline-block bg-brand-accent text-brand-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-accent-light transition-colors"
              >
                EXIF 삭제 사용하기 →
              </Link>
            </div>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">EXIF란 무엇인가</h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              EXIF는 사진 파일 안에 함께 저장되는 부가 정보입니다. 사진을 더 잘 관리하려고 만든
              규격이지만, 개인정보 관점에서는 주의가 필요합니다.
            </p>
            <ul className="list-disc list-inside text-brand-mid space-y-2 mb-6">
              <li>
                <strong>촬영 위치(GPS)</strong> — 위도·경도 좌표. 지도에 넣으면 건물 단위까지
                특정될 수 있습니다
              </li>
              <li>
                <strong>촬영 날짜·시각</strong> — 초 단위까지 기록됩니다
              </li>
              <li>
                <strong>기기 정보</strong> — 제조사와 모델명. 어떤 폰으로 찍었는지 드러납니다
              </li>
              <li>
                <strong>카메라 설정</strong> — 렌즈, 조리개, 셔터 속도, ISO 같은 촬영 값
              </li>
              <li>
                <strong>편집 이력</strong> — 보정에 쓴 소프트웨어 이름이 남기도 합니다
              </li>
            </ul>
            <p className="text-brand-mid leading-relaxed mb-4">
              하나하나는 사소해 보여도 조합되면 이야기가 달라집니다. 여러 장의 사진에서 좌표와
              시각을 모으면 집과 직장, 자주 가는 시간대까지 생활 패턴이 그려집니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              어디서 위험할까
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              중고거래에서 집에서 찍은 물건 사진, 블로그에 올린 일상 사진, 메신저로 보낸 원본 파일
              모두 EXIF가 따라갑니다. 받는 사람이 마음만 먹으면 촬영 위치를 지도에 띄울 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              특히 문제가 되기 쉬운 상황은 이렇습니다. 중고거래 물건 사진은 대부분 집 안에서 찍기
              때문에, 좌표가 남아 있으면 거래도 하기 전에 집 위치부터 알려준 셈이 됩니다. 부동산
              직거래 사진, 데이트 앱이나 오픈채팅의 프로필 사진도 마찬가지입니다. 아이 사진은
              어린이집·놀이터의 좌표와 촬영 시각이 함께 남아 등하원 동선까지 짐작하게 하니 더
              조심해야 합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              SNS가 지워줄까 — 서비스마다 다르다
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              인스타그램·페이스북 같은 주요 SNS는 업로드 과정에서 EXIF를 제거하는 것으로 알려져
              있습니다. 다만 이건 각 서비스의 내부 처리 방식이라 언제든 바뀔 수 있고, 이용자가
              직접 확인하기도 어렵습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              반대로 확실히 남는 경로도 있습니다. 카카오톡의 &lsquo;원본 전송&rsquo;, 이메일 첨부,
              클라우드 공유 링크처럼 파일을 그대로 주고받는 방식은 EXIF도 그대로 따라갑니다. 결국
              플랫폼이 지워주길 기대하기보다, 올리기 전에 직접 지우는 쪽이 확실합니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              찍을 때부터 안 남기려면
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              카메라 앱의 위치 기록을 끄면 애초에 GPS가 저장되지 않습니다. 아이폰은 설정 &gt;
              개인정보 보호 및 보안 &gt; 위치 서비스 &gt; 카메라에서 &lsquo;안 함&rsquo;을 선택하고,
              갤럭시는 카메라 설정에서 &lsquo;위치 태그&rsquo;를 끄면 됩니다. 기종과 OS 버전에 따라
              메뉴 이름은 조금 다를 수 있습니다.
            </p>
            <p className="text-brand-mid leading-relaxed mb-4">
              다만 위치 기록이 늘 나쁜 건 아닙니다. 여행 사진을 지도로 정리할 때는 꽤 유용하죠.
              평소에는 켜 두고, 밖으로 나가는 사진만 올리기 전에 지우는 절충안도 괜찮습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-4">
              서버에 올리지 않고 지우기
            </h2>
            <p className="text-brand-mid leading-relaxed mb-4">
              위치정보를 지우겠다고 사진을 모르는 서버에 업로드하는 건 앞뒤가 안 맞습니다. floor05의{" "}
              <Link href="/tools/image/exif-remove" className="text-brand-accent hover:underline">
                EXIF 삭제
              </Link>
              는 사진을 브라우저 안에서 다시 인코딩해 EXIF를 포함한 모든 메타데이터를 제거합니다.
              원본에 위치정보가 있었으면 &lsquo;위치정보(GPS) 포함&rsquo;으로 표시해 알려주고, 여러
              장을 한 번에 처리해 ZIP으로 줍니다. 사진이 네트워크를 타는 구간은 어디에도 없습니다.
            </p>

            <h2 className="text-2xl font-bold text-brand-black mt-12 mb-6">자주 묻는 질문</h2>
            <div className="space-y-6">
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진에 위치정보가 정말 들어 있나요?
                </h3>
                <p className="text-brand-mid">
                  위치 서비스를 켜고 찍었다면 GPS 좌표가 저장됩니다. 지도에 찍으면 촬영 장소가
                  드러납니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. EXIF를 지우면 화질이 떨어지나요?
                </h3>
                <p className="text-brand-mid">
                  JPG는 재인코딩으로 아주 미미한 차이가 있을 수 있으나 눈으로는 거의 구분되지
                  않습니다. PNG는 무손실입니다.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 위치정보가 아예 안 남게 할 수 있나요?
                </h3>
                <p className="text-brand-mid">
                  카메라 앱의 위치 기록을 끄면 됩니다. 아이폰은 위치 서비스에서 카메라 권한을
                  &lsquo;안 함&rsquo;으로, 갤럭시는 카메라 설정에서 위치 태그를 끄세요.
                </p>
              </div>
              <div className="border-b border-brand-light/20 pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 이미 올린 사진은 어떻게 하나요?
                </h3>
                <p className="text-brand-mid">
                  서비스에 따라 원본이 그대로 보관됐을 수 있습니다. 걱정되는 사진은 내린 뒤 EXIF를
                  지운 버전으로 다시 올리는 게 마음 편합니다.
                </p>
              </div>
              <div className="pb-6">
                <h3 className="text-lg font-semibold text-brand-black mb-2">
                  Q. 사진이 서버에 올라가나요?
                </h3>
                <p className="text-brand-mid">
                  아니요. EXIF를 읽고 지우는 일은 전부 이 브라우저 탭 안에서 끝나고,
                  위치정보가 지워진 사본만 내 기기에 저장됩니다.
                </p>
              </div>
            </div>

            <div className="bg-brand-black rounded-lg p-8 mt-12 text-center">
              <h3 className="text-xl font-bold text-brand-paper mb-3">올리기 전에 지우기</h3>
              <p className="text-brand-light mb-6">
                위치·기기·시각 정보를 브라우저에서 바로 제거. 로그인도, 비용도 없습니다.
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

            <BlogExtras slug="exif-removal-guide" />
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
