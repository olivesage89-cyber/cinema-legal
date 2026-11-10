// "Roaring twenties" — cover: full-bleed night still set low under an extended ink sky, deco fan + jade script.
// Inside: DECO PLAYBILL — black lacquer page, per-film accent deco linework, still in a stepped-corner double frame.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Doul', 'monsieur-la-doulaise', 400), ff('Ital', 'italiana', 400),
  ff('Bod', 'bodoni-moda', 400), ff('Bod', 'bodoni-moda', 500), ff('Bod', 'bodoni-moda', 400, 'italic'), ff('Bod', 'bodoni-moda', 500, 'italic')].join('');
const grain = `.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0A0908;font-family:Bod}${grain}`;

// deco fan (sunburst) svg
const fan = (c, w = 260, op = 1) => {
  let rays = '';
  for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12); const x = 130 - Math.cos(a) * 120, y = 130 - Math.sin(a) * 120; rays += `<line x1="130" y1="130" x2="${x.toFixed(1)}" y2="${y.toFixed(1)}" stroke="${c}" stroke-width="1.6"/>`; }
  return `<svg width="${w}" height="${w / 2}" viewBox="0 0 260 130" style="opacity:${op}"><path d="M10 130 A120 120 0 0 1 250 130" fill="none" stroke="${c}" stroke-width="2"/><path d="M40 130 A90 90 0 0 1 220 130" fill="none" stroke="${c}" stroke-width="1.2"/>${rays}<circle cx="130" cy="130" r="26" fill="#0A0908" stroke="${c}" stroke-width="2"/></svg>`;
};

const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
function cover(s) {
  const ink = s.ink, ivory = '#F5ECDD';
  return `<style>${base}
  .img{position:absolute;left:0;top:${s.top}px;width:1080px;height:${s.ih}px;object-fit:cover;object-position:${s.x}% 50%;filter:saturate(.9) contrast(1.06) brightness(.98) sepia(.08)}
  .fade{position:absolute;left:0;right:0;top:${s.top - 2}px;height:330px;background:linear-gradient(180deg,#0A0908 0%,rgba(10,9,8,.85) 35%,rgba(10,9,8,0) 100%)}
  .bot{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(0deg,rgba(10,9,8,.75),rgba(10,9,8,0))}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%)}
  .glow{position:absolute;left:50%;top:150px;width:900px;height:420px;margin-left:-450px;background:radial-gradient(ellipse,rgba(143,224,196,.10),rgba(0,0,0,0) 65%)}
  .t{position:absolute;left:0;right:0;top:50px;text-align:center}
  .fan{display:flex;justify-content:center;margin-bottom:6px}
  .kick{font-family:Ital;color:${ivory};font-size:27px;letter-spacing:.52em;padding-left:.52em;opacity:.92}
  .the{font-family:Doul;color:${ink};font-size:150px;line-height:.8;margin-top:44px;text-shadow:0 0 30px rgba(143,224,196,.35),0 2px 12px rgba(0,0,0,.6)}
  .big{font-family:Ital;color:${ivory};font-size:132px;letter-spacing:.11em;padding-left:.11em;line-height:1;margin-top:-14px;text-shadow:0 2px 20px rgba(0,0,0,.6)}
  .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:16px}
  .rule i{display:block;width:120px;height:1.5px;background:${ink}}
  .rule b{display:block;width:11px;height:11px;transform:rotate(45deg);border:1.5px solid ${ink}}
  .sub{font-style:italic;color:${ivory};font-size:35px;margin-top:16px;opacity:.95}
  .sub em{color:${ink}}
  .swipe{position:absolute;bottom:52px;width:100%;text-align:center;font-family:Ital;color:${ivory};font-size:24px;letter-spacing:.4em;opacity:.85}
  </style><img class="img" src="file://${D}/${s.img}"><div class="fade"></div><div class="bot"></div><div class="vig"></div><div class="glow"></div><div class="grain"></div>
  <div class="t"><div class="kick">${s.kick}</div><div class="the">${s.h}</div><div class="big">${s.h2}</div>
  <div class="rule"><i></i><b></b><i></i></div><div class="sub">${s.sub}</div></div>
  <div class="swipe">SWIPE FOR THE LINEUP &nbsp;→</div>`;
}
function film(s, i, n) {
  const a = s.ink, ivory = '#F2EADC';
  // stepped corner polygon for 920x640 frame
  const W = 900, H = 700, c = 34;
  const step = (w, h, k) => `polygon(${k}px 0,${w - k}px 0,${w - k}px ${k / 2}px,${w - k / 2}px ${k / 2}px,${w - k / 2}px ${k}px,${w}px ${k}px,${w}px ${h - k}px,${w - k / 2}px ${h - k}px,${w - k / 2}px ${h - k / 2}px,${w - k}px ${h - k / 2}px,${w - k}px ${h}px,${k}px ${h}px,${k}px ${h - k / 2}px,${k / 2}px ${h - k / 2}px,${k / 2}px ${h - k}px,0 ${h - k}px,0 ${k}px,${k / 2}px ${k}px,${k / 2}px ${k / 2}px,${k}px ${k / 2}px)`;
  const ptsSvg = (w, h, k, o) => { const P = [[k, 0], [w - k, 0], [w - k, k / 2], [w - k / 2, k / 2], [w - k / 2, k], [w, k], [w, h - k], [w - k / 2, h - k], [w - k / 2, h - k / 2], [w - k, h - k / 2], [w - k, h], [k, h], [k, h - k / 2], [k / 2, h - k / 2], [k / 2, h - k], [0, h - k], [0, k], [k / 2, k], [k / 2, k / 2], [k, k / 2]]; return P.map(([x, y]) => `${x + o},${y + o}`).join(' '); };
  const O = 22, fw = W + 2 * O, fh = H + 2 * O;
  return `<style>${base}
  body{background:radial-gradient(ellipse at 50% 38%,${s.glow} 0%,#0B0A09 62%)}
  .lines{position:absolute;inset:0;opacity:.07;background:repeating-linear-gradient(90deg,${a} 0 1px,transparent 1px 36px)}
  .hdr{position:absolute;top:44px;left:0;right:0;display:flex;align-items:center;justify-content:center;gap:22px;font-family:Ital;color:${a};font-size:24px;letter-spacing:.42em}
  .hdr i{display:block;width:150px;height:1px;background:${a};opacity:.7}
  .fan{position:absolute;top:96px;left:50%;transform:translateX(-50%)}
  .frame{position:absolute;left:${(1080 - fw) / 2}px;top:150px;width:${fw}px;height:${fh}px}
  .still{position:absolute;left:${(1080 - W) / 2}px;top:${150 + O}px;width:${W}px;height:${H}px;clip-path:${step(W, H, c)};overflow:hidden}
  .still img{width:100%;height:100%;object-fit:cover;object-position:${s.x}% ${s.y ?? 50}%;filter:saturate(.88) contrast(1.05) sepia(.1)}
  .txt{position:absolute;left:60px;right:60px;top:${150 + fh + 40}px;text-align:center}
  .num{font-family:Doul;color:${a};font-size:74px;line-height:.6;opacity:.95}
  .title{font-family:Ital;color:${ivory};font-size:${s.fs || 84}px;letter-spacing:.09em;padding-left:.09em;line-height:1.05;margin-top:18px}
  .meta{font-style:italic;color:${a};font-size:31px;letter-spacing:.05em;margin-top:14px}
  .meta span{font-style:normal;font-family:Ital;letter-spacing:.3em;font-size:22px}
  .line{font-style:italic;color:${ivory};opacity:.88;font-size:37px;line-height:1.36;margin-top:22px}
  .foot{position:absolute;bottom:40px;left:0;right:0;display:flex;justify-content:center;gap:10px}
  .foot b{display:block;width:9px;height:9px;transform:rotate(45deg);border:1.3px solid ${a};opacity:.75}
  .foot b.on{background:${a};opacity:1}
  </style><div class="lines"></div>
  <div class="hdr"><i></i>Nº 0${i} &nbsp;/&nbsp; 05<i></i></div>
  <div class="fan">${fan(a, 150, .85)}</div>
  <svg class="frame" viewBox="0 0 ${fw} ${fh}"><polygon points="${ptsSvg(fw - 2, fh - 2, c + 14, 1)}" fill="none" stroke="${a}" stroke-width="2"/><polygon points="${ptsSvg(fw - 18, fh - 18, c + 8, 9)}" fill="none" stroke="${a}" stroke-width="1" opacity=".6"/></svg>
  <div class="still"><img src="file://${D}/${s.img}"></div>
  <div class="txt"><div class="title">${s.t}</div><div class="meta">${s.pre || "dir."} ${s.dir} &nbsp;<span>·</span>&nbsp; ${s.yr}</div><div class="line">${s.ov}</div></div>
  <div class="foot">${[1, 2, 3, 4, 5].map(k => `<b class="${k == i ? 'on' : ''}"></b>`).join('')}</div>`;
}
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  let k = 0;
  for (const s of S) {
    if (s.type === 'app') continue;
    const html = `<html><head></head><body>${s.type === 'cover' ? cover(s) : film(s, ++k)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
