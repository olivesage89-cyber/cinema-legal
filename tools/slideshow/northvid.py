"""FAR NORTH (ice floe) stills video. Usage: python3 northvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Space Mono spaced kicker, glacier-blue Pinyon Script 'the far', giant Cinzel NORTH
with a compass-star rule, Cormorant italic sub, mono tag) with falling snow -> per film: one wide top panel + two tall
bottom panels edge to edge, each jump-cutting drifting stills at staggered times (white flash); a slanted arctic-navy
band (faint topo contours, glacier-blue hairline edges) cuts across between them with tilted text: mono latitude line,
Cinzel title, mono 'year | where', Cormorant italic line -> framed app phone end card on blurred still."""
import json, os, subprocess, sys, random
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#8FD6FF'); WHITE = '#F2F6F8'
TOP_H = 840; BOT_Y = 1010; BOT_H = H - BOT_Y; BOT_W = 540
# slanted band polygon (left edge lower than right): top 830->730, bottom 1130->1030
BT = (830, 730); BB = (1130, 1030); ANG = -5.29
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Ci', 'cinzel', 700) + ff('Ci', 'cinzel', 500) + ff('Ps', 'pinyon-script', 400) + ff('Co', 'cormorant-garamond', 500, 'italic') + \
      ff('Mo', 'space-mono', 400) + ff('Mo', 'space-mono', 700) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{WHITE};text-align:center}}"
SHD = "text-shadow:0 2px 24px rgba(0,10,20,.8)"
ARW = "<span style=\"font-family:'DejaVu Sans'\">→</span>"
STAR = (f"<svg width='46' height='46' viewBox='-23 -23 46 46' style='vertical-align:middle'><path d='M0-22L4-4 22 0 4 4 0 22-4 4-22 0-4-4Z' fill='{INK}'/>"
        f"<circle r='3' fill='#0A1622'/></svg>")
ov = {}
ti = P['title']; top = ti.get('top', 250)
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1450px;background:linear-gradient(180deg,rgba(4,12,22,.86),rgba(4,12,22,.62) 62%,rgba(4,12,22,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:700 30px Mo;letter-spacing:.5em;padding-left:.5em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SHD};font:400 200px/1.2 Ps;color:{INK}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+290}px;width:100%;font:700 220px/1 Ci;letter-spacing:.06em;padding-left:.06em;{SHD}'>{ti['hero']}</div>"
ov['trule'] = (f"<div style='position:absolute;top:{top+535}px;width:100%;display:flex;align-items:center;justify-content:center;gap:22px'>"
               f"<div style='width:300px;height:2px;background:linear-gradient(90deg,transparent,{INK})'></div>{STAR}"
               f"<div style='width:300px;height:2px;background:linear-gradient(90deg,{INK},transparent)'></div></div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+610}px;width:100%;{SHD}'><div style='font:italic 500 62px/1.1 Co'>{ti['sub']}</div>"
              f"<div style='font:700 25px Mo;letter-spacing:.4em;padding-left:.4em;margin-top:38px;color:{INK}'>{ti['tag'].replace('→', ARW)}</div></div>")
# topo contour lines for the band
random.seed(7)
paths = ''
for k in range(9):
    y0 = 700 + k * 52; pts = []
    for x in range(-40, 1141, 60): pts.append(f"{x},{y0 + 26 * __import__('math').sin(x / 140 + k * 1.3) + random.uniform(-6, 6):.0f}")
    paths += f"<polyline points='{' '.join(pts)}' fill='none' stroke='{INK}' stroke-opacity='.11' stroke-width='2'/>"
poly = f"0,{BT[0]} {W},{BT[1]} {W},{BB[1]} 0,{BB[0]}"
band = (f"<svg width='{W}' height='{H}' style='position:absolute;left:0;top:0'><defs><clipPath id='cp'><polygon points='{poly}'/></clipPath>"
        f"<linearGradient id='lg' x1='0' y1='0' x2='1' y2='0'><stop offset='0' stop-color='#081422'/><stop offset='1' stop-color='#0D2032'/></linearGradient></defs>"
        f"<polygon points='{poly}' fill='url(#lg)'/><g clip-path='url(#cp)'>{paths}</g>"
        f"<line x1='0' y1='{BT[0]}' x2='{W}' y2='{BT[1]}' stroke='{INK}' stroke-width='4'/>"
        f"<line x1='0' y1='{BB[0]}' x2='{W}' y2='{BB[1]}' stroke='{INK}' stroke-width='4'/></svg>")
seam = f"<div style='position:absolute;left:{BOT_W-2}px;top:{BOT_Y}px;width:4px;height:{BOT_H}px;background:#081422'></div>"
CY = (BT[0] + BT[1] + BB[0] + BB[1]) / 4
for i, f in enumerate(P['films']):
    ov[f'b{i}'] = seam + band
    rot = f"position:absolute;left:0;top:{CY-200:.0f}px;width:100%;height:400px;transform:rotate({ANG}deg);display:flex;flex-direction:column;align-items:center;justify-content:center"
    blk = lambda show: (f"<div style='{rot}'>"
        f"<div style='visibility:{'visible' if show=='k' else 'hidden'};font:700 23px Mo;letter-spacing:.38em;padding-left:.38em;color:{INK}'>0{i+1} / 05 &nbsp;·&nbsp; {f['geo']}</div>"
        f"<div style='visibility:{'visible' if show=='t' else 'hidden'};font:700 {f.get('fs',90)}px/1.02 Ci;letter-spacing:.03em;white-space:nowrap;margin:16px 0 18px'>{f['t']}</div>"
        f"<div style='visibility:{'visible' if show=='l' else 'hidden'}'><div style='font:700 23px Mo;letter-spacing:.32em;padding-left:.32em;color:{INK}'>"
        f"{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div style='font:italic 500 40px/1.1 Co;margin-top:10px;color:#DCE8EE'>{f['line']}</div></div></div>")
    for c in 'ktl': ov[f'{c}{i}'] = blk(c)
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')
# snow layer (tileable 1080x1920, stacked twice)
sn = Image.new('RGBA', (W, H * 2), (0, 0, 0, 0)); dr = ImageDraw.Draw(sn); random.seed(3)
for _ in range(170):
    x, y, r = random.uniform(0, W), random.uniform(0, H), random.choice([2, 2, 3, 3, 4, 5, 6])
    a = random.randint(90, 200)
    for yy in (y, y + H): dr.ellipse([x - r, yy - r, x + r, yy + r], fill=(255, 255, 255, a))
sn = sn.filter(ImageFilter.GaussianBlur(1.6)); sn.save(f'{T}/snow.png')

n = [0]
def piece(img, dur, x=50, y=50, mv=1, amp=110, z=1.08, w=W, h=H, flash=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = max(h * z / im.height, w * 1.06 / im.width)
    W2 = int(im.width * s) // 2 * 2; H2 = int(im.height * s) // 2 * 2
    span = W2 - w; cx = span * x / 100; cy = (H2 - h) * y / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.14:color=white" if flash else ""
    vf = f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':{cy:.0f},fps={FPS},setsar=1{fl},format=yuv420p"
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.45:alpha=1[r];[b][r]overlay=x='min(0,-60+150*(t-0.25))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.45:alpha=1[h];[c][h]overlay=x=0:y='max(0,40-110*(t-0.45))'[d];"
      f"[5]format=rgba,fade=in:st=0.8:d=0.4:alpha=1[g];[d][g]overlay=x=0:y=0[e];"
      f"[6]format=rgba,fade=in:st=1.0:d=0.45:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.0))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/trule.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4)
SPL = {'top': [1.0, 1.15], 'bl': [1.3, 1.0], 'br': [0.8, 1.2]}
GEO = {'top': (W, TOP_H, 0, 0), 'bl': (BOT_W, BOT_H, 0, BOT_Y), 'br': (BOT_W, BOT_H, BOT_W, BOT_Y)}
for i, f in enumerate(P['films']):
    pv = {}
    for pi, p in enumerate(('top', 'bl', 'br')):
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]; w, h, _, _ = GEO[p]
        cs = [piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (pi + q + i) % 2 else -1, amp=70 if p != 'top' else 90, w=w, h=h, flash=True)
              for q, it in enumerate(f[p])]
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv[p] = f'{T}/q{i}{p}.mp4'
    fc = f"color=c=0x081422:s={W}x{H}:d={SEG}:r={FPS}[bg];"
    e = lambda st: f"max(0,1-(t-{st})/0.32)*max(0,1-(t-{st})/0.32)"
    fc += f"[0]setpts=PTS-STARTPTS[v0];[bg][v0]overlay=x=0:y='-{TOP_H}*{e(0)}'[o0];"
    fc += f"[1]setpts=PTS-STARTPTS[v1];[o0][v1]overlay=x='-{BOT_W}*{e(0.1)}':y={BOT_Y}:enable='gte(t,0.1)'[o1];"
    fc += f"[2]setpts=PTS-STARTPTS[v2];[o1][v2]overlay=x='{BOT_W}+{BOT_W}*{e(0.2)}':y={BOT_Y}:enable='gte(t,0.2)'[o2];"
    fc += (f"[3]format=rgba[bd];[o2][bd]overlay=0:0[l0];"
           f"[4]format=rgba,fade=in:st=0.1:d=0.3:alpha=1[k];[l0][k]overlay=x='min(0,-60+220*t)':y=0[l1];"
           f"[5]format=rgba,fade=in:st=0.2:d=0.35:alpha=1[t];[l1][t]overlay=x=0:y='max(0,26-90*(t-0.2))'[l2];"
           f"[6]format=rgba,fade=in:st=0.45:d=0.35:alpha=1[l];[l2][l]overlay=x=0:y='max(0,22-80*(t-0.45))',format=yuv420p")
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv['top']} -i {pv['bl']} -i {pv['br']} -loop 1 -i {T}/b{i}.png "
       f"-loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex_script {T}/fc{i}.txt -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# end card
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bgi.width, H / bgi.height)
bgi = bgi.resize((int(bgi.width * s) + 1, int(bgi.height * s) + 1), Image.LANCZOS)
bgi = bgi.crop(((bgi.width - W) // 2, (bgi.height - H) // 2, (bgi.width - W) // 2 + W, (bgi.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(38))).enhance(0.55)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=160)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
burst_d = len(P['burst']) * P.get('flash', 0.2)
snow_end = burst_d + tdur + SEG * len(P['films'])
inp = ' '.join(f'-i {s}' for s in segs) + f' -loop 1 -i {T}/snow.png'
NS = len(segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(NS)) + ''.join(f'[s{k}]' for k in range(NS)) + f"concat=n={NS}:v=1:a=0[v];"
fc += (f"[{NS}]format=rgba,colorchannelmixer=aa=0.55[sn];[v][sn]overlay=x='8*sin(t*0.9)':y='mod(t*110,{H})-{H}':enable='between(t,{burst_d},{snow_end})':shortest=1[vs];"
       "[vs]eq=saturation=1.03:contrast=1.05,colorbalance=rs=-0.015:bs=0.02:rh=-0.005:bh=0.01,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]")
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
