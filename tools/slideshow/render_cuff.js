// "anime love stories for cuffing season" — cover: Kaguya-sama film sunset + rainbow, hands held, image set low under
// extended dusky plum sky; Manrope spaced kicker + blush Rouge Script 'cuffing' + cream Bodoni Moda wide SEASON +
// Cormorant italic sub, '05 ANIME · SWIPE →' footer, grain.
// inside: PHOTO BOOTH (per-film wool-coloured page w/ knit texture, '♡ CUFFING SEASON / Nº 0X / 05' header, big still
// as a cream-matted print tilted -1°, white photo-booth strip of 2 stills taped & tilted over its lower-right corner,
// Manrope meta in per-film accent, DM Serif title, Cormorant italic line, Caveat 'for: …' note, heart progress).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Rg', 'rouge-script', 400), ff('Bo', 'bodoni-moda', 500), ff('Bo', 'bodoni-moda', 400, 'italic'), ff('Mn', 'manrope', 500), ff('Mn', 'manrope', 700),
  ff('DS', 'dm-serif-display', 400), ff('Co', 'cormorant-garamond', 500, 'italic'), ff('Cv', 'caveat', 500)].join('');
const grain = `<div class="grain"></div>`;
const BLUSH = '#FFB3C1', CREAM = '#F8EEE2';
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.17;mix-blend-mode:overlay;pointer-events:none;z-index:50;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  const css = `${base}
body{background:#1E1226}
.bg{position:absolute;inset:-60px;background:url(file://${D}/${c.img}) ${c.x}% 0%/cover;filter:blur(40px) brightness(.42) saturate(1.2)}
.bgtint{position:absolute;inset:0;background:linear-gradient(180deg,#1A0F22 0%,rgba(36,18,40,.88) 28%,rgba(60,26,40,.25) 55%,rgba(0,0,0,0) 70%)}
.im{position:absolute;left:0;top:${c.top}px;width:1080px;height:${1350 - c.top}px;overflow:hidden;
 -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.fade}px)}
.im img{width:100%;height:100%;object-fit:cover;object-position:${c.x}% 0%;filter:saturate(1.04) contrast(1.04)}
.bot{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(25,10,14,.7),rgba(25,10,14,0))}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 58%,rgba(20,6,18,.4) 100%)}
.t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
.kick{font-family:Mn;font-weight:500;font-size:27px;letter-spacing:.46em;padding-left:.46em;color:rgba(248,238,226,.88)}
.hero{font-family:Rg;font-size:220px;line-height:.9;color:${BLUSH};margin-top:10px;text-shadow:0 0 40px rgba(255,150,170,.35),0 5px 20px rgba(0,0,0,.45)}
.l2{font-family:Bo;font-weight:500;font-size:96px;line-height:1;letter-spacing:.34em;padding-left:.34em;color:${CREAM};margin-top:-18px;text-shadow:0 6px 30px rgba(0,0,0,.5)}
.sub{font-family:Co;font-style:italic;font-weight:500;font-size:40px;margin-top:22px;color:rgba(248,238,226,.95);text-shadow:0 2px 14px rgba(0,0,0,.7)}
.sub em{color:${BLUSH}}
.sw{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Mn;font-weight:500;font-size:22px;letter-spacing:.4em;padding-left:.4em;color:rgba(248,238,226,.95);text-shadow:0 2px 10px rgba(0,0,0,.7)}
.sw b{font-weight:700;color:${BLUSH}}`;
  return `<html><head><style>${css}</style></head><body><div class="bg"></div><div class="bgtint"></div>
<div class="im"><img src="file://${D}/${c.img}"></div><div class="bot"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="hero">${c.h}</div><div class="l2">${c.h2}</div><div class="sub">${c.sub}</div></div>
<div class="sw">${c.swipe}</div>${grain}</body></html>`;
}

function card(m, i, n) {
  const P = m.page, A = m.acc;
  const css = `${base}
body{background:${P}}
.knit{position:absolute;inset:0;opacity:.10;background-image:
 repeating-linear-gradient(60deg,rgba(255,255,255,.5) 0 2px,transparent 2px 14px),
 repeating-linear-gradient(-60deg,rgba(0,0,0,.6) 0 2px,transparent 2px 14px)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 32%,rgba(255,240,220,.10),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)}
.top{position:absolute;top:50px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Mn;font-weight:500;font-size:21px;letter-spacing:.34em;color:rgba(248,238,226,.82)}
.top b{font-weight:700;color:${A}}
.pr{position:absolute;left:58px;top:112px;width:964px;height:700px;background:${CREAM};padding:14px;transform:rotate(-1deg);box-shadow:0 26px 60px rgba(0,0,0,.45)}
.pr img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(1.05) contrast(1.04) sepia(.04);display:block}
.strip{position:absolute;left:772px;top:${m.sy ?? 690}px;width:262px;background:#FBF8F2;padding:14px 14px 0;transform:rotate(5deg);box-shadow:0 22px 46px rgba(0,0,0,.5)}
.strip .f{width:234px;height:150px;overflow:hidden;margin-bottom:12px;background:#222}
.strip img{width:100%;height:100%;object-fit:cover;filter:saturate(1.04) contrast(1.05)}
.strip .cap{font-family:Cv;font-weight:500;font-size:30px;color:#4a3b3b;text-align:center;padding:0 0 12px;line-height:1}
.tape{position:absolute;left:84px;top:-18px;width:96px;height:34px;background:rgba(255,240,220,.55);transform:rotate(-4deg);box-shadow:0 1px 3px rgba(0,0,0,.15)}
.txt{position:absolute;left:72px;width:${m.tw || 660}px;top:${m.ty || 880}px;color:${CREAM}}
.meta{font-family:Mn;font-weight:700;font-size:19px;letter-spacing:.26em;color:${A}}
.ttl{font-family:DS;font-size:${m.fs || 86}px;line-height:1.02;margin-top:14px}
.line{font-family:Co;font-style:italic;font-weight:500;font-size:40px;line-height:1.22;margin-top:18px;color:rgba(248,238,226,.92)}
.note{font-family:Cv;font-weight:500;font-size:40px;color:${A};margin-top:16px}
.prog{position:absolute;left:0;right:0;bottom:46px;display:flex;justify-content:center;gap:22px;font-size:30px;color:rgba(248,238,226,.45);font-family:Mn}
.prog .on{color:${A}}`;
  const pr = Array.from({ length: n }, (_, k) => `<span class="${k === i ? 'on' : ''}">${k === i ? '♥' : '♡'}</span>`).join('');
  return `<html><head><style>${css}</style></head><body><div class="knit"></div><div class="vig"></div>
<div class="top"><span>♡ CUFFING SEASON</span><span><b>Nº 0${i + 1}</b> / 0${n}</span></div>
<div class="pr"><img src="file://${D}/${m.img}"></div>
<div class="strip"><div class="tape"></div>${m.strip.map(s => `<div class="f"><img src="file://${D}/${s}"></div>`).join('')}<div class="cap">${m.cap}</div></div>
<div class="txt"><div class="meta">${m.meta}</div><div class="ttl">${m.t}</div><div class="line">${m.ov}</div><div class="note">${m.note}</div></div>
<div class="prog">${pr}</div>${grain}</body></html>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, card(m, i, S.movies.length)])];
  for (const [f, html] of pages) {
    if (process.argv[3] && !f.startsWith(process.argv[3])) continue;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
