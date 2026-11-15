// "FIREFLY REEL" — warm stone paper, 35mm film-frame windows w/ sprocket holes, firefly-glow accents.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file:///root/engine/node_modules/@fontsource';
const ff=(n,p,w=400,s='normal')=>`@font-face{font-family:'${n}';font-weight:${w};font-style:${s};src:url(${F}/${p})}`;
const fonts=[ff('Gl','gloock/files/gloock-latin-400-normal.woff2'),
ff('Bod','bodoni-moda/files/bodoni-moda-latin-500-italic.woff2',500,'italic'),ff('Bod','bodoni-moda/files/bodoni-moda-latin-400-italic.woff2',400,'italic'),
ff('Bod','bodoni-moda/files/bodoni-moda-latin-500-normal.woff2',500),
ff('Jo','jost/files/jost-latin-500-normal.woff2',500),ff('Jo','jost/files/jost-latin-400-normal.woff2',400)].join('');
const W=1080,H=1350,INK='#221B24',GLOW='#E4EA74',PAPER='#ECE5D9';
const paper=`<svg class="bg" width="${W}" height="${H}"><filter id="f"><feTurbulence type="fractalNoise" baseFrequency=".02 .06" numOctaves="4" seed="9"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .45  0 0 0 0 .38  0 0 0 .16 0"/></filter><rect width="${W}" height="${H}" filter="url(#f)"/></svg>`;
const grain=`<svg class="bg" width="${W}" height="${H}" style="mix-blend-mode:overlay;opacity:.3;z-index:30"><filter id="g"><feTurbulence type="fractalNoise" baseFrequency=".95" numOctaves="2"/></filter><rect width="${W}" height="${H}" filter="url(#g)"/></svg>`;
const base=`*{margin:0;padding:0;box-sizing:border-box}body{width:${W}px;height:${H}px;position:relative;overflow:hidden;background:${PAPER};-webkit-font-smoothing:antialiased}.bg{position:absolute;inset:0;pointer-events:none}
.fr{position:absolute;inset:40px;border:1.5px solid ${INK}40}.fr2{position:absolute;inset:50px;border:1px solid ${INK}22}`;
// fireflies (seeded)
function flies(w,h,n,seed,yMin=0){let x=seed;const r=()=>(x=(x*16807)%2147483647)/2147483647;let s='';
for(let i=0;i<n;i++){const cx=r()*w,cy=yMin+r()*(h-yMin),rr=r()*3+1.6,o=r()*.6+.4;
s+=`<circle cx="${cx}" cy="${cy}" r="${rr*5}" fill="url(#gl)" opacity="${o*.55}"/><circle cx="${cx}" cy="${cy}" r="${rr}" fill="#FBFBD0" opacity="${o}"/>`}
return `<svg style="position:absolute;inset:0" width="${w}" height="${h}"><defs><radialGradient id="gl"><stop offset="0" stop-color="${GLOW}"/><stop offset="1" stop-color="${GLOW}" stop-opacity="0"/></radialGradient></defs>${s}</svg>`}
// sprocket holes along a side
const holes=(n,vert,len,col)=>{let s='';const step=len/n;for(let i=0;i<n;i++){const p=step*i+step/2-13;s+=vert?`<div style="position:absolute;left:0;top:${p}px;width:30px;height:26px;border-radius:6px;background:${col}"></div>`:`<div style="position:absolute;top:0;left:${p}px;width:26px;height:30px;border-radius:6px;background:${col}"></div>`}return s};
function grass(w,h,col){let x=5;const r=()=>(x=(x*16807)%2147483647)/2147483647;let d='';
for(let i=0;i<120;i++){const bx=r()*w,bh=40+r()*110,lean=(r()-.5)*50;d+=`M${bx.toFixed(1)} ${h} Q${(bx+lean*.4).toFixed(1)} ${h-bh*.6} ${(bx+lean).toFixed(1)} ${(h-bh).toFixed(1)} Q${(bx+lean*.3+4).toFixed(1)} ${h-bh*.5} ${(bx+7).toFixed(1)} ${h} Z`}
return `<svg style="position:absolute;inset:0" width="${w}" height="${h}"><path d="${d}" fill="${col}"/></svg>`}
function cover(c){const ww=780,wh=880;return `<style>${fonts}${base}
.top{position:absolute;top:112px;left:0;right:0;text-align:center;font:500 27px Jo;letter-spacing:.56em;padding-left:.56em;color:${INK}}
.tick{position:absolute;top:126px;width:70px;height:1.5px;background:${INK}55}
.strip{position:absolute;left:${(W-ww-140)/2}px;top:186px;width:${ww+140}px;height:${wh+40}px;background:#16121A;border-radius:22px;box-shadow:0 34px 70px #221B2440}
.hl{position:absolute;top:20px;bottom:20px;width:30px}
.win{position:absolute;left:70px;top:20px;width:${ww}px;height:${wh}px;border-radius:14px;overflow:hidden;background:radial-gradient(700px 520px at 50% 30%,#3A2F45,#231C2B 55%,#17121C)}
.wc{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 70px 110px}
.k{font:400 italic 50px Bod;color:#E9DFCB;margin-bottom:30px;letter-spacing:.2px}
.h{font:400 112px/1.03 Gl;color:#F6EEDD;letter-spacing:-1px}.h i{font:500 italic 122px Bod;color:${GLOW};text-shadow:0 0 34px ${GLOW}88}
.dots{margin-top:40px;font:500 22px Jo;letter-spacing:.5em;color:#E9DFCB99;padding-left:.5em}
.fn{position:absolute;bottom:34px;left:0;right:0;text-align:center;font:500 18px Jo;letter-spacing:.5em;color:#E9DFCB55}
.s{position:absolute;top:1150px;left:0;right:0;text-align:center;font:400 italic 44px Bod;color:#3A2E36}
.ft{position:absolute;bottom:78px;left:100px;right:100px;display:flex;justify-content:space-between;font:500 22px Jo;letter-spacing:.42em;color:${INK}99}</style>
${paper}<div class="fr"></div><div class="fr2"></div><div class="tick" style="left:170px"></div><div class="tick" style="right:170px"></div><div class="top">ANIME HIDDEN GEMS</div>
<div class="strip"><div class="hl" style="left:20px">${holes(11,1,wh,PAPER)}</div><div class="hl" style="right:20px">${holes(11,1,wh,PAPER)}</div>
<div class="win">${flies(ww,wh,46,23,40)}${grass(ww,wh,'#0E0B10')}<div class="wc"><div class="k">${c.k}</div><div class="h">${c.h}</div><div class="dots">✦ ✦ ✦</div></div><div class="fn">◂ 35 ▸ &nbsp; KODAK 5219 &nbsp; ◂ 36 ▸</div></div></div>
<div class="s">${c.sub}</div><div class="ft"><span>05 ANIME</span><span>SWIPE →</span></div>${grain}`}
function slide(m,i){const n=S.movies.length;return `<style>${fonts}${base}
.hd{position:absolute;top:82px;left:96px;right:96px;display:flex;justify-content:space-between;font:500 21px Jo;letter-spacing:.42em;color:${INK}99}
.strip{position:absolute;left:80px;top:128px;width:920px;height:606px;background:#16121A;border-radius:18px;box-shadow:0 30px 60px #221B2438}
.hl{position:absolute;left:24px;right:24px;height:30px}
.big{position:absolute;left:24px;top:58px;width:872px;height:490px;border-radius:10px;overflow:hidden}
.big img{width:100%;height:100%;object-fit:cover;object-position:${m.x||50}% ${m.y||50}%;filter:contrast(1.04) saturate(.95) sepia(.08)}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 90px #0006}
.ins{position:absolute;right:88px;top:790px;width:300px;height:236px;background:#F8F3EA;padding:12px 12px 40px;transform:rotate(2.4deg);box-shadow:0 18px 34px #221B2433}
.ins img{width:100%;height:100%;object-fit:cover;object-position:${m.ix||50}% ${m.iy||50}%;filter:contrast(1.03) sepia(.08)}
.ins span{position:absolute;bottom:9px;left:0;right:0;text-align:center;font:400 italic 20px Bod;color:#5A4B52}
.tx{position:absolute;left:96px;top:774px;width:566px}
.meta{font:500 18px Jo;letter-spacing:.28em;white-space:nowrap;color:${m.ink}}
.t{font:400 ${m.fs||76}px/1.0 Gl;color:${INK};margin-top:16px;letter-spacing:-.6px}
.rule{display:flex;align-items:center;gap:14px;margin:26px 0 12px;font:500 17px Jo;letter-spacing:.42em;color:${m.ink}}
.rule b{width:13px;height:13px;border-radius:50%;background:${m.ink};box-shadow:0 0 0 4px ${GLOW}aa,0 0 16px ${GLOW}}
.tr{font:500 italic 44px/1.12 Bod;color:${m.ink}}
.sb{font:400 italic 27px/1.3 Bod;color:#4A3E45;margin-top:12px}
.ft{position:absolute;bottom:78px;left:96px;right:96px;display:flex;justify-content:space-between;align-items:center;font:500 20px Jo;letter-spacing:.42em;color:${INK}88}
.pg{display:flex;gap:16px}.pg i{width:12px;height:12px;border-radius:50%;background:${INK}2a}.pg i.on{background:${m.ink};box-shadow:0 0 0 4px ${GLOW}aa,0 0 16px ${GLOW}}</style>
${paper}<div class="fr"></div><div class="fr2"></div>
<div class="hd"><span>ANIME HIDDEN GEMS</span><span>Nº 0${i+1} / 0${n}</span></div>
<div class="strip"><div class="hl" style="top:16px">${holes(15,0,872,PAPER)}</div><div class="big"><img src="file://${D}/${m.img}"><div class="vig"></div></div><div class="hl" style="bottom:16px">${holes(15,0,872,PAPER)}</div></div>
<div class="tx"><div class="meta">${m.kind} · ${m.yr} · DIR. ${m.dir}</div><div class="t">${m.t}</div>
<div class="rule"><b></b>THE HARD TRUTH</div><div class="tr">${m.truth}</div><div class="sb">${m.ov}</div></div>
<div class="ins"><img src="file://${D}/${m.inset}"><span>${m.cap}</span></div>
<div class="ft"><div class="pg">${S.movies.map((_,k)=>`<i class="${k==i?'on':''}"></i>`).join('')}</div><span>${i<n-1?'SWIPE →':'FOUND WITH CINEMA'}</span></div>${grain}`}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:W,height:H}});fs.mkdirSync(D+'/out',{recursive:true});
const pages=[['01_cover',cover(S.cover)],...S.movies.map((m,i)=>[`0${i+2}_${m.slug}`,slide(m,i)])];
const only=process.argv[3];
for(const [name,h] of pages){if(only&&!name.startsWith(only))continue;fs.writeFileSync(D+'/t.html','<html><head><meta charset="utf-8"></head><body>'+h+'</body></html>');await p.goto('file://'+D+'/t.html');await p.waitForTimeout(500);await p.screenshot({path:`${D}/out/${name}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
