// "anime for a rainy day": cover = After the Rain, Akira looking up into the rain at night under warm apartment windows,
// image set low under an extended blurred top; fine rain streaks over everything. Red Hat Display spaced kicker,
// giant rain-lilac Rozha One 'rainy' + tilted white Ephesis 'day', Brygada 1918 italic sub, footer.
// Inside = RAIN WINDOW: per-film dark page, the still seen through a painted wooden window frame covered in raindrops,
// a fogged-up bottom strip where a word is finger-written (wiped clear), a tucked polaroid w/ 2nd still, wooden sill,
// 'Nº 0X / 05' + rain-forecast clock header (1:40 pm light rain → 5:30 pm clearing), Brygada title, Red Hat caps meta
// in per-film accent, Brygada italic line, 5 raindrop progress. node render_rain.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_rain.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('rozha-one', 400) + css('ephesis', 400) + css('red-hat-display', 500) + css('red-hat-display', 600) + css('red-hat-display', 700) +
  css('brygada-1918', 500) + css('brygada-1918', 600) + css('brygada-1918', '400-italic') + css('brygada-1918', '500-italic') + css('covered-by-your-grace', 400);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
// fine falling rain streaks
const rain = (w, h, n, op) => { let s = ''; for (let k = 0; k < n; k++) { const x = rnd() * (w + 200) - 100, y = rnd() * h, l = 30 + rnd() * 70;
  s += `<line x1="${x}" y1="${y}" x2="${x - l * .18}" y2="${y + l}" stroke="rgba(230,235,255,${(.15 + rnd() * .35).toFixed(2)})" stroke-width="${(1 + rnd() * 1.3).toFixed(1)}" stroke-linecap="round"/>`; }
  return `<svg width="${w}" height="${h}" style="position:absolute;left:0;top:0;opacity:${op};pointer-events:none;z-index:6">${s}</svg>`; };
// raindrops on glass: round beads w/ highlight + a few running drops w/ trails
const drops = (w, h, n) => { let s = `<defs><radialGradient id="dg" cx=".35" cy=".3" r=".75"><stop offset="0" stop-color="#fff" stop-opacity=".85"/><stop offset=".25" stop-color="#fff" stop-opacity=".18"/>
  <stop offset=".75" stop-color="#000" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient></defs>`;
  for (let k = 0; k < n; k++) { const x = rnd() * w, y = rnd() * h, r = rnd() < .85 ? 2 + rnd() * 5 : 7 + rnd() * 7, ry = r * (1.05 + rnd() * .25);
    s += `<ellipse cx="${x}" cy="${y}" rx="${r}" ry="${ry}" fill="url(#dg)" stroke="rgba(255,255,255,.22)" stroke-width=".8"/>`; }
  for (let k = 0; k < 7; k++) { const x = 40 + rnd() * (w - 80), y0 = rnd() * h * .5, y1 = y0 + 90 + rnd() * 220, r = 5 + rnd() * 3;
    s += `<path d="M${x} ${y0} Q ${x + 6} ${(y0 + y1) / 2} ${x - 2} ${y1}" stroke="rgba(255,255,255,.2)" stroke-width="${r * .7}" fill="none" stroke-linecap="round"/>
      <ellipse cx="${x - 2}" cy="${y1 + r}" rx="${r}" ry="${r * 1.35}" fill="url(#dg)" stroke="rgba(255,255,255,.3)" stroke-width=".8"/>`; }
  return `<svg width="${w}" height="${h}" style="position:absolute;inset:0;z-index:4">${s}</svg>`; };
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:#15130F}
  .ext{position:absolute;left:0;right:0;top:0;height:${c.top + 300}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;filter:blur(34px) brightness(.38) saturate(1.1);transform:scaleY(-1)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.04) contrast(1.06) brightness(.95)}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,12,22,.88) 0,rgba(14,12,22,.72) ${c.top}px,rgba(14,12,22,.25) ${c.top + 260}px,rgba(14,12,22,0) ${c.top + 420}px,rgba(14,12,22,0) 82%,rgba(14,12,22,.55) 100%)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:600 25px 'Red Hat Display';letter-spacing:.52em;padding-left:.52em;color:#ECE8FF;z-index:9}
  .g{position:absolute;left:0;right:0;top:${c.ty + 22}px;text-align:center;font:400 ${c.gs}px/1 'Rozha One';color:${c.ink};letter-spacing:-.01em;z-index:9;
     text-shadow:0 0 60px rgba(175,160,255,.35),0 12px 40px rgba(6,4,20,.6)}
  .d{position:absolute;left:${c.dx}px;top:${c.ty + c.gs * .72}px;font:400 ${c.ds}px/1 'Ephesis';color:#FFFFFF;transform:rotate(-7deg);z-index:10;text-shadow:0 6px 26px rgba(6,4,20,.8)}
  .sub{position:absolute;left:0;right:0;top:${c.sy}px;text-align:center;font:italic 400 37px/1.32 'Brygada 1918';color:#EEEAF8;text-shadow:0 4px 20px rgba(6,4,20,.9);z-index:9}
  .sub b{font-weight:500;color:${c.ink}}
  .tk{position:absolute;left:0;right:0;bottom:46px;text-align:center;font:600 17px 'Red Hat Display';letter-spacing:.46em;padding-left:.46em;color:rgba(255,255,255,.86);text-shadow:0 2px 12px rgba(6,4,20,.8);z-index:9}
  </style></head><body><div class="ext"></div><div class="img"></div><div class="shade"></div>${rain(1080, 1350, 170, .55)}
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="d">${c.d}</div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.14)}</body></html>`;
}
function inside(m, i, n) {
  seed = 11 + i * 97;
  const L = 64, T = 156, W = 952, H = 700, fr = 24, fog = 170;
  const gw = W - fr * 2, gh = H - fr * 2;
  const bg = `url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover`;
  const prog = Array.from({ length: n }, (_, k) => `<svg width="22" height="30" viewBox="0 0 22 30"><path d="M11 2 C 6 11, 2 16, 2 20 a9 9 0 0 0 18 0 C 20 16, 16 11, 11 2Z"
     fill="${k < i ? m.acc : 'none'}" stroke="${k < i ? m.acc : 'rgba(255,255,255,.4)'}" stroke-width="1.8"/></svg>`).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:${m.bg}}
  .pg{position:absolute;inset:0;background:radial-gradient(ellipse 80% 60% at 50% 34%,rgba(255,255,255,.07),transparent 70%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.35))}
  .hdr{position:absolute;top:70px;left:${L + 4}px;right:${1080 - L - W + 4}px;display:flex;justify-content:space-between;align-items:center;font:600 18px 'Red Hat Display';letter-spacing:.32em;color:rgba(255,255,255,.72)}
  .hdr b{color:${m.acc};font-weight:700}
  .fc{display:flex;align-items:center;gap:12px;padding:10px 18px 10px 14px;border:1.5px solid rgba(255,255,255,.28);border-radius:40px;letter-spacing:.2em;font-size:16px}
  .frame{position:absolute;left:${L}px;top:${T}px;width:${W}px;height:${H}px;border-radius:4px;
    background:linear-gradient(135deg,#F3EFE6,#DCD5C6 60%,#CFC6B4);box-shadow:0 30px 60px -20px rgba(0,0,0,.7),0 2px 0 rgba(255,255,255,.4) inset}
  .glass{position:absolute;left:${fr}px;top:${fr}px;width:${gw}px;height:${gh}px;overflow:hidden;background:${bg};filter:saturate(1.04) contrast(1.04);
    box-shadow:inset 0 0 0 2px rgba(60,50,40,.35)}
  .sheen{position:absolute;inset:0;background:linear-gradient(118deg,rgba(255,255,255,.0) 30%,rgba(255,255,255,.10) 42%,rgba(255,255,255,0) 52%),linear-gradient(180deg,rgba(20,30,50,.12),rgba(0,0,0,.05));z-index:3}
  .inner{position:absolute;inset:0;box-shadow:inset 0 8px 18px rgba(0,0,0,.45),inset 0 -4px 10px rgba(0,0,0,.25);z-index:7}
  .fog{position:absolute;left:0;right:0;bottom:0;height:${fog + 60}px;background:${bg};filter:blur(16px) brightness(1.25) saturate(.6);
    -webkit-mask:radial-gradient(ellipse 62% 100% at 18% 100%,#000 55%,transparent 100%);z-index:5}
  .fog2{position:absolute;left:0;right:0;bottom:0;height:${fog + 60}px;background:rgba(235,238,245,.5);-webkit-mask:radial-gradient(ellipse 62% 100% at 18% 100%,#000 55%,transparent 100%);z-index:5}
  .wipe{position:absolute;left:${m.wx || 70}px;bottom:${m.wb || 22}px;font:400 ${m.ws || 104}px/1 'Covered By Your Grace';z-index:6;
    background:${bg};background-size:${gw}px ${gh}px;background-position:-${m.wx || 70}px ${-(gh - (m.wb || 22) - (m.ws || 104))}px;
    -webkit-background-clip:text;color:transparent;filter:brightness(.7) saturate(1.25) contrast(1.1);transform:rotate(-3deg);letter-spacing:.02em}
  .sill{position:absolute;left:${L - 30}px;top:${T + H - 6}px;width:${W + 60}px;height:34px;border-radius:3px;background:linear-gradient(180deg,#EDE7DA,#C9BFAB);box-shadow:0 18px 30px -12px rgba(0,0,0,.65);z-index:8}
  .pol{position:absolute;right:${1080 - L - W - 26}px;top:${T + H - 200}px;width:300px;height:262px;background:#FBF9F4;padding:14px 14px 48px;transform:rotate(5deg);z-index:9;
    box-shadow:0 22px 36px -14px rgba(0,0,0,.7)}
  .pol div{width:100%;height:100%;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% ${m.y2 || 50}%/cover;filter:saturate(1.02)}
  .pol span{position:absolute;left:0;right:0;bottom:10px;text-align:center;font:400 27px 'Covered By Your Grace';color:#4A4640}
  .ti{position:absolute;left:${L + 6}px;width:${m.tw || 620}px;top:${T + H + 74}px;font:600 ${m.fs || 64}px/1.02 'Brygada 1918';color:#F6F2EA;letter-spacing:-.01em}
  .meta{position:absolute;left:${L + 8}px;top:${T + H + 74 + (m.fs || 64) * 1.02 * (m.lines || 1) + 22}px;font:700 18px 'Red Hat Display';letter-spacing:.3em;color:${m.acc}}
  .ln{position:absolute;left:${L + 6}px;width:820px;top:${T + H + 74 + (m.fs || 64) * 1.02 * (m.lines || 1) + 72}px;font:italic 400 37px/1.28 'Brygada 1918';color:rgba(246,242,234,.9)}
  .ln b{font-weight:500;color:${m.acc}}
  .ft{position:absolute;left:${L + 6}px;right:${1080 - L - W}px;bottom:52px;display:flex;justify-content:space-between;align-items:center}
  .ft .p{display:flex;gap:12px}.ft .s{font:600 16px 'Red Hat Display';letter-spacing:.4em;color:rgba(255,255,255,.62)}
  </style></head><body><div class="pg"></div>
  <div class="hdr"><div>Nº <b>0${i}</b> / 0${n}</div><div class="fc"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="${m.acc}" stroke-width="2" stroke-linecap="round"><path d="M2 12a10 10 0 0 1 20 0Z"/><path d="M12 12v7a2.5 2.5 0 0 1-5 0"/></svg>${m.fc}</div></div>
  <div class="frame"><div class="glass"><div class="sheen"></div><div class="fog"></div><div class="fog2"></div><div class="wipe">${m.word}</div>${drops(gw, gh, 150)}<div class="inner"></div></div></div>
  <div class="sill"></div>
  <div class="pol"><div></div><span>${m.cap}</span></div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div><div class="ln">${m.line}</div>
  <div class="ft"><div class="p">${prog}</div><div class="s">${i < n ? 'KEEP SWIPING →' : 'THE RAIN STOPS →'}</div></div>
  ${grain(.1)}</body></html>`;
}
(async () => {
  const only = process.argv[3]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, out) => { fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 }); };
  if (!only || only === '1') await shot(cover(S.cover), '01_cover.jpg');
  for (let k = 0; k < S.movies.length; k++) if (!only || only === String(k + 2)) await shot(inside(S.movies[k], k + 1, S.movies.length), `0${k + 2}_${S.movies[k].slug}.jpg`);
  await b.close();
})();
