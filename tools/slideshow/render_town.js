// "cozy small town" — cover: Chocolat village street under a cocoa night band, sign-painter type
// (Leckerli One script + Alfa Slab One butter-yellow w/ red offset), inside: MAIN STREET SHOPFRONT.
// Usage: node render_town.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Leck', 'leckerli-one', 400), ff('Alfa', 'alfa-slab-one', 400), ff('Osw', 'oswald', 500), ff('Osw', 'oswald', 600),
  ff('OST', 'old-standard-tt', 400), ff('OST', 'old-standard-tt', 400, 'italic'), ff('OST', 'old-standard-tt', 700)].join('');
const grain = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.2;mix-blend-mode:overlay;${grain};pointer-events:none;z-index:50}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.38) 100%);z-index:49;pointer-events:none}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const BUTTER = '#F7DF92', RED = '#A8262B';

function cover(s) {
  const css = `${base}
body{background:#20120C}
.img{position:absolute;left:0;right:0;bottom:0;height:${s.ih}px;overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${s.fade}px)}
.img img{position:absolute;height:100%;left:${s.left}px;filter:saturate(.9) contrast(1.04) brightness(.9) sepia(.12)}
.warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(32,18,12,0) 40%,rgba(32,18,12,.55) 100%);z-index:2}
.glow{position:absolute;left:50%;top:250px;width:1000px;height:520px;margin-left:-500px;background:radial-gradient(ellipse,rgba(255,200,120,.10),rgba(0,0,0,0) 65%);z-index:3}
.t{position:absolute;left:0;right:0;top:${s.ty}px;text-align:center;z-index:10;color:${BUTTER}}
.kick{font-family:Osw;font-weight:500;font-size:25px;letter-spacing:.5em;padding-left:.5em;color:#F3E6CF;opacity:.92}
.cozy{font-family:Leck;font-size:160px;line-height:1;margin-top:18px;transform:rotate(-7deg) translateX(-190px);color:#F3E6CF;
  text-shadow:0 4px 0 ${RED},0 8px 30px rgba(0,0,0,.5)}
.big{font-family:Alfa;font-size:168px;line-height:.92;letter-spacing:.01em;margin-top:-34px;color:${BUTTER};
  text-shadow:6px 6px 0 ${RED},7px 8px 18px rgba(0,0,0,.55)}
.rule{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:22px;color:${BUTTER}}
.rule i{display:block;width:120px;height:2px;background:${BUTTER};opacity:.8}
.rule b{font-family:Osw;font-weight:600;font-size:20px;letter-spacing:.42em;padding-left:.42em}
.sub{font-family:OST;font-style:italic;font-size:36px;color:#F3E6CF;margin-top:20px;line-height:1.25;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.sub em{color:${BUTTER};font-style:italic}
.swipe{position:absolute;bottom:52px;left:64px;z-index:10;font-family:Osw;font-weight:500;font-size:20px;letter-spacing:.4em;color:#F3E6CF;opacity:.9;text-shadow:0 1px 10px rgba(0,0,0,.6)}`;
  return `<style>${css}</style><div class="img"><img src="file://${D}/${s.img}"></div><div class="warm"></div><div class="glow"></div>
  <div class="t"><div class="kick">MOVIES THAT FEEL LIKE A</div><div class="cozy">cozy</div><div class="big">SMALL<br>TOWN</div>
  <div class="rule"><i></i><b>MAIN STREET</b><i></i></div>
  <div class="sub">${s.sub}</div></div><div class="swipe">5 TOWNS &nbsp;·&nbsp; SWIPE →</div><div class="vig"></div><div class="grain"></div>`;
}

function shop(s, i) {
  const c = s.wall, a = s.stripe;
  const css = `${base}
body{background:${c}}
.planks{position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.0) 0 86px,rgba(0,0,0,.22) 86px 89px,rgba(255,255,255,.05) 89px 90px);}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 30%,rgba(0,0,0,.0) 70%,rgba(0,0,0,.35))}
.hdr{position:absolute;top:34px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:baseline;color:#F3E6CF;z-index:5}
.hdr .l{font-family:Osw;font-weight:500;font-size:20px;letter-spacing:.4em}
.hdr .r{font-family:Leck;font-size:34px;color:${BUTTER}}
.awn{position:absolute;top:88px;left:40px;right:40px;height:118px;z-index:6;
  background:repeating-linear-gradient(90deg,${a} 0 50px,#F4EBDA 50px 100px);box-shadow:0 18px 26px rgba(0,0,0,.35)}
.awn:before{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.28),rgba(255,255,255,.08) 45%,rgba(0,0,0,.12))}
.scal{position:absolute;top:206px;left:40px;right:40px;height:26px;z-index:6;
  background:radial-gradient(circle at 25px 0,${a} 24.5px,transparent 25.5px) 0 0/100px 26px repeat-x,radial-gradient(circle at 75px 0,#F4EBDA 24.5px,transparent 25.5px) 0 0/100px 26px repeat-x;filter:drop-shadow(0 10px 10px rgba(0,0,0,.3))}
.val{position:absolute;top:120px;left:0;right:0;text-align:center;z-index:7;font-family:Alfa;font-size:46px;letter-spacing:.08em;color:#fff;
  -webkit-text-stroke:0;text-shadow:0 2px 0 rgba(0,0,0,.25)}
.val span{background:${a};padding:6px 28px 8px;border:3px solid #F4EBDA;outline:2px solid ${a}}
.win{position:absolute;top:262px;left:78px;width:924px;height:600px;z-index:4;border:14px solid #EFE4CC;
  box-shadow:0 0 0 3px #3B2A1E,0 0 0 6px #C9A45A,0 26px 40px rgba(0,0,0,.45);overflow:hidden;background:#000}
.win img{width:100%;height:100%;object-fit:cover;object-position:${s.x ?? 50}% ${s.y ?? 50}%;filter:${s.f || 'saturate(.88) contrast(1.03) sepia(.1)'}}
.win .sheen{position:absolute;inset:0;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.10) 38%,rgba(255,255,255,0) 46%,rgba(255,255,255,0) 60%,rgba(255,255,255,.06) 64%,rgba(255,255,255,0) 68%)}
.win .inner{position:absolute;inset:0;box-shadow:inset 0 0 50px rgba(0,0,0,.45)}
.gilt{position:absolute;top:8px;left:0;width:100%;z-index:3}
.board{position:absolute;top:900px;left:96px;right:96px;height:368px;z-index:5;background:#F2E7D0;border-radius:8px;
  box-shadow:0 22px 34px rgba(0,0,0,.4),inset 0 0 0 10px #F2E7D0,inset 0 0 0 12px ${s.ink},inset 0 0 0 16px #F2E7D0,inset 0 0 0 17px ${s.ink};text-align:center;padding:40px 50px 0}
.board:before{content:'';position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply;${grain};border-radius:8px}
.chain{position:absolute;top:862px;width:4px;height:48px;z-index:4;background:repeating-linear-gradient(180deg,#2B2219 0 7px,#8C7A5C 7px 10px)}
.no{font-family:Osw;font-weight:600;font-size:19px;letter-spacing:.4em;color:${s.ink};opacity:.85}
.title{font-family:Alfa;font-size:${s.fs || 70}px;line-height:1.02;color:${s.ink};margin-top:12px;white-space:nowrap}
.meta{font-family:Osw;font-weight:500;font-size:22px;letter-spacing:.32em;color:#3A2C22;margin-top:14px}
.orn{margin:16px auto 0;width:300px;height:12px;background:radial-gradient(circle,${s.ink} 4px,transparent 5px) center/24px 12px no-repeat,linear-gradient(${s.ink},${s.ink}) left center/130px 1.5px no-repeat,linear-gradient(${s.ink},${s.ink}) right center/130px 1.5px no-repeat}
.line{font-family:OST;font-style:italic;font-size:31px;line-height:1.28;color:#2E241C;margin-top:14px}
.wel{position:absolute;z-index:8;right:56px;top:752px;transform:rotate(4deg);background:#1F5A3E;color:#F4F1E6;border-radius:12px;padding:14px 26px 16px;text-align:center;
  box-shadow:inset 0 0 0 4px #1F5A3E,inset 0 0 0 7px #F4F1E6,0 14px 24px rgba(0,0,0,.45)}
.wel .w{font-family:Osw;font-weight:500;font-size:16px;letter-spacing:.38em}
.wel .n{font-family:Alfa;font-size:30px;letter-spacing:.03em;margin:4px 0 2px}
.wel .e{font-family:OST;font-style:italic;font-size:19px;opacity:.95}`;
  const gilt = `<svg class="gilt" viewBox="0 0 924 140" height="140"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".45" stop-color="#E8B84E"/><stop offset=".55" stop-color="#B98326"/><stop offset="1" stop-color="#F6D27A"/></linearGradient>
  <path id="arc" d="M 150 130 Q 462 -10 774 130"/></defs>
  <text font-family="Alfa" font-size="${s.gs || 44}" letter-spacing="5" fill="url(#g)" stroke="#2A1A0E" stroke-width="2.4" paint-order="stroke" text-anchor="middle" style="filter:drop-shadow(0 3px 4px rgba(0,0,0,.6))"><textPath href="#arc" startOffset="50%">${s.town}</textPath></text></svg>`;
  return `<style>${css}</style><div class="planks"></div><div class="shade"></div>
  <div class="hdr"><div class="l">MAIN STREET · Nº 0${i} / 05</div><div class="r">a cozy small town</div></div>
  <div class="awn"></div><div class="scal"></div><div class="val"><span>${s.shop}</span></div>
  <div class="win"><img src="file://${D}/${s.img}"><div class="inner"></div><div class="sheen"></div></div>
  <div class="chain" style="left:250px"></div><div class="chain" style="right:250px"></div>
  <div class="board"><div class="no">SHOP Nº 0${i}</div><div class="title">${s.t}</div><div class="meta">${s.yr} · ${s.dir.toUpperCase()}</div><div class="orn"></div><div class="line">${s.ov}</div></div>
  <div class="wel"><div class="w">WELCOME TO</div><div class="n">${s.wel}</div><div class="e">est. ${s.yr}</div></div>
  <div class="vig"></div><div class="grain"></div>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  let n = 0;
  for (const s of S) {
    const html = `<html><head></head><body>${s.type === 'cover' ? cover(s) : shop(s, ++n)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
