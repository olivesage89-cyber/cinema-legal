"""ANCIENT EPIC IG slides (1080x1350). Usage: python3 render_epic.py WORKDIR  (reads plan.json films[i].slide {main,x,coin,cx})
Dark bronze page w/ faint diagonal marble veins, laurel crown + 'Nº 0X / 05 · PLACE', tall Roman ARCH still in double gold outline,
gold-rimmed round COIN medallion w/ 2nd still overlapping the arch's lower right, gold year|where, Marcellus SC title,
Spectral italic line. + app slide: phone only on blurred still (no text)."""
import json, os, subprocess, sys, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
E = os.path.dirname(os.path.abspath(__file__)); F = E + '/node_modules/@fontsource/'
INK, GOLD = '#F6EBD6', '#E3B25F'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Mc', 'marcellus-sc', 400) + ff('Js', 'jost', 500) + ff('Sp', 'spectral', 400, 'italic') + "*{margin:0;padding:0}body{width:1080px;height:1350px;overflow:hidden}"
def laurel(wd=110, flip=False):
    lv = []
    for k in range(7):
        t = k / 6; x = 10 + t * (wd - 30); y = 40 - 26 * math.sin(t * math.pi * .55); ang = -20 - 25 * t
        for s in (1, -1):
            lv.append(f"<ellipse cx='{x:.1f}' cy='{y + s*7:.1f}' rx='10' ry='3.8' transform='rotate({ang + s*38:.0f} {x:.1f} {y + s*7:.1f})' fill='{GOLD}'/>")
    tr = " style='transform:scaleX(-1)'" if flip else ''
    return f"<svg width='{wd}' height='56' viewBox='0 0 {wd} 56'{tr}><path d='M6 42 Q {wd*.55} 30 {wd-14} 12' stroke='{GOLD}' stroke-width='1.6' fill='none'/>{''.join(lv)}</svg>"
CROWN = f"<div style='display:flex;align-items:flex-end;justify-content:center;gap:4px'>{laurel()}<svg width='14' height='14' viewBox='-7 -7 14 14'><polygon points='0,-6 6,0 0,6 -6,0' fill='{GOLD}'/></svg>{laurel(flip=True)}</div>"
AX, AY, AW, AH = 190, 205, 700, 800; R = AW // 2
def ap(o):
    return f"M{AX-o} {AY+AH+o} L{AX-o} {AY+R} A{R+o} {R+o} 0 0 1 {AX+AW+o} {AY+R} L{AX+AW+o} {AY+AH+o} Z"
pages = {}
for i, f in enumerate(P['films']):
    s = f['slide']; img = f"file://{D}/{s['main']}"; coin = f"file://{D}/{s['coin']}"
    pages[f'0{i+1}'] = f"""<div style='position:absolute;inset:0;background:radial-gradient(ellipse 85% 60% at 50% 42%,#3A2214,#1C0F08 70%,#120904)'></div>
<div style='position:absolute;inset:0;opacity:.07;background:repeating-linear-gradient(115deg,transparent 0 46px,#F6EBD6 46px 47px,transparent 47px 140px)'></div>
<div style='position:absolute;left:28px;top:28px;right:28px;bottom:28px;border:1.4px solid {GOLD};opacity:.45'></div>
<div style='position:absolute;top:62px;width:100%;text-align:center;font:500 22px Js;letter-spacing:.44em;padding-left:.44em;color:{INK};opacity:.9'>Nº 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>
<div style='position:absolute;top:100px;width:100%;display:flex;justify-content:center;transform:scale(.8)'>{CROWN}</div>
<div style='position:absolute;left:{AX}px;top:{AY}px;width:{AW}px;height:{AH}px;border-radius:{R}px {R}px 0 0;overflow:hidden;box-shadow:inset 0 0 40px rgba(0,0,0,.6)'>
 <div style='position:absolute;inset:0;background:url({img}) {s.get('x',50)}% {s.get('y',50)}%/cover;filter:saturate(1.04) contrast(1.04)'></div>
 <div style='position:absolute;inset:0;box-shadow:inset 0 0 50px rgba(10,5,2,.65)'></div></div>
<svg style='position:absolute;left:0;top:0' width='1080' height='1350'><path d='{ap(14)}' fill='none' stroke='{GOLD}' stroke-width='2.2'/>
<path d='{ap(26)}' fill='none' stroke='{GOLD}' stroke-width='1' stroke-opacity='.55'/>
<polygon points='540,{AY-40} 551,{AY-28} 540,{AY-16} 529,{AY-28}' fill='{GOLD}'/>
<line x1='{AX-26}' y1='{AY+AH+38}' x2='{AX+AW+26}' y2='{AY+AH+38}' stroke='{GOLD}' stroke-opacity='.35' stroke-width='1.2'/></svg>
<div style='position:absolute;left:{AX+AW-150}px;top:{AY+AH-200}px;width:230px;height:230px;border-radius:50%;padding:7px;background:linear-gradient(135deg,#F4D58E,#A87A32 55%,#E9C276);box-shadow:0 10px 30px rgba(0,0,0,.55)'>
 <div style='width:100%;height:100%;border-radius:50%;border:2px solid #5A3D16;box-sizing:border-box;background:url({coin}) {s.get('cx',50)}% 50%/cover'></div></div>
<div style='position:absolute;top:{AY+AH+70}px;left:60px;right:60px;text-align:center'>
 <div style='font:500 21px Js;letter-spacing:.4em;padding-left:.4em;color:{GOLD}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>
 <div style='font:400 {int(f.get('fs',88)*.82)}px/1.05 Mc;letter-spacing:.03em;color:{INK};margin-top:14px'>{f['t']}</div>
 <div style='font:400 italic 34px/1.3 Sp;margin-top:10px;color:{INK};opacity:.9'>{f['line'].replace('<br>',' ')}</div></div>"""
H = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1350}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_s.html',O[k]);await p.goto('file://%s/_s.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(300);await p.screenshot({path:'%s/'+k+'.png'});}await b.close();})();") % (json.dumps(H), D, D, O)
open(f'{D}/_s.js', 'w').write(js); subprocess.run(f'cd {E} && node {D}/_s.js', shell=True, check=True)
import random
for k in H:
    im = Image.open(f'{O}/{k}.png').convert('RGB')
    g = Image.effect_noise((1080, 1350), 22).convert('RGB'); im = Image.blend(im, g, 0.035)
    im.save(f'{O}/{k}.jpg', quality=93); os.remove(f'{O}/{k}.png')
W, Hh = 1080, 1350
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, Hh / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - Hh) // 2
bg = bg.crop((l, t0, l + W, t0 + Hh)).filter(ImageFilter.GaussianBlur(30)); bg = Image.blend(bg, Image.new('RGB', (W, Hh), (24, 13, 7)), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, Hh), 0); ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 16, (Hh - 1180) // 2 + 30, (W + ph.width) // 2 - 16, (Hh + 1180) // 2 + 24], 90, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(32)); bg = Image.composite(Image.new('RGB', (W, Hh), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (Hh - 1180) // 2), ph); bg.save(f'{O}/06_cinema.jpg', quality=93)
print(sorted(os.listdir(O)))
