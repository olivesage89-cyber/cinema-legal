// "LETTERS FROM HOME" — kinari paper, katomado (bell-shaped temple window) frames, pine ink, dusty rose accent,
// Shippori Mincho + Albert Sans + Yomogi handwriting; dotted road progress that walks toward a little house.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const NM='file:///root/engine/node_modules/@fontsource';
const links=['shippori-mincho-b1/400.css','shippori-mincho-b1/600.css','shippori-mincho-b1/800.css','yomogi/index.css',
 'albert-sans/500.css','albert-sans/600.css','albert-sans/700.css'].map(c=>`<link rel="stylesheet" href="${NM}/${c}">`).join('');
const W=1080,H=1350,INK='#1F2B22',ROSE='#E9A39B',PAPER='#EEE6D3',MAT='#F7F1E4';
const paper=`<svg class="bg" width="${W}" height="${H}"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".012 .06" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .45  0 0 0 0 .40  0 0 0 0 .30  0 0 0 .16 0"/></filter><rect width="${W}" height="${H}" filter="url(#f)"/></svg>`;
const grain=`<svg class="bg" width="${W}" height="${H}" style="mix-blend-mode:overlay;opacity:.26;z-index:30"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter><rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${PAPER};-webkit-font-smoothing:antialiased}.bg{position:absolute;inset:0;pointer-events:none}
.SM{font-family:'Shippori Mincho B1',serif}.AS{font-family:'Albert Sans',sans-serif}.YO{font-family:'Yomogi',cursive}`;
// katomado (bell / flame window) outline scaled to w x h, offset ox,oy
function kato(w,h,ox=0,oy=0,top=0.30){const X=v=>(ox+v*w).toFixed(1),Y=v=>(oy+v*h).toFixed(1);const t=top;
 return `M${X(.035)} ${Y(1)} L${X(.035)} ${Y(t+.10)} C${X(.035)} ${Y(t+.04)} ${X(0)} ${Y(t+.03)} ${X(0)} ${Y(t)} `+
 `C${X(.07)} ${Y(t)} ${X(.13)} ${Y(t-.05)} ${X(.19)} ${Y(t-.11)} C${X(.30)} ${Y(t-.22)} ${X(.42)} ${Y(t-.20)} ${X(.47)} ${Y(t-.27)} `+
 `Q${X(.5)} ${Y(t-.31)} ${X(.53)} ${Y(t-.27)} C${X(.58)} ${Y(t-.20)} ${X(.70)} ${Y(t-.22)} ${X(.81)} ${Y(t-.11)} `+
 `C${X(.87)} ${Y(t-.05)} ${X(.93)} ${Y(t)} ${X(1)} ${Y(t)} C${X(1)} ${Y(t+.03)} ${X(.965)} ${Y(t+.04)} ${X(.965)} ${Y(t+.10)} L${X(.965)} ${Y(1)} Z`}
// framed katomado still (svg): mat + hairline + clipped image
function katoStill(id,src,w,h,x=50,y=50,top=.30){const m=16;const p=kato(w,h,m,m,top);const P=kato(w+2*m,h+2*m,0,0,top*(h/(h+2*m))+ (m/(h+2*m))*0.0);
 return `<svg width="${w+2*m}" height="${h+2*m}" style="overflow:visible;filter:drop-shadow(0 26px 40px #1F2B2238)"><defs><clipPath id="${id}"><path d="${p}"/></clipPath></defs>
 <path d="${kato(w+2*m,h+2*m,0,0,top)}" fill="${MAT}"/><path d="${kato(w+2*m,h+2*m,0,0,top)}" fill="none" stroke="${INK}" stroke-opacity=".28" stroke-width="1.5"/>
 <image href="file://${D}/${src}" x="${m}" y="${m}" width="${w}" height="${h}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${id})" style="filter:contrast(1.04) saturate(.95)"/>
 <path d="${p}" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="2"/></svg>`}
const stars=(w,h,n,seed)=>{let x=seed;const r=()=>(x=(x*16807)%2147483647)/2147483647;let s='';for(let i=0;i<n;i++)s+=`<circle cx="${r()*w}" cy="${r()*h*.62}" r="${r()*1.6+.4}" fill="#FFF6E2" opacity="${r()*.6+.25}"/>`;return s};
function night(ww,wh){const hy=wh*.80;return `<svg style="position:absolute;inset:0" width="${ww}" height="${wh}"><defs>
 <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#16231C"/><stop offset=".45" stop-color="#22382D"/><stop offset=".68" stop-color="#4E5F4A"/><stop offset=".72" stop-color="#7C7560"/></linearGradient>
 <linearGradient id="hill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#18251D"/><stop offset="1" stop-color="#0F1813"/></linearGradient>
 <radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD9A0" stop-opacity=".9"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient></defs>
 <rect width="${ww}" height="${wh}" fill="url(#sky)"/>${stars(ww,wh,90,23)}
 <circle cx="${ww*.76}" cy="${wh*.20}" r="20" fill="#F6E9CC" opacity=".9"/><circle cx="${ww*.76+9}" cy="${wh*.20-5}" r="18" fill="#1A2920"/>
 <path d="M0 ${hy+10} C ${ww*.25} ${hy-40}, ${ww*.45} ${hy+5}, ${ww*.62} ${hy-22} C ${ww*.78} ${hy-45}, ${ww*.9} ${hy-10}, ${ww} ${hy-18} L${ww} ${wh} L0 ${wh} Z" fill="url(#hill)"/>
 <path d="M${ww*.40} ${wh+10} C ${ww*.36} ${wh-70}, ${ww*.58} ${hy+70}, ${ww*.695} ${hy-12}" fill="none" stroke="${ROSE}" stroke-opacity=".55" stroke-width="2.4" stroke-dasharray="3 11" stroke-linecap="round"/>
 <circle cx="${ww*.705}" cy="${hy-30}" r="46" fill="url(#glow)"/>
 <g transform="translate(${ww*.705} ${hy-24})"><path d="M-16 0 L-16 -16 L0 -28 L16 -16 L16 0 Z" fill="#0E1611"/><path d="M-21 -14 L0 -32 L21 -14" fill="none" stroke="#0E1611" stroke-width="4"/><rect x="-6" y="-13" width="9" height="8" fill="#FFD48A"/></g></svg>`}
function cover(c){const ww=760,wh=870,L=(W-ww)/2,T=226;return `${links}<style>${base}
.fr{position:absolute;inset:40px;border:1.5px solid ${INK}40}.fr2{position:absolute;inset:50px;border:1px solid ${INK}22}
.top{position:absolute;top:112px;left:0;right:0;text-align:center;font:600 25px 'Albert Sans';letter-spacing:.6em;padding-left:.6em;color:${INK}}
.dot{position:absolute;top:122px;width:7px;height:7px;border-radius:50%;background:${ROSE}}
.wv{position:absolute;left:${L}px;top:${T}px;width:${ww}px;height:${wh}px;filter:drop-shadow(0 36px 60px #1F2B2244)}
.wc{position:absolute;left:${L+60}px;top:${T+262}px;width:${ww-120}px;display:flex;flex-direction:column;align-items:center;text-align:center}
.k{font:600 21px 'Albert Sans';letter-spacing:.5em;padding-left:.5em;color:#E7DCC4cc}
.h{font:600 70px/1.1 'Shippori Mincho B1';color:#F6EEDD;margin-top:26px;letter-spacing:-.5px}
.h2{font:400 48px/1.12 'Yomogi';color:${ROSE};margin-top:30px;text-shadow:0 0 30px ${ROSE}55;transform:rotate(-2deg)}
.v{position:absolute;right:80px;top:470px;writing-mode:vertical-rl;font:400 34px 'Yomogi';color:${INK}bb;letter-spacing:.25em}
.vs{position:absolute;right:84px;top:742px;font:600 14px 'Albert Sans';letter-spacing:.3em;color:${INK}88;writing-mode:vertical-rl}
.s{position:absolute;top:1136px;left:0;right:0;text-align:center;font:400 36px 'Shippori Mincho B1';color:#3C463D}
.s b{color:#B9645B;font-weight:600}
.ft{position:absolute;bottom:72px;left:100px;right:100px;display:flex;justify-content:space-between;font:600 20px 'Albert Sans';letter-spacing:.42em;color:${INK}99}</style>
${paper}<div class="fr"></div><div class="fr2"></div><div class="dot" style="left:206px"></div><div class="dot" style="right:206px"></div><div class="top">ANIME HIDDEN GEMS</div>
<svg class="wv" width="${ww}" height="${wh}" style="overflow:visible"><defs><clipPath id="cw"><path d="${kato(ww-36,wh-36,18,18,.30)}"/></clipPath></defs>
<path d="${kato(ww,wh,0,0,.30)}" fill="${MAT}"/><path d="${kato(ww+24,wh+24,-12,-12,.30)}" fill="none" stroke="${INK}" stroke-opacity=".3" stroke-width="1.5"/>
<foreignObject x="0" y="0" width="${ww}" height="${wh}" clip-path="url(#cw)"><div xmlns="http://www.w3.org/1999/xhtml" style="width:${ww}px;height:${wh}px;position:relative">${night(ww,wh)}</div></foreignObject></svg>
<div class="wc"><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div></div>
<div class="v">いってきます</div>
<div class="s">${c.sub}</div><div class="ft"><span>05 ANIME</span><span>SWIPE →</span></div>${grain}`}
function road(i,n,ink){const x0=0,x1=560;const pts=[...Array(n)].map((_,k)=>x0+30+k*(x1-80)/(n-1));
 return `<svg width="760" height="56" style="position:absolute;left:0;top:0;overflow:visible">
 <path d="M10 30 C 140 6, 260 52, 400 26 S 560 18, 610 28" fill="none" stroke="${INK}" stroke-opacity=".35" stroke-width="2" stroke-dasharray="2 10" stroke-linecap="round"/>
 ${pts.map((x,k)=>{const y=30+Math.sin(k*1.3)*8;return k===i?`<circle cx="${x}" cy="${y}" r="13" fill="${ink}"/><circle cx="${x}" cy="${y}" r="21" fill="none" stroke="${ink}" stroke-opacity=".35" stroke-width="2"/>`:`<circle cx="${x}" cy="${y}" r="5.5" fill="${k<i?ink:'none'}" stroke="${ink}" stroke-opacity=".7" stroke-width="2"/>`}).join('')}
 <g transform="translate(640 34)"><path d="M-15 0 L-15 -15 L0 -26 L15 -15 L15 0 Z" fill="${INK}"/><rect x="-5" y="-12" width="8" height="7" fill="${ROSE}"/></g></svg>`}
function slide(m,i){const n=S.movies.length;return `${links}<style>${base}
.fr{position:absolute;inset:40px;border:1.5px solid ${INK}33}
.hd{position:absolute;top:78px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:center;font:600 19px 'Albert Sans';letter-spacing:.42em;color:${INK}99}
.hd b{color:${m.ink};font-weight:700}
.big{position:absolute;left:70px;top:120px}
.ins{position:absolute;right:76px;top:${m.insTop||690}px;width:330px;height:210px;border-radius:16px;overflow:hidden;box-shadow:0 0 0 8px ${MAT},0 0 0 9.5px ${INK}33,0 20px 36px #1F2B2238;transform:rotate(2.5deg);z-index:3}
.ins img{width:100%;height:100%;object-fit:cover;object-position:${m.ix||50}% ${m.iy||50}%}
.tape{position:absolute;right:186px;top:${(m.insTop||690)-18}px;width:120px;height:32px;background:${m.ink}50;transform:rotate(-6deg);z-index:4}
.flow{position:absolute;left:96px;right:96px;top:740px;display:flex;flex-direction:column}
.tx{width:${m.txw||560}px;min-height:176px}
.meta{font:700 16px 'Albert Sans';letter-spacing:.26em;white-space:nowrap;color:${m.ink}}
.t{font:800 ${m.fs||62}px/1.04 'Shippori Mincho B1';color:${INK};margin-top:16px;letter-spacing:-.6px}
.lab{display:flex;align-items:center;gap:14px;margin-top:22px;font:600 15px 'Albert Sans';letter-spacing:.38em;color:${INK}88}
.lab i{display:block;width:40px;height:1.5px;background:${m.ink}}
.kept{margin-top:16px;font:400 ${m.kfs||46}px/1.18 'Yomogi';color:${m.ink};transform:rotate(-1deg);transform-origin:left}
.ov{margin-top:20px;font:400 29px/1.42 'Shippori Mincho B1';color:#3C463D;padding-right:20px}
.ft{position:absolute;bottom:62px;left:96px;width:760px;height:56px}
.sw{position:absolute;right:96px;bottom:78px;font:600 19px 'Albert Sans';letter-spacing:.42em;color:${INK}88}</style>
${paper}<div class="fr"></div>
<div class="hd"><span>ANIME HIDDEN GEMS</span><span>Nº <b>0${i+1}</b> / 0${n}</span></div>
<div class="big">${katoStill('k'+i,m.img,908,560,m.x,m.y,.22)}</div>
<div class="tape"></div><div class="ins"><img src="file://${D}/${m.inset}"></div>
<div class="flow"><div class="tx"><div class="meta">${m.kind} · ${m.yr} · DIR. ${m.dir}</div><div class="t">${m.t}</div></div>
<div class="lab"><i></i>A NOTE FROM HOME</div>
<div class="kept">${m.kept}</div><div class="ov">${m.ov}</div></div>
<div class="ft">${road(i,n,m.ink)}</div><span class="sw">SWIPE →</span>${grain}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});fs.mkdirSync(D+'/out',{recursive:true});
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,slide(m,i)])];
const only=process.argv[3];
for(const [name,h] of pages){if(only&&!name.startsWith(only))continue;fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(600);await p.screenshot({path:`${D}/out/${name}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
