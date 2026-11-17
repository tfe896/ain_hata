#!/usr/bin/env python3
"""Друкує готовий код для head і body спешала за чеклістом редакції: canonical, robots, GTM.

  python3 -I shared/webflow-tools/head_snippet.py https://special.ain.ua/<url-спешала>/

Навіщо: Webflow API не вміє писати довільний код у head сторінки (set_page_freeform_code → 404,
перевірено 17.11.2026), тому ці теги вставляє людина в Webflow Designer:
  Page settings (сторінка) → Custom code → Head code   ← блок HEAD
  Page settings → Custom code → Before </body>          ← нічого (noscript GTM має йти одразу після <body>,
                                                          це робить експорт/приймальник, див. нижче)
Кожен тег на окремому рядку (вимога редакції: код має читатися по рядках).
lang ставиться окремо: його вже виставляє стильовий файл (build_files.py --lang) і він має бути в <html lang>
у кінцевій збірці на special.ain.ua.
"""
import sys

GTM = "GTM-K4F6Q5PN"  # контейнер special.ain.ua, аркуш «код гугл тег менеджера» чекліста редакції


def main():
    if len(sys.argv) != 2 or not sys.argv[1].startswith("https://special.ain.ua/"):
        sys.exit(__doc__)
    url = sys.argv[1]
    if not url.endswith("/"):
        url += "/"  # чекліст: canonical самоканонічний, зі слешем в кінці
    print("<!-- ===== HEAD: Page settings → Custom code → Head code ===== -->")
    print('<link rel="canonical" href="%s">' % url)
    print('<meta name="robots" content="index,follow">')
    print("<!-- Google Tag Manager -->")
    print("<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':")
    print("new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],")
    print("j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=")
    print("'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);")
    print("})(window,document,'script','dataLayer','%s');</script>" % GTM)
    print("<!-- End Google Tag Manager -->")
    print()
    print("<!-- ===== BODY: одразу після відкриття <body> (при експорті на special.ain.ua) ===== -->")
    print("<!-- Google Tag Manager (noscript) -->")
    print('<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=%s"' % GTM)
    print('height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>')
    print("<!-- End Google Tag Manager (noscript) -->")


if __name__ == "__main__":
    main()
