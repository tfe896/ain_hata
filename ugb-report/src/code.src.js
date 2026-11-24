/* AIN × UGB — звіт «Українська енергетика»: оновлена презентація (38 слайдів).
   Запуск: Figma Desktop → Plugins → Development → Import plugin from manifest… → ugb-report/manifest.json → Run.
   Працює у Figma Slides (додає 38 слайдів окремим рядом у кінці) і у Figma Design (створює нову сторінку).
   Наявні слайди/сторінки не змінює.
   Згенерований файл: картинки вбудовує ugb-report/build.py. Правте src/code.src.js, а не code.js. */
const A = __ASSETS__;
const IMGS = A.img;
const SIZE = A.size;

/* ---------------- посилання ---------------- */
const URL = {
  research: "https://special.ain.ua/doslidzhennya-energetyky-ukrainy-insaity-ta-tsyfry/",
  fb1: "https://www.facebook.com/ainukraine/posts/pfbid034RydWsWX1uG2FcBNR9KkatPK4gnQ7CemyTuTskFbCd8zyaQvCGVVnxeQ7NmEt7E7l",
  fb2: "https://www.facebook.com/ainukraine/posts/pfbid02nJGKeQwWk5BdmVDFGFuUS5QMfmQCdmXrjTMf4CW11kfhw6NuowwWYoPiTwqK8pDxl",
  fb3: "https://www.facebook.com/ainukraine/posts/pfbid0e7JyrzrirdxVtJm1aLK3gLfbGjeqNj4vity3JryEezeuVLCuPpHa9c1VcdZaFKSGl",
  tg: "https://t.me/ain_ukraine/9527",
  ig1: "https://www.instagram.com/p/DfR7VJ5Ra0Z/",
  ig2: "https://www.instagram.com/p/DezD-FCjIPr/",
  ig3: "https://www.instagram.com/p/DehKOZwDEMk/",
  stories: "https://drive.google.com/drive/folders/1CAv_fr3ERULFaRkFbOKZdb1LTqOe7m1D?usp=sharing",
  art1: "https://ain.ua/2026/11/01/privatni-ses-znizuiut-dennii-popit-na-elektroenergiiu-ale-uskladniuiut-balansuvannia-energosistemi/",
  art2: "https://ain.ua/2026/10/16/ukrayini-potribno-91-mlrd-na-vidnovlennia-energetiki-protiagom-nastupnix-10-rokiv/",
  art3: "https://ain.ua/2026/10/24/vidkliucennia-svitla-voseni-ta-energeticni-soti-pislia-viini/",
  eba: "https://eba.com.ua/ua-ukrayinska-energetyka-zeleni-rishennya-vidnovlennya-j-investytsiyi/",
  kse: "https://gbs.kse.ua/insights/doslidzhennya-energetyky-ukrainy-insaity-ta-tsyfry",
  kseStories: "https://drive.google.com/drive/folders/1gSlYRtz0XTXJwHNiHmHBrdXzUSnPKG7m?usp=sharing",
  gee: "https://www.facebook.com/groups/1539733586239618/permalink/4530278547185092/",
  media: "https://drive.google.com/drive/folders/1NBhA_32A5eZG1mVZHaptAcRTBEkgw9IA",
  mail: "https://drive.google.com/file/d/1bZCsLWzq8OC7Tw7URMKredvv-YYqi_Mo/view?usp=sharing",
  invite: "https://eventmate.app/events/share/ukrainska-energetika-prezentacia-doslidzenna-ain?locale=ru",
  photos: "https://drive.google.com/drive/folders/1gukXvwZxfC_0g_sXK_UoTkuDgeArkJ00",
};

/* ---------------- токени ---------------- */
const W = 1920, H = 1080, M = 52;
const C = { red: "#FD3533", black: "#000000", white: "#FFFFFF", gray: "#6B6B6B", link: "#FD3533", ph: "#FF3D9A" };
const hex = (h) => ({ r: parseInt(h.slice(1, 3), 16) / 255, g: parseInt(h.slice(3, 5), 16) / 255, b: parseInt(h.slice(5, 7), 16) / 255 });
const solid = (h, o) => ({ type: "SOLID", color: hex(h), opacity: o == null ? 1 : o });
const LOG = [];

/* ---------------- шрифти: Noto Sans (як у презентації), запасний Inter ---------------- */
let F = null, fontNote = "";
async function loadFonts() {
  const all = await figma.listAvailableFontsAsync();
  const has = (fam, st) => all.some((x) => x.fontName.family === fam && x.fontName.style === st);
  const pick = (fam, list) => { for (const s of list) if (has(fam, s)) return { family: fam, style: s }; return null; };
  for (const fam of ["Noto Sans", "Inter"]) {
    const c = {
      r: pick(fam, ["Regular"]),
      m: pick(fam, ["Medium", "Regular"]),
      s: pick(fam, ["SemiBold", "Semi Bold", "Bold"]),
      b: pick(fam, ["Bold", "SemiBold", "Semi Bold"]),
    };
    if (c.r && c.m && c.s && c.b) { F = c; break; }
  }
  if (!F) F = { r: { family: "Inter", style: "Regular" }, m: { family: "Inter", style: "Medium" }, s: { family: "Inter", style: "Semi Bold" }, b: { family: "Inter", style: "Bold" } };
  if (F.r.family !== "Noto Sans") fontNote = "Noto Sans не знайдено — використано " + F.r.family + ". Можна замінити шрифт пізніше (виділити все → шрифт).";
  for (const k of Object.keys(F)) await figma.loadFontAsync(F[k]);
}

/* ---------------- базові вузли ---------------- */
const HASH = {};
function imgPaint(key, mode) {
  if (!IMGS[key]) { LOG.push("Немає картинки " + key); return solid("#DDDDDD"); }
  if (!HASH[key]) HASH[key] = figma.createImage(figma.base64Decode(IMGS[key])).hash;
  return { type: "IMAGE", imageHash: HASH[key], scaleMode: mode || "FILL" };
}
function ratio(key) { const s = SIZE[key]; return s ? s[0] / s[1] : 1.5; }

function rect(parent, x, y, w, h, fills, name, radius) {
  const r = figma.createRectangle();
  r.name = name || "rect";
  r.resize(Math.max(1, w), Math.max(1, h));
  r.x = x; r.y = y;
  r.fills = fills;
  if (radius) r.cornerRadius = radius;
  parent.appendChild(r);
  return r;
}
function image(parent, key, x, y, w, h, o) {
  o = o || {};
  const r = rect(parent, x, y, w, h, [imgPaint(key, o.mode || "FILL")], o.name || key, o.radius == null ? 0 : o.radius);
  return r;
}
/* картинка, вписана в коробку (зберігає пропорції, центрована) */
function fitImage(parent, key, bx, by, bw, bh, o) {
  const q = ratio(key);
  let w = bw, h = bw / q;
  if (h > bh) { h = bh; w = bh * q; }
  return image(parent, key, Math.round(bx + (bw - w) / 2), Math.round(by + (bh - h) / 2), Math.round(w), Math.round(h), o);
}

/* текст: runs = [{t, f:'r|m|s|b', c:'#hex', u:url, size}] */
function text(parent, runs, o) {
  o = o || {};
  if (typeof runs === "string") runs = [{ t: runs }];
  const t = figma.createText();
  t.name = o.name || "text";
  t.fontName = F[o.f || "r"];
  t.characters = runs.map((r) => r.t).join("") || " ";
  t.fontSize = o.size || 24;
  t.lineHeight = { unit: "PERCENT", value: (o.lh || 1.3) * 100 };
  t.fills = [solid(o.color || C.black)];
  if (o.align) t.textAlignHorizontal = o.align;
  let i = 0;
  for (const r of runs) {
    const a = i, b = i + r.t.length; i = b;
    if (b <= a) continue;
    if (r.f) t.setRangeFontName(a, b, F[r.f]);
    if (r.c) t.setRangeFills(a, b, [solid(r.c)]);
    if (r.size) t.setRangeFontSize(a, b, r.size);
    if (r.u) {
      try { t.setRangeHyperlink(a, b, { type: "URL", value: r.u }); } catch (e) { LOG.push("Посилання: " + e.message); }
      t.setRangeTextDecoration(a, b, "UNDERLINE");
    }
    if (r.ul) t.setRangeTextDecoration(a, b, "UNDERLINE");
  }
  parent.appendChild(t);
  if (o.w) { t.resize(o.w, 10); t.textAutoResize = "HEIGHT"; } else t.textAutoResize = "WIDTH_AND_HEIGHT";
  t.x = o.x || 0; t.y = o.y || 0;
  return t;
}

/* пігулка (auto layout) */
function pill(parent, runs, o) {
  o = o || {};
  const f = figma.createFrame();
  f.name = o.name || "pill";
  f.layoutMode = "HORIZONTAL";
  f.primaryAxisSizingMode = "AUTO"; f.counterAxisSizingMode = "AUTO";
  f.counterAxisAlignItems = "CENTER";
  f.paddingLeft = f.paddingRight = o.padH || 24;
  f.paddingTop = f.paddingBottom = o.padV || 8;
  f.itemSpacing = 18;
  f.cornerRadius = o.radius || 40;
  f.fills = [solid(o.bg || C.black)];
  parent.appendChild(f);
  const t = text(f, runs, { size: o.size || 30, color: o.color || C.white, f: o.f || "r", lh: 1.25, name: "label" });
  if (o.arrow) text(f, "↗", { size: o.size || 30, color: o.color || C.white, lh: 1.25, name: "arrow" });
  return f;
}
function place(node, x, y, anchor) {
  // anchor: 'tl' | 'tr' | 'tc' | 'bc'
  if (anchor === "tr") node.x = x - node.width;
  else if (anchor === "tc" || anchor === "bc") node.x = Math.round(x - node.width / 2);
  else node.x = x;
  node.y = anchor === "bc" ? y - node.height : y;
  return node;
}

/* ---------------- елементи слайда ---------------- */
let PAGE = null, N = 0;
const SLIDES = figma.editorType === "slides";
let ROW = null;
function slide(name, bg) {
  N++;
  const label = String(N).padStart(2, "0") + " — " + name;
  if (SLIDES) {
    // Figma Slides: справжній слайд 1920×1080 у новому ряду сітки (в кінці презентації)
    const f = figma.createSlide();
    if (ROW) { try { ROW.appendChild(f); } catch (e) { LOG.push("Ряд слайдів: " + e.message); } }
    else { try { ROW = f.parent && f.parent.type === "SLIDE_ROW" ? f.parent : null; } catch (e) {} }
    f.name = label;
    try { f.fills = [solid(bg || C.white)]; } catch (e) { LOG.push("Фон слайда: " + e.message); }
    return f;
  }
  const f = figma.createFrame();
  f.name = label;
  f.resize(W, H);
  f.fills = [solid(bg || C.white)];
  f.clipsContent = true;
  const col = (N - 1) % 4, row = Math.floor((N - 1) / 4);
  f.x = col * (W + 160); f.y = row * (H + 200);
  PAGE.appendChild(f);
  return f;
}
function logos(s, white) {
  const q = ratio("logo_k");
  image(s, white ? "logo_w" : "logo_k", M, 50, Math.round(48 * q), 48, { mode: "FIT", name: "logos AIN × UGB" });
}
/* праві пігулки шапки: tag (без посилання) + link (з посиланням) */
function header(s, tag, linkLabel, url, o) {
  o = o || {};
  const g = figma.createFrame();
  g.name = "header pills";
  g.layoutMode = "HORIZONTAL";
  g.primaryAxisSizingMode = "AUTO"; g.counterAxisSizingMode = "AUTO";
  g.itemSpacing = 20; g.fills = [];
  s.appendChild(g);
  const inv = o.invert;
  if (tag) pill(g, tag, { bg: inv ? C.white : C.black, color: inv ? C.black : C.white, name: "tag" });
  if (linkLabel) {
    const runs = url ? [{ t: linkLabel, u: url }] : [{ t: linkLabel }];
    const p = pill(g, runs, { bg: inv ? C.white : C.black, color: inv ? C.black : C.white, arrow: !!url, name: "link" });
    if (url) p.name = "link → " + url;
  }
  place(g, W - M, 48, "tr");
  return g;
}
const PARTNER = "Прояви партнера Укргазбанк";
/* заголовок: «Прояви партнера Укргазбанк» — червоним, решта — чорним */
function title(s, str, o) {
  o = o || {};
  const runs = [];
  if (str.indexOf(PARTNER) === 0) { runs.push({ t: PARTNER, c: o.white ? C.white : C.red, f: "b" }); runs.push({ t: str.slice(PARTNER.length) }); }
  else runs.push({ t: str });
  const t = text(s, runs, { size: o.size || 34, f: "s", lh: 1.22, w: o.w || W - 2 * M, x: M, y: o.y || 130, color: o.white ? C.white : C.black, name: "title" });
  return t;
}
/* видимий гіперлінк під картинкою */
function linkLine(s, url, x, y, o) {
  o = o || {};
  const runs = [{ t: o.prefix == null ? "Посилання: " : o.prefix, c: o.white ? C.white : C.black, f: "m" }];
  if (url) runs.push({ t: o.label || url, u: url, c: o.white ? C.white : C.link });
  else runs.push({ t: "[додайте посилання]", c: C.ph, f: "b" });
  const t = text(s, runs, { size: o.size || 22, w: o.w, lh: 1.3, name: url ? "link → " + url : "link (порожнє)", align: o.align });
  if (o.center) { t.textAlignHorizontal = "CENTER"; }
  place(t, x, y, o.anchor || "tl");
  return t;
}
function bottomPill(s, str) {
  const p = pill(s, str, { size: 40, padH: 28, padV: 8, name: "bottom pill" });
  place(p, W / 2, H - 44, "bc");
  return p;
}
function darkOverlay(s, a0, a1) {
  rect(s, 0, 0, W, H, [{
    type: "GRADIENT_LINEAR",
    gradientTransform: [[0, 1, 0], [-1, 0, 1]],
    gradientStops: [{ position: 0, color: { r: 0, g: 0, b: 0, a: a0 } }, { position: 1, color: { r: 0, g: 0, b: 0, a: a1 } }],
  }], "overlay");
}
function card(s, x, y, w, h, a) {
  const r = rect(s, x, y, w, h, [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: a == null ? 0.72 : a }], "card", 32);
  return r;
}
function placeholder(s, x, y, w, h, label) {
  const f = figma.createFrame();
  f.name = "⚠ ПІДСТАВИТИ ФОТО";
  f.resize(w, h); f.x = x; f.y = y;
  f.cornerRadius = 24;
  f.fills = [solid(C.ph, 0.08)];
  f.strokes = [solid(C.ph)]; f.strokeWeight = 3; f.dashPattern = [16, 12];
  s.appendChild(f);
  const t = text(f, label, { size: 28, f: "s", color: C.ph, w: w - 80, align: "CENTER", lh: 1.3 });
  t.x = 40; t.y = Math.round(h / 2 - t.height / 2);
  return f;
}

/* ---------------- стандартний «старий» слайд: шапка + назва + скрін + посилання + нижня пігулка ---------------- */
function classic(o) {
  const s = slide(o.name);
  logos(s);
  header(s, o.tag, o.linkLabel, o.url);
  const t = title(s, o.title);
  const top = Math.round(t.y + t.height + 28);
  const hasLink = o.under !== false;
  const bottom = H - 44 - 72 - 22 - (hasLink ? 44 : 0);
  if (o.draw) o.draw(s, top, bottom);
  else {
    const im = fitImage(s, o.img, M, top, W - 2 * M, bottom - top, { mode: "FIT", name: "скріншоти" });
    if (hasLink) linkLine(s, o.url, W / 2, im.y + im.height + 14, { anchor: "tc" });
  }
  if (o.pill) bottomPill(s, o.pill);
  return s;
}

/* ================= СЛАЙДИ ================= */
async function build() {
  /* 1. Обкладинка */
  {
    const s = slide("Обкладинка", C.red);
    logos(s, true);
    const p = pill(s, "Дослідження", { bg: C.white, color: C.red, name: "tag" });
    place(p, W - M, 48, "tr");
    image(s, "cover", 300, 128, 1320, Math.round(1320 / ratio("cover")), { radius: 40, name: "обкладинка дослідження" });
    text(s, "ЗВІТ: ПУБЛІКАЦІЇ ДОСЛІДЖЕННЯ ТА ІВЕНТУ\n(21.10.26–26.11.26)", { size: 60, color: C.white, x: 64, y: 896, lh: 1.12, name: "title" });
  }

  /* 2. Подія — загальне фото */
  {
    const s = slide("Подія AIN.UA", C.black);
    image(s, "bg2", 0, 0, W, H, { name: "фото події" });
    darkOverlay(s, 0.25, 0.85);
    logos(s, true);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos, { invert: true });
    const k = text(s, "Подія від AIN.UA", { size: 34, f: "m", color: C.white, x: M + 12, y: 0, name: "kicker" });
    const e = text(s, "«Енергетика 2030: зелені рішення, відновлення й інвестиції»", { size: 76, f: "b", color: C.white, x: M + 12, y: 0, w: 1600, lh: 1.08, name: "event" });
    const d = text(s, "проведена у Києві 21 жовтня 2026 року", { size: 36, f: "m", color: C.white, x: M + 12, y: 0, name: "date" });
    d.y = H - 90 - d.height; e.y = d.y - 24 - e.height; k.y = e.y - 16 - k.height;
  }

  /* 3. Подія — параметри */
  {
    const s = slide("Подія — формат, локація, ЦА", C.black);
    image(s, "bg3", 0, 0, W, H, { name: "фото події" });
    darkOverlay(s, 0.45, 0.7);
    logos(s, true);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos, { invert: true });
    const c = card(s, M, 140, 1180, 880);
    const x = M + 56, w = 1070;
    let y = 190;
    const row = (k, v) => { const t = text(s, [{ t: k + ": ", f: "b" }, { t: v }], { size: 30, color: C.white, x, y, w, lh: 1.3 }); y += t.height + 14; };
    const h = text(s, "Подія", { size: 48, f: "b", color: C.white, x, y }); y += h.height + 22;
    row("Формат", "офлайн");
    row("Локація", "Unit City");
    row("Кількість гостей", "120");
    row("Таймінг", "17:30–21:00");
    const ca = text(s, [{ t: "ЦА: ", f: "b" }, { t: "C-level керівники, інвестори та експерти галузі «Енергетика», а саме:" }], { size: 30, color: C.white, x, y, w, lh: 1.3 }); y += ca.height + 14;
    for (const b of [
      "Власники бізнесу, інвестори та CEO енергетичних, промислових і девелоперських компаній.",
      "Технічні директори, директори з розвитку та енергетики підприємств.",
      "CFO та інвестиційні аналітики.",
      "Профільні юристи, регулятори та експерти галузі.",
    ]) { const t = text(s, [{ t: "▪  ", c: C.red, f: "b" }, { t: b }], { size: 27, color: C.white, x: x + 10, y, w: w - 10, lh: 1.3 }); y += t.height + 10; }
    c.resize(c.width, y - 140 + 40);
  }

  /* 4. Програма */
  {
    const s = slide("Програма події", C.black);
    image(s, "bg4", 0, 0, W, H, { name: "фото події" });
    darkOverlay(s, 0.55, 0.7);
    logos(s, true);
    header(s, "Програма", "Запрошення та програма", URL.invite, { invert: true });
    const c = card(s, M, 130, W - 2 * M, 870, 0.8);
    const x = M + 50, w = W - 2 * M - 100;
    let y = 168;
    const h = text(s, "Програма", { size: 46, f: "b", color: C.white, x, y }); y += h.height + 16;
    const items = [
      ["17:30–18:00", [{ t: "реєстрація." }]],
      ["18:00–18:20", [{ t: "презентація дослідження " }, { t: "AIN.UA", u: URL.research, c: "#FF6B69" }, { t: " на основі 45 джерел: реальні масштаби руйнувань, темпи будівництва нових потужностей та реалії євроінтеграції." }]],
      ["18:20–18:40", [{ t: "кава-брейк & нетворкінг." }]],
      ["18:40–19:25", [{ t: "Панельна дискусія «Інвестиційний клімат: огляд надходжень та перспектива у повоєнний час»", f: "s" }, { t: ": де брати капітал, як рахувати окупність під час війни, які є страхові ризики та як під'єднатися до мереж без зайвого болю." }]],
      ["19:25–19:40", [{ t: "кава-брейк & нетворкінг." }]],
      ["19:40–20:25", [{ t: "Панельна дискусія «Захист, відбудова та децентралізація: як зберегти українську енергосистему в умовах постійних атак»", f: "s" }, { t: " — від системної стійкості мережі до того, де шукати обладнання 330–750 кВ в умовах світового дефіциту та як інтегрувати власну розподілену генерацію в єдину систему." }]],
      ["20:25–21:00", [{ t: "нетворкінг." }]],
    ];
    for (const [tm, runs] of items) {
      const tt = text(s, [{ t: "• ", c: C.red, f: "b" }, { t: tm, f: "b" }], { size: 25, color: C.white, x, y, lh: 1.35 });
      const d = text(s, runs, { size: 25, color: C.white, x: x + 200, y, w: w - 200, lh: 1.35 });
      y += Math.max(tt.height, d.height) + 12;
    }
    y += 10;
    const l = linkLine(s, URL.invite, x, y, { prefix: "Запрошення та програма: ", white: true, size: 24, w });
    y += l.height + 40;
    c.resize(c.width, y - 130);
  }

  /* 5. Учасники програми */
  {
    const s = slide("Учасники програми (спікери)");
    logos(s);
    header(s, "Учасники програми", "Фото з події", URL.photos);
    text(s, "Учасники програми", { size: 40, f: "b", x: M, y: 128 });
    text(s, [{ t: "Ведуча: ", f: "b" }, { t: "Анастасія Іванцова — економічна журналістка та редакторка" }], { size: 24, x: M, y: 186 });
    const colW = (W - 2 * M - 40) / 2;
    const panels = [
      {
        img: "ph_panel1",
        name: "Панельна дискусія «Інвестиційний клімат: огляд надходжень та перспектива у повоєнний час»",
        mod: "Валерій Безус — віцепрезидент Energy Club.",
        sp: [
          "Андріан Прокіп — доктор економічних наук, керівник енергетичних програм Українського інституту майбутнього, позаштатний дослідник Інституту Кеннана (Вашингтон, США).",
          "Роман Ємець — керуючий директор PowerU.",
          "Максим Дробязгін — заступник директора Департаменту фінансової стабільності НБУ.",
          "Андрій Грис — начальник Управління соціальних та екологічних ризиків АБ «УКРГАЗБАНК», голова ESG-комітету Національної асоціації банків України.",
        ],
      },
      {
        img: "ph_panel2",
        name: "Панельна дискусія «Захист, відбудова та децентралізація: як зберегти українську енергосистему в умовах постійних атак»",
        mod: "Артем Мартинюк — віцепрезидент Energy Club, в. о. гендиректора АТ «Українські розподільчі мережі» (2023–2025 рр.).",
        sp: [
          "Тетяна Духова — CEO Ecotech Invest.",
          "Михайло Бабійчук — генеральний менеджер у сфері безпеки та стійкості DiXi Group.",
          "Володимир Гаджулов — директор департаменту клієнтської підтримки KTS Engineering.",
        ],
      },
    ];
    panels.forEach((p, i) => {
      const x = M + i * (colW + 40);
      let y = 240;
      image(s, p.img, x, y, colW, 300, { radius: 24, name: "фото панелі " + (i + 1) });
      y += 300 + 20;
      const n = text(s, p.name, { size: 23, f: "b", x, y, w: colW, lh: 1.25 }); y += n.height + 12;
      const m = text(s, [{ t: "Модератор: ", f: "s", c: C.red }, { t: p.mod }], { size: 20, x, y, w: colW, lh: 1.3 }); y += m.height + 10;
      const sp = text(s, [{ t: "Спікери:", f: "s", c: C.red }], { size: 20, x, y }); y += sp.height + 4;
      for (const line of p.sp) {
        const dash = line.indexOf(" — ");
        const t = text(s, [{ t: "• ", c: C.red, f: "b" }, { t: line.slice(0, dash), f: "s" }, { t: line.slice(dash) }], { size: 20, x, y, w: colW, lh: 1.3 });
        y += t.height + 6;
      }
    });
  }

  const EV = "«Енергетика 2030: зелені рішення, відновлення й інвестиції»";
  /* 6. Стенд */
  {
    const s = slide("Стенд партнера");
    logos(s);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos);
    const t = title(s, PARTNER + " на події: " + EV + ": розміщення найменування та торговельних марок на стенді");
    const top = t.y + t.height + 32, gap = 24, w = Math.floor((W - 2 * M - 2 * gap) / 3), h = 700;
    ["ph_stand2", "ph_stand1", "ph_stand3"].forEach((k, i) => image(s, k, M + i * (w + gap), top, w, h, { radius: 24, name: "стенд " + (i + 1) }));
    linkLine(s, URL.photos, W / 2, top + h + 18, { anchor: "tc", prefix: "Усі фото з події: " });
  }

  /* 7. Бейджі, запрошення, програма */
  {
    const s = slide("Бейджі, запрошення, програма");
    logos(s);
    header(s, "Подія AIN.UA", "Запрошення", URL.invite);
    const t = title(s, PARTNER + " на події: " + EV + ": розміщення торговельних марок: на бейджах, запрошення та програмі");
    const top = t.y + t.height + 32, gap = 24, h = 700;
    const w1 = 1000, w2 = W - 2 * M - gap - w1;
    image(s, "ph_badges", M, top, w1, h, { radius: 24, name: "бейджі" });
    placeholder(s, M + w1 + gap, top, w2, h, "Сюди — нове фото бейджа крупним планом (перефотографувати в офісі). Виділіть рамку → Fill → Image.");
    linkLine(s, URL.invite, W / 2, top + h + 18, { anchor: "tc", prefix: "Запрошення та програма: " });
  }

  /* 8. Сцена та фотозона (екрани) */
  {
    const s = slide("Сцена та екрани");
    logos(s);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos);
    const t = title(s, PARTNER + " на події: " + EV + ": розміщення торговельних марок: на сцені та фотозоні (екрани)");
    const top = t.y + t.height + 28, gap = 20, w = (W - 2 * M - gap) / 2, h = 330;
    const cells = [["ph_stage2", "Сцена"], ["ph_stage", "Сцена"], ["ph_tv1", "Екрани"], ["ph_tv2", "Екрани"]];
    cells.forEach(([k, lbl], i) => {
      const x = M + (i % 2) * (w + gap), y = top + Math.floor(i / 2) * (h + gap);
      image(s, k, x, y, w, h, { radius: 24, name: lbl });
      const p = pill(s, lbl, { size: 22, padH: 16, padV: 4, name: "підпис" });
      place(p, x + 20, y + h - 20, "tl"); p.y = y + h - 20 - p.height;
    });
    linkLine(s, URL.photos, W / 2, top + 2 * h + gap + 16, { anchor: "tc", prefix: "Усі фото з події: " });
  }

  /* 9. Запрошення (перенесено з кінця) */
  classic({
    name: "Запрошення на подію", tag: "Дослідження", linkLabel: "Запрошення", url: URL.invite,
    title: PARTNER + " на події: " + EV + ": запрошення на подію", img: "c15", pill: "Запрошення на подію",
  });

  /* 10. Інформаційні матеріали — загальні цифри AIN */
  {
    const s = slide("Інформаційні матеріали — цифри AIN", C.black);
    image(s, "cover", 0, 0, W, H, { name: "фон: обкладинка дослідження" });
    darkOverlay(s, 0.55, 0.85);
    logos(s, true);
    header(s, "Дослідження", "Сайт AIN", URL.research, { invert: true });
    title(s, PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: дослідження, сайт AIN, соцмережі AIN (Fb, TG, X, Instagram)", { white: true, size: 40, y: 150, w: 1500 });
    const stats = [
      ["800 000", "Сайт AIN", "унікальних читачів щомісяця"],
      ["1,2 млн", "Facebook", "охоплень щомісяця"],
      ["500 000", "Instagram", "охоплень щомісяця"],
      ["45 000", "X", "охоплень"],
      ["8 500", "Telegram", "охоплень"],
    ];
    const gap = 20, w = (W - 2 * M - 4 * gap) / 5, y = 640, h = 300;
    stats.forEach(([n, k, d], i) => {
      const x = M + i * (w + gap);
      const c = rect(s, x, y, w, h, [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.6 }], "stat " + k, 28);
      c.strokes = [solid(C.white, 0.25)]; c.strokeWeight = 1;
      text(s, k, { size: 26, f: "s", color: C.red, x: x + 32, y: y + 32 });
      text(s, n, { size: 64, f: "b", color: C.white, x: x + 32, y: y + 82 });
      text(s, d, { size: 24, color: C.white, x: x + 32, y: y + 180, w: w - 64 });
    });
  }

  /* 11–23. Інформаційні матеріали */
  const IM = PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: дослідження ";
  classic({ name: "Сайт AIN", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, title: IM + "на сайті AIN", img: "c2", pill: "Результат прочитань: 9.427" });
  classic({ name: "Facebook 1", tag: "Дослідження", linkLabel: "Facebook", url: URL.fb1, title: IM + "у Facebook AIN", img: "c3", pill: "Результат охоплень (органіка+реклама): 600,733" });
  classic({ name: "Facebook 2", tag: "Дослідження", linkLabel: "Facebook", url: URL.fb2, title: IM + "у Facebook AIN", img: "c4", pill: "Результат охоплень: 1,047" });
  classic({ name: "Facebook 3", tag: "Дослідження", linkLabel: "Facebook", url: URL.fb3, title: IM + "у Facebook AIN", img: "c5", pill: "Результат охоплень: 1,076" });
  classic({ name: "Facebook — рекламні креативи", tag: "Рекламні креативи", linkLabel: "Facebook", url: null, title: IM + "у Facebook AIN", img: "c6", pill: "Результат охоплень реклама: 973,690" });
  classic({ name: "Telegram", tag: "Дослідження", linkLabel: "Telegram", url: URL.tg, title: IM + "у Telegram AIN", img: "c7", pill: "Результат переглядів: 910" });
  classic({ name: "Instagram post 1", tag: "Дослідження", linkLabel: "Instagram post", url: URL.ig1, title: IM + "в Instagram post", img: "c8", pill: "Результат переглядів: 1,031" });
  classic({ name: "Instagram post 2", tag: "Дослідження", linkLabel: "Instagram post", url: URL.ig2, title: IM + "в Instagram post", img: "c9", pill: "Результат переглядів: 912" });
  classic({ name: "Instagram post 3", tag: "Дослідження", linkLabel: "Instagram post", url: URL.ig3, title: IM + "в Instagram post", img: "c10", pill: "Результат переглядів: 1,565" });
  classic({
    name: "Instagram Stories", tag: "Дослідження", linkLabel: "Insta Stories", url: URL.stories, title: IM + "в Instagram Stories", pill: "Результат переглядів: 343",
    draw(s, top, bottom) {
      const h = bottom - top, gap = 20;
      const sw = Math.round(h * ratio("story1"));
      for (let i = 0; i < 3; i++) image(s, "story" + (i + 1), M + i * (sw + gap), top, sw, h, { radius: 24, name: "сторіз " + (i + 1) });
      const x0 = M + 3 * (sw + gap) + 20;
      const im = fitImage(s, "c11", x0, top, W - M - x0, h, { mode: "FIT", name: "статистика сторіз" });
      linkLine(s, URL.stories, W / 2, bottom + 14, { anchor: "tc" });
    },
  });
  classic({
    name: "Статті з інсайтами", tag: "Статті з інсайтами Дослідження", linkLabel: "Сайт AIN", url: null,
    title: PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: інсайти з дослідження на сайті AIN", pill: "Статті з інсайтами Дослідження | Результат охоплень: 2.570",
    draw(s, top, bottom) {
      const gap = 30, w = (W - 2 * M - 2 * gap) / 3, ih = 330;
      [["c12_1", URL.art1], ["c12_2", URL.art2], ["c12_3", URL.art3]].forEach(([k, u], i) => {
        const x = M + i * (w + gap);
        fitImage(s, k, x, top, w, ih, { mode: "FIT", name: "стаття " + (i + 1) });
        linkLine(s, u, x, top + ih + 10, { w, size: 17, prefix: "" });
      });
      const gy = top + ih + 90;
      fitImage(s, "c12_ga", M, gy, W - 2 * M, bottom - gy + 40, { mode: "FIT", name: "Google Analytics" });
    },
  });
  /* ЗМІ */
  {
    const s = classic({
      name: "ЗМІ про подію та дослідження", tag: "Дослідження", linkLabel: "Media", url: URL.media,
      title: "ЗМІ про нашу подію та дослідження", pill: "Скріншоти публікацій, поширення від ЗМІ", under: false,
      draw(s, top, bottom) {
        const items = [
          [{ t: "European Business Association: ", f: "m" }, { t: "Site", u: URL.eba, c: C.link }],
          [{ t: "KSE BS: ", f: "m" }, { t: "Site", u: URL.kse, c: C.link }, { t: ", " }, { t: "Insta Stories", u: URL.kseStories, c: C.link }],
          [{ t: "GreenEnergyEfficiency: ", f: "m" }, { t: "Facebook", u: URL.gee, c: C.link }],
        ];
        let y = top + 120;
        for (const runs of items) {
          rect(s, M + 20, y + 8, 30, 40, [solid("#FFD400")], "маркер", 15);
          const t = text(s, runs, { size: 38, x: M + 80, y, w: 560, lh: 1.2 });
          y += t.height + 50;
        }
        const h = bottom - top + 40;
        fitImage(s, "c13_li", 700, top, 520, h, { mode: "FIT", name: "LinkedIn" });
        fitImage(s, "c13_r", 1250, top, W - M - 1250, h, { mode: "FIT", name: "EBA / KSE" });
      },
    });
  }
  classic({
    name: "Розсилка AIN", tag: "Анонс події", linkLabel: "Розсилка", url: URL.mail,
    title: PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: розсилка AIN", pill: "Закритий захід | Охоплення: 2.129",
    draw(s, top, bottom) {
      const h = bottom - top, gap = 16;
      const w1 = Math.round(h * ratio("mail1")), w2 = Math.round(h * ratio("mail2"));
      const a = image(s, "mail1", M, top, w1, h, { mode: "FIT", name: "розсилка 1" });
      a.strokes = [solid("#DDDDDD")]; a.strokeWeight = 1;
      const b = image(s, "mail2", M + w1 + gap, top, w2, h, { mode: "FIT", name: "розсилка 2" });
      b.strokes = [solid("#DDDDDD")]; b.strokeWeight = 1;
      const x0 = M + w1 + w2 + gap + 40;
      fitImage(s, "c14", x0, top, W - M - x0, h, { mode: "FIT", name: "статистика розсилки" });
      linkLine(s, URL.mail, M, bottom + 14, { prefix: "Розсилка: ", size: 20 });
    },
  });

  /* 24–25. Дослідження */
  classic({ name: "Логотипи в дослідженні 1", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, title: PARTNER + ": розміщення торговельних марок у дослідженні", img: "c24", pill: "Логотипи в дослідженні" });
  classic({ name: "Логотипи в дослідженні 2", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, title: PARTNER + ": розміщення торговельних марок у дослідженні", img: "c25", pill: "Логотипи в дослідженні", under: false });

  /* 26–38. Без змін (оригінальні слайди 26–38 як зображення) */
  for (let n = 26; n <= 38; n++) {
    const s = slide(n === 38 ? "Підсумок (без змін)" : "Експертиза в дослідженні (без змін)");
    image(s, "full" + n, 0, 0, W, H, { name: "оригінальний слайд " + n });
    if (n !== 38) {
      // на картинці посилання не клікається — перекриваємо стару шапку живими пігулками
      rect(s, 1240, 30, W - 1240, 100, [solid(C.white)], "підкладка шапки");
      header(s, "Дослідження", "Сайт AIN", URL.research);
    }
  }
}

/* ---------------- запуск ---------------- */
(async () => {
  try {
    await loadFonts();
    const d = new Date();
    let where;
    if (SLIDES) {
      // окремий новий ряд у сітці, щоб нові слайди не змішались зі старими
      try { ROW = figma.createSlideRow(); } catch (e) { ROW = null; LOG.push("Новий ряд: " + e.message); }
      await build();
      try { figma.viewport.slidesView = "grid"; } catch (e) {}
      where = "в кінці презентації (окремий ряд у сітці слайдів)";
    } else {
      PAGE = figma.createPage();
      PAGE.name = "Звіт UGB — оновлено " + d.toLocaleDateString("uk-UA");
      await figma.setCurrentPageAsync(PAGE);
      await build();
      figma.viewport.scrollAndZoomIntoView(PAGE.children);
      where = "на сторінці «" + PAGE.name + "»";
    }
    const msg = ["Готово: " + N + " слайдів " + where + "."];
    if (fontNote) msg.push(fontNote);
    if (LOG.length) { msg.push(LOG.length + " попереджень — див. консоль."); console.warn(LOG.join("\n")); }
    figma.closePlugin(msg.join(" "));
  } catch (e) {
    console.error(e);
    figma.closePlugin("Помилка: " + (e && e.message ? e.message : e));
  }
})();
