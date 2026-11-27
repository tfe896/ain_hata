/* Figma-рендерер сцени зі spec.js. Запускається як плагін у Figma Desktop. */
const NOTES = [];
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const rgbaF = (h, a) => Object.assign(hex(h), { a: a == null ? 1 : a });

/* ---------- шрифти ---------- */
const FONT_WANT = {
  dm: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Medium", "Regular"], fb: { family: "Inter", style: "Medium" } },
  dr: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Regular", "Medium"], fb: { family: "Inter", style: "Regular" } },
};
const FONTS = {};
async function loadFonts() {
  const all = await figma.listAvailableFontsAsync();
  for (const role of Object.keys(FONT_WANT)) {
    const w = FONT_WANT[role];
    let found = null;
    for (const fam of w.families) {
      for (const st of w.styles) {
        if (!found && all.some((x) => x.fontName.family === fam && x.fontName.style === st)) found = { family: fam, style: st };
      }
    }
    if (!found) {
      found = w.fb;
      NOTES.push("Шрифт для «" + role + "» (" + w.families[0] + ") не знайдено, підставлено Inter.");
    }
    await figma.loadFontAsync(found);
    FONTS[role] = found;
  }
}

/* ---------- фарби й ефекти ---------- */
function paintFrom(p) {
  if (p.k === "solid") return { type: "SOLID", color: hex(p.c), opacity: p.a == null ? 1 : p.a };
  const stops = p.stops.map((s) => ({ position: s[0], color: rgbaF(s[1], s[2]) }));
  if (p.k === "rad") return { type: "GRADIENT_RADIAL", gradientTransform: [[1, 0, 0], [0, 1, 0]], gradientStops: stops };
  const T = p.dir === "h" ? [[1, 0, 0], [0, 1, 0]] : [[0, 1, 0], [-1, 0, 1]];
  return { type: "GRADIENT_LINEAR", gradientTransform: T, gradientStops: stops };
}
function effectsFrom(n) {
  const out = [];
  (n.shadows || []).forEach((s) =>
    out.push({
      type: s.inner ? "INNER_SHADOW" : "DROP_SHADOW",
      color: rgbaF(s.c, s.a), offset: { x: s.x || 0, y: s.y || 0 }, radius: s.blur, spread: s.spread || 0,
      visible: true, blendMode: "NORMAL",
    })
  );
  if (n.blur) out.push({ type: "LAYER_BLUR", radius: n.blur, visible: true });
  if (n.bgBlur) out.push({ type: "BACKGROUND_BLUR", radius: n.bgBlur, visible: true });
  return out;
}
function applyShape(node, n) {
  node.fills = n.fill ? [].concat(n.fill).map(paintFrom) : [];
  if (n.stroke) {
    node.strokes = [{ type: "SOLID", color: hex(n.stroke.c), opacity: n.stroke.a == null ? 1 : n.stroke.a }];
    node.strokeWeight = n.stroke.w;
    node.strokeAlign = "INSIDE";
  }
  const fx = effectsFrom(n);
  if (fx.length) node.effects = fx;
}
function applyRadius(node, r) {
  if (Array.isArray(r)) {
    node.topLeftRadius = r[0]; node.topRightRadius = r[1]; node.bottomRightRadius = r[2]; node.bottomLeftRadius = r[3];
  } else if (r) {
    node.cornerRadius = r;
    if (r >= 40 && r < 500) node.cornerSmoothing = 0.6;
  }
}

/* ---------- вузли ---------- */
const AL = { start: "MIN", center: "CENTER", end: "MAX", between: "SPACE_BETWEEN" };
function makeText(n) {
  const t = figma.createText();
  t.name = n.n || n.s.slice(0, 24);
  t.fontName = FONTS[n.f];
  t.characters = n.s;
  t.fontSize = n.sz;
  t.lineHeight = { unit: "PIXELS", value: n.lh };
  t.letterSpacing = { unit: "PERCENT", value: Math.round((n.ls || 0) * 1000) / 10 };
  if (n.caps) t.textCase = "UPPER";
  t.textAlignHorizontal = { l: "LEFT", c: "CENTER", r: "RIGHT" }[n.al || "l"];
  t.fills = [{ type: "SOLID", color: hex(n.c), opacity: n.a == null ? 1 : n.a }];
  if (typeof n.w === "number") {
    t.resize(n.w, t.height);
    t.textAutoResize = "HEIGHT";
  }
  return t;
}
/* позиція вузла: x/y, right, cx (центр по горизонталі), ctr (x,y — центр), rot (поворот за годинниковою, навколо центру) */
function place(node, n, parent) {
  const w = node.width, h = node.height;
  let x = n.x || 0, y = n.y || 0;
  if (n.right != null) x = parent.width - n.right - w;
  else if (n.cx != null) x = n.cx - w / 2;
  if (n.cy != null) y = n.cy - h / 2;
  if (n.ctr) { x = n.x - w / 2; y = n.y - h / 2; }
  node.x = x;
  node.y = y;
  if (n.rot) {
    const t = (n.rot * Math.PI) / 180, a = Math.cos(t), b = -Math.sin(t), c = Math.sin(t), d = Math.cos(t);
    const mx = x + w / 2, my = y + h / 2;
    node.relativeTransform = [[a, b, mx - (a * w / 2 + b * h / 2)], [c, d, my - (c * w / 2 + d * h / 2)]];
  }
}
function build(n, parent, parentIsLayout) {
  let node;
  if (n.t === "text") {
    node = makeText(n);
    parent.appendChild(node);
    if (n.w === "fill") {
      node.textAutoResize = "HEIGHT";
      node.layoutSizingHorizontal = "FILL";
    }
  } else if (n.t === "svg") {
    node = figma.createNodeFromSvg(n.svg);
    node.name = n.n || "icon";
    node.resize(n.w, n.h);
    parent.appendChild(node);
  } else if (n.t === "ellipse") {
    node = figma.createEllipse();
    node.name = n.n || "ellipse";
    node.resize(n.w, n.h);
    applyShape(node, n);
    parent.appendChild(node);
  } else {
    node = figma.createFrame();
    node.name = n.n || "frame";
    node.resize(typeof n.w === "number" ? n.w : 100, typeof n.h === "number" ? n.h : 100);
    applyShape(node, n);
    applyRadius(node, n.r);
    node.clipsContent = !!n.clip;
    if (n.layout) {
      node.layoutMode = n.layout === "H" ? "HORIZONTAL" : "VERTICAL";
      node.itemSpacing = n.gap || 0;
      const pd = n.pad || [0, 0, 0, 0];
      node.paddingTop = pd[0]; node.paddingRight = pd[1]; node.paddingBottom = pd[2]; node.paddingLeft = pd[3];
      const hugW = n.w === "hug", hugH = n.h === "hug";
      const horiz = n.layout === "H";
      node.primaryAxisSizingMode = (horiz ? hugW : hugH) ? "AUTO" : "FIXED";
      node.counterAxisSizingMode = (horiz ? hugH : hugW) ? "AUTO" : "FIXED";
      node.counterAxisAlignItems = AL[n.align || "start"];
      node.primaryAxisAlignItems = AL[n.justify || "start"];
    }
    parent.appendChild(node);
    (n.ch || []).forEach((c) => build(c, node, !!n.layout));
  }
  if (!parentIsLayout) place(node, n, parent);
  return node;
}

/* ---------- запуск ---------- */
async function main() {
  try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); } catch (e) {}
  await loadFonts();
  const scenes = buildScenes();
  let startX = 0;
  figma.currentPage.children.forEach((c) => { startX = Math.max(startX, c.x + c.width + 200); });
  const made = [];
  scenes.forEach((sc) => {
    const root = build(Object.assign({}, sc, { x: startX, y: 0 }), figma.currentPage, false);
    startX += root.width + 200;
    made.push(root);
  });
  figma.currentPage.selection = made;
  figma.viewport.scrollAndZoomIntoView(made);
  return "Готово: " + made.length + " макет(ів). " + NOTES.join(" ");
}
main().then((m) => figma.closePlugin(m)).catch((e) => figma.closePlugin("Помилка: " + (e && e.message ? e.message : e)));
