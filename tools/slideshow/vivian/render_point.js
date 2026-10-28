// Vivian "pointing at a poster" slides. Usage: node render_point.js DIR  (DIR/point.json: {slides:[{bg, poster|null, x, y, rot, text, ty}]})
// bg = 1080x1350 photo of Vivian pointing up (empty space where she points); poster = TMDB poster jpg; x,y = poster top-left (270x405 card); ty = text centre %.
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const D=path.resolve(process.argv[2]); const S=JSON.parse(fs.readFileSync(D+'/point.json')).slides;
const F=(process.env.ENGINE||path.resolve(__dirname,'..'))+'/node_modules/@fontsource/'; const ff=(f,w)=>`@font-face{font-family:'${f}';font-weight:${w};src:url(file://${F}${f}/files/${f}-latin-${w}-normal.woff2)}`;
const css=`${ff('montserrat',600)}*{margin:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;font-family:montserrat,'Noto Color Emoji'}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.po{position:absolute;width:270px;height:405px;border:7px solid #fff;box-shadow:0 14px 30px rgba(0,0,0,.35);background:#000}.po img{width:100%;height:100%;object-fit:cover;display:block}
.t{position:absolute;left:90px;right:90px;text-align:center;color:#fff;font-weight:600;font-size:50px;line-height:1.25;text-shadow:0 0 3px rgba(0,0,0,.85),0 2px 12px rgba(0,0,0,.55)}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,s] of S.entries()){fs.writeFileSync(D+'/_r.html',`<html><head><style>${css}</style></head><body><img class="bg" src="file://${D}/${s.bg}">${s.poster?`<div class="po" style="left:${s.x}px;top:${s.y}px;transform:rotate(${s.rot||0}deg)"><img src="file://${D}/${s.poster}"></div>`:''}<div class="t" style="top:${s.ty}%;transform:translateY(-50%)">${s.text}</div></body></html>`);
await p.goto('file://'+D+'/_r.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:`${D}/out/${String(i+1).padStart(2,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
