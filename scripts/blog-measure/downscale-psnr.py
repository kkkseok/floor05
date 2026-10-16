"""downscale-ratios.mjs 결과를 Pillow 면적 평균(BOX) 축소 기준으로 PSNR 비교한다(흰 배경 합성 후 RGB).
사용: python -I -X utf8 scripts/blog-measure/downscale-psnr.py <결과폴더> <이름=원본>... > out.json"""
import json, math, os, sys
import numpy as np
from PIL import Image

d = sys.argv[1]
src = {}
for s in sys.argv[2:]:
    n, f = s.split("=", 1)
    im = Image.open(f).convert("RGBA")
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    src[n] = Image.alpha_composite(bg, im).convert("RGB")
res = {}
for f in sorted(os.listdir(d)):
    if not f.endswith(".png"): continue
    engine, name, method, w = f[:-4].split("-")
    got = Image.open(os.path.join(d, f)).convert("RGBA")
    bg = Image.new("RGBA", got.size, (255, 255, 255, 255)); got = Image.alpha_composite(bg, got).convert("RGB")
    ref = src[name].resize(got.size, Image.BOX)
    mse = ((np.asarray(ref, float) - np.asarray(got, float)) ** 2).mean()
    res.setdefault(name, {}).setdefault(w, {}).setdefault(engine, {})[method] = round(10 * math.log10(255 ** 2 / mse), 2)
print(json.dumps(res, ensure_ascii=False, indent=1))
