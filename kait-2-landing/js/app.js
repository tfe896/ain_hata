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
      scrubs.push({ el: el, words: c.list });
    });
  });
  scrollFns.push(function () {
    var vh = w.innerHeight;
    scrubs.forEach(function (s) {
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
