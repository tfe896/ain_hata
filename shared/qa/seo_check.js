/* Перевірка живої сторінки за чеклістом редакції AIN (special.ain.ua).
   Запуск:  URL=https://<сайт>.webflow.io/<сторінка> node shared/qa/seo_check.js
   Необов'язково: LANG=uk (очікувана мова), LINK_HOSTS=ain.ua (хости, які не вважаються «чужими»).
   Друкує ✓ / ✗ / ⚠ по кожному пункту чекліста. ⚠ означає «залежить від кінцевого експорту на special.ain.ua
   або від рішення людини» (canonical, robots, GTM, автор). Усе, що можна перевірити без плагінів
   SEO Meta і Dofollow Detector, перевіряється тут. Повний чекліст: shared/qa/CHECKLIST-special.md */
const { chromium } = require("playwright");

const URL_ = process.env.URL;
const WANT_LANG = process.env.LANG_CODE || process.env.LANG_WANT || "uk";
const OWN = (process.env.LINK_HOSTS || "ain.ua").split(",");
if (!URL_) { console.error("Потрібна змінна URL=<адреса сторінки>"); process.exit(1); }

const out = [];
const ok = (name, note) => out.push(["✓", name, note || ""]);
const bad = (name, note) => out.push(["✗", name, note || ""]);
const warn = (name, note) => out.push(["⚠", name, note || ""]);

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const resp = [];
  page.on("response", async (r) => {
    try {
      const h = r.headers();
      let size = parseInt(h["content-length"] || "0", 10);
      if (!size) { const b = await r.body().catch(() => null); size = b ? b.length : 0; }
      resp.push({ url: r.url(), status: r.status(), type: h["content-type"] || "", size });
    } catch (e) { /* ignore */ }
  });
  await page.goto(URL_, { waitUntil: "networkidle" });
  await page.waitForTimeout(2500);
  // довантажити картинки, що ліниво підвантажуються
  await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); } window.scrollTo(0, 0); });
  await page.waitForTimeout(1500);

  const d = await page.evaluate(() => {
    const meta = (sel) => { const e = document.querySelector(sel); return e ? e.getAttribute("content") : null; };
    return {
      lang: document.documentElement.getAttribute("lang"),
      title: document.title,
      description: meta('meta[name="description"]'),
      ogTitle: meta('meta[property="og:title"]'), ogDesc: meta('meta[property="og:description"]'), ogImage: meta('meta[property="og:image"]'),
      canonical: (document.querySelector('link[rel="canonical"]') || {}).href || null,
      robots: meta('meta[name="robots"]'),
      ld: Array.from(document.querySelectorAll('script[type="application/ld+json"]')).map(s => s.textContent),
      headings: Array.from(document.querySelectorAll("h1,h2,h3,h4,h5,h6")).map(h => [parseInt(h.tagName[1], 10), h.textContent.replace(/\s+/g, " ").trim().slice(0, 60)]),
      imgs: Array.from(document.images).map(i => ({ src: i.currentSrc || i.src, alt: i.getAttribute("alt"), title: i.getAttribute("title") })),
      links: Array.from(document.querySelectorAll("a")).map(a => ({ href: a.getAttribute("href"), rel: a.getAttribute("rel") || "", text: a.textContent.trim().slice(0, 40) })),
      html: document.documentElement.outerHTML,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth
    };
  });

  // 1. Open Graph
  if (d.ogTitle && d.ogDesc && d.ogImage) ok("Open Graph", "og:title, og:description, og:image заповнені"); else bad("Open Graph", "немає: " + [!d.ogTitle && "og:title", !d.ogDesc && "og:description", !d.ogImage && "og:image"].filter(Boolean).join(", "));
  // 2. Title і description
  if (d.title && d.description) ok("meta title + description", d.title.length + " і " + d.description.length + " символів"); else bad("meta title + description");
  // 3. h1 і ієрархія
  const h1s = d.headings.filter(h => h[0] === 1);
  if (h1s.length === 1) ok("Один h1", h1s[0][1]); else bad("Один h1", "знайдено " + h1s.length);
  let prev = 0, hier = true, hierNote = "";
  d.headings.forEach(h => { if (prev && h[0] > prev + 1) { hier = false; hierNote += " h" + prev + "→h" + h[0] + " («" + h[1] + "»)"; } prev = h[0]; });
  if (hier) ok("Ієрархія заголовків"); else bad("Ієрархія заголовків", hierNote);
  // 4. lang
  if (d.lang === WANT_LANG) ok("lang", d.lang); else bad("lang", "очікувалось " + WANT_LANG + ", є " + d.lang);
  // 5. canonical, robots (залежать від експорту)
  if (d.canonical) { if (/\/$/.test(d.canonical)) ok("canonical", d.canonical); else warn("canonical", d.canonical + " (має бути самоканонічний, зі слешем)"); } else warn("canonical", "немає: Webflow не дає виставити через API, ставиться при експорті на special.ain.ua");
  if (d.robots === "index,follow") ok("robots", d.robots); else warn("robots", "немає <meta name=\"robots\" content=\"index,follow\">; додається при експорті");
  // 6. GTM
  if (/googletagmanager\.com\/gtm\.js\?id=GTM-K4F6Q5PN|GTM-K4F6Q5PN/.test(d.html)) ok("GTM", "GTM-K4F6Q5PN"); else warn("GTM", "немає коду GTM-K4F6Q5PN; додається при експорті або за рішенням людини");
  // 7. Schema.org
  if (d.ld.length) { try { const j = JSON.parse(d.ld[0]); const g = j["@graph"] || [j]; const art = g.find(x => x["@type"] === "Article"); art && art.author ? ok("Schema.org Article + author", "є") : bad("Schema.org", "немає Article з author"); } catch (e) { bad("Schema.org", "некоректний JSON-LD"); } } else bad("Schema.org", "немає JSON-LD");
  // 8. Зображення: alt, title, розмір, формат
  const noAlt = d.imgs.filter(i => !i.alt), noTitle = d.imgs.filter(i => !i.title);
  noAlt.length ? bad("alt у зображень", noAlt.length + " без alt: " + noAlt.map(i => i.src.split("/").pop()).join(", ")) : ok("alt у зображень", d.imgs.length + " шт.");
  noTitle.length ? bad("title у зображень", noTitle.length + " без title") : ok("title у зображень");
  const pics = resp.filter(r => /^image\//.test(r.type) && r.status < 400);
  const heavy = pics.filter(r => r.size > 100 * 1024), png = pics.filter(r => /png/.test(r.type));
  heavy.length ? bad("Розмір картинок до 100 КБ", heavy.map(r => r.url.split("/").pop() + " " + Math.round(r.size / 1024) + " КБ").join("; ")) : ok("Розмір картинок до 100 КБ", "найбільша " + Math.round(Math.max.apply(null, pics.map(r => r.size)) / 1024) + " КБ");
  png.length ? bad("Без PNG", png.map(r => r.url.split("/").pop()).join(", ")) : ok("Без PNG");
  // 9. 404 і биті
  const broken = resp.filter(r => r.status >= 400);
  broken.length ? bad("404 і помилки запитів", broken.map(r => r.status + " " + r.url.slice(0, 90)).join("; ")) : ok("Немає 404 у Network");
  // 10. Посилання: #, чужі dofollow, слеші
  const hashes = d.links.filter(l => l.href === "#" || /#$/.test(l.href || ""));
  hashes.length ? bad("Посилання з «#»", hashes.map(l => "«" + l.text + "» " + l.href).join("; ")) : ok("Немає посилань з «#»");
  const foreign = d.links.filter(l => /^https?:/.test(l.href || "") && !OWN.some(h => new URL(l.href).hostname.endsWith(h)) && !/(facebook|instagram|x|twitter|youtube|linkedin|t)\.(com|me)\/|x\.com|t\.me/.test(l.href) && !/nofollow/.test(l.rel));
  foreign.length ? bad("Чужі посилання без nofollow", foreign.map(l => l.href).join("; ")) : ok("Чужих dofollow-посилань немає");
  const noSlash = d.links.filter(l => /^https?:\/\/(www\.)?ain\.ua\/[^?#]*[^/?#]$/.test(l.href || "") && !/\.[a-z0-9]{2,4}$/.test(l.href));
  noSlash.length ? bad("Слеш у кінці внутрішніх посилань", noSlash.map(l => l.href).join("; ")) : ok("Внутрішні посилання зі слешем");
  // 11. Футер
  /©\s*1999[–-]20\d\d/.test(d.html) ? ok("Футер AIN", d.html.match(/©\s*1999[–-]20\d\d[^<]*/)[0]) : bad("Футер AIN", "немає рядка © 1999–рік");
  // 12. Переповнення
  d.overflow > 0 ? bad("Горизонтальне переповнення", d.overflow + " px") : ok("Без горизонтального переповнення");
  // 13. Перелінковка
  const cards = await page.$$(".ainf-card").then(a => a.length).catch(() => 0);
  cards >= 2 ? ok("Блок перелінковки", cards + " картки") : bad("Блок перелінковки", "карток: " + cards);
  warn("Автор (видимий)", "перевірити очима, що на сторінці є автор");
  warn("Розмір архіву до 15 МБ", "рахується на експорті Webflow (відео й карта з Assets, див. розміри файлів у README)");

  out.forEach(([s, n, t]) => console.log(s + " " + n + (t ? " — " + t : "")));
  const fails = out.filter(o => o[0] === "✗").length;
  console.log("\nПідсумок: ✗ " + fails + ", ⚠ " + out.filter(o => o[0] === "⚠").length + ", ✓ " + out.filter(o => o[0] === "✓").length);
  await browser.close();
  process.exit(fails ? 1 : 0);
})();
