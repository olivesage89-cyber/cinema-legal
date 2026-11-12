"""SATURDAY MORNING (tvvid.py) — Usage: python3 tvvid.py WORKDIR (plan.json -> video.mp4)
Burst of CRT flash cuts -> full-screen jump-cut title w/ grape shade + scanlines: Silkscreen OSD 'SAT 8:00 AM ▶ PLAY',
Fredoka kicker, bubblegum Fredoka 'being 8' tilted + Silkscreen 'AGAIN', italic Nunito sub
-> per title 3 rounded 'CRT screen' panels on deep grape w/ pastel sparkles, panels pop in staggered, each panel
jump-cuts ~0.85s; Silkscreen 'CH 0x ▸' + Fredoka title above, Fredoka line in accent + Silkscreen 'year | where' below
-> framed phone end card (no text)."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FF9ED2'); BG = (34, 22, 58)
PW, PH, PX, R = 980, 430, 50, 54
PY = [345, 800, 1255]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.12 * mv)); b = max(0, min(1, x / 100 + 0.12 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,"
          f"eq=saturation=1.08:contrast=1.03,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Fr', 'fredoka', 600) + ff('Fr', 'fredoka', 700) + ff('Fr', 'fredoka', 500) + ff('Px', 'silkscreen', 400) + ff('Px', 'silkscreen', 700) + \
      ff('Nu', 'nunito', 600, 'italic') + ff('Nu', 'nunito', 700, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF7FB;text-align:center}}"
SH = "text-shadow:0 3px 30px rgba(20,10,40,.85),0 0 14px rgba(20,10,40,.55)"
ti = P['title']; top = ti.get('top', 560)
ov = {}
# scanlines (full frame, very light) for the title + burst
sl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(sl)
for y in range(0, H, 4): d.line([(0, y), (W, y)], fill=(10, 0, 20, 34), width=1)
sl.save(f'{T}/scan.png')
ov['tshade'] = "<div style='position:absolute;inset:0;background:radial-gradient(ellipse 110% 42% at 50% 48%,rgba(30,14,52,.70),rgba(30,14,52,.32) 70%,rgba(30,14,52,.14))'></div>"
ov['tosd'] = (f"<div style='position:absolute;top:150px;left:70px;font:700 34px Px;color:#FFF7FB;{SH};letter-spacing:.06em'>SAT 8:00 AM</div>"
              f"<div style='position:absolute;top:150px;right:70px;font:700 34px Px;color:#7CF2B0;{SH};letter-spacing:.06em'>&#9654; PLAY</div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:600 34px Fr;letter-spacing:.26em;padding-left:.26em'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+40}px;width:100%;{SH}'>"
               f"<div style='font:700 {ti.get('fs',230)}px/1.02 Fr;color:{INK};transform:rotate(-4deg);letter-spacing:-.01em'>{ti['hero']}</div>"
               f"<div style='font:700 92px/1 Px;letter-spacing:.16em;padding-left:.16em;margin-top:8px'>{ti['hero2']}</div></div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+430}px;width:100%;{SH}'>"
              f"<div style='font:italic 700 50px/1.2 Nu;max-width:880px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='font:400 28px Px;letter-spacing:.2em;margin-top:44px;padding-left:.2em;color:{INK}'>05 ANIME &nbsp;&#9733;&nbsp; PRESS PLAY</div></div>")
def page():
    pg = Image.new('RGBA', (W, H), BG + (255,))
    gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).ellipse([-260, -420, W + 260, 760], fill=70)
    gl = gl.filter(ImageFilter.GaussianBlur(200))
    pg = Image.composite(Image.new('RGBA', (W, H), (84, 46, 120, 255)), pg, gl)
    nz = Image.effect_noise((W, H), 14).point(lambda v: 128 + (v - 128) * 0.5)
    pg = Image.blend(pg, Image.merge('RGBA', [nz, nz, nz, Image.new('L', (W, H), 255)]), 0.04)
    # pastel sparkles in the gutters/margins
    sp = Image.new('RGBA', (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(sp); rnd = random.Random(8)
    cols = [(255, 158, 210), (124, 242, 176), (255, 211, 110), (143, 211, 255), (196, 176, 255)]
    spots = [(70, 60), (1010, 90), (40, 300), (1040, 320), (60, 1720), (1020, 1700), (980, 1860), (110, 1880), (540, 40), (300, 1890), (780, 1880)]
    for (x, y) in spots:
        c = rnd.choice(cols); s = rnd.choice([10, 13, 16])
        X, Y = x * 2, y * 2; S = s * 2
        d.polygon([(X, Y - S * 2), (X + S * .45, Y - S * .45), (X + S * 2, Y), (X + S * .45, Y + S * .45), (X, Y + S * 2), (X - S * .45, Y + S * .45), (X - S * 2, Y), (X - S * .45, Y - S * .45)], fill=c + (210,))
    sp = sp.resize((W, H), Image.LANCZOS); pg = Image.alpha_composite(pg, sp)
    m = Image.new('L', (W * 2, H * 2), 255); d = ImageDraw.Draw(m)
    for y in PY: d.rounded_rectangle([PX * 2, y * 2, (PX + PW) * 2 - 1, (y + PH) * 2 - 1], R * 2, fill=0)
    m = m.resize((W, H), Image.LANCZOS); pg.putalpha(m)
    # CRT glass: scanlines + soft inner vignette + highlight + bezel line inside the holes
    gl2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(gl2)
    for y0 in PY:
        for y in range(y0, y0 + PH, 4): d.line([(PX, y), (PX + PW, y)], fill=(12, 0, 24, 30), width=1)
    vg = Image.new('L', (W, H), 0); dv = ImageDraw.Draw(vg)
    for y0 in PY: dv.rounded_rectangle([PX, y0, PX + PW, y0 + PH], R, fill=110)
    inner = Image.new('L', (W, H), 0); di = ImageDraw.Draw(inner)
    for y0 in PY: di.rounded_rectangle([PX + 46, y0 + 40, PX + PW - 46, y0 + PH - 40], R, fill=255)
    inner = inner.filter(ImageFilter.GaussianBlur(40))
    from PIL import ImageChops
    vg = ImageChops.subtract(vg, inner)
    gl2 = Image.alpha_composite(gl2, Image.merge('RGBA', [Image.new('L', (W, H), 18), Image.new('L', (W, H), 6), Image.new('L', (W, H), 34), vg]))
    hl = Image.new('L', (W, H), 0); dh = ImageDraw.Draw(hl)
    for y0 in PY: dh.ellipse([PX + 60, y0 + 14, PX + 520, y0 + 120], fill=34)
    hl = hl.filter(ImageFilter.GaussianBlur(26))
    gl2 = Image.alpha_composite(gl2, Image.merge('RGBA', [Image.new('L', (W, H), 255)] * 3 + [hl]))
    ln = Image.new('RGBA', (W * 2, H * 2), (0, 0, 0, 0)); d = ImageDraw.Draw(ln)
    for y in PY: d.rounded_rectangle([PX * 2 - 8, y * 2 - 8, (PX + PW) * 2 + 7, (y + PH) * 2 + 7], R * 2 + 8, outline=(255, 236, 248, 170), width=5)
    ln = ln.resize((W, H), Image.LANCZOS)
    return Image.alpha_composite(Image.alpha_composite(pg, gl2), ln)
page().save(f'{T}/page.png')
for i, f in enumerate(P['films']):
    ac = f.get('accent', INK)
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{PY[0]-8}px;width:100%;display:flex;flex-direction:column;justify-content:center;align-items:center;padding-top:40px;box-sizing:border-box'>"
                   f"<div style='font:700 30px Px;letter-spacing:.14em;color:{ac};padding-left:.14em'>CH 0{i+1} &#9656; SAT 8:{(i*30)%60:02d} AM</div>"
                   f"<div style='font:700 {f.get('fs',76)}px/1.04 Fr;margin-top:14px;max-width:1000px'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{PY[2]+PH+34}px;width:100%'>"
                   f"<div style='font:600 50px/1.12 Fr;color:{ac};max-width:1000px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:400 27px Px;letter-spacing:.14em;margin-top:18px;padding-left:.14em;color:#EADFF5'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
segs = []
bp = []
for k, b in enumerate(P['burst']):
    bp.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1, z=b[2] if len(b) > 2 else 1.14))
open(f'{T}/bl.txt', 'w').write(''.join(f"file '{c}'\n" for c in bp))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/bl.txt -c copy {T}/bb.mp4")
sh(f"ffmpeg -v error -y -i {T}/bb.mp4 -loop 1 -i {T}/scan.png -filter_complex \"[1]format=rgba[s];[0][s]overlay=0:0:shortest=1,format=yuv420p\" -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/burst.mp4")
segs.append(f'{T}/burst.mp4')
tc = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=c[3] if len(c) > 3 else 1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a0];[5]format=rgba[sc];[a0][sc]overlay=0:0[a];"
      f"[6]format=rgba,fade=in:st=0.0:d=0.2:alpha=1[o];[a][o]overlay=0:0[a1];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a1][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.22:d=0.35:alpha=1[h];[b][h]overlay=x=0:y='max(0,90*pow(max(0,1-(t-0.22)/0.45),2))'[c];"
      f"[4]format=rgba,fade=in:st=0.75:d=0.45:alpha=1[u];[c][u]overlay=x=0:y='max(0,30-90*(t-0.75))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/scan.png -loop 1 -i {T}/tosd.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4); NP = P.get('pieces', 4)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); im = f['imgs']; nI = len(im); pans = []
    for k in range(3):
        L = [im[(k + j) % nI] if f.get('rot') else im[(k + 3 * j) % nI] for j in range(NP)]
        off = 0.14 * k; b0 = round(sg / NP + off, 3); rest = sg - b0; durs = [b0] + [round(rest / (NP - 1), 3)] * (NP - 1)
        durs[-1] = round(sg - sum(durs[:-1]), 3)
        ps = [piece(L[j][0], durs[j], PW, PH, L[j][1], L[j][2] if len(L[j]) > 2 else 50, mv=1 if (j + k) % 2 else -1,
                    z=L[j][3] if len(L[j]) > 3 else 1.12) for j in range(NP)]
        open(f'{T}/q{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c=0x22163A:s={W}x{H}:r={FPS}:d={sg}[bg0];"
    last = 'bg0'
    for k in range(3):
        st = 0.09 * k
        fc += (f"[{k}]format=rgba,setpts=PTS+{st}/TB,fade=in:st={st}:d=0.22:alpha=1[q{k}];"
               f"[{last}][q{k}]overlay=x={PX}:y='{PY[k]}+70*pow(max(0,1-(t-{st})/0.38),2)':eof_action=pass[l{k}];")
        last = f'l{k}'
    fc += f"[{last}][3]overlay=0:0[pg];[4]format=rgba,fade=in:st=0.08:d=0.28:alpha=1[o];[pg][o]overlay=x=0:y='max(0,22-80*t)',format=yuv420p"
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -framerate {FPS} -i {T}/page.png -loop 1 -framerate {FPS} -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), BG), 0.35)
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
fc += "[v]colorbalance=rs=0.008:gs=-0.002:bs=0.01,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
