// "Old friends" slideshow — cover: golden full-bleed + cobalt Fraunces/handwritten type.
// Inside: YEARBOOK PAGE (glossy cream page, school-colour header band, big photo + tucked square snapshot,
// Fraunces title, ballpoint-blue handwritten yearbook signature).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Fr', 'fraunces', 300), ff('Fr', 'fraunces', 300, 'italic'), ff('Fr', 'fraunces', 400, 'italic'), ff('Fr', 'fraunces', 600), ff('Fr', 'fraunces', 800), ff('Fr', 'fraunces', 900),
  ff('Pen', 'nothing-you-could-do', 400), ff('Grad', 'graduate', 400), ff('Arc', 'archivo', 500), ff('Arc', 'archivo', 600), ff('Arc', 'archivo', 700)].join('');
const grainSvg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;mix-blend-mode:overlay;background-image:${grainSvg};pointer-events:none}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const ink = '#14307E';
function cover(s) {
  return `<style>${base}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(.97) brightness(1.0) sepia(.08)}
  .warm{position:absolute;inset:0;background:radial-gradient(ellipse at 18% 18%,rgba(255,244,214,.38),rgba(255,244,214,0) 55%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(60,20,0,.22) 100%)}
  .t{position:absolute;left:78px;top:92px;color:${ink}}
  .kick{font-family:Arc;font-weight:600;font-size:25px;letter-spacing:.46em}
  .old{font-family:Fr;font-style:italic;font-weight:300;font-size:200px;line-height:.86;margin-top:22px;letter-spacing:-.01em}
  .fr{font-family:Fr;font-weight:900;font-size:176px;line-height:.86;letter-spacing:-.025em;margin-top:-4px}
  .note{position:absolute;left:600px;top:118px;width:460px;font-family:Pen;font-size:44px;line-height:1.22;color:#8C1D1A;transform:rotate(-6deg);transform-origin:left top}
  .rule{width:120px;height:3px;background:${ink};margin-top:30px;opacity:.85}
  .foot{font-family:Arc;font-weight:700;font-size:20px;letter-spacing:.38em;margin-top:22px}
  .grain{opacity:.26}</style>
  <img class="bg" src="file://${D}/${s.img}"><div class="warm"></div><div class="vig"></div>
  <div class="t"><div class="kick">${s.kick}</div><div class="old">${s.h}</div><div class="fr">${s.h2}</div><div class="rule"></div><div class="foot">${s.foot}</div></div>
  <div class="note">${s.sub}</div><div class="grain"></div>`;
}
function movie(s, i, n) {
  const a = s.accent;
  const dots = Array.from({ length: n }, (_, k) => `<i style="background:${k === i ? a : 'transparent'};border-color:${k === i ? a : '#B9B1A2'}"></i>`).join('');
  return `<style>${base}
  body{background:#F1ECE1}
  .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%),linear-gradient(180deg,#F4EFE5,#ECE5D7)}
  .band{position:absolute;left:0;right:0;top:0;height:132px;background:${a}}
  .band .l{position:absolute;left:70px;top:46px;font-family:Grad;font-size:34px;letter-spacing:.14em;color:#F7F1E4}
  .band .r{position:absolute;right:70px;top:52px;font-family:Arc;font-weight:600;font-size:21px;letter-spacing:.34em;color:#F7F1E4;opacity:.92}
  .band .stripe{position:absolute;left:0;right:0;bottom:-14px;height:6px;background:${a};opacity:.55}
  .ph{position:absolute;left:70px;top:186px;width:940px;height:560px;overflow:hidden;box-shadow:0 10px 26px rgba(40,30,15,.20),0 1px 3px rgba(0,0,0,.2)}
  .ph img{width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(.96) sepia(.10)}
  .snap{position:absolute;left:${s.snapL ?? 660}px;top:676px;width:330px;height:330px;background:#FBF8F1;padding:14px 14px 0;transform:rotate(3.2deg);box-shadow:0 12px 26px rgba(40,30,15,.28),0 1px 2px rgba(0,0,0,.2)}
  .snap img{width:100%;height:262px;object-fit:cover;object-position:${s.sx ?? 50}% ${s.sy ?? 50}%;filter:saturate(.85) contrast(.96) sepia(.12)}
  .snap .cap{font-family:Arc;font-weight:700;font-size:15px;letter-spacing:.26em;color:#3A342B;text-align:center;margin-top:16px}
  .tape{position:absolute;left:50%;top:-18px;width:120px;height:36px;margin-left:-60px;background:rgba(236,224,196,.78);transform:rotate(-4deg);box-shadow:0 1px 2px rgba(0,0,0,.08)}
  .col{position:absolute;left:70px;top:784px;width:${s.colW || 560}px;color:#1E1B17}
  .names{font-family:Arc;font-weight:700;font-size:18px;letter-spacing:.32em;color:${a}}
  .title{font-family:Fr;font-weight:800;font-size:${s.fs || 84}px;line-height:.98;letter-spacing:-.02em;margin-top:14px}
  .meta{font-family:Arc;font-weight:600;font-size:19px;letter-spacing:.28em;margin-top:18px;color:#4A443A}
  .meta b{color:${a};font-weight:700}
  .line{font-family:Fr;font-style:italic;font-weight:400;font-size:33px;line-height:1.25;margin-top:16px;color:#2C2822}
  .sig{position:absolute;left:${s.sigL ?? 300}px;top:${s.sigT ?? 1158}px;font-family:Pen;font-size:46px;line-height:1.1;color:#2447A6;transform:rotate(-5deg);transform-origin:left center;white-space:nowrap;opacity:.93}
  .foot{position:absolute;left:70px;right:70px;bottom:52px;display:flex;justify-content:space-between;align-items:center;font-family:Grad;font-size:20px;letter-spacing:.16em;color:#6A6254}
  .dots{display:flex;gap:10px}.dots i{width:12px;height:12px;border-radius:50%;border:2px solid}
  .grain{opacity:.16}</style>
  <div class="paper"></div>
  <div class="band"><div class="l">OLD FRIENDS</div><div class="r">CLASS OF ${s.yr}</div><div class="stripe"></div></div>
  <div class="ph"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
  <div class="col"><div class="names">${s.names}</div><div class="title">${s.t}</div><div class="meta">DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; <b>${s.yr}</b></div><div class="line">${s.ov}</div></div>
  <div class="snap"><div class="tape"></div><img src="file://${D}/${s.img2}"><div class="cap">${s.cap}</div></div>
  <div class="sig">${s.sig}</div>
  <div class="foot"><span>Nº 0${i + 1} / 0${n}</span><div class="dots">${dots}</div></div>
  <div class="grain"></div>`;
}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const mv = S.filter(s => s.type !== 'cover');
  for (const s of S) {
    const html = `<html><head><meta charset="utf-8"></head><body>${s.type === 'cover' ? cover(s) : movie(s, mv.indexOf(s), mv.length)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
