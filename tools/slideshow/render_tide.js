// IG inside slides, look "SEASIDE POSTCARD": deep-ocean page with faint wave lines, big rounded still,
// cream postcard tilted over it (Instrument Serif italic title, Space Grotesk meta, coral rule, handwritten-ish line,
// perforated stamp with second still + wavy postmark). Usage: node render_tide.js DIR  (DIR/slides.json) -> DIR/out/0X.jpg
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/slides.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (fam, pkg, w, st = 'normal') => `@font-face{font-family:'${fam}';font-weight:${w};font-style:${st};src:url(file://${F}${pkg}/files/${pkg}-latin-${w}-${st}.woff2)}`;
const css = ff('IS', 'instrument-serif', 400) + ff('IS', 'instrument-serif', 400, 'italic') + ff('SG', 'space-grotesk', 400) + ff('SG', 'space-grotesk', 500) + ff('SG', 'space-grotesk', 600) + `
*{margin:0;padding:0;box-sizing:border-box}
body{width:1080px;height:1350px;overflow:hidden;background:#071C27;position:relative;font-family:SG}
.page{position:absolute;inset:0;background:radial-gradient(120% 80% at 50% 0%,#0E3446 0%,#0A2433 45%,#06151E 100%)}
.waves{position:absolute;inset:0;opacity:.10}
.grain{position:absolute;inset:0;opacity:.07;mix-blend-mode:overlay;background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='300'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='300' height='300' filter='url(%23n)'/></svg>")}
.top{position:absolute;top:52px;left:70px;right:70px;display:flex;justify-content:space-between;font:500 21px SG;letter-spacing:.42em;color:#F6E9D6}
.top b{font-weight:500;color:var(--acc)}
.still{position:absolute;left:70px;top:110px;width:940px;height:640px;border-radius:22px;background-size:cover;background-position:var(--pos,50% 50%);box-shadow:0 30px 60px rgba(0,0,0,.45);filter:saturate(1.05) contrast(1.03)}
.still:after{content:'';position:absolute;inset:0;border-radius:22px;background:linear-gradient(180deg,rgba(0,0,0,0) 60%,rgba(4,16,24,.35))}
.card{position:absolute;left:92px;top:660px;width:896px;height:560px;background:#F4EBDD;transform:rotate(-1.6deg);border-radius:6px;
 box-shadow:0 26px 60px rgba(0,0,0,.55);padding:52px 50px 40px 56px;display:flex}
.card:before{content:'';position:absolute;inset:0;border-radius:6px;opacity:.5;background:radial-gradient(90% 70% at 30% 20%,rgba(255,255,255,.6),rgba(0,0,0,0) 60%),radial-gradient(60% 60% at 90% 100%,rgba(160,120,70,.18),rgba(0,0,0,0))}
.L{position:relative;width:500px;padding-right:34px;border-right:1.5px solid rgba(20,40,52,.22)}
.no{font:600 18px SG;letter-spacing:.4em;color:var(--acc)}
.t{font:italic 400 var(--fs,84px)/0.98 IS;color:#10283A;margin-top:18px;letter-spacing:-.005em}
.meta{font:500 19px SG;letter-spacing:.24em;color:#3E5462;margin-top:22px;text-transform:uppercase}
.rule{width:70px;height:2.5px;background:var(--acc);margin:26px 0 22px}
.line{font:italic 400 37px/1.18 IS;color:#2A3F4D}
.R{position:relative;flex:1;padding-left:34px}
.stamp{position:absolute;right:0;top:-6px;width:170px;height:206px;padding:12px;transform:rotate(3deg);
 background:radial-gradient(circle,#F4EBDD 4.6px,transparent 5.2px) -7px -7px/14px 14px,#FDF9F2;filter:drop-shadow(0 2px 3px rgba(0,0,0,.18))}
.stamp i{display:block;width:100%;height:150px;background-size:cover;background-position:center}
.stamp span{display:block;text-align:center;font:600 13px SG;letter-spacing:.3em;color:#10283A;margin-top:9px}
.pm{position:absolute;right:120px;top:120px;width:150px;height:150px;opacity:.62}
.addr{position:absolute;left:30px;right:-6px;bottom:24px}
.addr div{border-bottom:1.5px solid rgba(20,40,52,.25);height:64px;white-space:nowrap;font:italic 400 31px IS;color:#10283A;display:flex;align-items:flex-end;padding-bottom:6px}
.addr div small{font:500 15px SG;letter-spacing:.3em;color:#5C6E79;margin-right:12px;font-style:normal;min-width:66px;padding-bottom:6px}
`;
const waves = `<svg class="waves" width="1080" height="1350" viewBox="0 0 1080 1350">${Array.from({ length: 34 }, (_, i) => { const y = 20 + i * 40; return `<path d="M0 ${y} ${Array.from({ length: 28 }, (_, k) => `Q ${k * 40 + 20} ${y + (k % 2 ? 7 : -7)} ${k * 40 + 40} ${y}`).join(' ')}" fill="none" stroke="#BFE6F2" stroke-width="1.2"/>`; }).join('')}</svg>`;
const postmark = (txt, acc) => `<svg class="pm" viewBox="0 0 150 150"><circle cx="75" cy="75" r="56" fill="none" stroke="${acc}" stroke-width="3"/><circle cx="75" cy="75" r="44" fill="none" stroke="${acc}" stroke-width="1.5"/>
<path id="arc" d="M 31 75 A 44 44 0 0 1 119 75" fill="none"/><text font-family="SG" font-weight="600" font-size="11" letter-spacing="3" fill="${acc}"><textPath href="#arc" startOffset="50%" text-anchor="middle">${txt}</textPath></text>
<text x="75" y="88" text-anchor="middle" font-family="IS" font-style="italic" font-size="30" fill="${acc}">sea</text>
${[0, 1, 2, 3].map(k => `<path d="M ${-30} ${52 + k * 12} q 20 -8 40 0 t 40 0 t 40 0 t 40 0 t 40 0 t 40 0" fill="none" stroke="${acc}" stroke-width="2.2" transform="translate(${-60},0)"/>`).join('')}</svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (let i = 0; i < S.films.length; i++) {
    const f = S.films[i];
    const html = `<html><head><style>${css}</style></head><body style="--acc:${f.acc}">
<div class="page"></div>${waves}
<div class="top"><span>${S.kick}</span><b>0${i + 1} / 0${S.films.length}</b></div>
<div class="still" style="background-image:url(file://${D}/${f.a});--pos:${f.pos || '50% 50%'}"></div>
<div class="card"><div class="L"><div class="no">NO. 0${i + 1}</div><div class="t" style="--fs:${f.fs || 84}px">${f.t}</div>
<div class="meta">${f.yr} &nbsp;·&nbsp; ${f.dir}</div><div class="rule"></div><div class="line">${f.line}</div></div>
<div class="R"><div class="stamp"><i style="background-image:url(file://${D}/${f.b});background-position:${f.bpos || 'center'}"></i><span>SEA MAIL</span></div>
${postmark('WISH YOU WERE HERE', f.acc)}
<div class="addr"><div><small>WATCH</small>${f.where}</div><div><small>WHEN</small>${f.when}</div></div></div></div>
<div class="grain"></div></body></html>`;
    fs.writeFileSync(D + '/_s.html', html); await p.goto('file://' + D + '/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(250);
    await p.screenshot({ path: `${D}/out/0${i + 1}.jpg`, type: 'jpeg', quality: 93 });
  }
  await b.close();
})();
