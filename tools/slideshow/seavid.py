"""TIDE PANELS stills video. Usage: python3 seavid.py WORKDIR (reads plan.json -> video.mp4)
plan: burst [[img,x]], title {shots:[[img,x,d]], kick, hero, sub}, films [{t,yr,where,imgs:[[img,x]...]}], end_bg, phone, ink."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#9FF0DC')
PH = 500; BAND = H - 3 * PH  # 420 band at bottom
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    """drifting still: cover-scale to w*z x h*z, pan horizontally (mv=+1/-1) with a gentle push."""
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Scr', 'allura', 400) + ff('Pra', 'prata', 400) + ff('Lex', 'lexend', 400) + ff('Lex', 'lexend', 500) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#fff;text-align:center}}"
SH = "text-shadow:0 2px 30px rgba(0,10,25,.85),0 0 10px rgba(0,10,25,.5)"
ti = P['title']; top = ti.get('top', 250)
WAVE = ("<svg width='220' height='18' viewBox='0 0 220 18'><path d='M0 9 Q 13.75 0 27.5 9 T 55 9 T 82.5 9 T 110 9 T 137.5 9 T 165 9 T 192.5 9 T 220 9' "
        f"fill='none' stroke='{INK}' stroke-width='2.2'/></svg>")
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1150px;background:linear-gradient(180deg,rgba(2,14,30,.8),rgba(2,14,30,.55) 50%,rgba(2,14,30,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 27px Lex;letter-spacing:.46em;padding-left:.46em'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:400 230px/1.15 Scr;color:{INK}'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+340}px;width:100%;{SH}'><div style='margin-bottom:20px'>{WAVE}</div>"
              f"<div style='font:400 44px Pra;letter-spacing:.01em'>{ti['sub']}</div></div>")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:{3*PH}px;height:{BAND}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center'>"
                   f"<div style='font:500 21px Lex;letter-spacing:.42em;color:{INK};padding-left:.42em'>Nº 0{i+1} &nbsp;/&nbsp; 05</div>"
                   f"<div style='font:400 {f.get('fs',64)}px/1.12 Pra;margin-top:22px;max-width:960px'>{f['t']}</div>"
                   f"<div style='margin-top:22px'>{WAVE}</div>"
                   f"<div style='font:400 22px Lex;letter-spacing:.3em;margin-top:16px;opacity:.85;padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
# 1. burst
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1))
# 2. title: full-screen drifting stills, layered title rising in
tc = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.5:alpha=1[k];[a][k]overlay=x=0:y='max(0,30-90*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.6:alpha=1[h];[b][h]overlay=x=0:y='max(0,70-140*(t-0.3))'[c];"
      f"[4]format=rgba,fade=in:st=0.9:d=0.5:alpha=1[u];[c][u]overlay=x=0:y='max(0,40-100*(t-0.9))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films: 3 edge-to-edge panels sliding in from alternating sides, jump cuts inside, title band below
SEG = P.get('seg', 3.3); ST = 0.12; PHASES = 3
for i, f in enumerate(P['films']):
    imgs = f['imgs']; m = len(imgs); panels = []
    for k in range(3):
        parts = []; t0 = ST * k
        for ph in range(PHASES):
            img, x = imgs[(k + ph) % m]
            x = max(0, min(100, x + (ph - 1) * 12 * (1 if k % 2 else -1)))
            d = (SEG - t0) / PHASES
            parts.append(piece(img, round(d, 3), W, PH, x, 50, mv=1 if (k + ph) % 2 else -1))
        open(f'{T}/p{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); panels.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c=#06182a:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(3): fc += f"[{k}]setpts=PTS-STARTPTS+{ST*k}/TB[q{k}];"
    prev = 'bg'
    for k in range(3):
        sgn = 1 if k % 2 == 0 else -1; st = ST * k
        xe = f"'{sgn}*W*pow(max(0,1-(t-{st}+0.12)/0.34),3)'"
        fc += f"[{prev}][q{k}]overlay=x={xe}:y={k*PH}:eof_action=pass[l{k}];"; prev = f'l{k}'
    fc += f"[3]format=rgba,fade=in:st=0.15:d=0.3:alpha=1[o];[{prev}][o]overlay=0:0,format=yuv420p"
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# 4. end card: framed phone on blurred still, no text
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (6, 18, 34)), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
m = m.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, m)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.02,colorbalance=bs=0.012:rs=-0.008,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
