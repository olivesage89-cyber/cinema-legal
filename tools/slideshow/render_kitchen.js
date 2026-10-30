// "warm kitchen" — cover: still under a cream wall band w/ Homemade Apple + Shrikhand; inside: BISTRO MENU on gingham.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2] || '.');
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = [ff('Shrik', 'shrikhand', 400), ff('Apple', 'homemade-apple', 400), ff('YSerif', 'young-serif', 400),
  ff('Instr', 'instrument-serif', 400), ff('Instr', 'instrument-serif', 400, 'italic'),
  ff('DMSans', 'dm-sans', 500), ff('DMSans', 'dm-sans', 700), ff('DMMono', 'dm-mono', 400), ff('DMMono', 'dm-mono', 500)].join('') + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;pointer-events:none;
 background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.95' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.graded{filter:saturate(.86) contrast(.95) brightness(1.02) sepia(.12)}
/* cover */
.cv{background:#EADBC3}
.cv .ph{position:absolute;left:0;right:0;bottom:0;height:var(--h);overflow:hidden}
.cv .ph img{position:absolute;height:100%;left:var(--l)}
.cv .fade{position:absolute;left:0;right:0;bottom:calc(var(--h) - 170px);height:172px;background:linear-gradient(180deg,#EADBC3 8%,rgba(234,219,195,.86) 40%,rgba(234,219,195,0))}
.cv .vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,rgba(0,0,0,0) 60%,rgba(40,20,5,.30) 100%)}
.cv .kick{position:absolute;top:70px;width:100%;text-align:center;font:500 25px DMMono;letter-spacing:.42em;color:#4A2E1C}
.cv .a{position:absolute;top:118px;width:100%;text-align:center;font:400 62px/1.6 Apple;color:#4A2E1C;transform:rotate(-4deg);z-index:2}
.cv .k{position:absolute;top:196px;width:100%;text-align:center;font:400 236px/1 Shrik;color:var(--ink);letter-spacing:-.01em;
  text-shadow:0 3px 0 rgba(74,46,28,.18)}
.cv .sub{position:absolute;top:458px;width:100%;text-align:center;font:italic 400 44px Instr;color:#4A2E1C}
.cv .swipe{position:absolute;bottom:52px;width:100%;text-align:center;font:500 20px DMMono;letter-spacing:.4em;color:#F6EBDA;text-shadow:0 1px 10px rgba(0,0,0,.6)}
/* menu */
.mn{background-color:#F3EBDD}
.cloth{position:absolute;inset:0;background-color:#F3EBDD;
 background-image:linear-gradient(90deg,var(--c1) 50%,transparent 50%),linear-gradient(0deg,var(--c1) 50%,transparent 50%);
 background-size:84px 84px;opacity:1}
.cloth2{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 45%,rgba(30,15,5,.42) 100%)}
.card{position:absolute;left:84px;top:78px;width:912px;height:1194px;background:#F8F1E4;transform:rotate(var(--rot));
 box-shadow:0 26px 60px rgba(30,15,5,.45),0 4px 10px rgba(30,15,5,.25)}
.card:before{content:'';position:absolute;inset:22px;border:2px solid var(--ink);opacity:.85}
.card:after{content:'';position:absolute;inset:30px;border:1px solid var(--ink);opacity:.5}
.paper{position:absolute;inset:0;opacity:.35;mix-blend-mode:multiply;background:radial-gradient(ellipse at 30% 20%,rgba(255,255,255,0),rgba(190,160,120,.35))}
.hdr{position:absolute;top:66px;width:100%;text-align:center;font:500 20px DMMono;letter-spacing:.42em;color:var(--ink)}
.hdr2{position:absolute;top:96px;width:100%;text-align:center;font:400 34px Apple;color:#5A3A26}
.still{position:absolute;left:76px;top:172px;width:760px;height:470px;object-fit:cover;border:10px solid #fff;box-shadow:0 6px 16px rgba(40,20,5,.25)}
.plate{position:absolute;left:668px;top:520px;width:200px;height:200px;border-radius:50%;background:#fff;
 box-shadow:0 10px 22px rgba(40,20,5,.35),inset 0 0 0 6px #fff,inset 0 0 0 8px var(--ink)}
.plate img{position:absolute;inset:16px;width:168px;height:168px;border-radius:50%;object-fit:cover}
.course{position:absolute;top:676px;left:80px;font:500 19px DMMono;letter-spacing:.36em;color:var(--ink)}
.ttl{position:absolute;top:712px;left:76px;right:240px;font:400 var(--fs,76px)/1.04 YSerif;color:var(--ink)}
.meta{position:absolute;left:80px;font:700 19px DMSans;letter-spacing:.3em;color:#6B5040}
.line{position:absolute;left:80px;right:80px;font:italic 400 40px/1.22 Instr;color:#3A2618}
.rows{position:absolute;left:80px;right:80px;bottom:78px}
.row{display:flex;align-items:baseline;font:500 18px DMMono;letter-spacing:.24em;color:#6B5040;margin-top:16px}
.row .dots{flex:1;border-bottom:2px dotted rgba(107,80,64,.55);margin:0 14px;transform:translateY(-5px)}
.row .v{font:italic 400 32px Instr;letter-spacing:0;color:#3A2618}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const s of S) {
    let body;
    if (s.type === 'cover') {
      body = `<body class="cv" style="--ink:${s.ink};--h:${s.h}px;--l:${s.l}px"><div class="ph"><img class="graded" src="file://${D}/${s.img}"></div><div class="fade"></div><div class="vig"></div><div style="position:absolute;left:0;right:0;bottom:0;height:240px;background:linear-gradient(0deg,rgba(35,18,6,.62),rgba(35,18,6,0))"></div>
      <div class="kick">${s.kick}</div><div class="a">${s.a}</div><div class="k">${s.k}</div><div class="sub">${s.sub}</div><div class="swipe">SWIPE FOR THE MENU →</div><div class="grain"></div></body>`;
    } else {
      const ty = s.two ? 712 + 2 * (s.fsn || 79) : 712 + (s.fsn || 79);
      body = `<body class="mn" style="--ink:${s.ink};--c1:${s.cloth};--rot:${s.rot}deg"><div class="cloth"></div><div class="cloth2"></div>
      <div class="card"><div class="paper"></div><div class="hdr">LE MENU · NO. ${s.n} / 05</div><div class="hdr2">a warm kitchen</div>
      <img class="still graded" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 50}%">
      <div class="plate"><img class="graded" src="file://${D}/${s.img2}" style="object-position:${s.x2 ?? 50}% 50%"></div>
      <div class="course">${s.course}</div><div class="ttl" style="--fs:${s.fsn || 79}px">${s.t}</div>
      <div class="meta" style="top:${ty + 22}px">DIR. ${s.dir.toUpperCase()} · ${s.yr}</div>
      <div class="line" style="top:${ty + 70}px">${s.ov}</div>
      <div class="rows"><div class="row">SERVES<span class="dots"></span><span class="v">${s.serves}</span></div><div class="row">PAIRS WITH<span class="dots"></span><span class="v">${s.pairs}</span></div></div>
      </div><div class="grain"></div></body>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head>${body}</html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
