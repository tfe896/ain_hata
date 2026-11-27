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
