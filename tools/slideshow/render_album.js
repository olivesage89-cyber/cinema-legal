// PHOTO ALBUM PAGE (warm paper): big tilted white-bordered print + smaller overlapping print, washi tape,
// Courier Nº kicker, Gloock title, Caveat line in the film's accent, Courier year | where
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('Gl','gloock',400)+ff('Cv','caveat',700)+ff('Cp','courier-prime',700)+`*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#EFE6D6;color:#2A211C;overflow:hidden;position:relative}
.v{position:absolute;inset:0;background:radial-gradient(ellipse 75% 65% at 50% 45%,transparent 55%,rgba(150,120,85,.28))}
.pr{position:absolute;background:#FBF8F1;padding:18px;box-shadow:0 14px 34px rgba(70,50,30,.32),0 2px 5px rgba(70,50,30,.2)}
.pr div{width:100%;height:100%;background-size:cover}
.tp{position:absolute;opacity:.8;height:46px}
.k{position:absolute;top:62px;width:100%;text-align:center;font:700 24px Cp;letter-spacing:.42em;padding-left:.42em}
.t{position:absolute;left:70px;width:600px;font:400 74px/1.02 Gl}
.l{position:absolute;left:70px;width:560px;font:700 50px/1.05 Cv;transform:rotate(-1.5deg);transform-origin:left}
.y{position:absolute;left:72px;font:700 22px Cp;letter-spacing:.28em}
.gr{position:absolute;inset:0;opacity:.09;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='.85' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>")}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,f] of P.films.entries()){const im=f.slide;const ac=f.accent;const two=f.t.includes('<br>');
const bg=(s)=>`background-image:url(file://${D}/${s[0]});background-position:${s[1]}% ${s[2]??50}%`;
const ty=two?850:880;
const html=`<html><head><style>${css}</style></head><body><div class=v></div>
<div class=k style="color:${ac}">Nº 0${i+1} / 05</div>
<div class=pr style="left:58px;top:140px;width:960px;height:560px;transform:rotate(-1.8deg)"><div style="${bg(im[0])}"></div></div>
<div class=tp style="left:96px;top:118px;width:190px;background:${ac};transform:rotate(-16deg)"></div>
<div class=tp style="left:820px;top:124px;width:170px;background:#E3D3B4;transform:rotate(12deg)"></div>
<div class=pr style="left:640px;top:${two?770:780}px;width:380px;height:440px;transform:rotate(3.2deg)"><div style="${bg(im[1])}"></div></div>
<div class=tp style="left:760px;top:${two?752:762}px;width:140px;background:${ac};transform:rotate(-6deg)"></div>
<div class=t style="top:${ty}px;font-size:${two?52:74}px">${f.t}</div>
<div class=l style="top:${ty+(two?140:104)}px;color:${ac}">${f.line}</div>
<div class=y style="top:${ty+(two?290:250)}px">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div><div class=gr></div></body></html>`;
fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);
await p.screenshot({path:`${D}/out/0${i+1}.png`});}
await b.close();})();
