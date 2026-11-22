"""
블로그 실측용(heic-to-jpg-guide): NASA 공공 도메인 사진으로 HEIC 측정 소스를 직접 만든다.
아이폰이 찍은 HEIC가 아니다. x265(libheif)로 인코딩한 파일이며, 글에서도 그렇게 밝힌다.

준비(전역 설치 금지, 스크래치 폴더의 venv에):
  python -m venv venv && venv/Scripts/python -m pip install pillow-heif numpy
사용:
  venv/Scripts/python -I -X utf8 scripts/blog-measure/heic-make-source.py <NASA원본폴더> <출력폴더>
  <NASA원본폴더>에 tortoise.jpg, flower.jpg (받는 법: .claude/skills/measured-blog-post/resources/scripts.md)

만드는 것(<출력폴더>, 저장소에 커밋하지 않는다):
  ref-<이름>.png            기준 이미지. 원본을 가운데 4:3으로 자르고 Lanczos로 4032x3024로 줄인 무손실 PNG
  <이름>-q<품질>.heic       기준 이미지를 HEIC로 인코딩(품질 50·70·90, 4:2:0, 8비트). 원본 사진의 EXIF를 넣는다
  tortoise-q70-limited.heic 같은 사진을 제한 범위(16~235)로 인코딩한 파일(밝기 범위 처리 확인용)
  tortoise-q70-rot.heic     회전 정보(irot)가 든 세로 사진 확인용. 픽셀은 가로로 누워 있고 표시할 때 돌려야 바로 선다
  sources.json              인코더 버전·설정·파일 크기
"""
import json
import sys
from pathlib import Path

import pillow_heif
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
pillow_heif.register_heif_opener()
SRC = Path(sys.argv[1])
OUT = Path(sys.argv[2])
OUT.mkdir(parents=True, exist_ok=True)

W, H = 4032, 3024
QUALITIES = [50, 70, 90]
PHOTOS = {
    "tortoise": "KSC-20210121-PH-JBS01_0079",
    "flower": "KSC-20230613-PH-FMX01-0075",
}

info = {
    "encoder": pillow_heif.libheif_info()["HEIF"],
    "libheif": pillow_heif.libheif_version(),
    "pillow_heif": pillow_heif.__version__,
    "settings": {"qualities": QUALITIES, "chroma": "4:2:0", "bitDepth": 8, "size": [W, H],
                 "resize": "center crop to 4:3, Lanczos"},
    "files": {},
}

for name, nasa_id in PHOTOS.items():
    im = Image.open(SRC / f"{name}.jpg")
    exif = im.info.get("exif", b"")
    orientation = im.getexif().get(0x0112, 1)
    assert orientation == 1, f"{name}: 원본 방향 태그가 {orientation}"
    im = im.convert("RGB")
    w, h = im.size
    cw = min(w, round(h * 4 / 3))
    ch = min(h, round(cw * 3 / 4))
    left, top = (w - cw) // 2, (h - ch) // 2
    ref = im.crop((left, top, left + cw, top + ch)).resize((W, H), Image.LANCZOS)
    ref_path = OUT / f"ref-{name}.png"
    if not ref_path.exists():
        ref.save(ref_path, icc_profile=None)  # 브라우저가 색 변환을 하지 않도록 PNG에는 ICC를 넣지 않는다(픽셀 값 그대로 비교)
    info["files"][ref_path.name] = {"nasaId": nasa_id, "original": [w, h], "crop": [left, top, cw, ch],
                                    "bytes": ref_path.stat().st_size, "exifBytesInOriginal": len(exif)}
    for q in QUALITIES:
        p = OUT / f"{name}-q{q}.heic"
        if not p.exists():  # 이미 만든 소스는 다시 인코딩하지 않는다(측정한 파일과 같은 바이트 유지)
            ref.save(p, format="HEIF", quality=q, chroma=420, exif=exif)
        info["files"][p.name] = {"quality": q, "bytes": p.stat().st_size, "range": "full (libheif 기본)"}
        print(p.name, p.stat().st_size)

    if name == "tortoise":
        # 밝기 범위 확인용: 같은 사진을 제한 범위(16~235, full_range_flag=0)로 인코딩한 파일.
        # heic2any 안의 변환식이 제한 범위(1.164*(Y-16))로 고정돼 있어, 전체 범위 파일과 결과가 달라지는지 본다.
        # 꽃 사진(ICC 없음)은 같은 옵션을 줘도 픽셀이 전체 범위로 인코딩돼 대조군이 되지 못해 만들지 않는다.
        p = OUT / f"{name}-q70-limited.heic"
        if not p.exists():
            ref.save(p, format="HEIF", quality=70, chroma=420, exif=exif,
                     color_primaries=1, transfer_characteristics=13, matrix_coefficients=6, full_range_flag=0)
        info["files"][p.name] = {"quality": 70, "bytes": p.stat().st_size, "range": "limited (full_range_flag=0, matrix 6)"}
        print(p.name, p.stat().st_size)

    if name == "tortoise":
        # 세로 사진: 바로 선 세로 이미지를 주면 pillow-heif가 EXIF 방향 6을 irot 상자로 옮겨 적는다.
        # 기대 결과(바로 선 3024x4032)를 PNG로도 남겨 변환 결과와 비교한다.
        upright = ref.transpose(Image.ROTATE_270)  # 시계 방향 90도 = 세로 사진
        upright.save(OUT / "ref-tortoise-rot-upright.png", icc_profile=None)
        ex = Image.Exif()
        ex[0x0112] = 6
        p = OUT / "tortoise-q70-rot.heic"
        if not p.exists():
            ref.save(p, format="HEIF", quality=70, chroma=420, exif=ex.tobytes())
        back = pillow_heif.open_heif(p)
        info["files"][p.name] = {"quality": 70, "bytes": p.stat().st_size,
                                 "storedPixels": [W, H], "decodedByLibheif": list(back.size),
                                 "note": "EXIF Orientation=6 → pillow-heif가 irot로 기록"}
        print(p.name, p.stat().st_size, "libheif decode size", back.size)

(OUT / "sources.json").write_text(json.dumps(info, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps(info["settings"]), info["encoder"])
