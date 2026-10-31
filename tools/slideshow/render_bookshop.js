// "getting lost in a bookshop" — cover: Funny Face bookshop doorway fading up into deep ink-green band; inside: LIBRARY BOOK layout
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Rozha','rozha-one',400), ff('Petit','petit-formal-script',400), ff('Courier','courier-prime',400), ff('Courier','courier-prime',700),
  ff('Gara','eb-garamond',400,'italic'), ff('Gara','eb-garamond',500,'italic'), ff('Gara','eb-garamond',500)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const C = S.cover.ink || '#9DB7F5';
function cover(c) {
  return `<style>
  body{background:linear-gradient(180deg,#0F1A18 0%,#13211E 40%,#18241F 60%)}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.ih||930}px;overflow:hidden;
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.fade||230}px)}
  .img img{position:absolute;height:100%;left:50%;top:0;transform:translateX(-${c.x||50}%);filter:saturate(.95) contrast(1.06) sepia(.1) brightness(.97)}
  .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(40,80,70,.15),rgba(255,170,90,.08) 60%,rgba(20,10,5,.3));mix-blend-mode:soft-light}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 50%,rgba(0,0,0,.42) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.ty||64}px;text-align:center}
  .kick{font-family:Courier;font-weight:700;font-size:22px;letter-spacing:.55em;color:#EDE3CC;padding-left:.55em;opacity:.9}
  .scr{font-family:Petit;font-size:66px;line-height:1.2;color:#F1E6CF;margin-top:22px}
  .big{font-family:Rozha;font-size:${c.fs||178}px;line-height:.9;color:${C};letter-spacing:.01em;margin-top:2px;
    text-shadow:0 2px 0 rgba(0,0,0,.25),0 10px 40px rgba(0,0,0,.5)}
  .rule{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:22px;font-family:Courier;font-size:20px;letter-spacing:.32em;color:#EDE3CC;opacity:.85}
  .rule i{display:block;width:90px;height:1.5px;background:${C};opacity:.8}
  .sub{position:absolute;left:0;right:0;bottom:${c.sb||64}px;text-align:center;font-family:Gara;font-style:italic;font-weight:500;font-size:44px;color:#F4EAD6;text-shadow:0 2px 16px rgba(0,0,0,.75)}
  .shade{position:absolute;left:0;right:0;bottom:0;height:320px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(10,12,10,.7))}
  </style>
  <div class="img"><img src="file://${D}/${c.img}"><div class="warm"></div></div><div class="vig"></div><div class="shade"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="scr">${c.h}</div><div class="big">${c.h2}</div>
    <div class="rule"><i></i>${c.rule}<i></i></div></div>
  <div class="sub">${c.sub}</div><div class="grain"></div>`;
}
const ROMAN = ['i','ii','iii','iv','v'];
function film(s, i, n) {
  const cloth = s.cloth, foil = s.foil;
  return `<style>
  body{background:${cloth}}
  .cloth{position:absolute;inset:0;background:
     repeating-linear-gradient(0deg,rgba(255,255,255,.035) 0 1px,transparent 1px 3px),
     repeating-linear-gradient(90deg,rgba(0,0,0,.06) 0 1px,transparent 1px 3px),
     radial-gradient(ellipse at 40% 30%,rgba(255,255,255,.08),rgba(0,0,0,.35) 90%)}
  .edge{position:absolute;inset:26px;border:2px solid ${foil};opacity:.35;border-radius:4px}
  .edge2{position:absolute;inset:34px;border:1px solid ${foil};opacity:.25;border-radius:2px}
  .hdr{position:absolute;top:56px;left:80px;right:300px;display:flex;justify-content:space-between;font-family:Courier;font-weight:700;font-size:20px;letter-spacing:.26em;color:${foil};opacity:.9}
  .plate{position:absolute;left:80px;right:80px;top:104px;height:560px;background:#F2EADB;padding:18px 18px 52px;box-shadow:0 18px 44px rgba(0,0,0,.5);transform:rotate(${s.rot??-0.6}deg)}
  .plate div{width:100%;height:100%;overflow:hidden;position:relative}
  .plate img{width:100%;height:100%;object-fit:cover;object-position:${s.x??50}% ${s.y??50}%;filter:saturate(.92) contrast(1.04) sepia(.12)}
  .plate div:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 40px rgba(60,40,20,.35)}
  .cap{position:absolute;left:0;right:0;bottom:12px;text-align:center;font-family:Gara;font-style:italic;font-size:22px;color:#6B5B48}
  .bm{position:absolute;right:120px;top:60px;width:150px;height:430px;background:#F2EADB;padding:9px;box-shadow:0 14px 30px rgba(0,0,0,.45);transform:rotate(3deg)}
  .bm div{width:100%;height:100%;overflow:hidden}
  .bm img{width:100%;height:100%;object-fit:cover;object-position:${s.x2??50}% 50%;filter:saturate(.9) sepia(.12)}
  .bm:after{content:'';position:absolute;left:50%;bottom:-74px;width:6px;height:80px;margin-left:-3px;background:${foil}}
  .tas{position:absolute;right:${120+68}px;top:${60+430+66}px;width:22px;height:34px;border-radius:4px 4px 10px 10px;background:${foil};transform:rotate(3deg);
    background-image:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,transparent 2px 4px)}
  .ttl{position:absolute;left:80px;right:80px;top:700px;font-family:Rozha;font-size:${s.fs||84}px;line-height:1.0;color:${foil};text-shadow:0 3px 18px rgba(0,0,0,.35)}
  .meta{position:absolute;left:84px;top:${700+(s.tl||1)*Math.round((s.fs||84)*1.0)+20}px;font-family:Courier;font-weight:700;font-size:22px;letter-spacing:.2em;color:#EFE6D3;opacity:.85}
  .card{position:absolute;left:80px;top:${s.cardY||930}px;width:470px;height:390px;background:#F4ECDC;transform:rotate(-2.5deg);box-shadow:0 10px 26px rgba(0,0,0,.4);padding:22px 26px;font-family:Courier;color:#2A2622}
  .card h4{font-family:Courier;font-weight:700;font-size:18px;letter-spacing:.3em;text-align:center;border-bottom:2px solid #2A2622;padding-bottom:8px}
  .card .tt{font-size:17px;margin-top:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rows{margin-top:10px;background:repeating-linear-gradient(180deg,transparent 0 35px,rgba(150,60,50,.35) 35px 36px);height:260px;position:relative;border-left:1.5px solid rgba(150,60,50,.45);margin-left:120px}
  .st{position:absolute;font-family:Courier;font-weight:700;font-size:22px;letter-spacing:.06em;color:rgba(170,40,40,.82);border:2.5px solid rgba(170,40,40,.7);padding:2px 10px;border-radius:5px}
  .pocket{position:absolute;left:58px;top:${(s.cardY||930)+232}px;width:520px;height:200px;background:#C9A574;transform:rotate(-2.5deg);box-shadow:0 -4px 14px rgba(0,0,0,.25),0 12px 26px rgba(0,0,0,.35);
    background-image:repeating-linear-gradient(35deg,rgba(255,255,255,.04) 0 2px,transparent 2px 6px);border-radius:0 0 6px 6px;text-align:center;padding-top:40px;font-family:Courier;font-weight:700;color:#5A3F22;font-size:17px;letter-spacing:.24em}
  .pocket b{display:block;font-family:Gara;font-style:italic;font-weight:500;letter-spacing:0;font-size:30px;margin-top:10px;color:#4A321A}
  .line{position:absolute;left:620px;right:84px;top:${(s.cardY||930)+40}px;font-family:Gara;font-style:italic;font-weight:400;font-size:40px;line-height:1.22;color:#F3EBDB}
  .line:before{content:'';display:block;width:60px;height:2px;background:${foil};margin-bottom:22px}
  </style>
  <div class="cloth"></div><div class="edge"></div><div class="edge2"></div>
  <div class="hdr"><span>SHELF 0${i+1} / 0${n}</span><span>EX LIBRIS</span></div>
  <div class="plate"><div><img src="file://${D}/${s.img}"></div><div class="cap">plate ${ROMAN[i]}. — ${s.plate}</div></div>
  <div class="bm"><div><img src="file://${D}/${s.img2}"></div></div><div class="tas"></div>
  <div class="ttl">${s.t}</div>
  <div class="meta">DIR. ${s.dir.toUpperCase()} — ${s.yr}</div>
  <div class="card"><h4>DATE DUE</h4><div class="tt">${s.call} · ${s.t.replace(/<br>/g,' ')}</div>
    <div class="rows"><span class="st" style="left:-112px;top:6px;transform:rotate(-6deg)">${s.stamp1}</span><span class="st" style="left:60px;top:52px;transform:rotate(4deg)">RENEWED</span><span class="st" style="left:-96px;top:100px;transform:rotate(-3deg)">OCT 31 2026</span></div></div>
  <div class="pocket">PLEASE KEEP THIS CARD<b>a story you can't return</b></div>
  <div class="line">${s.ov}</div>
  <div class="grain"></div>`;
}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const films = S.films; const only = process.argv[3];
  const jobs = [['01_cover.jpg', cover(S.cover)], ...films.map((s, i) => [`0${i+2}_${s.slug}.jpg`, film(s, i, films.length)])];
  for (const [f, body] of jobs) {
    if (only && !f.startsWith(only)) continue;
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
