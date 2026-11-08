// "anime that feel like the future the 90s dreamed of" — cover: Ghost in the Shell rainy neon street, full-bleed, dark top shade,
// Chakra Petch spaced kicker + Instrument Serif italic 'the future' + giant cyan Michroma 'THE 90s' w/ glow + italic 'dreamed of',
// vertical Noto Serif JP '未来都市' on the right edge. Inside: NIGHT FILE (ink-navy page, edge-to-edge wide still w/ neon hairline,
// small inset still w/ accent frame, vertical JP original title in per-film neon accent, Instrument Serif title, Chakra meta, italic line, neon dash progress).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('In', 'instrument-serif', 400), ff('In', 'instrument-serif', 400, 'italic'), ff('Ch', 'chakra-petch', 500), ff('Ch', 'chakra-petch', 600), ff('Mi', 'michroma', 400)].join('');
const JP = `'Noto Serif CJK JP'`;
const grain = `<div class="grain"></div>`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.2;mix-blend-mode:overlay;pointer-events:none;z-index:50;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  const I = c.ink;
  const css = `${base}
body{background:#0B0A10}
.im{position:absolute;inset:0;background:url(file://${D}/${c.img}) ${c.x}% 50%/cover;filter:saturate(1.08) contrast(1.05)}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,8,14,.86) 0%,rgba(6,8,14,.62) 26%,rgba(6,8,14,.12) 50%,rgba(6,8,14,0) 62%,rgba(6,8,14,.45) 100%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 58%,rgba(0,0,0,.4) 100%)}
.t{position:absolute;left:70px;top:${c.ty}px;color:#F3F1EC}
.kick{font-family:Ch;font-weight:600;font-size:30px;letter-spacing:.42em;color:rgba(243,241,236,.9)}
.l1{font-family:In;font-style:italic;font-size:128px;line-height:1;margin-top:26px;letter-spacing:-.01em}
.hero{font-family:Mi;font-size:178px;line-height:1;margin-top:6px;margin-left:-6px;color:${I};letter-spacing:-.02em;
 text-shadow:0 0 18px ${I}99,0 0 50px ${I}55,0 0 90px ${I}33}
.l3{font-family:In;font-style:italic;font-size:128px;line-height:1;margin-top:4px;padding-left:250px;letter-spacing:-.01em}
.sub{font-family:In;font-style:italic;font-size:38px;margin-top:30px;color:rgba(243,241,236,.92)}
.sub b{font-weight:400;color:${I}}
.jp{position:absolute;right:58px;top:96px;writing-mode:vertical-rl;font-family:${JP};font-weight:700;font-size:46px;letter-spacing:.32em;color:${I};
 text-shadow:0 0 14px ${I}88}
.jp2{position:absolute;right:122px;top:100px;writing-mode:vertical-rl;font-family:Ch;font-weight:500;font-size:20px;letter-spacing:.4em;color:rgba(243,241,236,.6)}
.sw{position:absolute;bottom:54px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Ch;font-weight:600;font-size:26px;letter-spacing:.32em;color:rgba(243,241,236,.92)}
.sw b{font-weight:600;color:${I}}`;
  return `<html><head><style>${css}</style></head><body><div class="im"></div><div class="shade"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="l1">${c.h}</div><div class="hero">${c.h2}</div><div class="l3">${c.h3}</div><div class="sub">${c.sub}</div></div>
<div class="jp">${c.jp}</div><div class="jp2">${c.jp2}</div>
<div class="sw"><span>${c.swl}</span><span><b>${c.swr}</b></span></div>${grain}</body></html>`;
}

function night(m, i, n) {
  const A = m.acc;
  const dash = Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  const css = `${base}
body{background:#0A0C13}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse at 85% 75%,${A}22,rgba(0,0,0,0) 55%),radial-gradient(ellipse at 10% 0%,rgba(90,110,160,.12),rgba(0,0,0,0) 50%)}
.top{position:absolute;top:56px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Ch;font-weight:600;font-size:25px;letter-spacing:.34em;color:rgba(236,236,240,.75)}
.top b{font-weight:600;color:${A}}
.main{position:absolute;left:0;top:118px;width:1080px;height:600px;overflow:hidden}
.main img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(1.08) contrast(1.04)}
.main:after{content:'';position:absolute;left:0;right:0;bottom:0;height:3px;background:${A};box-shadow:0 0 18px ${A}}
.inset{position:absolute;right:64px;top:668px;width:400px;height:250px;border:3px solid ${A};box-shadow:0 0 22px ${A}66,0 20px 40px rgba(0,0,0,.6);overflow:hidden}
.inset img{width:100%;height:100%;object-fit:cover;object-position:${m.x2 ?? 50}% ${m.y2 ?? 50}%;filter:saturate(1.05)}
.jp{position:absolute;right:76px;top:950px;writing-mode:vertical-rl;font-family:${JP};font-weight:700;font-size:${m.jfs || 40}px;letter-spacing:.18em;color:${A};text-shadow:0 0 12px ${A}77;max-height:300px}
.txt{position:absolute;left:64px;top:770px;width:${m.tw || 560}px;color:#F1EFEA}
.no{font-family:Mi;font-size:30px;color:${A};letter-spacing:.06em}
.ttl{font-family:In;font-size:${m.fs || 96}px;line-height:.98;margin-top:22px;letter-spacing:-.01em}
.meta{font-family:Ch;font-weight:500;font-size:24px;letter-spacing:.24em;color:rgba(241,239,234,.66);margin-top:24px}
.line{position:absolute;left:64px;top:${m.ly || 1110}px;width:820px;font-family:In;font-style:italic;font-size:44px;line-height:1.2;color:rgba(241,239,234,.95)}
.prog{position:absolute;left:64px;bottom:62px;display:flex;gap:10px}
.prog i{width:54px;height:4px;background:rgba(241,239,234,.22)}.prog i.on{background:${A};box-shadow:0 0 12px ${A}}
.ft{position:absolute;right:64px;bottom:52px;font-family:Ch;font-weight:600;font-size:22px;letter-spacing:.32em;color:rgba(241,239,234,.55)}`;
  return `<html><head><style>${css}</style></head><body><div class="glow"></div>
<div class="top"><span>THE 90s FUTURE</span><span><b>FILE 0${i + 1}</b> / 0${n}</span></div>
<div class="main"><img src="file://${D}/${m.img}"></div>
<div class="inset"><img src="file://${D}/${m.img2}"></div>
<div class="txt"><div class="no">0${i + 1}</div><div class="ttl">${m.t}</div><div class="meta">${m.meta}</div></div>
<div class="jp">${m.jp}</div>
<div class="line">${m.ov}</div>
<div class="prog">${dash}</div><div class="ft">${m.ft}</div>${grain}</body></html>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, night(m, i, S.movies.length)])];
  for (const [f, html] of pages) {
    if (process.argv[3] && !f.startsWith(process.argv[3])) continue;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
