"""Builds the Figma plugin(s) from src/code.src.js + data/assets.json.
   python3 build.py         -> code.js              (the whole presentation, 39 slides)
   python3 build.py two     -> two-slides/code.js   (only slide 7 badges and slide 9 stage)
   python3 build.py banner  -> banner-slide/code.js (only the slide with the site banner and its statistics)
   python3 build.py general -> general-report/code.js (general report for all research partners, no Ukrgazbank)"""
import json, pathlib, sys
here = pathlib.Path(__file__).parent
src = (here / "src/code.src.js").read_text()
assets = json.loads((here / "data/assets.json").read_text())
part = sys.argv[1] if len(sys.argv) > 1 else None
PARTS = {
    "two": ("two-slides", ["logo_k", "logo_w", "s7_badges", "s7_card_front", "s7_card_qr", "s9_stage", "s9_screen"]),
    "banner": ("banner-slide", ["logo_k", "logo_w", "s13_banner", "s13_stats"]),
    "general": ("general-report", None),  # None = all assets except the Ukrgazbank-only ones
}
import re
UGB_ONLY = re.compile(r"^(o2[6-9]_|o3[0-7]_|s6_|logo_)")
if part:
    folder, keep = PARTS[part]
    if keep is None:
        keep = [k for k in assets["img"] if not UGB_ONLY.match(k)]
        layout = {n: v for n, v in assets["layout"].items() if not 26 <= int(n) <= 37}
    else:
        layout = {}
    assets = {"img": {k: assets["img"][k] for k in keep}, "size": {k: assets["size"][k] for k in keep}, "layout": layout}
    out_path = here / folder / "code.js"
else:
    out_path = here / "code.js"
out = src.replace("__ASSETS__", json.dumps(assets)).replace("__PART__", json.dumps(part))
out_path.parent.mkdir(exist_ok=True)
out_path.write_text(out)
print(out_path.relative_to(here), len(out) // 1024, "KB")
