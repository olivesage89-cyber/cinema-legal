// "a rainy afternoon at the museum" — cover: full-bleed Chagall-window still w/ deep ultramarine top fade;
// inside: GALLERY WALL (still hung as a painting in a gilt frame on a per-film painted wall, picture light, museum wall label).
// Usage: node render_museum.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PLASTER = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='4' seed='7'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")`;
const css = [
  ff('Prata', 'prata', 400), ff('Monsieur', 'monsieur-la-doulaise', 400),
  ff('Manrope', 'manrope', 500), ff('Manrope', 'manrope', 600), ff('Manrope', 'manrope', 700),
  ff('News', 'newsreader', 400), ff('News', 'newsreader', 400, 'italic'), ff('News', 'newsreader', 500, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#0B1430;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;${GRAIN};pointer-events:none}
/* COVER */
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(1.12) contrast(1.05) brightness(1.1)}
.cv .fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,10,32,.94) 0%,rgba(5,10,32,.86) 22%,rgba(6,14,44,.45) 38%,rgba(6,14,44,0) 52%)}
.cv .bot{position:absolute;inset:0;background:linear-gradient(0deg,rgba(4,6,16,.55) 0%,rgba(4,6,16,0) 22%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.cv .txt{position:absolute;left:0;right:0;top:92px;text-align:center}
.cv .kick{font-family:Manrope;font-weight:600;font-size:23px;letter-spacing:.5em;color:#F3EEE4;opacity:.92;padding-left:.5em}
.cv .script{font-family:Monsieur;font-size:118px;color:var(--s);line-height:1;margin-top:18px;margin-bottom:-12px;position:relative;z-index:2;transform:rotate(-4deg);text-shadow:0 0 30px rgba(0,0,0,.35)}
.cv .hero{font-family:Prata;font-size:178px;color:var(--h);letter-spacing:.05em;line-height:.9;margin-top:-6px;padding-left:.06em;text-shadow:0 6px 40px rgba(0,0,0,.45)}
.cv .rule{width:120px;height:1.5px;background:var(--s);margin:30px auto 0;opacity:.85}
.cv .sub{font-family:News;font-style:italic;font-weight:400;font-size:38px;color:#F3EEE4;margin-top:24px;line-height:1.3;text-shadow:0 2px 14px rgba(0,0,0,.5)}
.cv .sub b{font-weight:500;color:var(--s)}
.cv .foot{position:absolute;bottom:52px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Manrope;font-weight:600;font-size:19px;letter-spacing:.34em;color:#F3EEE4;opacity:.85;text-shadow:0 1px 10px rgba(0,0,0,.6)}
/* GALLERY WALL */
.wall{position:absolute;inset:0;background:var(--w)}
.wall:before{content:'';position:absolute;inset:0;${PLASTER};opacity:.22;mix-blend-mode:overlay}
.wall:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 70% 52% at 50% 30%,rgba(255,232,190,.30),rgba(255,232,190,.08) 55%,rgba(0,0,0,0) 75%),linear-gradient(180deg,rgba(0,0,0,.25),rgba(0,0,0,0) 18%,rgba(0,0,0,0) 70%,rgba(0,0,0,.35))}
.dado{position:absolute;left:0;right:0;top:1080px;height:3px;background:rgba(0,0,0,.28);box-shadow:0 2px 0 rgba(255,255,255,.07)}
.floor{position:absolute;left:0;right:0;top:1238px;bottom:0;background:linear-gradient(180deg,#3a2414,#22140b);}
.floor:before{content:'';position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(0,0,0,.18) 0 2px,rgba(0,0,0,0) 2px 120px),repeating-linear-gradient(90deg,rgba(255,220,170,.05) 0 60px,rgba(0,0,0,.06) 60px 120px)}
.skirt{position:absolute;left:0;right:0;top:1216px;height:22px;background:linear-gradient(180deg,rgba(0,0,0,.18),rgba(0,0,0,.35));border-top:2px solid rgba(255,255,255,.08)}
.head{position:absolute;top:58px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font-family:Manrope;font-weight:600;font-size:19px;letter-spacing:.34em;color:var(--hc);opacity:.88}
.head .m{font-family:Monsieur;font-size:58px;letter-spacing:0;font-weight:400;transform:translateY(8px);opacity:1}
.lamp{position:absolute;left:50%;top:132px;width:300px;height:26px;transform:translateX(-50%);border-radius:14px 14px 30px 30px;background:linear-gradient(180deg,#e8c77a,#9a7330 60%,#5e4318);box-shadow:0 4px 10px rgba(0,0,0,.45)}
.lamp:after{content:'';position:absolute;left:50%;top:-24px;width:10px;height:28px;transform:translateX(-50%);background:linear-gradient(90deg,#6b4c1c,#d9b56a,#6b4c1c)}
.beam{position:absolute;left:50%;top:150px;width:900px;height:520px;transform:translateX(-50%);background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(255,236,196,.38),rgba(255,236,196,0) 70%);mix-blend-mode:screen}
.frame{position:absolute;left:50%;top:176px;transform:translateX(-50%);padding:34px;
  background:linear-gradient(135deg,#7a5418,#f3d78a 18%,#a8792c 34%,#ffe7a6 50%,#8e6420 66%,#e8c472 82%,#6e4a14);
  box-shadow:0 30px 50px rgba(0,0,0,.55),0 8px 14px rgba(0,0,0,.4),inset 0 0 0 3px rgba(60,36,6,.55),inset 0 0 0 9px rgba(255,236,170,.28),inset 0 0 18px rgba(0,0,0,.5)}
.frame:before{content:'';position:absolute;inset:12px;border:3px double rgba(70,44,8,.6);pointer-events:none}
.mat{padding:0;background:#1a120a;box-shadow:inset 0 0 0 4px #c9a050,inset 0 0 0 6px rgba(0,0,0,.6)}
.mat img{display:block;width:820px;height:540px;object-fit:cover;filter:saturate(.95) contrast(1.04);padding:6px}
.paint{position:absolute;inset:40px;box-shadow:inset 0 0 40px rgba(0,0,0,.45);pointer-events:none}
.label{position:absolute;left:142px;top:850px;width:470px;background:#F7F3EA;padding:28px 32px 26px;box-shadow:0 10px 24px rgba(0,0,0,.4),0 2px 4px rgba(0,0,0,.25);color:#1d1a16}
.label .n{font-family:Manrope;font-weight:700;font-size:15px;letter-spacing:.3em;color:#7d766a}
.label .t{font-family:Prata;font-size:44px;line-height:1.08;margin-top:10px;color:var(--ink)}
.label .d{font-family:Manrope;font-weight:600;font-size:16.5px;letter-spacing:.2em;margin-top:14px;color:#3a352d}
.label .med{font-family:News;font-style:italic;font-size:21px;color:#6d665b;margin-top:6px}
.side{position:absolute;left:660px;top:874px;width:300px;color:var(--hc)}
.side .q{font-family:News;font-style:italic;font-weight:400;font-size:33px;line-height:1.28}
.side .r{width:60px;height:1.5px;background:var(--hc);opacity:.6;margin:20px 0 14px}
.side .a{font-family:Manrope;font-weight:600;font-size:15px;letter-spacing:.3em;opacity:.8}
.rope{position:absolute;left:70px;right:70px;top:1150px;height:60px}
.rope svg{width:100%;height:100%}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="cv" style="--h:${s.hc};--s:${s.sc}"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="fade"></div><div class="bot"></div><div class="vig"></div>
      <div class="txt"><div class="kick">${s.kick}</div><div class="script">${s.h}</div><div class="hero">${s.h2}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
      <div class="foot"><span>5 FILMS</span><span>SWIPE →</span></div></div>`;
    } else {
      const ropeC = s.rope || '#8a1a22';
      body = `<div class="wall" style="--w:${s.wall}"></div><div class="beam"></div><div class="dado"></div><div class="skirt"></div><div class="floor"></div>
      <div class="head" style="--hc:${s.hc}"><span>GALLERY ${s.n}</span><span>Nº ${s.n} / 05</span></div>
      <div class="lamp"></div>
      <div class="frame"><div class="mat"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div><div class="paint"></div></div>
      <div class="label" style="--ink:${s.ink}"><div class="n">${s.room}</div><div class="t">${s.t}</div><div class="d">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="med">${s.med}</div></div>
      <div class="side" style="--hc:${s.hc}"><div class="q">${s.ov}</div><div class="r"></div><div class="a">${s.where}</div></div>
      <div class="rope"><svg viewBox="0 0 940 60" preserveAspectRatio="none">
        <rect x="0" y="6" width="14" height="54" rx="3" fill="#c9a050"/><circle cx="7" cy="6" r="9" fill="#e8c77a"/>
        <rect x="926" y="6" width="14" height="54" rx="3" fill="#c9a050"/><circle cx="933" cy="6" r="9" fill="#e8c77a"/>
        <path d="M10 12 Q470 70 930 12" stroke="${ropeC}" stroke-width="9" fill="none" stroke-linecap="round"/>
        <path d="M10 10 Q470 66 930 10" stroke="rgba(255,255,255,.18)" stroke-width="2" fill="none"/></svg></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
