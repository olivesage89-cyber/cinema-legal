// NEON & MATCHBOOK slides (1080x1350): brick club wall, film title as a glowing neon sign, brass-framed still,
// tilted club matchbook with 2nd still + venue, Poiret One meta + Cormorant italic line. Cover: Sacramento neon + Limelight.
// Usage: node render_jazz.js DIR   (DIR/jazz.json)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const C=JSON.parse(fs.readFileSync(D+'/jazz.json'));
fs.mkdirSync(D+'/out',{recursive:true});
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const CSS=ff('Sacr','sacramento',400)+ff('Lime','limelight',400)+ff('Poiret','poiret-one',400)+ff('Corm','cormorant-garamond',500,'italic')+ff('Corm','cormorant-garamond',400,'italic');
const grain=`.grain{position:absolute;inset:0;opacity:.1;mix-blend-mode:overlay;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}`;
const CREAM='#F7EDDC';
function brick(){ // svg brick wall pattern, slight tone variance
 let s='';const bw=118,bh=50,m=6;let k=0;
 for(let r=0;r<28;r++){const off=r%2?-bw/2:0;for(let c=-1;c<11;c++){k++;const v=0.16+((k*37)%11)/100;
  s+=`<rect x='${off+c*(bw+m)}' y='${r*(bh+m)}' width='${bw}' height='${bh}' rx='2' fill='rgba(255,255,255,${v.toFixed(2)})'/>`;}}
 return `<svg width='1080' height='1350' style='position:absolute;left:0;top:0;opacity:.24'>${s}</svg>`;}
const neon=(acc,px)=>`color:#FFF8EE;text-shadow:0 0 2px #fff,0 0 ${px*.06}px ${acc},0 0 ${px*.14}px ${acc},0 0 ${px*.3}px ${acc},0 0 ${px*.6}px ${acc}aa`;
const shot=async(p,html,out)=>{fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);await p.screenshot({path:out,type:'jpeg',quality:93});};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
const BR=brick();
for(const [i,f] of C.films.entries()){
 const html=`<html><head><style>${CSS}${grain}*{margin:0;padding:0;box-sizing:border-box}
 body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${f.bg};color:${CREAM}}
 .wash{position:absolute;inset:0;background:radial-gradient(ellipse 70% 30% at 50% 17%,${f.acc}40,transparent 70%),radial-gradient(ellipse 120% 90% at 50% 50%,transparent 40%,rgba(0,0,0,.75))}
 .hdr{position:absolute;top:52px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font:400 21px Poiret;letter-spacing:.38em;color:${CREAM};opacity:.85}
 .hdr i{font:400 40px Sacr;letter-spacing:0;font-style:normal;${neon(f.acc,40)}}
 .sign{position:absolute;top:96px;left:40px;right:40px;height:270px;display:flex;align-items:center;justify-content:center;text-align:center;
  font:400 ${f.fs}px/0.95 Sacr;${neon(f.acc,f.fs)}}
 .frame{position:absolute;left:60px;top:392px;width:960px;height:590px;padding:9px;
  background:linear-gradient(135deg,#E6C887,#8C6A33 40%,#D9B877 60%,#6E5228);box-shadow:0 26px 50px rgba(0,0,0,.7),0 0 0 2px rgba(0,0,0,.5)}
 .frame div{width:100%;height:100%;background:url(file://${D}/${f.img}) ${f.pos}/cover;filter:contrast(1.05) saturate(1.05);box-shadow:inset 0 0 70px rgba(0,0,0,.45)}
 .meta{position:absolute;left:72px;top:1040px;font:400 22px Poiret;letter-spacing:.3em;color:${f.acc};font-weight:400}
 .meta b{color:${CREAM};font-weight:400}
 .rule{position:absolute;left:72px;top:1088px;width:90px;height:2px;background:${f.acc};opacity:.8}
 .line{position:absolute;left:70px;top:1112px;width:600px;font:500 italic 40px/1.22 Corm;color:${CREAM}}
 .mb{position:absolute;left:712px;top:902px;width:300px;height:392px;transform:rotate(6deg);filter:drop-shadow(0 22px 26px rgba(0,0,0,.65))}
 .mb .cov{position:absolute;left:0;top:0;width:300px;height:318px;background:${f.mb};border-radius:4px 4px 0 0;padding:16px;
  background-image:linear-gradient(160deg,rgba(255,255,255,.12),rgba(0,0,0,.18))}
 .mb .ph{width:268px;height:150px;background:url(file://${D}/${f.img2}) ${f.pos2}/cover;border:3px solid ${CREAM};filter:contrast(1.05)}
 .mb .live{margin-top:12px;text-align:center;font:400 14px Poiret;letter-spacing:.42em;padding-left:.42em;color:${CREAM};opacity:.9}
 .mb .v{margin-top:6px;text-align:center;font:400 30px/1.05 Lime;color:${CREAM}}
 .mb .c{margin-top:8px;text-align:center;font:400 14px Poiret;letter-spacing:.42em;padding-left:.42em;color:${f.acc}}
 .mb .flap{position:absolute;left:0;top:318px;width:300px;height:74px;background:${f.mb};border-top:2px solid rgba(0,0,0,.45);border-radius:0 0 4px 4px;
  background-image:linear-gradient(180deg,rgba(0,0,0,.3),rgba(0,0,0,.1))}
 .mb .strike{position:absolute;left:0;bottom:12px;width:300px;height:24px;background:#3A2A20;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100' height='24'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2'/></filter><rect width='100' height='24' filter='url(%23n)' opacity='.6'/></svg>")}
 .mb .staple{position:absolute;left:142px;top:336px;width:16px;height:6px;border-radius:2px;background:#cfcfcf;box-shadow:0 1px 1px rgba(0,0,0,.5)}
 </style></head><body>${BR}<div class='wash'></div>
 <div class='hdr'><span>Nº 0${i+1} / 05</span><i>jazz club at midnight</i></div>
 <div class='sign'>${f.t}</div>
 <div class='frame'><div></div></div>
 <div class='meta'><b>${f.yr}</b> &nbsp;·&nbsp; DIR. ${f.dir.toUpperCase()}</div><div class='rule'></div>
 <div class='line'>${f.line}</div>
 <div class='mb'><div class='cov'><div class='ph'></div><div class='live'>LIVE · TONIGHT</div><div class='v'>${f.venue}</div><div class='c'>${f.city}</div></div>
  <div class='flap'><div class='strike'></div></div><div class='staple'></div></div>
 <div class='grain'></div></body></html>`;
 await shot(p,html,`${D}/out/0${i+2}_${f.slug}.jpg`);}
// COVER
const c=C.cover;const H=Math.round(c.w*1080/1920);const top=1350-H;
const html=`<html><head><style>${CSS}${grain}*{margin:0;padding:0}
 body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0B0C0C;text-align:center}
 .ext{position:absolute;inset:-40px;background:url(file://${D}/${c.img}) 55% 0/auto 1500px;filter:blur(26px) brightness(.42) saturate(.8)}
 .img{position:absolute;left:${c.left}px;top:${top}px;width:${c.w}px;filter:contrast(1.06) saturate(1.08);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 200px)}
 .shade{position:absolute;left:0;right:0;top:0;height:${top+120}px;background:linear-gradient(180deg,rgba(8,8,9,.72),rgba(8,8,9,.35) 70%,rgba(8,8,9,0))}
 .vig{position:absolute;inset:0;background:radial-gradient(ellipse 95% 85% at 55% 62%,transparent 55%,rgba(0,0,0,.6))}
 .k{position:absolute;top:64px;width:100%;font:400 25px Poiret;letter-spacing:.5em;padding-left:.5em;color:${CREAM}}
 .h{position:absolute;top:126px;width:100%;font:400 236px/1 Sacr;${neon(c.ink,236)};transform:rotate(-4deg)}
 .h2{position:absolute;top:392px;width:100%;font:400 92px/1 Lime;letter-spacing:.16em;padding-left:.16em;color:${CREAM};text-shadow:0 4px 18px rgba(0,0,0,.7)}
 .sub{position:absolute;top:506px;width:100%;font:500 italic 34px/1.22 Corm;color:${CREAM};opacity:.95;text-shadow:0 2px 12px rgba(0,0,0,.85)}
</style></head><body><div class='ext'></div><img class='img' src='file://${D}/${c.img}'><div class='shade'></div><div class='vig'></div>
<div class='k'>MOVIES THAT FEEL LIKE A</div><div class='h'>jazz club</div><div class='h2'>AT MIDNIGHT</div>
<div class='sub'>${c.sub}</div><div class='grain'></div></body></html>`;
await shot(p,html,`${D}/out/01_cover.jpg`);
await b.close();})();
