/* AIN × MII — «Автономна далекобійна зброя РФ», версія 3 (КАЙТ 2.0): стиль «досьє».
   Скрипт знаходить елементи лише за data-атрибутами, тому тексти, цифри, посилання, фото й відео можна вільно міняти в Designer.

   data-hero            перший екран: завіса, контури карти, «докази» на дошці (data-board)
   data-anim="redact"   заголовок: смужка закреслює кожне слово і відкриває його («розсекречування»)
   data-anim="words"    рядок з'являється по словах
   data-anim="reveal"   блок плавно з'являється
   data-anim="scrub"    текст «запалюється» слово за словом під час скролу
   data-count           число рахує від нуля ("400+ ГБ", "~30 000", "50 000+")
   data-bar / data-max  смужковий стовпчик: ширина = data-bar / data-max
   data-img             фото відкривається розгортанням (повний кадр, нічого не обрізається)
   data-marquee="l|r"   бігучий рядок
   data-scene           закріплена сцена «людина в петлі»: [data-diagram] і [data-step] перемикаються скролом
   data-viewer          3D-модель ракети (за ілюстрацією з матеріалу) у розділі про ракети; крутиться скролом і курсором
   data-vwall / data-vt відеостіна: усі відео на одному екрані, клік по малому — стає головним
   data-video           відео: data-name="файл" (папка video/), data-ratio="16/9"; повний кадр, без обрізання

   Кожен крок ізольований: помилка пишеться в консоль як [kait2] і не зупиняє решту. Скрол ніколи не блокується. */
(function () {
  "use strict";
  var d = document, w = window, root = d.documentElement;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = w.matchMedia && w.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var failed = [], scrollFns = [], held = [];
  function step(name, fn) {
    try { fn(); } catch (e) { failed.push(name); if (w.console) console.error("[kait2] " + name + " failed", e); }
  }
  var base = (function () {
    var s = d.currentScript;
    return s && s.src ? s.src.replace(/js\/[^\/]*(\?.*)?$/, "") : "";
  })();

  if (!reduce) root.classList.add("js-anim");
  var safety = setTimeout(function () { root.classList.remove("js-anim"); root.classList.add("is-ready"); }, 9000);

  var io = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.16, rootMargin: "0px 0px -6% 0px" }) : null;
  function watch(el) {
    if (el.closest && el.closest(".hero")) { held.push(el); return; }
    if (io) io.observe(el); else el.classList.add("is-in");
  }

  function stagger(list) {
    var groups = new Map();
    list.forEach(function (e) { var p = e.parentNode; if (!groups.has(p)) groups.set(p, []); groups.get(p).push(e); });
    groups.forEach(function (g) { g.forEach(function (e, k) { e.style.setProperty("--d", String(Math.min(k, 3))); }); });
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
    stagger(list);
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

  /* --- лічильники --- */
  step("counters", function () {
    var items = [];
    $$("[data-count]").forEach(function (el) {
      var t = el.firstChild;
      while (t && t.nodeType !== 3) t = t.nextSibling;
      if (!t) return;
      var m = t.nodeValue.match(/^([^\d]*)(\d{1,3}(?:[\s  ]\d{3})+|\d+)(,\d+)?([\s\S]*)$/);
      if (!m) return;
      var raw = m[2].replace(/[\s  ]/g, ""), dec = m[3] ? m[3].length - 1 : 0;
      var to = parseFloat(raw + (m[3] ? "." + m[3].slice(1) : ""));
      var sep = /[\s  ]/.test(m[2]) ? " " : "";
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

  /* --- фото --- */
  step("images", function () { $$("[data-img]").forEach(watch); });

  /* --- бігучі рядки --- */
  var tracks = [];
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
      tracks.push(tr);
    });
    if (reduce || !tracks.length) return;
    var lastMY = w.pageYOffset || 0, rate = 1, tgt = 1;
    scrollFns.push(function () { var y = w.pageYOffset || 0; tgt = clamp(1 + Math.abs(y - lastMY) / 9, 1, 7); lastMY = y; });
    (function spin() {
      rate += (tgt - rate) * 0.1; tgt += (1 - tgt) * 0.05;
      tracks.forEach(function (tr) { var an = tr.getAnimations ? tr.getAnimations()[0] : null; if (an) an.playbackRate = rate; });
      requestAnimationFrame(spin);
    })();
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

  /* --- глави: паралакс смужок на панелі, заповнення хронологічної стрічки --- */
  step("chapters", function () {
    var tls = $$(".tl"), heads = $$(".chap-head-g, .chap-head-k");
    scrollFns.push(function () {
      var vh = w.innerHeight;
      tls.forEach(function (t) {
        var r = t.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh) return;
        t.style.setProperty("--tlh", (clamp((vh * 0.62 - r.top) / r.height, 0, 1) * (r.height - 20)).toFixed(0) + "px");
      });
      heads.forEach(function (h) {
        var r = h.getBoundingClientRect();
        if (r.bottom < -50 || r.top > vh + 50) return;
        h.style.setProperty("--ps", (((r.top + r.height / 2) - vh / 2) * -0.22).toFixed(1) + "px");
      });
    });
  });

  /* --- фото: легкий нахил за курсором --- */
  step("tilt", function () {
    if (!fine || reduce) return;
    $$(".fx-fig:not(.viewer), .tl-fig").forEach(function (f) {
      f.addEventListener("mousemove", function (e) {
        var r = f.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        f.style.setProperty("--ty", (x * 6).toFixed(2) + "deg"); f.style.setProperty("--tx", (-y * 4).toFixed(2) + "deg");
      });
      f.addEventListener("mouseleave", function () { f.style.setProperty("--tx", "0deg"); f.style.setProperty("--ty", "0deg"); });
    });
  });

  /* --- відеостіна: усі відео на одному екрані; повний кадр, без обрізання --- */
  step("videos", function () {
    var vids = $$("video[data-video]");
    if (!vids.length) return;
    vids.forEach(function (v) {
      var name = v.getAttribute("data-name"), ratio = v.getAttribute("data-ratio");
      if (name && base) {
        v.setAttribute("poster", base + "poster/" + name + ".jpg");
        v.setAttribute("data-src", base + "video/" + name + ".mp4");
      }
      if (ratio) v.style.aspectRatio = ratio;
      v.muted = true; v.setAttribute("playsinline", ""); v.removeAttribute("controls");
    });
    var grid = $$("[data-vwall]")[0], tiles = grid ? $$("[data-vt]", grid) : [];
    var mainIdx = 0;
    function load(v) { if (!v.src && v.getAttribute("data-src")) v.src = v.getAttribute("data-src"); }
    function play(v) { load(v); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    function setMain(k, go) {
      var first = go ? tiles.map(function (t) { return t.getBoundingClientRect(); }) : null;
      mainIdx = k;
      if (grid) grid.setAttribute("data-main", String(k + 1));
      tiles.forEach(function (t, i) {
        var v = t.querySelector("video");
        t.classList.toggle("is-main", i === k);
        if (i === k) v.setAttribute("controls", ""); else { v.removeAttribute("controls"); if (!v.paused) v.pause(); }
      });
      if (first && !reduce) tiles.forEach(function (t, i) {
        var a = first[i], b = t.getBoundingClientRect();
        if (!a.width || !b.width || !t.animate) return;
        t.animate([{ transformOrigin: "0 0", transform: "translate(" + (a.left - b.left) + "px," + (a.top - b.top) + "px) scale(" + a.width / b.width + "," + a.height / b.height + ")" }, { transformOrigin: "0 0", transform: "none" }], { duration: 700, easing: "cubic-bezier(.2,.75,.15,1)" });
      });
      if (go) play(tiles[k].querySelector("video"));
    }
    if (tiles.length) {
      tiles.forEach(function (t, i) { t.style.setProperty("--d", String(i)); watch(t); });
      setMain(0, false);
      tiles.forEach(function (t, i) {
        t.addEventListener("click", function (e) { if (i !== mainIdx) { e.preventDefault(); setMain(i, true); } });
      });
    } else vids.forEach(function (v) { v.setAttribute("controls", ""); });
    var host = grid || vids[0];
    if (reduce || !("IntersectionObserver" in w)) {
      (tiles.length ? [tiles[0].querySelector("video")] : vids).forEach(load);
      return;
    }
    new IntersectionObserver(function (es) {
      var vis = es[0].isIntersecting;
      var v = tiles.length ? tiles[mainIdx].querySelector("video") : vids[0];
      if (vis) play(v); else vids.forEach(function (x) { if (!x.paused) x.pause(); });
    }, { threshold: 0.45 }).observe(host);
  });

  /* --- перший екран: контури карти, що «креслиться» при вході, дошка з доказами --- */
  var hero = null, heroMain = null, evs = [];
  step("hero", function () {
    hero = $$("[data-hero]")[0];
    if (!hero) return;
    heroMain = hero.querySelector(".hero-main");
    evs = $$(".ev", hero);
    var bg = hero.querySelector(".hero-bg");
    if (!bg) return;
    /* контури: поле висот із кількох синусоїд + «марширующі квадрати» */
    var small = w.innerWidth < 760, nx = small ? 70 : 120, ny = small ? 46 : 68, X = 1600, Y = 900;
    var comps = [], seed = 11, i, j;
    function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
    for (i = 0; i < 7; i++) comps.push({ kx: 0.7 + rnd() * 2.1, ky: 0.7 + rnd() * 1.9, ph: rnd() * 6.283, a: 0.45 + rnd() * 0.55 });
    var F = [], lo = 1e9, hi = -1e9;
    for (j = 0; j <= ny; j++) {
      F[j] = [];
      for (i = 0; i <= nx; i++) {
        var u = i / nx, v = j / ny, s = 0;
        comps.forEach(function (c) { s += c.a * Math.sin(6.283 * (c.kx * u + c.ky * v) + c.ph); });
        F[j][i] = s; if (s < lo) lo = s; if (s > hi) hi = s;
      }
    }
    var T = [[], [[3, 0]], [[0, 1]], [[3, 1]], [[1, 2]], [[3, 0], [1, 2]], [[0, 2]], [[3, 2]], [[2, 3]], [[0, 2]], [[0, 1], [2, 3]], [[1, 2]], [[1, 3]], [[0, 1]], [[3, 0]], []];
    function ep(e, x, y, a, b, c2, d2, L) {
      var t;
      if (e === 0) { t = (L - a) / (b - a); return [x + t, y]; }
      if (e === 1) { t = (L - b) / (c2 - b); return [x + 1, y + t]; }
      if (e === 2) { t = (L - d2) / (c2 - d2); return [x + t, y + 1]; }
      t = (L - a) / (d2 - a); return [x, y + t];
    }
    var ns = "http://www.w3.org/2000/svg", svg = d.createElementNS(ns, "svg");
    svg.setAttribute("viewBox", "0 0 " + X + " " + Y); svg.setAttribute("preserveAspectRatio", "xMidYMid slice"); svg.setAttribute("aria-hidden", "true");
    var levels = 15;
    for (var lv = 0; lv < levels; lv++) {
      var L = lo + (hi - lo) * (0.06 + 0.88 * lv / (levels - 1)), segs = [];
      for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) {
        var a = F[j][i], b = F[j][i + 1], c = F[j + 1][i + 1], dd = F[j + 1][i];
        var idx = (a > L ? 1 : 0) | (b > L ? 2 : 0) | (c > L ? 4 : 0) | (dd > L ? 8 : 0);
        T[idx].forEach(function (pr) { var p1 = ep(pr[0], i, j, a, b, c, dd, L), p2 = ep(pr[1], i, j, a, b, c, dd, L); segs.push([p1[0], p1[1], p2[0], p2[1]]); });
      }
      /* зшиваємо відрізки у ламані */
      var map = new Map(), key = function (x, y) { return Math.round(x * 1000) + "," + Math.round(y * 1000); };
      segs.forEach(function (sg, k) {
        [key(sg[0], sg[1]), key(sg[2], sg[3])].forEach(function (kk, side) { if (!map.has(kk)) map.set(kk, []); map.get(kk).push([k, side]); });
      });
      var used = {};
      segs.forEach(function (sg, k0) {
        if (used[k0]) return;
        used[k0] = true;
        var pts = [[sg[0], sg[1]], [sg[2], sg[3]]];
        function ext(fwd) {
          for (;;) {
            var tip = fwd ? pts[pts.length - 1] : pts[0], list = map.get(key(tip[0], tip[1])) || [], nxt = null;
            for (var q = 0; q < list.length; q++) if (!used[list[q][0]]) { nxt = list[q]; break; }
            if (!nxt) return;
            used[nxt[0]] = true;
            var s2 = segs[nxt[0]], other = nxt[1] === 0 ? [s2[2], s2[3]] : [s2[0], s2[1]];
            if (fwd) pts.push(other); else pts.unshift(other);
          }
        }
        ext(true); ext(false);
        if (pts.length < 4) return;
        var dstr = "M" + pts.map(function (p) { return (p[0] * X / nx).toFixed(1) + " " + (p[1] * Y / ny).toFixed(1); }).join("L");
        var path = d.createElementNS(ns, "path");
        path.setAttribute("d", dstr); path.setAttribute("pathLength", "1");
        path.style.setProperty("--k", String(lv));
        if (lv % 4 === 0) path.setAttribute("class", "m");
        svg.appendChild(path);
      });
    }
    bg.appendChild(svg);
  });

  /* --- вхід: завіса з логотипом, потім з'являється перший екран --- */
  step("intro", function () {
    function start() {
      root.classList.add("is-ready");
      if (hero) hero.classList.add("drawn");
      held.forEach(function (el) { el.classList.add("is-in"); });
      evs.forEach(function (e, k) {
        e.style.setProperty("--d", String(k));
        e.classList.add("is-in");
        setTimeout(function () { e.classList.add("fl"); }, 1700 + k * 160);
      });
    }
    if (reduce || !hero) { start(); return; }
    var cur = d.createElement("div");
    cur.className = "curtain"; cur.setAttribute("aria-hidden", "true");
    cur.innerHTML = '<svg viewBox="0 0 102 70"><rect style="--i:0" width="21" height="18"/><rect style="--i:1" x="81" width="21" height="18"/><rect style="--i:2" y="27" width="42" height="17"/><rect style="--i:3" x="60" y="27" width="42" height="17"/><rect style="--i:4" y="53" width="102" height="17"/></svg>';
    d.body.appendChild(cur);
    var minDone = false, ready = false, fired = false;
    function go() {
      if (fired || !(minDone && ready)) return;
      fired = true;
      cur.classList.add("out");
      setTimeout(start, 420);
      setTimeout(function () { if (cur.parentNode) cur.parentNode.removeChild(cur); }, 1200);
    }
    setTimeout(function () { minDone = true; go(); }, 1050);
    var fr = d.fonts && d.fonts.ready ? d.fonts.ready : Promise.resolve();
    Promise.race([fr, new Promise(function (res) { setTimeout(res, 1800); })]).then(function () { ready = true; go(); });
    setTimeout(function () { ready = true; minDone = true; go(); }, 3200);
  });

  var hmx = 0, hmy = 0, tmx = 0, tmy = 0, hraf = 0;
  step("board", function () {
    if (!hero || reduce || !fine || !evs.length) return;
    var depth = [10, -14, 18];
    function tick() {
      hmx += (tmx - hmx) * 0.08; hmy += (tmy - hmy) * 0.08;
      evs.forEach(function (e, k) { var dpt = depth[k % depth.length]; e.style.setProperty("--mx", (hmx * dpt).toFixed(1) + "px"); });
      if (Math.abs(tmx - hmx) > 0.002 || Math.abs(tmy - hmy) > 0.002) hraf = requestAnimationFrame(tick); else hraf = 0;
    }
    hero.addEventListener("mousemove", function (e) {
      var b = hero.getBoundingClientRect();
      tmx = clamp(((e.clientX - b.left) / b.width - 0.5) * 2, -1, 1); tmy = clamp(((e.clientY - b.top) / b.height - 0.5) * 2, -1, 1);
      if (!hraf) hraf = requestAnimationFrame(tick);
    });
  });

  /* --- ракета: 3D-модель за ілюстрацією з матеріалу (вид зверху, збоку, у ракурсі).
         Стоїть рівно, обертається навколо вертикальної осі: скролом, курсором чи пальцем.
         Three.js вантажиться лише коли розділ поруч. --- */
  step("viewer", function () {
    var vw = $$("[data-viewer]")[0];
    if (!vw) return;
    var host = vw.querySelector(".viewer-stage"), split = vw.closest ? vw.closest(".fx") : vw.parentNode;
    if (!host || !split) return;
    var ctx = null, loaded = false, near = false, running = false, t0 = performance.now(), mx = 0, drag = null, dyaw = 0, cur = { yaw: 0.6 }, tgt = { yaw: 0.6 };
    function progress() {
      var r = split.getBoundingClientRect(), vh = w.innerHeight;
      return clamp((vh * 0.85 - r.top) / (r.height + vh * 0.15), 0, 1);
    }
    function fail() { split.classList.add("no-gl"); }

    /* текстури з полотна: панелі, шви, заклепки — щоб поверхня читалась матовою, а не «пластиком» */
    function canvasTex(THREE, W, H, draw, srgb) {
      var c = d.createElement("canvas"); c.width = W; c.height = H;
      draw(c.getContext("2d"), W, H);
      var t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 4;
      if (srgb) t.encoding = THREE.sRGBEncoding;
      return t;
    }
    function noise(g, W, H, amp) {
      var im = g.getImageData(0, 0, W, H), p = im.data, k, n;
      for (k = 0; k < p.length; k += 4) { n = (Math.random() - 0.5) * amp; p[k] += n; p[k + 1] += n; p[k + 2] += n; }
      g.putImageData(im, 0, 0);
    }
    function seams(g, W, H, hs, vs, base, dark, light, rivet) {
      g.lineWidth = 2;
      hs.forEach(function (f) {
        var y = Math.round(H * f);
        g.strokeStyle = dark; g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke();
        g.strokeStyle = light; g.beginPath(); g.moveTo(0, y + 3); g.lineTo(W, y + 3); g.stroke();
        g.fillStyle = rivet; for (var x = 6; x < W; x += 22) { g.beginPath(); g.arc(x, y - 7, 1.6, 0, 6.283); g.fill(); g.beginPath(); g.arc(x, y + 10, 1.6, 0, 6.283); g.fill(); }
      });
      vs.forEach(function (f) {
        var x = Math.round(W * f);
        g.strokeStyle = dark; g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke();
        g.strokeStyle = light; g.beginPath(); g.moveTo(x + 3, 0); g.lineTo(x + 3, H); g.stroke();
      });
    }

    /* модель: пропорції знято з ілюстрації (L ≈ 12 діаметрів; стрілоподібне крило з прямою задньою кромкою,
       хвостове оперення, бічні обтічники, жовте сопло) */
    function build(THREE) {
      var L = 10, R = 0.415, g = new THREE.Group();
      var X = function (a) { return L * (0.5 - a); };
      var bodyMap = canvasTex(THREE, 512, 1024, function (c, W, H) {
        c.fillStyle = "#677068"; c.fillRect(0, 0, W, H);
        var gr = c.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, "rgba(255,255,255,.08)"); gr.addColorStop(0.5, "rgba(0,0,0,.05)"); gr.addColorStop(1, "rgba(255,255,255,.08)");
        c.fillStyle = gr; c.fillRect(0, 0, W, H);
        for (var s = 0; s < 70; s++) { c.fillStyle = "rgba(20,24,20," + (0.03 + Math.random() * 0.05) + ")"; c.fillRect(Math.random() * W, Math.random() * H * 0.9, 1 + Math.random() * 2, 40 + Math.random() * 220); }
        noise(c, W, H, 16);
        seams(c, W, H, [0.1, 0.27, 0.43, 0.6, 0.76, 0.9], [0.25, 0.75], 0, "rgba(14,18,14,.85)", "rgba(255,255,255,.11)", "rgba(14,18,14,.6)");
      }, true);
      var bodyBump = canvasTex(THREE, 512, 1024, function (c, W, H) {
        c.fillStyle = "#808080"; c.fillRect(0, 0, W, H); noise(c, W, H, 12);
        seams(c, W, H, [0.1, 0.27, 0.43, 0.6, 0.76, 0.9], [0.25, 0.75], 0, "#3a3a3a", "#b0b0b0", "#d8d8d8");
      }, false);
      var wingMap = canvasTex(THREE, 512, 512, function (c, W, H) {
        var gr = c.createLinearGradient(0, 0, W, H); gr.addColorStop(0, "#737b73"); gr.addColorStop(1, "#5f675f"); c.fillStyle = gr; c.fillRect(0, 0, W, H); noise(c, W, H, 14);
      }, true);
      var wingBump = canvasTex(THREE, 512, 512, function (c, W, H) { c.fillStyle = "#808080"; c.fillRect(0, 0, W, H); noise(c, W, H, 18); }, false);
      wingMap.repeat.set(0.22, 0.22); wingBump.repeat.set(0.22, 0.22);
      var body = new THREE.MeshStandardMaterial({ color: 0xffffff, map: bodyMap, bumpMap: bodyBump, bumpScale: 1.4, roughness: 0.6, metalness: 0.28, envMapIntensity: 0.55 });
      var cone = new THREE.MeshStandardMaterial({ color: 0xbdb7a8, map: bodyMap, bumpMap: bodyBump, bumpScale: 1.0, roughness: 0.5, metalness: 0.3, envMapIntensity: 0.6 });
      var wing = new THREE.MeshStandardMaterial({ color: 0xffffff, map: wingMap, bumpMap: wingBump, bumpScale: 0.5, roughness: 0.62, metalness: 0.25, envMapIntensity: 0.5 });
      var yel = new THREE.MeshStandardMaterial({ color: 0xc9b247, roughness: 0.55, metalness: 0.15, envMapIntensity: 0.6 });
      var dark = new THREE.MeshStandardMaterial({ color: 0x1b1e1f, roughness: 0.8, metalness: 0.3 });
      function rad(a) {
        if (a < 0.3) { var u = (0.3 - a) / 0.3; return R * Math.sqrt(Math.max(0, 1 - u * u)); }
        if (a <= 0.8) return R;
        var t = (a - 0.8) / 0.155; return R * (1 - 0.3 * Math.pow(Math.min(1, t), 1.4));
      }
      function lathe(a0, a1, n, mat) {
        var pts = [], i, a;
        for (i = n; i >= 0; i--) { a = a0 + (a1 - a0) * i / n; pts.push(new THREE.Vector2(rad(a), X(a))); } /* від хвоста до носа: нормалі дивляться назовні */
        var geo = new THREE.LatheGeometry(pts, 64); geo.rotateZ(-Math.PI / 2);
        return new THREE.Mesh(geo, mat);
      }
      g.add(lathe(0.0, 0.15, 26, cone));
      g.add(lathe(0.15, 0.955, 44, body));
      var tailCap = new THREE.Mesh(new THREE.CircleGeometry(rad(0.955), 40), dark); tailCap.rotation.y = -Math.PI / 2; tailCap.position.x = X(0.955) - 0.01; g.add(tailCap);
      var ring = new THREE.Mesh(new THREE.TorusGeometry(rad(0.15) * 1.004, 0.012, 8, 56), yel); ring.rotation.y = Math.PI / 2; ring.position.x = X(0.15); g.add(ring);
      var noz = new THREE.Mesh(new THREE.CylinderGeometry(rad(0.955) * 0.98, R * 0.52, L * 0.052, 40, 1, true), yel);
      noz.rotation.z = -Math.PI / 2; noz.position.x = X(0.981); noz.material.side = THREE.DoubleSide; g.add(noz);
      var inner = new THREE.Mesh(new THREE.CircleGeometry(R * 0.5, 32), dark); inner.rotation.y = -Math.PI / 2; inner.position.x = X(1.0) + 0.02; g.add(inner);
      function slab(poly, thick, mat, flat) {
        var sh = new THREE.Shape();
        poly.forEach(function (p, i) { if (i) sh.lineTo(p[0], p[1]); else sh.moveTo(p[0], p[1]); });
        var geo = new THREE.ExtrudeGeometry(sh, { depth: thick, bevelEnabled: true, bevelThickness: thick * 0.45, bevelSize: thick * 0.45, bevelSegments: 2, steps: 1 });
        geo.translate(0, 0, -thick / 2);
        var m = new THREE.Mesh(geo, mat); if (flat) m.rotation.x = -Math.PI / 2;
        return m;
      }
      var S = 2.32;
      g.add(slab([[X(0.475), 0], [X(0.588), S], [X(0.634), S], [X(0.642), 0], [X(0.634), -S], [X(0.588), -S]], 0.1, wing, true));
      var St = 1.0;
      g.add(slab([[X(0.852), 0], [X(0.905), St], [X(0.928), St], [X(0.934), 0], [X(0.928), -St], [X(0.905), -St]], 0.075, wing, true));
      g.add(slab([[X(0.85), 0.18], [X(0.905), 0.72], [X(0.935), 0.72], [X(0.942), 0.18]], 0.07, yel, false));
      [-1, 1].forEach(function (s) {
        var f = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 16), body);
        f.scale.set(0.46, 0.12, 0.1); f.position.set(X(0.74), -0.05, s * (R - 0.012)); g.add(f);
      });
      var hatch = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.034, 0.22), yel); hatch.position.set(X(0.545), R + 0.004, 0); g.add(hatch);
      /* суцільний темний контур навколо силуету: ракета читається «цілою» на будь-якому тлі */
      var olm = new THREE.MeshBasicMaterial({ color: 0x0c1412, side: THREE.BackSide });
      olm.onBeforeCompile = function (sh) { sh.vertexShader = sh.vertexShader.replace("#include <begin_vertex>", "vec3 transformed = vec3(position) + normalize(normal) * 0.016;"); };
      g.children.slice().forEach(function (m) {
        if (!m.isMesh || m.material === dark || m.material === yel) return;
        var o = new THREE.Mesh(m.geometry, olm); o.position.copy(m.position); o.rotation.copy(m.rotation); o.scale.copy(m.scale); g.add(o);
      });
      return g;
    }

    function init() {
      var THREE = w.THREE;
      if (!THREE) return fail();
      if (THREE.ColorManagement) THREE.ColorManagement.legacyMode = false;
      var cv = d.createElement("canvas"), renderer;
      cv.className = "viewer-cv"; cv.setAttribute("aria-hidden", "true");
      try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true, powerPreference: "high-performance" }); }
      catch (e) { return fail(); }
      host.insertBefore(cv, host.firstChild);
      renderer.setClearColor(0x000000, 0);
      renderer.outputEncoding = THREE.sRGBEncoding;
      renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
      var scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(24, 1, 0.1, 200);

      /* м'яке студійне оточення: градієнтний купол і два софтбокси — дають відблиски на матовій поверхні */
      var pm = new THREE.PMREMGenerator(renderer), es = new THREE.Scene();
      var dg = new THREE.SphereGeometry(30, 32, 16), cols = [], pos = dg.attributes.position, k;
      for (k = 0; k < pos.count; k++) { var yy = (pos.getY(k) / 30 + 1) / 2, c1 = new THREE.Color(0x1a2220).lerp(new THREE.Color(0x7f908c), Math.pow(yy, 1.3)); cols.push(c1.r, c1.g, c1.b); }
      dg.setAttribute("color", new THREE.Float32BufferAttribute(cols, 3));
      es.add(new THREE.Mesh(dg, new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.BackSide })));
      function box(wd, ht, x, y, z, col) { var m = new THREE.Mesh(new THREE.PlaneGeometry(wd, ht), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide })); m.position.set(x, y, z); m.lookAt(0, 0, 0); es.add(m); }
      box(16, 7, 10, 16, 8, 0xffffff); box(5, 14, -18, 3, 6, 0x9fe0d3); box(10, 4, 4, -3, -18, 0xe8dca0);
      scene.environment = pm.fromScene(es, 0.03).texture; pm.dispose();

      var rig = new THREE.Group(), yaw = new THREE.Group();
      var missile = build(THREE);
      yaw.add(missile); rig.add(yaw); scene.add(rig);
      scene.add(new THREE.HemisphereLight(0xcfeee8, 0x203432, 0.35));
      var key = new THREE.DirectionalLight(0xfff4e6, 1.45); key.position.set(4, 8, 6); scene.add(key);
      var rim = new THREE.DirectionalLight(0x55bfac, 0.9); rim.position.set(-7, 3, -6); scene.add(rim);
      /* м'яка тінь на «столі»: обертається разом з ракетою */
      var sc = d.createElement("canvas"); sc.width = 256; sc.height = 64;
      var sg = sc.getContext("2d"), grd = sg.createRadialGradient(128, 32, 4, 128, 32, 128); grd.addColorStop(0, "rgba(0,0,0,.7)"); grd.addColorStop(1, "rgba(0,0,0,0)");
      sg.setTransform(1, 0, 0, 0.5, 0, 16); sg.fillStyle = grd; sg.fillRect(0, 0, 256, 128);
      var shadow = new THREE.Mesh(new THREE.PlaneGeometry(8.5, 2.0), new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sc), transparent: true, depthWrite: false, opacity: 0.38 }));
      shadow.rotation.x = -Math.PI / 2; shadow.position.y = -1.85; yaw.add(shadow);

      function size() {
        var W = host.clientWidth, H = host.clientHeight; if (!W || !H) return;
        renderer.setPixelRatio(Math.min(w.devicePixelRatio || 1, 1.75)); renderer.setSize(W, H, false);
        cam.aspect = W / H;
        var visW = W < 500 ? 11.2 : 10.4, dist = visW / (2 * Math.tan(cam.fov * Math.PI / 360) * cam.aspect);
        cam.position.set(0, dist * 0.2, dist); cam.lookAt(0, -0.2, 0); cam.updateProjectionMatrix();
      }
      size();
      if ("ResizeObserver" in w) new ResizeObserver(size).observe(host); else w.addEventListener("resize", size);

      function pose() {
        var p = progress(), t = (performance.now() - t0) / 1000;
        tgt.yaw = 0.55 + p * 6.283 * 0.92 + mx * 0.3 + dyaw + (reduce ? 0 : t * 0.04);
        cur.yaw += (tgt.yaw - cur.yaw) * (reduce ? 1 : 0.1);
        yaw.rotation.y = cur.yaw;
        rig.rotation.z = 0.05;
        renderer.render(scene, cam);
      }
      ctx = { pose: pose };
      split.classList.add("gl-on");
      if (fine && !reduce) split.addEventListener("mousemove", function (e) {
        var b = host.getBoundingClientRect();
        mx = clamp(((e.clientX - b.left) / b.width - 0.5) * 2, -1, 1);
      });
      cv.addEventListener("pointerdown", function (e) { drag = { x: e.clientX, y: e.clientY, yw: dyaw }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} });
      cv.addEventListener("pointermove", function (e) { if (drag) dyaw = drag.yw + (e.clientX - drag.x) * 0.008; });
      var up = function () { drag = null; };
      cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up);
      if (w.__KAIT2_DEBUG) w.__kait2 = { THREE: THREE, scene: scene, cam: cam, yaw: yaw, rig: rig, render: function () { renderer.render(scene, cam); }, hold: function (on) { ctx.hold = on; } };
      loop();
    }
    function loop() {
      if (!ctx || running) return;
      running = true;
      (function tick() {
        if (!near) { running = false; return; }
        if (!ctx.hold) ctx.pose();
        if (reduce) { running = false; return; }
        requestAnimationFrame(tick);
      })();
    }
    function load() {
      if (loaded) return; loaded = true;
      if (w.THREE) { init(); return; }
      var s = d.createElement("script"); s.src = base + "vendor/three.min.js";
      s.onload = init; s.onerror = fail; d.head.appendChild(s);
    }
    scrollFns.push(function () { if (reduce && ctx && near) ctx.pose(); });
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        near = es[0].isIntersecting && !d.hidden;
        if (near) { load(); if (ctx) loop(); }
      }, { rootMargin: "70% 0px 70% 0px" }).observe(split);
    } else { near = true; load(); }
  });

  /* --- прогрес скролу, панель, перший екран --- */
  var prog = null, top = null, lastY = 0, ticking = false;
  step("chrome", function () { prog = d.querySelector(".prog"); top = d.querySelector(".top"); });
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = w.pageYOffset || root.scrollTop, max = Math.max(1, root.scrollHeight - w.innerHeight), vh = w.innerHeight;
      if (prog) prog.style.transform = "scaleX(" + clamp(y / max, 0, 1).toFixed(4) + ")";
      if (top) top.classList.toggle("hide", y > lastY && y > 260);
      lastY = y;
      if (hero && !reduce && y < vh * 1.3) {
        if (heroMain) {
          heroMain.style.transform = "translate3d(0," + (y * 0.1).toFixed(1) + "px,0)";
          heroMain.style.opacity = String(clamp(1 - (y - vh * 0.1) / (vh * 0.65), 0, 1));
        }
        evs.forEach(function (e, k) { e.style.setProperty("--my", (-y * [0.1, 0.2, 0.3][k % 3]).toFixed(1) + "px"); });
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
