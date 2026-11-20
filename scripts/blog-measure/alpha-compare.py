"""블로그용 그림: 투명 로고와 도구 결과를 체크무늬(투명 표시) 위에 나란히 놓는다.
사용: python -I -X utf8 scripts/blog-measure/alpha-compare.py <출력.png> <라벨=파일>..."""
import sys
from PIL import Image, ImageDraw, ImageFont

out, specs = sys.argv[1], sys.argv[2:]
font = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 18)
TW, TH, PAD, GAP, LABEL = 300, 200, 12, 16, 32
def checker(w, h, s=12):
    im = Image.new("RGBA", (w, h), (255, 255, 255, 255)); d = ImageDraw.Draw(im)
    for y in range(0, h, s):
        for x in range(0, w, s):
            if (x // s + y // s) % 2: d.rectangle([x, y, x + s - 1, y + s - 1], fill=(204, 204, 204, 255))
    return im
W = PAD * 2 + len(specs) * TW + (len(specs) - 1) * GAP
H = PAD * 2 + LABEL + TH
canvas = Image.new("RGB", (W, H), (250, 250, 250)); dr = ImageDraw.Draw(canvas)
for i, s in enumerate(specs):
    label, f = s.split("=", 1)
    x = PAD + i * (TW + GAP)
    dr.text((x, PAD), label, fill=(10, 10, 10), font=font)
    tile = checker(TW, TH)
    im = Image.open(f).convert("RGBA").resize((TW, TH), Image.LANCZOS)
    tile.alpha_composite(im)
    canvas.paste(tile.convert("RGB"), (x, PAD + LABEL))
canvas.save(out, optimize=True); print(out, canvas.size)
