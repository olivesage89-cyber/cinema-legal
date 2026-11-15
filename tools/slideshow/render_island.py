"""ISLAND POSTCARD IG slides (1080x1350). Usage: python3 render_island.py WORKDIR  (plan.json, needs ig picks in plan['ig'])
Lagoon page, Space Mono kicker + signal bars, big still + 2 small stills edge to edge, sand Shrikhand title, coral year|where,
Cormorant italic line, Space Mono DIR; slide 6 = app phone on blurred lagoon, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Sh', 'shrikhand', 400) + ff('Sm', 'space-mono', 700) + ff('In', 'inter', 600) + ff('Co', 'cormorant-garamond', 500, 'italic') +
       "*{margin:0;padding:0;box-sizing:border-box}body{width:1080px;height:1350px;overflow:hidden;color:#F6E9D2;text-align:center;"
       "background:radial-gradient(ellipse 900px 520px at 50% -120px,rgba(60,150,140,.55),rgba(0,0,0,0)),linear-gradient(180deg,#062E30,#03201F)}"
       ".k{position:absolute;top:44px;width:100%;font:700 22px Sm;letter-spacing:.24em;padding-left:.24em;color:#5FE0D4}"
       ".im{position:absolute;background-size:cover;filter:saturate(1.06) contrast(1.04)}"
       ".t{position:absolute;top:986px;width:100%;font:400 112px/1.15 Sh;white-space:nowrap}"
       ".y{position:absolute;top:1128px;width:100%;font:600 24px In;letter-spacing:.3em;padding-left:.3em}"
       ".l{position:absolute;top:1172px;left:60px;right:60px;font:italic 500 50px/1.1 Co}"
       ".d{position:absolute;top:1262px;width:100%;font:700 19px Sm;letter-spacing:.28em;padding-left:.28em;color:#FF7F66;opacity:.9}"
       ".gr{position:absolute;inset:0;pointer-events:none;opacity:.10;background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/></filter><rect width='200' height='200' filter='url(%23n)'/></svg>\")}")
def bars():
    return "<span style='display:inline-flex;align-items:flex-end;gap:3px;vertical-align:-1px;margin-left:10px'>" + ''.join(
        f"<span style='width:6px;height:{7+k*5}px;border:2px solid #5FE0D4;border-radius:2px;opacity:.75'></span>" for k in range(4)) + "</span>"
def pos(x, y): return f"background-position:{x}% {y}%"
pages = {}
for i, f in enumerate(P['films']):
    a, b, c = f['ig']
    h = (f"<div class=k>ISLAND 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}{bars()}</div>"
         f"<div class=im style='left:0;top:100px;width:1080px;height:600px;background-image:url(file://{D}/{a[0]});{pos(a[1],a[2])}'></div>"
         f"<div class=im style='left:0;top:704px;width:538px;height:270px;background-image:url(file://{D}/{b[0]});{pos(b[1],b[2])}'></div>"
         f"<div class=im style='left:542px;top:704px;width:538px;height:270px;background-image:url(file://{D}/{c[0]});{pos(c[1],c[2])}'></div>"
         f"<div class=t><span>{f['t']}</span></div><div class=y>{f['yr']} &nbsp;<span style='color:#FF7F66'>|</span>&nbsp; {f['where'].upper()}</div>"
         f"<div class=l>{f['line']}</div><div class=d>{f['dir']}</div><div class=gr></div>")
    pages[f'0{i+1}_{f["t"].lower().replace(" ","_")}'] = f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{h}</body></html>"
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.evaluate(()=>{const e=document.querySelector('.t');const sp=e.querySelector('span');let s=112;while(sp.offsetWidth>980&&s>50){s-=2;e.style.fontSize=s+'px'}});"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png'});}await b.close();})();") % (json.dumps(pages), O, O, O)
open(f'{O}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {O}/_s.js', shell=True, check=True)
for k in pages:
    Image.open(f'{O}/{k}.png').convert('RGB').save(f'{O}/{k}.jpg', quality=93); os.remove(f'{O}/{k}.png')
# app slide
W, H = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28)); bg = Image.blend(bg, Image.new('RGB', (W, H), (3, 40, 42)), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); x0, y0 = (W - ph.width) // 2, (H - 1180) // 2
ImageDraw.Draw(mk).rounded_rectangle([x0 + 16, y0 + 30, x0 + ph.width - 16, y0 + 1180 + 20], 90, fill=150)
bg = Image.composite(Image.new('RGB', (W, H)), bg, mk.filter(ImageFilter.GaussianBlur(32)))
bg.paste(ph, (x0, y0), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print(sorted(os.listdir(O)))
