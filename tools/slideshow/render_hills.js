// "movies that feel like mist on the hills": cover = Brave, Merida among misty standing stones, image set low under an
// extended blurred storm sky; centred: Jost spaced kicker, ivory Tangerine 'mist on the', giant heather Uncial Antiqua
// HILLS w/ soft glow, triquetra hairline rule, Alegreya italic sub, Jost footer, grain.
// Inside = ILLUMINATED PAGE: vellum page w/ fibres + darkened edges, Alegreya SC header 'Nº 0X · 05' + triquetra + place,
// still in gilt + per-film-ink double frame w/ triquetra corner knots, illuminated gilt drop-cap square (Uncial letter in
// per-film ink) beside an Uncial title + Alegreya SC DIR · year, Alegreya italic line, 5 knot-dot progress.
// node render_hills.js DIR   (DIR/slides_hills.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_hills.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('uncial-antiqua', 400) + css('tangerine', 700) + css('jost', 500) + css('alegreya', '400-italic') + css('alegreya', '500-italic') + css('alegreya-sc', 500) + css('alegreya-sc', 700);
const grain = (o = .16) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
// triquetra (three leaves through the centre) + ring
function triq(size, col, sw = 2.2) {
  const r = 30, pts = [0, 1, 2].map(k => { const a = -Math.PI / 2 + k * 2 * Math.PI / 3; return [r * Math.cos(a), r * Math.sin(a)]; });
  const leaves = [[0, 1], [1, 2], [2, 0]].map(([j, k]) => { const p = [pts[j][0] + pts[k][0], pts[j][1] + pts[k][1]]; return `M0 0 A${r} ${r} 0 0 1 ${p[0].toFixed(2)} ${p[1].toFixed(2)} A${r} ${r} 0 0 1 0 0`; }).join(' ');
  return `<svg width="${size}" height="${size}" viewBox="-36 -36 72 72" style="overflow:visible"><g fill="none" stroke="${col}" stroke-width="${sw}"><path d="${leaves}"/><circle r="19" /></g></svg>`;
}
const C = S.ink;

function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#0d100c}
  .sky{position:absolute;left:-80px;right:-80px;top:-60px;height:900px;background:url(file://${D}/${c.img}) ${c.bx}% 0%/1500px auto no-repeat;filter:blur(55px) saturate(.85) brightness(.75);transform:scaleY(1.5);transform-origin:top}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.h}px;background:url(file://${D}/${c.img}) ${c.bx}% 100%/cover no-repeat;
       -webkit-mask-image:linear-gradient(180deg,transparent 0%,#000 26%);filter:contrast(1.07) saturate(1.06)}
  .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,12,12,.9) 0%,rgba(12,14,14,.66) 26%,rgba(12,14,14,.22) 44%,rgba(0,0,0,0) 56%,rgba(0,0,0,0) 84%,rgba(6,8,6,.75) 100%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.top}px;text-align:center;z-index:5}
  .kick{font:500 22px 'Jost';letter-spacing:.52em;color:#ECE6D8;padding-left:.52em;opacity:.92}
  .h1{font:700 128px 'Tangerine';color:#F3EEDF;line-height:1;margin-top:18px;text-shadow:0 4px 24px rgba(0,0,0,.6)}
  .h2{font:400 ${c.fs}px 'Uncial Antiqua';color:${C};line-height:.9;margin-top:4px;letter-spacing:.04em;text-shadow:0 0 50px ${C}77,0 6px 30px rgba(0,0,0,.55)}
  .rule{display:flex;align-items:center;justify-content:center;gap:18px;margin:26px auto 0;width:520px}
  .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,${C}cc)}
  .rule i:last-child{background:linear-gradient(90deg,${C}cc,transparent)}
  .sub{font:400 italic 37px 'Alegreya';color:#EEE8DA;margin-top:20px;line-height:1.28;text-shadow:0 2px 14px rgba(0,0,0,.75)}
  .sub em{color:${C};font-style:italic}
  .foot{position:absolute;bottom:46px;left:0;right:0;text-align:center;font:500 18px 'Jost';letter-spacing:.55em;color:#EEE8DA;padding-left:.55em;z-index:5;opacity:.88;text-shadow:0 2px 10px rgba(0,0,0,.7)}
  </style></head><body><div class="sky"></div><div class="img"></div><div class="fade"></div><div class="vig"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="h1">${c.h1}</div><div class="h2">${c.h2}</div>
  <div class="rule"><i></i>${triq(34, C, 2.6)}<i></i></div><div class="sub">${c.sub}</div></div>
  <div class="foot">${c.foot}</div>${grain(.2)}</body></html>`;
}

function inside(m, i, n) {
  const W = 900, H = 700, L = 90, T = 150;
  const corner = (x, y) => `<div style="position:absolute;left:${x - 27}px;top:${y - 27}px;width:54px;height:54px;border-radius:50%;background:#EFE3C8;display:flex;align-items:center;justify-content:center;z-index:3">${triq(40, m.ink, 2.8)}</div>`;
  const dots = Array.from({ length: n }, (_, k) => `<span style="display:inline-block;width:${k + 1 === i ? 30 : 10}px;height:10px;border-radius:6px;margin:0 6px;background:${k + 1 === i ? m.ink : m.ink + '44'}"></span>`).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:#EFE3C8}
  .tex{position:absolute;inset:0;opacity:.55;mix-blend-mode:multiply}
  .edge{position:absolute;inset:0;background:radial-gradient(ellipse 75% 70% at 50% 48%,rgba(0,0,0,0) 60%,rgba(110,78,40,.32) 100%)}
  .hd{position:absolute;top:58px;left:${L}px;right:${L}px;display:flex;justify-content:space-between;align-items:center;font:500 21px 'Alegreya SC';letter-spacing:.24em;color:${m.ink}}
  .frame{position:absolute;left:${L - 16}px;top:${T - 16}px;width:${W + 32}px;height:${H + 32}px;border:2px solid ${m.ink};}
  .frame2{position:absolute;left:${L - 8}px;top:${T - 8}px;width:${W + 16}px;height:${H + 16}px;border:3px solid #B8913F;box-shadow:inset 0 0 0 1px #E8CE86}
  .img{position:absolute;left:${L}px;top:${T}px;width:${W}px;height:${H}px;background:url(file://${D}/${m.img}) ${m.x}% ${m.y}%/cover;filter:saturate(1.03) contrast(1.05) sepia(.08)}
  .txt{position:absolute;left:${L}px;right:${L}px;top:${T + H + 66}px;display:flex;gap:30px;align-items:center}
  .cap{flex:none;width:150px;height:150px;background:linear-gradient(135deg,#E9CF86,#B8913F 55%,#D9B867);border:2px solid ${m.ink};display:flex;align-items:center;justify-content:center;box-shadow:inset 0 0 0 6px #EFE3C8, inset 0 0 0 8px ${m.ink};font:400 104px 'Uncial Antiqua';color:${m.ink};line-height:1;padding-top:4px}
  .ti{font:400 ${m.fs}px 'Uncial Antiqua';color:${m.ink};line-height:1.02}
  .dr{font:500 21px 'Alegreya SC';letter-spacing:.22em;color:#4A3B2A;margin-top:14px}
  .ln{position:absolute;left:${L}px;right:${L}px;top:${T + H + 246}px;font:500 italic 36px 'Alegreya';color:#2E261C;line-height:1.25;text-align:left}
  .dots{position:absolute;bottom:62px;left:0;right:0;text-align:center}
  </style></head><body>
  <svg class="tex" width="1080" height="1350"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".018 .022" numOctaves="5" seed="${i * 11}"/><feColorMatrix values="0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .34  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>
  <div class="edge"></div>
  <div class="hd"><span>Nº 0${i} · 0${n}</span>${triq(30, m.ink, 2.6)}<span>${m.place}</span></div>
  <div class="frame"></div><div class="frame2"></div><div class="img"></div>
  ${corner(L - 16, T - 16)}${corner(L + W + 16, T - 16)}${corner(L - 16, T + H + 16)}${corner(L + W + 16, T + H + 16)}
  <div class="txt"><div class="cap">${m.t[0]}</div><div><div class="ti">${m.t.slice(1)}</div><div class="dr">${m.dir} · ${m.yr}</div></div></div>
  <div class="ln">${m.ov}</div>
  <div class="dots">${dots}</div>
  ${grain(.12)}</body></html>`;
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
