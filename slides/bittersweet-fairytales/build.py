"""bittersweet-fairytales REAL-CLIPS builder: burst -> animated title over clips -> 5 films (3 edge-to-edge strips + title band) -> app phone end card."""
import json, os, subprocess, re
from PIL import Image, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
P = json.load(open('plan.json')); T = D + '/_t'; os.makedirs(T, exist_ok=True)
ENG = os.path.expanduser('~/engine'); FPS = 30; W, H = 1080, 1920
SEG = P['seg']; SH = 560; BAND = 240
INK = '#E9CF95'
def sh(c): subprocess.run(c, shell=True, check=True)
_crop = {}
def bars(src):
    if src not in _crop:
        log = subprocess.run(f"ffmpeg -hide_banner -ss 20 -i {src}.mp4 -t 60 -vf cropdetect=limit=24:round=2:reset=0 -an -f null -", shell=True, capture_output=True, text=True).stderr
        m = re.findall(r'crop=(\d+):(\d+):(\d+):(\d+)', log)
        if m: w_, h_, x_, y_ = map(int, m[-1]); _crop[src] = f"crop={w_-16}:{h_-24}:{x_+8}:{y_+12},"
        else: _crop[src] = "crop=iw-16:ih-24:8:12,"
    return _crop[src]
n = [0]
def piece(src, ss, d, w, h, x=50):
    n[0] += 1; out = f'{T}/pc{n[0]}.mp4'; fr = max(1, round(d * FPS))
    vf = f"{bars(src)}scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}:(iw-{w})*{x/100}:(ih-{h})/2,fps={FPS},setsar=1,format=yuv420p"
    sh(f"ffmpeg -v error -y -ss {ss} -i {src}.mp4 -vf \"{vf}\" -an -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out
def concat(files, out):
    open(f'{T}/l.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/l.txt -c copy {out}")
    return out

# ---------- overlays (Playwright) ----------
F = ENG + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ital', 'italianno', 400) + ff('Bod', 'bodoni-moda', 500, 'italic') + ff('Bod', 'bodoni-moda', 600, 'italic') + ff('Int', 'inter', 500) + ff('Int', 'inter', 600) + "*{margin:0;padding:0}body{background:transparent}"
TITLE = f"""<div id=s style="position:relative;width:{W}px;height:{H}px;text-align:center;color:{INK}"><div style="position:absolute;left:-200px;right:-200px;top:520px;height:880px;background:radial-gradient(ellipse at center,rgba(0,0,0,.5) 0%,rgba(0,0,0,.28) 45%,rgba(0,0,0,0) 72%)"></div>
 <div style="position:absolute;top:50%;left:0;right:0;transform:translateY(-54%)">
  <div id=k style="font-family:Int;font-weight:600;font-size:27px;letter-spacing:.55em;color:#F6EEDC;margin-bottom:6px">FIVE FILMS FOR GROWN-UPS</div>
  <div id=t1 style="font-family:Ital;font-size:215px;line-height:.9;text-shadow:0 4px 40px rgba(0,0,0,.55)">bittersweet</div>
  <div id=t2 style="font-family:Bod;font-style:italic;font-weight:500;font-size:96px;letter-spacing:.02em;line-height:1;margin-top:-6px;color:#F6EEDC;text-shadow:0 4px 30px rgba(0,0,0,.6)">fairytales</div>
  <div id=sb style="font-family:Bod;font-style:italic;font-weight:500;font-size:40px;margin-top:34px;color:#F6EEDC;text-shadow:0 2px 20px rgba(0,0,0,.7)">who still believe in a little magic</div>
 </div></div>"""
ANIM = """
const ease='cubic-bezier(.2,.7,.2,1)';
document.getElementById('k').animate([{opacity:0,letterSpacing:'.2em'},{opacity:1,letterSpacing:'.55em'}],{duration:700,easing:ease,fill:'both'});
document.getElementById('t1').animate([{clipPath:'inset(0 100% 0 0)',filter:'blur(6px)'},{clipPath:'inset(0 0% 0 0)',filter:'blur(0px)'}],{duration:1000,delay:250,easing:'cubic-bezier(.45,.05,.3,1)',fill:'both'});
document.getElementById('t2').animate([{opacity:0,transform:'translateY(26px)'},{opacity:1,transform:'none'}],{duration:650,delay:900,easing:ease,fill:'both'});
document.getElementById('sb').animate([{opacity:0,transform:'translateY(16px)'},{opacity:1,transform:'none'}],{duration:600,delay:1350,easing:ease,fill:'both'});
"""
TDUR = sum(b[2] for b in P['title_bg'])
bands = {}
for i, f in enumerate(P['films']):
    bands[i] = f"""<div style="width:{W}px;height:{BAND}px;background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center">
     <div class=fit style="font-family:Bod;font-style:italic;font-weight:600;font-size:66px;line-height:1.05;color:{INK};white-space:nowrap;padding:0 40px">{f['t']}</div>
     <div style="font-family:Int;font-weight:500;font-size:22px;letter-spacing:.32em;color:rgba(246,238,220,.78);margin-top:16px">{f['yr']}&nbsp;&nbsp;|&nbsp;&nbsp;{f['where'].upper()}</div></div>"""
js = """const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();
const css=%s, T=%s, A=%s, bands=%s, dir=%s, n=%d, fps=%d;
let p=await b.newPage({viewport:{width:1080,height:1920}});
fs.writeFileSync(dir+'/t.html','<html><head><style>'+css+'</style></head><body>'+T+'</body></html>');await p.goto('file://'+dir+'/t.html');await p.evaluate(()=>document.fonts.ready);
await p.evaluate(A);await p.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
for(let i=0;i<n;i++){await p.evaluate(t=>document.getAnimations().forEach(a=>a.currentTime=t),i*1000/fps);
 await p.screenshot({path:dir+'/tt_'+String(i).padStart(4,'0')+'.png',omitBackground:true});}
await p.close(); p=await b.newPage({viewport:{width:1080,height:240}});
for(const k of Object.keys(bands)){fs.writeFileSync(dir+'/b.html','<html><head><style>'+css+'</style></head><body>'+bands[k]+'</body></html>');await p.goto('file://'+dir+'/b.html');await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(()=>{const e=document.querySelector('.fit');let s=66;while(e.scrollWidth>1000&&s>30){s-=2;e.style.fontSize=s+'px'}});
 await p.screenshot({path:dir+'/band'+k+'.png'});}
await b.close();})();""" % (json.dumps(CSS), json.dumps(TITLE), json.dumps(ANIM), json.dumps(bands), json.dumps(T), int(TDUR * FPS), FPS)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENG} && node {T}/ov.js')
sh(f"ffmpeg -v error -y -framerate {FPS} -i {T}/tt_%04d.png -c:v qtrle {T}/title_ov.mov")

segs = []
# ---------- 1. burst ----------
segs.append(concat([piece(s, ss, d, W, H, x) for s, ss, d, x in P['burst']], f'{T}/burst.mp4'))
# ---------- 2. title ----------
bg = concat([piece(s, ss, d, W, H, x) for s, ss, d, x in P['title_bg']], f'{T}/title_bg.mp4')
sh(f"ffmpeg -v error -y -i {bg} -i {T}/title_ov.mov -filter_complex \"[0]eq=brightness=-0.13:saturation=0.9,vignette=PI/3.2[b];[b][1]overlay=0:0,format=yuv420p\" -frames:v {int(TDUR*FPS)} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# ---------- 3. films ----------
for i, f in enumerate(P['films']):
    strips = []
    for k, s in enumerate(f['strips']):
        st = concat([piece(src, ss, d, W, SH, p[3] if len(p) > 3 else 50) for p in s for src, ss, d in [p[:3]]], f'{T}/f{i}s{k}.mp4')
        strips.append(st)
    nf = int(SEG * FPS); ys = [0, SH, SH * 2 + BAND]
    fc = f"color=c=black:s={W}x{H}:r={FPS}:d={SEG}[bg];"
    for k in range(3):
        dl = 0.07 * k
        fc += f"[{k}]trim=end_frame={nf},setpts=PTS-STARTPTS+{dl}/TB[q{k}];"
    fc += f"[3]format=rgba,fade=in:st=0.15:d=0.35:alpha=1[bd];"
    fc += f"[bg][q0]overlay=0:{ys[0]}:eof_action=pass[a];[a][q1]overlay=0:{ys[1]}:eof_action=pass[b2];[b2][q2]overlay=0:{ys[2]}:eof_action=pass[c];[c][bd]overlay=0:{SH*2},format=yuv420p"
    out = f'{T}/film{i}.mp4'
    sh(f"ffmpeg -v error -y -i {strips[0]} -i {strips[1]} -i {strips[2]} -loop 1 -framerate {FPS} -i {T}/band{i}.png -filter_complex \"{fc}\" -frames:v {nf} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {out}")
    segs.append(out)
# ---------- 4. end card: app phone, no text ----------
ED = 3.6; ne = int(ED * FPS)
ph = Image.open('app/phone.png'); s = 1600 / ph.height; ph = ph.resize((int(ph.width * s), 1600), Image.LANCZOS); ph.save(f'{T}/phone_e.png')
bgi = Image.open(P['end_bg']).convert('RGB'); sc = H * 1.15 / bgi.height; bgi = bgi.resize((int(bgi.width * sc), int(H * 1.15)))
cx = bgi.width // 2; bgi = bgi.crop((cx - int(W * 1.15) // 2, 0, cx - int(W * 1.15) // 2 + int(W * 1.15), int(H * 1.15)))
bgi = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(38))).enhance(0.55); bgi.save(f'{T}/end_bg.jpg', quality=95)
px = (W - ph.width) // 2; py = (H - 1600) // 2
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end_bg.jpg -loop 1 -i {T}/phone_e.png -filter_complex "
   f"\"[0]scale={W*2}:-1,zoompan=z='min(1.0+0.0008*on,1.1)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={ne}:s={W}x{H}:fps={FPS}[b];"
   f"[1]format=rgba,fade=in:st=0:d=0.45:alpha=1[p];[b][p]overlay=x={px}:y='{py}+110*pow(max(0,1-t/0.6),3)':eval=frame,format=yuv420p\" "
   f"-frames:v {ne} -c:v libx264 -preset veryfast -crf 14 {T}/end.mp4")
segs.append(f'{T}/end.mp4')
# ---------- join + grade ----------
inp = ' '.join(f'-i {s}' for s in segs); k = len(segs)
fc = ''.join(f'[{j}]setsar=1,fps={FPS},format=yuv420p[s{j}];' for j in range(k)) + ''.join(f'[s{j}]' for j in range(k)) + f"concat=n={k}:v=1:a=0[v];[v]eq=contrast=1.04:saturation=0.92,colorbalance=rs=0.02:bs=-0.02:rh=0.03:bh=-0.02,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
