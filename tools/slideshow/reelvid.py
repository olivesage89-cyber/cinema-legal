"""PROJECTOR REEL video (1080x1920). Usage: python3 reelvid.py WORKDIR  (reads plan.json -> video.mp4)
Look: burst of full-bleed cuts with projector frame-slip + flicker -> full-bleed drifting title shots with
staggered title (Great Vibes + flickering Limelight marquee word) -> per film: a vertical 35mm strip with
sprocket holes; the centre frame sits in the gate and the strip snaps down one frame every ~0.8s (projector
pull-down w/ motion blur), Limelight title on top, Cormorant italic line + 'year | where' below; gate weave,
flicker, dust -> framed app phone end card (no text)."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance, ImageChops
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F05A45'); CREAM = '#F6E9D2'
GW, GH = 940, 529            # gate frame
PITCH = GH + 34              # frame pitch on the strip
SX0, SX1 = (W - GW) // 2 - 62, (W + GW) // 2 + 62   # strip edges
GCY = P.get('gcy', 975)      # gate centre y
def sh(c): subprocess.run(c, shell=True, check=True)
_cache = {}
def load(f):
    if f not in _cache: _cache[f] = Image.open(f'{D}/{f}').convert('RGB')
    return _cache[f]

def drift(img, w, h, k, x=50, y=50, zin=True, dx=1, zoom=0.07):
    im = load(img); s = max(w / im.width, h / im.height)
    z = 1 + zoom * (k if zin else 1 - k)
    cw, ch = w / (s * z), h / (s * z)
    cx = (im.width - cw) * x / 100 + dx * (k - .5) * cw * 0.03; cy = (im.height - ch) * y / 100
    cx = max(0, min(cx, im.width - cw)); cy = max(0, min(cy, im.height - ch))
    return im.resize((w, h), Image.BICUBIC, box=(cx, cy, cx + cw, cy + ch))

# ---------- overlays ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, s='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{s};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{s}.woff2)}}"
CSS = ff('Lime', 'limelight', 400) + ff('Vibes', 'great-vibes', 400) + ff('Jos', 'josefin-sans', 400) + ff('Jos', 'josefin-sans', 600) + \
      ff('Cor', 'cormorant-garamond', 500, 'italic') + ff('Cor', 'cormorant-garamond', 600) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CREAM};text-align:center}}"
GLOW = f"text-shadow:0 0 6px {INK}cc,0 0 22px {INK}99,0 0 60px {INK}55,0 4px 30px rgba(0,0,0,.5)"
ti = P['title']; top = ti.get('top', 250)
pages = {
 't_shade': f"<div style='position:absolute;top:0;left:0;width:100%;height:1100px;background:linear-gradient(180deg,rgba(6,8,18,.78),rgba(6,8,18,.45) 55%,rgba(6,8,18,0))'></div>",
 't_kick': f"<div style='position:absolute;top:{top}px;width:100%;font:600 31px Jos;letter-spacing:.46em;padding-left:.5em'>{ti['kick']}</div>",
 't_hero': f"<div style='position:absolute;top:{top+40}px;width:100%;font:400 150px/1.3 Vibes;text-shadow:0 4px 30px rgba(0,0,0,.6)'>{ti['hero']}</div>",
 't_hero2': f"<div style='position:absolute;top:{top+232}px;width:100%;font:400 150px/1 Lime;color:{INK};letter-spacing:.04em;{GLOW}'>{ti['hero2']}</div>",
 't_sub': f"<div style='position:absolute;top:{top+420}px;width:100%;font:italic 500 48px Cor;text-shadow:0 2px 18px rgba(0,0,0,.9)'>{ti['sub']}</div>",
}
NF = len(P['films'])
for i, f in enumerate(P['films']):
    pages[f'f{i}'] = (
        f"<div style='position:absolute;top:{P.get('ttop',250)}px;width:100%'>"
        f"<div style='font:600 28px Jos;letter-spacing:.5em;padding-left:.5em;color:{INK}'>REEL 0{i+1} &nbsp;/&nbsp; 0{NF}</div>"
        f"<div style='font:400 {f.get('fs',92)}px/1.04 Lime;color:{CREAM};margin:26px 50px 0;text-shadow:0 0 18px rgba(255,220,170,.25),0 6px 30px rgba(0,0,0,.6)'>{f['t']}</div></div>"
        f"<div style='position:absolute;top:{P.get('btop',1470)}px;width:100%'>"
        f"<div style='font:italic 500 58px/1.22 Cor;margin:0 90px;text-wrap:balance;color:{CREAM}'>{f['line']}</div>"
        f"<div style='font:600 28px Jos;letter-spacing:.32em;padding-left:.32em;color:{INK};margin-top:30px'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
html = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in pages.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(html), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
OV = {k: Image.open(f'{T}/{k}.png').convert('RGBA') for k in pages}

def fade(o, a):
    if a >= 1: return o
    o2 = o.copy(); o2.putalpha(o.split()[3].point(lambda v: int(v * max(a, 0)))); return o2

# ---------- film texture ----------
random.seed(7)
DUST = []
for n in range(6):
    d = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dr = ImageDraw.Draw(d)
    for _ in range(random.randint(3, 8)):
        x, y, r = random.randint(0, W), random.randint(0, H), random.uniform(1.5, 4.5)
        c = (20, 14, 10, 150) if random.random() < .6 else (255, 248, 230, 120)
        dr.ellipse([x - r, y - r, x + r, y + r * random.uniform(.6, 1.8)], fill=c)
    if n % 2 == 0:
        x = random.randint(120, W - 120); dr.line([(x, 0), (x + random.randint(-12, 12), H)], fill=(255, 245, 225, 55), width=2)
    DUST.append(d)
def texture(c, fi):
    random.seed(fi * 13 + 1)
    if random.random() < .38: c.alpha_composite(DUST[random.randrange(len(DUST))])
    return c

# strip base with sprocket holes (tall enough to scroll)
def make_strip_base(hh):
    s = Image.new('RGBA', (W, hh), (0, 0, 0, 0)); dr = ImageDraw.Draw(s)
    dr.rectangle([SX0, 0, SX1, hh], fill=(26, 18, 12, 255))
    hp = PITCH / 4
    for k in range(int(hh / hp) + 2):
        y = k * hp + hp / 2
        for xc in (SX0 + 31, SX1 - 31):
            dr.rounded_rectangle([xc - 15, y - 21, xc + 15, y + 21], 6, fill=(0, 0, 0, 0))
    # faint edge highlight
    dr.line([(SX0, 0), (SX0, hh)], fill=(70, 50, 35, 255), width=2); dr.line([(SX1, 0), (SX1, hh)], fill=(70, 50, 35, 255), width=2)
    return s
SB = make_strip_base(H + 2 * PITCH)
VIG = Image.new('L', (W, H), 0)   # fade strip to black at top and bottom
for y in range(H):
    a = 255
    d1 = y - 520; d2 = 1430 - y
    if d1 < 170: a = int(255 * max(0, d1) / 170)
    if d2 < 170: a = min(a, int(255 * max(0, d2) / 170))
    VIG.paste(a, (0, y, W, y + 1))
GLOWBG = Image.new('RGB', (W, H), (8, 6, 5))
gm = Image.new('L', (W // 4, H // 4), 0); ImageDraw.Draw(gm).ellipse([-40, GCY // 4 - 150, W // 4 + 40, GCY // 4 + 150], fill=90)
GLOWBG.paste((90, 60, 34), (0, 0), gm.filter(ImageFilter.GaussianBlur(30)).resize((W, H)))

def frame_img(item, k):
    img, x = (item, 50) if isinstance(item, str) else (item[0], item[1])
    im = drift(img, GW, GH, k, x=x, zoom=0.06)
    return ImageEnhance.Contrast(im).enhance(1.04)

def strip_frame(items, s, kk, fi, bright):
    """s = strip scroll offset in px (frame j is in the gate when s == j*PITCH)"""
    c = GLOWBG.copy().convert('RGBA')
    off = s % (PITCH / 4)
    st = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    st.alpha_composite(SB.crop((0, int(PITCH - off), W, int(PITCH - off) + H)))
    j0 = int(s // PITCH)
    for j in range(j0 - 1, j0 + 3):
        if j < 0 or j >= len(items): continue
        y = GCY - GH / 2 + (s - j * PITCH)
        if y > H or y + GH < 0: continue
        fr = frame_img(items[j], kk[j])
        if j != round(s / PITCH): fr = ImageEnhance.Brightness(fr).enhance(.55)
        st.paste(fr, ((W - GW) // 2, int(y)))
    weave = random.Random(fi).choice([-2, -1, 0, 0, 1, 2])
    st = ImageChops.offset(st, weave, 0)
    a = ImageChops.multiply(st.split()[3], VIG); st.putalpha(a)
    c.alpha_composite(st)
    if bright != 1: c = ImageEnhance.Brightness(c).enhance(bright)
    return c.convert('RGBA')

ffm = subprocess.Popen(f"ffmpeg -v error -y -f rawvideo -pix_fmt rgb24 -s {W}x{H} -r {FPS} -i - -vf \"eq=saturation=1.03:contrast=1.03,"
                       f"noise=alls=5:allf=t,vignette=PI/5,format=yuv420p\" -c:v libx264 -preset slow -crf 22 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4",
                       shell=True, stdin=subprocess.PIPE)
FI = [0]
def emit(im):
    im = texture(im.convert('RGBA'), FI[0]); FI[0] += 1
    ffm.stdin.write(im.convert('RGB').tobytes())
def ease(t): return 1 - (1 - min(max(t, 0), 1)) ** 3
def flick(fi): return random.Random(fi * 7 + 3).uniform(.95, 1.04)

# 1. burst: full-bleed cuts with projector frame slip
fl = int(P.get('flash', 0.2) * FPS)
for j, b in enumerate(P['burst']):
    img, x = (b, 50) if isinstance(b, str) else (b[0], b[1])
    for q in range(fl):
        c = drift(img, W, H, q / fl, x=x, zin=j % 2 == 0, zoom=0.08)
        if q < 2:   # frame slip: image rolls in vertically with a black frame line
            dy = int(H * (0.22 if q == 0 else 0.07)) * (1 if j % 2 else -1)
            c2 = ImageChops.offset(c, 0, dy); dr = ImageDraw.Draw(c2)
            ly = dy if dy > 0 else H + dy
            dr.rectangle([0, ly - 14, W, ly + 14], fill=(4, 3, 2)); c = c2
            c = Image.blend(c, Image.new('RGB', (W, H), (255, 244, 225)), 0.28 if q == 0 else 0.1)
        c = ImageEnhance.Brightness(c).enhance(flick(FI[0]))
        emit(c)

# 2. title: full-bleed drifting cuts + staggered title
tshots = ti['shots']; tf = 0
for k, s in enumerate(tshots):
    n = int(s['dur'] * FPS)
    for q in range(n):
        c = drift(s['img'], W, H, q / n, x=s.get('x', 50), zin=k % 2 == 0, dx=1 if k % 2 else -1, zoom=0.06)
        c = ImageEnhance.Brightness(c).enhance(flick(FI[0])).convert('RGBA')
        c.alpha_composite(fade(OV['t_shade'], ease(tf / 8)))
        a = ease((tf - 2) / 10); c.alpha_composite(fade(OV['t_kick'], a), (0, int(20 * (1 - a))))
        a = ease((tf - 7) / 12); c.alpha_composite(fade(OV['t_hero'], a), (0, int(36 * (1 - a))))
        # marquee word: flickers on like a bulb sign
        m = tf - 15
        on = 0 if m < 0 else (1 if m in (0, 1) else 0.15 if m in (2, 3) else 1 if m in (4,) else 0.4 if m == 5 else 1)
        if on: c.alpha_composite(fade(OV['t_hero2'], on))
        a = ease((tf - 24) / 12); c.alpha_composite(fade(OV['t_sub'], a), (0, int(20 * (1 - a))))
        if q < 2 and k > 0: c.alpha_composite(Image.new('RGBA', (W, H), (255, 240, 220, 110 if q == 0 else 40)))
        emit(c); tf += 1

# 3. films: strip snaps down one frame every STEP seconds
STEP = P.get('step', 0.8); PULL = 5
for i, f in enumerate(P['films']):
    its = f['items']; n = int(P.get('seg', 3.3) * FPS); sf = int(STEP * FPS)
    kk_base = [0.0] * len(its)
    for q in range(n):
        j = min(q // sf, len(its) - 1); lq = q - j * sf
        if j < len(its) - 1 and lq >= sf - PULL:    # pull-down to the next frame
            t = (lq - (sf - PULL) + 1) / PULL; t = t * t * (3 - 2 * t)
            s = (j + t) * PITCH
        else: s = j * PITCH
        kk = [min(1, max(0, (q - jj * sf) / (sf + 6))) for jj in range(len(its))]
        if j < len(its) - 1 and lq >= sf - PULL:   # motion blur during pull
            a = strip_frame(its, s - PITCH * .08, kk, FI[0], flick(FI[0])); b = strip_frame(its, s, kk, FI[0], flick(FI[0]))
            c = Image.blend(a, b, .5)
        else:
            c = strip_frame(its, s, kk, FI[0], flick(FI[0]))
        a = ease(q / 8); c.alpha_composite(fade(OV[f'f{i}'], a), (0, int(22 * (1 - a))))
        if q < 3: c.alpha_composite(Image.new('RGBA', (W, H), (255, 236, 205, [150, 70, 25][q])))
        emit(c)

# 4. end card: framed phone on blurred still, no text
bgi = drift(P['end_bg'], W, H, 0.5, x=P.get('end_x', 50), zoom=0).filter(ImageFilter.GaussianBlur(28))
bgi = Image.blend(bgi, Image.new('RGB', (W, H), (12, 9, 8)), 0.42)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
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
    ffm.stdin.write(c.convert('RGB').tobytes())   # end card stays clean (no dust)
ffm.stdin.close(); ffm.wait()
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
