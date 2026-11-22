"""
블로그 시각 자료(heic-to-jpg-guide): 같은 영역을 기준 이미지 / 도구 결과(전체 범위 HEIC) / 도구 결과(제한 범위 HEIC)
로 잘라 나란히 볼 수 있게 저장한다. 영역은 "도구 결과에서만 완전한 검정(0,0,0)이 된 픽셀"이 가장 많은 1200x900 칸을 고른다.
1200x900을 600x450으로 줄여 JPG(품질 90)로 저장한다. 밝기 차이를 보는 그림이라 축소해도 된다.
사용: venv/Scripts/python -I -X utf8 scripts/blog-measure/heic-level-crops.py <소스폴더> <결과폴더> public/images/blog/heic-to-jpg-guide
"""
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
SRC, OUT, DEST = Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3])
DEST.mkdir(parents=True, exist_ok=True)
CW, CH = 1200, 900

ref = Image.open(SRC / "ref-tortoise.png").convert("RGB")
full = Image.open(OUT / "Chromium-tortoise-q70-jq90.jpg").convert("RGB")
lim = Image.open(OUT / "Chromium-tortoise-q70-limited-jq90.jpg").convert("RGB")
r, f = np.asarray(ref), np.asarray(full)
newly_black = (f.max(axis=2) == 0) & (r.max(axis=2) > 0)
best, box = -1, None
for y in range(0, r.shape[0] - CH + 1, 150):
    for x in range(0, r.shape[1] - CW + 1, 150):
        n = int(newly_black[y:y + CH, x:x + CW].sum())
        if n > best:
            best, box = n, (x, y, x + CW, y + CH)
info = {"box": box, "newlyBlackPixelsInBox": best, "boxPixels": CW * CH, "meanLuma": {}}
for name, im in (("ref", ref), ("full", full), ("limited", lim)):
    crop = im.crop(box)
    info["meanLuma"][name] = round(float(np.asarray(crop.convert("L")).mean()), 1)
    crop.resize((600, 450), Image.LANCZOS).save(DEST / f"levels-{name}.jpg", quality=90)
print(json.dumps(info))
