"""SATURDAY MORNING IG slides (render_saturday.py WORKDIR): per title a grape page w/ pastel sparkles, big rounded CRT still
+ 2 small rounded stills, Silkscreen 'CH 0x' + Fredoka title, accent Fredoka line, Silkscreen meta -> out/01..05.jpg;
+ out/06_cinema.jpg = framed app phone on blurred still (no text)."""
import json, os, sys, random
from PIL import Image, ImageFilter, ImageDraw
from playwright.sync_api import sync_playwright
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); S = json.load(open(f'{D}/slides.json'))
O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
css = ff('Fr', 'fredoka', 600) + ff('Fr', 'fredoka', 700) + ff('Px', 'silkscreen', 400) + ff('Px', 'silkscreen', 700)
sp = []; rnd = random.Random(3)
for (x, y) in [(60, 60), (1015, 80), (40, 700), (1040, 640), (70, 1290), (1010, 1280), (540, 1318), (300, 40), (800, 1310)]:
    c = rnd.choice(['#FF9ED2', '#7CF2B0', '#FFD36E', '#8FD8FF', '#C4B0FF']); s = rnd.choice([18, 24, 30])
    sp.append(f"<div style='position:absolute;left:{x-s/2}px;top:{y-s/2}px;width:{s}px;height:{s}px;background:{c};opacity:.85;clip-path:polygon(50% 0,61% 39%,100% 50%,61% 61%,50% 100%,39% 61%,0 50%,39% 39%)'></div>")
SC = "background-image:repeating-linear-gradient(0deg,rgba(12,0,24,.13) 0 1px,transparent 1px 4px)"
def scr(img, x, y, w, h, px=50, py=50, z=1.0):
    return (f"<div style='position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:44px;overflow:hidden;"
            f"box-shadow:0 0 0 4px rgba(255,236,248,.7),0 18px 50px rgba(0,0,0,.45)'>"
            f"<div style='position:absolute;inset:0;background:url(file://{D}/{img}) {px}% {py}%/{'cover' if z==1 else str(int(z*100))+'%'} no-repeat;filter:saturate(1.08) contrast(1.03)'></div>"
            f"<div style='position:absolute;inset:0;{SC}'></div>"
            f"<div style='position:absolute;inset:0;border-radius:44px;box-shadow:inset 0 0 70px rgba(30,10,60,.45)'></div>"
            f"<div style='position:absolute;left:40px;top:12px;width:42%;height:26%;border-radius:50%;background:radial-gradient(rgba(255,255,255,.16),transparent 70%)'></div></div>")
with sync_playwright() as pw:
    b = pw.chromium.launch(); pg = b.new_page(viewport={'width': 1080, 'height': 1350})
    for i, f in enumerate(P['films']):
        sl = S[i]; ac = f['accent']
        body = (f"<div style='position:absolute;inset:0;background:radial-gradient(ellipse 120% 50% at 50% 0%,#542E78,#22163A 70%)'></div>" + ''.join(sp) +
                f"<div style='position:absolute;top:70px;width:100%;text-align:center;font:700 26px Px;letter-spacing:.16em;color:{ac}'>CH 0{i+1} &#9656; SAT 8:{(i*30)%60:02d} AM</div>"
                f"<div style='position:absolute;top:112px;width:100%;text-align:center;font:700 {sl.get('fs',72)}px/1.05 Fr;color:#FFF7FB'>{f['t']}</div>" +
                scr(sl['big'][0], 50, 235, 980, 560, sl['big'][1], sl['big'][2]) +
                scr(sl['a'][0], 50, 830, 475, 300, sl['a'][1], sl['a'][2], *(sl['a'][3:])) + scr(sl['b'][0], 555, 830, 475, 300, sl['b'][1], sl['b'][2], *(sl['b'][3:])) +
                f"<div style='position:absolute;top:1168px;width:100%;text-align:center;font:600 46px Fr;color:{ac}'>{f['line']}</div>"
                f"<div style='position:absolute;top:1240px;width:100%;text-align:center;font:400 25px Px;letter-spacing:.16em;color:#EADFF5'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>")
        open(f'{D}/_s.html', 'w').write(f"<html><head><style>{css}*{{margin:0}}body{{width:1080px;height:1350px;position:relative;overflow:hidden;background:#22163A}}</style></head><body>{body}</body></html>")
        pg.goto(f'file://{D}/_s.html'); pg.evaluate('document.fonts.ready'); pg.wait_for_timeout(250)
        pg.screenshot(path=f'{O}/_{i}.png')
        im = Image.open(f'{O}/_{i}.png').convert('RGB')
        nz = Image.effect_noise(im.size, 12).convert('RGB'); im = Image.blend(im, nz, 0.03)
        im.save(f'{O}/0{i+1}_{sl["slug"]}.jpg', quality=93); os.remove(f'{O}/_{i}.png')
    b.close()
W, H = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(26)); bg = Image.blend(bg, Image.new('RGB', (W, H), (34, 22, 58)), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 16, (H - 1180) // 2 + 30, (W + ph.width) // 2 - 16, (H + 1180) // 2 + 24], 90, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(32)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print('slides ok')
