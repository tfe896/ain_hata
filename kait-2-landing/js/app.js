/* AIN × MII — «Автономна далекобійна зброя РФ», версія 2 (КАЙТ 2.0).
   Скрипт знаходить елементи лише за data-атрибутами, тому тексти, цифри, посилання, фото й відео можна вільно міняти в Designer.

   data-terrain         перший екран: рельєф зі смужок, політ, приціл що «захоплює» піки (керується курсором)
   data-anim="redact"   заголовок: смужка закреслює кожне слово і відкриває його («розсекречування»)
   data-anim="words"    рядок з'являється по словах
   data-anim="reveal"   блок плавно з'являється
   data-anim="scrub"    текст «запалюється» слово за словом під час скролу
   data-count           число рахує від нуля ("400+ ГБ", "~30 000", "50 000+")
   data-bar / data-max  смужковий стовпчик: ширина = data-bar / data-max
   data-img             фото відкривається скан-лінією (повний кадр, нічого не обрізається)
   data-marquee="l|r"   бігучий рядок
   data-scene           закріплена сцена «людина в петлі»: [data-diagram] і [data-step] перемикаються скролом
   data-video           відео: data-name="файл" (папка video/), data-ratio="16/9"; повний кадр, звук лишається, грає на екрані
   data-target="Назва"  мітка прицілу під курсором
   mark.hl              скрипт сам підсвічує числа з одиницями (лише обгортка, текст не змінюється)

   Кожен крок ізольований: помилка пишеться в консоль як [kait2] і не зупиняє решту. Скрол ніколи не блокується. */
(function () {
  "use strict";
  var d = document, w = window, root = d.documentElement;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = w.matchMedia && w.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var failed = [], scrollFns = [];
  var stagePinned = function () { return false; };
  function step(name, fn) {
    try { fn(); } catch (e) { failed.push(name); if (w.console) console.error("[kait2] " + name + " failed", e); }
  }
  var base = (function () {
    var s = d.currentScript;
    return s && s.src ? s.src.replace(/js\/[^\/]*(\?.*)?$/, "") : "";
  })();

  if (!reduce) root.classList.add("js-anim");
  var safety = setTimeout(function () { root.classList.remove("js-anim"); }, 7000);

  var io = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }) : null;
  function watch(el) { if (io) io.observe(el); else el.classList.add("is-in"); }

  function stagger(list) {
    var groups = new Map();
    list.forEach(function (e) { var p = e.parentNode; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(e); });
    groups.forEach(function (g) { g.forEach(function (e, k) { e.style.setProperty("--d", String(Math.min(k, 4))); }); });
  }

  /* --- розбір тексту на слова --- */
  function wrapTextWords(el, mode, counter) {
    var nodes = [], tw = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      var parts = t.nodeValue.split(/(\s+)/), frag = d.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(" ")); return; }
        if (mode === "w" || mode === "rw") {
          var o = d.createElement("span"), i = d.createElement(mode === "w" ? "span" : "i");
          o.className = mode; if (mode === "w") i.className = "wi";
          i.textContent = p;
          o.style.setProperty("--i", String(counter.i)); i.style.setProperty("--i", String(counter.i)); counter.i++;
          o.appendChild(i); frag.appendChild(o);
        } else {
          var s = d.createElement("span"); s.className = "sw"; s.textContent = p;
          counter.list.push(s); frag.appendChild(s);
        }
      });
      t.parentNode.replaceChild(frag, t);
    });
  }
  step("redact", function () {
    $$('[data-anim="redact"]').forEach(function (el) {
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      wrapTextWords(el, "rw", { i: 0 });
      $$(".rw", el).forEach(function (x) { x.setAttribute("aria-hidden", "true"); });
      watch(el);
    });
  });
  step("words", function () {
    $$('[data-anim="words"]').forEach(function (el) {
      el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
      wrapTextWords(el, "w", { i: 0 });
      $$(".w", el).forEach(function (x) { x.setAttribute("aria-hidden", "true"); });
      watch(el);
    });
  });
  step("reveal", function () {
    var list = $$('[data-anim="reveal"]');
    stagger(list.filter(function (e) { return e.matches(".stat"); }));
    list.forEach(watch);
  });

  /* --- підсвітка слів під час скролу --- */
  var scrubs = [];
  step("scrub", function () {
    $$('[data-anim="scrub"]').forEach(function (el) {
      var c = { list: [] };
      wrapTextWords(el, "sw", c);
      scrubs.push({ el: el, words: c.list, stage: !!(el.closest && el.closest("[data-stage]")) });
    });
  });
  scrollFns.push(function () {
    var vh = w.innerHeight;
    scrubs.forEach(function (s) {
      if (s.stage && stagePinned()) return;
      var r = s.el.getBoundingClientRect();
      if (r.bottom < -50 || r.top > vh + 50) { if (r.top > vh) return; }
      var p = clamp((vh * 0.88 - r.top) / (r.height + vh * 0.12), 0, 1);
      var upto = Math.round(p * s.words.length);
      s.words.forEach(function (x, i) { x.classList.toggle("on", i < upto); });
    });
  });

  /* --- підсвітка чисел з одиницями (лише обгортка, текст не змінюється) --- */
  step("marks", function () {
    var re = /(\d[\d  ]*(?:,\d+)?(?:[–-]\d[\d  ]*(?:,\d+)?)?\s?(?:млн рублів|тис\. рублів|тисяч|млн|кг|км\/год|км|ГБ|GHz|MHz|Gb|Mb|%|годин|метрів|метра|пікселів|ліцензій|авторів))/g;
    $$(".p, .mode-p, .li").forEach(function (el) {
      var nodes = [], tw = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
      while ((n = tw.nextNode())) nodes.push(n);
      nodes.forEach(function (t) {
        var v = t.nodeValue;
        re.lastIndex = 0;
        if (!re.test(v)) return;
        re.lastIndex = 0;
        var frag = d.createDocumentFragment(), last = 0, m;
        while ((m = re.exec(v))) {
          if (m.index > last) frag.appendChild(d.createTextNode(v.slice(last, m.index)));
          var mk = d.createElement("mark");
          mk.className = "hl"; mk.textContent = m[0];
          frag.appendChild(mk);
          last = m.index + m[0].length;
        }
        if (last < v.length) frag.appendChild(d.createTextNode(v.slice(last)));
        t.parentNode.replaceChild(frag, t);
      });
    });
  });

  /* --- лічильники --- */
  step("counters", function () {
    var items = [];
    $$("[data-count]").forEach(function (el) {
      var t = el.firstChild;
      while (t && t.nodeType !== 3) t = t.nextSibling;
      if (!t) return;
      var m = t.nodeValue.match(/^([^\d]*)(\d{1,3}(?:[\s  ]\d{3})+|\d+)(,\d+)?([\s\S]*)$/);
      if (!m) return;
      var raw = m[2].replace(/[\s  ]/g, ""), dec = m[3] ? m[3].length - 1 : 0;
      var to = parseFloat(raw + (m[3] ? "." + m[3].slice(1) : ""));
      var sep = /[\s  ]/.test(m[2]) ? " " : "";
      var pre = m[1], suf = m[4];
      var fmt = function (v) {
        var s = v.toFixed(dec).split(".");
        if (sep) s[0] = s[0].replace(/\B(?=(\d{3})+(?!\d))/g, sep);
        return pre + s[0] + (dec ? "," + s[1] : "") + suf;
      };
      el.setAttribute("aria-label", t.nodeValue.trim());
      if (!reduce) t.nodeValue = fmt(0);
      items.push({ el: el, t: t, to: to, fmt: fmt, done: false });
    });
    if (reduce) return;
    var cio = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var it = items.filter(function (x) { return x.el === e.target; })[0];
        cio.unobserve(e.target);
        if (!it || it.done) return;
        it.done = true;
        var t0 = performance.now(), dur = 2000;
        (function tick(now) {
          var k = clamp((now - t0) / dur, 0, 1), v = 1 - Math.pow(1 - k, 4);
          it.t.nodeValue = it.fmt(it.to * v);
          if (k < 1) requestAnimationFrame(tick); else it.t.nodeValue = it.fmt(it.to);
        })(t0);
      });
    }, { threshold: 0.6 }) : null;
    items.forEach(function (it) { if (cio) cio.observe(it.el); else it.t.nodeValue = it.fmt(it.to); });
  });

  /* --- стовпчики --- */
  step("bars", function () {
    var bars = $$("[data-bar]");
    bars.forEach(function (b, i) { b.style.setProperty("--d", String(i % 8)); });
    var bio = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var b = e.target, v = parseFloat(b.getAttribute("data-bar")), m = parseFloat(b.getAttribute("data-max")) || v;
        b.style.width = clamp(v / m, 0, 1) * 100 + "%";
        bio.unobserve(b);
      });
    }, { threshold: 0.5 }) : null;
    bars.forEach(function (b) {
      if (bio) bio.observe(b);
      else { var v = parseFloat(b.getAttribute("data-bar")), m = parseFloat(b.getAttribute("data-max")) || v; b.style.width = v / m * 100 + "%"; }
    });
  });

  /* --- фото: скан-лінія; легкий дрейф усієї рамки (нічого не обрізається) --- */
  var figs = [];
  step("images", function () {
    $$("[data-img]").forEach(watch);
    if (!reduce) figs = $$("[data-img]");
  });
  scrollFns.push(function () {
    var vh = w.innerHeight;
    figs.forEach(function (f) {
      var r = f.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var k = clamp(((r.top + r.height / 2) - vh / 2) / vh, -1, 1);
      f.style.setProperty("--ty", (k * -16).toFixed(1) + "px");
    });
  });

  /* --- бігучі рядки --- */
  step("marquees", function () {
    $$("[data-marquee]").forEach(function (m) {
      var tr = m.querySelector(".track") || m;
      var items = $$(":scope > *", tr).map(function (x) { return x.textContent.replace(/\s+/g, " ").trim(); }).filter(Boolean);
      if (!items.length) return;
      var n = 6;
      tr.textContent = "";
      for (var k = 0; k < n; k++)
        items.forEach(function (t) { var s = d.createElement("span"); s.textContent = t; tr.appendChild(s); });
      tr.style.setProperty("--n", String(n));
      tr.style.setProperty("--dur", Math.round(items.length * 10) + "s");
      if (m.getAttribute("data-marquee") === "r") tr.style.animationDirection = "reverse";
      m.setAttribute("aria-hidden", "true");
    });
  });

  /* --- закріплена сцена «людина в петлі» --- */
  step("scene", function () {
    $$("[data-scene]").forEach(function (sc) {
      var dg = sc.querySelector("[data-diagram]"), modes = $$("[data-step]", sc), pin = sc.querySelector(".scene-pin");
      if (!dg || !modes.length) return;
      var cur = -1;
      function set(i) {
        if (i === cur) return;
        cur = i;
        dg.setAttribute("data-diagram", String(i));
        modes.forEach(function (m, k) { m.classList.toggle("on", k === i); });
      }
      set(0);
      var pinned = function () { return pin && getComputedStyle(pin).position === "sticky"; };
      scrollFns.push(function () {
        if (!pinned()) return;
        var r = sc.getBoundingClientRect(), total = r.height - w.innerHeight;
        var p = total > 0 ? clamp(-r.top / total, 0, 0.999) : 0;
        set(Math.min(modes.length - 1, Math.floor(p * modes.length)));
      });
      if ("IntersectionObserver" in w) {
        var mio = new IntersectionObserver(function (es) {
          if (pinned()) return;
          es.forEach(function (e) { if (e.isIntersecting) set(modes.indexOf(e.target)); });
        }, { rootMargin: "-40% 0px -40% 0px" });
        modes.forEach(function (m) { mio.observe(m); });
      }
    });
  });

  /* --- глави: заповнення рейки, паралакс смужок на панелі --- */
  step("chapters", function () {
    var grids = $$(".chap-grid"), heads = $$(".chap-head-g, .chap-head-k");
    scrollFns.push(function () {
      var vh = w.innerHeight;
      grids.forEach(function (g) {
        var r = g.getBoundingClientRect(), fill = g.querySelector(".rail-fill");
        if (!fill || r.bottom < -50 || r.top > vh) return;
        fill.style.height = clamp((vh * 0.55 - r.top) / r.height, 0, 1) * 100 + "%";
      });
      heads.forEach(function (h) {
        var r = h.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        h.style.setProperty("--ps", (((r.top + r.height / 2) - vh / 2) * -0.22).toFixed(1) + "px");
      });
    });
  });

  /* --- бічний індекс глав --- */
  step("edge", function () {
    var chs = $$("section.chap[id]");
    if (chs.length < 2) return;
    var nav = d.createElement("nav");
    nav.className = "edge"; nav.setAttribute("aria-label", "Глави");
    var links = chs.map(function (c, i) {
      var a = d.createElement("a"), t = c.querySelector(".chap-title");
      a.href = "#" + c.id;
      a.innerHTML = "<b></b>";
      a.querySelector("b").textContent = (i + 1 < 10 ? "0" : "") + (i + 1) + " · " + (t ? t.textContent.replace(/\s+/g, " ").trim().slice(0, 30) : "");
      nav.appendChild(a);
      return a;
    });
    d.body.appendChild(nav);
    if (!("IntersectionObserver" in w)) return;
    var eio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var idx = chs.indexOf(e.target);
        links.forEach(function (a, k) { a.classList.toggle("on", k === idx); a.classList.toggle("past", k < idx); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    chs.forEach(function (c) { eio.observe(c); });
  });

  /* --- відео: повний кадр, звук лишається; рамка-візир і таймкод --- */
  step("videos", function () {
    var vids = $$("video[data-video]");
    if (!vids.length) return;
    function tc(t) {
      var s = Math.floor(t), m = Math.floor(s / 60), h = Math.floor(m / 60), f = Math.floor((t - s) * 25);
      var p = function (n) { return (n < 10 ? "0" : "") + n; };
      return p(h) + ":" + p(m % 60) + ":" + p(s % 60) + ":" + p(f);
    }
    vids.forEach(function (v) {
      var name = v.getAttribute("data-name"), ratio = v.getAttribute("data-ratio");
      if (name && base) {
        v.setAttribute("poster", base + "poster/" + name + ".jpg");
        v.setAttribute("data-src", base + "video/" + name + ".mp4");
      }
      if (ratio) v.style.aspectRatio = ratio;
      v.muted = true; v.setAttribute("playsinline", ""); v.setAttribute("controls", "");
      var fr = d.createElement("div");
      fr.className = "vid-frame";
      v.parentNode.insertBefore(fr, v); fr.appendChild(v);
      var hud = d.createElement("div");
      hud.className = "vid-tc"; hud.innerHTML = "<i></i><span>00:00:00:00</span>";
      fr.appendChild(hud);
      var sp = hud.querySelector("span");
      v.addEventListener("timeupdate", function () { sp.textContent = tc(v.currentTime); });
    });
    if (reduce || !("IntersectionObserver" in w)) {
      vids.forEach(function (v) { var s = v.getAttribute("data-src"); if (s) v.src = s; });
      return;
    }
    var vio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) {
          if (!v.src && v.getAttribute("data-src")) v.src = v.getAttribute("data-src");
          var p = v.play(); if (p && p.catch) p.catch(function () {});
        } else v.pause();
      });
    }, { threshold: 0.4 });
    vids.forEach(function (v) { vio.observe(v); });
  });

  /* --- перший екран: рельєф зі смужок. Політ над місцевістю, приціл «захоплює» піки.
         Курсор = оператор: веде приціл і кермує; без курсора система обирає цілі сама. --- */
  step("terrain", function () {
    var host = $$("[data-terrain]")[0];
    if (!host) return;
    var cv = d.createElement("canvas"), ctx = cv.getContext("2d");
    if (!ctx) return;
    cv.className = "terrain"; cv.setAttribute("aria-hidden", "true");
    host.insertBefore(cv, host.firstChild);
    var W = 0, H = 0, dpr = 1, R = 44, STEP = 7, run = false, last = performance.now(), zt = 5.3;
    var px = 0.62, py = 0.5, tpx = px, tpy = py, lastMove = -1e9;
    var lk = { x: 0, y: 0, r: 80, tid: null, ax: 0.6, init: false };
    function hash(i, j) { var n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return n - Math.floor(n); }
    function sm(t) { return t * t * (3 - 2 * t); }
    function noise(x, z) {
      var i = Math.floor(x), j = Math.floor(z), fx = x - i, fz = z - j;
      var a = hash(i, j), b = hash(i + 1, j), c = hash(i, j + 1), dd = hash(i + 1, j + 1), u = sm(fx), v = sm(fz);
      return a + (b - a) * u + (c - a) * v + (a - b - c + dd) * u * v;
    }
    function field(x, z) { return noise(x * 0.9, z * 0.9) * 0.62 + noise(x * 2.1 + 7, z * 2.1 + 3) * 0.28 + noise(x * 4.4 + 1, z * 4.4 + 9) * 0.1; }
    function size() {
      dpr = Math.min(w.devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var small = W < 760; R = small ? 30 : 44; STEP = small ? 10 : 7;
    }
    function pad(n, k) { n = String(Math.abs(Math.round(n))); while (n.length < k) n = "0" + n; return n; }
    function draw(now) {
      ctx.clearRect(0, 0, W, H);
      var operator = now - lastMove < 2800;
      var horizon = H * 0.2, bottom = H * 1.0;
      /* небо: смуги брендового мотиву, що густішають до горизонту */
      ctx.lineWidth = 1;
      for (var s = 0; s < 9; s++) {
        var sy = H * 0.09 + (horizon - H * 0.09) * Math.pow(s / 8, 0.8) * 0.94;
        ctx.strokeStyle = "rgba(85,191,172," + (0.05 + 0.16 * s / 8) + ")";
        ctx.beginPath(); ctx.moveTo(0, sy); ctx.lineTo(W, sy); ctx.stroke();
      }
      var frac = ((zt % 1) + 1) % 1, baseId = Math.floor(zt), cam = (px - 0.5) * 5.2;
      var cols = Math.ceil(W / STEP) + 1;
      /* ціль: світовий рядок, який «приліта» назустріч */
      var jf = lk.tid === null ? -1 : zt - lk.tid;
      if (lk.tid === null || jf > R * 0.9) {
        lk.tid = baseId - Math.round(R * (0.2 + Math.random() * 0.12));
        lk.ax = 0.28 + Math.random() * 0.5;
        jf = zt - lk.tid;
      }
      var wantX = (operator ? px : lk.ax + Math.sin(now / 5200) * 0.06) * W;
      var tj = Math.floor(jf), tx = wantX, ty = 0, tw = 0;
      for (var j = 0; j < R; j++) {
        var dpt = (j + frac) / R, yb = horizon + (bottom - horizon) * Math.pow(dpt, 1.75);
        var amp = H * 0.3 * Math.pow(dpt, 1.05) + H * 0.02, zw = (baseId - j) * 0.42;
        var isT = j === tj, bestY = 1e9, bestX = 0;
        ctx.beginPath();
        for (var c = 0; c < cols; c++) {
          var x = c * STEP, xw = x / W * 6 + cam * 1.3 * dpt;
          var y = yb - amp * (field(xw, zw) - 0.38);
          if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
          if (isT && Math.abs(x - wantX) < 170 && y < bestY) { bestY = y; bestX = x; }
        }
        if (isT && bestY < 1e8) { tx = bestX; ty = bestY; tw = (baseId - j) * 0.42; }
        ctx.lineTo(W, H + 4); ctx.lineTo(0, H + 4); ctx.closePath();
        ctx.fillStyle = "#0C5350"; ctx.fill();
        /* лінія поверх заливки: нижня частина контуру не потрібна, малюємо лише верхню */
        ctx.beginPath();
        for (c = 0; c < cols; c++) {
          x = c * STEP; xw = x / W * 6 + cam * 1.3 * dpt;
          y = yb - amp * (field(xw, zw) - 0.38);
          if (c === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        var a = 0.1 + 0.8 * Math.pow(dpt, 0.9);
        ctx.lineWidth = 0.7 + 1.9 * dpt;
        ctx.strokeStyle = isT ? "rgba(252,232,129," + (0.55 + a * 0.45) + ")" : "rgba(85,191,172," + a + ")";
        ctx.stroke();
      }
      /* затемнення знизу: текст першого екрана завжди читається */
      var gr = ctx.createLinearGradient(0, H * 0.42, 0, H);
      gr.addColorStop(0, "rgba(12,83,80,0)"); gr.addColorStop(0.55, "rgba(12,83,80,0.72)"); gr.addColorStop(1, "rgba(12,83,80,0.9)");
      ctx.fillStyle = gr; ctx.fillRect(0, H * 0.42, W, H * 0.58 + 4);
      /* приціл */
      if (ty > 0) {
        if (!lk.init) { lk.x = tx; lk.y = ty; lk.init = true; }
        lk.x += (tx - lk.x) * 0.16; lk.y += (ty - lk.y) * 0.16;
        var rr = 18 + 44 * clamp(jf / R, 0, 1), L = rr * 0.5;
        lk.r += (rr - lk.r) * 0.2;
        var r = lk.r, X = lk.x, Y = lk.y - r * 0.2;
        ctx.save();
        ctx.strokeStyle = "#FCE881"; ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(X - r, Y - r + L); ctx.lineTo(X - r, Y - r); ctx.lineTo(X - r + L, Y - r);
        ctx.moveTo(X + r - L, Y - r); ctx.lineTo(X + r, Y - r); ctx.lineTo(X + r, Y - r + L);
        ctx.moveTo(X + r, Y + r - L); ctx.lineTo(X + r, Y + r); ctx.lineTo(X + r - L, Y + r);
        ctx.moveTo(X - r + L, Y + r); ctx.lineTo(X - r, Y + r); ctx.lineTo(X - r, Y + r - L);
        ctx.stroke();
        ctx.setLineDash([3, 6]); ctx.globalAlpha = 0.55;
        ctx.beginPath(); ctx.moveTo(X, 0); ctx.lineTo(X, Y - r - 6); ctx.moveTo(X, Y + r + 6); ctx.lineTo(X, H); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, Y); ctx.lineTo(X - r - 6, Y); ctx.moveTo(X + r + 6, Y); ctx.lineTo(W, Y); ctx.stroke();
        ctx.setLineDash([]); ctx.globalAlpha = 1;
        ctx.fillStyle = "#FCE881"; ctx.fillRect(X - 2, Y - 2, 4, 4);
        ctx.font = "600 12px 'JetBrains Mono', monospace";
        ctx.fillText(pad(X / W * 1000, 4) + " / " + pad(tw * 100, 4), X + r + 10, Y - r + 12);
        ctx.fillStyle = operator ? "#FCE881" : "#55BFAC";
        ctx.fillRect(X + r + 10, Y - r + 22, operator ? 26 : 14, 3);
        ctx.restore();
      }
    }
    function frame(now) {
      if (!run) return;
      var dt = Math.min(0.05, (now - last) / 1000); last = now;
      var operator = now - lastMove < 2800;
      zt += dt * (0.55 + (operator ? (0.5 - tpy) * 0.9 : 0));
      px += (tpx - px) * 0.05; py += (tpy - py) * 0.05;
      draw(now);
      requestAnimationFrame(frame);
    }
    size();
    draw(performance.now());
    if (reduce) return;
    var rz;
    w.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { size(); if (!run) draw(performance.now()); }, 120); });
    host.addEventListener("mousemove", function (e) {
      var b = host.getBoundingClientRect();
      tpx = clamp((e.clientX - b.left) / b.width, 0, 1); tpy = clamp((e.clientY - b.top) / b.height, 0, 1);
      lastMove = performance.now();
    });
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting && !d.hidden;
        if (on && !run) { run = true; last = performance.now(); requestAnimationFrame(frame); } else if (!on) run = false;
      }, { threshold: 0 }).observe(host);
    } else { run = true; requestAnimationFrame(frame); }
  });

  /* --- ракета: 3D-модель, зібрана за ілюстрацією з матеріалу (вид зверху, збоку, у ракурсі).
         Обертається скролом, курсором (або пальцем) і сама. Three.js вантажиться лише коли сцена поруч. --- */
  step("stage", function () {
    var st = $$("[data-stage]")[0];
    if (!st) return;
    var pin = st.querySelector(".stage-pin"), host = st.querySelector("[data-missile]");
    var txt = st.querySelector('[data-anim="scrub"]'), words = null;
    if (!host) return;
    scrubs.forEach(function (s) { if (s.el === txt) words = s.words; });
    var pinned = function () { return !!pin && getComputedStyle(pin).position === "sticky"; };
    stagePinned = pinned;
    function progress() {
      var r = st.getBoundingClientRect(), vh = w.innerHeight;
      if (pinned()) { var total = r.height - vh; return total > 0 ? clamp(-r.top / total, 0, 1) : 0; }
      return clamp((vh - r.top) / (vh + r.height), 0, 1);
    }
    function paintText(p) {
      if (!words || !pinned()) return;
      var upto = Math.round(clamp(p / 0.78, 0, 1) * words.length);
      words.forEach(function (x, i) { x.classList.toggle("on", i < upto); });
    }

    var T = null, ctx = null, hud = {}, loaded = false, near = false, running = false;
    $$("[data-hud]", host).forEach(function (n) { hud[n.getAttribute("data-hud")] = n; });
    var cur = { yaw: -0.8, roll: 0, pit: 0.16 }, tg = { yaw: -0.8, roll: 0, pit: 0.16 }, mx = 0, my = 0, drag = null, dyaw = 0, dpit = 0, t0 = performance.now(), hudT = 0;

    /* модель: пропорції знято з ілюстрації (L ≈ 12 діаметрів; стрілоподібне крило з прямою задньою кромкою, хвостове оперення, бічні обтічники, жовте сопло) */
    function build(THREE) {
      var L = 10, R = 0.415, g = new THREE.Group();
      var X = function (a) { return L * (0.5 - a); };
      var body = new THREE.MeshStandardMaterial({ color: 0xdadcd5, roughness: 0.55, metalness: 0.08 });
      var cone = new THREE.MeshStandardMaterial({ color: 0xc9cdc4, roughness: 0.42, metalness: 0.14 });
      var yel = new THREE.MeshStandardMaterial({ color: 0xfce881, roughness: 0.45, metalness: 0.05, emissive: 0x4a4210, emissiveIntensity: 0.55 });
      var dark = new THREE.MeshStandardMaterial({ color: 0x24282a, roughness: 0.7, metalness: 0.2 });
      function rad(a) {
        if (a < 0.3) { var u = (0.3 - a) / 0.3; return R * Math.sqrt(Math.max(0, 1 - u * u)); }
        if (a <= 0.8) return R;
        var t = (a - 0.8) / 0.155; return R * (1 - 0.3 * Math.pow(Math.min(1, t), 1.4));
      }
      function lathe(a0, a1, n, mat) {
        var pts = [], i, a;
        for (i = 0; i <= n; i++) { a = a0 + (a1 - a0) * i / n; pts.push(new THREE.Vector2(rad(a), X(a))); }
        var geo = new THREE.LatheGeometry(pts, 56); geo.rotateZ(-Math.PI / 2);
        return new THREE.Mesh(geo, mat);
      }
      /* фюзеляж: головний обтічник (a 0…0.15) і корпус (0.15…0.955) */
      g.add(lathe(0.0, 0.15, 26, cone));
      g.add(lathe(0.15, 0.955, 44, body));
      var tailCap = new THREE.Mesh(new THREE.CircleGeometry(rad(0.955), 40), dark); tailCap.rotation.y = -Math.PI / 2; tailCap.position.x = X(0.955) - 0.01; g.add(tailCap);
      /* шов обтічника — жовте кільце */
      var ring = new THREE.Mesh(new THREE.TorusGeometry(rad(0.15) * 1.004, 0.014, 8, 48), yel); ring.rotation.y = Math.PI / 2; ring.position.x = X(0.15); g.add(ring);
      /* сопло */
      var noz = new THREE.Mesh(new THREE.CylinderGeometry(rad(0.955) * 0.98, R * 0.52, L * 0.052, 36, 1, true), yel);
      noz.rotation.z = -Math.PI / 2; noz.position.x = X(0.981); g.add(noz);
      var inner = new THREE.Mesh(new THREE.CircleGeometry(R * 0.5, 32), dark); inner.rotation.y = -Math.PI / 2; inner.position.x = X(1.0) + 0.02; g.add(inner);
      /* плоска пластина: контур у площині (вздовж корпуса, розмах) → товщина */
      function slab(poly, thick, mat, flat) {
        var sh = new THREE.Shape();
        poly.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
        var geo = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.45, bevelSize: thick * 0.45, bevelSegments: 2, steps: 1 });
        geo.translate(0, 0, -thick / 2);
        var m = new THREE.Mesh(geo, mat); if (flat) m.rotation.x = -Math.PI / 2;
        m.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo, 35), new THREE.LineBasicMaterial({ color: 0x0c5350, transparent: true, opacity: 0.55 })));
        return m;
      }
      var S = 2.32;
      g.add(slab([[X(0.475), 0], [X(0.588), S], [X(0.634), S], [X(0.642), 0], [X(0.634), -S], [X(0.588), -S]], 0.1, body, true));
      var St = 1.0;
      g.add(slab([[X(0.852), 0], [X(0.905), St], [X(0.928), St], [X(0.934), 0], [X(0.928), -St], [X(0.905), -St]], 0.075, body, true));
      g.add(slab([[X(0.85), 0.18], [X(0.905), 0.72], [X(0.935), 0.72], [X(0.942), 0.18]], 0.07, yel, false));
      /* бічні обтічники повітрозабірників */
      [-1, 1].forEach(function (s) {
        var f = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16), body);
        f.scale.set(0.46, 0.12, 0.1); f.position.set(X(0.74), -0.05, s * (R - 0.012)); g.add(f);
      });
      /* верхній жовтий люк */
      var hatch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.034, 0.22), yel); hatch.position.set(X(0.545), R + 0.004, 0); g.add(hatch);
      return g;
    }

    function init() {
      var THREE = w.THREE;
      if (!THREE) return fail();
      var cv = d.createElement("canvas"), renderer;
      cv.className = "stage-cv"; cv.setAttribute("aria-hidden", "true");
      try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: "high-performance" }); }
      catch (e) { return fail(); }
      host.insertBefore(cv, host.firstChild);
      renderer.setClearColor(0x000000, 0);
      var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(26, 1, 0.1, 200);
      var rig = new THREE.Group(), roll = new THREE.Group(), yaw = new THREE.Group();
      var missile = build(THREE);
      roll.add(missile); yaw.add(roll); rig.add(yaw); scene.add(rig);
      scene.add(new THREE.HemisphereLight(0xcfeee8, 0x0c5350, 0.5));
      var key = new THREE.DirectionalLight(0xffffff, 1.25); key.position.set(3, 7, 5); scene.add(key);
      var rimT = new THREE.DirectionalLight(0x55bfac, 1.5); rimT.position.set(-6, 2, -5); scene.add(rimT);
      var rimY = new THREE.DirectionalLight(0xfce881, 0.9); rimY.position.set(6, -2, -3); scene.add(rimY);
      /* поворотний круг: кільце з рисками */
      var floor = new THREE.Group(), lm = new THREE.LineBasicMaterial({ color: 0x55bfac, transparent: true, opacity: 0.5 }), i, pts = [];
      for (i = 0; i <= 120; i++) pts.push(new THREE.Vector3(Math.cos(i / 120 * 6.2832) * 5.3, 0, Math.sin(i / 120 * 6.2832) * 5.3));
      floor.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), lm));
      var tk = [];
      for (i = 0; i < 72; i++) { var an = i / 72 * 6.2832, r1 = 5.3, r2 = i % 6 === 0 ? 5.85 : 5.56; tk.push(new THREE.Vector3(Math.cos(an) * r1, 0, Math.sin(an) * r1), new THREE.Vector3(Math.cos(an) * r2, 0, Math.sin(an) * r2)); }
      floor.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(tk), new THREE.LineBasicMaterial({ color: 0xfce881, transparent: true, opacity: 0.55 })));
      var in2 = []; for (i = 0; i <= 120; i++) in2.push(new THREE.Vector3(Math.cos(i / 120 * 6.2832) * 3.6, 0, Math.sin(i / 120 * 6.2832) * 3.6));
      var l2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(in2), new THREE.LineBasicMaterial({ color: 0x55bfac, transparent: true, opacity: 0.22 })); floor.add(l2);
      floor.position.y = -2.3; scene.add(floor);

      function size() {
        var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
        var dpr = Math.min(w.devicePixelRatio || 1, 1.75);
        renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
        cam.aspect = W / H;
        var visW = W < 700 ? 11.4 : 13.4, dist = visW / (2 * Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
        var sh = W < 700 ? 0 : visW * 0.075; cam.position.set(-sh, dist * 0.2, dist); cam.lookAt(-sh, -0.35, 0); cam.updateProjectionMatrix();
      }
      size();
      if ("ResizeObserver" in w) new ResizeObserver(size).observe(host); else w.addEventListener("resize", size);

      function pose() {
        var p = progress();
        paintText(p);
        var idle = reduce ? 0 : (performance.now() - t0) / 1000;
        tg.yaw = -0.85 + p * 1.7 + mx * 0.38 + dyaw;
        tg.pit = 0.16 + my * -0.1 + dpit;
        tg.roll = p * Math.PI * 1.0 + idle * 0.22;
        var k = reduce ? 1 : 0.085;
        cur.yaw += (tg.yaw - cur.yaw) * k; cur.pit += (tg.pit - cur.pit) * k; cur.roll += (tg.roll - cur.roll) * k;
        yaw.rotation.y = cur.yaw; rig.rotation.z = cur.pit; roll.rotation.x = cur.roll;
        floor.rotation.y = -cur.yaw * 0.6 - idle * 0.05;
        var now = performance.now();
        if (now - hudT > 90) {
          hudT = now;
          var dg = function (v) { return Math.round(((v * 180 / Math.PI) % 360 + 360) % 360); }, pad3 = function (n, k2) { n = String(n); while (n.length < k2) n = "0" + n; return n; };
          if (hud.yaw) hud.yaw.textContent = pad3(dg(cur.yaw), 3);
          if (hud.roll) hud.roll.textContent = pad3(dg(cur.roll), 3);
          if (hud.pit) hud.pit.textContent = pad3(Math.round(cur.pit * 180 / Math.PI), 2);
        }
        renderer.render(scene, cam);
      }
      ctx = { pose: pose, renderer: renderer };
      st.classList.add("gl-on");
      /* керування: курсор нахиляє, перетягування крутить */
      if (fine && !reduce) st.addEventListener("mousemove", function (e) {
        var b = host.getBoundingClientRect();
        mx = clamp(((e.clientX - b.left) / b.width - 0.5) * 2, -1, 1); my = clamp(((e.clientY - b.top) / b.height - 0.5) * 2, -1, 1);
      });
      cv.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY, yw: dyaw, pt: dpit }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
      cv.addEventListener("pointermove", function (e) {
        if (!drag) return;
        dyaw = drag.yw + (e.clientX - drag.x) * 0.007; dpit = clamp(drag.pt + (e.clientY - drag.y) * 0.004, -0.5, 0.5);
      });
      var up = function () { drag = null; };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      if (w.__KAIT2_DEBUG) w.__kait2 = { set: function (y, p, r) { dyaw = 0; cur.yaw = tg.yaw = y; cur.pit = p; cur.roll = r; ctx.fixed = [y, p, r]; }, rig: rig, yaw: yaw, roll: roll, cam: cam, scene: scene, THREE: THREE, render: function () { renderer.render(scene, cam); } };
      loop();
    }
    function fail() { st.classList.add("no-gl"); }
    function loop() {
      if (!ctx || running) return;
      running = true;
      (function tick() {
        if (!near) { running = false; return; }
        if (ctx.fixed) { yawFix(); } else ctx.pose();
        if (reduce) { running = false; return; }
        requestAnimationFrame(tick);
      })();
    }
    function yawFix() { var f = ctx.fixed, a = w.__kait2; a.yaw.rotation.y = f[0]; a.rig.rotation.z = f[1]; a.roll.rotation.x = f[2]; a.render(); }
    function load() {
      if (loaded) return; loaded = true;
      if (w.THREE) { init(); return; }
      var s = d.createElement("script"); s.src = base + "vendor/three.min.js";
      s.onload = init; s.onerror = fail; d.head.appendChild(s);
    }
    scrollFns.push(function () {
      paintText(progress());
      if (reduce && ctx && near) ctx.pose();
    });
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        near = es[0].isIntersecting && !d.hidden;
        if (near) { load(); if (ctx) { t0 = performance.now() - 1; loop(); } }
      }, { rootMargin: "60% 0px 60% 0px" }).observe(st);
    } else { near = true; load(); }
  });

  /* --- приціл-рамка за курсором (захоплює елементи з data-target) --- */
  step("reticle", function () {
    if (!fine || reduce) return;
    var el = d.createElement("div");
    el.className = "reticle"; el.setAttribute("aria-hidden", "true");
    el.innerHTML = '<i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i><b></b>';
    d.body.appendChild(el);
    var lbl = el.querySelector("b");
    var px = 0, py = 0, pw = 34, ph = 34, tx = 0, ty = 0, tw = 34, th = 34, locked = null, shown = false;
    w.addEventListener("mousemove", function (e) {
      if (!shown) { shown = true; px = e.clientX; py = e.clientY; el.classList.add("on"); }
      var t = e.target && e.target.closest ? e.target.closest("[data-target]") : null;
      if (t) {
        var r = t.getBoundingClientRect();
        locked = t; tx = r.left - 8; ty = r.top - 8; tw = r.width + 16; th = r.height + 16;
        lbl.textContent = "Ціль · " + t.getAttribute("data-target");
        el.classList.add("lock");
      } else {
        locked = null; tw = th = 34; tx = e.clientX - 17; ty = e.clientY - 17;
        el.classList.remove("lock");
      }
    }, { passive: true });
    d.addEventListener("mouseleave", function () { el.classList.remove("on"); shown = false; });
    (function tick() {
      if (locked) { var r = locked.getBoundingClientRect(); tx = r.left - 8; ty = r.top - 8; tw = r.width + 16; th = r.height + 16; }
      px += (tx - px) * 0.2; py += (ty - py) * 0.2; pw += (tw - pw) * 0.2; ph += (th - ph) * 0.2;
      el.style.transform = "translate(" + px.toFixed(1) + "px," + py.toFixed(1) + "px)";
      el.style.width = pw.toFixed(1) + "px"; el.style.height = ph.toFixed(1) + "px";
      requestAnimationFrame(tick);
    })();
  });

  /* --- прогрес скролу, панель, перший екран --- */
  var prog = null, top = null, hero = null, lastY = 0, ticking = false;
  step("chrome", function () { prog = d.querySelector(".prog"); top = d.querySelector(".top"); hero = d.querySelector(".hero-in"); });
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = w.pageYOffset || root.scrollTop, max = Math.max(1, root.scrollHeight - w.innerHeight), vh = w.innerHeight;
      if (prog) prog.style.transform = "scaleX(" + clamp(y / max, 0, 1).toFixed(4) + ")";
      if (top) top.classList.toggle("hide", y > lastY && y > 260);
      lastY = y;
      if (hero && !reduce && y < vh * 1.2) {
        hero.style.transform = "translate3d(0," + (y * 0.24).toFixed(1) + "px,0)";
        hero.style.opacity = String(Math.max(0, 1 - y / (vh * 0.9)));
      }
      scrollFns.forEach(function (f) { try { f(); } catch (e) { if (w.console) console.error("[kait2] scroll", e); } });
    });
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  w.addEventListener("resize", onScroll);
  onScroll();

  clearTimeout(safety);
  root.setAttribute("data-kait2", failed.length ? "partial" : "ok");
})();
