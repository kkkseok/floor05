"""alpha-survival.mjs 결과 분석: 형식, 알파 채널 유무, 완전 투명·반투명·불투명 픽셀 비율.
사용: python -I -X utf8 scripts/blog-measure/alpha-survival.py <로고.png> <결과폴더> > out.json"""
import json, os, sys
import numpy as np
from PIL import Image

def stats(path):
    im = Image.open(path)
    fmt, mode, size = im.format, im.mode, im.size
    has_alpha = "A" in im.getbands() or "transparency" in im.info
    a = np.asarray(im.convert("RGBA"))[..., 3]
    return {"format": fmt, "mode": mode, "size": size, "hasAlpha": has_alpha, "bytes": os.path.getsize(path),
            "transparent": round(float((a == 0).mean()), 4), "semi": round(float(((a > 0) & (a < 255)).mean()), 4),
            "opaque": round(float((a == 255).mean()), 4)}

logo, d = sys.argv[1], sys.argv[2]
res = {"source": stats(logo), "outputs": {}}
for f in sorted(os.listdir(d)):
    name = f.split("__")[0]
    try:
        res["outputs"][name] = {"file": f, **stats(os.path.join(d, f))}
    except Exception as e:
        res["outputs"][name] = {"file": f, "error": str(e)}
print(json.dumps(res, ensure_ascii=False, indent=1))
