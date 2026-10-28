// Vivian influencer slideshow: full-bleed photos, TikTok-style centred white text. Usage: node render_viv.js DIR (DIR/viv.json)
const { chromium } = require('playwright'); const fs = require('fs'), path=require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/viv.json'));
const F = '/root/engine/node_modules/@fontsource/';
const ff = (fam, pkg, w) => `@font-face{font-family:'${fam}';font-weight:${w};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-normal.woff2)}`;
const css = [ff('M','montserrat',500),ff('M','montserrat',600),ff('M','montserrat',700)].join('')+`
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;background:#000;font-family:M}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sh{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.28))}
.t{position:absolute;left:90px;right:90px;text-align:center;color:#F6E58D;font-weight:600;font-size:50px;line-height:1.28;
 text-shadow:0 0 3px rgba(0,0,0,.85),0 2px 10px rgba(0,0,0,.55),0 0 1px #000}
.k{display:block;font-size:34px;font-weight:700;margin-bottom:14px;letter-spacing:.01em}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,s] of S.slides.entries()){
 fs.writeFileSync(D+'/_v.html',`<html><head><style>${css}</style></head><body><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x||50}% ${s.y||50}%;${s.f||''}"><div class="sh"></div><div class="t" style="color:${s.c||'#F6E58D'};top:${s.ty||60}%;transform:translateY(-50%)">${s.k?`<span class="k">${s.k}</span>`:''}${s.t}</div></body></html>`);
 await p.goto('file://'+D+'/_v.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);
 await p.screenshot({path:`${D}/out/0${i+1}_${s.img.replace('.jpg','')}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
