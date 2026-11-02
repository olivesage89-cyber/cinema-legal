// "movies that feel like the edge of the world" — cover: Ryan's Daughter woman on the sea wall under a stormy violet-pink
// sky (Dingle coast), full-bleed 4:5 crop; Work Sans spaced kicker + cream Mrs Saint Delafield 'the' + giant sea-glass
// Cinzel EDGE + spaced Cinzel 'OF THE WORLD' + lighthouse-beam rule + Lora italic sub, top-centred in the sky, grain.
// Inside: SHIPPING FORECAST (per-film deep sea page, mono forecast header, big still w/ foam hairline, wave rule,
// SEA AREA caps, Cinzel title, Work Sans dir·year, Lora italic line, tilted white print w/ 2nd still + script caption,
// mono forecast block WIND/SEA/WEATHER/VISIBILITY, compass rose).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Cin', 'cinzel', 500), ff('Cin', 'cinzel', 600), ff('Cin', 'cinzel', 700), ff('Mrs', 'mrs-saint-delafield', 400),
  ff('WS', 'work-sans', 500), ff('WS', 'work-sans', 600), ff('Lora', 'lora', 400, 'italic'), ff('Lora', 'lora', 500, 'italic'),
  ff('Mono', 'ibm-plex-mono', 400), ff('Mono', 'ibm-plex-mono', 500),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
/* cover */
.cv{background:#1A1F2C}
.cv .bg{position:absolute;inset:0;background-size:auto 100%;background-position:var(--bx,50%) 50%;filter:saturate(1.05) contrast(1.08) brightness(.95)}
.cv .top{position:absolute;inset:0;background:linear-gradient(180deg,rgba(14,16,30,.5) 0,rgba(14,16,30,.18) 38%,rgba(0,0,0,0) 55%,rgba(0,0,0,.25) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 50%,rgba(0,0,0,.45) 100%)}
.cv .ttl{position:absolute;left:0;right:0;top:74px;text-align:center}
.cv .kick{font-family:WS;font-weight:600;font-size:21px;letter-spacing:.6em;padding-left:.6em;color:#F4ECE4}
.cv .scr{font-family:Mrs;font-size:150px;line-height:.6;color:#F4ECE4;margin:38px 0 -34px -330px;position:relative;z-index:2;text-shadow:0 3px 18px rgba(0,0,0,.5)}
.cv .h{font-family:Cin;font-weight:600;font-size:250px;line-height:.9;color:var(--acc);letter-spacing:.08em;padding-left:.08em;
  text-shadow:0 8px 44px rgba(10,12,30,.55),0 0 80px rgba(200,240,224,.18)}
.cv .h2{font-family:Cin;font-weight:500;font-size:50px;letter-spacing:.52em;padding-left:.52em;color:#F4ECE4;margin-top:6px;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.cv .beam{display:flex;align-items:center;justify-content:center;gap:0;margin:28px auto 20px}
.cv .beam i{display:block;width:170px;height:1.5px}
.cv .beam i:first-child{background:linear-gradient(90deg,transparent,var(--acc))}
.cv .beam i:last-child{background:linear-gradient(270deg,transparent,var(--acc))}
.cv .sub{font-family:Lora;font-style:italic;font-size:35px;color:#F4ECE4;text-shadow:0 2px 14px rgba(0,0,0,.7)}
.cv .sub b{font-weight:400;color:var(--acc)}
.cv .sw{position:absolute;left:0;right:0;bottom:56px;text-align:center;font-family:Mono;font-size:17px;letter-spacing:.42em;padding-left:.42em;color:rgba(244,236,228,.85)}
/* inside: shipping forecast */
.sf{background:var(--pg)}
.sf .page{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.07),rgba(255,255,255,0) 55%),radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.42) 100%)}
.sf .hd{position:absolute;left:60px;right:60px;top:52px;display:flex;justify-content:space-between;align-items:baseline;font-family:Mono;font-weight:500;font-size:15px;letter-spacing:.3em;color:rgba(234,240,236,.72)}
.sf .hd .m{font-family:Mrs;font-size:58px;letter-spacing:0;color:var(--acc);line-height:.5;transform:translateY(8px)}
.sf .im{position:absolute;left:60px;top:104px;width:960px;height:610px;background-size:cover;filter:var(--flt,saturate(1.04) contrast(1.05));box-shadow:0 20px 50px rgba(0,0,0,.4)}
.sf .im:after{content:'';position:absolute;inset:12px;border:1px solid rgba(240,248,244,.55)}
.sf .wave{position:absolute;left:60px;top:740px;width:960px;height:20px}
.sf .txt{position:absolute;left:66px;width:590px;top:790px;color:#EEF2EE}
.sf .area{font-family:Mono;font-weight:500;font-size:16px;letter-spacing:.28em;color:var(--acc)}
.sf .t{font-family:Cin;font-weight:700;font-size:var(--tfs,66px);line-height:1.02;margin-top:16px;color:#F6F3EC;letter-spacing:.02em}
.sf .dir{font-family:WS;font-weight:600;font-size:16px;letter-spacing:.3em;margin-top:18px;color:rgba(238,242,238,.7)}
.sf .dir b{color:var(--acc);font-weight:600}
.sf .ov{font-family:Lora;font-style:italic;font-size:33px;line-height:1.34;color:#EEF2EE;margin-top:26px}
.sf .pr{position:absolute;right:62px;top:780px;width:330px;background:#F5F1E8;padding:14px 14px 0;transform:rotate(var(--rot,3deg));box-shadow:0 18px 30px rgba(0,0,0,.45)}
.sf .pr .p{width:302px;height:210px;background-size:cover;filter:saturate(1.02) contrast(1.04)}
.sf .pr .cap{font-family:Mrs;font-size:44px;color:#2A2E3A;text-align:center;height:62px;line-height:66px;white-space:nowrap}
.sf .fc{position:absolute;right:62px;top:1110px;width:340px;font-family:Mono;font-size:15px;line-height:1.75;color:rgba(238,242,238,.82)}
.sf .fc div{display:flex;gap:12px;border-bottom:1px dashed rgba(238,242,238,.22)}
.sf .fc span{display:inline-block;width:112px;color:var(--acc);letter-spacing:.16em;font-weight:500}
.sf .rose{position:absolute;left:62px;bottom:52px;width:58px;height:58px;opacity:.8}
.sf .ft{position:absolute;left:136px;bottom:66px;font-family:Mono;font-size:13px;letter-spacing:.32em;color:rgba(238,242,238,.5)}
`;
const wave = acc => `<svg class="wave" viewBox="0 0 960 20" preserveAspectRatio="none"><path d="M0 10 ${Array.from({ length: 24 }, (_, i) => `Q ${i * 40 + 10} ${i % 2 ? 18 : 2} ${i * 40 + 20} 10 T ${i * 40 + 40} 10`).join(' ')}" fill="none" stroke="${acc}" stroke-width="1.6" opacity=".75"/></svg>`;
const rose = acc => `<svg class="rose" viewBox="-30 -30 60 60"><circle r="26" fill="none" stroke="${acc}" stroke-width="1"/><circle r="19" fill="none" stroke="${acc}" stroke-width=".6" stroke-dasharray="1.5 2.5"/>
<path d="M0-28 L4-4 L0 0 L-4-4Z" fill="${acc}"/><path d="M0 28 L4 4 L0 0 L-4 4Z" fill="none" stroke="${acc}" stroke-width=".9"/><path d="M28 0 L4 4 L0 0 L4-4Z" fill="none" stroke="${acc}" stroke-width=".9"/><path d="M-28 0 L-4 4 L0 0 L-4-4Z" fill="none" stroke="${acc}" stroke-width=".9"/>
<text x="0" y="-31" text-anchor="middle" font-family="Mono" font-size="7" fill="${acc}">N</text></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<div class="bg" style="background-image:url(file://${D}/${s.img});--bx:${s.x || 50}%"></div><div class="top"></div><div class="vig"></div>
      <div class="ttl"><div class="kick">${s.kick}</div><div class="scr">${s.scr}</div><div class="h">${s.h}</div><div class="h2">${s.h2}</div>
      <div class="beam"><i></i><i></i></div><div class="sub">${s.sub}</div></div><div class="sw">${s.sw}</div>`;
    } else {
      cls = 'sf';
      body = `<div class="page"></div>
      <div class="hd"><span>SHIPPING FORECAST</span><span class="m">the edge of the world</span><span>Nº ${s.n} / 05</span></div>
      <div class="im" style="background-image:url(file://${D}/${s.img});background-position:${s.x || 50}% ${s.y || 50}%;--flt:${s.flt || 'saturate(1.04) contrast(1.05)'}"></div>
      ${wave(s.acc)}
      <div class="txt" style="--tfs:${s.tfs || 66}px"><div class="area">SEA AREA · ${s.area}</div><div class="t">${s.t}</div>
        <div class="dir">DIR. ${s.dir.toUpperCase()} · <b>${s.yr}</b></div><div class="ov">${s.ov}</div></div>
      <div class="pr" style="--rot:${s.rot || 3}deg"><div class="p" style="background-image:url(file://${D}/${s.img2});background-position:${s.x2 || 50}% ${s.y2 || 50}%"></div><div class="cap">${s.cap}</div></div>
      <div class="fc">${s.fc.map(([k, v]) => `<div><span>${k}</span>${v}</div>`).join('')}</div>
      ${rose(s.acc)}<div class="ft">${s.ft}</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--pg:${s.pg || '#222'}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
