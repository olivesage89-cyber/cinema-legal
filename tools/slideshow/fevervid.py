"""Fast-paced MOVING-STILLS video (1080x1920). Usage: python3 stillfast.py WORKDIR (reads plan.json -> video.mp4)
Look: flash burst -> full-screen title over drifting stills -> per film: serif line on black + 3 ROUNDED panels
whose stills jump-cut ~1s (staggered) -> framed app phone end card."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFC46B')
PW, PH, GAP, TOPY = 1080, 420, 0, 0
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
CSS = ff('Arc', 'archivo-black', 400) + ff('DMS', 'dm-serif-display', 400, 'italic') + ff('Int', 'inter', 500) + ff('Int', 'inter', 600) + ff('Cor', 'cormorant-garamond', 500, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
ov = {}; ti = P['title']
ab = "text-shadow:-7px 0 0 rgba(255,60,170,.85),7px 0 0 rgba(60,235,255,.8),0 6px 40px rgba(0,0,0,.55)"
ov['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1250px;background:linear-gradient(180deg,rgba(8,4,18,.66),rgba(8,4,18,.38) 55%,rgba(8,4,18,0))'></div>"
               f"<div style='position:absolute;top:{ti.get('top',300)}px;width:100%'>"
               f"<div style='font:600 30px Int;letter-spacing:.52em;padding-left:.52em;color:#F4EEFF;text-shadow:0 2px 18px rgba(0,0,0,.7)'>{ti['kick']}</div>"
               f"<div style='font:400 236px/0.9 Arc;letter-spacing:-.01em;color:#FBF8FF;margin-top:34px;{ab}'>{ti['hero']}</div>"
               f"<div style='font:italic 400 230px/0.8 DMS;color:{INK};margin-top:-58px;text-shadow:0 4px 34px rgba(20,0,40,.6)'>{ti['hero2']}</div>"
               f"<div style='font:italic 500 50px Cor;margin-top:34px;color:#FFF6FB;text-shadow:0 2px 20px rgba(0,0,0,.75)'>{ti['sub']}</div></div>")
BY = P.get('band_y', 840); BH = 240
for i, f in enumerate(P['films']):
    ac = f.get('ac', INK)
    ov[f'f{i}'] = (f"<div style='position:absolute;top:{BY}px;height:{BH}px;width:100%;background:#050308;display:flex;flex-direction:column;justify-content:center;align-items:center'>"
                   f"<div style='position:absolute;top:22px;left:44px;font:600 20px Int;letter-spacing:.4em;color:#fff;opacity:.55'>0{i+1}</div>"
                   f"<div style='position:absolute;top:22px;right:44px;font:600 20px Int;letter-spacing:.4em;color:#fff;opacity:.55'>/ 0{len(P['films'])}</div>"
                   f"<div style='font:italic 400 {f.get('fs',78)}px/1.0 DMS;color:{ac};text-shadow:-3px 0 0 rgba(255,60,170,.45),3px 0 0 rgba(60,235,255,.4)'>{f['t']}</div>"
                   f"<div style='font:600 23px Int;letter-spacing:.36em;margin-top:18px;padding-left:.36em;color:#F2EEF7'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
# 1. burst
for j, b in enumerate(P['burst']):
    o = still(b[0], P.get('flash', 0.2), W, H, x=b[1], zoom=0.04); g = o.replace('.mp4', 'g.mp4'); sh_ = 10 if j % 2 == 0 else -10
    sh(f"ffmpeg -v error -y -i {o} -vf \"rgbashift=rh={sh_}:bh={-sh_}:enable='lt(t,0.07)',eq=saturation=1.12\" -c:v libx264 -preset veryfast -crf 14 {g}"); segs.append(g)
# 2. title
tc = [still(c[0], c[1], W, H, x=c[2]) for c in ti['stills']]; tdur = sum(c[1] for c in ti['stills'])
cat(tc, f'{T}/tbg.mp4')
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/title.png -filter_complex "
   f"\"[0]eq=brightness=-0.04[b];[1]format=rgba,fade=in:st=0.1:d=0.6:alpha=1[o];[b][o]overlay=x=0:y='max(0,60-200*t)':shortest=1,rgbashift=rh=-16:bh=16:enable='between(t,0.1,0.22)+between(t,1.6,1.68)',format=yuv420p\" "
   f"-t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films: 4 edge-to-edge strips (2 above, 2 below a black title band), each jump-cuts ~1s, staggered; glitch-in
SEG = P.get('seg', 3.3); ST = 0.1
ys = [0, PH, BY + BH, BY + BH + PH]
for i, f in enumerate(P['films']):
    st = f["stills"]; m = len(st); panels = []; NPH = f.get("nph", 3)
    for k in range(4):
        parts = []; ph_d = (SEG - ST * k) / NPH
        for ph in range(NPH):
            c = st[(ph * 4 + k) % m]
            parts.append(still(c[0], round(ph_d, 3), PW, PH, x=c[1], y=c[2] if len(c) > 2 else 50, seed=i * 31 + k * 7 + ph, zoom=0.09))
        panels.append(cat(parts, f'{T}/pan{i}{k}.mp4'))
    fc = f"color=c=#050308:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(4):
        fc += f"[{k}]setpts=PTS-STARTPTS+{ST*k}/TB,format=yuva420p,fade=in:st={ST*k}:d=0.18:alpha=1[q{k}];"
    dx = ['-', '+', '-', '+']
    fc += "[bg]"
    for k in range(4):
        fc += f"[q{k}]overlay='{dx[k]}max(0,120-1200*(t-{ST*k}))':{ys[k]}:eof_action=pass[l{k}];[l{k}]"
    fc += "[4]overlay=0:0,rgbashift=rh=-14:bh=14:enable='lt(t,0.16)',format=yuv420p"
    fc = fc.replace("[l3][4]", "[4]").replace("[l3];", "[l3];[l3]") if False else fc
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -i {panels[3]} -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
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
fc += "[v]eq=saturation=1.04:contrast=1.02,colorbalance=rs=0.01:bs=0.012,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
