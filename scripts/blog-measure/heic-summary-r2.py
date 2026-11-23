"""
블로그 실측용(heic-to-jpg-guide) 3차 측정 묶음: main 8277750(PNG 중간 저장 제거 + HEIC 한 장씩 처리)으로 다시 잰 값을
docs/blog-data/heic-<측정일>-libheif2.json 하나로 묶고, 직전 측정(e4f6af7, heic-<측정일>-libheif.json)과의 차이를 derived 에 넣는다.
화질은 다시 계산하지 않는다. 대신 디코딩 픽셀 해시와 JPG 바이트(sha256)가 직전 측정과 같은지 확인해, 같으면 직전 PSNR이 그대로 유효하다.
사용: python -I -X utf8 scripts/blog-measure/heic-summary-r2.py <r2폴더> <직전결과폴더> <직전.json> <출력.json> <측정일>
  <r2폴더>: convert-<chromium|firefox|webkit>.json, ui-<엔진>.json, ui-oldcode-<엔진>.json(있으면), load.jsonl, out/(JPG)
  <직전결과폴더>: 직전 측정의 out-libheif/(JPG 비교용)
"""
import hashlib
import json
import statistics
import sys
from pathlib import Path

R2, PREV_OUT, PREV_JSON, DEST, DAY = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]), Path(sys.argv[4]), sys.argv[5]
J = lambda p: json.loads(p.read_text(encoding="utf-8-sig"))
prev = J(PREV_JSON)
conv = {}
for e in ("chromium", "firefox", "webkit"):
    f = R2 / f"convert-{e}.json"
    if f.exists():
        conv.update(J(f)["browsers"])
ui = {e: J(R2 / f"ui-{e}.json") for e in ("chromium", "firefox", "webkit") if (R2 / f"ui-{e}.json").exists()}
uiOld = {e: J(R2 / f"ui-oldcode-{e}.json") for e in ("chromium", "firefox", "webkit") if (R2 / f"ui-oldcode-{e}.json").exists()}
load = [json.loads(l) for l in (R2 / "load.jsonl").read_text(encoding="utf-8-sig").splitlines() if l.strip()] if (R2 / "load.jsonl").exists() else None

rows = {b: {r["name"].replace(".heic", ""): r for r in v["rows"]} for b, v in conv.items()}
prevRows = {b: {r["name"].replace(".heic", ""): r for r in v["rows"]} for b, v in prev["browsers"].items()}
stems = sorted(rows["Chromium"])
main = [s for s in stems if s.count("-") == 1]
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()


def stat(v):
    return {"min": min(v), "median": statistics.median(v), "max": max(v), "n": len(v)}


derived = {"errors": {b: {s: r["error"] for s, r in v.items() if r.get("error")} for b, v in rows.items()}, "timeMsPerFile": {}, "sameAsPrevious": {}}
for b in rows:
    excl = [v for s in main if s != "flower-q50" for v in rows[b][s]["repsMs"]]
    derived["timeMsPerFile"][b] = {
        "version": conv[b]["version"], "initMs": conv[b]["initMs"],
        "perFile": {s: stat(r["repsMs"]) for s, r in rows[b].items()},
        "sixFiles": stat([v for s in main for v in rows[b][s]["repsMs"]]),
        "withoutFlowerQ50": stat(excl),
        "decodeToCanvasMs": stat([rows[b][s]["decode"]["decodeToCanvasMs"] for s in main]),
        "stagesSixFiles": {k: stat([st[k] for s in main for st in rows[b][s]["decode"]["stages"]]) for k in ("parseMs", "displayMs", "putImageDataMs")},
        "pngStage": "없음(8277750에서 제거)",
    }
# 직전 측정과 같은 결과인지: 디코딩 픽셀 해시, 캔버스 해시, JPG 90% 파일 sha256
for b in rows:
    d = {}
    for s in stems:
        r, pr = rows[b][s], prevRows[b][s]
        newJ, oldJ = R2 / "out" / f"{b}-{s}-jq90.jpg", PREV_OUT / f"{b}-{s}-jq90.jpg"
        d[s] = {"pixelSha256Same": r["decode"]["pixelSha256"] == pr["decode"]["pixelSha256"],
                "canvasEqualsDecodedPixels": r["decode"]["canvasPixelSha256"] == r["decode"]["pixelSha256"],
                "jpg90Sha256Same": newJ.exists() and oldJ.exists() and sha(newJ) == sha(oldJ)}
        if b == "Chromium":
            n100, o100 = R2 / "out" / f"Chromium-{s}-jq100.jpg", PREV_OUT / f"Chromium-{s}-jq100.jpg"
            d[s]["jpg100Sha256Same"] = n100.exists() and o100.exists() and sha(n100) == sha(o100)
    derived["sameAsPrevious"][b] = d
derived["allSameAsPrevious"] = all(all(v for v in x.values()) for b in derived["sameAsPrevious"].values() for x in b.values())

derived["ui"] = {}
for e, u in ui.items():
    bt = {}
    for r in u["batch"]:
        bt.setdefault(str(r["files"]), []).append(r.get("ms"))
    derived["ui"][u["engine"]] = {
        "browser": u["browser"],
        "batchMs": {k: {**stat([x for x in v if x is not None]), "runs": v, "medianPerFile": round(statistics.median([x for x in v if x is not None]) / int(k))}
                    for k, v in bt.items() if any(x is not None for x in v)},
        "allDone": all(r.get("done") == r["files"] and not r["pageErrors"] and not r.get("error") for r in u["batch"] + u["memory"]),
        "downloadIdentical": {k: v.get("identical") for k, v in (u["single"] or {}).items()},
        "memory10": [{k: m["memory"][k] for k in ("maxWorkingSetMB", "maxPrivateMB", "maxProcs", "minSystemFreeMB")} | {"ms": m.get("ms"), "done": m.get("done"), "beforeClickWsMB": m["memory"]["beforeClick"]["wsMB"]}
                     for m in u["memory"] if m.get("memory")],
    }
derived["uiOldCode"] = {}
for e, u in uiOld.items():
    derived["uiOldCode"][u["engine"]] = {
        "browser": u["browser"],
        "memory10": [{k: m["memory"][k] for k in ("maxWorkingSetMB", "maxPrivateMB", "maxProcs", "minSystemFreeMB")} | {"ms": m.get("ms"), "done": m.get("done"), "beforeClickWsMB": m["memory"]["beforeClick"]["wsMB"]}
                     for m in u["memory"] if m.get("memory")],
        "allDone": all(r.get("done") == r["files"] and not r["pageErrors"] and not r.get("error") for r in u["memory"]),
    }

# 직전(e4f6af7, PNG 중간 저장 + 동시 처리) ↔ 이번(8277750)
pd = prev["derived"]
ch = {"timeWithoutFlowerQ50": {b: {"previous": pd["timeMsPerFile"][b]["withoutFlowerQ50"], "now": derived["timeMsPerFile"][b]["withoutFlowerQ50"]} for b in rows},
      "flowerQ50": {b: {"previous": pd["timeMsPerFile"][b]["perFile"]["flower-q50"], "now": derived["timeMsPerFile"][b]["perFile"]["flower-q50"]} for b in rows},
      "decodeStageMedianMs": {b: {"previousDisplay": pd["timeMsPerFile"][b]["stagesSixFiles"]["displayMs"]["median"], "previousPng": pd["timeMsPerFile"][b]["stagesSixFiles"]["pngMs"]["median"],
                                  "nowDisplay": derived["timeMsPerFile"][b]["stagesSixFiles"]["displayMs"]["median"], "nowPng": "없음"} for b in rows},
      "ui": {eng: {k: {"previous": pd["ui"].get(eng, {}).get("batchMs", {}).get(k), "now": v} for k, v in derived["ui"][eng]["batchMs"].items()} for eng in derived["ui"]}}
derived["changeVsPrevious"] = ch

doc = {
    "measuredAt": DAY,
    "post": "heic-to-jpg-guide",
    "code": "main 8277750: decodeHeicToCanvas(PNG 중간 저장 없음) + runHeicExclusive(HEIC 한 장씩) + 캔버스 크기 0으로 해제",
    "previous": {"file": PREV_JSON.as_posix(), "code": "main e4f6af7: libheif-js → PNG 저장 → <img> 로드, 여러 장 동시 처리"},
    "machine": "Windows 11 PC(Intel Core i5-1340P, RAM 16GB), Playwright 1.62.1 기본 브라우저(headless). 서버·브라우저는 한 번에 하나만, 빌드와 겹치지 않게 순서대로 실행",
    "load": load,
    "units": "시간 ms. 메모리 MB(1MB=1,048,576B, Windows 표기와 같게)",
    "notes": [
        "화질(PSNR)은 다시 계산하지 않았다. 디코딩 픽셀 해시·JPG 90%(Chromium은 100%도) sha256이 직전 측정과 모두 같으면 직전 psnr 값이 그대로 유효하다(derived.allSameAsPrevious)",
        "용량 비교군(direct)과 PNG 출력은 디코더 경로와 무관해 다시 재지 않았다(직전 json 참조)",
        "stages: parseMs=decoder.decode, displayMs=image.display(HEVC 디코딩+RGB 변환), putImageDataMs=캔버스에 쓰기. PNG 저장 단계는 없어졌다",
        "메모리: scripts/blog-measure/proc-mem-sampler.ps1 로 Playwright launchServer 루트 프로세스와 자손 전체의 WorkingSetSize·PrivatePageCount 합을 500ms마다 읽은 최대치. 시간 측정과 따로 돈 10장 회차에서만 쟀다. 작업 관리자 수준의 근사치",
        "uiOldCode: 같은 워크트리에 e4f6af7의 convert.ts 만 되돌려 빌드한 사이트로 잰 10장 메모리(비교용, 측정 후 원복)",
    ],
    "derived": derived,
    "browsers": conv,
    "ui": ui,
    "uiOldCode": uiOld,
}
DEST.write_text(json.dumps(doc, ensure_ascii=False, indent=1), encoding="utf-8")
print(json.dumps({k: derived[k] for k in ("errors", "allSameAsPrevious", "ui", "uiOldCode", "changeVsPrevious")}, ensure_ascii=False, indent=1))
