"""SCOREBOARD CARD IG slides (1080x1350). Usage: python3 render_cheer.py WORKDIR  (reads plan.json + slides key)
Top: deep-green louvred scoreboard w/ glowing bulb rows + gold frame ('★ GAME 0N / 05 ★', Graduate title, gold Oswald
'year | where', Cormorant italic line); below: two stills stacked edge to edge w/ dark seam. + app slide (phone only)."""
import json, os, sys, random
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
from playwright.sync_api import sync_playwright
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = f'file://{E}/node_modules/@fontsource/'
INK = P.get('ink', '#F4B63F'); CREAM = '#F6EEDC'; GREEN = '#0C1F17'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url({F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Gr', 'graduate', 400) + ff('Os', 'oswald', 500) + ff('Os', 'oswald', 600) + ff('Cg', 'cormorant-garamond', 500, 'italic')
def bulbs(y): return (f"<div style='position:absolute;left:0;top:{y}px;width:100%;height:20px;"
                      f"background:radial-gradient(circle,#FFD98A 0 4px,rgba(255,196,90,.45) 5px,transparent 9px) 0 0/30px 20px'></div>")
louvre = "repeating-linear-gradient(180deg,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,0) 2px 7px)"
BH = 470
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for i, f in enumerate(P['films']):
        s = P['slides'][i]
        st = ''.join(f"<div style='position:absolute;left:0;top:{BH + k*440}px;width:1080px;height:440px;background:url(file://{D}/{im}) {x}% {y}%/cover'></div>"
                     for k, (im, x, y) in enumerate(s))
        html = (f"<html><head><style>{CSS}*{{margin:0;padding:0}}body{{width:1080px;height:1350px;background:{GREEN};color:{CREAM};text-align:center;position:relative;overflow:hidden}}</style></head><body>"
                f"{st}<div style='position:absolute;left:0;top:{BH+438}px;width:100%;height:5px;background:{GREEN}'></div>"
                f"<div style='position:absolute;left:0;top:0;width:100%;height:{BH}px;background:{louvre},radial-gradient(ellipse at 50% 45%,#16352A,{GREEN} 70%)'></div>"
                f"{bulbs(12)}{bulbs(BH-40)}"
                f"<div style='position:absolute;left:38px;top:42px;width:998px;height:{BH-96}px;border:3px solid {INK};border-radius:8px;box-shadow:0 0 18px rgba(244,182,63,.25) inset'></div>"
                f"<div style='position:absolute;left:0;top:{BH-4}px;width:100%;height:4px;background:{INK}'></div>"
                f"<div style='position:absolute;top:72px;width:100%;font:600 25px Os;letter-spacing:.5em;padding-left:.5em;color:{INK}'>★&nbsp; UNDERDOG · GAME 0{i+1} / 05 &nbsp;★</div>"
                f"<div style='position:absolute;top:114px;width:100%;height:180px;display:flex;align-items:center;justify-content:center'>"
                f"<div style='font:400 {int(f.get('fs',84)*0.95)}px/1.04 Gr;text-shadow:4px 4px 0 rgba(0,0,0,.55)'>{f['t']}</div></div>"
                f"<div style='position:absolute;top:304px;width:100%'><div style='font:500 27px Os;letter-spacing:.32em;padding-left:.32em;color:{INK}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                f"<div style='font:italic 500 38px/1.12 Cg;margin-top:14px;color:#EDE4D0'>{f['line']}</div></div></body></html>")
        open(f'{D}/_s.html', 'w').write(html); pg.goto(f'file://{D}/_s.html'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(200)
        pg.screenshot(path=f'{O}/_{i}.png')
    b.close()
random.seed(3)
def finish(im):
    im = ImageEnhance.Contrast(im).enhance(1.04)
    n = Image.effect_noise(im.size, 18).convert('L'); n = Image.merge('RGB', (n, n, n))
    return Image.blend(im, n, 0.035)
for i in range(len(P['films'])):
    im = Image.open(f'{O}/_{i}.png').convert('RGB'); finish(im).save(f'{O}/0{i+1}_{P["films"][i]["slug"]}.jpg', quality=93); os.remove(f'{O}/_{i}.png')
# app slide
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); W, H = 1080, 1350; s = max(W / bgi.width, H / bgi.height)
bgi = bgi.resize((int(bgi.width * s) + 1, int(bgi.height * s) + 1), Image.LANCZOS)
bgi = bgi.crop(((bgi.width - W) // 2, (bgi.height - H) // 2, (bgi.width - W) // 2 + W, (bgi.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(34))).enhance(0.55)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 15, (H - 1180) // 2 + 30, (W + ph.width) // 2 - 15, (H + 1180) // 2 + 22], 90, fill=160)
mk = mk.filter(ImageFilter.GaussianBlur(30)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print('ok', sorted(os.listdir(O)))
