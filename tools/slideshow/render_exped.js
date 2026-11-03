// FIELD JOURNAL inside slides (expedition). Usage: node render_exped.js WORKDIR  (reads WORKDIR/ig.json -> ig/0N.jpg)
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const C = JSON.parse(fs.readFileSync(D + '/ig.json'));
const F = path.resolve(__dirname, 'node_modules/@fontsource') + '/';
const ff = (f, p, w, s = 'normal') => `@font-face{font-family:${f};font-weight:${w};font-style:${s};src:url(file://${F}${p}/files/${p}-latin-${w}-${s}.woff2)}`;
const css = ff('Fs', 'im-fell-english-sc', 400) + ff('Fe', 'im-fell-english', 400) + ff('Fe', 'im-fell-english', 400, 'italic') + ff('Se', 'special-elite', 400) + `
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;position:relative;overflow:hidden;background:url(file://${D}/ig/parch.jpg);color:#2B2014}
.hd{position:absolute;top:58px;left:70px;right:70px;display:flex;justify-content:space-between;align-items:center;font:400 22px Se;letter-spacing:.28em;color:#6B4F2A}
.big{position:absolute;top:128px;left:62px;width:956px;height:590px;background:#FBF6EA;padding:16px 16px 16px;box-shadow:0 14px 30px rgba(60,40,15,.35),0 2px 4px rgba(60,40,15,.3);transform:rotate(-1.2deg)}
.big div{width:100%;height:100%;background-size:cover}
.tape{position:absolute;width:150px;height:44px;background:rgba(232,220,180,.78);box-shadow:0 1px 3px rgba(0,0,0,.15)}
.sm{position:absolute;top:836px;right:66px;width:360px;height:300px;background:#FBF6EA;padding:14px 14px 50px;box-shadow:0 10px 22px rgba(60,40,15,.35);transform:rotate(3.5deg)}
.sm div{width:100%;height:100%;background-size:cover}
.sm span{position:absolute;bottom:12px;left:0;right:0;text-align:center;font:400 italic 25px Fe;color:#5A4426}
.tx{position:absolute;top:820px;left:78px;width:540px}
.loc{font:400 21px Se;letter-spacing:.24em}
.t{font:400 70px/1.0 Fs;margin-top:16px}
.meta{font:400 22px Se;letter-spacing:.16em;color:#5A4426;margin-top:18px}
.rule{width:120px;height:2px;margin:24px 0 22px}
.ln{font:400 italic 37px/1.25 Fe;color:#3A2C1A;text-wrap:balance}
.ft{position:absolute;bottom:56px;left:78px;right:70px;display:flex;align-items:center;gap:18px;font:400 21px Se;letter-spacing:.22em;color:#6B4F2A}
`;
const compass = c => `<svg width="46" height="46" viewBox="-32 -32 64 64"><circle r="22" fill="none" stroke="${c}" stroke-width="2"/><path d="M0-30L5 0 0 30-5 0Z" fill="${c}"/><path d="M-30 0L0-5 30 0 0 5Z" fill="${c}" opacity=".5"/></svg>`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  for (const [i, f] of C.films.entries()) {
    const html = `<html><head><style>${css}</style></head><body>
<div class="hd"><span>FIELD JOURNAL &nbsp;·&nbsp; Nº 0${i + 1} / 05</span>${compass(f.ink)}</div>
<div class="big"><div style="background-image:url(file://${D}/${f.a});background-position:${f.ax || 50}% ${f.ay || 50}%"></div></div>
<div class="tape" style="top:106px;left:110px;transform:rotate(-8deg)"></div><div class="tape" style="top:96px;right:110px;transform:rotate(6deg)"></div>
<div class="tx"><div class="loc" style="color:${f.ink}">${f.loc}</div><div class="t" style="color:${f.ink};font-size:${f.fs || 70}px">${f.t}</div>
<div class="meta">DIR. ${f.dir.toUpperCase()} · ${f.yr}</div><div class="rule" style="background:${f.ink}"></div><div class="ln">${f.line}</div></div>
<div class="sm"><div style="background-image:url(file://${D}/${f.b});background-position:${f.bx || 50}% ${f.by || 50}%"></div><span>${f.cap}</span></div>
<div class="tape" style="top:814px;right:200px;width:120px;transform:rotate(12deg)"></div>
<div class="ft"><svg width="230" height="40"><path d="M6 30 C 60 0, 110 40, 170 16" fill="none" stroke="#6B4F2A" stroke-width="3" stroke-dasharray="10 8"/><g transform="translate(200 14)" stroke="#B23A26" stroke-width="5" stroke-linecap="round"><path d="M-10-10L10 10M10-10L-10 10"/></g></svg><span>WATCH ON ${f.where.toUpperCase()}</span></div>
</body></html>`;
    fs.writeFileSync(D + '/ig/_s.html', html); await p.goto('file://' + D + '/ig/_s.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(200);
    await p.screenshot({ path: `${D}/ig/0${i + 1}.png` });
  }
  await b.close();
})();
