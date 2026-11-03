// "anime that look like nothing you've ever seen": cover (Angel's Egg red sky + pink clouds + teal-eyed ark, sky extended up,
// Syne spaced kicker + giant teal Unbounded 'nothing' + Gelasio italic line) + RISO PRINT inside slides (paper page, still printed with
// a misregistered spot-ink block behind it, taped second still, Dela Gothic One title in per-film riso ink, registration marks).
// node render_strange.js DIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_strange.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Ub', 'unbounded', 300) + ff('Ub', 'unbounded', 800) + ff('Sy', 'syne', 600) + ff('Sy', 'syne', 700) + ff('Ge', 'gelasio', 400, 'italic') + ff('Ge', 'gelasio', 500, 'italic')
  + ff('Sg', 'space-grotesk', 500) + ff('Sg', 'space-grotesk', 400);
const link = `<link rel="stylesheet" href="file://${F}dela-gothic-one/400.css">`;
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const paper = `<svg style="position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;pointer-events:none;z-index:1" width="1080" height="1350"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".035 .6" numOctaves="2" seed="4"/><feColorMatrix values="0 0 0 0 .93  0 0 0 0 .9  0 0 0 0 .84  0 0 0 -.9 1.05"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
const reg = (x, y, c) => `<svg style="position:absolute;left:${x}px;top:${y}px;z-index:6" width="34" height="34" viewBox="0 0 34 34"><circle cx="17" cy="17" r="9" fill="none" stroke="${c}" stroke-width="1.6"/><path d="M17 0v34M0 17h34" stroke="${c}" stroke-width="1.6"/></svg>`;
function cover(c) {
  return `<html><head><style>${fonts}${base}
  body{background:url(file://${D}/${c.img}) 0 0/1080px 1350px}
  .shade{position:absolute;inset:0;background:radial-gradient(ellipse 75% 32% at 50% 22%,rgba(40,0,6,.28),transparent 70%),linear-gradient(180deg,rgba(30,0,4,.25),transparent 30%,transparent 80%,rgba(10,0,4,.35))}
  .top{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
  .kick{font:700 22px Sy;letter-spacing:.55em;padding-left:.55em;color:#F6E3DC}
  .hero{font:800 ${c.hs}px/0.95 Ub;color:${c.ink};letter-spacing:-.035em;margin-top:22px;text-shadow:0 0 50px ${c.ink}55,0 8px 36px rgba(40,0,6,.55)}
  .rule{display:flex;align-items:center;justify-content:center;gap:20px;margin-top:20px;font:300 24px Ub;letter-spacing:.42em;padding-left:.42em;color:#F6E3DC}
  .rule i{display:block;width:70px;height:1.5px;background:${c.ink}}
  .sub{margin-top:30px;font:italic 400 37px/1.3 Ge;color:#F8E9E2;text-shadow:0 2px 18px rgba(40,0,6,.7)}
  .sub b{font-weight:500;color:${c.ink}}
  </style></head><body><div class="shade"></div>
  <div class="top"><div class="kick">${c.kick}</div><div class="hero">${c.h1}</div><div class="rule"><i></i>${c.h2}<i></i></div><div class="sub">${c.sub}</div></div>
  ${grain(.2)}</body></html>`;
}
function inside(m, i, n) {
  const rot = [-2.2, 1.8, -1.6, 2.4, -2][i];
  return `<html><head>${link}<style>${fonts}${base}
  body{background:#F1ECE1}
  .hdr{position:absolute;top:44px;left:70px;right:70px;display:flex;justify-content:space-between;font:500 17px Sg;letter-spacing:.3em;color:#2a2622;z-index:7}
  .hdr b{color:${m.ink};font-weight:500}
  .blk{position:absolute;left:${70 + 16}px;top:${120 + 16}px;width:940px;height:529px;background:${m.ink};mix-blend-mode:multiply;z-index:2}
  .pic{position:absolute;left:70px;top:120px;width:940px;height:529px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;z-index:3;
    filter:contrast(1.03) saturate(1.02)}
  .pic:after{content:'';position:absolute;inset:0;background:radial-gradient(circle,rgba(0,0,0,.09) 1px,transparent 1.6px) 0 0/6px 6px;mix-blend-mode:multiply}
  .sm{position:absolute;right:58px;top:560px;width:390px;height:220px;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% ${m.y2 || 50}%/cover;
     border:11px solid #FBF8F2;box-shadow:0 18px 34px rgba(30,20,10,.28),0 2px 6px rgba(0,0,0,.18);transform:rotate(${rot}deg);z-index:5}
  .tape{position:absolute;right:${58 + 150}px;top:540px;width:110px;height:34px;background:${m.ink}aa;mix-blend-mode:multiply;transform:rotate(${-rot * 1.5}deg);z-index:6}
  .num{position:absolute;left:62px;top:672px;font:800 150px/1 Ub;color:transparent;-webkit-text-stroke:2px ${m.ink};letter-spacing:-.04em;z-index:4}
  .flow{position:absolute;left:70px;top:${m.tt || 868}px;width:920px;z-index:4}
  .t{width:${m.tw || 900}px;font:400 ${m.fs || 92}px/1.02 'Dela Gothic One';color:${m.ink};letter-spacing:-.01em;z-index:4;mix-blend-mode:multiply}
  .meta{margin:30px 0 0 2px;font:500 19px Sg;letter-spacing:.24em;color:#2a2622;z-index:4}
  .line{margin:20px 0 0 2px;width:880px;font:italic 400 38px/1.28 Ge;color:#2a2622;z-index:4}
  .foot{position:absolute;left:70px;right:70px;bottom:44px;display:flex;justify-content:space-between;font:400 15px Sg;letter-spacing:.28em;color:#6d655b;z-index:4}
  .sw{display:flex;gap:6px}.sw i{display:block;width:18px;height:18px;background:${m.ink}}.sw i:nth-child(2){opacity:.6}.sw i:nth-child(3){opacity:.3}
  </style></head><body>${paper}
  <div class="hdr"><span>Nº 0${i + 1} <b>/</b> 0${n}</span><span>${m.kind}</span></div>
  <div class="blk"></div><div class="pic"></div><div class="sm"></div><div class="tape"></div>
  <div class="num">0${i + 1}</div>
  <div class="flow"><div class="t">${m.t}</div><div class="meta">${m.meta}</div><div class="line">${m.ov}</div></div>
  <div class="foot"><span>${m.inkname}</span><div class="sw"><i></i><i></i><i></i></div></div>
  ${reg(28, 28, m.ink)}${reg(1018, 28, m.ink)}${reg(28, 1288, m.ink)}${reg(1018, 1288, m.ink)}
  ${grain(.13)}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, name) => { fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html'); await p.waitForTimeout(500);
    await p.screenshot({ path: `${D}/out/${name}`, type: 'jpeg', quality: 93 }); };
  await shot(cover(S.cover), '01_cover.jpg');
  for (let i = 0; i < S.movies.length; i++) await shot(inside(S.movies[i], i, S.movies.length), `0${i + 2}_${S.movies[i].slug}.jpg`);
  await b.close();
})();
