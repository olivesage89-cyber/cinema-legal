// "anime for when you can't sleep": cover = Insomniacs After School torii under the Milky Way, extended starry sky,
// lock-screen style (Sora small date line + huge thin Sora clock '3:07') + Instrument Serif italic lavender 'can't sleep'.
// Inside = NIGHT LOG: page gradient moves from midnight to dawn across slides, thin clock header with the hour of the night,
// big rounded still w/ soft glow, frosted lock-screen notification card (2nd still as icon, Instrument Serif title,
// Sora caps meta, italic line), 'sheep counted' footer.   node render_sleep.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_sleep.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ['100', '200', '300', '400', '600', '700'].map(w => ff('So', 'sora', w)).join('') + ff('Is', 'instrument-serif', 400) + ff('Is', 'instrument-serif', 400, 'italic');
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const stars = (n, h, o = 1) => { let s = ''; for (let i = 0; i < n; i++) { const r = rnd() < .9 ? .6 + rnd() * .9 : 1.6 + rnd() * 1.2; s += `<circle cx="${(rnd() * 1080).toFixed(1)}" cy="${(rnd() * h).toFixed(1)}" r="${r.toFixed(2)}" fill="#fff" opacity="${((.35 + rnd() * .65) * o).toFixed(2)}"/>`; }
  return `<svg style="position:absolute;left:0;top:0" width="1080" height="${h}">${s}</svg>`; };
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:So}`;
function cover(c) {
  return `<html><head><style>${fonts}${base}
  body{background:linear-gradient(180deg,#02061A 0,#06164A 380px,#0B2C78 620px)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;bottom:0;background:url(file://${D}/${c.img}) ${c.px}% ${c.py}%/auto ${1350 - c.top}px;filter:contrast(1.06) saturate(1.05) brightness(.96);
     -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.mt}px)}
  .shade{position:absolute;inset:0;background:radial-gradient(ellipse 70% 32% at 50% 20%,rgba(200,180,255,.10),transparent 70%),linear-gradient(0deg,rgba(2,6,22,.72),transparent 26%)}
  .top{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
  .date{font:400 25px So;letter-spacing:.06em;color:rgba(235,232,255,.82)}
  .clock{font:100 ${c.cs}px/1 So;color:#F2EEFF;letter-spacing:-.02em;margin-top:6px;text-shadow:0 0 60px rgba(190,170,255,.35)}
  .kick{font:600 21px So;letter-spacing:.46em;color:rgba(242,238,255,.9);margin-top:34px;padding-left:.46em}
  .h{font:italic 400 ${c.hs}px/.9 Is;color:${c.ink};margin-top:6px;letter-spacing:-.01em;text-shadow:0 0 44px ${c.ink}77,0 6px 30px rgba(0,0,0,.5)}
  .sub{position:absolute;left:0;right:0;bottom:${c.sb}px;text-align:center;font:italic 400 40px/1.25 Is;color:#EEEAFF;text-shadow:0 2px 18px rgba(0,0,0,.8)}
  .sub b{font-weight:400;color:${c.ink}}
  .sw{position:absolute;left:0;right:0;bottom:${c.sb - 70}px;text-align:center;font:600 15px So;letter-spacing:.5em;color:rgba(235,232,255,.6);padding-left:.5em}
  </style></head><body>${stars(260, 520)}<div class="img"></div><div class="shade"></div>
  <div class="top"><div class="date">${c.date}</div><div class="clock">${c.clock}</div><div class="kick">${c.kick}</div><div class="h">${c.h}</div></div>
  <div class="sub">${c.sub}</div><div class="sw">${c.sw}</div>${grain(.15)}</body></html>`;
}
function inside(m, i, n) {
  return `<html><head><style>${fonts}${base}
  body{background:linear-gradient(180deg,${m.bg0} 0,${m.bg1} 70%,${m.bg2} 100%)}
  .hdr{position:absolute;top:58px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:flex-end}
  .clk{font:100 128px/.8 So;color:#F4F1FF;letter-spacing:-.02em}
  .clk small{font:300 30px So;letter-spacing:.08em;margin-left:10px;color:rgba(244,241,255,.75)}
  .r{text-align:right;font:600 15px/1.9 So;letter-spacing:.38em;color:rgba(244,241,255,.6)}
  .r i{display:block;font:italic 400 36px/1 Is;letter-spacing:0;color:${m.acc};margin-bottom:6px}
  .ph{position:absolute;left:72px;right:72px;top:232px;height:568px;border-radius:30px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;
      box-shadow:0 0 90px ${m.acc}33,0 30px 60px rgba(0,0,0,.5);filter:contrast(1.05) saturate(1.05)}
  .ph:after{content:'';position:absolute;inset:0;border-radius:30px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.14)}
  .card{position:absolute;left:72px;right:72px;top:840px;padding:34px 38px 34px;border-radius:34px;background:rgba(255,255,255,.10);
      border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(30px);box-shadow:0 20px 50px rgba(0,0,0,.28)}
  .row{display:flex;align-items:center;gap:20px}
  .ic{width:66px;height:66px;border-radius:16px;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% 50%/cover;box-shadow:0 0 0 1px rgba(255,255,255,.2)}
  .nm{font:600 15px So;letter-spacing:.32em;color:rgba(244,241,255,.68)}
  .nm b{color:${m.acc};font-weight:600}
  .now{margin-left:auto;font:400 19px So;color:rgba(244,241,255,.55)}
  .t{font:400 ${m.fs || 76}px/1 Is;color:#FFFFFF;margin-top:26px;letter-spacing:-.005em}
  .meta{font:600 15px So;letter-spacing:.3em;color:rgba(244,241,255,.6);margin-top:16px}
  .line{font:italic 400 35px/1.25 Is;color:${m.acc};margin-top:20px}
  .ft{position:absolute;left:72px;right:72px;bottom:46px;display:flex;justify-content:space-between;font:400 16px So;letter-spacing:.3em;color:rgba(244,241,255,.45)}
  </style></head><body>${m.stars ? stars(m.stars, 230, .8) : ''}
  <div class="hdr"><div class="clk">${m.time}<small>AM</small></div><div class="r"><i>${m.mood}</i>STILL AWAKE · Nº ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</div></div>
  <div class="ph"></div>
  <div class="card"><div class="row"><div class="ic"></div><div class="nm">WATCHING · <b>${m.kind}</b></div><div class="now">now</div></div>
   <div class="t">${m.t}</div><div class="meta">${m.meta}</div><div class="line">${m.line}</div></div>
  <div class="ft"><span>SHEEP COUNTED: ${m.sheep}</span><span>${m.foot}</span></div>${grain(.12)}</body></html>`;
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
