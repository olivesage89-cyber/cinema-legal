// "a dream you don't want to wake up from" — cover: Howl flower-field still under an extended deep-blue sky,
// cloud dissolving into it; Outfit spaced kicker + white Luxurious Script 'a dream' w/ glow + Italiana wide caps + Literata italic sub.
// Inside: DREAMSCAPE — page = the film's own still, blurred + washed in a deep per-film tint with drifting bokeh;
// main still in a feathered ellipse 'dream bubble' w/ halo rings, round moon inset of a 2nd still, Italiana title,
// Outfit caps dir·year in per-film accent, Literata italic line, 'fell asleep → woke up' dream-length bar (runtime).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = [
  ff('Lux', 'luxurious-script', 400), ff('Ita', 'italiana', 400), ff('Out', 'outfit', 400), ff('Out', 'outfit', 500), ff('Out', 'outfit', 600),
  ff('Lit', 'literata', 400, 'italic'), ff('Lit', 'literata', 400),
].join('') + `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const I = f => `file://${D}/${f}`;

function cover(c) {
  return `<style>${base}
  body{background:linear-gradient(180deg,#0F4A78 0%,#1B6B9C 18%,#2C88B6 30%,#3191BC 40%)}
  .im{position:absolute;left:${c.left}px;top:${c.top}px;height:${1350 - c.top}px;width:auto;filter:saturate(.92) contrast(1.02) brightness(1.01);
      -webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.6) 9%,#000 20%)}
  .glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 22%,rgba(255,255,255,.22),rgba(255,255,255,0) 50%);mix-blend-mode:screen}
  .haze{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,240,250,0) 55%,rgba(255,236,248,.10));}
  .vig{position:absolute;inset:0;box-shadow:inset 0 0 180px rgba(10,30,60,.35)}
  .shd{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(180deg,rgba(20,50,30,0),rgba(20,50,30,.25))}
  .t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;color:#fff}
  .kick{font-family:Out;font-weight:500;font-size:22px;letter-spacing:.62em;margin-left:.62em;opacity:.92}
  .scr{font-family:Lux;font-size:${c.fs}px;line-height:1;margin-top:-6px;text-shadow:0 0 40px rgba(255,255,255,.55),0 0 90px rgba(190,230,255,.6),0 4px 22px rgba(10,40,80,.35)}
  .cap{font-family:Ita;font-size:44px;letter-spacing:.3em;margin-left:.3em;line-height:1.2;margin-top:-14px;text-shadow:0 2px 18px rgba(10,40,80,.45)}
  .star{font-size:18px;letter-spacing:1.2em;margin:18px 0 0 1.2em;opacity:.85}
  .sub{font-family:Lit;font-style:italic;font-size:33px;margin-top:12px;text-shadow:0 2px 16px rgba(10,40,80,.5)}
  </style><img class="im" src="${I(c.img)}"><div class="glow"></div><div class="haze"></div><div class="vig"></div><div class="shd"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="scr">${c.h}</div><div class="cap">${c.h2}</div><div class="star">✦ ✦ ✦</div><div class="sub">${c.sub}</div></div><div class="grain"></div>`;
}

function inside(m, i) {
  const bokeh = (m.bokeh || []).map(([x, y, r, o]) => `<span class="bk" style="left:${x}px;top:${y}px;width:${r}px;height:${r}px;opacity:${o}"></span>`).join('');
  const pct = m.pct ?? 86;
  return `<style>${base}
  body{background:${m.tint}}
  .bg{position:absolute;inset:-80px;background:url(${I(m.img)}) center/cover;filter:blur(46px) saturate(1.25) brightness(.8)}
  .wash{position:absolute;inset:0;background:linear-gradient(180deg,${m.tint}B0 0%,${m.tint}70 38%,${m.tint}D8 62%,${m.tint}F2 100%)}
  .bk{position:absolute;border-radius:50%;background:radial-gradient(circle,${m.acc}AA,${m.acc}00 70%)}
  .hdr{position:absolute;left:84px;right:84px;top:74px;display:flex;justify-content:space-between;align-items:baseline;color:#fff}
  .no{font-family:Out;font-weight:600;font-size:20px;letter-spacing:.42em}
  .no b{color:${m.acc};font-weight:600}
  .mk{font-family:Lux;font-size:44px;opacity:.9}
  .hl{position:absolute;left:84px;right:84px;top:132px;height:1px;background:rgba(255,255,255,.28)}
  .halo{position:absolute;left:50%;top:${178 - 14}px;width:${920 + 28}px;height:${570 + 28}px;margin-left:-${(920 + 28) / 2}px;border-radius:50%;border:1.5px solid rgba(255,255,255,.35)}
  .halo2{position:absolute;left:50%;top:${178 - 30}px;width:${920 + 60}px;height:${570 + 60}px;margin-left:-${(920 + 60) / 2}px;border-radius:50%;border:1px solid ${m.acc}55}
  .ell{position:absolute;left:80px;top:178px;width:920px;height:570px;border-radius:50%;overflow:hidden;
       -webkit-mask-image:radial-gradient(ellipse 50% 50% at 50% 50%,#000 86%,transparent 100%);box-shadow:0 0 80px ${m.acc}55}
  .ell img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(.96) contrast(1.02)}
  .ell:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.10),rgba(255,255,255,0) 60%)}
  .moon{position:absolute;left:${m.mx ?? 760}px;top:${m.my ?? 600}px;width:250px;height:250px;border-radius:50%;overflow:hidden;
        border:6px solid #fff;box-shadow:0 0 0 10px ${m.acc}40,0 18px 40px rgba(0,0,0,.4)}
  .moon img{width:100%;height:100%;object-fit:cover;object-position:${m.ix ?? 50}% ${m.iy ?? 50}%}
  .txt{position:absolute;left:84px;width:${m.tw || 640}px;top:805px;color:#fff}
  .ttl{font-family:Ita;font-size:${m.fs || 84}px;line-height:1.02;letter-spacing:.01em;text-shadow:0 2px 24px rgba(0,0,0,.3)}
  .meta{font-family:Out;font-weight:500;font-size:19px;letter-spacing:.34em;color:${m.acc};margin-top:20px}
  .line{font-family:Lit;font-style:italic;font-size:35px;line-height:1.3;margin-top:22px;opacity:.95;width:900px}
  .bar{position:absolute;left:84px;right:84px;top:1196px;color:#fff;font-family:Out;font-weight:500;font-size:16px;letter-spacing:.3em}
  .lbl{display:flex;justify-content:space-between;opacity:.75}
  .track{position:relative;height:2px;background:rgba(255,255,255,.25);margin:20px 0 18px}
  .fill{position:absolute;left:0;top:0;height:2px;width:${pct}%;background:${m.acc}}
  .dot{position:absolute;left:${pct}%;top:-8px;width:18px;height:18px;margin-left:-9px;border-radius:50%;background:${m.acc};box-shadow:0 0 18px ${m.acc},0 0 40px ${m.acc}}
  .cap2{display:flex;justify-content:space-between;font-family:Lit;font-style:italic;letter-spacing:0;font-size:24px;opacity:.9}
  .cap2 b{font-family:Out;font-style:normal;font-weight:500;font-size:16px;letter-spacing:.3em;color:${m.acc};opacity:1}
  </style><div class="bg"></div><div class="wash"></div>${bokeh}
  <div class="hdr"><div class="no">DREAM <b>Nº 0${i}</b></div><div class="mk">a dream you don't want to wake up from</div></div><div class="hl"></div>
  <div class="halo2"></div><div class="halo"></div>
  <div class="ell"><img src="${I(m.img)}"></div>
  <div class="moon"><img src="${I(m.inset)}"></div>
  <div class="txt"><div class="ttl">${m.t}</div><div class="meta">${m.meta}</div><div class="line">${m.ov}</div></div>
  <div class="bar"><div class="lbl"><span>☾ FELL ASLEEP</span><span>WOKE UP ☀</span></div><div class="track"><div class="fill"></div><div class="dot"></div></div>
    <div class="cap2"><b>DREAM LENGTH · ${m.rt} MIN</b><span>${m.wake}</span></div></div>
  <div class="grain"></div>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[3];
  const jobs = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, k) => [`0${k + 2}_${m.slug}.jpg`, inside(m, k + 1)])].filter(j => !only || j[0].startsWith(only));
  for (const [f, html] of jobs) {
    fs.writeFileSync(D + '/_t.html', `<html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
