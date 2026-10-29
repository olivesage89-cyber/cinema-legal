// IG slides for "anime for wanderlust": BOARDING PASS layout (navy page, big rounded still, cream ticket + stub)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('Glk', 'gloock', 400) + ff('Mar', 'marcellus', 400) + ff('Cor', 'cormorant-garamond', 500, 'italic') + ff('Scr', 'mrs-saint-delafield', 400) + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;background:#0E1724;position:relative;overflow:hidden;font-family:Mar;color:#1B2433}
.grain{position:absolute;inset:0;opacity:.10;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>");mix-blend-mode:overlay;pointer-events:none;z-index:9}
.top{position:absolute;top:44px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:baseline;color:#F3E6CF;font-size:21px;letter-spacing:.42em}
.top .scr{font-family:Scr;font-size:62px;letter-spacing:0;color:var(--a2);line-height:.6}
.still{position:absolute;top:104px;left:60px;width:960px;height:640px;border-radius:30px;background-size:cover;box-shadow:0 30px 60px rgba(0,0,0,.45);filter:saturate(1.05) contrast(1.02)}
.ticket{position:absolute;top:782px;left:60px;width:960px;height:500px;display:flex;filter:drop-shadow(0 24px 40px rgba(0,0,0,.4))}
.main{flex:1;background:#FBF3E4;border-radius:26px 0 0 26px;padding:40px 44px 0 48px;position:relative;
 -webkit-mask:radial-gradient(circle at 100% 0,transparent 22px,#000 23px) top right/51% 51% no-repeat,radial-gradient(circle at 100% 100%,transparent 22px,#000 23px) bottom right/51% 51% no-repeat,linear-gradient(#000,#000) left/50% 100% no-repeat}
.stub{width:250px;background:#FBF3E4;border-radius:0 26px 26px 0;border-left:4px dashed rgba(27,36,51,.28);padding:36px 30px;position:relative;text-align:center;
 -webkit-mask:radial-gradient(circle at 0 0,transparent 22px,#000 23px) top left/51% 51% no-repeat,radial-gradient(circle at 0 100%,transparent 22px,#000 23px) bottom left/51% 51% no-repeat,linear-gradient(#000,#000) right/50% 100% no-repeat}
.lab{font-size:17px;letter-spacing:.34em;color:var(--a)}
.title{font-family:Glk;font-size:var(--fs);line-height:1.02;margin-top:14px;color:#17202E;letter-spacing:-.005em}
.fields{display:flex;gap:30px;margin-top:26px;border-top:2px solid rgba(27,36,51,.12);padding-top:22px}
.fields .v{font-size:22px;letter-spacing:.06em;white-space:nowrap;margin-top:8px;color:#17202E}
.line{font-family:Cor;font-style:italic;font-size:35px;line-height:1.18;color:#3B4556;margin-top:24px}
.thumb{width:188px;height:150px;border-radius:14px;background-size:cover;margin:0 auto}
.code{height:82px;margin:22px auto 0;width:186px;background:repeating-linear-gradient(90deg,#17202E 0 3px,transparent 3px 6px,#17202E 6px 7px,transparent 7px 11px,#17202E 11px 15px,transparent 15px 17px)}
.num{font-family:Glk;font-size:64px;color:var(--a);margin-top:14px;line-height:1}
.of{font-size:16px;letter-spacing:.34em;margin-top:6px;color:#6B7280}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, m] of S.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body style="--a:${m.a};--a2:${m.a2 || '#FFC46B'};--fs:${m.fs || 74}px">
<div class="top"><span>ANIME FOR</span><span class="scr">wanderlust</span><span>CINEMA</span></div>
<div class="still" style="background-image:url(file://${D}/${m.img});background-position:${m.x || 50}% ${m.y || 50}%"></div>
<div class="ticket"><div class="main"><div class="lab">BOARDING PASS &nbsp;·&nbsp; ${m.lab}</div>
<div class="title">${m.t}</div>
<div class="fields"><div><div class="lab">DEPARTS</div><div class="v">${m.yr}</div></div><div><div class="lab">DIRECTED BY</div><div class="v">${m.dir}</div></div><div><div class="lab">STREAM ON</div><div class="v">${m.where}</div></div></div>
<div class="line">${m.line}</div></div>
<div class="stub"><div class="thumb" style="background-image:url(file://${D}/${m.thumb});background-position:center"></div><div class="code"></div><div class="num">0${i + 1}</div><div class="of">OF 05</div></div></div>
<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${m.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
