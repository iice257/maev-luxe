"""Build the site's /images from source-photos (1-8) plus cleaned versions of the branded shots.
Run from the project root after tools/clean_mark.py has produced the cleaned 2, 3, 4.
"""
import sys, pathlib
from PIL import Image

root = pathlib.Path(__file__).resolve().parent.parent
src = root / "source-photos"
clean = pathlib.Path(sys.argv[1])        # folder with k2.png k3.png k4.png
out = root / "images"; out.mkdir(exist_ok=True)

def open_(p): return Image.open(p).convert("RGB")
def save(im, name, q=88): im.save(out / name, "JPEG", quality=q, optimize=True, progressive=True)
def crop(im, box): return im.crop(box)

p = {i: open_(src / f"{i}.png") for i in range(1, 9)}
k2, k3, k4 = (open_(clean / f"k{i}.png") for i in (2, 3, 4))

# hero triptych (desktop) + mobile hero
save(p[6], "hero-1.jpg"); save(k2, "hero-2.jpg"); save(p[5], "hero-3.jpg")
# colour picker, all 3:4
save(crop(p[8], (0, 205, 943, 1462)), "colour-rose.jpg")
save(crop(p[7], (0, 225, 943, 1482)), "colour-graphite.jpg")
save(crop(k2, (150, 520, 850, 1453)), "colour-dusk.jpg")
save(crop(k4, (0, 185, 944, 1443)), "colour-sand.jpg")
save(crop(k3, (0, 195, 943, 1452)), "colour-mauve.jpg")
save(crop(k2, (0, 340, 560, 1087)), "colour-wine.jpg")
# butterfly detail, lookbook (branded originals), final CTA
save(p[1], "butterfly.jpg")
save(p[3], "look-1.jpg"); save(p[2], "look-2.jpg"); save(p[4], "look-3.jpg")
save(p[6], "cta.jpg", 82)
print(sorted(f.name for f in out.iterdir()))
