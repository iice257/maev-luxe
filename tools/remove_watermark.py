"""Remove the burned-in MAEV video watermark from stills.

Usage:  python tools/remove_watermark.py <input_dir> <output_dir>
The mask (tools/watermark-mask.png) was measured on the 480x848 source frames;
it is rescaled automatically for upscaled images that keep the same 9:16 framing.
"""
import sys, pathlib, cv2, numpy as np

here = pathlib.Path(__file__).parent
mask0 = cv2.imread(str(here / "watermark-mask.png"), 0)
src, dst = pathlib.Path(sys.argv[1]), pathlib.Path(sys.argv[2])
dst.mkdir(parents=True, exist_ok=True)

for f in sorted(src.glob("*.png")) + sorted(src.glob("*.jpg")):
    im = cv2.imread(str(f))
    h, w = im.shape[:2]
    m = cv2.resize(mask0, (w, h), interpolation=cv2.INTER_LINEAR)
    m = cv2.dilate((m > 100).astype(np.uint8) * 255, np.ones((3, 3), np.uint8), iterations=max(1, round(w / 480)))
    out = cv2.inpaint(im, m, max(3, round(3 * w / 480)), cv2.INPAINT_TELEA)
    cv2.imwrite(str(dst / f.name), out)
    print("cleaned", f.name)
