"""SMOKE & MIRRORS (magic-poster) stills video. Usage: python3 magicvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen panning title (Montserrat spaced kicker, cream Mrs Saint Delafield 'a magic', violet Bodoni Moda
TRICK w/ glow, star rule, Bodoni italic sub, tag) -> per film: deep-indigo stage w/ violet glow + star specks, a tall
OVAL MAGIC MIRROR (double silver ring + stars) jump-cutting 4 drifting stills (white 'poof' flash on the first),
below: violet 'TRICK Nº N', cream Bodoni title, italic line, star rule, violet 'year | where' -> phone end card."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#B78CFF'); CREAM = '#F1EAF7'; BG = (11, 7, 22)
OX, OY, OW, OH = 110, 150, 860, 1120          # oval mirror bbox
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, x=50, mv=1, amp=110, z=1.07, w=W, h=H, flash=False):
    """w x h crop of a wide still, panning amp px horizontally, slow push-in."""
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = h * z / im.height
    W2 = int(im.width * s) // 2 * 2; H2 = int(h * z) // 2 * 2
    span = W2 - w; cx = span * x / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.18:color=white" if flash else ""
    vf = (f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':'(ih-{h})/2',fps={FPS},setsar=1{fl},format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
# ---- stage frame: opaque indigo page w/ transparent oval hole, violet glow, specks, double ring + stars
random.seed(7)
st = Image.new('RGBA', (W, H), BG + (255,))
gl = Image.new('RGBA', (W, H), (0, 0, 0, 0)); g = ImageDraw.Draw(gl)
g.ellipse([OX - 70, OY - 70, OX + OW + 70, OY + OH + 70], fill=(150, 100, 255, 120))
gl = gl.filter(ImageFilter.GaussianBlur(70)); st = Image.alpha_composite(st, gl)
sp = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(sp)
for _ in range(170):
    x, y = random.randint(0, W), random.randint(0, H); r = random.choice([1, 1, 1, 2, 2, 3])
    d.ellipse([x - r, y - r, x + r, y + r], fill=(235, 225, 255, random.randint(50, 170)))
st = Image.alpha_composite(st, sp.filter(ImageFilter.GaussianBlur(0.6)))
rg = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(rg)
d.ellipse([OX - 22, OY - 22, OX + OW + 22, OY + OH + 22], outline=(215, 205, 235, 210), width=3)
d.ellipse([OX - 9, OY - 9, OX + OW + 9, OY + OH + 9], outline=(183, 140, 255, 255), width=5)
st = Image.alpha_composite(st, rg)
hole = Image.new('L', (W * 2, H * 2), 0); ImageDraw.Draw(hole).ellipse([OX * 2, OY * 2, (OX + OW) * 2, (OY + OH) * 2], fill=255)
hole = hole.resize((W, H), Image.LANCZOS)
a = st.getchannel('A'); a = Image.composite(Image.new('L', (W, H), 0), a, hole); st.putalpha(a)
st.save(f'{T}/stage.png')
# ---- text overlays
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Bm', 'bodoni-moda', 400) + ff('Bm', 'bodoni-moda', 400, 'italic') + ff('Bm', 'bodoni-moda', 600) + ff('Bm', 'bodoni-moda', 800) + \
      ff('Ms', 'montserrat', 500) + ff('Ms', 'montserrat', 600) + ff('Sd', 'mrs-saint-delafield', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CREAM};text-align:center}}"
SH = "text-shadow:0 2px 24px rgba(8,4,20,.95),0 0 8px rgba(8,4,20,.6)"
def rule(c, w=420): return (f"<div style='display:flex;align-items:center;justify-content:center;gap:18px;color:{c}'>"
                            f"<div style='width:{w//2}px;height:1px;background:linear-gradient(90deg,transparent,{c})'></div>"
                            f"<div style='font:400 26px Bm'>✦</div><div style='width:{w//2}px;height:1px;background:linear-gradient(90deg,{c},transparent)'></div></div>")
ti = P['title']; top = ti.get('top', 190)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(11,7,22,.9),rgba(11,7,22,.6) 55%,rgba(11,7,22,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:500 29px Ms;letter-spacing:.55em;padding-left:.55em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SH};font:400 190px/1 Sd;transform:rotate(-5deg)'>{ti['script']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+215}px;width:100%;font:800 196px/1 Bm;letter-spacing:.06em;padding-left:.06em;color:{INK};"
               f"text-shadow:0 0 40px rgba(183,140,255,.55),0 0 90px rgba(183,140,255,.3),0 5px 26px rgba(8,4,20,.9)'>{ti['hero']}</div>")
ov['trule'] = f"<div style='position:absolute;top:{top+440}px;width:100%'>{rule(CREAM, 560)}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+490}px;width:100%;{SH}'>"
              f"<div style='font:400 italic 46px/1.4 Bm'>{ti['sub']}</div>"
              f"<div style='font:600 23px Ms;letter-spacing:.5em;padding-left:.5em;margin-top:32px;color:{INK}'>{ti['tag']}</div></div>")
BY = 1318
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = (f"<div style='position:absolute;top:{BY}px;width:100%;{SH};font:600 25px Ms;letter-spacing:.55em;padding-left:.55em;color:{INK}'>"
                   f"✦ &nbsp;TRICK 0{i+1} &nbsp;/&nbsp; 05&nbsp; ✦</div>")
    ov[f't{i}'] = (f"<div style='position:absolute;top:{BY+40}px;width:100%;height:200px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:600 {f.get('fs',96)}px/1.05 Bm;{SH};max-width:1000px'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{BY+256}px;width:100%;{SH}'>"
                   f"<div style='font:400 italic 36px/1.35 Bm;opacity:.95;padding:0 90px'>{f['line']}</div>"
                   f"<div style='margin-top:24px'>{rule(CREAM, 340)}</div>"
                   f"<div style='font:600 26px Ms;letter-spacing:.3em;margin-top:20px;color:{INK};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.5:alpha=1[r];[b][r]overlay=x=0:y='max(0,40-110*(t-0.25))'[c];"
      f"[4]format=rgba,fade=in:st=0.5:d=0.5:alpha=1[h];[c][h]overlay=x=0:y=0[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.4:alpha=1[l];[d][l]overlay=0:0[e];"
      f"[6]format=rgba,fade=in:st=1.2:d=0.5:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.2))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/trule.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6); NC = 4; C = round(SEG / NC, 3)
for i, f in enumerate(P['films']):
    imgs = f['imgs']
    parts = [piece(imgs[ph][0], C, x=imgs[ph][1], mv=1 if (ph + i) % 2 else -1, amp=90, w=OW, h=OH, flash=(ph == 0)) for ph in range(NC)]
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/p{i}.mp4")
    fc = (f"color=c=0x0B0716:s={W}x{H}:r={FPS}:d={SEG}[bg];[0]setpts=PTS-STARTPTS[v];[bg][v]overlay={OX}:{OY}[l0];"
          f"[1]format=rgba[sg];[l0][sg]overlay=0:0[l1];"
          f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[l1][k]overlay=x=0:y='max(0,20-80*t)'[l2];"
          f"[3]format=rgba,fade=in:st=0.15:d=0.4:alpha=1[t];[l2][t]overlay=x=0:y='max(0,28-90*(t-0.15))'[l3];"
          f"[4]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[l];[l3][l]overlay=x=0:y='max(0,24-80*(t-0.45))',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/p{i}.mp4 -loop 1 -i {T}/stage.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), BG), 0.4)
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
fc += "[v]eq=saturation=1.03:contrast=1.04,colorbalance=rs=-0.005:bs=0.02:rh=0.01:bh=0.015,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
