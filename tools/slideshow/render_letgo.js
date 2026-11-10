// "letting go of the bike" — cover: full poster still + Caveat/Gloock type; inside: SUNDAY PAPER newsprint pages.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [
  ff('Gloock', 'gloock', 400), ff('Caveat', 'caveat', 500), ff('Caveat', 'caveat', 700),
  ff('Karla', 'karla', 500), ff('Karla', 'karla', 700), ff('Fraktur', 'unifrakturmaguntia', 400),
  ff('Spectral', 'spectral', 400), ff('Spectral', 'spectral', 500), ff('Spectral', 'spectral', 400, 'italic'), ff('Spectral', 'spectral', 500, 'italic'), ff('Spectral', 'spectral', 600, 'italic'),
].join('');
const grain = (o) => `<div style="position:absolute;inset:-50%;width:200%;height:200%;opacity:${o};mix-blend-mode:overlay;pointer-events:none;background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>&quot;)"></div>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  return `<style>${fonts}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;overflow:hidden;background:#1d2321;position:relative}
  .ext{position:absolute;left:0;top:0;width:1080px;height:700px;background:url(file://${D}/${c.img}) ${c.x}% 0%/auto 1100px;filter:blur(28px) saturate(.6) brightness(.55);transform:scale(1.15)}
  .img{position:absolute;left:0;top:${c.top}px;width:1080px;height:${1350 - c.top}px;background:url(file://${D}/${c.img}) ${c.x}% ${c.y}%/auto ${c.ih}px no-repeat;filter:saturate(.82) contrast(.95) brightness(1.02) sepia(.12);
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 260px)}
  .tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(60,90,80,.12),rgba(210,150,100,.10));mix-blend-mode:soft-light}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,20,18,.78) 0,rgba(14,20,18,.45) 34%,rgba(14,20,18,0) 52%,rgba(0,0,0,0) 82%,rgba(10,12,10,.5) 100%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;color:#F5EEDF;text-shadow:0 2px 24px rgba(0,0,0,.35)}
  .kick{font-family:Karla;font-weight:500;font-size:25px;letter-spacing:.52em;margin-left:.52em;opacity:.92}
  .hand{font-family:Caveat;font-weight:700;font-size:112px;color:${c.ink2};transform:rotate(-5deg);margin:0 0 -22px -330px;line-height:1;text-shadow:0 2px 18px rgba(0,0,0,.4)}
  .hero{font-family:Gloock;font-size:178px;line-height:.92;letter-spacing:-.01em;color:${c.ink}}
  .sub{font-family:Spectral;font-style:italic;font-weight:500;font-size:40px;line-height:1.28;margin-top:22px;opacity:.96}
  .sub em{color:${c.ink2};font-style:italic}
  .foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Karla;font-weight:500;font-size:21px;letter-spacing:.42em;color:#F5EEDF;opacity:.88;text-shadow:0 1px 10px rgba(0,0,0,.5)}
  </style><div class="ext"></div><div class="img"></div><div class="tint"></div><div class="shade"></div><div class="vig"></div>${grain(.2)}
  <div class="t"><div class="kick">${c.kick}</div><div class="hand">${c.hand}</div><div class="hero">${c.hero}</div><div class="sub">${c.sub}</div></div>
  <div class="foot">${c.foot}</div>`;
}

function page(m, i, n) {
  const A = m.accent;
  const dots = Array.from({ length: n }, (_, k) => `<span style="display:inline-block;width:11px;height:11px;border-radius:50%;margin:0 6px;background:${k === i ? A : 'transparent'};border:1.6px solid ${k === i ? A : '#2a2620'}"></span>`).join('');
  return `<style>${fonts}
  *{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#E9E1CF;color:#1F1C18;font-family:Spectral}
  .paper{position:absolute;inset:0;background:
     radial-gradient(ellipse at 30% 20%,rgba(255,250,236,.55),rgba(255,250,236,0) 60%),
     radial-gradient(ellipse at 80% 90%,rgba(150,120,70,.16),rgba(0,0,0,0) 55%),
     linear-gradient(180deg,#EEE7D6,#E4DAC4)}
  .fibre{position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.012 .5' numOctaves='3'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .38  0 0 0 .5 0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")}
  .fold{position:absolute;left:0;right:0;top:672px;height:28px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(90,70,40,.06) 48%,rgba(255,255,255,.16) 52%,rgba(0,0,0,0));}
  .edge{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(110,85,45,.30)}
  .w{position:absolute;left:70px;right:70px}
  .top{top:50px;display:flex;justify-content:space-between;font-family:Karla;font-weight:700;font-size:17px;letter-spacing:.28em;color:#3a342b}
  .mast{top:76px;text-align:center;font-family:Fraktur;font-size:104px;line-height:1;color:#18150f}
  .r2{top:192px;border-top:3px solid #1F1C18;border-bottom:1px solid #1F1C18;height:7px}
  .date{top:210px;display:flex;justify-content:space-between;font-family:Karla;font-weight:700;font-size:17px;letter-spacing:.24em;color:#2b261f}
  .date b{color:${A}}
  .r1{top:240px;border-top:1px solid #1F1C18}
  .kick{top:262px;font-family:Karla;font-weight:700;font-size:18px;letter-spacing:.34em;color:${A}}
  .hl{top:290px;font-family:Gloock;font-size:${m.hs || 84}px;line-height:1;letter-spacing:-.01em;white-space:nowrap}
  .deck{top:${290 + (m.hs || 84) + 18}px;font-style:italic;font-weight:500;font-size:33px;line-height:1.22;color:#2d2821;max-width:900px}
  .ph{position:absolute;overflow:hidden;border:1px solid #1F1C18}
  .ph img{width:100%;height:100%;object-fit:cover;filter:saturate(.78) contrast(.97) sepia(.14) ${m.bw ? 'grayscale(1) contrast(1.05)' : ''}}
  .ph:after{content:'';position:absolute;inset:0;background:rgba(233,220,190,.10);mix-blend-mode:multiply}
  .cap{font-style:italic;font-size:19px;color:#3d372e;position:absolute}
  .cap b{font-family:Karla;font-style:normal;font-weight:700;font-size:14px;letter-spacing:.2em;color:${A};margin-right:8px}
  .body{position:absolute;left:560px;right:70px;top:1088px;font-size:21px;line-height:1.38;text-align:justify;hyphens:auto;color:#26221c}
  .body:first-letter{font-family:Gloock;float:left;font-size:84px;line-height:.82;padding:6px 10px 0 0;color:${A}}
  .by{position:absolute;left:560px;top:1060px;font-family:Karla;font-weight:700;font-size:15px;letter-spacing:.26em;color:#2b261f}
  .note{position:absolute;font-family:Caveat;font-weight:700;color:${A};font-size:40px;transform:rotate(${m.nr || -4}deg);white-space:nowrap;line-height:1}
  .foot{bottom:36px;display:flex;justify-content:space-between;align-items:center;font-family:Karla;font-weight:700;font-size:15px;letter-spacing:.26em;color:#3a342b;border-top:1px solid #1F1C18;padding-top:12px}
  </style>
  <div class="paper"></div><div class="fibre"></div>
  <div class="w top"><span>SUNDAY EDITION</span><span>NO. 0${i + 1} OF 0${n}</span><span>PRICE: ONE HUG</span></div>
  <div class="w mast">The Sunday Dad</div>
  <div class="w r2"></div>
  <div class="w date"><span>NOVEMBER 15, 2026</span><span><b>●</b> THE FATHERS ISSUE <b>●</b></span><span>${m.dirLabel || 'DIR.'} ${m.dir.toUpperCase()}</span></div>
  <div class="w r1"></div>
  <div class="w kick">${m.kick}</div>
  <div class="w hl">${m.t} <span style="font-family:Spectral;font-style:italic;font-size:.42em;color:#4a4237;letter-spacing:0">(${m.yr})</span></div>
  <div class="w deck">${m.ov}</div>
  <div class="ph" style="left:70px;top:${m.pt || 492}px;width:940px;height:${m.ph || 520}px"><img src="file://${D}/${m.img}" style="object-position:${m.x}% ${m.y ?? 50}%"></div>
  <div class="cap" style="left:70px;top:${(m.pt || 492) + (m.ph || 520) + 10}px"><b>ABOVE</b>${m.cap}</div>
  <div class="ph" style="left:70px;top:1060px;width:460px;height:212px"><img src="file://${D}/${m.img2}" style="object-position:${m.x2 ?? 50}% ${m.y2 ?? 50}%"></div>
  <div class="by">WHY IT STAYS WITH YOU</div>
  <div class="body">${m.body}</div>
  <div class="note" style="left:${m.nx}px;top:${m.ny}px">${m.note}</div>
  <div class="w foot"><span>CINEMA · SECTION D</span><span>${dots}</span><span>${i + 1 < n ? 'CONTINUED →' : 'THE END ♡'}</span></div>
  <div class="fold"></div><div class="edge"></div>${grain(.12)}`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[3];
  const jobs = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, page(m, i, S.movies.length)])];
  for (const [f, h] of jobs) {
    if (only && !f.startsWith(only)) continue;
    fs.writeFileSync(D + '/_t.html', '<html><body>' + h + '</body></html>'); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
