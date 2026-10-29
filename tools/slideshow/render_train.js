// "a long train ride" (ede.nnico) — cover: night steam train with red smoke (Orient Express 2017), image fades into
// night ground; rose-red Monsieur La Doulaise script 'long' + steam-white Limelight art-deco caps TRAIN RIDE +
// Poiret One spaced kicker + Cormorant italic sub, bottom-centred. Inside: SPLIT-FLAP DEPARTURES (charcoal station
// page, brass-ruled still, split-flap board spelling the title in flap tiles, Oswald caps fields in per-film accent,
// Cormorant italic line, platform number).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
const css = [ff('Script', 'monsieur-la-doulaise', 400), ff('Deco', 'limelight', 400), ff('Poiret', 'poiret-one', 400),
  ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'), ff('Osw', 'oswald', 400), ff('Osw', 'oswald', 500),
  ff('Mono', 'space-mono', 700)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0B0A0E}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;pointer-events:none;z-index:30;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* cover */
.cimg{position:absolute;left:0;top:0;width:1080px;height:${S.cover.ih || 1000}px;overflow:hidden}
.cimg img{position:absolute;height:100%;left:${S.cover.left || -560}px;top:0;filter:saturate(1.05) contrast(1.06) brightness(.97)}
.cfade{position:absolute;left:0;right:0;top:0;height:1350px;background:linear-gradient(180deg,rgba(11,10,14,.25) 0%,rgba(11,10,14,0) 18%,rgba(11,10,14,0) 46%,rgba(11,10,14,.8) 59%,#0B0A0E 66%)}
.cvig{position:absolute;inset:0;background:radial-gradient(ellipse at 60% 40%,rgba(0,0,0,0) 45%,rgba(0,0,0,.5) 100%)}
.cv{position:absolute;left:0;right:0;top:${S.cover.top || 820}px;text-align:center;z-index:5}
.cv .k{font-family:Poiret;font-size:27px;letter-spacing:.5em;padding-left:.5em;color:#EDEAF0;opacity:.9}
.cv .h{font-family:Script;font-size:230px;line-height:.7;color:${S.cover.ink};margin:30px 0 0 -300px;position:relative;z-index:2;text-shadow:0 6px 40px rgba(0,0,0,.6)}
.cv .h2{font-family:Deco;font-size:122px;letter-spacing:.08em;padding-left:.08em;color:#EDEAF0;margin-top:-6px;line-height:1;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.cv .rule{width:120px;height:1.5px;background:${S.cover.ink};margin:24px auto 0;opacity:.9}
.cv .s{font-family:Corm;font-weight:500;font-style:italic;font-size:40px;color:#E3DCE6;margin-top:16px}
/* inside: departures */
.page{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 20%,#1C1B21 0%,#121116 60%,#0A090C 100%)}
.hd{position:absolute;top:52px;left:66px;right:66px;display:flex;justify-content:space-between;align-items:center;font-family:Osw;font-weight:500;font-size:24px;letter-spacing:.42em;color:#CDB98A;z-index:5}
.hd .r{letter-spacing:.2em;color:#8E8778}
.clock{display:inline-block;width:30px;height:30px;border-radius:50%;border:2px solid #CDB98A;position:relative;vertical-align:middle;margin-right:16px}
.clock:before,.clock:after{content:'';position:absolute;left:13px;bottom:13px;width:2px;background:#CDB98A;transform-origin:bottom center}
.clock:before{height:9px;transform:rotate(-40deg)}.clock:after{height:11px;transform:rotate(75deg)}
.main{position:absolute;left:66px;top:118px;width:948px;height:var(--sh);overflow:hidden;z-index:4;box-shadow:0 30px 60px rgba(0,0,0,.6)}
.main .bg{object-position:var(--x) var(--y)}
.brass{position:absolute;left:54px;top:106px;width:972px;height:calc(var(--sh) + 24px);border:1.5px solid rgba(205,185,138,.6);z-index:3}
.board{position:absolute;left:66px;top:calc(var(--sh) + 170px);width:948px;z-index:5}
.lbl{font-family:Osw;font-size:20px;letter-spacing:.38em;color:#7D776B;margin-bottom:14px}
.fl{display:flex;gap:5px;margin-bottom:8px}
.ch{width:59px;height:84px;border-radius:5px;background:linear-gradient(180deg,#26252B 0%,#1E1D22 49.4%,#060507 49.5%,#060507 50.5%,#1A191E 50.6%,#141317 100%);
 box-shadow:0 4px 8px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.07);display:flex;align-items:center;justify-content:center;
 font-family:Mono;font-weight:700;font-size:50px;color:#F2EEE4;position:relative}
.ch.e{background:linear-gradient(180deg,#1A191E 0%,#16151A 49.4%,#060507 49.5%,#060507 50.5%,#131216 100%);opacity:.7}
.ch:after{content:'';position:absolute;left:0;right:0;top:50%;height:1px;background:rgba(0,0,0,.9)}
.fields{display:flex;gap:0;margin-top:26px;border-top:1px solid rgba(205,185,138,.28);padding-top:20px}
.fd{flex:1}
.fd .a{font-family:Osw;font-size:17px;letter-spacing:.34em;color:#7D776B}
.fd .b{font-family:Osw;font-weight:500;font-size:32px;letter-spacing:.06em;color:var(--acc);margin-top:4px;white-space:nowrap}
.o{font-family:Corm;font-weight:500;font-style:italic;font-size:41px;line-height:1.28;color:#E7E1D6;margin-top:24px}
.plat{position:absolute;right:66px;top:calc(var(--sh) + 82px);width:126px;height:126px;border-radius:50%;background:var(--acc);z-index:6;display:flex;flex-direction:column;align-items:center;justify-content:center;box-shadow:0 10px 24px rgba(0,0,0,.5)}
.plat i{font-style:normal;font-family:Osw;font-size:13px;letter-spacing:.24em;padding-left:.24em;color:rgba(10,9,12,.75);margin-bottom:2px}
.plat b{font-family:Deco;font-weight:400;font-size:54px;line-height:1;color:#0B0A0E}
.ft{position:absolute;bottom:50px;left:66px;right:66px;display:flex;justify-content:space-between;font-family:Osw;font-size:19px;letter-spacing:.38em;color:#6E695F;z-index:5}
`;
const flap = (line, n = 15) => `<div class="fl">${[...line.padEnd(n)].map(c => c === ' ' ? `<div class="ch e"></div>` : `<div class="ch">${c}</div>`).join('')}</div>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (body, out) => {
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}${grain}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 });
  };
  const c = S.cover;
  await shot(`<div class="cimg"><img src="file://${D}/${c.img}"></div><div class="cfade"></div><div class="cvig"></div>
   <div class="cv"><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div>
   <div class="rule"></div><div class="s">${c.sub}</div></div>`, '01_cover.jpg');
  if (process.argv[3] === 'cover') { await b.close(); return; }
  for (const [i, m] of S.movies.entries()) {
    const sh = m.flap.length > 1 ? 560 : 652;
    await shot(`<style>body{--sh:${sh}px}</style><div class="page"></div>
     <div class="hd"><span><span class="clock"></span>DEPARTURES</span><span class="r">${m.time}</span></div>
     <div class="brass"></div><div class="main" style="--x:${m.x}%;--y:${m.y || 50}%"><img class="bg" src="file://${D}/${m.img}" style="${m.f ? `filter:${m.f}` : ``}"></div>
     <div class="plat" style="--acc:${m.acc}"><i>PLATFORM</i><b>${i + 1}</b></div>
     <div class="board" style="--acc:${m.acc}"><div class="lbl">NOW BOARDING</div>${m.flap.map(l => flap(l)).join('')}
      <div class="fields"><div class="fd"><div class="a">DEPARTS</div><div class="b">${m.yr}</div></div>
       <div class="fd" style="flex:2.2"><div class="a">CONDUCTOR</div><div class="b">${m.dir}</div></div>
       <div class="fd" style="flex:1.6"><div class="a">BOUND FOR</div><div class="b">${m.to}</div></div></div>
      <div class="o">${m.ov}</div></div>
     <div class="ft"><span>A LONG TRAIN RIDE</span><span>0${i + 1} / 05</span></div>`, `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
