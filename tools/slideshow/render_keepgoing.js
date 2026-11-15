// "PRACTICE LOG" — cool fog paper, stadium/capsule dawn window, running-track details, handwritten log notes.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file:///root/engine/node_modules/@fontsource';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}/${p})}`;
const fonts=[ff('IS','instrument-serif/files/instrument-serif-latin-400-normal.woff2'),ff('IS','instrument-serif/files/instrument-serif-latin-400-italic.woff2',400,'italic'),
ff('Ar','archivo/files/archivo-latin-600-normal.woff2',600),ff('Ar','archivo/files/archivo-latin-500-normal.woff2',500),
ff('RB','reenie-beanie/files/reenie-beanie-latin-400-normal.woff2')].join('');
const W=1080,H=1350,INK='#1B2547',SUN='#F4A85C',PAPER='#ECECE6';
const paper=`<svg class="bg" width="${W}" height="${H}"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".018 .05" numOctaves="4" seed="4"/><feColorMatrix values="0 0 0 0 .35  0 0 0 0 .38  0 0 0 0 .45  0 0 0 .14 0"/></filter><rect width="${W}" height="${H}" filter="url(#f)"/></svg>`;
const grain=`<svg class="bg" width="${W}" height="${H}" style="mix-blend-mode:overlay;opacity:.28;z-index:30"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter><rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${PAPER};-webkit-font-smoothing:antialiased}.bg{position:absolute;inset:0;pointer-events:none}`;
// tally marks svg
const tally=(n,col,h=34)=>{let s='',x=4;for(let g=0;g<n;g++){for(let i=0;i<4;i++){s+=`<path d="M${x+i*9} ${h-3} L${x+i*9+1.5} 4" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`}s+=`<path d="M${x-4} ${h-8} L${x+32} 9" stroke="${col}" stroke-width="2.6" stroke-linecap="round"/>`;x+=50}return `<svg width="${x}" height="${h}">${s}</svg>`};
// stars
const stars=(w,h,n,seed)=>{let x=seed;const r=()=>(x=(x*16807)%2147483647)/2147483647;let s='';for(let i=0;i<n;i++)s+=`<circle cx="${r()*w}" cy="${r()*h*.55}" r="${r()*1.5+.4}" fill="#fff" opacity="${(r()*.6+.2)*(1-i/n*.3)}"/>`;return s};
function track(ww,wh){ // perspective running-track lanes curving to the horizon
 const hy=wh*0.70;let s='';for(let i=0;i<7;i++){const bx=-180+i*190;s+=`<path d="M${ww/2+(i-3)*16} ${hy} C ${ww/2+(i-3)*60} ${hy+120}, ${bx+60} ${wh-120}, ${bx} ${wh+30}" fill="none" stroke="#F7E3C8" stroke-opacity="${.55}" stroke-width="${1.2+i%3*.3}"/>`}
 return `<svg style="position:absolute;inset:0" width="${ww}" height="${wh}"><defs><linearGradient id="gr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2A2A45"/><stop offset="1" stop-color="#151A30"/></linearGradient>
 <radialGradient id="sg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD9A6"/><stop offset=".35" stop-color="${SUN}" stop-opacity=".75"/><stop offset="1" stop-color="${SUN}" stop-opacity="0"/></radialGradient></defs>
 ${stars(ww,wh,70,17)}<circle cx="${ww/2}" cy="${hy}" r="260" fill="url(#sg)"/><circle cx="${ww/2}" cy="${hy+6}" r="46" fill="#FFE2B8"/>
 <rect x="0" y="${hy}" width="${ww}" height="${wh-hy}" fill="url(#gr)"/><rect x="0" y="${hy}" width="${ww}" height="2" fill="#FFD3A0" opacity=".8"/>${s}
 <g transform="translate(${ww/2+92} ${hy-4})" fill="#10142A"><circle cx="0" cy="-34" r="5.2"/><path d="M-2 -28 L4 -12 L-3 -10 L-10 -1 L-8 1 L0 -6 L5 -6 L10 3 L13 2 L8 -10 L6 -20 L12 -14 L17 -16 L9 -25 Z"/></g></svg>`}
function cover(c){const ww=700,wh=860,L=(W-ww)/2,T=210;return `<style>${fonts}${base}
.fr{position:absolute;inset:40px;border:1.5px solid ${INK}38;border-radius:6px}
.top{position:absolute;top:118px;left:0;right:0;text-align:center;font:600 26px Ar;letter-spacing:.58em;padding-left:.58em;color:${INK}}
.tick{position:absolute;top:131px;width:64px;height:1.5px;background:${INK}55}
.halo{position:absolute;left:${L-16}px;top:${T-16}px;width:${ww+32}px;height:${wh+32}px;border-radius:${(ww+32)/2}px;border:1.5px solid ${INK}40}
.win{position:absolute;left:${L}px;top:${T}px;width:${ww}px;height:${wh}px;border-radius:${ww/2}px;overflow:hidden;
 background:linear-gradient(180deg,#141B38 0%,#25305A 34%,#5B4A78 56%,#C27367 66%,${SUN} 70%);box-shadow:0 0 0 10px #F6F5F0,0 36px 80px #1B254744}
.wc{position:absolute;left:0;right:0;top:150px;display:flex;flex-direction:column;align-items:center;text-align:center}
.h{font:400 150px/.92 IS;color:#F8F1E6;letter-spacing:-2px}.h i{display:block;color:${SUN};text-shadow:0 0 40px ${SUN}66}
.h2{font:400 italic 54px/1.1 IS;color:#EDE3D6;margin-top:26px}
.note{position:absolute;left:96px;top:1084px;font:400 52px RB;color:${INK};transform:rotate(-5deg)}
.note2{position:absolute;right:98px;top:1092px;transform:rotate(3deg)}
.s{position:absolute;top:1170px;left:0;right:0;text-align:center;font:400 italic 42px IS;color:#3B4160}
.ft{position:absolute;bottom:70px;left:100px;right:100px;display:flex;justify-content:space-between;font:600 21px Ar;letter-spacing:.42em;color:${INK}99}</style>
${paper}<div class="fr"></div><div class="tick" style="left:182px"></div><div class="tick" style="right:182px"></div><div class="top">ANIME HIDDEN GEMS</div>
<div class="halo"></div><div class="win">${track(ww,wh)}<div class="wc"><div class="h">keep<i>going.</i></div><div class="h2">even when nobody notices.</div></div></div>
<div class="note">day 312.</div><div class="note2">${tally(3,INK+'cc',40)}</div>
<div class="s">${c.sub}</div><div class="ft"><span>05 ANIME</span><span>SWIPE →</span></div>${grain}`}
function slide(m,i){const n=S.movies.length;const lane=(k)=>121+k*560/(n-1);return `<style>${fonts}${base}
.fr{position:absolute;inset:40px;border:1.5px solid ${INK}30;border-radius:6px}
.hd{position:absolute;top:80px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:center;font:600 20px Ar;letter-spacing:.42em;color:${INK}99}
.hd b{color:${m.ink};font-weight:600}
.big{position:absolute;left:84px;top:132px;width:912px;height:560px;border-radius:280px 280px 22px 22px;overflow:hidden;box-shadow:0 0 0 9px #F6F5F0,0 30px 60px #1B254738}
.big img{width:100%;height:100%;object-fit:cover;object-position:${m.x||50}% ${m.y||50}%;filter:contrast(1.04) saturate(.96)}
.big:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 80px #0004}
.ins{position:absolute;right:84px;top:742px;width:330px;height:200px;border-radius:100px;overflow:hidden;box-shadow:0 0 0 7px #F6F5F0,0 18px 36px #1B254733;transform:rotate(-2deg)}
.ins img{width:100%;height:100%;object-fit:cover;object-position:${m.ix||50}% ${m.iy||50}%}
.tape{position:absolute;right:220px;top:728px;width:110px;height:30px;background:${m.ink}55;transform:rotate(-8deg);z-index:3}
.tx{position:absolute;left:96px;top:732px;width:560px}
.meta{font:600 17px Ar;letter-spacing:.26em;white-space:nowrap;color:${m.ink}}
.t{font:400 ${m.fs||80}px/.98 IS;color:${INK};margin-top:14px;letter-spacing:-.6px}
.lab{display:flex;align-items:center;gap:16px;margin-top:22px;font:600 16px Ar;letter-spacing:.38em;color:${INK}88}
.kept{position:absolute;left:96px;right:96px;top:1000px;font:400 62px/1 RB;color:${m.ink};transform:rotate(-1.5deg)}
.ov{position:absolute;left:96px;right:96px;top:1080px;font:400 italic 36px/1.22 IS;color:#3B4160}
.ft{position:absolute;bottom:70px;left:96px;right:96px;height:40px}
.ln{position:absolute;left:0;right:300px;top:19px;height:2px;background:${INK}2a}
.lt{position:absolute;top:10px;width:2px;height:20px;background:${INK}44}
.dot{position:absolute;top:9px;width:22px;height:22px;border-radius:50%;background:${m.ink};box-shadow:0 0 0 6px ${m.ink}33}
.sw{position:absolute;right:0;top:8px;font:600 20px Ar;letter-spacing:.42em;color:${INK}88}</style>
${paper}<div class="fr"></div>
<div class="hd"><span>ANIME HIDDEN GEMS</span><span>LOG <b>Nº 0${i+1}</b> / 0${n}</span></div>
<div class="big"><img src="file://${D}/${m.img}"></div>
<div class="tape"></div><div class="ins"><img src="file://${D}/${m.inset}"></div>
<div class="tx"><div class="meta">${m.kind} · ${m.yr} · DIR. ${m.dir}</div><div class="t">${m.t}</div>
<div class="lab">${tally(1,m.ink,28)}WHAT THEY KEPT DOING</div></div>
<div class="kept">${m.kept}</div><div class="ov">${m.ov}</div>
<div class="ft"><div class="ln"></div>${S.movies.map((_,k)=>`<div class="lt" style="left:${lane(k)-110}px"></div>`).join('')}<div class="dot" style="left:${lane(i)-121}px"></div><span class="sw">SWIPE →</span></div>${grain}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});fs.mkdirSync(D+'/out',{recursive:true});
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,slide(m,i)])];
const only=process.argv[3];
for(const [name,h] of pages){if(only&&!name.startsWith(only))continue;fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.waitForTimeout(500);await p.screenshot({path:`${D}/out/${name}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
