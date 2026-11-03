// "anime for the words you never said": cover = Tsukigakirei key frame (two students back to back under the moon,
// phones glowing), image fades into deep night-navy at the bottom; Special Elite typed kicker, rose Alex Brush
// 'the words' over cream Cormorant SC wide caps YOU NEVER SAID, Cormorant italic sub. Inside = UNSENT LETTERS:
// cream laid paper, clipped white-bordered print, rubber 'UNSENT' stamp in per-film accent, Playfair italic title,
// typed meta, typed letter line struck through + handwritten correction (Nothing You Could Do).  node render_words.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_words.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('alex-brush', 400) + css('special-elite', 400) + css('cormorant-sc', 500) + css('cormorant-sc', 600) +
  css('cormorant-garamond', '400-italic') + css('cormorant-garamond', '500-italic') + css('nothing-you-could-do', 400) +
  css('playfair-display', '400-italic') + css('playfair-display', '600-italic');
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#081633}
  .img{position:absolute;left:0;right:0;top:0;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,#000 0,#000 ${c.fade0}px,transparent ${c.bh}px);filter:saturate(1.04) contrast(1.04) brightness(.96)}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,22,51,0) 50%,rgba(8,22,51,.55) 68%,rgba(8,22,51,.0) 100%)}
  .glow{position:absolute;left:0;right:0;top:${c.ty - 60}px;height:520px;background:radial-gradient(ellipse 60% 45% at 50% 50%,rgba(244,182,200,.10),transparent 70%)}
  .moonq{position:absolute;left:70px;top:66px;font:400 21px 'Special Elite';color:rgba(235,242,255,.86);letter-spacing:.04em;text-shadow:0 1px 10px rgba(0,10,40,.7)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:400 25px 'Special Elite';letter-spacing:.5em;padding-left:.5em;color:#EEF2FA}
  .g{position:absolute;left:0;right:0;top:${c.ty + 24}px;text-align:center;font:400 ${c.gs}px/1 'Alex Brush';color:${c.ink};
     text-shadow:0 0 30px rgba(244,182,200,.35),0 6px 30px rgba(0,8,30,.6);transform:rotate(-4deg)}
  .h{position:absolute;left:0;right:0;top:${c.ty + 24 + c.gs * .86}px;text-align:center;font:600 ${c.hs}px/1 'Cormorant SC';letter-spacing:.2em;padding-left:.2em;color:#FBF4EA;text-shadow:0 6px 30px rgba(0,8,30,.6)}
  .rule{position:absolute;left:50%;top:${c.ty + 24 + c.gs * .86 + c.hs + 34}px;width:120px;margin-left:-60px;height:1.5px;background:${c.ink};opacity:.85}
  .sub{position:absolute;left:0;right:0;top:${c.ty + 24 + c.gs * .86 + c.hs + 58}px;text-align:center;font:italic 400 37px/1.3 'Cormorant Garamond';color:#E9EEF8}
  .sub b{font-weight:500;color:${c.ink}}
  .tk{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:400 16px 'Special Elite';letter-spacing:.42em;padding-left:.42em;color:rgba(233,238,248,.7)}
  </style></head><body><div class="img"></div><div class="shade"></div><div class="glow"></div>
  
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="h">${c.h}</div><div class="rule"></div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.12)}</body></html>`;
}
const clip = `<svg width="54" height="150" viewBox="0 0 54 150" style="position:absolute;left:84px;top:-38px;z-index:8;filter:drop-shadow(1px 3px 2px rgba(0,0,0,.3))"><path d="M16 120V22a11 11 0 0 1 22 0v104a17 17 0 0 1-34 0V34" fill="none" stroke="#9AA0A8" stroke-width="5" stroke-linecap="round"/><path d="M16 120V22a11 11 0 0 1 22 0v104a17 17 0 0 1-34 0V34" fill="none" stroke="#E4E7EB" stroke-width="2" stroke-linecap="round" transform="translate(-1 -1)"/></svg>`;
function inside(m, i, n) {
  return `<html><head>${fonts}<style>${base}
  body{background:#F2ECDF}
  .paper{position:absolute;inset:0;background:
     repeating-linear-gradient(180deg,rgba(120,100,70,.035) 0 1px,transparent 1px 6px),
     radial-gradient(ellipse 90% 75% at 50% 45%,transparent 55%,rgba(110,90,55,.16))}
  .hdr{position:absolute;top:44px;left:72px;right:72px;display:flex;justify-content:space-between;font:400 19px 'Special Elite';letter-spacing:.32em;color:#4A4238}
  .pr{position:absolute;left:66px;top:112px;width:948px;height:630px;background:#FFFEF9;padding:16px;transform:rotate(${m.rot || -1.2}deg);
     box-shadow:0 2px 3px rgba(40,30,20,.14),0 26px 40px -14px rgba(50,35,20,.4);z-index:3}
  .pr .ph{width:100%;height:100%;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:saturate(1.04) contrast(1.03)}
  .stamp{position:absolute;right:${m.sx || 54}px;top:${m.sy || 690}px;z-index:9;padding:12px 26px 8px;border:5px solid ${m.acc};border-radius:8px;
     font:400 46px 'Special Elite';letter-spacing:.22em;color:${m.acc};transform:rotate(-9deg);opacity:.93;background:rgba(242,236,223,.18);
     -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='120'><filter id='f'><feTurbulence baseFrequency='.9' numOctaves='2'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.1 1.45'/></filter><rect width='300' height='120' filter='url(%23f)'/></svg>")}
  .stamp:after{content:'';position:absolute;inset:4px;border:1.5px solid ${m.acc};border-radius:4px}
  .ti{position:absolute;left:74px;right:74px;top:806px;font:600 italic ${m.fs || 64}px/1.04 'Playfair Display';color:#221E1A}
  .meta{position:absolute;left:78px;top:${m.my || 888}px;font:400 20px 'Special Elite';letter-spacing:.16em;color:${m.acc}}
  .rule{position:absolute;left:78px;right:78px;top:${(m.my || 888) + 46}px;height:1px;background:rgba(60,50,40,.28)}
  .lt{position:absolute;left:78px;right:70px;top:${(m.my || 888) + 76}px}
  .dear{font:400 44px/1.2 'Nothing You Could Do';color:#25356B}
  .typed{margin-top:22px;font:400 33px/1.3 'Special Elite';color:#3E372F;position:relative;display:inline-block}
  .typed:after{content:'';position:absolute;left:-6px;right:-8px;top:52%;height:3px;background:${m.acc};transform:rotate(-1deg);border-radius:2px;opacity:.9}
  .hand{margin-top:14px;font:400 ${m.hs || 47}px/1.22 'Nothing You Could Do';color:#25356B;transform:rotate(-1.2deg);transform-origin:left}
  .ft{position:absolute;left:72px;right:72px;bottom:42px;display:flex;justify-content:space-between;font:400 15px 'Special Elite';letter-spacing:.34em;color:#8D8374}
  </style></head><body><div class="paper"></div>
  <div class="hdr"><span>Nº 0${i} / 0${n}</span><span>UNSENT LETTERS</span></div>
  <div class="pr">${clip}<div class="ph"></div></div><div class="stamp">UNSENT</div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div><div class="rule"></div>
  <div class="lt"><div class="dear">${m.dear}</div><div class="typed">${m.typed}</div><div class="hand">${m.hand}</div></div>
  <div class="ft"><span>THE WORDS YOU NEVER SAID</span><span>${m.kind}</span></div>${grain(.1)}</body></html>`;
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
