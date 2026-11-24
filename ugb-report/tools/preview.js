// Accurate preview of the plugin: runs code.js inside Chromium against a fake Figma API whose text nodes are
// measured with real DOM layout (Noto Sans), then screenshots every slide.
// Usage: node tools/preview.js code.js <fonts_dir with NotoSans-*.ttf> <out_dir> [slides|figma]
const { chromium } = require("playwright");
const fs = require("fs"), path = require("path");
const [, , codePath, fontsDir, outDir, mode] = process.argv;
fs.mkdirSync(outDir, { recursive: true });

const fontCss = ["Regular:400", "Medium:500", "SemiBold:600", "Bold:700"].map((s) => {
  const [n, w] = s.split(":");
  const b64 = fs.readFileSync(path.join(fontsDir, "NotoSans-" + n + ".ttf")).toString("base64");
  return `@font-face{font-family:"Noto Sans";font-weight:${w};src:url(data:font/ttf;base64,${b64})}`;
}).join("\n");

const harness = `
const WEIGHT = { Regular: 400, Medium: 500, SemiBold: 600, "Semi Bold": 600, Bold: 700 };
const issues = []; const hashes = {}; let hn = 0;
const meas = document.getElementById("meas");
function css(c) { return c ? "rgb(" + [c.r, c.g, c.b].map((v) => Math.round(v * 255)).join(",") + ")" : "#000"; }
function node(type) {
  return { type, name: "", x: 0, y: 0, width: 100, height: 100, children: [], fills: [], strokes: [], parent: null,
    appendChild(c) { if (c.parent && c.parent.children) { const k = c.parent.children.indexOf(c); if (k >= 0) c.parent.children.splice(k, 1); }
      c.parent = this; this.children.push(c); if (this.relayout) this.relayout(); },
    resize(w, h) { this.width = w; this.height = h; if (this.measure) this.measure(); }, setPluginData() {} };
}
function frame() {
  const f = node("FRAME"); f.layoutMode = "NONE";
  f.relayout = function () {
    if (this.layoutMode === "NONE") return;
    const hz = this.layoutMode === "HORIZONTAL", sp = this.itemSpacing || 0;
    let pos = hz ? this.paddingLeft || 0 : this.paddingTop || 0, cross = 0;
    for (const c of this.children) { if (hz) { c.x = pos; pos += c.width + sp; cross = Math.max(cross, c.height); } else { c.y = pos; pos += c.height + sp; cross = Math.max(cross, c.width); } }
    if (this.children.length) pos -= sp;
    if (hz) { this.width = pos + (this.paddingRight || 0); this.height = cross + (this.paddingTop || 0) + (this.paddingBottom || 0); for (const c of this.children) c.y = (this.paddingTop || 0) + (cross - c.height) / 2; }
    else { this.height = pos + (this.paddingBottom || 0); this.width = cross + (this.paddingLeft || 0) + (this.paddingRight || 0); }
    if (this.parent && this.parent.relayout) this.parent.relayout();
  };
  return f;
}
function textEl(t) {
  const d = document.createElement("div");
  d.style.cssText = "position:absolute;white-space:" + (t.textAutoResize !== "WIDTH_AND_HEIGHT" ? "pre-wrap" : "pre") + ";font-family:'Noto Sans';font-size:" + t.fontSize + "px;line-height:" + (t.fontSize * t.lineHeight.value / 100) + "px;text-align:" + (t.textAlignHorizontal || "LEFT").toLowerCase() + ";font-weight:" + WEIGHT[t.fontName.style] + ";color:" + css(t.fills[0] && t.fills[0].color) + ";overflow-wrap:break-word";
  if (t.textAutoResize !== "WIDTH_AND_HEIGHT") d.style.width = t.width + "px";
  const ch = t.characters; const n = ch.length;
  const st = Array.from({ length: n }, () => ({}));
  for (const r of t.ranges) for (let i = r.a; i < r.b; i++) Object.assign(st[i], r.s);
  let i = 0;
  while (i < n) { let j = i + 1; const key = JSON.stringify(st[i]); while (j < n && JSON.stringify(st[j]) === key) j++;
    const sp = document.createElement("span"); sp.textContent = ch.slice(i, j); const s = st[i];
    if (s.font) sp.style.fontWeight = WEIGHT[s.font.style]; if (s.color) sp.style.color = s.color; if (s.size) sp.style.fontSize = s.size + "px";
    if (s.dec) sp.style.textDecoration = "underline"; if (s.link) sp.dataset.link = s.link; d.appendChild(sp); i = j; }
  if (!n) d.textContent = " ";
  return d;
}
function textNode() {
  const t = node("TEXT"); t.ranges = []; t.lineHeight = { value: 120 }; t.fontName = { style: "Regular" }; t.fontSize = 12;
  let ch = "", tar = "WIDTH_AND_HEIGHT", fsz = 12;
  t.measure = function () { const d = textEl(this); meas.appendChild(d); if (this.textAutoResize === "WIDTH_AND_HEIGHT") this.width = d.offsetWidth; this.height = d.offsetHeight; d.remove(); if (this.parent && this.parent.relayout) this.parent.relayout(); };
  t.resize = function (w, h) { tar = "NONE"; this.width = w; this.height = h; };
  Object.defineProperty(t, "characters", { get: () => ch, set: (v) => { ch = v; t.measure(); } });
  Object.defineProperty(t, "textAutoResize", { get: () => tar, set: (v) => { tar = v; t.measure(); } });
  Object.defineProperty(t, "fontSize", { get: () => fsz, set: (v) => { fsz = v; t.measure(); } });
  const chk = (a, b) => { if (!(a >= 0 && b <= ch.length && a < b)) issues.push("bad range " + a + "-" + b); };
  t.setRangeFontName = (a, b, f) => { chk(a, b); t.ranges.push({ a, b, s: { font: f } }); t.measure(); };
  t.setRangeFills = (a, b, f) => { chk(a, b); t.ranges.push({ a, b, s: { color: css(f[0].color) } }); };
  t.setRangeFontSize = (a, b, v) => { chk(a, b); t.ranges.push({ a, b, s: { size: v } }); t.measure(); };
  t.setRangeTextDecoration = (a, b) => { chk(a, b); t.ranges.push({ a, b, s: { dec: 1 } }); };
  t.setRangeHyperlink = (a, b, h) => { chk(a, b); if (!/^https?:\\/\\//.test(h.value)) issues.push("bad url " + h.value); t.ranges.push({ a, b, s: { link: h.value } }); };
  return t;
}
const pages = []; let grid = null; let finalGrid = null;
window.figma = {
  editorType: window.MODE,
  listAvailableFontsAsync: async () => ["Regular", "Medium", "SemiBold", "Bold"].map((s) => ({ fontName: { family: "Noto Sans", style: s } })),
  loadFontAsync: async () => {},
  createPage() { if (window.MODE === "slides") throw new Error("no pages in Slides"); const p = node("PAGE"); pages.push(p); return p; },
  setCurrentPageAsync: async () => {},
  getSlideGrid() { return grid ? grid.map((r) => r.slice()) : [[]]; },
  setSlideGrid(g) { grid = g.map((r) => r.slice()); finalGrid = grid; },
  createSlideRow() { throw new Error("createSlideRow should not be needed"); },
  createSlide() { if (!grid) grid = [[]]; const f = frame(); f.type = "SLIDE"; f.width = 1920; f.height = 1080; f.resize = () => { throw new Error("cannot resize slide"); }; grid[grid.length - 1].push(f); return f; },
  createFrame: frame, createRectangle: () => node("RECTANGLE"), createText: textNode,
  createVector() { const v = node("VECTOR"); let vp = [];
    Object.defineProperty(v, "vectorPaths", { get: () => vp, set: (p) => { vp = p; const nums = p.map((q) => q.data).join(" ").match(/-?[0-9.]+/g).map(Number);
      const xs = nums.filter((_, i) => i % 2 === 0), ys = nums.filter((_, i) => i % 2 === 1); v.width = Math.max(...xs); v.height = Math.max(...ys); if (v.parent && v.parent.relayout) v.parent.relayout(); } });
    return v; },
  createImage(bytes) { const h = "h" + hn++; hashes[h] = bytes; return { hash: h }; },
  base64Decode(s) { return s; },
  viewport: { scrollAndZoomIntoView() {} },
  closePlugin(msg) { window.DONE = msg; },
};
console.warn = (...a) => issues.push("WARN " + a.join(" "));
function render(s, idx) {
  const root = document.createElement("div"); root.className = "slide"; root.id = "s" + idx;
  const draw = (n, host, isRoot) => {
    const el = n.type === "TEXT" ? textEl(n) : document.createElement("div");
    el.style.position = "absolute"; el.style.left = (isRoot ? 0 : n.x) + "px"; el.style.top = (isRoot ? 0 : n.y) + "px";
    if (n.type === "VECTOR") {
      el.style.width = n.width + "px"; el.style.height = n.height + "px"; el.style.overflow = "visible";
      el.innerHTML = '<svg width="' + n.width + '" height="' + n.height + '" style="overflow:visible"><path d="' + n.vectorPaths.map((q) => q.data).join(" ") + '" fill="none" stroke="' + css(n.strokes[0].color) + '" stroke-width="' + n.strokeWeight + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      host.appendChild(el); return;
    }
    if (n.type !== "TEXT") {
      el.style.width = n.width + "px"; el.style.height = n.height + "px"; el.style.borderRadius = (n.cornerRadius || 0) + "px"; el.style.overflow = isRoot ? "hidden" : "hidden";
      const bg = [];
      for (const f of (n.fills || []).slice().reverse()) {
        if (f.type === "SOLID") bg.push("linear-gradient(" + css(f.color).replace("rgb", "rgba").replace(")", "," + (f.opacity == null ? 1 : f.opacity) + ")") + "," + css(f.color).replace("rgb", "rgba").replace(")", "," + (f.opacity == null ? 1 : f.opacity) + ")") + ")");
        if (f.type === "GRADIENT_LINEAR") bg.push("linear-gradient(to bottom," + f.gradientStops.map((g) => "rgba(0,0,0," + g.color.a + ") " + g.position * 100 + "%").join(",") + ")");
        if (f.type === "IMAGE") bg.push("url(data:image/jpeg;base64," + hashes[f.imageHash] + ") center/" + (f.scaleMode === "FIT" ? "contain" : "cover") + " no-repeat");
      }
      el.style.background = bg.reverse().join(",");
      if (n.strokes && n.strokes.length) el.style.outline = (n.strokeWeight || 1) + "px " + (n.dashPattern ? "dashed " : "solid ") + css(n.strokes[0].color);
    }
    host.appendChild(el);
    if (!isRoot) { const ax = absX(n), ay = absY(n); if (ay + n.height > 1081 || ax + n.width > 1921 || ay < -1 || ax < -1) issues.push("slide " + (idx + 1) + ": '" + (n.name || n.characters || "").slice(0, 50) + "' outside frame (" + Math.round(ax) + "," + Math.round(ay) + " " + Math.round(n.width) + "x" + Math.round(n.height) + ")"); }
    if (n.type !== "TEXT") for (const c of n.children) draw(c, el, false);
  };
  const absX = (n) => (n === s ? 0 : n.x + (n.parent === s ? 0 : absX(n.parent)));
  const absY = (n) => (n === s ? 0 : n.y + (n.parent === s ? 0 : absY(n.parent)));
  draw(s, root, true);
  document.body.appendChild(root);
}
window.RUN = async () => {
  eval(window.CODE);
  for (let k = 0; k < 400 && !window.DONE; k++) await new Promise((r) => setTimeout(r, 50));
  let slides;
  if (window.MODE === "slides") { const g = finalGrid || grid; slides = g[g.length - 1]; issues.push("grid rows: " + g.length + ", last row: " + slides.length); }
  else slides = pages[0].children;
  slides.forEach(render);
  return { msg: window.DONE, n: slides.length, names: slides.map((s) => s.name), issues };
};
`;

(async () => {
  const code = fs.readFileSync(codePath, "utf8");
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fontCss}
    body{margin:0;background:#888} .slide{position:relative;width:1920px;height:1080px;overflow:hidden;margin-bottom:20px}
    #meas{position:absolute;left:-99999px;top:0}</style></head><body><div id="meas"></div></body></html>`;
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.setContent(html);
  await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { for (const w of [400, 500, 600, 700]) await document.fonts.load(w + " 20px 'Noto Sans'"); });
  await p.evaluate(([c, m]) => { window.CODE = c; window.MODE = m; }, [code, mode || "slides"]);
  await p.addScriptTag({ content: harness });
  const res = await p.evaluate(() => window.RUN());
  console.log(res.msg, "\n" + res.n, "slides");
  res.names.forEach((n) => console.log("  " + n));
  console.log(res.issues.length ? "ISSUES:\n" + res.issues.join("\n") : "no issues");
  for (let i = 0; i < res.n; i++) {
    const el = await p.$("#s" + i);
    await el.screenshot({ path: path.join(outDir, String(i + 1).padStart(2, "0") + ".png") });
  }
  await b.close();
})();
