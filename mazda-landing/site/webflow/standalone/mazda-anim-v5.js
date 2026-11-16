/* =====================================================================================
   Mazda × Співпраця — анімації лендінгу (GSAP + ScrollTrigger)

   ЯК ПРАВИТИ РУКАМИ
   • Швидкість, затримки, відстані, плавність — у блоці «1. НАЛАШТУВАННЯ» одразу нижче.
     Решту файлу для цього чіпати не треба.
   • Тексти, цифри, фото й посилання міняються у Webflow Designer: скрипт шукає елементи
     лише за data-атрибутами та класами mz-*, тому від правок контенту нічого не ламається.
   • Кожна анімація — окрема функція (див. зміст). Щоб вимкнути анімацію, закоментуйте
     її рядок у блоці «ЗАПУСК» наприкінці файлу.

   ЗМІСТ
   1. Налаштування
   2. Помічники
   3. Типографіка (короткі слова не лишаються в кінці рядка)
   4. Розбиття тексту на слова, літери, рядки
   5. Поява блоків            data-anim="reveal"
   6. Текст по словах         data-anim="words"
   7. Заголовок по літерах    data-anim="letters"
   8. Текст, що «засвічується» від скролу   data-anim="scrub"
   9. Лічильники              data-count
   10. Полароїди              data-shot
   11. Фото: наближення й паралакс (лише комп'ютер)
   12. Відео першого екрана   data-video, data-video-mobile
   13. Карта маршруту         data-map, data-pins
   14. Індикатор прокрутки
   15. Перший екран і заставка
   ЗАПУСК

   Підключення на сторінці (кінець body, саме в такому порядку):
   gsap.min.js → ScrollTrigger.min.js → цей файл.
   Якщо GSAP не завантажився або в людини ввімкнено «менше руху», сторінка просто
   показується без анімацій. Скрол ніколи не блокується.
   ===================================================================================== */
(function () {
  "use strict";
  var W = window, D = document, H = D.documentElement;
  if (W.__mazdaReady) return;
  W.__mazdaReady = true; // знак для запобіжника в head: скрипт запустився

  /* ===================================================================================
     1. НАЛАШТУВАННЯ (можна міняти руками)
     Час у секундах, відстані в пікселях. Плавність (ease) — назви GSAP:
     https://gsap.com/docs/v3/Eases  ("none" — рівномірно, "expo.out" — швидко й м'яко
     гальмує, "back.out(1.4)" — з легким перельотом).
     Старт "top 88%" означає: анімація починається, коли верх блока доходить до 88%
     висоти екрана (тобто блок щойно з'явився знизу).
     =================================================================================== */
  var SETTINGS = {
    // Поява блоків: data-anim="reveal"
    reveal: {
      offset: 44,          // на скільки пікселів блок піднімається знизу
      tagOffset: -18,      // теги (.mz-tag) виїжджають збоку
      duration: 1,
      ease: "expo.out",
      start: "top 88%",
      stagger: 0.12        // пауза між сусідніми блоками одного ряду
    },
    // Ряди, в яких сусіди з'являються по черзі
    rows: ".mz-plates, .mz-stops, .mz-facts, .mz-fig-shots, .mz-quotes, .ainf-cards",

    // Текст по словах: data-anim="words"
    words: { duration: 0.8, ease: "expo.out", stagger: 0.012, start: "top 88%" },

    // Заголовок по літерах: data-anim="letters"
    letters: { duration: 0.9, ease: "expo.out", stagger: 0.018, start: "top 88%" },

    // Текст, що «засвічується» від скролу: data-anim="scrub"
    scrub: {
      dim: 0.16,           // прозорість слів до «засвічення»
      start: "top 88%",
      end: "bottom 38%",
      smooth: 0.4          // згладжування руху за скролом
    },

    // Лічильники: data-count
    counter: { duration: 1.5, ease: "power4.out", start: "top 88%" },

    // Полароїди: data-shot
    shot: {
      offset: 70, scale: 1.12, duration: 0.9, ease: "back.out(1.4)",
      offsetTouch: 40,     // на телефоні спокійніше: без збільшення й перельоту
      start: "top 88%"
    },

    // Фото: наближення при появі та паралакс від скролу (паралакс лише на комп'ютері)
    photo: {
      plateFrom: 1.25, plateTo: 1.08, plateDuration: 1.8,  // фото у фактоїдах
      plateParallax: 0.06,     // частка шляху скролу; 0 — вимкнути
      handlingScale: 1.12,     // запас фото «Керованість», щоб паралакс не відкривав краї
      handlingParallax: 0.1,
      heroFrom: 1.2, heroTo: 1.04, heroDuration: 2.2,      // перший екран
      heroParallax: 0.18
    },

    // Карта маршруту. Значення at — частка прокрутки карти (0 — початок, 1 — кінець)
    map: {
      start: "top 78%",
      end: "75% 66%",
      // точки: x, y — у відсотках карти; cls — з якого боку підпис; dx, dy — зсув підпису
      pins: [
        { x: 46.43, y: 23.84, cls: "mz-lbl-above", at: 0.0 },                        // Київ
        { x: 65.08, y: 32.85, cls: "mz-lbl-right", at: 0.34 },                       // Полтавщина
        { x: 3.15, y: 49.02, cls: "mz-lbl-below", dy: 5.3, at: 0.7 },                // Закарпаття
        { x: 14.64, y: 52.67, cls: "mz-lbl-between", dx: 2.2, dy: -6.05, at: 0.86 }  // Карпати
      ],
      // коли зафарбовуються області (порядок як у map.svg):
      // Київщина, Київ, Закарпаття, Івано-Франківщина, Полтавщина
      regionsAt: [0.02, 0.02, 0.66, 0.84, 0.3],
      // коли «засвічуються» картки зупинок 01–05
      stopsAt: [0.04, 0.34, 0.7, 0.86, 0.97],
      // відрізки лінії маршруту: петля Київщиною, дорога на захід, пунктир назад до Києва
      loop: [0.0, 0.14], out: [0.14, 0.86], back: [0.86, 1.0],
      backPath: "M125.3 298.1C190 304 300 250 392.4 136.4",
      colors: { land: "#FFF9D9", region: "#FFC08A", line: "#000" }
    },

    // Перший екран
    hero: {
      lineDuration: 1.1, lineStagger: 0.12, lineDelay: 0.25,   // рядки заголовка
      headerDelay: 0.55, headerDuration: 0.8,                  // шапка з логотипами
      subDelay: 0.95,                                          // підзаголовок
      countDuration: 1.5                                       // числа в заголовку
    },

    // Заставка (помаранчева завіса зі штампом і лічильником кілометрів)
    intro: {
      enabled: true,
      countTo: 2500, countSuffix: " км", countDuration: 1.1, countStart: 0.38,
      pressDuration: 0.34,     // удар штампа
      shakeAt: 0.3,            // коли завіса здригається від удару
      shake: [[-7, 5], [6, -4], [-4, 3], [3, -2], [0, 0]],  // зсуви завіси (x, y)
      shakeDuration: 0.28,
      hold: 1.75,              // скільки заставка тримається до відкриття
      leaveDuration: 0.95,     // завіса їде вгору, штамп летить на місце
      leaveEase: "expo.inOut",
      fontWait: 1.2,           // скільки чекаємо на шрифт лічильника
      font: '700 1em "GT Pressura LC"'
    }
  };

  /* ===================================================================================
     2. ПОМІЧНИКИ
     =================================================================================== */
  var gsap = W.gsap, ScrollTrigger = W.ScrollTrigger;
  var REDUCED = W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Телефони й планшети: без паралаксу (на iOS висота вікна «дихає» з адресним рядком, фото смикаються)
  var TOUCH = W.matchMedia("(max-width: 767px), (hover: none) and (pointer: coarse)").matches;
  var PHONE = W.matchMedia("(max-width: 767px)").matches;
  var ANIMATE = !!(gsap && ScrollTrigger) && !REDUCED; // чи вмикати анімації взагалі

  function $(sel, root) { return (root || D).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
  function el(tag, cls, text) {
    var n = D.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  // Кожен крок ізольований: помилка в одному не ламає решту (пишеться в консоль як [mazda])
  function step(name, fn) { try { return fn(); } catch (e) { console.error("[mazda]", name, e); } }
  function textNodes(root) {
    var out = [], w = D.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }
  // Екранні читалки читають текст цілим, а не по літерах
  function label(e) {
    if (!e.getAttribute("aria-label")) e.setAttribute("aria-label", e.textContent.replace(/\s+/g, " ").trim());
  }
  // Затримка для сусідів одного ряду (SETTINGS.rows): другий трохи пізніше за перший і т. д.
  function rowDelay(e) {
    var row = e.parentElement;
    if (!row || !row.matches(SETTINGS.rows)) return 0;
    return Array.prototype.indexOf.call(row.children, e) * SETTINGS.reveal.stagger;
  }
  function inHero(e) { return !!e.closest(".mz-hero"); } // перший екран веде заставка
  // Число «набігає» від нуля: countTo(елемент, 2500, 1.5, "", " км")
  function countTo(node, to, duration, prefix, suffix, ease) {
    var o = { v: 0 };
    return gsap.to(o, {
      v: to, duration: duration, ease: ease || SETTINGS.counter.ease,
      onUpdate: function () { node.textContent = (prefix || "") + Math.round(o.v) + (suffix || ""); }
    });
  }

  /* ===================================================================================
     3. ТИПОГРАФІКА: короткі слова (й, і, у, в, з, на, до…) не лишаються в кінці рядка
     =================================================================================== */
  var TYPO_TARGETS = ".mz-h1, .mz-h2, .mz-h3, .mz-lead, .mz-p, .mz-hero-sub, .mz-quote-text, .mz-plate-cap, .mz-stop-note, .mz-fact-cap";
  function initTypography() {
    var NBSP = " ";
    var re = /(^|[ \n «(])([А-Яа-яІіЇїЄєҐґ]{1,2}) /g;
    $$(TYPO_TARGETS).forEach(function (e) {
      textNodes(e).forEach(function (t) {
        t.nodeValue = t.nodeValue.replace(re, "$1$2" + NBSP).replace(re, "$1$2" + NBSP);
      });
    });
  }

  /* ===================================================================================
     4. РОЗБИТТЯ ТЕКСТУ
     Слова стають <span class="mz-w"><span class="mz-i">слово</span></span>,
     літери — <span class="mz-c">, рядки заголовка — <span class="mz-line"><span class="mz-li">.
     =================================================================================== */
  function splitText(root, mode) { // mode: "words" | "letters" | "scrub"
    textNodes(root).forEach(function (t) {
      if (!t.nodeValue.trim()) return;
      var frag = D.createDocumentFragment();
      t.nodeValue.split(/( +)/).forEach(function (part) {
        if (!part) return;
        if (/^ +$/.test(part)) { frag.appendChild(D.createTextNode(" ")); return; }
        if (mode === "scrub") { frag.appendChild(el("span", "mz-s", part)); return; }
        var word = el("span", "mz-w");
        if (mode === "letters") Array.from(part).forEach(function (ch) { word.appendChild(el("span", "mz-c", ch)); });
        else word.appendChild(el("span", "mz-i", part));
        frag.appendChild(word);
      });
      t.parentNode.replaceChild(frag, t);
    });
  }
  // Заголовок першого екрана: рядки за <br>; числа всередині обгортаються в .mz-num (рахуються від нуля)
  function splitLines(root) {
    var lines = [[]]; // рядки ділить <br>, поставлений у Webflow (Shift+Enter)
    Array.prototype.slice.call(root.childNodes).forEach(function (n) {
      if (n.nodeName === "BR") lines.push([]); else lines[lines.length - 1].push(n);
    });
    root.textContent = "";
    lines.forEach(function (nodes) {
      var line = el("span", "mz-line"), inner = el("span", "mz-li");
      nodes.forEach(function (n) { inner.appendChild(n); });
      textNodes(inner).forEach(function (t) {
        var parts = t.nodeValue.split(/(\d+)/);
        if (parts.length < 2) return;
        var frag = D.createDocumentFragment();
        parts.forEach(function (p) {
          if (!p) return;
          if (/^\d+$/.test(p)) { var s = el("span", "mz-num", p); s.setAttribute("data-to", p); frag.appendChild(s); }
          else frag.appendChild(D.createTextNode(p));
        });
        t.parentNode.replaceChild(frag, t);
      });
      line.appendChild(inner);
      root.appendChild(line);
    });
  }

  /* ===================================================================================
     5. ПОЯВА БЛОКІВ: data-anim="reveal"
     =================================================================================== */
  function initReveal() {
    var S = SETTINGS.reveal;
    $$('[data-anim="reveal"]').forEach(function (e) {
      if (inHero(e)) return;
      var isTag = e.classList.contains("mz-tag");
      gsap.from(e, {
        opacity: 0,
        x: isTag ? S.tagOffset : 0,
        y: isTag ? 0 : S.offset,
        duration: S.duration, ease: S.ease, delay: rowDelay(e),
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: e, start: S.start, once: true }
      });
    });
  }

  /* ===================================================================================
     6. ТЕКСТ ПО СЛОВАХ: data-anim="words"
     =================================================================================== */
  function initWords() {
    var S = SETTINGS.words;
    $$('[data-anim="words"]').forEach(function (e) {
      label(e);
      splitText(e, "words");
      if (inHero(e)) return; // підзаголовок першого екрана запускає заставка (розділ 15)
      gsap.from($$(".mz-i", e), {
        yPercent: 105, opacity: 0,
        duration: S.duration, ease: S.ease, stagger: S.stagger,
        scrollTrigger: { trigger: e, start: S.start, once: true }
      });
    });
  }

  /* ===================================================================================
     7. ЗАГОЛОВОК ПО ЛІТЕРАХ: data-anim="letters"
     =================================================================================== */
  function initLetters() {
    var S = SETTINGS.letters;
    $$('[data-anim="letters"]').forEach(function (e) {
      label(e);
      splitText(e, "letters");
      gsap.from($$(".mz-c", e), {
        yPercent: 110,
        duration: S.duration, ease: S.ease, stagger: S.stagger,
        scrollTrigger: { trigger: e, start: S.start, once: true }
      });
    });
  }

  /* ===================================================================================
     8. ТЕКСТ, ЩО «ЗАСВІЧУЄТЬСЯ» ВІД СКРОЛУ: data-anim="scrub"
     =================================================================================== */
  function initScrub() {
    var S = SETTINGS.scrub;
    $$('[data-anim="scrub"]').forEach(function (e) {
      label(e);
      splitText(e, "scrub");
      gsap.fromTo($$(".mz-s", e), { opacity: S.dim }, {
        opacity: 1, ease: "none", stagger: 1, duration: 1,
        scrollTrigger: { trigger: e, start: S.start, end: S.end, scrub: S.smooth }
      });
    });
  }

  /* ===================================================================================
     9. ЛІЧИЛЬНИКИ: data-count
     Беремо перше число в тексті («2500+», «200 км», «5+ метрів») і рахуємо до нього від нуля.
     =================================================================================== */
  function initCounters() {
    var S = SETTINGS.counter;
    $$("[data-count]").forEach(function (e) {
      var m = e.textContent.match(/^(\D*?)(\d+)([\s\S]*)$/);
      if (!m) return;
      e.style.minWidth = e.getBoundingClientRect().width + "px"; // щоб сусіди не стрибали, поки число росте
      e.textContent = m[1] + "0" + m[3];
      ScrollTrigger.create({
        trigger: e, start: S.start, once: true,
        onEnter: function () { countTo(e, parseInt(m[2], 10), S.duration, m[1], m[3]); }
      });
    });
  }

  /* ===================================================================================
     10. ПОЛАРОЇДИ: data-shot
     Без паралаксу від скролу: на дрібних фото він дає дрижання.
     Після появи ставиться клас is-set: з ним у стилях вмикається реакція на наведення.
     =================================================================================== */
  function initShots() {
    var S = SETTINGS.shot;
    $$("[data-shot]").forEach(function (e) {
      gsap.from(e, {
        opacity: 0,
        y: TOUCH ? S.offsetTouch : S.offset,
        scale: TOUCH ? 1 : S.scale,
        duration: S.duration, ease: TOUCH ? "expo.out" : S.ease, delay: rowDelay(e),
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: e, start: S.start, once: true },
        onComplete: function () { e.classList.add("is-set"); }
      });
    });
  }

  /* ===================================================================================
     11. ФОТО: наближення при появі та паралакс
     =================================================================================== */
  // Паралакс: фото їде трохи повільніше за сторінку, поки блок перетинає екран
  function parallax(img, box, amount) {
    if (TOUCH || !amount) return;
    function dist() { return (W.innerHeight + box.offsetHeight) / 2 * amount; }
    gsap.fromTo(img, { y: function () { return -dist(); } }, {
      y: function () { return dist(); }, ease: "none",
      scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true, invalidateOnRefresh: true }
    });
  }
  function initPhotos() {
    var S = SETTINGS.photo;
    // фото у фактоїдах: повільно «від'їжджають» при появі
    $$(".mz-plate").forEach(function (plate) {
      var img = $(".mz-plate-img", plate);
      if (!img) return;
      gsap.fromTo(img, { scale: S.plateFrom }, {
        scale: S.plateTo, duration: S.plateDuration, ease: "expo.out", delay: rowDelay(plate),
        scrollTrigger: { trigger: plate, start: SETTINGS.reveal.start, once: true }
      });
      parallax(img, plate, S.plateParallax);
    });
    // велике фото блока «Керованість»
    $$(".mz-handling-bg").forEach(function (img) {
      if (TOUCH) return;
      gsap.set(img, { scale: S.handlingScale });
      parallax(img, img.parentNode, S.handlingParallax);
    });
  }

  /* ===================================================================================
     12. ВІДЕО ПЕРШОГО ЕКРАНА: data-video (комп'ютер) і data-video-mobile (телефон)
     Постер видно одразу; відео плавно з'являється, коли почало грати.
     =================================================================================== */
  function initVideo() {
    var hero = $(".mz-hero[data-video]");
    if (!hero || REDUCED) return;
    var src = hero.getAttribute("data-video");
    var v = el("video", "mz-hero-video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    ["muted", "playsinline", "webkit-playsinline"].forEach(function (a) { v.setAttribute(a, ""); });
    v.setAttribute("preload", "auto");
    v.setAttribute("aria-hidden", "true");
    v.src = PHONE ? (hero.getAttribute("data-video-mobile") || src.replace("hero.mp4", "hero-m.mp4")) : src;
    v.addEventListener("playing", function () { v.classList.add("is-on"); });
    var poster = $(".mz-hero-poster", hero);
    hero.insertBefore(v, poster ? poster.nextSibling : hero.firstChild);
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  }

  /* ===================================================================================
     13. КАРТА МАРШРУТУ: data-map (файл карти), data-pins (підписи точок через |)
     Лінія малюється разом зі скролом і тільки «росте»: при прокрутці назад не гасне.
     =================================================================================== */
  var route = null;
  function buildMap(box, svgText) {
    var M = SETTINGS.map, C = M.colors, NS = "http://www.w3.org/2000/svg";
    var src = new DOMParser().parseFromString(svgText, "image/svg+xml");
    function d(id) { var p = src.querySelector('[id="' + id + '"]'); return p ? p.getAttribute("d") : ""; }
    function node(tag, attrs, parent) {
      var n = D.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(n);
      return n;
    }
    function line(extra) {
      var a = { stroke: C.line, "stroke-linecap": "round", "stroke-linejoin": "round" };
      Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
      return a;
    }
    // шари карти знизу вгору: контур, суша, області маршруту, межі областей, лінії маршруту
    var svg = node("svg", { viewBox: "2.35 2.39 840 562", "class": "mz-map", fill: "none", "aria-hidden": "true" });
    node("path", { d: d("ukraine outline"), stroke: C.line, "stroke-width": 3, "stroke-linejoin": "round" }, svg);
    node("path", { d: d("ukraine"), fill: C.land }, svg);
    var regions = (d("oblasts on route").match(/M[^M]*/g) || []).map(function (sub) {
      return node("path", { d: sub, fill: C.region, "class": "mz-obl" }, svg);
    });
    node("path", { d: d("oblast borders"), stroke: C.line, "stroke-width": 0.75, "stroke-linejoin": "round" }, svg);
    // пунктир назад до Києва «проявляється» через маску
    var mask = node("mask", { id: "mz-back-mask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 843, height: 574 }, svg);
    var back = node("path", { d: M.backPath, stroke: "#fff", "stroke-width": 8, "stroke-linecap": "round" }, mask);
    node("path", line({ d: M.backPath, "stroke-width": 2.5, "stroke-dasharray": "10 9", mask: "url(#mz-back-mask)" }), svg);
    var loop = node("path", line({ d: d("loop kyiv-region"), "stroke-width": 5 }), svg);
    var out = node("path", line({ d: d("route out"), "stroke-width": 5 }), svg);
    box.appendChild(svg);

    // точки й підписи
    var names = (box.getAttribute("data-pins") || "").split("|");
    var pins = M.pins.map(function (p, i) {
      var dot = el("div", "mz-pin"), lbl = el("div", "mz-lbl " + p.cls, names[i] || "");
      dot.style.left = p.x + "%"; dot.style.top = p.y + "%";
      lbl.style.left = (p.x + (p.dx || 0)) + "%"; lbl.style.top = (p.y + (p.dy || 0)) + "%";
      box.appendChild(dot); box.appendChild(lbl);
      return { dot: dot, lbl: lbl, at: p.at };
    });

    var paths = [
      { p: loop, from: M.loop[0], to: M.loop[1] },
      { p: out, from: M.out[0], to: M.out[1] },
      { p: back, from: M.back[0], to: M.back[1] }
    ];
    paths.forEach(function (x) {
      x.len = x.p.getTotalLength();
      x.p.setAttribute("stroke-dasharray", x.len + " " + x.len);
      x.p.setAttribute("stroke-dashoffset", x.len);
    });
    route = { paths: paths, regions: regions, pins: pins, stops: $$(".mz-stops .mz-stop"), shown: -1 };
  }
  // p — частка маршруту від 0 до 1
  function drawRoute(p) {
    var M = SETTINGS.map;
    if (!route || p <= route.shown) return; // тільки вперед
    route.shown = p;
    route.paths.forEach(function (x) {
      x.p.setAttribute("stroke-dashoffset", x.len * (1 - clamp((p - x.from) / (x.to - x.from), 0, 1)));
    });
    route.regions.forEach(function (r, i) { r.classList.toggle("is-on", p >= (M.regionsAt[i] || 0)); });
    route.pins.forEach(function (x) {
      var on = p >= x.at && p > 0.001;
      x.dot.classList.toggle("is-on", on);
      x.lbl.classList.toggle("is-on", on);
    });
    route.stops.forEach(function (s, i) { s.classList.toggle("is-on", p >= (M.stopsAt[i] == null ? 1 : M.stopsAt[i])); });
  }
  function initMap() {
    var box = $("[data-map]");
    if (!box) return;
    fetch(box.getAttribute("data-map")).then(function (r) { return r.text(); }).then(function (svgText) {
      step("карта: побудова", function () {
        buildMap(box, svgText);
        if (!ANIMATE) { drawRoute(1); return; } // без анімацій показуємо весь маршрут одразу
        ScrollTrigger.create({
          trigger: box, start: SETTINGS.map.start, end: SETTINGS.map.end,
          onUpdate: function (self) { drawRoute(self.progress); },
          onRefresh: function (self) { drawRoute(self.progress); }
        });
      });
    }).catch(function (e) { console.error("[mazda] карта", e); });
  }

  /* ===================================================================================
     14. ІНДИКАТОР ПРОКРУТКИ (смужка вгорі; лише комп'ютер)
     =================================================================================== */
  function initProgressBar() {
    if (TOUCH) return;
    var bar = el("div", "mz-bar");
    D.body.appendChild(bar);
    gsap.to(bar, { scaleX: 1, ease: "none", scrollTrigger: { start: 0, end: "max", scrub: true } });
  }

  /* ===================================================================================
     15. ПЕРШИЙ ЕКРАН І ЗАСТАВКА
     Порядок: помаранчева завіса → удар штампа → лічильник кілометрів → завіса їде вгору,
     штамп летить на своє місце в заголовку → з'являються шапка, заголовок, підзаголовок.
     =================================================================================== */
  var heroTimeline = null;
  // Готує появу першого екрана (на паузі, запускає showHero)
  function initHero() {
    var S = SETTINGS.hero, P = SETTINGS.photo;
    var hero = $(".mz-hero");
    if (!hero) return;
    $$('[data-anim="lines"]', hero).forEach(function (e) { label(e); splitLines(e); });
    var media = $$(".mz-hero-poster, .mz-hero-video", hero);
    var tl = gsap.timeline({ paused: true });
    tl.fromTo(media, { scale: P.heroFrom }, { scale: P.heroTo, duration: P.heroDuration, ease: "expo.out" }, 0);
    tl.from($$(".mz-li", hero), {
      yPercent: 112, rotation: 4, transformOrigin: "0 100%",
      duration: S.lineDuration, ease: "expo.out", stagger: S.lineStagger
    }, S.lineDelay);
    tl.from(".mz-hdr", { yPercent: -100, duration: S.headerDuration, ease: "expo.out", clearProps: "transform" }, S.headerDelay);
    tl.from($$(".mz-hero-sub .mz-i", hero), {
      yPercent: 105, opacity: 0,
      duration: SETTINGS.words.duration, ease: SETTINGS.words.ease, stagger: SETTINGS.words.stagger
    }, S.subDelay);
    tl.call(function () {
      $$(".mz-num", hero).forEach(function (n) { countTo(n, parseInt(n.getAttribute("data-to"), 10), S.countDuration); });
    }, null, 0);
    heroTimeline = tl;
    // паралакс фону першого екрана (лише комп'ютер)
    if (!TOUCH && P.heroParallax) {
      gsap.to(media, {
        y: function () { return hero.offsetHeight * P.heroParallax; }, ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true }
      });
    }
  }
  function showHero() {
    H.classList.add("mz-ready");
    if (heroTimeline) heroTimeline.play();
  }
  function initIntro() {
    var S = SETTINGS.intro;
    var stamp = $(".mz-hero-stamp");
    if (!S.enabled || !stamp) { showHero(); H.classList.add("mz-intro-done"); return; }

    // будуємо завісу: місце під штамп, лічильник, підпис (текст підзаголовка)
    var curtain = el("div", "mz-curtain");
    var slot = el("div", "mz-curtain-slot");
    var count = el("div", "mz-curtain-count", "0" + S.countSuffix);
    var cap = el("div", "mz-curtain-cap", ($(".mz-hero-sub") || {}).textContent || "");
    curtain.appendChild(slot); curtain.appendChild(count); curtain.appendChild(cap);
    D.body.appendChild(curtain);
    // копія штампа, яка «літає» над сторінкою
    var fly = stamp.cloneNode(false);
    fly.className = "mz-stamp-fly";
    fly.removeAttribute("loading");
    D.body.appendChild(fly);
    H.classList.add("mz-curtain-on"); // справжня завіса на місці, шар-заглушка зі стилів більше не потрібен

    // чекаємо на шрифт лічильника (не довше fontWait), щоб текст не «перемикався» посеред заставки
    var started = false, left = false;
    count.style.visibility = "hidden";
    function start() { if (started) return; started = true; count.style.visibility = ""; press(); }
    W.setTimeout(start, S.fontWait * 1000);
    if (D.fonts && D.fonts.load) D.fonts.load(S.font).then(start, start); else start();

    // 1) штамп «б'є» по центру, завіса здригається, рахуються кілометри
    function press() {
      var r = slot.getBoundingClientRect();
      gsap.set(fly, { x: r.left, y: r.top, width: r.width, height: r.height, transformOrigin: "50% 50%" });
      var tl = gsap.timeline();
      tl.fromTo(fly, { scale: 2.4, rotation: -9 },
        { scale: 1, rotation: -3, duration: S.pressDuration, ease: "back.out(2.6)" }, 0);
      tl.fromTo(fly, { opacity: 0 }, { opacity: 1, duration: 0.12, ease: "none" }, 0);
      tl.to(curtain, {
        keyframes: S.shake.map(function (k) { return { x: k[0], y: k[1] }; }),
        duration: S.shakeDuration, ease: "none",
        onStart: function () { curtain.classList.add("is-shake"); },
        onComplete: function () { curtain.classList.remove("is-shake"); }
      }, S.shakeAt);
      tl.fromTo(cap, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, ease: "power1.out" }, S.shakeAt + 0.35);
      tl.add(countTo(count, S.countTo, S.countDuration, "", S.countSuffix), S.countStart);
      tl.call(leave, null, S.hold);
    }
    // 2) завіса їде вгору, штамп летить на своє місце, перший екран оживає
    function leave() {
      if (left) return;
      left = true;
      var to = stamp.getBoundingClientRect();
      curtain.classList.remove("is-shake");
      curtain.classList.add("is-out");
      gsap.to(curtain, { x: 0, y: 0, yPercent: -101, duration: S.leaveDuration, ease: S.leaveEase, overwrite: true });
      gsap.to(fly, {
        x: to.left, y: to.top, width: to.width, height: to.height, rotation: 0, scale: 1, opacity: 1,
        duration: S.leaveDuration, ease: S.leaveEase, overwrite: true,
        onComplete: function () {
          H.classList.add("mz-intro-done"); // показує справжній штамп у заголовку
          fly.remove();
          curtain.remove();
        }
      });
      showHero();
    }
    // якщо людина почала гортати, заставку не тримаємо
    W.addEventListener("scroll", function early() {
      if (W.pageYOffset <= 40) return;
      W.removeEventListener("scroll", early);
      if (started) leave();
    }, { passive: true });
  }

  /* ===================================================================================
     ЗАПУСК
     Щоб вимкнути анімацію, закоментуйте її рядок.
     =================================================================================== */
  step("типографіка", initTypography);

  if (!ANIMATE) {
    // GSAP не завантажився або ввімкнено «менше руху»: показуємо сторінку як є
    if (!REDUCED) console.warn("[mazda] GSAP не завантажився, анімації вимкнено");
    H.classList.remove("mz-js");
    H.classList.add("mz-ready");
    if (TOUCH) H.classList.add("mz-touch");
    step("відео", initVideo);
    step("карта", initMap);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true }); // адресний рядок телефона не перезапускає розрахунки
  H.classList.add("mz-js");
  if (TOUCH) H.classList.add("mz-touch");

  step("відео", initVideo);
  step("слова", initWords);
  step("літери", initLetters);
  step("скраб", initScrub);
  step("лічильники", initCounters);
  step("поява блоків", initReveal);
  step("полароїди", initShots);
  step("фото", initPhotos);
  step("карта", initMap);
  step("індикатор прокрутки", initProgressBar);
  step("перший екран", initHero);
  step("заставка", initIntro);
})();
