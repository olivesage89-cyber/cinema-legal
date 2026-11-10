// RINKSIDE PAGE (deep ink-navy): Inter Nº kicker + Anton caps title, big rounded still w/ ice hairline,
// 2 small rounded stills, Cormorant italic line in the film's accent, Inter year | where
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('An','anton',400)+ff('Co','cormorant-garamond',600,'italic')+ff('In','inter',500)+ff('In','inter',600)+`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:radial-gradient(ellipse 120% 50% at 50% 0%,#1F3150,#0B0F1A 70%);color:#F4F7FB;overflow:hidden;position:relative;text-align:center}
.ph{position:absolute;border-radius:26px;background-size:cover;box-shadow:0 0 0 3px #0B0F1A,0 0 0 5px rgba(159,216,255,.45),0 18px 40px rgba(0,0,0,.45)}
.k{position:absolute;top:62px;width:100%;font:600 22px In;letter-spacing:.5em;padding-left:.5em}
.t{position:absolute;top:104px;width:100%;font:400 74px/1.02 An;text-transform:uppercase;letter-spacing:.015em}
.l{position:absolute;width:100%;font:italic 600 50px/1.05 Co}
.y{position:absolute;width:100%;font:500 21px In;letter-spacing:.32em;padding-left:.32em;color:#C9D3E2}
.gr{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,f] of P.films.entries()){const im=f.slide;const ac=f.accent;const two=f.t.includes('<br>');
const bg=(s)=>`background-image:url(file://${D}/${s[0]});background-position:${s[1]}% ${s[2]??50}%`;
const t0=two?250:200;
const html=`<html><head><style>${css}</style></head><body>
<div class=k style="color:${ac}">Nº 0${i+1} / 05</div>
<div class=t style="font-size:${two?60:84}px">${f.t}</div>
<div class=ph style="left:40px;top:${t0}px;width:1000px;height:${two?520:560}px;${bg(im[0])}"></div>
<div class=ph style="left:40px;top:${t0+(two?545:585)}px;width:488px;height:290px;${bg(im[1])}"></div>
<div class=ph style="left:552px;top:${t0+(two?545:585)}px;width:488px;height:290px;${bg(im[2])}"></div>
<div class=l style="top:${t0+(two?545:585)+290+62}px;color:${ac}">${f.line}</div>
<div class=y style="top:${t0+(two?545:585)+290+142}px">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div><div class=gr></div></body></html>`;
fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:`${D}/out/0${i+1}.png`});}
await b.close();})();
