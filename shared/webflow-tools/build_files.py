#!/usr/bin/env python3
"""Збірка кодових файлів лендінгу для Webflow Assets (однакова для всіх клієнтів).

Вихід: два файли з версією в назві (як у команди AIN):
  <name>-style-<v>.js — head: клас-запобіжник, шрифти, мінімізовані стилі анімацій;
  <name>-anim-<v>.js  — кінець body: уся логіка (мінімізований js).
Далі: create_asset + wfup.py (завантаження), перевірка хешів з CDN, register_hosted_script з SRI,
set_page_scripts, Publish (див. shared/README.md).

Приклад (Mazda):
  python3 shared/webflow-tools/build_files.py --name mazda --prefix mz \\
      --title "Mazda x Spivpratsia" --src mazda-landing/site --version v5 \\
      --font "https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&family=Montserrat:wght@400;500;600&display=swap" \\
      --out mazda-landing/site/webflow/standalone

Запобіжник: на <html> ставиться клас <prefix>-js (стилі анімацій працюють лише під ним), а якщо
скрипт не запустився за 5 с, клас знімається і сторінка лишається повністю видимою.
Скрипт має виставляти window.__<name>Ready = true при старті.
"""
import argparse
import json
import pathlib
import re
import subprocess
import sys
import tempfile


def minify_js(src: str, prefix: str) -> str:
    # Необов'язково: якщо в джерелі є блок «чекати на anim.css» (старий варіант з jsDelivr), прибираємо його:
    # стилі вже в head, чекати немає на що.
    a = src.find("  /* Стилі анімацій мають бути завантажені")
    b = src.find("  whenCss(boot);")
    if a != -1 and b != -1:
        b += len("  whenCss(boot);")
        src = src[:a] + "  H.classList.remove(\"%s-wait\");\n  boot();" % prefix + src[b:]
    with tempfile.NamedTemporaryFile("w", suffix=".js", delete=False, encoding="utf-8") as f:
        f.write(src)
        tmp = f.name
    try:
        r = subprocess.run(["npx", "--yes", "terser", tmp, "-c", "-m", "--comments", "false", "--ascii"],
                           capture_output=True, text=True, check=True)
    finally:
        pathlib.Path(tmp).unlink()
    return r.stdout.strip()


def minify_css(src: str) -> str:
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"\s+", " ", src)
    src = re.sub(r"\s*([{};,>])\s*", r"\1", src)
    src = re.sub(r":\s+", ":", src)
    return src.replace(";}", "}").strip()


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--name", required=True, help="коротка назва проєкту для файлів і прапорця (mazda)")
    ap.add_argument("--prefix", required=True, help="префікс класів проєкту (mz): клас-запобіжник <prefix>-js")
    ap.add_argument("--title", default=None, help="назва проєкту для коментаря у файлах")
    ap.add_argument("--src", required=True, help="папка з js/*.js і css/anim.css (відносно кореня репозиторію)")
    ap.add_argument("--js", default=None, help="шлях до скрипта відносно --src (за замовчуванням js/<name>.js)")
    ap.add_argument("--css", default="css/anim.css", help="шлях до стилів відносно --src")
    ap.add_argument("--version", required=True, help="v1, v2 ...")
    ap.add_argument("--font", action="append", default=[], help="посилання на Google Fonts (можна кілька)")
    ap.add_argument("--out", required=True, help="куди писати файли")
    a = ap.parse_args()

    root = pathlib.Path(a.src)
    a.js = a.js or "js/%s.js" % a.name
    js = minify_js((root / a.js).read_text(encoding="utf-8"), a.prefix)
    css = minify_css((root / a.css).read_text(encoding="utf-8"))
    title = a.title or a.name
    # перший шрифт — у списку var (як у вже опублікованих файлах), решта — окремими вставками
    link = 'l.rel="stylesheet";l.href=%s;d.head.appendChild(l);'
    head_vars = "var d=document,h=d.documentElement"
    fonts = ""
    for i, u in enumerate(a.font):
        if i == 0:
            head_vars += ',l=d.createElement("link");'
            fonts += link % json.dumps(u)
        else:
            fonts += 'l=d.createElement("link");' + link % json.dumps(u)
    if not a.font:
        head_vars += ";"
    style = ("/* %s: styles + guard. Source: %s/%s */\n"
             "(function(){%s%sh.classList.add(\"%s-js\");"
             "setTimeout(function(){if(!window.__%sReady)h.classList.remove(\"%s-js\")},5000);"
             "var s=d.createElement(\"style\");s.textContent=%s;d.head.appendChild(s);})();\n"
             % (title, a.src, a.css, head_vars, fonts, a.prefix, a.name, a.prefix, json.dumps(css, ensure_ascii=True)))
    anim = "/* %s: animations. Source: %s/%s */\n%s\n" % (title, a.src, a.js, js)
    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    (out / ("%s-style-%s.js" % (a.name, a.version))).write_text(style, encoding="utf-8")
    (out / ("%s-anim-%s.js" % (a.name, a.version))).write_text(anim, encoding="utf-8")
    print("style", len(style), "anim", len(anim), "->", out)


if __name__ == "__main__":
    sys.exit(main())
