// "a big, loud family dinner" — cover: full-bleed Encanto empty dining table under the family-tree mural,
// Caveat Brush handwritten 'a big, loud' + saffron Shrikhand 'family dinner' w/ deep red sign-painter offset.
// Inside: TONIGHT'S TABLE (per-film gingham tablecloth, white-bordered print, cream menu card w/ Young Serif title,
// ON THE TABLE / AROUND IT lines, small tilted print, handwritten note).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Shr', 'shrikhand', 400), ff('Brush', 'caveat-brush', 400), ff('YS', 'young-serif', 400),
  ff('Fig', 'figtree', 500), ff('Fig', 'figtree', 600), ff('Fig', 'figtree', 700),
  ff('Spec', 'spectral', 400, 'italic'), ff('Spec', 'spectral', 500, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#140904}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.08) contrast(1.04) brightness(1.02) sepia(.06)}
.cv .bot{position:absolute;left:0;right:0;bottom:0;height:62%;background:linear-gradient(0deg,rgba(20,9,4,.94) 0%,rgba(20,9,4,.84) 40%,rgba(20,9,4,.45) 75%,rgba(20,9,4,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,rgba(0,0,0,0) 50%,rgba(0,0,0,.42) 100%)}
.cv .glow{position:absolute;left:50%;top:310px;width:700px;height:500px;transform:translateX(-50%);background:radial-gradient(ellipse,rgba(255,190,110,.18),rgba(255,190,110,0) 65%);mix-blend-mode:screen}
.cv .ttl{position:absolute;left:0;right:0;top:var(--ty,740px);text-align:center}
.cv .kick{font-family:Fig;font-weight:600;font-size:21px;letter-spacing:.5em;padding-left:.5em;color:#F7E9D3;opacity:.95;text-shadow:0 0 14px rgba(0,0,0,.9),0 2px 6px rgba(0,0,0,.8)}
.cv .big{font-family:Brush;font-size:96px;line-height:1;color:#F7E9D3;transform:rotate(-4deg);margin:22px 0 -6px -250px;text-shadow:0 3px 20px rgba(0,0,0,.6)}
.cv .h{font-family:Shr;font-size:178px;line-height:.92;color:var(--acc);letter-spacing:-.005em;text-shadow:5px 6px 0 #8C1D10,0 10px 40px rgba(0,0,0,.55)}
.cv .h2{margin-top:-6px}
.cv .sub{position:absolute;left:0;right:0;bottom:72px;text-align:center;color:#F7E9D3;font-family:Spec;font-style:italic;font-weight:500;font-size:38px;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.cv .sub i{color:var(--acc);font-style:normal;font-family:Fig;font-weight:700;font-size:18px;letter-spacing:.45em;padding:0 14px;position:relative;top:-6px}
/* inside: tonight's table */
.tb{background:#F2E8D6}
.tb .cloth{position:absolute;inset:0;background-color:#F4EBDA;
  background-image:linear-gradient(90deg,var(--g) 50%,transparent 50%),linear-gradient(0deg,var(--g) 50%,transparent 50%);
  background-size:96px 96px}
.tb .shade{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,240,215,.18),rgba(30,15,5,.0) 45%,rgba(30,15,5,.38) 100%)}
.tb .weave{position:absolute;inset:0;opacity:.18;background:repeating-linear-gradient(90deg,rgba(0,0,0,.25) 0 1px,transparent 1px 4px),repeating-linear-gradient(0deg,rgba(0,0,0,.2) 0 1px,transparent 1px 4px)}
.tb .print{position:absolute;left:62px;top:72px;width:956px;height:620px;background:#FBF8F1;padding:16px 16px 16px;box-shadow:0 18px 40px rgba(30,15,5,.38),0 3px 8px rgba(30,15,5,.25);transform:rotate(-1.3deg)}
.tb .print div{width:100%;height:100%;background-size:cover;filter:saturate(1.02) contrast(1.02) sepia(.06)}
.tb .card{position:absolute;left:58px;top:734px;width:640px;height:540px;background:#FBF5E8;box-shadow:0 18px 40px rgba(30,15,5,.36),0 3px 8px rgba(30,15,5,.22);transform:rotate(.6deg);padding:30px 40px;color:#2B1D14;display:flex;flex-direction:column;justify-content:center}
.tb .card:before{content:'';position:absolute;inset:14px;border:2px solid var(--acc)}
.tb .card:after{content:'';position:absolute;inset:20px;border:1px solid var(--acc);opacity:.55}
.tb .hd{display:flex;justify-content:space-between;font-family:Fig;font-weight:700;font-size:15px;letter-spacing:.34em;color:var(--acc);margin-top:0}
.tb .t{font-family:YS;font-size:var(--tfs,62px);line-height:1.02;margin-top:22px;color:#2B1D14}
.tb .dir{font-family:Fig;font-weight:600;font-size:15px;letter-spacing:.28em;margin-top:16px;color:#5a4636}
.tb .dir b{color:var(--acc);font-weight:700}
.tb .orn{display:flex;align-items:center;gap:14px;margin:26px 0 18px;color:var(--acc);font-size:16px}
.tb .orn span{flex:1;height:1px;background:var(--acc);opacity:.6}
.tb .lab{font-family:Fig;font-weight:700;font-size:13px;letter-spacing:.34em;color:var(--acc);margin-top:12px}
.tb .val{font-family:Spec;font-style:italic;font-size:32px;line-height:1.18;margin-top:6px;color:#2B1D14}
.tb .small{position:absolute;left:730px;top:770px;width:300px;height:360px;background:#FBF8F1;padding:12px 12px 52px;box-shadow:0 14px 30px rgba(30,15,5,.36),0 2px 6px rgba(30,15,5,.22);transform:rotate(3.2deg)}
.tb .small div{width:100%;height:100%;background-size:cover;filter:saturate(1.0) sepia(.06)}
.tb .small p{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-family:Brush;font-size:30px;color:#3a2a20}
.tb .note{position:absolute;left:722px;top:1170px;width:320px;text-align:center;font-family:Brush;font-size:40px;line-height:1.05;color:#2B1D14;transform:rotate(-3deg);text-shadow:0 0 10px rgba(255,248,236,.95),0 0 22px rgba(255,248,236,.85),0 0 4px rgba(255,248,236,1)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    if (s.type === 'end') continue;
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="glow"></div><div class="bot"></div><div class="vig"></div>
      <div class="ttl" style="--ty:${s.ty}px"><div class="kick">${s.kick}</div><div class="big">${s.h0}</div><div class="h">${s.h}</div><div class="h h2">${s.h2}</div></div>
      <div class="sub">${s.sub}</div>`;
    } else {
      cls = 'tb';
      body = `<div class="cloth"></div><div class="weave"></div><div class="shade"></div>
      <div class="print"><div style="background-image:url(file://${D}/${s.img});background-position:${s.x ?? 50}% ${s.y ?? 50}%"></div></div>
      <div class="card" style="--tfs:${s.tfs || 62}px"><div class="hd"><span>TONIGHT'S TABLE</span><span>SEAT ${s.n} / 05</span></div>
        <div class="t">${s.t}</div><div class="dir">${s.dir.toUpperCase()} · <b>${s.yr}</b></div>
        <div class="orn"><span></span>✦<span></span></div>
        <div class="lab">ON THE TABLE</div><div class="val">${s.dish}</div>
        <div class="lab" style="margin-top:16px">AROUND IT</div><div class="val">${s.who}</div></div>
      <div class="small"><div style="background-image:url(file://${D}/${s.inset});background-position:${s.ix ?? 50}% ${s.iy ?? 50}%"></div><p>${s.cap}</p></div>
      <div class="note">${s.note}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--g:${s.g || 'transparent'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
