// "PAGE-A-DAY CALENDAR" look: tear-off desk calendar pad on sage-mist paper. Cover = hook on the pad.
// Usage: node render_ordinary.js WORKDIR  (reads WORKDIR/slides.json -> WORKDIR/out/*.jpg)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const SAGE = '#3F5A48', ROSE = '#B8405F', PAPER = '#DCE3D3', PAD = '#F8F4EA', INK = '#2A2A26';
const css = [ff('Bask', 'libre-baskerville', 400), ff('Bask', 'libre-baskerville', 700), ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 600, 'italic'),
  ff('Goth', 'league-gothic', 400), ff('Work', 'work-sans', 500), ff('Work', 'work-sans', 600), ff('Hand', 'shadows-into-light', 400)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:${PAPER};position:relative;font-family:Bask;color:${INK}}
.paperglow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.45),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(40,60,45,.16) 100%)}
.grain{position:absolute;inset:0;opacity:.20;mix-blend-mode:multiply;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.label{position:absolute;top:44px;width:100%;text-align:center;font-family:Work;font-weight:600;font-size:21px;letter-spacing:.52em;color:${SAGE};padding-left:.52em}
.label span{display:inline-block;width:46px;height:1.5px;background:${SAGE};vertical-align:middle;margin:0 22px 4px;opacity:.6}
.stack{position:absolute;left:78px;width:924px;top:122px;bottom:62px;border-radius:14px;background:#EDE7DA;box-shadow:0 2px 0 rgba(0,0,0,.04)}
.stack.s1{transform:translate(9px,10px) rotate(.9deg);background:#E6DFD0}
.stack.s2{transform:translate(4px,5px) rotate(.35deg)}
.pad{position:absolute;left:78px;width:924px;top:122px;bottom:62px;border-radius:14px;background:${PAD};overflow:hidden;
  box-shadow:0 26px 50px -18px rgba(30,45,35,.38),0 6px 14px rgba(30,45,35,.10)}
.pad:after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,0) 70%,rgba(120,100,60,.06))}
.head{position:absolute;left:0;right:0;top:0;height:132px;background:var(--ink);color:${PAD};display:flex;align-items:flex-end;justify-content:space-between;padding:0 44px 20px}
.head .day{font-family:Goth;font-size:84px;line-height:.8;letter-spacing:.05em}
.head .no{font-family:Work;font-weight:600;font-size:20px;letter-spacing:.32em;opacity:.85;padding-bottom:8px}
.perf{position:absolute;left:18px;right:18px;top:144px;height:8px;background-image:radial-gradient(circle,rgba(60,60,50,.22) 3px,transparent 3.6px);background-size:22px 8px}
.rings{position:absolute;top:100px;left:0;right:0;height:60px;z-index:5}
.ring{position:absolute;top:0;width:30px;height:58px;border-radius:15px;border:7px solid #B9B7AE;border-bottom-color:transparent;box-shadow:inset 0 2px 2px rgba(255,255,255,.6),0 3px 4px rgba(0,0,0,.18);background:transparent}
.hole{position:absolute;top:36px;width:22px;height:22px;border-radius:50%;background:#55634F;box-shadow:inset 0 3px 4px rgba(0,0,0,.5)}
.week{position:absolute;left:44px;right:44px;bottom:34px;display:flex;justify-content:space-between;align-items:center;border-top:1.5px solid rgba(42,42,38,.16);padding-top:20px}
.week .d{position:relative;font-family:Work;font-weight:600;font-size:21px;letter-spacing:.3em;color:rgba(42,42,38,.42);width:120px;text-align:center;padding-left:.3em}
.week .d.on{color:var(--ink)}
.week .d svg{position:absolute;left:50%;top:50%;transform:translate(-50%,-52%);overflow:visible}
.still{position:absolute;overflow:hidden;border-radius:8px}
.still img{width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(.95) sepia(.10) brightness(1.02)}
.still:after{content:'';position:absolute;inset:0;border-radius:8px;box-shadow:inset 0 0 0 1px rgba(0,0,0,.10);background:linear-gradient(180deg,rgba(255,240,215,.06),rgba(60,40,20,.06))}
.tape{position:absolute;width:118px;height:34px;background:rgba(232,220,180,.78);box-shadow:0 1px 2px rgba(0,0,0,.08);z-index:3}
`;
const circle = (w, h, c) => `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><path d="M${w*.52} ${h*.06} C ${w*.95} ${h*.02}, ${w*1.0} ${h*.85}, ${w*.5} ${h*.95} C ${w*.05} ${h*.98}, ${w*-.02} ${h*.2}, ${w*.42} ${h*.08} L ${w*.62} ${h*.12}" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/></svg>`;
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI'];
const week = (on, c) => `<div class="week">${DAYS.map((d, i) => `<div class="d ${i === on ? 'on' : ''}">${d}${i === on ? circle(118, 62, c) : ''}</div>`).join('')}</div>`;
const frame = (inner, ink) => `<div class="paperglow"></div><div class="label"><span></span>MOVIE HIDDEN GEMS<span></span></div>
<div class="stack s1"></div><div class="stack s2"></div><div class="pad" style="--ink:${ink}">${inner}</div>
<div class="rings">${[300, 750].map(x => `<div class="hole" style="left:${x - 11 + 15}px;top:46px"></div><div class="ring" style="left:${x}px"></div>`).join('')}</div><div class="grain"></div>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = frame(`<div class="head"><div class="day">ANY ORDINARY DAY</div><div class="no">Nº 05</div></div><div class="perf"></div>
<div style="position:absolute;left:0;right:0;top:150px;bottom:110px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:0 70px">
 <div style="font-family:Work;font-weight:600;font-size:22px;letter-spacing:.42em;color:${SAGE};margin-bottom:30px;padding-left:.42em">MOVIES THAT TEACH YOU</div>
 <div style="font-family:Bask;font-size:72px;line-height:1.1;color:${INK};letter-spacing:-.01em">an</div>
 <div style="font-family:Bask;font-style:italic;font-weight:600;font-size:156px;line-height:1.0;color:${ROSE};letter-spacing:-.025em;margin:-2px 0 6px">ordinary</div>
 <div style="font-family:Bask;font-size:72px;line-height:1.18;color:${INK};letter-spacing:-.012em">day is the<br>whole point.</div>
 <div style="width:120px;height:2px;background:${SAGE};opacity:.45;margin:46px 0 30px"></div>
 <div style="font-family:Work;font-weight:600;font-size:18px;letter-spacing:.34em;color:${SAGE};opacity:.85;margin-bottom:12px;padding-left:.34em">TODAY'S PLAN</div>
 <div style="font-family:Hand;font-size:42px;line-height:1.25;color:${SAGE};transform:rotate(-1.5deg);text-align:left">☑ notice the light<br>☑ make the coffee slowly<br>☐ watch these five</div>
</div>
<div class="week" style="justify-content:center;gap:0"><div style="font-family:Work;font-weight:600;font-size:21px;letter-spacing:.34em;color:${INK};opacity:.7;padding-left:.34em">05 FILMS &nbsp;·&nbsp; MON — FRI &nbsp;·&nbsp; SWIPE →</div></div>`, SAGE);
    } else {
      const i = s.i;
      body = frame(`<div class="head"><div class="day">${s.day}</div><div class="no">DAY 0${i + 1} / 05</div></div><div class="perf"></div>
<div class="still" style="left:40px;right:40px;top:176px;height:470px"><img src="file://${D}/${s.a}" style="object-position:${s.ax ?? 50}% ${s.ay ?? 50}%"></div>
<div style="position:absolute;left:44px;width:500px;top:678px">
  <div style="font-family:Work;font-weight:600;font-size:18px;letter-spacing:.34em;color:${s.ink}">${s.tag}</div>
  <div style="font-family:Bask;font-weight:700;font-size:${s.fs || 56}px;line-height:1.06;color:${s.ink};margin-top:14px;letter-spacing:-.015em">${s.t}</div>
  <div style="font-family:Bask;font-style:italic;font-size:28px;color:${INK};opacity:.75;margin-top:10px">(${s.yr}) &nbsp;<span style="font-style:normal;font-family:Work;font-weight:600;font-size:17px;letter-spacing:.26em">DIR. ${s.dir.toUpperCase()}</span></div>
  <div style="font-family:Bask;font-style:italic;font-size:28px;line-height:1.42;color:${INK};margin-top:18px">${s.ov}</div>
  <div style="font-family:Hand;font-size:36px;line-height:1.2;color:${s.ink};margin-top:20px;transform:rotate(-1deg);transform-origin:left">${s.note}</div>
</div>
<div class="still" style="left:580px;width:304px;top:704px;height:300px;transform:rotate(1.6deg);box-shadow:0 8px 16px -8px rgba(0,0,0,.35);border:7px solid #fff;border-radius:4px"><img src="file://${D}/${s.b}" style="object-position:${s.bx ?? 50}% 50%"></div>
<div class="tape" style="left:672px;top:684px;transform:rotate(-4deg)"></div>
${week(i, s.ink)}`, s.ink);
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
