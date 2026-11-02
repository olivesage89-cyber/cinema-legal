// "main character" — cover: hazy NYC ferry still masked up into pale sky, berry Bodoni type.
// inside: MAGAZINE COVER — full-bleed still, giant "MAIN" masthead per-film colour, cover lines, barcode.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Bod', 'bodoni-moda', 400), ff('Bod', 'bodoni-moda', 400, 'italic'), ff('Bod', 'bodoni-moda', 500, 'italic'), ff('Bod', 'bodoni-moda', 800), ff('Bod', 'bodoni-moda', 900),
  ff('Ital', 'italianno', 400), ff('Jost', 'jost', 400), ff('Jost', 'jost', 500), ff('Jost', 'jost', 600)].join('');
const grain = `<div class="grain"></div>`;
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.25) 100%)}`;

function cover(s) {
  return `<style>${base}
body{background:linear-gradient(180deg,#E3ECE8 0%,#EDF6F1 40%,#EEF8F2 60%)}
.img{position:absolute;left:0;bottom:0;width:1080px;height:1010px;object-fit:cover;object-position:${s.x}% 50%;
 filter:saturate(.82) contrast(.95) brightness(1.02) sepia(.08);
 -webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.35) 110px,#000 330px)}
.ink{color:${s.ink}}
.t{position:absolute;left:0;right:0;top:62px;text-align:center}
.kick{font-family:Jost;font-weight:500;font-size:25px;letter-spacing:.46em;margin-left:.46em}
.row{position:relative;display:inline-block;margin-top:6px}
.the{position:absolute;left:-142px;top:62px;font-family:Ital;font-size:150px;transform:rotate(-8deg);color:#2A2224}
.main{font-family:Bod;font-style:italic;font-weight:400;font-size:250px;line-height:.86;letter-spacing:-.01em}
.char{font-family:Bod;font-weight:800;font-size:116px;letter-spacing:.115em;margin-left:.115em;line-height:1;margin-top:6px}
.rule{width:120px;height:2px;background:${s.ink};margin:26px auto 20px;opacity:.85}
.sub{font-family:Bod;font-style:italic;font-size:38px;color:#2A2224}
.foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Jost;font-weight:500;font-size:21px;letter-spacing:.4em;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,.45)}
</style><img class="img" src="file://${D}/${s.img}"><div class="vig" style="background:radial-gradient(ellipse at 50% 70%,rgba(0,0,0,0) 62%,rgba(0,0,0,.22) 100%)"></div>
<div class="t ink"><div class="kick">${s.kick}</div><div class="row"><span class="the">the</span><div class="main">main</div></div><div class="char">CHARACTER</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
<div class="foot">5 FILMS &nbsp;·&nbsp; SWIPE →</div>${grain}`;
}

function mag(s, i) {
  const bars = Array.from({ length: 34 }, (_, k) => `<i style="width:${[2, 4, 1, 3, 2, 1, 4, 2][(k * 7 + i) % 8]}px"></i>`).join('');
  return `<style>${base}
body{background:#111}
.img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${s.x}% ${s.y ?? 50}%;transform:scale(${s.z || 1});transform-origin:${s.x}% ${s.oy ?? 0}%;
 filter:${s.bw ? 'grayscale(1) contrast(1.05) brightness(1.02)' : 'saturate(.9) contrast(.96) brightness(1.02) sepia(.06)'}}
.topfade{position:absolute;left:0;right:0;top:0;height:330px;background:linear-gradient(180deg,rgba(0,0,0,${s.tf ?? .35}),rgba(0,0,0,0))}
.botfade{position:absolute;left:0;right:0;bottom:0;height:560px;background:linear-gradient(0deg,rgba(10,6,8,.86),rgba(10,6,8,.55) 45%,rgba(10,6,8,0))}
.issue{position:absolute;top:40px;left:56px;right:56px;display:flex;justify-content:space-between;font-family:Jost;font-weight:500;font-size:19px;letter-spacing:.34em;color:#fff;text-shadow:0 1px 8px rgba(0,0,0,.4)}
.mast{position:absolute;top:58px;left:0;right:0;text-align:center;font-family:Bod;font-weight:900;font-size:300px;line-height:1;letter-spacing:.02em;color:${s.ink};text-shadow:0 4px 30px rgba(0,0,0,.18)}
.mchar{position:absolute;top:258px;left:${s.cl ?? 640}px;font-family:Ital;font-size:112px;color:#fff;transform:rotate(-6deg);text-shadow:0 2px 14px rgba(0,0,0,.45)}
.lines{position:absolute;${s.side || 'left'}:56px;top:${s.lt ?? 420}px;width:${s.lw ?? 330}px;color:#fff;text-shadow:0 1px 12px rgba(0,0,0,.55);text-align:${s.side || 'left'}}
.lab{font-family:Jost;font-weight:600;font-size:18px;letter-spacing:.3em;color:${s.ink}}
.big{font-family:Bod;font-weight:800;font-size:40px;line-height:1.02;margin:6px 0 26px;text-transform:uppercase;letter-spacing:.01em}
.sm{font-family:Bod;font-style:italic;font-size:30px;line-height:1.15;margin:6px 0 26px}
.bottom{position:absolute;left:56px;right:56px;bottom:62px;color:#fff}
.title{font-family:Bod;font-style:italic;font-weight:500;font-size:${s.fs || 120}px;line-height:.95;letter-spacing:-.01em}
.meta{font-family:Jost;font-weight:500;font-size:21px;letter-spacing:.32em;margin-top:18px;color:${s.ink}}
.line{font-family:Bod;font-style:italic;font-size:34px;line-height:1.25;margin-top:16px;max-width:780px;opacity:.95}
.bar{position:absolute;right:56px;bottom:62px;background:#fff;padding:10px 12px 6px;display:flex;flex-direction:column;align-items:center}
.bar div{display:flex;gap:2px;height:62px}.bar i{display:block;background:#111;height:100%}
.bar span{font-family:Jost;font-size:12px;letter-spacing:.2em;color:#111;margin-top:4px}

.fg{position:absolute;inset:0;width:100%;height:100%;filter:${s.bw ? 'grayscale(1) contrast(1.05) brightness(1.02)' : 'saturate(.9) contrast(.96) brightness(1.02) sepia(.06)'}}
</style><img class="img" src="file://${D}/cut/${String(i+1).padStart(2,'0')}_bg.jpg" style="object-position:50% 50%;transform:none"><div class="topfade"></div>
<div class="mast">MAIN</div><img class="fg" src="file://${D}/cut/${String(i+1).padStart(2,'0')}_fg.png"><div class="botfade"></div><div class="vig"></div>
<div class="issue"><span>THE NOVEMBER ISSUE</span><span>Nº 0${i} / 05</span></div><div class="mchar">character</div>
<div class="lines"><div class="lab">STARRING</div><div class="sm">${s.star}</div><div class="lab">THE COVER STORY</div><div class="big">${s.cl1}</div></div>
<div class="bottom"><div class="title">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; DIR. ${s.dir.toUpperCase()}</div><div class="line">${s.ov}</div></div>
<div class="bar"><div>${bars}</div><span>${s.yr}</span></div>${grain}`;
}

const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  let n = 0;
  for (const s of S) {
    const html = `<html><head><meta charset="utf-8"></head><body>${s.type === 'cover' ? cover(s) : mag(s, ++n)}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
