// STAR CHART inside slides (1080x1350): night page w/ starfield, big lens-circle still with tick ring, small inset circle,
// Bellefair title, DM Mono meta, Lora italic line, constellation. node render_stars.js DIR (DIR/slides.json)
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,s='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${s};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${s}.woff2)}`;
const INK=S.ink;
function rnd(seed){let s=seed;return()=>{s=(s*9301+49297)%233280;return s/233280}}
function stars(seed){const r=rnd(seed);let o='';for(let i=0;i<260;i++){const x=r()*1080,y=r()*1350,R=[.6,.8,1,1.2,1.7][Math.floor(r()*5)],a=.35+r()*.65;o+=`<circle cx='${x}' cy='${y}' r='${R}' fill='#fff' fill-opacity='${a}'/>`}
 for(let i=0;i<8;i++){const x=r()*1080,y=r()*1350;o+=`<circle cx='${x}' cy='${y}' r='9' fill='#FFE9DA' fill-opacity='.18'/><circle cx='${x}' cy='${y}' r='2.2' fill='#FFF8F0'/>`}return o}
function constel(seed,x0,y0,x1,y1){const r=rnd(seed);const p=[...Array(5)].map(()=>[x0+r()*(x1-x0),y0+r()*(y1-y0)]).sort((a,b)=>a[0]-b[0]);let o='';
 for(let i=1;i<p.length;i++)o+=`<line x1='${p[i-1][0]}' y1='${p[i-1][1]}' x2='${p[i][0]}' y2='${p[i][1]}' stroke='${INK}' stroke-opacity='.5' stroke-width='1.4'/>`;
 p.forEach(q=>o+=`<circle cx='${q[0]}' cy='${q[1]}' r='10' fill='${INK}' fill-opacity='.2'/><circle cx='${q[0]}' cy='${q[1]}' r='3.6' fill='#FFF6EC'/>`);return o}
const CX=540,CY=520,R=360;
function ticks(){let o='';for(let j=0;j<48;j++){const a=j*Math.PI/24,l=j%4==0?30:22;o+=`<line x1='${CX+(R+14)*Math.cos(a)}' y1='${CY+(R+14)*Math.sin(a)}' x2='${CX+(R+l)*Math.cos(a)}' y2='${CY+(R+l)*Math.sin(a)}' stroke='${INK}' stroke-opacity='.6' stroke-width='1.5'/>`}return o}
const css=ff('Bel','bellefair',400)+ff('Mono','dm-mono',500)+ff('Lora','lora',400,'italic')+`*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;
 background:radial-gradient(circle at 50% 38%,#1B2746 0%,#0C1428 45%,#05070F 100%);color:#FFF8F0;text-align:center;position:relative}
 .lens{position:absolute;left:${CX-R}px;top:${CY-R}px;width:${2*R}px;height:${2*R}px;border-radius:50%;background-size:cover;box-shadow:0 0 80px rgba(120,150,255,.18);filter:saturate(1.02) contrast(1.03)}
 .inset{position:absolute;width:250px;height:250px;border-radius:50%;background-size:cover;border:6px solid #0A1122;outline:2px solid ${INK};outline-offset:6px;box-shadow:0 20px 50px rgba(0,0,0,.6)}
 .grain{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}
 .hdr{position:absolute;top:58px;width:100%;font:500 21px Mono;letter-spacing:.48em;padding-left:.48em;color:#E8E3F2;opacity:.75}
 .t{position:absolute;top:960px;width:100%;font:400 74px/1.02 Bel;letter-spacing:.07em;padding-left:.07em}
 .m{position:absolute;width:100%;font:500 20px Mono;letter-spacing:.2em;padding-left:.2em;color:${INK}}
 .l{position:absolute;width:100%;font:italic 400 36px/1.3 Lora;color:#F3EEF8}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
 for(const [i,f] of S.films.entries()){
  const two=f.t.includes('<br>');const mt=two?1124:1056, lt=mt+52;
  const html=`<html><head><style>${css}</style></head><body><svg width='1080' height='1350' style='position:absolute;left:0;top:0'>${stars(i*7+3)}
   <circle cx='${CX}' cy='${CY}' r='${R+14}' fill='none' stroke='${INK}' stroke-opacity='.55' stroke-width='2'/>
   <circle cx='${CX}' cy='${CY}' r='${R+44}' fill='none' stroke='#fff' stroke-opacity='.13' stroke-width='1.2' stroke-dasharray='3 9'/>${ticks()}
   ${constel(i*11+5,60,1250,300,1320)}${constel(i*5+2,760,70,1020,180)}</svg>
   <div class='lens' style="background-image:url('file://${D}/${f.img}');background-position:${f.x||50}% 50%"></div>
   <div class='inset' style="left:${f.ix||770}px;top:${f.iy||690}px;background-image:url('file://${D}/${f.img2}');background-position:${f.x2||50}% 50%"></div>
   <div class='hdr'>STAR CHART &nbsp;·&nbsp; 0${i+1} / 0${S.films.length}</div>
   <div class='t' style='font-size:${f.fs||74}px'>${f.t}</div>
   <div class='m' style='top:${mt}px'>${f.yr} &nbsp;·&nbsp; ${f.dir.toUpperCase()} &nbsp;·&nbsp; ${f.where.toUpperCase()}</div>
   <div class='l' style='top:${lt}px'>${f.line}</div><div class='grain'></div></body></html>`;
  fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
  await p.screenshot({path:`${D}/out/0${i+1}_${f.slug}.jpg`,type:'jpeg',quality:93});}
 await b.close();})();
