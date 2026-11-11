// "FRONTIER WINTER" look — cover: full-bleed snowy still, Victorian woodtype (Holtwood One SC) in deep spruce,
// Mr De Haviland script in ember, IM Fell DW Pica italic sub, Archivo Narrow spaced kicker, cold grade + grain.
// Inside: "SNOW ALMANAC" — cold bone paper page, Nº header, big still + row of 3 small stills, woodtype title in a
// per-film ink, Fell italic meta + line, spaced place/date footer with a star rule.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const noise = (o, f = .9) => `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='${f}' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='${o}'/></svg>")`;
const css = [
  ff('Wood', 'holtwood-one-sc', 400), ff('Script', 'mr-de-haviland', 400),
  ff('Fell', 'im-fell-dw-pica', 400), ff('Fell', 'im-fell-dw-pica', 400, 'italic'),
  ff('Narrow', 'archivo-narrow', 500), ff('Narrow', 'archivo-narrow', 600), ff('Narrow', 'archivo-narrow', 700),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#E9ECE8}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.22;mix-blend-mode:overlay;background-image:${noise(1)};pointer-events:none}
/* cover */
.cv .bgb{position:absolute;inset:-40px;background-size:cover;background-position:50% 0;filter:blur(22px) contrast(1.02) brightness(1.02)}
.cv .bg{position:absolute;bottom:0;-webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,0) 0,#000 26%);filter:contrast(1.05) saturate(.92) brightness(.98) sepia(.06)}
.cv .sky{position:absolute;left:0;right:0;top:0;height:640px;background:linear-gradient(180deg,rgba(228,226,224,.78) 0%,rgba(226,224,222,.45) 55%,rgba(226,224,222,0) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(20,24,30,.38) 100%)}
.cv .txt{position:absolute;left:0;right:0;text-align:center;color:#0E4B50}
.kick{font-family:Narrow;font-weight:700;font-size:22px;letter-spacing:.56em;padding-left:.56em;color:#1E2A2E;opacity:.88}
.scr{font-family:Script;font-size:128px;line-height:.7;color:#C9531F;position:relative;z-index:2;margin-top:36px;text-shadow:0 2px 14px rgba(255,245,235,.6)}
.big{font-family:Wood;font-size:146px;line-height:.92;letter-spacing:.02em;color:#0E4B50;margin-top:-6px;text-shadow:0 3px 22px rgba(255,255,255,.35)}
.big2{font-family:Wood;font-size:66px;letter-spacing:.42em;padding-left:.42em;color:#0E4B50;margin-top:8px}
.rule{display:flex;align-items:center;justify-content:center;gap:16px;margin-top:22px;color:#C9531F;font-size:22px}
.rule i{display:block;width:150px;height:1.5px;background:#0E4B50;opacity:.55}
.sub{font-family:Fell;font-style:italic;font-size:36px;color:#1E2A2E;margin-top:14px}
.foot{position:absolute;left:0;right:0;bottom:50px;text-align:center;font-family:Narrow;font-weight:700;font-size:20px;letter-spacing:.42em;padding-left:.42em;color:#1E2A2E;text-shadow:0 1px 10px rgba(255,255,255,.6)}
/* almanac page */
.pg{position:absolute;inset:0;background:#EDEFEA}
.pg:before{content:'';position:absolute;inset:0;background-image:${noise(.5, .7)};mix-blend-mode:multiply;opacity:.35}
.pg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,255,255,.4),rgba(160,170,175,.22) 100%)}
.frame{position:absolute;inset:30px;border:1.5px solid rgba(30,42,46,.45)}
.frame:after{content:'';position:absolute;inset:6px;border:.8px solid rgba(30,42,46,.3)}
.hdr{position:absolute;left:66px;right:66px;top:66px;display:flex;justify-content:space-between;align-items:baseline;font-family:Narrow;font-weight:700;font-size:20px;letter-spacing:.34em;color:#1E2A2E}
.hdr .n{font-family:Wood;font-size:30px;letter-spacing:.06em}
.im{position:absolute;overflow:hidden;box-shadow:0 1px 0 rgba(0,0,0,.08)}
.im img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.04) saturate(.9) sepia(.05)}
.im:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(0,0,0,.18)}
.main{left:66px;top:122px;width:948px;height:560px}
.sm{top:702px;width:302px;height:180px}
.title{position:absolute;left:66px;right:66px;top:922px;font-family:Wood;line-height:1.02;letter-spacing:.01em}
.meta{position:absolute;left:66px;right:66px;font-family:Fell;font-size:30px;color:#1E2A2E}
.meta em{font-style:italic}
.srule{position:absolute;left:66px;width:948px;display:flex;align-items:center;gap:14px;font-size:18px}
.srule i{flex:1;height:1.2px;opacity:.55}
.line{position:absolute;left:66px;right:66px;font-family:Fell;font-style:italic;font-size:36px;line-height:1.24;color:#1E2A2E}
.place{position:absolute;left:66px;right:66px;bottom:60px;display:flex;justify-content:space-between;font-family:Narrow;font-weight:600;font-size:18px;letter-spacing:.3em;color:#4A565A}
/* end */
.end{position:absolute;inset:-60px;background-size:cover;background-position:60% 40%;filter:blur(30px) brightness(.9) saturate(.9)}
.phone{position:absolute;left:50%;top:50%;height:1180px;transform:translate(-50%,-50%);filter:drop-shadow(0 30px 60px rgba(0,0,0,.5))}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const star = c => `<span style="color:${c}">✦</span>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    if (process.argv[3] && !s.file.startsWith(process.argv[3])) continue;
    let body;
    if (s.type === 'cover') body = `<div class="cv"><div class="bgb" style="background-image:url(file://${D}/${s.img})"></div><img class="bg" src="file://${D}/${s.img}" style="height:${s.ih}px;left:${s.il}px"><div class="sky"></div><div class="vig"></div>
      <div class="txt" style="top:${s.top}px"><div class="kick">${s.kick}</div><div class="scr">${s.h}</div><div class="big">${s.h2}</div><div class="big2">${s.h3}</div>
      <div class="rule"><i></i>✦<i></i></div><div class="sub">${s.sub}</div></div>
      <div class="foot">${s.foot}</div></div><div class="grain"></div>`;
    else if (s.type === 'end') body = `<div class="end" style="background-image:url(file://${D}/${s.img})"></div><img class="phone" src="file://${D}/phone.png"><div class="grain" style="opacity:.12"></div>`;
    else {
      const tl = s.tl || 1, tb = 922 + tl * s.fs * 1.02;
      body = `<div class="pg"></div><div class="frame"></div>
      <div class="hdr"><span class="n" style="color:${s.ink}">Nº ${s.n}</span><span>A FRONTIER WINTER</span></div>
      <div class="im main"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div>
      ${s.sm.map((f, i) => `<div class="im sm" style="left:${66 + i * 323}px"><img src="file://${D}/${f}" style="object-position:${(s.smx || [])[i] ?? 50}% 50%"></div>`).join('')}
      <div class="title" style="font-size:${s.fs}px;color:${s.ink}">${s.t}</div>
      <div class="meta" style="top:${tb + 14}px"><em>${s.yr}</em> &nbsp;·&nbsp; directed by ${s.dir}</div>
      <div class="srule" style="top:${tb + 66}px;color:${s.ink}"><i style="background:${s.ink}"></i>✦<i style="background:${s.ink}"></i></div>
      <div class="line" style="top:${tb + 98}px">${s.ov}</div>
      <div class="place"><span>${s.where}</span><span>${s.when}</span></div>
      <div class="grain" style="opacity:.14"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
