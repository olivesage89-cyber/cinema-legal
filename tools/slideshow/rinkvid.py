"""RINKSIDE (rinkvid.py) — Usage: python3 rinkvid.py WORKDIR (plan.json -> video.mp4)
Burst -> full-screen drifting title (Inter spaced kicker + Cormorant italic 'good at' + giant ice-blue Anton word + italic sub)
-> per film 3 rounded panels edge to edge on deep ink-navy w/ thin ice hairlines, staggered fade/zoom-in, each panel
jump-cuts ~0.9s; Inter 'Nº 0x / 05' + Anton caps title above, Cormorant italic line + Inter 'year | where' below
-> framed phone end card (no text)."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#9FD8FF'); NAVY = (11, 15, 26)
PW, PH, PX, R = 1000, 430, 40, 30
PY = [318, 768, 1218]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,"
          f"eq=saturation=1.05:contrast=1.03,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('An', 'anton', 400) + ff('Co', 'cormorant-garamond', 500, 'italic') + ff('Co', 'cormorant-garamond', 600, 'italic') + \
      ff('In', 'inter', 500) + ff('In', 'inter', 600) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#F4F7FB;text-align:center}}"
SH = "text-shadow:0 2px 34px rgba(4,8,20,.85),0 0 14px rgba(4,8,20,.5)"
ti = P['title']; top = ti.get('top', 560)
ov = {}
ov['tshade'] = "<div style='position:absolute;inset:0;background:radial-gradient(ellipse 100% 40% at 50% 47%,rgba(6,10,24,.62),rgba(6,10,24,.25) 72%,rgba(6,10,24,.1))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:600 30px In;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+52}px;width:100%;{SH}'>"
               f"<div style='font:italic 600 150px/1 Co;letter-spacing:-.01em'>{ti['hero']}</div>"
               f"<div style='font:400 {ti.get('fs',196)}px/1 An;color:{INK};letter-spacing:.02em;margin-top:-6px'>{ti['hero2']}</div></div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+440}px;width:100%;{SH}'>"
              f"<div style='font:italic 500 56px/1.15 Co;max-width:900px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='font:600 23px In;letter-spacing:.45em;margin-top:40px;padding-left:.45em;color:{INK}'>05 ANIME &nbsp;·&nbsp; KEEP PRACTISING</div></div>")
# page: deep navy w/ faint vertical light + rounded holes + ice hairlines
def page():
    pg = Image.new('RGBA', (W, H), NAVY + (255,))
    gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).ellipse([-200, -500, W + 200, 700], fill=60)
    gl = gl.filter(ImageFilter.GaussianBlur(180))
    pg = Image.composite(Image.new('RGBA', (W, H), (40, 62, 96, 255)), pg, gl)
    nz = Image.effect_noise((W, H), 14).point(lambda v: 128 + (v - 128) * 0.5)
    pg = Image.blend(pg, Image.merge('RGBA', [nz, nz, nz, Image.new('L', (W, H), 255)]), 0.04)
    m = Image.new('L', (W * 2, H * 2), 255); d = ImageDraw.Draw(m)
    for y in PY: d.rounded_rectangle([PX * 2, y * 2, (PX + PW) * 2 - 1, (y + PH) * 2 - 1], R * 2, fill=0)
    m = m.resize((W, H), Image.LANCZOS); pg.putalpha(m)
    ln = Image.new('RGBA', (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(ln)
    for y in PY: d.rounded_rectangle([PX * 2 - 7, y * 2 - 7, (PX + PW) * 2 + 6, (y + PH) * 2 + 6], R * 2 + 7, outline=(159, 216, 255, 120), width=3)
    ln = ln.resize((W, H), Image.LANCZOS)
    return Image.alpha_composite(pg, ln)
page().save(f'{T}/page.png')
for i, f in enumerate(P['films']):
    ac = f.get('accent', INK)
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{PY[0]-6}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:30px;box-sizing:border-box'>"
                   f"<div style='font:600 22px In;letter-spacing:.5em;color:{ac};padding-left:.5em'>Nº 0{i+1} / 05</div>"
                   f"<div style='font:400 {f.get('fs',86)}px/1.02 An;letter-spacing:.015em;margin-top:16px;max-width:1010px;text-transform:uppercase'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{PY[2]+PH+40}px;width:100%'>"
                   f"<div style='font:italic 600 54px/1.05 Co;color:{ac};max-width:1000px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:500 23px In;letter-spacing:.32em;margin-top:22px;padding-left:.32em;color:#C9D3E2'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
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
        L = [im[(k + 3 * j) % nI] if nI >= 3 else im[(k + j) % nI] for j in range(NP)]
        off = 0.14 * k; b0 = round(sg / NP + off, 3); rest = sg - b0; durs = [b0] + [round(rest / (NP - 1), 3)] * (NP - 1)
        durs[-1] = round(sg - sum(durs[:-1]), 3)
        ps = [piece(L[j][0], durs[j], PW, PH, L[j][1], L[j][2] if len(L[j]) > 2 else 50, mv=1 if (j + k) % 2 else -1, z=1.12) for j in range(NP)]
        open(f'{T}/q{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c=0x0B0F1A:s={W}x{H}:r={FPS}:d={sg}[bg0];"
    last = 'bg0'
    for k in range(3):
        st = 0.13 * k
        fc += (f"[{k}]format=rgba,setpts=PTS+{st}/TB,fade=in:st={st}:d=0.28:alpha=1[q{k}];"
               f"[{last}][q{k}]overlay=x={PX}:y='{PY[k]}+46*pow(max(0,1-(t-{st})/0.4),2)':eof_action=pass[l{k}];")
        last = f'l{k}'
    fc += f"[{last}][3]overlay=0:0[pg];[4]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[o];[pg][o]overlay=x=0:y='max(0,22-80*t)',format=yuv420p"
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -framerate {FPS} -i {T}/page.png -loop 1 -framerate {FPS} -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), NAVY), 0.3)
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
fc += "[v]colorbalance=rs=-0.006:gs=0.0:bs=0.012,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
