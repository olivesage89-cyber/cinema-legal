// "Lovable grumps" — cover: Alfa Slab GRUMPY + Dancing Script; inside: OUTSIDE / INSIDE poster cards.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Slab','alfa-slab-one',400), ff('Dance','dancing-script',700), ff('Dance','dancing-script',600),
  ff('Frank','libre-franklin',500), ff('Frank','libre-franklin',600), ff('Frank','libre-franklin',700),
  ff('SS','source-serif-4',400,'italic'), ff('SS','source-serif-4',500,'italic'), ff('SS','source-serif-4',600,'italic')].join('');
const grain = `.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;z-index:50;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}${grain}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const cover = c => `<style>
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(.95) brightness(1.0) sepia(.08)}
.warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,20,60,.20),rgba(0,0,0,0) 35%,rgba(255,190,120,.08) 70%,rgba(20,10,0,.45));}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(0,0,0,.32) 100%)}
.t{position:absolute;left:0;right:0;top:${c.top||64}px;text-align:center;color:#fff;text-shadow:0 3px 30px rgba(10,25,70,.35)}
.kick{font-family:Frank;font-weight:600;font-size:23px;letter-spacing:.42em;padding-left:.42em;opacity:.95}
.g{font-family:Slab;font-size:196px;line-height:.92;letter-spacing:.01em;margin-top:14px;color:#FFF8EC;text-shadow:0 6px 0 rgba(20,40,90,.18),0 4px 34px rgba(10,25,70,.35)}
.l2{display:flex;justify-content:center;align-items:baseline;gap:20px;margin-top:-6px}
.o{font-family:SS;font-style:italic;font-weight:500;font-size:44px;color:#FFF8EC}
.s{font-family:Dance;font-weight:700;font-size:104px;color:${c.ink};transform:rotate(-4deg);display:inline-block;text-shadow:0 3px 18px rgba(10,25,70,.45)}
.sub{position:absolute;left:0;right:0;bottom:54px;text-align:center;font-family:SS;font-style:italic;font-weight:500;font-size:36px;color:#FFF8EC;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.sub b{font-family:Frank;font-style:normal;font-weight:600;font-size:20px;letter-spacing:.4em;display:block;margin-bottom:12px;opacity:.85}
</style><img class="bg" src="file://${D}/${c.img}"><div class="warm"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="g">${c.h}</div><div class="l2"><span class="o">${c.o}</span><span class="s">${c.s}</span></div></div>
<div class="sub">${c.sub}</div><div class="grain"></div>`;
const film = (m, i, n) => `<style>
body{background:${m.bg}}
.still{position:absolute;left:0;top:0;width:1080px;height:780px;clip-path:polygon(0 0,100% 0,100% 84%,0 100%);overflow:hidden}
.still img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(.85) contrast(.95) sepia(.1) brightness(1.02)}
.still:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.28),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 75%,rgba(0,0,0,.25))}
.tag{position:absolute;top:46px;left:52px;font-family:Frank;font-weight:600;font-size:20px;letter-spacing:.34em;color:#fff;background:rgba(0,0,0,.34);backdrop-filter:blur(6px);padding:12px 18px 11px 22px;border-radius:30px}
.tag i{font-style:normal;color:${m.acc}}
.poster{position:absolute;right:58px;top:560px;width:248px;height:372px;border:9px solid #F7F1E6;box-shadow:0 26px 50px rgba(0,0,0,.5);transform:rotate(3deg);background:#000}
.poster img{width:100%;height:100%;object-fit:cover}
.tb{position:absolute;left:60px;top:${m.tt || 806}px;width:660px;color:#FFF8EC}
.title{font-family:Slab;font-size:${m.fs || 74}px;line-height:1.0}
.meta{font-family:Frank;font-weight:600;font-size:21px;letter-spacing:.3em;margin-top:18px;color:${m.acc}}
.rows{position:absolute;left:60px;right:60px;top:1062px}
.r{display:flex;gap:26px;align-items:baseline;padding:18px 0;border-top:1.5px solid rgba(255,248,236,.18)}
.lab{flex:none;width:150px;font-family:Frank;font-weight:700;font-size:19px;letter-spacing:.32em;color:rgba(255,248,236,.6)}
.r.in .lab{color:${m.acc}}
.ol{font-family:SS;font-style:italic;font-weight:500;font-size:35px;line-height:1.2;color:#FFF8EC}
.il{font-family:Dance;font-weight:700;font-size:43px;line-height:1.05;color:${m.acc}}
.foot{position:absolute;bottom:34px;right:60px;font-family:Frank;font-weight:600;font-size:16px;letter-spacing:.4em;color:rgba(255,248,236,.4)}
</style><div class="still"><img src="file://${D}/${m.img}"></div>
<div class="tag">GRUMP <i>Nº 0${i}</i> / 0${n}</div>
<div class="poster"><img src="file://${D}/${m.poster}"></div>
<div class="tb"><div class="title">${m.t}</div><div class="meta">${m.dir.toUpperCase()} · ${m.yr}</div></div>
<div class="rows"><div class="r"><div class="lab">OUTSIDE</div><div class="ol">${m.out}</div></div><div class="r in"><div class="lab">INSIDE</div><div class="il">${m.in}</div></div></div>
<div class="grain"></div>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const shot = async (html, f) => { fs.writeFileSync(D + '/_t.html', `<html><head><style>${base}</style></head><body>${html}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 }); };
  await shot(cover(S.cover), '01_cover.jpg');
  for (const [k, m] of S.movies.entries()) await shot(film(m, k + 1, S.movies.length), `0${k + 2}_${m.slug}.jpg`);
  await b.close();
})();
