"""
블로그 실측용(avif-guide): 측정에 쓸 AVIF 파일을 이 PC에서 직접 만든다.
브라우저 캔버스는 AVIF를 저장하지 못했기 때문에(avif-measure.mjs의 engines 참고) 입력용 AVIF는 따로 인코딩한다.

만드는 것 (<작업폴더>/avif/)
  sweep   : 기준 PNG 5장(avif-measure.mjs PARTS=refs가 만든 ref-*.png)을 품질 1~100으로 저장. 4:2:0, 8비트, speed 6.
  variants: 디코딩 확인용 6종 — 4:2:0 / 4:4:4 / 품질 100 / 10비트(ffmpeg) / 투명(알파) / 2프레임 애니메이션
  timing  : 품질 60에서 한 장씩 3번 인코딩한 시간(ms)

인코더: Pillow의 AVIF 플러그인(libavif + aom), 10비트만 ffmpeg libaom-av1.
사용: python -I -X utf8 scripts/blog-measure/avif-encode.py <작업폴더>
결과: <작업폴더>/avif/*.avif, <작업폴더>/encode.json (AVIF 파일은 저장소에 커밋하지 않는다)
"""
import json
import os
import subprocess
import sys
import time

from PIL import Image, ImageDraw, features, _avif
import PIL

work = sys.argv[1]
out_dir = os.path.join(work, "avif")
os.makedirs(out_dir, exist_ok=True)
NAMES = ["photoTortoise", "photoFlower", "graphic", "captureDesk", "captureMobile"]
SPEED = 6

ffmpeg_version = subprocess.run(["ffmpeg", "-version"], capture_output=True, text=True).stdout.splitlines()[0]
res = {
    "encoder": {
        "pillow": PIL.__version__,
        "libavif": features.version("avif"),
        "codecs": _avif.codec_versions(),
        "ffmpeg": ffmpeg_version,
        "sweepSettings": f"Image.save(format='AVIF', quality=1..100, subsampling='4:2:0', speed={SPEED}) — 8비트, 나머지 기본값",
    },
    "sweep": {},
    "variants": {},
    "timing": {},
}


def rgb(name):
    return Image.open(os.path.join(work, f"ref-{name}.png")).convert("RGB")


# sweep
for name in NAMES:
    im = rgb(name)
    rows = []
    for q in range(1, 101):
        p = os.path.join(out_dir, f"{name}-q{q}.avif")
        if not os.path.exists(p):
            im.save(p, format="AVIF", quality=q, subsampling="4:2:0", speed=SPEED)
        rows.append([q, os.path.getsize(p)])
    res["sweep"][name] = rows
    print("sweep", name, rows[59], rows[89], flush=True)

# timing: 품질 60, 한 장씩 3번
for name in NAMES:
    im = rgb(name)
    ms = []
    for _ in range(3):
        t0 = time.perf_counter()
        im.save(os.path.join(out_dir, "_timing.avif"), format="AVIF", quality=60, subsampling="4:2:0", speed=SPEED)
        ms.append(round((time.perf_counter() - t0) * 1000))
    res["timing"][name] = {"quality": 60, "ms": ms, "medianMs": sorted(ms)[1]}
    print("timing", name, ms, flush=True)
os.remove(os.path.join(out_dir, "_timing.avif"))

# variants
t = rgb("photoTortoise")
d = rgb("captureDesk")


def add(key, path, base, setting):
    res["variants"][key] = {"file": os.path.basename(path), "bytes": os.path.getsize(path), "from": base, "setting": setting}


p = os.path.join(out_dir, "v-420.avif")
t.save(p, format="AVIF", quality=60, subsampling="4:2:0", speed=SPEED)
add("yuv420", p, "photoTortoise", "Pillow quality=60, subsampling=4:2:0, 8비트")

p = os.path.join(out_dir, "v-444.avif")
d.save(p, format="AVIF", quality=60, subsampling="4:4:4", speed=SPEED)
add("yuv444", p, "captureDesk", "Pillow quality=60, subsampling=4:4:4, 8비트")

p = os.path.join(out_dir, "v-q100.avif")
d.save(p, format="AVIF", quality=100, subsampling="4:4:4", speed=SPEED)
add("quality100", p, "captureDesk", "Pillow quality=100, subsampling=4:4:4 (디코딩해 보니 무손실은 아님)")

p = os.path.join(out_dir, "v-10bit.avif")
subprocess.run(
    ["ffmpeg", "-y", "-loglevel", "error", "-i", os.path.join(work, "ref-photoTortoise.png"),
     "-c:v", "libaom-av1", "-still-picture", "1", "-crf", "23", "-cpu-used", "6", "-pix_fmt", "yuv420p10le", p],
    check=True,
)
add("tenBit", p, "photoTortoise", "ffmpeg -c:v libaom-av1 -still-picture 1 -crf 23 -cpu-used 6 -pix_fmt yuv420p10le")

# 투명 배경 로고: 스크립트로 그린 512×512 (투명 배경 + 주황 원 + 검정 막대)
logo = Image.new("RGBA", (512, 512), (0, 0, 0, 0))
g = ImageDraw.Draw(logo)
g.ellipse((56, 56, 456, 456), fill=(184, 86, 42, 255))
g.rectangle((156, 236, 356, 276), fill=(10, 10, 10, 255))
logo.save(os.path.join(work, "ref-alphaLogo.png"))
p = os.path.join(out_dir, "v-alpha.avif")
logo.save(p, format="AVIF", quality=80, subsampling="4:4:4", speed=SPEED)
add("alpha", p, "alphaLogo(스크립트 생성 512x512 투명 배경)", "Pillow quality=80, subsampling=4:4:4, RGBA")

# 2프레임 애니메이션: 1프레임 = 주황 원, 2프레임 = 검정 사각형
f1 = Image.new("RGB", (320, 240), (242, 240, 237))
ImageDraw.Draw(f1).ellipse((100, 60, 220, 180), fill=(184, 86, 42))
f2 = Image.new("RGB", (320, 240), (242, 240, 237))
ImageDraw.Draw(f2).rectangle((100, 60, 220, 180), fill=(10, 10, 10))
p = os.path.join(out_dir, "v-animated.avif")
f1.save(p, format="AVIF", save_all=True, append_images=[f2], duration=500, quality=80, speed=SPEED)
add("animated", p, "스크립트 생성 320x240 2프레임(1프레임 주황 원, 2프레임 검정 사각형)", "Pillow save_all, duration=500ms, quality=80")

with open(os.path.join(work, "encode.json"), "w", encoding="utf8") as f:
    json.dump(res, f, ensure_ascii=False, indent=1)
print(json.dumps(res["variants"], ensure_ascii=False, indent=1))
