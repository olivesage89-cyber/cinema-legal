// Vivian FORMAT D "notes-app checklist" slides. node render_notes.js DIR  (DIR/notes.json:
// {title, items:[text...], slides:[{img, x, y, done:N, sub:{i, lines:[..]}, pos:"bottom"|"top"}]})
const { chromium } = require('playwright'); const fs=require('fs'), path=require('path');
const D=path.resolve(process.argv[2]); const N=JSON.parse(fs.readFileSync(D+'/notes.json'));
const F=(process.env.ENGINE||path.resolve(__dirname,'..'))+'/node_modules/@fontsource/'; const ff=(f,w)=>`@font-face{font-family:'${f}';font-weight:${w};src:url(file://${F}${f}/files/${f}-latin-${w}-normal.woff2)}`;
const css=`${ff('inter',400)}${ff('inter',500)}${ff('inter',600)}${ff('inter',700)}*{margin:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#000;font-family:inter,'Noto Color Emoji'}
.bg{position:absolute;inset:0;background-size:cover}
.card{position:absolute;left:64px;width:720px;background:rgba(255,255,255,.97);border-radius:38px;padding:26px 40px 34px;box-shadow:0 18px 50px rgba(0,0,0,.35);color:#1c1c1e}
.top{display:flex;justify-content:space-between;color:#e0a800;font-size:28px;font-weight:500;margin-bottom:14px}
.ttl{font-size:44px;font-weight:700;line-height:1.15;margin-bottom:18px;letter-spacing:-.5px}
.it{display:flex;align-items:flex-start;gap:20px;font-size:35px;line-height:1.3;margin:12px 0}
.c{flex:none;width:40px;height:40px;border-radius:50%;border:3px solid #c7c7cc;margin-top:3px;display:flex;align-items:center;justify-content:center}
.c.on{background:#f5b800;border-color:#f5b800}.c.on:after{content:'';width:11px;height:20px;border:solid #fff;border-width:0 4px 4px 0;transform:translateY(-3px) rotate(45deg)}
.sub{font-size:31px;color:#3a3a3c;line-height:1.38;margin:2px 0 4px 60px}.sub div:before{content:'– ';color:#8e8e93}`;
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});fs.mkdirSync(D+'/out',{recursive:true});
for(const [k,s] of N.slides.entries()){
 const items=N.items.map((t,i)=>`<div class="it"><div class="c ${i<s.done?'on':''}"></div><div>${t}</div></div>`+(s.sub&&s.sub.i==i?`<div class="sub">${s.sub.lines.map(l=>`<div>${l}</div>`).join('')}</div>`:'')).join('');
 const pos=s.pos=='top'?`top:${s.off||70}px`:`bottom:${s.off||70}px`;
 const h=`<div class="bg" style="background-image:url(file://${D}/${s.img});background-position:${s.x||50}% ${s.y||50}%"></div><div class="card" style="transform:scale(${s.sc||0.9});transform-origin:${s.pos=="top"?"top":"bottom"} left;${pos}${s.left!=null?';left:'+s.left+'px':''}"><div class="top"><span>‹ Notes</span><span>Done</span></div><div class="ttl">${N.title}</div>${items}</div>`;
 fs.writeFileSync(D+'/_n.html',`<html><head><style>${css}</style></head><body>${h}</body></html>`);await p.goto('file://'+D+'/_n.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 await p.screenshot({path:`${D}/out/${String(k+1).padStart(2,'0')}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
