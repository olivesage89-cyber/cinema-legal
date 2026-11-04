// GILDED COURT inside slides (1080x1350): oxblood velvet page with faint gold damask, big still in a double gilt
// rounded frame, an oval gilt-rimmed cameo still overlapping its lower-right corner, rose Cinzel 'ACT N' kicker,
// Cinzel title, Bodoni italic line, gold 'year | where' with diamonds. Usage: node render_court.js DIR (DIR/slides_c.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_c.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const G = '#CFA960', R = '#EBA9B6', INK = '#F6ECDD';
const dam = `<svg xmlns='http://www.w3.org/2000/svg' width='96' height='192'><g fill='none' stroke='${G}' stroke-opacity='.11' stroke-width='2'><path d='M48 8 C78 40 78 56 48 88 C18 56 18 40 48 8Z'/><path d='M0 104 C30 136 30 152 0 184 M96 104 C66 136 66 152 96 184'/></g><g fill='${G}' fill-opacity='.16'><circle cx='48' cy='48' r='4'/><circle cx='0' cy='144' r='4'/><circle cx='96' cy='144' r='4'/></g></svg>`;
const css = ff('Ci', 'cinzel', 400) + ff('Ci', 'cinzel', 600) + ff('Bo', 'bodoni-moda', 400, 'italic') +
  `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;color:${INK};
   background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 40%,rgba(8,1,3,.75)),url("data:image/svg+xml;utf8,${encodeURIComponent(dam)}"),#21060C}
  .big{position:absolute;left:60px;top:64px;width:960px;height:680px;border-radius:30px;border:3px solid ${G};box-shadow:0 0 0 9px #21060C,0 0 0 10px rgba(207,169,96,.45),0 20px 50px rgba(0,0,0,.5);overflow:hidden}
  .big div,.cam div{width:100%;height:100%;background-size:cover;filter:saturate(1.03) contrast(1.04)}
  .cam{position:absolute;right:56px;top:600px;width:270px;height:350px;border-radius:50%;border:4px solid ${G};box-shadow:0 0 0 8px #21060C,0 0 0 9.5px rgba(207,169,96,.6),0 16px 40px rgba(0,0,0,.6);overflow:hidden}
  .k{position:absolute;left:82px;top:810px;display:flex;align-items:center;gap:14px;font:400 24px Ci;letter-spacing:.32em;color:${R}}
  .k i{width:46px;height:1.6px;background:linear-gradient(90deg,transparent,${G})}
  .t{position:absolute;left:78px;width:640px;top:858px;font:600 84px/1.05 Ci;letter-spacing:.02em}
  .l{position:absolute;left:82px;width:640px;font:400 italic 38px/1.3 Bo}
  .y{position:absolute;left:82px;display:flex;align-items:center;gap:14px;font:400 24px Ci;letter-spacing:.28em;color:${G}}
  .y b{width:9px;height:9px;transform:rotate(45deg);background:${R}}
  .grain{position:absolute;inset:0;background-image:url(file://${D}/grain.png);opacity:.5;mix-blend-mode:overlay}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const yM = 1244, yL = yM - 122, yT = yL - 22 - 88 * (f.lines || 1), yK = yT - 48, bh = yK - 64 - 66;
    const html = `<html><head><style>${css}</style></head><body>
      <div class="big" style="height:${bh}px"><div style="background-image:url(file://${D}/${f.big});background-position:${f.bx || 50}% ${f.by || 50}%"></div></div>
      <div class="cam" style="top:${64 + bh - 150}px"><div style="background-image:url(file://${D}/${f.cam});background-position:${f.cx || 50}% ${f.cy || 40}%"></div></div>
      <div class="k" style="top:${yK}px">${f.act}<i></i></div>
      <div class="t" style="top:${yT}px;font-size:${f.fs || 84}px">${f.t}</div>
      <div class="l" style="top:${yL}px">${f.line}</div>
      <div class="y" style="top:${yM}px"><b></b>${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div>
      <div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
