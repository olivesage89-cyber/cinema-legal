const {chromium}=require('playwright');const fs=require('fs');
const F='file:///root/engine/node_modules/@fontsource';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}/${p})}`;
const fonts=[ff('DMS','dm-serif-display/files/dm-serif-display-latin-400-normal.woff2'),ff('DMS','dm-serif-display/files/dm-serif-display-latin-400-italic.woff2',400,'italic'),
ff('Corm','cormorant-garamond/files/cormorant-garamond-latin-500-normal.woff2',500),ff('Corm','cormorant-garamond/files/cormorant-garamond-latin-500-italic.woff2',500,'italic'),
ff('Cav','caveat/files/caveat-latin-600-normal.woff2',600),ff('Cin','cinzel/files/cinzel-latin-600-normal.woff2',600),
ff('Bod','bodoni-moda/files/bodoni-moda-latin-500-normal.woff2',500),ff('Bod','bodoni-moda/files/bodoni-moda-latin-500-italic.woff2',500,'italic'),
ff('GV','great-vibes/files/great-vibes-latin-400-normal.woff2'),ff('Mont','montserrat/files/montserrat-latin-600-normal.woff2',600),ff('Mont','montserrat/files/montserrat-latin-500-normal.woff2',500)].join('');
// topo lines
function topo(col,op){let s='';const rnd=(()=>{let x=7;return()=>(x=(x*16807)%2147483647)/2147483647})();
for(let c=0;c<2;c++){const cx=rnd()*1080,cy=rnd()*1350;for(let r=70;r<1100;r+=64){let d='';for(let a=0;a<=64;a++){const t=a/64*Math.PI*2;const rr=r*(1+0.18*Math.sin(3*t+c)+0.1*Math.sin(5*t+r/90));d+=(a?'L':'M')+(cx+rr*Math.cos(t)).toFixed(1)+' '+(cy+rr*0.8*Math.sin(t)).toFixed(1)}s+=`<path d="${d}Z" fill="none" stroke="${col}" stroke-width="1.3" opacity="${op}"/>`}}
return `<svg class="bg" width="1080" height="1350">${s}</svg>`}
const grain=`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:.35"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .6 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const wave=(col)=>`<svg class="bg" width="1080" height="1350"><defs><pattern id="w" width="80" height="40" patternUnits="userSpaceOnUse">${[0,1,2].map(i=>`<circle cx="40" cy="40" r="${36-i*11}" fill="none" stroke="${col}" stroke-width="1.4"/><circle cx="0" cy="20" r="${36-i*11}" fill="none" stroke="${col}" stroke-width="1.4"/><circle cx="80" cy="20" r="${36-i*11}" fill="none" stroke="${col}" stroke-width="1.4"/>`).join('')}</pattern></defs><rect width="1080" height="1350" fill="url(#w)" opacity=".16"/></svg>`;
const stars=()=>{let s='';let x=11;const r=()=>(x=(x*16807)%2147483647)/2147483647;for(let i=0;i<140;i++)s+=`<circle cx="${r()*1080}" cy="${r()*1350}" r="${r()*1.8+.3}" fill="#f1e3b8" opacity="${r()*.7+.2}"/>`;return `<svg class="bg" width="1080" height="1350">${s}</svg>`};
const base=`*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}.bg{position:absolute;inset:0}.c{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 110px}.ft{position:absolute;bottom:78px;left:100px;right:100px;display:flex;justify-content:space-between;font:600 24px Mont;letter-spacing:.42em}`;
const covers={
anime:`<style>${fonts}${base}body{background:#efe6d3}.fr{position:absolute;inset:44px;border:2px solid #24443699}.fr2{position:absolute;inset:56px;border:1px solid #24443655}
.win{position:absolute;left:150px;right:150px;top:250px;height:820px;border-radius:390px 390px 18px 18px;background:#24443a;box-shadow:0 0 0 14px #f4ecdc,0 0 0 16px #2444364d,0 40px 80px #0003;overflow:hidden}
.win:before{content:'';position:absolute;inset:0;background:radial-gradient(600px 500px at 50% 20%,#3d6b5a,#1b3029 70%)}
.top{position:absolute;top:120px;left:0;right:0;text-align:center;font:600 30px Mont;letter-spacing:.5em;color:#244436}
.wc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:120px 70px 40px;text-align:center}
.k{font:500 italic 52px Corm;color:#e9dcc0;margin-bottom:24px}.h{font:400 96px/1.04 DMS;color:#f6efe0}.h i{color:#e9a05a}
.s{position:absolute;bottom:150px;left:0;right:0;text-align:center;font:500 italic 48px Corm;color:#2b2a26}.ft{color:#24443699}</style>
${topo('#6b6a55',.18)}${grain}<div class="fr"></div><div class="fr2"></div><div class="top">ANIME HIDDEN GEMS</div>
<div class="win"><div class="wc"><div class="k">anime that teach you</div><div class="h">some truths are <i>hard</i> to accept</div></div></div>
<div class="s">five stories that stay with you</div><div class="ft"><span>05 ANIME</span><span>SWIPE →</span></div>`,
motion:`<style>${fonts}${base}body{background:#e9e1d0}.fr{position:absolute;inset:44px;border:2px solid #24443699}.fr2{position:absolute;inset:56px;border:1px solid #24443655}
.lb{font:600 30px Mont;letter-spacing:.5em;color:#244436;margin-bottom:70px}.k{font:400 74px GV;color:#b4422c;margin-bottom:-6px}
.h{font:400 118px/1 DMS;color:#244436;letter-spacing:-1.5px}.s{font:500 italic 50px Corm;color:#2b2a26;margin-top:50px}.ft{color:#24443699}</style>
${topo('#6b6a55',.22)}${grain}<div class="fr"></div><div class="fr2"></div>
<div class="c"><div class="lb">MOVIE HIDDEN GEMS</div><div class="k">if you still believe</div><div class="h">good people exist</div><div class="s">— watch these</div></div><div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>`,
ede:`<style>${fonts}${base}body{background:radial-gradient(900px 900px at 50% 40%,#1c2340,#0c1022)}.fr{position:absolute;inset:44px;border:2px solid #c9a75a99}.fr2{position:absolute;inset:58px;border:1px solid #c9a75a55}
.lb{font:600 30px Mont;letter-spacing:.5em;color:#c9a75a;margin-bottom:80px}.h{font:500 120px/1.02 Bod;color:#f3ead6}.h i{font-style:italic;color:#e3c47e}
.s{font:500 italic 54px Corm;color:#d8ccb0;margin-top:46px}.orn{color:#c9a75a;font:600 34px Cin;margin:40px 0 0;letter-spacing:.4em}.ft{color:#c9a75a99}</style>
${stars()}${grain.replace('multiply','overlay')}<div class="fr"></div><div class="fr2"></div>
<div class="c"><div class="lb">HIDDEN GEM MOVIES</div><div class="h">keep <i>going.</i></div><div class="s">even when nobody notices.</div><div class="orn">✦ ✦ ✦</div></div><div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>`,
cozy:`<style>${fonts}${base}body{background:#d9c4a3}.pl{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#8b3a2b22 0 26px,transparent 26px 70px),repeating-linear-gradient(90deg,#8b3a2b22 0 26px,transparent 26px 70px)}
.card{position:absolute;left:110px;right:110px;top:190px;bottom:190px;background:#f4ead8;border-radius:24px;box-shadow:0 30px 70px #5a2a1f40}
.lb{font:600 30px Mont;letter-spacing:.5em;color:#8b3a2b;margin-bottom:60px}.h{font:600 116px/1 Cav;color:#4a2a20}.s{font:500 italic 50px Corm;color:#6b4a3a;margin-top:44px}.ft{color:#4a2a20aa;bottom:110px;left:150px;right:150px}
.c{padding:0 170px}</style>
<div class="pl"></div>${grain}<div class="card"></div>
<div class="c"><div class="lb">COZY MOVIE NIGHT</div><div class="h">movies that feel like a warm blanket</div><div class="s">for the coldest nights of the year</div></div><div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>`,
vivian:`<style>${fonts}${base}body{background:#f6f1e7}.ln{position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 63px,#9fb5d066 63px 65px)}.mg{position:absolute;top:0;bottom:0;left:140px;width:2px;background:#e2878766}
.h{font:600 108px/1.05 Cav;color:#2a2a33;text-align:left}.h u{text-decoration:none;background:linear-gradient(transparent 58%,#f6c9d2 58%)}.c{align-items:flex-start;padding:0 120px 0 190px}.s{font:600 58px Cav;color:#7a6f74;margin-top:40px}</style>
<div class="ln"></div><div class="mg"></div>${grain}
<div class="c"><div class="h">watch these when you miss someone you <u>shouldn't text</u></div><div class="s">trust me 🤍</div></div>`};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [k,h] of Object.entries(covers)){fs.writeFileSync('t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+process.cwd()+'/t.html');await p.waitForTimeout(700);await p.screenshot({path:k+'.jpg',type:'jpeg',quality:92});}
await b.close();})();
