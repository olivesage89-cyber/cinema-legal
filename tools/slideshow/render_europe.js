// "anime that make you want to run away to europe" — cover: extended-sky Milan rooftops; inside: VINTAGE TRAVEL-GUIDE PAGE
// Usage: node render_europe.js WORKDIR  (reads WORKDIR/slides.json, writes WORKDIR/out/*.jpg)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Fr', 'fraunces', 300, 'italic'), ff('Fr', 'fraunces', 400, 'italic'), ff('Fr', 'fraunces', 600), ff('Fr', 'fraunces', 700, 'italic'), ff('Fr', 'fraunces', 800, 'italic'),
  ff('Jo', 'josefin-sans', 400), ff('Jo', 'josefin-sans', 600), ff('Jo', 'josefin-sans', 700),
  ff('Cas', 'libre-caslon-text', 400, 'italic'), ff('Cas', 'libre-caslon-text', 400),
  ff('Fell', 'im-fell-english', 400, 'italic'), ff('Fell', 'im-fell-english', 400), ff('Beb', 'bebas-neue', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* ---------- cover ---------- */
.cv{background:var(--skyTop)}
.cv .sky{position:absolute;left:0;right:0;top:0;height:820px;background:linear-gradient(180deg,var(--skyTop) 0%,var(--skyMid) 55%,var(--skyLow) 100%)}
.cv .img{position:absolute;left:0;right:0;bottom:0;height:var(--ih);background:url(file://${D}/COVERIMG) var(--ix) 100%/cover no-repeat;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 var(--fade),#000 100%);filter:saturate(.86) contrast(.95) brightness(1.02) sepia(.08)}
.cv .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(20,30,60,.10),rgba(255,180,120,.07) 70%,rgba(60,30,20,.18));mix-blend-mode:soft-light}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 55%,rgba(0,0,0,.30) 100%)}
.cv .brand{position:absolute;top:44px;width:100%;text-align:center;font-family:Jo;font-weight:600;font-size:19px;letter-spacing:.62em;color:var(--cream);opacity:.85}
.cv .t{position:absolute;left:0;right:0;top:var(--ty);text-align:center;color:var(--cream);text-shadow:0 2px 26px rgba(10,25,60,.35)}
.cv .kick{font-family:Jo;font-weight:600;font-size:25px;letter-spacing:.38em;color:var(--ink);padding-left:.38em}
.cv .l1{font-family:Fr;font-style:italic;font-weight:300;font-size:78px;margin-top:20px;line-height:1}
.cv .hero{font-family:Fr;font-style:italic;font-weight:800;font-size:245px;line-height:.86;letter-spacing:-.02em;color:var(--ink);margin-top:-4px}
.cv .sub{font-family:Cas;font-style:italic;font-size:34px;margin-top:30px;line-height:1.35}
.cv .rule{width:120px;height:1.5px;background:var(--cream);opacity:.7;margin:30px auto 0}
.cv .swipe{position:absolute;bottom:52px;width:100%;text-align:center;font-family:Jo;font-weight:600;font-size:19px;letter-spacing:.45em;color:var(--cream);opacity:.92;text-shadow:0 1px 12px rgba(0,0,0,.5)}
/* ---------- guidebook page ---------- */
.pg{background:#EEE5D1;color:#25222B}
.pg .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(255,252,240,.55),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 62%,rgba(90,60,20,.20) 100%)}
.pg .b1{position:absolute;inset:34px;border:1.5px solid rgba(37,34,43,.55)}
.pg .b2{position:absolute;inset:42px;border:.8px solid rgba(37,34,43,.35)}
.pg .hd{position:absolute;top:70px;left:78px;right:78px;display:flex;justify-content:space-between;font-family:Jo;font-weight:600;font-size:17px;letter-spacing:.32em;color:rgba(37,34,43,.72)}
.pg .hd b{color:var(--acc);font-weight:700}
.pg .city{position:absolute;top:104px;left:0;right:0;text-align:center;font-family:Beb;font-size:var(--cs,168px);line-height:1;letter-spacing:.06em;color:var(--acc);padding-left:.06em}
.pg .coord{position:absolute;top:268px;left:0;right:0;text-align:center;font-family:Fell;font-style:italic;font-size:27px;color:rgba(37,34,43,.78)}
.pg .coord i{font-style:normal;letter-spacing:.12em;font-size:21px;margin:0 14px;color:var(--acc)}
.pg .plate{position:absolute;top:326px;left:78px;width:924px;height:540px;padding:9px;background:#F7F1E3;box-shadow:0 1px 0 rgba(0,0,0,.15),0 10px 30px rgba(60,40,10,.18);border:1px solid rgba(37,34,43,.45)}
.pg .plate div{width:100%;height:100%;background-size:cover;background-position:var(--px) var(--py);filter:saturate(.88) contrast(.96) sepia(.10) brightness(1.02)}
.pg .inset{position:absolute;top:722px;right:56px;width:250px;height:250px;padding:8px;background:#F7F1E3;transform:rotate(4deg);box-shadow:0 12px 26px rgba(40,25,5,.32);border:1px solid rgba(37,34,43,.3)}
.pg .inset div{width:100%;height:100%;background-size:cover;background-position:var(--qx) 50%;filter:saturate(.88) sepia(.1)}
.pg .cap{position:absolute;top:882px;left:80px;width:640px;font-family:Fell;font-style:italic;font-size:23px;color:rgba(37,34,43,.75)}
.pg .cap span{font-style:normal;letter-spacing:.1em}
.pg .ttl{position:absolute;top:996px;left:80px;right:80px;font-family:Fr;font-weight:600;font-size:var(--ts,66px);line-height:1.02;letter-spacing:-.01em}
.pg .meta{position:absolute;top:var(--my,1082px);left:82px;font-family:Jo;font-weight:600;font-size:20px;letter-spacing:.3em;color:var(--acc)}
.pg .line{position:absolute;top:var(--ly,1126px);left:80px;right:110px;font-family:Cas;font-style:italic;font-size:31px;line-height:1.42;color:rgba(37,34,43,.9)}
.pg .ft{position:absolute;bottom:70px;left:80px;right:80px;display:flex;justify-content:space-between;align-items:center;font-family:Jo;font-weight:600;font-size:16px;letter-spacing:.3em;color:rgba(37,34,43,.6);border-top:1px solid rgba(37,34,43,.3);padding-top:16px}
.pg .ft b{color:#25222B;font-weight:700}
.pg .dots span{display:inline-block;width:9px;height:9px;border-radius:50%;border:1.3px solid rgba(37,34,43,.6);margin-left:8px}
.pg .dots span.on{background:var(--acc);border-color:var(--acc)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const roman = ['I', 'II', 'III', 'IV', 'V'];
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let html;
    if (s.type === 'cover') {
      const c = css.replace('COVERIMG', s.img);
      html = `<html><head><style>${c}</style></head><body class="cv" style="--skyTop:${s.skyTop};--skyMid:${s.skyMid};--skyLow:${s.skyLow};--ih:${s.ih}px;--ix:${s.ix}%;--fade:${s.fade}px;--ty:${s.ty}px;--cream:${s.cream};--ink:${s.ink}">
      <div class="sky"></div><div class="img"></div><div class="warm"></div><div class="vig"></div>
      <div class="brand">CINEMA</div>
      <div class="t"><div class="kick">${s.kick}</div><div class="l1">${s.l1}</div><div class="hero">${s.hero}</div><div class="sub">${s.sub}</div></div>
      <div class="swipe">PACK A BAG &nbsp;—&nbsp; SWIPE →</div><div class="grain"></div></body></html>`;
    } else {
      const k = i; // 1..5
      const dots = [1, 2, 3, 4, 5].map(n => `<span class="${n === k ? 'on' : ''}"></span>`).join('');
      html = `<html><head><style>${css}</style></head><body class="pg" style="--acc:${s.acc};--px:${s.px ?? 50}%;--py:${s.py ?? 50}%;--qx:${s.qx ?? 50}%;${s.vars || ''}">
      <div class="paper"></div><div class="b1"></div><div class="b2"></div>
      <div class="hd"><span>A TRAVELLER'S GUIDE TO <b>ANIME EUROPE</b></span><span>Nº 0${k} / 05</span></div>
      <div class="city">${s.city}</div>
      <div class="coord">${s.coord}</div>
      <div class="plate"><div style="background-image:url(file://${D}/${s.img})"></div></div>
      <div class="inset"><div style="background-image:url(file://${D}/${s.img2})"></div></div>
      <div class="cap"><span>PLATE ${roman[k - 1]}.</span> — ${s.cap}</div>
      <div class="ttl">${s.t}</div>
      <div class="meta">${s.meta}</div>
      <div class="line">${s.ov}</div>
      <div class="ft"><span>BEST SEEN &nbsp;<b>${s.best}</b></span><span class="dots">${dots}</span></div>
      <div class="grain" style="opacity:.16"></div></body></html>`;
    }
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
