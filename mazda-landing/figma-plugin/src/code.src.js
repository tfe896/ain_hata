// Mazda × Співпраця — дизайн-концепт лендінгу (екрани 1–3), ревізія r2.
// Повний генератор: за один запуск будує у будь-якому файлі сторінки Desktop 1440, Mobile 390 і Стилі
// з урахуванням 13 коментарів дизайнерки від 11.11 та айдентики проєкту (SMM-візуали).
// code.js збирається з цього файлу командою `python3 build.py` (вбудовує картинки й карту).

const A = __ASSETS__;
const REV = "r2";
const NBSP = " ";

const hex = (h) => ({
  r: parseInt(h.slice(0, 2), 16) / 255,
  g: parseInt(h.slice(2, 4), 16) / 255,
  b: parseInt(h.slice(4, 6), 16) / 255,
});
const COLORS = { orange: "EF6320", cream: "FFF9D9", black: "000000", beige: "F3E6BF", peach: "FFC08A" };
const PINK = hex("D6237A");

const TXT = {
  h1: "2500 кілометрів,\n5 співпраць\nі 1 автомобіль",
  tag2: "Mazda CX-90 у «Співпраці»",
  lead: "Щоб зняти історії про український бізнес, ремесла й мистецтво, AIN і KredoBank вирушили в масштабну експедицію Україною.",
  p1: "За кожним випуском стояв великий організаційний виклик: знімальна група, камери, звук, освітлення, особисті речі й постійні переїзди між регіонами.",
  p2: "Протягом понад 2500 кілометрів маршруту команду супроводжувала Mazda CX-90 — великий кросовер, який став частиною знімального процесу.",
  plates: [
    ["2500+", "кілометрів маршруту"],
    ["5", "співпраць: бізнес, ремесла й мистецтво"],
    ["1", "автомобіль для всієї знімальної групи"],
  ],
  productTag: "Автомобільний партнер",
  productTitle: "Mazda CX-90",
  productText:
    "Великий кросовер, який супроводжував знімальну групу всі 2500 кілометрів маршруту і став частиною знімального процесу.",
  cta: "Більше про Mazda CX-90 →",
  tag3: "Маршрут експедиції",
  h2: "2500" + NBSP + "км від Київщини до" + NBSP + "Верховини і" + NBSP + "назад",
  stops: [
    ["01", "Київщина", "Перший виїзд, близько 50 км"],
    ["02", "Київ → Львів", "Сотні кілометрів трасою"],
    ["03", "Закарпаття", "Близько 200 км серпантинів"],
    ["04", "Верховина", "Гірські дороги й ґрунтовки"],
    ["05", "Верховина → Київ", "Довга дорога назад у столицю"],
  ],
  video:
    'id="s1" · ФОНОВЕ ВІДЕО на весь екран: петля 10–15 с без звуку з кадрами Mazda з випусків «Співпраці» (youtu.be/Wu0hcS3nl9w #2, youtu.be/v7KsIPGGsDc #3 та ін.) · це фото = постер',
};

// Точки на карті в координатах десктопної карти 840×562: [x, y, підпис, куди ставити підпис]
const PINS = [
  [390, 134, "Київ", "right"],
  [87.5, 177, "Львів", "above-right"],
  [26.5, 275.5, "Закарпаття", "above"],
  [123, 296, "Верховина", "right"],
];

const DESKTOP = {
  key: "Desktop", title: "🖥 Desktop 1440", W: 1440, padX: 56, vertical: false,
  headerPadY: 18, logoS: 1, creditsGap: 40,
  heroH: 900, heroPad: [32, 56], stampW: 280, titleGap: 32,
  secPad: 120, wrapGap: 72, colGap: 28, colLW: 760, colRW: 400, pGap: 18,
  tagPad: [8, 14],
  platesGap: 16, plateH: 300, platePad: 32,
  product: { figW: 540, figH: 470, pad: 56, gap: 24, logoS: 1.5, pW: 480, shots: [[300, 40, 20, 4, 0.2, 0.55], [260, 250, 150, -5, 0.72, 0.42]] },
  routeGap: 56, h2W: 900, splitGap: 72, stopsW: 416, stopPad: [16, 20], stopGap: 20, stopsGap: 8,
  mapW: 840, mapH: 562, dot: 18, pinPad: [4, 9],
  type: {
    h1: ["head", 112, 93, 0, true], h2: ["head", 72, 95, 0, true], lead: ["semi", 32, 125, -1, false],
    body: ["med", 19, 155, 0, false], label: ["head", 13, 120, 4, true], pill: ["med", 16, 120, 3, false],
    num: ["head", 128, 90, 0, false], cap: ["head", 22, 115, 0, true], stopName: ["head", 28, 100, 0, true],
    stopNote: ["med", 16, 140, 0, false], stopN: ["head", 16, 120, 4, false], pin: ["med", 15, 120, 2, false],
    productTitle: ["head", 56, 100, 0, true],
  },
};

const MOBILE = {
  key: "Mobile", title: "📱 Mobile 390", W: 390, padX: 20, vertical: true,
  headerPadY: 12, logoS: 0.6, creditsGap: 18,
  heroH: 780, heroPad: [20, 28], stampW: 150, titleGap: 18,
  secPad: 64, wrapGap: 40, colGap: 18, colLW: 0, colRW: 0, pGap: 14,
  tagPad: [6, 10],
  platesGap: 12, plateH: 164, platePad: 22,
  product: { figW: 350, figH: 290, pad: 24, gap: 16, logoS: 1.1, pW: 0, shots: [[190, 14, 16, 4, 0.2, 0.55], [170, 160, 84, -5, 0.72, 0.42]] },
  routeGap: 32, h2W: 0, splitGap: 32, stopsW: 0, stopPad: [12, 14], stopGap: 14, stopsGap: 6,
  mapW: 350, mapH: 234, dot: 9, pinPad: [2, 6],
  type: {
    h1: ["head", 40, 95, 0, true], h2: ["head", 36, 95, 0, true], lead: ["semi", 21, 130, -1, false],
    body: ["med", 16, 155, 0, false], label: ["head", 10, 120, 4, true], pill: ["med", 13, 120, 3, false],
    num: ["head", 72, 90, 0, false], cap: ["head", 17, 115, 0, true], stopName: ["head", 22, 100, 0, true],
    stopNote: ["med", 14, 140, 0, false], stopN: ["head", 13, 120, 4, false], pin: ["med", 9, 120, 2, false],
    productTitle: ["head", 34, 100, 0, true],
  },
};

const TYPE_NAMES = {
  h1: "Heading 1 (hero)", h2: "Heading 2", lead: "Lead", body: "Body", label: "Label", pill: "Pill",
  num: "Plate number", cap: "Plate caption", stopName: "Stop name", stopNote: "Stop note", stopN: "Stop number",
  pin: "Map label", productTitle: "Product title",
};

let step = "старт";
const notes = [];
const F = { head: null, med: null, semi: null };
const paints = {};
const img = {};
const styles = { Desktop: {}, Mobile: {} };

// ---------- базові помічники ----------
function P(name) {
  return paints[name];
}
function shade(a0, a1, a2) {
  return {
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [
      { position: 0, color: { r: 0, g: 0, b: 0, a: a0 } },
      { position: 0.5, color: { r: 0, g: 0, b: 0, a: a1 } },
      { position: 1, color: { r: 0, g: 0, b: 0, a: a2 } },
    ],
  };
}
function al(dir, name, gap) {
  const f = figma.createFrame();
  f.name = name;
  f.layoutMode = dir;
  f.primaryAxisSizingMode = "AUTO";
  f.counterAxisSizingMode = "AUTO";
  f.itemSpacing = gap || 0;
  f.fills = [];
  f.clipsContent = false;
  return f;
}
function pad(f, v, h) {
  f.paddingTop = v;
  f.paddingBottom = v;
  f.paddingLeft = h;
  f.paddingRight = h;
}
// Додає дочірній елемент і за потреби розтягує його на ширину батька.
function add(parent, child, fill) {
  parent.appendChild(child);
  if (fill) child.layoutSizingHorizontal = "FILL";
  return child;
}
async function T(d, kind, chars, color, name) {
  const st = d.type[kind];
  const t = figma.createText();
  t.fontName = F[st[0]];
  const style = styles[d.key][kind];
  if (style) {
    try {
      await t.setTextStyleIdAsync(style.id);
    } catch (e) {
      applyType(t, st);
    }
  } else {
    applyType(t, st);
  }
  t.characters = chars;
  t.fills = [P(color)];
  t.name = name || kind;
  return t;
}
function applyType(t, st) {
  t.fontName = F[st[0]];
  t.fontSize = st[1];
  t.lineHeight = { unit: "PERCENT", value: st[2] };
  t.letterSpacing = { unit: "PERCENT", value: st[3] };
  t.textCase = st[4] ? "UPPER" : "ORIGINAL";
}
// Текст, що переноситься: займає ширину батька (або фіксовану), висота за вмістом.
function wrapText(parent, t, width) {
  parent.appendChild(t);
  if (width) {
    t.resize(width, t.height);
    t.textAutoResize = "HEIGHT";
  } else {
    t.layoutSizingHorizontal = "FILL";
    t.textAutoResize = "HEIGHT";
  }
  return t;
}
function imgRect(key, w, h, name) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = [{ type: "IMAGE", scaleMode: "FIT", imageHash: img[key] }];
  return r;
}
// Частина растрового логотипа: рамка-маска з картинкою всередині.
function cropOf(key, baseW, baseH, x0, y0, x1, y1, s, name) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.clipsContent = true;
  f.resize(Math.max(1, (x1 - x0) * s), Math.max(1, (y1 - y0) * s));
  const r = imgRect(key, baseW * s, baseH * s, "img");
  f.appendChild(r);
  r.x = -x0 * s;
  r.y = -y0 * s;
  return f;
}
// KredoBank | ain намальовано в полі 249×34, вертикальний логотип Mazda — у полі 72×64.
const logoAin = (s) => cropOf("kb", 249, 34, 159.5, 0, 249, 34, s, "logo-ain");
const logoKredo = (s) => cropOf("kb", 249, 34, 0, 0, 134.5, 34, s, "logo-kredobank");
function logoMazdaH(s) {
  const f = al("HORIZONTAL", "logo-mazda-horizontal", Math.round(10 * s));
  f.counterAxisAlignItems = "CENTER";
  f.appendChild(cropOf("mazda", 72, 64, 7, 0, 64.5, 46.5, (s * 34) / 46.5, "emblem"));
  f.appendChild(cropOf("mazda", 72, 64, 0, 52, 72, 64, s * 0.95, "wordmark"));
  return f;
}
// Фрагмент кадру hero (16:9) у рамці w×h: центр (cx, cy) у частках кадру, zoom — у скільки разів кадр ширший за рамку.
function photoCrop(w, h, cx, cy, zoom, name) {
  const f = figma.createFrame();
  f.name = name || "photo";
  f.fills = [];
  f.clipsContent = true;
  f.resize(w, h);
  let rw = w * zoom;
  let rh = (rw * 810) / 1440;
  if (rh < h) {
    rh = h;
    rw = (rh * 1440) / 810;
  }
  const r = figma.createRectangle();
  r.name = "img";
  r.resize(rw, rh);
  r.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img.hero }];
  f.appendChild(r);
  r.x = Math.round(Math.min(0, Math.max(w - rw, w / 2 - cx * rw)));
  r.y = Math.round(Math.min(0, Math.max(h - rh, h / 2 - cy * rh)));
  return f;
}
// Пігулка, як «Спецпроєкт» у візуалах проєкту.
async function pill(d, chars, bg, fg, name, padding, kind) {
  const p = padding || d.tagPad;
  const f = al("HORIZONTAL", name || "tag", 0);
  pad(f, p[0], p[1]);
  f.fills = [P(bg)];
  f.cornerRadius = 999;
  f.appendChild(await T(d, kind || "pill", chars, fg, "lbl"));
  return f;
}
// Полароїд з айдентики: кремова рамка з тінню, під нахилом.
function polaroid(w, cx, cy, deg) {
  const m = Math.round(w * 0.06);
  const f = figma.createFrame();
  f.name = "polaroid";
  f.resize(w, Math.round(w * 1.2));
  f.fills = [P("cream")];
  f.effects = [{ type: "DROP_SHADOW", color: { r: 0, g: 0, b: 0, a: 0.18 }, offset: { x: 0, y: 8 }, radius: 24, spread: 0, visible: true, blendMode: "NORMAL" }];
  const ph = photoCrop(w - m * 2, w - m * 2, cx, cy, 2.6, "photo");
  f.appendChild(ph);
  ph.x = m;
  ph.y = m;
  f.rotation = deg;
  return f;
}

// ---------- підготовка: шрифти, кольори, стилі, картинки ----------
async function setup() {
  step = "шрифти";
  const all = await figma.listAvailableFontsAsync();
  const norm = (s) => s.toLowerCase().replace(/\s+/g, "");
  const pick = (family, wanted) => {
    for (const w of wanted) {
      for (const f of all) {
        if (f.fontName.family === family && norm(f.fontName.style) === norm(w)) return f.fontName;
      }
    }
    return null;
  };
  F.med = pick("Inter Tight", ["Medium", "Regular"]) || pick("Inter", ["Medium", "Regular"]);
  F.semi = pick("Inter Tight", ["SemiBold", "Bold", "Medium"]) || pick("Inter", ["Semi Bold", "Bold"]);
  if (!F.med || !F.semi) throw new Error("у Figma недоступні шрифти Inter Tight та Inter");
  if (F.med.family !== "Inter Tight") notes.push("Inter Tight недоступний, підставлено Inter");
  F.head = pick("GT Pressura LC", ["Bold"]);
  if (!F.head) {
    F.head = pick("Inter Tight", ["ExtraBold", "Bold"]) || pick("Inter", ["Extra Bold", "Bold"]);
    notes.push("GT Pressura LC не встановлений: заголовки тимчасово набрані " + F.head.family + ". Встановіть шрифт і запустіть плагін ще раз");
  }
  for (const k of Object.keys(F)) await figma.loadFontAsync(F[k]);
  try {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" }); // шрифт нового текстового шару за замовчуванням
  } catch (e) {
    // не критично
  }

  step = "кольори";
  for (const k of Object.keys(COLORS)) paints[k] = { type: "SOLID", color: hex(COLORS[k]) };
  try {
    const col = figma.variables.createVariableCollection("Співпраця × Mazda / colors " + REV);
    const mode = col.modes[0].modeId;
    for (const k of Object.keys(COLORS)) {
      const v = figma.variables.createVariable(k, col, "COLOR");
      v.setValueForMode(mode, hex(COLORS[k]));
      paints[k] = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: hex(COLORS[k]) }, "color", v);
    }
  } catch (e) {
    notes.push("змінні кольорів не створено, кольори задано напряму");
  }

  step = "текстові стилі";
  try {
    for (const d of [DESKTOP, MOBILE]) {
      for (const kind of Object.keys(d.type)) {
        const st = d.type[kind];
        const s = figma.createTextStyle();
        s.name = "Mazda " + REV + "/" + d.key + "/" + TYPE_NAMES[kind];
        s.fontName = F[st[0]];
        s.fontSize = st[1];
        s.lineHeight = { unit: "PERCENT", value: st[2] };
        s.letterSpacing = { unit: "PERCENT", value: st[3] };
        s.textCase = st[4] ? "UPPER" : "ORIGINAL";
        styles[d.key][kind] = s;
      }
    }
  } catch (e) {
    styles.Desktop = {};
    styles.Mobile = {};
    notes.push("текстові стилі не створено, типографіку задано напряму");
  }

  step = "картинки";
  for (const k of ["hero", "stamp", "kb", "mazda"]) img[k] = figma.createImage(figma.base64Decode(A[k])).hash;
}

// ---------- сторінка лендінгу ----------
async function buildLanding(d, host, originX) {
  const tags = [];
  const root = al("VERTICAL", "Mazda × Співпраця — " + d.key + " " + d.W + " (екрани 1–3) · " + REV, 0);
  root.fills = [P("cream")];
  root.clipsContent = true;
  host.appendChild(root);
  root.x = originX;
  root.y = 0;
  root.resize(d.W, 100);
  root.counterAxisSizingMode = "FIXED";
  root.primaryAxisSizingMode = "AUTO";

  // шапка (#1)
  step = d.key + ": шапка";
  const header = al("HORIZONTAL", "header", 0);
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  pad(header, d.headerPadY, d.padX);
  header.fills = [P("cream")];
  add(root, header, true);
  const credit = async (text, logo, right) => {
    const f = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "credit", d.vertical ? 6 : 12);
    f.counterAxisAlignItems = d.vertical ? (right ? "MAX" : "MIN") : "CENTER";
    f.appendChild(await T(d, "label", text, "black", "lbl"));
    f.appendChild(logo);
    return f;
  };
  const creditsL = al("HORIZONTAL", "credits", d.creditsGap);
  creditsL.counterAxisAlignItems = d.vertical ? "MAX" : "CENTER";
  header.appendChild(creditsL);
  creditsL.appendChild(await credit("Автор проєкту", logoAin(d.logoS), false));
  creditsL.appendChild(await credit("За підтримки", logoKredo(d.logoS), false));
  header.appendChild(await credit("Автомобільний партнер", logoMazdaH(d.logoS), true));
  tags.push([header, "шапка окремим блоком · логотипи окремими файлами (SVG), Mazda — горизонтальна версія"]);

  // hero (#2, #3)
  step = d.key + ": hero";
  const hero = al("VERTICAL", "sec hero (video)", 0);
  hero.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: img.hero }, shade(0.1, 0.2, 0.8)];
  hero.clipsContent = true;
  hero.paddingTop = d.heroPad[0];
  hero.paddingBottom = d.heroPad[1] * (d.vertical ? 1 : 1.75);
  hero.paddingLeft = d.padX;
  hero.paddingRight = d.padX;
  hero.primaryAxisAlignItems = "MAX";
  add(root, hero, true);
  hero.resize(d.W, d.heroH);
  hero.primaryAxisSizingMode = "FIXED";
  const title = al("VERTICAL", "hero-title", d.titleGap);
  add(hero, title, true);
  const stamp = imgRect("stamp", d.stampW, Math.round((d.stampW * 151) / 585), "logo-spivpratsia");
  title.appendChild(stamp);
  const h1 = wrapText(title, await T(d, "h1", TXT.h1, "cream", "h1"), 0);
  tags.push([hero, TXT.video]);
  tags.push([stamp, "лого проєкту з'являється першим (opacity 0 → 1)"]);
  tags.push([h1, "h1 сторінки (SEO) · анімована типографіка: рядки по черзі виїжджають з-під маски, цифри 2500 / 5 / 1 рахуються від 0 (data-count)"]);
  tags.push([h1, "після появи заголовок повільно зсувається за скролом (паралакс відносно відео)"]);

  // вступ (#4, #7)
  step = d.key + ": вступ";
  const sec2 = al("VERTICAL", "sec", 0);
  pad(sec2, d.secPad, 0);
  sec2.fills = [P("cream")];
  add(root, sec2, true);
  const wrap2 = al("VERTICAL", "wrap", d.wrapGap);
  pad(wrap2, 0, d.padX);
  add(sec2, wrap2, true);
  const split2 = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "split", d.vertical ? 32 : 0);
  if (!d.vertical) split2.primaryAxisAlignItems = "SPACE_BETWEEN";
  add(wrap2, split2, true);
  const colL = al("VERTICAL", "col", d.colGap);
  split2.appendChild(colL);
  if (d.colLW) {
    colL.resize(d.colLW, 100);
    colL.counterAxisSizingMode = "FIXED";
    colL.primaryAxisSizingMode = "AUTO";
  } else {
    colL.layoutSizingHorizontal = "FILL";
  }
  const tag2 = await pill(d, TXT.tag2, "black", "cream");
  colL.appendChild(tag2);
  const lead = wrapText(colL, await T(d, "lead", TXT.lead, "black", "lead"), 0);
  const colR = al("VERTICAL", "col", d.pGap);
  split2.appendChild(colR);
  if (d.colRW) {
    colR.resize(d.colRW, 100);
    colR.counterAxisSizingMode = "FIXED";
    colR.primaryAxisSizingMode = "AUTO";
    colR.paddingTop = Math.round(tag2.height + d.colGap);
  } else {
    colR.layoutSizingHorizontal = "FILL";
  }
  const p1 = wrapText(colR, await T(d, "body", TXT.p1, "black", "p"), 0);
  wrapText(colR, await T(d, "body", TXT.p2, "black", "p"), 0);
  tags.push([tag2, 'id="s2" · пігулка розділу · data-anim="reveal"']);
  tags.push([lead, 'data-anim="scrub" · слова темнішають під час скролу']);
  tags.push([p1, 'data-anim="words"']);

  // фактоїди (#8)
  step = d.key + ": фактоїди";
  const plates = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "plates", d.platesGap);
  add(wrap2, plates, true);
  const plateW = d.vertical ? d.W - d.padX * 2 : (d.W - d.padX * 2 - d.platesGap * 2) / 3;
  const crops = [[0.2, 0.55, 2.0], [0.45, 0.5, 2.4], [0.72, 0.42, 2.2]];
  for (let i = 0; i < TXT.plates.length; i++) {
    const pl = al("VERTICAL", "plate", 8);
    pad(pl, d.platePad, d.platePad);
    pl.primaryAxisAlignItems = "SPACE_BETWEEN";
    pl.fills = [P("black")];
    pl.clipsContent = true;
    plates.appendChild(pl);
    pl.resize(plateW, d.plateH);
    pl.primaryAxisSizingMode = "FIXED";
    pl.counterAxisSizingMode = "FIXED";
    if (d.vertical) pl.layoutSizingHorizontal = "FILL";
    else pl.layoutGrow = 1;
    const ph = photoCrop(plateW, d.plateH, crops[i][0], crops[i][1], crops[i][2], "photo");
    pl.appendChild(ph);
    ph.layoutPositioning = "ABSOLUTE";
    ph.x = 0;
    ph.y = 0;
    const sh = figma.createRectangle();
    sh.name = "shade";
    sh.resize(plateW, d.plateH);
    sh.fills = [shade(0.35, 0.45, 0.8)];
    pl.appendChild(sh);
    sh.layoutPositioning = "ABSOLUTE";
    sh.x = 0;
    sh.y = 0;
    pl.appendChild(await T(d, "num", TXT.plates[i][0], "cream", "num"));
    wrapText(pl, await T(d, "cap", TXT.plates[i][1], "cream", "cap"), 0);
  }
  tags.push([plates, "data-count · 0 → «2500+» / «5» / «1» · плашки виїжджають знизу по черзі"]);
  tags.push([plates, "фото у плашках і полароїдах — заглушки з відео; потрібні кадри з експедиції"]);

  // продуктова вставка (#9)
  step = d.key + ": продуктова вставка";
  const pr = d.product;
  const product = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "product", 0);
  product.fills = [P("beige")];
  product.counterAxisAlignItems = "CENTER";
  add(wrap2, product, true);
  const fig = figma.createFrame();
  fig.name = "fig";
  fig.fills = [];
  fig.clipsContent = false;
  fig.resize(pr.figW, pr.figH);
  product.appendChild(fig);
  for (const s of pr.shots) {
    const ph = polaroid(s[0], s[4], s[5], s[3]);
    fig.appendChild(ph);
    ph.x = s[1];
    ph.y = s[2];
  }
  const pcol = al("VERTICAL", "col", pr.gap);
  pad(pcol, pr.pad, pr.pad);
  add(product, pcol, true);
  pcol.appendChild(await pill(d, TXT.productTag, "black", "cream"));
  const stampBox = al("HORIZONTAL", "partner-stamp", 0);
  pad(stampBox, Math.round(10 * pr.logoS), Math.round(16 * pr.logoS));
  stampBox.strokes = [P("black")];
  stampBox.strokeWeight = 2;
  stampBox.appendChild(logoMazdaH(pr.logoS));
  pcol.appendChild(stampBox);
  stampBox.rotation = 2;
  pcol.appendChild(await T(d, "productTitle", TXT.productTitle, "black", "h3"));
  wrapText(pcol, await T(d, "body", TXT.productText, "black", "p"), pr.pW);
  pcol.appendChild(await pill(d, TXT.cta, "black", "cream", "cta", [d.tagPad[0] * 2, d.tagPad[1] * 2]));
  tags.push([product, 'продуктова вставка Mazda CX-90 · data-anim="reveal" · фото, текст і посилання — заглушки']);

  // маршрут (#10–#13)
  step = d.key + ": маршрут";
  const route = al("VERTICAL", "sec route", 0);
  pad(route, d.secPad, 0);
  route.fills = [P("beige")];
  add(root, route, true);
  const wrap3 = al("VERTICAL", "wrap", d.routeGap);
  pad(wrap3, 0, d.padX);
  add(route, wrap3, true);
  const head3 = al("VERTICAL", "col", d.colGap);
  add(wrap3, head3, true);
  const tag3 = await pill(d, TXT.tag3, "black", "cream");
  head3.appendChild(tag3);
  const h2 = wrapText(head3, await T(d, "h2", TXT.h2, "black", "h2"), d.h2W);
  const split3 = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "split", d.splitGap);
  split3.counterAxisAlignItems = d.vertical ? "MIN" : "CENTER";
  add(wrap3, split3, true);

  const stops = al("VERTICAL", "stops", d.stopsGap);
  const map = figma.createFrame();
  map.name = "fig map";
  map.fills = [];
  map.clipsContent = false;
  map.resize(d.mapW, d.mapH);
  if (d.vertical) {
    split3.appendChild(map);
    add(split3, stops, true);
  } else {
    split3.appendChild(stops);
    stops.resize(d.stopsW, 100);
    stops.counterAxisSizingMode = "FIXED";
    stops.primaryAxisSizingMode = "AUTO";
    split3.appendChild(map);
  }
  for (const s of TXT.stops) {
    const st = al("HORIZONTAL", "stop", d.stopGap);
    pad(st, d.stopPad[0], d.stopPad[1]);
    st.fills = [P("orange")];
    add(stops, st, true);
    st.appendChild(await T(d, "stopN", s[0], "black", "n"));
    const c = al("VERTICAL", "col", 6);
    add(st, c, true);
    wrapText(c, await T(d, "stopName", s[1], "black", "h3"), 0);
    wrapText(c, await T(d, "stopNote", s[2], "black", "p"), 0);
  }

  step = d.key + ": карта";
  const k = d.mapW / 840;
  const svg = figma.createNodeFromSvg(A.map);
  svg.name = "ukraine";
  map.appendChild(svg);
  if (k !== 1) svg.rescale(k);
  svg.x = -2.35 * k;
  svg.y = -2.39 * k;
  for (const pin of PINS) {
    const cx = pin[0] * k;
    const cy = pin[1] * k;
    const dot = figma.createEllipse();
    dot.name = "stop-dot";
    dot.resize(d.dot, d.dot);
    dot.fills = [P("black")];
    dot.strokes = [P("cream")];
    dot.strokeWeight = Math.max(2, Math.round(d.dot * 0.22));
    dot.strokeAlign = "INSIDE";
    map.appendChild(dot);
    dot.x = cx - d.dot / 2;
    dot.y = cy - d.dot / 2;
    const pl = await pill(d, pin[2], "black", "cream", "map-label", d.pinPad, "pin");
    map.appendChild(pl);
    const g = d.dot * 0.3;
    if (pin[3] === "right") {
      pl.x = Math.round(dot.x + d.dot + g);
      pl.y = Math.round(cy - pl.height / 2);
    } else if (pin[3] === "above-right") {
      pl.x = Math.round(dot.x + d.dot - 2);
      pl.y = Math.round(dot.y - pl.height + 2);
    } else {
      pl.x = Math.max(2, Math.round(dot.x - d.dot * 0.9));
      pl.y = Math.round(dot.y - pl.height - g);
    }
  }
  tags.push([tag3, 'id="s3" · пігулка розділу']);
  tags.push([h2, 'data-anim="letters" · «2500» — data-count 0 → 2500']);
  tags.push([map, "карта України: Natural Earth, лише суша (з Кримом), межі областей · SVG"]);
  tags.push([map, "області маршруту підсвічуються, коли лінія до них доходить"]);
  tags.push([map, "data-route · лінія малюється під час скролу (stroke-dashoffset)"]);
  tags.push([stops, 'data-anim="reveal" · плашки зупинок з\'являються по черзі, коли лінія маршруту доходить до точки']);

  // рожеві мітки анімацій праворуч від макета
  step = d.key + ": мітки";
  const box = figma.createFrame();
  box.name = "↳ мітки анімацій (не імпортувати)";
  box.fills = [];
  box.clipsContent = false;
  box.resize(10, 10);
  host.appendChild(box);
  box.x = originX + d.W + 40;
  box.y = 0;
  const top = root.absoluteBoundingBox ? root.absoluteBoundingBox.y : 0;
  const rows = tags
    .map((t, i) => ({ i, y: (t[0].absoluteBoundingBox ? t[0].absoluteBoundingBox.y : 0) - top, text: t[1] }))
    .sort((a, b) => a.y - b.y || a.i - b.i);
  let last = -1e9;
  for (const r of rows) {
    const f = al("HORIZONTAL", "tag", 0);
    pad(f, 6, 12);
    f.cornerRadius = 8;
    f.fills = [{ type: "SOLID", color: hex("FF3D9A"), opacity: 0.16 }];
    f.strokes = [{ type: "SOLID", color: hex("FF3D9A") }];
    const t = figma.createText();
    t.fontName = F.semi;
    t.fontSize = 13;
    t.characters = r.text;
    t.fills = [{ type: "SOLID", color: PINK }];
    f.appendChild(t);
    box.appendChild(f);
    const y = Math.max(Math.round(r.y), last + 34);
    f.x = 0;
    f.y = y;
    last = y;
  }
  return root;
}

// ---------- сторінка стилів ----------
async function buildStyles(host, originX) {
  step = "стилі";
  const d = DESKTOP;
  const root = al("VERTICAL", "Дизайн-система · " + REV, 36);
  pad(root, 64, 64);
  root.fills = [P("cream")];
  host.appendChild(root);
  root.x = originX;
  root.y = 0;
  root.appendChild(await T(d, "h2", "Mazda × Співпраця — стилі", "black", "title"));
  root.appendChild(await T(d, "label", "Кольори (змінні «Співпраця × Mazda / colors " + REV + "»)", "orange", "lbl"));
  const sw = al("HORIZONTAL", "swatches", 20);
  root.appendChild(sw);
  for (const k of Object.keys(COLORS)) {
    const s = al("VERTICAL", "swatch " + k, 8);
    const r = figma.createRectangle();
    r.resize(160, 100);
    r.fills = [P(k)];
    r.strokes = [{ type: "SOLID", color: hex("000000"), opacity: 0.12 }];
    s.appendChild(r);
    s.appendChild(await T(d, "stopNote", k + "  #" + COLORS[k], "black", "name"));
    sw.appendChild(s);
  }
  root.appendChild(
    await T(d, "label", "Шрифти: " + F.head.family + " " + F.head.style + " — заголовки, цифри, мітки · " + F.med.family + " — текст і пігулки", "orange", "lbl")
  );
  const type = al("VERTICAL", "type", 20);
  root.appendChild(type);
  for (const kind of Object.keys(d.type)) {
    const row = al("HORIZONTAL", "type " + kind, 40);
    row.counterAxisAlignItems = "CENTER";
    const meta = await T(d, "stopNote", TYPE_NAMES[kind] + "\n" + d.type[kind][1] + " / " + MOBILE.type[kind][1] + " px", "black", "meta");
    row.appendChild(meta);
    meta.resize(220, meta.height);
    meta.textAutoResize = "HEIGHT";
    row.appendChild(await T(d, kind, kind === "num" ? "2500+" : "Mazda CX-90 у «Співпраці»", "black", "sample"));
    type.appendChild(row);
  }
  root.appendChild(await T(d, "label", "Елементи", "orange", "lbl"));
  const els = al("HORIZONTAL", "elements", 32);
  els.counterAxisAlignItems = "CENTER";
  root.appendChild(els);
  els.appendChild(await pill(d, "Спецпроєкт", "black", "cream"));
  els.appendChild(await pill(d, TXT.cta, "black", "cream", "cta", [16, 28]));
  els.appendChild(logoMazdaH(1.5));
  els.appendChild(polaroid(180, 0.72, 0.42, 4));
  return root;
}

// ---------- запуск ----------
async function main() {
  await setup();
  step = "сторінки";
  let pages = null;
  const made = [];
  try {
    pages = {};
    for (const k of ["desktop", "mobile", "system"]) {
      pages[k] = figma.createPage();
      made.push(pages[k]);
    }
    pages.desktop.name = DESKTOP.title + " · " + REV;
    pages.mobile.name = MOBILE.title + " · " + REV;
    pages.system.name = "🧩 Стилі · " + REV;
  } catch (e) {
    // ліміт сторінок у файлі: будуємо все на поточній сторінці поруч
    for (const p of made) {
      try {
        p.remove();
      } catch (e2) {
        // залишиться порожня сторінка
      }
    }
    pages = null;
    notes.push("нові сторінки створити не вдалося (ліміт плану), усе зібрано на поточній сторінці");
  }
  let first;
  if (pages) {
    await figma.setCurrentPageAsync(pages.desktop);
    first = await buildLanding(DESKTOP, pages.desktop, 0);
    await figma.setCurrentPageAsync(pages.mobile);
    await buildLanding(MOBILE, pages.mobile, 0);
    await figma.setCurrentPageAsync(pages.system);
    await buildStyles(pages.system, 0);
    await figma.setCurrentPageAsync(pages.desktop);
  } else {
    const page = figma.currentPage;
    let x = 0;
    for (const n of page.children) x = Math.max(x, n.x + n.width);
    x = Math.round(x + 400);
    first = await buildLanding(DESKTOP, page, x);
    await buildLanding(MOBILE, page, x + 2600);
    await buildStyles(page, x + 4000);
  }
  try {
    figma.viewport.scrollAndZoomIntoView([first]);
  } catch (e) {
    // не критично
  }
  return "Готово: Desktop 1440, Mobile 390 і Стилі (" + REV + ")." + (notes.length ? " Увага: " + notes.join("; ") + "." : "");
}

main()
  .then((msg) => figma.closePlugin(msg))
  .catch((e) => {
    const text = "Помилка на кроці «" + step + "»: " + (e && e.message ? e.message : e);
    console.error(text, e);
    figma.closePlugin(text + ". Натисніть Ctrl+Z і надішліть цей текст.");
  });
