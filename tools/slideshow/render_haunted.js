// "haunted by love" (ede.nnico) — cover: marigold Pinyon script + Marcellus caps on dusk hill (A Ghost Story);
// inside: SÉANCE (near-black velvet page, framed still with hairline mat, feathered "memory" inset still,
// Cormorant italic title with an accent-coloured ghost echo, Marcellus caps meta, italic line, roman numerals).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
const css = [ff('Pinyon', 'pinyon-script', 400), ff('Marc', 'marcellus', 400), ff('Corm', 'cormorant-garamond', 500, 'italic'),
  ff('Corm', 'cormorant-garamond', 600, 'italic'), ff('Inter', 'inter', 500), ff('Inter', 'inter', 600)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0C0B0E}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;pointer-events:none;z-index:30;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* cover */
.cbg{filter:saturate(.9) contrast(1.04) brightness(.97)}
.ctint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,150,120,.10),rgba(40,20,40,.0) 45%,rgba(10,8,14,.55) 100%)}
.cvig{position:absolute;inset:0;background:radial-gradient(ellipse at 55% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.cv{position:absolute;left:70px;bottom:118px;color:#F7EEE4;z-index:5}
.cv .k{font-family:Inter;font-weight:600;font-size:18px;letter-spacing:.4em;opacity:.92}
.cv .h{font-family:Pinyon;font-size:236px;line-height:1;color:${S.cover.ink};margin:6px 0 0 -14px;text-shadow:0 6px 40px rgba(0,0,0,.35)}
.cv .h2{font-family:Marc;font-size:70px;letter-spacing:.42em;margin-top:-34px;padding-left:150px;text-shadow:0 4px 24px rgba(0,0,0,.4)}
.cv .s{font-family:Corm;font-style:italic;font-weight:500;font-size:40px;margin-top:22px;opacity:.95}
.cv .rule{width:84px;height:1.5px;background:${S.cover.ink};margin-top:24px}
/* inside: seance */
.velvet{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#1a1619 0%,#0C0B0E 70%)}
.hd{position:absolute;top:56px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Marc;font-size:19px;letter-spacing:.42em;color:#EDE6DC;opacity:.85;z-index:5}
.hd b{font-weight:400;color:var(--acc);letter-spacing:.3em}
.main{position:absolute;left:60px;top:118px;width:960px;height:640px;overflow:hidden;box-shadow:0 30px 70px rgba(0,0,0,.55)}
.main .bg{object-position:var(--x) var(--y);filter:saturate(.88) contrast(1.03)}
.mat{position:absolute;left:44px;top:102px;width:992px;height:672px;border:1px solid var(--acc);opacity:.55;z-index:2}
.mem{position:absolute;right:34px;top:596px;width:450px;height:290px;z-index:4;
 -webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 55%,rgba(0,0,0,0) 100%)}
.mem .bg{filter:saturate(.6) contrast(.95) brightness(1.05) sepia(.15)}
.info{position:absolute;left:60px;top:900px;width:960px;z-index:6;color:#F4EEE6}
.t{position:relative;font-family:Corm;font-style:italic;font-weight:600;font-size:var(--fs,104px);line-height:.95;letter-spacing:-.01em;white-space:nowrap}
.t .echo{position:absolute;left:10px;top:-12px;color:var(--acc);opacity:.38;filter:blur(1.2px);white-space:nowrap}
.t .real{position:relative}
.d{font-family:Marc;font-size:21px;letter-spacing:.3em;text-transform:uppercase;margin-top:30px;color:var(--acc)}
.rl{width:70px;height:1.5px;background:var(--acc);margin-top:30px;opacity:.85}
.o{font-family:Corm;font-style:italic;font-weight:500;font-size:40px;line-height:1.22;margin-top:26px;color:rgba(244,238,230,.88)}
.ft{position:absolute;bottom:52px;right:60px;font-family:Pinyon;font-size:54px;color:var(--acc);opacity:.9;z-index:6}
`;
const R = ['I', 'II', 'III', 'IV', 'V'];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (body, out) => {
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}${grain}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 });
  };
  const c = S.cover;
  if (!process.argv[3] || process.argv[3] === 'cover')
  await shot(`<img class="bg cbg" src="file://${D}/${c.img}" style="object-position:${c.x}% 50%"><div class="ctint"></div><div class="cvig"></div>
   <div class="cv"><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div><div class="s">${c.sub}</div><div class="rule"></div></div>`, '01_cover.jpg');
  if (process.argv[3] === 'cover') { await b.close(); return; }
  for (const [i, m] of S.movies.entries()) {
    await shot(`<div class="velvet"></div><div style="--acc:${m.acc};--x:${m.x}%;--y:${m.y}%;--fs:${m.fs || 104}px">
     <div class="hd"><span>${S.tag}</span><b>${R[i]} / V</b></div>
     <div class="mat"></div><div class="main"><img class="bg" src="file://${D}/${m.img}"></div>
     <div class="mem"><img class="bg" src="file://${D}/${m.img2}" style="object-position:${m.x2 || 50}% ${m.y2 || 50}%"></div>
     <div class="info"><div class="t"><span class="echo">${m.t}</span><span class="real">${m.t}</span></div>
      <div class="d">${m.dir} &nbsp;·&nbsp; ${m.yr}</div><div class="rl"></div><div class="o">${m.ov}</div></div>
     <div class="ft">haunted</div></div>`, `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
