// "anime with the most beautiful skies" — cover: Place Promised hill at dusk w/ extended twilight sky, gold Pinyon 'beautiful' + Gloock spaced SKIES.
// Inside: SKY PALETTE — full-width still fading into a deep per-film page, tilted bordered inset still, Gloock title,
// Josefin caps meta, a row of 5 colour swatches sampled from that film's sky w/ hex codes, Newsreader italic line.
// Usage: node render_skies.js WORKDIR  (WORKDIR/slides.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [ff('Pin', 'pinyon-script', 400), ff('Glk', 'gloock', 400), ff('Jos', 'josefin-sans', 400), ff('Jos', 'josefin-sans', 600),
  ff('News', 'newsreader', 400, 'italic'), ff('News', 'newsreader', 500, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#120e18;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 58%,rgba(0,0,0,.30) 100%);pointer-events:none}
/* cover */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#1d1530 0,#33284a 210px,#5c4c78 420px,#7e6c98 560px)}
.cwrap{position:absolute;left:0;right:0;bottom:0;height:var(--h);overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 var(--m));mask-image:linear-gradient(180deg,transparent 0,#000 var(--m))}
.cwrap img{position:absolute;height:100%;left:var(--l);filter:saturate(1.02) contrast(1.0) brightness(1.02)}
.warm{position:absolute;inset:0;background:radial-gradient(ellipse at 85% 62%,rgba(255,200,140,.16),rgba(0,0,0,0) 55%);mix-blend-mode:screen}
.ctxt{position:absolute;left:40px;right:40px;top:var(--top);text-align:center}
.kick{font-family:Jos;font-weight:600;font-size:24px;letter-spacing:.52em;margin-left:.52em;color:#F6ECE4;opacity:.9}
.beau{font-family:Pin;font-size:156px;line-height:1;color:var(--ink);margin-top:26px;position:relative;z-index:2;text-shadow:0 2px 24px rgba(30,15,40,.45)}
.skies{font-family:Glk;font-size:182px;line-height:.86;letter-spacing:.24em;margin-left:.24em;color:#FBF1E6;margin-top:-44px;text-shadow:0 4px 40px rgba(25,15,40,.35)}
.csub{font-family:News;font-style:italic;font-size:38px;color:#FBF1E6;margin-top:30px;opacity:.92;text-shadow:0 2px 14px rgba(25,15,40,.55)}
.swipe{position:absolute;bottom:50px;left:0;right:0;text-align:center;font-family:Jos;font-weight:600;font-size:17px;letter-spacing:.5em;margin-left:.25em;color:#F6ECE4;opacity:.7}
/* inside */
.page{position:absolute;inset:0;background:var(--bg)}
.main{position:absolute;left:0;top:0;width:1080px;height:800px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,#000 72%,transparent 100%);mask-image:linear-gradient(180deg,#000 72%,transparent 100%)}
.main img{width:100%;height:100%;object-fit:cover;filter:saturate(.95) contrast(.98)}
.topfade{position:absolute;left:0;right:0;top:0;height:170px;background:linear-gradient(180deg,rgba(0,0,0,.38),rgba(0,0,0,0))}
.top{position:absolute;top:52px;left:66px;right:66px;display:flex;justify-content:space-between;font-family:Jos;font-weight:600;font-size:17px;letter-spacing:.38em;color:#FBF4EA;text-shadow:0 1px 10px rgba(0,0,0,.4)}
.inset{position:absolute;right:62px;top:var(--iy,606px);width:340px;height:226px;border:9px solid #F7F1E8;box-shadow:0 20px 44px rgba(0,0,0,.42);transform:rotate(2.6deg);overflow:hidden;background:#F7F1E8}
.inset img{width:100%;height:100%;object-fit:cover}
.tb{position:absolute;left:68px;right:68px;top:838px;bottom:60px;display:flex;flex-direction:column}
.title{font-family:Glk;color:#FBF4EA;font-size:var(--ts,74px);line-height:1.04;max-width:var(--tw,940px)}
.meta{margin-top:20px;font-family:Jos;font-weight:600;font-size:18px;letter-spacing:.3em;color:var(--acc)}
.sp{flex:1}
.swl{font-family:Jos;font-weight:600;font-size:14px;letter-spacing:.42em;color:#FBF4EA;opacity:.6;margin-bottom:16px}
.sws{display:flex;gap:26px;margin-bottom:34px}
.sw{display:flex;flex-direction:column;align-items:center;gap:10px}
.dot{width:62px;height:62px;border-radius:50%;background:var(--c);box-shadow:0 0 0 2px rgba(255,255,255,.22),0 6px 16px rgba(0,0,0,.25)}
.hex{font-family:Jos;font-weight:400;font-size:13px;letter-spacing:.12em;color:#FBF4EA;opacity:.62}
.line{font-family:News;font-style:italic;font-size:35px;color:#FBF4EA;opacity:.9;line-height:1.25}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div style="--ink:${s.ink};--h:${s.h}px;--m:${s.m}px;--l:${s.l}px;--top:${s.top}px"><div class="sky"></div>
      <div class="cwrap"><img src="file://${D}/${s.img}"></div><div class="warm"></div><div class="vig"></div>
      <div class="ctxt"><div class="kick">${s.kick}</div><div class="beau">${s.a}</div><div class="skies">${s.b}</div><div class="csub">${s.sub}</div></div>
      <div class="swipe">SWIPE &nbsp;→</div></div>`;
    } else {
      const sw = s.sw.map(c => `<div class="sw"><div class="dot" style="--c:${c}"></div><div class="hex">${c}</div></div>`).join('');
      body = `<div style="--bg:${s.bg};--acc:${s.acc};--ts:${s.ts || 74}px;--tw:${s.tw || 940}px;--iy:${s.iy || 606}px"><div class="page"></div>
      <div class="main"><img src="file://${D}/${s.i1}" style="object-position:${s.x1 ?? 50}% ${s.y1 ?? 50}%"></div><div class="topfade"></div>
      <div class="top"><span>THE MOST BEAUTIFUL SKIES</span><span>${s.n} / 05</span></div>
      <div class="inset"><img src="file://${D}/${s.i2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div>
      <div class="tb"><div class="title">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="sp"></div>
      <div class="swl">THE SKY IN THIS ${s.kind || 'FILM'}</div><div class="sws">${sw}</div><div class="line">${s.ov}</div></div><div class="vig"></div></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
