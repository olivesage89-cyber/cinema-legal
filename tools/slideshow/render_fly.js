// "movies that feel like flying" IG slides — AIRPLANE WINDOW: per-film dusk-gradient cabin page, still framed in a big
// cream airplane-window bezel, Syne/DM Serif/Space Grotesk/Yellowtail type, dashed route line. Usage: node render_fly.js WORKDIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Sy','syne',800), ff('Yt','yellowtail',400), ff('Ds','dm-serif-display',400,'italic'), ff('Sg','space-grotesk',500), ff('Sg','space-grotesk',400)].join('');
const grain = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PL = c => `<svg width="30" height="30" viewBox="0 0 24 24" style="transform:rotate(90deg)"><path fill="${c}" d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
function slide(f, i) {
  const a = f.accent;
  return `<meta charset="utf-8"><style>${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;color:#FFF8EC;
  background:radial-gradient(ellipse at 50% 30%,${f.glow} 0,rgba(0,0,0,0) 60%),linear-gradient(180deg,${f.top},${f.bot})}
  .grain{position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;${grain};z-index:50}
  .hdr{position:absolute;top:44px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center}
  .hdr .l{font:500 21px Sg;letter-spacing:.42em;color:${a}} .hdr .r{font:400 44px Yt;color:#FFF8EC;transform:rotate(-4deg)}
  .win{position:absolute;top:130px;left:50%;width:700px;height:790px;margin-left:-350px;border-radius:300px;padding:30px;
    background:linear-gradient(160deg,#F6EFE3,#D9D0C2 60%,#BDB3A4);box-shadow:0 30px 60px rgba(0,0,0,.45),inset 0 4px 10px rgba(255,255,255,.7),inset 0 -6px 14px rgba(0,0,0,.25)}
  .in{width:100%;height:100%;border-radius:272px;overflow:hidden;position:relative;box-shadow:inset 0 0 0 6px rgba(0,0,0,.18)}
  .in img{position:absolute;height:100%;left:50%;transform:translateX(-${f.x}%);filter:saturate(1.05) contrast(1.04)}
  .in:after{content:'';position:absolute;inset:0;border-radius:272px;box-shadow:inset 0 0 50px rgba(0,0,0,.45);background:linear-gradient(130deg,rgba(255,255,255,.16),rgba(255,255,255,0) 35%)}
  .shade{position:absolute;top:-1px;left:0;right:0;height:46px;background:linear-gradient(180deg,#E9E1D3,#CFC6B7);border-bottom:2px solid rgba(0,0,0,.12)}
  .t{position:absolute;top:952px;left:0;right:0;text-align:center}
  .tt{font:400 italic ${f.fs||84}px/1.02 Ds;padding:0 60px} .meta{font:500 22px Sg;letter-spacing:.34em;color:${a};margin-top:18px}
  .line{font:400 italic 34px Ds;opacity:.9;margin-top:16px}
  .route{position:absolute;bottom:56px;left:90px;right:90px;display:flex;align-items:center;gap:22px;font:500 19px Sg;letter-spacing:.32em}
  .route i{flex:1;border-top:2px dashed ${a};opacity:.6} .route .g{position:absolute;right:0;top:-34px;font-size:16px;opacity:.75}
  </style><div class="hdr"><div class="l">FLIGHT 0${i+1} / 05</div><div class="r">feel like flying</div></div>
  <div class="win"><div class="in"><img src="file://${D}/${f.img}"></div></div>
  <div class="t"><div class="tt">${f.t}</div><div class="meta">DIR. ${f.dir.toUpperCase()} &nbsp;·&nbsp; ${f.yr}</div><div class="line">${f.line}</div></div>
  <div class="route"><span>THE GROUND</span><i></i>${PL(a)}<i></i><span style="color:${a}">${f.to}</span><span class="g">GATE · ${f.where.toUpperCase()}</span></div><div class="grain"></div>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    fs.writeFileSync(D + '/_s.html', slide(f, i)); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/0${i+1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
