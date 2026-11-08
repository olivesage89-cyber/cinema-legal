"""SUPER 8 TAPE IG slides (1080x1350). Usage: python3 render_adv.py WORKDIR (reads plan.json films[i].slide {main,x,pol,px})
Night-navy page w/ flashlight glow, VT323 '● TAPE 0X / 05 · PLACE', big still in a rounded Super-8 frame (black strip + backlit
sprocket holes), a 2nd still as a tilted polaroid taped over its lower right, masking-tape label w/ Permanent Marker title,
mono year|where, Caveat line. + app slide: phone only on blurred still (no text)."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
INK, ACC = '#F5EBD8', '#FF6A3D'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Pm', 'permanent-marker', 400) + ff('Sm', 'space-mono', 700) + ff('Cv', 'caveat', 500) + ff('Vt', 'vt323', 400) + "*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden}"
AX, AY, AW, AH = 150, 165, 840, 720
DOT = "<span style='display:inline-block;width:17px;height:17px;border-radius:50%;background:#FF2E2E;box-shadow:0 0 12px #FF2E2E;margin-right:14px;vertical-align:2px'></span>"
TAPE = "clip-path:polygon(0 6%,3% 0,7% 5%,12% 1%,18% 4%,25% 0,33% 3%,41% 0,50% 4%,58% 0,66% 3%,74% 0,81% 4%,88% 0,94% 4%,100% 1%,98% 50%,100% 96%,94% 100%,87% 95%,80% 100%,72% 96%,64% 100%,55% 95%,46% 100%,38% 96%,30% 100%,22% 95%,14% 100%,7% 96%,1% 100%,2% 50%)"
holes = ''.join(f"<rect x='{AX-50}' y='{y}' width='22' height='32' rx='5' fill='#F3E3BE' fill-opacity='.85'/>" for y in range(AY + 22, AY + AH - 26, 84))
pages = {}
for i, f in enumerate(P['films']):
    s = f['slide']; img = f"file://{D}/{s['main']}"; pol = f"file://{D}/{s['pol']}"; rot = -1.6 if i % 2 == 0 else 1.4
    pages[f'0{i+1}'] = f"""<div style='position:absolute;inset:0;background:radial-gradient(ellipse 75% 50% at 50% 38%,#1E2A44,#0D1323 62%,#070A14)'></div>
<div style='position:absolute;left:-220px;top:-280px;width:880px;height:880px;background:radial-gradient(circle,rgba(255,214,140,.15),rgba(255,214,140,0) 65%)'></div>
<div style='position:absolute;top:52px;width:100%;text-align:center;font:400 44px Vt;letter-spacing:.08em;color:{INK}'>{DOT}TAPE 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>
<svg style='position:absolute;left:0;top:0' width='1080' height='1350'><defs><filter id='g'><feGaussianBlur stdDeviation='6'/></filter></defs>
<rect x='{AX-72}' y='{AY-24}' width='{AW+96}' height='{AH+48}' rx='14' fill='#060609'/><g filter='url(#g)' opacity='.55'>{holes}</g>{holes}</svg>
<div style='position:absolute;left:{AX}px;top:{AY}px;width:{AW}px;height:{AH}px;border-radius:26px;overflow:hidden'>
 <div style='position:absolute;inset:0;background:url({img}) {s.get('x',50)}% {s.get('y',50)}%/cover;filter:saturate(1.06) contrast(1.05) sepia(.08)'></div>
 <div style='position:absolute;inset:0;box-shadow:inset 0 0 60px rgba(0,0,0,.55)'></div></div>
<div style='position:absolute;left:{AX+AW-250}px;top:{AY+AH-250}px;width:270px;padding:14px 14px 52px;background:#F4EFE4;transform:rotate(5deg);box-shadow:0 14px 34px rgba(0,0,0,.6)'>
 <div style='width:270px;height:250px;background:url({pol}) {s.get('px',50)}% 50%/cover;filter:saturate(1.02) sepia(.1)'></div>
 <div style='position:absolute;left:85px;top:-18px;width:120px;height:38px;background:rgba(236,225,198,.88);transform:rotate(-6deg);{TAPE}'></div></div>
<div style='position:absolute;top:{AY+AH+118}px;width:100%;text-align:center'>
 <div style='display:inline-block;transform:rotate({rot}deg);background:#ECE1C6;padding:16px 50px 12px;{TAPE};'><div style='font:400 {int(f.get('fs',70)*.92)}px/1.05 Pm;color:#1C1B24;white-space:nowrap'>{f['t']}</div></div>
 <div style='font:700 22px Sm;letter-spacing:.3em;padding-left:.3em;color:{ACC};margin-top:28px'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>
 <div style='font:500 48px/1.15 Cv;margin-top:8px;color:{INK}'>{f['line']}</div></div>"""
H = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(300);await p.screenshot({path:'%s/'+k+'.png'});}await b.close();})();") % (json.dumps(H), D, D, O)
open(f'{D}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js', shell=True, check=True)
for k in H:
    im = Image.open(f'{O}/{k}.png').convert('RGB')
    g = Image.effect_noise((1080, 1350), 22).convert('RGB'); im = Image.blend(im, g, 0.035)
    im.save(f'{O}/{k}.jpg', quality=93); os.remove(f'{O}/{k}.png')
W, Hh = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, Hh / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - Hh) // 2
bg = bg.crop((l, t0, l + W, t0 + Hh)).filter(ImageFilter.GaussianBlur(30)); bg = Image.blend(bg, Image.new('RGB', (W, Hh), (8, 11, 22)), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, Hh), 0); ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 16, (Hh - 1180) // 2 + 30, (W + ph.width) // 2 - 16, (Hh + 1180) // 2 + 24], 90, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(34)); bg = Image.composite(Image.new('RGB', (W, Hh), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (Hh - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print('slides done')
