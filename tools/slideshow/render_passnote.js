// "first love" — cover: full-bleed still, Allura + Abril Fatface. Inside: PASSED NOTE (lined school paper, folded creases,
// taped still + tilted polaroid, gel-pen handwriting, "do you like me? yes/no").  node render_passnote.js DIR
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const PAPER = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='p'><feTurbulence type='fractalNoise' baseFrequency='.012' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23p)'/></svg>")`;
const css = [ff('Allura', 'allura', 400), ff('Abril', 'abril-fatface', 400), ff('Jos', 'josefin-sans', 400), ff('Jos', 'josefin-sans', 600), ff('Jos', 'josefin-sans', 700),
  ff('DMS', 'dm-serif-display', 400), ff('DMS', 'dm-serif-display', 400, 'italic'), ff('Gochi', 'gochi-hand', 400), ff('Lora', 'lora', 500, 'italic'), ff('Lora', 'lora', 600, 'italic')].join('') + `
*{margin:0;padding:0;box-sizing:border-box} body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${GRAIN};pointer-events:none}
/* cover */
.cv .bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.9) contrast(1.04) brightness(.98) sepia(.08)}
.cv .shade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(18,14,22,.62) 0%,rgba(18,14,22,.30) 26%,rgba(0,0,0,0) 42%,rgba(0,0,0,0) 74%,rgba(10,8,12,.55) 100%)}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.35) 100%)}
.cv .t{position:absolute;left:0;right:0;top:70px;text-align:center}
.cv .kick{font-family:Jos;font-weight:600;font-size:25px;letter-spacing:.52em;color:#F6EEE6;padding-left:.52em}
.cv .first{font-family:Allura;font-size:210px;line-height:.8;color:var(--a);margin-top:22px;text-shadow:0 4px 30px rgba(0,0,0,.35)}
.cv .love{font-family:Abril;font-size:212px;line-height:.86;letter-spacing:.06em;color:var(--h);margin-top:-46px;padding-left:.06em;text-shadow:0 6px 40px rgba(0,0,0,.30)}
.cv .first{position:relative;z-index:2}
.cv .sub{font-family:Lora;font-style:italic;font-weight:500;font-size:38px;color:#F6EEE6;margin-top:18px;text-shadow:0 2px 16px rgba(0,0,0,.5)}
.cv .sub b{font-weight:600;color:var(--a)}
.cv .foot{position:absolute;bottom:52px;left:0;right:0;text-align:center;font-family:Jos;font-weight:600;font-size:22px;letter-spacing:.45em;color:#F6EEE6;padding-left:.45em;text-shadow:0 1px 10px rgba(0,0,0,.5)}
/* passed note */
.pn{background:#F7F4EA}
.pn .rules{position:absolute;inset:0;background:
  linear-gradient(90deg,transparent 128px,rgba(214,72,84,.55) 128px,rgba(214,72,84,.55) 130px,transparent 130px,transparent 136px,rgba(214,72,84,.35) 136px,rgba(214,72,84,.35) 137px,transparent 137px),
  repeating-linear-gradient(180deg,transparent 0,transparent 45px,rgba(98,140,196,.42) 45px,rgba(98,140,196,.42) 47px);background-position:0 0,0 ${'var(--r0)'}}
.pn .tex{position:absolute;inset:0;background-image:${PAPER};opacity:.10;mix-blend-mode:multiply}
.pn .crease{position:absolute;inset:0;background:
  linear-gradient(180deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 49.2%,rgba(0,0,0,.07) 49.8%,rgba(255,255,255,.55) 50.2%,rgba(0,0,0,0) 51.5%),
  linear-gradient(90deg,rgba(0,0,0,0) 0,rgba(0,0,0,0) 65.6%,rgba(0,0,0,.06) 66.2%,rgba(255,255,255,.45) 66.5%,rgba(0,0,0,0) 67.6%),
  linear-gradient(180deg,rgba(120,100,70,.06),rgba(0,0,0,0) 30%,rgba(0,0,0,0) 70%,rgba(120,100,70,.08));}
.pn .edge{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(120,96,60,.20)}
.pn .hole{position:absolute;left:42px;width:44px;height:44px;border-radius:50%;background:#2B2622;box-shadow:inset 0 3px 6px rgba(0,0,0,.6),0 1px 0 rgba(255,255,255,.7)}
.pn .hdr{position:absolute;top:66px;left:160px;right:70px;display:flex;justify-content:space-between;align-items:baseline}
.pn .hdr .l{font-family:Jos;font-weight:700;font-size:22px;letter-spacing:.38em;color:#2A3346}
.pn .hdr .l span{color:var(--ink)}
.pn .hdr .r{font-family:Gochi;font-size:34px;color:#4A5468;transform:rotate(-2deg)}
.pn .shot{position:absolute;left:162px;top:150px;width:860px;height:490px;background:#fff;padding:14px;transform:rotate(-1.2deg);box-shadow:0 14px 30px rgba(40,30,20,.22),0 2px 5px rgba(40,30,20,.18)}
.pn .shot img,.pn .pol img{width:100%;height:100%;object-fit:cover;display:block;filter:saturate(.92) contrast(1.03) sepia(.06)}
.pn .tape{position:absolute;width:170px;height:46px;background:var(--tape);opacity:.78;box-shadow:0 1px 2px rgba(0,0,0,.08);
  -webkit-mask:linear-gradient(90deg,transparent 0,#000 4px,#000 calc(100% - 4px),transparent 100%)}
.pn .pol{position:absolute;right:46px;top:560px;width:318px;height:372px;background:#FDFCF8;padding:16px 16px 70px;transform:rotate(5deg);box-shadow:0 16px 30px rgba(40,30,20,.26),0 2px 4px rgba(40,30,20,.2)}
.pn .pol .cap{position:absolute;left:0;right:0;bottom:16px;text-align:center;font-family:Gochi;font-size:30px;color:#3A4152}
.pn .title{position:absolute;left:162px;width:540px;top:672px;font-family:DMS;color:#1C2233;line-height:.98}
.pn .title i{font-style:italic;color:var(--ink);font-size:.52em;letter-spacing:.01em}
.pn .meta{position:absolute;left:166px;font-family:Jos;font-weight:600;font-size:21px;letter-spacing:.32em;color:#4A5468}
.pn .note{position:absolute;left:162px;right:70px;font-family:Gochi;font-size:45px;line-height:46px;color:var(--ink)}
.pn .ask{position:absolute;left:162px;right:70px;font-family:Gochi;font-size:40px;line-height:46px;color:#2E3445}
.pn .box{display:inline-block;width:34px;height:34px;border:2.5px solid #2E3445;border-radius:4px;vertical-align:-4px;margin:0 10px 0 26px;position:relative}
.pn .box.on:after{content:'';position:absolute;left:4px;top:-12px;width:20px;height:38px;border:solid var(--ink);border-width:0 6px 6px 0;transform:rotate(40deg);border-radius:2px}
.pn .heart{position:absolute}
.pn .num{position:absolute;right:76px;bottom:62px;font-family:Gochi;font-size:34px;color:#4A5468}
`;
const heart = (x, y, s, col, r) => `<svg class="heart" style="left:${x}px;top:${y}px;transform:rotate(${r}deg)" width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M50 86 C18 62 6 44 12 28 C18 12 40 10 50 30 C60 10 82 12 88 28 C94 44 82 62 50 86 Z" fill="none" stroke="${col}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M47 80 C22 60 14 46 18 32" fill="none" stroke="${col}" stroke-width="3" opacity=".6"/></svg>`;
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<div class="cv" style="--a:${s.a};--h:${s.hc}"><img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"><div class="shade"></div><div class="vig"></div>
      <div class="t"><div class="kick">${s.kick}</div><div class="first">${s.h}</div><div class="love">${s.h2}</div><div class="sub">${s.sub}</div></div>
      <div class="foot">${s.foot}</div></div>`;
    } else {
      const R = 46, r0 = 152; // ruling
      const ty = 690, my = ty + (s.fs || 96) * (s.two ? 1.96 : 1) + 18;
      const ny = Math.max(my + 64, 968);
      body = `<div class="pn" style="position:absolute;inset:0;--ink:${s.ink};--tape:${s.tape};--r0:${r0}px">
      <div class="rules" style="background-position:0 0,0 ${r0}px"></div><div class="tex"></div>
      <div class="hole" style="top:240px"></div><div class="hole" style="top:653px"></div><div class="hole" style="top:1066px"></div>
      <div class="hdr"><div class="l">FIRST LOVE · <span>Nº 0${s.n}</span> / 05</div><div class="r">${s.hdr}</div></div>
      <div class="shot"><img src="file://${D}/${s.img}" style="object-position:${s.x}% ${s.y ?? 50}%"></div>
      <div class="tape" style="left:104px;top:146px;width:136px;transform:rotate(-38deg)"></div><div class="tape" style="left:930px;top:132px;width:136px;transform:rotate(32deg)"></div>
      <div class="pol"><div style="width:100%;height:100%"><img src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% ${s.y2 ?? 50}%"></div><div class="cap">${s.cap}</div></div>
      <div class="tape" style="left:812px;top:548px;width:130px;transform:rotate(12deg)"></div>
      <div class="title" style="font-size:${s.fs || 96}px;top:${ty}px">${s.t}</div>
      <div class="meta" style="top:${my}px"><span style="color:var(--ink)">${s.yr}</span> &nbsp;·&nbsp; ${s.dir}</div>
      <div class="note" style="top:${ny}px">${s.note}</div>
      <div class="ask" style="top:${1196}px">${s.ask} <span class="box on"></span>yes<span class="box"></span>no</div>
      ${heart(56, 470, 56, s.ink, -12)}${heart(950, 1180, 64, s.ink, 14)}
      <div class="num">swipe →</div>
      <div class="crease"></div><div class="edge"></div></div>`;
    }
    const html = `<html><head><style>${css}</style></head><body>${body}<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_t.html', html); await p.goto('file://' + D + '/_t.html');
    await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
