// ede.nnico — "movies that feel like the mountains": vintage alpine travel-poster cover + TRAIL CARD inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const PINE = '#1F4536', RED = '#D23B2A';
const css = [ff('Yes','yeseva-one',400), ff('Bar','barlow-condensed',500), ff('Bar','barlow-condensed',600), ff('Bar','barlow-condensed',700),
  ff('Cri','crimson-pro',500,'italic'), ff('Cri','crimson-pro',600,'italic'), ff('All','allura',400)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#EFE7D6}
.paper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#F5EEDF,#E6DCC6 95%)}
.topo{position:absolute;inset:0;opacity:.085}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:multiply;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.grainL{position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;pointer-events:none;background-image:inherit}
.border{position:absolute;inset:30px;border:2px solid ${PINE};opacity:.55}
.border:after{content:'';position:absolute;inset:7px;border:1px solid ${PINE};opacity:.6}
/* cover */
.ck{position:absolute;top:96px;left:0;right:0;text-align:center;font-family:Bar;font-weight:600;font-size:30px;letter-spacing:.42em;color:${PINE};padding-left:.42em}
.cthe{position:absolute;top:136px;left:128px;font-family:All;font-size:96px;color:${RED};transform:rotate(-9deg);z-index:3}
.ch{position:absolute;top:178px;left:0;right:0;text-align:center;font-family:Yes;font-size:166px;line-height:1;letter-spacing:0;color:${PINE};z-index:2}
.arch{position:absolute;left:96px;right:96px;top:408px;height:780px;border-radius:444px 444px 8px 8px;overflow:hidden;box-shadow:0 26px 44px rgba(40,30,10,.32);border:10px solid #FBF7EE}
.arch .im{position:absolute;inset:0;background-size:cover;filter:contrast(1.06) saturate(1.06) sepia(.08) brightness(1.02)}
.arch .g{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,240,210,.12),rgba(0,0,0,0) 40%,rgba(10,30,20,.18));mix-blend-mode:multiply}
.csub{position:absolute;top:1212px;left:0;right:0;text-align:center;font-family:Cri;font-style:italic;font-weight:500;font-size:40px;color:#2B2A22}
.cfoot{position:absolute;bottom:58px;left:84px;right:84px;display:flex;justify-content:space-between;font-family:Bar;font-weight:600;font-size:20px;letter-spacing:.36em;color:${PINE};opacity:.8}
.peak{display:inline-block;width:0;height:0;border-left:9px solid transparent;border-right:9px solid transparent;border-bottom:14px solid ${RED};margin:0 10px -1px}
/* trail card */
.hdr{position:absolute;top:66px;left:74px;right:74px;display:flex;justify-content:space-between;align-items:baseline}
.hdr b{font-family:Bar;font-weight:600;font-size:22px;letter-spacing:.36em;color:var(--ink)}
.hdr i{font-family:Cri;font-style:italic;font-weight:500;font-size:32px;color:#3a362c}
.big{position:absolute;left:74px;right:74px;top:120px;height:590px;border:12px solid #FBF7EE;box-shadow:0 22px 36px rgba(40,30,10,.3);overflow:hidden}
.big img,.sm img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.05) saturate(1.02) sepia(.07)}
.sm{position:absolute;width:336px;height:214px;border:10px solid #FBF7EE;box-shadow:0 14px 24px rgba(40,30,10,.3);overflow:hidden}
.sm1{left:668px;top:768px;transform:rotate(2.2deg)}
.sm2{left:654px;top:1010px;transform:rotate(-1.8deg)}
.tape{position:absolute;width:110px;height:30px;background:rgba(240,228,196,.82);box-shadow:0 1px 3px rgba(0,0,0,.12);z-index:4}
.txt{position:absolute;left:78px;top:772px;width:540px}
.no{font-family:Bar;font-weight:700;font-size:20px;letter-spacing:.34em;color:#fff;background:var(--ink);display:inline-block;padding:7px 12px 6px 16px}
.ttl{font-family:Yes;font-size:var(--fs,78px);line-height:1.02;color:var(--ink);margin-top:22px}
.meta{font-family:Bar;font-weight:600;font-size:22px;letter-spacing:.24em;color:#45403a;margin-top:20px}
.where{font-family:Bar;font-weight:500;font-size:21px;letter-spacing:.2em;color:#6a6255;margin-top:8px;text-transform:uppercase}
.where .peak{border-bottom-color:var(--ink);margin-left:0}
.rule{width:70px;height:2px;background:var(--ink);margin:24px 0 20px;opacity:.8}
.line{font-family:Cri;font-style:italic;font-weight:500;font-size:37px;line-height:1.16;color:#29261f}
.trail{position:absolute;left:90px;right:90px;bottom:58px;height:24px}
.trail svg{width:100%;height:100%}
`;
// faint topographic contour lines (deterministic)
function topo(seed){let s=seed;const r=()=>((s=(s*9301+49297)%233280)/233280);let p='';
  for(let c=0;c<4;c++){const cx=r()*1080,cy=r()*1350;for(let k=1;k<13;k++){const R=k*46+r()*10;let d='';
    for(let a=0;a<=64;a++){const t=a/64*Math.PI*2;const w=1+.16*Math.sin(3*t+c)+.09*Math.sin(5*t+k*.3);const x=cx+Math.cos(t)*R*w*1.3,y=cy+Math.sin(t)*R*w;d+=(a?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)}
    p+=`<path d="${d}Z"/>`}}
  return `<svg class="topo" viewBox="0 0 1080 1350" width="1080" height="1350"><g fill="none" stroke="${PINE}" stroke-width="1.6">${p}</g></svg>`}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    if (s.type === 'end') continue;
    let body;
    if (s.type === 'cover') {
      body = `<div class="paper"></div>${topo(7)}<div class="border"></div>
      <div class="ck">${s.kick}</div><div class="cthe">${s.the}</div><div class="ch">${s.h}</div>
      <div class="arch"><div class="im" style="background-image:url(file://${D}/${s.img});background-position:${s.x}% ${s.y}%"></div><div class="g"></div><div class="grainL grain" style="mix-blend-mode:overlay;opacity:.25"></div></div>
      <div class="csub">${s.sub}</div>
      <div class="cfoot"><span>05 FILMS</span><span><i class="peak"></i></span><span>SWIPE →</span></div><div class="grain"></div>`;
    } else {
      const n = String(i).padStart(2, '0');
      let dots = ''; for (let k = 1; k <= 5; k++) { const x = (k - 1) * 225 + 12; dots += k <= i ? `<path d="M${x-12} 22 L${x} 2 L${x+12} 22Z" fill="${s.ink}"/>` : `<path d="M${x-12} 22 L${x} 2 L${x+12} 22Z" fill="#ECE3D0" stroke="#6a6255" stroke-width="2"/>`; }
      body = `<div class="paper"></div>${topo(11 + i * 5)}
      <div class="hdr" style="--ink:${s.ink}"><b>TRAIL Nº ${n} / 05</b><i>the mountains</i></div>
      <div class="big"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      <div class="sm sm1"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div>
      <div class="tape" style="left:782px;top:752px;transform:rotate(-4deg)"></div>
      <div class="sm sm2"><img src="file://${D}/${s.img3}" style="object-position:${s.x3 ?? 50}% 50%"></div>
      <div class="tape" style="left:900px;top:1212px;transform:rotate(5deg)"></div>
      <div class="txt" style="--ink:${s.ink};--fs:${s.fs || 78}px"><div class="no">Nº ${n}</div><div class="ttl">${s.t}</div>
        <div class="meta">DIR. ${s.dir.toUpperCase()} · ${s.yr}</div><div class="where"><i class="peak"></i>${s.where}</div><div class="rule"></div><div class="line">${s.line}</div></div>
      <div class="trail"><svg viewBox="0 0 924 24" preserveAspectRatio="none"><line x1="12" y1="16" x2="912" y2="16" stroke="#6a6255" stroke-width="2" stroke-dasharray="7 9"/>${dots}</svg></div>
      <div class="grain"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${String(i + 1).padStart(2, '0')}_${s.type === 'cover' ? 'cover' : 'film' + i}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
