/* AIN × MII — автономна зброя РФ. Анімації для сторінки Webflow.
   Скрипт знаходить елементи лише за data-атрибутами, тому тексти, цифри, посилання й фото можна вільно міняти в Designer.

   data-anim="words"    заголовок/абзац з'являється по словах
   data-anim="reveal"   блок плавно з'являється при скролі
   data-anim="scrub"    текст підсвічується слово за словом під час скролу
   data-count           число рахує від нуля до написаного значення ("400 ГБ", "50 000+", "5,6 млн ₽")
   data-bar / data-max  смужка шкали: ширина = data-bar / data-max
   data-img             зображення відкривається «жалюзі» зі смужок (мотив МІІ)
   data-marquee="l|r"   бігучий рядок (елементи всередині .track повторюються)
   data-stripes         полотно зі смужками на першому екрані
   data-steps           «людина в петлі»: блоки [data-step] перемикають стан [data-stage]
   data-video           відео: data-name="файл" (папка video/ у репозиторії), грає лише на екрані
   data-target="Назва"  мітка прицілу, коли курсор над елементом
   data-menu            назва секції (для аналітики/меню)
   mark.hl              скрипт сам підсвічує числа з одиницями в тексті (текст не міняється)
   .rail                бічний індекс розділів будується з усіх section із заголовком .h2-art

   Кожен крок ізольований: помилка пишеться в консоль як [ain-mii] і не зупиняє решту. Скрол ніколи не блокується. */
(function () {
  "use strict";
  var d = document, w = window, root = d.documentElement;
  var $$ = function (s, r) { return Array.prototype.slice.call((r || d).querySelectorAll(s)); };
  var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = w.matchMedia && w.matchMedia("(hover:hover) and (pointer:fine)").matches;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var failed = [];
  function step(name, fn) {
    try { fn(); } catch (e) { failed.push(name); if (w.console) console.error("[ain-mii] " + name + " failed", e); }
  }
  /* адреса репозиторію (для відео): папка над js/ */
  var base = (function () {
    var s = d.currentScript;
    if (s && s.src) return s.src.replace(/js\/[^\/]*(\?.*)?$/, "");
    return "";
  })();

  if (!reduce) root.classList.add("js-anim");
  /* страховка: якщо скрипт не дійшов до кінця, контент усе одно стає видимим */
  var safety = setTimeout(function () { root.classList.remove("js-anim"); }, 6000);

  /* --- спостерігач появи --- */
  var io = "IntersectionObserver" in w ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } });
  }, { threshold: 0.18, rootMargin: "0px 0px -6% 0px" }) : null;
  function watch(el) { if (io) io.observe(el); else el.classList.add("is-in"); }

  /* затримка-«драбинка» між сусідніми блоками */
  function stagger(list) {
    var groups = new Map();
    list.forEach(function (e) {
      var p = e.parentNode;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(e);
    });
    groups.forEach(function (g) { g.forEach(function (e, k) { e.style.setProperty("--d", String(Math.min(k, 5))); }); });
  }

  /* --- слова --- */
  function wrapTextWords(el, cls, counter) {
    var nodes = [], tw = d.createTreeWalker(el, NodeFilter.SHOW_TEXT), n;
    while ((n = tw.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      var parts = t.nodeValue.split(/(\s+)/), frag = d.createDocumentFragment();
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(" ")); return; }
        if (cls === "w") {
          var o = d.createElement("span"), i = d.createElement("span");
          o.className = "w"; i.className = "wi"; i.textContent = p;
          i.style.setProperty("--i", String(counter.i++));
          o.appendChild(i); frag.appendChild(o);
        } else {
          var s = d.createElement("span"); s.className = cls; s.textContent = p;
          counter.list.push(s); frag.appendChild(s);
        }
      });
      t.parentNode.replaceChild(frag, t);
    });
  }
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
    stagger(list.filter(function (e) { return e.matches(".stat,.card,.card-light,.cmp,.cmp-hot,.time,.vid,.flow-box"); }));
    list.forEach(watch);
  });

  /* --- підсвітка слів при скролі --- */
  var scrubs = [];
  step("scrub", function () {
    $$('[data-anim="scrub"]').forEach(function (el) {
      var c = { list: [] };
      wrapTextWords(el, "sw", c);
      scrubs.push({ el: el, words: c.list });
    });
  });
  function updateScrub() {
    var vh = w.innerHeight;
    scrubs.forEach(function (s) {
      var r = s.el.getBoundingClientRect();
      var p = clamp((vh * 0.9 - r.top) / (r.height + vh * 0.05), 0, 1);
      var upto = Math.round(p * s.words.length);
      s.words.forEach(function (x, i) { x.classList.toggle("on", i < upto); });
    });
  }

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
        var t0 = performance.now(), dur = 1700;
        (function tick(now) {
          var k = clamp((now - t0) / dur, 0, 1), v = 1 - Math.pow(1 - k, 3);
          it.t.nodeValue = it.fmt(it.to * v);
          if (k < 1) requestAnimationFrame(tick); else it.t.nodeValue = it.fmt(it.to);
        })(t0);
      });
    }, { threshold: 0.6 }) : null;
    items.forEach(function (it) { if (cio) cio.observe(it.el); else it.t.nodeValue = it.fmt(it.to); });
  });

  /* --- шкали --- */
  step("bars", function () {
    var bars = $$("[data-bar]");
    bars.forEach(function (b, i) {
      var parent = b.closest(".chart");
      b.style.setProperty("--d", String(parent ? $$("[data-bar]", parent).indexOf(b) : i));
    });
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

  /* --- зображення --- */
  step("images", function () { $$("[data-img]").forEach(watch); });

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
      tr.style.setProperty("--dur", Math.round(items.length * 9) + "s");
      if (m.getAttribute("data-marquee") === "r") tr.style.animationDirection = "reverse";
      m.setAttribute("aria-hidden", "true");
    });
  });

  /* --- «людина в петлі» --- */
  step("steps", function () {
    $$("[data-steps]").forEach(function (box) {
      var stage = box.querySelector("[data-stage]"), modes = $$("[data-step]", box);
      if (!stage || !modes.length || !("IntersectionObserver" in w)) return;
      var sio = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          modes.forEach(function (x) { x.classList.toggle("on", x === e.target); });
          stage.setAttribute("data-stage", e.target.getAttribute("data-step"));
        });
      }, { rootMargin: "-42% 0px -42% 0px" });
      modes.forEach(function (x) { sio.observe(x); });
      modes[0].classList.add("on");
    });
  });

  /* --- відео --- */
  step("videos", function () {
    var vids = $$("video[data-video]");
    if (!vids.length) return;
    vids.forEach(function (v) {
      var name = v.getAttribute("data-name");
      if (name && base) {
        v.setAttribute("poster", base + "poster/" + name + ".jpg");
        v.setAttribute("data-src", base + "video/" + name + ".mp4");
      }
      v.muted = true; v.setAttribute("playsinline", ""); v.setAttribute("controls", "");
    });
    if (reduce || !("IntersectionObserver" in w)) {
      vids.forEach(function (v) { v.setAttribute("controls", ""); var s = v.getAttribute("data-src"); if (s) v.src = s; });
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
    }, { threshold: 0.35 });
    vids.forEach(function (v) { vio.observe(v); });
  });

  /* --- полотно зі смужками (мотив МІІ): сканер у вигляді кола + дрейфуючі смужки, реагує на курсор --- */
  step("stripes", function () {
    var host = $$("[data-stripes]")[0];
    if (!host || !host.getBoundingClientRect) return;
    var cv = d.createElement("canvas"), ctx = cv.getContext("2d");
    if (!ctx) return;
    cv.className = "stripes"; cv.setAttribute("aria-hidden", "true");
    host.insertBefore(cv, host.firstChild);
    var W = 0, H = 0, dpr = 1, rows = [], RH = 12, TH = 5, mx = -1e4, my = -1e4, run = false, t0 = performance.now();
    var G = "85,191,172", Y = "252,232,129";
    function rnd(i, k) { var x = Math.sin(i * 127.1 + k * 311.7) * 43758.5453; return x - Math.floor(x); }
    function size() {
      dpr = Math.min(w.devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      rows = [];
      var n = Math.ceil(H / RH);
      for (var i = 0; i < n; i++) {
        var segs = [], x = -rnd(i, 1) * W * 0.4, cnt = 3 + Math.floor(rnd(i, 2) * 4);
        for (var k = 0; k < cnt; k++) { var len = 40 + rnd(i, 3 + k) * W * 0.22; segs.push({ x: x, len: len }); x += len + 60 + rnd(i, 9 + k) * W * 0.25; }
        rows.push({ y: i * RH + RH / 2, segs: segs, span: x, sp: (rnd(i, 5) * 8 + 3) * (rnd(i, 6) > 0.5 ? 1 : -1) });
      }
    }
    function draw(now) {
      var t = (now - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      var cx = W * (W > 800 ? 0.78 : 0.5), cy = H * 0.42, R = Math.min(W * (W > 800 ? 0.22 : 0.42), H * 0.4);
      var sweep = ((t * 0.16) % 1.4 - 0.2) * 2 * R + cy - R; /* смуга сканування вниз по колу */
      rows.forEach(function (r, i) {
        var y = r.y, near = Math.max(0, 1 - Math.abs(y - my) / 110);
        /* фон: дрейфуючі смужки */
        r.segs.forEach(function (s) {
          var x = ((s.x + r.sp * t) % r.span + r.span) % r.span - 200;
          var a = 0.045 + near * 0.26;
          ctx.fillStyle = "rgba(" + G + "," + a + ")";
          ctx.fillRect(x, y - TH / 2, s.len, TH);
          if (near > 0.2 && mx > -1e3) { ctx.fillStyle = "rgba(" + Y + "," + near * 0.5 + ")"; ctx.fillRect(Math.max(x, mx - 30), y - TH / 2, 18, TH); }
        });
        /* коло з хорд-смужок */
        var dy = y - cy;
        if (Math.abs(dy) < R) {
          var half = Math.sqrt(R * R - dy * dy), x0 = cx - half, ln = half * 2;
          var cut = 0.25 + rnd(i, 21) * 0.5, gap = 10 + rnd(i, 22) * 30;
          var lit = Math.max(0, 1 - Math.abs(y - sweep) / 46);
          var a2 = 0.2 + lit * 0.62;
          ctx.fillStyle = "rgba(" + (lit > 0.5 ? Y : G) + "," + a2 + ")";
          ctx.fillRect(x0, y - TH / 2, ln * cut, TH);
          ctx.fillRect(x0 + ln * cut + gap, y - TH / 2, Math.max(0, ln * (1 - cut) - gap), TH);
        }
      });
    }
    function loop(now) { if (!run) return; draw(now); requestAnimationFrame(loop); }
    size();
    draw(performance.now());
    if (reduce) return;
    var rz; w.addEventListener("resize", function () { clearTimeout(rz); rz = setTimeout(function () { size(); if (!run) draw(performance.now()); }, 120); });
    host.addEventListener("mousemove", function (e) { var b = cv.getBoundingClientRect(); mx = e.clientX - b.left; my = e.clientY - b.top; });
    host.addEventListener("mouseleave", function () { mx = my = -1e4; });
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        var on = es[0].isIntersecting && !d.hidden;
        if (on && !run) { run = true; requestAnimationFrame(loop); } else if (!on) run = false;
      }, { threshold: 0 }).observe(host);
    } else { run = true; requestAnimationFrame(loop); }
  });

  /* --- приціл: рамка йде за курсором і «захоплює» елементи з data-target --- */
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


  /* --- підсвітка чисел з одиницями (лише обгортка, текст не змінюється) --- */
  step("marks", function () {
    var re = /(\d[\d  ]*(?:,\d+)?(?:[–-]\d[\d  ]*(?:,\d+)?)?\s?(?:млн рублів|тис\. рублів|тисяч|млн|кг|км\/год|км|ГБ|GHz|MHz|Gb|Mb|%|годин|метрів|метра|пікселів|ліцензій|авторів))/g;
    $$(".p, .p-dark, .mode-p, .li").forEach(function (el) {
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
          mk.className = "hl";
          mk.textContent = m[0];
          frag.appendChild(mk);
          last = m.index + m[0].length;
        }
        if (last < v.length) frag.appendChild(d.createTextNode(v.slice(last)));
        t.parentNode.replaceChild(frag, t);
      });
    });
  });

  /* --- бічний індекс розділів --- */
  var railLinks = [];
  step("rail", function () {
    var secs = $$("section[id]").filter(function (s) { return s.querySelector(".h2-art"); });
    if (secs.length < 2) return;
    var nav = d.createElement("nav");
    nav.className = "rail";
    nav.setAttribute("aria-label", "Розділи");
    secs.forEach(function (s, i) {
      var h = s.querySelector(".h2-art"), a = d.createElement("a");
      a.href = "#" + s.id;
      a.innerHTML = "<b></b><i></i>";
      a.querySelector("b").textContent = (i + 1 < 10 ? "0" : "") + (i + 1) + " · " + h.textContent.replace(/\s+/g, " ").trim().slice(0, 34);
      nav.appendChild(a);
      railLinks.push({ a: a, s: s });
    });
    d.body.appendChild(nav);
    if (!("IntersectionObserver" in w)) return;
    var rio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        railLinks.forEach(function (x) { x.a.classList.toggle("on", x.s === e.target); });
        nav.classList.toggle("light", e.target.classList.contains("sec-light"));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    secs.forEach(function (s) { rio.observe(s); });
  });

  /* --- паралакс: hero та зображення --- */
  var figs = [], hero = null;
  step("parallax", function () {
    if (reduce) return;
    figs = $$("[data-img]").map(function (f) { return { f: f, im: f.querySelector(".fig-img") }; }).filter(function (x) { return x.im; });
    hero = d.querySelector(".hero-in");
  });
  function updateParallax() {
    var vh = w.innerHeight;
    figs.forEach(function (x) {
      var r = x.f.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      var k = ((r.top + r.height / 2) - vh / 2) / vh;
      x.im.style.setProperty("--py", (k * -34).toFixed(1) + "px");
    });
    if (hero) {
      var y = w.pageYOffset || root.scrollTop;
      if (y < vh * 1.2) {
        hero.style.transform = "translate3d(0," + (y * 0.28).toFixed(1) + "px,0)";
        hero.style.opacity = String(Math.max(0, 1 - y / (vh * 0.85)));
      }
    }
  }

  /* --- прогрес скролу, панель, плавне виділення --- */
  var prog = null, top = null, lastY = 0, ticking = false;
  step("chrome", function () { prog = d.querySelector(".prog"); top = d.querySelector(".top"); });
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var y = w.pageYOffset || root.scrollTop, max = Math.max(1, root.scrollHeight - w.innerHeight);
      if (prog) prog.style.transform = "scaleX(" + clamp(y / max, 0, 1).toFixed(4) + ")";
      if (top) top.classList.toggle("hide", y > lastY && y > 240);
      lastY = y;
      if (scrubs.length) updateScrub();
      updateParallax();
    });
  }
  w.addEventListener("scroll", onScroll, { passive: true });
  w.addEventListener("resize", onScroll);
  onScroll();
  if (scrubs.length) updateScrub();
  updateParallax();

  clearTimeout(safety);
  root.setAttribute("data-ain-mii", failed.length ? "partial" : "ok");
})();
