// "slow weekend" — cover: extended pale sky over a wide still, Delafield script + DM Serif caps.
// Inside: WEEKEND JOURNAL — dot-grid notebook page on a per-film linen colour, washi-taped still,
// day/time tab, DM Serif title, Manrope meta, Reenie Beanie handwriting, pace meter, polaroid inset.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const base = [
  ff('Dela', 'mrs-saint-delafield', 400), ff('DMS', 'dm-serif-display', 400), ff('DMS', 'dm-serif-display', 400, 'italic'),
  ff('Man', 'manrope', 500), ff('Man', 'manrope', 700), ff('Man', 'manrope', 800), ff('Reenie', 'reenie-beanie', 400),
].join('') + `*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const I = f => `file://${D}/${f}`;

function cover(c) {
  return `<style>${base}
  body{background:linear-gradient(180deg,#CFE3E6 0%,#DCEDE3 30%,#DFEFE2 46%)}
  .im{position:absolute;left:0;bottom:0;width:1080px;height:911px;object-fit:cover;filter:saturate(.9) contrast(.97) sepia(.06);
      -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 26%)}
  .glow{position:absolute;inset:0;background:radial-gradient(ellipse at 62% 34%,rgba(255,250,225,.55),rgba(255,250,225,0) 45%);mix-blend-mode:screen}
  .shade{position:absolute;left:0;right:0;bottom:0;height:260px;background:linear-gradient(180deg,rgba(40,50,20,0),rgba(40,50,20,.28))}
  .t{position:absolute;left:0;right:0;top:110px;text-align:center;color:${c.ink}}
  .kick{font-family:Man;font-weight:700;font-size:23px;letter-spacing:.5em;margin-left:.5em;opacity:.9}
  .scr{font-family:Dela;font-size:280px;line-height:1;margin-top:-10px;position:relative;z-index:2;color:${c.ink2};transform:translateX(-175px) rotate(-8deg)}
  .cap{font-family:DMS;font-size:118px;letter-spacing:.17em;margin-left:.17em;line-height:1;margin-top:-92px}
  .sub{font-family:DMS;font-style:italic;font-size:41px;margin-top:22px;opacity:.95}
  .rule{width:64px;height:2px;background:${c.ink};margin:22px auto 0;opacity:.6}
  </style><img class="im" src="${I(c.img)}"><div class="glow"></div><div class="shade"></div>
  <div class="t"><div class="kick">${c.kick}</div><div class="scr">${c.h}</div><div class="cap">${c.h2}</div><div class="rule"></div><div class="sub">${c.sub}</div></div><div class="grain"></div>`;
}

function inside(m, i) {
  const dots = [1, 2, 3, 4, 5].map(k => `<span class="d ${k <= m.pace ? 'on' : ''}"></span>`).join('');
  const rings = Array.from({ length: 11 }, (_, k) => `<span class="ring" style="left:${70 + k * 79}px"></span>`).join('');
  return `<style>${base}
  body{background:${m.bg}}
  .linen{position:absolute;inset:0;background:repeating-linear-gradient(0deg,rgba(255,255,255,.05) 0 2px,transparent 2px 5px),repeating-linear-gradient(90deg,rgba(0,0,0,.04) 0 2px,transparent 2px 6px)}
  .page{position:absolute;left:60px;top:70px;width:960px;height:1220px;background:#FBF7EE;border-radius:14px;
    box-shadow:0 30px 60px rgba(30,25,15,.28),0 3px 8px rgba(30,25,15,.18);transform:rotate(${m.rot || -0.6}deg);
    background-image:radial-gradient(circle,rgba(70,60,40,.22) 1.6px,transparent 2px);background-size:34px 34px;background-position:10px 14px}
  .ring{position:absolute;top:-22px;width:22px;height:46px;border-radius:12px;border:5px solid #8D8A84;background:transparent;box-shadow:inset 0 0 0 2px rgba(255,255,255,.35)}
  .hole{position:absolute;top:18px;width:18px;height:18px;border-radius:50%;background:${m.bg};box-shadow:inset 0 2px 3px rgba(0,0,0,.3)}
  .hdr{position:absolute;left:60px;right:60px;top:58px;display:flex;justify-content:space-between;align-items:center}
  .tab{font-family:Man;font-weight:800;font-size:22px;letter-spacing:.32em;color:#fff;background:${m.acc};padding:12px 20px 11px 24px;border-radius:6px}
  .no{font-family:Reenie;font-size:44px;color:${m.ink};opacity:.85}
  .ph{position:absolute;left:62px;top:140px;width:836px;height:480px;background:#fff;padding:12px;box-shadow:0 10px 24px rgba(0,0,0,.18);transform:rotate(${m.prot || 0.8}deg)}
  .ph img{width:100%;height:100%;object-fit:cover;object-position:${m.x ?? 50}% ${m.y ?? 50}%;filter:saturate(.92) contrast(.98) sepia(.05)}
  .tape{position:absolute;width:170px;height:44px;background:${m.tape};opacity:.82;box-shadow:0 1px 3px rgba(0,0,0,.12);
    background-image:repeating-linear-gradient(45deg,rgba(255,255,255,.25) 0 6px,transparent 6px 14px)}
  .ttl{position:absolute;left:66px;right:60px;top:660px;font-family:DMS;font-size:${m.fs || 74}px;line-height:1;color:${m.ink}}
  .meta{position:absolute;left:68px;top:${m.fs && m.fs < 70 ? 744 : 752}px;font-family:Man;font-weight:700;font-size:19px;letter-spacing:.24em;color:${m.acc}}
  .line{position:absolute;left:66px;width:520px;top:808px;font-family:Reenie;font-size:50px;line-height:1.02;color:#3A332B}
  .list{position:absolute;left:68px;top:990px;font-family:Man;font-weight:700;font-size:17px;letter-spacing:.22em;color:#6D655A}
  .row{display:flex;align-items:center;gap:16px;margin-bottom:22px;height:40px}
  .row b{width:150px}
  .d{display:inline-block;width:18px;height:18px;border-radius:50%;border:2px solid ${m.acc};margin-right:7px}
  .d.on{background:${m.acc}}
  .hand{font-family:Reenie;font-size:40px;letter-spacing:0;color:#3A332B;font-weight:400;text-transform:none}
  .box{display:inline-block;width:26px;height:26px;border:2.5px solid #3A332B;border-radius:4px;position:relative}
  .box:after{content:'';position:absolute;left:5px;top:-6px;width:10px;height:20px;border-right:4px solid ${m.acc};border-bottom:4px solid ${m.acc};transform:rotate(40deg)}
  .pol{position:absolute;right:58px;top:750px;width:290px;height:340px;background:#fff;padding:14px 14px 58px;box-shadow:0 10px 22px rgba(0,0,0,.2);transform:rotate(4.5deg)}
  .pol img{width:100%;height:100%;object-fit:cover;object-position:${m.ix ?? 50}% 50%;filter:saturate(.92) sepia(.05)}
  .pol .cap{position:absolute;left:0;right:0;bottom:8px;text-align:center;font-family:Reenie;font-size:36px;color:#3A332B}
  </style><div class="linen"></div>
  <div class="page">${rings}
    <div class="hdr"><div class="tab">${m.day}</div><div class="no">${i} / 5 &nbsp;· slow weekend plan</div></div>
    <div class="ph"><img src="${I(m.img)}"></div>
    <div class="tape" style="left:70px;top:120px;transform:rotate(-7deg)"></div>
    <div class="tape" style="right:70px;top:122px;transform:rotate(6deg)"></div>
    <div class="ttl">${m.t}</div>
    <div class="meta">${m.meta}</div>
    <div class="line">${m.ov}</div>
    <div class="list">
      <div class="row"><b>PACE</b>${dots}<span class="hand" style="margin-left:6px">${m.paceword}</span></div>
      <div class="row"><b>BEST WITH</b><span class="hand">${m.with}</span></div>
      <div class="row"><b>WATCH IT</b><span class="box"></span></div>
    </div>
    <div class="pol"><img src="${I(m.inset)}"><div class="cap">${m.cap}</div></div>
    <div class="tape" style="right:118px;top:730px;width:120px;height:38px;transform:rotate(-8deg);z-index:3"></div>
  </div><div class="grain"></div>`;
}

(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const jobs = [['01_cover.jpg', cover(S.cover)], ...S.movies.map((m, k) => [`0${k + 2}_${m.slug}.jpg`, inside(m, k + 1)])];
  for (const [f, html] of jobs) {
    fs.writeFileSync(D + '/_t.html', `<html><head><meta charset="utf-8"></head><body>${html}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${f}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
