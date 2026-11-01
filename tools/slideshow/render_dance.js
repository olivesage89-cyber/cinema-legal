// "movies that make you want to dance" — cover: La La Land 'A Lovely Night' under a starry violet sky,
// Josefin kicker + cream Mr Dafoe 'make you want to' + giant neon-rose Limelight DANCE w/ glow + Cormorant italic sub.
// Inside: DANCE CARD (per-film deep art-deco page w/ sunburst rays, cream-bordered big still, cream dance-card w/
// deco double border: THE DANCE label, Limelight title, Josefin dir·year, Cormorant italic line; round spotlight inset
// w/ accent ring; footprint step diagram w/ '5, 6, 7, 8' in Mr Dafoe).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Lime', 'limelight', 400), ff('Daf', 'mr-dafoe', 400),
  ff('Jos', 'josefin-sans', 400), ff('Jos', 'josefin-sans', 600), ff('Jos', 'josefin-sans', 700),
  ff('Cor', 'cormorant-garamond', 500, 'italic'), ff('Cor', 'cormorant-garamond', 600, 'italic'), ff('Cor', 'cormorant-garamond', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#0B0630}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.06) contrast(1.05) brightness(1.0)}
.cv .top{position:absolute;left:0;right:0;top:0;height:55%;background:linear-gradient(180deg,rgba(8,4,36,.55),rgba(8,4,36,.15) 70%,rgba(8,4,36,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)}
.cv .ttl{position:absolute;left:0;right:0;top:var(--ty,90px);text-align:center}
.cv .kick{font-family:Jos;font-weight:600;font-size:23px;letter-spacing:.55em;padding-left:.55em;color:#F6EEF8;opacity:.95}
.cv .big{font-family:Daf;font-size:104px;line-height:1;color:#FBF1E6;transform:rotate(-5deg);margin:26px 0 -26px 0;text-shadow:0 3px 22px rgba(10,4,40,.7)}
.cv .h{font-family:Lime;font-size:226px;line-height:1;letter-spacing:.04em;padding-left:.04em;color:var(--acc);
  text-shadow:0 0 6px rgba(255,170,220,.85),0 0 26px rgba(255,90,180,.75),0 0 70px rgba(255,60,170,.55),0 0 140px rgba(255,60,170,.35)}
.cv .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:20px;color:var(--acc);font-size:15px}
.cv .rule span{width:120px;height:1px;background:linear-gradient(90deg,rgba(255,154,213,0),var(--acc))}
.cv .rule span:last-child{background:linear-gradient(270deg,rgba(255,154,213,0),var(--acc))}
.cv .sub{margin-top:18px;color:#F6EEF8;font-family:Cor;font-style:italic;font-weight:600;font-size:38px;line-height:1.15;text-shadow:0 2px 14px rgba(8,4,36,.8)}
.cv .sub b{color:var(--acc);font-weight:600}
/* inside: dance card */
.dc{background:var(--pg)}
.dc .rays{position:absolute;inset:0;background:repeating-conic-gradient(from 0deg at 50% -8%,rgba(255,255,255,.055) 0deg 4deg,rgba(255,255,255,0) 4deg 8deg)}
.dc .shade{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 0%,rgba(255,235,210,.16),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)}
.dc .hd{position:absolute;left:62px;right:62px;top:46px;display:flex;justify-content:space-between;align-items:baseline;color:#F5ECDD}
.dc .hd .l{font-family:Lime;font-size:30px;letter-spacing:.14em}
.dc .hd .l i{font-family:Daf;font-style:normal;font-size:40px;letter-spacing:0;color:var(--acc2);margin-left:14px;position:relative;top:4px}
.dc .hd .r{font-family:Jos;font-weight:600;font-size:17px;letter-spacing:.34em}
.dc .hl{position:absolute;left:62px;right:62px;top:100px;height:5px;border-top:1px solid rgba(245,236,221,.6);border-bottom:1px solid rgba(245,236,221,.6)}
.dc .print{position:absolute;left:62px;top:128px;width:956px;height:560px;background:#F7EFE2;padding:12px;box-shadow:0 20px 44px rgba(0,0,0,.5)}
.dc .print div{width:100%;height:100%;background-size:cover;filter:saturate(1.04) contrast(1.03)}
.dc .card{position:absolute;left:62px;top:730px;width:610px;height:560px;background:#FAF3E6;color:#22161A;padding:44px 46px;box-shadow:0 20px 44px rgba(0,0,0,.5);display:flex;flex-direction:column}
.dc .card:before{content:'';position:absolute;inset:14px;border:2px solid var(--acc)}
.dc .card:after{content:'';position:absolute;inset:20px;border:1px solid var(--acc);opacity:.5}
.dc .lab{font-family:Jos;font-weight:700;font-size:14px;letter-spacing:.38em;color:var(--acc)}
.dc .dn{font-family:Cor;font-style:italic;font-weight:600;font-size:33px;line-height:1.1;margin-top:8px;color:#3a2a2a}
.dc .orn{display:flex;align-items:center;gap:12px;margin:22px 0 18px;color:var(--acc);font-size:14px}
.dc .orn span{flex:1;height:1px;background:var(--acc);opacity:.55}
.dc .t{font-family:Lime;font-size:var(--tfs,64px);line-height:1.02;color:#22161A}
.dc .dir{font-family:Jos;font-weight:600;font-size:16px;letter-spacing:.26em;margin-top:16px;color:#5b4848}
.dc .dir b{color:var(--acc);font-weight:700}
.dc .ln{font-family:Cor;font-style:italic;font-weight:500;font-size:31px;line-height:1.16;margin-top:22px;color:#22161A}
.dc .sv{margin-top:auto;font-family:Jos;font-weight:700;font-size:13px;letter-spacing:.34em;color:var(--acc)}
.dc .who{display:flex;align-items:flex-end;gap:10px;margin-top:2px}
.dc .who span{flex:1;border-bottom:2px dotted rgba(60,40,40,.45);height:1px;margin-bottom:10px}
.dc .who b{font-family:Daf;font-weight:400;font-size:46px;line-height:1;color:var(--acc);transform:rotate(-3deg)}
.dc .spot{position:absolute;left:712px;top:742px;width:306px;height:306px;border-radius:50%;padding:9px;background:#F7EFE2;box-shadow:0 0 0 3px var(--acc2),0 18px 40px rgba(0,0,0,.5)}
.dc .spot div{width:100%;height:100%;border-radius:50%;background-size:cover;filter:saturate(1.04)}
.dc .steps{position:absolute;left:705px;top:1072px;width:320px;height:160px}
.dc .cnt{position:absolute;left:700px;top:1226px;width:330px;text-align:center;font-family:Daf;font-size:46px;color:#F5ECDD}
`;
const foot = (x, y, r, n, left) => `<g transform="translate(${x},${y}) rotate(${r})"><g transform="scale(.8)"><ellipse cx="0" cy="-10" rx="15" ry="25" fill="ACC"/><ellipse cx="${left ? 2 : -2}" cy="27" rx="11" ry="12" fill="ACC"/></g></g>`;
const steps = acc => `<svg class="steps" viewBox="0 0 320 160" xmlns="http://www.w3.org/2000/svg">
<path d="M48 118 C 90 40, 150 40, 190 92 S 255 70, 286 36" fill="none" stroke="#F5ECDD" stroke-opacity=".6" stroke-width="2" stroke-dasharray="5 7"/>
${foot(40, 118, -20, 1, true)}${foot(118, 52, 10, 2, false)}${foot(196, 100, 28, 3, true)}${foot(280, 42, 48, 4, false)}
</svg>`.replace(/ACC/g, acc);
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    if (s.type === 'end') continue;
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="top"></div><div class="vig"></div>
      <div class="ttl" style="--ty:${s.ty}px"><div class="kick">${s.kick}</div><div class="big">${s.h0}</div><div class="h">${s.h}</div>
      <div class="rule"><span></span>✦<span></span></div><div class="sub">${s.sub}</div></div>`;
    } else {
      cls = 'dc';
      body = `<div class="rays"></div><div class="shade"></div>
      <div class="hd"><span class="l">DANCE CARD<i>want to dance</i></span><span class="r">Nº ${s.n} / 05</span></div><div class="hl"></div>
      <div class="print"><div style="background-image:url(file://${D}/${s.img});background-position:${s.x ?? 50}% ${s.y ?? 50}%"></div></div>
      <div class="card" style="--tfs:${s.tfs || 64}px"><div class="lab">THE DANCE</div><div class="dn">${s.dance}</div>
        <div class="orn"><span></span>◆<span></span></div>
        <div class="t">${s.t}</div><div class="dir">${s.dir.toUpperCase()} · <b>${s.yr}</b></div>
        <div class="ln">${s.ln}</div><div class="sv">SAVE THE NEXT DANCE FOR</div><div class="who"><span></span><b>${s.who}</b><span style="flex:.25"></span></div></div>
      <div class="spot"><div style="background-image:url(file://${D}/${s.inset});background-position:${s.ix ?? 50}% ${s.iy ?? 50}%"></div></div>
      ${steps(s.acc2)}<div class="cnt">5, 6, 7, 8…</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--acc2:${s.acc2 || s.acc};--pg:${s.pg || '#111'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
