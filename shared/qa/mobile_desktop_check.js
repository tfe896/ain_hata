// Перевірка після правок: телефон (стрибки фото, переповнення, відео) і широкий десктоп (блок «Керованість»).
const { chromium, devices } = require('playwright');
const PREFIX = process.env.PREFIX || 'mz'; // префікс класів проєкту (mz — Mazda)
const NAME = process.env.NAME || 'mazda';  // коротка назва проєкту (файли <name>.js, <name>-anim-vN.js)
const __qaP = PREFIX; // те саме ім'я є й у сторінці (window.__qaP), тож селектори однакові з обох боків
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = process.env.ROOT || process.cwd();
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/index.html';
  fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); });
}).listen(8124);

(async () => {
  const b = await chromium.launch();
  // ---------- телефон ----------
  const ctx = await b.newContext({ ...devices['iPhone 13'] }); await ctx.addInitScript(v => { window.__qaP = v; }, PREFIX);
  const p = await ctx.newPage();
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
  await p.goto('http://localhost:8124/', { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(3500);
  const info = await p.evaluate(() => ({
    touch: document.documentElement.classList.contains(__qaP + '-touch'),
    video: (document.querySelector('.' + __qaP + '-hero-video') || {}).currentSrc || (document.querySelector('.' + __qaP + '-hero-video') || {}).src,
    playing: !!document.querySelector('.' + __qaP + '-hero-video.is-on'),
    heroH: document.querySelector('.' + __qaP + '-hero').getBoundingClientRect().height, vh: innerHeight,
    overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
  }));
  console.log('mobile', JSON.stringify(info));
  await p.screenshot({ path: 'chk_m_hero.png' });
  // плавна прокрутка вниз і назад: позиція кожного полароїда відносно свого блоку не повинна змінюватися після появи
  const H = await p.evaluate(() => document.documentElement.scrollHeight);
  const seen = {};
  let maxDrift = 0, worst = '';
  const pass = async (ys) => {
    for (const y of ys) {
      await p.evaluate(y => window.scrollTo(0, y), y);
      await p.waitForTimeout(60);
      const rows = await p.evaluate(() => Array.from(document.querySelectorAll('[data-shot]')).map((e, i) => {
        const r = e.getBoundingClientRect(), f = e.parentElement.getBoundingClientRect();
        return { i, set: e.classList.contains('is-set'), dx: r.left - f.left, dy: r.top - f.top, right: r.right, left: r.left };
      }));
      for (const r of rows) {
        if (!r.set) continue;
        if (seen[r.i]) { const d = Math.max(Math.abs(r.dx - seen[r.i].dx), Math.abs(r.dy - seen[r.i].dy)); if (d > maxDrift) { maxDrift = d; worst = 'shot ' + r.i + ' @' + y; } }
        else seen[r.i] = r;
      }
    }
  };
  const down = []; for (let y = 0; y < H; y += 120) down.push(y);
  await pass(down);
  await p.waitForTimeout(1500);
  await pass(down.slice().reverse());
  await pass(down);
  const edges = await p.evaluate(() => Array.from(document.querySelectorAll('[data-shot]')).map(e => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; }));
  console.log('polaroids settled:', Object.keys(seen).length, 'max drift px:', maxDrift.toFixed(2), worst, 'edges', JSON.stringify(edges), 'viewport', 390);
  const stops = await p.evaluate(() => Array.from(document.querySelectorAll('.' + __qaP + '-stop')).map(s => s.classList.contains('is-on')));
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(300);
  const stopsTop = await p.evaluate(() => Array.from(document.querySelectorAll('.' + __qaP + '-stop')).map(s => s.classList.contains('is-on')));
  console.log('stops after scroll', stops.join(','), '| back at top', stopsTop.join(','));
  for (const [name, sel] of [['space', '.' + __qaP + '-feature .' + __qaP + '-fig-shots'], ['roads', '.' + __qaP + '-roads .' + __qaP + '-fig-shots'], ['handling', '.' + __qaP + '-handling']]) {
    await p.evaluate(sel => document.querySelector(sel).scrollIntoView({ block: 'center' }), sel);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: 'chk_m_' + name + '.png' });
  }
  console.log('mobile errors', errs);
  await ctx.close();
  // ---------- десктоп 1440 і 1920: блок «Керованість» ----------
  for (const w of [1440, 1920]) {
    const c = await b.newContext({ viewport: { width: w, height: 900 } }); await c.addInitScript(v => { window.__qaP = v; }, PREFIX);
    const q = await c.newPage();
    await q.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await q.goto('http://localhost:8124/', { waitUntil: 'domcontentloaded' });
    await q.waitForTimeout(3200);
    await q.evaluate(() => document.querySelector('.' + __qaP + '-handling').scrollIntoView({ block: 'center' }));
    await q.waitForTimeout(1600);
    await q.screenshot({ path: 'chk_d' + w + '_handling.png' });
    await c.close();
  }
  await b.close(); srv.close();
})();
