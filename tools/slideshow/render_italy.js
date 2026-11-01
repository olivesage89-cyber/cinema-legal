// "running away to italy" — cover: Much Ado hillside under extended Tuscan sky, cobalt Parisienne + Gilda caps.
// Inside: MAJOLICA TICKET — majolica-tile border per film, cream carta page, framed still, Gilda title,
// tilted white-bordered snapshot, one-way Italian train ticket (sola andata) to the film's town.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Paris', 'parisienne', 400), ff('Gilda', 'gilda-display', 400),
  ff('Ral', 'raleway', 500), ff('Ral', 'raleway', 600), ff('Ral', 'raleway', 700),
  ff('Crim', 'crimson-pro', 400, 'italic'), ff('Crim', 'crimson-pro', 500, 'italic'), ff('Crim', 'crimson-pro', 600, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#BFDDE8}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}
/* cover */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#8FBFD8 0%,#A9D2E4 18%,#C3E3EE 34%,#CDE9F1 50%)}
.cimg{position:absolute;left:0;top:var(--top);width:1080px;height:1350px;object-fit:cover;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 22%);filter:saturate(1.05) contrast(1.02) sepia(.10)}
.warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,236,200,0) 40%,rgba(255,200,120,.16));mix-blend-mode:soft-light}
.ct{position:absolute;left:0;right:0;top:76px;text-align:center;color:#1F3C8C}
.ct .kick{font-family:Ral;font-weight:700;font-size:23px;letter-spacing:.5em;padding-left:.5em;color:#1F3C8C}
.ct .scr{font-family:Paris;font-size:118px;line-height:1;margin-top:28px;color:#1F3C8C;transform:rotate(-4deg)}
.ct .big{font-family:Gilda;font-size:212px;letter-spacing:.2em;padding-left:.2em;line-height:.9;margin-top:-6px;color:#1F3C8C}
.ct .rule{display:flex;align-items:center;justify-content:center;gap:16px;margin:16px auto 0}
.ct .rule i{display:block;width:120px;height:1.5px;background:#9A3A1C}
.ct .rule b{display:block;width:10px;height:10px;background:#9A3A1C;transform:rotate(45deg)}
.ct .sub{font-family:Crim;font-style:italic;font-weight:500;font-size:40px;margin-top:14px;color:#1F3C8C}
/* inside */
.tile{position:absolute;inset:0;background-color:var(--c);background-image:var(--pat);background-size:96px 96px}
.tilesh{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.25))}
.page{position:absolute;left:46px;top:46px;right:46px;bottom:46px;background:#F6EEDC;box-shadow:0 10px 40px rgba(0,0,0,.35), inset 0 0 0 1px rgba(0,0,0,.06), inset 0 0 120px rgba(160,120,60,.16)}
.page:after{content:'';position:absolute;inset:14px;border:1.5px solid var(--ink);opacity:.55;pointer-events:none}
.hd{position:absolute;left:62px;right:62px;top:44px;display:flex;justify-content:space-between;align-items:baseline;color:var(--ink)}
.hd .s{font-family:Paris;font-size:46px}
.hd .n{font-family:Ral;font-weight:700;font-size:20px;letter-spacing:.34em}
.main{position:absolute;left:62px;top:122px;width:864px;height:560px;object-fit:cover;border:9px solid #fff;box-shadow:0 8px 26px rgba(60,40,10,.3);filter:saturate(.95) contrast(1.02) sepia(.06)}
.tt{position:absolute;left:66px;top:722px;width:520px;color:var(--ink)}
.tt .t{font-family:Gilda;font-size:var(--fs,74px);line-height:1.02}
.tt .m{font-family:Ral;font-weight:700;font-size:19px;letter-spacing:.3em;margin-top:18px;opacity:.9}
.tt .l{font-family:Crim;font-style:italic;font-weight:500;font-size:34px;line-height:1.22;margin-top:16px;color:#3A2E22}
.snap{position:absolute;left:620px;top:716px;width:318px;height:246px;background:#fff;padding:12px 12px 40px;transform:rotate(4deg);box-shadow:0 8px 22px rgba(60,40,10,.32)}
.snap img{width:100%;height:100%;object-fit:cover;filter:saturate(.9) sepia(.1)}
.snap .cap{position:absolute;left:0;right:0;bottom:6px;text-align:center;font-family:Paris;font-size:25px;color:var(--ink)}
.tick{position:absolute;left:96px;top:1040px;width:800px;height:176px;background:var(--tk);transform:rotate(-1.6deg);box-shadow:0 6px 18px rgba(60,40,10,.25);display:flex;color:#2B2620;
  -webkit-mask:radial-gradient(circle 9px at 0 50%,transparent 98%,#000) left/100% 100%}
.tick:before{content:'';position:absolute;inset:0;background-image:repeating-linear-gradient(135deg,rgba(255,255,255,.18) 0 2px,transparent 2px 9px);pointer-events:none}
.tick .a{flex:1;padding:18px 26px 0 34px;position:relative}
.tick .a .k{font-family:Ral;font-weight:700;font-size:16px;letter-spacing:.32em;color:var(--ink)}
.tick .a .k span{opacity:.7;font-weight:600}
.tick .a .row{display:flex;gap:22px;margin-top:12px;font-family:Ral;font-weight:600;font-size:15px;letter-spacing:.2em;opacity:.75}
.tick .a .to{font-family:Gilda;font-size:50px;line-height:1;margin-top:4px;color:var(--ink);letter-spacing:.06em}
.tick .a .fr{font-family:Crim;font-style:italic;font-size:22px;margin-top:4px;opacity:.85}
.tick .b{width:200px;border-left:2.5px dashed rgba(43,38,32,.45);padding:18px 0 0 22px;position:relative}
.tick .b .k{font-family:Ral;font-weight:700;font-size:14px;letter-spacing:.3em;opacity:.7}
.tick .b .v{font-family:Gilda;font-size:46px;line-height:1.05;color:var(--ink)}
.tick .b .bc{position:absolute;left:22px;bottom:18px;width:150px;height:30px;background:repeating-linear-gradient(90deg,#2B2620 0 2px,transparent 2px 4px,#2B2620 4px 7px,transparent 7px 9px,#2B2620 9px 10px,transparent 10px 14px);opacity:.7}
.stamp{position:absolute;left:520px;top:1080px;width:160px;height:160px;border-radius:50%;border:3px solid var(--st);color:var(--st);transform:rotate(-14deg);opacity:.8;display:flex;flex-direction:column;align-items:center;justify-content:center;font-family:Ral;font-weight:700;font-size:13px;letter-spacing:.22em;text-align:center;mix-blend-mode:multiply}
.stamp:before{content:'';position:absolute;inset:6px;border-radius:50%;border:1.5px solid var(--st)}
.stamp b{font-family:Gilda;font-weight:400;font-size:24px;letter-spacing:.02em;margin:2px 0}
`;
// majolica tile pattern (SVG), parameterised by colours
const pat = (fg, acc) => `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><rect width='120' height='120' fill='#F3EAD3'/><g fill='${fg}'><path d='M60 8c10 18 10 34 0 52C50 42 50 26 60 8z'/><path d='M60 112c-10-18-10-34 0-52 10 18 10 34 0 52z'/><path d='M8 60c18-10 34-10 52 0-18 10-34 10-52 0z'/><path d='M112 60c-18 10-34 10-52 0 18-10 34-10 52 0z'/><path d='M0 0h22C18 10 10 18 0 22zM120 0H98c4 10 12 18 22 22zM0 120h22c-4-10-12-18-22-22zM120 120H98c4-10 12-18 22-22z'/></g><circle cx='60' cy='60' r='9' fill='${acc}'/><circle cx='60' cy='60' r='3.5' fill='#F3EAD3'/><g fill='${acc}'><circle cx='34' cy='34' r='4'/><circle cx='86' cy='34' r='4'/><circle cx='34' cy='86' r='4'/><circle cx='86' cy='86' r='4'/></g><rect width='120' height='120' fill='none' stroke='${fg}' stroke-opacity='.35' stroke-width='2'/></svg>`).replace(/'/g,'%27')}")`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="sky"></div><img class="cimg" style="--top:${s.top}px;object-position:${s.x}% 50%" src="file://${D}/${s.img}"><div class="warm"></div>
      <div class="ct"><div class="kick">${s.kick}</div><div class="scr">${s.h}</div><div class="big">${s.h2}</div><div class="rule"><i></i><b></b><i></i></div><div class="sub">${s.sub}</div></div>`;
    } else {
      body = `<div class="tile" style='--c:${s.c};--pat:${pat(s.c, s.acc)}'></div><div class="tilesh"></div>
      <div class="page" style="--ink:${s.ink}">
        <div class="hd"><div class="s">running away to italy</div><div class="n">Nº ${s.n} / 05</div></div>
        <img class="main" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%">
        <div class="tt" style="--fs:${s.fs || 74}px"><div class="t">${s.t}</div><div class="m">${s.dir.toUpperCase()} · ${s.yr}</div><div class="l">${s.ov}</div></div>
        <div class="snap"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"><div class="cap">${s.cap}</div></div>
        <div class="tick" style="--tk:${s.tk}"><div class="a"><div class="k">BIGLIETTO · SOLA ANDATA <span>/ ONE WAY</span></div>
          <div class="row"><span>DA: NOVEMBRE GRIGIO</span><span>→</span></div><div class="to">${s.to}</div><div class="fr">${s.fr}</div></div>
          <div class="b"><div class="k">CARROZZA</div><div class="v">${s.n}</div><div class="k" style="margin-top:4px">ANNO ${s.yr}</div><div class="bc"></div></div></div>
        <div class="stamp" style="--st:${s.st}">CONVALIDA<b>${s.stamp}</b>NOV · 2026</div>
      </div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
