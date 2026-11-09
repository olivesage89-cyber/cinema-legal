// "anime that feel like a royal court" — cover: Apothecary Diaries golden palace roofs seen from under the eaves,
// image set low under extended dark-indigo sky; Tenor Sans spaced kicker + gold Pinyon Script 'a royal' + ivory Prata
// wide COURT + EB Garamond italic sub w/ vermilion accent; '05 ANIME · ENTER THE PALACE' footer, grain.
// inside: PALACE CAMEO (per-film lacquer page, 'THE ROYAL COURT / DECREE Nº 0X / 05' header + gold double rule,
// big still in double gilt frame, oval cameo portrait w/ gold rim overlapping lower-right, Pinyon court tag,
// Prata title, Tenor meta, Garamond italic line, gold diamond progress).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Pin', 'pinyon-script', 400), ff('Pr', 'prata', 400), ff('Te', 'tenor-sans', 400), ff('Gar', 'eb-garamond', 400, 'italic'), ff('Gar', 'eb-garamond', 400)].join('');
const grain = `<div class="grain"></div>`;
const GOLD = '#F2C66D', IVORY = '#F7EEDC';
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:0;opacity:.16;mix-blend-mode:overlay;pointer-events:none;z-index:50;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));

function cover(c) {
  const css = `${base}
body{background:#0B1226}
.bg{position:absolute;inset:-60px;background:url(file://${D}/${c.img}) ${c.x}% 20%/cover;filter:blur(38px) brightness(.38) saturate(1.1)}
.bgtint{position:absolute;inset:0;background:linear-gradient(180deg,#0A1024 0%,rgba(10,16,36,.86) 30%,rgba(10,16,36,.2) 60%)}
.im{position:absolute;left:0;top:${c.top}px;width:1080px;height:${1350 - c.top}px;overflow:hidden;
 -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 ${c.fade}px)}
.im img{width:100%;height:100%;object-fit:cover;object-position:${c.x}% 0%;filter:saturate(1.05) contrast(1.03) sepia(.05)}
.bot{position:absolute;left:0;right:0;bottom:0;height:300px;background:linear-gradient(0deg,rgba(8,10,22,.72),rgba(8,10,22,0))}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 60%,rgba(5,8,20,.35) 100%)}
.t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center}
.kick{font-family:Te;font-size:30px;letter-spacing:.42em;color:rgba(247,238,220,.9);padding-left:.42em}
.orn{display:flex;align-items:center;justify-content:center;gap:18px;margin:18px auto 0;width:420px}
.orn i{flex:1;height:1px;background:linear-gradient(90deg,rgba(242,198,109,0),${GOLD})}.orn i:last-child{background:linear-gradient(90deg,${GOLD},rgba(242,198,109,0))}
.orn b{width:11px;height:11px;transform:rotate(45deg);border:1.5px solid ${GOLD}}
.hero{font-family:Pin;font-size:150px;line-height:1;color:${GOLD};margin-top:4px;text-shadow:0 0 34px rgba(242,190,90,.35),0 4px 18px rgba(0,0,0,.5)}
.l2{font-family:Pr;font-size:150px;line-height:.9;letter-spacing:.2em;padding-left:.2em;color:${IVORY};margin-top:-34px;text-shadow:0 6px 30px rgba(0,0,0,.55)}
.sub{font-family:Gar;font-style:italic;font-size:37px;margin-top:20px;color:rgba(247,238,220,.93);text-shadow:0 2px 14px rgba(0,0,0,.7)}
.sub em{color:#FF8A66}
.sw{position:absolute;bottom:54px;right:64px;text-align:right;font-family:Te;font-size:25px;letter-spacing:.38em;color:rgba(247,238,220,.92);text-shadow:0 2px 10px rgba(0,0,0,.6)}
.sw b{font-weight:400;color:${GOLD}}`;
  return `<html><head><style>${css}</style></head><body><div class="bg"></div><div class="bgtint"></div>
<div class="im"><img src="file://${D}/${c.img}"></div><div class="bot"></div><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="hero">${c.h}</div><div class="l2">${c.h2}</div>
<div class="orn"><i></i><b></b><i></i></div><div class="sub">${c.sub}</div></div>
<div class="sw">${c.swipe}</div>${grain}</body></html>`;
}

function card(m, i, n) {
  const P = m.page;
  const css = `${base}
body{background:${P}}
.lac{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 28%,rgba(255,230,180,.10),rgba(0,0,0,0) 55%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%)}
.pat{position:absolute;inset:0;opacity:.06;background-image:radial-gradient(circle at 0 0,transparent 26px,${GOLD} 27px,transparent 28px),radial-gradient(circle at 54px 54px,transparent 26px,${GOLD} 27px,transparent 28px);background-size:54px 54px}
.top{position:absolute;top:52px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font-family:Te;font-size:23px;letter-spacing:.34em;color:rgba(247,238,220,.82)}
.top b{font-weight:400;color:${GOLD}}
.rule{position:absolute;top:96px;left:70px;right:70px;height:6px;border-top:1px solid rgba(242,198,109,.75);border-bottom:1px solid rgba(242,198,109,.35)}
.fr{position:absolute;left:70px;top:140px;width:940px;height:680px}
.fr:before{content:'';position:absolute;inset:-14px;border:1px solid rgba(242,198,109,.55)}
.fr img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;border:3px solid ${GOLD};filter:saturate(1.06) contrast(1.03);box-shadow:0 22px 50px rgba(0,0,0,.45)}
.cm{position:absolute;left:770px;top:680px;width:240px;height:300px;border-radius:50%;padding:7px;background:linear-gradient(145deg,#FBE3A6,#B8862F 45%,#F5D188 70%,#8C6020);box-shadow:0 18px 40px rgba(0,0,0,.55)}
.cm:after{content:'';position:absolute;inset:-12px;border-radius:50%;border:1px solid rgba(242,198,109,.6)}
.cm .sc{width:100%;height:100%;border-radius:50%;overflow:hidden}
.cm img{width:100%;height:100%;object-fit:cover;object-position:${m.cx ?? 50}% ${m.cy ?? 50}%;transform:scale(${m.cz ?? 1});transform-origin:${m.cx ?? 50}% ${m.cy ?? 50}%;filter:saturate(1.05) contrast(1.03)}
.txt{position:absolute;left:70px;width:680px;top:875px;color:${IVORY}}
.tag{font-family:Pin;font-size:56px;color:${GOLD};line-height:1;text-shadow:0 0 20px rgba(242,190,90,.25)}
.ttl{font-family:Pr;font-size:${m.fs || 70}px;line-height:1.06;margin-top:14px;letter-spacing:.005em}
.meta{font-family:Te;font-size:22px;letter-spacing:.3em;color:${GOLD};margin-top:22px}
.line{font-family:Gar;font-style:italic;font-size:38px;line-height:1.3;margin-top:20px;color:rgba(247,238,220,.9);width:${m.lw || 900}px}
.prog{position:absolute;left:0;right:0;bottom:62px;display:flex;justify-content:center;gap:22px}
.prog i{width:12px;height:12px;transform:rotate(45deg);border:1.5px solid rgba(242,198,109,.75)}.prog i.on{background:${GOLD};border-color:${GOLD}}`;
  const pr = Array.from({ length: n }, (_, k) => `<i class="${k === i ? 'on' : ''}"></i>`).join('');
  return `<html><head><style>${css}</style></head><body><div class="pat"></div><div class="lac"></div>
<div class="top"><span>THE ROYAL COURT</span><span>DECREE <b>Nº 0${i + 1}</b> / 0${n}</span></div><div class="rule"></div>
<div class="fr"><img src="file://${D}/${m.img}"></div>
<div class="cm"><div class="sc"><img src="file://${D}/${m.cam}"></div></div>
<div class="txt"><div class="tag">${m.tag}</div><div class="ttl">${m.t}</div><div class="meta">${m.meta}</div><div class="line">${m.ov}</div></div>
<div class="prog">${pr}</div>${grain}</body></html>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const pages = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, i) => [`0${i + 2}_${m.slug}.jpg`, card(m, i, S.movies.length)])];
  for (const [f, html] of pages) {
    if (process.argv[3] && !f.startsWith(process.argv[3])) continue;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
