"""
블로그 실측용(heic-to-jpg-guide): heic-convert.mjs 결과의 화질(PSNR, dB)과 밝기를 계산한다.
기준은 항상 ref-<이름>.png (HEIC로 만들기 전의 무손실 4032x3024 이미지). 회전 파일은 바로 세운 기준(ref-tortoise-rot-upright.png).

  toolVsRef      도구 디코더(libheif-js)가 푼 PNG ↔ 기준   = HEIC 인코딩 손실 + 도구 디코딩 차이
  pillowVsRef    같은 HEIC를 libheif(pillow-heif)로 푼 것 ↔ 기준 = HEIC 인코딩 손실만
  toolVsPillow   도구 디코더 ↔ pillow-heif                 = 두 디코더의 차이
  jpgVsDecoded   변환된 JPG ↔ 도구 디코더가 푼 PNG         = JPG로 다시 저장하면서 잃은 것
  jpgVsRef       변환된 JPG ↔ 기준                         = 둘을 합친 최종 결과
  direct         기준 PNG를 HEIC 없이 바로 JPG로 저장한 것 ↔ 기준 (같은 Canvas 인코더)
  before         [이전결과폴더]를 주면, 2026-11-23 첫 측정(heic2any 0.0.4)의 decoded-*.png·JPG 90%로 같은 지표를 다시 계산

밝기(meanLuma)는 Pillow convert("L")(BT.601 가중치)의 이미지 전체 평균, 잘린 픽셀은 세 채널이 모두 0(검정) 또는 모두 255(흰색)인 비율(%).
JPG는 Pillow(libjpeg-turbo)로 풀어 RGB 8비트 세 채널 전체의 MSE로 계산한다.
사용: venv/Scripts/python -I -X utf8 scripts/blog-measure/heic-psnr.py <소스폴더> <결과폴더> <출력.json> [이전결과폴더]
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
OLD = Path(sys.argv[4]) if len(sys.argv) > 4 else None


def load(p):
    return np.asarray(Image.open(p).convert("RGB"), dtype=np.int16)


def psnr(a, b):
    if a.shape != b.shape:
        return {"error": f"크기 다름 {a.shape[1]}x{a.shape[0]} vs {b.shape[1]}x{b.shape[0]}"}
    d = (a - b).astype(np.float64)
    mse = float(np.mean(d * d))
    return None if mse == 0 else round(10 * math.log10(65025 / mse), 2)


def luma(a):
    return round(float(np.asarray(Image.fromarray(a.astype(np.uint8)).convert("L")).mean()), 2)


def clipped(a):
    return {"blackPct": round(float((a.max(axis=2) == 0).mean() * 100), 3), "whitePct": round(float((a.min(axis=2) == 255).mean() * 100), 3)}


def fit(ref, dec):
    return [[round(float(v), 3) for v in np.polyfit(ref[::8, ::8, c].ravel(), dec[::8, ::8, c].ravel(), 1)] for c in range(3)]


res = {"heic": {}, "direct": {}, "otherBrowsers": {}}
refs = {n: load(SRC / f"ref-{n}.png") for n in ("tortoise", "flower")}
upright = load(SRC / "ref-tortoise-rot-upright.png")
refInfo = {n: {"meanLuma": luma(r), **clipped(r)} for n, r in refs.items()}
refInfo["tortoise-rot-upright"] = {"meanLuma": luma(upright), **clipped(upright)}
res["ref"] = refInfo

for heic in sorted(SRC.glob("*.heic")):
    stem = heic.stem
    name = stem.split("-")[0]
    rot = stem.endswith("-rot")
    ref = upright if rot else refs[name]
    dec_path = OUT / f"decoded-{stem}.png"
    if not dec_path.exists():
        res["heic"][stem] = {"error": "도구 디코더 결과 없음"}
        continue
    dec = load(dec_path)
    lib = np.asarray(pillow_heif.open_heif(heic, convert_hdr_to_8bit=True).to_pillow().convert("RGB"), dtype=np.int16)
    row = {"decodedSize": [dec.shape[1], dec.shape[0]], "toolVsRef": psnr(dec, ref), "pillowVsRef": psnr(lib, ref),
           "meanLuma": {"ref": refInfo["tortoise-rot-upright" if rot else name]["meanLuma"], "tool": luma(dec), "pillow": luma(lib)},
           "clipped": {"ref": clipped(ref), "tool": clipped(dec)}}
    if lib.shape == dec.shape:
        diff = np.abs(lib - dec)
        row["toolVsPillow"] = {"maxDiff": int(diff.max()), "meanAbsDiff": round(float(diff.mean()), 4), "psnr": psnr(lib, dec)}
        row["toolLevelFit"] = fit(ref, dec) if ref.shape == dec.shape else None
    else:
        row["toolVsPillow"] = {"error": f"크기 다름: pillow {lib.shape[1]}x{lib.shape[0]}"}
    row["jpg"] = {}
    for jpg in sorted(OUT.glob(f"Chromium-{stem}-jq*.jpg")):
        q = re.search(r"jq(\d+)", jpg.name).group(1)
        j = load(jpg)
        row["jpg"][q] = {"bytes": jpg.stat().st_size, "jpgVsDecoded": psnr(j, dec), "jpgVsRef": psnr(j, ref), "meanLuma": luma(j), "clipped": clipped(j)}
    if OLD and (OLD / f"decoded-{stem}.png").exists():
        old = load(OLD / f"decoded-{stem}.png")
        b = {"decodedSize": [old.shape[1], old.shape[0]], "heic2anyVsRef": psnr(old, ref), "meanLuma": luma(old), "clipped": clipped(old)}
        oj = OLD / f"Chromium-{stem}-jq90.jpg"
        if oj.exists():
            j = load(oj)
            b["jpg90"] = {"bytes": oj.stat().st_size, "jpgVsRef": psnr(j, ref), "meanLuma": luma(j)}
        row["before"] = b
    res["heic"][stem] = row
    for br in ("Firefox", "WebKit"):
        jpg = OUT / f"{br}-{stem}-jq90.jpg"
        if jpg.exists():
            j = load(jpg)
            res["otherBrowsers"].setdefault(br, {})[stem] = {"bytes": jpg.stat().st_size, "size": [j.shape[1], j.shape[0]], "jpgVsRef": psnr(j, ref)}
    print(stem, json.dumps(row, ensure_ascii=False))

for name, ref in refs.items():
    res["direct"][name] = {}
    for jpg in sorted(OUT.glob(f"direct-ref-{name}-jq*.jpg"), key=lambda p: int(re.search(r"jq(\d+)", p.name).group(1))):
        q = re.search(r"jq(\d+)", jpg.name).group(1)
        res["direct"][name][q] = {"bytes": jpg.stat().st_size, "psnr": psnr(load(jpg), ref)}
    print("direct", name, json.dumps(res["direct"][name]))

DEST.write_text(json.dumps(res, ensure_ascii=False, indent=2), encoding="utf-8")
