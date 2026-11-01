// "anime that feel like november": cover (Galactic Railroad train in moonlit mist, extended night sky, persimmon Instrument Serif
// italic 'november' + DM Mono kicker + Shippori Mincho 霜月) + HIMEKURI inside slides (Japanese tear-off day calendar leaf on a
// per-film wall: binder clip, torn-leaf stack, big still, huge Sunday day number in per-film accent, title, meta, italic line).
// node render_novanime.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_novanime.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Is', 'instrument-serif', 400) + ff('Is', 'instrument-serif', 400, 'italic') + ff('Dm', 'dm-mono', 400) + ff('Dm', 'dm-mono', 500) + ff('Dm', 'dm-mono', 300, 'italic');
const link = `<link rel="stylesheet" href="file://${F}shippori-mincho/400.css"><link rel="stylesheet" href="file://${F}shippori-mincho/600.css">`;
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Dm}`;
const stars = (n, h, seed = 7) => { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280, o = '';
  for (let i = 0; i < n; i++) { const z = r() * 2.2 + .6; o += `<i style="left:${r() * 1080}px;top:${r() * h}px;width:${z}px;height:${z}px;opacity:${.25 + r() * .6}"></i>`; } return o; };
function cover(c) {
  return `<html><head>${link}<style>${fonts}${base}
  body{background:${c.sky}}
  .sky{position:absolute;inset:0;background:radial-gradient(ellipse 80% 45% at 50% ${c.glowy}%,rgba(170,205,215,.22),transparent 70%),linear-gradient(180deg,#070d17 0,${c.sky} 45%)}
  .st i{position:absolute;border-radius:50%;background:#e9f2ff;box-shadow:0 0 4px #cfe3ff}
  .img{position:absolute;left:0;top:${c.top}px;width:1080px;height:${c.h}px;background:url(file://${D}/${c.img}) ${c.px}% ${c.py}%/${c.bs};
    filter:contrast(1.05) saturate(.95) brightness(.97);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.mt}px,#000 ${c.h - c.mb}px,transparent 100%)}
  .warm{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0,transparent 60%,rgba(8,12,20,.55))}
  .top{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
  .kick{font:500 21px Dm;letter-spacing:.5em;padding-left:.5em;color:rgba(236,242,248,.86)}
  .hero{font:italic 400 ${c.hs}px/0.9 Is;color:${c.ink};letter-spacing:-.01em;margin-top:18px;text-shadow:0 0 40px ${c.ink}44,0 6px 30px rgba(0,0,0,.5)}
  .jp{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:22px;font:400 30px 'Shippori Mincho';letter-spacing:.5em;padding-left:.5em;color:#EDE6DA}
  .jp i{display:block;width:90px;height:1px;background:${c.ink};opacity:.85}
  .sub2{margin-top:26px;font:italic 400 36px/1.28 Is;color:rgba(244,240,232,.92);text-shadow:0 2px 16px rgba(0,0,0,.6)}
  .sub{display:none;position:absolute;left:0;right:0;bottom:${c.sb}px;text-align:center;font:italic 400 38px/1.3 Is;color:rgba(244,240,232,.95);text-shadow:0 2px 16px rgba(0,0,0,.6)}
  </style></head><body><div class="sky"></div><div class="st">${stars(140, c.top + 260)}</div><div class="img"></div><div class="warm"></div>
  <div class="top"><div class="kick">${c.kick}</div><div class="hero">${c.h1}</div><div class="jp"><i></i>${c.jp}<i></i></div><div class="sub2">${c.sub}</div></div>
  <div class="sub">${c.sub}</div>${grain(.17)}</body></html>`;
}
function inside(m, i, n) {
  const rot = [-1.2, 0.9, -0.7, 1.1, -1][i];
  return `<html><head>${link}<style>${fonts}${base}
  body{background:${m.wall}}
  .wall{position:absolute;inset:0;background:radial-gradient(ellipse 70% 50% at 50% 30%,rgba(255,255,255,.10),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 50%,transparent 45%,rgba(0,0,0,.42) 100%)}
  .hdr{position:absolute;top:34px;left:60px;right:60px;display:flex;justify-content:space-between;font:500 17px Dm;letter-spacing:.36em;color:rgba(255,255,255,.72)}
  .pad{position:absolute;left:92px;top:104px;width:896px;height:1196px;transform:rotate(${rot}deg);transform-origin:50% 0}
  .back{position:absolute;inset:0;background:#E9E1D2;box-shadow:0 30px 60px rgba(0,0,0,.45),0 6px 14px rgba(0,0,0,.3)}
  .back2{position:absolute;left:5px;right:-5px;top:6px;bottom:-9px;background:#DCD2C0;box-shadow:0 20px 40px rgba(0,0,0,.35)}
  .leaf{position:absolute;inset:0;background:#F7F2E8;padding:58px 48px 40px}
  .perf{position:absolute;left:0;right:0;top:30px;height:0;border-top:2px dotted rgba(0,0,0,.18)}
  .clip{position:absolute;left:50%;top:-30px;width:210px;height:58px;margin-left:-105px;background:linear-gradient(180deg,#43474d,#17191c);border-radius:10px 10px 6px 6px;
     box-shadow:0 8px 16px rgba(0,0,0,.45),inset 0 2px 0 rgba(255,255,255,.18);z-index:5}
  .clip:after{content:'';position:absolute;left:50%;top:-30px;width:70px;height:40px;margin-left:-35px;border:6px solid #2b2e33;border-bottom:none;border-radius:30px 30px 0 0}
  .row1{display:flex;justify-content:space-between;align-items:center;font:500 17px Dm;letter-spacing:.32em;color:#4b463e}
  .row1 .jp{font:600 28px 'Shippori Mincho';letter-spacing:.3em;color:${m.acc}}
  .pic{margin-top:20px;height:610px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:contrast(1.04) saturate(1.02);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)}
  .low{display:flex;gap:38px;margin-top:34px}
  .day{width:240px;flex:none;text-align:center;border-right:1px solid #ddd4c4;padding-right:24px}
  .num{font:400 230px/0.8 Is;color:${m.acc};letter-spacing:-.04em}
  .wd{font:500 16px Dm;letter-spacing:.34em;color:#4b463e;margin-top:22px;padding-left:.34em}
  .wdj{font:600 24px 'Shippori Mincho';color:${m.acc};margin-top:10px;letter-spacing:.2em;padding-left:.2em}
  .txt{flex:1;padding-top:4px}
  .t{font:italic 400 ${m.fs || 64}px/1 Is;color:#1d1b18}
  .meta{font:500 15px Dm;letter-spacing:.24em;color:${m.acc};margin-top:16px}
  .line{font:italic 400 30px/1.28 Is;color:#3a362f;margin-top:20px}
  .foot{position:absolute;left:48px;right:48px;bottom:34px;display:flex;justify-content:space-between;font:400 15px Dm;letter-spacing:.22em;color:#7a7266;border-top:1px solid #e3dbcc;padding-top:18px}
  .foot b{color:#2c2924;font-weight:500}
  </style></head><body><div class="wall"></div>
  <div class="hdr"><span>NOVEMBER, IN ANIME</span><span>${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>
  <div class="pad"><div class="back2"></div><div class="back"></div>
   <div class="leaf"><div class="perf"></div><div class="row1"><span>NOVEMBER 2026</span><span class="jp">霜月</span><span>Nº ${String(i + 1).padStart(2, '0')}</span></div>
    <div class="pic"></div>
    <div class="low"><div class="day"><div class="num">${m.day}</div><div class="wd">SUNDAY</div><div class="wdj">日曜日</div></div>
     <div class="txt"><div class="t">${m.t}</div><div class="meta">${m.meta}</div><div class="line">${m.line}</div></div></div>
    <div class="foot"><span>WEATHER · <b>${m.wx}</b></span><span>BEST WITH · <b>${m.with}</b></span></div>
   </div><div class="clip"></div></div>${grain(.11)}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const jobs = [['01_cover', cover(S.cover)], ...S.films.map((m, i) => [`0${i + 2}_${m.slug}`, inside(m, i, S.films.length)])];
  const only = process.argv[3];
  for (const [name, html] of jobs) { if (only && !name.startsWith(only)) continue;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.screenshot({ path: `${D}/out/${name}.jpg`, type: 'jpeg', quality: 93 }); }
  await b.close();
})();
