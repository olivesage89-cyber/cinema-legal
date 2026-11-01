// "New York in the fall" — cover: full-bleed Central Park still, Playfair 900 italic + Mrs Saint Delafield script.
// Inside: MAGAZINE (off-white paper, giant League Gothic title in per-film accent, EB Garamond paragraph,
// white-bordered inset still, big still across the bottom with a location caption).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Play', 'playfair-display', 900, 'italic'), ff('Play', 'playfair-display', 700, 'italic'),
  ff('Dela', 'mrs-saint-delafield', 400), ff('LG', 'league-gothic', 400),
  ff('Gar', 'eb-garamond', 400), ff('Gar', 'eb-garamond', 400, 'italic'), ff('Gar', 'eb-garamond', 600), ff('Gar', 'eb-garamond', 500, 'italic'),
  ff('Inter', 'inter', 500), ff('Inter', 'inter', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#1b110a}
.cv .bg{position:absolute;left:0;bottom:0;width:100%;height:var(--bh,1040px);object-fit:cover;filter:saturate(1.02) contrast(1.0) brightness(1.16) sepia(.08);-webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 160px,#000 430px)}
.cv .top{position:absolute;left:0;right:0;top:0;height:900px;background:linear-gradient(180deg,rgba(27,17,10,.45) 0%,rgba(27,17,10,.3) 45%,rgba(27,17,10,0) 75%)}
.cv .bot{position:absolute;left:0;right:0;bottom:0;height:34%;background:linear-gradient(0deg,rgba(26,14,8,.78),rgba(26,14,8,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.cv .ttl{position:absolute;left:0;right:0;top:92px;text-align:center;color:#F5EBDD;text-shadow:0 3px 30px rgba(0,0,0,.45)}
.cv .kick{font-family:Inter;font-weight:600;font-size:21px;letter-spacing:.52em;opacity:.92;padding-left:.52em}
.cv .ny{font-family:Play;font-weight:900;font-style:italic;font-size:218px;line-height:.9;letter-spacing:-.01em;margin-top:30px}
.cv .fall{font-family:Dela;font-size:178px;line-height:1;color:var(--acc);margin-top:-40px;margin-left:330px;transform:rotate(-5deg);text-shadow:0 2px 24px rgba(0,0,0,.5)}
.cv .sub{position:absolute;left:0;right:0;bottom:96px;text-align:center;color:#F5EBDD;font-family:Gar;font-style:italic;font-weight:500;font-size:44px;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.cv .rule{width:70px;height:2px;background:var(--acc);margin:0 auto 22px}
.cv .swipe{position:absolute;bottom:46px;width:100%;text-align:center;font-family:Inter;font-weight:500;font-size:17px;letter-spacing:.42em;color:#F5EBDD;opacity:.75}
/* magazine */
.mg{background:#F3EEE4}
.mg .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.55),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(170,150,120,.16),rgba(0,0,0,0) 60%)}
.mg .hdr{position:absolute;left:64px;right:64px;top:50px;display:flex;justify-content:space-between;font-family:Inter;font-weight:600;font-size:15px;letter-spacing:.38em;color:#2a2622}
.mg .hr{position:absolute;left:64px;right:64px;top:84px;height:1.5px;background:#2a2622}
.mg .hr2{position:absolute;left:64px;right:64px;top:89px;height:.8px;background:#2a2622;opacity:.6}
.mg .title{position:absolute;left:58px;top:112px;width:620px;font-family:LG;text-transform:uppercase;line-height:.86;color:var(--acc)}
.mg .dir{position:absolute;left:64px;width:600px;font-family:Inter;font-weight:600;font-size:16px;letter-spacing:.3em;color:#2a2622}
.mg .dir em{font-style:normal;color:var(--acc)}
.mg .para{position:absolute;left:64px;width:590px;font-family:Gar;font-size:28px;line-height:1.36;color:#2a2622;text-align:left}
.mg .para b{font-weight:600;color:#1a1714}
.mg .para:first-letter{font-family:LG;float:left;font-size:122px;line-height:.78;padding:8px 12px 0 0;color:var(--acc)}
.mg .inset{position:absolute;right:64px;top:118px;width:300px;height:400px;background:#fff;padding:10px;box-shadow:0 10px 28px rgba(40,30,20,.22),0 2px 5px rgba(40,30,20,.15);transform:rotate(1.6deg)}
.mg .inset div{width:100%;height:100%;background-size:cover;filter:saturate(.92) contrast(.96) sepia(.08)}
.mg .big{position:absolute;left:64px;right:64px;top:640px;height:610px;background-size:cover;filter:saturate(.92) contrast(.97) sepia(.08)}
.mg .cap{position:absolute;left:64px;right:64px;top:1268px;display:flex;justify-content:space-between;font-family:Gar;font-style:italic;font-size:22px;color:#4a433b}
.mg .cap span:last-child{font-family:Inter;font-style:normal;font-weight:600;font-size:14px;letter-spacing:.35em;color:var(--acc);padding-top:5px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    if (s.type === 'end') continue;
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<img class="bg" src="file://${D}/${s.img}" style="--bh:${s.bh||1040}px;object-position:${s.x}% ${s.y ?? 50}%"><div class="top"></div><div class="bot"></div><div class="vig"></div>
      <div class="ttl" style="--acc:${s.acc}"><div class="kick">${s.kick}</div><div class="ny">${s.h}</div><div class="fall">${s.h2}</div></div>
      <div class="sub" style="--acc:${s.acc}"><div class="rule"></div>${s.sub}</div><div class="swipe">SWIPE →</div>`;
    } else {
      cls = 'mg';
      const lines = s.t.split('<br>').length;
      const tH = s.tfs * 0.86 * lines;
      const dirTop = 112 + tH + 22, paraTop = dirTop + 50;
      body = `<div class="paper"></div><div class="hdr"><span>NEW YORK IN THE FALL</span><span>Nº ${s.n} / 05</span></div><div class="hr"></div><div class="hr2"></div>
      <div class="title" style="font-size:${s.tfs}px">${s.t}</div>
      <div class="dir" style="top:${dirTop}px;${s.dirls ? 'letter-spacing:' + s.dirls + ';width:700px' : ''}">${s.dirlabel || 'DIRECTED BY'} ${s.dir.toUpperCase()} · <em>${s.yr}</em></div>
      <div class="para" style="top:${paraTop}px;${s.pw ? 'width:' + s.pw + 'px' : ''}">${s.ov}</div>
      <div class="inset"><div style="background-image:url(file://${D}/${s.inset});background-position:${s.ix ?? 50}% ${s.iy ?? 50}%"></div></div>
      <div class="big" style="background-image:url(file://${D}/${s.img});background-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      <div class="cap"><span>${s.cap}</span><span>${s.tag}</span></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
