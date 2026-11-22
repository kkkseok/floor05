"""
블로그 실측용(heic-to-jpg-guide): 측정 조각(sources.json, convert*.json, psnr.json, ui.json)을
docs/blog-data/heic-<측정일>.json 하나로 묶고, 글에 쓰는 비율·범위를 다시 계산해 derived 에 넣는다.
사용: python -I -X utf8 scripts/blog-measure/heic-summary.py <스크래치폴더> <출력.json> <측정일>
  <스크래치폴더>: src/sources.json, convert.json, convert-limited.json, psnr.json, ui.json 이 있는 곳
                  (figure.json 은 heic-level-crops.py 의 출력을 저장한 것, 있으면 함께 넣는다)
"""
import json
import statistics
import sys
from pathlib import Path

D, DEST, DAY = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3]
J = lambda p: json.loads((D / p).read_text(encoding="utf-8"))
sources, conv, lim, psnr, ui = J("src/sources.json"), J("convert.json"), J("convert-limited.json"), J("psnr.json"), J("ui.json")

# 제한 범위 대조군(거북이)만 합친다
for b, v in conv["browsers"].items():
    v["rows"] += [r for r in lim["browsers"][b]["rows"] if r["name"] == "tortoise-q70-limited.heic"]
    v["rows"].sort(key=lambda r: r["name"])
rows = {b: {r["name"].replace(".heic", ""): r for r in v["rows"]} for b, v in conv["browsers"].items()}
C = rows["Chromium"]
stems = sorted(C)
main = [s for s in stems if s.count("-") == 1]  # 품질 50·70·90 여섯 개

def out(r, q):
    return next(o for o in r["outputs"] if round(o["quality"] * 100) == q)

derived = {"sizes": {}, "timeMsPerFile": {}, "equalPsnr": {}, "levels": {}}
for s in stems:
    heic = C[s]["bytes"]
    j90 = out(C[s], 90)["bytes"]
    derived["sizes"][s] = {"heicBytes": heic, "jpg90Bytes": j90, "jpg90OverHeic": round(j90 / heic, 2),
                           "jpg100Bytes": out(C[s], 100)["bytes"], "jpg100OverHeic": round(out(C[s], 100)["bytes"] / heic, 2),
                           "firefoxJpg90Bytes": out(rows["Firefox"][s], 90)["bytes"],
                           "firefoxOverChromium": round(out(rows["Firefox"][s], 90)["bytes"] / j90, 2),
                           "webkitSameBytesAsChromium": out(rows["WebKit"][s], 90)["bytes"] == j90}
# 변환 시간: 준비가 끝난 뒤의 반복 측정(repsMs)만. 12MP 파일 전체(품질 50 꽃 포함)
for b in rows:
    per = {s: {"min": min(r["repsMs"]), "median": statistics.median(r["repsMs"]), "max": max(r["repsMs"]), "n": len(r["repsMs"])}
           for s, r in rows[b].items()}
    allv = [v for s in main for v in rows[b][s]["repsMs"]]
    excl = [v for s in main if s != "flower-q50" for v in rows[b][s]["repsMs"]]
    derived["timeMsPerFile"][b] = {"perFile": per,
                                   "sixFiles": {"min": min(allv), "median": statistics.median(allv), "max": max(allv), "n": len(allv)},
                                   "withoutFlowerQ50": {"min": min(excl), "median": statistics.median(excl), "max": max(excl), "n": len(excl)}}
derived["decodeShare"] = {s: round(C[s]["decode"]["ms"] / statistics.median(C[s]["repsMs"]), 2) for s in main}
# 같은 화질(PSNR)에 가장 가까운 JPG와 용량 비교. HEIC 화질은 libheif로 푼 값(인코딩 손실만)
for s in main:
    name = s.split("-")[0]
    target = psnr["heic"][s]["libheifVsRef"]
    q, d = min(psnr["direct"][name].items(), key=lambda kv: abs(kv[1]["psnr"] - target))
    derived["equalPsnr"][s] = {"heicBytes": C[s]["bytes"], "heicPsnr": target, "nearestJpgQuality": int(q),
                               "jpgBytes": d["bytes"], "jpgPsnr": d["psnr"], "heicOverJpg": round(C[s]["bytes"] / d["bytes"], 2)}
for s in stems:
    p = psnr["heic"][s]
    derived["levels"][s] = {"heic2anyVsRef": p["heicVsRef"], "libheifVsRef": p["libheifVsRef"], "fit": p["heic2anyLevelFit"],
                            "clipped": p["clipped"], "jpg90VsRef": p["jpg"]["90"]["jpgVsRef"], "jpg90VsDecoded": p["jpg"]["90"]["jpgVsDecoded"],
                            "jpg100VsDecoded": p["jpg"]["100"]["jpgVsDecoded"]}
derived["pixelHashSameAcrossBrowsers"] = all(len({rows[b][s]["decode"]["pixelSha256"] for b in rows}) == 1 for s in stems)
derived["exif"] = {"tortoiseExifBytesInHeic": sources["files"]["ref-tortoise.png"]["exifBytesInOriginal"],
                   "flowerExifBytesInHeic": sources["files"]["ref-flower.png"]["exifBytesInOriginal"],
                   "outputMarkers": {s: [x["marker"] for x in out(C[s], 90)["segments"]] for s in stems},
                   "anyApp1InOutput": any(x["marker"] == "FFE1" for s in stems for o in C[s]["outputs"] for x in o["segments"])}
derived["rotation"] = {"storedPixels": [4032, 3024], "outputSize": out(C["tortoise-q70-rot"], 90)["jpegSize"],
                       "psnrVsUprightRef": psnr["heic"]["tortoise-q70-rot"]["heicVsRef"], "psnrNonRotated": psnr["heic"]["tortoise-q70"]["heicVsRef"]}
b = {}
for r in ui["batch"]:
    b.setdefault(str(r["files"]), []).append(r["ms"])
derived["uiBatchMs"] = {k: {"min": min(v), "median": statistics.median(v), "max": max(v), "runs": v,
                            "medianPerFile": round(statistics.median(v) / int(k))} for k, v in b.items()}
derived["uiBatchAllDone"] = all(r.get("done") == r["files"] and not r["pageErrors"] for r in ui["batch"])
derived["uiDownloadIdentical"] = {k: v["identical"] for k, v in ui["single"].items()}

doc = {
    "measuredAt": DAY,
    "post": "heic-to-jpg-guide",
    "machine": "Windows 11 PC, Playwright 1.62.1 기본 브라우저(headless). 시간은 이 PC 기준이며 측정 중 다른 세션의 작업이 함께 돌았을 가능성을 배제하지 못함(이 측정 자체는 빌드와 겹치지 않게 순서대로 실행)",
    "source": {
        "note": "아이폰이 찍은 HEIC가 아니다. NASA 공공 도메인 사진 2장을 가운데 4:3으로 잘라 4032x3024로 줄인 뒤 x265(libheif)로 직접 인코딩했다. 기준 이미지는 인코딩 전의 무손실 PNG",
        "nasa": {"tortoise": "KSC-20210121-PH-JBS01_0079", "flower": "KSC-20230613-PH-FMX01-0075"},
        **sources,
    },
    "path": "src/lib/image/convert.ts convertImage 를 esbuild로 묶어 실행: heic2any 0.0.4 → PNG → <img> → Canvas → toBlob('image/jpeg', 품질). 도구 화면 기본 품질 90%",
    "units": "용량 1MB=1,000,000B. PSNR은 RGB 8비트 3채널 MSE(dB), JPG는 Pillow로 디코딩",
    "notes": [
        "heic2any 0.0.4에 들어 있는 libheif.js는 YCbCr→RGB를 제한 범위 BT.601 식(1.164*(Y-16) ...)으로 고정 변환한다(node_modules/heic2any/dist/heic2any.js 21행). 전체 범위로 인코딩된 HEIC는 밝기가 약 1.15배로 늘어나 어두운 곳·밝은 곳이 잘린다.",
        "tortoise-q70-limited 는 같은 사진을 제한 범위(full_range_flag=0)로 인코딩한 대조군. heic2any 결과가 libheif 결과와 0.5dB 안으로 맞는다.",
        "꽃 사진의 제한 범위 변형은 nclx 표기와 달리 픽셀이 전체 범위로 인코딩돼(변환식 재현 대조로 확인) 대조군에서 제외했다.",
        "아이폰이 저장한 HEIC가 전체 범위인지, 같은 현상이 나는지는 측정하지 않았다(저작권이 깨끗한 아이폰 원본 없음).",
        "변환 시간의 outputs[].ms 에는 첫 호출의 heic2any 준비 시간과 결과 전송 부하가 섞인다. 글에는 repsMs(반복 측정)와 실제 도구 화면 시간(ui)을 쓴다.",
    ],
    "externalFacts": [{"claim": "iOS 11 이후 HEIF/HEVC 지원. 설정 > 카메라 > 포맷에서 '높은 호환성'을 고르면 새 사진이 JPEG로 저장되고 '고효율성'을 고르면 HEIF로 돌아간다. 문서에 용량 수치는 없고 'JPEG 및 H.264보다 압축률이 높다'고만 적혀 있다",
                       "url": "https://support.apple.com/ko-kr/116944", "checked": "2026-11-23"}],
    "figure": {"files": "public/images/blog/heic-to-jpg-guide/levels-{ref,full,limited}.jpg",
               "note": "거북이 품질 70 파일의 같은 영역(1200x900 → 600x450 축소). full·limited는 도구 결과 JPG 90%",
               **(J("figure.json") if (D / "figure.json").exists() else {})},
    "derived": derived,
    "browsers": conv["browsers"],
    "direct": conv["direct"],
    "psnr": psnr,
    "ui": ui,
}
DEST.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps(derived, ensure_ascii=False, indent=1))
