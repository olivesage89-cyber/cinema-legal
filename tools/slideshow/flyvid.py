"""FLIGHT DECK stills video. Usage: python3 flyvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Space Grotesk kicker, Yellowtail 'feel like', Syne FLYING sliding in like a plane
w/ contrail) -> per film: two edge-to-edge drifting panels (top/bottom, offset jump cuts) around a navy 'flight band'
(FLIGHT 0N / 05, DM Serif italic title, year | where, dashed route w/ plane crossing) -> phone end card."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#A8DCFF'); BAND = P.get('band', '#0A1430')
PH1 = 770; BY0, BY1 = 770, 1150; PH2 = H - BY1
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Sy', 'syne', 800) + ff('Yt', 'yellowtail', 400) + ff('Ds', 'dm-serif-display', 400, 'italic') + ff('Ds', 'dm-serif-display', 400) + \
      ff('Sg', 'space-grotesk', 400) + ff('Sg', 'space-grotesk', 500) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF8EC;text-align:center}}"
SH = "text-shadow:0 2px 30px rgba(4,10,30,.85),0 0 10px rgba(4,10,30,.5)"
PLANE = ("<svg width='{s}' height='{s}' viewBox='0 0 24 24' style='transform:rotate(90deg)'><path fill='{c}' d='M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z'/></svg>")
ti = P['title']; top = ti.get('top', 200)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1150px;background:linear-gradient(180deg,rgba(6,12,34,.88),rgba(6,12,34,.6) 50%,rgba(6,12,34,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 28px Sg;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
ov['tscript'] = (f"<div style='position:absolute;top:{top+60}px;width:100%;{SH}'><div style='display:inline-block;transform:rotate(-7deg) translateX(-150px);"
                 f"font:400 118px Yt;color:#FFF8EC'>{ti['script']}</div></div>")
ov['thero'] = (f"<div style='position:absolute;top:{top+200}px;width:100%;font:800 158px/1 Sy;letter-spacing:.01em;color:{INK};"
               f"text-shadow:0 0 40px rgba(120,200,255,.45),0 4px 30px rgba(4,10,30,.8)'>{ti['hero']}</div>")
ov['ttrail'] = (f"<div style='position:absolute;top:{top+410}px;left:150px;width:780px;height:3px;background:linear-gradient(90deg,rgba(255,255,255,0),{INK})'></div>"
                f"<div style='position:absolute;top:{top+388}px;left:922px'>{PLANE.format(s=48, c=INK)}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+470}px;width:100%;{SH}'>"
              f"<div style='font:400 italic 46px Ds'>{ti['sub']}</div>"
              f"<div style='font:500 22px Sg;letter-spacing:.4em;padding-left:.4em;margin-top:26px;color:{INK}'>{ti['tag']}</div></div>")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:{BY0}px;height:{BY1-BY0}px;width:100%;background:{BAND};display:flex;flex-direction:column;justify-content:center;align-items:center'>"
                   f"<div style='position:absolute;top:0;width:100%;height:2px;background:{INK};opacity:.55'></div>"
                   f"<div style='position:absolute;bottom:0;width:100%;height:2px;background:{INK};opacity:.55'></div>"
                   f"<div style='font:500 21px Sg;letter-spacing:.42em;color:{INK};padding-left:.42em'>FLIGHT 0{i+1} / 05 &nbsp;·&nbsp; {f['alt']}</div>"
                   f"<div style='font:400 italic {f.get('fs',76)}px/1.04 Ds;margin-top:16px;max-width:1000px'>{f['t']}</div>"
                   f"<div style='font:400 italic 30px Ds;opacity:.85;margin-top:12px'>{f['line']}</div>"
                   f"<div style='font:500 22px Sg;letter-spacing:.3em;margin-top:16px;color:{INK};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                   f"<div style='position:absolute;bottom:22px;left:90px;width:900px;border-top:2px dashed rgba(168,220,255,.35)'></div></div>")
ov['plane'] = f"<div style='position:absolute;top:0;left:0'>{PLANE.format(s=34, c=INK)}</div>"
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
Image.open(f'{T}/plane.png').crop((0, 0, 40, 40)).save(f'{T}/plane_s.png')
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1))
tc = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.4:alpha=1[r];[b][r]overlay=x='-120*pow(max(0,1-(t-0.25)/0.6),2)':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[h];[c][h]overlay=x='-1100*pow(max(0,1-(t-0.45)/0.7),3)':y=0[d];"
      f"[5]format=rgba,fade=in:st=0.7:d=0.3:alpha=1[l];[d][l]overlay=x='-1100*pow(max(0,1-(t-0.7)/0.8),3)':y=0[e];"
      f"[6]format=rgba,fade=in:st=1.2:d=0.5:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.2))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/ttrail.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4); C = SEG / 4
for i, f in enumerate(P['films']):
    imgs = f['imgs']; mm = len(imgs)
    tp = [piece(imgs[(ph * 2) % mm][0], round(C, 3), W, PH1, imgs[(ph * 2) % mm][1], 50, mv=1 if ph % 2 else -1) for ph in range(4)]
    bd = [C / 2, C, C, C, SEG - C / 2 - 3 * C]
    bp = [piece(imgs[(ph * 2 + 1) % mm][0], round(d, 3), W, PH2, imgs[(ph * 2 + 1) % mm][1], 50, mv=-1 if ph % 2 else 1) for ph, d in enumerate(bd)]
    for nm, parts in (('top', tp), ('bot', bp)):
        open(f'{T}/{nm}{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/{nm}{i}.txt -c copy {T}/{nm}{i}.mp4")
    fc = (f"color=c={BAND}:s={W}x{H}:r={FPS}:d={SEG}[bg];"
          f"[0]format=rgba,fade=in:st=0:d=0.2:alpha=1[q0];[bg][q0]overlay=x=0:y='-70*pow(max(0,1-t/0.3),2)':eof_action=pass[l0];"
          f"[1]format=rgba,fade=in:st=0:d=0.2:alpha=1,setpts=PTS-STARTPTS+0.08/TB[q1];[l0][q1]overlay=x=0:y='{BY1}+70*pow(max(0,1-(t-0.08)/0.3),2)':eof_action=pass[l1];"
          f"[2]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[l1][o]overlay=0:0[l2];"
          f"[3]format=rgba[pl];[l2][pl]overlay=x='60+900*t/{SEG}':y={BY1-22-19},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/top{i}.mp4 -i {T}/bot{i}.mp4 -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/plane_s.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 18, 44)), 0.35)
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
fc += "[v]eq=saturation=1.04:contrast=1.02,colorbalance=rs=-0.004:bs=0.008,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
