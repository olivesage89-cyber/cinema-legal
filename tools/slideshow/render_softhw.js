// "soft halloween" anime slideshow — cover: Great Vibes pumpkin 'soft' + Cinzel caps HALLOWEEN over Kiki's night flight;
// inside: TAROT CARD (aubergine starry page, gold double-line card, arched still, moon medallion w/ second still, Cinzel title).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
let seed = 11; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const stars = Array.from({ length: 90 }, () => `${Math.round(rnd() * 1080)}px ${Math.round(rnd() * 1350)}px 0 ${rnd() < .8 ? 0 : 1}px rgba(255,240,220,${(.25 + rnd() * .55).toFixed(2)})`).join(',');
const css = [ff('GV', 'great-vibes', 400), ff('Cin', 'cinzel', 500), ff('Cin', 'cinzel', 600), ff('Cin', 'cinzel', 700),
  ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'), ff('Mont', 'montserrat', 500), ff('Mont', 'montserrat', 600)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#170F21}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;pointer-events:none;z-index:30;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(.96) brightness(1.03)}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(120,90,160,.16),rgba(255,150,90,.08));mix-blend-mode:soft-light}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 58%,rgba(0,0,0,.30) 100%)}
/* cover */
.cv{position:absolute;left:0;right:0;top:92px;text-align:center}
.cv .glow{position:absolute;left:50%;top:210px;width:900px;height:520px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(244,149,90,.13),rgba(244,149,90,0) 62%)}
.cv .k{font-family:Cin;font-weight:600;font-size:25px;letter-spacing:.5em;padding-left:.5em;color:#F6E9DA;opacity:.92}
.cv .h{font-family:GV;font-size:265px;line-height:.82;margin-top:26px;color:${S.cover.ink};text-shadow:0 0 40px rgba(244,149,90,.35);position:relative;left:-110px}
.cv .h2{font-family:Cin;font-weight:600;font-size:84px;letter-spacing:.24em;padding-left:.24em;color:#F6E9DA;margin-top:-40px;position:relative;text-shadow:0 2px 24px rgba(5,10,30,.6)}
.cv .rule{width:64px;height:1.5px;background:${S.cover.ink};margin:30px auto 0;opacity:.8}
.sub{position:absolute;left:0;right:0;bottom:84px;text-align:center;font-family:Corm;font-style:italic;font-weight:600;font-size:42px;color:#F6E9DA;text-shadow:0 2px 18px rgba(0,0,0,.8)}
.shade{position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(180deg,rgba(5,8,20,0),rgba(5,8,20,.55))}
/* inside: tarot */
.page{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,#2C1C3B 0%,#1A1126 55%,#110A19 100%)}
.stars{position:absolute;left:0;top:0;width:1px;height:1px;border-radius:50%;box-shadow:${stars}}
.card{position:absolute;left:120px;top:92px;width:840px;height:1166px;background:linear-gradient(180deg,#24182F,#1C1326);border:2px solid rgba(232,205,150,.75);border-radius:18px;box-shadow:0 40px 80px rgba(0,0,0,.55)}
.card:before{content:'';position:absolute;inset:14px;border:1px solid rgba(232,205,150,.45);border-radius:10px}
.num{position:absolute;top:36px;width:100%;text-align:center;font-family:Cin;font-weight:600;font-size:30px;letter-spacing:.3em;padding-left:.3em;color:var(--acc)}
.star4{position:absolute;top:44px;font-size:20px;color:rgba(232,205,150,.8);font-family:serif}
.arch{position:absolute;left:100px;top:96px;width:640px;height:580px;border-radius:320px 320px 6px 6px;overflow:hidden;box-shadow:0 0 0 2px rgba(232,205,150,.8),0 0 0 10px #22172D,0 0 0 11px rgba(232,205,150,.4)}
.arch .bg{object-position:var(--x,50%) 50%}
.med{position:absolute;left:330px;top:600px;width:180px;height:180px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 3px var(--acc),0 0 0 9px #22172D,0 0 0 10px rgba(232,205,150,.5),0 14px 30px rgba(0,0,0,.5);z-index:4}
.med img{width:100%;height:100%;object-fit:cover;object-position:var(--x2,50%) 50%}
.cardname{position:absolute;top:808px;width:100%;text-align:center;font-family:Cin;font-weight:500;font-size:21px;letter-spacing:.42em;padding-left:.42em;color:rgba(232,205,150,.9)}
.t{position:absolute;top:850px;width:100%;text-align:center;font-family:Cin;font-weight:700;font-size:var(--fs,54px);line-height:1.08;color:var(--acc);letter-spacing:.03em;padding:0 50px}
.meta{position:absolute;width:100%;text-align:center;font-family:Corm;font-style:italic;font-weight:600;font-size:30px;color:rgba(246,233,218,.78)}
.o{position:absolute;width:100%;text-align:center;font-family:Corm;font-style:italic;font-weight:500;font-size:33px;line-height:1.22;color:#F6E9DA}
.mark{position:absolute;bottom:22px;right:50px;font-family:GV;font-size:44px;color:var(--acc);opacity:.9;z-index:5}
.brand{position:absolute;top:36px;left:0;right:0;text-align:center;font-family:Mont;font-weight:600;font-size:14px;letter-spacing:.5em;color:rgba(246,233,218,.55);z-index:5}
`;
const roman = ['I', 'II', 'III', 'IV', 'V'];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (body, out) => {
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}${grain}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 });
  };
  const c = S.cover;
  await shot(`<img class="bg" src="file://${D}/${c.img}"><div class="tint"></div><div class="vig"></div><div class="shade"></div>
   <div class="cv"><div class="glow"></div><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div><div class="rule"></div></div>
   <div class="sub">${c.sub}</div>`, '01_cover.jpg');
  for (const [i, m] of S.movies.entries()) {
    const lines = (m.t.match(/<br>/g) || []).length + 1;
    const metaTop = 850 + lines * (m.fs || 54) * 1.08 + 14;
    await shot(`<div class="page"></div><div class="stars"></div>
     <div class="card" style="--acc:${m.acc};--fs:${m.fs || 54}px;--x:${m.x}%;--x2:${m.x2}%">
      <div class="star4" style="left:70px">✦</div><div class="star4" style="right:70px">✦</div>
      <div class="num">${roman[i]}</div>
      <div class="arch"><img class="bg" src="file://${D}/${m.img}"><div class="tint"></div></div>
      <div class="med"><img src="file://${D}/${m.img2}"></div>
      <div class="cardname">— ${m.card} —</div>
      <div class="t">${m.t}</div>
      <div class="meta" style="top:${metaTop}px">${m.dir} &nbsp;·&nbsp; ${m.yr}</div>
      <div class="o" style="top:${metaTop+62}px">${m.ov}</div>
     </div>`, `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
