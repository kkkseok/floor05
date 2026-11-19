"""블로그 실측용(prevent-photo-theft): upload-size-restore.mjs가 만든 줄인 JPG를 Pillow로 다시 원본 크기로 키워
원본과 비교한 PSNR(RGB 3채널, 전체 픽셀)과, 줄인 파일에 남은 JPEG 세그먼트·EXIF 태그 수를 잰다.
기준 = Pillow가 디코딩한 원본 JPG. 확대 필터는 LANCZOS와 BICUBIC 두 가지.
사용: python -I -X utf8 scripts/blog-measure/upload-size-restore.py <결과폴더> <이름=원본.jpg>... > out.json"""
import json, math, os, struct, sys
import numpy as np
from PIL import Image

Image.MAX_IMAGE_PIXELS = None
NAMES = {0xE0: "APP0(JFIF)", 0xE1: "APP1", 0xE2: "APP2", 0xED: "APP13(IPTC)", 0xEE: "APP14(Adobe)", 0xFE: "COM"}


def meta_segments(path):
    """이미지 데이터와 부호화 표(DQT·DHT·SOF·DRI)를 뺀 세그먼트만 돌려준다."""
    b = open(path, "rb").read()
    out, i = [], 2
    while i < len(b) - 4 and b[i] == 0xFF:
        m = b[i + 1]
        if m == 0xDA:
            break
        L = struct.unpack(">H", b[i + 2:i + 4])[0]
        payload = b[i + 4:i + 2 + L]
        if m in NAMES or 0xE0 <= m <= 0xEF:
            name = NAMES.get(m, hex(m))
            if m == 0xE1:
                name = "APP1(Exif)" if payload.startswith(b"Exif") else ("APP1(XMP)" if b"ns.adobe.com/xap" in payload[:64] else "APP1")
            if m == 0xE2 and payload.startswith(b"ICC_PROFILE"):
                name = "APP2(ICC)"
            out.append({"marker": name, "bytes": L + 2})
        i += 2 + L
    return out


def exif_summary(path):
    ex = Image.open(path).getexif()
    n = len(ex)
    try:
        n += len(ex.get_ifd(0x8769))
    except Exception:
        pass
    return {"tagCount": n, "Artist": ex.get(0x013B), "Copyright": ex.get(0x8298)}


def psnr(a, b):
    se = 0.0
    step = 512  # 행 단위로 나눠 메모리를 아낀다
    for y in range(0, a.shape[0], step):
        d = a[y:y + step].astype(np.int32) - b[y:y + step].astype(np.int32)
        se += float((d * d).sum())
    mse = se / a.size
    return round(10 * math.log10(255 ** 2 / mse), 2)


d = sys.argv[1]
res = {}
for spec in sys.argv[2:]:
    name, src = spec.split("=", 1)
    ref_img = Image.open(src).convert("RGB")
    ref = np.asarray(ref_img)
    entry = {"source": {"metaSegments": meta_segments(src), "exif": exif_summary(src)}, "rows": []}
    for f in sorted(os.listdir(d), key=lambda s: -int(s[:-4].rsplit("-", 1)[1]) if s.startswith(name + "-") and s.endswith(".jpg") else 0):
        if not (f.startswith(name + "-") and f.endswith(".jpg")):
            continue
        long = int(f[:-4].rsplit("-", 1)[1])
        p = os.path.join(d, f)
        small = Image.open(p).convert("RGB")
        row = {"long": long, "width": small.size[0], "height": small.size[1], "bytes": os.path.getsize(p),
               "metaSegments": meta_segments(p), "exif": exif_summary(p)}
        if small.size == ref_img.size:
            row["restoredPsnrPillow"] = {"none": psnr(ref, np.asarray(small))}
        else:
            row["restoredPsnrPillow"] = {
                "lanczos": psnr(ref, np.asarray(small.resize(ref_img.size, Image.LANCZOS))),
                "bicubic": psnr(ref, np.asarray(small.resize(ref_img.size, Image.BICUBIC))),
            }
        entry["rows"].append(row)
    res[name] = entry
print(json.dumps(res, ensure_ascii=False, indent=1))
