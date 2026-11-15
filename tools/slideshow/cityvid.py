"""NEXT STOP (cityvid.py) — Usage: python3 cityvid.py WORKDIR (plan.json -> video.mp4)
Flash burst -> full-screen jump-cut title (dusk navy top shade): Bricolage spaced kicker, lilac Italianno 'fall in love',
Bricolage 800 caps 'WITH YOUR CITY', Instrument Serif italic sub + 5-dot metro route line
-> per title a Tokyo-style STATION SIGN (white rounded board, line-colour station badge e.g. G01, spaced place name,
Bricolage title, line-colour bar '◀ prev · year | where · next ▶') above THREE edge-to-edge 1080x400 strips that
slide in from the right like an arriving train (staggered) and jump-cut ~0.85s each; Instrument Serif italic line below
-> framed phone end card (no text)."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#D2C1FF')
BG = (14, 21, 38)
SW, SH_, GAP = 1080, 400, 8
SY = [520, 520 + SH_ + GAP, 520 + 2 * (SH_ + GAP)]
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.14):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.10 * mv)); b = max(0, min(1, x / 100 + 0.10 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,"
          f"eq=saturation=1.06:contrast=1.03,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ''.join(ff('Br', 'bricolage-grotesque', w) for w in (500, 600, 700, 800)) + ff('It', 'italianno', 400) + \
      ff('In', 'instrument-serif', 400, 'italic') + ff('In', 'instrument-serif', 400) + \
      f"*{{margin:0;padding:0;box-sizing:border-box}}body{{width:{W}px;height:{H}px;background:transparent;color:#F7F1E8;text-align:center}}"
SHD = "text-shadow:0 3px 34px rgba(8,12,28,.9),0 0 14px rgba(8,12,28,.55)"
ti = P['title']; top = ti.get('top', 250); LC = [f['line_c'] for f in P['films']]
ov = {}
ov['tshade'] = ("<div style='position:absolute;inset:0;background:linear-gradient(180deg,rgba(10,14,32,.78) 0%,rgba(10,14,32,.55) 34%,"
                "rgba(10,14,32,.12) 58%,rgba(10,14,32,0) 70%,rgba(10,14,32,.35) 100%)'></div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:600 34px Br;letter-spacing:.3em;padding-left:.3em'>{ti['kick']}</div>"
ov['thero'] = (f"<div style='position:absolute;top:{top+30}px;width:100%;{SHD}'>"
               f"<div style='font:400 {ti.get('fs',250)}px/0.95 It;color:{INK};transform:rotate(-3deg);text-shadow:0 0 40px rgba(210,193,255,.35),0 3px 30px rgba(8,12,28,.85)'>{ti['hero']}</div>"
               f"<div style='font:800 98px/1 Br;letter-spacing:.04em;margin-top:-6px'>{ti['hero2']}</div></div>")
dots = ''.join(f"<div style='width:30px;height:30px;border-radius:50%;background:#F7F1E8;border:8px solid {c};box-shadow:0 2px 12px rgba(0,0,0,.4)'></div>" for c in LC)
ov['tsub'] = (f"<div style='position:absolute;top:{top+420}px;width:100%;{SHD}'>"
              f"<div style='font:italic 400 58px/1.12 In;max-width:900px;margin:0 auto'>{ti['sub']}</div>"
              f"<div style='position:relative;width:640px;height:30px;margin:46px auto 0'>"
              f"<div style='position:absolute;left:10px;right:10px;top:11px;height:8px;border-radius:4px;background:linear-gradient(90deg,{','.join(LC)})'></div>"
              f"<div style='position:relative;display:flex;justify-content:space-between'>{dots}</div></div>"
              f"<div style='font:600 26px Br;letter-spacing:.3em;margin-top:30px;padding-left:.3em;color:{INK}'>{ti.get('foot','05 ANIME · NEXT STOP →')}</div></div>")
def page():
    pg = Image.new('RGB', (W, H), BG); d = ImageDraw.Draw(pg)
    for y in range(H):
        k = y / H; c = tuple(int(a + (b - a) * k) for a, b in zip((16, 24, 44), (24, 30, 58))); d.line([(0, y), (W, y)], fill=c)
    gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).ellipse([-200, -300, W + 200, 600], fill=60)
    gl = gl.filter(ImageFilter.GaussianBlur(160))
    pg = Image.composite(Image.new('RGB', (W, H), (60, 58, 104)), pg, gl)
    nz = Image.effect_noise((W, H), 14).point(lambda v: 128 + (v - 128) * 0.5).convert('RGB')
    return Image.blend(pg, nz, 0.035)
page().save(f'{T}/page.png')
for i, f in enumerate(P['films']):
    c = f['line_c']; tc = f.get('text_c', '#FFFFFF')
    ov[f'f{i}'] = (f"<div style='position:absolute;left:60px;top:96px;width:960px;height:384px;border-radius:30px;background:#F8F6F1;"
                   f"box-shadow:0 18px 50px rgba(0,0,0,.45);overflow:hidden'>"
                   f"<div style='position:absolute;left:36px;top:34px;width:104px;height:104px;border-radius:50%;border:13px solid {c};background:#fff;"
                   f"display:flex;flex-direction:column;align-items:center;justify-content:center;color:#1B1E2B;line-height:.9'>"
                   f"<div style='font:800 30px Br'>{f['code'][0]}</div><div style='font:800 32px Br'>{f['code'][1:]}</div></div>"
                   f"<div style='position:absolute;left:160px;top:46px;font:700 26px Br;letter-spacing:.32em;color:#8A8794;text-align:left'>STATION {i+1:02d} / 05</div>"
                   f"<div style='position:absolute;left:160px;top:84px;font:600 34px Br;letter-spacing:.18em;color:{c};text-align:left'>{f['place']}</div>"
                   f"<div style='position:absolute;left:30px;right:30px;top:160px;height:120px;display:flex;align-items:center;justify-content:center;"
                   f"font:800 {f.get('fs',74)}px/1.0 Br;color:#151A2C;letter-spacing:-.01em'>{f['t']}</div>"
                   f"<div style='position:absolute;left:0;right:0;bottom:0;height:78px;background:{c};display:flex;align-items:center;justify-content:space-between;"
                   f"padding:0 30px;color:{tc};font:600 25px Br;letter-spacing:.12em'>"
                   f"<span style='opacity:.92'>&#9664; {f['prev']}</span><span style='font:700 27px Br;letter-spacing:.14em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</span>"
                   f"<span style='opacity:.92'>{f['next']} &#9654;</span></div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{SY[2]+SH_+22}px;width:100%;font:italic 400 52px/1.1 In;color:#F7F1E8;padding:0 50px'>{f['line']}</div>")
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
      f"[3]format=rgba,fade=in:st=0.22:d=0.4:alpha=1[h];[b][h]overlay=x=0:y='max(0,80*pow(max(0,1-(t-0.22)/0.5),2))'[c];"
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
        ps = [piece(L[j][0], durs[j], SW, SH_, L[j][1], L[j][2] if len(L[j]) > 2 else 50, mv=1 if (j + k) % 2 else -1,
                    z=L[j][3] if len(L[j]) > 3 else 1.1) for j in range(NP)]
        open(f'{T}/q{i}{k}.txt', 'w').write(''.join(f"file '{p}'\n" for p in ps))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{k}.txt -c copy {T}/pan{i}{k}.mp4"); pans.append(f'{T}/pan{i}{k}.mp4')
    fc = f"[3]format=rgba[bg0];"
    last = 'bg0'
    for k in range(3):
        st = 0.07 * k
        fc += (f"[{k}]format=rgba,setpts=PTS+{st}/TB[q{k}];"
               f"[{last}][q{k}]overlay=x='if(lt(t,{st}),{W},{W}*pow(max(0,1-(t-{st})/0.42),3))':y={SY[k]}:eof_action=pass[m{k}];")
        last = f'm{k}'
    fc += (f"[4]format=rgba,fade=in:st=0.0:d=0.22:alpha=1[o];[{last}][o]overlay=x=0:y='-40*pow(max(0,1-t/0.35),2)'[p1];"
           f"[5]format=rgba,fade=in:st=0.35:d=0.35:alpha=1[ln];[p1][ln]overlay=x=0:y='max(0,20-60*(t-0.35))',format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pans[0]} -i {pans[1]} -i {pans[2]} -loop 1 -framerate {FPS} -i {T}/page.png -loop 1 -framerate {FPS} -i {T}/f{i}.png "
       f"-loop 1 -framerate {FPS} -i {T}/l{i}.png -filter_complex \"{fc}\" -t {sg} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
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
fc += "[v]colorbalance=rs=0.006:gs=-0.002:bs=0.012,noise=alls=5:allf=t,vignette=PI/7,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
