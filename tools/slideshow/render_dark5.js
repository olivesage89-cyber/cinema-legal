// "for when it's dark by 5pm" — cover: extended starry sky over Ratatouille Paris rooftops, coral Mrs Saint Delafield 'dark'
// + lilac Oswald 'BY 5 PM'; inside: LAMPLIT WINDOW (warm dark page, arched still w/ thin accent frame, small framed inset still,
// script clock-time per film, Instrument Serif title, Oswald meta, Instrument italic line).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Mrs', 'mrs-saint-delafield', 400), ff('Osw', 'oswald', 300), ff('Osw', 'oswald', 400), ff('Osw', 'oswald', 500),
  ff('Ins', 'instrument-serif', 400), ff('Ins', 'instrument-serif', 400, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#140f0d}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.02)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 55%,rgba(5,3,15,.45) 100%)}
.ctxt{position:absolute;left:0;right:0;text-align:center}
.kick{font-family:Osw;font-weight:400;font-size:23px;letter-spacing:.62em;padding-left:.62em;color:#E9E2F7;opacity:.92}
.hero{font-family:Mrs;font-size:400px;line-height:.7;color:var(--ink);margin-top:96px;text-shadow:0 4px 40px rgba(10,5,30,.5);transform:translateX(-18px)}
.h2{font-family:Osw;font-weight:300;font-size:118px;letter-spacing:.2em;padding-left:.2em;color:#EEE8FB;line-height:1;margin-top:-6px;text-shadow:0 2px 30px rgba(10,5,30,.5)}
.csub{font-family:Ins;font-style:italic;font-size:46px;color:#EEE8FB;margin-top:26px;text-shadow:0 1px 18px rgba(10,5,30,.6)}
.cfoot{position:absolute;bottom:44px;left:0;right:0;text-align:center;color:#EDE6FA;font-family:Osw;font-weight:400;font-size:19px;letter-spacing:.5em;opacity:.85}
/* inside: lamplit window */
.page{position:absolute;inset:0;background:radial-gradient(ellipse 70% 55% at 50% 34%,rgba(255,170,90,.16),rgba(0,0,0,0) 70%),linear-gradient(#1d1512,#110c0b)}
.top{position:absolute;top:48px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;color:#E9DCCB;font-family:Osw;font-weight:400;font-size:18px;letter-spacing:.42em;opacity:.75}
.arch{position:absolute;left:130px;top:112px;width:820px;height:800px;border-radius:410px 410px 6px 6px;overflow:hidden;box-shadow:0 30px 80px rgba(0,0,0,.55),0 0 120px rgba(255,160,80,.12)}
.arch img{width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.04) sepia(.06)}
.arch:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(10,5,0,.35) 100%)}
.frame{position:absolute;left:112px;top:94px;width:856px;height:836px;border:2px solid var(--acc);border-radius:428px 428px 10px 10px;opacity:.85}
.inset{position:absolute;right:58px;top:735px;width:300px;height:200px;border:7px solid #F1E6D6;box-shadow:0 18px 40px rgba(0,0,0,.6);transform:rotate(3deg);overflow:hidden}
.inset img{width:100%;height:100%;object-fit:cover;filter:saturate(.9) sepia(.05)}
.clock{position:absolute;left:84px;top:900px;font-family:Mrs;font-size:112px;color:var(--acc);transform:rotate(-4deg);line-height:1}
.title{position:absolute;left:70px;right:70px;top:1002px;font-family:Ins;font-size:var(--fs,112px);line-height:.95;color:#F6EDE0;letter-spacing:-.01em}
.meta{position:absolute;left:74px;font-family:Osw;font-weight:400;font-size:20px;letter-spacing:.36em;color:var(--acc)}
.meta b{font-weight:400;color:#E9DCCB;opacity:.7}
.line{position:absolute;left:72px;right:90px;font-family:Ins;font-style:italic;font-size:38px;line-height:1.18;color:#E9DCCB;opacity:.92}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<img class="bg" src="file://${D}/${s.img}"><div class="vig"></div>
      <div class="ctxt" style="--ink:${s.ink};top:${s.top}px"><div class="kick">${s.kick}</div><div class="hero">${s.h}</div><div class="h2">${s.h2}</div><div class="csub">${s.sub}</div></div>
      <div class="cfoot">SWIPE &nbsp;→</div><div class="grain"></div>`;
    else {
      const fs_ = s.fs || 112, lines = (s.t.match(/<br>/g) || []).length + 1, mt = 1002 + lines * fs_ * .95 + 22;
      body = `<div class="page" style="--acc:${s.acc};--fs:${fs_}px">
      <div class="top"><span>N° ${s.n}</span><span>DARK BY 5PM</span></div>
      <div class="frame"></div>
      <div class="arch"><img src="file://${D}/${s.a}" style="object-position:${s.ax ?? 50}% ${s.ay ?? 50}%"></div>
      <div class="inset"><img src="file://${D}/${s.b}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"></div>
      <div class="clock">${s.time}</div>
      <div class="title">${s.t}</div>
      <div class="meta" style="top:${mt}px">${s.dir.toUpperCase()} &nbsp;·&nbsp; <b>${s.yr}</b></div>
      <div class="line" style="top:${mt + 48}px">${s.q}</div></div><div class="grain"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
