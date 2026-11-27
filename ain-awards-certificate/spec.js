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
