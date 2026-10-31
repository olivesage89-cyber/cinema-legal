// SUMMER SNAPSHOT ALBUM slides (1080x1350). Usage: node render_prints.js DIR  (DIR/slides_prints.json)
// sun-faded cream paper + grain, big tilted white-bordered photo print w/ orange LCD date stamp, small second print
// taped on top, Caprasimo title in per-film ink, Plex Mono 'EXP 0X / 05' + meta, Nothing You Could Do handwritten line.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_prints.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, s = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${s};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${s}.woff2)}`;
const css = ff('Cap', 'caprasimo', 400) + ff('Hand', 'nothing-you-could-do', 400) + ff('Mono', 'ibm-plex-mono', 500) + ff('LCD', 'vt323', 400) + ff('Cor', 'cormorant-garamond', 500, 'italic') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;position:relative;overflow:hidden;background:#F2E4CC}
.paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,#FAF0DE 0%,#F2E4CC 55%,#E6D2B2 100%)}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .35  0 0 0 0 .25  0 0 0 0 .15  0 0 0 .9 0'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}
.sunleak{position:absolute;right:-260px;top:-260px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(255,170,80,.35),rgba(255,170,80,0) 65%)}
.top{position:absolute;top:66px;left:84px;right:84px;display:flex;justify-content:space-between;font:500 22px Mono;letter-spacing:.34em;color:#6B5640}
.print{position:absolute;background:#FBF8F1;padding:20px;box-shadow:0 18px 40px rgba(70,40,10,.28),0 3px 8px rgba(70,40,10,.18)}
.print .im{width:100%;height:100%;background-size:cover;background-position:center;filter:saturate(1.06) contrast(1.02)}
.big{left:70px;top:132px;width:940px;height:568px;transform:rotate(-2.2deg)}
.small{right:62px;top:600px;width:390px;height:250px;padding:13px;transform:rotate(4.5deg)}
.stamp{position:absolute;left:40px;bottom:24px;font:400 46px LCD;color:#FF8A2B;letter-spacing:.06em;text-shadow:0 0 8px rgba(255,120,30,.9),0 0 18px rgba(255,90,20,.55)}
.tape{position:absolute;width:150px;height:44px;background:rgba(236,222,190,.85);box-shadow:0 1px 3px rgba(0,0,0,.08);left:120px;top:-22px;transform:rotate(-6deg)}
.txt{position:absolute;left:92px;top:770px;width:560px}
.exp{font:500 22px Mono;letter-spacing:.34em}
.t{font:400 92px/0.98 Cap;margin-top:18px}
.meta{font:500 21px Mono;letter-spacing:.2em;color:#6B5640;margin-top:26px;line-height:1.7}
.line{position:absolute;left:92px;right:110px;top:1112px;text-wrap:balance;font:400 54px/1.3 Hand;color:#3B2A1C;transform:rotate(-1.5deg)}
.rule{width:90px;height:4px;border-radius:2px;margin-top:24px}
`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body><div class="paper"></div><div class="sunleak"></div>
<div class="top"><span>THE LAST WEEK OF SUMMER</span><span>EXP 0${i + 1} / 0${S.films.length}</span></div>
<div class="print big"><div class="im" style="background-image:url(file://${D}/${f.main});background-position:${f.mx || 50}% 50%"></div><div class="stamp">${f.stamp}</div></div>
<div class="print small"><div class="tape"></div><div class="im" style="background-image:url(file://${D}/${f.inset});background-position:${f.ix || 50}% 50%"></div></div>
<div class="txt"><div class="exp" style="color:${f.ink}">Nº 0${i + 1}</div><div class="t" style="color:${f.ink};font-size:${f.fs || 92}px">${f.t}</div>
<div class="rule" style="background:${f.ink}"></div><div class="meta">${f.yr} · DIR. ${f.dir.toUpperCase()}<br>WATCH ON ${f.where.toUpperCase()}</div></div>
<div class="line">${f.line}</div><div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
