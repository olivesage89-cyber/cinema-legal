// "floating in space" — cover: Gravity astronaut above earth's limb, extended black sky; Instrument Serif italic + Michroma wide caps, ice blue.
// inside: VIEWPORT + MISSION PATCH (starfield page, bezel-framed still w/ HUD brackets, round mission patch w/ 2nd still + curved text, telemetry footer)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GR = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const stars = (n, h) => Array.from({ length: n }, () => `${Math.round(rnd() * 1080)}px ${Math.round(rnd() * h)}px 0 ${rnd() < .1 ? 1 : 0}px rgba(255,255,255,${(.25 + rnd() * .7).toFixed(2)})`).join(',');
const css = [ff('Inst', 'instrument-serif', 400), ff('Inst', 'instrument-serif', 400, 'italic'), ff('Mich', 'michroma', 400),
  ff('Mono', 'dm-mono', 400), ff('Mono', 'dm-mono', 500)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#030509;font-family:Inst}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.17;mix-blend-mode:overlay;background-image:${GR};pointer-events:none;z-index:50}
.st{position:absolute;left:0;top:0;width:1px;height:1px;background:transparent}
/* COVER */
.cv .img{position:absolute;height:1080px;left:-${'${CX}'}px;top:300px}
.cv .fade{position:absolute;left:0;right:0;top:300px;height:260px;background:linear-gradient(180deg,#030509,rgba(3,5,9,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 70%,rgba(0,0,0,0) 45%,rgba(0,0,0,.45) 100%)}
.cv .kick{position:absolute;top:118px;width:100%;text-align:center;font-family:Mono;font-weight:500;font-size:24px;letter-spacing:.42em;padding-left:.42em;color:#DDE9F5;opacity:.88}
.cv .h{position:absolute;top:160px;width:100%;text-align:center;font-style:italic;font-size:150px;line-height:1;color:#F3F7FB;letter-spacing:-.01em;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.cv .h2{position:absolute;top:330px;width:100%;text-align:center;font-family:Mich;font-size:132px;letter-spacing:.3em;padding-left:.3em;line-height:1;color:#A9D8FF;
  text-shadow:0 0 34px rgba(120,190,255,.45),0 0 2px rgba(169,216,255,.6)}
.cv .sub{position:absolute;bottom:74px;width:100%;text-align:center;font-style:italic;font-size:42px;color:#EAF2FA;text-shadow:0 2px 18px rgba(0,0,0,.75)}
.cv .sub span{font-family:Mono;font-style:normal;font-size:20px;letter-spacing:.34em;display:block;margin-bottom:10px;color:#A9D8FF}
/* INSIDE */
.mv .hdr{position:absolute;top:52px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Mono;font-weight:500;font-size:19px;letter-spacing:.3em;color:#9AA6B4}
.mv .hdr b{color:var(--ac);font-weight:500}
.mv .rule{position:absolute;top:92px;left:60px;right:60px;height:10px;border-top:1px solid rgba(154,166,180,.45);
  background:repeating-linear-gradient(90deg,rgba(154,166,180,.45) 0 1px,transparent 1px 24px);background-size:100% 6px;background-repeat:no-repeat}
.mv .port{position:absolute;left:52px;top:124px;width:976px;height:640px;border-radius:54px;padding:12px;background:linear-gradient(160deg,#2A313C,#0E1218 55%,#1D232C);
  box-shadow:0 0 0 1px rgba(255,255,255,.06),0 30px 60px rgba(0,0,0,.6)}
.mv .port .in{position:relative;width:100%;height:100%;border-radius:44px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(255,255,255,.12)}
.mv .port img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92) contrast(1.04)}
.mv .port .gl{position:absolute;inset:0;border-radius:44px;background:linear-gradient(125deg,rgba(255,255,255,.10),rgba(255,255,255,0) 30%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.35));box-shadow:inset 0 0 40px rgba(0,0,0,.5)}
.mv .br{position:absolute;width:46px;height:46px;border-color:var(--ac);border-style:solid;opacity:.9}
.mv .br.a{left:30px;top:30px;border-width:3px 0 0 3px}.mv .br.b{right:30px;top:30px;border-width:3px 3px 0 0}
.mv .br.c{left:30px;bottom:30px;border-width:0 0 3px 3px}.mv .br.d{right:30px;bottom:30px;border-width:0 3px 3px 0}
.mv .rec{position:absolute;right:44px;bottom:38px;background:rgba(3,5,9,.55);padding:7px 12px 6px 16px;border-radius:6px;font-family:Mono;font-size:17px;letter-spacing:.24em;color:rgba(255,255,255,.85);text-shadow:0 1px 6px rgba(0,0,0,.6)}
.mv .patch{position:absolute;left:58px;top:812px;width:330px;height:330px}
.mv .patch .ph{position:absolute;left:44px;top:44px;width:242px;height:242px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 4px var(--ac),0 0 0 9px #0A0D12,0 0 0 11px rgba(255,255,255,.25)}
.mv .patch .ph img{width:100%;height:100%;object-fit:cover}
.mv .patch svg{position:absolute;inset:0}
.mv .blk{position:absolute;left:430px;right:56px;top:830px}
.mv .tt{font-size:var(--fs,104px);line-height:.92;color:#F4F7FA;letter-spacing:-.005em}
.mv .tt i{color:var(--ac)}
.mv .meta{font-family:Mono;font-weight:500;font-size:20px;letter-spacing:.22em;color:var(--ac);margin-top:22px}
.mv .ln{font-style:italic;font-size:40px;line-height:1.22;color:#D9E0E8;margin-top:22px}
.mv .ft{position:absolute;bottom:52px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:Mono;font-size:17px;letter-spacing:.22em;color:#6E7A88;
  border-top:1px solid rgba(154,166,180,.3);padding-top:16px}
.mv .dot{display:inline-block;width:10px;height:10px;border-radius:50%;background:var(--ac);margin-left:6px;box-shadow:0 0 10px var(--ac)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    if (s.type === 'end') continue;
    let cls, body;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<div class="st" style="box-shadow:${stars(170, 520)}"></div><img class="img" src="file://${D}/${s.img}" style="left:-${s.cx}px">
      <div class="fade"></div><div class="vig"></div>
      <div class="kick">${s.kick}</div><div class="h">${s.h}</div><div class="h2">${s.h2}</div><div class="sub">${s.sub}</div>`;
    } else {
      cls = 'mv';
      const R = 141, id = 'c' + s.n;
      body = `<div class="st" style="box-shadow:${stars(220, 1350)}"></div>
      <div class="hdr"><span>MISSION <b>0${s.n}</b> / 05</span><span>FLOATING IN SPACE</span></div><div class="rule"></div>
      <div class="port"><div class="in"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"><div class="gl"></div>
        <div class="br a"></div><div class="br b"></div><div class="br c"></div><div class="br d"></div><div class="rec">${s.rec}</div></div></div>
      <div class="patch"><div class="ph"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div>
        <svg viewBox="0 0 330 330"><defs><path id="${id}" d="M165,165 m-${R},0 a${R},${R} 0 1,1 ${2 * R},0 a${R},${R} 0 1,1 -${2 * R},0"/></defs>
        <circle cx="165" cy="165" r="160" fill="none" stroke="rgba(255,255,255,.22)" stroke-width="1.5"/>
        <text font-family="Mono" font-weight="500" font-size="17" letter-spacing="5" fill="${s.ac}"><textPath href="#${id}" startOffset="0" textLength="872" lengthAdjust="spacing">${s.patch}</textPath></text></svg></div>
      <div class="blk"><div class="tt">${s.t}</div><div class="meta">DIR. ${s.dir.toUpperCase()} · ${s.yr}</div><div class="ln">${s.ov}</div></div>
      <div class="ft"><span>${s.tel}</span><span>SIGNAL<span class="dot"></span></span></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--ac:${s.ac || '#A9D8FF'};--fs:${s.fs || 104}px">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
