"""SECRET GARDEN IG slides (FILM STRIP layout on moss page). Usage: python3 render_garden.py WORKDIR -> WORKDIR/out/01..06.jpg"""
import json, os, sys, subprocess, random, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
INK, ACC = P['ink'], P['acc']
CSS = (ff('Bd', 'bodoni-moda', 500, 'italic') + ff('Cs', 'cormorant-sc', 600) + ff('Cg', 'cormorant-garamond', 500, 'italic') +
       "*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden}")
rnd = random.Random(11)
def leaf(x, y, a, s, op): return f"<path transform='translate({x:.0f},{y:.0f}) rotate({a:.0f}) scale({s:.2f})' d='M0 0 C 12 -16 34 -18 52 0 C 34 18 12 16 0 0 Z' fill='#9FC79A' fill-opacity='{op:.3f}'/>"
LEAVES = ''.join(leaf(rnd.uniform(-40, 1080), rnd.uniform(-40, 1350), rnd.uniform(0, 360), rnd.uniform(1.2, 3), rnd.uniform(.035, .075)) for _ in range(34))
def img(f, x, y, w, h, px, py):
    return (f"<div style='position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:24px;overflow:hidden;"
            f"box-shadow:0 0 0 1.5px rgba(242,163,179,.55),0 18px 40px rgba(0,0,0,.45);background:url(file://{D}/{f}) {px}% {py}%/cover'></div>")
pages = {}
for i, f in enumerate(P['films']):
    s = f['stills']; sm = [s[1], s[2], s[3]]
    big = img(s[0][0], 70, 300, 940, 560, s[0][1], s[0][2])
    small = ''.join(img(q[0], 70 + k * 320, 884, 300, 210, q[1], q[2]) for k, q in enumerate(sm))
    pages[f'0{i+1}'] = (f"<div style='position:absolute;inset:0;background:radial-gradient(ellipse 80% 55% at 50% 45%,#1D3A27,#12281B 60%,#0A1810)'></div>"
        f"<svg style='position:absolute;left:0;top:0' width='1080' height='1350'>{LEAVES}</svg>"
        f"<div style='position:absolute;top:70px;width:100%;text-align:center;font:600 28px Cs;letter-spacing:.34em;padding-left:.34em;color:{ACC}'>Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
        f"<div style='position:absolute;top:118px;width:100%;text-align:center;font:italic 500 {f.get('fs',92)}px/1.1 Bd;color:{INK}'>{f['t']}</div>"
        f"<div style='position:absolute;top:236px;width:100%;text-align:center;font:600 28px Cs;letter-spacing:.3em;padding-left:.3em;color:{ACC}'>{f['yr']} &nbsp;|&nbsp; {f['where']}</div>"
        f"{big}{small}"
        f"<div style='position:absolute;top:1140px;left:50%;width:120px;margin-left:-60px;height:1.5px;background:{ACC};opacity:.7'></div>"
        f"<div style='position:absolute;top:1172px;width:100%;text-align:center;font:italic 500 52px Cg;color:{INK}'>{f['line']}</div>"
        f"<div style='position:absolute;top:1250px;width:100%;text-align:center;font:600 22px Cs;letter-spacing:.5em;padding-left:.5em;color:rgba(246,238,223,.55)'>❦ &nbsp;A SECRET GARDEN&nbsp; ❦</div>")
html = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const H=%s;for(const k of Object.keys(H)){fs.writeFileSync('%s/_s.html',H[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);"
      "await p.screenshot({path:'%s/'+k+'.png'});}await b.close();})();") % (json.dumps(html), O, O, O)
open(f'{O}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {O}/_s.js', shell=True, check=True)
for k in pages:
    im = Image.open(f'{O}/{k}.png').convert('RGB'); im.save(f'{O}/{k}.jpg', quality=93); os.remove(f'{O}/{k}.png')
# app slide: phone only on blurred still
W, H = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t = (bg.height - H) // 2
bg = bg.crop((l, t, l + W, t + H)).filter(ImageFilter.GaussianBlur(30)); bg = Image.blend(bg, Image.new('RGB', (W, H), (12, 26, 17)), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 16, (H - 1180) // 2 + 30, (W + ph.width) // 2 - 16, (H + 1180) // 2 + 24], 90, fill=150)
bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk.filter(ImageFilter.GaussianBlur(30)))
bg.paste(ph, ((W - ph.width) // 2, (H - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print('ok')
