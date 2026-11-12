const { chromium } = require('playwright'); const http=require('http'),fs=require('fs'),path=require('path');
const ROOT = process.env.ROOT || process.cwd(); const T={'.html':'text/html','.css':'text/css','.js':'text/javascript','.jpg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml','.mp4':'video/mp4','.woff2':'font/woff2'};
const srv=http.createServer((q,r)=>{let p=decodeURIComponent(q.url.split('?')[0]);if(p==='/')p='/index.html';fs.readFile(path.join(ROOT,p),(e,b)=>{if(e){r.writeHead(404);r.end();return}r.writeHead(200,{'content-type':T[path.extname(p)]||'application/octet-stream'});r.end(b)})}).listen(8126);
(async()=>{const b=await chromium.launch();const p=await (await b.newContext({viewport:{width:1440,height:900}})).newPage();
await p.route(/fonts\.(googleapis|gstatic)\.com/,r=>r.abort());await p.goto('http://localhost:8126/');await p.waitForTimeout(3500);
const H=await p.evaluate(()=>document.documentElement.scrollHeight);let moved=0,n=0;
for(let y=0;y<H;y+=150){await p.evaluate(y=>scrollTo(0,y),y);await p.waitForTimeout(40);
 const v=await p.evaluate(()=>[...document.querySelectorAll('[data-shot]')].map(e=>e.style.getPropertyValue('--mz-py')));n++;if(v.some(x=>x&&x!=='0px'))moved++;}
const big=await p.evaluate(()=>[...document.querySelectorAll('.mz-plate-img,.mz-handling-bg')].some(e=>e.style.getPropertyValue('--mz-py')));
console.log('кроків прокрутки:',n,'| з ненульовим зсувом полароїдів:',moved,'| паралакс великих фото працює:',big);
await b.close();srv.close();})();
