// "anime that feel like being 13": cover = Takagi-san The Movie, the two walking home over the bridge at sunset.
// Image set low, a dusk sky extended up (deep violet → mauve → the frame's own peach). Cream Fraunces black-italic
// 'thirteen' w/ warm glow, Figtree spaced kicker, amber Gaegu '(again)' tilted, Alegreya italic sub.
// Inside = YEARBOOK: per-film pastel page w/ faint halftone dots, 'CLASS OF <year>' sticker, big white-bordered
// rounded still, taped square 'yearbook photo' (2nd still) w/ Gaegu name caption, Fraunces title in per-film ink,
// Figtree caps dir · year, Gaegu 'most likely to:' superlative, Alegreya italic feeling line, 5 doodle stars footer.
// node render_thirteen.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_13.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('fraunces', '800-italic') + css('fraunces', '900-italic') + css('fraunces', 600) + css('fraunces', '600-italic') +
  css('figtree', 600) + css('figtree', 700) + css('gaegu', 400) + css('gaegu', 700) + css('alegreya', '400-italic') + css('alegreya', '500-italic') + css('alegreya', '700-italic');
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
const star = (c, s = 40, f = 'none', sw = 3) => `<svg width="${s}" height="${s}" viewBox="0 0 40 40"><path d="M20 3l4.9 11 11.6 1.2-8.7 7.8 2.6 11.6L20 28.6 9.6 34.6l2.6-11.6-8.7-7.8L15.1 14z" fill="${f}" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/></svg>`;
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:linear-gradient(180deg,#2A2150 0,#4A3466 190px,#8B5B83 340px,#D98E86 470px,#E9A488 560px)}
  .sky{position:absolute;left:-80px;right:-80px;top:${c.top - 260}px;height:520px;background:url(file://${D}/sky.jpg) center/cover;filter:blur(18px) saturate(1.1);
     -webkit-mask:linear-gradient(180deg,transparent 0,#000 60%);opacity:.85}
  .img{position:absolute;left:0;right:0;top:${c.top}px;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.05) contrast(1.03)}
  .dusk{position:absolute;inset:0;background:radial-gradient(ellipse 60% 26% at 50% 20%,rgba(255,190,150,.18),transparent 70%),linear-gradient(180deg,transparent 70%,rgba(40,18,30,.45) 100%)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:600 23px 'Figtree';letter-spacing:.52em;padding-left:.52em;color:rgba(255,241,226,.9)}
  .h{position:absolute;left:0;right:0;top:${c.ty + 34}px;text-align:center;font:italic 900 ${c.hs}px/1 'Fraunces';color:#FFF1E2;letter-spacing:-.02em;
     text-shadow:0 0 50px rgba(255,170,120,.55),0 6px 30px rgba(30,10,40,.35)}
  .ag{position:absolute;left:${c.agx}px;top:${c.ty + c.hs + 8}px;font:700 64px/1 'Gaegu';color:#FFAF3D;transform:rotate(-7deg);text-shadow:0 3px 16px rgba(40,10,30,.5)}
  .sub{position:absolute;left:0;right:0;top:${c.ty + c.hs + 92}px;text-align:center;font:italic 500 37px/1.3 'Alegreya';color:#FFF1E2;text-shadow:0 2px 16px rgba(50,20,50,.55)}
  .sub b{color:#FFC978;font-weight:700}
  .st{position:absolute;left:${c.sx}px;top:${c.ty + 10}px;transform:rotate(12deg);opacity:.9}
  .tk{position:absolute;left:0;right:0;bottom:44px;text-align:center;font:700 17px 'Figtree';letter-spacing:.46em;padding-left:.46em;color:rgba(255,244,232,.96);text-shadow:0 2px 14px rgba(40,10,20,.85)}
  </style></head><body><div class="sky"></div><div class="img"></div><div class="dusk"></div>
  <div class="kick">${c.kick}</div><div class="h">${c.h}</div><div class="ag">${c.ag}</div>
  <div class="st">${star('#FFAF3D', 34, 'none', 2.6)}</div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.13)}</body></html>`;
}
function inside(m, i, n) {
  const stars = Array.from({ length: n }, (_, k) => star(m.ink, 34, k < i ? m.ink : 'none', 2.6)).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:${m.page}}
  .dots{position:absolute;inset:0;background-image:radial-gradient(${m.ink}22 1.6px,transparent 1.8px);background-size:22px 22px;
     -webkit-mask:linear-gradient(160deg,#000 0,transparent 38%,transparent 70%,#000 100%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 45%,rgba(255,255,255,.35),transparent 75%)}
  .top{position:absolute;left:66px;right:66px;top:50px;display:flex;justify-content:space-between;align-items:center;
     font:700 16px 'Figtree';letter-spacing:.4em;color:${m.ink};opacity:.82}
  .big{position:absolute;left:62px;right:62px;top:104px;height:590px;background:#fff;padding:14px;border-radius:26px;transform:rotate(-1deg);
     box-shadow:0 2px 3px rgba(0,0,0,.12),0 30px 50px -24px rgba(40,30,60,.45)}
  .big div{width:100%;height:100%;border-radius:16px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:saturate(1.04) contrast(1.03)}
  .cls{position:absolute;right:46px;top:62px;width:156px;height:156px;border-radius:50%;background:${m.ink};color:${m.page};transform:rotate(11deg);z-index:6;
     display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 22px -8px rgba(0,0,0,.4);border:5px solid #fff}
  .cls small{font:700 15px 'Figtree';letter-spacing:.3em;padding-left:.3em}
  .cls span{font:italic 900 50px/1 'Fraunces';margin-top:2px}
  .ph{position:absolute;left:70px;top:742px;width:320px;height:388px;background:#fff;padding:14px 14px 0;transform:rotate(-3.5deg);z-index:5;
     box-shadow:0 2px 3px rgba(0,0,0,.12),0 24px 36px -18px rgba(40,30,60,.5)}
  .ph div{width:292px;height:292px;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% ${m.y2 || 50}%/cover}
  .ph p{letter-spacing:-.02em;text-align:center;font:700 34px/1 'Gaegu';color:${m.ink};margin-top:20px}
  .tape{position:absolute;left:162px;top:722px;width:150px;height:44px;background:${m.tape};opacity:.82;transform:rotate(4deg);z-index:7;
     box-shadow:0 2px 4px rgba(0,0,0,.08)}
  .col{position:absolute;left:446px;right:60px;top:760px}
  .ti{font:600 ${m.fs || 62}px/1.02 'Fraunces';color:${m.ink};letter-spacing:-.01em}
  .meta{margin-top:18px;font:700 16px 'Figtree';letter-spacing:.3em;color:${m.ink};opacity:.72}
  .ml{margin-top:30px;letter-spacing:-.02em;font:400 30px/1 'Gaegu';color:${m.ink};opacity:.75}
  .ml2{margin-top:6px;letter-spacing:-.03em;font:700 42px/1.05 'Gaegu';color:${m.hi}}
  .ln{position:absolute;left:56px;right:56px;top:1176px;text-align:center;font:italic 500 33px/1.3 'Alegreya';color:${m.ink}}
  .ln b{font-weight:700;color:${m.hi}}
  .ft{position:absolute;left:0;right:0;bottom:34px;display:flex;justify-content:center;gap:16px;opacity:.85}
  </style></head><body><div class="dots"></div><div class="vig"></div>
  <div class="top"><span>BEING 13 · THE YEARBOOK</span><span>Nº 0${i} / 0${n}</span></div>
  <div class="big"><div></div></div>
  <div class="cls"><small>CLASS OF</small><span>${m.yr}</span></div>
  <div class="ph"><div></div><p>${m.nick}</p></div><div class="tape"></div>
  <div class="col"><div class="ti">${m.t}</div><div class="meta">${m.meta}</div>
    <div class="ml">most likely to:</div><div class="ml2">${m.likely}</div></div>
  <div class="ln">${m.line}</div>
  <div class="ft">${stars}</div>
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
