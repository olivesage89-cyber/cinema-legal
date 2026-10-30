"""REAL-CLIPS video, look "TIDE" (1080x1920). Usage: python3 tidevid.py WORKDIR  (reads plan.json -> video.mp4)
flash burst (full-screen trailer shots, 0.2s) -> full-screen title over 3 quick clips, letters rising like a wave ->
per film: top band (serif title rising letter by letter + 'year | where') over 3 trailer panels stacked EDGE TO EDGE,
panels slide in like a wave (alternating sides) and jump-cut ~1s, staggered -> framed app phone end card (no text).
plan.json: {ink, accent, burst:[clip..], title:{kick,a,b,sub,clips:[clip x3]}, films:[{t,yr,where,clips:[clip x9]}],
end_bg:still.jpg}; clip = {src,ss,d,x}"""
import json, os, subprocess, sys
from PIL import Image, ImageFilter
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
BAND = 330; PH = (H - BAND) // 3  # 530
ENGINE = os.path.dirname(os.path.abspath(__file__)); INK = P.get('ink', '#FFF1DC'); ACC = P.get('accent', '#FF8E72')
def sh(c): subprocess.run(c, shell=True, check=True)
_crops = {}
def bars(src):
    if src not in _crops:
        import re
        log = subprocess.run(f"ffmpeg -hide_banner -ss 12 -i {D}/{src} -t 50 -vf cropdetect=limit=24:round=2:reset=0 -an -f null -", shell=True, capture_output=True, text=True).stderr
        m = re.findall(r'crop=(\d+:\d+:\d+:\d+)', log); _crops[src] = f"crop={m[-1]}," if m else ""
    return _crops[src]
n = [0]
def still(c, dur, w, h):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'; fr = max(2, int(round(dur * FPS)))
    im = Image.open(f"{D}/{c['img']}").convert('RGB'); s = max(w / im.width, h / im.height) * 1.1
    im = im.resize((int(im.width * s), int(im.height * s)), Image.LANCZOS)
    x = c.get('x', 50) / 100; y = c.get('y', 50) / 100
    l = int((im.width - w * 1.1) * x); t = int((im.height - h * 1.1) * y)
    im = im.crop((l, t, l + int(w * 1.1), t + int(h * 1.1))); p = f'{T}/c{n[0]}.png'; im.save(p)
    zin = n[0] % 2 == 0; step = 0.06 / fr
    z = f"'1.0+{step:.5f}*on'" if zin else f"'1.06-{step:.5f}*on'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -vf \"scale={im.width*2}:-1,zoompan=z={z}:x='(iw-iw/zoom)/2+(on-{fr/2})*0.8':y='(ih-ih/zoom)/2':d={fr}:s={w}x{h}:fps={FPS},setsar=1,format=yuv420p\" -frames:v {fr} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out
def clip(c, dur, w, h):
    if 'img' in c: return still(c, dur, w, h)
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'; d = c['d']; slow = min(max(dur / d, 1.0), 1.5); x = c.get('x', 50) / 100
    y = c.get('y', 50) / 100; z = c.get('z', 1.0)
    vf = (f"{bars(c['src'])}scale=ceil(iw*max({w}/iw\\,{h}/ih)*{z}/2)*2:-2,crop={w}:{h}:(iw-{w})*{x}:(ih-{h})*{y},"
          f"setpts={slow:.3f}*(PTS-STARTPTS),fps={FPS},tpad=stop_mode=clone:stop_duration={dur},setsar=1,format=yuv420p")
    sh(f"ffmpeg -v error -y -ss {c['ss']} -t {d} -i {D}/{c['src']} -vf \"{vf}\" -an -frames:v {int(round(dur*FPS))} -c:v libx264 -preset veryfast -crf 14 {out}")
    return out
def cat(parts, out):
    lst = out + '.txt'; open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    sh(f"ffmpeg -v error -y -f concat -safe 0 -i {lst} -c copy {out}"); return out

# ---------- overlays: animated PNG sequences rendered with Playwright ----------
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('IS', 'instrument-serif', 400) + ff('IS', 'instrument-serif', 400, 'italic') + ff('SG', 'space-grotesk', 500) + ff('SG', 'space-grotesk', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{INK};text-align:center;overflow:hidden}}" \
      ".w{display:inline-block;white-space:pre}.L{display:inline-block;animation:rise .75s cubic-bezier(.2,.9,.25,1) both}" \
      "@keyframes rise{from{transform:translateY(.55em) rotate(4deg);opacity:0;filter:blur(10px)}to{transform:none;opacity:1;filter:blur(0)}}" \
      ".fade{animation:fd .7s ease-out both}@keyframes fd{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}" \
      ".rule{animation:gr .8s cubic-bezier(.2,.9,.25,1) both;transform-origin:center}@keyframes gr{from{transform:scaleX(0)}to{transform:scaleX(1)}}"
def letters(s, d0=0.0, step=0.035):
    out = []; k = 0
    s = s.replace('<br>', '\n')
    for ch in s:
        if ch == '\n': out.append('<br>'); continue
        if ch == ' ': out.append("<span class='L'>&nbsp;</span>"); continue
        out.append(f"<span class='L' style='animation-delay:{d0 + k*step:.3f}s'>{ch}</span>"); k += 1
    return ''.join(out)
ov = {}
ti = P['title']
ov['title'] = (f"<div style='position:absolute;inset:0;background:linear-gradient(180deg,rgba(4,14,22,.0) 0%,rgba(4,14,22,.0) 40%,rgba(4,14,22,.55) 70%,rgba(4,14,22,.8) 100%)'></div>"
    f"<div style='position:absolute;bottom:{ti.get('bottom',250)}px;width:100%'>"
    f"<div class='fade' style='font:500 27px SG;letter-spacing:.5em;padding-left:.5em;color:{INK};opacity:.95;text-shadow:0 2px 14px rgba(0,0,0,.6)'>{ti['kick']}</div>"
    f"<div style='font:italic 400 170px/1 IS;color:{ACC};margin-top:26px;text-shadow:0 4px 40px rgba(0,0,0,.45)'>{letters(ti['a'], .15, .05)}</div>"
    f"<div style='font:400 214px/0.86 IS;letter-spacing:.05em;padding-left:.05em;color:{INK};text-shadow:0 4px 40px rgba(0,0,0,.45)'>{letters(ti['b'], .4, .06)}</div>"
    f"<div class='rule' style='width:120px;height:2px;background:{ACC};margin:34px auto 26px;animation-delay:.9s'></div>"
    f"<div class='fade' style='font:italic 400 52px IS;color:{INK};animation-delay:1.0s;text-shadow:0 2px 20px rgba(0,0,0,.6)'>{ti['sub']}</div></div>")
for i, f in enumerate(P['films']):
    fs = f.get('fs', 98)
    ov[f'f{i}'] = (f"<div style='position:absolute;top:0;left:0;width:100%;height:{BAND}px;display:flex;flex-direction:column;justify-content:center;align-items:center'>"
        f"<div class='fade' style='font:500 22px SG;letter-spacing:.42em;padding-left:.42em;color:{ACC}'>{i+1:02d} &nbsp;/&nbsp; 05</div>"
        f"<div style='font:italic 400 {fs}px/1.02 IS;color:{INK};margin-top:14px'>{letters(f['t'], .05, .03)}</div>"
        f"<div class='fade' style='font:400 25px SG;letter-spacing:.24em;padding-left:.24em;color:{INK};opacity:.82;margin-top:16px;animation-delay:.35s'>{f['yr']} &nbsp;<span style='color:{ACC}'>|</span>&nbsp; {f['where']}</div></div>")
NF = 62  # animated frames (0.87s) then hold
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html','<html><head><style>%s</style></head><body>'+O[k]+'</body></html>');"
      "await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "const nf=k=='title'?62:%d;for(let f=0;f<nf;f++){await p.evaluate(t=>{document.getAnimations().forEach(a=>{a.pause();a.currentTime=t})},f*1000/30);"
      "await p.screenshot({path:'%s/'+k+'_'+String(f).padStart(3,'0')+'.png',omitBackground:true});}}await b.close();})();") % (W, H, json.dumps(ov), T, CSS.replace("'", "\\'"), T, NF, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
def ovseq(k, dur):  # overlay video with alpha
    out = f'{T}/{k}_ov.mov'
    sh(f"ffmpeg -v error -y -framerate {FPS} -i {T}/{k}_%03d.png -vf \"tpad=stop_mode=clone:stop_duration={dur},format=argb\" -t {dur} -c:v qtrle {out}")
    return out

segs = []
# 1) burst
bd = P.get('burst_d', 0.2)
segs.append(cat([clip(c, bd, W, H) for c in P['burst']], f'{T}/burst.mp4'))
# 2) title over 3 quick full-screen clips
tc = ti['clips']; tdur = ti.get('dur', 2.9); parts = []
for k, c in enumerate(tc): parts.append(clip(c, c.get('hold', tdur / len(tc)), W, H))
tb = cat(parts, f'{T}/title_bg.mp4'); to = ovseq('title', tdur)
sh(f"ffmpeg -v error -y -i {tb} -i {to} -filter_complex \"[0][1]overlay=0:0,format=yuv420p\" -t {tdur} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
# 3) films: band + 3 edge-to-edge panels sliding in, staggered jump cuts
FD = P.get('film_dur', 3.3)
for i, f in enumerate(P['films']):
    cl = f['clips']; tracks = []
    for k in range(3):
        st = 0.1 + 0.12 * k  # slide start
        c1 = 1.05 + 0.18 * k; c2 = 2.15 + 0.18 * k  # cut times
        ds = [c1, c2 - c1, FD - c2]
        tracks.append(cat([clip(cl[(k + 3 * j) % len(cl)], ds[j], W, PH) for j in range(3)], f'{T}/f{i}_p{k}.mp4'))
    ovv = ovseq(f'f{i}', FD)
    fc = f"color=c=0x050B10:s={W}x{H}:r={FPS}:d={FD}[bg];"
    for k in range(3):
        st = 0.0 + 0.1 * k; sgn = 1 if (k + i) % 2 == 0 else -1
        fc += f"[{k}]setpts=PTS-STARTPTS[q{k}];"
    lab = 'bg'
    for k in range(3):
        st = 0.05 * k; sgn = 1 if (k + i) % 2 == 0 else -1
        xe = f"{sgn}*{W}*0.42*pow(max(0\\,1-max(0\\,t-{st:.2f})/0.34)\\,3)"
        fc += f"[{lab}][q{k}]overlay=x='{xe}':y={BAND + k*PH}:eval=frame[o{k}];"; lab = f'o{k}'
    fc += f"[{lab}][3]overlay=0:0,format=yuv420p"
    out = f'{T}/film{i}.mp4'
    sh(f"ffmpeg -v error -y -i {tracks[0]} -i {tracks[1]} -i {tracks[2]} -i {ovv} -filter_complex \"{fc}\" -t {FD} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {out}")
    segs.append(out)
# 4) end card: framed app phone on blurred still, phone rises in; no text
ED = P.get('end_dur', 3.4)
bg = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bg.width, H / bg.height); bg = bg.resize((int(bg.width*s)+1, int(bg.height*s)+1))
l = (bg.width - W) // 2; bg = bg.crop((l, 0, l + W, H)).filter(ImageFilter.GaussianBlur(30))
from PIL import ImageEnhance
bg = ImageEnhance.Brightness(bg).enhance(0.62); bg.save(f'{T}/end_bg.png')
ph = Image.open(f'{D}/phone.png'); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS); ph.save(f'{T}/phone_s.png')
px = (W - ph.width) // 2; py = (H - 1600) // 2
ye = f"{py}+260*pow(max(0\\,1-t/0.55)\\,3)"
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end_bg.png -loop 1 -i {T}/phone_s.png -filter_complex "
   f"\"[0]scale={W*2}:-1,zoompan=z='1.0+0.0007*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={int(ED*FPS)}:s={W}x{H}:fps={FPS}[b];[1]format=rgba,fade=in:st=0:d=0.35:alpha=1[p];[b][p]overlay=x={px}:y='{ye}':eval=frame,format=yuv420p\" "
   f"-frames:v {int(ED*FPS)} -c:v libx264 -preset veryfast -crf 15 {T}/end.mp4")
segs.append(f'{T}/end.mp4')
# join (hard cuts; short dissolve into end card), grade + grain
allv = cat(segs[:-1], f'{T}/main.mp4')
md = float(subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {allv}", shell=True))
fc = (f"[0]setpts=PTS-STARTPTS[a];[1]setpts=PTS-STARTPTS[b];[a][b]xfade=transition=fade:duration=0.35:offset={md-0.35:.3f},"
      f"eq=saturation=1.04:contrast=1.03,colorbalance=rs=0.02:bs=0.01:rh=0.03:bh=-0.02,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]")
sh(f"ffmpeg -v error -y -i {allv} -i {T}/end.mp4 -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', f'{D}/video.mp4')
