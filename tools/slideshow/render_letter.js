// "a love letter" — cover: Portrait of a Lady on Fire beach (extended mint sky), deep emerald Corinthia 'love' + Libre Caslon caps LETTER.
// Inside: LOVE LETTER (deep per-film envelope page, white-bordered tilted photo, tucked second photo, cream letter sheet w/
// 'dear ___,' in handwriting, Libre Caslon title in per-film ink, Old Standard meta, handwritten line, wax seal w/ initial).
// Usage: node render_letter.js WORKDIR  (WORKDIR/slides.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Co', 'corinthia', 400), ff('Co', 'corinthia', 700),
  ff('LC', 'libre-caslon-display', 400),
  ff('OS', 'old-standard-tt', 400), ff('OS', 'old-standard-tt', 400, 'italic'), ff('OS', 'old-standard-tt', 700),
  ff('HW', 'la-belle-aurore', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.cv{background:linear-gradient(180deg,#A9D3C0 0%,#B6DAC5 60%,#C2DEC6 100%)}
.cv .bg{position:absolute;left:0;right:0;bottom:0;width:100%;height:var(--ih);object-fit:cover;filter:saturate(.95) contrast(1.03);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 150px)}
.cv .lift{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 22%,rgba(240,250,238,.45),rgba(0,0,0,0) 55%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(20,30,25,.30) 100%)}
.cv .low{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 78%,rgba(60,40,15,.25) 100%)}
.cv .t{position:absolute;top:96px;left:0;right:0;text-align:center;color:var(--ink)}
.cv .kick{font-family:OS;font-weight:700;font-size:22px;letter-spacing:.52em;padding-left:.52em}
.cv .l1{font-family:Co;font-weight:700;font-size:330px;line-height:.62;margin-top:58px;letter-spacing:-.01em}
.cv .l2{font-family:LC;font-size:104px;line-height:1;letter-spacing:.3em;padding-left:.3em;margin-top:-6px}
.cv .orn{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:22px}
.cv .orn i{display:block;width:70px;height:1.4px;background:var(--ink);opacity:.7}
.cv .orn b{display:block;width:13px;height:13px;border-radius:50%;background:#A3262A;box-shadow:0 0 0 3px rgba(163,38,42,.25)}
.cv .sub{font-family:OS;font-style:italic;font-size:38px;margin-top:20px;letter-spacing:.01em}
.cv .swipe{position:absolute;bottom:54px;left:0;right:0;text-align:center;color:#2b2416;font-family:OS;font-weight:700;font-size:18px;letter-spacing:.46em;opacity:.78}
/* inside: love letter */
.pg{background:var(--bg)}
.pg .linen{position:absolute;inset:0;opacity:.5;background:radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.10),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.55) 100%)}
.pg .hd{position:absolute;top:46px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:baseline;color:#F1E7D3;font-family:OS;font-weight:700;font-size:16px;letter-spacing:.42em;opacity:.85}
.pg .photo{position:absolute;top:104px;left:84px;width:900px;height:592px;padding:16px 16px 16px;background:#F6F0E4;transform:rotate(-1.6deg);box-shadow:0 26px 50px rgba(0,0,0,.45)}
.pg .photo img{width:100%;height:100%;object-fit:cover;display:block;filter:var(--flt,saturate(.92) contrast(1.04) sepia(.06))}
.pg .tuck{position:absolute;top:735px;left:34px;width:360px;height:258px;padding:10px;background:#F6F0E4;transform:rotate(-7deg);box-shadow:0 16px 34px rgba(0,0,0,.45)}
.pg .tuck img{width:100%;height:100%;object-fit:cover;display:block;filter:var(--flt,saturate(.9) sepia(.08))}
.pg .letter{position:absolute;top:706px;left:292px;width:732px;height:590px;background:#F4ECDC;transform:rotate(1.4deg);box-shadow:0 22px 48px rgba(0,0,0,.42);padding:44px 52px 0 62px;
  background-image:linear-gradient(180deg,rgba(120,90,50,.05),rgba(120,90,50,0) 30%,rgba(120,90,50,.06)),radial-gradient(ellipse at 80% 90%,rgba(150,110,60,.10),rgba(0,0,0,0) 50%)}
.pg .sig{position:absolute;left:62px;bottom:30px;font-family:HW;font-size:38px;color:#4a3524}
.pg .no{font-family:OS;font-weight:700;font-size:15px;letter-spacing:.38em;color:#6b5a43;display:flex;justify-content:space-between}
.pg .dear{font-family:HW;font-size:48px;color:#4a3524;margin-top:22px;line-height:1}
.pg .ttl{font-family:LC;font-size:var(--fs,74px);line-height:1;color:var(--ac);margin-top:20px;letter-spacing:-.005em}
.pg .meta{font-family:OS;font-style:italic;font-size:25px;color:#5a4a36;margin-top:16px}
.pg .meta b{font-style:normal;font-weight:700;font-size:16px;letter-spacing:.32em;color:var(--ac);margin-right:12px}
.pg .line{font-family:HW;font-size:40px;line-height:1.3;color:#3e2c1d;margin-top:26px;width:600px}
.pg .seal{position:absolute;top:1150px;left:872px;width:132px;height:132px;transform:rotate(-12deg)}
.pg .ft{position:absolute;bottom:40px;left:72px;color:#F1E7D3;font-family:OS;font-weight:700;font-size:15px;letter-spacing:.42em;opacity:.7}
`;
const seal = (c, ch) => `<svg class="seal" viewBox="0 0 132 132"><defs><radialGradient id="g" cx="40%" cy="35%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient></defs>
<path d="M66 4c10 2 14 8 24 8s14 10 20 18 14 14 14 24-4 14-2 22-8 16-14 22-10 14-20 16-14 6-22 6-14-4-22-6-16-8-22-14S8 96 8 86s-6-12-2-22S10 44 18 36s10-16 20-20S56 2 66 4z" fill="${c}"/>
<circle cx="66" cy="66" r="44" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="3"/><circle cx="66" cy="66" r="38" fill="none" stroke="rgba(255,255,255,.18)" stroke-width="1.5"/>
<path d="M4 66c0-34 28-62 62-62s62 28 62 62-28 62-62 62S4 100 4 66z" fill="url(#g)" opacity=".9"/>
<text x="66" y="92" text-anchor="middle" font-family="Co" font-weight="700" font-size="82" fill="rgba(0,0,0,.35)">${ch}</text>
<text x="65" y="90" text-anchor="middle" font-family="Co" font-weight="700" font-size="82" fill="rgba(255,225,215,.55)">${ch}</text></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const ROM = ['', 'I', 'II', 'III', 'IV', 'V'];
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let html;
    if (s.type === 'cover') {
      html = `<body class="cv" style="--ink:${s.ink};--ih:${s.ih || 1150}px"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="lift"></div><div class="low"></div><div class="vig"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="l1">${s.h}</div><div class="l2">${s.h2}</div><div class="orn"><i></i><b></b><i></i></div><div class="sub">${s.sub}</div></div>
      <div class="grain"></div></body>`;
    } else {
      html = `<body class="pg" style="--bg:${s.bg};--ac:${s.ac};--fs:${s.fs || 74}px;${s.flt ? '--flt:' + s.flt : ''}"><div class="linen"></div>
      <div class="hd"><span>LOVE LETTERS</span><span>${ROM[i]} &nbsp;/&nbsp; V</span></div>
      <div class="tuck"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div>
      <div class="photo"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      <div class="letter"><div class="no"><span>No. 0${i}</span><span>${s.yr}</span></div>
        <div class="dear">${s.dear}</div><div class="ttl">${s.t}</div>
        <div class="meta"><b>DIR.</b>${s.dir}</div><div class="line">${s.ov}</div><div class="sig">${s.sig || 'yours, always'}</div></div>
      ${seal(s.seal || '#9E2329', s.init)}
      <div class="grain" style="opacity:.16"></div></body>`;
    }
    html = `<html><head><style>${css}</style></head>${html}</html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
