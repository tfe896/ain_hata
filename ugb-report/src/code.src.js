/* AIN × UGB — звіт «Українська енергетика»: оновлена презентація (39 слайдів).
   Запуск: Figma Desktop → Plugins → Development → Import plugin from manifest… → ugb-report/manifest.json → Run.
   Працює у Figma Slides (додає 39 слайдів окремим рядом у кінці) і у Figma Design (створює нову сторінку).
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
  fbPage: "https://www.facebook.com/ainukraine",
  site: "https://ain.ua/",
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
  if (!parent.layoutMode || parent.layoutMode === "NONE") { t.x = o.x || 0; t.y = o.y || 0; }
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
  if (o.arrow) arrow(f, Math.round((o.size || 30) * 0.62), o.color || C.white);
  return f;
}
/* стрілка ↗ вектором (у Noto Sans цього символу немає, Figma підставляла емодзі) */
function arrow(parent, size, color) {
  try {
    const v = figma.createVector();
    v.name = "arrow";
    v.vectorPaths = [{ windingRule: "NONE", data: "M 0 " + size + " L " + size + " 0 M " + Math.round(size * 0.3) + " 0 L " + size + " 0 L " + size + " " + Math.round(size * 0.7) }];
    v.strokes = [solid(color)];
    v.strokeWeight = Math.max(2, size / 9);
    v.strokeCap = "ROUND"; v.strokeJoin = "ROUND";
    v.fills = [];
    parent.appendChild(v);
    return v;
  } catch (e) { LOG.push("Стрілка: " + e.message); return null; }
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
const PART = __PART__; // null = уся презентація; "two" = лише слайди 7 (бейджі) і 9 (сцена)
const MINE = [];
function slide(name, bg) {
  N++;
  const label = String(N).padStart(2, "0") + " — " + name;
  let f;
  if (SLIDES) {
    // Figma Slides: справжній слайд 1920×1080; порядок і окремий ряд задаються в кінці через setSlideGrid
    f = figma.createSlide();
    f.name = label;
    try { f.fills = [solid(bg || C.white)]; } catch (e) { LOG.push("Фон слайда: " + e.message); }
  } else {
    f = figma.createFrame();
    f.name = label;
    f.resize(W, H);
    f.fills = [solid(bg || C.white)];
    f.clipsContent = true;
    const col = (N - 1) % 4, row = Math.floor((N - 1) / 4);
    f.x = col * (W + 160); f.y = row * (H + 200);
    PAGE.appendChild(f);
  }
  MINE.push(f);
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
/* назва слайда: «Прояви партнера Укргазбанк» — червоним, решта — чорним */
function title(s, str, o) {
  o = o || {};
  const runs = [];
  if (str.indexOf(PARTNER) === 0) { runs.push({ t: PARTNER, c: o.white ? C.white : C.red, f: "b" }); runs.push({ t: str.slice(PARTNER.length) }); }
  else runs.push({ t: str });
  return text(s, runs, { size: o.size || 34, f: "s", lh: 1.22, w: o.w || W - 2 * M, x: M, y: o.y || 130, color: o.white ? C.white : C.black, name: "title" });
}
/* видимий гіперлінк окремим рядком */
function linkLine(s, url, x, y, o) {
  o = o || {};
  const runs = [{ t: o.prefix == null ? "Посилання: " : o.prefix, c: o.white ? C.white : C.black, f: "m" }];
  if (url) runs.push({ t: o.label || url, u: url, c: o.white ? C.white : C.link });
  else runs.push({ t: "[додайте посилання]", c: C.ph, f: "b" });
  const t = text(s, runs, { size: o.size || 22, w: o.w, lh: 1.3, name: url ? "link → " + url : "link (порожнє)", align: o.align });
  place(t, x, y, o.anchor || "tl");
  return t;
}
const PILL_TOP = H - 40 - 70; // верх нижньої пігулки
function bottomPill(s, str) {
  const p = pill(s, str, { size: 40, padH: 28, padV: 8, name: "bottom pill" });
  place(p, W / 2, H - 40, "bc");
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
  return rect(s, x, y, w, h, [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: a == null ? 0.72 : a }], "card", 32);
}
/* фото з підписом-пігулкою в лівому нижньому куті */
function photo(s, key, x, y, w, h, label) {
  const r = image(s, key, Math.round(x), Math.round(y), Math.round(w), Math.round(h), { radius: 24, name: label || key });
  if (label) {
    const p = pill(s, label, { size: 22, padH: 16, padV: 4, name: "підпис" });
    p.x = Math.round(x) + 18; p.y = Math.round(y + h) - 18 - p.height;
  }
  return r;
}
/* сітка фото без обрізки: всі картинки однакової пропорції q, rows×cols, вписана й центрована в коробку */
function photoGrid(s, keys, labels, cols, bx, by, bw, bh, gap) {
  const rows = Math.ceil(keys.length / cols), q = ratio(keys[0]);
  let w = (bw - gap * (cols - 1)) / cols, h = w / q;
  if (h * rows + gap * (rows - 1) > bh) { h = (bh - gap * (rows - 1)) / rows; w = h * q; }
  const gw = w * cols + gap * (cols - 1), gh = h * rows + gap * (rows - 1);
  const x0 = bx + (bw - gw) / 2, y0 = by + (bh - gh) / 2;
  keys.forEach((k, i) => photo(s, k, x0 + (i % cols) * (w + gap), y0 + Math.floor(i / cols) * (h + gap), w, h, labels && labels[i]));
  return { x: x0, y: y0, w: gw, h: gh };
}

/* скріни зі старого слайда n: оригінальні (повні) картинки з PDF у тих самих відносних позиціях,
   масштабовані у зону [bx..bx+bw] × [by..by+bh] */
function collage(s, n, bx, by, bw, bh, frame) {
  const L = (A.layout || {})[n] || [];
  if (!L.length) { LOG.push("Немає скрінів слайда " + n); return by; }
  const ux0 = Math.min(...L.map((b) => b[0])), uy0 = Math.min(...L.map((b) => b[1]));
  const ux1 = Math.max(...L.map((b) => b[2])), uy1 = Math.max(...L.map((b) => b[3]));
  const k = Math.min(bw / (ux1 - ux0), bh / (uy1 - uy0), 1.2);
  const ox = bx + (bw - (ux1 - ux0) * k) / 2, oy = by + (bh - (uy1 - uy0) * k) / 2;
  let end = by;
  for (const [x0, y0, x1, y1, key] of L) {
    const r = image(s, key, Math.round(ox + (x0 - ux0) * k), Math.round(oy + (y0 - uy0) * k), Math.round((x1 - x0) * k), Math.round((y1 - y0) * k), { mode: "FIT", radius: frame ? 24 : 12, name: "скрін" });
    if (frame) { r.strokes = [solid(C.black)]; r.strokeWeight = 2; }
    end = Math.max(end, r.y + r.height);
  }
  return end;
}
/* сітка скрінів різної пропорції: кожен вписаний у свою клітинку */
function shotGrid(s, keys, cols, bx, by, bw, bh, gap) {
  const rows = Math.ceil(keys.length / cols), cw = (bw - gap * (cols - 1)) / cols, ch = (bh - gap * (rows - 1)) / rows;
  let end = by;
  keys.forEach((k, i) => {
    const r = fitImage(s, k, bx + (i % cols) * (cw + gap), by + Math.floor(i / cols) * (ch + gap), cw, ch, { mode: "FIT", radius: 12, name: "скрін" });
    end = Math.max(end, r.y + r.height);
  });
  return end;
}

/* ---------------- стандартний слайд: шапка + назва + картинки + посилання + нижня пігулка ---------------- */
/* o.draw(s, top, bottom) малює вміст у зоні [top, bottom] і повертає нижню межу намальованого;
   під нею ставиться посилання o.under (за замовчуванням — o.url) */
function classic(o) {
  const s = slide(o.name);
  logos(s);
  header(s, o.tag, o.linkLabel, o.url);
  const t = title(s, o.title);
  const top = Math.round(t.y + t.height + 26);
  const links = o.links || (o.under === false ? [] : [[o.linkPrefix || "Посилання: ", o.under || o.url]]);
  const linkH = links.length * 32;
  const bottom = (o.pill ? PILL_TOP - 18 : H - 40) - (links.length ? linkH + 12 : 0);
  let end;
  if (o.draw) end = o.draw(s, top, bottom);
  else if (o.page) end = collage(s, o.page, M, top, W - 2 * M, bottom - top, o.frame);
  else { const im = fitImage(s, o.img, M, top, W - 2 * M, bottom - top, { mode: "FIT", name: "скріншоти" }); end = im.y + im.height; }
  let y = Math.round(end + 12);
  for (const [prefix, url] of links) { const l = linkLine(s, url, W / 2, y, { anchor: "tc", prefix }); y += l.height + 4; }
  if (o.pill) bottomPill(s, o.pill);
  return s;
}

/* 7. Бейджі: фото бейджів учасників (старий слайд 18) + бейдж крупно з обох боків (обрізано по картці, без столу) */
function slideBadges() {
  classic({
    name: "Бейджі", tag: "Подія AIN.UA", linkLabel: "Фото з події", url: URL.photos, linkPrefix: "Фото з події: ",
    title: PARTNER + " на події: " + EV + ": розміщення торговельних марок: на бейджах",
    pill: "Закритий захід | бейджі учасників",
    draw(s, top, bottom) {
      const keys = ["s7_badges", "s7_card_front", "s7_card_qr"], gap = 24;
      const sum = keys.reduce((a, k) => a + ratio(k), 0);
      const h = Math.min(bottom - top, (W - 2 * M - gap * (keys.length - 1)) / sum);
      let x = (W - (h * sum + gap * (keys.length - 1))) / 2;
      const y = top + (bottom - top - h) / 2;
      for (const k of keys) { const w = h * ratio(k); photo(s, k, x, y, w, h); x += w + gap; }
      return y + h;
    },
  });
}

/* 9. Сцена (екрани): фото сцени + екран, на якому чітко видно спонсорів */
function slideStage() {
  classic({
    name: "Сцена (екрани)", tag: "Подія AIN.UA", linkLabel: "Фото з події", url: URL.photos, linkPrefix: "Фото з події: ",
    title: PARTNER + " на події: " + EV + ": розміщення торговельних марок: на сцені (екрани)",
    pill: "Закритий захід | сцена та екрани",
    draw(s, top, bottom) {
      const g = photoGrid(s, ["s9_stage", "s9_screen"], ["Сцена", "Екран біля сцени"], 2, M, top, W - 2 * M, bottom - top, 24);
      return g.y + g.h;
    },
  });
}

/* ================= СЛАЙДИ ================= */
const EV = "«Українська енергетика: “зелені” рішення, відновлення й інвестиції»";
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
    darkOverlay(s, 0.2, 0.88);
    logos(s, true);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos, { invert: true });
    const l = linkLine(s, URL.photos, M + 12, 0, { prefix: "Фото з події: ", white: true, size: 22 });
    l.y = H - 48 - l.height;
    const d = text(s, "проведена у Києві 21 жовтня 2026 року", { size: 36, f: "m", color: C.white, x: M + 12, y: 0, name: "date" });
    d.y = l.y - 40 - d.height;
    const e = text(s, EV, { size: 76, f: "b", color: C.white, x: M + 12, y: 0, w: 1600, lh: 1.08, name: "event" });
    e.y = d.y - 20 - e.height;
    const k = text(s, "Подія від AIN.UA", { size: 34, f: "m", color: C.white, x: M + 12, y: 0, name: "kicker" });
    k.y = e.y - 16 - k.height;
  }

  /* 3. Подія — параметри */
  {
    const s = slide("Подія — формат, локація, ЦА", C.black);
    image(s, "bg3", 0, 0, W, H, { name: "фото події" });
    darkOverlay(s, 0.45, 0.75);
    logos(s, true);
    header(s, "Подія AIN.UA", "Фото з події", URL.photos, { invert: true });
    const c = card(s, M, 140, 1180, 800);
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
    ]) { const t = text(s, [{ t: "•  ", c: C.red, f: "b" }, { t: b }], { size: 27, color: C.white, x: x + 10, y, w: w - 10, lh: 1.3 }); y += t.height + 10; }
    c.resize(c.width, y - 140 + 36);
    const l = linkLine(s, URL.photos, M + 12, 0, { prefix: "Фото з події: ", white: true });
    l.y = H - 48 - l.height;
  }

  /* 4. Програма (посилання вгорі й унизу) */
  {
    const s = slide("Програма події", C.black);
    image(s, "bg4", 0, 0, W, H, { name: "фото події" });
    darkOverlay(s, 0.55, 0.75);
    logos(s, true);
    header(s, "Програма", "Запрошення та програма", URL.invite, { invert: true });
    const c = card(s, M, 130, W - 2 * M, 870, 0.8);
    const x = M + 50, w = W - 2 * M - 100;
    let y = 168;
    const h = text(s, "Програма", { size: 46, f: "b", color: C.white, x, y }); y += h.height + 16;
    const items = [
      ["17:30–18:00", [{ t: "реєстрація." }]],
      ["18:00–18:20", [{ t: "презентація дослідження " }, { t: "AIN.UA", u: URL.research, c: "#FF6B69" }, { t: " на основі 45 джерел: реальні масштаби руйнувань, темпи будівництва нових потужностей та реалії євроінтеграції." }]],
      ["18:20–18:40", [{ t: "кава-брейк & Нетворкінг." }]],
      ["18:40–19:25", [{ t: "Панельна дискусія «Інвестиційний клімат: огляд надходжень та перспектива у повоєнний час»", f: "s" }, { t: ": де брати капітал, як рахувати окупність під час війни, які є страхові ризики та як під'єднатися до мереж без зайвого болю." }]],
      ["19:25–19:40", [{ t: "кава-брейк & Нетворкінг." }]],
      ["19:40–20:25", [{ t: "Панельна дискусія «Захист, відбудова та децентралізація: як зберегти українську енергосистему під умовами постійних атак»", f: "s" }, { t: " — до системної стійкості мережі, де шукати обладнання 330–750 кВ в умовах світового дефіциту та як інтегрувати власну розподілену генерацію в єдину систему." }]],
      ["20:25–21:00", [{ t: "Нетворкінг." }]],
    ];
    for (const [tm, runs] of items) {
      const tt = text(s, [{ t: "• ", c: C.red, f: "b" }, { t: tm, f: "b" }], { size: 25, color: C.white, x, y, lh: 1.35 });
      const d = text(s, runs, { size: 25, color: C.white, x: x + 200, y, w: w - 200, lh: 1.35 });
      y += Math.max(tt.height, d.height) + 12;
    }
    y += 14;
    const l = linkLine(s, URL.invite, x, y, { prefix: "Запрошення та програма: ", white: true, size: 24, w });
    y += l.height + 40;
    c.resize(c.width, y - 130);
  }

  /* 5. Учасники програми: дві панелі, текст ліворуч, фото праворуч */
  {
    const s = slide("Учасники програми (спікери)");
    logos(s);
    header(s, "Учасники програми", "Фото з події", URL.photos);
    text(s, "Учасники програми", { size: 40, f: "b", x: M, y: 126 });
    text(s, [{ t: "Ведуча: ", f: "s", c: C.red }, { t: "Анастасія Іванцова", f: "s" }, { t: " — економічна журналістка та редакторка" }], { size: 22, x: M, y: 186, w: 1200 });
    const panels = [
      {
        img: "s5_panel1",
        name: "Панельна дискусія «Інвестиційний клімат: огляд надходжень та перспектива у повоєнний час»",
        mod: ["Валерій Безус", " — віцепрезидент Energy Club."],
        sp: [
          ["Андріан Прокіп", " — Доктор економічних наук, керівник енергетичних програм Українського інституту майбутнього, Позаштатний дослідник Інституту Кеннана (Вашингтон, США)."],
          ["Роман Ємець", " — керуючий директор PowerU."],
          ["Максим Дробязгін", " — заступник директора Департаменту фінансової стабільності в НБУ."],
          ["Андрій Грис", " — начальник Управління соціальних та екологічних ризиків АБ «УКРГАЗБАНК» та Голова ESG-комітету Національної асоціації банків України."],
        ],
      },
      {
        img: "s5_panel2",
        name: "Панельна дискусія «Захист, відбудова та децентралізація: як зберегти українську енергосистему в умовах постійних атак»",
        mod: ["Артем Мартинюк", " — віцепрезидент Energy Club, в. о. гендиректора АТ «Українські розподільчі мережі» (2023–2025 рр.)."],
        sp: [
          ["Тетяна Духова", " — CEO Ecotech Invest."],
          ["Михайло Бабійчук", " — генеральний менеджер у сфері безпеки та стійкості DiXi Group."],
          ["Володимир Гаджулов", " — директор департаменту клієнтської підтримки KTS Engineering."],
        ],
      },
    ];
    const pw = 720, ph = Math.round(pw / ratio("s5_panel1")), tw = W - 2 * M - pw - 40;
    let y = 238;
    panels.forEach((p, i) => {
      const y0 = y;
      const n = text(s, p.name, { size: 23, f: "b", x: M, y, w: tw, lh: 1.25 }); y += n.height + 10;
      const m = text(s, [{ t: "Модератор: ", f: "s", c: C.red }, { t: p.mod[0], f: "s" }, { t: p.mod[1] }], { size: 20, x: M, y, w: tw, lh: 1.3 }); y += m.height + 8;
      const sp = text(s, [{ t: "Спікери:", f: "s", c: C.red }], { size: 20, x: M, y }); y += sp.height + 2;
      for (const [nm, role] of p.sp) {
        const t = text(s, [{ t: "• ", c: C.red, f: "b" }, { t: nm, f: "s" }, { t: role }], { size: 20, x: M, y, w: tw, lh: 1.3 });
        y += t.height + 4;
      }
      photo(s, p.img, W - M - pw, y0, pw, ph);
      y = Math.max(y, y0 + ph) + 34;
    });
    const l = linkLine(s, URL.photos, M, 0, { prefix: "Фото з події: " });
    l.y = H - 40 - l.height;
  }

  /* 6. Стенд — фото цілі, без обрізки */
  classic({
    name: "Стенд партнера", tag: "Подія AIN.UA", linkLabel: "Фото з події", url: URL.photos, linkPrefix: "Фото з події: ",
    title: PARTNER + " на події: " + EV + ": розміщення найменування та торговельних марок на стенді",
    pill: "Закритий захід | стенд",
    draw(s, top, bottom) {
      const gap = 20, H0 = bottom - top, q = ratio("s6_stand_big");
      const hs = (H0 - gap) / 2, wb = H0 * q, ws = hs * q, total = wb + gap + ws, x0 = (W - total) / 2;
      photo(s, "s6_stand_big", x0, top, wb, H0);
      photo(s, "s6_stand_a", x0 + wb + gap, top, ws, hs);
      photo(s, "s6_stand_b", x0 + wb + gap, top + hs + gap, ws, hs);
      return top + H0;
    },
  });

  /* 7. Бейджі */
  slideBadges();

  /* 8. Запрошення на подію (старий слайд 15, обидва скріни) */
  classic({
    name: "Запрошення на подію", tag: "Дослідження", linkLabel: "Запрошення", url: URL.invite,
    title: PARTNER + " на події: " + EV + ": запрошення на подію",
    page: 15, frame: true, pill: "Запрошення на подію",
  });

  /* 9. Сцена (екрани) */
  slideStage();

  /* 10. Фото з події: сюди перенесено старий слайд 16 «Закритий захід | виступ» (4 фото) */
  classic({
    name: "Фото з події", tag: "Подія AIN.UA", linkLabel: "Фото з події", url: URL.photos, linkPrefix: "Фото з події: ",
    title: "Фото з події " + EV,
    pill: "Закритий захід | виступ",
    draw(s, top, bottom) {
      const g = photoGrid(s, ["s9_1", "s9_2", "s9_3", "s9_4"], null, 2, M, top, W - 2 * M, bottom - top, 16);
      return g.y + g.h;
    },
  });

  /* 11. Інформаційні матеріали — загальні цифри AIN */
  {
    const s = slide("Інформаційні матеріали — цифри AIN", C.black);
    image(s, "cover", 0, 0, W, H, { name: "фон: обкладинка дослідження" });
    darkOverlay(s, 0.74, 0.9);
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
    const gap = 20, w = (W - 2 * M - 4 * gap) / 5, y = 600, h = 280;
    stats.forEach(([n, k, d], i) => {
      const x = M + i * (w + gap);
      const c = rect(s, x, y, w, h, [{ type: "SOLID", color: { r: 0, g: 0, b: 0 }, opacity: 0.6 }], "stat " + k, 28);
      c.strokes = [solid(C.white, 0.25)]; c.strokeWeight = 1;
      text(s, k, { size: 26, f: "s", color: C.red, x: x + 32, y: y + 32 });
      text(s, n, { size: 64, f: "b", color: C.white, x: x + 32, y: y + 80 });
      text(s, d, { size: 24, color: C.white, x: x + 32, y: y + 178, w: w - 64 });
    });
    let ly = y + h + 40;
    const l1 = linkLine(s, URL.research, M, ly, { prefix: "Дослідження: ", white: true }); ly += l1.height + 6;
    linkLine(s, URL.site, M, ly, { prefix: "Сайт AIN: ", white: true });
  }

  /* 12–24. Інформаційні матеріали: нові назви + посилання окремим рядком під картинками */
  const IM = PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: дослідження ";
  const IE = PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: івент "; // пости про подію
  classic({ name: "Сайт AIN", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, title: IM + "на сайті AIN", page: 2, pill: "Результат прочитань: 9.427" });
  classic({ name: "Facebook 1", tag: "Дослідження", linkLabel: "Facebook", url: URL.fb1, title: IM + "в Facebook AIN", page: 3, pill: "Результат охоплень (органіка+реклама): 600,733" });
  classic({ name: "Facebook 2 (анонс івенту)", tag: "Івент", linkLabel: "Facebook", url: URL.fb2, title: IE + "в Facebook AIN", page: 4, pill: "Результат охоплень: 1,047" });
  classic({ name: "Facebook 3 (анонс івенту)", tag: "Івент", linkLabel: "Facebook", url: URL.fb3, title: IE + "в Facebook AIN", page: 5, pill: "Результат охоплень: 1,076" });
  classic({ name: "Facebook — рекламні креативи", tag: "Рекламні креативи", linkLabel: "Facebook", url: URL.fbPage, linkPrefix: "Facebook AIN: ", title: IM + "в Facebook AIN", page: 6, pill: "Результат охоплень реклама: 973,690" });
  classic({ name: "Telegram", tag: "Дослідження", linkLabel: "Telegram", url: URL.tg, title: IM + "в Telegram AIN", page: 7, pill: "Результат переглядів: 910" });
  classic({ name: "Instagram post 1 (з івенту)", tag: "Івент", linkLabel: "Instagram post", url: URL.ig1, title: IE + "в Instagram post", page: 8, pill: "Результат переглядів: 1,031" });
  classic({ name: "Instagram post 2", tag: "Дослідження", linkLabel: "Instagram post", url: URL.ig2, title: IM + "в Instagram post", page: 9, pill: "Результат переглядів: 912" });
  classic({ name: "Instagram post 3 (анонс івенту)", tag: "Івент", linkLabel: "Instagram post", url: URL.ig3, title: IE + "в Instagram post", page: 10, pill: "Результат переглядів: 1,565" });
  classic({
    name: "Instagram Stories (з івенту)", tag: "Івент", linkLabel: "Insta Stories", url: URL.stories, title: PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: івент і дослідження в Instagram Stories", pill: "Результат переглядів: 343",
    draw(s, top, bottom) {
      const h = bottom - top, gap = 20;
      const sw = Math.round(h * ratio("story1"));
      for (let i = 0; i < 3; i++) image(s, "story" + (i + 1), M + i * (sw + gap), top, sw, h, { radius: 24, name: "сторіз " + (i + 1) });
      const x0 = M + 3 * (sw + gap) + 20;
      fitImage(s, "c11", x0, top, W - M - x0, h, { mode: "FIT", name: "статистика сторіз" });
      return bottom;
    },
  });
  classic({
    name: "Інсайти з дослідження", tag: "Статті з інсайтами Дослідження", linkLabel: "Сайт AIN", url: URL.research, under: false,
    title: PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: інсайти з дослідження на сайті AIN", pill: "Інсайти з дослідження",
    draw(s, top, bottom) {
      // три статті якомога більшими (без статистики), посилання під кожною
      const gap = 24, w = (W - 2 * M - 2 * gap) / 3, ih = Math.min(bottom - top - 70, Math.max(...["art1", "art2", "art3"].map((k) => w / ratio(k))));
      let lb = top;
      [["art1", URL.art1], ["art2", URL.art2], ["art3", URL.art3]].forEach(([k, u], i) => {
        const x = M + i * (w + gap);
        const im = fitImage(s, k, x, top, w, ih, { mode: "FIT", radius: 12, name: "стаття " + (i + 1) });
        im.y = top; // вирівняти по верху
        im.strokes = [solid("#DDDDDD")]; im.strokeWeight = 1;
        const l = linkLine(s, u, x, top + ih + 12, { w, size: 18, prefix: "Стаття: " });
        lb = Math.max(lb, l.y + l.height);
      });
      return lb;
    },
  });
  classic({
    name: "ЗМІ про подію та дослідження", tag: "Дослідження", linkLabel: "Media", url: URL.media, linkPrefix: "Скріншоти публікацій: ",
    title: "ЗМІ про нашу подію та дослідження", pill: "Скріншоти публікацій, поширення від ЗМІ",
    draw(s, top, bottom) {
      const items = [
        [{ t: "European Business Association: ", f: "m" }, { t: "Site", u: URL.eba, c: C.link }],
        [{ t: "KSE BS: ", f: "m" }, { t: "Site", u: URL.kse, c: C.link }, { t: ", " }, { t: "Insta Stories", u: URL.kseStories, c: C.link }],
        [{ t: "GreenEnergyEfficiency: ", f: "m" }, { t: "Facebook", u: URL.gee, c: C.link }],
      ];
      let y = top + 110;
      for (const runs of items) {
        rect(s, M + 20, y + 8, 30, 40, [solid("#FFD400")], "маркер", 15);
        const t = text(s, runs, { size: 38, x: M + 80, y, w: 560, lh: 1.2 });
        y += t.height + 50;
      }
      const h = bottom - top;
      const a = fitImage(s, "o13_0", 700, top, 500, h, { mode: "FIT", radius: 12, name: "LinkedIn" });
      const rx = 1230, rw = W - M - rx, rh = (h - 20) / 2;
      const b = fitImage(s, "o13_1", rx, top, rw, rh, { mode: "FIT", radius: 12, name: "EBA" });
      const c = fitImage(s, "o13_2", rx, top + rh + 20, rw, rh, { mode: "FIT", radius: 12, name: "KSE" });
      return Math.max(a.y + a.height, c.y + c.height);
    },
  });
  classic({
    name: "Розсилка AIN", tag: "Анонс події", linkLabel: "Розсилка", url: URL.mail, linkPrefix: "Розсилка: ",
    title: PARTNER + ": розміщення торговельних марок в інформаційних матеріалах: розсилка AIN", pill: "Закритий захід | Охоплення: 2.129",
    draw(s, top, bottom) {
      const h = bottom - top, gap = 16;
      const w1 = Math.round(h * ratio("mail1")), w2 = Math.round(h * ratio("mail2"));
      const a = image(s, "mail1", M, top, w1, h, { mode: "FIT", name: "розсилка 1" });
      a.strokes = [solid("#DDDDDD")]; a.strokeWeight = 1;
      const b = image(s, "mail2", M + w1 + gap, top, w2, h, { mode: "FIT", name: "розсилка 2" });
      b.strokes = [solid("#DDDDDD")]; b.strokeWeight = 1;
      const x0 = M + w1 + w2 + gap + 40;
      fitImage(s, "o14_0", x0, top, W - M - x0, h, { mode: "FIT", name: "статистика розсилки" });
      return bottom;
    },
  });

  /* 25–38. Дослідження: назви + посилання на дослідження під картинками */
  const RS = PARTNER + ": розміщення торговельних марок у дослідженні";
  classic({ name: "Логотипи в дослідженні 1", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, linkPrefix: "Дослідження: ", title: RS, pill: "Логотипи в дослідженні",
    draw: (s, top, bottom) => shotGrid(s, ["o24_0", "o24_3", "o24_1", "o24_2"], 2, M, top, W - 2 * M, bottom - top, 16) });
  classic({ name: "Логотипи в дослідженні 2", tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, linkPrefix: "Дослідження: ", title: RS, pill: "Логотипи в дослідженні",
    draw: (s, top, bottom) => shotGrid(s, ["o25_1", "o25_0"], 2, M, top, W - 2 * M, bottom - top, 24) });
  const EXP = PARTNER + ": розміщення торговельних марок та експертно-аналітичних коментарів Спонсора щодо актуальності теми енергоефективності та енергетичної стійкості України у дослідженні";
  const CASE = PARTNER + ": розміщення торговельних марок та імплементації у структуру Дослідження інформаційних кейсів Спонсора, що відображають реалізовані інвестиційні проєкти у сфері енергоавтономності та енергоефективності";
  // за змістом: кейс CHOCOBOOM — лише старі 28, 31, 32 (стор. 147–149 дослідження), решта — коментарі Спонсора
  const T26 = { 26: EXP, 27: EXP, 28: CASE, 29: EXP, 30: EXP, 31: CASE, 32: CASE, 33: EXP, 34: EXP, 35: EXP, 36: EXP, 37: EXP };
  for (let n = 26; n <= 37; n++) {
    classic({
      name: (T26[n] === CASE ? "Кейси Спонсора в дослідженні " : "Коментарі Спонсора в дослідженні ") + n, tag: "Дослідження", linkLabel: "Сайт AIN", url: URL.research, linkPrefix: "Дослідження: ",
      title: T26[n], page: n, pill: "Експертиза в дослідженні",
    });
  }

  /* 39. Підсумок — без змін */
  {
    const s = slide("Підсумок (без змін)", C.red);
    image(s, "full38", 0, 0, W, H, { name: "оригінальний слайд 38" });
  }
}

/* лише два оновлені слайди, щоб вставити їх у вже існуючу презентацію */
async function buildTwo() {
  N = 6; slideBadges();
  N = 8; slideStage();
}

/* ---------------- запуск ---------------- */
(async () => {
  try {
    await loadFonts();
    let where;
    if (SLIDES) {
      const before = figma.getSlideGrid().map((r) => r.slice()).filter((r) => r.length);
      await (PART === "two" ? buildTwo() : build());
      // старі ряди без змін + один новий ряд з усіма новими слайдами в правильному порядку
      try {
        const ids = new Set(MINE.map((n) => n.id));
        const old = before.map((r) => r.filter((n) => !ids.has(n.id))).filter((r) => r.length);
        figma.setSlideGrid(old.concat([MINE]));
      } catch (e) { LOG.push("Порядок слайдів: " + e.message); }
      try { figma.viewport.slidesView = "grid"; } catch (e) {}
      where = "окремим рядом у кінці сітки слайдів";
    } else {
      PAGE = figma.createPage();
      PAGE.name = "Звіт UGB — оновлено " + new Date().toLocaleDateString("uk-UA");
      await figma.setCurrentPageAsync(PAGE);
      await (PART === "two" ? buildTwo() : build());
      figma.viewport.scrollAndZoomIntoView(PAGE.children);
      where = "на сторінці «" + PAGE.name + "»";
    }
    const msg = [PART === "two" ? "Готово: 2 слайди (07 — бейджі, 09 — сцена) " + where + "." : "Готово: " + N + " слайдів " + where + "."];
    if (fontNote) msg.push(fontNote);
    if (LOG.length) { msg.push(LOG.length + " попереджень — див. консоль."); console.warn(LOG.join("\n")); }
    figma.closePlugin(msg.join(" "));
  } catch (e) {
    console.error(e);
    figma.closePlugin("Помилка: " + (e && e.message ? e.message : e));
  }
})();
