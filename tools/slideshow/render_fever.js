const {chromium}=require('playwright');const fs=require('fs');const D=process.argv[2];
const F=__dirname+'/node_modules/@fontsource/';
const ff=(fam,pkg,w,st='normal')=>`@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css=ff('Arc','archivo-black',400)+ff('DMS','dm-serif-display',400,'italic')+ff('Int','inter',500)+ff('Int','inter',600)+ff('Cor','cormorant-garamond',500,'italic');
const films=[
 {f:'01_everything_everywhere',t:'Everything Everywhere<br>All at Once',fs:66,yr:'2022',dir:'Daniels',w:'rent on prime video',ac:'#D9A8FF',im:['e1.jpg','e2.jpg','e3.jpg'],y:[50,55,40],l:'every version of you, all at once — and a bagel at the end of it'},
 {f:'02_poor_things',t:'Poor Things',fs:92,yr:'2023',dir:'Yorgos Lanthimos',w:'hulu',ac:'#9FD8FF',im:['p1.jpg','p4.jpg','p2.jpg'],y:[45,50,40],l:'a candy-coloured world, seen for the very first time'},
 {f:'03_inception',t:'Inception',fs:92,yr:'2010',dir:'Christopher Nolan',w:'rent on prime video',ac:'#EFC98E',im:['i2.jpg','i1.jpg','i3.jpg'],y:[50,55,50],l:'a dream inside a dream — and the top is still spinning'},
 {f:'04_the_fall',t:'The Fall',fs:92,yr:'2006',dir:'Tarsem Singh',w:'mubi',ac:'#FF6B5C',im:['f1.jpg','f3.jpg','f4.jpg'],y:[50,40,50],l:'a story told in a hospital bed that becomes the whole world'},
 {f:'05_the_truman_show',t:'The Truman Show',fs:92,yr:'1998',dir:'Peter Weir',w:'rent on prime video',ac:'#FFE39A',im:['t1.jpg','t3.jpg','t4.jpg'],y:[40,45,50],l:'the sky is painted, the stairs go up — and he walks out anyway'}];
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});
for(const [i,f] of films.entries()){
 const strip=(im,y,h)=>`<div style="height:${h}px;background:url(file://${D}/${im}) center ${y}%/cover;filter:saturate(1.08) contrast(1.04)"></div>`;
 const html=`<html><head><style>${css}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#07040B;overflow:hidden;position:relative}
 .ab{text-shadow:-3px 0 0 rgba(255,60,170,.5),3px 0 0 rgba(60,235,255,.45)}</style></head><body>
 ${strip(f.im[0],f.y[0],400)}${strip(f.im[1],f.y[1],300)}
 <div style="height:350px;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;position:relative">
  <div style="position:absolute;top:24px;left:46px;font:600 19px Int;letter-spacing:.4em;color:#fff;opacity:.5">0${i+1}</div>
  <div style="position:absolute;top:24px;right:46px;font:600 19px Int;letter-spacing:.4em;color:#fff;opacity:.5">/ 05</div>
  <div style="position:absolute;top:22px;width:100%;font:400 17px Arc;letter-spacing:.5em;padding-left:.5em;color:#fff;opacity:.38">FEVER DREAM</div>
  <div class="ab" style="font:italic 400 ${f.fs}px/0.98 DMS;color:${f.ac};margin-top:18px">${f.t}</div>
  <div style="font:600 21px Int;letter-spacing:.34em;padding-left:.34em;margin-top:14px;color:#EEE8F6">${f.yr} &nbsp;|&nbsp; ${f.dir.toUpperCase()} &nbsp;|&nbsp; ${f.w.toUpperCase()}</div>
  <div style="font:italic 500 36px Cor;color:#FFF6FB;margin-top:22px;padding:0 80px;opacity:.92">${f.l}</div>
 </div>
 ${strip(f.im[2],f.y[2],300)}
</body></html>`;
 fs.writeFileSync(D+'/_s.html',html);await p.goto('file://'+D+'/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(200);
 await p.screenshot({path:`${D}/out/${f.f}.png`});}
await b.close();})();
