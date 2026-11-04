// "anime for when everyone seems ahead of you": cover = Blue Period, Yatora painting alone at a blank canvas in an
// empty ultramarine Shibuya; image set low under an extended blurred deep-ultramarine top. Archivo spaced kicker,
// giant peony-pink Nanum Brush Script 'ahead' w/ painted underline swash, Archivo light spaced caps OF YOU,
// Newsreader italic sub. Inside = SKETCHBOOK: off-white sketch paper w/ spiral binding, pencil 'page 0X / 05' +
// Nanum Pen notes, taped big still + tilted taped small print, painted colour swatches w/ pencil labels,
// Newsreader title, Archivo caps meta in per-film paint, Newsreader italic line, pencil 'your own pace' footer path.
// node render_pace.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_pace.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('nanum-brush-script', 400) + css('nanum-pen-script', 400) + css('archivo', 300) + css('archivo', 400) + css('archivo', 500) + css('archivo', 600) +
  css('newsreader', '400-italic') + css('newsreader', '500-italic') + css('newsreader', 500) + css('newsreader', 600);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
// a hand-painted brush swash (svg path with rough edges)
const swash = (w, col, op = 1) => `<svg width="${w}" height="40" viewBox="0 0 ${w} 40" style="overflow:visible"><filter id="rough"><feTurbulence baseFrequency=".04 .6" numOctaves="2" seed="3"/><feDisplacementMap in="SourceGraphic" scale="7"/></filter>
  <path d="M6 24 C ${w * .25} 10, ${w * .55} 30, ${w - 8} 12" stroke="${col}" stroke-width="13" stroke-linecap="round" fill="none" opacity="${op}" filter="url(#rough)"/></svg>`;
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#0B1A4A}
  .ext{position:absolute;left:0;right:0;top:0;height:${c.top + 260}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;filter:blur(30px) brightness(.42) saturate(1.3);transform:scaleY(-1)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.08) contrast(1.06) brightness(.96)}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,14,48,.9) 0,rgba(6,14,48,.74) ${c.top}px,rgba(6,14,48,.3) ${c.top + 240}px,rgba(6,14,48,0) ${c.top + 420}px,rgba(6,14,48,0) 84%,rgba(6,14,48,.45) 100%)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:500 24px 'Archivo';letter-spacing:.5em;padding-left:.5em;color:#E7EEFF}
  .g{position:absolute;left:0;right:0;top:${c.ty + 12}px;text-align:center;font:400 ${c.gs}px/1 'Nanum Brush Script';color:${c.ink};
     text-shadow:0 0 44px rgba(255,120,170,.32),0 10px 40px rgba(2,8,30,.6)}
  .sw{position:absolute;left:50%;top:${c.ty + c.gs * .74}px;transform:translateX(-46%) rotate(-2deg)}
  .h{position:absolute;left:0;right:0;top:${c.ty + c.gs * .74 + 50}px;text-align:center;font:300 ${c.hs}px/1 'Archivo';letter-spacing:.62em;padding-left:.62em;color:#F7F3FF;text-shadow:0 4px 24px rgba(2,8,30,.7)}
  .sub{position:absolute;left:0;right:0;top:${c.ty + c.gs * .74 + 50 + c.hs + 30}px;text-align:center;font:italic 400 36px/1.3 'Newsreader';color:#E4EAFF;text-shadow:0 4px 20px rgba(2,8,30,.85)}
  .sub b{font-weight:500;color:${c.ink}}
  .tk{position:absolute;left:0;right:0;bottom:44px;text-align:center;font:500 17px 'Archivo';letter-spacing:.46em;padding-left:.46em;color:rgba(255,255,255,.86);text-shadow:0 2px 12px rgba(2,8,30,.8)}
  </style></head><body><div class="ext"></div><div class="img"></div><div class="shade"></div>
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="sw">${swash(380, c.ink, .85)}</div><div class="h">${c.h}</div>
  <div class="sub">${c.sub}</div>${grain(.14)}</body></html>`;
}
const tape = (l, t, r, w = 130) => `<div style="position:absolute;left:${l}px;top:${t}px;width:${w}px;height:38px;transform:rotate(${r}deg);z-index:8;
   background:linear-gradient(90deg,rgba(255,255,255,.0),rgba(255,255,255,.12) 20%,rgba(255,255,255,.08) 80%,rgba(255,255,255,0)),rgba(236,226,200,.72);
   box-shadow:0 1px 2px rgba(60,50,30,.12);-webkit-mask:linear-gradient(90deg,transparent 0,#000 4px,#000 calc(100% - 4px),transparent 100%)"></div>`;
function inside(m, i, n) {
  const ink = '#24211F', pencil = '#5B5852';
  const ph = m.ph || 600, top = 150;
  const below = top + ph + 40;
  const rings = Array.from({ length: 17 }, (_, k) => `<div class="ring" style="left:${70 + k * 58}px"></div>`).join('');
  const stops = Array.from({ length: n }, (_, k) => {
    const x = 40 + k * 205, done = k < i, cur = k === i - 1;
    return `<circle cx="${x}" cy="22" r="${cur ? 13 : 8}" fill="${cur ? m.acc : done ? pencil : 'none'}" stroke="${cur ? m.acc : pencil}" stroke-width="2"/>`;
  }).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:#F4F1EA}
  .paper{position:absolute;inset:0;background:
     radial-gradient(ellipse 95% 85% at 50% 45%,transparent 60%,rgba(110,100,80,.16)),
     url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 .45  0 0 0 0 .42  0 0 0 0 .36  0 0 0 .09 0'/></filter><rect width='300' height='300' filter='url(%23p)'/></svg>")}
  .ring{position:absolute;top:-18px;width:20px;height:58px;border-radius:10px;border:5px solid #9A9CA0;border-bottom-color:#6E7074;background:transparent;z-index:4;box-shadow:1px 2px 2px rgba(0,0,0,.15)}
  .hole{position:absolute;top:26px;width:14px;height:14px;border-radius:50%;background:#2A2A2A;opacity:.75}
  .hdr{position:absolute;top:70px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:baseline;color:${pencil}}
  .pg{font:400 44px 'Nanum Pen Script';color:${pencil}}.pg b{font-weight:400;color:${m.acc}}
  .tag{font:500 16px 'Archivo';letter-spacing:.34em;color:#8C877E}
  .pr{position:absolute;left:62px;top:${top}px;width:956px;height:${ph}px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;transform:rotate(-.6deg);
     box-shadow:0 1px 2px rgba(40,30,20,.2),0 24px 40px -18px rgba(50,40,25,.45);filter:saturate(1.05) contrast(1.03);z-index:3;border:10px solid #FBFAF6}
  .sm{position:absolute;right:58px;top:${top + ph - 150}px;width:330px;height:236px;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% ${m.y2 || 50}%/cover;transform:rotate(4deg);
     border:9px solid #FBFAF6;border-bottom-width:40px;box-shadow:0 18px 30px -12px rgba(40,30,20,.5);z-index:6}
  .smc{position:absolute;right:76px;top:${top + ph + 92}px;width:290px;text-align:center;transform:rotate(4deg);font:400 30px 'Nanum Pen Script';color:${pencil};z-index:7}
  .ti{position:absolute;left:74px;width:600px;top:${below + 18}px;font:600 ${m.fs || 66}px/1.0 'Newsreader';color:${ink};letter-spacing:-.012em}
  .meta{position:absolute;left:77px;top:${below + 18 + (m.fs || 66) * (m.lines || 1) * 1.0 + 20}px;font:600 18px 'Archivo';letter-spacing:.3em;color:${m.acc}}
  .sws{position:absolute;left:74px;top:${below + 18 + (m.fs || 66) * (m.lines || 1) + 70}px;display:flex;gap:16px}
  .s{width:78px;height:52px;border-radius:3px 9px 4px 8px;position:relative;box-shadow:inset 0 -6px 10px rgba(0,0,0,.08)}
  .s:after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(ellipse at 30% 30%,rgba(255,255,255,.25),transparent 60%)}
  .ln{position:absolute;left:76px;right:70px;top:${below + 18 + (m.fs || 66) * (m.lines || 1) + 150}px;font:italic 400 37px/1.26 'Newsreader';color:#3A3632}
  .ln b{font-weight:500;color:${m.acc}}
  .note{position:absolute;left:84px;top:${top - 2}px;transform:translateY(-100%) rotate(-1.5deg);font:400 34px 'Nanum Pen Script';color:${pencil};z-index:9}
  .ft{position:absolute;left:72px;right:72px;bottom:46px}
  .ft .lab{display:flex;justify-content:space-between;font:400 30px 'Nanum Pen Script';color:${pencil};margin-bottom:4px}
  </style></head><body><div class="paper"></div>
  ${Array.from({ length: 17 }, (_, k) => `<div class="hole" style="left:${73 + k * 58}px"></div>`).join('')}${rings}
  <div class="hdr"><div class="pg">page <b>0${i}</b> / 0${n}</div><div class="tag">${m.kind}</div></div>
  <div class="note">${m.note}</div>
  <div class="pr"></div>${tape(80, top - 22, -8)}${tape(870, top - 18, 7)}
  <div class="sm"></div>${tape(m.img2 ? 760 : -999, top + ph - 168, -4, 120)}<div class="smc">${m.cap}</div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div>
  <div class="sws">${m.sw.map(c => `<div class="s" style="background:${c}"></div>`).join('')}</div>
  <div class="ln">${m.line}</div>
  <div class="ft"><div class="lab"><span>at your own pace</span><span>→</span></div>
   <svg width="936" height="44" style="overflow:visible"><path d="M40 22 H 860" stroke="${pencil}" stroke-width="2" stroke-dasharray="3 9" stroke-linecap="round" fill="none"/>${stops}</svg></div>
  ${grain(.08)}</body></html>`;
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
