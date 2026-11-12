#!/usr/bin/env python3
"""Автономна версія: увесь код анімацій живе всередині Webflow (без GitHub/jsDelivr).

Webflow API не дає записати вільний кастомний код, а зареєстрований inline-скрипт обмежений
2000 символами. Тому код мінімізуємо й ріжемо на шматки: кожен шматок — окремий скрипт, що
дописує свою частину в масив, а останній збирає частини докупи й запускає.

Запуск:  python3 webflow/build_standalone.py   → webflow/standalone/*.js, manifest.json
"""
import json
import pathlib
import re
import subprocess
import sys

SITE = pathlib.Path(__file__).resolve().parent.parent
OUT = SITE / "webflow" / "standalone"
LIMIT = 1900  # запас до ліміту Webflow (2000)


def minify_js(src: str) -> str:
    # стартові умови: стилі вже в <head> (їх додає завантажувач), чекати на anim.css не треба
    a = src.index("  /* Стилі анімацій мають бути завантажені")
    b = src.index("  whenCss(boot);") + len("  whenCss(boot);")
    src = src[:a] + "  H.classList.remove(\"mz-wait\");\n  boot();" + src[b:]
    tmp = OUT / "_src.js"
    tmp.write_text(src, encoding="utf-8")
    r = subprocess.run(
        ["npx", "--yes", "terser", str(tmp), "-c", "-m", "--comments", "false", "--ascii"],
        capture_output=True, text=True, check=True)
    tmp.unlink()
    return r.stdout.strip()


def minify_css(src: str) -> str:
    src = re.sub(r"/\*.*?\*/", "", src, flags=re.S)
    src = re.sub(r"\s+", " ", src)
    src = re.sub(r"\s*([{};,>])\s*", r"\1", src)
    src = re.sub(r":\s+", ":", src)
    return src.replace(";}", "}").strip()


def chunks(text: str, var: str):
    """Ріжемо так, щоб JSON-рядок разом з обгорткою вкладався в LIMIT."""
    out, i = [], 0
    while i < len(text):
        n = 1400
        while True:
            piece = text[i:i + n]
            code = '(window.%s=window.%s||[]).push(%s);' % (var, var, json.dumps(piece, ensure_ascii=True))
            if len(code) <= LIMIT or n < 100:
                break
            n -= 50
        out.append(code)
        i += len(piece)
    return out


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    for f in OUT.glob("*.js"):
        f.unlink()
    js = minify_js((SITE / "js" / "mazda.js").read_text(encoding="utf-8"))
    css = minify_css((SITE / "css" / "anim.css").read_text(encoding="utf-8"))

    scripts = []  # (name, location, code)
    # 1) head: шрифт Inter Tight, клас-запобіжник, шматки стилів
    head = ('var d=document,h=d.documentElement,l=d.createElement("link");l.rel="stylesheet";'
            'l.href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@500;600;700;800&display=swap";'
            'd.head.appendChild(l);h.classList.add("mz-js");'
            'setTimeout(function(){if(!window.__mazdaReady)h.classList.remove("mz-js")},5000);')
    scripts.append(("mz_a_boot", "header", head))
    for i, c in enumerate(chunks(css, "__mzCss")):
        scripts.append(("mz_b_css%02d" % (i + 1), "header", c))
    # збірку <style> дописуємо в останній шматок: у Webflow максимум 15 скриптів у блоці
    n, loc, code = scripts[-1]
    scripts[-1] = (n, loc, code + 'var s=document.createElement("style");s.textContent=window.__mzCss.join("");'
                                  'document.head.appendChild(s);')
    # 2) footer: шматки коду й запуск
    for i, c in enumerate(chunks(js, "__mzJs")):
        scripts.append(("mz_d_js%02d" % (i + 1), "footer", c))
    scripts.append(("mz_e_run", "footer", 'new Function(window.__mzJs.join(""))();'))

    manifest = []
    for name, loc, code in scripts:
        assert len(scripts) <= 15 and len(code) <= 2000, (name, len(code))
        (OUT / (name + ".js")).write_text(code, encoding="utf-8")
        manifest.append({"name": name, "location": loc, "chars": len(code)})
    (OUT / "manifest.json").write_text(json.dumps(manifest, indent=1), encoding="utf-8")
    print("js", len(js), "css", len(css), "скриптів", len(scripts))


if __name__ == "__main__":
    sys.exit(main())
