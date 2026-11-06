"""SMOKE & MIRRORS IG slides: python3 render_magic.py WORKDIR (reads plan.json + meta.json) -> WORKDIR/out/01..06.jpg
Deep-indigo starry page w/ violet glow, still inside an oval magic mirror (double ring), 'TRICK 0N / 05' kicker,
Mrs Saint Delafield 'a magic trick' corner script, Bodoni title, Montserrat DIR · year, italic line, rule, where.
Last slide = app phone only on blurred still."""
import json, os, sys, subprocess
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); M = json.load(open(f'{D}/meta.json'))
ENGINE = os.path.dirname(os.path.abspath(__file__)); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
INK = P['ink']; CREAM = '#F1EAF7'
CSS = ff('Bm', 'bodoni-moda', 400, 'italic') + ff('Bm', 'bodoni-moda', 600) + ff('Ms', 'montserrat', 500) + ff('Ms', 'montserrat', 600) + ff('Sd', 'mrs-saint-delafield', 400) + f"""
*{{margin:0;padding:0}}body{{width:1080px;height:1350px;overflow:hidden;color:{CREAM};text-align:center;position:relative;
background:radial-gradient(ellipse 620px 560px at 540px 470px,rgba(140,95,240,.42),rgba(11,7,22,0) 70%),#0B0716}}
.sp{{position:absolute;inset:0;background-image:radial-gradient(1.4px 1.4px at 20px 30px,rgba(235,225,255,.6),transparent),
radial-gradient(1px 1px at 90px 110px,rgba(235,225,255,.45),transparent),radial-gradient(2px 2px at 150px 60px,rgba(235,225,255,.35),transparent);background-size:180px 160px}}
.ov{{position:absolute;left:250px;top:90px;width:580px;height:760px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 5px {INK},0 0 0 14px #0B0716,0 0 0 16px rgba(215,205,235,.8),0 0 90px 20px rgba(150,100,255,.45)}}
.ov div{{width:100%;height:100%;background-size:cover;filter:saturate(1.05) contrast(1.04)}}
.k{{position:absolute;top:900px;width:100%;font:600 22px Ms;letter-spacing:.55em;padding-left:.55em;color:{INK}}}
.t{{position:absolute;top:940px;width:100%;font:600 84px/1.05 Bm}}
.d{{position:absolute;width:100%;font:500 21px Ms;letter-spacing:.35em;padding-left:.35em;opacity:.75}}
.l{{position:absolute;width:100%;font:400 italic 33px/1.35 Bm}}
.r{{position:absolute;width:100%;display:flex;justify-content:center;align-items:center;gap:16px;color:{CREAM}}}
.r i{{display:block;width:150px;height:1px;background:linear-gradient(90deg,transparent,{CREAM})}}.r i+b+i{{background:linear-gradient(90deg,{CREAM},transparent)}}
.w{{position:absolute;width:100%;font:600 22px Ms;letter-spacing:.3em;padding-left:.3em;color:{INK}}}
.sc{{position:absolute;left:46px;top:40px;font:400 62px Sd;transform:rotate(-8deg);opacity:.9}}
.br{{position:absolute;right:50px;top:58px;font:500 16px Ms;letter-spacing:.4em;opacity:.55}}
"""
keys = ['pre', 'ill', 'nysm', 'strange', 'oz']; pages = []
for i, (f, k) in enumerate(zip(P['films'], keys)):
    m = M[k]; img = f['slide']; two = '<br>' in f['t']; tb = 940 + (190 if two else 100)
    pages.append(f"""<div class='sp'></div><div class='sc'>a magic trick</div><div class='br'>0{i+1} / 05</div>
<div class='ov'><div style="background-image:url(file://{D}/{img[0]});background-position:{img[1]}% 50%"></div></div>
<div class='k'>✦ &nbsp;TRICK 0{i+1}&nbsp; ✦</div><div class='t' style='font-size:{74 if two else 84}px'>{f['t']}</div>
<div class='d' style='top:{tb+8}px'>{m['dir'][0].upper()} · {m['year']}</div>
<div class='l' style='top:{tb+56}px'>{f['line']}</div>
<div class='r' style='top:{tb+122}px'><i></i><b style='font:400 22px Bm'>✦</b><i></i></div>
<div class='w' style='top:{tb+150}px'>NOW SHOWING · {f['where'].upper()}</div>""")
html = {f'{i+1:02d}': f"<html><head><style>{CSS}</style></head><body>{p}</body></html>" for i, p in enumerate(pages)}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(300);await p.screenshot({path:'%s/'+k+'.png'});}await b.close();})();") % (json.dumps(html), O, O, O)
open(f'{O}/r.js', 'w').write(js); subprocess.run(f'cd {ENGINE} && node {O}/r.js', shell=True, check=True)
for k in html:
    Image.open(f'{O}/{k}.png').convert('RGB').save(f'{O}/{k}.jpg', quality=93); os.remove(f'{O}/{k}.png')
W, H = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(26)); bg = Image.blend(bg, Image.new('RGB', (W, H), (11, 7, 22)), 0.4)
ph = Image.open(f"{D}/phone.png").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 15, 115, (W + ph.width) // 2 - 15, 1290], 90, fill=150)
bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk.filter(ImageFilter.GaussianBlur(32)))
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06.jpg', quality=93)
print('slides done')
