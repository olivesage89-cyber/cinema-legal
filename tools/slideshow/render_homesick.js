// "movies that make you homesick for a place you've never been" — AIRMAIL POSTCARD:
// cream postcard stock w/ airmail-stripe border, big deckle-edged still, perforated postage stamp w/ 2nd still,
// red ink postmark, postcard-back split (handwritten message left, address lines right).
// Fonts: DM Serif Display (titles) + Yellowtail (script accent) + Josefin Sans (tracked caps) + Kalam (handwriting).
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('Se','dm-serif-display/files/dm-serif-display-latin-400-normal.woff2'),ff('Se','dm-serif-display/files/dm-serif-display-latin-400-italic.woff2',400,'italic'),
ff('Yt','yellowtail/files/yellowtail-latin-400-normal.woff2'),
ff('Jo','josefin-sans/files/josefin-sans-latin-400-normal.woff2',400),ff('Jo','josefin-sans/files/josefin-sans-latin-600-normal.woff2',600),ff('Jo','josefin-sans/files/josefin-sans-latin-700-normal.woff2',700),
ff('Ka','kalam/files/kalam-latin-400-normal.woff2',400),ff('Ka','kalam/files/kalam-latin-300-normal.woff2',300)].join('');
const PAPER='#F2EBDD',INK='#1F2A4D',BLUE='#21418F',RED='#C8343B',SUN='#FFC94D';
const grain=(op=.28)=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:${op};z-index:20"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="11"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .5 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const fibre=`<svg class="bg" width="1080" height="1350" style="opacity:.5"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .05" numOctaves="2" seed="5"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .46  0 0 0 0 .34  0 0 0 .12 0"/></filter><rect width="1080" height="1350" filter="url(#f)"/></svg>`;
// airmail chevron border around the page
const air=(w=26)=>`<div class="bg air" style="z-index:1;border:${w}px solid transparent;border-image:repeating-linear-gradient(-45deg,${RED} 0 22px,${PAPER} 22px 34px,${BLUE} 34px 56px,${PAPER} 56px 68px) ${w};"></div>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}
.vig{background:radial-gradient(120% 95% at 50% 45%,#0000 62%,#7a5a3022 100%)}`;
// perforated stamp edge: holes all round (r px, pitch p) + solid content box
const perf=(r=8,p=24)=>`padding:${r}px;-webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle ${r}px at ${p/2}px ${p/2}px,#0000 96%,#000) -${p/2}px -${p/2}px/${p}px ${p}px round;-webkit-mask-composite:source-over`;
const postmark=(txt,yr,col=RED,size=210,left=false)=>`<svg width="${size*1.9}" height="${size}" viewBox="0 0 380 200" style="overflow:visible">
<defs><path id="pc${yr}" d="M100,100 m-76,0 a76,76 0 1,1 152,0 a76,76 0 1,1 -152,0"/></defs>
<g fill="none" stroke="${col}" stroke-opacity=".78"><circle cx="100" cy="100" r="94" stroke-width="4"/><circle cx="100" cy="100" r="58" stroke-width="2.5"/>
${[0,1,2,3,4].map(k=>left?`<path d="M-5,${48+k*26} q-22,-12 -44,0 t-44,0 t-44,0 t-44,0" stroke-width="5"/>`:`<path d="M205,${48+k*26} q22,-12 44,0 t44,0 t44,0 t44,0" stroke-width="5"/>`).join('')}</g>
<text font-family="Jo" font-weight="700" font-size="19" letter-spacing="4" fill="${col}" fill-opacity=".8"><textPath href="#pc${yr}" startOffset="0" textLength="462" lengthAdjust="spacing">${txt}</textPath></text>
<text x="100" y="94" text-anchor="middle" font-family="Jo" font-weight="700" font-size="30" fill="${col}" fill-opacity=".8">${yr}</text>
<text x="100" y="124" text-anchor="middle" font-family="Jo" font-weight="600" font-size="15" letter-spacing="3" fill="${col}" fill-opacity=".8">AIR MAIL</text></svg>`;

function cover(c){return `<style>${fonts}${base}
.lb{position:absolute;top:96px;left:0;right:0;text-align:center;font:700 27px Jo;letter-spacing:.52em;color:${BLUE};padding-left:.52em}
.lb2{position:absolute;top:140px;left:0;right:0;text-align:center;font:400 30px Ka;color:${RED}}
.stamp{position:absolute;left:150px;top:214px;width:780px;height:900px;background:#FBF7EF;${perf(11,30)};filter:drop-shadow(0 22px 30px #3a2a1a38);transform:rotate(-1.2deg)}
.win{position:relative;width:100%;height:100%;overflow:hidden;border:1.5px solid #fff;
 background:radial-gradient(70% 45% at 50% 100%,#F29A4A 0%,#C9603F 22%,#5B3F86 52%,#21418F 78%,#162C66 100%)}
.waves{position:absolute;left:0;right:0;bottom:0;height:300px}
.innr{position:absolute;inset:26px;border:2px solid #ffffff55}
.den{position:absolute;top:44px;left:52px;font:700 22px Jo;letter-spacing:.34em;color:#fff9}
.den2{position:absolute;top:44px;right:52px;font:700 22px Jo;letter-spacing:.34em;color:#fff9}
.wc{position:absolute;left:0;right:0;top:${c.top||150}px;text-align:center}
.k{font:600 28px Jo;letter-spacing:.42em;color:#FFF3DDcc;padding-left:.42em}
.y{margin-top:30px;font:400 196px/1 Yt;color:${SUN};transform:rotate(-5deg);text-shadow:0 6px 30px #0006;letter-spacing:-1px}
.h{margin-top:46px;font:400 66px/1.12 Se;color:#FFF6E6;padding:0 70px;letter-spacing:-.5px}
.h i{font-style:italic;color:#FFE3A8}
.pm{position:absolute;left:715px;top:905px;transform:rotate(-14deg);z-index:5}
.sub{position:absolute;top:1166px;left:0;right:0;text-align:center;font:400 40px Ka;color:${INK}}
.sub b{font-weight:400;color:${RED}}
.ft{position:absolute;bottom:72px;left:96px;right:96px;display:flex;justify-content:space-between;font:700 22px Jo;letter-spacing:.42em;color:${BLUE}cc}
</style>${fibre}<div class="bg vig"></div>${air(28)}
<div class="lb">MOVIE HIDDEN GEMS</div>
<div class="stamp"><div class="win">
<svg class="waves" viewBox="0 0 780 300" preserveAspectRatio="none"><g fill="none" stroke="#FFE3B0" stroke-opacity=".22" stroke-width="2">${[0,1,2,3,4,5,6].map(k=>`<path d="M0,${110+k*28} q48,-16 97,0 t97,0 t97,0 t97,0 t97,0 t97,0 t97,0 t97,0"/>`).join('')}</g>
<circle cx="390" cy="300" r="120" fill="#FFC94D" fill-opacity=".22"/></svg>
<div class="innr"></div><div class="den">AIR MAIL</div><div class="den2">Nº 05</div>
<div class="wc"><div class="k">${c.kick}</div><div class="y">${c.h}</div><div class="h">${c.h2}</div></div></div></div>
<div class="pm">${postmark('★ POSTED FROM SOMEWHERE ★ AIR MAIL',"2026",'#1F2A4D',190)}</div>
<div class="sub">${c.sub}</div>
<div class="ft"><span>05 FILMS</span><span>SWIPE →</span></div>${grain()}`}

function film(m,i){const big='file://'+D+'/'+m.big,st='file://'+D+'/'+m.stamp;return `<style>${fonts}${base}
.hd{position:absolute;top:70px;left:92px;right:92px;display:flex;justify-content:space-between;align-items:baseline;z-index:3}
.hd .l{font:700 23px Jo;letter-spacing:.36em;color:${m.ink}}.hd .r{font:600 19px Jo;letter-spacing:.34em;color:${INK}99}
.photo{position:absolute;left:84px;top:118px;width:912px;height:612px;background:#FCF9F2;padding:16px;transform:rotate(-.7deg);box-shadow:0 18px 34px #3a2a1a33,0 0 0 1px #0000000d;z-index:2}
.photo div{width:100%;height:100%;background:url(${big}) ${m.bx||50}% ${m.by||50}%/cover;filter:${m.filt||'saturate(.95) contrast(1.04) sepia(.06)'}}
.stamp{position:absolute;right:70px;top:${m.sy||560}px;width:250px;height:300px;background:#FCF9F2;${perf(8,22)};filter:drop-shadow(0 12px 16px #3a2a1a40);transform:rotate(3.5deg);z-index:4}
.si{width:100%;height:100%;border:10px solid #FCF9F2;position:relative;background:url(${st}) ${m.px||50}% ${m.py||50}%/cover}
.si:after{content:'';position:absolute;inset:0;border:2px solid ${m.ink}}
.sv{position:absolute;left:12px;top:12px;font:700 15px Jo;letter-spacing:.24em;color:#fff;text-shadow:0 1px 6px #000a}
.sn{position:absolute;right:12px;bottom:6px;font:400 italic 30px Se;color:#fff;text-shadow:0 1px 8px #000a}
.pm{position:absolute;left:${m.pmx||720}px;top:${(m.sy||560)+200}px;transform:rotate(-10deg);z-index:6}
.back{position:absolute;left:92px;right:92px;top:800px;bottom:96px;display:flex;z-index:3}
.msg{flex:1.5;padding-right:40px;border-right:2px solid ${INK}30}
.to{flex:1;padding-left:40px;padding-top:${m.tt||210}px}
.t{font:400 ${m.fs||78}px/1.0 Se;color:${m.ink};letter-spacing:-.5px}
.meta{margin-top:18px;font:700 19px Jo;letter-spacing:.3em;color:${INK}aa}
.meta b{color:${m.ink}}
.note{margin-top:24px;font:400 ${m.ns||35}px/1.34 Ka;color:${INK};transform:rotate(-.6deg)}
.note em{font-style:normal;color:${m.ink};text-decoration:underline;text-decoration-thickness:2px;text-underline-offset:6px}
.ln{border-bottom:2px dotted ${INK}55;height:54px;font:400 27px/54px Ka;color:${INK};white-space:nowrap;overflow:visible}
.ln.k{font:700 16px/56px Jo;letter-spacing:.3em;color:${INK}88}
.ft{position:absolute;bottom:54px;left:92px;right:92px;display:flex;justify-content:space-between;align-items:center;font:700 17px Jo;letter-spacing:.34em;color:${INK}77;z-index:3}
.dots{display:flex;gap:12px}.dots i{width:12px;height:12px;border-radius:50%;border:2px solid ${INK}66}.dots i.on{background:${m.ink};border-color:${m.ink}}
</style>${fibre}<div class="bg vig"></div>${air(22)}
<div class="hd"><span class="l">POSTCARD Nº 0${i+1} / 05</span><span class="r">WISH YOU WERE HERE</span></div>
<div class="photo"><div></div></div>
<div class="stamp"><div class="si"><span class="sn">${m.yr}</span><span class="sv">${m.stampLbl}</span></div></div>
<div class="pm">${postmark(m.pm+' ★ '+m.pm+' ★',m.yr,RED,150,true)}</div>
<div class="back"><div class="msg"><div class="t">${m.t}</div><div class="meta"><b>${m.yr}</b> · DIR. ${m.dir.toUpperCase()}</div><div class="note">${m.note}</div></div>
<div class="to"><div class="ln">to: ${m.to1}</div><div class="ln">${m.to2}</div><div class="ln k">${m.place}</div></div></div>
<div class="ft"><span>MOVIE HIDDEN GEMS</span><div class="dots">${[0,1,2,3,4].map(k=>`<i class="${k==i?'on':''}"></i>`).join('')}</div></div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const only=process.argv[3];
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])];
for(const [n,h] of pages){if(only&&!n.startsWith(only))continue;fs.writeFileSync(D+'/t.html','<html lang="en"><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
