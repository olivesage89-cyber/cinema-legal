// "movies for missing someone" — cover: What Dreams May Come wisteria tree under storm sky, masked into dark sky band;
// inside: KEEPSAKE SHRINE (per-film deep page, candle glow, gilt arched frame still, round locket w/ 2nd still).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Cor', 'corinthia', 400), ff('Cor', 'corinthia', 700), ff('Cinzel', 'cinzel', 500), ff('Cinzel', 'cinzel', 600),
  ff('Tenor', 'tenor-sans', 400), ff('Lora', 'lora', 400, 'italic'), ff('Lora', 'lora', 500, 'italic'),
  ff('Fr', 'fraunces', 400, 'italic'), ff('Fr', 'fraunces', 500, 'italic'), ff('Fr', 'fraunces', 300, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%)}
/* cover */
.cv{background:#17131F}
.cv .img{position:absolute;left:0;right:0;bottom:0;height:1080px;overflow:hidden;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 30%,#000 100%)}
.cv .img img{width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.04) brightness(.96)}
.cv .tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(40,28,70,.25),rgba(255,190,130,.06) 60%,rgba(20,14,24,.35));mix-blend-mode:soft-light}
.cv .sky{position:absolute;left:0;right:0;top:0;height:560px;background:radial-gradient(ellipse at 50% 30%,rgba(120,100,170,.22),rgba(0,0,0,0) 60%)}
.cv .shade{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,rgba(10,8,14,0),rgba(10,8,14,.55))}
.cv .t{position:absolute;left:0;right:0;top:92px;text-align:center}
.cv .kick{font-family:Tenor;font-size:23px;letter-spacing:.62em;color:#E9E1F7;opacity:.9;padding-left:.62em}
.cv .h{font-family:Cor;font-weight:700;font-size:268px;line-height:.78;color:#C9B8FF;margin-top:34px;
  text-shadow:0 0 38px rgba(170,150,255,.38),0 4px 30px rgba(0,0,0,.35)}
.cv .h2{font-family:Cinzel;font-weight:500;font-size:64px;letter-spacing:.34em;padding-left:.34em;color:#F3EEE6;margin-top:6px;text-shadow:0 2px 24px rgba(0,0,0,.45)}
.cv .rule{width:150px;height:1px;background:rgba(233,225,247,.55);margin:26px auto 0}
.cv .sub{display:inline-block;padding:4px 18px;background:radial-gradient(ellipse at 50% 50%,rgba(14,10,22,.38),rgba(14,10,22,0) 72%);font-family:Lora;font-style:italic;font-weight:400;font-size:34px;color:#EDE6F5;margin-top:20px;text-shadow:0 2px 18px rgba(0,0,0,.5)}
.cv .swipe{position:absolute;bottom:52px;width:100%;text-align:center;font-family:Tenor;font-size:19px;letter-spacing:.5em;color:#EDE6F5;opacity:.85;padding-left:.5em}
/* inside */
.mv .glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 45% at 50% 42%,var(--glow),rgba(0,0,0,0) 70%)}
.mv .hdr{position:absolute;top:58px;left:0;right:0;text-align:center;font-family:Tenor;font-size:19px;letter-spacing:.5em;color:var(--acc);padding-left:.5em}
.mv .hdr b{font-weight:400;color:#EFE8DC;opacity:.75}
.mv .frame{position:absolute;left:160px;top:128px;width:760px;height:740px;border-radius:380px 380px 6px 6px;overflow:hidden;
  box-shadow:0 30px 80px rgba(0,0,0,.55)}
.mv .frame img{width:100%;height:100%;object-fit:cover;filter:saturate(.95) contrast(1.03)}
.mv .frame:after{content:'';position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 0 0 1px rgba(255,240,210,.25),inset 0 0 70px rgba(0,0,0,.35)}
.mv .gilt{position:absolute;left:144px;top:112px;width:792px;height:772px;border-radius:396px 396px 12px 12px;border:2px solid var(--gold);opacity:.8}
.mv .gilt2{position:absolute;left:134px;top:102px;width:812px;height:792px;border-radius:406px 406px 16px 16px;border:1px solid var(--gold);opacity:.35}
.mv .locket{position:absolute;left:770px;top:150px;width:236px;height:236px;border-radius:50%;overflow:hidden;
  border:7px solid var(--gold);box-shadow:0 0 0 2px rgba(0,0,0,.35),0 0 0 11px rgba(0,0,0,0),0 18px 40px rgba(0,0,0,.55)}
.mv .locket img{width:100%;height:100%;object-fit:cover}
.mv .ring{position:absolute;left:758px;top:138px;width:260px;height:260px;border-radius:50%;border:1px solid var(--gold);opacity:.6}
.mv .chain{position:absolute;left:887px;top:60px;width:2px;height:80px;background:repeating-linear-gradient(180deg,var(--gold) 0 5px,transparent 5px 8px);opacity:.7}
.mv .miss{position:absolute;left:160px;top:900px;display:flex;align-items:baseline;gap:22px}
.mv .miss .k{font-family:Tenor;font-size:18px;letter-spacing:.42em;color:#EFE8DC;opacity:.7}
.mv .miss .s{font-family:Cor;font-weight:700;font-size:92px;line-height:.8;color:var(--acc);text-shadow:0 0 26px var(--glow)}
.mv .title{position:absolute;left:156px;right:120px;top:990px;font-family:Fr;font-style:italic;font-weight:400;font-size:78px;line-height:1;color:#F5EFE6;letter-spacing:-.01em;white-space:nowrap;height:84px;display:flex;align-items:flex-end}
.mv .meta{position:absolute;left:162px;top:1092px;font-family:Tenor;font-size:20px;letter-spacing:.34em;color:var(--acc)}
.mv .line{position:absolute;left:160px;right:150px;top:1146px;font-family:Lora;font-style:italic;font-size:33px;line-height:1.36;color:#EFE8DC;opacity:.9;text-wrap:balance}
.mv .rule{position:absolute;left:162px;top:1132px;width:60px;height:1px;background:var(--acc);opacity:.0}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') body = `<body class="cv"><div class="img"><img src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"></div><div class="tint"></div><div class="sky"></div><div class="shade"></div><div class="vig"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="h">${s.h}</div><div class="h2">${s.h2}</div><div class="rule"></div><div class="sub">${s.sub}</div></div>
      <div class="swipe">FIVE FILMS &nbsp;→</div><div class="grain"></div></body>`;
    else body = `<body class="mv" style="background:${s.bg};--acc:${s.acc};--glow:${s.glow};--gold:${s.gold || '#D9B97A'}"><div class="glow"></div>
      <div class="hdr">FOR THE ONES WE MISS &nbsp;<b>·</b>&nbsp; Nº ${s.n} / 05</div>
      <div class="gilt2"></div><div class="gilt"></div>
      <div class="frame"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div>
      <div class="ring"></div><div class="locket"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div>
      <div class="miss"><span class="k">MISSING</span><span class="s">${s.who}</span></div>
      <div class="title">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir.toUpperCase()}</div>
      <div class="line">${s.ov}</div><div class="vig"></div><div class="grain"></div></body>`;
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head>${body}</html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.evaluate(() => { const t = document.querySelector('.mv .title'); if (t) { let f = 78; while (t.scrollWidth > 800 && f > 50) { f -= 2; t.style.fontSize = f + 'px'; } } }); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
