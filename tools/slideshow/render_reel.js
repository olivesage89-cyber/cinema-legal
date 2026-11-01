// REEL inside slides: dark film-base page w/ sprocket edges, big still + 3 small, Limelight title. node render_reel.js DIR
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));
const F='file://'+__dirname+'/node_modules/@fontsource/';
const ff=(fam,pkg,w,s='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${s};src:url(${F}${pkg}/files/${pkg}-latin-${w}-${s}.woff2)}`;
const INK=P.ink, CREAM='#F6E9D2';
const css=ff('Lime','limelight',400)+ff('Jos','josefin-sans',600)+ff('Cor','cormorant-garamond',500,'italic')+`
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#15100c;position:relative;overflow:hidden;color:${CREAM};text-align:center}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse 70% 45% at 50% 42%,rgba(110,72,40,.35),rgba(0,0,0,0) 70%)}
.sp{position:absolute;top:0;bottom:0;width:62px;background:repeating-linear-gradient(180deg,transparent 0 18px,#000 18px 60px,transparent 60px 78px);}
.sp:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,#15100c 0 16px,transparent 16px 46px,#15100c 46px)}
.k{position:absolute;top:84px;width:100%;font:600 26px Jos;letter-spacing:.5em;padding-left:.5em;color:${INK}}
.t{position:absolute;top:128px;width:100%;font:400 80px/1.05 Lime;text-shadow:0 0 18px rgba(255,220,170,.22)}
.big{position:absolute;left:80px;top:286px;width:920px;height:518px;background-size:cover;background-position:center;box-shadow:0 0 0 2px #2a1f16}
.row{position:absolute;left:80px;top:828px;width:920px;display:flex;gap:16px}
.row div{flex:1;height:168px;background-size:cover;background-position:center;filter:brightness(.92)}
.l{position:absolute;top:1040px;left:110px;right:110px;font:italic 500 54px/1.2 Cor;text-wrap:balance}
.y{position:absolute;top:1218px;width:100%;font:600 25px Jos;letter-spacing:.32em;padding-left:.32em;color:${INK}}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of P.films.entries()){const it=f.slide||f.items;const u=x=>`url(file://${D}/${x})`;
 const two=f.t.includes('<br>');
 const html=`<html><head><style>${css}</style></head><body><div class=glow></div><div class=sp style='left:0'></div><div class=sp style='right:0'></div>
 <div class=k>REEL 0${i+1} &nbsp;/&nbsp; 0${P.films.length}</div><div class=t style='${two?"font-size:62px;top:124px":""}'>${f.t}</div>
 <div class=big style="background-image:${u(it[0])}"></div><div class=row><div style="background-image:${u(it[1])}"></div><div style="background-image:${u(it[2])}"></div><div style="background-image:${u(it[3])}"></div></div>
 <div class=l>${f.line}</div><div class=y>${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div></body></html>`;
 fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 await p.screenshot({path:`${D}/ig/raw_0${i+1}.png`});}
await b.close();})();
