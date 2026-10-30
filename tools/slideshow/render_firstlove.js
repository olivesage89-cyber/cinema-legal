// "first love" anime inside slides: blush magazine page. node render_firstlove.js DIR (DIR/slides_fl.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_fl.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('Scr', 'parisienne', 400) + ff('Jo', 'jost', 400) + ff('Jo', 'jost', 500) + ff('Fr', 'fraunces', 300, 'italic') + ff('Fr', 'fraunces', 400, 'italic') +
 `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#F7E8E4;font-family:Jo;color:#3A2A30;position:relative;overflow:hidden}
 .grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:multiply;pointer-events:none}
 .img{background-size:cover;position:absolute}
 .big{left:54px;right:54px;top:676px;bottom:58px;border-radius:26px;filter:saturate(1.04) contrast(1.02);box-shadow:0 18px 40px rgba(80,30,40,.18)}
 .inset{width:332px;height:430px;right:74px;top:120px;border:13px solid #fff;transform:rotate(3deg);box-shadow:0 14px 30px rgba(80,30,40,.22)}
 .top{position:absolute;top:44px;left:66px;right:66px;display:flex;justify-content:space-between;align-items:center}
 .mark{font:400 52px Scr;color:#E07D97}.cnt{font:500 21px Jo;letter-spacing:.4em}
 .t{position:absolute;left:62px;top:150px;width:560px;font:italic 400 var(--fs)/1.02 Fr;letter-spacing:-.01em}
 .meta{position:absolute;left:66px;width:560px;font:500 22px Jo;letter-spacing:.3em;top:var(--my)}
 .rule{width:90px;height:2px;margin:24px 0 22px}
 .line{font:italic 300 38px/1.3 Fr;letter-spacing:0;color:#3A2A30;width:520px}
 .where{font:500 20px Jo;letter-spacing:.34em;margin-top:22px;opacity:.75}`;
const grain = `<svg class="grain" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .4  0 0 0 0 .42  0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, m] of S.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body>
     <div class="img big" style="background-image:url(file://${D}/${m.big});background-position:${m.bx || 50}% 50%"></div>
     <div class="img inset" style="background-image:url(file://${D}/${m.inset});background-position:${m.ix || 50}% 50%"></div>
     <div class="top"><span class="mark">first love</span><span class="cnt" style="color:${m.c}">Nº ${i + 1} / ${S.films.length}</span></div>
     <div class="t" style="--fs:${m.fs || 104}px;color:${m.c}">${m.t}</div>
     <div class="meta" style="--my:${m.my || 400}px">${m.meta}<div class="rule" style="background:${m.c}"></div><div class="line">${m.line}</div><div class="where" style="color:${m.c}">WATCH ON ${m.where.toUpperCase()}</div></div>
     ${grain}</body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${m.slug}.png` });
  }
  await b.close();
})();
