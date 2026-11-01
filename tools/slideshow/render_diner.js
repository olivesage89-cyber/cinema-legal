// "DINER AT 2 A.M." look. Cover = American Graffiti's Mel's Drive-In glowing at night under an extended black sky,
// aqua neon-tube Sacramento hero 'diner' + blush Monoton 'AT 2 A.M.'. Inside = JUKEBOX SELECTION: per-film tuck-and-roll
// booth vinyl page, chrome-bezel still, cream jukebox title strip w/ selection badge, Newsreader italic line.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [
  ff('Sacramento', 'sacramento', 400), ff('Monoton', 'monoton', 400), ff('Inter', 'inter', 500), ff('Inter', 'inter', 600),
  ff('News', 'newsreader', 400, 'italic'), ff('News', 'newsreader', 500, 'italic'), ff('Mono', 'dm-mono', 400), ff('Mono', 'dm-mono', 500),
  ff('Shoulders', 'big-shoulders-display', 800), ff('Shoulders', 'big-shoulders-display', 600), ff('Righteous', 'righteous', 400),
].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:var(--bg);position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:var(--go,.2);mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
/* cover */
.night{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 85%,#1a0c14 0,#07050a 60%,#030205 100%)}
.cimg{position:absolute;bottom:0;object-fit:cover;filter:saturate(1.08) contrast(1.06);
  -webkit-mask-image:linear-gradient(180deg,transparent 0,#000 12%,#000 84%,transparent 100%)}
.ctxt{position:absolute;left:0;right:0;top:var(--ct,64px);text-align:center}
.ckick{font-family:Inter;font-weight:600;font-size:21px;letter-spacing:.56em;padding-left:.56em;color:#EDE6EA;opacity:.8}
.hero{font-family:Sacramento;font-size:var(--hs,268px);line-height:1;margin-top:-6px;color:#E9FFFE;
  text-shadow:0 0 6px var(--ink),0 0 18px var(--ink),0 0 42px var(--ink),0 0 90px var(--ink)}
.ccap{font-family:Monoton;font-size:76px;letter-spacing:.12em;padding-left:.12em;margin-top:-58px;color:#FFE9EE;
  text-shadow:0 0 6px var(--ink2),0 0 20px var(--ink2),0 0 48px var(--ink2)}
.cbot{position:absolute;left:0;right:0;bottom:0;height:380px;background:linear-gradient(180deg,transparent,rgba(4,2,6,.7) 45%,rgba(4,2,6,.92))}
.csub{position:absolute;left:0;right:0;bottom:100px;text-align:center;font-family:News;font-style:italic;font-weight:400;font-size:44px;line-height:1.2;color:#F6EEE6;text-shadow:0 2px 18px rgba(0,0,0,.85)}
.cswipe{position:absolute;left:0;right:0;bottom:50px;text-align:center;font-family:Mono;font-weight:500;font-size:18px;letter-spacing:.42em;color:var(--ink);opacity:.85}
/* jukebox page */
.vinyl{position:absolute;inset:0;background:
  repeating-linear-gradient(90deg,rgba(0,0,0,.30) 0,rgba(255,255,255,.10) 7px,rgba(255,255,255,.02) 40px,rgba(0,0,0,.22) 82px,rgba(0,0,0,.42) 90px),
  radial-gradient(ellipse at 50% 30%,var(--pg2),var(--pg) 75%)}
.vig{position:absolute;inset:0;box-shadow:inset 0 0 180px rgba(0,0,0,.6)}
.hdr{position:absolute;left:78px;right:78px;top:56px;display:flex;justify-content:space-between;font-family:Mono;font-weight:500;font-size:19px;letter-spacing:.34em;color:#F3EBDD;opacity:.88}
.hdr b{color:#FFE6A8;font-weight:500}
.chrome{position:absolute;left:66px;right:66px;top:150px;height:545px;border-radius:30px;padding:13px;
  background:linear-gradient(160deg,#fbfbfb 0%,#9a9ca2 18%,#e9eaec 34%,#6c6f76 52%,#d9dadd 70%,#8b8e94 86%,#f3f3f3 100%);
  box-shadow:0 22px 50px rgba(0,0,0,.55),0 2px 0 rgba(255,255,255,.25) inset}
.chrome div{width:100%;height:100%;border-radius:19px;overflow:hidden;box-shadow:inset 0 0 0 2px rgba(0,0,0,.5)}
.chrome img{width:100%;height:100%;object-fit:cover;filter:saturate(1.02) contrast(1.06)}
.strip{position:absolute;left:96px;right:96px;top:772px;height:236px;background:#F6EFDF;border-radius:6px;
  box-shadow:0 14px 34px rgba(0,0,0,.45);overflow:hidden}
.strip:before,.strip:after{content:'';position:absolute;left:0;right:0;height:22px;background:var(--acc)}
.strip:before{top:0}.strip:after{bottom:0}
.strip .ln{position:absolute;left:0;right:0;height:2px;background:var(--acc);opacity:.55}
.badge{position:absolute;left:34px;top:50%;transform:translateY(-50%);width:120px;height:120px;border-radius:50%;
  background:var(--acc);color:#F6EFDF;font-family:Righteous;font-size:52px;display:flex;align-items:center;justify-content:center;
  box-shadow:inset 0 -6px 0 rgba(0,0,0,.18)}
.stt{position:absolute;left:186px;right:30px;top:50%;transform:translateY(-54%)}
.ttl{font-family:Shoulders;font-weight:800;font-size:var(--fs,86px);line-height:.92;color:#1E1714;letter-spacing:.01em;text-transform:uppercase}
.meta{font-family:Mono;font-weight:500;font-size:20px;letter-spacing:.24em;color:var(--acc);margin-top:12px;text-transform:uppercase}
.line{position:absolute;left:90px;right:90px;top:1070px;text-align:center;font-family:News;font-style:italic;font-size:41px;line-height:1.25;color:#F7EFE3;text-shadow:0 2px 14px rgba(0,0,0,.5)}
.foot{position:absolute;left:0;right:0;bottom:46px;text-align:center;font-family:Mono;font-size:17px;letter-spacing:.5em;color:#F3EBDD;opacity:.55}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  const only = process.argv[3];
  for (const [i, s] of S.entries()) {
    if (only && !s.file.startsWith(only)) continue;
    let body, vars;
    if (s.type === 'cover') {
      vars = `--bg:#050307;--ink:${s.ink};--ink2:${s.ink2};--go:.22`;
      body = `<div class="night"></div><img class="cimg" src="file://${D}/${s.img}" style="width:${s.w}px;height:${Math.round(s.w * 9 / 16)}px;left:${s.left}px;bottom:${s.bot||0}px">
      <div class="cbot"></div>
      <div class="ctxt"><div class="ckick">${s.kick}</div><div class="hero">${s.h}</div><div class="ccap">${s.h2}</div></div>
      <div class="csub">${s.sub}</div><div class="cswipe">PUT A QUARTER IN &nbsp;→</div><div class="grain"></div>`;
    } else if (s.type === 'juke') {
      vars = `--bg:${s.pg};--pg:${s.pg};--pg2:${s.pg2};--acc:${s.acc};--go:.24;${s.fs ? '--fs:' + s.fs + 'px' : ''}`;
      body = `<div class="vinyl"></div><div class="vig"></div>
      <div class="hdr"><span>A DINER AT 2 A.M.</span><span>SELECTION <b>${s.sel}</b></span></div>
      <div class="chrome"><div><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div></div>
      <div class="strip"><div class="ln" style="top:30px"></div><div class="ln" style="bottom:30px"></div>
        <div class="badge">${s.sel}</div><div class="stt"><div class="ttl">${s.t}</div><div class="meta">${s.yr} &nbsp;·&nbsp; ${s.dir}</div></div></div>
      <div class="line">${s.line}</div>
      <div class="foot">${i} / 5</div><div class="grain"></div>`;
    } else continue;
    const html = `<html><head><style>${css}</style></head><body style="${vars}">${body}</body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
