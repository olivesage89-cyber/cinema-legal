// "masquerade ball" — cover: storm-cloud full-bleed w/ gold Imperial Script; inside: INVITATION (velvet page, gilt-framed still, oval cameo, engraved invitation card)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GOLD = '#F0CF7A';
const css = [ff('Imp', 'imperial-script', 400), ff('Gilda', 'gilda-display', 400), ff('Jos', 'josefin-sans', 400), ff('Jos', 'josefin-sans', 600),
  ff('Spec', 'spectral', 300, 'italic'), ff('Spec', 'spectral', 400, 'italic'), ff('Spec', 'spectral', 400)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0b0a0d}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;z-index:50;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.sky{display:none}
.seam{position:absolute;left:0;right:0;top:calc(var(--sh) - 90px);height:180px;background:linear-gradient(180deg,rgba(14,16,14,0),rgba(14,16,14,.35) 50%,rgba(14,16,14,0))}
.bg{position:absolute;left:0;top:var(--sh);width:100%;height:1350px;object-fit:cover;filter:saturate(.85) contrast(1.04) brightness(.96) sepia(.12)}
.cshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,8,8,.6) 0%,rgba(6,8,8,.3) 30%,rgba(0,0,0,0) 46%,rgba(0,0,0,0) 72%,rgba(8,5,2,.82) 100%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%)}
.ctop{position:absolute;top:70px;left:0;right:0;text-align:center;color:${GOLD};text-shadow:0 2px 26px rgba(0,0,0,.55)}
.kick{font-family:Jos;font-weight:600;font-size:23px;letter-spacing:.5em;padding-left:.5em;color:#F4EBD8}
.hero{font-family:Imp;font-size:212px;line-height:1;margin-top:-6px;background:linear-gradient(175deg,#FBE7AE 10%,#E9BF5E 55%,#C99A3E 90%);-webkit-background-clip:text;color:transparent;filter:drop-shadow(0 3px 18px rgba(0,0,0,.6))}
.cbot{position:absolute;top:var(--bt);left:80px;right:80px;text-align:center;color:#F4EBD8}
.ball{font-family:Gilda;font-size:50px;letter-spacing:.62em;padding-left:.62em;color:${GOLD};text-shadow:0 2px 20px rgba(0,0,0,.7)}
.orn{display:flex;align-items:center;justify-content:center;gap:18px;margin:16px 0 14px}
.orn i{display:block;width:120px;height:1px;background:linear-gradient(90deg,transparent,${GOLD})}.orn i:last-child{transform:scaleX(-1)}
.csub{font-family:Spec;font-style:italic;font-weight:400;font-size:34px;line-height:1.3;text-shadow:0 2px 18px rgba(0,0,0,.7)}
.swipe{position:absolute;bottom:48px;left:0;right:0;text-align:center;color:#F4EBD8;font-family:Jos;font-size:17px;letter-spacing:.42em;opacity:.8}
/* invitation */
.page{position:absolute;inset:0}
.damask{position:absolute;inset:0;opacity:.07;background-image:radial-gradient(circle at 50% 50%,#fff 1.4px,transparent 1.6px),radial-gradient(circle at 0 0,#fff 1px,transparent 1.3px);background-size:46px 46px,46px 46px;background-position:0 0,23px 23px}
.hd{position:absolute;top:44px;left:0;right:0;display:flex;justify-content:space-between;padding:0 66px;font-family:Jos;font-weight:600;font-size:17px;letter-spacing:.42em;color:${GOLD};opacity:.9}
.frame{position:absolute;top:92px;left:56px;width:968px;height:612px;border:1.5px solid ${GOLD};padding:10px;box-shadow:0 30px 60px rgba(0,0,0,.5)}
.frame:after{content:'';position:absolute;inset:4px;border:1px solid rgba(240,207,122,.45);pointer-events:none}
.frame img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(1.03) sepia(.08)}
.cameo{position:absolute;top:548px;right:44px;width:206px;height:258px;border-radius:50%;padding:7px;background:linear-gradient(160deg,#FBE7AE,#C99A3E 60%,#8E6A25);box-shadow:0 18px 40px rgba(0,0,0,.55);z-index:5}
.cameo img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;filter:saturate(.9) sepia(.1)}
.card{position:absolute;top:762px;left:86px;width:908px;height:520px;display:flex;flex-direction:column;justify-content:center;align-items:center;background:#F5EEDF;background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.6),transparent 60%),radial-gradient(ellipse at 80% 90%,rgba(196,170,120,.18),transparent 60%);
  box-shadow:0 26px 50px rgba(0,0,0,.55);text-align:center;padding:0 70px 6px}
.card:before{content:'';position:absolute;inset:16px;border:1.5px solid #B8933F}
.card:after{content:'';position:absolute;inset:23px;border:.8px solid rgba(184,147,63,.6)}
.req{font-family:Spec;font-style:italic;font-weight:400;font-size:30px;color:#6b5a45}
.title{font-family:Gilda;font-size:var(--fs,74px);line-height:1.05;letter-spacing:.06em;margin-top:14px;color:var(--ink)}
.occ{font-family:Imp;font-size:70px;line-height:1.05;color:#8C6A2A;margin-top:4px}
.mask{margin:10px auto 6px;display:block}
.meta{font-family:Jos;font-weight:600;font-size:20px;letter-spacing:.36em;color:#4a3c2c}
.dress{font-family:Spec;font-style:italic;font-weight:400;font-size:30px;color:#5b4b38;margin-top:18px}
.dress b{font-family:Jos;font-style:normal;font-weight:600;font-size:16px;letter-spacing:.34em;color:var(--ink);margin-right:10px;vertical-align:2px}
`;
const maskSvg = c => `<svg class="mask" width="120" height="34" viewBox="0 0 120 34"><path d="M0 17h30M90 17h30" stroke="${c}" stroke-width="1"/><path d="M60 26c-5 0-6-6-12-6-6 0-8 7-14 7-6 0-8-10-8-15 0-3 3-4 6-3 6 2 13 2 20-1 3-1 6 0 8 2 2-2 5-3 8-2 7 3 14 3 20 1 3-1 6 0 6 3 0 5-2 15-8 15-6 0-8-7-14-7-6 0-7 6-12 6z" fill="${c}"/><ellipse cx="44" cy="15" rx="5.5" ry="3.4" fill="#F5EEDF"/><ellipse cx="76" cy="15" rx="5.5" ry="3.4" fill="#F5EEDF"/></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') body = `<div style="--sh:${s.sh}px;--bt:${s.bt}px;position:absolute;inset:0"><img class="sky" src="file://${D}/${s.img}" style="object-position:${s.x}% 0%;top:0"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="seam"></div><div class="cshade"></div><div class="vig"></div>
      <div class="ctop"><div class="kick">${s.kick}</div><div class="hero">${s.h}</div></div>
      <div class="cbot"><div class="ball">${s.h2}</div><div class="orn"><i></i>${maskSvg(GOLD).replace('class="mask"', 'style="display:block"').replace(/#F5EEDF/g, '#120d07')}<i></i></div></div><div class="csub" style="position:absolute;left:0;right:0;bottom:${s.sb}px;text-align:center;color:#F4EBD8">${s.sub}</div><div class="swipe">SWIPE FOR THE GUEST LIST →</div></div>`;
    else body = `<div class="page" style="background:radial-gradient(ellipse at 50% 30%,${s.bg2},${s.bg} 70%)"></div><div class="damask"></div>
      <div class="hd"><span>AN INVITATION</span><span>Nº 0${s.n} / 05</span></div>
      <div class="frame"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      <div class="cameo"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div>
      <div class="card" style="--ink:${s.ink}"><div class="req">the pleasure of your company is requested at</div>
        <div class="title" style="--fs:${s.fs || 74}px">${s.t}</div><div class="occ">${s.occ}</div>${maskSvg('#B8933F')}
        <div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="dress"><b>DRESS CODE</b>${s.dress}</div></div>`;
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
