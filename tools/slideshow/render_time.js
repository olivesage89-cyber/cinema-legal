// REWIND STRIP inside slides (1080x1350): two stills stacked edge to edge, black band with signal-red hairlines,
// '◀◀ LOOP 0N / 05 · MOVIES THAT BEND TIME', red timecode, Syne 800 title, mono 'year | where', Instrument Serif italic line.
// Usage: node render_time.js DIR   (DIR/plan.json films[].slide:[img1,img2])
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const P = JSON.parse(fs.readFileSync(D + '/plan.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const INK = P.ink || '#FF4433';
const css = ff('Sy', 'syne', 800) + ff('Is', 'instrument-serif', 400, 'italic') + ff('Mo', 'jetbrains-mono', 700) + `
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#050507;color:#F3EFE8;overflow:hidden;position:relative}
.s{position:absolute;left:0;width:1080px;height:490px;background-size:cover;filter:contrast(1.05) saturate(1.04)}
.band{position:absolute;left:0;top:984px;width:1080px;height:366px;background:#08080B;border-top:3px solid ${INK}}
.k{position:absolute;top:30px;left:52px;font:700 22px Mo;letter-spacing:.3em;color:${INK}}
.tc{position:absolute;top:30px;right:52px;font:700 22px Mo;letter-spacing:.1em;color:${INK}}
.t{position:absolute;top:84px;width:100%;text-align:center;font:800 var(--fs) Sy;white-space:nowrap;line-height:1.05}
.m{position:absolute;top:200px;width:100%;text-align:center;font:700 23px Mo;letter-spacing:.3em;color:${INK}}
.l{position:absolute;top:248px;width:100%;text-align:center;font:italic 400 42px Is;color:#E6E0D6;padding:0 60px}
.prog{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);display:flex;gap:10px}
.prog i{width:34px;height:4px;background:#3a3a40}.prog i.on{background:${INK}}
.g{position:absolute;inset:0;background:url(file://${D}/_grain.png);opacity:.10;mix-blend-mode:overlay}
.seam{position:absolute;left:0;top:490px;width:100%;height:4px;background:#050507}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (let i = 0; i < P.films.length; i++) {
    const f = P.films[i]; const [a, c] = f.slide;
    const tcode = `00:0${5 - i}:${String(59 - i * 7).padStart(2, '0')}:${String((i * 7) % 24).padStart(2, '0')}`;
    const html = `<html><head><style>${css}</style></head><body>
<div class="s" style="top:0;background-image:url(file://${D}/${a[0]});background-position:${a[1]}% ${a[2]}%"></div>
<div class="s" style="top:494px;background-image:url(file://${D}/${c[0]});background-position:${c[1]}% ${c[2]}%"></div>
<div class="band"><div class="k"><span style="font-family:'DejaVu Sans';letter-spacing:-.12em">◀◀</span>&nbsp; LOOP 0${i + 1} / 05</div>
<div class="tc">${tcode}</div><div class="t" style="--fs:${f.sfs || 92}px">${f.t}</div>
<div class="m">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div><div class="l">${f.line}</div>
<div class="prog">${[0, 1, 2, 3, 4].map(k => `<i class="${k == i ? 'on' : ''}"></i>`).join('')}</div></div>
<div class="g"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.t.toLowerCase().replace(/[^a-z]+/g, '_')}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
