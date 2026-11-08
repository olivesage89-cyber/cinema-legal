// SPELLBOOK PAGE slides: midnight sparkle page, big still in a pink double hairline frame w/ corner stars,
// 2 small stills below, spell kicker, Cormorant title, Josefin dir·year|where, italic line, star progress.
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=process.argv[2];const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
const F='file://'+path.join(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const INK='#FFC2DD';
let sp='';let r=7;const rnd=()=>{r=(r*9301+49297)%233280;return r/233280};
for(let i=0;i<120;i++){const x=rnd()*1080,y=rnd()*1350;const big=rnd();if((x>110&&x<970)&&y>40&&y<1310)continue;sp+=`<div style="position:absolute;left:${x}px;top:${y}px;width:${big>.8?5:3}px;height:${big>.8?5:3}px;border-radius:50%;background:rgba(255,236,246,${.3+rnd()*.6})"></div>`}
const css=ff('Cg','cormorant-garamond',600)+ff('Cg','cormorant-garamond',500,'italic')+ff('Js','josefin-sans',600)+ff('Js','josefin-sans',400)+ff('Cz','cinzel-decorative',700)+ff('Pa','parisienne',400)+
`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:radial-gradient(ellipse 80% 60% at 50% 30%,#1B1F4A,#0F1230 60%,#0A0C22);color:#F7F1EC;position:relative;overflow:hidden;font-family:Cg}
.k{position:absolute;top:58px;width:100%;text-align:center;font:600 22px Js;letter-spacing:.5em;color:${INK};padding-left:.5em}
.sc{position:absolute;top:92px;width:100%;text-align:center;font:400 46px Pa;color:rgba(255,194,221,.85)}
.big{position:absolute;left:70px;top:168px;width:940px;height:560px;background-size:cover;border-radius:6px}
.fr{position:absolute;left:56px;top:154px;width:968px;height:588px;border:1.5px solid rgba(255,194,221,.75);border-radius:10px}
.fr2{position:absolute;left:48px;top:146px;width:984px;height:604px;border:1px solid rgba(255,194,221,.3);border-radius:14px}
.st{position:absolute;color:${INK};font-size:26px;line-height:1}
.sm{position:absolute;top:762px;width:460px;height:250px;background-size:cover;border-radius:6px;border:1.5px solid rgba(255,194,221,.55)}
.t{position:absolute;top:1040px;width:100%;text-align:center;font:600 74px/1 Cg;letter-spacing:.005em}
.m{position:absolute;top:1135px;width:100%;text-align:center;font:600 21px Js;letter-spacing:.32em;color:${INK};padding-left:.32em}
.l{position:absolute;top:1180px;width:100%;text-align:center;font:500 italic 38px/1.2 Cg;color:#EFE6EE}
.p{position:absolute;top:1268px;width:100%;text-align:center;font-size:20px;letter-spacing:14px;color:rgba(255,194,221,.4)}
.p b{color:${INK};font-weight:400}`;
(async()=>{const b=await chromium.launch();const pg=await b.newPage({viewport:{width:1080,height:1350}});
fs.mkdirSync(D+'/out',{recursive:true});
for(let i=0;i<S.films.length;i++){const f=S.films[i];const u=x=>`url(file://${D}/${x})`;
 const prog=S.films.map((_,j)=>j==i?'<b>✦</b>':'✦').join('');
 const h=`<html><head><style>${css}</style></head><body>${sp}
 <div class=k>SPELL Nº 0${i+1} / 05</div><div class=sc>believe in magic</div>
 <div class=fr2></div><div class=fr></div><div class=big style="background-image:${u(f.big)};background-position:${f.bx||50}% ${f.by||50}%"></div>
 <div class=st style="left:42px;top:136px">✦</div><div class=st style="right:42px;top:136px">✦</div><div class=st style="left:42px;top:728px">✦</div><div class=st style="right:42px;top:728px">✦</div>
 <div class=sm style="left:70px;background-image:${u(f.s1)};background-position:${f.s1x||50}% ${f.s1y||50}%"></div>
 <div class=sm style="left:550px;background-image:${u(f.s2)};background-position:${f.s2x||50}% ${f.s2y||50}%"></div>
 <div class=t style="font-size:${f.fs||74}px">${f.t}</div><div class=m>${f.meta}</div><div class=l>${f.line}</div><div class=p>${prog}</div></body></html>`;
 fs.writeFileSync(D+'/_s.html',h);await pg.goto('file://'+D+'/_s.html');await pg.evaluate(()=>document.fonts.ready);await pg.waitForTimeout(300);
 await pg.screenshot({path:`${D}/out/0${i+1}.png`});}
await b.close();})();
