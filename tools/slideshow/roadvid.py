"""ROAD TRIP video (1080x1920): flash burst -> full-screen drifting title still w/ animated type ->
per film two edge-to-edge panels (top/bottom) jump-cutting through stills, asphalt band between with a green
highway sign (EXIT 0X tab, title) + 'year | where' -> phone end card on blurred still.
Usage: python3 roadvid.py WORKDIR   (reads WORKDIR/road.json) -> WORKDIR/video.mp4"""
import json, os, sys, subprocess, math
from PIL import Image, ImageFilter
D = os.path.abspath(sys.argv[1]); V = json.load(open(f'{D}/road.json'))
T = f'{D}/_tmp'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
PH = 770; BAND = H - 2 * PH          # 380
ENGINE = os.path.dirname(os.path.abspath(__file__))
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
INK = V.get('ink', '#FFC83D')

def ff(fam, pkg, w, st='normal'):
    return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Ov', 'overpass', 600) + ff('Ov', 'overpass', 800) + ff('Ov', 'overpass', 900) + ff('Dam', 'damion', 400) +
       ff('BS', 'big-shoulders-display', 900) + ff('Gel', 'gelasio', 500, 'italic') +
       "*{margin:0;padding:0;box-sizing:border-box}body{background:transparent;color:#fff;font-family:Ov}")

pages = {}
# title layers (separate so they can animate in)
tl = "position:absolute;left:0;width:1080px;text-align:center;"
shade = "text-shadow:0 4px 30px rgba(0,0,0,.45)"
pages['t_kick'] = (W, H, f"<div style='{tl}top:150px;font-weight:800;font-size:31px;letter-spacing:.42em;text-shadow:0 2px 14px rgba(0,0,0,.7)'>{V['kick']}</div>")
pages['t_hero'] = (W, H, f"<div style='{tl}top:200px;font-family:Dam;font-size:200px;line-height:1;transform:rotate(-6deg);color:#fff;text-shadow:0 6px 26px rgba(0,0,0,.55)'>{V['hero1']}</div>"
                         f"<div style='{tl}top:360px;font-family:BS;font-weight:900;font-size:330px;line-height:.86;letter-spacing:.03em;color:{INK};{shade}'>{V['hero2']}</div>")
pages['t_sub'] = (W, H, f"<div style='{tl}top:665px;font-family:Gel;font-style:italic;font-weight:500;font-size:48px;{shade}'>{V['sub']}</div>"
                        f"<div style='{tl}top:750px'><span style='display:inline-block;width:120px;height:0;border-top:6px dashed {INK}'></span></div>")
# asphalt band per film
for i, f in enumerate(V['films']):
    sign = (f"<div style='position:absolute;left:50%;top:34px;transform:translateX(-50%);text-align:center'>"
            f"<div style='display:inline-block;background:#0B6B3E;border:4px solid #fff;outline:6px solid #0B6B3E;border-radius:14px;padding:18px 56px 12px;min-width:700px;box-shadow:0 14px 30px rgba(0,0,0,.55)'>"
            f"<div style='font-weight:800;font-size:{f.get('fs',100)}px;line-height:1.05;white-space:nowrap'>{f['t']}</div>"
            f"<div style='font-weight:600;font-size:30px;letter-spacing:.32em;margin-top:6px;opacity:.95'>EXIT {i+1:02d} &nbsp;↑</div></div></div>"
            f"<div style='position:absolute;left:0;width:1080px;top:{BAND-74}px;text-align:center;font-weight:600;font-size:31px;letter-spacing:.2em'>"
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
        im = Image.open(f'{D}/{name}').convert('RGB'); W2, H2 = int(w * over), int(h * over)
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
        band = Image.open(f'{T}/asphalt.png') if os.path.exists(f'{T}/asphalt.png') else None
        if band is None:
            import random; random.seed(1)
            band = Image.effect_noise((W, BAND), 22).convert('RGB'); band = Image.blend(band, Image.new('RGB', (W, BAND), '#1a1a1c'), 0.86)
            from PIL import ImageDraw; d = ImageDraw.Draw(band)
            d.rectangle([0, 0, W, 5], fill='#f2f0ea'); d.rectangle([0, BAND - 6, W, BAND], fill='#f2f0ea')
            band.save(f'{T}/asphalt.png')
        # dashed centre line scrolls past (moving road)
        b2 = band.copy(); from PIL import ImageDraw; d = ImageDraw.Draw(b2)
        sh = int((t * 520) % 160)
        for xx in range(-160 + sh, W, 160): d.rectangle([xx, BAND // 2 - 4, xx + 80, BAND // 2 + 4], fill='#E8B230')
        fr.paste(b2, (0, PH))
        a = ease((t - 0.05) / 0.3); sy = int(PH + 70 * (1 - a))
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
