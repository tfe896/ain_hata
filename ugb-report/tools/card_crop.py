"""Straightens a photo of a dark card lying on a light table and crops it to the card (table removed).
Usage: python3 -I card_crop.py in.jpg out.jpg [inset_px]
Fits lines to the 4 card edges (dark/light transition), rotates by the mean tilt, crops just inside the edges."""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
inset = int(sys.argv[3]) if len(sys.argv) > 3 else 6

def edges(im):
    a = np.asarray(im.convert("L"), dtype=np.float32)
    dark = a < 80
    h, w = dark.shape
    def run_start(line):  # first index of a run of >= 12 dark pixels
        idx = np.flatnonzero(np.convolve(line.astype(int), np.ones(12, int), "valid") == 12)
        return idx[0] if idx.size else None
    L, R, T, B = [], [], [], []
    for y in range(int(h * 0.3), int(h * 0.7), 6):
        l = run_start(dark[y]); r = run_start(dark[y][::-1])
        if l is not None: L.append((y, l))
        if r is not None: R.append((y, w - 1 - r))
    for x in range(int(w * 0.3), int(w * 0.7), 6):
        t = run_start(dark[:, x]); b = run_start(dark[:, x][::-1])
        if t is not None: T.append((x, t))
        if b is not None: B.append((x, h - 1 - b))
    return L, R, T, B

def fit(pts):  # v = k*u + c, robust (drop 20% worst)
    u = np.array([p[0] for p in pts], float); v = np.array([p[1] for p in pts], float)
    k, c = np.polyfit(u, v, 1)
    res = np.abs(v - (k * u + c)); keep = res <= np.percentile(res, 80)
    return np.polyfit(u[keep], v[keep], 1)

im = Image.open(src).convert("RGB")
L, R, T, B = edges(im)
kl, _ = fit(L); kr, _ = fit(R); kt, _ = fit(T); kb, _ = fit(B)
# tilt: vertical edges x = k*y + c -> angle atan(k); horizontal edges y = k*x + c -> angle -atan(k)
ang = np.degrees(np.mean([np.arctan(kl), np.arctan(kr), -np.arctan(kt), -np.arctan(kb)]))
rot = im.rotate(-ang, resample=Image.BICUBIC, expand=False, fillcolor=(200, 200, 200))
L, R, T, B = edges(rot)
med = lambda pts: float(np.median([p[1] for p in pts]))
box = (round(med(L)) + inset, round(med(T)) + inset, round(med(R)) - inset, round(med(B)) - inset)
card = rot.crop(box)
card.save(out, quality=92)
print(src, "tilt %.2f deg" % ang, "box", box, "card", card.size, "aspect %.3f" % (card.width / card.height))
