// "it's going to be okay" — cover: handwritten Caveat + Young Serif on extended peach sky.
// Inside: NOTE CARD layout — tinted linen page, big still, tilted lined index card with a handwritten film quote
// + washi tape, small polaroid w/ 2nd still, Young Serif title in per-film ink. Usage: node render_okay.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const noise = (o, f = .9) => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${o}'/></svg>")`;
const css = [ff('Cav', 'caveat', 500), ff('Cav', 'caveat', 600), ff('Cav', 'caveat', 700), ff('YS', 'young-serif', 400),
  ff('DM', 'dm-sans', 500), ff('DM', 'dm-sans', 600), ff('DM', 'dm-sans', 700), ff('NM', 'nanum-myeongjo', 400), ff('NM', 'nanum-myeongjo', 700)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.20;mix-blend-mode:overlay;background-image:${noise(1)};pointer-events:none}
/* cover */
.cbg{position:absolute;inset:0;width:100%;height:100%;filter:saturate(.92) contrast(1.02) brightness(1.01)}
.cwarm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,214,180,.10),rgba(0,0,0,0) 40%,rgba(40,20,10,.22));}
.kick{position:absolute;top:78px;width:100%;text-align:center;font:600 22px DM;letter-spacing:.44em;color:#26384F;padding-left:.44em}
.krule{position:absolute;top:118px;left:50%;width:70px;height:2px;margin-left:-35px;background:#A63F26;opacity:.8}
.cav{position:absolute;top:112px;width:100%;text-align:center;font:600 118px/1 Cav;color:#26384F;transform:rotate(-3deg)}
.okay{position:absolute;top:222px;width:100%;text-align:center;font:400 262px/1 YS;color:#A63F26;letter-spacing:-.02em;text-shadow:0 2px 30px rgba(255,225,200,.35)}
.csub{position:absolute;top:500px;right:52px;width:380px;text-align:right;font:400 33px/1.32 NM;color:#26384F}
.csub b{font-weight:700;color:#A63F26}
.cfoot{position:absolute;bottom:52px;right:56px;font:700 20px DM;letter-spacing:.34em;color:#FFF4E6;text-shadow:0 1px 12px rgba(0,0,0,.5)}
.cfoot2{position:absolute;bottom:52px;left:58px;font:700 20px DM;letter-spacing:.34em;color:#FFF4E6;text-shadow:0 1px 12px rgba(0,0,0,.5)}
/* film pages */
.page{position:absolute;inset:0;background:var(--paper)}
.page:after{content:'';position:absolute;inset:0;background-image:${noise(.55, .6)};opacity:.35;mix-blend-mode:multiply}
.hdr{position:absolute;top:50px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:baseline;color:var(--ink);z-index:3}
.hdr .n{font:700 20px DM;letter-spacing:.34em}
.hdr .m{font:600 36px Cav;opacity:.9}
.still{position:absolute;left:60px;top:112px;width:960px;height:600px;object-fit:cover;border-radius:4px;box-shadow:0 18px 40px rgba(40,30,20,.22),0 2px 6px rgba(40,30,20,.18);filter:saturate(.9) contrast(1.02) sepia(.08)}
.pol{position:absolute;left:748px;top:560px;width:262px;background:#FBF8F2;padding:14px 14px 50px;transform:rotate(5deg);box-shadow:0 14px 30px rgba(40,30,20,.25);z-index:4}
.pol img{display:block;width:234px;height:200px;object-fit:cover;filter:saturate(.9) sepia(.1)}
.pol div{position:absolute;bottom:10px;left:0;right:0;text-align:center;font:600 28px Cav;color:#3a3330}
.ttl{position:absolute;left:70px;top:784px;width:480px;font:400 66px/1.04 YS;color:var(--ink)}
.meta{font:700 19px DM;letter-spacing:.24em;color:#4a423c;margin-top:22px;line-height:1.6}
.line{font:400 31px/1.42 NM;color:#3b3430;margin-top:20px}
.card{position:absolute;left:574px;top:904px;width:450px;height:330px;background:#FFFDF7;transform:rotate(-2.4deg);box-shadow:0 16px 34px rgba(40,30,20,.22),0 1px 3px rgba(0,0,0,.12);z-index:5;
  background-image:linear-gradient(90deg,transparent 54px,rgba(214,82,82,.55) 54px,rgba(214,82,82,.55) 56px,transparent 56px),repeating-linear-gradient(180deg,transparent 0 47px,rgba(92,130,180,.32) 47px 49px);background-position:0 0,0 30px}
.tape{position:absolute;top:-22px;left:50%;width:150px;height:44px;margin-left:-75px;background:var(--tape);opacity:.82;transform:rotate(3deg);z-index:6;
  clip-path:polygon(0 8%,4% 0,9% 10%,14% 0,20% 8%,100% 0,97% 50%,100% 100%,92% 92%,86% 100%,0 100%,3% 50%)}
.q{position:absolute;left:74px;right:24px;top:43px;font:500 45px/49px Cav;color:var(--qink)}
.who{position:absolute;right:30px;bottom:18px;font:700 16px DM;letter-spacing:.26em;color:#7a6f66}
.pfoot{position:absolute;left:70px;bottom:52px;font:700 18px DM;letter-spacing:.34em;color:var(--ink);opacity:.8}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') body = `<img class="cbg" src="file://${D}/${s.img}"><div class="cwarm"></div>
      <div class="kick">${s.kick}</div><div class="krule"></div><div class="cav">${s.h}</div><div class="okay">${s.h2}</div>
      <div class="csub">${s.sub}</div><div class="cfoot2">05 FILMS</div><div class="cfoot">SWIPE &nbsp;→</div>`;
    else body = `<div class="page" style="--paper:${s.paper}"></div>
      <div class="hdr" style="--ink:${s.ink}"><span class="n">Nº 0${i} / 05</span><span class="m">it's going to be okay</span></div>
      <img class="still" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%">
      <div class="pol"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"><div>${s.cap}</div></div>
      <div class="ttl" style="--ink:${s.ink};font-size:${s.fs || 66}px">${s.t}<div class="meta">${s.dir}<br>${s.yr}</div><div class="line">${s.ov}</div></div>
      <div class="card" style="--tape:${s.tape};--qink:${s.qink || '#24365A'}"><div class="tape"></div><div class="q">“${s.q}”</div><div class="who">— ${s.who}</div></div>`;
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
