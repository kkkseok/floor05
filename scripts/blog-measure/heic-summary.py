"""
블로그 실측용(heic-to-jpg-guide): 측정 조각을 docs/blog-data/heic-<측정일>-libheif.json 하나로 묶고,
글에 쓰는 비율·범위를 다시 계산해 derived 에 넣는다. 고치기 전(heic2any 0.0.4) 값은 첫 측정 원자료에서 가져와
derived.beforeAfter 에 나란히 둔다(첫 측정 파일은 수정하지 않는다).
사용: python -I -X utf8 scripts/blog-measure/heic-summary.py <스크래치폴더> <출력.json> <측정일> <첫측정.json>
  <스크래치폴더>: src/sources.json, convert-libheif.json, psnr-libheif.json, ui-libheif-<chromium|firefox|webkit>.json,
                  figure-libheif.json(heic-level-crops.py 출력), load.json(측정 전후 CPU·메모리 기록, 있으면)
"""
import json
import statistics
import sys
from pathlib import Path

D, DEST, DAY, BEFORE = Path(sys.argv[1]), Path(sys.argv[2]), sys.argv[3], Path(sys.argv[4])
J = lambda p: json.loads((D / p).read_text(encoding="utf-8"))
sources, conv, psnr, fig = J("src/sources.json"), J("convert-libheif.json"), J("psnr-libheif.json"), J("figure-libheif.json")
ui = {e: J(f"ui-libheif-{e}.json") for e in ("chromium", "firefox", "webkit") if (D / f"ui-libheif-{e}.json").exists()}
load = J("load.json") if (D / "load.json").exists() else None
old = json.loads(BEFORE.read_text(encoding="utf-8"))

rows = {b: {r["name"].replace(".heic", ""): r for r in v["rows"]} for b, v in conv["browsers"].items()}
C = rows["Chromium"]
stems = sorted(C)
main = [s for s in stems if s.count("-") == 1]  # 품질 50·70·90 여섯 개
errors = {b: {s: r["error"] for s, r in v.items() if r.get("error")} for b, v in rows.items()}


def out(r, q):
    return next(o for o in r["outputs"] if round(o["quality"] * 100) == q)


def stat(v):
    return {"min": min(v), "median": statistics.median(v), "max": max(v), "n": len(v)}


derived = {"errors": errors, "sizes": {}, "quality": {}, "timeMsPerFile": {}, "equalPsnr": {}}
for s in stems:
    heic = C[s]["bytes"]
    j90 = out(C[s], 90)["bytes"]
    j100 = out(C[s], 100)["bytes"]
    derived["sizes"][s] = {"heicBytes": heic, "jpg90Bytes": j90, "jpg90OverHeic": round(j90 / heic, 2),
                           "jpg100Bytes": j100, "jpg100OverHeic": round(j100 / heic, 2),
                           "pngBytes": C[s]["png"]["bytes"], "pngOverHeic": round(C[s]["png"]["bytes"] / heic, 2),
                           "firefoxJpg90Bytes": out(rows["Firefox"][s], 90)["bytes"],
                           "firefoxOverChromium": round(out(rows["Firefox"][s], 90)["bytes"] / j90, 2),
                           "webkitJpg90Bytes": out(rows["WebKit"][s], 90)["bytes"],
                           "webkitSameBytesAsChromium": out(rows["WebKit"][s], 90)["bytes"] == j90,
                           "pngBytesByBrowser": {b: rows[b][s]["png"]["bytes"] for b in rows}}
for s in stems:
    p = psnr["heic"][s]
    derived["quality"][s] = {"toolVsRef": p["toolVsRef"], "pillowVsRef": p["pillowVsRef"], "toolVsPillow": p["toolVsPillow"],
                             "jpg90VsDecoded": p["jpg"]["90"]["jpgVsDecoded"], "jpg100VsDecoded": p["jpg"]["100"]["jpgVsDecoded"],
                             "jpg90VsRef": p["jpg"]["90"]["jpgVsRef"], "meanLuma": p["meanLuma"], "clipped": p["clipped"],
                             "jpg90MeanLuma": p["jpg"]["90"]["meanLuma"], "toolLevelFit": p.get("toolLevelFit")}
mainQ = [derived["quality"][s] for s in main]
derived["qualityRanges"] = {
    "toolVsRef": [min(q["toolVsRef"] for q in mainQ), max(q["toolVsRef"] for q in mainQ)],
    "toolVsPillowPsnr": [min(q["toolVsPillow"]["psnr"] for q in mainQ), max(q["toolVsPillow"]["psnr"] for q in mainQ)],
    "toolVsPillowMaxDiff": max(q["toolVsPillow"]["maxDiff"] for q in mainQ),
    "jpg90VsDecoded": [min(q["jpg90VsDecoded"] for q in mainQ), max(q["jpg90VsDecoded"] for q in mainQ)],
    "jpg100VsDecoded": [min(q["jpg100VsDecoded"] for q in mainQ), max(q["jpg100VsDecoded"] for q in mainQ)],
    "jpg90VsRef": [min(q["jpg90VsRef"] for q in mainQ), max(q["jpg90VsRef"] for q in mainQ)],
    "meanLumaToolMinusRef": [round(min(q["meanLuma"]["tool"] - q["meanLuma"]["ref"] for q in mainQ), 2),
                             round(max(q["meanLuma"]["tool"] - q["meanLuma"]["ref"] for q in mainQ), 2)],
}
mainS = [derived["sizes"][s] for s in main]
derived["sizeRanges"] = {k: [min(x[k] for x in mainS), max(x[k] for x in mainS)]
                         for k in ("jpg90OverHeic", "jpg100OverHeic", "pngOverHeic", "jpg90Bytes", "jpg100Bytes", "pngBytes", "firefoxOverChromium")}
derived["sizeRanges"]["webkitSameBytesAsChromiumAll"] = all(x["webkitSameBytesAsChromium"] for x in mainS)

# 변환 시간: 준비가 끝난 뒤의 반복 측정(repsMs)만
for b in rows:
    per = {s: stat(r["repsMs"]) for s, r in rows[b].items() if r.get("repsMs")}
    allv = [v for s in main for v in rows[b][s]["repsMs"]]
    excl = [v for s in main if s != "flower-q50" for v in rows[b][s]["repsMs"]]
    stages = {k: stat([st[k] for s in main for st in rows[b][s]["decode"]["stages"]]) for k in ("parseMs", "displayMs", "pngMs")}
    derived["timeMsPerFile"][b] = {"version": conv["browsers"][b]["version"], "initMs": conv["browsers"][b]["initMs"],
                                   "perFile": per, "sixFiles": stat(allv), "withoutFlowerQ50": stat(excl),
                                   "decodeHeicMs": stat([rows[b][s]["decode"]["decodeHeicMs"] for s in main]),
                                   "stagesSixFiles": stages}
derived["pixelHashSameAcrossBrowsers"] = {s: len({rows[b][s]["decode"]["pixelSha256"] for b in rows}) == 1 for s in stems}
for s in main:
    name = s.split("-")[0]
    target = psnr["heic"][s]["pillowVsRef"]
    q, d = min(psnr["direct"][name].items(), key=lambda kv: abs(kv[1]["psnr"] - target))
    derived["equalPsnr"][s] = {"heicBytes": C[s]["bytes"], "heicPsnr": target, "nearestJpgQuality": int(q),
                               "jpgBytes": d["bytes"], "jpgPsnr": d["psnr"], "heicOverJpg": round(C[s]["bytes"] / d["bytes"], 2)}
derived["exif"] = {"tortoiseExifBytesInHeic": sources["files"]["ref-tortoise.png"]["exifBytesInOriginal"],
                   "flowerExifBytesInHeic": sources["files"]["ref-flower.png"]["exifBytesInOriginal"],
                   "outputMarkers": {s: [x["marker"] for x in out(C[s], 90)["segments"]] for s in stems},
                   "anyApp1InOutput": any(x["marker"] == "FFE1" for b in rows for s in stems for o in rows[b][s]["outputs"] for x in o["segments"])}
derived["rotation"] = {"storedPixels": sources["files"]["tortoise-q70-rot.heic"]["storedPixels"],
                       "outputSizeByBrowser": {b: out(rows[b]["tortoise-q70-rot"], 90)["jpegSize"] for b in rows},
                       "toolVsUprightRef": psnr["heic"]["tortoise-q70-rot"]["toolVsRef"], "toolNonRotated": psnr["heic"]["tortoise-q70"]["toolVsRef"]}
derived["ui"] = {}
for e, u in ui.items():
    bt = {}
    for r in u["batch"]:
        bt.setdefault(str(r["files"]), []).append(r.get("ms"))
    derived["ui"][u["engine"]] = {
        "browser": u["browser"],
        "batchMs": {k: {**stat([x for x in v if x is not None]), "runs": v, "medianPerFile": round(statistics.median([x for x in v if x is not None]) / int(k))}
                    for k, v in bt.items() if any(x is not None for x in v)},
        "allDone": all(r.get("done") == r["files"] and not r["pageErrors"] and not r.get("error") for r in u["batch"]),
        "failures": [{k: r.get(k) for k in ("files", "done", "error", "pageErrors")} for r in u["batch"] if r.get("done") != r["files"] or r["pageErrors"] or r.get("error")],
        "downloadIdentical": {k: v.get("identical") for k, v in u["single"].items()},
    }

# 고치기 전(heic2any, 첫 측정 원자료) ↔ 고친 뒤(libheif-js, 이번 측정)
od = old["derived"]
ba = {}
for s in ("tortoise-q70", "flower-q70", "tortoise-q70-limited"):
    p = psnr["heic"][s]
    ba[s] = {"psnrVsRef": {"before": od["levels"][s]["heic2anyVsRef"], "beforeRecomputed": p["before"]["heic2anyVsRef"], "after": p["toolVsRef"], "pillow": p["pillowVsRef"]},
             "meanLuma": {"ref": p["meanLuma"]["ref"], "before": p["before"]["meanLuma"], "after": p["meanLuma"]["tool"]},
             "blackPct": {"ref": p["clipped"]["ref"]["blackPct"], "before": p["before"]["clipped"]["blackPct"], "after": p["clipped"]["tool"]["blackPct"]},
             "whitePct": {"ref": p["clipped"]["ref"]["whitePct"], "before": p["before"]["clipped"]["whitePct"], "after": p["clipped"]["tool"]["whitePct"]},
             "jpg90VsRef": {"before": od["levels"][s]["jpg90VsRef"], "after": p["jpg"]["90"]["jpgVsRef"]}}
ba["figureCrop"] = {"box": fig["box"], "meanLuma": fig["meanLuma"], "newlyBlackPctInBox": fig["newlyBlackPctInBox"]}
ba["timeChromiumWithoutFlowerQ50"] = {"before": od["timeMsPerFile"]["Chromium"]["withoutFlowerQ50"], "after": derived["timeMsPerFile"]["Chromium"]["withoutFlowerQ50"]}
ba["timeByBrowserWithoutFlowerQ50"] = {b: {"before": od["timeMsPerFile"][b]["withoutFlowerQ50"], "after": derived["timeMsPerFile"][b]["withoutFlowerQ50"]} for b in rows}
ba["uiChromium10"] = {"before": od["uiBatchMs"]["10"], "after": derived["ui"].get("Chromium", {}).get("batchMs", {}).get("10")}
ba["jpg90BytesChromium"] = {s: {"before": od["sizes"][s]["jpg90Bytes"], "after": derived["sizes"][s]["jpg90Bytes"]} for s in main}
derived["beforeAfter"] = ba

doc = {
    "measuredAt": DAY,
    "post": "heic-to-jpg-guide",
    "decoder": conv["decoder"],
    "before": {"file": BEFORE.as_posix(), "decoder": "heic2any 0.0.4",
               "note": "고치기 전 값은 첫 측정(같은 날, 같은 HEIC 소스) 원자료. 밝기·잘린 픽셀은 첫 측정 때 저장한 decoded-*.png와 JPG로 heic-psnr.py가 다시 계산했다"},
    "machine": "Windows 11 PC(Intel Core i5-1340P, RAM 16GB), Playwright 1.62.1 기본 브라우저(headless). 시간은 이 PC 기준. 측정은 빌드·서버와 겹치지 않게 순서대로 실행했고, 다른 세션의 작업이 함께 돌았을 가능성은 배제하지 못함(load 참조)",
    "load": load,
    "source": {
        "note": "아이폰이 찍은 HEIC가 아니다. NASA 공공 도메인 사진 2장을 가운데 4:3으로 잘라 4032x3024로 줄인 뒤 x265(libheif)로 직접 인코딩했다. 기준 이미지는 인코딩 전의 무손실 PNG",
        "nasa": {"tortoise": "KSC-20210121-PH-JBS01_0079", "flower": "KSC-20230613-PH-FMX01-0075"},
        **sources,
    },
    "path": "src/lib/image/convert.ts convertImage 를 esbuild로 묶어 실행: libheif-js 1.23.5(decodeHeic) → PNG → <img> → Canvas → toBlob(형식, 품질). 도구 화면 기본 품질 90%",
    "units": "용량 1MB=1,000,000B. PSNR은 RGB 8비트 3채널 MSE(dB), JPG는 Pillow로 디코딩. 밝기는 Pillow L(BT.601) 평균",
    "notes": [
        "decode.stages: parseMs=decoder.decode(컨테이너 읽기), displayMs=image.display(HEVC 디코딩과 RGB 변환), pngMs=putImageData+PNG 저장. decodeHeic 와 같은 순서를 나눠 잰 값",
        "initMs 는 페이지마다 처음 한 번 libheif-js를 준비하는 시간(측정 페이지에는 번들이 들어 있어 내려받기 시간 없음). 도구 화면 시간(ui)은 회마다 새 컨텍스트라 청크 내려받기와 준비 시간이 들어 있다",
        "tortoise-q70-limited 는 같은 사진을 제한 범위(full_range_flag=0)로 인코딩한 대조군",
        "아이폰이 저장한 HEIC는 측정하지 않았다(저작권이 깨끗한 아이폰 원본 없음)",
    ],
    "externalFacts": old.get("externalFacts"),
    "figure": {"files": "public/images/blog/heic-to-jpg-guide/levels-{ref,before,after}.jpg",
               "note": "거북이 품질 70 파일의 같은 영역(1200x900 → 600x450 축소). before=heic2any 시절 도구 결과 JPG 90%, after=libheif-js 도구 결과 JPG 90%", **fig},
    "derived": derived,
    "browsers": conv["browsers"],
    "direct": conv["direct"],
    "psnr": psnr,
    "ui": ui,
}
DEST.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps({k: v for k, v in derived.items() if k not in ("exif",)}, ensure_ascii=False, indent=1))
