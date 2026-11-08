// "anime about robots who learned to love" — cover: Yokohama Kaidashi Kikou overgrown road to the sea under deep cobalt sky,
// VT323 terminal kicker w/ cursor + peach Sacramento 'learned' + Gloock 'to love.' + Lora italic sub.
// inside: MEMORY FILE (pale graph-paper page, HUD-bracketed still, VT323 'MEMORY 0X / 05' + 'UNIT · NAME', Gloock title,
// Lora italic line, VT323 status line w/ cursor in per-film accent, 5-cell battery progress).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Vt', 'vt323', 400), ff('Sac', 'sacramento', 400), ff('Gl', 'gloock', 400), ff('Lo', 'lora', 400, 'italic'), ff('Lo', 'lora', 500, 'italic'), ff('Lo', 'lora', 400)].join('');
const grain = `<div class="grain"></div>`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.18;mix-blend-mode:overlay;pointer-events:none;z-index:50;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  const css = `${base}
body{background:#1466B0}
.im{position:absolute;inset:0;background:url(file://${D}/${c.img}) ${c.x}% 0%/cover;filter:saturate(1.06) contrast(1.02) sepia(.06)}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,30,80,.42) 0%,rgba(6,30,80,.18) 30%,rgba(6,30,80,0) 48%)}
.warm{position:absolute;inset:0;background:radial-gradient(ellipse at 75% 70%,rgba(255,200,150,.18),rgba(0,0,0,0) 60%);mix-blend-mode:soft-light}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 62%,rgba(10,25,60,.28) 100%)}
.t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;color:#fff}
.kick{font-family:Vt;font-size:44px;letter-spacing:.12em;color:rgba(255,255,255,.92);text-shadow:0 2px 12px rgba(0,20,60,.5)}
.kick i{display:inline-block;width:22px;height:38px;background:${c.ink};vertical-align:-6px;margin-left:8px}
.hero{font-family:Sac;font-size:230px;line-height:.9;color:${c.ink};margin-top:10px;text-shadow:0 4px 30px rgba(0,20,70,.35)}
.l2{font-family:Gl;font-size:132px;line-height:.95;margin-top:-6px;letter-spacing:-.01em;text-shadow:0 4px 26px rgba(0,20,70,.35)}
.sub{font-family:Lo;font-style:italic;font-size:34px;margin-top:26px;color:rgba(255,255,255,.95);text-shadow:0 2px 14px rgba(0,20,60,.55)}
.sw{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Vt;font-size:36px;letter-spacing:.22em;color:#0F2E66}`;
  return `<html><head><style>${css}</style></head><body><div class="im"></div><div class="shade"></div><div class="warm"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}<i></i></div><div class="hero">${c.h}</div><div class="l2">${c.h2}</div><div class="sub">${c.sub}</div></div>
<div class="sw">${c.swipe}</div>${grain}</body></html>`;
}

function mem(m, i, n) {
  const A = m.acc;
  const css = `${base}
body{background:#EEF0EA}
.grid{position:absolute;inset:0;background-image:linear-gradient(rgba(20,40,70,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(20,40,70,.07) 1px,transparent 1px);background-size:36px 36px;background-position:-1px -1px}
.paper{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,250,.6),rgba(0,0,0,0) 60%,rgba(40,50,60,.10) 100%)}
.top{position:absolute;top:58px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Vt;font-size:40px;letter-spacing:.12em;color:#16233A}
.top b{font-weight:400;color:${A}}
.fr{position:absolute;left:60px;top:132px;width:960px;height:${m.h || 650}px}
.fr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;border-radius:6px;filter:saturate(1.08) contrast(1.03);box-shadow:0 18px 40px rgba(20,35,60,.25)}
.fr .tint{position:absolute;inset:0;border-radius:6px;background:linear-gradient(180deg,rgba(255,240,220,.05),rgba(20,30,60,.10))}
.c{position:absolute;width:46px;height:46px;border-color:${A};border-style:solid;border-width:0}
.c1{left:-18px;top:-18px;border-left-width:5px;border-top-width:5px}.c2{right:-18px;top:-18px;border-right-width:5px;border-top-width:5px}
.c3{left:-18px;bottom:-18px;border-left-width:5px;border-bottom-width:5px}.c4{right:-18px;bottom:-18px;border-right-width:5px;border-bottom-width:5px}
.rec{position:absolute;left:22px;top:18px;font-family:Vt;font-size:30px;color:#fff;letter-spacing:.1em;text-shadow:0 1px 8px rgba(0,0,0,.6)}
.rec:before{content:'';display:inline-block;width:14px;height:14px;border-radius:50%;background:${A};margin-right:10px;vertical-align:1px;box-shadow:0 0 10px ${A}}
.txt{position:absolute;left:60px;right:60px;top:${132 + (m.h || 650) + 64}px;color:#16233A}
.meta{font-family:Vt;font-size:36px;letter-spacing:.14em;color:#5A6577}
.ttl{font-family:Gl;font-size:${m.fs || 104}px;line-height:1;margin-top:10px;letter-spacing:-.01em;color:#16233A}
.line{font-family:Lo;font-style:italic;font-size:41px;line-height:1.32;margin-top:20px;color:#2A364C;max-width:900px}
.st{position:absolute;left:60px;bottom:66px;font-family:Vt;font-size:36px;letter-spacing:.1em;color:${A}}
.st i{display:inline-block;width:16px;height:30px;background:${A};vertical-align:-4px;margin-left:6px}
.bat{position:absolute;right:60px;bottom:70px;display:flex;gap:6px;padding:5px;border:3px solid #16233A;border-radius:6px}
.bat:after{content:'';position:absolute;right:-11px;top:9px;width:6px;height:14px;background:#16233A;border-radius:0 3px 3px 0}
.bat i{width:22px;height:20px;background:rgba(22,35,58,.12);border-radius:2px}.bat i.on{background:${A}}`;
  const bat = Array.from({ length: n }, (_, k) => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
  return `<html><head><style>${css}</style></head><body><div class="grid"></div><div class="paper"></div>
<div class="top"><span>MEMORY 0${i + 1} / 0${n}</span><span>UNIT · <b>${m.unit}</b></span></div>
<div class="fr"><img src="file://${D}/${m.img}"><div class="tint"></div><div class="rec">${m.rec}</div><i class="c c1"></i><i class="c c2"></i><i class="c c3"></i><i class="c c4"></i></div>
<div class="txt"><div class="meta">${m.meta}</div><div class="ttl">${m.t}</div><div class="line">${m.ov}</div></div>
<div class="st">STATUS: ${m.status}<i></i></div><div class="bat">${bat}</div>${grain}</body></html>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, mem(m, i, S.movies.length)])];
  for (const [f, html] of pages) {
    if (process.argv[3] && !f.startsWith(process.argv[3])) continue;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
