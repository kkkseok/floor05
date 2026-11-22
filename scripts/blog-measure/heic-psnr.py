"""
블로그 실측용(heic-to-jpg-guide): heic-convert.mjs 결과의 화질(PSNR, dB)을 계산한다.
기준은 항상 ref-<이름>.png (HEIC로 만들기 전의 무손실 4032x3024 이미지).

  heicVsRef      heic2any가 푼 PNG ↔ 기준          = HEIC 인코딩 손실 + heic2any 디코딩 차이
  libheifVsRef   같은 HEIC를 libheif(pillow-heif)로 푼 것 ↔ 기준 = HEIC 인코딩 손실만
  jpgVsDecoded   변환된 JPG ↔ heic2any가 푼 PNG    = JPG로 다시 저장하면서 잃은 것
  jpgVsRef       변환된 JPG ↔ 기준                 = 둘을 합친 최종 결과
  direct         기준 PNG를 HEIC 없이 바로 JPG로 저장한 것 ↔ 기준 (같은 Canvas 인코더)

JPG는 Pillow(libjpeg-turbo)로 풀어 RGB 8비트 세 채널 전체의 MSE로 계산한다.
사용: venv/Scripts/python -I -X utf8 scripts/blog-measure/heic-psnr.py <소스폴더> <결과폴더> <출력.json>
"""
import json
import math
import re
import sys
from pathlib import Path

import numpy as np
import pillow_heif
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
SRC, OUT, DEST = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])


def load(p):
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)


def psnr(a, b):
    if a.shape != b.shape:
        return {"error": f"크기 다름 {a.shape[1]}x{a.shape[0]} vs {b.shape[1]}x{b.shape[0]}"}
    d = (a - b).astype(np.float64)
    mse = float(np.mean(d * d))
    return None if mse == 0 else round(10 * math.log10(65025 / mse), 2)


res = {"heic": {}, "direct": {}, "otherBrowsers": {}}
refs = {n: load(SRC / f"ref-{n}.png") for n in ("tortoise", "flower")}

for heic in sorted(SRC.glob("*.heic")):
    stem = heic.stem
    name = stem.split("-")[0]
    dec_path = OUT / f"decoded-{stem}.png"
    if not dec_path.exists():
        res["heic"][stem] = {"error": "heic2any 결과 없음"}
        continue
    dec = load(dec_path)
    rot = stem.endswith("-rot")
    ref = load(SRC / "ref-tortoise-rot-upright.png") if rot else refs[name]
    row = {"decodedSize": [dec.shape[1], dec.shape[0]], "heicVsRef": psnr(dec, ref)}
    if rot:
        row["heicVsLandscapeRef"] = psnr(dec, refs[name])
    # heic2any(옛 libheif.js)와 지금의 libheif가 같은 픽셀을 내는지
    lib = np.asarray(pillow_heif.open_heif(heic, convert_hdr_to_8bit=True).to_pillow().convert("RGB"), dtype=np.int16)
    if lib.shape == dec.shape:
        diff = np.abs(lib - dec)
        row["heic2anyVsLibheif"] = {"maxDiff": int(diff.max()), "psnr": psnr(lib, dec)}
        row["libheifVsRef"] = psnr(lib, ref)  # 같은 HEIC를 지금의 libheif로 풀었을 때
        # 밝기 범위가 어긋났는지: 기준 대비 heic2any 결과의 채널별 1차 근사(기울기, 절편)
        row["heic2anyLevelFit"] = [[round(float(v), 3) for v in np.polyfit(ref[::8, ::8, c].ravel(), dec[::8, ::8, c].ravel(), 1)] for c in range(3)]
        row["clipped"] = {"refBlackPct": round(float((ref.max(axis=2) == 0).mean() * 100), 3), "decBlackPct": round(float((dec.max(axis=2) == 0).mean() * 100), 3),
                          "refWhitePct": round(float((ref.min(axis=2) == 255).mean() * 100), 3), "decWhitePct": round(float((dec.min(axis=2) == 255).mean() * 100), 3)}
    else:
        row["heic2anyVsLibheif"] = {"error": f"크기 다름: libheif {lib.shape[1]}x{lib.shape[0]}"}
    row["jpg"] = {}
    for jpg in sorted(OUT.glob(f"Chromium-{stem}-jq*.jpg")):
        q = re.search(r"jq(\d+)", jpg.name).group(1)
        j = load(jpg)
        row["jpg"][q] = {"bytes": jpg.stat().st_size, "jpgVsDecoded": psnr(j, dec), "jpgVsRef": psnr(j, ref)}
    res["heic"][stem] = row
    for br in ("Firefox", "WebKit"):
        jpg = OUT / f"{br}-{stem}-jq90.jpg"
        if jpg.exists():
            j = load(jpg)
            res["otherBrowsers"].setdefault(br, {})[stem] = {"bytes": jpg.stat().st_size, "size": [j.shape[1], j.shape[0]],
                                                            "jpgVsRef": psnr(j, ref)}
    print(stem, json.dumps(row, ensure_ascii=False))

for name, ref in refs.items():
    res["direct"][name] = {}
    for jpg in sorted(OUT.glob(f"direct-ref-{name}-jq*.jpg"), key=lambda p: int(re.search(r"jq(\d+)", p.name).group(1))):
        q = re.search(r"jq(\d+)", jpg.name).group(1)
        res["direct"][name][q] = {"bytes": jpg.stat().st_size, "psnr": psnr(load(jpg), ref)}
    print("direct", name, json.dumps(res["direct"][name]))

DEST.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
