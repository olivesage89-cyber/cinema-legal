// ILLUMINATED PAGE slides (1080x1350): forest page, gothic arch window w/ gold tracery, Cinzel Decorative title.
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const CSS=ff('Cd','cinzel-decorative',700)+ff('Cd','cinzel-decorative',900)+ff('Cz','cinzel',600)+ff('Fe','im-fell-english',400,'italic')+ff('Fe','im-fell-english',400);
const INK=P.ink,GOLD=P.gold,IV='#F4EAD5';const R=['I','II','III','IV','V'];
function arch(x0,x1,ys,yb,pad){x0-=pad;x1+=pad;yb+=pad;const w=x1-x0,r=0.7*w;const cl=x0+r;const h=Math.sqrt(r*r-((x0+x1)/2-cl)**2);
 return `M${x0},${yb} L${x0},${ys} A${r},${r} 0 0 1 ${(x0+x1)/2},${ys-h} A${r},${r} 0 0 1 ${x1},${ys} L${x1},${yb} Z`;}
const X0=170,X1=910,YS=600,YB=900;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of P.films.entries()){const s=S[i];const t=f.t.replace('<br>',' ');
 const html=`<html><head><style>${CSS}*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;background:radial-gradient(ellipse 80% 60% at 50% 40%,#1E3428,#0B140F 75%,#070D0A);color:${IV};text-align:center;position:relative}
 .g{position:absolute;inset:0;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)' opacity='.09'/></svg>");mix-blend-mode:overlay}
 .k{position:absolute;top:40px;width:100%;font:600 21px Cz;letter-spacing:.5em;padding-left:.5em;color:${GOLD};opacity:.85}
 .c{position:absolute;font:400 34px Fe;color:${GOLD};opacity:.7}
 </style></head><body><div class='g'></div>
 <div class='k'>AN OLD LEGEND</div><div class='c' style='left:44px;top:30px'>❦</div><div class='c' style='right:44px;top:30px;transform:scaleX(-1)'>❦</div>
 <svg width='1080' height='1350' style='position:absolute;left:0;top:0'><defs><clipPath id='a'><path d='${arch(X0,X1,YS,YB,0)}'/></clipPath>
 <filter id='gr'><feColorMatrix type='saturate' values='1.04'/></filter></defs>
 <image href='file://${D}/${s.img}' x='${X0}' y='${YS-560}' width='${X1-X0}' height='${YB-YS+560}' preserveAspectRatio='xMidYMid slice' clip-path='url(#a)' style='transform-origin:0 0' id='im'/>
 <path d='${arch(X0,X1,YS,YB,7)}' fill='none' stroke='${GOLD}' stroke-width='5'/><path d='${arch(X0,X1,YS,YB,20)}' fill='none' stroke='${GOLD}' stroke-width='2' opacity='.6'/></svg>
 <div style='position:absolute;top:952px;width:100%;font:600 22px Cz;letter-spacing:.5em;padding-left:.5em;color:${INK}'>✦ &nbsp;TALE ${R[i]} OF V&nbsp; ✦</div>
 <div style='position:absolute;top:992px;width:100%;height:150px;display:flex;align-items:center;justify-content:center'><div style='font:700 ${s.fs}px/1.08 Cd;max-width:980px'><span style='color:${INK};font-weight:900;font-size:1.22em'>${f.t[0]}</span>${f.t.slice(1)}</div></div>
 <div style='position:absolute;top:1150px;width:100%;font:400 italic 33px Fe;opacity:.9'>${f.line}</div>
 <div style='position:absolute;top:1205px;width:100%;display:flex;justify-content:center;align-items:center;gap:16px;color:${GOLD}'><div style='width:150px;height:1.5px;background:linear-gradient(90deg,transparent,${GOLD})'></div><div style='font:400 28px Fe'>❦</div><div style='width:150px;height:1.5px;background:linear-gradient(270deg,transparent,${GOLD})'></div></div>
 <div style='position:absolute;top:1255px;width:100%;font:600 21px Cz;letter-spacing:.3em;padding-left:.3em;color:${GOLD}'>${f.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()} &nbsp;·&nbsp; ${f.where.toUpperCase()}</div>
 </body></html>`;
 fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);
 if(s.x!==undefined) await p.evaluate(([x])=>{const im=document.getElementById('im');im.setAttribute('preserveAspectRatio',`xMinYMid slice`);},[s.x]);
 await p.waitForTimeout(200);await p.screenshot({path:`${D}/ig/0${i+1}_${s.slug}.png`});}
await b.close();})();
