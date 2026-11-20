#!/usr/bin/env python3
"""Збирає test/index.html: імітація сторінки Webflow (класи з style.css + секції + app.css/app.js).
Запуск: python3 webflow/build_test.py, потім відкрити test/index.html у браузері."""
import glob, os
here = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(here)
css = open(os.path.join(here, "style.css"), encoding="utf8").read()
body = "\n".join(open(f, encoding="utf8").read() for f in sorted(glob.glob(os.path.join(here, "sections", "s*.html"))))
html = f"""<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AIN × MII — локальна імітація Webflow</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Onest:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
<style>*{{box-sizing:border-box}}body{{margin:0}}img{{max-width:100%;vertical-align:middle;display:inline-block}}a{{background:transparent}}h1,h2,h3{{font-weight:700}}
{css}</style><link rel="stylesheet" href="../css/app.css"></head><body><div class="page">
{body}
</div><script src="../js/app.js"></script></body></html>"""
open(os.path.join(root, "test", "index.html"), "w", encoding="utf8").write(html)
print("ok", len(html))
