// "the last harvest" — cover: sun-haze full-bleed w/ deep navy Playfair italic + red Homemade Apple; inside: SEED PACKET.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const paper = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.035' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")`;
const css = [
  ff('PF', 'playfair-display', 900, 'italic'), ff('PF', 'playfair-display', 800, 'italic'), ff('PF', 'playfair-display', 700),
  ff('HA', 'homemade-apple', 400), ff('MR', 'manrope', 600), ff('MR', 'manrope', 700), ff('MR', 'manrope', 800),
  ff('LC', 'libre-caslon-text', 400, 'italic'), ff('LC', 'libre-caslon-text', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#E9DDC2}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv .blur{position:absolute;inset:-60px;width:1200px;height:1470px;object-fit:cover;filter:blur(34px) saturate(.8) brightness(1.12)}
.cv .sharp{position:absolute;left:0;width:1080px;object-fit:cover;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 260px);
  filter:saturate(.86) contrast(.95) sepia(.12) brightness(1.02)}
.cv .haze{position:absolute;inset:0;background:linear-gradient(180deg,rgba(252,238,205,.9) 0,rgba(250,232,190,.72) 330px,rgba(248,226,178,.22) 600px,rgba(248,226,178,0) 760px)}
.cv .sun{position:absolute;left:-200px;top:-260px;width:900px;height:900px;background:radial-gradient(circle,rgba(255,236,190,.55),rgba(255,236,190,0) 65%);mix-blend-mode:screen}
.cv .vig{position:absolute;inset:0;background:linear-gradient(0deg,rgba(40,24,8,.55) 0,rgba(40,24,8,0) 260px)}
.cv .t{position:absolute;top:70px;left:0;right:0;text-align:center;color:#1D2F5C}
.cv .kick{font-family:MR;font-weight:800;font-size:23px;letter-spacing:.5em;padding-left:.5em}
.cv .the{font-family:HA;font-size:56px;color:#B8352B;transform:rotate(-7deg);position:absolute;left:118px;top:62px}
.cv .big{font-family:PF;font-weight:900;font-style:italic;font-size:262px;line-height:1;letter-spacing:-.025em;margin-top:84px}
.cv .sub{font-family:LC;font-style:italic;font-size:35px;margin-top:6px;color:#2A3A62}
.cv .sub b{font-weight:400;color:#B8352B}
.cv .foot{position:absolute;bottom:54px;left:0;right:0;text-align:center;font-family:MR;font-weight:700;font-size:21px;letter-spacing:.46em;color:#FBF1DC;text-shadow:0 1px 10px rgba(0,0,0,.4)}
/* seed packet */
.mv{position:absolute;inset:0;background:var(--bg)}
.mv:before{content:'';position:absolute;inset:0;background-image:${paper};opacity:.22;mix-blend-mode:multiply}
.hdr{position:absolute;top:50px;left:0;right:0;text-align:center;font-family:MR;font-weight:800;font-size:19px;letter-spacing:.45em;color:var(--fg);opacity:.9}
.hdr i{font-family:HA;font-style:normal;letter-spacing:0;font-size:30px;margin-left:10px;position:relative;top:4px}
.packet{position:absolute;left:120px;top:118px;width:840px;height:1130px;background:#F6EEDB;border-radius:6px;transform:rotate(-1.6deg);
  box-shadow:0 30px 60px rgba(30,18,6,.35),0 6px 14px rgba(30,18,6,.2);overflow:hidden}
.packet:before{content:'';position:absolute;inset:0;background-image:${paper};opacity:.16;mix-blend-mode:multiply}
.flap{position:absolute;left:0;right:0;top:0;height:78px;background:var(--ink);opacity:.95;
  clip-path:polygon(0 0,100% 0,100% 70%,95% 100%,90% 70%,85% 100%,80% 70%,75% 100%,70% 70%,65% 100%,60% 70%,55% 100%,50% 70%,45% 100%,40% 70%,35% 100%,30% 70%,25% 100%,20% 70%,15% 100%,10% 70%,5% 100%,0 70%)}
.flap span{position:absolute;top:22px;left:0;right:0;text-align:center;font-family:MR;font-weight:800;font-size:18px;letter-spacing:.5em;color:#F6EEDB}
.frame{position:absolute;left:44px;right:44px;top:110px;height:470px;border:2.5px solid var(--ink);padding:10px;border-radius:4px}
.frame img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.9) contrast(.96) sepia(.1)}
.badge{position:absolute;top:84px;right:22px;width:128px;height:128px;border-radius:50%;background:var(--ink);color:#F6EEDB;display:flex;flex-direction:column;
  align-items:center;justify-content:center;transform:rotate(9deg);box-shadow:0 4px 10px rgba(0,0,0,.25);border:3px dashed rgba(246,238,219,.6);outline:5px solid var(--ink)}
.badge .n{font-family:PF;font-weight:900;font-style:italic;font-size:54px;line-height:1}
.badge .l{font-family:MR;font-weight:800;font-size:12px;letter-spacing:.3em;margin-top:2px;padding-left:.3em}
.var{position:absolute;top:608px;left:0;right:0;text-align:center;font-family:MR;font-weight:800;font-size:16px;letter-spacing:.5em;color:var(--ink);opacity:.85}
.title{position:absolute;top:638px;left:40px;right:40px;text-align:center;font-family:PF;font-weight:900;font-style:italic;color:var(--ink);line-height:.98;letter-spacing:-.01em}
.dir{position:absolute;left:0;right:0;text-align:center;font-family:MR;font-weight:700;font-size:20px;letter-spacing:.32em;color:#3B2E22}
.rule{position:absolute;left:150px;right:150px;height:0;border-top:2px dotted var(--ink);opacity:.6}
.line{position:absolute;left:70px;right:70px;text-align:center;font-family:LC;font-style:italic;font-size:33px;line-height:1.32;color:#2E241A}
.grid{position:absolute;left:44px;right:44px;bottom:38px;height:96px;display:flex;border-top:2px solid var(--ink)}
.grid div{flex:1;padding:14px 16px 0;border-right:2px solid var(--ink)}
.grid div:last-child{border-right:0}
.grid b{display:block;font-family:MR;font-weight:800;font-size:13px;letter-spacing:.32em;color:var(--ink)}
.grid span{display:block;font-family:HA;font-size:21px;color:#2E241A;margin-top:12px;white-space:nowrap}
.seeds{position:absolute;bottom:40px;left:0;right:0;text-align:center;font-family:MR;font-weight:800;font-size:18px;letter-spacing:.4em;color:var(--fg)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    if (s.type === 'end') continue;
    let body;
    if (s.type === 'cover') body = `<div class="cv"><img class="blur" src="file://${D}/${s.img}"><img class="sharp" src="file://${D}/${s.img}" style="top:${s.top}px;height:${s.h}px;object-position:${s.x}% 0"><div class="sun"></div><div class="haze"></div><div class="vig"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="the">the last</div><div class="big">harvest</div><div class="sub">${s.sub}</div></div>
      <div class="foot">05 FILMS &nbsp;·&nbsp; SWIPE →</div></div>`;
    else {
      const ty = 638, tl = s.fs * .98 * (s.t.split('<br>').length);
      const dirY = ty + tl + 18, ruleY = dirY + 50, lineY = ruleY + 26;
      body = `<div class="mv" style="--bg:${s.bg};--ink:${s.ink};--fg:${s.fg}">
      <div class="hdr">THE LAST HARVEST<i>no. ${s.n} of 05</i></div>
      <div class="packet"><div class="flap"><span>HEIRLOOM FILMS · SOW IN NOVEMBER</span></div>
        <div class="frame"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div>
        <div class="var">VARIETY · ${s.variety}</div>
        <div class="title" style="font-size:${s.fs}px">${s.t}</div>
        <div class="dir" style="top:${dirY}px">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div>
        <div class="rule" style="top:${ruleY}px"></div>
        <div class="line" style="top:${lineY}px">${s.ov}</div>
        <div class="grid"><div><b>BEST WITH</b><span>${s.w}</span></div><div><b>YIELDS</b><span>${s.yd}</span></div></div>
      </div>
      <div class="badge"><div class="n">${s.n}</div><div class="l">OF FIVE</div></div></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
