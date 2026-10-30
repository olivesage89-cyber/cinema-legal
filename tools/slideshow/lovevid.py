"""Fast-paced MOVING-STILLS video (1080x1920). Usage: python3 stillfast.py WORKDIR (reads plan.json -> video.mp4)
Look (first-love): flash burst -> full-screen title (Parisienne hero) -> per film FULL-BLEED jump cuts through 3 drifting stills
with a bottom gradient + numbered Fraunces italic title + Jost "year | where", soft white flash between films -> phone end card."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFB3C6')
PW, PH, GAP, TOPY = 944, 530, 20, 242
PX = (W - PW) // 2
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def still(img, dur, w, h, x=50, y=50, seed=0, zoom=0.07):
    """slow drift / zoom on one still -> w x h mp4"""
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

# ---------- overlays ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Scr', 'parisienne', 400) + ff('Jo', 'jost', 400) + ff('Jo', 'jost', 500) + ff('Fr', 'fraunces', 400, 'italic') + ff('Fr', 'fraunces', 300, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
CREAM = P.get('cream', '#FFF4EE')
ov = {}; ti = P['title']
ov['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1150px;background:linear-gradient(180deg,rgba(10,6,18,.6),rgba(10,6,18,.3) 55%,rgba(10,6,18,0))'></div>"
               f"<div style='position:absolute;top:{ti.get('top',300)}px;width:100%;text-shadow:0 2px 28px rgba(20,0,20,.55),0 0 8px rgba(0,0,0,.25)'>"
               f"<div style='font:500 30px Jo;letter-spacing:.55em;padding-left:.55em;color:{CREAM}'>{ti['kick']}</div>"
               f"<div style='font:400 300px/1.0 Scr;margin-top:18px'>{ti['hero']}</div>"
               f"<div style='width:120px;height:2px;background:{INK};margin:22px auto 26px;opacity:.85'></div>"
               f"<div style='font:italic 300 52px/1.25 Fr;color:{CREAM}'>{ti['sub']}</div></div>")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;bottom:0;left:0;width:100%;height:980px;background:linear-gradient(0deg,rgba(10,6,18,.9),rgba(10,6,18,.66) 42%,rgba(10,6,18,0))'></div>"
                   f"<div style='position:absolute;bottom:{f.get('bottom',190)}px;width:100%;text-shadow:0 2px 22px rgba(0,0,0,.5)'>"
                   f"<div style='font:400 120px/1 Scr;text-shadow:0 0 18px rgba(255,140,170,.35),0 2px 16px rgba(0,0,0,.6)'>{f.get('num','No. ' + str(i+1))}</div>"
                   f"<div style='font:italic 400 {f.get('fs',84)}px/1.08 Fr;color:{CREAM};margin-top:14px;padding:0 70px'>{f['t']}</div>"
                   f"<div style='font:500 29px Jo;letter-spacing:.36em;padding-left:.38em;margin-top:26px;color:{CREAM};opacity:.9'>{f['yr']} &nbsp;<span style='color:{INK}'>|</span>&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
# 1. burst
for b in P['burst']: segs.append(still(b[0], P.get('flash', 0.2), W, H, x=b[1], zoom=0.03))
# 2. title
tc = [still(c[0], c[1], W, H, x=c[2]) for c in ti['stills']]; tdur = sum(c[1] for c in ti['stills'])
cat(tc, f'{T}/tbg.mp4')
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/title.png -filter_complex "
   f"\"[0]eq=brightness=-0.03[b];[1]format=rgba,fade=in:st=0.1:d=0.55:alpha=1[o];[b][o]overlay=x=0:y='max(0,46-140*t)':shortest=1,format=yuv420p\" "
   f"-t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films: full-bleed jump cuts, text rises in, soft white flash at the cut into each film
for i, f in enumerate(P['films']):
    parts = [still(c[0], c[1], W, H, x=c[2], seed=i * 13 + k, zoom=0.07) for k, c in enumerate(f['stills'])]
    cat(parts, f'{T}/fb{i}.mp4'); d = sum(c[1] for c in f['stills'])
    sh(f"ffmpeg -v error -y -i {T}/fb{i}.mp4 -loop 1 -i {T}/f{i}.png -filter_complex "
       f"\"[0]fade=in:st=0:d=0.18:color=white[b];[1]format=rgba,fade=in:st=0.08:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='max(0,36-160*t)':shortest=1,format=yuv420p\" "
       f"-t {d} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# 4. end card: framed phone on blurred still, no text
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 9, 14)), 0.38)
ph = Image.open(P['phone']).convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
m = m.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, m)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 14 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
# concat + grade + grain
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.02,colorbalance=rs=0.02:bs=-0.012,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
