// "Cozy mystery" — cover: fireside still set low, deco type (Poiret One kicker, Parisienne script, Limelight red caps).
// Inside: VINTAGE PAPERBACK — each film is a worn 1960s mystery paperback cover with a per-film colour band,
// framed still + brass magnifying-glass lens inset showing a second still, Playfair title, Oswald meta, Cormorant blurb.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Poiret', 'poiret-one', 400), ff('Paris', 'parisienne', 400), ff('Lime', 'limelight', 400),
  ff('Corm', 'cormorant-garamond', 500), ff('Corm', 'cormorant-garamond', 600), ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'),
  ff('Play', 'playfair-display', 900), ff('Play', 'playfair-display', 900, 'italic'), ff('Play', 'playfair-display', 700, 'italic'),
  ff('Osw', 'oswald', 500), ff('Osw', 'oswald', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* COVER */
.cv{background:#0b0603}
.cv .ext{position:absolute;left:-60px;right:-60px;top:-60px;height:700px;background-size:cover;filter:blur(38px) brightness(.35) saturate(.8)}
.cv .img{position:absolute;left:0;right:0;bottom:0;height:1060px;background-size:auto 1060px;filter:saturate(.92) contrast(1.05) brightness(1.04) sepia(.08)}
.cv .fade{position:absolute;left:0;right:0;top:250px;height:420px;background:linear-gradient(180deg,#0b0603 0%,rgba(11,6,3,.88) 30%,rgba(11,6,3,.35) 70%,rgba(11,6,3,0))}
.cv .topshade{position:absolute;left:0;right:0;top:0;height:370px;background:#0b0603}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 72%,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)}
.cv .glow{position:absolute;left:300px;top:930px;width:480px;height:300px;background:radial-gradient(ellipse,rgba(255,140,50,.18),rgba(255,140,50,0) 70%);mix-blend-mode:screen}
.cv .t{position:absolute;left:0;right:0;top:104px;text-align:center;color:#F6E7CF}
.cv .kick{font-family:Poiret;font-size:31px;letter-spacing:.42em;padding-left:.42em;opacity:.95}
.cv .rule{display:flex;align-items:center;justify-content:center;gap:18px;margin:26px auto 0;color:#E8463A;font-size:18px}
.cv .rule i{display:block;width:120px;height:1px;background:rgba(246,231,207,.55)}
.cv .scr{font-family:Paris;font-size:150px;line-height:1;margin-top:8px;color:#F6E7CF;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.cv .big{font-family:Lime;font-size:170px;line-height:.9;letter-spacing:.04em;color:#EE4A3B;margin-top:-34px;
  text-shadow:0 0 34px rgba(238,74,59,.38),0 6px 26px rgba(0,0,0,.55)}
.cv .sub{font-family:Corm;font-style:italic;font-weight:500;font-size:44px;line-height:1.22;margin-top:28px;color:#F1DFC4;opacity:.95}
.cv .sub b{font-weight:600;color:#FF9A84}
.cv .foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Poiret;font-size:25px;letter-spacing:.42em;color:#F6E7CF;opacity:.96;text-shadow:0 2px 14px rgba(0,0,0,.95),0 0 4px rgba(0,0,0,.8)}
/* PAPERBACK */
.pb{background:#1b1410}
.book{position:absolute;left:62px;top:52px;width:956px;height:1246px;background:#EFE3C8;border-radius:6px 14px 14px 6px;overflow:hidden;
  box-shadow:0 30px 60px rgba(0,0,0,.55),0 4px 10px rgba(0,0,0,.4)}
.paper{position:absolute;inset:0;background:
  radial-gradient(ellipse at 50% 45%,rgba(255,250,235,0) 55%,rgba(120,80,30,.28) 100%),
  linear-gradient(90deg,rgba(0,0,0,.18),rgba(0,0,0,0) 3%,rgba(255,255,255,.08) 4.2%,rgba(0,0,0,0) 6%);pointer-events:none;z-index:5}
.crease{position:absolute;z-index:6;pointer-events:none}
.band{position:absolute;left:0;right:0;top:0;height:132px;background:var(--c)}
.band .pub{position:absolute;left:44px;top:34px;font-family:Osw;font-weight:500;font-size:22px;letter-spacing:.34em;color:#F3E6CA}
.band .pub2{position:absolute;left:44px;top:70px;font-family:Corm;font-style:italic;font-weight:600;font-size:28px;color:#F3E6CA;opacity:.85}
.round{position:absolute;right:40px;top:26px;width:132px;height:132px;border-radius:50%;background:#EFE3C8;border:3px solid var(--c);z-index:3;
  display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--c);box-shadow:0 3px 8px rgba(0,0,0,.25)}
.round .n{font-family:Play;font-weight:900;font-size:58px;line-height:.9}
.round .of{font-family:Osw;font-size:15px;letter-spacing:.26em;margin-top:4px}
.frame{position:absolute;left:44px;right:44px;top:166px;height:600px;border:4px solid #1d1611;overflow:hidden;background:#000}
.frame img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(1.04) sepia(.14) brightness(1.02)}
.lens{position:absolute;width:300px;height:300px;z-index:4}
.lens .g{position:absolute;inset:0;border-radius:50%;overflow:hidden;border:14px solid #B88A3E;
  box-shadow:0 0 0 3px #5b3f15,inset 0 0 0 3px #e8c47a,0 14px 30px rgba(0,0,0,.5)}
.lens .g img{width:100%;height:100%;object-fit:cover;transform:scale(1.04);filter:saturate(.95) contrast(1.06)}
.lens .g:after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 32% 28%,rgba(255,255,255,.38),rgba(255,255,255,0) 32%),radial-gradient(circle,rgba(0,0,0,0) 62%,rgba(0,0,0,.35))}
.lens .h{position:absolute;width:40px;height:170px;left:236px;top:-120px;transform:rotate(42deg);transform-origin:bottom center;border-radius:12px;
  background:linear-gradient(90deg,#2a1608,#6b3d1c 40%,#3a200c);box-shadow:0 10px 20px rgba(0,0,0,.45)}
.lens .h:before{content:'';position:absolute;left:-4px;right:-4px;bottom:-6px;height:30px;border-radius:6px;background:linear-gradient(90deg,#7a5520,#E2B866 45%,#8a6224)}
.ttl{position:absolute;left:44px;right:44px;top:800px;font-family:Play;font-weight:900;font-style:italic;color:var(--c);font-size:var(--fs,92px);line-height:.98;letter-spacing:-.01em}
.by{position:absolute;left:46px;right:44px;top:var(--bt,930px);font-family:Osw;font-weight:500;font-size:24px;letter-spacing:.3em;color:#2a211a}
.by b{color:var(--c);font-weight:500}
.blurb{position:absolute;left:46px;right:60px;top:var(--lt,982px);font-family:Corm;font-style:italic;font-weight:600;font-size:40px;line-height:1.2;color:#3a2e24}
.bot{position:absolute;left:0;right:0;bottom:0;height:86px;background:var(--c);display:flex;align-items:center;justify-content:space-between;padding:0 44px;
  font-family:Osw;font-weight:500;font-size:21px;letter-spacing:.32em;color:#F3E6CA}
.dots{display:flex;gap:12px}.dots i{width:12px;height:12px;border-radius:50%;border:2px solid #F3E6CA}.dots i.on{background:#F3E6CA}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const crease = `<svg class="crease" width="956" height="1246" style="left:0;top:0"><path d="M0 1080 L180 1246" stroke="rgba(255,255,255,.35)" stroke-width="2"/><path d="M2 1083 L181 1246" stroke="rgba(0,0,0,.12)" stroke-width="2"/><path d="M820 0 L956 150" stroke="rgba(255,255,255,.28)" stroke-width="2"/><path d="M822 0 L956 148" stroke="rgba(0,0,0,.10)" stroke-width="2"/></svg>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.slides.entries()) {
    let body;
    if (s.type === 'cover') {
      const c = S.cover;
      body = `<body class="cv"><div class="ext" style="background-image:url(file://${D}/${c.img});background-position:${c.x}% 30%"></div><div class="topshade"></div>
      <div class="img" style="background-image:url(file://${D}/${c.img});background-position:${c.x}% 50%"></div><div class="fade"></div><div class="glow"></div><div class="vig"></div><div style="position:absolute;left:0;right:0;bottom:0;height:220px;background:linear-gradient(0deg,rgba(11,6,3,.82),rgba(11,6,3,0))"></div>
      <div class="t"><div class="kick">${c.kick}</div><div class="rule"><i></i>✦<i></i></div><div class="scr">${c.h}</div><div class="big">${c.h2}</div><div class="sub">${c.sub}</div></div>
      <div class="foot">${c.foot}</div><div class="grain"></div></body>`;
    } else {
      const n = i;
      body = `<body class="pb"><div class="book" style="--c:${s.c};--fs:${s.fs || 92}px;--bt:${s.bt || 930}px;--lt:${s.lt || 982}px">
      <div class="band"><div class="pub">A CINEMA MYSTERY</div><div class="pub2">${s.series}</div></div>
      <div class="round"><div class="n">${n}</div><div class="of">OF FIVE</div></div>
      <div class="frame"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      <div class="lens" style="left:${s.lx ?? 600}px;top:${s.ly ?? 520}px"><div class="g"><img src="file://${D}/${s.lens}" style="object-position:${s.lix ?? 50}% ${s.liy ?? 40}%"></div><div class="h"></div></div>
      <div class="ttl">${s.t}</div>
      <div class="by">${s.yr} &nbsp;·&nbsp; DIRECTED BY <b>${s.dir.toUpperCase()}</b></div>
      <div class="blurb">${s.ov}</div>
      <div class="bot"><span>${s.clue}</span><span class="dots">${[1,2,3,4,5].map(k => `<i class="${k===n?'on':''}"></i>`).join('')}</span></div>
      <div class="paper"></div>${crease}</div><div class="grain" style="opacity:.16"></div></body>`;
    }
    const html = `<html><head><style>${css}</style></head>${body}</html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
