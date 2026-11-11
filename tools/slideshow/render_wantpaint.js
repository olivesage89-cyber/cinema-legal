// "movies that make you want to paint" — cover: Turner gold full-bleed w/ ultramarine signature script;
// inside: COLOUR STUDY (raw linen canvas page, taped study still + taped inset, Libre Caslon title in per-film ink,
// painted palette dabs sampled from the frame w/ Caveat pencil names).
// Usage: node render_wantpaint.js WORKDIR  (WORKDIR/slides.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grainSvg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const linenSvg = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='l'><feTurbulence type='fractalNoise' baseFrequency='.012 .9' numOctaves='2' seed='3'/><feColorMatrix type='saturate' values='0'/></filter><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='.9 .012' numOctaves='2' seed='8'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23l)' opacity='.55'/><rect width='100%' height='100%' filter='url(%23m)' opacity='.45'/></svg>")`;
const css = [
  ff('Sig', 'mrs-saint-delafield', 400), ff('Marc', 'marcellus', 400),
  ff('DMS', 'dm-sans', 500), ff('DMS', 'dm-sans', 600), ff('DMS', 'dm-sans', 700),
  ff('EBG', 'eb-garamond', 400, 'italic'), ff('EBG', 'eb-garamond', 500, 'italic'), ff('EBG', 'eb-garamond', 600, 'italic'),
  ff('Cas', 'libre-caslon-display', 400), ff('Cav', 'caveat', 500), ff('Cav', 'caveat', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grainSvg};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 55%,rgba(40,20,0,.32) 100%)}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(.95) brightness(1.02) sepia(.08)}
.cv .lift{position:absolute;left:0;right:0;top:0;height:700px;background:radial-gradient(ellipse 70% 60% at 50% 40%,rgba(255,236,190,.42),rgba(255,236,190,0) 70%)}
.cv .txt{position:absolute;left:60px;right:60px;top:64px;text-align:center;color:var(--ink)}
.cv .brand{font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.62em;opacity:.78;margin-left:.62em}
.cv .kick{font-family:DMS;font-weight:600;font-size:27px;letter-spacing:.34em;margin:58px 0 0 .34em}
.cv .sig{font-family:Sig;font-size:330px;line-height:.8;margin:6px 0 -14px -30px;letter-spacing:-.01em;text-shadow:0 0 30px rgba(255,240,205,.35)}
.cv .rule{width:120px;height:2px;background:var(--ink);opacity:.7;margin:34px auto 22px}
.cv .sub{font-family:EBG;font-style:italic;font-weight:500;font-size:43px;line-height:1.2}
.cv .foot{position:absolute;bottom:52px;width:100%;text-align:center;font-family:Marc;font-size:24px;letter-spacing:.4em;color:#FFF3DA;text-shadow:0 1px 12px rgba(0,0,0,.45)}
.st{background:#ECE4D3}
.st .linen{position:absolute;inset:0;background-image:${linenSvg};mix-blend-mode:multiply;opacity:.38}
.st .tone{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,252,240,.5),rgba(150,120,80,.18) 100%)}
.st .hdr{position:absolute;top:50px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:DMS;font-weight:600;font-size:18px;letter-spacing:.3em;color:#3A332B}
.st .hdr b{color:var(--ink);font-weight:700}
.st .main{position:absolute;left:60px;top:112px;width:960px;height:560px;transform:rotate(-.7deg);background:#fff;padding:14px;box-shadow:0 18px 34px rgba(60,40,15,.28),0 3px 6px rgba(60,40,15,.18)}
.st .main img,.st .ins img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92) contrast(.96) sepia(.06)}
.st .ins{position:absolute;right:58px;top:600px;width:390px;height:250px;transform:rotate(2.6deg);background:#fff;padding:11px;box-shadow:0 16px 28px rgba(60,40,15,.32),0 2px 5px rgba(60,40,15,.2)}
.tape{position:absolute;width:150px;height:44px;background:rgba(236,222,186,.82);box-shadow:0 1px 3px rgba(0,0,0,.12)}
.tape:after{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 3px,rgba(0,0,0,.03) 3px 6px)}
.st .tl{left:-46px;top:-14px;transform:rotate(-38deg)} .st .tr{left:-40px;bottom:-12px;transform:rotate(40deg)}
.st .ti{left:50%;top:-24px;margin-left:-60px;width:120px;transform:rotate(-4deg)}
.st .title{position:absolute;left:68px;top:722px;width:560px;font-family:Cas;font-size:var(--fs,76px);line-height:.98;color:var(--ink);letter-spacing:-.005em}
.st .meta{position:absolute;left:70px;top:var(--my,900px);font-family:DMS;font-weight:600;font-size:19px;letter-spacing:.26em;color:#4A4136}
.st .line{position:absolute;left:68px;top:calc(var(--my,900px) + 42px);width:560px;font-family:EBG;font-style:italic;font-weight:500;font-size:35px;line-height:1.22;color:#2E2822}
.st .pal{position:absolute;left:64px;right:64px;top:1112px;display:flex;justify-content:space-between;align-items:flex-start}
.st .pl{position:absolute;left:70px;top:1062px;font-family:Cav;font-weight:600;font-size:34px;color:#5A4F42;transform:rotate(-1.5deg)}
.dab{width:170px;text-align:center}
.dab svg{display:block;margin:0 auto;filter:drop-shadow(0 1px 1.2px rgba(70,50,20,.28)) drop-shadow(0 4px 8px rgba(70,50,20,.10))}
.dab span{display:block;font-family:Cav;font-weight:500;font-size:28px;color:#4E453A;margin-top:4px;white-space:nowrap}
.st .pg{position:absolute;bottom:40px;right:64px;font-family:DMS;font-weight:600;font-size:17px;letter-spacing:.3em;color:#6A5F52}
.st .pgl{position:absolute;bottom:40px;left:64px;font-family:DMS;font-weight:700;font-size:17px;letter-spacing:.5em;color:#6A5F52}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const dab = (c, i) => {
  const seed = 3 + i * 7;
  return `<svg width="150" height="120" viewBox="0 0 150 120"><defs><filter id="d${i}" x="-20%" y="-20%" width="140%" height="140%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="2" seed="${seed}"/><feDisplacementMap in="SourceGraphic" scale="22"/></filter>
  <filter id="b${i}"><feTurbulence type="fractalNoise" baseFrequency=".02 .6" numOctaves="2" seed="${seed + 1}"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 -1.1 .95"/><feComposite in2="SourceGraphic" operator="in"/></filter></defs>
  <g filter="url(#d${i})"><ellipse cx="75" cy="60" rx="58" ry="44" fill="${c}" transform="rotate(${-12 + i * 6} 75 60)"/></g>
  <g filter="url(#b${i})" opacity=".35"><ellipse cx="75" cy="60" rx="54" ry="40" fill="#fff" transform="rotate(${-12 + i * 6} 75 60)"/></g></svg>`;
};
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="cv" style="--ink:${s.ink}"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="lift"></div><div class="vig"></div>
      <div class="txt"><div class="brand">CINEMA</div><div class="kick">${s.kick}</div><div class="sig">${s.h}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
      <div class="grain"></div></div>`;
    } else {
      body = `<div class="st" style="position:absolute;inset:0;--ink:${s.ink};--fs:${s.fs || 76}px;--my:${s.my || 900}px"><div class="linen"></div><div class="tone"></div>
      <div class="hdr"><span>STUDY <b>Nº 0${s.n}</b> / 05</span><span>A WATCHLIST IN OILS</span></div>
      <div class="main"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"><div class="tape tl"></div><div class="tape tr"></div></div>
      <div class="ins"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"><div class="tape ti"></div></div>
      <div class="title">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()}</div><div class="line">${s.ov}</div>
      <div class="pl">the palette, taken from the frame —</div>
      <div class="pal">${s.pal.map((c, i) => `<div class="dab">${dab(c[0], i)}<span>${c[1]}</span></div>`).join('')}</div>
      <div class="pgl">CINEMA</div><div class="pg">SWIPE →</div><div class="grain" style="opacity:.14"></div></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
