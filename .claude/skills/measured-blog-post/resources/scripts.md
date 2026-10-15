# 측정 소스와 스크립트

## 측정 소스 (저작권 문제 없음)

NASA Image and Video Library 사진은 공공 도메인이다. 원본은 `~orig` 파일을 리다이렉트를 따라 받는다.

```bash
# 받을 곳: 스크래치패드의 dl/ (저장소 안에 원본 사진을 커밋하지 않는다)
curl -sL -o tortoise.jpg "https://images-assets.nasa.gov/image/KSC-20210121-PH-JBS01_0079/KSC-20210121-PH-JBS01_0079~orig.jpg"
curl -sL -o flower.jpg   "https://images-assets.nasa.gov/image/KSC-20230613-PH-FMX01-0075/KSC-20230613-PH-FMX01-0075~orig.JPG"
# 미리보기: ~large.jpg, ~small.jpg / 파일 목록: .../collection.json
# 새 사진 찾기: https://images-api.nasa.gov/search?q=<검색어>&media_type=image
```

| 이름 | ID | 크기 | 특징 |
|---|---|---|---|
| 거북이 | KSC-20210121-PH-JBS01_0079 | 5522×4312, 15.78MB | Canon 5D Mark IV, Lightroom 보정, 잔무늬 많음, EXIF·XMP·IPTC 풍부, GPS 없음 |
| 꽃 | KSC-20230613-PH-FMX01-0075 | 8192×5464, 9.18MB | Canon R5, 배경 흐림, 빈 GPS IFD |

floor05 자기 화면 캡처: Playwright로 `https://www.floor05.com/...`를 찍는다. 글자 캡처는 `--disable-lcd-text`로 서브픽셀 색번짐을 끈다. 휴대폰 크기는 viewport 360×780, deviceScaleFactor 3(=1080×2340).

## 스크립트 (`scripts/blog-measure/`)

예약 브랜치에만 있는 스크립트는 해당 글이 발행되면 main에 들어온다. 그 전에는 `git show origin/scheduled/<브랜치>:scripts/blog-measure/<파일>`로 꺼내 쓴다.

| 스크립트 | 하는 일 | 쓰인 글 |
|---|---|---|
| `image-formats.mjs` | 사진·캡처·그래픽을 PNG/JPG/WebP로 저장, 용량·PSNR·재저장 세대 손실 | png-vs-jpg |
| `text-edge-crop.mjs` | 캡처 글자 줄 4배 확대 비교 이미지 | png-vs-jpg |
| `compress-ladder.mjs` | 품질 11단계 용량·PSNR, 목표 용량 이진 탐색 재현 | image-compression-guide |
| `compress-target-algos.mjs` | 목표 용량 알고리즘 비교(1920px 화면 기준 PSNR) | 도구 수정 근거 |
| `compress-crops.mjs` | 같은 영역을 품질별로 잘라 2배 확대 | image-compression-guide |
| `photo-pdf-size.mjs` | 사진 장수·해상도별 PDF 용량(pdf-lib) | image-to-pdf-guide |
| `jpeg-segments.py` | JPEG APP 세그먼트 크기와 EXIF 태그 덤프 (`python -I -X utf8`) | exif-removal-guide |
| `rotate-generations.mjs` | 90° 회전·재저장 반복 세대 손실 + 확대 비교 | image-rotate-quality |
| `crop-measure.mjs` | 비율별 최대 크롭, 원형 PNG, 고정 크기 출력 용량 | image-crop-guide |
| `crop-ratio-overlay.mjs` | 사진 위에 비율별 크롭 영역 겹침 그림 | image-crop-guide |
| `browser-encoders.mjs` | Chromium·WebKit·Firefox 인코더 비교(서브샘플링 판별 포함) | browser-image-encoders |
| `merge-limits.mjs` | 캡처 세로 합치기 한계, PNG/JPG 용량, 폭 맞춤 영향 | image-merge-guide |
| `render-check.mjs` | 빌드된 글 데스크톱·모바일 캡처와 가로 스크롤 확인 | 모든 글 |

Firefox가 필요하면 `npx playwright install firefox`(로컬 설치, 저장소 변경 없음).
