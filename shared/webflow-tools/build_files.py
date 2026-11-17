#!/usr/bin/env python3
"""Збірка кодових файлів лендінгу для Webflow Assets (однакова для всіх клієнтів).

Вихід: два файли з версією в назві (як у команди AIN):
  <name>-style-<v>.js — head: клас-запобіжник, шрифти, стилі анімацій;
  <name>-anim-<v>.js  — кінець body: уся логіка.

СТАНДАРТ: збирати з --readable. Тоді файли у Webflow лишаються читабельними (коментарі, блок
«НАЛАШТУВАННЯ» вгорі, відступи), і команда може завантажити файл з Assets, поправити руками й залити
як наступну версію. Без --readable код мінімізується (так зібрані старі версії Mazda v1–v4).
Далі: create_asset + wfup.py (завантаження), перевірка хешів з CDN, register_hosted_script з SRI,
set_page_scripts, Publish (див. shared/README.md).

Приклад (Mazda):
  python3 shared/webflow-tools/build_files.py --name mazda --prefix mz \\
      --title "Mazda x Spivpratsia" --src mazda-landing/site --version v6 --readable --lang uk \\
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


def readable_style(title, src, css_path, prefix, name, fonts, css, lang=None):
    """Файл стилів, який можна читати й правити руками: стилі лежать як звичайний CSS усередині `...`."""
    css = css.strip().replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")
    font_lines = "".join(
        "  var font%d = d.createElement(\"link\");\n  font%d.rel = \"stylesheet\";\n  font%d.href = %s;\n  d.head.appendChild(font%d);\n"
        % (i, i, i, json.dumps(u), i) for i, u in enumerate(fonts))
    lang_block = ("  // ===== МОВА СТОРІНКИ =====\n  // Webflow сам не виводить <html lang>, а чекліст редакції це вимагає (мова сторінки).\n"
                  "  // Для пошуковиків lang додатково ставлять у код сторінки при вивантаженні на special.ain.ua.\n  h.lang = %s;\n\n" % json.dumps(lang)) if lang else ""
    return ("""/* %(title)s: стилі анімацій + запобіжник (підключається в head).
   Джерело: %(src)s/%(css)s

   ЯК ПРАВИТИ РУКАМИ: нижче, між зворотними лапками `...`, лежить звичайний CSS. Міняйте його як у
   будь-якому файлі стилів (не можна лише ставити зворотну лапку ` всередині). Після правки файл
   заливається в Assets з наступною версією в назві (-v2, -v3…) і підключається замість старого. */
(function () {
  var d = document, h = d.documentElement;

  // ===== ШРИФТИ =====
%(fonts)s
%(lang)s  // ===== ЗАПОБІЖНИК =====
  // Клас %(prefix)s-js вмикає стилі анімацій. Якщо скрипт анімацій не запустився за 5 секунд,
  // клас знімається, і сторінка лишається повністю видимою.
  var GUARD_MS = 5000;
  h.classList.add("%(prefix)s-js");
  setTimeout(function () { if (!window.__%(name)sReady) h.classList.remove("%(prefix)s-js"); }, GUARD_MS);

  // ===== СТИЛІ =====
  var CSS = `
%(body)s
`;
  var s = d.createElement("style");
  s.textContent = CSS;
  d.head.appendChild(s);
})();
""" % {"title": title, "src": src, "css": css_path, "prefix": prefix, "name": name, "fonts": font_lines, "lang": lang_block, "body": css})


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
    ap.add_argument("--lang", default=None, help="код мови сторінки (uk, en, ru, pl): ставить <html lang> зі стилів у head (лише з --readable)")
    ap.add_argument("--readable", action="store_true",
                    help="не мінімізувати: файли з коментарями й блоком налаштувань, які можна правити руками (стандарт)")
    a = ap.parse_args()

    root = pathlib.Path(a.src)
    a.js = a.js or "js/%s.js" % a.name
    title = a.title or a.name
    out = pathlib.Path(a.out)
    out.mkdir(parents=True, exist_ok=True)
    if a.readable:
        style = readable_style(title, a.src, a.css, a.prefix, a.name, a.font, (root / a.css).read_text(encoding="utf-8"), a.lang)
        anim = (root / a.js).read_text(encoding="utf-8")
        (out / ("%s-style-%s.js" % (a.name, a.version))).write_text(style, encoding="utf-8")
        (out / ("%s-anim-%s.js" % (a.name, a.version))).write_text(anim, encoding="utf-8")
        print("readable: style", len(style), "anim", len(anim), "->", out)
        return
    js = minify_js((root / a.js).read_text(encoding="utf-8"), a.prefix)
    css = minify_css((root / a.css).read_text(encoding="utf-8"))
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
    (out / ("%s-style-%s.js" % (a.name, a.version))).write_text(style, encoding="utf-8")
    (out / ("%s-anim-%s.js" % (a.name, a.version))).write_text(anim, encoding="utf-8")
    print("style", len(style), "anim", len(anim), "->", out)


if __name__ == "__main__":
    sys.exit(main())
