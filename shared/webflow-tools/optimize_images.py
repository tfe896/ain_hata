#!/usr/bin/env python3
"""Стискає зображення під вимоги редакції AIN: до 100 КБ, без PNG (чекліст: shared/qa/CHECKLIST-special.md).

  python3 -I shared/webflow-tools/optimize_images.py <папка з оригіналами> <папка результату> [--limit-kb 95]

- логотипи (ім'я містить "logo") і файли з прозорістю: WebP без втрат (прозорість зберігається);
- решта фото й картки: WebP, якість підбирається спадом від 88, доки файл не вкладеться в ліміт;
- JPG/PNG/WebP на вході, WebP на виході (OG-картинку для соцмереж роблять JPG 1200×630: див. README «Відкрита картинка»).
Розмір у пікселях не міняється. Потім: create_asset + wfup.py, set_image_asset (див. shared/README.md).
"""
import argparse
import glob
import os

from PIL import Image


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("src")
    ap.add_argument("out")
    ap.add_argument("--limit-kb", type=int, default=95, help="ціль (за вимогою 100 КБ; 95 дає запас)")
    a = ap.parse_args()
    os.makedirs(a.out, exist_ok=True)
    limit = a.limit_kb * 1024
    for f in sorted(glob.glob(os.path.join(a.src, "*"))):
        try:
            im = Image.open(f)
        except OSError:
            continue
        name = os.path.splitext(os.path.basename(f))[0]
        out = os.path.join(a.out, name + ".webp")
        alpha = im.mode in ("RGBA", "LA") or "transparency" in im.info
        if "logo" in name or alpha:
            im.convert("RGBA").save(out, "WEBP", lossless=True, quality=100, method=6)
            note = "без втрат"
        else:
            for q in range(88, 40, -3):
                im.convert("RGB").save(out, "WEBP", quality=q, method=6)
                if os.path.getsize(out) <= limit:
                    break
            note = "якість %d" % q
        kb = os.path.getsize(out) / 1024
        print("%-32s %s %6.1f КБ (%s)%s" % (os.path.basename(out), im.size, kb, note, "  !!! більше 100 КБ" if kb > 100 else ""))


if __name__ == "__main__":
    main()
