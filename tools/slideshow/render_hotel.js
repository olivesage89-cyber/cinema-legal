// "movies that feel like checking into a grand hotel" — cover: El Royale woman w/ suitcase walking the red carpet to the
// lobby doors, image masked up into an extended night-plum sky; Montserrat spaced kicker + cream Allura 'checking into a'
// + Poiret One spaced GRAND + giant vermilion Rozha One HOTEL + gold deco rule + EB Garamond italic sub.
// Inside: ROOM KEY (per-film deep velvet page w/ gold double deco border, 'HOTEL CINEMA' letterhead, big still in gold
// frame w/ stepped corners, brass key + cream room tag w/ year as room number, Rozha title, Montserrat caps, EB Garamond line).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Roz', 'rozha-one', 400), ff('All', 'allura', 400), ff('Poi', 'poiret-one', 400),
  ff('Mon', 'montserrat', 500), ff('Mon', 'montserrat', 600), ff('Mon', 'montserrat', 700),
  ff('EB', 'eb-garamond', 400, 'italic'), ff('EB', 'eb-garamond', 400), ff('For', 'forum', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#140D18}
.cv .bg{position:absolute;left:0;right:0;bottom:0;height:var(--ih,1000px);background-size:cover;background-position:var(--bx,50%) 50%;
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 34%);filter:saturate(1.08) contrast(1.06) brightness(.97)}
.cv .sky{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 18%,rgba(120,60,90,.28),rgba(0,0,0,0) 60%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 60%,rgba(0,0,0,0) 50%,rgba(0,0,0,.5) 100%)}
.cv .ttl{position:absolute;left:0;right:0;top:62px;text-align:center}
.cv .kick{font-family:Mon;font-weight:600;font-size:20px;letter-spacing:.55em;padding-left:.55em;color:#F3E6D8}
.cv .scr{font-family:All;font-size:92px;line-height:1;color:#F3E6D8;margin-top:18px;text-shadow:0 3px 18px rgba(0,0,0,.6)}
.cv .gr{font-family:Poi;font-size:46px;letter-spacing:.9em;padding-left:.9em;color:#E9CF98;margin-top:2px}
.cv .h{font-family:Roz;font-size:236px;line-height:.86;color:var(--acc);letter-spacing:.04em;padding-left:.04em;margin-top:6px;
  text-shadow:0 10px 50px rgba(0,0,0,.55),0 0 70px rgba(255,90,60,.18)}
.cv .deco{display:flex;align-items:center;justify-content:center;gap:16px;margin:22px auto 16px}
.cv .deco i{display:block;width:150px;height:1.5px;background:linear-gradient(90deg,transparent,#E9CF98)}
.cv .deco i:last-child{background:linear-gradient(270deg,transparent,#E9CF98)}
.cv .deco b{width:12px;height:12px;border:1.5px solid #E9CF98;transform:rotate(45deg)}
.cv .sub{font-family:EB;font-style:italic;font-size:35px;color:#F3E6D8;text-shadow:0 2px 14px rgba(0,0,0,.8)}
.cv .sub b{font-weight:400;color:#E9CF98}
/* inside: room key */
.rk{background:var(--pg)}
.rk .page{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.08),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.45) 100%)}
.rk .b1{position:absolute;inset:28px;border:1.5px solid rgba(233,207,152,.7)}
.rk .b2{position:absolute;inset:38px;border:.8px solid rgba(233,207,152,.45)}
.rk .hd{position:absolute;left:80px;right:80px;top:66px;display:flex;justify-content:space-between;align-items:center;color:#E9CF98}
.rk .hd .s{font-family:Mon;font-weight:600;font-size:14px;letter-spacing:.38em}
.rk .hd .m{font-family:For;font-size:30px;letter-spacing:.42em;padding-left:.42em;color:#F3E6D8;display:flex;align-items:center;gap:18px}
.rk .hd .m b{width:9px;height:9px;border:1.2px solid #E9CF98;transform:rotate(45deg)}
.rk .fr{position:absolute;left:72px;top:132px;width:936px;height:640px;padding:12px;border:1.5px solid #E9CF98}
.rk .fr .im{width:100%;height:100%;background-size:cover;filter:var(--flt,saturate(1.05) contrast(1.04))}
.rk .fr .c{position:absolute;width:26px;height:26px;border:1.5px solid #E9CF98;background:var(--pg)}
.rk .txt{position:absolute;left:84px;width:620px;top:820px;color:#F3E6D8}
.rk .loc{font-family:Mon;font-weight:700;font-size:15px;letter-spacing:.42em;color:var(--acc)}
.rk .t{font-family:Roz;font-size:var(--tfs,84px);line-height:1;margin-top:14px;color:#FBF3E8}
.rk .dir{font-family:Mon;font-weight:600;font-size:15px;letter-spacing:.3em;margin-top:16px;color:rgba(243,230,216,.72)}
.rk .dir b{color:var(--acc);font-weight:700}
.rk .line{display:flex;align-items:center;gap:10px;margin:26px 0 20px}
.rk .line i{display:block;width:64px;height:1.5px;background:var(--acc)}
.rk .line b{width:8px;height:8px;border:1.3px solid var(--acc);transform:rotate(45deg)}
.rk .ov{font-family:EB;font-style:italic;font-size:33px;line-height:1.32;color:#F3E6D8}
.rk .key{position:absolute;right:70px;top:742px;width:300px;height:520px;transform:rotate(9deg);transform-origin:50% 0;filter:drop-shadow(0 18px 22px rgba(0,0,0,.5))}
.rk .ft{position:absolute;left:84px;bottom:66px;font-family:Mon;font-weight:600;font-size:13px;letter-spacing:.4em;color:rgba(233,207,152,.75)}
`;
const keySvg = (yr, acc, pg) => `<svg width="300" height="520" viewBox="0 0 300 520">
<defs><linearGradient id="br" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F6E1A6"/><stop offset=".45" stop-color="#C9A24E"/><stop offset=".7" stop-color="#E8C77A"/><stop offset="1" stop-color="#8E6A24"/></linearGradient>
<linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBF4E6"/><stop offset="1" stop-color="#EADCC2"/></linearGradient></defs>
<!-- key -->
<g transform="translate(150 12)">
 <circle cx="0" cy="34" r="30" fill="none" stroke="url(#br)" stroke-width="13"/>
 <rect x="-7" y="60" width="14" height="138" rx="4" fill="url(#br)"/>
 <path d="M7 160 h26 v10 h-12 v10 h16 v12 h-30z" fill="url(#br)"/>
 <path d="M7 125 h20 v12 h-20z" fill="url(#br)"/>
</g>
<!-- ring + tag -->
<circle cx="150" cy="46" r="13" fill="none" stroke="#B48E3E" stroke-width="4"/>
<g transform="translate(150 40)">
 <path d="M0 0 C 60 30, 108 120, 108 250 C 108 380, 60 450, 0 450 C -60 450, -108 380, -108 250 C -108 120, -60 30, 0 0z" fill="url(#tg)" transform="translate(0 0)"/>
 <path d="M0 14 C 52 42, 94 128, 94 250 C 94 368, 52 436, 0 436 C -52 436, -94 368, -94 250 C -94 128, -52 42, 0 14z" fill="none" stroke="${acc}" stroke-width="2"/>
 <circle cx="0" cy="40" r="11" fill="${pg}" stroke="#B48E3E" stroke-width="3"/>
 <text x="0" y="160" text-anchor="middle" font-family="Mon" font-weight="700" font-size="17" letter-spacing="7" fill="${pg}">ROOM</text>
 <text x="0" y="272" text-anchor="middle" font-family="Roz" font-size="96" fill="${pg}">${yr}</text>
 <path d="M-34 312 h68" stroke="${acc}" stroke-width="2"/>
 <text x="0" y="356" text-anchor="middle" font-family="For" font-size="20" letter-spacing="5" fill="${pg}">HOTEL</text>
 <text x="0" y="382" text-anchor="middle" font-family="For" font-size="20" letter-spacing="5" fill="${pg}">CINEMA</text>
</g></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<div class="sky"></div><div class="bg" style="background-image:url(file://${D}/${s.img});--ih:${s.ih || 1000}px;--bx:${s.x || 50}%"></div><div class="vig"></div>
      <div class="ttl"><div class="kick">${s.kick}</div><div class="scr">${s.scr}</div><div class="gr">${s.gr}</div><div class="h">${s.h}</div>
      <div class="deco"><i></i><b></b><i></i></div><div class="sub">${s.sub}</div></div>`;
    } else {
      cls = 'rk';
      const c = (l, t) => `<div class="c" style="${l};${t}"></div>`;
      body = `<div class="page"></div><div class="b1"></div><div class="b2"></div>
      <div class="hd"><span class="s">Nº ${s.n} / 05</span><span class="m"><b></b>HOTEL CINEMA<b></b></span><span class="s">EST. ${s.yr}</span></div>
      <div class="fr" style="--flt:${s.flt || 'saturate(1.05) contrast(1.04)'}"><div class="im" style="background-image:url(file://${D}/${s.img});background-position:${s.x || 50}% ${s.y || 50}%"></div>
        ${c('left:-14px', 'top:-14px')}${c('right:-14px', 'top:-14px')}${c('left:-14px', 'bottom:-14px')}${c('right:-14px', 'bottom:-14px')}</div>
      <div class="txt" style="--tfs:${s.tfs || 84}px"><div class="loc">${s.loc}</div><div class="t">${s.t}</div>
        <div class="dir">DIR. ${s.dir.toUpperCase()} · <b>${s.yr}</b></div><div class="line"><i></i><b></b><i></i></div><div class="ov">${s.ov}</div></div>
      <div class="key">${keySvg(s.yr, s.acc, s.pg)}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--pg:${s.pg || '#222'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
