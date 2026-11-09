"""REWIND STRIPS (time-bending) stills video. Usage: python3 timevid.py WORKDIR (reads plan.json -> video.mp4)
Burst -> full-screen drifting title (JetBrains Mono kicker, signal-red Instrument Serif italic 'bend', giant Syne 800
TIME with a mirrored 'inverted' ghost, italic sub, mono tag) -> per film: THREE 1080x540 strips stacked edge to edge
(two on top, one at the bottom) sliding in from alternating sides and jump-cutting drifting stills at staggered times;
between them a black band with '◀◀ LOOP 0N / 05', a running-backwards red timecode, Syne title, red mono
'year | where' and an italic line -> framed app phone end card on blurred still."""
import json, os, subprocess, sys
from PIL import Image, ImageFilter, ImageDraw, ImageEnhance
D = os.path.abspath(sys.argv[1]); P = json.load(open(f'{D}/plan.json'))
T = f'{D}/_t'; os.makedirs(T, exist_ok=True)
W, H, FPS = 1080, 1920, 30
ENGINE = os.path.dirname(os.path.abspath(__file__))
INK = P.get('ink', '#FF4433'); WHITE = '#F3EFE8'
SY = [0, 540, 1380]; SH_ = 540; BAND = (1080, 1380)
def sh(c): subprocess.run(c, shell=True, check=True)
F = os.path.join(ENGINE, 'node_modules/@fontsource') + '/'
def ff(fam, pkg, w, st='normal'): return f"@font-face{{font-family:'{fam}';font-weight:{w};font-style:{st};src:url(file://{F}{pkg}/files/{pkg}-latin-{w}-{st}.woff2)}}"
CSS = ff('Sy', 'syne', 800) + ff('Sy', 'syne', 700) + ff('Is', 'instrument-serif', 400, 'italic') + ff('Is', 'instrument-serif', 400) + \
      ff('Mo', 'jetbrains-mono', 500) + ff('Mo', 'jetbrains-mono', 700) + \
      f"*{{margin:0;padding:0}}body{{width:{W}px;height:{H}px;background:transparent;color:{WHITE};text-align:center}}"
SHD = "text-shadow:0 2px 22px rgba(0,0,0,.75)"
REW = "<span style=\"font-family:'DejaVu Sans';letter-spacing:-.12em\">◀◀</span>"
ov = {}
ti = P['title']; top = ti.get('top', 210)
ov['tshade'] = "<div style='position:absolute;top:0;left:0;width:100%;height:1350px;background:linear-gradient(180deg,rgba(6,6,9,.88),rgba(6,6,9,.6) 60%,rgba(6,6,9,0))'></div>"
ov['tkick'] = f"<div style='position:absolute;top:{top}px;width:100%;{SHD};font:700 30px Mo;letter-spacing:.55em;padding-left:.55em'>{ti['kick']}</div>"
ov['tscript'] = f"<div style='position:absolute;top:{top+40}px;width:100%;{SHD};font:italic 400 230px/1 Is;color:{INK}'>{ti['script']}</div>"
ov['thero'] = f"<div style='position:absolute;top:{top+250}px;width:100%;font:800 212px/1 Sy;letter-spacing:.02em;{SHD}'>{ti['hero']}</div>"
ov['tghost'] = (f"<div style='position:absolute;top:{top+478}px;width:100%;font:800 212px/1 Sy;letter-spacing:.02em;transform:scaleY(-1);"
                f"opacity:.32;-webkit-mask-image:linear-gradient(0deg,#000 0%,transparent 55%);color:{INK}'>{ti['hero']}</div>")
ov['tsub'] = (f"<div style='position:absolute;top:{top+640}px;width:100%;{SHD}'><div style='font:italic 400 60px/1.12 Is'>{ti['sub']}</div>"
              f"<div style='font:700 25px Mo;letter-spacing:.42em;padding-left:.42em;margin-top:34px;color:{INK}'>{REW}&nbsp; {ti['tag']}</div></div>")
seams = "".join(f"<div style='position:absolute;left:0;top:{y-2}px;width:100%;height:4px;background:#050507'></div>" for y in (540,))
for i, f in enumerate(P['films']):
    b0, b1 = BAND
    band = (f"<div style='position:absolute;left:0;top:{b0}px;width:100%;height:{b1-b0}px;background:#08080B'></div>"
            f"<div style='position:absolute;left:0;top:{b0}px;width:100%;height:3px;background:{INK}'></div>"
            f"<div style='position:absolute;left:0;top:{b1-3}px;width:100%;height:3px;background:{INK}'></div>{seams}")
    ov[f'b{i}'] = band
    ov[f'k{i}'] = f"<div style='position:absolute;top:{b0+26}px;left:48px;font:700 24px Mo;letter-spacing:.32em;color:{INK};text-align:left'>{REW}&nbsp; LOOP 0{i+1} / 05</div>"
    ov[f't{i}'] = (f"<div style='position:absolute;top:{b0+66}px;width:100%;height:110px;display:flex;align-items:center;justify-content:center;white-space:nowrap'>"
                   f"<div style='font:800 {f.get('fs',88)}px/1 Sy;letter-spacing:.01em'>{f['t']}</div></div>")
    ov[f'l{i}'] = (f"<div style='position:absolute;top:{b0+184}px;width:100%'><div style='font:700 25px Mo;letter-spacing:.3em;padding-left:.3em;color:{INK}'>"
                   f"{f['yr']} &nbsp;|&nbsp; {f['where'].upper()}</div><div style='font:italic 400 40px/1.1 Is;margin-top:16px;color:#E6E0D6'>{f['line']}</div></div>")
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
    segs.append(piece(b[0], P.get('flash', 0.2), x=b[1], mv=1 if k % 2 else -1, amp=40))
tc = [piece(c[0], c[2], x=c[1], mv=1 if k % 2 == 0 else -1, amp=130, flash=(k == 0)) for k, c in enumerate(ti['shots'])]
tdur = round(sum(c[2] for c in ti['shots']), 3)
open(f'{T}/tl.txt', 'w').write(''.join(f"file '{c}'\n" for c in tc))
sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/tl.txt -c copy {T}/tbg.mp4")
fc = (f"[1]format=rgba[s];[0][s]overlay=0:0[a];"
      f"[2]format=rgba,fade=in:st=0.05:d=0.3:alpha=1[k];[a][k]overlay=x=0:y='max(0,24-80*t)'[b];"
      f"[3]format=rgba,fade=in:st=0.25:d=0.4:alpha=1[r];[b][r]overlay=x='min(0,-70+170*(t-0.25))':y=0[c];"
      f"[4]format=rgba,fade=in:st=0.45:d=0.4:alpha=1[h];[c][h]overlay=x=0:y='max(0,40-110*(t-0.45))'[d];"
      f"[5]format=rgba,fade=in:st=0.75:d=0.5:alpha=1[g];[d][g]overlay=x=0:y='min(0,-40+110*(t-0.75))'[e];"
      f"[6]format=rgba,fade=in:st=1.0:d=0.45:alpha=1[u];[e][u]overlay=x=0:y='max(0,30-90*(t-1.0))',format=yuv420p")
sh(f"ffmpeg -v error -y -i {T}/tbg.mp4 -loop 1 -i {T}/tshade.png -loop 1 -i {T}/tkick.png -loop 1 -i {T}/tscript.png -loop 1 -i {T}/thero.png -loop 1 -i {T}/tghost.png -loop 1 -i {T}/tsub.png "
   f"-filter_complex \"{fc}\" -t {tdur} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/title.mp4")
segs.append(f'{T}/title.mp4')
SEG = P.get('seg', 3.4)
SPL = [[1.0, 1.1], [1.25, 1.0], [0.85, 1.2]]
ORDER = [[0, 3, 6], [1, 4, 0], [2, 5, 1]]
TTF = f'{D}/jbm600.ttf'
for i, f in enumerate(P['films']):
    imgs = f['imgs']; pv = []
    for p in range(3):
        d = SPL[p] + [round(SEG - sum(SPL[p]), 3)]
        cs = []
        for q in range(3):
            it = imgs[ORDER[p][q]]
            cs.append(piece(it[0], d[q], x=it[1], y=it[2], mv=1 if (p + q + i) % 2 else -1, amp=80, w=W, h=SH_, flash=True))
        open(f'{T}/q{i}{p}.txt', 'w').write(''.join(f"file '{c}'\n" for c in cs))
        sh(f"ffmpeg -v error -y -f concat -safe 0 -i {T}/q{i}{p}.txt -c copy {T}/q{i}{p}.mp4"); pv.append(f'{T}/q{i}{p}.mp4')
    tcode = (f"drawtext=fontfile={TTF}:fontsize=24:fontcolor={INK.replace('#','0x')}:x=w-tw-48:y={BAND[0]+26}:"
             f"text='00\\:0{5-i}\\:%{{eif\\:trunc(59.99-t*7)\\:d\\:2}}\\:%{{eif\\:mod(trunc((59.99-t*7)*24)\\,24)\\:d\\:2}}'")
    fc = f"color=c=0x050507:s={W}x{H}:d={SEG}:r={FPS}[bg];[3]format=rgba,split[bd][bd2];[bg][bd]overlay=0:0[b0];"
    prev = 'b0'
    for p in range(3):
        st = 0.1 * p; dirn = -1 if (p + i) % 2 == 0 else 1
        xo = f"{dirn}*{W}*max(0,1-(t-{st})/0.3)*max(0,1-(t-{st})/0.3)"
        fc += f"[{p}]setpts=PTS-STARTPTS[v{p}];[{prev}][v{p}]overlay=x='{xo}':y={SY[p]}:enable='gte(t,{st})'[o{p}];"; prev = f'o{p}'
    fc += (f"[bd2]crop={W}:6:0:537[sm];[{prev}][sm]overlay=0:537[l0];"
           f"[4]format=rgba,fade=in:st=0.05:d=0.25:alpha=1[k];[l0][k]overlay=x='min(0,-50+200*t)':y=0[l1];"
           f"[5]format=rgba,fade=in:st=0.15:d=0.35:alpha=1[t];[l1][t]overlay=x=0:y='max(0,26-90*(t-0.15))'[l2];"
           f"[6]format=rgba,fade=in:st=0.4:d=0.35:alpha=1[l];[l2][l]overlay=x=0:y='max(0,22-80*(t-0.4))',{tcode},format=yuv420p")
    open(f'{T}/fc{i}.txt', 'w').write(fc)
    sh(f"ffmpeg -v error -y -i {pv[0]} -i {pv[1]} -i {pv[2]} -loop 1 -i {T}/b{i}.png "
       f"-loop 1 -i {T}/k{i}.png -loop 1 -i {T}/t{i}.png -loop 1 -i {T}/l{i}.png -filter_complex_script {T}/fc{i}.txt -t {SEG} -r {FPS} -c:v libx264 -preset veryfast -crf 15 {T}/film{i}.mp4".replace('[3]format=rgba[bd]', '[3]format=rgba[bd]'))
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
fc += "[v]eq=saturation=1.04:contrast=1.05,colorbalance=rs=-0.01:bs=0.012:rh=0.012:bh=-0.006,noise=alls=6:allf=t,vignette=PI/6,format=yuv420p[out]"
sh(f"ffmpeg -v error -y {inp} -filter_complex \"{fc}\" -map [out] -r {FPS} -c:v libx264 -preset slow -crf 18 -pix_fmt yuv420p -movflags +faststart {D}/video.mp4")
print('done', subprocess.check_output(f"ffprobe -v error -show_entries format=duration -of csv=p=0 {D}/video.mp4", shell=True).decode())
