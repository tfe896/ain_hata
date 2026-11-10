/* Godlike × AIN — builds the Webflow-ready design concept of the landing in the current Figma file.
   Run: Figma Desktop → Plugins → Development → Import plugin from manifest… → pick figma-plugin/manifest.json → Run.
   Generated file: content and images are embedded by figma-plugin/build.py. Edit src/code.src.js, not code.js. */
const C = __CONTENT__;
const A = __ASSETS__;

const LOG = [];
const warn = (m) => LOG.push(m);

/* ---------------- tokens ---------------- */
const COL = {
  bg: "#04070a",
  bg2: "#0a1114",
  fg: "#ffffff",
  mute: "#a9b3b5",
  soft: "#d4dcde",
  lime: "#b1ff00",
  cyan: "#13f2dc",
  green: "#62f96e",
  hero: "#020406",
  menu: "#030608",
};
const hex = (h) => ({
  r: parseInt(h.slice(1, 3), 16) / 255,
  g: parseInt(h.slice(3, 5), 16) / 255,
  b: parseInt(h.slice(5, 7), 16) / 255,
});
const rgba = (h, a) => Object.assign(hex(h), { a });
const VAR = {};
function solid(name, opacity) {
  const p = { type: "SOLID", color: hex(COL[name] || name), opacity: opacity == null ? 1 : opacity };
  const v = VAR[name];
  if (v) {
    try {
      return figma.variables.setBoundVariableForPaint(p, "color", v);
    } catch (e) {
      return p;
    }
  }
  return p;
}
const white = (opacity) => ({ type: "SOLID", color: { r: 1, g: 1, b: 1 }, opacity });
const GRAD = (a) => ({
  type: "GRADIENT_LINEAR",
  gradientTransform: [
    [1, 0, 0],
    [0, 1, 0],
  ],
  gradientStops: [
    { position: 0, color: rgba(COL.lime, a == null ? 1 : a) },
    { position: 1, color: rgba(COL.cyan, a == null ? 1 : a) },
  ],
});
const RADIAL = (h, a0, a1) => ({
  type: "GRADIENT_RADIAL",
  gradientTransform: [
    [1, 0, 0],
    [0, 1, 0],
  ],
  gradientStops: [
    { position: 0, color: rgba(h, a0) },
    { position: 0.48, color: rgba(h, a1) },
    { position: 0.72, color: rgba(h, 0) },
  ],
});
const shadow = (x, y, r, s, h, a) => ({
  type: "DROP_SHADOW",
  color: rgba(h, a),
  offset: { x, y },
  radius: r,
  spread: s,
  visible: true,
  blendMode: "NORMAL",
});

/* type scale: desktop = values of the CSS clamp() at 1440 px, mobile = at 390 px */
const TY = {
  d: {
    h1: { f: "k", size: 135, lh: 0.96, ls: -0.035 },
    sub: { f: "m", size: 26, lh: 1.4 },
    h2: { f: "k", size: 80, lh: 1.02, ls: -0.028 },
    h2m: { f: "k", size: 66, lh: 1.02, ls: -0.028 },
    lead: { f: "x", size: 49, lh: 1.14, ls: -0.015 },
    p: { f: "m", size: 19, lh: 1.65 },
    pw: { f: "b", size: 19, lh: 1.65 },
    q: { f: "b", size: 30, lh: 1.28, ls: -0.01 },
    lbl: { f: "x", size: 13, lh: 1.2, ls: 0.16, upper: true },
    num: { f: "k", size: 58, lh: 1, ls: -0.03 },
    cap: { f: "b", size: 17, lh: 1.4 },
    pill: { f: "x", size: 23, lh: 1 },
    cardp: { f: "m", size: 17, lh: 1.65 },
    bign: { f: "k", size: 187, lh: 0.9, ls: -0.04 },
    h3: { f: "x", size: 22, lh: 1.15 },
    pnum: { f: "k", size: 56, lh: 1, ls: -0.03 },
    pp: { f: "m", size: 15.5, lh: 1.5 },
    qm: { f: "k", size: 230, lh: 0.6 },
    bigq: { f: "x", size: 53, lh: 1.12, ls: -0.02 },
    cta: { f: "x", size: 16, lh: 1 },
    ctaxl: { f: "x", size: 24, lh: 1 },
    marq: { f: "k", size: 115, lh: 1, ls: -0.035 },
    tagb: { f: "k", size: 22, lh: 1.2 },
    tags: { f: "x", size: 12, lh: 1.2, ls: 0.16, upper: true },
    menu: { f: "x", size: 30, lh: 1.15, ls: -0.01 },
    menun: { f: "x", size: 13, lh: 1.2, ls: 0.1 },
  },
  m: {
    h1: { f: "k", size: 46, lh: 0.96, ls: -0.035 },
    sub: { f: "m", size: 17, lh: 1.4 },
    h2: { f: "k", size: 38, lh: 1.02, ls: -0.028 },
    h2m: { f: "k", size: 34, lh: 1.02, ls: -0.028 },
    lead: { f: "x", size: 26, lh: 1.14, ls: -0.015 },
    p: { f: "m", size: 16, lh: 1.65 },
    pw: { f: "b", size: 16, lh: 1.65 },
    q: { f: "b", size: 20, lh: 1.28, ls: -0.01 },
    lbl: { f: "x", size: 13, lh: 1.2, ls: 0.16, upper: true },
    num: { f: "k", size: 38, lh: 1, ls: -0.03 },
    cap: { f: "b", size: 14, lh: 1.4 },
    pill: { f: "x", size: 16, lh: 1 },
    cardp: { f: "m", size: 15, lh: 1.65 },
    bign: { f: "k", size: 90, lh: 0.9, ls: -0.04 },
    h3: { f: "x", size: 18, lh: 1.15 },
    pnum: { f: "k", size: 40, lh: 1, ls: -0.03 },
    pp: { f: "m", size: 14, lh: 1.5 },
    qm: { f: "k", size: 120, lh: 0.6 },
    bigq: { f: "x", size: 26, lh: 1.12, ls: -0.02 },
    cta: { f: "x", size: 14, lh: 1 },
    ctaxl: { f: "x", size: 18, lh: 1 },
    marq: { f: "k", size: 44, lh: 1, ls: -0.035 },
    tagb: { f: "k", size: 20, lh: 1.2 },
    tags: { f: "x", size: 11, lh: 1.2, ls: 0.16, upper: true },
    menu: { f: "x", size: 22, lh: 1.15, ls: -0.01 },
    menun: { f: "x", size: 12, lh: 1.2, ls: 0.1 },
  },
};
const TYNAME = {
  h1: "Heading 1 (hero)",
  sub: "Hero subtitle",
  h2: "Heading 2",
  h2m: "Heading 2 / medium",
  lead: "Lead",
  p: "Body",
  pw: "Body / white",
  q: "Quote",
  lbl: "Label",
  num: "Stat number",
  cap: "Stat caption",
  pill: "Pill",
  cardp: "Card body",
  bign: "Big number",
  h3: "Heading 3",
  pnum: "Point number",
  pp: "Point body",
  qm: "Quote mark",
  bigq: "Big quote",
  cta: "Button",
  ctaxl: "Button / XL",
  marq: "Marquee",
  tagb: "Tag name",
  tags: "Tag role",
  menu: "Menu item",
  menun: "Menu number",
};

/* layout metrics, same source (CSS at 1440 / 390 px) */
const MET = {
  d: {
    w: 1440, gut: 56, secPad: 100, colGap: 30, splitGap: 58, colW: 686, figCol: 584, figW: 479, centerFig: 459,
    pMax: 627, subMax: 557, leadMax: 1000, statsGap: 22, statPadV: 30, statPadH: 32, statGap: 24, statW: 319,
    cardPad: 32, casesGap: 22, casesTop: 45, pointsGap: 18, pointsRow: true, pointMinH: 374, ctaH: 46, ctaPad: 26,
    ctaXlH: 72, ctaXlPad: 52, pillH: 62, pillPad: 30, phW: 144, phH: 180, quoteGap: 30, quotePadTop: 34,
    igorPic: 380, igorGap: 72, igorTop: 90, heroH: 900, heroPadB: 90, marqPadV: 27, marqMar: 36, mbtn: 46,
    brandA: 30, brandL: 38, glow: 1150, endH: 630, row: true,
  },
  m: {
    w: 390, gut: 20, secPad: 93, colGap: 18, splitGap: 28, colW: 350, figCol: 350, figW: 304, centerFig: 304,
    pMax: 350, subMax: 350, leadMax: 350, statsGap: 12, statPadV: 20, statPadH: 22, statGap: 14, statW: 350,
    cardPad: 22, casesGap: 14, casesTop: 28, pointsGap: 12, pointsRow: false, pointMinH: 0, ctaH: 40, ctaPad: 16,
    ctaXlH: 56, ctaXlPad: 32, pillH: 46, pillPad: 20, phW: 112, phH: 140, quoteGap: 16, quotePadTop: 22,
    igorPic: 340, igorGap: 24, igorTop: 40, heroH: 844, heroPadB: 64, marqPadV: 14, marqMar: 16, mbtn: 40,
    brandA: 20, brandL: 24, glow: 410, endH: 590, row: false,
  },
};

/* ---------------- fonts ---------------- */
let F = null,
  fontNote = "";
async function loadFonts() {
  const all = await figma.listAvailableFontsAsync();
  const has = (fam, st) => all.some((x) => x.fontName.family === fam && x.fontName.style === st);
  const pick = (fam, list) => {
    for (const s of list) if (has(fam, s)) return { family: fam, style: s };
    return null;
  };
  const g = all.find((x) => /^gilroy$/i.test(x.fontName.family));
  if (g) {
    const fam = g.fontName.family;
    const cand = {
      m: pick(fam, ["Medium", "Regular"]),
      b: pick(fam, ["Bold", "SemiBold", "Semibold"]),
      x: pick(fam, ["ExtraBold", "Extrabold", "Extra Bold", "Heavy", "Bold"]),
      k: pick(fam, ["Black", "Heavy", "ExtraBold", "Extrabold"]),
    };
    if (cand.m && cand.b && cand.x && cand.k) F = cand;
  }
  if (!F) {
    F = {
      m: { family: "Inter", style: "Medium" },
      b: { family: "Inter", style: "Bold" },
      x: { family: "Inter", style: "Extra Bold" },
      k: { family: "Inter", style: "Black" },
    };
    fontNote =
      "Шрифт Gilroy не знайдено у Figma — тимчасово використано Inter. Встановіть Gilroy (папка figma-plugin/fonts) і запустіть плагін ще раз, або замініть шрифт у текстових стилях (Local styles → Text).";
  }
  for (const k of Object.keys(F)) await figma.loadFontAsync(F[k]);
}

/* ---------------- styles & variables ---------------- */
const TS = { d: {}, m: {} };
function lhOf(st) {
  return st.lh ? { unit: "PERCENT", value: Math.round(st.lh * 1000) / 10 } : { unit: "AUTO" };
}
function applyType(t, st) {
  t.fontName = F[st.f];
  t.fontSize = st.size;
  t.lineHeight = lhOf(st);
  t.letterSpacing = { unit: "PERCENT", value: Math.round((st.ls || 0) * 1000) / 10 };
  if (st.upper) t.textCase = "UPPER";
}
async function makeStyles() {
  try {
    const coll = figma.variables.createVariableCollection("Godlike / colors");
    const mode = coll.modes[0].modeId;
    const list = Object.assign({}, COL);
    for (const k of Object.keys(list)) {
      const v = figma.variables.createVariable(k, coll, "COLOR");
      v.setValueForMode(mode, rgba(list[k], 1));
      v.scopes = ["ALL_FILLS", "STROKE_COLOR", "EFFECT_COLOR"];
      VAR[k] = v;
    }
    const line = figma.variables.createVariable("line", coll, "COLOR");
    line.setValueForMode(mode, { r: 1, g: 1, b: 1, a: 0.14 });
    line.scopes = ["STROKE_COLOR", "ALL_FILLS"];
  } catch (e) {
    warn("Змінні кольорів не створено: " + e.message);
  }
  for (const dev of ["d", "m"]) {
    for (const k of Object.keys(TY[dev])) {
      try {
        const s = figma.createTextStyle();
        s.name = (dev === "d" ? "Desktop/" : "Mobile/") + TYNAME[k];
        s.fontName = F[TY[dev][k].f];
        s.fontSize = TY[dev][k].size;
        s.lineHeight = lhOf(TY[dev][k]);
        s.letterSpacing = { unit: "PERCENT", value: Math.round((TY[dev][k].ls || 0) * 1000) / 10 };
        if (TY[dev][k].upper) s.textCase = "UPPER";
        TS[dev][k] = s.id;
      } catch (e) {
        warn("Текстовий стиль " + k + ": " + e.message);
      }
    }
  }
}

/* ---------------- node helpers ---------------- */
function AL(dir, name) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir === "h" ? "HORIZONTAL" : "VERTICAL";
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.fills = [];
  f.clipsContent = false;
  return f;
}
function pad(f, t, r, b, l) {
  f.paddingTop = t;
  f.paddingRight = r == null ? t : r;
  f.paddingBottom = b == null ? t : b;
  f.paddingLeft = l == null ? (r == null ? t : r) : l;
}
function setW(f, w) {
  f.resize(w, f.height);
  if (f.layoutMode !== "NONE") f.layoutSizingVertical = "HUG";
}
const IMG = {};
function img(key) {
  if (!IMG[key]) IMG[key] = figma.createImage(figma.base64Decode(A[key])).hash;
  return { type: "IMAGE", imageHash: IMG[key], scaleMode: "FILL" };
}
/* text with optional mixed runs: k contains g (gradient), b (black weight), s (small) */
async function txt(parent, content, key, dev, o) {
  o = o || {};
  const st = TY[dev][key];
  const runs = Array.isArray(content) ? content : [{ t: String(content), k: "" }];
  const str = runs.map((r) => r.t).join("") || " ";
  const t = figma.createText();
  t.name = o.name || key;
  t.fontName = F[st.f];
  t.characters = str;
  let styled = false;
  if (TS[dev][key]) {
    try {
      await t.setTextStyleIdAsync(TS[dev][key]);
      styled = true;
    } catch (e) {
      styled = false;
    }
  }
  if (!styled) applyType(t, st);
  t.fills = [o.fill || solid(o.color || "fg")];
  if (o.align) t.textAlignHorizontal = o.align;
  let i = 0;
  for (const r of runs) {
    const a = i,
      b = i + r.t.length;
    i = b;
    if (b <= a) continue;
    if (r.k.indexOf("g") >= 0) t.setRangeFills(a, b, [GRAD()]);
    if (r.k.indexOf("b") >= 0) t.setRangeFontName(a, b, F.k);
    if (r.k.indexOf("s") >= 0) t.setRangeFontSize(a, b, Math.round(st.size * 0.42));
  }
  parent.appendChild(t);
  if (o.w === "fill") {
    t.textAutoResize = "HEIGHT";
    t.layoutSizingHorizontal = "FILL";
  } else if (typeof o.w === "number") {
    t.resize(o.w, Math.max(1, t.height));
    t.textAutoResize = "HEIGHT";
  } else t.textAutoResize = "WIDTH_AND_HEIGHT";
  return t;
}
function glassFill(f, radius) {
  f.fills = [
    { type: "SOLID", color: hex("#090f12"), opacity: 0.82 },
    {
      type: "GRADIENT_LINEAR",
      gradientTransform: [
        [0.7, 0.7, 0],
        [-0.7, 0.7, 0.5],
      ],
      gradientStops: [
        { position: 0, color: { r: 1, g: 1, b: 1, a: 0.1 } },
        { position: 1, color: { r: 1, g: 1, b: 1, a: 0.03 } },
      ],
    },
  ];
  f.strokes = [white(0.16)];
  f.strokeWeight = 1;
  f.strokeAlign = "INSIDE";
  f.cornerRadius = radius == null ? 28 : radius;
}

/* annotations: Dev Mode annotation where supported + a visible tag next to the frame */
let ANN = [];
function ann(node, label) {
  ANN.push({ node, label });
  try {
    node.annotations = [{ label }];
  } catch (e) {
    /* annotations API not available: the side tags still show it */
  }
}
async function drawAnnotations(frame, dev) {
  const page = frame.parent;
  const fb = frame.absoluteBoundingBox;
  const holder = figma.createFrame();
  holder.name = "↳ Webflow-мітки (не імпортувати)";
  holder.fills = [];
  holder.clipsContent = false;
  page.appendChild(holder);
  holder.x = fb.x + fb.width + 48;
  holder.y = fb.y;
  holder.resize(10, 10);
  let lastY = -1e9;
  const items = ANN.filter((a) => a.node && !a.node.removed)
    .map((a) => ({ a, y: a.node.absoluteBoundingBox ? a.node.absoluteBoundingBox.y - fb.y : 0 }))
    .sort((p, q) => p.y - q.y);
  for (const it of items) {
    const tag = AL("h", "tag");
    pad(tag, 6, 12, 6, 12);
    tag.cornerRadius = 8;
    tag.fills = [{ type: "SOLID", color: hex("#ff3d9a"), opacity: 0.16 }];
    tag.strokes = [{ type: "SOLID", color: hex("#ff3d9a") }];
    tag.strokeWeight = 1;
    const t = figma.createText();
    t.fontName = F.b;
    t.characters = it.a.label;
    t.fontSize = dev === "d" ? 13 : 11;
    t.fills = [{ type: "SOLID", color: hex("#ff7cc0") }];
    tag.appendChild(t);
    holder.appendChild(tag);
    const y = Math.max(it.y, lastY + (dev === "d" ? 30 : 26));
    tag.x = 0;
    tag.y = y;
    lastY = y;
  }
  holder.locked = true;
  ANN = [];
}

/* ---------------- components ---------------- */
const K = { d: {}, m: {} };
async function makeComponents(page, dev) {
  const M = MET[dev];
  const out = [];
  // CTA
  for (const xl of [false, true]) {
    const c = figma.createComponent();
    c.name = "cta" + (xl ? " xl" : "") + " / " + (dev === "d" ? "desktop" : "mobile");
    c.layoutMode = "HORIZONTAL";
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisAlignItems = "CENTER";
    c.counterAxisAlignItems = "CENTER";
    const h = xl ? M.ctaXlH : M.ctaH;
    c.resize(120, h);
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisSizingMode = "AUTO";
    pad(c, 0, xl ? M.ctaXlPad : M.ctaPad, 0, xl ? M.ctaXlPad : M.ctaPad);
    c.cornerRadius = h / 2;
    c.fills = [GRAD()];
    c.effects = [shadow(0, 0, 30, 0, COL.lime, 0.35)];
    await txt(c, "Create Server", xl ? "ctaxl" : "cta", dev, { name: "label", fill: solid("bg") });
    page.appendChild(c);
    K[dev][xl ? "ctaxl" : "cta"] = c;
    out.push(c);
  }
  // menu button
  {
    const c = figma.createComponent();
    c.name = "mbtn / " + (dev === "d" ? "desktop" : "mobile");
    c.resize(M.mbtn, M.mbtn);
    c.cornerRadius = M.mbtn / 2;
    c.fills = [{ type: "SOLID", color: hex(COL.bg2), opacity: 0.78 }];
    c.strokes = [white(0.24)];
    c.strokeWeight = 1;
    const l = dev === "d" ? 14 : 11;
    const bars = [
      [dev === "d" ? 18 : 15, 18],
      [dev === "d" ? 26 : 23, 11],
    ];
    for (const [y, w] of bars) {
      const r = figma.createRectangle();
      r.name = "i";
      r.resize(w, 2);
      r.cornerRadius = 2;
      r.fills = [white(1)];
      c.appendChild(r);
      r.x = l;
      r.y = y;
    }
    page.appendChild(c);
    K[dev].mbtn = c;
    out.push(c);
  }
  // stat card
  {
    const c = figma.createComponent();
    c.name = "glass stat / " + (dev === "d" ? "desktop" : "mobile");
    c.layoutMode = "VERTICAL";
    c.primaryAxisSizingMode = "AUTO";
    c.counterAxisSizingMode = "FIXED";
    c.resize(M.statW, 200);
    c.primaryAxisSizingMode = "AUTO";
    pad(c, M.statPadV, M.statPadH, M.statPadV, M.statPadH);
    c.itemSpacing = M.statGap;
    glassFill(c);
    await txt(c, [{ t: "13+", k: "g" }], "num", dev, { name: "num" });
    await txt(c, "локацій по всьому світу", "cap", dev, { name: "cap", color: "soft", w: "fill" });
    page.appendChild(c);
    K[dev].stat = c;
    out.push(c);
  }
  // case card
  {
    const c = figma.createComponent();
    c.name = "glass card / " + (dev === "d" ? "desktop" : "mobile");
    c.layoutMode = "VERTICAL";
    c.counterAxisSizingMode = "FIXED";
    c.resize(dev === "d" ? 411 : 350, 200);
    c.primaryAxisSizingMode = "AUTO";
    pad(c, M.cardPad);
    c.itemSpacing = 14;
    glassFill(c);
    await txt(c, "Виклик", "lbl", dev, { name: "lbl", color: "lime", w: "fill" });
    await txt(c, "Текст картки", "cardp", dev, { name: "p", color: "soft", w: "fill" });
    page.appendChild(c);
    K[dev].card = c;
    out.push(c);
  }
  // point card
  {
    const c = figma.createComponent();
    c.name = "glass card point / " + (dev === "d" ? "desktop" : "mobile");
    c.layoutMode = "VERTICAL";
    c.counterAxisSizingMode = "FIXED";
    c.resize(dev === "d" ? 241 : 350, 200);
    c.primaryAxisSizingMode = "AUTO";
    pad(c, M.cardPad);
    c.itemSpacing = 14;
    glassFill(c);
    if (M.pointMinH) {
      try {
        c.minHeight = M.pointMinH;
      } catch (e) {}
    }
    await txt(c, [{ t: "01", k: "g" }], "pnum", dev, { name: "num" });
    await txt(c, "Заголовок", "h3", dev, { name: "h3", w: "fill" });
    await txt(c, "Опис", "pp", dev, { name: "p", color: "mute", w: "fill" });
    page.appendChild(c);
    K[dev].point = c;
    out.push(c);
  }
  // pill
  {
    const c = figma.createComponent();
    c.name = "glass pill / " + (dev === "d" ? "desktop" : "mobile");
    c.layoutMode = "HORIZONTAL";
    c.counterAxisAlignItems = "CENTER";
    c.resize(100, M.pillH);
    c.counterAxisSizingMode = "FIXED";
    c.primaryAxisSizingMode = "AUTO";
    pad(c, 0, M.pillPad, 0, M.pillPad);
    glassFill(c, M.pillH / 2);
    await txt(c, "Go", "pill", dev, { name: "label" });
    page.appendChild(c);
    K[dev].pill = c;
    out.push(c);
  }
  return out;
}
function setText(inst, name, content, key, dev) {
  const t = inst.findOne((n) => n.type === "TEXT" && n.name === name);
  if (!t) return null;
  const runs = Array.isArray(content) ? content : [{ t: String(content), k: "" }];
  t.characters = runs.map((r) => r.t).join("") || " ";
  let i = 0;
  const st = TY[dev][key];
  for (const r of runs) {
    const a = i,
      b = i + r.t.length;
    i = b;
    if (b <= a) continue;
    if (r.k.indexOf("g") >= 0) t.setRangeFills(a, b, [GRAD()]);
    if (r.k.indexOf("s") >= 0) t.setRangeFontSize(a, b, Math.round(st.size * 0.42));
  }
  return t;
}

/* ---------------- section builders ---------------- */
function brand(dev, big) {
  const M = MET[dev];
  const b = AL("h", "brand");
  b.counterAxisAlignItems = "CENTER";
  b.itemSpacing = dev === "d" ? 20 : 10;
  const hA = big ? 44 : M.brandA,
    hL = big ? 56 : M.brandL;
  const a = figma.createRectangle();
  a.name = "logo-ain";
  a.resize(Math.round((903 / 261) * hA), hA);
  a.fills = [img("ain")];
  b.appendChild(a);
  if (dev === "d" || big) {
    const i = figma.createRectangle();
    i.name = "divider";
    i.resize(1.5, 28);
    i.fills = [white(0.3)];
    b.appendChild(i);
  }
  try {
    const s = figma.createNodeFromSvg(A.logo_svg);
    s.name = "logo-godlike";
    s.rescale(hL / s.height);
    b.appendChild(s);
  } catch (e) {
    warn("SVG-логотип: " + e.message);
  }
  return b;
}
function header(dev) {
  const M = MET[dev];
  const h = AL("h", "top");
  pad(h, 22, M.gut, 12, M.gut);
  h.primaryAxisAlignItems = "SPACE_BETWEEN";
  h.counterAxisAlignItems = "CENTER";
  h.appendChild(brand(dev));
  const r = AL("h", "hr");
  r.counterAxisAlignItems = "CENTER";
  r.itemSpacing = 10;
  r.appendChild(K[dev].cta.createInstance());
  r.appendChild(K[dev].mbtn.createInstance());
  h.appendChild(r);
  return h;
}
function figBox(parent, scene, dev, size) {
  const f = figma.createFrame();
  f.name = "fig";
  f.resize(size, size);
  f.fills = [];
  f.clipsContent = false;
  const halo = figma.createEllipse();
  halo.name = "halo";
  halo.resize(size * 0.92, size * 0.92);
  halo.fills = [RADIAL(COL.lime, 0.24, 0.12)];
  halo.opacity = 0.45;
  f.appendChild(halo);
  halo.x = size * 0.04;
  halo.y = size * 0.04;
  const p = figma.createRectangle();
  p.name = "fig-poster";
  p.resize(size, size);
  if (A["fig" + scene]) p.fills = [Object.assign(img("fig" + scene), { scaleMode: "FIT" })];
  else p.fills = [];
  f.appendChild(p);
  parent.appendChild(f);
  ann(f, 'data-scene="' + scene + '" · 3D-фігура (WebGL з GitHub); fig-poster = статичний кадр до завантаження');
  return f;
}
async function textBlock(col, b, dev, M, inCenter) {
  const align = inCenter ? "CENTER" : undefined;
  if (b.k === "h1" || b.k === "h2" || b.k === "h2m") {
    const t = await txt(col, b.r, b.k, dev, { name: b.k === "h1" ? "h1" : "h2 h" + (b.k === "h2m" ? " m" : ""), w: "fill", align });
    ann(t, 'data-anim="letters" · заголовок з’являється по літерах');
    return t;
  }
  if (b.k === "lead") {
    const t = await txt(col, b.r, "lead", dev, { name: "lead scrub", w: inCenter ? Math.min(M.leadMax, M.w - 2 * M.gut) : "fill", align });
    ann(t, 'data-anim="scrub" · слова підсвічуються під час скролу');
    return t;
  }
  if (b.k === "sub") return txt(col, b.r, "sub", dev, { name: "sub", color: "soft", w: M.subMax });
  if (b.k === "q") {
    const t = await txt(col, b.r, "q", dev, { name: "q", w: "fill" });
    ann(t, 'data-anim="words"');
    return t;
  }
  if (b.k === "p" || b.k === "pw") {
    const t = await txt(col, b.r, b.k, dev, { name: b.k === "pw" ? "p w" : "p", color: b.k === "pw" ? "fg" : "mute", w: dev === "d" ? M.pMax : "fill" });
    ann(t, 'data-anim="words" · абзац з’являється по словах');
    return t;
  }
  if (b.k === "bign") return txt(col, [{ t: b.t, k: "g" }], "bign", dev, { name: "big-n" });
  return null;
}
async function buildBlock(col, b, dev, M, inCenter) {
  const t = await textBlock(col, b, dev, M, inCenter);
  if (t) return t;
  if (b.k === "two") {
    const r = AL(M.row ? "h" : "v", "two");
    r.itemSpacing = M.row ? 56 : 20;
    col.appendChild(r);
    r.layoutSizingHorizontal = "FILL";
    for (const it of b.items) {
      const p = await txt(r, it.r, "p", dev, { name: "p", color: "mute", w: "fill" });
      ann(p, 'data-anim="words"');
    }
    return r;
  }
  if (b.k === "stats") {
    const r = AL("h", "stats");
    r.layoutWrap = "WRAP";
    r.itemSpacing = M.statsGap;
    r.counterAxisSpacing = M.statsGap;
    col.appendChild(r);
    r.layoutSizingHorizontal = "FILL";
    for (const it of b.items) {
      const inst = K[dev].stat.createInstance();
      r.appendChild(inst);
      if (dev === "m") inst.layoutSizingHorizontal = "FILL";
      setText(inst, "num", it.num, "num", dev);
      setText(inst, "cap", it.cap, "cap", dev);
      const n = it.num.map((x) => x.t).join("");
      ann(inst, 'data-count · число рахує від 0 до «' + n.trim() + '» · data-tilt (нахил і підсвітка)');
    }
    return r;
  }
  if (b.k === "quote") {
    const q = AL(M.row ? "h" : "v", "quote");
    q.itemSpacing = M.quoteGap;
    q.paddingTop = M.quotePadTop;
    q.strokes = [white(0.14)];
    q.strokeTopWeight = 1;
    q.strokeBottomWeight = 0;
    q.strokeLeftWeight = 0;
    q.strokeRightWeight = 0;
    q.strokeAlign = "INSIDE";
    col.appendChild(q);
    q.layoutSizingHorizontal = "FILL";
    const ph = figma.createRectangle();
    ph.name = "ph";
    ph.resize(M.phW, M.phH);
    ph.cornerRadius = 26;
    const key = (b.img || "").replace("assets/", "");
    ph.fills = A[key] ? [img(key)] : [white(0.1)];
    ph.strokes = [white(0.28)];
    ph.strokeWeight = 1;
    ph.effects = [shadow(0, 0, 0, 6, COL.lime, 0.08), shadow(0, 24, 50, 0, "#000000", 0.55)];
    q.appendChild(ph);
    const tc = AL("v", "col");
    tc.itemSpacing = M.colGap;
    q.appendChild(tc);
    tc.layoutSizingHorizontal = "FILL";
    const qt = await txt(tc, b.q, "q", dev, { name: "q", w: "fill" });
    ann(qt, 'data-anim="words"');
    if (b.p) await txt(tc, b.p, "p", dev, { name: "p", color: "mute", w: "fill" });
    return q;
  }
  if (b.k === "pills") {
    const w = AL("v", "pills-group");
    w.itemSpacing = 10;
    col.appendChild(w);
    w.layoutSizingHorizontal = "FILL";
    await txt(w, b.lbl, "lbl", dev, { name: "lbl", color: "lime" });
    const r = AL("h", "pills");
    r.layoutWrap = "WRAP";
    r.itemSpacing = 12;
    r.counterAxisSpacing = 12;
    w.appendChild(r);
    r.layoutSizingHorizontal = "FILL";
    for (const it of b.items) {
      const inst = K[dev].pill.createInstance();
      r.appendChild(inst);
      setText(inst, "label", it, "pill", dev);
    }
    return w;
  }
  if (b.k === "cta") {
    const inst = (b.xl ? K[dev].ctaxl : K[dev].cta).createInstance();
    col.appendChild(inst);
    ann(inst, "посилання: " + (b.href || "#") + " · data-magnetic (кнопка тягнеться за курсором)");
    return inst;
  }
  if (b.k === "fig") return figBox(col, b.scene, dev, M.centerFig);
  if (b.k === "brand") {
    const br = brand(dev, true);
    col.appendChild(br);
    return br;
  }
  if (b.k === "cases") {
    const r = AL(M.row ? "h" : "v", "cases");
    r.itemSpacing = M.casesGap;
    col.appendChild(r);
    r.layoutSizingHorizontal = "FILL";
    for (const it of b.items) {
      const inst = K[dev].card.createInstance();
      r.appendChild(inst);
      inst.layoutSizingHorizontal = "FILL";
      if (M.row) inst.layoutSizingVertical = "FILL";
      setText(inst, "lbl", it.lbl, "lbl", dev);
      setText(inst, "p", it.p, "cardp", dev);
      ann(inst, 'data-anim="reveal" · data-tilt');
    }
    return r;
  }
  if (b.k === "points") {
    const r = AL(M.pointsRow ? "h" : "v", "points");
    r.itemSpacing = M.pointsGap;
    col.appendChild(r);
    r.layoutSizingHorizontal = "FILL";
    let i = 0;
    for (const it of b.items) {
      i++;
      const inst = K[dev].point.createInstance();
      r.appendChild(inst);
      inst.layoutSizingHorizontal = "FILL";
      if (M.pointsRow) inst.layoutSizingVertical = "FILL";
      setText(inst, "num", [{ t: String(it.n).padStart(2, "0"), k: "g" }], "pnum", dev);
      setText(inst, "h3", it.h, "h3", dev);
      setText(inst, "p", it.p, "pp", dev);
    }
    ann(r, 'data-anim="reveal" · data-count у номерах карток');
    return r;
  }
  if (b.k === "igor") {
    const g = AL(M.row ? "h" : "v", "igor");
    g.itemSpacing = M.igorGap;
    g.counterAxisAlignItems = "CENTER";
    g.paddingTop = M.igorTop;
    col.appendChild(g);
    g.layoutSizingHorizontal = "FILL";
    const pic = figma.createFrame();
    pic.name = "pic";
    pic.resize(M.igorPic, Math.round(M.igorPic * 1.25));
    pic.cornerRadius = 38;
    const key = b.img.replace("assets/", "");
    pic.fills = A[key] ? [img(key)] : [white(0.1)];
    pic.strokes = [white(0.35)];
    pic.strokeWeight = 1.5;
    pic.effects = [shadow(0, 0, 0, 10, COL.lime, 0.1), shadow(0, 40, 90, 0, "#000000", 0.6)];
    pic.clipsContent = true;
    g.appendChild(pic);
    const tag = AL("v", "tag");
    pad(tag, 12, 18, 12, 18);
    tag.cornerRadius = 18;
    tag.itemSpacing = 2;
    tag.fills = [{ type: "SOLID", color: hex(COL.bg), opacity: 0.86 }];
    pic.appendChild(tag);
    setW(tag, M.igorPic - 36);
    await txt(tag, b.name, "tagb", dev, { name: "b" });
    await txt(tag, b.role, "tags", dev, { name: "span", color: "lime" });
    tag.x = 18;
    tag.y = pic.height - tag.height - 18;
    const tc = AL("v", "igor-text");
    g.appendChild(tc);
    tc.layoutSizingHorizontal = "FILL";
    await txt(tc, [{ t: "“", k: "g" }], "qm", dev, { name: "qm" });
    const bq = await txt(tc, b.q, "bigq", dev, { name: "big-q scrub", w: "fill" });
    ann(bq, 'data-anim="scrub"');
    return g;
  }
  warn("Невідомий блок: " + b.k);
  return null;
}
function shell(root, dev, name) {
  const M = MET[dev];
  const sec = AL("v", name);
  sec.paddingTop = M.secPad;
  sec.paddingBottom = M.secPad;
  sec.primaryAxisAlignItems = "CENTER";
  root.appendChild(sec);
  sec.layoutSizingHorizontal = "FILL";
  const wrap = AL("v", "wrap");
  pad(wrap, 0, M.gut, 0, M.gut);
  sec.appendChild(wrap);
  wrap.layoutSizingHorizontal = "FILL";
  return { sec, wrap };
}
async function buildSection(root, s, dev) {
  const M = MET[dev];
  if (s.type === "marq") {
    const m = AL("h", "marq");
    m.clipsContent = true;
    pad(m, M.marqPadV, 0, M.marqPadV, 0);
    m.fills = [GRAD(0.07)];
    m.strokes = [white(0.1)];
    m.strokeTopWeight = 1;
    m.strokeBottomWeight = 1;
    m.strokeLeftWeight = 0;
    m.strokeRightWeight = 0;
    m.counterAxisAlignItems = "CENTER";
    const holder = AL("v", "marq-space");
    holder.paddingTop = M.marqMar;
    holder.paddingBottom = M.marqMar;
    holder.counterAxisAlignItems = "CENTER";
    holder.clipsContent = false;
    root.appendChild(holder);
    holder.layoutSizingHorizontal = "FILL";
    holder.appendChild(m);
    m.resize(M.w + 80, m.height);
    m.layoutSizingVertical = "HUG";
    const track = AL("h", "track");
    track.itemSpacing = Math.round(TY[dev].marq.size * 0.45);
    track.counterAxisAlignItems = "CENTER";
    m.appendChild(track);
    for (const it of s.items) {
      const t = await txt(track, it.t, "marq", dev, { name: it.f ? "span f" : "span", fill: it.f ? GRAD() : white(0) });
      if (!it.f) {
        t.fills = [];
        t.strokes = [white(0.6)];
        t.strokeWeight = dev === "d" ? 1.5 : 1;
      }
    }
    m.rotation = s.dir === "r" ? -1.4 : 1.6;
    ann(m, 'data-marquee="' + (s.dir === "r" ? "r" : "l") + '" · рядок їде під час скролу (дублікат треку додає скрипт)');
    return holder;
  }
  if (s.layout === "hero") {
    const sec = figma.createFrame();
    sec.name = "sec hero";
    sec.layoutMode = "VERTICAL";
    sec.primaryAxisAlignItems = "MAX";
    root.appendChild(sec);
    sec.layoutSizingHorizontal = "FILL";
    sec.resize(M.w, M.heroH);
    sec.layoutSizingHorizontal = "FILL";
    sec.layoutSizingVertical = "FIXED";
    sec.clipsContent = true;
    sec.fills = [solid("hero"), img("hero")];
    ann(sec, 'id="s1" · data-stream · фон «потік даних» малює скрипт (тут — статичний кадр)');
    const veil = figma.createRectangle();
    veil.name = "veil";
    sec.appendChild(veil);
    veil.layoutPositioning = "ABSOLUTE";
    veil.resize(M.w, M.heroH);
    veil.x = 0;
    veil.y = 0;
    veil.fills = [
      {
        type: "GRADIENT_LINEAR",
        gradientTransform: [
          [0, -1, 1],
          [1, 0, 0],
        ],
        gradientStops: [
          { position: 0, color: rgba(COL.hero, 1) },
          { position: dev === "d" ? 0.24 : 0.3, color: rgba(COL.hero, dev === "d" ? 0 : 0.5) },
          { position: dev === "d" ? 0.25 : 0.62, color: rgba(COL.hero, 0) },
        ],
      },
    ];
    veil.constraints = { horizontal: "STRETCH", vertical: "STRETCH" };
    const wrap = AL("v", "wrap");
    pad(wrap, 140, M.gut, M.heroPadB, M.gut);
    wrap.itemSpacing = dev === "d" ? 30 : 20;
    sec.appendChild(wrap);
    wrap.layoutSizingHorizontal = "FILL";
    for (const b of s.blocks) await textBlock(wrap, b, dev, M, false);
    if (dev === "d") {
      const cue = figma.createRectangle();
      cue.name = "cue";
      sec.appendChild(cue);
      cue.layoutPositioning = "ABSOLUTE";
      cue.resize(2, 90);
      cue.cornerRadius = 2;
      cue.fills = [white(0.18), Object.assign(GRAD(), { gradientTransform: [[0, 1, 0], [-1, 0, 1]] })];
      cue.x = M.w - M.gut - 2;
      cue.y = M.heroH - 60 - 90;
      ann(cue, "індикатор скролу (анімація CSS)");
    }
    return sec;
  }
  const { sec, wrap } = shell(root, dev, s.id === "end" ? "sec end" : "sec");
  ann(sec, 'id="' + s.id + '" · якір для меню');
  if (s.id === "end") {
    sec.resize(sec.width, M.endH);
    sec.layoutSizingVertical = "FIXED";
    sec.layoutSizingHorizontal = "FILL";
  }
  if (s.layout === "center" || s.layout === "plain") {
    const col = AL("v", s.layout === "center" ? "col center" : "col");
    col.itemSpacing = s.layout === "center" ? (dev === "d" ? 48 : 28) : M.colGap;
    if (s.layout === "center") col.counterAxisAlignItems = "CENTER";
    wrap.appendChild(col);
    col.layoutSizingHorizontal = "FILL";
    for (const b of s.blocks) await buildBlock(col, b, dev, M, s.layout === "center");
    return sec;
  }
  // split
  const split = AL(M.row ? "h" : "v", s.layout === "split-rev" ? "split rev" : "split");
  split.itemSpacing = M.splitGap;
  split.counterAxisAlignItems = M.row ? "CENTER" : "MIN";
  wrap.appendChild(split);
  split.layoutSizingHorizontal = "FILL";
  const col = AL("v", "col");
  col.itemSpacing = M.colGap;
  const figCol = AL("v", "fig-col");
  figCol.counterAxisAlignItems = "CENTER";
  const figFirst = !M.row || s.layout === "split-rev";
  if (figFirst) {
    split.appendChild(figCol);
    split.appendChild(col);
  } else {
    split.appendChild(col);
    split.appendChild(figCol);
  }
  if (M.row) {
    setW(col, M.colW);
    setW(figCol, M.figCol);
  } else {
    col.layoutSizingHorizontal = "FILL";
    figCol.layoutSizingHorizontal = "FILL";
  }
  figBox(figCol, s.fig, dev, M.figW);
  for (const b of s.blocks) await buildBlock(col, b, dev, M, false);
  if (s.after && s.after.length) {
    const after = AL("v", "after");
    after.paddingTop = M.casesTop;
    wrap.appendChild(after);
    after.layoutSizingHorizontal = "FILL";
    for (const b of s.after) await buildBlock(after, b, dev, M, false);
  }
  return sec;
}
async function buildPage(page, dev, x) {
  const M = MET[dev];
  const root = AL("v", dev === "d" ? "Godlike × AIN — Desktop 1440" : "Godlike × AIN — Mobile 390");
  page.appendChild(root);
  root.x = x;
  root.y = 0;
  setW(root, M.w);
  root.fills = [solid("bg")];
  root.clipsContent = true;
  const made = [];
  for (const s of C.secs) {
    try {
      made.push({ s, node: await buildSection(root, s, dev) });
    } catch (e) {
      warn((dev === "d" ? "Desktop" : "Mobile") + ", секція " + (s.id || s.type) + ": " + e.message);
    }
  }
  // ambient colour washes, as .bgl in the landing: two per section, behind everything
  let k = 0;
  for (const m of made) {
    if (!m.s.id || m.s.layout === "hero") continue;
    k++;
    const sec = m.node;
    for (const [fy, left, lime] of [
      [0.28, k % 2 === 0, k % 3 === 0],
      [0.78, k % 2 !== 0, k % 3 !== 0],
    ]) {
      const g = figma.createEllipse();
      g.name = "glow";
      root.insertChild(0, g);
      g.layoutPositioning = "ABSOLUTE";
      g.resize(M.glow, M.glow);
      g.fills = [RADIAL(lime ? COL.lime : COL.cyan, 0.3, 0.1)];
      g.x = left ? -M.glow * 0.42 : M.w - M.glow * 0.58;
      g.y = sec.y + sec.height * fy - M.glow / 2;
      g.locked = true;
    }
  }
  const top = header(dev);
  root.appendChild(top);
  top.layoutPositioning = "ABSOLUTE";
  top.resize(M.w, top.height);
  top.x = 0;
  top.y = 0;
  top.constraints = { horizontal: "STRETCH", vertical: "MIN" };
  ann(top, "шапка: position fixed; меню відкривається кнопкою (data-menu)");
  return root;
}
async function buildMenu(page, x) {
  const M = MET.d;
  const f = figma.createFrame();
  f.name = "Меню (відкрите) — Desktop";
  page.appendChild(f);
  f.x = x;
  f.y = 0;
  f.resize(M.w, 900);
  f.fills = [solid("menu")];
  f.clipsContent = true;
  const g1 = figma.createEllipse();
  g1.resize(1800, 1800);
  g1.fills = [RADIAL(COL.cyan, 0.1, 0.03)];
  f.appendChild(g1);
  g1.x = M.w * 0.85 - 900;
  g1.y = -900;
  const g2 = figma.createEllipse();
  g2.resize(1600, 1600);
  g2.fills = [RADIAL(COL.lime, 0.08, 0.02)];
  f.appendChild(g2);
  g2.x = -800;
  g2.y = 900 - 800;
  const ol = AL("h", "menu ol");
  ol.itemSpacing = 96;
  f.appendChild(ol);
  ol.x = (M.w - 1240) / 2 + M.gut;
  ol.y = 126;
  const half = Math.ceil(C.menu.length / 2);
  for (let c = 0; c < 2; c++) {
    const col = AL("v", "col");
    ol.appendChild(col);
    setW(col, (1240 - 2 * M.gut - 96) / 2);
    for (let i = c * half; i < Math.min(C.menu.length, (c + 1) * half); i++) {
      const it = AL("h", "menu item");
      it.itemSpacing = 22;
      it.counterAxisAlignItems = "BASELINE";
      pad(it, 14, 0, 14, 0);
      it.strokes = [white(0.1)];
      it.strokeTopWeight = 0;
      it.strokeLeftWeight = 0;
      it.strokeRightWeight = 0;
      it.strokeBottomWeight = 1;
      col.appendChild(it);
      it.layoutSizingHorizontal = "FILL";
      await txt(it, String(i + 1).padStart(2, "0"), "menun", "d", { name: "n", color: "lime" });
      await txt(it, C.menu[i], "menu", "d", { name: "t", w: "fill" });
    }
  }
  const top = header("d");
  f.appendChild(top);
  top.resize(M.w, top.height);
  top.x = 0;
  top.y = 0;
  ann(f, "оверлей меню: з’являється колом від кнопки (анімація у скрипті)");
  return f;
}

/* ---------------- design system & handoff pages ---------------- */
async function buildSystem(page) {
  const root = AL("v", "Дизайн-система");
  page.appendChild(root);
  root.x = 0;
  root.y = 0;
  pad(root, 64);
  root.itemSpacing = 40;
  root.fills = [solid("bg")];
  await txt(root, "Кольори (змінні «Godlike / colors»)", "h2m", "d", { name: "title" });
  const sw = AL("h", "swatches");
  sw.itemSpacing = 20;
  root.appendChild(sw);
  for (const k of Object.keys(COL)) {
    const c = AL("v", "swatch " + k);
    c.itemSpacing = 8;
    sw.appendChild(c);
    const r = figma.createRectangle();
    r.resize(120, 80);
    r.cornerRadius = 14;
    r.fills = [solid(k)];
    r.strokes = [white(0.16)];
    c.appendChild(r);
    await txt(c, k + "  " + COL[k], "cap", "m", { name: "name", color: "soft" });
  }
  const g = AL("v", "swatch gradient");
  g.itemSpacing = 8;
  sw.appendChild(g);
  const gr = figma.createRectangle();
  gr.resize(240, 80);
  gr.cornerRadius = 14;
  gr.fills = [GRAD()];
  g.appendChild(gr);
  await txt(g, "gradient lime → cyan (кнопки, акцентні слова)", "cap", "m", { name: "name", color: "soft" });
  await txt(root, "Текстові стилі (Desktop / Mobile)", "h2m", "d", { name: "title" });
  const ty = AL("v", "type");
  ty.itemSpacing = 18;
  root.appendChild(ty);
  for (const k of ["h1", "h2", "h2m", "lead", "q", "p", "pw", "lbl", "num", "cap", "h3", "bign", "bigq"]) {
    const row = AL("h", "type " + k);
    row.itemSpacing = 40;
    row.counterAxisAlignItems = "CENTER";
    ty.appendChild(row);
    await txt(row, TYNAME[k] + "\n" + TY.d[k].size + " / " + TY.m[k].size + " px", "cap", "m", { name: "meta", color: "mute", w: 260 });
    const sample = k === "num" || k === "bign" ? [{ t: "20 000+", k: "g" }] : k === "lbl" ? "Виклик" : "Godlike.host × AIN";
    await txt(row, sample, k, "d", { name: "sample", color: k === "p" ? "mute" : k === "lbl" ? "lime" : "fg" });
  }
  root.y = -(root.height + 120); // above the components row
}
async function buildHandoff(page) {
  const root = AL("v", "Інструкція: Figma → Webflow → анімації");
  page.appendChild(root);
  root.x = 0;
  root.y = 0;
  setW(root, 1200);
  pad(root, 64);
  root.itemSpacing = 28;
  root.fills = [solid("bg")];
  const H = (s) => txt(root, s, "h2m", "d", { name: "h", w: "fill" });
  const P = (s) => txt(root, s, "p", "d", { name: "p", color: "soft", w: "fill" });
  await H("Як переносити у Webflow");
  await P(
    "1. Макет зібраний на Auto Layout, назви шарів = класи Webflow (sec, wrap, split, col, fig, stats, glass stat, quote тощо). Через плагін «Figma to Webflow» переносьте фрейм «Godlike × AIN — Desktop 1440» цілком, потім налаштуйте планшет і телефон за фреймом «Mobile 390».\n" +
      "2. Теги після імпорту: h1 — заголовок першого екрана, «h2 h» — Heading 2, «h3» — Heading 3, решта тексту — Paragraph. Кнопки «cta» — Link Block з посиланням на godlike.host.\n" +
      "3. Шрифт Gilroy (Medium 500, Bold 700, ExtraBold 800, Black 900) завантажте у Site settings → Fonts. Кольори з колекції змінних «Godlike / colors» плагін переносить як змінні Webflow.\n" +
      "4. Рожеві мітки праворуч від макета (і анотації в Dev Mode) — це атрибути, які треба додати елементам у Webflow: Element settings → Custom attributes. Самі мітки не імпортуйте (шар «↳ Webflow-мітки» заблокований).\n" +
      "5. Шари «fig-poster» і фон першого екрана — статичні кадри 3D-фігур і «потоку даних». У Webflow вони лишаються як картинки-заглушки: скрипт малює поверх них живі WebGL-фігури і приховує заглушку, коли фігура готова. На пристроях без WebGL залишиться картинка.\n" +
      "6. Скрипт анімацій підключається один раз у Page settings → Custom code (з GitHub через jsDelivr або з Vercel). Тексти, посилання й фото далі редагуються прямо у Webflow — скрипт прив’язаний до атрибутів, а не до тексту."
  );
  await H("Атрибути анімацій");
  await P(
    'data-anim="letters" — заголовок з’являється по літерах (h1, h2).\n' +
      'data-anim="words" — абзац або цитата з’являється по словах.\n' +
      'data-anim="scrub" — великий текст підсвічується слово за словом під час скролу.\n' +
      'data-anim="reveal" — блок плавно виїжджає й з’являється, коли потрапляє на екран.\n' +
      "data-count — число рахує від нуля до значення в тексті (13+, ~2, 20 000+, #23 …).\n" +
      'data-scene="0…13" — контейнер 3D-фігури (номер сцени як у мітці).\n' +
      "data-stream — фон першого екрана з «потоком даних» (натиснути й утримати — заряд, відпустити — хвиля).\n" +
      'data-marquee="l" / "r" — бігучий рядок, рухається разом зі скролом.\n' +
      "data-tilt — скляна картка нахиляється за курсором і підсвічується.\n" +
      "data-magnetic — кнопка трохи тягнеться за курсором.\n" +
      "data-menu — оверлей меню; пункти меню ведуть на id секцій (s1 … s13, end)."
  );
  await H("Що можна правити у Webflow без коду");
  await P(
    "Будь-які тексти, посилання кнопок, фото в цитатах і блоці «Ігор», порядок і кількість карток, кольори через змінні. Не видаляйте елементи з мітками data-… і не перейменовуйте їхні класи — інакше відповідна анімація не знайде свій елемент."
  );
  if (fontNote) await P("⚠️ " + fontNote);
}

/* ---------------- main ---------------- */
async function main() {
  await loadFonts();
  await makeStyles();
  const pages = {};
  const want = [
    ["handoff", "📋 Інструкція Webflow"],
    ["desktop", "🖥 Desktop 1440"],
    ["mobile", "📱 Mobile 390"],
    ["system", "🧩 Дизайн-система"],
  ];
  const first = figma.currentPage;
  for (let i = 0; i < want.length; i++) {
    let p;
    if (i === 0 && first && first.children.length === 0) {
      p = first;
      p.name = want[i][1];
    } else {
      p = figma.createPage();
      p.name = want[i][1];
    }
    pages[want[i][0]] = p;
  }
  await figma.setCurrentPageAsync(pages.system);
  const comps = [];
  for (const dev of ["d", "m"]) comps.push(...(await makeComponents(pages.system, dev)));
  let cx = 0;
  for (const c of comps) {
    c.x = cx;
    c.y = 400;
    cx += c.width + 40;
  }
  try {
    await buildSystem(pages.system);
  } catch (e) {
    warn("Дизайн-система: " + e.message);
  }

  await figma.setCurrentPageAsync(pages.desktop);
  const d = await buildPage(pages.desktop, "d", 0);
  await drawAnnotations(d, "d");
  try {
    await buildMenu(pages.desktop, d.width + 520);
  } catch (e) {
    warn("Меню: " + e.message);
  }
  ANN = [];

  await figma.setCurrentPageAsync(pages.mobile);
  const m = await buildPage(pages.mobile, "m", 0);
  await drawAnnotations(m, "m");

  await figma.setCurrentPageAsync(pages.handoff);
  try {
    await buildHandoff(pages.handoff);
  } catch (e) {
    warn("Інструкція: " + e.message);
  }
  if (LOG.length) {
    const box = AL("v", "⚠️ Звіт плагіна");
    pages.handoff.appendChild(box);
    box.x = 1300;
    box.y = 0;
    pad(box, 32);
    box.itemSpacing = 8;
    box.fills = [{ type: "SOLID", color: hex("#2a0d18") }];
    for (const l of LOG) await txt(box, l, "cap", "m", { name: "line", color: "soft", w: 600 });
  }
  await figma.setCurrentPageAsync(pages.desktop);
  figma.viewport.scrollAndZoomIntoView([d]);
  return "Готово: Desktop, Mobile, меню, дизайн-система та інструкція." + (fontNote ? " (Gilroy не знайдено — використано Inter)" : "") + (LOG.length ? " Попереджень: " + LOG.length : "");
}
main()
  .then((msg) => figma.closePlugin(msg))
  .catch((e) => figma.closePlugin("Помилка: " + (e && e.message ? e.message : e)));
