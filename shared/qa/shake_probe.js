const { chromium, devices } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const PREFIX = process.env.PREFIX || 'mz'; // префікс класів проєкту (mz — Mazda)
const NAME = process.env.NAME || 'mazda';  // коротка назва проєкту (файли <name>.js, <name>-anim-vN.js)
const __qaP = PREFIX; // те саме ім'я є й у сторінці (window.__qaP), тож селектори однакові з обох боків
const ROOT = process.env.ROOT || process.cwd(); const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':T[path.extname(p)]||'application/octet-stream'});r.end(b)})}).listen(8127);
(async()=>{const b=await chromium.launch();
for(const [name,o] of [['desktop1440',{viewport:{width:1440,height:900}}],['iphone13',{...devices['iPhone 13']}]]){
 const ctx=await b.newContext(o);await ctx.addInitScript(v => { window.__qaP = v; }, PREFIX);const p=await ctx.newPage();await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());
 await p.addInitScript(()=>{window.__g=[];(function t(){const c=document.querySelector('.' + __qaP + '-curtain');if(c&&!c.classList.contains('is-out')){const r=c.getBoundingClientRect();window.__g.push({l:r.left,t:r.top,r:r.right,b:r.bottom,sh:c.classList.contains('is-shake'),vw:innerWidth,vh:innerHeight})}requestAnimationFrame(t)})()});
 await p.goto('http://localhost:8127/');await p.waitForTimeout(4200);
 const g=await p.evaluate(()=>window.__g);const sh=g.filter(x=>x.sh);
 let gaps=sh.filter(x=>x.l>0.5||x.t>0.5||x.r<x.vw-0.5||x.b<x.vh-0.5);
 const worst=sh.reduce((m,x)=>Math.max(m,x.l,x.t,x.vw-x.r,x.vh-x.b),0);
 console.log(name,'кадрів трясіння:',sh.length,'| кадрів, де видно сторінку з краю:',gaps.length,'| максимальна щілина, px:',worst.toFixed(1));
 await ctx.close();}
await b.close();srv.close();})();
