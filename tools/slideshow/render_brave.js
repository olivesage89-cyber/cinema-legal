// "anime for when you need to feel brave again": cover (Nausicaä at dusk on the ohmu shell, huge storm sky; Manrope kicker,
// Kaushan Script 'feel' / 'again', giant Bebas Neue BRAVE in ivory with gold glow, Fraunces italic sub) + MERIT BADGE inside
// slides (per-film canvas page, white-bordered tilted still, embroidered round badge w/ 2nd still + curved stitched text,
// Fraunces title, Manrope meta, 'BADGE EARNED' line, Fraunces italic line).  node render_brave.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_brave.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Bb', 'bebas-neue', 400) + ff('Ks', 'kaushan-script', 400) + ff('Mr', 'manrope', 500) + ff('Mr', 'manrope', 700) + ff('Mr', 'manrope', 800)
  + ff('Fr', 'fraunces', 400, 'italic') + ff('Fr', 'fraunces', 300, 'italic') + ff('Fr', 'fraunces', 600) + ff('Fr', 'fraunces', 700);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 .7 0"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;font-family:Mr}`;
function cover(c) {
  return `<html><head><style>${fonts}${base}
    body{background:linear-gradient(180deg,${c.sky0} 0,${c.sky} ${c.top + 120}px)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;bottom:0;background:url(file://${D}/${c.img}) ${c.px}% ${c.py}%/${c.bs};filter:contrast(1.05) saturate(1.02) brightness(.98);
     -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.mt}px)}
  .shade{position:absolute;inset:0;background:radial-gradient(ellipse 60% 30% at 30% 22%,rgba(255,230,170,.10),transparent 70%),linear-gradient(0deg,rgba(40,20,10,.50),transparent 22%)}
  .blk{position:absolute;left:${c.tx}px;top:${c.ty}px;width:700px}
  .kick{font:700 20px Mr;letter-spacing:.42em;color:rgba(255,246,228,.9)}
  .feel{font:400 ${c.ss}px/1 Ks;color:${c.ink2};margin:26px 0 0 8px;transform:rotate(-6deg);transform-origin:0 50%;text-shadow:0 4px 22px rgba(0,0,0,.45)}
  .brave{font:400 ${c.hs}px/.8 Bb;color:${c.ink};letter-spacing:.04em;margin-top:-14px;margin-left:-6px;
     text-shadow:0 0 50px ${c.glow}66,0 0 16px ${c.glow}33,0 8px 34px rgba(0,0,0,.45)}
  .again{font:400 ${c.ss}px/1 Ks;color:${c.ink2};margin:-34px 0 0 ${c.ax}px;transform:rotate(-6deg);text-shadow:0 4px 22px rgba(0,0,0,.45)}
  .rule{width:120px;height:2px;background:${c.glow};margin:34px 0 0 6px}
  .sub{position:absolute;left:${c.tx}px;bottom:${c.sb}px;width:640px;font:italic 300 40px/1.25 Fr;color:#FFF4DE;text-shadow:0 2px 18px rgba(0,0,0,.7)}
  .sub b{font-weight:400;color:${c.glow}}
  </style></head><body><div class="img"></div><div class="shade"></div>
  <div class="blk"><div class="kick">${c.kick}</div><div class="feel">${c.w1}</div><div class="brave">${c.h1}</div><div class="again">${c.w2}</div></div>
  <div class="sub">${c.sub}</div>${grain(.16)}</body></html>`;
}
function badge(m, id) {
  // embroidered merit badge: twill rim in accent, stitched rings, still in centre, curved text top/bottom
  return `<svg width="330" height="330" viewBox="0 0 330 330" style="overflow:visible">
   <defs><clipPath id="c${id}"><circle cx="165" cy="165" r="96"/></clipPath>
    <path id="t${id}" d="M 165 165 m -118 0 a 118 118 0 1 1 236 0"/><path id="b${id}" d="M 165 165 m -134 0 a 134 134 0 0 0 268 0"/>
    <pattern id="tw${id}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="6" fill="${m.acc}"/><rect width="3" height="6" fill="rgba(0,0,0,.10)"/></pattern>
    <filter id="sh${id}"><feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity=".45"/></filter></defs>
   <g filter="url(#sh${id})"><circle cx="165" cy="165" r="162" fill="${m.edge}"/><circle cx="165" cy="165" r="152" fill="url(#tw${id})"/></g>
   <circle cx="165" cy="165" r="157" fill="none" stroke="${m.edge}" stroke-width="6" stroke-dasharray="2 4" opacity=".9"/>
   <circle cx="165" cy="165" r="147" fill="none" stroke="#FFF4DE" stroke-width="2.5" stroke-dasharray="7 5"/>
   <circle cx="165" cy="165" r="103" fill="${m.edge}"/>
   <image href="file://${D}/${m.img2}" x="${m.bx ?? -60}" y="${m.by ?? 69}" width="${m.bw ?? 450}" height="${(m.bw ?? 450) * 9 / 16}" preserveAspectRatio="xMidYMid slice" clip-path="url(#c${id})"/>
   <circle cx="165" cy="165" r="98" fill="none" stroke="#FFF4DE" stroke-width="2.5" stroke-dasharray="6 5"/>
   <text font-family="Mr" font-weight="800" font-size="${m.bfs || 21}" letter-spacing="4" fill="#FFF8EA" text-anchor="middle"><textPath href="#t${id}" startOffset="50%">${m.badge}</textPath></text>
   <text font-family="Mr" font-weight="800" font-size="15" letter-spacing="5" fill="${m.edge}" text-anchor="middle" dy="0"><textPath href="#b${id}" startOffset="50%">★ EARNED ${m.yr} ★</textPath></text>
  </svg>`;
}
function inside(m, i, n) {
  const rot = [-1.4, 1.1, -0.9, 1.3, -1.1][i];
  return `<html><head><style>${fonts}${base}
  body{background:${m.page}}
  .cv{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.025) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.05) 0 2px,transparent 2px 5px),
     radial-gradient(ellipse 80% 60% at 50% 35%,rgba(255,255,255,.10),transparent 70%),radial-gradient(ellipse 120% 90% at 50% 50%,transparent 50%,rgba(0,0,0,.45) 100%)}
  .hdr{position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:baseline;font:700 17px Mr;letter-spacing:.38em;color:rgba(255,246,228,.78)}
  .hdr .s{font:400 34px Ks;letter-spacing:0;color:${m.acc}}
  .ph{position:absolute;left:66px;top:112px;width:948px;height:620px;background:#FBF6EC;padding:16px;transform:rotate(${rot}deg);box-shadow:0 26px 50px rgba(0,0,0,.45),0 4px 10px rgba(0,0,0,.3)}
  .ph div{width:100%;height:100%;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:contrast(1.04) saturate(1.04)}
  .bd{position:absolute;left:${m.bl ?? 60}px;top:${m.bt ?? 660}px;transform:rotate(${-rot * 4}deg)}
  .txt{position:absolute;left:418px;right:64px;top:800px}
  .num{font:700 16px Mr;letter-spacing:.38em;color:${m.acc}}
  .t{font:700 ${m.fs || 68}px/1 Fr;color:#FFF6E6;margin-top:16px;letter-spacing:-.01em}
  .meta{font:700 16px Mr;letter-spacing:.26em;color:rgba(255,246,228,.66);margin-top:18px}
  .earn{margin-top:30px;padding-top:22px;border-top:1px solid rgba(255,246,228,.22);font:700 15px Mr;letter-spacing:.3em;color:rgba(255,246,228,.6)}
  .earn b{display:block;margin-top:10px;font:400 34px Ks;letter-spacing:0;color:${m.acc}}
  .line{position:absolute;left:64px;right:64px;bottom:62px;text-align:center;font:italic 300 36px/1.3 Fr;color:#FFF4DE}
  </style></head><body><div class="cv"></div>
  <div class="hdr"><span>BRAVERY BADGES</span><span class="s">feel brave again</span><span>Nº ${String(i + 1).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></div>
  <div class="ph"><div></div></div>
  <div class="bd">${badge(m, i)}</div>
  <div class="txt"><div class="num">${m.kind}</div><div class="t">${m.t}</div><div class="meta">${m.meta}</div><div class="earn">BADGE EARNED FOR<b>${m.earn}</b></div></div>
  <div class="line">${m.line}</div>${grain(.12)}</body></html>`;
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
