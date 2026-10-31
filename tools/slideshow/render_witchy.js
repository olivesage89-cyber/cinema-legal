// "BOOK OF SHADOWS" look: witchy season. Cover = Practical Magic rooftop witches under an extended
// lavender sky, ink-black Ballet script hero. Inside = each film as a page in an old grimoire:
// parchment, photo-cornered still, round "scrying mirror" inset, Goudy title, handwritten spell + ingredients.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Ballet', 'ballet', 400), ff('Goudy', 'sorts-mill-goudy', 400), ff('Goudy', 'sorts-mill-goudy', 400, 'italic'),
  ff('Hand', 'cedarville-cursive', 400), ff('Inter', 'inter', 500), ff('Inter', 'inter', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:var(--bg);position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:var(--go,.2);mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.sky{position:absolute;inset:0;background:linear-gradient(180deg,#E4E0F2 0%,#C9C4E6 22%,#9C99C6 44%,#7E7BAA 60%)}
.cimg{position:absolute;bottom:0;object-fit:cover;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.55) 10%,#000 24%);
  filter:saturate(.95) contrast(1.06) brightness(.98)}
.ctxt{position:absolute;left:0;right:0;top:70px;text-align:center;color:var(--ink)}
.ckick{font-family:Inter;font-weight:600;font-size:22px;letter-spacing:.55em;padding-left:.55em;color:var(--ink);opacity:.82}
.hero{font-family:Ballet;font-size:226px;line-height:1.1;margin-top:-14px;color:var(--ink)}
.ccap{font-family:Goudy;font-size:62px;letter-spacing:.42em;padding-left:.42em;margin-top:-30px;color:var(--ink)}
.orn{margin:14px auto 0;width:300px;display:flex;align-items:center;gap:14px;color:var(--ink);opacity:.75;font-size:18px}
.orn i{flex:1;height:1px;background:currentColor}
.cbot{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(180deg,transparent,rgba(8,6,14,.82))}
.csub{position:absolute;left:0;right:0;bottom:92px;text-align:center;font-family:Goudy;font-style:italic;font-size:46px;color:#F1ECFA;text-shadow:0 2px 18px rgba(0,0,0,.8)}
.cswipe{position:absolute;left:0;right:0;bottom:50px;text-align:center;font-family:Inter;font-weight:500;font-size:17px;letter-spacing:.5em;color:#F1ECFA;opacity:.7}
/* grimoire page */
.parch{position:absolute;inset:0;background:
  radial-gradient(ellipse at 30% 20%,rgba(255,250,235,.7),transparent 55%),
  radial-gradient(ellipse at 80% 85%,rgba(160,120,70,.18),transparent 50%),
  radial-gradient(ellipse at 50% 50%,#F1E6CC 40%,#DCC9A3 100%)}
.stain{position:absolute;border-radius:50%;border:2px solid rgba(140,100,50,.10);background:radial-gradient(circle,transparent 60%,rgba(150,110,60,.08))}
.edge{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(90,60,25,.38)}
.hdr{position:absolute;left:84px;right:84px;top:58px;display:flex;justify-content:space-between;font-family:Goudy;font-size:22px;letter-spacing:.34em;color:var(--acc)}
.rule{position:absolute;left:84px;right:84px;top:100px;height:5px;border-top:1.5px solid var(--acc);border-bottom:1px solid var(--acc);opacity:.6}
.photo{position:absolute;left:84px;top:142px;width:912px;height:660px;transform:rotate(var(--rot));background:#fbf6ea;padding:14px;
  box-shadow:0 14px 30px rgba(70,45,15,.30),0 2px 4px rgba(70,45,15,.25)}
.photo img{width:100%;height:100%;object-fit:cover;filter:saturate(.92) contrast(1.05) sepia(.08)}
.pc{position:absolute;width:62px;height:62px;background:#2A1E16;opacity:.92}
.pc.a{left:-8px;top:-8px;clip-path:polygon(0 0,100% 0,0 100%)}.pc.b{right:-8px;top:-8px;clip-path:polygon(0 0,100% 0,100% 100%)}
.pc.c{left:-8px;bottom:-8px;clip-path:polygon(0 0,0 100%,100% 100%)}.pc.d{right:-8px;bottom:-8px;clip-path:polygon(100% 0,0 100%,100% 100%)}
.mirror{position:absolute;left:730px;top:700px;width:290px;height:290px;border-radius:50%;padding:10px;background:linear-gradient(135deg,#C9A35A,#7A5A22 55%,#E2C27C);
  box-shadow:0 14px 30px rgba(60,35,10,.4)}
.mirror div{width:100%;height:100%;border-radius:50%;overflow:hidden;border:2px solid #3A2A12}
.mirror img{width:100%;height:100%;object-fit:cover;filter:saturate(.95) contrast(1.05)}
.txt{position:absolute;left:92px;width:620px;top:850px}
.ttl{font-family:Goudy;font-size:var(--fs,78px);line-height:1;color:var(--acc)}
.meta{font-family:Inter;font-weight:600;font-size:18px;letter-spacing:.32em;color:#4A3828;margin-top:16px}
.spell{position:absolute;left:92px;right:84px;top:1060px;font-family:Hand;font-size:42px;line-height:1.3;color:#2B2140}
.spell b{font-weight:400;color:var(--acc)}
.ingr{position:absolute;left:92px;right:84px;top:1168px;font-family:Goudy;font-style:italic;font-size:31px;line-height:1.45;color:#3B2D22}
.ingr .k{font-family:Inter;font-style:normal;font-weight:600;font-size:16px;letter-spacing:.34em;color:var(--acc);display:block;margin-bottom:4px}
.foot{position:absolute;left:0;right:0;bottom:44px;text-align:center;font-family:Goudy;font-size:20px;letter-spacing:.5em;color:var(--acc);opacity:.7}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[3];
  for (const [i, s] of S.entries()) {
    if (only && !s.file.startsWith(only)) continue;
    let body, vars;
    if (s.type === 'cover') {
      vars = `--bg:#7E7BAA;--ink:${s.ink}`;
      body = `<div class="sky"></div><img class="cimg" src="file://${D}/${s.img}" style="width:${s.w}px;height:${Math.round(s.w * 9 / 16)}px;left:${s.left}px">
      <div class="cbot"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="hero">${s.h}</div><div class="ccap">${s.h2}</div>
      <div class="orn"><i></i>☾ ✦ ☽<i></i></div></div>
      <div class="csub">${s.sub}</div><div class="cswipe">OPEN THE BOOK &nbsp;→</div><div class="grain"></div>`;
    } else if (s.type === 'page') {
      vars = `--bg:#E9DCBC;--acc:${s.acc};--rot:${s.rot || 0}deg;--go:.28;${s.fs ? '--fs:' + s.fs + 'px' : ''}`;
      body = `<div class="parch"></div><div class="stain" style="left:${700 - i * 90}px;top:${1060 + i * 20}px;width:260px;height:240px"></div>
      <div class="stain" style="left:${40 + i * 60}px;top:${30}px;width:180px;height:160px;opacity:.6"></div><div class="edge"></div>
      <div class="hdr"><span>BOOK OF SHADOWS</span><span>SPELL Nº ${s.rn}</span></div><div class="rule"></div>
      <div class="photo"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="pc a"></div><div class="pc b"></div><div class="pc c"></div><div class="pc d"></div></div>
      <div class="mirror"><div><img src="file://${D}/${s.img2}" style="object-position:${s.x2}% ${s.y2 ?? 50}%;transform:scale(${s.z2 || 1})"></div></div>
      <div class="txt"><div class="ttl">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div></div>
      <div class="spell"><b>a spell</b> ${s.spell}</div>
      <div class="ingr"><span class="k">YOU WILL NEED</span>${s.ingr}</div>
      <div class="grain"></div>`;
    } else continue;
    const html = `<html><head><style>${css}</style></head><body style="${vars}">${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
