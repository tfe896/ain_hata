#!/usr/bin/env python3
"""Збирає code.js: вбудовує картинки (base64) і карту (SVG) у src/code.src.js."""
import base64, json, pathlib

root = pathlib.Path(__file__).parent
b64 = lambda name: base64.b64encode((root / "data" / name).read_bytes()).decode()
assets = {
    "stamp": b64("logo-spivpratsia.png"),
    "kb": b64("logo-kredobank-ain.png"),
    "mazda": b64("logo-mazda.png"),
    "map": (root / "data" / "map.svg").read_text(encoding="utf-8"),
}
for p in sorted((root / "data" / "photos").glob("*.jpg")):
    assets[p.stem] = b64("photos/" + p.name)
src = (root / "src" / "code.src.js").read_text(encoding="utf-8")
assert "__ASSETS__" in src
(root / "code.js").write_text(src.replace("__ASSETS__", json.dumps(assets, ensure_ascii=False)), encoding="utf-8")
print("code.js:", (root / "code.js").stat().st_size // 1024, "KB")
