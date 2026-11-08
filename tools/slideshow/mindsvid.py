"""CHALKBOARD (brilliant-minds) stills video. Usage: python3 mindsvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen panning title (IBM Plex Mono kicker, mint Caveat chalk 'brilliant', chalk-white Gloock MINDS,
hand-drawn chalk underline, Caveat sub, mono tag) -> per film: slate chalkboard w/ smudges + faint chalk equations,
top: mint mono 'PROOF Nº 0N / 05', Gloock chalk title, Caveat line, mono 'year | where'; below THREE rounded panels
w/ chalk outlines sliding in staggered (chalk-dust flash) and jump-cutting drifting stills -> phone end card on slate.
All chalk text gets a grainy chalk alpha texture."""
import json, os, subprocess, sys, random
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#8EE3C2'); CHALK = '#EEF1EA'; BG = (24, 33, 30)
PX, PW, PH, PY0, PG = 60, 960, 380, 486, 26          # panels
PYS = [PY0 + k * (PH + PG) for k in range(3)]
def sh(c): subprocess.run(c, shell=True, check=True)

def chalkify(path, amt=0.45, seed=1):
    im = Image.open(path).convert('RGBA'); a = np.asarray(im.getchannel('A')).astype(np.float32)
    rng = np.random.default_rng(seed); nz = rng.random(a.shape).astype(np.float32)
    nz = np.asarray(Image.fromarray((nz * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
    nz = (nz - nz.mean()) / (nz.std() + 1e-6)
    m = np.clip(1 - amt * 0.5 + nz * amt * 0.55, 0.15, 1)
    im.putalpha(Image.fromarray(np.clip(a * m, 0, 255).astype(np.uint8))); im.save(path)

# ---- chalkboard background
def board(w, h, seed=3, eq=True):
    random.seed(seed); rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w]; r = np.sqrt(((xx - w / 2) / w) ** 2 + ((yy - h * .4) / h) ** 2)
    base = np.stack([BG[0] + 10 - r * 22, BG[1] + 12 - r * 24, BG[2] + 10 - r * 22], -1)
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert('RGBA')
    sm = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(sm)
    for _ in range(26):   # eraser smudges: wide soft arcs
        x, y = random.randint(-200, w), random.randint(-100, h); rw = random.randint(250, 700); rh = random.randint(60, 200)
        d.ellipse([x, y, x + rw, y + rh], fill=(200, 215, 205, random.randint(8, 20)))
    img = Image.alpha_composite(img, sm.filter(ImageFilter.GaussianBlur(45)))
    gr = (rng.random((h, w)) * 255).astype(np.uint8); gr = Image.fromarray(gr).filter(ImageFilter.GaussianBlur(0.8))
    gl = Image.new('RGBA', (w, h), (230, 240, 232, 0)); gl.putalpha(gr.point(lambda v: max(0, v - 140) // 9)); img = Image.alpha_composite(img, gl)
    return img

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Gl', 'gloock', 400) + ff('Cv', 'caveat', 500) + ff('Cv', 'caveat', 700) + ff('Mo', 'ibm-plex-mono', 500) + ff('Mo', 'ibm-plex-mono', 600) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CHALK};text-align:center}}"
SH = "text-shadow:0 2px 18px rgba(10,16,14,.85)"
EQS = ["e<sup>iπ</sup> + 1 = 0", "E = mc²", "∫ f(x) dx", "P ≠ NP ?", "1. e4 e5  2. Nf3", "OBP > AVG", "Σ 1/n²  = π²/6", "Δx · Δp ≥ ħ/2",
       "a² + b² = c²", "ENIGMA → ?", "x = (−b ± √(b²−4ac)) / 2a", "1729 = 1³+12³", "Qxf7#", "n → ∞", "ψ(x,t)", "√2 ∉ ℚ"]
def eqlayer(w, h, seed, avoid=()):
    random.seed(seed); s = ''
    for k in range(22):
        for _ in range(30):
            x, y = random.randint(-40, w - 200), random.randint(20, h - 60)
            if not any(a[0] < y < a[1] for a in avoid): break
        s += (f"<div style='position:absolute;left:{x}px;top:{y}px;font:500 {random.randint(34,58)}px Cv;opacity:{random.uniform(.05,.11):.3f};"
              f"transform:rotate({random.uniform(-9,9):.1f}deg);white-space:nowrap'>{random.choice(EQS)}</div>")
    return s
def wavy(w, c, sw=5):
    pts = ' '.join(f"{x},{8 + 5 * np.sin(x / 37) + 2 * np.sin(x / 11):.1f}" for x in range(0, w + 1, 6))
    return f"<svg width='{w}' height='20'><polyline points='{pts}' fill='none' stroke='{c}' stroke-width='{sw}' stroke-linecap='round'/></svg>"

ov = {}; chalk_keys = set()
ov['eqs'] = eqlayer(W, H, 11, avoid=[(30, 480)]); chalk_keys.add('eqs')
ti = P['title']; top = ti.get('top', 200)
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1300px;background:linear-gradient(180deg,rgba(20,28,25,.9),rgba(20,28,25,.62) 55%,rgba(20,28,25,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:600 30px Mo;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:700 200px/1 Cv;color:{INK};transform:rotate(-6deg)'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+225}px;width:100%;font:400 240px/1 Gl;letter-spacing:.04em;padding-left:.04em;{SH}'>{ti['hero']}</div>"
ov['trule'] = f"<div style='position:absolute;top:{top+478}px;width:100%;display:flex;justify-content:center'>{wavy(560, CHALK)}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+520}px;width:100%;{SH}'><div style='font:500 56px/1.15 Cv'>{ti['sub']}</div>"
              f"<div style='font:600 25px Mo;letter-spacing:.42em;padding-left:.42em;margin-top:30px;color:{INK}'>{ti['tag']}</div></div>")
chalk_keys |= {'tkick', 'tscript', 'thero', 'trule', 'tsub'}
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:118px;width:100%;{SH};font:600 26px Mo;letter-spacing:.45em;padding-left:.45em;color:{INK}'>PROOF Nº 0{i+1} / 05</div>"
    ov[f't{i}'] = (f"<div style='position:absolute;top:160px;width:100%;height:150px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',92)}px/1.02 Gl;{SH};max-width:1000px'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:316px;width:100%;{SH}'><div style='font:500 46px/1.1 Cv;padding:0 60px'>{f['line']}</div>"
                   f"<div style='font:600 25px Mo;letter-spacing:.3em;padding-left:.3em;margin-top:22px;color:{INK}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
    chalk_keys |= {f'k{i}', f't{i}', f'l{i}'}
# panel chalk outlines
ol = ''.join(f"<div style='position:absolute;left:{PX-7}px;top:{y-7}px;width:{PW+14-6}px;height:{PH+14-6}px;border:3px solid rgba(238,241,234,.8);border-radius:32px'></div>" for y in PYS)
ov['outl'] = ol; chalk_keys.add('outl')
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
for k in chalk_keys: chalkify(f'{T}/{k}.png', 0.7 if k == 'eqs' else (0.3 if k[0] in 'kl' or k == 'tkick' else 0.5), seed=hash(k) % 1000)
bd = board(W, H); bd = Image.alpha_composite(bd, Image.open(f'{T}/eqs.png')); bd.convert('RGB').save(f'{T}/board.png')
board(W, H, seed=5).convert('RGB').save(f'{T}/board_plain.png')
# rounded-panel masks: page with 3 transparent rounded holes
hole = Image.new('L', (W * 2, H * 2), 0); hd = ImageDraw.Draw(hole)
for y in PYS: hd.rounded_rectangle([PX * 2, y * 2, (PX + PW) * 2, (y + PH) * 2], 52, fill=255)
hole = hole.resize((W, H), Image.LANCZOS)
pm = Image.new('L', (PW * 2, PH * 2), 0); ImageDraw.Draw(pm).rounded_rectangle([0, 0, PW * 2 - 1, PH * 2 - 1], 52, fill=255)
pm = pm.resize((PW, PH), Image.LANCZOS); pmi = Image.new('RGBA', (PW, PH), (0, 0, 0, 255)); pmi.putalpha(pm); pmi.save(f'{T}/pmask.png')

n = [0]
def piece(img, dur, x=50, y=50, mv=1, amp=110, z=1.08, w=W, h=H, flash=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = max(h * z / im.height, w * 1.04 / im.width)
    W2 = int(im.width * s) // 2 * 2; H2 = int(im.height * s) // 2 * 2
    span = W2 - w; cx = span * x / 100; cy = (H2 - h) * y / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.16:color=white" if flash else ""
    vf = f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':{cy:.0f},fps={FPS},setsar=1{fl},format=yuv420p"
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.45:alpha=1[r];[b][r]overlay=x='min(0,-60+150*(t-0.25))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.45:alpha=1[h];[c][h]overlay=x=0:y='max(0,36-100*(t-0.5))'[d];"
      f"[5]format=rgba,fade=in:st=0.85:d=0.4:alpha=1[l];[d][l]overlay=x='min(0,-120+300*(t-0.85))':y=0[e];"
      f"[6]format=rgba,fade=in:st=1.15:d=0.5:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.15))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/trule.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6)
SPL = [[1.7, None], [1.2, None], [2.2, None]]
for i, f in enumerate(P['films']):
    imgs = f['imgs']; pv = []
    for p in range(3):
        d1 = SPL[p][0]; d2 = round(SEG - d1, 3)
        a = imgs[p]; b = imgs[p + 3]
        c1 = piece(a[0], d1, x=a[1], y=a[2], mv=1 if (p + i) % 2 else -1, amp=70, w=PW, h=PH, flash=(p == 0))
        c2 = piece(b[0], d2, x=b[1], y=b[2], mv=-1 if (p + i) % 2 else 1, amp=70, w=PW, h=PH, flash=True)
        open(f'{T}/q{i}{p}.txt', 'w').write(f"file '{c1}'\nfile '{c2}'\n")
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    # slide in: panel p from alternating sides starting at 0.12*p
    fc = f"[0]loop=-1:1:0,trim=duration={SEG},setpts=PTS-STARTPTS[bg];"
    fc += "[4]format=rgba,alphaextract,split=3[am0][am1][am2];"
    for p in range(3):
        fc += f"[{p+1}]setpts=PTS-STARTPTS,format=rgba[v{p}];[v{p}][am{p}]alphamerge[m{p}];"
    prev = 'bg'
    for p in range(3):
        st = 0.12 * p; dirn = -1 if (p + i) % 2 == 0 else 1
        xo = f"{PX}+{dirn}*{W}*max(0,1-(t-{st})/0.32)*max(0,1-(t-{st})/0.32)"
        fc += f"[{prev}][m{p}]overlay=x='{xo}':y={PYS[p]}:enable='gte(t,{st})'[o{p}];"; prev = f'o{p}'
    fc += (f"[5]format=rgba[ou];[{prev}][ou]overlay=0:0:enable='gte(t,0.45)'[l1];"
           f"[6]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[l1][k]overlay=x=0:y='max(0,20-80*t)'[l2];"
           f"[7]format=rgba,fade=in:st=0.15:d=0.4:alpha=1[t];[l2][t]overlay=x=0:y='max(0,28-90*(t-0.15))'[l3];"
           f"[8]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[l];[l3][l]overlay=x=0:y='max(0,24-80*(t-0.45))',format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -i {T}/board.png -i {pv[0]} -i {pv[1]} -i {pv[2]} -loop 1 -i {T}/pmask.png -loop 1 -i {T}/outl.png "
       f"-loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f'{T}/board_plain.png').convert('RGB')
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.02:contrast=1.04,colorbalance=rs=-0.01:gs=0.005:bs=0.01:rh=0.012:bh=-0.005,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
