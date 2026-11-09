// FAR NORTH inside slides (1080x1350): wide still on top, slanted arctic-navy band with topo contours + glacier hairlines,
// tilted text (mono latitude line, Cinzel title, mono year|where, Cormorant italic line), two tall stills below.
// Usage: node render_north.js DIR   (DIR/plan.json films[].slide:[[img,x,y],[img,x,y],[img,x,y]])
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const P = JSON.parse(fs.readFileSync(D + '/plan.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const INK = P.ink || '#8FD6FF';
const BT = [590, 500], BB = [880, 790], ANG = -4.76, CY = (590 + 500 + 880 + 790) / 4;
const poly = `0,${BT[0]} 1080,${BT[1]} 1080,${BB[1]} 0,${BB[0]}`;
let paths = ''; for (let k = 0; k < 9; k++) { const y0 = 470 + k * 50; let pts = []; for (let x = -40; x <= 1140; x += 60) pts.push(`${x},${(y0 + 24 * Math.sin(x / 140 + k * 1.3)).toFixed(0)}`); paths += `<polyline points='${pts.join(' ')}' fill='none' stroke='${INK}' stroke-opacity='.11' stroke-width='2'/>`; }
const css = ff('Ci', 'cinzel', 700) + ff('Co', 'cormorant-garamond', 500, 'italic') + ff('Mo', 'space-mono', 700) + `
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#081422;color:#F2F6F8;overflow:hidden;position:relative}
.s{position:absolute;background-size:cover;filter:contrast(1.05) saturate(1.03)}
.blk{position:absolute;left:0;top:${CY - 200}px;width:100%;height:400px;transform:rotate(${ANG}deg);display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.k{font:700 21px Mo;letter-spacing:.36em;padding-left:.36em;color:${INK}}
.t{font:700 var(--fs)/1.02 Ci;letter-spacing:.03em;white-space:nowrap;margin:14px 0 16px}
.m{font:700 21px Mo;letter-spacing:.3em;padding-left:.3em;color:${INK}}
.l{font:italic 500 37px/1.1 Co;color:#DCE8EE;margin-top:8px}
.g{position:absolute;inset:0;background:url(file://${D}/_grain.png);opacity:.10;mix-blend-mode:overlay}
.seam{position:absolute;left:538px;top:760px;width:4px;height:600px;background:#081422}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (let i = 0; i < P.films.length; i++) {
    const f = P.films[i]; const [a, c, d] = f.slide;
    const html = `<html><head><style>${css}</style></head><body>
<div class="s" style="left:0;top:0;width:1080px;height:620px;background-image:url(file://${D}/${a[0]});background-position:${a[1]}% ${a[2]}%"></div>
<div class="s" style="left:0;top:760px;width:540px;height:590px;background-image:url(file://${D}/${c[0]});background-position:${c[1]}% ${c[2]}%"></div>
<div class="s" style="left:540px;top:760px;width:540px;height:590px;background-image:url(file://${D}/${d[0]});background-position:${d[1]}% ${d[2]}%"></div>
<div class="seam"></div>
<svg width="1080" height="1350" style="position:absolute;left:0;top:0"><defs><clipPath id="cp"><polygon points="${poly}"/></clipPath>
<linearGradient id="lg" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#081422"/><stop offset="1" stop-color="#0D2032"/></linearGradient></defs>
<polygon points="${poly}" fill="url(#lg)"/><g clip-path="url(#cp)">${paths}</g>
<line x1="0" y1="${BT[0]}" x2="1080" y2="${BT[1]}" stroke="${INK}" stroke-width="4"/><line x1="0" y1="${BB[0]}" x2="1080" y2="${BB[1]}" stroke="${INK}" stroke-width="4"/></svg>
<div class="blk"><div class="k">THE FAR NORTH &nbsp;·&nbsp; 0${i + 1} / 05 &nbsp;·&nbsp; ${f.geo}</div><div class="t" style="--fs:${f.sfs || Math.round((f.fs || 90) * 0.92)}px">${f.t}</div>
<div class="m">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div><div class="l">${f.line}</div></div>
<div class="g"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.t.replace(/<br>/g, ' ').toLowerCase().replace(/[^a-z]+/g, '_')}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
