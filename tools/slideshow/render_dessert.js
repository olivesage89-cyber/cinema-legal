// "DESSERT MENU" look — cover: Wonka chocolate-river still under a dark-chocolate band with SVG chocolate drips,
// Leckerli One lemon-sherbet script + Outfit spaced kicker + Playfair italic sub.
// Inside: pastel macaron-coloured paper per film, still in an arched patisserie window, Playfair title in per-film ink,
// menu line with dotted leader ("flavour ...... x"), scalloped cake-box edge at the bottom.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const noise = (o, f = .9) => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${o}'/></svg>")`;
const CH = '#2A140B';
// chocolate drips: band bottom at y=0 of svg, drips hang down
const drips = (() => {
  const d = [[0, 20], [60, 70], [118, 26], [170, 118], [232, 34], [300, 82], [356, 22], [410, 150], [470, 40], [530, 64], [585, 24], [640, 104],
    [700, 30], [752, 168], [812, 46], [870, 76], [925, 26], [980, 122], [1040, 36], [1080, 24]];
  let p = `M0 0 L0 ${d[0][1]}`;
  for (let i = 1; i < d.length; i++) {
    const [x0, h0] = d[i - 1], [x, h] = d[i], mx = (x0 + x) / 2;
    if (h > 60) { // a long drip with a round bulb
      const w = 15;
      p += ` C${mx} ${h0} ${x - w - 10} 18 ${x - w} ${h - 22} C${x - w} ${h + 6} ${x + w} ${h + 6} ${x + w} ${h - 22} C${x + w + 10} 18 ${x + 30} ${h0 * .5 + 12} ${x + 34} 26`;
    } else p += ` Q${mx} ${Math.max(h0, h) + 10} ${x} ${h}`;
  }
  p += ' L1080 0 Z';
  return `<svg width="1080" height="200" viewBox="0 0 1080 200"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${CH}"/><stop offset="1" stop-color="#3B1E10"/></linearGradient>
  <filter id="s"><feDropShadow dx="0" dy="10" stdDeviation="9" flood-color="#000" flood-opacity=".45"/></filter></defs>
  <path d="${p}" fill="url(#g)" filter="url(#s)"/><path d="${p}" fill="none" stroke="rgba(255,220,180,.10)" stroke-width="3" transform="translate(-3,-4)"/></svg>`;
})();
const css = [
  ff('Candy', 'leckerli-one', 400), ff('Out', 'outfit', 500), ff('Out', 'outfit', 600),
  ff('Play', 'playfair-display', 400, 'italic'), ff('Play', 'playfair-display', 500, 'italic'), ff('Play', 'playfair-display', 800), ff('Play', 'playfair-display', 900),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:${CH}}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.24;mix-blend-mode:overlay;background-image:${noise(1)};pointer-events:none}
/* cover */
.cv .bg{position:absolute;top:330px;height:1020px;filter:contrast(1.08) saturate(1.12) brightness(1.03)}
.cv .shade{position:absolute;left:0;right:0;top:330px;height:420px;background:linear-gradient(180deg,rgba(20,8,3,.55),rgba(20,8,3,0))}
.cv .bot{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(0deg,rgba(25,10,4,.62),rgba(25,10,4,0))}
.cv .band{position:absolute;left:0;right:0;top:0;height:360px;background:radial-gradient(ellipse at 50% 20%,#3E2113,${CH} 70%)}
.cv .drip{position:absolute;left:0;top:356px}
.cv .txt{position:absolute;left:0;right:0;top:58px;text-align:center}
.kick{font-family:Out;font-weight:600;font-size:23px;letter-spacing:.52em;padding-left:.52em;color:#F7E9D6;opacity:.9}
.hero{font-family:Candy;font-size:208px;line-height:1;color:#FFE07A;margin-top:4px;transform:rotate(-4deg);
  text-shadow:0 3px 0 #C98A2E,0 7px 0 #7A4312,0 18px 34px rgba(0,0,0,.55)}
.sub{font-family:Play;font-style:italic;font-weight:500;font-size:35px;color:#F7E9D6;margin-top:6px;letter-spacing:.01em}
.foot{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:Out;font-weight:600;font-size:20px;letter-spacing:.42em;padding-left:.42em;color:#F7E9D6;text-shadow:0 2px 10px rgba(0,0,0,.8)}
.foot b{color:#FFE07A;font-weight:600}
/* menu slides */
.paper{position:absolute;inset:0}
.paper:before{content:'';position:absolute;inset:0;background-image:${noise(.5, .8)};mix-blend-mode:multiply;opacity:.35}
.paper:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.35),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 50% 100%,rgba(90,40,10,.12),rgba(0,0,0,0) 60%)}
.hdr{position:absolute;left:0;right:0;top:54px;text-align:center;font-family:Out;font-weight:600;font-size:19px;letter-spacing:.46em;padding-left:.46em}
.hdr i{font-style:normal;opacity:.55;margin:0 10px}
.arch{position:absolute;left:140px;top:116px;width:800px;height:750px;border-radius:400px 400px 14px 14px;overflow:hidden;
  box-shadow:0 22px 40px rgba(60,25,5,.28)}
.arch img{width:100%;height:100%;object-fit:cover;filter:contrast(1.05) saturate(1.06) sepia(.06)}
.arch2{position:absolute;left:122px;top:98px;width:836px;height:786px;border-radius:418px 418px 24px 24px;border:2px solid currentColor;opacity:.6}
.col{position:absolute;left:80px;right:80px;top:900px;height:370px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}
.title{font-family:Play;font-weight:900;line-height:.98;letter-spacing:-.012em}
.meta{font-family:Out;font-weight:600;font-size:20px;letter-spacing:.3em;padding-left:.3em;margin-top:16px;opacity:.8}
.menu{display:flex;align-items:baseline;width:640px;margin-top:20px;font-family:Play;font-style:italic;font-size:29px}
.menu .k{font-family:Out;font-style:normal;font-weight:600;font-size:18px;letter-spacing:.3em;opacity:.75}
.menu .dots{flex:1;border-bottom:3px dotted currentColor;opacity:.45;margin:0 14px;transform:translateY(-6px)}
.line{font-family:Play;font-style:italic;font-weight:400;font-size:31px;line-height:1.25;margin-top:14px;opacity:.9}
.scal{position:absolute;left:0;right:0;bottom:-22px;height:44px;background:radial-gradient(circle at 27px 22px,currentColor 21px,transparent 22px) 0 0/54px 44px;opacity:.9}
/* end */
.end{position:absolute;inset:-40px;background-size:cover;background-position:center;filter:blur(26px) brightness(.5) saturate(1.1)}
.endv{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(42,20,11,.15),rgba(42,20,11,.7) 80%)}
.phone{position:absolute;left:50%;top:50%;height:1180px;transform:translate(-50%,-50%);filter:drop-shadow(0 30px 60px rgba(0,0,0,.6))}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<div class="cv"><img class="bg" style="left:${s.left}px" src="file://${D}/${s.img}"><div class="shade"></div><div class="bot"></div>
      <div class="band"></div><div class="drip">${drips}</div>
      <div class="txt"><div class="kick">${s.kick}</div><div class="hero">${s.h}</div><div class="sub">${s.sub}</div></div>
      <div class="foot">${s.foot}</div></div><div class="grain"></div>`;
    else if (s.type === 'end') body = `<div class="end" style="background-image:url(file://${D}/${s.img})"></div><div class="endv"></div><img class="phone" src="file://${D}/phone.png"><div class="grain" style="opacity:.12"></div>`;
    else body = `<div class="paper" style="background:${s.paper}"></div>
      <div style="color:${s.ink}"><div class="hdr">THE DESSERT MENU<i>·</i>Nº ${s.n}</div>
      <div class="arch2"></div><div class="arch"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div>
      <div class="col"><div class="title" style="font-size:${s.fs}px">${s.t}</div>
      <div class="meta">${s.yr} &nbsp;·&nbsp; DIR. ${s.dir.toUpperCase()}</div>
      <div class="menu"><span class="k">FLAVOUR</span><span class="dots"></span><span>${s.fl}</span></div>
      <div class="line">${s.ov}</div></div>
      <div class="scal"></div></div>
      <div class="grain" style="opacity:.16"></div>`;
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
