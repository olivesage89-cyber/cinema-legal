// "movies that look like a painting" — cover: Days of Heaven dusk house under an extended painted sky, umber Bodoni Moda italic;
// inside: GALLERY WALL (per-film museum wall, picture light, gilt frame, small hung second frame, museum wall label)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const INK = '#4A1F14';
const css = [ff('Bod', 'bodoni-moda', 400, 'italic'), ff('Bod', 'bodoni-moda', 500, 'italic'), ff('Bod', 'bodoni-moda', 600), ff('Bod', 'bodoni-moda', 500),
  ff('Mon', 'montserrat', 500), ff('Mon', 'montserrat', 600), ff('Cor', 'cormorant-garamond', 500, 'italic'), ff('Cor', 'cormorant-garamond', 400, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#111}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;pointer-events:none;z-index:50;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#B7A6A6 0%,#C8B2A8 22%,#D6BCA9 38%,#DCC1AB 48%)}
.bg{position:absolute;filter:saturate(1.02) contrast(1.04) sepia(.06);-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 230px)}
.cshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(0,0,0,0) 74%,rgba(14,8,4,.55) 88%,rgba(10,6,3,.82) 100%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 42%,rgba(0,0,0,0) 58%,rgba(40,20,10,.28) 100%)}
.mat{position:absolute;inset:34px;border:1.5px solid rgba(74,31,20,.45);pointer-events:none}
.mat:after{content:'';position:absolute;inset:7px;border:.8px solid rgba(74,31,20,.28)}
.ctop{position:absolute;top:112px;left:0;right:0;text-align:center;color:${INK}}
.kick{font-family:Mon;font-weight:600;font-size:21px;letter-spacing:.52em;padding-left:.52em;opacity:.88}
.pre{font-family:Bod;font-style:italic;font-weight:400;font-size:62px;margin-top:34px;letter-spacing:.01em}
.hero{font-family:Bod;font-style:italic;font-weight:500;font-size:214px;line-height:.9;margin-top:-4px;letter-spacing:-.01em}
.csub{position:absolute;left:0;right:0;bottom:96px;text-align:center;font-family:Cor;font-style:italic;font-weight:500;font-size:40px;color:#F6E7D3;text-shadow:0 2px 16px rgba(0,0,0,.6)}
.swipe{position:absolute;bottom:58px;left:0;right:0;text-align:center;color:#F6E7D3;font-family:Mon;font-weight:500;font-size:15px;letter-spacing:.46em;opacity:.75}
/* gallery */
.wall{position:absolute;inset:0}
.plaster{position:absolute;inset:0;opacity:.5;mix-blend-mode:soft-light;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='1350'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")}
.glow{position:absolute;left:50%;top:-120px;width:1300px;height:1000px;margin-left:-650px;background:radial-gradient(ellipse at 50% 20%,rgba(255,236,200,.26),rgba(255,236,200,.08) 45%,rgba(0,0,0,0) 70%)}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)}
.hd{position:absolute;top:52px;left:0;right:0;display:flex;justify-content:space-between;padding:0 64px;font-family:Mon;font-weight:600;font-size:16px;letter-spacing:.42em;color:var(--acc)}
.lamp{position:absolute;top:128px;left:50%;width:300px;margin-left:-150px;height:16px;border-radius:8px;background:linear-gradient(180deg,#F3D79A,#B08637 55%,#6B4F1E);box-shadow:0 6px 14px rgba(0,0,0,.5);z-index:6}
.lamp:before{content:'';position:absolute;left:50%;top:-34px;width:6px;height:36px;margin-left:-3px;background:linear-gradient(90deg,#6B4F1E,#D9B66C,#6B4F1E)}
.cone{position:absolute;top:136px;left:50%;width:900px;margin-left:-450px;height:420px;background:radial-gradient(ellipse at 50% 0%,rgba(255,240,205,.32),rgba(255,240,205,0) 70%);z-index:7;mix-blend-mode:screen;pointer-events:none}
.gilt{background:linear-gradient(135deg,#6E4F1C 0%,#E9C77B 14%,#9C7530 30%,#F6DE9A 48%,#8F6A2A 64%,#E3BE6E 82%,#5E4316 100%);
  box-shadow:0 34px 60px rgba(0,0,0,.6),0 10px 20px rgba(0,0,0,.35),inset 0 0 0 2px rgba(255,240,190,.5),inset 0 0 0 6px rgba(90,62,20,.55),inset 0 0 0 9px rgba(246,222,154,.6)}
.big{position:absolute;top:150px;left:68px;width:944px;padding:32px}
.inner{padding:7px;background:linear-gradient(135deg,#2a1c0c,#5a4220);box-shadow:inset 0 0 0 1px rgba(246,222,154,.55)}
.big img{width:100%;height:540px;object-fit:cover;display:block;filter:saturate(1.02) contrast(1.03)}
.small{position:absolute;top:842px;left:80px;width:330px;padding:20px;transform:rotate(-.6deg)}
.small img{width:100%;height:408px;object-fit:cover;display:block}
.label{position:absolute;top:880px;left:466px;width:540px;padding:42px 46px 40px;background:#F4EFE6;box-shadow:0 14px 30px rgba(0,0,0,.45),0 2px 4px rgba(0,0,0,.3);color:#1d1814}
.no{font-family:Mon;font-weight:600;font-size:14px;letter-spacing:.38em;color:#8a7d70}
.title{font-family:Bod;font-weight:600;font-size:var(--fs,58px);line-height:1.04;margin-top:16px;letter-spacing:-.005em}
.dir{font-family:Mon;font-weight:600;font-size:16px;letter-spacing:.24em;margin-top:16px;color:#2b241e}
.med{font-family:Cor;font-style:italic;font-weight:500;font-size:25px;color:#6b5f54;margin-top:4px}
.rule{width:64px;height:3px;background:var(--acc2);margin:20px 0 18px}
.ov{font-family:Cor;font-style:italic;font-weight:500;font-size:31px;line-height:1.22;color:#2b241e}
.foot{position:absolute;bottom:40px;right:64px;font-family:Bod;font-style:italic;font-size:24px;color:var(--acc);opacity:.85}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<div class="sky"></div><img class="bg" src="file://${D}/${s.img}" style="width:${s.w}px;left:${-s.l}px;top:${s.top}px"><div class="cshade"></div><div class="vig"></div><div class="mat"></div>
      <div class="ctop"><div class="kick">${s.kick}</div><div class="pre">${s.pre}</div><div class="hero">${s.h}</div></div>
      <div class="csub">${s.sub}</div><div class="swipe">SWIPE TO WALK THE GALLERY →</div>`;
    else body = `<div class="wall" style="background:linear-gradient(180deg,${s.wall2},${s.wall})"></div><div class="plaster"></div><div class="glow"></div><div class="shade"></div>
      <div class="hd" style="--acc:${s.acc}"><span>THE CINEMA GALLERY</span><span>ROOM 0${s.n} / 05</span></div>
      <div class="lamp"></div>
      <div class="big gilt"><div class="inner"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div></div>
      <div class="small gilt" style="padding:20px"><div class="inner"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div></div>
      <div class="label" style="--acc2:${s.acc}"><div class="no">Nº 0${s.n} &nbsp;·&nbsp; ${s.yr}</div><div class="title" style="--fs:${s.fs || 52}px">${s.t}</div>
        <div class="dir">${s.dir.toUpperCase()}</div><div class="med">${s.med}</div><div class="rule"></div><div class="ov">${s.ov}</div></div>`;
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
