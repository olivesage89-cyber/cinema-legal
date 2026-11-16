// "the kid you used to be" — SCHOOL NOTEBOOK: lined notebook paper w/ red margin + binder holes; cover = gable HOUSE window
// (a kid's drawing of a house, done elegantly) in cherry red w/ round attic window + crayon stars. Prata + Schoolbell + Work Sans.
// Inside = NOTEBOOK SCRAPBOOK: big still taped with washi tape, small taped still, crayon handwritten note, star progress.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}${p})}`;
const fonts=[ff('PR','prata/files/prata-latin-400-normal.woff2'),ff('SB','schoolbell/files/schoolbell-latin-400-normal.woff2'),
ff('WS','work-sans/files/work-sans-latin-500-normal.woff2',500),ff('WS','work-sans/files/work-sans-latin-600-normal.woff2',600)].join('');
const PAPER='#F6F1E5',INK='#22304A',CH='#8C1D2A',CHD='#5A0F1A',SKY='#A8D8F4',CREAM='#FBF4E6',MARG='#D9776F',RULE='#9DB4CF';
const grain=(op=.28)=>`<svg class="bg" width="1080" height="1350" style="mix-blend-mode:multiply;opacity:${op}"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .42  0 0 0 0 .38  0 0 0 .5 0"/></filter><rect width="1080" height="1350" filter="url(#n)"/></svg>`;
const paper=`<div class="bg" style="background:repeating-linear-gradient(180deg,transparent 0 50px,${RULE}70 50px 52px);background-position:0 18px"></div>
<div class="bg" style="left:116px;width:2px;background:${MARG}a0"></div><div class="bg" style="left:122px;width:1.5px;background:${MARG}60"></div>
${[230,675,1120].map(y=>`<div class="hole" style="top:${y-19}px"></div>`).join('')}`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:${PAPER};color:${INK}}.bg{position:absolute;inset:0;pointer-events:none}
.hole{position:absolute;left:40px;width:38px;height:38px;border-radius:50%;background:#D9D2C2;box-shadow:inset 0 3px 5px #0003,0 1px 0 #fff8}
.ft{position:absolute;bottom:62px;left:150px;right:70px;display:flex;justify-content:space-between;align-items:center;font:600 21px WS;letter-spacing:.34em;color:${INK}a8}`;
// crayon-ish star
const star=(x,y,r,col,fill=false,rot=0,op=1)=>{let d='';for(let k=0;k<10;k++){const a=(k*36-90)*Math.PI/180,rr=k%2?r*.45:r;d+=(k?'L':'M')+(x+rr*Math.cos(a)).toFixed(1)+' '+(y+rr*Math.sin(a)).toFixed(1)}
 return `<path d="${d}Z" transform="rotate(${rot} ${x} ${y})" fill="${fill?col:'none'}" stroke="${col}" stroke-width="${fill?2:3}" stroke-linejoin="round" opacity="${op}" filter="url(#cr)"/>`};
const crayon=`<filter id="cr"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="3.5"/></filter>`;
function cover(c){
 // house window geometry
 const L=170,R=910,EAVE=470,TOP=196,BOT=1100,cx=540;
 const house=`M${L+28} ${BOT} Q${L} ${BOT} ${L} ${BOT-28} L${L} ${EAVE+20} Q${L} ${EAVE} ${L+18} ${EAVE-10} L${cx-22} ${TOP+12} Q${cx} ${TOP} ${cx+22} ${TOP+12} L${R-18} ${EAVE-10} Q${R} ${EAVE} ${R} ${EAVE+20} L${R} ${BOT-28} Q${R} ${BOT} ${R-28} ${BOT} Z`;
 let st='';[[262,560,12],[820,600,9],[262,960,10],[830,930,13],[700,520,7],[380,520,8]].forEach(([x,y,r],k)=>st+=star(x,y,r,CREAM,k%2==0,k*17,.35));
 return `<style>${fonts}${base}
.lb{position:absolute;top:92px;left:150px;right:70px;text-align:center;font:600 25px WS;letter-spacing:.5em;color:${INK};padding-left:.5em}
.lb:before,.lb:after{content:'';display:inline-block;width:46px;height:1.5px;background:${INK}80;vertical-align:middle;margin:0 22px 6px}
svg.h{position:absolute;left:0;top:0}
.wc{position:absolute;left:${L}px;right:${1080-R}px;top:610px;text-align:center;color:${CREAM}}
.a{font:400 66px/1.1 PR;letter-spacing:-.5px}
.b{display:block;font:400 168px/0.9 SB;color:${SKY};margin:8px 0 4px;transform:rotate(-3deg);text-shadow:0 0 30px #A8D8F430}
.b2{font:400 66px/1.1 PR;letter-spacing:-.5px}
.s{margin-top:34px;font:600 22px WS;letter-spacing:.42em;color:${CREAM}b0;padding-left:.42em}
.note{position:absolute;left:150px;right:70px;top:1140px;text-align:center;font:400 46px SB;color:${CH};transform:rotate(-2deg)}
</style>${paper}
<div class="lb">HIDDEN GEM MOVIES</div>
<svg class="h" width="1080" height="1350"><defs>${crayon}
<radialGradient id="g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="#A42838"/><stop offset=".6" stop-color="${CH}"/><stop offset="1" stop-color="${CHD}"/></radialGradient>
<clipPath id="hc"><path d="${house}"/></clipPath></defs>
<path d="${house}" fill="#00000030" transform="translate(0 26)" style="filter:blur(22px)"/>
<path d="${house}" fill="${CREAM}" stroke="${INK}50" stroke-width="2" transform="translate(${cx} ${(TOP+BOT)/2}) scale(1.035 1.026) translate(${-cx} ${-(TOP+BOT)/2})"/>
<path d="${house}" fill="url(#g)"/>
<g clip-path="url(#hc)">${st}
</g>
<circle cx="${cx}" cy="${EAVE-118}" r="62" fill="${CHD}" stroke="${CREAM}" stroke-opacity=".75" stroke-width="5"/>
<path d="M${cx} ${EAVE-180} L${cx} ${EAVE-56} M${cx-62} ${EAVE-118} L${cx+62} ${EAVE-118}" stroke="${CREAM}" stroke-opacity=".75" stroke-width="4"/>
${star(cx+28,EAVE-146,14,'#F3C969',true,12,.95)}
<path d="${house}" fill="none" stroke="${CREAM}" stroke-opacity=".55" stroke-width="2.5" transform="translate(${cx} ${(TOP+BOT)/2}) scale(.965 .975) translate(${-cx} ${-(TOP+BOT)/2})"/>
</svg>
<div class="wc"><div class="a">${c.a}</div><span class="b">${c.b}</span><div class="b2">${c.c}</div><div class="s">${c.sub}</div></div>
<div class="note">${c.foot}</div>
<div class="ft" style="justify-content:center;gap:40px"><span>05 FILMS</span><svg width="176" height="30"><defs>${crayon}</defs>${[0,1,2,3,4].map(k=>star(15+k*36,15,11,INK+'99',false,k*9)).join('')}</svg><span>SWIPE →</span></div>${grain()}`}
const tape=(x,y,w,rot,col)=>`<div class="tape" style="left:${x}px;top:${y}px;width:${w}px;transform:rotate(${rot}deg);background:repeating-linear-gradient(90deg,${col}c0 0 14px,${col}96 14px 28px)"></div>`;
function film(m,i){const u=f=>'file://'+D+'/'+f;return `<style>${fonts}${base}
.hd{position:absolute;top:62px;left:150px;right:70px;display:flex;justify-content:space-between;align-items:center;font:600 20px WS;letter-spacing:.36em;color:${INK}b0}
.ph{position:absolute;background:#FFFDF8;padding:14px;box-shadow:0 18px 30px #22304A2e,0 2px 4px #22304A22}
.ph div{width:100%;height:100%;background-size:cover}
.ph div:after{content:'';position:absolute;inset:14px;background:radial-gradient(130% 110% at 50% 45%,#0000 60%,#0003);box-shadow:inset 0 0 0 1px #0002}
.tape{position:absolute;height:44px;z-index:3;box-shadow:0 2px 3px #0001;mix-blend-mode:multiply;clip-path:polygon(0 4%,3% 0,6% 6%,9% 0,12% 5%,88% 2%,91% 0,94% 6%,97% 0,100% 5%,100% 96%,97% 100%,94% 94%,91% 100%,88% 95%,12% 98%,9% 100%,6% 94%,3% 100%,0 95%)}
.note{position:absolute;left:600px;right:66px;top:${m.nt||730}px;font:400 44px/1.12 SB;color:${m.ink};transform:rotate(-3deg)}
svg.d{position:absolute;left:0;top:0;pointer-events:none}
.col{position:absolute;left:150px;right:70px;top:962px}
.t{font:400 ${m.fs||88}px/1 PR;color:${INK};letter-spacing:-1px;white-space:nowrap}
.meta{margin-top:20px;font:600 20px WS;letter-spacing:.3em;color:${m.ink}}
.ov{margin-top:20px;font:400 32px/1.36 PR;color:${INK}d8}
</style>${paper}
<div class="hd"><span>HIDDEN GEM MOVIES</span><span>Nº 0${i+1} / 05</span></div>
<div class="ph" style="left:150px;top:150px;width:862px;height:500px;transform:rotate(${m.rb||-0.8}deg)"><div style="background-image:url(${u(m.big)});background-position:${m.bp||'50% 50%'}"></div></div>
${tape(122,140,150,-32,m.ink)}${tape(892,136,150,30,m.ink)}
<div class="ph" style="left:156px;top:684px;width:404px;height:244px;transform:rotate(${m.rs||1.6}deg);padding:11px"><div style="background-image:url(${u(m.sm)});background-position:${m.sp||'50% 50%'}"></div></div>
${tape(300,666,120,-4,m.ink)}
<div class="note">${m.note}</div>
<svg class="d" width="1080" height="1350"><defs>${crayon}</defs>${star(m.sx||960,m.sy||905,22,m.ink,false,14,.9)}</svg>
<div class="col"><div class="t">${m.t}</div>
<div class="meta">${m.yr} · DIR. ${m.dir.toUpperCase()}</div><div class="ov">${m.ov}</div></div>
<div class="ft"><span>STILL IN THERE</span><svg width="160" height="30"><defs>${crayon}</defs>${[0,1,2,3,4].map(k=>star(15+k*32,15,11,k===i?m.ink:INK+'70',k===i,k*9)).join('')}</svg></div>${grain()}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
const only=process.argv[3];
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,film(m,i)])].filter(x=>!only||x[0].includes(only));
for(const [n,h] of pages){fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(400);await p.screenshot({path:`${D}/out/${n}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
