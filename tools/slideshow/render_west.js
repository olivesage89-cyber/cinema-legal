// OLD WEST broadside IG slides. node render_west.js DIR (reads DIR/slides_west.json) -> DIR/out/0N.jpg
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides_west.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('Ry','rye',400)+ff('Os','oswald',500)+ff('Lb','libre-baskerville',400,'italic')+ff('Lb','libre-baskerville',400)+`
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:#EBDDBF;color:#2B1A10;text-align:center}
.tex{position:absolute;inset:0;opacity:.55;mix-blend-mode:multiply}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(90,55,25,.38) 100%)}
.bd{position:absolute;inset:34px;border:3px double #5A3A22;border-radius:6px}
.st{position:absolute;font:400 26px Ry;color:#5A3A22}
.k{position:absolute;top:78px;width:100%;font:500 26px Os;letter-spacing:.5em;padding-left:.5em;color:#2F8C83}
.kk{position:absolute;top:118px;width:100%;font:400 italic 30px Lb;color:#6B4A30}
.ph{position:absolute;left:90px;top:180px;width:900px;height:560px;border:10px solid #F6EEDC;box-shadow:0 0 0 2px #5A3A22,0 18px 40px rgba(60,35,15,.35);overflow:hidden}
.ph img{width:100%;height:100%;object-fit:cover;filter:sepia(.18) contrast(1.05) saturate(.95)}
.t{position:absolute;top:785px;width:100%;height:220px;display:flex;align-items:center;justify-content:center}
.t div{font:400 var(--fs)/1.05 Ry;color:#2B1A10;max-width:940px}
.d{position:absolute;top:1018px;width:100%;font:500 25px Os;letter-spacing:.32em;padding-left:.32em;color:#5A3A22}
.r{position:absolute;top:1070px;width:100%;display:flex;justify-content:center;align-items:center;gap:16px;color:#5A3A22}
.r i{display:block;width:170px;border-top:2px dashed #5A3A22}
.l{position:absolute;top:1112px;width:100%;padding:0 120px;font:400 italic 32px/1.4 Lb;color:#3B2616}
.w{position:absolute;top:1218px;width:100%;font:500 24px Os;letter-spacing:.34em;padding-left:.34em;color:#2F8C83}`;
const tex=`<svg class="tex" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .3  0 0 0 0 .15  0 0 0 .5 0"/></filter><filter id="m"><feTurbulence type="fractalNoise" baseFrequency=".012" numOctaves="3" seed="9"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .32  0 0 0 0 .15  0 0 0 .35 0"/></filter><rect width="1080" height="1350" filter="url(#m)"/><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,f] of S.films.entries()){
const html=`<html><head><style>${css}</style></head><body>${tex}<div class="vig"></div><div class="bd"></div>
<div class="st" style="top:44px;left:48px">★</div><div class="st" style="top:44px;right:48px">★</div><div class="st" style="bottom:44px;left:48px">★</div><div class="st" style="bottom:44px;right:48px">★</div>
<div class="k">★ &nbsp;TRAIL 0${i+1} / 05&nbsp; ★</div><div class="kk">movies that feel like the old west</div>
<div class="ph"><img src="file://${D}/${f.img}" style="object-position:${f.x||50}% ${f.y||50}%"></div>
<div class="t"><div style="--fs:${f.fs}px">${f.t}</div></div>
<div class="d">DIR. ${f.dir.toUpperCase()} &nbsp;·&nbsp; ${f.yr}</div>
<div class="r"><i></i><span style="font:400 24px Ry">★</span><i></i></div>
<div class="l">${f.line}</div><div class="w">NOW SHOWING · ${f.where.toUpperCase()}</div></body></html>`;
fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
await p.screenshot({path:`${D}/out/0${i+1}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
