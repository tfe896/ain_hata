const { chromium } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const PREFIX = process.env.PREFIX || 'mz'; // префікс класів проєкту (mz — Mazda)
const NAME = process.env.NAME || 'mazda';  // коротка назва проєкту (файли <name>.js, <name>-anim-vN.js)
const __qaP = PREFIX; // те саме ім'я є й у сторінці (window.__qaP), тож селектори однакові з обох боків
const ROOT = process.env.ROOT || process.cwd(); const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':T[path.extname(p)]||'application/octet-stream'});r.end(b)})}).listen(8126);
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(v => { window.__qaP = v; }, PREFIX);const p=await ctx.newPage();
await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.goto('http://localhost:8126/');await p.waitForTimeout(3500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);let moved=0,n=0;
// Міряємо справжнє положення відносно батьківського блока (працює і з GSAP, і з власним кодом):
// полароїд після появи (is-set) не має зсуватися від скролу; велике фото має.
const rel=sel=>p.evaluate(sel=>[...document.querySelectorAll(sel)].map(e=>e.matches('[data-shot]')&&!e.classList.contains('is-set')?null:Math.round((e.getBoundingClientRect().top-e.parentNode.getBoundingClientRect().top)*10)/10),sel);
const BIG='.' + __qaP + '-plate-img,.' + __qaP + '-handling-bg';const seen={},seenBig={};let big=false;
for(let y=0;y<H;y+=150){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(60);n++;
 const v=await rel('[data-shot]');let m=false;v.forEach((x,i)=>{if(x==null)return;if(seen[i]==null)seen[i]=x;else if(Math.abs(seen[i]-x)>0.5)m=true;});if(m)moved++;
 (await rel(BIG)).forEach((x,i)=>{if(seenBig[i]==null)seenBig[i]=x;else if(Math.abs(seenBig[i]-x)>2)big=true;});}
console.log('кроків прокрутки:',n,'| з ненульовим зсувом полароїдів:',moved,'| паралакс великих фото працює:',big);
await b.close();srv.close();})();
