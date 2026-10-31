"""SUMMER PRINTS video (1080x1920). Usage: python3 printvid.py WORKDIR  (reads plan.json -> video.mp4)
Look: burst of photo prints slapping down with camera flash -> full-bleed drifting title shots w/ handwritten +
Caprasimo title -> per film: blurred warm still as table, white-bordered photo prints drop onto a growing stack
(jump cut every ~1.1s, drift inside print, orange LCD date stamp), Caprasimo title + Plex Mono 'EXP 0X / 05' on top,
handwritten line + 'year | where' below, warm light leak between films -> framed app phone end card (no text).
Frames are composed in PIL and piped to ffmpeg."""
import json, os, subprocess, sys, random, math
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#FFD45C'); STAMP = '#FF8A2B'
IW, IH, BD = 940, 528, 22           # print image area + white border
PCY = P.get('pcy', 965)             # print centre y
def sh(c): subprocess.run(c, shell=True, check=True)
_cache = {}
def load(f):
    if f not in _cache: _cache[f] = Image.open(f'{D}/{f}').convert('RGB')
    return _cache[f]

def drift(img, w, h, k, x=50, y=50, zin=True, dx=1, zoom=0.07):
    """crop of img at progress k (0..1) with slow zoom + pan, resized to w x h"""
    im = load(img); s = max(w / im.width, h / im.height)
    z = 1 + zoom * (k if zin else 1 - k)
    cw, ch = w / (s * z), h / (s * z)
    cx = (im.width - cw) * x / 100 + dx * (k - .5) * cw * 0.03; cy = (im.height - ch) * y / 100
    cx = min(max(cx, 0), im.width - cw); cy = min(max(cy, 0), im.height - ch)
    return im.resize((w, h), Image.BICUBIC, box=(cx, cy, cx + cw, cy + ch))

# ---------- overlays (Playwright) ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, s='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{s};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{s}.woff2)}}"
CSS = ff('Cap', 'caprasimo', 400) + ff('Hand', 'nothing-you-could-do', 400) + ff('Mono', 'ibm-plex-mono', 400) + ff('Mono', 'ibm-plex-mono', 500) + \
      ff('LCD', 'vt323', 400) + ff('Cor', 'cormorant-garamond', 500, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF4E2;text-align:center}}"
pages = {}
ti = P['title']
pages['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1000px;background:linear-gradient(180deg,rgba(28,14,4,.72),rgba(28,14,4,.38) 55%,rgba(28,14,4,0))'></div>"
    f"<div style='position:absolute;top:{ti.get('top',230)}px;width:100%'>"
    f"<div style='font:500 26px Mono;letter-spacing:.48em;padding-left:.48em;color:#FFF4E2'>{ti['kick']}</div>"
    f"<div style='font:400 104px/1.15 Hand;color:#FFF4E2;margin-top:34px;transform:rotate(-4deg);text-shadow:0 3px 24px rgba(0,0,0,.45)'>{ti['hero']}</div>"
    f"<div style='font:400 214px/0.95 Cap;color:{INK};margin-top:-6px;letter-spacing:.01em;text-shadow:0 6px 0 rgba(120,50,10,.35),0 10px 50px rgba(0,0,0,.35)'>{ti['hero2']}</div>"
    f"<div style='font:italic 500 46px Cor;margin-top:26px;color:#FFF4E2;text-shadow:0 2px 18px rgba(0,0,0,.8)'>{ti['sub']}</div></div>"
    f"<div style='position:absolute;right:70px;top:1500px;font:400 64px LCD;color:{STAMP};letter-spacing:.06em;text-shadow:0 0 10px rgba(255,120,30,.9),0 0 26px rgba(255,90,20,.55)'>{ti['stamp']}</div>")
NF = len(P['films'])
for i, f in enumerate(P['films']):
    acc = f.get('acc', INK)
    pages[f'f{i}'] = (
        f"<div style='position:absolute;top:0;left:0;width:100%;height:560px;background:linear-gradient(180deg,rgba(20,10,4,.55),rgba(20,10,4,0))'></div>"
        f"<div style='position:absolute;top:0;left:0;width:100%;top:1330px;height:590px;background:linear-gradient(0deg,rgba(20,10,4,.55),rgba(20,10,4,0))'></div>"
        f"<div style='position:absolute;top:{P.get('ttop',230)}px;width:100%'>"
        f"<div style='font:500 25px Mono;letter-spacing:.46em;padding-left:.46em;color:{acc}'>EXP 0{i+1} / 0{NF}</div>"
        f"<div style='font:400 {f.get('fs',96)}px/1.0 Cap;color:#FFF4E2;margin-top:26px;text-shadow:0 5px 0 rgba(90,40,10,.35),0 8px 40px rgba(0,0,0,.4)'>{f['t']}</div></div>"
        f"<div style='position:absolute;top:{P.get('btop',1385)}px;width:100%'>"
        f"<div style='font:400 50px/1.3 Hand;color:#FFF4E2;margin:0 90px;text-wrap:balance;transform:rotate(-2deg);text-shadow:0 2px 16px rgba(0,0,0,.55)'>{f['line']}</div>"
        f"<div style='font:500 26px Mono;letter-spacing:.3em;padding-left:.3em;color:{acc};margin-top:30px'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
    pages[f'st{i}'] = f"<div style='position:absolute;left:0;top:0;font:400 46px LCD;color:{STAMP};letter-spacing:.06em;text-shadow:0 0 8px rgba(255,120,30,.95),0 0 20px rgba(255,90,20,.6);padding:14px 18px'>{f['stamp']}</div>"
html = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(html), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
OV = {k: Image.open(f'{T}/{k}.png').convert('RGBA') for k in pages}
for i in range(NF):
    s = OV[f'st{i}']; OV[f'st{i}'] = s.crop(s.getbbox())

# ---------- helpers ----------
def table(img, x=50):
    """blurred, warm, darkened still as the table surface"""
    b = drift(img, W // 4, H // 4, 0.5, x=x, zoom=0).filter(ImageFilter.GaussianBlur(7)).resize((W, H), Image.BICUBIC)
    b = ImageEnhance.Color(b).enhance(1.15)
    return Image.blend(b, Image.new('RGB', (W, H), (40, 20, 8)), 0.34)

def make_print(item, k, stamp=None, seed=0):
    img, x, y = (item, 50, 50) if isinstance(item, str) else (item[0], item[1], item[2] if len(item) > 2 else 50)
    random.seed(seed)
    ph = drift(img, IW, IH, k, x=x, y=y, zin=random.random() < .5, dx=random.choice([-1, 1]))
    ph = ImageEnhance.Color(ph).enhance(1.06)
    pr = Image.new('RGBA', (IW + 2 * BD, IH + 2 * BD), (250, 246, 238, 255)); pr.paste(ph, (BD, BD))
    if stamp is not None:
        pr.alpha_composite(stamp, (BD + IW - stamp.width - 14, BD + IH - stamp.height - 6))
    return pr

SHADOW = {}
def place(canvas, pr, ang, cx, cy, scale=1.0, alpha=1.0):
    r = pr.rotate(ang, Image.BICUBIC, expand=True)
    if scale != 1.0: r = r.resize((int(r.width * scale), int(r.height * scale)), Image.BICUBIC)
    key = (r.width, r.height)
    if key not in SHADOW:
        sm = Image.new('L', (r.width + 120, r.height + 120), 0); sm.paste(r.split()[3], (60, 60))
        SHADOW[key] = sm.filter(ImageFilter.GaussianBlur(22)).point(lambda v: int(v * .55))
    sm = SHADOW[key]
    if alpha < 1: sm = sm.point(lambda v: int(v * alpha)); a = r.split()[3].point(lambda v: int(v * alpha)); r.putalpha(a)
    canvas.paste((0, 0, 0), (int(cx - r.width / 2 - 60 + 10), int(cy - r.height / 2 - 60 + 22)), sm)
    canvas.alpha_composite(r, (int(cx - r.width / 2), int(cy - r.height / 2)))

def leak(canvas, k):
    """warm light leak, k 0..1 strength"""
    g = Image.new('L', (W // 4, H // 4), 0); ImageDraw.Draw(g).ellipse([W // 4 - 160, -60, W // 4 + 90, 260], fill=255)
    g = g.filter(ImageFilter.GaussianBlur(40)).resize((W, H)).point(lambda v: int(v * k))
    canvas.paste((255, 150, 60), (0, 0), g)

ffm = subprocess.Popen(f"ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s {W}x{H} -r {FPS} -i - -vf \"eq=saturation=1.02:contrast=1.03,"
                       f"noise=alls=4:allf=t,vignette=PI/6,format=yuv420p\" -c:v libx264 -preset slow -crf 23 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4",
                       shell=True, stdin=subprocess.PIPE)
def emit(im): ffm.stdin.write(im.convert('RGB').tobytes())
def ease(t): return 1 - (1 - min(max(t, 0), 1)) ** 3

# 1. burst: prints slapping down + camera flash
fl = int(P.get('flash', 0.2) * FPS)
btab = table(P['burst_bg'])
stack = []
for j, b in enumerate(P['burst']):
    random.seed(100 + j); ang = random.uniform(-6, 6); ox = random.uniform(-40, 40); oy = random.uniform(-60, 60)
    for q in range(fl):
        c = btab.copy().convert('RGBA')
        for s in stack[-2:]: place(c, *s)
        pr = make_print(b, q / fl, seed=j)
        place(c, pr, ang, W / 2 + ox, PCY + oy, scale=1.0 + 0.08 * (1 - ease(q / 2)))
        if q < 2: c.alpha_composite(Image.new('RGBA', (W, H), (255, 250, 240, int(140 * (1 - q / 2)))))
        emit(c)
    stack.append((make_print(b, 1, seed=j), ang, W / 2 + ox, PCY + oy))

# 2. title: full-bleed drifting cuts + overlay rising in
tshots = ti['shots']; tf = 0
TOT = sum(int(s['dur'] * FPS) for s in tshots)
for k, s in enumerate(tshots):
    n = int(s['dur'] * FPS)
    for q in range(n):
        c = drift(s['img'], W, H, q / n, x=s.get('x', 50), zin=k % 2 == 0, dx=1 if k % 2 else -1, zoom=0.06).convert('RGBA')
        a = ease((tf - 3) / 20); o = OV['title']
        if a > 0:
            o2 = o.copy(); o2.putalpha(o.split()[3].point(lambda v: int(v * a)))
            c.alpha_composite(o2, (0, int(40 * (1 - a))))
        if q < 2 and k > 0: c.alpha_composite(Image.new('RGBA', (W, H), (255, 240, 220, 120 if q == 0 else 50)))
        emit(c); tf += 1

# 3. films: prints drop onto a growing stack
SEG = P.get('seg', 3.3)
for i, f in enumerate(P['films']):
    its = f['items']; n = int(SEG * FPS); per = n // len(its)
    tab = table(f.get('bg', its[0] if isinstance(its[0], str) else its[0][0]), x=50)
    random.seed(i * 31); angs = [random.uniform(-5, 5) for _ in its]; offs = [(random.uniform(-26, 26), random.uniform(-30, 30)) for _ in its]
    done = []
    for q in range(n):
        j = min(q // per, len(its) - 1); lq = q - j * per; pn = per if j < len(its) - 1 else n - j * per
        if lq == 0 and j > 0: done.append((make_print(its[j - 1], 1, OV[f'st{i}'], seed=i * 10 + j - 1), angs[j - 1], W / 2 + offs[j - 1][0], PCY + offs[j - 1][1]))
        zf = 1 + 0.0025 * q
        c = tab.resize((int(W * zf), int(H * zf)), Image.BILINEAR).crop((int((W * zf - W) / 2), int((H * zf - H) / 2), int((W * zf - W) / 2) + W, int((H * zf - H) / 2) + H)).convert('RGBA')
        for s in done[-2:]: place(c, *s)
        pr = make_print(its[j], lq / pn, OV[f'st{i}'], seed=i * 10 + j)
        e = ease(lq / 6)
        place(c, pr, angs[j] + (1 - e) * (4 if j % 2 else -4), W / 2 + offs[j][0], PCY + offs[j][1] + (1 - e) * 30, scale=1 + 0.10 * (1 - e), alpha=min(1, 0.35 + e))
        a = ease(q / 9); o = OV[f'f{i}']
        if a < 1:
            o2 = o.copy(); o2.putalpha(o.split()[3].point(lambda v: int(v * a))); c.alpha_composite(o2, (0, int(26 * (1 - a))))
        else: c.alpha_composite(o)
        if q < 6: leak(c, 0.85 * (1 - q / 6))
        emit(c)

# 4. end card: framed phone on blurred still, no text
bgi = drift(P['end_bg'], W, H, 0.5, x=P.get('end_x', 50), zoom=0).filter(ImageFilter.GaussianBlur(28))
bgi = Image.blend(bgi, Image.new('RGB', (W, H), (24, 12, 6)), 0.38)
ph = Image.open(P['phone']).convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mm = Image.new('L', (W, H), 0)
ImageDraw.Draw(mm).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mm = mm.filter(ImageFilter.GaussianBlur(40)); bgi = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bgi, mm)
bgi.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bgi.save(f'{D}/endcard.jpg', quality=93)
en = int(P.get('end_dur', 3.4) * FPS)
for q in range(en):
    zf = 1 + 0.035 * q / en; e = ease(q / 8)
    c = bgi.resize((int(W * zf), int(H * zf)), Image.BICUBIC); l = (c.width - W) // 2; t0 = (c.height - H) // 2
    c = c.crop((l, t0, l + W, t0 + H))
    if e < 1: c = Image.blend(Image.new('RGB', (W, H), (255, 236, 210)), c, 0.4 + 0.6 * e)
    emit(c)
ffm.stdin.close(); ffm.wait()
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
