const {chromium}=require('playwright');const fs=require('fs');
const D=process.argv[2];const F=__dirname+'/node_modules/@fontsource/';
const ff=(f,p,w,s='normal')=>`@font-face{font-family:${f};font-weight:${w};font-style:${s};src:url(file://${F}${p}/files/${p}-latin-${w}-${s}.woff2)}`;
const css=ff('Bod','bodoni-moda',600)+ff('Bod','bodoni-moda',500,'italic')+ff('Ital','italianno',400)+ff('Int','inter',500)+ff('Int','inter',600)+`
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#F1EADC;position:relative;overflow:hidden;font-family:Bod;color:#26211c}
body:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.25),rgba(120,95,60,.10));pointer-events:none}
.mark{position:absolute;top:44px;width:100%;text-align:center;font:600 19px Int;letter-spacing:.5em;color:#8b7f6e;padding-left:.5em}
.big{position:absolute;left:70px;top:100px;width:940px;height:529px;background-size:cover;background-position:center}
.row{position:absolute;left:70px;top:647px;width:940px;display:flex;gap:18px}
.row div{flex:1;height:170px;background-size:cover;background-position:center}
.t{position:absolute;top:836px;display:flex;flex-direction:column;justify-content:flex-end;height:140px;width:100%;text-align:center;font-weight:600;font-size:76px;letter-spacing:-.01em;line-height:1}
.t span{font-style:italic;font-weight:500;font-size:44px;color:#8b7f6e}
.rule{position:absolute;top:1010px;left:50%;width:120px;margin-left:-60px;height:2px}
.d{position:absolute;top:1046px;left:120px;right:120px;text-align:center;font-style:italic;font-weight:500;font-size:40px;line-height:1.3;color:#4a4036}
.n{position:absolute;bottom:48px;width:100%;text-align:center;font:500 20px Int;letter-spacing:.4em;color:#9a8e7c;padding-left:.4em}
.grain{position:absolute;inset:0;opacity:.10;background:url(file://${D}/grain.png);mix-blend-mode:multiply}`;
const S=JSON.parse(fs.readFileSync(D+'/slides.json'));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,s] of S.entries()){
 const fs2=s.fs||76;
 const html=`<html><head><style>${css}</style></head><body><div class=mark>FEELS LIKE A MEMORY</div>
 <div class=big style="background-image:url(file://${D}/sl/${s.k}0.jpg)"></div>
 <div class=row>${[1,2,3].map(n=>`<div style="background-image:url(file://${D}/sl/${s.k}${n}.jpg)"></div>`).join('')}</div>
 <div class=t style="color:${s.c};font-size:${fs2}px"><div>${s.t} <span>(${s.yr})</span></div></div><div class=rule style="background:${s.c}"></div>
 <div class=d>${s.d}</div><div class=n>STREAMING ON ${s.w.toUpperCase()}</div><div class=grain></div></body></html>`;
 fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 await p.screenshot({path:`${D}/out/0${i+1}_${s.k}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
