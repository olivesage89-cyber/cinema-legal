// Recreates Cinema's native search-results screen (from Native/SearchView.swift) at iPhone 16 Pro size
// (402x874pt @3x = 1206x2622px), plus framed versions inside an iPhone mockup.
// Usage: node appshot.js DIR   (DIR/app.json: {query, intro, rows:{name:[poster files in DIR]}})
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]);
const A = JSON.parse(fs.readFileSync(D + '/app.json'));
const ST = JSON.parse(fs.readFileSync(D + '/states.json'));
const F = path.resolve(process.env.ENGINE || (__dirname + '/../slideshow'), 'node_modules/@fontsource') + '/';
const font = [400, 500, 600, 700].map(w => `@font-face{font-family:SF;font-weight:${w};src:url(file://${F}inter/files/inter-latin-${w}-normal.woff2)}`).join('');
const coral = '#F95C4B', card = '#131218', field = '#242329', text = '#F4F2EF';
const chevron = `<svg width="18" height="11" viewBox="0 0 18 11"><path d="M1.5 1.5l7.5 7.5 7.5-7.5" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const mag = `<svg width="21" height="21" viewBox="0 0 21 21"><circle cx="8.6" cy="8.6" r="6.6" fill="none" stroke="${coral}" stroke-width="2.6"/><path d="M13.6 13.6l5.4 5.4" stroke="${coral}" stroke-width="2.8" stroke-linecap="round"/></svg>`;
const plus = `<svg width="20" height="20" viewBox="0 0 20 20"><path d="M10 2v16M2 10h16" stroke="${coral}" stroke-width="2.6" stroke-linecap="round"/></svg>`;
const status = `<div class="sb"><span class="time">9:41</span><div class="island"></div><span class="icons">
 <svg width="19" height="12" viewBox="0 0 19 12"><rect x="0" y="8" width="3.2" height="4" rx="1" fill="#fff"/><rect x="5" y="5.5" width="3.2" height="6.5" rx="1" fill="#fff"/><rect x="10" y="3" width="3.2" height="9" rx="1" fill="#fff"/><rect x="15" y="0" width="3.2" height="12" rx="1" fill="#fff"/></svg>
 <svg width="17" height="12" viewBox="0 0 17 12"><path d="M8.5 11.3l2.4-2.6a3.4 3.4 0 0 0-4.8 0z" fill="#fff"/><path d="M3.9 6.6a6.6 6.6 0 0 1 9.2 0l1.6-1.7a9 9 0 0 0-12.4 0z" fill="#fff"/><path d="M.8 3.3a11 11 0 0 1 15.4 0L17 2.4A12.3 12.3 0 0 0 0 2.4z" fill="#fff"/></svg>
 <svg width="27" height="13" viewBox="0 0 27 13"><rect x=".5" y=".5" width="23" height="12" rx="3.6" fill="none" stroke="#fff" stroke-opacity=".4"/><rect x="2.3" y="2.3" width="19.4" height="8.4" rx="2.2" fill="#fff"/><path d="M25 4.5v4c.8-.3 1.4-1.1 1.4-2s-.6-1.7-1.4-2z" fill="#fff" fill-opacity=".45"/></svg></span></div>`;
const rowsHtml = Object.entries(A.rows).map(([name, ps]) => `<div class="row"><div class="rname">${name}</div><div class="strip">${ps.map(p => `<img src="file://${D}/${p}">`).join('')}</div></div>`).join('');
const chips = ['cozy rainy day','spooky but fun','feel-good comfort','late night thriller','heartbreak','something weird'];
const idleHtml = `<div class="idle"><div class="mq">${[...A.rows['Top Results'],...Object.values(A.rows)[1]].slice(0,8).map(p => `<img src="file://${D}/${p}">`).join('')}</div>
  <div class="chips"><div>${chips.filter((_,i)=>i%2==0).map(c=>`<span>${c}</span>`).join('')}</div><div>${chips.filter((_,i)=>i%2==1).map(c=>`<span>${c}</span>`).join('')}</div></div></div>`;
const screenFor = (st) => `
<div class="screen">${status}
  <div class="hdr"><span>Search</span><div class="close">${chevron}</div></div>
  <div class="card">${st.mode === 'idle' ? idleHtml : `<div style="opacity:${st.op}">
    <div class="bubble">${A.query}</div>
    <div class="intro">${A.intro}</div>
    ${rowsHtml}</div>`}
  </div>
  <div class="bar">${mag}${st.typed !== undefined && st.typed.length ? `<span class="ty">${st.typed}<i class="caret" style="opacity:${st.caret ? 1 : 0}"></i></span>` : `<span class="ph">Search or describe…</span>`}${plus}</div>
  ${st.kb ? '<div class="kb"></div>' : ''}
  <div class="home"></div>
</div>`;
const screen = `
<div class="screen">${status}
  <div class="hdr"><span>Search</span><div class="close">${chevron}</div></div>
  <div class="card">
    <div class="bubble">${A.query}</div>
    <div class="intro">${A.intro}</div>
    ${rowsHtml}
  </div>
  <div class="bar">${mag}<span class="ph">Search or describe…</span>${plus}</div>
  <div class="home"></div>
</div>`;
const css = `${font}*{margin:0;padding:0;box-sizing:border-box}body{background:transparent;font-family:SF;-webkit-font-smoothing:antialiased}
.screen{position:relative;width:402px;height:874px;background:rgba(8,8,10,.18);border-radius:40px;border:1px solid rgba(255,255,255,.22);box-shadow:inset 0 0 30px rgba(255,255,255,.06);overflow:hidden;color:${text}}
.sb{position:absolute;top:0;left:0;right:0;height:54px;display:flex;align-items:center;justify-content:space-between;padding:0 30px 0 50px}
.time{font-weight:600;font-size:17px;letter-spacing:-.2px;color:#fff;padding-top:2px}
.island{position:absolute;left:50%;top:11px;width:124px;height:36px;margin-left:-62px;background:#000;border-radius:20px}
.icons{display:flex;gap:6px;align-items:center;padding-top:2px}
.hdr{position:absolute;top:54px;left:0;right:0;height:56px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:20px}
.close{position:absolute;right:16px;top:6px;width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;
  background:linear-gradient(180deg,rgba(255,255,255,.16),rgba(255,255,255,.07));box-shadow:inset 0 .5px 0 rgba(255,255,255,.35),inset 0 0 0 .5px rgba(255,255,255,.12)}
.card{position:absolute;top:116px;left:10px;right:10px;bottom:0;background:rgba(19,18,24,.38);border-radius:28px 28px 0 0;overflow:hidden;padding-top:18px}
.bubble{margin:0 16px 0 auto;width:max-content;max-width:300px;background:rgba(249,92,75,.9);color:#fff;font-weight:500;font-size:16px;padding:10px 16px;border-radius:20px}
.intro{margin:22px 16px 0;font-size:16px;line-height:1.3;color:rgba(255,255,255,.72)}
.row{margin-top:22px}.rname{font-weight:700;font-size:19px;margin:0 16px 10px;color:${text}}
.strip{display:flex;gap:8px;padding-left:16px;white-space:nowrap}
.strip img{width:112px;height:166px;border-radius:9px;object-fit:cover;flex:none}
.bar{position:absolute;left:16px;right:16px;bottom:42px;height:58px;border-radius:29px;display:flex;align-items:center;gap:10px;padding:0 18px 0 18px;
  background:rgba(36,35,41,.72);backdrop-filter:blur(18px);border:1.5px solid rgba(249,92,75,.85);box-shadow:0 8px 30px rgba(0,0,0,.45)}
.ph{flex:1;font-size:17px;color:rgba(255,255,255,.42)}
.idle{padding-top:34px}.mq{display:flex;gap:8px;padding-left:16px;overflow:hidden}.mq img{width:108px;height:160px;border-radius:9px;object-fit:cover;flex:none}
.chips{margin-top:16px;padding-left:16px;display:flex;flex-direction:column;gap:10px;overflow:hidden}.chips div{display:flex;gap:10px;white-space:nowrap}
.chips span{display:inline-block;height:44px;line-height:44px;padding:0 18px;border-radius:22px;font-size:16px;color:#F4F2EF;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.08)}
.ty{flex:1;font-size:17px;color:#fff}.caret{display:inline-block;width:2px;height:20px;background:#F95C4B;margin-left:1px;vertical-align:-4px}
.home{position:absolute;bottom:8px;left:50%;width:140px;height:5px;margin-left:-70px;border-radius:3px;background:rgba(255,255,255,.85)}
/* holo */.sb,.home{display:none!important}.hdr,.rname,.intro{text-shadow:0 1px 8px rgba(0,0,0,.6)}.island{display:none}
/* iPhone frame */
.phone{position:relative;width:446px;height:918px;border-radius:78px;padding:22px;
  background:linear-gradient(145deg,#4a4a4f 0%,#1b1b1e 18%,#2c2c30 50%,#141416 82%,#3d3d42 100%);
  box-shadow:0 0 0 1.5px #5c5c62 inset,0 0 0 3px #0b0b0c inset,0 50px 90px -20px rgba(0,0,0,.55),0 20px 40px -10px rgba(0,0,0,.35)}
.phone .bezel{position:absolute;inset:6px;border-radius:72px;background:#050505}
.phone .screen{position:relative;border-radius:56px;z-index:1}
.btn{position:absolute;width:5px;border-radius:2px;background:linear-gradient(90deg,#2a2a2d,#4b4b50)}
.glare{position:absolute;inset:22px;border-radius:56px;z-index:2;pointer-events:none;background:linear-gradient(125deg,rgba(255,255,255,.07) 0%,rgba(255,255,255,0) 32%)}
`;
const phone = `<div class="phone"><div class="bezel"></div>${screen}<div class="glare"></div>
 <div class="btn" style="left:-4px;top:170px;height:34px"></div><div class="btn" style="left:-4px;top:232px;height:64px"></div>
 <div class="btn" style="left:-4px;top:310px;height:64px"></div><div class="btn" style="right:-4px;top:260px;height:100px;background:linear-gradient(270deg,#2a2a2d,#4b4b50)"></div></div>`;
(async () => {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 402, height: 874 }, deviceScaleFactor: 2 });
  fs.mkdirSync(D + '/hstates', { recursive: true });
  for (const [i, st] of ST.entries()) {
    const ph = screenFor(st);
    fs.writeFileSync(D + '/_a.html', `<html><head><style>${css}</style></head><body>${ph}</body></html>`);
    await p.goto('file://' + D + '/_a.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(60);
    await p.screenshot({ path: `${D}/hstates/${String(i).padStart(3, '0')}.png`, omitBackground: true });
  }
  await b.close();
})();
