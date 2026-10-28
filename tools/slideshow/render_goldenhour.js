// "golden hour" anime post: full-bleed cover (Kaushan brush + Prata caps, rust ink) + FRAMED STILL inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [ff('Kaushan', 'kaushan-script', 400), ff('Prata', 'prata', 400), ff('Mont', 'montserrat', 500), ff('Mont', 'montserrat', 600),
  ff('Corm', 'cormorant-garamond', 500), ff('Corm', 'cormorant-garamond', 600), ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#E9B56E}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(.94) brightness(1.02) sepia(.08)}
.cv .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,210,150,.10),rgba(255,170,90,.12));mix-blend-mode:soft-light}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(60,20,0,.22) 100%)}
.cv .t{position:absolute;left:78px;top:150px;width:760px;color:var(--ink)}
.cv .kick{font-family:Mont;font-weight:600;font-size:23px;letter-spacing:.42em;margin-left:6px}
.cv .h{font-family:Kaushan;font-size:238px;line-height:1;margin-top:18px;margin-left:-10px;transform:rotate(-4deg);transform-origin:left center}
.cv .h2{font-family:Prata;font-size:118px;letter-spacing:.3em;margin-top:-34px;margin-left:220px}
.cv .sub{font-family:Corm;font-style:italic;font-weight:600;font-size:44px;margin-top:22px;margin-left:8px;line-height:1.2}
.cv .swipe{position:absolute;bottom:58px;left:78px;font-family:Mont;font-weight:600;font-size:19px;letter-spacing:.38em;color:var(--ink);opacity:.85}
/* framed inside */
.fr{background:#F1E9DA}
.fr .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.35),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(150,110,60,.12),rgba(0,0,0,0) 60%)}
.fr .ph{position:absolute;left:54px;top:54px;width:972px;height:900px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.06)}
.fr .ph img{width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(.95) sepia(.1) brightness(1.02)}
.fr .ph .g{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain}}
.fr .num{position:absolute;right:56px;top:990px;font-family:Kaushan;font-size:64px;color:var(--ac);opacity:.9}
.fr .tt{position:absolute;left:58px;top:984px;width:820px;font-family:Prata;font-size:66px;line-height:1.05;letter-spacing:.03em;color:var(--ac);text-transform:uppercase}
.fr .meta{position:absolute;left:60px;top:var(--mt);font-family:Corm;font-weight:600;font-size:34px;color:#3A2F27;letter-spacing:.02em}
.fr .meta i{font-weight:500}
.fr .rule{position:absolute;left:60px;top:calc(var(--mt) + 62px);width:70px;height:2px;background:var(--ac);opacity:.7}
.fr .line{position:absolute;left:60px;right:60px;top:calc(var(--mt) + 84px);font-family:Corm;font-style:italic;font-weight:500;font-size:40px;line-height:1.22;color:#4A3E35}
.fr .brand{position:absolute;right:58px;bottom:42px;font-family:Mont;font-weight:600;font-size:15px;letter-spacing:.5em;color:#7A6A5A;opacity:.75}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<body class="cv" style="--ink:${s.ink}"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="warm"></div><div class="vig"></div><div class="grain" style="opacity:.18"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="h">${s.h}</div><div class="h2">${s.h2}</div><div class="sub">${s.sub}</div></div><div class="swipe">SWIPE &nbsp;→</div></body>`;
    else { const two = s.t.includes('<br>'); const mt = two ? 1138 : 1066;
      body = `<body class="fr" style="--ac:${s.ac};--mt:${mt}px"><div class="paper"></div><div class="grain" style="opacity:.10"></div>
      <div class="ph"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="g"></div></div>
      <div class="tt">${s.t}</div><div class="num">${s.n}</div>
      <div class="meta">${s.dir} &nbsp;<i>(${s.yr})</i></div><div class="rule"></div><div class="line">${s.ov}</div><div class="brand">CINEMA</div></body>`; }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head>${body}</html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
