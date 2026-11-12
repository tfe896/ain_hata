#!/usr/bin/env python3
"""Спільний блок «титри + Читайте також + футер AIN» для всіх наших лендінгів.

У фінальній версії лендінгу змінюються ЛИШЕ статті для перелінковки: правимо cards.json
(посилання, заголовок, підзаголовок, партнер, тег, картинка 2:1 у assets/). Решта блоку
(титри, панель AIN, тексти й посилання футера) незмінна.

Запуск:  python3 build_footer.py   → out/footer.html, out/footer.css (для data_whtml_builder)
Далі: завантажити картинки й лого в Webflow Assets, вставити footer.html + footer.css в кінець
сторінки (parent = Body, append), set_image_asset для .ainf-card_img і .ainf-logo, target=_blank
на всі зовнішні посилання (вставка HTML target не зберігає), стилі hover/стрілок — у `anim.css`
проєкту (див. ain-footer.anim.css) і шрифт Montserrat 400/500/600 у head.
"""
import html as H
import json
import pathlib

D = pathlib.Path(__file__).resolve().parent


def esc(s):
    return H.escape(s, quote=False)


def main():
    cfg = json.loads((D / "cards.json").read_text(encoding="utf-8"))
    cards = ""
    for c in cfg["cards"]:
        cards += ('<a href="%s" target="_blank" rel="noopener" class="ainf-card" data-anim="reveal">'
                  '<div class="ainf-card_media"><img alt="%s" loading="lazy" class="ainf-card_img"></div>'
                  '<div class="ainf-card_meta"><div class="ainf-card_tag">%s</div><div class="ainf-card_partner">%s</div></div>'
                  '<div class="ainf-card_body"><div class="ainf-card_title">%s</div><div class="ainf-card_text">%s</div></div></a>'
                  % (c["url"], esc(c["alt"]), esc(c["tag"]), esc(c["partner"]), esc(c["title"]), esc(c["text"])))
    tpl = (D / "ain-footer.template.html").read_text(encoding="utf-8")
    out = (tpl.replace("{{CARDS}}", cards).replace("{{CREDIT_ROLE}}", cfg["credit_role"])
           .replace("{{CREDIT_NAME}}", cfg["credit_name"]))
    (D / "out").mkdir(exist_ok=True)
    (D / "out" / "footer.html").write_text(out, encoding="utf-8")
    (D / "out" / "footer.css").write_text((D / "ain-footer.css").read_text(encoding="utf-8"), encoding="utf-8")
    print("footer.html", len(out), "символів, карток:", len(cfg["cards"]))


if __name__ == "__main__":
    main()
