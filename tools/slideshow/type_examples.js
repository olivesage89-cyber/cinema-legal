// Renders 8 cover treatments of the same title to show font + colour variety.
const { chromium } = require('playwright'); const fs = require('fs');
const F = '/root/au/node_modules/@fontsource/';
const ff = (fam, pkg, w = 400, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Pinyon', 'pinyon-script'), ff('Vibes', 'great-vibes'), ff('Yellowtail', 'yellowtail'), ff('Leck', 'leckerli-one'), ff('DMS', 'dm-serif-display'), ff('DMS', 'dm-serif-display', 400, 'italic'),
  ff('Bodoni', 'bodoni-moda', 400, 'italic'), ff('Bodoni', 'bodoni-moda', 600), ff('Cinzel', 'cinzel', 500), ff('Six', 'six-caps'), ff('Anton', 'anton'), ff('Archivo', 'archivo-black'),
  ff('Caveat', 'caveat', 600), ff('Abril', 'abril-fatface'), ff('Kaushan', 'kaushan-script'), ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600), ff('Inter', 'inter', 600)].join('') + `
*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden;background:#000}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.8) contrast(.9) sepia(.12)}
.v{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(0,0,0,.28),rgba(0,0,0,0) 55%)}
.t{position:absolute;left:0;right:0;top:12%;text-align:center;text-shadow:0 2px 20px rgba(0,0,0,.3)}`;
const V = [
  ['#F3D7DC', `<div style="font-family:Cinzel;font-size:30px;letter-spacing:.4em;color:#F3D7DC">A WATCHLIST FOR</div><div style="font-family:Pinyon;font-size:230px;line-height:1;color:#F3D7DC">Sweater</div><div style="font-family:Corm;font-weight:600;font-size:80px;letter-spacing:.14em;color:#F3D7DC">WEATHER</div>`],
  ['#F2E36B', `<div style="font-family:Bodoni;font-weight:600;font-size:28px;letter-spacing:.35em;color:#fff">FIVE FILMS THAT FEEL LIKE</div><div style="font-family:Six;font-size:330px;line-height:.9;color:#F2E36B;letter-spacing:.02em">SWEATER WEATHER</div>`],
  ['#F05A9A', `<div style="font-family:Inter;font-size:30px;letter-spacing:.12em;color:#fff">MOVIES FOR</div><div style="font-family:Yellowtail;font-size:210px;line-height:.95;color:#F05A9A">Sweater<br>Weather</div>`],
  ['#B3232E', `<div style="font-family:Vibes;font-size:120px;color:#F6EBD9;margin-bottom:-40px">Cozy</div><div style="font-family:DMS;font-size:190px;line-height:.9;color:#C8302F">SWEATER<br>WEATHER</div><div style="font-family:Corm;font-weight:600;font-size:30px;letter-spacing:.3em;color:#F6EBD9;margin-top:18px">MOVIES</div>`],
  ['#F7D44A', `<div style="font-family:Archivo;font-size:58px;color:#fff;letter-spacing:.01em">THE BEAUTY OF</div><div style="font-family:Leck;font-size:170px;line-height:1;color:#F7D44A;transform:rotate(-4deg)">Sweater Weather</div>`],
  ['#FFF1C9', `<div style="font-family:Caveat;font-weight:600;font-size:150px;line-height:.95;color:#FFE27A">Sweater Weather,<br>Take Me Home.</div><div style="font-family:Inter;font-size:26px;letter-spacing:.12em;color:#fff;margin-top:20px">AUTUMN MOVIES YOU SHOULD WATCH</div>`],
  ['#FFFFFF', `<div style="font-family:Kaushan;font-size:90px;color:#fff;margin-bottom:-10px">must watch</div><div style="font-family:Anton;font-size:170px;line-height:.95;color:#fff;letter-spacing:.01em">AUTUMN MOVIES</div><div style="font-family:Inter;font-size:26px;color:#fff;margin-top:10px">for sweater weather</div>`],
  ['#E9B98A', `<div style="font-family:Corm;font-style:italic;font-size:70px;color:#E9B98A;text-align:left;margin-left:110px">movies</div><div style="font-family:Corm;font-style:italic;font-size:70px;color:#E9B98A;text-align:right;margin-right:140px">for</div><div style="font-family:Bodoni;font-style:italic;font-size:200px;color:#E9B98A;line-height:1">sweater</div><div style="font-family:Abril;font-size:140px;color:#E9B98A;line-height:1">weather</div>`],
];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const bgs = ['/root/au/v2/cover.jpg', '/root/au/v2/end.jpg', '/root/au/v2/harry.jpg', '/root/au/v2/rushmore.jpg', '/root/au/v2/magic.jpg', '/root/au/v2/hunting.jpg', '/root/au/v2/poets.jpg', '/root/au/v2/cover.jpg'];
  const pos = ['40%', '50%', '50%', '56%', '45%', '50%', '45%', '40%'];
  for (let i = 0; i < V.length; i++) {
    fs.writeFileSync('/root/au/var/_t.html', `<html><head><style>${css}</style></head><body><img class="bg" src="file://${bgs[i]}" style="object-position:${pos[i]} 50%"><div class="v"></div><div class="t" style="top:${i===3?'57%':'12%'}">${V[i][1]}</div></body></html>`);
    await p.goto('file:///root/au/var/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `/root/au/var/t${i}.jpg`, type: 'jpeg', quality: 90 });
  }
  await b.close();
})();
