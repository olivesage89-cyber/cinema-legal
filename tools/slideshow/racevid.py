"""HEART RATE / RACE START stills video. Usage: python3 racevid.py WORKDIR (reads plan.json -> video.mp4)
7-flash burst -> full-screen drifting title (JetBrains Mono kicker, Spectral italic 'your heart', giant Big Shoulders
'RACE' in hot coral + ECG pulse rule) -> per film THREE slanted edge-to-edge strips (1080x400) sliding in from
alternating sides, each strip jump-cutting between 2 stills at staggered times; 'LAP 0X / 05' + title above,
Spectral italic line + 'year | where' under, ECG pulse drawing across -> phone end card (no text)."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FF5A3C'); PAGE = P.get('page', '#0B0B10')
SW, SH_, Y0, GAP, SL = 1080, 370, 380, 18, 24          # strip w/h, first strip y, gap, slant px
YS = [Y0 + k * (SH_ + GAP) for k in range(3)]
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
CSS = ff('Bs', 'big-shoulders-display', 900) + ff('Bs', 'big-shoulders-display', 800) + ff('Sp', 'spectral', 400, 'italic') + \
      ff('Sp', 'spectral', 600, 'italic') + ff('Jm', 'jetbrains-mono', 400) + ff('Jm', 'jetbrains-mono', 700) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#FFF4EA;text-align:center}}"
SHD = "text-shadow:0 2px 30px rgba(6,6,12,.9),0 0 10px rgba(6,6,12,.6)"
def ecg(w, hgt, col, sw=4):
    # heart-rate line: flat, small bump, sharp spike, dip, flat (repeats twice)
    pts, x = [], 0; u = w / 2
    for k in range(2):
        b = k * u
        pts += [(b, .5), (b + u*.30, .5), (b + u*.36, .40), (b + u*.42, .5), (b + u*.48, .5), (b + u*.52, .05),
                (b + u*.57, .95), (b + u*.61, .5), (b + u*.70, .5), (b + u*.78, .36), (b + u*.86, .5)]
    pts.append((w, .5))
    pl = ' '.join(f'{a:.1f},{c*hgt:.1f}' for a, c in pts)
    return (f"<svg width='{w}' height='{hgt}' viewBox='0 0 {w} {hgt}' style='display:block;margin:0 auto;overflow:visible'>"
            f"<polyline points='{pl}' fill='none' stroke='{col}' stroke-width='{sw}' stroke-linejoin='round' stroke-linecap='round' "
            f"style='filter:drop-shadow(0 0 8px {col})'/></svg>")
ti = P['title']; top = ti.get('top', 210)
ov = {}
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1320px;background:linear-gradient(180deg,rgba(8,8,14,.88),rgba(8,8,14,.66) 52%,rgba(8,8,14,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:700 27px Jm;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
ov['tsoft'] = f"<div style='position:absolute;top:{top+78}px;width:100%;{SHD};font:600 italic 104px/1 Sp;color:#FFF4EA'>{ti['soft']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+150}px;width:100%;font:900 {ti.get('fs',380)}px/1 Bs;letter-spacing:.02em;color:{INK};"
               f"text-shadow:0 0 50px rgba(255,90,60,.45),0 4px 30px rgba(6,6,12,.8);transform:skewX(-8deg)'>{ti['hero']}</div>")
ov['tecg'] = f"<div style='position:absolute;top:{top+560}px;width:100%'>{ecg(760, 90, INK, 5)}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+690}px;width:100%;{SHD}'>"
              f"<div style='font:400 italic 42px/1.35 Sp;max-width:880px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='font:400 23px Jm;letter-spacing:.38em;margin-top:34px;color:{INK};padding-left:.38em'>{ti['foot']}</div></div>")
# mat: page colour with three slanted transparent strips + coral leading edge on each
S2 = 2; mat = Image.new('RGBA', (W*S2, H*S2), PAGE)
random.seed(3); gr = ImageDraw.Draw(mat)
for _ in range(60):   # faint speed lines on the page
    y = random.randrange(H*S2); x = random.randrange(-200, W*S2); L = random.randrange(120, 600)
    gr.line([x, y, x + L, y], fill=(255, 255, 255, random.randint(8, 22)), width=2)
m = Image.new('L', (W*S2, H*S2), 255); dm = ImageDraw.Draw(m); ed = Image.new('RGBA', mat.size, (0, 0, 0, 0)); de = ImageDraw.Draw(ed)
for k, y in enumerate(YS):
    s = SL if k % 2 == 0 else -SL
    poly = [(0, y + max(0, s)), (W, y + max(0, -s)), (W, y + SH_ - max(0, s)), (0, y + SH_ - max(0, -s))]
    dm.polygon([(a*S2, b*S2) for a, b in poly], fill=0)
    de.line([(a*S2, b*S2) for a, b in poly[:2]], fill=INK, width=4*S2) if k == 0 else None
mat.putalpha(m); mat.alpha_composite(ed)
mat = mat.resize((W, H), Image.LANCZOS); mat.save(f'{T}/mat.png')
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{Y0-10}px;width:100%;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:34px;box-sizing:border-box'>"
                   f"<div style='font:700 24px Jm;letter-spacing:.46em;color:{INK};padding-left:.46em'>LAP 0{i+1} / 05</div>"
                   f"<div style='font:900 {f.get('fs',128)}px/.92 Bs;letter-spacing:.015em;margin-top:18px;max-width:1040px;transform:skewX(-8deg)'>{f['t']}</div></div>"
                   f"<div style='position:absolute;top:{YS[2]+SH_+44}px;width:100%'>"
                   f"<div style='font:400 italic 40px/1.3 Sp;max-width:920px;margin:0 auto'>{f['line']}</div>"
                   f"<div style='font:400 24px Jm;letter-spacing:.3em;margin-top:22px;color:{INK};padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
ov['fecg'] = f"<div style='position:absolute;top:{YS[2]+SH_+178}px;width:100%'>{ecg(560, 54, INK, 4)}</div>"
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
def reveal(name, nfr=14):   # left-to-right draw-on frames of an ECG overlay
    im = Image.open(f'{T}/{name}.png').convert('RGBA'); bb = im.getbbox()
    for k in range(nfr):
        fr = im.copy(); xc = int(bb[0] + (bb[2] - bb[0] + 20) * (k + 1) / nfr)
        ImageDraw.Draw(fr).rectangle([xc, 0, W, H], fill=(0, 0, 0, 0)); fr.save(f'{T}/{name}_{k:02d}.png')
reveal('tecg'); reveal('fecg', 16)

segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1))
tc = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
# ECG reveal = a page-coloured bar sliding off to the right over the line
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.2:d=0.35:alpha=1[r];[b][r]overlay=x='min(0,-90+300*(t-0.2))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.4:d=0.25:alpha=1[h];[c][h]overlay=x=0:y='max(0,120-500*(t-0.4))'[d];"
      f"[5]format=rgba,setpts=PTS+0.75/TB[e];[d][e]overlay=0:0:eof_action=repeat[f];"
      f"[6]format=rgba,fade=in:st=1.0:d=0.4:alpha=1[u];[f][u]overlay=x=0:y='max(0,30-90*(t-1.0))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tsoft.png -loop 1 -i {T}/thero.png -framerate 30 -i {T}/tecg_%02d.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.6)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); strips = []
    cuts = [round(sg * c, 2) for c in (0.36, 0.52, 0.68)]          # staggered jump cut per strip
    for s, (a, b) in enumerate(f['strips']):
        p1 = piece(a[0], cuts[s], SW, SH_ + 2*SL, a[1], a[2], mv=1 if s % 2 else -1)
        p2 = piece(b[0], round(sg - cuts[s], 2), SW, SH_ + 2*SL, b[1], b[2], mv=-1 if s % 2 else 1)
        open(f'{T}/s{i}{s}.txt', 'w').write(f"file '{p1}'\nfile '{p2}'\n")
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/s{i}{s}.txt -c copy {T}/st{i}{s}.mp4"); strips.append(f'{T}/st{i}{s}.mp4')
    fc = f"color=c={PAGE}:s={W}x{H}:r={FPS}:d={sg}[bg];"
    last = 'bg'
    for s in range(3):
        d0 = 0.08 * s; sgn = -1 if s % 2 == 0 else 1
        fc += (f"[{s}]format=rgba[q{s}];[{last}][q{s}]overlay=x='{sgn}*{W}*pow(max(0,1-(t-{d0})/0.32),3)':y={YS[s]-SL}:eof_action=pass[l{s}];")
        last = f'l{s}'
    fc += (f"[3]format=rgba[mt];[{last}][mt]overlay=0:0[mm];[4]format=rgba,fade=in:st=0.12:d=0.25:alpha=1[o];[mm][o]overlay=x=0:y='max(0,24-90*t)'[o2];"
           f"[5]format=rgba,setpts=PTS+0.3/TB[ec];[o2][ec]overlay=0:0:eof_action=repeat,format=yuv420p")
    sh(f"ffmpeg -v error -y -i {strips[0]} -i {strips[1]} -i {strips[2]} -loop 1 -i {T}/mat.png -loop 1 -i {T}/f{i}.png -framerate 30 -i {T}/fecg_%02d.png "
       f"-filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (12, 12, 20)), 0.35)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.4); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.03,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
