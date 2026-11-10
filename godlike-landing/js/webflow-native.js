/* Webflow-native adapter. Runs before js/app.js on a page built from native Webflow elements.
   In Webflow the texts stay plain (editable in the Designer); this script turns them, in the browser, into the markup the
   landing's animations expect. Everything is driven by attributes, never by the text itself:

   data-anim="letters"  heading appears letter by letter (h1 in .hero, h2.h elsewhere); <span class="gt"> = gradient words
   data-anim="words"    paragraph / quote appears word by word
   data-anim="scrub"    big text lights up word by word while scrolling
   data-anim="reveal"   block slides / fades in when it enters the screen
   data-count           number counts up from zero to the value written in the element ("13+", "~2", "20 000+", "#23")
   data-scene="N"       3D figure container (an <img class="fig-poster"> inside is shown until the live figure is ready)
   data-stream          hero "data stream" background
   data-marquee="l|r"   marquee row; its items are repeated by this script
   data-menu="Title"    optional menu title of a section (default: the section's first heading)

   Elements without these attributes are left alone. */
(function () {
  "use strict";
  var d = document;
  var $$ = function (s, r) {
    return Array.prototype.slice.call((r || d).querySelectorAll(s));
  };
  var el = function (tag, cls, txt) {
    var e = d.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  };
  var clean = function (s) {
    return s.replace(/\s+/g, " ").trim();
  };
  var isGt = function (node, root) {
    for (var n = node.parentNode; n && n !== root; n = n.parentNode)
      if (n.classList && n.classList.contains("gt")) return true;
    return false;
  };
  /* text of an element as a list of characters with their "gradient" flag */
  function chars(root) {
    var out = [];
    var w = d.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      var g = isGt(n, root);
      var t = n.nodeValue.replace(/\s+/g, " ");
      for (var i = 0; i < t.length; i++) out.push({ c: t[i], g: g });
    }
    while (out.length && out[0].c === " ") out.shift();
    while (out.length && out[out.length - 1].c === " ") out.pop();
    return out;
  }
  function words(list) {
    var ws = [],
      cur = [];
    list.forEach(function (x) {
      if (x.c === " ") {
        if (cur.length) ws.push(cur);
        cur = [];
      } else cur.push(x);
    });
    if (cur.length) ws.push(cur);
    return ws;
  }

  /* ---- letters ---- */
  $$('[data-anim="letters"]').forEach(function (h) {
    var hero = h.tagName === "H1" && h.closest(".hero");
    var cls = hero ? "ch" : "c";
    if (!hero && h.tagName === "H2" && !h.classList.contains("h")) h.classList.add("h");
    h.setAttribute("aria-label", clean(h.textContent));
    var ws = words(chars(h));
    h.textContent = "";
    var i = 0;
    ws.forEach(function (w, wi) {
      var hw = el("span", "hw");
      if (!hero) hw.setAttribute("aria-hidden", "true");
      /* a gradient run inside a word spreads the gradient over the run, like in the original markup */
      var k = 0;
      while (k < w.length) {
        var j = k;
        while (j < w.length && w[j].g === w[k].g) j++;
        for (var q = k; q < j; q++) {
          var s = el("span", cls + (w[q].g ? " gt" : ""), w[q].c);
          var st = "--i: " + ++i;
          if (w[q].g) {
            var len = j - k;
            st += "; --bs: " + len * 100 + "%; --bp: " + (len > 1 ? Math.round(((q - k) / (len - 1)) * 100) : 0) + "%";
          }
          s.setAttribute("style", st);
          hw.appendChild(s);
        }
        k = j;
      }
      if (wi) h.appendChild(d.createTextNode(" "));
      h.appendChild(hw);
    });
  });

  /* ---- words (reveal) and scrub ---- */
  function wrapWords(root, cls, counter) {
    var nodes = [];
    var w = d.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (t) {
      var parts = t.nodeValue.split(/(\s+)/);
      var frag = d.createDocumentFragment();
      var g = cls === "sw" && isGt(t, root);
      parts.forEach(function (p) {
        if (!p) return;
        if (/^\s+$/.test(p)) frag.appendChild(d.createTextNode(" "));
        else {
          var s = el("span", cls + (g ? " gt" : ""), p);
          if (cls === "wd") s.setAttribute("style", "--i: " + counter.i++);
          frag.appendChild(s);
        }
      });
      t.parentNode.replaceChild(frag, t);
    });
  }
  /* stagger index (--d) of sibling blocks, as in the original markup */
  function stagger(list) {
    var groups = new Map();
    list.forEach(function (e) {
      if (/--d\s*:/.test(e.getAttribute("style") || "")) return;
      var p = e.parentNode;
      if (!groups.has(p)) groups.set(p, []);
      groups.get(p).push(e);
    });
    groups.forEach(function (g, p) {
      g.forEach(function (e, k) {
        e.style.setProperty("--d", String(p.classList && (p.classList.contains("col") || p.classList.contains("two")) ? Math.min(k + 1, 3) : k));
      });
    });
  }
  var rws = $$('[data-anim="words"]');
  rws.forEach(function (p) {
    p.classList.add("rw");
    wrapWords(p, "wd", { i: 0 });
  });
  stagger(rws);
  $$('[data-anim="scrub"]').forEach(function (p) {
    p.classList.add("scrub");
    wrapWords(p, "sw");
  });
  var rev = $$('[data-anim="reveal"]');
  rev.forEach(function (e) {
    e.setAttribute("data-r", "");
  });
  stagger(rev.filter(function (e) {
    return e.matches(".glass");
  }));

  /* ---- counters ---- */
  $$("[data-count]").forEach(function (e) {
    var t = e.firstChild;
    while (t && t.nodeType !== 3) t = t.nextSibling;
    if (!t) return;
    var m = t.nodeValue.match(/^(\s*\D*?)(\d[\d\s  ,.]*\d|\d)(.*)$/);
    if (!m) return;
    var num = m[2].replace(/[\s  ,]/g, "");
    e.setAttribute("data-to", num);
    e.setAttribute("data-pre", m[1].trim());
    e.setAttribute("data-suf", m[3].replace(/\s+$/, ""));
    e.setAttribute("data-sep", /[\s  ]/.test(m[2]) ? " " : "");
    if (e.firstChild !== t) e.insertBefore(t, e.firstChild);
    t.nodeValue = m[1].trim() + "0" + m[3].replace(/\s+$/, "");
  });

  /* ---- 3D figures ---- */
  $$("[data-scene]").forEach(function (f) {
    f.classList.add("fig");
    f.setAttribute("aria-hidden", "true");
    if (!f.hasAttribute("data-r")) f.setAttribute("data-r", "");
    if (!f.querySelector(".halo")) f.insertBefore(el("div", "halo"), f.firstChild);
    if (!f.querySelector("canvas")) {
      var c = el("canvas");
      c.width = 2;
      c.height = 2;
      f.appendChild(c);
    }
  });

  /* ---- hero data stream ---- */
  $$("[data-stream]").forEach(function (h) {
    var inner = h.querySelector(".inner") || h;
    if (!inner.querySelector("canvas.stream")) inner.insertBefore(el("canvas", "stream"), inner.firstChild);
    if (!inner.querySelector(".veil")) inner.insertBefore(el("div", "veil"), inner.children[1] || null);
  });

  /* ---- marquees: same items repeated six times, outlined / filled alternately ---- */
  $$("[data-marquee]").forEach(function (m) {
    m.classList.add("marq");
    m.setAttribute("data-dir", m.getAttribute("data-marquee") === "r" ? "r" : "l");
    m.setAttribute("aria-hidden", "true");
    var tr = m.querySelector(".track") || m;
    var items = $$(":scope > *", tr).map(function (x) {
      return clean(x.textContent);
    }).filter(Boolean);
    if (!items.length) return;
    tr.textContent = "";
    var n = 0;
    for (var k = 0; k < 6; k++)
      items.forEach(function (t) {
        tr.appendChild(el("span", n++ % 2 === 0 ? "f" : "", t));
      });
  });

  /* ---- page chrome the script needs ---- */
  var main = d.querySelector("main") || d.querySelector(".stack");
  if (main && !main.querySelector(".bgl")) main.insertBefore(el("div", "bgl"), main.firstChild);
  if (!d.querySelector(".prog")) d.body.insertBefore(el("div", "prog"), d.body.firstChild);
  var mb = d.querySelector(".mbtn");
  if (mb) {
    if (!mb.querySelector("i")) {
      mb.appendChild(el("i"));
      mb.appendChild(el("i"));
    }
    mb.setAttribute("role", "button");
    mb.setAttribute("tabindex", "0");
    mb.setAttribute("aria-label", mb.getAttribute("aria-label") || "Меню");
    mb.setAttribute("aria-expanded", "false");
    mb.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        mb.click();
      }
    });
  }
  if (!d.querySelector(".menu")) {
    var nav = el("nav", "menu");
    nav.setAttribute("aria-label", "Розділи");
    nav.setAttribute("aria-hidden", "true");
    var ol = el("ol");
    $$(".sec").forEach(function (s, i) {
      var h = s.querySelector("h1,h2,h3,.lead");
      var title = s.getAttribute("data-menu") || (h ? clean(h.getAttribute("aria-label") || h.textContent) : "");
      if (!title && s.querySelector(".cta")) title = clean(s.querySelector(".cta").textContent);
      var li = el("li");
      li.setAttribute("style", "--i: " + i);
      var b = el("button");
      b.setAttribute("data-i", String(i));
      b.appendChild(el("span", "n", (i + 1 < 10 ? "0" : "") + (i + 1)));
      b.appendChild(el("span", "t", title));
      li.appendChild(b);
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    var top = d.querySelector(".top");
    if (top && top.parentNode) top.parentNode.insertBefore(nav, top.nextSibling);
    else d.body.appendChild(nav);
  }
})();
