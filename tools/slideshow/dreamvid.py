"""Fast-paced anime clips video. Usage: python3 animevid.py WORKDIR (reads plan.json, writes video.mp4)
plan: burst [[src,ss,x]], title {clips:[[src,ss,d,x]], kick, hero, sub}, films [{t,yr,where,clips:[[src,ss,x,y,z]*9]}],
      end_bg (jpg), phone (png), ink."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FBEAD2')
BAND = 252; PH = (H - BAND) // 3  # 556
def sh(c): subprocess.run(c, shell=True, check=True)
_crops = {}
def bars(src):
    if src not in _crops:
        import re
        log = subprocess.run(f"ffmpeg -hide_banner -ss 10 -i {D}/{src} -t 40 -vf cropdetect=limit=24:round=2:reset=0 -an -f null -", shell=True, capture_output=True, text=True).stderr
        m = re.findall(r'crop=(\d+:\d+:\d+:\d+)', log); _crops[src] = f"crop={m[-1]}," if m else ""
    return _crops[src]
n = [0]
def piece(src, ss, dur, w, h, x=50, y=50, z=1.0, slow=1.0):
    """cut dur seconds of real footage, cover-crop to w x h (extra zoom z, anchors x/y %)"""
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    W2, H2 = int(w * z), int(h * z)
    vf = (f"{bars(src)}scale={W2}:{H2}:force_original_aspect_ratio=increase:flags=lanczos,"
          f"crop={w}:{h}:(iw-{w})*{x/100}:(ih-{h})*{y/100},setpts={slow}*(PTS-STARTPTS),fps={FPS},"
          f"tpad=stop_mode=clone:stop_duration=2,trim=duration={dur},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -ss {ss} -i {D}/{src} -vf \"{vf}\" -an -c:v libx264 -preset veryfast -crf 15 {out}")
    return out

# ---------- overlays (playwright) ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ital', 'pinyon-script', 400) + ff('Bod', 'playfair-display', 500, 'italic') + ff('Bod', 'playfair-display', 400, 'italic') + ff('Int', 'marcellus', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center}}"
ov = {}
ti = P['title']
ov['title'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:1000px;background:linear-gradient(180deg,rgba(8,6,14,.5),rgba(8,6,14,.28) 55%,rgba(8,6,14,0))'></div><div style='position:absolute;top:{ti.get('top',300)}px;width:100%;text-shadow:0 2px 24px rgba(0,0,0,.55),0 0 6px rgba(0,0,0,.25)'>"
               f"<div style='font:400 32px Int;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
               f"<div style='font:400 250px/1.15 Ital;margin-top:0px'>{ti['hero']}</div>"
               f"<div style='font:italic 400 50px Bod;margin-top:0px'>{ti['sub']}</div></div>")
for i, f in enumerate(P['films']):
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;height:{BAND}px;width:100%;display:flex;flex-direction:column;justify-content:center'>"
                   f"<div style='font:italic 500 {f.get('fs',66)}px/1.05 Bod'>{f['t']}</div>"
                   f"<div style='font:400 25px Int;letter-spacing:.32em;margin-top:18px;opacity:.82;padding-left:.3em'>{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

segs = []
# ---------- 1. opening burst ----------
for b in P['burst']:
    segs.append(piece(b[0], b[1], P.get('flash', 0.2), W, H, x=b[2]))
# ---------- 2. title: full-screen clips + animated title (fade + rise, letter-spacing feel) ----------
tc = [piece(c[0], c[1], c[2], W, H, x=c[3], slow=c[4] if len(c) > 4 else 1.0) for c in ti['clips']]
tdur = sum(c[2] for c in ti['clips'])
lst = f'{T}/tl.txt'; open(lst, 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {T}/tbg.mp4")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/title.png -filter_complex "
   f"\"[0]eq=brightness=-0.05[b];[1]format=rgba,fade=in:st=0.15:d=0.6:alpha=1[o];[b][o]overlay=x=0:y='max(0,40-120*t)':shortest=1,format=yuv420p\" "
   f"-t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# ---------- 3. films: black band with title, 3 panels stacked edge to edge, cascading jump cuts ----------
SEG = P.get('seg', 3.0); ST = 0.1; PHASE = SEG / 3
for i, f in enumerate(P['films']):
    panels = []
    for k in range(3):
        parts = []
        for ph in range(3):
            c = f['clips'][k * 3 + ph]; src, ss = c[0], c[1]
            x, y, z = (c[2] if len(c) > 2 else 50), (c[3] if len(c) > 3 else 50), (c[4] if len(c) > 4 else 1.0)
            d = PHASE if ph < 2 else SEG - 2 * PHASE - ST * k
            if ph == 0: d = PHASE   # first piece starts after a stagger (black before)
            parts.append(piece(src, ss, round(d, 3), W, PH, x, y, z, c[5] if len(c) > 5 else 1.0))
        lst = f'{T}/p{i}{k}.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {T}/pan{i}{k}.mp4"); panels.append(f'{T}/pan{i}{k}.mp4')
    fc = f"color=c=#0a0912:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(3): fc += f"[{k}]setpts=PTS-STARTPTS+{ST*k}/TB[q{k}];"
    fc += (f"[bg][q0]overlay=0:{BAND}:eof_action=pass[a];[a][q1]overlay=0:{BAND+PH}:eof_action=pass[b];[b][q2]overlay=0:{BAND+2*PH}:eof_action=pass[c];"
           f"[3]format=rgba,fade=in:st=0:d=0.25:alpha=1[o];[c][o]overlay=0:0,format=yuv420p")
    sh(f"ffmpeg -v error -y -i {panels[0]} -i {panels[1]} -i {panels[2]} -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# ---------- 4. end card: framed phone on blurred still, slow push-in, no text ----------
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height) * 1.1
bg = bg.resize((int(bg.width * s), int(bg.height * s))); l = (bg.width - W) // 2; t0 = (bg.height - H) // 2
bg = bg.crop((l, t0, l + W, t0 + H)).filter(ImageFilter.GaussianBlur(28))
bg = Image.blend(bg, Image.new('RGB', (W, H), (10, 9, 14)), 0.38)
ph = Image.open(P['phone']).convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
sha = Image.new('RGBA', (W, H), (0, 0, 0, 0)); m = Image.new('L', (W, H), 0)
ImageDraw.Draw(m).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
m = m.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, m)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
# ---------- concat (hard cuts) + gentle film grade + grain ----------
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.03:contrast=1.02,colorbalance=rs=0.02:bs=-0.015,noise=alls=5:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
