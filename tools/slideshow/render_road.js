// ROAD ATLAS inside slides (1080x1350): cream road-atlas page w/ faint map roads, big white-bordered still,
// green highway sign w/ title overlapping it, tilted polaroid inset, interstate shield w/ number, meta + italic line.
// Usage: node render_road.js DIR  (DIR/slides_road.json) -> DIR/out/0X.jpg
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_road.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('Ov', 'overpass', 600) + ff('Ov', 'overpass', 800) + ff('Ov', 'overpass', 900) + ff('Gel', 'gelasio', 500, 'italic') + ff('Dam', 'damion', 400) + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;position:relative;overflow:hidden;background:#EEE4CF;font-family:Ov;color:#2A2622}
.map{position:absolute;inset:0}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/><feColorMatrix values='0 0 0 0 .3 0 0 0 0 .25 0 0 0 0 .2 0 0 0 .9 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}
.hdr{position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;font-weight:800;font-size:22px;letter-spacing:.34em;color:#2A2622}
.hdr b{color:#B5462E}
.still{position:absolute;left:60px;top:100px;width:960px;height:600px;border:12px solid #FBF7EE;border-radius:10px;box-shadow:0 18px 40px rgba(60,40,20,.28);background-size:cover;background-position:center}
.sign{position:absolute;left:94px;top:640px;background:#0B6B3E;border:4px solid #fff;outline:6px solid #0B6B3E;border-radius:14px;padding:14px 44px 10px;color:#fff;box-shadow:0 14px 28px rgba(0,0,0,.35);text-align:center}
.sign .t{font-weight:800;line-height:1.04;white-space:nowrap}
.sign .e{font-weight:600;font-size:22px;letter-spacing:.34em;margin-top:6px}
.pol{position:absolute;right:70px;top:820px;width:380px;background:#FBF7EE;padding:14px 14px 54px;transform:rotate(4deg);box-shadow:0 14px 30px rgba(60,40,20,.3)}
.pol div{width:352px;height:240px;background-size:cover;background-position:center}
.pol span{position:absolute;bottom:10px;left:0;right:0;text-align:center;font-family:Dam;font-size:34px;color:#B5462E}
.meta{position:absolute;left:94px;top:var(--mt);width:520px}
.meta .m{font-weight:800;font-size:23px;letter-spacing:.26em;color:#B5462E}
.meta .w{font-weight:600;font-size:23px;letter-spacing:.2em;margin-top:10px;color:#2A2622}
.meta .l{font-family:Gel;font-style:italic;font-size:41px;line-height:1.22;margin-top:26px;color:#2A2622}
.shield{position:absolute;left:84px;bottom:58px}
.road{position:absolute;left:0;right:0;bottom:84px;height:0;border-top:6px dashed #D9A52B;opacity:.85}
.mi{position:absolute;right:66px;bottom:66px;font-weight:800;font-size:22px;letter-spacing:.3em;color:#2A2622}
`;
const map = `<svg class="map" width="1080" height="1350" viewBox="0 0 1080 1350"><g fill="none" stroke-linecap="round">
<path d="M-20 300 C 200 260, 330 420, 520 380 S 900 250, 1110 330" stroke="#C9573B" stroke-opacity=".22" stroke-width="5"/>
<path d="M-20 980 C 180 900, 300 1080, 560 1020 S 860 900, 1110 990" stroke="#C9573B" stroke-opacity=".2" stroke-width="5"/>
<path d="M140 -20 C 180 300, 90 600, 210 900 S 260 1200, 200 1370" stroke="#5B7FA8" stroke-opacity=".2" stroke-width="3"/>
<path d="M860 -20 C 800 300, 940 640, 860 900 S 800 1200, 900 1370" stroke="#5B7FA8" stroke-opacity=".2" stroke-width="3"/>
<path d="M-20 640 L 1110 700" stroke="#8C7B60" stroke-opacity=".18" stroke-width="2" stroke-dasharray="10 8"/>
<path d="M500 -20 C 520 400, 640 800, 600 1370" stroke="#8C7B60" stroke-opacity=".15" stroke-width="2" stroke-dasharray="10 8"/></g></svg>`;
const shield = n => `<svg class="shield" width="92" height="98" viewBox="0 0 92 98"><path d="M6 6 Q46 -4 86 6 Q94 60 46 94 Q-2 60 6 6Z" fill="#fff" stroke="#2A2622" stroke-width="3"/>
<path d="M10 10 Q46 2 82 10 L83 28 L9 28Z" fill="#B5462E"/><path d="M9 31 L83 31 Q86 62 46 89 Q6 62 9 31Z" fill="#24427A"/>
<text x="46" y="24" text-anchor="middle" font-family="Ov" font-weight="800" font-size="12" fill="#fff" letter-spacing="1">ROAD</text>
<text x="46" y="70" text-anchor="middle" font-family="Ov" font-weight="900" font-size="34" fill="#fff">${n}</text></svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const html = `<html><head><style>${css}</style></head><body>${map}
<div class="hdr"><span>ROAD ATLAS · <b>THE LONG DRIVE HOME</b></span><span>${n} / 05</span></div>
<div class="still" style="background-image:url(file://${D}/${f.main});background-position:${f.mx || 50}% 50%"></div>
<div class="pol"><div style="background-image:url(file://${D}/${f.inset});background-position:${f.ix || 50}% 50%"></div><span>${f.cap}</span></div>
<div class="sign"><div class="t" style="font-size:${f.fs || 72}px">${f.t}</div><div class="e">EXIT ${n} &nbsp;↑</div></div>
<div class="meta" style="--mt:${f.mt || 830}px"><div class="m">${f.yr} · ${f.dir.toUpperCase()}</div><div class="w">STREAMING ON ${f.where.toUpperCase()}</div><div class="l">${f.line}</div></div>
<div class="road"></div>${shield(i + 1)}<div class="mi">MILE ${f.mile}</div>
<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${n}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
