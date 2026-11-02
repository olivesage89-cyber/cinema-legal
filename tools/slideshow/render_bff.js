// "movies for when you miss your best friend" — cover: full-bleed Shawshank Zihuatanejo beach reunion (aerial),
// stormy sky; Inter spaced kicker + Reenie Beanie handwritten 'miss your' + giant peach DM Serif Display italic 'best friend'.
// Inside: PHOTO BOOTH (per-film deep page, white-bordered big still, tilted 3-frame photo-booth strip w/ handwritten
// caption, 'FRIENDS SINCE' accent caps, DM Serif title, Inter caps dir·year, Libre Caslon italic line, handwritten note).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('DMS', 'dm-serif-display', 400), ff('DMS', 'dm-serif-display', 400, 'italic'), ff('RB', 'reenie-beanie', 400),
  ff('Int', 'inter', 500), ff('Int', 'inter', 600), ff('Int', 'inter', 700),
  ff('LC', 'libre-caslon-text', 400, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#1b2030}
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.1) contrast(1.06) brightness(.98) sepia(.08)}
.cv .top{position:absolute;left:0;right:0;top:0;height:46%;background:linear-gradient(180deg,rgba(14,17,28,.78) 0%,rgba(14,17,28,.5) 55%,rgba(14,17,28,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 48%,rgba(0,0,0,.45) 100%)}
.cv .warm{position:absolute;inset:0;background:linear-gradient(0deg,rgba(255,170,120,.10),rgba(255,170,120,0) 50%);mix-blend-mode:soft-light}
.cv .ttl{position:absolute;left:0;right:0;top:86px;text-align:center}
.cv .kick{font-family:Int;font-weight:600;font-size:21px;letter-spacing:.52em;padding-left:.52em;color:#F6EEE6;text-shadow:0 2px 12px rgba(0,0,0,.7)}
.cv .hand{font-family:RB;font-size:118px;line-height:1;color:#F6EEE6;transform:rotate(-5deg);margin:30px 0 -34px -330px;text-shadow:0 3px 18px rgba(0,0,0,.55)}
.cv .h{font-family:DMS;font-style:italic;font-size:188px;line-height:.9;color:var(--acc);letter-spacing:-.01em;text-shadow:0 8px 40px rgba(0,0,0,.5),0 0 60px rgba(255,190,150,.18)}
.cv .rule{width:120px;height:2px;background:var(--acc);margin:34px auto 22px;opacity:.9}
.cv .sub{font-family:LC;font-style:italic;font-size:33px;color:#F6EEE6;text-shadow:0 2px 14px rgba(0,0,0,.75)}
.cv .sub b{font-weight:400;color:var(--acc)}
/* inside: photo booth */
.pb{background:var(--pg)}
.pb .page{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,255,255,.10),rgba(255,255,255,0) 55%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.4) 100%)}
.pb .hd{position:absolute;left:66px;right:66px;top:52px;display:flex;justify-content:space-between;align-items:baseline;color:#F4ECE2}
.pb .hd .a{font-family:Int;font-weight:700;font-size:15px;letter-spacing:.38em}
.pb .hd .b{font-family:RB;font-size:40px;color:var(--acc);transform:rotate(-2deg)}
.pb .hd .c{font-family:Int;font-weight:700;font-size:15px;letter-spacing:.38em}
.pb .big{position:absolute;left:58px;top:118px;width:964px;height:560px;background:#FAF6EF;padding:14px;box-shadow:0 20px 44px rgba(0,0,0,.45),0 3px 8px rgba(0,0,0,.3);transform:rotate(-1.2deg)}
.pb .big div{width:100%;height:100%;background-size:cover;filter:saturate(1.05) contrast(1.03) sepia(.06)}
.pb .strip{position:absolute;left:70px;top:640px;width:282px;background:#FAF6EF;padding:16px 16px 0;box-shadow:0 20px 40px rgba(0,0,0,.5),0 3px 8px rgba(0,0,0,.3);transform:rotate(4deg)}
.pb .strip div{width:250px;height:176px;background-size:cover;margin-bottom:12px;filter:saturate(.95) contrast(1.05) sepia(.12)}
.pb .strip p{font-family:RB;font-size:38px;color:#2a2622;text-align:center;line-height:1;padding:2px 0 10px}
.pb .txt{position:absolute;left:410px;right:56px;top:775px;color:#F4ECE2}
.pb .since{font-family:Int;font-weight:700;font-size:16px;letter-spacing:.4em;color:var(--acc)}
.pb .t{font-family:DMS;font-size:var(--tfs,76px);line-height:.98;margin-top:16px;color:#FBF4EA}
.pb .dir{font-family:Int;font-weight:600;font-size:15px;letter-spacing:.28em;margin-top:18px;color:rgba(244,236,226,.75)}
.pb .dir b{color:var(--acc)}
.pb .line{width:70px;height:2px;background:var(--acc);margin:28px 0 22px}
.pb .ov{font-family:LC;font-style:italic;font-size:32px;line-height:1.36;color:#F4ECE2}
.pb .note{position:absolute;right:56px;bottom:56px;font-family:RB;font-size:48px;line-height:1;color:var(--acc);transform:rotate(-3deg);text-align:right}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const im = (f, x = 50, y = 50) => `<div style="background-image:url(file://${D}/${f});background-position:${x}% ${y}%"></div>`;
  for (const s of S) {
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<img class="bg" src="file://${D}/${s.img}"><div class="warm"></div><div class="top"></div><div class="vig"></div>
      <div class="ttl"><div class="kick">${s.kick}</div><div class="hand">${s.hand}</div><div class="h">${s.h}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>`;
    } else {
      cls = 'pb';
      body = `<div class="page"></div>
      <div class="hd"><span class="a">Nº ${s.n} / 05</span><span class="b">for my best friend</span><span class="c">PHOTO BOOTH</span></div>
      <div class="big">${im(s.img, s.x, s.y)}</div>
      <div class="strip">${s.strip.map(q => im(q[0], q[1], q[2])).join('')}<p>${s.cap}</p></div>
      <div class="txt" style="--tfs:${s.tfs || 76}px"><div class="since">${s.since}</div><div class="t">${s.t}</div>
        <div class="dir">${s.dir.toUpperCase()} · <b>${s.yr}</b></div><div class="line"></div><div class="ov">${s.ov}</div></div>
      <div class="note">${s.note}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--pg:${s.pg || '#222'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
