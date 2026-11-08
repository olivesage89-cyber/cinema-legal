// "movies that feel like a symphony": cover = Fantasia's magenta/violet/gold silhouette orchestra w/ the conductor
// on his podium, full-bleed 4:5, text top-centred over a deep plum fade: Tenor Sans spaced kicker, rose Ballet 'a',
// giant gold Abril Fatface SYMPHONY w/ warm glow, Cormorant Infant italic sub, Tenor footer.
// Inside = CONCERT TICKET: per-film velvet page w/ spotlight glow, 'MOVEMENT Nº 0X / 05' + Ballet header, big still in
// a thin gilt frame, tilted ivory ticket w/ perforated stub (ADMIT ONE / seat), Abril title in per-film ink,
// Tenor DIR · year, Cormorant italic line, Ballet tempo marking.   node render_symphony.js DIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_sym.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('abril-fatface', 400) + css('ballet', 400) + css('tenor-sans', 400) + css('cormorant-infant', '500-italic') + css('cormorant-infant', '600-italic') + css('cormorant-infant', 600);
const grain = (o = .16) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;

function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#120714}
  .img{position:absolute;inset:0;background:url(file://${D}/${c.img}) ${c.bx}% ${c.by}%/auto ${c.bh}px no-repeat;filter:saturate(1.08) contrast(1.05)}
  .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,5,16,.94) 0%,rgba(14,5,16,.82) 22%,rgba(14,5,16,.35) 42%,rgba(14,5,16,0) 56%,rgba(10,4,10,0) 80%,rgba(8,3,8,.75) 100%)}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 60%,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
  .t{position:absolute;left:0;right:0;top:${c.top}px;text-align:center;z-index:5}
  .kick{font:400 25px 'Tenor Sans';letter-spacing:.42em;color:#EBD7F3;padding-left:.42em}
  .a{font:400 150px 'Ballet';color:#FF8CCB;line-height:1;margin:6px 0 0 -560px;position:relative;z-index:2;transform:rotate(-8deg);text-shadow:0 0 30px rgba(255,61,170,.45)}
  .h{font:400 168px 'Abril Fatface';color:#F6CB72;letter-spacing:.015em;line-height:.9;margin-top:26px;
     text-shadow:0 0 40px rgba(246,190,90,.38),0 4px 24px rgba(0,0,0,.6)}
  .rule{display:flex;align-items:center;justify-content:center;gap:18px;margin:28px auto 0;width:520px}
  .rule i{flex:1;height:1px;background:linear-gradient(90deg,transparent,#F6CB72aa)}
  .rule i:last-child{background:linear-gradient(90deg,#F6CB72aa,transparent)}
  .rule b{width:9px;height:9px;transform:rotate(45deg);border:1.5px solid #F6CB72}
  .sub{font:500 italic 38px 'Cormorant Infant';color:#F3E6F6;margin-top:20px;line-height:1.25}
  .sub em{color:#FF8CCB;font-weight:600}
  .foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font:400 19px 'Tenor Sans';letter-spacing:.5em;color:#F6CB72;padding-left:.5em;z-index:5;opacity:.9}
  </style></head><body><div class="img"></div><div class="fade"></div><div class="vig"></div>
  <div class="t"><div class="kick">MOVIES THAT FEEL LIKE A</div><div class="h">SYMPHONY</div>
  <div class="rule"><i></i><b></b><i></i></div>
  <div class="sub">${c.sub}</div></div>
  <div class="foot">FIVE FILMS · FIVE MOVEMENTS</div>${grain(.18)}</body></html>`;
}

function inside(m, i, n) {
  const notch = `radial-gradient(circle at 0 50%,transparent 22px,#F2EADB 23px)`;
  return `<html><head>${fonts}<style>${base}
  body{background:${m.bg};background:radial-gradient(ellipse 75% 55% at 50% 30%,${m.glow} 0%,${m.bg} 70%)}
  .hd{position:absolute;top:56px;left:62px;right:62px;display:flex;justify-content:space-between;align-items:center;font:400 19px 'Tenor Sans';letter-spacing:.34em;color:#E9D9B8cc}
  .hd .sc{font:400 46px 'Ballet';letter-spacing:0;color:${m.acc};margin-top:-8px}
  .fr{position:absolute;left:58px;top:128px;width:964px;height:616px;border:1.5px solid #C9A45Ccc;padding:11px;box-shadow:0 30px 60px rgba(0,0,0,.55)}
  .fr:after{content:'';position:absolute;inset:4px;border:1px solid #C9A45C55;pointer-events:none}
  .st{width:100%;height:100%;background:url(file://${D}/${m.img}) ${m.x}% ${m.y}%/cover;filter:saturate(1.05) contrast(1.04)}
  .tk{position:absolute;left:96px;top:806px;width:888px;height:438px;transform:rotate(${m.rot}deg);display:flex;filter:drop-shadow(0 22px 34px rgba(0,0,0,.55))}
  .stub{width:190px;background:#F2EADB;border-radius:14px 0 0 14px;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;border-right:3px dashed ${m.ink}55}
  .stub .ad{font:400 17px 'Tenor Sans';letter-spacing:.32em;color:${m.ink};writing-mode:vertical-rl;transform:rotate(180deg)}
  .stub .seat{position:absolute;bottom:28px;font:400 15px 'Tenor Sans';letter-spacing:.2em;color:#5b5047}
  .stub .no{position:absolute;top:26px;font:400 40px 'Abril Fatface';color:${m.ink}}
  .main{flex:1;background:#F2EADB;border-radius:0 14px 14px 0;position:relative;padding:40px 46px 0 50px;overflow:hidden}
  .main:before{content:'';position:absolute;inset:14px;border:1.5px solid ${m.ink}66;border-radius:6px;pointer-events:none}
  .main:after{content:'';position:absolute;inset:20px;border:1px solid ${m.ink}33;border-radius:4px;pointer-events:none}
  .ev{font:400 15px 'Tenor Sans';letter-spacing:.3em;color:#6b5f55;margin-top:2px}
  .ti{font:400 ${m.fs}px 'Abril Fatface';color:${m.ink};line-height:1.0;margin-top:14px}
  .dr{font:400 18px 'Tenor Sans';letter-spacing:.24em;color:#3a322c;margin-top:14px}
  .ln{font:500 italic 31px 'Cormorant Infant';color:#2e2722;margin-top:16px;line-height:1.2;max-width:640px}
  .bt{position:absolute;left:50px;right:46px;bottom:36px;display:flex;justify-content:space-between;font:400 14px 'Tenor Sans';letter-spacing:.28em;color:#7a6c60;border-top:1px solid ${m.ink}44;padding-top:12px}
  .bt .tm{font:400 40px 'Ballet';letter-spacing:0;color:${m.ink};margin-top:-16px;text-transform:none}
  .tempo{position:absolute;right:54px;bottom:70px;font:400 50px 'Ballet';color:${m.ink};transform:rotate(-6deg)}
  </style></head><body>
  <div class="hd"><span>MOVEMENT Nº 0${i}</span><span class="sc">a symphony</span><span>0${i} / 0${n}</span></div>
  <div class="fr"><div class="st"></div></div>
  <div class="tk"><div class="stub"><div class="no">0${i}</div><div class="ad">ADMIT ONE</div><div class="seat">SEAT ${m.seat}</div></div>
   <div class="main"><div class="ev">EVENING PERFORMANCE</div><div class="ti">${m.t}</div>
   <div class="dr">${m.dir} · ${m.yr}</div><div class="ln">${m.ov}</div><div class="bt"><span>ORCHESTRA STALLS</span><span class="tm">${m.tempo}</span><span>7:30 PM</span></div></div></div>
  ${grain(.14)}</body></html>`;
}

(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, f) => { fs.writeFileSync(D + '/tmp.html', html); await p.goto('file://' + D + '/tmp.html'); await p.waitForTimeout(500);
    await p.screenshot({ path: D + '/out/' + f, type: 'jpeg', quality: 93 }); };
  await shot(cover(S.cover), '01_cover.jpg');
  for (let i = 0; i < S.movies.length; i++) await shot(inside(S.movies[i], i + 1, S.movies.length), `0${i + 2}_${S.movies[i].slug}.jpg`);
  await b.close();
})();
