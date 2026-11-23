"""
E2E용 HEIC fixture 생성: 전체 범위(full range)로 인코딩한 HEIC.
그림은 스크립트로 만든 단색 면(저작권 문제 없음): 왼쪽 절반 RGB(8,8,8), 오른쪽 절반 RGB(240,240,240), 256x128.

heic2any(0.0.4)는 모든 HEIC를 제한 범위 식(1.164*(Y-16))으로 풀어, 전체 범위 파일의 어두운 면(8)이 0으로
뭉개졌다. 이 fixture로 디코더가 범위 표시를 따르는지 E2E에서 확인한다.

사용: python -I -X utf8 scripts/qa/make-heic-range-fixtures.py   (pillow-heif 필요)
결과: tests/fixtures/static/range-full-256x128.heic
참고: 같은 옵션에 full_range_flag=0을 줘도 ICC가 없는 그림은 픽셀이 전체 범위로 인코딩돼(libheif 1.23.6)
제한 범위 대조 fixture는 만들지 않는다.
"""
from pathlib import Path

import numpy as np
import pillow_heif
from PIL import Image

OUT = Path("tests/fixtures/static")
OUT.mkdir(parents=True, exist_ok=True)
a = np.zeros((128, 256, 3), dtype=np.uint8)
a[:, :128] = 8
a[:, 128:] = 240
img = Image.fromarray(a, "RGB")

pillow_heif.register_heif_opener()
for name, full in [("range-full-256x128.heic", 1)]:
    hf = pillow_heif.from_pillow(img)
    hf.save(
        OUT / name,
        quality=95,
        chroma=420,
        save_nclx_profile=True,
        matrix_coefficients=6,
        color_primaries=1,
        transfer_characteristics=13,
        full_range_flag=full,
    )
    print(name, (OUT / name).stat().st_size, "bytes")
