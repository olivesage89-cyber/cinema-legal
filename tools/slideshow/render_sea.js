// SEA POSTCARD inside slides. Usage: node render_sea.js DIR  (DIR/sea.json) -> DIR/out/0X_*.jpg + app slide
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/sea.json'));
const F = path.join(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const CSS = ff('Scr', 'allura', 400) + ff('Pra', 'prata', 400) + ff('Lex', 'lexend', 300) + ff('Lex', 'lexend', 400) + ff('Lex', 'lexend', 500) + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;position:relative;font-family:Lex}
.page{position:absolute;inset:0}
.waves{position:absolute;inset:0;opacity:.09}
.grain{position:absolute;inset:0;opacity:.13;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}
.head{position:absolute;top:52px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:center;color:var(--aq);font:500 19px Lex;letter-spacing:.38em}
.head .s{font:400 50px Scr;letter-spacing:0;text-transform:none;color:#fff;opacity:.95}
.still{position:absolute;top:118px;left:60px;width:960px;height:560px;border-radius:26px;background-size:cover;background-position:center;box-shadow:0 24px 60px rgba(0,0,0,.45)}
.card{position:absolute;top:620px;left:78px;width:924px;height:640px;background:#F6EFE2;border-radius:10px;transform:rotate(-1.6deg);box-shadow:0 26px 60px rgba(0,0,0,.5);overflow:hidden}
.card:before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 20% 10%,rgba(255,255,255,.5),transparent 60%),radial-gradient(circle at 90% 100%,rgba(160,130,90,.14),transparent 55%)}
.left{position:absolute;left:52px;top:56px;width:500px}
.kick{font:500 16px Lex;letter-spacing:.34em;color:#8C7F6C}
.t{font:400 var(--fs) / 1.08 Pra;color:var(--ink);margin-top:20px}
.meta{font:500 17px Lex;letter-spacing:.24em;color:#3A3530;margin-top:22px}
.line{font:400 54px/1.12 Scr;color:#2C3C52;margin-top:26px}
.watch{position:absolute;left:52px;bottom:52px;font:400 16px Lex;letter-spacing:.3em;color:#8C7F6C}
.watch b{font-weight:500;color:var(--ink)}
.div{position:absolute;left:590px;top:60px;bottom:60px;width:2px;background:#D8CDB9}
.stamp{position:absolute;right:60px;top:56px;width:216px;height:258px;background:#fff;padding:16px;transform:rotate(3deg);filter:drop-shadow(0 3px 6px rgba(0,0,0,.2))}
.stamp:before{content:'';position:absolute;inset:-7px;border:9px dotted #F6EFE2;border-radius:2px}
.stamp div{width:100%;height:100%;background-size:cover;background-position:center}
.pm{position:absolute;right:150px;top:318px;width:150px;height:150px;border-radius:50%;border:3px solid rgba(40,60,90,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;color:rgba(40,60,90,.7);font:500 15px Lex;letter-spacing:.2em;transform:rotate(-14deg)}
.pm .y{font:400 40px Pra;letter-spacing:.04em;margin:2px 0}
.cancel{position:absolute;right:20px;top:360px;width:150px;opacity:.5}
.addr{position:absolute;right:52px;width:260px;height:2px;background:#D8CDB9}
`;
const WAVES = `<svg class='waves' width='1080' height='1350'><defs><pattern id='w' width='120' height='34' patternUnits='userSpaceOnUse'><path d='M0 17 Q30 3 60 17 T120 17' fill='none' stroke='#fff' stroke-width='2'/></pattern></defs><rect width='1080' height='1350' fill='url(#w)'/></svg>`;
const CANCEL = `<svg class='cancel' viewBox='0 0 190 60'>${[0, 1, 2, 3].map(i => `<path d='M0 ${8 + i * 14} Q24 ${i * 14} 48 ${8 + i * 14} T96 ${8 + i * 14} T144 ${8 + i * 14} T190 ${8 + i * 14}' fill='none' stroke='#283C5A' stroke-width='2.4'/>`).join('')}</svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, f] of S.films.entries()) {
    const html = `<html><head><style>${CSS}</style></head><body style='--aq:${S.aq};--ink:${f.ink};--fs:${f.fs || 64}px'>
<div class='page' style='background:radial-gradient(circle at 50% 30%,${f.bg2},${f.bg} 70%)'></div>${WAVES}
<div class='head'><span>POSTCARDS FROM THE SEA</span><span class='s'>miss the sea</span><span>Nº 0${i + 1} / 05</span></div>
<div class='still' style="background-image:url('file://${D}/${f.img}');background-position:${f.pos || 'center'}"></div>
<div class='card'><div class='left'><div class='kick'>${f.kind}</div><div class='t'>${f.t}</div>
<div class='meta'>${f.dir.toUpperCase()} · ${f.yr}</div><div class='line'>${f.line}</div></div>
<div class='watch'>WATCH ON &nbsp;<b>${f.where.toUpperCase()}</b></div><div class='div'></div>
<div class='stamp'><div style="background-image:url('file://${D}/${f.img2}');background-position:${f.pos2 || 'center'}"></div></div>
<div class='pm'><span>SEASIDE</span><span class='y'>${f.yr}</span><span style='font-size:12px'>· ${f.pm} ·</span></div>${CANCEL}
<div class='addr' style='top:520px'></div><div class='addr' style='top:568px'></div></div>
<div class='grain'></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}_${f.slug}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
