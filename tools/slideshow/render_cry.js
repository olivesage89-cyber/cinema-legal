// "anime for when you need a good cry" — cover: Look Back dusk tree, lavender Playfair italic 'cry'.
// Inside: DUOTONE — each slide washed in its own colour, 2 stacked stills, Playfair italic title with Italianno ghost.
// Usage: node render_cry.js WORKDIR  (WORKDIR/slides.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [ff('Play', 'playfair-display', 400, 'italic'), ff('Play', 'playfair-display', 700, 'italic'), ff('Play', 'playfair-display', 900, 'italic'),
  ff('Gar', 'eb-garamond', 400, 'italic'), ff('Gar', 'eb-garamond', 500, 'italic'), ff('Gar', 'eb-garamond', 500), ff('Ita', 'italianno', 400),
  ff('Mont', 'montserrat', 500), ff('Mont', 'montserrat', 600)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#07070c;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.32) 100%)}
/* cover */
.cimg{position:absolute;left:0;top:0;width:1080px;height:var(--h);object-fit:cover;filter:saturate(.88) contrast(.95) brightness(1.04)}
.cfade{position:absolute;left:0;right:0;top:calc(var(--h) - 330px);height:330px;background:linear-gradient(180deg,rgba(7,7,12,0),#07070c 92%)}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,190,170,.10),rgba(0,0,0,0) 60%);mix-blend-mode:screen}
.ctxt{position:absolute;left:60px;right:60px;text-align:center;color:var(--ink)}
.kick{font-family:Mont;font-weight:600;font-size:23px;letter-spacing:.46em;margin-left:.46em;opacity:.92}
.agood{font-family:Gar;font-style:italic;font-weight:400;font-size:74px;margin-top:22px;line-height:1}
.cry{font-family:Play;font-style:italic;font-weight:700;font-size:305px;line-height:.8;margin-top:-14px;letter-spacing:-.01em;text-shadow:0 0 60px rgba(220,214,255,.18)}
.csub{font-family:Gar;font-style:italic;font-size:40px;margin-top:70px;opacity:.88}
.brand{position:absolute;top:54px;width:100%;text-align:center;color:#fff;font-family:Mont;font-weight:500;font-size:18px;letter-spacing:.7em;margin-left:.35em;opacity:.85;text-shadow:0 1px 8px rgba(0,0,0,.35)}
.swipe{position:absolute;bottom:48px;width:100%;text-align:center;font-family:Gar;font-style:italic;font-size:28px;color:var(--ink);opacity:.7}
/* duotone inside */
.wash{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,var(--w2),var(--w) 75%)}
.top{position:absolute;top:58px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Mont;font-weight:600;font-size:17px;letter-spacing:.34em;color:var(--acc);opacity:.85}
.ph{position:absolute;left:70px;width:940px;overflow:hidden;border-radius:4px;box-shadow:0 18px 50px rgba(0,0,0,.35)}
.ph img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(.95)}
.ph:after{content:'';position:absolute;inset:0;background:var(--w);mix-blend-mode:soft-light;opacity:.55}
.p1{top:110px;height:412px}.p2{top:538px;height:412px}
.ghost{position:absolute;right:62px;top:var(--gy,872px);font-family:Ita;font-size:var(--gs,200px);line-height:.9;color:var(--acc);opacity:.42;white-space:nowrap;text-align:right}
.tb{position:absolute;left:70px;right:70px;top:1004px}.title{font-family:Play;font-style:italic;font-weight:700;color:#FBF4EA;font-size:var(--ts,78px);line-height:1.02;letter-spacing:-.005em}
.meta{margin-top:20px;font-family:Mont;font-weight:600;font-size:17px;letter-spacing:.3em;color:var(--acc)}
.line{position:absolute;left:70px;right:70px;bottom:62px;font-family:Gar;font-style:italic;font-size:33px;color:#FBF4EA;opacity:.85}
.rule{display:inline-block;width:46px;height:2px;background:var(--acc);vertical-align:middle;margin-right:18px;opacity:.8}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div style="--h:${s.h}px;--ink:${s.ink}"><img class="cimg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="cfade"></div><div class="glow"></div><div class="vig"></div>
      <div class="brand">CINEMA</div>
      <div class="ctxt" style="top:${s.top}px"><div class="kick">${s.kick}</div><div class="agood">${s.a}</div><div class="cry">${s.b}</div><div class="csub">${s.sub}</div></div>
      <div class="swipe">swipe, if you're ready &nbsp;→</div></div>`;
    } else {
      body = `<div style="--w:${s.w};--w2:${s.w2};--acc:${s.acc};--ts:${s.ts || 78}px;--gs:${s.gs || 210}px;--gy:${s.gy || 955}px"><div class="wash"></div>
      <div class="top"><span>A GOOD CRY</span><span>${s.n} / 05</span></div>
      <div class="ph p1"><img src="file://${D}/${s.i1}" style="object-position:${s.x1 ?? 50}% ${s.y1 ?? 50}%"></div>
      <div class="ph p2"><img src="file://${D}/${s.i2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div>
      <div class="ghost">${s.g}</div>
      <div class="tb"><div class="title">${s.t}</div><div class="meta">DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div></div>
      <div class="line"><span class="rule"></span>${s.ov}</div><div class="vig"></div></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
