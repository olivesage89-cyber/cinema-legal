// "walking & talking all night" — cover: Before Sunrise couple on the lamplit Vienna balustrade at night; cream Yellowtail 'talking' over giant periwinkle Playfair 900 ALL NIGHT.
// inside: SUBTITLES (per-film night page, big still w/ SDH-style bracketed caption, Courier header w/ place, tilted white print 2nd still, Playfair title, topics line, moon→sun night bar)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PERI = '#B8B2FF', CREAM = '#FFF4E4';
const css = [ff('YT', 'yellowtail', 400), ff('PF', 'playfair-display', 900), ff('PF', 'playfair-display', 700), ff('PF', 'playfair-display', 400, 'italic'), ff('PF', 'playfair-display', 700, 'italic'),
  ff('CP', 'courier-prime', 400), ff('CP', 'courier-prime', 700), ff('LC', 'libre-caslon-text', 400, 'italic'), ff('LC', 'libre-caslon-text', 400), ff('SG', 'space-grotesk', 500)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#07080C;font-family:LC}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.16;mix-blend-mode:overlay;background-image:${GR};pointer-events:none;z-index:50}
/* COVER */
.cv .img{position:absolute;height:1400px;top:-70px;filter:saturate(1.05) contrast(1.06) brightness(.97)}
.cv .shadeT{position:absolute;left:0;right:0;top:0;height:260px;background:linear-gradient(180deg,rgba(7,8,12,.55),rgba(7,8,12,0))}
.cv .shadeB{position:absolute;left:0;right:0;bottom:0;height:700px;background:linear-gradient(0deg,rgba(7,8,12,.97) 0%,rgba(7,8,12,.9) 36%,rgba(7,8,12,.45) 66%,rgba(7,8,12,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 50%,rgba(0,0,0,.5) 100%)}
.cv .kick{position:absolute;top:888px;width:100%;text-align:center;font-family:SG;font-weight:500;font-size:25px;letter-spacing:.46em;padding-left:.46em;color:${CREAM};opacity:.9}
.cv .h{position:absolute;top:905px;left:0;width:100%;text-align:center;font-family:YT;font-size:150px;line-height:1;color:${CREAM};transform:rotate(-6deg) translateX(-150px);z-index:3;text-shadow:0 4px 22px rgba(0,0,0,.6)}
.cv .h2{position:absolute;top:1010px;width:100%;text-align:center;font-family:PF;font-weight:900;font-size:176px;line-height:1;letter-spacing:.02em;color:${PERI};text-shadow:0 0 40px rgba(150,140,255,.28),0 6px 24px rgba(0,0,0,.6)}
.cv .sub{position:absolute;top:1212px;width:100%;text-align:center;font-family:LC;font-style:italic;font-size:35px;color:#EDE6DA}
.cv .sub b{font-weight:400;color:${PERI}}
.cv .ft{position:absolute;top:1278px;width:100%;text-align:center;font-family:CP;font-size:19px;letter-spacing:.34em;padding-left:.34em;color:rgba(255,244,228,.62)}
/* INSIDE */
.mv{background:var(--bg)}
.mv .hdr{position:absolute;top:50px;left:56px;right:56px;display:flex;justify-content:space-between;align-items:baseline;font-family:CP;font-weight:700;font-size:21px;letter-spacing:.26em;color:rgba(255,244,228,.62)}
.mv .hdr b{color:var(--ac)}
.mv .hdr .mid{font-family:YT;font-weight:400;font-size:40px;letter-spacing:0;color:${CREAM};opacity:.92}
.mv .shot{position:absolute;left:0;top:112px;width:1080px;height:640px;overflow:hidden;background:#000}
.mv .shot img{width:100%;height:100%;object-fit:cover;filter:saturate(.95) contrast(1.05)}
.mv .shot:after{content:'';position:absolute;inset:0;background:linear-gradient(0deg,rgba(0,0,0,.55),rgba(0,0,0,0) 30%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.3))}
.mv .cap{position:absolute;left:0;right:0;top:672px;text-align:center;z-index:3;font-family:CP;font-size:29px;color:#FFF;text-shadow:0 0 6px #000,0 2px 3px #000,0 0 14px rgba(0,0,0,.8)}
.mv .print{position:absolute;left:62px;top:800px;width:400px;height:300px;padding:14px 14px 52px;background:#F4EFE6;transform:rotate(-3.5deg);box-shadow:0 22px 44px rgba(0,0,0,.55)}
.mv .print img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9)}
.mv .print span{position:absolute;bottom:10px;left:0;right:0;text-align:center;font-family:YT;font-size:30px;color:#3A3540}
.mv .blk{position:absolute;left:510px;right:52px;top:800px}
.mv .no{font-family:SG;font-weight:500;font-size:20px;letter-spacing:.3em;color:var(--ac)}
.mv .tt{font-family:PF;font-weight:700;font-size:var(--fs,104px);line-height:.98;color:${CREAM};margin-top:14px;letter-spacing:-.01em}
.mv .meta{font-family:CP;font-weight:700;font-size:20px;letter-spacing:.16em;color:var(--ac);margin-top:20px}
.mv .ln{font-family:LC;font-style:italic;font-size:31px;line-height:1.28;color:#E6DFD3;margin-top:18px}
.mv .tp{position:absolute;left:62px;right:56px;top:1222px;font-family:CP;font-size:21px;letter-spacing:.12em;color:rgba(255,244,228,.7)}
.mv .tp b{color:var(--ac);font-weight:700;letter-spacing:.24em}
.mv .bar{position:absolute;left:62px;right:56px;bottom:40px;height:34px;display:flex;align-items:center;gap:18px}
.mv .bar .tr{flex:1;height:2px;background:repeating-linear-gradient(90deg,rgba(255,244,228,.35) 0 8px,transparent 8px 16px);position:relative}
.mv .bar .fill{position:absolute;left:0;top:0;height:2px;background:var(--ac)}
.mv .bar .pt{position:absolute;top:-7px;width:16px;height:16px;border-radius:50%;background:var(--ac);box-shadow:0 0 14px var(--ac);margin-left:-8px}
.mv .bar span{font-family:CP;font-size:18px;letter-spacing:.2em;color:rgba(255,244,228,.6)}
`;
const moon = `<svg width="26" height="26" viewBox="0 0 26 26"><path d="M17 3a10 10 0 1 0 6 16A8 8 0 0 1 17 3z" fill="none" stroke="rgba(255,244,228,.7)" stroke-width="2"/></svg>`;
const sun = `<svg width="30" height="30" viewBox="0 0 30 30"><circle cx="15" cy="15" r="5.5" fill="none" stroke="rgba(255,244,228,.7)" stroke-width="2"/>${[0,45,90,135,180,225,270,315].map(a=>`<line x1="15" y1="3" x2="15" y2="7" stroke="rgba(255,244,228,.7)" stroke-width="2" stroke-linecap="round" transform="rotate(${a} 15 15)"/>`).join('')}</svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let cls, body;
    if (s.type === 'cover') {
      cls = 'cv'; const w = 1400 * 16 / 9;
      body = `<img class="img" src="file://${D}/${s.img}" style="left:-${Math.round(w * s.cx / 100 - 540)}px">
      <div class="shadeT"></div><div class="shadeB"></div><div class="vig"></div>
      <div class="kick">MOVIES THAT FEEL LIKE</div><div class="h">talking</div><div class="h2">ALL NIGHT</div>
      <div class="sub">strangers, city streets &amp; <b>a conversation that never ends</b></div><div class="ft">5 FILMS · TILL SUNRISE · SWIPE</div>`;
    } else {
      cls = 'mv'; const pct = [10, 30, 52, 74, 94][s.n - 1];
      body = `<div class="hdr"><span>Nº <b>0${s.n}</b> / 05</span><span class="mid">talking all night</span><span><b>${s.place}</b></span></div>
      <div class="shot"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y}%"></div><div class="cap">${s.cap}</div>
      <div class="print"><img src="file://${D}/${s.img2}" style="object-position:${s.x2}% 50%"><span>${s.place.toLowerCase()}</span></div>
      <div class="blk"><div class="no">FILM 0${s.n}</div><div class="tt">${s.t}</div><div class="meta">DIR. ${s.dir.toUpperCase()} · ${s.yr}</div><div class="ln">${s.ov}</div></div>
      <div class="tp"><b>TALKED ABOUT:</b> ${s.topics}</div>
      <div class="bar">${moon}<div class="tr"><div class="fill" style="width:${pct}%"></div><div class="pt" style="left:${pct}%"></div></div>${sun}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--ac:${s.ac || PERI};--bg:${s.bg || '#07080C'};--fs:${s.fs || 104}px">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
