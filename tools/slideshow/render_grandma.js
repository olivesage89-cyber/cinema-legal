// "weekend at grandma's" — cover: Minari golden field masked into extended sky, ink-blue Playfair + Cedarville cursive.
// Inside: RECIPE CARD — per-film gingham tablecloth, cream ruled index card ("from the kitchen of grandma"),
// still with white border, Playfair 900 italic title in per-film ink, DM Sans meta, Cedarville handwritten
// "ingredients" in blue ballpoint, small paper-clipped photo. Usage: node render_grandma.js WORKDIR
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const fonts = [ff('Play', 'playfair-display', 900, 'italic'), ff('Play', 'playfair-display', 700, 'italic'), ff('Play', 'playfair-display', 600),
  ff('Play', 'playfair-display', 800), ff('Ced', 'cedarville-cursive', 400), ff('DMS', 'dm-sans', 500), ff('DMS', 'dm-sans', 700),
  ff('Gel', 'gelasio', 400, 'italic'), ff('Gel', 'gelasio', 500, 'italic')].join('');
const grain = `<div class="grain"></div>`;
const base = `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const u = f => 'file://' + D + '/' + f;

function cover(c) {
  const ink = c.ink;
  return `<style>${fonts}${base}
body{background:#D9CDA8}
.ext{position:absolute;left:-60px;top:-120px;width:1200px;height:900px;background:url(${u('sky.jpg')}) center/cover no-repeat;filter:saturate(.85) brightness(1.04)}
.wash{position:absolute;left:0;top:0;width:1080px;height:760px;background:linear-gradient(180deg,rgba(236,226,198,.55),rgba(236,226,198,.15) 70%,rgba(236,226,198,0))}
.main{position:absolute;left:${c.ix}px;top:${c.iy}px;width:${c.iw}px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 240px);filter:saturate(.9) contrast(.96) sepia(.08)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 60%,rgba(40,25,5,.25) 100%)}
.t{position:absolute;left:0;right:0;top:${c.ty}px;text-align:center;color:${ink}}
.kick{font-family:DMS;font-weight:700;font-size:23px;letter-spacing:.42em;margin-left:.42em}
.ced{font-family:Ced;font-size:84px;line-height:1;margin-top:30px;transform:rotate(-4deg);display:inline-block;color:${c.ink2}}
.big{font-family:Play;font-style:italic;font-weight:900;font-size:200px;line-height:.82;letter-spacing:-.025em;margin-top:-4px}
.rule{width:120px;height:2px;background:${ink};margin:30px auto 0;opacity:.7}
.sub{font-family:Gel;font-style:italic;font-weight:500;font-size:37px;line-height:1.32;margin-top:24px;color:${ink}}
.sub b{font-weight:500;color:${c.ink2}}
.sw{position:absolute;bottom:52px;right:56px;text-align:right;font-family:DMS;font-weight:700;font-size:20px;letter-spacing:.4em;color:#FFF6E2;text-shadow:0 1px 12px rgba(0,0,0,.5)}
</style><div class="ext"></div><div class="wash"></div><img class="main" src="${u(c.img)}"><div class="vig"></div>
<div class="t"><div class="kick">${c.kick}</div><div class="ced">${c.h}</div><div class="big">${c.h2}</div><div class="rule"></div><div class="sub">${c.sub}</div></div>
<div class="sw">${c.swipe}</div>${grain}`;
}

function gingham(col) {
  return `background-color:#F5EEDF;background-image:linear-gradient(90deg,${col}88 50%,transparent 50%),linear-gradient(0deg,${col}88 50%,transparent 50%);background-size:72px 72px`;
}

function film(m, i, n) {
  return `<style>${fonts}${base}
body{${gingham(m.check)}}
.shade{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,250,235,.10),rgba(30,15,5,.32) 100%)}
.card{position:absolute;left:62px;top:84px;width:956px;height:1196px;background:#FBF6E8;border-radius:10px;transform:rotate(${m.rot}deg);
box-shadow:0 30px 60px rgba(40,20,5,.35),0 4px 10px rgba(40,20,5,.2);overflow:hidden}
.card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 82% 88%,rgba(170,120,50,.10) 0 60px,transparent 62px),radial-gradient(ellipse at 15% 10%,rgba(190,150,80,.08),transparent 40%)}
.hd{position:absolute;left:48px;right:48px;top:36px;height:70px;display:flex;align-items:flex-end;justify-content:space-between;border-bottom:3px solid #C8453C;padding-bottom:10px}
.hd .l{font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.3em;color:#7A6A55}
.hd .l span{font-family:Ced;font-size:46px;letter-spacing:0;color:#24408E;margin-left:12px;text-transform:none;position:relative;top:6px}
.hd .r{font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.25em;color:#7A6A55}
.ph{position:absolute;left:48px;top:132px;width:860px;height:500px;background:#fff;padding:12px;box-shadow:0 4px 14px rgba(60,40,10,.18)}
.ph img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(.92) contrast(.97) sepia(.1)}
.lines{position:absolute;left:0;right:0;top:660px;bottom:0;background:repeating-linear-gradient(180deg,transparent 0 59px,rgba(90,130,190,.32) 59px 61px)}
.rf{position:absolute;left:48px;top:672px;font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.32em;color:#7A6A55}
.ti{position:absolute;left:46px;right:300px;top:700px;font-family:Play;font-style:italic;font-weight:900;font-size:${m.fs || 86}px;line-height:.92;color:${m.ink};letter-spacing:-.01em}
.meta{position:absolute;left:48px;line-height:30px;white-space:nowrap;top:${m.my || 830}px;font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.22em;color:#5C5145}
.meta i{font-style:normal;color:${m.ink}}
.ing{position:absolute;left:48px;top:${(m.my || 830) + 84}px;font-family:DMS;font-weight:700;font-size:19px;letter-spacing:.32em;color:#7A6A55}
.hw{position:absolute;left:52px;right:300px;top:${(m.my || 830) + 110}px;font-family:Ced;font-size:41px;line-height:60px;color:#24408E}
.clip{position:absolute;right:${m.cr ?? 46}px;bottom:${m.cb ?? 60}px;width:262px;height:316px;background:#fff;padding:12px 12px 52px;transform:rotate(${m.crot}deg);box-shadow:0 10px 22px rgba(60,40,10,.28)}
.clip img{width:100%;height:100%;object-fit:cover;object-position:${m.x2 ?? 50}% 50%;filter:saturate(.9) sepia(.12)}
.clip .cap{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-family:Ced;font-size:28px;color:#24408E}
.pc{position:absolute;right:${(m.cr ?? 46) + 190}px;bottom:${(m.cb ?? 60) + 270}px;width:30px;height:92px;border:5px solid #A9AEB4;border-radius:15px;transform:rotate(${m.crot + 8}deg);z-index:3}
.pc:after{content:'';position:absolute;left:4px;top:10px;width:12px;height:60px;border:4px solid #A9AEB4;border-bottom:none;border-radius:8px 8px 0 0}
.nb{position:absolute;left:56px;bottom:30px;font-family:Ced;font-size:34px;color:#C8453C;transform:rotate(-2deg)}
</style><div class="shade"></div>
<div class="card"><div class="hd"><div class="l">FROM THE KITCHEN OF<span>grandma</span></div><div class="r">Nº 0${i} / 0${n}</div></div>
<div class="lines"></div><div class="ph"><img src="${u(m.img)}"></div>
<div class="rf">RECIPE FOR</div><div class="ti">${m.t}</div>
<div class="meta">${m.dir.toUpperCase()} · ${m.yr}<br>BAKE TIME <i>${m.rt}</i> &nbsp;·&nbsp; SERVES <i>${m.serves.toUpperCase()}</i></div>
<div class="ing">YOU WILL NEED</div><div class="hw">${m.ov}</div>
<div class="clip"><img src="${u(m.img2)}"><div class="cap">${m.cap}</div></div><div class="pc"></div><div class="nb">♡ made with love</div></div>${grain}`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const films = S.filter(s => s.type === 'film');
  for (const s of S) {
    if (s.type === 'end') continue;
    const html = s.type === 'cover' ? cover(s) : film(s, films.indexOf(s) + 1, films.length);
    fs.writeFileSync(D + '/_t.html', '<html><head><meta charset="utf-8"></head><body>' + html + '</body></html>');
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
