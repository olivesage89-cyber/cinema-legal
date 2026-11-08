// Vivian RELATABLE carousel (format E): lazy selfie + one small line in TikTok's own text style (TikTok Sans, dark navy,
// no outline), sitting in the empty ceiling/wall space. Usage: node render_rel.js DIR   (DIR/rel.json)
// rel.json: {"slides":[{"img":"p.jpg","t":"i don't text first anymore","x":50,"y":60,"tx":56,"ty":44,"w":560,"c":"#1B2440"},
//                      {"app":"phone.png","bg":"p.jpg"}]}   -> DIR/out/01.jpg ... (1080x1350)
// x,y = crop focus %; tx,ty = text centre %; w = text box width px; c = text colour (use #FFFFFF on dark photos).
// An {"app"} slide = phone.png centred on a heavily blurred, darkened copy of bg. NO text.
const { chromium } = require('playwright'); const fs = require('fs'), path = require('path');
const D = path.resolve(process.argv[2]); const S = JSON.parse(fs.readFileSync(D + '/rel.json'));
const F = path.join(__dirname, '..', 'node_modules', '@fontsource', 'tiktok-sans', 'files');
const css = `@font-face{font-family:T;font-weight:500;src:url(file://${F}/tiktok-sans-latin-500-normal.woff2)}
*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;background:#000;font-family:T}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.t{position:absolute;text-align:center;font-weight:500;font-size:40px;line-height:1.2;letter-spacing:-.005em;transform:translate(-50%,-50%)}
.blur{filter:blur(38px) brightness(.55) saturate(1.1);transform:scale(1.15)}
.ph{position:absolute;left:50%;top:50%;height:1180px;transform:translate(-50%,-50%);filter:drop-shadow(0 30px 60px rgba(0,0,0,.55))}`;
(async () => {
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 } });
  fs.mkdirSync(D + '/out', { recursive: true });
  for (const [i, s] of S.slides.entries()) {
    const body = s.app
      ? `<img class="bg blur" src="file://${D}/${s.bg}"><img class="ph" src="file://${D}/${s.app}">`
      : `<img class="bg" src="file://${D}/${s.img}" style="object-position:${s.x ?? 50}% ${s.y ?? 60}%">
         <div class="t" style="left:${s.tx ?? 54}%;top:${s.ty ?? 42}%;width:${s.w || 560}px;color:${s.c || '#1B2440'}">${s.t}</div>`;
    fs.writeFileSync(D + '/_r.html', `<html><head><style>${css}</style></head><body>${body}</body></html>`);
    await p.goto('file://' + D + '/_r.html'); await p.evaluate(() => document.fonts.ready); await p.waitForTimeout(100);
    await p.screenshot({ path: `${D}/out/${String(i + 1).padStart(2, '0')}.jpg`, type: 'jpeg', quality: 92 });
  }
  await b.close();
})();
