#!/usr/bin/env python3
"""Без втрат зменшує SVG-карту/контур: абсолютні шляхи M/L/H/V/Z переводить у відносні (точність до 0,001),
прибирає пробіли між тегами. Шляхи з кривими (C, S, Q, A) не чіпає. id елементів лишаються
(скрипт карти шукає їх за id). Потрібно, щоб файл вкладався в 100 КБ (чекліст редакції).

  python3 -I shared/webflow-tools/svg_compact.py <вхід.svg> <вихід.svg>

Mazda: map.svg 142 КБ → 90 КБ, вершини збігаються (відхилення ≤ 0,0005), рендер той самий.
Не використовуємо svgo: у середовищі npx-пакети запускати не можна, а цей скрипт без залежностей.
"""
import re
import sys


def fmt(t):
    """t — ціле в тисячних частках."""
    frac = ("%03d" % (abs(t) % 1000)).rstrip("0")
    whole = abs(t) // 1000
    return ("-" if t < 0 else "") + (str(whole) if whole else ("" if frac else "0")) + ("." + frac if frac else "")


def convert(d):
    toks = re.findall(r"[MLHVZ]|-?\d*\.?\d+", d)
    i = 0
    x = y = sx = sy = 0
    cmd = None
    first = True
    segs = []

    def num():
        nonlocal i
        v = int(round(float(toks[i]) * 1000))
        i += 1
        return v

    while i < len(toks):
        t = toks[i]
        if t in "MLHVZ":
            cmd = t
            i += 1
            if cmd == "Z":
                segs.append(("z", []))
                x, y = sx, sy
                continue
        if cmd == "M":
            nx, ny = num(), num()
            segs.append(("M", [nx, ny]) if first else ("m", [nx - x, ny - y]))
            first = False
            x, y = sx, sy = nx, ny
            cmd = "L"
        elif cmd == "L":
            nx, ny = num(), num()
            segs.append(("l", [nx - x, ny - y]))
            x, y = nx, ny
        elif cmd == "H":
            nx = num()
            segs.append(("h", [nx - x]))
            x = nx
        elif cmd == "V":
            ny = num()
            segs.append(("v", [ny - y]))
            y = ny
    merged = []
    for l, n in segs:
        if merged and merged[-1][0] == l and l in "lhv":
            merged[-1][1].extend(n)
        else:
            merged.append([l, list(n)])
    out = ""
    for l, n in merged:
        body = ""
        for v in n:
            s = fmt(v)
            if body and not s.startswith("-"):
                body += s if (s.startswith(".") and re.search(r"\.\d*$", body)) else " " + s
            else:
                body += s
        out += l + body
    return out


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    src = open(sys.argv[1], encoding="utf-8").read()

    def sub(m):
        d = m.group(2)
        return m.group(0) if re.search(r"[CcSsQqTtAa]", d) else m.group(1) + convert(d) + m.group(3)

    res = re.sub(r'(<path[^>]*?\bd=")([^"]*)(")', sub, src, flags=re.S)
    res = re.sub(r">\s+<", "><", res)
    open(sys.argv[2], "w", encoding="utf-8").write(res)
    print("%d -> %d байт" % (len(src), len(res)))


if __name__ == "__main__":
    main()
