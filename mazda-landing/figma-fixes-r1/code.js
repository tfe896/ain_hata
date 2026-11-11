// Mazda × Співпраця — правки дизайнерки, раунд 1 (13 коментарів у Figma від 11.11).
// Працює по файлу «Godlike — мудборд», сторінки 25:41 (Desktop), 25:42 (Mobile), 25:43 (Стилі).
// Правки вносяться на місці; перед цим зберігається версія в історії файлу.

const RUN_KEY = "mazda-fixes-r1";
const NBSP = " ";

const hex = (h) => ({
  r: parseInt(h.slice(0, 2), 16) / 255,
  g: parseInt(h.slice(2, 4), 16) / 255,
  b: parseInt(h.slice(4, 6), 16) / 255,
});
const C = { orange: hex("EF6320"), cream: hex("FFF9D9"), black: hex("000000"), sand: hex("EFE2B6") };
const solid = (c) => [{ type: "SOLID", color: c }];
const shade = (a0, a1, a2) => ({
  type: "GRADIENT_LINEAR",
  gradientTransform: [[0, 1, 0], [-1, 0, 1]],
  gradientStops: [
    { position: 0, color: { r: 0, g: 0, b: 0, a: a0 } },
    { position: 0.5, color: { r: 0, g: 0, b: 0, a: a1 } },
    { position: 1, color: { r: 0, g: 0, b: 0, a: a2 } },
  ],
});

const TXT = {
  h1: "2500 кілометрів,\n5 співпраць\nі 1 автомобіль",
  h2: "2500" + NBSP + "км від Київщини до" + NBSP + "Верховини і" + NBSP + "назад",
  productTitle: "Mazda CX-90",
  productText:
    "Великий кросовер, який супроводжував знімальну групу всі 2500 кілометрів маршруту і став частиною знімального процесу.",
  cta: "Більше про Mazda CX-90 →",
};

const DESKTOP = {
  key: "desktop",
  page: "25:41", root: "25:58", hero: "25:59", top: "25:60", mazdaLight: "25:64",
  stampFrame: "25:65", stampLogo: "25:66", sticker: "25:67",
  wrap2: "25:70", split2: "25:71", colL: "25:72", lbl: "25:73", h1: "25:74", lead: "25:75",
  colR: "25:76", p1: "25:77", p2: "25:78", plates: "25:79", plateInst: ["25:80", "25:83", "25:86"],
  credits: "25:89", creditLbl: "25:91", kbDark: "25:92", mazdaDark: "25:95",
  route: "25:96", routeLbl: "25:99", h2: "25:100", stops: "25:102",
  stop: ["25:103", "25:108", "25:113", "25:118", "25:123"], stopH3: "25:106",
  map: "25:128", badge: "25:144", tags: "25:146",
  pins: [["25:136", "25:137", "right"], ["25:138", "25:139", "above-right"], ["25:140", "25:141", "above"], ["25:142", "25:143", "right"]],
  plateComp: "25:44",
  vertical: false, headerPad: [18, 56], headerLbl: 13, logoS: 1, creditsGap: 40,
  heroH: 900, stampW: 280, h1Size: 112, h1LH: 104, titleGap: 32,
  tagPad: [8, 14], colLW: 760, colRW: 400,
  product: { dir: "HORIZONTAL", figW: 560, figH: 420, pad: 56, gap: 24, logoS: 1.5, h3: 56, pW: 480 },
  stopPad: [16, 20], stopsGap: 8, pinPad: [4, 8],
};

const MOBILE = {
  key: "mobile",
  page: "25:42", root: "25:183", hero: "25:184", top: "25:185", mazdaLight: "25:188",
  stampFrame: "25:189", stampLogo: "25:190", sticker: "25:191",
  wrap2: "25:194", split2: "25:195", colL: "25:196", lbl: "25:197", h1: "25:198", lead: "25:199",
  colR: "25:200", p1: "25:201", p2: "25:202", plates: "25:203", plateInst: ["25:204", "25:207", "25:210"],
  credits: "25:213", creditLbl: "25:215", kbDark: "25:216", mazdaDark: "25:219",
  route: "25:220", routeLbl: "25:223", h2: "25:224", stops: "25:244",
  stop: ["25:245", "25:250", "25:255", "25:260", "25:265"], stopH3: "25:248",
  map: "25:226", badge: "25:242", tags: "25:270",
  pins: [["25:234", "25:235", "right"], ["25:236", "25:237", "above-right"], ["25:238", "25:239", "above"], ["25:240", "25:241", "right"]],
  plateComp: "25:51",
  vertical: true, headerPad: [12, 20], headerLbl: 10, logoS: 0.6, creditsGap: 18,
  heroH: 780, stampW: 150, h1Size: 40, h1LH: 38, titleGap: 18,
  tagPad: [6, 10], colLW: 0, colRW: 0,
  product: { dir: "VERTICAL", figW: 350, figH: 210, pad: 24, gap: 16, logoS: 1.1, h3: 34, pW: 0 },
  stopPad: [12, 14], stopsGap: 6, pinPad: [2, 5],
};

const STYLES = {
  page: "25:43", fontsLbl: "25:320", swatchCream: "25:314", h1Meta: "25:323",
  stickers: ["25:47", "25:49", "25:54", "25:56"],
};

let step = "старт";
let interTight = {};

// ---------- helpers ----------
async function get(id) {
  const n = await figma.getNodeByIdAsync(id);
  if (!n) throw new Error("не знайдено шар " + id);
  return n;
}
async function loadFor(t) {
  if (t.characters.length > 0) {
    for (const f of t.getRangeAllFontNames(0, t.characters.length)) await figma.loadFontAsync(f);
  } else if (typeof t.fontName === "object") {
    await figma.loadFontAsync(t.fontName);
  }
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
  f.paddingTop = v; f.paddingBottom = v; f.paddingLeft = h; f.paddingRight = h;
}
// Частина растрового логотипа: рамка-маска з копією картинки всередині.
function cropOf(src, baseW, baseH, x0, y0, x1, y1, s, name) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = [];
  f.clipsContent = true;
  f.resize(Math.max(1, (x1 - x0) * s), Math.max(1, (y1 - y0) * s));
  const r = src.clone();
  f.appendChild(r);
  r.resize(baseW * s, baseH * s);
  r.x = -x0 * s;
  r.y = -y0 * s;
  return f;
}
// Логотип KredoBank | ain намальований у полі 249×34, Mazda (вертикальна) у полі 72×64.
const logoAin = (src, s) => cropOf(src, 249, 34, 159.5, 0, 249, 34, s, "logo-ain");
const logoKredo = (src, s) => cropOf(src, 249, 34, 0, 0, 134.5, 34, s, "logo-kredobank");
function logoMazdaH(src, s) {
  const f = al("HORIZONTAL", "logo-mazda-horizontal", Math.round(10 * s));
  f.counterAxisAlignItems = "CENTER";
  f.appendChild(cropOf(src, 72, 64, 7, 0, 64.5, 46.5, (s * 34) / 46.5, "emblem"));
  f.appendChild(cropOf(src, 72, 64, 0, 52, 72, 64, s * 0.95, "wordmark"));
  return f;
}
async function setText(t, chars) {
  await loadFor(t);
  t.characters = chars;
}
async function labelClone(src, chars, size, color) {
  const t = src.clone();
  await loadFor(t);
  t.characters = chars;
  if (size) {
    t.fontSize = size;
    t.lineHeight = { unit: "PERCENT", value: 120 };
  }
  t.fills = solid(color);
  t.textAutoResize = "WIDTH_AND_HEIGHT";
  t.name = "lbl";
  return t;
}
// Мітка розділу у вигляді плашки.
function plateAround(text, bg, fg, p, name) {
  const parent = text.parent;
  const i = parent.children.indexOf(text);
  const f = al("HORIZONTAL", name || "tag", 0);
  pad(f, p[0], p[1]);
  f.fills = solid(bg);
  parent.insertChild(i, f);
  f.appendChild(text);
  text.fills = solid(fg);
  text.textAutoResize = "WIDTH_AND_HEIGHT";
  return f;
}
function cropPaint(hash, imgW, imgH, boxW, boxH, cx, cy, frac) {
  let sx = frac;
  let sy = (frac * (imgW / imgH)) / (boxW / boxH);
  if (sy > 1) { sx = sx / sy; sy = 1; }
  const tx = Math.min(Math.max(cx - sx / 2, 0), 1 - sx);
  const ty = Math.min(Math.max(cy - sy / 2, 0), 1 - sy);
  return { type: "IMAGE", scaleMode: "CROP", imageHash: hash, imageTransform: [[sx, 0, tx], [0, sy, ty]] };
}

// ---------- one device ----------
async function fixDevice(d, ctx) {
  const root = await get(d.root);
  const hero = await get(d.hero);
  const heroImg = hero.fills.find((p) => p.type === "IMAGE");
  if (!heroImg) throw new Error("у hero немає фонового кадру");
  const size = await figma.getImageByHash(heroImg.imageHash).getSizeAsync();
  const creditLbl = await get(d.creditLbl);
  const kbDark = await get(d.kbDark);
  const mazdaDark = await get(d.mazdaDark);
  const mazdaLight = await get(d.mazdaLight);
  const lbl = await get(d.lbl);

  // #1 — окрема шапка: автор / за підтримки ліворуч, автомобільний партнер праворуч, лого в один рядок
  step = d.key + ": шапка";
  const header = al("HORIZONTAL", "header", 0);
  header.primaryAxisAlignItems = "SPACE_BETWEEN";
  header.counterAxisAlignItems = "CENTER";
  pad(header, d.headerPad[0], d.headerPad[1]);
  header.fills = solid(C.cream);
  root.insertChild(0, header);
  header.layoutSizingHorizontal = "FILL";
  const mkCredit = async (text, logo, right) => {
    const f = al(d.vertical ? "VERTICAL" : "HORIZONTAL", "credit", d.vertical ? 6 : 12);
    f.counterAxisAlignItems = d.vertical ? (right ? "MAX" : "MIN") : "CENTER";
    f.appendChild(await labelClone(creditLbl, text, d.headerLbl, C.black));
    f.appendChild(logo);
    return f;
  };
  const creditsL = al("HORIZONTAL", "credits", d.creditsGap);
  creditsL.counterAxisAlignItems = d.vertical ? "MAX" : "CENTER";
  header.appendChild(creditsL);
  creditsL.appendChild(await mkCredit("Автор проєкту", logoAin(kbDark, d.logoS), false));
  creditsL.appendChild(await mkCredit("За підтримки", logoKredo(kbDark, d.logoS), false));
  header.appendChild(await mkCredit("Автомобільний партнер", logoMazdaH(mazdaDark, d.logoS), true));

  // #2, #3 — hero: без стікера й великого штампа, заголовок-типографіка поверх відео
  step = d.key + ": hero";
  const h1 = await get(d.h1);
  const stampLogo = await get(d.stampLogo);
  const productLogo = logoMazdaH(mazdaLight, d.product.logoS); // поки «top» ще існує
  const title = al("VERTICAL", "hero-title", d.titleGap);
  hero.appendChild(title);
  title.layoutSizingHorizontal = "FILL";
  title.appendChild(stampLogo);
  stampLogo.resize(d.stampW, Math.round((d.stampW * 279) / 1080));
  title.appendChild(h1);
  await loadFor(h1);
  h1.characters = TXT.h1;
  h1.fontSize = d.h1Size;
  h1.lineHeight = { unit: "PIXELS", value: d.h1LH };
  h1.fills = solid(C.cream);
  h1.layoutSizingHorizontal = "FILL";
  h1.textAutoResize = "HEIGHT";
  (await get(d.top)).remove();
  (await get(d.stampFrame)).remove();
  hero.fills = [heroImg, shade(0.1, 0.2, 0.8)];
  hero.primaryAxisAlignItems = "MAX";
  hero.counterAxisAlignItems = "MIN";
  hero.layoutSizingVertical = "FIXED";
  hero.resize(hero.width, d.heroH);

  // #4 — мітки розділів плашками; #7 — вужча колонка тексту
  step = d.key + ": вступ";
  const ctaLbl = await labelClone(lbl, TXT.cta, 0, C.black);
  const productLbl = await labelClone(lbl, "Автомобільний партнер", 0, C.black);
  const tag2 = plateAround(lbl, C.black, C.cream, d.tagPad);
  const colL = await get(d.colL);
  const colR = await get(d.colR);
  const split2 = await get(d.split2);
  const p1 = await get(d.p1);
  const p2 = await get(d.p2);
  if (d.colRW) {
    split2.primaryAxisAlignItems = "SPACE_BETWEEN";
    colL.layoutSizingHorizontal = "FIXED";
    colL.resize(d.colLW, colL.height);
    colR.layoutSizingHorizontal = "FIXED";
    colR.resize(d.colRW, colR.height);
    for (const p of [p1, p2]) {
      p.layoutSizingHorizontal = "FILL";
      p.textAutoResize = "HEIGHT";
    }
    colR.paddingTop = Math.round(tag2.height + colL.itemSpacing);
  }

  // #8 — фактоїди з фоновими фото (поки що кадри з відео)
  step = d.key + ": фактоїди";
  const crops = [[0.2, 0.55, 0.5], [0.45, 0.5, 0.42], [0.72, 0.42, 0.44]];
  for (let i = 0; i < d.plateInst.length; i++) {
    const inst = await get(d.plateInst[i]);
    const c = crops[i];
    inst.fills = [
      cropPaint(heroImg.imageHash, size.width, size.height, inst.width, inst.height, c[0], c[1], c[2]),
      shade(0.35, 0.45, 0.8),
    ];
    const num = inst.findOne((n) => n.name === "num");
    const cap = inst.findOne((n) => n.name === "cap");
    if (num) num.fills = solid(C.orange);
    if (cap) cap.fills = solid(C.cream);
  }

  // #9 — продуктова вставка замість блоку логотипів
  step = d.key + ": продуктова вставка";
  const wrap2 = await get(d.wrap2);
  const credits = await get(d.credits);
  const pr = d.product;
  const product = al(pr.dir, "product", 0);
  product.fills = solid(C.black);
  wrap2.insertChild(wrap2.children.indexOf(credits), product);
  product.layoutSizingHorizontal = "FILL";
  const fig = figma.createFrame();
  fig.name = "fig";
  fig.resize(pr.figW, pr.figH);
  fig.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: heroImg.imageHash }];
  product.appendChild(fig);
  if (pr.dir === "HORIZONTAL") fig.layoutSizingVertical = "FILL";
  else fig.layoutSizingHorizontal = "FILL";
  const col = al("VERTICAL", "col", pr.gap);
  pad(col, pr.pad, pr.pad);
  col.primaryAxisAlignItems = "CENTER";
  product.appendChild(col);
  col.layoutSizingHorizontal = "FILL";
  const pTag = al("HORIZONTAL", "tag", 0);
  pad(pTag, d.tagPad[0], d.tagPad[1]);
  pTag.fills = solid(C.orange);
  pTag.appendChild(productLbl);
  col.appendChild(pTag);
  col.appendChild(productLogo);
  const h3 = (await get(d.stopH3)).clone();
  col.appendChild(h3);
  await loadFor(h3);
  h3.characters = TXT.productTitle;
  h3.fontSize = pr.h3;
  h3.lineHeight = { unit: "PERCENT", value: 100 };
  h3.fills = solid(C.cream);
  h3.textAutoResize = "WIDTH_AND_HEIGHT";
  const pp = p2.clone();
  col.appendChild(pp);
  await loadFor(pp);
  pp.characters = TXT.productText;
  pp.fills = solid(C.cream);
  if (pr.pW) {
    pp.layoutSizingHorizontal = "FIXED";
    pp.resize(pr.pW, pp.height);
  } else {
    pp.layoutSizingHorizontal = "FILL";
  }
  pp.textAutoResize = "HEIGHT";
  const cta = al("HORIZONTAL", "cta", 0);
  pad(cta, d.tagPad[0] * 2, d.tagPad[1] * 2);
  cta.fills = solid(C.orange);
  cta.appendChild(ctaLbl);
  col.appendChild(cta);
  credits.remove();

  // #10 — спокійніший фон маршруту; #13 — «2500 км» у заголовку
  step = d.key + ": маршрут";
  const route = await get(d.route);
  route.fills = [ctx.sandPaint];
  plateAround(await get(d.routeLbl), C.black, C.cream, d.tagPad);
  await setText(await get(d.h2), TXT.h2);
  (await get(d.badge)).remove();

  // #12 — зупинки плашками
  const stops = await get(d.stops);
  stops.itemSpacing = d.stopsGap;
  stops.strokes = [];
  for (const id of d.stop) {
    const s = await get(id);
    s.strokes = [];
    s.fills = solid(C.orange);
    s.paddingTop = d.stopPad[0]; s.paddingBottom = d.stopPad[0];
    s.paddingLeft = d.stopPad[1]; s.paddingRight = d.stopPad[1];
    s.layoutSizingHorizontal = "FILL";
    const n = s.findOne((x) => x.name === "n");
    if (n) n.fills = solid(C.black);
  }

  // #11 — підписи на карті не накладаються: плашки, розведені відносно точок
  step = d.key + ": карта";
  const map = await get(d.map);
  for (const pin of d.pins) {
    const dot = await get(pin[0]);
    const t = await get(pin[1]);
    const pl = al("HORIZONTAL", "map-label", 0);
    pad(pl, d.pinPad[0], d.pinPad[1]);
    pl.fills = solid(C.black);
    map.appendChild(pl);
    pl.appendChild(t);
    t.fills = solid(C.cream);
    t.name = "lbl";
    const g = dot.width * 0.3;
    const cy = dot.y + dot.height / 2;
    if (pin[2] === "right") {
      pl.x = Math.round(dot.x + dot.width + g);
      pl.y = Math.round(cy - pl.height / 2);
    } else if (pin[2] === "above-right") {
      pl.x = Math.round(dot.x + dot.width - 2);
      pl.y = Math.round(dot.y - pl.height + 2);
    } else {
      pl.x = Math.max(2, Math.round(dot.x - dot.width * 0.9));
      pl.y = Math.round(dot.y - pl.height - g);
    }
  }

  // рожеві мітки анімацій — заново, під нову структуру
  step = d.key + ": мітки";
  const tags = await get(d.tags);
  const old = tags.children.slice();
  if (old.length) {
    const oldText = (prefix, fallback) => {
      for (const o of old) {
        const tx = o.findOne((n) => n.type === "TEXT");
        if (tx && tx.characters.indexOf(prefix) === 0) return tx.characters;
      }
      return fallback;
    };
    const items = [
      [header, "шапка окремим блоком · логотипи окремими файлами (SVG), Mazda — горизонтальна версія"],
      [hero, oldText('id="s1"', 'id="s1" · фонове відео на весь екран')],
      [stampLogo, "лого проєкту з'являється першим (opacity 0 → 1)"],
      [h1, 'h1 сторінки (SEO) · анімована типографіка: рядки по черзі виїжджають з-під маски, цифри 2500 / 5 / 1 рахуються від 0 (data-count)'],
      [h1, "після появи заголовок повільно зсувається за скролом (паралакс відносно відео)"],
      [tag2, 'id="s2" · плашка розділу · data-anim="reveal"'],
      [await get(d.lead), 'data-anim="scrub" · слова темнішають під час скролу'],
      [p1, 'data-anim="words"'],
      [await get(d.plates), "data-count · 0 → «2500+» / «5» / «1» · плашки виїжджають знизу по черзі"],
      [await get(d.plates), "фото у плашках — заглушки з відео; потрібні 3 кадри з експедиції"],
      [product, 'продуктова вставка Mazda CX-90 · data-anim="reveal" · фото, текст і посилання — заглушки'],
      [route, 'id="s3"'],
      [await get(d.h2), 'data-anim="letters" · «2500» — data-count 0 → 2500'],
      [map, oldText("карта України", "карта України · SVG")],
      [map, oldText("області маршруту", "області маршруту підсвічуються, коли лінія до них доходить")],
      [map, oldText("data-route", "data-route · лінія малюється під час скролу")],
      [stops, 'data-anim="reveal" · плашки зупинок з\'являються по черзі, коли лінія маршруту доходить до точки'],
    ];
    const baseY = tags.absoluteBoundingBox ? tags.absoluteBoundingBox.y : 0;
    const rows = items
      .map((it, i) => ({ i, y: (it[0].absoluteBoundingBox ? it[0].absoluteBoundingBox.y : 0) - baseY, text: it[1] }))
      .sort((a, b) => a.y - b.y || a.i - b.i);
    let last = -1e9;
    for (const r of rows) {
      const t = old[0].clone();
      tags.appendChild(t);
      const tx = t.findOne((n) => n.type === "TEXT");
      await setText(tx, r.text);
      const y = Math.max(Math.round(r.y), last + 34);
      t.x = 0;
      t.y = y;
      last = y;
    }
    for (const o of old) o.remove();
  }
}

// ---------- styles page ----------
async function fixStyles(ctx) {
  step = "стилі: компоненти";
  for (const d of [DESKTOP, MOBILE]) {
    const comp = await get(d.plateComp);
    comp.fills = [{ type: "IMAGE", scaleMode: "FILL", imageHash: ctx.heroHash }, shade(0.35, 0.45, 0.8)];
    const num = comp.findOne((n) => n.name === "num");
    const cap = comp.findOne((n) => n.name === "cap");
    if (num) num.fills = solid(C.orange);
    if (cap) cap.fills = solid(C.cream);
  }
  for (const id of STYLES.stickers) {
    const n = await figma.getNodeByIdAsync(id);
    if (n) n.remove();
  }
  step = "стилі: підписи";
  const fl = await get(STYLES.fontsLbl);
  await setText(fl, fl.characters.replace("Onest", "Inter Tight"));
  const meta = await get(STYLES.h1Meta);
  await setText(meta, meta.characters.replace("96 / 42", "112 / 40"));
  const sw = await get(STYLES.swatchCream);
  const sand = sw.clone();
  sw.parent.insertChild(sw.parent.children.indexOf(sw) + 1, sand);
  sand.name = "swatch sand";
  const rect = sand.findOne((n) => n.type === "RECTANGLE");
  if (rect) rect.fills = [ctx.sandPaint];
  const nm = sand.findOne((n) => n.type === "TEXT");
  if (nm) await setText(nm, "sand  #EFE2B6");
}

// ---------- fonts: Onest → Inter Tight (#6) ----------
function interStyle(style) {
  const norm = (s) => s.toLowerCase().replace(/\s+/g, "");
  return interTight[norm(style)] || interTight.medium || interTight.regular;
}
async function swapFonts(pages) {
  step = "шрифти: текстові стилі";
  for (const s of await figma.getLocalTextStylesAsync()) {
    if (s.fontName.family !== "Onest") continue;
    const to = { family: "Inter Tight", style: interStyle(s.fontName.style) };
    await figma.loadFontAsync(s.fontName);
    await figma.loadFontAsync(to);
    s.fontName = to;
  }
  step = "шрифти: шари";
  let count = 0;
  for (const page of pages) {
    for (const t of page.findAllWithCriteria({ types: ["TEXT"] })) {
      if (t.characters.length === 0) continue;
      const segs = t.getStyledTextSegments(["fontName"]);
      if (!segs.some((s) => s.fontName.family === "Onest")) continue;
      for (const s of segs) {
        if (s.fontName.family !== "Onest") continue;
        const to = { family: "Inter Tight", style: interStyle(s.fontName.style) };
        await figma.loadFontAsync(s.fontName);
        await figma.loadFontAsync(to);
        t.setRangeFontName(s.start, s.end, to);
      }
      count++;
    }
  }
  return count;
}

// ---------- main ----------
async function main() {
  if (figma.root.getPluginData(RUN_KEY)) return "Правки r1 уже застосовані в цьому файлі. Повторний запуск не потрібен.";
  step = "перевірка файлу";
  const pages = [];
  for (const id of [DESKTOP.page, MOBILE.page, STYLES.page]) {
    const p = await figma.getNodeByIdAsync(id);
    if (!p || p.type !== "PAGE") throw new Error("це не той файл: відкрийте «Godlike — мудборд» із макетом Mazda × Співпраця");
    await p.loadAsync();
    pages.push(p);
  }
  if (!(await figma.getNodeByIdAsync(DESKTOP.sticker)) || !(await figma.getNodeByIdAsync(MOBILE.sticker))) {
    throw new Error("макет уже змінено (немає стікера в hero). Плагін розрахований на версію з коментарями від 11.11");
  }

  step = "шрифти: перевірка";
  const all = await figma.listAvailableFontsAsync();
  for (const f of all) {
    if (f.fontName.family === "Inter Tight") interTight[f.fontName.style.toLowerCase().replace(/\s+/g, "")] = f.fontName.style;
  }
  if (!interTight.medium && !interTight.regular) throw new Error("у Figma недоступний шрифт Inter Tight");
  for (const st of ["Medium", "SemiBold", "Bold", "Regular"]) {
    const style = interStyle(st);
    await figma.loadFontAsync({ family: "Inter Tight", style });
  }
  // усі шрифти макета мають бути доступні ще до першої зміни
  for (const page of pages) {
    for (const t of page.findAllWithCriteria({ types: ["TEXT"] })) await loadFor(t);
  }

  step = "збереження версії";
  try {
    await figma.saveVersionHistoryAsync("До правок дизайнерки (r1)", "Стан макета перед запуском плагіна з правками за коментарями від 11.11");
  } catch (e) {
    // історія версій може бути недоступна — тоді відкат через Ctrl+Z
  }

  step = "змінна кольору";
  const ctx = { sandPaint: { type: "SOLID", color: C.sand }, heroHash: null };
  try {
    const cols = await figma.variables.getLocalVariableCollectionsAsync();
    for (const c of cols) {
      if (c.name.indexOf("Mazda") === -1) continue;
      let cream = null;
      for (const id of c.variableIds) {
        const v = await figma.variables.getVariableByIdAsync(id);
        if (v && /(^|\/)cream$/.test(v.name)) cream = v;
        if (v && /(^|\/)sand$/.test(v.name)) { cream = null; break; }
      }
      if (!cream) continue;
      const v = figma.variables.createVariable(cream.name.replace(/cream$/, "sand"), c, "COLOR");
      for (const m of c.modes) v.setValueForMode(m.modeId, C.sand);
      v.scopes = cream.scopes;
      ctx.sandPaint = figma.variables.setBoundVariableForPaint({ type: "SOLID", color: C.sand }, "color", v);
    }
  } catch (e) {
    ctx.sandPaint = { type: "SOLID", color: C.sand };
  }
  const heroD = await get(DESKTOP.hero);
  const img = heroD.fills.find((p) => p.type === "IMAGE");
  ctx.heroHash = img ? img.imageHash : null;

  await fixDevice(DESKTOP, ctx);
  await fixDevice(MOBILE, ctx);
  if (ctx.heroHash) await fixStyles(ctx);
  const swapped = await swapFonts(pages);

  figma.root.setPluginData(RUN_KEY, new Date().toISOString());
  return "Готово: правки внесено в Desktop, Mobile і Стилі. Onest → Inter Tight у " + swapped + " шарах.";
}

main()
  .then((msg) => figma.closePlugin(msg))
  .catch((e) =>
    figma.closePlugin(
      "Помилка на кроці «" + step + "»: " + (e && e.message ? e.message : e) + ". Натисніть Ctrl+Z, щоб відкотити зміни."
    )
  );
