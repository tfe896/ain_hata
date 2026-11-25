"""Builds data/assets.json for the UGB report Figma plugin.
Usage: python3 -I prep_assets.py <pages_dir with p-01.png..> <extra_dir with big/, dl/, pi/, orig/> <out assets.json> [preview_dir]
Pages are the source PDF rendered at 144 dpi (pdftoppm -r 144 -png deck.pdf pages/p)."""
import sys, json, base64, io, os
from PIL import Image, ImageChops

pages, extra, out = sys.argv[1], sys.argv[2], sys.argv[3]
prev = sys.argv[4] if len(sys.argv) > 4 else None
PW = {13: 1904}  # page widths in pt (others 1920)
A, SIZES = {}, {}

def page(n):
    im = Image.open(os.path.join(pages, "p-%02d.png" % n)).convert("RGB")
    return im, im.width / PW.get(n, 1920)

def tight(im, bg=(255, 255, 255), thr=18, pad=0):
    diff = ImageChops.difference(im, Image.new("RGB", im.size, bg)).convert("L").point(lambda v: 255 if v > thr else 0)
    b = diff.getbbox()
    if not b: return im
    return im.crop((max(0, b[0] - pad), max(0, b[1] - pad), min(im.width, b[2] + pad), min(im.height, b[3] + pad)))

def crop(n, box, auto=True, bg=(255, 255, 255)):
    im, s = page(n)
    c = im.crop(tuple(int(v * s) for v in box))
    return tight(c, bg) if auto else c

def put(key, im, maxw=1800, q=84, fmt="JPEG"):
    if im.width > maxw:
        im = im.resize((maxw, round(im.height * maxw / im.width)), Image.LANCZOS)
    buf = io.BytesIO()
    if fmt == "PNG": im.save(buf, "PNG", optimize=True)
    else: im.convert("RGB").save(buf, "JPEG", quality=q, optimize=True, progressive=True)
    A[key] = base64.b64encode(buf.getvalue()).decode()
    SIZES[key] = [im.width, im.height]
    if prev: im.save(os.path.join(prev, key + (".png" if fmt == "PNG" else ".jpg")))

# logos (black on white) -> black + white versions with alpha
lg = crop(2, (40, 40, 380, 115))
mask = lg.convert("L").point(lambda v: 255 - v)
for name, col in (("logo_k", (0, 0, 0)), ("logo_w", (255, 255, 255))):
    o = Image.new("RGBA", lg.size, col + (0,)); o.putalpha(mask)
    put(name, o, maxw=900, fmt="PNG")

RED = (253, 53, 51)
# ---- screenshots: the ORIGINAL images embedded in the PDF (the deck clipped/overlapped some of them) ----
# <extra>/orig/p-NNN-MMM.jpg are made by `pdfimages -j -p deck.pdf orig/p`; their boxes on the page come from
# <extra>/orig/boxes.json ({page: [[x0, top, x1, bottom], ...]} in drawing order, from pdfplumber).
BOX = json.load(open(os.path.join(extra, "orig", "boxes.json")))
LAYOUT = {}
for n in [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 24, 25] + list(range(26, 38)):
    files = sorted(f for f in os.listdir(os.path.join(extra, "orig")) if f.startswith("p-%03d-" % n) and f.endswith(".jpg"))
    boxes = BOX[str(n)]
    assert len(files) == len(boxes), (n, files, boxes)
    LAYOUT[n] = []
    for i, (f, b) in enumerate(zip(files, boxes)):
        key = "o%d_%d" % (n, i)
        put(key, Image.open(os.path.join(extra, "orig", f)).convert("RGB"), maxw=1600, q=84)
        LAYOUT[n].append([round(v) for v in b] + [key])
put("c11", crop(11, (0, 118, 1920, 948)), maxw=1800)  # stories stats: render crop (phones are layered images)
put("c15", crop(15, (0, 118, 1920, 948)), maxw=1800)
# ---- event photos ----
# originals already used in the deck were pulled with `pdfimages -j -p` into <extra>/pi,
# 5 more come from the event folder on Drive (<extra>/big/NNNN.jpg).
def pi(name): return Image.open(os.path.join(extra, "pi", name + ".jpg")).convert("RGB")
def drv(name): return Image.open(os.path.join(extra, "big", name + ".jpg")).convert("RGB")
def cropf(im, aspect=None, cx=0.5, cy=0.5):
    """Largest region with the given aspect, centred at (cx, cy) as fractions; no aspect = keep whole photo."""
    if not aspect: return im
    w, h = im.size
    if w / h > aspect: cw, ch = round(h * aspect), h
    else: cw, ch = w, round(w / aspect)
    x = min(max(0, round(cx * w - cw / 2)), w - cw); y = min(max(0, round(cy * h - ch / 2)), h - ch)
    return im.crop((x, y, x + cw, y + ch))
PHOTOS = {
    # key: (source, aspect, cx, cy)   aspect None = uncropped 3:2
    "s5_panel1": (drv("0168"), 2.1, 0.5, 0.40),   # slide 5: panel 1 (wide, whole stage)
    "s5_panel2": (drv("0346"), 2.1, 0.5, 0.50),   # slide 5: panel 2
    "s6_stand_big": (pi("x-023-006"), None, 0, 0),  # slide 6: stand, whole
    "s6_stand_a": (drv("0015"), None, 0, 0),         # whole stand, all text visible
    "s6_stand_b": (pi("x-023-002"), None, 0, 0),
    "s7_badges": (pi("x-018-000"), None, 0, 0),     # slide 7: the badge photo
    "s9_1": (pi("x-016-000"), None, 0, 0),  # slide 9 = old "photos from the event" slides 16-17, uncropped
    "s9_2": (pi("x-016-006"), None, 0, 0),
    "s9_3": (pi("x-016-004"), None, 0, 0),
    "s9_4": (pi("x-016-002"), None, 0, 0),
}

for key, (im, asp, cx, cy) in PHOTOS.items():
    put(key, cropf(im, asp, cx, cy), maxw=1000 if key.startswith("s9_") else 1400, q=82)
def cropbox(im, b):
    w, h = im.size
    return im.crop((round(b[0] * w), round(b[1] * h), round(b[2] * w), round(b[3] * h)))
# slide 8: zoomed in on the screens so the partner logos are readable; all 0.92:1, x-range + vertical centre
def zoom(im, x0, x1, cy, aspect=0.92):
    w, h = im.size; cw = (x1 - x0) * w; ch = cw / aspect
    y0 = min(max(0, cy * h - ch / 2), h - ch)
    return im.crop((round(x0 * w), round(y0), round(x1 * w), round(y0 + ch)))
# originals of old slides 21, 22 (stage) and 19 (TV); old 20 is the same TV shot, left out on request
# slide 9 "на сцені (екрани)": the stage (old slide 17 photo) + 3 screens by the stage (old 21, 22, 19),
# all 16:9 and tight on the screens so the partner logos on them are readable
def box169(im, x0, x1, cy, aspect=16 / 9):
    w, h = im.size; cw = (x1 - x0) * w; ch = cw / aspect
    y0 = min(max(0, cy * h - ch / 2), h - ch)
    return im.crop((round(x0 * w), round(y0), round(x1 * w), round(y0 + ch)))
put("s9_stage", box169(pi("x-017-002"), 0.0, 1.0, 0.5), maxw=1400, q=86)
put("s9_scr1", box169(pi("x-021-000"), 0.55, 1.0, 0.40), maxw=1400, q=86)
put("s9_scr2", box169(pi("x-022-000"), 0.40, 0.95, 0.38), maxw=1400, q=86)
put("s9_scr3", box169(pi("x-019-000"), 0.12, 0.72, 0.36), maxw=1400, q=86)
# slide 7: second badge photo (shot in the office): the 3 right columns, no grey table visible, no text cut
put("s7_badges2", Image.open(os.path.join(extra, "badge", "src.jpg")).convert("RGB").crop((548, 160, 1752, 1812)), maxw=1000, q=86)
# invitation slide (old slide 15): both original screenshots in the old layout (frames p-015-000/004 skipped)
put("inv_full", Image.open(os.path.join(extra, "orig", "p-015-006.jpg")).convert("RGB"), maxw=1000, q=86)
put("inv_top", Image.open(os.path.join(extra, "orig", "p-015-002.jpg")).convert("RGB"), maxw=1400, q=86)
LAYOUT[15] = [[49, 165, 768, 914, "inv_full"], [807, 168, 1884, 815, "inv_top"]]
# slide 21: the three articles without the right sidebar of the site (bigger on the slide)
# (left menu and right column of the site cut off: only the article itself, so it can be big)
for key, f in {"art1": "p-012-006", "art2": "p-012-000", "art3": "p-012-002"}.items():
    put(key, cropbox(Image.open(os.path.join(extra, "orig", f + ".jpg")).convert("RGB"), (0.226, 0, 0.735, 1)), maxw=1100, q=88)
put("cover", pi("x-001-000"), maxw=1700)
# full-bleed backgrounds of slides 2-4 (Drive)
for k, f in (("bg2", "0116"), ("bg3", "0248"), ("bg4", "0135")):
    put(k, drv(f), maxw=1920, q=80)
for i in (1, 2, 3):
    put("story%d" % i, Image.open(os.path.join(extra, "dl", "st%d.jpg" % i)).convert("RGB"), maxw=600)
for i in (1, 2):
    put("mail%d" % i, tight(Image.open(os.path.join(extra, "dl", "mail-%d.png" % i)).convert("RGB")), maxw=900)
# slide 38 stays a full image
im38, _ = page(38)
put("full38", im38, maxw=1920, q=82)

json.dump({"img": A, "size": SIZES, "layout": LAYOUT}, open(out, "w"))
print(len(A), "assets", os.path.getsize(out) // 1024, "KB")
