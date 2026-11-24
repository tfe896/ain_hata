"""Builds code.js (the Figma plugin) from src/code.src.js + data/assets.json."""
import json, pathlib
here = pathlib.Path(__file__).parent
src = (here / "src/code.src.js").read_text()
assets = json.loads((here / "data/assets.json").read_text())
out = src.replace("__ASSETS__", json.dumps(assets))
(here / "code.js").write_text(out)
print("code.js", len(out) // 1024, "KB")
