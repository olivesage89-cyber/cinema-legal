// "anime that make you want to move to the countryside" — cover: Natsume sunset over autumn fields, ice-blue Yellowtail
// 'move to the' + cream Zen Old Mincho wide caps COUNTRYSIDE + Zen Kaku kicker + Crimson Pro italic sub, vermilion 田舎 hanko.
// Inside: STATION SIGN — per-film deep page, big rounded still with platform-number badge, white Japanese rural
// station nameboard (Japanese title, Zen Old Mincho English title, accent band with ◀ prev / next ▶ films and number
// circle, dir/kind/year row) on two posts, Crimson Pro italic line between the posts.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = 'file://' + path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const links = ['yellowtail/400.css','zen-old-mincho/400.css','zen-old-mincho/700.css','zen-kaku-gothic-new/500.css','zen-kaku-gothic-new/700.css',
  'crimson-pro/400-italic.css','crimson-pro/500-italic.css','inter/500.css','inter/600.css'].map(x => `<link rel="stylesheet" href="${F}${x}">`).join('');
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#1a120e;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.17;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.34) 100%);pointer-events:none}
/* cover */
.cimg{position:absolute;top:0;height:1350px;left:var(--l);filter:saturate(1.04) contrast(1.02)}
.ctop{position:absolute;left:0;right:0;top:0;height:640px;background:linear-gradient(180deg,rgba(60,22,20,.38),rgba(60,22,20,0))}
.cbot{position:absolute;left:0;right:0;bottom:0;height:420px;background:linear-gradient(0deg,rgba(25,10,6,.55),rgba(25,10,6,0))}
.ctxt{position:absolute;left:30px;right:30px;top:var(--top);text-align:center}
.kick{font-family:'Zen Kaku Gothic New';font-weight:700;font-size:23px;letter-spacing:.46em;margin-left:.46em;color:#FFF4E8;text-shadow:0 1px 12px rgba(60,20,10,.45)}
.mv{font-family:Yellowtail;font-size:132px;line-height:1;color:var(--ink);margin-top:34px;position:relative;z-index:2;text-shadow:0 3px 22px rgba(70,25,15,.5)}
.cs{font-family:'Zen Old Mincho';font-weight:700;font-size:104px;line-height:1;letter-spacing:.13em;margin-left:.13em;color:#FFF4E6;margin-top:-6px;text-shadow:0 4px 36px rgba(70,25,15,.45)}
.csub{font-family:'Crimson Pro';font-style:italic;font-weight:500;font-size:38px;color:#FFF4E6;margin-top:26px;text-shadow:0 2px 14px rgba(70,25,15,.6)}
.hanko{position:absolute;left:66px;bottom:66px;width:74px;height:74px;border-radius:8px;background:#C8392B;color:#FBEDE2;font-family:'Zen Old Mincho';font-weight:700;font-size:30px;line-height:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;box-shadow:0 0 0 3px rgba(251,237,226,.0),inset 0 0 0 3px #FBEDE2;transform:rotate(-4deg);opacity:.93}
.swipe{position:absolute;bottom:88px;right:66px;font-family:'Zen Kaku Gothic New';font-weight:700;font-size:17px;letter-spacing:.46em;color:#FFF4E8;opacity:.78}
/* inside */
.page{position:absolute;inset:0;background:var(--bg)}
.page:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 100%,rgba(255,255,255,.06),rgba(0,0,0,0) 60%)}
.still{position:absolute;left:54px;top:54px;width:972px;height:668px;border-radius:20px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.35)}
.still img{width:100%;height:100%;object-fit:cover;filter:saturate(1.0) contrast(1.0)}
.still:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(0,0,0,.22) 100%)}
.badge{position:absolute;left:84px;top:84px;display:flex;align-items:center;gap:14px;z-index:3}
.bn{width:62px;height:62px;border-radius:50%;background:#FBF8F1;border:5px solid var(--acc);display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:600;font-size:26px;color:#1d1d1d}
.bl{font-family:'Zen Kaku Gothic New';font-weight:700;font-size:16px;letter-spacing:.32em;color:#FFF8EE;background:rgba(20,16,12,.55);padding:9px 12px 9px 16px;border-radius:30px;backdrop-filter:blur(4px)}
.post{position:absolute;top:1040px;bottom:0;width:20px;background:linear-gradient(90deg,#2b2b2b,#4a4a4a 45%,#262626);box-shadow:0 0 20px rgba(0,0,0,.3)}
.sign{position:absolute;left:84px;right:84px;top:762px;height:300px;background:#FBF9F3;border-radius:10px;box-shadow:0 20px 40px rgba(0,0,0,.38);overflow:hidden}
.sign:before{content:'';position:absolute;inset:10px;border:2px solid #d9d4c7;border-radius:5px;pointer-events:none}
.jp{position:absolute;top:30px;left:0;right:0;text-align:center;font-family:'Zen Kaku Gothic New';font-weight:500;font-size:30px;letter-spacing:.32em;margin-left:.16em;color:#4a4642}
.en{position:absolute;top:72px;left:20px;right:20px;height:96px;display:flex;align-items:center;justify-content:center;text-align:center;font-family:'Zen Old Mincho';font-weight:700;font-size:var(--ts);line-height:1;color:#1f1c1a;letter-spacing:.01em}
.band{position:absolute;left:0;right:0;top:180px;height:62px;background:var(--acc);display:flex;align-items:center;justify-content:space-between;padding:0 34px;font-family:'Zen Kaku Gothic New';font-weight:700;font-size:20px;letter-spacing:.14em;color:#FFFDF8}
.band .c{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:76px;height:76px;border-radius:50%;background:#FBF9F3;border:6px solid var(--acc);display:flex;align-items:center;justify-content:center;font-family:Inter;font-weight:600;font-size:24px;color:#1f1c1a}
.row{position:absolute;left:34px;right:34px;top:256px;display:flex;justify-content:space-between;font-family:Inter;font-weight:500;font-size:15px;letter-spacing:.26em;color:#6d675f}
.line{position:absolute;left:150px;right:150px;top:1112px;text-align:center;font-family:'Crimson Pro';font-style:italic;font-weight:400;font-size:37px;line-height:1.28;color:#F8F1E6;opacity:.95}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [k, s] of S.entries()) {
    let body;
    if (s.type === 'cover') {
      body = `<div style="--ink:${s.ink};--l:${s.l}px;--top:${s.top}px"><img class="cimg" src="file://${D}/${s.img}"><div class="ctop"></div><div class="cbot"></div><div class="vig"></div>
      <div class="ctxt"><div class="kick">${s.kick}</div><div class="mv">${s.a}</div><div class="cs">${s.b}</div><div class="csub">${s.sub}</div></div>
      <div class="hanko"><span>田</span><span>舎</span></div><div class="swipe">SWIPE →</div></div>`;
    } else {
      const n = String(k).padStart(2, '0');
      body = `<div style="--bg:${s.bg};--acc:${s.acc};--ts:${s.ts}px"><div class="page"></div>
      <div class="still"><img src="file://${D}/${s.i}" style="object-position:${s.x}% ${s.y}%"></div>
      <div class="badge"><div class="bn">${k}</div><div class="bl">STOP ${k} OF 5</div></div>
      <div class="post" style="left:250px"></div><div class="post" style="right:250px"></div>
      <div class="sign"><div class="jp">${s.jp}</div><div class="en">${s.t}</div>
        <div class="band"><span>◀ ${s.prev.toUpperCase()}</span><div class="c">${n}</div><span>${s.next.toUpperCase()} ▶</span></div>
        <div class="row"><span>DIR. ${s.dir.toUpperCase()}</span><span>${s.kind} · ${s.yr}</span></div></div>
      <div class="line">${s.ov}</div><div class="vig"></div></div>`;
    }
    const html = `<html><head>${links}<style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
