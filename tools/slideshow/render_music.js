// "anime for when music is the only thing that gets you": cover = The Piano Forest grand piano in the glowing
// forest, image set low under an extended deep-forest night top; Jost spaced kicker, giant warm-gold Bodoni Moda
// italic 'music' w/ soft glow, Jost light spaced caps, five-line staff rule w/ notes, EB Garamond italic sub.
// Inside = THE SCORE: cream manuscript paper w/ faint staves, 'Op. 0X' + tempo header, big still w/ soft shadow,
// Italianno expression marking (dolce / fortissimo…) in per-film ink over the corner, Bodoni Moda title, Jost meta,
// drawn staff w/ per-film melody notes, EB Garamond italic line.   node render_music.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_music.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('bodoni-moda', '400-italic') + css('bodoni-moda', '500-italic') + css('bodoni-moda', 500) + css('bodoni-moda', 600) +
  css('jost', 300) + css('jost', 400) + css('jost', 500) + css('eb-garamond', '400-italic') + css('eb-garamond', '500-italic') + css('italianno', 400);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
// a five-line staff with notes; notes = array of [x, step] (step 0 = bottom line, each step = half a gap)
function staff(w, gap, col, notes, ncol, op = 1) {
  let s = `<svg width="${w}" height="${gap * 4 + 80}" viewBox="0 -40 ${w} ${gap * 4 + 80}" style="overflow:visible">`;
  for (let k = 0; k < 5; k++) s += `<line x1="0" x2="${w}" y1="${k * gap}" y2="${k * gap}" stroke="${col}" stroke-width="1.4" opacity="${op}"/>`;
  for (const [x, st, beam] of notes) {
    const y = gap * 4 - st * gap / 2;
    s += `<ellipse cx="${x}" cy="${y}" rx="${gap * .62}" ry="${gap * .44}" transform="rotate(-22 ${x} ${y})" fill="${ncol}"/>`;
    s += `<line x1="${x + gap * .56}" x2="${x + gap * .56}" y1="${y - 2}" y2="${y - gap * 3.2}" stroke="${ncol}" stroke-width="2"/>`;
    if (beam === 'f') s += `<path d="M${x + gap * .56} ${y - gap * 3.2} q ${gap * .9} ${gap * .9} ${gap * .5} ${gap * 2}" fill="none" stroke="${ncol}" stroke-width="2.4"/>`;
  }
  return s + `</svg>`;
}
function cover(c) {
  return `<html><head>${fonts}<style>${base}
  body{background:${c.bg}}
  .ext{position:absolute;left:0;right:0;top:0;height:${c.top + 200}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;filter:blur(28px) brightness(.45) saturate(1.1);transform:scaleY(-1)}
  .img{position:absolute;left:0;right:0;top:${c.top}px;height:${c.bh}px;background:url(file://${D}/${c.img}) ${c.bx}px 0/auto ${c.bh}px no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px);filter:saturate(1.06) contrast(1.05) brightness(.97)}
  .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(3,14,22,.92) 0,rgba(3,14,22,.78) ${c.top}px,rgba(3,14,22,.25) ${c.top + 330}px,rgba(3,14,22,0) ${c.top + 520}px,rgba(3,14,22,0) 82%,rgba(3,14,22,.5) 100%)}
  .glow{position:absolute;left:0;right:0;top:${c.ty + 10}px;height:360px;background:radial-gradient(ellipse 42% 50% at 50% 50%,rgba(255,214,140,.13),transparent 70%)}
  .kick{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;font:400 25px 'Jost';letter-spacing:.52em;padding-left:.52em;color:#E6F1F2}
  .g{position:absolute;left:0;right:0;top:${c.ty + 22}px;text-align:center;font:italic 400 ${c.gs}px/1 'Bodoni Moda';color:${c.ink};letter-spacing:-.01em;
     text-shadow:0 0 40px rgba(255,205,120,.35),0 8px 40px rgba(0,10,20,.65)}
  .h{position:absolute;left:0;right:0;top:${c.ty + 32 + c.gs * .98}px;text-align:center;font:300 ${c.hs}px/1.35 'Jost';letter-spacing:.34em;padding-left:.34em;color:#F6EFE2;text-shadow:0 4px 24px rgba(0,10,20,.7)}
  .st{position:absolute;left:50%;top:${c.ty + 32 + c.gs * .98 + c.hs * 1.35 + 42}px;transform:translateX(-50%)}
  .sub{position:absolute;left:0;right:0;top:${c.ty + 32 + c.gs * .98 + c.hs * 1.35 + 118}px;text-align:center;font:italic 400 36px/1.3 'EB Garamond';color:#E3EEF0;text-shadow:0 4px 20px rgba(0,10,20,.8)}
  .sub b{font-weight:500;color:${c.ink}}
  .tk{position:absolute;left:0;right:0;bottom:48px;text-align:center;font:400 17px 'Jost';letter-spacing:.46em;padding-left:.46em;color:rgba(236,244,245,.78)}
  </style></head><body><div class="ext"></div><div class="img"></div><div class="shade"></div><div class="glow"></div>
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="h">${c.h}</div>
  <div class="st">${staff(300, 9, 'rgba(255,226,170,.55)', [[40, 4, 'f'], [96, 6], [150, 5, 'f'], [206, 8], [262, 7, 'f']], c.ink)}</div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.13)}</body></html>`;
}
function inside(m, i, n) {
  const ink = '#2A241E';
  return `<html><head>${fonts}<style>${base}
  body{background:#F1EBDD}
  .paper{position:absolute;inset:0;background:
     radial-gradient(ellipse 95% 80% at 50% 45%,transparent 55%,rgba(120,95,55,.18)),
     repeating-linear-gradient(90deg,rgba(120,100,70,.025) 0 1px,transparent 1px 5px)}
  .staves{position:absolute;left:60px;right:60px;top:0;bottom:0;opacity:.32}
  .sv{position:absolute;left:0;right:0;height:57px;background:repeating-linear-gradient(180deg,rgba(90,75,55,.20) 0 1.2px,transparent 1.2px 14px)}
  .hdr{position:absolute;top:46px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:baseline;color:#4A4036}
  .op{font:italic 500 30px 'Bodoni Moda'}.op span{font:400 18px 'Jost';letter-spacing:.36em;margin-left:16px;font-style:normal}
  .tempo{font:400 19px 'Jost';letter-spacing:.28em}
  .pr{position:absolute;left:66px;top:116px;width:948px;height:${m.ph || 690}px;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;
     box-shadow:0 1px 2px rgba(40,30,20,.18),0 30px 46px -18px rgba(50,35,20,.48);filter:saturate(1.05) contrast(1.03);z-index:3}
  .pr:after{content:'';position:absolute;inset:0;box-shadow:inset 0 0 0 1px rgba(255,255,255,.18)}
  .mark{position:absolute;left:${m.mx || 86}px;top:${116 + (m.ph || 690) - 62}px;z-index:9;font:400 ${m.ms || 118}px/1 'Italianno';color:${m.acc};transform:rotate(-5deg);
     text-shadow:0 0 3px #F1EBDD,0 0 8px #F1EBDD,0 0 16px rgba(241,235,221,.9),0 0 26px rgba(241,235,221,.7)}
  .dyn{position:absolute;right:76px;top:${116 + (m.ph || 690) + 22}px;font:italic 600 44px 'Bodoni Moda';color:${m.acc};opacity:.9}
  .ti{position:absolute;left:74px;right:74px;top:${116 + (m.ph || 690) + 88}px;font:500 ${m.fs || 70}px/1.02 'Bodoni Moda';color:${ink};letter-spacing:-.005em}
  .meta{position:absolute;left:78px;top:${116 + (m.ph || 690) + 88 + (m.fs || 70) * (m.lines || 1) * 1.02 + 20}px;font:500 20px 'Jost';letter-spacing:.3em;color:${m.acc}}
  .stf{position:absolute;left:78px;top:${116 + (m.ph || 690) + 88 + (m.fs || 70) * (m.lines || 1) * 1.02 + 92}px}
  .ln{position:absolute;left:78px;right:70px;top:${116 + (m.ph || 690) + 88 + (m.fs || 70) * (m.lines || 1) * 1.02 + 204}px;font:italic 400 36px/1.28 'EB Garamond';color:#3B332B}
  .ft{position:absolute;left:72px;right:72px;bottom:40px;display:flex;justify-content:space-between;font:400 14px 'Jost';letter-spacing:.36em;color:#8F8474}
  </style></head><body><div class="paper"></div>
  <div class="staves">${[860, 990, 1120, 1250].map(y => `<div class="sv" style="top:${y}px"></div>`).join('')}</div>
  <div class="hdr"><div class="op">Op. 0${i}<span>OF 0${n}</span></div><div class="tempo"><span style="font:400 30px 'EB Garamond';letter-spacing:0;margin-right:6px">♩</span>${m.tempo}</div></div>
  <div class="pr"></div><div class="mark">${m.mark}</div><div class="dyn">${m.dyn}</div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div>
  <div class="stf">${staff(924, 10, 'rgba(60,48,36,.5)', m.notes, m.acc)}</div>
  <div class="ln">${m.line}</div>
  <div class="ft"><span>WHEN MUSIC IS THE ONLY THING THAT GETS YOU</span><span>${m.kind}</span></div>${grain(.09)}</body></html>`;
}
(async () => {
  const only = process.argv[3]; const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  const shot = async (html, out) => { fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(400);
    await p.screenshot({ path: D + '/out/' + out, type: 'jpeg', quality: 93 }); };
  if (!only || only === '1') await shot(cover(S.cover), '01_cover.jpg');
  for (let k = 0; k < S.movies.length; k++) if (!only || only === String(k + 2)) await shot(inside(S.movies[k], k + 1, S.movies.length), `0${k + 2}_${S.movies[k].slug}.jpg`);
  await b.close();
})();
