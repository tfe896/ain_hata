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
    phase: 0,
  },
  {
    key: "osint-course",
    title: "Курс з OSINT",
    by: "від Molfar Intelligence Institute",
    desc: "Це доступ до онлайн-курсу з розвідки з відкритих джерел. Аналітики-практики навчать вас шукати, перевіряти й аналізувати відкриту інформацію. Вчитися можна у власному темпі.",
    phase: 60,
  },
  {
    key: "minos-month",
    title: "Місяць доступу до Minos",
    by: null,
    desc: "Minos — це платформа Molfar Intelligence для моніторингу інформаційних загроз і реагування на них. Протягом місяця з дня активації ви користуєтеся нею безкоштовно.",
    phase: 120,
  },
];

/* палітра AIN Awards 2026 */
const PAL = {
  base1: "#0A0A0B", base2: "#1C0B0A",
  red: "#C2382E", ember: "#F06A4E", flash: "#FFD9CC", peach: "#FF8F73", cream: "#F3F3EB", white: "#FFFFFF",
};
const W = 1754, H = 1240;

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

/* «сонар»: концентричні дуги з правого нижнього кута + м’які світні кільця */
function sonar(phase) {
  const cx = W, cy = H, ch = [];
  const radii = [230, 350, 480, 620, 770, 930, 1100, 1280, 1470, 1670];
  const alphas = [0.5, 0.4, 0.3, 0.22, 0.17, 0.13, 0.1, 0.08, 0.06, 0.045];
  radii.forEach((r, i) => {
    const R = r + phase;
    ch.push({ t: "ellipse", n: "дуга", x: cx - R, y: cy - R, w: 2 * R, h: 2 * R, stroke: { c: PAL.cream, a: alphas[i], w: 1 } });
  });
  [[330, 0.34], [700, 0.2], [1080, 0.12]].forEach(([rp, a]) => {
    const R = (rp + phase) / 0.95;
    ch.push({
      t: "ellipse", n: "світне кільце", x: cx - R, y: cy - R, w: 2 * R, h: 2 * R,
      fill: { k: "rad", stops: [[0, PAL.ember, 0], [0.8, PAL.ember, 0], [0.95, PAL.ember, a], [1, PAL.ember, 0]] },
    });
  });
  return { t: "frame", n: "Сонар", x: 0, y: 0, w: W, h: H, ch };
}
/* візирні кутики */
function corners(inset, len, th, c, a) {
  const x0 = inset, y0 = inset, x1 = W - inset, y1 = H - inset;
  return [
    bar("кутик", x0, y0, len, th, c, a), bar("кутик", x0, y0, th, len, c, a),
    bar("кутик", x1 - len, y0, len, th, c, a), bar("кутик", x1 - th, y0, th, len, c, a),
    bar("кутик", x0, y1 - th, len, th, c, a), bar("кутик", x0, y1 - len, th, len, c, a),
    bar("кутик", x1 - len, y1 - th, len, th, c, a), bar("кутик", x1 - th, y1 - len, th, len, c, a),
  ];
}

function certificate(p) {
  const titleBlock = [text({ n: "title", s: p.title, w: 1360, f: "dm", sz: 132, lhr: 1.0, ls: -0.03, c: PAL.cream })];
  if (p.by) titleBlock.push(text({ n: "by", s: p.by, w: 1000, f: "dr", sz: 46, lhr: 1.2, ls: -0.01, c: PAL.peach }));
  const copy = {
    t: "frame", n: "текст", x: 140, cy: 668, w: "hug", h: "hug", layout: "V", gap: 46, align: "start",
    ch: [
      { t: "frame", n: "назва", w: "hug", h: "hug", layout: "V", gap: 14, align: "start", ch: titleBlock },
      bar("акцентна риска", 0, 0, 64, 3, PAL.peach, 1),
      text({ n: "desc", s: p.desc, w: 780, f: "dr", sz: 27, lhr: 1.5, c: PAL.white, a: 0.74 }),
    ],
  };
  return {
    t: "frame", n: "AIN Awards 2026 — " + p.title + (p.by ? " " + p.by : ""), x: 0, y: 0, w: W, h: H, clip: true,
    fill: lin("v", [[0, PAL.base1], [1, PAL.base2]]),
    shadows: [{ inner: true, x: 0, y: 0, blur: 140, c: PAL.ember, a: 0.22 }],
    ch: [
      glow("Сяйво", W, H, 1700, 1500, PAL.red, 0.72, 90),
      glow("Сяйво / верх-ліво", 100, 0, 900, 500, PAL.red, 0.3, 80),
      glow("Ядро", W, H, 900, 760, PAL.ember, 0.7, 60),
      glow("Спалах", W, H, 420, 340, PAL.flash, 0.6, 40),
      sonar(p.phase),
      { t: "frame", n: "Рамка", x: 40, y: 40, w: W - 80, h: H - 80, stroke: { c: PAL.cream, a: 0.2, w: 1 } },
      ...corners(40, 46, 2, PAL.cream, 0.85),
      { t: "svg", n: "AIN logo", x: 140, y: 118, w: 150, h: 43.4, svg: logoSvg(150, PAL.cream) },
      bar("лінія шапки", 140, 206, W - 280, 1, PAL.cream, 0.14),
      copy,
    ],
  };
}

function buildScenes() {
  return PRIZES.map(certificate);
}
