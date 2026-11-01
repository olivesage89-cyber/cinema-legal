// "somewhere cold" — cover: Brother Bear aurora over the mountain, image masked up into extended starry night-blue sky;
// Outfit spaced kicker + aurora-green Ms Madi 'somewhere' over giant ice-white Marcellus COLD + Literata italic sub.
// Inside: POLAR FIELD LOG — per-film deep page w/ faint topographic contours + falling snow, frost-edged big still,
// coordinates in JetBrains Mono, Marcellus title in per-film accent, Outfit caps dir·year, Literata italic line,
// white field-log card (LOW temp, CONDITIONS, PACK), tilted frosted print w/ Ms Madi caption.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
// deterministic pseudo-random
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const stars = (n, h) => { seed = 11; let s = ''; for (let i = 0; i < n; i++) { const r = rnd() * 1.6 + .4; s += `<circle cx='${(rnd() * 1080).toFixed(0)}' cy='${(rnd() * h).toFixed(0)}' r='${r.toFixed(1)}' fill='white' opacity='${(rnd() * .6 + .2).toFixed(2)}'/>`; } return s; };
const snow = (n) => { seed = 29; let s = ''; for (let i = 0; i < n; i++) { const r = rnd() * 2.6 + .6; s += `<circle cx='${(rnd() * 1080).toFixed(0)}' cy='${(rnd() * 1350).toFixed(0)}' r='${r.toFixed(1)}' fill='white' opacity='${(rnd() * .35 + .1).toFixed(2)}'/>`; } return s; };
const topo = (col) => { seed = 3; let s = ''; for (let k = 0; k < 3; k++) { const cx = 150 + rnd() * 800, cy = 150 + rnd() * 1050; for (let i = 1; i < 9; i++) { const rx = i * 46 + rnd() * 10, ry = i * 32 + rnd() * 8; s += `<ellipse cx='${cx.toFixed(0)}' cy='${cy.toFixed(0)}' rx='${rx.toFixed(0)}' ry='${ry.toFixed(0)}' transform='rotate(${(rnd() * 40 - 20).toFixed(0)} ${cx.toFixed(0)} ${cy.toFixed(0)})' fill='none' stroke='${col}' stroke-width='1.3'/>`; } } return s; };
const svg = (inner, h = 1350) => `<svg xmlns='http://www.w3.org/2000/svg' width='1080' height='${h}' style='position:absolute;left:0;top:0'>${inner}</svg>`;
const css = [
  ff('Madi', 'ms-madi', 400), ff('Marc', 'marcellus', 400),
  ff('Out', 'outfit', 400), ff('Out', 'outfit', 500), ff('Out', 'outfit', 600),
  ff('Lit', 'literata', 400, 'italic'), ff('Lit', 'literata', 500, 'italic'),
  ff('Mono', 'jetbrains-mono', 400), ff('Mono', 'jetbrains-mono', 500),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#04163F}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.17;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}
/* cover */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#020A24 0%,#03123A 20%,#052466 38%,#062C78 52%)}
.cimg{position:absolute;left:var(--left);top:var(--top);width:var(--w);height:auto;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 18%);filter:saturate(1.08) contrast(1.04)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 55%,rgba(0,4,20,.55));}
.ct{position:absolute;left:0;right:0;top:88px;text-align:center}
.ct .kick{font-family:Out;font-weight:500;font-size:22px;letter-spacing:.52em;padding-left:.52em;color:#DCE8FF;opacity:.92}
.ct .scr{font-family:Madi;font-size:150px;line-height:1;color:#7CF5B0;margin-top:26px;position:relative;z-index:2;
  text-shadow:0 0 28px rgba(124,245,176,.55),0 0 70px rgba(124,245,176,.25);transform:rotate(-5deg) translateX(-120px)}
.ct .big{font-family:Marc;font-size:250px;letter-spacing:.24em;padding-left:.24em;line-height:.86;margin-top:-58px;color:#EEF5FF;
  text-shadow:0 4px 40px rgba(0,10,40,.6)}
.ct .sub{font-family:Lit;font-style:italic;font-weight:400;font-size:36px;margin-top:22px;color:#DCE8FF}
.ct .sub b{font-weight:500;color:#7CF5B0}
.ct .line{width:80px;height:1.5px;background:#7CF5B0;margin:22px auto 0;opacity:.8}
.swipe{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:Mono;font-size:19px;letter-spacing:.3em;color:#EEF5FF;opacity:.85}
/* inside */
.bg{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 20%,var(--c2) 0%,var(--c) 70%)}
.hd{position:absolute;left:60px;right:60px;top:52px;display:flex;justify-content:space-between;align-items:center;color:#E9F1FF}
.hd .k{font-family:Out;font-weight:600;font-size:18px;letter-spacing:.42em}
.hd .s{font-family:Madi;font-size:46px;color:var(--a);line-height:.6;margin-left:14px}
.hd .n{font-family:Mono;font-weight:500;font-size:19px;letter-spacing:.2em;opacity:.85}
.coord{position:absolute;left:60px;top:112px;font-family:Mono;font-size:17px;letter-spacing:.18em;color:#E9F1FF;opacity:.7}
.mainw{position:absolute;left:60px;top:150px;width:960px;height:650px;box-shadow:0 18px 50px rgba(0,0,0,.45)}
.mainw img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.98) contrast(1.03)}
.mainw:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 70px rgba(225,240,255,.38), inset 0 0 0 1.5px rgba(255,255,255,.55)}
.mainw .fr{position:absolute;inset:-14px;border:1px solid rgba(233,241,255,.35)}
.tt{position:absolute;left:60px;top:842px;width:590px;color:#E9F1FF}
.tt .t{font-family:Marc;font-size:var(--fs,76px);line-height:1.02;color:var(--a);letter-spacing:.01em}
.tt .m{font-family:Out;font-weight:500;font-size:19px;letter-spacing:.32em;margin-top:18px;opacity:.85}
.tt .l{font-family:Lit;font-style:italic;font-size:31px;line-height:1.3;margin-top:20px;color:#E9F1FF;opacity:.95}
.card{position:absolute;left:690px;top:948px;width:330px;background:#F4F8FC;color:#1A2638;padding:22px 26px 22px;box-shadow:0 12px 34px rgba(0,0,0,.4)}
.card:before{content:'';position:absolute;left:0;right:0;top:0;height:8px;background:var(--a)}
.card .k{font-family:Out;font-weight:600;font-size:14px;letter-spacing:.32em;opacity:.65}
.card .tmp{font-family:Marc;font-size:78px;line-height:1;margin:6px 0 10px;color:#14213A}
.card .tmp span{font-size:36px;vertical-align:top;margin-left:4px}
.card .r{border-top:1px solid rgba(26,38,56,.22);padding-top:10px;margin-top:10px}
.card .v{font-family:Lit;font-style:italic;font-size:22px;line-height:1.25;margin-top:4px}
.print{position:absolute;left:744px;top:690px;width:290px;height:196px;background:#fff;padding:10px 10px 0;transform:rotate(4deg);box-shadow:0 10px 26px rgba(0,0,0,.45);z-index:3}
.print img{width:100%;height:150px;object-fit:cover;display:block;filter:saturate(.9) brightness(1.03)}
.print .cap{font-family:Madi;font-size:32px;color:#1A2638;text-align:center;line-height:1.1;margin-top:2px}
.foot{position:absolute;left:60px;bottom:52px;font-family:Mono;font-size:16px;letter-spacing:.24em;color:#E9F1FF;opacity:.6}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="sky"></div>${svg(stars(140, 520), 520)}<img class="cimg" style="--top:${s.top}px;--left:${s.left}px;--w:${s.w}px" src="file://${D}/${s.img}"><div class="vig"></div>
      <div class="ct"><div class="kick">${s.kick}</div><div class="scr">${s.h}</div><div class="big">${s.h2}</div><div class="sub">${s.sub}</div><div class="line"></div></div>
      <div class="swipe">${s.swipe}</div>`;
    } else {
      body = `<div class="bg" style="--c:${s.c};--c2:${s.c2}"></div>${svg(topo('rgba(220,235,255,.07)'))}${svg(snow(170))}
      <div style="--a:${s.a}">
        <div class="hd"><div style="display:flex;align-items:center"><span class="k">FIELD NOTES FROM</span><span class="s">somewhere cold</span></div><div class="n">Nº ${s.n} / 05</div></div>
        <div class="coord">${s.coord}</div>
        <div class="mainw"><div class="fr"></div><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
        <div class="tt" style="--fs:${s.fs || 76}px"><div class="t">${s.t}</div><div class="m">${s.dir.toUpperCase()} · ${s.yr}</div><div class="l">${s.ov}</div></div>
        <div class="card"><div class="k">LOWEST RECORDED</div><div class="tmp">${s.low}<span>°C</span></div>
          <div class="r"><div class="k">CONDITIONS</div><div class="v">${s.cond}</div></div>
          <div class="r"><div class="k">PACK</div><div class="v">${s.pack}</div></div></div>
        <div class="print"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"><div class="cap">${s.cap}</div></div>
        <div class="foot">${s.foot}</div>
      </div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
