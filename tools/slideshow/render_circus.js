// BIG TOP BILL slides (1080x1350): striped scalloped canopy, marquee-bulb arched still, round ring inset, Rye title.
// Usage: node render_circus.js DIR   (DIR/circus.json)
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const C=JSON.parse(fs.readFileSync(D+'/circus.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const CSS=ff('Rye','rye',400)+ff('Rouge','rouge-script',400)+ff('Syne','syne',600)+ff('Syne','syne',700)+ff('Lora','lora',400,'italic')+ff('Lora','lora',500,'italic');
const grain=`.grain{position:absolute;inset:0;opacity:.09;mix-blend-mode:overlay;pointer-events:none;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}`;
const CREAM='#FBF1DE';const ACT=['I','II','III','IV','V'];
function canopy(acc,bg){ // striped big-top valance with scalloped edge
 const n=12,w=1080/n;let s='';
 for(let i=0;i<n;i++){const x=i*w;const col=i%2?CREAM:acc;
  s+=`<path d='M${x},0 L${x+w},0 L${x+w},96 Q${x+w/2},150 ${x},96 Z' fill='${col}'/>`;}
 s+=`<path d='M0,96 ${Array.from({length:n},(_,i)=>`Q${i*w+w/2},150 ${(i+1)*w},96`).join(' ')}' fill='none' stroke='rgba(0,0,0,.35)' stroke-width='3'/>`;
 for(let i=0;i<=n;i++) s+=`<circle cx='${i*w}' cy='98' r='7' fill='#FFE6A8'/>`; // tassels
 return `<svg width='1080' height='160' style='position:absolute;left:0;top:0;filter:drop-shadow(0 10px 14px rgba(0,0,0,.45))'>${s}</svg>`;}
function archPath(x0,x1,yTop,yb){const r=(x1-x0)/2;return `M${x0},${yb} L${x0},${yTop+r} A${r},${r} 0 0 1 ${x1},${yTop+r} L${x1},${yb} Z`;}
function bulbs(x0,x1,yTop,yb,pad){ // points along arch outline
 x0-=pad;x1+=pad;yTop-=pad;yb+=pad;const r=(x1-x0)/2,cx=x0+r,cy=yTop+r;let pts=[];
 const side=yb-cy;const arc=Math.PI*r;const total=2*side+arc+(x1-x0);const step=total/62;
 for(let d=0;d<total;d+=step){let x,y;
  if(d<side){x=x0;y=yb-d;}else if(d<side+arc){const a=Math.PI-(d-side)/r;x=cx+r*Math.cos(a);y=cy-r*Math.sin(a);}
  else if(d<2*side+arc){x=x1;y=cy+(d-side-arc);}else{x=x1-(d-2*side-arc);y=yb;}
  pts.push([x,y]);}
 return pts.map(([x,y])=>`<circle cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' r='5.2' fill='#FFF3C9' filter='url(#glow)'/>`).join('');}
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of C.films.entries()){
 const X0=150,X1=930,YT=230,YB=860;
 const html=`<html><head><style>${CSS}${grain}*{margin:0;padding:0;box-sizing:border-box}
 body{width:1080px;height:1350px;overflow:hidden;position:relative;color:${CREAM};text-align:center;
  background:radial-gradient(ellipse 75% 55% at 50% 45%,${f.bg2},${f.bg} 70%,#07060A 120%)}
 .stripes{position:absolute;inset:0;opacity:.07;background:repeating-linear-gradient(90deg,#fff 0 45px,transparent 45px 90px)}
 .hdr{position:absolute;top:168px;width:100%;font:700 19px Syne;letter-spacing:.42em;padding-left:.42em;color:${CREAM};opacity:.85}
 .hdr b{font:400 22px Rye;letter-spacing:.2em;color:${f.acc};opacity:1}
 .blk{position:absolute;top:892px;bottom:78px;left:60px;right:60px;display:flex;flex-direction:column;align-items:center;justify-content:center}
 .title{font:400 ${f.fs||86}px/1.02 Rye;color:${CREAM};
  text-shadow:4px 5px 0 ${f.acc},0 0 30px rgba(0,0,0,.4)}
 .meta{margin-top:26px;font:700 20px Syne;letter-spacing:.32em;padding-left:.32em;color:${f.acc}}
 .line{margin-top:20px;font:400 italic 35px/1.3 Lora;color:${CREAM};opacity:.93}
 .stars{position:absolute;bottom:36px;width:100%;font:400 20px Rye;letter-spacing:.6em;color:${f.acc};opacity:.8}
 </style></head><body><div class='stripes'></div>${canopy(f.acc,f.bg)}
 <div class='hdr'><b>ACT ${ACT[i]}</b> &nbsp; · &nbsp; RUNNING AWAY WITH THE CIRCUS</div>
 <svg width='1080' height='1350' style='position:absolute;left:0;top:0'><defs>
  <clipPath id='a'><path d='${archPath(X0,X1,YT,YB)}'/></clipPath>
  <clipPath id='c'><circle cx='${f.ix||846}' cy='${f.iy||800}' r='118'/></clipPath>
  <filter id='glow' x='-2' y='-2' width='5' height='5'><feGaussianBlur stdDeviation='3' result='b'/><feMerge><feMergeNode in='b'/><feMergeNode in='SourceGraphic'/></feMerge></filter>
  <filter id='grade'><feComponentTransfer><feFuncR type='linear' slope='1.04' intercept='0.01'/><feFuncB type='linear' slope='.95'/></feComponentTransfer></filter>
  <linearGradient id='v' x1='0' y1='0' x2='0' y2='1'><stop offset='.6' stop-color='#000' stop-opacity='0'/><stop offset='1' stop-color='#000' stop-opacity='.35'/></linearGradient></defs>
  <path d='${archPath(X0-26,X1+26,YT-26,YB+26)}' fill='rgba(0,0,0,.35)'/>
  <path d='${archPath(X0-18,X1+18,YT-18,YB+18)}' fill='none' stroke='${f.acc}' stroke-width='3' opacity='.85'/>
  <image href='file://${D}/${f.img}' x='${X0}' y='${YT}' width='${X1-X0}' height='${YB-YT}' preserveAspectRatio='${f.par||'xMidYMid'} slice' clip-path='url(#a)' filter='url(#grade)'/>
  <path d='${archPath(X0,X1,YT,YB)}' fill='url(#v)'/>
  <path d='${archPath(X0,X1,YT,YB)}' fill='none' stroke='${CREAM}' stroke-width='6'/>
  ${bulbs(X0,X1,YT,YB,9)}
  <circle cx='${f.ix||846}' cy='${f.iy||800}' r='132' fill='${CREAM}' style='filter:drop-shadow(0 12px 18px rgba(0,0,0,.5))'/>
  <circle cx='${f.ix||846}' cy='${f.iy||800}' r='124' fill='none' stroke='${f.acc}' stroke-width='4'/>
  <image href='file://${D}/${f.img2}' x='${(f.ix||846)-118}' y='${(f.iy||800)-118}' width='236' height='236' preserveAspectRatio='${f.par2||'xMidYMid'} slice' clip-path='url(#c)' filter='url(#grade)'/>
 </svg>
 <div class='blk'><div class='title'>${f.t}</div>
 <div class='meta'>${f.yr} &nbsp;★&nbsp; DIR. ${f.dir.toUpperCase()}</div>
 <div class='line'>${f.line}</div></div>
 <div class='stars'>★ ★ ★</div>
 <div class='grain'></div></body></html>`;
 fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
 await p.screenshot({path:`${D}/out/0${i+2}_${f.slug}.jpg`,type:'jpeg',quality:93});}
// COVER
const c=C.cover;
const html=`<html><head><style>${CSS}${grain}*{margin:0;padding:0}
 body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#07090D;text-align:center}
 .img{position:absolute;left:${c.left}px;top:${c.top}px;width:${c.w}px;height:auto;filter:saturate(1.06) contrast(1.05) brightness(1.02)}
 .fade{position:absolute;left:0;right:0;top:${c.top-2}px;height:420px;background:linear-gradient(180deg,#07090D 0%,rgba(7,9,13,.85) 35%,rgba(7,9,13,0))}
 .bot{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(7,9,13,.75),rgba(7,9,13,0))}
 .vig{position:absolute;inset:0;background:radial-gradient(ellipse 90% 80% at 55% 60%,transparent 55%,rgba(0,0,0,.55))}
 .k{position:absolute;top:96px;width:100%;font:700 22px Syne;letter-spacing:.55em;padding-left:.55em;color:${CREAM};opacity:.9}
 .s{position:absolute;top:150px;width:100%;font:400 112px/1 Rouge;color:${CREAM};text-shadow:0 0 24px rgba(0,0,0,.6)}
 .h{position:absolute;top:262px;width:100%;font:400 196px/1 Rye;color:${c.ink};letter-spacing:.02em;padding-left:.02em;
  text-shadow:0 0 34px ${c.ink}55,6px 7px 0 #0B2E33}
 .orn{position:absolute;top:492px;width:100%;font:400 22px Rye;letter-spacing:.7em;padding-left:.7em;color:${c.ink};opacity:.9}
 .sub{position:absolute;bottom:70px;width:100%;font:400 italic 38px Lora;color:${CREAM};text-shadow:0 2px 12px rgba(0,0,0,.8)}
</style></head><body><img class='img' src='file://${D}/${c.img}'><div class='fade'></div><div class='bot'></div><div class='vig'></div>
<div class='k'>MOVIES THAT FEEL LIKE</div><div class='s'>running away with the</div><div class='h'>CIRCUS</div>
<div class='sub'>${c.sub}</div><div class='grain'></div></body></html>`;
fs.writeFileSync(D+'/_c.html',html);await p.goto('file://'+D+'/_c.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);
await p.screenshot({path:`${D}/out/01_cover.jpg`,type:'jpeg',quality:93});
await b.close();})();
