// ede.nnico — "movies that feel like an english country house": P&P golden-meadow cover + PORTRAIT GALLERY inside slides.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const C = S[0];
const css = [
  ff('Bod', 'bodoni-moda', 400, 'italic'), ff('Bod', 'bodoni-moda', 500, 'italic'), ff('Bod', 'bodoni-moda', 600), ff('Bod', 'bodoni-moda', 500),
  ff('Cin', 'cinzel', 400), ff('Cin', 'cinzel', 500), ff('Cin', 'cinzel', 600),
  ff('Cor', 'cormorant-garamond', 500, 'italic'), ff('Cor', 'cormorant-garamond', 600, 'italic'), ff('Cor', 'cormorant-garamond', 600),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#16140f}
.grain{position:absolute;inset:0;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='360' height='360'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 55% 50%,rgba(0,0,0,0) 50%,rgba(0,0,0,.5) 100%);pointer-events:none}
/* cover */
.cimg{position:absolute;inset:0;background-size:cover;filter:contrast(1.05) saturate(.92) sepia(.08)}
.cshade{position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,18,10,.55) 0,rgba(14,18,10,.25) 45%,rgba(14,18,10,0) 62%)}
.cbot{position:absolute;left:0;right:0;bottom:0;height:330px;background:linear-gradient(0deg,rgba(20,16,8,.78) 0,rgba(20,16,8,.35) 55%,rgba(20,16,8,0) 100%)}
.ctxt{position:absolute;left:78px;top:${C.top || 96}px;width:620px}
.ckick{font-family:Cin;font-weight:500;font-size:22px;letter-spacing:.36em;color:${C.ink2};opacity:.95;text-shadow:0 2px 12px rgba(0,0,0,.5)}
.crule{width:86px;height:1.5px;background:${C.ink2};opacity:.7;margin:30px 0 26px}
.csmall{font-family:Cin;font-weight:600;font-size:44px;letter-spacing:.32em;color:${C.ink2};text-shadow:0 2px 14px rgba(0,0,0,.5)}
.cbig{font-family:Bod;font-style:italic;font-weight:400;font-size:var(--hs,164px);line-height:.88;letter-spacing:-.025em;color:${C.ink};margin-top:6px;
  text-shadow:0 4px 30px rgba(0,0,0,.35)}
.cbig span{display:block}
.cbig span+span{padding-left:96px}
.csub{position:absolute;left:78px;right:78px;bottom:118px;font-family:Cor;font-style:italic;font-weight:500;font-size:44px;line-height:1.15;color:#F6F0E2;text-shadow:0 2px 14px rgba(0,0,0,.8)}
.cfoot{position:absolute;bottom:58px;left:78px;right:78px;display:flex;justify-content:space-between;font-family:Cin;font-size:19px;letter-spacing:.38em;color:#F2EAD6;opacity:.85}
/* gallery slide */
.wall{position:absolute;inset:0}
.damask{position:absolute;inset:0;opacity:.13;mix-blend-mode:screen;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='240' viewBox='0 0 180 240'><g fill='none' stroke='%23fff' stroke-width='2.2'><path d='M90 20c22 26 40 46 40 80s-18 48-40 70c-22-22-40-36-40-70s18-54 40-80z'/><path d='M90 52c10 14 18 28 18 48s-8 30-18 42c-10-12-18-22-18-42s8-34 18-48z'/><path d='M90 170v50M70 200c8-10 32-10 40 0'/><path d='M0 140c16-14 30-14 44 0M136 140c16-14 30-14 44 0'/><circle cx='0' cy='20' r='10'/><circle cx='180' cy='20' r='10'/><circle cx='0' cy='240' r='10'/><circle cx='180' cy='240' r='10'/></g></svg>")}
.dado{position:absolute;left:0;right:0;bottom:0;height:150px;background:linear-gradient(180deg,rgba(0,0,0,.28),rgba(0,0,0,.55));border-top:6px solid rgba(214,180,110,.35)}
.dado:before{content:'';position:absolute;left:0;right:0;top:10px;height:2px;background:rgba(214,180,110,.25)}
.light{position:absolute;inset:0;background:radial-gradient(ellipse 60% 45% at 50% 30%,rgba(255,236,190,.22),rgba(0,0,0,0) 70%)}
.hdr{position:absolute;top:48px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:baseline;font-family:Cin;font-weight:500;font-size:20px;letter-spacing:.34em;color:rgba(246,232,200,.9)}
.hdr i{font-family:Bod;font-style:italic;font-size:30px;letter-spacing:0;color:#F3E6C4}
.gilt{background:linear-gradient(135deg,#7a5a22 0%,#e9cf86 18%,#a47a32 34%,#f4de9c 50%,#8f6a2a 66%,#dcbc72 82%,#6e5020 100%)}
.frame{position:absolute;left:70px;top:120px;width:940px;height:620px;padding:30px;box-shadow:0 34px 50px rgba(0,0,0,.55),0 8px 14px rgba(0,0,0,.4)}
.frame .in{position:absolute;inset:14px;border:3px solid rgba(70,48,14,.55);box-shadow:inset 0 0 0 4px rgba(255,236,170,.35)}
.frame .mat{position:absolute;inset:30px;padding:4px;background:#2a1f10}
.frame img{width:100%;height:100%;object-fit:cover;display:block;filter:contrast(1.05) saturate(.95) sepia(.06)}
.frame .bead{position:absolute;inset:22px;border:3px dotted rgba(90,62,18,.6)}
.oval{position:absolute;left:96px;top:800px;width:300px;height:380px;border-radius:50%;padding:20px;box-shadow:0 24px 34px rgba(0,0,0,.55)}
.oval .o2{position:absolute;inset:9px;border-radius:50%;border:3px dotted rgba(90,62,18,.6)}
.oval img{width:100%;height:100%;border-radius:50%;object-fit:cover;display:block;filter:contrast(1.04) sepia(.1);box-shadow:inset 0 0 20px #000}
.oval .bow{position:absolute;top:-36px;left:50%;margin-left:-3px;width:6px;height:40px;background:#b9954a}
.plaque{position:absolute;left:452px;top:812px;width:560px;padding:34px 40px 32px;
  background:linear-gradient(160deg,#f4ecd8,#e6dbc0);box-shadow:0 18px 30px rgba(0,0,0,.45);border-radius:3px}
.plaque:before{content:'';position:absolute;inset:10px;border:1.5px solid var(--ink);opacity:.55}
.room{font-family:Cin;font-weight:600;font-size:16px;letter-spacing:.28em;white-space:nowrap;color:var(--ink)}
.ttl{font-family:Bod;font-weight:500;font-size:var(--fs,64px);line-height:1.02;letter-spacing:-.01em;color:#21170e;margin-top:16px}
.meta{font-family:Cin;font-weight:500;font-size:17px;letter-spacing:.24em;color:#5a4732;margin-top:16px}
.meta i{font-family:Cor;font-style:italic;font-size:24px;letter-spacing:0;text-transform:none}
.orn{display:flex;align-items:center;gap:14px;margin:20px 0 16px;color:var(--ink)}
.orn:before,.orn:after{content:'';flex:1;height:1px;background:var(--ink);opacity:.5}
.line{font-family:Cor;font-style:italic;font-weight:600;font-size:34px;line-height:1.14;color:#2b2016}
.prog{position:absolute;left:0;right:0;bottom:56px;display:flex;justify-content:center;gap:16px}
.prog i{width:11px;height:11px;transform:rotate(45deg);border:1.5px solid rgba(240,220,170,.8)}
.prog i.on{background:rgba(240,220,170,.9)}
`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    if (s.type === 'end') continue;
    let body;
    if (s.type === 'cover') {
      body = `<div class="cimg" style="background-image:url(file://${D}/${s.img});background-position:${s.x}% 50%"></div><div class="cshade"></div><div class="cbot"></div><div class="vig"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="crule"></div><div class="csmall">${s.h2}</div><div class="cbig">${s.h}</div></div>
      <div class="csub">${s.sub}</div><div class="cfoot"><span>05 FILMS</span><span>SWIPE →</span></div><div class="grain"></div>`;
    } else {
      const n = String(i).padStart(2, '0');
      const prog = [1, 2, 3, 4, 5].map(k => `<i class="${k <= i ? 'on' : ''}"></i>`).join('');
      const orn = `<svg width="34" height="14" viewBox="0 0 34 14"><path d="M17 1l5 6-5 6-5-6z" fill="currentColor"/><circle cx="4" cy="7" r="2" fill="currentColor"/><circle cx="30" cy="7" r="2" fill="currentColor"/></svg>`;
      body = `<div class="wall" style="background:radial-gradient(ellipse at 50% 30%,${s.page2},${s.page} 80%)"></div><div class="damask"></div><div class="light"></div><div class="dado"></div>
      <div class="hdr"><span>ROOM Nº ${n} / 05</span><i>an english country house</i></div>
      <div class="frame gilt"><div class="bead"></div><div class="in"></div><div class="mat"><img src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%"></div></div>
      <div class="oval gilt"><div class="bow"></div><div class="o2"></div><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div>
      <div class="plaque" style="--ink:${s.ink};--fs:${s.fs || 64}px"><div class="room">${s.room}</div><div class="ttl">${s.t}</div>
        <div class="meta">DIR. ${s.dir.toUpperCase()} · <i>${s.yr}</i></div><div class="orn">${orn}</div><div class="line">${s.line}</div></div>
      <div class="prog">${prog}</div><div class="vig"></div><div class="grain"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/${String(i + 1).padStart(2, '0')}_${s.type === 'cover' ? 'cover' : 'film' + i}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
