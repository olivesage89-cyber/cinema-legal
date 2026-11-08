"""SUPER 8 HOME MOVIE stills video. Usage: python3 advvid.py WORKDIR [--ov]  (reads plan.json -> video.mp4)
7-flash burst -> full-screen drifting title w/ camcorder '● REC' + VT323 date stamp, Space Mono kicker, Bebas Neue caps,
Permanent Marker accent word, Caveat sub -> per film: jump cuts inside a rounded Super-8 film frame (black strip w/ backlit
sprocket holes) on a night-navy page w/ flashlight glow, '● TAPE 0X / 05 · PLACE' kicker, masking-tape label w/ marker title,
mono 'year | where', Caveat line -> phone end card on blurred still, no text."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F5EBD8'); ACC = P.get('acc', '#FF6A3D'); SH_C = P.get('shade', '8,11,22')
AX, AY, AW, AH, RR = 150, 250, 840, 1040, 30
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def piece(img, dur, w, h, x=50, y=50, mv=1, z=1.12):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z) // 2 * 2, int(h * z) // 2 * 2
    a = max(0, min(1, x / 100 - 0.1 * mv)); b = max(0, min(1, x / 100 + 0.1 * mv))
    vf = (f"scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:'(iw-{w})*({a}+({b}-{a})*t/{dur})':'(ih-{h})*{y/100}',fps={FPS},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = (ff('Bb', 'bebas-neue', 400) + ff('Pm', 'permanent-marker', 400) + ff('Sm', 'space-mono', 400) + ff('Sm', 'space-mono', 700) +
       ff('Cv', 'caveat', 500) + ff('Vt', 'vt323', 400) +
       f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}")
SH = f"text-shadow:0 3px 24px rgba({SH_C},.95),0 0 8px rgba({SH_C},.7)"
DOT = f"<span style='display:inline-block;width:20px;height:20px;border-radius:50%;background:#FF2E2E;box-shadow:0 0 14px #FF2E2E;margin-right:16px;vertical-align:2px'></span>"
ti = P['title']; top = ti.get('top', 230)
ov = {}
ov['tshade'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba({SH_C},.9),rgba({SH_C},.62) 52%,rgba({SH_C},0))'></div>"
                f"<div style='position:absolute;bottom:0;left:0;width:100%;height:480px;background:linear-gradient(0deg,rgba({SH_C},.75),rgba({SH_C},0))'></div>"
                # camcorder viewfinder corners
                + ''.join(f"<div style='position:absolute;{v}:62px;{h}:58px;width:70px;height:70px;border-{v}:3px solid {INK};border-{h}:3px solid {INK};opacity:.75'></div>" for v in ('top', 'bottom') for h in ('left', 'right'))
                + f"<div style='position:absolute;top:96px;left:100px;font:400 54px Vt;color:{INK};{SH};text-align:left'>{DOT}REC</div>"
                f"<div style='position:absolute;top:96px;right:100px;font:400 54px Vt;color:{INK};{SH}'>▶ PLAY</div>"
                f"<div style='position:absolute;bottom:100px;right:100px;font:400 50px Vt;color:{INK};{SH};text-align:right'>{ti['stamp']}</div>")
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SH};font:700 30px Sm;letter-spacing:.42em;padding-left:.42em;color:{INK}'>{ti['kick']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+58}px;width:100%;{SH};font:400 {ti.get('fs',200)}px/1 Bb;letter-spacing:.02em;color:{INK}'>{ti['hero']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+230}px;width:100%;{SH};font:400 {ti.get('fs2',150)}px/1 Pm;color:{ACC};transform:rotate(-5deg)'>{ti['script']}</div>"
ov['tsub'] = (f"<div style='position:absolute;top:{top+440}px;left:110px;right:110px;{SH};font:500 56px/1.12 Cv;color:{INK}'>{ti['sub']}</div>")
ov['tfoot'] = (f"<div style='position:absolute;top:{top+600}px;width:100%;{SH};font:700 25px Sm;letter-spacing:.45em;padding-left:.45em;color:{ACC}'>{ti['foot']}</div>")
# page with the film frame (hole punched later)
holes = ''.join(f"<rect x='{AX-50}' y='{y}' width='24' height='36' rx='5' fill='#F3E3BE' fill-opacity='.85'/>" for y in range(AY + 26, AY + AH - 30, 92))
FRAME = (f"<svg style='position:absolute;left:0;top:0' width='{W}' height='{H}'>"
         f"<defs><filter id='g'><feGaussianBlur stdDeviation='6'/></filter></defs>"
         f"<rect x='{AX-74}' y='{AY-26}' width='{AW+100}' height='{AH+52}' rx='14' fill='#060609'/>"
         f"<g filter='url(#g)' opacity='.55'>{holes}</g>{holes}"
         f"<rect x='{AX-2}' y='{AY-2}' width='{AW+4}' height='{AH+4}' rx='{RR+2}' fill='none' stroke='#2A2A33' stroke-width='3'/>"
         + "</svg>")
ov['page'] = (f"<div style='position:absolute;inset:0;background:radial-gradient(ellipse 70% 42% at 50% 40%,#1E2A44,#0D1323 62%,#070A14)'></div>"
              f"<div style='position:absolute;left:-200px;top:-260px;width:900px;height:900px;background:radial-gradient(circle,rgba(255,214,140,.16),rgba(255,214,140,0) 65%)'></div>"
              f"{FRAME}")
for i, f in enumerate(P['films']):
    ov[f'k{i}'] = f"<div style='position:absolute;top:130px;width:100%;font:400 50px Vt;letter-spacing:.08em;color:{INK};{SH}'>{DOT}TAPE 0{i+1} / 05 &nbsp;·&nbsp; {f['place']}</div>"
    ov[f'f{i}'] = (f"<div style='position:absolute;top:{AY+AH+58}px;width:100%'>"
                   f"<div style='display:inline-block;position:relative;transform:rotate({-1.6 if i % 2 == 0 else 1.4}deg);background:#ECE1C6;"
                   f"padding:18px 56px 14px;clip-path:polygon(0 6%,3% 0,7% 5%,12% 1%,18% 4%,25% 0,33% 3%,41% 0,50% 4%,58% 0,66% 3%,74% 0,81% 4%,88% 0,94% 4%,100% 1%,98% 50%,100% 96%,94% 100%,87% 95%,80% 100%,72% 96%,64% 100%,55% 95%,46% 100%,38% 96%,30% 100%,22% 95%,14% 100%,7% 96%,1% 100%,2% 50%);"
                   f"box-shadow:0 10px 30px rgba(0,0,0,.5)'><div style='font:400 {f.get('fs',70)}px/1.05 Pm;color:#1C1B24;white-space:nowrap'>{f['t']}</div></div>"
                   f"<div style='font:700 25px Sm;letter-spacing:.32em;padding-left:.32em;color:{ACC};margin-top:30px;{SH}'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div>"
                   f"<div style='font:500 54px/1.15 Cv;margin-top:12px;color:{INK};{SH}'>{f['line']}</div></div>")
pages = {k: f"<html><head><meta charset=utf-8><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
S = 3; mk = Image.new('L', (W * S, H * S), 255)
ImageDraw.Draw(mk).rounded_rectangle([AX * S, AY * S, (AX + AW) * S, (AY + AH) * S], RR * S, fill=0)
mk = mk.resize((W, H), Image.LANCZOS)
pg = Image.open(f'{T}/page.png').convert('RGBA'); pg.putalpha(mk)
shade = Image.new('RGBA', (W, H), (0, 0, 0, 0)); shade.putalpha(Image.eval(mk.filter(ImageFilter.GaussianBlur(22)), lambda v: int(v * .7)))
Image.alpha_composite(shade, pg).save(f'{T}/frame.png')
if len(sys.argv) > 2 and sys.argv[2] == '--ov': sys.exit()

FL = 'FFF1D6'
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), W, H, x=b[1], y=b[2] if len(b) > 2 else 50, mv=1 if k % 2 else -1, z=1.1))
tc = [piece(c[0], c[2], W, H, x=c[1], y=c[3] if len(c) > 3 else 50, mv=1 if k % 2 == 0 else -1, z=1.08) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[0]fade=in:st=0:d=0.25:color=0x{FL}[z];[1]format=rgba[s];[z][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.1:d=0.35:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.45:alpha=1[h];[b][h]overlay=x='-max(0,90-300*(t-0.3))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.6:d=0.4:alpha=1[e];[c][e]overlay=x='max(0,90-300*(t-0.6))':y=0[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.5:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))'[f];"
      f"[6]format=rgba,fade=in:st=1.3:d=0.5:alpha=1[r];[f][r]overlay=0:0,format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/tsub.png -loop 1 -i {T}/tfoot.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
for i, f in enumerate(P['films']):
    parts = [piece(it[0], it[1], AW, AH, x=it[2], y=it[3] if len(it) > 3 else 50, mv=1 if (i + k) % 2 else -1, z=1.1) for k, it in enumerate(f['cuts'])]
    sd = round(sum(it[1] for it in f['cuts']), 3)
    open(f'{T}/p{i}.txt', 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/p{i}.txt -c copy {T}/pan{i}.mp4")
    fc = (f"color=c=0x0D1323:s={W}x{H}:r={FPS}:d={sd}[bg];[bg][0]overlay={AX}:{AY}[a0];[1]format=rgba[fr];[a0][fr]overlay=0:0[a];"
          f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=0:0[b];"
          f"[3]format=rgba,fade=in:st=0.12:d=0.35:alpha=1[o];[b][o]overlay=x=0:y='70*pow(max(0,1-(t-0.12)/0.5),3)',"
          f"fade=in:st=0:d=0.14:color=0x{FL},format=yuv420p")
    sh(f"ffmpeg -v error -y -i {T}/pan{i}.mp4 -loop 1 -i {T}/frame.png -loop 1 -i {T}/k{i}.png -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {sd} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = int((bg.width - W) * P.get('end_x', 50) / 100); t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(30))
bg = Image.blend(bg, Image.new('RGB', (W, H), tuple(int(c) for c in SH_C.split(','))), 0.3)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25:color=0x{FL},format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.06:contrast=1.05:brightness='0.012*sin(t*23)':eval=frame,colorbalance=rs=0.03:gs=0.01:bs=-0.02:rh=0.03:bh=-0.03,noise=alls=9:allf=t,vignette=PI/5.5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset medium -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
