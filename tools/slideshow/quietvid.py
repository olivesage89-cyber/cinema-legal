"""QUIET PANELS (quietvid.py) — Usage: python3 quietvid.py WORKDIR (plan.json -> video.mp4)
Burst -> full-screen drifting title (Allura script + Fraunces + Figtree) -> per film 3 rounded panels stacked on a
deep moss page, staggered rise-in, each panel jump-cuts once; Nº + Fraunces title above, italic line + 'year | where'
below -> framed phone end card (no text)."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#D6EBC8'); PAGE = P.get('page', '#0D120E')
PWd, PHp, GAP, PX, PY0 = 960, 392, 18, 60, 318
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14, gray=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Fr', 'fraunces', 300) + ff('Fr', 'fraunces', 300, 'italic') + ff('Fr', 'fraunces', 400, 'italic') + ff('Al', 'allura', 400) + \
      ff('Fg', 'figtree', 400) + ff('Fg', 'figtree', 500) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#F3F1E8;text-align:center}}"
SH = "text-shadow:0 2px 30px rgba(6,12,8,.85),0 0 10px rgba(6,12,8,.5)"
ti = P['title']; top = ti.get('top', 560)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:100%;background:radial-gradient(ellipse 90% 45% at 50% 47%,rgba(6,12,8,.62),rgba(6,12,8,.25) 70%,rgba(6,12,8,.1))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 31px Fg;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tbrush'] = (f"<div style='position:absolute;top:{top+70}px;width:100%;{SH}'><div style='display:inline-block;transform:rotate(-4deg);"
                f"font:400 132px/1 Al;color:{INK}'>{ti['brush']}</div></div>")
ov['thero'] = (f"<div style='position:absolute;top:{top+200}px;width:100%;{SH};font:300 {ti.get('fs',190)}px/1 Fr;letter-spacing:-.01em;color:#FAF8F0'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+440}px;width:100%;{SH}'>"
              f"<div style='font:300 italic 42px/1.35 Fr;max-width:860px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='font:500 22px Fg;letter-spacing:.5em;margin-top:34px;color:{INK};padding-left:.5em'>05 ANIME &nbsp;·&nbsp; BREATHE</div></div>")
# page with 3 rounded windows + thin ink hairlines
S2 = 2
def mat():
    m = Image.new('RGBA', (W*S2, H*S2), PAGE); al = Image.new('L', m.size, 255); d = ImageDraw.Draw(al); dl = ImageDraw.Draw(m)
    for k in range(3):
        y = PY0 + k*(PHp+GAP)
        d.rounded_rectangle([PX*S2, y*S2, (PX+PWd)*S2, (y+PHp)*S2], 34*S2, fill=0)
    m.putalpha(al)
    # soft grain-free vignette glow at top
    return m.resize((W, H), Image.LANCZOS)
mat().save(f'{T}/mat.png')
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{PY0}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:40px;box-sizing:border-box'>"
                   f"<div style='font:500 27px Fg;letter-spacing:.5em;color:{INK};padding-left:.55em'>Nº 0{i+1} &nbsp;—&nbsp; 05</div>"
                   f"<div style='font:300 {f.get('fs',84)}px/1.05 Fr;margin-top:18px;max-width:1000px;letter-spacing:-.01em'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{PY0+3*PHp+2*GAP+52}px;width:100%'>"
                   f"<div style='font:300 italic 46px/1.3 Fr;max-width:980px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:500 28px Fg;letter-spacing:.32em;margin-top:26px;color:{INK};padding-left:.34em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
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
      f"[3]format=rgba,fade=in:st=0.3:d=0.5:alpha=1[r];[b][r]overlay=x=0:y='max(0,40-120*(t-0.3))'[c];"
      f"[4]format=rgba,fade=in:st=0.55:d=0.6:alpha=1[h];[c][h]overlay=x=0:y='max(0,70-150*(t-0.55))'[d];"
      f"[5]format=rgba,fade=in:st=1.1:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-1.1))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tbrush.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.0)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); im = f['imgs']; pans = []
    for k in range(3):
        st = 0.15 * k; cut = round(sg * 0.5 + 0.12 * k, 3)
        a = piece(im[k][0], cut, PWd, PHp, im[k][1], im[k][2] if len(im[k]) > 2 else 50, mv=1 if k % 2 else -1, z=1.1)
        b = piece(im[k+3][0], round(sg - cut, 3), PWd, PHp, im[k+3][1], im[k+3][2] if len(im[k+3]) > 2 else 50, mv=-1 if k % 2 else 1, z=1.1)
        open(f'{T}/q{i}{k}.txt', 'w').write(f"file '{a}'\nfile '{b}'\n")
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={sg}[bg];"
    last = 'bg'
    for k in range(3):
        st = 0.13 * k; y = PY0 + k * (PHp + GAP)
        fc += (f"[{k}]tpad=stop_mode=clone:stop_duration=1,format=rgba,setpts=PTS+{st}/TB,fade=in:st={st}:d=0.28:alpha=1[q{k}];"
               f"[{last}][q{k}]overlay=x={PX}:y='{y}+46*pow(max(0,1-(t-{st})/0.4),2)':eof_action=pass[l{k}];")
        last = f'l{k}'
    fc += f"[3]format=rgba[mt];[{last}][mt]overlay=0:0[mm];[4]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[mm][o]overlay=x=0:y='max(0,22-80*t)',format=yuv420p"
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 18, 12)), 0.35)
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
fc += "[v]eq=saturation=1.02:contrast=1.02,colorbalance=gs=0.006:bs=-0.004,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
