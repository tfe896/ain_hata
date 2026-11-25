"""Builds the Figma plugin(s) from src/code.src.js + data/assets.json.
   python3 build.py        -> code.js            (the whole presentation, 39 slides)
   python3 build.py two    -> two-slides/code.js (only slide 7 badges and slide 9 stage)"""
import json, pathlib, sys
here = pathlib.Path(__file__).parent
src = (here / "src/code.src.js").read_text()
assets = json.loads((here / "data/assets.json").read_text())
part = sys.argv[1] if len(sys.argv) > 1 else None
if part == "two":
    keep = ["logo_k", "logo_w", "s7_badges", "s7_card_front", "s7_card_qr", "s9_stage", "s9_screen"]
    assets = {"img": {k: assets["img"][k] for k in keep}, "size": {k: assets["size"][k] for k in keep}, "layout": {}}
    out_path = here / "two-slides" / "code.js"
else:
    out_path = here / "code.js"
out = src.replace("__ASSETS__", json.dumps(assets)).replace("__PART__", json.dumps(part))
out_path.parent.mkdir(exist_ok=True)
out_path.write_text(out)
print(out_path.relative_to(here), len(out) // 1024, "KB")
