// Vivian iMessage-style text conversation slides. Usage: node render_texts.js DIR (DIR/texts.json:
// {contact:"bestie 🎀", initial:"B", cover:{img, text, ty}, chats:[[["ts","Today 11:48 PM"],["th","their msg"],["me","her msg"],["rd","Read 11:53 PM"],["pic","shot.jpg" (image in DIR, sent as a photo)]], ...]})
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const D=path.resolve(process.argv[2]); const T=JSON.parse(fs.readFileSync(D+'/texts.json'));
const F=(process.env.ENGINE||path.resolve(__dirname,'..'))+'/node_modules/@fontsource/'; const ff=(f,w)=>`@font-face{font-family:'${f}';font-weight:${w};src:url(file://${F}${f}/files/${f}-latin-${w}-normal.woff2)}`;
const css=`${ff('inter',400)}${ff('inter',500)}${ff('inter',600)}${ff('montserrat',600)}*{margin:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#000;font-family:inter,'Noto Color Emoji';color:#fff}
.hdr{height:230px;background:#1c1c1e;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:22px;border-bottom:1px solid #2c2c2e}
.av{width:104px;height:104px;border-radius:50%;background:linear-gradient(180deg,#a5a5ab,#7d7d83);display:flex;align-items:center;justify-content:center;font-size:44px;font-weight:600}
.nm{font-size:28px;margin-top:10px;font-weight:500}.back{position:absolute;left:30px;top:120px;font-size:56px;color:#0a84ff;font-weight:300}
.chat{padding:30px 34px;display:flex;flex-direction:column;gap:12px}.b{max-width:700px;font-size:40px;line-height:1.28;padding:20px 30px;border-radius:44px}
.me{align-self:flex-end;background:#0a84ff;border-bottom-right-radius:12px}.th{align-self:flex-start;background:#262628;border-bottom-left-radius:12px}
.ts{align-self:center;color:#8e8e93;font-size:26px;margin:10px 0}.rd{align-self:flex-end;color:#8e8e93;font-size:24px;margin-top:-4px}.pic{align-self:flex-end}.pic img{width:300px;border-radius:30px;display:block;border:1px solid #2c2c2e}
.cov{position:absolute;inset:0}.cov img{width:100%;height:100%;object-fit:cover}.ct{position:absolute;left:80px;right:80px;text-align:center;font-family:montserrat,'Noto Color Emoji';font-weight:600;font-size:56px;line-height:1.2;text-shadow:0 2px 12px rgba(0,0,0,.6)}`;
const hdr=`<div class="back">‹</div><div class="hdr"><div class="av">${T.initial||'B'}</div><div class="nm">${T.contact} ›</div></div>`;
const chat=(m)=>hdr+`<div class="chat">${m.map(([w,t])=>w=='ts'?`<div class="ts">${t}</div>`:w=='rd'?`<div class="rd">${t}</div>`:w=='pic'?`<div class="pic"><img src="file://${D}/${t}"></div>`:`<div class="b ${w}">${t}</div>`).join('')}</div>`;
const S=[]; if(T.cover) S.push(`<div class="cov"><img src="file://${D}/${T.cover.img}"><div class="ct" style="top:${T.cover.ty||56}%">${T.cover.text}</div></div>`); T.chats.forEach(c=>S.push(chat(c)));
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
for(const [i,h] of S.entries()){fs.writeFileSync(D+'/_t.html',`<html><head><style>${css}</style></head><body>${h}</body></html>`);await p.goto('file://'+D+'/_t.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:`${D}/out/${String(i+1).padStart(2,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
