// "anime that feel like flying" — cover: skywriting script over extended Blue Thermal sky; inside: FLIGHT LOG
// (per-film time-of-day sky page, soft clouds, rounded window still, riveted porthole inset, dashed flight path w/ paper plane progress)
// Usage: node render_animefly.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const plane = (c, s = 46) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path d="M3 22 L45 5 L33 43 L24 29 Z" fill="${c}"/><path d="M45 5 L24 29 L22 40 L28 33" fill="${c}" opacity=".7"/><path d="M45 5 L24 29" stroke="rgba(0,0,0,.18)" stroke-width="1.2"/></svg>`;
const css = [
  ff('Sac', 'sacramento', 400), ff('RHD', 'red-hat-display', 500), ff('RHD', 'red-hat-display', 700), ff('RHD', 'red-hat-display', 800),
  ff('RHM', 'red-hat-mono', 400), ff('RHM', 'red-hat-mono', 500),
  ff('News', 'newsreader', 400, 'italic'), ff('News', 'newsreader', 500, 'italic'), ff('News', 'newsreader', 500), ff('News', 'newsreader', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;color:#fff}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.16;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#0F3270}
.cv .sky{position:absolute;inset:0 0 auto 0;height:760px;background:linear-gradient(180deg,#0E2F6C 0%,#1D4F95 45%,#3C78B2 100%)}
.cv .img{position:absolute;left:0;right:0;bottom:0;height:var(--ih,900px);background:url(file://${D}/COVERIMG) var(--ix,44%) 100%/cover no-repeat;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 260px,#000 100%);filter:saturate(.92) contrast(.97) brightness(1.02)}
.cv .tone{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,20,60,.12),rgba(0,0,0,0) 45%,rgba(255,200,140,.06) 75%,rgba(10,25,50,.30));}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,rgba(0,0,0,0) 55%,rgba(0,10,40,.32) 100%)}
.cv .brand{position:absolute;top:46px;width:100%;text-align:center;font-family:RHM;font-weight:500;font-size:18px;letter-spacing:.6em;padding-left:.6em;opacity:.8}
.cv .t{position:absolute;top:var(--ty,118px);left:0;right:0;text-align:center;text-shadow:0 2px 24px rgba(5,20,60,.35)}
.cv .kick{font-family:RHD;font-weight:700;font-size:27px;letter-spacing:.44em;padding-left:.44em}
.cv .hero{position:relative;font-family:Sac;font-size:300px;line-height:1;margin-top:34px;height:250px;letter-spacing:.01em;
  text-shadow:0 0 18px rgba(255,255,255,.55),0 0 60px rgba(200,235,255,.45),0 4px 30px rgba(10,30,80,.35)}
.cv .sub{font-family:News;font-style:italic;font-weight:400;font-size:37px;line-height:1.32;margin-top:130px}
.cv .sub b{font-weight:500;color:var(--mint)}
.cv .swipe{position:absolute;bottom:52px;width:100%;text-align:center;font-family:RHD;font-weight:700;font-size:19px;letter-spacing:.46em;padding-left:.46em;text-shadow:0 1px 12px rgba(0,0,0,.55)}
/* flight log page */
.pg{background:linear-gradient(180deg,var(--s1) 0%,var(--s2) 58%,var(--s3) 100%)}
.pg .cl{position:absolute;border-radius:50%;background:radial-gradient(closest-side,rgba(255,255,255,var(--o,.22)),rgba(255,255,255,0));filter:blur(6px)}
.pg .hd{position:absolute;top:58px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:RHM;font-weight:500;font-size:19px;letter-spacing:.26em;opacity:.9}
.pg .hd b{color:var(--acc);font-weight:500}
.pg .wx{position:absolute;top:96px;left:64px;right:64px;font-family:RHM;font-size:16px;letter-spacing:.22em;opacity:.62;border-top:1px solid rgba(255,255,255,.28);padding-top:12px}
.pg .win{position:absolute;top:150px;left:60px;width:960px;height:640px;border-radius:30px;overflow:hidden;border:2px solid rgba(255,255,255,.75);box-shadow:0 26px 60px rgba(0,10,30,.38)}
.pg .win div{width:100%;height:100%;background-size:cover;background-position:var(--px) var(--py);filter:saturate(.93) contrast(.97) brightness(1.02)}
.pg .port{position:absolute;top:670px;right:52px;width:300px;height:300px;border-radius:50%;padding:17px;
  background:radial-gradient(circle,#FBF8F2 60%,#D9D3C6 100%);box-shadow:0 18px 40px rgba(0,10,30,.45),inset 0 0 0 2px rgba(0,0,0,.08)}
.pg .port div{width:100%;height:100%;border-radius:50%;background-size:var(--qs,cover);background-position:var(--qx) var(--qy);box-shadow:inset 0 0 0 3px rgba(0,0,0,.18),inset 0 6px 16px rgba(0,0,0,.35)}
.pg .port i{position:absolute;width:9px;height:9px;border-radius:50%;background:#BDB5A6;box-shadow:inset 0 1px 1px rgba(255,255,255,.8)}
.pg .path{position:absolute;top:812px;left:60px;width:640px;height:90px}
.pg .ttl{position:absolute;top:928px;left:64px;width:660px;font-family:News;font-weight:600;font-size:var(--ts,78px);line-height:1;letter-spacing:-.015em;text-shadow:0 2px 18px rgba(0,10,30,.25)}
.pg .meta{position:absolute;top:var(--my,1022px);left:66px;font-family:RHD;font-weight:800;font-size:19px;letter-spacing:.3em;color:var(--acc)}
.pg .line{position:absolute;top:var(--ly,1084px);left:64px;right:90px;font-family:News;font-style:italic;font-size:38px;line-height:1.3;opacity:.95}
.pg .ft{position:absolute;bottom:58px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:RHM;font-weight:500;font-size:16px;letter-spacing:.26em;opacity:.7;border-top:1px solid rgba(255,255,255,.28);padding-top:14px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const clouds = (seed) => { let r = seed; const rnd = () => (r = (r * 9301 + 49297) % 233280) / 233280; let out = '';
  for (let n = 0; n < 9; n++) { const w = 260 + rnd() * 420, h = w * (.32 + rnd() * .2); out += `<div class="cl" style="left:${rnd() * 1080 - w / 2}px;top:${rnd() * 1350 - h / 2}px;width:${w}px;height:${h}px;--o:${.10 + rnd() * .16}"></div>`; } return out; };
const rivets = () => [...Array(10)].map((_, n) => { const a = n / 10 * Math.PI * 2, R = 141.5; return `<i style="left:${150 + R * Math.cos(a) - 4.5}px;top:${150 + R * Math.sin(a) - 4.5}px"></i>`; }).join('');
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let html;
    if (s.type === 'cover') {
      html = `<html><head><style>${css.replace('COVERIMG', s.img)}</style></head><body class="cv" style="--mint:${s.mint};${s.vars || ''}">
      <div class="sky"></div><div class="img"></div><div class="tone"></div><div class="vig"></div>
      <div class="brand">CINEMA</div>
      <div class="t"><div class="kick">${s.kick}</div><div class="hero">${s.hero}</div><div class="sub">${s.sub}</div></div>
      <div class="swipe">${s.swipe}</div><div class="grain"></div></body></html>`;
    } else {
      const k = i, W = 640;
      const xs = [0, 1, 2, 3, 4].map(n => 14 + n * (W - 28) / 4);
      const y = x => 62 - 34 * Math.sin(Math.PI * x / W);
      const dots = xs.map((x, n) => `<circle cx="${x}" cy="${y(x)}" r="${n + 1 === k ? 0 : 6}" fill="${n + 1 < k ? s.acc : 'none'}" stroke="#fff" stroke-opacity=".8" stroke-width="2"/>`).join('');
      const pts = [...Array(41)].map((_, n) => { const x = n * W / 40; return `${x},${y(x)}`; }).join(' ');
      const px = xs[k - 1], py = y(px);
      html = `<html><head><style>${css}</style></head><body class="pg" style="--s1:${s.s1};--s2:${s.s2};--s3:${s.s3};--acc:${s.acc};--px:${s.px ?? 50}%;--py:${s.py ?? 50}%;--qx:${s.qx ?? 50}%;--qy:${s.qy ?? 50}%;${s.vars || ''}">
      ${clouds(k * 7919)}
      <div class="hd"><span>✈ FLIGHT LOG · <b>ANIME THAT FEEL LIKE FLYING</b></span><span>Nº 0${k} / 05</span></div>
      <div class="wx">${s.wx}</div>
      <div class="win"><div style="background-image:url(file://${D}/${s.img})"></div></div>
      <svg class="path" viewBox="0 0 ${W} 90"><polyline points="${pts}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2.2" stroke-dasharray="3 11" stroke-linecap="round"/>${dots}
        <g transform="translate(${px - 23},${py - 25}) rotate(${-8 + (k - 3) * 6} 23 23)">${plane('#fff')}</g></svg>
      <div class="port"><div style="background-image:url(file://${D}/${s.img2})"></div>${rivets()}</div>
      <div class="ttl">${s.t}</div>
      <div class="meta">${s.meta}</div>
      <div class="line">${s.ov}</div>
      <div class="ft"><span>CINEMA</span><span>${k < 5 ? 'NEXT STOP →' : 'FINAL APPROACH →'}</span></div>
      <div class="grain" style="opacity:.13"></div></body></html>`;
    }
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
