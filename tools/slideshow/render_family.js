// "anime about found family": cover = SPY x FAMILY CODE: White, the Forgers + Bond walking through a golden autumn
// park (fisheye). Image set low, its own golden sky extended upward (blurred, warm). Deep cobalt ink ON the gold:
// Montserrat spaced kicker, Cinzel wide-spaced FOUND, giant Yellowtail 'family', Cormorant italic sub.
// Inside = PLACE CARD: still full-bleed top, a per-film deep "tablecloth" w/ linen weave below, a cream tented place
// card overlapping the still ("a seat for" Yellowtail in per-film accent, Cinzel title, Montserrat caps dir · year),
// Cormorant italic line in cream under it, "seat 0X of 05" footer with five little plates.
// node render_family.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_family.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('yellowtail', 400) + css('cinzel', 500) + css('cinzel', 600) + css('cinzel', 700) + css('montserrat', 500) + css('montserrat', 600) +
  css('cormorant-garamond', '500-italic') + css('cormorant-garamond', '600-italic') + css('cormorant-garamond', 500);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
function cover(c) {
  const ink = c.ink;
  return `<html><head>${fonts}<style>${base}
  body{background:#E9B65A}
  .ext{position:absolute;left:-60px;right:-60px;top:-40px;height:${c.top + 300}px;background:url(file://${D}/sky.jpg) center/cover;filter:saturate(1.08)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.06) contrast(1.04)}
  .warm{position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 50% 22%,rgba(255,236,190,.38),transparent 70%),linear-gradient(180deg,rgba(255,226,160,.18),transparent 45%,rgba(60,30,5,0) 80%,rgba(50,24,4,.35) 100%)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:600 23px 'Montserrat';letter-spacing:.56em;padding-left:.56em;color:${ink}}
  .h{position:absolute;left:0;right:0;top:${c.ty + 58}px;text-align:center;font:600 ${c.hs}px/1 'Cinzel';letter-spacing:.5em;padding-left:.5em;color:${ink}}
  .g{position:absolute;left:0;right:0;top:${c.ty + 58 + c.hs - 40}px;text-align:center;font:400 ${c.gs}px/1 'Yellowtail';color:${ink};transform:rotate(-4deg);
     text-shadow:0 0 60px rgba(255,240,200,.55)}
  .sub{position:absolute;left:0;right:0;top:${c.ty + 58 + c.hs - 40 + c.gs * 1.02}px;text-align:center;font:italic 600 38px/1.28 'Cormorant Garamond';color:${ink}}
  .rule{position:absolute;left:50%;width:120px;margin-left:-60px;top:${c.ty + 58 + c.hs - 40 + c.gs * 1.02 - 18}px;height:2px;background:${ink};opacity:.55}
  .tk{position:absolute;left:0;right:0;bottom:40px;text-align:center;font:600 17px 'Montserrat';letter-spacing:.46em;padding-left:.46em;color:rgba(255,246,228,.95);text-shadow:0 2px 12px rgba(40,18,0,.8)}
  </style></head><body><div class="ext"></div><div class="img"></div><div class="warm"></div>
  <div class="kick">${c.kick}</div><div class="h">${c.h}</div><div class="g">${c.g}</div><div class="rule"></div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.13)}</body></html>`;
}
function inside(m, i, n) {
  const ph = 800;
  const plates = Array.from({ length: n }, (_, k) => {
    const cur = k === i - 1;
    return `<div class="pl ${cur ? 'cur' : ''}"></div>`;
  }).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:${m.cloth}}
  .cloth{position:absolute;left:0;right:0;top:${ph - 20}px;bottom:0;background:
     repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 2px,transparent 2px 5px),
     repeating-linear-gradient(90deg,rgba(0,0,0,.07) 0 2px,transparent 2px 5px),
     radial-gradient(ellipse 80% 70% at 50% 30%,rgba(255,255,255,.07),transparent 70%),
     linear-gradient(180deg,rgba(0,0,0,.35),rgba(0,0,0,0) 120px,rgba(0,0,0,.28) 100%)}
  .st{position:absolute;left:0;right:0;top:0;height:${ph}px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:saturate(1.05) contrast(1.04)}
  .st:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.28),transparent 18%,transparent 70%,rgba(0,0,0,.45))}
  .top{position:absolute;left:56px;right:56px;top:42px;display:flex;justify-content:space-between;align-items:center;z-index:5;
     font:600 17px 'Montserrat';letter-spacing:.42em;color:rgba(255,255,255,.92);text-shadow:0 2px 10px rgba(0,0,0,.6)}
  .card{position:absolute;left:50%;top:${ph - 135}px;width:800px;margin-left:-400px;height:300px;z-index:6;transform:rotate(${m.rot || -1.2}deg)}
  .card .b{position:absolute;inset:0;background:linear-gradient(180deg,#FBF5E8,#F3EAD6);border-radius:4px;
     box-shadow:0 2px 3px rgba(0,0,0,.25),0 40px 60px -22px rgba(0,0,0,.6),0 12px 18px -10px rgba(0,0,0,.4)}
  .card .fold{position:absolute;left:0;right:0;top:0;height:18px;background:linear-gradient(180deg,rgba(120,100,70,.18),transparent);border-radius:4px 4px 0 0}
  .card .edge{position:absolute;left:26px;right:26px;top:26px;bottom:26px;border:1.5px solid ${m.acc};opacity:.45;border-radius:2px}
  .seat{position:absolute;left:0;right:0;top:34px;text-align:center;font:400 54px/1 'Yellowtail';color:${m.acc}}
  .ti{position:absolute;left:40px;right:40px;top:104px;text-align:center;font:600 ${m.fs || 58}px/1.06 'Cinzel';color:#2A211B;letter-spacing:.04em}
  .meta{position:absolute;left:0;right:0;bottom:44px;text-align:center;font:600 17px 'Montserrat';letter-spacing:.36em;padding-left:.36em;color:#6E6152}
  .meta b{color:${m.acc};font-weight:600}
  .ln{position:absolute;left:110px;right:110px;top:${ph + 218}px;text-align:center;font:italic 500 43px/1.3 'Cormorant Garamond';color:#F6EEDF;text-shadow:0 2px 14px rgba(0,0,0,.4)}
  .ln b{font-weight:600;color:${m.acc2 || m.acc}}
  .ft{position:absolute;left:0;right:0;bottom:46px;display:flex;flex-direction:column;align-items:center;gap:14px}
  .pls{display:flex;gap:22px}
  .pl{width:30px;height:30px;border-radius:50%;border:2px solid rgba(246,238,223,.55);box-shadow:inset 0 0 0 5px transparent}
  .pl.cur{background:#F6EEDF;border-color:#F6EEDF;box-shadow:inset 0 0 0 6px ${m.cloth},inset 0 0 0 8px rgba(0,0,0,.0)}
  .ftl{font:600 15px 'Montserrat';letter-spacing:.44em;padding-left:.44em;color:rgba(246,238,223,.72)}
  </style></head><body><div class="st"></div><div class="cloth"></div>
  <div class="top"><span>FOUND FAMILY</span><span>0${i} / 0${n}</span></div>
  <div class="card"><div class="b"></div><div class="fold"></div><div class="edge"></div>
    <div class="seat">a seat for</div><div class="ti">${m.t}</div><div class="meta">${m.meta}</div></div>
  <div class="ln">${m.line}</div>
  <div class="ft"><div class="pls">${plates}</div><div class="ftl">${i < n ? 'PASS IT ON →' : 'EVERYONE’S HERE'}</div></div>
  ${grain(.1)}</body></html>`;
}
(async () => {
  const only = process.argv[3]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, out) => { fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 }); };
  if (!only || only === '1') await shot(cover(S.cover), '01_cover.jpg');
  for (let k = 0; k < S.movies.length; k++) if (!only || only === String(k + 2)) await shot(inside(S.movies[k], k + 1, S.movies.length), `0${k + 2}_${S.movies[k].slug}.jpg`);
  await b.close();
})();
