// "anime for anyone who's ever felt left out" — PASSED NOTE inside slides (1080x1350).
// Per-film deep page, header, big rounded still + 2 small rounded stills, Fraunces italic title in per-film accent,
// DM Mono meta, light italic line, tilted lined-paper note (Caveat Brush) like a note passed in class, grain.
// node render_leftout.js DIR   (DIR/slides_left.json: {films:[{t,yr,where,line,note,bg,ac,big,s1,s2,bx,s1x,s2x}]})
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_left.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = ff('Fr', 'fraunces', 300, 'italic') + ff('Fr', 'fraunces', 400, 'italic') + ff('Br', 'caveat-brush', 400) + ff('Mo', 'dm-mono', 400) + ff('Mo', 'dm-mono', 500);
const grain = `<svg style="position:absolute;inset:0;opacity:.13;mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
function page(f, i) {
  const img = (src, x) => `background:url(file://${D}/${src}) ${x ?? 50}% 50%/cover`;
  return `<html><head><style>${fonts}*{margin:0;padding:0;box-sizing:border-box}
  body{width:1080px;height:1350px;position:relative;overflow:hidden;color:#FBF3EA;
    background:radial-gradient(ellipse 80% 50% at 50% 30%,${f.bg2} 0,${f.bg} 70%)}
  .hd{position:absolute;top:58px;left:60px;right:60px;display:flex;justify-content:space-between;font:500 19px Mo;letter-spacing:.32em;color:rgba(251,243,234,.72)}
  .hd b{font-weight:500;color:${f.ac}}
  .big{position:absolute;left:60px;top:118px;width:960px;height:540px;border-radius:30px;${img(f.big, f.bx)};box-shadow:0 30px 70px rgba(0,0,0,.45),0 0 0 1px rgba(255,255,255,.06)}
  .sm{position:absolute;top:680px;width:469px;height:264px;border-radius:24px;box-shadow:0 20px 50px rgba(0,0,0,.4)}
  .t{position:absolute;left:60px;top:982px;width:600px;font:400 italic ${f.fs || 64}px/1.04 Fr;color:${f.ac};letter-spacing:-.01em}
  .m{position:absolute;left:62px;top:${f.mt || 1070}px;font:400 20px Mo;letter-spacing:.28em}
  .l{position:absolute;left:60px;top:${(f.mt || 1070) + 46}px;width:560px;font:300 italic 34px/1.28 Fr;color:rgba(251,243,234,.92)}
  .note{position:absolute;left:688px;top:990px;width:332px;height:250px;transform:rotate(${f.rot || 4}deg);
    background:repeating-linear-gradient(180deg,transparent 0 41px,rgba(80,120,190,.35) 41px 43px),#F8F1E3;
    background-position:0 18px;border-radius:4px;box-shadow:0 18px 40px rgba(0,0,0,.45);padding:34px 26px 0 52px}
  .note:before{content:'';position:absolute;left:36px;top:0;bottom:0;width:2px;background:rgba(214,92,92,.55)}
  .note:after{content:'';position:absolute;left:50%;top:-16px;width:120px;height:34px;margin-left:-60px;background:rgba(255,255,255,.45);transform:rotate(-3deg);box-shadow:0 2px 6px rgba(0,0,0,.1)}
  .nt{font:400 41px/43px Br;color:#2B3A78}
  .fold{position:absolute;right:0;bottom:0;width:0;height:0;border-left:34px solid #E2D7C1;border-top:34px solid ${f.bg}}
  </style></head><body>
  <div class="hd"><span>FOR ANYONE WHO'S EVER FELT LEFT OUT</span><b>Nº 0${i + 1} / 05</b></div>
  <div class="big"></div>
  <div class="sm" style="left:60px;${img(f.s1, f.s1x)}"></div><div class="sm" style="left:551px;${img(f.s2, f.s2x)}"></div>
  <div class="t">${f.t}</div>
  <div class="m" style="color:${f.ac}">${f.yr} &nbsp;|&nbsp; ${f.where.toUpperCase()}</div>
  <div class="l">${f.line}</div>
  <div class="note"><div class="nt">${f.note}</div><div class="fold"></div></div>
  ${grain}</body></html>`;
}
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    fs.writeFileSync(D + '/_s.html', page(f, i)); await p.goto('file://' + D + '/_s.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${D}/out/0${i + 1}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
