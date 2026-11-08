// "movies that feel like venice in november": cover = Don't Look Now gondolas at dusk under heavy clouds, image set low
// (sharp, 1080 wide) under an extended blurred cloud sky fading to ink; centred: Raleway spaced kicker, giant Great Vibes
// 'Venice' in Venetian coral w/ soft glow, Cinzel spaced caps IN NOVEMBER (ivory), EB Garamond italic sub, Raleway footer.
// Inside = GOTHIC WINDOW: warm plaster page w/ faint texture, each still masked into a Venetian ogee/pointed arch window
// with a thin stone frame, 'Nº 0X · SESTIERE' header, Cinzel title in per-film ink, Raleway DIR · year, Garamond italic line.
// node render_venice.js DIR   (DIR/slides_ven.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_ven.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('great-vibes', 400) + css('cinzel', 400) + css('cinzel', 600) + css('raleway', 500) + css('raleway', 600) + css('eb-garamond', '400-italic') + css('eb-garamond', '500-italic');
const grain = (o = .16) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
const C = S.ink; // cover hero colour

function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#0b0d12}
  .sky{position:absolute;left:-80px;right:-80px;top:-60px;height:1000px;background:url(file://${D}/${c.img}) 50% 0%/1240px auto no-repeat;filter:blur(60px) saturate(.9) brightness(.8);transform:scaleY(1.6);transform-origin:top}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.h}px;background:url(file://${D}/${c.img}) ${c.bx}% 100%/cover no-repeat;
       -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 30%);filter:contrast(1.06) saturate(1.05)}
  .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,10,16,.92) 0%,rgba(10,12,18,.72) 28%,rgba(12,12,16,.25) 52%,rgba(0,0,0,0) 66%,rgba(0,0,0,0) 86%,rgba(4,5,8,.8) 100%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.top}px;text-align:center;z-index:5}
  .kick{font:600 23px 'Raleway';letter-spacing:.5em;color:#E9E2D6;padding-left:.5em;opacity:.92}
  .h{font:400 250px 'Great Vibes';color:${C};line-height:1;margin-top:44px;text-shadow:0 0 46px ${C}66,0 6px 30px rgba(0,0,0,.55)}
  .h2{font:600 54px 'Cinzel';letter-spacing:.42em;padding-left:.42em;color:#F1E9DC;margin-top:-6px;text-shadow:0 4px 20px rgba(0,0,0,.6)}
  .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin:30px auto 0;width:460px}
  .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,${C}bb)}
  .rule i:last-child{background:linear-gradient(90deg,${C}bb,transparent)}
  .rule b{font:400 22px 'Cinzel';color:${C};line-height:1}
  .sub{font:400 italic 38px 'EB Garamond';color:#EFE6DA;margin-top:22px;line-height:1.25;text-shadow:0 2px 14px rgba(0,0,0,.7)}
  .foot{position:absolute;bottom:48px;left:0;right:0;text-align:center;font:600 18px 'Raleway';letter-spacing:.55em;color:#EFE6DA;padding-left:.55em;z-index:5;opacity:.85}
  </style></head><body><div class="sky"></div><div class="img"></div><div class="fade"></div><div class="vig"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="h">${c.h1}</div><div class="h2">${c.h2}</div>
  <div class="rule"><i></i><b>✦</b><i></i></div><div class="sub">${c.sub}</div></div>
  <div class="foot">${c.foot}</div>${grain(.2)}</body></html>`;
}

// pointed Venetian gothic arch (ogee-ish lancet) as clip path, in a 760x900 box
const arch = (w, h) => `path('M0 ${h} L0 ${h * .36} C0 ${h * .16} ${w * .3} ${h * .07} ${w * .43} ${h * .035} C${w * .48} ${h * .02} ${w * .5} 0 ${w * .5} 0 C${w * .5} 0 ${w * .52} ${h * .02} ${w * .57} ${h * .035} C${w * .7} ${h * .07} ${w} ${h * .16} ${w} ${h * .36} L${w} ${h} Z')`;
function inside(m, i, n) {
  const W = 700, H = 840, B = 16;
  return `<html><head>${fonts}<style>${base}
  body{background:${m.bg};background:radial-gradient(ellipse 80% 60% at 50% 38%,${m.bg2} 0%,${m.bg} 75%)}
  .tex{position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply}
  .hd{position:absolute;top:58px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font:600 18px 'Raleway';letter-spacing:.36em;color:${m.ink}cc}
  .hd .sc{font:400 52px 'Great Vibes';letter-spacing:0;color:${m.ink};margin-top:-10px}
  .frame{position:absolute;left:${(1080 - W - 2 * B) / 2}px;top:118px;width:${W + 2 * B}px;height:${H + B}px;clip-path:${arch(W + 2 * B, H + B)};background:linear-gradient(180deg,#f7efe2,#d9cbb4);filter:drop-shadow(0 20px 30px rgba(0,0,0,.3))}
  .inner{position:absolute;left:${(1080 - W) / 2}px;top:${118 + B}px;width:${W}px;height:${H}px;clip-path:${arch(W, H)};background:url(file://${D}/${m.img}) ${m.x}% ${m.y}%/${m.sz || 'cover'};filter:saturate(1.04) contrast(1.05)}
  .line{position:absolute;left:${(1080 - W) / 2 + 10}px;top:${118 + B + 10}px;width:${W - 20}px;height:${H - 10}px;clip-path:${arch(W - 20, H - 10)};box-shadow:inset 0 0 0 1.5px rgba(255,248,235,.6)}
  .sill{position:absolute;left:${(1080 - W - 2 * B) / 2 - 18}px;width:${W + 2 * B + 36}px;top:${118 + H + B - 2}px;height:16px;background:linear-gradient(180deg,#efe4d2,#c9b89c);border-radius:2px;box-shadow:0 10px 18px rgba(0,0,0,.22)}
  .tx{position:absolute;left:0;right:0;top:1006px;text-align:center}
  .ti{font:600 ${m.fs}px 'Cinzel';color:${m.ink};letter-spacing:.06em;line-height:1.02}
  .dr{font:600 17px 'Raleway';letter-spacing:.34em;color:#4a3f36;margin-top:16px;padding-left:.34em}
  .ln{font:400 italic 34px 'EB Garamond';color:#2f2823;margin:14px auto 0;line-height:1.2;max-width:880px}
  </style></head><body>
  <svg class="tex" width="1080" height="1350"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".012 .03" numOctaves="4" seed="${i * 7}"/><feColorMatrix values="0 0 0 0 .55  0 0 0 0 .45  0 0 0 0 .35  0 0 0 .6 0"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>
  <div class="hd"><span>Nº 0${i} — 0${n}</span><span class="sc">Venezia</span><span>${m.place}</span></div>
  <div class="frame"></div><div class="inner"></div><div class="line"></div><div class="sill"></div>
  <div class="tx"><div class="ti">${m.t}</div><div class="dr">${m.dir} · ${m.yr}</div><div class="ln">${m.ov}</div></div>
  ${grain(.13)}</body></html>`;
}

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const only = process.argv[3];
  const shot = async (html, f) => { fs.writeFileSync(D + '/tmp.html', html); await p.goto('file://' + D + '/tmp.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: D + '/out/' + f, type: 'jpeg', quality: 93 }); };
  if (!only || only === 'c') await shot(cover(S.cover), '01_cover.jpg');
  if (!only || only === 'm') for (let i = 0; i < S.movies.length; i++) await shot(inside(S.movies[i], i + 1, S.movies.length), `0${i + 2}_${S.movies[i].slug}.jpg`);
  await b.close();
})();
