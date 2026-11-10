"""SCOREBOARD (underdog sports) stills video. Usage: python3 cheervid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (Oswald spaced kicker, gold Yellowtail 'cheer for the' tilted, giant cream
Graduate collegiate UNDERDOG with two-layer varsity block shadow, Cormorant italic sub, Oswald tag) -> per film:
a vintage stadium SCOREBOARD across the top (deep green louvred panel, glowing bulb rows, gold frame;
'★ GAME 0N / 05 ★', Graduate title, gold Oswald 'year | where', Cormorant italic line) above THREE strips stacked
edge to edge that rise up from the bottom staggered, each jump-cutting drifting stills with a white flashbulb pop;
bulb rows chase (blink) -> framed app phone end card on blurred still, no text."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#F4B63F'); CREAM = '#F6EEDC'; GREEN = '#0C1F17'
BANDH = 560; SY = [560, 1014, 1466]; SHS = [454, 452, 454]
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Gr', 'graduate', 400) + ff('Yt', 'yellowtail', 400) + ff('Os', 'oswald', 500) + ff('Os', 'oswald', 600) + \
      ff('Cg', 'cormorant-garamond', 500, 'italic') + ff('Cg', 'cormorant-garamond', 600, 'italic') + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{CREAM};text-align:center}}"
SHD = "text-shadow:0 2px 24px rgba(0,0,0,.8)"
def bulbs(y, on):
    c1 = '#FFD98A' if on else '#6B4E1E'; g = 'rgba(255,196,90,.45)' if on else 'rgba(0,0,0,0)'
    return (f"<div style='position:absolute;left:0;top:{y}px;width:100%;height:20px;"
            f"background:radial-gradient(circle,{c1} 0 4px,{g} 5px,transparent 9px) 0 0/30px 20px'></div>")
ov = {}
ti = P['title']; top = ti.get('top', 230)
ov['tshade'] = f"<div style='position:absolute;top:0;left:0;width:100%;height:1400px;background:linear-gradient(180deg,rgba(8,20,14,.9),rgba(8,20,14,.62) 58%,rgba(8,20,14,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:600 32px Os;letter-spacing:.55em;padding-left:.55em'>{ti['kick']}</div>"
ov['tscript'] = (f"<div style='position:absolute;top:{top+70}px;width:100%;{SHD}'><div style='display:inline-block;transform:rotate(-6deg);"
                 f"font:400 150px/1 Yt;color:{INK}'>{ti['script']}</div></div>")
ov['thero'] = (f"<div style='position:absolute;top:{top+270}px;width:100%;font:400 {ti.get('fs',150)}px/1 Gr;letter-spacing:.01em;color:{CREAM};"
               f"text-shadow:6px 6px 0 {INK},12px 12px 0 {GREEN},0 10px 40px rgba(0,0,0,.6)'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+480}px;width:100%;{SHD}'><div style='font:italic 500 62px/1.12 Cg'>{ti['sub']}</div>"
              f"<div style='font:600 26px Os;letter-spacing:.42em;padding-left:.42em;margin-top:34px;color:{INK}'>★&nbsp; {ti['tag']} &nbsp;★</div></div>")
louvre = "repeating-linear-gradient(180deg,rgba(255,255,255,.025) 0 2px,rgba(0,0,0,0) 2px 7px)"
for i, f in enumerate(P['films']):
    for on in (0, 1):
        ov[f'b{i}{on}'] = (f"<div style='position:absolute;left:0;top:0;width:100%;height:{BANDH}px;background:{louvre},radial-gradient(ellipse at 50% 45%,#16352A,{GREEN} 70%)'></div>"
                           + bulbs(14, on) + bulbs(BANDH - 44, 1 - on) +
                           f"<div style='position:absolute;left:38px;top:46px;width:{W-76-6}px;height:{BANDH-104-6}px;border:3px solid {INK};border-radius:8px;box-shadow:0 0 18px rgba(244,182,63,.25) inset'></div>"
                           f"<div style='position:absolute;left:0;top:{BANDH-4}px;width:100%;height:4px;background:{INK}'></div>"
                           f"<div style='position:absolute;left:0;top:{SY[1]-2}px;width:100%;height:4px;background:{GREEN}'></div>"
                           f"<div style='position:absolute;left:0;top:{SY[2]-2}px;width:100%;height:4px;background:{GREEN}'></div>")
    ov[f'k{i}'] = f"<div style='position:absolute;top:78px;width:100%;font:600 27px Os;letter-spacing:.5em;padding-left:.5em;color:{INK}'>★&nbsp; GAME 0{i+1} / 05 &nbsp;★</div>"
    ov[f't{i}'] = (f"<div style='position:absolute;top:128px;width:100%;height:214px;display:flex;align-items:center;justify-content:center'>"
                   f"<div style='font:400 {f.get('fs',84)}px/1.04 Gr;color:{CREAM};text-shadow:4px 4px 0 rgba(0,0,0,.55)'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:356px;width:100%'><div style='font:500 29px Os;letter-spacing:.32em;padding-left:.32em;color:{INK}'>"
                   f"{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div style='font:italic 500 41px/1.12 Cg;margin-top:14px;color:#EDE4D0'>{f['line']}</div></div>")
pages = {k: f"<html><head><style>{CSS}</style></head><body>{v}</body></html>" for k, v in ov.items()}
js = ("const {chromium}=require('playwright');const fs=require('fs');(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:%d,height:%d}});"
      "const O=%s;for(const k of Object.keys(O)){fs.writeFileSync('%s/_o.html',O[k]);await p.goto('file://%s/_o.html');await p.evaluate(()=>document.fonts.ready);"
      "await p.waitForTimeout(150);await p.screenshot({path:'%s/'+k+'.png',omitBackground:true});}await b.close();})();") % (W, H, json.dumps(pages), T, T, T)
open(f'{T}/ov.js', 'w').write(js); sh(f'cd {ENGINE} && node {T}/ov.js')

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
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40, flash=(k % 2 == 0)))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.3:d=0.4:alpha=1[r];[b][r]overlay=x='min(0,-80+190*(t-0.3))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.55:d=0.3:alpha=1[h];[c][h]overlay=x=0:y='max(0,90-300*(t-0.55))'[d];"
      f"[5]format=rgba,fade=in:st=0.95:d=0.45:alpha=1[u];[d][u]overlay=x=0:y='max(0,30-90*(t-0.95))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4)
SPL = [[1.0, 1.1], [1.25, 1.0], [0.85, 1.2]]
ORDER = [[0, 3, 6], [1, 4, 7], [2, 5, 8]]
for i, f in enumerate(P['films']):
    imgs = f['imgs']; pv = []
    for p in range(3):
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]
        cs = []
        for q in range(3):
            it = imgs[ORDER[p][q] % len(imgs)]
            cs.append(piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (p + q + i) % 2 else -1, amp=80, w=W, h=SHS[p], flash=True))
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    fc = f"color=c=0x0C1F17:s={W}x{H}:d={SEG}:r={FPS}[bg];[3]format=rgba[bA];[4]format=rgba[bB];[bg][bA]overlay=0:0[b0];[b0][bB]overlay=0:0:enable='lt(mod(t,0.5),0.25)'[b1];"
    prev = 'b1'
    for p in range(3):
        st = 0.08 * p; hh = H - SY[p]
        yo = f"{SY[p]}+{hh}*max(0,1-(t-{st})/0.32)*max(0,1-(t-{st})/0.32)"
        fc += f"[{p}]setpts=PTS-STARTPTS[v{p}];[{prev}][v{p}]overlay=x=0:y='{yo}':enable='gte(t,{st})'[o{p}];"; prev = f'o{p}'
    fc += (f"[3]format=rgba,crop={W}:8:0:{SY[1]-4}[s1];[{prev}][s1]overlay=0:{SY[1]-4}:enable='gte(t,0.45)'[m1];"
           f"[4]format=rgba,crop={W}:8:0:{SY[2]-4}[s2];[m1][s2]overlay=0:{SY[2]-4}:enable='gte(t,0.5)'[m2];"
           f"[5]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[m2][k]overlay=x=0:y='max(0,20-80*t)'[l1];"
           f"[6]format=rgba,fade=in:st=0.15:d=0.3:alpha=1[t];[l1][t]overlay=x=0:y='min(0,-40+140*(t-0.15))'[l2];"
           f"[7]format=rgba,fade=in:st=0.4:d=0.35:alpha=1[l];[l2][l]overlay=x=0:y='max(0,22-80*(t-0.4))',format=yuv420p")
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv[0]} -i {pv[1]} -i {pv[2]} -loop 1 -i {T}/b{i}0.png -loop 1 -i {T}/b{i}1.png "
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
inp = ' '.join(f'-i {s}' for s in segs)
fc = ''.join(f'[{k}]setsar=1,fps={FPS},format=yuv420p[s{k}];' for k in range(len(segs))) + ''.join(f'[s{k}]' for k in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[v];"
fc += "[v]eq=saturation=1.05:contrast=1.05,colorbalance=rs=0.015:bs=-0.012:rh=0.015:bh=-0.01,noise=alls=7:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
