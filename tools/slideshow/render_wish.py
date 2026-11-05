"""WISHING-STAR IG slides (1080x1350): night-sky gradient page with stars + 2 tiny constellations, big round 'moon window'
still with lilac ring + orbit ellipse + small round inset moon still, 'WISH Nº 0X / 05', Bodoni Moda italic title,
italic line, Space Grotesk 'year | where'. Usage: python3 render_wish.py WORKDIR (reads slides_wish.json)"""
import json, os, sys, random, subprocess
D = os.path.abspath(sys.argv[1]); C = json.load(open(f'{D}/slides_wish.json')); E = os.path.dirname(os.path.abspath(__file__))
F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
INK = C['ink']
CSS = ff('Bd', 'bodoni-moda', 500, 'italic') + ff('Bd', 'bodoni-moda', 400, 'italic') + ff('Bd', 'bodoni-moda', 500) + ff('Gv', 'great-vibes', 400) + ff('Sg', 'space-grotesk', 500) + \
 "*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;background:linear-gradient(180deg,#090B22,#1E1640);color:#FBF4FF;font-family:Bd;position:relative}" \
 ".st{position:absolute;border-radius:50%;background:#F5EEFF}.grain{position:absolute;inset:0;opacity:.07;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")}"
def stars(seed):
    random.seed(seed); s = ''
    for _ in range(140):
        r = random.choice([1.5, 2, 2, 3, 4]); s += f"<div class='st' style='left:{random.randrange(1080)}px;top:{random.randrange(1350)}px;width:{r}px;height:{r}px;opacity:{random.uniform(.25,.85):.2f}'></div>"
    for ax, ay in [(random.randint(60, 180), random.randint(70, 150)), (random.randint(860, 990), random.randint(1150, 1260))]:
        pts = [(ax, ay)]
        for _ in range(4): pts.append((min(1040, max(40, pts[-1][0] + random.randint(-60, 60))), pts[-1][1] + random.randint(-40, 40)))
        s += "<svg style='position:absolute;inset:0' width='1080' height='1350'><polyline points='" + ' '.join(f'{x},{y}' for x, y in pts) + f"' fill='none' stroke='{INK}' stroke-opacity='.5' stroke-width='1.6'/>"
        s += ''.join(f"<circle cx='{x}' cy='{y}' r='{random.choice([3,4,5])}' fill='#fff'/>" for x, y in pts) + "</svg>"
    return s
pages = {}
for i, f in enumerate(C['films']):
    big, small = f['big'], f['small']; R = 640; cx, cy = 540, 610
    h = stars(100 + i) + (
      f"<svg style='position:absolute;inset:0' width='1080' height='1350'><ellipse cx='{cx}' cy='{cy}' rx='{R//2+150}' ry='{int(R*0.17)}' fill='none' stroke='{INK}' stroke-opacity='.45' stroke-width='2'/>"
      f"<circle cx='{cx-R//2-150+40}' cy='{cy+int(R*0.17*0.55)}' r='7' fill='#fff' style='filter:drop-shadow(0 0 8px #fff)'/></svg>"
      f"<div style='position:absolute;left:{cx-R//2}px;top:{cy-R//2}px;width:{R}px;height:{R}px;border-radius:50%;background:url(file://{D}/{big[0]}) {big[1]}% {big[2]}%/cover;"
      f"box-shadow:0 0 0 10px #0C0D2A,0 0 0 13px {INK},0 0 60px {INK}55'></div>"
      f"<div style='position:absolute;left:{cx-R//2-14}px;top:{cy-R//2-14}px;width:{R+28}px;height:{R+28}px;border-radius:50%;border:1px solid rgba(255,250,255,.25)'></div>"
      f"<div style='position:absolute;left:{cx+R//2-170}px;top:{cy+R//2-200}px;width:230px;height:230px;border-radius:50%;background:url(file://{D}/{small[0]}) {small[1]}% {small[2]}%/cover;"
      f"box-shadow:0 0 0 6px #0C0D2A,0 0 0 8px #FBF4FF,0 10px 40px rgba(0,0,0,.6)'></div>"
      f"<div style='position:absolute;top:110px;width:100%;text-align:center;font:500 22px Sg;letter-spacing:.55em;padding-left:.55em;color:{INK}'>WISH Nº 0{i+1} / 05</div>"
      f"<div style='position:absolute;top:1000px;width:100%;text-align:center'><div style='font:500 italic {f.get('fs',76)}px/1.05 Bd;text-shadow:0 0 30px {INK}55'>{f['t']}</div>"
      f"<div style='font:400 italic 33px/1.3 Bd;margin:20px auto 0;max-width:860px;opacity:.92'>{f['line']}</div>"
      f"<div style='font:500 21px Sg;letter-spacing:.34em;padding-left:.34em;margin-top:22px;color:{INK}'>{f['dir'].upper()} &nbsp;·&nbsp; {f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>"
      "<div class='grain'></div>")
    pages[f'0{i+1}'] = h
html = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(250);"
      "await p.screenshot({path:'%s/out/'+k+'.jpg',type:'jpeg',quality:93});}await b.close();})();") % (json.dumps(html), D, D, D)
open(f'{D}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js', shell=True, check=True)
# app slide: phone only on blurred still
from PIL import Image, ImageFilter, ImageDraw
W, H = 1080, 1350; bg = Image.open(f"{D}/{C['app_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t = (bg.height - H) // 2
bg = bg.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(26)); bg = Image.blend(bg, Image.new('RGB', (W, H), (14, 12, 38)), 0.35)
ph = Image.open(f'{D}/phone.png').convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).rounded_rectangle([(W-ph.width)//2+20, (H-1180)//2+40, (W+ph.width)//2-20, (H+1180)//2+30], 100, fill=150)
bg = Image.composite(Image.new('RGB', (W, H)), bg, mk.filter(ImageFilter.GaussianBlur(36)))
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{D}/out/06_cinema.jpg', quality=93); print('ok')
