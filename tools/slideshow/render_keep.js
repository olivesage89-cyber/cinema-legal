// "keep going" — UNSEEN WORK MAGAZINE: warm paper, giant Anton titles in per-film ink, Fraunces copy, DM Sans caps.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('Fr','fraunces/files/fraunces-latin-400-normal.woff2',400),ff('Fr','fraunces/files/fraunces-latin-400-italic.woff2',400,'italic'),
ff('Fr','fraunces/files/fraunces-latin-600-normal.woff2',600),ff('Fr','fraunces/files/fraunces-latin-600-italic.woff2',600,'italic'),
ff('Fr','fraunces/files/fraunces-latin-300-italic.woff2',300,'italic'),ff('Fr','fraunces/files/fraunces-latin-300-normal.woff2',300),
ff('An','anton/files/anton-latin-400-normal.woff2'),ff('DS','dm-sans/files/dm-sans-latin-600-normal.woff2',600),ff('DS','dm-sans/files/dm-sans-latin-500-normal.woff2',500)].join('');
const PAPER='#F2ECE1',INK='#1E2747';
const grain=(op=.33,mode='multiply')=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:${mode};opacity:${op}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .55 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const fibre=`<svg class="bg" width="1080" height="1350" style="opacity:.5"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="2" seed="9"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .38  0 0 0 .12 0"/></filter><rect width="1080" height="1350" filter="url(#f)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}
.hd{position:absolute;top:62px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font:600 22px DS;letter-spacing:.42em;color:${INK}b0}
.hd .r{letter-spacing:.3em}.rule{position:absolute;top:104px;left:80px;right:80px;height:1.5px;background:${INK}40}`;
// steps motif (subtle stairs) for the cover window
function steps(col,op){let s='';const n=9;for(let i=0;i<n;i++){const y=1000-i*34,x0=60+i*26,x1=720-i*26;s+=`<path d="M${x0} ${y}H${x1}" stroke="${col}" stroke-width="2" opacity="${op*(1-i/n)}"/>`}return s}
function cover(c){return `<style>${fonts}${base}
.lb{position:absolute;top:118px;left:0;right:0;text-align:center;font:600 27px DS;letter-spacing:.55em;color:${INK};padding-left:.55em}
.lb:before,.lb:after{content:'';display:inline-block;width:46px;height:1.5px;background:${INK}80;vertical-align:middle;margin:0 26px 6px}
.win{position:absolute;left:170px;width:740px;top:206px;height:880px;border-radius:370px;overflow:hidden;
 background:radial-gradient(520px 300px at 50% 104%,#FFC46B 0%,#F0913F 30%,#B9584A 52%,#4C3B6B 74%,#1E2747 100%);
 box-shadow:0 0 0 12px ${PAPER},0 0 0 14px ${INK}55,0 36px 70px #1e274733}
.win svg{position:absolute;left:0;top:0}
.sun{position:absolute;left:50%;bottom:-150px;width:300px;height:300px;margin-left:-150px;border-radius:50%;background:radial-gradient(circle,#FFE2A8 0%,#FFC46B 45%,#ffc46b00 70%);opacity:.9}
.wc{position:absolute;left:0;right:0;top:170px;text-align:center}
.h{font:300 166px/0.92 Fr;color:#F7EFE0;letter-spacing:-3px}.h i{font:600 italic 176px/0.92 Fr;color:#FFC46B;letter-spacing:-3px;display:block;margin-top:6px}
.s{margin-top:46px;font:400 italic 50px/1.2 Fr;color:#F7EFE0e6}
.star{margin-top:34px;font:500 22px DS;letter-spacing:.6em;color:#F7EFE0aa;padding-left:.6em}
.sub{position:absolute;top:1128px;left:0;right:0;text-align:center;font:400 italic 40px Fr;color:${INK}}
.ft{position:absolute;bottom:62px;left:80px;right:80px;display:flex;justify-content:space-between;font:600 22px DS;letter-spacing:.42em;color:${INK}99}
</style>${fibre}
<div class="lb">HIDDEN GEM MOVIES</div>
<div class="win"><div class="sun"></div><svg width="740" height="880">${steps('#FFE7BF',.55)}</svg>
<div class="wc"><div class="h">${c.h}<i>${c.h2}</i></div><div class="s">${c.sub}</div><div class="star">✦ &nbsp;✦ &nbsp;✦</div></div></div>
<div class="sub">${c.foot}</div>
<div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>${grain()}`}
function film(m,i){const big='file://'+D+'/'+m.big,ins='file://'+D+'/'+m.inset;return `<style>${fonts}${base}
.big{position:absolute;left:0;right:0;bottom:0;height:${m.bh||560}px;background:url(${big}) ${m.bx||50}% ${m.by||50}%/cover;filter:saturate(.92) contrast(1.04)}
.big:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${PAPER} 0,${PAPER}00 70px),linear-gradient(0deg,#0009 0,#0000 210px),radial-gradient(120% 90% at 50% 40%,#0000 55%,#0004)}
.ins{position:absolute;right:80px;top:150px;width:390px;height:490px;background:url(${ins}) ${m.ix||50}% ${m.iy||50}%/cover;
 box-shadow:0 0 0 12px #FBF8F1,0 0 0 13.5px #1e274722,0 26px 50px #1e27473a;transform:rotate(2.2deg);z-index:3}
.no{position:absolute;left:80px;top:150px;font:600 22px DS;letter-spacing:.42em;color:${m.ink}}
.col{position:absolute;left:80px;top:180px;width:520px}.t{margin-left:-4px;width:${m.tw||560}px;font:400 ${m.fs||150}px/0.9 An;color:${m.ink};text-transform:uppercase;letter-spacing:-1px}
.meta{margin-top:26px;width:520px;font:600 21px DS;letter-spacing:${m.ls||'.3em'};color:${INK}b0}
.meta b{font:400 italic 30px Fr;letter-spacing:0;color:${m.ink};margin-left:8px}
.ov{margin-top:22px;width:${m.ow||490}px;font:400 29px/1.36 Fr;color:${INK};text-align:left;hyphens:none}
.ln{position:absolute;left:0;right:0;bottom:${(m.bh||660)+0}px}
.q{position:absolute;left:80px;bottom:58px;max-width:760px;font:600 italic 40px/1.15 Fr;color:#FBF6EC;text-shadow:0 2px 18px #000a;z-index:2}
</style>${fibre}
<div class="hd"><span>HIDDEN GEM MOVIES</span><span class="r">Nº 0${i+1} / 05</span></div><div class="rule"></div>
<div class="col"><div class="t">${m.t}</div>
<div class="meta">${m.yr} &nbsp;·&nbsp; DIR. ${m.dir.toUpperCase()}</div>
<div class="ov">${m.ov}</div></div>
<div class="ins"></div>
<div class="big"></div>
<div class="q">${m.q}</div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])];
for(const [n,h] of pages){fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
