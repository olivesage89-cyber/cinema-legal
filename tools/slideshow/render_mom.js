// "call your mom" — cover: Turning Red hands at night, jade + cream type. Inside: FAMILY ALBUM (black album page,
// white-bordered prints with photo corners, orange camera date stamp, white gel-pen handwriting).
// Usage: node render_mom.js WORKDIR  (reads WORKDIR/mom.json)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const FIBER = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.012 .9' numOctaves='2'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")`;
const css = [
  ff('DMS', 'dm-serif-display', 400), ff('DMS', 'dm-serif-display', 400, 'italic'),
  ff('Work', 'work-sans', 400), ff('Work', 'work-sans', 500), ff('Work', 'work-sans', 600),
  ff('Reenie', 'reenie-beanie', 400), ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 400),
  ff('Mono', 'share-tech-mono', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0C111A}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}
/* cover */
.cv-ext{position:absolute;left:-60px;top:-60px;width:1200px;height:900px;object-fit:cover;filter:blur(38px) brightness(.55) saturate(.8)}
.cv-img{position:absolute;left:var(--cx);top:var(--cy);height:var(--ch);filter:saturate(.92) contrast(1.04) brightness(.98)}
.cv-fade{position:absolute;inset:0;background:linear-gradient(180deg,#0B1019 0%,rgba(11,16,25,.97) 26%,rgba(11,16,25,.72) 38%,rgba(11,16,25,.15) 52%,rgba(11,16,25,0) 62%,rgba(11,16,25,0) 86%,rgba(11,16,25,.55) 100%)}
.cv-vig{position:absolute;inset:0;background:radial-gradient(ellipse at 52% 66%,rgba(0,0,0,0) 40%,rgba(0,0,0,.35) 100%)}
.cv-txt{position:absolute;left:0;right:0;top:92px;text-align:center;color:#F4ECDF}
.kick{font-family:Work;font-weight:500;font-size:23px;letter-spacing:.46em;margin-left:.46em;opacity:.92}
.kick b{font-weight:600;color:var(--ink)}
.hero{font-family:DMS;font-style:italic;font-size:208px;line-height:.86;color:var(--ink);margin-top:34px;letter-spacing:-.01em;text-shadow:0 0 60px rgba(111,211,154,.28),0 4px 30px rgba(0,0,0,.5)}
.hero2{font-family:DMS;font-size:150px;line-height:.9;color:#F4ECDF;letter-spacing:.005em;margin-top:2px;text-shadow:0 4px 30px rgba(0,0,0,.5)}
.pen{position:absolute;font-family:Reenie;color:#F4ECDF;font-size:64px;transform:rotate(-7deg);text-shadow:0 2px 14px rgba(0,0,0,.6)}
.sub{font-family:Bask;font-style:italic;font-size:31px;line-height:1.45;margin-top:34px;opacity:.95}
.sub em{color:var(--ink);font-style:italic}
.foot{position:absolute;bottom:52px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Work;font-weight:500;font-size:20px;letter-spacing:.38em;color:#F4ECDF;opacity:.85;text-shadow:0 1px 10px rgba(0,0,0,.6)}
.call{display:inline-flex;align-items:center;gap:14px;margin-top:30px;padding:12px 28px 12px 14px;border-radius:40px;background:rgba(244,236,223,.10);border:1px solid rgba(244,236,223,.22);font-family:Work;font-size:22px;letter-spacing:.06em;color:#F4ECDF;backdrop-filter:blur(6px)}
.call i{width:34px;height:34px;border-radius:50%;background:var(--ink);display:inline-flex;align-items:center;justify-content:center}
/* album page */
.pg{position:absolute;inset:0;background:#141210}
.pg:before{content:'';position:absolute;inset:0;background-image:${FIBER};opacity:.08;mix-blend-mode:screen}
.pg:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(255,240,220,.05),rgba(0,0,0,.35) 100%)}
.hd{position:absolute;top:54px;left:72px;right:72px;display:flex;justify-content:space-between;align-items:baseline;color:#EDE6DA;z-index:5}
.hd .l{font-family:Work;font-weight:500;font-size:19px;letter-spacing:.36em}
.hd .l b{color:var(--acc);font-weight:600}
.hd .r{font-family:Reenie;font-size:40px;color:#EDE6DA;opacity:.9}
.print{position:absolute;background:#F3EEE4;padding:16px 16px 16px;box-shadow:0 18px 40px rgba(0,0,0,.55),0 2px 6px rgba(0,0,0,.4)}
.print img{display:block;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.03) sepia(.08)}
.print .ph{position:relative;width:100%;height:100%;overflow:hidden}
.print .ph:after{content:'';position:absolute;inset:0;background:linear-gradient(160deg,rgba(255,235,200,.08),rgba(0,0,0,.06))}
.ds{position:absolute;right:22px;bottom:16px;font-family:Mono;font-size:36px;letter-spacing:.1em;color:#FF9548;text-shadow:0 0 4px rgba(255,130,50,.95),0 0 14px rgba(255,100,30,.7);opacity:1}
.cn{position:absolute;width:46px;height:46px;background:var(--acc);box-shadow:0 2px 4px rgba(0,0,0,.4)}
.cn.tl{left:-8px;top:-8px;clip-path:polygon(0 0,100% 0,0 100%)}
.cn.tr{right:-8px;top:-8px;clip-path:polygon(0 0,100% 0,100% 100%)}
.cn.bl{left:-8px;bottom:-8px;clip-path:polygon(0 0,0 100%,100% 100%)}
.cn.br{right:-8px;bottom:-8px;clip-path:polygon(100% 0,100% 100%,0 100%)}
.cap{position:absolute;font-family:Reenie;color:#EDE6DA;font-size:44px;line-height:1}
.ttl{position:absolute;left:76px;font-family:DMS;color:#F6F0E6;font-size:84px;line-height:.98;letter-spacing:-.005em}
.meta{position:absolute;left:78px;font-family:Work;font-weight:600;font-size:20px;letter-spacing:.3em;color:var(--acc)}
.ln{position:absolute;left:78px;font-family:Bask;font-style:italic;font-size:30px;line-height:1.5;color:#E6DED1}
.note{position:absolute;left:78px;font-family:Reenie;font-size:48px;color:var(--acc);transform:rotate(-2deg)}
.dots{position:absolute;bottom:56px;left:0;right:0;display:flex;justify-content:center;gap:16px}
.dots i{width:14px;height:14px;border:1.5px solid #EDE6DA;opacity:.55;transform:rotate(45deg)}
.dots i.on{background:var(--acc);border-color:var(--acc);opacity:1}
`;
const S = JSON.parse(fs.readFileSync(D + '/mom.json'));
const corners = '<i class="cn tl"></i><i class="cn tr"></i><i class="cn bl"></i><i class="cn br"></i>';
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S.slides) {
    if (s.only && process.argv[3] && !s.file.startsWith(process.argv[3])) continue;
    let body;
    if (s.type === 'cover') {
      body = `<img class="cv-ext" src="file://${D}/${s.img}"><img class="cv-img" style="--cx:${s.cx}px;--cy:${s.cy}px;--ch:${s.ch}px" src="file://${D}/${s.img}">
      <div class="cv-fade"></div><div class="cv-vig"></div>
      <div class="cv-txt" style="--ink:${S.ink}"><div class="kick">MOVIES THAT MAKE YOU WANT TO</div>
      <div class="hero">call</div><div class="hero2">your mom</div>
      <div class="sub">five films about the first person<br>who ever <em>held your hand</em></div></div>
      <div class="pen" style="left:728px;top:246px;font-size:76px">(tonight)</div>
      <div class="foot"><span>05 FILMS</span><span>SWIPE →</span></div>`;
    } else if (s.type === 'film') {
      const i = s.n;
      body = `<div class="pg"></div>
      <div class="hd" style="--acc:${s.acc}"><span class="l">THE FAMILY ALBUM &nbsp;·&nbsp; Nº <b>0${i}</b> / 05</span><span class="r">call your mom ♡</span></div>
      <div class="print" style="left:78px;top:132px;width:924px;height:588px;transform:rotate(-1.2deg);--acc:${s.acc}"><div class="ph"><img src="file://${D}/${s.big}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"><div class="ds">'${s.yr.slice(2)} 11 05</div></div>${corners}</div>
      <div class="print" style="left:${s.sl ?? 640}px;top:${s.st ?? 690}px;width:370px;height:300px;padding:14px 14px 58px;transform:rotate(${s.sr ?? 4.5}deg)"><div class="ph"><img src="file://${D}/${s.small}" style="object-position:${s.sx ?? 50}% ${s.sy ?? 50}%"></div><div class="cap" style="left:22px;bottom:8px;color:#2B2A33;font-size:40px">${s.cap}</div></div>
      <div class="ttl" style="top:${s.tt ?? 790}px;max-width:560px">${s.t}</div>
      <div class="meta" style="top:${(s.tt ?? 790) + (s.t.includes('<br>') ? 186 : 104)}px;--acc:${s.acc}">${s.dir.toUpperCase()} &nbsp;·&nbsp; ${s.yr}</div>
      <div class="ln" style="top:${(s.tt ?? 790) + (s.t.includes('<br>') ? 236 : 154)}px;max-width:${s.lw ?? 900}px">${s.ov}</div>
      <div class="note" style="top:${(s.tt ?? 790) + (s.t.includes("<br>") ? 236 : 154) + 140}px;--acc:${s.acc}">${s.note}</div>
      <div class="dots" style="--acc:${s.acc}">${[1, 2, 3, 4, 5].map(k => `<i class="${k === i ? 'on' : ''}"></i>`).join('')}</div>`;
    } else continue;
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
