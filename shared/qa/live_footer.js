const { chromium, devices } = require('playwright');
const URL = process.env.URL;
if (!URL) throw new Error('Задайте URL=https://...');
(async () => {
  const b = await chromium.launch();
  for (const [name, opts] of [['desk', { viewport: { width: 1440, height: 900 } }], ['mob', { ...devices['iPhone 13'] }]]) {
    const ctx = await b.newContext(opts); const p = await ctx.newPage();
    await p.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', m => { if (m.type() === 'error') errs.push(m.text().slice(0, 140)); });
    let ok = false;
    for (let i = 0; i < 12 && !ok; i++) { await p.goto(URL + '?t=' + Date.now(), { waitUntil: 'domcontentloaded' }); ok = await p.evaluate(() => !!document.querySelector('.ainf-cards') && /mazda-anim-v4|mazda-style-v4/.test(document.documentElement.innerHTML)); if (!ok) await p.waitForTimeout(5000); }
    console.log(name, 'live v4 + footer:', ok);
    await p.waitForTimeout(3500);
    const info = await p.evaluate(() => ({
      imgs: [...document.querySelectorAll('.ainf-card_img, .ainf-logo')].map(i => [i.complete && i.naturalWidth > 0, i.naturalWidth]),
      blank: [...document.querySelectorAll('.ainf-link, .ainf-card, .ainf-all')].filter(a => a.target !== '_blank' && !/^mailto/.test(a.href)).length,
      overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      js: document.documentElement.classList.contains('mz-js'),
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
