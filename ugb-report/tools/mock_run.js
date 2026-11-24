// Runs code.js against a tiny fake Figma API and renders each slide to SVG (approximate text metrics).
// Usage: node tools/mock_run.js code.js out_dir
const fs = require("fs"), path = require("path");
const [, , codePath, outDir] = process.argv;
fs.mkdirSync(outDir, { recursive: true });
let imgs = {}, hashN = 0, errors = [];
function node(type) {
  const n = { type, name: "", x: 0, y: 0, width: 100, height: 100, children: [], fills: [], strokes: [], parent: null,
    appendChild(c) { if (c.parent && c.parent.children) { const k = c.parent.children.indexOf(c); if (k >= 0) c.parent.children.splice(k, 1); } c.parent = this; this.children.push(c); if (this.layoutMode && this.layoutMode !== "NONE") this.relayout(); },
    resize(w, h) { this.width = w; this.height = h; if (this.type === "TEXT") this.measure(); },
    setPluginData() {}, };
  return n;
}
function frame() {
  const f = node("FRAME");
  f.layoutMode = "NONE";
  f.relayout = function () {
    if (this.layoutMode === "NONE") return;
    const hz = this.layoutMode === "HORIZONTAL"; let pos = hz ? this.paddingLeft || 0 : this.paddingTop || 0, cross = 0;
    for (const c of this.children) { if (hz) { c.x = pos; pos += c.width + (this.itemSpacing || 0); cross = Math.max(cross, c.height); } else { c.y = pos; pos += c.height + (this.itemSpacing || 0); cross = Math.max(cross, c.width); } }
    pos -= this.children.length ? this.itemSpacing || 0 : 0;
    if (hz) { this.width = pos + (this.paddingRight || 0); this.height = cross + (this.paddingTop || 0) + (this.paddingBottom || 0); for (const c of this.children) c.y = (this.paddingTop || 0) + (cross - c.height) / 2; }
    else { this.height = pos + (this.paddingBottom || 0); this.width = cross + (this.paddingLeft || 0) + (this.paddingRight || 0); }
    if (this.parent && this.parent.relayout) this.parent.relayout();
  };
  return f;
}
function textNode() {
  const t = node("TEXT"); t.fontSize = 12; t.characters = ""; t.runs = []; t.textAutoResize = "WIDTH_AND_HEIGHT"; t.lineHeight = { value: 130 };
  t.measure = function () {
    const cw = this.fontSize * 0.53, lh = this.fontSize * this.lineHeight.value / 100;
    const lines = this.characters.split("\n");
    if (this.textAutoResize === "HEIGHT") {
      const per = Math.max(1, Math.floor(this.width / cw)); let n = 0;
      for (const l of lines) n += Math.max(1, Math.ceil(l.length / per));
      this.height = n * lh;
    } else { this.width = Math.max(...lines.map((l) => l.length)) * cw; this.height = lines.length * lh; }
    if (this.parent && this.parent.relayout) this.parent.relayout();
  };
  const chk = (a, b) => { if (!(a >= 0 && b <= t.characters.length && a < b)) errors.push("bad range " + a + "-" + b + " in '" + t.characters.slice(0, 30) + "'"); };
  t.setRangeFontName = (a, b) => chk(a, b); t.setRangeFills = (a, b, f) => { chk(a, b); t.runs.push({ a, b, f }); };
  t.setRangeFontSize = (a, b) => chk(a, b); t.setRangeTextDecoration = (a, b) => chk(a, b);
  t.setRangeHyperlink = (a, b, h) => { chk(a, b); if (!/^https?:\/\//.test(h.value)) errors.push("bad url " + h.value); t.links = (t.links || 0) + 1; };
  let tar = "WIDTH_AND_HEIGHT";
  Object.defineProperty(t, "textAutoResize", { get: () => tar, set: (v) => { tar = v; t.measure(); } });
  let ch = ""; Object.defineProperty(t, "characters", { get: () => ch, set: (v) => { ch = v; t.measure(); } });
  let fs_ = 12; Object.defineProperty(t, "fontSize", { get: () => fs_, set: (v) => { fs_ = v; t.measure(); } });
  return t;
}
const pages = [];
const MODE = process.env.EDITOR || "figma";
let grid = null;
global.figma = {
  editorType: MODE,
  createSlideRow() { if (!grid) { grid = node("SLIDE_GRID"); pages.push(grid); } const r = node("SLIDE_ROW"); grid.appendChild(r); return r; },
  createSlide() { if (!grid) this.createSlideRow(); const f = frame(); f.type = "SLIDE"; f.width = 1920; f.height = 1080; f.resize = () => { throw new Error("cannot resize slide"); }; grid.children[grid.children.length - 1].appendChild(f); return f; },
  listAvailableFontsAsync: async () => ["Regular", "Medium", "SemiBold", "Bold"].map((s) => ({ fontName: { family: "Noto Sans", style: s } })),
  loadFontAsync: async () => {},
  createPage() { if (MODE === "slides") throw new Error("createPage not available in Slides"); const p = node("PAGE"); pages.push(p); return p; },
  setCurrentPageAsync: async () => {},
  createFrame: frame, createRectangle: () => node("RECTANGLE"), createText: textNode,
  createImage(bytes) { const h = "h" + hashN++; imgs[h] = bytes; return { hash: h }; },
  base64Decode: (s) => Buffer.from(s, "base64"),
  viewport: { scrollAndZoomIntoView() {} },
  closePlugin(msg) { console.log("closePlugin:", msg); finish(); },
};
global.console.warn = (...a) => console.log("WARN", ...a);
function finish() {
  let page = pages[0]; if (!page) return;
  if (page.type === "SLIDE_GRID") { const rows = page.children; const last = rows[rows.length - 1]; page = { children: last.children.map((c) => { c.x = 0; c.y = 0; return c; }) }; console.log("rows:", rows.length, "slides in last row:", last.children.length); }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const hashKey = {}; // map hash -> data uri
  for (const [h, b] of Object.entries(imgs)) hashKey[h] = "data:image/" + (b[0] === 0x89 ? "png" : "jpeg") + ";base64," + Buffer.from(b).toString("base64");
  page.children.forEach((s, i) => {
    let out = [];
    const draw = (n, ox, oy) => {
      const x = ox + n.x, y = oy + n.y;
      const f = (n.fills || [])[0];
      if (n.type === "TEXT") {
        const col = f && f.color ? `rgb(${f.color.r * 255},${f.color.g * 255},${f.color.b * 255})` : "#000";
        const lh = n.fontSize * n.lineHeight.value / 100, cw = n.fontSize * 0.53;
        const per = n.textAutoResize === "HEIGHT" ? Math.max(1, Math.floor(n.width / cw)) : 9999;
        let lines = []; for (const l of n.characters.split("\n")) { for (let k = 0; k < Math.max(1, l.length); k += per) lines.push(l.slice(k, k + per)); }
        lines.forEach((l, j) => out.push(`<text x="${x}" y="${y + (j + 0.8) * lh}" font-family="Noto Sans, Arial" font-size="${n.fontSize}" fill="${col}"${n.links ? ' text-decoration="underline"' : ""}>${esc(l)}</text>`));
        if (y + n.height > 1080 + 1 && oy === 0) errors.push(`slide ${i + 1}: text overflows bottom (${Math.round(y + n.height)}) '${n.characters.slice(0, 40)}'`);
        return;
      }
      if (f && f.type === "IMAGE") out.push(`<image href="${hashKey[f.imageHash]}" x="${x}" y="${y}" width="${n.width}" height="${n.height}" preserveAspectRatio="${f.scaleMode === "FIT" ? "xMidYMid meet" : "xMidYMid slice"}"/>`);
      else if (f && f.type === "SOLID") out.push(`<rect x="${x}" y="${y}" width="${n.width}" height="${n.height}" rx="${n.cornerRadius || 0}" fill="rgb(${f.color.r * 255},${f.color.g * 255},${f.color.b * 255})" fill-opacity="${f.opacity == null ? 1 : f.opacity}"/>`);
      else if (f && f.type === "GRADIENT_LINEAR") out.push(`<rect x="${x}" y="${y}" width="${n.width}" height="${n.height}" fill="url(#g)"/>`);
      if (n.dashPattern) out.push(`<rect x="${x}" y="${y}" width="${n.width}" height="${n.height}" rx="24" fill="none" stroke="#FF3D9A" stroke-width="3" stroke-dasharray="16 12"/>`);
      if (n !== s && n.type !== "TEXT" && y + n.height > 1081 && n.height < 1080) errors.push(`slide ${i + 1}: '${n.name}' goes below the frame (${Math.round(y + n.height)})`);
      for (const c of n.children || []) draw(c, n === s ? 0 : x, n === s ? 0 : y);
    };
    draw(s, -s.x, -s.y);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-opacity=".35"/><stop offset="1" stop-opacity=".8"/></linearGradient></defs>${out.join("")}</svg>`;
    fs.writeFileSync(path.join(outDir, String(i + 1).padStart(2, "0") + ".svg"), svg);
  });
  console.log(page.children.length, "slides;", errors.length ? "ISSUES:\n" + errors.join("\n") : "no layout issues");
}
require(path.resolve(codePath));
