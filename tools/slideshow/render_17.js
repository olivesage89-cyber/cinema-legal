// "anime that feel like being 17 again" — cover: rooftop sky + varsity 17; inside: YEARBOOK pages
const { chromium } = require('playwright'); const fs = require('fs');
const D = process.argv[2]; const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = __dirname + '/node_modules/@fontsource/';
const ff = (fam, pkg, w = 400, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const FONTS = [ff('Abril', 'abril-fatface'), ff('Satisfy', 'satisfy'), ff('Mono', 'space-mono'), ff('Mono', 'space-mono', 700), ff('Bask', 'libre-baskerville'), ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 700),
  ff('Pen', 'nanum-pen-script'), ff('Arch', 'archivo', 500), ff('Arch', 'archivo', 800), ff('Inter', 'inter', 500)].join('');
const GRAIN = `<svg class="grain" xmlns="http://www.w3.org/2000/svg" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5 0 0 0 0 .5 0 0 0 0 .5 0 0 0 .55 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const BASE = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;mix-blend-mode:overlay;opacity:.32;pointer-events:none;z-index:50}`;
const f = p => 'file://' + D + '/' + p;

function cover(c) {
  return `<style>${FONTS}${BASE}
  body{background:linear-gradient(180deg,#123F86 0%,#2A6FC2 30%,#5AAEEC 52%,#86CDF6 64%)}
  .bg{position:absolute;left:0;right:0;bottom:0;width:100%;height:${c.h}px;object-fit:cover;object-position:${c.x}% 100%;filter:saturate(.9) contrast(.97) sepia(.05);
     -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 30%)}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 74%,rgba(8,26,56,.78) 100%)}
  .warm{position:absolute;inset:0;background:radial-gradient(ellipse at 80% 10%,rgba(255,214,170,.20),rgba(0,0,0,0) 55%);mix-blend-mode:screen}
  .t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;color:#fff}
  .kick{font-family:Mono;font-weight:700;font-size:25px;letter-spacing:.42em;padding-left:.42em;color:#fff;text-shadow:0 2px 14px rgba(0,30,70,.45)}
  .row{position:relative;height:430px;margin-top:6px}
  .n{position:absolute;left:0;right:0;top:-10px;font-family:Abril;font-size:470px;line-height:1;color:#fff;letter-spacing:-.02em;
     text-shadow:9px 9px 0 ${c.ink},0 0 60px rgba(0,30,80,.25)}
  .being{position:absolute;left:105px;top:22px;font-family:Satisfy;font-size:132px;color:${c.ink};transform:rotate(-9deg);
     text-shadow:0 0 2px #fff,0 0 22px rgba(255,255,255,.55)}
  .again{position:absolute;right:125px;top:300px;font-family:Satisfy;font-size:132px;color:${c.ink};transform:rotate(-9deg);
     text-shadow:0 0 2px #fff,0 0 22px rgba(255,255,255,.55)}
  .sub{position:absolute;left:0;right:0;bottom:62px;text-align:center;font-family:Bask;font-style:italic;font-size:31px;line-height:1.45;color:#fff;text-shadow:0 2px 16px rgba(0,20,50,.7)}
  .sub b{font-family:Mono;font-style:normal;font-weight:700;font-size:20px;letter-spacing:.35em;display:block;margin-top:14px;color:#fff}
  </style><img class="bg" src="${f(c.img)}"><div class="shade"></div><div class="warm"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="row"><div class="n">17</div><div class="being">being</div><div class="again">again</div></div></div>
  <div class="sub">${c.sub}</div>${GRAIN}`;
}

function inside(m, i, n) {
  const a = m.acc;
  return `<style>${FONTS}${BASE}
  body{background:${m.page}}
  .paper{position:absolute;inset:44px 44px 44px 44px;background:#FBF6EC;border-radius:6px;box-shadow:0 18px 50px rgba(0,0,0,.35);overflow:hidden}
  .paper:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.6),rgba(0,0,0,0) 60%),linear-gradient(180deg,rgba(150,120,70,.0),rgba(150,120,70,.08))}
  .band{position:absolute;left:0;right:0;top:0;height:92px;background:${a};display:flex;align-items:center;justify-content:space-between;padding:0 46px;color:#FBF6EC}
  .band .l{font-family:Arch;font-weight:800;font-size:25px;letter-spacing:.3em}
  .band .r{font-family:Mono;font-weight:700;font-size:21px;letter-spacing:.2em}
  .stripe{position:absolute;left:0;right:0;top:92px;height:8px;background:repeating-linear-gradient(90deg,#FBF6EC 0 14px,${a} 14px 28px);opacity:.55}
  .ph{position:absolute;left:62px;top:150px;width:868px;height:500px;background:#fff;padding:14px;box-shadow:0 6px 18px rgba(60,40,10,.22);transform:rotate(-1.2deg)}
  .ph img{width:100%;height:100%;object-fit:cover;object-position:${m.x}% 50%;filter:saturate(.95) contrast(.97) sepia(.07)}
  .corner{position:absolute;width:56px;height:56px;background:${a};opacity:.9}
  .c1{left:-12px;top:-12px;clip-path:polygon(0 0,100% 0,0 100%)} .c2{right:-12px;top:-12px;clip-path:polygon(0 0,100% 0,100% 100%)}
  .c3{left:-12px;bottom:-12px;clip-path:polygon(0 0,0 100%,100% 100%)} .c4{right:-12px;bottom:-12px;clip-path:polygon(100% 0,0 100%,100% 100%)}
  .ph2{position:absolute;right:58px;top:690px;width:330px;height:230px;background:#fff;padding:10px 10px 38px;box-shadow:0 6px 16px rgba(60,40,10,.25);transform:rotate(3.5deg)}
  .ph2 img{width:100%;height:100%;object-fit:cover;object-position:${m.x2}% 50%;filter:saturate(.95) sepia(.07)}
  .ph2 .cap{position:absolute;left:0;right:0;bottom:4px;text-align:center;font-family:Pen;font-size:31px;color:#3a3a46}
  .tape{position:absolute;top:-16px;left:50%;width:120px;height:34px;margin-left:-60px;background:rgba(255,255,255,.55);box-shadow:0 1px 3px rgba(0,0,0,.12);transform:rotate(-4deg);backdrop-filter:blur(1px);border-left:1px dashed rgba(0,0,0,.08);border-right:1px dashed rgba(0,0,0,.08)}
  .txt{position:absolute;left:70px;top:700px;width:520px}
  .no{font-family:Mono;font-weight:700;font-size:19px;letter-spacing:.3em;color:${a}}
  .title{font-family:Bask;font-weight:700;font-size:${m.fs||60}px;line-height:1.08;color:#1f2433;margin-top:12px;letter-spacing:-.01em}
  .meta{font-family:Arch;font-weight:500;font-size:19px;letter-spacing:.2em;color:#6b6a72;margin-top:16px;text-transform:uppercase}
  .rule{width:70px;height:4px;background:${a};margin:26px 0 22px}
  .most{font-family:Mono;font-weight:700;font-size:17px;letter-spacing:.28em;color:#1f2433}
  .mostv{font-family:Bask;font-style:italic;font-size:31px;line-height:1.38;color:#2d3040;margin-top:8px}
  .sign{position:absolute;left:520px;bottom:96px;width:480px;font-family:Pen;font-size:50px;line-height:.95;color:${m.pen};transform:rotate(-5deg);text-align:center}
  .foot{position:absolute;left:70px;right:70px;bottom:58px;display:flex;justify-content:space-between;font-family:Mono;font-size:16px;letter-spacing:.24em;color:#9a958a}
  </style><div class="paper"><div class="band"><div class="l">SENIOR YEAR</div><div class="r">Nº 0${i} / 0${n}</div></div><div class="stripe"></div>
  <div class="ph"><img src="${f(m.img)}"><div class="corner c1"></div><div class="corner c2"></div><div class="corner c3"></div><div class="corner c4"></div></div>
  <div class="txt"><div class="no">CLASS OF ${m.yr}</div><div class="title">${m.t}</div><div class="meta">${m.dir} · ${m.kind}</div><div class="rule"></div>
  <div class="most">MOST LIKELY TO</div><div class="mostv">${m.most}</div></div>
  <div class="ph2"><div class="tape"></div><img src="${f(m.img2)}"><div class="cap">${m.cap}</div></div>
  <div class="sign">${m.sign}</div>
  <div class="foot"><span>THE YEARBOOK</span><span>BEING 17 AGAIN</span></div></div>${GRAIN}`;
}

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const out = D + '/out/'; fs.mkdirSync(out, { recursive: true });
  const pages = [['01_cover', cover(S.cover)], ...S.movies.map((m, k) => [`0${k + 2}_${m.slug}`, inside(m, k + 1, S.movies.length)])];
  const only = process.argv[3];
  for (const [name, html] of pages) {
    if (only && !name.startsWith(only)) continue;
    fs.writeFileSync(D + '/_t.html', '<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: out + name + '.jpg', type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
