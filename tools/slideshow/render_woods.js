// "a walk in the woods" — cover: full-bleed storybook forest, Fraunces italic + Work Sans. Inside: FIELD GUIDE / TRAIL MAP
// (oat paper w/ topographic contour lines, numbered trail marker, big still + tilted inset, dashed trail).
// Usage: node render_woods.js WORKDIR  (WORKDIR/slides.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Fr', 'fraunces', 300, 'italic'), ff('Fr', 'fraunces', 400, 'italic'), ff('Fr', 'fraunces', 600, 'italic'), ff('Fr', 'fraunces', 800, 'italic'),
  ff('Fr', 'fraunces', 600), ff('Fr', 'fraunces', 700),
  ff('WS', 'work-sans', 500), ff('WS', 'work-sans', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#EDE4D0;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.04) brightness(1.02)}
.cv .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,10,6,.86) 0%,rgba(14,10,6,.62) 24%,rgba(14,10,6,.10) 46%,rgba(0,0,0,0) 62%,rgba(10,8,5,.35) 100%)}
.cv .warm{position:absolute;inset:0;background:radial-gradient(ellipse at 49% 66%,rgba(255,214,140,.16),rgba(0,0,0,0) 45%);mix-blend-mode:screen}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%)}
.cv .t{position:absolute;top:92px;left:0;right:0;text-align:center;color:var(--ink)}
.cv .kick{font-family:WS;font-weight:500;font-size:23px;letter-spacing:.5em;padding-left:.5em;opacity:.92}
.cv .l1{font-family:Fr;font-style:italic;font-weight:300;font-size:92px;line-height:1;margin-top:34px;letter-spacing:-.01em}
.cv .l2{font-family:Fr;font-style:italic;font-weight:800;font-size:268px;line-height:.86;letter-spacing:-.035em;margin-top:-4px;text-shadow:0 6px 40px rgba(0,0,0,.35)}
.cv .rule{width:64px;height:1.5px;background:var(--ink);opacity:.7;margin:30px auto 0}
.cv .sub{font-family:Fr;font-style:italic;font-weight:400;font-size:40px;margin-top:22px;opacity:.97;text-shadow:0 2px 18px rgba(30,20,8,.55)}
.cv .swipe{position:absolute;bottom:56px;left:0;right:0;text-align:center;color:var(--ink);font-family:WS;font-weight:500;font-size:19px;letter-spacing:.42em;opacity:.8}
/* inside: field guide */
.pg .topo{position:absolute;inset:0}
.pg .hd{position:absolute;top:52px;left:56px;right:56px;display:flex;justify-content:space-between;font-family:WS;font-weight:600;font-size:17px;letter-spacing:.34em;color:#3a3127}
.pg .hd b{color:var(--ac);font-weight:600}
.pg .hr{position:absolute;top:88px;left:56px;right:56px;height:1.5px;background:#3a3127;opacity:.55}
.pg .big{position:absolute;top:118px;left:56px;width:968px;height:590px;object-fit:cover;border-radius:4px;box-shadow:0 18px 40px rgba(40,28,12,.22);filter:saturate(.9) contrast(1.03) sepia(.08)}
.pg .inset{position:absolute;top:610px;right:44px;width:392px;height:262px;padding:11px;background:#F6F0E2;transform:rotate(2.6deg);box-shadow:0 14px 34px rgba(40,28,12,.32)}
.pg .inset img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) sepia(.08)}
.pg .mark{position:absolute;top:742px;left:56px;width:96px;height:96px;border-radius:50%;background:var(--ac);color:#F6F0E2;display:flex;align-items:center;justify-content:center;font-family:Fr;font-style:italic;font-weight:600;font-size:52px;box-shadow:0 0 0 6px #EDE4D0,0 0 0 8px var(--ac)}
.pg .ttl{position:absolute;top:868px;left:56px;width:600px;font-family:Fr;font-weight:700;font-size:var(--fs,78px);line-height:.98;letter-spacing:-.02em;color:var(--ac)}
.pg .meta{font-family:WS;font-weight:600;font-size:18px;letter-spacing:.3em;color:#3a3127;margin-top:26px;line-height:1.6}
.pg .line{font-family:Fr;font-style:italic;font-weight:400;font-size:38px;line-height:1.28;color:#2c251d;margin-top:20px;width:600px}
.pg .ft{position:absolute;bottom:46px;left:56px;right:56px;display:flex;justify-content:space-between;font-family:WS;font-weight:600;font-size:16px;letter-spacing:.4em;color:#3a3127;opacity:.75}
.pg .trail{position:absolute;inset:0;pointer-events:none}
`;
// smooth closed blob contours (topographic lines)
function topo(seed, color) {
  let s = seed; const r = () => (s = (s * 9301 + 49297) % 233280) / 233280;
  let out = '';
  const centres = [[r() * 1080, 900 + r() * 400], [r() * 1080, r() * 300]];
  for (const [cx, cy] of centres) {
    const ph = [r() * 6, r() * 6, r() * 6];
    for (let k = 1; k <= 14; k++) {
      const R = k * 42; let d = '';
      for (let a = 0; a <= 64; a++) {
        const t = a / 64 * Math.PI * 2;
        const rr = R * (1 + .16 * Math.sin(3 * t + ph[0]) + .09 * Math.sin(5 * t + ph[1] + k * .15) + .05 * Math.sin(2 * t + ph[2]));
        d += (a ? 'L' : 'M') + (cx + rr * Math.cos(t)).toFixed(1) + ',' + (cy + rr * .8 * Math.sin(t)).toFixed(1);
      }
      out += `<path d="${d}Z" fill="none" stroke="${color}" stroke-width="${k % 5 === 0 ? 2 : 1.1}" opacity="${k % 5 === 0 ? .32 : .2}"/>`;
    }
  }
  return `<svg class="topo" width="1080" height="1350" viewBox="0 0 1080 1350">${out}</svg>`;
}
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let html;
    if (s.type === 'cover') {
      html = `<body class="cv" style="--ink:${s.ink}"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="warm"></div><div class="shade"></div><div class="vig"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="l1">${s.h}</div><div class="l2">${s.h2}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
      <div class="swipe">FIVE TRAILS &nbsp;→</div><div class="grain"></div></body>`;
    } else {
      const n = String(i).padStart(2, '0');
      html = `<body class="pg" style="--ac:${s.ac};--fs:${s.fs || 78}px">${topo(i * 977 + 13, s.ac)}
      <svg class="trail" width="1080" height="1350"><path d="M104 1290 C 240 1250, 300 1180, 420 1200 S 600 1290, 760 1240 S 960 1180, 1040 1230" fill="none" stroke="${s.ac}" stroke-width="3" stroke-dasharray="2 14" stroke-linecap="round" opacity=".55"/></svg>
      <div class="hd"><span>A FIELD GUIDE TO THE WOODS</span><span>TRAIL <b>${n}</b> / 05</span></div><div class="hr"></div>
      <img class="big" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%">
      <div class="inset"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div>
      <div class="mark">${i}</div>
      <div class="ttl">${s.t}<div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()}</div><div class="line">${s.ov}</div></div>
      <div class="ft"><span>CINEMA</span><span>${i < 5 ? 'NEXT TRAIL →' : 'END OF TRAIL'}</span></div>
      <div class="grain" style="opacity:.16"></div></body>`;
    }
    html = `<html><head><style>${css}</style></head>${html}</html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
