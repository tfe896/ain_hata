/* Mazda × Співпраця — анімації лендінгу.
   Скрипт шукає елементи лише за data-атрибутами та класами розмітки, тому тексти, цифри,
   фото й посилання можна вільно міняти у Webflow. Кожен крок ізольований: помилка в одному
   не ламає решту (пишеться в консоль як [mazda]). Скрол ніколи не блокується. */
(function () {
  "use strict";
  var W = window, D = document, H = D.documentElement;
  if (W.__mazdaReady) return;
  W.__mazdaReady = true;

  var RM = W.matchMedia && W.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var NBSP = " ";
  function $$(sel, root) { return Array.prototype.slice.call((root || D).querySelectorAll(sel)); }
  function $(sel, root) { return (root || D).querySelector(sel); }
  function step(name, fn) { try { return fn(); } catch (e) { console.error("[mazda]", name, e); } }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function el(tag, cls, text) { var n = D.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }

  /* Короткі слова (й, і, у, в, з, на, до…) не лишаються в кінці рядка. */
  function nb(text) {
    var re = /(^|[ \n «(])([А-Яа-яІіЇїЄєҐґ]{1,2}) /g;
    return text.replace(re, "$1$2" + NBSP).replace(re, "$1$2" + NBSP);
  }
  function textNodes(root) {
    var out = [], w = D.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }
  step("типографіка", function () {
    $$(".mz-h1, .mz-h2, .mz-h3, .mz-lead, .mz-p, .mz-hero-sub, .mz-quote-text, .mz-plate-cap, .mz-stop-note, .mz-fact-cap").forEach(function (e) {
      textNodes(e).forEach(function (t) { t.nodeValue = nb(t.nodeValue); });
    });
  });

  if (RM) { H.classList.remove("mz-js"); H.classList.add("mz-ready"); }
  else H.classList.add("mz-js");

  /* ---------- розбиття тексту ---------- */
  // Слова (розділені звичайним пробілом) стають .mz-w > inner; нерозривні пробіли лишаються всередині слова.
  function splitWords(root, innerCls, perChar) {
    var i = 0;
    textNodes(root).forEach(function (t) {
      if (!t.nodeValue.trim()) return;
      var frag = D.createDocumentFragment();
      t.nodeValue.split(/( +)/).forEach(function (part) {
        if (!part) return;
        if (/^ +$/.test(part)) { frag.appendChild(D.createTextNode(" ")); return; }
        var w = el("span", "mz-w");
        if (perChar) {
          Array.from(part).forEach(function (ch) {
            var c = el("span", "mz-c", ch);
            c.style.setProperty("--i", i++);
            w.appendChild(c);
          });
        } else {
          var inner = el("span", innerCls, part);
          inner.style.setProperty("--i", i++);
          w.appendChild(inner);
        }
        frag.appendChild(w);
      });
      t.parentNode.replaceChild(frag, t);
    });
    return i;
  }
  function label(e) { if (!e.getAttribute("aria-label")) e.setAttribute("aria-label", e.textContent.replace(/\s+/g, " ").trim()); }

  if (!RM) {
    step("слова", function () { $$('[data-anim="words"]').forEach(function (e) { label(e); splitWords(e, "mz-i"); }); });
    step("літери", function () { $$('[data-anim="letters"]').forEach(function (e) { label(e); splitWords(e, "", true); }); });
    step("скраб", function () {
      $$('[data-anim="scrub"]').forEach(function (e) {
        label(e);
        textNodes(e).forEach(function (t) {
          if (!t.nodeValue.trim()) return;
          var frag = D.createDocumentFragment();
          t.nodeValue.split(/( +)/).forEach(function (part) {
            if (!part) return;
            if (/^ +$/.test(part)) frag.appendChild(D.createTextNode(" "));
            else frag.appendChild(el("span", "mz-s", part));
          });
          t.parentNode.replaceChild(frag, t);
        });
      });
    });
    // Заголовок першого екрана: рядки за <br>, числа всередині рахуються від нуля.
    step("рядки", function () {
      $$('[data-anim="lines"]').forEach(function (e) {
        label(e);
        var lines = [[]];
        Array.prototype.slice.call(e.childNodes).forEach(function (n) {
          if (n.nodeName === "BR") lines.push([]); else lines[lines.length - 1].push(n);
        });
        e.textContent = "";
        lines.forEach(function (nodes, i) {
          var line = el("span", "mz-line"), li = el("span", "mz-li");
          li.style.setProperty("--i", i);
          nodes.forEach(function (n) { li.appendChild(n); });
          textNodes(li).forEach(function (t) {
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
          line.appendChild(li);
          e.appendChild(line);
        });
      });
    });
  }

  /* ---------- лічильники ---------- */
  function countTo(node, to, ms, prefix, suffix) {
    var t0 = null;
    function frame(t) {
      if (t0 === null) t0 = t;
      var k = clamp((t - t0) / ms, 0, 1), e = 1 - Math.pow(1 - k, 4);
      node.textContent = (prefix || "") + Math.round(to * e) + (suffix || "");
      if (k < 1) W.requestAnimationFrame(frame);
    }
    W.requestAnimationFrame(frame);
  }
  var counters = [];
  step("лічильники", function () {
    if (RM) return;
    $$("[data-count]").forEach(function (e) {
      var m = e.textContent.match(/^(\D*?)(\d+)([\s\S]*)$/);
      if (!m) return;
      // ширина фіксується за кінцевим значенням, щоб сусіди не стрибали
      e.style.minWidth = e.getBoundingClientRect().width + "px";
      counters.push({ el: e, pre: m[1], to: parseInt(m[2], 10), suf: m[3], done: false });
      e.textContent = m[1] + "0" + m[3];
    });
  });

  /* ---------- поява при скролі ---------- */
  step("поява", function () {
    if (RM || !("IntersectionObserver" in W)) {
      $$("[data-anim], [data-shot], .mz-plate").forEach(function (e) { e.classList.add("is-in"); });
      return;
    }
    // сусідні елементи одного ряду з'являються по черзі
    $$(".mz-plates, .mz-stops, .mz-facts, .mz-fig-shots, .mz-quotes").forEach(function (group) {
      Array.prototype.slice.call(group.children).forEach(function (c, i) { c.style.setProperty("--d", i * 0.12 + "s"); });
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        var e = en.target;
        e.classList.add("is-in");
        io.unobserve(e);
        if (e.hasAttribute("data-shot")) W.setTimeout(function () { e.classList.add("is-set"); }, 1300);
        counters.forEach(function (c) {
          if (c.done || !(c.el === e || e.contains(c.el))) return;
          c.done = true;
          countTo(c.el, c.to, 1500, c.pre, c.suf);
        });
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.12 });
    $$('[data-anim="words"], [data-anim="letters"], [data-anim="reveal"], [data-shot]').forEach(function (e) {
      if (e.closest(".mz-hero")) return; // перший екран веде заставка
      io.observe(e);
    });
  });

  /* ---------- фонове відео першого екрана ---------- */
  step("відео", function () {
    var hero = $(".mz-hero[data-video]");
    if (!hero || RM) return;
    var poster = $(".mz-hero-poster", hero);
    var v = el("video", "mz-hero-video");
    v.muted = true; v.loop = true; v.playsInline = true; v.autoplay = true;
    v.setAttribute("muted", ""); v.setAttribute("playsinline", ""); v.setAttribute("preload", "auto");
    v.setAttribute("aria-hidden", "true");
    v.src = hero.getAttribute("data-video");
    v.addEventListener("playing", function () { v.classList.add("is-on"); });
    hero.insertBefore(v, poster ? poster.nextSibling : hero.firstChild);
    var p = v.play();
    if (p && p.catch) p.catch(function () {});
  });

  /* ---------- карта маршруту ---------- */
  var route = null;
  var PINS = [
    { x: 46.43, y: 23.84, cls: "mz-lbl-above", at: 0.0 },
    { x: 65.08, y: 32.85, cls: "mz-lbl-right", at: 0.34 },
    { x: 3.15, y: 49.02, cls: "mz-lbl-below", dy: 5.3, at: 0.7 },
    { x: 14.64, y: 52.67, cls: "mz-lbl-between", dx: 2.2, dy: -6.05, at: 0.86 },
  ];
  // області: Київщина, Київ, Закарпаття, Івано-Франківщина, Полтавщина (порядок у map.svg)
  var OBL_AT = [0.02, 0.02, 0.66, 0.84, 0.3];
  var STOP_AT = [0.04, 0.34, 0.7, 0.86, 0.97];
  var BACK = "M125.3 298.1C190 304 300 250 392.4 136.4";

  function buildMap(box, svgText) {
    var src = new DOMParser().parseFromString(svgText, "image/svg+xml");
    function d(id) { var p = src.querySelector('[id="' + id + '"]'); return p ? p.getAttribute("d") : ""; }
    var NS = "http://www.w3.org/2000/svg";
    function node(tag, attrs, parent) {
      var n = D.createElementNS(NS, tag);
      Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
      if (parent) parent.appendChild(n);
      return n;
    }
    var svg = node("svg", { viewBox: "2.35 2.39 840 562", "class": "mz-map", fill: "none", "aria-hidden": "true" });
    node("path", { d: d("ukraine outline"), stroke: "#000", "stroke-width": 3, "stroke-linejoin": "round" }, svg);
    node("path", { d: d("ukraine"), fill: "#FFF9D9" }, svg);
    var obls = (d("oblasts on route").match(/M[^M]*/g) || []).map(function (sub) {
      return node("path", { d: sub, fill: "#FFC08A", "class": "mz-obl" }, svg);
    });
    node("path", { d: d("oblast borders"), stroke: "#000", "stroke-width": 0.75, "stroke-linejoin": "round" }, svg);
    var line = { stroke: "#000", "stroke-linecap": "round", "stroke-linejoin": "round" };
    var mask = node("mask", { id: "mz-back-mask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 843, height: 574 }, svg);
    var backDraw = node("path", { d: BACK, stroke: "#fff", "stroke-width": 8, "stroke-linecap": "round" }, mask);
    node("path", Object.assign({ d: BACK, "stroke-width": 2.5, "stroke-dasharray": "10 9", mask: "url(#mz-back-mask)" }, line), svg);
    var loop = node("path", Object.assign({ d: d("loop kyiv-region"), "stroke-width": 5 }, line), svg);
    var out = node("path", Object.assign({ d: d("route out"), "stroke-width": 5 }, line), svg);
    box.appendChild(svg);

    var names = (box.getAttribute("data-pins") || "").split("|");
    var pins = PINS.map(function (p, i) {
      var dot = el("div", "mz-pin");
      dot.style.left = p.x + "%"; dot.style.top = p.y + "%";
      var lbl = el("div", "mz-lbl " + p.cls, names[i] || "");
      lbl.style.left = (p.x + (p.dx || 0)) + "%"; lbl.style.top = (p.y + (p.dy || 0)) + "%";
      box.appendChild(dot); box.appendChild(lbl);
      return { dot: dot, lbl: lbl, at: p.at };
    });

    var paths = [
      { p: loop, from: 0.0, to: 0.14 },
      { p: out, from: 0.14, to: 0.86 },
      { p: backDraw, from: 0.86, to: 1.0 },
    ];
    paths.forEach(function (x) {
      x.len = x.p.getTotalLength();
      x.p.setAttribute("stroke-dasharray", x.len + " " + x.len);
      x.p.setAttribute("stroke-dashoffset", RM ? 0 : x.len);
    });
    route = { box: box, paths: paths, obls: obls, pins: pins, stops: $$(".mz-stops .mz-stop"), last: -1 };
    if (RM) drawRoute(1);
  }
  function drawRoute(p) {
    if (!route || Math.abs(p - route.last) < 0.002) return;
    route.last = p;
    route.paths.forEach(function (x) {
      var k = clamp((p - x.from) / (x.to - x.from), 0, 1);
      x.p.setAttribute("stroke-dashoffset", x.len * (1 - k));
    });
    route.obls.forEach(function (o, i) { o.classList.toggle("is-on", p >= (OBL_AT[i] == null ? 0 : OBL_AT[i])); });
    route.pins.forEach(function (x) { var on = p >= x.at && p > 0.001; x.dot.classList.toggle("is-on", on); x.lbl.classList.toggle("is-on", on); });
    route.stops.forEach(function (s, i) { s.classList.toggle("is-on", p >= (STOP_AT[i] == null ? 1 : STOP_AT[i])); });
  }
  step("карта", function () {
    var box = $("[data-map]");
    if (!box) return;
    fetch(box.getAttribute("data-map")).then(function (r) { return r.text(); }).then(function (t) {
      step("карта: побудова", function () { buildMap(box, t); onScroll(); });
    }).catch(function (e) { console.error("[mazda] карта", e); });
  });

  /* ---------- скрол: скраб тексту, паралакс, маршрут, індикатор ---------- */
  var bar = null, scrubs = [], floats = [], ticking = false;
  step("скрол: підготовка", function () {
    if (RM) return;
    bar = el("div", "mz-bar"); D.body.appendChild(bar);
    scrubs = $$('[data-anim="scrub"]').map(function (e) { return { el: e, words: $$(".mz-s", e) }; });
    $$("[data-shot]").forEach(function (e, i) { floats.push({ el: e, k: i % 2 ? -0.07 : 0.05 }); });
    $$(".mz-plate-img").forEach(function (e) { floats.push({ el: e, k: -0.06 }); });
    $$(".mz-handling-bg").forEach(function (e) { floats.push({ el: e, k: -0.1 }); });
    $$(".mz-hero-poster, .mz-hero-video").forEach(function (e) { floats.push({ el: e, k: -0.18, top: true }); });
  });
  function onScroll() {
    ticking = false;
    var vh = W.innerHeight, y = W.pageYOffset;
    if (bar) bar.style.transform = "scaleX(" + clamp(y / Math.max(1, D.documentElement.scrollHeight - vh), 0, 1) + ")";
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var p = clamp((vh * 0.88 - r.top) / (vh * 0.5 + r.height), 0, 1);
      var n = Math.round(p * s.words.length);
      s.words.forEach(function (w, i) { w.classList.toggle("is-lit", i < n); });
    });
    floats.forEach(function (f) {
      var r = f.el.parentNode.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) return;
      var off = f.top ? -r.top : (r.top + r.height / 2 - vh / 2);
      f.el.style.setProperty("--mz-py", (off * f.k).toFixed(1) + "px");
    });
    if (route && !RM) {
      var m = route.box.getBoundingClientRect();
      drawRoute(clamp((vh * 0.78 - m.top) / (m.height * 0.75 + vh * 0.12), 0, 1));
    }
  }
  function requestTick() { if (!ticking) { ticking = true; W.requestAnimationFrame(onScroll); } }
  W.addEventListener("scroll", requestTick, { passive: true });
  W.addEventListener("resize", requestTick);

  /* ---------- заставка першого екрана ---------- */
  function heroIn() {
    H.classList.add("mz-ready");
    $$(".mz-hero [data-anim]").forEach(function (e) { e.classList.add("is-in"); });
    $$(".mz-hero .mz-num").forEach(function (n) { countTo(n, parseInt(n.getAttribute("data-to"), 10), 1500); });
    requestTick();
  }
  step("заставка", function () {
    var stamp = $(".mz-hero-stamp");
    if (RM || !stamp) { heroIn(); return; }
    var intro = el("div", "mz-curtain");
    var slot = el("div", "mz-curtain-slot");
    var count = el("div", "mz-curtain-count", "0 км");
    var cap = el("div", "mz-curtain-cap", (D.querySelector(".mz-hero-sub") || {}).textContent || "");
    intro.appendChild(slot); intro.appendChild(count); intro.appendChild(cap);
    D.body.appendChild(intro);
    var fly = stamp.cloneNode(false);
    fly.className = "mz-stamp-fly";
    fly.removeAttribute("loading");
    D.body.appendChild(fly);

    function place(rect, extra) {
      fly.style.width = rect.width + "px";
      fly.style.height = rect.height + "px";
      fly.style.transform = "translate(" + rect.left + "px," + rect.top + "px) " + (extra || "");
    }
    var s = slot.getBoundingClientRect();
    fly.style.opacity = "0";
    place(s, "scale(2.4) rotate(-9deg)");
    fly.style.transformOrigin = "50% 50%";
    void fly.offsetWidth;
    // 1) штамп «пресується» по центру
    fly.style.transition = "transform 0.34s cubic-bezier(0.2, 1.6, 0.4, 1), opacity 0.12s linear";
    fly.style.opacity = "1";
    place(s, "scale(1) rotate(-3deg)");
    W.setTimeout(function () { intro.classList.add("is-shake", "is-on"); }, 300);
    // 2) лічильник кілометрів
    W.setTimeout(function () { countTo(count, 2500, 1100, "", " км"); }, 380);
    // 3) завіса їде вгору, штамп летить на своє місце в заголовку
    var done = false;
    function finish() {
      if (done) return; done = true;
      W.scrollTo(0, W.pageYOffset); // без змін, лише щоб перерахувати розкладку
      var target = stamp.getBoundingClientRect();
      fly.style.transformOrigin = "0 0";
      fly.style.transition = "transform 0.95s cubic-bezier(0.76, 0, 0.24, 1), width 0.95s cubic-bezier(0.76, 0, 0.24, 1), height 0.95s cubic-bezier(0.76, 0, 0.24, 1)";
      place(target, "");
      intro.classList.remove("is-shake");
      intro.classList.add("is-out");
      heroIn();
      W.setTimeout(function () {
        if (fly.parentNode) fly.parentNode.removeChild(fly);
        if (intro.parentNode) intro.parentNode.removeChild(intro);
        H.classList.add("mz-intro-done");
      }, 1050);
    }
    W.setTimeout(finish, 1750);
    W.addEventListener("scroll", function early() { W.removeEventListener("scroll", early); if (W.pageYOffset > 40) finish(); }, { passive: true });
  });

  requestTick();
})();
