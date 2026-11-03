// "movies about the people who believed in you" — cover: Karate Kid crane-kick dusk, extended violet sky,
// League Gothic BELIEVED + Kaushan brush script; inside: CHALKBOARD lesson pages (render_believed.js)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = __dirname + '/node_modules/@fontsource/';
const ff = (fam, pkg, w = 400, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('LG', 'league-gothic'), ff('Kaushan', 'kaushan-script'), ff('Barlow', 'barlow', 500), ff('Barlow', 'barlow', 600),
  ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 400), ff('Sketch', 'cabin-sketch', 700), ff('Sketch', 'cabin-sketch', 400),
  ff('Kalam', 'kalam', 400), ff('Kalam', 'kalam', 700), ff('Kalam', 'kalam', 300)].join('');
const grain = (o) => `<div style="position:absolute;inset:-50%;width:200%;height:200%;opacity:${o};mix-blend-mode:overlay;pointer-events:none;background-image:url(&quot;data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>&quot;)"></div>`;
// chalk filter: eroded edges + speckle
const chalkSVG = `<svg width="0" height="0" style="position:absolute"><filter id="chalk" x="-5%" y="-5%" width="110%" height="110%">
 <feTurbulence type="fractalNoise" baseFrequency="1.6" numOctaves="2" seed="3" result="n"/>
 <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.75" result="m"/>
 <feComposite in="SourceGraphic" in2="m" operator="in" result="c"/>
 <feTurbulence type="fractalNoise" baseFrequency=".04" numOctaves="2" seed="8" result="w"/>
 <feDisplacementMap in="c" in2="w" scale="2.2"/></filter></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#1B2722}`;

function cover(s) {
  return `<style>${fonts}${base}
  .sky{position:absolute;inset:0;background:linear-gradient(180deg,#2A1C44 0%,#4A3566 22%,#7A6488 40%,#A3889C 52%)}
  .img{position:absolute;left:0;right:0;bottom:0;height:${s.ih}px;overflow:hidden;
     -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${s.fade}px)}
  .img img{position:absolute;height:100%;left:${s.il}px;filter:saturate(.92) contrast(1.04) sepia(.08)}
  .glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 50% 26%,rgba(25,12,40,.38),rgba(0,0,0,0) 70%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(10,4,20,.42) 100%),linear-gradient(180deg,rgba(0,0,0,0) 72%,rgba(15,6,10,.45) 100%)}
  .t{position:absolute;left:0;right:0;top:${s.ty}px;text-align:center;color:#FFF6EE}
  .kick{font-family:Barlow;font-weight:600;font-size:25px;letter-spacing:.5em;padding-left:.5em;opacity:.92;text-shadow:0 2px 14px rgba(20,8,40,.5)}
  .big{font-family:LG;font-size:330px;line-height:.82;letter-spacing:.015em;margin-top:22px;color:#FFF6EE;
       text-shadow:0 0 40px rgba(255,200,160,.28),0 6px 30px rgba(30,10,50,.45)}
  .scr{font-family:Kaushan;font-size:122px;color:#FFC29B;transform:rotate(-6deg);margin-top:-78px;margin-left:330px;
       text-shadow:0 4px 18px rgba(40,12,40,.55),0 0 24px rgba(255,170,120,.35)}
  .sub{font-family:Bask;font-style:italic;font-size:33px;line-height:1.4;margin-top:6px;text-shadow:0 2px 16px rgba(20,8,40,.6)}
  .sub2{position:absolute;left:0;right:0;bottom:118px;text-align:center;color:#FFF6EE;font-family:Bask;font-style:italic;font-size:34px;line-height:1.42;text-shadow:0 2px 16px rgba(0,0,0,.75)}.sub2 b{font-weight:400;color:#FFC29B}.sub b{font-weight:400;color:#FFC29B}
  .foot{position:absolute;bottom:52px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Barlow;font-weight:600;font-size:21px;letter-spacing:.38em;color:#FFF6EE;opacity:.88;text-shadow:0 1px 10px rgba(0,0,0,.5)}
  </style><div class="sky"></div><div class="img"><img src="file://${D}/${s.img}"></div><div class="glow"></div><div class="vig"></div>
  <div class="t"><div class="kick">${s.kick}</div><div class="big">${s.h}</div><div class="scr">${s.h2}</div></div><div class="sub2">${s.sub}</div>
  <div class="foot"><span>05 FILMS</span><span>SWIPE →</span></div>${grain(.2)}`;
}

function film(s, i) {
  const a = s.acc;
  return `<style>${fonts}${base}
  .board{position:absolute;inset:0;background:
     radial-gradient(ellipse 55% 35% at 30% 22%,rgba(255,255,255,.07),rgba(255,255,255,0) 70%),
     radial-gradient(ellipse 45% 30% at 75% 70%,rgba(255,255,255,.06),rgba(255,255,255,0) 70%),
     radial-gradient(ellipse at 50% 50%,#2C4238 0%,#22352D 60%,#18261F 100%)}
  .smudge{position:absolute;border-radius:50%;background:rgba(235,240,230,.05);filter:blur(30px)}
  .frame{position:absolute;inset:0;border:26px solid #6B4426;box-shadow:inset 0 0 0 4px #3E2614,inset 0 0 40px rgba(0,0,0,.55);
     border-image:linear-gradient(135deg,#7A5030,#5A3820 40%,#83583A 60%,#4E301A) 1}
  .tray{position:absolute;left:0;right:0;bottom:0;height:64px;background:linear-gradient(180deg,#8A5C38,#5C3A20 60%,#3E2614);box-shadow:0 -8px 18px rgba(0,0,0,.45)}
  .chalkp{position:absolute;bottom:30px;height:16px;border-radius:7px;box-shadow:0 2px 3px rgba(0,0,0,.4)}
  .eraser{position:absolute;bottom:26px;right:150px;width:170px;height:34px;border-radius:6px;background:linear-gradient(180deg,#C9A273 0 46%,#3a3a3a 46% 100%);box-shadow:0 3px 6px rgba(0,0,0,.5)}
  .ch{filter:url(#chalk)}
  .hdr{position:absolute;top:62px;left:76px;right:76px;display:flex;justify-content:space-between;align-items:baseline;color:rgba(240,240,232,.88)}
  .hdr .l{font-family:Barlow;font-weight:600;font-size:23px;letter-spacing:.38em}
  .hdr .r{font-family:Kalam;font-weight:400;font-size:34px}
  .still{position:absolute;left:86px;top:138px;width:908px;height:${s.h || 512}px;background:#F3F0E8;padding:14px;transform:rotate(-1.1deg);box-shadow:0 18px 40px rgba(0,0,0,.55)}
  .still div{width:100%;height:100%;background:url(file://${D}/${s.img}) ${s.x ?? 50}% ${s.y ?? 50}%/cover;filter:saturate(.9) contrast(1.03) sepia(.06)}
  .mag{position:absolute;width:44px;height:44px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff8 0,${a} 30%,${a} 60%,#0006 100%);box-shadow:0 5px 9px rgba(0,0,0,.5)}
  .tt{position:absolute;left:84px;right:76px;top:${(s.h || 512) + 196}px;color:#F4F3EC}
  .num{font-family:Kalam;font-weight:700;font-size:30px;color:${a}}
  .title{font-family:Sketch;font-weight:700;font-size:${s.fs || 100}px;line-height:.98;margin-top:2px;letter-spacing:.005em}
  .meta{font-family:Barlow;font-weight:600;font-size:23px;letter-spacing:.32em;margin-top:16px;color:rgba(240,240,232,.82)}
  .rule{width:300px;height:14px;margin-top:14px}
  .low{position:absolute;left:84px;width:560px;top:${(s.h || 512) + 470 + (s.lo || 0)}px;color:#F4F3EC}
  .who{font-family:Kalam;font-weight:300;font-size:29px;color:rgba(240,240,232,.78)}
  .name{font-family:Kalam;font-weight:700;font-size:54px;color:${a};line-height:1.05;margin-top:2px}
  .lesson{font-family:Kalam;font-weight:400;font-size:33px;line-height:1.28;margin-top:14px;color:#F1F0E8}
  .pol{position:absolute;right:78px;top:${(s.h || 512) + 440 + (s.lo || 0)}px;width:322px;background:#F6F3EA;padding:14px 14px 0;transform:rotate(4deg);box-shadow:0 14px 30px rgba(0,0,0,.55)}
  .pol div{width:294px;height:220px;background:url(file://${D}/${s.img2}) ${s.x2 ?? 50}% ${s.y2 ?? 50}%/cover;filter:saturate(.88) sepia(.08)}
  .pol p{font-family:Kalam;font-size:27px;color:#2C2A38;text-align:center;padding:8px 0 12px}
  .tape{position:absolute;top:-18px;left:110px;width:110px;height:36px;background:rgba(240,232,200,.72);transform:rotate(-5deg);box-shadow:0 1px 3px rgba(0,0,0,.2)}
  .star{position:absolute;right:52px;top:${(s.h || 512) + 395 + (s.lo || 0)}px;width:96px;height:96px;transform:rotate(14deg);filter:drop-shadow(0 4px 5px rgba(0,0,0,.45));z-index:3}
  </style>${chalkSVG}
  <div class="board"></div><div class="smudge" style="left:520px;top:900px;width:420px;height:140px"></div><div class="smudge" style="left:80px;top:40px;width:380px;height:90px"></div>
  <div class="hdr ch"><span class="l">LESSON Nº 0${i}</span><span class="r">the ones who believed in you</span></div>
  <div class="still"><div></div></div>
  <div class="mag" style="left:120px;top:122px"></div><div class="mag" style="left:930px;top:110px"></div>
  <div class="tt ch"><div class="title">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div>
    <svg class="rule" viewBox="0 0 300 14"><path d="M2 8 C40 2 70 13 110 7 S190 3 230 8 S280 10 298 5" stroke="${a}" stroke-width="4" fill="none" stroke-linecap="round"/></svg></div>
  <div class="low ch"><div class="who">the one who believed in you:</div><div class="name">${s.who}</div><div class="lesson">${s.ov}</div></div>
  <div class="pol"><div></div><p>${s.cap}</p><span class="tape"></span></div>
  <svg class="star" viewBox="0 0 100 100"><polygon points="50,4 62,36 96,38 69,59 79,93 50,73 21,93 31,59 4,38 38,36" fill="#E8B830" stroke="#B88A12" stroke-width="3"/><text x="50" y="60" font-family="Barlow" font-weight="600" font-size="11" text-anchor="middle" fill="#6A4A06" letter-spacing="1">A+</text></svg>
  <div class="frame"></div><div class="tray"></div>
  <div class="chalkp" style="left:90px;width:120px;background:#F2F0E6"></div><div class="chalkp" style="left:230px;width:80px;background:${a}"></div><div class="chalkp" style="left:330px;width:60px;background:#F2C9D6"></div>
  <div class="eraser"></div>${grain(.18)}`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  let n = 0;
  for (const s of S) {
    if (s.type === 'end') continue;
    const html = `<html><head><meta charset="utf-8"></head><body>${s.type === 'cover' ? cover(s) : film(s, n)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 }); n++;
  }
  await b.close();
})();
