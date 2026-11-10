// "kinder" — cover: starry-wall poster, Yellowtail apricot + Work Sans + Sorts Mill Goudy + Homemade Apple note.
// inside: GIFT TAG — deep per-film page, cream-bordered still, kraft gift tag on a string w/ handwritten note, Young Serif title.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const grain = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;
const fib = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><filter id='f'><feTurbulence type='fractalNoise' baseFrequency='.018 .06' numOctaves='4'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23f)'/></svg>")`;
const css = [ff('YT','yellowtail',400), ff('WS','work-sans',500), ff('WS','work-sans',600), ff('YS','young-serif',400),
 ff('Goudy','sorts-mill-goudy',400), ff('Goudy','sorts-mill-goudy',400,'italic'), ff('HA','homemade-apple',400)].join('') + `
*{margin:0;padding:0;box-sizing:border-box} body{width:1080px;height:1350px;overflow:hidden;position:relative;background:#0d1a2a}
.grain{position:absolute;inset:-50%;width:200%;height:200%;opacity:.2;mix-blend-mode:overlay;background-image:${grain};pointer-events:none}
.vig{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(0,0,0,.38) 100%)}
/* cover */
.cbg{position:absolute;inset:0;width:100%;height:100%;filter:saturate(.9) contrast(1.04) brightness(.96)}
.cshade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,10,22,.55),rgba(4,10,22,.12) 50%,rgba(0,0,0,0) 62%)}
.ct{position:absolute;top:118px;left:0;right:0;text-align:center;color:#F3EBDD}
.kick{font-family:WS;font-weight:600;font-size:25px;letter-spacing:.46em;padding-left:.46em;opacity:.95}
.hero{font-family:YT;font-size:330px;line-height:.9;color:var(--ink);margin-top:18px;transform:rotate(-4deg);
  text-shadow:0 0 40px rgba(255,170,110,.35),0 4px 20px rgba(0,0,0,.35)}
.rule{display:flex;align-items:center;justify-content:center;gap:18px;margin:34px auto 0;color:var(--ink);font-size:22px}
.rule i{display:block;width:120px;height:1.5px;background:var(--ink);opacity:.7}
.sub{font-family:Goudy;font-style:italic;font-size:42px;line-height:1.3;margin-top:22px;text-shadow:0 2px 14px rgba(0,0,0,.45)}
.sub b{font-weight:400;color:var(--ink)}
.note{position:absolute;left:66px;top:735px;font-family:HA;font-size:27px;color:#F3EBDD;transform:rotate(-7deg);opacity:.92;line-height:1.6;text-shadow:0 2px 8px rgba(0,0,0,.5)}
.cfoot{position:absolute;right:66px;top:752px;font-family:WS;font-weight:600;font-size:21px;letter-spacing:.32em;color:#F3EBDD;opacity:.9}
/* inside */
.page{position:absolute;inset:0;background:var(--pg)}
.fib{position:absolute;inset:0;background-image:${fib};opacity:.16;mix-blend-mode:soft-light}
.glow{position:absolute;inset:0;background:radial-gradient(ellipse at 50% 30%,rgba(255,235,200,.10),rgba(0,0,0,0) 60%)}
.hdr{position:absolute;top:58px;left:60px;right:60px;display:flex;justify-content:space-between;font-family:WS;font-weight:600;font-size:19px;letter-spacing:.34em;color:#F3EBDD;opacity:.88}
.hdr span:last-child{color:var(--ac)}
.photo{position:absolute;top:118px;left:60px;width:960px;height:640px;background:#F4EDE1;padding:16px;box-shadow:0 22px 50px rgba(0,0,0,.45),0 3px 8px rgba(0,0,0,.3)}
.photo .im{width:100%;height:100%;background-size:cover;filter:saturate(.88) contrast(1.03) sepia(.08)}
.string{position:absolute;left:0;top:0;width:1080px;height:1350px;pointer-events:none}
.tag{position:absolute;left:640px;top:640px;width:390px;height:210px;transform:rotate(-6deg);transform-origin:20px 105px}
.tag .body{position:absolute;inset:0;background:#D8B88A;clip-path:polygon(70px 0,100% 0,100% 100%,70px 100%,0 50%);
  box-shadow:inset 0 0 40px rgba(110,70,30,.25)}
.tag .tx{position:absolute;inset:0;background-image:${fib};opacity:.35;mix-blend-mode:multiply;clip-path:polygon(70px 0,100% 0,100% 100%,70px 100%,0 50%)}
.tag .hole{position:absolute;left:36px;top:93px;width:24px;height:24px;border-radius:50%;background:var(--pg);box-shadow:inset 0 0 0 3px #b9956a}
.tag .w{position:absolute;left:80px;right:16px;top:26px;font-family:HA;font-size:21px;line-height:1.7;color:#3a2412}
.tag .w b{display:block;font-weight:400;font-size:18px;opacity:.8}
.shadowtag{position:absolute;left:648px;top:654px;width:390px;height:210px;transform:rotate(-6deg);transform-origin:20px 105px;background:rgba(0,0,0,.35);filter:blur(10px);clip-path:polygon(70px 0,100% 0,100% 100%,70px 100%,0 50%)}
.info{position:absolute;left:66px;right:66px;top:925px;color:#F3EBDD}
.ttl{font-family:YS;font-size:96px;line-height:1.02;letter-spacing:-.01em}
.meta{font-family:WS;font-weight:600;font-size:22px;letter-spacing:.3em;color:var(--ac);margin-top:20px}
.line{font-family:Goudy;font-style:italic;font-size:38px;line-height:1.3;margin-top:18px;max-width:900px;opacity:.95}
.prog{position:absolute;bottom:56px;left:66px;right:66px;display:flex;justify-content:space-between;align-items:center;font-family:WS;font-weight:600;font-size:17px;letter-spacing:.4em;color:#F3EBDD;opacity:.8}
.prog .st{letter-spacing:.5em;font-size:20px}.prog .st em{font-style:normal;color:var(--ac)}
`;
const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
(async () => {
  fs.mkdirSync(D + '/out', { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, s] of S.entries()) {
    let body;
    if (s.type === 'cover') body = `<img class="cbg" src="file://${D}/${s.img}"><div class="cshade"></div><div class="vig"></div>
      <div class="ct" style="--ink:${s.ink}"><div class="kick">${s.kick}</div><div class="hero">${s.h}</div>
      <div class="rule"><i></i>✦<i></i></div><div class="sub">${s.sub}</div></div>
      <div class="note">${s.note}</div><div class="cfoot">05 FILMS · SWIPE →</div><div class="grain"></div>`;
    else {
      const n = i; const stars = [1,2,3,4,5].map(k => k === n ? '<em>✦</em>' : '✧').join(' ');
      body = `<div class="page" style="--pg:${s.pg}"></div><div class="fib"></div><div class="glow"></div><div class="vig"></div>
      <div class="hdr" style="--ac:${s.ac}"><span>A SMALL KINDNESS</span><span>Nº 0${n} / 05</span></div>
      <div class="photo"><div class="im" style="background-image:url(file://${D}/${s.img});background-position:${s.x ?? 50}% ${s.y ?? 50}%"></div></div>
      <svg class="string" viewBox="0 0 1080 1350"><path d="M686 744 C 660 700, 700 660, 742 640 S 790 600, 812 560" stroke="#efe4cf" stroke-width="3" fill="none" opacity=".92"/><path d="M686 744 C 712 712, 676 688, 722 668" stroke="#e3d5b8" stroke-width="2.5" fill="none" opacity=".8"/><circle cx="812" cy="560" r="9" fill="#c9a46a" stroke="#7a5a30" stroke-width="2"/><circle cx="809" cy="557" r="3" fill="#f6e6c4"/></svg>
      <div class="shadowtag"></div><div class="tag" style="--pg:${s.pg}"><div class="body"></div><div class="tx"></div><div class="hole"></div><div class="w"><b>${s.to}</b>${s.tag}</div></div>
      <div class="info" style="--ac:${s.ac}"><div class="ttl">${s.t}</div><div class="meta">${s.meta}</div><div class="line">${s.ov}</div></div>
      <div class="prog" style="--ac:${s.ac}"><span>CINEMA</span><span class="st">${stars}</span></div><div class="grain"></div>`;
    }
    fs.writeFileSync(D + '/_t.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_t.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/out/${s.file}`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
