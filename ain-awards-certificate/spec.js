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
