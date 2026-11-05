// ede.nnico — "movies that feel like a film noir": B&W Third Man arch cover + CASE FILE inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const ICE = '#8EC5FF';
const css = [
  ff('Six', 'six-caps', 400), ff('Delafield', 'mrs-saint-delafield', 400), ff('Elite', 'special-elite', 400),
  ff('Gar', 'eb-garamond', 400, 'italic'), ff('Gar', 'eb-garamond', 500, 'italic'), ff('Gar', 'eb-garamond', 600), ff('Gar', 'eb-garamond', 700),
  ff('Osw', 'oswald', 500), ff('Osw', 'oswald', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#08090b}
.grain{position:absolute;inset:0;opacity:.22;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 45%,rgba(0,0,0,.6) 100%);pointer-events:none}
/* cover */
.cimg{position:absolute;inset:0;background-size:cover;filter:grayscale(1) contrast(1.22) brightness(1.02)}
.ctint{position:absolute;inset:0;background:#2a4a78;mix-blend-mode:soft-light;opacity:.55}
.ctop{position:absolute;left:0;right:0;top:0;height:640px;background:linear-gradient(180deg,rgba(5,7,10,.92) 0,rgba(5,7,10,.75) 45%,rgba(5,7,10,0) 100%)}
.cbot{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(0deg,rgba(5,7,10,.9) 0,rgba(5,7,10,.55) 50%,rgba(5,7,10,0) 100%)}
.ctxt{position:absolute;left:0;right:0;top:70px;text-align:center}
.ckick{font-family:Elite;font-size:27px;letter-spacing:.36em;color:#E8EDF3;padding-left:.36em;opacity:.92}
.cbig{position:relative;font-family:Six;font-size:470px;line-height:.82;letter-spacing:.06em;color:${ICE};margin-top:26px;padding-left:.06em;
  text-shadow:0 0 40px rgba(142,197,255,.35),0 6px 20px rgba(0,0,0,.6)}
.cscript{position:absolute;left:-330px;right:0;top:300px;font-family:Delafield;font-size:190px;color:#fff;line-height:1;transform:rotate(-9deg);
  text-shadow:0 4px 18px rgba(0,0,0,.85)}
.csub{position:absolute;left:0;right:0;bottom:120px;text-align:center;font-family:Gar;font-style:italic;font-weight:500;font-size:43px;line-height:1.2;color:#EEF1F5;text-shadow:0 2px 14px rgba(0,0,0,.9)}
.csub b{color:${ICE};font-weight:500}
.cfoot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Elite;font-size:21px;letter-spacing:.4em;color:#E8EDF3;opacity:.85}
/* case file slide */
.page{position:absolute;inset:0}
.blinds{position:absolute;inset:-200px;transform:rotate(-24deg);
  background:repeating-linear-gradient(180deg,rgba(255,236,200,.085) 0 34px,rgba(0,0,0,0) 34px 78px);
  -webkit-mask-image:radial-gradient(ellipse 55% 60% at 62% 40%,#000 20%,transparent 80%)}
.hdr{position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;font-family:Elite;font-size:22px;letter-spacing:.3em;color:rgba(236,232,224,.85)}
.hdr .m{font-family:Delafield;font-size:58px;letter-spacing:0;color:${ICE};margin-top:-8px}
.folder{position:absolute;left:58px;top:150px;width:964px;height:1120px;transform:rotate(-1.4deg);filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))}
.tab{position:absolute;left:0;top:-46px;width:360px;height:58px;background:#cfb684;border-radius:12px 12px 0 0;
  font-family:Elite;font-size:21px;letter-spacing:.22em;color:#3b2d1c;padding:16px 0 0 26px}
.card{position:absolute;inset:0;background:#d9c394;border-radius:0 10px 10px 10px;
  background-image:radial-gradient(ellipse at 20% 15%,rgba(255,250,235,.45),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 85% 90%,rgba(120,85,40,.28),rgba(0,0,0,0) 60%),
  url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.6' numOctaves='4'/><feColorMatrix values='0 0 0 0 .45 0 0 0 0 .33 0 0 0 0 .18 0 0 0 .22 0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")}
.lines{position:absolute;left:40px;right:40px;top:28px;display:flex;justify-content:space-between;font-family:Elite;font-size:19px;letter-spacing:.2em;color:#4a3a24}
.photo{position:absolute;left:40px;top:76px;width:884px;height:520px;background:#f4efe4;padding:14px 14px 14px;box-shadow:0 10px 20px rgba(60,40,15,.35)}
.photo img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.06) saturate(.9)}
.clip{position:absolute;top:44px;left:120px;width:46px;height:120px;z-index:3}
.ev{position:absolute;right:34px;top:560px;width:330px;transform:rotate(5deg);background:#f4efe4;padding:12px 12px 52px;box-shadow:0 14px 24px rgba(40,25,10,.45);z-index:2}
.ev img{width:100%;height:250px;object-fit:cover;display:block;filter:grayscale(.35) contrast(1.05)}
.ev span{position:absolute;left:0;right:0;bottom:14px;text-align:center;font-family:Elite;font-size:18px;letter-spacing:.24em;color:#3b2d1c}
.tape{position:absolute;top:-16px;left:50%;margin-left:-60px;width:120px;height:34px;background:rgba(245,238,215,.7);transform:rotate(-3deg)}
.info{position:absolute;left:48px;top:640px;width:520px}
.file{font-family:Elite;font-size:19px;letter-spacing:.26em;color:#5a4628}
.ttl{font-family:Osw;font-weight:600;font-size:var(--fs,78px);line-height:1;letter-spacing:.02em;text-transform:uppercase;color:#1f1810;margin-top:12px}
.meta{font-family:Elite;font-size:21px;letter-spacing:.14em;color:#3b2d1c;margin-top:18px}
.rule{height:2px;width:100%;margin:22px 0 18px;background:repeating-linear-gradient(90deg,#5a4628 0 10px,transparent 10px 16px);opacity:.7}
.line{font-family:Gar;font-style:italic;font-weight:500;font-size:37px;line-height:1.22;color:#24190e}
.stamp{position:absolute;right:56px;bottom:74px;transform:rotate(-8deg);border:5px solid var(--ink);border-radius:8px;padding:10px 24px 8px;
  font-family:Osw;font-weight:600;font-size:40px;letter-spacing:.16em;color:var(--ink);opacity:.82;mix-blend-mode:multiply;
  -webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='m'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3'/><feColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 -2.2 2.1'/></filter><rect width='100%' height='100%' filter='url(%23m)'/></svg>")}
.stamp small{display:block;font-family:Elite;font-weight:400;font-size:16px;letter-spacing:.3em;margin-top:2px}
.prog{position:absolute;left:52px;bottom:44px;display:flex;gap:12px;align-items:center;font-family:Elite;font-size:17px;letter-spacing:.2em;color:#4a3a24}
.prog i{width:14px;height:14px;border:2px solid #4a3a24;border-radius:50%}
.prog i.on{background:#4a3a24}
`;
const clip = `<svg class="clip" viewBox="0 0 46 120"><path d="M14 112V22a9 9 0 0 1 18 0v78a14 14 0 0 1-28 0V14a19 19 0 0 1 38 0v86" fill="none" stroke="#9aa0a6" stroke-width="5" stroke-linecap="round"/><path d="M14 112V22a9 9 0 0 1 18 0v78a14 14 0 0 1-28 0V14a19 19 0 0 1 38 0v86" fill="none" stroke="#e6e9ec" stroke-width="2" stroke-linecap="round" opacity=".7"/></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="cimg" style="background-image:url(file://${D}/${s.img});background-position:${s.x}% 50%"></div><div class="ctint"></div><div class="ctop"></div><div class="cbot"></div><div class="vig"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="cbig">${s.h}</div><div class="cscript">${s.h2}</div></div>
      <div class="csub">${s.sub}</div><div class="cfoot">05 FILMS &nbsp;·&nbsp; SWIPE &nbsp;→</div><div class="grain"></div>`;
    } else {
      const n = String(i).padStart(2, '0');
      const prog = [1, 2, 3, 4, 5].map(k => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
      body = `<div class="page" style="background:radial-gradient(ellipse at 60% 35%,${s.page2},${s.page} 75%)"></div><div class="blinds"></div>
      <div class="hdr"><span>CASE Nº ${n} / 05</span><span class="m">a film noir</span></div>
      <div class="folder" style="--ink:${s.ink};--fs:${s.fs || 78}px"><div class="tab">FILE ${n} · ${s.city}</div><div class="card">
        <div class="lines"><span>EXHIBIT A</span><span>CONFIDENTIAL</span></div>
        <div class="photo"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>${clip}
        <div class="ev"><div class="tape"></div><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"><span>EXHIBIT B</span></div>
        <div class="info"><div class="file">SUBJECT: &nbsp;${s.when}</div><div class="ttl">${s.t}</div>
          <div class="meta">DIR. ${s.dir.toUpperCase()} · ${s.yr}</div><div class="rule"></div><div class="line">${s.line}</div></div>
        <div class="stamp">${s.stamp}<small>${s.stamp2}</small></div>
        <div class="prog">${prog}</div>
      </div></div><div class="vig"></div><div class="grain"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${String(i + 1).padStart(2, '0')}_${s.type === 'cover' ? 'cover' : 'film' + i}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
