"""PHOTO ALBUM (albumvid.py) — Usage: python3 albumvid.py WORKDIR (plan.json -> video.mp4)
Burst -> full-screen drifting title (Courier Prime kicker + giant Gloock + Caveat sub) -> per film 3 white-bordered
'prints' slightly tilted on warm album paper w/ shadows + washi tape, staggered drop-in, each print jump-cuts ~0.9s;
Courier 'Nº 0x / 05' + Gloock title above, Caveat line in the film's accent + 'year | where' below -> phone end card."""
import json, os, subprocess, sys, random, math
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFC56B'); PAPER = (239, 230, 214)
IW, IH, BD = 860, 440, 18; FW, FH = IW + 2 * BD, IH + 2 * BD
SLOTS = [(528, 500, -1.6), (552, 982, 1.3), (530, 1462, -0.9)]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,"
          f"eq=saturation=1.04:contrast=1.03,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Gl', 'gloock', 400) + ff('Cv', 'caveat', 500) + ff('Cv', 'caveat', 700) + ff('Cp', 'courier-prime', 400) + ff('Cp', 'courier-prime', 700) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF6EA;text-align:center}}"
SH = "text-shadow:0 2px 30px rgba(30,14,6,.8),0 0 12px rgba(30,14,6,.45)"
ti = P['title']; top = ti.get('top', 600)
ov = {}
ov['tshade'] = "<div style='position:absolute;inset:0;background:radial-gradient(ellipse 95% 42% at 50% 46%,rgba(28,14,8,.6),rgba(28,14,8,.22) 72%,rgba(28,14,8,.08))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:700 32px Cp;letter-spacing:.55em;padding-left:.55em'>{ti['kick']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+58}px;width:100%;{SH};font:400 {ti.get('fs',200)}px/1 Gl;letter-spacing:-.01em;color:#FFF6EA'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+300}px;width:100%;{SH}'>"
              f"<div style='display:inline-block;transform:rotate(-2.5deg);font:700 64px/1.1 Cv;color:{INK};max-width:900px'>{ti['sub']}</div>"
              f"<div style='font:700 24px Cp;letter-spacing:.45em;margin-top:44px;padding-left:.45em'>05 ANIME &nbsp;·&nbsp; KEEP THE PHOTOS</div></div>")
# album page: paper texture + soft shadows under each print
S2 = 2
def page():
    random.seed(3); pg = Image.new('RGB', (W, H), PAPER)
    nz = Image.effect_noise((W, H), 18).filter(ImageFilter.GaussianBlur(0.6))
    pg = Image.blend(pg, Image.merge('RGB', [nz] * 3).point(lambda v: v * 0.25 + 175), 0.10)
    vg = Image.new('L', (W, H), 0); ImageDraw.Draw(vg).ellipse([-300, -200, W + 300, H + 200], fill=255)
    vg = vg.filter(ImageFilter.GaussianBlur(220)); pg = Image.composite(pg, Image.new('RGB', (W, H), (214, 199, 176)), vg)
    shm = Image.new('L', (W, H), 0)
    for cx, cy, ang in SLOTS:
        r = Image.new('L', (FW, FH), 255).rotate(ang, expand=True, resample=Image.BICUBIC)
        shm.paste(r, (cx - r.width // 2 + 6, cy - r.height // 2 + 16), r)
    shm = shm.filter(ImageFilter.GaussianBlur(16)).point(lambda v: v * 0.42)
    pg = Image.composite(Image.new('RGB', (W, H), (70, 52, 36)), pg, shm)
    return pg
page().save(f'{T}/page.png')
def tape(cx, cy, ang, col, w=170, h=46):
    return (f"<div style='position:absolute;left:{cx-w//2}px;top:{cy-h//2}px;width:{w}px;height:{h}px;transform:rotate({ang}deg);"
            f"background:{col};opacity:.78;box-shadow:0 1px 3px rgba(0,0,0,.12);"
            f"-webkit-mask:linear-gradient(90deg,transparent 0,#000 4px,#000 calc(100% - 4px),transparent 100%)'></div>")
for i, f in enumerate(P['films']):
    ac = f['accent']; c0 = SLOTS[0]
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:258px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#2A211C;padding-top:18px;box-sizing:border-box'>"
                   f"<div style='font:700 24px Cp;letter-spacing:.42em;color:{ac};padding-left:.42em'>Nº 0{i+1} / 05</div>"
                   f"<div style='font:400 {f.get('fs',76)}px/1.02 Gl;margin-top:14px;max-width:1000px'>{f['t']}</div></div>"
                   + tape(c0[0] - FW // 2 + 70, c0[1] - FH // 2 - 2, -14, ac) + tape(c0[0] + FW // 2 - 60, c0[1] - FH // 2 + 4, 11, '#EBDDC2')
                   + tape(SLOTS[2][0] + FW // 2 - 80, SLOTS[2][1] - FH // 2 + 2, -9, ac, 140) +
                   f"<div style='position:absolute;top:1712px;width:100%;color:#2A211C'>"
                   f"<div style='display:inline-block;transform:rotate(-1.5deg);font:700 56px/1.05 Cv;color:{ac};max-width:1000px'>{f['line']}</div>"
                   f"<div style='font:700 24px Cp;letter-spacing:.3em;margin-top:22px;padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
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
      f"[3]format=rgba,fade=in:st=0.25:d=0.5:alpha=1[h];[b][h]overlay=x=0:y='max(0,60-150*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.8:d=0.5:alpha=1[u];[c][u]overlay=x=0:y='max(0,30-90*(t-0.8))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6); NP = P.get('pieces', 4)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); im = f['imgs']; nI = len(im); pans = []
    for k in range(3):
        L = [im[(2 * k + j) % nI] for j in range(NP)]
        off = 0.14 * k; b0 = round(sg / NP + off, 3); rest = sg - b0; durs = [b0] + [round(rest / (NP - 1), 3)] * (NP - 1)
        durs[-1] = round(sg - sum(durs[:-1]), 3)
        ps = [piece(L[j][0], durs[j], IW, IH, L[j][1], L[j][2] if len(L[j]) > 2 else 50, mv=1 if (j + k) % 2 else -1, z=1.1) for j in range(NP)]
        open(f'{T}/q{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = ''
    last = '3'
    for k in range(3):
        st = 0.12 * k; cx, cy, ang = SLOTS[k]
        a = ang * math.pi / 180; rw = int(abs(FW * math.cos(a)) + abs(FH * math.sin(a))) // 2 * 2 + 2; rh = int(abs(FW * math.sin(a)) + abs(FH * math.cos(a))) // 2 * 2 + 2
        fc += (f"[{k}]tpad=stop_mode=clone:stop_duration=1,pad={FW}:{FH}:{BD}:{BD}:color=#FBF8F1,format=rgba,"
               f"rotate={a:.5f}:c=none:ow={rw}:oh={rh}:bilinear=1,setpts=PTS+{st}/TB,fade=in:st={st}:d=0.22:alpha=1[q{k}];"
               f"[{last}][q{k}]overlay=x={cx - rw // 2}:y='{cy - rh // 2}-60*pow(max(0,1-(t-{st})/0.38),2)':eof_action=pass[l{k}];")
        last = f'l{k}'
    fc += f"[4]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[{last}][o]overlay=x=0:y='max(0,22-80*t)',format=yuv420p"
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -framerate {FPS} -i {T}/page.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (60, 36, 24)), 0.3)
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
fc += "[v]colorbalance=rs=0.01:gs=0.004:bs=-0.006,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
