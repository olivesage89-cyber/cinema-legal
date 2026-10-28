const { chromium } = require('playwright'); const fs=require('fs');
const F=(process.env.ENGINE||require('path').resolve(__dirname,'..'))+'/node_modules/@fontsource/'; const ff=(w)=>`@font-face{font-family:M;font-weight:${w};src:url(file://${F}montserrat/files/montserrat-latin-${w}-normal.woff2)}`;
const T=JSON.parse(fs.readFileSync(process.argv[2]));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
for(const [k,o] of Object.entries(T)){fs.writeFileSync(''+require('path').resolve(process.argv[3]||'.')+'/_q.html',`<html><head><style>${ff(600)}*{margin:0}body{width:1080px;height:1920px;background:transparent}
.t{position:absolute;left:150px;right:150px;top:${o.ty}%;transform:translateY(-50%);text-align:center;color:${o.c};font-family:M;font-weight:600;font-size:${o.fs||60}px;line-height:1.22;letter-spacing:-.01em;text-shadow:0 1px 2px rgba(0,0,0,.55),0 2px 10px rgba(0,0,0,.35)}</style></head><body><div class="t">${o.t}</div></body></html>`);
await p.goto('file://'+require('path').resolve(process.argv[3]||'.')+'/_q.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(80);await p.screenshot({path:require('path').resolve(process.argv[3]||'.')+`/t_${k}.png`,omitBackground:true});}
await b.close();})();
