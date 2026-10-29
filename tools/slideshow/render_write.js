// TYPEWRITER PAGE inside slides (1080x1350): textured cream paper, big still with a thin white border pinned top,
// typed Special Elite title (two-tone ribbon: black title, red number/year), blue-ink handwritten note,
// small tilted second still overlapping bottom-right. Usage: node render_write.js DIR  (DIR/slides_w.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_w.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('Typ', 'special-elite', 400) + ff('Cou', 'courier-prime', 700) + ff('Hand', 'homemade-apple', 400) +
  `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;background:#F1E7D4 url(file://${D}/paper_big.png);position:relative}
  .big{position:absolute;left:60px;top:70px;width:960px;height:640px;padding:14px;background:#FBF8F1;box-shadow:0 10px 30px rgba(60,40,20,.28);transform:rotate(-.8deg)}
  .big div,.small div{width:100%;height:100%;background-size:cover;filter:saturate(1.02) contrast(1.03)}
  .small{position:absolute;right:58px;bottom:70px;width:360px;height:250px;padding:10px;background:#FBF8F1;box-shadow:0 8px 22px rgba(60,40,20,.3);transform:rotate(3deg)}
  .num{position:absolute;left:92px;top:770px;font:400 32px Typ;color:#B8302A;letter-spacing:.18em}
  .t{position:absolute;left:88px;right:60px;top:820px;font:400 86px/1.05 Typ;color:#1F1B18;opacity:.94}
  .y{position:absolute;left:92px;font:700 32px Cou;color:#B8302A;letter-spacing:.14em}
  .n{position:absolute;left:96px;width:560px;font:400 46px/1.75 Hand;color:#2A4F95;transform:rotate(-2.2deg);transform-origin:left}
  .grain{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(90,60,30,.16));pointer-events:none}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const yT = 820 + 91 * (f.lines || 1);
    const html = `<html><head><style>${css}</style></head><body>
      <div class="big"><div style="background-image:url(file://${D}/${f.big});background-position:${f.bx || 50}% 50%"></div></div>
      <div class="num">0${i + 1} / 0${S.films.length}</div>
      <div class="t" style="font-size:${f.fs || 86}px">${f.t}</div>
      <div class="y" style="top:${yT + 28}px">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div>
      <div class="n" style="top:${yT + 92}px">${f.note}</div>
      <div class="small"><div style="background-image:url(file://${D}/${f.small});background-position:${f.sx || 50}% 50%"></div></div>
      <div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
