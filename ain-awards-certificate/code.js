/* Логотип AIN (знак + напис «ain»), обведений у вектор з godlike-landing/assets/ain-white.png */
const LOGO = {"W": 903, "H": 261, "markBox": [2, 37, 351, 259], "mark": "M91.00 257.92C50.71 254.51 15.61 225.17 5.53 186.47C2.55 175.00 1.74 163.92 2.27 141.52C2.88 115.74 4.29 108.58 11.94 92.50C17.54 80.73 23.37 72.72 32.86 63.77C41.73 55.40 47.00 51.82 58.37 46.44C76.22 37.98 78.39 37.70 128.75 37.26L173.00 36.87L173.00 147.93L173.00 259.00L136.75 258.86C116.81 258.78 96.22 258.36 91.00 257.92ZM188.67 258.33C188.30 257.97 188.00 208.02 188.00 147.33L188.00 37.00L213.75 37.01C254.57 37.02 276.42 39.16 290.74 44.56C314.61 53.54 337.10 76.91 344.58 100.48C349.83 117.03 350.24 123.24 350.73 193.75L351.17 259.00L270.25 259.00C225.75 259.00 189.03 258.70 188.67 258.33Z", "word": "M511.50 224.35C496.45 221.14 484.93 214.88 474.03 203.97C458.79 188.74 452.00 171.33 452.00 147.50C452.00 123.67 458.79 106.26 474.03 91.03C484.94 80.11 496.74 73.72 512.32 70.28C523.08 67.90 543.31 68.20 553.50 70.88C563.22 73.44 576.07 79.62 582.88 85.00L587.92 88.99L588.21 80.24L588.50 71.50L611.00 71.50L633.50 71.50L633.76 147.75L634.01 224.00L611.04 224.00L588.07 224.00L587.78 213.99L587.50 203.98L582.00 208.52C571.79 216.95 560.97 221.94 547.16 224.59C537.81 226.39 520.53 226.27 511.50 224.35ZM662.24 147.75L662.50 71.50L685.25 71.23L708.00 70.96L708.00 147.48L708.00 224.00L684.99 224.00L661.99 224.00L662.24 147.75ZM738.00 147.50L738.00 71.00L759.38 71.00C784.22 71.00 781.96 69.73 781.99 83.75C781.99 88.29 782.37 92.00 782.83 92.00C783.28 92.00 784.74 90.83 786.08 89.39C792.94 82.01 807.14 73.96 818.85 70.81C828.86 68.12 847.55 67.89 857.00 70.35C878.00 75.79 892.33 90.29 898.69 112.50C900.19 117.75 900.45 125.10 900.76 171.25L901.11 224.00L878.06 224.00L855.00 224.00L855.00 178.04C855.00 134.46 854.90 131.80 852.99 126.71C850.38 119.72 845.04 113.59 838.64 110.21C833.96 107.75 832.52 107.51 822.50 107.50C812.24 107.50 811.05 107.71 804.88 110.64C796.27 114.72 790.73 119.82 787.28 126.84L784.50 132.50L784.21 178.25L783.92 224.00L760.96 224.00L738.00 224.00L738.00 147.50ZM554.00 186.94C576.46 183.33 590.36 166.21 588.70 144.21C586.91 120.53 566.48 105.47 538.59 107.26C513.87 108.84 497.00 125.16 497.00 147.50C497.00 175.17 521.55 192.16 554.00 186.94ZM674.14 47.91C668.70 46.25 663.52 42.26 660.92 37.73C658.94 34.28 658.50 32.11 658.50 25.92C658.50 19.23 658.85 17.77 661.53 13.44C663.85 9.68 665.95 7.82 670.46 5.52C675.66 2.86 677.36 2.50 684.93 2.51C689.64 2.51 695.26 3.13 697.42 3.89C702.66 5.73 709.62 12.30 711.11 16.83C712.56 21.21 712.58 30.46 711.16 34.14C709.59 38.18 704.15 43.88 699.59 46.24C694.89 48.69 679.92 49.67 674.14 47.91Z"};

/* AIN Awards 2026 — сертифікати партнера Molfar Intelligence.
   Два напрямки (A — «швейцарський», B — «розкіш») × 3 призи + мокапи в подарунковому конверті.
   На сертифікатах: слово Certificate, ТЕКСТ ІЗ БРИФУ (PRIZES) і логотип AIN. Решта — тільки графіка.
   Єдиний опис сцени: його читають Figma-плагін (figma-render.js) і HTML-прев'ю (html-render.js).
   Сертифікат — A4 portrait 1240×1754, мокап — 1080×1920. */

const PRIZES = [
  {
    key: "background-check", title: "Background check", by: "від Molfar Intelligence",
    desc: "Оберіть компанію чи людину, яку хочете перевірити. Аналітики дослідять власників і пов’язаних осіб, корпоративну історію, репутаційні та санкційні ризики. Висновки ви отримаєте в письмовому звіті.",
  },
  {
    key: "osint-course", title: "Курс з OSINT", by: "від Molfar Intelligence Institute",
    desc: "Це доступ до онлайн-курсу з розвідки з відкритих джерел. Аналітики-практики навчать вас шукати, перевіряти й аналізувати відкриту інформацію. Вчитися можна у власному темпі.",
  },
  {
    key: "minos-month", title: "Місяць доступу до Minos", by: null,
    desc: "Minos — це платформа Molfar Intelligence для моніторингу інформаційних загроз і реагування на них. Протягом місяця з дня активації ви користуєтеся нею безкоштовно.",
  },
];
const ENG = "Certificate";

/* палітра AIN Awards 2026 */
const PAL = {
  base1: "#0A0A0B", base2: "#1C0B0A",
  red: "#C2382E", ember: "#F06A4E", flash: "#FFD9CC", peach: "#FF8F73", cream: "#F3F3EB", white: "#FFFFFF",
};
const W = 1240, H = 1754, CX = W / 2;

const solid = (c, a) => ({ k: "solid", c, a: a == null ? 1 : a });
const lin = (dir, stops) => ({ k: "lin", dir, stops });
const rad = (c, a) => ({ k: "rad", stops: [[0, c, a], [0.4, c, a * 0.7], [0.7, c, a * 0.24], [1, c, 0]] });
const lh = (sz, ratio) => Math.round(sz * ratio * 10) / 10;
function text(o) {
  return Object.assign({ t: "text", f: "dr", c: PAL.white, a: 1, al: "l", ls: 0 }, o, { lh: lh(o.sz, o.lhr || 1.3) });
}
const glow = (name, cx, cy, w, h, c, a, blur) => ({ t: "ellipse", n: name, x: cx - w / 2, y: cy - h / 2, w, h, fill: rad(c, a), blur });
const bar = (name, x, y, w, h, c, a) => ({ t: "frame", n: name, x, y, w, h, fill: solid(c, a) });

/* логотип AIN (знак + напис) і окремо знак */
const logoSvg = (w, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round((w * LOGO.H) / LOGO.W * 10) / 10}" viewBox="0 0 ${LOGO.W} ${LOGO.H}" fill="none"><path d="${LOGO.mark}" fill="${color}"/><path d="${LOGO.word}" fill="${color}"/></svg>`;
const markSvg = (w, color) => {
  const b = LOGO.markBox, bw = b[2] - b[0], bh = b[3] - b[1];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(((w * bh) / bw) * 10) / 10}" viewBox="${b[0]} ${b[1]} ${bw} ${bh}" fill="none"><path d="${LOGO.mark}" fill="${color}"/></svg>`;
};

/* ---------- стрічки (лінійний арт для варіанта B) ---------- */
function bez(pts) {
  const f = (v) => Math.round(v * 10) / 10;
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    d += `C${f(p1[0] + (p2[0] - p0[0]) / 6)} ${f(p1[1] + (p2[1] - p0[1]) / 6)} ${f(p2[0] - (p3[0] - p1[0]) / 6)} ${f(p2[1] - (p3[1] - p1[1]) / 6)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}
function ribbonSvg(o) {
  const N = o.n || 30, M = 34, paths = [];
  for (let i = 0; i < N; i++) {
    const s = -1 + (2 * i) / (N - 1), pts = [];
    for (let k = 0; k <= M; k++) {
      const t = k / M, y = -60 + t * (H + 120);
      const xc = o.x0 + o.A * Math.sin(2 * Math.PI * o.f * t + o.ph) + o.A2 * Math.sin(2 * Math.PI * o.f2 * t + o.ph3);
      const wv = o.Wmax * Math.sin(2 * Math.PI * o.g * t + o.ph2);
      let x = xc + (s * wv) / 2;
      if (o.mirror) x = W - x;
      pts.push([x, y]);
    }
    const a = (0.12 + 0.55 * Math.pow(Math.abs(s), 1.6)).toFixed(2);
    paths.push(`<path d="${bez(pts)}" stroke="${o.c}" stroke-opacity="${a}" stroke-width="1" stroke-linecap="round" fill="none"/>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">${paths.join("")}</svg>`;
}

/* ---------- напрямок A: «швейцарський» (за 1-м референсом) ---------- */
function certA(p) {
  const title = [text({ n: "title", s: p.title, w: 720, f: "dm", sz: 36, lhr: 1.2, ls: 0.07, c: PAL.cream, caps: true })];
  if (p.by) title.push(text({ n: "by", s: p.by, w: 720, f: "dr", sz: 26, lhr: 1.3, c: PAL.peach }));
  return {
    t: "frame", n: "A · Swiss — " + p.title, x: 0, y: 0, w: W, h: H, clip: true,
    fill: lin("v", [[0, "#0B0707"], [1, "#160909"]]),
    ch: [
      glow("Сяйво / право-низ", W - 40, H - 120, 1100, 1000, PAL.red, 0.5, 90),
      glow("Ядро", W - 40, H, 700, 500, PAL.ember, 0.4, 60),
      glow("Сяйво / ліво-верх", 0, 0, 800, 600, PAL.red, 0.14, 80),
      text({
        n: "Certificate (великий)", s: ENG, f: "dm", sz: 270, lhr: 1.0, ls: -0.02, caps: true, fit: 1900,
        fill: lin("h", [[0, PAL.ember], [0.5, PAL.red], [1, "#5C1612"]]),
        x: W - 78, y: H / 2, ctr: true, rot: -90,
      }),
      { t: "svg", n: "AIN logo", x: 100, y: 108, w: 150, h: 43.4, svg: logoSvg(150, PAL.cream) },
      {
        t: "frame", n: "текст", x: 100, cy: 900, w: "hug", h: "hug", layout: "V", gap: 70, align: "start",
        ch: [
          text({ n: "Certificate", s: ENG, w: 780, f: "dr", sz: 100, lhr: 1.05, ls: 0.01, c: PAL.cream, caps: true }),
          { t: "frame", n: "назва", w: "hug", h: "hug", layout: "V", gap: 12, align: "start", ch: title },
          text({ n: "desc", s: p.desc, w: 660, f: "dr", sz: 25, lhr: 1.62, c: PAL.white, a: 0.72 }),
        ],
      },
    ],
  };
}

/* ---------- напрямок B: «розкіш» (за 2-м референсом) ---------- */
function certB(p, i) {
  const foil = lin("v", [[0, "#FFFFFF"], [0.55, "#FFD3C2"], [1, "#FF9A80"]]);
  /* розмах обмежено: x0+A+A2+Wmax/2 = 269 < 270 — стрічка не заходить у текстову колонку (270…970) */
  const base = { c: "#FFC7B3", A: 40, A2: 14, f: 1.05, f2: 2.3, ph3: 1.3, Wmax: 170, g: 1.35 };
  const L = Object.assign({}, base, { x0: 130, ph: 0.5 + i * 0.7, ph2: 0.9 + i * 0.5 });
  const R = Object.assign({}, base, { x0: 130, ph: 2.1 + i * 0.6, ph2: 2.4 + i * 0.4, mirror: true });
  const title = [text({ n: "title", s: p.title, w: 760, al: "c", f: "dm", sz: 40, lhr: 1.2, ls: 0.08, c: PAL.cream, caps: true })];
  if (p.by) title.push(text({ n: "by", s: p.by, w: 760, al: "c", f: "dr", sz: 27, lhr: 1.3, c: PAL.peach }));
  return {
    t: "frame", n: "B · Luxury — " + p.title, x: 0, y: 0, w: W, h: H, clip: true,
    fill: lin("v", [[0, "#060606"], [1, "#130707"]]),
    ch: [
      glow("Сяйво / низ", CX, H + 40, 1500, 900, PAL.red, 0.62, 90),
      glow("Ядро", CX, H - 10, 800, 240, PAL.ember, 0.5, 55),
      glow("Спалах", CX, H, 380, 80, PAL.flash, 0.35, 30),
      glow("Сяйво / стрічка L", 90, 900, 360, 1100, PAL.red, 0.18, 80),
      glow("Сяйво / стрічка R", W - 90, 900, 360, 1100, PAL.red, 0.18, 80),
      { t: "svg", n: "Стрічка L", x: 0, y: 0, w: W, h: H, svg: ribbonSvg(L) },
      { t: "svg", n: "Стрічка R", x: 0, y: 0, w: W, h: H, svg: ribbonSvg(R) },
      { t: "frame", n: "Рамка", x: 64, y: 64, w: W - 128, h: H - 128, stroke: { c: PAL.peach, a: 0.5, w: 1.2 } },
      { t: "svg", n: "AIN logo", cx: CX, y: 150, w: 170, h: 49.1, svg: logoSvg(170, PAL.cream) },
      {
        t: "frame", n: "текст", cx: CX, cy: 900, w: "hug", h: "hug", layout: "V", gap: 44, align: "center",
        ch: [
          text({ n: "Certificate", s: ENG, w: 1000, al: "c", f: "serif", sz: 92, lhr: 1.1, ls: 0.16, caps: true, fill: foil }),
          bar("риска", 0, 0, 560, 1, PAL.peach, 0.55),
          { t: "frame", n: "назва", w: "hug", h: "hug", layout: "V", gap: 14, align: "center", ch: title },
          text({ n: "desc", s: p.desc, w: 700, al: "c", f: "dr", sz: 25, lhr: 1.62, c: PAL.white, a: 0.72 }),
        ],
      },
    ],
  };
}

/* ---------- масштабування вузла (для картки в мокапі) ---------- */
function scaleNode(n, s) {
  const o = Object.assign({}, n), r2 = (v) => Math.round(v * s * 100) / 100;
  ["x", "y", "w", "h", "cx", "cy", "right", "sz", "lh", "gap", "blur", "bgBlur", "fit"].forEach((k) => {
    if (typeof o[k] === "number") o[k] = r2(o[k]);
  });
  if (n.t === "frame" && typeof n.h === "number" && n.h <= 3) o.h = Math.max(0.6, o.h);
  if (n.t === "frame" && typeof n.w === "number" && n.w <= 3) o.w = Math.max(0.6, o.w);
  if (Array.isArray(o.r)) o.r = o.r.map(r2); else if (typeof o.r === "number") o.r = r2(o.r);
  if (o.pad) o.pad = o.pad.map(r2);
  if (o.stroke) o.stroke = Object.assign({}, o.stroke, { w: Math.max(0.5, r2(o.stroke.w)) });
  if (o.shadows) o.shadows = o.shadows.map((sh) => Object.assign({}, sh, { x: r2(sh.x || 0), y: r2(sh.y || 0), blur: r2(sh.blur), spread: r2(sh.spread || 0) }));
  if (o.svg) o.svg = o.svg.replace(/width="[^"]+" height="[^"]+"/, `width="${o.w}" height="${o.h}"`);
  if (o.ch) o.ch = o.ch.map((c) => scaleNode(c, s));
  return o;
}

/* ---------- мокап: сертифікат у подарунковому конверті (за 3-м референсом) ---------- */
function mockup(makeCert, p, i, label) {
  const MW = 1080, MH = 1920;
  const cw = 500, chh = Math.round((cw * H) / W), s = cw / W;
  const SW = 560, SH = 780, sx = (MW - SW) / 2, sy = 850;
  const sleeveD = "M 0 0 L 226 0 L 266 44 C 275.33 53.33 284.67 53.33 294 44 L 334 0 L 560 0 L 560 780 L 0 780 Z";
  const sleeveBase = "#8A221E";
  const card = {
    t: "frame", n: "Сертифікат у конверті", x: (MW - cw) / 2, y: 330, w: cw, h: chh, clip: true, fill: solid("#0A0A0B"),
    shadows: [{ x: 0, y: 10, blur: 40, c: "#000000", a: 0.5 }],
    ch: [scaleNode(makeCert(p, i), s)],
  };
  const emb = (dx, dy, c, op, name) => ({ t: "svg", n: name, x: MW / 2 - 60 + dx, y: sy + SH - 215 + dy, w: 120, h: 76.3, svg: markSvg(120, c), op });
  return {
    t: "frame", n: "Пакування " + label + " — " + p.title, x: 0, y: 0, w: MW, h: MH, clip: true,
    fill: solid("#111010"),
    ch: [
      card,
      {
        t: "path", n: "Конверт", x: sx, y: sy, w: SW, h: SH, d: sleeveD,
        fill: [solid(sleeveBase), lin("v", [[0, "#FFFFFF", 0.07], [0.5, "#FFFFFF", 0], [1, "#000000", 0.18]])],
        shadows: [{ x: 0, y: -8, blur: 30, c: "#000000", a: 0.45 }, { x: 0, y: 40, blur: 80, c: "#000000", a: 0.55 }],
      },
      emb(1.4, 1.4, "#000000", 0.38, "тиснення тінь"),
      emb(-1.2, -1.2, "#FFFFFF", 0.26, "тиснення світло"),
      emb(0, 0, "#86201C", 1, "тиснення знак"),
    ],
  };
}

function buildScenes() {
  const out = [];
  [["A", certA, "A · Swiss"], ["B", certB, "B · Luxury"]].forEach(([g, fn, title]) => {
    PRIZES.forEach((p, i) => out.push(Object.assign(fn(p, i), { grp: g, grpTitle: title, row: 0, pv: g + "-" + (i + 1) })));
    PRIZES.forEach((p, i) => out.push(Object.assign(mockup(fn, p, i, g), { grp: g, grpTitle: title, row: 1, pv: "mock-" + g + "-" + (i + 1) })));
  });
  return out;
}

/* Figma-рендерер сцени зі spec.js. Запускається як плагін у Figma Desktop. */
const NOTES = [];
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const rgbaF = (h, a) => Object.assign(hex(h), { a: a == null ? 1 : a });

/* ---------- шрифти ---------- */
const FONT_WANT = {
  dm: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Medium", "Regular"], fb: { family: "Inter", style: "Medium" } },
  dr: { families: ["Basis Grotesque Pro", "Basis Grotesque"], styles: ["Regular", "Medium"], fb: { family: "Inter", style: "Regular" } },
  serif: { families: ["Cormorant Garamond", "Cormorant", "Playfair Display", "EB Garamond"], styles: ["Medium", "SemiBold", "Regular"], fb: { family: "Inter", style: "Medium" } },
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
  t.fills = n.fill ? [].concat(n.fill).map(paintFrom) : [{ type: "SOLID", color: hex(n.c), opacity: n.a == null ? 1 : n.a }];
  if (n.fit && t.width > 0) {
    const k = Math.min(3, Math.max(0.3, n.fit / t.width));
    t.fontSize = n.sz * k;
    t.lineHeight = { unit: "PIXELS", value: n.lh * k };
  }
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
  } else if (n.t === "path") {
    node = figma.createVector();
    node.name = n.n || "path";
    node.vectorPaths = [{ windingRule: "NONZERO", data: n.d }];
    node.strokes = [];
    applyShape(node, n);
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
  if (n.op != null) node.opacity = n.op;
  if (!parentIsLayout) place(node, n, parent);
  return node;
}

/* ---------- запуск ---------- */
async function main() {
  try { await figma.loadFontAsync({ family: "Inter", style: "Regular" }); } catch (e) {}
  await loadFonts();
  const scenes = buildScenes();
  let baseX = 0;
  figma.currentPage.children.forEach((c) => { baseX = Math.max(baseX, c.x + c.width + 300); });
  /* Збираємо все у дві секції: A · Swiss і B · Luxury (зверху сертифікати, знизу пакування) */
  const PAD = 120, GAP = 100, ROWGAP = 160, COLW = 1240, CERT_H = 1754, MOCK_H = 1920;
  const secW = PAD * 2 + 3 * COLW + 2 * GAP, secH = PAD + CERT_H + ROWGAP + MOCK_H + PAD;
  const groups = {};
  scenes.forEach((sc) => { (groups[sc.grp] = groups[sc.grp] || { title: sc.grpTitle, list: [] }).list.push(sc); });
  const made = [];
  let gx = baseX;
  Object.keys(groups).forEach((g) => {
    let container = figma.currentPage, ox = gx, oy = 0, sec = null;
    try {
      sec = figma.createSection();
      sec.name = groups[g].title + " — сертифікати та пакування";
      sec.x = gx; sec.y = 0;
      sec.resizeWithoutConstraints(secW, secH);
      sec.fills = [{ type: "SOLID", color: hex("#1A1A1A") }];
      container = sec; ox = 0; oy = 0;
      made.push(sec);
    } catch (e) {
      NOTES.push("Секції недоступні, макети розкладено на сторінці.");
      sec = null;
    }
    const cnt = [0, 0];
    groups[g].list.forEach((sc) => {
      const col = cnt[sc.row]++;
      const x = ox + PAD + col * (COLW + GAP) + (COLW - sc.w) / 2;
      const y = oy + (sc.row === 0 ? PAD : PAD + CERT_H + ROWGAP);
      const root = build(Object.assign({}, sc, { x, y }), container, false);
      if (!sec) made.push(root);
    });
    gx += secW + 400;
  });
  figma.currentPage.selection = made;
  figma.viewport.scrollAndZoomIntoView(made);
  return "Готово: " + scenes.length + " макетів (3 призи × 2 стилі × сертифікат і пакування). " + NOTES.join(" ");
}
main().then((m) => figma.closePlugin(m)).catch((e) => figma.closePlugin("Помилка: " + (e && e.message ? e.message : e)));
