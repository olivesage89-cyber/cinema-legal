// "nostalgic for a time you never lived" — cover: Gauche pink-sky cliff set low under extended dusky-rose sky;
// inside: RETRO TV (70s wallpaper page per film, wooden CRT set w/ rabbit ears showing the still, TV-listing text).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Mon', 'monsieur-la-doulaise', 400), ff('Fr', 'fraunces', 400, 'italic'), ff('Fr', 'fraunces', 600, 'italic'), ff('Fr', 'fraunces', 800, 'italic'),
  ff('Fr', 'fraunces', 800), ff('Fr', 'fraunces', 500), ff('Cp', 'courier-prime', 400), ff('Cp', 'courier-prime', 700)].join('');
const grain = `<div class="grain"></div>`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.20;mix-blend-mode:overlay;pointer-events:none;z-index:50;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  const css = `${base}
body{background:#B88E92}
.sky{position:absolute;inset:0;background:url(file://${D}/${c.img}) center 20%/cover;filter:blur(38px) saturate(1.5);transform:scale(1.25)}
.skyg{position:absolute;inset:0;background:linear-gradient(180deg,#8E6A86 0%,#B98C9B 30%,rgba(233,180,178,.55) 55%,rgba(233,180,178,0) 70%)}
.im{position:absolute;left:0;bottom:0;width:1080px;height:${c.imh}px;background:url(file://${D}/${c.img}) ${c.x}% 50%/cover;
  filter:saturate(1.12) contrast(.97) sepia(.08);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 210px)}
.warm{position:absolute;inset:0;background:radial-gradient(ellipse at 70% 60%,rgba(255,190,160,.22),rgba(0,0,0,0) 60%);mix-blend-mode:soft-light}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(60,20,40,.30) 100%)}
.t{position:absolute;left:0;right:0;top:120px;text-align:center;color:${c.ink}}
.kick{font-family:Cp;font-weight:700;font-size:25px;letter-spacing:.42em;padding-left:.42em}
.hero{font-family:Mon;font-size:236px;line-height:1;margin-top:18px;color:${c.ink};text-shadow:0 2px 30px rgba(255,225,220,.35)}
.l2{font-family:Fr;font-weight:600;font-style:italic;font-size:58px;margin-top:34px;letter-spacing:-.01em}
.l2 b{font-weight:800;color:${c.acc}}
.sub{font-family:Fr;font-style:italic;font-weight:400;font-size:31px;margin-top:22px;opacity:.9}
.sw{position:absolute;bottom:46px;left:0;right:0;text-align:center;font-family:Cp;font-weight:700;font-size:21px;letter-spacing:.4em;color:#FFF3EC;text-shadow:0 1px 10px rgba(0,0,0,.45)}`;
  return `<html><head><style>${css}</style></head><body><div class="sky"></div><div class="skyg"></div><div class="im"></div><div class="warm"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="hero">${c.h}</div><div class="l2">${c.h2}</div><div class="sub">${c.sub}</div></div>
<div class="sw">${c.swipe}</div>${grain}</body></html>`;
}

function tv(m, i, n) {
  const css = `${base}
body{background:${m.bg}}
.wall{position:absolute;inset:0;background:repeating-linear-gradient(90deg,${m.bg} 0 54px,${m.bg2} 54px 62px,${m.bg} 62px 70px,${m.bg2} 70px 74px,${m.bg} 74px 128px)}
.wall:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,240,210,.20),rgba(0,0,0,0) 55%,rgba(0,0,0,.32) 100%)}
.top{position:absolute;top:54px;left:70px;right:70px;display:flex;justify-content:space-between;font-family:Cp;font-weight:700;font-size:23px;letter-spacing:.24em;color:${m.cream}}
.top span:last-child{background:${m.cream};color:${m.bg};padding:6px 14px 4px 18px;border-radius:4px}
.ant{position:absolute;left:540px;top:208px;width:0;height:0}
.ant i{position:absolute;bottom:0;left:-3px;width:6px;height:170px;background:linear-gradient(90deg,#9a9a9a,#eee,#888);border-radius:3px;transform-origin:bottom center}
.ant i:nth-child(1){transform:rotate(-28deg)}.ant i:nth-child(2){transform:rotate(24deg)}
.ant i:after{content:'';position:absolute;top:-8px;left:-5px;width:16px;height:16px;border-radius:50%;background:#ddd}
.ant b{position:absolute;left:-60px;top:-30px;width:120px;height:44px;border-radius:60px 60px 8px 8px;background:#2b2522}
.set{position:absolute;left:80px;top:200px;width:920px;height:640px;border-radius:46px;
  background:linear-gradient(180deg,#8B5A36,#6E4326 40%,#5A361F);box-shadow:0 30px 60px rgba(0,0,0,.40),inset 0 3px 0 rgba(255,220,180,.25),inset 0 -6px 0 rgba(0,0,0,.25)}
.set:before{content:'';position:absolute;inset:0;border-radius:46px;opacity:.35;mix-blend-mode:overlay;
  background:repeating-linear-gradient(178deg,rgba(255,255,255,.0) 0 7px,rgba(255,255,255,.35) 7px 8px,rgba(0,0,0,.25) 8px 11px,rgba(255,255,255,0) 11px 19px)}
.bezel{position:absolute;left:34px;top:34px;width:680px;height:572px;border-radius:40px;background:#1b1714;box-shadow:inset 0 0 0 6px #2e2723,inset 0 4px 10px rgba(0,0,0,.7)}
.scr{position:absolute;left:26px;top:26px;width:628px;height:520px;border-radius:70px / 54px;overflow:hidden;background:#000;box-shadow:0 0 30px ${m.glow}}
.scr img{width:100%;height:100%;object-fit:cover;object-position:${m.x}% ${m.y ?? 50}%;filter:saturate(1.12) contrast(1.04) brightness(1.03)}
.scan{position:absolute;inset:0;background:repeating-linear-gradient(180deg,rgba(0,0,0,.0) 0 2px,rgba(0,0,0,.16) 2px 4px)}
.glass{position:absolute;inset:0;border-radius:70px / 54px;background:radial-gradient(ellipse at 30% 18%,rgba(255,255,255,.22),rgba(255,255,255,0) 40%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 62%,rgba(0,0,0,.55) 100%);box-shadow:inset 0 0 40px rgba(0,0,0,.6)}
.panel{position:absolute;right:34px;top:34px;width:150px;height:572px;border-radius:22px;background:linear-gradient(180deg,#D8C7A6,#BBA680);box-shadow:inset 0 2px 0 rgba(255,255,255,.5),inset 0 -3px 6px rgba(0,0,0,.25)}
.knob{position:absolute;left:31px;width:88px;height:88px;border-radius:50%;background:radial-gradient(circle at 38% 32%,#5a5350,#211d1b 70%);box-shadow:0 6px 10px rgba(0,0,0,.4),inset 0 2px 2px rgba(255,255,255,.2)}
.knob:after{content:'';position:absolute;left:41px;top:8px;width:6px;height:26px;border-radius:3px;background:${m.acc}}
.k1{top:40px}.k2{top:160px}.k2:after{transform:rotate(60deg);transform-origin:3px 36px}
.chn{position:absolute;left:0;right:0;top:268px;text-align:center;font-family:Cp;font-weight:700;font-size:22px;color:#3a2d20;letter-spacing:.1em}
.chn b{display:block;font-family:Fr;font-weight:800;font-size:58px;color:${m.acc2};letter-spacing:0;line-height:1}
.spk{position:absolute;left:24px;right:24px;top:372px;height:170px;border-radius:12px;background:repeating-linear-gradient(180deg,#3a2d22 0 5px,#C5B08A 5px 12px)}
.leg{position:absolute;top:832px;width:22px;height:46px;background:#3a2516;border-radius:0 0 6px 6px}
.l1{left:190px;transform:skewX(12deg)}.l2{right:190px;transform:skewX(-12deg)}
.txt{position:absolute;left:80px;right:80px;top:912px;color:${m.cream}}
.meta{font-family:Cp;font-weight:700;font-size:23px;letter-spacing:.2em;color:${m.acc}}
.ttl{font-family:Fr;font-weight:800;font-style:italic;font-size:${m.fs || 78}px;line-height:1.0;margin-top:14px;letter-spacing:-.015em;text-shadow:0 3px 0 rgba(0,0,0,.18)}
.line{font-family:Fr;font-weight:400;font-style:italic;font-size:36px;line-height:1.3;margin-top:18px;opacity:.95}
.dots{position:absolute;bottom:52px;left:80px;display:flex;gap:12px}
.dots i{width:13px;height:13px;border-radius:50%;border:2px solid ${m.cream}}.dots i.on{background:${m.cream}}
.pg{position:absolute;bottom:46px;right:80px;font-family:Cp;font-weight:700;font-size:21px;letter-spacing:.3em;color:${m.cream};opacity:.85}`;
  const dots = Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  return `<html><head><style>${css}</style></head><body><div class="wall"></div>
<div class="top"><span>Nº 0${i + 1} / 0${n}</span><span>${m.slot}</span></div>
<div class="ant"><i></i><i></i><b></b></div>
<div class="leg l1"></div><div class="leg l2"></div>
<div class="set"><div class="bezel"><div class="scr"><img src="file://${D}/${m.img}"><div class="scan"></div><div class="glass"></div></div></div>
<div class="panel"><div class="knob k1"></div><div class="knob k2"></div><div class="chn">CH<b>${m.ch}</b></div><div class="spk"></div></div></div>
<div class="txt"><div class="meta">${m.meta}</div><div class="ttl">${m.t}</div><div class="line">${m.ov}</div></div>
<div class="dots">${dots}</div><div class="pg">${m.yr}</div>${grain}</body></html>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, tv(m, i, S.movies.length)])];
  for (const [f, html] of pages) {
    if (process.argv[3] && !f.startsWith(process.argv[3])) continue;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
