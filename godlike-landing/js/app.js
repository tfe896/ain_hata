(() => {
  "use strict";
  const $ = (s, r = document) => r.querySelector(s),
    $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const root = document.documentElement;
  root.classList.add("js");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = matchMedia("(pointer:fine)").matches;
  const clamp = (x, a, b) => Math.min(b, Math.max(a, x)),
    lerp = (a, b, t) => a + (b - a) * t;
  const mobile = () => innerWidth < 800;
  const mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2,
    has: false,
    down: false,
  };
  addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.has = true;
    },
    { passive: true },
  );
  addEventListener(
    "pointerdown",
    (e) => {
      mouse.down = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.has = true;
    },
    { passive: true },
  );
  addEventListener(
    "pointerup",
    () => {
      mouse.down = false;
    },
    { passive: true },
  );
  addEventListener(
    "pointercancel",
    () => {
      mouse.down = false;
    },
    { passive: true },
  );

  /* ============ intro ============ */
  let went = false,
    cueOn = false;
  const go = () => {
    if (went) return;
    went = true;
    prepIntro();
    ST.t0 = performance.now();
    root.classList.add("go");
    setTimeout(() => {
      const c = $(".cue");
      if (c) c.classList.add("cuein");
    }, 2700);
    setTimeout(() => {
      cueOn = true;
      onScroll();
    }, 3600);
  };
  (document.fonts && document.fonts.ready
    ? document.fonts.ready
    : Promise.resolve()
  ).then(() => setTimeout(go, 140));
  setTimeout(go, 1800);

  /* ============ sections, layout ============ */
  const secs = $$(".sec"),
    mq = $$(".marq").map((el) => ({
      el,
      tr: $(".track", el),
      dir: el.dataset.dir === "r" ? 1 : -1,
      w: 1,
    }));
  const bgl = $(".bgl"),
    heroWrap = $(".hero .wrap"),
    heroCue = $(".cue");
  let tops = [];
  function measure() {
    tops = secs.map((s) => s.offsetTop);
    mq.forEach((m) => {
      m.w = Math.max(1, m.tr.scrollWidth / 2);
    });
    // ambient colour washes that run along the whole page, so no screen is flat black
    if (bgl) {
      bgl.textContent = "";
      const vw = innerWidth;
      const size = Math.min(vw * 1.05, 1150);
      secs.forEach((s, i) => {
        if (i === 0) return;
        const mk = (y, left, cls) => {
          const e = document.createElement("i");
          e.className = "g " + cls;
          e.style.cssText =
            "width:" +
            size +
            "px;height:" +
            size +
            "px;top:" +
            (y - size / 2).toFixed(0) +
            "px;left:" +
            (left ? -size * 0.42 : vw - size * 0.58).toFixed(0) +
            "px";
          bgl.appendChild(e);
        };
        mk(
          s.offsetTop + s.offsetHeight * 0.28,
          i % 2 === 0,
          i % 3 === 0 ? "l" : "c",
        );
        mk(
          s.offsetTop + s.offsetHeight * 0.78,
          i % 2 !== 0,
          i % 3 === 0 ? "c" : "l",
        );
      });
    }
  }

  /* ============ reveal: text + blocks appear as they enter the screen ============ */
  const revealEls = $$("[data-r],h2.h,.rw");
  function showEl(el) {
    if (el._shown) return;
    el._shown = true;
    el.classList.add("in");
    if (el.matches(".stat,.card")) $$("[data-to]", el).forEach(countUp);
    if (el.hasAttribute("data-r"))
      setTimeout(() => el.removeAttribute("data-r"), 2200);
  }
  const rio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        if (e.isIntersecting) {
          showEl(e.target);
          rio.unobserve(e.target);
        }
      }),
    { threshold: 0.14, rootMargin: "0px 0px -9% 0px" },
  );
  revealEls.forEach((el) => rio.observe(el));
  function countUp(el) {
    if (el._done) return;
    el._done = true;
    const to = +el.dataset.to,
      pre = el.dataset.pre || "",
      suf = el.dataset.suf || "",
      sep = el.dataset.sep || "";
    const fmt = (n) =>
      pre + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, sep) + suf;
    if (reduce) {
      el.firstChild.nodeValue = fmt(to);
      return;
    }
    const t0 = performance.now(),
      dur = 1700;
    const step = (t) => {
      const k = clamp((t - t0) / dur, 0, 1),
        e = 1 - Math.pow(1 - k, 4);
      el.firstChild.nodeValue = fmt(to * e);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* scroll-scrubbed text: words light up one by one as the line travels up the screen */
  const scrubs = $$(".scrub").map((el) => ({ el, w: $$(".sw", el), p: -1 }));

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(scrollFx);
    }
  }
  const prog = $(".prog");
  let curIdx = 0;
  function scrollFx() {
    ticking = false;
    const vh = innerHeight,
      sy = scrollY;
    const rects = scrubs.map((sc) => sc.el.getBoundingClientRect()),
      max = root.scrollHeight - vh; // all layout reads first, then the writes
    if (prog)
      prog.style.transform = "scaleX(" + clamp(sy / Math.max(1, max), 0, 1) + ")";
    root.classList.toggle("scrolled", sy > vh * 0.7);
    curIdx = 0;
    tops.forEach((t, i) => {
      if (t - vh * 0.45 <= sy) curIdx = i;
    });
    if (!reduce && sy < vh * 1.3) {
      const k = clamp(sy / vh, 0, 1);
      if (heroWrap) {
        heroWrap.style.transform =
          "translate3d(0," + (sy * 0.2).toFixed(1) + "px,0)";
        heroWrap.style.opacity = (1 - k * 1.15).toFixed(3);
      }
      if (heroCue) heroCue.style.opacity = cueOn ? (1 - k * 3).toFixed(3) : "0";
    }
    mq.forEach((m) => {
      const o = (sy * 0.42) % m.w;
      m.tr.style.transform =
        "translate3d(" + (m.dir < 0 ? -o : o - m.w).toFixed(1) + "px,0,0)";
    });
    for (let q = 0; q < scrubs.length; q++) {
      const sc = scrubs[q],
        r = rects[q];
      if (r.bottom < -50 || r.top > vh + 50) continue;
      const p = reduce ? 1 : clamp((vh * 0.92 - r.top) / (vh * 0.42), 0, 1);
      if (Math.abs(p - sc.p) < 0.004) continue;
      sc.p = p;
      const nw = sc.w.length,
        f = p * (nw + 2.2);
      sc.w.forEach((w, k) => {
        const a = clamp(f - k, 0, 1);
        w.style.setProperty("--a", a.toFixed(3));
        w.classList.toggle("cur", a > 0 && a < 0.999);
      });
    }
    menuMark();
  }
  addEventListener(
    "scroll",
    () => {
      if (!sm.active) {
        sm.cur = sm.target = scrollY;
      }
      onScroll();
    },
    { passive: true },
  );
  addEventListener("resize", () => {
    measure();
    onScroll();
    resizeStream();
  });
  if (window.ResizeObserver)
    new ResizeObserver(() => {
      measure();
      onScroll();
    }).observe($("main") || document.body);

  /* ============ gentle wheel smoothing (mouse wheels only; trackpads keep native feel) + anchor scrolling ============ */
  const sm = { cur: scrollY, target: scrollY, active: false };
  let loopAlive = false;
  function smStep() {
    if (!sm.active) return;
    sm.cur = lerp(sm.cur, sm.target, 0.09);
    if (Math.abs(sm.target - sm.cur) < 0.5) {
      sm.cur = sm.target;
      sm.active = false;
    }
    scrollTo(0, sm.cur);
  }
  function smoothTo(y) {
    const max = root.scrollHeight - innerHeight;
    if (reduce) {
      scrollTo(0, clamp(y, 0, max));
      return;
    }
    sm.cur = scrollY;
    sm.target = clamp(y, 0, max);
    sm.active = true;
  }
  if (fine && !reduce) {
    addEventListener(
      "wheel",
      (e) => {
        if (!loopAlive || e.ctrlKey || root.classList.contains("menu-open"))
          return; // the smoothing is driven by tick(); without it the page keeps native scrolling
        const mouseLike =
          e.deltaMode === 1 ||
          (e.wheelDeltaY && Math.abs(e.wheelDeltaY) % 120 === 0);
        if (!mouseLike || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        e.preventDefault();
        if (!sm.active) ((sm.cur = scrollY), (sm.target = scrollY));
        const dy = e.deltaY * (e.deltaMode === 1 ? 38 : 1);
        sm.target = clamp(
          sm.target + dy * 1.05,
          0,
          root.scrollHeight - innerHeight,
        );
        sm.active = true;
      },
      { passive: false },
    );
    addEventListener("keydown", (e) => {
      if (
        [
          "ArrowDown",
          "ArrowUp",
          "PageDown",
          "PageUp",
          "Home",
          "End",
          " ",
        ].includes(e.key)
      )
        sm.active = false;
    });
    addEventListener(
      "pointerdown",
      () => {
        sm.active = false;
      },
      { passive: true },
    );
  }

  /* ============ menu ============ */
  const mbtn = $(".mbtn"),
    menuEl = $(".menu");
  const mitems = $$(".menu button[data-i]");
  function setMenu(on) {
    if (!mbtn || !menuEl) return;
    root.classList.toggle("menu-open", on);
    mbtn.setAttribute("aria-expanded", on ? "true" : "false");
    menuEl.setAttribute("aria-hidden", on ? "false" : "true");
    if (on) mitems.forEach((b, i) => b.classList.toggle("on", i === curIdx));
  }
  let lastMark = -1;
  function menuMark() {
    if (curIdx !== lastMark) {
      lastMark = curIdx;
      mitems.forEach((b, i) => b.classList.toggle("on", i === curIdx));
    }
  }
  if (mbtn)
    mbtn.addEventListener("click", () =>
      setMenu(!root.classList.contains("menu-open")),
    );
  addEventListener("keydown", (e) => {
    if (e.key === "Escape") setMenu(false);
  });
  mitems.forEach((b) =>
    b.addEventListener("click", () => {
      const i = +b.dataset.i;
      setMenu(false);
      setTimeout(() => smoothTo(tops[i] || 0), 120);
    }),
  );
  if (menuEl)
    menuEl.addEventListener("click", (e) => {
      if (e.target === menuEl) setMenu(false);
    });
  $$('a[href="#end"]').forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      setMenu(false);
      smoothTo(tops[secs.length - 1]);
    }),
  );

  /* ============ glass spotlight + tilt, magnetic CTA ============ */
  $$(".glass,.ph").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch") return;
      const r = el.getBoundingClientRect(),
        x = (e.clientX - r.left) / r.width,
        y = (e.clientY - r.top) / r.height;
      el.style.setProperty("--sx", x * 100 + "%");
      el.style.setProperty("--sy", y * 100 + "%");
      if (
        el.matches(".stat,.card,.ph") &&
        !reduce &&
        !el.hasAttribute("data-r")
      )
        el.style.transform =
          "perspective(900px) rotateX(" +
          ((0.5 - y) * 9).toFixed(2) +
          "deg) rotateY(" +
          ((x - 0.5) * 11).toFixed(2) +
          "deg) translateZ(0)";
    });
    el.addEventListener("pointerleave", () => {
      if (el.matches(".stat,.card,.ph")) el.style.transform = "";
    });
  });
  $$(".cta").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      if (e.pointerType === "touch" || reduce) return;
      const r = el.getBoundingClientRect();
      el.style.transform =
        "translate(" +
        ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) +
        "px," +
        ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) +
        "px)";
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "";
    });
  });

  /* ============ interactive 3D figures: one shared WebGL context ============ */
  const SRC = window.__FIGS_GLSL__,
    LOGO = window.__LOGO_SDF__;
  /* Figure frames are rendered off screen (band by band, into rfbo) and handed to each figure's own <canvas> when complete.
   Where the browser can, the WebGL context lives on an OffscreenCanvas and a finished frame is passed on as an ImageBitmap
   (transferToImageBitmap -> "bitmaprenderer"): no pixel copy and no CPU<->GPU sync on the main thread. Otherwise the frame is
   copied into a 2D canvas with drawImage (the older path, which in some browsers reads the pixels back synchronously). */
  const MAXPX = 1400; // largest figure frame in device pixels (size of the off-screen render target)
  const GLA = {
    alpha: true,
    premultipliedAlpha: true,
    antialias: false,
    preserveDrawingBuffer: false,
    powerPreference: "high-performance",
  };
  let GLC = null,
    gl = null,
    bmp = false;
  try {
    if (
      window.OffscreenCanvas &&
      OffscreenCanvas.prototype.transferToImageBitmap &&
      document.createElement("canvas").getContext("bitmaprenderer")
    ) {
      GLC = new OffscreenCanvas(16, 16);
      gl = GLC.getContext("webgl2", GLA);
      bmp = !!gl;
    }
  } catch (e) {
    gl = null;
    bmp = false;
  }
  if (!gl) {
    GLC = document.createElement("canvas");
    GLC.width = MAXPX;
    GLC.height = MAXPX;
    try {
      gl = GLC.getContext("webgl2", GLA);
    } catch (e) {}
  }
  const idle = (fn) =>
    window.requestIdleCallback
      ? requestIdleCallback(fn, { timeout: 900 })
      : setTimeout(fn, 60);
  /* Device class: 2 = strong GPU, 1 = laptop / mid phone, 0 = weak. Only picks the starting point of the frame-rate
   controller in tick(); render resolution is never lowered below the screen's native pixels. */
  let tier = 2,
    soft = false;
  const FORCE = /[?&]forcegl/.test(location.search);
  (() => {
    const cores = navigator.hardwareConcurrency || 8,
      mem = navigator.deviceMemory || 8;
    if (mobile() || cores <= 4 || mem <= 4) tier = 1;
    if (mobile() && (cores <= 6 || mem <= 3)) tier = 0;
    try {
      const e = gl && gl.getExtension("WEBGL_debug_renderer_info");
      const r = e
        ? String(gl.getParameter(e.UNMASKED_RENDERER_WEBGL) || "")
        : "";
      if (/swiftshader|llvmpipe|software|basic render/i.test(r) && !FORCE) {
        gl = null;
        soft = true;
      } // no real GPU: skip the 3D, the page stays fast
      else if (
        /mali-?[gt]?[2-7]\d\d\b|adreno[^0-9]*[1-5]\d\d\b|powervr/i.test(r)
      )
        tier = 0;
      else if (/intel/i.test(r) && !/arc/i.test(r)) tier = Math.min(tier, 1);
    } catch (_) {}
    root.classList.add("t" + tier);
  })();

  /* ============ hero data stream: full screen, computed on the GPU (a lighter 2D canvas version where WebGL is missing) ============ */
  const sc = $("canvas.stream"),
    heroEl = $(".hero");
  const ST = {
    I: -1,
    t0: 0,
    travel: 2.7,
    wv: 1,
    warp: 1,
    kick: 0,
    chg: 0,
    flash: 0,
    hold: false,
    lx: 0,
    ly: 0,
    qx: 0,
    qy: 0,
    pon: 0,
    rings: [],
    burst: false,
    bumped: false,
    dirty: true,
    W: 2,
    H: 2,
    D: 1,
    cw: 2,
    ch: 2,
    diag: 1,
    bx: 0,
    by: 0,
    vx: 0,
    vy: 0,
    zone: [0, 0, 1, 1],
    chars: [],
    inst: null,
  };
  const easeOut3 = (x) => 1 - Math.pow(1 - x, 3),
    sstep = (a, b, x) => {
      x = clamp((x - a) / (b - a), 0, 1);
      return x * x * (3 - 2 * x);
    };
  const REV_T0 = 0.55,
    REV_DUR = 1.9; // seconds after the page "goes": the light point, then the burst that floods the screen
  const docPos = (el) => {
    let x = 0,
      y = 0;
    while (el) {
      x += el.offsetLeft;
      y += el.offsetTop;
      el = el.offsetParent;
    }
    return { x, y };
  };
  /* Every streak is described by 8 numbers; its position over time is pure maths in the vertex shader, so the CPU only
   sends ~30 numbers per frame. Same seed every time = same picture on every device. */
  function mkInst(n) {
    const a = new Float32Array(n * 8);
    let s = 20241110;
    const r = () => {
      s = (s + 0x6d2b79f5) | 0;
      let t = Math.imul(s ^ (s >>> 15), 1 | s);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = 0; i < n; i++) {
      const o = i * 8;
      a[o] = r();
      a[o + 1] = r();
      a[o + 2] = (4 + Math.floor(r() * 11)) / 8;
      a[o + 3] = r(); // angle, depth phase, speed (multiple of 1/8 so the loop closes), length
      a[o + 4] = r();
      a[o + 5] = r();
      a[o + 6] = 0.25 + r() * 0.75;
      a[o + 7] = r();
    } // width, colour, brightness, dash/dust
    return a;
  }
  const SV = `#version 300 es
precision highp float;
layout(location=0) in vec4 A;
layout(location=1) in vec4 B;
uniform vec2 uRes,uVP;uniform float uTrav,uWarp,uChg,uDpr,uDiag,uRev;uniform vec3 uPtr;uniform vec4 uRing[4];
out vec4 vC;out vec3 vS;
vec3 pal(float s){return s<.42?vec3(.694,1.,0.):s<.78?vec3(.075,.949,.863):s<.9?vec3(.384,.976,.431):vec3(1.);}
void main(){
  int id=gl_VertexID;
  float u=float(id>>1)/8.;
  float side=float(id&1)*2.-1.;
  float ang=A.x*6.2831853;
  vec2 dir=vec2(cos(ang),sin(ang));
  float dust=step(.8,B.w);
  float L=(dust>.5?.004+.012*A.w:.02+.1*A.w*A.w)*(1.+.09*(uWarp-1.));
  float zh=fract(A.y-uTrav*A.z);
  float zt=min(zh+L,1.);
  float zu=max(mix(zt,zh,u),.004);
  float lane=fract(A.y*91.7+A.x*37.3);
  float r=.03*uDiag*mix(.55,3.,lane*lane)*(1.-.1*uChg)*(1./zu-1.);
  vec2 pos=uVP+dir*r;
  float depth=1.-zu;
  float wpx=uDpr*(.55+1.3*B.x)*mix(.4,1.9,pow(depth,.55))*(1.+.5*uChg)*mix(.15,1.,pow(u,.7));
  float hw=max(wpx*1.5,1.4*uDpr);
  float en=min(1.,wpx*1.5/hw);
  vec2 nrm=vec2(-dir.y,dir.x);
  pos+=dir*(u*2.-1.)*hw*1.4+nrm*side*hw;
  vec2 d=pos-uPtr.xy;float R=170.*uDpr;
  pos+=d/(length(d)+1.)*34.*uDpr*exp(-dot(d,d)/(R*R))*uPtr.z;
  float rb=0.;
  for(int i=0;i<4;i++){vec4 g=uRing[i];if(g.w>0.){vec2 q=pos-g.xy;float dl=length(q);float rr=g.z*.9*uDiag;float w=(dl-rr)/(.05*uDiag);float b=exp(-w*w)*g.w*exp(-g.z*1.15);pos+=q/(dl+1.)*b*52.*uDpr;rb+=b;}}
  float fin=1.-smoothstep(.78,1.,zu);
  float fout=smoothstep(.016,.055,zu);
  float rev=1.-smoothstep(uRev-.24*uDiag,uRev,r);
  float br=(.28+.72*B.z)*fin*fout*rev*mix(.4,1.,pow(depth,.4))*en*(1.+.9*uChg)*(1.+2.4*rb);
  vC=vec4(mix(pal(B.y),vec3(1.),clamp(.6*u*u*u+.25*rb,0.,1.)),br);
  vS=vec3(side,u,B.w);
  gl_Position=vec4(pos/uRes*vec2(2.,-2.)+vec2(-1.,1.),0.,1.);
}`;
  const SF = `#version 300 es
precision highp float;
in vec4 vC;in vec3 vS;
uniform vec2 uRes;uniform vec3 uPtr;uniform float uDpr;uniform vec4 uZone;
out vec4 o;
void main(){
  float s=vS.x,u=vS.y,dd=vS.z;
  float prof=exp(-s*s*4.2)*(1.-smoothstep(.6,1.,abs(s)));
  float along=(pow(u,1.8)+1.2*exp(-(1.-u)*20.))*(1.-smoothstep(.9,1.,u));
  float dsh=1.;
  if(dd<.3){float f=fract(u*6.+dd*13.);dsh=mix(.12,1.,smoothstep(.28,.5,f)*(1.-smoothstep(.78,.96,f)));}
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  vec2 q=p-uPtr.xy;float R=190.*uDpr;
  float g=exp(-dot(q,q)/(2.*R*R))*uPtr.z;
  vec2 zq=abs(p-uZone.xy)-uZone.zw;
  float sd=length(max(zq,0.))+min(max(zq.x,zq.y),0.);
  float zk=mix(.46,1.,smoothstep(0.,240.*uDpr,sd));
  float I=prof*along*dsh*vC.a*(1.+2.*g)*zk;
  o=vec4(vC.rgb*I,1.);
}`;
  const BV = `#version 300 es
void main(){vec2 p=vec2(float((gl_VertexID<<1)&2),float(gl_VertexID&2));gl_Position=vec4(p*2.-1.,0.,1.);}`;
  const BF = `#version 300 es
precision highp float;
uniform vec2 uRes,uVP;uniform float uDpr,uDiag,uRev,uCore,uChg,uFlash,uFlare,uGlow;uniform vec4 uRing[4];uniform vec3 uPtr;
out vec4 o;
void main(){
  vec2 p=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y);
  vec2 d=p-uVP;float l=length(d);float r=l/uDiag;
  float rev=1.-smoothstep(uRev-.3*uDiag,uRev,l);
  vec3 col=vec3(.008,.016,.024);
  vec3 amb=vec3(.07,.95,.86)*(.12*exp(-r*3.2)+.05*exp(-r*1.15));
  amb+=vec3(.69,1.,0.)*.032*exp(-length(p-vec2(0.,uRes.y*.92))/(uDiag*.5));
  amb+=vec3(.07,.95,.86)*.02*exp(-length(p-vec2(uRes.x*.95,uRes.y))/(uDiag*.45));
  col+=amb*uGlow*rev*(1.+.7*uChg);
  float cr=(4.+14.*uCore+40.*uChg+62.*uFlash)*uDpr;
  float core=(.5+.7*uChg+1.0*uFlash)*uCore/(1.+pow(l/cr,2.4));
  col+=mix(vec3(.15,.95,.9),vec3(1.),smoothstep(.2,1.,core))*core;
  col+=vec3(.35,.95,1.)*uFlare*exp(-abs(d.y)/(1.2*uDpr))*exp(-abs(d.x)/(uDiag*.14));
  for(int i=0;i<4;i++){vec4 g=uRing[i];if(g.w>0.){float q=length(p-g.xy);float rr=g.z*.9*uDiag;float w1=(q-rr)/(.012*uDiag),w2=(q-rr)/(.07*uDiag);float dec=g.w*exp(-g.z*1.15);col+=vec3(.3,.95,.9)*(.5*exp(-w1*w1)+.11*exp(-w2*w2))*dec;}}
  vec2 pq=p-uPtr.xy;col+=vec3(.07,.95,.86)*.05*exp(-dot(pq,pq)/(2.*pow(220.*uDpr,2.)))*uPtr.z;
  col+=(fract(52.9829189*fract(dot(gl_FragCoord.xy,vec2(.06711056,.00583715))))-.5)/255.;
  o=vec4(col,1.);
}`;
  let SG = null,
    S2 = null,
    N2 = 0;
  function initStreamGL() {
    if (soft && !FORCE) return null;
    let g = null;
    try {
      g = sc.getContext("webgl2", {
        alpha: false,
        antialias: false,
        depth: false,
        stencil: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance",
      });
    } catch (e) {}
    if (!g) return null;
    const sh = (t, s) => {
      const x = g.createShader(t);
      g.shaderSource(x, s);
      g.compileShader(x);
      return x;
    };
    const pg = (v, f, names) => {
      const p = g.createProgram();
      g.attachShader(p, sh(g.VERTEX_SHADER, v));
      g.attachShader(p, sh(g.FRAGMENT_SHADER, f));
      g.linkProgram(p);
      if (!g.getProgramParameter(p, g.LINK_STATUS)) {
        console.warn(g.getProgramInfoLog(p));
        return null;
      }
      const u = {};
      names.forEach((n) => (u[n] = g.getUniformLocation(p, n)));
      return { p, u };
    };
    const ps = pg(SV, SF, [
      "uRes",
      "uVP",
      "uTrav",
      "uWarp",
      "uChg",
      "uDpr",
      "uDiag",
      "uRev",
      "uPtr",
      "uRing",
      "uZone",
    ]);
    const pb = pg(BV, BF, [
      "uRes",
      "uVP",
      "uDpr",
      "uDiag",
      "uRev",
      "uCore",
      "uChg",
      "uFlash",
      "uFlare",
      "uGlow",
      "uRing",
      "uPtr",
    ]);
    if (!ps || !pb) return null;
    const n = mobile() ? 1500 : 2200;
    ST.inst = mkInst(n);
    const vao = g.createVertexArray();
    g.bindVertexArray(vao);
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, ST.inst, g.STATIC_DRAW);
    g.enableVertexAttribArray(0);
    g.vertexAttribPointer(0, 4, g.FLOAT, false, 32, 0);
    g.vertexAttribDivisor(0, 1);
    g.enableVertexAttribArray(1);
    g.vertexAttribPointer(1, 4, g.FLOAT, false, 32, 16);
    g.vertexAttribDivisor(1, 1);
    g.bindVertexArray(null);
    return { g, ps, pb, vao, n, ring: new Float32Array(16) };
  }
  const COLS = [
    [177, 255, 0],
    [19, 242, 220],
    [98, 249, 110],
    [255, 255, 255],
  ];
  function init2D() {
    const x = sc.getContext("2d");
    if (!x) return null;
    const sprites = COLS.map((c) => {
      const cv = document.createElement("canvas");
      cv.width = 256;
      cv.height = 16;
      const q = cv.getContext("2d");
      const g = q.createLinearGradient(0, 0, 256, 0);
      g.addColorStop(0, `rgba(${c},0)`);
      g.addColorStop(0.55, `rgba(${c},1)`);
      g.addColorStop(1, `rgba(${c},0)`);
      q.fillStyle = g;
      q.fillRect(0, 0, 256, 16);
      q.globalCompositeOperation = "destination-in";
      const v = q.createLinearGradient(0, 0, 0, 16);
      v.addColorStop(0, "rgba(0,0,0,0)");
      v.addColorStop(0.5, "rgba(0,0,0,1)");
      v.addColorStop(1, "rgba(0,0,0,0)");
      q.fillStyle = v;
      q.fillRect(0, 0, 256, 16);
      return cv;
    });
    N2 = mobile() ? 380 : 640;
    ST.inst = mkInst(N2);
    return { x, sprites };
  }
  SG = initStreamGL();
  if (!SG) S2 = init2D();
  root.classList.add(SG ? "sgl" : "s2d");
  if (/[?&]dbg/.test(location.search)) window.__ST = ST;

  function measureChars() {
    ST.chars.forEach((c) => {
      const p = docPos(c.el);
      c.x = p.x + c.el.offsetWidth / 2;
      c.y = p.y + c.el.offsetHeight / 2;
    });
  }
  function resizeStream() {
    const r = sc.getBoundingClientRect();
    const cw = Math.max(2, r.width),
      chh = Math.max(2, r.height);
    const D = Math.max(
      0.85,
      Math.min(devicePixelRatio || 1, 1.5, Math.sqrt(4.4e6 / (cw * chh))),
    ); // the streaks are soft light, so 1.5x is plenty
    ST.cw = cw;
    ST.ch = chh;
    ST.D = D;
    ST.W = Math.round(cw * D);
    ST.H = Math.round(chh * D);
    if (sc.width !== ST.W || sc.height !== ST.H) {
      sc.width = ST.W;
      sc.height = ST.H;
    }
    const m = cw < 800;
    ST.bx = cw * (m ? 0.5 : 0.68);
    ST.by = chh * (m ? 0.36 : 0.36);
    ST.diag = Math.hypot(cw, chh);
    if (!went) {
      ST.vx = ST.bx;
      ST.vy = ST.by;
    }
    // area of the title + subtitle: the streaks are dimmed behind it so the text always reads
    const els = [$(".hero h1"), $(".hero .sub")].filter(Boolean);
    if (els.length) {
      let x0 = 1e9,
        y0 = 1e9,
        x1 = -1e9,
        y1 = -1e9;
      const top = r.top + scrollY;
      els.forEach((e) => {
        const p = docPos(e);
        x0 = Math.min(x0, p.x);
        y0 = Math.min(y0, p.y);
        x1 = Math.max(x1, p.x + e.offsetWidth);
        y1 = Math.max(y1, p.y + e.offsetHeight);
      });
      ST.zone = [
        ((x0 + x1) / 2) * D,
        ((y0 + y1 - 2 * top) / 2) * D,
        ((x1 - x0) / 2) * D,
        ((y1 - y0) / 2) * D,
      ];
    }
    measureChars();
    ST.dirty = true;
  }
  let last = performance.now(),
    heroVis = true;
  new IntersectionObserver((es) => {
    heroVis = es[0].isIntersecting;
    if (heroVis) ST.dirty = true;
  }).observe(sc);

  /* intro: the title letters appear in a wave that follows the burst out of the light point */
  function prepIntro() {
    resizeStream();
    const diag = ST.diag;
    ST.chars = $$(".hero h1 .ch").map((el, k) => {
      const p = docPos(el),
        x = p.x + el.offsetWidth / 2,
        y = p.y + el.offsetHeight / 2;
      // each letter lights up when the shock ring of the burst (it travels .9 screen-diagonals per second) reaches it
      el.style.setProperty(
        "--dl",
        (
          REV_T0 +
          Math.hypot(x - ST.bx, y - ST.by) / (0.9 * diag) +
          0.03 +
          k * 0.004
        ).toFixed(3) + "s",
      );
      return { el, x, y, b: 0 };
    });
  }
  /* press and hold charges the stream, release sends shock waves through it */
  const addRing = (x, y, a) => {
    ST.rings.push({ x, y, t: performance.now(), a });
    if (ST.rings.length > 4) ST.rings.shift();
  };
  heroEl.addEventListener(
    "pointerdown",
    (e) => {
      if (e.button > 0 || e.target.closest("a,button") || !went) return;
      ST.hold = true;
      addRing(e.clientX, e.clientY + scrollY, 0.4);
    },
    { passive: true },
  );
  function releaseHold() {
    if (!ST.hold) return;
    ST.hold = false;
    const c = ST.chg;
    addRing(mouse.x, mouse.y + scrollY, 0.55 + 0.45 * c);
    if (c > 0.28) {
      addRing(ST.vx, ST.vy, 0.8 + 0.5 * c);
      ST.flash = Math.max(ST.flash, c);
      ST.kick = Math.max(ST.kick, 15 * c);
    } else ST.kick = Math.max(ST.kick, 3);
  }
  addEventListener("pointerup", releaseHold, { passive: true });
  addEventListener(
    "pointercancel",
    () => {
      ST.hold = false;
    },
    { passive: true },
  );
  addEventListener("blur", () => {
    ST.hold = false;
  });

  function streamUpdate(now, dt) {
    const still = reduce;
    ST.I = still ? 99 : went ? (now - ST.t0) / 1000 : -1;
    const I = ST.I;
    if (I >= REV_T0 && !ST.burst && !still) {
      ST.burst = true;
      addRing(ST.vx, ST.vy, 1.1);
      ST.flash = 1.1;
    }
    ST.chg = ST.hold
      ? ST.chg + (1 - ST.chg) * (1 - Math.exp(-dt * 2.2))
      : ST.chg * Math.exp(-dt * 4.5);
    ST.kick *= Math.exp(-dt * 1.7);
    ST.flash *= Math.exp(-dt * 2.6);
    const tgt = 1 + 9 * ST.chg * ST.chg + ST.kick;
    ST.warp += (tgt - ST.warp) * (1 - Math.exp(-dt * 6));
    const intro =
      I >= REV_T0 && !still ? 1 + 26 * Math.exp(-(I - REV_T0) * 1.75) : 1;
    const w = Math.max(ST.warp, intro);
    ST.wv = w;
    if (!still) ST.travel = (ST.travel + dt * w * 0.11) % 8;
    // the camera leans toward the pointer; the light point drifts a little by itself
    const px = mouse.has ? mouse.x / innerWidth - 0.5 : 0,
      py = mouse.has ? mouse.y / innerHeight - 0.5 : 0,
      t = now / 1000;
    ST.lx += (px - ST.lx) * (1 - Math.exp(-dt * 3));
    ST.ly += (py - ST.ly) * (1 - Math.exp(-dt * 3));
    const k = still ? 0 : 1;
    ST.vx =
      ST.bx + k * (ST.lx * 0.09 * ST.cw + Math.sin(t * 0.23) * 0.012 * ST.cw);
    ST.vy =
      ST.by + k * (ST.ly * 0.1 * ST.ch + Math.cos(t * 0.19) * 0.014 * ST.ch);
    const on =
      mouse.has && !still && (fine || ST.hold) && mouse.y < innerHeight ? 1 : 0;
    ST.pon += (on - ST.pon) * (1 - Math.exp(-dt * 6));
    ST.qx += (mouse.x - ST.qx) * (1 - Math.exp(-dt * 16));
    ST.qy += (mouse.y + scrollY - ST.qy) * (1 - Math.exp(-dt * 16));
    while (ST.rings.length && now - ST.rings[0].t > 2600) ST.rings.shift();
  }
  function drawGL(now) {
    const g = SG.g,
      D = ST.D,
      I = ST.I,
      diag = ST.diag * D;
    const rv =
      (I < REV_T0 ? 0 : easeOut3(clamp((I - REV_T0) / REV_DUR, 0, 1)) * 1.5) *
      diag;
    const core = I < 0 ? 0 : sstep(0, 0.6, I),
      glow = I < 0 ? 0 : sstep(0.2, 1.5, I);
    const flare =
      I < 0
        ? 0
        : sstep(0.05, 0.5, I) * (1 - 0.8 * sstep(REV_T0, REV_T0 + 1.2, I)) +
          ST.flash * 0.6;
    const rg = SG.ring;
    rg.fill(0);
    ST.rings.forEach((r, i) => {
      rg[i * 4] = r.x * D;
      rg[i * 4 + 1] = r.y * D;
      rg[i * 4 + 2] = Math.max(0, (now - r.t) / 1000);
      rg[i * 4 + 3] = r.a;
    });
    g.viewport(0, 0, ST.W, ST.H);
    g.disable(g.BLEND);
    let u = SG.pb.u;
    g.useProgram(SG.pb.p);
    g.uniform2f(u.uRes, ST.W, ST.H);
    g.uniform2f(u.uVP, ST.vx * D, ST.vy * D);
    g.uniform1f(u.uDpr, D);
    g.uniform1f(u.uDiag, diag);
    g.uniform1f(u.uRev, rv);
    g.uniform1f(u.uCore, core);
    g.uniform1f(u.uChg, ST.chg);
    g.uniform1f(u.uFlash, Math.min(ST.flash, 1.5));
    g.uniform1f(u.uFlare, flare);
    g.uniform1f(u.uGlow, glow);
    g.uniform4fv(u.uRing, rg);
    g.uniform3f(u.uPtr, ST.qx * D, ST.qy * D, ST.pon);
    g.drawArrays(g.TRIANGLES, 0, 3);
    if (I < REV_T0 && !reduce) return;
    g.enable(g.BLEND);
    g.blendFunc(g.ONE, g.ONE);
    u = SG.ps.u;
    g.useProgram(SG.ps.p);
    g.uniform2f(u.uRes, ST.W, ST.H);
    g.uniform2f(u.uVP, ST.vx * D, ST.vy * D);
    g.uniform1f(u.uTrav, ST.travel);
    g.uniform1f(u.uWarp, ST.wv);
    g.uniform1f(u.uChg, ST.chg);
    g.uniform1f(u.uDpr, D);
    g.uniform1f(u.uDiag, diag);
    g.uniform1f(u.uRev, rv);
    g.uniform3f(u.uPtr, ST.qx * D, ST.qy * D, ST.pon);
    g.uniform4fv(u.uRing, rg);
    g.uniform4f(u.uZone, ST.zone[0], ST.zone[1], ST.zone[2], ST.zone[3]);
    g.bindVertexArray(SG.vao);
    g.drawArraysInstanced(g.TRIANGLE_STRIP, 0, 18, SG.n);
    g.bindVertexArray(null);
  }
  function draw2D(now) {
    const x = S2.x,
      W = ST.W,
      H = ST.H,
      D = ST.D,
      I = ST.I,
      diag = ST.diag * D,
      vx = ST.vx * D,
      vy = ST.vy * D;
    x.globalCompositeOperation = "source-over";
    x.setTransform(1, 0, 0, 1, 0, 0);
    x.globalAlpha = 1;
    x.fillStyle = "#020406";
    x.fillRect(0, 0, W, H);
    if (I < 0) return;
    const rv =
        (I < REV_T0 ? 0 : easeOut3(clamp((I - REV_T0) / REV_DUR, 0, 1)) * 1.5) *
        diag,
      ga = sstep(0.2, 1.5, I),
      core = sstep(0, 0.6, I);
    const gr = x.createRadialGradient(vx, vy, 0, vx, vy, diag * 0.6);
    gr.addColorStop(0, `rgba(19,242,220,${(0.32 + 0.3 * ST.chg) * ga})`);
    gr.addColorStop(0.35, `rgba(19,242,220,${0.09 * ga})`);
    gr.addColorStop(0.7, `rgba(177,255,0,${0.03 * ga})`);
    gr.addColorStop(1, "rgba(0,0,0,0)");
    x.fillStyle = gr;
    x.fillRect(0, 0, W, H);
    if (I >= REV_T0 || reduce) {
      x.globalCompositeOperation = "lighter";
      const A = ST.inst,
        k0 = 0.03 * diag * (1 - 0.1 * ST.chg),
        mx = ST.qx * D,
        my = ST.qy * D,
        R2 = 2 * (190 * D) * (190 * D),
        zn = ST.zone;
      for (let i = 0; i < N2; i++) {
        const o = i * 8,
          ang = A[o] * 6.2831853,
          cs = Math.cos(ang),
          sn = Math.sin(ang);
        const zh = (((A[o + 1] - ST.travel * A[o + 2]) % 1) + 1) % 1,
          dust = A[o + 7] > 0.8;
        const L =
          (dust ? 0.004 + 0.012 * A[o + 3] : 0.02 + 0.1 * A[o + 3] * A[o + 3]) *
          (1 + 0.09 * (ST.wv - 1));
        const lane = (A[o + 1] * 91.7 + A[o] * 37.3) % 1,
          kk = k0 * (0.55 + 2.45 * lane * lane);
        const zt = Math.min(zh + L, 1),
          rh = kk * (1 / Math.max(zh, 0.004) - 1),
          rt = kk * (1 / Math.max(zt, 0.004) - 1),
          len = rh - rt;
        if (rh > diag * 1.2 || len < 1.5) continue;
        const depth = 1 - zh,
          hx = vx + cs * rh,
          hy = vy + sn * rh;
        let a =
          (0.28 + 0.72 * A[o + 6]) *
          (1 - sstep(0.78, 1, zh)) *
          sstep(0.016, 0.055, zh) *
          (1 - sstep(rv - 0.24 * diag, rv, rh)) *
          (0.4 + 0.6 * Math.pow(depth, 0.4)) *
          (1 + 0.9 * ST.chg);
        if (ST.pon > 0.02) {
          const dx = hx - mx,
            dy = hy - my;
          a *= 1 + 2 * ST.pon * Math.exp(-(dx * dx + dy * dy) / R2);
        }
        if (Math.abs(hx - zn[0]) < zn[2] && Math.abs(hy - zn[1]) < zn[3])
          a *= 0.5;
        a = Math.min(1, a);
        if (a < 0.02) continue;
        const wd =
          (0.55 + 1.3 * A[o + 4]) *
          (0.4 + 1.5 * Math.pow(depth, 0.55)) *
          D *
          2.4 *
          (1 + 0.5 * ST.chg);
        const c = A[o + 5];
        x.globalAlpha = a;
        x.setTransform(
          (cs * len) / 256,
          (sn * len) / 256,
          (-sn * wd) / 16,
          (cs * wd) / 16,
          vx + cs * rt,
          vy + sn * rt,
        );
        x.drawImage(
          S2.sprites[c < 0.42 ? 0 : c < 0.78 ? 1 : c < 0.9 ? 2 : 3],
          0,
          -8,
        );
      }
      x.setTransform(1, 0, 0, 1, 0, 0);
      x.globalAlpha = 1;
      ST.rings.forEach((r) => {
        const age = Math.max(0, (now - r.t) / 1000),
          a = r.a * Math.exp(-age * 1.15) * 0.5;
        if (a < 0.02) return;
        x.strokeStyle = `rgba(90,255,230,${a})`;
        x.lineWidth = 2 * D;
        x.beginPath();
        x.arc(r.x * D, r.y * D, age * 0.9 * diag, 0, 6.2832);
        x.stroke();
      });
    }
    const cr = (10 + 30 * core + 70 * ST.chg + 100 * ST.flash) * D,
      cg = x.createRadialGradient(vx, vy, 0, vx, vy, cr);
    const ca = Math.min(1, core * (0.7 + 0.6 * ST.chg + ST.flash));
    cg.addColorStop(0, `rgba(255,255,255,${ca})`);
    cg.addColorStop(0.25, `rgba(120,255,235,${ca * 0.55})`);
    cg.addColorStop(1, "rgba(19,242,220,0)");
    x.globalCompositeOperation = "lighter";
    x.fillStyle = cg;
    x.fillRect(vx - cr, vy - cr, cr * 2, cr * 2);
  }
  /* letters ride the shock waves */
  function bumpText(now) {
    const chs = ST.chars;
    if (!chs.length) return;
    const rs = ST.rings;
    if (!rs.length) {
      if (ST.bumped) {
        chs.forEach((c) => {
          c.el.style.translate = "";
          c.el.style.scale = "";
          c.b = 0;
        });
        ST.bumped = false;
      }
      return;
    }
    if (reduce) return;
    ST.bumped = true;
    const diag = ST.diag,
      off = scrollY * 0.2;
    for (const c of chs) {
      let b = 0;
      const y = c.y + off;
      for (const g of rs) {
        const age = Math.max(0, (now - g.t) / 1000),
          w =
            (Math.hypot(c.x - g.x, y - g.y) - age * 0.9 * diag) / (0.05 * diag);
        b += g.a * Math.exp(-w * w) * Math.exp(-age * 1.15);
      }
      b = Math.min(b, 1.4);
      if (Math.abs(b - c.b) > 0.01) {
        c.b = b;
        c.el.style.translate = "0 " + (-b * 16).toFixed(1) + "px";
        c.el.style.scale = (1 + b * 0.07).toFixed(3);
      }
    }
  }
  function streamFrame(now) {
    const dt = Math.min(0.05, Math.max(0, (now - last) / 1000));
    if (reduce && !ST.dirty) return;
    streamUpdate(now, dt);
    if (SG) drawGL(now);
    else if (S2) draw2D(now);
    bumpText(now);
    ST.dirty = false;
  }

  const progs = {};
  let tex = null,
    quad = null,
    texReady = false,
    mfbo = null,
    rfbo = null,
    pbo = null,
    tq = null;
  const pex = gl && gl.getExtension("KHR_parallel_shader_compile");
  const f32 = new Float32Array(1),
    u32 = new Uint32Array(f32.buffer);
  function toHalf(v) {
    f32[0] = v;
    const x = u32[0],
      s = (x >>> 16) & 0x8000;
    let e = ((x >>> 23) & 0xff) - 112,
      m = x & 0x7fffff;
    if (e <= 0) {
      if (e < -10) return s;
      m = (m | 0x800000) >> (1 - e);
      return s | ((m + 0x1000) >> 13);
    }
    if (e >= 31) return s | 0x7c00;
    return s | (e << 10) | ((m + 0x1000) >> 13);
  }
  function initGL() {
    if (!gl || quad) return;
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 3, -1, -1, 3]),
      gl.STATIC_DRAW,
    );
    quad = b;
    tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RG16F,
      1,
      1,
      0,
      gl.RG,
      gl.HALF_FLOAT,
      new Uint16Array([0x3000, 0x3000]),
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // occupancy mask (unit 1): a coarse 1-ray-per-8px pass tells the full pass which cells are empty so it can skip them.
    // unit 2 holds a dummy texture that is bound while the mask itself is being drawn (no read/write feedback)
    const mk = (unit, w, h, nearest) => {
      const t = gl.createTexture();
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA8,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null,
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      return t;
    };
    const mt = mk(1, 192, 192);
    mk(2, 1, 1);
    mfbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, mfbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      mt,
      0,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    // figure frames are drawn into this off-screen target (band by band) and copied to the screen canvas when complete
    const rb = gl.createRenderbuffer();
    gl.bindRenderbuffer(gl.RENDERBUFFER, rb);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, MAXPX, MAXPX);
    rfbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, rfbo);
    gl.framebufferRenderbuffer(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.RENDERBUFFER,
      rb,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    pbo = gl.createBuffer();
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
    gl.bufferData(gl.PIXEL_PACK_BUFFER, 16, gl.STREAM_READ);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    try {
      tq = gl.getExtension("EXT_disjoint_timer_query_webgl2");
    } catch (_) {
      tq = null;
    }
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
  }
  /* logo distance field: two 16-bit channels (body | eyes) packed into an RGB png -> half-float signed distances.
   Decoded in small slices during idle time so scrolling never stalls on it. */
  let logoStarted = false;
  function loadLogo() {
    if (!gl || logoStarted) return;
    logoStarted = true;
    const img = new Image();
    img.onload = () => {
      const W = 1024,
        c = document.createElement("canvas");
      c.width = 2048;
      c.height = 1024;
      const x = c.getContext("2d", { willReadFrequently: true });
      x.drawImage(img, 0, 0);
      const d = x.getImageData(0, 0, 2048, 1024).data,
        out = new Uint16Array(W * W * 2),
        RNG = 0.12;
      let y = 0;
      const slice = () => {
        const end = Math.min(W, y + 96);
        for (; y < end; y++)
          for (let i = 0; i < W; i++) {
            const a = (y * 2048 + i) * 4,
              b = (y * 2048 + W + i) * 4,
              o = (y * W + i) * 2;
            out[o] = toHalf(((d[a] * 256 + d[a + 1]) / 65535 - 0.5) * 2 * RNG);
            out[o + 1] = toHalf(
              ((d[b] * 256 + d[b + 1]) / 65535 - 0.5) * 2 * RNG,
            );
          }
        if (y < W) {
          idle(slice);
          return;
        }
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RG16F,
          W,
          W,
          0,
          gl.RG,
          gl.HALF_FLOAT,
          out,
        );
        texReady = true;
        graceUntil = Math.max(graceUntil, performance.now() + 1200);
      };
      idle(slice);
    };
    img.crossOrigin = "anonymous";
    img.src = LOGO;
  }
  /* shaders are linked ahead of time (in parallel with the page when the browser supports it) so a figure never
   triggers a compile hitch while it scrolls into view */
  let streamOff = false,
    dgOn = false,
    dgTag = "",
    dgJs = 0,
    dgFreeze = false,
    dgMul = 1;
  const dgMax = {},
    dgLong = [];
  const dgT = () => (dgOn ? performance.now() : 0),
    dgM = (k, t0) => {
      if (!dgOn) return;
      const d = performance.now() - t0;
      if (!(dgMax[k] > d)) dgMax[k] = d;
    };
  function buildProg(S) {
    if (progs[S] !== undefined) return progs[S];
    const dt0 = dgT();
    const mk = (t, s) => {
      const x = gl.createShader(t);
      gl.shaderSource(x, s);
      gl.compileShader(x);
      return x;
    };
    const v = mk(
      gl.VERTEX_SHADER,
      "#version 300 es\nin vec2 p;void main(){gl_Position=vec4(p,0,1);}",
    );
    const f = mk(
      gl.FRAGMENT_SHADER,
      "#version 300 es\nprecision highp float;\n#define S " + S + "\n" + SRC,
    );
    const p = gl.createProgram();
    gl.attachShader(p, v);
    gl.attachShader(p, f);
    gl.linkProgram(p);
    dgM("compile", dt0);
    return (progs[S] = { p, v, f, S, state: 0 });
  }
  function getProg(S) {
    // -> program | 0 (still compiling) | null (failed)
    const o = buildProg(S);
    if (!o || o.state === 1) return o;
    if (pex && !gl.getProgramParameter(o.p, pex.COMPLETION_STATUS_KHR))
      return 0;
    if (!gl.getProgramParameter(o.p, gl.LINK_STATUS)) {
      console.warn(gl.getShaderInfoLog(o.f) || gl.getProgramInfoLog(o.p));
      return (progs[S] = null);
    }
    const u = {};
    ["R", "O", "P", "U", "M", "tex", "RP", "Q", "L", "msk", "MK"].forEach(
      (n) => (u[n] = gl.getUniformLocation(o.p, n)),
    );
    o.u = u;
    o.loc = gl.getAttribLocation(o.p, "p");
    o.state = 1;
    graceUntil = Math.max(graceUntil, performance.now() + 1200);
    return o;
  }
  const CAM = {
    0: [0.5, 0.2, 9.5],
    1: [-0.5, 0.18, 9],
    2: [0.7, 0.2, 11.5],
    4: [0.35, 0.12, 11],
    5: [0.5, 0.5, 11],
    6: [0.5, 0.15, 11],
    7: [0.5, 0.2, 12],
    8: [0.25, 0.12, 11],
    9: [0.5, 0.15, 11],
    10: [0.35, 0.1, 10],
    11: [0.4, 0.15, 11],
    12: [0.45, 0.12, 11],
    13: [0.45, 0.12, 11],
  };
  /* performance level: 0 = full (30 fps idle), 1 = 20 fps idle + 30 fps while scrolling, 2 = also 4 anti-alias rays, 3 = also 1.5x pixel density cap */
  let lvl = 0;
  const T0 = performance.now();
  const nowT = () => (performance.now() - T0) / 1000;
  const figs = $$(".fig").map((box, i) => {
    const S = +box.dataset.scene,
      cv = $("canvas", box),
      cam = CAM[S] || [0.4, 0.15, 11];
    const rp = new Float32Array(16);
    for (let k = 0; k < 4; k++) rp[k * 4 + 3] = -100;
    if (bmp) box.classList.add("bm");
    return {
      box,
      cs: 1,
      cv,
      ctx: cv.getContext(bmp ? "bitmaprenderer" : "2d"),
      S,
      cam,
      yaw: 0,
      pit: 0,
      lm: 0,
      tx: 0,
      ty: 0,
      mx: 0,
      my: 0,
      mi: 0,
      hover: false,
      press: 0,
      ck: -100,
      appear: 0,
      vis: false,
      seed: i * 1.7,
      drag: false,
      moved: false,
      lx: 0,
      ly: 0,
      sx0: 0,
      sy0: 0,
      started: null,
      rp,
      ri: 0,
      pickReq: null,
      cy: 0,
      cp: 0,
      lastEmit: -9,
      ex: 0,
      ey: 0,
      done: 0,
      cost: 5,
      cal: false,
      cpx: 0,
      boost: 1,
      jn: 0,
      lp: 0,
      wait: 0,
      dead: false,
      jm: 30,
    };
  });
  const fio = new IntersectionObserver(
    (es) =>
      es.forEach((e) => {
        const f = figs.find((x) => x.box === e.target);
        f.vis = e.isIntersecting;
        if (f.vis && f.started === null) f.started = performance.now();
      }),
    { rootMargin: "4% 0px 4% 0px" },
  );
  figs.forEach((f) => {
    fio.observe(f.box);
    const uv = (e) => {
      const r = f.box.getBoundingClientRect();
      return {
        x: (e.clientX - r.left - r.width / 2) / r.height,
        y: -(e.clientY - r.top - r.height / 2) / r.height,
        px: (e.clientX - r.left) / r.width,
        py: (e.clientY - r.top) / r.height,
      };
    };
    const hot = (e) => {
      const u = uv(e);
      f.tx = clamp(u.x, -0.5, 0.5);
      f.ty = clamp(u.y, -0.5, 0.5);
      f.lm = performance.now();
      f.box.style.setProperty("--hx", u.px * 100 + "%");
      f.box.style.setProperty("--hy", u.py * 100 + "%");
    };
    const emit = (x, y) => {
      if (reduce) return;
      f.pickReq = { x, y };
    };
    f.box.addEventListener("pointerenter", (e) => {
      f.hover = true;
      f.box.classList.add("hot");
      hot(e);
      if (e.pointerType !== "touch") {
        emit(f.tx, f.ty);
        if (f.S === 1) f.ck = nowT();
      }
    });
    f.box.addEventListener("pointerleave", () => {
      if (!f.drag) {
        f.hover = false;
        f.box.classList.remove("hot");
      }
    });
    f.box.addEventListener("pointermove", (e) => {
      hot(e);
      if (e.pointerType !== "touch" && !f.drag) {
        const d = Math.hypot(e.clientX - f.ex, e.clientY - f.ey);
        if (nowT() - f.lastEmit > 0.8 && d > 90) {
          f.ex = e.clientX;
          f.ey = e.clientY;
          f.lastEmit = nowT();
          emit(f.tx, f.ty);
        }
      }
      if (f.drag) {
        const dx = e.clientX - f.lx,
          dy = e.clientY - f.ly;
        if (!f.moved && Math.hypot(e.clientX - f.sx0, e.clientY - f.sy0) > 6) {
          f.moved = true;
          try {
            f.box.setPointerCapture(e.pointerId);
          } catch (_) {}
          f.box.classList.add("drag");
        }
        if (f.moved) {
          f.yaw = clamp(f.yaw + dx * 0.009, -2.2, 2.2);
          f.pit = clamp(f.pit + dy * 0.006, -1, 1);
        }
        f.lx = e.clientX;
        f.ly = e.clientY;
      }
    });
    f.box.addEventListener("pointerdown", (e) => {
      f.drag = true;
      f.moved = false;
      f.lx = f.sx0 = f.ex = e.clientX;
      f.ly = f.sy0 = f.ey = e.clientY;
      f.press = 1;
      f.hover = true;
      f.box.classList.add("hot", "touched");
      hot(e);
      f.ck = nowT();
      f.lastEmit = nowT();
      emit(f.tx, f.ty);
      if (e.pointerType === "touch") {
        f.mi = 1;
      }
    });
    const up = () => {
      f.drag = false;
      f.press = 0;
      f.box.classList.remove("drag");
      if (!fine || !f.box.matches(":hover")) {
        f.hover = false;
        f.box.classList.remove("hot");
      }
    };
    f.box.addEventListener("pointerup", up);
    f.box.addEventListener("pointercancel", up);
  });
  const pickBuf = new Uint8Array(4);
  const rot2 = (a, b, t) => {
    const c = Math.cos(t),
      s = Math.sin(t);
    return [a * c - b * s, a * s + b * c];
  };
  function bindCommon(f, pr, T, yaw, pit) {
    gl.useProgram(pr.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(pr.loc);
    gl.vertexAttribPointer(pr.loc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(pr.u.tex, 0);
    gl.uniform4f(pr.u.P, yaw, pit, f.cam[2], 0);
    gl.uniform4f(pr.u.U, reduce ? 1.2 : T, f.appear, f.mi, f.ck);
    gl.uniform4fv(pr.u.RP, f.rp);
  }
  /* ---- picking: a 1-pixel ray finds where on the figure the pointer touched; the answer is read back a frame or two later,
   so the main thread never waits for the GPU ---- */
  let pk = null;
  function startPick(f, pr, T) {
    const q = f.pickReq;
    f.pickReq = null;
    bindCommon(f, pr, T, f.cy, f.cp);
    gl.uniform3f(pr.u.M, q.x, q.y, 0);
    gl.uniform4f(pr.u.Q, 1, 0, 0, 0);
    gl.uniform2f(pr.u.R, 4, 4);
    gl.uniform2f(pr.u.O, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, 1, 1);
    gl.disable(gl.BLEND);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
    gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, 0);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    pk = {
      f,
      q,
      T,
      cy: f.cy,
      cp: f.cp,
      sync: gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0),
    };
    gl.flush();
  }
  function pollPick() {
    if (!pk || gl.getSyncParameter(pk.sync, gl.SYNC_STATUS) !== gl.SIGNALED)
      return;
    const { f, q, T, cy, cp } = pk;
    gl.deleteSync(pk.sync);
    pk = null;
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, pbo);
    gl.getBufferSubData(gl.PIXEL_PACK_BUFFER, 0, pickBuf);
    gl.bindBuffer(gl.PIXEL_PACK_BUFFER, null);
    if (pickBuf[2] < 128) return;
    const t = ((pickBuf[0] + pickBuf[1] / 255) / 255) * 16;
    let ro = [0, 0, -f.cam[2]],
      rd = [q.x, q.y, 1.9];
    const l = Math.hypot(...rd);
    rd = rd.map((v) => v / l);
    // same camera maths as the shader: yz by pitch, then xz by yaw
    let [a, b] = rot2(ro[1], ro[2], cp);
    ro[1] = a;
    ro[2] = b;
    [a, b] = rot2(rd[1], rd[2], cp);
    rd[1] = a;
    rd[2] = b;
    [a, b] = rot2(ro[0], ro[2], cy);
    ro[0] = a;
    ro[2] = b;
    [a, b] = rot2(rd[0], rd[2], cy);
    rd[0] = a;
    rd[2] = b;
    const k = f.ri;
    f.ri = (f.ri + 1) % 4;
    f.rp[k * 4] = ro[0] + rd[0] * t;
    f.rp[k * 4 + 1] = ro[1] + rd[1] * t;
    f.rp[k * 4 + 2] = ro[2] + rd[2] * t;
    f.rp[k * 4 + 3] = T;
  }

  /* ---- GPU time budget ----
   A figure frame is cut into horizontal bands, one band is sent per page frame and the finished picture is shown with the
   last band. Each band is small enough for the few milliseconds the GPU can spare next to the page, so scrolling, the hero
   stream and the page itself stay at the display's full rate; a slower GPU just means a figure refreshes every 2nd-3rd frame
   instead of making the whole page stutter. Nothing waits for the GPU between bands. Resolution and edge quality are not
   touched. The cost of a figure frame is measured once, while the page is idle (and kept up to date with GPU timer queries
   where the browser offers them); the number of bands is that cost divided by the share of a frame figures may use, and that
   share shrinks for a while whenever page frames overrun. */
  let job = null,
    subm = false,
    prevSubm = false,
    lastF = null,
    frameN = 0,
    badN = 0,
    calmN = 0,
    slowN = 0,
    fastN = 0,
    fails = 0,
    refMs = 16.7,
    refBase = 16.7,
    bk = 0.7,
    calmNeed = 120,
    lastNb = 1,
    qSeen = false,
    qSent = 0,
    lastNow = 0,
    graceUntil = 0,
    lastAct = 0,
    lvlT = 0;
  const tqs = [],
    outs = [],
    dq = [],
    bads = [];
  /* Relative cost of the scenes (measured once, scene 5 = 1). A figure that has not been measured on this device yet is
   estimated from the measurements of the others, or from the device class before any measurement exists. */
  const SW = {
    0: 4.3,
    1: 2.6,
    2: 3,
    4: 2.2,
    5: 1,
    6: 1.07,
    7: 5.4,
    8: 3.6,
    9: 3.6,
    10: 0.96,
    11: 3.2,
    12: 2.26,
    13: 2.05,
  };
  let unitMs = [22, 10, 4][tier],
    haveUnit = false; // ms for a weight-1 scene at 1000x1000 px
  const wS = (S) => SW[S] || 2.5,
    estCost = (f, px) => unitMs * wS(f.S) * Math.pow(px / 1000, 2) * f.boost;
  function learn(f) {
    const u = f.cost / (wS(f.S) * Math.pow(f.cpx / 1000, 2));
    unitMs = haveUnit ? lerp(unitMs, u, 0.5) : u;
    haveUnit = true;
  }
  function bandRows(px, nb) {
    // equal-cost strips: a figure fills a disc, so the middle rows weigh more
    const N = 32,
      w = [];
    let tot = 0;
    for (let i = 0; i < N; i++) {
      const y = ((i + 0.5) / N) * 2 - 1,
        v = 0.18 + Math.sqrt(Math.max(0, 1 - y * y * 0.9));
      w.push(v);
      tot += v;
    }
    const out = [0];
    let acc = 0,
      k = 1;
    for (let i = 0; i < N && k < nb; i++) {
      acc += w[i];
      if (acc >= (tot / nb) * k) {
        out.push(Math.round(((i + 1) / N) * px));
        k++;
      }
    }
    out.push(px);
    for (let i = 1; i < out.length; i++)
      if (out[i] <= out[i - 1]) {
        const e = [];
        for (let j = 0; j <= nb; j++) e.push(Math.round((j * px) / nb));
        return e;
      }
    return out.length === nb + 1
      ? out
      : (() => {
          const e = [];
          for (let j = 0; j <= nb; j++) e.push(Math.round((j * px) / nb));
          return e;
        })();
  }
  const bandsFor = (f, b) =>
    clamp(
      Math.ceil((f.cost / (refMs * bk * (b ? 1 : 0.6))) * dgMul),
      f.cal ? 1 : 2,
      dgMul > 1 ? 24 : 6,
    ); // a figure nobody has timed yet starts in at least two bands
  function makeJob(f, T, ms, b) {
    const pr = getProg(f.S);
    if (pr === 0) {
      f.wait = ms + 90;
      return null;
    }
    if (!pr) {
      f.dead = true;
      f.box.classList.add("ready");
      return null;
    }
    if (f.S === 1 && !texReady) {
      loadLogo();
      f.wait = ms + 250;
      return null;
    }
    const r = f.box.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, lvl >= 2 ? 1.5 : 2);
    const px = clamp(Math.round(r.width * dpr), 160, MAXPX);
    const dtf = f.lp ? clamp((ms - f.lp) / 16.667, 0.5, 8) : 1;
    f.lp = ms; // animation is stepped by elapsed time, not by frame count
    const k = f.started === null ? 0 : clamp((ms - f.started) / 1300, 0, 1);
    const c1 = 1.7,
      e = 1 + (c1 + 1) * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2);
    f.appear = reduce ? 1 : clamp(e, 0, 1.08);
    /* Pose: no free spinning. The figure turns only a little, and only while it is being touched: it follows the pointer a few
     degrees, and a drag turns it up to ~30 degrees (soft limit). Let go and it eases back to its resting pose. At rest it
     only breathes slightly; its own details (lights, fans, pulses) keep moving inside the picture. */
    const mt = f.hover || f.press ? 1 : 0,
      hk = 1 - Math.pow(0.82, dtf);
    f.mx = lerp(f.mx, mt ? f.tx : 0, hk);
    f.my = lerp(f.my, mt ? f.ty : 0, hk);
    f.mi = lerp(f.mi, mt, 1 - Math.pow(0.9, dtf));
    if (!mt) {
      if (Math.abs(f.mx) < 0.002) f.mx = 0;
      if (Math.abs(f.my) < 0.002) f.my = 0;
    }
    if (!f.drag) {
      const h = Math.pow(0.93, dtf);
      f.yaw *= h;
      f.pit *= h;
      if (Math.abs(f.yaw) < 0.002) f.yaw = 0;
      if (Math.abs(f.pit) < 0.002) f.pit = 0;
    }
    const idl = reduce ? 0 : 1,
      lim = (x, l) => l * Math.tanh(x / l);
    const yaw =
      f.cam[0] +
      lim(f.yaw, 0.5) +
      idl * (0.06 * Math.sin(T * 0.35 + f.seed) + f.mx * 0.7);
    const pit =
      f.cam[1] +
      lim(f.pit, 0.26) +
      idl * (0.015 * Math.sin(T * 0.5 + f.seed * 2) + f.my * 0.4);
    f.cy = yaw;
    f.cp = pit;
    if (f.pickReq && !pk) startPick(f, pr, T);
    if (f.cal) {
      if (f.cpx && f.cpx !== px) f.cost *= Math.pow(px / f.cpx, 2);
      f.cpx = px;
    } else f.cost = estCost(f, px);
    if (f.jn === 0 && !f.g1) {
      f.g1 = 1;
      graceUntil = Math.max(graceUntil, ms + 1800);
    }
    const nb = bandsFor(f, b);
    return {
      f,
      pr,
      px,
      T,
      yaw,
      pit,
      appear: f.appear,
      mi: f.mi,
      ck: f.ck,
      mx: f.mx,
      my: f.my,
      press: f.press,
      rp: f.rp.slice(),
      aa: lvl >= 1 ? 4 : 8,
      nb,
      rows: bandRows(px, nb),
      k: 0,
      t0: ms,
      b,
      acc: { sum: 0, left: nb, bad: false },
    };
  }
  function runBand(j) {
    const f = j.f,
      pr = j.pr,
      px = j.px,
      y0 = MAXPX - px;
    let qy = null;
    if (tq) {
      qy = gl.createQuery();
      gl.beginQuery(tq.TIME_ELAPSED_EXT, qy);
    }
    gl.useProgram(pr.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(pr.loc);
    gl.vertexAttribPointer(pr.loc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(pr.u.tex, 0);
    gl.uniform4f(pr.u.P, j.yaw, j.pit, f.cam[2], 0);
    gl.uniform4f(pr.u.U, reduce ? 1.2 : j.T, j.appear, j.mi, j.ck);
    gl.uniform4fv(pr.u.RP, j.rp);
    gl.uniform2f(pr.u.R, px, px);
    gl.uniform2f(pr.u.O, 0, y0);
    gl.uniform2f(pr.u.L, 150, j.aa);
    gl.uniform3f(pr.u.M, j.mx, j.my, j.press);
    gl.disable(gl.BLEND);
    gl.disable(gl.SCISSOR_TEST);
    if (j.k === 0) {
      // occupancy mask: first band only, every band then reuses it
      const mw = Math.ceil(px / 8);
      gl.bindFramebuffer(gl.FRAMEBUFFER, mfbo);
      gl.viewport(0, 0, mw, mw);
      gl.uniform4f(pr.u.Q, 2, 0, 0, 0);
      gl.uniform2f(pr.u.MK, 8, 0);
      gl.uniform1i(pr.u.msk, 2);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, rfbo);
    gl.uniform4f(pr.u.Q, 0, 0, 0, 0);
    gl.uniform2f(pr.u.MK, 8, 0);
    gl.uniform1i(pr.u.msk, 1);
    gl.viewport(0, y0, px, px);
    const a = j.rows[j.k],
      b = j.rows[j.k + 1];
    gl.enable(gl.SCISSOR_TEST);
    gl.scissor(0, MAXPX - b, px, b - a);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.disable(gl.SCISSOR_TEST);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    if (qy) {
      gl.endQuery(tq.TIME_ELAPSED_EXT);
      tqs.push({ q: qy, j });
      qSent++;
    }
    outs.push(gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0));
    gl.flush();
    j.k++;
  }
  function finishJob(j, ms) {
    const f = j.f,
      px = j.px,
      y0 = MAXPX - px;
    const ft0 = dgT();
    /* OffscreenCanvas path: the context's canvas only ever grows (to the largest figure), because resizing it reallocates its
     buffers and figures of different sizes are often on screen together. The frame goes to its top-left corner; a smaller
     figure's <canvas> is then made proportionally larger with CSS and clipped by its box, so its pixels map 1:1 as before. */
    if (bmp && GLC.width < px) {
      GLC.width = px;
      GLC.height = px;
    }
    const H = bmp ? GLC.height : MAXPX,
      dy = H - px;
    gl.bindFramebuffer(gl.READ_FRAMEBUFFER, rfbo);
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, null);
    gl.blitFramebuffer(
      0,
      y0,
      px,
      MAXPX,
      0,
      dy,
      px,
      dy + px,
      gl.COLOR_BUFFER_BIT,
      gl.NEAREST,
    );
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    dgM("blit", ft0);
    const cw = bmp ? H : px;
    if (f.cv.width !== cw) {
      f.cv.width = cw;
      f.cv.height = cw;
    }
    if (bmp && f.cs !== H / px) {
      f.cs = H / px;
      const v = (f.cs * 100).toFixed(4) + "%";
      f.cv.style.width = v;
      f.cv.style.height = v;
    }
    const ft1 = dgT();
    if (bmp) f.ctx.transferFromImageBitmap(GLC.transferToImageBitmap());
    else {
      f.ctx.clearRect(0, 0, px, px);
      f.ctx.drawImage(GLC, 0, 0, px, px, 0, 0, px, px);
    }
    dgM("present", ft1);
    f.done = ms;
    if (!f.box.classList.contains("ready")) f.box.classList.add("ready");
    f.jn++;
    // a figure that would need more than ~4 bands (under 15 refreshes a second) gets cheaper edges / pixel density, one step at a time
    if (f.cal && f.cost > refMs * 3.4 && lvl < 3 && ms - lvlT > 3000) {
      lvl++;
      lvlT = ms;
      unitMs *= 0.8;
      figs.forEach((x) => {
        x.cost *= 0.8;
        if (!tq) x.cal = false;
        x.boost = 1;
      });
    }
  }
  function pollQ() {
    while (
      tqs.length &&
      gl.getQueryParameter(tqs[0].q, gl.QUERY_RESULT_AVAILABLE)
    ) {
      const t = tqs.shift(),
        a = t.j.acc;
      if (gl.getParameter(tq.GPU_DISJOINT_EXT)) a.bad = true;
      else {
        const g = gl.getQueryParameter(t.q, gl.QUERY_RESULT) / 1e6;
        a.sum += g;
        if (dgOn && !(dgMax.gpuBand > g)) dgMax.gpuBand = g;
      }
      gl.deleteQuery(t.q);
      qSeen = true;
      if (--a.left === 0 && !a.bad) {
        const f = t.j.f;
        f.cost = f.cal ? lerp(f.cost, a.sum, 0.4) : a.sum;
        f.cal = true;
        f.cpx = t.j.px;
        learn(f);
      }
    }
  }
  /* busy: does this figure need a fresh picture right now? 2 = being touched / still moving, 0 = resting (only its small ambient motion) */
  let lastScrollT = 0;
  addEventListener(
    "scroll",
    () => {
      lastScrollT = performance.now();
    },
    { passive: true },
  );
  function busy(f, ms, T) {
    if (f.drag || f.press || f.pickReq) return 2;
    if (f.started !== null && ms - f.started < 1500) return 2;
    if (f.hover && ms - f.lm < 300) return 2; // the pointer is moving over it
    const tm = f.hover || f.press ? 1 : 0;
    if (Math.abs(f.mi - tm) > 0.02) return 2; // highlight fading in or out
    if (
      Math.abs(f.mx - (tm ? f.tx : 0)) > 0.002 ||
      Math.abs(f.my - (tm ? f.ty : 0)) > 0.002 ||
      f.yaw ||
      f.pit
    )
      return 2; // still turning
    const m = Math.max(f.rp[3], f.rp[7], f.rp[11], f.rp[15]);
    if (T - m < 3.5) return 2; // a ripple is travelling
    return 0;
  }
  function pickNext(ms, T) {
    let best = null,
      bs = -1,
      bb = 0;
    const idleGap =
      (tier === 0 ? 66 : lvl >= 1 ? 50 : 40) *
      (ms - lastScrollT < 200 ? 2.5 : 1); // at rest figures only need their small ambient motion; while the page scrolls even less
    for (const f of figs) {
      if (!f.vis || f.dead || ms < f.wait) continue;
      const b = busy(f, ms, T),
        age = ms - f.done;
      if (b === 0 && age < idleGap) continue;
      const sc = b * 100000 + age;
      if (sc > bs) {
        bs = sc;
        best = f;
        bb = b;
      }
    }
    return best ? [best, bb] : null;
  }
  /* A page frame overran while figure work was in flight. Two overruns within 1.5 s make figures use less of each frame (one
   random hiccup does not count, and nothing counts for a moment after a shader link or a first frame, which are one-offs). */
  function bad(ms, why, d) {
    if (window.__bl)
      window.__bl.push([
        Math.round(ms),
        why,
        ms < graceUntil ? 1 : 0,
        Math.round(graceUntil),
      ]);
    if (ms < graceUntil || !lastF) return;
    if (d && d - refMs > Math.max(60, (3 * lastF.cost) / lastNb) && lastF.cal)
      return; // a stall far bigger than a band can cause came from somewhere else
    if (!lastF.cal) {
      // not timed yet: the overrun itself is the measurement
      if (d && d < 250)
        lastF.boost = Math.min(
          12,
          Math.max(
            lastF.boost * 1.3,
            ((d - refMs * 0.7) * lastNb) / (lastF.cost / lastF.boost),
          ),
        );
      return;
    }
    if (lastF.cost / lastNb < 3.5) return; // a band that costs next to nothing is not what made the page slow
    bads.push(ms);
    while (bads.length && ms - bads[0] > 1500) bads.shift();
    if (bads.length < 2 || ms - lastAct < 700) return;
    bads.length = 0;
    lastAct = ms;
    calmN = 0;
    bk = Math.max(0.4, bk * 0.85);
    calmNeed = Math.min(Math.round(calmNeed * 1.6), 900); // every overrun makes the next attempt to give figures more room come later
  }
  function calm() {
    // a clean frame while figure work was in flight: slowly give figures more room again
    if (++calmN >= calmNeed) {
      calmN = 0;
      bk = Math.min(0.75, bk + 0.03);
      calmNeed = Math.max(120, Math.round(calmNeed * 0.6));
    } // each clean stretch makes the next step come sooner
  }
  function schedule(ms, T) {
    prevSubm = subm;
    subm = false;
    const st0 = dgT();
    pollPick();
    if (tq) pollQ();
    dgM("poll", st0);
    while (
      outs.length &&
      gl.getSyncParameter(outs[0], gl.SYNC_STATUS) === gl.SIGNALED
    )
      gl.deleteSync(outs.shift());
    if (outs.length >= 4) {
      bad(ms, "outs");
      return;
    } // the GPU is 4 bands behind: send nothing this frame
    if (!job) {
      const n = pickNext(ms, T);
      if (n) {
        const mt0 = dgT();
        job = makeJob(n[0], T, ms, n[1]);
        dgM("makeJob", mt0);
      }
    }
    if (!job) return;
    if (dgOn)
      dgTag =
        "S" +
        job.f.S +
        " b" +
        job.k +
        "/" +
        job.nb +
        (job.k === 0 ? " mask" : "");
    const bt0 = dgT();
    runBand(job);
    dgM("band", bt0);
    lastF = job.f;
    lastNb = job.nb;
    subm = true;
    if (job.k >= job.nb) {
      const fn0 = dgT();
      finishJob(job, ms);
      dgM("finish", fn0);
      if (dgOn) dgTag += " FIN";
      job = null;
    }
  }
  const quiet = () =>
      performance.now() - lastScrollT > 700 &&
      !figs.some((f) => f.drag || f.pickReq),
    stillNow = () => !job && quiet();
  /* One blocking measurement of a full figure frame (two timed runs after a warm-up run), done while nobody is scrolling or
   touching anything and only for the figures the visitor is about to reach. Browsers with GPU timer queries skip it. */
  function calibrate(f) {
    if (tq) {
      f.cal = true;
      return 1;
    }
    initGL();
    const pr = getProg(f.S);
    if (pr === 0) return 0;
    if (!pr) {
      f.cal = true;
      return 1;
    }
    if (f.S === 1 && !texReady) {
      loadLogo();
      return 0;
    }
    const r = f.box.getBoundingClientRect(),
      dpr = Math.min(devicePixelRatio || 1, lvl >= 2 ? 1.5 : 2);
    const px = clamp(Math.round((r.width || 584) * dpr), 160, MAXPX);
    const rp = new Float32Array(16);
    for (let k = 0; k < 4; k++) rp[k * 4 + 3] = -100;
    const j = {
      f,
      pr,
      px,
      T: 1.2,
      yaw: f.cam[0],
      pit: f.cam[1],
      appear: 1,
      mi: 0,
      ck: -100,
      mx: 0,
      my: 0,
      press: 0,
      rp,
      aa: lvl >= 1 ? 4 : 8,
      nb: 1,
      rows: [0, px],
      k: 0,
      acc: { sum: 0, left: 1, bad: false },
    };
    const y0 = MAXPX - px,
      t = [],
      n = f.cost > 20 ? 2 : 3;
    for (let i = 0; i < n; i++) {
      j.k = 0;
      const t0 = performance.now();
      runBand(j);
      gl.bindFramebuffer(gl.FRAMEBUFFER, rfbo);
      gl.readPixels(
        px >> 1,
        y0 + (px >> 1),
        1,
        1,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pickBuf,
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      t.push(performance.now() - t0);
    }
    f.cost = Math.max(0.5, Math.min(...t.slice(1)));
    f.cpx = px;
    f.cal = true;
    learn(f);
    graceUntil = Math.max(graceUntil, performance.now() + 600);
    return 1;
  }
  function calLoop() {
    setTimeout(
      () =>
        idle(() => {
          if (!gl || tq) return;
          if (quiet() && !document.hidden) {
            let best = null,
              bd = 1e9;
            for (const f of figs) {
              if (f.cal || f.dead) continue;
              const r = f.box.getBoundingClientRect(),
                d =
                  r.top > innerHeight
                    ? r.top - innerHeight
                    : r.bottom < 0
                      ? -r.bottom
                      : 0;
              if (d < innerHeight * 2.2 && d < bd) {
                bd = d;
                best = f;
              }
            }
            if (best) {
              job = null;
              calibrate(best);
            } // a half-drawn frame is dropped: the measurement draws over the same buffer
          }
          calLoop();
        }),
      600,
    );
  }
  /* shaders are run once at 1x1 pixel after linking, so the driver does its lazy work while nobody is looking */
  function warmDraw(S) {
    const pr = getProg(S);
    if (!pr) return pr;
    gl.useProgram(pr.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.enableVertexAttribArray(pr.loc);
    gl.vertexAttribPointer(pr.loc, 2, gl.FLOAT, false, 0, 0);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.uniform1i(pr.u.tex, 0);
    gl.uniform1i(pr.u.msk, 1);
    gl.uniform4f(pr.u.P, 0, 0, 10, 0);
    gl.uniform4f(pr.u.U, 1, 1, 0, -100);
    gl.uniform2f(pr.u.R, 4, 4);
    gl.uniform2f(pr.u.O, 0, 0);
    gl.uniform2f(pr.u.L, 150, 4);
    gl.uniform3f(pr.u.M, 0, 0, 0);
    gl.uniform4f(pr.u.Q, 1, 0, 0, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.disable(gl.SCISSOR_TEST);
    gl.viewport(0, 0, 1, 1);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.flush();
    return 1;
  }

  /* ============ main loop ============ */
  function tick(now) {
    requestAnimationFrame(tick);
    loopAlive = true;
    const tk0 = dgT();
    const d0 = now - lastNow;
    if (dgOn && lastNow && d0 > 40 && d0 < 2000) {
      dgLong.push([Math.round(d0), Math.round(dgJs), dgTag, performance.now()]);
      if (dgLong.length > 7) dgLong.shift();
    }
    dgTag = "";
    const sm0 = dgT();
    smStep();
    dgM("smStep", sm0);
    frameN++;
    if (heroVis && !streamOff) {
      const hs0 = dgT();
      streamFrame(now);
      dgM("stream", hs0);
    }
    last = now;
    const d = now - lastNow;
    if (lastNow && d > 3 && d < 400) {
      dq.push(d);
      if (dq.length > 120) dq.shift();
      if (frameN % 30 === 0 && dq.length >= 60) {
        const sd = dq.slice().sort((x, y) => x - y),
          md = sd[sd.length >> 1];
        refBase = Math.min(refBase, md);
        refMs = clamp(
          md,
          Math.max(5, refBase * 0.92),
          Math.min(34, refBase * 1.25),
        );
      } // the display's own frame time (60 Hz = 16.7, 120 Hz = 8.3)
      if (subm || prevSubm) {
        if (d > refMs * 1.45) bad(now, "d" + Math.round(d), d);
        else calm();
      }
    }
    if (frameN % 120 === 0) badN = 0;
    if (tq && !qSeen && qSent > 120) {
      tq = null;
      tqs.length = 0;
    } // timer queries that never answer: fall back to watching frames
    if (
      gl &&
      !document.hidden &&
      !dgFreeze &&
      (job || pk || figs.some((f) => f.vis))
    ) {
      initGL();
      schedule(performance.now(), nowT());
    } else {
      prevSubm = subm;
      subm = false;
    }
    lastNow = now;
    if (dgOn) {
      dgJs = performance.now() - tk0;
      dgM("tick", tk0);
    }
  }
  measure();
  resizeStream();
  scrollFx();
  requestAnimationFrame(tick);
  if (/[?&]dbg/.test(location.search))
    window.__SCH = {
      figs,
      get job() {
        return job;
      },
      get lvl() {
        return lvl;
      },
      get tq() {
        return !!tq;
      },
      get fails() {
        return fails;
      },
      cal: (f) => calibrate(f),
      get gl() {
        return gl;
      },
      get bk() {
        return bk;
      },
      get refMs() {
        return refMs;
      },
    };
  addEventListener("load", () => {
    measure();
    scrollFx();
    if (!gl) return;
    // warm-up: logo texture first, then every scene's shader is linked and run once at 1x1 pixel, one at a time and only while
    // nobody is scrolling or touching a figure, so no figure has to compile while it scrolls into view
    const start = () =>
      idle(() => {
        initGL();
        loadLogo();
        const order = [...new Set(figs.map((f) => f.S))];
        let i = 0,
          ph = 0;
        const next = () => {
          if (!stillNow()) {
            setTimeout(() => idle(next), 400);
            return;
          }
          if (ph === 0) {
            if (i < order.length) {
              buildProg(order[i++]);
              setTimeout(() => idle(next), pex ? 120 : 450);
            } else {
              ph = 1;
              i = 0;
              setTimeout(() => idle(next), 300);
            }
          } else if (i < order.length) {
            if (warmDraw(order[i]) === 0) setTimeout(() => idle(next), 200);
            else {
              i++;
              setTimeout(() => idle(next), 60);
            }
          }
        };
        next();
      });
    // browsers that link shaders on a background thread can start at once on a strong device; the others wait for the intro to end
    if (pex && tier === 2) {
      setTimeout(start, 700);
      setTimeout(calLoop, 3200);
    } else {
      const wait = () => {
        if (!went || performance.now() - ST.t0 < 3200) setTimeout(wait, 300);
        else {
          start();
          calLoop();
        }
      };
      wait();
    }
  });

  /* ============ diagnostics: add ?perf to the address, or press the ` key; B inside the panel times every figure ============ */
  (() => {
    let el = null,
      tm = 0,
      bres = null,
      dn = 0;
    const bp = document.documentElement;
    const q = (a, p) => {
      if (!a.length) return 0;
      const b = a.slice().sort((x, y) => x - y);
      return b[Math.min(b.length - 1, Math.floor(b.length * p))];
    };
    function gpuName() {
      try {
        if (!gl) return "no WebGL";
        const e = gl.getExtension("WEBGL_debug_renderer_info");
        return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : "(hidden)";
      } catch (_) {
        return "?";
      }
    }
    function bench() {
      if (!gl) return;
      initGL();
      job = null;
      bres = [];
      for (const f of figs) {
        const pr = getProg(f.S);
        if (!pr) {
          bres.push("S" + f.S + " shader not ready");
          continue;
        }
        if (f.S === 1 && !texReady) {
          loadLogo();
          bres.push("S1 logo texture not ready");
          continue;
        }
        const r = f.box.getBoundingClientRect(),
          dpr = Math.min(devicePixelRatio || 1, 2),
          px = clamp(Math.round((r.width || 584) * dpr), 160, MAXPX);
        const rp = new Float32Array(16);
        for (let k = 0; k < 4; k++) rp[k * 4 + 3] = -100;
        const j = {
          f,
          pr,
          px,
          T: 1.2,
          yaw: f.cam[0],
          pit: f.cam[1],
          appear: 1,
          mi: 0,
          ck: -100,
          mx: 0,
          my: 0,
          press: 0,
          rp,
          aa: 8,
          nb: 1,
          rows: [0, px],
          k: 0,
          acc: { sum: 0, left: 1, bad: false },
        };
        const y0 = MAXPX - px,
          t = [];
        for (let i = 0; i < 4; i++) {
          j.k = 0;
          const t0 = performance.now();
          runBand(j);
          gl.bindFramebuffer(gl.FRAMEBUFFER, rfbo);
          gl.readPixels(
            px >> 1,
            y0 + (px >> 1),
            1,
            1,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            pickBuf,
          );
          gl.bindFramebuffer(gl.FRAMEBUFFER, null);
          t.push(performance.now() - t0);
        }
        bres.push(
          "S" +
            f.S +
            " " +
            px +
            "px full frame " +
            Math.min(...t.slice(1)).toFixed(1) +
            " ms",
        );
      }
    }

    let pres = null;
    const cssT = {
      f: "html.js h2.h .c,html.js .ch{filter:none!important}",
      g: "*,*::before,*::after{transition:none!important;animation:none!important}",
      r: "html.js [data-r],html.js .rw .wd,html.js h2.h .c{transform:none!important;opacity:1!important;filter:none!important}",
      l: "*{box-shadow:none!important;text-shadow:none!important}",
      u: ".marq{display:none!important}",
      c: "canvas{visibility:hidden!important}",
    };
    const cssOn = {};
    let cssEl = null;
    function cssKey(k) {
      if (!cssEl) {
        cssEl = document.createElement("style");
        document.head.appendChild(cssEl);
      }
      cssOn[k] = !cssOn[k];
      cssEl.textContent = Object.keys(cssOn)
        .filter((x) => cssOn[x])
        .map((x) => cssT[x])
        .join("\n");
    }
    function probeDraw(pr, fb, Qx, mu, sc) {
      gl.useProgram(pr.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, quad);
      gl.enableVertexAttribArray(pr.loc);
      gl.vertexAttribPointer(pr.loc, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(pr.u.tex, 0);
      gl.uniform4f(pr.u.P, 0, 0, 10, 0);
      gl.uniform4f(pr.u.U, 1, 1, 0, -100);
      gl.uniform2f(pr.u.R, 4, 4);
      gl.uniform2f(pr.u.O, 0, 0);
      gl.uniform2f(pr.u.L, 150, 4);
      gl.uniform3f(pr.u.M, 0, 0, 0);
      gl.uniform4f(pr.u.Q, Qx, 0, 0, 0);
      gl.uniform2f(pr.u.MK, 8, 0);
      gl.uniform1i(pr.u.msk, mu);
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.viewport(0, 0, 4, 4);
      gl.disable(gl.BLEND);
      if (sc) {
        gl.enable(gl.SCISSOR_TEST);
        gl.scissor(0, 0, 4, 4);
      } else gl.disable(gl.SCISSOR_TEST);
      const t0 = performance.now();
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pickBuf);
      const d = performance.now() - t0;
      gl.disable(gl.SCISSOR_TEST);
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return d;
    }
    function probe() {
      if (!gl) return;
      initGL();
      job = null;
      pres = [];
      for (const sc of [...new Set(figs.map((f) => f.S))].reverse()) {
        const pr = getProg(sc);
        if (!pr) {
          pres.push("S" + sc + " shader not ready");
          continue;
        }
        const r = [];
        for (const [nm, fb, Qx, mu, sw] of [
          ["mask", mfbo, 2, 2, 0],
          ["band", rfbo, 0, 1, 1],
          ["pick", null, 1, 1, 0],
        ]) {
          const a = probeDraw(pr, fb, Qx, mu, sw),
            b = probeDraw(pr, fb, Qx, mu, sw);
          r.push(nm + " " + a.toFixed(0) + "/" + b.toFixed(0));
        }
        pres.push("S" + sc + ": " + r.join(" | "));
      }
    }
    function draw() {
      const d = dq.slice(),
        now = performance.now(),
        lines = [];
      lines.push("GPU: " + gpuName());
      lines.push(
        "tier " +
          tier +
          " | present " +
          (bmp ? "bitmap" : "2d copy") +
          " | timer " +
          (tq ? "yes" : "no") +
          " | lvl " +
          lvl +
          " | budget " +
          bk.toFixed(2) +
          " | frame " +
          refMs.toFixed(1) +
          " ms | dpr " +
          (devicePixelRatio || 1) +
          " | " +
          innerWidth +
          "x" +
          innerHeight,
      );
      lines.push(
        "page frames: p50 " +
          q(d, 0.5).toFixed(1) +
          "  p95 " +
          q(d, 0.95).toFixed(1) +
          "  max " +
          Math.round(Math.max(0, ...d)) +
          "  over 25 ms: " +
          d.filter((x) => x > 25).length +
          "/" +
          d.length,
      );
      for (const f of figs) {
        if (!f.vis) continue;
        if (!f.__t) {
          f.__t = now;
          f.__j = f.jn;
          f.__r = 0;
        }
        const dt = (now - f.__t) / 1000;
        let rate = f.__r;
        if (dt > 0.9) {
          rate = (f.jn - f.__j) / dt;
          f.__t = now;
          f.__j = f.jn;
          f.__r = rate;
        }
        lines.push(
          "fig S" +
            f.S +
            "  " +
            f.cv.width +
            "px  " +
            (f.cal ? "cost " + f.cost.toFixed(1) + " ms" : "not timed") +
            "  bands " +
            (job && job.f === f ? job.nb : "-") +
            "  updates " +
            rate.toFixed(0) +
            "/s",
        );
      }
      lines.push(
        "JS ms (max, last 2 s): " +
          [
            "tick",
            "smStep",
            "stream",
            "poll",
            "makeJob",
            "band",
            "finish",
            "blit",
            "present",
            "compile",
            "gpuBand",
          ]
            .map((k) => k + " " + (dgMax[k] || 0).toFixed(0))
            .join(" | "),
      );
      lines.push(
        "experiments: [q] timer queries " +
          (tq ? "on" : "OFF") +
          "   [x] figure drawing " +
          (dgFreeze ? "STOPPED" : "on") +
          "   [n] bands x" +
          dgMul +
          "   [s] hero stream " +
          (streamOff ? "STOPPED" : "on"),
      );
      lines.push(
        "css switched off: " +
          (Object.keys(cssOn)
            .filter((x) => cssOn[x])
            .join(" ") || "none") +
          "   [f] letter blur  [g] transitions  [r] reveal effects  [l] shadows  [u] marquee  [c] all canvases",
      );
      lines.push(
        "long frames (ms, JS time, what ran): " +
          (dgLong.length
            ? dgLong
                .map(
                  (x) =>
                    x[0] +
                    " [" +
                    x[1] +
                    " " +
                    x[2] +
                    "] " +
                    Math.round((performance.now() - x[3]) / 1000) +
                    "s ago",
                )
                .join("  ")
            : "none"),
      );
      if (++dn % 4 === 0) for (const k in dgMax) dgMax[k] = 0;
      if (pres) {
        lines.push("--- first / second draw per pass, ms (W to repeat) ---");
        pres.forEach((x) => lines.push(x));
      }
      if (bres) {
        lines.push("--- full-frame time per figure (B to repeat) ---");
        bres.forEach((x) => lines.push(x));
      } else
        lines.push("press B: time every figure (page freezes for a second)");
      el.textContent = lines.join("\n");
    }
    function toggle() {
      if (el) {
        clearInterval(tm);
        el.remove();
        el = null;
        dgOn = false;
        return;
      }
      dgOn = true;
      el = document.createElement("div");
      el.style.cssText =
        "position:fixed;left:8px;bottom:8px;z-index:2147483647;padding:8px 10px;background:rgba(0,0,0,.82);color:#b1ff00;font:11px/1.4 ui-monospace,Consolas,monospace;white-space:pre;pointer-events:none;border-radius:6px;max-width:96vw";
      document.body.appendChild(el);
      draw();
      tm = setInterval(draw, 500);
    }
    addEventListener("keydown", (e) => {
      if (e.key === "`" || e.key === "§" || e.code === "Backquote") toggle();
      else if (el && (e.key === "b" || e.key === "B")) bench();
      else if (el && (e.key === "w" || e.key === "W")) probe();
      else if (el && cssT[e.key]) cssKey(e.key);
      else if (el && e.key === "q") {
        tq = null;
        tqs.length = 0;
      } else if (el && e.key === "x") dgFreeze = !dgFreeze;
      else if (el && e.key === "n") dgMul = dgMul > 1 ? 1 : 4;
      else if (el && e.key === "s") streamOff = !streamOff;
    });
    if (/[?&]perf/.test(location.search))
      addEventListener("load", () => setTimeout(toggle, 500));
  })();
})();
