// "don't fit in" — MISFIT TICKET: sage paper, notched ticket-shaped frames, Gloock + Caveat coral notes, odd-dot motif.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('Gl','gloock/files/gloock-latin-400-normal.woff2'),ff('Cv','caveat/files/caveat-latin-600-normal.woff2',600),ff('Cv','caveat/files/caveat-latin-700-normal.woff2',700),
ff('EB','eb-garamond/files/eb-garamond-latin-400-italic.woff2',400,'italic'),ff('EB','eb-garamond/files/eb-garamond-latin-500-italic.woff2',500,'italic'),
ff('Mo','montserrat/files/montserrat-latin-600-normal.woff2',600),ff('Mo','montserrat/files/montserrat-latin-500-normal.woff2',500)].join('');
const PAPER='#E8E6DA',INK='#213A31',CORAL='#EE6646',CREAM='#F4EEDF';
const notch=r=>`-webkit-mask:radial-gradient(circle at top left,#0000 ${r}px,#000 ${r+.5}px) top left/51% 51% no-repeat,radial-gradient(circle at top right,#0000 ${r}px,#000 ${r+.5}px) top right/51% 51% no-repeat,radial-gradient(circle at bottom left,#0000 ${r}px,#000 ${r+.5}px) bottom left/51% 51% no-repeat,radial-gradient(circle at bottom right,#0000 ${r}px,#000 ${r+.5}px) bottom right/51% 51% no-repeat;`;
const grain=(op=.32)=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:${op}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="7"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .47  0 0 0 0 .42  0 0 0 .55 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const fibre=`<svg class="bg" width="1080" height="1350" style="opacity:.55"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".011 .045" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 .4  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .13 0"/></filter><rect width="1080" height="1350" filter="url(#f)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}
.ft{position:absolute;bottom:60px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font:600 21px Mo;letter-spacing:.42em;color:${INK}a0}`;
// odd-one-out dot row: all ink dots on a line, the i-th one coral and lifted
const dots=(i,col=INK)=>`<span class="dots">${[0,1,2,3,4].map(k=>`<i style="background:${k===i?CORAL:col+'55'};transform:translateY(${k===i?-9:0}px)"></i>`).join('')}</span>`;
function dotGrid(){let s='';const cols=11,rows=15,gx=58,gy=58,x0=(740-(cols-1)*gx)/2,y0=40;for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
 const odd=(r===12&&c===7);const x=x0+c*gx+(odd?14:0),y=y0+r*gy+(odd?-16:0);
 s+=`<circle cx="${x}" cy="${y}" r="${odd?8:3.2}" fill="${odd?CORAL:CREAM}" opacity="${odd?1:.13}"/>`}return s}
function cover(c){return `<style>${fonts}${base}
.lb{position:absolute;top:104px;left:0;right:0;text-align:center;font:600 26px Mo;letter-spacing:.56em;color:${INK};padding-left:.56em}
.lb:before,.lb:after{content:'';display:inline-block;width:44px;height:1.5px;background:${INK}80;vertical-align:middle;margin:0 24px 6px}
.wrap{position:absolute;left:170px;top:184px;width:740px;height:940px;filter:drop-shadow(0 30px 40px #213a3140)}
.win{position:absolute;inset:0;background:radial-gradient(700px 600px at 50% 30%,#2F5446,${INK} 75%);${notch(58)}}
.win svg{position:absolute;left:0;top:0}
.ring{position:absolute;inset:18px;border:1.5px solid ${CREAM}40;border-radius:6px;${notch(46)}}
.perf{position:absolute;left:70px;right:70px;top:770px;border-top:3px dotted ${CREAM}55}
.wc{position:absolute;left:0;right:0;top:150px;text-align:center;color:${CREAM}}
.a{font:400 70px/1.08 Gl;letter-spacing:-.5px}
.fit{display:block;font:700 210px/0.8 Cv;color:${CORAL};transform:rotate(-5deg) translateX(18px);margin:8px 0 14px}
.s{margin-top:34px;font:500 italic 46px EB;color:${CREAM}d0}
.stub{position:absolute;left:0;right:0;top:812px;text-align:center;font:600 20px Mo;letter-spacing:.5em;color:${CREAM}a8;padding-left:.5em}
.stub b{color:${CORAL};font-weight:600}
.no{position:absolute;left:0;right:0;top:850px;text-align:center;font:500 18px Mo;letter-spacing:.4em;color:${CREAM}60}
.foot{position:absolute;top:1160px;left:0;right:0;text-align:center;font:500 italic 38px EB;color:${INK}}
.dots{display:inline-flex;gap:13px}.dots i{width:11px;height:11px;border-radius:50%;display:block}
</style>${fibre}
<div class="lb">HIDDEN GEM MOVIES</div>
<div class="wrap"><div class="win"><svg width="740" height="940">${dotGrid()}</svg><div class="ring"></div><div class="perf"></div>
<div class="wc"><div class="a">${c.a}</div><span class="fit">${c.fit}</span><div class="a">${c.b}</div><div class="s">${c.sub}</div></div>
<div class="stub">ADMIT ONE <b>·</b> OUTSIDER</div><div class="no">Nº 000005 &nbsp;·&nbsp; ALL SEATS</div></div></div>
<div class="foot">${c.foot}</div>
<div class="ft"><span>05 FILMS</span>${dots(-1)}<span>SWIPE →</span></div>${grain()}`}
function film(m,i){const big='file://'+D+'/'+m.big,ins='file://'+D+'/'+m.ins;return `<style>${fonts}${base}
.hd{position:absolute;top:62px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font:600 21px Mo;letter-spacing:.42em;color:${INK}b0}
.rule{position:absolute;top:104px;left:80px;right:80px;height:1.5px;background:${INK}38}
.dots{display:inline-flex;gap:13px}.dots i{width:11px;height:11px;border-radius:50%;display:block}
.bw{position:absolute;left:70px;right:70px;top:138px;height:620px;filter:drop-shadow(0 22px 30px #213a3138)}
.big{position:absolute;inset:0;background:url(${big}) ${m.bx||50}% ${m.by||50}%/cover;${notch(44)}}
.big:after{content:'';position:absolute;inset:0;background:radial-gradient(130% 100% at 50% 45%,#0000 60%,#0003)}
.iw{position:absolute;right:96px;top:${m.it||650}px;width:340px;height:${m.ih||250}px;filter:drop-shadow(0 18px 24px #213a3150);transform:rotate(${m.rot||2}deg);z-index:3}
.iw .p{position:absolute;inset:0;background:#F6F2E7;${notch(26)}}
.iw .i{position:absolute;inset:11px;background:url(${ins}) ${m.ix||50}% ${m.iy||50}%/cover;${notch(20)}}
.col{position:absolute;left:84px;top:${m.ct||800}px;width:${m.cw||560}px}
.note{font:700 54px/1 Cv;color:${CORAL};transform:rotate(-3deg);transform-origin:left;margin-bottom:14px;white-space:nowrap}
.t{font:400 ${m.fs||92}px/0.98 Gl;color:${INK};letter-spacing:-1px}
.meta{margin-top:20px;font:600 20px Mo;letter-spacing:.32em;color:${INK}b0}
.ov{margin-top:20px;width:${m.ow||880}px;font:400 italic 36px/1.24 EB;color:${INK}}
</style>${fibre}
<div class="hd"><span>HIDDEN GEM MOVIES</span>${dots(i)}<span>Nº 0${i+1}</span></div><div class="rule"></div>
<div class="bw"><div class="big"></div></div>
<div class="iw"><div class="p"></div><div class="i"></div></div>
<div class="col"><div class="note">${m.note}</div><div class="t">${m.t}</div>
<div class="meta">${m.yr} &nbsp;·&nbsp; DIR. ${m.dir.toUpperCase()}</div><div class="ov">${m.ov}</div></div>
<div class="ft" style="bottom:52px"><span>IF YOU DON'T FIT IN</span><span>0${i+1} / 05</span></div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const only=process.argv[3];
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])].filter(x=>!only||x[0].includes(only));
for(const [n,h] of pages){fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
