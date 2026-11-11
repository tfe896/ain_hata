#!/usr/bin/env python3
"""Збирає лендінг Mazda × Співпраця.

  python3 build.py            -> index.html (локальна перевірка, файли беруться з цієї папки)
  python3 build.py <commit>   -> те саме + webflow/out/* : розмітка секцій із посиланнями на jsDelivr
                                 і код для <head> та кінця <body> сторінки Webflow
"""
import pathlib, re, sys

HERE = pathlib.Path(__file__).parent
COMMIT = sys.argv[1] if len(sys.argv) > 1 else ""
CDN = f"https://cdn.jsdelivr.net/gh/tfe896/ain_hata@{COMMIT}/mazda-landing/site/"
FONTS = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=swap" rel="stylesheet">'
# Клас mz-js ховає елементи до появи; якщо скрипт не завантажився за 5 с, клас знімається і сторінка лишається видимою.
GUARD = '<script>document.documentElement.classList.add("mz-js");setTimeout(function(){if(!window.__mazdaReady)document.documentElement.classList.remove("mz-js")},5000);</script>'

body = (HERE / "src/body.html").read_text(encoding="utf-8")

local_font = ""
if (HERE / "fonts/GT-Pressura-LC-Standard-Bold.woff2").exists():  # ліцензійний шрифт, у репозиторій не кладемо
    local_font = '<style>@font-face{font-family:"GT Pressura LC";src:url("fonts/GT-Pressura-LC-Standard-Bold.woff2") format("woff2");font-weight:700;font-display:swap}</style>'
index = f"""<!doctype html><html lang="uk"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>2500 кілометрів, 5 співпраць і 1 автомобіль: як Mazda CX-90 стала частиною експедиції «Співпраця»</title>
{FONTS}{local_font}<style>*{{box-sizing:border-box}}img{{max-width:100%}}</style><link rel="stylesheet" href="css/layout.css"><link rel="stylesheet" href="css/anim.css">{GUARD}</head>
<body>
{body.replace("{{A}}", "assets/")}
<script src="js/mazda.js"></script></body></html>
"""
(HERE / "index.html").write_text(index, encoding="utf-8")
print("index.html", len(index) // 1024, "KB")

if COMMIT:
    out = HERE / "webflow/out"
    out.mkdir(parents=True, exist_ok=True)
    for f in out.glob("*"):
        f.unlink()
    css = (HERE / "css/layout.css").read_text(encoding="utf-8")
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
    blocks = re.findall(r"<(header|section)\b.*?</\1>", body, flags=re.S)
    chunks = [m.group(0) for m in re.finditer(r"<(header|section)\b.*?</\1>", body, flags=re.S)]
    names = ["header", "hero", "intro", "space", "route", "handling", "team"]
    for i, html in enumerate(chunks):
        (out / f"{i:02d}-{names[i]}.html").write_text(html.replace("{{A}}", CDN + "assets/"), encoding="utf-8")
    (out / "layout.css").write_text(css.strip() + "\n", encoding="utf-8")
    # CSS кожної секції окремо (лише класи, які в ній уперше з'являються) — для вставки у Webflow разом із розміткою
    media = re.findall(r"(@media[^{]+)\{((?:[^{}]*\{[^{}]*\})+)\s*\}", css)
    base = re.sub(r"@media[^{]+\{(?:[^{}]*\{[^{}]*\})+\s*\}", "", css)
    rules = lambda txt: re.findall(r"(\.[\w-]+)\s*\{([^{}]*)\}", txt)
    one = lambda rs, use: " ".join("%s{%s}" % (sel, re.sub(r"\s+", " ", b).strip()) for sel, b in rs if sel[1:] in use)
    seen = set()
    for i, html in enumerate(chunks):
        cls = set(c for a in re.findall(r'class="([^"]+)"', html) for c in a.split())
        use = cls - seen
        seen |= cls
        parts = [one(rules(base), use)] + ["%s{%s}" % (m.strip(), one(rules(b), use)) for m, b in media if one(rules(b), use)]
        (out / f"{i:02d}-{names[i]}.css").write_text("\n".join(x for x in parts if x), encoding="utf-8")
        mini = re.sub(r">\s+<", "><", html.replace("{{A}}", CDN + "assets/")).strip()
        (out / f"{i:02d}-{names[i]}.min.html").write_text(mini, encoding="utf-8")
    (out / "head.html").write_text(f'{FONTS}\n<link rel="stylesheet" href="{CDN}css/anim.css">\n{GUARD}\n', encoding="utf-8")
    (out / "footer.html").write_text(f'<script src="{CDN}js/mazda.js"></script>\n', encoding="utf-8")
    print("webflow/out:", len(chunks), "секцій, коміт", COMMIT)
