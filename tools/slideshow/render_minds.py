"""CHALKBOARD PROOF slides (1080x1350). Usage: python3 render_minds.py WORKDIR (reads slides.json) -> out/01..06.jpg
Slate chalkboard w/ smudges + faint chalk equations; mint mono kicker; big rounded still + 2 small rounded stills w/
chalk outlines; Gloock chalk title, Caveat line, mono DIR · year, wavy chalk rule, mint 'WATCH ON · where'.
Last slide = app phone only on the plain board (no text). Text is chalk-textured."""
import json, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); S = json.load(open(f'{D}/slides.json')); O = f'{D}/out'; os.makedirs(O, exist_ok=True)
T = f'{D}/_s'; os.makedirs(T, exist_ok=True)
ENGINE = os.path.dirname(os.path.abspath(__file__)); W, H = 1080, 1350
INK = S.get('ink', '#8EE3C2'); CHALK = '#EEF1EA'; BG = (24, 33, 30)
def chalkify(im, amt, seed):
    a = np.asarray(im.getchannel('A')).astype(np.float32); rng = np.random.default_rng(seed)
    nz = np.asarray(Image.fromarray((rng.random(a.shape) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32)
    nz = (nz - nz.mean()) / (nz.std() + 1e-6); m = np.clip(1 - amt * 0.5 + nz * amt * 0.55, 0.15, 1)
    im.putalpha(Image.fromarray(np.clip(a * m, 0, 255).astype(np.uint8))); return im
def board(w, h, seed=3):
    random.seed(seed); rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w]; r = np.sqrt(((xx - w / 2) / w) ** 2 + ((yy - h * .4) / h) ** 2)
    img = Image.fromarray(np.clip(np.stack([BG[0] + 10 - r * 22, BG[1] + 12 - r * 24, BG[2] + 10 - r * 22], -1), 0, 255).astype(np.uint8)).convert('RGBA')
    sm = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(sm)
    for _ in range(20):
        x, y = random.randint(-200, w), random.randint(-100, h); d.ellipse([x, y, x + random.randint(250, 700), y + random.randint(60, 200)], fill=(200, 215, 205, random.randint(8, 20)))
    img = Image.alpha_composite(img, sm.filter(ImageFilter.GaussianBlur(45)))
    gr = Image.fromarray((rng.random((h, w)) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    gl = Image.new('RGBA', (w, h), (230, 240, 232, 0)); gl.putalpha(gr.point(lambda v: max(0, v - 140) // 9)); return Image.alpha_composite(img, gl)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Gl', 'gloock', 400) + ff('Cv', 'caveat', 500) + ff('Mo', 'ibm-plex-mono', 500) + ff('Mo', 'ibm-plex-mono', 600) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CHALK};text-align:center;position:relative;overflow:hidden}}"
EQS = ["e<sup>iπ</sup> + 1 = 0", "E = mc²", "∫ f(x) dx", "P ≠ NP ?", "1. e4 e5  2. Nf3", "OBP > AVG", "Σ 1/n² = π²/6", "Δx · Δp ≥ ħ/2",
       "a² + b² = c²", "x = (−b ± √(b²−4ac)) / 2a", "1729 = 1³+12³", "Qxf7#", "n → ∞", "ψ(x,t)"]
def wavy(w, c, sw=4):
    pts = ' '.join(f"{x},{8 + 4 * np.sin(x / 37) + 2 * np.sin(x / 11):.1f}" for x in range(0, w + 1, 6))
    return f"<svg width='{w}' height='18'><polyline points='{pts}' fill='none' stroke='{c}' stroke-width='{sw}' stroke-linecap='round'/></svg>"
MAIN = (60, 104, 960, 520); SM = [(60, 646, 468, 262), (552, 646, 468, 262)]
pages = {}
for i, f in enumerate(S['films']):
    random.seed(40 + i); eq = ''
    for k in range(5):   # equations only in the slim margins below the text
        eq += (f"<div style='position:absolute;left:{random.randint(-60,W-260)}px;top:{random.choice([1268,1290])}px;font:500 {random.randint(34,46)}px Cv;opacity:.08;"
               f"transform:rotate({random.uniform(-6,6):.1f}deg);white-space:nowrap'>{random.choice(EQS)}</div>")
    imgs = ''.join(f"<div style='position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:26px;background:url(file://{D}/{im[0]}) {im[1]}% {im[2]}%/cover'></div>"
                   for (x, y, w, h), im in zip([MAIN] + SM, f['imgs']))
    pages[f'i{i}'] = imgs
    outl = ''.join(f"<div style='position:absolute;left:{x-7}px;top:{y-7}px;width:{w+8}px;height:{h+8}px;border:3px solid rgba(238,241,234,.8);border-radius:32px'></div>" for (x, y, w, h) in [MAIN] + SM)
    pages[f't{i}'] = (eq + outl +
        f"<div style='position:absolute;top:40px;width:100%;font:600 24px Mo;letter-spacing:.4em;padding-left:.4em;color:{INK}'>BRILLIANT MINDS · Nº 0{i+1} / 05</div>"
        f"<div style='position:absolute;top:938px;width:100%;font:400 {f.get('fs',84)}px/1 Gl'>{f['t']}</div>"
        f"<div style='position:absolute;top:1040px;width:100%;font:500 44px/1.1 Cv;padding:0 50px'>{f['line']}</div>"
        f"<div style='position:absolute;top:1120px;width:100%;font:500 24px Mo;letter-spacing:.28em;padding-left:.28em'>{f['dir'].upper()} · {f['yr']}</div>"
        f"<div style='position:absolute;top:1166px;width:100%;display:flex;justify-content:center'>{wavy(420, CHALK)}</div>"
        f"<div style='position:absolute;top:1206px;width:100%;font:600 24px Mo;letter-spacing:.32em;padding-left:.32em;color:{INK}'>WATCH ON · {f['where'].upper()}</div>")
html = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(200);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(html), T, T, T)
open(f'{T}/s.js', 'w').write(js); subprocess.run(f'cd {ENGINE} && node {T}/s.js', shell=True, check=True)
grain = Image.fromarray(np.clip(128 + np.random.default_rng(9).normal(0, 9, (H, W)), 0, 255).astype(np.uint8))
for i in range(len(S['films'])):
    bd = board(W, H, seed=3 + i)
    bd = Image.alpha_composite(bd, Image.open(f'{T}/i{i}.png'))
    bd = Image.alpha_composite(bd, chalkify(Image.open(f'{T}/t{i}.png').convert('RGBA'), 0.45, 7 + i)).convert('RGB')
    arr = np.asarray(bd).astype(np.float32) + (np.asarray(grain).astype(np.float32)[..., None] - 128) * 0.35
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8)).save(f'{O}/0{i+1}.jpg', quality=93)
bg = board(W, H, seed=21).convert('RGB')
ph = Image.open(f"{D}/{S['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1180 / ph.height), 1180), Image.LANCZOS)
mk = Image.new('L', (W, H), 0); x0, y0 = (W - ph.width) // 2, (H - 1180) // 2
ImageDraw.Draw(mk).rounded_rectangle([x0 + 16, y0 + 30, x0 + ph.width - 16, y0 + 1180 + 20], 90, fill=150)
bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk.filter(ImageFilter.GaussianBlur(32)))
bg.paste(ph, (x0, y0), ph); bg.save(f'{O}/06.jpg', quality=93); print('slides done')
