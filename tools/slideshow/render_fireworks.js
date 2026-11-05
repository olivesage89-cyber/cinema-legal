// ede.nnico — "fireworks on the fifth of november": night-sky cover + MATCHBOX inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Madi', 'ms-madi', 400), ff('Shoulders', 'big-shoulders-display', 800), ff('Shoulders', 'big-shoulders-display', 900),
  ff('Gel', 'gelasio', 400, 'italic'), ff('Gel', 'gelasio', 500, 'italic'), ff('Gel', 'gelasio', 600),
  ff('Arch', 'archivo', 500), ff('Arch', 'archivo', 600), ff('Arch', 'archivo', 700), ff('Ultra', 'ultra', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0a0712}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%);pointer-events:none}
/* cover */
.cimg{position:absolute;bottom:0;height:1080px;left:-804px;filter:saturate(.92) contrast(1.05) brightness(.97);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.55) 14%,#000 34%)}
.ctxt{position:absolute;left:0;right:0;top:78px;text-align:center}
.ckick{font-family:Arch;font-weight:600;font-size:23px;letter-spacing:.5em;color:#E9E1F7;opacity:.92;padding-left:.5em}
.cbig{font-family:Shoulders;font-weight:900;font-size:218px;line-height:.86;letter-spacing:.02em;color:#F3EEFB;margin-top:14px;
  text-shadow:0 0 34px rgba(240,107,176,.55),0 0 90px rgba(150,110,220,.45),0 4px 14px rgba(0,0,0,.45)}
.cscript{font-family:Madi;font-size:132px;color:#F46BB2;line-height:1;margin-top:-50px;transform:rotate(-5deg);
  text-shadow:0 0 22px rgba(244,107,178,.6),0 3px 10px rgba(0,0,0,.6)}
.csub{font-family:Gel;font-style:italic;font-weight:500;font-size:37px;color:#EFE6F6;margin-top:6px;text-shadow:0 2px 14px rgba(0,0,0,.8)}
.csub b{color:#F46BB2;font-weight:500}
.cfoot{position:absolute;bottom:46px;left:0;right:0;text-align:center;font-family:Arch;font-weight:600;font-size:19px;letter-spacing:.45em;color:#F3EEFB;opacity:.9;text-shadow:0 1px 10px rgba(0,0,0,.9)}
.cfade{position:absolute;left:0;right:0;bottom:0;height:200px;background:linear-gradient(180deg,rgba(10,7,18,0),rgba(10,7,18,.7))}
/* matchbox slide */
.page{position:absolute;inset:0}
.smoke{position:absolute;inset:0;background:radial-gradient(ellipse 70% 40% at 50% 30%,rgba(255,255,255,.07),rgba(0,0,0,0) 70%),radial-gradient(ellipse 60% 30% at 30% 90%,rgba(255,255,255,.05),rgba(0,0,0,0) 70%)}
.hdr{position:absolute;top:46px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;font-family:Arch;font-weight:600;font-size:19px;letter-spacing:.38em;color:rgba(255,246,230,.82)}
.hdr .m{font-family:Madi;font-size:54px;letter-spacing:0;color:var(--acc);text-transform:none;margin-top:-10px}
.still{position:absolute;top:112px;left:60px;width:960px;height:640px;border-radius:22px;object-fit:cover;
  box-shadow:0 30px 60px rgba(0,0,0,.5);filter:saturate(.95) contrast(1.04)}
.box{position:absolute;left:84px;top:690px;width:912px;height:560px;transform:rotate(-2.2deg);filter:drop-shadow(0 26px 34px rgba(0,0,0,.55))}
.sticks{position:absolute;left:520px;top:-58px;width:300px;height:80px}
.stick{position:absolute;bottom:0;width:13px;background:linear-gradient(90deg,#d9b98a,#f0d7ae 45%,#c79e6c);border-radius:2px}
.stick i{position:absolute;top:-17px;left:-4px;width:21px;height:26px;border-radius:50% 50% 45% 45%;background:radial-gradient(circle at 40% 35%,#e0574a,#9e1f1c 70%)}
.drawer{position:absolute;left:30px;right:30px;top:-14px;height:40px;background:linear-gradient(180deg,#c9a77a,#b08b5e);border-radius:4px}
.outer{position:absolute;inset:0;border-radius:10px;background:#2b1a12;overflow:hidden}
.strike{position:absolute;top:0;bottom:0;width:46px;background:#5a3424;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='s'><feTurbulence type='fractalNoise' baseFrequency='1.6' numOctaves='2'/><feColorMatrix values='0 0 0 0 .2 0 0 0 0 .1 0 0 0 0 .06 0 0 0 1.2 -.2'/></filter><rect width='100%' height='100%' filter='url(%23s)'/></svg>")}
.strike.l{left:0}.strike.r{right:0}
.label{position:absolute;left:46px;right:46px;top:0;bottom:0;background:#F2E7D0;
  background-image:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.5),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(150,110,60,.18),rgba(0,0,0,0) 60%)}
.frame{position:absolute;inset:16px;border:3px solid var(--ink);border-radius:6px}
.frame2{position:absolute;inset:24px;border:1px solid var(--ink);border-radius:3px;opacity:.7}
.band{position:absolute;left:24px;right:24px;top:24px;height:58px;background:var(--ink);display:flex;align-items:center;justify-content:space-between;padding:0 28px;
  font-family:Arch;font-weight:700;font-size:19px;letter-spacing:.34em;color:#F2E7D0}
.band .s{font-family:Madi;font-weight:400;font-size:44px;letter-spacing:0;margin-top:-6px}
.inset{position:absolute;left:52px;top:112px;width:250px;height:320px;object-fit:cover;border:7px solid #fff;outline:2px solid var(--ink);
  border-radius:4px;filter:saturate(.95)}
.info{position:absolute;left:338px;right:44px;top:108px}
.ttl{font-family:Ultra;font-size:var(--fs,64px);line-height:1.02;color:var(--ink);letter-spacing:.005em}
.meta{font-family:Arch;font-weight:600;font-size:19px;letter-spacing:.3em;color:#3a2a20;margin-top:18px}
.rule{height:2px;width:90px;background:var(--ink);margin:18px 0 16px}
.line{font-family:Gel;font-style:italic;font-weight:500;font-size:32px;line-height:1.3;color:#2e211a}
.foot{position:absolute;left:24px;right:24px;bottom:30px;text-align:center;font-family:Arch;font-weight:600;font-size:15px;letter-spacing:.42em;color:var(--ink);opacity:.85}
.star{position:absolute;color:var(--ink);font-size:20px}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') {
      body = `<img class="cimg" src="file://${D}/${s.img}"><div class="cfade"></div><div class="vig"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="cbig">${s.h}</div><div class="cscript">${s.h2}</div><div class="csub">${s.sub}</div></div>
      <div class="cfoot">05 FILMS &nbsp;·&nbsp; SWIPE &nbsp;→</div><div class="grain"></div>`;
    } else {
      const n = String(i).padStart(2, '0');
      const sticks = [[0, 54], [26, 66], [52, 50], [78, 60], [104, 46]].map(([l, h]) => `<div class="stick" style="left:${l}px;height:${h}px"><i></i></div>`).join('');
      body = `<div class="page" style="background:${s.page}"></div><div class="smoke"></div>
      <div class="hdr" style="--acc:${s.acc}"><span>Nº ${n} / 05</span><span class="m">remember, remember</span><span>THE 5TH</span></div>
      <img class="still" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%">
      <div class="box" style="--ink:${s.ink};--fs:${s.fs || 64}px">
        <div class="sticks">${sticks}</div>
        <div class="outer"><div class="strike l"></div><div class="strike r"></div>
          <div class="label"><div class="frame"></div><div class="frame2"></div>
            <div class="band"><span>SAFETY MATCHES</span><span class="s">fireworks</span><span>Nº ${n}</span></div>
            <img class="inset" src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%">
            <div class="info"><div class="ttl">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="rule"></div><div class="line">${s.ov}</div></div>
            <div class="foot">✶ &nbsp;STRIKE GENTLY · LIGHTS UP THE DARK&nbsp; ✶</div>
          </div></div>
      </div><div class="vig"></div><div class="grain"></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
