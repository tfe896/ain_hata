/* AIN Awards 2026 — сертифікат Molfar Intelligence.
   Єдиний опис сцени: його читають і Figma-плагін (figma-render.js), і HTML-прев'ю (html-render.js).
   Тексти — у TXT нижче. Усе інше — геометрія й кольори. Координати в px. */

const TXT = {
  pill: "AIN Awards 2026",
  eyebrow: "Подарунковий сертифікат",
  title: "Три призи\nвід Molfar\nIntelligence",
  sub: "Партнер AIN Awards 2026 дарує інструменти, щоб перевіряти, вчитися й помічати загрози вчасно.",
  awardLabel: "Нагороджується",
  awardName: "Ім’я Прізвище",
  awardNote: "Компанія або проєкт",
  meta: [
    ["Дата видачі", "19.12.2026"],
    ["Номер", "AIN-0001"],
    ["Активувати до", "дд.мм.рррр"],
  ],
  listLabel: "У сертифікат входить",
  prizes: [
    {
      no: "01",
      chip: "Письмовий звіт",
      title: "Background check",
      by: "Molfar Intelligence",
      desc: "Перевірка компанії або людини: власники й пов’язані особи, корпоративна історія, репутаційні та санкційні ризики. Підсумок — письмовий звіт.",
      icon: "search",
    },
    {
      no: "02",
      chip: "У власному темпі",
      title: "Курс з OSINT",
      by: "Molfar Intelligence Institute",
      desc: "Онлайн-курс із розвідки з відкритих джерел. Аналітики-практики вчать шукати, перевіряти й аналізувати інформацію.",
      icon: "course",
    },
    {
      no: "03",
      chip: "1 місяць безкоштовно",
      title: "Місяць доступу до Minos",
      by: "Molfar Intelligence",
      desc: "Платформа для моніторингу інформаційних загроз і реагування на них. Безкоштовно протягом місяця з дня активації.",
      icon: "radar",
      accent: "mint",
    },
  ],
};

/* палітра AIN Awards 2026 (знято зі скріншота й макета Червень-липень 2026) */
const PAL = {
  black: "#000000",
  base1: "#141416",
  base2: "#0A0A0B",
  red: "#C2382E",
  ember: "#F06A4E",
  flash: "#FFD9CC",
  peach: "#FF8F73",
  cream: "#F3F3EB",
  white: "#FFFFFF",
  mint: "#3EE0A0",
};

const solid = (c, a) => ({ k: "solid", c, a: a == null ? 1 : a });
const lin = (dir, stops) => ({ k: "lin", dir, stops });
const rad = (c, a) => ({ k: "rad", stops: [[0, c, a], [0.4, c, a * 0.7], [0.7, c, a * 0.24], [1, c, 0]] });
const lh = (sz, ratio) => Math.round(sz * ratio * 10) / 10;

function text(o) {
  return Object.assign({ t: "text", f: "dr", c: PAL.white, a: 1, al: "l", lhr: 1.3, ls: 0 }, o, {
    lh: lh(o.sz, o.lhr || 1.3),
  });
}
function glow(name, cx, cy, w, h, c, a, blur) {
  return { t: "ellipse", n: name, x: cx - w / 2, y: cy - h / 2, w, h, fill: rad(c, a), blur };
}
function ring(cx, cy, r) {
  return { t: "ellipse", n: "Коло радара", x: cx - r, y: cy - r, w: r * 2, h: r * 2, stroke: { c: PAL.white, a: 0.07, w: 1 } };
}
const svgIcon = (inner) =>
  '<svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F3F3EB" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
  inner +
  "</svg>";
const ICONS = {
  search: svgIcon('<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>'),
  course: svgIcon('<path d="M2.5 5.5C5 4.5 8.5 4.6 12 6.5c3.5-1.9 7-2 9.5-1v13c-2.5-1-6-.9-9.5 1-3.5-1.9-7-2-9.5-1z"/><path d="M12 6.5v13"/>'),
  radar: svgIcon('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" fill="#F3F3EB"/><path d="M12 12L18.5 5.5"/>'),
};

function prizeCard(p, i) {
  const mint = p.accent === "mint";
  const accent = mint ? PAL.mint : PAL.peach;
  return {
    t: "frame", n: "prize-card " + p.no, x: 664, y: 92 + i * 316, w: 874, h: 300, r: 44, clip: true,
    fill: [solid(PAL.white, mint ? 0.05 : 0.07), lin("v", [[0, PAL.white, 0.06], [1, PAL.white, 0.01]])],
    stroke: { c: mint ? PAL.mint : PAL.white, a: mint ? 0.34 : 0.16, w: 1 },
    bgBlur: 40,
    shadows: [{ inner: true, x: 0, y: 0, blur: 30, c: mint ? PAL.mint : PAL.white, a: mint ? 0.1 : 0.05 }],
    ch: [
      glow("Сяйво картки", 710, 40, 460, 320, mint ? PAL.mint : PAL.ember, mint ? 0.4 : 0.42, 50),
      {
        t: "frame", n: "prize-top", x: 36, y: 34, w: "hug", h: "hug", layout: "H", gap: 16, align: "center",
        ch: [
          text({ n: "prize-no", s: p.no, f: "mono", sz: 18, ls: 0.06, c: PAL.cream, a: 0.55 }),
          {
            t: "frame", n: "chip", w: "hug", h: "hug", layout: "H", pad: [8, 16, 8, 16], align: "center", r: 999,
            fill: solid(PAL.mint, 0.12), stroke: { c: PAL.mint, a: 0.4, w: 1 },
            ch: [text({ n: "chip-text", s: p.chip, f: "mono", sz: 15, ls: 0.06, c: PAL.mint, caps: true, lhr: 1.2 })],
          },
        ],
      },
      {
        t: "frame", n: "prize-badge", right: 36, y: 30, w: 72, h: 72, r: 36,
        fill: solid(PAL.white, 0.08), stroke: { c: PAL.white, a: 0.2, w: 1 },
        ch: [{ t: "svg", n: "icon " + p.icon, x: 19, y: 19, w: 34, h: 34, svg: ICONS[p.icon] }],
      },
      text({ n: "prize-title", s: p.title, x: 36, y: 90, w: 680, f: "dm", sz: 46, lhr: 1.08, ls: -0.02, c: PAL.cream }),
      text({ n: "prize-by", s: p.by, x: 36, y: 148, w: 680, f: "mono", sz: 16, ls: 0.1, c: accent, caps: true, lhr: 1.25 }),
      text({ n: "prize-desc", s: p.desc, x: 36, y: 180, w: 800, f: "dr", sz: 21, lhr: 1.45, c: PAL.white, a: 0.74 }),
    ],
  };
}

function certificateLandscape() {
  const W = 1754, H = 1240;
  const bgCard = {
    t: "frame", n: "Фон / картка", x: 36, y: 36, w: W - 72, h: H - 72, r: 96, clip: true,
    fill: lin("v", [[0, PAL.base1], [1, PAL.base2]]),
    shadows: [{ inner: true, x: 0, y: 0, blur: 60, c: PAL.ember, a: 0.38 }],
    ch: [
      glow("Сяйво / низ-ліво", 330, 1080, 1500, 900, PAL.red, 0.7, 80),
      glow("Сяйво / верх-ліво", 180, 60, 1000, 560, PAL.red, 0.34, 80),
      glow("Сяйво / верх-право", 1400, 140, 1200, 800, PAL.red, 0.5, 80),
      glow("М’ята / низ-право", 1450, 1000, 800, 700, PAL.mint, 0.2, 80),
      glow("Ядро", 330, 1138, 1000, 300, PAL.ember, 0.8, 50),
      glow("Спалах", 330, 1160, 460, 110, PAL.flash, 0.65, 30),
      ring(330, 800, 210), ring(330, 800, 340), ring(330, 800, 480), ring(330, 800, 630),
      { t: "frame", n: "Риска V", x: 330, y: 260, w: 1, h: 908, fill: solid(PAL.white, 0.05) },
      { t: "frame", n: "Риска H", x: 0, y: 800, w: 780, h: 1, fill: solid(PAL.white, 0.05) },
    ],
  };

  const left = [
    {
      t: "frame", n: "pill", x: 0, y: 0, w: "hug", h: "hug", layout: "H", pad: [14, 26, 14, 26], align: "center", r: 999,
      fill: solid(PAL.cream),
      ch: [text({ n: "pill-text", s: TXT.pill, f: "mono", sz: 20, c: PAL.base2, lhr: 1.2 })],
    },
    {
      t: "frame", n: "eyebrow", x: 0, y: 196, w: "hug", h: "hug", layout: "H", gap: 16, align: "center",
      ch: [
        { t: "frame", n: "eyebrow-dash", w: 28, h: 2, fill: solid(PAL.peach) },
        text({ n: "eyebrow-text", s: TXT.eyebrow, f: "mono", sz: 18, ls: 0.14, c: PAL.peach, caps: true, lhr: 1.2 }),
      ],
    },
    text({ n: "title", s: TXT.title, x: 0, y: 244, w: 680, f: "dm", sz: 76, lhr: 1.02, ls: -0.03, c: PAL.cream, caps: true }),
    text({ n: "sub", s: TXT.sub, x: 0, y: 510, w: 560, f: "dr", sz: 25, lhr: 1.45, c: PAL.white, a: 0.72 }),
    text({ n: "award-label", s: TXT.awardLabel, x: 0, y: 742, w: 600, f: "mono", sz: 15, ls: 0.14, c: PAL.white, a: 0.5, caps: true, lhr: 1.2 }),
    text({ n: "award-name", s: TXT.awardName, x: 0, y: 772, w: 600, f: "dm", sz: 48, lhr: 1.1, ls: -0.01, c: PAL.cream }),
    { t: "frame", n: "award-line", x: 0, y: 848, w: 600, h: 1, fill: solid(PAL.white, 0.3) },
    text({ n: "award-note", s: TXT.awardNote, x: 0, y: 862, w: 600, f: "dr", sz: 21, c: PAL.white, a: 0.5 }),
    { t: "frame", n: "meta-line", x: 0, y: 932, w: 600, h: 1, fill: solid(PAL.white, 0.14) },
  ];
  TXT.meta.forEach((m, i) => {
    left.push(text({ n: "meta-label", s: m[0], x: i * 210, y: 954, w: 200, f: "mono", sz: 13, ls: 0.12, c: PAL.white, a: 0.45, caps: true, lhr: 1.2 }));
    left.push(text({ n: "meta-value", s: m[1], x: i * 210, y: 980, w: 200, f: "dm", sz: 26, lhr: 1.2, c: PAL.cream }));
  });

  const right = [
    text({ n: "list-label", s: TXT.listLabel, x: 664, y: 16, w: 600, f: "mono", sz: 16, ls: 0.14, c: PAL.white, a: 0.55, caps: true, lhr: 1.2 }),
    {
      t: "frame", n: "AIN logo (замінити на оригінал)", right: 0, y: 2, w: 64, h: 48,
      ch: [
        { t: "frame", n: "logo-L", x: 0, y: 0, w: 30, h: 48, r: [24, 4, 4, 24], fill: solid(PAL.cream) },
        { t: "frame", n: "logo-R", x: 34, y: 0, w: 30, h: 48, r: [4, 24, 24, 4], fill: solid(PAL.cream) },
      ],
    },
  ];
  TXT.prizes.forEach((p, i) => right.push(prizeCard(p, i)));

  return {
    t: "frame", n: "AIN Awards 2026 — сертифікат Molfar (A4 landscape)", x: 0, y: 0, w: W, h: H, clip: true,
    fill: solid(PAL.black),
    ch: [bgCard, { t: "frame", n: "content", x: 108, y: 108, w: W - 216, h: H - 216, ch: left.concat(right) }],
  };
}

function buildScenes() {
  return [certificateLandscape()];
}
