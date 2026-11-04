"""OLD LEGEND (illuminated manuscript) stills video. Usage: python3 legendvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Cinzel kicker, IM Fell italic 'an old', vermillion Cinzel Decorative LEGEND
w/ fleuron rule) -> per film: deep-forest page with a tall GOTHIC-ARCH window (gold double tracery) jump-cutting
through 4 drifting stills, below it 'TALE I OF V', Cinzel Decorative title w/ vermillion initial, IM Fell italic
line, 'year | where' -> phone end card."""
import json, os, subprocess, sys, math
import numpy as np
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#E2553A'); GOLD = P.get('gold', '#D4B26A'); IVORY = '#F4EAD5'; PAGE = (13, 23, 18)
X0, X1, YS, YB, R = 70, 1010, 800, 1330, 658
PW, PY0 = X1 - X0, None
cxL, cxR = X0 + R, X1 - R; APEX = int(YS - math.sqrt(R * R - (540 - cxL) ** 2)); PY0 = APEX - 2; PH = YB - PY0
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.10 * mv)); b = max(0, min(1, x / 100 + 0.10 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
# ---- page with arch hole + gold tracery (supersampled) ----
S = 2
yy, xx = np.mgrid[0:H * S, 0:W * S] / S
def inside(pad):
    l, r, ys, yb, rr = X0 - pad, X1 + pad, YS, YB + pad, R + pad
    cl, cr = l + rr, r - rr
    rect = (xx >= l) & (xx <= r) & (yy >= ys) & (yy <= yb)
    arch = (yy < ys) & (np.hypot(xx - cl, yy - ys) <= rr) & (np.hypot(xx - cr, yy - ys) <= rr) & (xx >= l) & (xx <= r)
    return rect | arch
hole = inside(0)
g1 = inside(10) & ~inside(4); g2 = inside(24) & ~inside(21)
# page: deep forest with soft radial light + faint parchment noise
cy, cx = H * S * 0.42, W * S / 2
rad = np.clip(np.hypot(xx * S - cx, (yy * S - cy) * 0.8) / (H * S * 0.75), 0, 1)
base = np.zeros((H * S, W * S, 4), np.float32)
for k, c in enumerate(PAGE): base[..., k] = c * (1.35 - 0.6 * rad)
rng = np.random.default_rng(3); base[..., :3] += rng.normal(0, 3.2, (H * S, W * S, 1))
base[..., 3] = 255
gc = [int(GOLD[i:i + 2], 16) for i in (1, 3, 5)]
for m, a in ((g1, 1.0), (g2, 0.6)):
    for k in range(3): base[..., k] = np.where(m, base[..., k] * (1 - a) + gc[k] * a, base[..., k])
base[..., 3] = np.where(hole, 0, 255)
frame = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), 'RGBA').resize((W, H), Image.LANCZOS)
frame.save(f'{T}/frame.png')
# ---- text overlays ----
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Cd', 'cinzel-decorative', 700) + ff('Cd', 'cinzel-decorative', 900) + ff('Cz', 'cinzel', 500) + ff('Cz', 'cinzel', 600) + \
      ff('Fe', 'im-fell-english', 400, 'italic') + ff('Fe', 'im-fell-english', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{IVORY};text-align:center}}"
SH = "text-shadow:0 2px 26px rgba(4,10,6,.9),0 0 10px rgba(4,10,6,.6)"
ROMAN = ['I', 'II', 'III', 'IV', 'V']
def rule(c, w=420): return (f"<div style='display:flex;align-items:center;justify-content:center;gap:18px;color:{c}'>"
                            f"<div style='width:{w//2}px;height:1.5px;background:linear-gradient(90deg,transparent,{c})'></div>"
                            f"<div style='font:400 30px Fe'>❦</div><div style='width:{w//2}px;height:1.5px;background:linear-gradient(270deg,transparent,{c})'></div></div>")
ti = P['title']; top = ti.get('top', 210)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(8,16,11,.9),rgba(8,16,11,.62) 52%,rgba(8,16,11,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:600 28px Cz;letter-spacing:.46em;padding-left:.46em;color:{GOLD}'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+70}px;width:100%;{SH};font:400 italic 104px/1 Fe'>{ti['script']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+190}px;width:100%;font:900 150px/1 Cd;letter-spacing:.02em;color:{INK};"
               f"text-shadow:0 0 34px rgba(226,85,58,.35),0 4px 28px rgba(4,10,6,.9)'>{ti['hero']}</div>")
ov['trule'] = f"<div style='position:absolute;top:{top+375}px;width:100%'>{rule(GOLD, 520)}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+440}px;width:100%;{SH}'>"
              f"<div style='font:400 italic 46px Fe'>{ti['sub']}</div>"
              f"<div style='font:600 22px Cz;letter-spacing:.42em;padding-left:.42em;margin-top:24px;color:{GOLD}'>{ti['tag']}</div></div>")
for i, f in enumerate(P['films']):
    t = f['t']
    ov[f'k{i}'] = (f"<div style='position:absolute;top:{YB+52}px;width:100%;font:600 23px Cz;letter-spacing:.5em;padding-left:.5em;color:{INK}'>"
                   f"✦ &nbsp;TALE {ROMAN[i]} OF V&nbsp; ✦</div>")
    ov[f't{i}'] = (f"<div style='position:absolute;top:{YB+100}px;width:100%;height:{f.get('th',190)}px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:700 {f.get('fs',76)}px/1.08 Cd;max-width:1000px'><span style='color:{INK};font-weight:900;font-size:1.22em'>{t[0]}</span>{t[1:]}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{YB+100+f.get('th',190)+8}px;width:100%'>"
                   f"<div style='font:400 italic 35px Fe;opacity:.9'>{f['line']}</div>"
                   f"<div style='margin-top:20px'>{rule(GOLD, 300)}</div>"
                   f"<div style='font:600 24px Cz;letter-spacing:.32em;margin-top:16px;color:{GOLD};padding-left:.32em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1))
tc = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.45:alpha=1[r];[b][r]overlay=x=0:y='max(0,40-110*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.5:alpha=1[h];[c][h]overlay=x=0:y='-60*pow(max(0,1-(t-0.5)/0.6),2)'[d];"
      f"[5]format=rgba,fade=in:st=0.9:d=0.4:alpha=1[l];[d][l]overlay=0:0[e];"
      f"[6]format=rgba,fade=in:st=1.2:d=0.5:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.2))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/trule.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6); NC = 4; C = SEG / NC
for i, f in enumerate(P['films']):
    imgs = f['imgs']
    parts = [piece(imgs[ph % len(imgs)][0], round(C, 3), PW, PH, imgs[ph % len(imgs)][1], imgs[ph % len(imgs)][2] if len(imgs[ph % len(imgs)]) > 2 else 50,
                   mv=1 if ph % 2 else -1) for ph in range(NC)]
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/p{i}.mp4")
    fc = (f"color=c=0x0D1712:s={W}x{H}:r={FPS}:d={SEG}[bg];"
          f"[0]format=rgba,fade=in:st=0:d=0.1:alpha=1[q];[bg][q]overlay=x={X0}:y={PY0}:eof_action=pass[l0];"
          f"[1]format=rgba[fr];[l0][fr]overlay=0:0[l1];"
          f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[l1][k]overlay=x=0:y='max(0,20-80*t)'[l2];"
          f"[3]format=rgba,fade=in:st=0.15:d=0.35:alpha=1[t];[l2][t]overlay=x=0:y='max(0,36-110*(t-0.15))'[l3];"
          f"[4]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[l];[l3][l]overlay=x=0:y='max(0,24-80*(t-0.45))',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/p{i}.mp4 -loop 1 -i {T}/frame.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), PAGE), 0.4)
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
fc += "[v]eq=saturation=1.03:contrast=1.03,colorbalance=rs=0.006:bs=-0.006,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
