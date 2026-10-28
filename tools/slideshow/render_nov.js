// "films that feel like november" — cover: full-bleed Fox hillside, espresso Playfair italic; inside: DUOTONE.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Play', 'playfair-display', 900, 'italic'), ff('Play', 'playfair-display', 500, 'italic'), ff('Play', 'playfair-display', 700, 'normal'),
  ff('Abril', 'abril-fatface', 400), ff('Ital', 'italianno', 400),
  ff('Mont', 'montserrat', 500), ff('Mont', 'montserrat', 600),
  ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.24;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(.92) brightness(1.04) sepia(.08)}
.matte{position:absolute;inset:0;background:rgba(240,215,180,.08);mix-blend-mode:screen}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(40,10,0,.32) 100%)}
.ctxt{position:absolute;left:0;right:0;text-align:center;color:var(--ink)}
.kick{font-family:Mont;font-weight:600;font-size:24px;letter-spacing:.55em;padding-left:.55em}
.hero{font-family:Play;font-style:italic;font-weight:900;font-size:212px;line-height:.92;letter-spacing:-.02em;margin-top:18px}
.csub{font-family:Corm;font-style:italic;font-weight:600;font-size:44px;margin-top:22px}
.rule{width:90px;height:2px;background:var(--ink);margin:30px auto 0;opacity:.8}
.cfoot{position:absolute;bottom:56px;left:0;right:0;text-align:center;color:#FBE9D6;font-family:Mont;font-weight:500;font-size:20px;letter-spacing:.45em;text-shadow:0 1px 12px rgba(60,20,0,.6)}
/* duotone */
.page{position:absolute;inset:0;background:var(--mid)}
.top{position:absolute;top:52px;left:60px;right:60px;display:flex;justify-content:space-between;color:var(--light);font-family:Mont;font-weight:600;font-size:19px;letter-spacing:.4em;opacity:.9}
.duo{position:absolute;left:60px;width:960px;height:410px;overflow:hidden;background:var(--light)}
.duo img{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.12) brightness(1.02);mix-blend-mode:multiply;display:block}
.duo:after{content:'';position:absolute;inset:0;background:var(--dark);mix-blend-mode:lighten}
.ghost{position:absolute;right:56px;font-family:Ital;font-size:250px;line-height:1;color:var(--light);opacity:.26;white-space:nowrap}
.title{position:absolute;left:60px;right:60px;font-family:Abril;font-size:var(--fs,100px);line-height:.98;color:var(--light);letter-spacing:-.005em}
.dir{position:absolute;left:62px;color:var(--light);font-family:Mont;font-weight:600;font-size:19px;letter-spacing:.34em}
.dir b{font-weight:600;opacity:.65}
.quote{position:absolute;left:60px;right:60px;bottom:58px;color:var(--light);font-family:Corm;font-style:italic;font-weight:500;font-size:36px;opacity:.95}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') body = `<img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="matte"></div><div class="vig"></div>
      <div class="ctxt" style="--ink:${s.ink};top:${s.top}px"><div class="kick">${s.kick}</div><div class="hero">${s.h}</div><div class="csub">${s.sub}</div></div>
      <div class="cfoot">SWIPE &nbsp;→</div><div class="grain"></div>`;
    else body = `<div class="page" style="--mid:${s.mid};--dark:${s.dark};--light:${s.light};--fs:${s.fs || 100}px">
      <div class="top"><span>N° ${s.n} / 05</span><span>NOVEMBER FILMS</span></div>
      <div class="duo" style="top:110px"><img src="file://${D}/${s.a}" style="object-position:${s.ax ?? 50}% ${s.ay ?? 50}%"></div>
      <div class="duo" style="top:534px"><img src="file://${D}/${s.b}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"></div>
      <div class="ghost" style="top:${s.gy ?? 905}px">${s.ghost}</div>
      <div class="title" style="top:${s.tt ?? 985}px">${s.t}</div>
      <div class="dir" style="top:${(s.tt ?? 985) + 2*(s.fs||100) + 26}px">DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; <b>${s.yr}</b></div>
      <div class="quote">${s.q}</div></div><div class="grain"></div>`;
    const html = `<html><head><style>${css}</style></head><body>${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
