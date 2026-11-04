// "falling in love in winter" — snowy MUBI-minimal cover + WINTER POSTCARD inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Ballet', 'ballet', 400), ff('NSD', 'noto-serif-display', 300), ff('NSD', 'noto-serif-display', 500), ff('NSD', 'noto-serif-display', 600),
  ff('NSD', 'noto-serif-display', 300, 'italic'), ff('NSD', 'noto-serif-display', 400, 'italic'), ff('Hk', 'hanken-grotesk', 500), ff('Hk', 'hanken-grotesk', 600)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.32) 100%);pointer-events:none}
.flake{position:absolute;border-radius:50%;background:#fff}
`;
const S = JSON.parse(fs.readFileSync(D + '/winter.json'));
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const snow = (n, op = 1) => Array.from({ length: n }, () => { const r = 1.5 + rnd() * 4.5; return `<div class="flake" style="left:${rnd() * 1080}px;top:${rnd() * 1350}px;width:${r}px;height:${r}px;opacity:${(.12 + rnd() * .45) * op};filter:blur(${r > 4.5 ? 1.4 : .4}px)"></div>`; }).join('');

function cover(c) {
  return `<style>
  .img{position:absolute;left:0;top:0;width:1080px;height:1250px;object-fit:cover;object-position:${c.x}% 0%;filter:saturate(.8) contrast(.92) brightness(1.04)}
  .ext{position:absolute;left:0;right:0;top:0;height:1350px;background:linear-gradient(180deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 1040px,${c.snow} 1250px,${c.snow} 1350px)}
  .cool{position:absolute;inset:0;background:linear-gradient(180deg,rgba(150,170,210,.10),rgba(255,240,230,.06));mix-blend-mode:soft-light}
  .t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
  .k{font:600 23px Hk;letter-spacing:.46em;color:${c.ink2};padding-left:.46em;margin-bottom:34px}
  .h{font:400 150px/1 Ballet;color:${c.ink};margin-top:6px;text-shadow:0 2px 26px rgba(255,255,255,.35)}
  .h2{font:300 60px NSD;letter-spacing:.34em;padding-left:.34em;color:${c.ink2};margin-top:-14px}
  .sub{font:italic 300 33px NSD;color:${c.ink2};margin-top:16px;opacity:.92}
  .sub b{font-weight:400;color:${c.ink}}
  .top{position:absolute;bottom:40px;left:60px;right:60px;display:flex;justify-content:space-between;font:600 19px Hk;letter-spacing:.38em;color:rgba(40,40,60,.55)}
  </style>
  <img class="img" src="file://${D}/${c.img}"><div class="ext"></div><div class="cool"></div>${snow(70, .9)}
  <div class="top"><span>05 FILMS</span><span>SWIPE →</span></div>
  <div class="t"><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div><div class="sub">${c.sub}</div></div>
  <div class="vig" style="opacity:.6"></div><div class="grain"></div>`;
}

function film(m, i) {
  return `<style>
  body{background:${m.page}}
  .wash{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.10),rgba(0,0,0,0) 60%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.25))}
  .hd{position:absolute;top:58px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center;color:#F4EDE2}
  .hd .n{font:600 20px Hk;letter-spacing:.4em}
  .hd .s{font:400 56px Ballet;color:${m.acc};line-height:1}
  .card{position:absolute;left:70px;top:205px;width:940px;height:680px;background:#F6F1E7;padding:22px 22px 0;transform:rotate(-1.6deg);
    box-shadow:0 30px 60px rgba(0,0,0,.45),0 4px 10px rgba(0,0,0,.25)}
  .card img{width:896px;height:560px;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;display:block;filter:saturate(.86) contrast(.95) sepia(.08)}
  .card .foot{display:flex;justify-content:space-between;align-items:center;height:76px;padding:0 6px}
  .card .pc{font:600 15px Hk;letter-spacing:.5em;color:#8B8172}
  .card .pl{font:400 40px Ballet;color:${m.ink};line-height:1}
  .stamp{position:absolute;left:820px;top:135px;width:208px;height:256px;padding:12px;background:#FBF8F1;transform:rotate(5deg);
    -webkit-mask:linear-gradient(#000 0 0) content-box,radial-gradient(circle 6px,#0000 97%,#000) -8px -8px/16px 16px;filter:drop-shadow(0 10px 14px rgba(0,0,0,.4))}
  .stamp .in{width:100%;height:100%;position:relative;overflow:hidden}
  .stamp img{width:100%;height:100%;object-fit:cover;object-position:${m.sx ?? 50}% ${m.sy ?? 50}%;filter:saturate(.85) sepia(.12)}
  .stamp .v{position:absolute;left:0;right:0;bottom:8px;text-align:center;font:600 14px Hk;letter-spacing:.3em;color:#fff;text-shadow:0 1px 6px rgba(0,0,0,.6)}
  .pm{position:absolute;left:96px;top:760px;width:190px;height:190px;transform:rotate(-12deg);opacity:.82}
  .ti{position:absolute;left:60px;right:60px;top:${m.tt ?? 948}px;text-align:center;color:#F6EFE4}
  .ti h1{font:500 ${m.fs || 80}px/1.02 NSD;letter-spacing:-.01em}
  .ti .m{font:600 20px Hk;letter-spacing:.38em;color:${m.acc};margin-top:20px;padding-left:.38em}
  .ti .o{font:italic 300 40px/1.3 NSD;margin:22px auto 0;max-width:880px;opacity:.95}
  .dots{position:absolute;bottom:56px;left:0;right:0;display:flex;justify-content:center;gap:18px}
  .dots i{width:9px;height:9px;border-radius:50%;border:1.5px solid rgba(246,239,228,.7)}
  .dots i.on{background:${m.acc};border-color:${m.acc}}
  </style>
  <div class="wash"></div>${snow(90, .8)}
  <div class="hd"><span class="n">Nº 0${i} / 05</span><span class="s">falling in love in winter</span></div>
  <div class="card"><img src="file://${D}/${m.img}"><div class="foot"><span class="pc">POST CARD</span><span class="pl">${m.place}</span></div></div>
  <div class="stamp"><div class="in"><img src="file://${D}/${m.img2}"><div class="v">${m.yr}</div></div></div>
  <svg class="pm" viewBox="0 0 200 200"><defs><path id="c${i}" d="M100,100 m-70,0 a70,70 0 1,1 140,0 a70,70 0 1,1 -140,0"/></defs>
   <circle cx="100" cy="100" r="88" fill="none" stroke="#2B2B33" stroke-width="3"/><circle cx="100" cy="100" r="52" fill="none" stroke="#2B2B33" stroke-width="2"/>
   <text font-family="Hk" font-weight="600" font-size="15" letter-spacing="4" fill="#2B2B33"><textPath href="#c${i}" startOffset="0">${m.pmark}</textPath></text>
   <text x="100" y="96" text-anchor="middle" font-family="NSD" font-style="italic" font-size="22" fill="#2B2B33">${m.month}</text>
   <text x="100" y="122" text-anchor="middle" font-family="Hk" font-weight="600" font-size="18" letter-spacing="2" fill="#2B2B33">${m.yr}</text>
   <path d="M190,70 q20,-10 40,0 t40,0 t40,0 M190,95 q20,-10 40,0 t40,0 t40,0 M190,120 q20,-10 40,0 t40,0 t40,0" stroke="#2B2B33" stroke-width="3" fill="none"/></svg>
  <div class="ti"><h1>${m.t}</h1><div class="m">${m.dir.toUpperCase()} &nbsp;·&nbsp; ${m.yr}</div><div class="o">${m.ov}</div></div>
  <div class="dots">${[1, 2, 3, 4, 5].map(k => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>
  <div class="vig"></div><div class="grain"></div>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const jobs = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, k) => [`0${k + 2}_${m.slug}.jpg`, film(m, k + 1)])];
  for (const [f, body] of jobs) {
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
