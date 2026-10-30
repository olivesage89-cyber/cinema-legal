// "an old vinyl record" — cover: Llewyn at the mic on deep dark, Kaushan + Six Caps lime.
// inside: VINYL SLEEVE (per-film deep page, square album sleeve w/ still, record sliding out, label = 2nd still).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Kaushan', 'kaushan-script', 400), ff('Six', 'six-caps', 400), ff('Syne', 'syne', 600), ff('Syne', 'syne', 700),
  ff('Bask', 'libre-baskerville', 400), ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 700),
  ff('Mono', 'space-mono', 400), ff('Mono', 'space-mono', 700), ff('Abril', 'abril-fatface', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#0b0b09;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.film{filter:saturate(.82) contrast(.95) brightness(1.02) sepia(.12)}
/* cover */
.cv-img{position:absolute;left:0;top:585px;width:1080px;height:765px;object-fit:cover}
.cv-fade{position:absolute;left:0;right:0;top:565px;height:280px;background:linear-gradient(180deg,#0b0b09 8%,rgba(11,11,9,0))}
.cv-glow{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 72%,rgba(255,190,110,.10),rgba(0,0,0,0) 45%)}
.cv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)}
.cv-bot{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(8,8,7,.85),rgba(8,8,7,0))}
.grooves{position:absolute;left:50%;top:-430px;width:1100px;height:1100px;margin-left:-550px;border-radius:50%;opacity:.16;
  background:repeating-radial-gradient(circle,rgba(255,255,255,.0) 0 5px,rgba(255,255,255,.35) 5px 6px)}
.cv-t{position:absolute;left:0;right:0;top:92px;text-align:center}
.kick{font-family:Syne;font-weight:600;font-size:23px;letter-spacing:.5em;color:#EDE4D0;opacity:.9;padding-left:.5em}
.old{font-family:Kaushan;font-size:118px;color:#F1E7D2;transform:rotate(-7deg);margin:22px 0 -66px -330px;position:relative;z-index:2;text-shadow:0 4px 24px rgba(0,0,0,.6)}
.vinyl{font-family:Six;font-size:330px;line-height:.86;color:#D6F06B;letter-spacing:.06em;padding-left:.06em;text-shadow:0 6px 40px rgba(214,240,107,.18)}
.rec{font-family:Syne;font-weight:700;font-size:38px;letter-spacing:.78em;color:#D6F06B;margin-top:10px;padding-left:.78em}
.rpm{font-family:Mono;font-size:18px;letter-spacing:.35em;color:#EDE4D0;opacity:.7;margin-top:22px}
.sub{position:absolute;left:0;right:0;bottom:92px;text-align:center;font-family:Bask;font-style:italic;font-size:38px;line-height:1.35;color:#F1E7D2;text-shadow:0 2px 18px rgba(0,0,0,.8)}
.swipe{position:absolute;left:0;right:0;bottom:44px;text-align:center;font-family:Mono;font-size:17px;letter-spacing:.3em;color:#D6F06B;opacity:.85}
/* inside */
.pg{position:absolute;inset:0}
.pg-v{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 38%,rgba(255,255,255,.07),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%)}
.hdr{position:absolute;top:60px;left:90px;right:90px;display:flex;justify-content:space-between;align-items:baseline;color:#EDE4D0}
.hdr .m{font-family:Mono;font-size:19px;letter-spacing:.3em}
.hdr .k{font-family:Kaushan;font-size:38px;color:var(--a)}
.rule{position:absolute;top:112px;left:90px;right:90px;height:1.5px;background:rgba(237,228,208,.25)}
.record{position:absolute;left:468px;top:180px;width:580px;height:580px;border-radius:50%;
  background:radial-gradient(circle,#000 0 4%,transparent 4.2%),repeating-radial-gradient(circle,#0e0e0e 0 2px,#1b1b1b 2px 3px,#121212 3px 5px),#111;
  box-shadow:0 18px 50px rgba(0,0,0,.55)}
.record:after{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(from 20deg,rgba(255,255,255,0) 0deg,rgba(255,255,255,.13) 30deg,rgba(255,255,255,0) 70deg,rgba(255,255,255,0) 180deg,rgba(255,255,255,.10) 215deg,rgba(255,255,255,0) 255deg)}
.label{position:absolute;left:50%;top:50%;width:204px;height:204px;margin:-102px 0 0 -102px;border-radius:50%;overflow:hidden;border:10px solid var(--a);z-index:2}
.label img{width:100%;height:100%;object-fit:cover}
.hole{position:absolute;left:50%;top:50%;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:#0b0b09;z-index:3;box-shadow:0 0 0 3px rgba(0,0,0,.3)}
.sleeve{position:absolute;left:72px;top:170px;width:580px;height:580px;z-index:4;background:#EEE6D4;padding:0;box-shadow:0 26px 60px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.15) inset;overflow:hidden}
.sleeve img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.sleeve .wear{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 25%,rgba(255,255,255,.10),rgba(0,0,0,0) 50%),linear-gradient(135deg,rgba(255,240,210,.10),rgba(0,0,0,.12));mix-blend-mode:screen}
.sleeve .ring{position:absolute;left:50%;top:50%;width:500px;height:500px;margin:-250px 0 0 -250px;border-radius:50%;border:2px solid rgba(255,255,255,.07)}
.sleeve .edge{position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.35),inset 0 0 40px rgba(0,0,0,.25)}
.sticker{position:absolute;left:88px;top:186px;z-index:5;background:var(--a);color:#14120e;font-family:Mono;font-weight:700;font-size:16px;letter-spacing:.2em;padding:9px 14px 8px 16px;transform:rotate(-4deg);box-shadow:0 4px 12px rgba(0,0,0,.35)}
.info{position:absolute;left:90px;right:90px;top:828px;color:#F1E7D2}
.trk{font-family:Mono;font-size:20px;letter-spacing:.32em;color:var(--a)}
.ttl{font-family:Abril;font-size:86px;line-height:1.02;margin-top:14px;letter-spacing:.005em}
.meta{font-family:Mono;font-size:20px;letter-spacing:.22em;margin-top:22px;opacity:.85}
.ln{font-family:Bask;font-style:italic;font-size:33px;line-height:1.42;margin-top:22px;max-width:880px}
.bar{position:absolute;left:90px;right:90px;bottom:64px;display:flex;align-items:center;gap:18px;font-family:Mono;font-size:16px;letter-spacing:.2em;color:rgba(237,228,208,.65)}
.bar .tr{flex:1;height:3px;background:rgba(237,228,208,.18);position:relative}
.bar .tr i{position:absolute;left:0;top:0;bottom:0;background:var(--a)}
.bar .tr b{position:absolute;top:-6px;width:15px;height:15px;border-radius:50%;background:var(--a);margin-left:-7px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<div class="grooves"></div><img class="cv-img film" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="cv-fade"></div><div class="cv-glow"></div><div class="cv-bot"></div><div class="cv-vig"></div>
      <div class="cv-t"><div class="kick">${s.kick}</div><div class="old">${s.h}</div><div class="vinyl">${s.h2}</div><div class="rec">${s.h3}</div><div class="rpm">SIDE A &nbsp;·&nbsp; 33⅓ RPM &nbsp;·&nbsp; 5 TRACKS</div></div>
      <div class="sub">${s.sub}</div><div class="swipe">DROP THE NEEDLE &nbsp;→</div>`;
    else body = `<div class="pg" style="background:${s.bg}"></div><div class="pg-v"></div>
      <div class="hdr"><span class="m">SIDE A · TRACK ${s.n} / 05</span><span class="k">an old vinyl record</span></div><div class="rule"></div>
      <div class="record"><div class="label"><img class="film" src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div><div class="hole"></div></div>
      <div class="sleeve"><img class="film" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="ring"></div><div class="wear"></div><div class="edge"></div></div>
      <div class="sticker">${s.sticker}</div>
      <div class="info"><div class="trk">TRACK ${s.n} &nbsp;—&nbsp; ${s.len}</div><div class="ttl">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()}</div><div class="ln">${s.ov}</div></div>
      <div class="bar"><span>${(()=>{const [m,x]=s.len.split(':').map(Number);const t=Math.round((m*60+x)*s.prog/100);return Math.floor(t/60)+':'+String(t%60).padStart(2,'0')})()}</span><div class="tr"><i style="width:${s.prog}%"></i><b style="left:${s.prog}%"></b></div><span>${s.len}</span></div>`;
    const html = `<html><head><style>${css}</style></head><body style="--a:${s.a || '#D6F06B'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
