// "make something" anime: cover (Blue Giant moon, brass Homemade Apple 'create' + Bodoni caps) + GALLERY WALL inside slides
// (per-film painted wall, spotlight, framed still w/ white mat, small framed 2nd still, museum wall label). node render_create.js DIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_create.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Ha', 'homemade-apple', 400) + ff('Bo', 'bodoni-moda', 500) + ff('Bo', 'bodoni-moda', 400, 'italic') + ff('Bo', 'bodoni-moda', 600, 'italic') +
  ff('Ws', 'work-sans', 400) + ff('Ws', 'work-sans', 500) + ff('Ws', 'work-sans', 600);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Ws}`;
function cover(c) {
  return `<html><head><style>${fonts}${base}
  body{background:#050a1c}
  .img{position:absolute;left:0;top:${c.top}px;width:1080px;height:${c.h}px;background:url(file://${D}/${c.img}) ${c.px}% ${c.py}%/${c.bs};
    filter:contrast(1.06) saturate(1.04);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.mt}px,#000 ${c.h - c.mb}px,transparent 100%)}
  .shade{position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 22% 58%,rgba(3,8,26,.55),transparent 70%)}
  .kick{position:absolute;left:${c.kx}px;top:${c.ky}px;font:500 21px Ws;letter-spacing:.42em;color:rgba(235,240,255,.88);text-shadow:0 2px 14px rgba(0,0,0,.6)}
  .hero{position:absolute;left:${c.hx}px;top:${c.hy}px;font:400 ${c.hs}px/1 Ha;color:${c.ink};transform:rotate(-6deg);transform-origin:left center;
     text-shadow:0 0 30px ${c.ink}55,0 4px 22px rgba(0,0,0,.55)}
  .low{position:absolute;left:0;right:0;bottom:${c.lb}px;text-align:center}
  .caps{font:500 54px Bo;letter-spacing:.32em;color:#F6EFE2;padding-left:.32em;text-shadow:0 3px 18px rgba(0,0,0,.6)}
  .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin:24px 0 20px;color:${c.ink};font:400 18px Ws;letter-spacing:.3em}
  .rule i{display:block;width:120px;height:1px;background:${c.ink};opacity:.8}
  .sub{font:italic 400 33px/1.35 Bo;color:rgba(246,239,226,.92)}
  </style></head><body><div class="img"></div><div class="shade"></div>
  <div class="kick">${c.kick}</div><div class="hero">${c.h1}</div>
  <div class="low"><div class="caps">${c.h2}</div><div class="rule"><i></i>${c.mark}<i></i></div><div class="sub">${c.sub}</div></div>${grain(.17)}</body></html>`;
}
function inside(m, i, n) {
  return `<html><head><style>${fonts}${base}
  body{background:${m.wall}}
  .wall{position:absolute;inset:0;background:radial-gradient(ellipse 60% 42% at 50% 6%,rgba(255,244,220,.30),transparent 70%),
     radial-gradient(ellipse 120% 80% at 50% 40%,transparent 50%,rgba(0,0,0,.35) 100%)}
  .beam{position:absolute;left:50%;top:0;width:760px;height:900px;transform:translateX(-50%);background:radial-gradient(ellipse 50% 60% at 50% 0,rgba(255,240,210,.16),transparent 75%)}
  .lamp{position:absolute;left:50%;top:0;width:160px;height:14px;transform:translateX(-50%);background:linear-gradient(#2a2a2a,#111);border-radius:0 0 8px 8px;box-shadow:0 6px 18px rgba(0,0,0,.4)}
  .hdr{position:absolute;top:44px;left:66px;right:66px;display:flex;justify-content:space-between;font:500 19px Ws;letter-spacing:.38em;color:rgba(255,255,255,.78)}
  .frame{position:absolute;left:96px;top:118px;width:888px;height:${m.fh || 650}px;background:linear-gradient(135deg,${m.fr1},${m.fr2});padding:16px;
     box-shadow:0 30px 60px rgba(0,0,0,.45),0 8px 16px rgba(0,0,0,.3)}
  .mat{width:100%;height:100%;background:#F7F3EA;padding:38px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08),inset 0 2px 6px rgba(0,0,0,.12)}
  .pic{width:100%;height:100%;background:url(file://${D}/${m.big}) ${m.bx || 50}% ${m.by || 50}%/cover;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25),inset 0 3px 10px rgba(0,0,0,.25);filter:contrast(1.04)}
  .small{position:absolute;left:96px;top:${(m.fh || 650) + 118 + 62}px;width:330px;height:${m.sh || 410}px;background:linear-gradient(135deg,${m.fr1},${m.fr2});padding:10px;
     box-shadow:0 20px 40px rgba(0,0,0,.42)}
  .small .mat{padding:22px}
  .label{position:absolute;left:486px;top:${(m.fh || 650) + 118 + 62}px;width:498px;background:#FBF8F1;padding:34px 36px 30px;box-shadow:0 10px 26px rgba(0,0,0,.32);color:#1b1a18}
  .no{font:600 15px Ws;letter-spacing:.34em;color:${m.acc}}
  .t{font:italic 600 ${m.fs || 54}px/1.04 Bo;margin:14px 0 10px;color:#1b1a18}
  .meta{font:500 16px Ws;letter-spacing:.24em;color:#55514a}
  .hr{height:1px;background:#d9d3c6;margin:18px 0 16px}
  .med{font:400 17px/1.5 Ws;color:#3b3833}.med b{font-weight:600;letter-spacing:.18em;font-size:13px;color:${m.acc};display:block;margin-bottom:4px}
  .line{font:italic 400 24px/1.36 Bo;color:#2a2824;margin-top:16px}
  </style></head><body><div class="wall"></div><div class="beam"></div><div class="lamp"></div>
  <div class="hdr"><span>GALLERY OF MAKERS</span><span>${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>
  <div class="frame"><div class="mat"><div class="pic"></div></div></div>
  <div class="small"><div class="mat"><div class="pic" style="background-image:url(file://${D}/${m.inset});background-position:${m.ix || 50}% ${m.iy || 50}%"></div></div></div>
  <div class="label"><div class="no">WORK Nº 0${i + 1}</div><div class="t">${m.t}</div><div class="meta">${m.meta}</div><div class="hr"></div>
   <div class="med"><b>MEDIUM</b>${m.medium}</div><div class="line">${m.line}</div></div>${grain(.12)}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const jobs = [['01_cover', cover(S.cover)], ...S.films.map((m, i) => [`0${i + 2}_${m.slug}`, inside(m, i, S.films.length)])];
  const only = process.argv[3];
  for (const [name, html] of jobs) { if (only && !name.startsWith(only)) continue;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${D}/out/${name}.jpg`, type: 'jpeg', quality: 93 }); }
  await b.close();
})();
