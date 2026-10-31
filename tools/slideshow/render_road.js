// "late autumn road trip" — cover: Straight Story road with extended painted autumn-dusk sky; inside: HIGHWAY SIGN layout
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Damion','damion',400), ff('Slab','alfa-slab-one',400), ff('Archivo','archivo',500), ff('Archivo','archivo',700),
  ff('News','newsreader',400,'italic'), ff('News','newsreader',500,'italic'), ff('Over','overpass',600), ff('Over','overpass',700), ff('Over','overpass',800),
  ff('OMono','overpass-mono',500), ff('OMono','overpass-mono',600)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const GOLD = '#FFC83D';
function cover(c) {
  return `<style>
  body{background:linear-gradient(180deg,#4A6A8C 0%,#6A86A0 16%,#9AA8B0 29%,#C9C5B8 39%,#E6DCC8 47%,#EDE3CF 54%)}
  .img{position:absolute;left:0;right:0;bottom:0;height:${c.ih||930}px;overflow:hidden;
    -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.fade||170}px)}
  .img img{position:absolute;height:100%;left:50%;transform:translateX(-${c.x||52}%);filter:saturate(.92) contrast(1.04) sepia(.12) brightness(.98)}
  .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,170,90,.0) 30%,rgba(255,150,70,.10) 70%,rgba(60,30,10,.25));mix-blend-mode:soft-light}
  .glow{position:absolute;left:0;right:0;top:330px;height:260px;background:radial-gradient(ellipse at 50% 70%,rgba(255,214,150,.35),rgba(255,214,150,0) 65%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.32) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.ty||70}px;text-align:center}
  .kick{font-family:Archivo;font-weight:700;font-size:23px;letter-spacing:.5em;color:#FBF4E6;padding-left:.5em;text-shadow:0 1px 10px rgba(20,30,50,.45)}
  .scr{font-family:Damion;font-size:210px;line-height:1;color:${GOLD};margin-top:6px;transform:rotate(-4deg);
    text-shadow:0 3px 0 rgba(120,70,0,.35),0 8px 30px rgba(30,40,60,.45)}
  .slab{font-family:Slab;font-size:58px;letter-spacing:.2em;color:#FBF4E6;padding-left:.2em;margin-top:-6px;text-shadow:0 2px 16px rgba(20,30,50,.45)}
  .dash{display:flex;gap:14px;justify-content:center;margin:20px 0 0}
  .dash i{width:34px;height:6px;background:${GOLD};border-radius:2px;box-shadow:0 1px 6px rgba(0,0,0,.25)}
  .sub{position:absolute;left:0;right:0;bottom:${c.sb||70}px;text-align:center;font-family:News;font-style:italic;font-weight:500;font-size:40px;color:#FBF4E6;text-shadow:0 2px 14px rgba(0,0,0,.6)}
  .shade{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(20,14,8,.55))}
  </style>
  <div class="img"><img src="file://${D}/${c.img}"><div class="warm"></div></div><div class="glow"></div><div class="vig"></div><div class="shade"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="scr">${c.h}</div><div class="slab">${c.h2}</div><div class="dash"><i></i><i></i><i></i><i></i><i></i></div></div>
  <div class="sub">${c.sub}</div><div class="grain"></div>`;
}
const SIGNS = { green:['#1F6A45','#fff','#fff'], brown:['#6B4426','#fff','#fff'], blue:['#1F4C94','#fff','#fff'], yellow:['#F4C431','#161616','#161616'], white:['#F3F0E8','#161616','#161616'] };
function film(s, i, n) {
  const [bg, fg, bd] = SIGNS[s.sign];
  const dashes = Array.from({length:n},(_,k)=>`<i style="background:${k===i?GOLD:'rgba(255,255,255,.28)'}"></i>`).join('');
  return `<style>
  body{background:#24252A}
  .asph{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,#34353B,#1C1D21 75%)}
  .lane{position:absolute;left:34px;top:0;bottom:0;width:6px;background:repeating-linear-gradient(180deg,${GOLD} 0 46px,transparent 46px 84px);opacity:.75}
  .lane2{left:auto;right:34px}
  .hdr{position:absolute;top:44px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center;color:#E9E2D2;font-family:OMono;font-weight:600;font-size:21px;letter-spacing:.24em}
  .hdr b{font-family:Damion;font-weight:400;font-size:40px;letter-spacing:0;color:${GOLD}}
  .win{position:absolute;left:70px;right:70px;top:110px;height:590px;border-radius:26px;overflow:hidden;box-shadow:0 18px 50px rgba(0,0,0,.55);border:3px solid rgba(255,255,255,.12)}
  .win img{width:100%;height:100%;object-fit:cover;object-position:${s.x??50}% ${s.y??50}%;filter:${s.bw?'grayscale(1) contrast(1.05) brightness(1.02) sepia(.12)':'saturate(.9) contrast(1.03) sepia(.1)'}}
  .win:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(0,0,0,0) 30%,rgba(0,0,0,.18))}
  .mirror{position:absolute;left:${s.mx??375}px;top:76px;width:330px;height:132px;border-radius:66px;background:#141416;padding:9px;box-shadow:0 10px 26px rgba(0,0,0,.6)}
  .mirror:before{content:'';position:absolute;left:50%;top:-40px;width:14px;height:42px;margin-left:-7px;background:#141416;border-radius:4px}
  .mirror div{width:100%;height:100%;border-radius:58px;overflow:hidden;position:relative}
  .mirror img{width:100%;height:100%;object-fit:cover;object-position:${s.mxp??'50% 50%'};transform:scaleX(-1);filter:${s.bw?'grayscale(1) contrast(1.05) sepia(.1)':'saturate(.9) sepia(.08)'}}
  .mirror div:after{content:'';position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,255,255,.22),rgba(255,255,255,0) 40%)}
  .sign{position:absolute;left:96px;right:96px;top:760px;height:330px;background:${bg};border-radius:24px;box-shadow:0 16px 40px rgba(0,0,0,.5)}
  .sign:before{content:'';position:absolute;inset:12px;border:5px solid ${bd};border-radius:16px}
  .tab{position:absolute;right:56px;top:-58px;height:70px;padding:0 26px;background:${bg};border-radius:14px 14px 0 0;display:flex;align-items:center;font-family:Over;font-weight:800;font-size:30px;letter-spacing:.06em;color:${fg};box-shadow:0 -6px 20px rgba(0,0,0,.25)}
  .tab:before{content:'';position:absolute;inset:10px 10px 0 10px;border:4px solid ${bd};border-bottom:none;border-radius:9px 9px 0 0}
  .shield{position:absolute;left:46px;top:44px;width:74px;height:80px}
  .sc{position:absolute;left:150px;right:46px;top:38px;bottom:34px;display:flex;flex-direction:column;justify-content:center;color:${fg}}
  .ttl{font-family:Over;font-weight:800;font-size:${s.fs||88}px;line-height:1.02;letter-spacing:-.005em}
  .meta{font-family:Over;font-weight:700;font-size:26px;letter-spacing:.12em;margin-top:16px;display:flex;align-items:center;gap:14px;opacity:.95}
  .meta svg{width:46px;height:28px}
  .post{position:absolute;top:1088px;width:16px;height:60px;background:linear-gradient(90deg,#6C6F75,#A9ACB2,#6C6F75)}
  .line{position:absolute;left:90px;right:90px;top:1160px;text-align:center;font-family:News;font-style:italic;font-weight:400;font-size:41px;line-height:1.22;color:#F3EBDB}
  .prog{position:absolute;bottom:52px;left:0;right:0;display:flex;gap:12px;justify-content:center}
  .prog i{width:44px;height:6px;border-radius:2px}
  </style>
  <div class="asph"></div><div class="lane"></div><div class="lane lane2"></div>
  <div class="hdr"><span>STOP 0${i+1} / 0${n}</span><span>LATE AUTUMN</span></div>
  <div class="win"><img src="file://${D}/${s.img}"></div>
  <div class="mirror"><div><img src="file://${D}/${s.img2}"></div></div>
  <div class="post" style="left:300px"></div><div class="post" style="left:764px"></div>
  <div class="sign"><div class="tab">EXIT ${s.yr}</div>
    <svg class="shield" viewBox="0 0 74 80"><path d="M6 6 Q37 -2 68 6 Q74 40 37 76 Q0 40 6 6Z" fill="${fg}"/><path d="M11 11 Q37 4 63 11 Q67 40 37 69 Q7 40 11 11Z" fill="${bg}"/><text x="37" y="48" text-anchor="middle" font-family="Over" font-weight="800" font-size="30" fill="${fg}">${i+1}</text></svg>
    <div class="sc"><div class="ttl">${s.t}</div><div class="meta">DIR. ${s.dir.toUpperCase()}<svg viewBox="0 0 46 28"><path d="M2 14H38M28 4L40 14 28 24" stroke="${fg}" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div></div></div>
  <div class="line">${s.ov}</div>
  <div class="prog">${dashes}</div><div class="grain"></div>`;
}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const films = S.films;
  const jobs = [['01_cover.jpg', cover(S.cover)], ...films.map((s, i) => [`0${i+2}_${s.slug}.jpg`, film(s, i, films.length)])];
  for (const [f, body] of jobs) {
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
