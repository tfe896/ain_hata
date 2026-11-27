/* HTML-прев'ю сцени зі spec.js (для перевірки вигляду без Figma). Не входить у плагін. */
const FONT_CSS = {
  dm: { fam: "'Basis Grotesque Pro','Inter',sans-serif", w: 500 },
  dr: { fam: "'Basis Grotesque Pro','Inter',sans-serif", w: 400 },
  mono: { fam: "'JetBrains Mono','Roboto Mono',monospace", w: 500 },
  serif: { fam: "'Cormorant Garamond','Playfair Display',serif", w: 500, italic: true },
};
const rgba = (h, a) => {
  const n = parseInt(h.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a == null ? 1 : a})`;
};
function paintCss(p) {
  if (p.k === "solid") return `linear-gradient(${rgba(p.c, p.a)},${rgba(p.c, p.a)})`;
  const stops = p.stops.map((s) => `${rgba(s[1], s[2])} ${s[0] * 100}%`).join(",");
  if (p.k === "rad") return `radial-gradient(closest-side ellipse at 50% 50%, ${stops})`;
  return `linear-gradient(${p.dir === "h" ? "90deg" : "180deg"}, ${stops})`;
}
const px = (v) => v + "px";

function renderNode(n, parent) {
  const parentLayout = parent && parent.__layout;
  const el = document.createElement("div");
  el.dataset.name = n.n || n.t;
  const s = el.style;
  s.boxSizing = "border-box";
  if (!parentLayout) {
    s.position = "absolute";
    if (n.right != null) s.right = px(n.right);
    else s.left = px(n.cx != null ? n.cx : n.x || 0);
    s.top = px(n.cy != null ? n.cy : n.y || 0);
    const tf = [];
    if (n.ctr) tf.push("translate(-50%,-50%)");
    else if (n.cx != null) tf.push("translateX(-50%)");
    if (n.cy != null && !n.ctr) tf.push("translateY(-50%)");
    if (n.rot) tf.push(`rotate(${n.rot}deg)`);
    if (tf.length) s.transform = tf.join(" ");
  } else s.flex = "none";

  if (n.t === "text") {
    const f = FONT_CSS[n.f];
    s.fontFamily = f.fam; s.fontWeight = f.w; s.fontSize = px(n.sz); s.lineHeight = px(n.lh);
    s.letterSpacing = n.ls ? n.ls + "em" : "normal";
    if (f.italic) s.fontStyle = "italic";
    s.color = rgba(n.c, n.a); s.textAlign = { l: "left", c: "center", r: "right" }[n.al];
    if (n.caps) s.textTransform = "uppercase";
    s.whiteSpace = typeof n.w === "number" || n.w === "fill" ? "pre-wrap" : "pre";
    if (typeof n.w === "number") s.width = px(n.w);
    else if (n.w === "fill") s.alignSelf = "stretch";
    el.textContent = n.s;
    return el;
  }
  if (n.t === "svg") {
    s.width = px(n.w); s.height = px(n.h); el.innerHTML = n.svg;
    el.firstChild.style.display = "block";
    return el;
  }
  // frame / ellipse
  if (typeof n.w === "number") s.width = px(n.w); else s.width = "fit-content";
  if (typeof n.h === "number") s.height = px(n.h); else s.height = "fit-content";
  if (n.t === "ellipse") s.borderRadius = "50%";
  else if (Array.isArray(n.r)) s.borderRadius = n.r.map(px).join(" ");
  else if (n.r) s.borderRadius = px(n.r);
  if (n.fill) s.background = [].concat(n.fill).map(paintCss).reverse().join(",");
  const sh = (n.shadows || []).map((x) => `${x.inner ? "inset " : ""}${x.x || 0}px ${x.y || 0}px ${x.blur}px ${x.spread || 0}px ${rgba(x.c, x.a)}`);
  if (n.stroke) sh.push(`inset 0 0 0 ${n.stroke.w}px ${rgba(n.stroke.c, n.stroke.a)}`);
  if (sh.length) s.boxShadow = sh.join(",");
  if (n.blur) s.filter = `blur(${n.blur / 2}px)`;
  if (n.bgBlur) s.backdropFilter = s.webkitBackdropFilter = `blur(${n.bgBlur / 2}px)`;
  if (n.clip) s.overflow = "hidden";
  if (n.layout) {
    el.__layout = true;
    s.display = "flex"; s.flexDirection = n.layout === "H" ? "row" : "column";
    if (n.gap) s.gap = px(n.gap);
    if (n.pad) s.padding = n.pad.map(px).join(" ");
    if (n.align) s.alignItems = { start: "flex-start", center: "center", end: "flex-end" }[n.align];
    if (n.justify) s.justifyContent = { start: "flex-start", center: "center", end: "flex-end", between: "space-between" }[n.justify];
  }
  (n.ch || []).forEach((c) => el.appendChild(renderNode(c, el)));
  return el;
}
function mountScenes(host) {
  buildScenes().forEach((sc) => {
    const wrap = document.createElement("div");
    wrap.className = "scene";
    wrap.style.cssText = `position:relative;width:${sc.w}px;height:${sc.h}px;`;
    wrap.dataset.name = sc.n;
    sc.x = 0; sc.y = 0;
    wrap.appendChild(renderNode(sc, null));
    host.appendChild(wrap);
  });
}
