"""블로그 실측용: JPEG 파일의 마커 세그먼트(APPn 등)와 EXIF 주요 태그를 덤프한다.
사용: python -I scripts/blog-measure/jpeg-segments.py <파일.jpg>... > out.json
EXIF 태그 파싱은 Pillow(있을 때만)를 쓴다. 세그먼트 목록은 직접 바이트를 읽는다."""
import json, struct, sys

NAMES = {0xE0: "APP0(JFIF)", 0xE1: "APP1", 0xE2: "APP2", 0xED: "APP13(IPTC)", 0xEE: "APP14(Adobe)", 0xFE: "COM", 0xDB: "DQT", 0xC0: "SOF0", 0xC2: "SOF2", 0xC4: "DHT", 0xDD: "DRI"}

def segments(b):
    out, i = [], 2
    while i < len(b) - 4 and b[i] == 0xFF:
        m = b[i + 1]
        if m == 0xDA:
            out.append({"marker": "SOS+이미지 데이터", "bytes": len(b) - i}); break
        L = struct.unpack(">H", b[i + 2:i + 4])[0]
        name = NAMES.get(m, hex(m))
        payload = b[i + 4:i + 2 + L]
        if m == 0xE1:
            name = "APP1(Exif)" if payload.startswith(b"Exif") else ("APP1(XMP)" if b"ns.adobe.com/xap" in payload[:64] else "APP1")
        if m == 0xE2 and payload.startswith(b"ICC_PROFILE"):
            name = "APP2(ICC)"
        out.append({"marker": name, "bytes": L + 2})
        i += 2 + L
    return out

def exif_tags(path):
    try:
        from PIL import Image, ExifTags
    except ImportError:
        return None
    img = Image.open(path)
    ex = img.getexif()
    tags = {}
    for k, v in ex.items():
        tags[ExifTags.TAGS.get(k, hex(k))] = str(v)[:120]
    for ifd_id, label in ((0x8769, "Exif"), (0x8825, "GPS")):
        try:
            sub = ex.get_ifd(ifd_id)
        except Exception:
            sub = {}
        for k, v in sub.items():
            name = (ExifTags.GPSTAGS if label == "GPS" else ExifTags.TAGS).get(k, hex(k))
            tags[f"{label}.{name}"] = str(v)[:120]
    icc = img.info.get("icc_profile")
    if icc:
        tags["_icc_profile_desc"] = icc[icc.find(b"desc") + 12: icc.find(b"desc") + 60].decode("latin1", "ignore").strip("\x00 ")
    return tags

res = {}
for p in sys.argv[1:]:
    b = open(p, "rb").read()
    segs = segments(b)
    res[p.replace("\\", "/").split("/")[-1]] = {"fileBytes": len(b), "segments": segs, "exif": exif_tags(p)}
print(json.dumps(res, ensure_ascii=False, indent=1))
