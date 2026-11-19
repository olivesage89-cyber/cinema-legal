// node txt.js out.png "text" top% width_px  -> transparent 720x1280 PNG, TikTok-style white text with soft shadow
const { chromium } = require('playwright'); const fs = require('fs'); const path = require('path');
const font = require.resolve('@fontsource/tiktok-sans/files/tiktok-sans-latin-600-normal.woff2');
const FB = fs.readFileSync(font).toString('base64');
const [out, text, top, w] = process.argv.slice(2);
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  await p.setContent(`<html><head><style>@font-face{font-family:T;font-weight:600;src:url(data:font/woff2;base64,${FB})}
  html,body{margin:0;background:transparent}.t{position:absolute;left:50%;top:${top}%;transform:translate(-50%,-50%);width:${w}px;text-align:center;
  font-family:T;font-weight:600;font-size:34px;line-height:1.22;color:#fff;text-shadow:0 1px 4px rgba(0,0,0,.6),0 0 2px rgba(0,0,0,.4)}</style></head>
  <body><div class=t>${text}</div></body></html>`);
  await p.evaluate(() => document.fonts.ready); await p.screenshot({ path: out, omitBackground: true }); await b.close(); })();
