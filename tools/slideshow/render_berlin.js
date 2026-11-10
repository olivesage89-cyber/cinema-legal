// "COLD WAR DOSSIER" look — cover: full-bleed night still, stencil + handwriting + typewriter type, sodium-orange ink.
// Inside: manila case-file folder on a dark desk, paper-clipped photo, taped second photo, rubber stamp per film.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const noise = (o, f = .9) => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${o}'/></svg>")`;
const css = [
  ff('Stencil', 'big-shoulders-stencil-display', 800), ff('Stencil', 'big-shoulders-stencil-display', 900),
  ff('Hand', 'la-belle-aurore', 400), ff('Type', 'courier-prime', 400), ff('Type', 'courier-prime', 700),
  ff('Old', 'old-standard-tt', 400), ff('Old', 'old-standard-tt', 700), ff('Old', 'old-standard-tt', 400, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0B1620}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.26;mix-blend-mode:overlay;background-image:${noise(1)}}
/* cover */
.cv .bg{position:absolute;left:50%;bottom:0;height:1150px;transform:translateX(-50%);filter:contrast(1.06) saturate(.9) brightness(1.02)}
.cv .sky{position:absolute;left:0;right:0;top:0;height:470px;background:linear-gradient(180deg,#0A1A26 0%,#0E2635 45%,rgba(16,44,60,0) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 50%,rgba(0,0,0,.42) 100%)}
.cv .txt{position:absolute;left:0;right:0;top:58px;text-align:center;color:#EFE8DA}
.kick{font-family:Type;font-weight:700;font-size:23px;letter-spacing:.5em;padding-left:.5em;opacity:.92}
.hand{font-family:Hand;font-size:70px;line-height:1;margin-top:22px;color:#EFE8DA;transform:rotate(-3deg)}
.big{font-family:Stencil;font-weight:900;font-size:256px;line-height:.82;letter-spacing:.035em;color:#F59A57;margin-top:4px;
  text-shadow:0 6px 40px rgba(245,154,87,.22),0 2px 6px rgba(0,0,0,.35)}
.sub{font-family:Old;font-style:italic;font-size:35px;margin-top:18px;opacity:.95;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.foot{position:absolute;left:0;right:0;bottom:54px;text-align:center;font-family:Type;font-weight:700;font-size:21px;letter-spacing:.34em;color:#EFE8DA;opacity:.9;text-shadow:0 1px 8px rgba(0,0,0,.8)}
.foot b{color:#F59A57}
/* dossier */
.desk{position:absolute;inset:0;background:radial-gradient(ellipse at 40% 30%,#2A3138,#151A1F 70%)}
.folder{position:absolute;left:44px;right:44px;top:96px;bottom:44px;background:#D8C8A2;border-radius:6px 10px 10px 10px;
  box-shadow:0 24px 50px rgba(0,0,0,.55),inset 0 0 120px rgba(120,90,40,.28)}
.folder:before{content:'';position:absolute;inset:0;border-radius:inherit;background-image:${noise(.55, .75)};mix-blend-mode:multiply;opacity:.5}
.folder:after{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 82% 88%,rgba(140,100,50,.18),rgba(0,0,0,0) 18%),radial-gradient(circle at 12% 20%,rgba(255,255,255,.18),rgba(0,0,0,0) 30%)}
.tab{position:absolute;left:44px;top:46px;width:330px;height:64px;background:#D8C8A2;border-radius:12px 12px 0 0;
  font-family:Type;font-weight:700;font-size:22px;letter-spacing:.24em;color:#3A3226;padding:18px 0 0 30px}
.hdr{position:absolute;left:96px;right:96px;top:128px;display:flex;justify-content:space-between;font-family:Type;font-size:21px;letter-spacing:.14em;color:#4A4032;border-bottom:1.5px solid rgba(60,50,35,.45);padding-bottom:10px}
.ph{position:absolute;background:#F4F0E6;padding:16px;box-shadow:0 10px 22px rgba(40,25,5,.35),0 1px 2px rgba(0,0,0,.25)}
.ph img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.82) contrast(1.04) sepia(.12)}
.main{left:92px;top:196px;width:896px;height:540px;transform:rotate(-1.1deg)}
.small{left:640px;top:960px;width:352px;height:244px;padding:12px;transform:rotate(2.6deg)}
.clip{position:absolute;left:150px;top:166px;width:46px;height:120px;border:5px solid #9AA3AB;border-radius:24px;transform:rotate(-8deg);box-shadow:1px 2px 2px rgba(0,0,0,.3)}
.clip:after{content:'';position:absolute;left:7px;top:10px;width:22px;height:80px;border:4px solid #B9C1C7;border-radius:14px}
.tape{position:absolute;left:770px;top:940px;width:120px;height:40px;background:rgba(240,232,205,.62);transform:rotate(-6deg);box-shadow:0 1px 2px rgba(0,0,0,.12)}
.title{position:absolute;left:96px;right:96px;top:768px;font-family:Old;font-weight:700;color:#1D1A15;line-height:.98;letter-spacing:-.01em}
.meta{position:absolute;left:98px;width:520px;font-family:Type;font-weight:700;font-size:22px;letter-spacing:.12em;color:#4A4032}
.line{position:absolute;left:98px;width:510px;font-family:Old;font-style:italic;font-size:33px;line-height:1.22;color:#2A251D}
.note{position:absolute;left:98px;width:520px;font-family:Type;font-size:20px;letter-spacing:.06em;color:#4A4032}
.red{display:inline-block;background:#1D1A15;height:18px;vertical-align:-2px;margin:0 4px}
.stamp{position:absolute;font-family:Stencil;font-weight:800;font-size:44px;letter-spacing:.12em;padding:6px 20px 2px;border:5px solid currentColor;
  outline:2px solid currentColor;outline-offset:5px;transform:rotate(-5deg);mix-blend-mode:multiply;opacity:.95;
  -webkit-mask-image:${noise(1, .45)};-webkit-mask-size:500px}
.num{position:absolute;right:96px;top:792px;font-family:Hand;font-size:52px;transform:rotate(-4deg)}
/* end */
.end{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,#1C3A4E,#0B1620 75%)}
.phone{position:absolute;left:50%;top:50%;height:1180px;transform:translate(-50%,-50%);filter:drop-shadow(0 30px 60px rgba(0,0,0,.55))}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<div class="cv"><img class="bg" src="file://${D}/${s.img}"><div class="sky"></div><div class="vig"></div>
      <div class="txt"><div class="kick">${s.kick}</div><div class="hand">${s.h}</div><div class="big">${s.h2}</div><div class="sub">${s.sub}</div></div>
      <div class="foot">${s.foot}</div></div><div class="grain"></div>`;
    else if (s.type === 'end') body = `<div class="end"></div><img class="phone" src="file://${D}/phone.png"><div class="grain" style="opacity:.12"></div>`;
    else {
      const top2 = 768 + s.tl * s.fs * .98 + 26;
      body = `<div class="desk"></div><div class="tab">FILE ${s.n} / 05</div><div class="folder"></div>
      <div class="hdr"><span>${s.where}</span><span>${s.code}</span></div>
      <div class="ph main"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div><div class="clip"></div>
      <div class="stamp" style="color:${s.ink};left:${s.sx}px;top:${s.sy}px">${s.stamp}</div>
      <div class="title" style="font-size:${s.fs}px">${s.t}</div>
      <div class="meta" style="top:${top2}px">${s.yr} &nbsp;·&nbsp; DIR. ${s.dir.toUpperCase()}</div>
      <div class="line" style="top:${top2 + 46}px">${s.ov}</div>
      <div class="note" style="top:1238px">${s.note}</div>
      <div class="ph small"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div><div class="tape"></div>
      <div class="grain" style="opacity:.18"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
