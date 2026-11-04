// HEART RATE inside slides (1080x1350): dark speed-lined page, 'LAP 0X / 05' + rising BPM header, big slanted still
// with coral leading edge, tilted white-bordered inset still, giant outlined lap number, skewed Big Shoulders title,
// JetBrains Mono studio · year | where, Spectral italic line, ECG pulse footer. Usage: node render_race.js DIR (DIR/slides_race.json)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_race.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const INK = S.ink || '#FF5A3C';
const css = ff('Bs', 'big-shoulders-display', 900) + ff('Sp', 'spectral', 400, 'italic') + ff('Jm', 'jetbrains-mono', 400) + ff('Jm', 'jetbrains-mono', 700) + `
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;background:#0B0B10;color:#FFF4EA;overflow:hidden;position:relative}
.lines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent 0 37px,rgba(255,255,255,.025) 37px 39px)}
.hd{position:absolute;top:44px;left:60px;right:60px;display:flex;justify-content:space-between;font:700 22px Jm;letter-spacing:.34em}
.hd .b{color:${INK}}
.big{position:absolute;top:104px;left:0;width:1080px;height:640px;background-size:cover;clip-path:polygon(0 0,100% 0,100% 88%,0 100%)}
.edge{position:absolute;top:104px;left:0;width:1080px;height:640px;clip-path:polygon(0 0,100% 0,100% 88%,0 100%);box-shadow:inset 0 -6px 0 ${INK}}
.edge2{position:absolute;left:0;top:741px;width:1090px;height:5px;background:${INK};transform-origin:0 0;transform:rotate(-4.08deg);box-shadow:0 0 18px ${INK}}
.num{position:absolute;right:46px;top:648px;font:900 300px/1 Bs;color:transparent;-webkit-text-stroke:3px ${INK};opacity:.9;transform:skewX(-8deg)}
.ins{position:absolute;right:70px;top:930px;width:400px;height:240px;background-size:cover;border:9px solid #FFF4EA;transform:rotate(3.5deg);box-shadow:0 18px 40px rgba(0,0,0,.6)}
.tx{position:absolute;left:62px;top:790px;width:560px}
.t{font:900 96px/.9 Bs;letter-spacing:.01em;transform:skewX(-8deg);transform-origin:0 100%}
.m{font:400 21px Jm;letter-spacing:.24em;margin-top:22px;color:${INK}}
.l{font:400 italic 36px/1.3 Sp;margin-top:22px;color:#FFF4EA;opacity:.94}
.ecg{position:absolute;left:0;bottom:62px;width:1080px}
.bpm{position:absolute;left:62px;bottom:38px;font:400 19px Jm;letter-spacing:.3em;color:rgba(255,244,234,.6)}
.grain{position:absolute;inset:0;opacity:.11;mix-blend-mode:overlay;background:url(data:image/svg+xml;base64,${Buffer.from(`<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='300' height='300' filter='url(#n)'/></svg>`).toString('base64')})}`;
function ecg(w, h) {
  const u = w / 3; let p = [];
  for (let k = 0; k < 3; k++) { const b = k * u; p.push([b, .5], [b + u * .30, .5], [b + u * .36, .40], [b + u * .42, .5], [b + u * .48, .5], [b + u * .52, .05], [b + u * .57, .95], [b + u * .61, .5], [b + u * .70, .5], [b + u * .78, .36], [b + u * .86, .5]); }
  p.push([w, .5]);
  return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible"><polyline points="${p.map(([a, c]) => `${a.toFixed(1)},${(c * h).toFixed(1)}`).join(' ')}" fill="none" stroke="${INK}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round" style="filter:drop-shadow(0 0 7px ${INK})"/></svg>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body><div class="lines"></div>
<div class="big" style="background-image:url(file://${D}/${f.big});background-position:${f.bx || 50}% ${f.by || 50}%"></div><div class="edge2"></div>
<div class="hd"><span>LAP 0${i + 1} / 05</span><span class="b">&#9829; ${f.bpm} BPM</span></div>
<div class="num">0${i + 1}</div>
<div class="ins" style="background-image:url(file://${D}/${f.ins});background-position:${f.ix || 50}% ${f.iy || 50}%"></div>
<div class="tx"><div class="t" style="font-size:${f.fs || 96}px">${f.t}</div><div class="m">${f.meta}</div><div class="l">${f.line}</div></div>
<div class="ecg">${ecg(1080, 60)}</div><div class="bpm">HEART RATE RISING</div><div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
