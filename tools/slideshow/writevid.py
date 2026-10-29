"""TYPEWRITER moving-stills video (1080x1920). Usage: python3 writevid.py WORKDIR (reads plan.json -> video.mp4)
Look: flash burst -> full-screen drifting stills with typed kicker + handwritten hero word wiping in ->
per film: big still panel on top jump-cutting through 4 drifting stills, cream typewriter paper below where the
title types itself letter by letter (two-tone ribbon: black title, red number/year line) + a blue-ink handwritten
note -> framed app phone end card (no text)."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
PH = P.get('panel_h', 1320)
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def still(img, dur, w, h, x=50, y=50, seed=0, zoom=0.07):
    random.seed(seed + n[0]); n[0] += 1; out = f'{T}/s{n[0]}.mp4'; fr = max(2, int(round(dur * FPS)))
    im = Image.open(f'{D}/{img}').convert('RGB'); s = max(w / im.width, h / im.height) * 1.12
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    l = int((im.width - w * 1.12) * x / 100); t = int((im.height - h * 1.12) * y / 100)
    im = im.crop((l, t, l + int(w * 1.12), t + int(h * 1.12))); p = f'{T}/s{n[0]}.png'; im.save(p)
    zin = random.random() < .5; dx = random.choice([-1, 1]); step = zoom / fr
    z = f"'1.0+{step:.5f}*on'" if zin else f"'{1+zoom:.4f}-{step:.5f}*on'"
    xs = f"'(iw-iw/zoom)/2+{dx}*(on-{fr/2})*{0.9*w/1080:.3f}'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -vf \"scale={im.width*2}:-1,zoompan=z={z}:x={xs}:y='(ih-ih/zoom)/2':d={fr}:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p\" -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out
def cat(parts, out):
    lst = out + '.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {out}"); return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Typ', 'special-elite', 400) + ff('Cou', 'courier-prime', 400) + ff('Cou', 'courier-prime', 400, 'italic') + ff('Cou', 'courier-prime', 700) +
       ff('Hand', 'homemade-apple', 400) + "*{margin:0;padding:0;box-sizing:border-box}body{background:transparent;overflow:hidden}"
       ".car{display:inline-block;width:.09em;height:.95em;margin-left:.06em;vertical-align:-.12em;background:currentColor}")
import numpy as np
_n = np.random.default_rng(3).normal(0, 1, (700, W)).astype('float32')
_g = np.asarray(Image.fromarray(np.clip(128 + _n * 40, 0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))).astype('float32')
_arr = np.array([246, 238, 222], 'float32')[None, None, :] + (_g[..., None] - 128) * 0.22
Image.fromarray(np.clip(_arr, 0, 255).astype('uint8')).save(f'{T}/paper.png')
NOISE = f"url(file://{T}/paper.png)"
INK = P.get('ink', '#A9C8FF'); RED = '#B8302A'; BLK = '#1F1B18'; BLUE = '#2A4F95'

def typed(s, t, t0, cps):
    k = max(0, min(len(s), int((t - t0) * cps))) if t >= t0 else 0
    return s[:k], (t >= t0 and k < len(s))

# ---- title overlay: JS-driven page, one screenshot per frame ----
ti = P['title']; TD = sum(c[1] for c in ti['stills'])
frames_js = []
def title_html(t):
    kick, kt = typed(ti['kick'], t, 0.12, 24)
    t_hero0 = 0.12 + len(ti['kick']) / 24 + 0.12; wipe = max(0, min(1, (t - t_hero0) / 0.85))
    sub_t0 = t_hero0 + 0.9; sub, st_ = typed(ti['sub'], t, sub_t0, 30)
    blink = int(t * 2.4) % 2 == 0
    car = lambda on: "<span class='car'></span>" if on else ""
    show_k_car = kt or (t < t_hero0 and blink)
    show_s_car = st_ or (t >= sub_t0 + len(ti['sub']) / 30 and blink)
    return (f"<div style='position:absolute;top:0;left:0;width:100%;height:1180px;background:linear-gradient(180deg,rgba(8,7,6,.70),rgba(8,7,6,.42) 55%,rgba(8,7,6,0))'></div>"
            f"<div style='position:absolute;top:{ti.get('top',300)}px;left:0;width:100%;text-align:center;color:#F6EBD9;text-shadow:0 2px 22px rgba(0,0,0,.55)'>"
            f"<div style='font:400 46px Typ;letter-spacing:.02em;height:60px'>{kick}{car(show_k_car)}</div>"
            f"<div style='font:400 230px/1.25 Hand;color:{INK};margin-top:30px;height:330px;opacity:{1 if wipe>0 else 0};clip-path:inset(-40% {100-wipe*100:.2f}% -40% -5%);transform:rotate(-4deg)'>{ti['hero']}</div>"
            f"<div style='font:italic 400 42px Cou;margin-top:40px;height:56px;letter-spacing:.01em'>{sub}{car(show_s_car) if t>=sub_t0 else ''}</div></div>")
def paper_html(f, i, nf, t):
    num = f"0{i+1} / 0{nf}"
    title, tt = typed(f['t'], t, 0.15, 19)
    y0 = 0.15 + len(f['t']) / 19 + 0.1; yl, yt = typed(f"{f['yr']}  |  {f['where'].upper()}", t, y0, 40)
    h0 = y0 + len(f['yr'] + f['where']) / 40 + 0.25; wipe = max(0, min(1, (t - h0) / 0.7))
    blink = int(t * 2.4) % 2 == 0
    car = "<span class='car'></span>"
    tc = car if (tt or (t < y0 and blink)) else ''
    yc = car if (yt or (t >= y0 and not yt and t < h0 + 0.7 and blink)) else ''
    fs = f.get('fs', 84)
    return (f"<div style='position:absolute;left:0;top:0;width:{W}px;height:{H-PH}px;background:#F1E7D4;background-image:{NOISE};"
            f"box-shadow:inset 0 26px 30px -18px rgba(0,0,0,.55), inset 0 -60px 120px -40px rgba(90,60,30,.22)'>"
            f"<div style='position:absolute;left:92px;top:78px;font:400 32px Typ;color:{RED};letter-spacing:.18em'>{num}</div>"
            f"<div style='position:absolute;left:88px;right:70px;top:136px;font:400 {fs}px/1.08 Typ;color:{BLK};opacity:.94'>{title}{tc}</div>"
            f"<div style='position:absolute;left:92px;top:{136+int(fs*1.08)*f.get('lines',1)+30}px;font:700 32px Cou;color:{RED};letter-spacing:.14em'>{yl}{yc}</div>"
            f"<div style='position:absolute;left:96px;right:40px;top:{136+int(fs*1.08)*f.get('lines',1)+118}px;font:400 50px/1.6 Hand;color:{BLUE};transform:rotate(-2.2deg);transform-origin:left;opacity:{1 if wipe>0 else 0};"
            f"clip-path:inset(-30% {100-wipe*100:.2f}% -30% -2%)'>{f['note']}</div></div>")

jobs = []
for fr in range(int(round(TD * FPS))):
    jobs.append(dict(html=title_html(fr / FPS), path=f'{T}/ti_{fr:04d}.png', w=W, h=H))
SEG = P.get('seg', 3.6)
for i, f in enumerate(P['films']):
    for fr in range(int(round(SEG * FPS))):
        jobs.append(dict(html=paper_html(f, i, len(P['films']), fr / FPS), path=f'{T}/p{i}_{fr:04d}.png', w=W, h=H - PH))
json.dump(jobs, open(f'{T}/jobs.json', 'w'))
open(f'{T}/shoot.js', 'w').write(
    "const {chromium}=require('playwright');const fs=require('fs');(async()=>{const J=JSON.parse(fs.readFileSync('%s/jobs.json'));"
    "const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
    "fs.writeFileSync('%s/_o.html','<html><head><style>%s</style></head><body><div id=r></div><div style=\"font-family:Typ;position:absolute;left:-999px\">a</div><div style=\"font-family:Hand;position:absolute;left:-999px\">a</div><div style=\"font-family:Cou;position:absolute;left:-999px\">a<i>a</i><b>a</b></div></body></html>');"
    "await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(300);"
    "for(const j of J){await p.evaluate(h=>{document.getElementById('r').innerHTML=h},j.html);"
    "await p.screenshot({path:j.path,omitBackground:true,clip:{x:0,y:0,width:j.w,height:j.h}});}await b.close();})();"
    % (T, W, H, T, CSS.replace("'", "\\'"), T))
sh(f'cd {ENGINE} && node {T}/shoot.js')

segs = []
for b in P['burst']: segs.append(still(b[0], P.get('flash', 0.2), W, H, x=b[1], zoom=0.03))
tc = [still(c[0], c[1], W, H, x=c[2]) for c in ti['stills']]; cat(tc, f'{T}/tbg.mp4')
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -framerate {FPS} -i {T}/ti_%04d.png -filter_complex "
   f"\"[0]eq=brightness=-0.03[b];[1]format=rgba[o];[b][o]overlay=0:0:shortest=1,format=yuv420p\" -t {TD} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
for i, f in enumerate(P['films']):
    st = f['stills']; d = SEG / len(st)
    parts = [still(c[0], round(d, 3), W, PH, x=c[1], y=c[2] if len(c) > 2 else 50, seed=i * 13 + k, zoom=0.07) for k, c in enumerate(st)]
    pan = cat(parts, f'{T}/pan{i}.mp4')
    sh(f"ffmpeg -v error -y -i {pan} -framerate {FPS} -i {T}/p{i}_%04d.png -filter_complex "
       f"\"color=c=#0b0a09:s={W}x{H}:r={FPS}:d={SEG}[bg];[bg][0]overlay=0:0:eof_action=repeat[a];[1]format=rgba[o];[a][o]overlay=0:{PH},format=yuv420p\" "
       f"-t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# end card
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (12, 10, 9)), 0.36)
ph = Image.open(f'{D}/phone.png').convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
m = m.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, m)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 14 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.03:contrast=1.02,colorbalance=rs=0.02:bs=-0.015,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
