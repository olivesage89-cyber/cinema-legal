// "WASHI & MARUMADO" — rice-paper pages, round Japanese window, vermilion hanko seals.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file:///root/engine/node_modules/@fontsource';
const ff=(n,p,w=400)=>`@font-face{font-family:'${n}';font-weight:${w};src:url(${F}/${p})}`;
const fonts=`@import url(${F}/zen-old-mincho/700.css);`+[ff('ZOM','zen-old-mincho/files/zen-old-mincho-latin-700-normal.woff2',700),ff('ZOM','zen-old-mincho/files/zen-old-mincho-latin-900-normal.woff2',900),
ff('ZOM','zen-old-mincho/files/zen-old-mincho-latin-500-normal.woff2',500),

ff('Klee','klee-one/files/klee-one-latin-600-normal.woff2',600),
ff('ZK','zen-kaku-gothic-new/files/zen-kaku-gothic-new-latin-500-normal.woff2',500),ff('ZK','zen-kaku-gothic-new/files/zen-kaku-gothic-new-latin-700-normal.woff2',700)].join('');
const W=1080,H=1350;
const paper=`<svg class="bg" width="${W}" height="${H}"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .09" numOctaves="4" seed="3"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .38  0 0 0 .22 0"/></filter><rect width="${W}" height="${H}" filter="url(#f)"/></svg>
<svg class="bg" width="${W}" height="${H}" style="mix-blend-mode:multiply;opacity:.3"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .4  0 0 0 .55 0"/></filter><rect width="${W}" height="${H}" filter="url(#n)"/></svg>`;
const grain=`<svg class="bg" width="${W}" height="${H}" style="mix-blend-mode:overlay;opacity:.28;z-index:20"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter><rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:#F2EADB;-webkit-font-smoothing:antialiased}.bg{position:absolute;inset:0;pointer-events:none}
.fr{position:absolute;inset:40px;border:1.5px solid #5E1B2455}`;
const kanjiNum=['一','二','三','四','五'];
const seal=(t,sz,col,rot=-4)=>`<div style="position:absolute;width:${sz}px;height:${sz}px;background:${col};border-radius:${sz*.16}px;transform:rotate(${rot}deg);display:flex;align-items:center;justify-content:center;color:#F7EBDD;font:700 ${sz*.62}px 'Zen Old Mincho';box-shadow:inset 0 0 0 ${sz*.06}px ${col},inset 0 0 0 ${sz*.09}px #F7EBDDaa;opacity:.94">${t}</div>`;
// shoji lattice inside circle
const lattice=(c)=>{let s='';for(let x=0;x<=820;x+=102)s+=`<line x1="${x}" y1="0" x2="${x}" y2="820" stroke="${c}" stroke-width="2"/>`;for(let y=0;y<=820;y+=136)s+=`<line x1="0" y1="${y}" x2="820" y2="${y}" stroke="${c}" stroke-width="2"/>`;return `<svg style="position:absolute;inset:0" width="820" height="820">${s}</svg>`};
function cover(c){return `<style>${fonts}${base}
.top{position:absolute;top:104px;left:0;right:0;text-align:center;font:700 28px ZK;letter-spacing:.52em;color:#5E1B24;padding-left:.52em}
.ring{position:absolute;left:110px;top:200px;width:860px;height:860px;border-radius:50%;border:1.5px solid #5E1B2466}
.win{position:absolute;left:130px;top:220px;width:820px;height:820px;border-radius:50%;overflow:hidden;background:radial-gradient(520px 520px at 50% 34%,#87303A,#5E1B24 58%,#3E1018);box-shadow:0 0 0 14px #F7F0E4,0 0 0 16px #5E1B2440,0 40px 90px #3E101833}
.wc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 90px}
.k{font:600 50px Klee;color:#F4D9CC;margin-bottom:22px}.h{font:900 132px/1.02 ZOM;color:#F7B8AE;letter-spacing:-1px}.h2{font:700 132px/1.02 ZOM;color:#FBF1E4}
.dash{width:80px;height:2px;background:#F4D9CC88;margin:34px 0 26px}.k2{font:600 46px Klee;color:#F4D9CC}
.s{position:absolute;top:1100px;left:0;right:0;text-align:center;font:600 42px Klee;color:#3A2A26}
.ft{position:absolute;bottom:72px;left:96px;right:96px;display:flex;justify-content:space-between;font:700 22px ZK;letter-spacing:.42em;color:#5E1B2499}
.vt{position:absolute;right:66px;top:300px;writing-mode:vertical-rl;font:700 30px 'Zen Old Mincho';letter-spacing:.5em;color:#B5372D}
.vl{position:absolute;left:66px;top:300px;writing-mode:vertical-rl;font:700 22px ZK;letter-spacing:.55em;color:#5E1B2488}
.seal{position:absolute;left:800px;top:930px}</style>
${paper}<div class="fr"></div><div class="top">ANIME HIDDEN GEMS</div>
<div class="ring"></div><div class="win">${lattice('#FBF1E40F')}<div class="wc"><div class="k">${c.k}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div><div class="dash"></div><div class="k2">${c.k2}</div></div></div>
<div class="seal">${seal('善',112,'#B5372D',6)}</div>
<div class="vt">やさしさ</div><div class="vl">FIVE STORIES</div>
<div class="s">${c.sub}</div><div class="ft"><span>05 ANIME</span><span>SWIPE →</span></div>${grain}`}
function slide(m,i){return `<style>${fonts}${base}
.hd{position:absolute;top:84px;left:96px;right:96px;display:flex;justify-content:space-between;font:700 21px ZK;letter-spacing:.42em;color:#5E1B2499}
.big{position:absolute;left:80px;top:140px;width:920px;height:620px;border-radius:30px;overflow:hidden;box-shadow:0 0 0 12px #F7F0E4,0 0 0 14px #5E1B2433,0 30px 60px #3E101826}
.big img,.rd img{width:100%;height:100%;object-fit:cover;object-position:${m.x||50}% ${m.y||50}%;filter:saturate(1.04) contrast(1.03)}
.rd{position:absolute;left:${m.rx||700}px;top:620px;width:300px;height:300px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 12px #F7F0E4,0 0 0 14px #5E1B2440,0 24px 50px #3E101833}
.rd img{object-position:${m.x2||50}% ${m.y2||50}%}
.seal{position:absolute;left:96px;top:810px}
.tb{position:absolute;left:96px;right:96px;top:935px}.t{width:640px;font:900 ${m.fs||76}px/1.04 ZOM;color:#2A201C;letter-spacing:-.5px}
.mt{position:absolute;left:220px;top:836px;font:700 21px/1.5 ZK;letter-spacing:.3em;color:${m.c}}
.ln{margin-top:34px;font:600 37px/1.42 Klee;color:#3F302A}
.ln b{color:${m.c};font-weight:600}
.vt{position:absolute;right:52px;top:1000px;writing-mode:vertical-rl;font:700 24px 'Zen Old Mincho';letter-spacing:.5em;color:#B5372Dcc}
.ft{position:absolute;bottom:64px;left:96px;right:96px;height:1px;background:#5E1B2433}</style>
${paper}<div class="fr"></div><div class="hd"><span>Nº 0${i+1} / 05</span><span>${m.kind}</span></div>
<div class="big"><img src="file://${D}/${m.a}"></div><div class="rd"><img src="file://${D}/${m.b}"></div>
<div class="seal">${seal(kanjiNum[i],96,m.c,-5)}</div>
<div class="mt">${m.meta}</div>
<div class="tb"><div class="t">${m.t}</div><div class="ln">${m.ov}</div></div><div class="ft"></div>${grain}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});fs.mkdirSync(D+'/out',{recursive:true});
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,slide(m,i)])];
for(const [n,h] of pages){fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(500);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
