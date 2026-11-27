"""Збирає code.js (Figma-плагін) = logo-data.js + spec.js + figma-render.js."""
import pathlib
here = pathlib.Path(__file__).parent
out = "\n".join((here / f).read_text() for f in ("logo-data.js", "spec.js", "figma-render.js"))
(here / "code.js").write_text(out)
print("code.js", len(out), "bytes")
