/* Логотип AIN (знак + напис «ain»), обведений у вектор з godlike-landing/assets/ain-white.png */
const LOGO = {"W": 903, "H": 261, "markBox": [2, 37, 351, 259], "mark": "M91.00 257.92C50.71 254.51 15.61 225.17 5.53 186.47C2.55 175.00 1.74 163.92 2.27 141.52C2.88 115.74 4.29 108.58 11.94 92.50C17.54 80.73 23.37 72.72 32.86 63.77C41.73 55.40 47.00 51.82 58.37 46.44C76.22 37.98 78.39 37.70 128.75 37.26L173.00 36.87L173.00 147.93L173.00 259.00L136.75 258.86C116.81 258.78 96.22 258.36 91.00 257.92ZM188.67 258.33C188.30 257.97 188.00 208.02 188.00 147.33L188.00 37.00L213.75 37.01C254.57 37.02 276.42 39.16 290.74 44.56C314.61 53.54 337.10 76.91 344.58 100.48C349.83 117.03 350.24 123.24 350.73 193.75L351.17 259.00L270.25 259.00C225.75 259.00 189.03 258.70 188.67 258.33Z", "word": "M511.50 224.35C496.45 221.14 484.93 214.88 474.03 203.97C458.79 188.74 452.00 171.33 452.00 147.50C452.00 123.67 458.79 106.26 474.03 91.03C484.94 80.11 496.74 73.72 512.32 70.28C523.08 67.90 543.31 68.20 553.50 70.88C563.22 73.44 576.07 79.62 582.88 85.00L587.92 88.99L588.21 80.24L588.50 71.50L611.00 71.50L633.50 71.50L633.76 147.75L634.01 224.00L611.04 224.00L588.07 224.00L587.78 213.99L587.50 203.98L582.00 208.52C571.79 216.95 560.97 221.94 547.16 224.59C537.81 226.39 520.53 226.27 511.50 224.35ZM662.24 147.75L662.50 71.50L685.25 71.23L708.00 70.96L708.00 147.48L708.00 224.00L684.99 224.00L661.99 224.00L662.24 147.75ZM738.00 147.50L738.00 71.00L759.38 71.00C784.22 71.00 781.96 69.73 781.99 83.75C781.99 88.29 782.37 92.00 782.83 92.00C783.28 92.00 784.74 90.83 786.08 89.39C792.94 82.01 807.14 73.96 818.85 70.81C828.86 68.12 847.55 67.89 857.00 70.35C878.00 75.79 892.33 90.29 898.69 112.50C900.19 117.75 900.45 125.10 900.76 171.25L901.11 224.00L878.06 224.00L855.00 224.00L855.00 178.04C855.00 134.46 854.90 131.80 852.99 126.71C850.38 119.72 845.04 113.59 838.64 110.21C833.96 107.75 832.52 107.51 822.50 107.50C812.24 107.50 811.05 107.71 804.88 110.64C796.27 114.72 790.73 119.82 787.28 126.84L784.50 132.50L784.21 178.25L783.92 224.00L760.96 224.00L738.00 224.00L738.00 147.50ZM554.00 186.94C576.46 183.33 590.36 166.21 588.70 144.21C586.91 120.53 566.48 105.47 538.59 107.26C513.87 108.84 497.00 125.16 497.00 147.50C497.00 175.17 521.55 192.16 554.00 186.94ZM674.14 47.91C668.70 46.25 663.52 42.26 660.92 37.73C658.94 34.28 658.50 32.11 658.50 25.92C658.50 19.23 658.85 17.77 661.53 13.44C663.85 9.68 665.95 7.82 670.46 5.52C675.66 2.86 677.36 2.50 684.93 2.51C689.64 2.51 695.26 3.13 697.42 3.89C702.66 5.73 709.62 12.30 711.11 16.83C712.56 21.21 712.58 30.46 711.16 34.14C709.59 38.18 704.15 43.88 699.59 46.24C694.89 48.69 679.92 49.67 674.14 47.91Z"};

/* AIN Awards 2026 — сертифікати партнера Molfar Intelligence (3 окремі сертифікати).
   Єдиний опис сцени: його читають і Figma-плагін (figma-render.js), і HTML-прев'ю (html-render.js).
   Тексти — у COPY і PRIZES. Координати в px, формат A4 landscape 1754×1240. */

const COPY = {
  eyebrow: "AIN Awards 2026 · Приз",
  title: "Сертифікат",
  lead1: "Цим підтверджується, що",
  name: "Ім’я Прізвище",
  lead2: "отримує у подарунок",
  byPrefix: "від ",
  ring: "AIN AWARDS 2026 · MOLFAR INTELLIGENCE · ",
  micro: "AIN AWARDS 2026 · MOLFAR INTELLIGENCE · ",
  no: ["Сертифікат №", "AIN-0001"],
  date: ["Видано", "19.12.2026"],
  valid: ["Активувати до", "дд.мм.рррр"],
  sign: [["AIN Awards", "Організатор премії"], ["Molfar Intelligence", "Партнер премії"]],
};
const PRIZES = [
  {
    key: "background-check",
    no: "01",
    title: "Background check",
    by: "Molfar Intelligence",
    desc: "Оберіть компанію чи людину, яку хочете перевірити. Аналітики дослідять власників і пов’язаних осіб, корпоративну історію, репутаційні та санкційні ризики. Висновки ви отримаєте в письмовому звіті.",
  },
  {
    key: "osint-course",
    no: "02",
    descW: 1080,
    title: "Курс з OSINT",
    by: "Molfar Intelligence Institute",
    desc: "Доступ до онлайн-курсу з розвідки з відкритих джерел. Аналітики-практики навчать вас шукати, перевіряти й аналізувати відкриту інформацію. Вчитися можна у власному темпі.",
  },
  {
    key: "minos-month",
    no: "03",
    title: "Місяць доступу до Minos",
    by: "Molfar Intelligence",
    desc: "Minos — платформа Molfar Intelligence для моніторингу інформаційних загроз і реагування на них. Протягом місяця з дня активації ви користуєтеся нею безкоштовно.",
  },
];

/* палітра AIN Awards 2026 */
const PAL = {
  black: "#000000", base1: "#0A0A0B", base2: "#240D0B", disc: "#260C0B",
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
/* текст по центру сторінки у блоці заданої ширини */
const ctext = (o, w) => text(Object.assign({ w: w || 1100, x: CX - (w || 1100) / 2, al: "c" }, o));
const glow = (name, cx, cy, w, h, c, a, blur) => ({ t: "ellipse", n: name, x: cx - w / 2, y: cy - h / 2, w, h, fill: rad(c, a), blur });
const dot = (name, cx, cy, s, c, a) => ({ t: "frame", n: name, x: cx, y: cy, w: s, h: s, ctr: true, rot: 45, fill: solid(c, a) });
const rule = (name, x, y, w, a) => ({ t: "frame", n: name, x, y, w, h: 1, fill: solid(PAL.cream, a) });

/* логотип */
const logoSvg = (w, color) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round((w * LOGO.H) / LOGO.W * 10) / 10}" viewBox="0 0 ${LOGO.W} ${LOGO.H}" fill="none"><path d="${LOGO.mark}" fill="${color}"/><path d="${LOGO.word}" fill="${color}"/></svg>`;
const markSvg = (w, color) => {
  const b = LOGO.markBox, bw = b[2] - b[0], bh = b[3] - b[1];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${Math.round(((w * bh) / bw) * 10) / 10}" viewBox="${b[0]} ${b[1]} ${bw} ${bh}" fill="none"><path d="${LOGO.mark}" fill="${color}"/></svg>`;
};

/* розетка (гільйош): N кіл радіуса R з центрами на колі r0 */
function rosette(name, cx, cy, N, R, r0, a, sw, color) {
  const ch = [];
  for (let k = 0; k < N; k++) {
    const f = (2 * Math.PI * k) / N;
    ch.push({
      t: "ellipse", n: "кільце", x: cx + r0 * Math.cos(f) - R, y: cy + r0 * Math.sin(f) - R, w: 2 * R, h: 2 * R,
      stroke: { c: color, a, w: sw },
    });
  }
  return { t: "frame", n: name, x: 0, y: 0, w: W, h: H, ch };
}

/* підпис «Назва / роль» під рискою */
function signBlock(x, pair) {
  return {
    t: "frame", n: "підпис", x, y: 1050, w: 420, h: 70,
    ch: [
      rule("риска підпису", 0, 0, 420, 0.5),
      text({ n: "підпис-назва", s: pair[0], x: 0, y: 14, w: 420, f: "dm", sz: 22, lhr: 1.2, c: PAL.cream, al: "c" }),
      text({ n: "підпис-роль", s: pair[1], x: 0, y: 44, w: 420, f: "mono", sz: 13, ls: 0.16, c: PAL.white, a: 0.5, caps: true, lhr: 1.2, al: "c" }),
    ],
  };
}
/* поле «мітка / значення» */
function field(pair, align) {
  return {
    t: "frame", n: "поле", w: "hug", h: "hug", layout: "V", gap: 6, align: align || "start",
    ch: [
      text({ n: "поле-мітка", s: pair[0], f: "mono", sz: 13, ls: 0.16, c: PAL.white, a: 0.5, caps: true, lhr: 1.2 }),
      text({ n: "поле-значення", s: pair[1], f: "mono", sz: 20, c: PAL.cream, lhr: 1.2 }),
    ],
  };
}

/* печатка: диск + кільця + текст по колу + розетка + знак AIN */
function seal(cx, cy) {
  const R = 104, ch = [];
  const rel = (n) => Object.assign({}, n);
  ch.push({
    t: "ellipse", n: "диск", x: 0, y: 0, w: 2 * R, h: 2 * R, fill: [solid(PAL.disc), rad(PAL.ember, 0.55)],
    stroke: { c: PAL.cream, a: 0.7, w: 1.5 }, shadows: [{ x: 0, y: 0, blur: 50, c: PAL.ember, a: 0.5 }],
  });
  ch.push({ t: "ellipse", n: "кільце 1", x: R - 90, y: R - 90, w: 180, h: 180, stroke: { c: PAL.cream, a: 0.35, w: 1 } });
  ch.push({ t: "ellipse", n: "кільце 2", x: R - 62, y: R - 62, w: 124, h: 124, stroke: { c: PAL.cream, a: 0.3, w: 1 } });
  const rs = rosette("розетка печатки", R, R, 24, 30, 24, 0.28, 0.8, PAL.cream);
  rs.w = 2 * R; rs.h = 2 * R;
  ch.push(rs);
  const str = COPY.ring, step = 360 / str.length;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === " ") continue;
    const th = i * step, rr = (Math.PI * th) / 180;
    ch.push(text({
      n: "символ " + str[i], s: str[i], f: "mono", sz: 12, c: PAL.cream, a: 0.88, lhr: 1.2,
      x: R + 76 * Math.sin(rr), y: R - 76 * Math.cos(rr), ctr: true, rot: th,
    }));
  }
  ch.push({ t: "svg", n: "знак AIN", x: R - 27, y: R - 17.2, w: 54, h: 34.4, svg: markSvg(54, PAL.cream) });
  return { t: "frame", n: "печатка", x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, ch };
}

function certificate(p) {
  const bg = [
    glow("Сяйво / низ", CX, 1250, 1700, 760, PAL.red, 0.62, 80),
    glow("Сяйво / верх-ліво", 140, 40, 900, 500, PAL.red, 0.45, 80),
    glow("Сяйво / верх-право", 1620, 60, 900, 500, PAL.red, 0.38, 80),
    glow("Сяйво / ліво", -60, 640, 520, 900, PAL.red, 0.3, 80),
    glow("Сяйво / право", W + 60, 640, 520, 900, PAL.red, 0.3, 80),
    glow("Ядро", CX, 1225, 900, 260, PAL.ember, 0.6, 50),
    glow("Спалах", CX, 1232, 420, 90, PAL.flash, 0.45, 30),
    rosette("Гільйош-водяний знак", CX, 590, 64, 330, 250, 0.045, 1, PAL.cream),
  ];
  const frame = [
    { t: "frame", n: "Рамка зовнішня", x: 36, y: 36, w: W - 72, h: H - 72, stroke: { c: PAL.cream, a: 0.55, w: 1.5 } },
    { t: "frame", n: "Рамка внутрішня", x: 76, y: 76, w: W - 152, h: H - 152, stroke: { c: PAL.cream, a: 0.18, w: 1 } },
    dot("ромб", 76, 76, 14, PAL.peach), dot("ромб", W - 76, 76, 14, PAL.peach),
    dot("ромб", 76, H - 76, 14, PAL.peach), dot("ромб", W - 76, H - 76, 14, PAL.peach),
    ...[56, H - 56].map((cy, i) => ({
      t: "frame", n: i ? "Мікротекст низ" : "Мікротекст верх", x: 76, y: cy - 10, w: W - 152, h: 20, clip: true,
      ch: [text({ n: "мікротекст", s: COPY.micro.repeat(4).trim(), cx: (W - 152) / 2, y: 3, f: "mono", sz: 11, ls: 0.26, c: PAL.cream, a: 0.3, lhr: 1.2 })],
    })),
  ];
  const header = [
    { t: "frame", n: "header-ліво", x: 124, y: 114, w: "hug", h: "hug", layout: "H", ch: [field(COPY.no, "start")] },
    { t: "svg", n: "AIN logo", cx: CX, y: 112, w: 168, h: 48.6, svg: logoSvg(168, PAL.cream) },
    { t: "frame", n: "header-право", right: 124, y: 114, w: "hug", h: "hug", layout: "H", gap: 44, ch: [field(COPY.date, "end"), field(COPY.valid, "end")] },
  ];
  const body = [
    ctext({ n: "title", s: COPY.title, y: 200, f: "dm", sz: 100, lhr: 1.05, ls: 0.06, c: PAL.cream, caps: true }, 1200),
    rule("лінія титулу L", 130, 252, 250, 0.3), dot("ромб титулу", 380, 252.5, 8, PAL.peach),
    rule("лінія титулу R", 1374, 252, 250, 0.3), dot("ромб титулу", 1374, 252.5, 8, PAL.peach),
    ctext({ n: "eyebrow", s: COPY.eyebrow + " " + p.no + " / 03", y: 322, f: "mono", sz: 16, ls: 0.3, c: PAL.peach, caps: true, lhr: 1.2 }, 1200),
    ctext({ n: "lead1", s: COPY.lead1, y: 372, f: "dr", sz: 26, lhr: 1.3, a: 0.62 }),
    ctext({ n: "name", s: COPY.name, y: 402, f: "serif", sz: 100, lhr: 1.05, c: PAL.cream }),
    rule("лінія імені", CX - 360, 524, 720, 0.42), dot("ромб імені", CX - 360, 524.5, 8, PAL.peach), dot("ромб імені", CX + 360, 524.5, 8, PAL.peach),
    ctext({ n: "lead2", s: COPY.lead2, y: 550, f: "dr", sz: 26, lhr: 1.3, a: 0.62 }),
    ctext({ n: "prize", s: p.title, y: 594, f: "dm", sz: 70, lhr: 1.05, ls: 0.02, c: PAL.cream, caps: true }, 1500),
    {
      t: "frame", n: "partner", cx: CX, y: 692, w: "hug", h: "hug", layout: "H", gap: 22, align: "center",
      ch: [
        { t: "frame", n: "partner-line", w: 70, h: 1, fill: solid(PAL.peach, 0.7) },
        text({ n: "partner-name", s: COPY.byPrefix + p.by, f: "mono", sz: 19, ls: 0.22, c: PAL.peach, caps: true, lhr: 1.2 }),
        { t: "frame", n: "partner-line", w: 70, h: 1, fill: solid(PAL.peach, 0.7) },
      ],
    },
    ctext({ n: "desc", s: p.desc, y: 750, f: "dr", sz: 23, lhr: 1.55, a: 0.66 }, p.descW || 1000),
  ];
  return {
    t: "frame", n: "AIN Awards 2026 — Сертифікат — " + p.title, x: 0, y: 0, w: W, h: H, clip: true,
    fill: lin("v", [[0, PAL.base1], [1, PAL.base2]]),
    shadows: [{ inner: true, x: 0, y: 0, blur: 140, c: PAL.ember, a: 0.28 }],
    ch: [...bg, ...frame, ...header, ...body, signBlock(150, COPY.sign[0]), signBlock(W - 150 - 420, COPY.sign[1]), seal(CX, 1012)],
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
  mono: { families: ["JetBrains Mono", "Roboto Mono", "IBM Plex Mono", "Fira Code"], styles: ["Medium", "Regular"], fb: { family: "Inter", style: "Medium" } },
  serif: { families: ["Cormorant Garamond", "Cormorant", "Playfair Display", "EB Garamond"], styles: ["Medium Italic", "Italic", "Regular"], fb: { family: "Inter", style: "Medium" } },
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
