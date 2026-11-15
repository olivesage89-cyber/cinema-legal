const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const D=path.resolve(process.argv[2]);const P=JSON.parse(fs.readFileSync(D+'/plan.json'));
const F=path.resolve(__dirname,'node_modules/@fontsource')+'/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('Pf','playfair-display',800)+ff('Pf','playfair-display',400,'italic')+ff('Mo','montserrat',600)+ff('Dm','dm-mono',500)+
`*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;text-align:center}`;
const pick={0:['gbh_0.jpg',50,50],1:['ma_2.jpg',40,50],2:['oz_24.jpg',52,40],3:['uc_1.jpg',58,35],4:['pv_10.jpg',50,45]};
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of P.films.entries()){const [img,x,y]=pick[i];
const chips=f.chips.map((c,k)=>`<div style="position:absolute;left:${60+k*198}px;top:1088px;width:168px;height:190px;border-radius:14px;background:#FFFDF9;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.13)"><div style="height:142px;background:${c}"></div><div style="font:500 20px/48px Dm;letter-spacing:.05em;color:${f.ink}">${c}</div></div>`).join('');
const html=`<html><head><style>${css}</style></head><body>
<div style="position:absolute;inset:0;background:${f.page}"></div>
<div style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%)"></div>
<div style="position:absolute;top:58px;width:100%;font:600 22px Mo;letter-spacing:.45em;padding-left:.45em;color:${f.acc}">SWATCH NO.0${i+1} &nbsp;·&nbsp; 05</div>
<div style="position:absolute;top:92px;width:100%;height:100px;display:flex;align-items:center;justify-content:center"><div style="font:800 ${Math.round((f.fs||90)*0.95)}px/1 Pf;color:${f.ink}">${f.t}</div></div>
<div style="position:absolute;top:198px;width:100%;font:500 23px Dm;letter-spacing:.24em;padding-left:.24em;color:${f.ink};opacity:.72">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div>
<div style="position:absolute;top:236px;width:100%;font:italic 400 34px/1.1 Pf;color:${f.ink}">${f.line}</div>
<div style="position:absolute;left:60px;top:300px;width:960px;height:756px;border-radius:28px;border:8px solid #FFFDF9;box-shadow:0 18px 40px rgba(0,0,0,.18);background:url(file://${D}/${img}) ${x}% ${y}%/cover"></div>
${chips}
<div style="position:absolute;inset:0;opacity:.08;background-image:url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E&quot;)"></div>
</body></html>`;
fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
await p.screenshot({path:`${D}/ig/0${i+1}_${img.split('_')[0]}.jpg`,type:'jpeg',quality:93});}
await b.close();})();
