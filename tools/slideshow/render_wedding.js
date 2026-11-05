// "a wedding under the fairy lights" — cover: Monsoon Wedding kiss under fairy lights, champagne-blush Pinyon Script.
// Inside: INVITATION SUITE (ivory cotton card, arched chapel-window still in gold double rule, tilted photo-booth strip,
// wax seal in per-film colour, Gloock title, Josefin caps, Petrona italic line, wedding-ring progress).
// Usage: node render_wedding.js WORKDIR  (reads WORKDIR/wed.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const COTTON = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")`;
const css = [
  ff('Pinyon', 'pinyon-script', 400), ff('Italiana', 'italiana', 400),
  ff('Jos', 'josefin-sans', 400), ff('Jos', 'josefin-sans', 600),
  ff('Pet', 'petrona', 400, 'italic'), ff('Pet', 'petrona', 400), ff('Gloock', 'gloock', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0D0F08}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}
/* cover */
.cv-ext{position:absolute;left:-80px;top:-80px;width:1240px;height:1510px;object-fit:cover;filter:blur(40px) brightness(.5) saturate(.9)}
.cv-img{position:absolute;left:var(--cx);top:var(--cy);height:var(--ch);filter:saturate(.95) contrast(1.06) brightness(var(--br,1.02)) sepia(.06);-webkit-mask-image:var(--mask,none)}
.cv-fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,9,5,.35) 0%,rgba(8,9,5,0) 18%,rgba(8,9,5,0) 44%,rgba(8,9,5,.55) 60%,rgba(8,9,5,.9) 74%,#080905 100%)}
.cv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 45% 35%,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)}
.cv-txt{position:absolute;left:0;right:0;text-align:center;color:#F5EEDF}
.kick{font-family:Jos;font-weight:400;font-size:22px;letter-spacing:.5em;margin-left:.5em;opacity:.92;margin-bottom:22px;text-shadow:0 1px 10px rgba(0,0,0,.8)}
.hero{font-family:Pinyon;font-size:232px;line-height:1;color:var(--ink);margin-top:-6px;text-shadow:0 0 46px rgba(255,205,170,.38),0 0 12px rgba(255,220,190,.25),0 4px 24px rgba(0,0,0,.6)}
.hero2{font-family:Italiana;font-size:50px;letter-spacing:.3em;margin-left:.3em;color:#F5EEDF;margin-top:40px;text-shadow:0 2px 20px rgba(0,0,0,.7)}
.rule{display:flex;align-items:center;justify-content:center;gap:18px;margin:26px auto 0;color:var(--ink)}
.rule i{display:block;width:120px;height:1px;background:linear-gradient(90deg,transparent,var(--ink))}
.rule i:last-child{background:linear-gradient(90deg,var(--ink),transparent)}
.sub{font-family:Pet;font-style:italic;font-size:31px;line-height:1.45;margin-top:22px;opacity:.95}
.sub em{color:var(--ink)}
.foot{position:absolute;bottom:46px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Jos;font-weight:400;font-size:18px;letter-spacing:.4em;color:#F5EEDF;opacity:.75}
/* invitation page */
.pg{position:absolute;inset:0;background:#F3ECDF}
.pg:before{content:'';position:absolute;inset:0;background-image:${COTTON};opacity:.16;mix-blend-mode:multiply}
.pg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.25),rgba(120,95,60,.14) 100%)}
.edge{position:absolute;inset:26px;border:1px solid rgba(160,128,72,.55)}
.edge:after{content:'';position:absolute;inset:7px;border:1px solid rgba(160,128,72,.3)}
.hd{position:absolute;top:58px;left:76px;right:76px;display:flex;justify-content:space-between;align-items:baseline;color:#5A4C3A;z-index:5}
.hd .l{font-family:Jos;font-weight:600;font-size:17px;letter-spacing:.42em}
.hd .l b{color:var(--acc)}
.hd .r{font-family:Pinyon;font-size:40px;color:var(--acc)}
.arch{position:absolute;left:70px;top:122px;width:604px;height:826px;border-radius:302px 302px 0 0;border:1.5px solid #B0915A;padding:9px}
.arch .in{width:100%;height:100%;border-radius:293px 293px 0 0;overflow:hidden;position:relative;box-shadow:0 10px 30px rgba(70,50,20,.22)}
.arch img{width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.04) sepia(.06)}
.arch .in:after{content:'';position:absolute;inset:0;background:linear-gradient(170deg,rgba(255,236,205,.1),rgba(40,25,10,.08))}
.strip{position:absolute;left:716px;top:150px;width:296px;padding:14px 14px 56px;background:#FBF8F2;transform:rotate(3.2deg);box-shadow:0 14px 30px rgba(70,50,20,.28),0 2px 5px rgba(70,50,20,.18)}
.strip .fr{width:268px;height:186px;overflow:hidden;margin-bottom:12px;background:#222}
.strip .fr:last-of-type{margin-bottom:0}
.strip img{width:100%;height:100%;object-fit:cover;filter:saturate(.85) contrast(1.05) sepia(.1)}
.strip .dt{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-family:Jos;font-weight:600;font-size:14px;letter-spacing:.42em;color:#8A7A62}
.seal{position:absolute;width:150px;height:150px;border-radius:50%;background:radial-gradient(circle at 38% 32%,var(--hi) 0%,var(--acc) 42%,var(--lo) 100%);box-shadow:0 8px 18px rgba(60,30,10,.35),inset 0 -6px 14px rgba(0,0,0,.25),inset 0 5px 10px rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center;transform:rotate(-8deg);clip-path:polygon(50% 0,60% 3%,70% 2%,78% 8%,88% 12%,93% 22%,99% 31%,97% 42%,100% 52%,97% 62%,99% 71%,92% 80%,86% 89%,76% 93%,67% 99%,56% 97%,46% 100%,36% 97%,26% 98%,18% 91%,10% 85%,6% 75%,1% 66%,3% 55%,0 45%,3% 35%,2% 25%,9% 16%,16% 8%,26% 5%,36% 1%)}
.seal:before{content:'';position:absolute;inset:20px;border-radius:50%;border:2px solid rgba(255,255,255,.2);box-shadow:inset 0 2px 3px rgba(0,0,0,.25)}
.seal span{font-family:Pinyon;font-size:62px;color:rgba(255,240,225,.55);text-shadow:0 -1px 1px rgba(0,0,0,.35),0 1px 1px rgba(255,255,255,.25);margin-top:4px}
.req{position:absolute;left:76px;font-family:Jos;font-weight:400;font-size:17px;letter-spacing:.42em;color:#8A7A62}
.ttl{position:absolute;left:72px;font-family:Gloock;color:#2C2419;line-height:1;letter-spacing:-.005em}
.meta{position:absolute;left:76px;font-family:Jos;font-weight:600;font-size:19px;letter-spacing:.32em;color:var(--acc)}
.ln{position:absolute;left:76px;font-family:Pet;font-style:italic;font-size:30px;line-height:1.45;color:#4A3F31;max-width:930px}
.rings{position:absolute;bottom:54px;left:0;right:0;display:flex;justify-content:center;gap:22px}
.rings i{width:22px;height:22px;border-radius:50%;border:2px solid #B9A684;opacity:.6}
.rings i.on{border-color:var(--acc);opacity:1;box-shadow:12px 0 0 -0px transparent}
.rings i.on + i.tw{}
`;
const S = JSON.parse(fs.readFileSync(D + '/wed.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S.slides) {
    if (process.argv[3] && !s.file.startsWith(process.argv[3])) continue;
    let body;
    if (s.type === 'cover') {
      body = `${s.ext ? `<img class="cv-ext" src="file://${D}/${s.img}">` : ''}<img class="cv-img" style="--cx:${s.cx}px;--cy:${s.cy}px;--ch:${s.ch}px;--br:${s.br ?? 1.02};${s.mask ? '--mask:' + s.mask : ''}" src="file://${D}/${s.img}">
      <div class="cv-fade"></div><div class="cv-vig"></div>
      <div class="cv-txt" style="--ink:${S.ink};top:${s.tt}px"><div class="kick">MOVIES THAT FEEL LIKE A</div>
      <div class="hero">wedding</div><div class="hero2">UNDER THE FAIRY LIGHTS</div>
      <div class="rule"><i></i><span style="font-family:Pinyon;font-size:34px">&amp;</span><i></i></div>
      <div class="sub">five films for first dances &amp;<br><em>everyone you love in one room</em></div></div>
      <div class="foot"><span>05 FILMS</span><span>SWIPE →</span></div>`;
    } else {
      const i = s.n, tt = s.tt ?? 998;
      body = `<div class="pg"></div><div class="edge"></div>
      <div class="hd" style="--acc:${s.acc}"><span class="l">THE WEDDING FILMS &nbsp;·&nbsp; Nº <b>0${i}</b> / 05</span><span class="r">under the fairy lights</span></div>
      <div class="arch"><div class="in"><img src="file://${D}/${s.big}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"></div></div>
      <div class="strip">${s.strip.map(([f, x, y]) => `<div class="fr"><img src="file://${D}/${f}" style="object-position:${x ?? 50}% ${y ?? 50}%"></div>`).join('')}<div class="dt">${s.date}</div></div>
      <div class="seal" style="left:592px;top:850px;--acc:${s.acc};--hi:${s.hi};--lo:${s.lo}"><span>${s.ini}</span></div>
      <div class="ttl" style="top:${tt}px;font-size:${s.fs ?? 84}px">${s.t}</div>
      <div class="meta" style="top:${tt + (s.fs ?? 84) + 22}px;--acc:${s.acc}">DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div>
      <div class="ln" style="top:${tt + (s.fs ?? 84) + 66}px">${s.ov}</div>
      <div class="rings" style="--acc:${s.acc}">${[1, 2, 3, 4, 5].map(k => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
