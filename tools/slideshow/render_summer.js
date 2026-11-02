// "anime for when you miss summer": cover = Sonny Boy girl + cat against cumulus on flat cobalt cel sky, image masked
// up into extended cobalt sky; Outfit spaced kicker, sunflower Homemade Apple 'miss' tilted over giant white Gloock
// 'summer', Spectral italic sub, vertical Zen Old Mincho 夏が恋しい. Inside = SUMMER PICTURE DIARY (夏休みの絵日記):
// pale paper, dated diary header w/ weather icon, still in pencil-ruled picture box, taped polaroid inset, Gloock title,
// Outfit meta, Klee One handwriting on genkō squares, red teacher's hanko stamp.   node render_summer.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_summer.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('gloock', 400) + css('homemade-apple', 400) + [300, 400, 500, 600].map(w => css('outfit', w)).join('') +
  css('spectral', '400-italic') + css('spectral', 400) + css('klee-one', 400) + css('klee-one', 600) + css('zen-old-mincho', 400) + css('zen-old-mincho', 700);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:'Outfit'}`;
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:linear-gradient(180deg,#0153B3 0%,#0263CA 30%,#0263CA 100%)}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.05) contrast(1.03)}
  .kick{position:absolute;left:84px;top:${c.ky}px;font:500 22px 'Outfit';letter-spacing:.48em;color:#F3F8FF}
  .g{position:absolute;left:${c.gx}px;top:${c.gy}px;font:400 ${c.gs}px/1 'Homemade Apple';color:${c.ink};-webkit-text-stroke:1.6px ${c.ink};transform:rotate(-7deg);z-index:3;text-shadow:0 4px 24px rgba(0,30,90,.35)}
  .h{position:absolute;left:${c.hx}px;top:${c.hy}px;font:400 ${c.hs}px/1 'Gloock';color:#FFFFFF;letter-spacing:-.01em;text-shadow:0 10px 50px rgba(0,30,100,.35)}
  .sub{position:absolute;left:88px;top:${c.sy}px;font:italic 400 38px/1.3 'Spectral';color:#F3F8FF;text-shadow:0 2px 16px rgba(0,30,90,.4)}
  .sub b{font-weight:400;color:${c.ink}}
  .jp{position:absolute;right:70px;top:${c.ky - 6}px;writing-mode:vertical-rl;font:400 30px 'Zen Old Mincho';letter-spacing:.32em;color:rgba(255,255,255,.88)}
  .jp:after{content:'';display:block;margin-top:18px;width:1.5px;height:90px;background:rgba(255,255,255,.6);margin-left:auto;margin-right:auto}
  .tk{position:absolute;left:90px;top:${c.sy + 118}px;font:500 15px 'Outfit';letter-spacing:.42em;color:rgba(255,255,255,.9);text-shadow:0 1px 10px rgba(0,30,90,.5)}
  </style></head><body><div class="img"></div><div class="kick">${c.kick}</div><div class="h">${c.h}</div><div class="g">${c.g}</div>
  <div class="sub">${c.sub}</div><div class="jp">夏が恋しい</div><div class="tk">${c.tk}</div>${grain(.12)}</body></html>`;
}
const icons = {
  sun: a => `<svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="9" fill="${a}"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<line x1="23" y1="4" x2="23" y2="10" stroke="${a}" stroke-width="3" stroke-linecap="round" transform="rotate(${r} 23 23)"/>`).join('')}</svg>`,
  suncloud: a => `<svg width="56" height="46" viewBox="0 0 56 46"><circle cx="20" cy="18" r="8" fill="${a}"/>${[0, 45, 90, 135, 180, 225, 270, 315].map(r => `<line x1="20" y1="2" x2="20" y2="7" stroke="${a}" stroke-width="3" stroke-linecap="round" transform="rotate(${r} 20 18)"/>`).join('')}<path d="M22 40h24a8 8 0 0 0 0-16 11 11 0 0 0-21-2 9 9 0 0 0-3 18z" fill="#FBF8F0" stroke="#3B4C6E" stroke-width="2.6" stroke-linejoin="round"/></svg>`,
  moon: a => `<svg width="46" height="46" viewBox="0 0 46 46"><path d="M30 8a15 15 0 1 0 9 24A13 13 0 0 1 30 8z" fill="${a}"/><circle cx="12" cy="10" r="2" fill="${a}"/><circle cx="40" cy="14" r="1.6" fill="${a}"/></svg>`,
};
function inside(m, i, n) {
  return `<html><head>${fonts}<style>${base}
  body{background:#F6F2E7}
  .paper{position:absolute;inset:0;background:radial-gradient(ellipse 90% 75% at 50% 45%,transparent 55%,rgba(120,100,60,.13))}
  .hdr{position:absolute;top:52px;left:60px;right:60px;height:50px;display:flex;justify-content:space-between;align-items:center}
  .no{font:600 17px 'Outfit';letter-spacing:.42em;color:#3B4C6E}
  .jt{position:absolute;left:0;right:0;top:60px;text-align:center;font:700 24px 'Zen Old Mincho';letter-spacing:.5em;padding-left:.5em;color:#3B4C6E}
  .dt{display:flex;align-items:center;gap:14px;font:600 34px 'Klee One';color:#3B4C6E}
  .box{position:absolute;left:60px;top:126px;width:960px;height:640px;border:4px solid #3B4C6E;border-radius:6px;padding:10px;background:#FBF8F0;
    box-shadow:0 1px 0 rgba(0,0,0,.05),0 18px 34px -16px rgba(40,50,80,.35)}
  .box .ph{width:100%;height:100%;border-radius:2px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:saturate(1.05) contrast(1.03)}
  .pol{position:absolute;right:58px;top:${m.py || 600}px;width:330px;height:262px;background:#FFFEFA;padding:14px 14px 44px;transform:rotate(${m.pr || 4}deg);
    box-shadow:0 2px 3px rgba(40,40,60,.16),0 20px 36px -8px rgba(40,40,60,.35);z-index:5}
  .pol .ph{width:100%;height:100%;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% ${m.y2 || 50}%/cover}
  .pol .cap{position:absolute;left:0;right:0;bottom:8px;text-align:center;font:400 22px 'Klee One';color:#3B4C6E}
  .tape{position:absolute;left:50%;top:-18px;width:130px;height:36px;margin-left:-65px;background:${m.acc};opacity:.72;transform:rotate(-3deg);
    -webkit-mask:linear-gradient(90deg,transparent 0,#000 4px,#000 calc(100% - 4px),transparent 100%)}
  .ti{position:absolute;left:64px;top:800px;width:640px;font:400 ${m.fs || 66}px/1.02 'Gloock';color:#1F2A44}
  .meta{position:absolute;left:68px;top:${m.my || 850}px;font:500 17px 'Outfit';letter-spacing:.34em;color:${m.acc}}
  .grid{position:absolute;left:60px;right:60px;top:${m.gy || 930}px;height:264px;
    background-image:linear-gradient(90deg,rgba(80,120,190,.22) 1.5px,transparent 1.5px),linear-gradient(180deg,rgba(80,120,190,.22) 1.5px,transparent 1.5px);
    background-size:60px 66px;border:1.5px solid rgba(80,120,190,.35)}
  .wr{position:absolute;left:78px;right:200px;top:${(m.gy || 930) + 8}px;font:600 39px/66px 'Klee One';color:#2C4382;opacity:.92;transform:rotate(-.4deg)}
  .stamp{position:absolute;right:80px;top:${(m.gy || 930) + 112}px;width:150px;height:150px;border:5px solid #D8473B;border-radius:50%;
    display:flex;flex-direction:column;align-items:center;justify-content:center;color:#D8473B;font:700 ${m.stamp ? 16 : 19}px/1.25 'Zen Old Mincho';text-align:center;
    transform:rotate(-14deg);opacity:.86;mix-blend-mode:multiply}
  .stamp:before{content:'';position:absolute;inset:6px;border:2px solid #D8473B;border-radius:50%}
  .ft{position:absolute;left:62px;right:62px;bottom:46px;display:flex;justify-content:space-between;font:500 14px 'Outfit';letter-spacing:.4em;color:#8A8676}
  </style></head><body><div class="paper"></div>
  <div class="hdr"><div class="no">Nº 0${i} / 0${n}</div><div class="dt">${m.date}${icons[m.w](m.acc)}</div></div><div class="jt">夏休みの絵日記</div>
  <div class="box"><div class="ph"></div></div>
  <div class="pol"><div class="tape"></div><div class="ph"></div><div class="cap">${m.cap}</div></div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div>
  <div class="grid"></div><div class="wr">${m.diary}</div>
  <div class="stamp">${m.stamp || 'よく<br>できました'}</div>
  <div class="ft"><span>MISSING SUMMER</span><span>${m.yr}</span></div>${grain(.1)}</body></html>`;
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
