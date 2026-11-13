"""블로그 실측용: favicon-downscale.mjs 결과를 Pillow 면적 평균(BOX) 축소 기준으로 PSNR 비교한다.
투명 영역이 있으므로 원본·결과 모두 흰 배경에 합성한 뒤 RGB로 비교한다(밝은 탭 배경 가정).
사용: python -I -X utf8 scripts/blog-measure/favicon-psnr.py <로고.png> <결과폴더> > out.json"""
import json, math, os, sys
import numpy as np
from PIL import Image

logo, d = sys.argv[1], sys.argv[2]
def on_white(im):
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im.convert("RGBA")).convert("RGB")
src = on_white(Image.open(logo))
res = {}
for f in sorted(os.listdir(d)):
    if not f.endswith(".png"): continue
    engine, method, size = f[:-4].split("-")
    size = int(size)
    ref = np.asarray(src.resize((size, size), Image.BOX), dtype=np.float64)
    got = np.asarray(on_white(Image.open(os.path.join(d, f))), dtype=np.float64)
    mse = ((ref - got) ** 2).mean()
    res.setdefault(engine, {}).setdefault(method, {})[size] = round(10 * math.log10(255 ** 2 / mse), 2) if mse else None
print(json.dumps(res, ensure_ascii=False, indent=1))
