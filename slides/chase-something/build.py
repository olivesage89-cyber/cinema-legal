"""chase MOVING-STILLS builder (motion_scene): 7-cut flash burst -> animated 'CHASE something.' title over Rocky steps
-> per film: giant Anton title top, full-width 4:5 panel with 4 punch-in jump cuts, Playfair italic line + 'year | where' bottom
-> framed app phone end card (no text)."""
import json, os, subprocess, random
from PIL import Image, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__)); os.chdir(D)
P = json.load(open('plan.json')); T = D + '/_t'; os.makedirs(T, exist_ok=True)
ENG = os.path.expanduser('~/engine'); FPS = 30; W, H = 1080, 1920
INK = P['ink']; CREAM = '#F6EEDF'; BG = '#0C0B0A'
PY, PH = 330, 1300          # panel top / height (full width)
CUT = P['cut']; NCUT = 4; SEG = CUT * NCUT
def sh(c): subprocess.run(c, shell=True, check=True)
n = [0]

def still_clip(img, w, h, dur, x=50, y=50, zin=True, push=0.07):
    """one still -> w x h clip with a quick ease-out punch zoom"""
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'; fr = max(1, round(dur * FPS))
    im = Image.open(img).convert('RGB'); s = max(w * 1.12 / im.width, h * 1.12 / im.height)
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    cw, ch = int(w * 1.12), int(h * 1.12)
    l = int(min(max(im.width * x / 100 - cw / 2, 0), im.width - cw)); t = int(min(max(im.height * y / 100 - ch / 2, 0), im.height - ch))
    im = im.crop((l, t, l + cw, t + ch)); p = f'{T}/c{n[0]}.jpg'; im.save(p, quality=96)
    e = f"(1-pow(1-on/{fr},2.2))"   # ease-out
    z = f"'1.0+{push}*{e}'" if zin else f"'{1+push}-{push}*{e}'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -vf \"scale={cw*2}:-1,zoompan=z={z}:x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={fr}:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p\" "
       f"-frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out

def concat(files, out):
    open(f'{T}/l.txt', 'w').write(''.join(f"file '{f}'\n" for f in files))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/l.txt -c copy {out}"); return out

# ---------- overlays ----------
F = ENG + '/node_modules/@fontsource/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ant', 'anton', 400) + ff('Pf', 'playfair-display', 500, 'italic') + ff('Pf', 'playfair-display', 600, 'italic') + ff('Int', 'inter', 500) + ff('Int', 'inter', 600) + "*{margin:0;padding:0}body{background:transparent}"
TITLE = f"""<div style="position:relative;width:{W}px;height:{H}px;text-align:center">
 <div style="position:absolute;left:0;right:0;top:0;height:1100px;background:linear-gradient(180deg,rgba(0,0,0,.62) 0%,rgba(0,0,0,.35) 60%,rgba(0,0,0,0) 100%)"></div>
 <div style="position:absolute;top:250px;left:0;right:0">
  <div id=k style="font-family:Int;font-weight:600;font-size:28px;letter-spacing:.5em;color:{CREAM};padding-left:.5em">MOVIES THAT MAKE YOU WANT TO</div>
  <div style="font-family:Ant;font-size:300px;line-height:1;color:{INK};letter-spacing:.02em;margin-top:22px;text-shadow:0 6px 50px rgba(0,0,0,.45)">{''.join(f'<span class=L style="display:inline-block">{c}</span>' for c in 'CHASE')}</div>
  <div id=s2 style="font-family:Pf;font-style:italic;font-weight:500;font-size:110px;line-height:1;color:{CREAM};margin-top:-26px;text-shadow:0 4px 30px rgba(0,0,0,.6)">something.</div>
  <div id=sb style="font-family:Int;font-weight:500;font-size:25px;letter-spacing:.36em;color:{CREAM};opacity:.85;margin-top:44px;padding-left:.36em">FIVE FILMS TO END THE YEAR STRONG</div>
 </div></div>"""
ANIM = """
const ease='cubic-bezier(.2,.8,.2,1)';
document.getElementById('k').animate([{opacity:0,letterSpacing:'.2em'},{opacity:1,letterSpacing:'.5em'}],{duration:600,easing:ease,fill:'both'});
document.querySelectorAll('.L').forEach((e,i)=>e.animate([{opacity:0,transform:'translateY(120px) skewX(-8deg)'},{opacity:1,transform:'none'}],{duration:420,delay:180+i*80,easing:ease,fill:'both'}));
document.getElementById('s2').animate([{opacity:0,transform:'translateX(-40px)'},{opacity:1,transform:'none'}],{duration:600,delay:750,easing:ease,fill:'both'});
document.getElementById('sb').animate([{opacity:0},{opacity:.85}],{duration:500,delay:1150,easing:ease,fill:'both'});
"""
TDUR = P['title_dur']
fo = {}
for i, f in enumerate(P['films']):
    fo[i] = f"""<div style="position:relative;width:{W}px;height:{H}px">
     <div style="position:absolute;top:0;left:0;right:0;height:{PY}px;display:flex;flex-direction:column;justify-content:flex-end;align-items:center;padding-bottom:26px;box-sizing:border-box">
       <div style="font-family:Int;font-weight:600;font-size:24px;letter-spacing:.5em;color:{INK};margin-bottom:8px;padding-left:.5em">0{i+1} / 05</div>
       <div class=fit style="font-family:Ant;font-size:150px;line-height:1;color:{CREAM};white-space:nowrap;letter-spacing:.01em">{f['t'].upper()}</div></div>
     <div style="position:absolute;top:{PY+PH}px;left:0;right:0;bottom:0;display:flex;flex-direction:column;align-items:center;padding-top:44px">
       <div style="font-family:Pf;font-style:italic;font-weight:500;font-size:50px;color:{CREAM}">{f['line']}</div>
       <div style="font-family:Int;font-weight:600;font-size:24px;letter-spacing:.34em;color:{INK};margin-top:22px;padding-left:.34em">{f['yr']}&nbsp;&nbsp;|&nbsp;&nbsp;{f['where'].upper()}</div></div></div>"""
js = """const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();
const css=%s, T=%s, A=%s, fo=%s, dir=%s, n=%d, fps=%d;
let p=await b.newPage({viewport:{width:1080,height:1920}});
fs.writeFileSync(dir+'/t.html','<html><head><style>'+css+'</style></head><body>'+T+'</body></html>');await p.goto('file://'+dir+'/t.html');await p.evaluate(()=>document.fonts.ready);
await p.evaluate(A);await p.evaluate(()=>document.getAnimations().forEach(a=>a.pause()));
for(let i=0;i<n;i++){await p.evaluate(t=>document.getAnimations().forEach(a=>a.currentTime=t),i*1000/fps);
 await p.screenshot({path:dir+'/tt_'+String(i).padStart(4,'0')+'.png',omitBackground:true});}
for(const k of Object.keys(fo)){fs.writeFileSync(dir+'/b.html','<html><head><style>'+css+'</style></head><body>'+fo[k]+'</body></html>');await p.goto('file://'+dir+'/b.html');await p.evaluate(()=>document.fonts.ready);
 await p.evaluate(()=>{const e=document.querySelector('.fit');let s=150;while(e.scrollWidth>1000&&s>40){s-=2;e.style.fontSize=s+'px'}});
 await p.screenshot({path:dir+'/fo'+k+'.png',omitBackground:true});}
await b.close();})();""" % (json.dumps(CSS), json.dumps(TITLE), json.dumps(ANIM), json.dumps(fo), json.dumps(T), int(TDUR * FPS), FPS)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENG} && node {T}/ov.js')
sh(f"ffmpeg -v error -y -framerate {FPS} -i {T}/tt_%04d.png -c:v qtrle {T}/title_ov.mov")

segs = []
# 1. burst: full-bleed flashes
segs.append(concat([still_clip(s, W, H, P['burst_d'], x, push=0.10) for s, x in P['burst']], f'{T}/burst.mp4'))
# 2. title
tb = still_clip(P['title_bg'][0], W, H, TDUR, P['title_bg'][1], P['title_bg'][2], zin=True, push=0.06)
sh(f"ffmpeg -v error -y -i {tb} -i {T}/title_ov.mov -filter_complex \"[0]eq=brightness=-0.05:saturation=0.95[b];[b][1]overlay=0:0,format=yuv420p\" -frames:v {int(TDUR*FPS)} -c:v libx264 -preset veryfast -crf 14 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3. films
for i, f in enumerate(P['films']):
    cuts = [still_clip(img, W, PH, CUT, x, y, zin=(k % 2 == 0)) for k, (img, x, y) in enumerate(f['imgs'])]
    pan = concat(cuts, f'{T}/pan{i}.mp4'); nf = int(SEG * FPS)
    fc = (f"color=c={BG}:s={W}x{H}:r={FPS}:d={SEG}[bg];[0]trim=end_frame={nf},setpts=PTS-STARTPTS[p];"
          f"[1]format=rgba,fade=in:st=0:d=0.18:alpha=1[o];[bg][p]overlay=0:{PY}:eof_action=pass[a];[a][o]overlay=0:'12*max(0,1-t/0.25)':eval=frame,format=yuv420p")
    sh(f"ffmpeg -v error -y -i {pan} -loop 1 -framerate {FPS} -i {T}/fo{i}.png -filter_complex \"{fc}\" -frames:v {nf} -r {FPS} -c:v libx264 -preset veryfast -crf 14 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# 4. end card: phone only
ED = 3.6; ne = int(ED * FPS)
ph = Image.open('app/phone.png'); s = 1600 / ph.height; ph = ph.resize((int(ph.width * s), 1600), Image.LANCZOS); ph.save(f'{T}/phone_e.png')
bgi = Image.open(P['end_bg']).convert('RGB'); sc = H * 1.15 / bgi.height; bgi = bgi.resize((int(bgi.width * sc), int(H * 1.15)))
cx = int(bgi.width * P.get('end_x', 50) / 100); l = max(0, min(bgi.width - int(W * 1.15), cx - int(W * 1.15) // 2))
bgi = bgi.crop((l, 0, l + int(W * 1.15), int(H * 1.15)))
bgi = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(40))).enhance(0.55); bgi.save(f'{T}/end_bg.jpg', quality=95)
px = (W - ph.width) // 2; py = (H - 1600) // 2
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end_bg.jpg -loop 1 -i {T}/phone_e.png -filter_complex "
   f"\"[0]scale={W*2}:-1,zoompan=z='min(1.0+0.0008*on,1.1)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={ne}:s={W}x{H}:fps={FPS}[b];"
   f"[1]format=rgba,fade=in:st=0:d=0.45:alpha=1[p];[b][p]overlay=x={px}:y='{py}+110*pow(max(0,1-t/0.6),3)':eval=frame,format=yuv420p\" "
   f"-frames:v {ne} -c:v libx264 -preset veryfast -crf 14 {T}/end.mp4")
segs.append(f'{T}/end.mp4')
# join + grade
inp = ' '.join(f'-i {s}' for s in segs); k = len(segs)
fc = ''.join(f'[{j}]setsar=1,fps={FPS},format=yuv420p[s{j}];' for j in range(k)) + ''.join(f'[s{j}]' for j in range(k)) + \
     f"concat=n={k}:v=1:a=0[v];[v]eq=contrast=1.05:saturation=0.95,colorbalance=rs=0.03:bs=-0.03:rh=0.03:bh=-0.03,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
