// "anime about the quiet after the end of the world" — cover: deep-indigo Cormorant italic on the pale dawn sky of
// Land of the Lustrous (ink-on-light, no dark shade); inside: RECOVERED ARCHIVE (dark slate page tinted per film,
// IBM Plex Mono record header, big still in hairline frame w/ crop marks + timecode, signal-bar progress, Cormorant title)
// Usage: node render_quietend.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Cor', 'cormorant-garamond', 300, 'italic'), ff('Cor', 'cormorant-garamond', 400, 'italic'), ff('Cor', 'cormorant-garamond', 500, 'italic'),
  ff('Cor', 'cormorant-garamond', 500), ff('Cor', 'cormorant-garamond', 600),
  ff('Plex', 'ibm-plex-mono', 400), ff('Plex', 'ibm-plex-mono', 500),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.15;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#E9E6D6;color:var(--ink)}
.cv .sky{position:absolute;inset:0;background:linear-gradient(180deg,#BFCFC9 0%,#CFDDD2 30%,#D9E8D5 52%,#DCE9D2 100%)}
.cv .img{position:absolute;left:0;right:0;bottom:0;height:var(--ih,1000px);background:url(file://${D}/COVERIMG) var(--ix,46%) 100%/auto 100% no-repeat;filter:saturate(.95) contrast(.98) sepia(.06);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 240px,#000 100%)}
.cv .tone{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,244,214,.38) 0%,rgba(255,244,214,.10) 34%,rgba(0,0,0,0) 50%,rgba(20,24,60,.10) 80%,rgba(14,18,48,.38) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 58%,rgba(30,30,70,.22) 100%)}
.cv .brand{position:absolute;top:50px;width:100%;text-align:center;font-family:Plex;font-weight:500;font-size:17px;letter-spacing:.62em;padding-left:.62em;opacity:.72}
.cv .t{position:absolute;top:var(--ty,128px);left:0;right:0;text-align:center}
.cv .kick{font-family:Plex;font-weight:500;font-size:22px;letter-spacing:.5em;padding-left:.5em;opacity:.85}
.cv .hero{font-family:Cor;font-style:italic;font-weight:400;font-size:178px;line-height:.86;letter-spacing:-.02em;margin-top:26px}
.cv .hero span{color:var(--acc)}
.cv .h2{font-family:Cor;font-weight:600;font-size:44px;letter-spacing:.36em;padding-left:.34em;margin-top:26px}
.cv .rule{width:120px;height:1.5px;background:var(--ink);opacity:.5;margin:30px auto 0}
.cv .sub{font-family:Cor;font-style:italic;font-weight:500;font-size:36px;line-height:1.28;margin-top:24px;opacity:.92}
.cv .swipe{position:absolute;bottom:54px;width:100%;text-align:center;font-family:Plex;font-weight:500;font-size:17px;letter-spacing:.5em;padding-left:.5em;color:var(--ink);opacity:.75}
/* archive page */
.pg{color:#EDE8DC;background:radial-gradient(ellipse at 50% 30%,var(--t1) 0%,var(--t2) 70%)}
.pg .scan{position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(255,255,255,.018) 0 2px,rgba(0,0,0,0) 2px 5px)}
.pg .hd{position:absolute;top:60px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Plex;font-weight:500;font-size:18px;letter-spacing:.24em;opacity:.85}
.pg .hd b{color:var(--acc);font-weight:500}
.pg .sub2{position:absolute;top:96px;left:70px;right:70px;font-family:Plex;font-size:15px;letter-spacing:.2em;opacity:.5;border-top:1px solid rgba(237,232,220,.22);padding-top:12px;display:flex;justify-content:space-between}
.pg .fr{position:absolute;top:160px;left:70px;width:940px;height:640px;padding:14px;border:1px solid rgba(237,232,220,.35)}
.pg .fr .im{width:100%;height:100%;background-size:cover;background-position:var(--px) var(--py);filter:saturate(.9) contrast(.98)}
.pg .fr .tc{position:absolute;bottom:28px;right:30px;font-family:Plex;font-size:15px;letter-spacing:.16em;color:#fff;opacity:.85;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.pg .fr .rec{position:absolute;top:28px;left:30px;font-family:Plex;font-size:15px;letter-spacing:.16em;color:#fff;opacity:.85;text-shadow:0 1px 6px rgba(0,0,0,.7)}
.pg .fr .rec i{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--acc);margin-right:10px;vertical-align:1px}
.pg .cm{position:absolute;width:26px;height:26px;border-color:var(--acc);border-style:solid;opacity:.95}
.pg .sig{position:absolute;top:838px;left:70px;display:flex;align-items:flex-end;gap:7px;height:30px}
.pg .sig i{display:block;width:9px;background:rgba(237,232,220,.25)}
.pg .sig i.on{background:var(--acc)}
.pg .sigt{position:absolute;top:846px;left:150px;font-family:Plex;font-size:15px;letter-spacing:.22em;opacity:.6}
.pg .ttl{position:absolute;top:900px;left:68px;right:70px;font-family:Cor;font-weight:600;font-size:var(--ts,92px);line-height:.95;letter-spacing:-.01em}
.pg .meta{position:absolute;top:var(--my,1012px);left:72px;font-family:Plex;font-weight:500;font-size:18px;letter-spacing:.24em;color:var(--acc)}
.pg .line{position:absolute;top:var(--ly,1066px);left:70px;right:100px;font-family:Cor;font-style:italic;font-weight:500;font-size:42px;line-height:1.22;opacity:.95}
.pg .ft{position:absolute;bottom:58px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Plex;font-weight:500;font-size:15px;letter-spacing:.26em;opacity:.55;border-top:1px solid rgba(237,232,220,.22);padding-top:14px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const marks = () => {
  const L = 70 - 9, T = 160 - 9, R = 70 + 940 - 17, B = 160 + 640 - 17;
  return `<div class="cm" style="left:${L}px;top:${T}px;border-width:2px 0 0 2px"></div><div class="cm" style="left:${R}px;top:${T}px;border-width:2px 2px 0 0"></div>
  <div class="cm" style="left:${L}px;top:${B}px;border-width:0 0 2px 2px"></div><div class="cm" style="left:${R}px;top:${B}px;border-width:0 2px 2px 0"></div>`;
};
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let html;
    if (s.type === 'cover') {
      html = `<html><head><style>${css.replace('COVERIMG', s.img)}</style></head><body class="cv" style="--ink:${s.ink};--acc:${s.acc};${s.vars || ''}">
      <div class="sky"></div><div class="img"></div><div class="tone"></div><div class="vig"></div>
      <div class="brand">CINEMA</div>
      <div class="t"><div class="kick">${s.kick}</div><div class="hero">${s.hero}</div><div class="h2">${s.h2}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
      <div class="swipe">${s.swipe}</div><div class="grain"></div></body></html>`;
    } else {
      const k = i;
      const bars = [0, 1, 2, 3, 4].map(n => `<i class="${n < k ? 'on' : ''}" style="height:${10 + n * 5}px"></i>`).join('');
      html = `<html><head><style>${css}</style></head><body class="pg" style="--t1:${s.t1};--t2:${s.t2};--acc:${s.acc};--px:${s.px ?? 50}%;--py:${s.py ?? 50}%;${s.vars || ''}">
      <div class="scan"></div>
      <div class="hd"><span>RECOVERED ARCHIVE · <b>AFTER THE END</b></span><span>RECORD 0${k} / 05</span></div>
      <div class="sub2"><span>${s.loc}</span><span>${s.kind}</span></div>
      <div class="fr"><div class="im" style="background-image:url(file://${D}/${s.img})"></div><div class="rec"><i></i>REC</div><div class="tc">${s.tc}</div></div>${marks()}
      <div class="sig">${bars}</div><div class="sigt">SIGNAL ${k}/5 · ${s.sig}</div>
      <div class="ttl">${s.t}</div>
      <div class="meta">${s.meta}</div>
      <div class="line">${s.ov}</div>
      <div class="ft"><span>CINEMA</span><span>${k < 5 ? 'NEXT RECORD →' : 'END OF ARCHIVE →'}</span></div>
      <div class="grain" style="opacity:.12"></div></body></html>`;
    }
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
