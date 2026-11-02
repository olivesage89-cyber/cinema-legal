"""HORIZON FIELD CARD IG slides. Usage: python3 render_desert.py WORKDIR (reads slides_desert.json) -> out/0N.jpg"""
import json, os, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageFilter
D = os.path.abspath(sys.argv[1]); S = json.load(open(f'{D}/slides_desert.json'))
O = f'{D}/out'; os.makedirs(O, exist_ok=True)
F = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
ACC = '#7FD8CF'
CSS = ff('Sy', 'syne', 700) + ff('Sy', 'syne', 800) + ff('Sg', 'space-grotesk', 500) + ff('Sg', 'space-grotesk', 400) + \
      ff('Co', 'cormorant-garamond', 500, 'italic') + ff('Pi', 'pinyon-script', 400) + f"""
*{{margin:0;padding:0;box-sizing:border-box}}
body{{width:1080px;height:1350px;background:#170E09;color:#F6EADB;position:relative;overflow:hidden;font-family:Sg}}
.glow{{position:absolute;inset:0;background:radial-gradient(ellipse 900px 600px at 50% 30%,rgba(196,98,40,.28),transparent 70%)}}
.grain{{position:absolute;inset:0;opacity:.09;background:url(file://{D}/_grain.png);mix-blend-mode:screen}}
.hd{{position:absolute;top:46px;left:60px;right:60px;display:flex;justify-content:space-between;align-items:baseline;font:500 21px Sg;letter-spacing:.34em;color:{ACC}}}
.hd .m{{font:400 52px Pi;letter-spacing:0;color:#F6EADB;position:relative;top:10px}}
.big{{position:absolute;top:118px;left:40px;width:1000px;height:700px;border-radius:6px;background-size:cover;box-shadow:0 30px 70px rgba(0,0,0,.55)}}
.sun{{position:absolute;top:684px;right:74px;width:250px;height:250px;border-radius:50%;background-size:cover;border:5px solid #F6EADB;box-shadow:0 0 0 2px {ACC},0 20px 50px rgba(0,0,0,.6)}}
.rule{{position:absolute;top:842px;left:40px;width:1000px;height:3px;background:linear-gradient(90deg,{ACC},{ACC} 60%,transparent)}}
.t{{position:absolute;top:888px;left:60px;width:640px;font:700 76px/1.02 Sy;letter-spacing:.03em;text-transform:uppercase}}
.d{{position:absolute;left:62px;font:500 22px Sg;letter-spacing:.3em;color:#D9C2A8}}
.l{{position:absolute;left:60px;width:900px;font:500 italic 44px/1.2 Co;color:#F6EADB}}
.ft{{position:absolute;bottom:50px;left:60px;right:60px;display:flex;justify-content:space-between;font:400 19px Sg;letter-spacing:.26em;color:#BFA88E;border-top:1px solid rgba(246,234,219,.22);padding-top:20px}}
.ft b{{color:{ACC};font-weight:500}}
"""
from PIL import Image as I
import random
g = I.new('L', (540, 675)); px = g.load(); random.seed(3)
for y in range(675):
    for x in range(540): px[x, y] = random.randint(0, 255)
g.resize((1080, 1350)).save(f'{D}/_grain.png')
with sync_playwright() as p:
    b = p.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for i, f in enumerate(S['films']):
        lines = f['t'].count('<br>') + 1; ty = 888 + lines * 78 + 18
        html = f"""<html><head><style>{CSS}</style></head><body><div class=glow></div>
<div class=hd><span>THE DESERT</span><span class=m>where the horizon never ends</span><span>Nº 0{i+1} / 05</span></div>
<div class=big style="background-image:url(file://{D}/{f['big']});background-position:{f.get('bx',50)}% 50%"></div>
<div class=rule></div>
<div class=sun style="background-image:url(file://{D}/{f['sun']});background-position:{f.get('sx',50)}% 50%"></div>
<div class=t>{f['t']}</div>
<div class=d style="top:{ty}px">DIR. {f['dir'].upper()} &nbsp;·&nbsp; {f['yr']}</div>
<div class=l style="top:{ty+50}px">{f['line']}</div>
<div class=ft><span>FILMED IN · {f['loc'].upper()}</span><span>WATCH ON <b>{f['where'].upper()}</b></span></div>
<div class=grain></div></body></html>"""
        open(f'{D}/_s.html', 'w').write(html); pg.goto(f'file://{D}/_s.html'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(200)
        pg.screenshot(path=f'{O}/_s.png'); I.open(f'{O}/_s.png').convert('RGB').save(f'{O}/0{i+1}.jpg', quality=93)
    b.close()
# app slide: phone only on blurred still
W, H = 1080, 1350
bg = I.open(f"{D}/{S['app_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t = (bg.height - H) // 2
bg = bg.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(30)); bg = I.blend(bg, I.new('RGB', (W, H), (23, 14, 9)), 0.3)
ph = I.open(f'{D}/phone.png').convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), I.LANCZOS)
sh = I.new('L', (W, H), 0); from PIL import ImageDraw
ImageDraw.Draw(sh).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1180) // 2 + 30, (W + ph.width) // 2 - 20, (H + 1180) // 2 + 25], 90, fill=150)
bg = I.composite(I.new('RGB', (W, H), (0, 0, 0)), bg, sh.filter(ImageFilter.GaussianBlur(35)))
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print('slides done')
