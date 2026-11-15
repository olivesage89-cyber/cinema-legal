"""SEA GLASS (oceanvid.py) — Usage: python3 oceanvid.py WORKDIR (plan.json -> video.mp4)
Flash burst -> full-screen jump-cut title (deep-sea bottom shade): Inter spaced kicker, seafoam Bodoni Moda italic hero,
Bodoni caps line, Cormorant italic sub + wave rule + foot
-> per title a deep-ocean page (caustic glows, grain): Inter 'TIDE 0X · 05', Bodoni Moda italic title, accent 'year | where',
Cormorant italic line; THREE rounded sea-glass windows (960x400, seafoam hairline) whose stills rise + fade in staggered
and jump-cut ~0.85s each -> framed phone end card (no text)."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#8FE8D8')
BG = (6, 26, 38)
PX, PW, PH, GAP, PY0 = 60, 960, 400, 22, 452
SY = [PY0 + k * (PH + GAP) for k in range(3)]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.10 * mv)); b = max(0, min(1, x / 100 + 0.10 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,"
          f"eq=saturation=1.07:contrast=1.03,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ''.join(ff('In', 'inter', w) for w in (400, 500, 600)) + ff('Bo', 'bodoni-moda', 500, 'italic') + ff('Bo', 'bodoni-moda', 600, 'italic') + \
      ff('Bo', 'bodoni-moda', 500) + ff('Co', 'cormorant-garamond', 500, 'italic') + ff('Co', 'cormorant-garamond', 400, 'italic') + \
      f"*{{margin:0;padding:0;box-sizing:border-box}}body{{width:{W}px;height:{H}px;background:transparent;color:#F3F1EA;text-align:center}}"
SHD = "text-shadow:0 3px 34px rgba(2,14,24,.9),0 0 14px rgba(2,14,24,.6)"
WAVE = (f"<svg width='260' height='22' viewBox='0 0 260 22'><path d='M0 11 Q16.25 0 32.5 11 T65 11 T97.5 11 T130 11 T162.5 11 T195 11 T227.5 11 T260 11' "
        f"fill='none' stroke='{INK}' stroke-width='2.4' stroke-linecap='round'/></svg>")
ti = P['title']; top = ti.get('top', 1010)
ov = {}
ov['tshade'] = ("<div style='position:absolute;inset:0;background:linear-gradient(180deg,rgba(2,16,28,.35) 0%,rgba(2,16,28,0) 22%,"
                "rgba(2,16,28,0) 42%,rgba(2,16,28,.62) 58%,rgba(2,16,28,.86) 100%)'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:500 32px In;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+48}px;width:100%;{SHD}'>"
               f"<div style='font:italic 500 {ti.get('fs',190)}px/1 Bo;color:{INK};letter-spacing:-.01em;text-shadow:0 0 50px rgba(143,232,216,.35),0 3px 30px rgba(2,14,24,.9)'>{ti['hero']}</div></div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+300}px;width:100%;{SHD}'>"
              f"<div style='font:italic 500 54px/1.15 Co;max-width:880px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='margin:34px auto 0'>{WAVE}</div>"
              f"<div style='font:500 25px In;letter-spacing:.36em;margin-top:22px;padding-left:.36em;color:{INK}'>{ti.get('foot','05 ANIME · DIVE IN')}</div></div>")
def page():
    pg = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(pg)
    for y in range(H):
        k = y / H; c = tuple(int(a + (b - a) * k) for a, b in zip((14, 52, 68), (3, 14, 24))); d.line([(0, y), (W, y)], fill=c)
    for (cx, cy, r, v) in [(220, -80, 520, 70), (900, 260, 420, 40), (540, 1900, 600, 26)]:
        gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).ellipse([cx - r, cy - r, cx + r, cy + r], fill=v)
        gl = gl.filter(ImageFilter.GaussianBlur(170))
        pg = Image.composite(Image.new('RGB', (W, H), (70, 170, 170)), pg, gl)
    nz = Image.effect_noise((W, H), 14).point(lambda v: 128 + (v - 128) * 0.5).convert('RGB')
    return Image.blend(pg, nz, 0.035)
pg = page(); pg.save(f'{T}/page.png')
# frame: page with transparent rounded windows + seafoam hairline
fr = pg.convert('RGBA'); m = Image.new('L', (W, H), 255); dm = ImageDraw.Draw(m)
for y in SY: dm.rounded_rectangle([PX, y, PX + PW - 1, y + PH - 1], 40, fill=0)
fr.putalpha(m)
ln = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dl = ImageDraw.Draw(ln)
for y in SY:
    dl.rounded_rectangle([PX - 9, y - 9, PX + PW + 8, y + PH + 8], 48, outline=(143, 232, 216, 120), width=2)
fr = Image.alpha_composite(fr, ln); fr.save(f'{T}/frame.png')
for i, f in enumerate(P['films']):
    c = f['accent']
    ov[f'f{i}'] = (f"<div style='position:absolute;top:110px;width:100%'>"
                   f"<div style='font:500 25px In;letter-spacing:.42em;padding-left:.42em;color:{c}'>TIDE {i+1:02d} &nbsp;·&nbsp; 05</div>"
                   f"<div style='font:italic 600 {f.get('fs',86)}px/1.02 Bo;margin-top:18px;color:#F6F3EA;letter-spacing:-.005em'>{f['t']}</div>"
                   f"<div style='font:500 26px In;letter-spacing:.24em;padding-left:.24em;margin-top:18px;color:{c}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                   f"<div style='font:italic 500 44px/1.1 Co;margin-top:18px;color:#E6EEEC;padding:0 60px'>{f['line']}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
segs = []
bp = [piece(b[0], P.get('flash', 0.2), W, H, x=b[1], mv=1 if k % 2 else -1, z=b[2] if len(b) > 2 else 1.14) for k, b in enumerate(P['burst'])]
open(f'{T}/bl.txt', 'w').write(''.join(f"file '{c}'\n" for c in bp))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/bl.txt -c copy {T}/burst.mp4"); segs.append(f'{T}/burst.mp4')
tcl = [piece(c[0], c[2], W, H, x=c[1], mv=1 if k % 2 == 0 else -1, z=c[3] if len(c) > 3 else 1.1) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tcl))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.22:d=0.45:alpha=1[h];[b][h]overlay=x=0:y='max(0,70*pow(max(0,1-(t-0.22)/0.55),2))'[c];"
      f"[4]format=rgba,fade=in:st=0.8:d=0.45:alpha=1[u];[c][u]overlay=x=0:y='max(0,30-90*(t-0.8))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4); NP = P.get('pieces', 4)
for i, f in enumerate(P['films']):
    sg = f.get('seg', SEG); im = f['imgs']; nI = len(im); st_ = max(1, nI // 3); pans = []
    for k in range(3):
        L = [im[(k * st_ + j) % nI] for j in range(NP)]
        off = 0.12 * k; b0 = round(sg / NP + off, 3); rest = sg - b0; durs = [b0] + [round(rest / (NP - 1), 3)] * (NP - 1)
        durs[-1] = round(sg - sum(durs[:-1]), 3)
        ps = [piece(L[j][0], durs[j], PW, PH + 60, L[j][1], L[j][2] if len(L[j]) > 2 else 50, mv=1 if (j + k) % 2 else -1,
                    z=L[j][3] if len(L[j]) > 3 else 1.1) for j in range(NP)]
        open(f'{T}/q{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = f"[3]format=rgba[bg0];"; last = 'bg0'
    for k in range(3):
        st = 0.1 * k
        fc += (f"[{k}]format=rgba,fade=in:st=0:d=0.3:alpha=1,setpts=PTS+{st}/TB[q{k}];"
               f"[{last}][q{k}]overlay=x={PX}:y='{SY[k]}-30+60*pow(max(0,1-(t-{st})/0.45),3)':eof_action=pass[m{k}];")
        last = f'm{k}'
    fc += (f"[4]format=rgba[fr];[{last}][fr]overlay=0:0[p0];"
           f"[5]format=rgba,fade=in:st=0.0:d=0.25:alpha=1[o];[p0][o]overlay=x=0:y='-30*pow(max(0,1-t/0.35),2)',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -framerate {FPS} -i {T}/page.png -loop 1 -framerate {FPS} -i {T}/frame.png "
       f"-loop 1 -framerate {FPS} -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), BG), 0.3)
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
fc += "[v]colorbalance=rs=-0.004:gs=0.002:bs=0.012,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
