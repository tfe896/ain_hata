"""Straightens a photo of a card lying on a table (perspective correction) and crops it to the card.
Usage: python3 -I card_crop.py in.jpg out.jpg [inset_px]
Finds the 4 card edges (card = dark or coloured pixels, table = light grey), fits a line to each edge,
intersects them into 4 corners and warps that quadrilateral into an upright rectangle."""
import sys
import numpy as np
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
inset = int(sys.argv[3]) if len(sys.argv) > 3 else 5
im = Image.open(src).convert("RGB")
rgb = np.asarray(im, dtype=np.float32)
lum = rgb.mean(axis=2)
sat = rgb.max(axis=2) - rgb.min(axis=2)
card = (lum < 110) | (sat > 60)  # table: light grey, low saturation
h, w = card.shape

def run_start(line, n=15):
    idx = np.flatnonzero(np.convolve(line.astype(int), np.ones(n, int), "valid") == n)
    return idx[0] if idx.size else None

L, R, T, B = [], [], [], []
for y in range(int(h * 0.2), int(h * 0.8), 4):
    l = run_start(card[y]); r = run_start(card[y][::-1])
    if l is not None: L.append((y, l))
    if r is not None: R.append((y, w - 1 - r))
for x in range(int(w * 0.2), int(w * 0.8), 4):
    t = run_start(card[:, x]); b = run_start(card[:, x][::-1])
    if t is not None: T.append((x, t))
    if b is not None: B.append((x, h - 1 - b))

def fit(pts):  # v = k*u + c, robust: drop the 25% worst, refit twice
    u = np.array([p[0] for p in pts], float); v = np.array([p[1] for p in pts], float)
    keep = np.ones(len(u), bool)
    for _ in range(3):
        k, c = np.polyfit(u[keep], v[keep], 1)
        res = np.abs(v - (k * u + c)); keep = res <= np.percentile(res, 75)
    return k, c

kl, cl = fit(L); kr, cr = fit(R)   # x = k*y + c
kt, ct = fit(T); kb, cb = fit(B)   # y = k*x + c
def cross(kv, cv, kh, ch):         # x = kv*y + cv ; y = kh*x + ch
    y = (kh * cv + ch) / (1 - kh * kv); x = kv * y + cv
    return x, y
tl = cross(kl, cl, kt, ct); tr = cross(kr, cr, kt, ct)
bl = cross(kl, cl, kb, cb); br = cross(kr, cr, kb, cb)
dist = lambda a, b: float(np.hypot(a[0] - b[0], a[1] - b[1]))
W = round((dist(tl, tr) + dist(bl, br)) / 2); H = round((dist(tl, bl) + dist(tr, br)) / 2)

# perspective coefficients mapping output (u,v) -> input (x,y)
dst = [(0, 0), (W, 0), (W, H), (0, H)]; srcq = [tl, tr, br, bl]
A = []; bvec = []
for (u, v), (x, y) in zip(dst, srcq):
    A.append([u, v, 1, 0, 0, 0, -x * u, -x * v]); bvec.append(x)
    A.append([0, 0, 0, u, v, 1, -y * u, -y * v]); bvec.append(y)
coef = np.linalg.solve(np.array(A, float), np.array(bvec, float))
flat = im.transform((W, H), Image.PERSPECTIVE, tuple(coef), resample=Image.BICUBIC)
cardimg = flat.crop((inset, inset, W - inset, H - inset))
cardimg.save(out, quality=92)
print(src, "corners", [tuple(round(v) for v in p) for p in (tl, tr, br, bl)], "card", cardimg.size, "aspect %.3f" % (cardimg.width / cardimg.height))
