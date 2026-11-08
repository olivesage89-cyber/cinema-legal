// motion_scene — "movies about brothers": cover = golden raft sky w/ deep-teal Gloock + burnt-orange Yellowtail;
// inside = SIDE BY SIDE (linen page, wide still + two stills side by side, brothers' names line, Gloock title).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Gloock', 'gloock', 400), ff('Tail', 'yellowtail', 400), ff('Work', 'work-sans', 500), ff('Work', 'work-sans', 600),
  ff('Lora', 'lora', 500, 'italic'), ff('Lora', 'lora', 600, 'italic')].join('');
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const TEAL = '#0F4A52', ORANGE = '#D2591F';
const base = `${fonts}*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.grade{filter:saturate(.85) contrast(.95) sepia(.12) brightness(1.02)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const img = (f, pos = '50% 50%') => `<img class="grade" src="file://${D}/${f}" style="width:100%;height:100%;object-fit:cover;object-position:${pos};display:block">`;

function cover(s) {
  return `<style>${base}
  .bg{position:absolute;inset:0}
  .haze{position:absolute;inset:0;background:linear-gradient(180deg,rgba(250,238,214,.55) 0%,rgba(250,238,214,.38) 30%,rgba(250,238,214,0) 52%)}
  .warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,190,110,.08),rgba(210,89,31,.10));mix-blend-mode:soft-light}
  .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 60%,rgba(40,20,0,.28) 100%)}
  .t{position:absolute;left:0;right:0;top:${s.ty}px;text-align:center;color:${TEAL}}
  .kick{font-family:Work;font-weight:600;font-size:25px;letter-spacing:.5em;padding-left:.5em}
  .rule{width:90px;height:2px;background:${TEAL};margin:22px auto 4px;opacity:.7}
  .h{font-family:Gloock;font-size:206px;line-height:1;letter-spacing:-.01em;margin-top:6px}
  .scr{font-family:Tail;font-size:84px;color:${ORANGE};transform:rotate(-5deg);margin-top:-34px;margin-left:220px;line-height:1}
  .sub{font-family:Lora;font-style:italic;font-weight:500;font-size:38px;margin-top:26px;color:#2A3A3A}
  .foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Work;font-weight:600;font-size:21px;letter-spacing:.45em;color:#FFF3E2;text-shadow:0 1px 12px rgba(0,0,0,.45)}
  </style><div class="bg">${img(s.img, s.pos)}</div><div class="haze"></div><div class="warm"></div><div class="vig"></div>
  <div class="t"><div class="kick">${s.kick}</div><div class="h">${s.h}</div><div class="scr">${s.scr}</div><div class="sub">${s.sub}</div></div>
  <div class="foot">05 FILMS &nbsp;·&nbsp; SWIPE →</div><div class="grain"></div>`;
}

function film(s, i, n) {
  const dots = Array.from({ length: n }, (_, k) => `<span style="background:${k === i ? ORANGE : 'transparent'};border-color:${k === i ? ORANGE : '#B9AE9C'}"></span>`).join('');
  return `<style>${base}
  body{background:#F2EADD}
  .paper{position:absolute;inset:0;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,.5),rgba(255,255,255,0) 60%),radial-gradient(ellipse at 80% 90%,rgba(170,140,100,.18),rgba(0,0,0,0) 60%)}
  .hdr{position:absolute;top:50px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Work;font-weight:600;font-size:19px;letter-spacing:.38em;color:${TEAL}}
  .hr{position:absolute;top:92px;left:64px;right:64px;height:1.5px;background:${TEAL};opacity:.35}
  .main{position:absolute;top:122px;left:64px;width:952px;height:540px;overflow:hidden;box-shadow:0 6px 20px rgba(60,40,20,.18)}
  .sm{position:absolute;top:684px;width:466px;height:262px;overflow:hidden;box-shadow:0 6px 18px rgba(60,40,20,.16)}
  .names{position:absolute;top:978px;left:64px;right:64px;font-family:Work;font-weight:600;font-size:20px;letter-spacing:.3em;color:${s.ink}}
  .title{position:absolute;top:1010px;left:60px;right:64px;font-family:Gloock;font-size:${s.fs || 92}px;line-height:1.02;color:#1F2322}
  .line{position:absolute;top:${s.ly || 1122}px;left:64px;right:64px;font-family:Tail;font-size:46px;line-height:1.15;color:${ORANGE}}
  .foot{position:absolute;bottom:50px;left:64px;right:64px;display:flex;justify-content:space-between;align-items:center;font-family:Work;font-weight:500;font-size:19px;letter-spacing:.3em;color:#5C5850}
  .dots span{display:inline-block;width:12px;height:12px;border-radius:50%;border:1.5px solid;margin-left:9px}
  </style><div class="paper"></div>
  <div class="hdr"><span>MOVIES ABOUT BROTHERS</span><span>Nº 0${i + 1} / 0${n}</span></div><div class="hr"></div>
  <div class="main">${img(s.a, s.ap)}</div>
  <div class="sm" style="left:64px">${img(s.b, s.bp)}</div><div class="sm" style="left:550px">${img(s.c, s.cp)}</div>
  <div class="names">${s.names}</div><div class="title">${s.t}</div><div class="line">${s.ov}</div>
  <div class="foot"><span>DIR. ${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</span><span class="dots">${dots}</span></div><div class="grain" style="opacity:.14"></div>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const films = S.filter(s => s.type !== 'cover');
  for (const s of S) {
    const html = s.type === 'cover' ? cover(s) : film(s, films.indexOf(s), films.length);
    fs.writeFileSync(D + '/_t.html', `<html><head><meta charset="utf8"></head><body>${html}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
