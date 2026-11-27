"""Збирає code.js (Figma-плагін) = spec.js + figma-render.js."""
import pathlib
here = pathlib.Path(__file__).parent
out = (here / "spec.js").read_text() + "\n" + (here / "figma-render.js").read_text()
(here / "code.js").write_text(out)
print("code.js", len(out), "bytes")
