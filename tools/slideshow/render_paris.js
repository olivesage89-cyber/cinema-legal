// "a november in paris" — cover: full-bleed narrow street + vertical PARIS; inside: PLAQUE DE RUE (enamel street sign) layout
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Paris', 'parisienne', 400), ff('Abril', 'abril-fatface', 400), ff('Outfit', 'outfit', 400), ff('Outfit', 'outfit', 500), ff('Outfit', 'outfit', 600),
  ff('Crimson', 'crimson-pro', 400, 'italic'), ff('Crimson', 'crimson-pro', 500, 'italic'), ff('Crimson', 'crimson-pro', 600, 'italic'),
  ff('Oswald', 'oswald', 500), ff('Oswald', 'oswald', 600), ff('Hand', 'homemade-apple', 400)].join('');
const grain = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;-webkit-font-smoothing:antialiased}
.grain{position:absolute;inset:0;opacity:.2;mix-blend-mode:overlay;${grain};pointer-events:none;z-index:50}`;

// seeded random for the faint street-map pattern
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
function streetMap(col) {
  let p = '';
  for (let i = 0; i < 26; i++) {
    const x1 = rnd() * 1300 - 110, y1 = rnd() * 1550 - 100, a = rnd() * Math.PI, L = 300 + rnd() * 700;
    const x2 = x1 + Math.cos(a) * L, y2 = y1 + Math.sin(a) * L, cx = (x1 + x2) / 2 + (rnd() - .5) * 200, cy = (y1 + y2) / 2 + (rnd() - .5) * 200;
    p += `<path d="M${x1|0} ${y1|0} Q${cx|0} ${cy|0} ${x2|0} ${y2|0}" stroke="${col}" stroke-width="${(1 + rnd() * 2.2).toFixed(1)}" fill="none"/>`;
  }
  // the Seine
  p += `<path d="M-60 1080 C 200 980, 330 1180, 560 1090 S 900 960, 1140 1040" stroke="${col}" stroke-width="34" fill="none" stroke-linecap="round" opacity=".55"/>`;
  return `<svg width="1080" height="1350" viewBox="0 0 1080 1350" style="position:absolute;inset:0;opacity:.09">${p}</svg>`;
}

const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
function cover(s) {
  return `<style>${base}
  .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.x ?? 50}% 50%;filter:saturate(.9) contrast(1.04) brightness(.97)}
  .tint{position:absolute;inset:0;background:linear-gradient(90deg,rgba(18,12,40,.55),rgba(18,12,40,.18) 42%,rgba(0,0,0,0) 60%);}
  .top{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,10,30,.35),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 80%,rgba(10,8,22,.55))}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 60% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
  .kick{position:absolute;left:64px;top:72px;font-family:Outfit;font-weight:500;font-size:21px;letter-spacing:.34em;color:#F3ECF4}
  .rule{position:absolute;left:66px;top:112px;width:70px;height:2px;background:${s.ink}}
  .scr{position:absolute;left:58px;top:128px;font-family:Paris;font-size:104px;color:#FBF3EA;line-height:1;transform:rotate(-4deg);transform-origin:left;text-shadow:0 3px 24px rgba(10,6,30,.55)}
  .big{position:absolute;left:46px;bottom:70px;font-family:Abril;font-size:318px;line-height:.78;color:${s.ink};writing-mode:vertical-rl;transform:rotate(180deg);letter-spacing:.01em;text-shadow:0 6px 40px rgba(20,8,30,.45)}
  .sub{position:absolute;left:320px;bottom:150px;width:250px;font-family:Crimson;font-style:italic;font-weight:500;font-size:33px;line-height:1.18;color:#F3ECF4;text-shadow:0 2px 16px rgba(0,0,0,.6)}
  .sub b{color:${s.ink};font-weight:600}
  .foot{position:absolute;left:322px;bottom:84px;font-family:Outfit;font-weight:500;font-size:17px;letter-spacing:.3em;color:#E8E0EE;opacity:.9}
  </style><img class="bg" src="file://${D}/${s.img}"><div class="tint"></div><div class="top"></div><div class="vig"></div>
  <div class="kick">${s.kick}</div><div class="rule"></div><div class="scr">${s.h}</div><div class="big">${s.h2}</div>
  <div class="sub">${s.sub}</div><div class="foot">5 FILMS · SWIPE →</div><div class="grain"></div>`;
}
function film(s, i) {
  const n = String(i).padStart(2, '0');
  const stations = [1, 2, 3, 4, 5].map(k => `<div class="st ${k === i ? 'on' : k < i ? 'past' : ''}"><i></i><span>${S[k].yr}</span></div>`).join('');
  return `<style>${base}
  body{background:${s.bg}}
  .wash{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.07),rgba(0,0,0,0) 60%),linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(0,0,0,.25))}
  .hd{position:absolute;top:44px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;font-family:Outfit;font-weight:500;font-size:17px;letter-spacing:.3em;color:#EFE6DA;opacity:.88}
  .hd .m{font-family:Paris;font-size:46px;letter-spacing:0;color:${s.acc};opacity:1;margin-top:-6px}
  .still{position:absolute;left:60px;top:112px;width:960px;height:640px;border-radius:6px;overflow:hidden;box-shadow:0 26px 60px rgba(0,0,0,.45)}
  .still img{width:100%;height:100%;object-fit:cover;object-position:${s.x ?? 50}% ${s.y ?? 50}%;filter:saturate(.92) contrast(1.03) sepia(.06)}
  .still:after{content:'';position:absolute;inset:12px;border:1.5px solid rgba(255,248,235,.55);border-radius:3px}
  .plq{position:absolute;left:44px;top:694px;width:${s.pw || 640}px;padding:16px;background:#1C3A86;border-radius:14px;transform:rotate(-1.6deg);
    box-shadow:0 18px 40px rgba(0,0,0,.45),inset 0 2px 0 rgba(255,255,255,.18),inset 0 -3px 0 rgba(0,0,0,.25)}
  .plq .in{border:5px solid #2F7A55;border-radius:9px;padding:6px}
  .plq .in2{border:2.5px solid #F4F1EA;border-radius:6px;padding:12px 22px 16px;text-align:center;color:#F7F4EE;
    background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.12),rgba(255,255,255,0) 55%)}
  .plq .a{font-family:Oswald;font-weight:500;font-size:22px;letter-spacing:.16em;opacity:.95}
  .plq .a sup{font-size:.6em}
  .plq .t{font-family:Oswald;font-weight:600;font-size:${s.fs || 66}px;line-height:1.02;letter-spacing:.04em;margin-top:2px}
  .print{position:absolute;right:52px;top:688px;width:330px;background:#FBF7EF;padding:12px 12px 52px;transform:rotate(3.2deg);box-shadow:0 18px 40px rgba(0,0,0,.4)}
  .print img{width:100%;height:220px;object-fit:cover;object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%;display:block;filter:saturate(.9)}
  .print .c{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:Hand;font-size:19px;color:#2A2A3A}
  .tape{position:absolute;top:-14px;left:50%;width:110px;height:30px;margin-left:-55px;background:rgba(240,230,205,.75);transform:rotate(-4deg)}
  .meta{position:absolute;left:64px;top:${s.my || 988}px;font-family:Outfit;font-weight:500;font-size:19px;letter-spacing:.26em;color:#EFE6DA;opacity:.9}
  .meta b{color:${s.acc};font-weight:600}
  .line{position:absolute;left:64px;right:64px;top:${(s.my || 988) + 46}px;font-family:Crimson;font-style:italic;font-weight:500;font-size:44px;line-height:1.16;color:#FBF4EA}
  .line em{color:${s.acc}}
  .metro{position:absolute;left:84px;right:84px;bottom:66px;height:60px}
  .metro .bar{position:absolute;left:10px;right:10px;top:13px;height:6px;border-radius:3px;background:${s.acc};opacity:.85}
  .metro .row{position:absolute;inset:0;display:flex;justify-content:space-between}
  .st{display:flex;flex-direction:column;align-items:center;width:20px}
  .st i{width:24px;height:24px;margin-top:4px;border-radius:50%;background:${s.bg};border:4px solid #F4EEE4;flex:none}
  .st.on i{width:34px;height:34px;margin-top:-1px;background:${s.acc};border-color:#F4EEE4;box-shadow:0 0 0 4px rgba(0,0,0,.2)}
  .st span{font-family:Outfit;font-weight:500;font-size:15px;letter-spacing:.18em;color:#EFE6DA;opacity:.7;margin-top:8px;white-space:nowrap}
  .st.on span{margin-top:3px;opacity:1;color:${s.acc}}
  .ln{position:absolute;left:64px;bottom:142px;font-family:Outfit;font-weight:600;font-size:14px;letter-spacing:.34em;color:#EFE6DA;opacity:.6}
  </style>${streetMap(s.acc)}<div class="wash"></div>
  <div class="hd"><span>Nº ${n} / 05</span><span class="m">a november in paris</span><span>PARIS · ${s.yr}</span></div>
  <div class="still"><img src="file://${D}/${s.img}"></div>
  <div class="print"><div class="tape"></div><img src="file://${D}/${s.img2}"><div class="c">${s.cap}</div></div>
  <div class="plq"><div class="in"><div class="in2"><div class="a">${s.arr}</div><div class="t">${s.t}</div></div></div></div>
  <div class="meta">DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; <b>${s.yr}</b> &nbsp;·&nbsp; ${s.kind}</div>
  <div class="line">${s.ov}</div>
  <div class="ln">LIGNE 5 · STATIONS</div>
  <div class="metro"><div class="bar"></div><div class="row">${stations}</div></div>
  <div class="grain"></div>`;
}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    if (s.type === 'end') continue;
    const html = `<html><head><meta charset="utf-8"></head><body>${s.type === 'cover' ? cover(s) : film(s, i)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
