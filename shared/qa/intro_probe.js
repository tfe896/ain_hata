// Вимірює заставку: порожній кадр до завіси, стрибки штампа при передачі, зсуви тексту під час виїзду завіси.
const { chromium, devices } = require('playwright');
const PREFIX = process.env.PREFIX || 'mz'; // префікс класів проєкту (mz — Mazda)
const NAME = process.env.NAME || 'mazda';  // коротка назва проєкту (файли <name>.js, <name>-anim-vN.js)
const __qaP = PREFIX; // те саме ім'я є й у сторінці (window.__qaP), тож селектори однакові з обох боків
const http = require('http'); const fs = require('fs'); const path = require('path');
const ROOT = process.env.ROOT || process.cwd();
const PAGE = process.env.PAGE || 'index.html';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.mp4': 'video/mp4', '.woff2': 'font/woff2' };
const DELAY = +(process.env.DELAY || 700); // імітація повільного завантаження скрипта, мс
const srv = http.createServer((q, r) => {
  let p = decodeURIComponent(q.url.split('?')[0]); if (p === '/') p = '/' + PAGE;
  const send = () => fs.readFile(path.join(ROOT, p), (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { 'content-type': types[path.extname(p)] || 'application/octet-stream' }); r.end(b); });
  if (p.endsWith('/' + NAME + '.js') || /-anim-v\d/.test(p)) setTimeout(send, DELAY); else send();
}).listen(8125);

(async () => {
  const b = await chromium.launch();
  for (const [name, opts] of [['desktop1440', { viewport: { width: 1440, height: 900 } }], ['iphone13', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts); await ctx.addInitScript(v => { window.__qaP = v; }, PREFIX);
    const p = await ctx.newPage();
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await p.addInitScript(() => {
      window.__log = [];
      const t0 = performance.now();
      function tick() {
        const t = Math.round(performance.now() - t0);
        const cur = document.querySelector('.' + __qaP + '-curtain');
        const fly = document.querySelector('.' + __qaP + '-stamp-fly');
        const st = document.querySelector('.' + __qaP + '-hero-stamp');
        const rr = e => { if (!e) return null; const r = e.getBoundingClientRect(); return [Math.round(r.left * 10) / 10, Math.round(r.top * 10) / 10, Math.round(r.width * 10) / 10, Math.round(r.height * 10) / 10]; };
        window.__log.push({ t, cur: !!cur, curTop: cur ? Math.round(cur.getBoundingClientRect().top) : null, fly: rr(fly), stamp: rr(st), stampOp: st ? +getComputedStyle(st).opacity : null, js: document.documentElement.classList.contains(__qaP + '-js'), ov: getComputedStyle(document.documentElement,'::before').content !== 'none', ready: document.documentElement.classList.contains(__qaP + '-ready') });
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    });
    await p.goto('http://localhost:8125/', { waitUntil: 'commit' });
    await p.waitForTimeout(4800);
    const log = await p.evaluate(() => window.__log);
    // 1) час до завіси
    const firstCur = log.find(x => x.cur);
    const firstJs = log.find(x => x.js);
    console.log('\n==', name, '| ' + __qaP + '-js з', firstJs && firstJs.t, 'мс | завіса з', firstCur && firstCur.t, 'мс');
    const gap = log.filter(x => x.js && !x.cur && !x.ov && x.t < (firstCur ? firstCur.t : 9999));
    console.log('кадрів із шаром-заглушкою до завіси:', log.filter(x=>x.ov&&!x.cur).length, '| перший кадр завіси:', firstCur && firstCur.t);
    console.log('кадрів з ' + __qaP + '-js, але БЕЗ завіси й без заглушки (видно сторінку/кремовий фон):', gap.length, gap.length ? '(' + gap[0].t + '–' + gap[gap.length - 1].t + ' мс)' : '');
    // 2) передача штампа: останній кадр польоту і перший кадр справжнього штампа
    const lastFly = [...log].reverse().find(x => x.fly);
    const after = log.find(x => !x.fly && lastFly && x.t > lastFly.t);
    console.log('останній кадр штампа-польоту :', JSON.stringify(lastFly && lastFly.fly), 'op стампа', lastFly && lastFly.stampOp);
    console.log('справжній штамп після польоту :', JSON.stringify(after && after.stamp), 'op', after && after.stampOp);
    if (lastFly && after && lastFly.fly) {
      const a = lastFly.fly, s = after.stamp;
      console.log('розбіжність (dx,dy,dw,dh):', [s[0] - a[0], s[1] - a[1], s[2] - a[2], s[3] - a[3]].map(v => Math.round(v * 10) / 10).join(', '));
    }
    // 3) чи є кадри, де штамп польоту і справжній (opacity 1) видно одночасно
    console.log('кадрів, де справжній штамп уже opacity>0 поки летить копія:', log.filter(x => x.fly && x.stampOp > 0).length);
    await ctx.close();
  }
  await b.close(); srv.close();
})();
