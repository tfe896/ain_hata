#!/usr/bin/env python3
"""Читання Figma через REST API: структура файлу, коментарі з координатами, рендери вузлів.

Токен у репозиторії НЕ зберігається. У середовищі Claude Code він записаний як мережевий секрет для хоста
api.figma.com (його додає проксі автоматично), тож у середовищі змінна не потрібна. Поза ним: FIGMA_TOKEN=<токен>
(personal access token лише з правами читання: file_content:read, file_comments:read, file_metadata:read, current_user:read).

Команди (замість ключа можна вставити повне посилання на файл чи вузол Figma):
  python3 figma_read.py me                          хто я (перевірка доступу)
  python3 figma_read.py file <key|url> [depth]      сторінки й верхні фрейми (depth за замовчуванням 2)
  python3 figma_read.py comments <key|url> [--json out.json]
                                                    коментарі: автор, стан, сторінка/вузол, координати, текст
  python3 figma_read.py render <key|url> <id,id,..> [--scale 2] [--out dir]
                                                    рендери вузлів у PNG (id у вигляді 25:41)

Ліміт запитів Figma (429): скрипт чекає й повторює до 4 разів. Якщо 429 лишається, зачекати хвилину:
не робити пачки запитів поспіль.
Потрібні дозволені хости середовища: api.figma.com, figma-alpha-api.s3.us-west-2.amazonaws.com, s3-alpha-sig.figma.com.
"""
import json
import os
import pathlib
import re
import signal
import subprocess
import sys
import time
import urllib.parse

signal.signal(signal.SIGPIPE, signal.SIG_DFL)  # не падати, якщо вивід обрізають (| head)

API = "https://api.figma.com/v1"


def curl(url, out=None):
    cmd = ["curl", "-sS", "-m", "90", "-w", "\n%{http_code}"]
    tok = os.environ.get("FIGMA_TOKEN")
    if tok and "api.figma.com" in url:
        cmd += ["-H", "X-Figma-Token: " + tok]
    cmd.append(url)
    r = subprocess.run(cmd, capture_output=True)
    body, _, code = r.stdout.rpartition(b"\n")
    if out:
        pathlib.Path(out).write_bytes(body)
    return int(code or 0), body


def api(path, params=None):
    url = API + path + ("?" + urllib.parse.urlencode(params) if params else "")
    for attempt in range(4):
        code, body = curl(url)
        if code == 429:
            time.sleep(8 * (attempt + 1))
            continue
        try:
            data = json.loads(body)
        except ValueError:
            sys.exit("Figma повернув не JSON (HTTP %s): %s" % (code, body[:200]))
        if code >= 400 or (isinstance(data, dict) and data.get("error")):
            sys.exit("Figma: HTTP %s %s" % (code, data.get("err") or data.get("message")))
        return data
    sys.exit("Figma: ліміт запитів (429), зачекайте хвилину")


def key_of(s):
    m = re.search(r"figma\.com/(?:design|file|board|make)/([A-Za-z0-9]+)", s)
    return m.group(1) if m else s


def cmd_me(_):
    d = api("/me")
    print(d.get("handle"), "|", d.get("email"))


def cmd_file(a):
    depth = int(a[1]) if len(a) > 1 else 2
    d = api("/files/%s" % key_of(a[0]), {"depth": depth})
    print('"%s"  (оновлено %s)' % (d.get("name"), d.get("lastModified")))
    for page in d["document"]["children"]:
        print("PAGE", page["id"], page["name"])
        for n in page.get("children", []):
            print("   ", n["id"], n["type"], n["name"])


def cmd_comments(a):
    out = None
    if "--json" in a:
        out = a[a.index("--json") + 1]
    d = api("/files/%s/comments" % key_of(a[0]))
    if out:
        pathlib.Path(out).write_text(json.dumps(d, ensure_ascii=False, indent=1), encoding="utf-8")
    items = d.get("comments", [])
    print("коментарів:", len(items))
    for c in items:
        meta = c.get("client_meta") or {}
        where = meta.get("node_id") or ""
        xy = ""
        if "x" in meta:
            xy = " (%.0f, %.0f)" % (meta["x"], meta["y"])
        print("-", c["id"], "|", (c.get("user") or {}).get("handle"), "|",
              "розв'язано" if c.get("resolved_at") else "відкрито", "|", where + xy)
        print("   ", (c.get("message") or "").replace("\n", " "))


def cmd_render(a):
    ids = a[1]
    scale = a[a.index("--scale") + 1] if "--scale" in a else "2"
    out = pathlib.Path(a[a.index("--out") + 1] if "--out" in a else "figma-renders")
    out.mkdir(parents=True, exist_ok=True)
    d = api("/images/%s" % key_of(a[0]), {"ids": ids, "format": "png", "scale": scale})
    for nid, url in d.get("images", {}).items():
        if not url:
            print("немає рендера для", nid)
            continue
        f = out / (nid.replace(":", "-") + ".png")
        code, _ = curl(url, str(f))
        print(nid, "->", f, "HTTP", code)


COMMANDS = {"me": cmd_me, "file": cmd_file, "comments": cmd_comments, "render": cmd_render}

if __name__ == "__main__":
    if len(sys.argv) < 2 or sys.argv[1] not in COMMANDS:
        sys.exit(__doc__)
    COMMANDS[sys.argv[1]](sys.argv[2:])
