// "lonely" anime slideshow — cover: Allura script over misty marsh; inside: poster card on midnight navy.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
const css = [ff('Allura', 'allura', 400), ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'),
  ff('Mont', 'montserrat', 500), ff('Mont', 'montserrat', 600), ff('DMS', 'dm-serif-display', 400), ff('DMS', 'dm-serif-display', 400, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0F1626}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.20;mix-blend-mode:overlay;pointer-events:none;z-index:20;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(.92) brightness(1.02)}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(150,170,190,.14),rgba(90,110,140,.10));mix-blend-mode:soft-light}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.22) 100%)}
/* cover */
.cv{position:absolute;left:0;right:0;top:${S.cover.top}px;text-align:center;color:${S.cover.ink}}
.cv .glow{position:absolute;left:50%;top:50%;width:1000px;height:560px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(235,240,236,.42),rgba(235,240,236,0) 65%);z-index:-1}
.cv .k{font-family:Mont;font-weight:600;font-size:23px;letter-spacing:.48em;padding-left:.48em}
.cv .h{font-family:Allura;font-size:300px;line-height:.9;margin-top:4px;letter-spacing:-.01em}
.cv .s{font-family:Corm;font-style:italic;font-weight:600;font-size:44px;margin-top:34px;display:inline-block;padding:4px 26px;background:radial-gradient(ellipse,rgba(236,240,236,.62),rgba(236,240,236,0) 72%)}
.cv .rule{width:70px;height:1.5px;background:${S.cover.ink};margin:26px auto 0;opacity:.7}
.swipe{position:absolute;bottom:54px;width:100%;text-align:center;font-family:Mont;font-weight:600;font-size:18px;letter-spacing:.5em;color:var(--sw,#F3F1EA);opacity:.9}
/* inside: poster card */
.still{position:absolute;left:0;top:0;width:1080px;height:860px;overflow:hidden}
.still .bg{object-position:var(--x,50%) var(--y,50%)}
.top{position:absolute;left:64px;top:58px;font-family:Mont;font-weight:600;font-size:18px;letter-spacing:.42em;color:#F6F3EC;text-shadow:0 1px 12px rgba(0,0,0,.55);z-index:5}
.panel{position:absolute;left:0;right:0;bottom:0;height:640px;background:#0F1626;clip-path:polygon(0 70px,100% 0,100% 100%,0 100%);z-index:3}
.panel:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 20% 100%,rgba(60,80,120,.25),rgba(0,0,0,0) 60%)}
.poster{position:absolute;right:64px;top:600px;width:290px;height:435px;background:#F4F1EA;padding:12px;box-shadow:0 30px 60px rgba(0,0,0,.5),0 8px 18px rgba(0,0,0,.35);z-index:6;transform:rotate(2deg)}
.poster img{width:100%;height:100%;object-fit:cover;display:block}
.info{position:absolute;left:64px;width:630px;top:800px;z-index:7;color:#F3F1EA}
.n{font-family:Mont;font-weight:600;font-size:20px;letter-spacing:.4em;color:var(--acc)}
.t{font-family:DMS;font-size:var(--fs,78px);line-height:1.0;margin-top:22px;letter-spacing:-.005em}
.d{font-family:Mont;font-weight:500;font-size:19px;letter-spacing:.24em;text-transform:uppercase;margin-top:22px;color:var(--acc)}
.o{font-family:Corm;font-style:italic;font-weight:500;font-size:39px;line-height:1.22;margin-top:26px;color:rgba(243,241,234,.86)}
.mark{position:absolute;right:64px;bottom:56px;z-index:7;font-family:Allura;font-size:58px;color:var(--acc);opacity:.95}
`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (body, out) => {
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}${grain}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 });
  };
  const c = S.cover;
  await shot(`<img class="bg" src="file://${D}/${c.img}" style="object-position:${c.x}% 50%"><div class="tint"></div><div class="vig"></div>
   <div class="cv"><div class="glow"></div><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="s">${c.sub}</div><div class="rule"></div></div>
   `, '01_cover.jpg');
  for (const [i, m] of S.movies.entries()) {
    await shot(`<div class="still" style="--x:${m.x}%;--y:${m.y || 50}%"><img class="bg" src="file://${D}/${m.img}" style="transform:scale(${m.z||1})"><div class="tint"></div><div class="vig"></div></div>
     <div class="top">${S.tag}</div><div class="panel"></div>
     <div class="poster"><img src="file://${D}/${m.poster}"></div>
     <div class="info" style="--acc:${m.acc};--fs:${m.fs || 78}px"><div class="n">0${i + 1} / 05</div><div class="t">${m.t}</div>
      <div class="d">${m.dir} &nbsp;·&nbsp; ${m.yr}</div><div class="o">${m.ov}</div></div>
     <div class="mark" style="--acc:${m.acc}">lonely</div>`, `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
