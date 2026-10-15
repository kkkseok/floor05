"""블로그용 그림: 파비콘 16·32px을 이전 방식(M1)·지금 방식(M3)·기준(Pillow 면적 평균)으로 나란히 확대한다.
사용: python -I -X utf8 scripts/blog-measure/favicon-compare.py <로고.png> <favicon-downscale 결과폴더> <출력.png> [엔진=chromium]"""
import sys
from PIL import Image, ImageDraw, ImageFont

logo, d, out = sys.argv[1], sys.argv[2], sys.argv[3]
engine = sys.argv[4] if len(sys.argv) > 4 else "chromium"
font = ImageFont.truetype("C:/Windows/Fonts/malgunbd.ttf", 18)
def on_white(im):
    bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
    return Image.alpha_composite(bg, im.convert("RGBA")).convert("RGB")
src = on_white(Image.open(logo))
TILE, PAD, GAP, LABEL = 192, 16, 24, 34
cols = [("이전 방식 (한 번에)", "M1"), ("지금 방식 (절반씩)", "M3"), ("기준: 면적 평균", "REF")]
rows = [16, 32]
W = PAD * 2 + len(cols) * TILE + (len(cols) - 1) * GAP
H = PAD * 2 + LABEL + len(rows) * TILE + (len(rows) - 1) * GAP
canvas = Image.new("RGB", (W, H), (250, 250, 250))
dr = ImageDraw.Draw(canvas)
for ci, (label, m) in enumerate(cols):
    x = PAD + ci * (TILE + GAP)
    dr.text((x, PAD), label, fill=(10, 10, 10), font=font)
    for ri, size in enumerate(rows):
        y = PAD + LABEL + ri * (TILE + GAP)
        im = src.resize((size, size), Image.BOX) if m == "REF" else on_white(Image.open(f"{d}/{engine}-{m}-{size}.png"))
        canvas.paste(im.resize((TILE, TILE), Image.NEAREST), (x, y))
        dr.text((x + 6, y + TILE - 26), f"{size}px", fill=(255, 255, 255), font=font, stroke_width=2, stroke_fill=(10, 10, 10))
canvas.save(out, optimize=True)
print(out, canvas.size)
