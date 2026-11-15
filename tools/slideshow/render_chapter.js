// "some people are only meant to stay for a chapter" — NOVEL PAGES: ivory book page, rust cloth bookplate cover,
// Bodoni Moda titles in per-film ink, Crimson Pro prose w/ drop cap, Cinzel running heads, ribbon bookmark, tipped-in plate.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('Bo','bodoni-moda/files/bodoni-moda-latin-500-normal.woff2',500),ff('Bo','bodoni-moda/files/bodoni-moda-latin-500-italic.woff2',500,'italic'),
ff('Bo','bodoni-moda/files/bodoni-moda-latin-400-italic.woff2',400,'italic'),ff('Bo','bodoni-moda/files/bodoni-moda-latin-600-normal.woff2',600),
ff('Bo','bodoni-moda/files/bodoni-moda-latin-600-italic.woff2',600,'italic'),
ff('Ci','cinzel/files/cinzel-latin-500-normal.woff2',500),ff('Ci','cinzel/files/cinzel-latin-600-normal.woff2',600),
ff('Cr','crimson-pro/files/crimson-pro-latin-400-normal.woff2',400),ff('Cr','crimson-pro/files/crimson-pro-latin-400-italic.woff2',400,'italic'),
ff('Cr','crimson-pro/files/crimson-pro-latin-600-normal.woff2',600),ff('Cr','crimson-pro/files/crimson-pro-latin-300-italic.woff2',300,'italic')].join('');
const PAPER='#EFE6D6',INK='#2A211C',CLOTH='#4A2742',GOLD='#F3CF86';
const grain=(op=.3)=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:${op}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .5 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const fibre=`<svg class="bg" width="1080" height="1350" style="opacity:.55"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".01 .06" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .46  0 0 0 0 .34  0 0 0 .13 0"/></filter><rect width="1080" height="1350" filter="url(#f)"/></svg>`;
// book page shading: gutter on the left, soft edge vignette
const page=`<div class="bg" style="background:linear-gradient(90deg,#5a432a33 0,#5a432a12 40px,#0000 120px),radial-gradient(130% 100% at 55% 50%,#0000 60%,#6b4a2a22 100%)"></div>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}`;
const notch=(r)=>`-webkit-mask:radial-gradient(circle ${r}px at 0 0,#0000 98%,#000) top left,radial-gradient(circle ${r}px at 100% 0,#0000 98%,#000) top right,radial-gradient(circle ${r}px at 0 100%,#0000 98%,#000) bottom left,radial-gradient(circle ${r}px at 100% 100%,#0000 98%,#000) bottom right;-webkit-mask-size:51% 51%;-webkit-mask-repeat:no-repeat`;
function cover(c){return `<style>${fonts}${base}
.frame{position:absolute;inset:44px;border:1.5px solid ${CLOTH}66}.frame:after{content:'';position:absolute;inset:9px;border:1px solid ${CLOTH}38}
.lb{position:absolute;top:118px;left:0;right:0;text-align:center;font:600 30px Ci;letter-spacing:.5em;color:${CLOTH};padding-left:.5em}
.orn{position:absolute;top:166px;left:0;right:0;text-align:center;font:400 italic 30px Bo;color:${CLOTH}aa;letter-spacing:.4em}
.ring{position:absolute;left:138px;top:236px;width:804px;height:832px;background:${GOLD};border-radius:6px 64px 64px 6px;filter:drop-shadow(0 30px 40px #5a2a1a40)}
.ring2{position:absolute;left:146px;top:244px;width:788px;height:816px;background:${PAPER};border-radius:4px 58px 58px 4px}
.win{position:absolute;left:158px;top:256px;width:764px;height:792px;border-radius:2px 48px 48px 2px;overflow:hidden;
 background:radial-gradient(90% 70% at 55% 30%,#6A3A60 0%,#4A2742 48%,#2E1729 100%)}
.cloth{position:absolute;inset:0;opacity:.35;mix-blend-mode:overlay}
.inner{position:absolute;left:262px;top:284px;width:632px;height:736px;border:1.5px solid ${GOLD}88;border-radius:2px 30px 30px 2px}
.inner2{position:absolute;left:276px;top:298px;width:604px;height:708px;border:1px solid ${GOLD}55;border-radius:2px 22px 22px 2px}
.spine{position:absolute;left:158px;top:256px;width:74px;height:792px;background:linear-gradient(90deg,#00000055,#0000 30%,#ffffff14 55%,#00000040);border-right:1.5px solid #0000004d}
.band{position:absolute;left:158px;width:74px;height:10px;border-top:1.5px solid ${GOLD}aa;border-bottom:1.5px solid ${GOLD}aa}
.ribbon{position:absolute;left:800px;top:1036px;width:44px;height:84px;background:linear-gradient(90deg,#C9A24F,#F3CF86 45%,#B98E3E);
 clip-path:polygon(0 0,100% 0,100% 100%,50% 86%,0 100%);box-shadow:0 0 0 1px #0002;filter:drop-shadow(4px 8px 8px #0004);z-index:4}
.wc{position:absolute;left:232px;width:690px;top:${c.top||400}px;text-align:center;z-index:3}
.k{font:300 italic 46px Cr;color:#F6E9D5d0;letter-spacing:.01em}
.h{margin-top:30px;font:500 84px/1.06 Bo;color:#FBF1E2;letter-spacing:-1px;padding:0 50px}
.h i{display:block;margin-top:8px;font:500 italic 150px/1 Bo;color:${GOLD};letter-spacing:-2px}
.dot{margin-top:34px;font:500 22px Ci;letter-spacing:.7em;color:${GOLD}bb;padding-left:.7em}
.sub{position:absolute;top:1138px;left:0;right:0;text-align:center;font:400 italic 44px Cr;color:${INK}}
.ft{position:absolute;bottom:84px;left:100px;right:100px;display:flex;justify-content:space-between;font:600 22px Ci;letter-spacing:.42em;color:${CLOTH}aa}
</style>${fibre}${page}<div class="frame"></div>
<div class="lb">MOVIE HIDDEN GEMS</div><div class="orn">~ ❦ ~</div>
<div class="ring"></div><div class="ring2"></div>
<div class="win"><svg class="cloth" width="764" height="792"><filter id="c"><feTurbulence type="fractalNoise" baseFrequency=".9 .02" numOctaves="2" seed="2"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 .9  0 0 0 0 .8  0 0 0 .9 -.2"/></filter><rect width="764" height="792" filter="url(#c)"/></svg></div>
<div class="spine"></div><div class="band" style="top:300px"></div><div class="band" style="top:330px"></div><div class="band" style="top:984px"></div><div class="band" style="top:1014px"></div><div class="inner"></div><div class="inner2"></div><div class="ribbon"></div>
<div class="wc"><div class="k">${c.kick}</div><div class="h">${c.h}<i>${c.h2}</i></div><div class="dot">I · II · III · IV · V</div></div>
<div class="sub">${c.sub}</div>
<div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>${grain()}`}
const RN=['I','II','III','IV','V'];
function film(m,i){const big='file://'+D+'/'+m.big,pl='file://'+D+'/'+m.plate;return `<style>${fonts}${base}
.hd{position:absolute;top:66px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:baseline}
.hd .l{font:600 24px Ci;letter-spacing:.34em;color:${m.ink}}.hd .r{font:500 18px Ci;letter-spacing:.3em;color:${INK}88}
.rule{position:absolute;top:108px;left:96px;right:96px;height:1px;background:${INK}40}
.big{position:absolute;left:96px;top:146px;width:888px;height:540px;background:url(${big}) ${m.bx||50}% ${m.by||50}%/cover;filter:${m.filt||'saturate(.9) contrast(1.03) sepia(.08)'}}
.bigf{position:absolute;left:84px;top:134px;width:912px;height:564px;border:1px solid ${INK}55}
.ribbon{position:absolute;left:1006px;top:0;width:40px;height:${m.rh||300}px;background:linear-gradient(90deg,${m.ink}dd,${m.ink} 45%,${m.ink}cc);
 clip-path:polygon(0 0,100% 0,100% 100%,50% 88%,0 100%);filter:drop-shadow(4px 8px 7px #0005);z-index:5}
.ribbon:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#fff2 0,#fff0 30%,#0001 100%)}
.col{position:absolute;left:96px;right:96px;top:${m.ct||722}px}
.t{font:600 ${m.fs||84}px/1.0 Bo;color:${m.ink};letter-spacing:-1px}
.t i{font:400 italic ${Math.round((m.fs||84)*0.52)}px Bo;color:${INK}99;letter-spacing:0;margin-left:10px;white-space:nowrap}
.meta{margin-top:16px;font:500 19px Ci;letter-spacing:.3em;color:${INK}aa}
.row{margin-top:34px;display:flex;gap:46px;align-items:flex-start}
.ov{flex:1;font:400 30px/1.4 Cr;color:${INK};text-align:justify;hyphens:auto;-webkit-hyphens:auto}
.ov:first-letter{float:left;font:600 100px/0.8 Bo;color:${m.ink};margin:8px 12px 0 0}
.ov b{font-weight:600;color:${m.ink}}
.pw{width:312px;flex:none;margin-top:8px;margin-right:4px}
.pl{width:312px;height:226px;background:url(${pl}) ${m.px||50}% ${m.py||50}%/cover;
 box-shadow:0 0 0 12px #FBF6EC,0 0 0 13px #2a211c22,0 18px 34px #3a2a1a40;transform:rotate(1.8deg);filter:${m.filt||'saturate(.9) sepia(.08)'}}
.cap{margin-top:34px;text-align:center;font:400 italic 25px/1.25 Cr;color:${INK}bb}
.cap b{font:500 15px Ci;letter-spacing:.3em;color:${m.ink};display:block;margin-bottom:6px;font-style:normal}
.pn{position:absolute;bottom:58px;left:0;right:0;text-align:center;font:400 italic 30px Bo;color:${INK}99}
</style>${fibre}${page}
<div class="hd"><span class="l">CHAPTER ${RN[i]}</span><span class="r">SOME PEOPLE STAY FOR A CHAPTER</span></div><div class="rule"></div>
<div class="bigf"></div><div class="big"></div><div class="ribbon"></div>
<div class="col"><div class="t">${m.t}<i>(${m.yr})</i></div>
<div class="meta">DIRECTED BY ${m.dir.toUpperCase()}</div>
<div class="row"><div class="ov">${m.ov}</div><div class="pw"><div class="pl"></div><div class="cap"><b>PLATE ${RN[i]}</b>${m.cap}</div></div></div></div>
<div class="pn">— ${i+1} —</div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const only=process.argv[3];
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])];
for(const [n,h] of pages){if(only&&!n.startsWith(only))continue;fs.writeFileSync(D+'/t.html','<html lang="en"><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
