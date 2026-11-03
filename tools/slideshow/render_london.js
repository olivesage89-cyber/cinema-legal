// "movies that feel like a winter evening in london" — cover: Muppet Christmas Carol moonlit snowy Victorian street,
// full-bleed 4:5 w/ navy top shade; Josefin spaced kicker + cream Great Vibes 'a winter evening in' overlapping giant
// pillar-box red Gloock LONDON + lamp rule + Cormorant italic sub, top-centred in the night sky, '5 FILMS · SWIPE', grain.
// Inside: WET COBBLES (still on top 2/3, its rippled blurred reflection below like a puddle on the street, waterline glint,
// text floating on the reflection: Nº header, Gloock title, Josefin dir·year, Cormorant italic line in per-film accent).
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const css = [
  ff('Gl', 'gloock', 400), ff('GV', 'great-vibes', 400), ff('Jo', 'josefin-sans', 400), ff('Jo', 'josefin-sans', 600),
  ff('Co', 'cormorant-garamond', 500, 'italic'), ff('Co', 'cormorant-garamond', 600, 'italic'),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0B0E1A}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.cv .bg{position:absolute;inset:0;background-size:auto 100%;background-position:var(--bx,50%) 50%;filter:saturate(1.08) contrast(1.06) brightness(1.02)}
.cv .top{position:absolute;inset:0;background:linear-gradient(180deg,rgba(6,8,22,.62) 0,rgba(6,8,22,.3) 30%,rgba(0,0,0,0) 50%,rgba(0,0,0,0) 78%,rgba(4,6,16,.45) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 55%,rgba(0,0,0,.5) 100%)}
.cv .ttl{position:absolute;left:0;right:0;top:var(--ty,82px);text-align:center}
.cv .kick{font-family:Jo;font-weight:600;font-size:22px;letter-spacing:.55em;padding-left:.55em;color:#F3EADB;text-shadow:0 2px 12px rgba(0,0,0,.6)}
.cv .scr{font-family:GV;font-size:104px;line-height:1;color:#F6EEDF;margin:30px 0 -58px;position:relative;z-index:2;transform:rotate(-5deg);text-shadow:0 3px 20px rgba(0,0,0,.65)}
.cv .h{font-family:Gl;font-size:206px;line-height:1;color:var(--acc);letter-spacing:.01em;text-shadow:0 10px 50px rgba(4,6,20,.7),0 0 70px rgba(239,75,63,.22)}
.cv .lamp{display:flex;align-items:center;justify-content:center;gap:18px;margin:14px auto 18px}
.cv .lamp i{display:block;width:150px;height:1.5px}
.cv .lamp i:first-child{background:linear-gradient(90deg,transparent,#F3D9A4)}
.cv .lamp i:last-child{background:linear-gradient(270deg,transparent,#F3D9A4)}
.cv .lamp b{width:9px;height:9px;border-radius:50%;background:#FFE3A8;box-shadow:0 0 14px 5px rgba(255,214,140,.55)}
.cv .sub{font-family:Co;font-style:italic;font-weight:500;font-size:40px;line-height:1.2;color:#F6EEDF;text-shadow:0 2px 16px rgba(0,0,0,.85)}
.cv .sub b{font-weight:600;color:var(--acc2)}
.cv .sw{position:absolute;left:0;right:0;bottom:54px;text-align:center;font-family:Jo;font-weight:600;font-size:18px;letter-spacing:.45em;padding-left:.45em;color:rgba(246,238,223,.88);text-shadow:0 2px 10px rgba(0,0,0,.7)}
/* inside: wet cobbles */
.wc .im{position:absolute;left:0;top:0;width:1080px;height:var(--ih,760px);background-size:cover;filter:saturate(1.06) contrast(1.06)}
.wc .im:after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,rgba(5,7,16,.55) 0,rgba(5,7,16,0) 16%,rgba(0,0,0,0) 85%,rgba(0,0,0,.25) 100%)}
.wc .rf{position:absolute;left:-30px;top:var(--ih,760px);width:1140px;height:calc(1350px - var(--ih,760px) + 40px);overflow:hidden}
.wc .rf .m{position:absolute;left:30px;top:0;width:1080px;height:var(--ih,760px);background-size:cover;transform:scaleY(-1);transform-origin:center;
  filter:url(#rip) blur(5px) saturate(1.15) brightness(.62)}
.wc .shade{position:absolute;left:0;right:0;top:var(--ih,760px);bottom:0;background:linear-gradient(180deg,rgba(6,8,18,.25) 0,rgba(6,8,18,.62) 40%,rgba(6,8,18,.86) 100%)}
.wc .line{position:absolute;left:0;right:0;top:calc(var(--ih,760px) - 1px);height:2px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,240,220,.55) 30%,rgba(255,240,220,.55) 70%,rgba(255,255,255,0))}
.wc .hd{position:absolute;left:56px;right:56px;top:46px;display:flex;justify-content:space-between;align-items:center;font-family:Jo;font-weight:600;font-size:17px;letter-spacing:.38em;color:rgba(246,238,223,.9);text-shadow:0 2px 10px rgba(0,0,0,.6)}
.wc .hd .m{font-family:GV;font-size:46px;letter-spacing:0;color:#F6EEDF}
.wc .ft{position:absolute;left:0;right:0;bottom:44px;text-align:center;font-family:GV;font-size:44px;color:rgba(246,238,223,.62)}
.wc .txt{position:absolute;left:0;right:0;top:calc(var(--ih,760px) + 56px);text-align:center;color:#F6EEDF}
.wc .t{font-family:Gl;font-size:var(--tfs,92px);line-height:1;color:#F8F1E4;text-shadow:0 4px 30px rgba(0,0,0,.6)}
.wc .dir{font-family:Jo;font-weight:600;font-size:18px;letter-spacing:.4em;padding-left:.4em;margin-top:26px;color:rgba(246,238,223,.72)}
.wc .dir b{color:var(--acc);font-weight:600}
.wc .orn{display:flex;align-items:center;justify-content:center;gap:14px;margin:30px auto 26px}
.wc .orn i{display:block;width:90px;height:1px;background:var(--acc);opacity:.7}
.wc .orn b{width:7px;height:7px;border-radius:50%;background:var(--acc);box-shadow:0 0 12px 4px color-mix(in srgb,var(--acc) 55%,transparent)}
.wc .ov{font-family:Co;font-style:italic;font-weight:500;font-size:42px;line-height:1.22;color:var(--acc);padding:0 110px;text-shadow:0 2px 16px rgba(0,0,0,.7)}
`;
const svg = `<svg width="0" height="0" style="position:absolute"><filter id="rip" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="0.004 0.09" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="34"/></filter></svg>`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body, cls;
    if (s.type === 'cover') {
      cls = 'cv';
      body = `<div class="bg" style="background-image:url(file://${D}/${s.img});--bx:${s.x || 50}%"></div><div class="top"></div><div class="vig"></div>
      <div class="ttl" style="--ty:${s.ty || 82}px"><div class="kick">${s.kick}</div><div class="scr">${s.scr}</div><div class="h">${s.h}</div>
      <div class="lamp"><i></i><b></b><i></i></div><div class="sub">${s.sub}</div></div><div class="sw">${s.sw}</div>`;
    } else {
      cls = 'wc';
      const bp = `background-image:url(file://${D}/${s.img});background-position:${s.x || 50}% ${s.y || 50}%`;
      body = `${svg}<div class="im" style="${bp}"></div><div class="rf"><div class="m" style="${bp}"></div></div><div class="shade"></div><div class="line"></div>
      <div class="hd"><span>Nº ${s.n} / 05</span><span>${s.yr}</span></div>
      <div class="txt" style="--tfs:${s.tfs || 92}px"><div class="t">${s.t}</div><div class="dir">DIR. ${s.dir.toUpperCase()} · <b>${s.yr}</b></div>
      <div class="orn"><i></i><b></b><i></i></div><div class="ov">${s.ov}</div></div><div class="ft">winter evenings in london</div>`;
    }
    const html = `<html><head><style>${css}</style></head><body class="${cls}" style="--acc:${s.acc};--acc2:${s.acc2 || s.acc};--ih:${s.ih || 760}px">${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(300);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
