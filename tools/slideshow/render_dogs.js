// "movies that will make you want to hug your dog" — cover: Isle of Dogs boy+dog silhouette on a flat tangerine sunset,
// sky extended upward; giant plum-black Anton YOUR / DOG stacked right, cream Yellowtail 'hug' overlapping.
// inside: GOOD DOG REGISTRY (per-film coloured bg w/ paw pattern, cream-bordered photo, brass bone ID tag engraved w/ the
// dog's name, manila dog-licence card w/ typewriter fields + red CERTIFIED GOOD DOG rubber stamp).
// Usage: node render_dogs.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PAPER = `background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='500' height='500'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.04' numOctaves='5' seed='3'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")`;
const paw = (c) => `<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180' viewBox='0 0 180 180'><g fill='${c}' transform='translate(40 40) rotate(-18 30 30)'><ellipse cx='30' cy='42' rx='17' ry='14'/><ellipse cx='12' cy='22' rx='6.5' ry='8.5'/><ellipse cx='24' cy='12' rx='6.5' ry='8.5'/><ellipse cx='37' cy='12' rx='6.5' ry='8.5'/><ellipse cx='49' cy='22' rx='6.5' ry='8.5'/></g><g fill='${c}' transform='translate(120 115) rotate(22 30 30) scale(.8)'><ellipse cx='30' cy='42' rx='17' ry='14'/><ellipse cx='12' cy='22' rx='6.5' ry='8.5'/><ellipse cx='24' cy='12' rx='6.5' ry='8.5'/><ellipse cx='37' cy='12' rx='6.5' ry='8.5'/><ellipse cx='49' cy='22' rx='6.5' ry='8.5'/></g></svg>`;
const PAWS = `background-image:url("data:image/svg+xml;utf8,${paw('%23ffffff').replace(/#/g, '%23')}");background-size:220px 220px`;
const css = [
  ff('Anton', 'anton', 400), ff('Yellowtail', 'yellowtail', 400),
  ff('Karla', 'karla', 500), ff('Karla', 'karla', 700), ff('Karla', 'karla', 800),
  ff('Corm', 'cormorant-garamond', 500, 'italic'), ff('Corm', 'cormorant-garamond', 600, 'italic'), ff('Corm', 'cormorant-garamond', 700, 'italic'),
  ff('Type', 'courier-prime', 400), ff('Type', 'courier-prime', 700),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#E8662A}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;${GRAIN};pointer-events:none;z-index:50}
/* COVER */
.cv .bg{position:absolute;inset:0;width:100%;height:100%;filter:saturate(1.06) contrast(1.04)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse 85% 70% at 55% 45%,rgba(0,0,0,0) 55%,rgba(60,10,0,.38) 100%)}
.cv .glow{position:absolute;inset:0;background:radial-gradient(ellipse 60% 40% at 72% 62%,rgba(255,200,120,.22),rgba(255,200,120,0) 70%);mix-blend-mode:screen}
.cv .kick{position:absolute;top:84px;left:0;right:0;text-align:center;font-family:Karla;font-weight:800;font-size:23px;letter-spacing:.46em;padding-left:.46em;color:var(--ink)}
.cv .kick i{display:block;width:70px;height:2px;background:var(--ink);margin:22px auto 0;opacity:.8}
.cv .stack{position:absolute;right:56px;top:262px;text-align:right}
.cv .hug{font-family:Yellowtail;font-size:210px;line-height:1;color:var(--cr);transform:rotate(-8deg);position:relative;z-index:3;margin-right:150px;margin-bottom:-58px;text-shadow:0 6px 30px rgba(90,20,0,.35)}
.cv .your{font-family:Anton;font-size:210px;line-height:.9;color:var(--ink);letter-spacing:.01em}
.cv .dog{font-family:Anton;font-size:282px;line-height:.86;color:var(--ink);letter-spacing:.01em;margin-top:2px}
.cv .sub{font-family:Corm;font-style:italic;font-weight:600;font-size:39px;color:var(--ink);line-height:1.18;margin-top:26px}
.cv .sub b{font-weight:700;color:var(--cr)}
.cv .foot{position:absolute;left:62px;bottom:56px;font-family:Karla;font-weight:700;font-size:19px;letter-spacing:.36em;color:var(--cr);opacity:.92}
.cv .foot2{position:absolute;right:52px;bottom:56px;font-family:Karla;font-weight:700;font-size:19px;letter-spacing:.3em;color:var(--cr);opacity:.92}
/* REGISTRY */
.rg{position:absolute;inset:0;background:var(--bg)}
.rg:before{content:'';position:absolute;inset:0;${PAWS};opacity:.06}
.rg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse 80% 65% at 50% 38%,rgba(255,255,255,.10),rgba(0,0,0,0) 60%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.38) 100%)}
.head{position:absolute;top:54px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:center;font-family:Karla;font-weight:800;font-size:18px;letter-spacing:.36em;color:#FBF3E4;opacity:.9;z-index:2}
.head .m{font-family:Yellowtail;font-size:44px;letter-spacing:0;font-weight:400;opacity:1;color:var(--acc)}
.photo{position:absolute;left:72px;top:118px;width:936px;padding:16px 16px 16px;background:#FBF5EA;transform:rotate(-1.3deg);box-shadow:0 28px 46px rgba(0,0,0,.42),0 6px 12px rgba(0,0,0,.25);z-index:3}
.photo img{display:block;width:904px;height:590px;object-fit:cover;filter:saturate(1.04) contrast(1.04)}
.photo .in{position:absolute;inset:16px;box-shadow:inset 0 0 50px rgba(0,0,0,.28);pointer-events:none}
.tag{position:absolute;z-index:6;left:640px;top:632px;width:330px;height:150px;transform:rotate(-7deg);filter:drop-shadow(0 12px 14px rgba(0,0,0,.45))}
.tag .nm{position:absolute;left:66px;right:24px;top:30px;text-align:center;font-family:Yellowtail;font-size:var(--tn,62px);color:#5a3b0e;text-shadow:0 1.5px 0 rgba(255,244,205,.75),0 -1px 0 rgba(60,35,0,.5);line-height:1.3;white-space:nowrap}
.tag .gd{position:absolute;left:58px;right:24px;top:104px;text-align:center;font-family:Karla;font-weight:800;font-size:12px;letter-spacing:.42em;color:#6a4a16;text-shadow:0 1px 0 rgba(255,244,205,.7)}
.card{position:absolute;left:72px;top:782px;width:936px;height:500px;background:#EBDDBF;transform:rotate(.7deg);box-shadow:0 24px 40px rgba(0,0,0,.4),0 4px 10px rgba(0,0,0,.2);padding:40px 50px 42px;color:#2a241c;z-index:4;overflow:hidden;display:flex;flex-direction:column}
.card:before{content:'';position:absolute;inset:0;${PAPER};opacity:.30;mix-blend-mode:multiply}
.card:after{content:'';position:absolute;inset:14px;border:2px solid rgba(80,60,30,.35);outline:1px solid rgba(80,60,30,.2);outline-offset:-8px;pointer-events:none}
.card .top{position:relative;display:flex;justify-content:space-between;font-family:Karla;font-weight:800;font-size:15px;letter-spacing:.34em;color:#6b5a40;padding-bottom:14px;border-bottom:2px solid rgba(80,60,30,.35);margin-top:6px}
.card .t{position:relative;font-family:Anton;font-size:var(--ts,96px);line-height:1;color:var(--ink);margin-top:22px;text-transform:uppercase;letter-spacing:.01em;width:620px}
.card .d{position:relative;font-family:Karla;font-weight:700;font-size:17px;letter-spacing:.24em;color:#4a3f30;margin-top:12px}
.card .f{position:relative;margin-top:22px;display:grid;grid-template-columns:150px 1fr;row-gap:9px;font-family:Type;font-size:23px;color:#26201a;width:820px}
.card .f .k{font-weight:700;font-size:15px;letter-spacing:.24em;color:#7a6a50;padding-top:6px}
.card .f .v{border-bottom:1.5px dotted rgba(80,60,30,.45);padding-bottom:3px}
.card .q{position:relative;font-family:Corm;font-style:italic;font-weight:600;font-size:33px;color:var(--ink);margin-top:auto;padding-top:14px;line-height:1.2}
.stamp{position:absolute;right:44px;top:66px;width:196px;height:196px;transform:rotate(14deg);opacity:.82;mix-blend-mode:multiply;z-index:5}
`;
const stamp = (c) => `<svg class="stamp" viewBox="0 0 200 200"><defs><path id="cp" d="M100,100 m-72,0 a72,72 0 1,1 144,0 a72,72 0 1,1 -144,0"/>
<filter id="rough"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="4"/><feColorMatrix type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.2 1.6"/><feComposite in="SourceGraphic" operator="in"/></filter></defs>
<g filter="url(#rough)" fill="none" stroke="${c}"><circle cx="100" cy="100" r="94" stroke-width="5"/><circle cx="100" cy="100" r="56" stroke-width="3"/>
<text font-family="Karla" font-weight="800" font-size="21" fill="${c}" stroke="none"><textPath href="#cp" textLength="446" lengthAdjust="spacing">CERTIFIED ★ GOOD DOG ★</textPath></text>
<g transform="translate(70 66) scale(1)" fill="${c}" stroke="none"><ellipse cx="30" cy="44" rx="17" ry="14"/><ellipse cx="12" cy="24" rx="6.5" ry="8.5"/><ellipse cx="24" cy="13" rx="6.5" ry="8.5"/><ellipse cx="37" cy="13" rx="6.5" ry="8.5"/><ellipse cx="49" cy="24" rx="6.5" ry="8.5"/></g></g></svg>`;
const bone = `<svg width="330" height="150" viewBox="0 0 330 150" style="position:absolute;inset:0"><defs>
<linearGradient id="br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8a6420"/><stop offset=".22" stop-color="#f6dc8e"/><stop offset=".42" stop-color="#c49a3e"/><stop offset=".6" stop-color="#ffe9a8"/><stop offset=".8" stop-color="#b38631"/><stop offset="1" stop-color="#7a5418"/></linearGradient>
<linearGradient id="rim" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2c4"/><stop offset="1" stop-color="#6e4a12"/></linearGradient></defs>
<path d="M62,42 C46,10 6,18 14,48 C2,58 2,92 14,102 C6,132 46,140 62,108 L268,108 C284,140 324,132 316,102 C328,92 328,58 316,48 C324,18 284,10 268,42 Z" fill="url(#br)" stroke="url(#rim)" stroke-width="3"/>
<path d="M66,52 L264,52 M66,98 L264,98" stroke="rgba(90,60,10,.35)" stroke-width="1.5"/>
<circle cx="36" cy="75" r="11" fill="#2a1d08" opacity=".85"/><circle cx="36" cy="75" r="11" fill="none" stroke="#fff0bf" stroke-width="1.5" opacity=".6"/>
<circle cx="36" cy="46" r="26" fill="none" stroke="#c9a24e" stroke-width="5" transform="rotate(-20 36 75)"/>
</svg>`;
const page = (body, vars) => `<html><head><style>${css}</style></head><body style="${vars}">${body}<div class="grain"></div></body></html>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, name) => { fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html', { waitUntil: 'load' }); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250); await p.screenshot({ path: `${D}/out/${name}`, type: 'jpeg', quality: 93 }); };
  const c = S.cover;
  await shot(page(`<div class="cv"><img class="bg" src="file://${D}/${c.img}"><div class="glow"></div><div class="vig"></div>
    <div class="kick">${c.kick}<i></i></div>
    <div class="stack"><div class="hug">${c.h}</div><div class="your">${c.h2a}</div><div class="dog">${c.h2b}</div><div class="sub">${c.sub}</div></div>
    <div class="foot">${c.foot}</div><div class="foot2">SWIPE →</div></div>`, `--ink:${c.ink};--cr:${c.cr}`), '01_cover.jpg');
  for (const [i, m] of S.movies.entries()) {
    const n = String(i + 1).padStart(2, '0');
    await shot(page(`<div class="rg"></div>
      <div class="head"><span>THE GOOD DOG REGISTRY</span><span class="m">good dogs only</span><span>Nº ${n} / 05</span></div>
      <div class="photo"><img src="file://${D}/${m.img}" style="object-position:${m.x || 50}% ${m.y || 50}%"><div class="in"></div></div>
      <div class="tag" style="--tn:${m.tn || 62}px">${bone}<div class="nm">${m.dog}</div><div class="gd">GOOD ${m.sex || 'BOY'}</div></div>
      <div class="card" style="--ts:${m.ts || 96}px">${stamp(m.st || '#B3261E')}
        <div class="top"><span>LICENCE TO BE LOVED</span><span>FILE Nº ${n}</span></div>
        <div class="t">${m.t}</div>
        <div class="d">${m.d}</div>
        <div class="f"><span class="k">NAME</span><span class="v">${m.name}</span><span class="k">BREED</span><span class="v">${m.breed}</span><span class="k">KNOWN FOR</span><span class="v">${m.known}</span></div>
        <div class="q">${m.q}</div>
      </div>`, `--bg:${m.bg};--ink:${m.ink};--acc:${m.acc || '#FBF3E4'}`), `0${i + 2}_${m.slug}.jpg`);
  }
  await b.close();
})();
