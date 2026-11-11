"""Prepares the native Webflow build of the landing.

Input:  webflow/native-body.html (plain markup from webflow/mknative.js) and css/style.css.
Output: webflow/out/<n>-<name>.html + .css, one pair per top-level block, ready for Webflow's HTML/CSS import
        (class names stay the same as on the landing; images point at the repo via jsDelivr and carry a data-fallback).

The CSS mirrors css/style.css for the Designer view only: Webflow styles are class based, so rules on descendant selectors
that matter for the look are mapped onto helper classes (see DESC), CSS variables are resolved, and media queries are
moved onto Webflow's breakpoints. On the published page the original css/style.css is loaded as well.
"""
import json, pathlib, re, sys

HERE = pathlib.Path(__file__).parent
ROOT = HERE.parent
COMMIT = sys.argv[1] if len(sys.argv) > 1 else "main"
CDN = f"https://cdn.jsdelivr.net/gh/tfe896/ain_hata@{COMMIT}/godlike-landing/"

css = (ROOT / "css/style.css").read_text()
body = (HERE / "native-body.html").read_text()

# ---------- CSS variables ----------
root_vars = dict(re.findall(r"--([\w-]+):\s*([^;]+);", re.search(r":root\s*\{([^}]*)\}", css).group(1)))
root_vars["gut"] = "clamp(20px, 4vw, 56px)"


def resolve(v, depth=0):
    def rep(m):
        name, fb = m.group(1), m.group(2)
        if name in root_vars:
            return resolve(root_vars[name], depth + 1)
        return fb.strip() if fb else "__RUNTIME__"

    v = re.sub(r"var\(--([\w-]+)\s*(?:,\s*([^()]*(?:\([^()]*\))?[^()]*))?\)", rep, v)
    v = re.sub(r"max\(\s*clamp\(20px, 4vw, 56px\)\s*,\s*env\([^)]*\)\)", "clamp(20px, 4vw, 56px)", v)
    v = re.sub(r"calc\(\s*22px \+ env\([^)]*\)\)", "22px", v)
    return v


# ---------- descendant selectors that matter in the Designer -> helper classes ----------
DESC = {
    ".hero h1": "hero-title",
    ".hero .sub": "sub",
    ".hero .wrap": "hero-wrap",
    ".hero .inner": "hero-inner",
    ".hero .veil": "veil",
    ".stat .num": "stat-num",
    ".card .p": "card-p",
    ".points .card": "point",
    ".points h3": "point-title",
    ".points .num": "point-num",
    ".points .p": "point-p",
    ".igor .pic": "pic",
    ".igor .pic .tag": "tag",
    ".igor .pic .tag b": "tag-name",
    ".igor .pic .tag span": "tag-role",
    ".igor .qm": "qm",
    ".igor .big-q": "big-q",
    ".quote .q": "quote-q",
    ".center .fig": "fig-center",
    ".split.rev .fig": "fig-first",
    ".split .fig,   .split.rev .fig": "fig-split",
    ".end .brand": "brand-end",
    ".marq span": "marq-item",
    ".marq .track": "track",
    ".fig .fig-poster": "fig-poster",
    ".ph > img": "ph-img",
    ".igor .pic > img": "pic-img",
    ".split > .col": "col",
}
# runtime-only or state rules are left to the published stylesheet
SKIP_PROPS = {"transition", "transition-delay", "will-change", "transform-style", "text-wrap", "touch-action",
              "-webkit-tap-highlight-color", "user-select", "-webkit-user-select", "-webkit-touch-callout",
              "pointer-events", "-webkit-text-size-adjust", "text-rendering", "-webkit-font-smoothing", "all",
              "content", "contain", "font-variant-numeric", "-webkit-text-stroke"}
BP = {"1100": "991", "900": "991", "560": "479"}


def parse(block):
    """yield (media, selector, decls) for a CSS text with one level of @media"""
    i = 0
    out = []
    while i < len(block):
        m = re.compile(r"\s*(/\*.*?\*/)?\s*").match(block, i)
        i = m.end()
        if i >= len(block):
            break
        if block.startswith("@media", i):
            j = block.index("{", i)
            cond = block[i:j]
            depth, k = 1, j + 1
            while depth:
                depth += {"{": 1, "}": -1}.get(block[k], 0)
                k += 1
            for _, s, d in parse(block[j + 1 : k - 1]):
                out.append((cond, s, d))
            i = k
            continue
        if block.startswith("@", i):
            j = block.index("{", i)
            depth, k = 1, j + 1
            while depth:
                depth += {"{": 1, "}": -1}.get(block[k], 0)
                k += 1
            i = k
            continue
        j = block.index("{", i)
        k = block.index("}", j)
        out.append(("", re.sub(r"/\*.*?\*/", "", block[i:j], flags=re.S).strip(), block[j + 1 : k]))
        i = k + 1
    return out


rules = []  # (bp or None, class selector, [(prop, value)])
for media, sel, decls in parse(css):
    bp = None
    if media:
        m = re.search(r"max-width:\s*(\d+)px", media)
        if not m or m.group(1) not in BP:
            continue
        bp = BP[m.group(1)]
    sel = re.sub(r"\s+", " ", sel)
    targets = []
    key = re.sub(r"\s*,\s*", ",   ", sel) if sel.count(",") else sel
    if key in DESC:
        targets = ["." + DESC[key]]
    else:
        for part in [p.strip() for p in sel.split(",")]:
            if part in DESC:
                targets.append("." + DESC[part])
            elif re.fullmatch(r"(\.[\w-]+)+", part):
                targets.append(part)
    if not targets:
        continue
    props = []
    for d in re.split(r";(?![^(]*\))", decls):
        if ":" not in d:
            continue
        p, v = d.split(":", 1)
        p, v = p.strip(), " ".join(v.split())
        if p.startswith("--") or p in SKIP_PROPS:
            continue
        v = resolve(v)
        if "__RUNTIME__" in v or "env(" in v or "svh" in v:
            continue
        if p == "padding-block":
            a = re.findall(r"(?:[^\s(]+(?:\([^()]*\))?)+", v)
            props += [("padding-top", a[0]), ("padding-bottom", a[-1])]
            continue
        if p == "border-block":
            props += [("border-top", v), ("border-bottom", v)]
            continue
        if p == "inset":
            a = re.findall(r"(?:[^\s(]+(?:\([^()]*\))?)+", v)
            a = (a * 4)[:4] if len(a) == 1 else a
            props += [("top", a[0]), ("right", a[1]), ("bottom", a[2 % len(a)]), ("left", a[-1])]
            continue
        props.append((p, v))
    if props:
        for t in targets:
            rules.append((bp, t, props))


SEEN = set()


def css_for(classes):
    """CSS for the rules of the classes used in a fragment; a class's rules are sent once (Webflow keeps the style)"""
    base, med = [], {}
    for bp, sel, props in rules:
        cls = re.findall(r"\.([\w-]+)", sel)
        if not all(c in classes for c in cls) or all(c in SEEN for c in cls):
            continue
        txt = sel + "{" + ";".join(f"{p}:{v}" for p, v in props) + "}"
        (med.setdefault(bp, []) if bp else base).append(txt)
    out = "\n".join(base)
    for bp in ("991", "767", "479"):
        if bp in med:
            out += f"\n@media screen and (max-width: {bp}px){{" + "".join(med[bp]) + "}"
    return out


# ---------- HTML: helper classes, images via CDN with fallback ----------
def add_class(m, cls):
    tag = m.group(0)
    if 'class="' in tag:
        return re.sub(r'class="([^"]*)"', lambda x: f'class="{x.group(1)} {cls}"', tag, count=1)
    return tag[:-1] + f' class="{cls}">'


def helper_classes(html):
    # simple context-aware tagging with a tiny DOM walk
    from html.parser import HTMLParser

    VOID = {"img", "br", "hr", "input", "meta", "link", "source"}
    out, stack = [], []

    class P(HTMLParser):
        def handle_starttag(self, tag, attrs):
            a = dict(attrs)
            cls = (a.get("class") or "").split()
            ctx = [(t, c) for t, c in stack]
            anc = lambda c: any(c in cc for _, cc in ctx)
            par = ctx[-1][1] if ctx else []
            add = []
            if tag == "h1" and anc("hero"):
                add.append("hero-title")
            if "wrap" in cls and anc("hero"):
                add.append("hero-wrap")
            if "inner" in cls and anc("hero"):
                add.append("hero-inner")
            if "num" in cls and "stat" in par:
                add.append("stat-num")
            if "p" in cls and "card" in par and not anc("points"):
                add.append("card-p")
            if "card" in cls and "points" in par:
                add.append("point")
            if tag == "h3" and anc("points"):
                add.append("point-title")
            if "num" in cls and anc("points"):
                add.append("point-num")
            if "p" in cls and anc("points"):
                add.append("point-p")
            if "q" in cls and "quote" in [c for _, cc in ctx[-2:] for c in cc]:
                add.append("quote-q")
            if "fig" in cls or "data-scene" in a:
                if anc("center"):
                    add.append("fig-center")
                if "split" in par:
                    add.append("fig-split")
                    if "rev" in par:
                        add.append("fig-first")
            if "brand" in cls and anc("end"):
                add.append("brand-end")
            if tag == "b" and "tag" in par:
                add.append("tag-name")
            if tag == "span" and "tag" in par:
                add.append("tag-role")
            if tag == "img":
                if "ph" in par:
                    add.append("ph-img")
                if "pic" in par:
                    add.append("pic-img")
                if "brand" in par:
                    add.append("brand-ain" if "ain" in (a.get("src") or "") else "brand-gl")
                src = a.get("src") or ""
                if src.startswith("assets/"):
                    a["src"] = CDN + src
                    a["data-fallback"] = CDN + src
            if add:
                a["class"] = " ".join(cls + [x for x in add if x not in cls])
            s = "<" + tag + "".join(f' {k}="{v}"' if v is not None else f" {k}" for k, v in a.items()) + ">"
            out.append(s)
            if tag not in VOID:
                stack.append((tag, (a.get("class") or "").split()))

        def handle_endtag(self, tag):
            if tag in VOID:
                return
            while stack:
                t, _ = stack.pop()
                if t == tag:
                    break
            out.append(f"</{tag}>")

        def handle_data(self, data):
            out.append(data.replace("&", "&amp;").replace("<", "&lt;"))

        def handle_entityref(self, name):
            out.append(f"&{name};")

        def handle_charref(self, name):
            out.append(f"&#{name};")

    P(convert_charrefs=True).feed(html)
    return "".join(out)


html = helper_classes(body)
html = re.sub(r">\s*\n\s*<", "><", html)  # formatting only; a space between two inline spans is text
while re.search(r'(<span class="gt">[^<]*)</span> <span class="gt">', html):
    html = re.sub(r'(<span class="gt">[^<]*)</span> <span class="gt">', r"\1 ", html)
html = re.sub(r"\s{2,}", " ", html)
# the brand divider <i> becomes a div (Webflow has no <i> block)
html = html.replace("<i></i>", '<div class="brand-div"></div>')

# split: header, then each top-level child of <main>
hm = re.match(r"(<header.*?</header>)(<main[^>]*>)(.*)</main>$", html.strip(), re.S)
header, main_open, inner = hm.group(1), hm.group(2), hm.group(3)
parts, depth, start, i = [], 0, 0, 0
for m in re.finditer(r"<(/?)(section|div)\b[^>]*>", inner):
    if m.group(1):
        depth -= 1
        if depth == 0:
            parts.append(inner[start : m.end()])
    else:
        if depth == 0:
            start = m.start()
        depth += 1

outdir = HERE / "out"
outdir.mkdir(exist_ok=True)
for f in outdir.glob("*"):
    f.unlink()
extra = {
    ".brand-ain": "height:clamp(22px, 2.2vw, 30px);width:auto",
    ".brand-gl": "height:clamp(28px, 2.7vw, 38px);width:auto",
    ".brand-div": "width:1.5px;height:28px;background-color:#ffffff;opacity:0.3",
    ".stack": "position:relative;background-color:#04070a;color:#ffffff;font-family:G, 'Helvetica Neue', Arial, sans-serif;font-weight:500;overflow:hidden",
}
blocks = [("header", header)] + [(re.search(r'(?:id|class)="([^"]+)"', p).group(1).split()[0], p) for p in parts]
manifest = []
for n, (name, frag) in enumerate(blocks):
    classes = set(c for cl in re.findall(r'class="([^"]*)"', frag) for c in cl.split())
    c = css_for(classes)
    for sel, decl in extra.items():
        if sel[1:] in classes and sel[1:] not in SEEN:
            c += f"\n{sel}{{{decl}}}"
    if name == "header":
        c += "\n@media screen and (max-width: 479px){.brand-div{display:none}.brand-ain{height:20px}.brand-gl{height:24px}}"
    # marquee items are rebuilt by the adapter on the published page; in the Designer show them as light text
    c = re.sub(r"(\.marq-item\{[^}]*)color:transparent", r"\1color:rgba(255,255,255,0.6)", c)
    if "brand-end" in classes:
        c += "\n.brand-end .brand-ain{height:44px}"
    SEEN.update(classes)
    stem = f"{n:02d}-{name}"
    (outdir / f"{stem}.html").write_text(frag)
    (outdir / f"{stem}.css").write_text(c)
    manifest.append({"file": stem, "html": len(frag), "css": len(c)})
(outdir / "main-open.txt").write_text(main_open)
print(json.dumps(manifest, indent=0))
