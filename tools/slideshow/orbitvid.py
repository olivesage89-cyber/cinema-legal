"""OBSERVATORY video (1080x1920). Usage: python3 orbitvid.py WORKDIR  (reads plan.json -> video.mp4)
Look: flash burst -> full-screen title over drifting stills/clips -> per film: night-sky page with starfield,
film seen through a big round 'telescope' lens (jump cuts ~0.8s inside the circle), orbit ring with a travelling
star, Bellefair caps title + DM Mono '0X / 05' + 'year | where' + Lora italic line -> framed app phone end card.
Items are a still filename or a clip {src,ss,d,x}."""
import json, os, subprocess, sys, random, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFC9A3')
CD = 900; CX, CY = W // 2, P.get('cy', 930)
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]

_crops = {}
def bars(src):
    if src not in _crops:
        import re
        log = subprocess.run(f"ffmpeg -hide_banner -ss 10 -i {D}/{src} -t 40 -vf cropdetect=limit=24:round=2:reset=0 -an -f null -", shell=True, capture_output=True, text=True).stderr
        m = re.findall(r'crop=(\d+:\d+:\d+:\d+)', log); _crops[src] = f"crop={m[-1]}," if m else ""
    return _crops[src]

def piece(item, dur, w, h, seed=0, zoom=0.07):
    """one shot -> w x h mp4 (still with drift, or real clip)"""
    n[0] += 1; out = f'{T}/s{n[0]}.mp4'; fr = max(2, int(round(dur * FPS)))
    if isinstance(item, dict):
        x = item.get('x', 50) / 100; slow = min(max(dur / item['d'], 1.0), 1.5)
        sh(f"ffmpeg -v error -y -ss {item['ss']} -t {item['d']} -i {D}/{item['src']} -vf \"{bars(item['src'])}scale={w}:{h}:force_original_aspect_ratio=increase,"
           f"crop={w}:{h}:(iw-{w})*{x}:(ih-{h})/2,setpts={slow:.3f}*(PTS-STARTPTS),fps={FPS},tpad=stop_mode=clone:stop_duration={dur},setsar=1,format=yuv420p\" "
           f"-an -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
        return out
    img, x, y = (item, 50, 50) if isinstance(item, str) else (item[0], item[1], item[2] if len(item) > 2 else 50)
    random.seed(seed + n[0])
    im = Image.open(f'{D}/{img}').convert('RGB'); s = max(w / im.width, h / im.height) * 1.12
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    l = int((im.width - w * 1.12) * x / 100); t = int((im.height - h * 1.12) * y / 100)
    im = im.crop((l, t, l + int(w * 1.12), t + int(h * 1.12))); p = f'{T}/s{n[0]}.png'; im.save(p)
    zin = random.random() < .5; dx = random.choice([-1, 1]); step = zoom / fr
    z = f"'1.0+{step:.5f}*on'" if zin else f"'{1+zoom:.4f}-{step:.5f}*on'"
    xs = f"'(iw-iw/zoom)/2+{dx}*(on-{fr/2})*{0.8*w/1080:.3f}'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -vf \"scale={im.width*2}:-1,zoompan=z={z}:x={xs}:y='(ih-ih/zoom)/2':d={fr}:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p\" -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out

def cat(parts, out):
    lst = out + '.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {out}"); return out

# ---------- starfield background + lens mask + orbit star ----------
random.seed(7)
bg = Image.new('RGB', (W, H)); px = bg.load()
top, bot = (4, 6, 14), (12, 20, 40)
for yy in range(H):
    k = yy / H; c = tuple(int(top[i] + (bot[i] - top[i]) * k) for i in range(3))
    for xx in range(W): px[xx, yy] = c
glow = Image.new('L', (W, H), 0); ImageDraw.Draw(glow).ellipse([CX - 640, CY - 640, CX + 640, CY + 640], fill=70)
glow = glow.filter(ImageFilter.GaussianBlur(160)); bg = Image.composite(Image.new('RGB', (W, H), (40, 52, 92)), bg, glow)
d = ImageDraw.Draw(bg)
for _ in range(520):
    x, y = random.randrange(W), random.randrange(H); r = random.choice([0.6, 0.8, 1, 1, 1.4, 1.9]); a = random.randint(90, 255)
    d.ellipse([x - r, y - r, x + r, y + r], fill=(a, a, min(255, a + 15)))
for _ in range(14):   # a few bright stars with soft halo
    x, y = random.randrange(W), random.randrange(H); h = Image.new('L', (W, H), 0)
    ImageDraw.Draw(h).ellipse([x - 9, y - 9, x + 9, y + 9], fill=120); h = h.filter(ImageFilter.GaussianBlur(6))
    bg = Image.composite(Image.new('RGB', (W, H), (255, 236, 220)), bg, h); ImageDraw.Draw(bg).ellipse([x - 2, y - 2, x + 2, y + 2], fill=(255, 250, 240))
bg.save(f'{T}/stars.png')
m = Image.new('L', (CD * 2, CD * 2), 0); ImageDraw.Draw(m).ellipse([0, 0, CD * 2 - 1, CD * 2 - 1], fill=255)
m.resize((CD, CD), Image.LANCZOS).save(f'{T}/lens.png')
st = Image.new('RGBA', (60, 60), (0, 0, 0, 0)); g = Image.new('L', (60, 60), 0); ImageDraw.Draw(g).ellipse([14, 14, 46, 46], fill=200)
g = g.filter(ImageFilter.GaussianBlur(7)); st.paste(Image.new('RGBA', (60, 60), INK), (0, 0), g)
ImageDraw.Draw(st).ellipse([25, 25, 35, 35], fill=(255, 252, 245, 255)); st.save(f'{T}/orb.png')

# ---------- overlays ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, s='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{s};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{s}.woff2)}}"
CSS = ff('Bel', 'bellefair', 400) + ff('All', 'allison', 400) + ff('Mono', 'dm-mono', 400) + ff('Mono', 'dm-mono', 500) + ff('Lora', 'lora', 400, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
R = CD // 2
def constellation(seed, box):
    random.seed(seed); x0, y0, x1, y1 = box; pts = [(random.randint(x0, x1), random.randint(y0, y1)) for _ in range(5)]
    pts.sort(); s = ''.join(f"<line x1='{a[0]}' y1='{a[1]}' x2='{b[0]}' y2='{b[1]}' stroke='{INK}' stroke-opacity='.45' stroke-width='1.4'/>" for a, b in zip(pts, pts[1:]))
    s += ''.join(f"<circle cx='{x}' cy='{y}' r='{random.choice([3,3.5,4.5])}' fill='#FFF6EC'/><circle cx='{x}' cy='{y}' r='11' fill='{INK}' fill-opacity='.18'/>" for x, y in pts)
    return s
ov = {}; ti = P['title']
ov['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1150px;background:linear-gradient(180deg,rgba(3,5,14,.78),rgba(3,5,14,.45) 55%,rgba(3,5,14,0))'></div>"
               f"<div style='position:absolute;top:{ti.get('top',250)}px;width:100%'>"
               f"<div style='font:500 27px Mono;letter-spacing:.5em;padding-left:.5em;color:#F3EEF8'>{ti['kick']}</div>"
               f"<div style='font:400 190px/1 All;color:{INK};margin-top:30px;text-shadow:0 0 40px rgba(255,190,150,.35)'>{ti['hero']}</div>"
               f"<div style='font:400 150px/1 Bel;letter-spacing:.16em;padding-left:.16em;color:#FFF8F0;margin-top:-28px;text-shadow:0 4px 40px rgba(0,0,0,.6)'>{ti['hero2']}</div>"
               f"<div style='font:italic 400 44px Lora;margin-top:34px;color:#FFF3EA;text-shadow:0 2px 20px rgba(0,0,0,.8)'>{ti['sub']}</div></div>")
NF = len(P['films'])
for i, f in enumerate(P['films']):
    svg = f"<svg width='{W}' height='{H}' style='position:absolute;left:0;top:0'>" \
          f"<circle cx='{CX}' cy='{CY}' r='{R+16}' fill='none' stroke='{INK}' stroke-opacity='.55' stroke-width='2'/>" \
          f"<circle cx='{CX}' cy='{CY}' r='{R+34}' fill='none' stroke='#FFFFFF' stroke-opacity='.14' stroke-width='1.2' stroke-dasharray='3 9'/>" \
          + ''.join(f"<line x1='{CX+(R+16)*math.cos(a)}' y1='{CY+(R+16)*math.sin(a)}' x2='{CX+(R+(30 if k%3==0 else 24))*math.cos(a)}' y2='{CY+(R+(30 if k%3==0 else 24))*math.sin(a)}' stroke='{INK}' stroke-opacity='.6' stroke-width='1.5'/>"
                    for k, a in enumerate([j * math.pi / 18 for j in range(36)])) \
          + constellation(i * 13 + 1, (60, 1560, 380, 1800)) + "</svg>"
    ov[f'f{i}'] = (svg +
        f"<div style='position:absolute;top:150px;width:100%'><div style='font:500 24px Mono;letter-spacing:.5em;padding-left:.5em;color:#E9E4F2;opacity:.8'>0{i+1} / 0{NF}</div>"
        f"<div style='font:400 {f.get('fs',86)}px/1.02 Bel;letter-spacing:.08em;padding-left:.08em;color:#FFF8F0;margin-top:26px'>{f['t']}</div></div>"
        f"<div style='position:absolute;top:{CY+R+78}px;width:100%'><div style='font:500 26px Mono;letter-spacing:.34em;padding-left:.34em;color:{INK}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
        f"<div style='font:italic 400 42px/1.3 Lora;color:#F6F0FA;margin-top:26px'>{f['line']}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
# 1. burst
for j, b in enumerate(P['burst']):
    segs.append(piece(b, P.get('flash', 0.2), W, H, seed=j, zoom=0.04))
# 2. title
tdur = sum(c['dur'] for c in ti['shots'])
cat([piece(c['item'], c['dur'], W, H, seed=40 + k) for k, c in enumerate(ti['shots'])], f'{T}/tbg.mp4')
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/title.png -filter_complex "
   f"\"[0]eq=brightness=-0.03[b];[1]format=rgba,fade=in:st=0.05:d=0.7:alpha=1[o];[b][o]overlay=x=0:y='max(0,50-140*t)':shortest=1,format=yuv420p\" "
   f"-t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films
SEG = P.get('seg', 3.3)
for i, f in enumerate(P['films']):
    its = f['items']; k = len(its); dd = SEG / k
    lens = cat([piece(it, round(dd, 3), CD, CD, seed=i * 17 + j, zoom=0.08) for j, it in enumerate(its)], f'{T}/lens{i}.mp4')
    fc = (f"[0]scale={W*2}:-1,zoompan=z='1.0+0.0007*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={int(SEG*FPS)}:s={W}x{H}:fps={FPS}[bg];"
          f"[1]format=yuva420p[lv];[2]format=gray,scale={CD}:{CD}[lm];[lv][lm]alphamerge,fade=in:st=0:d=0.25:alpha=1[l];"
          f"[bg][l]overlay={CX-R}:'{CY-R}+max(0,40-260*t)':eof_action=pass[a];"
          f"[3]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[o];[a][o]overlay=0:'max(0,24-140*t)'[b];"
          f"[b][4]overlay=x='{CX}+{R+16}*cos(1.1*t+{i*1.3})-30':y='{CY}+{R+16}*sin(1.1*t+{i*1.3})-30',format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -i {T}/stars.png -i {lens} -loop 1 -i {T}/lens.png -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/orb.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# 4. end card: framed phone on blurred still, no text
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bgi.width, H / bgi.height) * 1.1
bgi = bgi.resize((int(bgi.width * s), int(bgi.height * s))); l = int((bgi.width - W) * P.get('end_x', 50) / 100); t0 = (bgi.height - H) // 2
bgi = bgi.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bgi = Image.blend(bgi, Image.new('RGB', (W, H), (6, 8, 18)), 0.4)
ph = Image.open(P['phone']).convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mm = Image.new('L', (W, H), 0)
ImageDraw.Draw(mm).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mm = mm.filter(ImageFilter.GaussianBlur(40)); bgi = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bgi, mm)
bgi.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bgi.save(f'{T}/end.png'); bgi.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.4); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 14 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
# concat + grade + grain
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.03:contrast=1.02,colorbalance=rs=0.008:bs=0.015,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
