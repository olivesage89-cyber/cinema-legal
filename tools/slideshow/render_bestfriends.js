// "anime about best friends (the kind you'd follow to the end of the world)": cover = Girls' Last Tour campfire in the
// dark, image masked up into extended near-black; IBM Plex Mono spaced kicker + ember Mr Dafoe 'best friends' w/ fire glow
// + Marcellus wide-spaced caps TO THE END OF THE WORLD + Lora italic sub, rising embers, grain.
// Inside = PHOTO BOOTH: per-film deep page, tilted white photo-booth strip of 3 stills w/ Mr Dafoe duo names,
// right column: Nº, THE DUO label, names in accent script, Marcellus title, mono meta, Lora italic line, giant ghost '&'.
// node render_bestfriends.js DIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_bf.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Df', 'mr-dafoe', 400) + ff('Mc', 'marcellus', 400) + ['400', '500'].map(w => ff('Px', 'ibm-plex-mono', w)).join('') +
  ['400', '500'].map(w => ff('Lo', 'lora', w) + ff('Lo', 'lora', w, 'italic')).join('');
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Lo}`;
function embers(n, seed) { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280, o = '';
  for (let i = 0; i < n; i++) { const x = 380 + r() * 420, y = 560 + r() * 520, d = 2 + r() * 4.5, a = .35 + r() * .6;
    o += `<div style="position:absolute;left:${x}px;top:${y}px;width:${d}px;height:${d}px;border-radius:50%;background:#FFB46A;opacity:${a};box-shadow:0 0 ${d * 3}px ${d}px rgba(255,140,60,.55)"></div>`; } return o; }
function cover(c) {
  return `<html><head><style>${fonts}${base}
  body{background:#120E12}
  .img{position:absolute;left:${c.bx}px;top:${c.by}px;width:${c.bw}px;height:${c.bw * 9 / 16}px;background:url(file://${D}/${c.img}) center/cover;
    filter:contrast(1.06) saturate(1.08) brightness(1.05);-webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.mk}px)}
  .glow{position:absolute;inset:0;background:radial-gradient(ellipse 34% 22% at ${c.fx}% ${c.fy}%,rgba(255,140,60,.28),transparent 70%)}
  .shade{position:absolute;inset:0;background:linear-gradient(0deg,rgba(10,7,10,.55),transparent 16%)}
  .kick{position:absolute;left:0;right:0;top:${c.ky}px;text-align:center;font:500 21px Px;letter-spacing:.55em;padding-left:.55em;color:#F3E6DA}
  .g{position:absolute;left:0;right:0;top:${c.gy}px;text-align:center;font:400 ${c.gs}px/1 Df;color:${c.ink};transform:rotate(-4deg);
    text-shadow:0 0 30px rgba(255,130,50,.55),0 0 80px rgba(255,110,40,.35)}
  .h{position:absolute;left:0;right:0;top:${c.hy}px;text-align:center;font:400 ${c.hs}px Mc;letter-spacing:.34em;padding-left:.34em;color:#F6EBDD}
  .rule{position:absolute;left:50%;top:${c.hy + 82}px;width:90px;height:1.5px;margin-left:-45px;background:${c.ink};opacity:.8}
  .sub{position:absolute;left:0;right:0;top:${c.sy}px;text-align:center;font:italic 400 36px/1.3 Lo;color:#EFE2D4}
  .sub b{font-weight:400;color:${c.ink}}
  .tk{position:absolute;left:0;right:0;bottom:50px;text-align:center;font:500 15px Px;letter-spacing:.45em;padding-left:.45em;color:rgba(243,230,218,.72)}
  </style></head><body><div class="img"></div><div class="glow"></div><div class="shade"></div>${embers(26, 7)}
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="h">${c.h}</div><div class="rule"></div><div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.15)}</body></html>`;
}
function inside(m, i, n) {
  const ph = m.imgs.map((p, k) => `<div class="ph" style="background-image:url(file://${D}/${p.f});background-position:${p.x || 50}% ${p.y || 50}%"></div>`).join('');
  return `<html><head><style>${fonts}${base}
  body{background:${m.bg}}
  .bgimg{position:absolute;inset:-40px;background:url(file://${D}/${m.imgs[0].f}) center/cover;filter:blur(38px) saturate(1.1);opacity:.22}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 75% at 50% 45%,transparent 40%,rgba(0,0,0,.45))}
  .hdr{position:absolute;top:58px;left:72px;right:72px;display:flex;justify-content:space-between;font:500 16px Px;letter-spacing:.4em;color:rgba(246,235,221,.7)}
  .amp{position:absolute;right:-30px;top:330px;font:400 760px/1 Mc;color:${m.acc};opacity:.07}
  .strip{position:absolute;left:76px;top:196px;width:452px;background:#F8F4EC;padding:20px 20px 0;transform:rotate(-3deg);
    box-shadow:0 2px 4px rgba(0,0,0,.25),0 30px 60px rgba(0,0,0,.45)}
  .ph{width:412px;height:262px;background-size:cover;margin-bottom:16px;filter:contrast(1.05) saturate(1.06) sepia(.05)}
  .lab{height:96px;display:flex;flex-direction:column;align-items:center;justify-content:center;margin-top:-4px}
  .lab .nm{font:400 50px/1 Df;color:#2A2420}
  .lab .dt{font:500 12px Px;letter-spacing:.38em;color:#8B7F72;margin-top:8px}
  .tape{position:absolute;left:170px;top:-18px;width:120px;height:38px;background:rgba(255,248,230,.55);transform:rotate(4deg);box-shadow:0 1px 2px rgba(0,0,0,.12)}
  .col{position:absolute;left:592px;top:${m.cy || 370}px;width:420px}
  .no{font:500 17px Px;letter-spacing:.4em;color:${m.acc}}
  .duo{font:500 14px Px;letter-spacing:.42em;color:rgba(246,235,221,.62);margin-top:46px}
  .names{font:400 ${m.ns || 76}px/1.02 Df;color:${m.acc};margin-top:6px;margin-left:-4px;transform:rotate(-3deg);transform-origin:left}
  .tt{font:400 ${m.fs || 56}px/1.08 Mc;color:#F6EBDD;margin-top:40px;letter-spacing:.01em}
  .meta{font:500 15px Px;letter-spacing:.3em;color:rgba(246,235,221,.66);margin-top:20px}
  .hr{width:70px;height:1.5px;background:${m.acc};margin-top:34px}
  .ln{font:italic 400 33px/1.34 Lo;color:#EFE2D4;margin-top:28px}
  </style></head><body><div class="bgimg"></div><div class="vig"></div><div class="amp">&amp;</div>
  <div class="hdr"><span>BEST FRIENDS · ${m.kind}</span><span>Nº ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>
  <div class="strip"><div class="tape"></div>${ph}<div class="lab"><div class="nm">${m.names}</div><div class="dt">${m.stamp}</div></div></div>
  <div class="col"><div class="no">${m.no}</div><div class="duo">THE DUO</div><div class="names">${m.names}</div>
   <div class="tt">${m.t}</div><div class="meta">${m.meta}</div><div class="hr"></div><div class="ln">${m.ln}</div></div>${grain(.13)}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const only = process.argv[3];
  const jobs = [['01_cover', cover(S.cover)], ...S.movies.map((m, i) => [String(i + 2).padStart(2, '0') + '_' + m.slug, inside(m, i, S.movies.length)])];
  for (const [nm, html] of jobs) { if (only && !nm.startsWith(only)) continue;
    fs.writeFileSync(D + '/tmp.html', html); await p.goto('file://' + D + '/tmp.html'); await p.waitForTimeout(400);
    await p.screenshot({ path: `${D}/out/${nm}.jpg`, type: 'jpeg', quality: 93 }); console.log(nm); }
  await b.close();
})();
