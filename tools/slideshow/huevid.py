"""PAINT CHIPS (prettiest colours) stills video. Usage: python3 huevid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen jump-cut title (deep plum top shade, Montserrat spaced kicker, Italianno script 'prettiest',
Playfair 900 COLORS with each letter a different pastel popping up in turn, italic sub) -> per film on a pastel page
tinted to that film: 'SWATCH NO.0x' + Playfair title + DM Mono 'year | where' + italic line, one big + two small
white-rimmed rounded panels sliding in and jump-cutting drifting stills, then a row of 5 paint chips (the film's
palette, hex codes in mono) popping up one by one -> framed app phone end card, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
R = 28
PAN = [(40, 330, 1000, 790), (40, 1140, 490, 470), (550, 1140, 490, 470)]
CY, CW, CH, CG = 1648, 176, 196, 30
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Pf', 'playfair-display', 900) + ff('Pf', 'playfair-display', 800) + ff('Pf', 'playfair-display', 400, 'italic') + \
      ff('It', 'italianno', 400) + ff('Mo', 'montserrat', 600) + ff('Dm', 'dm-mono', 400) + ff('Dm', 'dm-mono', 500) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF6EE;text-align:center}}"
SHD = "text-shadow:0 2px 24px rgba(30,6,28,.75)"
HEROC = ['#F7B8C8', '#F5D33B', '#86D3E2', '#FF6B5B', '#A6E3B8', '#C3A6F5']
ov = {}
ti = P['title']; top = 230
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(38,10,36,.88),rgba(38,10,36,.6) 55%,rgba(38,10,36,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:600 30px Mo;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = (f"<div style='position:absolute;top:{top+20}px;width:100%'><div style='display:inline-block;transform:rotate(-5deg);"
                 f"font:400 270px/1 It;color:#FFD3DE;text-shadow:0 3px 30px rgba(30,6,28,.8)'>{ti['script']}</div></div>")
for k in range(len(ti['hero'])):
    sp = ''.join(f"<span style='color:{HEROC[j % 6]};{'' if j == k else 'visibility:hidden'}'>{c}</span>" for j, c in enumerate(ti['hero']))
    ov[f'th{k}'] = (f"<div style='position:absolute;top:{top+270}px;width:100%;font:900 214px/1 Pf;letter-spacing:.03em;"
                    f"text-shadow:0 4px 0 rgba(38,10,36,.55),0 8px 40px rgba(38,10,36,.7)'>{sp}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+530}px;width:100%;{SHD};font:italic 400 54px/1.15 Pf'>{ti['sub']}</div>")
for i, f in enumerate(P['films']):
    sh_ = ''.join(f"<div style='position:absolute;left:{x}px;top:{y}px;width:{w}px;height:{h}px;border-radius:{R}px;box-shadow:0 18px 40px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.08)'></div>" for x, y, w, h in PAN)
    grain = "background-image:radial-gradient(rgba(255,255,255,.55) 0,rgba(255,255,255,0) 60%);"
    ov[f'pg{i}'] = (f"<div style='position:absolute;inset:0;background:{f['page']}'></div>"
                    f"<div style='position:absolute;inset:0;{grain}background-size:100% 70%;background-repeat:no-repeat'></div>")
    ov[f'rim{i}'] = ''.join(f"<div style='position:absolute;left:{x}px;top:{y}px;width:{w-16}px;height:{h-16}px;border-radius:{R}px;border:8px solid #FFFDF9;box-shadow:0 18px 40px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.08)'></div>" for x, y, w, h in PAN)
    ov[f'hd{i}'] = (f"<div style='position:absolute;top:60px;width:100%;font:600 24px Mo;letter-spacing:.45em;padding-left:.45em;color:{f['acc']}'>SWATCH NO.0{i+1} &nbsp;·&nbsp; 05</div>"
                    f"<div style='position:absolute;top:96px;width:100%;height:112px;display:flex;align-items:center;justify-content:center'>"
                    f"<div style='font:800 {f.get('fs',90)}px/1 Pf;color:{f['ink']};letter-spacing:-.005em'>{f['t']}</div></div>")
    ov[f'ln{i}'] = (f"<div style='position:absolute;top:214px;width:100%;font:500 25px Dm;letter-spacing:.24em;padding-left:.24em;color:{f['ink']};opacity:.72'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                    f"<div style='position:absolute;top:254px;width:100%;font:italic 400 38px/1.1 Pf;color:{f['ink']}'>{f['line']}</div>")
    for k, c in enumerate(f['chips']):
        x = 40 + k * (CW + CG)
        ov[f'ch{i}{k}'] = (f"<div style='position:absolute;left:{x}px;top:{CY}px;width:{CW}px;height:{CH}px;border-radius:14px;background:#FFFDF9;overflow:hidden;"
                           f"box-shadow:0 10px 24px rgba(0,0,0,.14)'><div style='height:{CH-50}px;background:{c}'></div>"
                           f"<div style='font:500 21px/50px Dm;letter-spacing:.06em;color:{f['ink']}'>{c}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(120);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
for k, (x, y, w, h) in enumerate(PAN):
    mk = Image.new('L', (w, h), 0); ImageDraw.Draw(mk).rounded_rectangle([0, 0, w - 1, h - 1], R, fill=255); mk.save(f'{T}/mask{k}.png')

n = [0]
def piece(img, dur, x=50, y=50, mv=1, amp=110, z=1.08, w=W, h=H, flash=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = max(h * z / im.height, w * 1.06 / im.width)
    W2 = int(im.width * s) // 2 * 2; H2 = int(im.height * s) // 2 * 2
    span = W2 - w; cx = span * x / 100; cy = (H2 - h) * y / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.12:color=white" if flash else ""
    vf = f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':{cy:.0f},fps={FPS},setsar=1{fl},format=yuv420p"
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40, flash=(k % 2 == 0)))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
nh = len(ti['hero'])
ins = f"-i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png " + ''.join(f"-loop 1 -i {T}/th{k}.png " for k in range(nh)) + f"-loop 1 -i {T}/tsub.png"
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.35:alpha=1[r];[b][r]overlay=x='max(0,-60+200*(t-0.3))*0':y='max(0,40-130*(t-0.3))'[h0];")
prev = 'h0'
for k in range(nh):
    st = 0.62 + 0.08 * k
    fc += f"[{4+k}]format=rgba,fade=in:st={st}:d=0.12:alpha=1[l{k}];[{prev}][l{k}]overlay=x=0:y='max(0,46-300*(t-{st}))':enable='gte(t,{st})'[h{k+1}];"; prev = f'h{k+1}'
fc += f"[{4+nh}]format=rgba,fade=in:st=1.25:d=0.4:alpha=1[u];[{prev}][u]overlay=x=0:y='max(0,30-90*(t-1.25))',format=yuv420p"
open(f'{T}/fct.txt', 'w').write(fc)
sh(f"ffmpeg -v error -y {ins} -filter_complex_script {T}/fct.txt -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4)
SPL = [[1.1, 1.1], [0.9, 1.3], [1.3, 1.0]]
KEYS = ['big', 's1', 's2']
for i, f in enumerate(P['films']):
    pv = []
    for p in range(3):
        x0, y0, w, h = PAN[p]
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]
        cs = [piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (p + q + i) % 2 else -1, amp=60 if p else 90, w=w, h=h, flash=True)
              for q, it in enumerate(f[KEYS[p]])]
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    # inputs: 0-2 panels, 3-5 masks, 6 page, 7 rims, 8 head, 9 line, 10-14 chips
    fc = f"color=c=black:s={W}x{H}:d={SEG}:r={FPS}[bg0];[6]format=rgba[pg];[bg0][pg]overlay=0:0[b0];"
    prev = 'b0'
    for p in range(3):
        x0, y0, w, h = PAN[p]; st = [0.0, 0.1, 0.18][p]; sg = [1, -1, 1][p]
        xo = f"{x0}+({sg})*1100*max(0,1-(t-{st})/0.34)*max(0,1-(t-{st})/0.34)"
        fc += (f"[{p}]setpts=PTS-STARTPTS,format=rgba[r{p}];[{3+p}]format=gray[m{p}];[r{p}][m{p}]alphamerge[v{p}];"
               f"[{prev}][v{p}]overlay=x='{xo}':y={y0}:enable='gte(t,{st})'[o{p}];"); prev = f'o{p}'
    fc += (f"[7]format=rgba,fade=in:st=0.5:d=0.15:alpha=1[rm];[{prev}][rm]overlay=0:0[m1];"
           f"[8]format=rgba,fade=in:st=0.04:d=0.22:alpha=1[hd];[m1][hd]overlay=x=0:y='max(0,-26+90*(t-0.04))*0-max(0,26-90*(t-0.04))'[m2];"
           f"[9]format=rgba,fade=in:st=0.3:d=0.3:alpha=1[ln];[m2][ln]overlay=x=0:y='max(0,20-70*(t-0.3))'[m3];")
    prev = 'm3'
    for k in range(5):
        st = 0.55 + 0.1 * k
        fc += f"[{10+k}]format=rgba,fade=in:st={st}:d=0.12:alpha=1[c{k}];[{prev}][c{k}]overlay=x=0:y='max(0,40-260*(t-{st}))':enable='gte(t,{st})'[n{k}];"; prev = f'n{k}'
    fc += f"[{prev}]format=yuv420p"
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv[0]} -i {pv[1]} -i {pv[2]} " + ''.join(f"-loop 1 -i {T}/mask{p}.png " for p in range(3)) +
       f"-loop 1 -i {T}/pg{i}.png -loop 1 -i {T}/rim{i}.png -loop 1 -i {T}/hd{i}.png -loop 1 -i {T}/ln{i}.png " +
       ''.join(f"-loop 1 -i {T}/ch{i}{k}.png " for k in range(5)) +
       f"-filter_complex_script {T}/fc{i}.txt -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# end card
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bgi.width, H / bgi.height)
bgi = bgi.resize((int(bgi.width * s) + 1, int(bgi.height * s) + 1), Image.LANCZOS)
bgi = bgi.crop(((bgi.width - W) // 2, (bgi.height - H) // 2, (bgi.width - W) // 2 + W, (bgi.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(38))).enhance(0.72)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (40, 12, 36)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.05:contrast=1.03,noise=alls=6:allf=t,vignette=PI/8,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
