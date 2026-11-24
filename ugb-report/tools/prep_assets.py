"""Builds data/assets.json for the UGB report Figma plugin.
Usage: python3 -I prep_assets.py <pages_dir with p-01.png..> <extra_dir with big/, dl/, pi/> <out assets.json> [preview_dir]
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
put("cover", Image.open(os.path.join(extra, "pi", "x-001-000.jpg")).convert("RGB"), maxw=1700)
for n in [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 14, 15, 24, 25]:
    put("c%d" % n, crop(n, (0, 118, 1920, 948)), maxw=1800)
for i, x in enumerate([(80, 620), (680, 1290), (1330, 1915)]):
    put("c12_%d" % (i + 1), crop(12, (x[0], 125, x[1], 520)), maxw=900)
put("c12_ga", crop(12, (540, 650, 1420, 860)), maxw=1100)
put("c13_li", crop(13, (670, 40, 1180, 680)), maxw=900)
put("c13_r", crop(13, (1190, 112, 1904, 930)), maxw=1000)
# event photos already in the deck: originals pulled with `pdfimages -j -p` into <extra>/pi
def pi(name): return Image.open(os.path.join(extra, "pi", name)).convert("RGB")
for key, f in (("ph_panel1", "x-016-000"), ("ph_panel2", "x-016-002"), ("ph_panel2b", "x-016-004"),
               ("ph_stage2", "x-016-006"), ("ph_badges", "x-018-000"), ("ph_tv1", "x-019-000"),
               ("ph_tv2", "x-020-000"), ("ph_stage", "x-021-000"), ("ph_stand1", "x-023-000"),
               ("ph_stand2", "x-023-006"), ("ph_stand3", "x-023-002")):
    put(key, pi(f + ".jpg"), maxw=1400, q=82)
# 3 photos from the event folder (Drive) for backgrounds
for k, f in (("bg2", "0116"), ("bg3", "0248"), ("bg4", "0135")):
    put(k, Image.open(os.path.join(extra, "big", f + ".jpg")).convert("RGB"), maxw=1920, q=80)
for i in (1, 2, 3):
    put("story%d" % i, Image.open(os.path.join(extra, "dl", "st%d.jpg" % i)).convert("RGB"), maxw=600)
for i in (1, 2):
    put("mail%d" % i, tight(Image.open(os.path.join(extra, "dl", "mail-%d.png" % i)).convert("RGB")), maxw=900)
# unchanged slides 26..38 as full images
for n in range(26, 39):
    im, s = page(n)
    put("full%d" % n, im, maxw=1920, q=82)

json.dump({"img": A, "size": SIZES}, open(out, "w"))
print(len(A), "assets", os.path.getsize(out) // 1024, "KB")
