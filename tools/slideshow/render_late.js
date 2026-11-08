// "It's never too late" — cover: full-bleed dusk salt flats; inside: SECOND ACT film strip on warm ivory paper.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const only = process.argv[3];
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Bod','bodoni-moda',500),ff('Bod','bodoni-moda',500,'italic'),ff('Bod','bodoni-moda',700),ff('Bod','bodoni-moda',400,'italic'),
 ff('Six','six-caps',400),ff('Plex','ibm-plex-sans-condensed',500),ff('Plex','ibm-plex-sans-condensed',600),
 ff('News','newsreader',400,'italic'),ff('News','newsreader',500,'italic'),ff('News','newsreader',400),ff('Aur','la-belle-aurore',400)].join('');
const grain = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.20;mix-blend-mode:overlay;pointer-events:none;${grain}}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const cover = () => `<style>${base}
body{background:#2a2230}
.bg{position:absolute;inset:0;width:1080px;height:1350px;filter:saturate(.95) contrast(.98)}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(38,24,48,.35) 0%,rgba(38,24,48,.12) 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,0) 80%,rgba(40,26,46,.22) 100%)}
.warm{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 46%,rgba(255,170,120,.16),rgba(0,0,0,0) 45%);mix-blend-mode:screen}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(20,10,25,.35) 100%)}
.t{position:absolute;left:0;right:0;top:118px;text-align:center;color:#FFF4E8}
.kick{font-family:Plex;font-weight:600;font-size:25px;letter-spacing:.5em;padding-left:.5em;opacity:.95}
.rule{width:64px;height:2px;background:#FFC2CF;margin:26px auto 0}
.never{font-family:Bod;font-style:italic;font-weight:500;font-size:118px;color:#FFC2CF;line-height:1;margin-top:22px;text-shadow:0 2px 30px rgba(60,20,50,.45)}
.late{font-family:Six;font-size:330px;line-height:.86;letter-spacing:.06em;padding-left:.06em;margin-top:-8px;text-shadow:0 4px 40px rgba(50,20,50,.40)}
.sub{font-family:News;font-style:italic;font-weight:400;font-size:37px;line-height:1.3;margin-top:22px;opacity:.97;text-shadow:0 1px 16px rgba(40,15,40,.5)}
.sub b{font-weight:500;color:#FFC2CF}
.swipe{position:absolute;bottom:62px;left:0;right:0;text-align:center;font-family:Plex;font-weight:600;font-size:21px;letter-spacing:.42em;color:#FFF4E8;opacity:.9;text-shadow:0 1px 12px rgba(40,20,45,.6)}
</style><img class="bg" src="file://${D}/cover_ext.jpg"><div class="warm"></div><div class="shade"></div><div class="vig"></div>
<div class="t"><div class="kick">MOVIES THAT REMIND YOU</div><div class="rule"></div><div class="never">it's never</div><div class="late">TOO LATE</div>
<div class="sub">second acts, late dreams &amp; the life<br>you <b>almost</b> didn't live</div></div>
<div class="swipe">05 FILMS · SWIPE →</div><div class="grain"></div>`;
const film = (f, i) => `<style>${base}
body{background:#F2ECE1}
.paper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.5),rgba(0,0,0,0) 70%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(120,95,60,.14) 100%)}
.pgrain{position:absolute;inset:0;opacity:.32;mix-blend-mode:multiply;${grain};filter:contrast(.5) brightness(1.5)}
.hdr{position:absolute;top:52px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Plex;font-weight:600;font-size:19px;letter-spacing:.34em;color:#3a3330}
.hdr .n{color:${f.acc}}
.hr{position:absolute;top:90px;left:60px;right:60px;height:1.5px;background:#3a3330;opacity:.55}
.ph{position:absolute;overflow:hidden;background:#222;box-shadow:0 1px 0 rgba(0,0,0,.08)}
.ph img{width:100%;height:100%;object-fit:cover;filter:saturate(.88) contrast(.97) sepia(.08)}
.ph:after{content:'';position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;${grain}}
.big{left:60px;top:122px;width:960px;height:540px}
.sm{top:680px;width:310px;height:176px}
.txt{position:absolute;top:876px;left:60px;right:60px}
.hand{font-family:Aur;font-size:48px;color:${f.acc};transform:rotate(-2.2deg);transform-origin:left;height:62px}
.title{margin-top:4px;font-family:Bod;font-weight:500;font-size:${f.fs||84}px;line-height:1.0;color:#231d1b;letter-spacing:-.01em}
.title i{font-weight:400;font-size:.46em;color:${f.acc};letter-spacing:0;margin-left:8px;vertical-align:.42em;white-space:nowrap}
.meta{margin-top:20px;display:flex;align-items:center;gap:22px;font-family:Plex;font-weight:500;font-size:19px;letter-spacing:.3em;color:#4a413c}
.meta .l{flex:1;height:1.5px;background:${f.acc};opacity:.7}
.ov{margin-top:16px;font-family:News;font-style:italic;font-size:34px;line-height:1.3;color:#3a3330}
.foot{position:absolute;bottom:46px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Plex;font-weight:600;font-size:17px;letter-spacing:.34em;color:#3a3330;opacity:.7}
</style><div class="paper"></div><div class="pgrain"></div>
<div class="hdr"><span>IT'S NEVER TOO LATE</span><span>ACT II · <span class="n">Nº 0${i+1}</span> / 05</span></div><div class="hr"></div>
<div class="ph big"><img src="file://${D}/${f.big}" style="object-position:${f.bx}% ${f.by}%"></div>
${f.sm.map((s,k)=>`<div class="ph sm" style="left:${60+k*325}px"><img src="file://${D}/${s}" style="object-position:${(f.sx||[])[k]??50}% 50%"></div>`).join('')}
<div class="txt"><div class="hand">${f.hand}</div>
<div class="title">${f.t}<i>(${f.yr})</i></div>
<div class="meta"><span>DIR. ${f.dir.toUpperCase()}</span><span class="l"></span></div>
<div class="ov">${f.ov}</div></div>
<div class="foot"><span>CINEMA</span><span>${i<4?'NEXT →':'FIN.'}</span></div>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const jobs = [['01_cover.jpg', cover()], ...S.films.map((f, i) => [`0${i+2}_${f.slug}.jpg`, film(f, i)])];
  for (const [file, html] of jobs) {
    if (only && !file.startsWith(only)) continue;
    fs.writeFileSync(D + '/_t.html', `<html><head></head><body>${html}</body></html>`); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
