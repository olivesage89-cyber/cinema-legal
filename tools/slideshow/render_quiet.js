// QUIET FILM STRIP (moss page): big rounded still + 3 small rounded stills, Nº kicker, Fraunces title, hairline, italic line, year | where
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('Fr','fraunces',300)+ff('Fr','fraunces',300,'italic')+ff('Fg','figtree',500)+`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:${P.page};color:#F3F1E8;font-family:Fr;overflow:hidden;position:relative}
.g{position:absolute;inset:0;background:radial-gradient(ellipse 80% 50% at 50% 0%,rgba(214,235,200,.07),transparent 70%)}
.big{position:absolute;left:60px;top:160px;width:960px;height:610px;border-radius:30px;background-size:cover}
.sm{position:absolute;top:790px;width:308px;height:205px;border-radius:22px;background-size:cover}
.k{position:absolute;top:68px;width:100%;text-align:center;font:500 25px Fg;letter-spacing:.5em;color:${P.ink};padding-left:.5em}
.t{position:absolute;top:1035px;width:100%;text-align:center;font:300 78px/1.04 Fr;letter-spacing:-.01em}
.r{position:absolute;left:470px;width:140px;height:1px;background:${P.ink};opacity:.6}
.l{position:absolute;width:100%;text-align:center;font:300 italic 40px/1.3 Fr}
.y{position:absolute;width:100%;text-align:center;font:500 25px Fg;letter-spacing:.32em;color:${P.ink};padding-left:.32em}
.gr{position:absolute;inset:0;opacity:.07;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of P.films.entries()){const im=f.slide;const two=f.t.includes('<br>');
const tH=two?126:82;const ly=1035+tH+34;
const bg=(s)=>`background-image:url(file://${D}/${s[0]});background-position:${s[1]}% ${s[2]??50}%`;
const html=`<html><head><style>${css}</style></head><body><div class=g></div>
<div class=k>Nº 0${i+1} — 05</div>
<div class=big style="${bg(im[0])}"></div>
${[1,2,3].map((k,j)=>`<div class=sm style="left:${60+j*326}px;${bg(im[k])}"></div>`).join('')}
<div class=t style="font-size:${two?60:78}px">${f.t}</div>
<div class=r style="top:${ly}px"></div>
<div class=l style="top:${ly+28}px">${f.line}</div>
<div class=y style="top:${ly+92}px">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div><div class=gr></div></body></html>`;
fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:`${D}/out/0${i+1}.png`});}
await b.close();})();
