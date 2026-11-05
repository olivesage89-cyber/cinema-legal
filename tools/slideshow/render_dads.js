// "anime about dads": cover = Crayon Shin-chan: The Adult Empire Strikes Back — the Nohara family cycling under summer
// clouds, full-width still set low, its own sky extended up (blurred, mirrored, deepened to navy-cobalt) and grass extended down.
// Karla spaced kicker, giant cream Shrikhand 'dads' w/ tomato-red retro offset shadow, Kalam handwritten aside, Newsreader italic sub.
// Inside = NOTES FROM DAD: per-film soft paper page, white-bordered photo print of the still, a taped sticky note (per-film colour)
// handwritten in dad's voice (Kalam, ink blue), 'Nº 0X / 05' + 'NOTES FROM DAD' header, Young Serif title, Karla caps meta in
// per-film accent, Newsreader italic line, 5 little hearts progress.  node render_dads.js DIR [only]
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides_dads.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const css = (pkg, w) => `<link rel="stylesheet" href="file://${F}${pkg}/${w}.css">`;
const fonts = css('shrikhand', 400) + css('karla', 500) + css('karla', 600) + css('karla', 700) + css('newsreader', '400-italic') + css('newsreader', '500-italic') +
  css('kalam', 400) + css('kalam', 700) + css('young-serif', 400);
const grain = (o = .15) => `<svg style="position:absolute;inset:0;opacity:${o};mix-blend-mode:overlay;pointer-events:none;z-index:50" width="1080" height="1350"><filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" stitchTiles="stitch"/><feColorMatrix values="0 0 0 0 .5  0 0 0 0 .5  0 0 0 0 .5  0 0 0 1.2 -.1"/></filter><rect width="100%" height="100%" filter="url(#n)"/></svg>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden}`;
const heart = (fill, stroke) => `<svg width="24" height="22" viewBox="0 0 24 22"><path d="M12 20.5 C 5 15, 1.5 11.5, 1.5 7 a5.2 5.2 0 0 1 10.5 -1.6 a5.2 5.2 0 0 1 10.5 1.6 C 22.5 11.5, 19 15, 12 20.5Z" fill="${fill}" stroke="${stroke}" stroke-width="1.8" stroke-linejoin="round"/></svg>`;
function cover(c) {
  const top = c.top, bh = c.bh; // image placed full width at y=top, height bh
  return `<html><head>${fonts}<style>${base}
  body{background:#123B7C}
  .ext{position:absolute;left:0;right:0;top:0;height:${top + 40}px;background:
    radial-gradient(ellipse 34% 9% at 22% ${top + 30}px,rgba(235,242,252,.45),transparent 70%),
    radial-gradient(ellipse 26% 7% at 82% ${top + 20}px,rgba(235,242,252,.38),transparent 70%),
    radial-gradient(ellipse 40% 6% at 55% ${top + 40}px,rgba(225,236,250,.22),transparent 70%),
    radial-gradient(ellipse 22% 5% at 12% ${top - 230}px,rgba(225,236,250,.16),transparent 70%),
    radial-gradient(ellipse 28% 5% at 88% ${top - 300}px,rgba(225,236,250,.14),transparent 70%),
    linear-gradient(180deg,#0B2A64 0,#103A80 30%,#17509C 75%,#1A55A2 100%);filter:blur(10px)}
  .ext2{display:none}
  .sky{position:absolute;left:0;right:0;top:0;height:${top}px;background:linear-gradient(180deg,rgba(6,22,60,.55),rgba(6,22,60,0) 60%)}
  .img{position:absolute;left:0;right:0;top:${top}px;height:${bh}px;background:url(file://${D}/${c.img}) center/100% 100% no-repeat;
    -webkit-mask:linear-gradient(180deg,transparent 0,#000 ${c.fade}px,#000 calc(100% - 40px),transparent 100%);filter:saturate(1.06) contrast(1.05)}
  .grass{position:absolute;left:-40px;right:-40px;top:${top + bh - 40}px;height:${bh}px;background:url(file://${D}/${c.img}) center bottom/100% 100% no-repeat;transform:scaleY(-1);filter:blur(18px) saturate(1.05) brightness(.8)}
  .gshade{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,rgba(10,30,20,0),rgba(10,28,18,.55))}
  .kick{position:absolute;left:0;right:0;top:${c.ky}px;text-align:center;font:700 25px 'Karla';letter-spacing:.56em;padding-left:.56em;color:#F4F1E8;z-index:9;text-shadow:0 2px 16px rgba(6,20,50,.6)}
  .g{position:absolute;left:0;right:0;top:${c.gy}px;text-align:center;font:400 ${c.gs}px/1 'Shrikhand';color:${c.ink};z-index:9;letter-spacing:.005em;
     text-shadow:7px 7px 0 ${c.red},14px 16px 34px rgba(4,16,46,.55)}
  .aside{position:absolute;left:${c.ax}px;top:${c.ay}px;font:700 40px/1 'Kalam';color:${c.ink};transform:rotate(-8deg);z-index:10;text-shadow:0 3px 14px rgba(6,20,50,.7)}
  .aside svg{vertical-align:-6px;margin-left:6px}
  .sub{position:absolute;left:0;right:0;top:${c.sy}px;text-align:center;font:italic 400 39px/1.3 'Newsreader';color:#F6F3EC;text-shadow:0 3px 18px rgba(6,20,50,.85);z-index:9}
  .sub b{font-weight:500;color:${c.acc}}
  .tk{position:absolute;left:0;right:0;bottom:52px;text-align:center;font:700 17px 'Karla';letter-spacing:.46em;padding-left:.46em;color:rgba(255,255,255,.9);text-shadow:0 2px 12px rgba(0,20,10,.8);z-index:9}
  </style></head><body><div class="ext2"></div><div class="ext"></div><div class="grass"></div><div class="img"></div><div class="sky"></div><div class="gshade"></div>
  <div class="kick">${c.kick}</div><div class="g">${c.g}</div><div class="aside">${c.aside}${heart(c.red, c.red)}</div>
  <div class="sub">${c.sub}</div><div class="tk">${c.tk}</div>${grain(.13)}</body></html>`;
}
function inside(m, i, n) {
  const L = 64, T = 150, W = 952, H = 680, b = 16;
  const lines = m.lines || 1, fs_ = m.fs || 62, ty = T + H + 66;
  const prog = Array.from({ length: n }, (_, k) => heart(k < i ? m.acc : 'none', k < i ? m.acc : 'rgba(60,40,30,.3)')).join('');
  return `<html><head>${fonts}<style>${base}
  body{background:${m.bg}}
  .pg{position:absolute;inset:0;background:radial-gradient(ellipse 90% 70% at 50% 30%,rgba(255,255,255,.45),transparent 70%),linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(70,40,20,.08))}
  .hdr{position:absolute;top:72px;left:${L + 2}px;right:${L + 2}px;display:flex;justify-content:space-between;align-items:center;font:600 18px 'Karla';letter-spacing:.34em;color:rgba(48,36,30,.62)}
  .hdr b{color:${m.acc};font-weight:700}
  .ph{position:absolute;left:${L}px;top:${T}px;width:${W}px;height:${H}px;background:#FFFDF8;padding:${b}px;transform:rotate(${m.rot || -0.6}deg);
    box-shadow:0 26px 50px -22px rgba(60,35,20,.55),0 2px 6px rgba(60,35,20,.12)}
  .ph div{width:100%;height:100%;background:url(file://${D}/${m.img}) ${m.x || 50}% ${m.y || 50}%/cover;filter:saturate(1.04) contrast(1.03)}
  .note{position:absolute;right:${m.nr || 46}px;top:${T + H - (m.nup || 170)}px;width:340px;min-height:300px;padding:58px 30px 30px 34px;background:${m.nc};
    transform:rotate(${m.nrot || 4}deg);z-index:9;box-shadow:0 22px 34px -16px rgba(60,35,20,.55),0 1px 0 rgba(255,255,255,.5) inset;
    background-image:repeating-linear-gradient(180deg,transparent 0,transparent 47px,rgba(40,60,120,.16) 47px,rgba(40,60,120,.16) 49px);background-position:0 56px}
  .note:before{content:'';position:absolute;left:50%;top:-18px;width:150px;height:40px;margin-left:-75px;background:rgba(255,253,245,.62);transform:rotate(-3deg);
    box-shadow:0 1px 3px rgba(0,0,0,.12);border-left:2px dashed rgba(255,255,255,.4);border-right:2px dashed rgba(255,255,255,.4)}
  .note p{font:400 ${m.ns || 35}px/48px 'Kalam';color:#22356E;margin-top:-6px}
  .note p s{text-decoration-thickness:3px;color:rgba(34,53,110,.75)}
  .note .sig{display:block;text-align:right;font-weight:700;margin-top:4px}
  .ti{position:absolute;left:${L + 4}px;width:${m.tw || 560}px;top:${ty}px;font:400 ${fs_}px/1.04 'Young Serif';color:#2A201C;letter-spacing:-.012em}
  .meta{position:absolute;left:${L + 6}px;top:${ty + fs_ * 1.04 * lines + 20}px;font:700 18px 'Karla';letter-spacing:.3em;color:${m.acc}}
  .ln{position:absolute;left:${L + 4}px;width:${m.lw || 600}px;top:${ty + fs_ * 1.04 * lines + 64}px;font:italic 400 35px/1.27 'Newsreader';color:rgba(42,32,28,.86)}
  .ln b{font-weight:500;color:${m.acc}}
  .ft{position:absolute;left:${L + 4}px;right:${L}px;bottom:54px;display:flex;justify-content:space-between;align-items:center}
  .ft .p{display:flex;gap:12px}.ft .s{font:700 16px 'Karla';letter-spacing:.4em;color:rgba(48,36,30,.55)}
  </style></head><body><div class="pg"></div>
  <div class="hdr"><div>Nº <b>0${i}</b> / 0${n}</div><div>NOTES FROM DAD</div></div>
  <div class="ph"><div></div></div>
  <div class="note"><p>${m.note}</p></div>
  <div class="ti">${m.t}</div><div class="meta">${m.meta}</div><div class="ln">${m.line}</div>
  <div class="ft"><div class="p">${prog}</div><div class="s">${i < n ? 'KEEP SWIPING →' : 'CALL HIM →'}</div></div>
  ${grain(.09)}</body></html>`;
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
