// "TAROT" look: gothic romance. Cover = still fading up into dark teal-black w/ blackletter hero.
// Inside = each film as an ornate tarot card on a per-film velvet page.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Frak', 'unifrakturmaguntia', 400), ff('Cinzel', 'cinzel', 500), ff('Cinzel', 'cinzel', 600), ff('Cinzel', 'cinzel', 700),
  ff('Fell', 'im-fell-english', 400), ff('Fell', 'im-fell-english', 400, 'italic'),
  ff('Karla', 'karla', 500), ff('Karla', 'karla', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:var(--bg);position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.20;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(0,0,0,.55) 100%)}
/* cover */
.cimg{position:absolute;left:0;right:0;bottom:0;height:1010px;width:1080px;object-fit:cover;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,rgba(0,0,0,.6) 16%,#000 34%);
  filter:saturate(.85) contrast(1.05) brightness(1.02)}
.ctxt{position:absolute;left:0;right:0;top:92px;text-align:center;color:var(--ink)}
.ckick{font-family:Karla;font-weight:600;font-size:23px;letter-spacing:.52em;color:#E9E2D2;opacity:.9}
.frak{font-family:Frak;font-size:232px;line-height:1;margin-top:8px;text-shadow:0 0 40px rgba(200,180,255,.25),0 4px 30px rgba(0,0,0,.6)}
.ccap{font-family:Cinzel;font-weight:600;font-size:52px;letter-spacing:.34em;margin-top:2px;padding-left:.34em;color:#ECE4F7}
.orn{margin:18px auto 0;width:360px;display:flex;align-items:center;gap:14px;color:var(--ink);opacity:.85}
.orn i{flex:1;height:1px;background:currentColor}
.csub{position:absolute;left:0;right:0;bottom:84px;text-align:center;font-family:Fell;font-style:italic;font-size:44px;color:#F1EAF8;text-shadow:0 2px 18px rgba(0,0,0,.85)}
.cswipe{position:absolute;left:0;right:0;bottom:44px;text-align:center;font-family:Karla;font-weight:500;font-size:18px;letter-spacing:.45em;color:#F1EAF8;opacity:.7}
/* tarot */
.stars{position:absolute;inset:0;opacity:.5}
.card{position:absolute;left:225px;top:64px;width:630px;height:1000px;border-radius:22px;background:var(--paper);
  box-shadow:0 30px 60px rgba(0,0,0,.6),0 0 0 1px rgba(0,0,0,.4);transform:rotate(var(--rot))}
.card .b1{position:absolute;inset:16px;border:2px solid var(--gold);border-radius:14px}
.card .b2{position:absolute;inset:24px;border:1px solid var(--gold);border-radius:10px;opacity:.7}
.rn{position:absolute;top:44px;left:0;right:0;text-align:center;font-family:Cinzel;font-weight:700;font-size:38px;letter-spacing:.2em;color:var(--ink2);padding-left:.2em}
.arch{position:absolute;left:58px;top:104px;width:514px;height:716px;border-radius:257px 257px 8px 8px;overflow:hidden;border:3px solid var(--gold);box-shadow:inset 0 0 0 6px var(--paper)}
.arch img{width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.06)}
.arch .ig{position:absolute;inset:0;box-shadow:inset 0 0 70px rgba(0,0,0,.45)}
.cname{position:absolute;left:0;right:0;top:842px;text-align:center;font-family:Cinzel;font-weight:700;font-size:44px;letter-spacing:.3em;padding-left:.3em;color:var(--ink2)}
.corn{position:absolute;left:0;right:0;top:906px;display:flex;justify-content:center;gap:16px;color:var(--gold)}
.corn{gap:22px!important;top:900px!important}.corn svg{width:34px;height:34px}
.cs{position:absolute;font-size:22px;color:var(--gold);line-height:1}.cs.a{left:38px;top:36px}.cs.b{right:38px;top:36px}.cs.c{left:38px;bottom:34px}.cs.d{right:38px;bottom:34px}
.below{position:absolute;left:60px;right:60px;top:1092px;text-align:center}
.ttl{font-family:Fell;font-size:62px;line-height:1.02;color:var(--acc)}
.meta{font-family:Karla;font-weight:600;font-size:21px;letter-spacing:.38em;color:#EFE7DA;opacity:.8;margin-top:12px}
.line{font-family:Fell;font-style:italic;font-size:37px;color:#EFE7DA;margin-top:12px;opacity:.95}
.side{position:absolute;top:50%;font-family:Cinzel;font-weight:600;font-size:18px;letter-spacing:.5em;color:var(--acc);opacity:.75;white-space:nowrap}
.sl{left:110px;transform:translate(-50%,-120px) rotate(-90deg)}
.sr{left:970px;transform:translate(-50%,-120px) rotate(90deg)}
`;
const moon = (k) => {
  // k: 0 new … 4 full … waxing/waning crescents
  const shapes = ['<circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>',
    '<mask id="mL"><rect width="26" height="26" fill="white"/><circle cx="18" cy="11" r="9" fill="black"/></mask><circle cx="13" cy="13" r="10" fill="currentColor" mask="url(#mL)"/>',
    '<circle cx="13" cy="13" r="10" fill="currentColor"/>',
    '<mask id="mR"><rect width="26" height="26" fill="white"/><circle cx="8" cy="11" r="9" fill="black"/></mask><circle cx="13" cy="13" r="10" fill="currentColor" mask="url(#mR)"/>',
    '<circle cx="13" cy="13" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/>'];
  return `<svg viewBox="0 0 26 26">${shapes[k]}</svg>`;
};
const starsSvg = (seed) => { let s = seed, r = () => (s = (s * 9301 + 49297) % 233280) / 233280, o = '';
  for (let i = 0; i < 90; i++) { const x = r() * 1080, y = r() * 1350, a = r() * .8 + .2, z = r() * 1.6 + .4; o += `<circle cx="${x}" cy="${y}" r="${z}" fill="white" opacity="${a}"/>`; }
  return `<svg class="stars" width="1080" height="1350">${o}</svg>`; };
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body, vars;
    if (s.type === 'cover') {
      vars = `--bg:${s.bg};--ink:${s.ink}`;
      body = `<img class="cimg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%">
      <div class="vig" style="opacity:.6"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="frak">${s.h}</div><div class="ccap">${s.h2}</div>
      <div class="orn"><i></i>${moon(1).replace('<svg', '<svg width="20" height="20"')}${moon(2).replace('<svg', '<svg width="20" height="20"')}${moon(3).replace('<svg', '<svg width="20" height="20"')}<i></i></div></div>
      <div class="csub">${s.sub}</div><div class="cswipe">DRAW A CARD &nbsp;→</div><div class="grain"></div>`;
    } else if (s.type === 'card') {
      vars = `--bg:${s.bg};--paper:${s.paper};--gold:${s.gold};--ink2:${s.ink2};--acc:${s.acc};--rot:${s.rot || 0}deg`;
      body = `${starsSvg(i * 77 + 3)}<div class="vig"></div>
      <div class="side sl">Nº 0${i} / 05</div><div class="side sr">${s.yr}</div>
      <div class="card"><div class="b1"></div><div class="b2"></div><div class="cs a">✦</div><div class="cs b">✦</div><div class="cs c">✦</div><div class="cs d">✦</div><div class="rn">${s.rn}</div>
        <div class="arch"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="ig"></div></div>
        <div class="cname">${s.card}</div><div class="corn">${[1, 2, 3].map(moon).join('')}</div></div>
      <div class="below"><div class="ttl">${s.t}</div><div class="meta">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div><div class="line">${s.ov}</div></div>
      <div class="grain"></div>`;
    } else continue;
    const html = `<html><head><style>${css}</style></head><body style="${vars}">${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
