"""Remove the pink 'MAEV' mark from a photo by colour-keying it, inpainting, then restoring grain.

Usage: python tools/clean_mark.py in.png out.png x0 y0 x1 y1 [grow=3] [lum=140] [bmin=130]
"""
import sys, cv2, numpy as np
src, dst = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7])
grow = int(sys.argv[7]) if len(sys.argv) > 7 else 3
lum_min = int(sys.argv[8]) if len(sys.argv) > 8 else 140
b_min = int(sys.argv[9]) if len(sys.argv) > 9 else 130
im = cv2.imread(src)
b, g, r = [c.astype(np.int16) for c in cv2.split(im)]
lum = (r + g + b) / 3
m = ((r > 140) & (b > b_min) & (b >= g - 20) & (r - g > 5) & (lum > lum_min)).astype(np.uint8) * 255
box = np.zeros_like(m); box[y0:y1, x0:x1] = 255
m = cv2.bitwise_and(m, box)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=grow)
out = cv2.inpaint(im, m, 6, cv2.INPAINT_TELEA)
rng = np.random.default_rng(1)
noise = rng.normal(0, 3.2, out.shape[:2]).astype(np.float32)
mm = cv2.GaussianBlur(m, (0, 0), 2).astype(np.float32) / 255
for c in range(3):
    out[..., c] = np.clip(out[..., c] + noise * mm, 0, 255).astype(np.uint8)
cv2.imwrite(dst, out)
print(dst, int((m > 0).sum()))
