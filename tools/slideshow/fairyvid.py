"""STORYBOOK ARCH stills video. Usage: python3 fairyvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Cinzel Decorative + Pinyon Script + Libre Caslon) -> per film ONE tall arched
window (gold double frame, starry midnight page) with ~0.8s jump cuts, chapter number + title above, line + 'year | where'
below -> phone end card."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFB98A'); PAGE = P.get('page', '#0F0E12')
PW, PHt, PX, PY0 = 900, 1090, 90, 440
RAD = PW // 2
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Cd', 'cinzel-decorative', 400) + ff('Cd', 'cinzel-decorative', 700) + ff('Ps', 'pinyon-script', 400) + \
      ff('Lc', 'libre-caslon-text', 400) + ff('Lc', 'libre-caslon-text', 400, 'italic') + ff('Lc', 'libre-caslon-text', 700) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FBF1DF;text-align:center}}"
SH = "text-shadow:0 2px 34px rgba(10,6,20,.9),0 0 12px rgba(10,6,20,.55)"
ti = P['title']; top = ti.get('top', 230)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(14,12,38,.86),rgba(14,12,38,.62) 48%,rgba(14,12,38,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:400 27px Lc;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div><div style='position:absolute;top:{top+52}px;width:100%;color:{INK};font:400 26px Lc;letter-spacing:.6em;{SH}'>&#10022; &#10022; &#10022;</div>"
ov['tbrush'] = (f"<div style='position:absolute;top:{top+300}px;width:100%;{SH}'><div style='display:inline-block;transform:rotate(-4deg);"
                f"font:400 112px/1 Ps;color:{INK}'>{ti['brush']}</div></div>")
ov['thero'] = (f"<div style='position:absolute;top:{top+110}px;width:100%;{SH};font:700 {ti.get('fs',150)}px/1 Cd;letter-spacing:.01em;color:#FBF1DF'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+470}px;width:100%;{SH}'>"
              f"<div style='width:140px;height:1.5px;background:{INK};margin:0 auto 28px'></div>"
              f"<div style='font:400 italic 40px/1.35 Lc;max-width:880px;margin:0 auto'>{ti['sub']}</div></div>")
# mat: starry page with an arched window + gold double frame
import random; random.seed(7)
S2 = 2; mat = Image.new('RGBA', (W*S2, H*S2), PAGE); st = Image.new('RGBA', mat.size, (0, 0, 0, 0)); dm = ImageDraw.Draw(st)
for _ in range(170):
    x, y = random.randrange(W*S2), random.randrange(H*S2); r = random.choice([1, 1, 2, 2, 3]); al = random.randint(60, 190)
    dm.ellipse([x-r, y-r, x+r, y+r], fill=(250, 236, 200, al))
mat.alpha_composite(st)
def arch(d, off, **k):
    x0, y0, x1, y1 = (PX-off)*S2, (PY0-off)*S2, (PX+PW+off)*S2, (PY0+PHt+off)*S2; rr = (RAD+off)*S2
    d.pieslice([x0, y0, x1, y0+2*rr], 180, 360, **k); d.rectangle([x0, y0+rr, x1, y1], **k)
m = Image.new('L', (W*S2, H*S2), 255); arch(ImageDraw.Draw(m), 0, fill=0)
mat.putalpha(m)
def outline(off, w):
    ol = Image.new('L', (W*S2, H*S2), 0); d = ImageDraw.Draw(ol); arch(d, off+w, fill=255); arch(d, off, fill=0); return ol
g = Image.new('RGBA', (W*S2, H*S2), INK)
for off, w in [(16, 3), (30, 1.5)]:
    mat.alpha_composite(Image.composite(g, Image.new('RGBA', g.size, (0,0,0,0)), outline(off, int(w*S2))))
mat = mat.resize((W, H), Image.LANCZOS); mat.save(f'{T}/mat.png')
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{PY0-30}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:60px;box-sizing:border-box'>"
                   f"<div style='font:400 23px Lc;letter-spacing:.5em;color:{INK};padding-left:.5em'>CHAPTER {['I','II','III','IV','V'][i]}</div>"
                   f"<div style='font:700 {f.get('fs',60)}px/1.12 Cd;margin-top:22px;max-width:1000px'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{PY0+PHt+64}px;width:100%'>"
                   f"<div style='font:400 italic 36px/1.3 Lc;max-width:900px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:400 23px Lc;letter-spacing:.3em;margin-top:24px;color:{INK};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
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
      f"[2]format=rgba,fade=in:st=0.05:d=0.4:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.4:alpha=1[r];[b][r]overlay=x='max(0,-60+150*(t-0.3))*0':y='max(0,40-120*(t-0.3))'[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.6:alpha=1[h];[c][h]overlay=x=0:y='max(0,80-160*(t-0.5))'[d];"
      f"[5]format=rgba,fade=in:st=1.1:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-1.1))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tbrush.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.2)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); imgs = f['imgs']; parts = []; d = round(sg / len(imgs), 3)
    for ph, (img, x) in enumerate(imgs):
        parts.append(piece(img, d, PW, PHt, x, 50, mv=1 if ph % 2 else -1, z=1.12))
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/pan{i}.mp4")
    fc = (f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={sg}[bg];[0]format=rgba,fade=in:st=0:d=0.25:alpha=1[q];"
          f"[bg][q]overlay=x={PX}:y='{PY0}+50*pow(max(0,1-t/0.35),2)':eof_action=pass[l];"
          f"[1]format=rgba[mt];[l][mt]overlay=0:0[mm];[2]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[mm][o]overlay=x=0:y='max(0,24-80*t)',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/pan{i}.mp4 -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (18, 17, 42)), 0.35)
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
fc += "[v]eq=saturation=1.03:contrast=1.02,colorbalance=rs=0.008:bs=-0.006,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
