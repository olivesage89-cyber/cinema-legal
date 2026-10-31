// CASE FILE inside slides (1080x1350): casino-felt page w/ gold rules, kraft case folder w/ tab, paper-clipped
// white-bordered still, typed index card (Yeseva title + Courier fields), clipped polaroid, red rubber stamp.
// Usage: node render_heist.js DIR  (DIR/slides_heist.json) -> DIR/out/0X.jpg
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_heist.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('GV', 'great-vibes', 400) + ff('Yes', 'yeseva-one', 400) + ff('CP', 'courier-prime', 400) + ff('CP', 'courier-prime', 700) + ff('PF', 'playfair-display', 500, 'italic') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:CP;color:#1F2A24;
 background:radial-gradient(ellipse at 50% 40%,#16523C 0%,#0E3B2C 55%,#06190F 100%)}
.noise{position:absolute;inset:0;opacity:.35;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}
.rule{position:absolute;left:28px;right:28px;border-top:3px solid #C9A55A}.rule.b{border-top:1px solid #C9A55A}
.hdr{position:absolute;top:40px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:baseline;color:#E9C46A}
.hdr .s{font-family:GV;font-size:56px}.hdr .n{font-weight:700;font-size:24px;letter-spacing:.34em}
.folder{position:absolute;left:44px;top:150px;width:992px;height:1160px;background:#D6B47A;border-radius:6px 14px 14px 14px;box-shadow:0 22px 50px rgba(0,0,0,.5);
 background-image:linear-gradient(180deg,rgba(255,255,255,.12),rgba(0,0,0,.06))}
.tab{position:absolute;left:44px;top:108px;width:380px;height:56px;background:#D6B47A;border-radius:12px 12px 0 0;font-weight:700;font-size:22px;letter-spacing:.3em;padding:16px 26px;color:#5B4220}
.still{position:absolute;left:84px;top:190px;width:912px;height:530px;border:12px solid #FBF8F0;background-size:cover;background-position:center;transform:rotate(-1.2deg);box-shadow:0 12px 26px rgba(60,40,10,.35)}
.clip{position:absolute;left:150px;top:160px;transform:rotate(-8deg)}
.card{position:absolute;left:84px;top:760px;width:610px;height:500px;background:#F8F3E6;box-shadow:0 10px 24px rgba(60,40,10,.3);padding:34px 38px;transform:rotate(.6deg);
 background-image:repeating-linear-gradient(180deg,transparent 0 33px,rgba(91,127,168,.18) 33px 34px);background-position:0 108px}
.card:before{content:'';position:absolute;left:0;right:0;top:96px;border-top:2px solid rgba(181,70,46,.55)}
.card .t{font-family:Yes;line-height:1.02;color:#163A2B;height:62px;display:flex;align-items:flex-end;white-space:nowrap}
.card .f{margin-top:30px;font-size:24px;line-height:40px;letter-spacing:.02em}
.card .f b{display:inline-block;width:160px;font-weight:700;letter-spacing:.14em;font-size:19px;color:#8A3A22}
.card .l{font-family:PF;font-style:italic;font-size:35px;line-height:1.22;margin-top:24px;color:#1F2A24}
.pol{position:absolute;left:720px;top:790px;width:290px;background:#FBF8F0;padding:12px 12px 56px;transform:rotate(5deg);box-shadow:0 12px 26px rgba(60,40,10,.35)}
.pol div{width:266px;height:200px;background-size:cover;background-position:center}
.pol span{position:absolute;bottom:8px;left:0;right:0;text-align:center;font-family:GV;font-size:36px;color:#163A2B}
.stamp{position:absolute;left:728px;top:1140px;transform:rotate(-9deg);border:5px solid #B3322A;color:#B3322A;font-weight:700;font-size:27px;letter-spacing:.1em;padding:10px 18px 8px;border-radius:6px;white-space:nowrap;opacity:.86;mix-blend-mode:multiply;text-align:center}
.stamp small{display:block;font-size:15px;letter-spacing:.3em;margin-top:2px}
`;
const clip = `<svg class="clip" width="54" height="120" viewBox="0 0 54 120"><path d="M14 30 V96 a13 13 0 0 0 26 0 V18 a9 9 0 0 0 -18 0 V88" fill="none" stroke="#9AA3A8" stroke-width="6" stroke-linecap="round"/></svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const n = String(i + 1).padStart(2, '0');
    const html = `<html><head><style>${css}</style></head><body><div class="noise"></div>
<div class="rule" style="top:22px"></div><div class="rule b" style="top:32px"></div><div class="rule b" style="bottom:32px"></div><div class="rule" style="bottom:22px"></div>
<div class="hdr"><span class="s">the perfect heist</span><span class="n">CASE ${n} / 05</span></div>
<div class="tab">CASE FILE Nº ${n}</div><div class="folder"></div>
<div class="still" style="background-image:url(file://${D}/${f.main});background-position:${f.mx || 50}% ${f.my || 50}%"></div>${clip}
<div class="card"><div class="t" style="font-size:${f.fs || 56}px">${f.t}</div>
<div class="f"><div><b>YEAR</b>${f.yr}</div><div><b>DIRECTOR</b>${f.dir}</div><div><b>THE CREW</b>${f.crew}</div><div><b>THE TAKE</b>${f.take}</div><div><b>WATCH ON</b>${f.where}</div></div>
<div class="l">${f.line}</div></div>
<div class="pol"><div style="background-image:url(file://${D}/${f.inset});background-position:${f.ix || 50}% 50%"></div><span>${f.cap}</span></div>
<div class="stamp">PULLED IT OFF<small>· ${f.yr} ·</small></div>
</body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${n}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
