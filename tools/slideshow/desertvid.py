"""HORIZON LINE stills video. Usage: python3 desertvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (deep sienna Syne caps on pale sky) -> per film 2 edge-to-edge 16:9 panels
sliding in from opposite sides with jump cuts, turquoise horizon rule between, Syne title on top, italic line +
'year | where' under -> phone end card on blurred still."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#9C3412'); ACC = P.get('acc', '#7FD8CF'); PAGE = P.get('page', '#170E09')
PW, PHt = 1080, 608; PYA, PYB = 352, 352 + 608 + 14
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Sy', 'syne', 800) + ff('Sy', 'syne', 700) + ff('Sg', 'space-grotesk', 500) + ff('Sg', 'space-grotesk', 400) + \
      ff('Co', 'cormorant-garamond', 500, 'italic') + ff('Co', 'cormorant-garamond', 400, 'italic') + ff('Pi', 'pinyon-script', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#F6EADB;text-align:center}}"
ti = P['title']; top = ti.get('top', 170)
GL = "text-shadow:0 0 30px rgba(255,246,232,.75),0 0 8px rgba(255,246,232,.5)"
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:900px;background:linear-gradient(180deg,rgba(255,247,236,.42),rgba(255,247,236,.25) 55%,rgba(255,247,236,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{GL};font:500 27px Sg;letter-spacing:.42em;padding-left:.42em;color:#3B1F12'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+52}px;width:100%;{GL};font:400 92px Pi;color:#3B1F12'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+150}px;width:100%;{GL};font:800 132px/1 Sy;letter-spacing:.04em;padding-left:.04em;color:{INK}'>{ti['hero']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+350}px;width:100%;{GL}'>"
              f"<div style='width:150px;height:3px;background:{INK};margin:0 auto 24px'></div>"
              f"<div style='font:500 italic 46px Co;color:#3B1F12'>{ti['sub']}</div></div>")
mat = Image.new('RGBA', (W, H), PAGE); m = Image.new('L', (W, H), 255); dm = ImageDraw.Draw(m)
for y in (PYA, PYB): dm.rectangle([0, y, W - 1, y + PHt - 1], fill=0)
mat.putalpha(m); mat.save(f'{T}/mat.png')
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{PYA}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:50px;box-sizing:border-box'>"
                   f"<div style='font:500 22px Sg;letter-spacing:.45em;color:{ACC};padding-left:.45em'>Nº 0{i+1} &nbsp;—&nbsp; 05</div>"
                   f"<div style='font:700 {f.get('fs',76)}px/1.04 Sy;margin-top:22px;max-width:1000px;letter-spacing:.04em;text-transform:uppercase'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{PYA+PHt+5}px;left:0;width:100%;height:4px;display:flex;justify-content:center'><div style='width:100%;height:4px;background:linear-gradient(90deg,transparent,{ACC} 25%,{ACC} 75%,transparent)'></div></div>"
                   f"<div style='position:absolute;top:{PYB+PHt+44}px;width:100%'>"
                   f"<div style='font:400 italic 42px/1.22 Co;max-width:900px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:400 23px Sg;letter-spacing:.3em;margin-top:24px;color:{ACC};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1, z=1.08))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.4:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.45:alpha=1[r];[b][r]overlay=x=0:y='max(0,36-110*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.6:alpha=1[h];[c][h]overlay=x=0:y='max(0,70-150*(t-0.45))'[d];"
      f"[5]format=rgba,fade=in:st=1.0:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-1.0))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.2); ST = 0.12; PHASES = 4
for i, f in enumerate(P['films']):
    imgs = f['imgs']; mm = len(imgs); panels = []
    for k in range(2):
        parts = []; t0 = ST * k
        for ph in range(PHASES):
            img, x = imgs[(ph * 2 + k) % mm][:2]
            y = imgs[(ph * 2 + k) % mm][2] if len(imgs[(ph * 2 + k) % mm]) > 2 else 50
            parts.append(piece(img, round((SEG - t0) / PHASES, 3), PW, PHt, x, y, mv=1 if (k + ph) % 2 else -1))
        open(f'{T}/p{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); panels.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(2): fc += f"[{k}]format=rgba,setpts=PTS-STARTPTS+{ST*k}/TB[q{k}];"
    fc += f"[bg][q0]overlay=x='-{W}*pow(max(0,1-t/0.32),3)':y={PYA}:eof_action=pass[l0];"
    fc += f"[l0][q1]overlay=x='{W}*pow(max(0,1-(t-{ST})/0.32),3)':y={PYB}:eof_action=pass[l1];"
    fc += f"[2]format=rgba[mt];[l1][mt]overlay=0:0[mm];[3]format=rgba,fade=in:st=0.12:d=0.3:alpha=1[o];[mm][o]overlay=0:0,format=yuv420p"
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (23, 14, 9)), 0.3)
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
fc += "[v]eq=saturation=1.04:contrast=1.03,colorbalance=rs=0.012:gs=0.004:bs=-0.012,noise=alls=6:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
