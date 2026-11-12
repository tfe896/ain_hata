#!/usr/bin/env python3
"""Створює папку нового клієнта зі стандартної структури (shared/client-template/).

  python3 shared/new_client.py <name> <prefix> "<Назва проєкту>"
  python3 shared/new_client.py kredo kr "Kredo × Співпраця"   → kredo-landing/

<name> — коротка латиниця (файли, прапорець __<name>Ready), <prefix> — префікс класів Webflow (2–3 літери),
унікальний на сайті (mz — Mazda, gl — Godlike). Змінна CLIENT_PARENT задає батьківську папку
(за замовчуванням корінь репозиторію).
"""
import os
import pathlib
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
TPL = ROOT / "shared" / "client-template"


def main():
    if len(sys.argv) != 4:
        sys.exit(__doc__)
    name, prefix, title = sys.argv[1:]
    dest = pathlib.Path(os.environ.get("CLIENT_PARENT", str(ROOT))) / (name + "-landing")
    if dest.exists():
        sys.exit("Папка вже існує: %s" % dest)
    for src in sorted(TPL.rglob("*")):
        if src.is_dir():
            continue
        rel = str(src.relative_to(TPL)).replace("{{NAME}}", name)
        out = dest / rel
        out.parent.mkdir(parents=True, exist_ok=True)
        text = src.read_text(encoding="utf-8").replace("{{NAME}}", name).replace("{{PREFIX}}", prefix).replace("{{TITLE}}", title)
        out.write_text(text, encoding="utf-8")
    print("Створено", dest)
    print("Далі: мудборд/макет у Figma → збірка у Webflow → анімації; див. кореневий CLAUDE.md.")


if __name__ == "__main__":
    main()
