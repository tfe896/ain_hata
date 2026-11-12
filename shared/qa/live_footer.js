const { chromium, devices } = require('playwright');
const PREFIX = process.env.PREFIX || 'mz'; // префікс класів проєкту (mz — Mazda)
const NAME = process.env.NAME || 'mazda';  // коротка назва проєкту (файли <name>.js, <name>-anim-vN.js)
const __qaP = PREFIX; // те саме ім'я є й у сторінці (window.__qaP), тож селектори однакові з обох боків
const URL = process.env.URL;
if (!URL) throw new Error('Задайте URL=https://...');
// VERSION=v4 — чекати саме цю версію файлів; без неї підійде будь-яка <name>-anim-vN / <name>-style-vN
const WANT = NAME + '-(anim|style)-' + (process.env.VERSION ? process.env.VERSION + '\\b' : 'v\\d');
(async () => {
  const b = await chromium.launch();
  for (const [name, opts] of [['desk', { viewport: { width: 1440, height: 900 } }], ['mob', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts); await ctx.addInitScript(v => { window.__qaP = v; }, PREFIX); const p = await ctx.newPage();
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
    let ok = false;
    for (let i = 0; i < 12 && !ok; i++) { await p.goto(URL + '?t=' + Date.now(), { waitUntil: 'domcontentloaded' }); ok = await p.evaluate(re => !!document.querySelector('.ainf-cards') && new RegExp(re).test(document.documentElement.innerHTML), WANT); if (!ok) await p.waitForTimeout(5000); }
    console.log(name, 'live', WANT, '+ footer:', ok);
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => ({
      imgs: [...document.querySelectorAll('.ainf-card_img, .ainf-logo')].map(i => [i.complete && i.naturalWidth > 0, i.naturalWidth]),
      blank: [...document.querySelectorAll('.ainf-link, .ainf-card, .ainf-all')].filter(a => a.target !== '_blank' && !/^mailto/.test(a.href)).length,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      js: document.documentElement.classList.contains(__qaP + '-js'),
    }));
    console.log(name, JSON.stringify(info), 'errors', JSON.stringify(errs.filter(e => !/fonts|ERR_FAILED/.test(e))));
    await p.evaluate(() => document.querySelector('.ain-footer').scrollIntoView({ block: 'start' }));
    await p.waitForTimeout(1600);
    await p.screenshot({ path: 'live_' + name + '_1.png' });
    await p.evaluate(() => document.querySelector('.ainf-panel').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(1600);
    await p.screenshot({ path: 'live_' + name + '_2.png' });
    await ctx.close();
  }
  await b.close();
})();
