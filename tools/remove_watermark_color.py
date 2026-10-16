"""Remove the pink 'MAEV' watermark from upscaled stills by colour-keying it.

Usage:  python tools/remove_watermark_color.py <in.png> <out.png> x0 y0 x1 y1
(x0..y1 = box around the watermark). Works because the mark is light pink
(R high, B >= G) while the bags/backgrounds are not.
"""
import sys, cv2, numpy as np

src, dst = sys.argv[1], sys.argv[2]
x0, y0, x1, y1 = map(int, sys.argv[3:7])
im = cv2.imread(src)
b, g, r = [c.astype(np.int16) for c in cv2.split(im)]
m = ((r > 165) & (b > 150) & (b >= g - 8) & (r - g > 12)).astype(np.uint8) * 255
box = np.zeros_like(m); box[y0:y1, x0:x1] = 255
m = cv2.bitwise_and(m, box)
m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
m = cv2.dilate(m, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)), iterations=2)
out = cv2.inpaint(im, m, 5, cv2.INPAINT_TELEA)
cv2.imwrite(dst, out)
print(src, "masked px:", int((m > 0).sum()))
