// Cinema slideshow renderer v2 — "film poster" look: script + serif type, film-stock grade, grain.
// Usage: node render2.js WORKDIR   (reads WORKDIR/slides.json, writes WORKDIR/out/*.jpg)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Pinyon', 'pinyon-script', 400), ff('Delafield', 'mrs-saint-delafield', 400), ff('Italianno', 'italianno', 400),
  ff('Corm', 'cormorant-garamond', 500), ff('Corm', 'cormorant-garamond', 600), ff('Corm', 'cormorant-garamond', 500, 'italic'),
].join('') + `
:root{--ink:#F4E7A1}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#111;font-family:Corm}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.74) contrast(.86) brightness(1.05) sepia(.16)}
.matte{position:absolute;inset:0;background:rgba(214,206,186,.10);mix-blend-mode:screen}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(120,150,160,.10),rgba(200,160,110,.10));mix-blend-mode:soft-light}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 48%,rgba(0,0,0,0) 58%,rgba(0,0,0,.28) 100%)}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.halo{position:absolute;inset:0;background:radial-gradient(ellipse at 50% var(--ty,40%),rgba(0,0,0,.30),rgba(0,0,0,.08) 30%,rgba(0,0,0,0) 55%)}
.txt{position:absolute;left:70px;right:70px;text-align:center;color:var(--ink);text-shadow:0 2px 22px rgba(0,0,0,.28),0 1px 3px rgba(0,0,0,.18)}
.kick{font-weight:600;font-size:24px;letter-spacing:.42em;opacity:.95;margin-bottom:6px}
.script{font-family:Pinyon;font-weight:400;line-height:.95}
.serifcap{font-weight:500;letter-spacing:.16em}
.cover .script{font-size:250px}
.cover .serifcap{font-size:74px;letter-spacing:.12em;margin-top:-6px}
.cover .sub{font-style:italic;font-weight:600;font-size:44px;margin-top:26px;opacity:.95}
.mv .script{font-size:150px}
.mv .meta{font-size:30px;letter-spacing:.32em;margin-top:24px;font-weight:600}
.mv .line{font-style:italic;font-weight:600;font-size:46px;line-height:1.25;margin:20px auto 0;max-width:900px}
.end .script{font-size:200px}
.end .line{font-style:italic;font-weight:600;font-size:46px;line-height:1.35;margin-top:24px}
.end .store{display:inline-block;margin-top:40px;font-weight:600;font-size:24px;letter-spacing:.38em;border:1.5px solid var(--ink);padding:16px 30px 14px 38px;border-radius:40px}
.swipe{position:absolute;bottom:58px;width:100%;text-align:center;color:var(--ink);font-style:italic;font-size:30px;opacity:.9;text-shadow:0 1px 10px rgba(0,0,0,.35)}
.brand{position:absolute;top:56px;width:100%;text-align:center;color:var(--ink);font-weight:600;font-size:20px;letter-spacing:.6em;opacity:.85;text-shadow:0 1px 10px rgba(0,0,0,.3)}
.num{position:absolute;top:56px;width:100%;text-align:center;color:var(--ink);font-weight:600;font-size:22px;letter-spacing:.3em;opacity:.85;text-shadow:0 1px 10px rgba(0,0,0,.3)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    const pos = `top:${s.ty ?? 38}%;transform:translateY(-50%)`;
    let body;
    if (s.type === 'cover') body = `<div class="brand">CINEMA</div><div class="txt cover" style="${pos}">${s.kick ? `<div class="kick">${s.kick}</div>` : ''}<div class="script">${s.h}</div><div class="serifcap">${s.h2}</div>${s.sub ? `<div class="sub">${s.sub}</div>` : ''}</div><div class="swipe">swipe for the lineup &nbsp;→</div>`;
    else if (s.type === 'end') body = `<div class="txt end" style="${pos}"><div class="script">Cinema</div><div class="line">${s.p}</div><div class="store">ON THE APP STORE</div></div>`;
    else body = `<div class="txt mv" style="${pos}${s.ink ? `;--ink:${s.ink};text-shadow:0 1px 14px rgba(255,255,255,.35)` : ''}"><div class="script" style="font-size:${s.fs || 150}px">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()}</div><div class="line">${s.ov}</div></div>`;
    const html = `<html><head><style>${css}</style></head><body><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="matte"></div><div class="tint"></div><div class="halo" style="--ty:${s.ty ?? 38}%"></div><div class="vig"></div><div class="grain"></div>${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
