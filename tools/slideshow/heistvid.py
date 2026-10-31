"""HEIST video (from roadvid.py): champagne type, casino-felt band w/ gold rules, case-file meta, heist-timer line.
ROAD TRIP video (1080x1920): flash burst -> full-screen drifting title still w/ animated type ->
per film two edge-to-edge panels (top/bottom) jump-cutting through stills, asphalt band between with a green
highway sign (EXIT 0X tab, title) + 'year | where' -> phone end card on blurred still.
Usage: python3 roadvid.py WORKDIR   (reads WORKDIR/heist.json) -> WORKDIR/video.mp4"""
import json, os, sys, subprocess, math
from PIL import Image, ImageFilter
D = os.path.abspath(sys.argv[1]); V = json.load(open(f'{D}/heist.json'))
T = f'{D}/_tmp'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
PH = 770; BAND = H - 2 * PH          # 380
ENGINE = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
INK = V.get('ink', '#FFC83D')

def ff(fam, pkg, w, st='normal'):
    return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('GV', 'great-vibes', 400) + ff('Yes', 'yeseva-one', 400) + ff('CP', 'courier-prime', 400) + ff('CP', 'courier-prime', 700) + ff('PF', 'playfair-display', 500, 'italic') +
       "*{margin:0;padding:0;box-sizing:border-box}body{background:transparent;color:#fff;font-family:CP}")

pages = {}
# title layers (separate so they can animate in)
tl = "position:absolute;left:0;width:1080px;text-align:center;"
shade = "text-shadow:0 4px 30px rgba(0,0,0,.45)"
pages['t_kick'] = (W, H, f"<div style='{tl}top:150px;font-weight:700;font-size:30px;letter-spacing:.42em;text-shadow:0 2px 14px rgba(0,0,0,.8)'>{V['kick']}</div>")
pages['t_hero'] = (W, H, f"<div style='{tl}top:205px;font-family:GV;font-size:150px;line-height:1;color:#fff;text-shadow:0 6px 26px rgba(0,0,0,.6)'>{V['hero1']}</div>"
                         f"<div style='{tl}top:330px;font-family:Yes;font-size:236px;line-height:1;letter-spacing:.06em;color:{INK};text-shadow:0 6px 34px rgba(0,0,0,.6)'>{V['hero2']}</div>")
pages['t_sub'] = (W, H, f"<div style='{tl}top:610px;font-family:PF;font-style:italic;font-weight:500;font-size:46px;{shade}'>{V['sub']}</div>"
                        f"<div style='{tl}top:690px;color:{INK};font-size:30px;letter-spacing:.5em'>&#9824; &#9829; &#9830; &#9827;</div>")
# asphalt band per film
for i, f in enumerate(V['films']):
    sign = (f"<div style='position:absolute;left:0;width:1080px;top:56px;text-align:center;color:{INK};font-weight:700;font-size:26px;letter-spacing:.34em'>CASE {i+1:02d} / 05 &nbsp;·&nbsp; {f['take'].upper()}</div>"
            f"<div style='position:absolute;left:0;width:1080px;top:{f.get('tt',112)}px;text-align:center;font-family:Yes;font-size:{f.get('fs',104)}px;line-height:1.02;color:#F6EEDC;text-shadow:0 4px 18px rgba(0,0,0,.5)'>{f['t']}</div>"
            f"<div style='position:absolute;left:0;width:1080px;top:{BAND-78}px;text-align:center;font-weight:700;font-size:29px;letter-spacing:.22em;color:#F6EEDC'>"
            f"<span style='color:{INK}'>{f['yr']}</span> &nbsp;|&nbsp; {f['where'].upper()}</div>")
    pages[f'sign{i}'] = (W, BAND, sign)
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const P=%s;"
      "for(const k of Object.keys(P)){const [w,h,html]=P[k];const p=await b.newPage({viewport:{width:w,height:h}});"
      "fs.writeFileSync('%s/_o.html','<html><head><style>%s</style></head><body>'+html+'</body></html>');await p.goto('file://%s/_o.html');"
      "await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});await p.close();}await b.close();})();"
      % (json.dumps(pages), T, CSS.replace("'", "\\'"), T, T))
open(f'{T}/ov.js', 'w').write(js); subprocess.run(f'cd {ENGINE} && node {T}/ov.js', shell=True, check=True)
L = {k: Image.open(f'{T}/{k}.png').convert('RGBA') for k in pages}

_cache = {}
def prep(name, w, h, x=50, y=50, over=1.14):
    """still scaled to cover (w*over, h*over), cropped around x/y %"""
    key = (name, w, h, x, y)
    if key not in _cache:
        im = Image.open(f'{D}/{name}').convert('RGB')
        gy = im.convert('L').resize((64, im.height)); rows = [sum(gy.crop((0, r, 64, r + 1)).getdata()) / 64 for r in range(im.height)]
        top = next((r for r in range(im.height) if rows[r] > 14), 0); bot = next((r for r in range(im.height - 1, -1, -1) if rows[r] > 14), im.height - 1)
        if top > 4 or bot < im.height - 5: im = im.crop((0, top + 2, im.width, bot - 1))
        W2, H2 = int(w * over), int(h * over)
        s = max(W2 / im.width, H2 / im.height); im = im.resize((math.ceil(im.width * s), math.ceil(im.height * s)), Image.LANCZOS)
        l = int(max(0, min(im.width - W2, im.width * x / 100 - W2 / 2))); t = int(max(0, min(im.height - H2, im.height * y / 100 - H2 / 2)))
        _cache[key] = im.crop((l, t, l + W2, t + H2))
    return _cache[key]

def drift(item, w, h, p, seed=0):
    """p in 0..1 progress -> frame w x h with slow push-in + lateral drift"""
    im = prep(item['f'], w, h, item.get('x', 50), item.get('y', 50))
    z = 1.0 + 0.10 * p if seed % 2 == 0 else 1.10 - 0.10 * p
    cw, ch = im.width / (1.14 / 1.0) / z * (1.0), im.height / 1.14 / z
    cw, ch = im.width / z / 1.0 * (1 / 1.0), im.height / z
    cw, ch = min(im.width, w * 1.14 / z), min(im.height, h * 1.14 / z)
    dx = (im.width - cw) * (0.5 + (0.35 if seed % 3 else -0.35) * (p - 0.5))
    dy = (im.height - ch) / 2
    return im.crop((int(dx), int(dy), int(dx + cw), int(dy + ch))).resize((w, h), Image.BILINEAR)

def ease(t): t = max(0, min(1, t)); return 1 - (1 - t) ** 3

ff_cmd = f"ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s {W}x{H} -r {FPS} -i - -c:v libx264 -preset veryfast -crf 15 -pix_fmt yuv420p {T}/raw.mp4"
proc = subprocess.Popen(ff_cmd, shell=True, stdin=subprocess.PIPE)
def emit(im): proc.stdin.write(im.convert('RGB').tobytes())

# 1) flash burst
for k, it in enumerate(V['burst']):
    n = int(0.2 * FPS)
    for j in range(n):
        fr = drift(it, W, H, j / n * 0.5 + 0.25, k)
        if j == 0: fr = Image.blend(fr, Image.new('RGB', (W, H), 'white'), 0.35)
        emit(fr)
# 2) title card
td = V.get('title_dur', 3.0); n = int(td * FPS)
for j in range(n):
    t = j / FPS; fr = drift(V['title_img'], W, H, j / n, 0).convert('RGBA')
    if j == 0:
        GR = Image.new('RGBA', (W, H)); gp = GR.load()
        for yy in range(H):
            al = int(170 * max(0, 1 - yy / 860) ** 1.3)
            for xx in range(0, W): gp[xx, yy] = (0, 0, 0, al)
    fr = Image.alpha_composite(fr, GR)
    for key, st, dy in (('t_kick', 0.05, 30), ('t_hero', 0.2, 60), ('t_sub', 0.55, 30)):
        a = ease((t - st) / 0.5)
        if a <= 0: continue
        lay = L[key]
        if a < 1:
            lay = lay.copy(); lay.putalpha(lay.getchannel('A').point(lambda v: int(v * a)))
        layer = Image.new('RGBA', (W, H)); layer.paste(lay, (0, int(dy * (1 - a))), lay); fr = Image.alpha_composite(fr, layer)
    if j < 4: fr = Image.blend(fr.convert('RGB'), Image.new('RGB', (W, H), 'white'), 0.3 * (1 - j / 4))
    emit(fr)
# 3) films
seg = V.get('seg', 3.1)
for i, f in enumerate(V['films']):
    n = int(seg * FPS); tops, bots = f['top'], f['bot']
    sign = L[f'sign{i}']
    for j in range(n):
        t = j / FPS; fr = Image.new('RGB', (W, H), '#141414')
        kt = min(len(tops) - 1, int(t / (seg / len(tops))))
        off = seg / len(bots) / 2                              # bottom cuts offset by half a beat
        kb = 0 if t < off else min(len(bots) - 1, 1 + int((t - off) / (seg / len(bots))))
        pt = (t - kt * seg / len(tops)) / (seg / len(tops))
        fr.paste(drift(tops[kt], W, PH, pt, i * 7 + kt), (0, 0))
        fr.paste(drift(bots[kb], W, PH, min(1, t / seg + 0.1), i * 7 + kb + 3), (0, PH + BAND))
        # asphalt band
        if not os.path.exists(f'{T}/felt.png'):
            from PIL import ImageDraw
            band = Image.effect_noise((W, BAND), 30).convert('RGB'); band = Image.blend(band, Image.new('RGB', (W, BAND), '#0E3B2C'), 0.84)
            g = Image.new('RGB', (W, BAND), '#000'); gd = ImageDraw.Draw(g); gd.ellipse([-200, -260, W + 200, BAND + 260], fill='#fff')
            g = g.convert('L').filter(ImageFilter.GaussianBlur(120)); band = Image.composite(band, Image.blend(band, Image.new('RGB', (W, BAND), '#04140F'), .6), g)
            d = ImageDraw.Draw(band)
            for yy, w_ in ((0, 6), (12, 2), (BAND - 6, 6), (BAND - 14, 2)): d.rectangle([0, yy, W, yy + w_ - 1], fill='#C9A55A')
            band.save(f'{T}/felt.png')
        b2 = Image.open(f'{T}/felt.png').copy()
        from PIL import ImageDraw; d = ImageDraw.Draw(b2)
        d.rectangle([0, BAND - 30, int(W * t / seg), BAND - 27], fill=INK)   # heist timer line
        fr.paste(b2, (0, PH))
        a = ease((t - 0.05) / 0.3); sy = int(PH + 40 * (1 - a))
        if a > 0:
            lay = sign if a >= 1 else sign.copy()
            if a < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * a)))
            fr.paste(lay, (0, sy), lay)
        if j < 3: fr = Image.blend(fr, Image.new('RGB', (W, H), 'white'), 0.22 * (1 - j / 3))
        # hard cut flash on panel switches is enough; emit
        emit(fr)
# 4) end card: phone on blurred still
ed = V.get('end_dur', 3.6); n = int(ed * FPS)
bg = prep(V['end_img']['f'], W, H, V['end_img'].get('x', 50), over=1.0).filter(ImageFilter.GaussianBlur(26))
bg = Image.blend(bg, Image.new('RGB', (W, H), 'black'), 0.35)
ph = Image.open(f"{D}/"+V["phone"]).convert('RGBA'); s = 1600 / ph.height; ph = ph.resize((int(ph.width * s), 1600), Image.LANCZOS)
for j in range(n):
    t = j / FPS; a = ease(t / 0.6); fr = bg.copy().convert('RGBA')
    y = int((H - 1600) / 2 + 160 * (1 - a))
    lay = ph if a >= 1 else ph.copy()
    if a < 1: lay.putalpha(lay.getchannel('A').point(lambda v: int(v * a)))
    fr.alpha_composite(lay, ((W - ph.width) // 2, y)); emit(fr)
proc.stdin.close(); proc.wait()
subprocess.run(f"ffmpeg -v error -y -i {T}/raw.mp4 -vf \"eq=saturation=0.95:contrast=1.03,colorbalance=rs=0.02:bs=-0.02:rh=0.02,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p\" "
               f"-c:v libx264 -preset medium -crf 18 -movflags +faststart {D}/video.mp4", shell=True, check=True)
print('done', f'{D}/video.mp4')
