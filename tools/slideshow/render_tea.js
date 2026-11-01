// "movies that feel like a cup of tea" — cover: Paddington 2 Thames/Parliament w/ extended dusk sky; inside: TEA TIME (regency-stripe wallpaper, matted print, top-down china teacup w/ 2nd still as the tea, hanging teabag tag)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Gloock','gloock',400), ff('Pinyon','pinyon-script',400), ff('Jost','jost',400), ff('Jost','jost',500), ff('Jost','jost',600),
  ff('Corm','cormorant-garamond',500,'italic'), ff('Corm','cormorant-garamond',600,'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.18;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const C = S.cover.ink || '#F3E3D7';
function cover(c) {
  return `<style>
  body{background:linear-gradient(180deg,${c.sky1||'#4E5670'} 0%,${c.sky2||'#8C8790'} 22%,${c.sky3||'#B39A88'} 34%)}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.ih||1120}px;overflow:hidden;
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.fade||300}px)}
  .img img{position:absolute;height:100%;left:50%;top:0;transform:translateX(-${c.x||50}%);filter:saturate(1.02) contrast(1.05) brightness(.98)}
  .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,190,130,.10),rgba(255,160,90,.10) 60%,rgba(30,15,5,.35));mix-blend-mode:soft-light}
  .glow{position:absolute;left:-10%;right:-10%;top:180px;height:520px;background:radial-gradient(ellipse at 50% 60%,rgba(255,214,170,.35),rgba(255,214,170,0) 65%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.38) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.ty||70}px;text-align:center}
  .kick{font-family:Jost;font-weight:500;font-size:22px;letter-spacing:.52em;padding-left:.52em;color:#F6ECDF;opacity:.92}
  .scr{font-family:Pinyon;font-size:${c.ss||92}px;line-height:1;color:#F6ECDF;margin-top:30px;margin-left:-300px;text-shadow:0 2px 18px rgba(30,20,30,.35)}
  .big{font-family:Gloock;font-size:${c.fs||300}px;line-height:.78;color:${C};letter-spacing:-.01em;margin-top:-34px;
    text-shadow:0 3px 0 rgba(0,0,0,.12),0 14px 50px rgba(30,20,40,.45)}
  .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:26px;font-family:Corm;font-style:italic;font-weight:600;font-size:40px;line-height:1.12;color:#F6ECDF;text-shadow:0 2px 10px rgba(0,0,0,.4)}
  .rule i{display:block;width:56px;height:1.5px;background:#F6ECDF;opacity:.7}
  .sub{position:absolute;left:0;right:0;bottom:${c.sb||60}px;text-align:center;font-family:Corm;font-style:italic;font-weight:500;font-size:44px;line-height:1.15;color:#FBF1E4;text-shadow:0 2px 16px rgba(0,0,0,.8)}
  .shade{position:absolute;left:0;right:0;bottom:0;height:360px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(18,10,6,.72))}
  </style>
  <div class="glow"></div>
  <div class="img"><img src="file://${D}/${c.img}"><div class="warm"></div></div><div class="vig"></div><div class="shade"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="scr">${c.h}</div><div class="big">${c.h2}</div>
    <div class="rule"><i></i>${c.sub}<i></i></div></div><div class="grain"></div>`;
}
const CH = '#2B4C9B';
function film(s, i, n) {
  const pg = s.page, ink = s.ink;
  return `<style>
  body{background:${pg}}
  .wall{position:absolute;inset:0;background:
     repeating-linear-gradient(90deg,rgba(255,255,255,.22) 0 46px,rgba(255,255,255,0) 46px 50px,rgba(0,0,0,.035) 50px 54px,rgba(255,255,255,0) 54px 92px),
     radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.18),rgba(0,0,0,.16) 95%)}
  .hdr{position:absolute;top:50px;left:76px;right:76px;display:flex;justify-content:space-between;align-items:baseline;color:${ink}}
  .hdr span{font-family:Jost;font-weight:600;font-size:18px;letter-spacing:.34em}
  .hdr b{font-family:Pinyon;font-weight:400;font-size:44px;line-height:1}
  .print{position:absolute;left:70px;right:70px;top:110px;height:590px;background:#FBF6EC;padding:22px;box-shadow:0 2px 0 rgba(0,0,0,.05),0 22px 44px rgba(40,30,30,.28)}
  .print:before{content:'';position:absolute;inset:11px;border:1px solid rgba(160,130,80,.55)}
  .print div{width:100%;height:100%;overflow:hidden;position:relative}
  .print img{width:100%;height:100%;object-fit:cover;object-position:${s.x??50}% ${s.y??50}%;filter:saturate(.95) contrast(1.04) sepia(.06)}
  .print div:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 50px rgba(40,25,10,.28)}
  .sau{position:absolute;left:${s.cx||640}px;top:575px;width:350px;height:350px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#FFFFFF,#EEE9E2 70%,#DCD5CC);
    box-shadow:0 18px 40px rgba(30,20,30,.35),0 3px 6px rgba(0,0,0,.15)}
  .sau:before{content:'';position:absolute;inset:12px;border-radius:50%;border:7px solid ${CH};opacity:.92}
  .sau:after{content:'';position:absolute;inset:26px;border-radius:50%;border:3px dotted ${CH};opacity:.8}
  .cup{position:absolute;left:${(s.cx||640)+52}px;top:${575+52}px;width:246px;height:246px;border-radius:50%;background:#FFFFFF;box-shadow:0 8px 18px rgba(30,20,30,.3)}
  .cup:before{content:'';position:absolute;inset:6px;border-radius:50%;border:4px solid ${CH}}
  .hdl{position:absolute;left:${(s.cx||640)+286}px;top:${575+150}px;width:62px;height:48px;border-radius:24px;border:13px solid #FFFFFF;background:transparent;box-shadow:0 6px 12px rgba(30,20,30,.25)}
  .tea{position:absolute;left:${(s.cx||640)+70}px;top:${575+70}px;width:210px;height:210px;border-radius:50%;overflow:hidden;box-shadow:inset 0 0 0 3px rgba(120,80,40,.25)}
  .tea img{width:100%;height:100%;object-fit:cover;object-position:${s.x2??50}% ${s.y2??50}%;filter:saturate(.95) sepia(.1)}
  .tea:after{content:'';position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 35% 30%,rgba(255,255,255,.28),rgba(255,255,255,0) 35%),radial-gradient(circle,rgba(0,0,0,0) 60%,rgba(60,30,10,.35))}
  .no{position:absolute;left:84px;top:736px;font-family:Jost;font-weight:600;font-size:18px;letter-spacing:.34em;color:${ink};opacity:.75}
  .ttl{position:absolute;left:80px;width:${s.tw||560}px;top:772px;font-family:Gloock;font-size:${s.fs||86}px;line-height:.98;color:${ink}}
  .meta{position:absolute;left:84px;top:${772+(s.tl||1)*Math.round((s.fs||86)*.98)+22}px;font-family:Jost;font-weight:500;font-size:21px;letter-spacing:.2em;color:#3A3330;opacity:.85}
  .line{position:absolute;left:84px;width:540px;top:${772+(s.tl||1)*Math.round((s.fs||86)*.98)+82}px;font-family:Corm;font-style:italic;font-weight:500;font-size:42px;line-height:1.16;color:#2E2826}
  .line:before{content:'';display:block;width:64px;height:2px;background:${ink};margin-bottom:20px}
  .str{position:absolute;left:${(s.cx||640)+300}px;top:${575+190}px;width:2px;height:${1000-575-190+40}px;background:rgba(240,235,225,.9);transform-origin:top;transform:rotate(${s.sr??6}deg);box-shadow:0 0 1px rgba(0,0,0,.3)}
  .tag{position:absolute;left:${s.tagx||700}px;top:1020px;width:300px;height:250px;background:#FBF6EC;transform:rotate(${s.tr??-3}deg);box-shadow:0 12px 26px rgba(40,30,30,.3);text-align:center;padding-top:30px;
    clip-path:polygon(0 14px,14px 0,calc(100% - 14px) 0,100% 14px,100% 100%,0 100%)}
  .tag:before{content:'';position:absolute;inset:10px;border:1px solid ${CH};opacity:.6}
  .tag .k{font-family:Jost;font-weight:600;font-size:15px;letter-spacing:.36em;color:${CH}}
  .tag .b{font-family:Gloock;font-size:34px;line-height:1.05;color:#2A2422;margin-top:10px;padding:0 20px}
  .tag .s{font-family:Corm;font-style:italic;font-weight:600;font-size:26px;color:#5A4A40;margin-top:10px}
  .tag .d{width:60px;height:1px;background:${CH};margin:12px auto 0;opacity:.6}
  .tag .st{font-family:Jost;font-weight:600;font-size:16px;letter-spacing:.3em;color:${CH};margin-top:12px}
  </style>
  <div class="wall"></div>
  <div class="hdr"><span>TEA FOR ONE · Nº 0${i+1} / 0${n}</span><b>a cup of tea</b></div>
  <div class="print"><div><img src="file://${D}/${s.img}"></div></div>
  <div class="str"></div>
  <div class="sau"></div><div class="hdl"></div><div class="cup"></div><div class="tea"><img src="file://${D}/${s.img2}"></div>
  <div class="ttl">${s.t}</div>
  <div class="meta">${s.dir.toUpperCase()} · ${s.yr}</div>
  <div class="line">${s.ov}</div>
  <div class="tag"><div class="k">THE BLEND</div><div class="b">${s.blend}</div><div class="s">${s.with}</div><div class="d"></div><div class="st">STEEP ${s.steep}</div></div>
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
