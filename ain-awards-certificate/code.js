/* Логотип AIN (знак + напис «ain»), обведений у вектор з godlike-landing/assets/ain-white.png */
const LOGO = {"W": 903, "H": 261, "markBox": [2, 37, 351, 259], "mark": "M91.00 257.92C50.71 254.51 15.61 225.17 5.53 186.47C2.55 175.00 1.74 163.92 2.27 141.52C2.88 115.74 4.29 108.58 11.94 92.50C17.54 80.73 23.37 72.72 32.86 63.77C41.73 55.40 47.00 51.82 58.37 46.44C76.22 37.98 78.39 37.70 128.75 37.26L173.00 36.87L173.00 147.93L173.00 259.00L136.75 258.86C116.81 258.78 96.22 258.36 91.00 257.92ZM188.67 258.33C188.30 257.97 188.00 208.02 188.00 147.33L188.00 37.00L213.75 37.01C254.57 37.02 276.42 39.16 290.74 44.56C314.61 53.54 337.10 76.91 344.58 100.48C349.83 117.03 350.24 123.24 350.73 193.75L351.17 259.00L270.25 259.00C225.75 259.00 189.03 258.70 188.67 258.33Z", "word": "M511.50 224.35C496.45 221.14 484.93 214.88 474.03 203.97C458.79 188.74 452.00 171.33 452.00 147.50C452.00 123.67 458.79 106.26 474.03 91.03C484.94 80.11 496.74 73.72 512.32 70.28C523.08 67.90 543.31 68.20 553.50 70.88C563.22 73.44 576.07 79.62 582.88 85.00L587.92 88.99L588.21 80.24L588.50 71.50L611.00 71.50L633.50 71.50L633.76 147.75L634.01 224.00L611.04 224.00L588.07 224.00L587.78 213.99L587.50 203.98L582.00 208.52C571.79 216.95 560.97 221.94 547.16 224.59C537.81 226.39 520.53 226.27 511.50 224.35ZM662.24 147.75L662.50 71.50L685.25 71.23L708.00 70.96L708.00 147.48L708.00 224.00L684.99 224.00L661.99 224.00L662.24 147.75ZM738.00 147.50L738.00 71.00L759.38 71.00C784.22 71.00 781.96 69.73 781.99 83.75C781.99 88.29 782.37 92.00 782.83 92.00C783.28 92.00 784.74 90.83 786.08 89.39C792.94 82.01 807.14 73.96 818.85 70.81C828.86 68.12 847.55 67.89 857.00 70.35C878.00 75.79 892.33 90.29 898.69 112.50C900.19 117.75 900.45 125.10 900.76 171.25L901.11 224.00L878.06 224.00L855.00 224.00L855.00 178.04C855.00 134.46 854.90 131.80 852.99 126.71C850.38 119.72 845.04 113.59 838.64 110.21C833.96 107.75 832.52 107.51 822.50 107.50C812.24 107.50 811.05 107.71 804.88 110.64C796.27 114.72 790.73 119.82 787.28 126.84L784.50 132.50L784.21 178.25L783.92 224.00L760.96 224.00L738.00 224.00L738.00 147.50ZM554.00 186.94C576.46 183.33 590.36 166.21 588.70 144.21C586.91 120.53 566.48 105.47 538.59 107.26C513.87 108.84 497.00 125.16 497.00 147.50C497.00 175.17 521.55 192.16 554.00 186.94ZM674.14 47.91C668.70 46.25 663.52 42.26 660.92 37.73C658.94 34.28 658.50 32.11 658.50 25.92C658.50 19.23 658.85 17.77 661.53 13.44C663.85 9.68 665.95 7.82 670.46 5.52C675.66 2.86 677.36 2.50 684.93 2.51C689.64 2.51 695.26 3.13 697.42 3.89C702.66 5.73 709.62 12.30 711.11 16.83C712.56 21.21 712.58 30.46 711.16 34.14C709.59 38.18 704.15 43.88 699.59 46.24C694.89 48.69 679.92 49.67 674.14 47.91Z"};

/* AIN Awards 2026 — сертифікати партнера Molfar Intelligence (3 окремі сертифікати).
   На сертифікатах ТІЛЬКИ текст із брифу (PRIZES) і логотип AIN. Решта — графіка без слів.
   Єдиний опис сцени: його читають Figma-плагін (figma-render.js) і HTML-прев'ю (html-render.js).
   Координати в px, формат A4 landscape 1754×1240. */

const PRIZES = [
  {
    key: "background-check",
    title: "Background check",
    by: "від Molfar Intelligence",
    desc: "Оберіть компанію чи людину, яку хочете перевірити. Аналітики дослідять власників і пов’язаних осіб, корпоративну історію, репутаційні та санкційні ризики. Висновки ви отримаєте в письмовому звіті.",
  },
  {
    key: "osint-course",
    descW: 980,
    title: "Курс з OSINT",
    by: "від Molfar Intelligence Institute",
    desc: "Це доступ до онлайн-курсу з розвідки з відкритих джерел. Аналітики-практики навчать вас шукати, перевіряти й аналізувати відкриту інформацію. Вчитися можна у власному темпі.",
  },
  {
    key: "minos-month",
    title: "Місяць доступу до Minos",
    by: null,
    desc: "Minos — це платформа Molfar Intelligence для моніторингу інформаційних загроз і реагування на них. Протягом місяця з дня активації ви користуєтеся нею безкоштовно.",
  },
];

/* палітра AIN Awards 2026 */
const PAL = {
  base1: "#0A0A0B", base2: "#1C0B0A",
  red: "#C2382E", ember: "#F06A4E", flash: "#FFD9CC", peach: "#FF8F73", cream: "#F3F3EB", white: "#FFFFFF",
};
const W = 1754, H = 1240, CX = W / 2;

const solid = (c, a) => ({ k: "solid", c, a: a == null ? 1 : a });
const lin = (dir, stops) => ({ k: "lin", dir, stops });
const rad = (c, a) => ({ k: "rad", stops: [[0, c, a], [0.4, c, a * 0.7], [0.7, c, a * 0.24], [1, c, 0]] });
const lh = (sz, ratio) => Math.round(sz * ratio * 10) / 10;
function text(o) {
  return Object.assign({ t: "text", f: "dr", c: PAL.white, a: 1, al: "l", ls: 0 }, o, { lh: lh(o.sz, o.lhr || 1.3) });
}
const glow = (name, cx, cy, w, h, c, a, blur) => ({ t: "ellipse", n: name, x: cx - w / 2, y: cy - h / 2, w, h, fill: rad(c, a), blur });
const bar = (name, x, y, w, h, c, a) => ({ t: "frame", n: name, x, y, w, h, fill: solid(c, a) });

/* логотип AIN (знак + напис) */
const logoSvg = (w, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round((w * LOGO.H) / LOGO.W * 10) / 10}" viewBox="0 0 ${LOGO.W} ${LOGO.H}" fill="none"><path d="${LOGO.mark}" fill="${color}"/><path d="${LOGO.word}" fill="${color}"/></svg>`;

const ENG = "Certificate";

function certificate(p) {
  const group = {
    t: "frame", n: "текст", cx: CX, cy: 618, w: "hug", h: "hug", layout: "V", gap: 40, align: "center",
    ch: [
      text({ n: "Certificate", s: ENG, w: 1400, al: "c", f: "serif", sz: 172, lhr: 1.0, ls: 0.01, c: PAL.cream }),
      bar("риска", 0, 0, 72, 1, PAL.peach, 0.9),
      {
        t: "frame", n: "назва", w: "hug", h: "hug", layout: "V", gap: 16, align: "center",
        ch: [
          text({ n: "title", s: p.title, w: 1300, al: "c", f: "dm", sz: 54, lhr: 1.15, ls: 0.08, c: PAL.cream, caps: true }),
          ...(p.by ? [text({ n: "by", s: p.by, w: 1000, al: "c", f: "dr", sz: 30, lhr: 1.3, ls: 0.01, c: PAL.peach })] : []),
        ],
      },
      text({ n: "desc", s: p.desc, w: p.descW || 900, al: "c", f: "dr", sz: 24, lhr: 1.6, c: PAL.white, a: 0.7 }),
    ],
  };
  return {
    t: "frame", n: "AIN Awards 2026 — " + p.title + (p.by ? " " + p.by : ""), x: 0, y: 0, w: W, h: H, clip: true,
    fill: lin("v", [[0, PAL.base1], [1, PAL.base2]]),
    shadows: [{ inner: true, x: 0, y: 0, blur: 140, c: PAL.ember, a: 0.2 }],
    ch: [
      glow("Сяйво / низ", CX, 1260, 1800, 800, PAL.red, 0.66, 90),
      glow("Сяйво / верх-ліво", 120, 20, 900, 520, PAL.red, 0.26, 80),
      glow("Сяйво / верх-право", W - 120, 20, 900, 520, PAL.red, 0.2, 80),
      glow("Ядро", CX, 1236, 960, 260, PAL.ember, 0.55, 55),
      glow("Спалах", CX, 1240, 460, 90, PAL.flash, 0.4, 30),
      { t: "frame", n: "Рамка", x: 44, y: 44, w: W - 88, h: H - 88, stroke: { c: PAL.cream, a: 0.24, w: 1 } },
      { t: "frame", n: "Рамка внутрішня", x: 60, y: 60, w: W - 120, h: H - 120, stroke: { c: PAL.cream, a: 0.1, w: 1 } },
      { t: "svg", n: "AIN logo", cx: CX, y: 124, w: 132, h: 38.2, svg: logoSvg(132, PAL.cream) },
      group,
    ],
  };
}

function buildScenes() {
  return PRIZES.map(certificate);
}

/* Figma-рендерер сцени зі spec.js. Запускається як плагін у Figma Desktop. */
const NOTES = [];
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const rgbaF = (h, a) => Object.assign(hex(h), { a: a == null ? 1 : a });

/* ---------- шрифти ---------- */
const FONT_WANT = {
  dm: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Medium", "Regular"], fb: { family: "Inter", style: "Medium" } },
  dr: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Regular", "Medium"], fb: { family: "Inter", style: "Regular" } },
  serif: { families: ["Cormorant Garamond", "Cormorant", "Playfair Display", "EB Garamond"], styles: ["Light", "Regular"], fb: { family: "Inter", style: "Light" } },
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
