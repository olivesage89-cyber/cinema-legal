// "falling behind" — CLOCK FACE: oatmeal paper, round clock-face window (deep teal, minute ticks, faint hands at 11:55),
// Instrument Serif + apricot italic, Space Mono labels, Homemade Apple notes. Inside = TIMELINE FILM STRIP.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('IS','instrument-serif/files/instrument-serif-latin-400-normal.woff2'),ff('IS','instrument-serif/files/instrument-serif-latin-400-italic.woff2',400,'italic'),
ff('SM','space-mono/files/space-mono-latin-400-normal.woff2'),ff('SM','space-mono/files/space-mono-latin-700-normal.woff2',700),
ff('HA','homemade-apple/files/homemade-apple-latin-400-normal.woff2')].join('');
const PAPER='#EEE6D8',INK='#173638',TEAL='#1D4A4C',APR='#F2A65A',CREAM='#F6EFE2';
const grain=(op=.3)=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:${op}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .42  0 0 0 0 .38  0 0 0 .55 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const fibre=`<svg class="bg" width="1080" height="1350" style="opacity:.5"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .4  0 0 0 0 .33  0 0 0 .14 0"/></filter><rect width="1080" height="1350" filter="url(#f)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}
.ft{position:absolute;bottom:58px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font:400 21px SM;letter-spacing:.3em;color:${INK}a8}`;
// small clock icon; hand angle in degrees
const clk=(deg,col=INK,s=30)=>`<svg width="${s}" height="${s}" viewBox="0 0 30 30" style="vertical-align:middle"><circle cx="15" cy="15" r="13" fill="none" stroke="${col}" stroke-width="2"/><path d="M15 15 L15 6" stroke="${col}" stroke-width="2.2" stroke-linecap="round" transform="rotate(${deg} 15 15)"/><path d="M15 15 L21 15" stroke="${col}" stroke-width="2.2" stroke-linecap="round" transform="rotate(-60 15 15)"/><circle cx="15" cy="15" r="2" fill="${col}"/></svg>`;
function face(R){let s='';const c=R;for(let k=0;k<60;k++){const a=k*6*Math.PI/180,big=k%5===0;const r1=R-30,r2=R-(big?62:44);
 s+=`<line x1="${c+r1*Math.sin(a)}" y1="${c-r1*Math.cos(a)}" x2="${c+r2*Math.sin(a)}" y2="${c-r2*Math.cos(a)}" stroke="${big&&k===0?APR:CREAM}" stroke-opacity="${big?(k===0?.95:.55):.22}" stroke-width="${big?4:2}" stroke-linecap="round"/>`}
 // faint hands at 11:55
 const hand=(deg,len,w,op)=>`<line x1="${c}" y1="${c}" x2="${c+len*Math.sin(deg*Math.PI/180)}" y2="${c-len*Math.cos(deg*Math.PI/180)}" stroke="${CREAM}" stroke-opacity="${op}" stroke-width="${w}" stroke-linecap="round"/>`;
 s+=hand(-2.5,R*.5,14,.07)+hand(-30,R*.78,8,.07)+`<circle cx="${c}" cy="${c}" r="12" fill="${CREAM}" fill-opacity=".1"/>`;
 return s}
function cover(c){const R=420;return `<style>${fonts}${base}
.lb{position:absolute;top:96px;left:0;right:0;text-align:center;font:700 25px SM;letter-spacing:.5em;color:${INK};padding-left:.5em}
.lb:before,.lb:after{content:'';display:inline-block;width:46px;height:1.5px;background:${INK}80;vertical-align:middle;margin:0 24px 6px}
.bez{position:absolute;left:${540-R-22}px;top:${178}px;width:${2*R+44}px;height:${2*R+44}px;border-radius:50%;background:${CREAM};box-shadow:0 0 0 2px ${INK}55,0 34px 60px #17363840, inset 0 0 0 7px ${PAPER}, inset 0 0 0 9px ${INK}40}
.win{position:absolute;left:22px;top:22px;width:${2*R}px;height:${2*R}px;border-radius:50%;overflow:hidden;background:radial-gradient(${R*1.2}px ${R}px at 50% 32%,#2C6464,${TEAL} 55%,#123234 100%)}
.win svg{position:absolute;inset:0}
.wc{position:absolute;left:0;right:0;top:${R-250}px;text-align:center;color:${CREAM}}
.a{font:400 64px/1.06 IS;letter-spacing:-.3px}
.b{display:block;font:400 italic 158px/0.86 IS;color:${APR};letter-spacing:-2px;margin-top:20px}
.s{margin-top:26px;font:400 22px SM;letter-spacing:.34em;color:${CREAM}99;padding-left:.34em}
.note{position:absolute;left:0;right:0;top:1112px;text-align:center;font:400 40px HA;color:${INK};transform:rotate(-2deg)}
.note b{font-weight:400;color:#C9692A}
</style>${fibre}
<div class="lb">HIDDEN GEM MOVIES</div>
<div class="bez"><div class="win"><svg width="${2*R}" height="${2*R}">${face(R)}</svg>
<div class="wc"><div class="a">${c.a}</div><span class="b">${c.b}</span><div class="s">${c.sub}</div></div></div></div>
<div class="note">${c.foot}</div>
<div class="ft"><span>05 FILMS</span><span>${clk(0,INK+'a8',28)}</span><span>SWIPE →</span></div>${grain()}`}
function film(m,i){const u=f=>'file://'+D+'/'+f;return `<style>${fonts}${base}
.hd{position:absolute;top:58px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font:700 20px SM;letter-spacing:.36em;color:${INK}b0}
.hd .r{display:flex;align-items:center;gap:14px;letter-spacing:.2em}
.big{position:absolute;left:70px;right:70px;top:112px;height:530px;border-radius:30px;background:url(${u(m.big)}) ${m.bx||50}% ${m.by||50}%/cover;box-shadow:0 22px 36px #17363833;${m.bw?'filter:grayscale(1) contrast(1.05)':''}}
.big:after{content:'';position:absolute;inset:0;border-radius:30px;background:radial-gradient(130% 100% at 50% 45%,#0000 60%,#0003);box-shadow:inset 0 0 0 1px #0002}
.line{position:absolute;left:70px;right:70px;top:680px;height:2px;background:${INK}30}
.tk{position:absolute;top:670px;width:22px;height:22px;border-radius:50%;background:${PAPER};border:2px solid ${INK}60}
.row{position:absolute;left:70px;right:70px;top:708px;display:flex;gap:18px}
.row div{flex:1;height:190px;border-radius:18px;background-size:cover;box-shadow:0 12px 20px #17363826;${m.bw?'filter:grayscale(1)':''}}
.col{position:absolute;left:84px;right:84px;top:938px}
.t{font:400 ${m.fs||100}px/0.95 IS;color:${m.ink};letter-spacing:-1.5px;white-space:nowrap}
.t i{font-size:.48em;letter-spacing:0;color:${INK}90;margin-left:14px}
.meta{margin-top:16px;font:400 19px SM;letter-spacing:.3em;color:${INK}b0}
.ov{margin-top:16px;font:400 italic 37px/1.2 IS;color:${INK}}
.note{position:absolute;right:${m.nr||86}px;top:${m.nt||936}px;font:400 30px HA;color:${m.ink};transform:rotate(-4deg);white-space:nowrap}.ni{margin-top:22px;font:400 29px HA;color:${m.ink};transform:rotate(-2deg);transform-origin:left;white-space:nowrap}
</style>${fibre}
<div class="hd"><span>HIDDEN GEM MOVIES</span><span class="r">${clk(i*72+36,INK+'b0',28)}Nº 0${i+1} / 05</span></div>
<div class="big"></div>
<div class="line"></div>${[0,1,2,3,4].map(k=>`<div class="tk" style="left:${70+(940-22)*k/4}px;${k===i?`background:${m.ink};border-color:${m.ink}`:''}"></div>`).join('')}
<div class="row">${m.sm.map((f,k)=>`<div style="background-image:url(${u(f)});background-position:${(m.sp||[])[k]||'50% 50%'}"></div>`).join('')}</div>
${m.nt?`<div class="note">${m.note}</div>`:""}
<div class="col"><div class="t">${m.t}<i>(${m.yr})</i></div>
<div class="meta">DIR. ${m.dir.toUpperCase()}</div><div class="ov">${m.ov}</div>${m.nt?"":`<div class="ni">${m.note}</div>`}</div>
<div class="ft" style="bottom:50px"><span>YOU'RE RIGHT ON TIME</span><span>0${i+1} / 05</span></div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const only=process.argv[3];
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])].filter(x=>!only||x[0].includes(only));
for(const [n,h] of pages){fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
