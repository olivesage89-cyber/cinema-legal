// "anime that feel like going home": cover = Ponyo seaside town at dusk, full-bleed, coral Parisienne 'going' over
// huge cream Abril Fatface HOME in the open sea, Jost spaced kicker, Newsreader italic sub. Inside = POSTCARDS HOME:
// warm linen page, photo postcard (white border, tilted) + postcard back (Newsreader title, Jost caps meta, Caveat
// handwritten line in ink, perforated stamp w/ 2nd still, postmark).   node render_goinghome.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_home.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Pa', 'parisienne', 400) + ff('Ab', 'abril-fatface', 400) + ['300', '400', '500', '600'].map(w => ff('Jo', 'jost', w)).join('') +
  ['400', '500', '600'].map(w => ff('Nr', 'newsreader', w) + ff('Nr', 'newsreader', w, 'italic')).join('') + ['500', '600'].map(w => ff('Ca', 'caveat', w)).join('');
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const paper = `<svg style="position:absolute;inset:0;opacity:.5;mix-blend-mode:multiply;pointer-events:none" width="1080" height="1350"><filter id="p"><feTurbulence type="fractalNoise" baseFrequency=".012 .9" numOctaves="2"/><feColorMatrix values="0 0 0 0 .83  0 0 0 0 .76  0 0 0 0 .66  0 0 0 .35 0"/></filter><rect width="100%" height="100%" filter="url(#p)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Jo}`;
function cover(c) {
  return `<html><head><style>${fonts}${base}
  .img{position:absolute;inset:0;background:url(file://${D}/${c.img}) ${c.bx}px ${c.by}px/auto ${c.bh}px no-repeat;filter:contrast(1.04) saturate(1.06) sepia(.06)}
  .shade{position:absolute;inset:0;background:radial-gradient(ellipse 75% 30% at 40% ${c.ty + 6}%,rgba(10,40,48,.38),transparent 72%),linear-gradient(180deg,rgba(40,20,40,.25),transparent 16%),linear-gradient(0deg,rgba(8,30,30,.55),transparent 24%)}
  .kick{position:absolute;left:0;right:0;top:${c.ky}px;text-align:center;font:500 22px Jo;letter-spacing:.5em;padding-left:.5em;color:#FFF4EA;text-shadow:0 2px 14px rgba(60,20,40,.45)}
  .t{position:absolute;left:${c.tx}px;top:${c.ty}%;}
  .g{font:400 ${c.gs}px/1 Pa;color:${c.ink};margin-left:${c.gx}px;text-shadow:0 4px 26px rgba(0,30,40,.45);position:relative;z-index:2}
  .h{font:400 ${c.hs}px/.82 Ab;color:#FFF3E6;letter-spacing:.02em;margin-top:${c.hm}px;text-shadow:0 6px 40px rgba(0,30,40,.45)}
  .sub{position:absolute;left:${c.tx + 6}px;top:${c.sy}px;font:italic 400 40px/1.28 Nr;color:#FFF3E6;text-shadow:0 2px 16px rgba(0,25,35,.75)}
  .sub b{font-weight:400;color:${c.ink}}
  .tk{position:absolute;right:56px;bottom:56px;font:500 15px Jo;letter-spacing:.42em;color:rgba(255,243,230,.8)}
  </style></head><body><div class="img"></div><div class="shade"></div><div class="kick">${c.kick}</div>
  <div class="t"><div class="g">${c.g}</div><div class="h">${c.h}</div></div><div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.14)}</body></html>`;
}
const holes = (w, h, r = 5.5, st = 14) => { let c = ''; for (let x = st / 2; x < w; x += st) c += `<circle cx="${x}" cy="0" r="${r}"/><circle cx="${x}" cy="${h}" r="${r}"/>`;
  for (let y = st / 2; y < h; y += st) c += `<circle cx="0" cy="${y}" r="${r}"/><circle cx="${w}" cy="${y}" r="${r}"/>`; return `<g fill="#FCF8F0">${c}</g>`; };
function inside(m, i, n) {
  const perf = `-webkit-mask:radial-gradient(circle 7px at 7px 7px,transparent 6.5px,#000 7px) -7px -7px/18px 18px;`;
  return `<html><head><style>${fonts}${base}
  body{background:${m.bg}}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse 80% 70% at 50% 45%,transparent 50%,rgba(90,60,30,.22))}
  .hdr{position:absolute;top:56px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font:500 16px Jo;letter-spacing:.4em;color:#6B5844}
  .hdr i{font:400 44px Pa;letter-spacing:0;color:${m.acc};font-style:normal}
  .pc{position:absolute;left:84px;top:138px;width:912px;height:594px;background:#FBF7EE;padding:24px;transform:rotate(${m.r1 || -2}deg);box-shadow:0 2px 3px rgba(60,40,20,.18),0 26px 50px rgba(60,40,20,.28)}
  .pc .ph{width:100%;height:100%;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:contrast(1.04) saturate(1.04) sepia(.05)}
  .back{position:absolute;left:62px;top:760px;width:956px;height:520px;background:#FCF8F0;transform:rotate(${m.r2 || 1.2}deg);box-shadow:0 2px 3px rgba(60,40,20,.15),0 24px 46px rgba(60,40,20,.25)}
  .back:before{content:'';position:absolute;left:560px;top:52px;bottom:52px;width:1.5px;background:#D8CDBD}
  .lft{position:absolute;left:52px;top:46px;width:478px}
  .lab{font:500 14px Jo;letter-spacing:.42em;color:${m.acc}}
  .tt{font:500 ${m.fs || 84}px/1.0 Nr;color:#2B2320;margin-top:16px;letter-spacing:-.01em}
  .meta{font:500 15px Jo;letter-spacing:.3em;color:#7D6B58;margin-top:18px}
  .note{font:500 ${m.ns || 44}px/1.12 Ca;color:${m.ink || '#2E3E6B'};margin-top:30px;transform:rotate(-1deg)}
  .rgt{position:absolute;left:592px;top:46px;right:44px;bottom:40px}
  .stamp{position:absolute;right:0;top:0;width:168px;height:206px;background:#FFFDF8;padding:14px;box-shadow:0 1px 2px rgba(60,40,20,.22)}
  .stamp svg.pf{position:absolute;left:0;top:0}
  .stamp .si{width:100%;height:146px;background:url(file://${D}/${m.img2}) ${m.x2 || 50}% 50%/cover}
  .stamp .sv{font:600 13px Jo;letter-spacing:.2em;color:${m.acc};margin-top:9px;display:flex;justify-content:space-between}
  .pm{position:absolute;left:-10px;top:22px;width:200px;height:200px;transform:rotate(-14deg);opacity:.72}
  .addr{position:absolute;left:0;right:0;bottom:16px}
  .ln{border-bottom:1.5px solid #D8CDBD;height:62px;font:500 36px/76px Ca;color:${m.ink || '#2E3E6B'};padding-left:6px;white-space:nowrap}
  </style></head><body>${paper}<div class="vig"></div>
  <div class="hdr"><span>POSTCARDS HOME · Nº ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span><i>going home</i></div>
  <div class="pc"><div class="ph"></div></div>
  <div class="back"><div class="lft"><div class="lab">${m.kind}</div><div class="tt">${m.t}</div><div class="meta">${m.meta}</div><div class="note">${m.note}</div></div>
   <div class="rgt"><svg class="pm" viewBox="0 0 200 200"><circle cx="100" cy="100" r="74" fill="none" stroke="${m.acc}" stroke-width="3"/><circle cx="100" cy="100" r="60" fill="none" stroke="${m.acc}" stroke-width="1.5"/>
     <text x="100" y="92" text-anchor="middle" font-family="Jo" font-weight="600" font-size="15" letter-spacing="3" fill="${m.acc}">${m.pm}</text><text x="100" y="122" text-anchor="middle" font-family="Jo" font-weight="500" font-size="26" letter-spacing="2" fill="${m.acc}">${m.yr}</text>
     <path d="M180 70 q15 -8 30 0 t30 0 t30 0 M180 90 q15 -8 30 0 t30 0 t30 0 M180 110 q15 -8 30 0 t30 0 t30 0 M180 130 q15 -8 30 0 t30 0 t30 0" fill="none" stroke="${m.acc}" stroke-width="2.4"/></svg>
    <div class="stamp"><svg class="pf" width="168" height="206">${holes(168,206)}</svg><div class="si"></div><div class="sv"><span>${m.sv}</span><span>¥80</span></div></div>
    <div class="addr"><div class="ln">to: ${m.to}</div><div class="ln"></div><div class="ln" style="font-size:30px;color:#9A8670">${m.place}</div></div></div></div>
  ${grain(.10)}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const jobs = [['01_cover', cover(S.cover)], ...S.films.map((m, i) => [`0${i + 2}_${m.slug}`, inside(m, i, S.films.length)])];
  const only = process.argv[3];
  for (const [name, html] of jobs) { if (only && !name.startsWith(only)) continue;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(500);
    await p.screenshot({ path: `${D}/out/${name}.jpg`, type: 'jpeg', quality: 93 }); }
  await b.close();
})();
