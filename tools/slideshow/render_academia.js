// "dark academia" (ede.nnico) — cover: blackletter Grenze Gotisch 700 'dark' + IM Fell English SC spaced ACADEMIA
// over stormy sky (The Name of the Rose, monks on the mountain pass); inside: CATALOGUE CARD (bottle-green leather
// page with gilt tooled border, gold-framed still, tilted cream library index card w/ red rule + blue lines,
// Dewey call number in Plex Mono, IM Fell title in per-film ink, wax seal w/ roman numeral, punched hole).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
const css = [ff('Frak', 'grenze-gotisch', 700), ff('FellSC', 'im-fell-english-sc', 400), ff('Fell', 'im-fell-english', 400),
  ff('Fell', 'im-fell-english', 400, 'italic'), ff('Mono', 'ibm-plex-mono', 400), ff('Mono', 'ibm-plex-mono', 500)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#14201A}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.24;mix-blend-mode:overlay;pointer-events:none;z-index:30;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
/* cover */
.cbg{filter:saturate(.78) contrast(1.08) brightness(.9) sepia(.12)}
.ctint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(8,12,12,.62) 0%,rgba(8,12,12,.25) 38%,rgba(0,0,0,0) 55%,rgba(6,8,8,.35) 100%)}
.cvig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 50%,rgba(0,0,0,.45) 100%)}
.cv{position:absolute;left:0;right:0;top:${S.cover.top || 86}px;text-align:center;color:#EFE8D8;z-index:5}
.cv .k{font-family:FellSC;font-size:27px;letter-spacing:.55em;padding-left:.55em;opacity:.92}
.cv .h{font-family:Frak;font-weight:700;font-size:290px;line-height:.92;color:${S.cover.ink};margin-top:6px;text-shadow:0 8px 50px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.35)}
.cv .h2{font-family:FellSC;font-size:82px;letter-spacing:.34em;padding-left:.34em;margin-top:-6px;text-shadow:0 4px 30px rgba(0,0,0,.55)}
.cv .orn{display:flex;align-items:center;justify-content:center;gap:18px;margin-top:22px;color:${S.cover.acc}}
.cv .orn i{display:block;width:90px;height:1.5px;background:${S.cover.acc};opacity:.95}
.cv .orn b{font-family:Fell;font-size:30px;font-weight:400}
.cv .s{font-family:Fell;font-style:italic;font-size:40px;margin-top:16px;text-shadow:0 3px 20px rgba(0,0,0,.6)}
/* inside: catalogue card */
.leather{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,#24382D 0%,#16231C 55%,#0E1712 100%)}
.tool{position:absolute;inset:24px;border:1.5px solid rgba(201,168,92,.55);z-index:3;pointer-events:none}
.tool:after{content:'';position:absolute;inset:7px;border:1px solid rgba(201,168,92,.35)}
.hd{position:absolute;top:44px;left:66px;right:66px;display:flex;justify-content:space-between;align-items:baseline;font-family:FellSC;font-size:22px;letter-spacing:.38em;color:#C9A85C;z-index:5}
.hd .fr{font-family:FellSC;font-size:26px;letter-spacing:.2em;color:#D9BF7A}
.main{position:absolute;left:66px;top:106px;width:948px;height:600px;overflow:hidden;box-shadow:0 26px 60px rgba(0,0,0,.6);z-index:4}
.main .bg{object-position:var(--x) var(--y);filter:saturate(.85) contrast(1.05) sepia(.08)}
.gilt{position:absolute;left:56px;top:96px;width:968px;height:620px;border:1.5px solid #C9A85C;opacity:.75;z-index:3}
.card{position:absolute;left:96px;top:640px;width:888px;height:500px;background:#F2EBDA;z-index:6;transform:rotate(-1.3deg);
 box-shadow:0 22px 50px rgba(0,0,0,.55),0 2px 4px rgba(0,0,0,.3);
 background-image:linear-gradient(180deg,rgba(0,0,0,0) 0 108px,#C0463E 108px 110px,rgba(0,0,0,0) 110px),
  repeating-linear-gradient(180deg,rgba(0,0,0,0) 0 54px,rgba(92,128,170,.28) 54px 55.5px);
 background-position:0 0,0 110px;background-size:100% 100%,100% 100%}
.card:before{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.35),rgba(150,120,70,.12) 80%);pointer-events:none}
.cn{position:absolute;left:46px;top:36px;font-family:Mono;font-weight:500;font-size:24px;line-height:1.25;color:#3A352D}
.cn2{position:absolute;left:250px;top:44px;font-family:Mono;font-size:20px;color:#6B6152;letter-spacing:.06em}
.t{position:absolute;left:46px;bottom:calc(100% - 218px - .22em);right:150px;font-family:Fell;font-size:var(--fs,78px);line-height:1;color:var(--acc);white-space:nowrap}
.m{position:absolute;left:48px;top:248px;font-family:Mono;font-size:22px;color:#3E382F;letter-spacing:.02em}
.o{position:absolute;left:48px;top:288px;right:60px;font-family:Fell;font-style:italic;font-size:38px;line-height:1.43;color:#2B2721}
.hole{position:absolute;left:50%;bottom:26px;width:34px;height:34px;margin-left:-17px;border-radius:50%;background:#16231C;box-shadow:inset 0 3px 6px rgba(0,0,0,.7)}
.seal{position:absolute;right:40px;top:22px;width:104px;height:104px;border-radius:50%;background:radial-gradient(circle at 38% 32%,var(--acc2) 0%,var(--acc) 55%,var(--accd) 100%);
 box-shadow:0 6px 14px rgba(0,0,0,.35),inset 0 -4px 10px rgba(0,0,0,.35),inset 0 3px 6px rgba(255,255,255,.18);display:flex;align-items:center;justify-content:center}
.seal:before{content:'';position:absolute;inset:12px;border-radius:50%;border:1.5px solid rgba(0,0,0,.25);box-shadow:0 1px 0 rgba(255,255,255,.15)}
.seal b{font-family:FellSC;font-weight:400;font-size:40px;color:rgba(0,0,0,.42);text-shadow:0 1px 0 rgba(255,255,255,.25)}
.ft{position:absolute;bottom:62px;left:66px;right:66px;display:flex;justify-content:space-between;align-items:baseline;z-index:5}
.ft .a{font-family:Fell;font-style:italic;font-size:31px;color:#E6DCC4;opacity:.85}
.ft .b{font-family:FellSC;font-size:22px;letter-spacing:.38em;color:#C9A85C}
`;
const R = ['I', 'II', 'III', 'IV', 'V'];
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (body, out) => {
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}${grain}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 });
  };
  const c = S.cover;
  await shot(`<img class="bg cbg" src="file://${D}/${c.img}"><div class="ctint"></div><div class="cvig"></div>
   <div class="cv"><div class="k">${c.kick}</div><div class="h">${c.h}</div><div class="h2">${c.h2}</div>
   <div class="orn"><i></i><b>✠</b><i></i></div><div class="s">${c.sub}</div></div>`, '01_cover.jpg');
  if (process.argv[3] === 'cover') { await b.close(); return; }
  for (const [i, m] of S.movies.entries()) {
    await shot(`<div class="leather"></div><div class="tool"></div>
     <div class="hd"><span>${S.hd}</span><span class="fr">${R[i]}</span></div>
     <div class="gilt"></div><div class="main" style="--x:${m.x}%;--y:${m.y || 50}%"><img class="bg" src="file://${D}/${m.img}" style="${m.f ? `filter:${m.f}` : ``}"></div>
     <div class="card" style="--acc:${m.acc};--acc2:${m.acc2};--accd:${m.accd};--fs:${m.fs || 78}px">
      <div class="cn">${m.cn}</div><div class="cn2">${m.cn2}</div>
      <div class="seal"><b>${R[i]}</b></div>
      <div class="t">${m.t}</div><div class="m">${m.meta}</div><div class="o">${m.ov}</div><div class="hole"></div></div>
     <div class="ft"><span class="a">${S.ft}</span><span class="b">${String(i + 1).padStart(2, '0')} / 05</span></div>`, `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
