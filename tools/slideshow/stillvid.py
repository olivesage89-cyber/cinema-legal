"""Moving-stills OR real-clips video (1080x1920): title card -> per film 3 stacked stills with slow drift -> end card.
Usage: python3 stillvid.py WORKDIR   (reads WORKDIR/video.json, images relative to WORKDIR; writes WORKDIR/video.mp4)
video.json: {"title_kick","title","title_sub","title_img"|"title_clip","films":[{"t","yr","dir","imgs":[a,b,c]}],"end_line","end_img"|"end_clip","ink"}
Each item in imgs is either a still filename or a clip {"src":"a.mp4","ss":12.3,"d":2.1} (from trailers.py shots)."""
import json, os, subprocess, sys, random
from PIL import Image, ImageDraw
D = os.path.abspath(sys.argv[1]); V = json.load(open(f'{D}/video.json'))
T = f'{D}/_tmp'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
PW, PH, GAP = 960, 540, 18
TOP = (H - (3 * PH + 2 * GAP)) // 2 + 30
SEG = V.get('seg', 4.2); XF = 0.6
INK = V.get('ink', '#F4E7A1')
ENGINE = os.path.dirname(os.path.abspath(__file__))

def sh(c): subprocess.run(c, shell=True, check=True)

# rounded-corner mask for panels
mask = Image.new('L', (PW, PH), 0); ImageDraw.Draw(mask).rounded_rectangle([0, 0, PW - 1, PH - 1], 26, fill=255); mask.save(f'{T}/mask.png')

# text overlays rendered with Playwright (transparent PNGs)
html_parts = []
def overlay_html(inner):
    F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
    ff = lambda fam, pkg, w, st='normal': f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
    css = ff('Pinyon', 'pinyon-script', 400) + ff('Corm', 'cormorant-garamond', 500) + ff('Corm', 'cormorant-garamond', 600) + ff('Corm', 'cormorant-garamond', 500, 'italic')
    css += f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;font-family:Corm;color:{INK};text-align:center}}" \
           ".top{position:absolute;top:58px;width:100%;font-style:italic;font-weight:500;font-size:46px}" \
           ".bot{position:absolute;bottom:52px;width:100%;font-weight:600;font-size:26px;letter-spacing:.32em}" \
           ".mid{position:absolute;top:50%;width:100%;transform:translateY(-50%)}" \
           ".kick{font-weight:600;font-size:28px;letter-spacing:.45em}.script{font-family:Pinyon;font-size:200px;line-height:1}" \
           ".sub{font-style:italic;font-weight:500;font-size:46px;margin-top:20px}.brand{font-weight:600;font-size:26px;letter-spacing:.6em;margin-top:40px;opacity:.85}"
    return f"<html><head><style>{css}</style></head><body>{inner}</body></html>"

overlays = {'title': overlay_html(f"<div class='mid'><div class='kick'>{V['title_kick']}</div><div class='script'>{V['title']}</div><div class='sub'>{V['title_sub']}</div></div>"),
            'end': overlay_html(f"<div class='mid'><div class='script'>Cinema</div><div class='sub'>{V['end_line']}</div><div class='brand'>ON THE APP STORE</div></div>")}
for i, f in enumerate(V['films']):
    overlays[f'f{i}'] = overlay_html(f"<div class='top'>{f['t']} <span style='font-size:34px'>({f['yr']})</span></div><div class='bot'>{f['dir'].upper()}</div>")
js = "const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);await p.waitForTimeout(100);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();" % (W, H, json.dumps(overlays), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

_crops = {}
def bars(src):
    """detect letterbox/pillarbox black bars baked into a trailer -> crop filter"""
    if src not in _crops:
        log = subprocess.run(f"ffmpeg -hide_banner -ss 10 -i {D}/{src} -t 40 -vf cropdetect=limit=24:round=2:reset=0 -an -f null -", shell=True, capture_output=True, text=True).stderr
        import re as _re; m = _re.findall(r'crop=(\d+:\d+:\d+:\d+)', log)
        _crops[src] = f"crop={m[-1]}," if m else ""
    return _crops[src]

def clip_panel(c, out, dur, w=PW, h=PH, rounded=True):
    """real footage: cut [ss, ss+d], cover-crop to w x h, slow down a little if shorter than dur, hold last frame"""
    d = c['d']; slow = min(max(dur / d, 1.0), 1.6)
    x = c.get('x', 50) / 100
    vf = (f"{bars(c['src'])}scale={w}:{h}:force_original_aspect_ratio=increase,crop={w}:{h}:(iw-{w})*{x}:(ih-{h})/2,"
          f"setpts={slow:.3f}*(PTS-STARTPTS),fps={FPS},tpad=stop_mode=clone:stop_duration={dur}")
    if rounded:
        sh(f"ffmpeg -v error -y -ss {c['ss']} -t {d} -i {D}/{c['src']} -loop 1 -i {T}/mask.png -filter_complex "
           f"\"[0]{vf},format=yuva420p[v];[1]format=gray[m];[v][m]alphamerge\" -an -t {dur} -c:v qtrle {out}.mov")
    else:
        sh(f"ffmpeg -v error -y -ss {c['ss']} -t {d} -i {D}/{c['src']} -vf \"{vf},format=yuv420p\" -an -t {dur} -c:v libx264 -preset veryfast -crf 16 {out}.mp4")

def panel(img, out, dur, seed):
    if isinstance(img, dict): return clip_panel(img, out, dur)
    """slow drift/zoom on one still -> PWxPH clip with rounded corners (yuva)"""
    random.seed(seed); n = int(dur * FPS)
    im = Image.open(img).convert('RGB'); im = im.resize((int(PW * 1.18), int(PW * 1.18 * im.height / im.width)))
    if im.height < PH * 1.18: im = im.resize((int(im.width * PH * 1.18 / im.height), int(PH * 1.18)))
    p = f'{T}/{os.path.basename(out)}.jpg'; im.save(p, quality=95)
    zin = random.choice([True, False]); dx = random.choice([-1, 1])
    z = "'min(1.0+0.0012*on,1.15)'" if zin else "'max(1.15-0.0012*on,1.0)'"
    x = f"'(iw-iw/zoom)/2+{dx}*on*0.35'"; y = "'(ih-ih/zoom)/2'"
    sh(f"ffmpeg -v error -y -loop 1 -i {p} -i {T}/mask.png -filter_complex "
       f"\"[0]scale={im.width*2}:-1,zoompan=z={z}:x={x}:y={y}:d={n}:s={PW}x{PH}:fps={FPS},format=yuva420p[v];[1]format=gray,loop=-1:1[m];[v][m]alphamerge\" "
       f"-frames:v {n} -c:v qtrle {out}.mov")

segs = []
def film_seg(i, f):
    dur = SEG
    for k, img in enumerate(f['imgs']): panel(img if isinstance(img, dict) else f"{D}/{img}", f'{T}/p{i}_{k}', dur, i * 10 + k)
    ys = [TOP + k * (PH + GAP) for k in range(3)]; x = (W - PW) // 2
    # staggered reveal: panel k appears at 0.25*k s
    fc = f"color=c=black:s={W}x{H}:r={FPS}:d={dur}[bg];"
    for k in range(3): fc += f"[{k}]setpts=PTS-STARTPTS+{0.22*k}/TB,fade=in:st={0.22*k}:d=0.35:alpha=1[q{k}];"
    fc += f"[bg][q0]overlay={x}:{ys[0]}:eof_action=pass[a];[a][q1]overlay={x}:{ys[1]}:eof_action=pass[b];[b][q2]overlay={x}:{ys[2]}:eof_action=pass[c];[c][3]overlay=0:0,format=yuv420p"
    out = f'{T}/seg{i}.mp4'
    sh(f"ffmpeg -v error -y -i {T}/p{i}_0.mov -i {T}/p{i}_1.mov -i {T}/p{i}_2.mov -loop 1 -i {T}/f{i}.png -filter_complex \"{fc}\" -t {dur} -r {FPS} -c:v libx264 -preset veryfast -crf 17 {out}")
    return out

def card(name, bgimg, dur, clip=None):
    out = f'{T}/{name}.mp4'; n = int(dur * FPS)
    if clip:
        clip_panel(clip, f'{T}/{name}_bgclip', dur, W, H, rounded=False)
        sh(f"ffmpeg -v error -y -i {T}/{name}_bgclip.mp4 -loop 1 -i {T}/{name}.png -filter_complex \"[0]eq=brightness=-0.07[b];[b][1]overlay=0:0,format=yuv420p\" -t {dur} -c:v libx264 -preset veryfast -crf 17 {out}")
    elif bgimg:
        im = Image.open(f'{D}/{bgimg}').convert('RGB'); s = H * 1.2 / im.height; im = im.resize((int(im.width * s), int(H * 1.2)))
        cx = int(im.width * V.get('title_x', 50) / 100); left = max(0, min(im.width - int(W * 1.2), cx - int(W * 0.6)))
        im = im.crop((left, 0, left + int(W * 1.2), int(H * 1.2))); p = f'{T}/{name}_bg.jpg'; im.save(p, quality=95)
        sh(f"ffmpeg -v error -y -loop 1 -i {p} -loop 1 -i {T}/{name}.png -filter_complex "
           f"\"[0]scale={W*2}:-1,zoompan=z='min(1.0+0.0009*on,1.12)':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={n}:s={W}x{H}:fps={FPS},eq=brightness=-0.06[b];[b][1]overlay=0:0,format=yuv420p\" "
           f"-frames:v {n} -c:v libx264 -preset veryfast -crf 17 {out}")
    else:
        sh(f"ffmpeg -v error -y -f lavfi -i color=c=black:s={W}x{H}:r={FPS}:d={dur} -loop 1 -i {T}/{name}.png -filter_complex \"[0][1]overlay=0:0,format=yuv420p\" -t {dur} -c:v libx264 -preset veryfast -crf 17 {out}")
    return out

segs.append(card('title', V.get('title_img'), V.get('title_dur', 3.2), V.get('title_clip')))
for i, f in enumerate(V['films']): segs.append(film_seg(i, f))
segs.append(card('end', V.get('end_img'), 3.4, V.get('end_clip')))

# chain crossfades, then film grade + grain
inp = ' '.join(f'-i {s}' for s in segs); durs = [float(subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {s}", shell=True)) for s in segs]
fc = ''; prev = '0'; off = 0
for k in range(1, len(segs)):
    off += durs[k - 1] - XF; lab = f'x{k}'
    fc += f"[{prev}][{k}]xfade=transition=fade:duration={XF}:offset={off:.3f}[{lab}];"; prev = lab
fc += f"[{prev}]eq=saturation=0.84:contrast=0.95:brightness=0.01,colorbalance=rs=0.03:bs=-0.03:rh=0.02,noise=alls=7:allf=t,vignette=PI/5,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset veryfast -crf 19 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', f'{D}/video.mp4')
