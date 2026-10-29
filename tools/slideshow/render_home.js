// "coming home" — cover: Up house in clouds, rust Yellowtail + Prata caps; inside: MAGAZINE layout.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Yt', 'yellowtail', 400), ff('Prata', 'prata', 400), ff('Jost', 'jost', 400), ff('Jost', 'jost', 500),
  ff('Anton', 'anton', 400), ff('Gar', 'eb-garamond', 400), ff('Gar', 'eb-garamond', 500), ff('Gar', 'eb-garamond', 500, 'italic'), ff('Gar', 'eb-garamond', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#cfe0ea}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(.95) sepia(.12) brightness(1.01)}
.cv .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,226,196,.16),rgba(255,236,214,.0) 45%,rgba(255,214,180,.20));mix-blend-mode:multiply}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 62%,rgba(40,30,20,.16) 100%)}
.ink{color:#8A3418}
.brand{position:absolute;top:58px;width:100%;text-align:center;font-family:Jost;font-weight:500;font-size:19px;letter-spacing:.62em;opacity:.8}
.top{position:absolute;top:96px;width:100%;text-align:center}
.kick{font-family:Jost;font-weight:500;font-size:25px;letter-spacing:.46em}
.big{font-family:Yt;font-size:200px;line-height:1;margin-top:2px;transform:rotate(-5deg);text-shadow:0 2px 30px rgba(255,248,240,.55)}
.bot{position:absolute;top:1005px;width:100%;text-align:center}
.home{font-family:Prata;font-size:122px;letter-spacing:.34em;padding-left:.34em;line-height:1;text-shadow:0 2px 26px rgba(255,248,240,.6)}
.sub{font-family:Gar;font-style:italic;font-weight:500;font-size:41px;margin-top:22px}
.swipe{position:absolute;bottom:52px;width:100%;text-align:center;font-family:Jost;font-size:18px;letter-spacing:.5em;opacity:.75}
/* magazine */
.mg{background:#F2EEE5}
.mg .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(120,100,70,.10),rgba(0,0,0,0) 60%)}
.t{position:absolute;left:58px;top:66px;width:560px;font-family:Anton;line-height:.92;text-transform:uppercase;letter-spacing:.005em}
.dl{position:absolute;left:62px;font-family:Anton;font-size:23px;line-height:1.12;letter-spacing:.04em;text-transform:uppercase;color:#2a2622;opacity:.82}
.mk{position:absolute;top:48px;right:62px;font-family:Jost;font-weight:500;font-size:15px;letter-spacing:.55em;color:#2a2622;opacity:.75}
.no{position:absolute;top:48px;left:620px;font-family:Jost;font-weight:500;font-size:15px;letter-spacing:.3em;opacity:.9}
.p{position:absolute;left:620px;right:62px;top:104px;font-family:Gar;font-size:29.5px;line-height:1.28;color:#2a2622;text-align:justify;hyphens:auto}
.p b{font-weight:600}
.p i{font-style:italic;font-weight:500}
.still{position:absolute;overflow:hidden}
.still img{width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(.96) sepia(.1)}
.still:after{content:'';position:absolute;inset:0;background:${grain};opacity:.16;mix-blend-mode:overlay}
.bigs{left:0;right:0;bottom:0;height:700px}
.ins{left:58px;width:430px;height:282px;border:11px solid #F7F4EE;box-shadow:0 10px 30px rgba(0,0,0,.28);z-index:3}
.rule{position:absolute;left:62px;width:70px;height:4px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let html;
    if (s.type === 'cover') {
      html = `<body class="cv"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="warm"></div><div class="vig"></div><div class="grain"></div>
      <div class="brand ink">CINEMA</div>
      <div class="top ink"><div class="kick">${s.kick}</div><div class="big">${s.h}</div></div>
      <div class="bot ink"><div class="home">${s.h2}</div><div class="sub">${s.sub}</div></div>
      <div class="swipe ink">SWIPE &nbsp;→</div></body>`;
    } else {
      const ty = s.dly ?? 400;
      html = `<body class="mg"><div class="paper"></div>
      <div class="mk">CINEMA</div><div class="no" style="color:${s.c}">${s.n} / 05</div>
      <div class="t" style="color:${s.c};font-size:${s.fs || 160}px">${s.t}</div>
      <div class="rule" style="top:${ty - 22}px;background:${s.c}"></div>
      <div class="dl" style="top:${ty}px">Directed by<br>${s.dir} &nbsp;·&nbsp; ${s.yr}</div>
      <div class="p">${s.p}</div>
      <div class="still bigs"><img src="file://${D}/${s.big}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"></div>
      <div class="still ins" style="top:${s.iy ?? 520}px"><img src="file://${D}/${s.ins}" style="object-position:${s.ix ?? 50}% ${s.iyy ?? 50}%"></div>
      <div class="grain" style="opacity:.12"></div></body>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head>${html}</html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
