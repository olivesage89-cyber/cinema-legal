// "Being seventeen" — MIXTAPE: cover = full-bleed poster w/ marker hero word; inside = J-card + cassette on a coloured desk.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [ff('Marker', 'permanent-marker', 400), ff('Mono', 'space-mono', 400), ff('Mono', 'space-mono', 700),
  ff('Bask', 'libre-baskerville', 400), ff('Bask', 'libre-baskerville', 400, 'italic'), ff('Bask', 'libre-baskerville', 600, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:Bask;--cy:#7FD6F2;--cr:#F7EDDC}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none;z-index:50}
/* cover */
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.04) brightness(.98) sepia(.08)}
.warm{position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,190,120,.10),rgba(40,60,90,.10));mix-blend-mode:soft-light}
.shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,0) 14%,rgba(0,0,0,0) 52%,rgba(8,14,10,.55) 70%,rgba(6,10,8,.86) 100%)}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.brand{position:absolute;top:54px;width:100%;text-align:center;font-family:Mono;font-size:19px;letter-spacing:.7em;color:var(--cr);opacity:.85}
.ct{position:absolute;left:0;right:0;bottom:92px;text-align:center;color:var(--cr)}
.ck{font-family:Mono;font-weight:700;font-size:25px;letter-spacing:.38em;margin-left:.38em;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.hero{font-family:Marker;font-size:212px;line-height:1;margin-top:8px;transform:rotate(-4deg);text-shadow:0 6px 30px rgba(0,0,0,.45)}
.scrib{display:block;margin:-34px auto 0;width:700px;height:60px;transform:rotate(-4deg)}
.csub{font-style:italic;font-size:35px;line-height:1.35;margin-top:22px;text-shadow:0 2px 14px rgba(0,0,0,.6)}
.csub b{font-weight:600;color:var(--cy)}
.cfoot{font-family:Mono;font-size:21px;letter-spacing:.32em;color:var(--cy);margin-top:30px}
/* inside */
.desk{position:absolute;inset:0;background:var(--desk)}
.desk:after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 35%,rgba(255,255,255,.08),rgba(0,0,0,.35) 95%)}
.hdr{position:absolute;top:44px;left:64px;right:64px;display:flex;justify-content:space-between;font-family:Mono;font-weight:700;font-size:19px;letter-spacing:.24em;color:var(--cr);opacity:.9;z-index:5}
.hdr span:last-child{color:var(--acc)}
.jcard{position:absolute;left:72px;top:104px;width:936px;background:#F3EADA;padding:16px 16px 0;transform:rotate(-1.1deg);box-shadow:0 26px 50px rgba(0,0,0,.45),0 3px 8px rgba(0,0,0,.3);z-index:2}
.jcard:before{content:'';position:absolute;inset:0;background-image:${GRAIN};opacity:.18;mix-blend-mode:multiply;pointer-events:none}
.jimg{display:block;width:904px;height:540px;object-fit:cover;filter:saturate(.92) contrast(1.03) sepia(.1)}
.spine{height:100px;display:flex;align-items:center;gap:22px;padding:0 10px 0 6px;border-top:2px dashed rgba(40,30,20,.28);margin-top:14px}
.spine .t{font-family:Marker;font-size:52px;line-height:1;color:var(--ink);white-space:nowrap}
.spine .y{display:none;font-family:Mono;font-weight:700;font-size:22px;letter-spacing:.2em;color:#3a3128}
.pola{position:absolute;right:34px;top:520px;width:300px;background:#FBF6EC;padding:12px 12px 46px;transform:rotate(5deg);box-shadow:0 14px 30px rgba(0,0,0,.4);z-index:4}
.pola img{display:block;width:276px;height:200px;object-fit:cover;filter:saturate(.9) sepia(.12)}
.pola i{position:absolute;bottom:10px;left:0;right:0;text-align:center;font-family:Marker;font-size:22px;color:var(--ink)}
.tape-strip{position:absolute;top:-16px;left:50%;width:120px;height:34px;margin-left:-60px;background:rgba(255,248,225,.62);transform:rotate(-4deg);box-shadow:0 1px 2px rgba(0,0,0,.15)}
.cas{position:absolute;left:58px;top:852px;width:540px;height:346px;border-radius:24px;background:var(--shell);transform:rotate(-5deg);box-shadow:0 24px 44px rgba(0,0,0,.5),inset 0 2px 0 rgba(255,255,255,.25),inset 0 -3px 0 rgba(0,0,0,.25);z-index:3}
.cas .lab{position:absolute;left:30px;right:30px;top:26px;height:214px;border-radius:10px;background:#F6EEDD;overflow:hidden}
.cas .band{height:46px;background:var(--acc);display:flex;align-items:center;justify-content:space-between;padding:0 18px;font-family:Mono;font-weight:700;font-size:17px;letter-spacing:.2em;color:#fff}
.cas .band b{font-size:30px;letter-spacing:0}
.cas .hand{font-family:Marker;font-size:34px;color:#1f1a16;padding:10px 20px 0;white-space:nowrap;overflow:hidden}
.cas .lines{position:absolute;left:20px;right:20px;top:96px;height:1px;background:rgba(0,0,0,.18)}
.cas .win{position:absolute;left:84px;right:84px;bottom:14px;height:86px;border-radius:43px;background:#1b1714;display:flex;align-items:center;justify-content:space-between;padding:0 16px;box-shadow:inset 0 3px 8px rgba(0,0,0,.6)}
.reel{width:62px;height:62px;border-radius:50%;background:radial-gradient(circle,#1b1714 0 9px,#EDE6D8 10px 16px,transparent 17px),repeating-conic-gradient(#EDE6D8 0 14deg,transparent 14deg 60deg);border:5px solid #EDE6D8;position:relative;z-index:2}
.mag{position:absolute;top:13px;height:60px;border-radius:30px;background:#5a3a24}
.cas .foot{position:absolute;left:110px;right:110px;bottom:0;height:72px;background:rgba(0,0,0,.18);clip-path:polygon(8% 0,92% 0,100% 100%,0 100%)}
.cas .foot:before,.cas .foot:after{content:'';position:absolute;bottom:22px;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,.45)}
.cas .foot:before{left:34%}.cas .foot:after{right:34%}
.scr{position:absolute;width:16px;height:16px;border-radius:50%;background:radial-gradient(circle,#9a948a 0 40%,#6b665f 41%);}
.info{position:absolute;left:640px;right:60px;top:900px;color:var(--cr);z-index:3}
.info .no{font-family:Mono;font-weight:700;font-size:20px;letter-spacing:.28em;color:var(--acc)}
.info .dir{font-family:Mono;font-size:20px;letter-spacing:.16em;margin-top:16px;opacity:.9}
.info .rule{width:70px;height:3px;background:var(--acc);margin:24px 0 22px}
.info .ln{font-style:italic;font-size:31px;line-height:1.38}
.prog{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Mono;font-size:20px;letter-spacing:.34em;color:var(--cr);opacity:.85;z-index:5}
.prog b{color:var(--acc)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const reels = (acc) => `<div class="win"><div class="mag" style="left:46px;width:110px"></div><div class="mag" style="right:40px;width:80px"></div><div class="reel"></div><div class="reel"></div></div>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  let n = 0;
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% 50%"><div class="warm"></div><div class="shade"></div><div class="vig"></div>
      <div class="brand">CINEMA</div>
      <div class="ct"><div class="ck">${s.kick}</div><div class="hero">${s.h}</div>
      <svg class="scrib" viewBox="0 0 700 60"><path d="M40 38 C 160 18, 300 46, 420 30 S 620 22, 668 34" fill="none" stroke="#7FD6F2" stroke-width="9" stroke-linecap="round"/></svg>
      <div class="csub">${s.sub}</div><div class="cfoot">${s.foot}</div></div>`;
    } else {
      n++;
      const dots = [1, 2, 3, 4, 5].map(i => i === n ? '<b>●</b>' : '○').join(' ');
      body = `<div class="desk"></div>
      <div class="hdr"><span>A MIXTAPE FOR BEING 17</span><span>SIDE A · 0${n}/05</span></div>
      <div class="jcard"><img class="jimg" src="file://${D}/${s.a}" style="object-position:${s.ax ?? 50}% ${s.ay ?? 50}%"><div class="spine"><div class="t">${s.t}</div><div class="y">${s.yr}</div></div></div>
      <div class="pola"><div class="tape-strip"></div><img src="file://${D}/${s.b}" style="object-position:${s.bx ?? 50}% ${s.by ?? 50}%"><i>${s.cap}</i></div>
      <div class="cas"><div class="scr" style="left:12px;top:12px"></div><div class="scr" style="right:12px;top:12px"></div><div class="scr" style="left:12px;bottom:12px"></div><div class="scr" style="right:12px;bottom:12px"></div>
        <div class="lab"><div class="band"><span>TRACK 0${n}</span><b>A</b></div><div class="hand">${s.lab}</div><div class="lines"></div>${reels()}</div><div class="foot"></div></div>
      <div class="info"><div class="no">${s.yr} · ${s.min}</div><div class="dir">DIR. ${s.dir.toUpperCase()}</div><div class="rule"></div><div class="ln">${s.ov}</div></div>
      <div class="prog">◀◀ &nbsp;${dots}&nbsp; ▶▶</div>`;
    }
    const st = s.type === 'cover' ? '' : `--desk:${s.desk};--acc:${s.acc};--ink:${s.ink};--shell:${s.shell}`;
    const html = `<html><head><style>${css}</style></head><body style="${st}">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.evaluate(() => { const t = document.querySelector('.spine .t'); if (t) { let f = 52; while (t.scrollWidth > 610 && f > 26) { f--; t.style.fontSize = f + 'px'; } } }); await p.waitForTimeout(150);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
