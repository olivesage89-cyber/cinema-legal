"""Fast-paced MOVING-STILLS video (1080x1920). Usage: python3 stillfast.py WORKDIR (reads plan.json -> video.mp4)
Look: flash burst -> full-screen title over drifting stills -> per film: serif line on black + 3 ROUNDED panels
whose stills jump-cut ~1s (staggered) -> framed app phone end card."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFC46B')
PW, PH, GAP, TOPY = 944, 530, 20, 242
PX = (W - PW) // 2
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]
def still(img, dur, w, h, x=50, y=50, seed=0, zoom=0.07):
    """slow drift / zoom on one still -> w x h mp4"""
    random.seed(seed + n[0]); n[0] += 1; out = f'{T}/s{n[0]}.mp4'; fr = max(2, int(round(dur * FPS)))
    im = Image.open(f'{D}/{img}').convert('RGB'); s = max(w / im.width, h / im.height) * 1.12
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    l = int((im.width - w * 1.12) * x / 100); t = int((im.height - h * 1.12) * y / 100)
    im = im.crop((l, t, l + int(w * 1.12), t + int(h * 1.12))); p = f'{T}/s{n[0]}.png'; im.save(p)
    zin = random.random() < .5; dx = random.choice([-1, 1]); step = zoom / fr
    z = f"'1.0+{step:.5f}*on'" if zin else f"'{1+zoom:.4f}-{step:.5f}*on'"
    xs = f"'(iw-iw/zoom)/2+{dx}*(on-{fr/2})*{0.9*w/1080:.3f}'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -vf \"scale={im.width*2}:-1,zoompan=z={z}:x={xs}:y='(ih-ih/zoom)/2':d={fr}:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p\" -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out
def cat(parts, out):
    lst = out + '.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {out}"); return out

# ---------- overlays ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Scr', 'mrs-saint-delafield', 400) + ff('Mar', 'marcellus', 400) + ff('Cor', 'cormorant-garamond', 500, 'italic') + ff('Cor', 'cormorant-garamond', 600, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
ov = {}; ti = P['title']
ov['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1150px;background:linear-gradient(180deg,rgba(6,8,16,.62),rgba(6,8,16,.34) 55%,rgba(6,8,16,0))'></div>"
               f"<div style='position:absolute;top:{ti.get('top',330)}px;width:100%;text-shadow:0 2px 26px rgba(0,0,0,.6),0 0 8px rgba(0,0,0,.3)'>"
               f"<div style='font:400 34px Mar;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
               f"<div style='font:400 270px/1.0 Scr;margin-top:10px'>{ti['hero']}</div>"
               f"<div style='font:italic 500 50px Cor;margin-top:-6px;color:#FFF3E2'>{ti['sub']}</div></div>")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{TOPY}px;width:100%;display:flex;flex-direction:column;justify-content:center;padding-top:10px;box-sizing:border-box'>"
                   f"<div style='font:400 22px Mar;letter-spacing:.5em;opacity:.7;padding-left:.5em'>0{i+1} / 0{len(P['films'])}</div>"
                   f"<div style='font:italic 600 {f.get('fs',68)}px/1.05 Cor;color:#FFF3E2;margin-top:8px'>{f['t']}</div>"
                   f"<div style='font:400 24px Mar;letter-spacing:.32em;margin-top:12px;padding-left:.32em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
mask = Image.new('L', (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, PW - 1, PH - 1], 30, fill=255); mask.save(f'{T}/mask.png')

segs = []
# 1. burst
for b in P['burst']: segs.append(still(b[0], P.get('flash', 0.2), W, H, x=b[1], zoom=0.03))
# 2. title
tc = [still(c[0], c[1], W, H, x=c[2]) for c in ti['stills']]; tdur = sum(c[1] for c in ti['stills'])
cat(tc, f'{T}/tbg.mp4')
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/title.png -filter_complex "
   f"\"[0]eq=brightness=-0.04[b];[1]format=rgba,fade=in:st=0.1:d=0.6:alpha=1[o];[b][o]overlay=x=0:y='max(0,44-130*t)':shortest=1,format=yuv420p\" "
   f"-t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films: 3 rounded panels, each jump-cuts through stills; panels rise in staggered
SEG = P.get('seg', 3.3); ST = 0.12; NPH = 3
for i, f in enumerate(P['films']):
    st = f["stills"]; m = len(st); panels = []; NPH = f.get("nph", 3)
    for k in range(3):
        parts = []; ph_d = (SEG - ST * k) / NPH
        for ph in range(NPH):
            c = st[(ph * 3 + k) % m]
            parts.append(still(c[0], round(ph_d, 3), PW, PH, x=c[1], y=c[2] if len(c) > 2 else 50, seed=i * 31 + k * 7 + ph, zoom=0.08))
        panels.append(cat(parts, f'{T}/pan{i}{k}.mp4'))
    fc = f"color=c=#07080c:s={W}x{H}:r={FPS}:d={SEG}[bg];[4]format=gray,loop=-1:1[m];[m]split=3[m0][m1][m2];"
    for k in range(3):
        fc += (f"[{k}]format=yuva420p[v{k}];[v{k}][m{k}]alphamerge,setpts=PTS-STARTPTS+{ST*k}/TB,fade=in:st={ST*k}:d=0.22:alpha=1[q{k}];")
    ys = [TOPY + k * (PH + GAP) for k in range(3)]
    fc += (f"[bg][q0]overlay={PX}:'{ys[0]}+max(0,40-400*(t-{0*ST}))':eof_action=pass[a];[a][q1]overlay={PX}:'{ys[1]}+max(0,40-400*(t-{ST}))':eof_action=pass[b];"
           f"[b][q2]overlay={PX}:'{ys[2]}+max(0,40-400*(t-{2*ST}))':eof_action=pass[c];[3]format=rgba,fade=in:st=0:d=0.25:alpha=1[o];[c][o]overlay=0:0,format=yuv420p")
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -loop 1 -i {T}/f{i}.png -loop 1 -i {T}/mask.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# 4. end card: framed phone on blurred still, no text
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 9, 14)), 0.38)
ph = Image.open(P['phone']).convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
m = m.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, m)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 14 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
# concat + grade + grain
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.04:contrast=1.02,colorbalance=rs=0.02:bs=-0.012,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
