// "dream" anime inside slides: per-film colour wash, soft feathered oval still dissolving into the wash,
// small glowing bubble still, Playfair italic title + Marcellus caps. node render_dream.js DIR (DIR/slides_dream.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_dream.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('Scr', 'pinyon-script', 400) + ff('Mar', 'marcellus', 400) + ff('Pf', 'playfair-display', 400, 'italic') + ff('Pf', 'playfair-display', 500, 'italic') +
 `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;font-family:Mar;position:relative;overflow:hidden}
 .wash{position:absolute;inset:0}
 .big{position:absolute;left:-40px;right:-40px;top:-30px;height:860px;background-size:cover;
   -webkit-mask-image:radial-gradient(ellipse 62% 58% at 50% 46%,#000 52%,rgba(0,0,0,.6) 70%,transparent 92%);filter:saturate(1.05)}
 .bub{position:absolute;width:250px;height:250px;border-radius:50%;background-size:cover;right:92px;top:610px;
   box-shadow:0 0 0 6px rgba(255,255,255,.18),0 0 60px 10px var(--glow)}
 .stars{position:absolute;inset:0;pointer-events:none}
 .top{position:absolute;top:46px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center;z-index:3}
 .mark{font:400 74px Scr;text-shadow:0 2px 18px rgba(0,0,0,.45)}.cnt{font:400 22px Mar;letter-spacing:.42em;text-shadow:0 2px 12px rgba(0,0,0,.5)}
 .txt{position:absolute;left:78px;width:640px;top:var(--ty)}
 .t{font:italic 500 var(--fs)/1.0 Pf;letter-spacing:-.01em}
 .meta{font:400 23px Mar;letter-spacing:.34em;margin-top:26px;color:rgba(255,255,255,.82)}
 .line{font:italic 400 36px/1.32 Pf;color:rgba(255,255,255,.9);margin-top:22px;width:720px}
 .where{font:400 20px Mar;letter-spacing:.38em;margin-top:26px}
 .grain{position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;pointer-events:none}`;
const grain = `<svg class="grain" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
function stars(seed) { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280, o = '';
  for (let k = 0; k < 46; k++) { const y = 760 + r() * 560, x = r() * 1080, a = .25 + r() * .6, z = .8 + r() * 2.2; o += `<circle cx="${x}" cy="${y}" r="${z}" fill="#fff" opacity="${a}"/>`; }
  return `<svg class="stars" width="1080" height="1350">${o}</svg>`; }
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, m] of S.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body>
     <div class="wash" style="background:radial-gradient(ellipse 90% 60% at 50% 40%,${m.w2},${m.w1} 70%)"></div>
     <div class="big" style="background-image:url(file://${D}/${m.big});background-position:${m.bx || 50}% ${m.by || 50}%"></div>
     ${stars(i * 97 + 13)}
     <div class="bub" style="--glow:${m.c}55;background-image:url(file://${D}/${m.inset});background-position:${m.ix || 50}% 50%"></div>
     <div class="top"><span class="mark" style="color:${m.c}">a dream</span><span class="cnt" style="color:#fff">${String(i + 1).padStart(2, '0')} / 0${S.films.length}</span></div>
     <div class="txt" style="--ty:${m.ty || 860}px"><div class="t" style="--fs:${m.fs || 96}px;color:${m.c}">${m.t}</div>
      <div class="meta">${m.meta}</div><div class="line">${m.line}</div><div class="where" style="color:${m.c}">WATCH ON ${m.where.toUpperCase()}</div></div>
     ${grain}</body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${m.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
