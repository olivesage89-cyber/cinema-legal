// "slow life in japan" — cover: misty beach full-bleed, sakura-pink Shippori Mincho on dark sand, vermilion hanko.
// Inside: WASHI — warm washi paper, big framed still, white-bordered portrait inset, vertical JP title, hanko seal.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = 'file://' + path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const links = ['shippori-mincho/500.css', 'shippori-mincho/700.css', 'shippori-mincho/800.css',
  'zen-kaku-gothic-new/500.css', 'zen-kaku-gothic-new/700.css', 'fraunces/400-italic.css', 'fraunces/300-italic.css']
  .map(h => `<link rel="stylesheet" href="${F}${h}">`).join('');
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const grain = `<div class="grain"></div>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.seal{display:flex;align-items:center;justify-content:center;background:#C2362B;color:#F6EDE4;font-family:'Shippori Mincho';font-weight:800;border-radius:6px;
 box-shadow:inset 0 0 0 3px rgba(246,237,228,.0);filter:url(#rough)}`;
const svgdef = `<svg width="0" height="0" style="position:absolute"><filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".08" numOctaves="2" result="t"/><feDisplacementMap in="SourceGraphic" in2="t" scale="3"/></filter></svg>`;

function cover(s) {
  return `<style>${base}
body{background:#252A36}
.ph{position:absolute;left:0;top:0;width:1080px;height:1350px;overflow:hidden}
.ph img{position:absolute;height:1350px;left:${s.left}px;top:${s.top || 0}px;filter:saturate(.9) contrast(.95) brightness(1.0)}
.fade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(37,42,54,0) 50%,rgba(37,42,54,.5) 64%,rgba(37,42,54,.88) 76%,#252A36 86%,#252A36 100%)}
.tint{position:absolute;inset:0;background:linear-gradient(180deg,rgba(150,170,200,.10),rgba(230,180,190,.06));mix-blend-mode:soft-light}
.txt{position:absolute;left:0;right:0;top:${s.ty}px;text-align:center;color:#F7F1EA}
.kick{font-family:'Zen Kaku Gothic New';font-weight:500;font-size:25px;letter-spacing:.5em;padding-left:.5em;opacity:.92}
.h{font-family:'Shippori Mincho';font-weight:800;font-size:158px;line-height:1;color:${s.ink};letter-spacing:-.01em;margin-top:22px;text-shadow:0 4px 30px rgba(0,0,0,.25)}
.h2{font-family:'Shippori Mincho';font-weight:500;font-size:48px;letter-spacing:.42em;padding-left:.42em;margin-top:18px}
.rule{display:flex;align-items:center;justify-content:center;gap:22px;margin-top:30px}
.rule i{display:block;width:120px;height:1.5px;background:rgba(247,241,234,.55)}
.sub{font-family:Fraunces;font-style:italic;font-weight:300;font-size:38px;opacity:.95}
.sub b{font-weight:400;color:${s.ink}}
.vert{position:absolute;right:58px;top:70px;writing-mode:vertical-rl;font-family:'Shippori Mincho';font-weight:700;font-size:40px;letter-spacing:.32em;color:#283247;opacity:.82}
.cover-seal{position:absolute;right:57px;top:440px;width:58px;height:58px;font-size:24px;line-height:1.05;writing-mode:vertical-rl}
.swipe{position:absolute;bottom:46px;left:0;right:0;text-align:center;font-family:'Zen Kaku Gothic New';font-weight:500;font-size:19px;letter-spacing:.45em;color:rgba(247,241,234,.7)}
</style><div class="ph"><img src="file://${D}/${s.img}"></div><div class="tint"></div><div class="fade"></div>
<div class="vert">${s.jp}</div><div class="seal cover-seal">映画</div>
<div class="txt"><div class="kick">${s.kick}</div><div class="h">${s.h}</div><div class="h2">${s.h2}</div>
<div class="rule"><i></i><span class="sub">${s.sub}</span><i></i></div></div>
<div class="swipe">5 FILMS &nbsp;·&nbsp; SWIPE →</div>${grain}`;
}

function inside(s, n) {
  const ink = s.ink;
  return `<style>${base}
body{background:#EFE7D8}
.paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,252,244,.7),rgba(239,231,216,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(214,200,176,.45),rgba(239,231,216,0) 55%)}
.fib{position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.012 .09' numOctaves='4' seed='${n}'/><feColorMatrix values='0 0 0 0 .55  0 0 0 0 .48  0 0 0 0 .38  0 0 0 .55 -.12'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")}
.hdr{position:absolute;top:52px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:baseline;font-family:'Zen Kaku Gothic New';font-weight:500;font-size:19px;letter-spacing:.38em;color:#5E564C}
.hdr em{font-family:Fraunces;font-style:italic;font-weight:400;letter-spacing:0;font-size:28px;color:${ink}}
.big{position:absolute;left:60px;top:110px;width:960px;height:610px;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.08),0 18px 40px -18px rgba(60,45,30,.45)}
.big img{width:100%;height:100%;object-fit:cover;object-position:${s.bx ?? 50}% ${s.by ?? 50}%;filter:${s.bw ? 'grayscale(1) contrast(1.05) sepia(.12)' : 'saturate(.9) contrast(.96) sepia(.08)'}}
.inset{position:absolute;right:60px;top:650px;width:330px;height:440px;background:#FBF7EF;padding:12px;box-shadow:0 22px 40px -16px rgba(50,35,20,.5);transform:rotate(${s.rot ?? 2}deg)}
.inset div{width:100%;height:100%;overflow:hidden}
.inset img{width:100%;height:100%;object-fit:cover;object-position:${s.sx ?? 50}% ${s.sy ?? 50}%;filter:${s.bw ? 'grayscale(1) contrast(1.05) sepia(.12)' : 'saturate(.9) contrast(.96) sepia(.08)'}}
.txt{position:absolute;left:60px;width:505px;top:${s.tty || 810}px;color:#2B2621}
.no{font-family:'Shippori Mincho';font-weight:700;font-size:26px;color:${ink};letter-spacing:.2em}
.t{font-family:'Shippori Mincho';font-weight:800;font-size:${s.fs || 74}px;line-height:1.02;margin-top:14px;color:#26211C}
.meta{font-family:'Zen Kaku Gothic New';font-weight:700;font-size:19px;letter-spacing:.32em;color:${ink};margin-top:22px}
.line{font-family:Fraunces;font-style:italic;font-weight:300;font-size:38px;line-height:1.3;margin-top:26px;color:#3A332C}
.jpcol{position:absolute;left:612px;top:812px;display:flex;flex-direction:column;align-items:center;gap:20px}
.jp{writing-mode:vertical-rl;font-family:'Shippori Mincho';font-weight:700;font-size:${s.jfs || 34}px;letter-spacing:.28em;color:#5A5148;opacity:.85}
.s2{width:46px;height:46px;font-size:26px}
.foot{position:absolute;bottom:48px;left:60px;right:60px;display:flex;align-items:center;gap:20px;font-family:'Zen Kaku Gothic New';font-weight:500;font-size:16px;letter-spacing:.4em;color:#7A7064}
.foot i{flex:1;height:1px;background:rgba(90,80,70,.35)}
</style>${svgdef}<div class="paper"></div><div class="fib"></div>
<div class="hdr"><span>Nº 0${n} / 05</span><em>a slow life</em></div>
<div class="big"><img src="file://${D}/${s.img}"></div>
<div class="inset"><div><img src="file://${D}/${s.img2}"></div></div>
<div class="txt"><div class="t">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="line">${s.ov}</div></div>
<div class="jpcol"><div class="jp">${s.jp}</div><div class="seal s2">${'一二三四五'[n - 1]}</div></div>
<div class="foot"><span>MOVIES THAT FEEL LIKE A SLOW LIFE</span><i></i></div>${grain}`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[3];
  for (const [i, s] of S.entries()) {
    if (only && s.file !== only) continue;
    const body = s.type === 'cover' ? svgdef + cover(s) : inside(s, i);
    fs.writeFileSync(D + '/_t.html', `<html><head><meta charset="utf-8">${links}</head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
