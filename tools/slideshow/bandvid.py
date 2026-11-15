"""SETLIST (start a band) stills video. Usage: python3 bandvid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen jump-cut title (warm-black top shade, Space Grotesk spaced kicker, amp-orange Permanent Marker
'start a', Rubik Mono One BAND letters stomping in one by one, sub, count-in '1 · 2 · 3 · 4!' beat by beat) ->
per film: THREE strips stacked edge to edge (2 above, 1 below) sliding in from alternating sides and jump-cutting
out of sync; between them a black stage band with 'TRACK 0X / 05' and the title in marker on a strip of coloured
tape slapped on, 'year | where' under it -> framed app phone end card, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
STR = [(0, 498), (502, 498), (1422, 498)]   # (y, h) of the 3 strips
BY, BH = 1000, 422                         # stage band
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Pm', 'permanent-marker', 400) + ff('Rm', 'rubik-mono-one', 400) + ff('Sg', 'space-grotesk', 500) + \
      ff('Sg', 'space-grotesk', 600) + ff('Sg', 'space-grotesk', 400) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:#F6EEDD;text-align:center}}"
ACC = P.get('acc', '#FF5A2E'); CREAM = '#F6EEDD'
SHD = "text-shadow:0 2px 22px rgba(10,4,2,.8)"
ov = {}
ti = P['title']; top = 200
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1300px;background:linear-gradient(180deg,rgba(14,6,4,.9),rgba(14,6,4,.66) 52%,rgba(14,6,4,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:600 30px Sg;letter-spacing:.42em;padding-left:.42em'>{ti['kick']}</div>"
ov['tscript'] = (f"<div style='position:absolute;top:{top+60}px;width:100%'><div style='display:inline-block;transform:rotate(-4deg);"
                 f"font:400 150px/1 Pm;color:{ACC};text-shadow:0 3px 26px rgba(10,4,2,.85)'>{ti['script']}</div></div>")
hero = ti['hero']
for k in range(len(hero)):
    sp = ''.join(f"<span style='{'' if j == k else 'visibility:hidden'}'>{c}</span>" for j, c in enumerate(hero))
    ov[f'th{k}'] = (f"<div style='position:absolute;top:{top+225}px;width:100%;font:400 250px/1 Rm;color:{CREAM};letter-spacing:-.02em;"
                    f"text-shadow:6px 6px 0 {ACC},0 10px 44px rgba(10,4,2,.75)'>{sp}</div>")
ov['tsub'] = f"<div style='position:absolute;top:{top+520}px;width:100%;{SHD};font:500 40px/1.3 Sg;padding:0 90px;box-sizing:border-box'>{ti['sub']}</div>"
CNT = ['1', '2', '3', '4!']
for k in range(4):
    sp = ' &nbsp;·&nbsp; '.join(f"<span style='{'' if j == k else 'visibility:hidden'}'>{c}</span>" for j, c in enumerate(CNT))
    ov[f'tc{k}'] = f"<div style='position:absolute;top:{top+660}px;width:100%;font:400 58px Pm;color:{ACC};{SHD}'>{sp}</div>"
for i, f in enumerate(P['films']):
    tape, tink = f['tape'], f.get('tink', '#141210')
    fib = "repeating-linear-gradient(90deg,rgba(255,255,255,.10) 0 2px,rgba(0,0,0,.05) 2px 5px),linear-gradient(180deg,rgba(255,255,255,.22),rgba(0,0,0,.10))"
    jag = "polygon(0 4%,2% 0,98% 3%,100% 0,99% 20%,100% 38%,98.6% 55%,100% 74%,98.8% 100%,2% 97%,0 100%,1.2% 78%,0 60%,1.5% 42%,0 24%)"
    ov[f'band{i}'] = (f"<div style='position:absolute;left:0;top:{BY}px;width:100%;height:{BH}px;background:#0D0B0A'></div>"
                      f"<div style='position:absolute;left:0;top:{BY}px;width:100%;height:{BH}px;background:radial-gradient(ellipse 60% 70% at 50% 50%,{f['glow']},rgba(0,0,0,0) 70%)'></div>")
    ov[f'hd{i}'] = (f"<div style='position:absolute;top:{BY+42}px;width:100%;font:600 23px Sg;letter-spacing:.46em;padding-left:.46em;color:{f['acc']}'>"
                    f"TRACK 0{i+1} &nbsp;/&nbsp; 05 &nbsp;·&nbsp; THE SETLIST</div>")
    ov[f'tape{i}'] = (f"<div style='position:absolute;top:{BY+96}px;width:100%;display:flex;justify-content:center'>"
                      f"<div style='transform:rotate({f.get('rot',-1.6)}deg);filter:drop-shadow(0 8px 14px rgba(0,0,0,.55))'>"
                      f"<div style='background:{fib},{tape};clip-path:{jag};padding:22px 58px 26px;font:400 {f.get('fs',96)}px/1 Pm;color:{tink};white-space:nowrap'>{f['t']}</div></div></div>")
    ov[f'ln{i}'] = (f"<div style='position:absolute;top:{BY+300}px;width:100%;font:500 32px Sg;letter-spacing:.14em;padding-left:.14em;color:{CREAM}'>"
                    f"{f['yr']} <span style='color:{f['acc']}'>&nbsp;|&nbsp;</span> {f['where']}</div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(120);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

n = [0]
def piece(img, dur, x=50, y=50, mv=1, amp=110, z=1.08, w=W, h=H, flash=False):
    n[0] += 1; out = f'{T}/c{n[0]}.mp4'
    im = Image.open(f'{D}/{img}'); s = max(h * z / im.height, w * 1.08 / im.width)
    W2 = int(im.width * s) // 2 * 2; H2 = int(im.height * s) // 2 * 2
    span = W2 - w; cx = span * x / 100; cy = (H2 - h) * y / 100
    a = max(0, min(span, cx - amp / 2 * mv)); b = max(0, min(span, cx + amp / 2 * mv))
    fl = ",fade=in:st=0:d=0.1:color=white" if flash else ""
    vf = f"scale={W2}:{H2}:flags=lanczos,crop={w}:{h}:'{a}+({b}-{a})*t/{dur}':{cy:.0f},fps={FPS},setsar=1{fl},eq=saturation=1.06:contrast=1.04,format=yuv420p"
    sh(f"ffmpeg -v error -y -loop 1 -framerate {FPS} -i {D}/{img} -vf \"{vf}\" -t {dur} -c:v libx264 -preset veryfast -crf 15 {out}")
    return out
segs = []
for k, b in enumerate(P['burst']):
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40, flash=(k % 2 == 0)))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
nh = len(hero)
ins = f"-i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png " + \
      ''.join(f"-loop 1 -i {T}/th{k}.png " for k in range(nh)) + f"-loop 1 -i {T}/tsub.png " + ''.join(f"-loop 1 -i {T}/tc{k}.png " for k in range(4))
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-90*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.2:alpha=1[r];[b][r]overlay=x='-max(0,90-420*(t-0.25))':y=0[h0];")
prev = 'h0'
for k in range(nh):
    st = 0.55 + 0.16 * k
    fc += f"[{4+k}]format=rgba,fade=in:st={st}:d=0.06:alpha=1[l{k}];[{prev}][l{k}]overlay=x=0:y='-max(0,70-700*(t-{st}))':enable='gte(t,{st})'[h{k+1}];"; prev = f'h{k+1}'
fc += f"[{4+nh}]format=rgba,fade=in:st=1.3:d=0.35:alpha=1[u];[{prev}][u]overlay=x=0:y='max(0,26-80*(t-1.3))'[v0];"; prev = 'v0'
for k in range(4):
    st = 1.75 + 0.3 * k
    fc += f"[{5+nh+k}]format=rgba[q{k}];[{prev}][q{k}]overlay=0:0:enable='gte(t,{st})'[w{k}];"; prev = f'w{k}'
fc += f"[{prev}]format=yuv420p"
open(f'{T}/fct.txt', 'w').write(fc)
sh(f"ffmpeg -v error -y {ins} -filter_complex_script {T}/fct.txt -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.3)
SPL = [[1.0, 1.15], [1.2, 0.95], [0.85, 1.2]]
for i, f in enumerate(P['films']):
    pv = []
    for p in range(3):
        y0, h = STR[p]
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]
        cs = [piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (p + q + i) % 2 else -1, amp=70, w=W, h=h, flash=q > 0)
              for q, it in enumerate(f['strips'][p])]
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    # inputs: 0-2 strips, 3 band, 4 head, 5 tape, 6 line
    fc = f"color=c=0x0D0B0A:s={W}x{H}:d={SEG}:r={FPS}[bg0];[3]format=rgba[bd];[bg0][bd]overlay=0:0[b0];"
    prev = 'b0'
    for p in range(3):
        y0, h = STR[p]; st = [0.0, 0.08, 0.16][p]; sg = [-1, 1, -1][p]
        xo = f"({sg})*1100*max(0,1-(t-{st})/0.3)*max(0,1-(t-{st})/0.3)"
        fc += f"[{p}]setpts=PTS-STARTPTS[r{p}];[{prev}][r{p}]overlay=x='{xo}':y={y0}:enable='gte(t,{st})'[o{p}];"; prev = f'o{p}'
    fc += (f"[4]format=rgba,fade=in:st=0.1:d=0.25:alpha=1[hd];[{prev}][hd]overlay=0:0[m1];"
           f"[5]format=rgba,fade=in:st=0.28:d=0.05:alpha=1[tp];[m1][tp]overlay=x=0:y='-max(0,40-500*(t-0.28))':enable='gte(t,0.28)'[m2];"
           f"[6]format=rgba,fade=in:st=0.5:d=0.3:alpha=1[ln];[m2][ln]overlay=x=0:y='max(0,20-70*(t-0.5))'[m3];[m3]format=yuv420p")
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv[0]} -i {pv[1]} -i {pv[2]} -loop 1 -i {T}/band{i}.png -loop 1 -i {T}/hd{i}.png -loop 1 -i {T}/tape{i}.png -loop 1 -i {T}/ln{i}.png "
       f"-filter_complex_script {T}/fc{i}.txt -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4")
    segs.append(f'{T}/film{i}.mp4')
# end card: framed phone on blurred still, no text
bgi = Image.open(f"{D}/{P['end_bg']}").convert('RGB'); s = max(W / bgi.width, H / bgi.height)
bgi = bgi.resize((int(bgi.width * s) + 1, int(bgi.height * s) + 1), Image.LANCZOS)
ex = int((bgi.width - W) * P.get('end_x', 50) / 100)
bgi = bgi.crop((ex, (bgi.height - H) // 2, ex + W, (bgi.height - H) // 2 + H))
bg = ImageEnhance.Brightness(bgi.filter(ImageFilter.GaussianBlur(38))).enhance(0.7)
ph = Image.open(f"{D}/{P['phone']}").convert('RGBA'); ph = ph.crop(ph.getbbox()); ph = ph.resize((int(ph.width * 1600 / ph.height), 1600), Image.LANCZOS)
mk = Image.new('L', (W, H), 0)
ImageDraw.Draw(mk).rounded_rectangle([(W - ph.width) // 2 + 20, (H - 1600) // 2 + 40, (W + ph.width) // 2 - 20, (H + 1600) // 2 + 30], 120, fill=150)
mk = mk.filter(ImageFilter.GaussianBlur(40)); bg = Image.composite(Image.new('RGB', (W, H), (14, 6, 4)), bg, mk)
bg.paste(ph, ((W - ph.width) // 2, (H - 1600) // 2), ph); bg.save(f'{T}/end.png'); bg.save(f'{D}/endcard.jpg', quality=93)
ED = P.get('end_dur', 3.2); nf = int(ED * FPS)
sh(f"ffmpeg -v error -y -loop 1 -i {T}/end.png -vf \"scale={W*2}:-1,zoompan=z='1.0+0.0011*on':x='(iw-iw/zoom)/2':y='(ih-ih/zoom)/2':d={nf}:s={W}x{H}:fps={FPS},fade=in:st=0:d=0.25,format=yuv420p\" -frames:v {nf} -c:v libx264 -preset veryfast -crf 15 {T}/endv.mp4")
segs.append(f'{T}/endv.mp4')
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]colorbalance=rs=.02:bs=-.02,noise=alls=7:allf=t,vignette=PI/8,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
